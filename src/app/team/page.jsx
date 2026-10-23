'use client';

import React, { useState } from 'react';
import { CuentasAccesosView } from '@/components/team/CuentasAccesosView';
import { BusinessPolicyEngine } from '@/components/settings/BusinessPolicyEngine';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <div className="min-h-screen pb-16 animate-fade-in font-sans">
      {/* Navigation Tabs Bar con accesibilidad y diseño Vector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div 
          role="tablist" 
          aria-label="Gestión de Equipo y Accesos"
          className="flex items-center gap-2 p-1.5 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl w-fit shadow-inner"
        >
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
            <span>Cuentas & Accesos de Clientes</span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-policies"
            aria-selected={activeTab === 'policies'}
            aria-controls="panel-policies"
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all min-h-[44px] ${
              activeTab === 'policies'
                ? 'bg-neon text-black shadow-[0_0_15px_rgba(195,244,0,0.35)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Políticas & Seguridad</span>
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

        {activeTab === 'policies' && (
          <div
            id="panel-policies"
            role="tabpanel"
            aria-labelledby="tab-policies"
            className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <BusinessPolicyEngine />
          </div>
        )}
      </div>
    </div>
  );
}
