'use client';

import React, { useState } from 'react';
import { Portal } from '@/components/common/Portal';
import {
  X,
  Smartphone,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  Share2,
  MessageCircle,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';

export const MobileSyncModal = ({ isOpen, onClose, tenant }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWebcal, setCopiedWebcal] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'gcal' | 'apple'

  if (!isOpen) return null;

  const tenantName = tenant?.name || 'Mi Negocio';
  const tenantId = tenant?.id || 'dental';
  const mobileAgendaUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/agenda?tenant=${tenantId}`
    : `https://vectorinside.app/agenda?tenant=${tenantId}`;
  
  const gcalSubscribeUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(`webcal://api.vectorinside.app/cal/${tenantId}/events.ics`)}`;
  const webcalUrl = `webcal://api.vectorinside.app/cal/${tenantId}/events.ics`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedWebcal(true);
      setTimeout(() => setCopiedWebcal(false), 2000);
    }
    try {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `📅 Acceso a la Master Agenda Móvil de ${tenantName}:\n${mobileAgendaUrl}\n\nSincroniza con Google Calendar aquí:\n${gcalSubscribeUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-xl rounded-3xl bg-[var(--bg-panel)] border border-neon/50 shadow-2xl p-6 relative space-y-5 my-auto animate-scale-up font-sans">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shadow-[0_0_15px_var(--neon-glow)]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-neon" />
                  Sincronización Móvil & Google Calendar
                </span>
                <h3 className="text-xl font-heading font-black text-[var(--text-main)] uppercase tracking-tight">
                  Lleva tu Agenda en el Celular
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {tenantName} • Google Calendar 2-Way Sync en tiempo real
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'qr'
                  ? 'bg-neon text-black shadow-[0_0_10px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Código QR Celular</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gcal')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'gcal'
                  ? 'bg-neon text-black shadow-[0_0_10px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Google Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('apple')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'apple'
                  ? 'bg-neon text-black shadow-[0_0_10px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Apple / iOS</span>
            </button>
          </div>

          {/* PESTAÑA 1: CÓDIGO QR */}
          {activeTab === 'qr' && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="p-6 rounded-2xl bg-white border border-zinc-200 inline-block shadow-xl mx-auto">
                {/* QR Code SVG simulado de alta fidelidad */}
                <div className="w-44 h-44 mx-auto flex flex-col items-center justify-center relative">
                  <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                    {/* Marcadores de posición en las esquinas */}
                    <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="black" strokeWidth="4" />
                    <rect x="10" y="10" width="15" height="15" rx="2" fill="black" />
                    <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="black" strokeWidth="4" />
                    <rect x="75" y="10" width="15" height="15" rx="2" fill="black" />
                    <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="black" strokeWidth="4" />
                    <rect x="10" y="75" width="15" height="15" rx="2" fill="black" />
                    {/* Patrón de datos matriciales */}
                    <rect x="36" y="8" width="6" height="6" />
                    <rect x="46" y="8" width="6" height="6" />
                    <rect x="56" y="8" width="6" height="6" />
                    <rect x="36" y="18" width="6" height="6" />
                    <rect x="56" y="18" width="6" height="6" />
                    <rect x="36" y="28" width="6" height="6" />
                    <rect x="46" y="28" width="6" height="6" />
                    <rect x="8" y="36" width="6" height="6" />
                    <rect x="18" y="36" width="6" height="6" />
                    <rect x="28" y="36" width="6" height="6" />
                    <rect x="38" y="38" width="6" height="6" />
                    <rect x="48" y="38" width="6" height="6" />
                    <rect x="58" y="38" width="6" height="6" />
                    <rect x="68" y="36" width="6" height="6" />
                    <rect x="78" y="36" width="6" height="6" />
                    <rect x="88" y="36" width="6" height="6" />
                    <rect x="38" y="48" width="24" height="6" fill="#10B981" />
                    <rect x="8" y="46" width="6" height="6" />
                    <rect x="28" y="46" width="6" height="6" />
                    <rect x="68" y="46" width="6" height="6" />
                    <rect x="88" y="46" width="6" height="6" />
                    <rect x="8" y="56" width="6" height="6" />
                    <rect x="18" y="56" width="6" height="6" />
                    <rect x="38" y="58" width="6" height="6" />
                    <rect x="58" y="58" width="6" height="6" />
                    <rect x="78" y="56" width="6" height="6" />
                    <rect x="36" y="70" width="6" height="6" />
                    <rect x="46" y="70" width="6" height="6" />
                    <rect x="56" y="70" width="6" height="6" />
                    <rect x="70" y="70" width="6" height="6" />
                    <rect x="80" y="70" width="6" height="6" />
                    <rect x="90" y="70" width="6" height="6" />
                    <rect x="36" y="80" width="6" height="6" />
                    <rect x="56" y="80" width="6" height="6" />
                    <rect x="70" y="80" width="6" height="6" />
                    <rect x="80" y="80" width="6" height="6" />
                    <rect x="36" y="90" width="6" height="6" />
                    <rect x="46" y="90" width="6" height="6" />
                    <rect x="66" y="90" width="6" height="6" />
                    <rect x="86" y="90" width="6" height="6" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-lg bg-black border-2 border-neon flex items-center justify-center text-neon font-black text-xs shadow-lg">
                      VI
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-[var(--text-main)]">
                  Apunta con la cámara de tu smartphone
                </p>
                <p className="text-[11px] text-[var(--text-muted)] font-mono max-w-sm mx-auto">
                  Abre la aplicación de agenda móvil optimizada para tu equipo con acceso biométrico y notificaciones instantáneas de citas.
                </p>
              </div>

              {/* Botón copiar link directo */}
              <div className="flex items-center gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  readOnly
                  value={mobileAgendaUrl}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)] truncate"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(mobileAgendaUrl, 'link')}
                  className="px-3.5 py-2 rounded-xl bg-neon text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_10px_var(--neon-glow)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: GOOGLE CALENDAR */}
          {activeTab === 'gcal' && (
            <div className="space-y-4 animate-fade-in text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Suscripción Bidireccional Automática</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Al suscribirte, cada cita que el Lobo Vectorial o tu equipo confirmen en WhatsApp o en este panel aparecerá <strong>automáticamente en tu app de Google Calendar</strong> en tu Android o iPhone.
                </p>

                <div className="pt-2">
                  <a
                    href={gcalSubscribeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-neon text-black font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_var(--neon-glow)] hover:scale-[1.02] active:scale-98 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Abrir y Añadir a mi Google Calendar Ahora</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1.5 text-[11px]">
                <strong className="text-[var(--text-main)] block">¿Cómo funciona el Handshake?</strong>
                <p className="text-[var(--text-muted)]">
                  • Citas confirmadas en WhatsApp se registran con bloqueo de horario.<br />
                  • Si creas un evento en tu Google Calendar con la palabra "Bloqueado", la IA respetará ese espacio y no lo ofrecerá a prospectos.
                </p>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: APPLE CALENDAR / WEBCAL */}
          {activeTab === 'apple' && (
            <div className="space-y-4 animate-fade-in text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-center gap-2 text-blue-500 font-bold">
                  <Smartphone className="w-4 h-4" />
                  <span>Enlace WebCal (Apple Calendar / iPhone / Mac)</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Para sincronizar con la app nativa <strong>Calendario de iPhone / iPad / Mac</strong>, suscríbete al feed encriptado RFC 5545 con actualización periódica:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webcalUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] truncate"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(webcalUrl, 'webcal')}
                    className="px-3.5 py-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedWebcal ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="pt-2">
                  <a
                    href={webcalUrl}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Suscribir en Calendario de iPhone / Mac</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] space-y-1">
                <strong className="text-[var(--text-main)] block">Instrucciones iPhone:</strong>
                <p>1. Ve a Ajustes &gt; Calendario &gt; Cuentas &gt; Añadir cuenta &gt; Otros &gt; Añadir calendario suscrito.</p>
                <p>2. Pega la URL WebCal de arriba y pulsa Guardar.</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={handleShareWhatsapp}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enviar por WhatsApp a mi Celular</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] font-bold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
