'use client';

import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const PricingSection = ({ onOpenTrial, lang = 'es' }) => {
  const [billingCycle, setBillingCycle] = useState('annual');

  const t = LANDING_TRANSLATIONS[lang].pricing;

  return (
    <section id="pricing" className="py-24 lg:py-32 relative overflow-hidden bg-zinc-950">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-neon/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-mono font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>
              {t.monthly}
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-8 rounded-full bg-zinc-900 border border-white/15 p-1 relative transition-colors cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-neon transition-transform duration-300 ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold ${billingCycle === 'annual' ? 'text-white' : 'text-zinc-500'}`}>
                {t.annual}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30">
                {t.saveBadge}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {t.plans.map((plan, idx) => {
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
            const isPopular = plan.popular;

            return (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between relative ${
                  isPopular
                    ? 'bg-zinc-900/90 border-2 border-neon shadow-[0_0_40px_rgba(229,255,0,0.2)] lg:-translate-y-2'
                    : 'bg-zinc-900/40 border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full bg-neon text-black font-mono font-black text-[10px] tracking-wider uppercase shadow-neon-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pb-6 border-b border-white/10 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                        ${price}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {t.perMonth}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block">
                      {billingCycle === 'annual'
                        ? `${t.billedAnnually}${price * 12}/yr)`
                        : t.billedMonthly}
                    </span>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                      {t.includedTitle}
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-neon' : 'text-emerald-400'}`} />
                          <span>{feat}</span>
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
                    className={`w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 ${
                      isPopular
                        ? 'bg-neon hover:bg-[#d9f200] text-black shadow-neon font-black'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                    }`}
                  >
                    <span>{plan.priceMonthly > 300 ? t.ctaEnterprise : t.ctaTrial}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Reassurance & Guarantee */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-neon shrink-0" />
            <span>
              {t.guarantee}
            </span>
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
