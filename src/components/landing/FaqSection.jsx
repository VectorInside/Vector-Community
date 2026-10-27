'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const FaqSection = ({ lang = 'es', onOpenTrial }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const t = LANDING_TRANSLATIONS[lang].faq;

  return (
    <section id="faq" className="py-8 sm:py-12 lg:py-14 relative overflow-hidden bg-zinc-950 border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cognitive/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading + Quick Help Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                {t.tag}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight sm:leading-snug pb-1 overflow-visible">
                {t.title}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Tactical Support Card */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-neon">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {t.quickHelpTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t.quickHelpTime}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {t.quickHelpDesc}
              </p>

              <button
                type="button"
                onClick={onOpenTrial}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold border border-white/10 flex items-center justify-center gap-2 transition-all hover:border-neon/40 hover:text-neon"
              >
                <span>{t.quickHelpBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 6 FAQ Accordion items (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {t.items.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-zinc-900/80 border-neon/50 shadow-[0_0_20px_rgba(231,249,0,0.1)]'
                      : 'bg-zinc-900/30 border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-mono">
                      {faq.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-neon border-neon/50' : 'text-zinc-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal border-t border-white/5 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
