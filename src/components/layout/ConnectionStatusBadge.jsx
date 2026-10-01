'use client';

import React, { useState } from 'react';
import { Wifi, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';

export const ConnectionStatusBadge = () => {
  const { activeTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = (status) => {
    if (status === 'HEALTHY') return <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />;
    if (status === 'WARNING') return <span className="w-2 h-2 rounded-full bg-amber-400" />;
    return <span className="w-2 h-2 rounded-full bg-rose-500" />;
  };

  const isAllHealthy =
    activeTenant?.metaHealth === 'HEALTHY' &&
    activeTenant?.whatsappHealth === 'HEALTHY' &&
    activeTenant?.calendarHealth === 'HEALTHY';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-elevated border border-dark-border hover:border-zinc-700 transition-all text-xs font-mono text-zinc-300"
      >
        <Wifi className={`w-3.5 h-3.5 ${isAllHealthy ? 'text-emerald-400' : 'text-amber-400'}`} />
        <span className="hidden sm:inline">APIs Status</span>
        <div className="flex items-center gap-1.5 ml-1">
          {getStatusIcon(activeTenant?.metaHealth || 'HEALTHY')}
          {getStatusIcon(activeTenant?.whatsappHealth || 'HEALTHY')}
          {getStatusIcon(activeTenant?.calendarHealth || 'HEALTHY')}
        </div>
      </button>

      {/* Popover Details */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 p-4 bg-dark-surface border border-dark-border rounded-xl shadow-2xl z-50 text-xs font-sans animate-scaleUp"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-dark-border">
            <span className="font-bold text-white uppercase font-mono tracking-wider">
              Health Status Webhooks
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">38ms Latencia</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2 rounded-lg bg-dark-elevated/70 border border-dark-border/60">
              <span className="text-zinc-300 font-medium">Meta CAPI & Pixel</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> 99.4% Sync
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-dark-elevated/70 border border-dark-border/60">
              <span className="text-zinc-300 font-medium">WhatsApp Cloud API</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-dark-elevated/70 border border-dark-border/60">
              <span className="text-zinc-300 font-medium">Google Calendar API</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> 2-Way Sync
              </span>
            </div>
          </div>

          <p className="mt-3 text-[10px] text-zinc-500 text-center font-mono">
            Último handshake: Hace 12 segundos
          </p>
        </div>
      )}
    </div>
  );
};
