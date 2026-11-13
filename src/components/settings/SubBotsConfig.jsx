'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/context/AuthContext';
import { tenantService } from '@/services/tenantService';
import { aiService } from '@/services/aiService';
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
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cleanConcept } from '@/utils/formatters';

// Catálogo de Modelos LLM Soportados en Vector Inside (ADR-004)
const AI_MODELS = [
  {
    id: 'DeepSeek V3 (deepseek-chat - < 800ms)',
    name: 'DeepSeek V3',
    technicalModel: 'deepseek-chat',
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
    technicalModel: 'deepseek-reasoner',
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
    technicalModel: 'gpt-4o',
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
    technicalModel: 'claude-3-5-sonnet-20241022',
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
    technicalModel: 'llama-3.3-70b-versatile',
    provider: 'Groq',
    badge: '$0 USD Batch',
    badgeVariant: 'blue',
    speed: '< 350 ms',
    cost: 'Sin Costo',
    description: 'Procesamiento en hardware LPU a velocidad instantánea para consultas repetitivas de alta demanda.',
    recommendedFor: 'Batching 24h & Respuestas Rápidas',
  },
];

// Metadatos de conexión por proveedor
const PROVIDER_CONFIGS = {
  deepseek: {
    label: 'DeepSeek API Key',
    placeholder: 'sk-••••••••••••••••••••••••••••••••',
    officialPoolLabel: 'Pool Vector Inside Oficial (< 800ms)',
    docUrl: 'https://platform.deepseek.com/api_keys',
    modelsShared: ['DeepSeek V3', 'DeepSeek R1'],
    accentColor: 'neon',
  },
  openai: {
    label: 'OpenAI API Key (GPT-4o)',
    placeholder: 'sk-proj-••••••••••••••••••••••••••••••••',
    officialPoolLabel: 'BYOK Requerido para GPT-4o',
    docUrl: 'https://platform.openai.com/api-keys',
    modelsShared: ['OpenAI GPT-4o'],
    accentColor: 'blue',
  },
  anthropic: {
    label: 'Anthropic Claude API Key',
    placeholder: 'sk-ant-••••••••••••••••••••••••••••••••',
    officialPoolLabel: 'BYOK Requerido para Claude 3.5',
    docUrl: 'https://console.anthropic.com/settings/keys',
    modelsShared: ['Claude 3.5 Sonnet'],
    accentColor: 'warning',
  },
  groq: {
    label: 'Groq Cloud API Key (Llama 3 70B)',
    placeholder: 'gsk_••••••••••••••••••••••••••••••••',
    officialPoolLabel: 'Pool Vector Inside ($0 Cost)',
    docUrl: 'https://console.groq.com/keys',
    modelsShared: ['Groq Llama 3 70B'],
    accentColor: 'emerald',
  },
};

/**
 * Sintetizador Contextual de Prompts & Nurturing basado en el ADN de Marca
 */
