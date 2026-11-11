export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  SUPER_ADMIN_AGENCY: 'admin',
  COMMUNITY_MANAGER: 'admin',
  CLIENT_READ_ONLY: 'client',
};

// ============================================================================
// MATRIZ DE TEMPERATURA Y ESTADOS DE LEAD (ENUMS DETERMINISTAS)
// ============================================================================
export const LEAD_STATUS_ENUM = {
  LEAD_COLD_24H: 'LEAD_COLD_24H',
  LEAD_WARM_24H: 'LEAD_WARM_24H',
  LEAD_HOT_PREQUAL: 'LEAD_HOT_PREQUAL',
  BILLABLE_LEAD: 'BILLABLE_LEAD',
  HITL_INTERVENTION: 'HITL_INTERVENTION',
};

export const KANBAN_COLUMNS_CONFIG = [
  {
    id: LEAD_STATUS_ENUM.LEAD_COLD_24H,
    title: 'Ingreso / Frío',
    badge: 'Ingreso 24h',
    color: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
    dotColor: 'bg-blue-400',
    description: 'Solicitó precio/info básica y pausó. Re-contactación automática a 24h.',
    countdownLabel: 'Ventana 24h Activa',
  },
  {
    id: LEAD_STATUS_ENUM.LEAD_WARM_24H,
    title: 'En Seguimiento 24h',
    badge: 'Seguimiento 24h',
    color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
    dotColor: 'bg-amber-400',
    description: 'Respondió preguntas breves. Presentación de CTA explícito de aclaración.',
    countdownLabel: 'Nurture 24h',
  },
  {
    id: LEAD_STATUS_ENUM.LEAD_HOT_PREQUAL,
    title: 'Cálido',
    badge: 'Prospecto Cálido',
    color: 'from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/30',
    dotColor: 'bg-orange-400',
    description: 'Indagó opciones de financiamiento/pago. En espera de confirmación de cita.',
    countdownLabel: 'Alta Intención',
  },
  {
    id: LEAD_STATUS_ENUM.BILLABLE_LEAD,
    title: 'Calificado',
    badge: 'CALIFICADO',
    color: 'from-neon/20 to-lime-500/10 text-neon border-neon/40 shadow-[0_0_15px_rgba(229,255,0,0.15)]',
    dotColor: 'bg-neon',
    description: '4 criterios completados. Prospecto de alto valor listo para venta o cita.',
    countdownLabel: 'Listo para Cierre',
  },
  {
    id: LEAD_STATUS_ENUM.HITL_INTERVENTION,
    title: 'Intervención de Asesor Humano',
    badge: 'ATENCIÓN HUMANA',
    color: 'from-red-500/25 to-rose-600/10 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    dotColor: 'bg-red-500 animate-pulse',
    description: 'Atención pausada por lenguaje agresivo o petición explícita. Asignado a asesor.',
    countdownLabel: 'Atención Prioritaria',
  },
];

export const QUALIFIED_LEAD_CRITERIA = [
  {
    id: 'identity',
    key: 'identityValidated',
    label: 'Criterio 1: Identidad y Contacto Verificados',
    description: 'Nombre completo, correo electrónico y WhatsApp confirmados.',
  },
  {
    id: 'catalog',
    key: 'catalogIdentified',
    label: 'Criterio 2: Interés Específico en Catálogo',
    description: 'Identificación clara del producto o servicio de interés.',
  },
  {
    id: 'financial',
    key: 'financialClarified',
    label: 'Criterio 3: Aclaración Financiera Completa',
    description: 'Precios, métodos de pago, costos o mensualidades clarificados.',
  },
  {
    id: 'consent',
    key: 'consentOrBooked',
    label: 'Criterio 4: Aceptación Expresa o Cita Confirmada',
    description: 'Autorización clara de contacto comercial o cita agendada en calendario.',
  },
];


