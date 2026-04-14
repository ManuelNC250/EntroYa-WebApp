import React, { useState, useEffect } from 'react';
import { horariosService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ScheduleView = () => {
  const auth = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) {
      fetchHorarios();
    }
  }, [auth.user]);

  const fetchHorarios = async () => {
    try {
      const data = await horariosService.getByUsuario(auth.user.id);
      setHorarios(data); // data ya es un array
    } catch (error) {
      console.error('Error fetching horarios:', error);
      setHorarios([]);
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

  return (
    <div>
      <h2 className="mb-4">Mis Horarios</h2>

      {horarios.length === 0 ? (
        <div className="alert alert-info">
          No tienes horarios asignados actualmente.
        </div>
      ) : (
        <div className="row">
          {horarios.filter(h => h.activo).map(horario => (
            <div key={horario.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">{horario.nombre}</h5>
                </div>
                <div className="card-body">
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <th>Entrada:</th>
                        <td>{horario.horaEntrada}</td>
                      </tr>
                      <tr>
                        <th>Salida:</th>
                        <td>{horario.horaSalida}</td>
                      </tr>
                      <tr>
                        <th>Días:</th>
                        <td>{horario.diasSemana}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Calendario Semanal</h5>
          <p className="text-muted">Próximamente: Vista de calendario interactiva</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;