/**
 * Cuentas oficiales de acceso y credenciales maestras por negocio (1 Dueño por Negocio)
 * Modelo 1:1 estricto (1 Tenant = 1 Cuenta Maestra de Cliente)
 * Preparado para mapeo relacional directo en Backend (tabla: tenant_credentials / tenant_owner)
 */
export const INITIAL_BUSINESS_ACCOUNTS = [];

/**
 * Equipo Interno de la Agencia (Staff Operativo & Colaboradores)
 * Roles simplificados: SUPER_ADMIN (Global) y ADMIN (Negocios Asignados)
 */
export const INITIAL_AGENCY_STAFF = [
  {
    id: 'usr-admin-01',
    name: 'Edgar Lobo Vectorial (Tú)',
    email: 'Edgaradmin@vectorinside.com',
    role: 'SUPER_ADMIN',
    roleLabel: 'Super Admin',
    avatar: '⚡',
    status: 'ACTIVE',
    assignedTenants: 'all',
    lastLogin: 'Sesión activa',
    phone: '',
    createdAt: '2026-01-15T10:00:00Z',
    twoFactorEnabled: true,
  },
];

/**
 * Registro de Auditoría de Sesiones y Seguridad (Audit Trail)
 */
export const INITIAL_AUDIT_LOGS = [];

