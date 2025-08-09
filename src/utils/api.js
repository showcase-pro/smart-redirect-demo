import axios from 'axios';

// Use environment variable or fallback to default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Links API
export const linksAPI = {
  getAll: () => api.get('/links'),
  create: (data) => api.post('/links', data),
  update: (id, data) => api.put(`/links/${id}`, data),
  delete: (id) => api.delete(`/links/${id}`),
  getRules: (linkId) => api.get(`/links/${linkId}/rules`),
  createRule: (linkId, data) => api.post(`/links/${linkId}/rules`, data),
  updateRule: (ruleId, data) => api.put(`/rules/${ruleId}`, data),
  deleteRule: (ruleId) => api.delete(`/rules/${ruleId}`)
};

// Analytics API
export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getClicksAnalytics: (linkId, period = '24h') => 
    api.get(`/analytics/clicks/${linkId}?period=${period}`),
  getRealTimeStats: () => api.get('/analytics/realtime')
};

// Test API
export const testAPI = {
  testRedirect: (shortCode, testData) => 
    api.post(`/test-redirect/${shortCode}`, testData)
};

// Health API
export const healthAPI = {
  check: () => api.get('/health')
};

export default api;