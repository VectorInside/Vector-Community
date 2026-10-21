'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Play,
  RotateCw,
  Radio,
  BarChart3,
  Clock,
  Instagram,
  MessageSquare,
  Linkedin,
  Bot,
  Flame,
  Check,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { VectorLobo } from '@/components/common/VectorLobo';
import { LANDING_TRANSLATIONS } from './landingTranslations';

const INITIAL_LIVE_DATA = [
  { time: '10:00:00', events: 11400, revenue: 29800, aiConfidence: 94, latency: 14 },
  { time: '10:00:05', events: 12850, revenue: 31200, aiConfidence: 96, latency: 12 },
  { time: '10:00:10', events: 13920, revenue: 34500, aiConfidence: 98, latency: 11 },
  { time: '10:00:15', events: 12300, revenue: 33100, aiConfidence: 95, latency: 13 },
  { time: '10:00:20', events: 14780, revenue: 38900, aiConfidence: 97, latency: 10 },
  { time: '10:00:25', events: 15600, revenue: 41200, aiConfidence: 99, latency: 9 },
  { time: '10:00:30', events: 14920, revenue: 39800, aiConfidence: 96, latency: 11 },
  { time: '10:00:35', events: 16450, revenue: 44200, aiConfidence: 98, latency: 8 },
];

