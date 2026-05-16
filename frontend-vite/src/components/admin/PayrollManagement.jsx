import React, { useState, useEffect } from 'react';
import { nominasService, adminService } from '../../services/api';
import { notify, confirmToast } from '../../utils/toast.jsx';
import Modal from '../shared/Modal';

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    usuarioId: '', mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(), archivo: null, comentarios: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [p, u] = await Promise.all([nominasService.getAll(), adminService.getUsers()]);
      setPayrolls(p);
      setUsers(u);
    } catch {
      notify.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFormData(prev => ({ ...prev, archivo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('usuarioId', formData.usuarioId);
      fd.append('mes', formData.mes);
      fd.append('ano', formData.ano);
      if (formData.archivo) fd.append('archivo', formData.archivo);
      if (formData.comentarios) fd.append('comentarios', formData.comentarios);
      const result = await nominasService.subir(fd);
      if (result.status === 'success') {
        notify.success('Nomina subida correctamente');
        setShowModal(false);
        fetchData();
      } else {
        notify.error(result.message || 'Error al subir');
      }
    } catch {
      notify.error('Error al subir la nomina');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    confirmToast('Eliminar esta nomina? No se puede recuperar.', async () => {
      try {
        await nominasService.eliminar(id);
        notify.success('Nomina eliminada');
        fetchData();
      } catch {
        notify.error('Error al eliminar');
      }
    });
  };

  const handleDescargar = async (id, nombre) => {
    const tid = notify.loading('Descargando...');
    try {
      const response = await fetch('/api/nominas/descargar/' + id);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = nombre || 'nomina.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
      notify.dismiss(tid); notify.success('Descarga completada');
    } catch {
      notify.dismiss(tid); notify.error('Error al descargar');
    }
  };

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando nominas...</span>
        </div>
    );
  }

  return (
      <div className="fade-in-up">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Gestion de Nominas</h2>
            <p>{payrolls.length} nominas registradas</p>
          </div>
          <button className="btn btn-primary" onClick={() => {
            setFormData({ usuarioId: '', mes: new Date().getMonth() + 1, ano: new Date().getFullYear(), archivo: null, comentarios: '' });
            setShowModal(true);
          }}>
            + Subir Nomina
          </button>
        </div>

        {payrolls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <h5>Sin nominas</h5>
              <p>Sube la primera nomina con el boton de arriba</p>
            </div>
        ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                <tr>
                  <th>Trabajador</th>
                  <th>Periodo</th>
                  <th>Archivo</th>
                  <th>Tamanio</th>
                  <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {payrolls.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '500' }}>{p.usuarioNombre || p.usuarioId}</td>
                      <td>
                    <span className="badge badge-soft-primary">
                      {new Date(2000, p.mes - 1).toLocaleDateString('es-ES', { month: 'long' })} {p.ano}
                    </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{p.archivoNombre}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{(p.archivoTamanio / 1024).toFixed(1)} KB</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-primary" onClick={() => handleDescargar(p.id, p.archivoNombre)}>Descargar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                        </div>
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
            title="💰 Subir Nomina"
            footer={
              <>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" form="nominaForm" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Subiendo...</> : 'Subir nomina'}
                </button>
              </>
            }
        >
          <form id="nominaForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Trabajador</label>
              <select className="form-select" name="usuarioId" value={formData.usuarioId} onChange={handleInputChange} required>
                <option value="">Selecciona un trabajador...</option>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} — {u.email}</option>
                ))}
              </select>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Mes</label>
                <select className="form-select" name="mes" value={formData.mes} onChange={handleInputChange} required>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                      <option key={m} value={m}>{new Date(2000, m-1).toLocaleDateString('es-ES', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Anio</label>
                <input type="number" className="form-control" name="ano" value={formData.ano} onChange={handleInputChange} required min="2023" max="2030" />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Archivo PDF o imagen</label>
              <input type="file" className="form-control" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Comentarios (opcional)</label>
              <textarea className="form-control" name="comentarios" value={formData.comentarios} onChange={handleInputChange} rows="2" placeholder="Notas adicionales..." />
            </div>
          </form>
        </Modal>
      </div>
  );
};

export default PayrollManagement;