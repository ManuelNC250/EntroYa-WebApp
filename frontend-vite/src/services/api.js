import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para debugging
api.interceptors.request.use(
  (config) => {
    console.log(`➡️ ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// ==================== AUTH ====================
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Respuesta esperada: { status, usuario, message }
    return response.data; // contiene usuario, status, message
  },
  checkUsers: () => api.get('/auth/check-users'),
};

// ==================== ADMIN ====================
export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    // Se espera un objeto con estadísticas
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/usuarios');
    // Suponemos que devuelve array directamente (como en /admin/horarios)
    return response.data; // array de usuarios
  },
  getUser: async (id) => {
    const response = await api.get(`/admin/usuarios/${id}`);
    return response.data; // objeto usuario
  },
  // NUEVO: crear usuario
    crearUsuario: async (data) => {
      const response = await api.post('/admin/usuarios', data);
      return response.data;
    },
    // NUEVO: actualizar usuario
    actualizarUsuario: async (id, data) => {
      const response = await api.put(`/admin/usuarios/${id}`, data);
      return response.data;
    },
    // NUEVO: eliminar usuario
    eliminarUsuario: async (id) => {
      const response = await api.delete(`/admin/usuarios/${id}`);
      return response.data;
    },
  };

// ==================== TRABAJADOR ====================
export const workerService = {
  getClockHistory: async (usuarioId) => {
    // Este endpoint puede que ya no exista si lo eliminaste.
    // Si no lo necesitas, puedes eliminarlo o dejarlo comentado.
    // Por ahora, lo dejamos pero asegúrate de que el backend tenga el endpoint o lo comentes.
    const response = await api.get(`/trabajador/historial/${usuarioId}`);
    return response.data.registrosHoy || response.data.registros || response.data || [];
  },
  getWeeklySummary: async (usuarioId) => {
    const response = await api.get(`/trabajador/resumen/${usuarioId}`);
    return response.data;
  },
  getFullHistory: async (usuarioId) => {   // ✅ MOVIDO AQUÍ
    const response = await api.get(`/trabajador/historial/completo/${usuarioId}`);
    return response.data.registros || [];
  },
};

// ==================== JUSTIFICANTES ====================
export const justificantesService = {
  solicitar: async (formData) => {
      const response = await api.post('/justificantes/solicitar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
  // Si el backend devuelve { status, justificantes }
  getPendientes: async () => {
      const response = await api.get('/justificantes/admin/pendientes');
      return response.data.justificantes || []; // extrae el array
  },
  getByUsuario: async (usuarioId) => {
      const response = await api.get(`/justificantes/usuario/${usuarioId}`);
      return response.data.justificantes || []; // extrae el array
  },
  aprobarRechazar: async (id, data) => {
    const response = await api.put(`/justificantes/admin/${id}`, data);
    return response.data;
  },
};

// ==================== HORARIOS ====================
export const horariosService = {
  asignar: async (data) => {
    const response = await api.post('/horarios/asignar', data);
    return response.data;
  },
  getByUsuario: async (usuarioId) => {
    const response = await api.get(`/horarios/usuario/${usuarioId}`);
    // Respuesta: { status, horarios }
    return response.data.horarios || [];
  },
  getAll: async () => {
    const response = await api.get('/horarios/admin');
    // Array directo
    return response.data;
  },
  desactivar: async (id) => {
    const response = await api.put(`/horarios/${id}/desactivar`);
    return response.data;
  },
};

// ==================== NÓMINAS ====================
export const nominasService = {
  subir: async (formData) => {
    const response = await api.post('/nominas/subir', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getByUsuario: async (usuarioId) => {
    const response = await api.get(`/nominas/usuario/${usuarioId}`);
    return response.data.nominas || [];
  },
  getAll: async () => {
    const response = await api.get('/nominas/admin');
    return response.data.nominas || [];  // ahora también tiene wrapper
  },
  eliminar: async (id) => {
    const response = await api.delete(`/nominas/eliminar/${id}`);
    return response.data;
  },
};

// ==================== NFC ====================
export const nfcService = {
  fichaje: async (cardUid) => {
    const response = await api.post('/nfc/fichaje', { cardUid });
    return response.data;
  },
  asignar: async (data) => {
    const response = await api.post('/nfc/asignar', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/nfc/admin');
    // Suponemos array directo
    return response.data;
  },
  getFullHistory: async (usuarioId) => {
      const response = await api.get(`/trabajador/historial/completo/${usuarioId}`);
      return response.data.registros || [];
    },
};