'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RAGWizard } from '@/components/rag/RAGWizard';
import { SubBotsConfig } from '@/components/settings/SubBotsConfig';
import { BusinessPolicyEngine } from '@/components/settings/BusinessPolicyEngine';
import { Database, Cpu, Sliders, ShieldCheck } from 'lucide-react';

export const SystemConfigHub = ({ initialTab = 'rag' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { activeTenant, activeTenantKey, switchTenantContext, tenantsData } = useAuth();

  return (
    <div className="p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
              Centro de <span className="text-neon">Configuración & Políticas</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Gestión unificada de Asistente RAG (4 Pilares), Motores de Sub-Bots (DeepSeek / Groq) y Reglas de Gobernanza Vector Inside.
          </p>
        </div>

        {/* Tenant Selector */}
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
            Negocio Activo:
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

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('rag')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'rag'
              ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-card)] border border-[var(--border-color)]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>1. Multi-Tenant RAG (4 Pilares)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subbots')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'subbots'
              ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-card)] border border-[var(--border-color)]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>2. Motores & Sub-Bots AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'policies'
              ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-card)] border border-[var(--border-color)]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. Reglas de Negocio & Precios</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {activeTab === 'rag' && <RAGWizard />}
        {activeTab === 'subbots' && <SubBotsConfig />}
        {activeTab === 'policies' && <BusinessPolicyEngine />}
      </div>
    </div>
  );
};
