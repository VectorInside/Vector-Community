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

  const handleApprove = () => {
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
        onApproveAppointment(lead);
      }
    }, 700);
  };

  const criteriaList = [
    {
      id: 'identity',
      label: 'Identidad y Contacto E.164 Validado',
      checked: lead.criteriaAudit?.identityValidated ?? true,
      desc: `${lead.phone} • ${lead.email || 'Validado'}`,
    },
    {
      id: 'catalog',
      label: 'Interés Específico en Catálogo',
      checked: lead.criteriaAudit?.catalogIdentified ?? true,
      desc: lead.customerNeeds?.intent || 'Servicio / Tratamiento definido',
    },
    {
      id: 'financial',
      label: 'Aclaración Financiera Completa (Precios/MSI)',
      checked: lead.criteriaAudit?.financialClarified ?? true,
      desc: lead.customerNeeds?.objectionIdentified || 'Condiciones y aranceles resueltos por RAG',
    },
    {
      id: 'consent',
      label: 'Aceptación Explícita o Cita Confirmada',
      checked: approvedSuccess || isBillable || (lead.criteriaAudit?.consentOrBooked ?? false),
      desc: 'Consentimiento inambiguo de contacto / franja en agenda',
    },
  ];

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
                  Estado: <strong className="text-zinc-900 dark:text-white">{approvedSuccess ? 'CITA APROBADA (BILLABLE_LEAD)' : lead.status}</strong>
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
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 via-zinc-50 to-white dark:from-blue-950/20 dark:via-zinc-900/70 dark:to-zinc-900 border border-blue-500/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span>4. Correo Gmail Transaccional & Guía</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30">
                  {approvedSuccess ? '✉️ Gmail Enviado' : '✉️ Template Compilado'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Para: <strong>{lead.email || 'contacto@prospecto.com'}</strong></span>
                  <span className="text-emerald-500 font-bold text-[10px]">Adjunto: cita.ics</span>
                </div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1 font-sans">
                  <p className="font-bold text-zinc-900 dark:text-white">
                    Asunto: Confirmación de Cita: {lead.name} — {lead.customerNeeds?.intent || 'Cita de Valoración'}
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    "Hola {lead.name}, tu espacio ha sido reservado. Por favor preséntate 10 min antes. Si cuentas con estudios previos o radiografías, favor de tenerlos a la mano."
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist de los 4 Requisitos Booleanos AND */}
            <div className="p-4 rounded-2xl bg-zinc-900/5 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-neon" />
                  Regla Booleana AND (4/4 Criterios BILLABLE_LEAD)
                </span>
                <span className="text-[10px] font-mono font-bold text-neon-text">
                  Valor: $350.00 MXN
                </span>
              </div>

              <div className="space-y-2">
                {criteriaList.map((crit) => (
                  <div
                    key={crit.id}
                    className="flex items-start gap-2.5 p-2 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        crit.checked ? 'text-emerald-500 dark:text-neon' : 'text-zinc-300 dark:text-zinc-700'
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

          {/* Footer Sticky con Acción Primordial */}
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex flex-col gap-3">
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
                  <span>✅ Cita Aprobada & CAPI SHA256 Despachado</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="w-5 h-5" />
                  <span>✅ Aprobar, Agendar Google & Enviar Gmail</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenChat) onOpenChat(lead);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Intervenir Chat (Sutura Arcángel)</span>
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
};
