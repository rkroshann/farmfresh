import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const storage = localStorage.getItem('farmfresh-storage');
    if (storage) {
      const { state } = JSON.parse(storage);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('farmfresh-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`),
  getByFarmer: (farmerId) => api.get(`/products/farmer/${farmerId}`)
};

// Chat APIs
export const chatAPI = {
  create: (data) => api.post('/chats', data),
  getAll: () => api.get('/chats'),
  getById: (id) => api.get(`/chats/${id}`),
  sendMessage: (chatId, data) => api.post(`/chats/${chatId}/messages`, data),
  updateOffer: (chatId, messageId, status) => 
    api.put(`/chats/${chatId}/offers/${messageId}`, { status })
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason })
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByUser: (userId) => api.get(`/reviews/user/${userId}`),
  checkReviewed: (orderId) => api.get(`/reviews/check/${orderId}`)
};

export default api;
