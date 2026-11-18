'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import { leadService } from '@/services/leadService';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const Footer = ({ lang = 'es' }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const t = LANDING_TRANSLATIONS[lang].footer;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;
    setIsSubmitting(true);
    setSubscribeError('');
    try {
      await leadService.createLead({
        tenantId: 'tenant-vector-inside',
        name: email.trim().split('@')[0] || 'Suscriptor Radar',
        email: email.trim(),
        notes: 'Suscripción al Radar Vectorial desde Footer',
        channel: 'WEB',
        source: 'Landing Footer',
        status: 'NEW',
      });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setSubscribeError(
        err?.response?.data?.message ||
          err?.message ||
          (lang === 'es' ? 'No se pudo registrar el correo.' : 'Could not register email.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-white/10 text-zinc-400 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8 sm:pb-10 space-y-8 sm:space-y-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand Info (2 cols wide) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
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
                  {lang === 'es' ? 'Motor en Tiempo Real' : 'Real-Time Engine'}
                </a>
              </li>
              <li>
                <a href="#realtime-demo" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'Demo en Vivo' : 'Live Stream Demo'}
                </a>
              </li>
              <li>
                <a href="#ai-engine" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'Motor IA DeepSeek' : 'DeepSeek AI Engine'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'Planes y Precios' : 'Vector Deal Pricing'}
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
                <a href="#pricing" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'Clínicas Médicas y Dentales' : 'Medical & Dental Clinics'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'E-Commerce Directo' : 'Direct-to-Consumer E-Com'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'Ventas B2B High-Ticket' : 'B2B High-Ticket Sales'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'Economía de Creadores' : 'Creator & Social Economy'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neon transition-colors">
                  {lang === 'es' ? 'Hospitalidad y Restaurantes' : 'Hospitality & Dining'}
                </a>
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
                    disabled={isSubmitting}
                    className="p-2 rounded-xl bg-neon text-black hover:bg-[#d9f200] transition-colors shrink-0 shadow-neon-sm disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {subscribeError && (
                  <p className="text-[10px] font-mono text-rose-400">{subscribeError}</p>
                )}
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
              {lang === 'es' ? 'Iniciar Sesión' : 'Sign In'}
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
