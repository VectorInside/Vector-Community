'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RAGWizard } from '@/components/rag/RAGWizard';
import { SubBotsConfig } from '@/components/settings/SubBotsConfig';
import { BusinessPolicyEngine } from '@/components/settings/BusinessPolicyEngine';
import { ChannelConnectionsManager } from '@/components/settings/ChannelConnectionsManager';
import {
  Database,
  Cpu,
  Sliders,
  ShieldCheck,
  Plus,
  ArrowLeft,
  Sparkles,
  Share2,
} from 'lucide-react';

export const SystemConfigHub = ({ initialTab = 'rag', initialMode = 'list' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [adminMode, setAdminMode] = useState(initialMode); // 'list' | 'wizard'
  const { tenantsData, role, isAdmin, activeTenant } = useAuth();

  // Clientes nunca deben entrar en modo onboarding wizard
  useEffect(() => {
    if (!isAdmin && adminMode === 'wizard') {
      setAdminMode('list');
    }
  }, [isAdmin, adminMode]);

  // Sync mode if initialMode prop changes (e.g. from query params)
  useEffect(() => {
    if (initialMode && (isAdmin || initialMode !== 'wizard')) {
      setAdminMode(initialMode);
    }
  }, [initialMode, isAdmin]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header Contextual Homologado: Sin Selectores Duplicados */}
      {isAdmin && adminMode === 'wizard' ? (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--border-color)] pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold text-neon uppercase tracking-wider block">
                  Onboarding Guiado de Tenant
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
                  Alta & Provisión de <span className="text-neon">Nuevo Negocio</span>
                </h2>
              </div>
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5">
              Configura los datos del negocio, asigna su giro comercial (16 verticales oficiales) e indexa la base de conocimiento con total privacidad por empresa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAdminMode('list')}
              className="text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-neon px-4 py-2.5 rounded-xl font-mono font-bold transition-all flex items-center gap-2 active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Lista de Tenants</span>
            </button>
          </div>
        </header>
      ) : (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
                {isAdmin ? (
                  <>
                    Centro de <span className="text-neon">Configuración & Políticas</span>
                  </>
                ) : (
                  <>
                    Configuración de Negocio · <span className="text-neon">{activeTenant?.shortName || activeTenant?.name}</span>
                  </>
                )}
              </h2>
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5">
              {isAdmin
                ? 'Gestión unificada de Asistente RAG (4 Pilares), Motores de Sub-Bots (DeepSeek / Groq) y Reglas de Gobernanza Vector Inside.'
                : `Base de conocimiento RAG, sub-bots y políticas comerciales para ${activeTenant?.name || 'tu empresa'}.`}
            </p>
          </div>

          {/* Ecosistema Status & Action Button (Homologado, aislado por Tenant) */}
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <>
                <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    <strong className="text-[var(--text-main)] font-bold">{Object.keys(tenantsData || {}).length} Negocios</strong> Registrados
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('rag');
                    setAdminMode('wizard');
                  }}
                  className="text-xs bg-neon text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Alta Nuevo Negocio</span>
                </button>
              </>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5 shadow-sm font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[var(--text-muted)]">
                  Espacio: <strong className="text-[var(--text-main)] font-bold">{activeTenant?.shortName || activeTenant?.name}</strong>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neon/10 text-neon font-bold border border-neon/20">
                  {activeTenant?.giro}
                </span>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Tabs Navigation (Visible when not in full-screen onboarding wizard) */}
      {adminMode !== 'wizard' && (
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 overflow-x-auto font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('rag')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'rag'
                ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isAdmin ? '1. Multi-Tenant RAG (4 Pilares)' : '1. Base de Conocimiento (RAG)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subbots')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'subbots'
                ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. Motores & Sub-Bots AI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'policies'
                ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isAdmin ? '3. Reglas de Negocio & Precios' : '3. Mi Acuerdo de Facturación & Reglas'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'channels'
                ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>4. Canales & APIs Oficiales</span>
          </button>
        </div>
      )}

      {/* Tab Contents */}
      <div className="pt-2">
        {activeTab === 'rag' && (
          <RAGWizard
            externalAdminViewMode={adminMode}
            onAdminViewModeChange={setAdminMode}
            hideHeader={true}
          />
        )}
        {activeTab === 'subbots' && <SubBotsConfig />}
        {activeTab === 'policies' && <BusinessPolicyEngine />}
        {activeTab === 'channels' && <ChannelConnectionsManager />}
      </div>
    </div>
  );
};
