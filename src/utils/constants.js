export const USER_ROLES = {
  SUPER_ADMIN_AGENCY: 'SUPER_ADMIN_AGENCY',
  COMMUNITY_MANAGER: 'COMMUNITY_MANAGER',
  CLIENT_READ_ONLY: 'CLIENT_READ_ONLY',
};

export const VERTICAL_TYPES = {
  HOSPITALITY: 'hospitality',
  SERVICE_APPOINTMENTS: 'service_appointments',
  ECOMMERCE: 'ecommerce',
};

export const ALERT_STATUSES = {
  PENDING_AGENCY_APPROVAL: 'PENDING_AGENCY_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  AUTO_RESOLVED: 'AUTO_RESOLVED',
};

export const INITIAL_TENANTS = [
  {
    id: 'tenant-mex-001',
    name: 'Polanco Steakhouse & Mixology',
    shortName: 'Polanco Steakhouse',
    vertical: 'hospitality',
    verticalLabel: 'Gastronomía / Restaurantes',
    avatar: '🥩',
    status: 'ACTIVE',
    phone: '+52 55 4892 1039',
    monthlyRoas: '4.82x',
    activeSubBots: 3,
    metaHealth: 'HEALTHY',
    whatsappHealth: 'HEALTHY',
    calendarHealth: 'HEALTHY',
  },
  {
    id: 'tenant-med-002',
    name: 'Clínica Dental OdontoVanguardia',
    shortName: 'OdontoVanguardia',
    vertical: 'service_appointments',
    verticalLabel: 'Clínicas & Servicios Médicos',
    avatar: '🦷',
    status: 'ACTIVE',
    phone: '+52 55 9182 4432',
    monthlyRoas: '6.15x',
    activeSubBots: 2,
    metaHealth: 'HEALTHY',
    whatsappHealth: 'HEALTHY',
    calendarHealth: 'HEALTHY',
  },
  {
    id: 'tenant-eco-003',
    name: 'Kromatik Luxury Streetwear',
    shortName: 'Kromatik Store',
    vertical: 'ecommerce',
    verticalLabel: 'E-Commerce & Moda',
    avatar: '👟',
    status: 'ACTIVE',
    phone: '+52 55 1204 9901',
    monthlyRoas: '3.94x',
    activeSubBots: 4,
    metaHealth: 'HEALTHY',
    whatsappHealth: 'WARNING',
    calendarHealth: 'DISCONNECTED',
  },
  {
    id: 'tenant-fit-004',
    name: 'Nexus High Performance Hub',
    shortName: 'Nexus Gym',
    vertical: 'service_appointments',
    verticalLabel: 'Fitness & Alto Rendimiento',
    avatar: '⚡',
    status: 'ACTIVE',
    phone: '+52 55 6781 2309',
    monthlyRoas: '5.20x',
    activeSubBots: 2,
    metaHealth: 'HEALTHY',
    whatsappHealth: 'HEALTHY',
    calendarHealth: 'HEALTHY',
  }
];

export const DEMO_USERS = [
  {
    id: 'usr-admin-01',
    email: 'admin@vectorinside.com',
    name: 'Carlos Mendoza',
    role: USER_ROLES.SUPER_ADMIN_AGENCY,
    roleTitle: 'Vector Inside - Lead Operator',
    badge: 'SUPER ADMIN',
    tenantId: null, // can access all
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-cm-02',
    email: 'cm@vectorinside.com',
    name: 'Sofia Valdés',
    role: USER_ROLES.COMMUNITY_MANAGER,
    roleTitle: 'Agencia Community Manager',
    badge: 'AGENCY CM',
    tenantId: null, // agency user
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-client-03',
    email: 'contacto@polancosteak.com',
    name: 'Rodrigo Garza',
    role: USER_ROLES.CLIENT_READ_ONLY,
    roleTitle: 'Dueño de Negocio (Polanco Steakhouse)',
    badge: 'CLIENT READ ONLY',
    tenantId: 'tenant-mex-001', // locked to this tenant
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];
