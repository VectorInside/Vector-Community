'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_AGENCY_STAFF } from '@/utils/mockAccounts';
import {
  UserPlus,
  Mail,
  Phone,
  ShieldCheck,
  Search,
  CheckCircle2,
  X,
  Building2,
  Lock,
  RotateCcw,
  Power,
  Users,
  ShieldAlert,
  Sparkles,
  Send,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  KeyRound,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portal } from '@/components/common/Portal';

const ROLE_DEFINITIONS = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description: 'Control total de la agencia, configuración de IA, credenciales, finanzas y acceso global a todos los negocios.',
    color: 'bg-neon/15 text-neon border-neon/30',
    badgeText: 'Super Admin',
  },
  ADMIN: {
    label: 'Administrador',
    description: 'Gestión operativa, supervisión de campañas, conversaciones y prospectos de los negocios asignados.',
    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    badgeText: 'Administrador',
  },
};

export const AgencyStaffView = () => {
  const { tenantsData } = useAuth();

  // Persist agency staff in localStorage for interactive session
  const [staffList, setStaffList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vector_agency_staff_members');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_AGENCY_STAFF;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_agency_staff_members', JSON.stringify(staffList));
    }
  }, [staffList]);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Feedback
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingStaffTenants, setEditingStaffTenants] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ADMIN',
    assignedTenantsMode: 'all', // 'all' | 'custom'
    customTenants: [],
  });

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tenantsArray = useMemo(() => {
    return Object.values(tenantsData || {});
  }, [tenantsData]);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((member) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = member.name?.toLowerCase().includes(q);
        const matchEmail = member.email?.toLowerCase().includes(q);
        const matchRole = member.roleLabel?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchRole) return false;
      }

      if (roleFilter !== 'all' && member.role !== roleFilter) return false;
      if (statusFilter !== 'all' && member.status !== statusFilter) return false;

      return true;
    });
  }, [staffList, searchQuery, roleFilter, statusFilter]);

  // Stats (Super Admin & Administrador)
  const stats = useMemo(() => {
    return {
      total: staffList.length,
      superAdmins: staffList.filter((s) => s.role === 'SUPER_ADMIN').length,
      admins: staffList.filter((s) => s.role === 'ADMIN').length,
      active: staffList.filter((s) => s.status === 'ACTIVE').length,
    };
  }, [staffList]);

  // Toggle status (Active / Suspended)
  const handleToggleStatus = (id) => {
    setStaffList((prev) =>
      prev.map((member) => {
        if (member.id === id) {
          const next = member.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          showToast(`Acceso de ${member.name} ${next === 'ACTIVE' ? 'reactivado' : 'suspendido'}`);
          return { ...member, status: next };
        }
        return member;
      })
    );
  };

  // Submit new staff invitation
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      showToast('Completa el nombre y correo electrónico');
      return;
    }

    const assigned =
      inviteForm.assignedTenantsMode === 'all'
        ? 'all'
        : inviteForm.customTenants.length > 0
        ? inviteForm.customTenants
        : 'all';

    const newMember = {
      id: `staff-${Date.now()}`,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim().toLowerCase(),
      phone: inviteForm.phone.trim() || '+52 55 0000 0000',
      role: inviteForm.role,
      roleLabel: ROLE_DEFINITIONS[inviteForm.role]?.label || 'Administrador',
      avatar: inviteForm.role === 'SUPER_ADMIN' ? '⚡' : '💼',
      status: 'ACTIVE',
      assignedTenants: assigned,
      lastLogin: 'Invitación enviada (Listo para ingresar)',
      createdAt: new Date().toISOString(),
      twoFactorEnabled: false,
    };

    setStaffList((prev) => [newMember, ...prev]);
    setIsInviteModalOpen(false);
    showToast(`Invitación enviada a ${newMember.email}`);

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#C3F400', '#3B82F6', '#A855F7'],
      });
    } catch (err) {}

    setInviteForm({
      name: '',
      email: '',
      phone: '',
      role: 'ADMIN',
      assignedTenantsMode: 'all',
      customTenants: [],
    });
  };

  // Update assigned tenants modal submit
  const handleSaveAssignedTenants = (staffId, assigned) => {
    setStaffList((prev) =>
      prev.map((m) => (m.id === staffId ? { ...m, assignedTenants: assigned } : m))
    );
    setEditingStaffTenants(null);
    showToast('Negocios asignados actualizados correctamente');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 border border-neon/50 text-white text-xs font-mono shadow-[0_0_20px_rgba(195,244,0,0.25)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Contextual */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon font-bold bg-neon/10 px-2 py-0.5 rounded border border-neon/20">
              ESTRUCTURA DE AGENCIA / STAFF INTERNO
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Control de Roles & Negocios Asignados
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Equipo & Colaboradores de la <span className="text-neon">Agencia</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 max-w-2xl">
            Invita a miembros de tu equipo (Super Admins y Administradores). Define qué negocios tienen autorización de monitorear y operar.
          </p>
        </div>

        {/* Action Button: Invite Staff */}
        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-neon text-black font-mono font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95 shrink-0 min-h-[44px]"
        >
          <UserPlus className="w-4 h-4 text-black" />
          <span>+ Invitar Colaborador</span>
        </button>
      </header>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
            Total Colaboradores
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
              {stats.total}
            </span>
            <span className="text-[10px] text-emerald-500 font-sans font-bold">
              {stats.active} activos
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-neon uppercase tracking-wider block font-semibold">
            Super Admins
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-neon">
              {stats.superAdmins}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">
              Control global
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-blue-400 uppercase tracking-wider block font-semibold">
            Administradores
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-blue-400">
              {stats.admins}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">
              Negocios asignados
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">
            Cuentas Activas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">
              {stats.active}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">
              Acceso habilitado
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por colaborador, correo o rol..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-main)] font-mono outline-none transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-neon transition-colors"
          >
            <option value="all">Todos los Roles</option>
            <option value="SUPER_ADMIN">Super Admins (Control Global)</option>
            <option value="ADMIN">Administradores (Por Negocio)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-neon transition-colors"
          >
            <option value="all">Todos los Estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="PENDING_INVITE">Invitación Pendiente</option>
            <option value="SUSPENDED">Suspendidos</option>
          </select>

          {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="text-[11px] font-mono text-neon hover:underline px-2 py-1"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Staff Members List */}
      <div className="space-y-3 font-sans">
        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3">
            <Users className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <h4 className="text-base font-bold text-[var(--text-main)]">
              No se encontraron colaboradores con estos filtros
            </h4>
            <p className="text-xs text-[var(--text-muted)] font-mono max-w-md mx-auto">
              Intenta cambiar los términos de búsqueda o añade un nuevo miembro del equipo.
            </p>
          </div>
        ) : (
          filteredStaff.map((member) => {
            const roleInfo = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS.SUPER_ADMIN;
            const isSuspended = member.status === 'SUSPENDED';
            const isPending = member.status === 'PENDING_INVITE';

            return (
              <div
                key={member.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                  isSuspended
                    ? 'bg-red-950/10 border-red-900/30 opacity-75'
                    : 'bg-[var(--bg-panel)] border-[var(--border-color)] hover:border-neon/50 shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Member Profile & Role */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-[280px]">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:border-neon/50 transition-colors">
                      {member.avatar}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)] truncate">
                          {member.name}
                        </h3>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${roleInfo.color}`}
                        >
                          {roleInfo.badgeText}
                        </span>
                        {member.twoFactorEnabled && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> 2FA Activo
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Invitación Pendiente
                          </span>
                        )}
                        {isSuspended && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            Acceso Suspendido
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--text-muted)]">
                        {roleInfo.label} • {member.phone}
                      </p>

                      <div className="flex items-center gap-1.5 font-mono text-xs pt-0.5">
                        <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                        <span className="text-[var(--text-muted)]">{member.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(member.email, member.id)}
                          className="text-[var(--text-muted)] hover:text-neon p-0.5 transition-colors"
                          title="Copiar correo"
                        >
                          {copiedId === member.id ? (
                            <Check className="w-3 h-3 text-neon" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Assigned Tenants */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-xs space-y-2 min-w-[280px]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] font-medium">Negocios Asignados:</span>
                      <button
                        type="button"
                        onClick={() => setEditingStaffTenants(member)}
                        className="text-[10px] text-neon hover:underline font-bold flex items-center gap-1"
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>Configurar</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
                      {member.assignedTenants === 'all' ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-neon/15 text-neon border border-neon/30 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> Todos los Negocios ({tenantsArray.length})
                        </span>
                      ) : Array.isArray(member.assignedTenants) && member.assignedTenants.length > 0 ? (
                        member.assignedTenants.map((tId) => {
                          const tObj = tenantsArray.find((x) => x.id === tId);
                          return (
                            <span
                              key={tId}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] flex items-center gap-1"
                            >
                              <span>{tObj?.avatar || '🏢'}</span>
                              <span className="truncate max-w-[110px]">{tObj?.name || tId}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)] italic">
                          Sin negocios asignados
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between pt-0.5 border-t border-[var(--border-color)]">
                      <span>Último acceso:</span>
                      <span className="font-medium text-[var(--text-main)] truncate max-w-[170px]">
                        {member.lastLogin}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingStaffTenants(member)}
                      className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-muted)] hover:text-neon transition-all flex items-center gap-1.5 min-h-[44px]"
                      title="Editar permisos y negocios asignados"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-neon" />
                      <span className="font-bold">Permisos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(member.id)}
                      className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 min-h-[44px] ${
                        isSuspended
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-red-400 text-[var(--text-muted)] hover:text-red-400'
                      }`}
                      title={isSuspended ? 'Reactivar acceso' : 'Suspender acceso'}
                    >
                      <Power className={`w-3.5 h-3.5 ${isSuspended ? 'text-emerald-400' : 'text-rose-400'}`} />
                      <span className="hidden sm:inline">
                        {isSuspended ? 'Reactivar' : 'Suspender'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: INVITAR NUEVO COLABORADOR */}
      {isInviteModalOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="relative w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-neon/15 text-neon border border-neon/30">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                      Invitar Miembro al Equipo
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      Acceso para colaboradores internos de la agencia
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofia Villarreal"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sofia@vectorinside.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                      Teléfono WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="+52 55 1234 5678"
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                    Rol Operativo & Permisos *
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setInviteForm({
                        ...inviteForm,
                        role: newRole,
                        assignedTenantsMode: newRole === 'SUPER_ADMIN' ? 'all' : inviteForm.assignedTenantsMode,
                      });
                    }}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] outline-none"
                  >
                    <option value="SUPER_ADMIN">Super Admin - Control Total Global</option>
                    <option value="ADMIN">Administrador - Negocios Asignados</option>
                  </select>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">
                    {ROLE_DEFINITIONS[inviteForm.role]?.description}
                  </p>
                </div>

                {/* Negocios Asignados */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                  <label className="block text-[var(--text-main)] font-bold font-sans text-xs">
                    Negocios Autorizados
                  </label>

                  {inviteForm.role === 'SUPER_ADMIN' ? (
                    <div className="p-3 rounded-xl bg-neon/10 border border-neon/30 text-neon text-xs font-mono flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Los Super Admins tienen acceso global automático a todos los negocios de la plataforma.</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 text-xs font-sans">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="assignedMode"
                            checked={inviteForm.assignedTenantsMode === 'all'}
                            onChange={() => setInviteForm({ ...inviteForm, assignedTenantsMode: 'all' })}
                            className="accent-[var(--neon)]"
                          />
                          <span>Todos los Negocios</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="assignedMode"
                            checked={inviteForm.assignedTenantsMode === 'custom'}
                            onChange={() => setInviteForm({ ...inviteForm, assignedTenantsMode: 'custom' })}
                            className="accent-[var(--neon)]"
                          />
                          <span>Seleccionar Negocios Específicos</span>
                        </label>
                      </div>

                      {inviteForm.assignedTenantsMode === 'custom' && (
                        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                          {tenantsArray.map((t) => {
                            const checked = inviteForm.customTenants.includes(t.id);
                            return (
                              <label
                                key={t.id}
                                className="flex items-center gap-2 text-[11px] cursor-pointer text-[var(--text-main)] hover:text-neon"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    const next = checked
                                      ? inviteForm.customTenants.filter((id) => id !== t.id)
                                      : [...inviteForm.customTenants, t.id];
                                    setInviteForm({ ...inviteForm, customTenants: next });
                                  }}
                                  className="accent-[var(--neon)] rounded"
                                />
                                <span>{t.avatar} {t.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-white font-mono"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.3)]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Invitación</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL: EDITAR NEGOCIOS ASIGNADOS */}
      {editingStaffTenants && (
        <EditAssignedTenantsModal
          staffMember={editingStaffTenants}
          allTenants={tenantsArray}
          onClose={() => setEditingStaffTenants(null)}
          onSave={handleSaveAssignedTenants}
        />
      )}
    </div>
  );
};

const EditAssignedTenantsModal = ({ staffMember, allTenants, onClose, onSave }) => {
  const [isAll, setIsAll] = useState(staffMember.assignedTenants === 'all');
  const [selectedIds, setSelectedIds] = useState(
    Array.isArray(staffMember.assignedTenants) ? staffMember.assignedTenants : []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(staffMember.id, isAll ? 'all' : selectedIds);
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
        <div className="relative w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4 shadow-2xl animate-scale-up">
          <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-neon/15 text-neon">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-heading font-black text-[var(--text-main)]">
                  Negocios Asignados
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  {staffMember.name} ({staffMember.roleLabel})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-[var(--text-main)]">
                <input
                  type="checkbox"
                  checked={isAll}
                  onChange={(e) => setIsAll(e.target.checked)}
                  className="accent-[var(--neon)] rounded"
                />
                <span className="font-bold">Acceso Global a Todos los Negocios</span>
              </label>

              {!isAll && (
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 max-h-48 overflow-y-auto">
                  {allTenants.map((t) => {
                    const checked = selectedIds.includes(t.id);
                    return (
                      <label
                        key={t.id}
                        className="flex items-center gap-2 text-xs cursor-pointer text-[var(--text-main)] hover:text-neon"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedIds((prev) =>
                              checked ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                            );
                          }}
                          className="accent-[var(--neon)] rounded"
                        />
                        <span>{t.avatar} {t.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Asignaciones</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};
