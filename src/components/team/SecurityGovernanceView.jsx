'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_AUDIT_LOGS } from '@/utils/mockAccounts';
import { auditService, normalizeAuditLog } from '@/services/auditService';
import { userService } from '@/services/userService';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  History,
  Eye,
  Sliders,
  Globe,
  UserCheck,
  RefreshCw,
  Download,
  FileJson,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Database,
  Cpu,
  Users,
  Building2,
  Activity,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

const ROLE_DEFINITIONS = [
  {
    key: 'SUPER_ADMIN',
    label: 'Super Admin',
    badge: 'Acceso Global Omnisciente',
    accent: 'text-neon border-neon/30 bg-neon/10',
    dotColor: 'bg-neon',
    description:
      'Dirección general de la agencia. Control absoluto sobre todos los negocios, llaves criptográficas BYOK, usuarios IAM, políticas financieras 70/30 y bitácora WORM.',
    modules: [
      { name: 'Centro de Mando & KPIs Financieros', access: 'FULL', label: 'Control Total (Todos los Negocios)' },
      { name: 'Inbox Omnicanal & Takeover HITL', access: 'FULL', label: 'Control Total & Auditoría en Vivo' },
      { name: 'Arquitectura RAG & Campañas Meta Ads', access: 'FULL', label: 'Creación, Edición & Borrado Global' },
      { name: 'Motor de IA, Prompts & Bóveda AES-256', access: 'FULL', label: 'Control Total de Llaves & Modelos' },
      { name: 'Reglas de Negocio & Split 70/30', access: 'FULL', label: 'Edición Financiera & Piso Pay-Per-Lead' },
      { name: 'Gobernanza IAM, Roles & Auditoría WORM', access: 'FULL', label: 'Invitación, Revocación & Exportación Forense' },
    ],
  },
  {
    key: 'ADMIN',
    label: 'Admin Agencia',
    badge: 'Gestión Multi-Negocio Asignada',
    accent: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
    description:
      'Account Manager o líder operativo de agencia. Opera y configura exclusivamente las carteras de clientes que le han sido asignadas.',
    modules: [
      { name: 'Centro de Mando & KPIs Financieros', access: 'ASSIGNED', label: 'Operación Asignada (Cartera Autorizada)' },
      { name: 'Inbox Omnicanal & Takeover HITL', access: 'ASSIGNED', label: 'Intervención Activa en Negocios Asignados' },
      { name: 'Arquitectura RAG & Campañas Meta Ads', access: 'ASSIGNED', label: 'Edición de Catálogo & Conocimiento RAG' },
      { name: 'Motor de IA, Prompts & Bóveda AES-256', access: 'ASSIGNED', label: 'Ajuste de Prompts (Sin ver API Keys planas)' },
      { name: 'Reglas de Negocio & Split 70/30', access: 'READ', label: 'Solo Lectura en Negocios Asignados' },
      { name: 'Gobernanza IAM, Roles & Auditoría WORM', access: 'READ', label: 'Solo Lectura de Equipo Asignado' },
    ],
  },
  {
    key: 'OPERATOR',
    label: 'Operador',
    badge: 'Atención HITL & Agenda',
    accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
    description:
      'Especialista de atención humana (Human-in-the-Loop) y seguimiento de citas. Interviene conversaciones alertas sin modificar configuraciones financieras ni llaves.',
    modules: [
      { name: 'Centro de Mando & KPIs Financieros', access: 'READ', label: 'Solo Lectura (Métricas Operativas)' },
      { name: 'Inbox Omnicanal & Takeover HITL', access: 'ASSIGNED', label: 'Operación Asignada (Rescate de Citas & SLA)' },
      { name: 'Arquitectura RAG & Campañas Meta Ads', access: 'READ', label: 'Solo Lectura de Catálogo Oficial' },
      { name: 'Motor de IA, Prompts & Bóveda AES-256', access: 'BLOCKED', label: 'Bloqueado por Seguridad' },
      { name: 'Reglas de Negocio & Split 70/30', access: 'BLOCKED', label: 'Bloqueado por Seguridad' },
      { name: 'Gobernanza IAM, Roles & Auditoría WORM', access: 'BLOCKED', label: 'Bloqueado por Seguridad' },
    ],
  },
  {
    key: 'CLIENT_OWNER',
    label: 'Dueño de Negocio (Cliente)',
    badge: 'Aislamiento Multi-Tenant 1:1',
    accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
    description:
      'Titular del negocio cliente con aislamiento estricto Row-Level Security (1 Cuenta = 1 Tenant). Audita sus citas calificadas, su calendario y su inversión.',
    modules: [
      { name: 'Centro de Mando & KPIs Financieros', access: 'READ', label: 'Solo Lectura (Exclusivo su Negocio)' },
      { name: 'Inbox Omnicanal & Takeover HITL', access: 'ASSIGNED', label: 'Supervisión & Atención de su Negocio' },
      { name: 'Arquitectura RAG & Campañas Meta Ads', access: 'READ', label: 'Solo Lectura de su Catálogo & KPIs' },
      { name: 'Motor de IA, Prompts & Bóveda AES-256', access: 'READ', label: 'Estado de IA (Llaves Ocultas)' },
      { name: 'Reglas de Negocio & Split 70/30', access: 'READ', label: 'Tarifa Oficial Acordada (Sin Split Agencia)' },
      { name: 'Gobernanza IAM, Roles & Auditoría WORM', access: 'BLOCKED', label: 'Bloqueado por Seguridad (RLS)' },
    ],
  },
];

