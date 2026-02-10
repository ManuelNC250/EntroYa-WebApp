import React, { useState, useEffect } from 'react';
import { workerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ClockHistory = () => {
  const auth = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1);
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear());

  useEffect(() => {
    if (auth.user?.id) {
      fetchHistorial();
    }
  }, [auth.user, filtroMes, filtroAno]);

  const fetchHistorial = async () => {
    try {
      const response = await workerService.getClockHistory(auth.user.id);
      // Filtrar por mes/año (en un caso real, el backend debería filtrar)
      const historialFiltrado = (response.data || [])
        .filter(item => {
          const fecha = new Date(item.fechaHora);
          return fecha.getMonth() + 1 === filtroMes &&
                 fecha.getFullYear() === filtroAno;
        })
        .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

      setHistorial(historialFiltrado);
    } catch (error) {
      console.error('Error fetching historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularHorasTrabajadas = () => {
    let totalHoras = 0;
    const registrosPorDia = {};

    // Agrupar por día
    historial.forEach(reg => {
      const fecha = new Date(reg.fechaHora).toDateString();
      if (!registrosPorDia[fecha]) {
        registrosPorDia[fecha] = [];
      }
      registrosPorDia[fecha].push(reg);
    });

    // Calcular horas por día
    Object.values(registrosPorDia).forEach(registros => {
      const entradas = registros.filter(r => r.tipo === 'ENTRADA')
        .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
      const salidas = registros.filter(r => r.tipo === 'SALIDA')
        .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

      for (let i = 0; i < Math.min(entradas.length, salidas.length); i++) {
        const horas = (new Date(salidas[i].fechaHora) - new Date(entradas[i].fechaHora)) / (1000 * 60 * 60);
        totalHoras += horas;
      }
    });

    return totalHoras.toFixed(2);
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Historial de Fichajes</h2>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filtroMes}
            onChange={(e) => setFiltroMes(parseInt(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(mes => (
              <option key={mes} value={mes}>
                {new Date(2000, mes-1, 1).toLocaleDateString('es-ES', { month: 'long' })}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="form-control"
            style={{ width: '100px' }}
            value={filtroAno}
            onChange={(e) => setFiltroAno(parseInt(e.target.value))}
            min="2023"
            max="2030"
          />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Resumen del Mes</h5>
          <div className="row">
            <div className="col-md-3">
              <p className="mb-1">Total de registros:</p>
              <h3>{historial.length}</h3>
            </div>
            <div className="col-md-3">
              <p className="mb-1">Horas trabajadas:</p>
              <h3>{calcularHorasTrabajadas()} h</h3>
            </div>
            <div className="col-md-3">
              <p className="mb-1">Días trabajados:</p>
              <h3>{new Set(historial.map(h => new Date(h.fechaHora).toDateString())).size}</h3>
            </div>
          </div>
        </div>
      </div>

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
            {historial.map((item, index) => (
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

      {historial.length === 0 && (
        <div className="alert alert-info text-center">
          No hay registros de fichajes para el periodo seleccionado.
        </div>
      )}
    </div>
  );
};

export default ClockHistory;