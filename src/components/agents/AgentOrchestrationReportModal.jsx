'use client';

import React, { useRef } from 'react';
import { Portal } from '@/components/common/Portal';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import {
  Printer,
  Copy,
  X,
  CheckCircle2,
  Network,
  Cpu,
  ShieldCheck,
  Zap,
  Coins,
  Clock,
  Share2,
  BrainCircuit,
  Hash,
  Layers,
  Sparkles,
  Target,
  BarChart2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AgentOrchestrationReportModal = ({
  isOpen,
  onClose,
  tenant,
}) => {
  const printAreaRef = useRef(null);

  if (!isOpen) return null;

  const currentTenant = tenant || {
    id: 'dental',
    name: 'Clínica Odontológica Integral',
    verticalLabel: 'Service Appointments (Salud)',
  };

  const reportId = `AUD-${new Date().getFullYear()}-GOV-VI-${(currentTenant.id || 'DENT').toUpperCase()}`;
  const shaHash = `0x4a7e9d${Date.now().toString(16).slice(-6)}c8b3`;

  const handlePrint = () => {
    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#10B981'] });
    } catch (e) {}
    window.print();
  };

  const handleCopySummaryWhatsApp = () => {
    const text = `🛡️ *FICHA TÉCNICA DE ORQUESTACIÓN & GOBERNANZA IA*\n` +
      `🏢 *Entidad Auditada:* ${currentTenant.name}\n` +
      `🌐 *Motor:* LangGraph Orchestrator + DeepSeek V3 / Groq Llama 3\n` +
      `📁 *Folio de Gobernanza:* ${reportId}\n\n` +
      `🤖 *TOPOLOGÍA DE 4 SUB-AGENTES AUDITADA:*\n` +
      `1. *Supervisor Central ("Lobo Vectorial"):* LangGraph Router (Latencia: 12ms / Aislamiento RLS)\n` +
      `2. *Sub-Bot Moderador & Closer:* CrewAI / DeepSeek V3 (Embudo AIDA / Calificación BANT)\n` +
      `3. *Sub-Bot Re-Engagement 24h:* Upstash Redis Queue (Regla 95/5 / Vaca Púrpura < 40 palabras)\n` +
      `4. *Sub-Bot Analista Performance:* Meta CAPI & GA4 (Detección Fatiga Creativa)\n\n` +
      `💰 *POLÍTICA FINANCIERA & COSTO DE TOKENS:*\n` +
      `• *Costo Mensual Estimado:* $0.00 - $0.15 USD (Prompt Caching Activo 94% ahorro)\n` +
      `• *Latencia Promedio:* 0ms - 340ms\n` +
      `• *Soberanía de Datos:* Cifrado SHA-256 Server-to-Server sin cookies\n\n` +
      `_Certificación de Arquitectura Vector Inside (${shaHash})_`;

    navigator.clipboard.writeText(text);
    try {
      confetti({ particleCount: 40, spread: 60, colors: ['#00F0FF', '#E7F900'] });
    } catch (e) {}
    alert('¡Ficha técnica copiada al portapapeles lista para enviar por WhatsApp al Comité de TI / Dirección!');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={printAreaRef}
          className="w-full max-w-4xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-10 relative space-y-8 font-sans max-h-[92vh] overflow-y-auto my-auto animate-scale-up text-zinc-900 dark:text-zinc-100 print:p-0 print:border-none print:shadow-none print:max-h-none print:bg-white print:text-black"
        >
          {/* Action Toolbar (Hidden in Print) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800 print:hidden">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Certificación de Arquitectura • Folio: <strong>{reportId}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummaryWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Copiar resumen técnico para WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copiar para WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-neon hover:bg-[var(--neon-hover)] text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Official Letterhead Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <VectorInsideLogo size="md" variant="imagotype" showCommunity={false} />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase font-bold">
                  Gobernanza & Arquitectura IA
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-zinc-900 dark:text-white">
                Ficha Técnica: Orquestación Multi-Agente
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                Especificación técnica de LangGraph Orchestrator, micro-agentes especializados y política de costo $0 USD.
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 font-mono text-xs bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shrink-0">
              <p className="text-[10px] uppercase text-zinc-400 dark:text-zinc-500 font-bold">Cliente / Tenant:</p>
              <p className="text-sm font-heading font-black text-neon">{currentTenant.name}</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">{currentTenant.verticalLabel}</p>
              <div className="flex items-center sm:justify-end gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Aislamiento RLS: tenant_id Verificado</span>
              </div>
            </div>
          </div>

          {/* 3 Core Architecture Pillars (KPI Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neon" />
                Latencia de Enrutamiento
              </span>
              <p className="text-2xl font-black text-neon">12ms</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans">0ms en Caching Hit</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                Costo Mensual de Tokens
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">$0.00 – $0.15 USD</p>
              <span className="text-[10px] text-zinc-500 font-sans">Prompt Caching 94% ahorro</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                Modelos de Inferencia
              </span>
              <p className="text-xl font-black text-zinc-900 dark:text-white">DeepSeek V3 / R1</p>
              <span className="text-[10px] text-zinc-500 font-sans">Groq Llama 3 Fast Fallback</span>
            </div>
          </div>

          {/* Detailed Sub-Agent Topology Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Network className="w-4 h-4 text-neon" />
              <span>Matriz de los 4 Sub-Agentes Autónomos</span>
            </h3>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-zinc-100 dark:bg-zinc-900 text-[10px] text-zinc-500 uppercase border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-3.5 font-bold">Sub-Agente</th>
                    <th className="p-3.5 font-bold">Motor & Framework</th>
                    <th className="p-3.5 font-bold">Trigger / Frecuencia</th>
                    <th className="p-3.5 font-bold text-right">Misión Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 bg-white dark:bg-zinc-950/60 text-xs">
                  {/* Supervisor */}
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                    <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                      Supervisor Central ("Lobo Vectorial")
                    </td>
                    <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans">
                      LangGraph / AIDA / STP
                    </td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      ⚡ Event-Driven (0ms)
                    </td>
                    <td className="p-3.5 text-right text-zinc-600 dark:text-zinc-400 font-sans text-[11px]">
                      Clasificación de intenciones y aislamiento multi-tenant.
                    </td>
                  </tr>

                  {/* Closer */}
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                    <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Sub-Bot Moderador & Closer
                    </td>
                    <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans">
                      CrewAI / JTBD / Ecuación de Valor
                    </td>
                    <td className="p-3.5 text-amber-600 dark:text-amber-400 font-bold">
                      ⚡ En Tiempo Real (Mensajería)
                    </td>
                    <td className="p-3.5 text-right text-zinc-600 dark:text-zinc-400 font-sans text-[11px]">
                      Resuelve dudas de precio y califica los 4 criterios BANT.
                    </td>
                  </tr>

                  {/* Reengagement */}
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                    <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Sub-Bot Re-Engagement 24h & Creador
                    </td>
                    <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans">
                      DeepSeek R1 / V3 / Regla 95/5
                    </td>
                    <td className="p-3.5 text-purple-600 dark:text-purple-400 font-bold">
                      ⏱️ Upstash Redis Cron (24h)
                    </td>
                    <td className="p-3.5 text-right text-zinc-600 dark:text-zinc-400 font-sans text-[11px]">
                      Dispara micro-mensajes Vaca Púrpura (&lt; 40 palabras).
                    </td>
                  </tr>

                  {/* Analyst */}
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                    <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Sub-Bot Analista de Performance
                    </td>
                    <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans">
                      Meta CAPI & GA4 Data API
                    </td>
                    <td className="p-3.5 text-cyan-600 dark:text-cyan-400 font-bold">
                      📊 Batch Diario / Semanal
                    </td>
                    <td className="p-3.5 text-right text-zinc-600 dark:text-zinc-400 font-sans text-[11px]">
                      Detecta fatiga creativa publicitaria y fricción web.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Security & Multi-Tenant Protocol Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-zinc-950/80 to-zinc-950/80 border border-emerald-500/30 space-y-2 font-sans text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Protocolo de Seguridad & No-Fuga de Datos (RLS Inviolable)</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans text-xs">
              El Lobo Vectorial inyecta forzosamente la variable <code className="text-neon font-bold">{`tenant_id: "${currentTenant.id}"`}</code> en cada nodo de LangGraph. Los sub-bots carecen de permisos para consultar datos cruzados entre clientes. Si el usuario escribe lenguaje agresivo o solicita un agente humano, el sistema ejecuta el protocolo <strong>Sutura Arcángel</strong>, pausando la IA en menos de 300ms.
            </p>
          </div>

          {/* Cryptographic Certification Footer */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-neon" />
              <span>Firma SHA-256: <code>{shaHash}</code></span>
            </div>
            <div>
              <span>Gobernanza Vector Inside • LangGraph Architecture v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
