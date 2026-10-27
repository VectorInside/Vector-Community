'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { performanceService } from '@/services/performanceService';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { formatCurrency, formatNumber, cleanConcept } from '@/utils/formatters';
import { OMNICHANNEL_API_CATALOG } from '@/utils/constants';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Zap,
  Activity,
  BarChart2,
  PieChart,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Send,
  AlertTriangle,
  Globe,
  Smartphone,
  ExternalLink,
  ArrowRight,
  Flame,
  Lightbulb,
  QrCode,
  Sparkles,
  MousePointerClick,
  Users,
  Eye,
  Check,
  Copy,
  Calendar,
  Clock,
  MessageSquare,
  Instagram,
  Video,
  Linkedin,
  Play,
  Share2,
  Sliders,
  RefreshCw,
  Gauge,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';

export const PerformanceDashboard = () => {
  const { activeTenant: authTenant, activeTenantKey, tenantsData } = useAuth();
  
  // Resolve active tenant from canonical AuthContext
  const activeTenant = useMemo(() => {
    if (authTenant) return authTenant;
    if (tenantsData && activeTenantKey && tenantsData[activeTenantKey]) {
      return tenantsData[activeTenantKey];
    }
    return tenantsData ? Object.values(tenantsData)[0] : null;
  }, [authTenant, activeTenantKey, tenantsData]);

  const activeTenantId = activeTenant?.id || activeTenantKey || 'dental';

  const [data, setData] = useState(null);
  const [capiLogs, setCapiLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('web'); // 'web' | 'capi' | 'microlanding'
  const [showMicroLandingModal, setShowMicroLandingModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados interactivos para auditoría del sitio web del agente analista
  const [isAuditingWebsite, setIsAuditingWebsite] = useState(false);
  const [auditStepText, setAuditStepText] = useState('');
  const [lastAuditTimestamp, setLastAuditTimestamp] = useState('Hoy a las 08:00 AM (Batch Automático)');
  const [showDeepAuditDetails, setShowDeepAuditDetails] = useState(true);

  const handleRunWebsiteAudit = () => {
    if (isAuditingWebsite) return;
    setIsAuditingWebsite(true);
    setAuditStepText('Conectando con URL oficial y analizando Core Web Vitals (LCP, TTFB)...');

    setTimeout(() => {
      setAuditStepText('Evaluando visibilidad, contraste de botón WhatsApp (WCAG AA) y eventos DOM...');
    }, 600);

    setTimeout(() => {
      setAuditStepText('Verificando consistencia de píxeles Meta CAPI y GA4 Measurement Protocol...');
    }, 1200);

    setTimeout(() => {
      setAuditStepText('Sub-Bot Analista: Diagnóstico algorítmico completado con éxito.');
      setIsAuditingWebsite(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastAuditTimestamp(`Hoy a las ${timeStr} (Auditoría Manual con Agente IA)`);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#E7F900', '#06B6D4', '#10B981'],
        });
      } catch (e) {}
    }, 1800);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const perf = await performanceService.getPerformanceMetrics(activeTenantId);
      const logs = await performanceService.getCapiAttributionLogs(activeTenantId);
      setData(perf);
      setCapiLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTenantId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyPublicLink = () => {
    const slug = activeTenant?.microLandingSlug || activeTenant?.id || 'demo';
    const url = `https://app.vectorinside.com/m/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#D4FF00', '#25D366'],
      });
    } catch (e) {}
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const CHANNEL_ICONS = {
    Instagram: Instagram,
    Globe: Globe,
    MessageSquare: MessageSquare,
    Video: Video,
    Linkedin: Linkedin,
    Play: Play,
    Share2: Share2,
    Send: Send,
  };

  // Solo mostrar los canales que el negocio tenga dados de alta y activos
  const activeChannelsList = useMemo(() => {
    const tenantConnected = activeTenant?.connectedChannels || {};
    const enabledKeys = Object.keys(tenantConnected).filter((k) => tenantConnected[k]?.enabled);
    if (enabledKeys.length > 0) {
      return enabledKeys
        .map((k) => {
          const cat = OMNICHANNEL_API_CATALOG[k];
          if (!cat) return null;
          return {
            ...cat,
            tenantConfig: tenantConnected[k],
          };
        })
        .filter(Boolean);
    }
    // Fallback inteligente según redes del tenant o default de giro
    const fallbackKeys = ['meta', 'whatsapp', ...(activeTenant?.hasWebsite ? ['google'] : [])];
    return fallbackKeys
      .map((k) => {
        const cat = OMNICHANNEL_API_CATALOG[k];
        if (!cat) return null;
        return {
          ...cat,
          tenantConfig: { enabled: true, status: 'connected', latencyMs: 110, lastSync: 'En tiempo real' },
        };
      })
      .filter(Boolean);
  }, [activeTenant]);

  const summary = data?.summary || {
    realRoas: 4.82,
    metaReportedRoas: 3.41,
    realCac: 14.2,
    blendedCpa: 16.8,
    totalSpend: 3450,
    backendAttributedRevenue: 16629,
    capiSyncRate: 99.4,
    avgHookRate: 41.8,
  };

  const series = data?.dailySeries || [];

  const webMetrics = activeTenant?.webTrafficMetrics || {
    sessions: 3420,
    cpc: '$3.80 MXN',
    whatsappClickRate: '1.4%',
    bounceRate: '65%',
  };

  const mlMetrics = activeTenant?.microLandingMetrics || {
    visits: 1280,
    leadsGenerated: 233,
    conversionRate: '18.2%',
    costPerLead: '$1.85 MXN',
    bounceRate: '8.4%',
    avgLoadTime: '0.65s',
    ctaClicks: 312,
    qrScans: 46,
    sources: {
      bioLink: '54.2%',
      directAds: '38.6%',
      qrPrint: '7.2%',
    },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Contextual Homologado con el Tenant Activo */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold bg-neon/10 px-2 py-0.5 rounded border border-neon/20">
              OPERACIÓN / CONTACTABILIDAD & TIEMPOS
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
              <span>{activeTenant?.avatar}</span>
              <span>{activeTenant?.shortName || activeTenant?.name}</span>
              <span>•</span>
              <span>{activeTenant?.giro}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Contactabilidad & Tiempos de <span className="text-neon">Respuesta</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 max-w-2xl">
            Telemetría de tráfico, embudo de captación comercial y velocidad de atención en &lt; 15 min para{' '}
            <strong className="text-[var(--text-main)] font-semibold">{activeTenant?.name || 'Negocio Activo'}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--text-muted)]">Meta CAPI:</span>
            <span className="font-bold text-emerald-500">
              {activeTenant?.capiStatus || 'Conectado • 99.4% Entrega'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMicroLandingModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] text-[var(--text-main)] text-xs font-mono font-bold border border-[var(--border-color)] flex items-center gap-2 transition-all hover:border-neon shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-neon" />
            <span>Ver Micro-Landing</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--border-color)] font-sans">
        <button
          type="button"
          onClick={() => setActiveTab('web')}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
            activeTab === 'web'
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_rgba(231,249,0,0.3)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{activeTenant?.hasWebsite ? 'Salud de Canales & Tráfico Web' : 'Salud de Canales & Direct-to-Chat'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('capi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
            activeTab === 'capi'
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_rgba(231,249,0,0.3)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Atribución Publicitaria (ROAS Real)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('microlanding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
            activeTab === 'microlanding'
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_rgba(231,249,0,0.3)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Micro-Landing & Captación</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: TELEMETRÍA DE CANALES & CONVERSIÓN                             */}
      {/* ========================================================================= */}
      {activeTab === 'web' && (
        <div className="space-y-6 animate-fade-in">
          {/* Identity & Tracking Card */}
          <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {activeTenant?.hasWebsite ? <Globe className="w-5 h-5" /> : <Smartphone className="w-5 h-5 text-neon" />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-main)] font-bold text-sm">
                    {activeTenant?.hasWebsite ? 'Sitio Web Oficial Sincronizado' : 'Ecosistema Direct-to-Messaging & Micro-Landing'}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    activeTenant?.hasWebsite
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                  }`}>
                    {activeTenant?.hasWebsite ? 'Google Analytics 4' : 'Atención Directa por WhatsApp'}
                  </span>
                </div>
                <p className="text-[var(--text-muted)] text-xs mt-0.5 font-sans">
                  URL:{' '}
                  {activeTenant?.hasWebsite ? (
                    <a
                      href={activeTenant.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon underline"
                    >
                      {activeTenant.websiteUrl}
                    </a>
                  ) : (
                    <span className="text-neon font-mono">
                      app.vectorinside.com/m/{activeTenant?.microLandingSlug || activeTenant?.id}
                    </span>
                  )}{' '}
                  • ID de Medición:{' '}
                  <code className="text-[var(--text-main)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                    {activeTenant?.ga4MeasurementId || 'Meta CAPI for Messaging'}
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--text-muted)]">Pixel / CAPI:</span>
              <code className="text-[var(--text-main)] bg-[var(--bg-card)] px-2 py-1 rounded border border-[var(--border-color)] text-[11px]">
                {activeTenant?.metaPixelId || 'Handshake Servidor Activo'}
              </code>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECCIÓN OMNICANAL: SALUD DE CANALES ACTIVOS & FATIGA PUBLICITARIA         */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border-color)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-neon/15 text-neon border border-neon/30">
                    <Activity className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-heading font-black text-[var(--text-main)]">
                    Salud de Canales Oficiales & Atribución
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-neon/10 text-neon font-mono text-[10px] font-bold border border-neon/20">
                    {activeChannelsList.length} Canales Activos
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Telemetría de adquisición exclusiva para los medios dados de alta por <strong className="text-[var(--text-main)]">{activeTenant?.shortName || activeTenant?.name}</strong>. Cero saturación de canales no configurados.
                </p>
              </div>

              <Link
                href="/config?tab=channels"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] hover:text-neon border border-[var(--border-color)] hover:border-neon text-xs font-mono font-bold transition-all shrink-0 self-start sm:self-auto shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-neon" />
                <span>Configurar Canales & APIs</span>
              </Link>
            </div>

            {/* Grid de Canales Filtrados Estrictamente */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {activeChannelsList.map((ch) => {
                const IconComp = CHANNEL_ICONS[ch.iconName] || Globe;
                const metrics = ch.defaultMetrics || {};
                const isFatigueAlert = (metrics.adFatigueScore || 1.5) > 3.5;
                const isRetentionWarning = parseInt(metrics.retentionScore || '80%') < 65;

                return (
                  <div
                    key={ch.id}
                    className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon/40 transition-all flex flex-col justify-between space-y-3 shadow-sm group"
                  >
                    <div className="space-y-2.5">
                      {/* Top Header del Canal */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`p-2 rounded-xl bg-gradient-to-br ${ch.color} text-white shadow-sm shrink-0`}>
                            <IconComp className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="font-bold text-xs text-[var(--text-main)] leading-tight">
                              {ch.name}
                            </h4>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">
                              {ch.category}
                            </span>
                          </div>
                        </div>

                        {/* Status API Badge */}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-mono font-bold shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{ch.tenantConfig?.latencyMs || metrics.latencyMs || 120}ms</span>
                        </div>
                      </div>

                      {/* Métricas Principales del Canal */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[var(--border-color)] font-mono text-center">
                        <div className="p-1.5 rounded-lg bg-[var(--bg-panel)]">
                          <span className="text-[9px] text-[var(--text-muted)] block">Interacciones</span>
                          <span className="text-xs font-bold text-[var(--text-main)]">
                            {formatNumber(metrics.clicks || 1200)}
                          </span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-panel)]">
                          <span className="text-[9px] text-[var(--text-muted)] block">CPC</span>
                          <span className="text-xs font-bold text-emerald-500">
                            {metrics.cpc || '$3.50 MXN'}
                          </span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-panel)]">
                          <span className="text-[9px] text-[var(--text-muted)] block">Fuga/Rebote</span>
                          <span className={`text-xs font-bold ${parseFloat(metrics.bounceRate || '2.0%') <= 3.0 ? 'text-emerald-400' : 'text-amber-500'}`}>
                            {metrics.bounceRate || '1.8%'}
                          </span>
                        </div>
                      </div>

                      {/* Detector de Desgaste y Fatiga Publicitaria */}
                      <div className="space-y-1.5 font-sans text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[var(--text-muted)] flex items-center gap-1 font-mono text-[10px]">
                            <Flame className="w-3 h-3 text-neon" />
                            Frecuencia de Anuncio:
                          </span>
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            isFatigueAlert
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {metrics.adFatigueScore || 1.8}x {isFatigueAlert ? '(Saturado)' : '(Saludable)'}
                          </span>
                        </div>

                        {isFatigueAlert ? (
                          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-300 leading-snug flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Alerta de Fatiga:</strong> Frecuencia superior al umbral de 3.5x. Se sugiere rotar creatividades y refrescar ganchos publicitarios.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                            <span>Retención de Audiencia:</span>
                            <span className="text-neon font-bold">{metrics.retentionScore || '82%'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--border-color)]/60 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                      <span>Sincronización API:</span>
                      <span className="text-[var(--text-main)] font-semibold">{ch.tenantConfig?.lastSync || 'En tiempo real'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Banner de Delimitación: Sitio Web Corporativo (GA4) vs Micro-Landing Vector */}
          {activeTenant?.hasWebsite && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono animate-fade-in shadow-sm">
              <div className="flex items-center gap-2.5 text-[var(--text-main)]">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong>Fuente de Telemetría:</strong> Métricas registradas en tu <strong>Sitio Web Oficial ({activeTenant.websiteUrl})</strong> vía Google Analytics 4.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('microlanding')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] text-neon font-bold border border-neon/30 text-[11px] transition-all shrink-0 hover:scale-[1.02]"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Ver Telemetría Exclusiva de tu Micro-Landing ({mlMetrics.conversionRate} Conv.) →</span>
              </button>
            </div>
          )}

          {/* KPI Cards adaptadas según sitio web o flujo directo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={activeTenant?.hasWebsite ? 'Sesiones Web Totales' : 'Clics a WhatsApp (Pauta)'}
              value={
                activeTenant?.hasWebsite
                  ? (webMetrics.sessions ? String(webMetrics.sessions).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '3,420')
                  : '2,450'
              }
              subvalue={activeTenant?.hasWebsite ? 'Tráfico calificado de pago' : 'Conversaciones iniciadas'}
              change="+18.4%"
              isPositive={true}
              icon={Users}
              badgeText={activeTenant?.hasWebsite ? 'ANALÍTICA WEB' : 'DIRECT ADS'}
              accentColor="blue"
            />

            <StatCard
              title={activeTenant?.hasWebsite ? 'Costo por Clic (CPC Web)' : 'Costo por Conversación'}
              value={webMetrics.cpc || (activeTenant?.hasWebsite ? '$3.80 MXN' : '$2.10 MXN')}
              subvalue="Costo unitario por prospecto"
              change="-8.2%"
              isPositive={true}
              icon={DollarSign}
              badgeText="ÓPTIMO"
              accentColor="emerald"
            />

            <StatCard
              title="Conversión a Cita / Venta"
              value={webMetrics.whatsappClickRate || (activeTenant?.hasWebsite ? '1.4%' : '18.4%')}
              subvalue={
                activeTenant?.frictionAlert
                  ? '⚠️ Crítico (< 3.0% Umbral)'
                  : activeTenant?.hasWebsite
                  ? 'Saludable (> 3.0%)'
                  : 'Alta Conversión en Chat'
              }
              change={activeTenant?.frictionAlert ? '-32.1%' : '+14.5%'}
              isPositive={!activeTenant?.frictionAlert}
              icon={MousePointerClick}
              badgeText={activeTenant?.frictionAlert ? 'FRICCIÓN' : 'CONVIRTIENDO'}
              accentColor={activeTenant?.frictionAlert ? 'rose' : 'brand'}
            />

            <StatCard
              title="Tasa de Fuga / Rebote"
              value={activeTenant?.hasWebsite ? (webMetrics.bounceRate || '65%') : '0.0%'}
              subvalue={activeTenant?.hasWebsite ? 'Salidas en primer fold' : 'Cero rebote (Directo a chat)'}
              change={activeTenant?.hasWebsite ? '+4.2%' : '-100%'}
              isPositive={!activeTenant?.hasWebsite}
              icon={TrendingUp}
              badgeText={activeTenant?.hasWebsite ? 'DIAGNÓSTICO' : 'GARANTIZADO'}
              accentColor={activeTenant?.hasWebsite ? 'amber' : 'emerald'}
            />
          </div>

          {/* ========================================================================= */}
          {/* TARJETA DE AUDITORÍA WEB & DIAGNÓSTICO DEL SUB-BOT ANALISTA              */}
          {/* ========================================================================= */}
          {activeTenant?.hasWebsite ? (
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all space-y-5 animate-fade-in font-sans shadow-sm ${
              activeTenant?.frictionAlert
                ? 'bg-amber-500/10 border-amber-500/40'
                : 'bg-emerald-500/10 border-emerald-500/40'
            }`}>
              {/* Header de la Tarjeta del Agente Auditor */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                <div className="flex items-start sm:items-center gap-3">
                  <span className={`p-3 rounded-2xl border shrink-0 ${
                    activeTenant?.frictionAlert
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40'
                  }`}>
                    {activeTenant?.frictionAlert ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6" />
                    )}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-heading font-black text-[var(--text-main)] uppercase tracking-wider">
                        {activeTenant?.frictionAlert
                          ? 'Diagnóstico Web: Puntos de Fricción Detectados'
                          : 'Auditoría Web: Sitio Saludable y Conectado'}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        activeTenant?.frictionAlert
                          ? 'bg-red-500/20 text-red-500 border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                      }`}>
                        {activeTenant?.frictionAlert ? 'FRICCIÓN ACTIVA (< 3.0%)' : 'CONVERSIÓN ÓPTIMA (> 3.0%)'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] font-mono mt-1">
                      <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Sub-Bot Analista de Performance & Web Friction (DeepSeek V3)
                      </span>
                      <span>•</span>
                      <span>{lastAuditTimestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones de Auditoría Interactiva */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isAuditingWebsite}
                    onClick={handleRunWebsiteAudit}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs shadow-[0_0_15px_var(--neon-glow)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditingWebsite ? 'animate-spin' : ''}`} />
                    <span>{isAuditingWebsite ? 'Auditando Web...' : 'Re-Auditar con IA'}</span>
                  </button>

                  {activeTenant?.websiteUrl && (
                    <a
                      href={activeTenant.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-xs font-mono text-[var(--text-main)] border border-[var(--border-color)] hover:border-cyan-400 transition-colors shadow-sm"
                    >
                      <span>Abrir Web</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowDeepAuditDetails(!showDeepAuditDetails)}
                    className="px-3 py-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
                  >
                    {showDeepAuditDetails ? 'Ocultar Puntos' : 'Ver Puntos de Mejora'}
                  </button>
                </div>
              </div>

              {/* Banner de Ejecución del Agente en Tiempo Real */}
              {isAuditingWebsite && (
                <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center gap-3 animate-pulse text-xs font-mono text-cyan-600 dark:text-cyan-300">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">Agente Auditor en Ejecución:</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{auditStepText}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 font-bold shrink-0">
                    Telemetría Activa
                  </span>
                </div>
              )}

              {/* Diagnóstico Resumido del Lobo Vectorial */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-[var(--text-main)] block font-mono text-xs">
                      Diagnóstico del Asesor:
                    </span>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      {activeTenant?.frictionDiagnosis ||
                        'El tráfico de pago llega al sitio con buen costo unitario, pero la conversión hacia WhatsApp se encuentra por debajo del umbral mínimo del 3.0%.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start md:self-auto font-mono text-xs">
                  <span className="text-[var(--text-muted)]">Conversión a Chat:</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold border ${
                    activeTenant?.frictionAlert
                      ? 'bg-red-500/20 text-red-500 border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                  }`}>
                    {webMetrics.whatsappClickRate} (Meta: &gt; 3.0%)
                  </span>
                </div>
              </div>

              {/* =================================================================== */}
              {/* DESGLOSE DE LOS 4 PILARES DE SALUD WEB AUDITADOS POR EL AGENTE      */}
              {/* =================================================================== */}
              {showDeepAuditDetails && (
                <div className="space-y-4 pt-1 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Pilar 1: Velocidad Móvil */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-amber-500" />
                          Velocidad Móvil (LCP)
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold border border-amber-500/20">
                          2.9s (Lento)
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-snug">
                        El tiempo de carga en 4G excede los 2.2s recomendados por imágenes pesadas en el banner.
                      </p>
                    </div>

                    {/* Pilar 2: Visibilidad Botón WhatsApp */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
                          <MousePointerClick className="w-3.5 h-3.5 text-red-500" />
                          Botón de WhatsApp
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/15 text-red-500 font-bold border border-red-500/20">
                          Contraste 2.9:1
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-snug">
                        Botón al fondo de página sin fijación flotante en móvil. Fuga a más del 98% de visitantes.
                      </p>
                    </div>

                    {/* Pilar 3: Tasa de Contacto a WhatsApp */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                          Click-to-Chat
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-500 font-bold border border-cyan-500/20">
                          {webMetrics.whatsappClickRate}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-snug">
                        Umbral mínimo de rentabilidad es 3.0%. Cada punto porcentual perdido incrementa el CAC.
                      </p>
                    </div>

                    {/* Pilar 4: Telemetría Meta CAPI & GA4 */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          Meta CAPI & GA4
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/20">
                          99.4% Emparejado
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-snug">
                        Eventos de compra y citas sincronizados Server-to-Server sin depender de cookies.
                      </p>
                    </div>
                  </div>

                  {/* Checklist de Puntos de Mejora Sugeridos por el Agente */}
                  <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2.5">
                    <span className="text-[10px] font-mono text-neon uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Puntos de Mejora Prioritarios Sugeridos por el Sub-Bot Analista
                    </span>

                    <ul className="space-y-2 text-xs font-sans text-[var(--text-main)]">
                      <li className="flex items-start gap-2">
                        <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5 shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>
                          <strong>1. Instalar Botón Flotante Fijo:</strong> Añadir botón verde vibrante (#25D366) fijado en la esquina inferior derecha con texto <em>"Chatear con especialista"</em> y enlace directo <code className="text-xs font-mono text-neon">https://wa.me/...</code>.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5 shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>
                          <strong>2. Comprimir Recursos del Hero:</strong> Convertir imágenes a formato WebP y comprimir por debajo de 150 KB para reducir el tiempo de primer contenido pintado a menos de 2.0s en redes móviles.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5 shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>
                          <strong>3. Alternativa Inmediata Sin Fricción:</strong> En campañas de prospección en Meta Ads, dirigir el tráfico hacia la <strong>Micro-Landing de Vector</strong> o Click-to-WhatsApp directo para eliminar la fuga del 98.6%.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fade-in font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Flujo Direct-to-Messaging Activo: Cero Pérdida por Carga Web</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold border border-emerald-500/30">
                  GARANTIZADO 100% DIRECTO
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                El ecosistema de <strong>{activeTenant?.name}</strong> canaliza todo el tráfico publicitario directamente al chat de WhatsApp y a la Micro-Landing autogenerada de Vector. Al no depender de una página web externa pesada, no existe fuga de prospectos por tiempo de carga y la tasa de contacto se mantiene al máximo.
              </p>
            </div>
          )}

          {/* Step-by-Step Funnel Dropoff Chart */}
          <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  {activeTenant?.hasWebsite ? 'Embudo de Conversión Web Paso a Paso' : 'Embudo Direct-to-Messaging en WhatsApp'}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {activeTenant?.hasWebsite
                    ? 'Identificación exacta del punto de fuga de visitantes antes de iniciar el chat con el bot'
                    : 'Rastreo de atribución paso a paso desde el anuncio hasta la reserva confirmada'}
                </p>
              </div>
              <Badge variant="neon" size="xs">
                {activeTenant?.hasWebsite ? 'Medición Web' : 'Direct Meta CAPI'}
              </Badge>
            </div>

            {activeTenant?.hasWebsite ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[var(--text-muted)]">1. Clics en Anuncios de Meta Ads</span>
                    <span className="text-[var(--text-main)] font-bold">4,800 clics (100%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[var(--text-muted)]">2. Carga Completa del Sitio Web (Visitas)</span>
                    <span className="text-[var(--text-main)] font-bold">3,420 sesiones (71.2%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '71.2%' }} />
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[var(--text-muted)]">3. Lectura de Propuesta Comercial (Scroll &gt; 50%)</span>
                    <span className="text-[var(--text-main)] font-bold">2,188 usuarios (45.5%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '45.5%' }} />
                  </div>
                </div>

                {/* Step 4 (Dropoff) */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-amber-500 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      4. Clic en Botón de WhatsApp (Punto de Fuga Principal)
                    </span>
                    <span className="text-amber-500 font-bold">48 clics (1.4% ⚠️ Fuga del 98.6%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: '10%' }} />
                  </div>
                </div>

                {/* Step 5 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-emerald-500 font-bold">5. Conversaciones Iniciadas y Atendidas por IA</span>
                    <span className="text-emerald-500 font-bold">44 leads (91.6% de los que dieron clic)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '9%' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {/* Direct Step 1 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[var(--text-muted)]">1. Clics en Anuncios Click-to-WhatsApp (Meta Ads)</span>
                    <span className="text-[var(--text-main)] font-bold">2,450 clics (100%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Direct Step 2 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[var(--text-muted)]">2. Conversaciones Abiertas en WhatsApp</span>
                    <span className="text-[var(--text-main)] font-bold">2,406 chats iniciados (98.2% de efectividad)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.2%' }} />
                  </div>
                </div>

                {/* Direct Step 3 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[var(--text-muted)]">3. Interacción con el Asistente IA Vector</span>
                    <span className="text-[var(--text-main)] font-bold">2,165 usuarios atendidos (88.4%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-neon rounded-full" style={{ width: '88.4%' }} />
                  </div>
                </div>

                {/* Direct Step 4 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-neon font-bold">4. Consulta de Menú / Disponibilidad</span>
                    <span className="text-neon font-bold">1,480 prospectos con alta intención (60.4%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-neon/80 rounded-full" style={{ width: '60.4%' }} />
                  </div>
                </div>

                {/* Direct Step 5 */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-emerald-500 font-bold">5. Citas / Reservas Atribuidas en CAPI</span>
                    <span className="text-emerald-500 font-bold">452 conversiones cerradas (18.4% de tasa neta)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Traffic Sources & Device Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3 font-mono text-xs shadow-sm">
              <span className="text-[var(--text-main)] font-bold text-sm block font-sans">
                Fuentes de Adquisición de Tráfico
              </span>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-main)]">Meta Ads (Instagram / FB)</span>
                  <span className="text-neon font-bold">72.4% (2,476 visitas)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-main)]">Google Búsqueda Orgánica</span>
                  <span className="text-blue-400 font-bold">15.8% (540 visitas)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-main)]">Tráfico Directo / WhatsApp</span>
                  <span className="text-emerald-500 font-bold">11.8% (404 visitas)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3 font-mono text-xs shadow-sm">
              <span className="text-[var(--text-main)] font-bold text-sm block font-sans">
                Distribución por Tipo de Dispositivo
              </span>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-main)]">
                    <Smartphone className="w-3.5 h-3.5 text-neon" />
                    <span>Dispositivos Móviles (Smartphones)</span>
                  </span>
                  <span className="text-emerald-500 font-bold">89.2% (Mayoritaria)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Computadoras de Escritorio (Desktop)</span>
                  </span>
                  <span className="text-[var(--text-muted)] font-bold">10.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: ATRIBUCIÓN BACKEND & META CAPI                                  */}
      {/* ========================================================================= */}
      {activeTab === 'capi' && (
        <div className="space-y-6 animate-fadeIn">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="ROAS Real Atribuido"
              value={`${summary.realRoas}x`}
              subvalue={`(Meta: ${summary.metaReportedRoas}x)`}
              change="+41.3%"
              isPositive={true}
              icon={TrendingUp}
              badgeText="BACKEND REAL"
              accentColor="brand"
            />

            <StatCard
              title="CAC Real (Cost per Acquisition)"
              value={`$${summary.realCac} USD`}
              subvalue={`(CPA: $${summary.blendedCpa})`}
              change="-15.4%"
              isPositive={true}
              icon={DollarSign}
              badgeText="OPT. METRIC"
              accentColor="emerald"
            />

            <StatCard
              title="Ingresos Reales Atribuidos"
              value={`$${formatNumber(summary.backendAttributedRevenue)} USD`}
              subvalue={`Gasto: $${formatNumber(summary.totalSpend)}`}
              change="+28.0%"
              isPositive={true}
              icon={Activity}
              badgeText="VERIFICADO"
              accentColor="blue"
            />

            <StatCard
              title="Sincronización con Meta Ads"
              value={`${summary.capiSyncRate}%`}
              subvalue="Calidad de Registro: 9.8/10"
              change="+1.2%"
              isPositive={true}
              icon={ShieldCheck}
              badgeText="EN TIEMPO REAL"
              accentColor="amber"
            />
          </div>

          {/* Main Chart: Real Revenue vs Spend & Hook Rate */}
          <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  Curva de Atribución y Hook Rate
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Ingresos atribuidos por el sistema de Vector Inside vs Gasto Diario en Meta Ads ({activeTenant?.name})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="neon" size="sm">ROAS Promedio: {summary.realRoas}x</Badge>
                <Badge variant="warning" size="sm">Hook Rate: {summary.avgHookRate}%</Badge>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C3F400" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C3F400" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-panel)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Ingreso Atribuido ($ USD)"
                    stroke="#C3F400"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    name="Gasto Publicitario ($ USD)"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSpend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live CAPI Stream Logs Table */}
          <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase font-mono tracking-wider">
                  Registro de Conversiones en Tiempo Real
                </h3>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                Conexión en Vivo con Meta Ads ({activeTenant?.shortName || activeTenant?.name})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-[10px]">
                    <th className="py-2.5 px-3">Evento Comercial</th>
                    <th className="py-2.5 px-3">Fecha y Hora</th>
                    <th className="py-2.5 px-3">Valor Atribuido</th>
                    <th className="py-2.5 px-3">Estado de Validación</th>
                    <th className="py-2.5 px-3">Canal de Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-main)]">
                  {capiLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[var(--bg-card)] transition-colors">
                      <td className="py-3 px-3 font-semibold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {cleanConcept(log.event)}
                      </td>
                      <td className="py-3 px-3 text-[var(--text-muted)]">{log.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-neon">{log.value}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          {cleanConcept(log.status)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--text-muted)]">{log.signalSource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: MICRO-LANDING & ENLACE EN BIO                                   */}
      {/* ========================================================================= */}
      {activeTab === 'microlanding' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header de Identidad de Micro-Landing */}
          <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-neon/10 text-neon border border-neon/30">
                <Smartphone className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
                    <span>{activeTenant?.avatar}</span>
                    <span>Micro-Landing Page de {activeTenant?.name}</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    CAPI ACTIVO • 99.4%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  Embudo ultraligero de alta conversión alojado en:{' '}
                  <code className="text-neon underline">app.vectorinside.com/m/{activeTenant?.microLandingSlug || activeTenant?.id}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyPublicLink}
                className="px-4 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] text-xs font-mono font-bold border border-[var(--border-color)] flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copiedLink ? <Check className="w-4 h-4 text-neon" /> : <ExternalLink className="w-4 h-4" />}
                <span>{copiedLink ? '¡Copiado!' : 'Copiar URL Pública'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMicroLandingModal(true)}
                className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs font-mono shadow-[0_0_15px_rgba(231,249,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Previsualización Móvil</span>
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* KPI STAT CARDS EXCLUSIVAS DE LA MICRO-LANDING                       */}
          {/* =================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Visitas a Micro-Landing"
              value={formatNumber(mlMetrics.visits || 1280)}
              subvalue="Tráfico de alta intención"
              change="+24.2%"
              isPositive={true}
              icon={Users}
              badgeText="EMBUDO VECTOR"
              accentColor="brand"
            />

            <StatCard
              title="Conversión a WhatsApp (Chat)"
              value={mlMetrics.conversionRate || '18.2%'}
              subvalue={`${mlMetrics.leadsGenerated || 233} chats iniciados`}
              change="+13x vs Web"
              isPositive={true}
              icon={MousePointerClick}
              badgeText="ALTA CONVERSIÓN"
              accentColor="emerald"
            />

            <StatCard
              title="Costo por Lead (Micro-Landing)"
              value={mlMetrics.costPerLead || '$1.85 MXN'}
              subvalue="Costo unitario por conversación"
              change="-51.3%"
              isPositive={true}
              icon={DollarSign}
              badgeText="ÓPTIMO"
              accentColor="emerald"
            />

            <StatCard
              title="Velocidad Móvil & Retención"
              value={mlMetrics.avgLoadTime || '0.65s'}
              subvalue={`Rebote de solo ${mlMetrics.bounceRate || '8.4%'}`}
              change="-87% vs Web"
              isPositive={true}
              icon={TrendingUp}
              badgeText="0% FRICCIÓN"
              accentColor="blue"
            />
          </div>

          {/* =================================================================== */}
          {/* MATRIZ COMPARATIVA DUAL: WEB TRADICIONAL VS MICRO-LANDING VECTOR     */}
          {/* =================================================================== */}
          <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-neon/15 text-neon border border-neon/30">
                    <Layers className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-heading font-black text-[var(--text-main)]">
                    Telemetría Dual: Sitio Web Corporativo (GA4) vs. Micro-Landing Vector
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  <strong>Aclaración de Atribución:</strong> El sistema no fusiona los CPC. Se mantiene una separación rigurosa entre el tráfico institucional de tu web externa y los prospectos comerciales de tu Micro-Landing.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold shrink-0 self-start sm:self-auto">
                Segmentación de Tráfico Activa
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-[10px]">
                    <th className="py-2.5 px-3">Parámetro Evaluado</th>
                    <th className="py-2.5 px-3">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        Sitio Web Tradicional (GA4)
                      </span>
                    </th>
                    <th className="py-2.5 px-3">
                      <span className="flex items-center gap-1.5 text-neon font-bold">
                        <Smartphone className="w-3.5 h-3.5 text-neon" />
                        Micro-Landing Vector (/m/{activeTenant?.microLandingSlug || activeTenant?.id})
                      </span>
                    </th>
                    <th className="py-2.5 px-3 text-right">Ventaja Comercial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-main)]">
                  <tr className="hover:bg-[var(--bg-card)] transition-colors">
                    <td className="py-3 px-3 font-semibold font-sans">Velocidad de Carga Celular (LCP)</td>
                    <td className="py-3 px-3 text-amber-500 font-bold">2.9 segundos (Lento)</td>
                    <td className="py-3 px-3 text-neon font-bold">{mlMetrics.avgLoadTime || '0.65s'} (Instantáneo)</td>
                    <td className="py-3 px-3 text-right text-emerald-500 font-bold">+346% más veloz</td>
                  </tr>

                  <tr className="hover:bg-[var(--bg-card)] transition-colors">
                    <td className="py-3 px-3 font-semibold font-sans">Tasa de Contacto a WhatsApp</td>
                    <td className="py-3 px-3 text-red-500 font-bold">
                      {webMetrics.whatsappClickRate || '1.4%'} (⚠️ Fricción)
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      {mlMetrics.conversionRate || '18.2%'} (🚀 Directo a chat)
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-500 font-bold">13x más citas/leads</td>
                  </tr>

                  <tr className="hover:bg-[var(--bg-card)] transition-colors">
                    <td className="py-3 px-3 font-semibold font-sans">Costo Unitario de Adquisición</td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">
                      {webMetrics.cpc || '$3.80 MXN'} CPC
                    </td>
                    <td className="py-3 px-3 text-neon font-bold">
                      {mlMetrics.costPerLead || '$1.85 MXN'} por Lead
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-500 font-bold">-51% costo por prospecto</td>
                  </tr>

                  <tr className="hover:bg-[var(--bg-card)] transition-colors">
                    <td className="py-3 px-3 font-semibold font-sans">Tasa de Rebote / Fuga de Visitas</td>
                    <td className="py-3 px-3 text-amber-500 font-bold">
                      {webMetrics.bounceRate || '65%'} de abandono
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      {mlMetrics.bounceRate || '8.4%'} de rebote
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-500 font-bold">87% menos fuga</td>
                  </tr>

                  <tr className="hover:bg-[var(--bg-card)] transition-colors bg-[var(--bg-card)]/50">
                    <td className="py-3 px-3 font-semibold font-sans">Estrategia Recomendada</td>
                    <td className="py-3 px-3 text-[var(--text-muted)] text-[11px] font-sans">
                      Catálogo institucional & Posicionamiento SEO de marca
                    </td>
                    <td className="py-3 px-3 text-neon text-[11px] font-sans font-bold">
                      Destino prioritario de Meta Ads, TikTok y Enlace en Bio
                    </td>
                    <td className="py-3 px-3 text-right text-neon font-bold text-[11px] font-sans">
                      Máxima Rentabilidad
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* =================================================================== */}
          {/* DISTRIBUCIÓN DE FUENTES DE TRÁFICO DE LA MICRO-LANDING              */}
          {/* =================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-neon font-bold text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  Enlace en Bio (Redes)
                </span>
                <span className="text-neon font-bold">{mlMetrics.sources?.bioLink || '54.2%'}</span>
              </div>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Tráfico orgánico proveniente de Instagram Bio, TikTok y perfiles sociales.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-emerald-500 font-bold text-xs flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4" />
                  Meta Ads Pauta Directa
                </span>
                <span className="text-emerald-500 font-bold">{mlMetrics.sources?.directAds || '38.6%'}</span>
              </div>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Campañas de tráfico pagado en Meta con atribución CAPI server-to-server.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-blue-500 font-bold text-xs flex items-center gap-1.5">
                  <QrCode className="w-4 h-4" />
                  Código QR en Mostrador
                </span>
                <span className="text-blue-500 font-bold">{mlMetrics.sources?.qrPrint || '7.2%'}</span>
              </div>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Clientes físicos que escanean el QR en recepción, mesas o material impreso.
              </p>
            </div>
          </div>

          {/* Micro-Landing Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
              <span className="text-neon font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                1. Cero Pérdida de Carga Web
              </span>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Carga en menos de 0.8s en redes celulares 4G/5G, eliminando la tasa de rebote del 65% que sufren las páginas pesadas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                2. Directo a WhatsApp Cloud API
              </span>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Botón con mensaje de gancho prellenado que abre la conversación y activa el bot calificador de inmediato.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
              <span className="text-blue-500 font-bold text-xs flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                3. QR para Mostrador Físico
              </span>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Incluye código QR descargable para exhibir en recepción, mesas o folletos para captar clientes en persona.
              </p>
            </div>
          </div>

          {/* Quick Preview Embed */}
          <div className="p-8 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col items-center justify-center space-y-6 shadow-sm relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-radial from-neon/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-xl gap-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                  Simulador en Vivo: {activeTenant?.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)] font-mono">
                  /m/{activeTenant?.microLandingSlug || activeTenant?.id || 'dental'}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="gap-2 shadow-lg shadow-neon/20 hover:scale-105 transition-all text-xs"
                onClick={() => setShowMicroLandingModal(true)}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Abrir Studio Completo</span>
              </Button>
            </div>

            {/* Framed Mobile Mockup */}
            <div className="relative w-full max-w-[320px] h-[580px] rounded-[44px] bg-black border-[7px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col ring-1 ring-white/10">
              {/* Top Notch / Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-center border border-zinc-800/80 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Iframe content */}
              <iframe
                src={`/m/${activeTenant?.microLandingSlug || activeTenant?.id || 'dental'}?preview=true`}
                title="MicroLanding Quick Preview"
                className="w-full h-full border-0 pt-0 bg-black"
              />
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-center gap-3 z-10 pt-2">
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' 
                    ? `${window.location.origin}/m/${activeTenant?.microLandingSlug || activeTenant?.id || 'dental'}`
                    : `https://vector.lat/m/${activeTenant?.microLandingSlug || activeTenant?.id || 'dental'}`;
                  navigator.clipboard.writeText(url);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[var(--text-main)] transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Enlace Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>Copiar Enlace Bio</span>
                  </>
                )}
              </button>

              <a
                href={`/m/${activeTenant?.microLandingSlug || activeTenant?.id || 'dental'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neon transition-colors"
              >
                <span>Abrir Pestaña Completa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal Interactivo de Micro-Landing Preview */}
      {showMicroLandingModal && (
        <MicroLandingPreviewModal
          isOpen={showMicroLandingModal}
          onClose={() => setShowMicroLandingModal(false)}
          tenant={activeTenant}
        />
      )}
    </div>
  );
};
