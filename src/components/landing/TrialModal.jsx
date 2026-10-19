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
import { LANDING_TRANSLATIONS } from './landingTranslations';

// TAXONOMÍA UNIVERSAL DE GIROS DE NEGOCIO (Las 16 verticales oficiales de la plataforma)
export const BUSINESS_VERTIALS_16 = [
  { group: 'Salud & Bienestar', options: [
    { id: 'gym_fitness', name: 'Gimnasios, CrossFit & Fitness Studios', icon: '🏋️‍♂️' },
    { id: 'service_appointments', name: 'Clínicas Médicas, Dentales & Consultorios', icon: '🦷' },
    { id: 'spa_beauty', name: 'Spas, Clínicas Estéticas & Barberías', icon: '💆🏻‍♀️' },
  ]},
  { group: 'Educación & Cursos', options: [
    { id: 'education_schools', name: 'Escuelas, Colegios & Universidades', icon: '🎓' },
    { id: 'academies_courses', name: 'Academias de Idiomas, Música & Danza', icon: '📚' },
    { id: 'infoproducts_bootcamps', name: 'Cursos Online, Bootcamps Tech & Infoproductos', icon: '💻' },
  ]},
  { group: 'Networking & Comunidades', options: [
    { id: 'networking_mastermind', name: 'Redes de Networking, Cámaras & Masterminds', icon: '🤝' },
    { id: 'community_subscriptions', name: 'Comunidades de Pago & Clubs Privados', icon: '🏛️' },
  ]},
  { group: 'Retail & E-Commerce', options: [
    { id: 'ecommerce', name: 'Retail & E-Commerce (Marcas D2C / Shopify)', icon: '👟' },
  ]},
  { group: 'Hospitality & Eventos', options: [
    { id: 'hospitality', name: 'Restaurantes, Bares & Mixología', icon: '🥩' },
    { id: 'event_venues', name: 'Salones de Eventos, Bodas & Banquetes', icon: '🎉' },
  ]},
  { group: 'B2B & Servicios Profesionales', options: [
    { id: 'b2b', name: 'B2B Sales, Software SaaS & Consultoría Enterprise', icon: '💼' },
    { id: 'legal_accounting', name: 'Despachos Legales, Notarías & Fiscalistas', icon: '⚖️' },
  ]},
  { group: 'Bienes Raíces & Automotriz', options: [
    { id: 'realestate', name: 'Bienes Raíces, Desarrollos & Inmobiliarias', icon: '🏙️' },
    { id: 'automotive', name: 'Agencias de Autos, Concesionarias & Talleres', icon: '🚗' },
  ]},
  { group: 'Creadores & Marcas Personales', options: [
    { id: 'creator', name: 'Creadores en Redes Meta, Streamers & Podcasts', icon: '🎬' },
  ]},
];

export const TrialModal = ({ isOpen, onClose, lang = 'es' }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [vertical, setVertical] = useState('service_appointments');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef(null);

  const t = LANDING_TRANSLATIONS[lang].modal;

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

  const allOptions = BUSINESS_VERTIALS_16.flatMap((g) => g.options);
  const selectedOption = allOptions.find((o) => o.id === vertical) || allOptions[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#E7F900', '#00F0FF', '#8A95B6'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-neon/40 shadow-[0_0_40px_rgba(231,249,0,0.2)] p-4 sm:p-5 relative space-y-3 max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 min-w-[34px] min-h-[34px] rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors z-20 flex items-center justify-center"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!success ? (
          <>
            {/* Header: Compact */}
            <div className="space-y-1 text-center pr-6">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon/10 border border-neon/30 text-neon text-[9px] font-mono font-bold uppercase">
                <Clock className="w-3 h-3" />
                <span>Sandbox Limitado (7 Días)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-black text-white">
                {t.title}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono leading-tight">
                Acceso restringido para auditar tu giro sin tarjeta de crédito.
              </p>
            </div>

            {/* Restrictions Warning Notice */}
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-amber-500/30 flex items-start gap-2 text-[10px] font-mono text-zinc-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Condiciones:</strong> 7 días de evaluación, 100 chats de prueba y 1 administrador.
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
                    placeholder="director@tuempresa.com"
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
                    placeholder="Clínica Polanco / Marca de Retail"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full min-h-[38px] bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-neon focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom Expandable Selector for the 16 Verticals (Inline Flow: Zero Overlap) */}
              <div ref={dropdownRef} className="space-y-1">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[10px] font-mono font-bold text-zinc-300">
                    {t.verticalLabel}
                  </label>
                  <span className="text-[9px] font-mono text-neon font-semibold">16 Giros Oficiales</span>
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
                    <span className="text-sm shrink-0">{selectedOption.icon}</span>
                    <span className="truncate text-zinc-100 text-xs font-semibold">{selectedOption.name}</span>
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
                    {BUSINESS_VERTIALS_16.map((group, gIdx) => (
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
                <span>Duración Sandbox:</span>
                <span className="text-neon font-bold">7 Días de Evaluación</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Nivel de Acceso:</span>
                <span className="text-amber-400 font-bold">Restringido (Evaluación)</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Aislamiento:</span>
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
  );
};
