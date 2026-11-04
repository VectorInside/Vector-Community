import api, { isBackendAvailable, unwrapApiData } from './api';
import { INITIAL_BUSINESS_ACCOUNTS, INITIAL_AGENCY_STAFF } from '@/utils/mockAccounts';

/**
 * ============================================================================
 * SERVICIO DE GESTIÓN DE IDENTIDADES Y EQUIPO (IAM & USER SERVICE)
 * ============================================================================
 * Maneja la sincronización y persistencia con PostgreSQL 17 (v-community-backend)
 * Módulos REST: /api/v1/users (staff, owners, membresías, soft-delete, login)
 * Con fallback resiliente y soporte offline/híbrido.
 * ============================================================================
 */

export const userService = {
  /**
   * Autenticación contra PostgreSQL 17
   */
  async login({ email, password }) {
    try {
      const response = await api.post('/users/login', { email, password });
      return unwrapApiData(response);
    } catch (error) {
      console.warn('[userService.login] Fallback o error en login backend:', error?.message);
      throw error;
    }
  },

  /**
   * Obtiene la lista de colaboradores de la agencia (SUPER_ADMIN, ADMIN)
   */
  async getAgencyStaff() {
    if (!isBackendAvailable) return INITIAL_AGENCY_STAFF;
    try {
      const response = await api.get('/users/staff');
      const data = unwrapApiData(response);
      if (Array.isArray(data)) {
        return data;
      }
      return INITIAL_AGENCY_STAFF;
    } catch (error) {
      console.warn('[userService.getAgencyStaff] Fallback a datos locales:', error?.message);
      return INITIAL_AGENCY_STAFF;
    }
  },

  /**
   * Obtiene la lista de cuentas de dueños de negocio (1:1 Tenant Owner)
   */
  async getTenantOwners() {
    if (!isBackendAvailable) return INITIAL_BUSINESS_ACCOUNTS;
    try {
      const response = await api.get('/users/owners');
      const data = unwrapApiData(response);
      if (Array.isArray(data)) {
        return data;
      }
      return INITIAL_BUSINESS_ACCOUNTS;
    } catch (error) {
      console.warn('[userService.getTenantOwners] Fallback a datos locales:', error?.message);
      return INITIAL_BUSINESS_ACCOUNTS;
    }
  },

  /**
   * Registra e invita a un nuevo miembro al equipo interno
   */
  async createStaff(staffData) {
    try {
      const payload = {
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role,
        assignedTenants:
          staffData.assignedTenantsMode === 'all'
            ? []
            : (Array.isArray(staffData.customTenants) ? staffData.customTenants : []),
      };
      const response = await api.post('/users/staff', payload);
      return unwrapApiData(response);
    } catch (error) {
      console.warn('[userService.createStaff] Fallback local:', error?.message);
      return {
        id: `staff-${Date.now()}`,
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role,
        roleLabel: staffData.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Administrador',
        avatar: staffData.role === 'SUPER_ADMIN' ? '⚡' : '💼',
        status: 'PENDING_INVITE',
        assignedTenants: staffData.assignedTenantsMode === 'all' ? 'all' : (staffData.customTenants || []),
        lastLogin: 'Invitación enviada por correo',
        createdAt: new Date().toISOString(),
        twoFactorEnabled: false,
      };
    }
  },

  /**
   * Registra y vincula la cuenta dueña de un negocio
   */
  async createTenantOwner(ownerData) {
    try {
      const response = await api.post('/users/owners', ownerData);
      return unwrapApiData(response);
    } catch (error) {
      console.warn('[userService.createTenantOwner] Fallback local:', error?.message);
      return {
        id: `acc-${ownerData.tenantId}`,
        tenantId: ownerData.tenantId,
        tenantName: ownerData.tenantName,
        tenantAvatar: '🏢',
        giro: 'Servicios',
        ownerName: ownerData.ownerName,
        email: ownerData.email,
        phone: ownerData.phone,
        tempPassword: ownerData.password || 'TempPass#2026',
        mustChangePassword: true,
        status: 'ACTIVE',
        lastLogin: 'Invitación enviada (Sin ingresar)',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        notes: ownerData.notes || '',
      };
    }
  },

  /**
   * Actualiza el estado de un usuario (ACTIVE, SUSPENDED, PENDING_INVITE)
   */
  async updateUserStatus(userId, status) {
    try {
      const response = await api.put(`/users/${userId}/status`, { status });
      return unwrapApiData(response);
    } catch (error) {
      console.warn(`[userService.updateUserStatus] Fallback para ${userId}:`, error?.message);
      return { success: true, userId, status, localOnly: true };
    }
  },

  /**
   * Actualiza los tenants asignados a un colaborador
   */
  async updateAssignedTenants(userId, { assignedTenantsMode, customTenants }) {
    try {
      const assignedTenants = assignedTenantsMode === 'all' ? [] : (Array.isArray(customTenants) ? customTenants : []);
      const response = await api.put(`/users/${userId}/assigned-tenants`, { assignedTenants });
      return unwrapApiData(response);
    } catch (error) {
      console.warn(`[userService.updateAssignedTenants] Fallback para ${userId}:`, error?.message);
      return { success: true, userId, localOnly: true };
    }
  },

  /**
   * Soft Delete: Borrado lógico seguro de un usuario o cuenta
   */
  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`);
      return { success: true };
    } catch (error) {
      console.warn(`[userService.deleteUser] Fallback para ${userId}:`, error?.message);
      return { success: true, localOnly: true };
    }
  },
};

export default userService;
