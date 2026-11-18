'use client';

import React, { useState, useMemo } from 'react';
import { Lock, Plus, Trash2, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';

/**
 * Editor CRUD Dual-Theme reutilizable para reglas inviolables (`inviolableRules`).
 * Compatible con RAGWizard, BusinessPolicyEngine y PerfilMarcaView.
 * Evita etiquetas <form> internas para poder anidarse dentro de formularios padre sin conflictos.
 */
export const InviolableRulesEditor = ({
  rules = [],
  onChange,
  suggestedRules = [],
  suggestionLabel = 'Cargar sugerencias del giro',
  showSuggestionChips = false,
  title = 'Reglas Inviolables & Guardrails Operativos',
  subtitle = 'Directrices inquebrantables que la IA respetará obligatoriamente en todas las interacciones.',
  placeholder = 'Ej: Precios sujetos a valoración presencial, no dar diagnósticos por chat...',
  emptyMessage = 'No hay reglas inviolables configuradas. Agrega directrices específicas o carga sugerencias recomendadas.',
  addButtonLabel = 'Agregar Regla',
  layout = 'list', // 'list' | 'grid'
  showHeader = true,
  showClearAll = true,
  disabled = false,
  className = '',
}) => {
  const [newRuleInput, setNewRuleInput] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  const normalizedRules = useMemo(
    () => (Array.isArray(rules) ? rules.filter((r) => typeof r === 'string' && r.trim().length > 0) : []),
    [rules]
  );

  // Construir claves React estables incluso si existen duplicados heredados
  const keyedRules = useMemo(() => {
    const seen = new Map();
    return normalizedRules.map((rule) => {
      const normalized = rule.trim();
      const count = (seen.get(normalized) || 0) + 1;
      seen.set(normalized, count);
      return {
        text: rule,
        stableKey: count === 1 ? normalized : `${normalized}__dup_${count}`,
      };
    });
  }, [normalizedRules]);

  const availableSuggestions = useMemo(() => {
    if (!Array.isArray(suggestedRules) || suggestedRules.length === 0) return [];
    const existingSet = new Set(normalizedRules.map((r) => r.trim().toLowerCase()));
    return suggestedRules.filter(
      (s) => typeof s === 'string' && s.trim().length > 0 && !existingSet.has(s.trim().toLowerCase())
    );
  }, [suggestedRules, normalizedRules]);

  const handleAddRule = (ruleOverride) => {
    if (disabled || !onChange) return;
    const candidate = String(ruleOverride ?? newRuleInput).trim();
    if (!candidate) return;

    const alreadyExists = normalizedRules.some(
      (r) => r.trim().toLowerCase() === candidate.toLowerCase()
    );
    if (alreadyExists) {
      setDuplicateWarning(true);
      return;
    }

    setDuplicateWarning(false);
    onChange([...normalizedRules, candidate]);
    if (ruleOverride === undefined) {
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (targetKey) => {
    if (disabled || !onChange) return;
    const targetItem = keyedRules.find((item) => item.stableKey === targetKey);
    if (!targetItem) return;
    let removed = false;
    const next = keyedRules
      .filter((item) => {
        if (!removed && item.stableKey === targetKey) {
          removed = true;
          return false;
        }
        return true;
      })
      .map((item) => item.text);
    onChange(next);
  };

  const handleLoadAllSuggestions = () => {
    if (disabled || !onChange || availableSuggestions.length === 0) return;
    setDuplicateWarning(false);
    onChange([...normalizedRules, ...availableSuggestions]);
  };

  const handleClearAll = () => {
    if (disabled || !onChange) return;
    setDuplicateWarning(false);
    onChange([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neon/15 border border-neon/30 text-lime-700 dark:text-neon shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] uppercase tracking-wide font-mono">
                  {title}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                  {normalizedRules.length} {normalizedRules.length === 1 ? 'Regla Activa' : 'Reglas Activas'}
                </span>
              </div>
              {subtitle && (
                <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {availableSuggestions.length > 0 && normalizedRules.length === 0 && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleLoadAllSuggestions}
                className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 hover:bg-neon/25 transition-all inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{suggestionLabel}</span>
              </button>
            )}

            {showClearAll && normalizedRules.length > 0 && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleClearAll}
                className="text-xs font-mono text-rose-600 dark:text-rose-400 hover:underline px-2 py-1 disabled:opacity-50"
              >
                Limpiar todas
              </button>
            )}
          </div>
        </div>
      )}

      {/* Input para agregar nueva regla */}
      <div className="space-y-1.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Lock className="w-3.5 h-3.5 text-lime-700 dark:text-neon absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              disabled={disabled}
              value={newRuleInput}
              onChange={(e) => {
                setNewRuleInput(e.target.value);
                if (duplicateWarning) setDuplicateWarning(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRule();
                }
              }}
              placeholder={placeholder}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] outline-none font-mono transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="button"
            disabled={disabled || !newRuleInput.trim()}
            onClick={() => handleAddRule()}
            className="px-4 py-2.5 bg-neon text-black font-mono font-bold text-xs rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{addButtonLabel}</span>
          </button>
        </div>

        {duplicateWarning && (
          <p className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
            Esta regla ya se encuentra activa en la lista.
          </p>
        )}
      </div>

      {/* Sugerencias rápidas opcionales tipo chips */}
      {showSuggestionChips && availableSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase mr-1">
            Sugerencias rápidas:
          </span>
          {availableSuggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              disabled={disabled}
              onClick={() => handleAddRule(sug)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:border-neon/50 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors inline-flex items-center gap-1 disabled:opacity-50"
              title="Agregar regla sugerida"
            >
              <Plus className="w-3 h-3 text-lime-700 dark:text-neon shrink-0" />
              <span className="truncate max-w-[260px]">{sug}</span>
            </button>
          ))}
        </div>
      )}

      {/* Lista o Grid de Reglas */}
      {keyedRules.length === 0 ? (
        <div className="p-5 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] text-center space-y-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto" />
          <p className="text-xs font-mono text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            {emptyMessage}
          </p>
          {availableSuggestions.length > 0 && (
            <button
              type="button"
              disabled={disabled}
              onClick={handleLoadAllSuggestions}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl bg-neon text-black hover:bg-[var(--neon-hover)] transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {suggestionLabel} ({availableSuggestions.length})
              </span>
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
              : 'space-y-2'
          }
        >
          {keyedRules.map((item, idx) => (
            <div
              key={item.stableKey}
              className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon/40 flex items-start justify-between gap-3 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neon/15 text-lime-700 dark:text-neon border border-neon/30 shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <p className="text-xs text-[var(--text-main)] font-mono leading-relaxed break-words">
                  {item.text}
                </p>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleRemoveRule(item.stableKey)}
                className="text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0 disabled:opacity-40"
                title="Eliminar regla"
                aria-label={`Eliminar regla ${idx + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InviolableRulesEditor;
