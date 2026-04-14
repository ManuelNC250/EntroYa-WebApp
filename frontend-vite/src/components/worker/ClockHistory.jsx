import React, { useState, useEffect } from 'react';
import { workerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ClockHistory = () => {
  const auth = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) {
      fetchHistorial();
    }
  }, [auth.user]);

  const fetchHistorial = async () => {
    try {
      const data = await workerService.getFullHistory(auth.user.id);
      setHistorial(data);
    } catch (error) {
      console.error('Error fetching full history:', error);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Función para agrupar por día (opcional, pero útil)
  const agruparPorDia = () => {
    const grupos = {};
    historial.forEach(reg => {
      const fecha = new Date(reg.fechaHora).toLocaleDateString();
      if (!grupos[fecha]) grupos[fecha] = [];
      grupos[fecha].push(reg);
    });
    return grupos;
  };

  const grupos = agruparPorDia();

  return (
    <div>
      <h2 className="mb-4">Historial Completo de Fichajes</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Resumen Total</h5>
          <div className="row">
            <div className="col-md-3">
              <p className="mb-1">Total de registros:</p>
              <h3>{historial.length}</h3>
            </div>
            <div className="col-md-3">
              <p className="mb-1">Días con registros:</p>
              <h3>{Object.keys(grupos).length}</h3>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(grupos).map(([fecha, registros]) => (
        <div key={fecha} className="card mb-3">
          <div className="card-header bg-light">
            <strong>{fecha}</strong>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm">
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
                      <td>{new Date(reg.fechaHora).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge ${reg.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger'}`}>
                          {reg.tipo}
                        </span>
                      </td>
                      <td><span className="badge bg-success">Completado</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {historial.length === 0 && (
        <div className="alert alert-info text-center">
          No hay registros de fichajes disponibles.
        </div>
      )}
    </div>
  );
};

export default ClockHistory;