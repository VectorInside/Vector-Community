'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, USER_ROLES } from '@/utils/constants';
import { useTenantStore } from '@/hooks/useTenant';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setActiveTenantId } = useTenantStore();

  useEffect(() => {
    // Check localStorage for saved session
    try {
      const storedUser = localStorage.getItem('vector_user');
      const token = localStorage.getItem('jwt_token');

      if (storedUser && token) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === USER_ROLES.CLIENT_READ_ONLY && parsed.tenantId) {
          setActiveTenantId(parsed.tenantId);
        }
      } else {
        // Default to Super Admin for immediate testing if not logged in
        const defaultAdmin = DEMO_USERS[0];
        setUser(defaultAdmin);
        localStorage.setItem('vector_user', JSON.stringify(defaultAdmin));
        localStorage.setItem('jwt_token', 'mock-jwt-token-super-admin-vector-inside');
      }
    } catch (e) {
      console.error('Error loading auth from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, [setActiveTenantId]);

  const login = (email, password = '') => {
    // Find matching demo user or create mock session
    const matchedUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || DEMO_USERS[0];
    const token = `jwt_${matchedUser.role}_${Date.now()}`;

    setUser(matchedUser);
    localStorage.setItem('vector_user', JSON.stringify(matchedUser));
    localStorage.setItem('jwt_token', token);

    // If client read only, enforce lock on their tenant
    if (matchedUser.role === USER_ROLES.CLIENT_READ_ONLY && matchedUser.tenantId) {
      setActiveTenantId(matchedUser.tenantId);
    }

    return matchedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vector_user');
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  };

  const switchUserRole = (role) => {
    const targetUser = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(targetUser);
    localStorage.setItem('vector_user', JSON.stringify(targetUser));
    localStorage.setItem('jwt_token', `jwt_${targetUser.role}_${Date.now()}`);

    if (targetUser.role === USER_ROLES.CLIENT_READ_ONLY && targetUser.tenantId) {
      setActiveTenantId(targetUser.tenantId);
    }
  };

  // RBAC permissions helpers
  const isSuperAdmin = user?.role === USER_ROLES.SUPER_ADMIN_AGENCY;
  const isCommunityManager = user?.role === USER_ROLES.COMMUNITY_MANAGER;
  const isClientReadOnly = user?.role === USER_ROLES.CLIENT_READ_ONLY;

  const permissions = {
    canSwitchTenant: isSuperAdmin || isCommunityManager,
    canAccessHITLInbox: isSuperAdmin || isCommunityManager,
    canApproveAlerts: isSuperAdmin || isCommunityManager,
    canViewAgenda: true, // all roles
    canEditAgenda: isSuperAdmin || isCommunityManager,
    canViewPerformance: isSuperAdmin || isClientReadOnly,
    canEditSettings: isSuperAdmin || isCommunityManager,
    canViewApiKeys: isSuperAdmin,
    canEditPrompts: isSuperAdmin,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        switchUserRole,
        isSuperAdmin,
        isCommunityManager,
        isClientReadOnly,
        permissions,
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
