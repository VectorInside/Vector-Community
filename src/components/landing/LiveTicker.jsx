'use client';

import React from 'react';
import { Activity, ShieldCheck, Zap, Radio } from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const LiveTicker = ({ lang = 'es' }) => {
  const items = LANDING_TRANSLATIONS[lang].ticker || [];

  return (
    <div className="w-full bg-zinc-950/90 border-y border-white/10 backdrop-blur-xl py-3 overflow-hidden select-none relative z-20">
      {/* Subtle edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Live Badge */}
        <div className="flex items-center gap-2 shrink-0 bg-neon/10 border border-neon/30 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-neon animate-pulse shrink-0" />
          <span className="text-[10px] font-mono font-black text-neon tracking-wider uppercase whitespace-nowrap">
            CORE TELEMETRY
          </span>
        </div>

        {/* Scrollable / Flex items row */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-0.5">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 text-xs font-mono">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">
                [{item.label}]
              </span>
              <span className="text-zinc-200 font-semibold whitespace-nowrap">
                {item.value}
              </span>
              {idx < items.length - 1 && (
                <span className="text-zinc-700 ml-4 hidden sm:inline">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
