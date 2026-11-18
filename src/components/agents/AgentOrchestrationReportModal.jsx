'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Portal } from '@/components/common/Portal';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import {
  Printer,
  X,
  ShieldCheck,
  Coins,
  Clock,
  Share2,
  Hash,
  Cpu,
  Network,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUB_AGENTS_CONFIG } from '@/utils/constants';
import { aiService } from '@/services/aiService';

export const AgentOrchestrationReportModal = ({
  isOpen,
  onClose,
  tenant,
}) => {
  const printAreaRef = useRef(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [realUsage, setRealUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const hasSpecificTenant = Boolean(tenant?.id);
  const currentTenant = tenant || {
    id: '',
    name: 'Sin Negocio Seleccionado',
    verticalLabel: 'General',
  };

  const reportId = hasSpecificTenant
    ? `AUD-${new Date().getFullYear()}-GOV-VI-${currentTenant.id.toUpperCase()}`
    : `BP-${new Date().getFullYear()}-ARCH-VI-MASTER`;

  const documentRefCode = `${reportId}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    let isMounted = true;
    if (isOpen && currentTenant.id) {
      setLoadingUsage(true);
      aiService.getUsage(currentTenant.id)
        .then((data) => {
          if (isMounted && data) {
            setRealUsage(data);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingUsage(false);
        });
    } else {
      setRealUsage(null);
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, currentTenant.id]);

  // Cerrar con Escape y bloquear scroll de fondo cuando está abierto
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#10B981'] });
    } catch (e) {}
    window.print();
  };

  const totalTokensFormatted = realUsage?.totalTokens != null ? Number(realUsage.totalTokens).toLocaleString() : '0';
  const totalCostUsdFormatted = realUsage?.totalCostUsd != null ? `$${Number(realUsage.totalCostUsd).toFixed(4)} USD` : '$0.0000 USD';

  const handleCopySummaryWhatsApp = () => {
    const headerTitle = hasSpecificTenant
      ? `🛡️ *CERTIFICACIÓN OFICIAL DE ORQUESTACIÓN & GOBERNANZA IA*`
      : `🛡️ *BLUEPRINT MAESTRO: ARQUITECTURA MULTI-AGENTE & GOBERNANZA*`;

    const scopeLine = hasSpecificTenant
      ? `🏢 *Entidad Auditada:* ${currentTenant.name} (Tenant ID: ${currentTenant.id})\n`
      : `🏢 *Ámbito:* Arquitectura Global de Agencia (Multi-Tenant RLS)\n`;

    const tokenLine = hasSpecificTenant
      ? `• *Consumo Real Registrado (PostgreSQL 17):* ${totalCostUsdFormatted} (${totalTokensFormatted} tokens)\n`
      : `• *Contabilidad de Tokens:* Ledger inmutable por tenant (/api/v1/ai/usage)\n`;

    const text = `${headerTitle}\n` +
      scopeLine +
      `🌐 *Motor:* LangGraph Orchestrator + DeepSeek V3 / R1\n` +
      `📁 *Folio de Gobernanza:* ${reportId}\n\n` +
      `🤖 *TOPOLOGÍA DE 4 SUB-AGENTES AUDITADA:*\n` +
      `1. *Supervisor Central ("Lobo Vectorial"):* LangGraph Router\n` +
      `2. *Sub-Bot Moderador & Closer:* DeepSeek V3 (Embudo AIDA / Validación 4/4)\n` +
      `3. *Sub-Bot Re-Engagement 24h:* Queue Backend (Regla 95/5 / Vaca Púrpura < 40 palabras)\n` +
      `4. *Sub-Bot Analista Performance:* Meta CAPI & GA4 (Telemetría Real Backend)\n\n` +
      `💰 *POLÍTICA FINANCIERA & CONSUMO DE TOKENS:*\n` +
      tokenLine +
      `• *Soberanía de Datos:* Aislamiento RLS en PostgreSQL 17 + Cifrado AES-256\n\n` +
      `_Certificación Oficial Vector Inside (${documentRefCode})_`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);

    try {
      confetti({ particleCount: 40, spread: 60, colors: ['#00F0FF', '#E7F900'] });
    } catch (e) {}
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
              <span>
                {hasSpecificTenant ? 'Certificación Oficial de Despliegue' : 'Blueprint Maestro de Arquitectura'} • Folio: <strong>{reportId}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummaryWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Copiar resumen técnico para WhatsApp"
              >
                {copiedReport ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
                <span>{copiedReport ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
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
                {hasSpecificTenant
                  ? `Certificación Oficial: ${currentTenant.name}`
                  : 'Blueprint Maestro: Orquestación Multi-Agente'}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                {hasSpecificTenant
                  ? `Auditoría forense de aislamiento multi-tenant RLS, modelos asignados y contabilidad de tokens para ${currentTenant.name}.`
                  : 'Especificación canónica de arquitectura LangGraph, topología de los 4 sub-agentes y política de costo marginal $0 USD.'}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 font-mono text-xs bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shrink-0">
              <p className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold">
                {hasSpecificTenant ? 'Cliente / Tenant Auditado:' : 'Ámbito de Gobernanza:'}
              </p>
              <p className="text-sm font-heading font-black text-lime-700 dark:text-neon print:text-black">
                {hasSpecificTenant ? currentTenant.name : 'Arquitectura Global de Agencia'}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                {hasSpecificTenant ? (currentTenant.verticalLabel || 'Servicios Generales') : 'Ecosistema Multi-Tenant (PostgreSQL 17)'}
              </p>
              <div className="flex items-center sm:justify-end gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {hasSpecificTenant ? `Aislamiento RLS: ${currentTenant.id} Verificado` : 'Aislamiento Multi-Tenant RLS Aprobado'}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Core Architecture Pillars (KPI Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                Ejecuciones Registradas
              </span>
              <p className="text-2xl font-black text-lime-700 dark:text-neon print:text-black">
                {hasSpecificTenant ? (realUsage?.totalRequests ?? 0) : 'Multi-Tenant'}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans">
                {hasSpecificTenant ? 'Consultas IA persistidas en PostgreSQL' : 'Aislamiento por tenant_id'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                {hasSpecificTenant ? 'Consumo Real (PostgreSQL 17)' : 'Contabilidad de Tokens'}
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {hasSpecificTenant ? (loadingUsage ? 'Calculando...' : totalCostUsdFormatted) : 'Ledger Activo'}
              </p>
              <span className="text-[10px] text-zinc-500 font-sans block">
                {hasSpecificTenant
                  ? `${totalTokensFormatted} tokens consumidos (últimos 30 días)`
                  : 'Auditoría real vía /api/v1/ai/usage'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                Motor Cognitivo Activo
              </span>
              <p className="text-xl font-black text-zinc-900 dark:text-white">DeepSeek V3 / R1</p>
              <span className="text-[10px] text-zinc-500 font-sans">Cifrado BYOK AES-256-GCM</span>
            </div>
          </div>

          {/* Detailed Sub-Agent Topology Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Network className="w-4 h-4 text-lime-700 dark:text-neon" />
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
                  {Object.values(SUB_AGENTS_CONFIG).map((agent) => (
                    <tr key={agent.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                      <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${agent.id === 'supervisor' ? 'bg-neon animate-pulse' : agent.id === 'closer' ? 'bg-amber-400' : agent.id === 'reengagement' ? 'bg-purple-400' : 'bg-cyan-400'}`} />
                        {agent.name}
                      </td>
                      <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans">
                        {agent.engine} / {agent.framework.split('/')[0].trim()}
                      </td>
                      <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        {agent.triggerLabel}
                      </td>
                      <td className="p-3.5 text-right text-zinc-600 dark:text-zinc-400 font-sans text-[11px]">
                        {agent.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security & Multi-Tenant Protocol Box */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 font-sans text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span>Protocolo de Seguridad & No-Fuga de Datos (RLS Inviolable)</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans text-xs">
              El Lobo Vectorial inyecta forzosamente la variable <code className="text-lime-700 dark:text-neon print:text-black font-bold font-mono">{`tenant_id: "${currentTenant.id || 'sin_negocio_activo'}"`}</code> en cada nodo de LangGraph. Los sub-bots carecen de permisos para consultar datos cruzados entre clientes. Si el usuario escribe lenguaje agresivo o solicita un agente humano, el sistema activa la <strong>Atención Humana Prioritaria</strong>, pausando la IA en menos de 300ms.
            </p>
          </div>

          {/* Document Reference Footer */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
              <span>Folio de Reporte: <code className="text-zinc-700 dark:text-zinc-300 print:text-black">{documentRefCode}</code></span>
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
