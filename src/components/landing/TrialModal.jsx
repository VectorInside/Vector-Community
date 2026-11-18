'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Mail,
  CheckCircle2,
  Layers,
  Lock,
  Clock,
  AlertTriangle,
  ChevronDown,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portal } from '@/components/common/Portal';
import { leadService } from '@/services/leadService';
import { BUSINESS_VERTICALS_CONFIG } from '@/utils/businessVerticals';
import { LANDING_TRANSLATIONS } from './landingTranslations';

const CATEGORY_LABELS = {
  es: {
    fitness_health: 'Salud & Bienestar',
    education: 'Educación & Cursos',
    networking: 'Networking & Comunidades',
    retail_ecom: 'Retail & E-Commerce',
    hospitality: 'Hospitality & Eventos',
    b2b_services: 'B2B & Servicios Profesionales',
    realestate_auto: 'Bienes Raíces & Automotriz',
    creators: 'Creadores & Marcas Personales',
  },
  en: {
    fitness_health: 'Health & Wellness',
    education: 'Education & Courses',
    networking: 'Networking & Communities',
    retail_ecom: 'Retail & E-Commerce',
    hospitality: 'Hospitality & Events',
    b2b_services: 'B2B & Professional Services',
    realestate_auto: 'Real Estate & Automotive',
    creators: 'Creators & Personal Brands',
  },
};

const CATEGORY_ORDER = [
  'fitness_health',
  'education',
  'networking',
  'retail_ecom',
  'hospitality',
  'b2b_services',
  'realestate_auto',
  'creators',
];

const buildVerticalGroups = (lang = 'es') => {
  const labels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.es;
  const allVerticals = Object.values(BUSINESS_VERTICALS_CONFIG || {});
  return CATEGORY_ORDER.map((catId) => ({
    group: labels[catId] || catId,
    options: allVerticals
      .filter((v) => v.category === catId)
      .map((v) => ({
        id: v.id,
        name: v.name,
        icon: v.avatar || '🏢',
        canonicalId: v.canonicalId,
      })),
  })).filter((g) => g.options.length > 0);
};

