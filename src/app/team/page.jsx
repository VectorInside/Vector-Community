'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CuentasAccesosView } from '@/components/team/CuentasAccesosView';
import { AgencyStaffView } from '@/components/team/AgencyStaffView';
import { SecurityGovernanceView } from '@/components/team/SecurityGovernanceView';
import { KeyRound, Users, ShieldCheck, Lock } from 'lucide-react';

function TeamPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin, role } = useAuth();
  const initialTab = searchParams.get('tab') || 'accounts';
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-4 shadow-2xl animate-scale-up font-sans">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-neon-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
              Control de Acceso RBAC · Solo Agencia
            </span>
            <h2 className="text-xl font-heading font-black text-[var(--text-main)] uppercase">
              Módulo de Equipo & Control
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed">
            La gestión global de cuentas de clientes, colaboradores de agencia y auditoría centralizada es de uso exclusivo para la dirección de Vector Inside. Tu cuenta opera en un entorno 100% aislado.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs shadow-neon-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              Volver a Mi Centro de Mando
            </button>
          </div>
        </div>
      </div>
    );
  }

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
