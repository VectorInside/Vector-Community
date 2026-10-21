'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Phone,
  Building,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertCircle,
  Check,
  Plus,
} from 'lucide-react';
import { PreCitaDrawer } from '@/components/hitl/PreCitaDrawer';
import { MeasurementGuideModal } from '@/components/common/MeasurementGuideModal';

const INITIAL_THREADS = [
  {
    id: 'lead-001',
    name: 'Carlos Mendoza',
    company: 'Consultorio Privado',
    channel: 'WhatsApp',
    phone: '+52 55 4912 3840',
    need: 'Implante Dental Inmediato',
    date: 'Hoy, 10:42 AM',
    contacted: false,
    owner: 'Lobo Vectorial (Agencia)',
    stage: 'Calificado',
    slaMinutesRemaining: 8,
    potentialTicket: 28000,
    qualification: {
      contactValid: true,
      productIdentified: true,
      doubtsResolved: true,
      ctaAccepted: false,
    },
    messages: [
      {
        id: 'm1',
        direction: 'in',
        text: 'Hola, vi su anuncio sobre implantes en un solo día. Quisiera saber el costo y si manejan financiamiento a meses sin intereses.',
        time: '10:42 AM',
      },
    ],
  },
  {
    id: 'lead-002',
    name: 'Dra. Sofía Valenzuela',
    company: 'Clínica Dermatológica',
    channel: 'Instagram DM',
    phone: '+52 55 8192 1044',
    need: 'Campaña Meta Ads CAPI',
    date: 'Hoy, 09:15 AM',
    contacted: false,
    owner: 'Sin asignar',
    stage: 'Nuevo',
    slaMinutesRemaining: -5,
    potentialTicket: 35000,
    qualification: {
      contactValid: true,
      productIdentified: true,
      doubtsResolved: false,
      ctaAccepted: false,
    },
    messages: [
      {
        id: 'm1',
        direction: 'in',
        text: 'Hola buenas tardes, me interesa conocer su servicio de Meta CAPI para agendar consultas privadas sin perder leads.',
        time: '09:15 AM',
      },
    ],
  },
  {
    id: 'lead-003',
    name: 'Mariana Garza',
    company: 'Fitness Studio Polanco',
    channel: 'Web Chat',
    phone: '+52 55 3321 9901',
    need: 'Membresía Trimestral VIP',
    date: 'Ayer, 06:30 PM',
    contacted: false,
    owner: 'Lobo Vectorial (Agencia)',
    stage: 'Contactado',
    slaMinutesRemaining: 12,
    potentialTicket: 12500,
    qualification: {
      contactValid: true,
      productIdentified: true,
      doubtsResolved: true,
      ctaAccepted: false,
    },
    messages: [
      {
        id: 'm1',
        direction: 'in',
        text: 'Hola! Tienen cupo para el plan de entrenamiento funcional en las mañanas? Me gustaría probar una clase.',
        time: 'Ayer, 06:30 PM',
      },
    ],
  },
  {
    id: 'lead-004',
    name: 'Arq. Roberto Lozano',
    company: 'Grupo Constructor RL',
    channel: 'WhatsApp',
    phone: '+52 81 1290 4455',
    need: 'Departamentos Preventa',
    date: 'Ayer, 03:10 PM',
    contacted: true,
    owner: 'Karloz (Agencia)',
    stage: 'Propuesta',
    slaMinutesRemaining: null,
    potentialTicket: 150000,
    qualification: {
      contactValid: true,
      productIdentified: true,
      doubtsResolved: true,
      ctaAccepted: true,
    },
    messages: [
      {
        id: 'm1',
        direction: 'in',
        text: 'Buenas tardes, recibí el brochure de la torre en Roma Norte. Tienen citas este jueves?',
        time: 'Ayer, 03:10 PM',
      },
      {
        id: 'm2',
        direction: 'out',
        text: 'Hola Roberto! Con gusto. Tenemos disponible el jueves a las 11:00 AM con nuestro especialista de inversión patrimonial.',
        time: 'Ayer, 03:16 PM',
      },
    ],
  },
  {
    id: 'lead-005',
    name: 'Lic. Patricia Domínguez',
    company: 'Buffet Jurídico Fiscal',
    channel: 'WhatsApp',
    phone: '+52 55 9011 2233',
    need: 'Consultoría Fiscal Pyme',
    date: '12 Oct',
    contacted: true,
    owner: 'Lobo Vectorial (Agencia)',
    stage: 'Ganado',
    slaMinutesRemaining: null,
    potentialTicket: 48000,
    qualification: {
      contactValid: true,
      productIdentified: true,
      doubtsResolved: true,
      ctaAccepted: true,
    },
    messages: [
      {
        id: 'm1',
        direction: 'in',
        text: 'Excelente, ya firmamos el acuerdo. Gracias por la atención tan rápida.',
        time: '12 Oct, 11:00 AM',
      },
    ],
  },
];

