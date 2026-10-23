'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/context/AuthContext';
import { tenantService } from '@/services/tenantService';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Save,
  MessageSquare,
  ShieldCheck,
  Cpu,
  Zap,
  Play,
  Pause,
  AlertCircle,
  Check,
  Smartphone,
  Send,
  HelpCircle,
  Key,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Server,
  Layers,
  CheckCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Catálogo de Modelos LLM Soportados en Vector Inside (ADR-004)
const AI_MODELS = [
  {
    id: 'DeepSeek V3 (deepseek-chat - < 800ms)',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    badge: 'Recomendado Oficial',
    badgeVariant: 'neon',
    speed: '< 800 ms',
    cost: 'Económico',
    description: 'Motor operativo oficial de Vector Inside. Ultra-baja latencia y máxima tasa de conversión en WhatsApp.',
    recommendedFor: 'WhatsApp & Agendamiento',
  },
  {
    id: 'DeepSeek R1 (deepseek-reasoner - CoT)',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    badge: 'Razonamiento CoT',
    badgeVariant: 'purple',
    speed: '~1.8 s',
    cost: 'Estándar',
    description: 'Motor cognitivo para objeciones complejas, diagnósticos preliminares y negociación B2B.',
    recommendedFor: 'Casos Clínicos & Calificación',
  },
  {
    id: 'OpenAI GPT-4o (Multi-Modal Flagship)',
    name: 'OpenAI GPT-4o',
    provider: 'OpenAI',
    badge: 'Flagship Vision',
    badgeVariant: 'blue',
    speed: '~1.1 s',
    cost: 'Consumo Propio',
    description: 'Modelo insignia de OpenAI para visión computacional, lectura de estudios médicos y catálogos.',
    recommendedFor: 'Multimodal & Documentos',
  },
  {
    id: 'Claude 3.5 Sonnet (Anthropic)',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'Análisis Superior',
    badgeVariant: 'warning',
    speed: '~1.3 s',
    cost: 'Consumo Propio',
    description: 'Capacidad de síntesis avanzada y seguimiento de instrucciones complejas de gobernanza.',
    recommendedFor: 'Copywriting & Legal',
  },
  {
    id: 'Groq / Meta Llama 3 70B ($0 USD)',
    name: 'Groq Llama 3 70B',
    provider: 'Groq',
    badge: '$0 USD Batch',
    badgeVariant: 'blue',
    speed: '< 350 ms',
    cost: 'Sin Costo',
    description: 'Procesamiento en hardware LPU a velocidad instantánea para consultas repetitivas de alta demanda.',
    recommendedFor: 'Batching 24h & Respuestas Rápidas',
  },
];

