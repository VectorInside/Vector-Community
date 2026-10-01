'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/hooks/useTenant';
import { Badge } from '@/components/common/Badge';
import {
  Inbox,
  Calendar,
  BarChart3,
  Bot,
  Sparkles,
  Radio,
  Sliders,
  Shield,
  Activity,
  Layers
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { permissions, user } = useAuth();
  const { activeTenant } = useTenant();

  const navigationItems = [
    {
      name: 'Agency HITL Inbox',
      description: 'Alertas & Aprobación en 1 Clic',
      href: '/dashboard',
      icon: Inbox,
      badge: 'CO-PILOT',
      visible: permissions.canAccessHITLInbox,
    },
    {
      name: 'Master Agenda',
      description: 'Google Calendar API Sync',
      href: '/agenda',
      icon: Calendar,
      badge: '2-WAY',
      visible: permissions.canViewAgenda,
    },
    {
      name: 'Performance Backend',
      description: 'ROAS Real, CAC & CAPI',
      href: '/performance',
      icon: BarChart3,
      badge: 'ATTRIBUTION',
      visible: permissions.canViewPerformance,
    },
    {
      name: 'Sub-Bots RAG & Verticals',
      description: 'Prompts & Reglas de Negocio',
      href: '/settings',
      icon: Bot,
      badge: 'RAG ENGINE',
      visible: permissions.canEditSettings,
    },
  ];

  const visibleItems = navigationItems.filter((item) => item.visible);

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-dark-base border-r border-dark-border min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Control Principal
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HITL Live
            </span>
          </div>

          <nav className="space-y-1.5">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-dark-surface border border-brand-primary/40 text-white shadow-neon-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-dark-surface/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-brand-primary text-black font-bold'
                          : 'bg-dark-elevated text-zinc-400 group-hover:text-brand-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="w-1.5 h-4 rounded-full bg-brand-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tenant Active Card Summary */}
        <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Tenant Activo
            </span>
            <Badge variant="neon" size="xs">
              {activeTenant?.vertical?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs font-bold text-white truncate">
            {activeTenant?.name}
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-dark-border/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">ROAS Atribuido:</span>
            <span className="text-brand-primary font-bold">{activeTenant?.monthlyRoas}</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="space-y-3 pt-4 border-t border-dark-border/80">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-brand-primary animate-pulse" />
            SSE Stream Active
          </span>
          <span>v1.0.0-PROD</span>
        </div>
      </div>
    </aside>
  );
};
