'use client';

import React from 'react';
import { Sparkles, FileText, Flame, MessageSquare } from 'lucide-react';

/**
 * Banner unificado Dual-Theme para mostrar la Oferta Comercial Activa del Mes
 * en las vistas del Estudio de Contenido (Parrilla y ADN de Marca).
 */
export const CommercialOfferBanner = ({
  commercialOffer = {},
  leadMagnetHook = '',
  leadMagnetCta = '',
  onEditOffer,
  variant = 'grid', // 'grid' | 'dna'
}) => {
  const effectiveHook = commercialOffer.hook || leadMagnetHook || '';
  const effectiveCta = commercialOffer.cta || leadMagnetCta || '';

  if (variant === 'dna') {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-card)] to-neon/5 border-2 border-neon/50 space-y-3 md:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-neon text-black">
              5. ANCLA COMERCIAL ACTIVA (OFERTA DEL MES VINCULADA)
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 font-bold">
              Fuente Única Activa
            </span>
          </div>
          <button
            type="button"
            onClick={onEditOffer}
            className="px-3 py-1.5 rounded-xl bg-neon text-black font-bold text-xs font-mono shadow-[0_0_12px_var(--neon-glow)] hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Actualizar Oferta Comercial & Documento</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
            <span className="text-[9px] uppercase text-[var(--text-muted)] font-bold flex items-center gap-1">
              <FileText className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              Documento de Respaldo:
            </span>
            <p className="text-xs font-bold text-[var(--text-main)] truncate">
              {commercialOffer.docName || 'Sin documento cargado'}
            </p>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 block">
              {commercialOffer.docSize ? `Tamaño: ${commercialOffer.docSize} • Listo para IA` : 'Puedes adjuntar PDF/Word'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
            <span className="text-[9px] uppercase text-[var(--text-muted)] font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-lime-700 dark:text-neon" />
              Gancho Rector Activo:
            </span>
            <p className="text-xs italic font-bold text-[var(--text-main)] line-clamp-2">
              &quot;{effectiveHook || 'Sin gancho definido'}&quot;
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
            <span className="text-[9px] uppercase text-[var(--text-muted)] font-bold flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              CTA & Vigencia:
            </span>
            <p className="text-xs font-bold text-[var(--text-main)] line-clamp-1">
              &quot;{effectiveCta || 'Escríbenos por WhatsApp'}&quot;
            </p>
            <span className="text-[9px] font-mono text-[var(--text-muted)] block">
              Vigencia: {commercialOffer.validity || 'Mes en curso'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border-2 border-neon/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md bg-neon text-black shadow-neon-sm">
            OFERTA COMERCIAL DEL MES
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            Contexto de Marca Activo
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Doc Activo:{' '}
            <strong className="text-[var(--text-main)] underline font-bold">
              {commercialOffer.docName || 'Sin documento cargado'}
            </strong>
          </span>
          {!effectiveHook && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold">
              Sin gancho configurado
            </span>
          )}
        </div>

        {effectiveHook ? (
          <div className="space-y-1">
            <p className="text-xs text-[var(--text-main)] font-bold font-mono">
              Gancho Rector:{' '}
              <span className="text-lime-700 dark:text-neon font-black">
                &quot;{effectiveHook}&quot;
              </span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)] font-mono font-medium">
              CTA de Cierre:{' '}
              <span className="text-cyan-700 dark:text-cyan-400 font-bold">
                {effectiveCta || 'Sin llamado a la acción'}
              </span>
              {commercialOffer.validity && (
                <span>
                  {' '}• Vigencia: <strong className="text-[var(--text-main)]">{commercialOffer.validity}</strong>
                </span>
              )}
            </p>
            <p className="text-[10px] font-mono text-[var(--text-muted)] pt-0.5">
              💡 <em>Este gancho y CTA se inyectan como anclas comerciales directas en cada guion generado abajo.</em>
            </p>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)] font-mono italic">
            Define el gancho comercial del mes para que los guiones de IA promuevan tu oferta insignia con autoridad.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onEditOffer}
        className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-xs font-mono font-bold text-[var(--text-main)] border border-[var(--border-color)] transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
        <span>{effectiveHook ? 'Actualizar Oferta del Mes' : 'Configurar Oferta del Mes'}</span>
      </button>
    </div>
  );
};

export default CommercialOfferBanner;
