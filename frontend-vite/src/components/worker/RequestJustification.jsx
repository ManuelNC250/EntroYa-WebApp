import React, { useState, useEffect } from 'react';
import { justificantesService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RequestJustification = () => {
  const auth = useAuth();
  const [tab, setTab] = useState('solicitar');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [justificantes, setJustificantes] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'ENFERMEDAD',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    archivo: null
  });

  useEffect(() => {
    if (tab === 'historial') fetchJustificantes();
  }, [tab]);

  const fetchJustificantes = async () => {
    setLoadingLista(true);
    try {
      const data = await justificantesService.getByUsuario(auth.user.id);
      setJustificantes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLista(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, archivo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('usuarioId', auth.user.id);
      formDataToSend.append('tipo', formData.tipo);
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('descripcion', formData.descripcion);
      if (formData.archivo) formDataToSend.append('archivo', formData.archivo);

      const result = await justificantesService.solicitar(formDataToSend);
      if (result.status === 'success') {
        setSuccess(true);
        setFormData({ tipo: 'ENFERMEDAD', fecha: new Date().toISOString().split('T')[0], descripcion: '', archivo: null });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async (id, nombre) => {
    try {
      const response = await fetch('/api/justificantes/descargar/' + id);
      if (!response.ok) throw new Error('Error');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre || 'justificante.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error al descargar');
    }
  };

  return (
      <div>
        <h2 className="mb-4">Justificantes</h2>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={"nav-link " + (tab === 'solicitar' ? 'active' : '')} onClick={() => setTab('solicitar')}>
              Solicitar justificante
            </button>
          </li>
          <li className="nav-item">
            <button className={"nav-link " + (tab === 'historial' ? 'active' : '')} onClick={() => setTab('historial')}>
              Mis justificantes
            </button>
          </li>
        </ul>

        {tab === 'solicitar' && (
            <div>
              {success && (
                  <div className="alert alert-success alert-dismissible fade show">
                    Justificante solicitado correctamente.
                    <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
                  </div>
              )}
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tipo de Justificante</label>
                        <select className="form-select" name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                          <option value="ENFERMEDAD">Enfermedad</option>
                          <option value="VACACIONES">Vacaciones</option>
                          <option value="ASUNTO_PERSONAL">Asunto Personal</option>
                          <option value="DOCTOR">Visita Medica</option>
                          <option value="OTRO">Otro</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Fecha</label>
                        <input type="date" className="form-control" name="fecha" value={formData.fecha} onChange={handleInputChange} required max={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripcion</label>
                      <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows="3" required placeholder="Describe brevemente el motivo..." />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Documento de apoyo (opcional)</label>
                      <input type="file" className="form-control" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                      <small className="text-muted">PDF, JPG o PNG</small>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Enviando...</> : 'Solicitar Justificante'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
        )}

        {tab === 'historial' && (
            <div>
              {loadingLista ? (
                  <div className="text-center mt-4"><div className="spinner-border"></div></div>
              ) : justificantes.length === 0 ? (
                  <div className="alert alert-info">No has solicitado ningun justificante.</div>
              ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Descripcion</th>
                        <th>Estado</th>
                        <th>Comentarios admin</th>
                        <th>Archivo</th>
                      </tr>
                      </thead>
                      <tbody>
                      {justificantes.map(j => (
                          <tr key={j.id}>
                            <td>{new Date(j.fecha).toLocaleDateString()}</td>
                            <td>{j.tipo}</td>
                            <td>{j.descripcion}</td>
                            <td>
                        <span className={'badge ' + (j.estado === 'APROBADO' ? 'bg-success' : j.estado === 'RECHAZADO' ? 'bg-danger' : 'bg-warning')}>
                          {j.estado}
                        </span>
                            </td>
                            <td>{j.comentariosAdmin || '-'}</td>
                            <td>
                              {j.tieneArchivo
                                  ? <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDescargar(j.id, j.archivoNombre)}>Descargar</button>
                                  : '-'
                              }
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

export default RequestJustification;