'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const TrialModal = ({ isOpen, onClose, lang = 'es' }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [vertical, setVertical] = useState('creator');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = LANDING_TRANSLATIONS[lang].modal;

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E5FF00', '#06B6D4', '#10B981'],
        });
      } catch (err) {}

      setSubmitting(false);
      setSuccess(true);
    }, 600);
  };

  const handleEnterDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-neon/40 shadow-[0_0_50px_rgba(229,255,0,0.2)] p-6 sm:p-8 relative space-y-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!success ? (
          <>
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[10px] font-mono font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                {t.tag}
              </div>
              <h3 className="text-2xl font-black text-white">
                {t.title}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                {t.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="founder@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-neon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                  {t.companyLabel}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Sofi Lifestyle / Dental Polanco"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-neon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                  {t.verticalLabel}
                </label>
                <select
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-neon focus:outline-none cursor-pointer"
                >
                  <option value="creator">Creator Economy & Redes Sociales Meta (Marketing)</option>
                  <option value="dental">Clínicas Médicas & Dentales (Polanco)</option>
                  <option value="ecommerce">E-Commerce & Retail (Urban Wear)</option>
                  <option value="b2b">B2B Sales & High-Ticket Enterprise</option>
                  <option value="hospitality">Hospitality & Mixología</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-neon hover:bg-[#d9f200] text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-neon flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <span>{submitting ? t.submitting : t.submitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-[10px] text-zinc-500 font-mono flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.securityProof}</span>
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center space-y-5 py-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-neon/10 border border-neon mx-auto flex items-center justify-center shadow-neon">
              <CheckCircle2 className="w-8 h-8 text-neon" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                {t.successTitle}
              </h3>
              <p className="text-xs text-zinc-400 font-mono max-w-xs mx-auto leading-relaxed">
                {t.successDesc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Tenant ID:</span>
                <span className="text-neon font-bold">ten-vector-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Security Level:</span>
                <span className="text-emerald-400 font-bold">SOC2 / RLS Active</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Ingestion Endpoint:</span>
                <span className="text-white">wss://stream.vectorinside.io</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEnterDashboard}
              className="w-full py-3.5 rounded-xl bg-neon hover:bg-[#d9f200] text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-neon flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{t.enterBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
