import api, { unwrapApiData } from './api';

/**
 * Servicio de Inteligencia Artificial Hexagonal (Vector Community).
 * Consume los endpoints de /api/v1/ai con cifrado AES-256-GCM y ledger de tokens.
 */
export const aiService = {
  /**
   * Obtiene la configuración de IA segura del tenant (sin exponer ciphertext ni clave completa).
   */
  async getConfig(tenantId) {
    try {
      const response = await api.get(`/ai/config/${tenantId}`);
      return unwrapApiData(response);
    } catch (error) {
      console.warn(`[aiService] Error al consultar config de IA para tenant ${tenantId}:`, error?.message);
      return null;
    }
  },

  /**
   * Guarda de forma segura la API Key propia del negocio (BYOK) con cifrado AES-256-GCM en el backend.
   */
  async saveConfig(tenantId, { provider = 'DEEPSEEK', apiKey, model, monthlyTokenQuota = 250000, allowFallbackToGlobal = true }) {
    const response = await api.put(`/ai/config/${tenantId}`, {
      provider,
      apiKey,
      model,
      monthlyTokenQuota,
      allowFallbackToGlobal,
    });
    return unwrapApiData(response);
  },

  /**
   * Prueba conectividad de la API Key registrada.
   */
  async testConnection(tenantId) {
    const response = await api.post(`/ai/config/${tenantId}/test`);
    return unwrapApiData(response);
  },

  /**
   * Elimina la clave BYOK y restablece el tenant al pool global de la agencia.
   */
  async deleteConfig(tenantId) {
    const response = await api.delete(`/ai/config/${tenantId}`);
    return unwrapApiData(response);
  },

  /**
   * Despacha un mensaje de chat interactivo o HITL.
   */
  async chat({ tenantId, message, conversationHistory = [] }) {
    const response = await api.post('/ai/chat', {
      tenantId,
      message,
      conversationHistory,
    });
    return unwrapApiData(response);
  },

  /**
   * Genera copys y sugerencias de contenido guiado por Brand DNA.
   */
  async generateContent({ tenantId, topicPrompt, channel = 'INSTAGRAM', tone = 'DIRECTO' }) {
    const response = await api.post('/ai/generate-content', {
      tenantId,
      topicPrompt,
      channel,
      tone,
    });
    return unwrapApiData(response);
  },

  /**
   * Consulta auditoría financiera y contabilidad de tokens.
   */
  async getUsage(tenantId, from, to) {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const response = await api.get(`/ai/usage/${tenantId}`, { params });
    return unwrapApiData(response);
  },
};

