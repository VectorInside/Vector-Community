'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/hooks/useTenant';
import {
  ShieldCheck,
  Clock,
  AlertOctagon,
  DollarSign,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Save,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Power,
  Building2,
  Briefcase,
  Shield,
  Layers,
  Lock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOVERNANCE_SYSTEM_RULES, BUSINESS_POLICY_THRESHOLDS } from '@/utils/constants';

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const BusinessPolicyEngine = () => {
  const {
    role,
    isAdmin,
    tenantsData,
    activeTenantKey,
    activeTenant: authActiveTenant,
    updateTenantPolicy,
    toggleTenantAi,
  } = useAuth();

  const { activeTenantId } = useTenant();

  // Negocio actualmente seleccionado gobernado por el selector del Header
  const currentTenant = useMemo(() => {
    if (activeTenantKey && tenantsData?.[activeTenantKey]) {
      return tenantsData[activeTenantKey];
    }
    if (activeTenantId && tenantsData?.[activeTenantId]) {
      return tenantsData[activeTenantId];
    }
    return authActiveTenant || Object.values(tenantsData || {})[0] || null;
  }, [activeTenantKey, activeTenantId, tenantsData, authActiveTenant]);

  const tenantId = currentTenant?.id || 'dental';

  // Vista activa: 'active_business' (Políticas del negocio seleccionado) o 'agency_matrix' (Matriz de toda la agencia - Solo Admin)
  const [viewMode, setViewMode] = useState('active_business');

  // Si el usuario es cliente, forzar SIEMPRE la vista del negocio activo (aislamiento multi-tenant estricto)
  useEffect(() => {
    if (!isAdmin && viewMode !== 'active_business') {
      setViewMode('active_business');
    }
  }, [isAdmin, viewMode]);

  // Estado local para umbrales del sistema
  const [thresholds, setThresholds] = useState(BUSINESS_POLICY_THRESHOLDS);
  const [crisisKeywordsList, setCrisisKeywordsList] = useState(
    BUSINESS_POLICY_THRESHOLDS.crisisKeywords
  );
  const [newKeyword, setNewKeyword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estado del simulador interactivo de los 4 Criterios
  const [testLead, setTestLead] = useState({
    phone: '+52 55 4433 2211',
    hasIntent: true,
    hasCalendarEvent: true,
    hasConsent: true,
  });

  const isBillableLead =
    Boolean(testLead.phone && testLead.phone.length >= 10) &&
    testLead.hasIntent &&
    testLead.hasCalendarEvent &&
    testLead.hasConsent;

  // Cálculos financieros dinámicos para el negocio activo
  const leadPrice = currentTenant?.leadPriceMXN || 350;
  const agencySplitAmount = Math.round(leadPrice * (currentTenant?.agencySplit || 0.7));
  const platformSplitAmount = Math.round(leadPrice * (currentTenant?.platformSplit || 0.3));
  const monthlyLeads = currentTenant?.billedLeadsMonth || 0;
  const monthlyBilling = monthlyLeads * leadPrice;

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (!crisisKeywordsList.includes(newKeyword.trim().toLowerCase())) {
      setCrisisKeywordsList((prev) => [...prev, newKeyword.trim().toLowerCase()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (word) => {
    setCrisisKeywordsList((prev) => prev.filter((w) => w !== word));
  };

  const handleSavePolicies = (e) => {
    e?.preventDefault();
    setSavedSuccess(true);
    try {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#c3f400', '#72d4ae'],
      });
    } catch (err) {}
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. HEADER DE GOBERNANZA CON SELECTOR DE MODO (Negocio Activo vs Toda la Agencia) */}
      <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold text-neon uppercase tracking-wider block">
                Acuerdos Comerciales & Garantías Antifraude
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                Reglas de Negocio, Precios & Gobernanza
              </h2>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1.5">
            Define las políticas de cobro por prospecto calificado, auditoría de calidad de 4 pasos y centinela de crisis.
          </p>
        </div>

        {/* Botón de guardado y cambio de vista (Solo Admin puede ver la matriz de toda la agencia) */}
        <div className="flex items-center gap-3 flex-wrap">
          {isAdmin ? (
            <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs">
              <button
                type="button"
                onClick={() => setViewMode('active_business')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'active_business'
                    ? 'bg-neon text-black shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <span>{currentTenant?.avatar || '🏢'}</span>
                <span>{currentTenant?.shortName || 'Negocio Activo'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('agency_matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'agency_matrix'
                    ? 'bg-neon text-black shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Matriz Toda la Agencia</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs">
              <span>{currentTenant?.avatar || '🏢'}</span>
              <strong className="text-[var(--text-main)]">{currentTenant?.shortName || currentTenant?.name}</strong>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neon/10 text-neon font-bold uppercase">
                {currentTenant?.giro}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSavePolicies}
            className="text-xs font-mono font-bold bg-neon text-black px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_12px_var(--neon-glow)] active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>Políticas Guardadas</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Parámetros</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Políticas de precios y reglas de gobernanza actualizadas y sincronizadas en la plataforma.</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">Auditado</span>
        </div>
      )}

      {/* VISTA 1: POLÍTICAS DEL NEGOCIO ACTIVO (GOBERNADO POR EL SELECTOR DEL HEADER) */}
      {viewMode === 'active_business' && (
        <div className="space-y-6">
          {/* BANNER DEL NEGOCIO ACTIVO */}
          <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                {currentTenant?.avatar || '🏢'}
              </span>
              <div>
                <span className="text-[10px] text-neon font-bold uppercase tracking-wider block">
                  Configurando Acuerdos Financieros de:
                </span>
                <span className="font-bold text-[var(--text-main)] text-sm">
                  {currentTenant?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)] text-[11px]">
                Control de Inteligencia Artificial:
              </span>
              <button
                type="button"
                onClick={() => toggleTenantAi && toggleTenantAi(tenantId)}
                className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  currentTenant?.isAiActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-amber-500/20 hover:text-amber-400'
                    : 'bg-red-500 text-white border-red-400 animate-pulse'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{currentTenant?.isAiActive ? 'IA ACTIVA EN WHATSAPP' : 'IA PAUSADA (HUMANO)'}</span>
              </button>
            </div>
          </div>

          {/* GRID DE DOS COLUMNAS: ACUERDO FINANCIERO A LA IZQUIERDA Y AUDITOR DE CALIDAD A LA DERECHA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* COLUMNA IZQUIERDA (5 Columnas): ACUERDO DE FACTURACIÓN PAY-PER-LEAD */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-neon" />
                    <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                      Acuerdo Pay-Per-Lead
                    </h3>
                  </div>
                  {isAdmin ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold">
                      Split 70/30
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                      Tarifa Oficial Acordada
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Costo acordado por cada prospecto que cumple los 4 criterios de calidad antes de generar cargo a la empresa:
                </p>

                {/* Input de precio por lead */}
                <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      Precio por Lead Calificado:
                    </span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-neon font-bold text-sm">$</span>
                      {isAdmin ? (
                        <input
                          type="number"
                          min="50"
                          step="10"
                          value={leadPrice}
                          onChange={(e) =>
                            updateTenantPolicy &&
                            updateTenantPolicy(tenantId, { leadPriceMXN: Number(e.target.value) })
                          }
                          className="w-24 bg-[var(--bg-card)] border border-neon rounded-lg px-2.5 py-1 text-right font-bold text-sm text-[var(--text-main)] outline-none font-mono"
                        />
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] font-bold text-sm text-[var(--text-main)]">
                          <span>{leadPrice}</span>
                          <Lock className="w-3 h-3 text-[var(--text-muted)]" />
                        </div>
                      )}
                      <span className="text-xs text-[var(--text-muted)]">MXN</span>
                    </div>
                  </div>

                  {/* Desglose de Split (Visible ÚNICAMENTE para Administradores de Agencia) */}
                  {isAdmin ? (
                    <div className="pt-2 border-t border-[var(--border-color)] space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--text-muted)]">Agencia (70%):</span>
                        <strong className="text-emerald-400">${agencySplitAmount} MXN</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--text-muted)]">Plataforma (30%):</span>
                        <strong className="text-cyan-400">${platformSplitAmount} MXN</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Tarifa auditada sin costos ocultos por prospecto calificado.</span>
                    </div>
                  )}
                </div>

                {/* Métricas del Mes */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-1">
                  <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Leads Este Mes:</span>
                    <span className="text-lg font-bold text-[var(--text-main)] font-heading">
                      {monthlyLeads} <span className="text-xs font-normal text-[var(--text-muted)]">citas</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Facturación Acumulada:</span>
                    <span className="text-lg font-bold text-neon font-heading" suppressHydrationWarning>
                      ${formatNumber(monthlyBilling)} <span className="text-[10px] text-neon/70">MXN</span>
                    </span>
                  </div>
                </div>

                {/* Fondo en garantía */}
                <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">Fondo de Garantía en Depósito:</span>
                      <span className="font-bold text-cyan-400" suppressHydrationWarning>
                        ${formatNumber(currentTenant?.retainedDepositMXN || 15000)} MXN
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                    Activo
                  </span>
                </div>
              </div>

              {/* UMBRALES DE TIEMPOS Y SERVICIO (SLA) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                    Tiempos de Respuesta & SLA
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                    <div>
                      <p className="font-bold text-[var(--text-main)] text-[11px]">SLA de Atención Humana</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Tiempo máximo antes de alertar al director</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={thresholds.defaultSlaHitlMinutes}
                        onChange={(e) =>
                          setThresholds((prev) => ({
                            ...prev,
                            defaultSlaHitlMinutes: Number(e.target.value),
                          }))
                        }
                        className="w-14 bg-[var(--bg-card)] border border-neon rounded px-2 py-1 text-center font-bold text-neon outline-none"
                      />
                      <span className="text-[10px] text-[var(--text-muted)]">min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                    <div>
                      <p className="font-bold text-[var(--text-main)] text-[11px]">Incubación de Prospectos</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Tiempo de descanso antes de enviar recordatorio</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={thresholds.reengagementDelayHours}
                        onChange={(e) =>
                          setThresholds((prev) => ({
                            ...prev,
                            reengagementDelayHours: Number(e.target.value),
                          }))
                        }
                        className="w-14 bg-[var(--bg-card)] border border-neon rounded px-2 py-1 text-center font-bold text-neon outline-none"
                      />
                      <span className="text-[10px] text-[var(--text-muted)]">hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (7 Columnas): SIMULADOR DE 4 CRITERIOS + CENTINELA DE CRISIS */}
            <div className="lg:col-span-7 space-y-6">
              {/* MÓDULO AUDITOR DE CALIDAD: SIMULADOR DE LOS 4 CRITERIOS AND */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neon" />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                        Auditor de Calidad Antifraude (4 Criterios)
                      </h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">
                        Garantiza al cliente que solo paga por citas reales y confirmadas
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                      isBillableLead
                        ? 'bg-neon/15 text-neon border-neon/40 shadow-[0_0_12px_var(--neon-glow)]'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isBillableLead ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-neon" />
                        <span>PROSPECTO FACTURABLE (+${leadPrice} MXN)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>EN PROCESO (NO FACTURABLE AÚN)</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Prueba en tiempo real cómo el motor valida cada conversación. El cobro de <strong>${leadPrice} MXN</strong> solo se autoriza si se cumplen <strong>los 4 requisitos simultáneamente</strong>:
                </p>

                {/* Grid de 4 Criterios Interactivos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Criterio 1: Teléfono Verificado */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    Boolean(testLead.phone && testLead.phone.length >= 10)
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-[var(--bg-base)] border-[var(--border-color)]'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-neon" /> 1. Contacto Verificado
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(testLead.phone && testLead.phone.length >= 10)}
                        readOnly
                        className="accent-[var(--neon-primary)]"
                      />
                    </div>
                    <input
                      type="text"
                      value={testLead.phone}
                      onChange={(e) => setTestLead((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+52 55..."
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-lg px-2.5 py-1 text-xs text-[var(--text-main)] font-mono outline-none"
                    />
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                      Número real con prefijo internacional válido.
                    </p>
                  </div>

                  {/* Criterio 2: Servicio Identificado */}
                  <div className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    testLead.hasIntent
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-[var(--bg-base)] border-[var(--border-color)]'
                  }`}
                  onClick={() => setTestLead((prev) => ({ ...prev, hasIntent: !prev.hasIntent }))}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-neon" /> 2. Interés en Catálogo
                      </span>
                      <input
                        type="checkbox"
                        checked={testLead.hasIntent}
                        onChange={(e) => setTestLead((prev) => ({ ...prev, hasIntent: e.target.checked }))}
                        className="accent-[var(--neon-primary)] cursor-pointer"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-main)] block">
                      {testLead.hasIntent ? 'Tratamiento Específico Identificado' : 'Consulta Genérica / Desinterés'}
                    </span>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                      El cliente seleccionó un servicio del RAG.
                    </p>
                  </div>

                  {/* Criterio 3: Google Calendar */}
                  <div className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    testLead.hasCalendarEvent
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-[var(--bg-base)] border-[var(--border-color)]'
                  }`}
                  onClick={() => setTestLead((prev) => ({ ...prev, hasCalendarEvent: !prev.hasCalendarEvent }))}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-neon" /> 3. Slot en Google Calendar
                      </span>
                      <input
                        type="checkbox"
                        checked={testLead.hasCalendarEvent}
                        onChange={(e) => setTestLead((prev) => ({ ...prev, hasCalendarEvent: e.target.checked }))}
                        className="accent-[var(--neon-primary)] cursor-pointer"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-main)] block">
                      {testLead.hasCalendarEvent ? 'Cita Registrada en la Agenda' : 'Sin Cita Bloqueada'}
                    </span>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                      Horario reservado sin empalme en la clínica.
                    </p>
                  </div>

                  {/* Criterio 4: Consentimiento Expreso */}
                  <div className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    testLead.hasConsent
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-[var(--bg-base)] border-[var(--border-color)]'
                  }`}
                  onClick={() => setTestLead((prev) => ({ ...prev, hasConsent: !prev.hasConsent }))}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-neon" /> 4. Consentimiento Expreso
                      </span>
                      <input
                        type="checkbox"
                        checked={testLead.hasConsent}
                        onChange={(e) => setTestLead((prev) => ({ ...prev, hasConsent: e.target.checked }))}
                        className="accent-[var(--neon-primary)] cursor-pointer"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-main)] block">
                      {testLead.hasConsent ? 'Confirmación Clara de Asistencia' : 'Sin Autorización de Contacto'}
                    </span>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                      Aprobación expresa del paciente o comensal.
                    </p>
                  </div>
                </div>

                {/* Explicación de Valor al Cliente */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">
                    Estado de Liquidación:
                  </span>
                  <span className={isBillableLead ? 'text-neon font-bold' : 'text-amber-400 font-bold'}>
                    {isBillableLead
                      ? `Criterios 4/4 Cumplidos • Facturación Liberada`
                      : `Incompleto • $0 MXN Cobrados (Protegido)`}
                  </span>
                </div>
              </div>

              {/* CENTINELA DE SEGURIDAD & PALABRAS DE CRISIS */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-red-400" />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                        Centinela de Crisis: Detección de Fricción
                      </h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">
                        Desconecta la IA en 0ms ante quejas o solicitudes de hablar con un humano
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 font-bold">
                    Pausa Inmediata
                  </span>
                </div>

                {/* Input para agregar palabras clave */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe una palabra de alarma (ej. profeco, demanda, queja)..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                    className="flex-1 bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-red-400 rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-3.5 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>

                {/* Chips de palabras clave */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {crisisKeywordsList.map((word) => (
                    <span
                      key={word}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center gap-1.5"
                    >
                      <span>{word}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(word)}
                        className="hover:text-red-300 transition-colors"
                        title="Eliminar palabra clave"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: MATRIZ FINANCIERA CONSOLIDADA DE TODA LA AGENCIA (ESTRICTAMENTE SOLO ADMIN) */}
      {isAdmin && viewMode === 'agency_matrix' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-neon" />
                  <span>Matriz de Facturación Pay-Per-Lead (Consolidado de Clientes)</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  Precios acordados por cita validada, leads acumulados del mes y control maestro de IA por empresa.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-neon/10 text-neon border border-neon/30 rounded-lg font-bold">
                Split Oficial: 70% Agencia / 30% Plataforma
              </span>
            </div>

            {/* Grid de todos los negocios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(tenantsData || {}).map((t) => {
                const tPrice = t.leadPriceMXN || 350;
                const tBilled = t.billedLeadsMonth || 0;
                const tTotal = tBilled * tPrice;

                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border transition-all ${
                      t.id === tenantId ? 'ring-1 ring-neon/40' : ''
                    } ${
                      t.isAiActive
                        ? 'bg-[var(--bg-base)] border-[var(--border-color)] hover:border-[var(--text-muted)]'
                        : 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{t.avatar || '🏢'}</span>
                        <div>
                          <h5 className="text-xs font-bold text-[var(--text-main)] font-sans">
                            {t.shortName || t.name}
                          </h5>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">{t.giro}</span>
                        </div>
                      </div>

                      {/* Botón Kill-Switch de IA */}
                      <button
                        type="button"
                        onClick={() => toggleTenantAi && toggleTenantAi(t.id)}
                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                          t.isAiActive
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20'
                            : 'bg-red-500 text-white border-red-400 animate-pulse'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{t.isAiActive ? 'ACTIVA' : 'PAUSADO'}</span>
                      </button>
                    </div>

                    {/* Precios y Facturación */}
                    <div className="space-y-2.5 pt-2 border-t border-[var(--border-color)] font-mono text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--text-muted)]">Precio / Lead:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-neon font-bold">$</span>
                          <input
                            type="number"
                            value={tPrice}
                            onChange={(e) =>
                              updateTenantPolicy &&
                              updateTenantPolicy(t.id, { leadPriceMXN: Number(e.target.value) })
                            }
                            className="w-16 bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded px-1.5 py-0.5 text-right font-bold text-[var(--text-main)] outline-none"
                          />
                          <span className="text-[10px] text-[var(--text-muted)]">MXN</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--text-muted)]">Leads del Mes:</span>
                        <span className="font-bold text-[var(--text-main)]">{tBilled} citas</span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--text-muted)]">Facturación Total:</span>
                        <span className="font-bold text-neon" suppressHydrationWarning>
                          ${formatNumber(tTotal)} MXN
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--text-muted)]">Garantía en Depósito:</span>
                        <span className="font-bold text-cyan-400" suppressHydrationWarning>
                          ${formatNumber(t.retainedDepositMXN || 15000)} MXN
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. LAS 6 REGLAS DE GOBERNANZA DEL SISTEMA (PRESENTADAS CON SOBRIEDAD Y CLARIDAD) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neon" />
            <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
              Las 6 Reglas de Gobernanza Oficial Vector Inside
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neon font-bold">100% Protegido</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOVERNANCE_SYSTEM_RULES.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2.5 transition-all hover:border-[var(--text-muted)]"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]">
                  {rule.number}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${rule.statusColor}`}>
                  {rule.statusLabel}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">{rule.name}</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--text-muted)]">Métrica:</span>
                <span className="font-bold text-[var(--text-main)]">{rule.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
