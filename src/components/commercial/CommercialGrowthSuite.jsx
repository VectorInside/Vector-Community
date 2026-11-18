'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { TriageProtocol } from '@/components/hitl/TriageProtocol';
import { ContentPlanner } from '@/components/planner/ContentPlanner';
import { Portal } from '@/components/common/Portal';
import {
  BuyerPersona4PsForm,
  EMPTY_BUYER_PERSONA,
  EMPTY_MARKETING_MIX_4P,
} from '@/components/shared/BuyerPersona4PsEditor';
import {
  Users,
  Sparkles,
  Target,
  Compass,
  Lightbulb,
  DollarSign,
  ArrowRight,
  Zap,
  MapPin,
  Clock,
  ShoppingBag,
  Tag,
  Building,
  Edit3,
  RefreshCw,
  X,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const resolveCommercialHeaders = (tenant) => {
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
      // Ignorar errores de acceso a localStorage
    }
  } else if (tenant?.id) {
    headers['X-Tenant-ID'] = tenant.id;
  }
  return headers;
};

const displayOrNd = (value) => (value && String(value).trim() ? value : 'N/D');

export const CommercialGrowthSuite = ({ initialTab = 'kanban' }) => {
  const { activeTenant, updateTenantPolicy, triggerModal, isAdmin } = useAuth();
  const [activeSuiteTab, setActiveSuiteTab] = useState(initialTab); // 'kanban' | 'studio' | 'persona_strategy'
  const [leadTariff, setLeadTariff] = useState(activeTenant?.leadPriceMXN || 350);
  const [tariffInputValue, setTariffInputValue] = useState(String(activeTenant?.leadPriceMXN || 350));
  const [tariffError, setTariffError] = useState(null);
  const [isEditingTariff, setIsEditingTariff] = useState(false);

  useEffect(() => {
    const nextTariff = activeTenant?.leadPriceMXN || 350;
    setLeadTariff(nextTariff);
    setTariffInputValue(String(nextTariff));
    setTariffError(null);
    setIsEditingTariff(false);
  }, [activeTenant]);

  // Estados para Edición In-Situ (SSOT BuyerPersona4PsForm) y Asesor de Giro
  const [isEditingPersonaModal, setIsEditingPersonaModal] = useState(false);
  const [isSavingPersona, setIsSavingPersona] = useState(false);
  const [personaSaveError, setPersonaSaveError] = useState(null);
  const [isGeneratingGiro, setIsGeneratingGiro] = useState(false);
  const [giroRecommendations, setGiroRecommendations] = useState([]);
  const [giroError, setGiroError] = useState(null);

  // Fallbacks inteligentes sin redundancias hacia Brand DNA Canvas y Oferta Comercial
  const rawPersona = activeTenant?.buyerPersona;
  const rawMix = activeTenant?.marketingMix4P;
  const brandDna = activeTenant?.brandDna || {};
  const commercialOffer = activeTenant?.commercialOffer || {};

  const buyerPersona = {
    name: rawPersona?.name || '',
    ageRange: rawPersona?.ageRange || '',
    maritalStatus: rawPersona?.maritalStatus || '',
    location: rawPersona?.location || '',
    digitalHabits: rawPersona?.digitalHabits || '',
    mainPainPoint: rawPersona?.mainPainPoint || brandDna?.icpPains || '',
    buyingTrigger: rawPersona?.buyingTrigger || commercialOffer?.hook || brandDna?.leadMagnetHook || '',
  };

  const marketingMix = {
    product: rawMix?.product || activeTenant?.brandPurpose || activeTenant?.giro || '',
    price: rawMix?.price || '',
    place: rawMix?.place || '',
    promotion:
      rawMix?.promotion ||
      (commercialOffer?.hook
        ? `${commercialOffer.hook}${commercialOffer.cta ? ` • CTA: ${commercialOffer.cta}` : ''}`
        : ''),
  };

  // Estado del modal de Edición In-Situ (separado en Buyer Persona y 4 Ps para BuyerPersona4PsForm)
  const [modalPersona, setModalPersona] = useState({ ...EMPTY_BUYER_PERSONA, ...buyerPersona });
  const [modalMix, setModalMix] = useState({ ...EMPTY_MARKETING_MIX_4P, ...marketingMix });

  // Sincronizar modal cuando cambie tenant
  useEffect(() => {
    setModalPersona({ ...EMPTY_BUYER_PERSONA, ...buyerPersona });
    setModalMix({ ...EMPTY_MARKETING_MIX_4P, ...marketingMix });
    setPersonaSaveError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTenant]);

  // Escape & Scroll Lock para el modal de Edición In-Situ
  useEffect(() => {
    if (!isEditingPersonaModal) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsEditingPersonaModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditingPersonaModal]);

  // Consultar Asesor de Giro con DeepSeek R1 (SDD §9.3)
  const handleConsultGiroAdvisor = useCallback(async (showConfetti = true) => {
    if (!activeTenant) return;
    setIsGeneratingGiro(true);
    setGiroError(null);
    try {
      const res = await fetch('/api/commercial/giro-advisor', {
        method: 'POST',
        headers: resolveCommercialHeaders(activeTenant),
        body: JSON.stringify({
          businessName: activeTenant?.name || 'tu negocio',
          giro: activeTenant?.giro || activeTenant?.verticalLabel || 'Servicios Comerciales',
          vertical: activeTenant?.vertical || 'b2b',
          brandPurpose: activeTenant?.brandPurpose || '',
          buyerPersona: buyerPersona,
          commercialOffer: commercialOffer,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success || !Array.isArray(data.recommendations)) {
        throw new Error(
          data?.error ||
            data?.message ||
            `No se pudieron generar recomendaciones estratégicas (HTTP ${res.status}).`
        );
      }

      setGiroRecommendations(data.recommendations);
      if (showConfetti) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            colors: ['#06B6D4', '#E7F900', '#A855F7'],
          });
        } catch (e) { }
      }
    } catch (err) {
      setGiroError(
        err?.message ||
          'Error al consultar el Asesor de Giro IA. Verifica la configuración e intenta nuevamente.'
      );
    } finally {
      setIsGeneratingGiro(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTenant?.id, activeTenant?.giro]);

  // Cargar recomendaciones del Asesor de Giro iniciales o desde API
  useEffect(() => {
    if (activeTenant) {
      handleConsultGiroAdvisor(false);
    } else {
      setGiroRecommendations([]);
      setGiroError(null);
    }
  }, [activeTenant?.id, activeTenant?.giro, handleConsultGiroAdvisor, activeTenant]);

  // Guardado de la Edición In-Situ en PostgreSQL
  const handleSavePersonaModal = async (e) => {
    if (e) e.preventDefault();
    if (!activeTenant?.id || !updateTenantPolicy || isSavingPersona) return;

    setIsSavingPersona(true);
    setPersonaSaveError(null);
    try {
      const res = await updateTenantPolicy(activeTenant.id, {
        buyerPersona: modalPersona,
        marketingMix4P: modalMix,
      });

      if (res && res.success === false) {
        throw new Error(
          res?.error?.response?.data?.message ||
            res?.error?.message ||
            'No se pudieron guardar los cambios en el servidor.'
        );
      }

      setIsEditingPersonaModal(false);
      triggerModal(
        'Ficha Estratégica Actualizada',
        `El Buyer Persona y las 4 Ps de <b>${activeTenant.name}</b> han sido actualizados y persistidos en tiempo real.`
      );
    } catch (err) {
      setPersonaSaveError(err?.message || 'Error al persistir Buyer Persona y 4 Ps.');
    } finally {
      setIsSavingPersona(false);
    }
  };

  const handleSaveTariff = () => {
    if (!isAdmin) return;
    const numericPrice = Number(tariffInputValue);
    if (!Number.isFinite(numericPrice) || numericPrice < 350) {
      setTariffError('Mínimo $350 MXN');
      return;
    }

    setTariffError(null);
    setLeadTariff(numericPrice);
    setIsEditingTariff(false);
    if (updateTenantPolicy && activeTenant?.id) {
      updateTenantPolicy(activeTenant.id, {
        leadPriceMXN: numericPrice,
      });
    }
    triggerModal(
      'Tarifa de Prospecto Actualizada',
      `El acuerdo comercial para <b>${activeTenant?.name || 'tu negocio'}</b> se ha fijado en <b>$${numericPrice} MXN por Prospecto Calificado</b>.`
    );
  };

  return (
    <div className="w-full p-3 sm:p-5 lg:p-6 block animate-fade-in space-y-6 font-sans min-w-0">
      {/* Header Unificado de la Suite */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-[var(--border-color)] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase text-lime-700 dark:text-neon tracking-wider">
              Suite Comercial & Estudio de Contenido Integrado
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              • {activeTenant?.avatar || '🏢'} {activeTenant?.shortName || activeTenant?.name || 'Sin negocio seleccionado'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Centro de Crecimiento: <span className="text-lime-700 dark:text-neon">Prospectos, Ventas & Contenido</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-2xl mt-0.5">
            Gestión unificada del embudo comercial, automatización de re-contacto a 24 horas y creación de contenido guiada por el Buyer Persona del negocio.
          </p>
        </div>

        {/* Tarifa Dinámica por Lead & Acciones (Protegido con isAdmin ADR-011 §6) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div id="tour-crm-tariff" className="p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-3 shadow-sm font-mono text-xs">
            <div>
              <span className="text-[9px] text-[var(--text-muted)] uppercase block">Tarifa por Prospecto</span>
              {isAdmin && isEditingTariff ? (
                <div className="space-y-1 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={tariffInputValue}
                      onChange={(e) => {
                        setTariffInputValue(e.target.value);
                        if (tariffError) setTariffError(null);
                      }}
                      min={350}
                      max={10000}
                      step={50}
                      aria-label="Tarifa por Prospecto en MXN"
                      className="w-24 px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-neon text-xs text-lime-700 dark:text-neon font-bold text-center focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveTariff}
                      className="px-2 py-0.5 rounded bg-neon text-black font-bold text-[10px]"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingTariff(false);
                        setTariffInputValue(String(leadTariff));
                        setTariffError(null);
                      }}
                      className="p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      title="Cancelar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {tariffError && (
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block">
                      {tariffError}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lime-700 dark:text-neon font-black text-sm">${leadTariff} MXN</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setTariffInputValue(String(leadTariff));
                        setTariffError(null);
                        setIsEditingTariff(true);
                      }}
                      className="text-[10px] text-[var(--text-muted)] hover:text-lime-700 dark:hover:text-neon underline"
                    >
                      Ajustar
                    </button>
                  )}
                </div>
              )}
            </div>
            <span
              className={`text-[10px] px-2 py-1 rounded-lg font-bold border ${
                Boolean(activeTenant?.metaPixelId)
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-[var(--bg-panel)] text-[var(--text-muted)] border-[var(--border-color)]'
              }`}
            >
              {Boolean(activeTenant?.metaPixelId)
                ? 'Conversiones Meta Activas'
                : 'Meta Pixel Sin Configurar'}
            </span>
          </div>
        </div>
      </header>

      {/* Navegación por Pestañas de la Suite */}
      <div id="tour-crm-tabs" className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 overflow-x-auto font-sans text-xs">
        <button
          type="button"
          onClick={() => setActiveSuiteTab('kanban')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${activeSuiteTab === 'kanban'
              ? 'bg-neon text-black shadow-[0_0_15px_var(--neon-glow)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Embudo Kanban & Prospectos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSuiteTab('studio')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${activeSuiteTab === 'studio'
              ? 'bg-neon text-black shadow-[0_0_15px_var(--neon-glow)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Estudio de Contenido Inteligente</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSuiteTab('persona_strategy')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${activeSuiteTab === 'persona_strategy'
              ? 'bg-neon text-black shadow-[0_0_15px_var(--neon-glow)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
        >
          <Target className="w-4 h-4" />
          <span>3. Buyer Persona & Asesor de Giro (4 Ps)</span>
        </button>
      </div>

      {/* VISTA 1: PIPELINE KANBAN & PROSPECTOS */}
      {activeSuiteTab === 'kanban' && (
        <div className="space-y-3.5 animate-fade-in w-full min-w-0">
          {/* Banner de Re-contacto y Automatización Dinámico según Tenant */}
          <div className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-[var(--bg-card)] to-emerald-500/10 border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`p-1.5 rounded-lg shrink-0 ${activeTenant?.isAiActive !== false
                  ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                }`}>
                <Clock className="w-3.5 h-3.5" />
              </span>
              <p className="text-[11.5px] text-[var(--text-main)] leading-relaxed">
                <strong className="font-semibold text-[var(--text-main)]">
                  Re-contacto {activeTenant?.reengagementDelayHours || 24}h {activeTenant?.isAiActive !== false ? 'Activo' : 'Pausado'}:
                </strong>{' '}
                <span className="text-[var(--text-muted)]">
                  {activeTenant?.isAiActive !== false
                    ? `Seguimiento automático de valor agregado a prospectos tras ${activeTenant?.reengagementDelayHours || 24}h de inactividad.`
                    : 'Automatización pausada para este negocio. Los prospectos no recibirán seguimiento automático.'}
                </span>
              </p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[10px] border shrink-0 self-start sm:self-auto ${activeTenant?.isAiActive !== false
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
              }`}>
              {activeTenant?.isAiActive !== false ? 'Automático Activo' : 'Pausado'}
            </span>
          </div>

          {/* Render del Tablero Kanban en Modo Integrado */}
          <TriageProtocol defaultViewMode="kanban" embedded={true} />
        </div>
      )}

      {/* VISTA 2: ESTUDIO DE CONTENIDO INTEGRADO */}
      {activeSuiteTab === 'studio' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <strong className="text-[var(--text-main)] block">
                  Estudio de Contenido Guiado por Objeciones de Venta
                </strong>
                <span className="text-[var(--text-muted)]">
                  Genera piezas, copys y hooks publicitarios alineados con el Buyer Persona de {activeTenant?.name}.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveSuiteTab('persona_strategy')}
              className="text-xs text-lime-700 dark:text-neon hover:underline font-mono font-bold"
            >
              Ver perfil del Buyer Persona →
            </button>
          </div>

          {/* Render del Planificador de Contenido en Modo Integrado */}
          <ContentPlanner embedded={true} />
        </div>
      )}

      {/* VISTA 3: BUYER PERSONA, MARKETING MIX & ASESOR DE GIRO */}
      {activeSuiteTab === 'persona_strategy' && (
        !activeTenant ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono text-xs">
            <Target className="w-10 h-10 text-lime-700 dark:text-neon opacity-40 mx-auto" />
            <h3 className="text-sm font-heading font-black text-[var(--text-main)]">Sin Negocio Seleccionado</h3>
            <p className="text-[var(--text-muted)] max-w-md mx-auto">
              Selecciona un negocio en el selector superior para consultar o definir su Buyer Persona Oficial, Matriz 4Ps y directrices de IA comercial.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Card Destacada del Buyer Persona con Acciones In-Situ */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[var(--border-color)] gap-3.5">
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-700 dark:text-pink-400 border border-pink-500/30 text-2xl shrink-0">
                    🎯
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-lime-700 dark:text-neon font-bold">
                        Manual de Identidad & Delimitación de Audiencia
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-neon/10 border border-neon/30 text-[9px] font-mono text-lime-700 dark:text-neon font-bold">
                        SSOT Activo
                      </span>
                    </div>
                    <h3 className="text-xl font-heading font-black text-[var(--text-main)]">
                      Buyer Persona Oficial: {displayOrNd(buyerPersona.name)}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Alimenta directamente los sub-bots de cierre en WhatsApp, los guiones de venta y los ganchos de contenido.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Botón Edición Rápida In-Situ + Auto-Extracción IA (BuyerPersona4PsForm) */}
                  <button
                    type="button"
                    onClick={() => {
                      setPersonaSaveError(null);
                      setIsEditingPersonaModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neon text-black font-mono font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_var(--neon-glow)] transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar / Auto-Extraer IA</span>
                  </button>

                  {/* Enlace canónico al Perfil de Marca */}
                  <Link
                    href="/profile?tab=strategy"
                    className="px-3 py-1.5 rounded-xl bg-neon/15 hover:bg-neon hover:text-black text-lime-700 dark:text-neon border border-neon/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    title="Abrir vista integral en Perfil de Marca"
                  >
                    <span>Ajustar en Perfil de Marca</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)]">
                    Giro: <strong className="text-[var(--text-main)]">{activeTenant?.giro || activeTenant?.verticalLabel || 'N/D'}</strong>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Rango de Edad</span>
                  <span className="font-bold text-[var(--text-main)] text-sm">{displayOrNd(buyerPersona.ageRange)}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Estado Civil & Perfil</span>
                  <span className="font-bold text-[var(--text-main)] text-sm">{displayOrNd(buyerPersona.maritalStatus)}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Geolocalización & Cobertura</span>
                  <span className="font-bold text-[var(--text-main)] text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-lime-700 dark:text-neon shrink-0" />
                    <span>{displayOrNd(buyerPersona.location)}</span>
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 md:col-span-2 lg:col-span-3">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Hábitos Digitales & Canales Favoritos</span>
                  <p className="text-[var(--text-main)] leading-relaxed">{displayOrNd(buyerPersona.digitalHabits)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono uppercase font-bold block">Dolor Principal (Struggling Moment)</span>
                  <p className="text-[var(--text-main)] leading-relaxed">{displayOrNd(buyerPersona.mainPainPoint)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono uppercase font-bold block">Disparador de Compra Inmediata</span>
                  <p className="text-[var(--text-main)] leading-relaxed">{displayOrNd(buyerPersona.buyingTrigger)}</p>
                </div>
              </div>
            </div>

            {/* Marketing Mix: Estructura Operativa de las 4 Ps */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border-color)] gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-lime-700 dark:text-neon font-bold">
                    Estructura Estratégica
                  </span>
                  <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                    Marketing Mix Operativo (4 Ps)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Directrices activas de oferta, monetización y distribución para el equipo comercial y los agentes de IA.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPersonaSaveError(null);
                    setIsEditingPersonaModal(true);
                  }}
                  className="text-xs font-mono text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto font-bold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ajustar 4 Ps</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                  <div className="flex items-center gap-2 text-lime-700 dark:text-neon font-bold font-mono text-[11px]">
                    <ShoppingBag className="w-4 h-4" />
                    <span>1. PRODUCTO (Propuesta de Valor)</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">{displayOrNd(marketingMix.product)}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-[11px]">
                    <DollarSign className="w-4 h-4" />
                    <span>2. PRECIO (Esquema Comercial del Cliente)</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">{displayOrNd(marketingMix.price)}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold font-mono text-[11px]">
                    <Building className="w-4 h-4" />
                    <span>3. PLAZA (Distribución Omnicanal)</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">{displayOrNd(marketingMix.place)}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold font-mono text-[11px]">
                    <Tag className="w-4 h-4" />
                    <span>4. PROMOCIÓN (Oferta del Mes Activa)</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">{displayOrNd(marketingMix.promotion)}</p>
                </div>
              </div>
            </div>

            {/* Asesor de Giro: Mejora Continua Dinámica con DeepSeek R1 */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-neon/10 via-[var(--bg-card)] to-cyan-500/10 border-2 border-neon/40 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-lime-700 dark:text-neon font-bold">
                  <Compass className="w-5 h-5 shrink-0" />
                  <div>
                    <h3 className="text-base font-heading font-black uppercase tracking-wider text-[var(--text-main)]">
                      Asesor de Mejora Continua: ¿Hacia dónde dirigir el negocio?
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-normal">
                      Recomendaciones estratégicas generadas por DeepSeek R1 adaptadas al giro de <strong>{activeTenant?.name}</strong>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConsultGiroAdvisor(true)}
                  disabled={isGeneratingGiro}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-panel)] hover:bg-neon hover:text-black text-lime-700 dark:text-neon border border-neon/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-50"
                >
                  {isGeneratingGiro ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Consultando R1...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerar con IA</span>
                    </>
                  )}
                </button>
              </div>

              {giroError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Error al consultar Asesor de Giro IA</span>
                    <span>{giroError}</span>
                  </div>
                </div>
              )}

              {giroRecommendations && giroRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-sans">
                  {giroRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon/40 transition-all flex flex-col justify-between gap-3 shadow-sm group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                            {rec.metric || '+25% Impacto'}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                            {rec.source}
                          </span>
                        </div>
                        <span className="font-bold text-[var(--text-main)] text-sm flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          {rec.title}
                        </span>
                        <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                          {rec.action || rec.diagnosis}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-2">
                        {rec.ctaType === 'studio' ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                sessionStorage.setItem(
                                  'vector_studio_prefill_topic',
                                  rec.studioTopic || rec.title
                                );
                              }
                              setActiveSuiteTab('studio');
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-neon text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:shadow-[0_0_12px_var(--neon-glow)] transition-all font-mono"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{rec.ctaLabel || 'Crear en el Estudio →'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const suggestion = rec.action || rec.diagnosis || rec.title || '';
                              setModalMix((prev) => ({
                                ...prev,
                                ...(rec.ctaType === 'pricing'
                                  ? { price: suggestion }
                                  : rec.ctaType === 'service'
                                  ? { product: suggestion }
                                  : { promotion: suggestion }),
                              }));
                              setPersonaSaveError(null);
                              setIsEditingPersonaModal(true);
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs flex items-center justify-center gap-1.5 transition-all font-mono"
                          >
                            <Zap className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                            <span>{rec.ctaLabel || 'Aplicar al Negocio'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-dashed border-[var(--border-color)] text-center space-y-3 text-xs font-sans">
                  <Lightbulb className="w-6 h-6 text-lime-700 dark:text-neon mx-auto opacity-80" />
                  <div className="space-y-1">
                    <p className="font-bold text-[var(--text-main)]">
                      Aún no hay recomendaciones generadas para este giro
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] max-w-md mx-auto">
                      Consulta al Asesor IA con DeepSeek R1 para recibir oportunidades personalizadas de pricing, catálogo y contenido para {activeTenant?.name}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleConsultGiroAdvisor(true)}
                    disabled={isGeneratingGiro}
                    className="px-4 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs inline-flex items-center gap-1.5 hover:shadow-[0_0_12px_var(--neon-glow)] transition-all disabled:opacity-50"
                  >
                    {isGeneratingGiro ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Consultando Asesor IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Consultar Asesor IA</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* MODAL IN-SITU: EDICIÓN RÁPIDA CON <BuyerPersona4PsForm /> + <Portal> + Escape + Scroll Lock */}
      {isEditingPersonaModal && (
        <Portal>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ajuste In-Situ: Buyer Persona y Matriz 4 Ps"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditingPersonaModal(false);
            }}
          >
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                    <Edit3 className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                      Ajuste In-Situ: Buyer Persona & Matriz 4 Ps
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Modifica directamente los parámetros del cliente ideal y las directrices comerciales para {activeTenant?.name}.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingPersonaModal(false)}
                  className="p-2 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  title="Cerrar modal (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePersonaModal} className="space-y-6">
                <BuyerPersona4PsForm
                  buyerPersona={modalPersona}
                  marketingMix4P={modalMix}
                  onChangeBuyerPersona={setModalPersona}
                  onChangeMarketingMix4P={setModalMix}
                  tenant={activeTenant}
                  showAiExtractButton={true}
                  showEmptyBanner={true}
                  showSectionHeaders={true}
                />

                {personaSaveError && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <span>{personaSaveError}</span>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setIsEditingPersonaModal(false)}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPersona}
                    className="px-5 py-2 rounded-xl bg-neon text-black text-xs font-mono font-bold flex items-center gap-2 hover:shadow-[0_0_15px_var(--neon-glow)] transition-all disabled:opacity-50"
                  >
                    {isSavingPersona ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar Parámetros</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