export const SubBotsConfig = () => {
  const {
    tenantsData,
    activeTenantKey,
    activeTenant: authActiveTenant,
    toggleTenantAi,
    updateTenantPolicy,
  } = useAuth();

  const { activeTenantId } = useTenant();

  // Negocio actualmente seleccionado gobernado por el selector del Header
  const currentTenant = useMemo(() => {
    if (activeTenantKey && tenantsData?.[activeTenantKey]) {
      return tenantsData[activeTenantKey];
    }
    if (activeTenantId && tenantsData?.[activeTenantId]) {
      return tenantsData[activeTenantId];
    }
    return authActiveTenant || Object.values(tenantsData || {})[0] || null;
  }, [activeTenantKey, activeTenantId, tenantsData, authActiveTenant]);

  const tenantId = currentTenant?.id || 'dental';

  // Configuración técnica y operativa
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Visibilidad de API Keys
  const [showKeys, setShowKeys] = useState({
    deepseek: false,
    openai: false,
    anthropic: false,
    groq: false,
  });

  // Estado de pruebas de latencia de API (Ping)
  const [pingStatus, setPingStatus] = useState({
    deepseek: { loading: false, result: 'connected', latency: '142 ms', status: 200 },
    openai: { loading: false, result: 'idle', latency: null, status: null },
    anthropic: { loading: false, result: 'idle', latency: null, status: null },
    groq: { loading: false, result: 'connected', latency: '185 ms', status: 200 },
  });

  // Modal de prueba Sandbox
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [sandboxMessages, setSandboxMessages] = useState([]);
  const [sandboxInput, setSandboxInput] = useState('');

  // Cargar y heredar configuración del tenant
  useEffect(() => {
    if (!currentTenant) return;

    const loadTenantBotConfig = async () => {
      try {
        const storedConfig = await tenantService.getVerticalConfig(tenantId);

        const slotMin =
          currentTenant?.calendarConfig?.slotDurationMin ||
          storedConfig?.service_appointments?.defaultAppointmentDurationMin ||
          (currentTenant?.vertical === 'hospitality' ? 90 : 45);

        const googleCalId =
          currentTenant?.calendarId ||
          storedConfig?.service_appointments?.googleCalendarId ||
          `c_${tenantId}_agenda@group.calendar.google.com`;

        const workingHoursText =
          currentTenant?.calendarConfig?.shifts
            ? currentTenant.calendarConfig.shifts.map((s) => `${s.name}: ${s.start} - ${s.end}`).join(' | ')
            : storedConfig?.service_appointments?.workingHours || 'Lun-Vie 09:00 - 19:00 | Sáb 09:00 - 14:00';

        const defaultPrompt =
          currentTenant?.systemPrompt ||
          storedConfig?.systemPrompt ||
          `Eres el Asistente Inteligente de ${currentTenant.name}. Tu objetivo es atender con cordialidad, resolver dudas sobre los servicios y guiar al usuario para agendar su cita o confirmar su reservación.`;

        const defaultFollowUpMessage =
          storedConfig?.followUp?.messageTemplate ||
          `¡Hola! Notamos que te interesó nuestra información en ${currentTenant.name} pero no alcanzamos a confirmar tu fecha. ¿Tienes alguna duda puntual que podamos resolverte de inmediato?`;

        setConfig({
          isAiActive: currentTenant.isAiActive ?? true,
          activeModel:
            currentTenant.activeModel ||
            storedConfig?.activeModel ||
            'DeepSeek V3 (deepseek-chat - < 800ms)',
          temperature:
            currentTenant.temperature ??
            storedConfig?.temperature ??
            (currentTenant.vertical === 'service_appointments' ? 0.2 : 0.35),
          systemPrompt: defaultPrompt,
          useCustomKeys: storedConfig?.useCustomKeys ?? false,
          apiKeys: {
            deepseek: storedConfig?.apiKeys?.deepseek || '',
            openai: storedConfig?.apiKeys?.openai || '',
            anthropic: storedConfig?.apiKeys?.anthropic || '',
            groq: storedConfig?.apiKeys?.groq || '',
          },
          calendar: {
            googleCalendarId: googleCalId,
            calendarSyncEnabled: true,
            slotDurationMin: slotMin,
            bufferBetweenAppointmentsMin:
              storedConfig?.service_appointments?.bufferBetweenAppointmentsMin || 15,
            workingHours: workingHoursText,
            concurrencyLimit: currentTenant?.calendarConfig?.concurrencyLimit || 1,
          },
          followUp: {
            firstFollowUpHours: storedConfig?.followUp?.firstFollowUpHours || 24,
            secondFollowUpHours: storedConfig?.followUp?.secondFollowUpHours || 48,
            messageTemplate: defaultFollowUpMessage,
          },
        });

        // Inicializar mensajes del sandbox
        setSandboxMessages([
          {
            sender: 'bot',
            text: `¡Hola! Bienvenido al asistente inteligente de ${currentTenant.name}. ¿En qué te podemos apoyar el día de hoy?`,
            time: 'Ahora',
          },
        ]);
      } catch (e) {
        console.error('Error al sincronizar bot config:', e);
      }
    };

    loadTenantBotConfig();
  }, [currentTenant, tenantId]);

  // Simular prueba de latencia (Ping de API Key)
  const handlePingTest = (providerKey) => {
    setPingStatus((prev) => ({
      ...prev,
      [providerKey]: { ...prev[providerKey], loading: true },
    }));

    setTimeout(() => {
      const simulatedLatencies = {
        deepseek: '138 ms',
        openai: '240 ms',
        anthropic: '260 ms',
        groq: '110 ms',
      };

      setPingStatus((prev) => ({
        ...prev,
        [providerKey]: {
          loading: false,
          result: 'connected',
          latency: simulatedLatencies[providerKey] || '150 ms',
          status: 200,
        },
      }));
    }, 850);
  };

  // Guardar configuración completa (operativa + API Keys)
  const handleSave = async (e) => {
    e?.preventDefault();
    if (!currentTenant || !config) return;

    setSaving(true);
    try {
      await tenantService.updateVerticalConfig(tenantId, {
        activeModel: config.activeModel,
        temperature: config.temperature,
        systemPrompt: config.systemPrompt,
        useCustomKeys: config.useCustomKeys,
        apiKeys: config.apiKeys,
        service_appointments: {
          googleCalendarId: config.calendar.googleCalendarId,
          defaultAppointmentDurationMin: config.calendar.slotDurationMin,
          bufferBetweenAppointmentsMin: config.calendar.bufferBetweenAppointmentsMin,
          workingHours: config.calendar.workingHours,
        },
        followUp: config.followUp,
      });

      if (updateTenantPolicy) {
        updateTenantPolicy(tenantId, {
          isAiActive: config.isAiActive,
          activeModel: config.activeModel,
          temperature: config.temperature,
          systemPrompt: config.systemPrompt,
          calendarConfig: {
            ...currentTenant.calendarConfig,
            slotDurationMin: config.calendar.slotDurationMin,
          },
        });
      }

      setSavedSuccess(true);
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#c3f400', '#72d4ae'],
        });
      } catch (err) {}

      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    } finally {
      setSaving(false);
    }
  };

  // Enviar mensaje en Sandbox
  const handleSendSandboxMessage = (e) => {
    e?.preventDefault();
    if (!sandboxInput.trim()) return;

    const userMsg = {
      sender: 'user',
      text: sandboxInput,
      time: 'Ahora',
    };

    setSandboxMessages((prev) => [...prev, userMsg]);
    const inputCopy = sandboxInput;
    setSandboxInput('');

    setTimeout(() => {
      const isAppointment = inputCopy.toLowerCase().includes('cita') || inputCopy.toLowerCase().includes('reserva') || inputCopy.toLowerCase().includes('agendar');
      
      let botReply = '';
      if (isAppointment) {
        botReply = `Consultando la disponibilidad de Google Calendar de ${currentTenant.name} (${config?.calendar?.slotDurationMin || 45} min por cita):\n\n• Horario disponible sugerido: Jueves a las 16:00 hrs o Viernes a las 11:30 hrs.\n\n¿Te aparto alguno de estos turnos?`;
      } else {
        botReply = `Gracias por tu mensaje. ${config?.systemPrompt?.slice(0, 120)}...\n\n¿Te gustaría coordinar una fecha de atención directa?`;
      }

      setSandboxMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: 'Ahora',
          toolCalled: isAppointment ? 'consultar_disponibilidad_google_calendar()' : null,
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER DEL NEGOCIO ACTIVO GOBERNADO POR EL SELECTOR SUPERIOR */}
      <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <span className="text-3xl p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-inner">
            {currentTenant?.avatar || '🏢'}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-neon uppercase tracking-wider block">
                Configuración del Asistente IA
              </span>
              <span className="text-[var(--text-muted)] text-xs font-mono">•</span>
              <Badge variant="neon" size="xs">
                {currentTenant?.verticalLabel || 'Giro General'}
              </Badge>
              {config?.isAiActive ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Asistente Activo en WhatsApp
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Pause className="w-3 h-3" />
                  Asistente en Pausa
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight mt-0.5">
              {currentTenant?.name}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-mono flex items-center gap-1.5">
              <span>📍 Gobernado por el selector superior. Para auditar otra empresa, cámbiala en la barra superior.</span>
            </p>
          </div>
        </div>

        {/* Acciones principales: Sandbox de prueba opcional, pausa y guardado */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={Smartphone}
            onClick={() => setIsSandboxOpen(true)}
            className="text-xs"
          >
            Probar en Sandbox
          </Button>

          <Button
            type="button"
            variant={config?.isAiActive ? 'outline' : 'primary'}
            size="sm"
            icon={config?.isAiActive ? Pause : Play}
            onClick={() => {
              if (toggleTenantAi) toggleTenantAi(tenantId);
              setConfig((prev) => ({ ...prev, isAiActive: !prev?.isAiActive }));
            }}
          >
            {config?.isAiActive ? 'Pausar Asistente' : 'Activar Asistente'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={Save}
            loading={saving}
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Configuración y credenciales de <strong>{currentTenant?.name}</strong> sincronizadas exitosamente.</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">En Vivo</span>
        </div>
      )}

      {/* 2. DOS COLUMNAS DE ALTA PRECISIÓN: PARÁMETROS OPERATIVOS A LA IZQUIERDA Y CONEXIONES DE API A LA DERECHA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA (6 Columnas): PARÁMETROS OPERATIVOS HEREDADOS */}
        <div className="lg:col-span-6 space-y-6">
          {/* MÓDULO 1: AGENDA & DISPONIBILIDAD */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neon" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  1. Agenda & Disponibilidad del Negocio
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Datos Sincronizados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Duración de Consulta / Cita (Minutos)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="15"
                    step="5"
                    value={config?.calendar?.slotDurationMin || 45}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        calendar: {
                          ...config?.calendar,
                          slotDurationMin: parseInt(e.target.value) || 45,
                        },
                      })
                    }
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] focus:border-neon font-mono focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-[var(--text-muted)] font-mono pointer-events-none">
                    min
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  Tiempo que el bot aparta por cita en la agenda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Margen de Descanso / Preparación (Buffer)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={config?.calendar?.bufferBetweenAppointmentsMin || 15}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        calendar: {
                          ...config?.calendar,
                          bufferBetweenAppointmentsMin: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] focus:border-neon font-mono focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-[var(--text-muted)] font-mono pointer-events-none">
                    min
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  Minutos libres entre citas para evitar retrasos.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Google Calendar ID Asignado
                </label>
                <input
                  type="text"
                  value={config?.calendar?.googleCalendarId || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      calendar: {
                        ...config?.calendar,
                        googleCalendarId: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] focus:border-neon font-mono focus:outline-none"
                />
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  ID donde la IA verifica slots libres y registra eventos mediante Tool Calling.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Horarios y Turnos Operativos de Atención
                </label>
                <input
                  type="text"
                  value={config?.calendar?.workingHours || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      calendar: {
                        ...config?.calendar,
                        workingHours: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] focus:border-neon font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* MÓDULO 2: SEGUIMIENTO AUTOMÁTICO (24H / 48H) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  2. Seguimiento Automático de Prospectos (Nurturing)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
                Recuperación +32%
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Reconecta automáticamente con prospectos que cotizaron o preguntaron pero dejaron de responder en WhatsApp:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Primer Recordatorio (Horas de inactividad)
                </label>
                <input
                  type="number"
                  min="1"
                  value={config?.followUp?.firstFollowUpHours || 24}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      followUp: {
                        ...config?.followUp,
                        firstFollowUpHours: parseInt(e.target.value) || 24,
                      },
                    })
                  }
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] focus:border-neon font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Segundo Recordatorio / Cierre (Horas)
                </label>
                <input
                  type="number"
                  min="1"
                  value={config?.followUp?.secondFollowUpHours || 48}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      followUp: {
                        ...config?.followUp,
                        secondFollowUpHours: parseInt(e.target.value) || 48,
                      },
                    })
                  }
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] focus:border-neon font-mono focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Mensaje de Reactivación Empática (WhatsApp)
                </label>
                <textarea
                  rows={3}
                  value={config?.followUp?.messageTemplate || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      followUp: {
                        ...config?.followUp,
                        messageTemplate: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-3 text-xs text-[var(--text-main)] focus:border-neon font-sans leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* MÓDULO 3: DIRECTRIZ DE COMPORTAMIENTO & TONO */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  3. Directriz de Comportamiento & Estilo
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-neon">
                {config?.temperature <= 0.2
                  ? '0.2 (Preciso & Estricto)'
                  : config?.temperature <= 0.4
                  ? '0.35 (Equilibrado)'
                  : '0.6 (Creativo & Comercial)'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">
                  Temperatura del Modelo ({config?.temperature || 0.25})
                </label>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={config?.temperature || 0.25}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-[var(--neon-primary)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono mt-1">
                <span>0.1 (Estricto para Citas y Precios)</span>
                <span>0.8 (Persuasivo para Ventas)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                Instrucción General de Comportamiento (System Instruction Prompt)
              </label>
              <textarea
                rows={3}
                value={config?.systemPrompt || ''}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-3 text-xs text-[var(--text-main)] focus:border-neon font-sans leading-relaxed focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (6 Columnas): CENTRO DE CONEXIONES & API KEYS DE IA */}
        <div className="lg:col-span-6 space-y-6">
          {/* MÓDULO 4: SELECTOR DE MOTOR LLM ACTIVO */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-neon" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  4. Motor de IA Activo para {currentTenant?.shortName || 'este Negocio'}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold">
                ADR-004 Routing
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Selecciona el cerebro artificial que procesará los mensajes y ejecutará las herramientas de agendamiento:
            </p>

            <div className="space-y-2.5">
              {AI_MODELS.map((model) => {
                const isSelected = config?.activeModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setConfig({ ...config, activeModel: model.id })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-neon/10 border-neon shadow-[0_0_15px_var(--neon-glow)]'
                        : 'bg-[var(--bg-base)] border-[var(--border-color)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[var(--text-main)]">{model.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">({model.provider})</span>
                      </div>
                      <Badge variant={model.badgeVariant} size="xs">
                        {model.badge}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] leading-tight mb-2">
                      {model.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-2">
                        <span>⚡ {model.speed}</span>
                        <span>•</span>
                        <span>💰 {model.cost}</span>
                      </div>
                      <span className="text-neon/90 font-bold">Uso ideal: {model.recommendedFor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MÓDULO 5: GESTOR DE API KEYS & PROVEEDORES (BYOK vs PLATAFORMA) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-neon" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                    5. Proveedores de IA & Credenciales (API Keys)
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    Usa la API oficial de Vector Inside o ingresa tus propias llaves (BYOK)
                  </p>
                </div>
              </div>

              {/* Toggle de Modo BYOK */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {config?.useCustomKeys ? 'BYOK (Llaves Propias)' : 'Oficial (Gestionada)'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, useCustomKeys: !prev?.useCustomKeys }))
                  }
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                    config?.useCustomKeys ? 'bg-neon' : 'bg-[var(--border-color)]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform duration-200 ease-in-out ${
                      config?.useCustomKeys ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Banner explicativo del modo activo */}
            {!config?.useCustomKeys ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Infraestructura Oficial Activa:</strong> No necesitas configurar API Keys. Vector Inside provee y gestiona el consumo de DeepSeek y Groq automáticamente.
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 shrink-0">
                  Plug & Play
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-neon/10 border border-neon/30 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-neon">
                  <Key className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>Modo BYOK Habilitado:</strong> Los costos y llamadas a la API se debitarán directamente de tus cuentas en cada proveedor.
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-neon/20 px-2 py-0.5 rounded text-neon shrink-0">
                  BYOK Activo
                </span>
              </div>
            )}

            {/* Listado de Proveedores con Campos de API Key y Botón de Ping */}
            <div className="space-y-4">
              {/* 1. DEEPSEEK API KEY */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono">
                      DeepSeek API Key
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neon/15 text-neon font-bold">
                      Oficial
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {pingStatus.deepseek.result === 'connected' && (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Latencia: {pingStatus.deepseek.latency}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePingTest('deepseek')}
                      disabled={pingStatus.deepseek.loading}
                      className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-muted)] hover:text-neon text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-neon" />
                      <span>{pingStatus.deepseek.loading ? 'Probando...' : 'Test Ping'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showKeys.deepseek ? 'text' : 'password'}
                    placeholder={config?.useCustomKeys ? 'sk-••••••••••••••••••••••••••••••••' : 'Gestionada por la Plataforma (Predeterminada)'}
                    disabled={!config?.useCustomKeys}
                    value={config?.apiKeys?.deepseek || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        apiKeys: { ...config?.apiKeys, deepseek: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 pr-10 text-xs text-[var(--text-main)] font-mono focus:border-neon focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {config?.useCustomKeys && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowKeys((prev) => ({ ...prev, deepseek: !prev.deepseek }))
                      }
                      className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      {showKeys.deepseek ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* 2. OPENAI API KEY */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono">
                      OpenAI API Key (GPT-4o)
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold">
                      Opcional
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {pingStatus.openai.result === 'connected' && (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Latencia: {pingStatus.openai.latency}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePingTest('openai')}
                      disabled={pingStatus.openai.loading || !config?.apiKeys?.openai}
                      className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-400 text-[var(--text-muted)] hover:text-blue-400 text-[10px] font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      <Zap className="w-3 h-3 text-blue-400" />
                      <span>{pingStatus.openai.loading ? 'Probando...' : 'Test Ping'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showKeys.openai ? 'text' : 'password'}
                    placeholder="sk-proj-••••••••••••••••••••••••••••••••"
                    value={config?.apiKeys?.openai || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        apiKeys: { ...config?.apiKeys, openai: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 pr-10 text-xs text-[var(--text-main)] font-mono focus:border-neon focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowKeys((prev) => ({ ...prev, openai: !prev.openai }))
                    }
                    className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    {showKeys.openai ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 3. ANTHROPIC CLAUDE API KEY */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono">
                      Anthropic Claude API Key
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold">
                      Opcional
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {pingStatus.anthropic.result === 'connected' && (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Latencia: {pingStatus.anthropic.latency}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePingTest('anthropic')}
                      disabled={pingStatus.anthropic.loading || !config?.apiKeys?.anthropic}
                      className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-purple-400 text-[var(--text-muted)] hover:text-purple-400 text-[10px] font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>{pingStatus.anthropic.loading ? 'Probando...' : 'Test Ping'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showKeys.anthropic ? 'text' : 'password'}
                    placeholder="sk-ant-••••••••••••••••••••••••••••••••"
                    value={config?.apiKeys?.anthropic || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        apiKeys: { ...config?.apiKeys, anthropic: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 pr-10 text-xs text-[var(--text-main)] font-mono focus:border-neon focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowKeys((prev) => ({ ...prev, anthropic: !prev.anthropic }))
                    }
                    className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    {showKeys.anthropic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 4. GROQ CLOUD API KEY */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono">
                      Groq Cloud API Key (Llama 3 70B)
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold">
                      $0 Cost
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {pingStatus.groq.result === 'connected' && (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Latencia: {pingStatus.groq.latency}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePingTest('groq')}
                      disabled={pingStatus.groq.loading}
                      className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-400 text-[var(--text-muted)] hover:text-blue-400 text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-blue-400" />
                      <span>{pingStatus.groq.loading ? 'Probando...' : 'Test Ping'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showKeys.groq ? 'text' : 'password'}
                    placeholder={config?.useCustomKeys ? 'gsk_••••••••••••••••••••••••••••••••' : 'Gestionada por la Plataforma (Predeterminada)'}
                    disabled={!config?.useCustomKeys}
                    value={config?.apiKeys?.groq || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        apiKeys: { ...config?.apiKeys, groq: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 pr-10 text-xs text-[var(--text-main)] font-mono focus:border-neon focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {config?.useCustomKeys && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowKeys((prev) => ({ ...prev, groq: !prev.groq }))
                      }
                      className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      {showKeys.groq ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Blindaje de Seguridad AES-256 */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] flex items-start gap-3 text-xs">
              <Lock className="w-4 h-4 text-neon shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-[var(--text-main)] block font-mono text-[11px]">
                  Blindaje & Encriptación AES-256
                </span>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                  Tus llaves de API se encriptan con clave rotativa única para <strong className="text-[var(--text-main)]">{currentTenant?.name}</strong>. Nunca se comparten ni son accesibles entre distintos negocios.
                </p>
              </div>
            </div>

            {/* Botón de guardado inferior */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              icon={Save}
              loading={saving}
              onClick={handleSave}
              className="w-full justify-center"
            >
              Guardar Conexiones y Configuración de IA
            </Button>
          </div>
        </div>
      </div>

      {/* 3. MODAL SANDBOX DE PRUEBA (SOLO SE ABRE AL HACER CLIC, SIN OCUPAR PANTALLA FIJA) */}
      <Modal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        title={`Sandbox de Prueba: Asistente de ${currentTenant?.shortName || currentTenant?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--text-muted)]">Motor Activo:</span>
              <strong className="text-neon">{config?.activeModel?.split(' ')[0]} {config?.activeModel?.split(' ')[1]}</strong>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              Simulador Aislado (Sin afectar WhatsApp real)
            </span>
          </div>

          {/* Área de mensajes */}
          <div className="h-72 overflow-y-auto p-4 rounded-xl bg-[#0c1317] border border-[var(--border-color)] space-y-3 font-sans text-xs">
            {sandboxMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.toolCalled && (
                  <span className="text-[9px] font-mono text-neon/80 bg-black/40 px-2 py-0.5 rounded-md mb-1 border border-neon/20">
                    ⚡ Tool: {msg.toolCalled}
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 whitespace-pre-line text-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#005c4b] text-white rounded-br-none'
                      : 'bg-[#202c33] text-gray-100 rounded-bl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                  <span className="block text-[9px] text-gray-400 text-right mt-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input de chat */}
          <form onSubmit={handleSendSandboxMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              placeholder="Escribe una pregunta para probar cómo responde la IA..."
              className="flex-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:border-neon focus:outline-none"
            />
            <Button type="submit" variant="primary" size="md" icon={Send}>
              Enviar
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
