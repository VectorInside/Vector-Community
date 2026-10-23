'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TENANTS_DATA } from '@/utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('admin'); // 'admin' (Lobo Vectorial) | 'client' (Dueño Negocio)
  const [theme, setTheme] = useState('dark');
  const [activeTenantKey, setActiveTenantKey] = useState('dental');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  const switchRole = (newRole) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_role', newRole);
    }
  };

  const [tenantsData, setTenantsData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vector_tenants_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge to ensure default mock tenants have updated schema fields
          return { ...INITIAL_TENANTS_DATA, ...parsed };
        }
      } catch (e) {}
    }
    return INITIAL_TENANTS_DATA;
  });

  // Keep localStorage synchronized
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vector_tenants_data', JSON.stringify(tenantsData));
      } catch (e) {}
    }
  }, [tenantsData]);

  const switchTenantContext = (tenantKey) => {
    setActiveTenantKey(tenantKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_active_tenant_key', tenantKey);
    }
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
        switchRole,
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
