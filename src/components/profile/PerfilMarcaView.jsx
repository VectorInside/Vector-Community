'use client';

import React, { useState, useEffect } from 'react';
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
  Smartphone,
  Globe,
  Share2,
  RefreshCw,
  Plus,
  Trash2,
  MessageSquare,
  Instagram,
  Facebook,
  Video,
  Linkedin,
} from 'lucide-react';

/**
 * Paletas de color y tono de voz por defecto según el giro del negocio
 */
const TENANT_BRAND_PRESETS = {
  dental: {
    colors: [
      { name: 'Azul Clínico', hex: '#0284C7' },
      { name: 'Celeste Médico', hex: '#38BDF8' },
      { name: 'Blanco Puro', hex: '#F0F9FF' },
      { name: 'Esmeralda Salud', hex: '#10B981' },
      { name: 'Gris Instrumental', hex: '#334155' },
    ],
    defaultTone: 'Cálido, profesional, empático y médico-clínico (sin tecnicismos alarmistas)',
  },
  restaurant: {
    colors: [
      { name: 'Borgoña Reserva', hex: '#881337' },
      { name: 'Rubí Mixología', hex: '#E11D48' },
      { name: 'Ámbar Cálido', hex: '#F59E0B' },
      { name: 'Carbón Elegante', hex: '#18181B' },
      { name: 'Dorado Acabados', hex: '#D97706' },
    ],
    defaultTone: 'Sofisticado, hospitalario, sensorial y acogedor',
  },
  polanco: {
    colors: [
      { name: 'Borgoña Reserva', hex: '#881337' },
      { name: 'Rubí Mixología', hex: '#E11D48' },
      { name: 'Ámbar Cálido', hex: '#F59E0B' },
      { name: 'Carbón Elegante', hex: '#18181B' },
      { name: 'Dorado Acabados', hex: '#D97706' },
    ],
    defaultTone: 'Sofisticado, hospitalario, sensorial y acogedor',
  },
  urban: {
    colors: [
      { name: 'Lima Streetwear', hex: '#C3F400' },
      { name: 'Violeta Neón', hex: '#8B5CF6' },
      { name: 'Negro Profundo', hex: '#09090B' },
      { name: 'Blanco Nieve', hex: '#FFFFFF' },
      { name: 'Azul Eléctrico', hex: '#3B82F6' },
    ],
    defaultTone: 'Fresco, dinámico, directo y entusiasta de la cultura sneaker y moda urbana',
  },
  realestate: {
    colors: [
      { name: 'Azul Pizarra', hex: '#0F172A' },
      { name: 'Titanio', hex: '#475569' },
      { name: 'Oro Platino', hex: '#F59E0B' },
      { name: 'Mármol Blanco', hex: '#F8FAFC' },
      { name: 'Peltre', hex: '#94A3B8' },
    ],
    defaultTone: 'Exclusivo, formal, consultivo y enfocado en plusvalía arquitectónica e inversión',
  },
  gym: {
    colors: [
      { name: 'Naranja Fuerza', hex: '#EA580C' },
      { name: 'Verde Rendimiento', hex: '#22C55E' },
      { name: 'Negro Hierro', hex: '#18181B' },
      { name: 'Gris Asfalto', hex: '#3F3F46' },
      { name: 'Amarillo Energía', hex: '#EAB308' },
    ],
    defaultTone: 'Enérgico, motivacional, directo y enfocado en disciplina física y resultados',
  },
  automotive: {
    colors: [
      { name: 'Rojo Deportivo', hex: '#DC2626' },
      { name: 'Acero Premium', hex: '#1E293B' },
      { name: 'Grafito Metálico', hex: '#64748B' },
      { name: 'Blanco Perla', hex: '#F8FAFC' },
      { name: 'Azul Eléctrico', hex: '#2563EB' },
    ],
    defaultTone: 'Dinámico, técnico, seguro y orientado a confianza y respaldo mecánico',
  },
  corp: {
    colors: [
      { name: 'Azul Marino B2B', hex: '#0F172A' },
      { name: 'Pizarra Corporativo', hex: '#334155' },
      { name: 'Cyan Telemetría', hex: '#06B6D4' },
      { name: 'Gris Titanio', hex: '#64748B' },
      { name: 'Blanco Escarcha', hex: '#F8FAFC' },
    ],
    defaultTone: 'Estratégico, formal, consultivo y enfocado en ROI y optimización de procesos',
  },
};

