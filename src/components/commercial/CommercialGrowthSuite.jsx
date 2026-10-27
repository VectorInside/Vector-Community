'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommercialGrowthSuite = () => {
  const { activeTenant, activeTenantKey, updateTenantPolicy, triggerModal, isAdmin } = useAuth();
  const [activeSuiteTab, setActiveSuiteTab] = useState('kanban'); // 'kanban' | 'studio' | 'persona_strategy'
  const [leadTariff, setLeadTariff] = useState(activeTenant?.leadPriceMXN || 350);
  const [isEditingTariff, setIsEditingTariff] = useState(false);

  // Buyer persona y 4Ps del tenant
  const buyerPersona = activeTenant?.buyerPersona || {
    name: 'Cliente Ideal Calificado',
    ageRange: '25 a 50 años',
    maritalStatus: 'Profesionista / Familiar',
    location: 'Zona Metropolitana & Entorno Local',
    digitalHabits: 'Navega en Instagram, interactúa por WhatsApp y busca soluciones rápidas sin fricción.',
    mainPainPoint: 'Falta de tiempo y desconfianza por precios ocultos o promesas infladas.',
    buyingTrigger: 'Atención personalizada inmediata, claridad de precios y garantía de satisfacción.',
  };

  const marketingMix = activeTenant?.marketingMix4P || {
    product: 'Solución insignia de alto valor con atención especializada y tecnología de punta.',
    price: `Tarifa base comercial con costo por prospecto calificado de $${leadTariff} MXN.`,
    place: 'Omnicanal: Atención inmediata en WhatsApp, confirmación en Google Calendar y atención física.',
    promotion: 'Beneficio exclusivo por primer contacto, financiamiento preferencial y garantía de servicio.',
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
    <div className="w-full p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 font-sans">
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
              • {activeTenant?.avatar} {activeTenant?.shortName || activeTenant?.name}
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
        <div className="space-y-3.5 animate-fade-in">
          {/* Banner de Re-contacto y Automatización 24h Compacto y Elegante */}
          <div className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-[var(--bg-card)] to-emerald-500/10 border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </span>
              <p className="text-[11.5px] text-[var(--text-main)] truncate">
                <strong className="font-semibold text-white">Re-contacto 24h Activo:</strong>{' '}
                <span className="text-[var(--text-muted)]">
                  Seguimiento automático de valor agregado a prospectos tras 24h de inactividad.
                </span>
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/30 shrink-0 self-start sm:self-auto">
              Automático Activo
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

          {/* Render del Planificador de Contenido */}
          <ContentPlanner />
        </div>
      )}

      {/* VISTA 3: BUYER PERSONA, MARKETING MIX & ASESOR DE GIRO */}
      {activeSuiteTab === 'persona_strategy' && (
        <div className="space-y-6 animate-fade-in">
          {/* Card Destacada del Buyer Persona */}
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-color)] gap-3">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 text-2xl">
                  🎯
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold">
                    Manual de Identidad & Delimitación de Audiencia
                  </span>
                  <h3 className="text-xl font-heading font-black text-[var(--text-main)]">
                    Buyer Persona Oficial: {buyerPersona.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Alimenta directamente los sub-bots de cierre, los guiones de venta y los ganchos de contenido.
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)]">
                Giro: <strong className="text-[var(--text-main)]">{activeTenant?.giro}</strong>
              </span>
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
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Geolocalización & Códigos Postales</span>
                <span className="font-bold text-[var(--text-main)] text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neon" />
                  {buyerPersona.location}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 md:col-span-2 lg:col-span-3">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">Hábitos Digitales & Canales Favoritos</span>
                <p className="text-[var(--text-main)]">{buyerPersona.digitalHabits}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 md:col-span-1 lg:col-span-1.5">
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">Dolor Principal (Struggling Moment)</span>
                <p className="text-[var(--text-main)]">{buyerPersona.mainPainPoint}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 md:col-span-1 lg:col-span-1.5">
                <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">Disparador de Compra Inmediata</span>
                <p className="text-[var(--text-main)]">{buyerPersona.buyingTrigger}</p>
              </div>
            </div>
          </div>

          {/* Marketing Mix: Estructura de las 4 Ps */}
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-5 shadow-sm">
            <div className="border-b border-[var(--border-color)] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold">
                Estructura Estratégica
              </span>
              <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                Marketing Mix Operativo (4 Ps)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Directrices activas que guían las respuestas del bot y las ofertas del equipo comercial.
              </p>
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
                  <span>2. PRECIO (Arancel & Financiamiento)</span>
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
                  <span>4. PROMOCIÓN (Ganchos & Descuentos Activos)</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">{marketingMix.promotion}</p>
              </div>
            </div>
          </div>

          {/* Asesor de Giro: Mejora Continua del Negocio */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-neon/10 via-[var(--bg-card)] to-cyan-500/10 border-2 border-neon/40 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 text-neon font-bold">
              <Compass className="w-5 h-5" />
              <h3 className="text-base font-heading font-black uppercase tracking-wider text-[var(--text-main)]">
                Asesor de Mejora Continua: ¿Hacia dónde dirigir el negocio?
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Basado en las conversaciones analizadas en el Kanban y la interacción con el Buyer Persona, el motor estratégico sugiere las siguientes optimizaciones de modelo de negocio para <strong>{activeTenant?.name}</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-sans">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                <span className="font-bold text-[var(--text-main)] block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Optimización de Ticket Promedio
                </span>
                <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                  El 64% de los prospectos preguntan por planes a mensualidades. Activar paquetes con financiamiento 12 MSI aumentará el cierre de tickets superiores a $15,000 MXN en un 38%.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                <span className="font-bold text-[var(--text-main)] block flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Nuevo Producto o Servicio en Demanda
                </span>
                <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                  Alta demanda no cubierta en consultas de fin de semana. Habilitar citas en sábados tarde generará un 22% de ingresos adicionales sin incrementar inversión publicitaria.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                <span className="font-bold text-[var(--text-main)] block flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Re-orientación de Contenido Publicitario
                </span>
                <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                  La retención es más alta en videos testimoniales cortos de clientes reales antes/después. Se recomienda priorizar este formato en el Estudio de Contenido sobre publicaciones estáticas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
