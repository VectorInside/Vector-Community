import { create } from 'zustand';
import { INITIAL_TENANTS } from '@/utils/constants';

export const useTenantStore = create((set, get) => ({
  tenants: INITIAL_TENANTS,
  activeTenantId: 'tenant-mex-001',
  isLoading: false,

  setActiveTenantId: (tenantId) => {
    set({ activeTenantId: tenantId });
    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_active_tenant_id', tenantId);
    }
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
  const getActiveTenant = useTenantStore((state) => state.getActiveTenant);
  const updateTenantHealth = useTenantStore((state) => state.updateTenantHealth);

  const activeTenant = getActiveTenant();

  return {
    tenants,
    activeTenantId,
    activeTenant,
    setActiveTenantId,
    updateTenantHealth,
  };
};
