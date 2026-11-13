'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_TENANTS_DATA } from '@/utils/constants';
import { useTenantStore } from '@/hooks/useTenant';
import { tenantService } from '@/services/tenantService';
import { userService } from '@/services/userService';

const AuthContext = createContext(null);

const DEFAULT_ADMIN_USER = {
  id: 'usr-admin-01',
  name: 'Edgar Lobo Vectorial',
  email: 'Edgaradmin@vectorinside.com',
  phone: '',
  role: 'admin',
  globalRole: 'SUPER_ADMIN',
  roleTitle: 'Super Admin',
  avatar: '⚡',
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('admin');
  const [currentUser, setCurrentUser] = useState(DEFAULT_ADMIN_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [dbConnected, setDbConnected] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [activeTenantKey, setActiveTenantKey] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [tenantsData, setTenantsData] = useState(INITIAL_TENANTS_DATA);
  const [modal, setModal] = useState({
    isOpen: false,
    title: 'Notificación Vectorial',
    bodyHtml: '',
    actionText: 'Confirmar Acción',
    onAction: null,
  });

  const hydrateTenantsFromBackend = useCallback(() => {
    return tenantService
      .getTenants()
      .then((backendTenants) => {
        let localSnapshot = {};
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('vector_tenants_data');
            if (raw) localSnapshot = JSON.parse(raw);
          } catch (e) {}
        }

        const fresh = { ...localSnapshot };
        if (Array.isArray(backendTenants)) {
          backendTenants.forEach((bt) => {
            if (bt?.id) fresh[bt.id] = { ...(fresh[bt.id] || {}), ...bt };
          });
        }
        setTenantsData(fresh);
        try {
          useTenantStore.getState().setTenants(Object.values(fresh));
        } catch (e) {}

        const keys = Object.keys(fresh);
        if (keys.length > 0) {
          const currentKey =
            typeof window !== 'undefined' ? localStorage.getItem('vector_active_tenant_key') : null;
          const nextKey = currentKey && fresh[currentKey] ? currentKey : keys[0];
          setActiveTenantKey(nextKey);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vector_active_tenant_key', nextKey);
            localStorage.setItem('vector_active_tenant_id', nextKey);
          }
          try {
            useTenantStore.getState().setActiveTenantId(nextKey);
          } catch (e) {}
        } else {
          setActiveTenantKey(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('vector_active_tenant_key');
            localStorage.removeItem('vector_active_tenant_id');
          }
        }
      })
      .catch(() => {});
  }, []);

  // Sync preferences & verify real PostgreSQL session on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Purga automática de datos demo o teléfonos ficticios cacheados si la versión es previa a v11
    if (localStorage.getItem('vector_schema_version') !== 'v11_strict_postgres_auth') {
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
      localStorage.setItem('vector_schema_version', 'v11_strict_postgres_auth');
    }

    const savedTheme = localStorage.getItem('vector_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }

    const savedCollapsed = localStorage.getItem('vector_sidebar_collapsed');
    if (savedCollapsed !== null) {
      setIsSidebarCollapsed(savedCollapsed === 'true');
    }

    const savedUserId = localStorage.getItem('vector_user_id');
    if (!savedUserId) {
      setIsAuthenticated(false);
      setAuthChecking(false);
      setIsMounted(true);
      userService
        .checkHealth()
        .then((isUp) => setDbConnected(Boolean(isUp)))
        .catch(() => setDbConnected(false));
      return;
    }

    // Validar sesión activa en tiempo real contra PostgreSQL
    userService
      .getCurrentUser(savedUserId)
      .then((dbUser) => {
        if (!dbUser || !dbUser.id) {
          throw new Error('Usuario no encontrado en PostgreSQL');
        }
        const isClientRole = dbUser.role === 'CLIENT_OWNER' || dbUser.role === 'client';
        const resolvedRole = isClientRole ? 'client' : 'admin';
        const cleanPhone = dbUser.phone === '+52 55 1234 5678' ? '' : (dbUser.phone || '');
        const verifiedUser = {
          id: dbUser.id,
          name: dbUser.name || dbUser.ownerName || 'Edgar Lobo Vectorial',
          email: dbUser.email || 'Edgaradmin@vectorinside.com',
          phone: cleanPhone,
          role: resolvedRole,
          globalRole: dbUser.role || (isClientRole ? 'CLIENT_OWNER' : 'SUPER_ADMIN'),
          roleTitle: dbUser.roleLabel || (isClientRole ? 'Dueño de Negocio' : 'Super Admin'),
          avatar: dbUser.avatar || dbUser.tenantAvatar || '⚡',
          tenantKey:
            dbUser.tenantId ||
            (Array.isArray(dbUser.assignedTenants) ? dbUser.assignedTenants[0] : null),
        };

        setCurrentUser(verifiedUser);
        setRole(resolvedRole);
        setDbConnected(true);
        setIsAuthenticated(true);
        localStorage.setItem('vector_role', resolvedRole);
        localStorage.setItem('vector_real_role', resolvedRole);
        localStorage.setItem('vector_current_user', JSON.stringify(verifiedUser));

        hydrateTenantsFromBackend();
      })
      .catch(() => {
        // Si el servidor o la base de datos están apagados, invalidar sesión local y solicitar nuevo acceso
        setDbConnected(false);
        setIsAuthenticated(false);
        localStorage.removeItem('vector_user_id');
        localStorage.removeItem('vector_current_user');
        sessionStorage.setItem(
          'vector_auth_redirect_reason',
          'La sesión ha expirado o no se pudo establecer conexión con el servidor. Por favor inicia sesión nuevamente.'
        );
      })
      .finally(() => {
        setAuthChecking(false);
        setIsMounted(true);
      });
  }, [hydrateTenantsFromBackend]);

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
    if (!force && role === 'client' && newRole === 'admin') {
      const storedRealRole =
        typeof window !== 'undefined' ? localStorage.getItem('vector_real_role') : null;
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
    const targetTenant = userData.tenantKey || activeTenantKey || null;
    const cleanPhone = userData.phone === '+52 55 1234 5678' ? '' : (userData.phone || '');

    const normalizedUser = {
      id: userData.id || 'usr-admin-01',
      name: userData.name || 'Edgar Lobo Vectorial',
      email: userData.email || 'Edgaradmin@vectorinside.com',
      phone: cleanPhone,
      role: targetRole,
      globalRole: userData.globalRole || (targetRole === 'client' ? 'CLIENT_OWNER' : 'SUPER_ADMIN'),
      roleTitle: userData.roleTitle || (targetRole === 'client' ? 'Dueño de Negocio' : 'Super Admin'),
      avatar: userData.avatar || '⚡',
      tenantKey: targetTenant,
    };

    setCurrentUser(normalizedUser);
    setRole(targetRole);
    setIsAuthenticated(true);
    setDbConnected(true);
    setAuthChecking(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_role', targetRole);
      localStorage.setItem('vector_real_role', targetRole);
      localStorage.setItem('vector_user_id', normalizedUser.id);
      localStorage.setItem('vector_current_user', JSON.stringify(normalizedUser));
    }

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

    hydrateTenantsFromBackend();
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(DEFAULT_ADMIN_USER);
    setActiveTenantKey(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vector_user_id');
      localStorage.removeItem('vector_current_user');
      localStorage.removeItem('vector_role');
      localStorage.removeItem('vector_real_role');
      localStorage.removeItem('vector_active_tenant_key');
      localStorage.removeItem('vector_active_tenant_id');
    }
  }, []);

  const updateCurrentUserProfile = useCallback(
    async (updates) => {
      const targetId = updates?.id || currentUser?.id || 'usr-admin-01';
      const updatedFromDb = await userService.updateUserProfile(targetId, {
        name: updates.name !== undefined ? updates.name : currentUser?.name,
        phone: updates.phone !== undefined ? updates.phone : currentUser?.phone,
        email: updates.email !== undefined ? updates.email : currentUser?.email,
        roleTitle: updates.roleTitle !== undefined ? updates.roleTitle : currentUser?.roleTitle,
        avatar: updates.avatar !== undefined ? updates.avatar : currentUser?.avatar,
      });

      if (targetId === currentUser?.id || targetId === 'usr-admin-01') {
        const nextUser = {
          ...currentUser,
          name: updatedFromDb?.name || updates.name || currentUser.name,
          phone:
            updatedFromDb?.phone !== undefined
              ? updatedFromDb.phone
              : updates.phone !== undefined
              ? updates.phone
              : currentUser.phone,
          email: updatedFromDb?.email || updates.email || currentUser.email,
          avatar: updatedFromDb?.avatar || updates.avatar || currentUser.avatar,
        };
        setCurrentUser(nextUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vector_current_user', JSON.stringify(nextUser));
        }
      }
      return updatedFromDb;
    },
    [currentUser]
  );

  // Keep localStorage synchronized
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vector_tenants_data', JSON.stringify(tenantsData));
      } catch (e) {}
    }
  }, [tenantsData]);

  const switchTenantContext = (tenantKey) => {
    if (role === 'client') {
      console.warn(
        '[RLS Multi-Tenant] Operación denegada: Un usuario con rol Cliente está aislado y no puede conmutar el espacio de trabajo.'
      );
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
      const updated = {
        ...target,
        isAiActive: willBeActive,
        crisisMode: !willBeActive,
      };
      tenantService.updateTenant(tenantKey, updated).catch(() => {});
      return {
        ...prev,
        [tenantKey]: updated,
      };
    });
  };

  const updateTenantPolicy = async (tenantKey, updates) => {
    let updatedSnapshot = null;
    setTenantsData((prev) => {
      const target = prev[tenantKey];
      if (!target) return prev;
      updatedSnapshot = {
        ...target,
        ...updates,
      };
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('vector_tenants_data');
          const parsed = raw ? JSON.parse(raw) : {};
          parsed[tenantKey] = updatedSnapshot;
          localStorage.setItem('vector_tenants_data', JSON.stringify(parsed));
        } catch (e) {}
      }
      return {
        ...prev,
        [tenantKey]: updatedSnapshot,
      };
    });

    if (updatedSnapshot) {
      try {
        const persisted = await tenantService.updateTenant(tenantKey, updatedSnapshot);
        if (persisted) {
          setTenantsData((prev) => ({
            ...prev,
            [tenantKey]: { ...prev[tenantKey], ...persisted },
          }));
        }
        return { success: true, data: persisted };
      } catch (err) {
        console.error('[AuthContext.updateTenantPolicy] Error al persistir en backend:', err);
        return { success: false, error: err };
      }
    }
    return { success: false };
  };

  const updateTenantDna = async (tenantKey, brandDna) => {
    try {
      const persisted = await tenantService.updateBrandDna(tenantKey, brandDna);
      if (persisted) {
        setTenantsData((prev) => ({
          ...prev,
          [tenantKey]: { ...prev[tenantKey], ...persisted },
        }));
      }
      return persisted;
    } catch (err) {
      console.error('[AuthContext.updateTenantDna] Error al persistir ADN:', err);
      throw err;
    }
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
            ? trialDays !== undefined
              ? trialDays
              : target.microLandingTrialDaysLeft || 90
            : target.microLandingTrialDaysLeft || 0,
      };
      tenantService.updateTenant(tenantKey, updated).catch(() => {});
      return {
        ...prev,
        [tenantKey]: updated,
      };
    });
  };

  const registerTenant = (newTenant, makeActive = true) => {
    setTenantsData((prev) => {
      const next = {
        ...prev,
        [newTenant.id]: newTenant,
      };
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('vector_tenants_data');
          const parsed = raw ? JSON.parse(raw) : {};
          parsed[newTenant.id] = newTenant;
          localStorage.setItem('vector_tenants_data', JSON.stringify(parsed));
        } catch (e) {}
      }
      try {
        useTenantStore.getState().setTenants(Object.values(next));
      } catch (e) {}
      return next;
    });
    tenantService.createTenant(newTenant).catch(() => {});
    if (makeActive && newTenant?.id) {
      setActiveTenantKey(newTenant.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vector_active_tenant_key', newTenant.id);
        localStorage.setItem('vector_active_tenant_id', newTenant.id);
      }
      try {
        useTenantStore.getState().setActiveTenantId(newTenant.id);
      } catch (e) {}
    }
  };

  const deleteTenant = (tenantId) => {
    if (!tenantId) return;
    setTenantsData((prev) => {
      const updated = { ...prev };
      delete updated[tenantId];
      return updated;
    });

    tenantService.deleteTenant(tenantId).catch(() => {});

    setActiveTenantKey((currKey) => {
      if (currKey === tenantId) {
        const remainingKeys = Object.keys(tenantsData).filter((k) => k !== tenantId);
        return remainingKeys[0] || null;
      }
      return currKey;
    });
  };

  const triggerModal = (
    title,
    bodyHtml,
    onAction = null,
    actionText = 'Confirmar Acción',
    variant = 'default'
  ) => {
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

  const activeTenant =
    (activeTenantKey && tenantsData[activeTenantKey]) || Object.values(tenantsData)[0] || null;

  const isAdmin = role === 'admin';
  const isClient = role === 'client';
  const isSuperAdmin =
    isAdmin &&
    (currentUser?.globalRole === 'SUPER_ADMIN' ||
      currentUser?.role === 'SUPER_ADMIN' ||
      currentUser?.id === 'usr-admin-01' ||
      currentUser?.email?.toLowerCase().includes('edgaradmin') ||
      currentUser?.name?.toLowerCase().includes('lobo vectorial'));

  const permissions = {
    canSwitchTenant: isAdmin,
    canManageTeam: isSuperAdmin,
    canConfigureAi: isAdmin,
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        currentUser,
        isAuthenticated,
        authChecking,
        dbConnected,
        isAdmin,
        isSuperAdmin,
        isClient,
        permissions,
        isMounted,
        switchRole,
        loginAs,
        logout,
        updateCurrentUserProfile,
        theme,
        toggleTheme,
        activeTenantKey,
        activeTenant,
        tenantsData,
        switchTenantContext,
        toggleTenantAi,
        updateTenantPolicy,
        updateTenantDna,
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
