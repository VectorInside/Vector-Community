'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  Clock,
  MessageSquare,
  Lock,
  Flame,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { LEAD_STATUS_ENUM } from '@/utils/constants';
import { getDynamicCriteriaLabels } from '@/utils/businessVerticals';
import { calendarService } from '@/services/calendarService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getTodayIso = () => new Date().toISOString().split('T')[0];

export const PreCitaDrawer = ({ isOpen, onClose, lead, onApproveAppointment, onOpenChat }) => {
  const { activeTenant } = useAuth();
  const [isApproving, setIsApproving] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [approveError, setApproveError] = useState(null);
  const [manualOverride, setManualOverride] = useState(false);
  const [overrideEmail, setOverrideEmail] = useState('');

  // Selección real de fecha y horario disponible
  const [selectedDate, setSelectedDate] = useState(getTodayIso);
  const [selectedHour, setSelectedHour] = useState('10:00');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSlotDayOpen, setIsSlotDayOpen] = useState(true);
  const [slotUnavailableReason, setSlotUnavailableReason] = useState('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setApproveError(null);
    setApprovedSuccess(false);
    setManualOverride(false);
    setOverrideEmail('');
    setSelectedDate(getTodayIso());
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
    if (!isOpen || !activeTenant?.id || !selectedDate) return;
    let active = true;
    setIsLoadingSlots(true);
    calendarService
      .getAvailableSlots(activeTenant.id, selectedDate)
      .then((res) => {
        if (!active) return;
        const slots = Array.isArray(res?.availableSlots) ? res.availableSlots : [];
        setAvailableSlots(slots);
        setIsSlotDayOpen(res?.isOpen !== false);
        setSlotUnavailableReason(res?.reason || '');
        if (slots.length > 0) {
          setSelectedHour((prev) => (slots.includes(prev) ? prev : slots[0]));
        }
      })
      .catch(() => {
        if (!active) return;
        setAvailableSlots([]);
        setIsSlotDayOpen(true);
        setSlotUnavailableReason('');
      })
      .finally(() => {
        if (active) setIsLoadingSlots(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, activeTenant?.id, selectedDate]);

  const dynamicCriteria = useMemo(() => getDynamicCriteriaLabels(activeTenant), [activeTenant]);

  if (!isOpen || !lead) return null;

  const isBillable = lead.leadState === LEAD_STATUS_ENUM.BILLABLE_LEAD;
  const rawEmail = manualOverride && overrideEmail ? overrideEmail.trim() : (lead.email || '').trim();
  const hasValidEmail = Boolean(
    rawEmail &&
      rawEmail !== 'No capturado' &&
      rawEmail !== 'Pendiente' &&
      EMAIL_REGEX.test(rawEmail)
  );
  const isOverrideEmailValid = EMAIL_REGEX.test((overrideEmail || '').trim());

  // Criterios deterministas adaptados a la vertical del tenant (ADR_008 §2.2)
  const identityChecked = Boolean(lead.criteriaAudit?.identityValidated ?? (lead.phone && hasValidEmail));
  const catalogChecked = Boolean(
    lead.criteriaAudit?.catalogIdentified ??
      (lead.customerNeeds?.intent && !lead.customerNeeds?.intent?.toLowerCase().includes('básica sin datos'))
  );
  const financialChecked = Boolean(
    lead.criteriaAudit?.financialClarified ?? (lead.billingStatus === 'BILLABLE' || isBillable)
  );
  const consentChecked = Boolean(
    approvedSuccess || isBillable || manualOverride || lead.criteriaAudit?.consentOrBooked
  );

  const checkByCriterionId = {
    identity: {
      checked: identityChecked,
      desc: `${lead.phone || 'Sin WhatsApp'} • ${hasValidEmail ? rawEmail : 'Correo electrónico pendiente'}`,
    },
    catalog: {
      checked: catalogChecked,
      desc: catalogChecked
        ? lead.customerNeeds?.intent || 'Servicio o tratamiento definido'
        : 'Pendiente de definir interés específico en catálogo',
    },
    financial: {
      checked: financialChecked,
      desc: financialChecked
        ? lead.customerNeeds?.objectionIdentified ||
          lead.customerNeeds?.objection ||
          'Precios y aranceles clarificados por la IA'
        : 'Pendiente de resolver objeción de precio o financiamiento',
    },
    consent: {
      checked: consentChecked,
      desc: consentChecked
        ? 'Cita acordada y consentida por el prospecto'
        : 'Prospecto en pausa o con evasiva; no ha aceptado fecha de cita',
    },
  };

  const criteriaList = dynamicCriteria.map((crit, index) => {
    const rawLabel = crit.label || `${index + 1}. ${crit.shortLabel}`;
    const labelWithEmail =
      crit.id === 'identity' && !/correo|email/i.test(rawLabel)
        ? `${rawLabel} (WhatsApp y Email)`
        : rawLabel;
    const state = checkByCriterionId[crit.id] || { checked: false, desc: crit.description };
    return {
      id: crit.id,
      label: labelWithEmail,
      checked: state.checked,
      desc: state.desc,
    };
  });

  const completedCriteriaCount = criteriaList.filter((c) => c.checked).length;
  // Un lead está "amarrado" cuando es Billable, cumple los 4 criterios con email o se activa override manual con email válido
  const isFullyAmarrado =
    approvedSuccess ||
    (isBillable && hasValidEmail) ||
    (completedCriteriaCount === 4 && hasValidEmail) ||
    (manualOverride && isOverrideEmailValid);

  const handleApprove = async () => {
    if (!isFullyAmarrado || isApproving) return;
    if (!selectedDate || !selectedHour) {
      setApproveError('Selecciona una fecha y horario válido antes de agendar.');
      return;
    }
    setIsApproving(true);
    setApproveError(null);
    try {
      if (onApproveAppointment) {
        await onApproveAppointment({
          ...lead,
          email: rawEmail || lead.email,
          appointmentDate: selectedDate,
          hour: selectedHour,
        });
      }
      setApprovedSuccess(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E7F900', '#10B981', '#38BDF8', '#FFFFFF'],
        });
      } catch (e) {}
    } catch (err) {
      setApproveError(
        err?.response?.data?.message || err?.message || 'Error al guardar la cita en PostgreSQL.'
      );
    } finally {
      setIsApproving(false);
    }
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
          <div className="w-screen max-w-xl bg-[var(--bg-panel)] border-l border-[var(--border-color)] shadow-2xl flex flex-col justify-between transition-all transform ease-out duration-300 pointer-events-auto animate-slide-in-right">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-card-subtle)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-2xl shadow-inner">
                    {lead.avatar || '👤'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-heading font-black text-[var(--text-main)]">
                        {lead.name}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neon/20 border border-neon/40 text-[var(--neon-text)] font-black uppercase tracking-wider">
                        Dictamen Pre-Cita
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                      <span>{lead.channel || 'Meta Ads / WhatsApp'}</span>
                      <span>•</span>
                      <span className="text-[var(--neon-text)] font-bold">
                        Ticket Est: {lead.potentialTicket || (lead.estimatedValue ? `$${lead.estimatedValue} MXN` : '$0 MXN')}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
                  title="Cerrar panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Banner de Estado de Temperatura */}
              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-xs">
                <div className="flex items-center gap-2">
                  <Flame className={`w-4 h-4 ${isBillable || approvedSuccess ? 'text-[var(--neon-text)]' : 'text-amber-600 dark:text-amber-400'}`} />
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    Estado:{' '}
                    <strong className="text-[var(--text-main)]">
                      {approvedSuccess ? 'CITA APROBADA (PROSPECTO CALIFICADO)' : lead.status}
                    </strong>
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]">
                  {lead.countdown24h || 'Atribución Activa'}
                </span>
              </div>
            </div>

            {/* Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Viñeta 1: Datos del Lead */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs transition-colors">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--text-main)] mb-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>1. Datos de Contacto Verificados (WhatsApp &amp; Email)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">WhatsApp Activo</span>
                    <div className="flex items-center gap-1.5 font-mono text-[var(--text-main)] font-bold">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{lead.phone || 'No capturado'}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Correo Electrónico</span>
                    <div className="flex items-center gap-1.5 text-[var(--text-main)] font-bold truncate">
                      <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{hasValidEmail ? rawEmail : 'Pendiente'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Viñeta 2: Producto de Interés */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs transition-colors">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--text-main)] mb-3">
                  <div className="w-6 h-6 rounded-lg bg-neon/20 text-[var(--neon-text)] flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <span>2. Producto de Interés &amp; Requerimiento</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs">
                  <p className="font-bold text-[var(--text-main)] mb-1">
                    {lead.customerNeeds?.intent || 'Interés registrado por el Sub-Bot'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)] mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)]">
                      Urgencia: <strong>{lead.customerNeeds?.buyingUrgency || 'Alta'}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                      Valor:{' '}
                      {lead.potentialTicket ||
                        (lead.estimatedValue
                          ? `$${lead.estimatedValue} MXN`
                          : activeTenant?.leadPriceMXN
                          ? `$${activeTenant.leadPriceMXN} MXN (Lead Calificado)`
                          : 'Sin valor asignado')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Viñeta 3: Objeciones & Financiamiento Resueltos */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs transition-colors">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--text-main)] mb-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>3. Objeciones &amp; Financiamiento Resueltos por RAG</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs space-y-2">
                  <p className="text-[var(--text-main)] leading-relaxed">
                    {lead.customerNeeds?.aiSummary ||
                      lead.dictamen?.replace(/<[^>]+>/g, '') ||
                      'El prospecto fue guiado a través de los aranceles oficiales sin alucinaciones.'}
                  </p>
                  {(lead.customerNeeds?.objectionIdentified || lead.customerNeeds?.objection) && (
                    <div className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
                      <strong>Objeción superada:</strong>{' '}
                      {lead.customerNeeds.objectionIdentified || lead.customerNeeds.objection}
                    </div>
                  )}
                </div>
              </div>

              {/* Viñeta 4: Despacho Transaccional Gmail API (ADR-001 & ADR-003) */}
              <div
                className={`p-4 rounded-2xl border shadow-xs space-y-3 transition-colors ${
                  hasValidEmail
                    ? 'bg-blue-500/5 border-blue-500/30'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        hasValidEmail
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                          : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span>4. Correo Gmail Transaccional &amp; Guía</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      approvedSuccess
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : hasValidEmail
                        ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {approvedSuccess
                      ? '✉️ Gmail Enviado'
                      : hasValidEmail
                      ? '✉️ Template Compilado'
                      : '⚠️ Correo Pendiente'}
                  </span>
                </div>

                {hasValidEmail ? (
                  <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)]">
                        Para: <strong className="text-[var(--text-main)]">{rawEmail}</strong>
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                        Adjunto: cita.ics
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] space-y-1 font-sans">
                      <p className="font-bold text-[var(--text-main)]">
                        Asunto: Confirmación de Cita: {lead.name} — {lead.customerNeeds?.intent || 'Cita de Valoración'}
                      </p>
                      <p className="text-[var(--text-muted)] text-[11px]">
                        &quot;Hola {lead.name}, tu espacio ha sido reservado. Por favor preséntate 10 min antes.&quot;
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs space-y-1">
                    <p className="font-bold text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Sin correo válido capturado para notificación Gmail</span>
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      El prospecto aún no comparte su email válido en WhatsApp. Es necesario solicitarlo en el chat antes de poder despachar el archivo de calendario <code>cita.ics</code>.
                    </p>
                  </div>
                )}
              </div>

              {/* Selector de Disponibilidad Real (Fecha y Horario antes de Agendar) */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-black uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--neon-text)]" />
                    <span>Fecha y Horario Disponible</span>
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {isLoadingSlots
                      ? 'Consultando agenda...'
                      : isSlotDayOpen
                      ? `${availableSlots.length} espacios libres`
                      : 'Día cerrado'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] block mb-1">Fecha de Cita</label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={getTodayIso()}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] text-xs outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] block mb-1">Horario Seleccionado</label>
                    {availableSlots.length > 0 ? (
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold outline-none focus:border-neon"
                      >
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot} hrs (Disponible)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="time"
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold outline-none focus:border-neon"
                      />
                    )}
                  </div>
                </div>

                {!isSlotDayOpen && slotUnavailableReason && (
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 font-sans">
                    {slotUnavailableReason} Puedes elegir otra fecha o definir un horario manual.
                  </p>
                )}
              </div>

              {/* Alerta de Gobernanza si el Lead NO está amarrado */}
              {!isFullyAmarrado && !approvedSuccess && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-amber-900 dark:text-amber-200">
                      Gobernanza: Prospecto No Amarrado ({completedCriteriaCount}/4 Criterios)
                    </div>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                      Este lead se encuentra en estado <strong>{lead.status}</strong>. Meter una cita en este estado generará una inasistencia (No-Show). Se recomienda intervenir el chat para asegurar su interés y correo antes de agendar.
                    </p>
                  </div>
                </div>
              )}

              {/* Checklist de los 4 Requisitos Booleanos AND */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[var(--neon-text)]" />
                    Validación de Calidad ({completedCriteriaCount}/4 Criterios Cumplidos)
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isFullyAmarrado
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isFullyAmarrado ? 'CALIFICADO PARA CITA' : 'INCOMPLETO (BLOQUEADO)'}
                  </span>
                </div>

                <div className="space-y-2">
                  {criteriaList.map((crit) => (
                    <div
                      key={crit.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs transition-colors ${
                        crit.checked
                          ? 'bg-[var(--bg-panel)] border-[var(--border-color)]'
                          : 'bg-[var(--bg-card-subtle)] border-dashed border-[var(--border-color)] opacity-85'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          crit.checked
                            ? 'text-emerald-600 dark:text-[var(--neon-text)]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      />
                      <div>
                        <span
                          className={`font-bold block ${
                            crit.checked ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {crit.label}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">{crit.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Sticky con Acción Inteligente */}
            <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-card-subtle)] flex flex-col gap-3">
              {approveError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{approveError}</span>
                </div>
              )}
              {isFullyAmarrado ? (
                /* CASO A: Lead Calificado / Amarrado -> Botón de Agendamiento Activo */
                <button
                  type="button"
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
                      <span>Guardando cita en Agenda PostgreSQL...</span>
                    </>
                  ) : approvedSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>✅ Cita Aprobada &amp; Guardada ({selectedDate} • {selectedHour} hrs)</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-5 h-5" />
                      <span>✅ Aprobar &amp; Agendar ({selectedDate} • {selectedHour} hrs)</span>
                    </>
                  )}
                </button>
              ) : (
                /* CASO B: Lead NO Amarrado -> Botón Bloqueado + Acción de Intervenir Chat Destacada */
                <div className="space-y-2.5">
                  <div
                    className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] font-mono text-xs flex items-center justify-center gap-2 cursor-not-allowed select-none"
                    title="El agendamiento está bloqueado porque el lead no ha confirmado fecha ni correo"
                  >
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Agendamiento Bloqueado: Lead No Amarrado ({completedCriteriaCount}/4)</span>
                  </div>

                  <button
                    type="button"
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
                        className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] dark:hover:text-neon underline transition-colors cursor-pointer"
                      >
                        ¿El cliente ya confirmó por llamada? Completar datos y forzar agendamiento
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-amber-500/40 space-y-2 text-xs font-mono">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase block">
                        Atención Humana: Captura de Correo Válido para Despacho
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="correo@cliente.com"
                          value={overrideEmail}
                          onChange={(e) => setOverrideEmail(e.target.value)}
                          className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)] outline-none focus:border-neon"
                        />
                        <button
                          type="button"
                          disabled={!isOverrideEmailValid || isApproving}
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
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenChat) onOpenChat(lead);
                    }}
                    className="flex-1 py-2 px-4 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Abrir Chat de WhatsApp</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] text-xs font-bold transition-colors"
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
