'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  resolveBrandPreset,
  TENANT_BRAND_PRESETS,
  QUICK_TONE_TEMPLATES,
  BRAND_AVATAR_PRESETS,
} from '@/utils/brandPresets';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  Building,
  Target,
  Palette,
  Check,
  Smartphone,
  Globe,
  Share2,
  RefreshCw,
  Plus,
  Trash2,
  MessageSquare,
  Instagram,
  Facebook,
  Video,
  Linkedin,
  FileText,
  AlertCircle,
  ArrowRight,
  Lock,
  Sliders,
  Eye,
  Copy,
  Zap,
  Layers,
  ShieldAlert,
} from 'lucide-react';

export const PerfilMarcaView = () => {
  const {
    activeTenant,
    activeTenantKey,
    tenantsData,
    switchTenantContext,
    updateTenantPolicy,
    triggerModal,
    isAdmin,
    isClient,
  } = useAuth();

  // Resolver preset inteligente según vertical o ID del tenant activo
  const currentPreset = useMemo(() => {
    return resolveBrandPreset(activeTenant || activeTenantKey);
  }, [activeTenant, activeTenantKey]);

  // Form State sincronizado desde activeTenant
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
  const [newRuleInput, setNewRuleInput] = useState('');

  // Buyer Persona
  const [buyerName, setBuyerName] = useState('');
  const [buyerAgeRange, setBuyerAgeRange] = useState('');
  const [buyerMaritalStatus, setBuyerMaritalStatus] = useState('');
  const [buyerLocation, setBuyerLocation] = useState('');
  const [buyerHabits, setBuyerHabits] = useState('');
  const [buyerPainPoint, setBuyerPainPoint] = useState('');
  const [buyerBuyingTrigger, setBuyerBuyingTrigger] = useState('');

  // Marketing Mix 4 Ps
  const [mixProduct, setMixProduct] = useState('');
  const [mixPrice, setMixPrice] = useState('');
  const [mixPlace, setMixPlace] = useState('');
  const [mixPromotion, setMixPromotion] = useState('');

  // Categoría activa de selector de avatar
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState(0);

  // Estados de retroalimentación
  const [savedNotification, setSavedNotification] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Sincronizar estado cuando cambie el negocio activo (activeTenant o activeTenantKey)
  useEffect(() => {
    if (activeTenant) {
      setBrandPurpose(
        activeTenant.brandPurpose ||
          currentPreset.defaultPurpose ||
          'Brindar un servicio de excelencia con atención personalizada y valor medible para nuestros clientes.'
      );
      setToneOfVoice(activeTenant.toneOfVoice || currentPreset.defaultTone);
      setEmojiPolicy(activeTenant.emojiPolicy || 'Moderado (según contexto)');
      setSlaTarget(activeTenant.slaTarget || 15);
      setBrandColors(
        activeTenant.brandColors && activeTenant.brandColors.length > 0
          ? activeTenant.brandColors
          : currentPreset.colors
      );
      setCustomAvatar(activeTenant.avatar || currentPreset.avatar || '🏢');
      setOwnerPhone(activeTenant.phone || '');

      // Oferta comercial
      setOfferHook(activeTenant.commercialOffer?.hook || '');
      setOfferCta(activeTenant.commercialOffer?.cta || '');
      setOfferValidity(activeTenant.commercialOffer?.validity || '');

      // Reglas inviolables
      setInviolableRules(
        Array.isArray(activeTenant.inviolableRules) && activeTenant.inviolableRules.length > 0
          ? activeTenant.inviolableRules
          : [
              'No inventar promociones o precios fuera de la matriz oficial.',
              'Derivar reclamos de cobro a un ejecutivo humano en menos de 15 minutos.',
            ]
      );

      // Buyer Persona & Marketing Mix (4 Ps)
      setBuyerName(activeTenant.buyerPersona?.name || 'Cliente Ideal Calificado');
      setBuyerAgeRange(activeTenant.buyerPersona?.ageRange || '28 a 45 años');
      setBuyerMaritalStatus(activeTenant.buyerPersona?.maritalStatus || 'Profesionista / Familiar');
      setBuyerLocation(activeTenant.buyerPersona?.location || 'Zona Metropolitana & CP Local');
      setBuyerHabits(activeTenant.buyerPersona?.digitalHabits || 'Instagram, TikTok y WhatsApp');
      setBuyerPainPoint(activeTenant.buyerPersona?.mainPainPoint || 'Falta de claridad en costos y desconfianza');
      setBuyerBuyingTrigger(activeTenant.buyerPersona?.buyingTrigger || 'Garantía, atención inmediata y facilidades de pago');

      setMixProduct(activeTenant.marketingMix4P?.product || '');
      setMixPrice(activeTenant.marketingMix4P?.price || '');
      setMixPlace(activeTenant.marketingMix4P?.place || '');
      setMixPromotion(activeTenant.marketingMix4P?.promotion || '');

      setIsDirty(false);
    }
  }, [activeTenantKey, activeTenant, currentPreset]);

  // Manejador de guardado persistente
  const handleSave = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (updateTenantPolicy && (activeTenantKey || activeTenant?.id)) {
      const targetKey = activeTenantKey || activeTenant?.id;
      updateTenantPolicy(targetKey, {
        brandPurpose,
        toneOfVoice,
        emojiPolicy,
        slaTarget,
        brandColors,
        avatar: customAvatar,
        phone: ownerPhone,
        commercialOffer: {
          ...(activeTenant?.commercialOffer || {}),
          hook: offerHook,
          cta: offerCta,
          validity: offerValidity,
        },
        inviolableRules,
        buyerPersona: {
          name: buyerName,
          ageRange: buyerAgeRange,
          maritalStatus: buyerMaritalStatus,
          location: buyerLocation,
          digitalHabits: buyerHabits,
          mainPainPoint: buyerPainPoint,
          buyingTrigger: buyerBuyingTrigger,
        },
        marketingMix4P: {
          product: mixProduct,
          price: mixPrice,
          place: mixPlace,
          promotion: mixPromotion,
        },
      });

      setIsDirty(false);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 4000);
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
    buyerName,
    buyerAgeRange,
    buyerMaritalStatus,
    buyerLocation,
    buyerHabits,
    buyerPainPoint,
    buyerBuyingTrigger,
    mixProduct,
    mixPrice,
    mixPlace,
    mixPromotion,
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

  // Agregar Regla Inviolable
  const handleAddRule = () => {
    if (!newRuleInput.trim()) return;
    setInviolableRules((prev) => [...prev, newRuleInput.trim()]);
    setNewRuleInput('');
    setIsDirty(true);
  };

  // Eliminar Regla Inviolable
  const handleDeleteRule = (index) => {
    setInviolableRules((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Lista de tenants disponibles para cambio rápido de contexto
  const tenantList = useMemo(() => {
    if (!tenantsData) return [];
    return Object.values(tenantsData);
  }, [tenantsData]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 font-sans pb-28">
      {/* =================================================================== */}
      {/* HEADER PRINCIPAL & SELECTOR DE TENANT ACTIVO                        */}
      {/* =================================================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-5 gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-extrabold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/30">
              IDENTIDAD & ADN DE MARCA
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
              <span>{currentPreset.canonicalId || 'V00'}</span>
              <span>•</span>
              <span>{activeTenant?.giro || activeTenant?.verticalLabel || 'Servicios Profesionales'}</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado con Memoria RAG & PostgreSQL RLS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)] flex items-center gap-2.5 truncate">
              <span className="text-3xl select-none">{customAvatar}</span>
              <span className="truncate">{activeTenant?.name || 'Perfil de Marca'}</span>
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
                value={activeTenantKey || activeTenant?.id}
                onChange={(e) => switchTenantContext && switchTenantContext(e.target.value)}
                className="bg-transparent text-[var(--text-main)] font-bold outline-none cursor-pointer pr-2 text-xs"
              >
                {tenantList.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[var(--bg-panel)] text-[var(--text-main)]">
                    {t.avatar || '🏢'} {t.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono">
              <span className="text-base">{customAvatar || activeTenant?.avatar || '🏢'}</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Espacio de Negocio:</span>
                <strong className="text-[var(--text-main)]">{activeTenant?.shortName || activeTenant?.name}</strong>
              </div>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded bg-neon/10 text-neon font-bold uppercase border border-neon/20">
                {activeTenant?.giro}
              </span>
            </div>
          )}

          {savedNotification && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold animate-fade-in shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Cambios Guardados con Éxito</span>
            </div>
          )}
        </div>
      </div>

      {/* Formulario Principal de Configuración */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* =================================================================== */}
        {/* SECCIÓN 1: IDENTIDAD VISUAL DEL NEGOCIO                             */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                1. Identidad Visual del Negocio
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Activos aplicados en Micro-Landing, Meta Pixel y Respuestas
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
                  <span className="text-[9px] font-mono text-neon font-bold">
                    Activo en Micro-Landing & WhatsApp
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mt-2">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-panel)] border-2 border-neon/40 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_15px_rgba(195,244,0,0.15)]">
                    {customAvatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-base text-[var(--text-main)] truncate">
                      {activeTenant?.name}
                    </p>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] block truncate">
                      {activeTenant?.legalNameTaxId || activeTenant?.shortName || activeTenant?.name}
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
                    <span className="text-[9px] font-mono px-2 py-0.2 rounded bg-neon/10 text-neon font-bold">
                      5 Tonos
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBrandColors(currentPreset.colors);
                      setIsDirty(true);
                    }}
                    className="text-[9px] font-mono text-neon hover:underline flex items-center gap-1"
                    title="Restablecer a los colores recomendados de este giro"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Restablecer de Vertical
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 my-2">
                  {brandColors.map((color, idx) => (
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
                        className="text-[8px] font-mono font-bold text-[var(--text-main)] uppercase hover:text-neon transition-colors flex items-center gap-0.5"
                        title="Click para copiar HEX"
                      >
                        <span>{color.hex}</span>
                        {copiedHex === color.hex && <Check className="w-2.5 h-2.5 text-neon" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[var(--text-muted)]">Aplicado en botones y micro-landing:</span>
                <span className="font-bold text-neon flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Contraste WCAG AAA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECCIÓN 2: PROPÓSITO DE MARCA & TONO DE VOZ DE IA                   */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                2. Propósito de Marca (Círculo Dorado) & Tono de Voz
              </h3>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon/10 text-neon border border-neon/30 font-bold">
              Inyectado como Contexto Base en IA (ADR-001)
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Propósito Central */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
                  <span>Propósito Central del Negocio (El "Por Qué") *</span>
                </label>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {brandPurpose.length} caracteres
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={brandPurpose}
                onChange={(e) => {
                  setBrandPurpose(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="ej. Democratizar la salud bucal con tecnología avanzada sin dolor y máxima empatía hacia nuestros pacientes..."
                className="w-full p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none leading-relaxed font-sans transition-colors placeholder:text-[var(--text-muted)] text-xs"
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
                    onClick={() => {
                      setToneOfVoice(tpl.tone);
                      setIsDirty(true);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all border ${
                      toneOfVoice === tpl.tone
                        ? 'bg-neon/15 border-neon text-neon font-bold shadow-sm'
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
                value={toneOfVoice}
                onChange={(e) => {
                  setToneOfVoice(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="ej. Cálido, profesional, empático y médico-clínico (sin tecnicismos alarmistas)"
                className="w-full p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none font-sans text-xs transition-colors"
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
              <div className="flex items-center gap-1.5">
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

        {/* =================================================================== */}
        {/* SECCIÓN 3: PROPUESTA COMERCIAL & GANCHO DE CAPTACIÓN (DEL WIZARD)   */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                3. Propuesta Comercial & Gancho de Captación
              </h3>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon/10 text-neon font-bold">
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
                placeholder="ej. Primera Consulta y Escaneo 3D Sin Costo"
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
                placeholder="ej. Agenda tu cita de cortesía por WhatsApp"
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
                placeholder="ej. Cupo limitado a los primeros 15 pacientes del mes"
                className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
              />
              <span className="text-[9px] font-mono text-[var(--text-muted)] mt-1 block">
                Condición que acelera la toma de decisión del lead.
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECCIÓN 4: 4 PILARES RAG & REGLAS INVIOLABLES                       */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                4. Memoria RAG & Reglas Inviolables
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neon font-bold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/20">
              {inviolableRules.length} Reglas Activas
            </span>
          </div>

          {/* Resumen de los 4 Pilares RAG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono text-neon font-bold uppercase block">
                Pilar 1: Financiero
              </span>
              <p className="text-[11px] text-[var(--text-main)] font-semibold">
                CAC Máx: {activeTenant?.cacMax || '$200 MXN'}
              </p>
              <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                Aislamiento RLS en PostgreSQL
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                Pilar 2: Identidad & Reglas
              </span>
              <p className="text-[11px] text-[var(--text-main)] font-semibold truncate">
                {toneOfVoice.split(',')[0]}
              </p>
              <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                Guardrails activados
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
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
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
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

          {/* Gestor interactivo de Reglas Inviolables */}
          <div className="pt-2 border-t border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block">
                Reglas Inviolables (Límites Estrictos para la IA)
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)]">
                La IA jamás violará estas directivas
              </span>
            </div>

            {/* Lista de Reglas */}
            <div className="space-y-1.5">
              {inviolableRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <Lock className="w-3.5 h-3.5 text-neon shrink-0 mt-0.5" />
                    <span className="text-[11px] text-[var(--text-main)] font-mono leading-tight">
                      {rule}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(idx)}
                    className="text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-colors shrink-0"
                    title="Eliminar regla"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input para agregar nueva regla */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newRuleInput}
                onChange={(e) => setNewRuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRule();
                  }
                }}
                placeholder="Escribe una regla estricta (ej. Jamás prometer descuentos superiores al 15% sin autorización)..."
                className="flex-1 p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddRule}
                disabled={!newRuleInput.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-neon/15 hover:bg-neon text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all border border-neon/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Regla</span>
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECCIÓN 5: DELIMITACIÓN DEL BUYER PERSONA & MARKETING MIX (4 Ps)    */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-6 shadow-sm font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-neon" />
              <div>
                <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                  5. Delimitación del Buyer Persona & Marketing Mix (4 Ps)
                </h3>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Extraído del manual de identidad para alimentar el bot y los copys de venta
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-neon/10 text-neon font-mono text-[10px] font-bold border border-neon/20 self-start sm:self-auto">
              Auditoría BANT & AIDA
            </span>
          </div>

          {/* Formulario del Buyer Persona */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-neon uppercase">
              <span>🎯 Perfil Demográfico & Psicográfico</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">Nombre del Arquetipo</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => {
                    setBuyerName(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">Rango de Edad</label>
                <input
                  type="text"
                  value={buyerAgeRange}
                  onChange={(e) => {
                    setBuyerAgeRange(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">Estado Civil & Entorno</label>
                <input
                  type="text"
                  value={buyerMaritalStatus}
                  onChange={(e) => {
                    setBuyerMaritalStatus(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">Geolocalización & Códigos Postales Prioritarios</label>
                <input
                  type="text"
                  value={buyerLocation}
                  onChange={(e) => {
                    setBuyerLocation(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">Hábitos Digitales & Canales de Consumo</label>
                <input
                  type="text"
                  value={buyerHabits}
                  onChange={(e) => {
                    setBuyerHabits(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-1 lg:col-span-1.5">
                <label className="text-[11px] font-bold text-amber-400">Dolor Principal (Struggling Moment)</label>
                <textarea
                  rows={2}
                  value={buyerPainPoint}
                  onChange={(e) => {
                    setBuyerPainPoint(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-amber-500/30 text-[var(--text-main)] focus:border-amber-400 outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1 sm:col-span-1 lg:col-span-1.5">
                <label className="text-[11px] font-bold text-emerald-400">Disparador de Compra (Gancho Irresistible)</label>
                <textarea
                  rows={2}
                  value={buyerBuyingTrigger}
                  onChange={(e) => {
                    setBuyerBuyingTrigger(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-emerald-500/30 text-[var(--text-main)] focus:border-emerald-400 outline-none text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Formulario del Marketing Mix (4 Ps) */}
          <div className="space-y-4 pt-3 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
              <span>📦 Estructura del Marketing Mix (4 Ps Oficiales)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">1. PRODUCTO (Propuesta de Valor & Alcance)</label>
                <textarea
                  rows={2}
                  value={mixProduct}
                  onChange={(e) => {
                    setMixProduct(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">2. PRECIO (Aranceles, Rangos & MSI)</label>
                <textarea
                  rows={2}
                  value={mixPrice}
                  onChange={(e) => {
                    setMixPrice(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">3. PLAZA (Canales de Entrega & Locaciones)</label>
                <textarea
                  rows={2}
                  value={mixPlace}
                  onChange={(e) => {
                    setMixPlace(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--text-muted)]">4. PROMOCIÓN (Ofertas del Mes, Cupones & 2x1)</label>
                <textarea
                  rows={2}
                  value={mixPromotion}
                  onChange={(e) => {
                    setMixPromotion(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECCIÓN 6: POLÍTICA DE CONTACTABILIDAD & SLA DE ATENCIÓN            */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                6. Contactabilidad, SLA & Atención Humana
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neon font-bold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/20">
              SLA Máximo: {slaTarget} Minutos
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono de Escalación Humana */}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                  Teléfono / WhatsApp de Escalación Humana *
                </label>
                <input
                  type="text"
                  required
                  value={ownerPhone}
                  onChange={(e) => {
                    setOwnerPhone(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="+52 55 1234 5678"
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none font-mono text-xs"
                />
                <span className="text-[9px] font-mono text-[var(--text-muted)] mt-1 block">
                  A este número se transfieren emergencias médicas, quejas de clientes o prospectos que solicitan hablar con un humano.
                </span>
              </div>

              {/* Tiempo Máximo de Respuesta SLA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                    Tiempo Máximo de Primera Respuesta
                  </label>
                  <div className="flex items-baseline gap-1 px-2.5 py-0.5 rounded-lg bg-neon/15 border border-neon/30 text-neon font-mono font-bold">
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
                      <span className={`text-xs font-mono font-bold block ${slaTarget === preset.val ? 'text-neon' : 'text-[var(--text-main)]'}`}>
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
                className="w-full accent-neon cursor-pointer h-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]"
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
        {/* =================================================================== */}
        {/* SECCIÓN 7: CANALES OFICIALES CONECTADOS                             */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                7. Canales Oficiales del Negocio
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Atribución directa Meta & Web
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">WhatsApp Cloud</p>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">Activo</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <Instagram className="w-4 h-4 text-pink-500" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">Instagram DM</p>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">Sincronizado</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <Facebook className="w-4 h-4 text-blue-500" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">Facebook Page</p>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">Conectado</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">
                  {activeTenant?.hasWebsite ? 'Sitio Web' : 'Micro-Landing'}
                </p>
                <span className="text-[9px] font-mono text-cyan-400 font-bold">
                  {activeTenant?.hasWebsite ? 'GA4 Activo' : 'Alojada en Vector'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* BARRA FLOTANTE DE GUARDADO CUANDO HAY CAMBIOS (Nielsen Heurística 1) */}
        {/* =================================================================== */}
        {isDirty && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-50 p-4 rounded-2xl bg-[var(--bg-panel)]/95 backdrop-blur-md border-2 border-neon shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4 animate-fade-in max-w-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-neon shrink-0 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-[var(--text-main)] leading-tight">
                  Tienes cambios sin guardar
                </p>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Pulsa Guardar o presiona <kbd className="px-1 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-neon">Ctrl+S</kbd>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  // Revertir a lo que tiene activeTenant
                  if (activeTenant) {
                    setBrandPurpose(activeTenant.brandPurpose || currentPreset.defaultPurpose);
                    setToneOfVoice(activeTenant.toneOfVoice || currentPreset.defaultTone);
                    setBrandColors(activeTenant.brandColors || currentPreset.colors);
                    setCustomAvatar(activeTenant.avatar || currentPreset.avatar || '🏢');
                    setSlaTarget(activeTenant.slaTarget || 15);
                    setIsDirty(false);
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono transition-colors"
              >
                Descartar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_rgba(195,244,0,0.4)] active:scale-95"
              >
                <Save className="w-3.5 h-3.5 text-black" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        )}

        {/* Acciones del Formulario Footer Estático */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-neon flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer valores predeterminados de la vertical</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95"
          >
            <Save className="w-4 h-4 text-black" />
            <span>Guardar Configuración de {activeTenant?.shortName || activeTenant?.name || 'Marca'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
