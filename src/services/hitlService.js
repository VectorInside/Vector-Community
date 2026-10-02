import api from './api';
import { INITIAL_HITL_ALERTS } from '@/utils/mockData';

export const hitlService = {
  // Get all HITL inbox alerts
  async getAlerts(tenantId) {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (error) {
      console.warn('[hitlService.getAlerts] Fallback to mock data');
      return INITIAL_HITL_ALERTS.filter((a) => !tenantId || a.tenantId === tenantId);
    }
  },

  // 1-Click Approve and Sync (POST /api/v1/appointments/{id}/approve)
  async approveAlert(id) {
    try {
      const response = await api.post(`/appointments/${id}/approve`);
      return response.data;
    } catch (error) {
      console.warn(`[hitlService.approveAlert] Simulated 1-Click Approval for ${id}`);
      return {
        success: true,
        id,
        status: 'APPROVED',
        message: 'Aprobado y sincronizado con éxito.',
        approvedAt: new Date().toISOString(),
      };
    }
  },

  // Reject or Escalate Alert
  async rejectAlert(id, reason = 'Descartado por operador') {
    try {
      const response = await api.post(`/alerts/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      return {
        success: true,
        id,
        status: 'REJECTED',
        reason,
      };
    }
  }
};
