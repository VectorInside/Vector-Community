'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Portal } from '@/components/common/Portal';
import {
  X,
  Smartphone,
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  Zap,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { calendarService } from '@/services/calendarService';

export const MobileSyncModal = ({ isOpen, onClose, tenant }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'gcal' | 'apple'
  const [isDownloadingIcs, setIsDownloadingIcs] = useState(false);
  const [icsError, setIcsError] = useState(null);
  const qrCanvasRef = useRef(null);

  const tenantName = tenant?.name || 'Sin negocio seleccionado';
  const tenantId = tenant?.id || '';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  const mobileAgendaUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/agenda${tenantId ? `?tenant=${tenantId}` : ''}`
    : `/agenda${tenantId ? `?tenant=${tenantId}` : ''}`;

  const backendIcsEndpoint = `${apiBaseUrl}/appointments/feed.ics${tenantId ? `?tenantId=${tenantId}` : ''}`;
  const webcalUrl = backendIcsEndpoint.replace(/^https?:\/\//i, 'webcal://');
  const googleCalendarSubscribeUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`;
  const googleCalendarImportUrl = 'https://calendar.google.com/calendar/r/settings/export';

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow || 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'qr' || !qrCanvasRef.current || !mobileAgendaUrl) return;
    QRCode.toCanvas(
      qrCanvasRef.current,
      mobileAgendaUrl,
      {
        width: 148,
        margin: 1,
        color: {
          dark: '#09090b',
          light: '#ffffff',
        },
      },
      () => {}
    );
  }, [isOpen, activeTab, mobileAgendaUrl]);

  if (!isOpen) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedEndpoint(true);
      setTimeout(() => setCopiedEndpoint(false), 2000);
    }
    try {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleDownloadNextIcs = async () => {
    setIcsError(null);
    setIsDownloadingIcs(true);
    try {
      const appointments = await calendarService.getAppointments(tenantId);
      const activeApt = Array.isArray(appointments)
        ? appointments.find((a) => a.status !== 'CANCELLED') || appointments[0]
        : null;

      if (!activeApt?.id) {
        setIcsError('No hay citas registradas en este negocio para exportar a .ICS.');
        return;
      }

      const icsUrl = calendarService.getIcsDownloadUrl(activeApt.id);
      window.open(icsUrl, '_blank', 'noopener,noreferrer');
      try {
        confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      setIcsError(err?.message || 'No se pudo obtener el archivo .ICS desde el backend.');
    } finally {
      setIsDownloadingIcs(false);
    }
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `📅 Acceso a Agenda y Citas Móvil de ${tenantName}:\n${mobileAgendaUrl}\n\nSuscríbete o importa tus citas en Google Calendar desde:\n${googleCalendarSubscribeUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const renderSharedIcsDownloadButton = (label, variant = 'neon') => (
    <button
      type="button"
      onClick={handleDownloadNextIcs}
      disabled={isDownloadingIcs}
      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
        variant === 'blue'
          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
          : 'bg-neon text-black shadow-[0_0_15px_var(--neon-glow)] hover:scale-[1.01] active:scale-98'
      }`}
    >
      <Download className="w-4 h-4" />
      <span>{isDownloadingIcs ? 'Descargando .ICS...' : label}</span>
    </button>
  );

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-xl rounded-3xl bg-[var(--bg-panel)] border border-neon/50 shadow-2xl p-6 relative space-y-5 my-auto animate-scale-up font-sans">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-neon/15 border border-neon/30 flex items-center justify-center text-[var(--neon-text)] shadow-[0_0_15px_var(--neon-glow)]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--neon-text)] tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[var(--neon-text)]" />
                  Sincronización Móvil &amp; Google Calendar
                </span>
                <h3 className="text-xl font-heading font-black text-[var(--text-main)] uppercase tracking-tight">
                  Lleva tu Agenda en el Celular
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {tenantName} • Código QR, suscripción Webcal y archivo .ICS
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
              <span>QR &amp; Enlace Móvil</span>
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

          {/* Alerta global de error .ICS visible en todas las pestañas */}
          {icsError && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-[11px] font-mono flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{icsError}</span>
            </div>
          )}

          {/* Contenedor con altura estable min-h-[380px] para cero CLS entre pestañas */}
          <div className="min-h-[380px] flex flex-col justify-between">
            {/* PESTAÑA 1: QR REAL + ENLACE DIRECTO VERIFICABLE */}
            {activeTab === 'qr' && (
              <div className="space-y-4 animate-fade-in text-xs font-mono flex-1 flex flex-col justify-between">
                <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--neon-text)] font-bold">
                      <QrCode className="w-4 h-4" />
                      <span>Escanea con tu Smartphone</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      URL Activa
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-2.5 rounded-2xl bg-white border border-[var(--border-color)] shadow-sm shrink-0">
                      <canvas
                        ref={qrCanvasRef}
                        width={148}
                        height={148}
                        aria-label={`Código QR para abrir Agenda y Citas de ${tenantName}`}
                        className="block rounded-lg"
                      />
                    </div>
                    <div className="space-y-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
                      <p>
                        Apunta la cámara de tu teléfono al código QR para abrir <strong>Agenda y Citas</strong> de <strong>{tenantName}</strong> en tiempo real, o copia el enlace directo abajo.
                      </p>
                      <p className="text-[10px]">
                        También puedes suscribirte con <code className="text-[var(--text-main)]">webcal://</code> o descargar la próxima cita en formato <strong>.ICS (RFC 5545)</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Bloque de enlace directo verificable */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      readOnly
                      value={mobileAgendaUrl}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] truncate select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(mobileAgendaUrl, 'link')}
                      className="px-3.5 py-2.5 rounded-xl bg-neon text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_10px_var(--neon-glow)] hover:scale-105 active:scale-95 transition-all shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
                    </button>
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    {renderSharedIcsDownloadButton('Descargar Archivo .ICS Real')}
                    <a
                      href={mobileAgendaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Abrir Enlace Directo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: GOOGLE CALENDAR */}
            {activeTab === 'gcal' && (
              <div className="space-y-4 animate-fade-in text-xs font-mono flex-1 flex flex-col justify-between">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Suscripción en Vivo &amp; Importación a Google Calendar</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Suscríbete directamente mediante el enlace de calendario (<code className="text-[var(--text-main)]">cid=webcal://...</code>) o descarga el archivo <strong>.ICS</strong> desde PostgreSQL para importarlo en Google Calendar.
                  </p>

                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <a
                      href={googleCalendarSubscribeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-neon text-black font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_var(--neon-glow)] hover:scale-[1.01] transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Suscribir en Google Calendar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {renderSharedIcsDownloadButton('Descargar .ICS desde Backend')}
                  </div>

                  <div className="pt-1">
                    <a
                      href={googleCalendarImportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-4 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Abrir Importador Manual de Google Calendar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1.5 text-[11px]">
                  <strong className="text-[var(--text-main)] block">¿Cómo funciona la sincronización?</strong>
                  <p className="text-[var(--text-muted)]">
                    • Suscripción Webcal activa: <code className="text-[var(--text-main)] break-all">{webcalUrl}</code>.<br />
                    • También puedes abrir cada cita en <strong>Agenda y Citas</strong> y usar <strong>&quot;Añadir a Google Calendar&quot;</strong> al instante.
                  </p>
                </div>
              </div>
            )}

            {/* PESTAÑA 3: APPLE CALENDAR / .ICS / WEBCAL */}
            {activeTab === 'apple' && (
              <div className="space-y-4 animate-fade-in text-xs font-mono flex-1 flex flex-col justify-between">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>Suscripción Webcal &amp; .ICS (Apple Calendar / iPhone / Mac)</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Suscríbete con un clic usando el protocolo nativo <strong>webcal://</strong> en iPhone/iPad/Mac, o descarga el archivo <strong>.ICS (RFC 5545)</strong> para importación puntual:
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webcalUrl}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-main)] truncate select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(webcalUrl, 'endpoint')}
                      className="px-3.5 py-2 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedEndpoint ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <a
                      href={webcalUrl}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-blue-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Suscribir vía webcal://</span>
                    </a>
                    {renderSharedIcsDownloadButton('Descargar Archivo .ICS', 'blue')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] space-y-1">
                  <strong className="text-[var(--text-main)] block">Instrucciones iPhone / Mac:</strong>
                  <p>1. Pulsa &quot;Suscribir vía webcal://&quot; para sincronización continua o &quot;Descargar Archivo .ICS&quot; para un evento individual.</p>
                  <p>2. Al abrir en Safari o Mail, iOS/macOS añadirá las citas directamente a la app nativa Calendario.</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={handleShareWhatsapp}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-all"
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
