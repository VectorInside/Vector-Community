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
  Clock,
  Radio,
  BarChart3,
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
      color: '#E5FF00',
      gradientId: 'heroRevenueGrad',
      format: (val) => `$${val.toLocaleString()}`,
      badge: m.mrr.badge,
    },
    events: {
      label: m.throughput.label,
      dataKey: 'events',
      color: '#06B6D4',
      gradientId: 'heroEventsGrad',
      format: (val) => `${val.toLocaleString()} ev/s`,
      badge: m.throughput.badge,
    },
    aiConfidence: {
      label: m.aiAccuracy.label,
      dataKey: 'aiConfidence',
      color: '#10B981',
      gradientId: 'heroAiGrad',
      format: (val) => `${val}%`,
      badge: m.aiAccuracy.badge,
    },
    latency: {
      label: m.latency.label,
      dataKey: 'latency',
      color: '#A855F7',
      gradientId: 'heroLatencyGrad',
      format: (val) => `${val}ms`,
      badge: m.latency.badge,
    },
  };

  const currentConfig = metricConfigs[selectedMetric];

  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Signature Diagonal Cyber Slashes from Vector Inside Brand (Image 2) */}
      <div className="absolute top-12 left-6 sm:left-12 flex items-center gap-1 opacity-70 pointer-events-none select-none">
        <span className="h-6 w-1 bg-neon rotate-45 transform origin-bottom" />
        <span className="h-10 w-1.5 bg-neon rotate-45 transform origin-bottom" />
        <span className="text-[10px] font-mono font-black text-neon tracking-widest pl-2">// VECTOR INSIDE</span>
      </div>

      <div className="absolute bottom-12 right-6 sm:right-12 flex items-center gap-1 opacity-70 pointer-events-none select-none">
        <span className="text-[10px] font-mono font-black text-neon tracking-widest pr-2">// COMMUNITY OS</span>
        <span className="h-10 w-1.5 bg-neon rotate-45 transform origin-bottom" />
        <span className="h-6 w-1 bg-neon rotate-45 transform origin-bottom" />
      </div>

      {/* Background Decorative Mesh & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#E5FF00]/12 via-cyan-500/10 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-neon/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(229,255,0,0.15)] hover:border-neon/50 transition-all cursor-pointer">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon" />
            </span>
            <span className="text-[11px] font-mono font-semibold text-zinc-300">
              {t.announcement}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold">
              {t.badge}
            </span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            {t.title1} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-emerald-300 to-cyan-400">
              {t.title2}
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 font-normal max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onOpenTrial}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neon text-black font-mono font-black text-sm uppercase tracking-wider hover:bg-[#d9f200] transition-all duration-200 shadow-[0_0_30px_rgba(229,255,0,0.4)] hover:shadow-[0_0_45px_rgba(229,255,0,0.6)] flex items-center justify-center gap-2 group active:scale-98"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#realtime-demo"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-200 font-mono font-bold text-sm border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Play className="w-4 h-4 text-neon fill-neon" />
              <span>{t.ctaSecondary}</span>
            </a>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{t.ctaApp}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Trust Highlights Checklist */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neon" />
              <span>{t.trust1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t.trust2}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{t.trust3}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>{t.trust4}</span>
            </div>
          </div>
        </div>

        {/* HERO SHOWCASE: Interactive Glassmorphism Dashboard Preview */}
        <div className="mt-14 lg:mt-20 relative">
          {/* Ambient Glow Perimeter */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-neon/30 via-cyan-500/20 to-purple-600/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

          {/* Master Glass Panel */}
          <div className="rounded-2xl lg:rounded-3xl bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6">
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

            {/* KPI Cards Row (Glassmorphic) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Gross MRR */}
              <div
                onClick={() => setSelectedMetric('revenue')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMetric === 'revenue'
                    ? 'bg-zinc-900/90 border-neon shadow-[0_0_20px_rgba(229,255,0,0.15)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.mrr.label}</span>
                  <TrendingUp className="w-4 h-4 text-neon" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
                  ${revenueCounter.toLocaleString()}
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
                    ? 'bg-zinc-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.throughput.label}</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
                  {liveCounter.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 mt-1">
                  <span>{m.throughput.badge}</span>
                  <span className="text-zinc-500">{m.throughput.sub}</span>
                </div>
              </div>

              {/* Card 3: AI Accuracy */}
              <div
                onClick={() => setSelectedMetric('aiConfidence')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMetric === 'aiConfidence'
                    ? 'bg-zinc-900/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.aiAccuracy.label}</span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
                  98.6%
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-1">
                  <span>{m.aiAccuracy.badge}</span>
                  <span className="text-zinc-500">{m.aiAccuracy.sub}</span>
                </div>
              </div>

              {/* Card 4: Edge Latency */}
              <div
                onClick={() => setSelectedMetric('latency')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMetric === 'latency'
                    ? 'bg-zinc-900/90 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.latency.label}</span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
                  11ms
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400 mt-1">
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
                                ? 'bg-emerald-400'
                                : ev.type === 'AI'
                                ? 'bg-cyan-400'
                                : ev.type === 'STRIPE'
                                ? 'bg-neon'
                                : 'bg-purple-400'
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
