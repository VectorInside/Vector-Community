'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { INITIAL_TENANTS_DATA } from '@/utils/constants';
import {
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Star,
  ChevronRight,
  ArrowRight,
  Share2,
  Check,
  Navigation,
  Zap,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Base Tenant Themes with Services and Hours
const TENANT_THEMES = {
  dental: {
    cover: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    tagline: 'Odontología integral de vanguardia, estética dental y salud bucal sin dolor.',
    address: 'Av. Horacio 1520, Polanco, Miguel Hidalgo, CDMX',
    hoursWeek: 'Lun–Vie: 09:00 a 19:00 hrs',
    hoursWeekend: 'Sáb: 09:00 a 14:00 hrs',
    rating: '4.9',
    reviewsCount: '480+',
    services: [
      { title: 'Diagnóstico Digital 3D', desc: 'Escaneo intraoral sin molde incómodo', badge: 'Gratis esta semana', tone: 'neon' },
      { title: 'Limpieza Ultrasónica & Pulido', desc: 'Profilaxis profunda con ultrasonido y flúor', badge: 'Más solicitado', tone: 'emerald' },
      { title: 'Ortodoncia Invisible', desc: 'Alineadores transparentes de última generación', badge: 'Hasta 12 MSI', tone: 'blue' },
      { title: 'Blanqueamiento Láser LED', desc: 'Aclara hasta 4 tonos en 1 sola sesión de 45 min', badge: '-20% Descuento', tone: 'neon' },
    ],
  },
  polanco: {
    cover: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    tagline: 'Cortes Prime Dry-Aged, coctelería de autor y ambiente exclusivo en el corazón de Polanco.',
    address: 'Campos Elíseos 204, Polanco V Secc, CDMX',
    hoursWeek: 'Mar–Sáb: 13:00 a 01:00 hrs',
    hoursWeekend: 'Dom: 13:00 a 20:00 hrs',
    rating: '4.8',
    reviewsCount: '620+',
    services: [
      { title: 'Reserva de Mesa VIP & Terraza', desc: 'Asignación prioritaria para ocasiones especiales', badge: 'Confirmación 5 min', tone: 'emerald' },
      { title: 'Menú Degustación 5 Tiempos', desc: 'Maridaje exclusivo seleccionado por nuestro Sommelier', badge: 'Recomendado', tone: 'neon' },
      { title: 'Cavas & Mixología de Autor', desc: 'Coctelería premium con destilados artesanales', badge: 'Happy Hour 6-8pm', tone: 'blue' },
    ],
  },
  urban: {
    cover: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    tagline: 'Sneakers exclusivos, drops limitados y streetwear 100% original autenticado.',
    address: 'Colima 180, Roma Norte, Cuauhtémoc, CDMX',
    hoursWeek: 'Lun–Vie: 11:00 a 20:00 hrs',
    hoursWeekend: 'Sáb–Dom: 11:00 a 21:00 hrs',
    rating: '4.9',
    reviewsCount: '310+',
    services: [
      { title: 'Drops Exclusivos & Sneakers Hype', desc: 'Ediciones limitadas de Nike, Jordan, Yeezy y New Balance', badge: 'Stock Limitado', tone: 'neon' },
      { title: 'Envío Express Mismo Día', desc: 'Entregas seguras en CDMX en menos de 4 horas', badge: 'Envío Gratis > $2,500', tone: 'emerald' },
      { title: 'Verificación de Autenticidad', desc: 'Certificado físico y digital de legitimidad por expertos', badge: '100% Original', tone: 'blue' },
    ],
  },
};

const DEFAULT_LEAD_FORMS = {
  dental: {
    title: 'Motivo principal de consulta:',
    subtitle: 'Te orientamos sobre fechas y presupuestos en minutos',
    buttonText: 'Solicitar Cita de Valoración',
    options: ['Limpieza Dental', 'Implante Molar', 'Ortodoncia', 'Diagnóstico General'],
  },
  polanco: {
    title: 'Reserva tu Mesa VIP en Terraza:',
    subtitle: 'Confirmación prioritaria por WhatsApp en < 5 min',
    buttonText: 'Solicitar Reserva de Mesa',
    options: ['2 comensales', '4 comensales', '6 comensales', 'Mesa VIP 8+'],
  },
  urban: {
    title: 'Talla o Modelo a consultar / apartar:',
    subtitle: 'Verificamos disponibilidad de tu talla de inmediato',
    buttonText: 'Consultar Stock & Apartar',
    options: ['26 MX', '26.5 MX', '27 MX', '27.5 MX', '28 MX'],
  },
  corp: {
    title: 'Servicio de Interés Estratégico:',
    subtitle: 'Sesión de 30 min con un consultor de soluciones',
    buttonText: 'Agendar Discovery Call (30 min)',
    options: ['Automatización IA', 'Integración CRM', 'Agentes Multi-Canal', 'Consultoría B2B'],
  },
};

export default function MicroLandingPage() {
  const params = useParams();
  const slug = params?.slug || 'dental';

  // Active tenant data with local storage synchronization
  const [activeTenantData, setActiveTenantData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTenants = localStorage.getItem('vector_tenants_data');
        if (savedTenants) {
          const parsed = JSON.parse(savedTenants);
          const found =
            parsed[slug] ||
            Object.values(parsed).find(
              (t) =>
                t.id === slug ||
                t.microLandingSlug === slug ||
                (t.name && t.name.toLowerCase().includes(slug))
            );
          if (found) return found;
        }
      } catch (e) {}
    }
    return (
      INITIAL_TENANTS_DATA[slug] ||
      Object.values(INITIAL_TENANTS_DATA).find(
        (t) =>
          t.id === slug ||
          t.microLandingSlug === slug ||
          (t.name && t.name.toLowerCase().includes(slug))
      ) ||
      INITIAL_TENANTS_DATA.dental
    );
  });

  useEffect(() => {
    const checkTenantState = () => {
      try {
        const savedTenants = localStorage.getItem('vector_tenants_data');
        if (savedTenants) {
          const parsed = JSON.parse(savedTenants);
          const found =
            parsed[slug] ||
            Object.values(parsed).find(
              (t) =>
                t.id === slug ||
                t.microLandingSlug === slug ||
                (t.name && t.name.toLowerCase().includes(slug))
            );
          if (found) setActiveTenantData(found);
        }
      } catch (e) {}
    };

    checkTenantState();
    window.addEventListener('storage', checkTenantState);
    return () => window.removeEventListener('storage', checkTenantState);
  }, [slug]);

  const baseTenant = activeTenantData;
  const baseTheme = TENANT_THEMES[baseTenant.id] || TENANT_THEMES.dental;
  const baseDefaultLead = DEFAULT_LEAD_FORMS[baseTenant.id] || DEFAULT_LEAD_FORMS.dental;

  // Real-time customizer state
  const [customData, setCustomData] = useState({
    name: baseTenant.name,
    tagline: baseTheme.tagline,
    phone: baseTenant.phone || '+525512345678',
    address: baseTheme.address,
    hoursWeek: baseTheme.hoursWeek,
    hoursWeekend: baseTheme.hoursWeekend,
    metaPixelId: baseTenant.metaPixelId || '',
    ga4MeasurementId: baseTenant.ga4MeasurementId || '',
    logo: null,
    cover: baseTheme.cover,
    services: baseTheme.services,
    leadForm: baseDefaultLead,
  });

  // Load from localStorage or sync with parent window message events
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`vector_microlanding_${baseTenant.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}

    const handleMessage = (e) => {
      if (e.data && e.data.type === 'VECTOR_MICROLANDING_UPDATE' && e.data.tenantId === baseTenant.id) {
        setCustomData((prev) => ({ ...prev, ...e.data.payload }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [baseTenant.id]);

  // Inject Meta Pixel & GA4 scripts dynamically on the Micro-Landing
  useEffect(() => {
    if (customData.metaPixelId && typeof window !== 'undefined') {
      if (!window.fbq) {
        (function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
      }
      try {
        window.fbq('init', customData.metaPixelId);
        window.fbq('track', 'PageView');
      } catch (err) {}
    }

    if (customData.ga4MeasurementId && typeof window !== 'undefined') {
      const scriptId = 'ga4-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${customData.ga4MeasurementId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', customData.ga4MeasurementId);
      }
    }
  }, [customData.metaPixelId, customData.ga4MeasurementId]);

  const trackConversion = (eventName = 'Contact') => {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, { content_name: customData.name });
      }
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'click_whatsapp', { event_category: 'lead', tenant: customData.name });
      }
    } catch (e) {}
  };

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [selectedOption, setSelectedOption] = useState(() => {
    return (DEFAULT_LEAD_FORMS[baseTenant.id] || DEFAULT_LEAD_FORMS.dental).options?.[0] || 'Consulta General';
  });
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const activeLead = customData.leadForm || DEFAULT_LEAD_FORMS[baseTenant.id] || DEFAULT_LEAD_FORMS.dental;
    if (activeLead?.options && activeLead.options.length > 0) {
      if (!activeLead.options.includes(selectedOption)) {
        setSelectedOption(activeLead.options[0]);
      }
    }
  }, [customData.leadForm, baseTenant.id, selectedOption]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIframe = window.self !== window.top;
      const searchParams = new URLSearchParams(window.location.search);
      if (isIframe || searchParams.get('preview') === 'true') {
        setIsPreviewMode(true);
      }
    }
  }, []);

  const vertical = baseTenant.vertical || (baseTenant.id === 'polanco' ? 'hospitality' : baseTenant.id === 'urban' ? 'ecommerce' : 'service_appointments');

  const getVerticalFormConfig = () => {
    const defaultLead = DEFAULT_LEAD_FORMS[baseTenant.id] || DEFAULT_LEAD_FORMS.dental;
    const activeLead = customData.leadForm || defaultLead;

    return {
      title: activeLead.title || defaultLead.title,
      subtitle: activeLead.subtitle || defaultLead.subtitle,
      buttonText: activeLead.buttonText || defaultLead.buttonText,
      options: activeLead.options && activeLead.options.length > 0 ? activeLead.options : defaultLead.options,
      icon: Sparkles,
      waText: `¡Hola ${customData.name}! 👋 Mi nombre es ${bookingName || 'un cliente'} (Tel: ${bookingPhone}). Deseo solicitar informes o agendar para: *${selectedOption}*.`,
    };
  };

  const formConfig = getVerticalFormConfig();

  const cleanPhone = (customData.phone || '+525512345678').replace(/[^0-9]/g, '');
  const primaryWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    vertical === 'hospitality' || baseTenant.id === 'polanco'
      ? `¡Hola ${customData.name}! 👋 Vi su micro-landing y me gustaría reservar una mesa o consultar el menú.`
      : `¡Hola ${customData.name}! 👋 Vi su micro-landing y me gustaría agendar una cita / solicitar informes.`
  )}`;

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: customData.name,
          text: customData.tagline,
          url,
        });
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {}
    }
  };

  const handleQuickLeadSubmit = (e) => {
    e.preventDefault();
    if (!bookingPhone) return;
    trackConversion('Lead');
    setBookedSuccess(true);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#25D366', '#D4FF00', '#FFFFFF'],
      });
    } catch (e) {}

    // Open prefilled WhatsApp
    setTimeout(() => {
      const customText = encodeURIComponent(formConfig.waText);
      window.open(`https://wa.me/${cleanPhone}?text=${customText}`, '_blank');
    }, 1000);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${customData.name} ${customData.address}`
  )}`;

  const isSuspendedOrDisabled =
    activeTenantData?.microLandingEnabled === false ||
    activeTenantData?.microLandingStatus === 'suspended' ||
    activeTenantData?.microLandingStatus === 'disabled';

  if (isSuspendedOrDisabled) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white font-sans flex flex-col items-center justify-center selection:bg-[#D4FF00] selection:text-black antialiased relative px-4 py-12 overflow-x-hidden">
        {/* Ambient Glow */}
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="w-full max-w-md bg-[#0D1117] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 backdrop-blur-xl text-center">
          {/* Avatar / Brand */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
            {activeTenantData?.avatar || '🏢'}
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              {activeTenantData?.microLandingStatus === 'suspended'
                ? 'Página en Actualización Temporal'
                : 'Micro-Landing Inactiva'}
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {activeTenantData?.name || customData.name}
            </h1>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Esta micro-landing de atención y captación se encuentra temporalmente en pausa por actualización de servicios.
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-left space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-white/40 text-[11px]">
              <span>Estado del Servicio:</span>
              <span className="text-amber-400 font-bold">En Pausa Temporal</span>
            </div>
            <div className="flex items-center justify-between text-white/40 text-[11px]">
              <span>Canal de Atención:</span>
              <span className="text-emerald-400 font-bold">WhatsApp Directo</span>
            </div>
            <div className="flex items-center justify-between text-white/40 text-[11px]">
              <span>Disponibilidad:</span>
              <span className="text-white font-bold">Inmediata</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/525588997711?text=${encodeURIComponent(
                `Hola Vector Inside, soy el titular de "${activeTenantData?.name}" y deseo información sobre los servicios.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar vía WhatsApp</span>
            </a>

            {activeTenantData?.websiteUrl && (
              <a
                href={activeTenantData.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ir al Sitio Web Oficial</span>
              </a>
            )}

            {activeTenantData?.phone && (
              <a
                href={`tel:${activeTenantData.phone}`}
                className="w-full py-2.5 px-4 rounded-xl text-white/50 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contacto directo: {activeTenantData.phone}</span>
              </a>
            )}
          </div>

          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-white/30 font-mono">
              Vector Inside • Plataforma de Adquisición & RAG
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white font-sans flex flex-col items-center justify-start selection:bg-[#D4FF00] selection:text-black antialiased relative pb-24 overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-96 bg-gradient-to-b from-[#D4FF00]/10 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Header / Sticky Nav (Safe Area Aware for Dynamic Island) */}
      <header className={`w-full max-w-md px-3.5 flex items-center justify-between sticky top-0 z-40 bg-[#07090D]/95 backdrop-blur-md border-b border-white/5 transition-all ${
        isPreviewMode ? 'pt-8 pb-2.5' : 'py-2.5'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {customData.logo ? (
              <Image
                src={customData.logo}
                alt="Logo"
                width={32}
                height={32}
                unoptimized
                className="w-full h-full object-contain p-0.5"
              />
            ) : (
              <span className="text-lg">{baseTenant.avatar || '🏢'}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xs font-bold text-white tracking-tight leading-tight truncate">
              {customData.name}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[10px] text-emerald-400 font-mono font-medium truncate">
                Abierto Ahora · Respuesta Inmediata
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="p-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-all active:scale-95 flex items-center gap-1 text-[11px] font-mono shrink-0 ml-2"
          title="Compartir o copiar enlace"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#D4FF00]" />
              <span className="text-[#D4FF00] font-bold text-[10px]">Copiado</span>
            </>
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
        </button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md px-3.5 pt-3 space-y-3.5">
        {/* Cover + Identity Card */}
        <div className="rounded-3xl bg-zinc-900/60 border border-white/10 overflow-hidden shadow-2xl relative">
          {/* Cover Photo */}
          <div className="h-28 sm:h-32 w-full relative overflow-hidden">
            <Image
              src={customData.cover || baseTheme.cover}
              alt={customData.name}
              width={450}
              height={140}
              unoptimized
              className="w-full h-full object-cover brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          </div>

          {/* Profile Header Info */}
          <div className="px-3.5 pb-3.5 pt-1 relative">
            {/* Avatar with Neon Glow Ring (Supports uploaded Custom PNG Logo) */}
            <div className="relative -mt-10 mb-2 inline-block">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-950 border-2 border-[#D4FF00]/80 p-1 shadow-[0_0_20px_rgba(212,255,0,0.35)] flex items-center justify-center overflow-hidden">
                {customData.logo ? (
                  <Image
                    src={customData.logo}
                    alt="Logo Personalizado"
                    width={80}
                    height={80}
                    unoptimized
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl">{baseTenant.avatar || '🏢'}</span>
                )}
              </div>
              {/* Verified Badge */}
              <div
                className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#07090D] border border-white/10 shadow-md"
                title="Empresa Verificada por Vector Inside"
              >
                <div className="w-4 h-4 rounded-full bg-[#D4FF00] text-black flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                {customData.name}
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {customData.tagline}
              </p>

              {/* Social Proof Star Badge */}
              <div className="flex items-center gap-1.5 pt-1.5 text-[10.5px] font-mono text-zinc-400 flex-wrap">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="ml-1 font-bold text-white">{baseTheme.rating}</span>
                </div>
                <span>•</span>
                <span>{baseTheme.reviewsCount} opiniones</span>
                <span>•</span>
                <span className="text-[#D4FF00] font-bold">{baseTenant.giro || 'Salud'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* HERO CTA: WhatsApp Direct (High Conversion Core) */}
        <a
          href={primaryWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion('Contact')}
          className="group relative block w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#22c55e] to-[#16a34a] text-black shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all active:scale-[0.98] overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-white/20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
                <MessageCircle className="w-5 h-5 text-black fill-black" />
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-black text-black tracking-tight leading-tight">
                  Contactar por WhatsApp
                </span>
                <span className="block text-[10.5px] font-medium text-black/80 mt-0.5">
                  Respuesta en &lt;1 min • Sin esperas
                </span>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ChevronRight className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
          </div>
        </a>

        {/* Services & Highlights Catalogue (Dynamic & Editable) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
              <span>Servicios & Promociones</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Disponibilidad Inmediata</span>
          </div>

          <div className="space-y-2">
            {(customData.services || baseTheme.services).map((srv, idx) => (
              <a
                key={idx}
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `¡Hola ${customData.name}! Me interesa solicitar informes o agendar sobre: *${srv.title}*.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/5 hover:border-[#D4FF00]/40 transition-all flex items-center justify-between gap-2.5 block active:scale-[0.99]"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-white group-hover:text-[#D4FF00] transition-colors line-clamp-1">
                      {srv.title}
                    </span>
                    {srv.badge && (
                      <span
                        className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          srv.tone === 'emerald'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : srv.tone === 'blue'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30'
                        }`}
                      >
                        {srv.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10.5px] text-zinc-400 leading-snug line-clamp-2">
                    {srv.desc}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#D4FF00] group-hover:text-black transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Lead / 1-Tap Booking Form (Vertical-Aware) */}
        <div className="p-3.5 rounded-3xl bg-zinc-950 border border-white/10 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <formConfig.icon className="w-4 h-4 text-[#D4FF00] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">{formConfig.title}</h4>
              <p className="text-[10px] text-zinc-400 font-mono">{formConfig.subtitle}</p>
            </div>
          </div>

          {bookedSuccess ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-1 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="font-bold text-xs">¡Solicitud recibida con éxito!</p>
              <p className="text-[10.5px] text-zinc-300">
                Abriendo WhatsApp para confirmar tu solicitud...
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuickLeadSubmit} className="space-y-2.5">
              <div>
                <label className="text-[9.5px] text-zinc-400 font-mono block mb-0.5">
                  Tu Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="ej. Carlos Mendoza"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-[#D4FF00] outline-none text-xs transition-colors"
                />
              </div>

              <div>
                <label className="text-[9.5px] text-zinc-400 font-mono block mb-0.5">
                  Número de WhatsApp (10 dígitos)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ej. 55 1234 5678"
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-[#D4FF00] outline-none text-xs font-mono transition-colors"
                />
              </div>

              {/* Dynamic Customizable Lead Form Chips */}
              <div className="space-y-1.5 pt-1 border-t border-white/5 font-mono text-[10px]">
                <label className="text-[9px] text-zinc-400 block font-bold">
                  {customData.leadForm?.title || formConfig.title}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(customData.leadForm?.options && customData.leadForm.options.length > 0
                    ? customData.leadForm.options
                    : formConfig.options || ['Consulta General', 'Atención Especializada']
                  ).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedOption(opt)}
                      className={`py-1.5 px-2 rounded-xl text-left truncate transition-all text-xs ${
                        selectedOption === opt
                          ? 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/40 font-bold shadow-sm'
                          : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D4FF00] hover:bg-[#bce000] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-[0_0_15px_rgba(212,255,0,0.2)] mt-1.5"
              >
                <span>{formConfig.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </form>
          )}
        </div>

        {/* Location & Horarios Card (With Clean Spacing and Dynamic Hours) */}
        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#D4FF00] shrink-0" />
              <span className="truncate">Ubicación & Horarios</span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-[#D4FF00] hover:underline flex items-center gap-1 shrink-0 bg-[#D4FF00]/10 px-2 py-0.5 rounded-md border border-[#D4FF00]/20"
            >
              <span>Cómo llegar</span>
              <Navigation className="w-2.5 h-2.5" />
            </a>
          </div>

          <p className="text-[10.5px] text-zinc-300 leading-snug">
            {customData.address}
          </p>

          <div className="pt-1.5 border-t border-white/5 flex items-center justify-between gap-2 text-[9.5px] font-mono text-zinc-400 flex-wrap">
            <span>{customData.hoursWeek || baseTheme.hoursWeek}</span>
            <span>{customData.hoursWeekend || baseTheme.hoursWeekend}</span>
          </div>
        </div>

        {/* OFFICIAL BRANDING FOOTER: Vector Inside */}
        <footer className="pt-3 pb-2 text-center space-y-1.5 border-t border-white/10">
          <a
            href="https://vectorinside.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all text-[10.5px] font-mono shadow-sm group"
          >
            <span className="text-zinc-400">Potenciado por</span>
            <strong className="text-white group-hover:text-[#D4FF00] transition-colors flex items-center gap-1">
              Vector Inside
            </strong>
            <ExternalLink className="w-2.5 h-2.5 text-[#D4FF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <p className="text-[9.5px] text-zinc-500 font-mono">
            ¿Quieres tu propia Micro-Landing o Página Web Oficial?{' '}
            <a
              href="https://vectorinside.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4FF00] hover:underline"
            >
              Descubre Vector Inside
            </a>
          </p>
        </footer>
      </main>

      {/* Persistent Floating Bottom Bar for Instant Action */}
      <div className="fixed bottom-2.5 inset-x-0 mx-auto w-full max-w-md px-3 z-40 pointer-events-auto">
        <div className="p-1.5 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-1.5">
          <a
            href={primaryWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd59] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-black shrink-0" />
            <span className="truncate">Agendar Cita en WhatsApp</span>
          </a>

          <a
            href={`tel:${cleanPhone}`}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors shrink-0"
            title="Llamar directamente"
          >
            <Phone className="w-4 h-4 text-zinc-300" />
          </a>
        </div>
      </div>
    </div>
  );
}
