'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { calendarService } from '@/services/calendarService';
import { tenantService } from '@/services/tenantService';
import { Button } from '@/components/common/Button';
import { Portal } from '@/components/common/Portal';
import { Badge } from '@/components/common/Badge';
import { formatDateTime } from '@/utils/formatters';
import {
  Calendar as CalendarIcon,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Building2,
  ShieldCheck,
  Plus,
  CalendarCheck,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Mail,
  ExternalLink,
  X,
  AlertCircle,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Lock,
  MessageCircle,
  TrendingUp,
  DollarSign,
  CalendarDays,
  Coffee,
  Users,
  Briefcase,
  Utensils,
  Stethoscope,
  Settings2,
  Sliders,
  Trash2,
  Palette,
  Eye,
  Smartphone,
  Monitor,
  MapPin,
  Send,
  Check,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MobileSyncModal } from './MobileSyncModal';
import {
  AppointmentConfirmationEmailModal,
  getGoogleCalendarUrl,
  triggerIcsDownload,
} from './AppointmentConfirmationEmailModal';

export function generateSlotHours(startTime, endTime, intervalMin = 60) {
  if (!startTime || !endTime || intervalMin <= 0) return [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startTotal = (startH || 0) * 60 + (startM || 0);
  const endTotal = (endH || 0) * 60 + (endM || 0);
  if (endTotal <= startTotal) return [];

  const hours = [];
  for (let current = startTotal; current < endTotal; current += intervalMin) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    hours.push(timeStr);
  }
  return hours;
}

export function recomputeShiftsHours(shifts, durationMin = 60) {
  return (shifts || []).map((shift) => ({
    ...shift,
    hours: generateSlotHours(shift.start, shift.end, durationMin),
  }));
}

export const DEFAULT_EMAIL_TEMPLATE = {
  senderName: 'Mi Negocio',
  senderEmail: 'citas@minegocio.com',
  logoAvatar: '🏢',
  accentColor: '#D4FF00',
  subject: '✅ Cita Confirmada: {{servicio}} en {{negocio}}',
  welcomeMessage: '¡Hola, {{cliente}}! Tu cita ha sido agendada con éxito en nuestro sistema.',
  instructions: 'Por favor preséntate 10 minutos antes de tu cita programada.',
  locationType: 'physical',
  locationAddress: 'Dirección principal del negocio',
  virtualLink: '',
  cancellationPolicy: 'Puedes cancelar o reprogramar sin costo notificando con al menos 24 horas de antelación vía WhatsApp.',
  ctaText: 'Añadir a Google Calendar / Outlook',
  includeIcs: true,
  includeWhatsapp: true,
  sampleClient: 'Cliente Registrado',
  sampleClientEmail: 'cliente@correo.com',
  sampleService: 'Servicio General',
  sampleSpecialist: 'Especialista Asignado',
  sampleDateTime: 'Horario Programado',
};

export const TENANT_EMAIL_TEMPLATES = {
  default: DEFAULT_EMAIL_TEMPLATE,
};

export function replaceEmailVariables(text, vars = {}, tenantKey = 'default') {
  if (!text) return '';
  const template = TENANT_EMAIL_TEMPLATES[tenantKey] || DEFAULT_EMAIL_TEMPLATE;
  return text
    .replaceAll('{{cliente}}', vars?.cliente || vars?.client || template.sampleClient)
    .replaceAll('{{servicio}}', vars?.servicio || vars?.service || template.sampleService)
    .replaceAll('{{fecha}}', vars?.fecha || vars?.date || template.sampleDateTime?.split('•')[0]?.trim() || 'Fecha Programada')
    .replaceAll('{{hora}}', vars?.hora || vars?.hour || template.sampleDateTime?.split('•')[1]?.trim() || '11:00 hrs')
    .replaceAll('{{especialista}}', vars?.especialista || vars?.specialist || template.sampleSpecialist)
    .replaceAll('{{negocio}}', vars?.negocio || vars?.business || template.senderName)
    .replaceAll('{{ubicacion}}', vars?.ubicacion || vars?.location || template.locationAddress);
}

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTH_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const DAY_IDS_BY_JS_DAY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const STATIC_WEEK_DAYS_META = [
  { id: 'mon', name: 'Lunes' },
  { id: 'tue', name: 'Martes' },
  { id: 'wed', name: 'Miércoles' },
  { id: 'thu', name: 'Jueves' },
  { id: 'fri', name: 'Viernes' },
  { id: 'sat', name: 'Sábado' },
  { id: 'sun', name: 'Domingo' },
];

function toIsoDateStr(d) {
  const dateObj = d instanceof Date && !isNaN(d.getTime()) ? d : new Date();
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

function getIsoWeekNumber(dateStrOrObj) {
  const d = typeof dateStrOrObj === 'string' ? new Date(`${dateStrOrObj}T12:00:00`) : new Date(dateStrOrObj);
  if (isNaN(d.getTime())) return 1;
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
}

function buildWeekDaysForDate(isoDateStr) {
  const ref = isoDateStr ? new Date(`${isoDateStr}T12:00:00`) : new Date();
  const validRef = isNaN(ref.getTime()) ? new Date() : ref;
  const mondayOffset = (validRef.getDay() + 6) % 7;
  const monday = new Date(validRef);
  monday.setDate(validRef.getDate() - mondayOffset);

  return STATIC_WEEK_DAYS_META.map((meta, idx) => {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + idx);
    const dayNum = String(cur.getDate()).padStart(2, '0');
    const monthShort = MONTH_SHORT_ES[cur.getMonth()];
    return {
      id: meta.id,
      name: meta.name,
      dateStr: `${dayNum} ${monthShort}`,
      fullDate: toIsoDateStr(cur),
    };
  });
}

// Configuración limpia en Zero-State (sin turnos precargados en memoria/buffer)
const DEFAULT_FALLBACK_CONFIG = {
  type: 'shifts_split',
  slotDurationMin: 60,
  concurrencyLimit: 1,
  capacityLabel: 'Cita / Cliente',
  operatingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  shifts: [],
  breakInterval: null,
};

// Citas precargadas vacías para producción (Zero-State)
const INITIAL_DEMO_APPOINTMENTS = [];

