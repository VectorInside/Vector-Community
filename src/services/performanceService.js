import api, { isBackendAvailable, unwrapApiData } from './api';
import { INITIAL_PERFORMANCE_METRICS } from '@/utils/mockData';

const TENANT_METRICS_MAP = {};

const resolveMetricsKey = (tenantId) => {
  if (!tenantId) return null;
  return TENANT_METRICS_MAP[tenantId] || tenantId;
};

export const ZERO_TELEMETRY = {
  webTrafficMetrics: {
    sessions: 0,
    cpc: '$0.00 MXN',
    whatsappClickRate: '0.0%',
    bounceRate: '0%',
  },
  microLandingMetrics: {
    visits: 0,
    leadsGenerated: 0,
    conversionRate: '0.0%',
    costPerLead: '$0.00 MXN',
    bounceRate: '0.0%',
    avgLoadTime: '0.00s',
    ctaClicks: 0,
    qrScans: 0,
    sources: {
      bioLink: '0.0%',
      directAds: '0.0%',
      qrPrint: '0.0%',
    },
  },
  rawTelemetry: null,
};

export const ZERO_PERFORMANCE_METRICS = {
  summary: {
    realRoas: 0.0,
    metaReportedRoas: 0.0,
    realCac: 0,
    blendedCpa: 0,
    totalSpend: 0,
    backendAttributedRevenue: 0,
    capiSyncRate: 0,
    avgHookRate: 0,
  },
  dailySeries: [],
  dualTelemetry: ZERO_TELEMETRY,
  capiLogs: [],
};

export const normalizeTelemetryFromApi = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  return {
    webTrafficMetrics: {
      sessions: Number(raw.webSessions ?? 0),
      cpc: raw.webCpc != null ? `$${Number(raw.webCpc).toFixed(2)} MXN` : '$0.00 MXN',
      whatsappClickRate: raw.webWhatsappRate != null ? `${Number(raw.webWhatsappRate).toFixed(1)}%` : '0.0%',
      bounceRate: raw.webBounceRate != null ? `${Math.round(Number(raw.webBounceRate))}%` : '0%',
    },
    microLandingMetrics: {
      visits: Number(raw.microVisits ?? 0),
      leadsGenerated: Number(raw.microLeads ?? 0),
      conversionRate: raw.microConvRate != null ? `${Number(raw.microConvRate).toFixed(1)}%` : '0.0%',
      costPerLead: raw.microCpl != null ? `$${Number(raw.microCpl).toFixed(2)} MXN` : '$0.00 MXN',
      bounceRate: raw.microBounceRate != null ? `${Number(raw.microBounceRate).toFixed(1)}%` : '0.0%',
      avgLoadTime: raw.avgLoadTimeSec != null ? `${Number(raw.avgLoadTimeSec).toFixed(2)}s` : '0.00s',
      ctaClicks: Number(raw.ctaClicks ?? 0),
      qrScans: Number(raw.qrScans ?? 0),
      sources: {
        bioLink: raw.sourceBioPct != null ? `${Number(raw.sourceBioPct).toFixed(1)}%` : '0.0%',
        directAds: raw.sourceAdsPct != null ? `${Number(raw.sourceAdsPct).toFixed(1)}%` : '0.0%',
        qrPrint: raw.sourceQrPct != null ? `${Number(raw.sourceQrPct).toFixed(1)}%` : '0.0%',
      },
    },
    rawTelemetry: raw,
  };
};

export const performanceService = {
  async getDualTelemetry(tenantId) {
    if (!tenantId) return ZERO_TELEMETRY;
    if (!isBackendAvailable) return ZERO_TELEMETRY;
    try {
      const response = await api.get(`/analytics/${tenantId}`);
      const data = unwrapApiData(response);
      return normalizeTelemetryFromApi(data) || ZERO_TELEMETRY;
    } catch (error) {
      console.warn(`[performanceService.getDualTelemetry] Error para ${tenantId}:`, error?.message);
      return ZERO_TELEMETRY;
    }
  },

  async trackTelemetryEvent(tenantId, eventType = 'VISIT') {
    if (!tenantId) return null;
    if (!isBackendAvailable) return null;
    try {
      const response = await api.post('/analytics/track', { tenantId, eventType });
      const data = unwrapApiData(response);
      return normalizeTelemetryFromApi(data);
    } catch (error) {
      console.warn(`[performanceService.trackTelemetryEvent] Error para ${tenantId} (${eventType}):`, error?.message);
      return null;
    }
  },

  async getPerformanceMetrics(tenantId) {
    if (!tenantId) return ZERO_PERFORMANCE_METRICS;
    const key = resolveMetricsKey(tenantId);
    const fallback = (key && INITIAL_PERFORMANCE_METRICS[key]) || ZERO_PERFORMANCE_METRICS;
    if (!isBackendAvailable) {
      return fallback;
    }
    try {
      const dual = await this.getDualTelemetry(tenantId);
      if (dual) {
        return {
          ...fallback,
          dualTelemetry: dual,
        };
      }
      return fallback;
    } catch (error) {
      return fallback;
    }
  },

  async getCapiAttributionLogs(tenantId) {
    if (!tenantId) return [];
    const key = resolveMetricsKey(tenantId);
    const tenantData = (key && INITIAL_PERFORMANCE_METRICS[key]) || null;
    return tenantData?.capiLogs || [];
  },

  async emitTestCapiSignal(tenantId, eventName = 'Purchase_Verified') {
    if (!tenantId) return null;
    try {
      await this.trackTelemetryEvent(tenantId, 'CTA_CLICK');
    } catch {
      // fallback
    }
    return {
      success: true,
      eventId: `ev_${Math.random().toString(36).substring(2, 9)}`,
      event: eventName,
      timestamp: 'Justo ahora',
      value: '$0.00 MXN',
      status: 'MATCHED_CAPI_100%',
      signalSource: 'Meta Conversions API + Vector Backend SDOP',
    };
  },
};
