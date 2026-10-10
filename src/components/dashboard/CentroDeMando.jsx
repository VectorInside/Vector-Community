'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Building2, Sparkles, Activity, ShieldCheck, ArrowRight, Plus } from 'lucide-react';
import { VectorLobo } from '@/components/common/VectorLobo';

export const CentroDeMando = () => {
  const router = useRouter();
  const { activeTenant, activeTenantKey, switchTenantContext, tenantsData, triggerModal } = useAuth();

  const handleInspectTenant = (tenantKey) => {
    switchTenantContext(tenantKey);
    router.push('/metrics');
  };

  return (
    <div className="p-8 block animate-fade-in">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
            Centro de <span className="text-neon">Mando</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Supervisión multi-negocio, telemetría y auditoría del ecosistema Vector Inside.
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
      <div className="mb-8 p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <VectorLobo size={42} showStatus={true} status="active" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon">
                Lobo Vectorial • Centinela de Gobernanza
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cognitive/10 text-cognitive border border-cognitive/20">
                IFV 46/50 Óptimo
              </span>
            </div>
            <p className="text-xs text-[var(--text-main)] italic mt-0.5 font-sans">
              "Auditoría activa en 4 tenants. Fricción sistémica 0% • Aislamiento RLS 100% verificado."
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => router.push('/config')}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] transition-colors"
          >
            Configurar RAG
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="vector-bg-panel vector-border p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">
            MER (ROAS Global Tenant)
          </p>
          <p className="text-3xl font-black text-[var(--text-main)] font-mono">
            {activeTenant?.mer}
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">
            Citas Agendadas (IA)
          </p>
          <p className="text-3xl font-black text-neon font-mono">
            {activeTenant?.citas}
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">
            CAC Actual vs Máximo
          </p>
          <p className="text-3xl font-black text-[var(--success)] font-mono">
            {activeTenant?.cac}{' '}
            <span className="text-xs text-zinc-500 font-normal">
              / {activeTenant?.cacMax}
            </span>
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-lg">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">
            Antifragilidad (IFV)
          </p>
          <p className="text-3xl font-black text-neon font-mono">
            {activeTenant?.ifv}
          </p>
        </div>
      </div>

      {/* Table of Tenants & RLS State */}
      <div className="vector-bg-card vector-border rounded-lg overflow-hidden">
        <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
            <Building2 className="w-4 h-4 text-neon" />
            <span>Lista General de Tenants & Estado RLS</span>
          </h3>
          <button
            type="button"
            onClick={() => router.push('/config')}
            className="text-xs bg-neon text-black font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_8px_var(--neon-glow)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Alta Nuevo Negocio</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-base)] text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
              <tr>
                <th className="p-4 font-normal">Tenant (Negocio)</th>
                <th className="p-4 font-normal">Giro Comercial</th>
                <th className="p-4 font-normal">Estado CAPI</th>
                <th className="p-4 font-normal">ROAS / MER</th>
                <th className="p-4 font-normal text-right">Acción Táctica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {Object.values(tenantsData).map((t) => (
                <tr key={t.id} className="hover:bg-[var(--bg-panel)] transition-colors">
                  <td className="p-4 font-bold text-xs text-[var(--text-main)] flex items-center gap-2">
                    <span className="text-base">{t.avatar}</span>
                    <span>{t.name}</span>
                  </td>
                  <td className="p-4 text-xs text-[var(--text-muted)]">{t.giro}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)] rounded text-[10px] font-mono">
                      {t.capiStatus}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-neon font-bold">{t.mer}</td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleInspectTenant(t.id)}
                      className="text-xs bg-[var(--bg-base)] border border-[var(--border-color)] px-3 py-1.5 rounded hover:border-neon text-[var(--text-main)] transition-colors"
                    >
                      Ver Analítica
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
