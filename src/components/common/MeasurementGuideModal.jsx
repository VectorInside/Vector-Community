'use client';

import React, { useState } from 'react';
import { BookOpen, X, Search, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';
import { MEASUREMENT_GUIDE_ITEMS } from '@/utils/modulesRegistry';

export const MeasurementGuideModal = ({ isOpen, onClose, initialMetricId = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetricId, setSelectedMetricId] = useState(initialMetricId || 'alcance');

  if (!isOpen) return null;

  const filteredItems = MEASUREMENT_GUIDE_ITEMS.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.formula.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q)
    );
  });

  const activeMetric = MEASUREMENT_GUIDE_ITEMS.find((m) => m.id === selectedMetricId) || filteredItems[0] || MEASUREMENT_GUIDE_ITEMS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div
        className="w-full max-w-4xl bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-lime-400/15 border border-lime-400/30 text-lime-400">
              <BookOpen className="w-5 h-5 text-lime-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-[var(--text-main)]">
                  Guía de Medición & Diccionario Oficial
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/40 font-bold">
                  13 Fuentes
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Fórmulas, fuentes oficiales Meta/Google y limitaciones metodológicas transparentes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-base)] transition-colors"
            title="Cerrar guía (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
          {/* Left Column: Metric Search & List */}
          <div className="w-full md:w-80 p-4 flex flex-col bg-[var(--bg-card)]/40 shrink-0">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Buscar indicador o fórmula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredItems.map((item) => {
                const isSelected = activeMetric?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMetricId(item.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-lime-400 text-black font-bold shadow-md'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-base)]'
                    }`}
                  >
                    <span className="truncate">{item.title}</span>
                    <span className={`text-[10px] shrink-0 font-mono ${isSelected ? 'text-black/70' : 'text-[var(--text-faint)]'}`}>
                      {item.unit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Metric Card */}
          <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg-panel)] space-y-5">
            {activeMetric ? (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                      Definición Metodológica
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]">
                      Unidad: {activeMetric.unit}
                    </span>
                  </div>
                  <h2 className="font-heading font-black text-2xl text-[var(--text-main)]">
                    {activeMetric.title}
                  </h2>
                </div>

                {/* Fórmula */}
                <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-lime-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>FÓRMULA OPERATIVA</span>
                  </div>
                  <p className="text-sm font-sans text-[var(--text-main)] leading-relaxed">
                    {activeMetric.formula}
                  </p>
                </div>

                {/* Fuente y Trazabilidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                      Fuente de Extracción
                    </span>
                    <p className="text-xs font-bold text-[var(--text-main)]">
                      {activeMetric.source}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                      Periodo & Cohorte
                    </span>
                    <p className="text-xs font-bold text-[var(--text-main)]">
                      Fecha de Captación (No de Cierre)
                    </p>
                  </div>
                </div>

                {/* Limitación & Honestidad Metodológica */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>LIMITACIONES & PRINCIPIO DE TRANSPARENCIA</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {activeMetric.limitations}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-faint)]">
                  <span>Manual Operativo Vector Inside · Versión 1.0 (Octubre 2026)</span>
                  <span className="font-mono">Normado en ADR-011</span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">
                Selecciona una métrica para ver su ficha técnica completa
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
