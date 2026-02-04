import axios from 'axios';

// TODO: Replace with your backend URL
const API_BASE_URL = 'YOUR_BACKEND_URL_HERE';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token (called from ProtectedRoute with Clerk's getToken)
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Protected API endpoints - requires Clerk authentication
export const customersApi = {
  getAll: () => api.get('/customer'),
  delete: (id: string) => api.post(`/customer/delete/${id}`),
};

export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  upload: (formData: FormData) => 
    api.post('/inventory/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: any) => api.patch(`/inventory/${id}`, data),
};

export const ordersApi = {
  getAll: () => api.get('/orders'),
  updateStatus: (id: string, status: string) => 
    api.patch(`/orders/status/${id}`, { status }),
};

export const paymentsApi = {
  getAll: () => api.get('/payments'),
};

export const userApi = {
  get: () => api.get('/user'),
};

export default api;
