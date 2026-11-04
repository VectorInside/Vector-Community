import api, { isBackendAvailable, unwrapApiData } from './api';

export const campaignService = {
  async getCampaigns(tenantId) {
    if (!tenantId) return [];
    if (!isBackendAvailable) return [];
    try {
      const response = await api.get('/campaigns', { params: { tenantId } });
      const data = unwrapApiData(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  },

  async createCampaign(campaignData) {
    try {
      const response = await api.post('/campaigns', campaignData);
      return unwrapApiData(response);
    } catch (error) {
      return campaignData;
    }
  },

  async toggleCampaignStatus(id, newStatus) {
    try {
      const response = await api.patch(`/campaigns/${id}/status`, { status: newStatus });
      return unwrapApiData(response);
    } catch (error) {
      return { id, status: newStatus };
    }
  },

  async deleteCampaign(id) {
    try {
      await api.delete(`/campaigns/${id}`);
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  },
};

export default campaignService;
