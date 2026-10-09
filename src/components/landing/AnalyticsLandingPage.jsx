'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
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

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  const handleOpenTrial = () => {
    setTrialModalOpen(true);
  };

  const handleCloseTrial = () => {
    setTrialModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white selection:bg-[#E5FF00] selection:text-black relative font-sans">
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
        <TrustBadges lang={lang} />
        <FeatureHighlights lang={lang} />
        <LiveTelemetryDemo lang={lang} />
        <RoiCalculator onOpenTrial={handleOpenTrial} lang={lang} />
        <PricingSection onOpenTrial={handleOpenTrial} lang={lang} />
        <TestimonialsSection lang={lang} />
        <FaqSection lang={lang} />
        <CtaBanner onOpenTrial={handleOpenTrial} lang={lang} />
      </main>

      {/* Footer with Vector Inside Logo and Status */}
      <Footer lang={lang} />
    </div>
  );
};
