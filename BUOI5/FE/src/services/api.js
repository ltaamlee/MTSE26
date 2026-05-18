import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

export const productAPI = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  getFeatured: () => api.get('/api/products/featured'),
  getNewest: () => api.get('/api/products/newest'),
  getBestSeller: () => api.get('/api/products/best-seller'),
  getByCategory: (categoryId) => api.get(`/api/products/category/${categoryId}`),
  getRelated: (id, categoryId) => api.get(`/api/products/${id}/related/${categoryId}`),
  search: (query) => api.get('/api/products/search', { params: { q: query } }),
  getInfinite: (params) => api.get('/api/products/infinite', { params }),
  getTop: (params) => api.get('/api/products/top', { params }),
};

// Admin APIs
export const adminProductAPI = {
  getAll: (params) => api.get('/api/admin/products', { params }),
  getStats: () => api.get('/api/admin/products/stats'),
  create: (data) => api.post('/api/admin/products', data),
  update: (id, data) => api.put(`/api/admin/products/${id}`, data),
  delete: (id) => api.delete(`/api/admin/products/${id}`),
  toggle: (id) => api.patch(`/api/admin/products/${id}/toggle`),
};

export const adminCategoryAPI = {
  getAll: (params) => api.get('/api/admin/categories', { params }),
  getStats: () => api.get('/api/admin/categories/stats'),
  create: (data) => api.post('/api/admin/categories', data),
  update: (id, data) => api.put(`/api/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/api/admin/categories/${id}`),
  toggle: (id) => api.patch(`/api/admin/categories/${id}/toggle`),
};

export const categoryAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addToCart: (data) => api.post('/api/cart/add', data),
  updateCart: (data) => api.put('/api/cart/update', data),
  removeFromCart: (productId) => api.delete(`/api/cart/remove/${productId}`),
  clearCart: () => api.delete('/api/cart/clear'),
};

export const orderAPI = {
  create: (data) => api.post('/api/orders', data),
  getMyOrders: () => api.get('/api/orders/my-orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
};

export default api;
