import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('📤 Enviando login...', { email, password });

    const result = await login(email, password);

    console.log('📥 Respuesta del login:', result);

    if (result.success) {
      console.log('✅ Login exitoso, redirigiendo...', result.user);

      // Redirigir según rol
      if (result.user.rol === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (result.user.rol === 'TRABAJADOR') {
        navigate('/worker/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message || 'Error en el login');
    }
  };

  // Usuario de prueba
  const useTestCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@entroya.com');
      setPassword('1234');
    } else {
      setEmail('plica@gmail.com');
      setPassword('plica25');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-4">
          <h2>EntroYa</h2>
          <p className="text-muted">Sistema de Gestión de Fichaje</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-muted mb-2">Credenciales de prueba:</p>
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => useTestCredentials('admin')}
            >
              Usuario Admin
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => useTestCredentials('worker')}
            >
              Usuario Trabajador
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <small className="text-muted">
            ¿Problemas? Abre la consola (F12) y mira los mensajes
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;