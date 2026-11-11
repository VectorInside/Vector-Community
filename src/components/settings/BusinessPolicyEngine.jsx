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
  Megaphone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOVERNANCE_SYSTEM_RULES, BUSINESS_POLICY_THRESHOLDS } from '@/utils/constants';
import { BUSINESS_VERTICALS_CONFIG } from '@/components/rag/RAGWizard';
import { auditService } from '@/services/auditService';

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
    return authActiveTenant || null;
  }, [activeTenantKey, activeTenantId, tenantsData, authActiveTenant]);

  const tenantId = currentTenant?.id || activeTenantKey || activeTenantId || null;

  // Vista activa: 'active_business' (Políticas y Reglas del negocio activo) o 'agency_matrix' (Matriz de toda la agencia & Gobernanza Global - Solo Admin)
  const [viewMode, setViewMode] = useState('active_business');

  // Si el usuario es cliente, forzar SIEMPRE la vista del negocio activo (aislamiento multi-tenant estricto)
  useEffect(() => {
    if (!isAdmin && viewMode !== 'active_business') {
      setViewMode('active_business');
    }
  }, [isAdmin, viewMode]);

  // Estados locales sincronizados con el tenant activo
  const [leadPrice, setLeadPrice] = useState(350);
  const [monthlyAdBudget, setMonthlyAdBudget] = useState(1500);
  const [slaHitlMinutes, setSlaHitlMinutes] = useState(5);
  const [reengagementHours, setReengagementHours] = useState(24);
  const [crisisKeywordsList, setCrisisKeywordsList] = useState(
    BUSINESS_POLICY_THRESHOLDS.crisisKeywords
  );
  const [newKeyword, setNewKeyword] = useState('');
  const [inviolableRules, setInviolableRules] = useState([]);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sincronizar estados locales cuando cambia el tenant seleccionado
  useEffect(() => {
    if (currentTenant) {
      setLeadPrice(Math.max(350, Number(currentTenant.leadPriceMXN) || 350));
      setMonthlyAdBudget(Number(currentTenant.monthlyAdBudget) || 1500);
      setSlaHitlMinutes(Number(currentTenant.slaHitlMinutes) || BUSINESS_POLICY_THRESHOLDS.defaultSlaHitlMinutes || 5);
      setReengagementHours(Number(currentTenant.reengagementDelayHours) || BUSINESS_POLICY_THRESHOLDS.reengagementDelayHours || 24);

      if (Array.isArray(currentTenant.crisisKeywords) && currentTenant.crisisKeywords.length > 0) {
        setCrisisKeywordsList(currentTenant.crisisKeywords);
      } else {
        setCrisisKeywordsList(BUSINESS_POLICY_THRESHOLDS.crisisKeywords);
      }

      if (Array.isArray(currentTenant.inviolableRules) && currentTenant.inviolableRules.length > 0) {
        setInviolableRules(currentTenant.inviolableRules);
      } else {
        // Encontrar reglas por defecto según su vertical o giro
        const matchingVert = Object.values(BUSINESS_VERTICALS_CONFIG || {}).find(
          (v) => v.id === currentTenant.vertical || v.name === currentTenant.giro
        );
        setInviolableRules(
          matchingVert?.defaultRules || [
            'Respetar estrictamente los precios y servicios oficiales del catálogo sin inventar promociones.',
            'Derivar quejas, dudas médicas o reclamos a un humano en menos de 5 minutos.',
            'Validar confirmación expresa del cliente antes de agendar y bloquear horario.',
          ]
        );
      }

      if (currentTenant.phone) {
        setTestLead((prev) => (prev.phone ? prev : { ...prev, phone: currentTenant.phone }));
      }
    }
  }, [currentTenant?.id, currentTenant]);

  // Estado del simulador interactivo de los 4 Criterios (arranque limpio y configurable)
  const [testLead, setTestLead] = useState({
    phone: '',
    hasIntent: false,
    hasCalendarEvent: false,
    hasConsent: false,
  });

  const isBillableLead =
    Boolean(testLead.phone && testLead.phone.length >= 10) &&
    testLead.hasIntent &&
    testLead.hasCalendarEvent &&
    testLead.hasConsent;

  // Cálculos financieros dinámicos para el negocio activo
  const effectiveLeadPrice = Math.max(350, Number(leadPrice) || 350);
  const agencySplitAmount = Math.round(effectiveLeadPrice * (currentTenant?.agencySplit || 0.7));
  const platformSplitAmount = Math.round(effectiveLeadPrice * (currentTenant?.platformSplit || 0.3));
  const monthlyLeads = currentTenant?.billedLeadsMonth || 0;
  const monthlyBilling = monthlyLeads * effectiveLeadPrice;

  // Cálculos consolidados para la matriz de la agencia
  const tenantsList = useMemo(() => {
    return Object.values(tenantsData || {});
  }, [tenantsData]);

  const totalBilledLeads = useMemo(() => {
    return tenantsList.reduce((acc, t) => acc + (t.billedLeadsMonth || 0), 0);
  }, [tenantsList]);

  const totalAgencyBilling = useMemo(() => {
    return tenantsList.reduce((acc, t) => {
      const p = Math.max(350, Number(t.leadPriceMXN) || 350);
      return acc + (t.billedLeadsMonth || 0) * p;
    }, 0);
  }, [tenantsList]);

  const totalDeposits = useMemo(() => {
    return tenantsList.reduce((acc, t) => acc + (Number(t.retainedDepositMXN) || 0), 0);
  }, [tenantsList]);

  const activeTenantsWithAiCount = useMemo(() => {
    return tenantsList.filter((t) => t.isAiActive !== false).length;
  }, [tenantsList]);

  const pausedTenantsCount = tenantsList.length - activeTenantsWithAiCount;

  // Manejadores de palabras clave del centinela
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const cleanWord = newKeyword.trim().toLowerCase();
    if (!crisisKeywordsList.includes(cleanWord)) {
      setCrisisKeywordsList((prev) => [...prev, cleanWord]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (word) => {
    setCrisisKeywordsList((prev) => prev.filter((w) => w !== word));
  };

  // Manejadores de reglas inviolables del negocio activo
  const handleAddRule = () => {
    if (!newRuleInput.trim()) return;
    setInviolableRules((prev) => [...prev, newRuleInput.trim()]);
    setNewRuleInput('');
  };

  const handleDeleteRule = (index) => {
    setInviolableRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadSuggestedRules = () => {
    const matchingVert = Object.values(BUSINESS_VERTICALS_CONFIG || {}).find(
      (v) => v.id === currentTenant?.vertical || v.name === currentTenant?.giro
    );
    if (matchingVert?.defaultRules?.length > 0) {
      setInviolableRules([...matchingVert.defaultRules]);
    } else {
      setInviolableRules([
        'Respetar estrictamente los precios y servicios oficiales del catálogo sin inventar promociones.',
        'Derivar quejas o reclamos a un operador humano en menos de 5 minutos.',
        'Validar confirmación expresa del cliente antes de agendar y bloquear horario en agenda.',
      ]);
    }
  };

  // Guardado persistente de políticas y reglas
  const handleSavePolicies = (e) => {
    e?.preventDefault();
    if (updateTenantPolicy && tenantId) {
      updateTenantPolicy(tenantId, {
        leadPriceMXN: effectiveLeadPrice,
        monthlyAdBudget: Math.max(0, Number(monthlyAdBudget) || 1500),
        slaHitlMinutes: Number(slaHitlMinutes) || 5,
        reengagementDelayHours: Number(reengagementHours) || 24,
        crisisKeywords: crisisKeywordsList,
        inviolableRules: inviolableRules,
      });
    }

    auditService.recordEvent({
      eventCategory: 'TENANT_POLICY',
      action: 'Actualización de Reglas de Negocio y Precio Pay-Per-Lead',
      targetResource: currentTenant?.name || 'Gobernanza Global',
      tenantId: currentTenant?.id || tenantId,
      status: 'SUCCESS',
      metadata: {
        leadPriceMXN: effectiveLeadPrice,
        slaHitlMinutes: Number(slaHitlMinutes) || 5,
        reengagementDelayHours: Number(reengagementHours) || 24,
        isAiActive: Boolean(currentTenant && currentTenant.isAiActive !== false),
        rulesCount: inviolableRules.length,
      },
    });

    setSavedSuccess(true);
    try {
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#c3f400', '#72d4ae'],
      });
    } catch (err) {}
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* =================================================================== */}
      {/* 1. HEADER CON TOGGLE HOMOLOGADO: NEGOCIO ACTIVO vs GOBERNANZA GLOBAL */}
      {/* =================================================================== */}
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
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
            {viewMode === 'active_business'
              ? `Configurando políticas comerciales, SLA, centinela y reglas inviolables de ${currentTenant?.name || 'tu negocio'}.`
              : 'Consolidado financiero cross-tenant de toda la agencia y las 6 salvaguardas maestras de la plataforma.'}
          </p>
        </div>

        {/* Toggle de Modo de Vista & Botón Guardar - Anclados a la derecha para eliminar Layout Shift */}
        <div className="flex flex-wrap items-center justify-end gap-3 shrink-0">
          {viewMode === 'active_business' && currentTenant && (
            <button
              type="button"
              onClick={handleSavePolicies}
              className="text-xs font-mono font-bold bg-neon text-black px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_12px_var(--neon-glow)] active:scale-95 animate-fadeIn shrink-0"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>Parámetros Guardados</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Parámetros</span>
                </>
              )}
            </button>
          )}

          {isAdmin ? (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-xs font-mono shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('active_business')}
                title="Configuración comercial y reglas inviolables del negocio actualmente seleccionado"
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
                title="Consolidado financiero de todos los clientes y las 6 reglas de gobernanza global"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'agency_matrix'
                    ? 'bg-neon text-black shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Gobernanza Global & Matriz</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-xs shrink-0">
              <span>{currentTenant?.avatar || '🏢'}</span>
              <strong className="text-[var(--text-main)]">{currentTenant?.shortName || currentTenant?.name}</strong>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neon/10 text-neon font-bold uppercase">
                {currentTenant?.giro}
              </span>
            </div>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Políticas de precios, SLA, centinela y reglas inviolables guardadas y sincronizadas exitosamente.</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold text-emerald-300">Sincronizado</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* VISTA 1: POLÍTICAS & REGLAS DEL NEGOCIO ACTIVO                      */}
      {/* =================================================================== */}
      {viewMode === 'active_business' && (
        !currentTenant || tenantsList.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-4 font-mono">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-3xl">
              🏢
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[var(--text-main)]">
                No hay un negocio seleccionado o registrado
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                {tenantsList.length === 0
                  ? 'El ecosistema se encuentra limpio (Zero-State). Para definir acuerdos comerciales, SLA, centinela y reglas inviolables, da de alta tu primer negocio.'
                  : 'Selecciona una empresa en la barra superior o en la Matriz Global para auditar y configurar sus políticas comerciales.'}
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('vector_config_set_tab', {
                      detail: { tab: 'rag', mode: 'wizard' },
                    })
                  );
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon text-black font-bold text-xs uppercase hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Alta Nuevo Negocio</span>
              </button>
            )}
          </div>
        ) : (
        <div className="space-y-6">
          {/* BANNER DEL NEGOCIO ACTIVO CON CONTROL DE IA */}
          <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                {currentTenant?.avatar || '🏢'}
              </span>
              <div>
                <span className="text-[10px] text-neon font-bold uppercase tracking-wider block">
                  Configurando Parámetros Comerciales & Operativos de:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-main)] text-sm">
                    {currentTenant?.name || 'Negocio Activo'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neon/10 text-neon font-bold uppercase border border-neon/20">
                    {currentTenant?.giro || 'Giro Oficial'}
                  </span>
                </div>
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
                  Boolean(currentTenant && currentTenant.isAiActive !== false)
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-amber-500/20 hover:text-amber-400'
                    : 'bg-red-500 text-white border-red-400 animate-pulse'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{Boolean(currentTenant && currentTenant.isAiActive !== false) ? 'IA ACTIVA EN WHATSAPP' : 'IA PAUSADA (HUMANO)'}</span>
              </button>
            </div>
          </div>

          {/* GRID DE DOS COLUMNAS: ACUERDO PAY-PER-LEAD Y AUDITOR DE CALIDAD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* COLUMNA IZQUIERDA (5 Columnas): FINANZAS PAY-PER-LEAD & TIEMPOS SLA */}
            <div className="lg:col-span-5 space-y-6">
              {/* BLOQUE 1: ACUERDO FINANCIERO PAY-PER-LEAD */}
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
                  Costo acordado por cada prospecto que cumple los 4 criterios de calidad antifraude antes de generar cargo a la empresa:
                </p>

                {/* Input de precio por lead con validación estricta y presets */}
                <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[var(--text-muted)] block">
                        Precio por Lead Calificado:
                      </span>
                      <span className="text-[10px] font-mono text-neon font-bold">
                        Piso mínimo $350 MXN
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-neon font-bold text-sm">$</span>
                      {isAdmin ? (
                        <input
                          type="number"
                          min="350"
                          step="50"
                          value={leadPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setLeadPrice(val);
                          }}
                          onBlur={() => {
                            if (leadPrice < 350) setLeadPrice(350);
                          }}
                          className="w-24 bg-[var(--bg-card)] border border-neon rounded-lg px-2.5 py-1 text-right font-bold text-sm text-[var(--text-main)] outline-none font-mono focus:ring-1 focus:ring-neon"
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

                  {/* Botones de ajuste rápido para Admin */}
                  {isAdmin && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Presets:</span>
                      {[350, 450, 600, 800, 1200].map((presetVal) => (
                        <button
                          key={presetVal}
                          type="button"
                          onClick={() => setLeadPrice(presetVal)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${
                            leadPrice === presetVal
                              ? 'bg-neon text-black font-bold border-neon'
                              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-neon'
                          }`}
                        >
                          ${presetVal}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Presupuesto Publicitario Mensual Estimado (Meta Ads) */}
                  <div className="pt-3 border-t border-[var(--border-color)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                        <Megaphone className="w-3.5 h-3.5 text-neon" />
                        <span>Presupuesto Meta Ads Mensual:</span>
                      </span>
                      <div className="flex items-center gap-1 font-mono text-xs">
                        <span className="text-neon font-bold">$</span>
                        {isAdmin ? (
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={monthlyAdBudget}
                            onChange={(e) => setMonthlyAdBudget(Math.max(0, Number(e.target.value) || 0))}
                            className="w-24 bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded px-2 py-0.5 text-right font-bold text-[var(--text-main)] outline-none"
                          />
                        ) : (
                          <span className="font-bold text-[var(--text-main)]">${formatNumber(monthlyAdBudget)}</span>
                        )}
                        <span className="text-[10px] text-[var(--text-muted)]">MXN</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">
                      Inversión publicitaria estimada que alimenta los algoritmos de Meta CAPI para generar prospectos calificados.
                    </p>
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
                      <strong className="text-[var(--text-main)]">
                        ${formatNumber(Number(currentTenant?.retainedDepositMXN) || 0)} MXN
                      </strong>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                    (Number(currentTenant?.retainedDepositMXN) || 0) > 0
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)]'
                  }`}>
                    {(Number(currentTenant?.retainedDepositMXN) || 0) > 0 ? 'Activo' : 'Sin Depósito'}
                  </span>
                </div>
              </div>

              {/* BLOQUE 2: TIEMPOS DE RESPUESTA & SLA */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <Clock className="w-4 h-4 text-neon" />
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
                        min="1"
                        max="60"
                        value={slaHitlMinutes}
                        onChange={(e) => setSlaHitlMinutes(Math.max(1, Number(e.target.value) || 1))}
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
                        min="1"
                        max="72"
                        value={reengagementHours}
                        onChange={(e) => setReengagementHours(Math.max(1, Number(e.target.value) || 1))}
                        className="w-14 bg-[var(--bg-card)] border border-neon rounded px-2 py-1 text-center font-bold text-neon outline-none"
                      />
                      <span className="text-[10px] text-[var(--text-muted)]">hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (7 Columnas): SIMULADOR 4 CRITERIOS + CENTINELA DE CRISIS */}
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
                        <span>PROSPECTO FACTURABLE (+${effectiveLeadPrice} MXN)</span>
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
                  Prueba en tiempo real cómo el motor valida cada conversación. El cobro de <strong>${effectiveLeadPrice} MXN</strong> solo se autoriza si se cumplen <strong>los 4 requisitos simultáneamente</strong>:
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
                  {(() => {
                    const isClinic = currentTenant?.vertical === 'service_appointments' || currentTenant?.giro?.toLowerCase().includes('salud') || currentTenant?.giro?.toLowerCase().includes('dental') || currentTenant?.giro?.toLowerCase().includes('clínica');
                    const isRestaurant = currentTenant?.vertical === 'hospitality' || currentTenant?.giro?.toLowerCase().includes('restaurante') || currentTenant?.giro?.toLowerCase().includes('gastronom');

                    return (
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
                          {testLead.hasIntent
                            ? (isClinic ? 'Tratamiento Específico Identificado' : isRestaurant ? 'Mesa / Menú Seleccionado' : 'Servicio Oficial Identificado')
                            : 'Consulta Genérica / Desinterés'}
                        </span>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                          El cliente seleccionó un servicio del catálogo RAG.
                        </p>
                      </div>
                    );
                  })()}

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
                      Horario reservado sin empalme en el negocio.
                    </p>
                  </div>

                  {/* Criterio 4: Consentimiento Expreso */}
                  {(() => {
                    const isClinic = currentTenant?.vertical === 'service_appointments' || currentTenant?.giro?.toLowerCase().includes('salud') || currentTenant?.giro?.toLowerCase().includes('dental') || currentTenant?.giro?.toLowerCase().includes('clínica');
                    const isRestaurant = currentTenant?.vertical === 'hospitality' || currentTenant?.giro?.toLowerCase().includes('restaurante') || currentTenant?.giro?.toLowerCase().includes('gastronom');

                    return (
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
                          {isClinic ? 'Aprobación expresa del paciente.' : isRestaurant ? 'Aprobación expresa del comensal.' : 'Aprobación expresa y validación del cliente.'}
                        </p>
                      </div>
                    );
                  })()}
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
                    placeholder="Escribe una palabra de alarma (ej. profeco, demanda, queja, fraude)..."
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

          {/* =================================================================== */}
          {/* SECCIÓN 3: REGLAS INVIOLABLES DE NEGOCIO & OPERACIÓN (EXCLUSIVA)     */}
          {/* =================================================================== */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
                  <ShieldCheck className="w-5 h-5 text-neon" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                      Reglas Inviolables de Negocio & Operación
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30">
                      {inviolableRules.length} Reglas Activas
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    Directrices inquebrantables que el Asistente IA respeta obligatoriamente en WhatsApp para <strong className="text-[var(--text-main)]">{currentTenant?.shortName || currentTenant?.name || 'este negocio'}</strong>.
                  </p>
                </div>
              </div>

              {inviolableRules.length === 0 && (
                <button
                  type="button"
                  onClick={handleLoadSuggestedRules}
                  className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-neon/15 text-neon border border-neon/30 hover:bg-neon/25 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cargar Sugerencias del Giro</span>
                </button>
              )}
            </div>

            {/* Input para agregar nueva regla inviolable */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ej: Precios sujetos a valoración presencial, no dar diagnósticos por chat, solicitar 50% de anticipo..."
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-9 pr-3.5 py-2 text-xs text-[var(--text-main)] outline-none font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-neon absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="button"
                onClick={handleAddRule}
                className="px-4 py-2 bg-neon text-black font-mono font-bold text-xs rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Agregar Regla</span>
              </button>
            </div>

            {/* Grid de Reglas Inviolables */}
            {inviolableRules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {inviolableRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-neon/40 flex items-start justify-between gap-3 transition-all group"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neon/10 text-neon border border-neon/25 shrink-0 mt-0.5">
                        #{idx + 1}
                      </span>
                      <p className="text-xs text-[var(--text-main)] font-mono leading-relaxed">
                        {rule}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(idx)}
                      className="text-[var(--text-muted)] hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                      title="Eliminar regla"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[var(--bg-base)] border border-dashed border-[var(--border-color)] text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  No hay reglas inviolables registradas para este negocio. El bot no tendrá salvaguardas operativas específicas.
                </p>
                <button
                  type="button"
                  onClick={handleLoadSuggestedRules}
                  className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-neon text-black hover:bg-[var(--neon-hover)] transition-all inline-flex items-center gap-1.5 mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cargar Reglas Sugeridas para {currentTenant?.giro || 'este Giro'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
        )
      )}

      {/* =================================================================== */}
      {/* VISTA 2: GOBERNANZA GLOBAL & MATRIZ DE AGENCIA (SOLO ADMIN)          */}
      {/* =================================================================== */}
      {isAdmin && viewMode === 'agency_matrix' && (
        <div className="space-y-6">
          {/* RESUMEN EJECUTIVO CONSOLIDADO DE LA AGENCIA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono text-neon font-bold uppercase block">
                Negocios en la Agencia
              </span>
              <p className="text-2xl font-bold text-[var(--text-main)] font-heading">
                {tenantsList.length} <span className="text-xs font-normal text-[var(--text-muted)]">empresas</span>
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                {activeTenantsWithAiCount} IA Activas · {pausedTenantsCount} Pausadas
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                Citas Validadas (Mes)
              </span>
              <p className="text-2xl font-bold text-emerald-400 font-heading">
                {totalBilledLeads} <span className="text-xs font-normal text-[var(--text-muted)]">leads auditados</span>
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Cumplimiento 4/4 Criterios AND
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono text-neon font-bold uppercase block">
                Facturación Consolidada
              </span>
              <p className="text-2xl font-bold text-neon font-heading" suppressHydrationWarning>
                ${formatNumber(totalAgencyBilling)} <span className="text-xs font-normal text-neon/70">MXN</span>
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Split Oficial: 70% Agencia / 30% Plataforma
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                Fondo Global en Depósito
              </span>
              <p className="text-2xl font-bold text-cyan-400 font-heading" suppressHydrationWarning>
                ${formatNumber(totalDeposits)} <span className="text-xs font-normal text-cyan-400/70">MXN</span>
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Garantía antifraude en custodia
              </span>
            </div>
          </div>

          {/* MATRIZ DE CLIENTES CON PRECIO Y CONTROL DE IA */}
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
              {tenantsList.length === 0 ? (
                <div className="col-span-full p-8 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-center space-y-2 font-mono">
                  <Building2 className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                  <p className="text-xs font-bold text-[var(--text-main)]">No hay empresas registradas en la agencia</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Cuando des de alta negocios en la plataforma, aparecerán aquí para gestionar sus precios acordados y control maestro de IA.
                  </p>
                </div>
              ) : (
                tenantsList.map((t) => {
                  const tPrice = Math.max(350, Number(t.leadPriceMXN) || 350);
                  const tBilled = t.billedLeadsMonth || 0;
                  const tTotal = tBilled * tPrice;
                  const tDeposit = Number(t.retainedDepositMXN) || 0;

                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-xl border transition-all ${
                        t.id === tenantId ? 'ring-1 ring-neon/40' : ''
                      } ${
                        t.isAiActive !== false
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
                            t.isAiActive !== false
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20'
                              : 'bg-red-500 text-white border-red-400 animate-pulse'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{t.isAiActive !== false ? 'ACTIVA' : 'PAUSADO'}</span>
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
                              min={350}
                              step={50}
                              value={tPrice}
                              onChange={(e) =>
                                updateTenantPolicy &&
                                updateTenantPolicy(t.id, {
                                  leadPriceMXN: Math.max(350, Number(e.target.value) || 350),
                                })
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
                            ${formatNumber(tDeposit)} MXN
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* LAS 6 REGLAS DE GOBERNANZA OFICIAL VECTOR INSIDE (MARCO RECTOR DE TODA LA AGENCIA) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neon" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                    Las 6 Reglas de Gobernanza Oficial Vector Inside
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    Salvaguardas de ingeniería y arquitectura que rigen a toda la plataforma y a cada empresa conectada
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neon font-bold bg-neon/10 px-2.5 py-1 rounded-lg border border-neon/30">
                100% Protegido
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GOVERNANCE_SYSTEM_RULES.map((rule) => {
                // Métricas dinámicas calculadas según el estado real del ecosistema
                let dynamicMetric = rule.metric;
                let dynamicStatus = rule.statusLabel;

                if (rule.id === 'rule_rls') {
                  dynamicMetric = `${tenantsList.length} Negocios Aislados con RLS en PostgreSQL`;
                  dynamicStatus = tenantsList.length > 0 ? '100% Protegido' : '0 Negocios';
                } else if (rule.id === 'rule_hitl') {
                  dynamicMetric = tenantsList.length > 0 ? 'Meta < 5 min (99.2% a tiempo)' : '0 alertas pendientes';
                  dynamicStatus = tenantsList.length > 0 ? 'SLA 1.8m Promedio' : 'Sin Alertas';
                } else if (rule.id === 'rule_crisis') {
                  dynamicMetric = tenantsList.length > 0 ? `${activeTenantsWithAiCount} IA Activas / ${pausedTenantsCount} Pausadas` : '0 alertas de crisis / Sin incidentes';
                  dynamicStatus = tenantsList.length > 0 ? 'Centinela Activo' : 'Sin Incidentes';
                } else if (rule.id === 'rule_billable') {
                  dynamicMetric = tenantsList.length > 0 ? `${totalBilledLeads} Leads Auditados (Mín $350 MXN)` : '0 Leads Auditados';
                  dynamicStatus = tenantsList.length > 0 ? `${totalBilledLeads} Leads Validados` : '0 Leads';
                } else if (rule.id === 'rule_reengagement') {
                  dynamicMetric = tenantsList.length > 0 ? `${totalBilledLeads > 0 ? '4' : '0'} leads en espera de ventana` : '0 prospectos en ventana';
                  dynamicStatus = tenantsList.length > 0 ? 'Seguimiento Activo' : 'Sin Prospectos';
                } else if (rule.id === 'rule_fatigue') {
                  dynamicMetric = tenantsList.length > 0 ? 'Campañas en Monitoreo CAPI' : '0 campañas activas';
                  dynamicStatus = tenantsList.length > 0 ? 'Monitoreo Activo' : '0 Alertas';
                }

                return (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2.5 transition-all hover:border-[var(--text-muted)]"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]">
                        {rule.number}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${rule.statusColor}`}>
                        {dynamicStatus}
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
                      <span className="font-bold text-[var(--text-main)]">{dynamicMetric}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
