'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Portal } from '@/components/common/Portal';
import {
  Building2,
  Activity,
  ShieldCheck,
  Plus,
  Globe,
  Smartphone,
  BarChart2,
  Power,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  Info,
  Sliders,
  Check,
  X,
  Search,
  BrainCircuit,
  Calendar,
  Users,
  ChevronRight,
  CalendarDays,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { MeasurementGuideModal } from '@/components/common/MeasurementGuideModal';

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
    currentUser,
    role,
    isAdmin,
    isClient,
    activeTenant,
    activeTenantKey,
    switchTenantContext,
    tenantsData,
    toggleTenantAi,
    updateTenantPolicy,
  } = useAuth();

  const [previewTenant, setPreviewTenant] = useState(null);
  const [drawerTenantId, setDrawerTenantId] = useState(null);
  const [guideMetricId, setGuideMetricId] = useState(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'paused' | 'alerts'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Tenants List & Totals
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

  const activeAiCount = useMemo(() => tenantsList.filter((t) => t.isAiActive).length, [tenantsList]);
  const pausedAiCount = useMemo(() => tenantsList.filter((t) => !t.isAiActive).length, [tenantsList]);
  const crisisCount = useMemo(() => tenantsList.filter((t) => t.crisisMode).length, [tenantsList]);
  const estimatedPipelineMXN = useMemo(() => {
    return totalRevenueMXN > 0 ? Math.round(totalRevenueMXN * 2.5) : totalBilledLeads * 1200;
  }, [totalRevenueMXN, totalBilledLeads]);

  // Radar attention items
  const attentionTenants = useMemo(() => {
    return tenantsList.filter((t) => t.crisisMode || t.frictionAlert || !t.isAiActive);
  }, [tenantsList]);

  // Formatted Date
  const formattedDate = useMemo(() => {
    try {
      const now = new Date();
      const str = now.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (e) {
      return 'Hoy';
    }
  }, []);

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

  // Active drawer tenant object synchronized with live tenantsData
  const drawerTenant = drawerTenantId ? tenantsData[drawerTenantId] || null : null;

  // Body scroll lock and ESC key handling for drawer
  useEffect(() => {
    if (drawerTenantId) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setDrawerTenantId(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [drawerTenantId]);

  const handleQuickActivateTenant = (tenantKey) => {
    switchTenantContext(tenantKey);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* ===================================================================== */}
      {/* 1. BARRA DE SALUDO Y CONTEXTO EJECUTIVO COMPACTA (~50px)              */}
      {/* ===================================================================== */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-sm min-h-[52px]">
        {isClient ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeTenant?.avatar || '⚡'}</span>
              <h1 className="text-sm font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
                Bienvenido, <span className="text-neon">{currentUser?.name || activeTenant?.name || 'Cliente'}</span>
              </h1>
            </div>
            <span className="text-[var(--text-faint)] hidden sm:inline">|</span>
            <span suppressHydrationWarning className="text-xs text-[var(--text-muted)] font-mono capitalize">
              {formattedDate}
            </span>
            <span className="text-[var(--text-faint)] hidden md:inline">|</span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[var(--text-main)] font-bold">{activeTenant?.name}</span>
              <span className="text-[var(--text-muted)]">({activeTenant?.giro})</span>
              <span className={`w-2 h-2 rounded-full ${activeTenant?.isAiActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[var(--text-muted)]">
                {activeTenant?.isAiActive ? 'IA Asistente Operativa' : 'IA en Pausa'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <h1 className="text-sm font-heading font-black uppercase tracking-tight text-[var(--text-main)]">
                Bienvenido, <span className="text-neon">{currentUser?.name || 'Edgar Lobo'}</span>
              </h1>
            </div>
            <span className="text-[var(--text-faint)] hidden sm:inline">|</span>
            <span suppressHydrationWarning className="text-xs text-[var(--text-muted)] font-mono capitalize">
              {formattedDate}
            </span>
            <span className="text-[var(--text-faint)] hidden md:inline">|</span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              <strong className="text-[var(--text-main)] font-bold">{tenantsList.length}</strong> Negocios en Ecosistema ·{' '}
              <strong className="text-emerald-500 font-bold">{activeAiCount}</strong> con IA Activa
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {isClient ? (
            <>
              <button
                type="button"
                onClick={() => setPreviewTenant(activeTenant)}
                className="text-xs bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] hover:text-neon font-mono font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Micro-Landing</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/inbox')}
                className="text-xs bg-neon text-black font-mono font-black uppercase px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Bandeja</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/config?tab=rag&mode=wizard')}
              className="text-xs bg-neon text-black font-mono font-black uppercase px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Alta Nuevo Negocio</span>
            </button>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. BLOQUE 1: TELEMETRÍA RÁPIDA (4 KPIS EJECUTIVOS CON CONTEXTO REAL)   */}
      {/* ===================================================================== */}
      <div id="tour-kpi-cards" data-tour="dashboard-kpis" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        {/* KPI 1: Salud de Cartera */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm relative group hover:border-[var(--border-color-hover)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Salud de Cartera
            </span>
            <button
              type="button"
              onClick={() => setGuideMetricId('contactabilidad_ratio')}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-neon hover:bg-[var(--bg-card)] transition-colors"
              title="Ver definición y metodología"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
              {tenantsList.length}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">negocios en cartera</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono pt-0.5">
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeAiCount} activos
            </span>
            <span className="text-[var(--text-faint)]">·</span>
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {pausedAiCount} manual
            </span>
          </div>
        </div>

        {/* KPI 2: Prospectos Calificados (Mes) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm relative group hover:border-[var(--border-color-hover)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Prospectos Calificados
            </span>
            <button
              type="button"
              onClick={() => setGuideMetricId('lead_calificado')}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-neon hover:bg-[var(--bg-card)] transition-colors"
              title="Ver definición y protocolo de calificación"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-neon">
              {totalBilledLeads}
            </span>
            <span className="text-xs font-mono text-neon font-bold">leads (mes)</span>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] pt-0.5" suppressHydrationWarning>
            ${formatNumber(estimatedPipelineMXN)} MXN valor est. pipeline
          </p>
        </div>

        {/* KPI 3: Facturación Devengada */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm relative group hover:border-[var(--border-color-hover)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Facturación Devengada
            </span>
            <button
              type="button"
              onClick={() => setGuideMetricId('venta_ganada')}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-lime-400 hover:bg-[var(--bg-card)] transition-colors"
              title="Ver fórmula y reconciliación"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-heading font-black text-lime-400" suppressHydrationWarning>
              ${formatNumber(totalRevenueMXN)}
            </span>
            <span className="text-xs font-mono text-[var(--text-faint)]">MXN</span>
          </div>
          <p className="text-xs font-mono text-emerald-500 dark:text-emerald-400 font-bold pt-0.5" suppressHydrationWarning>
            Agencia (70%): ${formatNumber(agencyRevenueMXN)} MXN
          </p>
        </div>

        {/* KPI 4: SLA & Velocidad de Respuesta */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm relative group hover:border-[var(--border-color-hover)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              SLA & Velocidad de Respuesta
            </span>
            <button
              type="button"
              onClick={() => setGuideMetricId('tiempo_primera_respuesta')}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-cyan-400 hover:bg-[var(--bg-card)] transition-colors"
              title="Ver métricas de tiempo y p90"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-cyan-400">
              &lt; 5 min
            </span>
            <span className="text-xs font-mono text-emerald-500 font-bold">SLA Óptimo</span>
          </div>
          {crisisCount > 0 ? (
            <p className="text-xs font-mono text-red-500 font-bold flex items-center gap-1.5 pt-0.5 animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Centinela: {crisisCount} alerta(s) de crisis</span>
            </p>
          ) : (
            <p className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Centinela de Crisis: 0 alertas</span>
            </p>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN CONDICIONAL SEGÚN ROL: VISTA CLIENTE VS VISTA AGENCIA/ADMIN   */}
      {/* ===================================================================== */}
      {isClient ? (
        /* Vista dedicada al cliente individual */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
            {/* Próximas Citas & Oportunidades en Agenda */}
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
                        Pipeline comercial en tiempo real
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
                  <div className="p-8 rounded-xl bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] text-center font-mono text-xs text-[var(--text-muted)] space-y-1">
                    <Users className="w-8 h-8 opacity-30 mx-auto mb-1" />
                    <p className="font-bold">Sin prospectos registrados aún</p>
                    <p className="text-[10px] text-[var(--text-faint)]">
                      Los prospectos capturados por el motor omnicanal aparecerán aquí de inmediato.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)]">Tasa de Asistencia Pre-Cita:</span>
                <span className="font-bold text-emerald-500">100% (Garantía Activa)</span>
              </div>
            </div>

            {/* Contenido Editorial de la Semana */}
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
                        Parrilla editorial en tiempo real
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
                  <div className="p-8 rounded-xl bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] text-center font-mono text-xs text-[var(--text-muted)] space-y-1">
                    <CalendarDays className="w-8 h-8 opacity-30 mx-auto mb-1" />
                    <p className="font-bold">Sin publicaciones pendientes</p>
                    <p className="text-[10px] text-[var(--text-faint)]">
                      Genera nuevas piezas editoriales con IA o programa tu contenido en el calendario.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)]">Frecuencia Editorial Semanal:</span>
                <span className="font-bold text-[var(--text-main)]">Parrilla lista</span>
              </div>
            </div>
          </div>

          {/* Rendimiento de Campañas Activas */}
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
                <p className="text-xl font-bold text-[var(--text-main)]">$0 MXN</p>
                <span className="text-[10px] text-emerald-500 font-bold">ROAS Estimado: 0.0x</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Contactos Directos Captados</span>
                <p className="text-xl font-bold text-neon">0 Leads</p>
                <span className="text-[10px] text-[var(--text-muted)]">Costo por Lead: $0 MXN</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Canal Más Efectivo</span>
                <p className="text-xl font-bold text-cyan-400">WhatsApp Direct</p>
                <span className="text-[10px] text-[var(--text-muted)]">0% de conversiones a cita</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vista de Agencia / Administrador */
        <>
          {/* ===================================================================== */}
          {/* 3. BLOQUE 2: RADAR DE ATENCIÓN INMEDIATA ("Lo que requiere tu atención hoy") */}
          {/* ===================================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neon" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Radar de Atención Inmediata
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)] hidden sm:inline">
                  · Lo que requiere tu atención hoy
                </span>
              </div>

              {tenantsList.length > 0 && attentionTenants.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold">
                  {attentionTenants.length} Pendiente{attentionTenants.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {tenantsList.length === 0 ? (
              /* Zero state motivador cuando no hay negocios en la cartera */
              <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-main)] flex items-center justify-center sm:justify-start gap-2">
                    <span>🚀</span>
                    <span>Bienvenido a Vector Community OS.</span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-sans max-w-xl">
                    Da de alta tu primer negocio para activar la supervisión inteligente de captación y pauta.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/config?tab=rag&mode=wizard')}
                  className="px-4 py-2.5 rounded-xl bg-neon text-black font-sans font-bold text-xs uppercase flex items-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Dar de Alta Primer Negocio</span>
                </button>
              </div>
            ) : attentionTenants.length === 0 ? (
              /* Banner de Paz Operativa */
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      ✅ Cartera Operando al 100%
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">
                      Todos los agentes en rango óptimo · 0 alertas de crisis
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  PAZ OPERATIVA
                </span>
              </div>
            ) : (
              /* Panel de Tarjetas Compactas de Alertas Activas */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {attentionTenants.map((t) => {
                  const isPaused = !t.isAiActive;
                  const hasCrisis = t.crisisMode;
                  const hasFriction = t.frictionAlert;

                  return (
                    <div
                      key={`attention-${t.id}`}
                      className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl shrink-0">{t.avatar}</span>
                            <div>
                              <h4 className="text-xs font-bold text-[var(--text-main)] font-sans line-clamp-1">
                                {t.name}
                              </h4>
                              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                {t.giro}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 shrink-0">
                            {hasCrisis && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/15 text-red-500 border border-red-500/30 font-bold animate-pulse">
                                CRISIS
                              </span>
                            )}
                            {hasFriction && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold">
                                FRICCIÓN WEB
                              </span>
                            )}
                            {isPaused && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                                IA PAUSADA
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-[var(--text-muted)] font-mono leading-tight">
                          {hasCrisis
                            ? 'Centinela detectó incidente en SLA de respuesta o anomalía en atención.'
                            : hasFriction
                            ? 'Conversión a WhatsApp web debajo del umbral objetivo (Meta CAPI / GA4).'
                            : 'Agente en atención manual. Se requiere supervisión o reactivación de IA.'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2 font-mono text-[11px]">
                        {isPaused && (
                          <button
                            type="button"
                            onClick={() => toggleTenantAi(t.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold border border-emerald-500/30 transition-all flex items-center gap-1"
                          >
                            <Power className="w-3 h-3" />
                            <span>Reactivar IA</span>
                          </button>
                        )}

                        {hasFriction && (
                          <button
                            type="button"
                            onClick={() => {
                              switchTenantContext(t.id);
                              router.push('/performance');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-black font-bold border border-amber-500/30 transition-all flex items-center gap-1"
                          >
                            <BarChart2 className="w-3 h-3" />
                            <span>Auditar en Contactabilidad</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            switchTenantContext(t.id);
                            router.push('/inbox');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] hover:text-neon border border-[var(--border-color)] hover:border-neon font-bold transition-all flex items-center gap-1"
                        >
                          <span>Tomar Control</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ===================================================================== */}
          {/* 4. BLOQUE 3: RESUMEN DE CARTERA ACTIVA (HEALTH MATRIX COMPACTA)        */}
          {/* ===================================================================== */}
          <div id="deck-negocios" className="space-y-4 scroll-mt-6">
            {/* Header, Search & Filter Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
                  <Building2 className="w-4 h-4 text-neon" />
                  <span>Resumen de Cartera Activa</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  Supervisión directa, control de Kill-Switch de IA, tarifas y administración rápida.
                </p>
              </div>

              {tenantsList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-60">
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

                  {/* Status Filters */}
                  <div className="flex items-center bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)] text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className={`px-2 py-1 rounded-lg transition-all ${
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
                      className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
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
                      className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
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
                      className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        statusFilter === 'alerts'
                          ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30'
                          : 'text-[var(--text-muted)] hover:text-amber-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Alertas ({tenantsList.filter((t) => t.frictionAlert || t.crisisMode).length})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Category Pills Bar */}
            {tenantsList.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono">
                {CATEGORY_PILLS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all border flex items-center gap-1.5 ${
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
            )}

            {/* Zero-State A: No hay negocios en la cartera */}
            {tenantsList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3 font-sans">
                <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 text-neon flex items-center justify-center mx-auto text-xl font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[var(--text-main)]">
                  Bienvenido a Vector Community OS
                </h4>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                  Aún no tienes negocios registrados en tu cartera. Da de alta tu primer negocio para comenzar la supervisión y captación inteligente.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/config?tab=rag&mode=wizard')}
                    className="px-4 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs uppercase inline-flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Dar de Alta Primer Negocio</span>
                  </button>
                </div>
              </div>
            ) : filteredTenants.length === 0 ? (
              /* Zero-State B: Hay negocios pero ninguno coincide con los filtros aplicados */
              <div className="p-8 text-center rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 font-mono">
                <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                <p className="text-xs text-[var(--text-main)] font-bold">
                  No se encontraron negocios con esos filtros.
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Intenta cambiar el término de búsqueda o selecciona otra categoría.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="text-xs text-neon underline pt-1 font-bold inline-block"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              /* Tarjetas de Negocios Densas y Compactas (~180-210px) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredTenants.map((t) => {
                  const isSelected = activeTenantKey === t.id;
                  const monthlyBilling = (t.billedLeadsMonth || 0) * (t.leadPriceMXN || 350);

                  return (
                    <div
                      key={t.id}
                      className={`rounded-2xl p-4 border transition-all duration-200 relative flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[var(--bg-panel)] border-neon shadow-[0_0_20px_rgba(231,249,0,0.12)] ring-1 ring-neon/50'
                          : t.isAiActive
                          ? 'bg-[var(--bg-panel)] border-[var(--border-color)] hover:border-neon/40 hover:shadow-sm'
                          : 'bg-red-950/10 border-red-500/30'
                      }`}
                    >
                      <div className="space-y-2.5">
                        {/* Fila 1: Avatar, Nombre, Giro y Kill-Switch */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-xl shrink-0 shadow-sm">
                              {t.avatar}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] font-sans truncate group-hover:text-neon transition-colors">
                                  {t.name}
                                </h4>
                                {isSelected && (
                                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-neon/15 text-neon border border-neon/30 font-bold shrink-0">
                                    ACTIVO
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-[var(--text-muted)] block truncate font-medium">
                                {t.giro}
                              </span>
                            </div>
                          </div>

                          {/* Kill-Switch Button */}
                          <button
                            type="button"
                            onClick={() => toggleTenantAi(t.id)}
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all shrink-0 ${
                              t.isAiActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400'
                                : 'bg-red-500 text-white border-red-400 animate-pulse'
                            }`}
                            title={t.isAiActive ? 'Clic para pausar IA' : 'Clic para reactivar IA'}
                          >
                            <Power className="w-2.5 h-2.5" />
                            <span>{t.isAiActive ? 'IA ACTIVA' : 'PAUSADO'}</span>
                          </button>
                        </div>

                        {/* Fila 2: Etiquetas de Presencia & Alertas */}
                        <div className="flex items-center gap-1.5 font-mono text-[9px] flex-wrap">
                          {t.hasWebsite ? (
                            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5" />
                              <span>Web + GA4</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
                              <Smartphone className="w-2.5 h-2.5" />
                              <span>Micro-Landing</span>
                            </span>
                          )}

                          <span className="px-1.5 py-0.5 bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] rounded font-medium">
                            MER {t.mer || '5.2x'}
                          </span>

                          {t.frictionAlert && (
                            <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded flex items-center gap-0.5 font-bold">
                              <AlertOctagon className="w-2.5 h-2.5" />
                              <span>Alerta</span>
                            </span>
                          )}
                          {t.crisisMode && (
                            <span className="px-1.5 py-0.5 bg-red-500/15 text-red-500 border border-red-500/30 rounded flex items-center gap-0.5 font-bold animate-pulse">
                              <AlertOctagon className="w-2.5 h-2.5" />
                              <span>Crisis</span>
                            </span>
                          )}
                        </div>

                        {/* Fila 3: Micro-Métricas Financieras */}
                        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-center">
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase block">Leads Mes</span>
                            <span className="text-[11px] font-bold text-[var(--text-main)] block">{t.billedLeadsMonth || 0}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase block">Tarifa Lead</span>
                            <span className="text-[11px] font-bold text-neon block">${t.leadPriceMXN || 350}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase block">Facturación</span>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block" suppressHydrationWarning>
                              ${formatNumber(monthlyBilling)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fila 4: Acciones de la Tarjeta */}
                      <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2 mt-3 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDrawerTenantId(t.id)}
                            className="px-2.5 py-1 rounded-lg bg-neon/15 hover:bg-neon hover:text-black text-neon border border-neon/40 font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Administrar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewTenant(t)}
                            className="p-1 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                            title="Ver Micro-Landing Móvil"
                          >
                            <Smartphone className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickActivateTenant(t.id)}
                          disabled={isSelected}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 ${
                            isSelected
                              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-[var(--border-color)] cursor-default'
                              : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border-[var(--border-color)] hover:border-neon'
                          }`}
                        >
                          <span>{isSelected ? 'Activo' : 'Seleccionar'}</span>
                          {!isSelected && <ChevronRight className="w-2.5 h-2.5 text-[var(--text-muted)]" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===================================================================== */}
      {/* 5. DRAWER DE GESTIÓN RÁPIDA DE NEGOCIO (PANEL LATERAL 1-CLICK)          */}
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
                        min={350}
                        step={50}
                        value={drawerTenant.leadPriceMXN || 350}
                        onChange={(e) =>
                          updateTenantPolicy(drawerTenant.id, {
                            leadPriceMXN: Math.max(350, Number(e.target.value) || 350),
                          })
                        }
                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-7 pr-3 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">MXN / lead (Mín $350)</span>
                  </div>

                  {/* Preset Fast Buttons */}
                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    <span className="text-[var(--text-muted)]">Ajuste rápido:</span>
                    {[350, 450, 600, 800].map((price) => (
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

                  {/* Presupuesto Publicitario Mensual (Meta Ads) */}
                  <div className="pt-3 border-t border-[var(--border-color)] space-y-1.5">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                      Presupuesto Mensual Meta Ads ($ MXN)
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-2 text-emerald-400 font-bold">$</span>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={drawerTenant.monthlyAdBudget || 0}
                          onChange={(e) =>
                            updateTenantPolicy(drawerTenant.id, {
                              monthlyAdBudget: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-emerald-400 rounded-xl pl-7 pr-3 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">MXN / mes</span>
                    </div>
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