export const PerfilMarcaView = () => {
  const { activeTenant, activeTenantKey, updateTenantPolicy, isAdmin, isClient } = useAuth();

  // Preset resolver
  const currentPreset =
    TENANT_BRAND_PRESETS[activeTenantKey] ||
    TENANT_BRAND_PRESETS[activeTenant?.id] ||
    TENANT_BRAND_PRESETS.dental;

  // Form State initialized from activeTenant
  const [brandPurpose, setBrandPurpose] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('');
  const [slaTarget, setSlaTarget] = useState(15);
  const [brandColors, setBrandColors] = useState([]);
  const [customAvatar, setCustomAvatar] = useState('🏢');
  const [savedNotification, setSavedNotification] = useState(false);

  // Sync state whenever activeTenant changes
  useEffect(() => {
    if (activeTenant) {
      setBrandPurpose(
        activeTenant.brandPurpose ||
          'Brindar un servicio de excelencia con atención personalizada y valor medible para nuestros clientes.'
      );
      setToneOfVoice(activeTenant.toneOfVoice || currentPreset.defaultTone);
      setSlaTarget(activeTenant.slaTarget || 15);
      setBrandColors(activeTenant.brandColors || currentPreset.colors);
      setCustomAvatar(activeTenant.avatar || '🏢');
    }
  }, [activeTenantKey, activeTenant, currentPreset]);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateTenantPolicy && activeTenantKey) {
      updateTenantPolicy(activeTenantKey, {
        brandPurpose,
        toneOfVoice,
        slaTarget,
        brandColors,
        avatar: customAvatar,
      });
    }
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3500);
  };

  const handleColorChange = (index, newHex) => {
    setBrandColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hex: newHex } : c))
    );
  };

  const handleResetDefaults = () => {
    setBrandPurpose(activeTenant?.brandPurpose || currentPreset.defaultTone);
    setToneOfVoice(currentPreset.defaultTone);
    setBrandColors(currentPreset.colors);
    setSlaTarget(15);
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 font-sans">
      {/* Header Contextual por Negocio */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-extrabold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/20">
              IDENTIDAD & ADN DE MARCA
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {activeTenant?.giro || 'Servicios Profesionales'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)] flex items-center gap-2.5">
            <span>{customAvatar}</span>
            <span>{activeTenant?.name || 'Perfil de Marca'}</span>
          </h1>

          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
            Propósito del negocio, paleta cromática, tiempo de respuesta SLA y tono de voz inyectado en el motor de IA.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuración de Marca Guardada</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* =================================================================== */}
        {/* SECCIÓN 1: IDENTIDAD VISUAL DE LA EMPRESA (NO DE VECTOR INSIDE)     */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                Identidad Visual del Negocio
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Activos gráficos para Micro-Landing y Redes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tarjeta de Logotipo / Isotipo del Negocio */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block mb-1">
                  Logotipo / Isotipo de Marca
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {customAvatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-sm text-[var(--text-main)] truncate">
                      {activeTenant?.name}
                    </p>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block truncate">
                      {activeTenant?.shortName || activeTenant?.name}
                    </span>
                    <span className="text-[9px] font-mono text-neon font-bold mt-1 inline-block">
                      Activo en Micro-Landing & WhatsApp
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector de Icono / Avatar rápido */}
              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--text-muted)]">Emoji / Símbolo:</span>
                <div className="flex items-center gap-1">
                  {['🦷', '🥩', '🏙️', '🏋️', '🏎️', '👟', '💼', '🎬'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCustomAvatar(emoji)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                        customAvatar === emoji
                          ? 'bg-neon/20 border border-neon text-black dark:text-white scale-110 shadow-sm'
                          : 'bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paleta Cromática Oficial del Negocio */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block">
                    Paleta Cromática Oficial
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">
                    5 Tonos de Identidad
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 my-2">
                  {brandColors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 group">
                      <div className="relative w-full aspect-square rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange(idx, e.target.value)}
                          className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer border-0"
                          title={`Editar ${color.name}: ${color.hex}`}
                        />
                      </div>
                      <span className="text-[8px] font-mono text-[var(--text-muted)] truncate w-full text-center">
                        {color.name.split(' ')[0]}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-[var(--text-main)] uppercase">
                        {color.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[var(--text-muted)]">Aplicado en botones y llamadas de acción:</span>
                <span className="font-bold text-neon">Contraste WCAG AAA</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECCIÓN 2: PROPÓSITO DE MARCA (CÍRCULO DORADO / CONTEXTO RAG)       */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                Propósito de Marca & Círculo Dorado
              </h3>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon/10 text-neon border border-neon/30">
              Inyectado como Contexto Base en IA
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1.5 font-bold">
                Propósito Central del Negocio (El "Por Qué") *
              </label>
              <textarea
                rows={3}
                required
                value={brandPurpose}
                onChange={(e) => setBrandPurpose(e.target.value)}
                placeholder="Describe la misión y propuesta de valor única de tu negocio..."
                className="w-full p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none leading-relaxed font-sans transition-colors placeholder:text-[var(--text-muted)] text-xs"
              />
              <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                Este propósito orienta a la IA para responder con la propuesta de valor real de tu empresa, no con respuestas genéricas.
              </p>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1.5 font-bold">
                Tono de Voz Mandatorio en Respuestas de WhatsApp & Redes *
              </label>
              <input
                type="text"
                required
                value={toneOfVoice}
                onChange={(e) => setToneOfVoice(e.target.value)}
                placeholder="ej. Cálido, profesional, empático y médico-clínico"
                className="w-full p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none font-sans text-xs transition-colors"
              />
              <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                Define el estilo con el que los asistentes automatizados interactuarán con tus clientes potenciales.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECCIÓN 3: POLÍTICA DE CONTACTABILIDAD & SLA DE ATENCIÓN            */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                Política de Contactabilidad & SLA de Respuesta
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neon font-bold bg-neon/10 px-2.5 py-0.5 rounded border border-neon/20">
              Compromiso: {slaTarget} Minutos
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                    Tiempo Máximo de Primera Respuesta al Prospecto
                  </label>
                  <span className="text-[11px] text-[var(--text-muted)] font-sans">
                    Define la velocidad con la que tu equipo o IA debe contactar al lead tras registrarse.
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 px-3 py-1 rounded-xl bg-neon/15 border border-neon/30 text-neon font-mono">
                  <span className="text-xl font-heading font-black">{slaTarget}</span>
                  <span className="text-xs font-bold">min</span>
                </div>
              </div>

              {/* Botones de Selección Rápida (Presets de 1-Click) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { value: 5, label: '5 min', desc: 'Inmediato (Ultra Rápido)' },
                  { value: 15, label: '15 min', desc: 'Recomendado ★ (Alta Conversión)', recommended: true },
                  { value: 30, label: '30 min', desc: 'Moderado (Estándar)' },
                  { value: 60, label: '60 min', desc: 'Máximo Permitido' },
                ].map((preset) => {
                  const isSelected = slaTarget === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSlaTarget(preset.value)}
                      className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'bg-neon/15 border-neon ring-1 ring-neon/50 shadow-sm'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-neon/40 hover:bg-[var(--bg-card-subtle)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-heading font-black font-mono ${
                          isSelected ? 'text-neon' : 'text-[var(--text-main)]'
                        }`}>
                          {preset.label}
                        </span>
                        {preset.recommended && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-neon text-black font-black uppercase">
                            Óptimo
                          </span>
                        )}
                        {isSelected && !preset.recommended && (
                          <Check className="w-3.5 h-3.5 text-neon" />
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block line-clamp-1 font-sans">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Slider de Ajuste Continuo y Preciso */}
              <div className="space-y-2 pt-2">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={slaTarget}
                    onChange={(e) => setSlaTarget(Number(e.target.value))}
                    className="w-full accent-neon cursor-pointer h-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]"
                  />
                </div>

                {/* Marcadores con Posicionamiento Matemático Real */}
                <div className="relative w-full h-5 text-[10px] font-mono text-[var(--text-muted)] select-none">
                  {[
                    { value: 5, label: '5 min' },
                    { value: 15, label: '15 min' },
                    { value: 30, label: '30 min' },
                    { value: 45, label: '45 min' },
                    { value: 60, label: '60 min' },
                  ].map((tick) => {
                    // Cálculo porcentual exacto: (value - 5) / (60 - 5) * 100
                    const percent = ((tick.value - 5) / 55) * 100;
                    const isSelected = slaTarget === tick.value;
                    return (
                      <button
                        key={tick.value}
                        type="button"
                        onClick={() => setSlaTarget(tick.value)}
                        style={{ left: `${percent}%` }}
                        className={`absolute -translate-x-1/2 cursor-pointer hover:text-neon transition-colors ${
                          isSelected ? 'text-neon font-bold' : ''
                        }`}
                      >
                        {tick.label}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-[var(--text-muted)] font-mono pt-1">
                  Cualquier mensaje entrante de un prospecto que exceda {slaTarget} minutos sin ser atendido activará una alerta en el Centro de Mando.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECCIÓN 4: CANALES Y REDES CONECTADAS                               */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-neon" />
              <h3 className="font-heading font-black text-sm text-[var(--text-main)] uppercase tracking-wide">
                Canales Oficiales del Negocio
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Atribución directa Meta & Web
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">WhatsApp Cloud</p>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">Activo</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <Instagram className="w-4 h-4 text-pink-500" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">Instagram DM</p>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">Sincronizado</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <Facebook className="w-4 h-4 text-blue-500" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">Facebook Page</p>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">Conectado</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">
                  {activeTenant?.hasWebsite ? 'Sitio Web' : 'Micro-Landing'}
                </p>
                <span className="text-[9px] font-mono text-cyan-400 font-bold">
                  {activeTenant?.hasWebsite ? 'GA4 Activo' : 'Alojada en Vector'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones del Formulario */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-neon flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer valores predeterminados</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95"
          >
            <Save className="w-4 h-4 text-black" />
            <span>Guardar Configuración de {activeTenant?.shortName || 'Marca'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
