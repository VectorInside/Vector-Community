'use client';

import React, { useState } from 'react';
import { Portal } from '@/components/common/Portal';
import {
  X,
  Mail,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Monitor,
  Send,
  Sparkles,
  ShieldCheck,
  Building2,
  Paperclip,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import { formatDateTime } from '@/utils/formatters';

// Helper to format Date for iCal RFC 5545 (e.g. 20261023T110000Z)
function formatIcsDate(dateObj) {
  const pad = (n) => String(n).padStart(2, '0');
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isNaN(d.getTime())) {
    return '20261023T170000Z';
  }
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

// Generate RFC 5545 .ics calendar file content
export function generateIcsContent(apt, tenant) {
  const tenantName = tenant?.name || 'Vector Inside';
  const title = apt?.title || `Cita: ${apt?.serviceName || 'Servicio'} con ${tenantName}`;
  const details = `${apt?.details || 'Cita confirmada en Vector Inside'}. Especialista: ${apt?.specialist || 'Asignado'}. Teléfono: ${apt?.phone || 'N/A'}`;
  const location = tenant?.address || 'Av. Insurgentes Sur 1234, CDMX';

  const startIso = apt?.start ? new Date(apt.start) : new Date('2026-10-23T11:00:00');
  const endIso = apt?.end ? new Date(apt.end) : new Date(startIso.getTime() + 45 * 60 * 1000);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vector Inside//Master Agenda v4.0//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${apt?.id || 'apt-event'}-${Date.now()}@vectorinside.app`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startIso)}`,
    `DTEND:${formatIcsDate(endIso)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio de Cita en ${tenantName}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// Trigger browser download of .ics file
export function triggerIcsDownload(apt, tenant) {
  const content = generateIcsContent(apt, tenant);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cita-${apt?.id || 'confirmada'}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate Google Calendar direct URL
export function getGoogleCalendarUrl(apt, tenant) {
  const tenantName = tenant?.name || 'Vector Inside';
  const title = encodeURIComponent(apt?.title || `Cita: ${apt?.serviceName || 'Servicio'} - ${tenantName}`);
  const details = encodeURIComponent(
    `Cita confirmada en ${tenantName}.\nEspecialista: ${apt?.specialist || 'Asignado'}\nCliente: ${apt?.client || 'N/A'}\nTeléfono: ${apt?.phone || 'N/A'}\nDetalles: ${apt?.details || 'N/A'}`
  );
  const location = encodeURIComponent(tenant?.address || 'Av. Insurgentes Sur 1234, CDMX');

  const startIso = apt?.start ? new Date(apt.start) : new Date('2026-10-23T11:00:00');
  const endIso = apt?.end ? new Date(apt.end) : new Date(startIso.getTime() + 45 * 60 * 1000);

  const startFormatted = formatIcsDate(startIso);
  const endFormatted = formatIcsDate(endIso);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}`;
}

export const AppointmentConfirmationEmailModal = ({
  isOpen,
  onClose,
  appointment,
  tenant,
  emailConfig,
  onSendSuccess,
}) => {
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'mobile'
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Editable fields
  const [recipientEmail, setRecipientEmail] = useState(
    appointment?.clientEmail || `${appointment?.client?.toLowerCase().replace(/\s+/g, '.') || 'cliente'}@gmail.com`
  );
  const [customNotes, setCustomNotes] = useState(
    'Por favor presentarse con 10 minutos de anticipación e identificación oficial.'
  );

  if (!isOpen || !appointment) return null;

  const tenantName = tenant?.name || 'Clínica Odontológica Integral';
  const tenantAvatar = tenant?.avatar || '🏢';
  const accentColor = emailConfig?.accentColor || '#D4FF00';
  const senderEmail = emailConfig?.senderEmail || `citas@${tenant?.id || 'negocio'}.com`;

  const googleCalUrl = getGoogleCalendarUrl(appointment, tenant);

  const handleDownloadIcs = () => {
    triggerIcsDownload(appointment, tenant);
    try {
      confetti({ particleCount: 20, spread: 40 });
    } catch (e) {}
  };

  const handleSendEmail = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#10B981', '#38BDF8'],
        });
      } catch (e) {}

      if (onSendSuccess) {
        onSendSuccess(appointment);
      }

      setTimeout(() => {
        setSentSuccess(false);
      }, 4000);
    }, 700);
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `¡Hola ${appointment.client}! Te confirmamos tu cita en ${tenantName}:\n\n🗓️ Fecha: ${appointment.hour || '11:00'} hrs (${appointment.dayId?.toUpperCase() || 'VIE'})\n🩺 Servicio: ${appointment.serviceName || appointment.title}\n📍 Ubicación: ${emailConfig?.locationAddress || 'Av. Insurgentes Sur 1234'}\n\nAgrega la cita a tu Google Calendar:\n${googleCalUrl}`
    );
    window.open(`https://wa.me/${appointment.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-4xl rounded-3xl bg-[var(--bg-panel)] border border-neon/50 shadow-2xl p-4 sm:p-6 relative flex flex-col max-h-[94vh] overflow-hidden my-auto animate-scale-up font-sans">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[var(--border-color)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shadow-[0_0_15px_var(--neon-glow)]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-neon" />
                  Correo Personalizado de Confirmación de Cita
                </span>
                <h3 className="text-xl font-heading font-black text-[var(--text-main)] uppercase tracking-tight">
                  Despacho de Confirmación con Google Calendar (.ICS)
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {tenantName} • Cliente: <strong className="text-[var(--text-main)]">{appointment.client}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Preview Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
                    deviceView === 'desktop'
                      ? 'bg-neon text-black font-bold shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Vista Escritorio"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
                    deviceView === 'mobile'
                      ? 'bg-neon text-black font-bold shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Vista Celular / Móvil"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Móvil</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formulario Rápido de Destinatario */}
          <div className="py-2.5 px-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono shrink-0 my-3">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Destinatario:</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-[var(--text-main)] text-xs font-bold focus:border-neon outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Teléfono WhatsApp:</label>
              <div className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-emerald-600 dark:text-emerald-400 font-bold">
                {appointment.phone || '+52 55 0000 0000'}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Estado de Pago:</label>
              <div className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{appointment.depositPaid ? 'Anticipo Verificado' : 'Pago en Recepción'}</span>
              </div>
            </div>
          </div>

          {/* Contenedor del Preview WYSIWYG */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div
              className={`mx-auto transition-all ${
                deviceView === 'mobile'
                  ? 'max-w-sm rounded-[36px] border-4 border-zinc-700 bg-zinc-950 p-3 shadow-2xl'
                  : 'w-full'
              }`}
            >
              {/* Marco Celular si aplica */}
              {deviceView === 'mobile' && (
                <div className="w-24 h-4 bg-zinc-800 rounded-full mx-auto mb-2" />
              )}

              {/* Plantilla HTML del Correo */}
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-panel)] shadow-xl overflow-hidden font-sans">
                {/* Cabecera del Cliente de Correo */}
                <div className="p-3 bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <div>
                      <strong className="text-[var(--text-main)]">De:</strong> {tenantName} &lt;{senderEmail}&gt;
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      RFC 5545 Listo ✅
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    <strong className="text-[var(--text-main)]">Para:</strong> {appointment.client} &lt;{recipientEmail}&gt;
                  </div>
                  <div className="text-xs font-bold text-[var(--text-main)] pt-0.5">
                    ✅ Cita Confirmada: {appointment.serviceName || appointment.title} en {tenantName}
                  </div>
                </div>

                {/* Cuerpo del Correo Membretado */}
                <div
                  className="p-5 sm:p-7 space-y-5 bg-[var(--bg-panel)]"
                  style={{ borderTop: `4px solid ${accentColor}` }}
                >
                  {/* Brand Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
                        {tenantAvatar}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-main)] leading-tight">{tenantName}</h4>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          Confirmación Oficial • Vector Inside Engine
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                        border: `1px solid ${accentColor}50`,
                      }}
                    >
                      RESERVA CONFIRMADA
                    </span>
                  </div>

                  {/* Mensaje de Bienvenida */}
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-[var(--text-main)]">
                      ¡Hola, {appointment.client}! Tu cita ha sido agendada con éxito.
                    </p>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Hemos reservado y bloqueado tu horario en nuestra agenda oficial. A continuación encuentras la ficha técnica y los botones directos para integrarla a tu Google Calendar o calendario en tu celular.
                    </p>
                  </div>

                  {/* Ficha Resumen de la Cita */}
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neon" />
                        Horario:
                      </span>
                      <strong className="text-[var(--text-main)]">
                        {appointment.start ? formatDateTime(appointment.start) : `${appointment.hour} hrs`}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        Especialista:
                      </span>
                      <span className="text-[var(--text-main)] font-semibold">{appointment.specialist}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        Ubicación:
                      </span>
                      <span className="text-[var(--text-main)] truncate max-w-[260px]">
                        {emailConfig?.locationAddress || 'Av. Insurgentes Sur 1234, CDMX'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Inversión / Arancel:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        ${appointment.estimatedValue || 1200} MXN ({appointment.depositPaid ? 'Anticipo Pagado' : 'Por Liquidar'})
                      </span>
                    </div>
                  </div>

                  {/* Indicaciones Previas */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-200 text-xs font-mono flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-700 dark:text-amber-300 mb-0.5">Indicaciones Previas:</strong>
                      <span>{customNotes}</span>
                    </div>
                  </div>

                  {/* BOTONES INTERACTIVOS DE AGREGADO A CALENDARIO */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl text-black font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_var(--neon-glow)] transition-transform hover:scale-[1.01] active:scale-98"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Añadir a mi Google Calendar (Móvil / Web)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadIcs}
                        className="py-2 px-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-500" />
                        <span>Descargar Archivo .ICS</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShareWhatsapp}
                        className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Enviar por WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Archivo Adjunto Simulado */}
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-[var(--text-main)]">
                      <Paperclip className="w-4 h-4 text-neon" />
                      <div>
                        <span className="block font-bold">confirmacion-cita-{appointment.id}.ics</span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Archivo iCalendar estándar compatible con Android, iPhone y Outlook
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Adjunto
                    </span>
                  </div>

                  {/* Footer & Políticas */}
                  <div className="pt-3 border-t border-[var(--border-color)] text-center text-[10px] text-[var(--text-muted)] font-mono space-y-1">
                    <p>
                      {emailConfig?.cancellationPolicy ||
                        'Puedes cancelar o reprogramar sin costo notificando con al menos 24 horas de antelación.'}
                    </p>
                    <p className="opacity-80">
                      © 2026 {tenantName} • Confirmación generada por Vector Inside OS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado de Envío Exitoso */}
          {sentSuccess && (
            <div className="my-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                ¡Correo de confirmación membretado despachado con éxito a <strong>{recipientEmail}</strong> y sincronizado con Google Calendar!
              </span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SMTP Oficial Verificado • DKIM & SPF Firmados</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] text-xs font-mono transition-colors"
              >
                Cerrar
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleSendEmail}
                className="px-5 py-2 rounded-xl bg-neon text-black font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_var(--neon-glow)] hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 fill-black" />
                <span>{isSending ? 'Despachando Correo...' : 'Despachar Correo de Confirmación'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
