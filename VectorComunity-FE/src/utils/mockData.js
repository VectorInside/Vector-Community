export const INITIAL_HITL_ALERTS = [
  {
    id: 'alt-001',
    tenantId: 'tenant-mex-001',
    tenantName: 'Polanco Steakhouse & Mixology',
    type: 'APPOINTMENT_REQUEST',
    vertical: 'hospitality',
    title: 'Reserva VIP - Mesa Terraza (4 Personas)',
    clientName: 'Alejandro Bastida',
    clientPhone: '+52 55 3341 8920',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    status: 'PENDING_AGENCY_APPROVAL',
    confidenceScore: 98,
    botSummary: 'El lead solicitó mesa en terraza para festejo de aniversario. Se validó consumo mínimo de $3,500 MXN y disponibilidad en slot de 21:00 hrs.',
    proposedData: {
      date: 'Hoy, 21:00 hrs',
      people: 4,
      zone: 'Terraza Principal - Zona Fumadores',
      specialRequest: 'Vino Tinto Reserva de la Casa + Postre cortesía aniversario',
      depositStatus: 'Pre-autorización retenida ($1,000 MXN)',
      estimatedValue: 4200,
    },
    transcriptSnippet: [
      { sender: 'user', text: 'Hola! Quiero reservar hoy a las 9pm en terraza para 4 personas, es nuestro aniversario.' },
      { sender: 'bot', text: '¡Excelente! Tengo disponibilidad en Terraza Principal a las 21:00 hrs. ¿Deseas que agreguemos una botella de cortesía en la comanda?' },
      { sender: 'user', text: 'Sí por favor, confirmen de una vez.' }
    ],
    urgency: 'HIGH',
    source: 'WhatsApp Cloud API'
  },
  {
    id: 'alt-002',
    tenantId: 'tenant-med-002',
    tenantName: 'Clínica Dental OdontoVanguardia',
    type: 'APPOINTMENT_REQUEST',
    vertical: 'service_appointments',
    title: 'Valoración Implante Dental Premium + Tomografía',
    clientName: 'Dra. Mariana Solares',
    clientPhone: '+52 55 8812 9031',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: 'PENDING_AGENCY_APPROVAL',
    confidenceScore: 94,
    botSummary: 'Paciente busca cotización de implante unitario con cirujano maxilofacial. Se verificó hueco en Google Calendar para Dr. Roberto Peña.',
    proposedData: {
      date: 'Mañana, 11:30 hrs',
      doctor: 'Dr. Roberto Peña (Maxilofacial)',
      service: 'Diagnóstico 3D + Presupuesto Implante',
      duration: '45 min',
      depositStatus: 'Pago de consulta confirmado ($800 MXN)',
      estimatedValue: 18500,
    },
    transcriptSnippet: [
      { sender: 'user', text: 'Buenas tardes, me urge cita con el Dr. Peña para valorar un implante molar.' },
      { sender: 'bot', text: 'Con gusto Dra. Mariana, tenemos mañana a las 11:30 hrs con el Dr. Roberto Peña en la sucursal Nápoles.' },
      { sender: 'user', text: 'Perfecto, ya hice el anticipo.' }
    ],
    urgency: 'HIGH',
    source: 'Meta Instagram DM'
  },
  {
    id: 'alt-003',
    tenantId: 'tenant-mex-001',
    tenantName: 'Polanco Steakhouse & Mixology',
    type: 'CREATIVE_FATIGUE',
    vertical: 'hospitality',
    title: 'Alerta de Fatiga Creativa - Ad Set "Tomahawk_Promo_V3"',
    clientName: 'Meta Ads Automation Watcher',
    clientPhone: 'N/A',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'PENDING_AGENCY_APPROVAL',
    confidenceScore: 91,
    botSummary: 'La frecuencia superó 3.4 y el Hook Rate cayó de 42% a 18% en las últimas 48 hrs. Se sugiere pausar y rotar hacia creativos V4 con UGC.',
    proposedData: {
      adSetId: 'adset_689129031',
      metricDrop: 'Hook Rate -57% / Frecuencia 3.82',
      recommendation: 'Pausar AdSet y redirigir $45 USD/día a Reel "Mixology Experience"',
      actionType: 'PAUSE_AND_ROTATE',
    },
    transcriptSnippet: [
      { sender: 'system', text: 'Detector de Anomalías: CPM subió 38% y CTR bajó a 0.72%.' }
    ],
    urgency: 'MEDIUM',
    source: 'Meta Marketing API / CAPI'
  },
  {
    id: 'alt-004',
    tenantId: 'tenant-eco-003',
    tenantName: 'Kromatik Luxury Streetwear',
    type: 'HIGH_INTENT_LEAD',
    vertical: 'ecommerce',
    title: 'Carrito Abandonado Alto Valor ($380 USD)',
    clientName: 'Esteban Coronado',
    clientPhone: '+52 55 9012 3341',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'PENDING_AGENCY_APPROVAL',
    confidenceScore: 89,
    botSummary: 'Cliente dejó 2 Sneakers Edición Limitada en el checkout de Shopify. El Sub-Bot RAG preparó cupón dinámico del 10% con caducidad 2 hrs.',
    proposedData: {
      cartItems: '2x Neon Runner X1 (Talla 28.5)',
      cartValue: '$7,200 MXN ($380 USD)',
      offer: 'Cupón VIP: KROMA-FLASH-10',
      actionType: 'SEND_WHATSAPP_RECOVERY',
    },
    transcriptSnippet: [
      { sender: 'bot', text: 'Hola Esteban! Notamos que tus Neon Runner X1 quedaron en el carrito. Si finalizas en los próximos 60 min tienes 10% adicional.' }
    ],
    urgency: 'MEDIUM',
    source: 'Shopify Webhook'
  }
];

