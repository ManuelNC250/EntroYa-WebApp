import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (error) {
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
      <div>
        <h1>Panel de Administracion</h1>
        <p className="text-muted">Bienvenido al panel de administracion de EntroYa</p>

        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Usuarios Totales</h5>
                <h2>{stats?.totalUsuarios || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Administradores</h5>
                <h2>{stats?.totalAdmins || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Trabajadores</h5>
                <h2>{stats?.totalTrabajadores || 0}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Acciones Rapidas</h5>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-primary" onClick={() => navigate('/admin/usuarios')}>Gestionar Usuarios</button>
                  <button className="btn btn-outline-success" onClick={() => navigate('/admin/justificantes')}>Ver Justificantes</button>
                  <button className="btn btn-outline-info" onClick={() => navigate('/admin/horarios')}>Asignar Horarios</button>
                  <button className="btn btn-outline-warning" onClick={() => navigate('/admin/nominas')}>Subir Nominas</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;