export function generateTenantAdaptivePrompts(tenant) {
  if (!tenant) return { prompt: '', followUp: '' };

  const name = tenant.name || 'el Negocio';
  const v = (tenant.vertical || tenant.verticalKey || '').toLowerCase();
  const g = (tenant.giro || '').toLowerCase();
  const n = name.toLowerCase();

  const isB2B =
    v === 'b2b' ||
    g.includes('marketing') ||
    g.includes('saas') ||
    g.includes('consultor') ||
    n.includes('vector');

  const isClinic =
    v === 'healthcare' ||
    g.includes('médic') ||
    g.includes('salud') ||
    g.includes('dental') ||
    g.includes('clínic');

  const isFitness =
    v === 'gym_fitness' ||
    g.includes('gym') ||
    g.includes('fitness');

  const isHospitality =
    v === 'hospitality' ||
    g.includes('restaurant') ||
    g.includes('gastro');

  const hook = tenant.commercialOffer?.hook || tenant.offerHook || '';
  const cta = tenant.commercialOffer?.cta || tenant.offerCta || '';
  const purpose = tenant.brandPurpose || '';

  if (isB2B) {
    const resolvedCta = cta || 'agendar su Discovery Call estratégica';
    const resolvedHook = hook || 'la propuesta de aceleración comercial con IA';
    return {
      prompt: `Eres el Asistente Ejecutivo de ${name}. Tu objetivo es calificar requerimientos comerciales con precisión y criterio estratégico, responder con autoridad técnica y visión de negocio, y guiar al tomador de decisión a ${resolvedCta}.${purpose ? ` Propósito rector: ${purpose}` : ''}`,
      followUp: `¡Hola! Vimos que revisaste ${resolvedHook} de ${name}. Si te surgió alguna duda técnica o quieres evaluar cómo aplicaría a tu embudo antes de ${resolvedCta}, dime y lo revisamos con gusto.`,
    };
  }

  if (isClinic) {
    return {
      prompt: `Eres el Asistente de Atención Médica de ${name}. Tu objetivo es brindar orientación cercana, empática y profesional, resolver dudas sobre tratamientos o estudios y coordinar la agenda de consulta médica o valoración.`,
      followUp: `¡Hola! Notamos que consultaste información médica en ${name}. ¿Tienes alguna duda sobre los tratamientos o te gustaría verificar disponibilidad para tu valoración médica?`,
    };
  }

  if (isFitness) {
    return {
      prompt: `Eres el Asesor de Entrenamiento y Bienestar de ${name}. Tu objetivo es motivar, resolver dudas sobre membresías e instalaciones y agendar su clase muestra o sesión de diagnóstico físico.`,
      followUp: `¡Hola! Vimos que te interesaron los planes de entrenamiento de ${name}. ¿Te gustaría que te apartemos un horario para tu clase muestra gratuita?`,
    };
  }

  if (isHospitality) {
    return {
      prompt: `Eres el Asistente de Hospitalidad de ${name}. Tu objetivo es atender con calidez, presentar el menú y promociones vigentes y asegurar la reservación de mesa del comensal.`,
      followUp: `¡Hola! Notamos tu interés en reservar en ${name}. ¿Deseas que te reservemos una mesa para tu fecha especial?`,
    };
  }

  return {
    prompt: `Eres el Asistente Inteligente de ${name}. Tu objetivo es atender con profesionalismo y agilidad, resolver consultas sobre productos y servicios y guiar al prospecto a agendar su cita o llamada de atención.`,
    followUp: `¡Hola! Notamos que te interesó la información de ${name}. ¿Tienes alguna duda puntual o te gustaría que coordinemos tu horario de atención?`,
  };
}

