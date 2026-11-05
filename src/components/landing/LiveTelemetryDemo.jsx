'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  ArrowUpRight,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  X,
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

const INITIAL_TELEMETRY = [
  { time: '12:00:00', totalEvents: 14200, capiMatch: 98, aiTriage: 340, anomalyScore: 2 },
  { time: '12:00:04', totalEvents: 15100, capiMatch: 99, aiTriage: 390, anomalyScore: 3 },
  { time: '12:00:08', totalEvents: 14800, capiMatch: 97, aiTriage: 370, anomalyScore: 1 },
  { time: '12:00:12', totalEvents: 16200, capiMatch: 99, aiTriage: 420, anomalyScore: 2 },
  { time: '12:00:16', totalEvents: 17400, capiMatch: 98, aiTriage: 460, anomalyScore: 4 },
  { time: '12:00:20', totalEvents: 15900, capiMatch: 99, aiTriage: 410, anomalyScore: 2 },
  { time: '12:00:24', totalEvents: 18100, capiMatch: 99, aiTriage: 490, anomalyScore: 3 },
  { time: '12:00:28', totalEvents: 19500, capiMatch: 99, aiTriage: 530, anomalyScore: 2 },
];

const CHANNEL_DISTRIBUTION = [
  { channel: 'Meta CAPI', volume: 4200, share: '38%', color: '#E7F900' },
  { channel: 'Instagram DM', volume: 3400, share: '31%', color: '#8A95B6' },
  { channel: 'WhatsApp Cloud', volume: 2200, share: '20%', color: '#FFFFFF' },
  { channel: 'Stripe SaaS', volume: 1200, share: '11%', color: '#E7F900' },
];

