'use client';

import React from 'react';
import Image from 'next/image';
import { Star, TrendingUp } from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const TestimonialsSection = ({ lang = 'es' }) => {
  const t = LANDING_TRANSLATIONS[lang].testimonials;

  return (
    <section className="py-8 sm:py-12 lg:py-14 relative overflow-hidden bg-black/50 border-t border-white/5">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-neon/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-neon" />
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {t.reviews.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl hover:border-neon/40 transition-all duration-300 flex flex-col justify-between space-y-6 group hover:shadow-[0_0_30px_rgba(231,249,0,0.1)]"
            >
              <div className="space-y-4">
                {/* Top Row: Stars + Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-neon">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-neon" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
                    {item.tag}
                  </span>
                </div>

                {/* ROI Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{item.metric}</span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15 shrink-0">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    width={40}
                    height={40}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white font-mono truncate">
                    {item.author}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {item.role} • {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Production Proof Metrics Bar (Elimina vacíos) */}
        {t.stats && (
          <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-xl">
            {t.stats.map((s, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black font-mono text-neon">
                  {s.value}
                </div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
