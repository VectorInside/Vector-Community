'use client';

import React, { useState, useMemo } from 'react';
import { INITIAL_AUDIT_LOGS } from '@/utils/mockAccounts';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Search,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  History,
  Eye,
  Sliders,
  Smartphone,
  Globe,
  Server,
  FileText,
  UserCheck,
  Check,
  X,
} from 'lucide-react';

const PERMISSION_MATRIX = [
  {
    module: 'Centro de Mando & Métricas Generales',
    owner: 'Solo su negocio',
    admin: 'Negocios asignados',
    superAdmin: 'Todos los negocios (Global)',
  },
  {
    module: 'Conversaciones WhatsApp & Takeover HITL',
    owner: 'Supervisión de su negocio',
    admin: 'Control activo (Intervención en vivo)',
    superAdmin: 'Control activo & Auditoría total',
  },
  {
    module: 'Campañas Meta Ads & RAG Wizard',
    owner: 'Lectura de reportes & KPIs',
    admin: 'Edición & Carga de Conocimiento',
    superAdmin: 'Edición total, Creación & Borrado',
  },
  {
    module: 'Configuración de Bot IA & API Keys',
    owner: 'Lectura de estado',
    admin: 'Ajuste de Prompts & Base de Conocimiento',
    superAdmin: 'Configuración de LLMs, Llaves & Modelos',
  },
  {
    module: 'Políticas de Leads & Desglose Financiero',
    owner: 'Solo su costo por lead',
    admin: 'Métricas de negocios asignados',
    superAdmin: 'Margen de agencia & Split 70/30 global',
  },
  {
    module: 'Gestión de Accesos & Colaboradores',
    owner: 'Sin acceso',
    admin: 'Consulta de equipo asignado',
    superAdmin: 'Invitar, suspender y asignar negocios',
  },
];

export const SecurityGovernanceView = () => {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [searchLog, setSearchLog] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('matrix'); // 'matrix' | 'logs'

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (searchLog.trim()) {
        const q = searchLog.toLowerCase();
        const matchUser = l.user.toLowerCase().includes(q);
        const matchAction = l.action.toLowerCase().includes(q);
        const matchTarget = l.target.toLowerCase().includes(q);
        const matchIp = l.ip.includes(q);
        if (!matchUser && !matchAction && !matchTarget && !matchIp) return false;
      }

      if (filterStatus !== 'all' && l.status !== filterStatus) return false;

      return true;
    });
  }, [logs, searchLog, filterStatus]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Contextual */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold bg-neon/10 px-2 py-0.5 rounded border border-neon/20">
              GOBERNANZA & SEGURIDAD DE LA PLATAFORMA
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Control de Accesos & Registro Inmutable
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Políticas, Roles & <span className="text-neon">Auditoría</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 max-w-2xl">
            Monitorea la matriz de permisos entre clientes y equipo de agencia, verifica las sesiones activas y revisa los eventos de seguridad en tiempo real.
          </p>
        </div>

        {/* View Switcher: Matriz vs Audit Logs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl font-mono text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'matrix'
                ? 'bg-neon text-black shadow-sm'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Matriz de Permisos</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'logs'
                ? 'bg-neon text-black shadow-sm'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Registro de Auditoría ({logs.length})</span>
          </button>
        </div>
      </header>

      {/* SUB-PANEL 1: MATRIZ DE PERMISOS */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6 animate-fade-in">
          {/* Security Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center gap-2 text-neon">
                <Lock className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Aislamiento Multi-Tenant
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                Cada Dueño de Negocio solo puede autenticarse y consultar datos correspondientes a su `tenant_id`. Las credenciales de API y bases de datos nunca se cruzan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Autenticación 2FA & Expiración
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                Tokens de sesión JWT firmados con algoritmo HS256, expiración forzada a 30 días de inactividad y soporte para verificación en dos pasos por WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <UserCheck className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Privilegio Mínimo (PoLP)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                Los Administradores únicamente tienen acceso a los módulos operativos y a los negocios explícitamente autorizados por un Super Admin.
              </p>
            </div>
          </div>

          {/* Table: Permissions Matrix */}
          <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)]">
                  Matriz de Gobernanza & Capacidades por Rol
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Comparativa de acceso entre Dueños de Negocio (Clientes) y Staff de la Agencia
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6 font-bold">Módulo / Capacidad</th>
                    <th className="py-3 px-4 font-bold text-emerald-400">Dueño Negocio (Cliente)</th>
                    <th className="py-3 px-4 font-bold text-blue-400">Administrador (Negocios Asignados)</th>
                    <th className="py-3 px-4 font-bold text-neon">Super Admin (Control Total)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {PERMISSION_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-card)]/50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-[var(--text-main)] font-sans text-xs">
                        {row.module}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                          {row.owner}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
                          {row.admin}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-neon/10 text-neon border border-neon/20 font-bold text-[11px]">
                          {row.superAdmin}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PANEL 2: REGISTRO DE AUDITORÍA (AUDIT LOGS) */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filter Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                placeholder="Buscar por usuario, IP, acción o negocio..."
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-main)] font-mono outline-none transition-all placeholder:text-[var(--text-muted)]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-neon transition-colors"
              >
                <option value="all">Todos los Eventos</option>
                <option value="SUCCESS">Autorizados (Éxito)</option>
                <option value="BLOCKED">Bloqueados / Alertas</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6 font-bold">Fecha / Hora</th>
                    <th className="py-3 px-4 font-bold">Usuario & Rol</th>
                    <th className="py-3 px-4 font-bold">Acción Ejecutada</th>
                    <th className="py-3 px-4 font-bold">Negocio Afectado</th>
                    <th className="py-3 px-4 font-bold">Dirección IP & Origen</th>
                    <th className="py-3 px-4 font-bold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[var(--text-muted)]">
                        No se encontraron registros con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isBlocked = log.status === 'BLOCKED';

                      return (
                        <tr
                          key={log.id}
                          className={`hover:bg-[var(--bg-card)]/50 transition-colors ${
                            isBlocked ? 'bg-red-950/15' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 sm:px-6 text-[var(--text-muted)] text-[11px] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[var(--text-main)] whitespace-nowrap">
                            <div>{log.user}</div>
                            <div className="text-[10px] text-[var(--text-muted)] font-normal">{log.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[var(--text-main)]">
                            <span className="font-semibold">{log.action}</span>
                          </td>
                          <td className="py-3.5 px-4 text-[var(--text-muted)]">
                            {log.target}
                          </td>
                          <td className="py-3.5 px-4 text-[var(--text-muted)] text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3 h-3 text-[var(--text-muted)]" />
                              <span>{log.ip}</span>
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)]">{log.location}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isBlocked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                                <AlertTriangle className="w-3 h-3" /> Bloqueado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Autorizado
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
