'use client';

import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Users2,
  PieChart,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const FeatureHighlights = ({ lang = 'es' }) => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const t = LANDING_TRANSLATIONS[lang].features;

  const featureIcons = [Activity, Cpu, TrendingUp, ShieldCheck, Users2, PieChart];
  const cardAccents = [
    {
      glow: 'hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(0,240,255,0.25)]',
      border: 'border-cyan-500/20',
      badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      iconBox: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400',
      gradient: 'from-cyan-500/10 via-transparent to-transparent',
    },
    {
      glow: 'hover:border-neon/60 hover:shadow-[0_0_35px_rgba(231,249,0,0.25)]',
      border: 'border-neon/20',
      badge: 'text-neon bg-neon/10 border-neon/30',
      iconBox: 'bg-zinc-950 border-neon/30 text-neon group-hover:border-neon',
      gradient: 'from-neon/10 via-transparent to-transparent',
    },
    {
      glow: 'hover:border-purple-400/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]',
      border: 'border-purple-500/20',
      badge: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      iconBox: 'bg-purple-950/40 border-purple-500/30 text-purple-400 group-hover:border-purple-400',
      gradient: 'from-purple-500/10 via-transparent to-transparent',
    },
    {
      glow: 'hover:border-rose-400/60 hover:shadow-[0_0_35px_rgba(244,63,94,0.25)]',
      border: 'border-rose-500/20',
      badge: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      iconBox: 'bg-rose-950/40 border-rose-500/30 text-rose-400 group-hover:border-rose-400',
      gradient: 'from-rose-500/10 via-transparent to-transparent',
    },
    {
      glow: 'hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]',
      border: 'border-emerald-500/20',
      badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      iconBox: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400',
      gradient: 'from-emerald-500/10 via-transparent to-transparent',
    },
    {
      glow: 'hover:border-amber-400/60 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]',
      border: 'border-amber-500/20',
      badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      iconBox: 'bg-amber-950/40 border-amber-500/30 text-amber-400 group-hover:border-amber-400',
      gradient: 'from-amber-500/10 via-transparent to-transparent',
    },
  ];

  return (
    <section id="features" className="py-8 sm:py-12 lg:py-14 relative overflow-hidden bg-[#07080A]">
      {/* Radiant Cyber-Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-tr from-neon/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight sm:leading-snug pb-1 overflow-visible">
            {t.title1} <br className="hidden sm:inline" />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neon via-cyan-300 to-purple-400 drop-shadow-[0_0_30px_rgba(231,249,0,0.2)] pb-3 pt-1 -mb-3 -mt-1 overflow-visible align-baseline">
              {t.title2}
            </span>
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 6 Feature Glassmorphic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {t.cards.map((feat, idx) => {
            const Icon = featureIcons[idx] || Activity;
            const accent = cardAccents[idx] || cardAccents[0];

            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-b ${accent.gradient} bg-zinc-950/80 border ${accent.border} backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 group ${accent.glow} relative overflow-hidden`}
              >
                {/* Subtle top edge highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="space-y-4">
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg ${accent.iconBox}`}>
                      <Icon className="w-6 h-6 transition-colors" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shadow-sm ${accent.badge}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                      {feat.category}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2.5 font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                {/* Card Footer Metric */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">{t.benchmark}</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    {feat.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE FEATURE DEEP-DIVE PLAYGROUND */}
        <div id="ai-engine" className="rounded-3xl bg-zinc-950/90 border border-white/10 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-neon uppercase tracking-wider mb-1">
                <Cpu className="w-4 h-4" />
                {t.playground.tag}
              </div>
              <h3 className="text-2xl font-black text-white">
                {t.playground.title}
              </h3>
            </div>

            {/* Interactive Tab Selectors */}
            <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-mono font-bold">
              {[
                { id: 'pipeline', label: t.playground.tab1 },
                { id: 'rag', label: t.playground.tab2 },
                { id: 'capi', label: t.playground.tab3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-neon text-black shadow-neon-sm font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Pipeline */}
          {activeTab === 'pipeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center animate-fade-in">
              <div className="space-y-4">
                <span className="text-xs font-mono text-neon font-bold uppercase tracking-wider">
                  {t.playground.pipeline.tag}
                </span>
                <h4 className="text-xl font-black text-white">
                  {t.playground.pipeline.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t.playground.pipeline.desc}
                </p>
                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
                    <span>{t.playground.pipeline.b1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
                    <span>{t.playground.pipeline.b2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
                    <span>{t.playground.pipeline.b3}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-sans text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2 font-mono">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.playground.pipeline.inspectorHeader}
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {t.playground.pipeline.inspectorStatus}
                  </span>
                </div>
                
                {/* Visual Chat Mockup Bubble Sequence */}
                <div className="bg-black/80 p-4 rounded-xl space-y-3 border border-white/5">
                  {/* Lead Message */}
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                      U
                    </span>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-zinc-800 text-zinc-200 text-xs shadow-sm">
                      <p className="font-medium">"Hola, vi su reel de transformación dental. ¿Tienen citas esta semana y qué costo tiene?"</p>
                      <span className="text-[9px] text-zinc-400 block mt-1 font-mono">Instagram DM • hace 3s</span>
                    </div>
                  </div>

                  {/* AI Community Manager Response */}
                  <div className="flex items-start gap-2 max-w-[88%] ml-auto flex-row-reverse">
                    <span className="w-7 h-7 rounded-full bg-neon/20 text-neon border border-neon/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                      AI
                    </span>
                    <div className="p-3 rounded-2xl rounded-tr-sm bg-gradient-to-br from-zinc-900 to-zinc-950 border border-neon/40 text-white text-xs shadow-[0_0_15px_rgba(231,249,0,0.1)] space-y-2">
                      <p className="font-normal text-zinc-200">
                        "¡Hola! Qué gusto saludarte. ✨ Sí, tenemos cupos disponibles con el especialista. Además, tu primera valoración 3D incluye un <strong className="text-neon">20% de descuento</strong> con la promo del mes."
                      </p>
                      <div className="flex items-center gap-2 pt-1 border-t border-white/10 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-neon/15 text-neon font-bold">
                          Respuesta en 620ms
                        </span>
                        <span className="text-emerald-400 font-bold">
                          ✓ Enlace de Citas Despachado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: DeepSeek AI RAG */}
          {activeTab === 'rag' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center animate-fade-in">
              <div className="space-y-4">
                <span className="text-xs font-mono text-cognitive font-bold uppercase tracking-wider">
                  {t.playground.rag.tag}
                </span>
                <h4 className="text-xl font-black text-white">
                  {t.playground.rag.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t.playground.rag.desc}
                </p>
                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cognitive shrink-0" />
                    <span>{t.playground.rag.b1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cognitive shrink-0" />
                    <span>{t.playground.rag.b2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cognitive shrink-0" />
                    <span>{t.playground.rag.b3}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>{t.playground.rag.traceHeader}</span>
                  <span className="text-cognitive font-bold">{t.playground.rag.traceConfidence}</span>
                </div>
                <div className="bg-black/60 p-4 rounded-xl text-[11px] space-y-2 text-zinc-300">
                  <p className="text-zinc-400">{t.playground.rag.trace1}</p>
                  <p className="text-zinc-400">{t.playground.rag.trace2}</p>
                  <p className="text-zinc-400">{t.playground.rag.trace3}</p>
                  <p className="text-emerald-400 font-bold">{t.playground.rag.trace4}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: CAPI Attribution */}
          {activeTab === 'capi' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center animate-fade-in">
              <div className="space-y-4">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  {t.playground.capi.tag}
                </span>
                <h4 className="text-xl font-black text-white">
                  {t.playground.capi.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t.playground.capi.desc}
                </p>
                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.playground.capi.b1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.playground.capi.b2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.playground.capi.b3}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-sans text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2 font-mono">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {t.playground.capi.reportHeader}
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {t.playground.capi.reportHealth}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-black border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block">Evento de Servidor Verificado</span>
                      <span className="text-sm font-bold text-white font-mono">Cita Médica / Venta Cerrada</span>
                    </div>
                    <span className="text-base font-black text-neon font-mono px-3 py-1 rounded-xl bg-zinc-900 border border-neon/40 shadow-neon-sm">
                      +$2,450.00 MXN
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono text-[11px]">
                    <div className="p-2 rounded-lg bg-zinc-900/70 border border-white/5">
                      <span className="text-[9px] text-zinc-500 block uppercase">Canal</span>
                      <span className="font-bold text-pink-400">Instagram Reel</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/70 border border-white/5">
                      <span className="text-[9px] text-zinc-500 block uppercase">Atribución</span>
                      <span className="font-bold text-cyan-400">Meta CAPI 100%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/70 border border-white/5">
                      <span className="text-[9px] text-zinc-500 block uppercase">Tiempo</span>
                      <span className="font-bold text-emerald-400">12 minutos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
