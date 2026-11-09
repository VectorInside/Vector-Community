'use client';

import React, { useState } from 'react';
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
import { formatPhoneDisplay, getEmailDomainTypoSuggestion } from '@/utils/formatters';

export const StaffInvitationModal = ({
  isOpen,
  onClose,
  invitationData,
  onConfirmSend,
}) => {
  const [activeTab, setActiveTab] = useState('email_preview'); // 'email_preview' | 'whatsapp' | 'smtp_settings'
  const [copiedField, setCopiedField] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendResult, setSendResult] = useState(null);

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

  const senderEmail = 'Vector Inside OS <area21.2110@gmail.com>';
  const emailSubject = `Invitación oficial: Acceso al sistema Vector Inside (${roleLabel})`;

  const whatsappMessage = `👋 Hola *${name}*,\n\nHas sido dado de alta como *${roleLabel}* en la plataforma oficial de *Vector Inside*:\n\n🔗 *Enlace de Acceso:* ${loginUrl}\n✉️ *Usuario:* ${email}\n🔑 *Contraseña Provisional:* ${tempPassword}\n\n⚠️ *AVISO DE SEGURIDAD:* Al ingresar a tu cuenta por primera vez, el sistema te solicitará obligatoriamente definir tu *contraseña personal definitiva*. Nadie más conocerá tu clave.\n\n¡Bienvenido al equipo!`;

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
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in font-sans">
        <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E7F900]/15 text-[#E7F900] border border-[#E7F900]/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-black text-white">
                  Ficha de Invitación & Despacho Oficial
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Gestión corporativa de credenciales y motor de correo Resend
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Header Tabs */}
          <div className="flex items-center gap-1.5 border-b border-zinc-800/80 pb-2.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('email_preview')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                activeTab === 'email_preview'
                  ? 'bg-[#E7F900] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800/50'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Plantilla de Correo (HTML)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                activeTab === 'whatsapp'
                  ? 'bg-[#E7F900] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800/50'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ficha WhatsApp / Slack</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('smtp_settings')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                activeTab === 'smtp_settings'
                  ? 'bg-[#E7F900] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gobernanza & Resend</span>
            </button>
          </div>

          {/* Tab 1: Email HTML Preview */}
          {activeTab === 'email_preview' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Resend Action Dispatch Banner */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Destinatario:</span>
                  <span className="text-white font-bold text-xs">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDispatchEmail()}
                  disabled={sendingEmail}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#E7F900] text-black font-bold hover:bg-[#d4e500] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
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
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : sendResult.code === 'RESEND_SANDBOX_RESTRICTION'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {sendResult.success ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-2 flex-1">
                      <p className="font-bold">{sendResult.message}</p>
                      {sendResult.messageId && (
                        <p className="text-[10px] text-zinc-400">
                          ID de Transmisión Oficial: <code className="text-white">{sendResult.messageId}</code>
                        </p>
                      )}

                      {sendResult.code === 'RESEND_SANDBOX_RESTRICTION' && (
                        <div className="space-y-2 pt-1 border-t border-amber-500/20 text-[11px] text-zinc-300">
                          <p>
                            ℹ️ Para enviar a <strong>{email}</strong>, agrega tu dominio en{' '}
                            <a
                              href="https://resend.com/domains"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#E7F900] underline font-bold"
                            >
                              resend.com/domains
                            </a>
                            .
                          </p>
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => handleDispatchEmail('edgar.gonzalez@syborx.com')}
                              disabled={sendingEmail}
                              className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-[10px] hover:bg-amber-300 transition-all flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3 text-black" />
                              <span>Enviar copia de prueba a mi correo (edgar.gonzalez@syborx.com)</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Rendered HTML Email Container */}
              <div className="rounded-2xl border border-zinc-800 bg-[#07080A] p-5 sm:p-6 space-y-5 text-zinc-200 font-sans shadow-inner">
                {/* Brand Banner */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-[#E7F900]/40 flex items-center justify-center font-black text-xs text-[#E7F900]">
                      V
                    </div>
                    <span className="font-heading font-black tracking-widest text-sm text-white">
                      VECTOR <span className="text-[#E7F900]">INSIDE</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
                    COMMUNITY OS // IAM
                  </span>
                </div>

                {/* Main Body */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-white">
                    Hola {name}, bienvenido al equipo
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Has sido invitado por la dirección de la agencia para integrarte como{' '}
                    <strong className="text-white">{roleLabel}</strong> en la plataforma tecnológica Vector Inside.
                  </p>
                  <p className="text-xs text-zinc-400">
                    <strong>Alcance de Permisos:</strong> {assignedSummary}
                  </p>
                </div>

                {/* Credentials Callout Card */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800/80 space-y-2.5 font-mono text-xs">
                  <div className="text-[10px] text-[#E7F900] uppercase font-bold tracking-wider">
                    Tus Credenciales Provisionales de Acceso
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="text-zinc-400">Correo Oficial:</span>
                    <span className="font-bold text-white">{email}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="text-zinc-400">Contraseña Temporal:</span>
                    <span className="font-bold text-[#E7F900] bg-black/50 px-2 py-0.5 rounded border border-[#E7F900]/30">
                      {tempPassword}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-zinc-400">Enlace de Inicio:</span>
                    <span className="text-cyan-400 truncate max-w-[260px] underline">{loginUrl}</span>
                  </div>
                </div>

                {/* Simulated Button */}
                <div className="text-center pt-2 pb-1">
                  <span className="inline-block px-6 py-3 rounded-xl bg-[#E7F900] text-black font-extrabold text-xs tracking-wide shadow-[0_0_20px_rgba(231,249,0,0.25)]">
                    INGRESAR AL SISTEMA OPERATIVO &rarr;
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400">
                  ⚠️ <strong>Protocolo de Seguridad:</strong> Al ingresar por primera vez, deberás definir obligatoriamente tu contraseña personal definitiva.
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: WhatsApp Card */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-bold">Mensaje Preformateado WhatsApp:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(whatsappMessage, 'wa_msg')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#E7F900] font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedField === 'wa_msg' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
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
                  rows={8}
                  value={whatsappMessage}
                  className="w-full bg-black/60 border border-zinc-800 rounded-xl p-3 text-zinc-300 font-mono text-xs leading-relaxed outline-none"
                />
              </div>

              {phone && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block">
                      WhatsApp Registrado: {formatPhoneDisplay(phone)}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Puedes disparar el mensaje directo al chat con 1 clic.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
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
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 font-sans text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 font-mono">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#E7F900]" />
                  <span>Motor de Despacho Transaccional Conectado</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Proveedor Conectado:</span>
                    <span className="text-[#E7F900] font-bold">Google SMTP Direct (En Vivo)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Remitente Autorizado:</span>
                    <span className="text-white font-bold">area21.2110@gmail.com</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Alcance de Entrega:</span>
                    <span className="text-emerald-400 font-bold">Universal (Sin Restricciones)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Cifrado de Entrega:</span>
                    <span className="text-emerald-400 font-bold">TLS 1.3 / STARTTLS (Google MX)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              Cerrar Ficha
            </button>

            {isPendingSave ? (
              <button
                type="button"
                onClick={onConfirmSend}
                className="px-5 py-2.5 rounded-xl bg-[#E7F900] text-black font-bold hover:bg-[#d4e500] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(231,249,0,0.3)] active:scale-95"
              >
                <Check className="w-4 h-4 text-black" />
                <span>Confirmar & Registrar en PostgreSQL</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleDispatchEmail()}
                disabled={sendingEmail}
                className="px-5 py-2.5 rounded-xl bg-[#E7F900] text-black font-bold hover:bg-[#d4e500] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(231,249,0,0.3)] active:scale-95 disabled:opacity-50"
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
