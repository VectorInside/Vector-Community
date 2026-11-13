import api, { unwrapApiData } from './api';

export const reengagementService = {
  /**
   * Obtiene la cola de prospectos candidatos a re-contacto tras 24h de inactividad
   * Regla 95/5 y Generador Vaca Púrpura (< 40 palabras)
   */
  async getReengagementQueue(tenantId) {
    if (!tenantId) {
      return {
        tenantId: null,
        reengagementDelayHours: 24,
        totalInQueue: 0,
        pendingCount: 0,
        dispatchedCount: 0,
        aiEngine: 'DeepSeek V3 / R1 (Activo)',
        tokenOptimization: 'Vaca Púrpura < 40 palabras (Zero Waste Tokens)',
        candidates: [],
      };
    }
    try {
      const response = await api.get(`/messaging/reengagement/${tenantId}`);
      const data = unwrapApiData(response);
      return data || {
        tenantId,
        reengagementDelayHours: 24,
        totalInQueue: 0,
        pendingCount: 0,
        dispatchedCount: 0,
        aiEngine: 'DeepSeek V3 / R1 (Activo)',
        tokenOptimization: 'Vaca Púrpura < 40 palabras (Zero Waste Tokens)',
        candidates: [],
      };
    } catch (err) {
      console.warn('[reengagementService] Error al obtener cola de re-contacto:', err?.message);
      return {
        tenantId,
        reengagementDelayHours: 24,
        totalInQueue: 0,
        pendingCount: 0,
        dispatchedCount: 0,
        aiEngine: 'DeepSeek V3 / R1 (Activo)',
        tokenOptimization: 'Vaca Púrpura < 40 palabras (Zero Waste Tokens)',
        candidates: [],
      };
    }
  },

  /**
   * Dispara el re-contacto individual asistido / HITL para un prospecto específico
   */
  async triggerSingle(tenantId, conversationId, customCopyOverride = null) {
    if (!tenantId || !conversationId) return null;
    const payload = customCopyOverride ? { customCopyOverride } : {};
    const response = await api.post(`/messaging/reengagement/${tenantId}/conversations/${conversationId}/trigger`, payload);
    return unwrapApiData(response);
  },

  /**
   * Dispara en lote el re-contacto para todos los prospectos pendientes que cumplieron la ventana de inactividad
   */
  async triggerBatch(tenantId) {
    if (!tenantId) return { processed: 0, successful: 0, failed: 0 };
    const response = await api.post(`/messaging/reengagement/${tenantId}/batch`);
    return unwrapApiData(response);
  },
};

export default reengagementService;
