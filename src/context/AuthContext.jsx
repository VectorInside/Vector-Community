'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TENANTS_DATA } from '@/utils/constants';
import { useTenantStore } from '@/hooks/useTenant';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('admin');
  const [theme, setTheme] = useState('dark');
  const [activeTenantKey, setActiveTenantKey] = useState('dental');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: 'Notificación Vectorial',
    bodyHtml: '',
    actionText: 'Confirmar Acción',
    onAction: null,
  });

  // Sync preferences from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      } catch (e) {}
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
      } catch (e) {}
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
      } catch (e) {}
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
        } catch (e) {}
      }
    }
  };

  const [tenantsData, setTenantsData] = useState(INITIAL_TENANTS_DATA);

  // Keep localStorage synchronized
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vector_tenants_data', JSON.stringify(tenantsData));
      } catch (e) {}
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
    } catch (e) {}
  };

  const toggleTenantAi = (tenantKey) => {
    setTenantsData((prev) => {
      const target = prev[tenantKey];
      if (!target) return prev;
      const willBeActive = !target.isAiActive;
      return {
        ...prev,
        [tenantKey]: {
          ...target,
          isAiActive: willBeActive,
          crisisMode: !willBeActive, // If paused, enters crisis/takeover mode
        },
      };
    });
  };

  const updateTenantPolicy = (tenantKey, updates) => {
    setTenantsData((prev) => {
      const target = prev[tenantKey];
      if (!target) return prev;
      return {
        ...prev,
        [tenantKey]: {
          ...target,
          ...updates,
        },
      };
    });
  };

  const toggleTenantMicroLanding = (tenantKey, newStatus, trialDays = 90) => {
    setTenantsData((prev) => {
      const target = prev[tenantKey];
      if (!target) return prev;
      const isEnabled = newStatus === 'trial' || newStatus === 'active';
      return {
        ...prev,
        [tenantKey]: {
          ...target,
          microLandingEnabled: isEnabled,
          microLandingStatus: newStatus,
          microLandingTrialDaysLeft:
            newStatus === 'trial'
              ? (trialDays !== undefined ? trialDays : (target.microLandingTrialDaysLeft || 90))
              : (target.microLandingTrialDaysLeft || 0),
        },
      };
    });
  };

  const registerTenant = (newTenant, makeActive = true) => {
    setTenantsData((prev) => ({
      ...prev,
      [newTenant.id]: newTenant,
    }));
    if (makeActive && newTenant?.id) {
      setActiveTenantKey(newTenant.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vector_active_tenant_key', newTenant.id);
      }
    }
  };

  const deleteTenant = (tenantId) => {
    if (!tenantId) return;
    setTenantsData((prev) => {
      const updated = { ...prev };
      delete updated[tenantId];
      return updated;
    });

    // Si el tenant eliminado era el activo, cambiar automáticamente al primero disponible
    setActiveTenantKey((currKey) => {
      if (currKey === tenantId) {
        const remainingKeys = Object.keys(tenantsData).filter((k) => k !== tenantId);
        return remainingKeys[0] || 'dental';
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

  const activeTenant = tenantsData[activeTenantKey] || Object.values(tenantsData)[0] || tenantsData.dental;

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin,
        isClient,
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
