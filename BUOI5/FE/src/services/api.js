import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/v1/api`,
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
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  getProfile: () => api.get('/account'),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getNewest: () => api.get('/products/newest'),
  getBestSeller: () => api.get('/products/best-seller'),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getRelated: (id, categoryId) => api.get(`/products/${id}/related/${categoryId}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getInfinite: (params) => api.get('/products/infinite', { params }),
  getTop: (params) => api.get('/products/top', { params }),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCart: (data) => api.put('/cart/update', data),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  getStats: () => api.get('/orders/stats'),
};

export const adminProductAPI = {
  getAll: (params) => api.get('/admin/products', { params }),
  getStats: () => api.get('/admin/products/stats'),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
  toggle: (id) => api.patch(`/admin/products/${id}/toggle`),
};

export const adminCategoryAPI = {
  getAll: (params) => api.get('/admin/categories', { params }),
  getStats: () => api.get('/admin/categories/stats'),
  create: (data) => api.post('/admin/categories', data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
  toggle: (id) => api.patch(`/admin/categories/${id}/toggle`),
};

export default api;
