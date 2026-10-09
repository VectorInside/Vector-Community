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
    'hover:border-neon/40 hover:shadow-[0_0_30px_rgba(229,255,0,0.15)]',
    'hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    'hover:border-emerald-400/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    'hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    'hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    'hover:border-rose-400/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
  ];
  const badgeStyles = [
    'text-neon bg-neon/10 border-neon/30',
    'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'text-purple-400 bg-purple-500/10 border-purple-500/30',
    'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'text-rose-400 bg-rose-500/10 border-rose-500/30',
  ];

  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden bg-black/40">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title1} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-emerald-300 to-cyan-400">
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
                  Sub-Second Ingestion
                </span>
                <h4 className="text-xl font-black text-white">
                  Zero-Buffer WebSocket Streaming
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Incoming payloads from Meta webhooks, Instagram Story mentions, and WhatsApp Cloud API are validated in Spring Boot and broadcasted in sub-15ms to your client telemetry interface.
                </p>
                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neon" />
                    <span>Non-blocking Java 21 Virtual Threads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neon" />
                    <span>Zero packet drop during 100k+ surges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neon" />
                    <span>Instant SSE / WebSocket broadcast</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>PAYLOAD TELEMETRY INSPECTOR</span>
                  <span className="text-emerald-400">STATUS: 200 OK (8ms)</span>
                </div>
                <div className="bg-black/60 p-4 rounded-xl text-[11px] text-zinc-300 overflow-x-auto space-y-1">
                  <p className="text-zinc-500">// Incoming Meta Webhook Verified</p>
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
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  LangGraph Supervisor + R1
                </span>
                <h4 className="text-xl font-black text-white">
                  Multi-Agent Reasoning & Guardrails
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  DeepSeek R1 breaks down complex inquiries with chain-of-thought verification. Before dispatching an automated answer, the toxicity shield and RAG knowledge base are cross-checked.
                </p>
                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Dynamic vector similarity lookup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Toxicity & prompt injection shield</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Automatic intent categorization</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>CHAIN OF THOUGHT TRACE (R1)</span>
                  <span className="text-cyan-400">CONFIDENCE: 99.2%</span>
                </div>
                <div className="bg-black/60 p-4 rounded-xl text-[11px] space-y-2 text-zinc-300">
                  <p className="text-zinc-400">1. <span className="text-neon">[Supervisor]</span> Ingested query: "Cuanto cuesta el tratamiento completo y agendan hoy?"</p>
                  <p className="text-zinc-400">2. <span className="text-cyan-400">[RAG Agent]</span> Retrieved context: 4 knowledge chunks matching "ortodoncia-precios-2026.pdf"</p>
                  <p className="text-zinc-400">3. <span className="text-purple-400">[Toxicity Guard]</span> Score 0.01 (Clean / High Purchase Intent)</p>
                  <p className="text-emerald-400 font-bold">4. [Action Dispatched] Formatted schedule link with doctor availability slot #24</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: CAPI Attribution */}
          {activeTab === 'capi' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center animate-fade-in">
              <div className="space-y-4">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Deterministic Attribution
                </span>
                <h4 className="text-xl font-black text-white">
                  Meta CAPI Server Match Rate: 98.4%
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No reliance on cookies or flaky browser pixels. Every interaction is tied to SHA-256 hashed emails, client IP, and fbc/fbp tokens for maximum ad optimization.
                </p>
                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Real-time Purchase event dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Full ROAS closed-loop feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>CPA reduction of up to 34%</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>META CONVERSIONS API MATCH REPORT</span>
                  <span className="text-emerald-400">HEALTH: EXCELLENT (9.8/10)</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 block">Event Quality</span>
                    <span className="text-base font-bold text-emerald-400">9.8 / 10</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 block">Deduplication</span>
                    <span className="text-base font-bold text-cyan-400">100% Match</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 block">Server Latency</span>
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
