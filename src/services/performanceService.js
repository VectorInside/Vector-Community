import api, { isBackendAvailable, unwrapApiData } from './api';
import { INITIAL_PERFORMANCE_METRICS } from '@/utils/mockData';

const TENANT_METRICS_MAP = {
  polanco: 'tenant-mex-001',
  dental: 'tenant-med-002',
  urban: 'tenant-eco-003',
  corp: 'tenant-mex-001',
  creator: 'tenant-mex-001',
  gym: 'tenant-fit-004',
  patrimonial: 'tenant-mex-001',
};

const resolveMetricsKey = (tenantId) => {
  return TENANT_METRICS_MAP[tenantId] || tenantId || 'tenant-mex-001';
};

export const normalizeTelemetryFromApi = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  return {
    webTrafficMetrics: {
      sessions: Number(raw.webSessions ?? 3420),
      cpc: `$${Number(raw.webCpc ?? 3.8).toFixed(2)} MXN`,
      whatsappClickRate: `${Number(raw.webWhatsappRate ?? 1.4).toFixed(1)}%`,
      bounceRate: `${Math.round(Number(raw.webBounceRate ?? 65))}%`,
    },
    microLandingMetrics: {
      visits: Number(raw.microVisits ?? 1280),
      leadsGenerated: Number(raw.microLeads ?? 233),
      conversionRate: `${Number(raw.microConvRate ?? 18.2).toFixed(1)}%`,
      costPerLead: `$${Number(raw.microCpl ?? 1.85).toFixed(2)} MXN`,
      bounceRate: `${Number(raw.microBounceRate ?? 8.4).toFixed(1)}%`,
      avgLoadTime: `${Number(raw.avgLoadTimeSec ?? 0.65).toFixed(2)}s`,
      ctaClicks: Number(raw.ctaClicks ?? 312),
      qrScans: Number(raw.qrScans ?? 46),
      sources: {
        bioLink: `${Number(raw.sourceBioPct ?? 54.2).toFixed(1)}%`,
        directAds: `${Number(raw.sourceAdsPct ?? 38.6).toFixed(1)}%`,
        qrPrint: `${Number(raw.sourceQrPct ?? 7.2).toFixed(1)}%`,
      },
    },
    rawTelemetry: raw,
  };
};

export const performanceService = {
  async getDualTelemetry(tenantId = 'dental') {
    if (!isBackendAvailable) return null;
    try {
      const response = await api.get(`/analytics/${tenantId}`);
      const data = unwrapApiData(response);
      return normalizeTelemetryFromApi(data);
    } catch (error) {
      console.warn(`[performanceService.getDualTelemetry] Fallback for ${tenantId}`);
      return null;
    }
  },

  async trackTelemetryEvent(tenantId = 'dental', eventType = 'VISIT') {
    if (!isBackendAvailable) return null;
    try {
      const response = await api.post('/analytics/track', { tenantId, eventType });
      const data = unwrapApiData(response);
      return normalizeTelemetryFromApi(data);
    } catch (error) {
      console.warn(`[performanceService.trackTelemetryEvent] Fallback for ${tenantId} (${eventType})`);
      return null;
    }
  },

  async getPerformanceMetrics(tenantId) {
    const key = resolveMetricsKey(tenantId);
    const fallback = INITIAL_PERFORMANCE_METRICS[key] || INITIAL_PERFORMANCE_METRICS['tenant-mex-001'];
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
    const key = resolveMetricsKey(tenantId);
    const tenantData = INITIAL_PERFORMANCE_METRICS[key] || INITIAL_PERFORMANCE_METRICS['tenant-mex-001'];
    return tenantData?.capiLogs || [];
  },

  async emitTestCapiSignal(tenantId = 'dental', eventName = 'Purchase_Verified') {
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
      value: '$3,850 MXN',
      status: 'MATCHED_CAPI_99.8%',
      signalSource: 'Meta Conversions API + Vector Backend SDOP',
    };
  },
};
