export const INITIAL_HITL_ALERTS = [];

export const INITIAL_CALENDAR_EVENTS = [];

export const INITIAL_PERFORMANCE_METRICS = {};

export const INITIAL_VERTICAL_CONFIGS = {};

export const SUB_AGENTS_METRICS_MOCK = {
  activeSessions: 0,
  averageResponseTimeSec: 0,
  handoverToHumanRate: 0,
  lastRoutingEvent: null,
  supervisor: { status: 'Activo (Router LangGraph)', accuracy: '100%', latencyMs: 12 },
  closer: { status: 'Activo (DeepSeek R1)', conversionRate: '0.0%', latencyMs: 240, billableLeadsCount: 0 },
  reengagement: { status: 'Activo (Upstash Redis 24h)', queueSize: 0, latencyMs: 35, active24hQueueCount: 0, reactivationRate: '0.0%' },
  analyst: { status: 'Activo (Meta CAPI Engine)', roasTracked: '0.0x', latencyMs: 85 },
};

export const REENGAGEMENT_QUEUE_MOCK = [];

export const FULL_FUNNEL_METRICS_MOCK = {
  adImpressions: 0,
  adClicks: 0,
  inboundConversations: 0,
  qualifiedLeads4of4: 0,
  appointmentsBooked: 0,
  salesClosedValueMXN: 0,
};
