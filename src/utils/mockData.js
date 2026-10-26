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
  },
  {
    id: 'alt-005',
    tenantId: 'corp',
    tenantName: 'Vector Corporate Solutions B2B',
    type: 'B2B_DISCOVERY_CALL',
    vertical: 'b2b_sales',
    title: 'Lead Calificado BANT: Discovery Call ($45,000 USD Pipeline)',
    clientName: 'Lic. Rodrigo Elizondo (VP Operaciones)',
    clientPhone: '+52 55 4120 7890',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    status: 'PENDING_AGENCY_APPROVAL',
    confidenceScore: 97,
    botSummary: 'Lead calificado mediante metodología BANT. Empresa de 180 empleados con presupuesto aprobado de $50k USD. Se solicita Discovery Call y sincronización con HubSpot CRM.',
    proposedData: {
      company: 'Logística Global Monterrey S.A.',
      role: 'VP Operaciones & Tecnología',
      bantScore: 'Aprobado (Presupuesto $50k USD / Decisión Inmediata)',
      date: 'Próx. Miércoles, 10:00 hrs (Zoom)',
      crmTarget: 'HubSpot CRM Enterprise (Pipeline B2B Q4)',
      estimatedValue: 45000,
    },
    transcriptSnippet: [
      { sender: 'user', text: 'Hola, buscamos implementar la infraestructura de IA de Vector para automatizar nuestras 4 sucursales.' },
      { sender: 'bot', text: '¡Excelente Rodrigo! Para preparar la propuesta a tu medida: ¿cuentan con presupuesto asignado para este trimestre?' },
      { sender: 'user', text: 'Sí, tenemos $50,000 USD presupuestados y buscamos iniciar el próximo mes.' },
      { sender: 'bot', text: 'Perfecto. He reservado la Discovery Call con nuestro Director de Soluciones el próximo miércoles a las 10:00 hrs.' }
    ],
    urgency: 'HIGH',
    source: 'LinkedIn B2B Campaign / WhatsApp'
  },
  {
    id: 'alt-006',
    tenantId: 'creator',
    tenantName: 'Alex Rivera — Tech & Growth Creator',
    type: 'BRAND_SPONSORSHIP_PROPOSAL',
    vertical: 'creator_economy',
    title: 'Propuesta Patrocinio de Marca: Sony Audio ($3,500 USD)',
    clientName: 'Mariana Valenzuela (Agency PR Sony)',
    clientPhone: '+52 55 9988 1122',
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    status: 'PENDING_AGENCY_APPROVAL',
    confidenceScore: 99,
    botSummary: 'La agencia PR de Sony solicita colaboración para el lanzamiento de los audífonos WH-1000XM6. Presupuesto ofrecido: $3,500 USD por 1 Reel dedicado + 3 Stories con link de afiliado.',
    proposedData: {
      brand: 'Sony Electronics México',
      deliverables: '1 Reel Dedicado + 3 Stories con Sticker de Enlace',
      campaignBudget: '$3,500 USD',
      targetDate: '20 de Octubre 2026',
      mediaKitSent: 'Media_Kit_AlexRivera_2026.pdf',
      estimatedValue: 3500,
    },
    transcriptSnippet: [
      { sender: 'user', text: 'Hola Alex! Somos de la agencia de PR de Sony. Nos encantó tu último Reel de productividad y queremos pautar una integración en tu canal.' },
      { sender: 'bot', text: '¡Hola Mariana! Gracias por contactar al equipo de Alex Rivera. ¿Cuál es el presupuesto estimado y las entregas solicitadas?' },
      { sender: 'user', text: 'Ofrecemos $3,500 USD para 1 Reel y 3 Stories para la última semana de este mes.' },
      { sender: 'bot', text: 'Excelente. He enviado el Media Kit oficial y la propuesta está en revisión con el Manager de la Agencia para aprobación final.' }
    ],
    urgency: 'HIGH',
    source: 'Instagram Direct API'
  },
  {
    id: 'alt-007',
    tenantId: 'creator',
    tenantName: 'Alex Rivera — Tech & Growth Creator',
    type: 'KEYWORD_DM_TRIGGER',
    vertical: 'creator_economy',
    title: 'Disparador Viral: 180 DMs Despachados (Keyword "PLANTILLA")',
    clientName: 'Meta Graph Webhook Watcher',
    clientPhone: 'N/A',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: 'PENDING_AGENCY_APPROVAL',
    confidenceScore: 96,
    botSummary: 'El Reel "5 Herramientas de IA para Crear Contenido" alcanzó 85k views en 2 hrs. Se dispararon 180 DMs automáticos con la guía y el enlace a la Masterclass.',
    proposedData: {
      reelTitle: 'Reel: "5 Herramientas de IA para Crear Contenido"',
      triggerKeyword: 'PLANTILLA',
      dmsDispatched: 180,
      checkoutClicks: 64,
      estimatedValue: 4200,
    },
    transcriptSnippet: [
      { sender: 'system', text: 'Meta Webhook: 180 comentarios detectados con la palabra clave PLANTILLA. 180 DMs despachados exitosamente.' }
    ],
    urgency: 'NORMAL',
    source: 'Instagram Graph API Comments'
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
      { id: 'ev-01', event: 'Venta / Reserva de Mesa', timestamp: 'Hace 4m', value: '$4,200 MXN', status: 'Sincronizado CAPI (98%)', signalSource: 'WhatsApp + Stripe' },
      { id: 'ev-02', event: 'Prospecto de Alta Intención', timestamp: 'Hace 18m', value: 'N/A', status: 'Sincronizado CAPI (95%)', signalSource: 'Meta Adset #441' },
      { id: 'ev-03', event: 'Venta / Adicional Gourmet', timestamp: 'Hace 42m', value: '$1,850 MXN', status: 'Sincronizado CAPI (99%)', signalSource: 'TPV Terminal Sync' },
      { id: 'ev-04', event: 'Cita Confirmada', timestamp: 'Hace 1h', value: '$3,500 MXN', status: 'Sincronizado CAPI (97%)', signalSource: 'Google Calendar API' },
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
      { id: 'ev-11', event: 'Cita / Valoración Clínica', timestamp: 'Hace 8m', value: '$800 MXN', status: 'Sincronizado CAPI (99%)', signalSource: 'Calendar Booking' },
      { id: 'ev-12', event: 'Tratamiento Aceptado', timestamp: 'Hace 35m', value: '$18,500 MXN', status: 'Sincronizado CAPI (98%)', signalSource: 'CRM Dental Sync' },
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
      { id: 'ev-21', event: 'Venta / Calzado Deportivo', timestamp: 'Hace 12m', value: '$3,600 MXN', status: 'Sincronizado CAPI (99%)', signalSource: 'Shopify Server CAPI' },
      { id: 'ev-22', event: 'Inicio de Compra', timestamp: 'Hace 29m', value: '$7,200 MXN', status: 'Sincronizado CAPI (96%)', signalSource: 'Vector Pixel' },
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
      { id: 'ev-31', event: 'Membresía Contratada', timestamp: 'Hace 15m', value: '$2,400 MXN', status: 'Sincronizado CAPI (98%)', signalSource: 'Gym CRM Sync' },
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
  },
  'corp': {
    vertical: 'b2b_sales',
    b2b_sales: {
      crmProvider: 'HubSpot CRM Enterprise',
      crmApiKey: 'pat-na1-901928301982-vector-b2b',
      crmPipelineStage: 'Discovery Call Agendada (B2B Q4)',
      bantMinBudget: 5000,
      discoveryCallDurationMin: 30,
      qualificationMethod: 'BANT (Budget, Authority, Need, Timeline)',
      meetingLink: 'https://meet.google.com/vec-corp-demo',
      salesDirectorEmail: 'carlos.mendoza@vectorinside.com',
      ragKnowledgeDocs: ['Deck_Corporativo_Vector_2026.pdf', 'Propuesta_Enterprise_SaaS.pdf', 'Matriz_Calificacion_BANT.pdf', 'Casos_Exito_HighTicket.pdf'],
      systemPrompt: 'Eres el Senior SDR / Solutions AI Consultant de Vector Corporate Solutions. Califica al prospecto con metodología BANT (Presupuesto > $5,000 USD, Tomador de Decisión C-Level o Director, Necesidad dentro del trimestre). Al cumplir con los criterios, agenda una Discovery Call de 30 minutos y sincroniza el deal automáticamente con el CRM.',
      temperature: 0.25,
      activeModel: 'Claude 3.5 Sonnet / Vector B2B High-Ticket Engine',
    }
  },
  'dental': {
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
      systemPrompt: 'Eres el asistente médico de Odontología Integral. Califica la necesidad del paciente, orienta sobre especialidades y sugiere horarios libres.',
      temperature: 0.2,
      activeModel: 'GPT-4o / Vector Medical RAG',
    }
  },
  'polanco': {
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
  'urban': {
    vertical: 'ecommerce',
    ecommerce: {
      platform: 'Shopify Plus',
      storeDomain: 'store.urbansneaks.mx',
      metaPixelId: 'pix_99182390124',
      capiConversionToken: 'EAAG9230198293019283019823019283019283019',
      stripeWebhookConfigured: true,
      abandonedCartDelayMinutes: 45,
      dynamicDiscountPercent: 10,
      catalogSyncActive: true,
      ragKnowledgeDocs: ['Catalogo_Coleccion_2026.json', 'Politicas_Envios_Nacionales.pdf', 'Guia_Tallas_Sneakers.pdf'],
      systemPrompt: 'Eres el Stylist & Sales Executive de Urban Sneaks. Ayuda a los compradores con tallas, modelos exclusivos y recupera carritos.',
      temperature: 0.4,
      activeModel: 'GPT-4o Mini / Vector E-Commerce Embeddings',
    }
  },
  'creator': {
    vertical: 'creator_economy',
    creator_economy: {
      instagramHandle: '@alexrivera_tech',
      facebookPageId: 'page_98129031238',
      metaGraphWebhookConnected: true,
      keywordTriggers: ['PLANTILLA', 'MENTORIA', 'AUDITORIA', 'CURSO', 'PRECIO'],
      minSponsorshipBudgetUSD: 1500,
      mediaKitUrl: 'https://cdn.vectorinside.com/mediakits/alex-rivera-2026.pdf',
      autoDmFollowUpMinutes: 10,
      toxicityFilterLevel: 'Estricto (Ocultar insultos y bloquear spam)',
      ragKnowledgeDocs: ['Media_Kit_Oficial_2026.pdf', 'Tarifario_Sponsorships_Reels.pdf', 'Guia_Mentorias_HighTicket.pdf', 'Brandbook_AlexRivera.pdf'],
      systemPrompt: 'Eres el AI Growth & Brand Manager de Alex Rivera (@alexrivera_tech). En comentarios de Reels, detecta palabras clave y envía el enlace por DM con tono cercano y enérgico. En DMs, filtra ofertas de marcas solicitando su presupuesto y Media Kit; si ofrecen más de $1,500 USD, deriva el trato a la Agencia en la bandeja HITL.',
      temperature: 0.4,
      activeModel: 'DeepSeek R1 / Vector Creator Engine',
    }
  }
};

