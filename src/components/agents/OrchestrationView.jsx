'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Network,
  Shield,
  BarChart2,
  PenTool,
  Zap,
  CheckCircle2,
  Activity,
  Cpu,
  ArrowDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrchestrationView = () => {
  const { triggerModal } = useAuth();

  const handleTestSupervisor = () => {
    triggerModal(
      'Orquestación Supervisor (LangGraph)',
      '<b>Estado:</b> ACTIVO (12ms latencia)<br><b>Ruta:</b> Webhook Meta Ads -> Classifier -> Delegación a Sub-Bot Analista y Sub-Bot Closer.',
      () => {
        try {
          confetti({ particleCount: 35, spread: 60, colors: ['#E5FF00', '#FFFFFF'] });
        } catch (e) {}
      },
      'Verificar Grafo'
    );
  };

  const handleTestModerador = () => {
    triggerModal(
      'Sub-Bot Moderador (CrewAI)',
      '<b>Filtros Activos:</b> Detección de insultos, detección de spam, límite de CAC ($210 MXN).<br><b>Acción:</b> El Freno de Emergencia se activará automáticamente si el costo supera el umbral.',
      null,
      'Cerrar'
    );
  };

  const handleTestAnalista = () => {
    triggerModal(
      'Sub-Bot Analista (Meta CAPI)',
      '<b>Estado Servidor:</b> 99.4% Event Match Quality.<br><b>Señal:</b> Handshake CAPI activo con el Pixel de Meta y Stripe Webhooks.',
      null,
      'Cerrar'
    );
  };

  const handleTestCreador = () => {
    triggerModal(
      'Sub-Bot Creador (DeepSeek R1/V3)',
      '<b>Prompt Activo:</b> Brandbook oficial cargado en RAG.<br><b>Función:</b> Redacción de copys persuasivos y guiones de Reels para anuncios con fatiga.',
      null,
      'Cerrar'
    );
  };

  return (
    <div className="p-8 block animate-fade-in">
      <header className="mb-8 border-b border-[var(--border-color)] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
          Orquestación <span className="text-neon">Multi-Agente</span>
        </h2>
        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
          Supervisión en vivo del Lobo Vectorial (LangGraph) y sub-bots especializados (CrewAI & DeepSeek).
        </p>
      </header>

      <div className="flex flex-col items-center gap-6 py-4 max-w-5xl mx-auto">
        {/* Supervisor Node */}
        <div
          onClick={handleTestSupervisor}
          className="w-80 p-5 rounded-xl border-2 border-neon vector-bg-card shadow-[0_0_30px_var(--neon-glow)] text-center cursor-pointer hover:scale-105 transition-all group"
        >
          <div className="w-12 h-12 bg-neon text-black rounded-full flex items-center justify-center mx-auto mb-3 font-black text-base shadow-[0_0_15px_var(--neon-glow)]">
            LV
          </div>
          <h3 className="font-bold uppercase text-sm mb-1 text-[var(--text-main)] flex items-center justify-center gap-1.5">
            <span>Lobo Vectorial</span>
            <Activity className="w-3.5 h-3.5 text-neon animate-pulse" />
          </h3>
          <p className="text-[10px] font-mono text-neon mb-2 font-bold">
            Agente Supervisor (LangGraph)
          </p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Enruta webhooks de Meta y WhatsApp, delegando subtareas con precisión quirúrgica.
          </p>
          <div className="mt-3 pt-2 border-t border-[var(--border-color)] text-[10px] font-mono text-zinc-500 group-hover:text-neon transition-colors">
            Clic para auditar grafo en vivo →
          </div>
        </div>

        {/* Central Connecting Line */}
        <div className="flex flex-col items-center">
          <div className="h-10 w-0.5 bg-neon shadow-[0_0_8px_var(--neon-glow)]" />
          <ArrowDown className="w-4 h-4 text-neon -mt-1 animate-bounce" />
        </div>

        {/* Sub-Agents Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Sub-Bot Moderador */}
          <div
            onClick={handleTestModerador}
            className="p-5 vector-bg-card vector-border rounded-lg text-center cursor-pointer hover:border-neon transition-all hover:shadow-[0_0_15px_rgba(229,255,0,0.1)] group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)]/40 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs uppercase mb-1 text-[var(--text-main)]">
              Sub-Bot Moderador
            </h4>
            <p className="text-[9px] font-mono text-[var(--text-muted)] mb-3">
              CrewAI • Triage & HITL
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Filtra lenguaje hostil, protege la marca y activa el Freno de Emergencia si el CAC rebasa el límite.
            </p>
            <div className="mt-3 pt-2 border-t border-[var(--border-color)] text-[10px] font-mono text-zinc-500 group-hover:text-neon transition-colors">
              Auditar reglas de moderación →
            </div>
          </div>

          {/* Sub-Bot Analista */}
          <div
            onClick={handleTestAnalista}
            className="p-5 vector-bg-card vector-border rounded-lg text-center cursor-pointer hover:border-neon transition-all hover:shadow-[0_0_15px_rgba(229,255,0,0.1)] group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/40 flex items-center justify-center mx-auto mb-3">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs uppercase mb-1 text-[var(--text-main)]">
              Sub-Bot Analista
            </h4>
            <p className="text-[9px] font-mono text-[var(--text-muted)] mb-3">
              Meta CAPI • Media Mix
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Mide ROAS, MER, LTV y detecta fatiga creativa cruzando datos de servidor a servidor.
            </p>
            <div className="mt-3 pt-2 border-t border-[var(--border-color)] text-[10px] font-mono text-zinc-500 group-hover:text-neon transition-colors">
              Ver correlación de datos →
            </div>
          </div>

          {/* Sub-Bot Creador */}
          <div
            onClick={handleTestCreador}
            className="p-5 vector-bg-card vector-border rounded-lg text-center cursor-pointer hover:border-neon transition-all hover:shadow-[0_0_15px_rgba(229,255,0,0.1)] group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto mb-3">
              <PenTool className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs uppercase mb-1 text-[var(--text-main)]">
              Sub-Bot Creador
            </h4>
            <p className="text-[9px] font-mono text-[var(--text-muted)] mb-3">
              DeepSeek R1 / V3
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Genera guiones de Reels y textos persuasivos basados en el Brandbook del Tenant.
            </p>
            <div className="mt-3 pt-2 border-t border-[var(--border-color)] text-[10px] font-mono text-zinc-500 group-hover:text-neon transition-colors">
              Ver prompts generativos →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
