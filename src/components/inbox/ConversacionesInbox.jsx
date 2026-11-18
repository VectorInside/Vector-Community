'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Phone,
  Building,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertCircle,
  Check,
  Plus,
  Mic,
  Play,
  Pause,
  Paperclip,
  CheckCheck,
  RefreshCw,
  Volume2,
  VolumeX,
  Settings,
  Activity,
  ExternalLink,
  Trash2,
  FileText,
  Image as ImageIcon,
  FileCheck,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { PreCitaDrawer } from '@/components/hitl/PreCitaDrawer';
import { formatNumber } from '@/utils/formatters';
import { MeasurementGuideModal } from '@/components/common/MeasurementGuideModal';
import { leadService } from '@/services/leadService';
import { calendarService } from '@/services/calendarService';
import api, { unwrapApiData } from '@/services/api';
import { WhatsAppConnectModal } from './WhatsAppConnectModal';
import { getDynamicCriteriaLabels } from '@/utils/businessVerticals';
import { LEAD_STATUS_ENUM } from '@/utils/constants';

// =========================================================================
// CANONICAL OMNICHANNEL INBOX BY TENANT (ADR-001, ADR-002, ADR-011)
// =========================================================================

const CHANNEL_BADGES = {
  WhatsApp: {
    badge: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10',
    dot: 'bg-emerald-500',
    iconName: 'WhatsApp',
  },
  'Instagram DM': {
    badge: 'border-pink-500/30 text-pink-700 dark:text-pink-400 bg-pink-500/10',
    dot: 'bg-pink-500',
    iconName: 'Instagram',
  },
  Facebook: {
    badge: 'border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/10',
    dot: 'bg-blue-500',
    iconName: 'Facebook',
  },
  'Web Chat': {
    badge: 'border-cyan-500/30 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10',
    dot: 'bg-cyan-500',
    iconName: 'Web',
  },
};

const QUAL_KEY_BY_CRITERION = {
  identityValidated: 'contactValid',
  catalogIdentified: 'productIdentified',
  financialClarified: 'doubtsResolved',
  consentOrBooked: 'ctaAccepted',
};

