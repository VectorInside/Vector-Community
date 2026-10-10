'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { LiveTicker } from './LiveTicker';
import { TrustBadges } from './TrustBadges';
import { FeatureHighlights } from './FeatureHighlights';
import { LiveTelemetryDemo } from './LiveTelemetryDemo';
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
    <div className="min-h-screen bg-[var(--bg-base)] text-white selection:bg-[#E7F900] selection:text-black relative font-sans overflow-x-hidden">
      {/* Floating Free Trial Modal */}
      <TrialModal isOpen={trialModalOpen} onClose={handleCloseTrial} lang={lang} />

      {/* Glassmorphic Navbar with Vector Inside Branding & Language Switcher */}
      <Navbar
        onOpenTrial={handleOpenTrial}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Sections with Vector Inside Aesthetic */}
      <main className="relative">
        <HeroSection onOpenTrial={handleOpenTrial} lang={lang} />
        <LiveTicker lang={lang} />
        <TrustBadges lang={lang} />
        <FeatureHighlights lang={lang} />
        <LiveTelemetryDemo lang={lang} />
        <PricingSection onOpenTrial={handleOpenTrial} lang={lang} />
        <TestimonialsSection lang={lang} />
        <FaqSection onOpenTrial={handleOpenTrial} lang={lang} />
        <CtaBanner onOpenTrial={handleOpenTrial} lang={lang} />
      </main>

      {/* Footer with Vector Inside Logo and Status */}
      <Footer lang={lang} />
    </div>
  );
};
