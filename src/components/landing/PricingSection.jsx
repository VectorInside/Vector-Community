'use client';

import React from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  Clock,
  Zap,
} from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const PricingSection = ({ onOpenTrial, lang = 'es' }) => {
  const t = LANDING_TRANSLATIONS[lang].pricing;

  return (
    <section id="pricing" className="py-8 sm:py-12 lg:py-14 relative overflow-hidden bg-zinc-950 border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-neon/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Visual Billing Timeline Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-neon" />
            <span className="text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
              {t.timelineBadge}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                {t.timelineStep1Title}
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {t.timelineStep1Desc}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-neon/30 space-y-1">
              <span className="text-xs font-bold text-neon flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                {t.timelineStep2Title}
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {t.timelineStep2Desc}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {t.plans.map((plan, idx) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id || idx}
                className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between relative group ${
                  isPopular
                    ? 'bg-zinc-900/90 border-2 border-neon shadow-[0_0_40px_rgba(231,249,0,0.2)] lg:-translate-y-2'
                    : 'bg-zinc-900/40 border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular / Phase Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-3.5 py-1 rounded-full font-mono font-black text-[10px] tracking-wider uppercase whitespace-nowrap ${
                        isPopular
                          ? 'bg-neon text-black shadow-neon-sm'
                          : 'bg-zinc-800 text-zinc-300 border border-white/10'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pb-6 border-b border-white/10 space-y-1.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                        ${plan.price}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        {plan.currency}
                      </span>
                      <span className={`text-xs font-mono font-bold ${isPopular ? 'text-neon' : 'text-zinc-400'}`}>
                        {plan.suffix}
                      </span>
                    </div>
                    {plan.billingNote && (
                      <span className="text-[10px] font-mono text-zinc-400 block">
                        • {plan.billingNote}
                      </span>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3 pt-1">
                    <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                      Incluye:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-neon' : 'text-emerald-400'}`} />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-8">
                  <button
                    type="button"
                    onClick={onOpenTrial}
                    className={`w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap ${
                      isPopular
                        ? 'bg-neon hover:bg-[#d9f200] text-black shadow-neon font-black'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span>{t.ctaTrial}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Tax Notice & Enterprise Reassurance */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-neon shrink-0" />
            <div>
              <span className="font-bold text-zinc-300 block sm:inline mr-2">
                {t.taxNotice}
              </span>
              <span className="text-zinc-500 hidden sm:inline">•</span>
              <span className="ml-0 sm:ml-2 text-zinc-400">
                {t.guarantee}
              </span>
            </div>
          </div>
          <a
            href="#faq"
            className="text-zinc-300 hover:text-white underline underline-offset-4 shrink-0"
          >
            {t.migrationQuestion}
          </a>
        </div>
      </div>
    </section>
  );
};