export const SOCIAL_NETWORKS_CATALOG = {
  INSTAGRAM: {
    id: 'INSTAGRAM',
    name: 'Instagram',
    iconName: 'Instagram',
    color: 'from-pink-500 to-purple-600',
    badgeColor: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
    formats: ['REEL', 'CAROUSEL', 'STORY', 'POST'],
    supportedAudience: 'B2C / Visual / Engagement',
  },
  FACEBOOK: {
    id: 'FACEBOOK',
    name: 'Facebook',
    iconName: 'Facebook',
    color: 'from-blue-600 to-blue-700',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    formats: ['POST', 'REEL', 'STORY', 'COMMUNITY'],
    supportedAudience: 'B2C / Familias / Local',
  },
  WHATSAPP: {
    id: 'WHATSAPP',
    name: 'WhatsApp Cloud API',
    iconName: 'MessageSquare',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    formats: ['BROADCAST', 'DIRECT_DM', 'CATALOG'],
    supportedAudience: 'Conversacional / 1-on-1',
  },
  TIKTOK: {
    id: 'TIKTOK',
    name: 'TikTok',
    iconName: 'Video',
    color: 'from-rose-500 via-zinc-900 to-cyan-500',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    formats: ['TIKTOK_VIDEO', 'SPARK_ADS'],
    supportedAudience: 'Gen Z / Viral / Trend Discovery',
  },
  LINKEDIN: {
    id: 'LINKEDIN',
    name: 'LinkedIn',
    iconName: 'Linkedin',
    color: 'from-blue-700 to-sky-700',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    formats: ['CAROUSEL_PDF', 'ARTICLE_B2B', 'EXECUTIVE_POST'],
    supportedAudience: 'B2B / Corporativo / High-Ticket / Decisores',
  },
  YOUTUBE: {
    id: 'YOUTUBE',
    name: 'YouTube Shorts',
    iconName: 'Play',
    color: 'from-red-600 to-red-700',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10',
    formats: ['YOUTUBE_SHORT', 'LONG_FORM_PODCAST'],
    supportedAudience: 'Educativo / Búsqueda Evergreen',
  },
};

