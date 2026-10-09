'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BarChart3 } from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const CtaBanner = ({ onOpenTrial, lang = 'es' }) => {
  const t = LANDING_TRANSLATIONS[lang].ctaBanner;

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-neon/50 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_0_60px_rgba(229,255,0,0.2)] text-center space-y-8">
          {/* Decorative glow circles */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-neon/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.tag}
          </div>

          {/* Heading */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {t.title}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onOpenTrial}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neon text-black font-mono font-black text-sm uppercase tracking-wider hover:bg-[#d9f200] transition-all duration-200 shadow-neon flex items-center justify-center gap-2 group active:scale-98"
            >
              <span>{t.ctaTrial}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-mono font-bold text-sm border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>{t.ctaDashboard}</span>
            </Link>
          </div>

          {/* Guarantee pill */}
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-500 pt-2">
            <span>✓ {t.guarantee1}</span>
            <span>•</span>
            <span>✓ {t.guarantee2}</span>
            <span>•</span>
            <span>✓ {t.guarantee3}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
