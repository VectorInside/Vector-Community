'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Activity,
  MessageSquareWarning,
  Network,
  Database,
  PieChart,
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isAdmin, isClient, switchRole, theme, toggleTheme } = useAuth();

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === 'client') {
      router.push('/metrics');
    } else {
      router.push('/dashboard');
    }
  };

  const isLinkActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <aside className="w-64 vector-bg-panel vector-border border-r flex flex-col h-screen z-20 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[var(--border-color)] flex flex-col items-center justify-center">
        <div className="mb-2 text-center">
          {/* Logo Vector Inside Oficial */}
          <svg
            width="85"
            height="45"
            viewBox="0 0 150 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-1"
          >
            <path d="M45 0 L75 75 L105 0 L125 0 L85 85 L45 85 Z" fill="#E5FF00" />
            <rect x="62" y="22" width="12" height="4" fill="#050505" />
            <rect x="85" y="40" width="15" height="6" fill="#050505" />
          </svg>
          <span className="font-black tracking-[0.15em] text-xs uppercase block text-[var(--text-main)]">
            VECTOR INSIDE
          </span>
        </div>
        <h1 className="text-sm font-black tracking-tight uppercase text-neon">
          Vector Community
        </h1>
      </div>

      {/* Role Selector */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] relative">
        <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
          Rol Operativo
        </label>
        <select
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="w-full bg-[var(--bg-base)] border border-neon text-xs text-[var(--text-main)] rounded p-2 outline-none focus:border-[var(--neon-primary)] cursor-pointer font-bold relative z-10 shadow-[0_0_10px_var(--neon-glow)]"
        >
          <option value="admin">Lobo Vectorial (Admin Agencia)</option>
          <option value="client">Dueño Negocio (Cliente Final)</option>
        </select>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Centro de Mando (Admin Only) */}
        {isAdmin && (
          <Link
            href="/dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
              isLinkActive('/dashboard')
                ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm">Centro de Mando</span>
          </Link>
        )}

        {/* Triage & HITL (All) */}
        <Link
          href="/triage"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
            isLinkActive('/triage')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <MessageSquareWarning className="w-4 h-4" />
          <span className="text-sm">Triage & HITL</span>
          <span className="ml-auto bg-[var(--danger)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            2
          </span>
        </Link>

        {/* Sección: Ingeniería IA (Admin Only) */}
        {isAdmin && (
          <>
            <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-6 mb-2 block">
              Ingeniería IA
            </label>

            <Link
              href="/agents"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                isLinkActive('/agents')
                  ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
              }`}
            >
              <Network className="w-4 h-4" />
              <span className="text-sm">Orquestación</span>
            </Link>

            <Link
              href="/config"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                isLinkActive('/config')
                  ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="text-sm">Multi-Tenant RAG</span>
            </Link>
          </>
        )}

        {/* Sección: Analítica de Negocio */}
        <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-6 mb-2 block">
          Analítica de Negocio
        </label>

        <Link
          href="/metrics"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
            isLinkActive('/metrics')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span className="text-sm">Soberanía Financiera</span>
        </Link>

        <Link
          href="/agenda"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
            isLinkActive('/agenda')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Master Agenda</span>
        </Link>
      </nav>

      {/* Theme Switcher */}
      <div className="mt-auto p-4 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-mono uppercase w-full"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-neon" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-zinc-700" />
              <span>Modo Oscuro</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
