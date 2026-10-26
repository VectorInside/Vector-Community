'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Network,
  Shield,
  BarChart2,
  Sparkles,
  Zap,
  CheckCircle2,
  Activity,
  Cpu,
  ArrowDown,
  Clock,
  Coins,
  Copy,
  Check,
  Eye,
  Sliders,
  Play,
  RotateCcw,
  Target,
  FileCode,
  Flame,
  ChevronRight,
  ExternalLink,
  Layers,
  X,
  HelpCircle,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portal } from '@/components/common/Portal';
import {
  SUB_AGENTS_CONFIG,
  MARKETING_FRAMEWORKS_REGISTRY,
} from '@/utils/constants';
import { SUB_AGENTS_METRICS_MOCK } from '@/utils/mockData';
import { AgentOrchestrationReportModal } from './AgentOrchestrationReportModal';

export const OrchestrationView = () => {
  const { activeTenant, triggerModal } = useAuth();
  const [selectedAgentKey, setSelectedAgentKey] = useState(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('prompt'); // 'prompt' | 'schema' | 'framework' | 'simulation'
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationOutput, setSimulationOutput] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState('graph'); // 'graph' | 'matrix'
  const [showReportModal, setShowReportModal] = useState(false);

  const selectedAgent = selectedAgentKey ? SUB_AGENTS_CONFIG[selectedAgentKey] : null;
  const metrics = selectedAgentKey ? SUB_AGENTS_METRICS_MOCK[selectedAgentKey] : null;

  const handleOpenInspector = (key) => {
    setSelectedAgentKey(key);
    setActiveInspectorTab('prompt');
    setSimulationOutput(null);
    setIsSimulating(false);
  };

  const handleCloseInspector = () => {
    setSelectedAgentKey(null);
    setSimulationOutput(null);
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunSimulation = (agentKey) => {
    setIsSimulating(true);
    setSimulationOutput(null);

    const tenantId = activeTenant?.id || 'dental';
    const tenantName = activeTenant?.name || 'Odontología Integral';

    setTimeout(() => {
      setIsSimulating(false);
      if (agentKey === 'supervisor') {
        const supervisorData = {
          dental: {
            tenant_id: 'dental',
            target_agent: 'Sub-Agente Moderador de Cierre',
            intent_category: 'Consulta de Precios y Aranceles',
            detected_prospect: 'Carlos Mendoza',
            confidence_score: 0.985,
            execution_time_ms: 12,
            caching_hit: true,
            token_cost_usd: '$0.0000 (Prompt Caching 100%)',
            routing_reason: 'Prospecto consulta costo de profilaxis ultrasónica. Canaliza a Closer con RAG dental.',
          },
          polanco: {
            tenant_id: 'polanco',
            target_agent: 'Sub-Agente Moderador de Cierre',
            intent_category: 'Reserva Mesa Terraza VIP',
            detected_prospect: 'Alejandro Bastida',
            confidence_score: 0.992,
            execution_time_ms: 11,
            caching_hit: true,
            token_cost_usd: '$0.0000 (Prompt Caching 100%)',
            routing_reason: 'Solicitud de mesa en Terraza para cena de negocios. Enruta a Closer gastronómico.',
          },
          urban: {
            tenant_id: 'urban',
            target_agent: 'Sub-Agente Moderador de Cierre',
            intent_category: 'Disponibilidad Talla & Envío Express',
            detected_prospect: 'Kevin Roldán',
            confidence_score: 0.978,
            execution_time_ms: 14,
            caching_hit: true,
            token_cost_usd: '$0.0000 (Prompt Caching 100%)',
            routing_reason: 'Consulta de stock para Sneakers Cyberpunk 27.5 MX. Enruta a Closer e-commerce con Kueski Pay.',
          },
          corp: {
            tenant_id: 'corp',
            target_agent: 'Sub-Agente Moderador de Cierre',
            intent_category: 'Cotización Enterprise B2B & RLS Multi-Tenant',
            detected_prospect: 'Lic. Rodrigo Elizondo',
            confidence_score: 0.995,
            execution_time_ms: 9,
            caching_hit: true,
            token_cost_usd: '$0.0000 (Prompt Caching 100%)',
            routing_reason: 'Holding corporativo evaluando 4 subsidiarias. Enruta a Closer B2B con validación BANT.',
          },
        };

        setSimulationOutput(supervisorData[tenantId] || supervisorData.dental);
      } else if (agentKey === 'closer') {
        const closerData = {
          dental: {
            tenant_id: 'dental',
            message_response: `¡Hola Carlos! Entiendo perfectamente que busques cuidar tu inversión. En ${tenantName}, nuestro tratamiento de profilaxis ultrasónica previene el 90% de cirugías futuras costosas sin dolor. Tu diagnóstico 3D está bonificado en tu primera cita. ¿Te apartamos una sesión de 35 min este jueves a las 11:00 am en nuestro sillón 3?`,
            lead_qualification_status: {
              req_1_contact_valid: true,
              req_2_product_identified: true,
              req_3_doubts_resolved: true,
              req_4_cta_accepted: false,
            },
            current_lead_temperature: 'Seguimiento con Alta Intención',
            is_billable_lead: false,
            execution_time_ms: 310,
            framework_applied: 'JTBD + Ecuación de Valor (Beneficio clínico antes de arancel $850 MXN)',
          },
          polanco: {
            tenant_id: 'polanco',
            message_response: `¡Hola Alejandro! Un gusto saludarte. En ${tenantName} preparamos cada servicio como un ritual gastronómico. Nuestro Tomahawk Black Onyx de 1.2kg con flameado en mesa incluye maridaje guiado por sommelier. ¿Deseas asegurar tu mesa en la Terraza VIP este viernes a las 8:30 pm?`,
            lead_qualification_status: {
              req_1_contact_valid: true,
              req_2_product_identified: true,
              req_3_doubts_resolved: true,
              req_4_cta_accepted: true,
            },
            current_lead_temperature: 'Cierre Confirmado (VIP)',
            is_billable_lead: true,
            billing_amount_mxn: '$350.00 MXN',
            execution_time_ms: 285,
            framework_applied: 'Storytelling de Alto Estatus + Escasez de Mesas VIP',
          },
          urban: {
            tenant_id: 'urban',
            message_response: `¡Qué tal Kevin! Te confirmo que los Cyberpunk Sneakers High-Tops en Talla 27.5 MX están en las últimas 3 unidades. Si confirmas hoy antes de las 6:00 pm salen con envío express gratis y puedes diferirlo a 3 quincenas sin intereses con Kueski Pay. ¿Te genero el enlace de pago seguro con tu talla reservada?`,
            lead_qualification_status: {
              req_1_contact_valid: true,
              req_2_product_identified: true,
              req_3_doubts_resolved: true,
              req_4_cta_accepted: false,
            },
            current_lead_temperature: 'Fiebre de Compra (Escasez)',
            is_billable_lead: false,
            execution_time_ms: 260,
            framework_applied: 'FOMO + Reducción Fricción de Pago (BNPL Kueski)',
          },
          corp: {
            tenant_id: 'corp',
            message_response: `Estimado Rodrigo, gracias por contactar a ${tenantName}. Nuestra infraestructura con aislamiento RLS a nivel de base de datos y Meta CAPI S2S nativo está diseñada para holdings que gestionan múltiples razones sociales con SLA 99.9%. ¿Coordinamos una sesión de validación de 20 minutos con nuestro Director de Arquitectura este miércoles a las 10:00 am?`,
            lead_qualification_status: {
              req_1_contact_valid: true,
              req_2_product_identified: true,
              req_3_doubts_resolved: true,
              req_4_cta_accepted: true,
            },
            current_lead_temperature: 'Enterprise SQL (BANT Aprobado)',
            is_billable_lead: true,
            billing_amount_mxn: '$350.00 MXN',
            execution_time_ms: 340,
            framework_applied: 'BANT Calificado + Demostración de Arquitectura RLS',
          },
        };

        setSimulationOutput(closerData[tenantId] || closerData.dental);
      } else if (agentKey === 'reengagement') {
        const reengagementData = {
          dental: {
            tenant_id: 'dental',
            followup_message: `Hola Carlos, estuve pensando en tu consulta sobre la profilaxis. ¿Sabías que el 90% de nuestros pacientes previenen molestias graves con una revisión preventiva anual? Te aparté un espacio con escaneo 3D incluido para este viernes. ¿Te funciona?`,
            scheduled_time: 'Disparo Programado a 24h (Upstash Redis)',
            new_status: 'Seguimiento Enviado',
            word_count: 36,
            rule_compliance: 'Vaca Púrpura aplicada: gancho de curiosidad < 40 palabras con micro-CTA sin fricción',
          },
          polanco: {
            tenant_id: 'polanco',
            followup_message: `Alejandro, el Chef sommelier nos liberó 2 mesas exclusivas con vista en Terraza VIP para este fin de semana con copa de champaña de bienvenida. ¿Te gustaría que te reserve una antes de que se agoten?`,
            scheduled_time: 'Disparo Programado a 24h (Upstash Redis)',
            new_status: 'Seguimiento Enviado',
            word_count: 34,
            rule_compliance: 'Regla 95/5: reactivación de alto valor percibido con cortesía exclusiva',
          },
          urban: {
            tenant_id: 'urban',
            followup_message: `Kevin, solo queda 1 par en Talla 27.5 MX del drop Cyberpunk y tu cupón de 10% OFF vence hoy a medianoche. ¿Te aparto el último par antes de pasarlo a lista general?`,
            scheduled_time: 'Disparo Programado a 24h (Upstash Redis)',
            new_status: 'Seguimiento Enviado',
            word_count: 33,
            rule_compliance: 'Vaca Púrpura: stock unitario y límite temporal de expiración de cupón',
          },
          corp: {
            tenant_id: 'corp',
            followup_message: `Rodrigo, preparamos un caso de éxito confidencial sobre cómo una red corporativa redujo 42% su CAC usando nuestro router LangGraph con RLS. ¿Te comparto el brief ejecutivo en PDF de 2 páginas por aquí?`,
            scheduled_time: 'Disparo Programado a 24h (Upstash Redis)',
            new_status: 'Seguimiento Enviado',
            word_count: 35,
            rule_compliance: 'Valor puro sin venta agresiva (< 40 palabras) enfocado en métricas C-Level',
          },
        };

        setSimulationOutput(reengagementData[tenantId] || reengagementData.dental);
      } else if (agentKey === 'analyst') {
        const analystData = {
          dental: {
            tenant_id: 'dental',
            roas_real_backend: 5.82,
            cac_real_backend: 18.5,
            creative_fatigue_detected: true,
            fatigued_ad_ids: ['AdSet Profilaxis Sonrisa V1'],
            web_friction_alert: Boolean(activeTenant?.hasWebsite),
            friction_diagnosis: activeTenant?.hasWebsite
              ? 'Fricción en Landing Page: Click-to-WhatsApp 1.4% (< 3.0%). Requiere botón flotante de alto contraste.'
              : 'Embudo Directo Óptimo: Tráfico 100% canalizado a WhatsApp API con atribución CAPI.',
            recommended_action: 'Pausar Anuncio A por alta frecuencia (3.8) y activar variante Reel Vaca Púrpura con Dr. Juan Pablo.',
          },
          polanco: {
            tenant_id: 'polanco',
            roas_real_backend: 7.45,
            cac_real_backend: 12.8,
            creative_fatigue_detected: false,
            fatigued_ad_ids: [],
            web_friction_alert: false,
            friction_diagnosis: 'Embudo VIP Óptimo: Tasa de reserva 14.8% en WhatsApp. CAPI Server-to-Server validado al 100%.',
            recommended_action: 'Escalar presupuesto 25% en horario jueves a sábado 18:00 a 22:00 hrs enfocado en cortes Prime.',
          },
          urban: {
            tenant_id: 'urban',
            roas_real_backend: 4.12,
            cac_real_backend: 8.2,
            creative_fatigue_detected: true,
            fatigued_ad_ids: ['Reel Drop Cyberpunk V1'],
            web_friction_alert: true,
            friction_diagnosis: 'Fricción en Checkout Shopify: Abandono de carrito en paso de envío. Habilitar Kueski Pay en PDP.',
            recommended_action: 'Reemplazar Reel V1 (Hook Rate 16%) por unboxing dinámico de Kevin con calzado puesto en calle.',
          },
          corp: {
            tenant_id: 'corp',
            roas_real_backend: 12.4,
            cac_real_backend: 145.0,
            creative_fatigue_detected: false,
            fatigued_ad_ids: [],
            web_friction_alert: true,
            friction_diagnosis: 'Fricción en Formulario Web B2B: 7 campos obligatorios reducen conversión al 0.8%. Migrar a WhatsApp Bot.',
            recommended_action: 'Enrutar tráfico de LinkedIn Ads directamente al Lobo Vectorial en WhatsApp para pre-calificación BANT inmediata.',
          },
        };

        setSimulationOutput(analystData[tenantId] || analystData.dental);
      }
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#E7F900', '#10B981', '#38BDF8'],
        });
      } catch (e) {}
    }, 600);
  };

  // Replace template variables for live preview
  const formatPromptWithTenant = (xml) => {
    if (!xml) return '';
    const tenantId = activeTenant?.id || 'dental';

    const tenantPreviewData = {
      dental: {
        userName: 'Carlos Mendoza',
        productInterest: 'Limpieza Dental Ultrasónica & Carillas',
        lastObjection: 'El tratamiento se me hace costoso',
        ragPassages: '[Fragmento 1: Profilaxis Ultrasónica arancel $850 MXN, incluye diagnóstico 3D y pulido en sillón 3.]\n[Fragmento 2: Horarios Lun-Vie 09:00 a 19:00 hrs. Tratamiento previene 90% de cirugías invasivas sin dolor.]',
      },
      polanco: {
        userName: 'Alejandro Bastida',
        productInterest: 'Tomahawk Black Onyx 1.2kg & Mesa Terraza VIP',
        lastObjection: 'Solo quiero ver el menú antes de reservar',
        ragPassages: '[Fragmento 1: Cortes Sonora Prime y Menú Degustación 8 Tiempos. Descorche $650 MXN por botella.]\n[Fragmento 2: Terraza VIP con vista panorámica. Flameado en mesa por Sommelier. Horario 13:00 a 01:00 hrs.]',
      },
      urban: {
        userName: 'Kevin Roldán',
        productInterest: 'Cyberpunk High-Tops Sneakers Edición Limitada Talla 27.5 MX',
        lastObjection: 'Tengo duda de cuánto tarda el envío a Monterrey',
        ragPassages: '[Fragmento 1: Sneakers manufacturados en gamuza y reflectivo 3M. Suela antideslizante con drop ergonómico.]\n[Fragmento 2: Envío express DHL 24-48h gratis. Métodos de pago: Kueski Pay 3 quincenas sin tarjeta, Mercado Pago y SPEI.]',
      },
      corp: {
        userName: 'Lic. Rodrigo Elizondo',
        productInterest: 'Licenciamiento Multi-Tenant Vector OS con RLS & CAPI S2S',
        lastObjection: 'Queremos validar el aislamiento de bases de datos antes de contratar',
        ragPassages: '[Fragmento 1: Arquitectura RLS (Row-Level Security) en PostgreSQL con aislamiento criptográfico por tenant_id.]\n[Fragmento 2: Meta CAPI S2S sin cookies, servidor dedicado en AWS con SLA 99.9% y soporte técnico 24/7.]',
      },
    };

    const preview = tenantPreviewData[tenantId] || tenantPreviewData.dental;

    return xml
      .replaceAll('{tenant_id}', activeTenant?.id || 'dental')
      .replaceAll('{vertical_tipo}', activeTenant?.vertical || 'service_appointments')
      .replaceAll('{has_website}', String(activeTenant?.hasWebsite ?? true))
      .replaceAll('{brand_purpose}', activeTenant?.brandPurpose || 'Democratizar la salud bucal con tecnología avanzada sin dolor')
      .replaceAll('{business_name}', activeTenant?.name || 'Odontología Integral')
      .replaceAll('{user_name}', preview.userName)
      .replaceAll('{product_interest}', preview.productInterest)
      .replaceAll('{last_objection}', preview.lastObjection)
      .replaceAll('{rag_retrieved_passages}', preview.ragPassages);
  };

  return (
    <div className="p-8 block animate-fade-in space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-neon/15 text-neon border border-neon/30">
              <Network className="w-5 h-5" />
            </span>
            <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
              Orquestación <span className="text-neon">Multi-Agente</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Supervisión del Lobo Vectorial (LangGraph), los 4 Sub-Agentes especializados y su política de costo $0 USD.
          </p>
        </div>

        {/* Actions & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_var(--neon-glow)] hover:scale-105 active:scale-95 transition-all border border-neon/40"
            title="Exportar Ficha Técnica Ejecutiva y Certificación de Arquitectura LangGraph"
          >
            <FileText className="w-4 h-4" />
            <span>Ficha Técnica & Gobernanza IA</span>
          </button>

          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeViewMode === 'graph'
                  ? 'bg-neon text-black shadow-[0_0_10px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Grafo Interactivo
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeViewMode === 'matrix'
                  ? 'bg-neon text-black shadow-[0_0_10px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Matriz de Frecuencias & Eficiencia
            </button>
          </div>
        </div>
      </header>

      {/* Tenant Context Pill */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-lg">{activeTenant?.avatar || '🏢'}</span>
          <span className="text-[var(--text-muted)] font-semibold">Contexto Activo:</span>
          <strong className="text-[var(--text-main)] font-sans text-sm">{activeTenant?.name}</strong>
          <span className="text-[10px] px-2 py-0.5 rounded bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 font-mono font-bold">
            {activeTenant?.verticalLabel}
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)] hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            Costo Estimado Mensual: <strong className="text-emerald-600 dark:text-emerald-400">$0.00 – $0.15 USD</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
            Prompt Caching: <strong className="text-lime-700 dark:text-neon">Activo (94% Ahorro)</strong>
          </span>
        </div>
      </div>

      {activeViewMode === 'graph' ? (
        /* ========================================================================= */
        /* GRAFO PRINCIPAL DE ORQUESTACIÓN                                          */
        /* ========================================================================= */
        <div className="flex flex-col items-center gap-6 py-4 w-full max-w-7xl 2xl:max-w-[96vw] mx-auto">
          {/* NODO 1: SUPERVISOR CENTRAL */}
          <div
            onClick={() => handleOpenInspector('supervisor')}
            className="w-full max-w-md p-6 rounded-2xl border-2 border-neon bg-gradient-to-br from-lime-500/10 via-[var(--bg-card)] to-lime-500/5 shadow-[0_0_35px_var(--neon-glow)] text-center cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon/15 text-lime-800 dark:text-neon text-[10px] font-mono font-bold border border-neon/30">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <span>0ms Latencia</span>
            </div>

            <div className="w-14 h-14 bg-neon text-black rounded-2xl flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-[0_0_20px_var(--neon-glow)]">
              LV
            </div>

            <h3 className="font-heading font-black uppercase text-base text-[var(--text-main)] flex items-center justify-center gap-2">
              <span>{SUB_AGENTS_CONFIG.supervisor.name}</span>
              <Activity className="w-4 h-4 text-neon animate-pulse" />
            </h3>

            <p className="text-xs font-mono text-lime-700 dark:text-neon font-bold mt-0.5">
              {SUB_AGENTS_CONFIG.supervisor.engine}
            </p>

            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed font-sans">
              Clasifica intenciones de WhatsApp/Meta DMs y enruta a sub-agentes con estricto aislamiento <code className="text-lime-700 dark:text-neon font-bold text-[11px]">tenant_id</code>.
            </p>

            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">● {SUB_AGENTS_METRICS_MOCK.supervisor.status}</span>
              <span className="group-hover:text-lime-700 dark:group-hover:text-neon transition-colors font-bold">
                Auditar Prompt XML & Schema →
              </span>
            </div>
          </div>

          {/* Central Connecting Flow Line */}
          <div className="flex flex-col items-center">
            <div className="h-10 w-0.5 bg-neon shadow-[0_0_10px_var(--neon-glow)]" />
            <ArrowDown className="w-5 h-5 text-neon -mt-1 animate-bounce" />
          </div>

          {/* NIVELES SUBORDINADOS: LOS 3 SUB-BOTS DE EJECUCIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* SUB-AGENTE 2: MODERADOR & CLOSER */}
            <div
              onClick={() => handleOpenInspector('closer')}
              className="p-5 bg-gradient-to-br from-amber-500/10 via-[var(--bg-card)] to-amber-500/5 border border-amber-500/30 rounded-2xl cursor-pointer hover:border-amber-400 transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group flex flex-col justify-between backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                    ⚡ Event-Driven
                  </span>
                </div>

                <h4 className="font-heading font-black text-sm uppercase text-[var(--text-main)]">
                  {SUB_AGENTS_CONFIG.closer.name}
                </h4>
                <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold mb-2">
                  {SUB_AGENTS_CONFIG.closer.engine}
                </p>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Aplica embudo de ventas comercial y valida los 4 criterios de calidad para confirmar el prospecto calificado ($350 MXN).
                </p>

                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-muted)] space-y-1">
                  <div className="flex justify-between">
                    <span>Marco:</span>
                    <strong className="text-[var(--text-main)]">JTBD / Ecuación Valor</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Calendar:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Tool Nativa ($0 tokens)</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                <span>14 Leads Calificados</span>
                <span className="font-bold">Ver Prompt →</span>
              </div>
            </div>

            {/* SUB-AGENTE 3: RE-ENGAGEMENT 24H & CREADOR */}
            <div
              onClick={() => handleOpenInspector('reengagement')}
              className="p-5 bg-gradient-to-br from-purple-500/10 via-[var(--bg-card)] to-purple-500/5 border border-purple-500/30 rounded-2xl cursor-pointer hover:border-purple-400 transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] group flex flex-col justify-between backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                    ⏱️ Cron Redis 24h
                  </span>
                </div>

                <h4 className="font-heading font-black text-sm uppercase text-[var(--text-main)]">
                  {SUB_AGENTS_CONFIG.reengagement.name}
                </h4>
                <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold mb-2">
                  {SUB_AGENTS_CONFIG.reengagement.engine}
                </p>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Re-activa el 95% de prospectos Out-of-Market con la fórmula Vaca Púrpura (dato curioso, máx 40 palabras, micro-CTA sin fricción).
                </p>

                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-muted)] space-y-1">
                  <div className="flex justify-between">
                    <span>Marco:</span>
                    <strong className="text-[var(--text-main)]">Regla 95/5 / Vaca Púrpura</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cola Redis:</span>
                    <strong className="text-purple-600 dark:text-purple-400 font-bold">{SUB_AGENTS_METRICS_MOCK.reengagement.active24hQueueCount} leads en espera</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                <span>39.1% Tasa Reactivación</span>
                <span className="font-bold">Ver Prompt →</span>
              </div>
            </div>

            {/* SUB-AGENTE 4: ANALISTA DE PERFORMANCE & WEB FRICTION */}
            <div
              onClick={() => handleOpenInspector('analyst')}
              className="p-5 bg-gradient-to-br from-cyan-500/10 via-[var(--bg-card)] to-cyan-500/5 border border-cyan-500/30 rounded-2xl cursor-pointer hover:border-cyan-400 transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] group flex flex-col justify-between backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
                    📊 Batch Programado
                  </span>
                </div>

                <h4 className="font-heading font-black text-sm uppercase text-[var(--text-main)]">
                  {SUB_AGENTS_CONFIG.analyst.name}
                </h4>
                <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold mb-2">
                  {SUB_AGENTS_CONFIG.analyst.engine}
                </p>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Calcula ROAS Real Backend, detecta fatiga creativa (Hook Rate &lt; 20%) y alerta fricción en landing web si Click-to-WA &lt; 3%.
                </p>

                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-muted)] space-y-1">
                  <div className="flex justify-between">
                    <span>Disparador:</span>
                    <strong className="text-[var(--text-main)]">Diario 8AM / Dom 11PM</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Atribución:</span>
                    <strong className="text-cyan-600 dark:text-cyan-400 font-bold">Meta CAPI Server-to-Server</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                <span>ROAS Real: 5.82x</span>
                <span className="font-bold">Ver Prompt →</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VISTA MATRIZ DE FRECUENCIAS Y ESTRATEGIAS DE EFICIENCIA                    */
        /* ========================================================================= */
        <div className="space-y-6 w-full max-w-7xl 2xl:max-w-[96vw] mx-auto">
          <div className="vector-bg-card vector-border rounded-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-lg font-heading font-black uppercase text-[var(--text-main)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-neon" />
              <span>Matriz Oficial de Frecuencias de Ejecución y Eficiencia Operativa</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Diseñada para operar a latencia ultra-baja y mantener los costos de cómputo en $0 USD mediante Prompt Caching y herramientas nativas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[var(--bg-base)] text-[10px] text-[var(--text-muted)] uppercase border-b border-[var(--border-color)]">
                  <tr>
                    <th className="p-3">Evento / Workflow</th>
                    <th className="p-3">Disparador (Trigger)</th>
                    <th className="p-3">Frecuencia</th>
                    <th className="p-3">Sub-Agente Responsable</th>
                    <th className="p-3">Estrategia de Eficiencia & Caching</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-main)]">
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Recepción Mensaje DM / WA</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-neon/15 text-lime-700 dark:text-neon font-bold">⚡ Meta Webhook</span>
                    </td>
                    <td className="p-3">Tiempo Real (0ms)</td>
                    <td className="p-3">Supervisor + Moderador/Closer</td>
                    <td className="p-3 text-[var(--text-muted)] font-medium">Prompt Caching en System Prompt base ($0.014/1M). Solo se procesa el delta.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Consulta de Google Calendar</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold">🔧 Tool Call Nativa</span>
                    </td>
                    <td className="p-3">Bajo Demanda en Chat</td>
                    <td className="p-3">Tool Directa (freebusy.query)</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">Sin llamada a LLM. Conexión REST directa a Google API ($0 USD).</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Seguimiento 24h (Regla 95/5)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold">⏱️ Upstash Redis Queue</span>
                    </td>
                    <td className="p-3">A las 24h exactas</td>
                    <td className="p-3">Sub-Bot Re-Engagement</td>
                    <td className="p-3 text-[var(--text-muted)] font-medium">Batching nocturno con Groq / Llama 3 para latencia sub-segundo a costo marginal.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Reporte Diario al Dueño</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">📊 Scheduler Cron Job</span>
                    </td>
                    <td className="p-3">Diario a las 08:00 AM</td>
                    <td className="p-3">Supervisor Central</td>
                    <td className="p-3 text-[var(--text-muted)] font-medium">Lectura directa de agregados SQL en Supabase + plantilla WhatsApp ($0 tokens).</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Auditoría Creativa & CAPI</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold">📊 Scheduler Cron Job</span>
                    </td>
                    <td className="p-3">Domingos a las 11:00 PM</td>
                    <td className="p-3">Sub-Bot Analista (DeepSeek V3)</td>
                    <td className="p-3 text-[var(--text-muted)] font-medium">Evaluación por lotes de métricas semanales de Meta Ads y GA4 API.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Marcos Estratégicos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKETING_FRAMEWORKS_REGISTRY.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl vector-bg-card vector-border space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-sans text-sm text-[var(--text-main)]">
                    {item.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                  <strong className="text-[var(--text-main)] font-bold">Objetivo:</strong> {item.businessGoal}
                </p>
                <div className="p-2.5 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-main)] font-mono">
                  <span className="text-lime-700 dark:text-neon block font-bold mb-0.5">En Código:</span>
                  <span className="text-[var(--text-muted)] leading-snug block">{item.techImplementation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE INSPECCIÓN PROFUNDA DE PROMPTS Y SCHEMAS                        */}
      {/* ========================================================================= */}
      {selectedAgent && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseInspector();
            }}
          >
            <div className="w-full max-w-4xl max-h-[90vh] bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[var(--text-main)] my-auto animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 flex items-center justify-center text-lg font-bold">
                  {selectedAgent.codeName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                      {selectedAgent.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 font-bold">
                      {selectedAgent.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    {selectedAgent.engine} • {selectedAgent.triggerLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseInspector}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]/40 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveInspectorTab('prompt')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'prompt'
                    ? 'border-neon text-lime-700 dark:text-neon'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                📜 System Prompt Estricto (XML)
              </button>
              <button
                type="button"
                onClick={() => setActiveInspectorTab('schema')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'schema'
                    ? 'border-neon text-lime-700 dark:text-neon'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                🧩 Esquema de Salida JSON
              </button>
              <button
                type="button"
                onClick={() => setActiveInspectorTab('framework')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'framework'
                    ? 'border-neon text-lime-700 dark:text-neon'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                🎯 Marco Estratégico & Eficiencia
              </button>
              <button
                type="button"
                onClick={() => setActiveInspectorTab('simulation')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'simulation'
                    ? 'border-neon text-lime-700 dark:text-neon'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                ⚡ Simulación en Memoria
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
              {activeInspectorTab === 'prompt' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
                    <span>Inyección dinámica de variables de contexto activa:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(formatPromptWithTenant(selectedAgent.systemPromptXml))}
                      className="px-2.5 py-1 rounded bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-lime-700 dark:text-neon border border-[var(--border-color)] flex items-center gap-1.5 transition-colors font-bold"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copiado' : 'Copiar XML'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-all max-h-[50vh]">
                    {formatPromptWithTenant(selectedAgent.systemPromptXml)}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'schema' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
                    <span>Forzado vía Tool Calling / Json Mode:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(JSON.stringify(selectedAgent.outputJsonSchema, null, 2))}
                      className="px-2.5 py-1 rounded bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-lime-700 dark:text-neon border border-[var(--border-color)] flex items-center gap-1.5 transition-colors font-bold"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copiado' : 'Copiar JSON Schema'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] text-emerald-600 dark:text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[50vh]">
                    {JSON.stringify(selectedAgent.outputJsonSchema, null, 2)}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'framework' && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-2">
                    <span className="font-mono text-[10px] text-lime-700 dark:text-neon uppercase font-bold block">
                      Marco de Marketing Estratégico:
                    </span>
                    <h4 className="text-base font-bold text-[var(--text-main)]">
                      {selectedAgent.framework}
                    </h4>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      Este sub-agente está calibrado para nunca disparar información transaccional sin antes validar la psicología del comprador según las reglas de Seth Godin, Alex Hormozi o Simon Sinek.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-2">
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">
                      Estrategia de Eficiencia & Costo $0 USD:
                    </span>
                    <h4 className="text-base font-bold text-[var(--text-main)]">
                      {selectedAgent.efficiencyStrategy}
                    </h4>
                    <p className="text-[var(--text-muted)] leading-relaxed font-mono text-xs">
                      {selectedAgentKey === 'supervisor' && 'El System Prompt base y la base RAG se congelan en memoria caché. Solo se procesa el mensaje entrante del usuario, logrando hasta un 94% de ahorro en tokens de entrada.'}
                      {selectedAgentKey === 'closer' && 'Al detectar intención de cita, se consulta directamente freebusy.query de Google Calendar mediante protocolo REST, evitando que un LLM compute los slots.'}
                      {selectedAgentKey === 'reengagement' && 'Las tareas encoladas a las 24 horas se ejecutan en segundo plano a través de Redis Queue. Se utiliza Llama 3 en Groq a costo cero para redactar el mensaje de reactivación.'}
                      {selectedAgentKey === 'analyst' && 'La auditoría se programa para fines de semana en modo batch nocturno, consultando agregados SQL directamente sin costo de razonamiento recurrente.'}
                    </p>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'simulation' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[var(--text-main)] text-sm">
                        Simulación en Memoria (Buffer Local)
                      </h4>
                      <p className="text-[var(--text-muted)] text-xs">
                        Ejecuta un ciclo de prueba en buffer con los datos de <strong>{activeTenant?.name}</strong>.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={() => handleRunSimulation(selectedAgentKey)}
                      className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_var(--neon-glow)] hover:scale-105 active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>{isSimulating ? 'Simulando...' : 'Ejecutar Prueba'}</span>
                    </button>
                  </div>

                  {simulationOutput && (
                    <div className="space-y-2 animate-fade-in">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">
                        Resultado de Simulación (JSON Schema Validado):
                      </span>
                      <pre className="p-4 rounded-2xl bg-[var(--bg-base)] border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(simulationOutput, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">
                Vector Comunity OS v4.0 • Multi-Tenant RLS Aprobado
              </span>
              <button
                type="button"
                onClick={handleCloseInspector}
                className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}

      {/* Modal Ficha Técnica & Gobernanza IA */}
      <AgentOrchestrationReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        tenant={activeTenant}
      />
    </div>
  );
};
