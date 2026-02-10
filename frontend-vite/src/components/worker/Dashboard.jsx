import React, { useState, useEffect } from 'react';
import { workerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const WorkerDashboard = () => {
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
      const response = await workerService.getClockHistory(auth.user.id);
      setHistorial(response.data || []);
    } catch (error) {
      console.error('Error fetching historial:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Mi Panel de Trabajador</h1>
          <p className="text-muted">Bienvenido, <strong>{auth.user?.nombre}</strong></p>
        </div>
        <div className="badge bg-primary fs-6 p-2">
          {auth.user?.rol === 'TRABAJADOR' ? 'Trabajador' : 'Administrador'}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">📊 Resumen Semanal</h5>
              <p className="card-text">Horas trabajadas esta semana:</p>
              <h2 className="text-primary">40 horas</h2>
              <button className="btn btn-outline-primary mt-2">
                Ver detalles completos
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">⏰ Último Fichaje</h5>
              {historial.length > 0 ? (
                <>
                  <p className="card-text">
                    {historial[0].tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}:
                    <strong> {new Date(historial[0].fechaHora).toLocaleString()}</strong>
                  </p>
                  <button className="btn btn-outline-secondary" disabled>
                    Fichar (Solo con NFC en empresa)
                  </button>
                </>
              ) : (
                <>
                  <p className="card-text">Aún no has fichado hoy</p>
                  <button className="btn btn-secondary" disabled>
                    Fichar (Solo con NFC en empresa)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">📄 Mis Justificantes</h5>
              <p className="card-text">Gestiona tus justificantes de ausencia</p>
              <button className="btn btn-outline-success">
                Solicitar justificante
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">💰 Mis Nóminas</h5>
              <p className="card-text">Consulta y descarga tus nóminas</p>
              <button className="btn btn-outline-info">
                Ver nóminas disponibles
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">📋 Historial Reciente</h5>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border spinner-border-sm"></div>
              <p>Cargando historial...</p>
            </div>
          ) : historial.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.fechaHora).toLocaleDateString()}</td>
                      <td>{new Date(item.fechaHora).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge ${
                          item.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {item.tipo}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">Completado</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No hay registros de fichajes disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;