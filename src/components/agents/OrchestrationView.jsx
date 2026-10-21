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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portal } from '@/components/common/Portal';
import {
  SUB_AGENTS_CONFIG,
  MARKETING_FRAMEWORKS_REGISTRY,
} from '@/utils/constants';
import { SUB_AGENTS_METRICS_MOCK } from '@/utils/mockData';

export const OrchestrationView = () => {
  const { activeTenant, triggerModal } = useAuth();
  const [selectedAgentKey, setSelectedAgentKey] = useState(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('prompt'); // 'prompt' | 'schema' | 'framework' | 'simulation'
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationOutput, setSimulationOutput] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState('graph'); // 'graph' | 'matrix'

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

    setTimeout(() => {
      setIsSimulating(false);
      if (agentKey === 'supervisor') {
        setSimulationOutput({
          tenant_id: activeTenant?.id || 'dental',
          target_agent: 'SubAgente_Moderador_Closer',
          intent_category: 'PRECIO',
          confidence_score: 0.98,
          execution_time_ms: 12,
          caching_hit: true,
          token_cost_usd: '$0.0000 (Prompt Caching 100%)',
        });
      } else if (agentKey === 'closer') {
        setSimulationOutput({
          message_response: `¡Hola Carlos! Entiendo perfectamente que busques cuidar tu inversión. En ${activeTenant?.name}, nuestro tratamiento de profilaxis ultrasónica previene el 90% de cirugías futuras costosas sin ningún dolor. ¿Te gustaría agendar una valoración sin costo este jueves para revisar tu caso?`,
          lead_qualification_status: {
            req_1_contact_valid: true,
            req_2_product_identified: true,
            req_3_doubts_resolved: true,
            req_4_cta_accepted: false,
          },
          current_lead_temperature: 'WARM_FINANCING',
          is_billable_lead: false,
          execution_time_ms: 320,
          framework_applied: 'JTBD + Ecuación de Valor (Beneficio antes de precio)',
        });
      } else if (agentKey === 'reengagement') {
        setSimulationOutput({
          followup_message: `Hola Carlos, estuve pensando en tu consulta sobre la limpieza dental. Sabías que el 90% de nuestros pacientes eligen nuestro paquete preventivo anual? Te gustaría que te guarde un espacio con diagnóstico 3D sin costo para esta semana?`,
          scheduled_time: '24h_trigger (Upstash Redis)',
          new_status: 'FOLLOWUP_SENT',
          word_count: 38,
          rule_compliance: 'Vaca Púrpura aplicada: gancho curioso < 40 palabras con micro-CTA',
        });
      } else if (agentKey === 'analyst') {
        setSimulationOutput({
          roas_real_backend: 5.82,
          cac_real_backend: 18.5,
          creative_fatigue_detected: true,
          fatigued_ad_ids: ['ad_set_tomahawk_01'],
          web_friction_alert: activeTenant?.hasWebsite && activeTenant?.id === 'dental',
          friction_diagnosis: activeTenant?.hasWebsite && activeTenant?.id === 'dental'
            ? 'FRICCIÓN_EN_LANDING_PAGE: Click-to-WhatsApp 1.4% (< 3.0%). Requiere botón flotante de alto contraste.'
            : 'EMBUDO_OPTIMO: Conversión de mensajería dentro de benchmarks.',
          recommended_action: 'Pausar Anuncio A por alta frecuencia (3.8) y activar variante Reel Vaca Púrpura.',
        });
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
    return xml
      .replaceAll('{tenant_id}', activeTenant?.id || 'dental')
      .replaceAll('{vertical_tipo}', activeTenant?.vertical || 'service_appointments')
      .replaceAll('{has_website}', String(activeTenant?.hasWebsite ?? true))
      .replaceAll('{brand_purpose}', activeTenant?.brandPurpose || 'Democratizar la salud bucal con tecnología avanzada sin dolor')
      .replaceAll('{business_name}', activeTenant?.name || 'Odontología Integral')
      .replaceAll('{user_name}', 'Carlos Mendoza')
      .replaceAll('{product_interest}', 'Limpieza Dental Ultrasónica')
      .replaceAll('{last_objection}', 'Lo voy a pensar')
      .replaceAll('{rag_retrieved_passages}', '[Fragmento 1: Profilaxis Ultrasónica arancel $850 MXN, incluye diagnóstico 3D y pulido.]\n[Fragmento 2: Horarios Lun-Vie 09:00 a 19:00 hrs. Citas en sillón 3.]');
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

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveViewMode('graph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeViewMode === 'graph'
                ? 'bg-neon text-black shadow-[0_0_10px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-white'
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
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            Matriz de Frecuencias & Eficiencia
          </button>
        </div>
      </header>

      {/* Tenant Context Pill */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-lg">{activeTenant?.avatar || '🏢'}</span>
          <span className="text-[var(--text-muted)]">Contexto Activo:</span>
          <strong className="text-[var(--text-main)] font-sans text-sm">{activeTenant?.name}</strong>
          <span className="text-[10px] px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-mono">
            {activeTenant?.verticalLabel}
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)] hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            Costo Estimado Mensual: <strong className="text-emerald-400">$0.00 – $0.15 USD</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-neon" />
            Prompt Caching: <strong className="text-neon">Activo (94% Ahorro)</strong>
          </span>
        </div>
      </div>

      {activeViewMode === 'graph' ? (
        /* ========================================================================= */
        /* GRAFO PRINCIPAL DE ORQUESTACIÓN                                          */
        /* ========================================================================= */
        <div className="flex flex-col items-center gap-6 py-4 max-w-6xl mx-auto">
          {/* NODO 1: SUPERVISOR CENTRAL */}
          <div
            onClick={() => handleOpenInspector('supervisor')}
            className="w-full max-w-md p-6 rounded-2xl border-2 border-neon vector-bg-card shadow-[0_0_35px_var(--neon-glow)] text-center cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon/15 text-neon text-[10px] font-mono font-bold border border-neon/30">
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

            <p className="text-xs font-mono text-neon font-bold mt-0.5">
              {SUB_AGENTS_CONFIG.supervisor.engine}
            </p>

            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed font-sans">
              Clasifica intenciones de WhatsApp/Meta DMs y enruta a sub-agentes con estricto aislamiento <code className="text-neon text-[11px]">tenant_id</code>.
            </p>

            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span className="text-emerald-400 font-bold">● {SUB_AGENTS_METRICS_MOCK.supervisor.status}</span>
              <span className="group-hover:text-neon transition-colors font-bold">
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
              className="p-5 vector-bg-card vector-border rounded-2xl cursor-pointer hover:border-amber-400 transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    ⚡ Event-Driven
                  </span>
                </div>

                <h4 className="font-heading font-black text-sm uppercase text-[var(--text-main)]">
                  {SUB_AGENTS_CONFIG.closer.name}
                </h4>
                <p className="text-[10px] font-mono text-amber-400 font-bold mb-2">
                  {SUB_AGENTS_CONFIG.closer.engine}
                </p>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Aplica embudo AIDA, JTBD (beneficio antes de precio) y valida los 4 requisitos booleanos para cobrar $350 MXN (BILLABLE_LEAD).
                </p>

                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Marco:</span>
                    <strong className="text-white">JTBD / Ecuación Valor</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Calendar:</span>
                    <strong className="text-emerald-400">Tool Nativa ($0 tokens)</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-amber-400 transition-colors">
                <span>14 Leads Calificados</span>
                <span>Ver Prompt →</span>
              </div>
            </div>

            {/* SUB-AGENTE 3: RE-ENGAGEMENT 24H & CREADOR */}
            <div
              onClick={() => handleOpenInspector('reengagement')}
              className="p-5 vector-bg-card vector-border rounded-2xl cursor-pointer hover:border-purple-400 transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                    ⏱️ Cron Redis 24h
                  </span>
                </div>

                <h4 className="font-heading font-black text-sm uppercase text-[var(--text-main)]">
                  {SUB_AGENTS_CONFIG.reengagement.name}
                </h4>
                <p className="text-[10px] font-mono text-purple-400 font-bold mb-2">
                  {SUB_AGENTS_CONFIG.reengagement.engine}
                </p>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Re-activa el 95% de prospectos Out-of-Market con la fórmula Vaca Púrpura (dato curioso, máx 40 palabras, micro-CTA sin fricción).
                </p>

                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Marco:</span>
                    <strong className="text-white">Regla 95/5 / Vaca Púrpura</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cola Redis:</span>
                    <strong className="text-purple-400">{SUB_AGENTS_METRICS_MOCK.reengagement.active24hQueueCount} leads en espera</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-purple-400 transition-colors">
                <span>39.1% Tasa Reactivación</span>
                <span>Ver Prompt →</span>
              </div>
            </div>

            {/* SUB-AGENTE 4: ANALISTA DE PERFORMANCE & WEB FRICTION */}
            <div
              onClick={() => handleOpenInspector('analyst')}
              className="p-5 vector-bg-card vector-border rounded-2xl cursor-pointer hover:border-cyan-400 transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                    📊 Batch Programado
                  </span>
                </div>

                <h4 className="font-heading font-black text-sm uppercase text-[var(--text-main)]">
                  {SUB_AGENTS_CONFIG.analyst.name}
                </h4>
                <p className="text-[10px] font-mono text-cyan-400 font-bold mb-2">
                  {SUB_AGENTS_CONFIG.analyst.engine}
                </p>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Calcula ROAS Real Backend, detecta fatiga creativa (Hook Rate &lt; 20%) y alerta fricción en landing web si Click-to-WA &lt; 3%.
                </p>

                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Disparador:</span>
                    <strong className="text-white">Diario 8AM / Dom 11PM</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Atribución:</span>
                    <strong className="text-cyan-400">Meta CAPI Server-to-Server</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-cyan-400 transition-colors">
                <span>ROAS Real: 5.82x</span>
                <span>Ver Prompt →</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VISTA MATRIZ DE FRECUENCIAS Y ESTRATEGIAS DE EFICIENCIA                    */
        /* ========================================================================= */
        <div className="space-y-6 max-w-6xl mx-auto">
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
                      <span className="px-2 py-0.5 rounded bg-neon/15 text-neon font-bold">⚡ Meta Webhook</span>
                    </td>
                    <td className="p-3">Tiempo Real (0ms)</td>
                    <td className="p-3">Supervisor + Moderador/Closer</td>
                    <td className="p-3 text-zinc-400">Prompt Caching en System Prompt base ($0.014/1M). Solo se procesa el delta.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Consulta de Google Calendar</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold">🔧 Tool Call Nativa</span>
                    </td>
                    <td className="p-3">Bajo Demanda en Chat</td>
                    <td className="p-3">Tool Directa (freebusy.query)</td>
                    <td className="p-3 text-emerald-400 font-bold">Sin llamada a LLM. Conexión REST directa a Google API ($0 USD).</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Seguimiento 24h (Regla 95/5)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold">⏱️ Upstash Redis Queue</span>
                    </td>
                    <td className="p-3">A las 24h exactas</td>
                    <td className="p-3">Sub-Bot Re-Engagement</td>
                    <td className="p-3 text-zinc-400">Batching nocturno con Groq / Llama 3 para latencia sub-segundo a costo marginal.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Reporte Diario al Dueño</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">📊 Scheduler Cron Job</span>
                    </td>
                    <td className="p-3">Diario a las 08:00 AM</td>
                    <td className="p-3">Supervisor Central</td>
                    <td className="p-3 text-zinc-400">Lectura directa de agregados SQL en Supabase + plantilla WhatsApp ($0 tokens).</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-panel)]">
                    <td className="p-3 font-bold font-sans">Auditoría Creativa & CAPI</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-bold">📊 Scheduler Cron Job</span>
                    </td>
                    <td className="p-3">Domingos a las 11:00 PM</td>
                    <td className="p-3">Sub-Bot Analista (DeepSeek V3)</td>
                    <td className="p-3 text-zinc-400">Evaluación por lotes de métricas semanales de Meta Ads y GA4 API.</td>
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
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  <strong>Objetivo:</strong> {item.businessGoal}
                </p>
                <div className="p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] text-zinc-300">
                  <span className="text-neon block font-bold mb-0.5">En Código:</span>
                  <span>{item.techImplementation}</span>
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
            <div className="w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-200 my-auto animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neon/15 text-neon border border-neon/30 flex items-center justify-center text-lg font-bold">
                  {selectedAgent.codeName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-heading font-black text-white">
                      {selectedAgent.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold">
                      {selectedAgent.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400">
                    {selectedAgent.engine} • {selectedAgent.triggerLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseInspector}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-800 bg-zinc-900/30 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveInspectorTab('prompt')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'prompt'
                    ? 'border-neon text-neon'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                📜 System Prompt Estricto (XML)
              </button>
              <button
                type="button"
                onClick={() => setActiveInspectorTab('schema')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'schema'
                    ? 'border-neon text-neon'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🧩 Esquema de Salida JSON
              </button>
              <button
                type="button"
                onClick={() => setActiveInspectorTab('framework')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'framework'
                    ? 'border-neon text-neon'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🎯 Marco Estratégico & Eficiencia
              </button>
              <button
                type="button"
                onClick={() => setActiveInspectorTab('simulation')}
                className={`py-2 px-3 border-b-2 font-bold transition-all ${
                  activeInspectorTab === 'simulation'
                    ? 'border-neon text-neon'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ⚡ Simulación en Memoria
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
              {activeInspectorTab === 'prompt' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                    <span>Inyección dinámica de variables de contexto activa:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(formatPromptWithTenant(selectedAgent.systemPromptXml))}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-neon flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copiado' : 'Copiar XML'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-black border border-zinc-800 text-zinc-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-all max-h-[50vh]">
                    {formatPromptWithTenant(selectedAgent.systemPromptXml)}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'schema' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                    <span>Forzado vía Tool Calling / Json Mode:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(JSON.stringify(selectedAgent.outputJsonSchema, null, 2))}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-neon flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copiado' : 'Copiar JSON Schema'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-black border border-zinc-800 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[50vh]">
                    {JSON.stringify(selectedAgent.outputJsonSchema, null, 2)}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'framework' && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="font-mono text-[10px] text-neon uppercase font-bold block">
                      Marco de Marketing Estratégico:
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {selectedAgent.framework}
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      Este sub-agente está calibrado para nunca disparar información transaccional sin antes validar la psicología del comprador según las reglas de Seth Godin, Alex Hormozi o Simon Sinek.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold block">
                      Estrategia de Eficiencia & Costo $0 USD:
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {selectedAgent.efficiencyStrategy}
                    </h4>
                    <p className="text-zinc-400 leading-relaxed font-mono text-xs">
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
                      <h4 className="font-bold text-white text-sm">
                        Simulación en Memoria (Buffer Local)
                      </h4>
                      <p className="text-zinc-400 text-xs">
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
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                        Resultado de Simulación (JSON Schema Validado):
                      </span>
                      <pre className="p-4 rounded-2xl bg-black border border-emerald-500/40 text-emerald-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(simulationOutput, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">
                Vector Comunity OS v4.0 • Multi-Tenant RLS Aprobado
              </span>
              <button
                type="button"
                onClick={handleCloseInspector}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
};
