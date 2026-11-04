import api, { isBackendAvailable, unwrapApiData } from './api';

export const normalizePostFromApi = (post) => {
  if (!post) return null;
  const rawConf = post.aiConfidence;
  const aiConfidenceStr = typeof rawConf === 'number'
    ? `${rawConf}% Match con ADN`
    : (rawConf || '96% Match con ADN');

  return {
    id: post.id,
    tenantId: post.tenantId || 'dental',
    network: post.network || 'INSTAGRAM',
    type: post.type || 'Reel 9:16',
    channel: post.channel || 'WHATSAPP',
    publishDate: post.publishDate || 'Viernes · 19:00',
    title: post.title || 'Publicación Estratégica',
    hookText: post.hookText || '',
    copy: post.copy || '',
    hashtags: post.hashtags || '',
    status: post.status || 'PENDIENTE_CLIENTE',
    estimatedReach: post.estimatedReach || '4,500 - 7,200 cuentas',
    aiConfidence: aiConfidenceStr,
    createdAt: post.createdAt,
  };
};

export const serializePostToApi = (post) => {
  let numericConfidence = 96;
  if (typeof post.aiConfidence === 'number') {
    numericConfidence = post.aiConfidence;
  } else if (typeof post.aiConfidence === 'string') {
    const match = post.aiConfidence.match(/\d+/);
    if (match) numericConfidence = parseInt(match[0], 10);
  }

  return {
    id: post.id || undefined,
    tenantId: post.tenantId || 'dental',
    network: post.network || 'INSTAGRAM',
    type: post.type || 'Reel 9:16',
    channel: post.channel || 'WHATSAPP',
    publishDate: post.publishDate || 'Viernes · 19:00',
    title: post.title || 'Publicación Estratégica',
    hookText: post.hookText || '',
    copy: post.copy || '',
    hashtags: post.hashtags || '',
    status: post.status || 'PENDIENTE_CLIENTE',
    estimatedReach: post.estimatedReach || '4,500 - 7,200 cuentas',
    aiConfidence: numericConfidence,
  };
};

export const contentService = {
  async getPostsByTenant(tenantId) {
    if (!isBackendAvailable) return [];
    try {
      const response = await api.get('/posts', { params: { tenantId } });
      const data = unwrapApiData(response);
      if (Array.isArray(data)) {
        return data.map(normalizePostFromApi).filter(Boolean);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async createPost(postData) {
    const payload = serializePostToApi(postData);
    const response = await api.post('/posts', payload);
    return normalizePostFromApi(unwrapApiData(response));
  },

  async approvePost(postId) {
    const response = await api.patch(`/posts/${postId}/approve`);
    return normalizePostFromApi(unwrapApiData(response));
  },

  async deletePost(postId) {
    await api.delete(`/posts/${postId}`);
    return { success: true };
  },
};

