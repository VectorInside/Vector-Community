import api, { unwrapApiData } from './api';

export const metaCommentService = {
  /**
   * Obtiene comentarios en vivo filtrados por categoría (LEAD, FAQ, TOXIC, ALL)
   */
  async getComments(tenantId, category = 'ALL', status = 'ALL') {
    if (!tenantId) return [];
    try {
      const response = await api.get('/meta/comments', {
        params: { tenantId, category, status },
      });
      return unwrapApiData(response) || [];
    } catch (err) {
      console.warn('[metaCommentService] Error obteniendo comentarios de Meta:', err.message);
      return [];
    }
  },

  /**
   * Obtiene publicaciones y Reels analizados del perfil
   */
  async getPosts(tenantId) {
    if (!tenantId) return [];
    try {
      const response = await api.get('/meta/posts', {
        params: { tenantId },
      });
      return unwrapApiData(response) || [];
    } catch (err) {
      console.warn('[metaCommentService] Error obteniendo publicaciones de Meta:', err.message);
      return [];
    }
  },

  /**
   * Publica una respuesta oficial en el hilo del comentario en Instagram
   */
  async replyToComment(commentId, tenantId, text) {
    const response = await api.post(`/meta/comments/${commentId}/reply`, {
      tenantId,
      text,
    });
    return unwrapApiData(response);
  },

  /**
   * Despacha un mensaje directo (Private Reply / DM) vía Meta Graph API
   */
  async sendPrivateDm(commentId, tenantId, message = null) {
    const response = await api.post(
      `/meta/comments/${commentId}/dm`,
      message ? { message } : {},
      { params: { tenantId } }
    );
    return unwrapApiData(response);
  },

  /**
   * Oculta un comentario tóxico o spam en Instagram
   */
  async hideComment(commentId, tenantId) {
    const response = await api.patch(
      `/meta/comments/${commentId}/hide`,
      {},
      { params: { tenantId } }
    );
    return unwrapApiData(response);
  },

  /**
   * Convierte un comentario de alto valor en prospecto formal del CRM Kanban
   */
  async convertToLead(commentId, tenantId) {
    const response = await api.post(
      `/meta/comments/${commentId}/convert-lead`,
      {},
      { params: { tenantId } }
    );
    return unwrapApiData(response);
  },

  /**
   * Sincroniza publicaciones y métricas recientes desde Meta Graph API
   */
  async syncPosts(tenantId) {
    if (!tenantId) return { syncedPostsCount: 0 };
    const response = await api.post(`/meta/sync/${tenantId}`);
    return unwrapApiData(response);
  },

  /**
   * Ejecuta auditoría con IA de congruencia de publicaciones con el Manual de Identidad
   */
  async getBrandAudit(tenantId) {
    if (!tenantId) return null;
    try {
      const response = await api.get(`/meta/brand-audit/${tenantId}`);
      return unwrapApiData(response);
    } catch (err) {
      console.warn('[metaCommentService] Error en auditoría de marca:', err.message);
      return null;
    }
  },

  /**
   * Obtiene estado de conexión, webhook callback URL y permisos
   */
  async getHealthAndConfig(tenantId) {
    if (!tenantId) return null;
    try {
      const response = await api.get(`/meta/health/${tenantId}`);
      return unwrapApiData(response);
    } catch (err) {
      console.warn('[metaCommentService] Error obteniendo salud de Meta:', err.message);
      return null;
    }
  },

  /**
   * Guarda o actualiza credenciales de Instagram Business en backend
   */
  async connectInstagram(tenantId, { instagramAccountId, accountHandle, accessToken, webhookVerifyToken }) {
    const response = await api.post(`/meta/connect/${tenantId}`, {
      instagramAccountId,
      accountHandle,
      accessToken,
      webhookVerifyToken,
    });
    return unwrapApiData(response);
  },
};
