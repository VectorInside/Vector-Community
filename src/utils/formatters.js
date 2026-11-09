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
    'BILLABLE_LEAD': 'Prospecto Calificado',
    'NO_BILLABLE': 'No Facturable',
    'PENDING_QUALIFICATION': 'En Calificación',
    'HITL_INTERVENTION': 'Intervención Humana',
    'QUEUED_REDIS_24H': 'En Cola de Re-contacto (24h)',
    'TRIGGER_IMMIMENT': 'Disparo Inminente',
    'PENDING_AGENCY_APPROVAL': 'Pendiente de Aprobación',
    'PENDING_INVOICE': 'Pendiente de Facturar',
    'PENDING_INVITE': 'Invitación Pendiente',
    'ACTIVE': 'Activo',
    'SUSPENDED': 'Suspendido',
    'SYNCED_GOOGLE_CALENDAR': 'Sincronizado en Google Calendar',
    'system_generated': 'Atención Automática',
    'COLD_DROP': 'Contacto en Pausa',
    'FOLLOWUP_PENDING_24H': 'Seguimiento Pendiente (24h)',
    'WARM_FINANCING': 'En Análisis de Financiamiento',
    'QUALIFIED_TRANSFER': 'Transferido a Asesor',

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

/**
 * Diccionario de errores tipográficos comunes en dominios de correo electrónico.
 * Previene el despacho accidental de correos a servidores inexistentes o erróneos (ej. gmial.com en vez de gmail.com).
 */
export const COMMON_DOMAIN_TYPOS = {
  // Gmail typos
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmai.co': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'gmai.es': 'gmail.com',
  'gmaill.es': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmaill.con': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmaio.com': 'gmail.com',

  // Hotmail typos
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotamil.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'homail.com': 'hotmail.com',
  'hotmial.es': 'hotmail.es',
  'hotmai.es': 'hotmail.es',
  'hotmaill.es': 'hotmail.es',
  'hotnail.com': 'hotmail.com',

  // Outlook typos
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outluk.com': 'outlook.com',
  'outlock.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlok.es': 'outlook.es',
  'outllok.es': 'outlook.es',

  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'yaho.es': 'yahoo.es',
  'yahooo.es': 'yahoo.es',

  // iCloud typos
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'icloud.co': 'icloud.com',
  'iclou.com': 'icloud.com',

  // Live / MSN typos
  'liv.com': 'live.com',
  'livee.com': 'live.com',
};

/**
 * Detecta si un correo electrónico contiene un error de dedo común en su dominio.
 * Retorna un objeto con la sugerencia de corrección o null si no se detectó ningún error.
 * @param {string} email
 * @returns {{ originalEmail: string, suggestedEmail: string, wrongDomain: string, suggestedDomain: string } | null}
 */
export const getEmailDomainTypoSuggestion = (email) => {
  if (!email || typeof email !== 'string') return null;
  const clean = email.trim().toLowerCase();
  const atIndex = clean.lastIndexOf('@');
  if (atIndex === -1 || atIndex === clean.length - 1) return null;

  const domain = clean.slice(atIndex + 1);
  if (COMMON_DOMAIN_TYPOS[domain]) {
    const suggestedDomain = COMMON_DOMAIN_TYPOS[domain];
    const username = clean.slice(0, atIndex);
    return {
      originalEmail: clean,
      suggestedEmail: `${username}@${suggestedDomain}`,
      wrongDomain: domain,
      suggestedDomain,
    };
  }

  return null;
};

/**
 * Validador estricto de correo electrónico (exige usuario, @, dominio y extensión >= 2 caracteres)
 * y comprueba adicionalmente que no contenga errores de dedo en dominios populares.
 * @param {string} email
 * @returns {{ isValid: boolean, error?: string, suggestion?: string, suggestedDomain?: string }}
 */
export const validateEmailStrict = (email) => {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return { isValid: false, error: 'El correo electrónico es requerido.' };
  }

  const clean = email.trim().toLowerCase();
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(clean)) {
    return { isValid: false, error: 'Ingresa un correo electrónico válido con dominio (ej. usuario@dominio.com).' };
  }

  const typo = getEmailDomainTypoSuggestion(clean);
  if (typo) {
    return {
      isValid: false,
      typoDetected: true,
      suggestion: typo.suggestedEmail,
      suggestedDomain: typo.suggestedDomain,
      error: `¿Quisiste decir @${typo.suggestedDomain}? El dominio parece contener un error de dedo.`,
    };
  }

  return { isValid: true, normalized: clean };
};

/**
 * Validador estricto de correo electrónico (exige usuario, @, dominio y extensión >= 2 caracteres)
 * Ej: usuario@empresa.com, contacto@vectorinside.mx
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email.trim().toLowerCase())) return false;
  // También rechaza dominios con errores de dedo obvios
  return !getEmailDomainTypoSuggestion(email);
};

/**
 * Normalizador estricto de teléfono a 10 dígitos numéricos (estándar México).
 * Remueve espacios, guiones, paréntesis y el prefijo de país +52 / 52 si viene incluido.
 */
export const normalizePhone10 = (rawPhone) => {
  if (!rawPhone || typeof rawPhone !== 'string') return '';
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('52')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
};

/**
 * Verifica si un teléfono tiene exactamente 10 dígitos numéricos válidos.
 */
export const isValidPhone10 = (phone) => {
  return normalizePhone10(phone).length === 10;
};

/**
 * Formatea un número de 10 dígitos para visualización limpia: "55 1234 5678"
 */
export const formatPhoneDisplay = (rawPhone) => {
  const digits = normalizePhone10(rawPhone);
  if (!digits) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
};

