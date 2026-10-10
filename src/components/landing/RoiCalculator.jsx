'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const RoiCalculator = ({ onOpenTrial, lang = 'es' }) => {
  const [adSpend, setAdSpend] = useState(15000);
  const [monthlyInquiries, setMonthlyInquiries] = useState(3500);
  const [currentConversionRate, setCurrentConversionRate] = useState(3.5);

  const t = LANDING_TRANSLATIONS[lang].roi;

  // Math models based on Vector Community benchmark
  const improvedConversionRate = currentConversionRate * 1.38;
  const averageDealSize = Math.max(120, Math.round(adSpend / (monthlyInquiries * 0.05)));
  const currentMonthlyRevenue = (monthlyInquiries * (currentConversionRate / 100)) * averageDealSize;
  const projectedMonthlyRevenue = (monthlyInquiries * (improvedConversionRate / 100)) * averageDealSize;
  const netRevenueGain = Math.round(projectedMonthlyRevenue - currentMonthlyRevenue);
  const hoursSavedPerMonth = Math.round(monthlyInquiries * 0.035);
  const annualGains = Math.round(netRevenueGain * 12);
  const roiMultiplier = ((netRevenueGain / 149)).toFixed(1);

  return (
    <section id="roi-calculator" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-black/60 border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-neon/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Master Calculator Container (Split Grid) */}
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Slider 1: Monthly Ad Spend */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold uppercase tracking-wider">
                  {t.slider1}
                </span>
                <span className="text-lg font-black text-neon">
                  ${adSpend.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#E7F900]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>$1,000</span>
                <span>$50,000</span>
                <span>$100,000+</span>
              </div>
            </div>

            {/* Slider 2: Monthly Inbound Inquiries */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold uppercase tracking-wider">
                  {t.slider2}
                </span>
                <span className="text-lg font-black text-cognitive">
                  {monthlyInquiries.toLocaleString()} leads / mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="30000"
                step="500"
                value={monthlyInquiries}
                onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#8A95B6]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>500</span>
                <span>15,000</span>
                <span>30,000+</span>
              </div>
            </div>

            {/* Slider 3: Current Close Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold uppercase tracking-wider">
                  {t.slider3}
                </span>
                <span className="text-lg font-black text-white">
                  {currentConversionRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.5"
                value={currentConversionRate}
                onChange={(e) => setCurrentConversionRate(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#FFFFFF]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>0.5%</span>
                <span>7.5%</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* Benchmark context notes */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-neon" />
                <span>{t.benchmarkTitle}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {t.benchmarkDesc}
              </p>
            </div>
          </div>

          {/* Results Card Column (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-neon/50 shadow-[0_0_40px_rgba(229,255,0,0.15)] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  {t.resultsTag}
                </span>
                <span className="text-[10px] font-mono font-black text-black bg-neon px-2.5 py-1 rounded-full uppercase">
                  {roiMultiplier}x {t.roiMultiplier}
                </span>
              </div>

              {/* Huge Metric 1: Monthly Gain */}
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-400 block">
                  {t.monthlyGain}
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-neon font-mono tracking-tight">
                  +${netRevenueGain.toLocaleString()}
                </div>
                <span className="text-[11px] font-mono text-emerald-400 block">
                  +${annualGains.toLocaleString()} / yr {t.annualGain}
                </span>
              </div>

              {/* Metric 2: Hours Saved */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">{t.hoursSaved}</span>
                  <span className="text-lg font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {hoursSavedPerMonth} hrs / mo
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">{t.cpaReduction}</span>
                  <span className="text-lg font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    -28.5% CPA
                  </span>
                </div>
              </div>
            </div>

            {/* Instant Action CTA */}
            <button
              type="button"
              onClick={onOpenTrial}
              className="w-full py-4 rounded-xl bg-neon hover:bg-[#d9f200] text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-neon flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{t.ctaButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
