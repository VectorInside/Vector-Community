'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Sparkles,
  Activity,
  ShieldCheck,
  ArrowRight,
  Plus,
  Globe,
  Smartphone,
  ExternalLink,
  BarChart2,
  Power,
  DollarSign,
  Clock,
  AlertOctagon,
  Flame,
  CheckCircle2,
  Info,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { VectorLobo } from '@/components/common/VectorLobo';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { GOVERNANCE_SYSTEM_RULES } from '@/utils/constants';

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const CentroDeMando = () => {
  const router = useRouter();
  const {
    activeTenant,
    activeTenantKey,
    switchTenantContext,
    tenantsData,
    toggleTenantAi,
    triggerModal,
  } = useAuth();

  const [previewTenant, setPreviewTenant] = useState(null);
  const [selectedRuleModal, setSelectedRuleModal] = useState(null);

  const handleInspectTenant = (tenantKey) => {
    switchTenantContext(tenantKey);
    router.push('/performance');
  };

  // Calculate Global Pay-Per-Lead Business Metrics
  const tenantsList = Object.values(tenantsData);
  const totalBilledLeads = tenantsList.reduce((sum, t) => sum + (t.billedLeadsMonth || 0), 0);
  const totalRevenueMXN = tenantsList.reduce(
    (sum, t) => sum + (t.billedLeadsMonth || 0) * (t.leadPriceMXN || 350),
    0
  );
  const agencyRevenueMXN = Math.round(totalRevenueMXN * 0.7);
  const totalRetainedDeposits = tenantsList.reduce(
    (sum, t) => sum + (t.retainedDepositMXN || 15000),
    0
  );

  return (
    <div className="p-8 block animate-fade-in space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
            Centro de <span className="text-neon">Mando</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Supervisión multi-negocio, Gobernanza y 5 Reglas Estrictas, Telemetría Web y Facturación Pay-Per-Lead.
          </p>
        </div>

        {/* Tenant Selector for Admin Audit */}
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
            Negocio en Auditoría:
          </span>
          <select
            value={activeTenantKey}
            onChange={(e) => switchTenantContext(e.target.value)}
            className="bg-[var(--bg-base)] text-xs text-[var(--text-main)] border border-neon rounded px-3 py-1 font-bold outline-none cursor-pointer"
          >
            {Object.values(tenantsData).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Lobo Vectorial Sentinel Diagnostic Banner (Bloques 13.9 & 6 Manual Maestro) */}
      <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <VectorLobo size={42} showStatus={true} status="active" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon">
                Lobo Vectorial • Centinela de Gobernanza
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cognitive/10 text-cognitive border border-cognitive/20">
                IFV 48/50 Óptimo
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                5 Reglas Cumplidas
              </span>
            </div>
            <p className="text-xs text-[var(--text-main)] italic mt-0.5 font-sans">
              "Auditoría activa en {Object.keys(tenantsData).length} tenants. Presencia digital CON Web & Micro-Landings RLS verificada."
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setPreviewTenant(activeTenant)}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-neon/15 text-neon border border-neon/40 hover:bg-neon hover:text-black transition-all flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Ver Micro-Landing</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/performance')}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Métricas Web & CAPI</span>
          </button>
        </div>
      </div>

      {/* Monitor de Gobernanza & 5 Reglas de Negocio en Tiempo Real */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neon" />
              <span>Gobernanza & 5 Reglas Estrictas de Negocio</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
              Supervisión de cumplimiento arquitectónico en tiempo real según ADR-001 al ADR-008.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/settings')}
            className="text-xs font-mono text-neon hover:underline flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ajustar Umbrales y Precios</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {GOVERNANCE_SYSTEM_RULES.map((rule) => (
            <div
              key={rule.id}
              onClick={() => setSelectedRuleModal(rule)}
              className="p-4 rounded-xl vector-bg-card vector-border hover:border-neon transition-all cursor-pointer group space-y-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {rule.number}
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${rule.statusColor}`}>
                  {rule.statusLabel}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)] group-hover:text-neon transition-colors">
                  {rule.name}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5 font-sans">
                  {rule.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-500">{rule.adrRef}</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span>{rule.metric}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-neon" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid & Resumen Financiero Pay-Per-Lead */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Métricas Operativas del Tenant */}
        <div className="vector-bg-panel vector-border p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
              <span>{activeTenant?.avatar}</span>
              <span>Métricas Operativas ({activeTenant?.shortName || activeTenant?.name})</span>
            </h4>
            <span className="text-[10px] font-mono text-neon">En Auditoría</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">MER (ROAS)</p>
              <p className="text-2xl font-black text-[var(--text-main)] font-mono mt-1">{activeTenant?.mer}</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Citas IA</p>
              <p className="text-2xl font-black text-neon font-mono mt-1">{activeTenant?.citas}</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">CAC vs Max</p>
              <p className="text-xl font-black text-[var(--success)] font-mono mt-1">
                {activeTenant?.cac}{' '}
                <span className="text-[10px] text-zinc-500 font-normal">/{activeTenant?.cacMax}</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Antifragilidad</p>
              <p className="text-2xl font-black text-neon font-mono mt-1">{activeTenant?.ifv}</p>
            </div>
          </div>
        </div>

        {/* Resumen Comercial Pay-Per-Qualified-Lead (Ecosistema Global) */}
        <div className="vector-bg-panel vector-border p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-neon" />
              <span>Economía Pay-Per-Lead (Ecosistema Global)</span>
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/10 text-neon border border-neon/30">
              Split 70% Agencia
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Leads Facturados</p>
              <p className="text-2xl font-black text-white font-mono mt-1">{totalBilledLeads}</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Facturación Bruta</p>
              <p className="text-xl font-black text-neon font-mono mt-1" suppressHydrationWarning>
                ${formatNumber(totalRevenueMXN)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Ingreso Agencia (70%)</p>
              <p className="text-xl font-black text-emerald-400 font-mono mt-1" suppressHydrationWarning>
                ${formatNumber(agencyRevenueMXN)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Custodia Depósitos</p>
              <p className="text-xl font-black text-cyan-400 font-mono mt-1" suppressHydrationWarning>
                ${formatNumber(totalRetainedDeposits)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Tenants, Digital Presence, Kill-Switch & Actions */}
      <div className="vector-bg-card vector-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
              <Building2 className="w-4 h-4 text-neon" />
              <span>Panel de Negocios, Gobernanza & Control Kill-Switch</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Supervisión de Presencia Digital, Tarifa Pay-Per-Lead y Botón de Emergencia PAUSED_HUMAN_TAKEOVER
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/config')}
            className="text-xs bg-neon text-black font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_8px_var(--neon-glow)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Alta Nuevo Negocio</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead className="bg-[var(--bg-base)] text-[9px] text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
              <tr>
                <th className="p-4 font-normal">Tenant (Negocio)</th>
                <th className="p-4 font-normal">Giro Comercial</th>
                <th className="p-4 font-normal">Presencia Digital</th>
                <th className="p-4 font-normal">Kill-Switch IA</th>
                <th className="p-4 font-normal">Tarifa Pay-Per-Lead</th>
                <th className="p-4 font-normal">Facturación Mes</th>
                <th className="p-4 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {Object.values(tenantsData).map((t) => (
                <tr
                  key={t.id}
                  className={`transition-colors ${
                    t.isAiActive ? 'hover:bg-[var(--bg-panel)]' : 'bg-red-500/5 hover:bg-red-500/10'
                  }`}
                >
                  <td className="p-4 font-bold text-xs text-[var(--text-main)] flex items-center gap-2">
                    <span className="text-base">{t.avatar}</span>
                    <span className="font-sans">{t.name}</span>
                  </td>
                  <td className="p-4 text-xs text-[var(--text-muted)] font-sans">{t.giro}</td>
                  <td className="p-4">
                    {t.hasWebsite ? (
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded text-[10px] flex items-center gap-1 w-fit">
                        <Globe className="w-3 h-3" />
                        CON Web (GA4)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] flex items-center gap-1 w-fit">
                        <Smartphone className="w-3 h-3" />
                        Micro-Landing
                      </span>
                    )}
                  </td>

                  {/* Kill Switch Toggle Column */}
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => toggleTenantAi(t.id)}
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                        t.isAiActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40'
                          : 'bg-red-500 text-white border-red-400 animate-pulse'
                      }`}
                      title={t.isAiActive ? 'Clic para Pausar IA (Takeover Humano)' : 'Clic para Reactivar IA'}
                    >
                      <Power className="w-3 h-3" />
                      <span>{t.isAiActive ? 'IA ACTIVA' : 'PAUSADO'}</span>
                    </button>
                  </td>

                  <td className="p-4 text-xs font-bold text-neon">
                    ${t.leadPriceMXN || 350} <span className="text-[10px] font-normal text-zinc-400">MXN</span>
                  </td>

                  <td className="p-4 text-xs font-bold text-white">
                    <span suppressHydrationWarning>
                      ${formatNumber((t.billedLeadsMonth || 0) * (t.leadPriceMXN || 350))} MXN
                    </span>{' '}
                    <span className="text-[10px] text-zinc-400">({t.billedLeadsMonth || 0} leads)</span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewTenant(t)}
                        className="text-xs bg-[var(--bg-base)] border border-neon/30 px-2.5 py-1.5 rounded-lg hover:border-neon text-neon transition-colors flex items-center gap-1"
                        title="Ver Micro-Landing Móvil"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Landing</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInspectTenant(t.id)}
                        className="text-xs bg-[var(--bg-base)] border border-[var(--border-color)] px-2.5 py-1.5 rounded-lg hover:border-white text-[var(--text-main)] transition-colors flex items-center gap-1"
                      >
                        <BarChart2 className="w-3 h-3 text-brand-primary" />
                        <span>Métricas</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Regla de Gobernanza */}
      {selectedRuleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/10 text-neon border border-neon/30">
                  {selectedRuleModal.number} • {selectedRuleModal.adrRef}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-main)] mt-2">
                  {selectedRuleModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRuleModal(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
              {selectedRuleModal.description}
            </p>

            <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Estado de la Regla:</span>
                <span className="font-bold text-emerald-400">{selectedRuleModal.statusLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Métrica del Sistema:</span>
                <span className="font-bold text-white">{selectedRuleModal.metric}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRuleModal(null);
                  router.push('/settings');
                }}
                className="text-xs font-mono font-bold bg-neon text-black px-4 py-2 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configurar en Políticas de Negocio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Micro-Landing Preview */}
      {previewTenant && (
        <MicroLandingPreviewModal
          isOpen={!!previewTenant}
          onClose={() => setPreviewTenant(null)}
          tenant={previewTenant}
        />
      )}
    </div>
  );
};
