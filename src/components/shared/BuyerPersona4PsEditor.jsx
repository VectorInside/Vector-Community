'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Target, Layers } from 'lucide-react';

export const EMPTY_BUYER_PERSONA = {
  name: '',
  ageRange: '',
  maritalStatus: '',
  location: '',
  digitalHabits: '',
  mainPainPoint: '',
  buyingTrigger: '',
};

export const EMPTY_MARKETING_MIX_4P = {
  product: '',
  price: '',
  place: '',
  promotion: '',
};

const cleanMixPrefix = (value) =>
  String(value || '')
    .replace(/^[1-4]\.\s*(PRODUCTO|PRECIO|PLAZA|PROMOCI[OÓ]N)?\s*[:\-–—]?\s*/i, '')
    .trim();

const resolveAuthHeaders = (tenant) => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const tenantId =
        tenant?.id ||
        localStorage.getItem('vector_active_tenant_key') ||
        localStorage.getItem('vector_active_tenant_id');
      if (tenantId) {
        headers['X-Tenant-ID'] = tenantId;
      }
    } catch {
      // Ignorar errores de acceso a localStorage en modo privado
    }
  } else if (tenant?.id) {
    headers['X-Tenant-ID'] = tenant.id;
  }
  return headers;
};

/**
 * Formulario Dual-Theme reutilizable para los 7 campos de Buyer Persona
 * y los 4 campos de Marketing Mix (4 Ps).
 * Consumible inline (PerfilMarcaView) o dentro de modales (CommercialGrowthSuite).
 */