export const INITIAL_CALENDAR_EVENTS = [
  {
    id: 'evt-01',
    tenantId: 'tenant-mex-001',
    title: 'Alejandro Bastida - 4 pax (Terraza VIP)',
    start: new Date(new Date().setHours(21, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(23, 0, 0, 0)).toISOString(),
    vertical: 'hospitality',
    status: 'SYNCED_GOOGLE_CALENDAR',
    client: 'Alejandro Bastida',
    phone: '+52 55 3341 8920',
    details: 'Aniversario. Consumo mín $3,500 MXN',
    color: '#D4FF00',
    depositPaid: true,
  },
  {
    id: 'evt-02',
    tenantId: 'tenant-mex-001',
    title: 'Mesa Empresarial - 8 pax (Salón Privado)',
    start: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    vertical: 'hospitality',
    status: 'SYNCED_GOOGLE_CALENDAR',
    client: 'Ing. Fernando Rios',
    phone: '+52 55 7712 0019',
    details: 'Menú degustación + maridaje',
    color: '#10B981',
    depositPaid: true,
  },
  {
    id: 'evt-03',
    tenantId: 'tenant-med-002',
    title: 'Dra. Mariana Solares - Implante Molar',
    start: new Date(Date.now() + 86400000).toISOString(),
    end: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    vertical: 'service_appointments',
    status: 'SYNCED_GOOGLE_CALENDAR',
    client: 'Dra. Mariana Solares',
    phone: '+52 55 8812 9031',
    details: 'Dr. Roberto Peña (Maxilofacial) - Sillón 3',
    color: '#3B82F6',
    depositPaid: true,
  },
  {
    id: 'evt-04',
    tenantId: 'tenant-fit-004',
    title: 'Evaluación Biomecánica & VO2 Max',
    start: new Date(Date.now() + 3600000 * 3).toISOString(),
    end: new Date(Date.now() + 3600000 * 4).toISOString(),
    vertical: 'service_appointments',
    status: 'SYNCED_GOOGLE_CALENDAR',
    client: 'Santiago Cordero',
    phone: '+52 55 2210 9982',
    details: 'Coach Marcelo - Sala de Evaluación 1',
    color: '#F59E0B',
    depositPaid: true,
  }
];

export const INITIAL_PERFORMANCE_METRICS = {
  'tenant-mex-001': {
    summary: {
      realRoas: 4.82,
      metaReportedRoas: 3.41,
      realCac: 14.20,
      blendedCpa: 16.80,
      totalSpend: 3450,
      backendAttributedRevenue: 16629,
      capiSyncRate: 99.4,
      avgHookRate: 41.8,
      avgHoldRate: 28.5,
    },
    dailySeries: [
      { date: '24 Sep', spend: 450, revenue: 2180, realRoas: 4.84, metaRoas: 3.30, hookRate: 43.2 },
      { date: '25 Sep', spend: 480, revenue: 2420, realRoas: 5.04, metaRoas: 3.55, hookRate: 44.0 },
      { date: '26 Sep', spend: 520, revenue: 2390, realRoas: 4.59, metaRoas: 3.20, hookRate: 39.5 },
      { date: '27 Sep', spend: 510, revenue: 2550, realRoas: 5.00, metaRoas: 3.60, hookRate: 42.1 },
      { date: '28 Sep', spend: 490, revenue: 2310, realRoas: 4.71, metaRoas: 3.40, hookRate: 40.8 },
      { date: '29 Sep', spend: 500, revenue: 2490, realRoas: 4.98, metaRoas: 3.50, hookRate: 41.5 },
      { date: '30 Sep', spend: 500, revenue: 2289, realRoas: 4.57, metaRoas: 3.35, hookRate: 41.8 },
    ],
    capiLogs: [
      { id: 'ev-01', event: 'Purchase / Table_Reserved', timestamp: 'Hace 4m', value: '$4,200 MXN', status: 'MATCHED_CAPI_98%', signalSource: 'WhatsApp + Stripe' },
      { id: 'ev-02', event: 'Lead_HighIntent', timestamp: 'Hace 18m', value: 'N/A', status: 'MATCHED_CAPI_95%', signalSource: 'Meta Adset #441' },
      { id: 'ev-03', event: 'Purchase / Wine_AddOn', timestamp: 'Hace 42m', value: '$1,850 MXN', status: 'MATCHED_CAPI_99%', signalSource: 'TPV Terminal Sync' },
      { id: 'ev-04', event: 'Schedule_Confirmed', timestamp: 'Hace 1h', value: '$3,500 MXN', status: 'MATCHED_CAPI_97%', signalSource: 'Google Calendar API' },
    ]
  },
  'tenant-med-002': {
    summary: {
      realRoas: 6.15,
      metaReportedRoas: 4.20,
      realCac: 32.50,
      blendedCpa: 38.00,
      totalSpend: 4200,
      backendAttributedRevenue: 25830,
      capiSyncRate: 99.8,
      avgHookRate: 48.2,
      avgHoldRate: 33.1,
    },
    dailySeries: [
      { date: '24 Sep', spend: 550, revenue: 3400, realRoas: 6.18, metaRoas: 4.10, hookRate: 47.0 },
      { date: '25 Sep', spend: 600, revenue: 3750, realRoas: 6.25, metaRoas: 4.30, hookRate: 49.2 },
      { date: '26 Sep', spend: 620, revenue: 3900, realRoas: 6.29, metaRoas: 4.40, hookRate: 48.8 },
      { date: '27 Sep', spend: 580, revenue: 3480, realRoas: 6.00, metaRoas: 4.05, hookRate: 46.5 },
      { date: '28 Sep', spend: 610, revenue: 3720, realRoas: 6.09, metaRoas: 4.25, hookRate: 48.0 },
      { date: '29 Sep', spend: 630, revenue: 3950, realRoas: 6.26, metaRoas: 4.35, hookRate: 50.1 },
      { date: '30 Sep', spend: 610, revenue: 3630, realRoas: 5.95, metaRoas: 3.95, hookRate: 48.2 },
    ],
    capiLogs: [
      { id: 'ev-11', event: 'Schedule / Dental_Diagnosis', timestamp: 'Hace 8m', value: '$800 MXN', status: 'MATCHED_CAPI_99%', signalSource: 'Calendar Booking' },
      { id: 'ev-12', event: 'Treatment_Accepted', timestamp: 'Hace 35m', value: '$18,500 MXN', status: 'MATCHED_CAPI_98%', signalSource: 'CRM Dental Sync' },
    ]
  },
  'tenant-eco-003': {
    summary: {
      realRoas: 3.94,
      metaReportedRoas: 2.85,
      realCac: 19.80,
      blendedCpa: 22.40,
      totalSpend: 5600,
      backendAttributedRevenue: 22064,
      capiSyncRate: 98.1,
      avgHookRate: 38.6,
      avgHoldRate: 24.2,
    },
    dailySeries: [
      { date: '24 Sep', spend: 750, revenue: 3000, realRoas: 4.00, metaRoas: 2.90, hookRate: 39.0 },
      { date: '25 Sep', spend: 800, revenue: 3120, realRoas: 3.90, metaRoas: 2.80, hookRate: 38.2 },
      { date: '26 Sep', spend: 820, revenue: 3280, realRoas: 4.00, metaRoas: 2.95, hookRate: 39.5 },
      { date: '27 Sep', spend: 800, revenue: 3040, realRoas: 3.80, metaRoas: 2.70, hookRate: 37.1 },
      { date: '28 Sep', spend: 790, revenue: 3160, realRoas: 4.00, metaRoas: 2.88, hookRate: 38.9 },
      { date: '29 Sep', spend: 840, revenue: 3360, realRoas: 4.00, metaRoas: 2.92, hookRate: 39.2 },
      { date: '30 Sep', spend: 800, revenue: 3104, realRoas: 3.88, metaRoas: 2.80, hookRate: 38.6 },
    ],
    capiLogs: [
      { id: 'ev-21', event: 'Purchase / Neon_Runner', timestamp: 'Hace 12m', value: '$3,600 MXN', status: 'MATCHED_CAPI_99%', signalSource: 'Shopify Server CAPI' },
      { id: 'ev-22', event: 'InitiateCheckout', timestamp: 'Hace 29m', value: '$7,200 MXN', status: 'MATCHED_CAPI_96%', signalSource: 'Vector Pixel' },
    ]
  },
  'tenant-fit-004': {
    summary: {
      realRoas: 5.20,
      metaReportedRoas: 3.75,
      realCac: 24.00,
      blendedCpa: 27.50,
      totalSpend: 2800,
      backendAttributedRevenue: 14560,
      capiSyncRate: 99.2,
      avgHookRate: 45.4,
      avgHoldRate: 31.0,
    },
    dailySeries: [
      { date: '24 Sep', spend: 400, revenue: 2080, realRoas: 5.20, metaRoas: 3.80, hookRate: 46.0 },
      { date: '25 Sep', spend: 400, revenue: 2120, realRoas: 5.30, metaRoas: 3.85, hookRate: 45.8 },
      { date: '26 Sep', spend: 410, revenue: 2132, realRoas: 5.20, metaRoas: 3.70, hookRate: 44.9 },
      { date: '27 Sep', spend: 390, revenue: 2028, realRoas: 5.20, metaRoas: 3.75, hookRate: 45.1 },
      { date: '28 Sep', spend: 400, revenue: 2080, realRoas: 5.20, metaRoas: 3.70, hookRate: 45.0 },
      { date: '29 Sep', spend: 400, revenue: 2080, realRoas: 5.20, metaRoas: 3.75, hookRate: 45.6 },
      { date: '30 Sep', spend: 400, revenue: 2040, realRoas: 5.10, metaRoas: 3.68, hookRate: 45.4 },
    ],
    capiLogs: [
      { id: 'ev-31', event: 'Membership_Signed', timestamp: 'Hace 15m', value: '$2,400 MXN', status: 'MATCHED_CAPI_98%', signalSource: 'Gym CRM Sync' },
    ]
  }
};

export const INITIAL_VERTICAL_CONFIGS = {
  'tenant-mex-001': {
    vertical: 'hospitality',
    hospitality: {
      digitalMenuUrl: 'https://cdn.vectorinside.com/menus/polanco-steak-2026.pdf',
      menuLastUpdated: '2026-09-28',
      maxTableCapacity: 12,
      minDepositRequired: 1000,
      autoCancelMinutes: 15,
      zones: ['Terraza Principal (Fumadores)', 'Salón Comedor VIP', 'Cava Privada de Catas', 'Barra Mixología'],
      ragKnowledgeDocs: ['Menu_Precios_2026.pdf', 'Protocolo_Alergenos.pdf', 'Carta_Vinos_Maridaje.pdf'],
      systemPrompt: 'Eres el Co-Pilot Concierge de Polanco Steakhouse. Atiende solicitudes de reserva validando zona, comensales y consumo sugerido con tono sofisticado y cordial.',
      temperature: 0.35,
      activeModel: 'Claude 3.5 Sonnet / Vector RAG Engine',
    }
  },
  'tenant-med-002': {
    vertical: 'service_appointments',
    service_appointments: {
      googleCalendarId: 'c_98129031_odontovanguardia@group.calendar.google.com',
      calendarSyncEnabled: true,
      bufferBetweenAppointmentsMin: 15,
      defaultAppointmentDurationMin: 45,
      requirePrePayment: true,
      prePaymentAmount: 800,
      workingHours: 'Lun-Vie 09:00 - 19:30 | Sáb 09:00 - 14:00',
      availableSpecialists: ['Dr. Roberto Peña (Maxilofacial)', 'Dra. Claudia Ortiz (Ortodoncia)', 'Dr. Iván Morales (Estética Dental)'],
      ragKnowledgeDocs: ['Lista_Procedimientos_2026.pdf', 'Preguntas_Frecuentes_Implantes.pdf'],
      systemPrompt: 'Eres el asistente médico de OdontoVanguardia. Califica la necesidad odontológica del paciente, orienta sobre especialidades y sugiere horarios libres sin emitir diagnósticos definitivos.',
      temperature: 0.2,
      activeModel: 'GPT-4o / Vector Medical RAG',
    }
  },
  'tenant-eco-003': {
    vertical: 'ecommerce',
    ecommerce: {
      platform: 'Shopify Plus',
      storeDomain: 'store.kromatik.luxury',
      metaPixelId: 'pix_99182390124',
      capiConversionToken: 'EAAG9230198293019283019823019283019283019',
      stripeWebhookConfigured: true,
      abandonedCartDelayMinutes: 45,
      dynamicDiscountPercent: 10,
      catalogSyncActive: true,
      ragKnowledgeDocs: ['Catalogo_Coleccion_2026.json', 'Politicas_Envios_Internacionales.pdf', 'Guia_Tallas_Sneakers.pdf'],
      systemPrompt: 'Eres el Stylist & Sales Executive de Kromatik. Ayuda a los compradores con tallas, materiales de sneakers premium y recupera carritos con ofertas exclusivas por tiempo limitado.',
      temperature: 0.4,
      activeModel: 'GPT-4o Mini / Vector E-Commerce Embeddings',
    }
  },
  'tenant-fit-004': {
    vertical: 'service_appointments',
    service_appointments: {
      googleCalendarId: 'c_nexus_gym_evaluations@group.calendar.google.com',
      calendarSyncEnabled: true,
      bufferBetweenAppointmentsMin: 10,
      defaultAppointmentDurationMin: 60,
      requirePrePayment: false,
      workingHours: 'Lun-Dom 06:00 - 22:00',
      availableSpecialists: ['Coach Marcelo (Fuerza)', 'Dra. Elena Ramos (Nutrición Deportiva)'],
      ragKnowledgeDocs: ['Planes_Membresia_Nexus.pdf', 'Protocolo_Prueba_Esfuerzo.pdf'],
      systemPrompt: 'Eres el asesor de membresías de Nexus Hub. Invita a los atletas a agendar su valoración inicial de rendimiento.',
      temperature: 0.3,
      activeModel: 'Claude 3.5 Sonnet / Vector RAG',
    }
  }
};
