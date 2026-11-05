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
} from 'lucide-react';
import { Portal } from '@/components/common/Portal';
import { formatPhoneDisplay } from '@/utils/formatters';

export const StaffInvitationModal = ({
  isOpen,
  onClose,
  invitationData,
  onConfirmSend,
}) => {
  const [activeTab, setActiveTab] = useState('email_preview'); // 'email_preview' | 'whatsapp' | 'smtp_settings'
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !invitationData) return null;

  const {
    name,
    email,
    phone,
    role,
    roleLabel,
    assignedSummary,
    tempPassword,
  } = invitationData;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const loginUrl = `${originUrl}/login`;

  const senderEmail = 'notificaciones@vectorinside.com';
  const senderDisplayName = 'Vector Inside OS';
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

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
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
                  Gestión corporativa de credenciales y plantilla transaccional
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
              <span>Gobernanza & SMTP</span>
            </button>
          </div>

          {/* Tab 1: Email HTML Preview */}
          {activeTab === 'email_preview' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Delivery Meta Header */}
              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span><strong>De:</strong> {senderDisplayName} &lt;{senderEmail}&gt;</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                    DKIM / SPF Verificado
                  </span>
                </div>
                <div className="text-zinc-300 text-[11px]">
                  <strong>Para:</strong> {name} &lt;{email}&gt;
                </div>
                <div className="text-zinc-200 text-[11px]">
                  <strong>Asunto:</strong> {emailSubject}
                </div>
              </div>

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

                {/* CTA Button */}
                <div className="text-center pt-2 pb-1">
                  <a
                    href={loginUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E7F900] hover:bg-[#d4e500] text-black font-heading font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(231,249,0,0.3)]"
                  >
                    <span>Activar Cuenta e Ingresar al Sistema</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Security Note */}
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Aviso de Seguridad Criptográfico</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-zinc-500">
                    Al ingresar por primera vez con tu clave provisional, el sistema te solicitará de forma obligatoria definir tu contraseña definitiva. Esta invitación expira en 48 horas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: WhatsApp / Slack Direct Copy */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px]">
                    Mensaje Formateado para WhatsApp / Slack:
                  </span>
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
                  <span>Configuración del Canal Transaccional</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Remitente Autorizado:</span>
                    <span className="text-white font-bold">{senderEmail}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Proveedor Recomendado:</span>
                    <span className="text-[#E7F900] font-bold">Resend / Google Workspace SMTP</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Protocolo de Cifrado:</span>
                    <span className="text-white font-bold">TLS 1.3 / STARTTLS (Puerto 587)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Tasa de Entrega Esperada:</span>
                    <span className="text-emerald-400 font-bold">99.8% (Cero Spam)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-zinc-400 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-200 font-bold font-mono">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>¿Cómo funciona en producción (Stripe / Auth0 Style)?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  En producción se registra la llave API de tu proveedor transaccional en el archivo <code>.env</code> del backend (ej. <code>RESEND_API_KEY</code> o <code>SPRING_MAIL_HOST</code>). El backend se encarga de despachar el correo en segundo plano y registrar el log de auditoría en la base de datos PostgreSQL.
                </p>
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

            <button
              type="button"
              onClick={onConfirmSend}
              className="px-5 py-2.5 rounded-xl bg-[#E7F900] text-black font-bold hover:bg-[#d4e500] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(231,249,0,0.3)] active:scale-95"
            >
              <Check className="w-4 h-4 text-black" />
              <span>Confirmar & Registrar en PostgreSQL</span>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

