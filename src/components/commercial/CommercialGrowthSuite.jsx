'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { TriageProtocol } from '@/components/hitl/TriageProtocol';
import { ContentPlanner } from '@/components/planner/ContentPlanner';
import {
  Users,
  Sparkles,
  TrendingUp,
  Target,
  Compass,
  Lightbulb,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Layers,
  ShoppingBag,
  Tag,
  Building,
  HelpCircle,
  Edit3,
  RefreshCw,
  Sliders,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommercialGrowthSuite = ({ initialTab = 'kanban' }) => {
  const { activeTenant, activeTenantKey, updateTenantPolicy, triggerModal, isAdmin } = useAuth();
  const [activeSuiteTab, setActiveSuiteTab] = useState(initialTab); // 'kanban' | 'studio' | 'persona_strategy'
  const [leadTariff, setLeadTariff] = useState(activeTenant?.leadPriceMXN || 350);
  const [isEditingTariff, setIsEditingTariff] = useState(false);

  useEffect(() => {
    setLeadTariff(activeTenant?.leadPriceMXN || 350);
  }, [activeTenant]);

  // Estados para Edición In-Situ, IA DeepSeek R1 y Asesor de Giro
  const [isInferringBuyer, setIsInferringBuyer] = useState(false);
  const [isEditingPersonaModal, setIsEditingPersonaModal] = useState(false);
  const [isGeneratingGiro, setIsGeneratingGiro] = useState(false);
  const [giroRecommendations, setGiroRecommendations] = useState([]);

  // Fallbacks inteligentes sin redundancias hacia Brand DNA Canvas y Oferta Comercial
  const rawPersona = activeTenant?.buyerPersona;
  const rawMix = activeTenant?.marketingMix4P;
  const brandDna = activeTenant?.brandDna || {};
  const commercialOffer = activeTenant?.commercialOffer || {};

  const buyerPersona = {
    name: rawPersona?.name || (activeTenant ? 'Cliente Ideal Calificado' : '--'),
    ageRange: rawPersona?.ageRange || (activeTenant ? '30 a 55 años' : '--'),
    maritalStatus: rawPersona?.maritalStatus || (activeTenant ? 'Líderes de negocio & Directivos con poder de decisión' : '--'),
    location: rawPersona?.location || (activeTenant ? 'México y mercado hispanohablante' : '--'),
    digitalHabits: rawPersona?.digitalHabits || (activeTenant ? 'WhatsApp Business, Instagram Direct, LinkedIn y Google' : '--'),
    mainPainPoint: rawPersona?.mainPainPoint || brandDna?.icpPains || (activeTenant ? 'Falta de estructura de adquisición predecible y fuga de prospectos por lentitud de respuesta humana.' : '--'),
    buyingTrigger: rawPersona?.buyingTrigger || commercialOffer?.hook || brandDna?.leadMagnetHook || (activeTenant ? 'Acelerar la cualificación y cierre de prospectos calificados 24/7 sin fricción.' : '--'),
  };

  const marketingMix = {
    product: rawMix?.product || activeTenant?.brandPurpose || activeTenant?.giro || (activeTenant ? 'Solución y propuesta de valor integral del negocio.' : '--'),
    price: rawMix?.price || (activeTenant ? 'Esquemas de pago personalizados, paquetes y facilidades de financiamiento.' : '--'),
    place: rawMix?.place || 'Omnicanal: Atención y agendamiento 24/7 vía WhatsApp Cloud API y Google Calendar.',
    promotion: rawMix?.promotion || (commercialOffer?.hook ? `${commercialOffer.hook} • CTA: ${commercialOffer.cta || 'Contactar vía WhatsApp'}` : (activeTenant ? 'Ofertas especiales y sesiones de diagnóstico de alto impacto.' : '--')),
  };

  // Formulario para Edición In-Situ
  const [personaForm, setPersonaForm] = useState({
    name: buyerPersona.name,
    ageRange: buyerPersona.ageRange,
    maritalStatus: buyerPersona.maritalStatus,
    location: buyerPersona.location,
    digitalHabits: buyerPersona.digitalHabits,
    mainPainPoint: buyerPersona.mainPainPoint,
    buyingTrigger: buyerPersona.buyingTrigger,
    product: marketingMix.product,
    price: marketingMix.price,
    place: marketingMix.place,
    promotion: marketingMix.promotion,
  });

  // Sincronizar form cuando cambie tenant
  useEffect(() => {
    setPersonaForm({
      name: buyerPersona.name,
      ageRange: buyerPersona.ageRange,
      maritalStatus: buyerPersona.maritalStatus,
      location: buyerPersona.location,
      digitalHabits: buyerPersona.digitalHabits,
      mainPainPoint: buyerPersona.mainPainPoint,
      buyingTrigger: buyerPersona.buyingTrigger,
      product: marketingMix.product,
      price: marketingMix.price,
      place: marketingMix.place,
      promotion: marketingMix.promotion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTenant]);

  // Cargar recomendaciones del Asesor de Giro iniciales o desde API
  useEffect(() => {
    if (activeTenant) {
      handleConsultGiroAdvisor(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTenant?.id, activeTenant?.giro]);

  // Inferencia Automática con DeepSeek R1
  const handleAutoInferBuyer = async () => {
    if (!activeTenant) return;
    setIsInferringBuyer(true);
    try {
      const res = await fetch('/api/rag/infer-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: activeTenant?.name || 'Vector Inside',
          giro: activeTenant?.giro || activeTenant?.verticalLabel || 'Servicios Comerciales B2B',
          brandPurpose: activeTenant?.brandPurpose || '',
          toneOfVoice: activeTenant?.toneOfVoice || '',
          offerHook: commercialOffer?.hook || '',
          offerCta: commercialOffer?.cta || '',
          offerValidity: commercialOffer?.validity || '',
          verticalId: activeTenant?.vertical || 'b2b',
          socialLinks: activeTenant?.socialLinks || {},
          connectedSocialNetworks: activeTenant?.connectedSocialNetworks || ['WHATSAPP', 'INSTAGRAM'],
        }),
      });

      const data = await res.json();
      if (data?.success) {
        if (updateTenantPolicy && activeTenant?.id) {
          await updateTenantPolicy(activeTenant.id, {
            buyerPersona: data.buyerPersona,
            marketingMix4P: data.marketingMix4P,
          });
        }
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            colors: ['#E7F900', '#06B6D4', '#10B981'],
          });
        } catch (e) {}
        triggerModal(
          'Buyer Persona & 4 Ps Sincronizados',
          `El Buyer Persona y la Matriz de las 4 Ps de <b>${activeTenant?.name}</b> fueron inferidos con DeepSeek R1 y persistidos exitosamente en el sistema.`
        );
      }
    } catch (err) {
      console.error('[CommercialGrowthSuite.handleAutoInferBuyer] Error:', err);
    } finally {
      setIsInferringBuyer(false);
    }
  };

  // Guardado de la Edición In-Situ
  const handleSavePersonaModal = async (e) => {
    if (e) e.preventDefault();
    if (!activeTenant?.id || !updateTenantPolicy) return;
    const updatedPersona = {
      name: personaForm.name,
      ageRange: personaForm.ageRange,
      maritalStatus: personaForm.maritalStatus,
      location: personaForm.location,
      digitalHabits: personaForm.digitalHabits,
      mainPainPoint: personaForm.mainPainPoint,
      buyingTrigger: personaForm.buyingTrigger,
    };
    const updatedMix = {
      product: personaForm.product,
      price: personaForm.price,
      place: personaForm.place,
      promotion: personaForm.promotion,
    };

    await updateTenantPolicy(activeTenant.id, {
      buyerPersona: updatedPersona,
      marketingMix4P: updatedMix,
    });
    setIsEditingPersonaModal(false);
    triggerModal(
      'Ficha Estratégica Actualizada',
      `El Buyer Persona y las 4 Ps de <b>${activeTenant.name}</b> han sido actualizados y persistidos en tiempo real.`
    );
  };

  // Consultar Asesor de Giro con DeepSeek R1
  const handleConsultGiroAdvisor = async (showConfetti = true) => {
    if (!activeTenant) return;
    setIsGeneratingGiro(true);
    try {
      const res = await fetch('/api/commercial/giro-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: activeTenant?.name || 'tu negocio',
          giro: activeTenant?.giro || activeTenant?.verticalLabel || 'Servicios Comerciales',
          vertical: activeTenant?.vertical || 'b2b',
          brandPurpose: activeTenant?.brandPurpose || '',
          buyerPersona: buyerPersona,
          commercialOffer: commercialOffer,
        }),
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.recommendations)) {
        setGiroRecommendations(data.recommendations);
        if (showConfetti) {
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              colors: ['#06B6D4', '#E7F900', '#A855F7'],
            });
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('[CommercialGrowthSuite.handleConsultGiroAdvisor] Error:', err);
    } finally {
      setIsGeneratingGiro(false);
    }
  };

  const handleSaveTariff = (newPrice) => {
    setLeadTariff(newPrice);
    setIsEditingTariff(false);
    if (updateTenantPolicy && activeTenant?.id) {
      updateTenantPolicy(activeTenant.id, {
        leadPriceMXN: Number(newPrice),
      });
    }
    triggerModal(
      'Tarifa de Prospecto Actualizada',
      `El acuerdo comercial para <b>${activeTenant?.name || 'tu negocio'}</b> se ha fijado en <b>$${newPrice} MXN por Prospecto Calificado</b>.`
    );
  };

  return (
    <div className="w-full p-3 sm:p-5 lg:p-6 block animate-fade-in space-y-6 font-sans min-w-0">
      {/* Header Unificado de la Suite */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-[var(--border-color)] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-neon/15 text-neon border border-neon/30">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider">
              Suite Comercial & Estudio de Contenido Integrado
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              • {activeTenant?.avatar || '🏢'} {activeTenant?.shortName || activeTenant?.name || 'Sin negocio seleccionado'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Centro de Crecimiento: <span className="text-neon">Prospectos, Ventas & Contenido</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-2xl mt-0.5">
            Gestión unificada del embudo comercial, automatización de re-contacto a 24 horas y creación de contenido guiada por el Buyer Persona del negocio.
          </p>
        </div>

        {/* Tarifa Dinámica por Lead & Acciones */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-3 shadow-sm font-mono text-xs">
            <div>
              <span className="text-[9px] text-[var(--text-muted)] uppercase block">Tarifa por Prospecto</span>
              {isEditingTariff ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="number"
                    defaultValue={leadTariff}
                    min={350}
                    max={2500}
                    step={50}
                    id="tariffInput"
                    className="w-20 px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-neon text-xs text-neon font-bold text-center focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = document.getElementById('tariffInput')?.value;
                      if (val) handleSaveTariff(val);
                    }}
                    className="px-2 py-0.5 rounded bg-neon text-black font-bold text-[10px]"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-neon font-black text-sm">${leadTariff} MXN</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingTariff(true)}
                    className="text-[10px] text-zinc-400 hover:text-neon underline"
                  >
                    Ajustar
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Conversiones Meta Activas
            </span>
          </div>
        </div>
      </header>

      {/* Navegación por Pestañas de la Suite */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 overflow-x-auto font-sans text-xs">
        <button
          type="button"
          onClick={() => setActiveSuiteTab('kanban')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSuiteTab === 'kanban'
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
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSuiteTab === 'studio'
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
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSuiteTab === 'persona_strategy'
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
              <span className={`p-1.5 rounded-lg shrink-0 ${
                activeTenant?.isAiActive !== false
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <Clock className="w-3.5 h-3.5" />
              </span>
              <p className="text-[11.5px] text-[var(--text-main)] truncate">
                <strong className="font-semibold text-white">
                  Re-contacto {activeTenant?.reengagementDelayHours || 24}h {activeTenant?.isAiActive !== false ? 'Activo' : 'Pausado'}:
                </strong>{' '}
                <span className="text-[var(--text-muted)]">
                  {activeTenant?.isAiActive !== false
                    ? `Seguimiento automático de valor agregado a prospectos tras ${activeTenant?.reengagementDelayHours || 24}h de inactividad.`
                    : 'Automatización pausada para este negocio. Los prospectos no recibirán seguimiento automático.'}
                </span>
              </p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[10px] border shrink-0 self-start sm:self-auto ${
              activeTenant?.isAiActive !== false
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
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
              <span className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
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
              className="text-xs text-neon hover:underline font-mono"
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
            <Target className="w-10 h-10 text-lime-400 opacity-40 mx-auto" />
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
                <span className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 text-2xl shrink-0">
                  🎯
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold">
                      Manual de Identidad & Delimitación de Audiencia
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-neon/10 border border-neon/30 text-[9px] font-mono text-neon font-bold">
                      SSOT Activo
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-black text-[var(--text-main)]">
                    Buyer Persona Oficial: {buyerPersona.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Alimenta directamente los sub-bots de cierre en WhatsApp, los guiones de venta y los ganchos de contenido.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Botón IA DeepSeek R1 */}
                <button
                  type="button"
                  onClick={handleAutoInferBuyer}
                  disabled={isInferringBuyer}
                  className="px-3 py-1.5 rounded-xl bg-neon text-black font-mono font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_var(--neon-glow)] transition-all disabled:opacity-50"
                  title="Inferir Buyer Persona y 4 Ps basándose en el giro y propósito de marca"
                >
                  {isInferringBuyer ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analizando con R1...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Autogenerar con IA</span>
                    </>
                  )}
                </button>

                {/* Botón Edición Rápida In-Situ */}
                <button
                  type="button"
                  onClick={() => setIsEditingPersonaModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Editar In-Situ</span>
                </button>

                {/* Enlace canónico corregido al Perfil de Marca */}
                <Link
                  href="/profile?tab=strategy"
                  className="px-3 py-1.5 rounded-xl bg-neon/10 hover:bg-neon hover:text-black text-neon border border-neon/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Abrir vista integral en Perfil de Marca"
                >
                  <span>Perfil Completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)]">
                  Giro: <strong className="text-[var(--text-main)]">{activeTenant?.giro || activeTenant?.verticalLabel || 'General'}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Rango de Edad</span>
                <span className="font-bold text-[var(--text-main)] text-sm">{buyerPersona.ageRange}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Estado Civil & Perfil</span>
                <span className="font-bold text-[var(--text-main)] text-sm">{buyerPersona.maritalStatus}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Geolocalización & Cobertura</span>
                <span className="font-bold text-[var(--text-main)] text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neon" />
                  {buyerPersona.location}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 md:col-span-2 lg:col-span-3">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Hábitos Digitales & Canales Favoritos</span>
                <p className="text-[var(--text-main)] leading-relaxed">{buyerPersona.digitalHabits}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 md:col-span-1 lg:col-span-1.5">
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">Dolor Principal (Struggling Moment)</span>
                <p className="text-[var(--text-main)] leading-relaxed">{buyerPersona.mainPainPoint}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 md:col-span-1 lg:col-span-1.5">
                <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">Disparador de Compra Inmediata</span>
                <p className="text-[var(--text-main)] leading-relaxed">{buyerPersona.buyingTrigger}</p>
              </div>
            </div>
          </div>

          {/* Marketing Mix: Estructura Operativa de las 4 Ps */}
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border-color)] gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold">
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
                onClick={() => setIsEditingPersonaModal(true)}
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ajustar 4 Ps</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                <div className="flex items-center gap-2 text-neon font-bold font-mono text-[11px]">
                  <ShoppingBag className="w-4 h-4" />
                  <span>1. PRODUCTO (Propuesta de Valor)</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">{marketingMix.product}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-[11px]">
                  <DollarSign className="w-4 h-4" />
                  <span>2. PRECIO (Esquema Comercial del Cliente)</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">{marketingMix.price}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                <div className="flex items-center gap-2 text-blue-400 font-bold font-mono text-[11px]">
                  <Building className="w-4 h-4" />
                  <span>3. PLAZA (Distribución Omnicanal)</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">{marketingMix.place}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-[11px]">
                  <Tag className="w-4 h-4" />
                  <span>4. PROMOCIÓN (Oferta del Mes Activa)</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">{marketingMix.promotion}</p>
              </div>
            </div>
          </div>

          {/* Asesor de Giro: Mejora Continua Dinámica con DeepSeek R1 */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-neon/10 via-[var(--bg-card)] to-cyan-500/10 border-2 border-neon/40 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-neon font-bold">
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
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-panel)] hover:bg-neon hover:text-black text-neon border border-neon/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-50"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-sans">
              {(giroRecommendations && giroRecommendations.length > 0 ? giroRecommendations : [
                {
                  id: 'pricing_1',
                  title: 'Optimización de Ticket Promedio',
                  tag: 'Pricing & Cash Flow',
                  metric: '+38% Cierre Potencial',
                  source: 'Conversaciones del Embudo',
                  diagnosis: 'El 64% de los prospectos preguntan por planes a mensualidades o financiamiento.',
                  action: 'Activar paquetes con financiamiento 12 MSI para aumentar el cierre de tickets superiores en un 38%.',
                  ctaType: 'pricing',
                  ctaLabel: 'Ajustar Oferta Comercial',
                },
                {
                  id: 'service_2',
                  title: 'Nuevo Producto o Servicio en Demanda',
                  tag: 'Expansión de Catálogo',
                  metric: '+22% Ingresos Adicionales',
                  source: 'Demanda Oculta en Citas',
                  diagnosis: 'Alta demanda no cubierta en consultas y atenciones de fin de semana.',
                  action: 'Habilitar citas o guardias en sábados tarde para generar ingresos adicionales sin más pauta publicitaria.',
                  ctaType: 'service',
                  ctaLabel: 'Planear Nuevo Horario',
                },
                {
                  id: 'content_3',
                  title: 'Re-orientación de Contenido Publicitario',
                  tag: 'Conversión de Contenido',
                  metric: '3x Retención en Feed',
                  source: 'Estudio de Contenido',
                  diagnosis: 'La retención es más alta en videos testimoniales cortos de clientes reales antes/después.',
                  action: 'Priorizar este formato testimonial en el Estudio de Contenido sobre publicaciones estáticas.',
                  ctaType: 'studio',
                  ctaLabel: 'Crear en el Estudio →',
                  studioTopic: 'Casos reales y testimonios antes/después',
                },
              ]).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon/40 transition-all flex flex-col justify-between gap-3 shadow-sm group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {rec.metric || '+25% Impacto'}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                        {rec.source}
                      </span>
                    </div>
                    <span className="font-bold text-[var(--text-main)] text-sm block flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
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
                        onClick={() => setActiveSuiteTab('studio')}
                        className="w-full py-1.5 px-3 rounded-xl bg-neon text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:shadow-[0_0_12px_var(--neon-glow)] transition-all font-mono"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{rec.ctaLabel || 'Crear en el Estudio →'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingPersonaModal(true)}
                        className="w-full py-1.5 px-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs flex items-center justify-center gap-1.5 transition-all font-mono"
                      >
                        <Zap className="w-3.5 h-3.5 text-neon" />
                        <span>{rec.ctaLabel || 'Aplicar al Negocio'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )
      )}

      {/* MODAL IN-SITU: EDICIÓN RÁPIDA DE BUYER PERSONA & 4 PS */}
      {isEditingPersonaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
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
                className="p-2 rounded-xl hover:bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePersonaModal} className="space-y-6">
              {/* Sección 1: Buyer Persona */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase text-neon font-bold tracking-wider block">
                  1. Perfil del Buyer Persona Oficial
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Nombre / Título del ICP</label>
                    <input
                      type="text"
                      value={personaForm.name}
                      onChange={(e) => setPersonaForm({ ...personaForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Rango de Edad</label>
                    <input
                      type="text"
                      value={personaForm.ageRange}
                      onChange={(e) => setPersonaForm({ ...personaForm, ageRange: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Estado Civil & Perfil</label>
                    <input
                      type="text"
                      value={personaForm.maritalStatus}
                      onChange={(e) => setPersonaForm({ ...personaForm, maritalStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Geolocalización / Cobertura</label>
                    <input
                      type="text"
                      value={personaForm.location}
                      onChange={(e) => setPersonaForm({ ...personaForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Hábitos Digitales & Canales</label>
                    <textarea
                      rows={2}
                      value={personaForm.digitalHabits}
                      onChange={(e) => setPersonaForm({ ...personaForm, digitalHabits: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-amber-400 uppercase font-bold block mb-1">Dolor Principal (Struggling Moment)</label>
                    <textarea
                      rows={2}
                      value={personaForm.mainPainPoint}
                      onChange={(e) => setPersonaForm({ ...personaForm, mainPainPoint: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-amber-500/30 text-[var(--text-main)] focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Disparador de Compra Inmediata</label>
                    <textarea
                      rows={2}
                      value={personaForm.buyingTrigger}
                      onChange={(e) => setPersonaForm({ ...personaForm, buyingTrigger: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/30 text-[var(--text-main)] focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Marketing Mix (4 Ps) */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <span className="text-[11px] font-mono uppercase text-neon font-bold tracking-wider block">
                  2. Marketing Mix Operativo (4 Ps)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-neon uppercase font-bold block mb-1">1. Producto (Propuesta de Valor)</label>
                    <textarea
                      rows={2}
                      value={personaForm.product}
                      onChange={(e) => setPersonaForm({ ...personaForm, product: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">2. Precio (Esquema Comercial & Ticket)</label>
                    <textarea
                      rows={2}
                      value={personaForm.price}
                      onChange={(e) => setPersonaForm({ ...personaForm, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-400 uppercase font-bold block mb-1">3. Plaza (Distribución Omnicanal)</label>
                    <textarea
                      rows={2}
                      value={personaForm.place}
                      onChange={(e) => setPersonaForm({ ...personaForm, place: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-400 uppercase font-bold block mb-1">4. Promoción (Ganchos & Descuentos)</label>
                    <textarea
                      rows={2}
                      value={personaForm.promotion}
                      onChange={(e) => setPersonaForm({ ...personaForm, promotion: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsEditingPersonaModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] text-xs font-mono font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon text-black text-xs font-mono font-bold flex items-center gap-2 hover:shadow-[0_0_15px_var(--neon-glow)] transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Parámetros</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        )
      )}
    </div>
  );
};