export const ConversacionesInbox = () => {
  const router = useRouter();
  const { activeTenant } = useAuth();

  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState(INITIAL_THREADS[0].id);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'pending' | 'attended'
  const [channelFilter, setChannelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftReply, setDraftReply] = useState('');
  const [isPreCitaDrawerOpen, setIsPreCitaDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Active Thread
  const activeThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId) || threads[0],
    [threads, selectedThreadId]
  );

  // Filtered threads list
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      // 1. Status Filter
      if (filterMode === 'pending' && t.contacted) return false;
      if (filterMode === 'attended' && !t.contacted) return false;

      // 2. Channel Filter
      if (channelFilter !== 'all' && t.channel.toLowerCase() !== channelFilter.toLowerCase()) return false;

      // 3. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.need.toLowerCase().includes(q) ||
          t.phone.includes(q)
        );
      }

      return true;
    });
  }, [threads, filterMode, channelFilter, searchQuery]);

  // Handle Send Reply (Simulation with local state)
  const handleSendReply = () => {
    if (!draftReply.trim() || !activeThread) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      direction: 'out',
      text: draftReply.trim(),
      time: 'Ahora',
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            contacted: true,
            slaMinutesRemaining: null,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    setDraftReply('');
  };

  // Toggle qualification check
  const handleToggleRequirement = (key) => {
    if (!activeThread) return;
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThread.id) {
          const updatedQual = {
            ...t.qualification,
            [key]: !t.qualification[key],
          };
          const allFourTrue = Object.values(updatedQual).every(Boolean);
          return {
            ...t,
            qualification: updatedQual,
            stage: allFourTrue ? 'Calificado' : t.stage,
          };
        }
        return t;
      })
    );
  };

  const pendingCount = threads.filter((t) => !t.contacted).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime-400 font-extrabold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
              OPERACIÓN / BANDEJA DE ATENCIÓN
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Espacio: {activeTenant?.name || 'Vector Inside'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Cada conversación tiene dirección.
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Contexto del prospecto, responsable asignado y siguiente paso comercial en una sola vista.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs font-mono px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400 transition-all flex items-center gap-1.5"
          >
            <span>Ver Fórmulas SLA</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/crm')}
            className="text-xs bg-lime-400 text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-lime-300 transition-all shadow-md active:scale-95"
          >
            <span>Abrir Tablero CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="font-mono">
            <strong>Canales conectados:</strong> WhatsApp Webhook, Instagram DM y Micro-Landings · Objetivo interno de respuesta: <strong>15 min</strong>
          </span>
        </div>
        <span className="font-mono text-[10px] text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
          {pendingCount} Pendientes de Respuesta
        </span>
      </div>

      {/* 3-Column / Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-280px)] min-h-[620px]">
        {/* Column 1: Threads List (4 cols) */}
        <div className="lg:col-span-4 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {/* List Search & Filters */}
          <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por contacto o necesidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'all'
                      ? 'bg-lime-400 text-black font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  Todos ({threads.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('pending')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'pending'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  Pendientes ({pendingCount})
                </button>
              </div>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] rounded-lg px-2 py-1 text-[var(--text-muted)] focus:outline-none focus:border-lime-400"
              >
                <option value="all">Canal: Todos</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram dm">Instagram</option>
                <option value="web chat">Web</option>
              </select>
            </div>
          </div>

          {/* Threads Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)] custom-scrollbar">
            {filteredThreads.map((thread) => {
              const isSelected = activeThread?.id === thread.id;
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[var(--bg-card)] border-l-4 border-lime-400'
                      : 'hover:bg-[var(--bg-card)]/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {thread.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                        {thread.name}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-faint)] shrink-0">
                        {thread.date}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] truncate font-sans">
                      {thread.need} · <span className="font-mono text-[10px]">{thread.company}</span>
                    </p>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-faint)]">
                        {thread.channel}
                      </span>
                      {thread.contacted ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                          Atendida
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Por responder
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Active Chat Feed & Fast Response (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-sm text-[var(--text-main)]">
                    {activeThread.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <span>{activeThread.channel}</span>
                    <span>•</span>
                    <span>{activeThread.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!activeThread.contacted && activeThread.slaMinutesRemaining !== null && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      activeThread.slaMinutesRemaining > 0
                        ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
                    }`}>
                      {activeThread.slaMinutesRemaining > 0
                        ? `⏳ ${activeThread.slaMinutesRemaining} min SLA`
                        : '⚠️ SLA Vencido'}
                    </span>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--bg-base)] custom-scrollbar">
                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.direction === 'out' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-sans leading-relaxed shadow-sm ${
                        msg.direction === 'out'
                          ? 'bg-lime-400 text-black font-medium'
                          : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono text-[var(--text-faint)] mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick AI Suggestions Bar */}
              <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-card)]/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
                <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-1 shrink-0 px-1 font-bold">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  Sugerencias:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDraftReply(
                      `Hola ${activeThread.name}! Con gusto te comparto los detalles de ${activeThread.need} y nuestro plan con garantía de resultados.`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap"
                >
                  Confirmar Catálogo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDraftReply(
                      `¿Te gustaría agendar una valoración de 30 minutos sin costo para revisar tu caso específico y fechas disponibles?`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap"
                >
                  Proponer Cita
                </button>
              </div>

              {/* Compose Box */}
              <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-end gap-2">
                <textarea
                  rows={2}
                  placeholder="Escribe una respuesta o selecciona una sugerencia..."
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  className="flex-1 p-2.5 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-lime-400 resize-none font-sans"
                />
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!draftReply.trim()}
                  className="px-4 py-3 rounded-xl bg-lime-400 text-black font-mono font-bold text-xs hover:bg-lime-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[var(--text-muted)]">
              Selecciona una conversación para responder
            </div>
          )}
        </div>

        {/* Column 3: Lead Context & 4 BANT Qualification Rules (3 cols) */}
        <div className="lg:col-span-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col justify-between overflow-y-auto space-y-4 shadow-sm custom-scrollbar">
          {activeThread ? (
            <>
              <div className="space-y-4">
                {/* Contact Card Header */}
                <div className="border-b border-[var(--border-color)] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                    Radiografía del Prospecto
                  </span>
                  <h4 className="font-heading font-black text-base text-[var(--text-main)] mt-0.5">
                    {activeThread.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-sans">
                    {activeThread.company}
                  </p>
                </div>

                {/* Ticket & Stage */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase">
                      Ticket Estimado
                    </span>
                    <span className="text-sm font-mono font-black text-lime-400">
                      ${activeThread.potentialTicket.toLocaleString()} MXN
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase">
                      Etapa Comercial
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                      {activeThread.stage}
                    </span>
                  </div>
                </div>

                {/* 4 Inviolable Qualification Requirements (BILLABLE_LEAD Protocol) */}
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                      4 Requisitos BILLABLE_LEAD
                    </span>
                    <span className="text-[9px] font-mono text-lime-400">
                      {Object.values(activeThread.qualification).filter(Boolean).length}/4
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-sans">
                    <label
                      onClick={() => handleToggleRequirement('contactValid')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.contactValid}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>1. Identidad y WhatsApp</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('productIdentified')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.productIdentified}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>2. Servicio específico</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('doubtsResolved')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.doubtsResolved}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>3. Dudas resueltas (RAG)</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('ctaAccepted')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.ctaAccepted}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>4. Cita / Contacto aceptado</span>
                    </label>
                  </div>
                </div>

                {/* Responsible & Assigned Agent */}
                <div className="text-xs space-y-1 text-[var(--text-muted)] font-mono text-[11px]">
                  <div>Responsable: <strong className="text-[var(--text-main)]">{activeThread.owner}</strong></div>
                  <div>ID Prospecto: <span className="text-[var(--text-faint)]">{activeThread.id}</span></div>
                </div>
              </div>

              {/* Primary 1-Click Action: Open PreCita Drawer & Schedule */}
              <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                <button
                  type="button"
                  onClick={() => setIsPreCitaDrawerOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-lime-400 text-black font-mono font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-lime-300 transition-all shadow-md active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Dictaminar Pre-Cita</span>
                </button>
                <p className="text-[10px] font-mono text-[var(--text-faint)] text-center">
                  Aprobación Human-in-the-Loop en 1 clic
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-[var(--text-muted)]">Sin datos de contacto</div>
          )}
        </div>
      </div>

      {/* PreCita Drawer for 1-Click Scheduling */}
      <PreCitaDrawer
        isOpen={isPreCitaDrawerOpen}
        onClose={() => setIsPreCitaDrawerOpen(false)}
        alert={{
          id: activeThread?.id || 'alert-001',
          client_name: activeThread?.name || 'Prospecto',
          client_phone: activeThread?.phone || '',
          customer_needs_summary: {
            potentialTicket: activeThread?.potentialTicket || 28000,
            intent: activeThread?.need || 'Servicio Profesional',
            objection: 'Requiere confirmación de horario y financiamiento',
            suggestedAction: 'Cita de valoración y envío de contrato',
          },
          transcript_snippet: activeThread?.messages.map((m) => `${m.direction === 'in' ? 'Cliente' : 'Agente'}: ${m.text}`) || [],
        }}
      />

      {/* Measurement Guide Modal */}
      <MeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        initialMetricId="tiempo_primera_respuesta"
      />
    </div>
  );
};