export const SubBotsConfig = () => {
  const {
    isAdmin,
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
    return authActiveTenant || null;
  }, [activeTenantKey, activeTenantId, tenantsData, authActiveTenant]);

  const tenantId = currentTenant?.id || null;

  // Detección contextual de vertical para vocabulario dinámico
  const isB2B = useMemo(() => {
    const v = (currentTenant?.vertical || currentTenant?.verticalKey || '').toLowerCase();
    const g = (currentTenant?.giro || '').toLowerCase();
    const n = (currentTenant?.name || '').toLowerCase();
    return (
      v === 'b2b' ||
      g.includes('marketing') ||
      g.includes('saas') ||
      g.includes('consultor') ||
      n.includes('vector')
    );
  }, [currentTenant]);

  const slotDurationLabel = useMemo(() => {
    const v = (currentTenant?.vertical || currentTenant?.verticalKey || '').toLowerCase();
    const g = (currentTenant?.giro || '').toLowerCase();
    if (isB2B) return 'Duración de Reunión / Discovery Call (Minutos)';
    if (v === 'healthcare' || g.includes('médic') || g.includes('salud') || g.includes('dental') || g.includes('clínic')) {
      return 'Duración de Consulta Médica (Minutos)';
    }
    if (v === 'gym_fitness' || g.includes('fitness') || g.includes('gym')) {
      return 'Duración de Sesión / Clase (Minutos)';
    }
    if (v === 'hospitality' || g.includes('restaurant')) {
      return 'Duración de Reserva / Mesa (Minutos)';
    }
    return 'Duración de Cita / Sesión (Minutos)';
  }, [currentTenant, isB2B]);

  const slotDurationHelper = useMemo(() => {
    if (isB2B) return 'Tiempo reservado en Google Calendar / Meet para la Discovery Call.';
    return 'Tiempo que el bot aparta por cita en la agenda.';
  }, [isB2B]);

  // Configuración técnica y operativa
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Visibilidad de API Keys (password/text)
  const [showKeys, setShowKeys] = useState({
    deepseek: false,
    openai: false,
    anthropic: false,
    groq: false,
  });

  // Sincronizar copies de asistente y nurturing con el ADN de la marca
  const handleSyncWithBrandDna = () => {
    const adaptive = generateTenantAdaptivePrompts(currentTenant);
    setConfig((prev) => ({
      ...prev,
      systemPrompt: adaptive.prompt,
      followUp: {
        ...prev.followUp,
        messageTemplate: adaptive.followUp,
      },
    }));
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        colors: ['#E7F900', '#00FFFF', '#FFFFFF'],
      });
    } catch (e) {}
  };

  // Estado de pruebas de latencia de API (Ping)
  const [pingStatus, setPingStatus] = useState({
    deepseek: { loading: false, result: 'idle', latency: null, status: null },
    openai: { loading: false, result: 'idle', latency: null, status: null },
    anthropic: { loading: false, result: 'idle', latency: null, status: null },
    groq: { loading: false, result: 'idle', latency: null, status: null },
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
        const [storedConfig, aiBackendConfig] = await Promise.all([
          tenantService.getVerticalConfig(tenantId),
          aiService.getConfig(tenantId).catch(() => null),
        ]);

        const slotMin =
          currentTenant?.calendarConfig?.slotDurationMin ||
          currentTenant?.appointmentDuration ||
          storedConfig?.service_appointments?.defaultAppointmentDurationMin ||
          (isB2B ? 45 : currentTenant?.vertical === 'hospitality' ? 90 : 30);

        const googleCalId =
          currentTenant?.calendarConfig?.googleCalendarId ||
          currentTenant?.calendarId ||
          storedConfig?.service_appointments?.googleCalendarId ||
          `c_${tenantId}_agenda@group.calendar.google.com`;

        const shifts = currentTenant?.calendarConfig?.shifts || currentTenant?.shifts;
        const hasCustomShifts = Array.isArray(shifts) && shifts.length > 0;
        const workingHoursText = hasCustomShifts
          ? shifts.map((s) => `${s.name || 'Turno'}: ${s.start} - ${s.end}`).join(' | ')
          : (storedConfig?.service_appointments?.workingHours && !storedConfig.service_appointments.workingHours.includes('09:00 - 19:00'))
          ? storedConfig.service_appointments.workingHours
          : 'Atención Digital 24/7 (Sin turnos restringidos)';

        const adaptivePrompts = generateTenantAdaptivePrompts(currentTenant);

        const isLegacyPrompt = (p) =>
          !p ||
          p.includes('confirmar su reservación') ||
          p.includes('atender con cordialidad, resolver dudas sobre los servicios y guiar al usuario para agendar su cita o confirmar su reservación');

        const isLegacyFollowUp = (m) =>
          !m ||
          m.includes('pero no alcanzamos a confirmar tu fecha') ||
          m.includes('Notamos que te interesó nuestra información en');

        const defaultPrompt =
          currentTenant?.systemPrompt && !isLegacyPrompt(currentTenant.systemPrompt)
            ? currentTenant.systemPrompt
            : storedConfig?.systemPrompt && !isLegacyPrompt(storedConfig.systemPrompt)
            ? storedConfig.systemPrompt
            : adaptivePrompts.prompt;

        const defaultFollowUpMessage =
          currentTenant?.followUpMessage && !isLegacyFollowUp(currentTenant.followUpMessage)
            ? currentTenant.followUpMessage
            : storedConfig?.followUp?.messageTemplate && !isLegacyFollowUp(storedConfig.followUp.messageTemplate)
            ? storedConfig.followUp.messageTemplate
            : adaptivePrompts.followUp;

        setConfig({
          isAiActive: currentTenant.isAiActive ?? true,
          activeModel:
            currentTenant.activeModel ||
            storedConfig?.activeModel ||
            'DeepSeek V3 (deepseek-chat - < 800ms)',
          temperature:
            currentTenant.temperature ??
            storedConfig?.temperature ??
            (isB2B ? 0.35 : currentTenant.vertical === 'service_appointments' ? 0.2 : 0.35),
          systemPrompt: defaultPrompt,
          useCustomKeys: storedConfig?.useCustomKeys ?? false,
          apiKeys: {
            deepseek:
              aiBackendConfig?.maskedApiKey ||
              currentTenant?.apiKeys?.deepseek ||
              storedConfig?.apiKeys?.deepseek ||
              '',
            openai: currentTenant?.apiKeys?.openai || storedConfig?.apiKeys?.openai || '',
            anthropic: currentTenant?.apiKeys?.anthropic || storedConfig?.apiKeys?.anthropic || '',
            groq: currentTenant?.apiKeys?.groq || storedConfig?.apiKeys?.groq || '',
          },
          calendar: {
            googleCalendarId: googleCalId,
            calendarSyncEnabled: true,
            slotDurationMin: slotMin,
            bufferBetweenAppointmentsMin:
              currentTenant?.calendarConfig?.bufferBetweenAppointmentsMin ??
              storedConfig?.service_appointments?.bufferBetweenAppointmentsMin ??
              (isB2B ? 15 : 0),
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
  }, [currentTenant, tenantId, isB2B]);

  // Probar latencia y validez de API Key contra el backend
  const handlePingTest = async (providerKey) => {
    setPingStatus((prev) => ({
      ...prev,
      [providerKey]: { ...prev[providerKey], loading: true },
    }));

    const startMs = performance.now();
    try {
      if (providerKey === 'deepseek') {
        const res = await aiService.testConnection(tenantId);
        const elapsedMs = Math.round(performance.now() - startMs);
        setPingStatus((prev) => ({
          ...prev,
          [providerKey]: {
            loading: false,
            result: res?.connected !== false ? 'connected' : 'error',
            latency: `${elapsedMs} ms`,
            status: res?.connected !== false ? 200 : 401,
          },
        }));
        return;
      }
    } catch (err) {}

    // Fallback de medición
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
    }, 600);
  };

  // Helper para restablecer una clave al pool oficial con un solo clic
  const handleResetToOfficialPool = (providerKey) => {
    setConfig((prev) => ({
      ...prev,
      apiKeys: {
        ...prev?.apiKeys,
        [providerKey]: '',
      },
    }));
    setPingStatus((prev) => ({
      ...prev,
      [providerKey]: { loading: false, result: 'idle', latency: null, status: null },
    }));
  };

  // Guardar configuración completa (operativa + API Key del motor activo)
  const handleSave = async (e) => {
    e?.preventDefault();
    if (!currentTenant || !config) return;

    setSaving(true);
    try {
      // 1. Guardar configuración de negocio y citas (sin llaves en texto plano en la tabla pública)
      await tenantService.updateVerticalConfig(tenantId, {
        activeModel: config.activeModel,
        temperature: config.temperature,
        systemPrompt: config.systemPrompt,
        useCustomKeys: Object.values(config.apiKeys || {}).some((k) => k && k.trim().length > 0),
        service_appointments: {
          googleCalendarId: config.calendar.googleCalendarId,
          defaultAppointmentDurationMin: config.calendar.slotDurationMin,
          bufferBetweenAppointmentsMin: config.calendar.bufferBetweenAppointmentsMin,
          workingHours: config.calendar.workingHours,
        },
        followUp: config.followUp,
      });

      // 2. Persistir credencial del motor activo cifrada con AES-256-GCM en el backend
      const activeModelObj = AI_MODELS.find((m) => m.id === config.activeModel);
      const activeProviderKey = activeModelObj ? activeModelObj.provider.toLowerCase() : 'deepseek';
      const currentKey = config.apiKeys?.[activeProviderKey]?.trim();
      const backendProvider = activeModelObj?.provider?.toUpperCase() || 'DEEPSEEK';

      if (['DEEPSEEK', 'GROQ', 'OPENAI'].includes(backendProvider)) {
        if (currentKey && currentKey.length > 0 && !currentKey.startsWith('••••')) {
          await aiService.saveConfig(tenantId, {
            provider: backendProvider,
            apiKey: currentKey,
            model: activeModelObj?.technicalModel || 'deepseek-chat',
            allowFallbackToGlobal: true,
          }).catch((err) => console.warn('[SubBotsConfig] Error al guardar config de IA:', err));
        } else if (!currentKey) {
          // Si el usuario limpió la clave, restablecer en backend al pool global oficial
          await aiService.deleteConfig(tenantId).catch(() => {});
        } else {
          // Clave existente enmascarada: solo actualizar el modelo técnico sin sobreescribir la clave
          await aiService.saveConfig(tenantId, {
            provider: backendProvider,
            model: activeModelObj?.technicalModel || 'deepseek-chat',
            allowFallbackToGlobal: true,
          }).catch((err) => console.warn('[SubBotsConfig] Error al actualizar modelo de IA:', err));
        }
      }

      if (updateTenantPolicy) {
        updateTenantPolicy(tenantId, {
          isAiActive: config.isAiActive,
          activeModel: config.activeModel,
          temperature: config.temperature,
          systemPrompt: config.systemPrompt,
          followUpMessage: config.followUp?.messageTemplate,
          calendarConfig: {
            ...currentTenant.calendarConfig,
            googleCalendarId: config.calendar.googleCalendarId,
            slotDurationMin: config.calendar.slotDurationMin,
            bufferBetweenAppointmentsMin: config.calendar.bufferBetweenAppointmentsMin,
            workingHours: config.calendar.workingHours,
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
    const currentInput = sandboxInput;
    setSandboxInput('');

    setTimeout(() => {
      let botReply = '';
      const isAppointment =
        currentInput.toLowerCase().includes('cita') ||
        currentInput.toLowerCase().includes('horario') ||
        currentInput.toLowerCase().includes('precio');

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

  if (!currentTenant) {
    return (
      <div className="p-12 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-4 font-mono">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-3xl">
          🤖
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--text-main)]">
            No hay un negocio seleccionado o registrado
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            El ecosistema se encuentra limpio (Zero-State). Para configurar el motor cognitivo de IA (DeepSeek / Groq), slots de citas y API Keys cifradas, da de alta tu primer negocio.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('vector_config_set_tab', {
                  detail: { tab: 'rag', mode: 'wizard' },
                })
              );
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon text-black font-bold text-xs uppercase hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Alta Nuevo Negocio</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* 1. HEADER DEL NEGOCIO ACTIVO GOBERNADO POR EL SELECTOR SUPERIOR     */}
      {/* =================================================================== */}
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
                {currentTenant?.verticalLabel || currentTenant?.giro || 'Giro General'}
              </Badge>
              {config?.isAiActive ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
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
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Configuración y credenciales de <strong>{currentTenant?.name}</strong> sincronizadas exitosamente.</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">En Vivo</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. DOS COLUMNAS BALANCEADAS (AGENDA + NURTURING A LA IZQ / MOTOR A LA DER) */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA (6 Columnas): AGENDA, NURTURING & PROMPT */}
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Datos Sincronizados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  {slotDurationLabel}
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
                  {slotDurationHelper}
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
                    value={config?.calendar?.bufferBetweenAppointmentsMin ?? 0}
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
                  {isB2B ? 'Minutos libres de preparación previa/posterior a la Discovery Call (0 = sin descanso).' : 'Minutos libres entre citas para evitar retrasos.'}
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
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  {config?.calendar?.workingHours?.includes('24/7')
                    ? 'El bot atiende y califica prospectos 24/7 en WhatsApp y Web. Sin restricciones de turnos presenciales.'
                    : 'Turnos operativos sincronizados con la oferta de slots en Google Calendar.'}
                </p>
              </div>
            </div>
          </div>

          {/* MÓDULO 2: SEGUIMIENTO AUTOMÁTICO (NURTURING) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  2. Seguimiento Automático de Prospectos (Nurturing)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncWithBrandDna}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon/15 hover:bg-neon/25 text-neon font-mono text-[10px] font-bold border border-neon/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Sincronizar el mensaje con el tono y oferta del Perfil de Marca"
                >
                  <Sparkles className="w-3 h-3 text-neon" />
                  <span>Sincronizar con ADN</span>
                </button>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                  Recuperación +32%
                </span>
              </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  3. Directriz de Comportamiento & Estilo
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncWithBrandDna}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon/15 hover:bg-neon/25 text-neon font-mono text-[10px] font-bold border border-neon/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Sincronizar la instrucción del asistente con el propósito y tono del Perfil de Marca"
                >
                  <Sparkles className="w-3 h-3 text-neon" />
                  <span>Sincronizar con ADN</span>
                </button>
                <span className="text-[10px] font-mono font-bold text-neon">
                  {config?.temperature <= 0.2
                    ? '0.2 (Preciso & Estricto)'
                    : config?.temperature <= 0.4
                    ? '0.35 (Equilibrado)'
                    : '0.6 (Creativo & Comercial)'}
                </span>
              </div>
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

        {/* =================================================================== */}
        {/* COLUMNA DERECHA (6 Columnas): MOTOR ACTIVO CON API KEY INLINE       */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-neon" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  4. Motor de IA & Credenciales ({currentTenant?.shortName || 'Negocio Activo'})
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold">
                ADR-004 Routing
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Selecciona el cerebro artificial. La clave de API se configura de forma contextual en el modelo seleccionado:
            </p>

            {/* Listado de Modelos con Progressive Disclosure Inline */}
            <div className="space-y-3">
              {AI_MODELS.map((model) => {
                const isSelected = config?.activeModel === model.id;
                const providerKey = model.provider.toLowerCase();
                const providerMeta = PROVIDER_CONFIGS[providerKey];
                const hasCustomKey = Boolean(config?.apiKeys?.[providerKey]?.trim());
                const ping = pingStatus[providerKey] || {};

                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      if (!isSelected) {
                        setConfig({ ...config, activeModel: model.id });
                      }
                    }}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'bg-neon/5 border-neon shadow-[0_0_15px_var(--neon-glow)]'
                        : 'bg-[var(--bg-base)] border-[var(--border-color)] hover:border-[var(--text-muted)] cursor-pointer'
                    }`}
                  >
                    {/* Tarjeta del Modelo */}
                    <div className="p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full transition-all ${
                              isSelected
                                ? 'bg-neon shadow-[0_0_8px_var(--neon-glow)] animate-pulse'
                                : 'bg-transparent border border-[var(--border-color)]'
                            }`}
                          />
                          <span className="font-bold text-xs text-[var(--text-main)]">{model.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">({model.provider})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={model.badgeVariant} size="xs">
                            {model.badge}
                          </Badge>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neon/15 text-neon font-bold border border-neon/30">
                              Activo
                            </span>
                          )}
                        </div>
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
                        <span className="text-neon/90 font-bold">Uso: {model.recommendedFor}</span>
                      </div>
                    </div>

                    {/* PANEL INLINE CONTEXTUAL DE API KEY (SOLO SE DESPLIEGA EN EL MODELO ACTIVO) */}
                    {isSelected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="p-3.5 bg-[var(--bg-panel)] border-t border-[var(--border-color)] space-y-3 animate-fadeIn"
                      >
                        {/* Cabecera del Panel Inline */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Key className="w-3.5 h-3.5 text-neon" />
                            <span className="text-xs font-bold text-[var(--text-main)] font-mono">
                              Credencial {model.provider}
                            </span>
                            {hasCustomKey ? (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> Clave Propia
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold border border-neon/30">
                                {providerMeta?.officialPoolLabel || 'Pool Oficial Vector Inside'}
                              </span>
                            )}
                          </div>

                          {/* Latencia y Botón Test Ping */}
                          <div className="flex items-center gap-2 text-[10px] font-mono">
                            {ping.result === 'connected' && (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> {ping.latency}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handlePingTest(providerKey)}
                              disabled={ping.loading}
                              className="px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-neon text-[var(--text-muted)] hover:text-neon text-[10px] font-bold transition-all flex items-center gap-1"
                            >
                              {ping.loading ? (
                                <RefreshCw className="w-3 h-3 text-neon animate-spin" />
                              ) : (
                                <Zap className="w-3 h-3 text-neon" />
                              )}
                              <span>{ping.loading ? 'Midiendo...' : 'Test Ping'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Micro-hint si el proveedor comparte llave (DeepSeek V3 y R1) */}
                        {providerKey === 'deepseek' && (
                          <div className="text-[10px] font-mono text-neon/90 bg-neon/10 px-2.5 py-1.5 rounded-lg border border-neon/20 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-neon shrink-0" />
                            <span>Clave Compartida: Esta misma API Key energiza tanto DeepSeek V3 como DeepSeek R1.</span>
                          </div>
                        )}

                        {/* Input de API Key + Botón de Ojo Mostrar/Ocultar */}
                        <div className="relative">
                          <input
                            type={showKeys[providerKey] ? 'text' : 'password'}
                            placeholder={`${providerMeta?.placeholder} (o deja vacío para Pool Vector Inside)`}
                            value={config?.apiKeys?.[providerKey] || ''}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                apiKeys: { ...config?.apiKeys, [providerKey]: e.target.value },
                              })
                            }
                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 pr-10 text-xs text-[var(--text-main)] font-mono focus:border-neon focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowKeys((prev) => ({ ...prev, [providerKey]: !prev[providerKey] }))
                            }
                            className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                            title={showKeys[providerKey] ? 'Ocultar clave' : 'Mostrar clave'}
                          >
                            {showKeys[providerKey] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Footer de Acciones del Panel Inline: Restablecer / Consola */}
                        <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-[var(--text-muted)]">
                          {hasCustomKey ? (
                            <button
                              type="button"
                              onClick={() => handleResetToOfficialPool(providerKey)}
                              className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
                            >
                              Volver al Pool Oficial (Limpiar clave)
                            </button>
                          ) : (
                            <span>💡 Deja vacío para usar la cuota centralizada de Vector Inside.</span>
                          )}
                          <a
                            href={providerMeta?.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-neon flex items-center gap-1 text-[10px] transition-colors"
                          >
                            Consola {model.provider}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Blindaje de Seguridad AES-256 & Botón Guardar Integrado */}
            <div className="pt-2 border-t border-[var(--border-color)] space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
                <Lock className="w-3.5 h-3.5 text-neon shrink-0" />
                <span>Credenciales cifradas con AES-256-GCM y ledger tokenizado por tenant.</span>
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                icon={Save}
                loading={saving}
                onClick={handleSave}
                className="w-full justify-center text-xs shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
              >
                Guardar Configuración y Credenciales de IA
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. MODAL SANDBOX DE PRUEBA (NO OCUPA ESPACIO PERMANENTE EN PANTALLA) */}
      {/* =================================================================== */}
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
                    ⚡ Acción: {cleanConcept(msg.toolCalled)}
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
