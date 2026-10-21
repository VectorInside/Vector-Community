'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { LiveTicker } from './LiveTicker';
import { TrustBadges } from './TrustBadges';
import { FeatureHighlights } from './FeatureHighlights';
import { LiveTelemetryDemo } from './LiveTelemetryDemo';
import { RoiCalculator } from './RoiCalculator';
import { PricingSection } from './PricingSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { CtaBanner } from './CtaBanner';
import { Footer } from './Footer';
import { TrialModal } from './TrialModal';

export const AnalyticsLandingPage = () => {
  const [lang, setLang] = useState('es'); // Default is Español ('es')
  const [trialModalOpen, setTrialModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('vector_community_lang');
      if (savedLang === 'es' || savedLang === 'en') {
        setLang(savedLang);
      }
    } catch (e) {
      // safe fallback if storage unavailable
    }
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => {
      const nextLang = prev === 'es' ? 'en' : 'es';
      try {
        localStorage.setItem('vector_community_lang', nextLang);
      } catch (e) {}
      return nextLang;
    });
  };

  const handleOpenTrial = () => {
    setTrialModalOpen(true);
  };

  const handleCloseTrial = () => {
    setTrialModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-white selection:bg-[#E7F900] selection:text-black relative font-sans overflow-x-hidden">
      {/* Floating Free Trial Modal */}
      <TrialModal isOpen={trialModalOpen} onClose={handleCloseTrial} lang={lang} />

      {/* Dynamic Cyber-Holographic Ambient Grid & Cones (Inspired by Login Aesthetics) */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(231,249,0,0.08),transparent_70%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00F0FF07_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF07_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_70%,transparent_100%)] opacity-80" />
      <div className="fixed top-1/4 -left-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -right-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Glassmorphic Navbar with Vector Inside Branding & Language Switcher */}
      <Navbar
        onOpenTrial={handleOpenTrial}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Sections with Vector Inside Liquid Glass & Compact Spacing */}
      <main className="relative z-10 flex flex-col space-y-0">
        <HeroSection onOpenTrial={handleOpenTrial} lang={lang} />
        
        {/* Seamless Cybernetic Divider Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
        <LiveTicker lang={lang} />
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <TrustBadges lang={lang} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
        <FeatureHighlights lang={lang} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <LiveTelemetryDemo lang={lang} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
        <RoiCalculator onOpenTrial={handleOpenTrial} lang={lang} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <PricingSection onOpenTrial={handleOpenTrial} lang={lang} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <TestimonialsSection lang={lang} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        <FaqSection onOpenTrial={handleOpenTrial} lang={lang} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
        <CtaBanner onOpenTrial={handleOpenTrial} lang={lang} />
      </main>

      {/* Footer with Vector Inside Logo and Status */}
      <Footer lang={lang} />
    </div>
  );
};
