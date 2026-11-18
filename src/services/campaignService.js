import api, { isBackendAvailable, unwrapApiData } from './api';

const getStorageKey = (tenantId) => `vector_campaigns_${tenantId || 'global'}`;

export const campaignService = {
  async getCampaigns(tenantId) {
    if (!tenantId) return [];

    // 1. Intentar Backend si está habilitado
    if (isBackendAvailable) {
      const response = await api.get('/campaigns', { params: { tenantId } });
      const data = unwrapApiData(response);
      const list = Array.isArray(data) ? data : [];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(getStorageKey(tenantId), JSON.stringify(list));
        } catch (e) {}
      }
      return list;
    }

    // 2. Respaldo multi-tenant en localStorage solo cuando el backend está deshabilitado
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
    const payload = targetTenant ? { ...campaignData, tenantId: targetTenant } : campaignData;

    if (isBackendAvailable) {
      const response = await api.post(
        '/campaigns',
        payload,
        targetTenant ? { params: { tenantId: targetTenant } } : undefined
      );
      const created = unwrapApiData(response) || payload;

      if (typeof window !== 'undefined' && targetTenant) {
        try {
          const local = localStorage.getItem(getStorageKey(targetTenant));
          const current = local ? JSON.parse(local) : [];
          const list = Array.isArray(current) ? current : [];
          await this.saveCampaigns(targetTenant, [created, ...list.filter((c) => c.id !== created.id)]);
        } catch (e) {}
      }

      return created;
    }

    if (typeof window !== 'undefined' && targetTenant) {
      const current = await this.getCampaigns(targetTenant);
      await this.saveCampaigns(targetTenant, [payload, ...current]);
    }
    return payload;
  },

  async updateCampaign(id, updates, tenantId) {
    if (isBackendAvailable) {
      const response = await api.put(
        `/campaigns/${id}`,
        updates,
        tenantId ? { params: { tenantId } } : undefined
      );
      const updatedItem = unwrapApiData(response) || { id, ...updates };

      if (typeof window !== 'undefined' && tenantId) {
        try {
          const local = localStorage.getItem(getStorageKey(tenantId));
          const current = local ? JSON.parse(local) : [];
          if (Array.isArray(current)) {
            await this.saveCampaigns(
              tenantId,
              current.map((c) => (c.id === id ? { ...c, ...updatedItem } : c))
            );
          }
        } catch (e) {}
      }

      return updatedItem;
    }

    if (typeof window !== 'undefined' && tenantId) {
      const current = await this.getCampaigns(tenantId);
      const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
      await this.saveCampaigns(tenantId, updated);
    }
    return { id, ...updates };
  },

  async toggleCampaignStatus(id, newStatus, tenantId) {
    if (isBackendAvailable) {
      const response = await api.patch(
        `/campaigns/${id}/status`,
        { status: newStatus },
        tenantId ? { params: { tenantId } } : undefined
      );
      const result = unwrapApiData(response) || { id, status: newStatus };

      if (typeof window !== 'undefined' && tenantId) {
        try {
          const local = localStorage.getItem(getStorageKey(tenantId));
          const current = local ? JSON.parse(local) : [];
          if (Array.isArray(current)) {
            await this.saveCampaigns(
              tenantId,
              current.map((c) => (c.id === id ? { ...c, status: result.status || newStatus } : c))
            );
          }
        } catch (e) {}
      }

      return result;
    }

    if (typeof window !== 'undefined' && tenantId) {
      const current = await this.getCampaigns(tenantId);
      const updated = current.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
      await this.saveCampaigns(tenantId, updated);
    }
    return { id, status: newStatus };
  },

  async deleteCampaign(id, tenantId) {
    if (isBackendAvailable) {
      const response = await api.delete(`/campaigns/${id}`);
      const result = unwrapApiData(response) || { id, deleted: true };

      if (typeof window !== 'undefined' && tenantId) {
        try {
          const local = localStorage.getItem(getStorageKey(tenantId));
          const current = local ? JSON.parse(local) : [];
          if (Array.isArray(current)) {
            await this.saveCampaigns(
              tenantId,
              current.filter((c) => c.id !== id)
            );
          }
        } catch (e) {}
      }

      return result;
    }

    if (typeof window !== 'undefined' && tenantId) {
      const current = await this.getCampaigns(tenantId);
      const updated = current.filter((c) => c.id !== id);
      await this.saveCampaigns(tenantId, updated);
    }
    return { id, deleted: true };
  },

  /**
   * Vincula una pieza creativa del Content Planner a una Campaña comercial
   */
  async linkPostToCampaign(tenantId, campaignId, postSummary) {
    if (!tenantId || !campaignId || !postSummary) return null;

    const postPayload = {
      id: postSummary.id,
      title: postSummary.title || 'Creativo de Pauta',
      hookText: postSummary.hookText || postSummary.title || '',
      network: postSummary.network || 'INSTAGRAM',
      type: postSummary.type || 'Reel 9:16',
    };

    if (isBackendAvailable) {
      const response = await api.patch(
        `/campaigns/${campaignId}/link`,
        { post: postPayload },
        { params: { tenantId } }
      );
      const updatedCampaign = unwrapApiData(response);

      if (typeof window !== 'undefined') {
        try {
          const local = localStorage.getItem(getStorageKey(tenantId));
          const current = local ? JSON.parse(local) : [];
          if (Array.isArray(current) && updatedCampaign) {
            await this.saveCampaigns(
              tenantId,
              current.map((c) => (c.id === campaignId ? updatedCampaign : c))
            );
          }
        } catch (e) {}
      }

      return updatedCampaign;
    }

    const current = await this.getCampaigns(tenantId);
    let matched = null;
    const updated = current.map((c) => {
      if (c.id === campaignId) {
        const linked = Array.isArray(c.linkedPosts) ? c.linkedPosts : [];
        const alreadyLinked = linked.some((p) => p.id === postPayload.id);
        const nextLinked = alreadyLinked ? linked : [postPayload, ...linked];
        matched = {
          ...c,
          piecesCount: nextLinked.length,
          linkedPosts: nextLinked,
        };
        return matched;
      }
      return c;
    });
    await this.saveCampaigns(tenantId, updated);
    return matched;
  },

  /**
   * Impulsa (Boost) un Post o Reel ganador del Planner hacia el motor de Campañas
   */
  async boostPostToCampaign(tenantId, post, targetCampaignId = 'NEW') {
    if (!tenantId || !post) return null;

    if (targetCampaignId !== 'NEW') {
      return await this.linkPostToCampaign(tenantId, targetCampaignId, post);
    }

    const todayIso = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const boostedCamp = {
      tenantId,
      name: `Boost Pauta: ${post.title || 'Reel Ganador'}`,
      offer: post.hookText || post.title || 'Oferta Comercial Validada',
      objective: 'Citas & Conversaciones Calificadas',
      audience: 'Público interesado en servicios de alto valor en zona de influencia',
      channel: post.network === 'TIKTOK' ? 'Reels & TikTok' : 'Meta Ads (Instagram & FB)',
      budget: 15000,
      spend: 0,
      leadsCount: 0,
      piecesCount: 1,
      linkedPosts: [
        {
          id: post.id,
          title: post.title || 'Reel Ganador',
          hookText: post.hookText || post.title || '',
          network: post.network || 'INSTAGRAM',
          type: post.type || 'Reel 9:16',
        },
      ],
      status: 'Activa',
      owner: 'Boost desde Content Planner',
      start: todayIso,
      end: nextMonth,
      hypothesis: `Escalar con pauta pagada el guion validado (${post.aiConfidence || 'Match ADN'}) para atraer prospectos directos a WhatsApp.`,
      roas: 'En curso',
      cpl: 0,
    };

    return await this.createCampaign(boostedCamp, tenantId);
  },
};

export default campaignService;
