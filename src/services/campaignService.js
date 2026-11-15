import api, { isBackendAvailable, unwrapApiData } from './api';

const getStorageKey = (tenantId) => `vector_campaigns_${tenantId || 'global'}`;

export const campaignService = {
  async getCampaigns(tenantId) {
    if (!tenantId) return [];

    // 1. Intentar Backend si está habilitado
    if (isBackendAvailable) {
      try {
        const response = await api.get('/campaigns', { params: { tenantId } });
        const data = unwrapApiData(response);
        if (Array.isArray(data) && data.length > 0) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(getStorageKey(tenantId), JSON.stringify(data));
          }
          return data;
        }
      } catch (error) {
        // Fallback a localStorage
      }
    }

    // 2. Respaldo multi-tenant en localStorage
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem(getStorageKey(tenantId));
        if (local) {
          const parsed = JSON.parse(local);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  async saveCampaigns(tenantId, campaigns) {
    if (!tenantId) return [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(tenantId), JSON.stringify(campaigns || []));
      } catch (e) {}
    }
    return campaigns;
  },

  async createCampaign(campaignData, tenantId) {
    const targetTenant = tenantId || campaignData?.tenantId;
    if (typeof window !== 'undefined' && targetTenant) {
      try {
        const current = await this.getCampaigns(targetTenant);
        const updated = [campaignData, ...current];
        await this.saveCampaigns(targetTenant, updated);
      } catch (e) {}
    }

    if (isBackendAvailable) {
      try {
        const response = await api.post('/campaigns', campaignData);
        return unwrapApiData(response) || campaignData;
      } catch (error) {
        return campaignData;
      }
    }
    return campaignData;
  },

  async toggleCampaignStatus(id, newStatus, tenantId) {
    if (typeof window !== 'undefined' && tenantId) {
      try {
        const current = await this.getCampaigns(tenantId);
        const updated = current.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
        await this.saveCampaigns(tenantId, updated);
      } catch (e) {}
    }

    if (isBackendAvailable) {
      try {
        const response = await api.patch(`/campaigns/${id}/status`, { status: newStatus });
        return unwrapApiData(response);
      } catch (error) {
        return { id, status: newStatus };
      }
    }
    return { id, status: newStatus };
  },

  async deleteCampaign(id, tenantId) {
    if (typeof window !== 'undefined' && tenantId) {
      try {
        const current = await this.getCampaigns(tenantId);
        const updated = current.filter((c) => c.id !== id);
        await this.saveCampaigns(tenantId, updated);
      } catch (e) {}
    }

    if (isBackendAvailable) {
      try {
        await api.delete(`/campaigns/${id}`);
        return { success: true };
      } catch (error) {
        return { success: true };
      }
    }
    return { success: true };
  },
};

export default campaignService;
