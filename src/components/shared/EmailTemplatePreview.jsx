'use client';

import React, { useState, useMemo } from 'react';
import {
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Clock,
  User,
  MapPin,
  AlertCircle,
  Calendar,
  ExternalLink,
  Download,
  MessageCircle,
  Paperclip,
} from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

const parseHexColor = (hex) => {
  if (typeof hex !== 'string') return { r: 195, g: 244, b: 0 };
  const cleaned = hex.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return {
      r: parseInt(cleaned[0] + cleaned[0], 16),
      g: parseInt(cleaned[1] + cleaned[1], 16),
      b: parseInt(cleaned[2] + cleaned[2], 16),
    };
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return {
      r: parseInt(cleaned.slice(0, 2), 16),
      g: parseInt(cleaned.slice(2, 4), 16),
      b: parseInt(cleaned.slice(4, 6), 16),
    };
  }
  return { r: 195, g: 244, b: 0 };
};

const toHex = ({ r, g, b }) => {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  );
};

const getRelativeLuminance = ({ r, g, b }) => {
  const linearize = (channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
  );
};

const getContrastRatio = (lumA, lumB) => {
  const brighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (brighter + 0.05) / (darker + 0.05);
};

/**
 * Ajusta automáticamente un color de acento para garantizar contraste WCAG AA (>= 4.5:1)
 * tanto sobre fondo de correo claro (#FFFFFF) como oscuro (#121214).
 * Evita pintar #C3F400 / #D4FF00 ilegible sobre fondos blancos.
 */
export const getAccessibleAccentColor = (accentHex, isLightBackground = true) => {
  const rgb = parseHexColor(accentHex);
  const bgLuminance = isLightBackground
    ? 1.0
    : getRelativeLuminance({ r: 18, g: 18, b: 20 });

  let current = { ...rgb };
  let ratio = getContrastRatio(getRelativeLuminance(current), bgLuminance);

  if (ratio >= 4.5) {
    return toHex(current);
  }

  for (let step = 0; step < 30 && ratio < 4.5; step++) {
    if (isLightBackground) {
      current = {
        r: current.r * 0.86,
        g: current.g * 0.86,
        b: current.b * 0.86,
      };
    } else {
      current = {
        r: current.r + (255 - current.r) * 0.16,
        g: current.g + (255 - current.g) * 0.16,
        b: current.b + (255 - current.b) * 0.16,
      };
    }
    ratio = getContrastRatio(getRelativeLuminance(current), bgLuminance);
  }

  return toHex(current);
};

/**
 * Devuelve un color de texto legible (#09090B o #FAFAFA) sobre un color de fondo dado.
 */
export const getContrastTextColor = (bgHex) => {
  const lum = getRelativeLuminance(parseHexColor(bgHex));
  const darkInkContrast = getContrastRatio(lum, 0.003);
  const lightInkContrast = getContrastRatio(lum, 0.96);
  return darkInkContrast >= lightInkContrast ? '#09090B' : '#FAFAFA';
};

const interpolateTemplate = (template, vars) => {
  if (!template || typeof template !== 'string') return '';
  return template
    .replaceAll('{{cliente}}', vars.cliente)
    .replaceAll('{{servicio}}', vars.servicio)
    .replaceAll('{{negocio}}', vars.negocio)
    .replaceAll('{{especialista}}', vars.especialista);
};

/**
 * Componente WYSIWYG Dual-Theme unificado para previsualizar correos
 * transaccionales de confirmación de cita (Desktop/Móvil + Claro/Oscuro).
 */
