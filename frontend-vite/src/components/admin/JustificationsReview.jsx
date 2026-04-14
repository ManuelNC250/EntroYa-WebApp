import React, { useState, useEffect } from 'react';
import { justificantesService, adminService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const JustificationsReview = () => {
  const navigate = useNavigate();
  const [justificantes, setJustificantes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [justs, users] = await Promise.all([
        justificantesService.getPendientes(),
        adminService.getUsers()
      ]);
      setJustificantes(justs);
      setUsuarios(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerHistorial = () => {
    if (usuarioSeleccionado) {
      navigate('/admin/justificantes/trabajador/' + usuarioSeleccionado);
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

  const handleAprobar = async (id) => {
    if (window.confirm('Aprobar este justificante?')) {
      try {
        await justificantesService.aprobarRechazar(id, { estado: 'APROBADO' });
        fetchData();
      } catch (error) {
        alert('Error al aprobar');
      }
    }
  };

  const handleRechazar = async (id) => {
    const motivo = prompt('Motivo del rechazo:');
    if (motivo) {
      try {
        await justificantesService.aprobarRechazar(id, { estado: 'RECHAZADO', comentarios: motivo });
        fetchData();
      } catch (error) {
        alert('Error al rechazar');
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
      <div>
        <h2 className="mb-4">Justificantes</h2>

        <div className="card mb-4">
          <div className="card-body">
            <h6 className="card-title">Ver historial de un trabajador</h6>
            <div className="d-flex gap-2">
              <select
                  className="form-select"
                  value={usuarioSeleccionado}
                  onChange={e => setUsuarioSeleccionado(e.target.value)}
              >
                <option value="">Selecciona un trabajador...</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} - {u.email}</option>
                ))}
              </select>
              <button
                  className="btn btn-outline-primary"
                  onClick={handleVerHistorial}
                  disabled={!usuarioSeleccionado}
              >
                Ver historial
              </button>
            </div>
          </div>
        </div>

        <h5>Pendientes de revision</h5>
        {justificantes.length === 0 ? (
            <div className="alert alert-info">No hay justificantes pendientes.</div>
        ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Descripcion</th>
                  <th>Archivo</th>
                  <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {justificantes.map(just => (
                    <tr key={just.id}>
                      <td>{just.id}</td>
                      <td>{just.usuarioNombre || just.usuarioId}</td>
                      <td><span className="badge bg-info">{just.tipo}</span></td>
                      <td>{new Date(just.fecha).toLocaleDateString()}</td>
                      <td>{just.descripcion}</td>
                      <td>
                        {just.tieneArchivo
                            ? <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDescargar(just.id, just.archivoNombre)}>Ver archivo</button>
                            : 'Sin archivo'
                        }
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-success" onClick={() => handleAprobar(just.id)}>Aprobar</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleRechazar(just.id)}>Rechazar</button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
};

export default JustificationsReview;