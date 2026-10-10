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

  // Sync sidebar state from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('vector_sidebar_collapsed');
      if (savedCollapsed !== null) {
        setIsSidebarCollapsed(savedCollapsed === 'true');
      }
    }
  }, []);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('vector_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

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
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_role', newRole);
    }
  };

  const switchTenantContext = (tenantKey) => {
    if (INITIAL_TENANTS_DATA[tenantKey]) {
      setActiveTenantKey(tenantKey);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vector_active_tenant_key', tenantKey);
      }
    }
  };

  const triggerModal = (title, bodyHtml, onAction = null, actionText = 'Confirmar Acción') => {
    setModal({
      isOpen: true,
      title,
      bodyHtml,
      actionText,
      onAction,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false, onAction: null }));
  };

  const executeModalAction = () => {
    if (modal.onAction && typeof modal.onAction === 'function') {
      modal.onAction();
    }
    closeModal();
  };

  const activeTenant = INITIAL_TENANTS_DATA[activeTenantKey] || INITIAL_TENANTS_DATA.dental;

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
        tenantsData: INITIAL_TENANTS_DATA,
        switchTenantContext,
        modal,
        triggerModal,
        closeModal,
        executeModalAction,
        isSidebarCollapsed,
        toggleSidebarCollapse,
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
