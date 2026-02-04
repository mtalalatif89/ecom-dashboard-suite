import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token (to be called with Clerk's getToken)
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API endpoints
export const customersApi = {
  getAll: () => api.get('/customers/customer'),
  delete: (id: string) => api.post(`/customers/customer/delete/${id}`),
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
    api.patch(`/orders/order/status/${id}`, { status }),
};

export const paymentsApi = {
  getAll: () => api.get('/payments'),
};

export default api;
