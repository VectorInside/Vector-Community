'use client';

import React, { useState, useEffect } from 'react';
import { Portal } from '@/components/common/Portal';
import { EmailTemplatePreview } from '@/components/shared/EmailTemplatePreview';
import {
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper to format Date for iCal RFC 5545 (e.g. YYYYMMDDTHHMMSSZ)
function formatIcsDate(dateObj) {
  const pad = (n) => String(n).padStart(2, '0');
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  const validDate = isNaN(d.getTime()) ? new Date() : d;
  return (
    validDate.getUTCFullYear() +
    pad(validDate.getUTCMonth() + 1) +
    pad(validDate.getUTCDate()) +
    'T' +
    pad(validDate.getUTCHours()) +
    pad(validDate.getUTCMinutes()) +
    pad(validDate.getUTCSeconds()) +
    'Z'
  );
}

// Helper to get tenant location fallback
export function getTenantDefaultAddress(tenant) {
  if (tenant?.address) return tenant.address;
  return 'Dirección registrada del negocio';
}

// Generate RFC 5545 .ics calendar file content respetando el membrete y configuración del tenant
export function generateIcsContent(apt, tenant, emailConfig = {}) {
  const tenantName = emailConfig?.senderName || tenant?.name || 'Vector Inside';
  const title = apt?.title || `Cita: ${apt?.serviceName || 'Servicio'} con ${tenantName}`;
  const details = `${apt?.details || 'Cita confirmada en ' + tenantName}. Especialista: ${apt?.specialist || 'Asignado'}. Teléfono: ${apt?.phone || 'N/A'}`;
  const location = emailConfig?.locationAddress || getTenantDefaultAddress(tenant);

  const startIso = apt?.start ? new Date(apt.start) : new Date();
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
export function triggerIcsDownload(apt, tenant, emailConfig = {}) {
  const content = generateIcsContent(apt, tenant, emailConfig);
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
export function getGoogleCalendarUrl(apt, tenant, emailConfig = {}) {
  const tenantName = emailConfig?.senderName || tenant?.name || 'Vector Inside';
  const title = encodeURIComponent(apt?.title || `Cita: ${apt?.serviceName || 'Servicio'} - ${tenantName}`);
  const details = encodeURIComponent(
    `Cita confirmada en ${tenantName}.\nEspecialista: ${apt?.specialist || 'Asignado'}\nCliente: ${apt?.client || 'N/A'}\nTeléfono: ${apt?.phone || 'N/A'}\nDetalles: ${apt?.details || 'N/A'}`
  );
  const location = encodeURIComponent(emailConfig?.locationAddress || getTenantDefaultAddress(tenant));

  const startIso = apt?.start ? new Date(apt.start) : new Date();
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
  const [sendError, setSendError] = useState(null);

  // Editable fields
  const [recipientEmail, setRecipientEmail] = useState(
    appointment?.clientEmail || `${appointment?.client?.toLowerCase().replace(/[^a-z0-9]/g, '.') || 'cliente'}@gmail.com`
  );
  const [customNotes, setCustomNotes] = useState(
    emailConfig?.instructions || 'Por favor preséntate 10 minutos antes de tu cita programada.'
  );

  React.useEffect(() => {
    if (appointment?.clientEmail) {
      setRecipientEmail(appointment.clientEmail);
    } else if (appointment?.client) {
      setRecipientEmail(`${appointment.client.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`);
    }
  }, [appointment]);

  useEffect(() => {
    const defaultInstructions =
      emailConfig?.instructions || 'Por favor preséntate 10 minutos antes de tu cita programada.';
    setCustomNotes(defaultInstructions);
  }, [tenant, emailConfig, appointment]);

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

  if (!isOpen || !appointment) return null;

  const tenantName = emailConfig?.senderName || tenant?.name || 'Vector Inside';
  const locationAddress = emailConfig?.locationAddress || getTenantDefaultAddress(tenant);

  const googleCalUrl = getGoogleCalendarUrl(appointment, tenant, emailConfig);

  const handleDownloadIcs = () => {
    triggerIcsDownload(appointment, tenant, emailConfig);
    try {
      confetti({ particleCount: 20, spread: 40 });
    } catch (e) {}
  };

  const handleSendEmail = async () => {
    const cleanRecipient = (recipientEmail || '').trim();
    if (!cleanRecipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanRecipient)) {
      setSendError('Por favor ingresa un correo electrónico válido para el destinatario.');
      return;
    }

    setSendError(null);
    setSentSuccess(false);
    setIsSending(true);

    try {
      const aptDate = appointment.fullDate || appointment.appointmentDate || '';
      const aptHour = appointment.hour || '11:00';
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: appointment.client || 'Cliente',
          email: cleanRecipient,
          roleLabel: `Confirmación de Cita — ${appointment.serviceName || appointment.title || 'Servicio'}`,
          assignedSummary: `${tenantName} | Fecha: ${aptDate} ${aptHour} hrs | ${locationAddress}${customNotes ? ` | Nota: ${customNotes}` : ''}`,
          tempPassword: `CITA-${appointment.id || 'CONFIRMADA'}`,
          loginUrl: googleCalUrl,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || `Error HTTP ${response.status} al despachar el correo.`);
      }

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
    } catch (error) {
      setSendError(error?.message || 'Error al despachar el correo de confirmación.');
    } finally {
      setIsSending(false);
    }
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `¡Hola ${appointment.client}! Te confirmamos tu cita en ${tenantName}:\n\n🗓️ Horario: ${appointment.hour || '11:00'} hrs (${appointment.dayId?.toUpperCase() || ''})\n🩺 Servicio: ${appointment.serviceName || appointment.title}\n📍 Ubicación: ${locationAddress}\n\nAgrega la cita a tu Google Calendar:\n${googleCalUrl}`
    );
    window.open(`https://wa.me/${appointment.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-4xl rounded-3xl bg-[var(--bg-panel)] border border-neon/50 shadow-2xl p-4 sm:p-6 relative flex flex-col max-h-[94vh] overflow-hidden my-auto animate-scale-up font-sans">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[var(--border-color)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neon/15 border border-neon/30 flex items-center justify-center text-[var(--neon-text)] shadow-[0_0_15px_var(--neon-glow)]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--neon-text)] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[var(--neon-text)]" />
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
              <div className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-emerald-700 dark:text-emerald-400 font-bold">
                {appointment.phone || tenant?.phone || 'Sin teléfono registrado'}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Estado de Pago:</label>
              <div className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{appointment.depositPaid ? 'Anticipo Verificado' : 'Pago en Recepción'}</span>
              </div>
            </div>
          </div>

          {/* Contenedor del Preview WYSIWYG compartido */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <EmailTemplatePreview
              tenant={tenant}
              appointment={appointment}
              emailConfig={emailConfig}
              recipientEmail={recipientEmail}
              customNotes={customNotes}
              googleCalendarUrl={googleCalUrl}
              deviceView={deviceView}
              onDeviceViewChange={setDeviceView}
              showDeviceToggle={false}
              showThemeToggle={true}
              onDownloadIcs={handleDownloadIcs}
              onShareWhatsapp={handleShareWhatsapp}
            />
          </div>

          {/* Error de Envío SMTP */}
          {sendError && (
            <div className="my-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-center gap-2 animate-fadeIn shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{sendError}</span>
            </div>
          )}

          {/* Estado de Envío Exitoso */}
          {sentSuccess && (
            <div className="my-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                ¡Correo de confirmación membretado despachado con éxito a <strong>{recipientEmail}</strong>!
              </span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>SMTP Oficial Verificado • DKIM &amp; SPF Firmados</span>
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
