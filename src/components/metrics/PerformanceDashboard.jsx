'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { performanceService } from '@/services/performanceService';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { formatCurrency, formatNumber, cleanConcept } from '@/utils/formatters';
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

          {/* Banner de Diagnóstico según estado del tenant */}
          {activeTenant?.frictionAlert ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 shadow-sm space-y-4 animate-fade-in font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider font-mono">
                        Alerta de Conversión: Fricción Detectada en Sitio Web
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-mono text-[10px] font-bold">
                        Optimización Web
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {activeTenant?.frictionDiagnosis || 'El tráfico de pago llega al sitio con buen costo unitario, pero la conversión hacia WhatsApp se encuentra por debajo del umbral mínimo del 3.0%.'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-red-500/20 text-red-500 border border-red-500/30 shrink-0 self-start sm:self-auto font-bold">
                  Conversión: {webMetrics.whatsappClickRate} (Crítica)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
                <div className="flex items-start gap-2 text-[var(--text-main)]">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Diagnóstico Comercial:</strong> Aumentar el contraste del botón flotante de WhatsApp, asegurar que el enlace abra directamente la conversación en móvil y optimizar la velocidad de carga (menos de 2.2s).
                  </span>
                </div>
                {activeTenant?.websiteUrl && (
                  <a
                    href={activeTenant.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-xs font-mono text-[var(--text-main)] border border-[var(--border-color)] shrink-0 transition-colors"
                  >
                    <span>Auditar Sitio Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-fade-in font-sans">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  {activeTenant?.hasWebsite
                    ? 'Sitio Web Saludable y Sincronizado'
                    : 'Flujo Direct-to-Messaging Activo: Cero Pérdida por Carga Web'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {activeTenant?.frictionDiagnosis ||
                  `El ecosistema de ${activeTenant?.name} está captando prospectos calificados sin fricciones. La atribución a través de Meta Conversions API (CAPI) está emparejando el 99.4% de los eventos comerciales.`}
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
          <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-neon/10 text-neon border border-neon/30">
                <Smartphone className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
                  <span>{activeTenant?.avatar}</span>
                  <span>Micro-Landing Page de {activeTenant?.name}</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Diseño móvil ultraligero alojado en: app.vectorinside.com/m/{activeTenant?.microLandingSlug || activeTenant?.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
