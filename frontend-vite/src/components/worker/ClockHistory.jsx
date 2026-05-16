import React, { useState, useEffect } from 'react';
import { workerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/toast';

const ClockHistory = () => {
  const auth = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) fetchHistorial();
  }, [auth.user]);

  const fetchHistorial = async () => {
    try {
      const data = await workerService.getFullHistory(auth.user.id);
      setHistorial(data);
    } catch (error) {
      notify.error('Error al cargar el historial');
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const agruparPorDia = () => {
    const grupos = {};
    historial.forEach(reg => {
      const fecha = new Date(reg.fechaHora).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!grupos[fecha]) grupos[fecha] = [];
      grupos[fecha].push(reg);
    });
    return grupos;
  };

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border" role="status"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando historial...</span>
        </div>
    );
  }

  const grupos = agruparPorDia();

  return (
      <div className="fade-in-up">
        <div className="page-header">
          <h2>Historial de Fichajes</h2>
          <p>Todos tus registros de entrada y salida agrupados por dia</p>
        </div>

        {/* Resumen */}
        <div className="row gap-cards mb-4">
          <div className="col-6 col-md-3 fade-in-up">
            <div className="card stat-card blue">
              <div className="stat-number">{historial.length}</div>
              <div className="stat-label">Total registros</div>
            </div>
          </div>
          <div className="col-6 col-md-3 fade-in-up">
            <div className="card stat-card green">
              <div className="stat-number">{Object.keys(grupos).length}</div>
              <div className="stat-label">Dias con registros</div>
            </div>
          </div>
          <div className="col-6 col-md-3 fade-in-up">
            <div className="card stat-card cyan">
              <div className="stat-number">{historial.filter(r => r.tipo === 'ENTRADA').length}</div>
              <div className="stat-label">Entradas</div>
            </div>
          </div>
          <div className="col-6 col-md-3 fade-in-up">
            <div className="card stat-card orange">
              <div className="stat-number">{historial.filter(r => r.tipo === 'SALIDA').length}</div>
              <div className="stat-label">Salidas</div>
            </div>
          </div>
        </div>

        {historial.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🕐</div>
              <h5>Sin registros</h5>
              <p>No hay fichajes registrados todavia</p>
            </div>
        ) : (
            Object.entries(grupos).map(([fecha, registros]) => (
                <div key={fecha} className="card mb-3 fade-in-up">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ textTransform: 'capitalize' }}>{fecha}</span>
                    <span className="badge badge-soft-primary">{registros.length} registros</span>
                  </div>
                  <div className="card-body" style={{ padding: '0 !important' }}>
                    <table className="table" style={{ margin: 0 }}>
                      <thead>
                      <tr>
                        <th>Hora</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                      </tr>
                      </thead>
                      <tbody>
                      {registros.map((reg, idx) => (
                          <tr key={idx}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '500', fontSize: '0.9375rem' }}>
                              {new Date(reg.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                            <td>
                        <span className={`badge ${reg.tipo === 'ENTRADA' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                          {reg.tipo === 'ENTRADA' ? '↗ ENTRADA' : '↙ SALIDA'}
                        </span>
                            </td>
                            <td>
                              <span className="badge badge-soft-success">Completado</span>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            ))
        )}
      </div>
  );
};

export default ClockHistory;