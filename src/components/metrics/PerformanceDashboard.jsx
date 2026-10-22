'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { performanceService } from '@/services/performanceService';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { formatCurrency, formatNumber } from '@/utils/formatters';
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
  Calendar,
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
  const { activeTenantId, activeTenant } = useTenant();
  const [data, setData] = useState(null);
  const [capiLogs, setCapiLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSendingSignal, setIsSendingSignal] = useState(false);
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

  const handleEmitCapiTest = async () => {
    setIsSendingSignal(true);
    try {
      const newEvent = await performanceService.emitTestCapiSignal(
        activeTenantId,
        'Purchase_Attributed_Vector'
      );
      setCapiLogs((prev) => [newEvent, ...prev]);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D4FF00', '#10B981'],
        });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingSignal(false);
    }
  };

  const handleCopyPublicLink = () => {
    const url = `https://app.vectorinside.com/m/${activeTenant?.id || 'demo'}`;
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
      {/* Header Contextual Homologado */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold bg-neon/10 px-2 py-0.5 rounded border border-neon/20">
              OPERACIÓN / CONTACTABILIDAD & TIEMPOS
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Embudo Comercial & Tráfico
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Contactabilidad & Tiempos de <span className="text-neon">Respuesta</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 max-w-2xl">
            Embudo de captación comercial, velocidad de atención y tasa de respuesta en &lt; 15 min para{' '}
            <strong className="text-[var(--text-main)] font-semibold">{activeTenant?.name || 'Clínica Odontológica Integral'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowMicroLandingModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] text-[var(--text-main)] text-xs font-mono font-bold border border-[var(--border-color)] flex items-center gap-2 transition-all hover:border-neon shadow-sm min-h-[44px]"
          >
            <Smartphone className="w-4 h-4 text-neon" />
            <span>Ver Micro-Landing</span>
          </button>

          <Button
            variant="neonOutline"
            size="md"
            icon={Send}
            loading={isSendingSignal}
            onClick={handleEmitCapiTest}
            className="min-h-[44px]"
          >
            Emitir CAPI Test Event
          </Button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-dark-border font-sans">
        <button
          type="button"
          onClick={() => setActiveTab('web')}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
            activeTab === 'web'
              ? 'bg-brand-primary text-black shadow-neon-sm font-bold'
              : 'bg-dark-base text-[var(--text-muted)] hover:text-[var(--text-main)] border border-dark-border'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Salud de Canales & Tráfico Web</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('capi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
            activeTab === 'capi'
              ? 'bg-brand-primary text-black shadow-neon-sm font-bold'
              : 'bg-dark-base text-[var(--text-muted)] hover:text-[var(--text-main)] border border-dark-border'
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
              ? 'bg-brand-primary text-black shadow-neon-sm font-bold'
              : 'bg-dark-base text-[var(--text-muted)] hover:text-[var(--text-main)] border border-dark-border'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Micro-Landing & Captación</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: TELEMETRÍA WEB & GA4 (MÉTRICAS DEL SITIO WEB DEL NEGOCIO)     */}
      {/* ========================================================================= */}
      {activeTab === 'web' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Web Identity & Tracking IDs Card */}
          <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-main)] font-bold text-sm">
                    {activeTenant?.hasWebsite ? 'Sitio Web Oficial Sincronizado' : 'Ecosistema Directo a WhatsApp'}
                  </span>
                  <Badge variant={activeTenant?.hasWebsite ? 'info' : 'success'} size="xs">
                    {activeTenant?.hasWebsite ? 'Google Analytics 4' : 'Atención Directa por WhatsApp'}
                  </Badge>
                </div>
                <p className="text-[var(--text-muted)] text-xs mt-0.5 font-sans">
                  URL:{' '}
                  <a
                    href={activeTenant?.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary underline"
                  >
                    {activeTenant?.websiteUrl || `app.vectorinside.com/m/${activeTenant?.id}`}
                  </a>{' '}
                  • ID de Medición: <code className="text-white">{activeTenant?.ga4MeasurementId || 'N/A (Micro-Landing)'}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">Pixel de Meta:</span>
              <code className="text-white bg-dark-base px-2 py-1 rounded border border-dark-border text-[11px]">
                {activeTenant?.metaPixelId || 'Conectado Vía Servidor'}
              </code>
            </div>
          </div>

          {/* Web Telemetry KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Sesiones Web Totales"
              value={webMetrics.sessions ? String(webMetrics.sessions).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '3,420'}
              subvalue="Tráfico calificado de pago"
              change="+18.4%"
              isPositive={true}
              icon={Users}
              badgeText="ANALÍTICA WEB"
              accentColor="blue"
            />

            <StatCard
              title="Costo por Clic (CPC Web)"
              value={webMetrics.cpc || '$3.80 MXN'}
              subvalue="Costo unitario por visita"
              change="-8.2%"
              isPositive={true}
              icon={DollarSign}
              badgeText="OPTIMO"
              accentColor="emerald"
            />

            <StatCard
              title="Conversión a WhatsApp"
              value={webMetrics.whatsappClickRate || '1.4%'}
              subvalue={activeTenant?.frictionAlert ? '⚠️ Crítico (< 3.0% Umbral)' : 'Saludable (> 3.0%)'}
              change={activeTenant?.frictionAlert ? '-32.1%' : '+14.5%'}
              isPositive={!activeTenant?.frictionAlert}
              icon={MousePointerClick}
              badgeText={activeTenant?.frictionAlert ? 'FRICCIÓN' : 'CONVERTING'}
              accentColor={activeTenant?.frictionAlert ? 'rose' : 'brand'}
            />

            <StatCard
              title="Tasa de Rebote (Landing)"
              value={webMetrics.bounceRate || '65%'}
              subvalue="Salidas en primer fold"
              change="+4.2%"
              isPositive={false}
              icon={TrendingUp}
              badgeText="DIAGNÓSTICO"
              accentColor="amber"
            />
          </div>

          {/* ========================================================================= */}
          {/* ALERTA ALGORÍTMICA DE FRICCIÓN WEB                                       */}
          {/* ========================================================================= */}
          {activeTenant?.frictionAlert && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-dark-surface to-red-950/20 border-2 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)] space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Alerta de Conversión: Oportunidad de Mejora en Sitio Web
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                        Optimización Web
                      </span>
                    </div>
                    <p className="text-xs text-amber-200/90 mt-0.5">
                      El tráfico de pago llega al sitio con buen costo unitario, pero la conversión hacia WhatsApp se encuentra por debajo del umbral mínimo del 3.0%.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 shrink-0 self-start sm:self-auto font-bold">
                  Conversión: {webMetrics.whatsappClickRate} (Crítica)
                </span>
              </div>

              {/* Recomendaciones Técnicas Inmediatas */}
              <div className="p-3.5 rounded-xl bg-dark-bg/90 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2 text-zinc-300">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Diagnóstico Comercial:</strong> Aumentar el contraste del botón flotante de WhatsApp, asegurar que el enlace abra directamente la conversación en móvil y optimizar la velocidad de carga (menos de 2.2s).
                  </span>
                </div>
                <a
                  href={activeTenant.websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-elevated hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white border border-dark-border shrink-0 transition-colors"
                >
                  <span>Auditar Sitio Web</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Step-by-Step Funnel Dropoff Chart */}
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  Embudo de Conversión Web Paso a Paso
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Identificación exacta del punto de fuga de visitantes antes de iniciar el chat con el bot
                </p>
              </div>
              <Badge variant="neon" size="xs">Medición Web</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Step 1 */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[var(--text-muted)]">1. Clics en Anuncios de Meta Ads</span>
                  <span className="text-[var(--text-main)] font-bold">4,800 clics (100%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-dark-base overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">2. Carga Completa del Sitio Web (Visitas)</span>
                  <span className="text-white font-bold">3,420 sesiones (71.2%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-dark-base overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '71.2%' }} />
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">3. Lectura de Propuesta Comercial (Scroll &gt; 50%)</span>
                  <span className="text-white font-bold">2,188 usuarios (45.5%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-dark-base overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '45.5%' }} />
                </div>
              </div>

              {/* Step 4 (Dropoff) */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    4. Clic en Botón de WhatsApp (Punto de Fuga Principal)
                  </span>
                  <span className="text-amber-300 font-bold">48 clics (1.4% ⚠️ Fuga del 98.6%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-dark-base overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: '10%' }} />
                </div>
              </div>

              {/* Step 5 */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-emerald-400 font-bold">5. Conversaciones Iniciadas y Atendidas por IA</span>
                  <span className="text-emerald-400 font-bold">44 leads (91.6% de los que dieron clic)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-dark-base overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '9%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Sources & Device Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-3 font-mono text-xs">
              <span className="text-white font-bold text-sm block font-sans">
                Fuentes de Adquisición de Tráfico
              </span>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-xl bg-dark-base border border-dark-border">
                  <span>Meta Ads (Instagram / FB)</span>
                  <span className="text-brand-primary font-bold">72.4% (2,476 visitas)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-dark-base border border-dark-border">
                  <span>Google Búsqueda Orgánica</span>
                  <span className="text-blue-400 font-bold">15.8% (540 visitas)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-dark-base border border-dark-border">
                  <span>Tráfico Directo / WhatsApp</span>
                  <span className="text-emerald-400 font-bold">11.8% (404 visitas)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-3 font-mono text-xs">
              <span className="text-white font-bold text-sm block font-sans">
                Distribución por Tipo de Dispositivo
              </span>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-xl bg-dark-base border border-dark-border">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Dispositivos Móviles (Smartphones)</span>
                  </span>
                  <span className="text-[var(--text-main)] font-bold">89.2% (Mayoritaria)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-dark-base border border-dark-border">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[var(--text-muted)]" />
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
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-dark-border">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  Curva de Atribución y Hook Rate
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Ingresos atribuidos por el sistema de Vector Inside vs Gasto Diario en Meta Ads
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
                      <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4FF00" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F242D" />
                  <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12151A',
                      borderColor: '#1F242D',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Ingreso Atribuido ($ USD)"
                    stroke="#D4FF00"
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
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Registro de Conversiones en Tiempo Real
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Conexión en Vivo con Meta Ads
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-dark-border text-zinc-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Evento Comercial</th>
                    <th className="py-2.5 px-3">Fecha y Hora</th>
                    <th className="py-2.5 px-3">Valor Atribuido</th>
                    <th className="py-2.5 px-3">Estado de Validación</th>
                    <th className="py-2.5 px-3">Canal de Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/60 text-[var(--text-main)]">
                  {capiLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-dark-elevated/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {log.event}
                      </td>
                      <td className="py-3 px-3 text-[var(--text-muted)]">{log.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-brand-primary">{log.value}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          {log.status}
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
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                <Smartphone className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
                  Micro-Landing Page de {activeTenant?.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Diseño móvil ultraligero alojado en: app.vectorinside.com/m/{activeTenant?.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPublicLink}
                className="px-4 py-2 rounded-xl bg-dark-base hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] text-xs font-mono font-bold border border-dark-border flex items-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-brand-primary" /> : <ExternalLink className="w-4 h-4" />}
                <span>{copiedLink ? '¡Copiado!' : 'Copiar URL Pública'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMicroLandingModal(true)}
                className="px-4 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs font-mono shadow-neon-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Previsualización Móvil</span>
              </button>
            </div>
          </div>

          {/* Micro-Landing Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-2">
              <span className="text-brand-primary font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                1. Cero Pérdida de Carga Web
              </span>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Carga en menos de 0.8s en redes celulares 4G/5G, eliminando la tasa de rebote del 65% que sufren las páginas pesadas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                2. Directo a WhatsApp Cloud API
              </span>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Botón con mensaje de gancho prellenado que abre la conversación y activa el bot calificador de inmediato.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                3. QR para Mostrador Físico
              </span>
              <p className="text-[var(--text-muted)] font-sans text-xs">
                Incluye código QR descargable para exhibir en recepción, mesas o folletos para captar clientes en persona.
              </p>
            </div>
          </div>

          {/* Quick Preview Embed */}
          <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border flex flex-col items-center justify-center space-y-4">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Vista previa rápida de la micro-landing oficial:
            </span>
            <div className="w-full max-w-sm h-[500px] rounded-3xl bg-black border-2 border-zinc-800 shadow-2xl overflow-hidden">
              <iframe
                src={`/m/${activeTenant?.id || 'dental'}`}
                title="MicroLanding Quick Preview"
                className="w-full h-full border-0"
              />
            </div>
            <a
              href={`/m/${activeTenant?.id || 'dental'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-brand-primary underline flex items-center gap-1"
            >
              <span>Abrir en pestaña completa (/m/{activeTenant?.id || 'dental'})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
