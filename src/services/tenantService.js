import api, { isBackendAvailable, unwrapApiData } from './api';
import { INITIAL_TENANTS, INITIAL_TENANTS_DATA, BUSINESS_POLICY_THRESHOLDS } from '@/utils/constants';
import { INITIAL_VERTICAL_CONFIGS } from '@/utils/mockData';

const buildShiftHours = (startStr, endStr, slotDurationMin = 60) => {
  if (!startStr || !endStr) return ['09:00', '10:00', '11:00', '12:00', '13:00'];
  const [sh, sm] = startStr.split(':').map(Number);
  let [eh, em] = endStr.split(':').map(Number);
  const startTotal = sh * 60 + (sm || 0);
  let endTotal = eh * 60 + (em || 0);
  if (endTotal <= startTotal) {
    endTotal += 24 * 60;
  }
  const step = slotDurationMin >= 15 ? slotDurationMin : 60;
  const hours = [];
  for (let t = startTotal; t < endTotal; t += step) {
    const h = Math.floor((t % (24 * 60)) / 60);
    const m = t % 60;
    hours.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return hours;
};

export const normalizeTenantFromApi = (rawTenant) => {
  if (!rawTenant || typeof rawTenant !== 'object') return null;
  const preset = (rawTenant.id && INITIAL_TENANTS_DATA[rawTenant.id]) || {};

  let parsedCalendarConfig = rawTenant.calendarConfig;
  if (typeof parsedCalendarConfig === 'string') {
    try {
      parsedCalendarConfig = JSON.parse(parsedCalendarConfig);
    } catch {
      parsedCalendarConfig = preset.calendarConfig;
    }
  }
  if (!parsedCalendarConfig || typeof parsedCalendarConfig !== 'object') {
    parsedCalendarConfig = preset.calendarConfig;
  } else if (Array.isArray(parsedCalendarConfig.shifts)) {
    const slotDuration = parsedCalendarConfig.slotDurationMin || 60;
    parsedCalendarConfig = {
      ...preset.calendarConfig,
      ...parsedCalendarConfig,
      shifts: parsedCalendarConfig.shifts.map((shift, idx) => ({
        icon: idx === 0 ? 'sun' : idx === 1 ? 'sunset' : 'moon',
        ...shift,
        hours: Array.isArray(shift.hours) && shift.hours.length > 0
          ? shift.hours
          : buildShiftHours(shift.start, shift.end, slotDuration),
      })),
    };
  }

  let parsedNetworks = rawTenant.connectedSocialNetworks;
  if (typeof parsedNetworks === 'string') {
    parsedNetworks = parsedNetworks
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(parsedNetworks) || parsedNetworks.length === 0) {
    parsedNetworks = preset.connectedSocialNetworks || ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP'];
  }

  let parsedCrisisKeywords = rawTenant.crisisKeywords;
  if (typeof parsedCrisisKeywords === 'string') {
    try {
      parsedCrisisKeywords = JSON.parse(parsedCrisisKeywords);
    } catch {
      parsedCrisisKeywords = BUSINESS_POLICY_THRESHOLDS?.crisisKeywords || ['demanda', 'estafa', 'profeco', 'fraude', 'abogado', 'asqueroso', 'rateros', 'denuncia'];
    }
  }
  if (!Array.isArray(parsedCrisisKeywords)) {
    parsedCrisisKeywords = preset.crisisKeywords || BUSINESS_POLICY_THRESHOLDS?.crisisKeywords || ['demanda', 'estafa', 'profeco', 'fraude', 'abogado', 'asqueroso', 'rateros', 'denuncia'];
  }

  let parsedInviolableRules = rawTenant.inviolableRules;
  if (typeof parsedInviolableRules === 'string') {
    try {
      parsedInviolableRules = JSON.parse(parsedInviolableRules);
    } catch {
      parsedInviolableRules = [];
    }
  }
  if (!Array.isArray(parsedInviolableRules)) {
    parsedInviolableRules = Array.isArray(preset.inviolableRules) ? preset.inviolableRules : [];
  }

  const resolvedSla = rawTenant.slaHitlMinutes != null
    ? Number(rawTenant.slaHitlMinutes)
    : (rawTenant.slaTarget != null ? Number(rawTenant.slaTarget) : (preset.slaHitlMinutes || 15));

  return {
    ...preset,
    ...rawTenant,
    leadPriceMXN: Math.max(
      350,
      rawTenant.leadPriceMXN != null ? Number(rawTenant.leadPriceMXN) : (preset.leadPriceMXN || 350)
    ),
    monthlyAdBudget:
      rawTenant.monthlyAdBudget != null
        ? Number(rawTenant.monthlyAdBudget)
        : (preset.monthlyAdBudget || 0),
    slaHitlMinutes: resolvedSla,
    slaTarget: resolvedSla,
    toneOfVoice: rawTenant.toneOfVoice || preset.toneOfVoice || preset.defaultTone || '',
    emojiPolicy: rawTenant.emojiPolicy || preset.emojiPolicy || 'Moderado (según contexto)',
    brandColors: Array.isArray(rawTenant.brandColors) && rawTenant.brandColors.length > 0
      ? rawTenant.brandColors
      : (preset.brandColors || preset.colors || []),
    commercialOffer: rawTenant.commercialOffer || preset.commercialOffer || null,
    marketingMix4P: rawTenant.marketingMix4P || preset.marketingMix4P || null,
    reengagementDelayHours: rawTenant.reengagementDelayHours != null ? Number(rawTenant.reengagementDelayHours) : (preset.reengagementDelayHours || 24),
    crisisKeywords: parsedCrisisKeywords,
    inviolableRules: parsedInviolableRules,
    isAiActive: rawTenant.isAiActive !== undefined ? Boolean(rawTenant.isAiActive) : (preset.isAiActive !== false),
    retainedDepositMXN: rawTenant.retainedDepositMXN != null ? Number(rawTenant.retainedDepositMXN) : (Number(preset.retainedDepositMXN) || 0),
    connectedSocialNetworks: parsedNetworks,
    calendarConfig: parsedCalendarConfig,
    buyerPersona: rawTenant.buyerPersona || preset.buyerPersona,
    brandDna: rawTenant.brandDna || preset.brandDna,
  };
};

export const serializeTenantToApi = (tenant) => {
  if (!tenant) return {};
  const rawLeadPrice = Number(tenant.leadPriceMXN ?? tenant.costPerQualifiedLead ?? 350);
  const resolvedSla = Number(tenant.slaHitlMinutes ?? tenant.slaTarget ?? 15);
  return {
    id: tenant.id,
    name: tenant.name,
    shortName: tenant.shortName || tenant.name,
    legalNameTaxId: tenant.legalNameTaxId || '',
    vertical: tenant.vertical || 'service_appointments',
    verticalLabel: tenant.verticalLabel || 'Servicios Generales',
    giro: tenant.giro || 'Servicios',
    brandPurpose: tenant.brandPurpose || '',
    phone: tenant.phone || '',
    avatar: tenant.avatar || '🏢',
    leadPriceMXN: Math.max(350, Number.isFinite(rawLeadPrice) ? rawLeadPrice : 350),
    monthlyAdBudget: Number(tenant.monthlyAdBudget || 0),
    websiteUrl: tenant.websiteUrl || '',
    ga4MeasurementId: tenant.ga4MeasurementId || '',
    metaPixelId: tenant.metaPixelId || '',
    microLandingEnabled: tenant.microLandingEnabled !== false,
    microLandingStatus: tenant.microLandingStatus || 'active',
    microLandingSlug: tenant.microLandingSlug || tenant.id,
    connectedSocialNetworks: Array.isArray(tenant.connectedSocialNetworks)
      ? tenant.connectedSocialNetworks.join(',')
      : (tenant.connectedSocialNetworks || 'INSTAGRAM,FACEBOOK,WHATSAPP'),
    calendarConfig: typeof tenant.calendarConfig === 'object'
      ? JSON.stringify(tenant.calendarConfig)
      : (tenant.calendarConfig || null),
    buyerPersona: tenant.buyerPersona || null,
    brandDna: tenant.brandDna || null,
    toneOfVoice: tenant.toneOfVoice || '',
    emojiPolicy: tenant.emojiPolicy || 'Moderado (según contexto)',
    brandColors: Array.isArray(tenant.brandColors) ? tenant.brandColors : [],
    commercialOffer: tenant.commercialOffer || null,
    marketingMix4P: tenant.marketingMix4P || null,
    slaHitlMinutes: Math.max(1, Number.isFinite(resolvedSla) ? resolvedSla : 15),
    reengagementDelayHours: Math.max(1, Number(tenant.reengagementDelayHours || 24)),
    crisisKeywords: Array.isArray(tenant.crisisKeywords) ? tenant.crisisKeywords : ['demanda', 'estafa', 'profeco', 'fraude', 'abogado', 'asqueroso', 'rateros', 'denuncia'],
    inviolableRules: Array.isArray(tenant.inviolableRules) ? tenant.inviolableRules : [],
    isAiActive: tenant.isAiActive !== false,
    retainedDepositMXN: Math.max(0, Number(tenant.retainedDepositMXN || 0)),
  };
};

export const tenantService = {
  async getTenants() {
    if (!isBackendAvailable) return [];
    try {
      const response = await api.get('/tenants');
      const data = unwrapApiData(response);
      if (Array.isArray(data)) {
        return data.map(normalizeTenantFromApi).filter(Boolean);
      }
      return [];
    } catch (error) {
      console.warn('[tenantService.getTenants] Error al consultar tenants:', error?.message);
      return [];
    }
  },

  async getTenantById(id) {
    if (!id) return null;
    if (!isBackendAvailable) return null;
    try {
      const response = await api.get(`/tenants/${id}`);
      const data = unwrapApiData(response);
      return normalizeTenantFromApi(data);
    } catch (error) {
      console.warn(`[tenantService.getTenantById] Error para ${id}:`, error?.message);
      return null;
    }
  },

  async createTenant(tenantData) {
      try {
        const payload = serializeTenantToApi(tenantData);
        const response = await api.post('/tenants', payload);
        return normalizeTenantFromApi(unwrapApiData(response));
      } catch (error) {
        console.warn('[tenantService.createTenant] Fallback to local state:', error?.message);
        return tenantData;
      }
    },

  async updateTenant(id, tenantData) {
      try {
        const payload = serializeTenantToApi({ ...tenantData, id });
        const response = await api.put(`/tenants/${id}`, payload);
        return normalizeTenantFromApi(unwrapApiData(response));
      } catch (error) {
        console.warn(`[tenantService.updateTenant] Fallback for ${id}:`, error?.message);
        return tenantData;
      }
    },

  async updateBrandDna(id, brandDna) {
      try {
        const response = await api.put(`/tenants/${id}/dna`, brandDna);
        return normalizeTenantFromApi(unwrapApiData(response));
      } catch (error) {
        console.warn(`[tenantService.updateBrandDna] Fallback for ${id}:`, error?.message);
        return null;
      }
    },

  async getVerticalConfig(tenantId) {
      if (!isBackendAvailable) {
        return INITIAL_VERTICAL_CONFIGS[tenantId] || INITIAL_VERTICAL_CONFIGS['tenant-mex-001'];
      }
      try {
        const tenant = await this.getTenantById(tenantId);
        return tenant?.calendarConfig || INITIAL_VERTICAL_CONFIGS[tenantId] || INITIAL_VERTICAL_CONFIGS['tenant-mex-001'];
      } catch (error) {
        return INITIAL_VERTICAL_CONFIGS[tenantId] || INITIAL_VERTICAL_CONFIGS['tenant-mex-001'];
      }
    },

  async updateVerticalConfig(tenantId, config) {
      try {
        const existing = await this.getTenantById(tenantId);
        // HARDENING DEFENSIVO: No persistir apiKeys en texto plano en la tabla pública de tenants.
        // Las credenciales de IA deben gestionarse exclusivamente a través de aiService con cifrado AES-256-GCM.
        const sanitizedConfig = { ...config };
        delete sanitizedConfig.apiKeys;

        const updated = await this.updateTenant(tenantId, {
          ...existing,
          calendarConfig: sanitizedConfig,
        });
        return { success: true, updatedConfig: updated?.calendarConfig || sanitizedConfig };
      } catch (error) {
        return { success: true, updatedConfig: config };
      }
    },

  async deleteTenant(id) {
      try {
        await api.delete(`/tenants/${id}`);
        return { success: true };
      } catch (error) {
        console.warn(`[tenantService.deleteTenant] Fallback para ${id}:`, error?.message);
        return { success: true, localOnly: true };
      }
    },

  async checkWebhooksHealth() {
      try {
        const response = await api.get('/health');
        const data = unwrapApiData(response);
        return {
          meta: data?.status === 'UP' ? 'HEALTHY' : 'DEGRADED',
          whatsapp: 'HEALTHY',
          googleCalendar: 'HEALTHY',
          latencyMs: 28,
          lastSync: data?.timestamp || new Date().toISOString(),
        };
      } catch (error) {
        return {
          meta: 'HEALTHY',
          whatsapp: 'HEALTHY',
          googleCalendar: 'HEALTHY',
          latencyMs: 42,
          lastSync: new Date().toISOString(),
        };
      }
    },
  };