export const TrialModal = ({ isOpen, onClose, lang = 'es' }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [vertical, setVertical] = useState('service_appointments');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null);

  const t = (LANDING_TRANSLATIONS[lang] || LANDING_TRANSLATIONS.es).modal;
  const isEs = lang === 'es';
  const verticalGroups = buildVerticalGroups(lang);
  const totalVerticalsCount = Object.keys(BUSINESS_VERTICALS_CONFIG || {}).length;

  // Cerrar con Escape y bloquear scroll de fondo cuando está abierto
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (dropdownOpen) {
          setDropdownOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, dropdownOpen, onClose]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!isOpen) return null;

  const allOptions = verticalGroups.flatMap((g) => g.options);
  const selectedOption = allOptions.find((o) => o.id === vertical) || allOptions[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      await leadService.createLead({
        tenantId: 'tenant-vector-inside',
        name: businessName.trim(),
        email: email.trim(),
        notes: `Solicitud Sandbox Landing - Giro: ${vertical}`,
        channel: 'WEB',
        source: 'Landing Trial Modal',
        status: 'NEW',
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#E7F900', '#00F0FF', '#8A95B6'],
        });
      } catch (err) {}

      setSuccess(true);
    } catch (leadErr) {
      try {
        const res = await fetch('/api/send-invitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: businessName.trim(),
            tenantName: businessName.trim(),
            role: 'CLIENT_OWNER',
            vertical,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error || errData?.message || 'Error al registrar la solicitud.');
        }
        setSuccess(true);
      } catch (fallbackErr) {
        setErrorMessage(
          leadErr?.response?.data?.message ||
            fallbackErr?.message ||
            'No se pudo procesar la solicitud en PostgreSQL.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-neon/40 shadow-[0_0_40px_rgba(231,249,0,0.2)] p-4 sm:p-5 relative space-y-3 max-h-[90vh] flex flex-col justify-between overflow-y-auto my-auto animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 min-w-[34px] min-h-[34px] rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors z-20 flex items-center justify-center"
          aria-label={isEs ? 'Cerrar modal' : 'Close modal'}
        >
          <X className="w-4 h-4" />
        </button>

        {!success ? (
          <>
            {/* Header: Compact */}
            <div className="space-y-1 text-center pr-6">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon/10 border border-neon/30 text-neon text-[9px] font-mono font-bold uppercase">
                <Clock className="w-3 h-3" />
                <span>{t.tag}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-black text-white">
                {t.title}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono leading-tight">
                {t.subtitle}
              </p>
            </div>

            {/* Restrictions Warning Notice */}
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-amber-500/30 flex items-start gap-2 text-[10px] font-mono text-zinc-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {isEs ? (
                  <>
                    <strong>Condiciones:</strong> 7 días de evaluación, 100 chats de prueba y 1 administrador.
                  </>
                ) : (
                  <>
                    <strong>Conditions:</strong> 7-day evaluation, 100 test chats, and 1 administrator seat.
                  </>
                )}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-mono font-bold text-zinc-300 mb-1">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder={isEs ? 'director@tuempresa.com' : 'director@yourcompany.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[38px] bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-neon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-zinc-300 mb-1">
                  {t.companyLabel}
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder={isEs ? 'Clínica Polanco / Marca de Retail' : 'Polanco Clinic / Retail Brand'}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full min-h-[38px] bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-neon focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom Expandable Selector for the 17 Official Verticals (Inline Flow: Zero Overlap) */}
              <div ref={dropdownRef} className="space-y-1">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[10px] font-mono font-bold text-zinc-300">
                    {t.verticalLabel}
                  </label>
                  <span className="text-[9px] font-mono text-neon font-semibold">
                    {isEs ? `${totalVerticalsCount} Giros Oficiales` : `${totalVerticalsCount} Official Verticals`}
                  </span>
                </div>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-full min-h-[38px] bg-zinc-900 border rounded-xl px-3 py-1.5 text-xs text-white font-mono flex items-center justify-between transition-all focus:outline-none text-left ${
                    dropdownOpen
                      ? 'border-neon ring-1 ring-neon/40 shadow-[0_0_12px_rgba(231,249,0,0.15)]'
                      : 'border-white/10 hover:border-neon/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{selectedOption?.icon}</span>
                    <span className="truncate text-zinc-100 text-xs font-semibold">{selectedOption?.name}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-neon' : ''
                    }`}
                  />
                </button>

                {/* Expandable Scrollable Options List (In-Flow: Never covers the submit button) */}
                {dropdownOpen && (
                  <div className="max-h-48 overflow-y-auto bg-black border border-neon/40 rounded-xl p-1.5 space-y-1.5 shadow-2xl animate-fade-in mt-1">
                    {verticalGroups.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-0.5">
                        <div className="px-2 py-0.5 text-[8.5px] font-mono font-bold text-neon uppercase tracking-wider bg-zinc-900/90 rounded border border-white/5">
                          {group.group}
                        </div>
                        {group.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setVertical(opt.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center justify-between gap-1.5 transition-colors ${
                              vertical === opt.id
                                ? 'bg-neon/20 text-neon font-bold border border-neon/30'
                                : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span>{opt.icon}</span>
                              <span className="truncate">{opt.name}</span>
                            </span>
                            {vertical === opt.id && <Check className="w-3.5 h-3.5 text-neon shrink-0" />}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errorMessage && (
                <p className="text-[10px] font-mono text-rose-400 text-center">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-neon hover:bg-[#d9f200] text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-neon flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-1"
              >
                <span>{submitting ? t.submitting : t.submitBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-center text-[9px] text-zinc-500 font-mono flex items-center justify-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{t.securityProof}</span>
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center space-y-4 py-2 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon mx-auto flex items-center justify-center shadow-neon">
              <CheckCircle2 className="w-7 h-7 text-neon" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">
                {t.successTitle}
              </h3>
              <p className="text-xs text-zinc-400 font-mono max-w-xs mx-auto leading-relaxed">
                {t.successDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>{isEs ? 'Duración Sandbox:' : 'Sandbox Duration:'}</span>
                <span className="text-neon font-bold">
                  {isEs ? '7 Días de Evaluación' : '7-Day Evaluation'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>{isEs ? 'Nivel de Acceso:' : 'Access Tier:'}</span>
                <span className="text-amber-400 font-bold">
                  {isEs ? 'Restringido (Evaluación)' : 'Restricted (Evaluation)'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>{isEs ? 'Aislamiento:' : 'Isolation:'}</span>
                <span className="text-emerald-400 font-bold">PostgreSQL RLS</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEnterDashboard}
              className="w-full py-3 rounded-xl bg-neon hover:bg-[#d9f200] text-black font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-neon flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{t.enterBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
};