export const OMNICHANNEL_API_CATALOG = {
  meta: {
    id: 'meta',
    name: 'Meta Ads & CAPI',
    shortName: 'Meta Ads',
    category: 'Anuncios y Redes',
    iconName: 'Instagram',
    color: 'from-pink-500 to-purple-600',
    badgeColor: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
    description: 'Instagram Ads, Facebook Ads y Conversions API (CAPI) Server-to-Server sin cookies.',
    credentialsGuide: 'Obtén tu Pixel ID y Token de Conversiones en Meta Business Manager > Configuración del Negocio > Orígenes de Datos.',
    fields: [
      { key: 'pixelId', label: 'Dataset / Pixel ID', type: 'text', placeholder: '123456789012345' },
      { key: 'accessToken', label: 'Token de Acceso Permanente (CAPI)', type: 'password', placeholder: 'EAAX...' },
      { key: 'adAccountId', label: 'ID de Cuenta Publicitaria', type: 'text', placeholder: 'act_123456789' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
  google: {
    id: 'google',
    name: 'Google Analytics 4 & Ads',
    shortName: 'Google Ads/GA4',
    category: 'Búsqueda y Analítica Web',
    iconName: 'Globe',
    color: 'from-blue-600 to-amber-500',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    description: 'Medición de tráfico orgánico, búsqueda en Google, campañas de Google Ads y tasa de rebote.',
    credentialsGuide: 'Obtén tu Measurement ID y API Secret en Google Analytics 4 > Administrador > Flujos de datos > Protocolo de medición.',
    fields: [
      { key: 'measurementId', label: 'Measurement ID (GA4)', type: 'text', placeholder: 'G-XXXXXXXXXX' },
      { key: 'apiSecret', label: 'API Secret del Measurement Protocol', type: 'password', placeholder: 'Sec_98124...' },
      { key: 'googleAdsCustomerId', label: 'Google Ads Customer ID (10 dígitos)', type: 'text', placeholder: '123-456-7890' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Business Cloud API',
    shortName: 'WhatsApp API',
    category: 'Mensajería Directa',
    iconName: 'MessageSquare',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    description: 'Atención 1-a-1 automatizada, entrega de propuestas, citas de Google Calendar y re-contacto 24h.',
    credentialsGuide: 'Obtén tu Phone Number ID y Token en Meta for Developers > Tu App de WhatsApp > Configuración de la API.',
    fields: [
      { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text', placeholder: '109827364512345' },
      { key: 'wabaId', label: 'WhatsApp Business Account ID (WABA)', type: 'text', placeholder: '987654321098765' },
      { key: 'accessToken', label: 'Token Permanente de Cloud API', type: 'password', placeholder: 'EAAG...' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok Ads & Events API',
    shortName: 'TikTok Ads',
    category: 'Video Corto y Viralidad',
    iconName: 'Video',
    color: 'from-rose-500 via-zinc-900 to-cyan-500',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    description: 'Campañas de video corto, Spark Ads y eventos de conversión directa desde TikTok.',
    credentialsGuide: 'Obtén tu Pixel Code y Access Token en TikTok Ads Manager > Herramientas > Eventos > Web Events.',
    fields: [
      { key: 'pixelCode', label: 'TikTok Pixel Code', type: 'text', placeholder: 'C1234567890ABCDE' },
      { key: 'accessToken', label: 'Events API Access Token', type: 'password', placeholder: 'act_tiktok_token_...' },
      { key: 'advertiserId', label: 'TikTok Advertiser ID', type: 'text', placeholder: '7123456789012345678' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn Marketing Solutions (B2B)',
    shortName: 'LinkedIn B2B',
    category: 'Corporativo y Lead Gen B2B',
    iconName: 'Linkedin',
    color: 'from-blue-700 to-sky-700',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    description: 'Captación de ejecutivos, decisores de compra corporativa, formularios Lead Gen y Sponsored Content.',
    credentialsGuide: 'Obtén tus claves en LinkedIn Developer Portal > Tu App > Auth > Client ID y Client Secret.',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', placeholder: '78abcdef123456' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'SecretKey_...' },
      { key: 'adAccountId', label: 'LinkedIn Ad Account URN', type: 'text', placeholder: 'urn:li:sponsoredAccount:123456' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube Data & Analytics API',
    shortName: 'YouTube',
    category: 'Video de Alta Retención',
    iconName: 'Play',
    color: 'from-red-600 to-red-700',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10',
    description: 'Seguimiento de vistas, tasa de retención por segundo de contenido en video y detección de fatiga.',
    credentialsGuide: 'Crea una clave en Google Cloud Console habilitando la API "YouTube Data API v3" y especifica tu Channel ID.',
    fields: [
      { key: 'apiKey', label: 'Google Cloud API Key', type: 'password', placeholder: 'AIzaSy...' },
      { key: 'channelId', label: 'YouTube Channel ID', type: 'text', placeholder: 'UC_x5XG1OV2P6uZZ5FSM9Ttw' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
  x: {
    id: 'x',
    name: 'X (Twitter) Developer API',
    shortName: 'X (Twitter)',
    category: 'Menciones y Redes',
    iconName: 'Share2',
    color: 'from-zinc-700 to-black',
    badgeColor: 'border-zinc-500/40 text-zinc-300 bg-zinc-500/10',
    description: 'Monitoreo de conversaciones de marca en tiempo real, respuesta de servicio al cliente y anuncios.',
    credentialsGuide: 'Obtén tu API Key y Bearer Token en developer.x.com > Projects & Apps.',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text', placeholder: 'X_API_KEY_...' },
      { key: 'bearerToken', label: 'Bearer Token v2', type: 'password', placeholder: 'AAAAAAAAAAAAAAAAAAAAA...' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram Bot API',
    shortName: 'Telegram',
    category: 'Comunidades y Alertas',
    iconName: 'Send',
    color: 'from-sky-500 to-blue-600',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    description: 'Canal de mensajería instantánea para comunidades VIP, difusión de ofertas y avisos directos.',
    credentialsGuide: 'Inicia conversación en Telegram con @BotFather, ejecuta /newbot y copia el token generado.',
    fields: [
      { key: 'botToken', label: 'Telegram Bot Token', type: 'password', placeholder: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ' },
      { key: 'chatId', label: 'Canal / Chat ID Predeterminado', type: 'text', placeholder: '@MiCanalOficial o -100123456789' },
    ],
    defaultMetrics: {
      clicks: 0,
      cpc: '$0.00 MXN',
      bounceRate: '0.0%',
      adFatigueScore: 0.0,
      latencyMs: 0,
      webhookStatus: 'Sin actividad',
      retentionScore: '0%',
    },
  },
};

export const INITIAL_TENANTS_DATA = {};

export const INITIAL_TENANTS = Object.values(INITIAL_TENANTS_DATA);

export const SAMPLE_ONBOARDING_PAYLOAD = {
  tenant_id: 'tenant_sonrisas_001',
  business_name: 'Clínica Dental Sonrisas',
  legal_name_tax_id: 'Sonrisas Dentales S.A. de C.V. / SDS120304XYZ',
  vertical_tipo: 'service_appointments',
  owner_name: 'Dr. Alejandro Silva',
  owner_phone: '+525598765432',
  meta_credentials: {
    whatsapp_phone_number_id: '10987654321',
    waba_id: '98765432109',
    whatsapp_access_token: 'EAAX...',
    instagram_account_id: '1784140000000',
    facebook_page_id: '100555444333',
  },
  web_tracking: {
    has_website: true,
    website_url: 'https://clinicasonrisas.com',
    ga4_measurement_id: 'G-ABC123XYZ',
    meta_pixel_id: '123456789012345',
    meta_capi_token: 'EAAX_CAPI...',
  },
  google_calendar_integration: {
    google_calendar_id: 'c_dental_sonrisas@group.calendar.google.com',
    google_credentials_json: '{"type": "service_account"}',
    business_hours: {
      monday_friday: '09:00-18:00',
      saturday: '09:00-14:00',
    },
    appointment_duration_minutes: 45,
  },
  financial_performance_rules: {
    target_cac_limit: 20.0,
    cost_per_qualified_lead: 15.0,
    monthly_ad_budget: 1500.0,
  },
  ai_rag_configuration: {
    brand_voice_tone: 'Profesional, empático y orientativo',
    custom_system_prompt: 'Siempre ofrecer la cita de valoración gratuita antes de dar presupuesto definitivo.',
    vector_collection_id: 'vec_sonrisas_knowledge_01',
  },
};


export const DEMO_USERS = [
  {
    id: 'usr-admin-01',
    name: 'Edgar Lobo Vectorial',
    email: 'Edgaradmin@vectorinside.com',
    role: USER_ROLES.ADMIN,
    roleTitle: 'Director General · Lobo Vectorial',
    badge: 'SUPERADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

// ============================================================================
// CONFIGURACIÓN OFICIAL DE SUB-AGENTES (PROMPTS XML, ESQUEMAS JSON Y FRECUENCIAS)
// ============================================================================
export const SUB_AGENTS_CONFIG = {
  supervisor: {
    id: 'supervisor',
    key: 'supervisor',
    name: 'Supervisor Central ("Lobo Vectorial")',
    codeName: 'Lobo Vectorial',
    engine: 'LangGraph Orchestrator',
    role: 'Enrutador Cognitivo & Centinela Multi-Tenant',
    badge: 'SUPERVISOR',
    badgeVariant: 'neon',
    model: 'DeepSeek V3 / Groq Llama 3',
    latency: '12ms',
    triggerType: 'REAL_TIME',
    triggerLabel: '⚡ En Tiempo Real (0ms / Event-Driven)',
    framework: 'AIDA / STP / Aislamiento RLS',
    efficiencyStrategy: 'Prompt Caching ($0.014/1M) • Congelamiento de contexto RAG base',
    systemPromptXml: `<system_prompt>
<identity>
Eres el Agente Supervisor Central ("Lobo Vectorial") de Vector Comunity OS. Tu único objetivo es analizar los mensajes entrantes de Meta (WhatsApp/Instagram), clasificar la intencionalidad del usuario y enrutar la petición al Sub-Agente especializado correcto, protegiendo el aislamiento del <tenant_id>.
</identity>

<context_variables>
- TENANT_ID: {tenant_id}
- ENTIDAD: {business_name}
- VERTICAL_TIPO: {vertical_tipo}
- HAS_WEBSITE: {has_website}
- BRAND_PURPOSE: {brand_purpose}
</context_variables>

<routing_rules>
1. Si el mensaje es un saludo inicial, pregunta de precio, ubicación o catálogo -> ENRUTAR A: SubAgente_Moderador_Closer.
2. Si el mensaje expresa molestia, queja de servicio, reclamo o solicitud de hablar con un humano -> EJECUTAR PROTOCOLO TRIAGE_HUMANO -> PAUSAR BOT -> NOTIFICAR AGENCY_COPILOT.
3. Si el mensaje es una respuesta a un seguimiento de 24 horas -> ENRUTAR A: SubAgente_Reengagement.
4. Si el mensaje contiene confirmación explícita de cita ("Sí, quiero agendar") -> ENRUTAR A: SubAgente_Agendamiento_Calendar.
</routing_rules>

<output_format>
Debes responder ÚNICAMENTE en formato JSON estrictamente válido:
{
  "tenant_id": "{tenant_id}",
  "target_agent": "SubAgente_Moderador_Closer | Triage_Humano | SubAgente_Reengagement | SubAgente_Agendamiento_Calendar",
  "intent_category": "SALUDO | PRECIO | OBJECION_FINANCIAMIENTO | RECLAMO | AGENDAMIENTO",
  "confidence_score": 0.95
}
</output_format>
</system_prompt>`,
    outputJsonSchema: {
      tenant_id: "tenant_id",
      target_agent: "SubAgente_Moderador_Closer | Triage_Humano | SubAgente_Reengagement | SubAgente_Agendamiento_Calendar",
      intent_category: "SALUDO | PRECIO | OBJECION_FINANCIAMIENTO | RECLAMO | AGENDAMIENTO",
      confidence_score: 0.95
    }
  },
  closer: {
    id: 'closer',
    key: 'closer',
    name: 'Sub-Bot Moderador & Closer',
    codeName: 'Moderador Closer',
    engine: 'CrewAI / DeepSeek V3',
    role: 'AIDA, JTBD & Validación BILLABLE_LEAD (4 Criterios)',
    badge: 'CLOSER & AIDA',
    badgeVariant: 'warning',
    model: 'DeepSeek V3 (< 800ms)',
    latency: '340ms',
    triggerType: 'REAL_TIME',
    triggerLabel: '⚡ En Tiempo Real (Event-Driven)',
    framework: 'Círculo Dorado / JTBD / Ecuación de Valor (Hormozi)',
    efficiencyStrategy: 'Tool Nativa Google Calendar (REST directo sin tokens LLM)',
    systemPromptXml: `<system_prompt>
<identity>
Eres el Sub-Agente Moderador y Closer de {business_name}. Tu misión es guiar al usuario a través del embudo AIDA, resolver dudas usando la base de conocimiento RAG, reducir la fricción identificando su "Struggling Moment" (JTBD) y calificar el lead verificando los 4 requisitos para la regla BILLABLE_LEAD.
</identity>

<brand_dna_context>
- Propósito de Marca: {brand_purpose}
- Tono de Voz Oficial: {tone_of_voice}
- Política de Emojis: {emoji_policy}
- Llamado a la Acción (CTA): {closing_cta}
</brand_dna_context>

<knowledge_rag_context>
{rag_retrieved_passages}
</knowledge_rag_context>

<framework_rules>
1. CÍRCULO DORADO & TONO: Responde siempre alineado al propósito: "{brand_purpose}" y al tono de voz: "{tone_of_voice}".
2. JTBD & ECUACIÓN DE VALOR: Si el usuario pregunta solo el precio, NO des la cifra de inmediato. Primero valida su punto de dolor (Struggling Moment) y comunica el beneficio principal (Dream Outcome) para maximizar el valor percibido.
3. VERIFICACIÓN DE LOS 4 REQUISITOS (BILLABLE_LEAD):
   - Requisito 1: Nombre y Teléfono/WhatsApp (obtenidos del metadata).
   - Requisito 2: Producto o servicio específico identificado.
   - Requisito 3: Dudas de precios o condiciones resueltas desde RAG.
   - Requisito 4: Aceptación explícita para ser contactado por un ejecutivo o agendar cita.
4. CIERRE CON CALL TO ACTION (CTA): Toda interacción informativa debe concluir con el CTA oficial del negocio: "{closing_cta}".
</framework_rules>

<output_schema>
{
  "message_response": "Texto empático y estructurado para el usuario",
  "lead_qualification_status": {
    "req_1_contact_valid": true,
    "req_2_product_identified": true,
    "req_3_doubts_resolved": true,
    "req_4_cta_accepted": false
  },
  "current_lead_temperature": "WARM_FINANCING",
  "is_billable_lead": false
}
</output_schema>
</system_prompt>`,
    outputJsonSchema: {
      message_response: "string",
      lead_qualification_status: {
        req_1_contact_valid: true,
        req_2_product_identified: true,
        req_3_doubts_resolved: true,
        req_4_cta_accepted: false
      },
      current_lead_temperature: "WARM_FINANCING",
      is_billable_lead: false
    }
  },
  reengagement: {
    id: 'reengagement',
    key: 'reengagement',
    name: 'Sub-Bot Re-Engagement 24 Horas & Creador',
    codeName: 'Re-Engagement 24h',
    engine: 'DeepSeek R1 / V3',
    role: 'Re-activación de Leads Out-of-Market (Regla 95/5)',
    badge: 'VACA PÚRPURA',
    badgeVariant: 'purple',
    model: 'DeepSeek V3 / Groq Llama 3',
    latency: '450ms',
    triggerType: 'CRON_REDIS_24H',
    triggerLabel: '⏱️ Upstash Redis Queue (A las 24h exactas)',
    framework: 'Regla 95/5 (Ehrenberg-Bass) / Vaca Púrpura (Seth Godin)',
    efficiencyStrategy: 'Batching nocturno / Llama 3 en Groq a costo $0 USD',
    systemPromptXml: `<system_prompt>
<identity>
Eres el Sub-Agente Creador y Especialista en Re-activación de Leads de {business_name}. Tu función es re-enganchar a los prospectos del 95% (Out-of-Market) que quedaron en estado FOLLOWUP_PENDING_24H tras pausar la conversación o responder "Lo voy a pensar".
</identity>

<brand_dna_context>
- Entidad: {business_name}
- Propósito de Marca: {brand_purpose}
- Tono de Voz Oficial: {tone_of_voice}
- Política de Emojis: {emoji_policy}
</brand_dna_context>

<input_data>
- USER_NAME: {user_name}
- PRODUCT_INTEREST: {product_interest}
- LAST_OBJECTION: {last_objection}
</input_data>

<execution_instructions>
1. Han transcurrido 24 horas exactas desde la última interacción sin respuesta.
2. Adopta estrictamente el tono de voz de la marca: "{tone_of_voice}" y la política de emojis: "{emoji_policy}".
3. Genera un mensaje de re-activación corto (máximo 40 palabras), amigable y NADA agresivo.
4. Aplica el concepto "Vaca Púrpura" (Seth Godin): aporta un ángulo de valor, un dato curioso o aborda la objeción previa ("{last_objection}") sin presionar la venta.
5. Cierra con un micro-CTA de respuesta simple adaptado a la oferta (ej: "¿Pudiste revisar los detalles de {product_interest} que te compartí?" o "¿Te gustaría que reservemos un espacio esta semana?").
</execution_instructions>

<output_schema>
{
  "followup_message": "string (Mensaje redactado para {user_name} sobre {product_interest}, con tono '{tone_of_voice}', < 40 palabras y micro-CTA)",
  "scheduled_time": "24h_trigger",
  "new_status": "FOLLOWUP_SENT"
}
</output_schema>
</system_prompt>`,
    outputJsonSchema: {
      followup_message: "string (max 40 palabras, tono empático, micro-CTA)",
      scheduled_time: "24h_trigger",
      new_status: "FOLLOWUP_SENT"
    }
  },
  analyst: {
    id: 'analyst',
    key: 'analyst',
    name: 'Sub-Bot Analista de Performance & Web Friction',
    codeName: 'Analista Performance',
    engine: 'Meta CAPI & GA4 Data API',
    role: 'Auditoría ROAS Real, CAC, Fricción Web & Fatiga Creativa',
    badge: 'PERFORMANCE CAPI',
    badgeVariant: 'info',
    model: 'DeepSeek V3 / Groq',
    latency: '820ms',
    triggerType: 'BATCH_SCHEDULED',
    triggerLabel: '📊 Batch Programado (Diario 8 AM & Semanal Domingo 11 PM)',
    framework: 'ROAS Real Backend / Diagnóstico de Fricción Web / Fatiga Creativa',
    efficiencyStrategy: 'Evaluación por lotes de SQL directo en Supabase sin costo de razonamiento',
    systemPromptXml: `<system_prompt>
<identity>
Eres el Sub-Agente Analista de Performance Marketing de {business_name} en Vector Comunity OS. Tu objetivo es auditar las métricas del backend (Meta Ads API, Meta CAPI, GA4 API si HAS_WEBSITE={has_website}) y generar diagnósticos automáticos sobre ROAS Real, CAC y Fatiga Creativa con estricto aislamiento de datos para el tenant {tenant_id}.
</identity>

<audit_rules>
1. ROAS REAL = (Ventas Reales Backend DB) / (Gasto Publicitario Meta Ads API).
2. FATIGA CREATIVA: Si un anuncio en video tiene Hook Rate (3s) < 20% durante 3 días consecutivos o Frecuencia > 3.5 en retargeting, marcar como FATIGA_CREATIVA.
3. FRICCIÓN WEB (Solo si HAS_WEBSITE = true):
   - IF (CPC Anuncio es Bajo AND Tráfico Web es Alto AND Click_to_WhatsApp_Rate < 3%)
   - THEN Diagnóstico = "FRICCIÓN_EN_LANDING_PAGE" (Revisar velocidad de carga o visibilidad del botón CTA).
</audit_rules>

<output_schema>
{
  "roas_real_backend": 4.25,
  "cac_real_backend": 12.50,
  "creative_fatigue_detected": true,
  "fatigued_ad_ids": ["ad_987654321"],
  "web_friction_alert": false,
  "recommended_action": "Pausar Anuncio A por alta frecuencia (3.8) y activar variante en Reel B."
}
</output_schema>
</system_prompt>`,
    outputJsonSchema: {
      roas_real_backend: 4.25,
      cac_real_backend: 12.50,
      creative_fatigue_detected: true,
      fatigued_ad_ids: ["string"],
      web_friction_alert: false,
      recommended_action: "string"
    }
  }
};

export const MARKETING_FRAMEWORKS_REGISTRY = [
  {
    id: 'golden_circle',
    title: 'Círculo Dorado (Simon Sinek)',
    concept: 'Why, How, What',
    businessGoal: 'Definir el propósito de marca antes de vender productos.',
    techImplementation: 'Inyección de brand_purpose en el System Prompt base y en la colección RAG de Supabase (tenant_knowledge).',
    badge: 'Propósito',
    color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10'
  },
  {
    id: 'purple_cow',
    title: 'Vaca Púrpura (Seth Godin)',
    concept: 'Ángulos Disruptivos',
    businessGoal: 'Romper el patrón de scroll en pauta y revivir leads dormidos.',
    techImplementation: 'Generación de variables creativas por DeepSeek V3/R1 cuando Hook Rate < 20% o re-engagement 24h.',
    badge: 'Disrupción',
    color: 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10'
  },
  {
    id: 'jtbd',
    title: 'Jobs to be Done (Clayton Christensen)',
    concept: 'Struggling Moment -> Desired Outcome',
    businessGoal: 'Transición del dolor actual al estado deseado del cliente.',
    techImplementation: 'Algoritmo de Triage en el Sub-Bot Closer que mapea la fricción y presenta el beneficio antes del precio.',
    badge: 'JTBD',
    color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10'
  },
  {
    id: 'value_equation',
    title: 'Ecuación de Valor (Alex Hormozi)',
    concept: '(Dream Outcome x Perceived Likelihood) / (Time Delay x Effort)',
    businessGoal: 'Maximizar el valor percibido del servicio para justificar tickets y citas.',
    techImplementation: 'Cero tiempo de espera (<10s), confirmación en 1 clic con Google Calendar API y envío de testimonios RAG.',
    badge: 'Valor',
    color: 'border-lime-500/40 text-lime-700 dark:text-neon bg-neon/10'
  },
  {
    id: 'rule_95_5',
    title: 'Regla 95/5 (Ehrenberg-Bass)',
    concept: '5% In-Market / 95% Out-of-Market',
    businessGoal: 'Monetizar el 5% inmediato y cultivar el 95% sin fatigar la base.',
    techImplementation: 'Lead In-Market -> Cita Directa (BILLABLE_LEAD). Lead Out-of-Market -> Secuencia Redis 24h (FOLLOWUP_PENDING_24H).',
    badge: '95/5',
    color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'aida',
    title: 'Embudo AIDA Full Funnel',
    concept: 'Atención -> Interés -> Deseo -> Acción',
    businessGoal: 'Guiar el ciclo completo desde el anuncio en Meta hasta el pago/cita.',
    techImplementation: 'Mapeo de estados del lead (COLD_DROP, FOLLOWUP_PENDING_24H, WARM_FINANCING, QUALIFIED_TRANSFER, BILLABLE_LEAD).',
    badge: 'AIDA',
    color: 'border-orange-500/40 text-orange-600 dark:text-orange-400 bg-orange-500/10'
  },
  {
    id: 'pay_per_lead',
    title: 'Pay-Per-Qualified-Lead',
    concept: '4 Criterios de Calificación Comercial',
    businessGoal: 'Cobro condicionado ($350 MXN) al cumplimiento de 4 requisitos verificados.',
    techImplementation: 'Función booleana en Spring Boot/FastAPI que valida datos, producto, dudas resueltas y aceptación explícita.',
    badge: '$350 MXN',
    color: 'border-lime-500/40 text-lime-700 dark:text-lime-400 bg-lime-500/10'
  }
];

// ============================================================================
// PANEL DE GOBERNANZA & 5 REGLAS DE NEGOCIO ESTRICTAS (ADR-001 & ADR-008)
// ============================================================================
export const GOVERNANCE_SYSTEM_RULES = [
  {
    id: 'rule_rls',
    number: 'Regla 1',
    name: 'Privacidad y Aislamiento por Negocio',
    adrRef: 'Seguridad & Privacidad',
    description: 'Privacidad absoluta entre empresas. La información, clientes y respuestas de IA de cada negocio son totalmente independientes y confidenciales.',
    status: 'OPTIMAL',
    statusLabel: '100% Protegido',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    metric: '0 cruces de información',
    icon: 'ShieldCheck',
  },
  {
    id: 'rule_hitl',
    number: 'Regla 2',
    name: 'Atención Humana en 1 Clic (HITL)',
    adrRef: 'Atención Inmediata',
    description: 'Resolución ágil de citas e inquietudes complejas. Notificación instantánea al equipo con tiempo de respuesta promedio menor a 5 minutos.',
    status: 'HEALTHY',
    statusLabel: 'SLA 1.8m Promedio',
    statusColor: 'text-neon bg-neon/10 border-neon/30',
    metric: 'Meta < 5 min (99.2% a tiempo)',
    icon: 'Clock',
  },
  {
    id: 'rule_crisis',
    number: 'Regla 3',
    name: 'Pausa de IA y Transferencia Inmediata',
    adrRef: 'Protección al Cliente',
    description: 'Ante cualquier molestia, queja o solicitud de hablar con una persona, la IA se pausa en 0ms y transfiere la conversación a un operador.',
    status: 'ACTIVE_WATCH',
    statusLabel: 'Centinela Activo',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    metric: '0 quejas sin atender',
    icon: 'AlertOctagon',
  },
  {
    id: 'rule_billable',
    number: 'Regla 4',
    name: 'Validación Estricta de Prospectos',
    adrRef: 'Calidad Comercial',
    description: 'Solo se aprueba un prospecto si cumple: teléfono verificado, servicio identificado, horario seleccionado y confirmación expresa.',
    status: 'COMPLIANT',
    statusLabel: '0 Leads Validados',
    statusColor: 'text-neon bg-neon/10 border-neon/30',
    metric: '100% Criterios Auditados (Mín $350 MXN)',
    icon: 'DollarSign',
  },
  {
    id: 'rule_reengagement',
    number: 'Regla 5',
    name: 'Re-contacto Estratégico a 24 Horas',
    adrRef: 'Estrategia Comercial',
    description: 'Los prospectos que no compran de inmediato descansan 24 horas antes de recibir un mensaje de seguimiento con valor añadido.',
    status: 'OPTIMAL',
    statusLabel: 'Seguimiento Activo',
    statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    metric: '0 prospectos en espera de ventana',
    icon: 'Flame',
  },
  {
    id: 'rule_fatigue',
    number: 'Regla 6',
    name: 'Detección de Desgaste Publicitario',
    adrRef: 'Rendimiento de Anuncios',
    description: 'Identificación automática de anuncios con baja retención o saturación de audiencia para renovar creativos a tiempo.',
    status: 'HEALTHY',
    statusLabel: 'Monitoreo Activo',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    metric: 'Campañas en Monitoreo CAPI',
    icon: 'Activity',
  },
];

export const BUSINESS_POLICY_THRESHOLDS = {
  defaultSlaHitlMinutes: 5,
  creativeFatigueFrequencyMax: 3.5,
  creativeFatigueHookRateMin: 20,
  reengagementDelayHours: 24,
  reengagementMaxWords: 40,
  agencyRevenueSharePct: 70,
  platformRevenueSharePct: 30,
  crisisKeywords: ['demanda', 'estafa', 'profeco', 'fraude', 'abogado', 'asqueroso', 'rateros', 'denuncia'],
};


