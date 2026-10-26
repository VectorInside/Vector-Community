import { create } from 'zustand';
import { INITIAL_TENANTS } from '@/utils/constants';

const getInitialTenantId = () => {
  if (typeof window !== 'undefined') {
    const key = localStorage.getItem('vector_active_tenant_key') || localStorage.getItem('vector_active_tenant_id');
    if (key) return key;
  }
  return 'dental';
};

export const useTenantStore = create((set, get) => ({
  tenants: INITIAL_TENANTS,
  activeTenantId: getInitialTenantId(),
  isLoading: false,

  setActiveTenantId: (tenantId) => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('vector_role');
      if (savedRole === 'client') {
        const currentSaved = localStorage.getItem('vector_active_tenant_key') || localStorage.getItem('vector_active_tenant_id');
        if (currentSaved && currentSaved !== tenantId) {
          console.warn('[RLS Multi-Tenant Guard] Bloqueo en useTenantStore: Usuario con rol Cliente está aislado y no puede conmutar el espacio de negocio.');
          return;
        }
      }
      localStorage.setItem('vector_active_tenant_id', tenantId);
      localStorage.setItem('vector_active_tenant_key', tenantId);
    }
    set({ activeTenantId: tenantId });
  },

  getActiveTenant: () => {
    const { tenants, activeTenantId } = get();
    return tenants.find((t) => t.id === activeTenantId) || tenants[0];
  },

  updateTenantHealth: (tenantId, service, status) => {
    set((state) => ({
      tenants: state.tenants.map((t) =>
        t.id === tenantId
          ? { ...t, [`${service}Health`]: status }
          : t
      ),
    }));
  },
}));

export const useTenant = () => {
  const tenants = useTenantStore((state) => state.tenants);
  const activeTenantId = useTenantStore((state) => state.activeTenantId);
  const setActiveTenantId = useTenantStore((state) => state.setActiveTenantId);
  const updateTenantHealth = useTenantStore((state) => state.updateTenantHealth);
  const activeTenant = useTenantStore((state) =>
    state.tenants.find((t) => t.id === state.activeTenantId) || state.tenants[0]
  );

  return {
    tenants,
    activeTenantId,
    activeTenant,
    setActiveTenantId,
    updateTenantHealth,
  };
};
