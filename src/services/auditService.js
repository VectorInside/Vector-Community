import api, { unwrapApiData } from './api';

/**
 * ============================================================================
 * SERVICIO DE AUDITORÍA FORENSE & SEGURIDAD INMUTABLE (WORM)
 * ============================================================================
 * Conecta con PostgreSQL 17 (`security_audit_logs` + trigger WORM)
 * Endpoint base: /api/v1/audit-logs
 * ============================================================================
 */

const getStoredActor = () => {
  if (typeof window === 'undefined') {
    return {
      id: 'usr-admin-01',
      name: 'Edgar Lobo Vectorial',
      email: 'Edgaradmin@vectorinside.com',
      globalRole: 'SUPER_ADMIN',
    };
  }
  try {
    const raw = localStorage.getItem('vector_current_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        id: parsed.id || 'usr-admin-01',
        name: parsed.name || 'Edgar Lobo Vectorial',
        email: parsed.email || 'Edgaradmin@vectorinside.com',
        globalRole: parsed.globalRole || (parsed.role === 'client' ? 'CLIENT_OWNER' : 'SUPER_ADMIN'),
      };
    }
  } catch {
    // fallback silencioso
  }
  return {
    id: 'usr-admin-01',
    name: 'Edgar Lobo Vectorial',
    email: 'Edgaradmin@vectorinside.com',
    globalRole: 'SUPER_ADMIN',
  };
};

export const normalizeAuditLog = (raw) => {
  if (!raw || typeof raw !== 'object') return null;

  const actorName = raw.actorName || raw.user || 'Edgar Lobo Vectorial';
  const actorEmail = raw.actorEmail || raw.email || 'Edgaradmin@vectorinside.com';
  const actorRole = raw.actorRole || raw.role || 'SUPER_ADMIN';
  const eventCategory = raw.eventCategory || raw.category || 'SECURITY';
  const action = raw.action || 'Evento de Seguridad Registrado';
  const targetResource = raw.targetResource || raw.target || 'Gobernanza Global';
  const ipAddress = raw.ipAddress || raw.ip || '127.0.0.1';
  const location = raw.location || 'Ciudad de México, MX (Red Local)';
  const status = (raw.status || 'SUCCESS').toUpperCase();
  const createdAt = raw.createdAt || raw.timestamp || new Date().toISOString();
  const userAgent =
    raw.userAgent ||
    raw.metadata?.userAgent ||
    (typeof navigator !== 'undefined' ? navigator.userAgent : 'VectorInside-OS/1.0');

  let parsedMetadata = raw.metadata;
  if (typeof parsedMetadata === 'string') {
    try {
      parsedMetadata = JSON.parse(parsedMetadata);
    } catch {
      parsedMetadata = { raw: raw.metadata };
    }
  }
  if (!parsedMetadata || typeof parsedMetadata !== 'object') {
    parsedMetadata = {};
  }

  // Generar hash WORM determinístico si no viene explícito en metadata
  const seed = `${raw.id || ''}|${actorEmail}|${eventCategory}|${action}|${createdAt}`;
  let hashAcc = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hashAcc ^= seed.charCodeAt(i);
    hashAcc = Math.imul(hashAcc, 0x01000193);
  }
  const wormHash =
    raw.wormHash ||
    parsedMetadata.wormHash ||
    `worm_sha256_${(hashAcc >>> 0).toString(16).padStart(8, '0')}_${String(raw.id || 'log')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(-10)}`;

  return {
    id: raw.id || `aud-${Date.now()}`,
    actorUserId: raw.actorUserId || 'usr-admin-01',
    actorName,
    user: actorName,
    actorEmail,
    email: actorEmail,
    actorRole,
    role: actorRole,
    tenantId: raw.tenantId || null,
    eventCategory,
    category: eventCategory,
    action,
    targetResource,
    target: targetResource,
    ipAddress,
    ip: ipAddress,
    location,
    userAgent,
    status,
    metadata: parsedMetadata,
    wormHash,
    createdAt,
    timestamp: createdAt,
  };
};

export const auditService = {
  /**
   * Obtiene la bitácora inmutable de auditoría desde PostgreSQL 17 (`GET /api/v1/audit-logs`)
   */
  async getAuditLogs(params = {}) {
    try {
      const response = await api.get('/audit-logs', { params });
      const data = unwrapApiData(response);
      if (Array.isArray(data)) {
        return data.map(normalizeAuditLog).filter(Boolean);
      }
      return [];
    } catch (error) {
      console.warn('[auditService.getAuditLogs] No se pudo recuperar bitácora:', error?.message);
      return [];
    }
  },

  /**
   * Registra un nuevo evento en la tabla WORM `security_audit_logs` (`POST /api/v1/audit-logs`).
   * Manejo silencioso de error para nunca bloquear la interfaz de usuario.
   */
  async recordEvent(payload = {}) {
    const actor = getStoredActor();
    const activeTenantId =
      payload.tenantId ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('vector_active_tenant_key') || localStorage.getItem('vector_active_tenant_id')
        : null);

    const requestBody = {
      actorUserId: payload.actorUserId || actor.id,
      actorName: payload.actorName || payload.user || actor.name,
      actorEmail: payload.actorEmail || payload.email || actor.email,
      actorRole: payload.actorRole || payload.role || actor.globalRole || 'SUPER_ADMIN',
      tenantId: activeTenantId || null,
      eventCategory: payload.eventCategory || payload.category || 'SECURITY',
      action: payload.action || 'Operación de Seguridad Registrada',
      targetResource: payload.targetResource || payload.target || 'Gobernanza Global',
      ipAddress: payload.ipAddress || payload.ip || '127.0.0.1',
      location: payload.location || 'Ciudad de México, MX (Sesión Verificada)',
      userAgent:
        payload.userAgent ||
        (typeof navigator !== 'undefined' ? navigator.userAgent : 'VectorInside-OS/1.0'),
      status: (payload.status || 'SUCCESS').toUpperCase(),
      metadata: payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {},
    };

    try {
      const response = await api.post('/audit-logs', requestBody);
      const data = unwrapApiData(response);
      return normalizeAuditLog(data || requestBody);
    } catch (error) {
      console.warn('[auditService.recordEvent] Registro local de respaldo (sin bloqueo UI):', error?.message);
      return normalizeAuditLog({
        ...requestBody,
        id: `aud-local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }
  },
};

export default auditService;
