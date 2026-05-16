import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const WorkerDashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [registrosHoy, setRegistrosHoy] = useState([]);
  const [resumen, setResumen] = useState({ horasEstaSemana: '—', diasTrabajados: '—', promedioDiario: '—' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) fetchData();
  }, [auth.user]);

  const fetchData = async () => {
    try {
      const [fullHistory, resumenData] = await Promise.all([
        workerService.getFullHistory(auth.user.id),
        workerService.getWeeklySummary(auth.user.id),
      ]);
      const hoy = new Date().toDateString();
      setRegistrosHoy(fullHistory.filter(r => new Date(r.fechaHora).toDateString() === hoy));
      if (resumenData.status === 'success') {
        setResumen(resumenData);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const ultimoFichaje = registrosHoy.length > 0 ? registrosHoy[registrosHoy.length - 1] : null;

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando panel...</span>
        </div>
    );
  }

  const statCards = [
    { label: 'Horas esta semana', value: resumen.horasEstaSemana || '0h', colorClass: 'blue' },
    { label: 'Dias trabajados', value: resumen.diasTrabajados ?? 0, colorClass: 'green' },
    { label: 'Promedio diario', value: resumen.promedioDiario || '0h', colorClass: 'cyan' },
    { label: 'Fichajes hoy', value: registrosHoy.length, colorClass: 'orange' },
  ];

  return (
      <div className="fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ marginBottom: '4px' }}>Bienvenido, {auth.user?.nombre?.split(' ')[0]} 👋</h1>
            <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.9rem' }}>
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className="badge badge-soft-primary" style={{ padding: '8px 14px', fontSize: '0.75rem' }}>
          Trabajador
        </span>
        </div>

        {/* Stats */}
        <div className="row gap-cards mb-4">
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

        {/* Ultimo fichaje + accesos rapidos */}
        <div className="row gap-cards mb-4">
          <div className="col-md-5 fade-in-up">
            <div className="card h-100">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⏰</div>
                  <h5 className="card-title" style={{ margin: 0 }}>Ultimo Fichaje</h5>
                </div>
                {ultimoFichaje ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span className={`badge ${ultimoFichaje.tipo === 'ENTRADA' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                      {ultimoFichaje.tipo}
                    </span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-800)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(ultimoFichaje.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', margin: 0 }}>Fichaje con tarjeta NFC en empresa</p>
                    </div>
                ) : (
                    <div>
                      <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '4px' }}>Aun no has fichado hoy</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', margin: 0 }}>Fichaje con tarjeta NFC en empresa</p>
                    </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-7 fade-in-up">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title" style={{ marginBottom: '14px' }}>Accesos rapidos</h5>
                <div className="row" style={{ rowGap: '10px' }}>
                  {[
                    { icon: '📄', title: 'Justificantes', desc: 'Solicitar o ver estado', path: '/worker/justificantes' },
                    { icon: '💰', title: 'Mis Nominas', desc: 'Descargar PDFs', path: '/worker/nominas' },
                    { icon: '🗓️', title: 'Mis Horarios', desc: 'Ver horario activo', path: '/worker/horarios' },
                    { icon: '🕐', title: 'Historial', desc: 'Ver todos los fichajes', path: '/worker/historial' },
                  ].map(item => (
                      <div key={item.path} className="col-6">
                        <div
                            onClick={() => navigate(item.path)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 12px', borderRadius: '10px',
                              border: '1px solid var(--border)', cursor: 'pointer',
                              transition: 'all 150ms', background: '#fff',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff'; }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.8125rem', color: 'var(--gray-800)' }}>{item.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{item.desc}</div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registros hoy */}
        <div className="card fade-in-up">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📋 Registros de Hoy</span>
            <span className="badge badge-soft-primary">{registrosHoy.length} registros</span>
          </div>
          {registrosHoy.length > 0 ? (
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                  </thead>
                  <tbody>
                  {registrosHoy.map((item, index) => (
                      <tr key={index}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>
                          {new Date(item.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td>
                      <span className={`badge ${item.tipo === 'ENTRADA' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                        {item.tipo === 'ENTRADA' ? '↗ ENTRADA' : '↙ SALIDA'}
                      </span>
                        </td>
                        <td><span className="badge badge-soft-success">Completado</span></td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-400)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🕐</div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Sin fichajes hoy — el fichaje se realiza con tarjeta NFC en la empresa</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default WorkerDashboard;