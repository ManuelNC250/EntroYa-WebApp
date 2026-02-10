import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4>Error</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      <p className="text-muted">Bienvenido al panel de administración de EntroYa</p>

      {stats && (
        <div className="row mt-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Usuarios</h5>
                <h2 className="card-text">{stats.totalUsuarios || 0}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Fichajes Hoy</h5>
                <h2 className="card-text">{stats.fichajesHoy || 0}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Justificantes Pendientes</h5>
                <h2 className="card-text">{stats.justificantesPendientes || 0}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Tarjetas NFC</h5>
                <h2 className="card-text">{stats.tarjetasNFC || 0}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Acciones Rápidas</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">Gestionar Usuarios</button>
                <button className="btn btn-outline-success">Ver Justificantes</button>
                <button className="btn btn-outline-info">Asignar Horarios</button>
                <button className="btn btn-outline-warning">Subir Nóminas</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Información del Sistema</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Backend URL:</span>
                  <code>http://localhost:8080</code>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Frontend URL:</span>
                  <code>http://localhost:3000</code>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Estado:</span>
                  <span className="badge bg-success">Activo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;