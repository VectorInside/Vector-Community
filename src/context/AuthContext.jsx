'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TENANTS_DATA } from '@/utils/constants';
import { useTenantStore } from '@/hooks/useTenant';
import { tenantService } from '@/services/tenantService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('admin');
  const [theme, setTheme] = useState('dark');
  const [activeTenantKey, setActiveTenantKey] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: 'Notificación Vectorial',
    bodyHtml: '',
    actionText: 'Confirmar Acción',
    onAction: null,
  });

  // Sync preferences from localStorage & Backend PostgreSQL on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Purga automática de datos demo cacheados si la versión de esquema es previa a v7
      if (localStorage.getItem('vector_schema_version') !== 'v8_zero_state_purge') {
        const keysToRemove = [
          'vector_tenants_data',
          'vector_active_tenant_key',
          'vector_active_tenant_id',
          'vector_active_tenant',
          'vector_tenant_owner_accounts',
          'vector_agency_staff_members',
          'vector_global_notifications',
          'vector_email_configs_by_tenant',
          'vector_system_audit_logs',
          'vector_calendar_appointments_v2',
          'vector_custom_campaigns',
          'vector_threads_map',
          'vector_inbox_threads',
          'vector_radar_leads',
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.startsWith('vector_microlanding_') ||
              key.startsWith('vector_campaigns_') ||
              key.startsWith('vector_inbox_') ||
              key.startsWith('vector_planner_') ||
              key.startsWith('vector_threads_'))
          ) {
            localStorage.removeItem(key);
          }
        }
        localStorage.setItem('vector_schema_version', 'v8_zero_state_purge');
      }

      const savedTheme = localStorage.getItem('vector_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
      const savedRole = localStorage.getItem('vector_role');
      if (savedRole === 'admin' || savedRole === 'client') {
        setRole(savedRole);
      }
      const savedTenant = localStorage.getItem('vector_active_tenant_key');
      if (savedTenant) {
        setActiveTenantKey(savedTenant);
        try {
          useTenantStore.getState().setActiveTenantId(savedTenant);
        } catch (e) { }
      }
      const savedCollapsed = localStorage.getItem('vector_sidebar_collapsed');
      if (savedCollapsed !== null) {
        setIsSidebarCollapsed(savedCollapsed === 'true');
      }
      try {
        const savedTenants = localStorage.getItem('vector_tenants_data');
        if (savedTenants) {
          const parsed = JSON.parse(savedTenants);
          setTenantsData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) { }

      // Hydrate from Spring Boot Backend (/api/v1/tenants)
      tenantService
        .getTenants()
        .then((backendTenants) => {
              if (Array.isArray(backendTenants)) {
                const fresh = {};
                backendTenants.forEach((bt) => {
                  if (bt?.id) fresh[bt.id] = bt;
                });
                setTenantsData(fresh);

                const keys = Object.keys(fresh);
                if (keys.length > 0) {
                  const currentKey = localStorage.getItem('vector_active_tenant_key');
                  const nextKey = (currentKey && fresh[currentKey]) ? currentKey : keys[0];
                  setActiveTenantKey(nextKey);
                  localStorage.setItem('vector_active_tenant_key', nextKey);
                  localStorage.setItem('vector_active_tenant_id', nextKey);
                  try {
                    useTenantStore.getState().setActiveTenantId(nextKey);
                  } catch (e) { }
                } else {
                  setActiveTenantKey(null);
                  localStorage.removeItem('vector_active_tenant_key');
                  localStorage.removeItem('vector_active_tenant_id');
                }
              }
            })
              .catch(() => { });

            setIsMounted(true);
          }
        }, []);

      const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

      const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed((prev) => {
          const next = !prev;
          if (typeof window !== 'undefined') {
            localStorage.setItem('vector_sidebar_collapsed', String(next));
          }
          return next;
        });
      };

      const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
      const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

      // Sync theme with document class
      useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
          root.classList.remove('dark');
          root.classList.add('light');
        } else {
          root.classList.remove('light');
          root.classList.add('dark');
        }
      }, [theme]);

      const toggleTheme = () => {
        setTheme((prev) => {
          const next = prev === 'dark' ? 'light' : 'dark';
          if (typeof window !== 'undefined') {
            localStorage.setItem('vector_theme', next);
          }
          return next;
        });
      };

      const switchRole = (newRole, newTenantKey = null, force = false) => {
        // Si un usuario intenta escalar de cliente a admin sin pasar por login ni tener rol real de admin, bloquear
        if (!force && role === 'client' && newRole === 'admin') {
          const storedRealRole = typeof window !== 'undefined' ? localStorage.getItem('vector_real_role') : null;
          if (storedRealRole !== 'admin') {
            console.warn('[RBAC Security Guard] Intento de escalación de privilegios bloqueado.');
            return;
          }
        }
        setRole(newRole);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vector_role', newRole);
          if (force && newRole === 'admin') {
            localStorage.setItem('vector_real_role', 'admin');
          }
        }
        if (newTenantKey) {
          setActiveTenantKey(newTenantKey);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vector_active_tenant_key', newTenantKey);
            localStorage.setItem('vector_active_tenant_id', newTenantKey);
          }
          try {
            useTenantStore.getState().setActiveTenantId(newTenantKey);
          } catch (e) { }
        }
      };

      const loginAs = (userData) => {
        if (!userData) return;
        const targetRole = userData.role || 'admin';
        const targetTenant = userData.tenantKey || activeTenantKey || 'dental';

        setRole(targetRole);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vector_role', targetRole);
          localStorage.setItem('vector_real_role', targetRole);
          localStorage.setItem('vector_user_id', userData.id || '');
        }

        if (targetRole === 'client' && userData.tenantKey) {
          setActiveTenantKey(userData.tenantKey);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vector_active_tenant_key', userData.tenantKey);
            localStorage.setItem('vector_active_tenant_id', userData.tenantKey);
          }
          try {
            useTenantStore.getState().setActiveTenantId(userData.tenantKey);
          } catch (e) { }
        } else if (targetRole === 'admin') {
          // Si es admin, puede navegar entre todos los negocios; preservamos el tenant activo actual o asignamos el primero
          if (targetTenant) {
            setActiveTenantKey(targetTenant);
            if (typeof window !== 'undefined') {
              localStorage.setItem('vector_active_tenant_key', targetTenant);
              localStorage.setItem('vector_active_tenant_id', targetTenant);
            }
            try {
              useTenantStore.getState().setActiveTenantId(targetTenant);
            } catch (e) { }
          }
        }
      };

      const [tenantsData, setTenantsData] = useState(INITIAL_TENANTS_DATA);

      // Keep localStorage synchronized
      useEffect(() => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('vector_tenants_data', JSON.stringify(tenantsData));
          } catch (e) { }
        }
      }, [tenantsData]);

      const switchTenantContext = (tenantKey) => {
        // Aislamiento Multi-Tenant: Si el usuario es cliente, no permitir cambiar a otro tenant
        if (role === 'client') {
          console.warn('[RLS Multi-Tenant] Operación denegada: Un usuario con rol Cliente está aislado y no puede conmutar el espacio de trabajo.');
          return;
        }
        setActiveTenantKey(tenantKey);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vector_active_tenant_key', tenantKey);
          localStorage.setItem('vector_active_tenant_id', tenantKey);
        }
        try {
          useTenantStore.getState().setActiveTenantId(tenantKey);
        } catch (e) { }
      };

      const toggleTenantAi = (tenantKey) => {
        setTenantsData((prev) => {
          const target = prev[tenantKey];
          if (!target) return prev;
          const willBeActive = !target.isAiActive;
          const updated = {
            ...target,
            isAiActive: willBeActive,
            crisisMode: !willBeActive, // If paused, enters crisis/takeover mode
          };
          tenantService.updateTenant(tenantKey, updated).catch(() => { });
          return {
            ...prev,
            [tenantKey]: updated,
          };
        });
      };

      const updateTenantPolicy = (tenantKey, updates) => {
        setTenantsData((prev) => {
          const target = prev[tenantKey];
          if (!target) return prev;
          const updated = {
            ...target,
            ...updates,
          };
          tenantService.updateTenant(tenantKey, updated).catch(() => { });
          return {
            ...prev,
            [tenantKey]: updated,
          };
        });
      };

      const toggleTenantMicroLanding = (tenantKey, newStatus, trialDays = 90) => {
        setTenantsData((prev) => {
          const target = prev[tenantKey];
          if (!target) return prev;
          const isEnabled = newStatus === 'trial' || newStatus === 'active';
          const updated = {
            ...target,
            microLandingEnabled: isEnabled,
            microLandingStatus: newStatus,
            microLandingTrialDaysLeft:
              newStatus === 'trial'
                ? (trialDays !== undefined ? trialDays : (target.microLandingTrialDaysLeft || 90))
                : (target.microLandingTrialDaysLeft || 0),
          };
          tenantService.updateTenant(tenantKey, updated).catch(() => { });
          return {
            ...prev,
            [tenantKey]: updated,
          };
        });
      };

      const registerTenant = (newTenant, makeActive = true) => {
        setTenantsData((prev) => ({
          ...prev,
          [newTenant.id]: newTenant,
        }));
        tenantService.createTenant(newTenant).catch(() => { });
        if (makeActive && newTenant?.id) {
          setActiveTenantKey(newTenant.id);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vector_active_tenant_key', newTenant.id);
            localStorage.setItem('vector_active_tenant_id', newTenant.id);
          }
          try {
            useTenantStore.getState().setActiveTenantId(newTenant.id);
          } catch (e) { }
        }
      };

      const deleteTenant = (tenantId) => {
        if (!tenantId) return;
        setTenantsData((prev) => {
          const updated = { ...prev };
          delete updated[tenantId];
          return updated;
        });

        tenantService.deleteTenant(tenantId).catch(() => { });

        // Si el tenant eliminado era el activo, cambiar automáticamente al primero disponible
        setActiveTenantKey((currKey) => {
          if (currKey === tenantId) {
            const remainingKeys = Object.keys(tenantsData).filter((k) => k !== tenantId);
            return remainingKeys[0] || null;
          }
          return currKey;
        });
      };

      const triggerModal = (title, bodyHtml, onAction = null, actionText = 'Confirmar Acción', variant = 'default') => {
        setModal({
          isOpen: true,
          title,
          bodyHtml,
          actionText,
          onAction,
          variant,
        });
      };

      const closeModal = () => {
        setModal((prev) => ({ ...prev, isOpen: false, onAction: null, variant: 'default' }));
      };

      const executeModalAction = () => {
        if (modal.onAction && typeof modal.onAction === 'function') {
          modal.onAction();
        }
        closeModal();
      };

      const activeTenant = (activeTenantKey && tenantsData[activeTenantKey]) || Object.values(tenantsData)[0] || null;

      const isAdmin = role === 'admin';
      const isClient = role === 'client';
      const permissions = {
        canSwitchTenant: isAdmin,
        canManageTeam: isAdmin,
        canConfigureAi: isAdmin,
      };

      return (
        <AuthContext.Provider
          value={{
            role,
            isAdmin,
            isClient,
            permissions,
            isMounted,
            switchRole,
            loginAs,
            theme,
            toggleTheme,
            activeTenantKey,
            activeTenant,
            tenantsData,
            switchTenantContext,
            toggleTenantAi,
            updateTenantPolicy,
            toggleTenantMicroLanding,
            registerTenant,
            deleteTenant,
            modal,
            triggerModal,
            closeModal,
            executeModalAction,
            isSidebarCollapsed,
            toggleSidebarCollapse,
            isMobileSidebarOpen,
            toggleMobileSidebar,
            closeMobileSidebar,
          }}
        >
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
