'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import { LANDING_TRANSLATIONS } from './landingTranslations';

export const Navbar = ({ onOpenTrial, lang = 'es', onToggleLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = LANDING_TRANSLATIONS[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.features, href: '#features' },
    { name: t.liveDemo, href: '#realtime-demo' },
    { name: t.architecture, href: '#ai-engine' },
    { name: t.roiCalculator, href: '#roi-calculator' },
    { name: t.pricing, href: '#pricing' },
    { name: t.trust, href: '#trust' },
    { name: t.faq, href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Official Vector Inside / Vector Community Logo */}
          <Link href="/landing" className="group flex items-center shrink-0">
            <VectorInsideLogo size="md" showCommunity={true} />
          </Link>

          {/* Desktop Navigation Links (Centered Glassmorphic Capsule) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 bg-zinc-900/80 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 shadow-lg shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-zinc-300 hover:text-neon transition-colors duration-200 font-sans whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions (Language Switcher + App Login + CTA) */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Language Switcher Button (ES / EN) */}
            <button
              type="button"
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-neon text-xs font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm whitespace-nowrap"
              title="Cambiar Idioma / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-neon" />
              <span className={lang === 'es' ? 'text-neon font-black' : 'text-zinc-500'}>ES</span>
              <span className="text-zinc-600">/</span>
              <span className={lang === 'en' ? 'text-neon font-black' : 'text-zinc-500'}>EN</span>
            </button>

            <Link
              href="/login"
              className="text-xs font-mono font-semibold text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-xl transition-colors whitespace-nowrap"
            >
              {t.signIn}
            </Link>

            <Link
              href="/dashboard"
              className="text-xs font-mono font-bold text-white px-3.5 py-2 rounded-xl border border-white/15 bg-zinc-900/90 hover:bg-zinc-800 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{t.liveApp}</span>
            </Link>

            <button
              type="button"
              onClick={onOpenTrial}
              className="text-xs font-mono font-black bg-neon text-black px-4 py-2 rounded-xl hover:bg-[#d9f200] transition-all duration-200 shadow-[0_0_20px_rgba(229,255,0,0.35)] hover:shadow-[0_0_25px_rgba(229,255,0,0.5)] flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>{t.startTrial}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleLang}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono font-bold text-neon"
            >
              {lang.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl bg-zinc-950/95 border border-white/10 backdrop-blur-2xl space-y-3 animate-fade-in shadow-2xl">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-zinc-300 hover:text-neon rounded-lg hover:bg-zinc-900 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 font-mono text-xs">
              <Link
                href="/login"
                className="w-full text-center font-bold py-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-200"
              >
                {t.signIn}
              </Link>
              <Link
                href="/dashboard"
                className="w-full text-center font-bold py-2.5 rounded-xl border border-white/10 bg-zinc-900 text-cyan-400"
              >
                {t.liveApp}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial();
              }}
              className="w-full text-center font-bold py-2.5 rounded-xl bg-neon text-black shadow-neon-sm font-mono text-xs"
            >
              {t.startTrial}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
