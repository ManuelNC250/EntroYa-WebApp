import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const WorkerDashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [registrosHoy, setRegistrosHoy] = useState([]);
  const [resumen, setResumen] = useState({ horasEstaSemana: '0h', diasTrabajados: 0, promedioDiario: '0h' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) {
      fetchData();
    }
  }, [auth.user]);

  const fetchData = async () => {
    try {
      const fullHistory = await workerService.getFullHistory(auth.user.id);
      const resumenData = await workerService.getWeeklySummary(auth.user.id);

      // Filtrar registros de hoy
      const hoy = new Date().toDateString();
      const registrosDelDia = fullHistory.filter(reg =>
        new Date(reg.fechaHora).toDateString() === hoy
      );

      setRegistrosHoy(registrosDelDia);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ultimoFichaje = registrosHoy.length > 0 ? registrosHoy[registrosHoy.length - 1] : null;

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

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
              <h2 className="text-primary">{resumen.horasEstaSemana || '0h'}</h2>
              <p className="mb-1">Días trabajados: {resumen.diasTrabajados || 0}</p>
              <p className="mb-1">Promedio diario: {resumen.promedioDiario || '0h'}</p>
              <button
                className="btn btn-outline-primary mt-2"
                onClick={() => navigate('/worker/historial')}
              >
                Ver detalles completos
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">⏰ Último Fichaje</h5>
              {ultimoFichaje ? (
                <>
                  <p className="card-text">
                    {ultimoFichaje.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}:
                    <strong> {new Date(ultimoFichaje.fechaHora).toLocaleTimeString()}</strong>
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
              <button
                className="btn btn-outline-success"
                onClick={() => navigate('/worker/justificantes')}
              >
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
              <button
                className="btn btn-outline-info"
                onClick={() => navigate('/worker/nominas')}
              >
                Ver nóminas disponibles
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">📋 Registros de Hoy</h5>
          {registrosHoy.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
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
            <p className="text-muted">No hay registros de fichajes hoy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;