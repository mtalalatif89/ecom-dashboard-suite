import axios from 'axios';

// Backend API URL
const API_BASE_URL = 'http://localhost:3000';

// Token getter function type - will be injected from React component
type TokenGetter = () => Promise<string | null>;
let getTokenFn: TokenGetter | null = null;

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject auth function - called from ProtectedRoute to bridge Clerk's useAuth
export const injectAuth = (getToken: TokenGetter) => {
  getTokenFn = getToken;
};

// Legacy function for backward compatibility
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor - automatically injects JWT token before every request
api.interceptors.request.use(
  async (config) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - unwraps { success: true, data: [...] } format
api.interceptors.response.use(
  (response) => {
    // If response has the { success, data } wrapper, unwrap it
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to ensure array data
const ensureArray = <T>(data: T | T[] | null | undefined): T[] => {
  if (Array.isArray(data)) return data;
  return [];
};

// Protected API endpoints - requires Clerk authentication
export const customersApi = {
  getAll: () => api.get('/customers/customer').then(res => ensureArray(res.data)),
  delete: (id: string) => api.post(`/customers/customer/delete/${id}`),
};

export const inventoryApi = {
  getAll: () => api.get('/inventory').then(res => ensureArray(res.data)),
  upload: (formData: FormData) => 
    api.post('/inventory/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: any) => api.patch(`/inventory/${id}`, data),
};

export const ordersApi = {
  getAll: () => api.get('/orders').then(res => ensureArray(res.data)),
  updateStatus: (id: string, status: string) => 
    api.post(`/orders/order/status/${id}`, { status }),
};

export const paymentsApi = {
  getAll: () => api.get('/payments').then(res => ensureArray(res.data)),
};

export const userApi = {
  get: () => api.get('/user'),
};

export default api;
