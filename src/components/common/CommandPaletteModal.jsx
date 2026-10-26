'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Portal } from '@/components/common/Portal';
import { getNavigationForRole } from '@/utils/modulesRegistry';
import {
  Search,
  Zap,
  Users,
  Megaphone,
  Compass,
  ArrowRight,
  CornerDownLeft,
  Copy,
  Check,
  Moon,
  Sun,
  Power,
  Sparkles,
  MessageSquare,
  Calendar,
  X,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

// ============================================================================
// CANONICAL TENANT DATA FOR QUICK SEARCH (STRICT MULTI-TENANT ISOLATION)
// ============================================================================
const TENANT_CONTACTS_INDEX = {
  dental: [
    { id: 'dent-001', name: 'Carlos Mendoza', need: 'Implante Dental 3D Sin Dolor', channel: 'WhatsApp', phone: '+52 55 4912 3840', tag: 'Alta Intención' },
    { id: 'dent-002', name: 'Dra. Mariana Solares', need: 'Valoración Implante Molar 3D', channel: 'Instagram DM', phone: '+52 55 8812 9031', tag: 'Cita Pendiente' },
    { id: 'dent-003', name: 'Valeria Cordero', need: 'Diseño de Sonrisa & Carillas', channel: 'Facebook', phone: '+52 55 9821 4433', tag: 'Re-engagement' },
  ],
  polanco: [
    { id: 'pol-001', name: 'Alejandro Bastida', need: 'Cena Maridaje 4 Tiempos (4 Pax)', channel: 'WhatsApp', phone: '+52 55 3341 8920', tag: 'Reserva VIP' },
    { id: 'pol-002', name: 'Regina Covarrubias', need: 'Mesa Salón Privado 8 Personas', channel: 'Instagram DM', phone: '+52 55 7712 0099', tag: 'Cena Corporativa' },
    { id: 'pol-003', name: 'Mauricio Treviño', need: 'Menú Degustación & Maridaje', channel: 'Facebook', phone: '+52 55 6601 3322', tag: 'Reserva Confirmada' },
  ],
  urban: [
    { id: 'urb-001', name: 'Kevin Almonte', need: 'Jordan 1 Retro High Talla 27.5mx', channel: 'WhatsApp', phone: '+52 55 9876 5432', tag: 'Checkout Listo' },
    { id: 'urb-002', name: 'Sofía Valenzuela', need: 'Dunk Low Panda Preventa', channel: 'Instagram DM', phone: '+52 55 3322 1100', tag: 'Talla Especial' },
    { id: 'urb-003', name: 'Rodrigo Montes', need: 'Apartado Preventa Drop Limitado', channel: 'Web Chat', phone: '+52 55 1199 4433', tag: 'Pedido Despachado' },
  ],
  corp: [
    { id: 'corp-001', name: 'Ing. Fernando Arteaga', need: 'Auditoría Fuga de Leads B2B', channel: 'LinkedIn', phone: '+52 55 1234 5678', tag: 'Enterprise SMR' },
    { id: 'corp-002', name: 'Rodrigo Elizondo', need: 'Licenciamiento Multi-Tenant (4 Subs)', channel: 'WhatsApp', phone: '+52 55 9012 3456', tag: 'Compliance TI' },
  ],
  creator: [
    { id: 'cre-001', name: 'Camila Duarte (PR Agencia)', need: 'Patrocinio Video Integrado 60s', channel: 'TikTok', phone: '+52 55 7766 5544', tag: 'Brand Deal' },
    { id: 'cre-002', name: 'Santiago Vélez', need: 'Mentoría 1-on-1 Growth Tech', channel: 'Instagram DM', phone: '+52 55 8899 0011', tag: 'Membresía VIP' },
  ],
};

const TENANT_CAMPAIGNS_INDEX = {
  dental: [
    { id: 'camp-dent-1', name: 'Ortodoncia Invisible 3D & Alineadores', channel: 'Meta Ads', budget: '$18,000 MXN', status: 'Activa' },
    { id: 'camp-dent-2', name: 'Implantes Dentales & Carga Inmediata', channel: 'Google Search', budget: '$14,000 MXN', status: 'Activa' },
  ],
  polanco: [
    { id: 'camp-pol-1', name: 'Reel: El Ritual de la Brasa', channel: 'Instagram Reels', budget: '$14,000 MXN', status: 'Activa' },
    { id: 'camp-pol-2', name: 'Campaña Cenas de Fin de Semana & Maridaje', channel: 'Meta Ads', budget: '$12,500 MXN', status: 'Activa' },
  ],
  urban: [
    { id: 'camp-urb-1', name: 'Drop Exclusivo Streetwear 2026', channel: 'TikTok Ads', budget: '$15,000 MXN', status: 'Activa' },
    { id: 'camp-urb-2', name: 'Retargeting Carritos Abandonados', channel: 'Meta Ads', budget: '$8,000 MXN', status: 'Activa' },
  ],
  corp: [
    { id: 'camp-corp-1', name: 'Integración CRM & Meta CAPI Enterprise', channel: 'LinkedIn B2B', budget: '$18,000 MXN', status: 'Activa' },
  ],
  creator: [
    { id: 'camp-cre-1', name: 'Lanzamiento Mini-Curso Automatización IA', channel: 'YouTube Shorts', budget: '$6,000 MXN', status: 'Activa' },
  ],
};

export const CommandPaletteModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const {
    role,
    isAdmin,
    activeTenant,
    activeTenantKey,
    theme,
    toggleTheme,
    toggleTenantAi,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedActionId, setCopiedActionId] = useState(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const tenantKey = activeTenantKey || activeTenant?.id || 'dental';

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setCopiedActionId(null);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global Keyboard listener: Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Micro-Landing URL
  const microLandingUrl = useMemo(() => {
    const slug = activeTenant?.microLandingSlug || tenantKey;
    return `https://app.vectorinside.com/m/${slug}`;
  }, [activeTenant, tenantKey]);

  // 1. Quick Actions (Multi-Tenant Scoped)
  const quickActions = useMemo(() => {
    return [
      {
        id: 'action-copy-landing',
        category: 'ACCIONES RÁPIDAS',
        title: `Copiar Enlace de Micro-Landing (/m/${activeTenant?.microLandingSlug || tenantKey})`,
        subtitle: 'Enlace público directo con captura y atribución a WhatsApp',
        icon: Copy,
        iconColor: 'text-neon',
        action: () => {
          try {
            navigator.clipboard.writeText(microLandingUrl);
            setCopiedActionId('action-copy-landing');
            setTimeout(() => setCopiedActionId(null), 2500);
          } catch (e) {}
        },
      },
      {
        id: 'action-toggle-ai',
        category: 'ACCIONES RÁPIDAS',
        title: activeTenant?.isAiActive
          ? 'Pausar Asistente de IA en WhatsApp (Modo Humano)'
          : 'Reactivar Asistente de IA en WhatsApp (24/7)',
        subtitle: `Estado actual: ${activeTenant?.isAiActive ? 'Activo (Respuestas < 1.2s)' : 'Pausado (Intervención humana)'}`,
        icon: Power,
        iconColor: activeTenant?.isAiActive ? 'text-amber-400' : 'text-emerald-400',
        action: () => {
          if (toggleTenantAi) toggleTenantAi(tenantKey);
          onClose();
        },
      },
      {
        id: 'action-toggle-theme',
        category: 'ACCIONES RÁPIDAS',
        title: `Alternar Tema Visual (${theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'})`,
        subtitle: 'Cambiar estética de la interfaz',
        icon: theme === 'dark' ? Sun : Moon,
        iconColor: 'text-cyan-400',
        action: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'action-go-profile',
        category: 'ACCIONES RÁPIDAS',
        title: `Ver Perfil de Marca & ADN (${activeTenant?.shortName || activeTenant?.name})`,
        subtitle: 'Propósito, tono de voz, SLA y propuesta comercial',
        icon: Sparkles,
        iconColor: 'text-neon',
        action: () => {
          router.push('/profile');
          onClose();
        },
      },
    ];
  }, [activeTenant, tenantKey, microLandingUrl, theme, toggleTheme, toggleTenantAi, router, onClose]);

  // 2. Contacts / Leads (Strictly isolated by tenant)
  const tenantContacts = useMemo(() => {
    const rawList = TENANT_CONTACTS_INDEX[tenantKey] || TENANT_CONTACTS_INDEX.dental;
    return rawList.map((contact) => ({
      id: `contact-${contact.id}`,
      category: 'PROSPECTOS & CONVERSACIONES',
      title: `${contact.name} — ${contact.need}`,
      subtitle: `${contact.channel} • ${contact.phone} • ${contact.tag}`,
      icon: MessageSquare,
      iconColor: 'text-emerald-400',
      action: () => {
        router.push(`/inbox?threadId=${contact.id}`);
        onClose();
      },
    }));
  }, [tenantKey, router, onClose]);

  // 3. Campaigns (Strictly isolated by tenant)
  const tenantCampaigns = useMemo(() => {
    const rawList = TENANT_CAMPAIGNS_INDEX[tenantKey] || TENANT_CAMPAIGNS_INDEX.dental;
    return rawList.map((camp) => ({
      id: `camp-${camp.id}`,
      category: 'CAMPAÑAS ACTIVAS',
      title: camp.name,
      subtitle: `${camp.channel} • Presupuesto: ${camp.budget} • ${camp.status}`,
      icon: Megaphone,
      iconColor: 'text-pink-400',
      action: () => {
        router.push('/campaigns');
        onClose();
      },
    }));
  }, [tenantKey, router, onClose]);

  // 4. Navigation (Strictly filtered by RBAC)
  const navigationModules = useMemo(() => {
    const pillars = getNavigationForRole(role);
    const items = [];
    pillars.forEach((pillar) => {
      pillar.modules.forEach((mod) => {
        items.push({
          id: `nav-${mod.id}`,
          category: `SECCIÓN: ${pillar.label}`,
          title: mod.label,
          subtitle: mod.description,
          icon: Compass,
          iconColor: 'text-sky-400',
          path: mod.path,
          action: () => {
            router.push(mod.path);
            onClose();
          },
        });
      });
    });
    return items;
  }, [role, router, onClose]);

  // Filtered Items across all categories based on query
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const all = [...quickActions, ...tenantContacts, ...tenantCampaigns, ...navigationModules];

    if (!q) return all;

    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery, quickActions, tenantContacts, tenantCampaigns, navigationModules]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current && current.action) {
        current.action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 animate-fade-in font-sans"
        onClick={onClose}
      >
        {/* Command Palette Stage */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Paleta de Comandos y Búsqueda Global"
          className="w-full max-w-2xl rounded-3xl bg-[var(--bg-panel)] border-2 border-neon/40 shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[80vh] animate-scale-up text-[var(--text-main)]"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header Search Input Bar */}
          <div className="p-3 sm:p-4 border-b border-[var(--border-color)] flex items-center gap-3 bg-[var(--bg-card)]/60">
            <Search className="w-5 h-5 text-neon shrink-0 animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar en ${activeTenant?.shortName || activeTenant?.name || 'tu negocio'}: prospecto, campaña, sección o acción...`}
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] font-mono font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-muted)]">
                ESC
              </span>
            </div>
          </div>

          {/* Active Tenant Context Ribbon */}
          <div className="px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">{activeTenant?.avatar || '🏢'}</span>
              <span className="text-[var(--text-muted)]">Espacio Activo:</span>
              <strong className="text-[var(--text-main)] truncate">{activeTenant?.name}</strong>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RLS Aislado
            </span>
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-xs"
          >
            {filteredItems.length === 0 ? (
              <div className="p-10 text-center space-y-2 text-[var(--text-muted)] font-mono">
                <Search className="w-8 h-8 mx-auto opacity-30 text-neon" />
                <p className="font-bold text-sm text-[var(--text-main)]">Sin coincidencias para "{searchQuery}"</p>
                <p className="text-xs">
                  Prueba buscando por nombre de cliente, palabra clave de campaña o sección del sistema.
                </p>
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const Icon = item.icon || ArrowRight;
                const isCopied = copiedActionId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'bg-neon/15 border border-neon/60 text-[var(--text-main)] shadow-sm'
                        : 'hover:bg-[var(--bg-card)] border border-transparent text-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-neon text-black border-neon'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] ' + (item.iconColor || 'text-neon')
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-heading font-bold text-xs truncate ${
                              isSelected ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]'
                            }`}
                          >
                            {isCopied ? '¡Enlace copiado al portapapeles!' : item.title}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hidden sm:inline-block">
                        {item.category.split(':')[0]}
                      </span>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-neon bg-neon/10 px-2 py-0.5 rounded border border-neon/30">
                          <span>Enter</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Status Bar with Shortcuts */}
          <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]/80 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)]">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)]">
                  ↓
                </kbd>
                <span>Navegar</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)]">
                  ↵
                </kbd>
                <span>Ejecutar</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)]">
                  ESC
                </kbd>
                <span>Cerrar</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[9px] text-[var(--text-muted)]">
              <span>Vector Inside Community OS</span>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
