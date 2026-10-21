'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Portal } from '@/components/common/Portal';
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
  X,
  Search,
  Filter,
  BrainCircuit,
  Calendar,
  Settings,
  Star,
  Users,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { VectorLobo } from '@/components/common/VectorLobo';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { GOVERNANCE_SYSTEM_RULES } from '@/utils/constants';

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const CATEGORY_PILLS = [
  { id: 'all', label: 'Todos los Giros', icon: '🌐' },
  { id: 'Salud', label: 'Salud & Clínicas', icon: '🦷' },
  { id: 'Retail', label: 'Retail & E-Commerce', icon: '👟' },
  { id: 'B2B', label: 'B2B & Servicios', icon: '💼' },
  { id: 'Creadores', label: 'Creadores & Media', icon: '🎬' },
  { id: 'Hospitality', label: 'Hospitality & Eventos', icon: '🥩' },
];

export const CentroDeMando = () => {
  const router = useRouter();
  const {
    activeTenant,
    activeTenantKey,
    switchTenantContext,
    tenantsData,
    toggleTenantAi,
    updateTenantPolicy,
    triggerModal,
  } = useAuth();

  const [previewTenant, setPreviewTenant] = useState(null);
  const [selectedRuleModal, setSelectedRuleModal] = useState(null);
  const [drawerTenantId, setDrawerTenantId] = useState(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'paused'
  const [categoryFilter, setCategoryFilter] = useState('all');

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

  // Active drawer tenant object synchronized with live tenantsData
  const drawerTenant = drawerTenantId ? tenantsData[drawerTenantId] || null : null;

  // Body scroll lock and ESC key handling for modals/drawers
  useEffect(() => {
    const isOverlayOpen = !!selectedRuleModal || !!drawerTenantId;
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedRuleModal(null);
          setDrawerTenantId(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedRuleModal, drawerTenantId]);

  // Filtered tenants calculation
  const filteredTenants = useMemo(() => {
    return tenantsList.filter((t) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.giro?.toLowerCase().includes(q) ||
        t.shortName?.toLowerCase().includes(q);

      // 2. AI Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && t.isAiActive) ||
        (statusFilter === 'paused' && !t.isAiActive);

      // 3. Category
      const matchesCategory =
        categoryFilter === 'all' ||
        (t.giro && t.giro.toLowerCase().includes(categoryFilter.toLowerCase())) ||
        (categoryFilter === 'Salud' && (t.giro?.includes('Salud') || t.giro?.includes('Dental') || t.giro?.includes('Médic'))) ||
        (categoryFilter === 'Retail' && (t.giro?.includes('Retail') || t.giro?.includes('E-Commerce') || t.giro?.includes('Tienda'))) ||
        (categoryFilter === 'B2B' && (t.giro?.includes('B2B') || t.giro?.includes('Software') || t.giro?.includes('Consultoría'))) ||
        (categoryFilter === 'Creadores' && (t.giro?.includes('Creadores') || t.giro?.includes('Media') || t.giro?.includes('Podcasts')));

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tenantsList, searchQuery, statusFilter, categoryFilter]);

  const handleInspectTenant = (tenantKey) => {
    switchTenantContext(tenantKey);
    router.push('/performance');
  };

  const handleQuickActivateTenant = (tenantKey) => {
    switchTenantContext(tenantKey);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-8">
      {/* Header Unificado: Sin Selectores Redundantes */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
            Centro de <span className="text-neon">Mando</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Supervisión multi-negocio, Gobernanza y 5 Reglas Estrictas, Telemetría Web y Facturación Pay-Per-Lead.
          </p>
        </div>

        {/* Global Ecosistema Health Badge + Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-xs font-mono text-zinc-300">
              <strong className="text-white font-bold">{tenantsList.length} Negocios</strong> en Ecosistema
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push('/config?tab=rag&mode=wizard')}
            className="text-xs bg-neon text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Alta Nuevo Negocio</span>
          </button>
        </div>
      </header>

      {/* Lobo Vectorial Sentinel Diagnostic Banner */}
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
              "Auditoría activa en {tenantsList.length} tenants. Presencia digital CON Web & Micro-Landings RLS verificada."
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
            <span>Ver Micro-Landing ({activeTenant?.shortName || activeTenant?.name})</span>
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

      {/* Monitor de Gobernanza & 5 Reglas de Negocio */}
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

      {/* KPI Stats Grid & Resumen Financiero Global */}
      <div className="vector-bg-panel vector-border p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-neon" />
            <span>Economía Pay-Per-Lead (Ecosistema Global)</span>
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/10 text-neon border border-neon/30">
            Split 70% Agencia / 30% Plataforma
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
            <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Total Leads Facturados</p>
            <p className="text-2xl font-black text-white font-mono mt-1">{totalBilledLeads}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
            <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Facturación Bruta</p>
            <p className="text-xl font-black text-neon font-mono mt-1" suppressHydrationWarning>
              ${formatNumber(totalRevenueMXN)} MXN
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
            <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Ingreso Agencia (70%)</p>
            <p className="text-xl font-black text-emerald-400 font-mono mt-1" suppressHydrationWarning>
              ${formatNumber(agencyRevenueMXN)} MXN
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
            <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Custodia Depósitos</p>
            <p className="text-xl font-black text-cyan-400 font-mono mt-1" suppressHydrationWarning>
              ${formatNumber(totalRetainedDeposits)} MXN
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DECK DE GESTIÓN DE NEGOCIOS (BUSINESS COMMAND CARDS + FILTROS)        */}
      {/* ===================================================================== */}
      <div className="space-y-4">
        {/* Title, Search & Filters Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
              <Building2 className="w-5 h-5 text-neon" />
              <span>Deck de Negocios & Administración 1-Click</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Supervisión de cada cliente, control de Kill-Switch de IA, tarifas y acceso a herramientas operativas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar negocio o giro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-8 pr-7 py-1.5 text-xs text-white font-mono placeholder-zinc-500 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* AI Status Filter Tabs */}
            <div className="flex items-center bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)] text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Todos ({tenantsList.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  statusFilter === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                IA Activa ({tenantsList.filter((t) => t.isAiActive).length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('paused')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  statusFilter === 'paused'
                    ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30'
                    : 'text-zinc-400 hover:text-red-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Pausado ({tenantsList.filter((t) => !t.isAiActive).length})
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono">
          {CATEGORY_PILLS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                categoryFilter === cat.id
                  ? 'bg-neon text-black font-bold border-neon shadow-[0_0_12px_rgba(231,249,0,0.3)]'
                  : 'bg-[var(--bg-card)] text-zinc-400 hover:text-white border-[var(--border-color)] hover:border-zinc-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map((t) => {
            const isSelected = activeTenantKey === t.id;
            const monthlyBilling = (t.billedLeadsMonth || 0) * (t.leadPriceMXN || 350);

            return (
              <div
                key={t.id}
                className={`rounded-2xl p-5 border transition-all duration-200 relative flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-zinc-950/90 border-neon shadow-[0_0_25px_rgba(231,249,0,0.15)] ring-1 ring-neon/40'
                    : t.isAiActive
                    ? 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-neon/40 hover:shadow-lg'
                    : 'bg-red-950/15 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                }`}
              >
                {/* Card Top: Identity & Kill-Switch Toggle */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white font-sans group-hover:text-neon transition-colors">
                            {t.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold shrink-0">
                              ACTIVO
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 block line-clamp-1">
                          {t.giro}
                        </span>
                      </div>
                    </div>

                    {/* Kill-Switch Button */}
                    <button
                      type="button"
                      onClick={() => toggleTenantAi(t.id)}
                      className={`text-[9px] font-mono font-bold px-2 py-1 rounded-lg border flex items-center gap-1 transition-all shrink-0 ${
                        t.isAiActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40'
                          : 'bg-red-500 text-white border-red-400 animate-pulse'
                      }`}
                      title={t.isAiActive ? 'Clic para Pausar IA (Takeover Humano)' : 'Clic para Reactivar IA'}
                    >
                      <Power className="w-3 h-3" />
                      <span>{t.isAiActive ? 'IA ACTIVA' : 'PAUSADO'}</span>
                    </button>
                  </div>

                  {/* Presence & Tracking Tags */}
                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                    {t.hasWebsite ? (
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>Web + GA4</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        <span>Micro-Landing</span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded">
                      MER: {t.mer || '5.2x'}
                    </span>
                  </div>

                  {/* Micro-Metrics Grid (3-column financial & leads snapshot) */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-center">
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase block">Leads Mes</span>
                      <span className="text-xs font-bold text-white mt-0.5 block">{t.billedLeadsMonth || 0}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase block">Tarifa Lead</span>
                      <span className="text-xs font-bold text-neon mt-0.5 block">${t.leadPriceMXN || 350}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase block">Facturación</span>
                      <span className="text-xs font-bold text-emerald-400 mt-0.5 block" suppressHydrationWarning>
                        ${formatNumber(monthlyBilling)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Administrar, Landing, Fijar Activo) */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2 mt-4 font-mono text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Botón Administrar (Abre Drawer de Gestión) */}
                    <button
                      type="button"
                      onClick={() => setDrawerTenantId(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-neon/15 hover:bg-neon hover:text-black text-neon border border-neon/40 font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Administrar</span>
                    </button>

                    {/* Botón Ver Landing */}
                    <button
                      type="button"
                      onClick={() => setPreviewTenant(t)}
                      className="p-1.5 rounded-xl bg-[var(--bg-base)] hover:bg-zinc-800 border border-[var(--border-color)] text-zinc-300 hover:text-white transition-colors"
                      title="Ver Micro-Landing Móvil"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Botón Fijar como Activo en Sesión */}
                  <button
                    type="button"
                    onClick={() => handleQuickActivateTenant(t.id)}
                    disabled={isSelected}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700 cursor-default'
                        : 'bg-[var(--bg-base)] hover:bg-zinc-800 text-zinc-200 border-[var(--border-color)] hover:border-white'
                    }`}
                  >
                    <span>{isSelected ? 'Activo' : 'Seleccionar'}</span>
                    {!isSelected && <ChevronRight className="w-3 h-3 text-zinc-400" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTenants.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono">
            <Building2 className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-400 font-bold">No se encontraron negocios con esos filtros.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-xs text-neon underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* DRAWER DE GESTIÓN RÁPIDA DE NEGOCIO (PANEL LATERAL 1-CLICK)          */}
      {/* ===================================================================== */}
      {drawerTenant && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end animate-fade-in">
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setDrawerTenantId(null)}
            />
            <div className="relative z-10 w-full max-w-lg bg-zinc-950 border-l border-neon/40 h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between animate-slide-in-right">
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-3xl shrink-0">
                    {drawerTenant.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">
                      {drawerTenant.name}
                    </h3>
                    <span className="text-xs font-mono text-neon block">
                      {drawerTenant.giro}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 block">
                      ID: {drawerTenant.id}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerTenantId(null)}
                  className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sección 1: Control de Inteligencia Artificial (Kill-Switch) */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Power className="w-4 h-4 text-neon" />
                    <span>Kill-Switch de IA</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleTenantAi(drawerTenant.id)}
                    className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition-all ${
                      drawerTenant.isAiActive
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-red-500/20 hover:text-red-400'
                        : 'bg-red-500 text-white border-red-400 animate-pulse'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{drawerTenant.isAiActive ? 'IA ACTIVA' : 'PAUSADO (HITL)'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {drawerTenant.isAiActive
                    ? 'La IA está respondiendo automáticamente a prospectos en menos de 850ms y agendando citas en tiempo real.'
                    : 'IA CONGELADA. Intervención humana obligatoria activada. Los mensajes automáticos están suspendidos.'}
                </p>
              </div>

              {/* Sección 2: Ajuste de Tarifa Pay-Per-Lead */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3 font-mono text-xs">
                <span className="font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-neon" />
                  <span>Tarifa por Lead Calificado ($ MXN)</span>
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-2 text-neon font-bold">$</span>
                    <input
                      type="number"
                      value={drawerTenant.leadPriceMXN || 350}
                      onChange={(e) =>
                        updateTenantPolicy(drawerTenant.id, {
                          leadPriceMXN: Number(e.target.value),
                        })
                      }
                      className="w-full bg-zinc-950 border border-white/15 focus:border-neon rounded-xl pl-7 pr-3 py-1.5 text-xs text-white font-mono font-bold outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400">MXN / lead</span>
                </div>

                {/* Preset Fast Buttons */}
                <div className="flex items-center gap-2 pt-1 text-[10px]">
                  <span className="text-zinc-500">Ajuste rápido:</span>
                  {[200, 350, 500].map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => updateTenantPolicy(drawerTenant.id, { leadPriceMXN: price })}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        drawerTenant.leadPriceMXN === price
                          ? 'bg-neon/20 text-neon border-neon'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-white'
                      }`}
                    >
                      ${price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección 3: Métricas Financieras del Negocio */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 font-mono text-xs">
                <span className="font-bold text-zinc-200 uppercase tracking-wider block text-[11px] mb-1">
                  Métricas Acumuladas del Mes
                </span>
                <div className="flex justify-between text-zinc-400">
                  <span>Leads Calificados:</span>
                  <span className="text-white font-bold">{drawerTenant.billedLeadsMonth || 0} leads</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Facturación Acumulada:</span>
                  <span className="text-neon font-bold" suppressHydrationWarning>
                    ${formatNumber((drawerTenant.billedLeadsMonth || 0) * (drawerTenant.leadPriceMXN || 350))} MXN
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Depósito en Garantía:</span>
                  <span className="text-cyan-400 font-bold" suppressHydrationWarning>
                    ${formatNumber(drawerTenant.retainedDepositMXN || 15000)} MXN
                  </span>
                </div>
              </div>

              {/* Sección 4: Atajos de Gestión a Módulos Clave */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-zinc-400 uppercase tracking-wider text-[11px] block">
                  Herramientas Operativas de este Negocio
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      switchTenantContext(drawerTenant.id);
                      setDrawerTenantId(null);
                      router.push('/performance');
                    }}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-neon text-left transition-all hover:bg-zinc-800 space-y-1"
                  >
                    <BarChart2 className="w-4 h-4 text-neon" />
                    <p className="font-bold text-white text-[11px]">Métricas Web & CAPI</p>
                    <p className="text-[9px] text-zinc-400">GA4, Pixel & Tráfico</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchTenantContext(drawerTenant.id);
                      setDrawerTenantId(null);
                      router.push('/agenda');
                    }}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-neon text-left transition-all hover:bg-zinc-800 space-y-1"
                  >
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <p className="font-bold text-white text-[11px]">Master Agenda</p>
                    <p className="text-[9px] text-zinc-400">Turnos & Citas IA</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchTenantContext(drawerTenant.id);
                      setDrawerTenantId(null);
                      router.push('/config');
                    }}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-neon text-left transition-all hover:bg-zinc-800 space-y-1"
                  >
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <p className="font-bold text-white text-[11px]">RAG Wizard</p>
                    <p className="text-[9px] text-zinc-400">Base de Conocimiento</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTenant(drawerTenant);
                    }}
                    className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-neon text-left transition-all hover:bg-zinc-800 space-y-1"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <p className="font-bold text-white text-[11px]">Micro-Landing</p>
                    <p className="text-[9px] text-zinc-400">Simulador Móvil</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions: Set as Active Context */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => {
                  switchTenantContext(drawerTenant.id);
                  setDrawerTenantId(null);
                }}
                className="w-full py-3 rounded-xl bg-neon hover:bg-[#d9f200] text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-neon flex items-center justify-center gap-2 active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Fijar como Negocio Activo en Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => setDrawerTenantId(null)}
                className="w-full py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white font-mono text-xs transition-colors"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}

      {/* Modal de Detalle de Regla de Gobernanza */}
      {selectedRuleModal && (
        <Portal>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedRuleModal(null);
            }}
          >
            <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl relative my-auto animate-scale-up">
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
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
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
                  className="text-xs font-mono font-bold bg-neon text-black px-4 py-2 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5 shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configurar en Políticas de Negocio</span>
                </button>
              </div>
            </div>
          </div>
        </Portal>
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
