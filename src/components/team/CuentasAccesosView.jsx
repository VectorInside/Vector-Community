'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/hooks/useTenant';
import { INITIAL_BUSINESS_ACCOUNTS } from '@/utils/mockAccounts';
import {
  UserPlus,
  KeyRound,
  Mail,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Search,
  Eye,
  EyeOff,
  Power,
  RotateCcw,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertTriangle,
  X,
  Share2,
  Lock,
  Send,
  LayoutGrid,
  List,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portal } from '@/components/common/Portal';

/**
 * ============================================================================
 * CONSOLA DE GESTIÓN DE ACCESOS: 1 CUENTA DE DUEÑO POR NEGOCIO (MODELO 1:1)
 * ============================================================================
 * Estructura relacional preparada para Backend (PostgreSQL / Supabase):
 * Tabla: tenant_accounts
 * Constraints:
 *  - UNIQUE(tenant_id) -> Garantiza exactamente 1 cuenta por negocio (1:1 estricto).
 *  - UNIQUE(email)     -> Garantiza credenciales únicas de login.
 * ============================================================================
 */

export const CuentasAccesosView = () => {
  const { tenantsData } = useAuth();
  const { currentTenant } = useTenant();

  // Accounts state (persisted in localStorage for preview consistency)
  const [accounts, setAccounts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vector_tenant_owner_accounts');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_BUSINESS_ACCOUNTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_tenant_owner_accounts', JSON.stringify(accounts));
    }
  }, [accounts]);

  // Filters (Search, Tenant, Status)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenantFilter, setSelectedTenantFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // View Mode: 'grid' (detailed cards) or 'table' (compact density)
  const [viewMode, setViewMode] = useState('grid');

  // Security: Masked Passwords (toggle per tenant)
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (tenantId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [tenantId]: !prev[tenantId],
    }));
  };

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLimitNoticeOpen, setIsLimitNoticeOpen] = useState(false);
  const [resetPasswordModalUser, setResetPasswordModalUser] = useState(null);
  const [shareCredentialsUser, setShareCredentialsUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // 1-Click WhatsApp Direct Dispatch with Temporary Password Notice
  const handleSendWhatsApp = (account) => {
    const cleanPhone = (account.phone || '').replace(/[^0-9]/g, '');
    const message = `👋 Hola ${account.ownerName},\n\nTe compartimos las credenciales de acceso oficial para el portal de *${account.tenantName}* en Vector Inside:\n\n🔗 *Enlace de Acceso:* http://localhost:3000/login\n✉️ *Usuario:* ${account.email}\n🔑 *Contraseña Provisional:* ${account.tempPassword}\n\n⚠️ *AVISO DE SEGURIDAD:* Al ingresar a tu cuenta, el sistema te solicitará automáticamente definir tu *contraseña personal definitiva*. Nadie más conocerá tu clave.\n\n¡Cualquier duda o soporte estamos para servirte!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    showToast(`Abriendo WhatsApp para ${account.ownerName}...`);
  };

  // New Account Form State
  const [newAccountForm, setNewAccountForm] = useState({
    tenantId: 'dental',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    notes: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Quick Toast Helper
  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Copy to Clipboard Helper
  const handleCopy = (text, fieldKey) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast('Copiado al portapapeles');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Password Generator Helper
  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let pass = 'Vec#';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '26';
    return pass;
  };

  const handleGeneratePassword = () => {
    const pass = generateSecurePassword();
    setNewAccountForm((prev) => ({ ...prev, password: pass }));
    showToast('Contraseña provisional generada');
  };

  // Business List mapped from tenantsData
  const tenantsList = useMemo(() => {
    return Object.values(tenantsData || {});
  }, [tenantsData]);

  // Available Businesses without an account yet (Enforcing 1:1 rule strictly)
  const availableTenantsWithoutAccount = useMemo(() => {
    return tenantsList.filter((t) => !accounts.some((acc) => acc.tenantId === t.id));
  }, [tenantsList, accounts]);

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // 1. Text Search (Owner Name, Email, Tenant Name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = acc.ownerName?.toLowerCase().includes(q);
        const matchEmail = acc.email?.toLowerCase().includes(q);
        const matchTenant = acc.tenantName?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchTenant) return false;
      }

      // 2. Tenant Filter
      if (selectedTenantFilter !== 'all') {
        if (acc.tenantId !== selectedTenantFilter) return false;
      }

      // 3. Status Filter
      if (selectedStatusFilter !== 'all' && acc.status !== selectedStatusFilter) {
        return false;
      }

      return true;
    });
  }, [accounts, searchQuery, selectedTenantFilter, selectedStatusFilter]);

  // Statistics (Strictly Business Accounts)
  const stats = useMemo(() => {
    return {
      total: accounts.length,
      active: accounts.filter((a) => a.status === 'ACTIVE').length,
      pending: accounts.filter((a) => a.status === 'PENDING_INVITE').length,
      suspended: accounts.filter((a) => a.status === 'SUSPENDED').length,
    };
  }, [accounts]);

  // Create / Update Business Owner Account Handler (Strict 1:1 enforcement)
  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!newAccountForm.ownerName.trim() || !newAccountForm.email.trim()) {
      showToast('Por favor completa todos los campos requeridos');
      return;
    }

    // Defensive check: does this tenant already have an account?
    const alreadyExists = accounts.some((a) => a.tenantId === newAccountForm.tenantId);
    if (alreadyExists) {
      showToast('Este negocio ya cuenta con su usuario asignado. Solo se permite 1 cuenta por negocio.');
      return;
    }

    const assignedTenant = tenantsList.find((t) => t.id === newAccountForm.tenantId);
    const finalPassword = newAccountForm.password.trim() || generateSecurePassword();

    const savedAccount = {
      id: `acc-${newAccountForm.tenantId}`,
      tenantId: newAccountForm.tenantId,
      tenantName: assignedTenant ? assignedTenant.name : 'Empresa Asignada',
      tenantAvatar: assignedTenant ? assignedTenant.avatar : '🏢',
      giro: assignedTenant ? assignedTenant.giro : 'Servicios Profesionales',
      ownerName: newAccountForm.ownerName.trim(),
      email: newAccountForm.email.trim().toLowerCase(),
      tempPassword: finalPassword,
      mustChangePassword: true, // Forces immediate pop-up on first client login
      phone: newAccountForm.phone.trim() || '+52 55 0000 0000',
      status: 'ACTIVE',
      lastLogin: 'Invitación enviada (Listo para ingresar)',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      notes: newAccountForm.notes || 'Cuenta de acceso maestro para el dueño del negocio.',
    };

    setAccounts((prev) => [savedAccount, ...prev]);
    showToast(`Cuenta maestra para ${savedAccount.tenantName} creada exitosamente`);

    setIsCreateModalOpen(false);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C3F400', '#10B981', '#AA8BFB'],
      });
    } catch (err) {}

    // Open share credentials modal immediately for WhatsApp delivery
    setShareCredentialsUser(savedAccount);

    // Reset Form
    setNewAccountForm({
      tenantId: '',
      ownerName: '',
      email: '',
      password: '',
      phone: '',
      notes: '',
    });
  };

  // Toggle Account Status (Suspend / Reactivate)
  const handleToggleAccountStatus = (tenantId) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.tenantId === tenantId) {
          const nextStatus = acc.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          showToast(
            `Acceso para ${acc.tenantName} ${nextStatus === 'ACTIVE' ? 'reactivado' : 'suspendido'}`
          );
          return { ...acc, status: nextStatus };
        }
        return acc;
      })
    );
  };

  // Reset Password Handler (Regenerates temp password and flags mustChangePassword = true)
  const handleResetPasswordSubmit = (tenantId, newPass) => {
    let updatedAcc = null;
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.tenantId === tenantId) {
          updatedAcc = {
            ...acc,
            tempPassword: newPass,
            mustChangePassword: true,
            lastLogin: 'Contraseña provisional restablecida',
          };
          return updatedAcc;
        }
        return acc;
      })
    );
    setResetPasswordModalUser(null);
    showToast('Contraseña provisional asignada. El cliente deberá cambiarla al iniciar sesión.');
    if (updatedAcc) {
      setShareCredentialsUser(updatedAcc);
    }
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
              OPERACIÓN / IDENTIDAD & ACCESOS
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              1 Cuenta Maestra por Negocio (Regla Estricta 1:1)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Cuentas & Accesos de <span className="text-neon">Dueños de Negocio</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 max-w-2xl">
            Administra el correo oficial de acceso y contraseñas provisionales. Exactamente un usuario por empresa con cambio obligatorio de contraseña en su primer ingreso.
          </p>
        </div>

        {/* Action Button: Create / Provision Account (Enforces 1:1 rule) */}
        <button
          type="button"
          onClick={() => {
            if (availableTenantsWithoutAccount.length === 0) {
              setIsLimitNoticeOpen(true);
              return;
            }
            const firstAvailable = availableTenantsWithoutAccount[0];
            setNewAccountForm({
              tenantId: firstAvailable ? firstAvailable.id : '',
              ownerName: '',
              email: '',
              password: generateSecurePassword(),
              phone: '',
              notes: '',
            });
            setIsCreateModalOpen(true);
          }}
          className={`font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${
            availableTenantsWithoutAccount.length === 0
              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/60 hover:border-neon hover:text-white cursor-pointer'
              : 'bg-neon text-black hover:bg-[var(--neon-hover)] shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95'
          }`}
          title={
            availableTenantsWithoutAccount.length === 0
              ? 'Todos los negocios (5/5) ya cuentan con su usuario asignado (Límite 1:1)'
              : 'Asignar cuenta al negocio disponible'
          }
        >
          {availableTenantsWithoutAccount.length === 0 ? (
            <>
              <ShieldCheck className="w-4 h-4 text-neon" />
              <span>Límite 1:1 Cubierto ({accounts.length}/{tenantsList.length})</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-black" />
              <span>+ Asignar Cuenta ({availableTenantsWithoutAccount.length} disp.)</span>
            </>
          )}
        </button>
      </header>

      {/* KPI Stats Bar (Clean 1:1 Business Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
            Negocios con Acceso
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
              {stats.total}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">
              1 cuenta / negocio
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block font-semibold">
            Cuentas Activas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-600 dark:text-emerald-400">
              {stats.active}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">
              Acceso habilitado
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-amber-500 uppercase tracking-wider block font-semibold">
            Por Activar
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-amber-500">
              {stats.pending}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">
              Invitación enviada
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
            Suspendidas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
              {stats.suspended}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-sans">
              Acceso bloqueado
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar: Clean, Search, Active Tenant Shortcut & View Switcher */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por dueño, correo (ej. contacto@odontointegral.com) o negocio..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-main)] font-mono outline-none transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>

        {/* Filters & View Switcher Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Quick Filter: Negocio Activo en Barra Superior */}
          {currentTenant && (
            <button
              type="button"
              onClick={() =>
                setSelectedTenantFilter((prev) =>
                  prev === currentTenant.id ? 'all' : currentTenant.id
                )
              }
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                selectedTenantFilter === currentTenant.id
                  ? 'bg-neon/15 text-neon border-neon/40 shadow-[0_0_10px_rgba(195,244,0,0.2)]'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-white'
              }`}
              title="Filtrar por el negocio seleccionado en la barra superior"
            >
              <span>{currentTenant.avatar}</span>
              <span className="truncate max-w-[120px]">{currentTenant.name}</span>
            </button>
          )}

          {/* Tenant Filter Dropdown */}
          <select
            value={selectedTenantFilter}
            onChange={(e) => setSelectedTenantFilter(e.target.value)}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-neon transition-colors"
          >
            <option value="all">Todas las Empresas ({accounts.length})</option>
            {accounts.map((acc) => (
              <option key={acc.tenantId} value={acc.tenantId}>
                {acc.tenantAvatar} {acc.tenantName}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-neon transition-colors"
          >
            <option value="all">Todos los Estados</option>
            <option value="ACTIVE">Activas</option>
            <option value="PENDING_INVITE">Pendientes de Activación</option>
            <option value="SUSPENDED">Suspendidas</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl font-mono text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-neon text-black font-bold'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
              title="Vista Detallada (Tarjetas)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-neon text-black font-bold'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
              title="Vista Compacta (Tabla Matriz)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedTenantFilter !== 'all' || selectedStatusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTenantFilter('all');
                setSelectedStatusFilter('all');
              }}
              className="text-[11px] font-mono text-neon hover:underline px-2 py-1"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Accounts List (Cards or Table) */}
      {filteredAccounts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-3 font-sans">
          <Building2 className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
          <h4 className="text-base font-bold text-[var(--text-main)]">
            No se encontraron cuentas con los filtros seleccionados
          </h4>
          <p className="text-xs text-[var(--text-muted)] font-mono max-w-md mx-auto">
            Intenta cambiar la búsqueda o restablecer los filtros para ver las cuentas de los negocios.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* VISTA TABLA COMPACTA */
        <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-hidden shadow-sm font-sans animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6 font-bold">Empresa / Negocio</th>
                  <th className="py-3 px-4 font-bold">Dueño & Contacto</th>
                  <th className="py-3 px-4 font-bold">Clave Provisional (Blindada)</th>
                  <th className="py-3 px-4 font-bold">Estado</th>
                  <th className="py-3 px-4 font-bold">Último Acceso</th>
                  <th className="py-3 px-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredAccounts.map((account) => {
                  const isCurrentTenant = currentTenant?.id === account.tenantId;
                  const isSuspended = account.status === 'SUSPENDED';
                  const isPending = account.status === 'PENDING_INVITE';
                  const isPassVisible = !!visiblePasswords[account.tenantId];

                  return (
                    <tr
                      key={account.tenantId}
                      className={`hover:bg-[var(--bg-card)]/50 transition-colors ${
                        isCurrentTenant ? 'bg-neon/[0.04]' : isSuspended ? 'bg-red-950/15' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-[var(--text-main)]">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0">{account.tenantAvatar}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-heading font-black">{account.tenantName}</span>
                              {isCurrentTenant && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neon/15 text-neon border border-neon/30 font-bold">
                                  Activo
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] font-normal">{account.giro}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[var(--text-main)]">{account.ownerName}</div>
                        <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                          <span>{account.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(account.email, `tbl-mail-${account.tenantId}`)}
                            className="text-[var(--text-muted)] hover:text-neon"
                            title="Copiar correo"
                          >
                            {copiedField === `tbl-mail-${account.tenantId}` ? (
                              <Check className="w-3 h-3 text-neon" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-neon bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700/50">
                            {isPassVisible ? account.tempPassword : '••••••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(account.tenantId)}
                            className="text-[var(--text-muted)] hover:text-white p-1"
                            title={isPassVisible ? 'Ocultar contraseña' : 'Ver contraseña'}
                          >
                            {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(account.tempPassword, `tbl-pass-${account.tenantId}`)}
                            className="text-[var(--text-muted)] hover:text-neon p-1"
                            title="Copiar contraseña"
                          >
                            {copiedField === `tbl-pass-${account.tenantId}` ? (
                              <Check className="w-3 h-3 text-neon" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="mt-1">
                          {account.mustChangePassword ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                              <KeyRound className="w-2.5 h-2.5" /> Clave Provisional
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <Check className="w-2.5 h-2.5" /> Clave Definitiva
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                            Suspendida
                          </span>
                        ) : isPending ? (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Por Activar
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Activa
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                        {account.lastLogin}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSendWhatsApp(account)}
                            className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                            title="Despachar credenciales por WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShareCredentialsUser(account)}
                            className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-neon border border-[var(--border-color)]"
                            title="Ver ficha de acceso"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setResetPasswordModalUser(account)}
                            className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-amber-400 border border-[var(--border-color)]"
                            title="Cambiar contraseña"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAccountStatus(account.tenantId)}
                            className={`p-1.5 rounded-lg border ${
                              isSuspended
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-red-400 border-[var(--border-color)]'
                            }`}
                            title={isSuspended ? 'Reactivar acceso' : 'Suspender acceso'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VISTA TARJETAS DETALLADAS */
        <div className="space-y-3 font-sans animate-fade-in">
          {filteredAccounts.map((account) => {
            const isSuspended = account.status === 'SUSPENDED';
            const isPending = account.status === 'PENDING_INVITE';
            const isCurrentTenant = currentTenant?.id === account.tenantId;
            const isPassVisible = !!visiblePasswords[account.tenantId];

            return (
              <div
                key={account.tenantId}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                  isCurrentTenant
                    ? 'border-neon/60 bg-[var(--bg-panel)] shadow-[0_0_20px_rgba(195,244,0,0.12)] ring-1 ring-neon/30'
                    : isSuspended
                    ? 'bg-red-950/10 border-red-900/30 opacity-75'
                    : 'bg-[var(--bg-panel)] border-[var(--border-color)] hover:border-neon/50 shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Business & Owner Identity */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-[280px]">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:border-neon/50 transition-colors">
                      {account.tenantAvatar}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)] truncate">
                          {account.tenantName}
                        </h3>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Dueño de Negocio
                        </span>
                        {isCurrentTenant && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-neon/20 text-neon border border-neon/40 flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-neon" /> Negocio Activo en Barra
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Por Activar
                          </span>
                        )}
                        {isSuspended && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                            Acceso Suspendido
                          </span>
                        )}
                      </div>

                      {/* Owner Person Name */}
                      <p className="text-xs font-semibold text-[var(--text-main)]">
                        {account.ownerName}
                        <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1.5 font-mono">
                          • Giro: {account.giro}
                        </span>
                      </p>

                      {/* Email and Phone */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs pt-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span className="text-[var(--text-muted)] hover:text-white transition-colors">
                            {account.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(account.email, `email-${account.tenantId}`)}
                            className="text-[var(--text-muted)] hover:text-neon p-0.5 transition-colors"
                            title="Copiar correo de acceso"
                          >
                            {copiedField === `email-${account.tenantId}` ? (
                              <Check className="w-3 h-3 text-neon" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                          <Phone className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span>{account.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Temporary Password Block (Masked with Eye button) */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-xs space-y-2 min-w-[270px]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] font-medium">Contraseña Provisional:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(account.tenantId)}
                          className="text-[10px] text-[var(--text-muted)] hover:text-white flex items-center gap-1"
                          title={isPassVisible ? 'Ocultar' : 'Mostrar'}
                        >
                          {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isPassVisible ? 'Ocultar' : 'Ver'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(account.tempPassword, `pass-${account.tenantId}`)}
                          className="text-[10px] text-neon hover:underline font-bold flex items-center gap-1"
                        >
                          {copiedField === `pass-${account.tenantId}` ? (
                            <>
                              <Check className="w-3 h-3 text-neon" />
                              <span>Copiada</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-900 text-neon px-3 py-1.5 rounded-lg border border-zinc-700/50 shadow-inner">
                      <span className="font-mono font-bold tracking-wider">
                        {isPassVisible ? account.tempPassword : '••••••••••••'}
                      </span>
                      {account.mustChangePassword ? (
                        <span className="text-[9px] text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                          <KeyRound className="w-2.5 h-2.5" /> Clave Provisional
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" /> Clave Definitiva
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between pt-0.5 border-t border-[var(--border-color)]">
                      <span>Último acceso:</span>
                      <span className="font-medium text-[var(--text-main)] truncate max-w-[180px]">
                        {account.lastLogin}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Action Buttons with 1-Click WhatsApp */}
                  <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                    {/* 1-Click WhatsApp Direct Dispatch */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(account)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm flex items-center gap-1.5 min-h-[44px]"
                      title="Enviar credenciales directamente a su WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold">WhatsApp</span>
                    </button>

                    {/* Share/Send Credentials */}
                    <button
                      type="button"
                      onClick={() => setShareCredentialsUser(account)}
                      className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-muted)] hover:text-neon transition-all shadow-sm flex items-center gap-1.5 min-h-[44px]"
                      title="Ver ficha de credenciales para enviar al cliente"
                    >
                      <Share2 className="w-3.5 h-3.5 text-neon" />
                      <span className="hidden sm:inline font-bold">Ficha</span>
                    </button>

                    {/* Reset Password */}
                    <button
                      type="button"
                      onClick={() => setResetPasswordModalUser(account)}
                      className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-400 text-[var(--text-muted)] hover:text-amber-400 transition-all shadow-sm flex items-center gap-1.5 min-h-[44px]"
                      title="Cambiar o regenerar contraseña de este negocio"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Clave</span>
                    </button>

                    {/* Toggle Active / Suspend */}
                    <button
                      type="button"
                      onClick={() => handleToggleAccountStatus(account.tenantId)}
                      className={`px-3 py-2 rounded-xl border transition-all shadow-sm flex items-center gap-1.5 min-h-[44px] ${
                        isSuspended
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-red-400 text-[var(--text-muted)] hover:text-red-400'
                      }`}
                      title={isSuspended ? 'Reactivar acceso' : 'Suspender acceso temporalmente'}
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
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: ASIGNAR / EDITAR CUENTA DE DUEÑO DE NEGOCIO                */}
      {/* =================================================================== */}
      {isCreateModalOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="relative w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-neon/15 text-neon border border-neon/30">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                      Asignar Cuenta de Dueño de Negocio
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      1 cuenta de acceso por empresa (Multi-Tenant)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveAccount} className="space-y-4 font-mono text-xs">
                {/* Empresa Asignada */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                    Negocio / Empresa Asignada *
                  </label>
                  <select
                    value={newAccountForm.tenantId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setNewAccountForm({
                        ...newAccountForm,
                        tenantId: selectedId,
                      });
                    }}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono outline-none cursor-pointer"
                  >
                    {availableTenantsWithoutAccount.length === 0 ? (
                      <option value="">No hay negocios sin cuenta (Límite 1:1 alcanzado)</option>
                    ) : (
                      availableTenantsWithoutAccount.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.avatar} {t.name} ({t.giro}) — [Disponible]
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">
                    Regla 1:1 estricta: Solo se listan empresas que aún no tienen usuario asignado.
                  </p>
                </div>

                {/* Nombre del Dueño */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                    Nombre Completo del Dueño / Director *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccountForm.ownerName}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, ownerName: e.target.value })}
                    placeholder="ej. Dra. Patricia Morales"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl p-2.5 text-xs text-[var(--text-main)] font-sans outline-none"
                  />
                </div>

                {/* Correo de Acceso */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                    Correo Electrónico de Acceso (Usuario) *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAccountForm.email}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, email: e.target.value })}
                    placeholder="ej. contacto@odontointegral.com"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono outline-none"
                  />
                </div>

                {/* Teléfono WhatsApp */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                    Teléfono / WhatsApp de Contacto
                  </label>
                  <input
                    type="text"
                    value={newAccountForm.phone}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, phone: e.target.value })}
                    placeholder="ej. +52 55 4912 3456"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono outline-none"
                  />
                </div>

                {/* Contraseña Provisional */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[var(--text-main)] font-bold font-sans text-xs">
                      Contraseña Provisional de Acceso *
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] text-neon hover:underline font-bold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generar Segura</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newAccountForm.password}
                      onChange={(e) => setNewAccountForm({ ...newAccountForm, password: e.target.value })}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-3 pr-10 py-2.5 text-xs text-[var(--text-main)] font-mono font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Aviso: Cambio Obligatorio al Entrar */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300">
                  <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-400 block font-sans">
                      Contraseña Provisional con Pop-up Obligatorio
                    </span>
                    <span className="text-[10px] text-zinc-300 block font-sans leading-relaxed">
                      Al iniciar sesión por primera vez con esta clave, el sistema le desplegará automáticamente al cliente el pop-up de cambio obligatorio para que defina su contraseña personal definitiva.
                    </span>
                  </div>
                </div>

                {/* Rol Fijo: Dueño de Negocio (Informativo, sin selector superfluo) */}
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-emerald-500/30 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-[var(--text-main)] block font-sans">
                      Rol: Dueño de Negocio (Cliente Final)
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                      Acceso exclusivo al panel de su empresa, métricas comerciales, agenda y micro-landing.
                    </span>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95"
                  >
                    <Check className="w-4 h-4 text-black" />
                    <span>Guardar Cuenta & Generar Ficha</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: FICHA DE ACCESO PARA ENVIAR POR WHATSAPP O CORREO          */}
      {/* =================================================================== */}
      {shareCredentialsUser && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="relative w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-black text-[var(--text-main)]">
                      Ficha de Acceso al Panel
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">
                      Listo para enviar al cliente por WhatsApp o correo.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShareCredentialsUser(null)}
                  className="p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Shareable Card Content */}
              <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] font-mono text-xs space-y-3">
                <div className="text-neon font-bold text-xs">
                  👋 Hola {shareCredentialsUser.ownerName},
                </div>
                <p className="text-[var(--text-muted)] font-sans text-xs leading-relaxed">
                  Aquí tienes tus credenciales maestras para ingresar al panel de control de{' '}
                  <strong className="text-white font-bold">{shareCredentialsUser.tenantName}</strong>:
                </p>

                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">🔗 Enlace:</span>
                    <span className="font-bold text-white">http://localhost:3000/login</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">✉️ Usuario:</span>
                    <span className="font-bold text-neon">{shareCredentialsUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">🔑 Contraseña:</span>
                    <span className="font-bold text-white tracking-wider">{shareCredentialsUser.tempPassword}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] font-sans flex items-center gap-1.5 pt-1">
                  <span>💡</span>
                  <span>Te recomendamos cambiar tu contraseña temporal una vez dentro de la plataforma.</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShareCredentialsUser(null)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-white"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const message = `👋 Hola ${shareCredentialsUser.ownerName},\n\nAquí tienes tus credenciales para ingresar al panel de control de ${shareCredentialsUser.tenantName}:\n\n🔗 Enlace: http://localhost:3000/login\n📧 Usuario: ${shareCredentialsUser.email}\n🔑 Contraseña: ${shareCredentialsUser.tempPassword}\n\n¡Bienvenido a Vector Community!`;
                    handleCopy(message, 'whatsapp-msg');
                  }}
                  className="px-4 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Mensaje Completo</span>
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: RESTABLECER CONTRASEÑA PROVISIONAL                         */}
      {/* =================================================================== */}
      {resetPasswordModalUser && (
        <ResetPasswordModal
          user={resetPasswordModalUser}
          onClose={() => setResetPasswordModalUser(null)}
          onSubmit={handleResetPasswordSubmit}
        />
      )}

      {/* =================================================================== */}
      {/* MODAL 4: AVISO LÍMITE 1:1 DE NEGOCIOS ALCANZADO                     */}
      {/* =================================================================== */}
      {isLimitNoticeOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="relative w-full max-w-md bg-[var(--bg-panel)] border border-neon/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl animate-scale-up">
              <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-neon/15 text-neon border border-neon/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-black text-[var(--text-main)]">
                      Límite 1:1 Cubierto ({accounts.length}/{tenantsList.length} Negocios)
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">
                      Exactamente 1 cuenta maestra por empresa
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLimitNoticeOpen(false)}
                  className="p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] font-sans text-xs space-y-2 text-[var(--text-muted)] leading-relaxed">
                <p>
                  Todos los negocios registrados en la plataforma ({accounts.length}/{tenantsList.length}) ya cuentan con su usuario maestro oficial asignado.
                </p>
                <p>
                  La arquitectura de seguridad de Vector Inside establece estrictamente <strong className="text-white">1 usuario por negocio</strong> para garantizar aislamiento de datos (Multi-Tenant) y evitar cuentas duplicadas o huérfanas.
                </p>
                <div className="p-2.5 rounded-xl bg-neon/10 border border-neon/30 text-neon font-mono text-[11px] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-neon" />
                  <span>Para actualizar credenciales o emitir una contraseña temporal, usa el botón <strong>"Clave"</strong> en la tarjeta del negocio.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLimitNoticeOpen(false)}
                  className="px-5 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all shadow-sm"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

