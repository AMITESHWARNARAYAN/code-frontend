import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL: API_URL,
  mode: import.meta.env.MODE
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url, 'Full URL:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error
    });
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout')
};

// Question APIs
export const questionAPI = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`)
};

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserCount: () => api.get('/admin/users/count'),
  getUserInfo: (id) => api.get(`/admin/users/${id}`),
  deactivateUser: (id) => api.put(`/admin/users/${id}/deactivate`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getLeaderboard: () => api.get('/admin/leaderboard')
};

// Auction APIs
export const auctionAPI = {
  getWallet: () => api.get('/auction/wallet'),
  getMyQuestions: () => api.get('/auction/my-questions'),
  getAllotted: () => api.get('/auction/allotted'),
  submitCode: (allottedQuestionId, code) => api.post(`/auction/submit/${allottedQuestionId}`, { code }),
  getTeamStats: () => api.get('/auction/team-stats')
};

// Scheduled Auction APIs
export const scheduledAuctionAPI = {
  getAll: () => api.get('/scheduled'),
  getById: (id) => api.get(`/scheduled/${id}`),
  create: (data) => api.post('/scheduled/create', data),
  update: (id, data) => api.put(`/scheduled/${id}`, data),
  delete: (id) => api.delete(`/scheduled/${id}`),
  join: (id) => api.post(`/scheduled/${id}/join`),
  leave: (id) => api.post(`/scheduled/${id}/leave`),
  cancel: (id) => api.post(`/scheduled/${id}/cancel`),
  getAllAdmin: () => api.get('/scheduled/admin/all')
};

export default api;

