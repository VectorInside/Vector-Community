import api, { unwrapApiData } from './api';

/**
 * ============================================================================
 * SERVICIO DE GESTIÓN DE IDENTIDADES Y EQUIPO (IAM & USER SERVICE)
 * ============================================================================
 * Maneja la sincronización y persistencia estricta con PostgreSQL 17 (v-community-backend)
 * Módulos REST: /api/v1/users (staff, owners, perfil, membresías, soft-delete, login)
 * ============================================================================
 */

export const userService = {
  /**
   * Comprueba en tiempo real la conectividad y salud del backend (PostgreSQL)
   */
  async checkHealth() {
    try {
      const response = await api.get('/health');
      const data = unwrapApiData(response);
      return data?.status === 'UP' || response?.status === 200;
    } catch {
      return false;
    }
  },

  /**
   * Autenticación estricta contra PostgreSQL 17
   * Lanza error si el servidor backend o la base de datos PostgreSQL están apagados.
   */
  async login({ email, password }) {
    const response = await api.post('/users/login', { email, password });
    const data = unwrapApiData(response);
    if (data && data.phone === '+52 55 1234 5678') {
      data.phone = '';
    }
    return data;
  },

  /**
   * Actualiza la contraseña personal definitiva y desactiva mustChangePassword
   */
  async changePassword(userId, newPassword) {
    if (!userId) {
      throw new Error('ID de usuario requerido para actualizar contraseña.');
    }
    const response = await api.post(`/users/${userId}/change-password`, { newPassword });
    return unwrapApiData(response);
  },

  /**
   * Verifica la sesión activa y obtiene el perfil real del usuario desde PostgreSQL 17
   */
  async getCurrentUser(userId) {
    if (!userId) {
      throw new Error('ID de usuario no proporcionado para verificación de sesión.');
    }
    const response = await api.get(`/users/${userId}`);
    const data = unwrapApiData(response);
    if (data && data.phone === '+52 55 1234 5678') {
      data.phone = '';
    }
    return data;
  },

  /**
   * Actualiza los datos de perfil (nombre, teléfono, correo, cargo, avatar) en PostgreSQL 17
   */
  async updateUserProfile(userId, profileData) {
    const targetId = userId || 'usr-admin-01';
    const response = await api.put(`/users/${targetId}/profile`, profileData);
    return unwrapApiData(response);
  },

  /**
   * Obtiene la lista de colaboradores de la agencia (SUPER_ADMIN, ADMIN, OPERATOR) desde PostgreSQL 17
   */
  async getAgencyStaff() {
    const response = await api.get('/users/staff');
    const data = unwrapApiData(response);
    if (Array.isArray(data)) {
      return data.map((member) => ({
        ...member,
        phone: member.phone === '+52 55 1234 5678' ? '' : (member.phone || ''),
      }));
    }
    return [];
  },

  async getStaff() {
    return this.getAgencyStaff();
  },

  /**
   * Obtiene la lista de cuentas de dueños de negocio (1:1 Tenant Owner) desde PostgreSQL 17
   */
  async getTenantOwners() {
    const response = await api.get('/users/owners');
    const data = unwrapApiData(response);
    return Array.isArray(data) ? data : [];
  },

  async getOwners() {
    return this.getTenantOwners();
  },

  /**
   * Registra e invita a un nuevo miembro al equipo interno en PostgreSQL 17
   */
  async createStaff(staffData) {
    const payload = {
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone || '',
      role: staffData.role,
      assignedTenants:
        staffData.assignedTenantsMode === 'all'
          ? []
          : (Array.isArray(staffData.customTenants) ? staffData.customTenants : []),
    };
    const response = await api.post('/users/staff', payload);
    return unwrapApiData(response);
  },

  /**
   * Registra y vincula la cuenta dueña de un negocio en PostgreSQL 17
   */
  async createTenantOwner(ownerData) {
    const response = await api.post('/users/owners', ownerData);
    return unwrapApiData(response);
  },

  /**
   * Actualiza el estado de un usuario (ACTIVE, SUSPENDED, PENDING_INVITE) en PostgreSQL 17
   */
  async updateUserStatus(userId, status) {
    const response = await api.put(`/users/${userId}/status`, { status });
    return unwrapApiData(response);
  },

  /**
   * Actualiza los tenants asignados a un colaborador en PostgreSQL 17
   */
  async updateAssignedTenants(userId, { assignedTenantsMode, customTenants }) {
    const assignedTenants =
      assignedTenantsMode === 'all'
        ? []
        : (Array.isArray(customTenants) ? customTenants : []);
    const response = await api.put(`/users/${userId}/assigned-tenants`, { assignedTenants });
    return unwrapApiData(response);
  },

  /**
   * Soft Delete: Borrado lógico seguro de un usuario o cuenta en PostgreSQL 17
   */
  async deleteUser(userId) {
    await api.delete(`/users/${userId}`);
    return { success: true };
  },
};

export default userService;
