'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  resolveBrandPreset,
  QUICK_TONE_TEMPLATES,
  BRAND_AVATAR_PRESETS,
} from '@/utils/brandPresets';
import { normalizePhone10 } from '@/utils/formatters';
import {
  BuyerPersona4PsForm,
  EMPTY_BUYER_PERSONA,
  EMPTY_MARKETING_MIX_4P,
} from '@/components/shared/BuyerPersona4PsEditor';
import { InviolableRulesEditor } from '@/components/shared/InviolableRulesEditor';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  Target,
  Palette,
  Check,
  Globe,
  Share2,
  RefreshCw,
  MessageSquare,
  Instagram,
  Facebook,
  Video,
  Linkedin,
  Youtube,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Sliders,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const XLogoIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const EMPTY_SOCIAL_LINKS = {
  youtube: '',
  tiktok: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  x: '',
  website: '',
};

const SOCIAL_CHANNEL_FIELDS = [
  {
    key: 'youtube',
    label: 'YouTube (Canal Oficial)',
    placeholder: 'https://youtube.com/@minegocio',
    helper: 'La IA ofrecerá este canal cuando soliciten videos o tutoriales.',
    icon: Youtube,
    iconColor: 'text-rose-600 dark:text-rose-400',
    linkColor: 'text-rose-600 dark:text-rose-400',
    focusClass: 'focus-within:border-rose-500/60',
    inputFocusClass: 'focus:border-rose-500',
  },
  {
    key: 'tiktok',
    label: 'TikTok (Cuenta Oficial)',
    placeholder: 'https://tiktok.com/@minegocio',
    helper: 'Conectado con ideas de Reels en el Estudio de Contenido.',
    icon: Video,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    linkColor: 'text-cyan-600 dark:text-cyan-400',
    focusClass: 'focus-within:border-cyan-500/60',
    inputFocusClass: 'focus:border-cyan-500',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn (Empresa / Perfil)',
    placeholder: 'https://linkedin.com/company/minegocio',
    helper: 'Autoridad corporativa e interacciones B2B.',
    icon: Linkedin,
    iconColor: 'text-blue-600 dark:text-blue-400',
    linkColor: 'text-blue-600 dark:text-blue-400',
    focusClass: 'focus-within:border-blue-500/60',
    inputFocusClass: 'focus:border-blue-500',
  },
  {
    key: 'instagram',
    label: 'Instagram (Perfil Oficial)',
    placeholder: 'https://instagram.com/minegocio',
    helper: 'Publicado en Micro-Landing y derivación directa a mensajes.',
    icon: Instagram,
    iconColor: 'text-pink-600 dark:text-pink-400',
    linkColor: 'text-pink-600 dark:text-pink-400',
    focusClass: 'focus-within:border-pink-500/60',
    inputFocusClass: 'focus:border-pink-500',
  },
  {
    key: 'facebook',
    label: 'Facebook (Página Oficial)',
    placeholder: 'https://facebook.com/minegocio',
    helper: 'Vinculado con campañas publicitarias y comunidad.',
    icon: Facebook,
    iconColor: 'text-blue-600 dark:text-blue-400',
    linkColor: 'text-blue-600 dark:text-blue-400',
    focusClass: 'focus-within:border-blue-600/60',
    inputFocusClass: 'focus:border-blue-600',
  },
  {
    key: 'x',
    label: 'X / Twitter (Perfil Oficial)',
    placeholder: 'https://x.com/minegocio',
    helper: 'Comunicados rápidos, hilos y atención pública en X.',
    icon: XLogoIcon,
    iconColor: 'text-[var(--text-main)]',
    linkColor: 'text-lime-700 dark:text-neon',
    focusClass: 'focus-within:border-neon/60',
    inputFocusClass: 'focus:border-neon',
  },
  {
    key: 'website',
    label: 'Sitio Web / Portal',
    placeholder: 'https://minegocio.com',
    helper: 'URL principal de referencia para el modelo dual de tráfico.',
    icon: Globe,
    iconColor: 'text-lime-700 dark:text-neon',
    linkColor: 'text-lime-700 dark:text-neon',
    focusClass: 'focus-within:border-neon/60',
    inputFocusClass: 'focus:border-neon',
  },
];

const PROFILE_TABS = ['visual', 'ai', 'strategy', 'ops'];