export const LiveTelemetryDemo = ({ lang = 'es' }) => {
  const [data, setData] = useState(INITIAL_TELEMETRY);
  const [activeChannelData, setActiveChannelData] = useState(CHANNEL_DISTRIBUTION);
  const [activeAlert, setActiveAlert] = useState(null);
  const [totalSimulatedEvents, setTotalSimulatedEvents] = useState(48920);
  const [revenueAttributed, setRevenueAttributed] = useState(128450);

  const t = LANDING_TRANSLATIONS[lang].liveDemo;

  // Periodic heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newEvents = Math.floor(15000 + Math.random() * 4000);
      const newCapi = Math.floor(97 + Math.random() * 3);
      const newTriage = Math.floor(400 + Math.random() * 120);

      setData((prev) => [
        ...prev.slice(1),
        {
          time: timeStr,
          totalEvents: newEvents,
          capiMatch: newCapi,
          aiTriage: newTriage,
          anomalyScore: Math.floor(1 + Math.random() * 3),
        },
      ]);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const triggerEventSimulation = (type) => {
    const now = new Date().toTimeString().split(' ')[0];

    if (type === 'purchase') {
      setRevenueAttributed((prev) => prev + 2450);
      setTotalSimulatedEvents((prev) => prev + 1);
      setActiveAlert({
        title: lang === 'es' ? '🔥 Conversión de Alto Valor Ingestada' : '🔥 High-Ticket Conversion Ingested',
        details:
          lang === 'es'
            ? 'Mensaje en Instagram DM cerrado -> Pago en Stripe ($2,450.00 USD). Evento de servidor Meta CAPI despachado.'
            : 'Instagram DM conversation closed -> Stripe checkout ($2,450.00). Meta CAPI server event dispatched.',
        type: 'success',
      });
      setData((prev) => [
        ...prev.slice(1),
        {
          time: now,
          totalEvents: prev[prev.length - 1].totalEvents + 1500,
          capiMatch: 100,
          aiTriage: prev[prev.length - 1].aiTriage + 45,
          anomalyScore: 1,
        },
      ]);
    } else if (type === 'lead') {
      setTotalSimulatedEvents((prev) => prev + 1);
      setActiveAlert({
        title: lang === 'es' ? '⚡ Lead B2B VIP Calificado' : '⚡ B2B Enterprise Lead Scored',
        details:
          lang === 'es'
            ? 'DeepSeek R1 identificó intención de "Contrato Enterprise". Cita diagnóstica pre-agendada.'
            : 'DeepSeek R1 identified "Enterprise 200+ Seats" intent. Auto-scheduled discovery call with CRO.',
        type: 'info',
      });
    } else if (type === 'crisis') {
      setActiveAlert({
        title: lang === 'es' ? '🛡️ Escudo de Crisis Activado' : '🛡️ Crisis Shield Auto-Triage',
        details:
          lang === 'es'
            ? 'Comentario negativo filtrado y escalado al supervisor humano en 0.4s con resumen contextual.'
            : 'Negative brand mention filtered and escalated to human supervisor in 0.4s. Zero PR exposure.',
        type: 'warning',
      });
    } else if (type === 'surge') {
      setTotalSimulatedEvents((prev) => prev + 10000);
      setActiveAlert({
        title: lang === 'es' ? '📊 Pico de Tráfico Viral (+10,000 req/s)' : '📊 Simulated Viral Traffic Surge (+10,000 req/s)',
        details:
          lang === 'es'
            ? 'Virtual Threads en Java 21 absorbieron la carga sin fricción. Latencia media por debajo de 12ms.'
            : 'Virtual threads absorbed load seamlessly. Average latency stayed below 12ms.',
        type: 'surge',
      });
      setData((prev) => [
        ...prev.slice(1),
        {
          time: now,
          totalEvents: 28900,
          capiMatch: 99,
          aiTriage: 890,
          anomalyScore: 4,
        },
      ]);
    }
  };

  return (
    <section id="realtime-demo" className="py-8 sm:py-12 lg:py-14 relative overflow-hidden bg-[#07080A]">
      {/* Radiant Cybernetic Cones & Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-cyan-500/15 via-neon/15 to-purple-600/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-neon/30 text-[11px] font-mono font-bold text-neon uppercase tracking-wider shadow-[0_0_20px_rgba(231,249,0,0.15)]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight sm:leading-snug pb-1 overflow-visible">
            {t.title}
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Simulation Triggers Bar (Chromatic Glass Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => triggerEventSimulation('purchase')}
            className="p-4 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-neon/40 hover:border-neon text-left transition-all group shadow-[0_0_20px_rgba(231,249,0,0.15)] active:scale-98 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon via-white to-neon" />
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-neon font-bold uppercase tracking-wider">
                {t.trigger1.tag}
              </span>
              <PlusCircle className="w-4 h-4 text-neon group-hover:rotate-90 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white">
              {t.trigger1.title}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {t.trigger1.sub}
            </div>
          </button>

          <button
            type="button"
            onClick={() => triggerEventSimulation('lead')}
            className="p-4 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group shadow-[0_0_20px_rgba(0,240,255,0.15)] active:scale-98 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-white to-cyan-400" />
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                {t.trigger2.tag}
              </span>
              <PlusCircle className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white">
              {t.trigger2.title}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {t.trigger2.sub}
            </div>
          </button>

          <button
            type="button"
            onClick={() => triggerEventSimulation('crisis')}
            className="p-4 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-rose-500/40 hover:border-rose-400 text-left transition-all group shadow-[0_0_20px_rgba(244,63,94,0.15)] active:scale-98 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 via-white to-rose-400" />
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                {t.trigger3.tag}
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white">
              {t.trigger3.title}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {t.trigger3.sub}
            </div>
          </button>

          <button
            type="button"
            onClick={() => triggerEventSimulation('surge')}
            className="p-4 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-purple-500/40 hover:border-purple-400 text-left transition-all group shadow-[0_0_20px_rgba(168,85,247,0.15)] active:scale-98 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-white to-purple-400" />
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                {t.trigger4.tag}
              </span>
              <Zap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white">
              {t.trigger4.title}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {t.trigger4.sub}
            </div>
          </button>
        </div>

        {/* Live Notification Banner (Persistent until user dismisses or clicks another trigger) */}
        {activeAlert && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-neon/50 text-xs font-mono flex items-start sm:items-center justify-between gap-4 animate-fade-in shadow-[0_0_30px_rgba(231,249,0,0.2)] backdrop-blur-2xl">
            <div className="flex items-start sm:items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-neon animate-ping mt-1 sm:mt-0 shrink-0" />
              <div>
                <span className="font-bold text-white text-sm block mb-0.5">{activeAlert.title}</span>
                <span className="text-zinc-300 font-sans text-xs leading-relaxed">{activeAlert.details}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-[10px] text-neon uppercase font-black px-2.5 py-1 rounded-lg bg-neon/15 border border-neon/30">
                DISPATCHED
              </span>
              <button
                type="button"
                onClick={() => setActiveAlert(null)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                title="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Master Telemetry Container */}
        <div className="rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-2xl p-6 lg:p-8 space-y-6 shadow-2xl">
          {/* Top Telemetry Meters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">{t.meters.events}</span>
              <span
                suppressHydrationWarning
                className="text-2xl font-black text-white font-mono"
              >
                {String(totalSimulatedEvents).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">{t.meters.revenue}</span>
              <span
                suppressHydrationWarning
                className="text-2xl font-black text-neon font-mono"
              >
                ${String(revenueAttributed).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">{t.meters.capi}</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">99.4% Match</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">{t.meters.latency}</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">11ms P99</span>
            </div>
          </div>

          {/* Visualization Split (Chart + Channel Bars) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Chart (2 Cols) */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-zinc-200">{t.chartTitle}</span>
                <span className="text-neon flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                  {t.liveSync}
                </span>
              </div>

              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E7F900" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#E7F900" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="aiTriageGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A95B6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8A95B6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="time" stroke="#71717a" fontSize={10} fontFamily="JetBrains Mono" />
                    <YAxis stroke="#71717a" fontSize={10} axisLine={false} fontFamily="JetBrains Mono" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#09090b',
                        borderColor: '#27272a',
                        borderRadius: '12px',
                        color: '#f4f4f5',
                        fontSize: '11px',
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalEvents"
                      stroke="#E7F900"
                      strokeWidth={2.5}
                      fill="url(#telemetryGrad)"
                      name="Total Ingested Events"
                    />
                    <Area
                      type="monotone"
                      dataKey="aiTriage"
                      stroke="#8A95B6"
                      strokeWidth={2}
                      fill="url(#aiTriageGrad)"
                      name="AI Intent Resolutions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ingestion Channels Breakdown (1 Col) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-white/5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block mb-1">
                    {t.channelsTitle}
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    {t.channelsDesc}
                  </p>
                </div>
                <VectorLobo size={28} showStatus={true} status="active" />
              </div>

              <div className="space-y-3">
                {activeChannelData.map((ch, idx) => (
                  <div key={idx} className="space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>{ch.channel}</span>
                      <span className="font-bold text-white" suppressHydrationWarning>
                        {String(ch.volume).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ev ({ch.share})
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: ch.share,
                          backgroundColor: ch.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Proof:</span>
                <span className="text-emerald-400 font-bold">SHA-256 Validated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
