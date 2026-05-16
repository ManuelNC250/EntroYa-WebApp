import React, { useState, useEffect } from 'react';
import { horariosService, adminService } from '../../services/api';
import { notify, confirmToast } from '../../utils/toast.jsx';
import Modal from '../shared/Modal';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterActivo, setFilterActivo] = useState('todos');
  const [formData, setFormData] = useState({
    usuarioId: '', nombre: '',
    horaEntrada: '09:00', horaSalida: '18:00',
    diasSemana: 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [s, u] = await Promise.all([horariosService.getAll(), adminService.getUsers()]);
      setSchedules(s);
      setUsers(u);
    } catch {
      notify.error('Error al cargar horarios');
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
    setSaving(true);
    try {
      await horariosService.asignar(formData);
      notify.success('Horario asignado correctamente');
      setShowModal(false);
      fetchData();
    } catch {
      notify.error('Error al asignar horario');
    } finally {
      setSaving(false);
    }
  };

  const handleDesactivar = (id, nombre) => {
    confirmToast('Desactivar el horario "' + nombre + '"?', async () => {
      try {
        await horariosService.desactivar(id);
        notify.success('Horario desactivado');
        fetchData();
      } catch {
        notify.error('Error al desactivar');
      }
    });
  };

  const filtered = schedules.filter(s => {
    if (filterActivo === 'activos') return s.activo;
    if (filterActivo === 'inactivos') return !s.activo;
    return true;
  });

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando horarios...</span>
        </div>
    );
  }

  return (
      <div className="fade-in-up">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Gestion de Horarios</h2>
            <p>{schedules.filter(s => s.activo).length} horarios activos</p>
          </div>
          <button className="btn btn-primary" onClick={() => {
            setFormData({ usuarioId: '', nombre: '', horaEntrada: '09:00', horaSalida: '18:00', diasSemana: 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES' });
            setShowModal(true);
          }}>
            + Asignar Horario
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['todos', 'activos', 'inactivos'].map(f => (
              <button
                  key={f}
                  className={'btn btn-sm ' + (filterActivo === f ? 'btn-primary' : 'btn-outline-secondary')}
                  onClick={() => setFilterActivo(f)}
                  style={{ textTransform: 'capitalize' }}
              >
                {f}
              </button>
          ))}
        </div>

        {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗓️</div>
              <h5>Sin horarios</h5>
              <p>Asigna el primer horario con el boton de arriba</p>
            </div>
        ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                <tr>
                  <th>Trabajador</th>
                  <th>Nombre</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Dias</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map(sch => (
                    <tr key={sch.id}>
                      <td style={{ fontWeight: '500' }}>{sch.usuario?.nombre || sch.usuarioId}</td>
                      <td>{sch.nombre}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: '600' }}>{sch.horaEntrada}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)', fontWeight: '600' }}>{sch.horaSalida}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{sch.diasSemana}</td>
                      <td>
                    <span className={sch.activo ? 'badge badge-soft-success' : 'badge bg-secondary'}>
                      {sch.activo ? 'Activo' : 'Inactivo'}
                    </span>
                      </td>
                      <td>
                        {sch.activo && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDesactivar(sch.id, sch.nombre)}>
                              Desactivar
                            </button>
                        )}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            title="🗓️ Asignar Horario"
            footer={
              <>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" form="horarioForm" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : 'Asignar horario'}
                </button>
              </>
            }
        >
          <form id="horarioForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Trabajador</label>
              <select className="form-select" name="usuarioId" value={formData.usuarioId} onChange={handleInputChange} required>
                <option value="">Selecciona un trabajador...</option>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} — {u.email}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre del horario</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Ej: Turno Manana" />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Hora entrada</label>
                <input type="time" className="form-control" name="horaEntrada" value={formData.horaEntrada} onChange={handleInputChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Hora salida</label>
                <input type="time" className="form-control" name="horaSalida" value={formData.horaSalida} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Dias de la semana</label>
              <input type="text" className="form-control" name="diasSemana" value={formData.diasSemana} onChange={handleInputChange} required />
              <small className="form-text">Nombres en mayusculas separados por comas</small>
            </div>
          </form>
        </Modal>
      </div>
  );
};

export default ScheduleManagement;