// ============================================================================
// TELEMETRÍA Y LOGS EN VIVO DE SUB-AGENTES (EN BUFFER DE MEMORIA)
// ============================================================================
export const SUB_AGENTS_METRICS_MOCK = {
  supervisor: {
    status: 'ONLINE',
    latencyMs: 12,
    todayEventsRouted: 1480,
    confidenceAvg: '98.5%',
    costEstUSD: '$0.00 USD (Prompt Caching 94%)',
    lastEvent: 'Enrutado a SubAgente_Moderador_Closer para +52 55 1234 5678',
    activeRule: 'Aislamiento RLS por tenant_id garantizado en cada transacción',
  },
  closer: {
    status: 'ONLINE',
    latencyMs: 340,
    todayEvaluations: 412,
    billableLeadsGenerated: 14,
    freebusyCallsDirect: 28, // Sin tokens LLM
    costEstUSD: '$0.08 USD (DeepSeek V3 Delta)',
    lastEvaluation: 'Ana Martínez: 4/4 Criterios validados -> Cita Martes 14:00',
    activeRule: 'JTBD: Validación de struggling moment antes de revelar arancel',
  },
  reengagement: {
    status: 'ONLINE_SCHEDULED',
    latencyMs: 450,
    active24hQueueCount: 23,
    revivedLeadsThisWeek: 9,
    revivalRate: '39.1%',
    costEstUSD: '$0.00 USD (Batching Llama 3 Groq)',
    lastDispatchedMessage: 'Mensaje Vaca Púrpura despachado a Carlos Mendoza Jr. (38 palabras)',
    activeRule: 'Regla 95/5: Máximo 40 palabras, nada agresivo, micro-CTA',
  },
  analyst: {
    status: 'ONLINE_STANDBY',
    latencyMs: 820,
    adsAuditedCount: 18,
    creativeFatiguesFlagged: 2,
    webFrictionAlerts: 1,
    costEstUSD: '$0.02 USD (Batch semanal)',
    lastDiagnostic: 'Fricción en Landing Page detectada en Odontología Integral (Click-to-WA: 1.4% < 3.0%)',
    activeRule: 'CAPI Server-to-Server vs Meta Ads API: ROAS Real calculado en 4.82x',
  },
};