export const MasterAgenda = () => {
  const { activeTenantId, activeTenant } = useTenant();
  const [appointments, setAppointments] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' (Mes Completo) | 'grid' (Zoom Día / Horas) | 'week_table' (Semana) | 'list'
  const [liveNow, setLiveNow] = useState(() => new Date());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState(() => DAY_IDS_BY_JS_DAY[new Date().getDay()]);
  const [selectedMonthDate, setSelectedMonthDate] = useState(() => toIsoDateStr(new Date()));
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'CONFIRMED' | 'TRIAGE'
  const [gmailSentSuccess, setGmailSentSuccess] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showMobileSyncModal, setShowMobileSyncModal] = useState(false);
  const [showEmailConfirmationModal, setShowEmailConfirmationModal] = useState(false);
  const [appointmentForEmail, setAppointmentForEmail] = useState(null);
  const [savedConfigSuccess, setSavedConfigSuccess] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('shifts'); // 'shifts' | 'email' | 'preview'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [testEmailSent, setTestEmailSent] = useState(false);

  // Leer configuración de calendario extraída por la IA para este tenant específico (o personalizada en vivo)
  const [calendarConfig, setCalendarConfig] = useState(() => {
    const base = activeTenant?.calendarConfig || DEFAULT_FALLBACK_CONFIG;
    return {
      ...base,
      shifts: recomputeShiftsHours(base.shifts || [], base.slotDurationMin || 60),
    };
  });

  const activeKey = activeTenant?.id || activeTenantId || null;

  // Almacenar configuraciones por tenant de forma estrictamente aislada
  const [tenantEmailConfigs, setTenantEmailConfigs] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vector_email_configs_by_tenant');
        if (saved) return { ...TENANT_EMAIL_TEMPLATES, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return TENANT_EMAIL_TEMPLATES;
  });

  const emailConfig = (activeKey && tenantEmailConfigs[activeKey]) || DEFAULT_EMAIL_TEMPLATE;
  const currentTenantTemplate = (activeKey && TENANT_EMAIL_TEMPLATES[activeKey]) || DEFAULT_EMAIL_TEMPLATE;

  const setEmailConfig = (updaterOrObj) => {
    if (!activeKey) return;
    setTenantEmailConfigs((prev) => {
      const current = prev[activeKey] || DEFAULT_EMAIL_TEMPLATE;
      const newObj = typeof updaterOrObj === 'function' ? updaterOrObj(current) : updaterOrObj;
      const updated = { ...prev, [activeKey]: newObj };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('vector_email_configs_by_tenant', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  // Reloj en tiempo real (sincronizado segundo a segundo con la hora local/CDMX)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sincronizar si cambia el tenant activo y cargar citas desde PostgreSQL Backend
  useEffect(() => {
    const base = activeTenant?.calendarConfig || DEFAULT_FALLBACK_CONFIG;
    setCalendarConfig({
      ...base,
      shifts: recomputeShiftsHours(base.shifts || [], base.slotDurationMin || 60),
    });

    const tenantKey = activeTenant?.id || activeTenantId;
    if (!tenantKey) {
      setAppointments([]);
      return;
    }

    calendarService
      .getAppointments(tenantKey)
      .then((backendApts) => {
        setAppointments(Array.isArray(backendApts) ? backendApts : []);
      })
      .catch(() => {
        setAppointments([]);
      });
  }, [activeTenantId, activeTenant]);

  const handlePrevMonth = () => {
    setCurrentCalendarMonth((prev) => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      const firstDateStr = `${newYear}-${String(newMonth + 1).padStart(2, '0')}-01`;
      setSelectedMonthDate(firstDateStr);
      const dt = new Date(`${firstDateStr}T12:00:00`);
      setSelectedDay(DAY_IDS_BY_JS_DAY[dt.getDay()]);
      return { year: newYear, month: newMonth };
    });
  };

  const handleNextMonth = () => {
    setCurrentCalendarMonth((prev) => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      const firstDateStr = `${newYear}-${String(newMonth + 1).padStart(2, '0')}-01`;
      setSelectedMonthDate(firstDateStr);
      const dt = new Date(`${firstDateStr}T12:00:00`);
      setSelectedDay(DAY_IDS_BY_JS_DAY[dt.getDay()]);
      return { year: newYear, month: newMonth };
    });
  };

  const handleGoToToday = () => {
    const now = new Date();
    const isoToday = toIsoDateStr(now);
    setLiveNow(now);
    setCurrentCalendarMonth({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedMonthDate(isoToday);
    setSelectedDay(DAY_IDS_BY_JS_DAY[now.getDay()]);
  };

  const handleUpdateDuration = (newDuration) => {
    const num = Number(newDuration);
    setCalendarConfig((prev) => ({
      ...prev,
      slotDurationMin: num,
      shifts: recomputeShiftsHours(prev.shifts, num),
    }));
  };

  const handleUpdateShift = (index, field, value) => {
    setCalendarConfig((prev) => {
      const updatedShifts = prev.shifts.map((s, i) => {
        if (i === index) {
          const updated = { ...s, [field]: value };
          return {
            ...updated,
            hours: generateSlotHours(
              field === 'start' ? value : updated.start,
              field === 'end' ? value : updated.end,
              prev.slotDurationMin
            ),
          };
        }
        return s;
      });
      return { ...prev, shifts: updatedShifts };
    });
  };

  const handleAddShift = () => {
    setCalendarConfig((prev) => {
      const newShiftIndex = (prev.shifts || []).length + 1;
      const newShift = {
        id: `shift_${Date.now()}`,
        name: `Turno ${newShiftIndex}`,
        icon: newShiftIndex === 2 ? 'sunset' : newShiftIndex >= 3 ? 'moon' : 'sun',
        start: newShiftIndex === 1 ? '09:00' : '16:00',
        end: newShiftIndex === 1 ? '14:00' : '20:00',
        hours: generateSlotHours(
          newShiftIndex === 1 ? '09:00' : '16:00',
          newShiftIndex === 1 ? '14:00' : '20:00',
          prev.slotDurationMin
        ),
      };
      return { ...prev, shifts: [...(prev.shifts || []), newShift] };
    });
  };

  const handleRemoveShift = (index) => {
    setCalendarConfig((prev) => ({
      ...prev,
      shifts: (prev.shifts || []).filter((_, i) => i !== index),
    }));
  };

  const handleToggleDay = (dayId) => {
    setCalendarConfig((prev) => {
      const currentDays = prev.operatingDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const exists = currentDays.includes(dayId);
      const updatedDays = exists ? currentDays.filter((d) => d !== dayId) : [...currentDays, dayId];
      return { ...prev, operatingDays: updatedDays };
    });
  };

  const handleSaveConfig = () => {
    const finalizedShifts = recomputeShiftsHours(calendarConfig.shifts, calendarConfig.slotDurationMin);
    const updatedConfig = {
      ...calendarConfig,
      shifts: finalizedShifts,
    };
    setCalendarConfig(updatedConfig);
    if (activeKey) {
      tenantService.updateVerticalConfig(activeKey, updatedConfig).catch(() => {});
    }
    setSavedConfigSuccess(true);
    try {
      confetti({ particleCount: 40, spread: 60, colors: [emailConfig.accentColor || '#D4FF00', '#10B981'] });
    } catch (e) {}
    setTimeout(() => {
      setSavedConfigSuccess(false);
      setShowConfigModal(false);
    }, 1200);
  };

  const handleTestEmail = () => {
    setTestEmailSent(true);
    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#3B82F6', emailConfig.accentColor || '#D4FF00'] });
    } catch (e) {}
    setTimeout(() => setTestEmailSent(false), 3500);
  };

  const todayIsoStr = toIsoDateStr(liveNow);
  const dynamicWeekDays = buildWeekDaysForDate(selectedMonthDate);
  const currentWeekNumber = getIsoWeekNumber(selectedMonthDate);
  const weekStartLabel = dynamicWeekDays[0]?.dateStr || '';
  const weekEndLabel = dynamicWeekDays[6]?.dateStr || '';
  const activeMonthName = MONTH_NAMES_ES[currentCalendarMonth.month] || '';
  const activeYear = currentCalendarMonth.year;
  const liveTimeFormatted = liveNow.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Cálculo dinámico de días del mes seleccionado (Calendario Gregoriano Real)
  const firstDayOfMonth = new Date(activeYear, currentCalendarMonth.month, 1);
  const daysInMonth = new Date(activeYear, currentCalendarMonth.month + 1, 0).getDate();
  const prevMonthDaysCount = new Date(activeYear, currentCalendarMonth.month, 0).getDate();
  const leadingBlankDays = (firstDayOfMonth.getDay() + 6) % 7; // Lunes = 0 ... Domingo = 6
  const prevMonthIndex = (currentCalendarMonth.month + 11) % 12;
  const nextMonthIndex = (currentCalendarMonth.month + 1) % 12;
  const trailingBlankDays = (7 - ((leadingBlankDays + daysInMonth) % 7)) % 7;

  const currentDayConfig = dynamicWeekDays.find((d) => d.id === selectedDay) || dynamicWeekDays[0];
  const isOperatingDay = !calendarConfig.operatingDays || calendarConfig.operatingDays.includes(selectedDay);

  // Total de horas calculadas dinámicamente según los turnos de este tenant
  const allShiftsHours = (calendarConfig.shifts || []).flatMap((s) => s.hours || []);
  const totalSlotsCount = allShiftsHours.length;

  const handleSyncGoogleCalendar = async () => {
    setSyncing(true);
    try {
      const result = await calendarService.triggerGoogleCalendarSync(activeTenantId);
      setSyncMessage(result.message || 'Google Calendar API sincronizado en tiempo real (Bidireccional).');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#D4FF00', '#3B82F6', '#10B981'],
        });
      } catch (e) {}
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenEmailConfirmation = (apt) => {
    setAppointmentForEmail(apt);
    setShowEmailConfirmationModal(true);
  };

  const handleSendGmailReminder = (apt) => {
    handleOpenEmailConfirmation(apt);
  };

  const handleBlockSlot = (shift, hour) => {
    alert(`Horario ${hour} (${shift.name}) bloqueado en Google Calendar. La IA ya no ofrecerá este espacio.`);
  };

  const handleManualBook = (shift, hour) => {
    const currentTenantKey = activeTenant?.id || activeTenantId || null;
    if (!currentTenantKey) {
      alert('Selecciona un negocio activo antes de agendar una cita.');
      return;
    }
    const clientName = prompt(`Agendar cita manual para las ${hour} hrs (${shift.name}):\nNombre del cliente / paciente:`);
    if (!clientName) return;
    const newApt = {
      id: `apt-${Date.now()}`,
      tenantId: currentTenantKey,
      dayId: selectedDay,
      fullDate: currentDayConfig.fullDate,
      hour: hour,
      title: `${clientName} — Cita Directa`,
      client: clientName,
      clientEmail: `${clientName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: '+52 55 0000 0000',
      specialist: 'Asignado en Recepción',
      serviceName: 'Atención Directa',
      serviceColor: '#10B981',
      estimatedValue: 1200,
      depositPaid: true,
      status: 'CONFIRMED',
      start: `${currentDayConfig.fullDate}T${hour}:00`,
      end: `${currentDayConfig.fullDate}T${hour}:45`,
      details: 'Agendado manualmente en Master Agenda',
    };
    setAppointments((prev) => [...prev, newApt]);
    calendarService.createAppointment({ ...newApt, fullDate: currentDayConfig.fullDate }).catch(() => {});
    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#10B981', '#D4FF00'] });
    } catch (e) {}
    // Abrir automáticamente el modal de correo de confirmación
    handleOpenEmailConfirmation(newApt);
  };

  // Filtrado de citas (por tenant activo y filtro de estado)
  const currentTenantId = activeTenant?.id || activeTenantId || null;
  const tenantAppointments = currentTenantId
    ? appointments.filter((apt) => !apt.tenantId || apt.tenantId === currentTenantId)
    : [];

  const filteredAppointments = tenantAppointments.filter((apt) => {
    if (filterStatus === 'CONFIRMED') return apt.depositPaid;
    if (filterStatus === 'TRIAGE') return !apt.depositPaid;
    return true;
  });

  // Citas y métricas del día seleccionado (coincidiendo fecha exacta o dayId)
  const dayAppointments = filteredAppointments.filter((a) => {
    if (a.fullDate) return a.fullDate === currentDayConfig.fullDate;
    if (a.start && a.start.includes('T')) return a.start.startsWith(currentDayConfig.fullDate);
    return a.dayId === selectedDay;
  });
  const confirmedCount = dayAppointments.filter((a) => a.depositPaid).length;
  const triageCount = dayAppointments.filter((a) => !a.depositPaid).length;
  const freeSlotsCount = Math.max(0, totalSlotsCount - dayAppointments.length);
  const totalOccupancyPct = totalSlotsCount > 0 ? Math.round((dayAppointments.length / totalSlotsCount) * 100) : 0;
  const estimatedDayRevenue = dayAppointments.reduce((acc, curr) => acc + (curr.estimatedValue || 1200), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 max-w-7xl mx-auto font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HERO: GOOGLE CALENDAR 2-WAY SYNC BANNER                            */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-neon/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon/20 via-neon/5 to-transparent border border-neon/30 flex items-center justify-center text-neon shadow-neon-sm">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight uppercase">
                Master <span className="text-neon">Agenda</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Google Calendar 2-Way Sync
              </span>
              <span
                suppressHydrationWarning
                className="px-2.5 py-0.5 rounded-full bg-neon/10 text-lime-700 dark:text-neon border border-neon/30 text-[10px] font-mono font-bold flex items-center gap-1.5"
              >
                <Clock className="w-3 h-3" />
                Tiempo Real CDMX: {liveTimeFormatted} hrs • {todayIsoStr}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex flex-wrap items-center gap-2 font-mono">
              <span>Negocio activo:</span>
              <strong className="text-[var(--text-main)]">{activeTenant?.name || 'Sin negocio seleccionado'}</strong>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-neon">Giro: {activeTenant?.giro || 'Sin giro activo'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            type="button"
            onClick={() => setShowMobileSyncModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-neon text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_var(--neon-glow)] hover:scale-105 active:scale-95 transition-all border border-neon/50"
            title="Ver en tu celular con Código QR y sincronizar con Google Calendar"
          >
            <Smartphone className="w-4 h-4" />
            <span>Ver en Celular & Google Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-neon/50 hover:border-neon text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-neon-sm"
            title="Personalizar turnos, duración de citas, descansos y membrete de correo"
          >
            <Settings2 className="w-4 h-4 text-neon" />
            <span>Personalizar Agenda & Turnos</span>
          </button>

          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            loading={syncing}
            disabled={syncing}
            onClick={handleSyncGoogleCalendar}
            className="shadow-neon-sm"
          >
            {syncing ? 'Sincronizando...' : 'Sincronizar Google Calendar'}
          </Button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-3 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{syncMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BARRA DE CONTROL: SWITCHER DE VISTAS & FILTROS                          */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Selector de Vistas Segmentado */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === 'month'
                ? 'bg-neon text-black font-bold shadow-[0_0_10px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span suppressHydrationWarning>🗓️ Mes Completo ({activeMonthName})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === 'grid'
                ? 'bg-neon text-black font-bold shadow-[0_0_10px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>⏱️ Detalle del Día & Turnos</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('week_table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === 'week_table'
                ? 'bg-neon text-black font-bold shadow-[0_0_10px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span suppressHydrationWarning>📅 Semana {currentWeekNumber}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === 'list'
                ? 'bg-neon text-black font-bold shadow-[0_0_10px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>📋 Lista Resumen</span>
          </button>
        </div>

        {/* Filtros de Estado */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">Filtrar Citas:</span>
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'CONFIRMED', label: '● Confirmadas' },
            { id: 'TRIAGE', label: '○ Pre-Cita Triage' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === st.id
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold border border-zinc-300 dark:border-zinc-700 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.5 VISTA MES COMPLETO (SINCRONIZADO EN TIEMPO REAL Y HORA REAL)          */}
      {/* ========================================================================= */}
      {viewMode === 'month' && (
        <div className="rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-6 space-y-6 animate-fadeIn shadow-2xl">
          {/* Cabecera del Mes */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-color)] gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                  <CalendarIcon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-main)] flex flex-wrap items-center gap-2">
                    <span suppressHydrationWarning>
                      {activeMonthName} {activeYear}
                    </span>
                    <span
                      suppressHydrationWarning
                      className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-muted)]"
                    >
                      {daysInMonth} Días • Sincronizado en Tiempo Real ({liveTimeFormatted} hrs)
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    Negocio: <strong>{activeTenant?.name || 'Sin negocio seleccionado'}</strong> • Haz clic en cualquier día para hacer <strong>Zoom</strong> a sus horarios y citas.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[var(--bg-card-subtle)] p-1 rounded-xl border border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  title="Mes Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="px-2.5 py-1 rounded-lg bg-neon/15 hover:bg-neon hover:text-black text-lime-800 dark:text-neon text-[11px] font-mono font-bold transition-all"
                  title="Ir al día de hoy en tiempo real"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  title="Mes Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-neon/15 text-lime-800 dark:text-neon border border-neon/30 font-bold">
                {filteredAppointments.length} Citas del Mes
              </span>
              <button
                type="button"
                onClick={() => setShowMobileSyncModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-main)] flex items-center gap-1.5 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5 text-neon" />
                <span>Móvil Sync</span>
              </button>
            </div>
          </div>

          {/* Días de la semana Header (Lunes a Domingo) */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] pb-2 border-b border-[var(--border-color)]">
            <span className="text-lime-700 dark:text-neon">Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
            <span className="text-rose-500/80">Dom</span>
          </div>

          {/* Grilla Dinámica del Mes Actual */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {/* Días previos del mes anterior para alinear el Lunes */}
            {Array.from({ length: leadingBlankDays }, (_, idx) => {
              const d = prevMonthDaysCount - leadingBlankDays + idx + 1;
              return (
                <div
                  key={`prev-${d}`}
                  className="min-h-[105px] p-2.5 rounded-2xl bg-[var(--bg-base)]/40 border border-dashed border-[var(--border-color)]/40 opacity-30 select-none flex flex-col justify-between"
                >
                  <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{d}</span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">
                    {MONTH_NAMES_ES[prevMonthIndex]}
                  </span>
                </div>
              );
            })}

            {/* Días reales del mes activo */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
              const dayStr = String(dayNum).padStart(2, '0');
              const monthStr = String(currentCalendarMonth.month + 1).padStart(2, '0');
              const fullDate = `${activeYear}-${monthStr}-${dayStr}`;

              const dt = new Date(`${fullDate}T12:00:00`);
              const dayId = DAY_IDS_BY_JS_DAY[dt.getDay()];
              const isOperating = activeTenant
                ? !calendarConfig.operatingDays || calendarConfig.operatingDays.includes(dayId)
                : false;

              const aptsOnThisDay = !isOperating
                ? []
                : filteredAppointments.filter((a) => {
                    if (a.fullDate === fullDate) return true;
                    if (a.start && a.start.startsWith(fullDate)) return true;
                    return false;
                  });

              const isToday = fullDate === todayIsoStr;
              const isSelected = selectedMonthDate === fullDate;
              const hasApts = aptsOnThisDay.length > 0;
              const dayTotalRevenue = aptsOnThisDay.reduce((acc, curr) => acc + (curr.estimatedValue || 1200), 0);

              return (
                <div
                  key={fullDate}
                  onClick={() => {
                    setSelectedMonthDate(fullDate);
                    setSelectedDay(dayId);
                    setViewMode('grid');
                  }}
                  className={`min-h-[115px] p-3 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                    isSelected
                      ? 'bg-neon/15 border-neon shadow-[0_0_20px_var(--neon-glow)] ring-2 ring-neon/40'
                      : isToday
                      ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/40'
                      : hasApts
                      ? 'bg-[var(--bg-card)] border-neon/40 hover:border-neon hover:shadow-lg hover:-translate-y-0.5'
                      : isOperating
                      ? 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)]'
                      : 'bg-[var(--bg-card-subtle)]/60 border-[var(--border-color)]/60 opacity-50'
                  }`}
                  title={`Haz clic para ver el detalle del ${dayNum} de ${activeMonthName} ${activeYear}`}
                >
                  {/* Encabezado del número de día */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-mono font-black ${
                          isToday || hasApts
                            ? 'text-neon'
                            : 'text-[var(--text-main)] group-hover:text-neon transition-colors'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.5 rounded bg-neon text-black text-[8px] font-mono font-black uppercase">
                          HOY
                        </span>
                      )}
                    </div>
                    {hasApts ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {aptsOnThisDay.length}
                      </span>
                    ) : !activeTenant ? (
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">Sin negocio</span>
                    ) : !isOperating ? (
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">Cerrado</span>
                    ) : null}
                  </div>

                  {/* Citas preview dentro del día */}
                  <div className="space-y-1 my-1">
                    {aptsOnThisDay.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] truncate"
                        style={{ borderLeftColor: apt.serviceColor || '#3B82F6', borderLeftWidth: '2px' }}
                      >
                        <span className="font-bold text-neon mr-1">{apt.hour}</span>
                        <span>{apt.client.split(' ')[0]}</span>
                      </div>
                    ))}
                    {aptsOnThisDay.length > 2 && (
                      <span className="text-[9px] font-mono text-[var(--text-muted)] block text-right">
                        +{aptsOnThisDay.length - 2} más...
                      </span>
                    )}
                  </div>

                  {/* Footer del día */}
                  <div className="pt-1.5 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono">
                    {hasApts ? (
                      <span suppressHydrationWarning className="text-emerald-400 font-bold">
                        ${String(dayTotalRevenue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)] text-[9px]">
                        {!activeTenant ? 'Selecciona negocio' : isOperating ? 'Libre' : 'No opera'}
                      </span>
                    )}
                    <span className="text-[9px] text-neon opacity-0 group-hover:opacity-100 font-bold transition-opacity">
                      Zoom →
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Días del mes siguiente para completar la última fila */}
            {Array.from({ length: trailingBlankDays }, (_, idx) => (
              <div
                key={`next-${idx + 1}`}
                className="min-h-[105px] p-2.5 rounded-2xl bg-[var(--bg-base)]/40 border border-dashed border-[var(--border-color)]/40 opacity-30 select-none flex flex-col justify-between"
              >
                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{idx + 1}</span>
                <span className="text-[9px] font-mono text-[var(--text-muted)]">
                  {MONTH_NAMES_ES[nextMonthIndex]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VISTA 1: HORAS Y BLOQUES DINÁMICOS SEGÚN EL GIRO DEL TENANT (ZOOM DÍA) */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header del Día + Selector de Pestañas de Días */}
          <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className="px-2.5 py-1 rounded-xl bg-neon/15 hover:bg-neon hover:text-black text-lime-800 dark:text-neon border border-neon/30 text-xs font-mono font-bold flex items-center gap-1 transition-all mr-1 shadow-sm"
                  title="Volver a la vista del mes completo"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Volver al Mes</span>
                </button>
                <CalendarCheck className="w-5 h-5 text-brand-primary" />
                <span suppressHydrationWarning className="text-sm font-bold text-[var(--text-main)] tracking-wide">
                  Zoom Detallado • {currentDayConfig.name} {currentDayConfig.dateStr} ({currentDayConfig.fullDate})
                </span>
                <span
                  suppressHydrationWarning
                  className="px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] font-mono"
                >
                  CDMX (GMT-6) • {liveTimeFormatted} hrs
                </span>
              </div>

              {/* Selector de Día de la Semana Activa */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {dynamicWeekDays.map((d) => {
                  const dayAptsCount = filteredAppointments.filter(
                    (a) => a.fullDate === d.fullDate || (!a.fullDate && a.dayId === d.id)
                  ).length;
                  const isActive = selectedDay === d.id && selectedMonthDate === d.fullDate;
                  const isDayOpen = !calendarConfig.operatingDays || calendarConfig.operatingDays.includes(d.id);
                  const isDayToday = d.fullDate === todayIsoStr;
                  return (
                    <button
                      key={d.fullDate}
                      type="button"
                      onClick={() => {
                        setSelectedDay(d.id);
                        setSelectedMonthDate(d.fullDate);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-center transition-all shrink-0 border ${
                        isActive
                          ? 'bg-brand-primary text-black border-brand-primary font-bold shadow-neon-sm'
                          : isDayOpen
                          ? 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-color)]'
                          : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border-[var(--border-color)] line-through opacity-50'
                      }`}
                    >
                      <span className="block text-xs font-bold leading-tight">
                        {d.name} {isDayToday ? '• HOY' : ''}
                      </span>
                      <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono opacity-80">{d.dateStr}</span>
                        {dayAptsCount > 0 && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-black' : 'bg-brand-primary'
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strip Ejecutivo de Métricas del Día */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {confirmedCount} {calendarConfig.capacityLabel || 'Citas'} Agendadas
                </span>
                {triageCount > 0 && (
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    {triageCount} Pre-Citas IA
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-color)] font-medium">
                  {freeSlotsCount} Espacios Libres
                </span>
              </div>

              <div className="flex items-center gap-5 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-muted)] text-[11px]">Ocupación:</span>
                  <div className="w-24 h-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden">
                    <div
                      className="h-full bg-brand-primary transition-all duration-500"
                      style={{ width: `${totalOccupancyPct}%` }}
                    />
                  </div>
                  <span className="text-[var(--text-main)] font-bold text-[11px]">{totalOccupancyPct}%</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span suppressHydrationWarning>${String(estimatedDayRevenue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} MXN</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">estimados</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIN NEGOCIO SELECCIONADO O SIN TURNOS CONFIGURADOS (ZERO-STATE LIMPIO) */}
          {!activeTenant ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--bg-panel)] border border-dashed border-[var(--border-color)] space-y-3">
              <Building2 className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50" />
              <h4 className="text-base font-bold text-[var(--text-main)] font-mono">
                Sin negocio seleccionado
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-mono max-w-md mx-auto">
                Selecciona o registra un negocio activo en el selector superior para configurar sus turnos operativos y gestionar citas en tiempo real.
              </p>
            </div>
          ) : !isOperatingDay ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--bg-card-subtle)] border border-dashed border-[var(--border-color)] space-y-2">
              <Lock className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
              <h4 className="text-sm font-bold text-[var(--text-main)] font-mono">
                {currentDayConfig.name} — Día no operativo para {activeTenant?.name}
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                El agente de IA de WhatsApp no ofrecerá citas ni reservas para este día según las políticas configuradas.
              </p>
            </div>
          ) : (calendarConfig.shifts || []).length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--bg-panel)] border border-dashed border-[var(--border-color)] space-y-4">
              <Clock className="w-10 h-10 text-neon mx-auto opacity-70" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[var(--text-main)] font-mono">
                  Sin turnos configurados para {activeTenant?.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] font-mono max-w-md mx-auto">
                  No hay turnos precargados en memoria. Configura los horarios de atención de este negocio para habilitar los bloques de citas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModalTab('shifts');
                  setShowConfigModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs inline-flex items-center gap-2 shadow-[0_0_15px_var(--neon-glow)] hover:scale-105 transition-all"
              >
                <Settings2 className="w-4 h-4" />
                <span>Configurar Turnos Ahora</span>
              </button>
            </div>
          ) : (
            /* TURNOS CONFIGURADOS DINÁMICAMENTE POR EL NEGOCIO ACTIVO */
            <div className="space-y-5">
              {(calendarConfig.shifts || []).map((shift, shiftIndex) => {
                const isMorning = shift.icon === 'sun';
                const isDinner = shift.icon === 'moon';

                return (
                  <React.Fragment key={shift.id}>
                    <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 space-y-3">
                      {/* Cabecera del Turno */}
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {isMorning ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                          ) : isDinner ? (
                            <Moon className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Sunset className="w-4 h-4 text-indigo-400" />
                          )}
                          <span className="text-[var(--text-main)] font-mono font-bold">{shift.name}</span>
                          <span className="text-[var(--text-muted)] font-mono font-normal">
                            • {shift.start} a {shift.end} ({calendarConfig.slotDurationMin} min/bloque)
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          Capacidad: {calendarConfig.concurrencyLimit} {calendarConfig.capacityLabel}
                        </span>
                      </div>

                      {/* Lista de Slots de este Turno */}
                      <div className="space-y-2">
                        {(shift.hours || []).map((hour) => {
                          const appointment = dayAppointments.find(
                            (a) => a.hour === hour || (calendarConfig.slotDurationMin >= 60 && a.hour?.startsWith(hour.slice(0, 3)))
                          );
                          return (
                            <SlotRowItem
                              key={hour}
                              shift={shift}
                              hour={hour}
                              durationMin={calendarConfig.slotDurationMin}
                              concurrencyLimit={calendarConfig.concurrencyLimit}
                              capacityLabel={calendarConfig.capacityLabel}
                              appointment={appointment}
                              onSelectAppointment={setSelectedAppointment}
                              onManualBook={() => handleManualBook(shift, hour)}
                              onBlockSlot={() => handleBlockSlot(shift, hour)}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* INTERMEDIO / DESCANSO ENTRE TURNOS */}
                    {shiftIndex === 0 && calendarConfig.breakInterval && (
                      <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-center justify-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                        <Coffee className="w-3.5 h-3.5 text-amber-500/70" />
                        <span>
                          {calendarConfig.breakInterval.start} - {calendarConfig.breakInterval.end}:{' '}
                          {calendarConfig.breakInterval.label}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VISTA 2: SEMANA COMPLETA EN MATRIZ (7 DÍAS EN PARALELO)                 */}
      {/* ========================================================================= */}
      {viewMode === 'week_table' && (
        <div className="rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-6 space-y-5 animate-fadeIn shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-color)] gap-3">
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-neon" />
                <span>Agenda Semanal de Citas & Disponibilidad: <strong>{activeTenant?.name || 'Sin negocio seleccionado'}</strong></span>
              </h3>
              <p suppressHydrationWarning className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                Semana {currentWeekNumber} • {weekStartLabel} al {weekEndLabel} {activeYear} • Tiempo Real ({liveTimeFormatted} hrs)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-neon/15 text-lime-800 dark:text-neon border border-neon/30 font-bold">
                {filteredAppointments.length} Citas en la Semana
              </span>
              <button
                type="button"
                onClick={() => setShowMobileSyncModal(true)}
                className="px-3 py-1 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-main)] flex items-center gap-1.5 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5 text-neon" />
                <span>Móvil Sync</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {dynamicWeekDays.map((day) => {
              const aptsForDay = filteredAppointments.filter(
                (a) => a.fullDate === day.fullDate || (!a.fullDate && a.dayId === day.id)
              );
              const isDayOpen = activeTenant
                ? !calendarConfig.operatingDays || calendarConfig.operatingDays.includes(day.id)
                : false;
              const dayRevenue = aptsForDay.reduce((acc, curr) => acc + (curr.estimatedValue || 1200), 0);
              const isToday = day.fullDate === todayIsoStr;

              return (
                <div
                  key={day.fullDate}
                  className={`rounded-2xl border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'bg-gradient-to-b from-neon/10 via-[var(--bg-card)] to-[var(--bg-card)] border-neon shadow-[0_0_20px_var(--neon-glow)]'
                      : isDayOpen
                      ? 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-neon/40'
                      : 'bg-[var(--bg-card-subtle)] border-[var(--border-color)] opacity-60'
                  }`}
                >
                  {/* Cabecera del Día */}
                  <div
                    onClick={() => {
                      setSelectedDay(day.id);
                      setSelectedMonthDate(day.fullDate);
                      setViewMode('grid');
                    }}
                    className="p-3 border-b border-[var(--border-color)] text-center cursor-pointer hover:bg-neon/5 transition-colors rounded-t-2xl"
                    title="Haz clic para ver las horas detalladas de este día"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase font-bold text-[var(--text-main)]">
                        {day.name} {isToday ? '• HOY' : ''}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isDayOpen
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-zinc-500/15 text-zinc-500'
                        }`}
                      >
                        {!activeTenant ? 'Sin negocio' : isDayOpen ? `${aptsForDay.length} citas` : 'Cerrado'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)] block mt-0.5">
                      {day.dateStr}
                    </span>
                    {isDayOpen && dayRevenue > 0 && (
                      <span suppressHydrationWarning className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                        ${String(dayRevenue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} MXN
                      </span>
                    )}
                  </div>

                  {/* Cuerpo: Lista de Citas del Día */}
                  <div className="p-2 space-y-2 flex-1">
                    {!activeTenant ? (
                      <div className="py-12 text-center text-[10px] text-[var(--text-muted)] font-mono">
                        <Building2 className="w-4 h-4 mx-auto mb-1 opacity-50" />
                        Selecciona negocio
                      </div>
                    ) : !isDayOpen ? (
                      <div className="py-12 text-center text-[10px] text-[var(--text-muted)] font-mono">
                        <Lock className="w-4 h-4 mx-auto mb-1 opacity-50" />
                        Día No Operativo
                      </div>
                    ) : aptsForDay.length === 0 ? (
                      <div className="py-10 text-center text-[10px] text-[var(--text-muted)] font-mono">
                        <Coffee className="w-4 h-4 mx-auto mb-1 opacity-40 text-amber-500" />
                        Sin citas agendadas
                        <span className="block text-[9px] opacity-70 mt-0.5">Horarios libres</span>
                      </div>
                    ) : (
                      aptsForDay.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon/60 transition-all space-y-1.5 shadow-sm group relative"
                          style={{ borderLeftWidth: '3px', borderLeftColor: apt.serviceColor || '#3B82F6' }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-neon font-black">
                              {apt.hour} hrs
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          </div>

                          <div>
                            <p
                              onClick={() => setSelectedAppointment(apt)}
                              className="text-xs font-bold text-[var(--text-main)] truncate cursor-pointer hover:text-neon transition-colors"
                              title={apt.client}
                            >
                              {apt.client}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] truncate" title={apt.serviceName}>
                              {apt.serviceName}
                            </p>
                          </div>

                          <div className="text-[9px] text-[var(--text-muted)] font-mono truncate">
                            {apt.specialist}
                          </div>

                          {/* Quick Action Toolbar on hover */}
                          <div className="pt-1.5 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEmailConfirmation(apt);
                              }}
                              className="p-1 rounded bg-[var(--bg-card)] hover:bg-neon/15 hover:text-neon text-[var(--text-muted)] transition-colors"
                              title="Despachar Correo Personalizado"
                            >
                              <Mail className="w-3 h-3" />
                            </button>

                            <a
                              href={getGoogleCalendarUrl(apt, activeTenant)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded bg-[var(--bg-card)] hover:bg-blue-500/15 hover:text-blue-400 text-[var(--text-muted)] transition-colors"
                              title="Añadir a Google Calendar"
                            >
                              <CalendarIcon className="w-3 h-3" />
                            </a>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerIcsDownload(apt, activeTenant);
                              }}
                              className="p-1 rounded bg-[var(--bg-card)] hover:bg-emerald-500/15 hover:text-emerald-400 text-[var(--text-muted)] transition-colors"
                              title="Descargar archivo .ICS para Móvil / Apple"
                            >
                              <Download className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedAppointment(apt)}
                              className="text-[9px] text-neon font-bold hover:underline"
                            >
                              Ver →
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Botón Footer para Agendar Cita Rápida */}
                  {isDayOpen && (
                    <div className="p-2 border-t border-[var(--border-color)]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDay(day.id);
                          setSelectedMonthDate(day.fullDate);
                          setViewMode('grid');
                        }}
                        className="w-full py-1.5 rounded-lg bg-[var(--bg-card-subtle)] hover:bg-neon hover:text-black text-[var(--text-muted)] text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ver Horarios</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VISTA 3: LISTA CLÁSICA AUDITADA                                        */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Todas las Citas de {activeTenant?.name || 'Sin negocio seleccionado'}</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Mostrando {filteredAppointments.length} citas sincronizadas con Google Calendar API
              </p>
            </div>
            <Badge variant="neon" size="sm">
              {filteredAppointments.length} Registradas
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.length === 0 ? (
              <div className="col-span-full p-12 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                <CalendarCheck className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
                <h4 className="text-base font-bold text-[var(--text-main)]">Sin citas agendadas</h4>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                  {!activeTenant ? 'Selecciona un negocio para ver su calendario y agenda de citas.' : 'Este negocio aún no cuenta con citas programadas. Las citas confirmadas aparecerán aquí sincronizadas en tiempo real.'}
                </p>
              </div>
            ) : (
              filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => setSelectedAppointment(apt)}
                className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-primary/60 cursor-pointer transition-all space-y-3 group shadow-sm hover:shadow-neon-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-[var(--text-main)] group-hover:text-brand-primary transition-colors">
                      {apt.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{apt.specialist}</p>
                  </div>
                  <Badge variant={apt.depositPaid ? 'success' : 'purple'} size="xs">
                    {apt.depositPaid ? 'ANTICIPO VERIFICADO' : 'TRIAGE IA'}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-[var(--text-main)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{apt.start ? formatDateTime(apt.start) : `${apt.hour} hrs`}</span>
                  </div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="truncate">{apt.client}</span>
                  </div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="truncate">{apt.phone}</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>${apt.estimatedValue || 1200} MXN</span>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL INTERACTIVO DE DETALLE DE CITA & GMAIL NOTIFICACIÓN              */}
      {/* ========================================================================= */}
      {selectedAppointment && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedAppointment(null);
            }}
          >
            <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-panel)] border border-neon/50 shadow-2xl p-6 relative space-y-5 my-auto animate-scale-up">
            <button
              type="button"
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-neon" />
                Cita Confirmada Google Calendar & Vector Inside
              </span>
              <h3 className="text-xl font-bold text-[var(--text-main)] leading-snug">
                {selectedAppointment.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Paciente / Cliente: <strong className="text-[var(--text-main)]">{selectedAppointment.client}</strong>
              </p>
            </div>

            {/* Metadatos en Grilla */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Horario Agendado</span>
                <span className="text-[var(--text-main)] font-bold">
                  {selectedAppointment.start ? formatDateTime(selectedAppointment.start) : `${selectedAppointment.hour} hrs`}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Contacto WhatsApp</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedAppointment.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Especialista / Asignado</span>
                <span className="text-[var(--text-main)] font-medium truncate">{selectedAppointment.specialist}</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Valor Estimado Cita</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">${selectedAppointment.estimatedValue || 1200} MXN</span>
              </div>
            </div>

            {/* Tarjeta de Correo Gmail & Previsualización Membretada */}
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between text-blue-500 font-bold border-b border-[var(--border-color)] pb-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-neon" />
                  Notificación Membretada Oficial
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Archivo .ICS Adjunto ✅
                </span>
              </div>

              {/* Simulación del Correo Membretado HTML */}
              <div
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] p-4 space-y-3 font-sans shadow-lg"
                style={{ borderTop: `4px solid ${emailConfig.accentColor || '#D4FF00'}` }}
              >
                {/* Membrete / Header de Marca */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                      {emailConfig.logoAvatar || activeTenant?.avatar || '🏢'}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[var(--text-main)] block">{emailConfig.senderName}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">{emailConfig.senderEmail}</span>
                    </div>
                  </div>
                  <span
                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${emailConfig.accentColor || '#D4FF00'}15`,
                      color: emailConfig.accentColor || '#D4FF00',
                      border: `1px solid ${emailConfig.accentColor || '#D4FF00'}40`,
                    }}
                  >
                    CONFIRMADA OFICIAL
                  </span>
                </div>

                {/* Cuerpo del Mensaje */}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[var(--text-main)]">
                    {replaceEmailVariables(emailConfig.welcomeMessage, {
                      client: selectedAppointment.client,
                      service: selectedAppointment.serviceName,
                      specialist: selectedAppointment.specialist,
                      business: emailConfig.senderName,
                    })}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Tu cita para <strong className="text-[var(--text-main)]">{selectedAppointment.serviceName || selectedAppointment.title}</strong> ha sido verificada y registrada en el sistema.
                  </p>
                </div>

                {/* Tarjeta de Resumen en el Correo */}
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[11px] font-mono space-y-1.5 text-[var(--text-main)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">🗓️ Fecha:</span>
                    <strong className="text-[var(--text-main)]">
                      {selectedAppointment.start ? formatDateTime(selectedAppointment.start) : `${selectedAppointment.hour} hrs`}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">👤 Asignado:</span>
                    <span className="text-[var(--text-main)]">{selectedAppointment.specialist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">📍 Lugar:</span>
                    <span className="text-[var(--text-main)]">
                      {emailConfig.locationType === 'virtual'
                        ? 'Enlace Virtual Google Meet'
                        : emailConfig.locationAddress}
                    </span>
                  </div>
                </div>

                {/* Indicaciones Previas */}
                {emailConfig.instructions && (
                  <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)] font-mono flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{emailConfig.instructions}</span>
                  </div>
                )}

                {/* Botón CTA dentro del correo */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Adjunto: {selectedAppointment.id}.ics
                  </span>
                  <span style={{ color: emailConfig.accentColor || '#D4FF00' }} className="font-bold">
                    {emailConfig.senderName}
                  </span>
                </div>
              </div>
            </div>

            {gmailSentSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>¡Correo de confirmación membretado despachado con éxito!</span>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button
                variant="primary"
                size="md"
                icon={Mail}
                onClick={() => handleOpenEmailConfirmation(selectedAppointment)}
                className="flex-1 shadow-neon-sm"
              >
                ✉️ Despachar Correo Personalizado
              </Button>

              <a
                href={getGoogleCalendarUrl(selectedAppointment, activeTenant)}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-500 dark:text-blue-400 text-xs font-bold border border-blue-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                title="Añadir cita a Google Calendar"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={() => triggerIcsDownload(selectedAppointment, activeTenant)}
                className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-color)] text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                title="Descargar archivo .ICS para iPhone / Apple Calendar / Outlook"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>.ICS</span>
              </button>

              <a
                href={`https://wa.me/${selectedAppointment.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono border border-[var(--border-color)]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}

      {/* ========================================================================= */}
      {/* 7. CENTRO DE PERSONALIZACIÓN INTEGRAL: AGENDA, TURNOS & EMAIL STUDIO       */}
      {/* ========================================================================= */}
      {showConfigModal && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowConfigModal(false);
            }}
          >
            <div className="w-full max-w-4xl rounded-3xl bg-[var(--bg-panel)] border border-brand-primary/50 shadow-2xl p-5 sm:p-7 relative flex flex-col max-h-[92vh] overflow-hidden my-auto animate-scale-up">
            {/* Header del Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border-color)] shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-brand-primary tracking-wider flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-brand-primary" />
                  Tenant: {activeTenant?.name || 'Sin negocio seleccionado'} • {activeTenant?.giro || 'Sin giro'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
                  Centro de Personalización: Agenda, Turnos & Email Studio
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Configura horarios, turnos dinámicos y el diseño exacto del correo membretado oficial para tus clientes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas de Navegación del Modal */}
            <div className="flex items-center gap-2 pt-3 pb-3 border-b border-[var(--border-color)] shrink-0 overflow-x-auto">
              {[
                { id: 'shifts', label: '1. Horarios & Turnos Dinámicos', icon: Clock },
                { id: 'email', label: '2. Email Studio & Membrete', icon: Palette },
                { id: 'preview', label: '3. Vista Previa en Vivo (WYSIWYG)', icon: Eye },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveModalTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 ${
                      isActive
                        ? 'bg-brand-primary text-black shadow-neon-sm'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Contenido Scrolleable según Pestaña Activa */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
              {/* ================================================================= */}
              {/* PESTAÑA 1: HORARIOS & TURNOS DINÁMICOS                           */}
              {/* ================================================================= */}
              {activeModalTab === 'shifts' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Días Operativos de la Semana */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)] font-mono flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-brand-primary" />
                        Días de Operación Semanal
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">
                        {(calendarConfig.operatingDays || []).length} días abiertos
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {STATIC_WEEK_DAYS_META.map((d) => {
                        const isOpen = !calendarConfig.operatingDays || calendarConfig.operatingDays.includes(d.id);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => handleToggleDay(d.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isOpen
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-bold shadow-sm'
                                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] line-through opacity-50'
                            }`}
                          >
                            <span className="block text-xs">{d.name}</span>
                            <span className="text-[10px] font-mono opacity-80">{isOpen ? 'Abierto' : 'Cerrado'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duración de Citas & Capacidad */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-4">
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-primary" />
                      Duración por Cita & Capacidad Concurrente
                    </span>

                    <div className="space-y-2">
                      <label className="text-[11px] text-[var(--text-muted)] font-mono block">
                        Duración de cada Bloque (Selecciona o escribe en minutos):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
                        {[15, 30, 45, 60, 90, 120].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => handleUpdateDuration(mins)}
                            className={`p-2 rounded-xl border transition-all text-center ${
                              calendarConfig.slotDurationMin === mins
                                ? 'bg-brand-primary text-black font-bold border-brand-primary shadow-neon-sm'
                                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-brand-primary/50'
                            }`}
                          >
                            {mins} min
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">
                          Capacidad Concurrente (Pacientes/Clientes simultáneos)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={calendarConfig.concurrencyLimit || 1}
                          onChange={(e) =>
                            setCalendarConfig({ ...calendarConfig, concurrencyLimit: Math.max(1, Number(e.target.value)) })
                          }
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] font-bold focus:border-brand-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">
                          Nomenclatura del Recurso
                        </label>
                        <input
                          type="text"
                          value={calendarConfig.capacityLabel || 'Cita / Paciente'}
                          onChange={(e) => setCalendarConfig({ ...calendarConfig, capacityLabel: e.target.value })}
                          placeholder="Ej: Sillón / Paciente, Mesa / Comensal, Box Médico"
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gestor Dinámico de Turnos */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)] font-mono flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-400" />
                        Turnos Operativos Configurados ({calendarConfig.shifts?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddShift}
                        className="px-3 py-1.5 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Agregar Turno</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(calendarConfig.shifts || []).length === 0 ? (
                        <div className="p-6 rounded-xl bg-[var(--bg-panel)] border border-dashed border-[var(--border-color)] text-center text-xs font-mono text-[var(--text-muted)]">
                          Sin turnos configurados. Haz clic en <strong>+ Agregar Turno</strong> para añadir bloques de horario.
                        </div>
                      ) : (
                        (calendarConfig.shifts || []).map((shift, idx) => (
                          <div
                            key={shift.id || idx}
                            className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={shift.name}
                                  onChange={(e) => handleUpdateShift(idx, 'name', e.target.value)}
                                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold focus:border-brand-primary outline-none"
                                  placeholder="Nombre del Turno (ej. Turno Matutino)"
                                />
                              </div>
                              <span className="px-2.5 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-mono text-brand-primary font-bold shrink-0">
                                ⚡ {shift.hours?.length || 0} slots ({calendarConfig.slotDurationMin} min)
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveShift(idx)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors shrink-0"
                                title="Eliminar este turno"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div>
                                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Hora Inicio</span>
                                <input
                                  type="text"
                                  value={shift.start}
                                  onChange={(e) => handleUpdateShift(idx, 'start', e.target.value)}
                                  placeholder="09:00"
                                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-center text-[var(--text-main)] focus:border-brand-primary outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Hora Fin</span>
                                <input
                                  type="text"
                                  value={shift.end}
                                  onChange={(e) => handleUpdateShift(idx, 'end', e.target.value)}
                                  placeholder="14:00"
                                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-center text-[var(--text-main)] focus:border-brand-primary outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Receso / Intervalo Intermedio */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)] font-mono flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-amber-500" />
                        Pausa Intermedia / Esterilización / Almuerzo
                      </span>
                      <input
                        type="checkbox"
                        checked={!!calendarConfig.breakInterval}
                        onChange={(e) =>
                          setCalendarConfig({
                            ...calendarConfig,
                            breakInterval: e.target.checked
                              ? { start: '14:00', end: '15:00', label: 'Esterilización y Almuerzo de Equipo' }
                              : null,
                          })
                        }
                        className="w-4 h-4 accent-brand-primary rounded"
                      />
                    </div>

                    {calendarConfig.breakInterval && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] block mb-1">Inicio de Pausa</label>
                          <input
                            type="text"
                            value={calendarConfig.breakInterval.start}
                            onChange={(e) =>
                              setCalendarConfig({
                                ...calendarConfig,
                                breakInterval: { ...calendarConfig.breakInterval, start: e.target.value },
                              })
                            }
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-center text-[var(--text-main)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] block mb-1">Fin de Pausa</label>
                          <input
                            type="text"
                            value={calendarConfig.breakInterval.end}
                            onChange={(e) =>
                              setCalendarConfig({
                                ...calendarConfig,
                                breakInterval: { ...calendarConfig.breakInterval, end: e.target.value },
                              })
                            }
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-center text-[var(--text-main)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] block mb-1">Motivo / Etiqueta</label>
                          <input
                            type="text"
                            value={calendarConfig.breakInterval.label}
                            onChange={(e) =>
                              setCalendarConfig({
                                ...calendarConfig,
                                breakInterval: { ...calendarConfig.breakInterval, label: e.target.value },
                              })
                            }
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-[var(--text-main)]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* PESTAÑA 2: EMAIL STUDIO & DISEÑADOR DE MEMBRETE                   */}
              {/* ================================================================= */}
              {activeModalTab === 'email' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Identidad del Remitente */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-4">
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-primary" />
                      1. Identidad del Remitente & Branding Oficial
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">Nombre Oficial Remitente</label>
                        <input
                          type="text"
                          value={emailConfig.senderName}
                          onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">Correo Emisor (Gmail / SMTP)</label>
                        <input
                          type="text"
                          value={emailConfig.senderEmail}
                          onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">Logotipo / Avatar del Negocio</label>
                        <input
                          type="text"
                          value={emailConfig.logoAvatar}
                          onChange={(e) => setEmailConfig({ ...emailConfig, logoAvatar: e.target.value })}
                          placeholder="Emoji (🦷) o URL de imagen"
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>
                    </div>

                    {/* Selector de Color de Marca */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[10px] text-[var(--text-muted)] font-mono block">
                        Color Primario del Membrete & Botones:
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { name: 'Neón Vector', color: '#D4FF00' },
                          { name: 'Azul Médico', color: '#3B82F6' },
                          { name: 'Esmeralda', color: '#10B981' },
                          { name: 'Púrpura VIP', color: '#8B5CF6' },
                          { name: 'Ámbar Cálido', color: '#F59E0B' },
                          { name: 'Magenta Rose', color: '#EC4899' },
                        ].map((c) => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => setEmailConfig({ ...emailConfig, accentColor: c.color })}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                              emailConfig.accentColor === c.color
                                ? 'bg-brand-primary/20 text-[var(--text-main)] font-bold border-brand-primary shadow-sm'
                                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }} />
                            <span>{c.name}</span>
                          </button>
                        ))}
                        <input
                          type="color"
                          value={emailConfig.accentColor}
                          onChange={(e) => setEmailConfig({ ...emailConfig, accentColor: e.target.value })}
                          className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] cursor-pointer"
                          title="Color personalizado"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Redacción & Variables Dinámicas */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--text-main)] font-mono flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-primary" />
                        2. Redacción del Correo & Variables Dinámicas
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                        <span className="text-[var(--text-muted)]">Variables:</span>
                        {['{{cliente}}', '{{servicio}}', '{{fecha}}', '{{hora}}', '{{especialista}}', '{{negocio}}'].map((v) => (
                          <span key={v} className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-brand-primary">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">Asunto del Correo (Subject)</label>
                        <input
                          type="text"
                          value={emailConfig.subject}
                          onChange={(e) => setEmailConfig({ ...emailConfig, subject: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">Mensaje de Saludo & Bienvenida</label>
                        <textarea
                          rows={2}
                          value={emailConfig.welcomeMessage}
                          onChange={(e) => setEmailConfig({ ...emailConfig, welcomeMessage: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">
                          Indicaciones Previas / Preparación para la Cita
                        </label>
                        <textarea
                          rows={2}
                          value={emailConfig.instructions}
                          onChange={(e) => setEmailConfig({ ...emailConfig, instructions: e.target.value })}
                          placeholder="Ej: Llegar 10 min antes, presentar identificación oficial y estudios previos."
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] block mb-1">Modalidad & Dirección Física</label>
                          <input
                            type="text"
                            value={emailConfig.locationAddress}
                            onChange={(e) => setEmailConfig({ ...emailConfig, locationAddress: e.target.value })}
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-[var(--text-main)] focus:border-brand-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[var(--text-muted)] block mb-1">Texto Botón de Acción (CTA)</label>
                          <input
                            type="text"
                            value={emailConfig.ctaText}
                            onChange={(e) => setEmailConfig({ ...emailConfig, ctaText: e.target.value })}
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2 text-[var(--text-main)] focus:border-brand-primary outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block mb-1">Políticas de Cancelación & Reprogramación</label>
                        <input
                          type="text"
                          value={emailConfig.cancellationPolicy}
                          onChange={(e) => setEmailConfig({ ...emailConfig, cancellationPolicy: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] focus:border-brand-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Automatizaciones de Adjunto & WhatsApp */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-2 text-xs font-mono">
                    <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-main)]">
                      <input
                        type="checkbox"
                        checked={emailConfig.includeIcs}
                        onChange={(e) => setEmailConfig({ ...emailConfig, includeIcs: e.target.checked })}
                        className="w-4 h-4 accent-brand-primary rounded"
                      />
                      <span>Adjuntar archivo <strong>.ICS (RFC 5545)</strong> autogenerado para Google / Apple / Outlook Calendar</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-main)]">
                      <input
                        type="checkbox"
                        checked={emailConfig.includeWhatsapp}
                        onChange={(e) => setEmailConfig({ ...emailConfig, includeWhatsapp: e.target.checked })}
                        className="w-4 h-4 accent-brand-primary rounded"
                      />
                      <span>Incluir botón interactivo de confirmación y dudas directas a <strong>WhatsApp Business</strong></span>
                    </label>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* PESTAÑA 3: VISTA PREVIA EN VIVO (WYSIWYG REAL-TIME)              */}
              {/* ================================================================= */}
              {activeModalTab === 'preview' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Selector de Dispositivo Desktop / Móvil */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                      <Eye className="w-4 h-4 text-brand-primary" />
                      <span>Previsualización en tiempo real del correo membretado HTML</span>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                          previewDevice === 'desktop'
                            ? 'bg-[var(--bg-panel)] text-[var(--text-main)] font-bold shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                          previewDevice === 'mobile'
                            ? 'bg-[var(--bg-panel)] text-[var(--text-main)] font-bold shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Móvil</span>
                      </button>
                    </div>
                  </div>

                  {/* Simulador de Cliente de Correo */}
                  <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
                    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-panel)] shadow-2xl overflow-hidden font-sans">
                      {/* Barra Superior del Correo (Headers) */}
                      <div className="p-3.5 bg-[var(--bg-card)] border-b border-[var(--border-color)] text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
                          <div>
                            <strong className="text-[var(--text-main)]">De:</strong> {emailConfig.senderName} &lt;{emailConfig.senderEmail}&gt;
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)]">hace 1 minuto</span>
                        </div>
                        <div className="text-[var(--text-muted)] text-[11px]">
                          <strong className="text-[var(--text-main)]">Para:</strong> {currentTenantTemplate.sampleClient} &lt;{currentTenantTemplate.sampleClientEmail}&gt;
                        </div>
                        <div className="text-[var(--text-main)] font-bold text-xs pt-1 truncate">
                          {replaceEmailVariables(emailConfig.subject, {
                            cliente: currentTenantTemplate.sampleClient,
                            servicio: currentTenantTemplate.sampleService,
                            negocio: emailConfig.senderName,
                          }, activeKey)}
                        </div>
                      </div>

                      {/* Cuerpo del Correo Membretado */}
                      <div
                        className="p-5 sm:p-6 space-y-4 bg-[var(--bg-panel)]"
                        style={{ borderTop: `4px solid ${emailConfig.accentColor || '#D4FF00'}` }}
                      >
                        {/* Cabecera Membretada con Logo */}
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                              {emailConfig.logoAvatar || activeTenant?.avatar || '🏢'}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-[var(--text-main)] leading-tight">{emailConfig.senderName}</h4>
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">Notificación Oficial Transaccional</span>
                            </div>
                          </div>
                          <span
                            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${emailConfig.accentColor || '#D4FF00'}20`,
                              color: emailConfig.accentColor || '#D4FF00',
                              border: `1px solid ${emailConfig.accentColor || '#D4FF00'}50`,
                            }}
                          >
                            CITA CONFIRMADA
                          </span>
                        </div>

                        {/* Mensaje de Bienvenida */}
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold text-[var(--text-main)]">
                            {replaceEmailVariables(emailConfig.welcomeMessage, {
                              cliente: currentTenantTemplate.sampleClient,
                              servicio: currentTenantTemplate.sampleService,
                              especialista: currentTenantTemplate.sampleSpecialist,
                            }, activeKey)}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            A continuación encontrarás los detalles completos de tu cita programada y el archivo para sincronizarlo con tu calendario personal.
                          </p>
                        </div>

                        {/* Tarjeta de Resumen de la Cita */}
                        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 text-xs font-mono">
                          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                            <span className="text-[var(--text-muted)]">Servicio Reservado:</span>
                            <strong className="text-[var(--text-main)]">{currentTenantTemplate.sampleService}</strong>
                          </div>
                          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                            <span className="text-[var(--text-muted)]">Fecha y Hora:</span>
                            <strong className="text-[var(--text-main)]">{currentTenantTemplate.sampleDateTime}</strong>
                          </div>
                          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                            <span className="text-[var(--text-muted)]">Especialista / Anfitrión:</span>
                            <span className="text-[var(--text-main)]">{currentTenantTemplate.sampleSpecialist}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--text-muted)]">Ubicación:</span>
                            <span className="text-[var(--text-main)] truncate max-w-[220px]">{emailConfig.locationAddress}</span>
                          </div>
                        </div>

                        {/* Indicaciones Previas Destacadas */}
                        {emailConfig.instructions && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-200 text-xs font-mono flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-amber-600 dark:text-amber-300 mb-0.5">Indicaciones Previas:</strong>
                              <span>{emailConfig.instructions}</span>
                            </div>
                          </div>
                        )}

                        {/* Botones de Acción (CTA) */}
                        <div className="space-y-2 pt-2">
                          <button
                            type="button"
                            className="w-full py-2.5 px-4 rounded-xl text-black font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                            style={{ backgroundColor: emailConfig.accentColor || '#D4FF00' }}
                          >
                            <CalendarIcon className="w-4 h-4" />
                            <span>{emailConfig.ctaText || 'Añadir a Google Calendar / Outlook'}</span>
                          </button>

                          {emailConfig.includeWhatsapp && (
                            <button
                              type="button"
                              className="w-full py-2 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs font-mono flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Confirmar o Enviar Dudas vía WhatsApp</span>
                            </button>
                          )}
                        </div>

                        {/* Adjunto .ICS */}
                        {emailConfig.includeIcs && (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 text-[var(--text-main)]">
                              <span className="text-base">📎</span>
                              <div>
                                <span className="block font-bold">confirmacion-cita.ics</span>
                                <span className="text-[10px] text-[var(--text-muted)]">RFC 5545 • Compatible con Google Calendar / Apple / Outlook</span>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                              Listo
                            </span>
                          </div>
                        )}

                        {/* Footer y Políticas de Cancelación */}
                        <div className="pt-3 border-t border-[var(--border-color)] text-center text-[10px] text-[var(--text-muted)] font-mono space-y-1">
                          <p>{emailConfig.cancellationPolicy}</p>
                          <p className="opacity-80">
                            © 2026 {emailConfig.senderName} • Potenciado por la infraestructura de Vector Inside
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón para Simular Envío de Prueba */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      ¿Quieres comprobar cómo entra a tu bandeja de entrada real?
                    </span>
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={testEmailSent}
                      className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{testEmailSent ? '¡Correo de prueba enviado!' : 'Enviar Correo de Prueba'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Alerta de Éxito al Guardar */}
            {savedConfigSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fadeIn shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>¡Configuración de turnos dinámicos y membrete guardada y aplicada en vivo!</span>
              </div>
            )}

            {/* Footer con Botones de Acción */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] shrink-0">
              <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">
                {calendarConfig.shifts?.length || 0} Turnos configurados • {calendarConfig.slotDurationMin} min/bloque
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] text-xs font-mono transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveConfig}
                  className="shadow-neon-sm"
                >
                  Guardar Configuración en Vivo
                </Button>
              </div>
            </div>
          </div>
        </div>
        </Portal>
      )}

      {/* Modal Sincronización Móvil & Google Calendar */}
      <MobileSyncModal
        isOpen={showMobileSyncModal}
        onClose={() => setShowMobileSyncModal(false)}
        tenant={activeTenant}
      />

      {/* Modal Correo Personalizado de Confirmación de Cita */}
      <AppointmentConfirmationEmailModal
        isOpen={showEmailConfirmationModal}
        onClose={() => setShowEmailConfirmationModal(false)}
        appointment={appointmentForEmail || selectedAppointment}
        tenant={activeTenant}
        emailConfig={emailConfig}
        onSendSuccess={() => {
          setGmailSentSuccess(true);
          setTimeout(() => setGmailSentSuccess(false), 4000);
        }}
      />
    </div>
  );
};

// ============================================================================
// SUBCOMPONENTE: FILA DE SLOT DINÁMICO (HORAS SEGÚN GIRO & ACCIONES EN TIEMPO REAL)
// ============================================================================
function SlotRowItem({
  shift,
  hour,
  durationMin,
  concurrencyLimit,
  capacityLabel,
  appointment,
  onSelectAppointment,
  onManualBook,
  onBlockSlot,
}) {
  if (appointment) {
    // CASO 1: HORARIO OCUPADO (CITA CONFIRMADA)
    return (
      <div
        onClick={() => onSelectAppointment(appointment)}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-brand-primary/60 hover:bg-[var(--bg-card)] cursor-pointer transition-all shadow-sm hover:shadow-neon-sm"
        style={{ borderLeftWidth: '4px', borderLeftColor: appointment.serviceColor || '#3B82F6' }}
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] font-mono text-xs font-bold">
            {hour}
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-main)] block tracking-tight">
              {hour} hrs ({durationMin} min)
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              {shift.name}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 px-1 sm:px-4">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[var(--text-main)] group-hover:text-brand-primary transition-colors truncate">
              {appointment.client}
            </h4>
            <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] text-[10px] font-mono shrink-0">
              {appointment.serviceName}
            </span>
            {appointment.depositPaid ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono shrink-0">
                ● Confirmado
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold font-mono shrink-0">
                ○ Triage IA
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] truncate font-mono mt-0.5">
            {appointment.specialist} • {appointment.phone}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-bold text-emerald-400">
            ${appointment.estimatedValue || 1200} MXN
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/30 group-hover:bg-brand-primary group-hover:text-black transition-all">
            Ver Detalle →
          </span>
        </div>
      </div>
    );
  }

  // CASO 2: HORARIO LIBRE / DISPONIBLE PARA AUTO-AGENDAMIENTO IA
  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-dashed border-[var(--border-color)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-panel)] transition-all">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-12 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--text-main)] font-mono text-xs transition-colors">
          {hour}
        </div>
        <div>
          <span className="text-xs font-medium text-[var(--text-main)] block">
            {hour} hrs ({durationMin} min)
          </span>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            {capacityLabel}: {concurrencyLimit} disp.
          </span>
        </div>
      </div>

      <div className="flex-1 px-1 sm:px-4 flex items-center gap-2 text-xs text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
        <span>Slot libre • Auto-agendamiento IA & WhatsApp habilitado</span>
      </div>

      <div className="flex items-center gap-2 shrink-0 opacity-80 sm:opacity-40 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onManualBook}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3 h-3" />
          <span>+ Cita</span>
        </button>
        <button
          type="button"
          onClick={onBlockSlot}
          className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] text-xs font-mono transition-all"
        >
          Bloquear
        </button>
      </div>
    </div>
  );
}