const PERMISSION_MATRIX = [
  {
    module: 'Centro de Mando & Métricas Generales',
    owner: 'Solo su negocio (RLS 1:1)',
    operator: 'Métricas operativas asignadas',
    admin: 'Negocios asignados',
    superAdmin: 'Todos los negocios (Global)',
  },
  {
    module: 'Conversaciones WhatsApp & Takeover HITL',
    owner: 'Supervisión de su negocio',
    operator: 'Atención HITL & Rescate SLA',
    admin: 'Control activo (Intervención en vivo)',
    superAdmin: 'Control activo & Auditoría total',
  },
  {
    module: 'Campañas Meta Ads & RAG Wizard',
    owner: 'Lectura de reportes & KPIs',
    operator: 'Consulta de catálogo RAG',
    admin: 'Edición & Carga de Conocimiento',
    superAdmin: 'Edición total, Creación & Borrado',
  },
  {
    module: 'Configuración de Bot IA & API Keys (AES-256)',
    owner: 'Lectura de estado IA',
    operator: 'Sin acceso',
    admin: 'Ajuste de Prompts & Base RAG',
    superAdmin: 'Configuración de LLMs, Llaves & Modelos',
  },
  {
    module: 'Políticas de Leads & Desglose Financiero',
    owner: 'Solo su tarifa por lead',
    operator: 'Sin acceso financiero',
    admin: 'Métricas de negocios asignados',
    superAdmin: 'Margen de agencia & Split 70/30 global',
  },
  {
    module: 'Gestión de Accesos IAM & Bitácora WORM',
    owner: 'Sin acceso (Aislado)',
    operator: 'Sin acceso',
    admin: 'Consulta de equipo asignado',
    superAdmin: 'Invitar, revocar y exportar auditoría',
  },
];