export const EmailTemplatePreview = ({
  tenant = null,
  appointment = null,
  emailConfig = {},
  recipientEmail = '',
  customNotes,
  googleCalendarUrl = '#',
  deviceView: controlledDeviceView,
  onDeviceViewChange,
  defaultDeviceView = 'desktop',
  showDeviceToggle = true,
  emailTheme: controlledEmailTheme,
  onEmailThemeChange,
  defaultEmailTheme = 'light',
  showThemeToggle = true,
  emailClient = 'gmail',
  onDownloadIcs,
  onShareWhatsapp,
  showInteractiveActions = true,
  showAttachment = true,
  className = '',
}) => {
  const [internalDevice, setInternalDevice] = useState(defaultDeviceView);
  const [internalEmailTheme, setInternalEmailTheme] = useState(defaultEmailTheme);

  const activeDevice = controlledDeviceView ?? internalDevice;
  const activeEmailTheme = controlledEmailTheme ?? internalEmailTheme;
  const isLightEmail = activeEmailTheme !== 'dark';

  const setDevice = (next) => {
    if (onDeviceViewChange) onDeviceViewChange(next);
    if (controlledDeviceView === undefined) setInternalDevice(next);
  };

  const setEmailTheme = (next) => {
    if (onEmailThemeChange) onEmailThemeChange(next);
    if (controlledEmailTheme === undefined) setInternalEmailTheme(next);
  };

  const tenantName = emailConfig?.senderName || tenant?.name || 'Vector Inside';
  const tenantAvatar = emailConfig?.logoAvatar || tenant?.avatar || '🐺';
  const senderEmail =
    emailConfig?.senderEmail ||
    tenant?.email ||
    `citas@${tenant?.id || 'vectorinside'}.com`;
  const rawAccent = emailConfig?.accentColor || tenant?.brandColor || '#C3F400';

  const clientName = appointment?.client || appointment?.clientName || 'Cliente';
  const resolvedRecipient =
    recipientEmail || appointment?.clientEmail || 'cliente@correo.com';
  const serviceName =
    appointment?.serviceName ||
    appointment?.service ||
    appointment?.title ||
    'Valoración Especializada';
  const specialistName = appointment?.specialist || 'Especialista Asignado';
  const locationAddress =
    appointment?.location ||
    emailConfig?.locationAddress ||
    tenant?.address ||
    'Dirección registrada del negocio';

  const formattedSchedule = useMemo(() => {
    if (appointment?.dateTime) return appointment.dateTime;
    if (appointment?.start) return formatDateTime(appointment.start);
    if (appointment?.hour) return `${appointment.hour} hrs`;
    return 'Horario por confirmar';
  }, [appointment]);

  const templateVars = useMemo(
    () => ({
      cliente: clientName,
      servicio: serviceName,
      negocio: tenantName,
      especialista: specialistName,
    }),
    [clientName, serviceName, tenantName, specialistName]
  );

  const resolvedSubject = emailConfig?.subject
    ? interpolateTemplate(emailConfig.subject, templateVars)
    : `Cita Confirmada: ${serviceName} en ${tenantName}`;

  const resolvedWelcome = emailConfig?.welcomeMessage
    ? interpolateTemplate(emailConfig.welcomeMessage, templateVars)
    : `¡Hola, ${clientName}! Tu cita ha sido agendada con éxito.`;

  const resolvedInstructions =
    customNotes !== undefined
      ? customNotes
      : emailConfig?.instructions ||
        'Por favor preséntate 10 minutos antes de tu cita programada.';

  const cancellationPolicy =
    emailConfig?.cancellationPolicy ||
    'Puedes cancelar o reprogramar sin costo notificando con al menos 24 horas de antelación.';
  const ctaButtonText =
    emailConfig?.ctaText || 'Añadir a mi Google Calendar (Móvil / Web)';

  const accessibleAccentInk = useMemo(
    () => getAccessibleAccentColor(rawAccent, isLightEmail),
    [rawAccent, isLightEmail]
  );
  const ctaTextColor = useMemo(
    () => getContrastTextColor(rawAccent),
    [rawAccent]
  );

  const includeIcs = emailConfig?.includeIcs !== false;
  const includeWhatsapp = emailConfig?.includeWhatsapp !== false;
  const hasEstimatedValue =
    appointment?.estimatedValue !== undefined &&
    appointment?.estimatedValue !== null &&
    Number(appointment.estimatedValue) > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barra de controles Dual-Theme */}
      {(showDeviceToggle || showThemeToggle) && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
          {showDeviceToggle ? (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  activeDevice === 'desktop'
                    ? 'bg-neon text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Vista Escritorio"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  activeDevice === 'mobile'
                    ? 'bg-neon text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Vista Móvil"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Móvil</span>
              </button>
            </div>
          ) : (
            <div />
          )}

          {showThemeToggle && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setEmailTheme('light')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isLightEmail
                    ? 'bg-neon text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Previsualizar correo en fondo claro"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Claro</span>
              </button>
              <button
                type="button"
                onClick={() => setEmailTheme('dark')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  !isLightEmail
                    ? 'bg-neon text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Previsualizar correo en fondo oscuro"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Oscuro</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Marco responsivo Desktop / Móvil */}
      <div
        className={`mx-auto transition-all duration-300 ${
          activeDevice === 'mobile'
            ? 'max-w-sm rounded-[32px] border-4 border-[var(--border-color)] bg-[var(--bg-card-subtle)] p-2.5 shadow-xl'
            : 'w-full'
        }`}
      >
        {activeDevice === 'mobile' && (
          <div className="w-20 h-3 bg-[var(--border-color)] rounded-full mx-auto mb-2" />
        )}

        {/* Lienzo simulado del cliente de correo */}
        <div
          className={`rounded-2xl border overflow-hidden font-sans transition-colors duration-200 ${
            isLightEmail
              ? 'bg-white text-zinc-900 border-zinc-200 shadow-lg'
              : 'bg-[#121214] text-zinc-100 border-zinc-800 shadow-2xl'
          }`}
        >
          {/* Barra superior opcional del cliente de correo */}
          {emailClient === 'apple' ? (
            <div
              className={`px-3 py-2.5 border-b flex items-center justify-between text-[10px] font-mono ${
                isLightEmail
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-600'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="font-bold">Apple Mail iOS</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                RFC 5545 Listo
              </span>
            </div>
          ) : emailClient === 'outlook' ? (
            <div className="px-4 py-2.5 bg-[#0078d4] text-zinc-50 flex items-center justify-between text-xs font-sans">
              <div className="flex items-center gap-2 font-bold">
                <span>Microsoft Outlook</span>
                <span className="text-[10px] opacity-85 font-normal">
                  | Remitente verificado
                </span>
              </div>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">
                RFC 5545
              </span>
            </div>
          ) : emailClient === 'gmail' ? (
            <div
              className={`px-3 py-2 border-b flex items-center justify-between text-[11px] font-mono ${
                isLightEmail
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-600'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span
                  className={`font-bold truncate ${
                    isLightEmail ? 'text-zinc-800' : 'text-zinc-200'
                  }`}
                >
                  Gmail Simulator
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                RFC 5545 Listo
              </span>
            </div>
          ) : null}

          {/* Encabezado de metadatos del email */}
          <div
            className={`p-3.5 border-b text-xs font-mono space-y-1 ${
              isLightEmail
                ? 'bg-zinc-50 border-zinc-200 text-zinc-600'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <div className="truncate">
                <strong className={isLightEmail ? 'text-zinc-900' : 'text-zinc-100'}>
                  De:
                </strong>{' '}
                {tenantName} &lt;{senderEmail}&gt;
              </div>
            </div>
            <div className="text-[11px] truncate">
              <strong className={isLightEmail ? 'text-zinc-900' : 'text-zinc-100'}>
                Para:
              </strong>{' '}
              {clientName} &lt;{resolvedRecipient}&gt;
            </div>
            <div
              className={`text-xs sm:text-sm font-bold pt-0.5 truncate ${
                isLightEmail ? 'text-zinc-900' : 'text-zinc-50'
              }`}
            >
              {resolvedSubject}
            </div>
          </div>

          {/* Cuerpo membretado del correo */}
          <div
            className={`p-5 sm:p-6 space-y-5 transition-colors duration-200 ${
              isLightEmail
                ? 'bg-white text-zinc-900'
                : 'bg-[#121214] text-zinc-100'
            }`}
            style={{ borderTop: `4px solid ${isLightEmail ? accessibleAccentInk : rawAccent}` }}
          >
            {/* Cabecera de marca + insignia con contraste seguro */}
            <div
              className={`flex items-center justify-between gap-3 pb-3 border-b ${
                isLightEmail ? 'border-zinc-200' : 'border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-2xl p-2 rounded-xl border shrink-0 ${
                    isLightEmail
                      ? 'bg-zinc-50 border-zinc-200'
                      : 'bg-zinc-800 border-zinc-700'
                  }`}
                >
                  {tenantAvatar}
                </span>
                <div className="min-w-0">
                  <h4
                    className={`text-sm font-bold leading-tight truncate ${
                      isLightEmail ? 'text-zinc-900' : 'text-zinc-50'
                    }`}
                  >
                    {tenantName}
                  </h4>
                  <span
                    className={`text-[10px] font-mono block truncate ${
                      isLightEmail ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    Confirmación Oficial Transaccional
                  </span>
                </div>
              </div>

              <span
                className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                style={{
                  backgroundColor: `${accessibleAccentInk}1A`,
                  color: accessibleAccentInk,
                  border: `1px solid ${accessibleAccentInk}55`,
                }}
              >
                RESERVA CONFIRMADA
              </span>
            </div>

            {/* Mensaje de bienvenida */}
            <div className="space-y-1.5">
              <p
                className={`text-sm font-bold ${
                  isLightEmail ? 'text-zinc-900' : 'text-zinc-50'
                }`}
              >
                {resolvedWelcome}
              </p>
              <p
                className={`text-xs leading-relaxed ${
                  isLightEmail ? 'text-zinc-600' : 'text-zinc-400'
                }`}
              >
                Hemos reservado tu horario en nuestra agenda oficial. Aquí tienes
                los detalles de tu cita y los accesos directos para sincronizarla en
                tu calendario.
              </p>
            </div>

            {/* Ficha resumen de la cita */}
            <div
              className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${
                isLightEmail
                  ? 'bg-zinc-50 border-zinc-200'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div
                className={`flex items-center justify-between gap-2 border-b pb-2 ${
                  isLightEmail ? 'border-zinc-200' : 'border-zinc-800'
                }`}
              >
                <span className={isLightEmail ? 'text-zinc-500' : 'text-zinc-400'}>
                  Servicio:
                </span>
                <strong
                  className={`text-right ${
                    isLightEmail ? 'text-zinc-900' : 'text-zinc-50'
                  }`}
                >
                  {serviceName}
                </strong>
              </div>

              <div
                className={`flex items-center justify-between gap-2 border-b pb-2 ${
                  isLightEmail ? 'border-zinc-200' : 'border-zinc-800'
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 ${
                    isLightEmail ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: accessibleAccentInk }} />
                  Horario:
                </span>
                <strong className={isLightEmail ? 'text-zinc-900' : 'text-zinc-50'}>
                  {formattedSchedule}
                </strong>
              </div>

              <div
                className={`flex items-center justify-between gap-2 border-b pb-2 ${
                  isLightEmail ? 'border-zinc-200' : 'border-zinc-800'
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 ${
                    isLightEmail ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  Especialista:
                </span>
                <span
                  className={`font-semibold ${
                    isLightEmail ? 'text-zinc-800' : 'text-zinc-100'
                  }`}
                >
                  {specialistName}
                </span>
              </div>

              <div
                className={`flex items-center justify-between gap-2 ${
                  hasEstimatedValue
                    ? `border-b pb-2 ${isLightEmail ? 'border-zinc-200' : 'border-zinc-800'}`
                    : ''
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 ${
                    isLightEmail ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  Ubicación:
                </span>
                <span
                  className={`truncate max-w-[230px] font-semibold ${
                    isLightEmail ? 'text-zinc-800' : 'text-zinc-100'
                  }`}
                >
                  {locationAddress}
                </span>
              </div>

              {hasEstimatedValue && (
                <div className="flex items-center justify-between gap-2">
                  <span className={isLightEmail ? 'text-zinc-500' : 'text-zinc-400'}>
                    Inversión / Arancel:
                  </span>
                  <span
                    className={`font-bold ${
                      isLightEmail ? 'text-emerald-700' : 'text-emerald-400'
                    }`}
                  >
                    ${Number(appointment.estimatedValue).toLocaleString('es-MX')} MXN (
                    {appointment?.depositPaid ? 'Anticipo Pagado' : 'Por Liquidar'})
                  </span>
                </div>
              )}
            </div>

            {/* Indicaciones previas */}
            {resolvedInstructions && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                  isLightEmail
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong
                    className={`block mb-0.5 ${
                      isLightEmail ? 'text-amber-950' : 'text-amber-300'
                    }`}
                  >
                    Indicaciones Previas:
                  </strong>
                  <span>{resolvedInstructions}</span>
                </div>
              </div>
            )}

            {/* Botones de acción interactivos */}
            {showInteractiveActions && (
              <div className="space-y-2 pt-1">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01]"
                  style={{
                    backgroundColor: rawAccent,
                    color: ctaTextColor,
                  }}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{ctaButtonText}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </a>

                {(includeIcs || includeWhatsapp) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {includeIcs && (
                      <button
                        type="button"
                        onClick={onDownloadIcs}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors ${
                          isLightEmail
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border-zinc-700'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5 text-blue-500" />
                        <span>Descargar .ICS</span>
                      </button>
                    )}

                    {includeWhatsapp && (
                      <button
                        type="button"
                        onClick={onShareWhatsapp}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors ${
                          isLightEmail
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Enviar por WhatsApp</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Archivo adjunto .ICS */}
            {showAttachment && includeIcs && (
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-mono ${
                  isLightEmail
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip
                    className="w-4 h-4 shrink-0"
                    style={{ color: accessibleAccentInk }}
                  />
                  <div className="min-w-0">
                    <span className="block font-bold truncate">
                      confirmacion-cita-{appointment?.id || 'evento'}.ics
                    </span>
                    <span
                      className={`text-[10px] block truncate ${
                        isLightEmail ? 'text-zinc-500' : 'text-zinc-400'
                      }`}
                    >
                      Archivo iCalendar estándar compatible con Apple, Google y Outlook
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                    isLightEmail
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                >
                  Adjunto
                </span>
              </div>
            )}

            {/* Footer */}
            <div
              className={`pt-3 border-t text-center text-[10px] font-mono space-y-1 ${
                isLightEmail
                  ? 'border-zinc-200 text-zinc-500'
                  : 'border-zinc-800 text-zinc-400'
              }`}
            >
              <p>{cancellationPolicy}</p>
              <p className="opacity-85">
                © 2026 {tenantName} • Confirmación generada por Vector Inside OS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatePreview;
