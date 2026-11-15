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

  /**
   * Vincula una pieza creativa del Content Planner a una Campaña comercial
   */
  async linkPostToCampaign(tenantId, campaignId, postSummary) {
    if (!tenantId || !campaignId || !postSummary) return null;
    const current = await this.getCampaigns(tenantId);
    let matched = null;
    const updated = current.map((c) => {
      if (c.id === campaignId) {
        const linked = Array.isArray(c.linkedPosts) ? c.linkedPosts : [];
        const alreadyLinked = linked.some((p) => p.id === postSummary.id);
        const nextLinked = alreadyLinked
          ? linked
          : [
              {
                id: postSummary.id,
                title: postSummary.title || 'Creativo de Pauta',
                hookText: postSummary.hookText || postSummary.title || '',
                network: postSummary.network || 'INSTAGRAM',
                type: postSummary.type || 'Reel 9:16',
              },
              ...linked,
            ];
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

    const current = await this.getCampaigns(tenantId);
    const todayIso = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const boostedCamp = {
      id: `camp-boost-${Date.now()}`,
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

    const updated = [boostedCamp, ...current];
    await this.saveCampaigns(tenantId, updated);
    return boostedCamp;
  },
};

export default campaignService;
