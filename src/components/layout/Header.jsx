'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

export const Header = () => {
  const {
    role,
    isAdmin,
    activeTenantKey,
    activeTenant,
    switchTenantContext,
    tenantsData,
  } = useAuth();

  return (
    <header className="w-full bg-[var(--bg-panel)] border-b border-[var(--border-color)] px-6 py-3 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline">
          Negocio Activo:
        </span>
        {isAdmin ? (
          <select
            value={activeTenantKey}
            onChange={(e) => switchTenantContext(e.target.value)}
            className="bg-[var(--bg-base)] text-xs text-[var(--text-main)] border border-neon rounded px-3 py-1 font-bold outline-none cursor-pointer shadow-[0_0_8px_var(--neon-glow)]"
          >
            {Object.values(tenantsData).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[var(--bg-base)] border border-neon text-xs font-bold text-[var(--text-main)] shadow-[0_0_8px_var(--neon-glow)]">
            <span>{activeTenant?.avatar}</span>
            <span>{activeTenant?.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Meta CAPI Sync Indicator */}
        <span className="text-[10px] font-mono bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 px-3 py-1.5 rounded flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Meta CAPI Sincronizado
        </span>

        {/* Role Pill */}
        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hidden md:inline">
          {isAdmin ? 'ADMIN AGENCIA' : 'CLIENTE FINAL'}
        </span>
      </div>
    </header>
  );
};
