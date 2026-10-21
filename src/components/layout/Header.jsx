'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  LogOut,
  ChevronDown,
  Search,
  Plus,
  Check,
  X,
  Power,
  Sparkles,
} from 'lucide-react';

export const Header = () => {
  const router = useRouter();
  const {
    role,
    isAdmin,
    activeTenantKey,
    activeTenant,
    switchTenantContext,
    tenantsData,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const popoverRef = useRef(null);

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

  // Filtered tenants by search query
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
    <header className="w-full bg-[var(--bg-panel)] border-b border-[var(--border-color)] px-4 sm:px-6 py-2.5 flex items-center justify-between z-40 shrink-0">
      <div className="flex items-center gap-3 relative" ref={popoverRef}>
        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline">
          Negocio Activo:
        </span>

        {isAdmin ? (
          <div className="relative">
            {/* Searchable Workspace Switcher Trigger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-base)] border text-xs font-mono font-bold transition-all ${
                isOpen
                  ? 'border-neon ring-1 ring-neon/40 shadow-[0_0_15px_var(--neon-glow)] text-white'
                  : 'border-[var(--border-color)] hover:border-neon text-[var(--text-main)] hover:shadow-sm'
              }`}
            >
              <span className="text-base leading-none">{activeTenant?.avatar || '🏢'}</span>
              <span className="max-w-[140px] sm:max-w-[210px] truncate text-white">
                {activeTenant?.name || 'Seleccionar Negocio'}
              </span>
              <span className="hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
                {activeTenant?.giro?.split(',')[0]?.split('&')[0]?.trim() || 'Tenant'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-neon' : ''
                }`}
              />
            </button>

            {/* Searchable Dropdown Popover */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-950 border border-neon/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 p-3 space-y-2.5 animate-fade-in">
                {/* Search Bar inside Popover */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar entre tus negocios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 focus:border-neon rounded-xl pl-8 pr-7 py-1.5 text-xs text-white font-mono placeholder-zinc-500 outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* List Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
                  <span>Negocios ({filteredTenants.length})</span>
                  <span>Estado IA</span>
                </div>

                {/* Scrollable Businesses List */}
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
                            ? 'bg-neon/15 text-white font-bold border border-neon/40 shadow-sm'
                            : 'text-zinc-300 hover:bg-zinc-900 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base shrink-0">{t.avatar || '🏢'}</span>
                          <div className="truncate">
                            <p className="truncate font-sans font-bold text-white text-xs">{t.name}</p>
                            <span className="text-[10px] text-zinc-400 block truncate font-mono">
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

                          {isSelected && <Check className="w-4 h-4 text-neon shrink-0" />}
                        </div>
                      </button>
                    );
                  })}

                  {filteredTenants.length === 0 && (
                    <div className="p-4 text-center text-xs font-mono text-zinc-500">
                      No se encontró ningún negocio con "{searchQuery}"
                    </div>
                  )}
                </div>

                {/* Popover Footer: Quick Add New Business */}
                <div className="pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={handleCreateNewTenant}
                    className="w-full py-2 rounded-xl bg-neon text-black font-mono font-black text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-[var(--neon-hover)] transition-all shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Alta Nuevo Negocio</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[var(--bg-base)] border border-neon text-xs font-bold text-[var(--text-main)] shadow-[0_0_8px_var(--neon-glow)]">
            <span>{activeTenant?.avatar}</span>
            <span>{activeTenant?.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Meta CAPI Sync Indicator */}
        <span className="text-[10px] font-mono bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 px-3 py-1.5 rounded flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Meta CAPI Sincronizado
        </span>

        {/* Role Pill */}
        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hidden md:inline">
          {isAdmin ? 'ADMIN AGENCIA' : 'CLIENTE FINAL'}
        </span>

        {/* Salir / Login Link */}
        <button
          type="button"
          onClick={() => router.push('/login')}
          title="Cerrar Sesión"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-card)] hover:bg-rose-500/10 border border-[var(--border-color)] hover:border-rose-500/40 text-xs font-mono text-[var(--text-muted)] hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};