export const BuyerPersona4PsForm = ({
  buyerPersona = EMPTY_BUYER_PERSONA,
  marketingMix4P = EMPTY_MARKETING_MIX_4P,
  onChangeBuyerPersona,
  onChangeMarketingMix4P,
  onApplyAiInference,
  tenant = null,
  contextOverrides = {},
  showAiExtractButton = true,
  showEmptyBanner = true,
  showSectionHeaders = true,
  disabled = false,
  compact = false,
  className = '',
}) => {
  const [isInferring, setIsInferring] = useState(false);
  const [inferError, setInferError] = useState(null);

  const safePersona = {
    ...EMPTY_BUYER_PERSONA,
    ...(buyerPersona && typeof buyerPersona === 'object' ? buyerPersona : {}),
  };

  const safeMix = {
    ...EMPTY_MARKETING_MIX_4P,
    ...(marketingMix4P && typeof marketingMix4P === 'object' ? marketingMix4P : {}),
  };

  const updatePersonaField = (field, value) => {
    if (disabled || !onChangeBuyerPersona) return;
    onChangeBuyerPersona({
      ...safePersona,
      [field]: value,
    });
  };

  const updateMixField = (field, value) => {
    if (disabled || !onChangeMarketingMix4P) return;
    onChangeMarketingMix4P({
      ...safeMix,
      [field]: value,
    });
  };

  const handleAutoExtractWithAi = async () => {
    if (isInferring || disabled) return;
    setIsInferring(true);
    setInferError(null);

    try {
      const payload = {
        businessName: contextOverrides.businessName ?? tenant?.name ?? '',
        giro:
          contextOverrides.giro ??
          tenant?.giro ??
          tenant?.verticalLabel ??
          tenant?.industry ??
          '',
        brandPurpose: contextOverrides.brandPurpose ?? tenant?.brandPurpose ?? '',
        toneOfVoice: contextOverrides.toneOfVoice ?? tenant?.toneOfVoice ?? '',
        offerHook:
          contextOverrides.offerHook ?? tenant?.commercialOffer?.hook ?? '',
        offerCta:
          contextOverrides.offerCta ?? tenant?.commercialOffer?.cta ?? '',
        offerValidity:
          contextOverrides.offerValidity ?? tenant?.commercialOffer?.validity ?? '',
        inviolableRules:
          contextOverrides.inviolableRules ?? tenant?.inviolableRules ?? [],
        verticalId: contextOverrides.verticalId ?? tenant?.vertical ?? 'b2b',
        socialLinks: contextOverrides.socialLinks ?? tenant?.socialLinks ?? {},
        connectedSocialNetworks:
          contextOverrides.connectedSocialNetworks ??
          tenant?.connectedSocialNetworks ?? ['WHATSAPP', 'INSTAGRAM', 'FACEBOOK'],
      };

      const res = await fetch('/api/rag/infer-buyer', {
        method: 'POST',
        headers: resolveAuthHeaders(tenant),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const msg =
          data?.error ||
          data?.message ||
          `No se pudo completar la inferencia con IA (HTTP ${res.status}).`;
        throw new Error(msg);
      }

      if (
        !data?.buyerPersona ||
        typeof data.buyerPersona !== 'object' ||
        !data?.marketingMix4P ||
        typeof data.marketingMix4P !== 'object'
      ) {
        throw new Error(
          'El motor de IA respondió sin una estructura válida de Buyer Persona y 4 Ps.'
        );
      }

      const nextPersona = {
        name: data.buyerPersona.name || '',
        ageRange: data.buyerPersona.ageRange || '',
        maritalStatus: data.buyerPersona.maritalStatus || '',
        location: data.buyerPersona.location || '',
        digitalHabits: data.buyerPersona.digitalHabits || '',
        mainPainPoint: data.buyerPersona.mainPainPoint || '',
        buyingTrigger: data.buyerPersona.buyingTrigger || '',
      };

      const nextMix = {
        product: cleanMixPrefix(data.marketingMix4P.product),
        price: cleanMixPrefix(data.marketingMix4P.price),
        place: cleanMixPrefix(data.marketingMix4P.place),
        promotion: cleanMixPrefix(data.marketingMix4P.promotion),
      };

      if (onChangeBuyerPersona) onChangeBuyerPersona(nextPersona);
      if (onChangeMarketingMix4P) onChangeMarketingMix4P(nextMix);
      if (onApplyAiInference) {
        onApplyAiInference({
          buyerPersona: nextPersona,
          marketingMix4P: nextMix,
          source: data.source || 'deepseek_ai',
        });
      }
    } catch (err) {
      setInferError(
        err?.message ||
          'Error al consultar /api/rag/infer-buyer. Verifica la conexión e intenta de nuevo.'
      );
    } finally {
      setIsInferring(false);
    }
  };

  const isFormSparse =
    !safePersona.name.trim() ||
    !safePersona.mainPainPoint.trim() ||
    !safeMix.product.trim();

  const inputClassName =
    'w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-neon outline-none text-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className={`space-y-5 font-sans ${className}`}>
      {/* Barra opcional de Auto-Extracción IA */}
      {(showAiExtractButton || (showEmptyBanner && isFormSparse)) && (
        <div className="space-y-3">
          {showEmptyBanner && isFormSparse ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-neon/5 border border-[var(--border-color)]">
              <div className="flex items-start sm:items-center gap-2.5 text-xs text-[var(--text-muted)]">
                <Sparkles className="w-4 h-4 text-lime-700 dark:text-neon shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  Aún faltan parámetros por definir. Usa{' '}
                  <strong className="text-lime-700 dark:text-neon font-bold">
                    Auto-Extraer con IA
                  </strong>{' '}
                  para generar el Buyer Persona y las 4 Ps desde el contexto de la marca.
                </span>
              </div>
              {showAiExtractButton && (
                <button
                  type="button"
                  onClick={handleAutoExtractWithAi}
                  disabled={isInferring || disabled}
                  className="px-3.5 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isInferring ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analizando con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Extraer con IA</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            showAiExtractButton && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleAutoExtractWithAi}
                  disabled={isInferring || disabled}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon/15 hover:bg-neon/25 text-lime-700 dark:text-neon font-mono text-xs font-bold border border-neon/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInferring ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analizando con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Extraer con IA</span>
                    </>
                  )}
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Error visible inline sin fallbacks falsos */}
      {inferError && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Error en Auto-Extracción IA</span>
            <span>{inferError}</span>
          </div>
        </div>
      )}

      {/* Sección 1: 7 campos de Buyer Persona */}
      <div className="space-y-3.5">
        {showSectionHeaders && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-lime-700 dark:text-neon uppercase">
            <Target className="w-4 h-4 shrink-0" />
            <span>1. Perfil del Buyer Persona (7 Parámetros)</span>
          </div>
        )}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            compact ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
          } gap-3.5 text-xs`}
        >
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)] block">
              Nombre / Arquetipo del ICP
            </label>
            <input
              type="text"
              disabled={disabled}
              value={safePersona.name}
              onChange={(e) => updatePersonaField('name', e.target.value)}
              placeholder="Ej: Directores de Clínica / Fundadores B2B"
              className={inputClassName}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)] block">
              Rango de Edad
            </label>
            <input
              type="text"
              disabled={disabled}
              value={safePersona.ageRange}
              onChange={(e) => updatePersonaField('ageRange', e.target.value)}
              placeholder="Ej: 28 a 48 años"
              className={inputClassName}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-muted)] block">
              Estado Civil & Entorno
            </label>
            <input
              type="text"
              disabled={disabled}
              value={safePersona.maritalStatus}
              onChange={(e) => updatePersonaField('maritalStatus', e.target.value)}
              placeholder="Ej: Profesionistas / Toma de decisión familiar o directiva"
              className={inputClassName}
            />
          </div>

          <div className={compact ? 'sm:col-span-2 space-y-1' : 'sm:col-span-2 lg:col-span-3 space-y-1'}>
            <label className="text-[11px] font-bold text-[var(--text-muted)] block">
              Geolocalización & Cobertura Prioritaria
            </label>
            <input
              type="text"
              disabled={disabled}
              value={safePersona.location}
              onChange={(e) => updatePersonaField('location', e.target.value)}
              placeholder="Ej: CDMX (Polanco, Roma, Del Valle) y Área Metropolitana"
              className={inputClassName}
            />
          </div>

          <div className={compact ? 'sm:col-span-2 space-y-1' : 'sm:col-span-2 lg:col-span-3 space-y-1'}>
            <label className="text-[11px] font-bold text-[var(--text-muted)] block">
              Hábitos Digitales & Canales de Consumo
            </label>
            <input
              type="text"
              disabled={disabled}
              value={safePersona.digitalHabits}
              onChange={(e) => updatePersonaField('digitalHabits', e.target.value)}
              placeholder="Ej: WhatsApp Business, Instagram Reels, Google Search y Facebook"
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">
              Dolor Principal (Struggling Moment)
            </label>
            <textarea
              rows={2}
              disabled={disabled}
              value={safePersona.mainPainPoint}
              onChange={(e) => updatePersonaField('mainPainPoint', e.target.value)}
              placeholder="Ej: Falta de seguimiento oportuno y pérdida de prospectos por demora en respuesta"
              className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-amber-500/35 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-amber-500 outline-none text-xs leading-relaxed transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
              Disparador de Compra (Gancho Irresistible)
            </label>
            <textarea
              rows={2}
              disabled={disabled}
              value={safePersona.buyingTrigger}
              onChange={(e) => updatePersonaField('buyingTrigger', e.target.value)}
              placeholder="Ej: Diagnóstico inicial claro, transparencia de precios y cita rápida por WhatsApp"
              className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-emerald-500/35 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-emerald-500 outline-none text-xs leading-relaxed transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Sección 2: 4 campos de Marketing Mix (4 Ps) */}
      <div className="space-y-3.5 pt-4 border-t border-[var(--border-color)]">
        {showSectionHeaders && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase">
            <Layers className="w-4 h-4 shrink-0" />
            <span>2. Marketing Mix Operativo (4 Ps)</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-lime-700 dark:text-neon block">
              1. Producto (Propuesta de Valor & Alcance)
            </label>
            <textarea
              rows={2}
              disabled={disabled}
              value={safeMix.product}
              onChange={(e) => updateMixField('product', e.target.value)}
              placeholder="Servicios estrella, diferenciadores y resultado tangible para el cliente"
              className={`${inputClassName} leading-relaxed`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
              2. Precio (Aranceles, Rangos & Facilidades)
            </label>
            <textarea
              rows={2}
              disabled={disabled}
              value={safeMix.price}
              onChange={(e) => updateMixField('price', e.target.value)}
              placeholder="Rangos de inversión, membresías, MSI o esquemas de anticipo"
              className={`${inputClassName} leading-relaxed`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-blue-700 dark:text-blue-400 block">
              3. Plaza (Canales de Atención & Entrega)
            </label>
            <textarea
              rows={2}
              disabled={disabled}
              value={safeMix.place}
              onChange={(e) => updateMixField('place', e.target.value)}
              placeholder="Sucursal física, atención remota, WhatsApp, Instagram Direct y Web"
              className={`${inputClassName} leading-relaxed`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-purple-700 dark:text-purple-400 block">
              4. Promoción (Ganchos, Ofertas & CTAs)
            </label>
            <textarea
              rows={2}
              disabled={disabled}
              value={safeMix.promotion}
              onChange={(e) => updateMixField('promotion', e.target.value)}
              placeholder="Oferta de entrada, beneficios por pronto pago o vigencia mensual"
              className={`${inputClassName} leading-relaxed`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerPersona4PsForm;
