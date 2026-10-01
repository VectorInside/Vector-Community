'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/hooks/useTenant';
import { useHITLAlerts } from '@/hooks/useHITLAlerts';
import { HITLCard } from '@/components/hitl/HITLCard';
import { HITLAlertFilter } from '@/components/hitl/HITLAlertFilter';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Inbox,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const { user, permissions } = useAuth();
  const { activeTenant } = useTenant();
  const {
    alerts,
    loading,
    pendingCount,
    approvedCount,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    approveAlert,
    rejectAlert,
    processingIds,
    isSSEConnected,
    emitLocalMockAlert,
    refreshAlerts,
  } = useHITLAlerts();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome & Health Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-surface via-dark-elevated to-dark-surface border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              <Inbox className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Agency Co-Pilot Inbox (HITL Governance)
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Gobernanza Human-in-the-Loop para la marca <strong className="text-brand-primary">{activeTenant?.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-base border border-dark-border text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-zinc-300">SSE Real-Time</span>
            <span className="text-brand-primary font-bold">Activo</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={refreshAlerts}
            title="Recargar alertas del backend"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Alertas Pendientes HITL"
          value={pendingCount}
          subvalue="Requieren Aprobación"
          change={pendingCount > 0 ? `${pendingCount} en cola` : 'Al día'}
          isPositive={pendingCount === 0}
          icon={Clock}
          badgeText="PENDING APPROVAL"
          accentColor="amber"
        />

        <StatCard
          title="Aprobadas & Sincronizadas"
          value={approvedCount}
          subvalue="POST /appointments/approve"
          change="+100% éxito"
          isPositive={true}
          icon={CheckCircle2}
          badgeText="GOOGLE CALENDAR / CAPI"
          accentColor="emerald"
        />

        <StatCard
          title="Precisión Bot RAG"
          value="96.4%"
          subvalue="Score Promedio"
          change="+3.2%"
          isPositive={true}
          icon={Sparkles}
          badgeText="CONFIDENCE"
          accentColor="brand"
        />

        <StatCard
          title="ROAS Real Tenant"
          value={activeTenant?.monthlyRoas || '4.82x'}
          subvalue="Backend Attributed"
          change="+0.8x vs Meta"
          isPositive={true}
          icon={TrendingUp}
          badgeText={activeTenant?.vertical?.toUpperCase()}
          accentColor="blue"
        />
      </div>

      {/* Filter & Search Bar */}
      <HITLAlertFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        onSimulateSSEAlert={emitLocalMockAlert}
      />

      {/* Alerts Cards Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
            Cargando cola de alertas HITL...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 rounded-2xl bg-dark-surface border border-dark-border text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-dark-elevated text-brand-primary flex items-center justify-center mx-auto border border-brand-primary/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Bandeja de Entrada al Día
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              No hay alertas pendientes bajo este filtro. Puedes pulsar el botón <strong className="text-brand-primary">⚡ Test SSE Live</strong> para simular un evento entrante.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <HITLCard
                key={alert.id}
                alert={alert}
                onApprove={approveAlert}
                onReject={rejectAlert}
                isProcessing={processingIds.has(alert.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