export const ConversacionesInbox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeTenant, triggerModal, updateTenantPolicy } = useAuth();
  const tenantKey = activeTenant?.id || null;

  // Estado del modal de conexión WhatsApp Cloud API
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isWaBannerDismissed, setIsWaBannerDismissed] = useState(false);

  // Directriz de modo de respuesta del Bot ('text_only' | 'mirror' | 'text_and_audio')
  const [botAudioMode, setBotAudioMode] = useState(
    activeTenant?.botAudioMode || 'text_only'
  );

  // Detección verídica del estado de conexión de WhatsApp
  const waConfig = activeTenant?.connectedChannels?.whatsapp;
  const isWhatsAppConfigured = Boolean(
    waConfig?.enabled && (waConfig?.phoneNumberId || activeTenant?.whatsappNumberId)
  );
  const waPhoneNumber = waConfig?.displayPhoneNumber || activeTenant?.phone || 'Sin número asignado';
  const waLastSync = waConfig?.lastSync || 'En espera de primer mensaje';

  // Read URL query parameter for direct jump from notification
  const targetThreadId = searchParams.get('threadId');

  // Load threads partitioned by tenant from real backend /api/v1/leads
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'pending' | 'attended'
  const [channelFilter, setChannelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftReply, setDraftReply] = useState('');
  const [isPreCitaDrawerOpen, setIsPreCitaDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [isTogglingAiPause, setIsTogglingAiPause] = useState(false);
  const replyInputRef = useRef(null);

  const dynamicCriteria = useMemo(
    () => getDynamicCriteriaLabels(activeTenant),
    [activeTenant]
  );

  // Actualizar modo de respuesta y persistir en la directriz del Tenant
  const handleUpdateBotAudioMode = async (mode) => {
    setBotAudioMode(mode);
    if (updateTenantPolicy && activeTenant?.id) {
      await updateTenantPolicy(activeTenant.id, { botAudioMode: mode });
    }
  };

  // Motor de Síntesis de Voz Real (Web Speech API) en Español Latino/Mexicano
  const playSpeechReal = (text, msgId) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (triggerModal) {
        triggerModal(
          'Audio No Soportado',
          'Tu navegador no cuenta con soporte nativo de síntesis de voz (Web Speech API).'
        );
      }
      return;
    }

    if (playingAudioId === msgId) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const esVoice =
      voices.find((v) => v.lang === 'es-MX') ||
      voices.find((v) => v.lang.startsWith('es-US')) ||
      voices.find((v) => v.lang.startsWith('es')) ||
      voices[0];

    if (esVoice) utterance.voice = esVoice;
    utterance.lang = esVoice ? esVoice.lang : 'es-MX';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setPlayingAudioId(msgId);
    utterance.onend = () => setPlayingAudioId(null);
    utterance.onerror = () => setPlayingAudioId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Limpiar hilo específico
  const handleRemoveThread = (threadIdToRemove) => {
    if (playingAudioId) {
      window.speechSynthesis?.cancel();
      setPlayingAudioId(null);
    }
    setThreads((prev) => {
      const remaining = prev.filter((t) => t.id !== threadIdToRemove);
      if (selectedThreadId === threadIdToRemove) {
        setSelectedThreadId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  // Limpiar todas las conversaciones demo o recargar reales
  const handleClearAllDemos = () => {
    if (playingAudioId) {
      window.speechSynthesis?.cancel();
      setPlayingAudioId(null);
    }
    setThreads((prev) => {
      const remaining = prev.filter((t) => !t.isDemo && !t.id?.startsWith('demo-'));
      if (selectedThreadId && !remaining.some((t) => t.id === selectedThreadId)) {
        setSelectedThreadId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  // Guardar credenciales reales en AuthContext y localStorage
  const handleSaveWhatsAppCredentials = async (credentials) => {
    if (updateTenantPolicy && activeTenant?.id) {
      const existingChannels = activeTenant?.connectedChannels || {};
      await updateTenantPolicy(activeTenant.id, {
        connectedChannels: {
          ...existingChannels,
          whatsapp: credentials,
        },
        whatsappNumberId: credentials.phoneNumberId,
      });
    }
  };

  // Synchronize when activeTenant changes
  useEffect(() => {
    const tenantId = activeTenant?.id;
    if (!tenantId) {
      setThreads([]);
      setSelectedThreadId(null);
      return;
    }

    setIsLoading(true);

    Promise.allSettled([
      leadService.getLeadsByTenant(tenantId),
      api
        .get(`/webhooks/whatsapp/conversations/${tenantId}`)
        .then((res) => unwrapApiData(res))
        .catch(() => null),
    ])
      .then(([leadsRes, convsRes]) => {
        const backendLeads = leadsRes.status === 'fulfilled' && Array.isArray(leadsRes.value) ? leadsRes.value : [];
        const rawConvs = convsRes.status === 'fulfilled' && convsRes.value
          ? (Array.isArray(convsRes.value) ? convsRes.value : convsRes.value?.data || [])
          : [];

        // Hilos canónicos desde base de datos de mensajería (Meta Cloud API)
        const convThreads = Array.isArray(rawConvs)
          ? rawConvs.map((c) => {
              const audit = c.criteriaAudit || {};
              const qual = {
                contactValid: Boolean(audit.identityValidated ?? c.qualification?.contactValid),
                productIdentified: Boolean(audit.catalogIdentified ?? c.qualification?.productIdentified),
                doubtsResolved: Boolean(audit.financialClarified ?? c.qualification?.doubtsResolved),
                ctaAccepted: Boolean(audit.consentOrBooked ?? c.qualification?.ctaAccepted),
              };
              const allQualified = Object.values(qual).every(Boolean);
              return {
                id: c.id,
                conversationId: c.id,
                leadId: c.leadId,
                aiPaused: Boolean(c.aiPaused),
                name: c.contactName || 'Contacto WhatsApp',
                email: c.contactEmail || c.email || '',
                company: 'Inbound WhatsApp Oficial',
                channel: 'WhatsApp',
                phone: c.externalSenderId || '',
                need: c.lastMessageText || 'Conversación WhatsApp Cloud API',
                campaign: 'Meta Cloud API v21.0',
                date: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : 'Reciente',
                contacted: true,
                owner: 'Lobo Vectorial (Agencia)',
                leadState:
                  c.leadState ||
                  (allQualified ? LEAD_STATUS_ENUM.BILLABLE_LEAD : LEAD_STATUS_ENUM.LEAD_COLD_24H),
                stage: c.status === 'ATTENDED' ? 'Atendido' : allQualified ? 'Calificado' : 'Nuevo',
                slaMinutesRemaining: c.slaMinutesRemaining ?? null,
                potentialTicket: Number(c.estimatedValue || c.potentialTicket || 0),
                qualification: qual,
                messages:
                  Array.isArray(c.messages) && c.messages.length > 0
                    ? c.messages.map((m) => ({
                        id: m.id,
                        direction: m.direction === 'OUTBOUND' ? 'out' : 'in',
                        text: m.content,
                        time: m.sentAt
                          ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Reciente',
                        type: m.messageType || 'text',
                      }))
                    : [
                        {
                          id: `m-${c.id}-1`,
                          direction: 'in',
                          text: c.lastMessageText || 'Hola, deseo informes.',
                          time: 'Reciente',
                        },
                      ],
              };
            })
          : [];

        // Hilos desde leads de CRM
        const mappedLeads = backendLeads
          .filter((lead) => !convThreads.some((ct) => ct.leadId === lead.id || ct.phone === lead.phone))
          .map((lead) => ({
            id: lead.id,
            conversationId: lead.conversationId || lead.id,
            leadId: lead.id,
            aiPaused: Boolean(lead.aiPaused),
            name: lead.name,
            email: lead.email || '',
            company: lead.notes || 'Contacto Directo',
            channel: lead.channel || 'WhatsApp',
            phone: lead.phone || '',
            need: lead.customerNeeds?.intent || lead.notes || 'Consulta Comercial',
            campaign: lead.channel || 'Inbound Directo',
            date: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Reciente',
            contacted: lead.leadState === 'BILLABLE_LEAD',
            owner: 'Lobo Vectorial (Agencia)',
            leadState: lead.leadState || LEAD_STATUS_ENUM.LEAD_COLD_24H,
            stage: lead.status || (lead.leadState === 'BILLABLE_LEAD' ? 'Calificado' : 'Nuevo'),
            slaMinutesRemaining: lead.slaMinutesRemaining ?? null,
            potentialTicket: typeof lead.estimatedValue === 'number' ? lead.estimatedValue : 0,
            qualification: {
              contactValid: Boolean(lead.criteriaAudit?.identityValidated),
              productIdentified: Boolean(lead.criteriaAudit?.catalogIdentified),
              doubtsResolved: Boolean(lead.criteriaAudit?.financialClarified),
              ctaAccepted: Boolean(lead.criteriaAudit?.consentOrBooked),
            },
            messages:
              Array.isArray(lead.messages) && lead.messages.length > 0
                ? lead.messages.map((m, idx) => ({
                    id: m.id || `m-${idx}`,
                    direction: m.isUser ? 'in' : 'out',
                    text: m.text,
                    time: m.time || 'Reciente',
                  }))
                : [
                    {
                      id: `m-${lead.id}-1`,
                      direction: 'in',
                      text: lead.notes || 'Hola, deseo informes sobre sus servicios.',
                      time: 'Reciente',
                    },
                  ],
          }));

        const unifiedThreads = [...convThreads, ...mappedLeads].filter(
          (t) => !t.isDemo && !t.id?.startsWith('demo-')
        );
        setThreads(unifiedThreads);
        if (unifiedThreads.length > 0) {
          setSelectedThreadId((prev) => (prev && unifiedThreads.some((t) => t.id === prev) ? prev : unifiedThreads[0].id));
        } else {
          setSelectedThreadId(null);
        }
      })
      .catch(() => {
        setThreads([]);
        setSelectedThreadId(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeTenant?.id]);

  const persistThreads = (newThreads) => {
    setThreads(newThreads);
  };

  // Active Thread
  const activeThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId) || threads[0],
    [threads, selectedThreadId]
  );

  // Filtered threads list
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      // 1. Status Filter
      if (filterMode === 'pending' && t.contacted) return false;
      if (filterMode === 'attended' && !t.contacted) return false;

      // 2. Channel Filter
      if (channelFilter !== 'all') {
        const chan = t.channel.toLowerCase();
        if (channelFilter === 'whatsapp' && !chan.includes('whatsapp')) return false;
        if (channelFilter === 'instagram' && !chan.includes('instagram')) return false;
        if (channelFilter === 'facebook' && !chan.includes('facebook')) return false;
        if (channelFilter === 'web' && !chan.includes('web')) return false;
      }

      // 3. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.need.toLowerCase().includes(q) ||
          t.phone.includes(q)
        );
      }

      return true;
    });
  }, [threads, filterMode, channelFilter, searchQuery]);

  // Handle Send Reply (Real Cloud API + local state)
  const handleSendReply = async () => {
    if (!draftReply.trim() || !activeThread) return;

    const currentThread = activeThread;
    const replyText = draftReply;

    if (activeTenant?.id) {
      try {
        await api.post(`/webhooks/whatsapp/conversations/${activeTenant.id}/send`, {
          conversationId: currentThread.id,
          recipientPhone: currentThread.phone,
          messageText: replyText.trim(),
        });
      } catch (err) {
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          'No se pudo enviar el mensaje vía WhatsApp Cloud API.';
        if (triggerModal) {
          triggerModal('Error al Enviar Mensaje', errMsg);
        }
        return;
      }
    }

    const newMsg = {
      id: `m-${Date.now()}`,
      direction: 'out',
      text: replyText.trim(),
      time: 'Ahora',
    };

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          contacted: true,
          slaMinutesRemaining: null,
          messages: [...(t.messages || []), newMsg],
        };
      }
      return t;
    });

    persistThreads(updated);
    setDraftReply('');
  };

  // Pausar / Reanudar IA por conversación (Atención Humana)
  const handleToggleAiPause = async () => {
    if (!activeThread || isTogglingAiPause) return;
    const conversationId = activeThread.conversationId || activeThread.id;
    const nextPaused = !Boolean(activeThread.aiPaused);

    setIsTogglingAiPause(true);
    try {
      if (conversationId) {
        await api.patch(`/webhooks/whatsapp/conversations/${conversationId}/ai-pause`, {
          paused: nextPaused,
        });
      }
      persistThreads(
        threads.map((t) =>
          t.id === activeThread.id ? { ...t, aiPaused: nextPaused } : t
        )
      );
      if (triggerModal) {
        triggerModal(
          nextPaused ? 'Pausa Automática de Asistente (Atención Humana)' : 'Asistente IA Reactivado',
          nextPaused
            ? `La IA fue pausada para <b>${activeThread.name}</b>. Ahora tienes control manual directo de esta conversación.`
            : `El asistente IA ha reanudado la atención autónoma para <b>${activeThread.name}</b>.`
        );
      }
    } catch (err) {
      if (triggerModal) {
        triggerModal(
          'Error al Cambiar Estado de IA',
          err?.response?.data?.message ||
            err?.message ||
            'No se pudo actualizar el estado de pausa de IA en el servidor.'
        );
      }
    } finally {
      setIsTogglingAiPause(false);
    }
  };

  // Toggle qualification check
  const handleToggleRequirement = async (key) => {
    if (!activeThread) return;
    const currentThread = activeThread;
    const updatedQual = {
      ...currentThread.qualification,
      [key]: !currentThread.qualification?.[key],
    };
    const nextCriteria = {
      identityValidated: Boolean(updatedQual.contactValid),
      catalogIdentified: Boolean(updatedQual.productIdentified),
      financialClarified: Boolean(updatedQual.doubtsResolved),
      consentOrBooked: Boolean(updatedQual.ctaAccepted),
    };

    try {
      await leadService.updateLeadCriteria(currentThread.leadId || currentThread.id, nextCriteria);
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'No se pudieron guardar los criterios de calificación en PostgreSQL.';
      if (triggerModal) {
        triggerModal('Error al Actualizar Criterios', errMsg);
      }
      return;
    }

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        const allFourTrue = Object.values(updatedQual).every(Boolean);
        return {
          ...t,
          qualification: updatedQual,
          leadState: allFourTrue ? LEAD_STATUS_ENUM.BILLABLE_LEAD : t.leadState,
          stage: allFourTrue ? 'Calificado' : t.stage,
        };
      }
      return t;
    });
    persistThreads(updated);
  };

  // Aprobación real de Pre-Cita desde Bandeja Omnicanal -> Agenda PostgreSQL + Criterios Lead
  const handleApproveDrawerAppointment = async (targetLead) => {
    if (!activeThread) return;
    const todayIso = new Date().toISOString().split('T')[0];
    const appointmentDate = targetLead?.appointmentDate || todayIso;
    let appointmentHour = targetLead?.hour;

    if (!appointmentHour && activeTenant?.id) {
      try {
        const availability = await calendarService.getAvailableSlots(activeTenant.id, appointmentDate);
        appointmentHour = availability?.nextAvailableSlot || availability?.availableSlots?.[0] || '10:00';
      } catch (e) {
        appointmentHour = '10:00';
      }
    }
    appointmentHour = appointmentHour || '10:00';

    await calendarService.createAppointment({
      tenantId: activeTenant?.id,
      clientName: targetLead?.name || activeThread.name || 'Prospecto',
      clientEmail: targetLead?.email || activeThread.email || '',
      phone: targetLead?.phone || activeThread.phone || '',
      serviceName: targetLead?.customerNeeds?.intent || activeThread.need || 'Cita de Valoración',
      estimatedValue: targetLead?.estimatedValue || activeThread.potentialTicket || 0,
      appointmentDate,
      hour: appointmentHour,
      status: 'CONFIRMED',
      details: `Cita aprobada desde Bandeja de Conversaciones (${activeThread.channel || 'WhatsApp'})`,
    });

    const allGuards = {
      identityValidated: true,
      catalogIdentified: true,
      financialClarified: true,
      consentOrBooked: true,
    };
    const targetLeadId = activeThread.leadId || targetLead?.id || activeThread.id;
    if (targetLeadId) {
      await leadService.updateLeadCriteria(targetLeadId, allGuards);
    }

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          email: targetLead?.email || t.email || '',
          contacted: true,
          leadState: LEAD_STATUS_ENUM.BILLABLE_LEAD,
          stage: 'Calificado',
          qualification: {
            contactValid: true,
            productIdentified: true,
            doubtsResolved: true,
            ctaAccepted: true,
          },
          messages: [
            ...(t.messages || []),
            {
              id: `m-${Date.now()}`,
              direction: 'out',
              text: `✅ Cita aprobada (${appointmentDate} • ${appointmentHour} hrs) y guardada en la Agenda PostgreSQL del sistema.`,
              time: 'Ahora',
            },
          ],
        };
      }
      return t;
    });
    persistThreads(updated);

    if (triggerModal) {
      triggerModal(
        'Cita Guardada en Agenda PostgreSQL',
        `La cita con <b>${targetLead?.name || activeThread.name}</b> quedó registrada (${appointmentDate} a las ${appointmentHour} hrs) en PostgreSQL y su expediente fue actualizado a Calificado.`
      );
    }
  };

  const pendingCount = threads.filter((t) => !t.contacted).length;

  // Static quick-reply templates tailored to tenant
  const tenantSuggestions = useMemo(() => {
    if (!activeTenant || !activeThread) return [];
    const bizName = activeTenant?.name || 'nuestro negocio';
    const leadName = activeThread?.name || 'estimado(a)';
    return [
      {
        label: 'Confirmar Atención',
        text: `Hola ${leadName}, gracias por comunicarte con ${bizName}. Con gusto damos seguimiento inmediato a tu solicitud.`,
      },
      {
        label: 'Compartir Información',
        text: `Te compartimos los detalles de nuestros servicios y disponibilidad en ${bizName}. ¿Tienes alguna duda adicional?`,
      },
      {
        label: 'Proponer Cita',
        text: `Tenemos disponibilidad para agendarte en ${bizName}. ¿Qué horario te resulta más cómodo?`,
      },
    ];
  }, [activeTenant, activeThread]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--neon-text)] font-extrabold bg-neon/10 px-2 py-0.5 rounded border border-neon/30">
              OPERACIÓN / BANDEJA DE ATENCIÓN
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Espacio: <strong className="text-[var(--text-main)]">{activeTenant?.name || 'Sin negocio seleccionado'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Cada conversación tiene dirección.
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Contexto del prospecto, canal unificado de Meta y siguiente paso comercial en una sola vista.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Directriz de Voz del Bot */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono">
            <span className="text-[10px] text-[var(--text-muted)] px-1.5 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--neon-text)]" />
              Modo Bot:
            </span>
            <select
              value={botAudioMode}
              onChange={(e) => handleUpdateBotAudioMode(e.target.value)}
              className="bg-[var(--bg-base)] border border-[var(--border-color)] text-[11px] rounded-lg px-2 py-1 text-[var(--text-main)] font-semibold focus:outline-none focus:border-neon cursor-pointer"
            >
              <option value="text_only">🛡️ Solo Texto (Recomendado)</option>
              <option value="mirror">🔄 Modo Espejo (Audio solo si cliente manda audio)</option>
              <option value="text_and_audio">🎙️ Texto y Audio</option>
            </select>
            <button
              type="button"
              onClick={() => {
                const sampleText = `Hola, te atiende el asistente comercial de ${activeTenant?.name || 'nuestro negocio'}. Con gusto te comparto disponibilidad y resolvemos cualquier duda.`;
                playSpeechReal(sampleText, 'test-voice');
              }}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--neon-text)] transition-colors"
              title="Escuchar muestra real de voz del asistente (Web Speech API)"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs font-mono px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all flex items-center gap-1.5"
          >
            <span>Ver Fórmulas SLA</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/crm')}
            className="text-xs bg-neon text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-md active:scale-95"
          >
            <span>Abrir Tablero CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Omnichannel Status Banner - Estado Verídico de Conexión */}
      {!activeTenant ? (
        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
            <span>Sin negocio activo seleccionado en el selector superior.</span>
          </div>
        </div>
      ) : !isWhatsAppConfigured ? (
        !isWaBannerDismissed ? (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn relative">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </span>
              <div>
                <div className="font-heading font-bold text-amber-800 dark:text-amber-300">
                  WhatsApp Cloud API no está conectado en {activeTenant.name}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  Configura tus credenciales oficiales de Meta para recibir chats reales en vivo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-black font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-amber-300 transition-all shadow-sm active:scale-95"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Conectar WhatsApp Real</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWaBannerDismissed(true)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-amber-500/20 transition-colors ml-1"
                title="Ocultar aviso de conexión"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-1 px-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              WhatsApp Cloud API pendiente de configurar
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
              >
                Configurar ahora
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsWaBannerDismissed(false)}
                className="hover:text-[var(--text-main)]"
              >
                Mostrar aviso completo
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="font-mono text-[11px] text-[var(--text-main)] flex flex-wrap items-center gap-1.5">
              <strong className="text-emerald-700 dark:text-emerald-400">WhatsApp Cloud API v21.0 Conectado:</strong>
              <span className="text-[var(--text-main)] font-bold">{waPhoneNumber}</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Webhook: <strong className="text-[var(--text-main)]">{waLastSync}</strong>
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                (SLA Objetivo: {activeTenant?.slaHitlMinutes || 5} min)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Diagnóstico &amp; Credenciales</span>
            </button>

            <span className="font-mono text-[10px] text-[var(--neon-text)] font-bold bg-neon/10 px-2 py-0.5 rounded border border-neon/30 shrink-0">
              {pendingCount} Pendientes
            </span>
          </div>
        </div>
      )}

      {/* 3-Column / Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-280px)] min-h-[620px]">
        {/* Column 1: Threads List (4 cols) */}
        <div className="lg:col-span-4 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {/* List Search & Filters */}
          <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por contacto o necesidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'all'
                      ? 'bg-lime-400 text-black font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  Todos ({threads.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('pending')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'pending'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  Pendientes ({pendingCount})
                </button>

                {/* Botón de Purga Total de Demos */}
                {threads.some((t) => t.isDemo || t.id.startsWith('demo-')) && (
                  <button
                    type="button"
                    onClick={handleClearAllDemos}
                    className="px-2 py-0.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30 text-[10px] font-mono flex items-center gap-1 transition-all ml-1"
                    title="Eliminar todas las conversaciones demo simuladas"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar Demos</span>
                  </button>
                )}
              </div>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] rounded-lg px-2 py-1 text-[var(--text-muted)] focus:outline-none focus:border-neon"
              >
                <option value="all">Canal: Todos</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram DM</option>
                <option value="facebook">Facebook</option>
                <option value="web">Web Chat</option>
              </select>
            </div>
          </div>

          {/* Threads Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)] custom-scrollbar">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono space-y-4 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 text-[var(--neon-text)] flex items-center justify-center mx-auto text-xl shadow-sm">
                  💬
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-[var(--text-main)] text-sm">
                    {!activeTenant ? 'Selecciona un negocio' : 'Sin conversaciones registradas'}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] font-sans max-w-xs mx-auto leading-relaxed">
                    {!activeTenant
                      ? 'Elige un negocio activo para gestionar sus chats.'
                      : 'Bandeja en tiempo real preparada. Los mensajes reales de WhatsApp aparecerán aquí automáticamente.'}
                  </p>
                </div>

                {activeTenant && (
                  <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => setIsWhatsAppModalOpen(true)}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-amber-300 transition-all shadow-sm active:scale-95"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>{isWhatsAppConfigured ? 'Ver Credenciales de WhatsApp' : 'Conectar WhatsApp Oficial'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredThreads.map((thread) => {
              const isSelected = activeThread?.id === thread.id;
              const channelBadge = CHANNEL_BADGES[thread.channel] || CHANNEL_BADGES['Web Chat'];

              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[var(--bg-card)] border-l-4 border-neon'
                      : 'hover:bg-[var(--bg-card)]/50'
                  }`}
                >
                  {/* Avatar with Channel Indicator */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-neon/10 border border-neon/30 text-[var(--neon-text)] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      {thread.name.charAt(0)}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-panel)] ${channelBadge.dot}`}
                      title={thread.channel}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                        {thread.name}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-faint)] shrink-0">
                        {thread.date}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] truncate font-sans">
                      {thread.need} · <span className="font-mono text-[10px]">{thread.company}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${channelBadge.badge}`}>
                        {thread.channel}
                      </span>
                      {thread.contacted ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                          Atendida
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Por responder
                        </span>
                      )}
                      {thread.aiPaused && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-semibold">
                          Atención Humana
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            }))}
          </div>
        </div>

        {/* Column 2: Active Chat Feed & Fast Response (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-[var(--text-main)]">
                      {activeThread.name}
                    </h3>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border ${CHANNEL_BADGES[activeThread.channel]?.badge || ''}`}>
                      {activeThread.channel}
                    </span>
                    {activeThread.aiPaused && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold">
                        Pausa Automática de Asistente
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-0.5">
                    <span>{activeThread.phone}</span>
                    <span>•</span>
                    <span className="text-[10px] text-[var(--neon-text)] font-semibold">{activeThread.campaign || 'Inbound Directo'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!activeThread.contacted && activeThread.slaMinutesRemaining !== null && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        activeThread.slaMinutesRemaining > 0
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30 animate-pulse'
                      }`}
                    >
                      {activeThread.slaMinutesRemaining > 0
                        ? `⏳ ${activeThread.slaMinutesRemaining} min SLA`
                        : '⚠️ SLA Vencido'}
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={isTogglingAiPause}
                    onClick={handleToggleAiPause}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      activeThread.aiPaused
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    } disabled:opacity-50`}
                    title={
                      activeThread.aiPaused
                        ? 'Reanudar respuestas automáticas del asistente IA'
                        : 'Pausar IA en esta conversación para Atención Humana directa'
                    }
                  >
                    {activeThread.aiPaused ? (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Reanudar IA</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Atención Humana</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--bg-base)] custom-scrollbar">
                {/* Meta 24-Hour Policy Notice */}
                <div className="p-2 rounded-xl bg-[var(--bg-card)]/60 border border-[var(--border-color)] text-center text-[10px] font-mono text-[var(--text-faint)]">
                  ⚡ Ventana de Atención Meta Activa: 24h restantes para mensajes directos sin costo de plantilla HSM.
                </div>

                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.direction === 'out' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-sans leading-relaxed shadow-sm ${
                        msg.direction === 'out'
                          ? 'bg-lime-400 text-black font-medium'
                          : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
                      }`}
                    >
                      {/* Audio Voice Note Player con Web Speech API */}
                      {msg.type === 'audio' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => playSpeechReal(msg.text, msg.id)}
                              className={`p-2 rounded-full ${
                                msg.direction === 'out' ? 'bg-black text-lime-400' : 'bg-lime-400 text-black'
                              }`}
                              title={playingAudioId === msg.id ? "Pausar audio" : "Escuchar síntesis de voz en español"}
                            >
                              {playingAudioId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            </button>
                            <div className="flex items-center gap-1">
                              {[8, 14, 22, 10, 18, 24, 16, 12, 20, 15, 10, 22].map((height, i) => (
                                <span
                                  key={i}
                                  style={{ height: `${height}px` }}
                                  className={`w-1 rounded-full ${
                                    playingAudioId === msg.id
                                      ? 'bg-lime-400 animate-pulse'
                                      : msg.direction === 'out'
                                      ? 'bg-black/40'
                                      : 'bg-[var(--border-color)]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono font-bold shrink-0">{msg.duration || '0:18'}</span>
                          </div>

                          {/* Badge de Transcripción Whisper si es inbound */}
                          {msg.direction === 'in' && (
                            <div className="text-[9px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                              <Mic className="w-2.5 h-2.5" />
                              <span>Transcripción IA Whisper instantánea</span>
                            </div>
                          )}

                          <p className="text-[11px] italic opacity-90 border-t border-black/10 pt-1 font-mono">
                            {msg.text}
                          </p>
                        </div>
                      ) : msg.type === 'image' ? (
                        <div className="space-y-2">
                          {typeof msg.imageUrl === 'string' && msg.imageUrl.trim().length > 0 && (
                            <div className="rounded-xl overflow-hidden border border-[var(--border-color)] max-h-48 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={msg.imageUrl} alt="Documento enviado" className="w-full object-cover" />
                            </div>
                          )}
                          {msg.aiAnalysis && (
                            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 space-y-1">
                              <div className="flex items-center gap-1 font-bold">
                                <ImageIcon className="w-3 h-3" />
                                <span>{msg.aiAnalysis.badge}</span>
                              </div>
                              <p className="text-[var(--text-main)]">{msg.aiAnalysis.extracted}</p>
                            </div>
                          )}
                          <p className="text-xs">{msg.text}</p>
                        </div>
                      ) : msg.type === 'document' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                            <FileText className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs truncate text-[var(--text-main)]">{msg.fileName || 'documento.pdf'}</div>
                              <div className="text-[10px] text-[var(--text-muted)] font-mono">{msg.fileSize || 'PDF'}</div>
                            </div>
                          </div>
                          {msg.aiAnalysis && (
                            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-800 dark:text-cyan-300 space-y-1">
                              <div className="flex items-center gap-1 font-bold">
                                <FileCheck className="w-3 h-3" />
                                <span>{msg.aiAnalysis.badge}</span>
                              </div>
                              <p className="text-[var(--text-main)]">{msg.aiAnalysis.summary}</p>
                            </div>
                          )}
                          <p className="text-xs">{msg.text}</p>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1 text-[9px] font-mono text-[var(--text-faint)]">
                      <span>{msg.time}</span>
                      {msg.direction === 'out' && <CheckCheck className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Replies Bar (Respuestas Rápidas) */}
              <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-card)]/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
                <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-1 shrink-0 px-1 font-bold">
                  <Sparkles className="w-3 h-3 text-[var(--neon-text)]" />
                  Respuestas Rápidas:
                </span>
                {tenantSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDraftReply(sug.text)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-neon text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap transition-colors"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>

              {/* Compose Box with Voice Note & Send */}
              <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-end gap-2">
                <textarea
                  ref={replyInputRef}
                  rows={2}
                  placeholder={`Responder a ${activeThread.name} en ${activeThread.channel}...`}
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  className="flex-1 p-2.5 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neon resize-none font-sans"
                />

                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!draftReply.trim()}
                  className="px-4 py-3 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[var(--text-muted)]">
              Selecciona una conversación para responder
            </div>
          )}
        </div>

        {/* Column 3: Lead Context & 4 Qualification Rules (3 cols) */}
        <div className="lg:col-span-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col justify-between overflow-y-auto space-y-4 shadow-sm custom-scrollbar">
          {activeThread ? (
            <>
              <div className="space-y-4">
                {/* Contact Card Header */}
                <div className="border-b border-[var(--border-color)] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                    Radiografía del Prospecto
                  </span>
                  <h4 className="font-heading font-black text-base text-[var(--text-main)] mt-0.5">
                    {activeThread.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-sans">
                    {activeThread.company}
                  </p>
                </div>

                {/* Ticket & Stage */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase">
                      Ticket Estimado
                    </span>
                    <span className="text-sm font-mono font-black text-[var(--neon-text)]">
                      ${formatNumber(activeThread.potentialTicket)} MXN
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase">
                      Etapa Comercial
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                      {activeThread.stage}
                    </span>
                  </div>
                </div>

                {/* 4 Dynamic Qualification Requirements (ADR_008 §2.2) */}
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--neon-text)]" />
                      4 Requisitos de Calidad
                    </span>
                    <span className="text-[9px] font-mono font-bold text-[var(--neon-text)]">
                      {Object.values(activeThread.qualification).filter(Boolean).length}/4
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-sans">
                    {dynamicCriteria.map((crit, idx) => {
                      const qualKey = QUAL_KEY_BY_CRITERION[crit.key] || 'contactValid';
                      const isChecked = Boolean(activeThread.qualification?.[qualKey]);
                      const rawTitle = crit.shortLabel || crit.label;
                      const labelText =
                        crit.id === 'identity' && !/correo|email/i.test(rawTitle)
                          ? `${rawTitle} (WhatsApp y Email)`
                          : rawTitle;
                      return (
                        <label
                          key={crit.id}
                          onClick={() => handleToggleRequirement(qualKey)}
                          title={crit.description}
                          className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="accent-lime-600 dark:accent-lime-400 rounded"
                          />
                          <span>
                            {idx + 1}. {labelText}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Responsible & Assigned Agent */}
                <div className="text-xs space-y-1 text-[var(--text-muted)] font-mono text-[11px]">
                  <div>Responsable: <strong className="text-[var(--text-main)]">{activeThread.owner}</strong></div>
                  <div>ID Prospecto: <span className="text-[var(--text-faint)]">{activeThread.id}</span></div>
                </div>
              </div>

              {/* Primary 1-Click Action: Open PreCita Drawer & Schedule */}
              <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                <button
                  type="button"
                  onClick={() => setIsPreCitaDrawerOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-neon text-black font-mono font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-md active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Dictaminar Pre-Cita</span>
                </button>
                <p className="text-[10px] font-mono text-[var(--text-faint)] text-center">
                  Aprobación Human-in-the-Loop en 1 clic
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-[var(--text-muted)]">Sin datos de contacto</div>
          )}
        </div>
      </div>

      {/* PreCita Drawer for 1-Click Scheduling */}
      <PreCitaDrawer
        isOpen={isPreCitaDrawerOpen}
        onClose={() => setIsPreCitaDrawerOpen(false)}
        onApproveAppointment={handleApproveDrawerAppointment}
        onOpenChat={() => {
          setTimeout(() => replyInputRef.current?.focus(), 60);
        }}
        lead={
          activeThread
            ? {
                id: activeThread.id,
                name: activeThread.name || 'Prospecto',
                phone: activeThread.phone || '',
                email: activeThread.email || '',
                notes: activeThread.need || 'Servicio Profesional',
                estimatedValue: Number(activeThread.potentialTicket || 0),
                potentialTicket: `$${formatNumber(activeThread.potentialTicket || 0)} MXN`,
                channel: activeThread.channel || 'WhatsApp',
                status: activeThread.stage || 'LEAD_COLD_24H',
                leadState:
                  activeThread.leadState ||
                  (Object.values(activeThread.qualification || {}).every(Boolean)
                    ? LEAD_STATUS_ENUM.BILLABLE_LEAD
                    : LEAD_STATUS_ENUM.LEAD_COLD_24H),
                criteriaAudit: {
                  identityValidated: Boolean(activeThread.qualification?.contactValid),
                  catalogIdentified: Boolean(activeThread.qualification?.productIdentified),
                  financialClarified: Boolean(activeThread.qualification?.doubtsResolved),
                  consentOrBooked: Boolean(activeThread.qualification?.ctaAccepted),
                },
                customerNeeds: {
                  potentialTicket: Number(activeThread.potentialTicket || 0),
                  intent: activeThread.need || 'Servicio Profesional',
                  objectionIdentified: activeThread.qualification?.doubtsResolved
                    ? 'Precios y condiciones clarificados'
                    : '',
                  suggestedAction: 'Cita de valoración y confirmación inmediata',
                },
                messages: activeThread.messages || [],
              }
            : null
        }
      />

      {/* Measurement Guide Modal */}
      <MeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        initialMetricId="tiempo_primera_respuesta"
      />

      {/* Modal de Conexión & Diagnóstico de WhatsApp Cloud API */}
      <WhatsAppConnectModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        activeTenant={activeTenant}
        onSaveCredentials={handleSaveWhatsAppCredentials}
      />
    </div>
  );
};
