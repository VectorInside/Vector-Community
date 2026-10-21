/**
 * Vector Inside Community OS - Registro Maestro de 12 Módulos Operativos (UX/UI v1.0)
 * Fuente de verdad unificada para navegación, control de acceso RBAC y breadcrumbs.
 * Normado en ADR-011 y SDD v4.0.
 */

export const MODULE_PILLARS = [
  {
    id: 'operacion',
    label: 'OPERACIÓN',
    adminOnly: false,
    modules: [
      {
        id: 'overview',
        label: 'Centro de mando',
        path: '/dashboard',
        aliases: ['/overview'],
        iconName: 'LayoutGrid',
        description: 'Visión ejecutiva, tareas inmediatas y pulso operativo en tiempo real.',
        badgeKey: null,
        adminOnly: false,
      },
      {
        id: 'contactability',
        label: 'Contactabilidad',
        path: '/contactability',
        aliases: ['/performance'],
        iconName: 'Crosshair',
        description: 'Embudo de conversión, tiempos de respuesta (p90, promedio) y fugas.',
        badgeKey: null,
        adminOnly: false,
      },
      {
        id: 'campaigns',
        label: 'Campañas',
        path: '/campaigns',
        aliases: [],
        iconName: 'Megaphone',
        description: 'Campañas activas, ofertas, audiencias y presupuesto asignado vs gasto.',
        badgeKey: null,
        adminOnly: false,
      },
      {
        id: 'content',
        label: 'Estudio de contenido',
        path: '/planner',
        aliases: ['/content'],
        iconName: 'CalendarDays',
        description: 'Parrilla editorial semanal, generador DeepSeek y ciclo de aprobación.',
        badgeKey: 'pendingPosts',
        adminOnly: false,
      },
      {
        id: 'inbox',
        label: 'Conversaciones',
        path: '/inbox',
        aliases: [],
        iconName: 'MessageSquare',
        description: 'Bandeja de chats, atención inmediata y calificación de prospectos.',
        badgeKey: 'pendingChats',
        adminOnly: false,
      },
      {
        id: 'crm',
        label: 'Prospectos y ventas',
        path: '/crm',
        aliases: ['/triage'],
        iconName: 'Users',
        description: 'Tablero Kanban, calificación BANT, dictamen Pre-Cita y Master Agenda.',
        badgeKey: 'hitlAlerts',
        adminOnly: false,
      },
    ],
  },
  {
    id: 'inteligencia',
    label: 'INTELIGENCIA',
    adminOnly: false,
    modules: [
      {
        id: 'results',
        label: 'Resultados',
        path: '/results',
        aliases: ['/metrics'],
        iconName: 'BarChart3',
        description: 'Conciliación Meta/Google Ads, atribución, ROAS real, CAC y ventas.',
        badgeKey: null,
        adminOnly: false,
      },
      {
        id: 'lab',
        label: 'Pruebas y aprendizaje',
        path: '/lab',
        aliases: ['/agents'],
        iconName: 'FlaskConical',
        description: 'Pruebas A/B de creativos, detección de fatiga y orquestación de agentes.',
        badgeKey: null,
        adminOnly: false,
      },
    ],
  },
  {
    id: 'administracion',
    label: 'ADMINISTRACIÓN',
    adminOnly: true,
    modules: [
      {
        id: 'profile',
        label: 'Perfil de marca',
        path: '/profile',
        aliases: [],
        iconName: 'Sparkles',
        description: 'Propuesta de valor, ADN de marca y objetivo de respuesta SLA.',
        badgeKey: null,
        adminOnly: true,
      },
      {
        id: 'connections',
        label: 'Conexiones y datos',
        path: '/connections',
        aliases: ['/config'],
        iconName: 'PlugZap',
        description: 'Salud de Meta CAPI, Google Analytics, Webhooks y Base RAG.',
        badgeKey: null,
        adminOnly: true,
      },
      {
        id: 'team',
        label: 'Equipo y control',
        path: '/team',
        aliases: ['/settings'],
        iconName: 'ShieldCheck',
        description: 'Miembros de agencia, asignación de permisos, reglas y auditoría.',
        badgeKey: null,
        adminOnly: true,
      },
    ],
  },
];

/**
 * 13 Métricas Oficiales de la Guía de Medición (Ratificadas en UX/UI)
 */
