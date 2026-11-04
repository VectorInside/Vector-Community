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
    if (!tenantId) return null;
    if (!isBackendAvailable) return null;
    try {
      const response = await api.get(`/analytics/${tenantId}`);
      const data = unwrapApiData(response);
      return normalizeTelemetryFromApi(data);
    } catch (error) {
      console.warn(`[performanceService.getDualTelemetry] Error para ${tenantId}:`, error?.message);
      return null;
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