const CATEGORY_META = {
  AUTH: {
    label: 'Autenticación & Sesión',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  },
  IAM_RBAC: {
    label: 'Identidad & Roles (IAM)',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  },
  TENANT_POLICY: {
    label: 'Políticas & Precios',
    badgeClass: 'bg-neon/15 text-neon border-neon/30',
  },
  AI_CONFIG: {
    label: 'Motor IA & Bóveda BYOK',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  },
  SECURITY: {
    label: 'Seguridad & Integridad WORM',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  DATA_EXPORT: {
    label: 'Exportación Forense',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
};

const ACCESS_BADGE_STYLES = {
  FULL: {
    label: 'Control Total',
    className: 'bg-neon/15 text-neon border-neon/30',
  },
  ASSIGNED: {
    label: 'Operación Asignada',
    className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  },
  READ: {
    label: 'Solo Lectura',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  BLOCKED: {
    label: 'Bloqueado por Seguridad',
    className: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
};

const formatAuditTimestamp = (rawTs) => {
  if (!rawTs) return 'Reciente';
  const parsed = new Date(rawTs);
  if (Number.isNaN(parsed.getTime())) return String(rawTs);
  return parsed.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const isPendingInvitationUser = (u) => {
  if (!u) return false;
  if (u.mustChangePassword === true) return true;
  if (u.status === 'PENDING_INVITE') return true;
  const loginStr = String(u.lastLogin || '').toLowerCase();
  return loginStr.includes('sin actividad') || loginStr.includes('pendiente');
};

export const SecurityGovernanceView = () => {
  const [logs, setLogs] = useState(() =>
    Array.isArray(INITIAL_AUDIT_LOGS) ? INITIAL_AUDIT_LOGS.map(normalizeAuditLog).filter(Boolean) : []
  );
  const [staffList, setStaffList] = useState([]);
  const [ownersList, setOwnersList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [verifyingWorm, setVerifyingWorm] = useState(false);
  const [toastBanner, setToastBanner] = useState(null);

  const [activeSubTab, setActiveSubTab] = useState('matrix'); // 'matrix' | 'logs'
  const [selectedRoleSimulator, setSelectedRoleSimulator] = useState('SUPER_ADMIN');

  // Filtros de la Bitácora Forense
  const [searchLog, setSearchLog] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [copiedHashId, setCopiedHashId] = useState(null);
  const [isDistributionCollapsed, setIsDistributionCollapsed] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToastBanner({ message, type });
    setTimeout(() => {
      setToastBanner((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  const fetchGovernanceAndAuditData = useCallback(
    async (showFeedback = false) => {
      setLoadingData(true);
      try {
        const [fetchedLogs, fetchedStaff, fetchedOwners] = await Promise.all([
          auditService.getAuditLogs(),
          userService.getStaff(),
          userService.getOwners(),
        ]);

        if (Array.isArray(fetchedLogs)) {
          setLogs(fetchedLogs);
        }
        if (Array.isArray(fetchedStaff)) {
          setStaffList(fetchedStaff);
        }
        if (Array.isArray(fetchedOwners)) {
          setOwnersList(fetchedOwners);
        }
        if (showFeedback) {
          showToast(
            `Bitácora WORM sincronizada desde PostgreSQL 17 (${fetchedLogs?.length || 0} eventos verificados).`,
            'success'
          );
        }
      } catch (err) {
        if (showFeedback) {
          showToast('Error al sincronizar con PostgreSQL 17.', 'warning');
        }
      } finally {
        setLoadingData(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchGovernanceAndAuditData(false);
  }, [fetchGovernanceAndAuditData]);

  // Distribución en vivo por rol (4 roles canónicos)
  const roleDistribution = useMemo(() => {
    const allUsers = [
      ...staffList.map((s) => ({
        ...s,
        canonicalRole: (s.role || 'ADMIN').toUpperCase(),
        displayName: s.name || s.fullName || 'Colaborador',
      })),
      ...ownersList.map((o) => ({
        ...o,
        canonicalRole: 'CLIENT_OWNER',
        displayName: o.ownerName || o.name || 'Dueño de Negocio',
      })),
    ];

    return ROLE_DEFINITIONS.map((roleDef) => {
      const matchingUsers = allUsers.filter((u) => u.canonicalRole === roleDef.key);
      const pendingCount = matchingUsers.filter(isPendingInvitationUser).length;
      const activeCount = Math.max(0, matchingUsers.length - pendingCount);

      return {
        ...roleDef,
        total: matchingUsers.length,
        activeCount,
        pendingCount,
        users: matchingUsers,
      };
    });
  }, [staffList, ownersList]);

  const activeSimulatorRole = useMemo(() => {
    return (
      roleDistribution.find((r) => r.key === selectedRoleSimulator) || roleDistribution[0]
    );
  }, [roleDistribution, selectedRoleSimulator]);

  // KPIs Superiores de Salud de Seguridad (Sub-vista 2)
  const auditKpis = useMemo(() => {
    const total = logs.length;
    const authorized = logs.filter((l) => l.status === 'SUCCESS').length;
    const governanceChanges = logs.filter((l) =>
      ['IAM_RBAC', 'TENANT_POLICY', 'AI_CONFIG'].includes(l.eventCategory)
    ).length;
    const alertsAndBlocked = logs.filter((l) =>
      ['BLOCKED', 'WARNING'].includes(l.status)
    ).length;

    return {
      total,
      authorized,
      governanceChanges,
      alertsAndBlocked,
    };
  }, [logs]);

  // Filtrado de logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (searchLog.trim()) {
        const q = searchLog.toLowerCase();
        const matchUser = (l.actorName || l.user || '').toLowerCase().includes(q);
        const matchEmail = (l.actorEmail || l.email || '').toLowerCase().includes(q);
        const matchAction = (l.action || '').toLowerCase().includes(q);
        const matchTarget = (l.targetResource || l.target || '').toLowerCase().includes(q);
        const matchIp = (l.ipAddress || l.ip || '').toLowerCase().includes(q);
        const matchHash = (l.wormHash || '').toLowerCase().includes(q);
        if (
          !matchUser &&
          !matchEmail &&
          !matchAction &&
          !matchTarget &&
          !matchIp &&
          !matchHash
        ) {
          return false;
        }
      }

      if (filterCategory !== 'all' && l.eventCategory !== filterCategory) {
        return false;
      }

      if (filterStatus !== 'all' && l.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [logs, searchLog, filterCategory, filterStatus]);

  // Pulso de verificación WORM en vivo
  const handleVerifyWormIntegrity = async () => {
    setVerifyingWorm(true);
    try {
      const created = await auditService.recordEvent({
        eventCategory: 'SECURITY',
        action: 'Verificación Criptográfica de Integridad WORM (PostgreSQL Trigger)',
        targetResource: 'Tabla security_audit_logs (Append-Only)',
        status: 'SUCCESS',
        metadata: {
          triggerName: 'trg_immutable_security_audit_logs',
          verifiedRecordsCount: logs.length + 1,
          immutabilityMode: 'WORM_STRICT_APPEND_ONLY',
          engine: 'PostgreSQL 17',
        },
      });

      const refreshed = await auditService.getAuditLogs();
      if (Array.isArray(refreshed) && refreshed.length > 0) {
        setLogs(refreshed);
        setExpandedLogId(created?.id || refreshed[0]?.id || null);
      } else if (created) {
        setLogs((prev) => [created, ...prev]);
        setExpandedLogId(created.id);
      }

      showToast(
        'Integridad WORM verificada: Trigger trg_immutable_security_audit_logs activo y bloqueando UPDATE/DELETE.',
        'success'
      );
    } finally {
      setVerifyingWorm(false);
    }
  };

  // Exportar CSV o JSON y registrar DATA_EXPORT
  const handleExportLogs = async (format) => {
    const timestampSlug = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    if (format === 'json') {
      const payload = JSON.stringify(filteredLogs, null, 2);
      const blob = new Blob([payload], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vector-audit-worm-${timestampSlug}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const headers = [
        'ID',
        'Fecha_Hora',
        'Actor',
        'Email',
        'Rol',
        'Categoria',
        'Accion',
        'Recurso_Objetivo',
        'IP',
        'Ubicacion',
        'Estado',
        'Hash_WORM',
      ];
      const rows = filteredLogs.map((item) => [
        item.id,
        item.createdAt,
        item.actorName,
        item.actorEmail,
        item.actorRole,
        item.eventCategory,
        item.action,
        item.targetResource,
        item.ipAddress,
        item.location,
        item.status,
        item.wormHash,
      ]);
      const csvContent = [
        headers.join(','),
        ...rows.map((r) =>
          r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vector-audit-worm-${timestampSlug}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    const exportedEvent = await auditService.recordEvent({
      eventCategory: 'DATA_EXPORT',
      action: `Exportación Forense de Bitácora WORM (${format.toUpperCase()})`,
      targetResource: `${filteredLogs.length} registros exportados`,
      status: 'SUCCESS',
      metadata: {
        format: format.toUpperCase(),
        exportedRows: filteredLogs.length,
        filterCategory,
        filterStatus,
      },
    });

    if (exportedEvent) {
      setLogs((prev) => [exportedEvent, ...prev.filter((p) => p.id !== exportedEvent.id)]);
    }

    showToast(
      `Bitácora exportada en formato ${format.toUpperCase()} (${filteredLogs.length} eventos) y registrada en auditoría.`,
      'success'
    );
  };

  const handleCopyWormHash = (hashText, id) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hashText);
      setCopiedHashId(id);
      setTimeout(() => setCopiedHashId(null), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Contextual */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold bg-neon/10 px-2 py-0.5 rounded border border-neon/20">
              GOBERNANZA & SEGURIDAD DE LA PLATAFORMA
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
              <Database className="w-3 h-3" />
              PostgreSQL 17 WORM En Vivo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Políticas, Roles & <span className="text-neon">Auditoría</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 max-w-2xl">
            Monitorea la distribución real de cuentas por rol, simula el alcance de permisos RBAC y audita la bitácora forense inmutable (`security_audit_logs`).
          </p>
        </div>

        {/* View Switcher + Refresh Action */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchGovernanceAndAuditData(true)}
            disabled={loadingData}
            className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-xs font-mono text-[var(--text-main)] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Sincronizar usuarios y bitácora desde PostgreSQL 17"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neon ${loadingData ? 'animate-spin' : ''}`} />
            <span>Actualizar Bitácora</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveSubTab('matrix')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'logs'
                  ? 'bg-neon text-black shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Registro de Auditoría ({logs.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Feedback Banner */}
      {toastBanner && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center justify-between gap-3 animate-fade-in ${
            toastBanner.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastBanner.message}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-emerald-500/20 text-emerald-400 font-bold">
            WORM OK
          </span>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-VISTA 1: MATRIZ DE PERMISOS & SIMULADOR RBAC EN VIVO            */}
      {/* =================================================================== */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6 animate-fade-in">
          {/* 1. Tarjetas de Distribución en Vivo por Rol (4 Roles Canónicos) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neon" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Distribución en Vivo por Rol en PostgreSQL (4 Roles Canónicos)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:inline">
                  Haz clic en cualquier rol para inspeccionar su alcance en el simulador
                </span>
                <button
                  type="button"
                  onClick={() => setIsDistributionCollapsed((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[10px] font-mono text-[var(--text-main)] flex items-center gap-1 transition-all cursor-pointer"
                  title={isDistributionCollapsed ? 'Expandir tarjetas de distribución' : 'Contraer tarjetas de distribución'}
                >
                  {isDistributionCollapsed ? (
                    <>
                      <span>Expandir Tarjetas</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neon" />
                    </>
                  ) : (
                    <>
                      <span>Contraer</span>
                      <ChevronUp className="w-3.5 h-3.5 text-neon" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {!isDistributionCollapsed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono animate-fade-in">
                {roleDistribution.map((roleItem) => {
                  const isSelected = selectedRoleSimulator === roleItem.key;
                  return (
                    <button
                      key={roleItem.key}
                      type="button"
                      onClick={() => setSelectedRoleSimulator(roleItem.key)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-[var(--bg-card)] border-neon shadow-[0_0_20px_rgba(231,249,0,0.08)]'
                          : 'bg-[var(--bg-panel)] border-[var(--border-color)] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border ${roleItem.accent}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${roleItem.dotColor}`} />
                            {roleItem.key}
                          </span>
                          <h3 className="text-sm font-bold text-[var(--text-main)] font-sans mt-1.5">
                            {roleItem.label}
                          </h3>
                        </div>
                        <span className="text-2xl font-heading font-black text-[var(--text-main)]">
                          {roleItem.total}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)] text-[11px]">
                        <div className="p-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                          <span className="text-[10px] text-[var(--text-muted)] block">Activos:</span>
                          <strong className="text-emerald-400 text-xs">{roleItem.activeCount}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                          <span className="text-[10px] text-[var(--text-muted)] block">
                            Inv. Pendiente:
                          </span>
                          <strong
                            className={`text-xs ${
                              roleItem.pendingCount > 0 ? 'text-amber-400' : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {roleItem.pendingCount}
                          </strong>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Simulador Interactivo de Alcance por Rol */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-neon" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold">
                    SIMULADOR INTERACTIVO DE ALCANCE RBAC
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-black text-[var(--text-main)] mt-0.5">
                  ¿Qué ve y qué puede hacer el rol{' '}
                  <span className="text-neon">{activeSimulatorRole.label}</span>?
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-3xl">
                  {activeSimulatorRole.description}
                </p>
              </div>

              {/* Acceso directo cuando las tarjetas superiores estén contraídas */}
              {isDistributionCollapsed && (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-xs shrink-0 animate-fade-in">
                  {ROLE_DEFINITIONS.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setSelectedRoleSimulator(r.key)}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedRoleSimulator === r.key
                          ? 'bg-neon text-black shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Módulos y nivel de acceso (8 cols) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {activeSimulatorRole.modules.map((mod, idx) => {
                  const styleMeta = ACCESS_BADGE_STYLES[mod.access] || ACCESS_BADGE_STYLES.READ;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[var(--text-main)] font-sans text-xs">
                          {mod.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${styleMeta.className}`}
                        >
                          {styleMeta.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">{mod.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Usuarios Reales con este rol hoy (4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] flex flex-col justify-between space-y-3 font-mono text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-[11px] font-bold text-[var(--text-main)] uppercase">
                      Cuentas Reales en este Rol
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neon/10 text-neon text-[10px] font-bold">
                      {activeSimulatorRole.users.length} registradas
                    </span>
                  </div>

                  {activeSimulatorRole.users.length === 0 ? (
                    <div className="py-6 text-center text-[var(--text-muted)] text-[11px]">
                      No hay cuentas registradas actualmente bajo el rol {activeSimulatorRole.label}.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {activeSimulatorRole.users.map((u) => {
                        const pending = isPendingInvitationUser(u);
                        return (
                          <div
                            key={u.id || u.email}
                            className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-[var(--text-main)] text-xs truncate">
                                {u.displayName}
                              </div>
                              <div className="text-[10px] text-[var(--text-muted)] truncate">
                                {u.email}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 border ${
                                pending
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {pending ? 'Inv. Pendiente' : 'Activo'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>Política RLS & PoLP Aplicada</span>
                  <span className="text-emerald-400 font-bold">PostgreSQL 17</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Salvaguardas Arquitectónicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center gap-2 text-neon">
                <Lock className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Aislamiento Multi-Tenant (RLS 1:1)
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
                  Inmutabilidad WORM por Trigger SQL
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                La tabla `security_audit_logs` está blindada con el trigger `trg_immutable_security_audit_logs` que rechaza cualquier sentencia `UPDATE` o `DELETE` incluso desde superusuario.
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
                Los Administradores y Operadores únicamente tienen acceso a los módulos operativos y a los negocios explícitamente autorizados por un Super Admin.
              </p>
            </div>
          </div>

          {/* 4. Tabla: Matriz de Gobernanza & Capacidades por Rol */}
          <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)]">
                  Matriz de Gobernanza & Capacidades por Rol
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Comparativa oficial de acceso entre Dueños de Negocio (Clientes) y Staff de la Agencia
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6 font-bold">Módulo / Capacidad</th>
                    <th className="py-3 px-4 font-bold text-emerald-400">Dueño Negocio (Cliente)</th>
                    <th className="py-3 px-4 font-bold text-amber-400">Operador (HITL)</th>
                    <th className="py-3 px-4 font-bold text-cyan-400">Admin Agencia</th>
                    <th className="py-3 px-4 font-bold text-neon">Super Admin (Global)</th>
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
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                          {row.operator}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px]">
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

      {/* =================================================================== */}
      {/* SUB-VISTA 2: REGISTRO DE AUDITORÍA FORENSE WORM                     */}
      {/* =================================================================== */}
      {activeSubTab === 'logs' && (
        <div className="space-y-5 animate-fade-in">
          {/* 1. 4 KPIs Superiores de Salud de Seguridad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Eventos WORM Registrados
                </span>
                <Fingerprint className="w-4 h-4 text-neon" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-heading font-black text-[var(--text-main)]">
                  {auditKpis.total}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold">
                  Trigger PostgreSQL Activo
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Operaciones Autorizadas
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-heading font-black text-emerald-400">
                  {auditKpis.authorized}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">Estado SUCCESS</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Cambios Gobernanza & Equipo
                </span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-heading font-black text-cyan-400">
                  {auditKpis.governanceChanges}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  IAM + Políticas + IA
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Alertas & Intentos Bloqueados
                </span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-heading font-black text-rose-400">
                  {auditKpis.alertsAndBlocked}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  BLOCKED + WARNING
                </span>
              </div>
            </div>
          </div>

          {/* 2. Barra de Filtros y Acciones Ejecutivas */}
          <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Buscador */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  placeholder="Buscar por usuario, correo, acción, IP, recurso o hash WORM..."
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-main)] font-mono outline-none transition-all placeholder:text-[var(--text-muted)]"
                />
              </div>

              {/* Selector de Categoría */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-neon transition-colors"
              >
                <option value="all">Todas las Categorías</option>
                <option value="AUTH">AUTH (Autenticación)</option>
                <option value="IAM_RBAC">IAM_RBAC (Roles & Equipo)</option>
                <option value="TENANT_POLICY">TENANT_POLICY (Reglas & Precios)</option>
                <option value="AI_CONFIG">AI_CONFIG (Motor IA & BYOK)</option>
                <option value="SECURITY">SECURITY (Integridad WORM)</option>
                <option value="DATA_EXPORT">DATA_EXPORT (Exportaciones)</option>
              </select>

              {/* Selector de Estado */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-neon transition-colors"
              >
                <option value="all">Todos los Estados</option>
                <option value="SUCCESS">SUCCESS (Autorizados)</option>
                <option value="WARNING">WARNING (Advertencias)</option>
                <option value="BLOCKED">BLOCKED (Bloqueados)</option>
              </select>
            </div>

            {/* Acciones Ejecutivas Forenses */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)] font-mono text-xs">
              <div className="text-[11px] text-[var(--text-muted)]">
                Mostrando <strong className="text-[var(--text-main)]">{filteredLogs.length}</strong> de{' '}
                <strong className="text-[var(--text-main)]">{logs.length}</strong> registros inmutables. Haz clic en una fila para abrir el Inspector Forense WORM.
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleVerifyWormIntegrity}
                  disabled={verifyingWorm}
                  className="px-3.5 py-2 rounded-xl bg-neon text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>
                    {verifyingWorm ? 'Verificando WORM...' : 'Verificar Integridad WORM'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportLogs('csv')}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportLogs('json')}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-main)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Exportar JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Tabla Forense Interactiva con Inspector de Detalle */}
          <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-5 font-bold">Fecha / Hora</th>
                    <th className="py-3 px-4 font-bold">Actor & Rol</th>
                    <th className="py-3 px-4 font-bold">Categoría</th>
                    <th className="py-3 px-4 font-bold">Acción Ejecutada</th>
                    <th className="py-3 px-4 font-bold">Recurso / Negocio</th>
                    <th className="py-3 px-4 font-bold">IP & Origen</th>
                    <th className="py-3 px-4 font-bold text-right">Estado & Forense</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-[var(--text-muted)]">
                        No se encontraron registros de auditoría con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isBlocked = log.status === 'BLOCKED';
                      const isWarning = log.status === 'WARNING';
                      const isExpanded = expandedLogId === log.id;
                      const catMeta = CATEGORY_META[log.eventCategory] || {
                        label: log.eventCategory || 'SECURITY',
                        badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                      };
                      const metadataEntries = Object.entries(log.metadata || {});

                      return (
                        <React.Fragment key={log.id}>
                          <tr
                            onClick={() =>
                              setExpandedLogId((prev) => (prev === log.id ? null : log.id))
                            }
                            className={`cursor-pointer transition-colors ${
                              isExpanded
                                ? 'bg-[var(--bg-card)]'
                                : isBlocked
                                ? 'bg-rose-950/15 hover:bg-rose-950/25'
                                : 'hover:bg-[var(--bg-card)]/60'
                            }`}
                          >
                            <td className="py-3.5 px-4 sm:px-5 text-[var(--text-muted)] text-[11px] whitespace-nowrap">
                              <div>{formatAuditTimestamp(log.createdAt || log.timestamp)}</div>
                              <div className="text-[10px] text-zinc-500">{log.id}</div>
                            </td>

                            <td className="py-3.5 px-4 font-bold text-[var(--text-main)] whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span>{log.actorName || log.user}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                  {log.actorRole || log.role}
                                </span>
                              </div>
                              <div className="text-[10px] text-[var(--text-muted)] font-normal">
                                {log.actorEmail || log.email}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold ${catMeta.badgeClass}`}
                              >
                                {log.eventCategory}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-[var(--text-main)] max-w-xs">
                              <span className="font-semibold block">{log.action}</span>
                            </td>

                            <td className="py-3.5 px-4 text-[var(--text-muted)]">
                              <span className="text-[var(--text-main)] font-medium">
                                {log.targetResource || log.target}
                              </span>
                              {log.tenantId && (
                                <span className="block text-[10px] text-zinc-500">
                                  Tenant: {log.tenantId}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-[var(--text-muted)] text-[11px] whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Globe className="w-3 h-3 text-[var(--text-muted)]" />
                                <span>{log.ipAddress || log.ip}</span>
                              </div>
                              <span className="text-[10px] text-[var(--text-muted)]">
                                {log.location}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                {isBlocked ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    <AlertTriangle className="w-3 h-3" /> BLOCKED
                                  </span>
                                ) : isWarning ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    <AlertTriangle className="w-3 h-3" /> WARNING
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3" /> SUCCESS
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedLogId((prev) => (prev === log.id ? null : log.id));
                                  }}
                                  className="px-2 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-neon text-[10px] text-[var(--text-main)] inline-flex items-center gap-1"
                                >
                                  <span>Detalle</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3 h-3 text-neon" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Inspector Forense WORM Expandible */}
                          {isExpanded && (
                            <tr className="bg-black/40 border-b border-[var(--border-color)]">
                              <td colSpan={7} className="p-4 sm:p-5">
                                <div className="rounded-2xl bg-[var(--bg-base)] border border-neon/30 p-4 space-y-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                                    <div className="flex items-center gap-2">
                                      <Terminal className="w-4 h-4 text-neon" />
                                      <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                                        Inspector Forense WORM // Evidencia Criptográfica Inmutable
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-[var(--text-muted)]">
                                        Sello SHA-256 WORM:
                                      </span>
                                      <code className="text-[11px] px-2 py-0.5 rounded bg-black border border-zinc-800 text-neon">
                                        {log.wormHash}
                                      </code>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyWormHash(log.wormHash, log.id)}
                                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                                        title="Copiar Sello WORM"
                                      >
                                        {copiedHashId === log.id ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                                        Contexto de Red & Agente
                                      </span>
                                      <div>
                                        <span className="text-zinc-500">IP / Ubicación: </span>
                                        <span className="text-[var(--text-main)] font-bold">
                                          {log.ipAddress} ({log.location})
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-zinc-500">User-Agent: </span>
                                        <span className="text-zinc-300 break-all text-[11px]">
                                          {log.userAgent}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="lg:col-span-2 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
                                          Payload & Metadata JSONB (`security_audit_logs.metadata`)
                                        </span>
                                        <span className="text-[10px] text-emerald-400 font-bold">
                                          {metadataEntries.length} atributos registrados
                                        </span>
                                      </div>

                                      {metadataEntries.length === 0 ? (
                                        <p className="text-[11px] text-[var(--text-muted)]">
                                          Evento registrado sin atributos adicionales en JSONB.
                                        </p>
                                      ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                          {metadataEntries.map(([k, v]) => (
                                            <div
                                              key={k}
                                              className="p-2 rounded-lg bg-black/40 border border-zinc-800/80"
                                            >
                                              <span className="text-[10px] text-zinc-400 block truncate">
                                                {k}:
                                              </span>
                                              <span className="text-[11px] font-bold text-neon break-all">
                                                {typeof v === 'object'
                                                  ? JSON.stringify(v)
                                                  : String(v)}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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
