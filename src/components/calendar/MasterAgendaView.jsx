'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar, RefreshCw, CheckCircle2, Clock, User, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MasterAgendaView = () => {
  const { activeTenant, triggerModal } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const handleSyncCalendar = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      triggerModal(
        'Google Calendar Sincronizado',
        'Se han sincronizado 12 eventos bidireccionales con la API de Google Calendar en tiempo real.',
        () => {
          try {
            confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#8A95B6', '#FFFFFF'] });
          } catch (e) {}
        },
        'Entendido'
      );
    }, 600);
  };

  return (
    <div className="p-8 block animate-fade-in space-y-6">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
            Master <span className="text-neon">Agenda</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Google Calendar 2-Way Sync en tiempo real para: <strong className="text-[var(--text-main)]">{activeTenant?.name}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={handleSyncCalendar}
          disabled={syncing}
          className="bg-neon text-black text-xs font-bold px-4 py-2 rounded hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_10px_var(--neon-glow)] flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Sincronizando...' : 'Sincronizar Google Calendar'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl vector-bg-card vector-border space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-main)]">
                Ana Martínez — Valoración Implante Dental
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Doctor Especialista: Dr. Roberto Peña (Maxilofacial)
              </p>
            </div>
            <span className="px-2 py-0.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)] rounded text-[10px] font-mono">
              CONFIRMADO
            </span>
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neon" />
              <span>Próx. Jueves 14:00 hrs</span>
            </div>
            <div className="text-[var(--text-muted)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>Ana Martínez</span>
            </div>
            <div className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-500" />
              <span>+52 55 1234 5678</span>
            </div>
            <div className="text-[var(--success)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Anticipo Verificado</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl vector-bg-card vector-border space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-main)]">
                Carlos Villaseñor — Limpieza Ultrasónica
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Dra. Claudia Ortiz (Ortodoncia)
              </p>
            </div>
            <span className="px-2 py-0.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)] rounded text-[10px] font-mono">
              CONFIRMADO
            </span>
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neon" />
              <span>Viernes 11:30 hrs</span>
            </div>
            <div className="text-[var(--text-muted)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>Carlos Villaseñor</span>
            </div>
            <div className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-500" />
              <span>+52 55 7719 3321</span>
            </div>
            <div className="text-[var(--success)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pago en Recepción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
