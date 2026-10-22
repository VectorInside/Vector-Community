'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutGrid,
  Crosshair,
  Megaphone,
  CalendarDays,
  MessageSquare,
  Users,
  BarChart3,
  FlaskConical,
  Sparkles,
  PlugZap,
  ShieldCheck,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  UserCheck,
  X,
} from 'lucide-react';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import { getNavigationForRole } from '@/utils/modulesRegistry';
import { MeasurementGuideModal } from '@/components/common/MeasurementGuideModal';

const iconMap = {
  LayoutGrid,
  Crosshair,
  Megaphone,
  CalendarDays,
  MessageSquare,
  Users,
  BarChart3,
  FlaskConical,
  Sparkles,
  PlugZap,
  ShieldCheck,
  BookOpen,
};

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    isAdmin,
    switchRole,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isMobileSidebarOpen,
    closeMobileSidebar,
  } = useAuth();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const navigationPillars = getNavigationForRole(role);

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    router.push('/dashboard');
  };

  const isLinkActive = (mod) => {
    if (pathname === mod.path) return true;
    if (mod.aliases && mod.aliases.some((alias) => pathname === alias || pathname.startsWith(alias))) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      <aside
        className={`vector-bg-panel vector-border border-r flex flex-col h-screen select-none transition-all duration-300 ease-in-out overflow-x-hidden
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]
          ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:z-20
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Brand Header */}
        {isSidebarCollapsed ? (
          <>
            <div className="h-16 px-2 border-b border-[var(--border-color)] flex items-center justify-between lg:justify-center shrink-0">
              <Link
                href="/dashboard"
                onClick={closeMobileSidebar}
                className="transition-transform hover:scale-110 flex items-center justify-center"
                title="Vector Inside Community OS"
              >
                <VectorInsideLogo variant="isotype" size="sm" />
              </Link>
              <button
                type="button"
                onClick={closeMobileSidebar}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] lg:hidden"
                aria-label="Cerrar navegación"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 border-b border-[var(--border-color)] bg-[var(--bg-card)]/40 hidden lg:flex justify-center shrink-0">
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                title="Expandir barra de navegación"
                className="w-full py-1.5 px-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-lime-400 text-lime-400 flex items-center justify-center transition-all shadow-sm group"
              >
                <PanelLeftOpen className="w-4 h-4 text-lime-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </>
        ) : (
          <div className="h-16 px-3.5 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 gap-2">
            <Link
              href="/dashboard"
              onClick={closeMobileSidebar}
              className="transition-transform hover:scale-102 flex items-center min-w-0 overflow-hidden"
              title="Vector Inside Community OS"
            >
              <VectorInsideLogo variant="official" size="sm" showCommunity={true} />
            </Link>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                title="Minimizar barra de navegación"
                className="hidden lg:flex p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400 transition-all shrink-0 items-center justify-center"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeMobileSidebar}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] lg:hidden flex items-center justify-center"
                aria-label="Cerrar navegación"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Workspace Indicator & Role Selector */}
        <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] relative">
          {isSidebarCollapsed ? (
            <div
              className="flex flex-col items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-[var(--bg-base)] transition-colors"
              onClick={() => handleRoleChange(role === 'admin' ? 'client' : 'admin')}
              title={`Perfil: ${role === 'admin' ? 'Administrador (Agencia)' : 'Usuario (Marca)'} (Clic para alternar)`}
            >
              {role === 'admin' ? (
                <span className="p-1.5 rounded-lg bg-lime-400/15 text-lime-400 border border-lime-400/40 shadow-sm">
                  <Shield className="w-4 h-4" />
                </span>
              ) : (
                <span className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/40">
                  <UserCheck className="w-4 h-4" />
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Espacio Activo
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En Línea
                </span>
              </div>
              <label className="sr-only">Perfil Operativo</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-xs text-[var(--text-main)] rounded-lg p-2 outline-none focus:border-lime-400 cursor-pointer font-bold transition-all shadow-sm"
              >
                <option value="admin">Administrador (Lobo Vectorial)</option>
                <option value="client">Usuario (Dueño de Negocio)</option>
              </select>
            </div>
          )}
        </div>

        {/* Navigation List - Grouped by 3 Pillars */}
        <nav className={`flex-1 p-3 space-y-4 overflow-y-auto ${isSidebarCollapsed ? 'px-2' : ''}`}>
          {navigationPillars.map((pillar) => (
            <div key={pillar.id} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="text-[10px] font-mono font-extrabold text-[var(--text-muted)] uppercase tracking-wider px-2 py-1 block">
                  {pillar.label}
                </p>
              )}

              {pillar.modules.map((mod) => {
                const IconComponent = iconMap[mod.iconName] || LayoutGrid;
                const active = isLinkActive(mod);

                return (
                  <Link
                    key={mod.id}
                    href={mod.path}
                    onClick={closeMobileSidebar}
                    title={mod.label}
                    className={`w-full flex items-center rounded-xl transition-all relative ${
                      isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                    } ${
                      active
                        ? 'bg-lime-400 text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.25)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] font-medium'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${active ? 'text-black' : 'text-[var(--text-muted)]'}`} />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="text-xs font-sans truncate">{mod.label}</span>
                        {/* Dynamic Notification Badges */}
                        {mod.id === 'inbox' && (
                          <span className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            active ? 'bg-black text-lime-400' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            3
                          </span>
                        )}
                        {mod.id === 'content' && (
                          <span className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            active ? 'bg-black text-lime-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            2
                          </span>
                        )}
                        {mod.id === 'crm' && (
                          <span className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            active ? 'bg-black text-lime-400' : 'bg-lime-400/20 text-lime-400 border border-lime-400/30'
                          }`}>
                            HITL
                          </span>
                        )}
                      </>
                    )}

                    {/* Collapsed dot indicators */}
                    {isSidebarCollapsed && mod.id === 'inbox' && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Bottom: Measurement Guide & Operational Note */}
        <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]/50 shrink-0 space-y-2">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            title="Guía de medición oficial"
            className={`w-full flex items-center rounded-xl p-2.5 transition-all text-xs font-semibold ${
              isSidebarCollapsed
                ? 'justify-center text-lime-400 hover:bg-[var(--bg-card)]'
                : 'gap-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-main)] shadow-sm'
            }`}
          >
            <BookOpen className="w-4 h-4 text-lime-400 shrink-0" />
            {!isSidebarCollapsed && (
              <>
                <span className="truncate">Guía de medición</span>
                <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-lime-400/15 text-lime-400 border border-lime-400/30">
                  13 fuentes
                </span>
              </>
            )}
          </button>

          {!isSidebarCollapsed && (
            <div className="px-2 pt-1 text-[9px] font-mono text-[var(--text-faint)] leading-relaxed uppercase">
              DE LA PRESENCIA A LA VENTA<br />
              <span className="text-[var(--text-muted)] lowercase font-sans">Cada contacto tiene un siguiente paso.</span>
            </div>
          )}
        </div>
      </aside>

      {/* Guía de Medición Modal */}
      <MeasurementGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
};
