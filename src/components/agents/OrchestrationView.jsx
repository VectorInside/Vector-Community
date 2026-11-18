'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portal } from '@/components/common/Portal';
import {
  SUB_AGENTS_CONFIG,
  MARKETING_FRAMEWORKS_REGISTRY,
} from '@/utils/constants';
import { aiService } from '@/services/aiService';
import { reengagementService } from '@/services/reengagementService';
import { performanceService } from '@/services/performanceService';
import { leadService } from '@/services/leadService';
import { AgentOrchestrationReportModal } from './AgentOrchestrationReportModal';

const buildAgentProbePrompt = (agentKey, tenant, realContext = {}) => {
  const tenantName = tenant?.name || 'Negocio';
  const offer =
    tenant?.commercialOffer?.hook ||
    tenant?.marketingMix4P?.product ||
    tenant?.verticalLabel ||
    'servicios principales';

  if (agentKey === 'supervisor') {
    return (
      `[PRUEBA DE ENRUTAMIENTO SUPERVISOR] ` +
      `Mensaje entrante simulado de prospecto para "${tenantName}": "Hola, me interesa saber el precio y disponibilidad de ${offer}". ` +
      `Responde ÚNICAMENTE con un objeto JSON válido que siga tu esquema: ` +
      `{"tenant_id":"${tenant?.id}","target_agent":"SubAgente_Moderador_Closer | Triage_Humano | SubAgente_Reengagement | SubAgente_Agendamiento_Calendar","intent_category":"SALUDO | PRECIO | OBJECION_FINANCIAMIENTO | RECLAMO | AGENDAMIENTO","confidence_score":0.0,"routing_reason":"breve explicación"}`
    );
  }

  if (agentKey === 'closer') {
    return (
      `[PRUEBA EN VIVO CLOSER] ` +
      `Un prospecto pregunta por WhatsApp a "${tenantName}": "Hola, ¿qué incluye ${offer} y cuánto cuesta? ¿Tienen horarios esta semana?". ` +
      `Responde como el Sub-Bot Moderador & Closer aplicando el tono y oferta real del Brand DNA en máximo 3 párrafos cortos listos para WhatsApp.`
    );
  }

  if (agentKey === 'reengagement') {
    return (
      `[PRUEBA EN VIVO RE-ENGAGEMENT 24H] ` +
      `Redacta un único mensaje de seguimiento para WhatsApp para un prospecto de "${tenantName}" que preguntó por "${offer}" hace 24 horas y no respondió. ` +
      `Aplica estrictamente la fórmula Vaca Púrpura (dato o ángulo de valor + micro-CTA sin fricción) en menos de 40 palabras. Devuelve solo el mensaje.`
    );
  }

  return (
    `[PRUEBA EN VIVO ANALISTA] ` +
    `Analiza estas métricas reales del backend de "${tenantName}": ${JSON.stringify(realContext)}. ` +
    `Emite un diagnóstico ejecutivo breve (máximo 3 puntos) sobre eficiencia de tokens, conversión y recomendación de pauta.`
  );
};

