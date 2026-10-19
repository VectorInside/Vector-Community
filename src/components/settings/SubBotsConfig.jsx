'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/context/AuthContext';
import { tenantService } from '@/services/tenantService';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Bot,
  Sliders,
  FileText,
  UploadCloud,
  CheckCircle2,
  Utensils,
  Stethoscope,
  ShoppingBag,
  Briefcase,
  Target,
  PhoneCall,
  Instagram,
  Video,
  Share2,
  Flame,
  Sparkles,
  Key,
  Shield,
  Save,
  Trash2,
  Plus,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubBotsConfig = () => {
  const { activeTenantId, activeTenant } = useTenant();
  const { permissions, isSuperAdmin } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load vertical configuration
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const data = await tenantService.getVerticalConfig(activeTenantId);
        setConfig(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [activeTenantId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tenantService.updateVerticalConfig(activeTenantId, config);
      setSavedSuccess(true);
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#D4FF00', '#10B981'],
        });
      } catch (e) {}
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const vertical = activeTenant?.vertical || 'hospitality';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-surface via-dark-elevated to-dark-surface border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Configuración de Sub-Bots RAG & Verticales
              </h2>
              <p className="text-xs text-zinc-400">
                Ajusta los prompts del modelo, base de conocimiento y parámetros para <strong className="text-white">{activeTenant?.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neon" size="md">
            Vertical: {activeTenant?.verticalLabel}
          </Badge>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Configuración guardada y re-indexada en el Vector Store con éxito.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dynamic Vertical Section */}
        {vertical === 'hospitality' && (
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-dark-border">
              <Utensils className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Módulo Hospitality (Restaurantes & Bares)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  URL del Menú Digital PDF
                </label>
                <input
                  type="text"
                  value={config?.hospitality?.digitalMenuUrl || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hospitality: { ...config?.hospitality, digitalMenuUrl: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Capacidad Máxima de Comensales por Reserva
                </label>
                <input
                  type="number"
                  value={config?.hospitality?.maxTableCapacity || 10}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hospitality: {
                        ...config?.hospitality,
                        maxTableCapacity: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Depósito Mínimo Sugerido ($ MXN)
                </label>
                <input
                  type="number"
                  value={config?.hospitality?.minDepositRequired || 1000}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hospitality: {
                        ...config?.hospitality,
                        minDepositRequired: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tolerancia de Cancelación Automática (Minutos)
                </label>
                <input
                  type="number"
                  value={config?.hospitality?.autoCancelMinutes || 15}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hospitality: {
                        ...config?.hospitality,
                        autoCancelMinutes: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {vertical === 'service_appointments' && (
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-dark-border">
              <Stethoscope className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">
                Módulo Service Appointments (Clínicas & Servicios)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Google Calendar ID Asignado
                </label>
                <input
                  type="text"
                  value={config?.service_appointments?.googleCalendarId || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      service_appointments: {
                        ...config?.service_appointments,
                        googleCalendarId: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Duración Predeterminada de Consulta (Minutos)
                </label>
                <input
                  type="number"
                  value={config?.service_appointments?.defaultAppointmentDurationMin || 45}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      service_appointments: {
                        ...config?.service_appointments,
                        defaultAppointmentDurationMin: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Buffer Entre Pacientes / Citas (Minutos)
                </label>
                <input
                  type="number"
                  value={config?.service_appointments?.bufferBetweenAppointmentsMin || 15}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      service_appointments: {
                        ...config?.service_appointments,
                        bufferBetweenAppointmentsMin: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Horario de Atención RAG
                </label>
                <input
                  type="text"
                  value={config?.service_appointments?.workingHours || 'Lun-Vie 09:00 - 19:00'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      service_appointments: {
                        ...config?.service_appointments,
                        workingHours: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {vertical === 'ecommerce' && (
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-dark-border">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                Módulo E-Commerce (Catálogo, CAPI & Carritos)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Dominio Tienda Online
                </label>
                <input
                  type="text"
                  value={config?.ecommerce?.storeDomain || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ecommerce: { ...config?.ecommerce, storeDomain: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Meta Pixel ID
                </label>
                <input
                  type="text"
                  value={config?.ecommerce?.metaPixelId || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ecommerce: { ...config?.ecommerce, metaPixelId: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              {isSuperAdmin && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-brand-primary" />
                    Meta CAPI Conversion Token (Restringido Super Admin)
                  </label>
                  <input
                    type="password"
                    value={config?.ecommerce?.capiConversionToken || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ecommerce: { ...config?.ecommerce, capiConversionToken: e.target.value },
                      })
                    }
                    className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {vertical === 'b2b_sales' && (
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-dark-border">
              <Briefcase className="w-5 h-5 text-neon" />
              <h3 className="text-base font-bold text-white">
                Módulo B2B Sales (High-Ticket & Discovery Calls)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  CRM Integrado (Destino de Deals)
                </label>
                <select
                  value={config?.b2b_sales?.crmProvider || 'HubSpot CRM Enterprise'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      b2b_sales: { ...config?.b2b_sales, crmProvider: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary focus:outline-none"
                >
                  <option value="HubSpot CRM Enterprise">HubSpot CRM Enterprise (Recomendado)</option>
                  <option value="Salesforce Sales Cloud">Salesforce Sales Cloud</option>
                  <option value="Pipedrive">Pipedrive CRM</option>
                  <option value="Zoho CRM">Zoho CRM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Etapa del Pipeline para Leads Calificados
                </label>
                <input
                  type="text"
                  value={config?.b2b_sales?.crmPipelineStage || 'Discovery Call Agendada (B2B Q4)'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      b2b_sales: { ...config?.b2b_sales, crmPipelineStage: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Presupuesto Mínimo Requerido BANT ($ USD)
                </label>
                <input
                  type="number"
                  value={config?.b2b_sales?.bantMinBudget || 5000}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      b2b_sales: {
                        ...config?.b2b_sales,
                        bantMinBudget: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Duración Discovery Call (Minutos)
                </label>
                <input
                  type="number"
                  value={config?.b2b_sales?.discoveryCallDurationMin || 30}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      b2b_sales: {
                        ...config?.b2b_sales,
                        discoveryCallDurationMin: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Enlace Permanente de Discovery Call (Zoom / Google Meet)
                </label>
                <input
                  type="text"
                  value={config?.b2b_sales?.meetingLink || 'https://meet.google.com/vec-corp-demo'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      b2b_sales: { ...config?.b2b_sales, meetingLink: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email del Director Comercial / Closer Asignado
                </label>
                <input
                  type="email"
                  value={config?.b2b_sales?.salesDirectorEmail || 'carlos.mendoza@vectorinside.com'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      b2b_sales: { ...config?.b2b_sales, salesDirectorEmail: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-brand-primary" />
                  CRM API Private App Access Token (Restringido Super Admin)
                </label>
                <input
                  type="password"
                  value={config?.b2b_sales?.crmApiKey || '••••••••••••••••••••••••••••••••••••••••'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      b2b_sales: { ...config?.b2b_sales, crmApiKey: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {vertical === 'creator_economy' && (
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-dark-border">
              <Instagram className="w-5 h-5 text-pink-400" />
              <h3 className="text-base font-bold text-white">
                Módulo Creator Economy (Instagram & Facebook Meta Engine)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Usuario de Instagram Oficial (@handle)
                </label>
                <input
                  type="text"
                  value={config?.creator_economy?.instagramHandle || '@alexrivera_tech'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      creator_economy: { ...config?.creator_economy, instagramHandle: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Presupuesto Mínimo para Patrocinios ($ USD)
                </label>
                <input
                  type="number"
                  value={config?.creator_economy?.minSponsorshipBudgetUSD || 1500}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      creator_economy: {
                        ...config?.creator_economy,
                        minSponsorshipBudgetUSD: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Disparadores de Palabras Clave Activas (Comentarios a DM)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(config?.creator_economy?.keywordTriggers)
                      ? config.creator_economy.keywordTriggers.join(', ')
                      : 'PLANTILLA, MENTORIA, AUDITORIA, CURSO, PRECIO'
                  }
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      creator_economy: {
                        ...config?.creator_economy,
                        keywordTriggers: e.target.value.split(',').map((k) => k.trim()),
                      },
                    })
                  }
                  placeholder="ej. PLANTILLA, MENTORIA, AUDITORIA"
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Separadas por comas. Cuando un usuario comente una de estas palabras, el bot responderá y enviará un DM.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  URL del Media Kit & Tarifario Oficial (PDF)
                </label>
                <input
                  type="text"
                  value={config?.creator_economy?.mediaKitUrl || 'https://cdn.vectorinside.com/mediakits/alex-rivera-2026.pdf'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      creator_economy: { ...config?.creator_economy, mediaKitUrl: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nivel de Moderación & Blindaje Anti-Toxicidad (Filtro Haters)
                </label>
                <select
                  value={config?.creator_economy?.toxicityFilterLevel || 'Estricto (Ocultar insultos y bloquear spam)'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      creator_economy: { ...config?.creator_economy, toxicityFilterLevel: e.target.value },
                    })
                  }
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary focus:outline-none font-sans"
                >
                  <option value="Estricto (Ocultar insultos y bloquear spam)">
                    Estricto — Ocultar comentarios con lenguaje hostil y bloquear enlaces de spam
                  </option>
                  <option value="Moderado (Solo spam)">
                    Moderado — Ocultar únicamente links promocionales no autorizados
                  </option>
                  <option value="Manual (Solo alertar en HITL)">
                    Manual — Notificar a la agencia antes de ocultar cualquier comentario
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Automated Follow-Up & Nurturing Protocol (24h / 48h) */}
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Motor de Seguimiento Proactivo & Re-engagement (Nurturing 24h/48h)
              </h3>
            </div>
            <Badge variant="warning" size="xs">
              Conversión +32%
            </Badge>
          </div>

          <p className="text-xs text-zinc-400">
            Reconecta automáticamente con prospectos que cotizaron o pidieron información pero no concluyeron el agendamiento o compra:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Primer Follow-Up Automático (Horas de inactividad)
              </label>
              <input
                type="number"
                value={config?.followUp?.firstFollowUpHours || 24}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    followUp: { ...config?.followUp, firstFollowUpHours: parseInt(e.target.value) },
                  })
                }
                className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Segundo Follow-Up / Oferta de Cierre (Horas de inactividad)
              </label>
              <input
                type="number"
                value={config?.followUp?.secondFollowUpHours || 48}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    followUp: { ...config?.followUp, secondFollowUpHours: parseInt(e.target.value) },
                  })
                }
                className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary font-mono focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Plantilla de Mensaje de Reactivación Empática
              </label>
              <textarea
                rows={2}
                value={
                  config?.followUp?.messageTemplate ||
                  '¡Hola! Notamos que te interesó nuestra propuesta pero no alcanzamos a confirmar. ¿Tienes alguna duda puntual que podamos resolverte de inmediato?'
                }
                onChange={(e) =>
                  setConfig({
                    ...config,
                    followUp: { ...config?.followUp, messageTemplate: e.target.value },
                  })
                }
                className="w-full bg-dark-base border border-dark-border rounded-xl p-3 text-xs text-white focus:border-brand-primary font-sans leading-relaxed focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* System Prompt & AI Model Parameters */}
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h3 className="text-base font-bold text-white">
                System Prompt & Parámetros del Motor RAG
              </h3>
            </div>
            <Badge variant="neon" size="xs">
              AI Engine
            </Badge>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              System Instruction Prompt
            </label>
            <textarea
              rows={4}
              value={config?.[vertical]?.systemPrompt || ''}
              onChange={(e) =>
                setConfig({
                  ...config,
                  [vertical]: {
                    ...config?.[vertical],
                    systemPrompt: e.target.value,
                  },
                })
              }
              className="w-full bg-dark-base border border-dark-border rounded-xl p-3.5 text-xs text-white focus:border-brand-primary font-mono leading-relaxed focus:outline-none"
              placeholder="Instrucciones para el agente de IA..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Temperatura del Modelo ({config?.[vertical]?.temperature || 0.3})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config?.[vertical]?.temperature || 0.3}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [vertical]: {
                      ...config?.[vertical],
                      temperature: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-brand-primary"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                <span>0.0 (Determinístico / Citas)</span>
                <span>1.0 (Creativo / Marketing)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Modelo LLM Activo (ADR-004 Model Routing)
              </label>
              <select
                value={config?.[vertical]?.activeModel || 'DeepSeek V3 (deepseek-chat - < 800ms)'}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [vertical]: {
                      ...config?.[vertical],
                      activeModel: e.target.value,
                    },
                  })
                }
                className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary focus:outline-none font-mono"
              >
                <option value="DeepSeek V3 (deepseek-chat - < 800ms)">DeepSeek V3 (Motor Operativo &lt; 800ms - Oficial)</option>
                <option value="DeepSeek R1 (deepseek-reasoner - CoT)">DeepSeek R1 (Motor Cognitivo &amp; Razonamiento CoT)</option>
                <option value="Groq / Meta Llama 3 70B ($0 USD)">Groq / Meta Llama 3 70B (Costo $0 USD / Batching 24h)</option>
                <option value="Claude 3.5 Sonnet / Vector RAG">Claude 3.5 Sonnet (Multi-Modal / Fallback)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prompts y Guiones Estrictos XML Oficiales (Plan v4.0) */}
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-neon" />
              <h3 className="text-base font-bold text-white font-sans">
                Guiones &amp; Prompts Estrictos XML de Sub-Agentes (Plan v4.0)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold">
              XML Delimitado + JSON Schemas
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Estructurados bajo formato XML delimitado con tipos de entrada/salida forzados para garantizar cero alucinaciones y ejecución determinista:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-dark-base border border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">🤖 1. Supervisor ("Lobo Vectorial")</span>
                <span className="text-[10px] text-neon">0ms / Event-Driven</span>
              </div>
              <p className="text-zinc-400 text-[11px] font-sans">
                Enruta WhatsApp/DMs según intención protegiendo el <code className="text-neon">{activeTenantId}</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-base border border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">🤖 2. Moderador &amp; Closer</span>
                <span className="text-[10px] text-amber-400">AIDA / JTBD</span>
              </div>
              <p className="text-zinc-400 text-[11px] font-sans">
                Presenta beneficio antes del precio y audita los 4 requisitos booleanos para cobrar $350 MXN.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-base border border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">🤖 3. Re-Engagement 24h</span>
                <span className="text-[10px] text-purple-400">Vaca Púrpura</span>
              </div>
              <p className="text-zinc-400 text-[11px] font-sans">
                Dispara a las 24h exactas en Redis Queue: máx 40 palabras, dato curioso y micro-CTA.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-base border border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">🤖 4. Analista Performance</span>
                <span className="text-[10px] text-cyan-400">CAPI / GA4</span>
              </div>
              <p className="text-zinc-400 text-[11px] font-sans">
                Mide ROAS Real, detecta fatiga creativa (Hook Rate &lt; 20%) y alerta fricción si Click-to-WA &lt; 3%.
              </p>
            </div>
          </div>
        </div>

        {/* Knowledge Base Documents */}
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-zinc-400" />
              <h3 className="text-base font-bold text-white">
                Base de Conocimiento Indexada (Vector Embeddings)
              </h3>
            </div>
            <Button variant="outline" size="sm" icon={UploadCloud}>
              Subir Documento
            </Button>
          </div>

          <div className="space-y-2">
            {(config?.[vertical]?.ragKnowledgeDocs || []).map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-dark-base border border-dark-border text-xs font-mono"
              >
                <div className="flex items-center gap-2 text-zinc-200">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <span>{doc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-[10px]">INDEXADO (1536 dims)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
            loading={saving}
          >
            Guardar Configuración Sub-Bot
          </Button>
        </div>
      </form>
    </div>
  );
};
