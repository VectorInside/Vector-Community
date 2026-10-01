'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Check, Building2, Lock, Search, Sparkles } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export const TenantSwitcher = () => {
  const { tenants, activeTenantId, activeTenant, setActiveTenantId } = useTenant();
  const { permissions, isClientReadOnly } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.verticalLabel.toLowerCase().includes(search.toLowerCase())
  );

  const getVerticalBadge = (vertical) => {
    if (vertical === 'hospitality') return <Badge variant="warning" size="xs">Hospitality</Badge>;
    if (vertical === 'service_appointments') return <Badge variant="info" size="xs">Servicios</Badge>;
    if (vertical === 'ecommerce') return <Badge variant="purple" size="xs">E-Commerce</Badge>;
    return <Badge variant="default" size="xs">{vertical}</Badge>;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={!permissions.canSwitchTenant}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3.5 py-2 rounded-xl bg-dark-surface border transition-all text-left ${
          isOpen
            ? 'border-brand-primary ring-1 ring-brand-primary/30 shadow-neon-sm'
            : 'border-dark-border hover:border-zinc-700'
        } ${!permissions.canSwitchTenant ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-elevated text-lg border border-dark-border shrink-0">
          {activeTenant?.avatar || '🏢'}
        </div>

        <div className="min-w-[140px] max-w-[200px]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white truncate block">
              {activeTenant?.shortName || activeTenant?.name || 'Seleccionar Marca'}
            </span>
            {isClientReadOnly && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
          </div>
          <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 truncate">
            <span className="text-brand-primary font-semibold">ROAS {activeTenant?.monthlyRoas}</span>
            <span>•</span>
            <span className="truncate">{activeTenant?.verticalLabel?.split('/')[0]}</span>
          </p>
        </div>

        {permissions.canSwitchTenant && (
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform ml-auto ${
              isOpen ? 'rotate-180 text-brand-primary' : ''
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && permissions.canSwitchTenant && (
        <div className="absolute top-full left-0 mt-2 w-80 rounded-xl bg-dark-surface border border-dark-border shadow-2xl p-2 z-50 animate-scaleUp">
          <div className="p-2 pb-3 border-b border-dark-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Multi-Tenant Switcher
              </span>
              <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-mono px-2 py-0.5 rounded border border-brand-primary/20">
                {tenants.length} Marcas Activas
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente o vertical..."
                className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto py-1 space-y-1">
            {filteredTenants.map((t) => {
              const isSelected = t.id === activeTenantId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTenantId(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-dark-elevated border border-brand-primary/40 text-white shadow-sm'
                      : 'hover:bg-dark-elevated/60 text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{t.avatar}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {t.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getVerticalBadge(t.vertical)}
                        <span className="text-[10px] text-zinc-400 font-mono">
                          ID: {t.id.slice(-7)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-2 pt-2.5 border-t border-dark-border mt-1 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Inyección de Header: <code className="text-brand-primary">X-Tenant-ID</code></span>
          </div>
        </div>
      )}
    </div>
  );
};
