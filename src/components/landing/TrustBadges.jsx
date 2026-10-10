'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Server,
  Zap,
  CheckCircle2,
  Award,
  Globe2,
  Users2,
  Star,
  Cpu,
} from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const TrustBadges = ({ lang = 'es' }) => {
  const t = LANDING_TRANSLATIONS[lang].trustBadges;

  const techEcosystem = [
    { name: 'Meta Graph API', category: 'Conversion CAPI' },
    { name: 'OpenAI GPT-4o', category: 'LLM Orchestration' },
    { name: 'DeepSeek R1', category: 'Reasoning Engine' },
    { name: 'Supabase Postgres', category: 'Vector & RLS Store' },
    { name: 'Stripe Billing', category: 'Revenue Webhooks' },
    { name: 'WhatsApp Cloud API', category: 'Omnichannel DM' },
    { name: 'Snowflake', category: 'Data Warehouse' },
    { name: 'Datadog', category: 'Telemetry & APM' },
  ];

  const badgeIcons = [ShieldCheck, Lock, Server, Award];
  const badgeColors = [
    'text-neon border-neon/30 bg-neon/5',
    'text-white border-white/20 bg-white/5',
    'text-cognitive border-cognitive/30 bg-cognitive/5',
    'text-neon border-neon/30 bg-neon/5',
  ];

  return (
    <section id="trust" className="py-10 sm:py-12 lg:py-16 relative overflow-hidden border-y border-white/5 bg-zinc-950/60">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 lg:space-y-12">
        {/* Quantitative Proof Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {t.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl hover:border-white/15 transition-all text-center space-y-2 group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-neon group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-heading">
                {stat.label}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Ecosystem Marquee / Grid */}
        <div className="space-y-6 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            {t.trustedBy}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {techEcosystem.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all flex flex-col items-center justify-center text-center space-y-1 group"
              >
                <span className="text-xs font-mono font-bold text-zinc-200 group-hover:text-neon transition-colors">
                  {item.name}
                </span>
                <span className="text-[9px] font-mono text-zinc-500">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance Badges Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-wider">
              {t.securityTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
              {t.securitySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.badges.map((badge, idx) => {
              const Icon = badgeIcons[idx] || ShieldCheck;
              const color = badgeColors[idx] || 'text-neon border-neon/30 bg-neon/5';
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-xl hover:border-white/15 transition-all space-y-3"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
