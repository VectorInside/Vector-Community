import api, { isBackendAvailable, unwrapApiData } from './api';

const getStorageKey = (tenantId) => `vector_campaigns_${tenantId || 'global'}`;

export const normalizeCampaign = (camp) => {
  if (!camp || typeof camp !== 'object') return null;

  let parsedMetadata = camp.metadata;
  if (typeof parsedMetadata === 'string') {
    try {
      parsedMetadata = JSON.parse(parsedMetadata);
    } catch {
      parsedMetadata = {};
    }
  }
  const meta = parsedMetadata && typeof parsedMetadata === 'object' ? parsedMetadata : {};

  const resolvedSpend = Number(camp.spend ?? camp.spent ?? meta.spend ?? meta.spent ?? 0);
  const resolvedCpl = Number(camp.cpl ?? camp.cpa ?? meta.cpl ?? meta.cpa ?? 0);
  const resolvedBudget = Number(camp.budget ?? meta.budget ?? 0);
  const resolvedLeadsCount = Number(
    camp.leadsCount ?? camp.leads ?? meta.leadsCount ?? meta.leads ?? 0
  );
  const linkedPosts = Array.isArray(camp.linkedPosts)
    ? camp.linkedPosts
    : Array.isArray(meta.linkedPosts)
    ? meta.linkedPosts
    : [];

  return {
    ...meta,
    ...camp,
    budget: Number.isFinite(resolvedBudget) ? resolvedBudget : 0,
    spend: Number.isFinite(resolvedSpend) ? resolvedSpend : 0,
    spent: Number.isFinite(resolvedSpend) ? resolvedSpend : 0,
    cpl: Number.isFinite(resolvedCpl) ? resolvedCpl : 0,
    cpa: Number.isFinite(resolvedCpl) ? resolvedCpl : 0,
    leadsCount: Number.isFinite(resolvedLeadsCount) ? resolvedLeadsCount : 0,
    piecesCount: Number(camp.piecesCount ?? meta.piecesCount ?? linkedPosts.length ?? 0),
    linkedPosts,
    metadata: meta,
  };
};

export const campaignService = {
  async getCampaigns(tenantId) {
    if (!tenantId) return [];

    // 1. Intentar Backend si está habilitado
    if (isBackendAvailable) {
      const response = await api.get('/campaigns', { params: { tenantId } });
      const data = unwrapApiData(response);
      const list = Array.isArray(data) ? data.map(normalizeCampaign).filter(Boolean) : [];
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
          return Array.isArray(parsed) ? parsed.map(normalizeCampaign).filter(Boolean) : [];
        }
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  async saveCampaigns(tenantId, campaigns) {
    if (!tenantId) return [];
    const normalizedList = Array.isArray(campaigns)
      ? campaigns.map(normalizeCampaign).filter(Boolean)
      : [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(tenantId), JSON.stringify(normalizedList));
      } catch (e) {}
    }
    return normalizedList;
  },

  async createCampaign(campaignData, tenantId) {
    const targetTenant = tenantId || campaignData?.tenantId;
    const normalizedInput = normalizeCampaign(campaignData) || campaignData;
    const payload = targetTenant
      ? { ...normalizedInput, tenantId: targetTenant }
      : normalizedInput;

    if (isBackendAvailable) {
      const response = await api.post(
        '/campaigns',
        payload,
        targetTenant ? { params: { tenantId: targetTenant } } : undefined
      );
      const created = normalizeCampaign(unwrapApiData(response) || payload);

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
    const normalizedUpdates = {
      ...updates,
      ...(updates?.spend !== undefined || updates?.spent !== undefined
        ? {
            spend: Number(updates.spend ?? updates.spent ?? 0),
            spent: Number(updates.spent ?? updates.spend ?? 0),
          }
        : {}),
      ...(updates?.cpl !== undefined || updates?.cpa !== undefined
        ? {
            cpl: Number(updates.cpl ?? updates.cpa ?? 0),
            cpa: Number(updates.cpa ?? updates.cpl ?? 0),
          }
        : {}),
    };

    if (isBackendAvailable) {
      const response = await api.put(
        `/campaigns/${id}`,
        normalizedUpdates,
        tenantId ? { params: { tenantId } } : undefined
      );
      const updatedItem = normalizeCampaign(unwrapApiData(response) || { id, ...normalizedUpdates });

      if (typeof window !== 'undefined' && tenantId) {
        try {
          const local = localStorage.getItem(getStorageKey(tenantId));
          const current = local ? JSON.parse(local) : [];
          if (Array.isArray(current)) {
            await this.saveCampaigns(
              tenantId,
              current.map((c) => (c.id === id ? normalizeCampaign({ ...c, ...updatedItem }) : c))
            );
          }
        } catch (e) {}
      }

      return updatedItem;
    }

    if (typeof window !== 'undefined' && tenantId) {
      const current = await this.getCampaigns(tenantId);
      const updated = current.map((c) =>
        c.id === id ? normalizeCampaign({ ...c, ...normalizedUpdates }) : c
      );
      await this.saveCampaigns(tenantId, updated);
    }
    return normalizeCampaign({ id, ...normalizedUpdates });
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
      budget: Number(post?.budget || 0),
      spend: 0,
      spent: 0,
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
      cpa: 0,
    };

    return await this.createCampaign(boostedCamp, tenantId);
  },
};

export default campaignService;
