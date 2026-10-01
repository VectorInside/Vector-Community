'use client';

import React from 'react';
import { Search, Zap, Filter, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const HITLAlertFilter = ({
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery,
  pendingCount,
  approvedCount,
  onSimulateSSEAlert,
}) => {
  return (
    <div className="rounded-2xl bg-dark-surface border border-dark-border p-4 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-base border border-dark-border overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              filterStatus === 'ALL'
                ? 'bg-dark-elevated text-white border border-brand-primary/30 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todas ({pendingCount + approvedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('PENDING_AGENCY_APPROVAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              filterStatus === 'PENDING_AGENCY_APPROVAL'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pendientes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-[10px] font-mono font-bold text-amber-300">
              {pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('APPROVED')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              filterStatus === 'APPROVED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aprobadas ({approvedCount})</span>
          </button>
        </div>

        {/* Search & SSE Live Test Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, lead, síntoma..."
              className="w-full bg-dark-base border border-dark-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <Button
            variant="neonOutline"
            size="sm"
            icon={Zap}
            onClick={onSimulateSSEAlert}
            className="shrink-0"
            title="Simula un evento entrante vía Server-Sent Events (SSE)"
          >
            ⚡ Test SSE Live
          </Button>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-dark-border/50 text-xs">
        <span className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Tipo:
        </span>

        {[
          { key: 'ALL', label: 'Todos los tipos' },
          { key: 'APPOINTMENT_REQUEST', label: '📅 Citas & Reservas' },
          { key: 'CREATIVE_FATIGUE', label: '📉 Fatiga Creativa' },
          { key: 'HIGH_INTENT_LEAD', label: '🛍️ Leads E-Commerce' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilterType(t.key)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filterType === t.key
                ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/40 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 bg-dark-base border border-dark-border/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};
