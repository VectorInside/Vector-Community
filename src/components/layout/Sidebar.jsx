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
  LayoutGrid,
  Sun,
  Moon,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  Sliders,
  LogOut,
} from 'lucide-react';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    isAdmin,
    isClient,
    switchRole,
    theme,
    toggleTheme,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useAuth();

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === 'client') {
      router.push('/metrics');
    } else {
      router.push('/dashboard');
    }
  };

  const isLinkActive = (href) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <aside
      className={`vector-bg-panel vector-border border-r flex flex-col h-screen z-20 shrink-0 select-none transition-all duration-300 ease-in-out overflow-x-hidden ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      {isSidebarCollapsed ? (
        <>
          {/* Collapsed Header: Centered Isotype "V" */}
          <div className="h-16 px-2 border-b border-[var(--border-color)] flex items-center justify-center shrink-0">
            <Link
              href="/dashboard"
              className="transition-transform hover:scale-110 flex items-center justify-center"
              title="Vector Inside Community OS"
            >
              <VectorInsideLogo variant="isotype" size="sm" />
            </Link>
          </div>

          {/* Collapsed Expand Toggle */}
          <div className="p-2 border-b border-[var(--border-color)] bg-[var(--bg-card)]/40 flex justify-center shrink-0">
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              title="Expandir barra de módulos"
              className="w-full py-1.5 px-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-neon flex items-center justify-center transition-all shadow-sm group"
            >
              <PanelLeftOpen className="w-4 h-4 text-neon group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </>
      ) : (
        /* Expanded Header: Full Imagotype + Collapse Button */
        <div className="h-16 px-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <Link
            href="/dashboard"
            className="transition-transform hover:scale-105 flex items-center shrink-0 overflow-hidden"
            title="Vector Inside Community OS"
          >
            <VectorInsideLogo variant="imagotype" size="sm" showCommunity={true} />
          </Link>

          <button
            type="button"
            onClick={toggleSidebarCollapse}
            title="Minimizar barra de módulos"
            className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon text-[var(--text-muted)] hover:text-neon transition-all"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Selector */}
      <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] relative">
        {isSidebarCollapsed ? (
          <div
            className="flex flex-col items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-[var(--bg-base)] transition-colors"
            onClick={() => handleRoleChange(role === 'admin' ? 'client' : 'admin')}
            title={`Rol: ${role === 'admin' ? 'Lobo Vectorial (Admin)' : 'Dueño Negocio (Cliente)'} (Clic para alternar)`}
          >
            {role === 'admin' ? (
              <span className="p-1.5 rounded-lg bg-neon/15 text-neon border border-neon/40 shadow-[0_0_8px_var(--neon-glow)]">
                <Shield className="w-4 h-4" />
              </span>
            ) : (
              <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/40">
                <UserCheck className="w-4 h-4" />
              </span>
            )}
          </div>
        ) : (
          <>
            <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
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
          </>
        )}
      </div>

      {/* Navigation Items */}
      <nav className={`flex-1 p-3 space-y-2 overflow-y-auto ${isSidebarCollapsed ? 'px-2' : ''}`}>
        {/* Centro de Mando (Admin Only) */}
        {isAdmin && (
          <Link
            href="/dashboard"
            title="Centro de Mando"
            className={`w-full flex items-center rounded-xl transition-all ${
              isSidebarCollapsed
                ? 'justify-center p-3'
                : 'gap-3 px-3.5 py-2.5'
            } ${
              isLinkActive('/dashboard')
                ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span className="text-sm font-sans">Centro de Mando</span>}
          </Link>
        )}

        {/* Triage & HITL (All) */}
        <Link
          href="/triage"
          title="Triage & HITL (2 Alertas)"
          className={`w-full flex items-center rounded-xl transition-all relative ${
            isSidebarCollapsed
              ? 'justify-center p-3'
              : 'gap-3 px-3.5 py-2.5'
          } ${
            isLinkActive('/triage')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <MessageSquareWarning className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed ? (
            <>
              <span className="text-sm font-sans">Triage & HITL</span>
              <span className="ml-auto bg-[var(--danger)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                2
              </span>
            </>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse" />
          )}
        </Link>

        {/* Sección: Ingeniería IA (Admin Only) */}
        {isAdmin && (
          <>
            {!isSidebarCollapsed && (
              <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-5 mb-1.5 px-1 block">
                Ingeniería IA
              </label>
            )}

            <Link
              href="/agents"
              title="Orquestación Multi-Agente"
              className={`w-full flex items-center rounded-xl transition-all ${
                isSidebarCollapsed
                  ? 'justify-center p-3'
                  : 'gap-3 px-3.5 py-2.5'
              } ${
                isLinkActive('/agents')
                  ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
              }`}
            >
              <Network className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="text-sm font-sans">Orquestación</span>}
            </Link>

            <Link
              href="/config"
              title="Centro de Configuración & RAG"
              className={`w-full flex items-center rounded-xl transition-all ${
                isSidebarCollapsed
                  ? 'justify-center p-3'
                  : 'gap-3 px-3.5 py-2.5'
              } ${
                isLinkActive('/config')
                  ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="text-sm font-sans">Config & RAG</span>}
            </Link>

            <Link
              href="/settings"
              title="Gobernanza & Reglas de Negocio"
              className={`w-full flex items-center rounded-xl transition-all ${
                isSidebarCollapsed
                  ? 'justify-center p-3'
                  : 'gap-3 px-3.5 py-2.5'
              } ${
                isLinkActive('/settings')
                  ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="text-sm font-sans">Reglas & Precios</span>}
            </Link>
          </>
        )}

        {/* Sección: Operaciones de Contenido */}
        {!isSidebarCollapsed && (
          <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-5 mb-1.5 px-1 block">
            Operaciones de Contenido
          </label>
        )}

        <Link
          href="/planner"
          title="Parrilla de Contenido & DeepSeek"
          className={`w-full flex items-center rounded-xl transition-all relative ${
            isSidebarCollapsed
              ? 'justify-center p-3'
              : 'gap-3 px-3.5 py-2.5'
          } ${
            isLinkActive('/planner')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed ? (
            <>
              <span className="text-sm font-sans">Parrilla de Contenido</span>
              <span className="ml-auto bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                2
              </span>
            </>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </Link>

        {/* Sección: Analítica de Negocio */}
        {!isSidebarCollapsed && (
          <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-5 mb-1.5 px-1 block">
            Analítica de Negocio
          </label>
        )}

        <Link
          href="/metrics"
          title="Soberanía Financiera (ROAS & CAC)"
          className={`w-full flex items-center rounded-xl transition-all ${
            isSidebarCollapsed
              ? 'justify-center p-3'
              : 'gap-3 px-3.5 py-2.5'
          } ${
            isLinkActive('/metrics')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <PieChart className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span className="text-sm font-sans">Soberanía Financiera</span>}
        </Link>

        <Link
          href="/performance"
          title="Telemetría Web & CAPI"
          className={`w-full flex items-center rounded-xl transition-all ${
            isSidebarCollapsed
              ? 'justify-center p-3'
              : 'gap-3 px-3.5 py-2.5'
          } ${
            isLinkActive('/performance')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span className="text-sm font-sans">Telemetría Web & CAPI</span>}
        </Link>

        <Link
          href="/agenda"
          title="Master Agenda (Google Calendar)"
          className={`w-full flex items-center rounded-xl transition-all ${
            isSidebarCollapsed
              ? 'justify-center p-3'
              : 'gap-3 px-3.5 py-2.5'
          } ${
            isLinkActive('/agenda')
              ? 'bg-neon text-black font-bold shadow-[0_0_15px_var(--neon-glow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span className="text-sm font-sans">Master Agenda</span>}
        </Link>

      </nav>

      {/* Theme Switcher & Logout Footer */}
      <div className="mt-auto p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]/50 space-y-1.5">
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          className={`flex items-center rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-mono uppercase w-full ${
            isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
          }`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-neon shrink-0" />
              {!isSidebarCollapsed && <span>Modo Claro</span>}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-zinc-400 shrink-0" />
              {!isSidebarCollapsed && <span>Modo Oscuro</span>}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push('/login')}
          title="Cerrar Sesión"
          className={`flex items-center rounded-lg text-xs text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-colors font-mono uppercase w-full ${
            isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