export const OrchestrationView = () => {
  const { activeTenant, triggerModal } = useAuth();
  const [selectedAgentKey, setSelectedAgentKey] = useState(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('prompt'); // 'prompt' | 'schema' | 'framework' | 'simulation'
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationOutput, setSimulationOutput] = useState(null);
  const [simulationError, setSimulationError] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState('graph'); // 'graph' | 'matrix'
  const [showReportModal, setShowReportModal] = useState(false);
  const [liveStats, setLiveStats] = useState({
    aiUsage: null,
    reengagementQueue: null,
    telemetry: null,
    leadsCount: 0,
  });

  useEffect(() => {
    let cancelled = false;
    const tenantId = activeTenant?.id;
    if (!tenantId) {
      setLiveStats({ aiUsage: null, reengagementQueue: null, telemetry: null, leadsCount: 0 });
      return undefined;
    }

    Promise.allSettled([
      aiService.getUsage(tenantId),
      reengagementService.getReengagementQueue(tenantId),
      performanceService.getDualTelemetry(tenantId),
      leadService.getLeadsByTenant(tenantId),
    ]).then(([usageRes, queueRes, telemetryRes, leadsRes]) => {
      if (cancelled) return;
      const leadsList = leadsRes.status === 'fulfilled' && Array.isArray(leadsRes.value) ? leadsRes.value : [];
      const qualifiedCount = leadsList.filter((l) =>
        ['APPOINTMENT_SCHEDULED', 'QUALIFIED', 'CONVERTED', 'LEAD_WARM_24H'].includes(l.leadState)
      ).length;
      setLiveStats({
        aiUsage: usageRes.status === 'fulfilled' ? usageRes.value : null,
        reengagementQueue: queueRes.status === 'fulfilled' ? queueRes.value : null,
        telemetry: telemetryRes.status === 'fulfilled' ? telemetryRes.value : null,
        leadsCount: qualifiedCount || leadsList.length,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [activeTenant?.id]);

  const selectedAgent = selectedAgentKey ? SUB_AGENTS_CONFIG[selectedAgentKey] : null;

  const handleOpenInspector = (key) => {
    setSelectedAgentKey(key);
    setActiveInspectorTab('prompt');
    setSimulationOutput(null);
    setSimulationError(null);
    setIsSimulating(false);
  };

  const handleCloseInspector = () => {
    setSelectedAgentKey(null);
    setSimulationOutput(null);
    setSimulationError(null);
  };

  // Cerrar inspector con Escape y bloquear scroll de fondo cuando está abierto
  useEffect(() => {
    if (!selectedAgentKey) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseInspector();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedAgentKey]);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunSimulation = async (agentKey) => {
    const tenantId = activeTenant?.id;
    if (!tenantId) {
      setSimulationError(
        'Selecciona o registra un negocio en el selector superior para ejecutar una prueba real contra el backend.'
      );
      setSimulationOutput(null);
      return;
    }

    setIsSimulating(true);
    setSimulationOutput(null);
    setSimulationError(null);
    const startedAt = performance.now();

    try {
      let realContext = {};
      if (agentKey === 'reengagement') {
        const queue = await reengagementService.getReengagementQueue(tenantId);
        realContext = {
          pendingInQueue: queue?.pendingCount ?? 0,
          dispatchedCount: queue?.dispatchedCount ?? 0,
          totalInQueue: queue?.totalInQueue ?? 0,
        };
      } else if (agentKey === 'analyst') {
        const [usageRes, telemetryRes] = await Promise.allSettled([
          aiService.getUsage(tenantId),
          performanceService.getDualTelemetry(tenantId),
        ]);
        const usage = usageRes.status === 'fulfilled' ? usageRes.value : null;
        const telemetry = telemetryRes.status === 'fulfilled' ? telemetryRes.value : null;
        realContext = {
          totalAiRequests30d: usage?.totalRequests ?? 0,
          totalTokens30d: usage?.totalTokens ?? 0,
          estimatedCostUsd30d: usage?.totalCostUsd ?? 0,
          microLandingVisits: telemetry?.microLandingMetrics?.visits ?? 0,
          microLandingLeads: telemetry?.microLandingMetrics?.leadsGenerated ?? 0,
          webSessions: telemetry?.webTrafficMetrics?.sessions ?? 0,
        };
      }

      const probePrompt = buildAgentProbePrompt(agentKey, activeTenant, realContext);
      const aiResult = await aiService.chat({
        tenantId,
        message: probePrompt,
        conversationHistory: [],
      });

      const elapsedMs = Math.round(performance.now() - startedAt);
      const rawText = String(aiResult?.response || '').trim();

      let parsedJson = null;
      if (agentKey === 'supervisor') {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedJson = JSON.parse(jsonMatch[0]);
          } catch {
            parsedJson = null;
          }
        }
      }

      const baseMetadata = {
        source: 'LIVE_BACKEND_AI',
        tenant_id: aiResult?.tenantId || tenantId,
        provider: aiResult?.provider || 'DEEPSEEK',
        model: aiResult?.model || 'deepseek-chat',
        total_tokens: aiResult?.totalTokens ?? 0,
        estimated_cost_usd: aiResult?.estimatedCostUsd ?? 0,
        execution_time_ms: elapsedMs,
      };

      if (agentKey === 'supervisor') {
        setSimulationOutput({
          ...baseMetadata,
          ...(parsedJson || { raw_routing_output: rawText }),
        });
      } else if (agentKey === 'closer') {
        setSimulationOutput({
          ...baseMetadata,
          message_response: rawText,
          framework_applied: 'Brand DNA + Oferta Real (PostgreSQL)',
        });
      } else if (agentKey === 'reengagement') {
        const words = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
        setSimulationOutput({
          ...baseMetadata,
          followup_message: rawText,
          word_count: words,
          postgres_queue_snapshot: realContext,
        });
      } else {
        setSimulationOutput({
          ...baseMetadata,
          postgres_metrics_snapshot: realContext,
          ai_diagnosis: rawText,
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
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo ejecutar la prueba real contra el backend.';
      setSimulationError(serverMsg);
    } finally {
      setIsSimulating(false);
    }
  };

  // Replace template variables for live preview
  const formatPromptWithTenant = (xml) => {
    if (!xml) return '';
    return xml
      .replaceAll('{tenant_id}', activeTenant?.id || 'sin_negocio_activo')
      .replaceAll('{vertical_tipo}', activeTenant?.vertical || 'sin_vertical')
      .replaceAll('{has_website}', String(activeTenant?.hasWebsite ?? false))
      .replaceAll('{brand_purpose}', activeTenant?.brandPurpose || 'Propósito del negocio configurado en Perfil de Marca')
      .replaceAll('{business_name}', activeTenant?.name || 'Sin negocio seleccionado')
      .replaceAll('{user_name}', 'Prospecto en Conversación')
      .replaceAll('{product_interest}', activeTenant?.commercialOffer?.hook || 'Servicio principal del negocio')
      .replaceAll('{last_objection}', 'Consulta de disponibilidad y precios')
      .replaceAll('{tone_of_voice}', activeTenant?.toneOfVoice || 'Profesional, empático y orientado a conversión')
      .replaceAll('{emoji_policy}', activeTenant?.emojiPolicy || 'Moderado (1-2 por mensaje según contexto)')
      .replaceAll('{closing_cta}', activeTenant?.commercialOffer?.cta || '¿Te gustaría agendar una llamada breve de 15 minutos o prefieres que un asesor te contacte?')
      .replaceAll('{rag_retrieved_passages}', activeTenant ? `[ Base de Conocimiento RAG de ${activeTenant.name} ]` : '[ Selecciona un negocio para inyectar fragmentos RAG ]');
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
              Pruebas, Agentes <span className="text-lime-700 dark:text-neon">&amp; Laboratorio (Lab)</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Laboratorio de pruebas en vivo, supervisión del Lobo Vectorial (LangGraph) y los 4 Sub-Agentes especializados.
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

      {/* Tenant Context Pill con Zero-State Elegante */}
      {!activeTenant ? (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 gap-3 animate-fade-in font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-lg">
              🏢
            </div>
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                Modo Global • Ningún Negocio Seleccionado
              </h4>
              <p className="text-[11px] font-sans text-[var(--text-muted)] mt-0.5">
                Selecciona un cliente en la barra superior para inyectar su Brand DNA propio, catálogo RAG y probar simulaciones con aislamiento RLS.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 font-bold text-amber-600 dark:text-amber-400">
              Aislamiento RLS: En Espera
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="text-xl p-1 bg-[var(--bg-card-subtle)] rounded-lg">{activeTenant.avatar || '🏢'}</span>
            <span className="text-[var(--text-muted)] font-semibold text-[11px]">Contexto Activo:</span>
            <strong className="text-[var(--text-main)] font-sans text-sm font-bold">{activeTenant.name}</strong>
            {activeTenant.verticalLabel && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-lime-500/15 text-lime-800 dark:text-lime-300 border border-lime-500/30 font-mono font-bold">
                {activeTenant.verticalLabel}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-500" />
              Consumo Real (30d):{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                {liveStats.aiUsage
                  ? `$${Number(liveStats.aiUsage.totalCostUsd ?? 0).toFixed(4)} USD (${Number(liveStats.aiUsage.totalTokens ?? 0).toLocaleString()} tokens)`
                  : '$0.0000 USD'}
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-lime-600 dark:text-neon" />
              Ejecuciones IA:{' '}
              <strong className="text-lime-700 dark:text-neon font-bold">
                {liveStats.aiUsage?.totalRequests ?? 0} llamadas
              </strong>
            </span>
          </div>
        </div>
      )}

      {activeViewMode === 'graph' ? (
        /* ========================================================================= */
        /* GRAFO PRINCIPAL DE ORQUESTACIÓN                                          */
        /* ========================================================================= */
        <div className="flex flex-col items-center gap-4 py-4 w-full max-w-7xl 2xl:max-w-[96vw] mx-auto">
          {/* NODO 1: SUPERVISOR CENTRAL */}
          <div
            onClick={() => handleOpenInspector('supervisor')}
            className="w-full max-w-md p-6 rounded-2xl border-2 border-neon bg-gradient-to-br from-lime-500/10 via-[var(--bg-card)] to-lime-500/5 shadow-[0_0_35px_var(--neon-glow)] text-center cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden backdrop-blur-sm"
          >
            <div className="w-14 h-14 bg-neon text-black rounded-2xl flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-[0_0_20px_var(--neon-glow)]">
              LV
            </div>

            <h3 className="font-heading font-black uppercase text-base text-[var(--text-main)] flex items-center justify-center gap-2">
              <span>{SUB_AGENTS_CONFIG.supervisor.name}</span>
              <Activity className="w-4 h-4 text-neon animate-pulse" />
            </h3>

            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs font-mono text-lime-700 dark:text-neon font-bold">
                {SUB_AGENTS_CONFIG.supervisor.engine}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-800 dark:text-lime-300 border border-lime-500/30 font-bold">
                ~12ms Router (0ms en Cache)
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed font-sans">
              Clasifica intenciones de WhatsApp/Meta DMs y enruta a sub-agentes con estricto aislamiento <code className="text-lime-700 dark:text-neon font-bold text-[11px]">tenant_id</code>.
            </p>

            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ● {liveStats.aiUsage ? `${liveStats.aiUsage.totalRequests ?? 0} ejecuciones (30d)` : 'Conectado al Motor IA'}
              </span>
              <span className="group-hover:text-lime-700 dark:group-hover:text-neon transition-colors font-bold">
                Auditar Prompt XML & Schema →
              </span>
            </div>
          </div>

          {/* BIFURCADOR TOPOLÓGICO MULTI-AGENTE (Directed Tree) */}
          <div className="w-full max-w-5xl flex flex-col items-center select-none pointer-events-none my-1">
            {/* Tronco Central */}
            <div className="h-6 w-0.5 bg-gradient-to-b from-neon to-lime-500 shadow-[0_0_10px_var(--neon-glow)]" />
            <ArrowDown className="w-4 h-4 text-neon -mt-1 animate-bounce" />

            {/* Bifurcación Desktop de 3 Canales */}
            <div className="hidden md:block w-full mt-1">
              <div className="relative w-full h-8 flex items-center justify-between px-[16%]">
                {/* Barra horizontal guía */}
                <div className="absolute left-[16%] right-[16%] top-0 h-0.5 bg-gradient-to-r from-amber-500/80 via-purple-500 to-cyan-500/80" />

                {/* Rama 1: Closer */}
                <div className="flex flex-col items-center -mt-0.5">
                  <div className="h-4 w-0.5 bg-amber-500/80" />
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base)] border border-amber-500/40 text-amber-500 dark:text-amber-400 font-bold shadow-xs">
                    ⚡ Event-Driven (WA)
                  </span>
                </div>

                {/* Rama 2: Re-engagement */}
                <div className="flex flex-col items-center -mt-0.5">
                  <div className="h-4 w-0.5 bg-purple-500/80" />
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base)] border border-purple-500/40 text-purple-700 dark:text-purple-400 font-bold shadow-xs">
                    ⏱️ Upstash Redis 24h
                  </span>
                </div>

                {/* Rama 3: Analyst */}
                <div className="flex flex-col items-center -mt-0.5">
                  <div className="h-4 w-0.5 bg-cyan-500/80" />
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base)] border border-cyan-500/40 text-cyan-700 dark:text-cyan-400 font-bold shadow-xs">
                    📊 Batch Programado
                  </span>
                </div>
              </div>
            </div>

            {/* Indicador Mobile */}
            <div className="md:hidden flex flex-col items-center py-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-2.5 py-0.5 rounded border border-[var(--border-color)]">
                Enrutamiento Dinámico ↓
              </span>
            </div>
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
                  Aplica embudo de ventas comercial y valida los 4 criterios de calidad para confirmar el prospecto calificado ({activeTenant?.leadPriceMXN ? `$${activeTenant.leadPriceMXN} MXN` : 'tarifa configurada del negocio'}).
                </p>

                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-muted)] space-y-1">
                  <div className="flex justify-between">
                    <span>Marco:</span>
                    <strong className="text-[var(--text-main)]">JTBD / Ecuación Valor</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Calendar:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Agenda PostgreSQL</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                <span>{liveStats.leadsCount} Leads Registrados</span>
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
                    <span>Cola Activa 24h:</span>
                    <strong className="text-purple-600 dark:text-purple-400 font-bold">
                      {liveStats.reengagementQueue?.pendingCount ?? 0} leads en espera
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                <span>
                  {liveStats.reengagementQueue?.dispatchedCount ?? 0} enviados ({liveStats.reengagementQueue?.totalInQueue ?? 0} total)
                </span>
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
                <span>
                  {liveStats.telemetry?.microLandingMetrics?.leadsGenerated ?? 0} leads • {liveStats.telemetry?.webTrafficMetrics?.sessions ?? 0} sesiones
                </span>
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
            <div className="w-full max-w-4xl h-[85vh] min-h-[560px] max-h-[820px] bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[var(--text-main)] my-auto animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between shrink-0">
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
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]/40 text-xs font-mono shrink-0 overflow-x-auto no-scrollbar">
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
                ⚡ Prueba en Vivo (Backend IA)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs custom-scrollbar">
              {activeInspectorTab === 'prompt' && (
                <div className="space-y-3 animate-fade-in">
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
                  <pre className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                    {formatPromptWithTenant(selectedAgent.systemPromptXml)}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'schema' && (
                <div className="space-y-3 animate-fade-in">
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
                  <pre className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] text-emerald-600 dark:text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedAgent.outputJsonSchema, null, 2)}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'framework' && (
                <div className="space-y-4 font-sans text-xs animate-fade-in">
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
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                    <div>
                      <h4 className="font-bold text-[var(--text-main)] text-sm">
                        Prueba en Vivo contra Backend (PostgreSQL + DeepSeek)
                      </h4>
                      <p className="text-[var(--text-muted)] text-xs mt-0.5">
                        {activeTenant ? (
                          <>
                            Ejecuta una llamada real al motor IA con el Brand DNA de <strong>{activeTenant.name}</strong> y telemetría real del servidor.
                          </>
                        ) : (
                          <span className="text-amber-500 font-semibold">
                            ⚠️ Selecciona un negocio en la barra superior para habilitar la prueba real con su Brand DNA.
                          </span>
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSimulating || !activeTenant}
                      onClick={() => handleRunSimulation(selectedAgentKey)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                        !activeTenant
                          ? 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)] cursor-not-allowed opacity-60'
                          : 'bg-neon text-black shadow-[0_0_15px_var(--neon-glow)] hover:scale-105 active:scale-95'
                      }`}
                      title={!activeTenant ? 'Selecciona un negocio para probar' : 'Ejecutar prueba real en backend'}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSimulating ? 'Consultando IA...' : 'Ejecutar Prueba'}</span>
                    </button>
                  </div>

                  {simulationError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-500 dark:text-red-400 space-y-1.5 animate-fade-in">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Error en Ejecución Real (Sin Fallback Simulado)</span>
                      </div>
                      <p className="text-xs font-sans leading-relaxed">{simulationError}</p>
                    </div>
                  )}

                  {simulationOutput ? (
                    <div className="space-y-3 animate-fade-in">
                      {/* Previsualización Conversacional Humanizada si hay mensaje */}
                      {(simulationOutput.message_response || simulationOutput.followup_message) && (
                        <div className="p-4 rounded-2xl bg-[var(--bg-base)] dark:bg-[#0b141a] border border-emerald-500/30 text-[var(--text-main)] space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                            <span className="font-bold flex items-center gap-1.5">
                              💬 Respuesta Real de WhatsApp (DeepSeek + Brand DNA):
                            </span>
                            <span>
                              {simulationOutput.execution_time_ms ? `${simulationOutput.execution_time_ms}ms` : 'En vivo'}
                              {simulationOutput.total_tokens ? ` • ${simulationOutput.total_tokens} tokens` : ''}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-[#005c4b]/30 border border-emerald-500/30 dark:border-[#00a884]/40 text-[var(--text-main)] dark:text-emerald-100 text-xs leading-relaxed font-sans whitespace-pre-wrap">
                            {simulationOutput.message_response || simulationOutput.followup_message}
                          </div>
                          {simulationOutput.framework_applied && (
                            <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-color)]">
                              <span>Origen: <strong>{simulationOutput.framework_applied}</strong></span>
                              <span>Modelo: <strong>{simulationOutput.model}</strong></span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block font-mono">
                          Respuesta Real del Backend (PostgreSQL + DeepSeek):
                        </span>
                        <pre className="p-4 rounded-2xl bg-[var(--bg-base)] border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(simulationOutput, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : !simulationError && (
                    <div className="p-8 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]/60 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-neon/10 text-lime-700 dark:text-neon border border-neon/20 mx-auto flex items-center justify-center">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-[var(--text-main)] font-sans">
                          Prueba en Vivo Lista (Sin Datos Simulados)
                        </p>
                        <p className="text-xs text-[var(--text-muted)] font-sans max-w-md mx-auto">
                          Haz clic en &quot;Ejecutar Prueba&quot; para enviar un estímulo real al backend (`POST /api/v1/ai/chat`), medir la latencia real, tokens consumidos y validar la respuesta de DeepSeek con PostgreSQL.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between text-xs font-mono shrink-0">
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
