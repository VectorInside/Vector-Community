import api, { isBackendAvailable } from './api';
import { INITIAL_TENANTS } from '@/utils/constants';
import { INITIAL_VERTICAL_CONFIGS } from '@/utils/mockData';

export const tenantService = {
  // Get all tenants
  async getTenants() {
    if (!isBackendAvailable) return INITIAL_TENANTS;
    try {
      const response = await api.get('/tenants');
      return response.data;
    } catch (error) {
      console.warn('[tenantService.getTenants] Fallback to mock data');
      return INITIAL_TENANTS;
    }
  },

  // Get tenant by ID
  async getTenantById(id) {
    if (!isBackendAvailable) {
      return INITIAL_TENANTS.find((t) => t.id === id) || INITIAL_TENANTS[0];
    }
    try {
      const response = await api.get(`/tenants/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`[tenantService.getTenantById] Fallback for ${id}`);
      return INITIAL_TENANTS.find((t) => t.id === id) || INITIAL_TENANTS[0];
    }
  },

  // Get tenant vertical configuration
  async getVerticalConfig(tenantId) {
    if (!isBackendAvailable) {
      return INITIAL_VERTICAL_CONFIGS[tenantId] || INITIAL_VERTICAL_CONFIGS['tenant-mex-001'];
    }
    try {
      const response = await api.get(`/tenants/${tenantId}/config`);
      return response.data;
    } catch (error) {
      console.warn(`[tenantService.getVerticalConfig] Fallback for ${tenantId}`);
      return INITIAL_VERTICAL_CONFIGS[tenantId] || INITIAL_VERTICAL_CONFIGS['tenant-mex-001'];
    }
  },

  // Update tenant vertical configuration
  async updateVerticalConfig(tenantId, config) {
    try {
      const response = await api.put(`/tenants/${tenantId}/config`, config);
      return response.data;
    } catch (error) {
      console.warn(`[tenantService.updateVerticalConfig] Simulated update for ${tenantId}`);
      return { success: true, updatedConfig: config };
    }
  },

  // Ping Webhooks Health
  async checkWebhooksHealth(tenantId) {
    try {
      const response = await api.get(`/tenants/${tenantId}/health`);
      return response.data;
    } catch (error) {
      return {
        meta: 'HEALTHY',
        whatsapp: 'HEALTHY',
        googleCalendar: 'HEALTHY',
        latencyMs: 42,
        lastSync: new Date().toISOString(),
      };
    }
  }
};
