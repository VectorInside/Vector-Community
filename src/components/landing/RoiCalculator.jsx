'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

const formatNum = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const RoiCalculator = ({ onOpenTrial, lang = 'es' }) => {
  const [adSpend, setAdSpend] = useState(15000);
  const [monthlyInquiries, setMonthlyInquiries] = useState(3500);
  const [currentConversionRate, setCurrentConversionRate] = useState(3.5);

  const t = LANDING_TRANSLATIONS[lang].roi;

  // Comparativa matemática entre Costo de Pauta Actual vs. Retención con Vector
  // 1. Desperdicio actual por respuesta lenta (human CM pierde ~40% de leads en noches/fines de semana)
  const estimatedWastedAdSpend = Math.round(adSpend * 0.38);
  
  // 2. Tasa de conversión mejorada gracias a respuesta <850ms y sincronización CAPI
  const improvedConversionRate = currentConversionRate * 1.38;
  const averageDealSize = Math.max(120, Math.round(adSpend / (monthlyInquiries * 0.05)));
  const currentMonthlyRevenue = (monthlyInquiries * (currentConversionRate / 100)) * averageDealSize;
  const projectedMonthlyRevenue = (monthlyInquiries * (improvedConversionRate / 100)) * averageDealSize;
  const netRevenueGain = Math.round(projectedMonthlyRevenue - currentMonthlyRevenue);
  const hoursSavedPerMonth = Math.round(monthlyInquiries * 0.035);
  const annualGains = Math.round(netRevenueGain * 12);
  const valueMultiplier = (Math.max(2.1, (netRevenueGain / 149))).toFixed(1);

  return (
    <section id="roi-calculator" className="py-8 sm:py-12 lg:py-14 relative overflow-hidden bg-black/60 border-t border-white/5">
      {/* Background radiant glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-neon/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Section Title with Clear Comparative Frame */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-neon/30 text-[11px] font-mono font-bold text-neon uppercase tracking-wider shadow-[0_0_15px_rgba(231,249,0,0.15)]">
            <Calculator className="w-3.5 h-3.5" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight sm:leading-snug pb-1 overflow-visible">
            {t.title}
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Master Comparison & Calculator Grid */}
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Column: Client's Current Reality (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>1. Configura tus Métricas de Publicidad Actual</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Tus datos en Meta / Google</span>
            </div>

            {/* Slider 1: Monthly Ad Spend */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold uppercase tracking-wider">
                  {t.slider1}
                </span>
                <span className="text-lg font-black text-neon" suppressHydrationWarning>
                  ${formatNum(adSpend)} / mo
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
                <span>$1,000 USD</span>
                <span>$50,000 USD</span>
                <span>$100,000+ USD</span>
              </div>
            </div>

            {/* Slider 2: Monthly Inbound Inquiries */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold uppercase tracking-wider">
                  {t.slider2}
                </span>
                <span className="text-lg font-black text-cyan-400" suppressHydrationWarning>
                  {formatNum(monthlyInquiries)} leads / mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="30000"
                step="500"
                value={monthlyInquiries}
                onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>500 mensajes</span>
                <span>15,000 mensajes</span>
                <span>30,000+ mensajes</span>
              </div>
            </div>

            {/* Slider 3: Current Close Rate */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold uppercase tracking-wider">
                  {t.slider3}
                </span>
                <span className="text-lg font-black text-white" suppressHydrationWarning>
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
                <span>0.5% (Baja)</span>
                <span>7.5% (Media)</span>
                <span>15.0% (Alta)</span>
              </div>
            </div>

            {/* Visual Head-to-Head Comparative Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-3 font-mono text-xs">
              <span className="text-zinc-300 font-bold uppercase tracking-wider block text-[11px]">
                {t.comparisonTitle}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                {/* Traditional Side */}
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Tu Modelo Tradicional</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">
                    Pagas pauta en Ads + sueldo de CM ($800–$1,200 USD). Respuestas lentas (horas), fines de semana apagados. Pierdes hasta el 40% de leads.
                  </p>
                  <div className="text-rose-300 font-bold text-[10px] pt-1 border-t border-rose-500/20" suppressHydrationWarning>
                    Fuga estimada: ~${formatNum(estimatedWastedAdSpend)} USD/mo
                  </div>
                </div>

                {/* Vector Community Side */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Con Vector Community</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">
                    Suscripción fija mensual accesible. DeepSeek R1 responde en &lt;850ms 24/7 sin descansos y sincroniza conversiones a Meta CAPI.
                  </p>
                  <div className="text-emerald-300 font-bold text-[10px] pt-1 border-t border-emerald-500/20">
                    Recuperación: 100% leads atendidos
                  </div>
                </div>
              </div>

              {/* Explicit Disclaimer Notice */}
              <div className="pt-2 text-[10px] text-zinc-500 flex items-start gap-1.5 leading-normal">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>{t.disclaimerNotice}</span>
              </div>
            </div>
          </div>

          {/* Results Card Column: Recaptured Value (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-neon/50 shadow-[0_0_40px_rgba(229,255,0,0.15)] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  {t.resultsTag}
                </span>
                <span className="text-[10px] font-mono font-black text-black bg-neon px-2.5 py-1 rounded-full uppercase">
                  {valueMultiplier}x {t.roiMultiplier}
                </span>
              </div>

              {/* Huge Metric: Monthly Gain / Recovered Money */}
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-400 block">
                  {t.monthlyGain}
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-neon font-mono tracking-tight" suppressHydrationWarning>
                  +${formatNum(netRevenueGain)} USD
                </div>
                <span className="text-[11px] font-mono text-emerald-400 block" suppressHydrationWarning>
                  +${formatNum(annualGains)} USD / yr {t.annualGain}
                </span>
              </div>

              {/* Metrics Grid: Hours Saved & Waste Reduction */}
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
                    -38% Fuga Ads
                  </span>
                </div>
              </div>

              {/* Clarification banner */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon shrink-0" />
                <span>Una sola venta recuperada paga toda la mensualidad de Vector.</span>
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
