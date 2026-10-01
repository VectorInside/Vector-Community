import axios from 'axios';
import { useTenantStore } from '@/hooks/useTenant';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  try {
    const { activeTenantId } = useTenantStore.getState();
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;

    if (activeTenantId) {
      config.headers['X-Tenant-ID'] = activeTenantId;
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('[API Interceptor Error]:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('vector_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
