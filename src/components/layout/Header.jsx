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
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const popoverRef = useRef(null);

  const activeModule = findModuleByPath(pathname);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
    <header className="w-full bg-[var(--bg-panel)] border-b border-[var(--border-color)] px-4 sm:px-6 py-2.5 flex flex-col gap-1.5 z-40 shrink-0 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Breadcrumb + Business Switcher */}
        <div className="flex items-center gap-3 relative" ref={popoverRef}>
          {/* Dynamic Breadcrumb from UX/UI Taxonomy */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
            <span className="uppercase text-[10px] tracking-wider font-semibold">
              {activeModule ? activeModule.pillarTitle : 'Operación'}
            </span>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-main)] font-bold font-sans">
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
                title="Cambiar espacio de negocio (Aislamiento RLS)"
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

          {/* Notification / Bell with dot */}
          <button
            type="button"
            onClick={() => router.push('/inbox')}
            title="3 mensajes pendientes de respuesta"
            className="p-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          </button>

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
