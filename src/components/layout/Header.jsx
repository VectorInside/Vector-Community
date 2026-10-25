'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  Building2,
  LogOut,
  ChevronDown,
  Search,
  Plus,
  Check,
  X,
  Sun,
  Moon,
  Bell,
  Sparkles,
  Menu,
  ArrowRight,
} from 'lucide-react';
import { findModuleByPath } from '@/utils/modulesRegistry';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    role,
    isAdmin,
    activeTenantKey,
    activeTenant,
    switchTenantContext,
    tenantsData,
    theme,
    toggleTheme,
    toggleMobileSidebar,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const popoverRef = useRef(null);

  // Cross-Tenant Notifications Center
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all'); // 'all' | 'unread'
  const notifRef = useRef(null);

  const INITIAL_CROSS_TENANT_NOTIFICATIONS = [
    {
      id: 'notif-pol-01',
      tenantKey: 'polanco',
      tenantName: 'Polanco Steakhouse',
      tenantAvatar: '🥩',
      channel: 'WhatsApp',
      channelColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      title: 'Reserva VIP Terraza (4 personas)',
      sender: 'Alejandro Bastida',
      snippet: 'Hola! Queremos reservar hoy a las 9pm en terraza para 4 personas, festejo de aniversario.',
      time: 'Hace 3 min',
      slaRemaining: 5,
      threadId: 'pol-001',
      isRead: false,
    },
    {
      id: 'notif-dent-01',
      tenantKey: 'dental',
      tenantName: 'Odontología Integral',
      tenantAvatar: '🦷',
      channel: 'Instagram DM',
      channelColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
      title: 'Valoración Implante Molar 3D',
      sender: 'Dra. Mariana Solares',
      snippet: 'Buenas tardes, me urge cita para valorar un implante con anestesia sin dolor.',
      time: 'Hace 8 min',
      slaRemaining: 8,
      threadId: 'dent-002',
      isRead: false,
    },
    {
      id: 'notif-urb-01',
      tenantKey: 'urban',
      tenantName: 'Urban Sneaks',
      tenantAvatar: '👟',
      channel: 'WhatsApp',
      channelColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      title: 'Legit Check & Talla 27.5mx',
      sender: 'Kevin Almonte',
      snippet: 'Tienen disponible el Jordan 1 Retro High en 27.5mx? Es 100% original con factura?',
      time: 'Hace 14 min',
      slaRemaining: 12,
      threadId: 'urb-001',
      isRead: false,
    },
    {
      id: 'notif-corp-01',
      tenantKey: 'corp',
      tenantName: 'Vector Enterprise',
      tenantAvatar: '🏢',
      channel: 'Facebook Messenger',
      channelColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      title: 'Auditoría Fuga de Leads B2B',
      sender: 'Ing. Fernando Arteaga',
      snippet: 'Quisiéramos agendar la sesión de diagnóstico técnico con un Arquitecto Senior.',
      time: 'Hace 22 min',
      slaRemaining: 18,
      threadId: 'corp-001',
      isRead: true,
    },
  ];

  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vector_global_notifications');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_CROSS_TENANT_NOTIFICATIONS;
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (notifFilter === 'unread') return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [notifications, notifFilter]);

  const handleSelectNotification = (notif) => {
    // 1. Mark notification as read
    const updated = notifications.map((n) =>
      n.id === notif.id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vector_global_notifications', JSON.stringify(updated));
      } catch (e) {}
    }

    // 2. Switch Tenant Context
    switchTenantContext(notif.tenantKey);

    // 3. Close popover and jump to inbox thread
    setIsNotifOpen(false);
    router.push(`/inbox?threadId=${notif.threadId}`);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vector_global_notifications', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const activeModule = findModuleByPath(pathname);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tenantsList = useMemo(() => Object.values(tenantsData || {}), [tenantsData]);

  const filteredTenants = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return tenantsList;
    return tenantsList.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.giro?.toLowerCase().includes(q) ||
        t.shortName?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q)
    );
  }, [tenantsList, searchQuery]);

  const handleSelectTenant = (tenantId) => {
    switchTenantContext(tenantId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCreateNewTenant = () => {
    setIsOpen(false);
    setSearchQuery('');
    router.push('/config?tab=rag&mode=wizard');
  };

  return (
    <header className="w-full bg-[var(--bg-panel)] border-b border-[var(--border-color)] px-3 sm:px-6 py-2.5 flex flex-col gap-1.5 z-40 shrink-0 select-none">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* Left Section: Mobile Menu + Breadcrumb + Business Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 relative min-w-0" ref={popoverRef}>
          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="p-1.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-lime-400 lg:hidden flex items-center justify-center shrink-0 transition-colors"
            aria-label="Abrir menú de navegación"
            title="Abrir menú"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Dynamic Breadcrumb from UX/UI Taxonomy */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono min-w-0">
            <span className="uppercase text-[10px] tracking-wider font-semibold truncate">
              {activeModule ? activeModule.pillarTitle : 'Operación'}
            </span>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-main)] font-bold font-sans truncate">
              {activeModule ? activeModule.label : 'Centro de Mando'}
            </span>
          </div>

          <span className="text-[var(--border-color)] hidden md:inline">|</span>

          {/* Multi-Tenant Switcher (Guarda inviolable de RLS en Backend) */}
          {isAdmin ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[var(--bg-base)] border text-xs font-mono font-bold transition-all ${
                  isOpen
                    ? 'border-lime-400 ring-1 ring-lime-400/40 shadow-sm text-[var(--text-main)]'
                    : 'border-[var(--border-color)] hover:border-lime-400 text-[var(--text-main)]'
                }`}
                title="Cambiar espacio de negocio"
              >
                <span className="text-sm leading-none">{activeTenant?.avatar || '🏢'}</span>
                <span className="max-w-[120px] sm:max-w-[170px] truncate text-[var(--text-main)] font-semibold">
                  {activeTenant?.name || 'Seleccionar Negocio'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-lime-400' : ''
                  }`}
                />
              </button>

              {/* Dropdown Popover */}
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-2xl z-50 p-3 space-y-2.5 animate-scale-up">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Buscar entre tus negocios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] focus:border-lime-400 rounded-xl pl-8 pr-7 py-1.5 text-xs text-[var(--text-main)] font-mono placeholder-[var(--text-muted)] outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] px-1 font-bold">
                    <span>Negocios Registrados ({filteredTenants.length})</span>
                    <span>Estado IA</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredTenants.map((t) => {
                      const isSelected = activeTenantKey === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectTenant(t.id)}
                          className={`w-full text-left p-2 rounded-xl text-xs font-mono flex items-center justify-between gap-2 transition-all ${
                            isSelected
                              ? 'bg-lime-400/15 text-[var(--text-main)] font-bold border border-lime-400/40 shadow-sm'
                              : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-main)] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-base shrink-0">{t.avatar || '🏢'}</span>
                            <div className="truncate">
                              <p className="truncate font-sans font-bold text-[var(--text-main)] text-xs">{t.name}</p>
                              <span className="text-[10px] text-[var(--text-muted)] block truncate font-mono">
                                {t.giro}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {t.isAiActive ? (
                              <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="hidden sm:inline">IA</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[9px] text-red-400 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                <span className="hidden sm:inline">PAUSA</span>
                              </span>
                            )}

                            {isSelected && <Check className="w-4 h-4 text-lime-400 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={handleCreateNewTenant}
                      className="w-full py-2 rounded-xl bg-lime-400 text-black font-mono font-black text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-lime-300 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Alta Nuevo Negocio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)]">
              <span>{activeTenant?.avatar}</span>
              <span className="truncate max-w-[140px]">{activeTenant?.name}</span>
            </div>
          )}
        </div>

        {/* Right Section: Search / Theme / Status / Role / Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Trigger with Command K */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">Buscar contacto, campaña...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[9px] font-mono font-bold text-[var(--text-faint)]">
              ⌘ K
            </kbd>
          </div>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            className="p-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cross-Tenant Notification Bell with Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              title={`${unreadCount} notificaciones sin atender`}
              className={`p-2 rounded-xl bg-[var(--bg-base)] border transition-all relative ${
                isNotifOpen
                  ? 'border-lime-400 ring-1 ring-lime-400/40 text-lime-400 shadow-sm'
                  : 'border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-mono font-black bg-lime-400 text-black flex items-center justify-center shadow-[0_0_8px_rgba(200,255,0,0.5)] animate-pulse">
                  {unreadCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-2xl z-50 p-3 space-y-2.5 animate-scale-up">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-lime-400/10 text-lime-400 border border-lime-400/20">
                      <Bell className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-heading font-black text-[var(--text-main)] uppercase tracking-wider">
                      Centro de Notificaciones
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-mono text-[var(--text-muted)] hover:text-lime-400 transition-colors"
                      >
                        Marcar leídas
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setNotifFilter('all')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      notifFilter === 'all'
                        ? 'bg-lime-400 text-black'
                        : 'bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Todas ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifFilter('unread')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      notifFilter === 'unread'
                        ? 'bg-lime-400 text-black'
                        : 'bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Sin leer ({unreadCount})
                  </button>
                  <span className="text-[10px] font-mono text-[var(--text-faint)] ml-auto">
                    Cross-Tenant
                  </span>
                </div>

                {/* Notifications List */}
                <div className="max-h-72 overflow-y-auto space-y-1.5 custom-scrollbar pr-0.5 divide-y divide-[var(--border-color)]/50">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[var(--text-muted)] font-mono">
                      No hay notificaciones pendientes.
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <button
                        key={notif.id}
                        type="button"
                        onClick={() => handleSelectNotification(notif)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 pt-2.5 ${
                          notif.isRead
                            ? 'hover:bg-[var(--bg-card)]/50 opacity-75'
                            : 'bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card)] border border-lime-400/20'
                        }`}
                      >
                        {/* Tenant Avatar */}
                        <div className="w-8 h-8 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center text-base shrink-0 mt-0.5">
                          {notif.tenantAvatar}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono font-bold text-lime-400 truncate">
                              {notif.tenantName}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--text-faint)] shrink-0">
                              {notif.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold border ${notif.channelColor}`}>
                              {notif.channel}
                            </span>
                            <h5 className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                              {notif.sender}: {notif.title}
                            </h5>
                          </div>

                          <p className="text-[11px] text-[var(--text-muted)] font-sans truncate leading-tight">
                            "{notif.snippet}"
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[9px] font-mono">
                            <span className="text-amber-400 font-bold">
                              ⏳ {notif.slaRemaining} min SLA
                            </span>
                            <span className="text-[var(--text-faint)] hover:text-lime-400 flex items-center gap-0.5 font-bold">
                              <span>Atender lead</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer Quick Action */}
                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">
                    Espacio actual: <strong className="text-[var(--text-main)]">{activeTenant?.shortName || activeTenant?.name}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(false);
                      router.push('/inbox');
                    }}
                    className="text-[10px] font-mono font-bold text-lime-400 hover:underline flex items-center gap-1"
                  >
                    <span>Ir a Bandeja</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Avatar */}
          <div
            title={`Perfil actual: ${role === 'admin' ? 'Administrador' : 'Usuario'}`}
            className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center font-mono font-black text-xs text-lime-400 shrink-0"
          >
            {role === 'admin' ? 'VI' : 'CL'}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={() => router.push('/login')}
            title="Cerrar Sesión"
            className="p-2 rounded-xl bg-[var(--bg-base)] hover:bg-rose-500/10 border border-[var(--border-color)] hover:border-rose-500/40 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Status Bar - UX/UI Principle: Never simulate fake real success */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)] pt-1 border-t border-[var(--border-color)]/60">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          <span className="text-[var(--text-muted)] font-semibold">PROTOTIPO OPERATIVO</span>
          <span className="hidden sm:inline">· Datos demostrativos de Vector Inside</span>
        </div>
        <div className="text-[var(--text-faint)]">
          MXN · Ciudad de México
        </div>
      </div>
    </header>
  );
};
