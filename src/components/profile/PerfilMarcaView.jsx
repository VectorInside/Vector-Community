'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  Building,
  Target,
  Palette,
  Check,
} from 'lucide-react';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';

export const PerfilMarcaView = () => {
  const { activeTenant, isAdmin } = useAuth();

  const [slaTarget, setSlaTarget] = useState(15);
  const [brandPurpose, setBrandPurpose] = useState(
    'Acelerar el crecimiento de empresas mediante estrategias de marketing, contenido pertinente y seguimiento comercial que convierte la atención en clientes leales.'
  );
  const [toneOfVoice, setToneOfVoice] = useState('Estratégico, cercano, humano y concreto');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime-400 font-extrabold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
              ADMINISTRACIÓN / ADN DE MARCA
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Espacio: {activeTenant?.name || 'Vector Inside'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Perfil de Marca & Reglas de Voz
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Configuración del propósito institucional, objetivos de tiempo de respuesta y tono de los sub-agentes.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perfil actualizado</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identidad Visual Oficial */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-lime-400" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                Identidad Visual Oficial
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Normado en ADR-009 / ADR-011
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] flex flex-col items-center justify-center gap-2 text-center">
              <VectorInsideLogo variant="official" size="md" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                Wordmark Oficial (Activo horizontal en Navbar)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] flex flex-col items-center justify-center gap-2 text-center">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#101114] border border-[#303139]" title="Fondo #101114" />
                <span className="w-6 h-6 rounded-lg bg-[#191a1f] border border-[#303139]" title="Panel #191A1F" />
                <span className="w-6 h-6 rounded-lg bg-[#c3f400]" title="Lima #C3F400" />
                <span className="w-6 h-6 rounded-lg bg-[#aa8bfb]" title="Morado #AA8BFB" />
                <span className="w-6 h-6 rounded-lg bg-[#80b8ff]" title="Azul #80B8FF" />
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                Paleta Primaria: Negro Carbón, Lima Eléctrica, Morado y Azul
              </span>
            </div>
          </div>
        </div>

        {/* Propósito de Marca (Círculo Dorado) */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Target className="w-4 h-4 text-lime-400" />
            <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
              Propósito de Marca & Círculo Dorado
            </h3>
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1.5 font-bold">
                Propósito Central (Inyectado como System Prompt Base en RAG)
              </label>
              <textarea
                rows={3}
                value={brandPurpose}
                onChange={(e) => setBrandPurpose(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-lime-400 outline-none leading-relaxed"
              />
              <p className="text-[10px] text-[var(--text-faint)] mt-1 font-mono">
                Define el "Por Qué" antes de vender cualquier producto o servicio.
              </p>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1.5 font-bold">
                Tono de Voz Mandatorio
              </label>
              <input
                type="text"
                value={toneOfVoice}
                onChange={(e) => setToneOfVoice(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-lime-400 outline-none font-sans"
              />
            </div>
          </div>
        </div>

        {/* SLA Interno de Atención */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime-400" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                Política de Contactabilidad & SLA de Respuesta
              </h3>
            </div>
            <span className="text-[10px] font-mono text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
              Objetivo: {slaTarget} Minutos
            </span>
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1.5 font-bold">
                Tiempo Máximo de Primera Respuesta Humana / Aprobada (Minutos)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={slaTarget}
                  onChange={(e) => setSlaTarget(Number(e.target.value))}
                  className="w-full sm:w-80 accent-lime-400 cursor-pointer"
                />
                <span className="font-mono font-black text-sm text-[var(--text-main)]">
                  {slaTarget} min
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-faint)] mt-1 font-mono">
                Las conversaciones sin atender que superen este umbral activarán alertas rojas en el Centro de Mando.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-lime-400 text-black font-mono font-black text-xs uppercase flex items-center gap-2 hover:bg-lime-300 transition-all shadow-md active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración de Marca</span>
          </button>
        </div>
      </form>
    </div>
  );
};
