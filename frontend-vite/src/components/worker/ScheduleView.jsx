// ScheduleView.jsx — Trabajador
import React, { useState, useEffect } from 'react';
import { horariosService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/toast';

export const ScheduleView = () => {
  const auth = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) fetchHorarios();
  }, [auth.user]);

  const fetchHorarios = async () => {
    try {
      const data = await horariosService.getByUsuario(auth.user.id);
      setHorarios(data);
    } catch (error) {
      notify.error('Error al cargar horarios');
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border" role="status"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando horarios...</span>
        </div>
    );
  }

  const activos = horarios.filter(h => h.activo);
  const inactivos = horarios.filter(h => !h.activo);

  return (
      <div className="fade-in-up">
        <div className="page-header">
          <h2>Mis Horarios</h2>
          <p>Consulta tu horario laboral asignado</p>
        </div>

        {horarios.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗓️</div>
              <h5>Sin horarios asignados</h5>
              <p>El administrador aun no te ha asignado ningun horario</p>
            </div>
        ) : (
            <>
              {activos.length > 0 && (
                  <>
                    <h5 style={{ marginBottom: '16px', color: 'var(--gray-700)' }}>Horarios activos</h5>
                    <div className="row gap-cards mb-4">
                      {activos.map(horario => (
                          <div key={horario.id} className="col-md-6 fade-in-up">
                            <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
                              <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                  <h5 className="card-title" style={{ margin: 0 }}>{horario.nombre}</h5>
                                  <span className="badge badge-soft-success">Activo</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                  <div style={{ padding: '12px', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Entrada</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>{horario.horaEntrada}</div>
                                  </div>
                                  <div style={{ padding: '12px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Salida</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>{horario.horaSalida}</div>
                                  </div>
                                </div>
                                <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--gray-600)' }}>
                                  📅 {horario.diasSemana}
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </>
              )}

              {inactivos.length > 0 && (
                  <>
                    <h5 style={{ marginBottom: '16px', color: 'var(--gray-400)' }}>Horarios anteriores</h5>
                    <div className="row gap-cards">
                      {inactivos.map(horario => (
                          <div key={horario.id} className="col-md-6 fade-in-up">
                            <div className="card" style={{ opacity: 0.6 }}>
                              <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h5 className="card-title" style={{ margin: 0 }}>{horario.nombre}</h5>
                                  <span className="badge bg-secondary">Inactivo</span>
                                </div>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: '8px', marginBottom: 0 }}>
                                  {horario.horaEntrada} — {horario.horaSalida} · {horario.diasSemana}
                                </p>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </>
              )}
            </>
        )}
      </div>
  );
};

export default ScheduleView;