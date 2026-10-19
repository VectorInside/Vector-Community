'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const Footer = ({ lang = 'es' }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = LANDING_TRANSLATIONS[lang].footer;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-zinc-950 border-t border-white/10 text-zinc-400 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8 sm:pb-10 space-y-8 sm:space-y-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand Info (2 cols wide) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/landing" className="flex items-center gap-3">
              <VectorInsideLogo size="md" showCommunity={false} showClaim={true} />
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {t.tagline}
            </p>

            {/* Live System Health Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.status}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-neon font-bold">{t.latency}</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {t.colProduct}
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="#features" className="hover:text-neon transition-colors">
                  Real-Time Engine
                </a>
              </li>
              <li>
                <a href="#realtime-demo" className="hover:text-neon transition-colors">
                  Live Stream Demo
                </a>
              </li>
              <li>
                <a href="#ai-engine" className="hover:text-neon transition-colors">
                  DeepSeek R1 AI
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neon transition-colors">
                  Vector Deal Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Adaptive Verticals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {t.colVerticals}
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/dashboard" className="hover:text-neon transition-colors">
                  Medical & Dental Clinics
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-neon transition-colors">
                  Direct-to-Consumer E-Com
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-neon transition-colors">
                  B2B High-Ticket Sales
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-neon transition-colors">
                  Creator & Social Economy
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-neon transition-colors">
                  Hospitality & Dining
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter / Stay Updated */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {t.colRadar}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.radarDesc}
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{lang === 'es' ? '¡Suscrito con éxito!' : 'Subscribed successfully!'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="operator@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:border-neon focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-neon text-black hover:bg-[#d9f200] transition-colors shrink-0 shadow-neon-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} Vector Inside Inc. {t.rights}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-zinc-300 transition-colors">
              Iniciar Sesión
            </Link>
            <a href="#trust" className="hover:text-zinc-300 transition-colors">
              Security (SOC2/GDPR)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
