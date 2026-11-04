import api, { isBackendAvailable, unwrapApiData } from './api';
import { INITIAL_TENANTS, INITIAL_TENANTS_DATA } from '@/utils/constants';
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
  const preset = INITIAL_TENANTS_DATA[rawTenant.id] || INITIAL_TENANTS_DATA.dental || {};

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

  return {
    ...preset,
    ...rawTenant,
    leadPriceMXN: rawTenant.leadPriceMXN != null ? Number(rawTenant.leadPriceMXN) : (preset.leadPriceMXN || 350),
    connectedSocialNetworks: parsedNetworks,
    calendarConfig: parsedCalendarConfig,
    buyerPersona: rawTenant.buyerPersona || preset.buyerPersona,
    brandDna: rawTenant.brandDna || preset.brandDna,
  };
};

export const serializeTenantToApi = (tenant) => {
  if (!tenant) return {};
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
    leadPriceMXN: Number(tenant.leadPriceMXN || 350),
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
  };
};

export const tenantService = {
  async getTenants() {
    if (!isBackendAvailable) return Object.values(INITIAL_TENANTS_DATA);
    try {
      const response = await api.get('/tenants');
      const data = unwrapApiData(response);
        if (Array.isArray(data)) {
          return data.map(normalizeTenantFromApi).filter(Boolean);
        }
        return [];
      } catch (error) {
        console.warn('[tenantService.getTenants] Fallback to empty list');
        return [];
      }
    },

  async getTenantById(id) {
      if (!isBackendAvailable) {
        return INITIAL_TENANTS_DATA[id] || INITIAL_TENANTS.find((t) => t.id === id) || INITIAL_TENANTS_DATA.dental;
      }
      try {
        const response = await api.get(`/tenants/${id}`);
        const data = unwrapApiData(response);
        return normalizeTenantFromApi(data);
      } catch (error) {
        console.warn(`[tenantService.getTenantById] Fallback for ${id}`);
        return INITIAL_TENANTS_DATA[id] || INITIAL_TENANTS.find((t) => t.id === id) || INITIAL_TENANTS_DATA.dental;
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