export const MEASUREMENT_GUIDE_ITEMS = [
  {
    id: 'alcance',
    title: 'Alcance',
    formula: 'Cuentas únicas que vieron al menos una impresión en el periodo.',
    source: 'Meta Ads API / Meta Insights',
    limitations: 'No son personas únicas sumables entre canales; no garantiza lectura de contenido.',
    unit: 'Cuentas',
  },
  {
    id: 'intencion_contacto',
    title: 'Intención de contacto',
    formula: 'Clics registrados en botones de llamada o enlaces directos a WhatsApp/DM.',
    source: 'Meta Webhooks / Eventos CAPI',
    limitations: 'Representa la intención inicial; no garantiza que el usuario haya enviado un mensaje.',
    unit: 'Clics / Acciones',
  },
  {
    id: 'intercambio_bidireccional',
    title: 'Intercambio bidireccional',
    formula: 'Conversaciones donde tanto el prospecto como el agente/bot tienen >= 1 mensaje.',
    source: 'Meta Webhook Conversations',
    limitations: 'Excluye mensajes no leídos o chats abandonados antes de la primera respuesta.',
    unit: 'Conversaciones',
  },
  {
    id: 'contactabilidad_ratio',
    title: 'Tasa de Contactabilidad',
    formula: '(Intercambios bidireccionales / Contactos captados válidos) * 100',
    source: 'Motor de Telemetría Vector Inside',
    limitations: 'Sensible a horarios de atención y velocidad de primera respuesta.',
    unit: 'Porcentaje (%)',
  },
  {
    id: 'tiempo_primera_respuesta',
    title: 'Tiempo de primera respuesta (Promedio y p90)',
    formula: 'Tiempo transcurrido entre el mensaje inicial del usuario y la primera respuesta humana/aprobada.',
    source: 'Timestamps de Webhook en Supabase',
    limitations: 'Afectado por fines de semana si no se configura calendario operativo de guardia.',
    unit: 'Minutos',
  },
  {
    id: 'lead_calificado',
    title: 'Prospecto Calificado (BILLABLE_LEAD)',
    formula: 'Verificación acumulativa de 4 requisitos: Identidad + Interés Producto + Dudas Resueltas + Cita/Contacto Aceptado.',
    source: 'Máquina de Estados de Triaje (ADR-008)',
    limitations: 'Requiere dictamen humano o cumplimiento booleano estricto; no califica consultas aisladas.',
    unit: 'Leads',
  },
  {
    id: 'valor_pipeline',
    title: 'Valor de Pipeline Comercial',
    formula: 'Suma del ticket estimado de prospectos en estado Calificado o Propuesta.',
    source: 'CRM Vector Inside',
    limitations: 'Es una proyección estadística estimada; no representa dinero cobrado.',
    unit: 'MXN ($)',
  },
  {
    id: 'venta_ganada',
    title: 'Venta Ganada',
    formula: 'Oportunidades cerradas con confirmación de contrato, cita pagada o servicio adquirido.',
    source: 'Ledger de Facturación / CRM',
    limitations: 'Registra el cierre comercial; la conciliación bancaria puede tener desfases de liquidación.',
    unit: 'MXN ($)',
  },
  {
    id: 'inversion_publicitaria',
    title: 'Inversión Publicitaria Total',
    formula: 'Gasto devengado en Meta Ads + Google Ads en el periodo seleccionado.',
    source: 'APIs Oficiales Meta & Google',
    limitations: 'No incluye IVA ni comisiones de agencia salvo que se declare en el tarifario.',
    unit: 'MXN ($)',
  },
  {
    id: 'roas_real',
    title: 'ROAS Real (Retorno de Inversión)',
    formula: 'Ventas Ganadas Reales / Inversión Publicitaria Total.',
    source: 'Reconciliación Financiera Vector Inside',
    limitations: 'Difiere del ROAS de Meta Ads Manager porque mide ventas reales en base de datos, no conversiones modeladas.',
    unit: 'Multiplicador (x)',
  },
  {
    id: 'cac_real',
    title: 'CAC Real (Costo de Adquisición de Cliente)',
    formula: 'Inversión Publicitaria Total / Número de Clientes Ganados.',
    source: 'Reconciliación Financiera Vector Inside',
    limitations: 'Solo calculable cuando existen ventas ganadas registradas (>0).',
    unit: 'MXN ($) por cliente',
  },
  {
    id: 'fatiga_creativa',
    title: 'Índice de Fatiga Creativa',
    formula: 'Hook Rate (3s) < 20% durante 3 días consecutivos o Frecuencia en Retargeting > 3.5.',
    source: 'Sub-Agente Analista de Performance',
    limitations: 'Alerta temprana para pausar el creativo y rotar el guión o reel.',
    unit: 'Alerta Booleana',
  },
  {
    id: 'friccion_web',
    title: 'Tasa de Fricción Web (Click-to-WhatsApp)',
    formula: '(Clics a WhatsApp en Sitio Web / Sesiones Web Totales) * 100.',
    source: 'GA4 API + Meta CAPI Web',
    limitations: 'Solo activo para tenants con sitio web configurado (has_website = true). Alerta si < 3%.',
    unit: 'Porcentaje (%)',
  },
];

/**
 * Obtiene los pilares y módulos filtrados según el rol del usuario (Admin vs Client).
 */
export const getNavigationForRole = (role) => {
  const isAdmin = role === 'admin';
  return MODULE_PILLARS.filter((pillar) => !pillar.adminOnly || isAdmin).map((pillar) => ({
    ...pillar,
    modules: pillar.modules.filter((m) => !m.adminOnly || isAdmin),
  }));
};

/**
 * Encuentra el módulo activo a partir de la ruta actual (soporta alias).
 */
export const findModuleByPath = (pathname) => {
  if (!pathname) return null;
  for (const pillar of MODULE_PILLARS) {
    for (const mod of pillar.modules) {
      if (mod.path === pathname || mod.aliases.includes(pathname)) {
        return { ...mod, pillarTitle: pillar.label };
      }
    }
  }
  return null;
};
