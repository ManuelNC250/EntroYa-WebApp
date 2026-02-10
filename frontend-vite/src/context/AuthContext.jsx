import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('🔐 Intentando login con:', { email, password });

      const response = await api.post('/auth/login', { email, password });

      console.log('📨 Respuesta del backend:', response.data);

      if (response.data.status === 'success') {
        const userData = response.data.usuario;

        console.log('👤 Usuario obtenido:', userData);

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return {
          success: true,
          user: userData,
          message: 'Login exitoso'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error en el login'
        };
      }
    } catch (error) {
      console.error('💥 Error completo:', error);
      console.error('💥 Error response:', error.response);
      console.error('💥 Error message:', error.message);

      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error de conexión con el servidor'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'ADMIN',
    isWorker: user?.rol === 'TRABAJADOR'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};