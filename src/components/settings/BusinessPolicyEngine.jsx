'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Clock,
  AlertOctagon,
  DollarSign,
  Flame,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Layers,
  Power
} from 'lucide-react';
import { GOVERNANCE_SYSTEM_RULES, BUSINESS_POLICY_THRESHOLDS } from '@/utils/constants';

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const BusinessPolicyEngine = () => {
  const { tenantsData, updateTenantPolicy, toggleTenantAi, triggerModal } = useAuth();

  // Local state for system thresholds
  const [thresholds, setThresholds] = useState(BUSINESS_POLICY_THRESHOLDS);
  const [crisisKeywordsList, setCrisisKeywordsList] = useState(BUSINESS_POLICY_THRESHOLDS.crisisKeywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulator state for 4-criteria validation
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
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
              <Sliders className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-heading font-black uppercase text-[var(--text-main)]">
              Motor de Reglas & <span className="text-neon">Políticas de Gobernanza</span>
            </h3>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5">
            Configuración de parámetros operativos, tiempos de respuesta y matriz de precios acordada por prospecto calificado.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSavePolicies}
          className="text-xs font-mono font-bold bg-neon text-black px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_12px_var(--neon-glow)]"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-black" />
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

      {/* Grid de Estado de las 6 Reglas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GOVERNANCE_SYSTEM_RULES.map((rule) => {
          return (
            <div
              key={rule.id}
              className="vector-bg-card vector-border p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-neon transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                  {rule.number} • {rule.adrRef}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${rule.statusColor}`}>
                  {rule.statusLabel}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[var(--text-main)] group-hover:text-neon transition-colors">
                  {rule.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)] font-medium">Métrica Actual:</span>
                <span className="font-bold text-[var(--text-main)]">{rule.metric}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Matriz de Precios y Kill-Switch por Tenant */}
      <div className="vector-bg-card vector-border rounded-2xl p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
          <div>
            <h4 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neon" />
              <span>Matriz de Facturación Pay-Per-Qualified-Lead ($ MXN)</span>
            </h4>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
              Precio unitario acordado por lead validado (4 criterios) y Kill-Switch de Inteligencia Artificial por negocio.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-neon/10 text-neon border border-neon/30 rounded-lg">
            Split Oficial: 70% Agencia / 30% Plataforma
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(tenantsData).map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-all ${
                t.isAiActive
                  ? 'bg-[var(--bg-base)] border-[var(--border-color)]'
                  : 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.avatar}</span>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--text-main)] font-sans">{t.shortName || t.name}</h5>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{t.giro}</span>
                  </div>
                </div>

                {/* Kill Switch Toggle */}
                <button
                  type="button"
                  onClick={() => toggleTenantAi(t.id)}
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                    t.isAiActive
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40'
                      : 'bg-red-500 text-white border-red-400 animate-pulse'
                  }`}
                  title={t.isAiActive ? 'Clic para Pausar IA (Takeover Humano)' : 'Clic para Reactivar IA'}
                >
                  <Power className="w-3 h-3" />
                  <span>{t.isAiActive ? 'IA ACTIVA' : 'PAUSADO'}</span>
                </button>
              </div>

              {/* Price and Deposit Config */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-color)] font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)] text-[11px] font-medium">Precio por Lead:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-neon font-bold">$</span>
                    <input
                      type="number"
                      value={t.leadPriceMXN || 350}
                      onChange={(e) =>
                        updateTenantPolicy(t.id, { leadPriceMXN: Number(e.target.value) })
                      }
                      className="w-20 bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded px-2 py-0.5 text-right font-bold text-[var(--text-main)] outline-none"
                    />
                    <span className="text-[10px] text-[var(--text-muted)]">MXN</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[var(--text-muted)]">Leads Facturados Mes:</span>
                  <span className="font-bold text-[var(--text-main)]">{t.billedLeadsMonth || 0} leads</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[var(--text-muted)]">Facturación Acumulada:</span>
                  <span className="font-bold text-neon" suppressHydrationWarning>
                    ${formatNumber((t.billedLeadsMonth || 0) * (t.leadPriceMXN || 350))} MXN
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[var(--text-muted)]">Saldo Retenido (Garantía):</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400" suppressHydrationWarning>
                    ${formatNumber(t.retainedDepositMXN || 15000)} MXN
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuración de Umbrales & Palabras de Crisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parámetros Operativos */}
        <div className="vector-bg-card vector-border rounded-2xl p-6 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon" />
            <span>Umbrales de Alertas y Tiempos</span>
          </h4>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <div>
                <p className="font-bold text-[var(--text-main)]">SLA Máximo HITL (Resolución Humana)</p>
                <p className="text-[10px] text-[var(--text-muted)]">Tiempo límite antes de alertar al Director de Agencia</p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={thresholds.defaultSlaHitlMinutes}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, defaultSlaHitlMinutes: Number(e.target.value) }))
                  }
                  className="w-16 bg-[var(--bg-card)] border border-neon rounded px-2 py-1 text-center font-bold text-neon outline-none"
                />
                <span className="text-[var(--text-muted)] font-medium">min</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <div>
                <p className="font-bold text-[var(--text-main)]">Frecuencia Máxima Meta Ads (Fatiga Creativa)</p>
                <p className="text-[10px] text-[var(--text-muted)]">Dispara recambio creativo obligatorio de Ad Set</p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={thresholds.creativeFatigueFrequencyMax}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, creativeFatigueFrequencyMax: Number(e.target.value) }))
                  }
                  className="w-16 bg-[var(--bg-card)] border border-neon rounded px-2 py-1 text-center font-bold text-neon outline-none"
                />
                <span className="text-[var(--text-muted)] font-medium">pts</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <div>
                <p className="font-bold text-[var(--text-main)]">Hook Rate Mínimo 3s (Retención de Video)</p>
                <p className="text-[10px] text-[var(--text-muted)]">Umbral por debajo del cual el video se considera fatigado</p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={thresholds.creativeFatigueHookRateMin}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, creativeFatigueHookRateMin: Number(e.target.value) }))
                  }
                  className="w-16 bg-[var(--bg-card)] border border-neon rounded px-2 py-1 text-center font-bold text-neon outline-none"
                />
                <span className="text-[var(--text-muted)] font-medium">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
              <div>
                <p className="font-bold text-[var(--text-main)]">Ventana Cola Redis Regla 95/5 (Horas)</p>
                <p className="text-[10px] text-[var(--text-muted)]">Tiempo de incubación antes de enviar copy Vaca Púrpura</p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={thresholds.reengagementDelayHours}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, reengagementDelayHours: Number(e.target.value) }))
                  }
                  className="w-16 bg-[var(--bg-card)] border border-neon rounded px-2 py-1 text-center font-bold text-neon outline-none"
                />
                <span className="text-[var(--text-muted)] font-medium">hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Palabras Clave de Disparo PAUSED_HUMAN_TAKEOVER */}
        <div className="vector-bg-card vector-border rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span>Centinela de Crisis: Palabras Clave</span>
            </h4>
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
              Disparo en 0ms
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Cualquier mensaje que contenga estos términos congelará la IA de inmediato y cambiará el estado a{' '}
            <code className="text-red-400">PAUSED_HUMAN_TAKEOVER</code>.
          </p>

          {/* Add input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nueva palabra (ej. demandar, profeco)..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              className="flex-1 bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-red-400 rounded-xl px-3 py-2 text-xs text-[var(--text-main)] outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </button>
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap gap-2 pt-2">
            {crisisKeywordsList.map((word) => (
              <span
                key={word}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-mono flex items-center gap-1.5"
              >
                <span>{word}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(word)}
                  className="hover:text-red-800 dark:hover:text-white transition-colors"
                  title="Eliminar palabra clave"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Simulador Interactivo de Facturación Pay-Per-Lead (4 Criterios) */}
      <div className="vector-bg-card vector-border rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon" />
              <span>Simulador de Calificación de Lead Facturable (4 Criterios AND)</span>
            </h4>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
              Valida en memoria si un prospecto genera el cargo de $350 MXN o se mantiene como lead no facturable.
            </p>
          </div>

          <span
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              isBillableLead
                ? 'bg-neon/15 text-neon border-neon/40 shadow-[0_0_12px_var(--neon-glow)]'
                : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border-[var(--border-color)]'
            }`}
          >
            {isBillableLead ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-neon" />
                <span>Prospecto Calificado (+$350 MXN)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-[var(--text-muted)]" />
                <span>No Calificado (Criterios Incompletos)</span>
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Criterio 1 */}
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase">Criterio 1: Contacto</span>
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
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded px-2 py-1 text-xs text-[var(--text-main)] font-mono outline-none"
            />
            <p className="text-[9px] text-[var(--text-muted)]">Teléfono o WhatsApp estructurado</p>
          </div>

          {/* Criterio 2 */}
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase">Criterio 2: Catálogo</span>
              <input
                type="checkbox"
                checked={testLead.hasIntent}
                onChange={(e) => setTestLead((prev) => ({ ...prev, hasIntent: e.target.checked }))}
                className="accent-[var(--neon-primary)] cursor-pointer"
              />
            </div>
            <p className="text-xs font-mono font-bold text-[var(--text-main)]">
              {testLead.hasIntent ? 'Interés Explícito' : 'Pregunta Genérica'}
            </p>
            <p className="text-[9px] text-[var(--text-muted)]">Producto / servicio identificado</p>
          </div>

          {/* Criterio 3 */}
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase">Criterio 3: Calendar</span>
              <input
                type="checkbox"
                checked={testLead.hasCalendarEvent}
                onChange={(e) => setTestLead((prev) => ({ ...prev, hasCalendarEvent: e.target.checked }))}
                className="accent-[var(--neon-primary)] cursor-pointer"
              />
            </div>
            <p className="text-xs font-mono font-bold text-[var(--text-main)]">
              {testLead.hasCalendarEvent ? 'Slot Google Calendar' : 'Sin Cita en Agenda'}
            </p>
            <p className="text-[9px] text-[var(--text-muted)]">Cita agendada sin traslape</p>
          </div>

          {/* Criterio 4 */}
          <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold uppercase">Criterio 4: Consentimiento</span>
              <input
                type="checkbox"
                checked={testLead.hasConsent}
                onChange={(e) => setTestLead((prev) => ({ ...prev, hasConsent: e.target.checked }))}
                className="accent-[var(--neon-primary)] cursor-pointer"
              />
            </div>
            <p className="text-xs font-mono font-bold text-[var(--text-main)]">
              {testLead.hasConsent ? 'Aceptación Clara' : 'Sin Autorización'}
            </p>
            <p className="text-[9px] text-[var(--text-muted)]">Confirmó disponibilidad de contacto</p>
          </div>
        </div>
      </div>
    </div>
  );
};
