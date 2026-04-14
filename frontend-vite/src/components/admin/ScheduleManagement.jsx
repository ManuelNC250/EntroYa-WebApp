import React, { useState, useEffect } from 'react';
import { horariosService, adminService } from '../../services/api';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    usuarioId: '',
    nombre: '',
    horaEntrada: '09:00',
    horaSalida: '18:00',
    diasSemana: 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedulesData, usersData] = await Promise.all([
        horariosService.getAll(),   // array
        adminService.getUsers()      // array
      ]);
      setSchedules(schedulesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await horariosService.asignar(formData);
      alert('Horario asignado correctamente');
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error asignando horario:', error);
      alert('Error al asignar horario');
    }
  };

  const handleDesactivar = async (id) => {
    if (window.confirm('¿Desactivar este horario?')) {
      try {
        await horariosService.desactivar(id);
        fetchData();
      } catch (error) {
        console.error('Error desactivando horario:', error);
        alert('Error al desactivar');
      }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Horarios</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormData({
              usuarioId: '',
              nombre: '',
              horaEntrada: '09:00',
              horaSalida: '18:00',
              diasSemana: 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'
            });
            setShowModal(true);
          }}
        >
          + Asignar Horario
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre Horario</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Días</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(sch => (
              <tr key={sch.id}>
                <td>{sch.usuario?.nombre || sch.usuarioId}</td>
                <td>{sch.nombre}</td>
                <td>{sch.horaEntrada}</td>
                <td>{sch.horaSalida}</td>
                <td>{sch.diasSemana}</td>
                <td>
                  <span className={`badge ${sch.activo ? 'bg-success' : 'bg-secondary'}`}>
                    {sch.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  {sch.activo && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDesactivar(sch.id)}
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Asignar Horario */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asignar Horario</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <select
                      className="form-select"
                      name="usuarioId"
                      value={formData.usuarioId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione un usuario</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} - {u.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre del Horario</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej: Turno Mañana"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hora Entrada</label>
                      <input
                        type="time"
                        className="form-control"
                        name="horaEntrada"
                        value={formData.horaEntrada}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hora Salida</label>
                      <input
                        type="time"
                        className="form-control"
                        name="horaSalida"
                        value={formData.horaSalida}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Días de la semana (separados por coma)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="diasSemana"
                      value={formData.diasSemana}
                      onChange={handleInputChange}
                      required
                      placeholder="LUNES,MARTES,MIERCOLES,JUEVES,VIERNES"
                    />
                    <small className="text-muted">Usar nombres en mayúsculas separados por comas</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Asignar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;