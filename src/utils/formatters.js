export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (val) => {
  return new Intl.NumberFormat('es-MX').format(val);
};

export const formatPercentage = (val) => {
  return `${Number(val).toFixed(1)}%`;
};

export const formatDateTime = (dateString) => {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return dateString;
  }
};

export const formatRelativeTime = (dateString) => {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return `Hace ${diffSec}s`;
    if (diffSec < 3600) return `Hace ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `Hace ${Math.floor(diffSec / 3600)} h`;
    return `Hace ${Math.floor(diffSec / 86400)} d`;
  } catch (e) {
    return dateString;
  }
};

export const cleanConcept = (val) => {
  if (!val || typeof val !== 'string') return val || '';
  const trimmed = val.trim();

  const CONCEPT_DICTIONARY = {
    // CAPI & Eventos Comerciales
    'Purchase / Table_Reserved': 'Venta / Reserva de Mesa',
    'Table_Reserved': 'Reserva de Mesa',
    'Lead_HighIntent': 'Prospecto de Alta Intención',
    'Purchase / Wine_AddOn': 'Venta / Adicional Gourmet',
    'Wine_AddOn': 'Adicional Gourmet',
    'Schedule_Confirmed': 'Cita Confirmada',
    'Schedule / Dental_Diagnosis': 'Cita / Valoración Clínica',
    'Dental_Diagnosis': 'Valoración Clínica',
    'Treatment_Accepted': 'Tratamiento Aceptado',
    'Purchase / Neon_Runner': 'Venta / Calzado Deportivo',
    'Neon_Runner': 'Calzado Deportivo',
    'Membership_Signed': 'Membresía Contratada',
    'InitiateCheckout': 'Inicio de Compra',
    'MATCHED_CAPI_98%': 'Sincronizado CAPI (98%)',
    'MATCHED_CAPI_95%': 'Sincronizado CAPI (95%)',
    'MATCHED_CAPI_99%': 'Sincronizado CAPI (99%)',
    'MATCHED_CAPI_97%': 'Sincronizado CAPI (97%)',
    'MATCHED_CAPI_96%': 'Sincronizado CAPI (96%)',
    'MATCHED_CAPI_100%': 'Sincronizado CAPI (100%)',

    // Estados de Prospecto & Triaje
    'LEAD_COLD_24H': 'Ingreso / Frío (24h)',
    'LEAD_WARM_24H': 'En Seguimiento (24h)',
    'LEAD_HOT_PREQUAL': 'Prospecto Cálido',
    'BILLABLE_LEAD': 'Lead Calificado',
    'HITL_INTERVENTION': 'Intervención Humana',
    'QUEUED_REDIS_24H': 'En Cola de Re-contacto (24h)',
    'TRIGGER_IMMIMENT': 'Disparo Inminente',
    'PENDING_AGENCY_APPROVAL': 'Pendiente de Aprobación',
    'PENDING_INVOICE': 'Facturación Pendiente',
    'PENDING_INVITE': 'Invitación Pendiente',
    'ACTIVE': 'Activo',
    'SUSPENDED': 'Suspendido',
    'SYNCED_GOOGLE_CALENDAR': 'Sincronizado en Google Calendar',

    // Herramientas & Sub-Bots
    'consultar_disponibilidad_google_calendar()': 'Consulta de Agenda en Google Calendar',
    'registrar_cita()': 'Registro de Cita en Agenda',
    'mostrar_menu_digital()': 'Visualización de Menú Digital',
    'obtener_ubicacion()': 'Envío de Ubicación y Mapa',
    'reservar_mesa()': 'Confirmación de Mesa en Salón',
    'SubAgente_Moderador_Closer': 'Sub-Agente Moderador de Cierre',

    // Verticales
    'service_appointments': 'Citas y Servicios',
    'hospitality': 'Restaurantes y Hospitalidad',
    'ecommerce': 'Comercio Electrónico',
    'b2b_sales': 'Ventas Corporativas B2B',
    'creator_economy': 'Creadores y Marca Personal',
  };

  if (CONCEPT_DICTIONARY[trimmed]) return CONCEPT_DICTIONARY[trimmed];

  // Regex para patrones MATCHED_CAPI_XX%
  if (/^MATCHED_CAPI_(\d+)%$/i.test(trimmed)) {
    const match = trimmed.match(/^MATCHED_CAPI_(\d+)%$/i);
    return `Sincronizado CAPI (${match[1]}%)`;
  }

  // Reemplazar guiones bajos por espacios y limpiar paréntesis
  const cleaned = trimmed
    .replace(/_/g, ' ')
    .replace(/\(\)/g, '')
    .trim();

  // Si estaba todo en MAYÚSCULAS tipo ENUM_CONSTANTE, pasar a Capitalización Natural
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 2) {
    return cleaned
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return cleaned;
};
