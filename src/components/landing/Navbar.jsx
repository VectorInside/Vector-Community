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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: t.features, href: '#features', hideOnLg: false },
    { name: t.liveDemo, href: '#realtime-demo', hideOnLg: false },
    { name: t.architecture, href: '#ai-engine', hideOnLg: true },
    { name: t.pricing, href: '#pricing', hideOnLg: false },
    { name: t.trust, href: '#trust', hideOnLg: true },
    { name: t.faq, href: '#faq', hideOnLg: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-2.5 sm:py-3'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Official Vector Inside Brand + Community OS Tag */}
          <Link href="/landing" className="group flex items-center gap-2.5 shrink-0">
            <VectorInsideLogo size="md" showCommunity={false} />
            {/* Badge visible only on very wide screens (2xl) to preserve navigation space on laptops */}
            <span className="hidden 2xl:inline-flex items-center px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-white/10 text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest group-hover:border-neon/40 group-hover:text-neon transition-all">
              Community OS
            </span>
          </Link>

          {/* Desktop Navigation Links (Centered Glassmorphic Capsule) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-4 bg-zinc-900/85 backdrop-blur-xl px-3 xl:px-4 2xl:px-5 py-1.5 xl:py-2 rounded-full border border-white/10 shadow-lg shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[11px] xl:text-xs font-semibold text-zinc-300 hover:text-neon transition-colors duration-200 font-sans whitespace-nowrap px-1.5 py-0.5 rounded-md hover:bg-white/5 ${
                  link.hideOnLg ? 'hidden xl:inline-block' : 'inline-block'
                }`}
              >
                {link.shortName ? (
                  <>
                    <span className="hidden xl:inline">{link.name}</span>
                    <span className="inline xl:hidden">{link.shortName}</span>
                  </>
                ) : (
                  link.name
                )}
              </a>
            ))}
          </nav>

          {/* Right Actions for Desktop (Visible on lg and up) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Language Switcher Button (ES / EN) */}
            <button
              type="button"
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-neon text-[11px] xl:text-xs font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm whitespace-nowrap"
              title="Cambiar Idioma / Switch Language"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-neon shrink-0" />
              <span className={lang === 'es' ? 'text-neon font-black' : 'text-zinc-500'}>ES</span>
              <span className="text-zinc-600">/</span>
              <span className={lang === 'en' ? 'text-neon font-black' : 'text-zinc-500'}>EN</span>
            </button>

            {/* Iniciar Sesión */}
            <Link
              href="/login"
              className="text-[11px] xl:text-xs font-mono font-semibold text-zinc-300 hover:text-white px-2 xl:px-2.5 py-1.5 rounded-xl transition-colors whitespace-nowrap"
            >
              {t.signIn}
            </Link>

            {/* Centro de Mando / Dashboard Link (Icon button on lg, full text on xl+) */}
            <Link
              href="/dashboard"
              className="text-[11px] xl:text-xs font-mono font-bold text-white px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl border border-white/15 bg-zinc-900/90 hover:bg-zinc-800 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95 group"
              title={t.liveApp}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">{t.liveApp}</span>
            </Link>

            {/* Primary Conversion CTA: Siempre visible y destacado */}
            <button
              type="button"
              onClick={onOpenTrial}
              className="text-[11px] xl:text-xs font-mono font-black bg-neon text-black px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-xl hover:bg-[#d9f200] transition-all duration-200 shadow-[0_0_20px_rgba(229,255,0,0.35)] hover:shadow-[0_0_25px_rgba(229,255,0,0.5)] flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>{t.startTrial}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* Mobile & Tablet Right Controls (< lg) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            {/* Mobile Language Switcher */}
            <button
              type="button"
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-neon hover:border-neon transition-colors"
              title="Cambiar Idioma / Switch Language"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-neon shrink-0" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Quick Tablet CTA */}
            <button
              type="button"
              onClick={onOpenTrial}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-black bg-neon text-black px-3 py-1.5 rounded-xl hover:bg-[#d9f200] transition-all shadow-sm shrink-0"
            >
              <span>{t.startTrial}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
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
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center font-bold py-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                {t.signIn}
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center font-bold py-2.5 rounded-xl border border-white/10 bg-zinc-900 text-cyan-400 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                <span>{t.liveApp}</span>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial();
              }}
              className="w-full text-center font-bold py-2.5 rounded-xl bg-neon text-black shadow-neon-sm font-mono text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>{t.startTrial}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