export const REENGAGEMENT_QUEUE_MOCK = [
  {
    id: 're-001',
    leadId: 'lead-006',
    clientName: 'Carlos Mendoza Jr.',
    phone: '+52 55 6677 8899',
    productInterest: 'Limpieza Dental Ultrasónica ($850 MXN)',
    lastObjection: 'Lo voy a pensar (Evasiva)',
    timeRemaining: '14h 22m',
    targetScheduledAt: 'Hoy, 16:12 hrs',
    status: 'En Cola de Re-contacto (24h)',
    vacaPurpuraMessage: 'Hola Carlos! Estuve pensando en tu consulta. Sabías que el 90% de las caries invisibles se previenen con profilaxis ultrasónica anual? Te gustaría que te aparte un espacio con diagnóstico 3D sin costo este jueves?',
    wordCount: 36,
    framework: 'Vaca Púrpura + Regla 95/5',
  },
  {
    id: 're-002',
    leadId: 'lead-005',
    clientName: 'Valeria Cordero',
    phone: '+52 55 9821 4433',
    productInterest: 'Carillas de Resina de Alta Estética',
    lastObjection: 'Viendo opciones sin profundizar en MSI',
    timeRemaining: '08h 45m',
    targetScheduledAt: 'Hoy, 20:25 hrs',
    status: 'En Cola de Re-contacto (24h)',
    vacaPurpuraMessage: 'Hola Valeria! Para tu diseño de sonrisa: contamos con una simulación digital previa para que veas el resultado antes de tocar tus dientes. Quieres que te envíe un video de cómo se realiza en 1 sola sesión?',
    wordCount: 38,
    framework: 'JTBD + Ecuación de Valor',
  },
  {
    id: 're-003',
    leadId: 'lead-008',
    clientName: 'Eduardo Garza',
    phone: '+52 55 3322 1100',
    productInterest: 'Mesa Terraza 6 Personas (Polanco Steakhouse)',
    lastObjection: 'Checando con la familia el horario',
    timeRemaining: '02h 15m',
    targetScheduledAt: 'Hoy, 17:00 hrs',
    status: 'Disparo Inminente',
    vacaPurpuraMessage: 'Hola Eduardo! Nos quedan únicamente 2 mesas en Terraza Principal para este fin de semana. Deseas que te guarde una con la cortesía de bienvenida del Sommelier?',
    wordCount: 29,
    framework: 'Vaca Púrpura (Escasez Real)',
  },
];

export const FULL_FUNNEL_METRICS_MOCK = {
  impressions: 124800,
  adClicks: 4210,
  cpcAvg: '$3.80 MXN',
  webSessions: 3420,
  whatsappClicks: 48,
  clickToWhatsAppRate: '1.4%', // < 3.0% -> Dispara Fricción Web
  chatsInitiated: 48,
  qualifiedHotLeads: 22,
  billableLeadsCount: 12,
  costPerBillableLead: '$287.50 MXN', // < $350 MXN (Margen de ganancia $62.50 por lead)
  realBackendRevenue: '$168,400 MXN',
  realRoas: 5.9,
  metaReportedRoas: 3.4,
};

