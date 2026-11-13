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
  Settings,
  Activity,
  ExternalLink,
  FlaskConical,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PreCitaDrawer } from '@/components/hitl/PreCitaDrawer';
import { formatNumber } from '@/utils/formatters';
import { MeasurementGuideModal } from '@/components/common/MeasurementGuideModal';
import { leadService } from '@/services/leadService';
import { WhatsAppConnectModal } from './WhatsAppConnectModal';

// =========================================================================
// CANONICAL OMNICHANNEL INBOX BY TENANT (ADR-001, ADR-002, ADR-011)
// =========================================================================

const CANONICAL_INBOX_BY_TENANT = {};

const CHANNEL_BADGES = {
  WhatsApp: {
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    dot: 'bg-emerald-400',
    iconName: 'WhatsApp',
  },
  'Instagram DM': {
    badge: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    dot: 'bg-pink-400',
    iconName: 'Instagram',
  },
  Facebook: {
    badge: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    dot: 'bg-blue-400',
    iconName: 'Facebook',
  },
  'Web Chat': {
    badge: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    dot: 'bg-cyan-400',
    iconName: 'Web',
  },
};

export const ConversacionesInbox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeTenant, triggerModal, updateTenantPolicy } = useAuth();
  const tenantKey = activeTenant?.id || null;

  // Estado del modal de conexión WhatsApp Cloud API
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Detección verídica del estado de conexión de WhatsApp
  const waConfig = activeTenant?.connectedChannels?.whatsapp;
  const isWhatsAppConfigured = Boolean(
    waConfig?.enabled && (waConfig?.phoneNumberId || activeTenant?.whatsappNumberId)
  );
  const waPhoneNumber = waConfig?.displayPhoneNumber || activeTenant?.phone || '+52 55 1234 5678';
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

  // Inyección de conversación demo para pruebas en vivo de la bandeja
  const handleInjectDemoThread = () => {
    const demoThread = {
      id: `demo-${Date.now()}`,
      name: 'Carlos Mendoza (Demo WhatsApp)',
      company: 'Constructora del Norte',
      channel: 'WhatsApp',
      phone: '+52 81 8392 4410',
      need: 'Cotización de consultoría comercial y agenda de cita virtual',
      campaign: 'Meta Ads Inbound',
      date: 'Hace un momento',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Nuevo',
      slaMinutesRemaining: 15,
      potentialTicket: 34500,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: false,
        ctaAccepted: false,
      },
      messages: [
        {
          id: `m-demo-1`,
          direction: 'in',
          text: 'Hola, vi su información sobre automatización comercial y agendamiento con IA. ¿Me pueden brindar detalles de costos y disponibilidad para esta semana?',
          time: '12:45 PM',
        },
        {
          id: `m-demo-2`,
          direction: 'out',
          type: 'audio',
          duration: '0:18',
          text: 'Hola Carlos, con gusto. Te confirmo de viva voz que tenemos paquetes diseñados para constructoras con integración de CRM y agendamiento automático.',
          time: '12:46 PM',
        },
        {
          id: `m-demo-3`,
          direction: 'in',
          text: 'Excelente audio, me interesa bastante. ¿Tienen espacio el jueves por la tarde para una videollamada de valoración?',
          time: '12:48 PM',
        },
      ],
    };

    setThreads((prev) => [demoThread, ...prev]);
    setSelectedThreadId(demoThread.id);

    try {
      confetti({ particleCount: 30, spread: 60, colors: ['#E7F900', '#10B981', '#38BDF8'] });
    } catch (e) {}
  };

  // Guardar credenciales reales en AuthContext y localStorage
  const handleSaveWhatsAppCredentials = (credentials) => {
    if (updateTenantPolicy && activeTenant?.id) {
      const existingChannels = activeTenant?.connectedChannels || {};
      updateTenantPolicy(activeTenant.id, {
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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    Promise.allSettled([
      leadService.getLeadsByTenant(tenantId),
      fetch(`${backendUrl}/api/v1/webhooks/whatsapp/conversations/${tenantId}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ])
      .then(([leadsRes, convsRes]) => {
        const backendLeads = leadsRes.status === 'fulfilled' && Array.isArray(leadsRes.value) ? leadsRes.value : [];
        const rawConvs = convsRes.status === 'fulfilled' && convsRes.value?.data ? convsRes.value.data : [];

        // Hilos canónicos desde base de datos de mensajería (Meta Cloud API)
        const convThreads = Array.isArray(rawConvs)
          ? rawConvs.map((c) => ({
              id: c.id,
              leadId: c.leadId,
              name: c.contactName || 'Contacto WhatsApp',
              company: 'Inbound WhatsApp Oficial',
              channel: 'WhatsApp',
              phone: c.externalSenderId || '',
              need: c.lastMessageText || 'Conversación WhatsApp Cloud API',
              campaign: 'Meta Cloud API v21.0',
              date: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : 'Reciente',
              contacted: true,
              owner: 'Lobo Vectorial (Agencia)',
              stage: c.status === 'ATTENDED' ? 'Atendido' : 'Nuevo',
              slaMinutesRemaining: 15,
              potentialTicket: 18500,
              qualification: {
                contactValid: true,
                productIdentified: true,
                doubtsResolved: false,
                ctaAccepted: false,
              },
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
            }))
          : [];

        // Hilos desde leads de CRM
        const mappedLeads = backendLeads
          .filter((lead) => !convThreads.some((ct) => ct.leadId === lead.id || ct.phone === lead.phone))
          .map((lead) => ({
            id: lead.id,
            leadId: lead.id,
            name: lead.name,
            company: lead.notes || 'Contacto Directo',
            channel: lead.channel || 'WhatsApp',
            phone: lead.phone || '',
            need: lead.customerNeeds?.intent || lead.notes || 'Consulta Comercial',
            campaign: lead.channel || 'Inbound Directo',
            date: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Reciente',
            contacted: lead.leadState === 'BILLABLE_LEAD',
            owner: 'Lobo Vectorial (Agencia)',
            stage: lead.status || (lead.leadState === 'BILLABLE_LEAD' ? 'Calificado' : 'Nuevo'),
            slaMinutesRemaining: lead.countdown24h ? 15 : null,
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

        const unifiedThreads = [...convThreads, ...mappedLeads];
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

  // Handle Send Reply (Simulation with local state)
  const handleSendReply = () => {
    if (!draftReply.trim() || !activeThread) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      direction: 'out',
      text: draftReply.trim(),
      time: 'Ahora',
    };

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          contacted: true,
          slaMinutesRemaining: null,
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    persistThreads(updated);
    setDraftReply('');
  };

  // Toggle qualification check
  const handleToggleRequirement = (key) => {
    if (!activeThread) return;
    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        const updatedQual = {
          ...t.qualification,
          [key]: !t.qualification[key],
        };
        const allFourTrue = Object.values(updatedQual).every(Boolean);
        return {
          ...t,
          qualification: updatedQual,
          stage: allFourTrue ? 'Calificado' : t.stage,
        };
      }
      return t;
    });
    persistThreads(updated);
  };

  // Simulate Audio Voice Note Send
  const handleSimulateVoiceNote = () => {
    if (!activeThread) return;
    const audioMsg = {
      id: `m-${Date.now()}`,
      direction: 'out',
      type: 'audio',
      duration: '0:18',
      text: `Hola ${activeThread.name}, te envío este audio para responderte de viva voz sobre ${activeThread.need} y confirmar los horarios disponibles de esta semana.`,
      time: 'Ahora',
    };

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          contacted: true,
          slaMinutesRemaining: null,
          messages: [...t.messages, audioMsg],
        };
      }
      return t;
    });

    persistThreads(updated);
    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#10B981'] });
    } catch (e) {}
  };

  const pendingCount = threads.filter((t) => !t.contacted).length;

  // DeepSeek R1 AI Prompt Suggestions tailored to tenant
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
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime-400 font-extrabold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs font-mono px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400 transition-all flex items-center gap-1.5"
          >
            <span>Ver Fórmulas SLA</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/crm')}
            className="text-xs bg-lime-400 text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-lime-300 transition-all shadow-md active:scale-95"
          >
            <span>Abrir Tablero CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Omnichannel Status Banner - Estado Verídico de Conexión */}
      {!activeTenant ? (
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
            <span>Sin negocio activo seleccionado en el selector superior.</span>
          </div>
        </div>
      ) : !isWhatsAppConfigured ? (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </span>
            <div>
              <div className="font-heading font-bold text-amber-300">
                WhatsApp Cloud API no está conectado en {activeTenant.name}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Falta configurar el Phone Number ID y el Token permanente de Meta para recibir chats en vivo.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInjectDemoThread}
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-main)] border border-[var(--border-color)] font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Inyectar una conversación de prueba para probar la bandeja y el co-pilot de IA"
            >
              <FlaskConical className="w-3.5 h-3.5 text-lime-400" />
              <span>Simular Chat Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-black font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-amber-300 transition-all shadow-sm active:scale-95"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Conectar WhatsApp Real</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="font-mono text-[11px] text-[var(--text-main)] flex flex-wrap items-center gap-1.5">
              <strong className="text-emerald-400">WhatsApp Cloud API v21.0 Conectado:</strong>
              <span className="text-[var(--text-main)] font-bold">{waPhoneNumber}</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Webhook: <strong className="text-zinc-300">{waLastSync}</strong>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                (SLA Objetivo: 15 min)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-lime-400 text-[10px] font-mono text-[var(--text-muted)] hover:text-lime-400 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Diagnóstico & Credenciales</span>
            </button>

            <button
              type="button"
              onClick={handleInjectDemoThread}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-muted)] hover:text-lime-400 transition-colors flex items-center gap-1"
              title="Inyectar otra conversación de prueba"
            >
              <FlaskConical className="w-3 h-3 text-lime-400" />
              <span>+ Demo</span>
            </button>

            <span className="font-mono text-[10px] text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20 shrink-0">
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
              </div>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] rounded-lg px-2 py-1 text-[var(--text-muted)] focus:outline-none focus:border-lime-400"
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
                <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center mx-auto text-xl shadow-sm">
                  💬
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-[var(--text-main)] text-sm">
                    {!activeTenant ? 'Selecciona un negocio' : 'Sin conversaciones registradas'}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] font-sans max-w-xs mx-auto leading-relaxed">
                    {!activeTenant
                      ? 'Elige un negocio activo para gestionar sus chats.'
                      : 'Aún no se reciben mensajes en este número o el webhook está en espera.'}
                  </p>
                </div>

                {activeTenant && (
                  <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={handleInjectDemoThread}
                      className="w-full py-2.5 px-3 rounded-xl bg-lime-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-lime-300 transition-all shadow-sm active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inyectar Conversación Demo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsWhatsAppModalOpen(true)}
                      className="w-full py-2 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400 font-mono text-[11px] transition-colors flex items-center justify-center gap-1.5"
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
                      ? 'bg-[var(--bg-card)] border-l-4 border-lime-400'
                      : 'hover:bg-[var(--bg-card)]/50'
                  }`}
                >
                  {/* Avatar with Channel Indicator */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
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

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${channelBadge.badge}`}>
                        {thread.channel}
                      </span>
                      {thread.contacted ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                          Atendida
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Por responder
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
              <div className="p-3.5 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-[var(--text-main)]">
                      {activeThread.name}
                    </h3>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border ${CHANNEL_BADGES[activeThread.channel]?.badge || ''}`}>
                      {activeThread.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-0.5">
                    <span>{activeThread.phone}</span>
                    <span>•</span>
                    <span className="text-[10px] text-lime-400">{activeThread.campaign || 'Inbound Directo'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!activeThread.contacted && activeThread.slaMinutesRemaining !== null && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        activeThread.slaMinutesRemaining > 0
                          ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
                      }`}
                    >
                      {activeThread.slaMinutesRemaining > 0
                        ? `⏳ ${activeThread.slaMinutesRemaining} min SLA`
                        : '⚠️ SLA Vencido'}
                    </span>
                  )}
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
                      {/* Audio Voice Note Player Simulation */}
                      {msg.type === 'audio' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                              className={`p-2 rounded-full ${
                                msg.direction === 'out' ? 'bg-black text-lime-400' : 'bg-lime-400 text-black'
                              }`}
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
                            <span className="text-[10px] font-mono font-bold shrink-0">{msg.duration}</span>
                          </div>
                          <p className="text-[11px] italic opacity-90 border-t border-black/10 pt-1 font-mono">
                            {msg.text}
                          </p>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1 text-[9px] font-mono text-[var(--text-faint)]">
                      <span>{msg.time}</span>
                      {msg.direction === 'out' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick AI Suggestions Bar (DeepSeek R1 Prompt Assistant) */}
              <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-card)]/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
                <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-1 shrink-0 px-1 font-bold">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  Sugerencias IA:
                </span>
                {tenantSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDraftReply(sug.text)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap transition-colors"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>

              {/* Compose Box with Voice Note & Send */}
              <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-end gap-2">
                <textarea
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
                  className="flex-1 p-2.5 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-lime-400 resize-none font-sans"
                />

                <button
                  type="button"
                  onClick={handleSimulateVoiceNote}
                  title="Simular envío de nota de voz con transcripción"
                  className="p-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-lime-400 border border-[var(--border-color)] transition-colors shrink-0"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!draftReply.trim()}
                  className="px-4 py-3 rounded-xl bg-lime-400 text-black font-mono font-bold text-xs hover:bg-lime-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm flex items-center gap-1.5 active:scale-95"
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

        {/* Column 3: Lead Context & 4 BANT Qualification Rules (3 cols) */}
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
                    <span className="text-sm font-mono font-black text-lime-400">
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

                {/* 4 Inviolable Qualification Requirements (BILLABLE_LEAD Protocol) */}
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                      4 Requisitos de Calificación
                    </span>
                    <span className="text-[9px] font-mono text-lime-400">
                      {Object.values(activeThread.qualification).filter(Boolean).length}/4
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-sans">
                    <label
                      onClick={() => handleToggleRequirement('contactValid')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.contactValid}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>1. Identidad y WhatsApp</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('productIdentified')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.productIdentified}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>2. Interés en Catálogo</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('doubtsResolved')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.doubtsResolved}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>3. Dudas resueltas (RAG)</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('ctaAccepted')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.ctaAccepted}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>4. Cita / Contacto aceptado</span>
                    </label>
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
                  className="w-full py-2.5 rounded-xl bg-lime-400 text-black font-mono font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-lime-300 transition-all shadow-md active:scale-95"
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
        alert={{
          id: activeThread?.id || 'alert-001',
          client_name: activeThread?.name || 'Prospecto',
          client_phone: activeThread?.phone || '',
          customer_needs_summary: {
            potentialTicket: activeThread?.potentialTicket || 28000,
            intent: activeThread?.need || 'Servicio Profesional',
            objection: 'Requiere confirmación de horario y financiamiento',
            suggestedAction: 'Cita de valoración y confirmación inmediata',
          },
          transcript_snippet: activeThread?.messages.map((m) => `${m.direction === 'in' ? 'Cliente' : 'Agente'}: ${m.text}`) || [],
        }}
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
        onInjectDemo={handleInjectDemoThread}
      />
    </div>
  );
};
