'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Check,
  Copy,
  ShieldCheck,
  X,
  Sparkles,
  ExternalLink,
  KeyRound,
  Smartphone,
  MessageCircle,
  AlertCircle,
  Info,
  Loader2,
  SendHorizontal,
} from 'lucide-react';
import { Portal } from '@/components/common/Portal';
import { useAuth } from '@/context/AuthContext';
import { formatPhoneDisplay, getEmailDomainTypoSuggestion } from '@/utils/formatters';
import { auditService } from '@/services/auditService';

export const StaffInvitationModal = ({
  isOpen,
  onClose,
  invitationData,
  onConfirmSend,
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('email_preview'); // 'email_preview' | 'whatsapp' | 'smtp_settings'
  const [copiedField, setCopiedField] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // Cerrar con Escape y bloquear scroll de fondo cuando el modal está abierto
  useEffect(() => {
    if (!isOpen || !invitationData) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, invitationData, onClose]);

  if (!isOpen || !invitationData) return null;

  const {
    name,
    email,
    phone,
    role,
    roleLabel,
    assignedSummary,
    tempPassword,
    isPendingSave,
  } = invitationData;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const loginUrl = `${originUrl}/login`;

  const configuredSenderAddress = currentUser?.email || 'notificaciones@vectorinside.com';
  const senderEmail = `Vector Inside OS <${configuredSenderAddress}>`;
  const emailSubject = `Invitación oficial: Acceso al sistema Vector Inside (${roleLabel})`;

  const whatsappMessage = `👋 Hola *${name}*,\n\nHas sido dado de alta como *${roleLabel}* en la plataforma oficial de *Vector Inside*:\n\n🔗 *Enlace de Acceso:* ${loginUrl}\n✉️ *Usuario:* ${email}\n🔑 *Contraseña Provisional:* ${tempPassword}\n\n⏳ *VIGENCIA:* Tu invitación y contraseña provisional *no caducan*; permanecen válidas hasta que completes tu primer inicio de sesión.\n⚠️ *AVISO DE SEGURIDAD:* Al ingresar por primera vez, el sistema te solicitará definir obligatoriamente tu *contraseña personal definitiva*. Nadie más conocerá tu clave.\n\n¡Bienvenido al equipo!`;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleOpenWhatsApp = () => {
    const clean = (phone || '').replace(/\D/g, '');
    const phoneToUse = clean.length === 10 ? `52${clean}` : clean;
    const url = `https://wa.me/${phoneToUse}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');

    auditService.recordEvent({
      eventCategory: 'IAM_RBAC',
      action: 'Envío / Reenvío de Invitación Oficial',
      targetResource: `${name} (${email})`,
      status: 'SUCCESS',
      metadata: {
        channel: 'WhatsApp',
        role: role || roleLabel,
        email,
      },
    });
  };

  const handleDispatchEmail = async (overrideRecipient = null) => {
    const targetEmail = overrideRecipient || email;
    const emailTypo = getEmailDomainTypoSuggestion(targetEmail);
    if (emailTypo) {
      setSendResult({
        success: false,
        code: 'EMAIL_DOMAIN_TYPO',
        message: `El correo ${targetEmail} contiene un error de dominio (@${emailTypo.wrongDomain}). Sugerencia: ${emailTypo.suggestedEmail}. Por favor corrige antes de despachar.`,
      });
      return;
    }

    setSendingEmail(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: targetEmail,
          roleLabel,
          assignedSummary,
          tempPassword,
          loginUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSendResult({
          success: true,
          message: `¡Correo despachado con éxito a ${targetEmail}!`,
          messageId: data.messageId,
        });
        auditService.recordEvent({
          eventCategory: 'IAM_RBAC',
          action: 'Envío / Reenvío de Invitación Oficial',
          targetResource: `${name} (${targetEmail})`,
          status: 'SUCCESS',
          metadata: {
            channel: 'SMTP',
            role: role || roleLabel,
            email: targetEmail,
            messageId: data.messageId || null,
          },
        });
      } else {
        setSendResult({
          success: false,
          code: data.code,
          message: data.message || 'Error al conectar con el servidor de correo.',
          details: data.details,
        });
      }
    } catch (err) {
      setSendResult({
        success: false,
        message: err.message || 'Error de conexión al enviar el correo.',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in font-sans"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Ficha de Invitación & Despacho Oficial"
      >
        <div className="relative w-full max-w-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up max-h-[92vh] flex flex-col text-[var(--text-main)]">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                  Ficha de Invitación & Despacho Oficial
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Gestión corporativa de credenciales y despacho transaccional (sin caducidad)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              aria-label="Cerrar ficha de invitación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Header Tabs */}
          <div className="flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2.5 font-mono text-xs overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('email_preview')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shrink-0 ${
                activeTab === 'email_preview'
                  ? 'bg-neon text-black shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] border border-[var(--border-color)]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Plantilla de Correo (HTML)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shrink-0 ${
                activeTab === 'whatsapp'
                  ? 'bg-neon text-black shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] border border-[var(--border-color)]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ficha WhatsApp / Slack</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('smtp_settings')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold shrink-0 ${
                activeTab === 'smtp_settings'
                  ? 'bg-neon text-black shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] border border-[var(--border-color)]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gobernanza & Resend</span>
            </button>
          </div>

          {/* Cuerpo con min-h-[420px] para eliminar CLS al cambiar pestañas */}
          <div className="min-h-[420px] flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Tab 1: Email HTML Preview */}
            {activeTab === 'email_preview' && (
              <div className="space-y-4">
                {/* Resend Action Dispatch Banner */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[11px]">Destinatario:</span>
                    <span className="text-[var(--text-main)] font-bold text-xs">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDispatchEmail()}
                    disabled={sendingEmail}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neon text-black font-bold hover:bg-[var(--neon-hover)] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    {sendingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Despachando Vía Resend...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Despachar Correo Ahora</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Alert if Sent or Failed */}
                {sendResult && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs font-mono transition-all ${
                      sendResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : sendResult.code === 'RESEND_SANDBOX_RESTRICTION'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {sendResult.success ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-2 flex-1">
                        <p className="font-bold">{sendResult.message}</p>
                        {sendResult.messageId && (
                          <p className="text-[10px] text-[var(--text-muted)]">
                            ID de Transmisión Oficial: <code className="text-[var(--text-main)]">{sendResult.messageId}</code>
                          </p>
                        )}

                        {sendResult.code === 'RESEND_SANDBOX_RESTRICTION' && (
                          <div className="space-y-2 pt-1 border-t border-amber-500/20 text-[11px] text-[var(--text-main)]">
                            <p>
                              ℹ️ Para enviar a <strong>{email}</strong>, agrega tu dominio en{' '}
                              <a
                                href="https://resend.com/domains"
                                target="_blank"
                                rel="noreferrer"
                                className="text-lime-700 dark:text-neon underline font-bold"
                              >
                                resend.com/domains
                              </a>
                              .
                            </p>
                            {currentUser?.email && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleDispatchEmail(currentUser.email)}
                                  disabled={sendingEmail}
                                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-[10px] hover:bg-amber-300 transition-all flex items-center gap-1.5"
                                >
                                  <Send className="w-3 h-3 text-black" />
                                  <span>Enviar copia de prueba a mi correo ({currentUser.email})</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rendered HTML Email Container */}
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 space-y-5 text-[var(--text-main)] font-sans shadow-inner">
                  {/* Brand Banner */}
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[var(--bg-panel)] border border-neon/40 flex items-center justify-center font-black text-xs text-lime-700 dark:text-neon">
                        V
                      </div>
                      <span className="font-heading font-black tracking-widest text-sm text-[var(--text-main)]">
                        VECTOR <span className="text-lime-700 dark:text-neon">INSIDE</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
                      COMMUNITY OS // IAM
                    </span>
                  </div>

                  {/* Main Body */}
                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-[var(--text-main)]">
                      Hola {name}, bienvenido al equipo
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Has sido invitado por la dirección de la agencia para integrarte como{' '}
                      <strong className="text-[var(--text-main)]">{roleLabel}</strong> en la plataforma tecnológica Vector Inside.
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      <strong className="text-[var(--text-main)]">Alcance de Permisos:</strong> {assignedSummary}
                    </p>
                  </div>

                  {/* Credentials Callout Card */}
                  <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2.5 font-mono text-xs">
                    <div className="text-[10px] text-lime-700 dark:text-neon uppercase font-bold tracking-wider">
                      Tus Credenciales Provisionales de Acceso
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1.5">
                      <span className="text-[var(--text-muted)]">Correo Oficial:</span>
                      <span className="font-bold text-[var(--text-main)]">{email}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1.5">
                      <span className="text-[var(--text-muted)]">Contraseña Temporal:</span>
                      <span className="font-bold text-lime-700 dark:text-neon bg-[var(--bg-base)] px-2 py-0.5 rounded border border-neon/30">
                        {tempPassword}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1.5">
                      <span className="text-[var(--text-muted)]">Vigencia de Acceso:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Sin caducidad (válida hasta primer ingreso)
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[var(--text-muted)]">Enlace de Inicio:</span>
                      <span className="text-cyan-700 dark:text-cyan-400 truncate max-w-[260px] underline">{loginUrl}</span>
                    </div>
                  </div>

                  {/* Simulated Button */}
                  <div className="text-center pt-2 pb-1">
                    <span className="inline-block px-6 py-3 rounded-xl bg-neon text-black font-extrabold text-xs tracking-wide shadow-[0_0_20px_rgba(231,249,0,0.25)]">
                      INGRESAR AL SISTEMA OPERATIVO &rarr;
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] space-y-1">
                    <p>
                      ⚠️ <strong className="text-[var(--text-main)]">Protocolo de Seguridad:</strong> Al ingresar por primera vez, deberás definir obligatoriamente tu contraseña personal definitiva.
                    </p>
                    <p>
                      ⏳ <strong className="text-[var(--text-main)]">Sin Caducidad (ADR-013 §2.4):</strong> Las invitaciones y contraseñas provisionales no caducan hasta que completes tu primer inicio de sesión.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: WhatsApp Card */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-main)] font-bold">Mensaje Preformateado WhatsApp:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(whatsappMessage, 'wa_msg')}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-panel)] hover:bg-[var(--bg-base)] border border-[var(--border-color)] text-lime-700 dark:text-neon font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      {copiedField === 'wa_msg' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar Mensaje</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={10}
                    value={whatsappMessage}
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] font-mono text-xs leading-relaxed outline-none"
                  />
                </div>

                {phone && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                        WhatsApp Registrado: {formatPhoneDisplay(phone)}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        Puedes disparar el mensaje directo al chat con 1 clic. La clave provisional no caduca.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Abrir Chat WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: SMTP & Governance Info */}
            {activeTab === 'smtp_settings' && (
              <div className="space-y-4 font-sans text-xs">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono">
                  <div className="flex items-center gap-2 text-[var(--text-main)] font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-lime-700 dark:text-neon" />
                    <span>Motor de Despacho Transaccional Conectado</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)] text-[10px] block">Proveedor Conectado:</span>
                      <span className="text-lime-700 dark:text-neon font-bold">Google SMTP Direct (En Vivo)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)] text-[10px] block">Remitente Autorizado:</span>
                      <span className="text-[var(--text-main)] font-bold break-all">{configuredSenderAddress}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)] text-[10px] block">Alcance de Entrega:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Universal (Sin Restricciones)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)] text-[10px] block">Cifrado de Entrega:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">TLS 1.3 / STARTTLS (Google MX)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] sm:col-span-2">
                      <span className="text-[var(--text-muted)] text-[10px] block">Vigencia de Invitación y Clave Provisional:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Sin caducidad — permanece activa hasta que el usuario complete su primer inicio de sesión y rotación obligatoria de contraseña.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] font-mono text-xs shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              Cerrar Ficha
            </button>

            {isPendingSave ? (
              <button
                type="button"
                onClick={onConfirmSend}
                className="px-5 py-2.5 rounded-xl bg-neon text-black font-bold hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(231,249,0,0.3)] active:scale-95"
              >
                <Check className="w-4 h-4 text-black" />
                <span>Confirmar & Registrar en PostgreSQL</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleDispatchEmail()}
                disabled={sendingEmail}
                className="px-5 py-2.5 rounded-xl bg-neon text-black font-bold hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(231,249,0,0.3)] active:scale-95 disabled:opacity-50"
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Despachando Correo...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    <span>Despachar Correo Ahora</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};
