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
  Sparkles,
  Key,
  Shield,
  Save,
  Trash2,
  Plus
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
                Modelo LLM Activo
              </label>
              <select
                value={config?.[vertical]?.activeModel || 'Claude 3.5 Sonnet / Vector RAG'}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [vertical]: {
                      ...config?.[vertical],
                      activeModel: e.target.value,
                    },
                  })
                }
                className="w-full bg-dark-base border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary focus:outline-none"
              >
                <option value="Claude 3.5 Sonnet / Vector RAG">Claude 3.5 Sonnet (Recomendado)</option>
                <option value="GPT-4o / Vector Medical RAG">GPT-4o (Alta Precisión)</option>
                <option value="GPT-4o Mini / Vector E-Commerce Embeddings">GPT-4o Mini (Ultra Rápido)</option>
              </select>
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
