import api, { isBackendAvailable, unwrapApiData } from './api';

const STATUS_LABELS = {
  LEAD_COLD_24H: 'Frío (Ventana 24h)',
  LEAD_WARM_24H: 'En Seguimiento (Tibio)',
  LEAD_HOT_PREQUAL: 'Pre-Calificado (Alta Intención)',
  BILLABLE_LEAD: 'Calificado (Listo para Venta)',
  HITL_INTERVENTION: 'Intervención Humana (HITL)',
};

const formatCurrencyMXN = (val) => {
  if (typeof val === 'string' && val.includes('$')) return val;
  const num = typeof val === 'number' ? val : parseFloat(String(val || '0').replace(/[^0-9.]/g, '')) || 0;
  const formatted = Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${formatted} MXN`;
};

const parseNumericMXN = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
};

export const normalizeLeadFromApi = (lead) => {
  if (!lead) return null;
  const leadState = lead.leadState || lead.status || 'LEAD_COLD_24H';
  const identityValidated = Boolean(lead.identityValidated ?? lead.criteriaAudit?.identityValidated);
  const catalogIdentified = Boolean(lead.catalogIdentified ?? lead.criteriaAudit?.catalogIdentified);
  const financialClarified = Boolean(lead.financialClarified ?? lead.criteriaAudit?.financialClarified);
  const consentOrBooked = Boolean(lead.consentOrBooked ?? lead.criteriaAudit?.consentOrBooked);
  const noteText = lead.notes || lead.lastMessage || 'Prospecto sincronizado con PostgreSQL SDOP.';

  const initials = (lead.name || 'PR')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return {
    id: lead.id,
    tenantId: lead.tenantId || 'dental',
    name: lead.name || 'Prospecto Sin Nombre',
    email: lead.email || '',
    phone: lead.phone || '+52 55 0000 0000',
    avatar: lead.avatar || initials || 'LD',
    channel: lead.channel || 'WHATSAPP',
    leadState,
    status: STATUS_LABELS[leadState] || lead.status || 'En Calificación',
    statusType: leadState === 'BILLABLE_LEAD' ? 'success' : leadState === 'HITL_INTERVENTION' ? 'danger' : 'warning',
    billingStatus: leadState === 'BILLABLE_LEAD' ? 'BILLABLE_UNLOCKED' : 'IN_PROGRESS',
    score: lead.score ?? ((identityValidated ? 25 : 0) + (catalogIdentified ? 25 : 0) + (financialClarified ? 25 : 0) + (consentOrBooked ? 25 : 0)),
    potentialTicket: formatCurrencyMXN(lead.estimatedValue ?? lead.potentialTicket ?? 4500),
    estimatedValue: parseNumericMXN(lead.estimatedValue ?? lead.potentialTicket ?? 4500),
    countdown24h: lead.countdown24h || '22h 15m restantes',
    criteriaAudit: {
      identityValidated,
      catalogIdentified,
      financialClarified,
      consentOrBooked,
    },
    customerNeeds: lead.customerNeeds || noteText,
    dictamen: lead.dictamen || (leadState === 'BILLABLE_LEAD'
      ? 'Prospecto auditado con las 4 Guardas SDOP cumplidas. Facturable y listo para cierre.'
      : 'En proceso de calificación conversacional bajo protocolo 4-Guard.'),
    notes: noteText,
    messages: Array.isArray(lead.messages) && lead.messages.length > 0
      ? lead.messages
      : [
          {
            id: `msg-${lead.id}-1`,
            sender: lead.name || 'Prospecto',
            text: noteText,
            time: 'Hace 5 min',
            isUser: true,
          },
          {
            id: `msg-${lead.id}-2`,
            sender: 'Agente IA (SDOP 4-Guard)',
            text: leadState === 'BILLABLE_LEAD'
              ? 'Excelente, hemos validado tus datos, tratamiento de interés y horario disponible. Tu cita ha quedado pre-registrada.'
              : 'Hola, con gusto te brindo información detallada y te ayudo a agendar tu valoración.',
            time: 'Hace 3 min',
            isBot: true,
          },
        ],
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

export const serializeLeadToApi = (item) => {
  const validStatuses = ['LEAD_COLD_24H', 'LEAD_WARM_24H', 'LEAD_HOT_PREQUAL', 'BILLABLE_LEAD', 'HITL_INTERVENTION'];
  const rawStatus = item.leadState || item.status;
  const status = validStatuses.includes(rawStatus) ? rawStatus : 'LEAD_COLD_24H';

  return {
    id: item.id || undefined,
    tenantId: item.tenantId || 'dental',
    name: item.name || 'Nuevo Prospecto',
    email: item.email || '',
    phone: item.phone || '',
    status,
    channel: (item.channel || 'WHATSAPP').toUpperCase(),
    score: item.score != null ? Number(item.score) : undefined,
    estimatedValue: parseNumericMXN(item.estimatedValue ?? item.potentialTicket ?? 0),
    identityValidated: Boolean(item.identityValidated ?? item.criteriaAudit?.identityValidated),
    catalogIdentified: Boolean(item.catalogIdentified ?? item.criteriaAudit?.catalogIdentified),
    financialClarified: Boolean(item.financialClarified ?? item.criteriaAudit?.financialClarified),
    consentOrBooked: Boolean(item.consentOrBooked ?? item.criteriaAudit?.consentOrBooked),
    notes: item.notes || item.customerNeeds || (Array.isArray(item.messages) && item.messages[0]?.text) || '',
  };
};

export const leadService = {
  async getLeadsByTenant(tenantId = 'dental') {
    if (!isBackendAvailable) return null;
    try {
      const response = await api.get('/leads', { params: { tenantId } });
      const data = unwrapApiData(response);
      if (Array.isArray(data)) {
        return data.map(normalizeLeadFromApi).filter(Boolean);
      }
      return [];
    } catch (error) {
      console.warn(`[leadService.getLeadsByTenant] Fallback to local threads for ${tenantId}`);
      return null;
    }
  },

  async createLead(leadData) {
    const payload = serializeLeadToApi(leadData);
    const response = await api.post('/leads', payload);
    return normalizeLeadFromApi(unwrapApiData(response));
  },

  async updateLeadStatus(id, status) {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return normalizeLeadFromApi(unwrapApiData(response));
  },

  async updateLeadCriteria(id, criteria) {
    const response = await api.patch(`/leads/${id}/criteria`, criteria);
    return normalizeLeadFromApi(unwrapApiData(response));
  },

  async updateLead(id, leadData) {
    const payload = serializeLeadToApi(leadData);
    const response = await api.put(`/leads/${id}`, payload);
    return normalizeLeadFromApi(unwrapApiData(response));
  },

  async deleteLead(id) {
    await api.delete(`/leads/${id}`);
    return { success: true };
  },
};
