import React, { useState, useEffect } from 'react';
import { nominasService, adminService } from '../../services/api';

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    usuarioId: '',
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    archivo: null,
    comentarios: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [payrollsData, usersData] = await Promise.all([
        nominasService.getAll(),
        adminService.getUsers()
      ]);
      setPayrolls(payrollsData);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, archivo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('usuarioId', formData.usuarioId);
      formDataToSend.append('mes', formData.mes);
      formDataToSend.append('ano', formData.ano);
      if (formData.archivo) formDataToSend.append('archivo', formData.archivo);
      if (formData.comentarios) formDataToSend.append('comentarios', formData.comentarios);

      const result = await nominasService.subir(formDataToSend);
      if (result.status === 'success') {
        alert('Nomina subida correctamente');
        setShowModal(false);
        fetchData();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error al subir nomina');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar esta nomina?')) {
      try {
        await nominasService.eliminar(id);
        fetchData();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const handleDescargar = async (id, nombre) => {
    try {
      const response = await fetch('/api/nominas/descargar/' + id);
      if (!response.ok) throw new Error('Error al descargar');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre || 'nomina.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error al descargar la nomina');
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
        <h2>Gestion de Nominas</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormData({ usuarioId: '', mes: new Date().getMonth() + 1, ano: new Date().getFullYear(), archivo: null, comentarios: '' });
            setShowModal(true);
          }}
        >
          + Subir Nomina
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Periodo</th>
              <th>Archivo</th>
              <th>Tipo</th>
              <th>Tamanio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map(p => (
              <tr key={p.id}>
                <td>{p.usuarioNombre || p.usuarioId}</td>
                <td>{p.mes}/{p.ano}</td>
                <td>{p.archivoNombre}</td>
                <td>{p.archivoTipo}</td>
                <td>{(p.archivoTamanio / 1024).toFixed(2)} KB</td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleDescargar(p.id, p.archivoNombre)}
                    >
                      Descargar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Subir Nomina</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <select className="form-select" name="usuarioId" value={formData.usuarioId} onChange={handleInputChange} required>
                      <option value="">Seleccione un usuario</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} - {u.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mes</label>
                      <select className="form-select" name="mes" value={formData.mes} onChange={handleInputChange} required>
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                          <option key={m} value={m}>
                            {new Date(2000, m-1, 1).toLocaleDateString('es-ES', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Anio</label>
                      <input type="number" className="form-control" name="ano" value={formData.ano} onChange={handleInputChange} required min="2023" max="2030" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Archivo (PDF o imagen)</label>
                    <input type="file" className="form-control" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comentarios (opcional)</label>
                    <textarea className="form-control" name="comentarios" value={formData.comentarios} onChange={handleInputChange} rows="2" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Subir</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;