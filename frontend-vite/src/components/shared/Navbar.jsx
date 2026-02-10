import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  if (!auth.isAuthenticated) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🏢 EntroYa
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {auth.isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/usuarios">
                    Usuarios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/justificantes">
                    Justificantes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/horarios">
                    Horarios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/nominas">
                    Nóminas
                  </Link>
                </li>
              </>
            )}
            {auth.isWorker && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/worker/dashboard">
                    Mi Panel
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/worker/historial">
                    Historial
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/worker/justificantes">
                    Justificantes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/worker/horarios">
                    Horarios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/worker/nominas">
                    Nóminas
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="navbar-nav">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                👤 {auth.user?.nombre || 'Usuario'}
                <small className="ms-2 badge bg-light text-dark">
                  {auth.user?.rol}
                </small>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;