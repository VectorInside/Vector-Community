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
    set({ activeTenantId: tenantId });
    if (typeof window !== 'undefined') {
      localStorage.setItem('vector_active_tenant_id', tenantId);
      localStorage.setItem('vector_active_tenant_key', tenantId);
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
