'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CuentasAccesosView } from '@/components/team/CuentasAccesosView';
import { AgencyStaffView } from '@/components/team/AgencyStaffView';
import { SecurityGovernanceView } from '@/components/team/SecurityGovernanceView';
import { KeyRound, Users, ShieldCheck } from 'lucide-react';

function TeamPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'accounts';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="min-h-screen pb-16 animate-fade-in font-sans">
      {/* Navigation Tabs Bar con diseño premium Vector Inside */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div
          role="tablist"
          aria-label="Consola de Administración de Equipo y Accesos"
          className="flex flex-wrap items-center gap-2 p-1.5 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl w-fit shadow-inner"
        >
          {/* Tab 1: Clientes (Dueños de Negocio) */}
          <button
            type="button"
            role="tab"
            id="tab-accounts"
            aria-selected={activeTab === 'accounts'}
            aria-controls="panel-accounts"
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all min-h-[44px] ${
              activeTab === 'accounts'
                ? 'bg-neon text-black shadow-[0_0_15px_rgba(195,244,0,0.35)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <span>1. Clientes (Dueños de Negocio)</span>
          </button>

          {/* Tab 2: Equipo de la Agencia (Staff) */}
          <button
            type="button"
            role="tab"
            id="tab-staff"
            aria-selected={activeTab === 'staff'}
            aria-controls="panel-staff"
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all min-h-[44px] ${
              activeTab === 'staff'
                ? 'bg-neon text-black shadow-[0_0_15px_rgba(195,244,0,0.35)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>2. Equipo de la Agencia (Staff)</span>
          </button>

          {/* Tab 3: Roles, Gobernanza & Auditoría */}
          <button
            type="button"
            role="tab"
            id="tab-governance"
            aria-selected={activeTab === 'governance'}
            aria-controls="panel-governance"
            onClick={() => setActiveTab('governance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all min-h-[44px] ${
              activeTab === 'governance'
                ? 'bg-neon text-black shadow-[0_0_15px_rgba(195,244,0,0.35)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>3. Roles & Auditoría de Seguridad</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="mt-2">
        {activeTab === 'accounts' && (
          <div
            id="panel-accounts"
            role="tabpanel"
            aria-labelledby="tab-accounts"
            className="animate-fade-in"
          >
            <CuentasAccesosView />
          </div>
        )}

        {activeTab === 'staff' && (
          <div
            id="panel-staff"
            role="tabpanel"
            aria-labelledby="tab-staff"
            className="animate-fade-in"
          >
            <AgencyStaffView />
          </div>
        )}

        {activeTab === 'governance' && (
          <div
            id="panel-governance"
            role="tabpanel"
            aria-labelledby="tab-governance"
            className="animate-fade-in"
          >
            <SecurityGovernanceView />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span>Cargando Consola de Equipo y Control...</span>
          </div>
        </div>
      }
    >
      <TeamPageContent />
    </Suspense>
  );
}
