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
  const featureColors = [
    'hover:border-neon/40 hover:shadow-[0_0_30px_rgba(231,249,0,0.15)]',
    'hover:border-cognitive/40 hover:shadow-[0_0_30px_rgba(138,149,182,0.15)]',
    'hover:border-neon/40 hover:shadow-[0_0_30px_rgba(231,249,0,0.15)]',
    'hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]',
    'hover:border-cognitive/40 hover:shadow-[0_0_30px_rgba(138,149,182,0.15)]',
    'hover:border-neon/40 hover:shadow-[0_0_30px_rgba(231,249,0,0.15)]',
  ];
  const badgeStyles = [
    'text-neon bg-neon/10 border-neon/30',
    'text-cognitive bg-cognitive/10 border-cognitive/30',
    'text-neon bg-neon/10 border-neon/30',
    'text-white bg-white/10 border-white/20',
    'text-cognitive bg-cognitive/10 border-cognitive/30',
    'text-neon bg-neon/10 border-neon/30',
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-black">
      {/* Glow Orbs - Vector Inside palette */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cognitive/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-14 lg:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
            {t.title1} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-white to-cognitive">
              {t.title2}
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 6 Feature Glassmorphic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.cards.map((feat, idx) => {
            const Icon = featureIcons[idx] || Activity;
            const glow = featureColors[idx] || 'hover:border-neon/40';
            const badgeStyle = badgeStyles[idx] || 'text-neon bg-neon/10 border-neon/30';

            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-6 group ${glow}`}
              >
                <div className="space-y-4">
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-neon/50 transition-all duration-300 shadow-md">
                      <Icon className="w-6 h-6 text-zinc-200 group-hover:text-neon transition-colors" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                      {feat.category}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-neon transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2.5 font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                {/* Card Footer Metric */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">{t.benchmark}</span>
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>{t.playground.pipeline.inspectorHeader}</span>
                  <span className="text-emerald-400 font-bold">{t.playground.pipeline.inspectorStatus}</span>
                </div>
                <div className="bg-black/60 p-4 rounded-xl text-[11px] text-zinc-300 overflow-x-auto space-y-1">
                  <p className="text-zinc-500">{t.playground.pipeline.codeComment}</p>
                  <p><span className="text-cyan-400">POST</span> <span className="text-white">/api/v1/webhooks/meta-capi</span></p>
                  <p className="text-zinc-400">{`{`}</p>
                  <p className="pl-4"><span className="text-purple-400">"tenant_id"</span>: <span className="text-neon">"ten-dental-polanco"</span>,</p>
                  <p className="pl-4"><span className="text-purple-400">"event_name"</span>: <span className="text-neon">"LeadQualifiedHighTicket"</span>,</p>
                  <p className="pl-4"><span className="text-purple-400">"user_intent"</span>: <span className="text-emerald-400">"Invisalign VIP Discovery Call"</span>,</p>
                  <p className="pl-4"><span className="text-purple-400">"estimated_deal_value"</span>: <span className="text-yellow-400">3850.00</span>,</p>
                  <p className="pl-4"><span className="text-purple-400">"hitl_escalation"</span>: <span className="text-cyan-400">false</span></p>
                  <p className="text-zinc-400">{`}`}</p>
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

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>{t.playground.capi.reportHeader}</span>
                  <span className="text-emerald-400 font-bold">{t.playground.capi.reportHealth}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 block">{t.playground.capi.metricQuality}</span>
                    <span className="text-base font-bold text-emerald-400">9.8 / 10</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 block">{t.playground.capi.metricDeduplication}</span>
                    <span className="text-base font-bold text-cyan-400">100% Match</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 block">{t.playground.capi.metricLatency}</span>
                    <span className="text-base font-bold text-neon">14ms</span>
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
