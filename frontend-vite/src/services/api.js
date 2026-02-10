import axios from 'axios';

// Usar proxy de Vite
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para DEBUG
api.interceptors.request.use(
  (config) => {
    console.log(`➡️ ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para DEBUG
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// ✅ Exportar TODOS los servicios que necesitamos
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  checkUsers: () => api.get('/auth/check-users'),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/usuarios'),
  getUser: (id) => api.get(`/admin/usuarios/${id}`),
};

export const workerService = {
  getClockHistory: (userId) => api.get(`/trabajador/historial/${userId}`),
  getWeeklySummary: (userId) => api.get(`/trabajador/resumen/${userId}`),
};

export const justificantesService = {
  solicitar: (data) => api.post('/justificantes/solicitar', data),
  getByUsuario: (usuarioId) => api.get(`/justificantes/usuario/${usuarioId}`),
  getPendientes: () => api.get('/justificantes/admin/pendientes'),
  aprobarRechazar: (id, data) => api.put(`/justificantes/admin/${id}`, data),
};

export const horariosService = {
  asignar: (data) => api.post('/horarios/asignar', data),
  getByUsuario: (usuarioId) => api.get(`/horarios/usuario/${usuarioId}`),
  getAll: () => api.get('/horarios/admin'),
};

export const nominasService = {
  subir: (data) => api.post('/nominas/subir', data),
  getByUsuario: (usuarioId) => api.get(`/nominas/usuario/${usuarioId}`),
  eliminar: (id) => api.delete(`/nominas/${id}`),
};

export const nfcService = {
  fichaje: (cardUid) => api.post('/nfc/fichaje', { cardUid }),
  asignar: (data) => api.post('/nfc/asignar', data),
  getAll: () => api.get('/nfc/admin'),
};