export const PerfilMarcaView = () => {
  const {
    activeTenant,
    activeTenantKey,
    tenantsData,
    switchTenantContext,
    updateTenantPolicy,
    isAdmin,
  } = useAuth();

  // Resolver preset inteligente según vertical o ID del tenant activo
  const currentPreset = useMemo(() => {
    return resolveBrandPreset(activeTenant || activeTenantKey);
  }, [activeTenant, activeTenantKey]);

  // Form State sincronizado desde activeTenant (23 campos totales)
  const [brandPurpose, setBrandPurpose] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('');
  const [emojiPolicy, setEmojiPolicy] = useState('Moderado (según contexto)');
  const [slaTarget, setSlaTarget] = useState(15);
  const [brandColors, setBrandColors] = useState([]);
  const [customAvatar, setCustomAvatar] = useState('🏢');
  const [ownerPhone, setOwnerPhone] = useState('');

  // Propuesta Comercial (Hook, CTA, Vigencia)
  const [offerHook, setOfferHook] = useState('');
  const [offerCta, setOfferCta] = useState('');
  const [offerValidity, setOfferValidity] = useState('');

  // Reglas Inviolables
  const [inviolableRules, setInviolableRules] = useState([]);

  // Buyer Persona (7 campos) & Marketing Mix (4 Ps)
  const [buyerPersona, setBuyerPersona] = useState(EMPTY_BUYER_PERSONA);
  const [marketingMix4P, setMarketingMix4P] = useState(EMPTY_MARKETING_MIX_4P);

  // Redes Sociales Oficiales (YouTube, TikTok, LinkedIn, Instagram, Facebook, X, Website)
  const [socialLinks, setSocialLinks] = useState(EMPTY_SOCIAL_LINKS);

  // Categoría activa de selector de avatar
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState(0);

  // Pestaña activa para ergonomía cognitiva y navegación estructurada
  const searchParams = useSearchParams();
  const queryTab = searchParams ? searchParams.get('tab') : null;
  const [activeTab, setActiveTab] = useState(
    queryTab && PROFILE_TABS.includes(queryTab) ? queryTab : 'visual'
  );

  useEffect(() => {
    if (queryTab && PROFILE_TABS.includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);
  const [isSaving, setIsSaving] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  // Estados de retroalimentación
  const [savedNotification, setSavedNotification] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Medidor dinámico de salud y completitud de marca (Brand Health Score)
  const brandHealthScore = useMemo(() => {
    let score = 0;
    if (customAvatar) score += 10;
    if (brandColors && brandColors.length >= 3) score += 20;
    if (brandPurpose && brandPurpose.trim().length > 15) score += 20;
    if (toneOfVoice && toneOfVoice.trim().length > 10) score += 15;
    if (offerHook && offerHook.trim().length > 5) score += 15;
    if (buyerPersona.name || buyerPersona.mainPainPoint) score += 10;
    if (ownerPhone && normalizePhone10(ownerPhone).length === 10) score += 10;
    return Math.min(100, score);
  }, [customAvatar, brandColors, brandPurpose, toneOfVoice, offerHook, buyerPersona.name, buyerPersona.mainPainPoint, ownerPhone]);

  // Sincronización única (usada al cambiar activeTenant y al pulsar "Descartar")
  const resetFormFromTenant = useCallback((tenant, preset) => {
    if (tenant) {
      setBrandPurpose(tenant.brandPurpose || '');
      setToneOfVoice(tenant.toneOfVoice || '');
      setEmojiPolicy(tenant.emojiPolicy || 'Moderado (según contexto)');
      setSlaTarget(tenant.slaTarget || tenant.slaHitlMinutes || 15);
      const isGenericB2B = tenant.brandColors?.length === 5 && tenant.brandColors[0]?.hex === '#0F172A';
      setBrandColors(
        tenant.brandColors && tenant.brandColors.length > 0 && !isGenericB2B
          ? tenant.brandColors
          : (preset.colors || [])
      );
      setCustomAvatar(
        (tenant.avatar && tenant.avatar !== '💼' && tenant.avatar !== '🏢')
          ? tenant.avatar
          : (preset.avatar || '🐺')
      );
      setOwnerPhone(tenant.phone || '');

      // Oferta comercial
      setOfferHook(tenant.commercialOffer?.hook || '');
      setOfferCta(tenant.commercialOffer?.cta || '');
      setOfferValidity(tenant.commercialOffer?.validity || '');

      // Reglas inviolables
      setInviolableRules(
        Array.isArray(tenant.inviolableRules) ? tenant.inviolableRules : []
      );

      // Buyer Persona (7 campos) & Marketing Mix (4 Ps)
      setBuyerPersona({
        name: tenant.buyerPersona?.name || '',
        ageRange: tenant.buyerPersona?.ageRange || '',
        maritalStatus: tenant.buyerPersona?.maritalStatus || '',
        location: tenant.buyerPersona?.location || '',
        digitalHabits: tenant.buyerPersona?.digitalHabits || '',
        mainPainPoint: tenant.buyerPersona?.mainPainPoint || '',
        buyingTrigger: tenant.buyerPersona?.buyingTrigger || '',
      });

      setMarketingMix4P({
        product: tenant.marketingMix4P?.product || '',
        price: tenant.marketingMix4P?.price || '',
        place: tenant.marketingMix4P?.place || '',
        promotion: tenant.marketingMix4P?.promotion || '',
      });

      const tenantSocial = tenant.socialLinks || {};
      setSocialLinks({
        youtube: tenantSocial.youtube || '',
        tiktok: tenantSocial.tiktok || '',
        linkedin: tenantSocial.linkedin || '',
        instagram: tenantSocial.instagram || '',
        facebook: tenantSocial.facebook || '',
        x: tenantSocial.x || '',
        website: tenantSocial.website || tenant.websiteUrl || '',
      });

      setIsDirty(false);
      setPhoneError(null);
    } else {
      // Estado neutral limpio: campos vacíos con placeholders de guía para evitar datos fantasma
      setBrandPurpose('');
      setToneOfVoice('');
      setEmojiPolicy('Moderado (según contexto)');
      setSlaTarget(15);
      setBrandColors([]);
      setCustomAvatar('🏢');
      setOwnerPhone('');
      setOfferHook('');
      setOfferCta('');
      setOfferValidity('');
      setInviolableRules([]);
      setBuyerPersona(EMPTY_BUYER_PERSONA);
      setMarketingMix4P(EMPTY_MARKETING_MIX_4P);
      setSocialLinks(EMPTY_SOCIAL_LINKS);
      setIsDirty(false);
      setPhoneError(null);
    }
  }, []);

  // Sincronizar estado cuando cambie el negocio activo (activeTenant o activeTenantKey)
  useEffect(() => {
    resetFormFromTenant(activeTenant, currentPreset);
  }, [activeTenantKey, activeTenant, currentPreset, resetFormFromTenant]);

  // Manejador de guardado persistente con confirmación real en servidor
  const handleSave = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPhoneError(null);

    const cleanPhone = normalizePhone10(ownerPhone);
    if (ownerPhone && ownerPhone.trim() && cleanPhone.length !== 10) {
      setPhoneError('El teléfono de escalación humana debe contener exactamente 10 dígitos numéricos (ej. 55 1234 5678).');
      setActiveTab('ops');
      return;
    }

    if (!activeTenantKey && !activeTenant?.id) {
      return;
    }

    if (updateTenantPolicy) {
      const targetKey = activeTenantKey || activeTenant?.id;
      setIsSaving(true);
      try {
        await updateTenantPolicy(targetKey, {
          brandPurpose,
          toneOfVoice,
          emojiPolicy,
          slaTarget,
          slaHitlMinutes: slaTarget,
          brandColors,
          avatar: customAvatar,
          phone: cleanPhone || '',
          commercialOffer: {
            ...(activeTenant?.commercialOffer || {}),
            hook: offerHook,
            cta: offerCta,
            validity: offerValidity,
          },
          inviolableRules,
          buyerPersona: {
            name: buyerPersona.name,
            ageRange: buyerPersona.ageRange,
            maritalStatus: buyerPersona.maritalStatus,
            location: buyerPersona.location,
            digitalHabits: buyerPersona.digitalHabits,
            mainPainPoint: buyerPersona.mainPainPoint,
            buyingTrigger: buyerPersona.buyingTrigger,
          },
          marketingMix4P: {
            product: marketingMix4P.product,
            price: marketingMix4P.price,
            place: marketingMix4P.place,
            promotion: marketingMix4P.promotion,
          },
          socialLinks: {
            youtube: socialLinks.youtube || '',
            tiktok: socialLinks.tiktok || '',
            linkedin: socialLinks.linkedin || '',
            instagram: socialLinks.instagram || '',
            facebook: socialLinks.facebook || '',
            x: socialLinks.x || '',
            website: socialLinks.website || activeTenant?.websiteUrl || '',
          },
        });

        setIsDirty(false);
        setSavedNotification(true);
        setTimeout(() => setSavedNotification(false), 4000);
      } catch (err) {
        console.error('[PerfilMarcaView.handleSave] Error:', err);
      } finally {
        setIsSaving(false);
      }
    }
  }, [
    updateTenantPolicy,
    activeTenantKey,
    activeTenant,
    brandPurpose,
    toneOfVoice,
    emojiPolicy,
    slaTarget,
    brandColors,
    customAvatar,
    ownerPhone,
    offerHook,
    offerCta,
    offerValidity,
    inviolableRules,
    buyerPersona,
    marketingMix4P,
    socialLinks,
  ]);

  // Manejador de atajo de teclado Ctrl+S / Cmd+S para guardar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  // Cambiar color individual en paleta
  const handleColorChange = (index, newHex) => {
    setBrandColors((prev) => {
      const next = prev.map((c, i) => (i === index ? { ...c, hex: newHex } : c));
      return next;
    });
    setIsDirty(true);
  };

  // Copiar código HEX al portapapeles
  const handleCopyHex = (hex) => {
    try {
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 2000);
    } catch (e) {}
  };

  // Restablecer paleta o valores predeterminados de la vertical
  const handleResetDefaults = () => {
    setBrandPurpose(currentPreset.defaultPurpose);
    setToneOfVoice(currentPreset.defaultTone);
    setBrandColors(currentPreset.colors);
    setCustomAvatar(currentPreset.avatar);
    setSlaTarget(15);
    setIsDirty(true);
  };

  // Lista de tenants disponibles para cambio rápido de contexto
  const tenantList = useMemo(() => {
    if (!tenantsData) return [];
    return Object.values(tenantsData);
  }, [tenantsData]);

  const currentTabIndex = PROFILE_TABS.indexOf(activeTab);
  const isFirstTab = currentTabIndex <= 0;
  const isLastTab = currentTabIndex >= PROFILE_TABS.length - 1;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 font-sans pb-28">
      {/* Toast flotante fijo (evita desplazamiento CLS del header) */}
      {savedNotification && (
        <div
          role="status"
          className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold animate-fade-in shadow-xl"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Cambios Guardados Correctamente</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* HEADER PRINCIPAL & SELECTOR DE TENANT ACTIVO                        */}
      {/* =================================================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-5 gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime-700 dark:text-neon font-extrabold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/30">
              IDENTIDAD & ADN DE MARCA
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
              <span>{activeTenant ? currentPreset.canonicalId || 'V00' : 'V00'}</span>
              <span>•</span>
              <span>{activeTenant?.giro || activeTenant?.verticalLabel || 'Modo Global (Sin Negocio)'}</span>
            </span>
            {activeTenant ? (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Sincronizado y Protegido
              </span>
            ) : (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                En Espera de Selección de Negocio
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)] flex items-center gap-2.5 truncate">
              <span className="text-3xl select-none">{customAvatar}</span>
              <span className="truncate">{activeTenant?.name || 'Perfil de Marca • Modo Global'}</span>
            </h1>
          </div>

          <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
            Propósito del negocio, paleta cromática oficial, tono de voz inyectado en el motor de IA, propuesta comercial y reglas inviolables.
          </p>
        </div>

        {/* Selector de Tenant Rápido (Solo Administradores de Agencia pueden conmutar de negocio) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
          {isAdmin && tenantList.length > 1 ? (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono">
              <span className="text-[10px] text-[var(--text-muted)] pl-2">Negocio:</span>
              <select
                value={activeTenantKey || activeTenant?.id || ''}
                onChange={(e) => switchTenantContext && switchTenantContext(e.target.value)}
                className="bg-transparent text-[var(--text-main)] font-bold outline-none cursor-pointer pr-2 text-xs"
              >
                {!activeTenant && <option value="" disabled>Seleccionar Negocio...</option>}
                {tenantList.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[var(--bg-panel)] text-[var(--text-main)]">
                    {t.avatar || '🏢'} {t.name}
                  </option>
                ))}
              </select>
            </div>
          ) : activeTenant ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono">
              <span className="text-base">{customAvatar || activeTenant?.avatar || '🏢'}</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Espacio de Negocio:</span>
                <strong className="text-[var(--text-main)]">{activeTenant?.shortName || activeTenant?.name}</strong>
              </div>
              {activeTenant?.giro && (
                <span className="ml-1 text-[10px] px-2 py-0.5 rounded bg-neon/10 text-lime-700 dark:text-neon font-bold uppercase border border-neon/20">
                  {activeTenant.giro}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Ningún Negocio Seleccionado</span>
            </div>
          )}
        </div>
      </div>

      {/* Banner Informativo de Zero-State (cuando no hay negocio seleccionado) */}
      {!activeTenant && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-heading font-black text-[var(--text-main)] uppercase tracking-wide">
                Modo Global • Ningún Negocio Activo Seleccionado
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Estás visualizando la plantilla base neutral. Para editar y guardar el ADN oficial de una marca, selecciona un negocio o da de alta uno nuevo en el Wizard.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {tenantList.length > 0 && switchTenantContext && (
              <select
                onChange={(e) => switchTenantContext(e.target.value)}
                defaultValue=""
                className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] font-bold outline-none cursor-pointer"
              >
                <option value="" disabled>Seleccionar Negocio...</option>
                {tenantList.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[var(--bg-panel)]">
                    {t.avatar || '🏢'} {t.name}
                  </option>
                ))}
              </select>
            )}
            <a
              href="/config?tab=rag&mode=wizard"
              className="px-3.5 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Alta en Wizard</span>
            </a>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* BARRA DE PESTAÑAS ERGONÓMICAS & MEDIDOR DE COMPLETITUD               */}
      {/* =================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-x-auto custom-scrollbar">
          {[
            { id: 'visual', label: '1. Identidad Visual', icon: Palette, badge: `${brandColors.length} Tonos` },
            { id: 'ai', label: '2. ADN & Voz de IA', icon: Sparkles, badge: `${inviolableRules.length} Reglas` },
            { id: 'strategy', label: '3. Estrategia Comercial', icon: Target, badge: offerHook ? 'Hook Listo' : 'Pendiente' },
            { id: 'ops', label: '4. Operaciones & SLA', icon: Clock, badge: `${slaTarget}m SLA` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-neon text-black shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-black/20 text-black' : 'bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Medidor de Salud & Completitud de Marca */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block leading-none">
              Completitud de Marca
            </span>
            <strong className="text-xs font-mono text-lime-700 dark:text-neon font-black">
              {brandHealthScore}% {brandHealthScore >= 80 ? 'Excelente' : brandHealthScore >= 50 ? 'En Progreso' : 'Básico'}
            </strong>
          </div>
          <div className="w-24 h-2 bg-[var(--bg-panel)] rounded-full overflow-hidden border border-[var(--border-color)]">
            <div
              className="h-full bg-neon transition-all duration-500 rounded-full"
              style={{ width: `${brandHealthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Formulario Principal de Configuración */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* =================================================================== */}
        {/* PESTAÑA 1: IDENTIDAD VISUAL DEL NEGOCIO                             */}
        {/* =================================================================== */}
        {activeTab === 'visual' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-lime-700 dark:text-neon" />
                <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                  1. Identidad Visual del Negocio
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Activos aplicados en Página Oficial, Analítica y Respuestas
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Tarjeta de Logotipo / Isotipo del Negocio */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block">
                      Logotipo / Isotipo de Marca
                    </span>
                    <span className="text-[9px] font-mono text-lime-700 dark:text-neon font-bold">
                      Activo en Micro-Landing & WhatsApp
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mt-2">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-panel)] border-2 border-neon/40 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_15px_rgba(195,244,0,0.15)]">
                      {customAvatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-base text-[var(--text-main)] truncate">
                        {activeTenant?.name || currentPreset.name || 'Espacio de Negocio'}
                      </p>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] block truncate">
                        {activeTenant?.legalNameTaxId || activeTenant?.shortName || activeTenant?.name || 'Identidad en preparación'}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5 inline-block">
                        Giro: <strong className="text-[var(--text-main)]">{activeTenant?.giro || currentPreset.name}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selector de Avatar por Categorías con Input de Símbolo Personalizado */}
                <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">
                      Elegir Símbolo / Avatar de Marca:
                    </span>
                    {/* Categorías de emojis */}
                    <div className="flex items-center gap-1 text-[9px] font-mono overflow-x-auto max-w-[220px]">
                      {BRAND_AVATAR_PRESETS.map((cat, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedAvatarCategory(idx)}
                          className={`px-1.5 py-0.5 rounded transition-colors whitespace-nowrap ${
                            selectedAvatarCategory === idx
                              ? 'bg-neon text-black font-bold'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                          }`}
                        >
                          {cat.category.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Emojis de la categoría seleccionada */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {BRAND_AVATAR_PRESETS[selectedAvatarCategory].emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setCustomAvatar(emoji);
                          setIsDirty(true);
                        }}
                        className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                          customAvatar === emoji
                            ? 'bg-neon/20 border-2 border-neon text-black dark:text-white scale-110 shadow-sm'
                            : 'bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] hover:scale-105'
                        }`}
                        title={`Seleccionar ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}

                    {/* Input manual de emoji o letras de logotipo */}
                    <div className="flex items-center gap-1 pl-2 border-l border-[var(--border-color)]">
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">Otro:</span>
                      <input
                        type="text"
                        maxLength={4}
                        value={customAvatar}
                        onChange={(e) => {
                          setCustomAvatar(e.target.value || '🏢');
                          setIsDirty(true);
                        }}
                        placeholder="🏢"
                        className="w-10 h-8 text-center text-sm rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] focus:border-neon outline-none font-bold"
                        title="Escribe cualquier emoji o iniciales"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Paleta Cromática Oficial del Negocio */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block">
                        Paleta Cromática Oficial
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon/10 text-lime-700 dark:text-neon font-bold">
                        5 Tonos
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBrandColors(currentPreset.colors);
                        setIsDirty(true);
                      }}
                      className="text-[9px] font-mono text-lime-700 dark:text-neon hover:underline flex items-center gap-1"
                      title="Restablecer a los colores recomendados de este giro"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Restablecer de Vertical
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2 my-2">
                    {brandColors && brandColors.length > 0 ? (
                      brandColors.map((color, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 group">
                          <div
                            className="relative w-full aspect-square rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm transition-transform group-hover:scale-105"
                            style={{ backgroundColor: color.hex }}
                          >
                            <input
                              type="color"
                              value={color.hex}
                              onChange={(e) => handleColorChange(idx, e.target.value)}
                              className="absolute inset-[-15px] w-[200%] h-[200%] cursor-pointer opacity-0"
                              title={`Click para editar ${color.name}: ${color.hex}`}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-[var(--text-muted)] truncate w-full text-center">
                            {color.name ? color.name.split(' ')[0] : `Tono ${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyHex(color.hex)}
                            className="text-[8px] font-mono font-bold text-[var(--text-main)] uppercase hover:text-lime-700 dark:hover:text-neon transition-colors flex items-center gap-0.5"
                            title="Click para copiar HEX"
                          >
                            <span>{color.hex}</span>
                            {copiedHex === color.hex && <Check className="w-2.5 h-2.5 text-lime-700 dark:text-neon" />}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-5 p-4 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-panel)] flex flex-col items-center justify-center gap-2 text-center">
                        <Palette className="w-5 h-5 text-[var(--text-muted)]" />
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">Sin paleta cargada</span>
                        <button
                          type="button"
                          onClick={() => {
                            setBrandColors(currentPreset.colors);
                            setIsDirty(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neon/15 hover:bg-neon text-lime-800 dark:text-neon hover:text-black font-mono font-bold text-[10px] transition-colors border border-neon/30"
                        >
                          Cargar Paleta Oficial
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[var(--text-muted)]">Aplicado en botones y página oficial:</span>
                  <span className="font-bold text-lime-700 dark:text-neon flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Contraste WCAG AAA
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PESTAÑA 2: ADN DE MARCA & VOZ DE IA                                 */}
        {/* =================================================================== */}
        {activeTab === 'ai' && (
          <div className="space-y-6 animate-fade-in">
            {/* SECCIÓN 2: PROPÓSITO DE MARCA (CÍRCULO DORADO) & TONO DE VOZ */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-lime-700 dark:text-neon" />
                  <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                    2. Propósito de Marca (Círculo Dorado) & Tono de Voz
                  </h3>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon/10 text-lime-700 dark:text-neon border border-neon/30 font-bold">
                  Contexto Base para Asistentes IA
                </span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                {/* Propósito Central */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
                      <span>Propósito Central del Negocio (El &quot;Por Qué&quot;) *</span>
                    </label>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {brandPurpose.length} caracteres
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    disabled={!activeTenant}
                    value={brandPurpose}
                    onChange={(e) => {
                      setBrandPurpose(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder={
                      currentPreset?.defaultPurpose
                        ? `ej. ${currentPreset.defaultPurpose}`
                        : 'ej. Brindar un servicio de excelencia con atención personalizada y valor medible para nuestros clientes...'
                    }
                    className="w-full p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none leading-relaxed font-sans transition-colors placeholder:text-[var(--text-muted)] text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                    Este propósito orienta a la IA para responder con la propuesta de valor real y filosofía de tu negocio en cada mensaje.
                  </p>
                </div>

                {/* Tono de Voz con Presets Rápidos */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                    Tono de Voz Mandatorio en Respuestas de WhatsApp & Redes *
                  </label>

                  {/* Botones de sugerencias rápidas de tono */}
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TONE_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        disabled={!activeTenant}
                        onClick={() => {
                          setToneOfVoice(tpl.tone);
                          setIsDirty(true);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                          toneOfVoice === tpl.tone
                            ? 'bg-neon/15 border-neon text-lime-700 dark:text-neon font-bold shadow-sm'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-neon/40 hover:text-[var(--text-main)]'
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    disabled={!activeTenant}
                    value={toneOfVoice}
                    onChange={(e) => {
                      setToneOfVoice(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder={
                      currentPreset?.defaultTone
                        ? `ej. ${currentPreset.defaultTone}`
                        : 'ej. Profesional, empático y orientado a conversión directa'
                    }
                    className="w-full p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none font-sans text-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    Define el estilo psicológico con el que los agentes responderán las objeciones y consultas de tus clientes potenciales.
                  </p>
                </div>

                {/* Política de Uso de Emojis */}
                <div className="pt-2 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold block">
                      Política de Emojis en Respuestas
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Controla la frecuencia de emojis que la IA insertará en los mensajes de chat.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['Moderado (según contexto)', 'Estricto (Cero Emojis)', 'Expresivo (Alto Engagement)'].map((pol) => (
                      <button
                        key={pol}
                        type="button"
                        onClick={() => {
                          setEmojiPolicy(pol);
                          setIsDirty(true);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                          emojiPolicy === pol
                            ? 'bg-neon/20 border-neon text-black dark:text-white font-bold'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {pol}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: PILARES DE CONOCIMIENTO & REGLAS INVIOLABLES */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-lime-700 dark:text-neon" />
                  <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                    3. Directrices de Conocimiento & Reglas Inviolables
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-lime-700 dark:text-neon font-bold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/20">
                  {inviolableRules.length} Reglas Activas
                </span>
              </div>

              {/* Resumen de los 4 Pilares de Operación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] font-mono text-lime-700 dark:text-neon font-bold uppercase block">
                    Pilar 1: Financiero
                  </span>
                  <p className="text-[11px] text-[var(--text-main)] font-semibold">
                    CAC Máx: {activeTenant?.leadPriceMXN ? `$${activeTenant.leadPriceMXN} MXN` : (activeTenant?.cacMax || 'Sin definir')}
                  </p>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                    Datos aislados por negocio
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase block">
                    Pilar 2: Identidad & Reglas
                  </span>
                  <p className="text-[11px] text-[var(--text-main)] font-semibold truncate">
                    {toneOfVoice ? toneOfVoice.split(',')[0] : (activeTenant ? 'Por configurar' : 'Sin configurar')}
                  </p>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                    Límites de seguridad activos
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase block">
                    Pilar 3: Protocolo Crisis
                  </span>
                  <p className="text-[11px] text-[var(--text-main)] font-semibold">
                    Latencia: Sub-segundo (&lt; 1.2s)
                  </p>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                    Detección Profeco / Quejas
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase block">
                    Pilar 4: Conversión & Leads
                  </span>
                  <p className="text-[11px] text-[var(--text-main)] font-semibold">
                    4/4 Criterios Calificados
                  </p>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                    Consentimiento & Teléfono
                  </span>
                </div>
              </div>

              {/* Editor compartido de Reglas Inviolables */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <InviolableRulesEditor
                  rules={inviolableRules}
                  onChange={(nextRules) => {
                    setInviolableRules(nextRules);
                    setIsDirty(true);
                  }}
                  title="Reglas Inviolables de Atención"
                  subtitle="Directrices inquebrantables que la IA respetará obligatoriamente en todas las interacciones."
                  placeholder="Escribe una regla estricta (ej. Jamás prometer descuentos superiores al 15% sin autorización)..."
                  disabled={!activeTenant}
                />
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PESTAÑA 3: ESTRATEGIA COMERCIAL (OFERTA, BUYER PERSONA & 4 Ps)      */}
        {/* =================================================================== */}
        {activeTab === 'strategy' && (
          <div className="space-y-6 animate-fade-in">
            {/* SECCIÓN 4: PROPUESTA COMERCIAL & GANCHO DE CAPTACIÓN */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-lime-700 dark:text-neon" />
                  <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                    4. Propuesta Comercial & Gancho de Captación
                  </h3>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon/10 text-lime-700 dark:text-neon font-bold">
                  Oferta Activa de Conversión
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                    Gancho Principal (Offer Hook)
                  </label>
                  <input
                    type="text"
                    value={offerHook}
                    onChange={(e) => {
                      setOfferHook(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="ej. Diagnóstico inicial sin costo / Masterclass exclusiva / Descuento de bienvenida"
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                  />
                  <span className="text-[9px] font-mono text-[var(--text-muted)] mt-1 block">
                    El beneficio irresistible que la IA presentará al prospecto.
                  </span>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                    Llamada a la Acción (CTA)
                  </label>
                  <input
                    type="text"
                    value={offerCta}
                    onChange={(e) => {
                      setOfferCta(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="ej. Agenda tu sesión estratégica por WhatsApp / Solicita tu catálogo oficial"
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                  />
                  <span className="text-[9px] font-mono text-[var(--text-muted)] mt-1 block">
                    La acción precisa que se le pide realizar al lead.
                  </span>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                    Vigencia o Condición de Urgencia
                  </label>
                  <input
                    type="text"
                    value={offerValidity}
                    onChange={(e) => {
                      setOfferValidity(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="ej. Cupo limitado a los primeros 20 clientes registrados este mes"
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                  />
                  <span className="text-[9px] font-mono text-[var(--text-muted)] mt-1 block">
                    Condición que acelera la toma de decisión del lead.
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 5: DELIMITACIÓN DEL BUYER PERSONA & MARKETING MIX (4 Ps) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5 shadow-sm font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-lime-700 dark:text-neon" />
                  <div>
                    <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                      5. Delimitación del Buyer Persona & Marketing Mix (4 Ps)
                    </h3>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      Extraído del manual de identidad para alimentar el asistente y los guiones de venta
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-neon/10 text-lime-700 dark:text-neon font-mono text-[10px] font-bold border border-neon/20 self-start sm:self-auto">
                  Calificación Comercial & AIDA
                </span>
              </div>

              <BuyerPersona4PsForm
                buyerPersona={buyerPersona}
                marketingMix4P={marketingMix4P}
                onChangeBuyerPersona={(next) => {
                  setBuyerPersona(next);
                  setIsDirty(true);
                }}
                onChangeMarketingMix4P={(next) => {
                  setMarketingMix4P(next);
                  setIsDirty(true);
                }}
                onApplyAiInference={() => {
                  setIsDirty(true);
                  try {
                    confetti({
                      particleCount: 50,
                      spread: 60,
                      colors: ['#E7F900', '#06B6D4', '#FFFFFF'],
                    });
                  } catch (e) {}
                }}
                tenant={activeTenant}
                contextOverrides={{
                  brandPurpose,
                  toneOfVoice,
                  offerHook,
                  offerCta,
                  offerValidity,
                  inviolableRules,
                  socialLinks,
                }}
                disabled={!activeTenant}
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PESTAÑA 4: OPERACIONES, SLA & CANALES CONECTADOS                    */}
        {/* =================================================================== */}
        {activeTab === 'ops' && (
          <div className="space-y-6 animate-fade-in">
            {/* SECCIÓN 6: POLÍTICA DE CONTACTABILIDAD & SLA DE ATENCIÓN */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-lime-700 dark:text-neon" />
                  <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                    6. Contactabilidad, SLA & Atención Humana
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-lime-700 dark:text-neon font-bold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/20">
                  SLA Máximo: {slaTarget} Minutos
                </span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Teléfono de Escalación Humana */}
                  <div>
                    <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                      Teléfono / WhatsApp de Escalación Humana (10 dígitos) *
                    </label>
                    <input
                      type="tel"
                      maxLength={14}
                      required
                      value={ownerPhone}
                      onChange={(e) => {
                        setOwnerPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                        setIsDirty(true);
                      }}
                      placeholder="55 1234 5678 (10 dígitos)"
                      className={`w-full p-2.5 rounded-xl bg-[var(--bg-card)] border text-[var(--text-main)] focus:border-neon outline-none font-mono text-xs ${
                        phoneError ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-[10px] font-mono text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1.5 font-bold animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{phoneError}</span>
                      </p>
                    )}
                    <span className="text-[9px] font-mono text-[var(--text-muted)] mt-1 block">
                      Ingresa 10 dígitos locales. A este número se transfieren solicitudes prioritarias, quejas de clientes o prospectos que solicitan hablar con un asesor humano.
                    </span>
                  </div>

                  {/* Tiempo Máximo de Respuesta SLA */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                        Tiempo Máximo de Primera Respuesta
                      </label>
                      <div className="flex items-baseline gap-1 px-2.5 py-0.5 rounded-lg bg-neon/15 border border-neon/30 text-lime-700 dark:text-neon font-mono font-bold">
                        <span>{slaTarget}</span>
                        <span className="text-[9px]">min</span>
                      </div>
                    </div>

                    {/* Botones de Presets de SLA */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { val: 5, lbl: '5 min', sub: 'Inmediato' },
                        { val: 15, lbl: '15 min', sub: 'Óptimo ★', rec: true },
                        { val: 30, lbl: '30 min', sub: 'Estándar' },
                        { val: 60, lbl: '60 min', sub: 'Máximo' },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => {
                            setSlaTarget(preset.val);
                            setIsDirty(true);
                          }}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            slaTarget === preset.val
                              ? 'bg-neon/15 border-neon ring-1 ring-neon/40'
                              : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-neon/40'
                          }`}
                        >
                          <span className={`text-xs font-mono font-bold block ${slaTarget === preset.val ? 'text-lime-700 dark:text-neon' : 'text-[var(--text-main)]'}`}>
                            {preset.lbl}
                          </span>
                          <span className="text-[8px] font-mono text-[var(--text-muted)] block truncate">
                            {preset.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slider de ajuste fino */}
                <div className="pt-2">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={slaTarget}
                    onChange={(e) => {
                      setSlaTarget(Number(e.target.value));
                      setIsDirty(true);
                    }}
                    className="w-full accent-[#C3F400] cursor-pointer h-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[var(--text-muted)] mt-1">
                    <span>5 min (Ultra rápido)</span>
                    <span>15 min (Recomendado)</span>
                    <span>30 min</span>
                    <span>60 min (Máximo SLA)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 7: PRESENCIA DIGITAL, REDES SOCIALES & CANALES OFICIALES */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5 shadow-sm font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-lime-700 dark:text-neon" />
                  <div>
                    <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                      7. Presencia Digital & Redes Sociales Oficiales
                    </h3>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      URLs y perfiles inyectados en la Página Oficial, el Estudio de Contenido y el Asistente IA
                    </span>
                  </div>
                </div>
                <a
                  href="/connections?tab=channels"
                  className="px-3 py-1 rounded-xl bg-[var(--bg-card)] hover:bg-neon/15 text-[var(--text-muted)] hover:text-lime-700 dark:hover:text-neon border border-[var(--border-color)] hover:border-neon/40 text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Sliders className="w-3 h-3 text-lime-700 dark:text-neon" />
                  <span>Configurar Tokens de APIs & Webhooks</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Grid unificado de Redes Sociales Públicas (7 canales incluyendo X / Twitter) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                {SOCIAL_CHANNEL_FIELDS.map((field) => {
                  const Icon = field.icon;
                  const rawValue =
                    field.key === 'website'
                      ? socialLinks.website || activeTenant?.websiteUrl || ''
                      : socialLinks[field.key] || '';
                  const inputValue = socialLinks[field.key] || '';

                  return (
                    <div
                      key={field.key}
                      className={`p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 group transition-colors ${field.focusClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${field.iconColor}`} />
                          <span>{field.label}</span>
                        </label>
                        {rawValue && (
                          <a
                            href={rawValue.startsWith('http') ? rawValue : `https://${rawValue}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-[9px] font-mono ${field.linkColor} hover:underline flex items-center gap-0.5`}
                          >
                            <span>Ver</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                          setSocialLinks((prev) => ({ ...prev, [field.key]: e.target.value }));
                          setIsDirty(true);
                        }}
                        placeholder={field.placeholder}
                        className={`w-full p-2 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] outline-none font-mono text-xs ${field.inputFocusClass}`}
                      />
                      <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                        {field.helper}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Estado de Conductos de Mensajería Activos */}
              <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold block">
                  Conductos de Mensajería & Tráfico Automatizado:
                </span>
                {(() => {
                  const rawNetworks = Array.isArray(activeTenant?.connectedSocialNetworks)
                    ? activeTenant.connectedSocialNetworks.map((n) => String(n).toUpperCase())
                    : typeof activeTenant?.connectedSocialNetworks === 'string'
                    ? activeTenant.connectedSocialNetworks
                        .toUpperCase()
                        .split(',')
                        .map((s) => s.trim())
                    : [];
                  const channelsObj = activeTenant?.connectedChannels || {};
                  const isWaConnected = Boolean(
                    channelsObj.whatsapp?.connected ||
                      channelsObj.WHATSAPP?.connected ||
                      channelsObj.whatsapp?.accessToken ||
                      channelsObj.whatsapp?.phoneNumberId ||
                      rawNetworks.includes('WHATSAPP')
                  );
                  const isIgConnected = Boolean(
                    channelsObj.instagram?.connected ||
                      channelsObj.INSTAGRAM?.connected ||
                      channelsObj.instagram?.accessToken ||
                      rawNetworks.includes('INSTAGRAM')
                  );
                  const isFbConnected = Boolean(
                    channelsObj.facebook?.connected ||
                      channelsObj.FACEBOOK?.connected ||
                      channelsObj.facebook?.accessToken ||
                      rawNetworks.includes('FACEBOOK')
                  );
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isWaConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}`} />
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[var(--text-main)] block truncate">WhatsApp Cloud</span>
                          <span className={`text-[8px] font-mono font-bold ${isWaConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                            {isWaConnected ? 'Activo en Tiempo Real' : 'Sin conectar'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2">
                        <Instagram className={`w-3.5 h-3.5 shrink-0 ${isIgConnected ? 'text-pink-600 dark:text-pink-400' : 'text-[var(--text-muted)]'}`} />
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[var(--text-main)] block truncate">Instagram DM</span>
                          <span className={`text-[8px] font-mono font-bold ${isIgConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                            {isIgConnected ? 'Sincronizado' : 'Sin conectar'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2">
                        <Facebook className={`w-3.5 h-3.5 shrink-0 ${isFbConnected ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text-muted)]'}`} />
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[var(--text-main)] block truncate">Facebook Page</span>
                          <span className={`text-[8px] font-mono font-bold ${isFbConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                            {isFbConnected ? 'Conectado' : 'Sin conectar'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[var(--text-main)] block truncate">
                            {activeTenant?.hasWebsite ? 'Sitio Web' : 'Página Oficial'}
                          </span>
                          <span className="text-[8px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                            {activeTenant?.hasWebsite ? 'Analítica Activa' : 'Alojada en Vector'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* BARRA FLOTANTE DE GUARDADO CUANDO HAY CAMBIOS (Nielsen Heurística 1) */}
        {/* =================================================================== */}
        {isDirty && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-panel)]/95 backdrop-blur-md border-2 border-neon shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 animate-fade-in w-[92vw] max-w-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-lime-700 dark:text-neon shrink-0 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-[var(--text-main)] leading-tight">
                  Tienes cambios sin guardar
                </p>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Pulsa Guardar o presiona <kbd className="px-1 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-lime-700 dark:text-neon">Ctrl+S</kbd>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => resetFormFromTenant(activeTenant, currentPreset)}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono transition-colors"
              >
                Descartar
              </button>
              <button
                type="submit"
                disabled={isSaving || !activeTenant}
                className="px-4 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_rgba(195,244,0,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-black" />
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Acciones del Formulario Footer Estático (slots estables sin CLS) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-lime-700 dark:hover:text-neon flex items-center gap-1.5 transition-colors px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer Preset de Vertical</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Navegación ergonómica entre pestañas con slots estables */}
            <button
              type="button"
              disabled={isFirstTab}
              onClick={() => {
                if (!isFirstTab) setActiveTab(PROFILE_TABS[currentTabIndex - 1]);
              }}
              className="min-w-[110px] px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-mono font-bold text-xs transition-colors flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <button
              type="button"
              disabled={isLastTab}
              onClick={() => {
                if (!isLastTab) setActiveTab(PROFILE_TABS[currentTabIndex + 1]);
              }}
              className="min-w-[165px] px-4 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] font-mono font-bold text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <span>Siguiente Pestaña</span>
              <span>→</span>
            </button>

            <button
              type="submit"
              disabled={isSaving || !activeTenant}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  <span>Guardar Configuración de {activeTenant?.shortName || activeTenant?.name || 'Marca'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
