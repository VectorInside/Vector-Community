'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/hooks/useTenant';
import { TenantSwitcher } from './TenantSwitcher';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { USER_ROLES } from '@/utils/constants';
import {
  LogOut,
  ShieldCheck,
  User,
  ChevronDown,
  Sparkles,
  Zap,
  Layers,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const Header = () => {
  const { user, logout, switchUserRole, isSuperAdmin, isCommunityManager, isClientReadOnly } = useAuth();
  const { activeTenant } = useTenant();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN_AGENCY:
        return <Badge variant="neon" size="xs">SUPER ADMIN</Badge>;
      case USER_ROLES.COMMUNITY_MANAGER:
        return <Badge variant="warning" size="xs">AGENCY CM</Badge>;
      case USER_ROLES.CLIENT_READ_ONLY:
        return <Badge variant="info" size="xs">CLIENT ONLY</Badge>;
      default:
        return <Badge variant="default" size="xs">{role}</Badge>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-dark-base/90 backdrop-blur-xl border-b border-dark-border">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo & Tenant Switcher */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group focus:outline-none">
            {/* Vector Inside Neon Emblem */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-dark-surface border border-dark-border group-hover:border-brand-primary/50 group-hover:shadow-neon transition-all">
              <svg className="h-6 w-6" viewBox="0 0 44 44" fill="none">
                <path d="M12 16L22 34L32 16" stroke="#D4FF00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 20L22 29L27 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                <circle cx="22" cy="14" r="2.5" fill="#D4FF00" />
              </svg>
            </div>

            <div className="hidden md:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-wider text-white">VECTOR</span>
                <span className="text-sm font-black tracking-wider text-brand-primary">INSIDE</span>
              </div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase font-mono">
                La Puerta Trasera
              </span>
            </div>
          </Link>

          <div className="h-6 w-[1px] bg-dark-border hidden md:block" />

          {/* Tenant Switcher */}
          <TenantSwitcher />
        </div>

        {/* Right Side: Connection Status, Role Switcher Quick Pill, User Profile & Logout */}
        <div className="flex items-center gap-3.5">
          {/* Webhook Connection Indicator */}
          <ConnectionStatusBadge />

          {/* User Profile & Role Switcher Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-dark-surface border border-dark-border hover:border-zinc-700 transition-all focus:outline-none"
            >
              <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-brand-primary/30 shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-dark-elevated flex items-center justify-center text-brand-primary font-bold text-xs">
                    {user?.name?.[0] || 'V'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-dark-surface" />
              </div>

              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">
                  {user?.name || 'Operador'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {user?.roleTitle || 'Agencia'}
                </span>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                  userMenuOpen ? 'rotate-180 text-brand-primary' : ''
                }`}
              />
            </button>

            {/* Profile & RBAC Simulation Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-dark-surface border border-dark-border shadow-2xl p-3 z-50 animate-scaleUp">
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-2 pb-3 border-b border-dark-border">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-brand-primary/40 shrink-0">
                    <img src={user?.avatar} alt={user?.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">{user?.email}</p>
                    <div className="mt-1">{getRoleBadge(user?.role)}</div>
                  </div>
                </div>

                {/* RBAC Role Switcher (for testing the 3 roles live) */}
                <div className="py-2.5 border-b border-dark-border">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                    Cambiar Rol (RBAC Preview)
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        switchUserRole(USER_ROLES.SUPER_ADMIN_AGENCY);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isSuperAdmin
                          ? 'bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/30'
                          : 'text-zinc-300 hover:bg-dark-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" />
                        <span>SUPER_ADMIN_AGENCY</span>
                      </div>
                      {isSuperAdmin && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        switchUserRole(USER_ROLES.COMMUNITY_MANAGER);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isCommunityManager
                          ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30'
                          : 'text-zinc-300 hover:bg-dark-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        <span>COMMUNITY_MANAGER</span>
                      </div>
                      {isCommunityManager && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        switchUserRole(USER_ROLES.CLIENT_READ_ONLY);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isClientReadOnly
                          ? 'bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/30'
                          : 'text-zinc-300 hover:bg-dark-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" />
                        <span>CLIENT_READ_ONLY (Dueño)</span>
                      </div>
                      {isClientReadOnly && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full justify-center"
                    icon={LogOut}
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                  >
                    🔴 Cerrar Sesión JWT
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
