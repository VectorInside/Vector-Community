'use client';

import React, { useState, useEffect } from 'react';
import { Portal } from '@/components/common/Portal';
import {
  X,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Tag,
  DollarSign,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  ExternalLink,
  MessageSquare,
  Lock,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEAD_STATUS_ENUM } from '@/utils/constants';

export const PreCitaDrawer = ({ isOpen, onClose, lead, onApproveAppointment, onOpenChat }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [overrideEmail, setOverrideEmail] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !lead) return null;

  const isBillable = lead.leadState === LEAD_STATUS_ENUM.BILLABLE_LEAD;
  const rawEmail = manualOverride && overrideEmail ? overrideEmail : lead.email;
  const hasValidEmail = Boolean(rawEmail && rawEmail !== 'No capturado' && rawEmail !== 'Pendiente' && rawEmail.includes('@'));

  // Criterios BANT deterministas
  const identityChecked = Boolean(lead.criteriaAudit?.identityValidated ?? (lead.phone && hasValidEmail));
  const catalogChecked = Boolean(lead.criteriaAudit?.catalogIdentified ?? (lead.customerNeeds?.intent && !lead.customerNeeds?.intent?.toLowerCase().includes('básica sin datos')));
  const financialChecked = Boolean(lead.criteriaAudit?.financialClarified ?? (lead.billingStatus === 'BILLABLE' || isBillable));
  const consentChecked = Boolean(approvedSuccess || isBillable || manualOverride || lead.criteriaAudit?.consentOrBooked);

  const criteriaList = [
    {
      id: 'identity',
      label: '1. Identidad y Teléfono Verificado',
      checked: identityChecked,
      desc: `${lead.phone || 'Sin WhatsApp'} • ${hasValidEmail ? rawEmail : 'Correo electrónico pendiente'}`,
    },
    {
      id: 'catalog',
      label: '2. Interés Específico en Catálogo',
      checked: catalogChecked,
      desc: catalogChecked ? (lead.customerNeeds?.intent || 'Servicio o tratamiento definido') : 'Pendiente de definir interés específico en catálogo',
    },
    {
      id: 'financial',
      label: '3. Aclaración Financiera (Precios/MSI/Aranceles)',
      checked: financialChecked,
      desc: financialChecked ? (lead.customerNeeds?.objectionIdentified || 'Precios y aranceles clarificados por la IA') : 'Pendiente de resolver objeción de precio o financiamiento',
    },
    {
      id: 'consent',
      label: '4. Aceptación Explícita o Cita Confirmada',
      checked: consentChecked,
      desc: consentChecked ? 'Cita acordada y consentida por el prospecto' : 'Prospecto en pausa o con evasiva; no ha aceptado fecha de cita',
    },
  ];

  const completedCriteriaCount = criteriaList.filter((c) => c.checked).length;
  // Un lead está "amarrado" cuando es Billable, cumple los 4 criterios con email o se activa override manual
  const isFullyAmarrado = approvedSuccess || (isBillable && hasValidEmail) || (completedCriteriaCount === 4 && hasValidEmail) || (manualOverride && hasValidEmail);

  const handleApprove = () => {
    if (!isFullyAmarrado) return;
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setApprovedSuccess(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E7F900', '#10B981', '#38BDF8', '#FFFFFF'],
        });
      } catch (e) {}

      if (onApproveAppointment) {
        onApproveAppointment({
          ...lead,
          email: rawEmail || lead.email,
        });
      }
    }, 700);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity cursor-pointer"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
          <div className="w-screen max-w-xl bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between transition-all transform ease-out duration-300 pointer-events-auto animate-slide-in-right">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700/80 flex items-center justify-center text-2xl shadow-inner">
                  {lead.avatar || '👤'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-heading font-black text-zinc-900 dark:text-white">
                      {lead.name}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon/20 border border-neon/40 text-black dark:text-neon font-black uppercase tracking-wider">
                      Dictamen Pre-Cita
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>{lead.channel || 'Meta Ads / WhatsApp'}</span>
                    <span>•</span>
                    <span className="text-neon-text font-bold">Ticket Est: {lead.potentialTicket || '$0 MXN'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner de Estado de Temperatura */}
            <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${isBillable || approvedSuccess ? 'text-neon' : 'text-amber-500'}`} />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Estado: <strong className="text-zinc-900 dark:text-white">{approvedSuccess ? 'CITA APROBADA (PROSPECTO CALIFICADO)' : lead.status}</strong>
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {lead.countdown24h || 'Atribución Activa'}
              </span>
            </div>
          </div>

          {/* Body Scrollable: 3 Viñetas de Resumen de Inteligencia */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Viñeta 1: Datos del Lead */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>1. Datos de Contacto Verificados (E.164)</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">WhatsApp Activo</span>
                  <div className="flex items-center gap-1.5 font-mono text-zinc-800 dark:text-zinc-200 font-bold">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{lead.phone || 'No capturado'}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Correo Electrónico</span>
                  <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-bold truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{lead.email || 'Pendiente'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Viñeta 2: Producto de Interés */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
                <div className="w-6 h-6 rounded-lg bg-neon/20 text-black dark:text-neon flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <span>2. Producto de Interés & Requerimiento</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs">
                <p className="font-bold text-zinc-900 dark:text-white mb-1">
                  {lead.customerNeeds?.intent || 'Interés registrado por el Sub-Bot'}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    Urgencia: <strong>{lead.customerNeeds?.buyingUrgency || 'Alta'}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                    Valor: {lead.potentialTicket || '$350 MXN (Lead Calificado)'}
                  </span>
                </div>
              </div>
            </div>

              {/* Viñeta 3: Objeciones & Financiamiento Resueltos */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>3. Objeciones & Financiamiento Resueltos por RAG</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs space-y-2">
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {lead.customerNeeds?.aiSummary || lead.dictamen?.replace(/<[^>]+>/g, '') || 'El prospecto fue guiado a través de los aranceles oficiales sin alucinaciones.'}
                </p>
                {lead.customerNeeds?.objectionIdentified && (
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <strong>Objeción superada:</strong> {lead.customerNeeds.objectionIdentified}
                  </div>
                )}
              </div>
            </div>

            {/* Viñeta 4: Despacho Transaccional Gmail API (ADR-001 & ADR-003) */}
            <div className={`p-4 rounded-2xl border shadow-xs space-y-3 transition-colors ${
              hasValidEmail
                ? 'bg-gradient-to-br from-blue-50/50 via-zinc-50 to-white dark:from-blue-950/20 dark:via-zinc-900/70 dark:to-zinc-900 border-blue-500/30'
                : 'bg-zinc-100/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${hasValidEmail ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-500/20 text-zinc-400'}`}>
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span>4. Correo Gmail Transaccional & Guía</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  approvedSuccess
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : hasValidEmail
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  {approvedSuccess
                    ? '✉️ Gmail Enviado'
                    : hasValidEmail
                    ? '✉️ Template Compilado'
                    : '⚠️ Correo Pendiente'}
                </span>
              </div>

              {hasValidEmail ? (
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Para: <strong>{rawEmail}</strong></span>
                    <span className="text-emerald-500 font-bold text-[10px]">Adjunto: cita.ics</span>
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1 font-sans">
                    <p className="font-bold text-zinc-900 dark:text-white">
                      Asunto: Confirmación de Cita: {lead.name} — {lead.customerNeeds?.intent || 'Cita de Valoración'}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                      "Hola {lead.name}, tu espacio ha sido reservado. Por favor preséntate 10 min antes."
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <p className="font-bold text-amber-400 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Sin correo capturado para notificación Gmail</span>
                  </p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    El prospecto aún no comparte su email en WhatsApp. Es necesario solicitarlo en el chat antes de poder despachar el archivo de calendario <code>cita.ics</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Alerta de Gobernanza si el Lead NO está amarrado */}
            {!isFullyAmarrado && !approvedSuccess && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-200">
                    Gobernanza: Prospecto No Amarrado ({completedCriteriaCount}/4 Criterios)
                  </div>
                  <p className="text-[11px] text-amber-300/80 leading-relaxed">
                    Este lead se encuentra en estado <strong>{lead.status}</strong> y contestó con evasiva. Meter una cita en este estado generará una inasistencia (No-Show). Se recomienda intervenir el chat para asegurar su interés antes de agendar.
                  </p>
                </div>
              </div>
            )}

            {/* Checklist de los 4 Requisitos Booleanos AND */}
            <div className="p-4 rounded-2xl bg-zinc-900/5 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-neon" />
                  Validación de Calidad ({completedCriteriaCount}/4 Criterios Cumplidos)
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isFullyAmarrado
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {isFullyAmarrado ? 'CALIFICADO PARA CITA' : 'INCOMPLETO (BLOQUEADO)'}
                </span>
              </div>

              <div className="space-y-2">
                {criteriaList.map((crit) => (
                  <div
                    key={crit.id}
                    className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs transition-colors ${
                      crit.checked
                        ? 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800'
                        : 'bg-zinc-100/50 dark:bg-zinc-900/30 border-dashed border-zinc-300 dark:border-zinc-800/60 opacity-80'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        crit.checked ? 'text-emerald-500 dark:text-neon' : 'text-zinc-400 dark:text-zinc-700'
                      }`}
                    />
                    <div>
                      <span className={`font-bold block ${crit.checked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`}>
                        {crit.label}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {crit.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Sticky con Acción Inteligente */}
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex flex-col gap-3">
            {isFullyAmarrado ? (
              /* CASO A: Lead Calificado / Amarrado -> Botón de Agendamiento Activo */
              <button
                onClick={handleApprove}
                disabled={isApproving || approvedSuccess}
                className={`w-full py-3.5 px-6 rounded-xl font-heading font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  approvedSuccess
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-neon text-black hover:bg-neon/90 hover:scale-[1.01] active:scale-[0.99] border border-neon/50'
                }`}
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Sincronizando con Google Calendar API...</span>
                  </>
                ) : approvedSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>✅ Cita Aprobada & Google Calendar Sincronizado</span>
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-5 h-5" />
                    <span>✅ Aprobar, Agendar Google & Enviar Gmail</span>
                  </>
                )}
              </button>
            ) : (
              /* CASO B: Lead NO Amarrado -> Botón Bloqueado + Acción de Intervenir Chat Destacada */
              <div className="space-y-2.5">
                <div
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono text-xs flex items-center justify-center gap-2 cursor-not-allowed select-none"
                  title="El agendamiento está bloqueado porque el lead no ha confirmado fecha ni correo"
                >
                  <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Agendamiento Bloqueado: Lead No Amarrado ({completedCriteriaCount}/4)</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenChat) onOpenChat(lead);
                  }}
                  className="w-full py-3.5 px-6 rounded-xl font-heading font-black text-sm bg-neon text-black hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(231,249,0,0.25)] transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>💬 Intervenir Chat para Amarrar Cita</span>
                </button>

                {/* Opción de Forzado Manual para cuando el operador habló por llamada */}
                {!manualOverride ? (
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setManualOverride(true)}
                      className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 dark:hover:text-neon underline transition-colors cursor-pointer"
                    >
                      ¿El cliente ya confirmó por llamada? Completar datos y forzar agendamiento
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-amber-500/40 space-y-2 text-xs font-mono">
                    <span className="text-[10px] font-bold text-amber-500 uppercase block">
                      HITL Override: Captura de Correo para Despacho
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="correo@cliente.com"
                        value={overrideEmail}
                        onChange={(e) => setOverrideEmail(e.target.value)}
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-neon"
                      />
                      <button
                        type="button"
                        disabled={!overrideEmail.includes('@')}
                        onClick={handleApprove}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs disabled:opacity-50 hover:bg-amber-300"
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              {isFullyAmarrado && (
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenChat) onOpenChat(lead);
                  }}
                  className="flex-1 py-2 px-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Abrir Chat de WhatsApp</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors"
              >
                Cerrar Dictamen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
};
