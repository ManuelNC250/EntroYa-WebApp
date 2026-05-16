import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboard();
      if (data.status === 'success') {
        setStats(data);
      } else {
        setError(data.message || 'Error al cargar');
      }
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando panel...</span>
        </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;

  const statCards = [
    { label: 'Usuarios totales', value: stats?.totalUsuarios ?? 0, colorClass: 'blue' },
    { label: 'Trabajadores', value: stats?.totalTrabajadores ?? 0, colorClass: 'green' },
    { label: 'Fichajes hoy', value: stats?.fichajesHoy ?? 0, colorClass: 'cyan' },
    { label: 'Justificantes pendientes', value: stats?.justificantesPendientes ?? 0, colorClass: 'orange' },
  ];

  return (
      <div className="fade-in-up">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ marginBottom: '4px' }}>Panel de Administracion</h1>
          <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.9rem' }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="row gap-cards mb-5">
          {statCards.map((s, i) => (
              <div key={i} className="col-6 col-md-3 fade-in-up">
                <div
                    className={'card stat-card ' + s.colorClass}
                    style={{ padding: '20px', borderRadius: '14px', border: 'none' }}
                >
                  <div className="stat-number">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
          ))}
        </div>

        <h4 style={{ marginBottom: '16px', color: 'var(--gray-700)', fontSize: '1rem', fontWeight: '600' }}>
          Gestion rapida
        </h4>
        <div className="row gap-cards">
          {[
            { icon: '👥', title: 'Usuarios', desc: 'Crear, editar y eliminar', path: '/admin/usuarios' },
            { icon: '📋', title: 'Justificantes', desc: stats?.justificantesPendientes > 0 ? stats.justificantesPendientes + ' pendientes' : 'Revisar y aprobar', path: '/admin/justificantes' },
            { icon: '🗓️', title: 'Horarios', desc: 'Asignar turnos', path: '/admin/horarios' },
            { icon: '💰', title: 'Nominas', desc: 'Subir PDFs', path: '/admin/nominas' },
          ].map((item, i) => (
              <div key={i} className="col-6 col-md-3 fade-in-up">
                <div className="quick-action-card" onClick={() => navigate(item.path)}>
                  <div className="qa-icon">{item.icon}</div>
                  <div className="qa-title">{item.title}</div>
                  <p className="qa-desc">{item.desc}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default AdminDashboard;