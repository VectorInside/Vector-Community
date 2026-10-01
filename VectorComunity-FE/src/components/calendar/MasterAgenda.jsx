'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { calendarService } from '@/services/calendarService';
import { Button } from '@/components/common/Button';
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
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MasterAgenda = () => {
  const { activeTenantId, activeTenant } = useTenant();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await calendarService.getAppointments(activeTenantId);
      setAppointments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [activeTenantId]);

  const handleSyncGoogleCalendar = async () => {
    setSyncing(true);
    try {
      const result = await calendarService.triggerGoogleCalendarSync(activeTenantId);
      setSyncMessage(result.message || 'Sincronizado con Google Calendar');
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#D4FF00', '#3B82F6', '#10B981'],
        });
      } catch (e) {}
      await loadAppointments();
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Google Calendar Status */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-surface via-dark-elevated to-dark-surface border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Master Agenda — Google Calendar API Sync
              </h2>
              <p className="text-xs text-zinc-400">
                Sincronización bidireccional en tiempo real para <strong className="text-white">{activeTenant?.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Handshake Activo
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Auto-bloqueo de slots activado
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            loading={syncing}
            disabled={syncing}
            onClick={handleSyncGoogleCalendar}
          >
            {syncing ? 'Sincronizando...' : 'Sincronizar Google Calendar'}
          </Button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Appointments List / Timeline */}
      <div className="rounded-2xl bg-dark-surface border border-dark-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div>
            <h3 className="text-base font-bold text-white">
              Citas y Eventos Programados
            </h3>
            <p className="text-xs text-zinc-400">
              Mostrando {appointments.length} eventos registrados para este tenant
            </p>
          </div>

          <Badge variant="neon" size="sm">
            {appointments.length} Eventos Google Calendar
          </Badge>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono">
            Cargando agenda sincronizada...
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono">
            No hay citas registradas para este tenant actualmente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl bg-dark-base border border-dark-border hover:border-brand-primary/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {evt.details}
                    </p>
                  </div>
                  <Badge variant="success" size="xs">
                    SYNCED GOOGLE
                  </Badge>
                </div>

                <div className="pt-2 border-t border-dark-border/60 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{formatDateTime(evt.start)}</span>
                  </div>
                  <div className="text-zinc-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate">{evt.client}</span>
                  </div>
                  <div className="text-zinc-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate">{evt.phone}</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Anticipo Pagado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