// Deterministic number formatter for SSR hydration parity
const formatHydratedNum = (val) => {
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const HeroSection = ({ onOpenTrial, lang = 'es' }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [timeframe, setTimeframe] = useState('live');
  const [chartData, setChartData] = useState(INITIAL_LIVE_DATA);
  const [liveCounter, setLiveCounter] = useState(14892);
  const [revenueCounter, setRevenueCounter] = useState(342850);

  const t = LANDING_TRANSLATIONS[lang].hero;
  const m = LANDING_TRANSLATIONS[lang].metrics;

  const streamEvents = lang === 'es' ? [
    { id: 'ev-101', type: 'CAPI', msg: 'Match Servidor Meta CAPI Verificado ($1,420.00 MXN)', channel: 'Instagram DM', time: 'Ahora mismo', tag: 'Alto Valor' },
    { id: 'ev-102', type: 'AI', msg: 'DeepSeek R1 Intención: "Cotización VIP Citas"', channel: 'WhatsApp Cloud', time: 'hace 1s', tag: 'Lead Calificado' },
    { id: 'ev-103', type: 'STRIPE', msg: 'Suscripción SaaS Cobrada ($499.00 USD/mes)', channel: 'Web Directa', time: 'hace 2s', tag: 'ARR+' },
    { id: 'ev-104', type: 'HITL', msg: 'Escudo de Crisis Triagiado: Resuelto en 0.8s', channel: 'Comentario Meta Ad', time: 'hace 3s', tag: 'Resuelto' },
    { id: 'ev-105', type: 'RLS', msg: 'Verificación Criptográfica Postgres RLS OK', channel: 'Supabase RLS', time: 'hace 4s', tag: '100% Seguro' },
  ] : [
    { id: 'ev-101', type: 'CAPI', msg: 'Meta CAPI Purchase Match Verified ($1,420.00)', channel: 'Instagram DM', time: 'Just now', tag: 'High-Value' },
    { id: 'ev-102', type: 'AI', msg: 'DeepSeek R1 Intent: "B2B Enterprise Quote"', channel: 'WhatsApp Cloud', time: '1s ago', tag: 'Hot Lead' },
    { id: 'ev-103', type: 'STRIPE', msg: 'Stripe SaaS Subscription Billed ($499.00/mo)', channel: 'Web Direct', time: '2s ago', tag: 'ARR+' },
    { id: 'ev-104', type: 'HITL', msg: 'Crisis Shield Triaged: Escalated in 0.8s', channel: 'Facebook Ad Comment', time: '3s ago', tag: 'Resolved' },
    { id: 'ev-105', type: 'RLS', msg: 'Tenant Isolation Cryptographic Check OK', channel: 'Supabase RLS', time: '4s ago', tag: '100% Secure' },
  ];

  // Simulated live event stream
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomEvents = Math.floor(13500 + Math.random() * 3500);
      const randomRevenue = Math.floor(36000 + Math.random() * 9000);
      const randomConfidence = Math.floor(95 + Math.random() * 5);
      const randomLatency = Math.floor(8 + Math.random() * 6);

      setLiveCounter((prev) => prev + Math.floor(Math.random() * 12));
      setRevenueCounter((prev) => prev + Math.floor(Math.random() * 85));

      setChartData((prev) => {
        const next = [...prev.slice(1), {
          time: timeStr,
          events: randomEvents,
          revenue: randomRevenue,
          aiConfidence: randomConfidence,
          latency: randomLatency,
        }];
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const metricConfigs = {
    revenue: {
      label: m.mrr.label,
      dataKey: 'revenue',
      color: '#E7F900',
      gradientId: 'heroRevenueGrad',
      format: (val) => `$${formatHydratedNum(val)}`,
      badge: m.mrr.badge,
    },
    events: {
      label: m.throughput.label,
      dataKey: 'events',
      color: '#8A95B6',
      gradientId: 'heroEventsGrad',
      format: (val) => `${formatHydratedNum(val)} ev/s`,
      badge: m.throughput.badge,
    },
    aiConfidence: {
      label: m.aiAccuracy.label,
      dataKey: 'aiConfidence',
      color: '#FFFFFF',
      gradientId: 'heroAiGrad',
      format: (val) => `${val}%`,
      badge: m.aiAccuracy.badge,
    },
    latency: {
      label: m.latency.label,
      dataKey: 'latency',
      color: '#8A95B6',
      gradientId: 'heroLatencyGrad',
      format: (val) => `${val}ms`,
      badge: m.latency.badge,
    },
  };

  const currentConfig = metricConfigs[selectedMetric];

  return (
    <section className="relative pt-20 pb-6 sm:pt-24 sm:pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-[#07080A]">
      {/* Dynamic Cyber-Holographic Ambient Orbs & Radiant Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-[#E7F900]/15 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-24 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Cybernetic Isometric Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF08_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Floating Cyber Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-900/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:border-cyan-400/60 transition-all cursor-pointer">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-[11px] font-mono font-semibold text-zinc-200">
              {t.announcement}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black whitespace-nowrap shadow-sm">
              {t.badge}
            </span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-5xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] font-heading font-black tracking-tight text-white leading-[1.12]">
            <span className="block">{t.title1}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon via-cyan-300 to-purple-400 drop-shadow-[0_0_40px_rgba(231,249,0,0.3)] mt-1 sm:mt-2">
              {t.title2}
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-normal max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          {/* Primary Action Buttons (Vibrant Glows & Micro-interactions) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={onOpenTrial}
              className="px-7 py-3.5 rounded-xl bg-neon text-black font-sans font-black text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_var(--neon-glow)] flex items-center justify-center gap-2 group active:scale-95 whitespace-nowrap shrink-0 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-black shrink-0" />
              <span className="whitespace-nowrap">{t.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <a
              href="#realtime-demo"
              className="px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 font-sans font-semibold text-xs sm:text-sm border border-[var(--border-color)] hover:border-neon shadow-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md whitespace-nowrap shrink-0 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-neon fill-neon shrink-0" />
              <span className="whitespace-nowrap">{t.ctaSecondary}</span>
            </a>

            <Link
              href="/login"
              className="px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-sans text-xs sm:text-sm font-semibold border border-[var(--border-color)] hover:border-neon shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
            >
              <span className="whitespace-nowrap">Iniciar Sesión</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>

          {/* Trust Highlights Checklist with Holographic Glass Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-zinc-300 font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-neon/30 shadow-[0_0_15px_rgba(231,249,0,0.1)] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
              <span>{t.trust1}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{t.trust2}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{t.trust3}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.trust4}</span>
            </div>
          </div>
        </div>

        {/* HERO SHOWCASE: Interactive Glassmorphism Dashboard Preview */}
        <div className="mt-10 lg:mt-14 relative">
          {/* Ambient Glow Perimeter with Cyber-Neon Spectrum */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-neon/30 via-cyan-500/25 to-purple-600/30 blur-2xl opacity-80 group-hover:opacity-100 transition duration-1000 -z-10" />

          {/* Master Glass Panel with Chromatic Border */}
          <div className="rounded-2xl lg:rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Bar of Dashboard Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-[1px] bg-zinc-800" />
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-bold text-white flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-neon animate-pulse" />
                    {t.streamTitle}
                  </span>
                  <span className="text-zinc-500 hidden md:inline">ws://stream.vectorinside.io/v3/realtime</span>
                </div>
              </div>

              {/* Timeframe & Refresh controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-white/10 text-[10px] font-mono font-bold">
                  {['live', '15m', '1h', '24h', '7d'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                        timeframe === tf
                          ? 'bg-neon text-black shadow-neon-sm font-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLiveCounter((prev) => prev + 150);
                    setRevenueCounter((prev) => prev + 3200);
                  }}
                  title="Simulate Instant Ingestion Surge"
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Lobo Vectorial Sentinel Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <VectorLobo size={38} showStatus={true} status="active" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neon">
                      Asistencia Inteligente • Lobo Vectorial
                    </span>
                    <span className="text-[9px] font-sans px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 hidden sm:inline">
                      Moderación 24/7 Activa
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans italic">
                    "Detecto oportunidades comerciales en tus conversaciones. Empecemos por la atención."
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-sans text-zinc-400 shrink-0">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                  Puntaje de Atención: <strong className="text-neon font-black">98/100</strong>
                </span>
                <span className="text-zinc-700">|</span>
                <span className="text-blue-400 font-semibold">Meta CAPI Conectado</span>
              </div>
            </div>

            {/* KPI Cards Row (Glassmorphic) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Gross MRR */}
              <div
                onClick={() => setSelectedMetric('revenue')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMetric === 'revenue'
                    ? 'bg-zinc-900/90 border-neon shadow-[0_0_20px_rgba(231,249,0,0.15)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.mrr.label}</span>
                  <TrendingUp className="w-4 h-4 text-neon" />
                </div>
                <div
                  suppressHydrationWarning
                  className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight"
                >
                  ${formatHydratedNum(revenueCounter)}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-1">
                  <span>{m.mrr.growth}</span>
                  <span className="text-zinc-500">{m.mrr.sub}</span>
                </div>
              </div>

              {/* Card 2: Ingested Events */}
              <div
                onClick={() => setSelectedMetric('events')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMetric === 'events'
                    ? 'bg-zinc-900/90 border-cognitive shadow-[0_0_20px_rgba(138,149,182,0.2)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.throughput.label}</span>
                  <Zap className="w-4 h-4 text-cognitive" />
                </div>
                <div
                  suppressHydrationWarning
                  className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight"
                >
                  {formatHydratedNum(liveCounter)}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cognitive mt-1">
                  <span>{m.throughput.badge}</span>
                  <span className="text-zinc-500">{m.throughput.sub}</span>
                </div>
              </div>

              {/* Card 3: AI Accuracy */}
              <div
                onClick={() => setSelectedMetric('aiConfidence')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMetric === 'aiConfidence'
                    ? 'bg-zinc-900/90 border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.aiAccuracy.label}</span>
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
                  98.6%
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white mt-1">
                  <span>{m.aiAccuracy.badge}</span>
                  <span className="text-zinc-500">{m.aiAccuracy.sub}</span>
                </div>
              </div>

              {/* Card 4: Edge Latency */}
              <div
                onClick={() => setSelectedMetric('latency')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMetric === 'latency'
                    ? 'bg-zinc-900/90 border-cognitive shadow-[0_0_20px_rgba(138,149,182,0.2)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.latency.label}</span>
                  <Clock className="w-4 h-4 text-cognitive" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
                  11ms
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cognitive mt-1">
                  <span>{m.latency.badge}</span>
                  <span className="text-zinc-500">{m.latency.sub}</span>
                </div>
              </div>
            </div>

            {/* Main Visual: Real-time Recharts Curve + Live Event Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Interactive Graph (2 Cols) */}
              <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {currentConfig.label}
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${currentConfig.color}20`,
                        color: currentConfig.color,
                        border: `1px solid ${currentConfig.color}40`,
                      }}
                    >
                      {currentConfig.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                    <span>Edge Ingestion Active</span>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={currentConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.45} />
                          <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis
                        dataKey="time"
                        stroke="#71717a"
                        fontSize={10}
                        tickLine={false}
                        fontFamily="JetBrains Mono"
                      />
                      <YAxis
                        stroke="#71717a"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => currentConfig.format(val)}
                        fontFamily="JetBrains Mono"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#09090b',
                          borderColor: '#27272a',
                          borderRadius: '12px',
                          color: '#f4f4f5',
                          fontSize: '11px',
                          fontFamily: 'JetBrains Mono',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        }}
                        formatter={(val) => [currentConfig.format(val), currentConfig.label]}
                      />
                      <Area
                        type="monotone"
                        dataKey={currentConfig.dataKey}
                        stroke={currentConfig.color}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill={`url(#${currentConfig.gradientId})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Bottom Graph Stats */}
                <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">{t.peakThroughput}</span>
                    <span className="font-bold text-white">18,400 ev/s</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">{t.capiAttribution}</span>
                    <span className="font-bold text-emerald-400">98.4% Match</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">{t.rlsSecurity}</span>
                    <span className="font-bold text-cyan-400">AES-256 Valid</span>
                  </div>
                </div>
              </div>

              {/* Real-time Ingestion Stream Feed (1 Col) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-white/10 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-neon" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {t.liveFeedTitle}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-neon bg-neon/10 px-2 py-0.5 rounded border border-neon/30">
                    REALTIME
                  </span>
                </div>

                <div className="space-y-2.5 overflow-hidden flex-1">
                  {streamEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded-xl bg-zinc-950/70 border border-white/5 hover:border-white/15 transition-all text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ev.type === 'CAPI'
                                ? 'bg-cognitive'
                                : ev.type === 'AI'
                                ? 'bg-neon'
                                : ev.type === 'STRIPE'
                                ? 'bg-neon'
                                : 'bg-white'
                            }`}
                          />
                          [{ev.type}] {ev.channel}
                        </span>
                        <span className="text-zinc-500 text-[9px]">{ev.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-sans leading-tight">
                        {ev.msg}
                      </p>
                      <div className="flex justify-end">
                        <span className="text-[9px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5">
                          {ev.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{t.bufferHealthy}</span>
                  <span className="text-emerald-400">{t.zeroErrors}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
