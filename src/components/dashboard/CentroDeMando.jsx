'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
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
  CalendarDays,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import { VectorLobo } from '@/components/common/VectorLobo';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { MeasurementGuideModal } from '@/components/common/MeasurementGuideModal';
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
    role,
    isAdmin,
    isClient,
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
  const [guideMetricId, setGuideMetricId] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'paused'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calculate Global Pay-Per-Lead Business Metrics (Memoized for render performance)
  const tenantsList = useMemo(() => Object.values(tenantsData || {}), [tenantsData]);
  const { totalBilledLeads, totalRevenueMXN, agencyRevenueMXN, totalRetainedDeposits } = useMemo(() => {
    const billed = tenantsList.reduce((sum, t) => sum + (t.billedLeadsMonth || 0), 0);
    const rev = tenantsList.reduce(
      (sum, t) => sum + (t.billedLeadsMonth || 0) * (t.leadPriceMXN || 350),
      0
    );
    const agency = Math.round(rev * 0.7);
    const deposits = tenantsList.reduce(
      (sum, t) => sum + (t.retainedDepositMXN || 15000),
      0
    );
    return {
      totalBilledLeads: billed,
      totalRevenueMXN: rev,
      agencyRevenueMXN: agency,
      totalRetainedDeposits: deposits,
    };
  }, [tenantsList]);

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

      // 2. AI Status & Alerts
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && t.isAiActive) ||
        (statusFilter === 'paused' && !t.isAiActive) ||
        (statusFilter === 'alerts' && (t.frictionAlert || t.crisisMode));

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
      {/* Header Adaptable: Vista de Agencia vs Vista de Dueño de Negocio */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        {isClient ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-extrabold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/20">
                PANEL DEL NEGOCIO
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {activeTenant?.giro}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)] flex items-center gap-2.5">
              <span>{activeTenant?.avatar}</span>
              <span>{activeTenant?.name}</span>
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Supervisión de captación en tiempo real, citas agendadas, contenido editorial y ventas ganadas.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
              Centro de <span className="text-neon">Mando</span>
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Supervisión multi-negocio, Gobernanza y 5 Reglas Estrictas, Telemetría Web y Facturación Pay-Per-Lead.
            </p>
          </div>
        )}

        {/* Global Ecosistema Health Badge + Action */}
        {isClient ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2 shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTenant?.isAiActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {activeTenant?.isAiActive ? 'IA Asistente Operativa' : 'IA en Pausa (Atención Manual)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPreviewTenant(activeTenant)}
              className="text-xs bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] hover:text-neon font-mono font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm min-h-[40px]"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Ver Micro-Landing</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/inbox')}
              className="text-xs bg-neon text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95 min-h-[40px]"
            >
              <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Bandeja (3)</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-[var(--text-muted)]">
                <strong className="text-[var(--text-main)] font-bold">{tenantsList.length} Negocios</strong> en Ecosistema
              </span>
            </div>

            <button
              type="button"
              onClick={() => router.push('/config?tab=rag&mode=wizard')}
              className="text-xs bg-neon text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95 min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Alta Nuevo Negocio</span>
            </button>
          </div>
        )}
      </header>

      {/* Official UX/UI Hero Panel: Direccion Clara / Accion Concreta */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans uppercase tracking-widest text-neon font-extrabold bg-neon/10 px-2.5 py-1 rounded-full border border-neon/30">
              {isClient ? 'OPERACIÓN · DIRECCIÓN CLARA' : 'GOBERNANZA · CONTROL MULTI-NEGOCIO'}
            </span>
            <span className="text-xs font-sans text-[var(--text-muted)]">
              Octubre 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-black text-[var(--text-main)] leading-tight tracking-tight">
            {isClient ? (
              <>
                Convierte la atención en conversaciones.<br />
                <span className="text-neon">Dale dirección a cada oportunidad.</span>
              </>
            ) : (
              <>
                Supervisión activa de tu cartera.<br />
                <span className="text-neon">Gobernanza y telemetría en tiempo real.</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans leading-relaxed">
            {isClient ? (
              `Conecta la estrategia, contenido y seguimiento de ${activeTenant?.name || 'tu negocio'}. 3 consultas esperan atención inmediata en tu bandeja de WhatsApp y 2 piezas requieren tu visto bueno editorial.`
            ) : (
              `Supervisas ${tenantsList.length} negocios en el ecosistema. ${tenantsList.filter(t => !t.isAiActive).length > 0 ? `${tenantsList.filter(t => !t.isAiActive).length} en atención manual y ` : ''}${tenantsList.filter(t => t.frictionAlert).length} alertas de fricción web detectadas con Meta Pixel & GA4.`
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 font-sans">
            {isClient ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push('/inbox')}
                  className="px-5 py-3 rounded-xl bg-neon text-black font-sans font-bold text-xs uppercase flex items-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_20px_var(--neon-glow)] active:scale-95"
                >
                  <span>Atender conversaciones (3)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/planner')}
                  className="px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] font-sans font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  <span>Piezas por revisar (2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTenant(activeTenant)}
                  className="px-4 py-3 rounded-xl bg-neon/10 border border-neon/30 text-neon hover:bg-neon hover:text-black font-sans font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Ver Micro-Landing</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('deck-negocios');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl bg-neon text-black font-sans font-bold text-xs uppercase flex items-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_20px_var(--neon-glow)] active:scale-95"
                >
                  <span>Explorar Cartera ({tenantsList.length})</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/triage')}
                  className="px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] font-sans font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Triage & Sutura Arcángel</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/config?tab=rag&mode=wizard')}
                  className="px-4 py-3 rounded-xl bg-neon/10 border border-neon/30 text-neon hover:bg-neon hover:text-black font-sans font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Alta Nuevo Negocio</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Official Brand Wolf Floating */}
        <Image
          src="/assets/vector-wolf.png"
          alt="Lobo Vectorial"
          width={320}
          height={320}
          priority
          className="absolute right-[-40px] sm:right-[-20px] lg:right-4 bottom-[-20px] w-52 sm:w-72 lg:w-80 h-auto object-contain opacity-25 lg:opacity-40 pointer-events-none select-none filter drop-shadow-[0_0_30px_rgba(195,244,0,0.2)]"
        />
      </section>

      {/* 4 Core Cohort KPI Cards (Taxonomía UX/UI Oficial) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        {/* Card 1: Contactos Nuevos */}
        <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Contactos Nuevos
            </span>
            <span className="text-[9px] font-sans px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]">
              Meta + Web
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-[var(--text-main)]">18</span>
            <span className="text-xs font-sans text-[var(--text-muted)]">personas únicas</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            13 con intercambio confirmado (72.2%)
          </p>
        </div>

        {/* Card 2: Contactabilidad */}
        <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 relative group shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Contactabilidad
            </span>
            <button
              type="button"
              onClick={() => setGuideMetricId('contactabilidad_ratio')}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-neon hover:bg-[var(--bg-card)] transition-colors"
              title="Ver definición y fórmula operativa"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-neon">72.2%</span>
            <span className="text-xs font-sans text-emerald-600 dark:text-emerald-400 font-bold">SLA Cumplido</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            Meta 82% · Web 64% · 11 min promedio
          </p>
        </div>

        {/* Card 3: Prospectos Calificados */}
        <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 relative group shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Prospectos Calificados
            </span>
            <button
              type="button"
              onClick={() => setGuideMetricId('lead_calificado')}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-neon hover:bg-[var(--bg-card)] transition-colors"
              title="Ver definición y fórmula operativa"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-[var(--text-main)]">8</span>
            <span className="text-xs font-sans text-neon font-bold">Leads Calificados</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            $224,000 MXN en valor de pipeline
          </p>
        </div>

        {/* Card 4: Ventas Ganadas */}
        <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 relative group shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Ventas Ganadas
            </span>
            <button
              type="button"
              onClick={() => setGuideMetricId('venta_ganada')}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-lime-400 hover:bg-[var(--bg-card)] transition-colors"
              title="Ver definición y fórmula operativa"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-lime-400">$78,000</span>
            <span className="text-xs font-mono text-[var(--text-faint)]">MXN</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            3 cierres comerciales en octubre
          </p>
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
              Supervisión de calidad, tiempos de atención y reglas comerciales en tiempo real.
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
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
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
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5 font-sans font-medium">
                  {rule.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-[var(--text-muted)] font-medium">{rule.adrRef}</span>
                <span className="font-bold text-[var(--text-main)] flex items-center gap-1">
                  <span>{rule.metric}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-neon" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN PRINCIPAL: ADAPTADA SEGÚN ROL (CLIENTE 1:1 vs AGENCIA ADMIN)   */}
      {/* ===================================================================== */}
      {isClient ? (
        /* ===================================================================== */
        /* VISTA EXCLUSIVA DEL DUEÑO DEL NEGOCIO (ZERO LEAKAGE DE OTRAS EMPRESAS) */
        /* ===================================================================== */
        <div className="space-y-6">
          {/* Fila 1: Grid de 2 Columnas - Citas Agendadas (CRM) y Contenido en Revisión */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
            {/* 1. Próximas Citas & Oportunidades en Agenda */}
            <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-main)]">
                        Citas Agendadas & Prospectos Calificados
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono">
                        8 prospectos en tu pipeline comercial ($224,000 MXN)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/crm')}
                    className="text-xs font-mono text-neon hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Ver Kanban</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 mt-3">
                  {/* Lead 1 */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between gap-3 hover:border-neon/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        MG
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[var(--text-main)] truncate">Lic. Mariana Garza</p>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                            Cita Confirmada
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                          Mañana 11:30 hrs · Valor: $35,000 MXN · CAPI Verificado
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push('/inbox')}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon text-[10px] font-mono text-neon font-bold shrink-0"
                    >
                      Chat
                    </button>
                  </div>

                  {/* Lead 2 */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between gap-3 hover:border-neon/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-neon/15 border border-neon/30 text-neon flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        HV
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[var(--text-main)] truncate">Dr. Héctor Valdés</p>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neon/15 text-neon font-bold border border-neon/30">
                            Dictamen Aprobado
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                          Presupuesto enviado · Valor: $48,000 MXN · Pre-Cita
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push('/crm')}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon text-[10px] font-mono text-neon font-bold shrink-0"
                    >
                      Ficha
                    </button>
                  </div>

                  {/* Lead 3 */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between gap-3 hover:border-neon/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        CS
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[var(--text-main)] truncate">Ing. Carlos Soto</p>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold border border-amber-500/30">
                            Por Agendar
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                          Interés en catálogo · Dudas resueltas por IA
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push('/inbox')}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon text-[10px] font-mono text-neon font-bold shrink-0"
                    >
                      Contactar
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)]">Tasa de Asistencia Pre-Cita:</span>
                <span className="font-bold text-emerald-500">92.4% (Garantía Activa)</span>
              </div>
            </div>

            {/* 2. Contenido Editorial de la Semana (Parrilla) */}
            <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-main)]">
                        Estudio de Contenido & Redes
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono">
                        2 piezas esperan tu aprobación editorial
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/planner')}
                    className="text-xs font-mono text-neon hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Ver Calendario</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 mt-3">
                  {/* Post 1 */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          Por Aprobar
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">Reel · Meta & TikTok</span>
                      </div>
                      <p className="text-xs font-bold text-[var(--text-main)] line-clamp-1">
                        "3 Señales de que necesitas una valoración antes de que sea tarde"
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-sans line-clamp-1">
                        Guión generado con gancho de 3 segundos y llamado directo a WhatsApp.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push('/planner')}
                      className="px-3 py-1.5 rounded-xl bg-neon text-black text-[10px] font-mono font-black uppercase shrink-0 hover:bg-[var(--neon-hover)] transition-all shadow-sm active:scale-95"
                    >
                      Revisar
                    </button>
                  </div>

                  {/* Post 2 */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                          Aprobado
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">Carrusel · Instagram</span>
                      </div>
                      <p className="text-xs font-bold text-[var(--text-main)] line-clamp-1">
                        "Transformación y Caso Clínico: Caso de Éxito"
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">
                        Programado: Viernes 24 Oct, 18:00 hrs
                      </p>
                    </div>
                    <span className="text-emerald-500 font-mono text-xs font-bold shrink-0">✓ Listo</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)]">Frecuencia Editorial Semanal:</span>
                <span className="font-bold text-[var(--text-main)]">4 piezas programadas</span>
              </div>
            </div>
          </div>

          {/* Fila 2: Rendimiento de Campañas Activas de su Empresa */}
          <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Campañas de Publicidad Activas ({activeTenant?.name})
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    Meta Ads & Google CAPI · Presupuesto y Captación en tiempo real
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/campaigns')}
                className="text-xs font-mono text-neon hover:underline flex items-center gap-1 font-bold"
              >
                <span>Ver Métricas de Campaña</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Inversión Devengada Mes</span>
                <p className="text-xl font-bold text-[var(--text-main)]">$12,450 MXN</p>
                <span className="text-[10px] text-emerald-500 font-bold">ROAS Estimado: 4.2x</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Contactos Directos Captados</span>
                <p className="text-xl font-bold text-neon">18 Leads</p>
                <span className="text-[10px] text-[var(--text-muted)]">Costo por Lead: $350 MXN</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Canal Más Efectivo</span>
                <p className="text-xl font-bold text-cyan-400">WhatsApp Direct</p>
                <span className="text-[10px] text-[var(--text-muted)]">68% de conversiones a cita</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* VISTA EXCLUSIVA ADMINISTRADOR AGENCIA (MULTI-TENANT DECK + FINANZAS)   */
        /* ===================================================================== */
        <>
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
                <p className="text-[9px] font-mono text-[var(--text-muted)] font-bold uppercase">Total Leads Facturados</p>
                <p className="text-2xl font-black text-[var(--text-main)] font-mono mt-1">{totalBilledLeads}</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                <p className="text-[9px] font-mono text-[var(--text-muted)] font-bold uppercase">Facturación Bruta</p>
                <p className="text-xl font-black text-neon font-mono mt-1" suppressHydrationWarning>
                  ${formatNumber(totalRevenueMXN)} MXN
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                <p className="text-[9px] font-mono text-[var(--text-muted)] font-bold uppercase">Ingreso Agencia (70%)</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1" suppressHydrationWarning>
                  ${formatNumber(agencyRevenueMXN)} MXN
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                <p className="text-[9px] font-mono text-[var(--text-muted)] font-bold uppercase">Custodia Depósitos</p>
                <p className="text-xl font-black text-cyan-600 dark:text-cyan-400 font-mono mt-1" suppressHydrationWarning>
                  ${formatNumber(totalRetainedDeposits)} MXN
                </p>
              </div>
            </div>
          </div>

          {/* DECK DE GESTIÓN DE NEGOCIOS (BUSINESS COMMAND CARDS + FILTROS) */}
          <div id="deck-negocios" className="space-y-4 scroll-mt-6">
            {/* Title, Search & Filters Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
                  <Building2 className="w-5 h-5 text-neon" />
                  <span>Deck de Negocios & Administración 1-Click</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  Supervisión de cada cliente, control de Kill-Switch de IA, tarifas y acceso a herramientas operativas.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar negocio o giro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-8 pr-7 py-1.5 text-xs text-[var(--text-main)] font-mono placeholder-[var(--text-muted)] outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* AI & Alert Status Filter Tabs */}
                <div className="flex items-center bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)] text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      statusFilter === 'all'
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Todos ({tenantsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('active')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      statusFilter === 'active'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-[var(--text-muted)] hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    IA Activa ({tenantsList.filter((t) => t.isAiActive).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('paused')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      statusFilter === 'paused'
                        ? 'bg-red-500/20 text-red-600 dark:text-red-400 font-bold border border-red-500/30'
                        : 'text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Pausado ({tenantsList.filter((t) => !t.isAiActive).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('alerts')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      statusFilter === 'alerts'
                        ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30'
                        : 'text-[var(--text-muted)] hover:text-amber-500'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Con Alertas ({tenantsList.filter((t) => t.frictionAlert || t.crisisMode).length})
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
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--text-muted)]'
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
                        ? 'bg-[var(--bg-panel)] border-neon shadow-[0_0_25px_rgba(231,249,0,0.15)] ring-2 ring-neon/60'
                        : t.isAiActive
                        ? 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-neon/40 hover:shadow-lg'
                        : 'bg-red-950/15 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    }`}
                  >
                    {/* Card Top: Identity & Kill-Switch Toggle */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-center justify-center text-2xl shrink-0 shadow-sm">
                            {t.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-[var(--text-main)] font-sans group-hover:text-neon transition-colors">
                                {t.name}
                              </h4>
                              {isSelected && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold shrink-0">
                                  ACTIVO
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-[var(--text-muted)] block line-clamp-1 font-medium">
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

                        <span className="px-2 py-0.5 bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)] rounded font-medium">
                          MER: {t.mer || '5.2x'}
                        </span>

                        {t.frictionAlert && (
                          <span className="px-2 py-0.5 bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded flex items-center gap-1 font-bold">
                            <AlertOctagon className="w-3 h-3" />
                            <span>Alerta Web</span>
                          </span>
                        )}
                        {t.crisisMode && (
                          <span className="px-2 py-0.5 bg-red-500/15 text-red-500 border border-red-500/30 rounded flex items-center gap-1 font-bold animate-pulse">
                            <AlertOctagon className="w-3 h-3" />
                            <span>Crisis</span>
                          </span>
                        )}
                      </div>

                      {/* Micro-Metrics Grid (3-column financial & leads snapshot) */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-center">
                        <div>
                          <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase block">Leads Mes</span>
                          <span className="text-xs font-bold text-[var(--text-main)] mt-0.5 block">{t.billedLeadsMonth || 0}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase block">Tarifa Lead</span>
                          <span className="text-xs font-bold text-neon mt-0.5 block">${t.leadPriceMXN || 350}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase block">Facturación</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block" suppressHydrationWarning>
                            ${formatNumber(monthlyBilling)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Buttons (Administrar, Landing, Fijar Activo) */}
                    <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2 mt-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDrawerTenantId(t.id)}
                          className="px-3 py-1.5 rounded-xl bg-neon/15 hover:bg-neon hover:text-black text-neon border border-neon/40 font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Administrar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreviewTenant(t)}
                          className="p-1.5 rounded-xl bg-[var(--bg-base)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                          title="Ver Micro-Landing Móvil"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickActivateTenant(t.id)}
                        disabled={isSelected}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-[var(--border-color)] cursor-default'
                            : 'bg-[var(--bg-base)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border-[var(--border-color)] hover:border-neon'
                        }`}
                      >
                        <span>{isSelected ? 'Activo' : 'Seleccionar'}</span>
                        {!isSelected && <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTenants.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono">
                <Building2 className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
                <p className="text-sm text-[var(--text-main)] font-bold">No se encontraron negocios con esos filtros.</p>
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
        </>
      )}

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
            <div className="relative z-10 w-full max-w-lg bg-[var(--bg-panel)] border-l border-neon/40 h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between animate-slide-in-right">
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-center justify-center text-3xl shrink-0">
                    {drawerTenant.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-main)] font-sans">
                      {drawerTenant.name}
                    </h3>
                    <span className="text-xs font-mono text-neon block">
                      {drawerTenant.giro}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                      ID: {drawerTenant.id}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerTenantId(null)}
                  className="p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sección 1: Control de Inteligencia Artificial (Kill-Switch) */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
                    <Power className="w-4 h-4 text-neon" />
                    <span>Kill-Switch de IA</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleTenantAi(drawerTenant.id)}
                    className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition-all ${
                      drawerTenant.isAiActive
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-red-500/20 hover:text-red-400'
                        : 'bg-red-500 text-white border-red-400 animate-pulse'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{drawerTenant.isAiActive ? 'IA ACTIVA' : 'PAUSADO (HITL)'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-medium leading-relaxed">
                  {drawerTenant.isAiActive
                    ? 'La IA está respondiendo automáticamente a prospectos en menos de 850ms y agendando citas en tiempo real.'
                    : 'IA CONGELADA. Intervención humana obligatoria activada. Los mensajes automáticos están suspendidos.'}
                </p>
              </div>

              {/* Sección 2: Ajuste de Tarifa Pay-Per-Lead */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono text-xs">
                <span className="font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
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
                      className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-7 pr-3 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">MXN / lead</span>
                </div>

                {/* Preset Fast Buttons */}
                <div className="flex items-center gap-2 pt-1 text-[10px]">
                  <span className="text-[var(--text-muted)]">Ajuste rápido:</span>
                  {[200, 350, 500].map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => updateTenantPolicy(drawerTenant.id, { leadPriceMXN: price })}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        drawerTenant.leadPriceMXN === price
                          ? 'bg-neon/20 text-neon border-neon'
                          : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      ${price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección 3: Métricas Financieras del Negocio */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 font-mono text-xs">
                <span className="font-bold text-[var(--text-main)] uppercase tracking-wider block text-[11px] mb-1">
                  Métricas Acumuladas del Mes
                </span>
                <div className="flex justify-between text-[var(--text-muted)] font-medium">
                  <span>Leads Calificados:</span>
                  <span className="text-[var(--text-main)] font-bold">{drawerTenant.billedLeadsMonth || 0} leads</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)] font-medium">
                  <span>Facturación Acumulada:</span>
                  <span className="text-neon font-bold" suppressHydrationWarning>
                    ${formatNumber((drawerTenant.billedLeadsMonth || 0) * (drawerTenant.leadPriceMXN || 350))} MXN
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)] font-medium">
                  <span>Depósito en Garantía:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold" suppressHydrationWarning>
                    ${formatNumber(drawerTenant.retainedDepositMXN || 15000)} MXN
                  </span>
                </div>
              </div>

              {/* Sección 4: Atajos de Gestión a Módulos Clave */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[11px] block">
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
                    className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-left transition-all hover:bg-[var(--bg-card-subtle)] space-y-1"
                  >
                    <BarChart2 className="w-4 h-4 text-neon" />
                    <p className="font-bold text-[var(--text-main)] text-[11px]">Métricas Web & CAPI</p>
                    <p className="text-[9px] text-[var(--text-muted)]">GA4, Pixel & Tráfico</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchTenantContext(drawerTenant.id);
                      setDrawerTenantId(null);
                      router.push('/agenda');
                    }}
                    className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-left transition-all hover:bg-[var(--bg-card-subtle)] space-y-1"
                  >
                    <Calendar className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    <p className="font-bold text-[var(--text-main)] text-[11px]">Master Agenda</p>
                    <p className="text-[9px] text-[var(--text-muted)]">Turnos & Citas IA</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchTenantContext(drawerTenant.id);
                      setDrawerTenantId(null);
                      router.push('/config');
                    }}
                    className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-left transition-all hover:bg-[var(--bg-card-subtle)] space-y-1"
                  >
                    <BrainCircuit className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <p className="font-bold text-[var(--text-main)] text-[11px]">RAG Wizard</p>
                    <p className="text-[9px] text-[var(--text-muted)]">Base de Conocimiento</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTenant(drawerTenant);
                    }}
                    className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-left transition-all hover:bg-[var(--bg-card-subtle)] space-y-1"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <p className="font-bold text-[var(--text-main)] text-[11px]">Micro-Landing</p>
                    <p className="text-[9px] text-[var(--text-muted)]">Simulador Móvil</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions: Set as Active Context */}
            <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
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
                className="w-full py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-mono text-xs transition-colors"
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
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                {selectedRuleModal.description}
              </p>

              <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-medium">Estado de la Regla:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedRuleModal.statusLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-medium">Métrica del Sistema:</span>
                  <span className="font-bold text-[var(--text-main)]">{selectedRuleModal.metric}</span>
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

      {/* Modal de Guía de Medición */}
      <MeasurementGuideModal
        isOpen={!!guideMetricId}
        onClose={() => setGuideMetricId(null)}
        initialMetricId={guideMetricId}
      />
    </div>
  );
};