// Mini-component for Reset Password Modal
const ResetPasswordModal = ({ user, onClose, onSubmit }) => {
  const [newPass, setNewPass] = useState('');
  const [show, setShow] = useState(false);

  const handleGenerate = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let p = 'VecPass#';
    for (let i = 0; i < 4; i++) {
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPass(p);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
        <div className="relative w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4 shadow-2xl animate-scale-up">
          <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-heading font-black text-[var(--text-main)]">
                  Restablecer Clave Provisional
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  {user.tenantName} ({user.email})
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

          <div className="space-y-3 font-mono text-xs">
            {/* Notice regarding provisional password and mandatory pop-up */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-sans space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Activación de Pop-up Obligatorio</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Esta contraseña es <strong className="text-white">provisional</strong>. En cuanto el cliente inicie sesión en la plataforma, el sistema le desplegará automáticamente el pop-up de cambio obligatorio para que defina su clave personal definitiva.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[var(--text-main)] font-bold">Nueva Contraseña Provisional:</label>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-[10px] text-neon hover:underline font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generar otra</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-3 pr-10 py-2.5 text-xs text-[var(--text-main)] font-mono font-bold outline-none"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-white"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[10px] text-[var(--text-muted)]">
              Al guardar, la contraseña anterior quedará invalidada de inmediato.
            </p>
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
              type="button"
              onClick={() => onSubmit(user.tenantId, newPass)}
              className="px-4 py-2 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar & Notificar</span>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
