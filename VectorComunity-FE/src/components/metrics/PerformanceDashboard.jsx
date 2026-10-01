'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { performanceService } from '@/services/performanceService';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  TrendingUp,
  DollarSign,
  Zap,
  Activity,
  BarChart2,
  PieChart,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Send
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';

export const PerformanceDashboard = () => {
  const { activeTenantId, activeTenant } = useTenant();
  const [data, setData] = useState(null);
  const [capiLogs, setCapiLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSendingSignal, setIsSendingSignal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const perf = await performanceService.getPerformanceMetrics(activeTenantId);
      const logs = await performanceService.getCapiAttributionLogs(activeTenantId);
      setData(perf);
      setCapiLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTenantId]);

  const handleEmitCapiTest = async () => {
    setIsSendingSignal(true);
    try {
      const newEvent = await performanceService.emitTestCapiSignal(activeTenantId, 'Purchase_Attributed_Vector');
      setCapiLogs((prev) => [newEvent, ...prev]);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D4FF00', '#10B981'],
        });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingSignal(false);
    }
  };

  const summary = data?.summary || {
    realRoas: 4.82,
    metaReportedRoas: 3.41,
    realCac: 14.20,
    blendedCpa: 16.80,
    totalSpend: 3450,
    backendAttributedRevenue: 16629,
    capiSyncRate: 99.4,
    avgHookRate: 41.8,
  };

  const series = data?.dailySeries || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-surface via-dark-elevated to-dark-surface border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              <BarChart2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Performance Backend & Atribución CAPI
              </h2>
              <p className="text-xs text-zinc-400">
                Comparativa de ROAS Real Backend vs Meta Pixel para <strong className="text-white">{activeTenant?.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="neonOutline"
            size="md"
            icon={Send}
            loading={isSendingSignal}
            onClick={handleEmitCapiTest}
          >
            Emitir CAPI Test Event
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="ROAS Real Atribuido"
          value={`${summary.realRoas}x`}
          subvalue={`(Meta: ${summary.metaReportedRoas}x)`}
          change="+41.3%"
          isPositive={true}
          icon={TrendingUp}
          badgeText="BACKEND REAL"
          accentColor="brand"
        />

        <StatCard
          title="CAC Real (Cost per Acquisition)"
          value={`$${summary.realCac} USD`}
          subvalue={`(CPA: $${summary.blendedCpa})`}
          change="-15.4%"
          isPositive={true}
          icon={DollarSign}
          badgeText="OPT. METRIC"
          accentColor="emerald"
        />

        <StatCard
          title="Ingresos Reales Atribuidos"
          value={`$${formatNumber(summary.backendAttributedRevenue)} USD`}
          subvalue={`Gasto: $${formatNumber(summary.totalSpend)}`}
          change="+28.0%"
          isPositive={true}
          icon={Activity}
          badgeText="VERIFICADO"
          accentColor="blue"
        />

        <StatCard
          title="Meta CAPI Sync Rate"
          value={`${summary.capiSyncRate}%`}
          subvalue="Event Quality: 9.8/10"
          change="+1.2%"
          isPositive={true}
          icon={ShieldCheck}
          badgeText="SERVER-SIDE"
          accentColor="amber"
        />
      </div>

      {/* Main Chart: Real Revenue vs Spend & Hook Rate */}
      <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-dark-border">
          <div>
            <h3 className="text-base font-bold text-white">
              Curva de Atribución y Hook Rate
            </h3>
            <p className="text-xs text-zinc-400">
              Ingresos atribuidos por el backend de Vector Inside vs Gasto Diario en Meta Ads
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="neon" size="sm">ROAS Promedio: {summary.realRoas}x</Badge>
            <Badge variant="warning" size="sm">Hook Rate: {summary.avgHookRate}%</Badge>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4FF00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F242D" />
              <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12151A',
                  borderColor: '#1F242D',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Ingreso Backend ($ USD)"
                stroke="#D4FF00"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="spend"
                name="Gasto AdSet ($ USD)"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live CAPI Stream Logs Table */}
      <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Server-Side CAPI Telemetry Stream
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Handshake con Meta Conversions API
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-dark-border text-zinc-500 uppercase text-[10px]">
                <th className="py-2.5 px-3">Evento CAPI</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Valor Evento</th>
                <th className="py-2.5 px-3">Estado de Match</th>
                <th className="py-2.5 px-3">Fuente de Señal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60 text-zinc-300">
              {capiLogs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-elevated/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {log.event}
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{log.timestamp}</td>
                  <td className="py-3 px-3 font-bold text-brand-primary">{log.value}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{log.signalSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
