import React, { useState, useEffect } from 'react';
import { justificantesService, adminService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { notify, confirmToast, promptToast } from '../../utils/toast';

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
      notify.error('Error al cargar justificantes');
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
    const toastId = notify.loading('Descargando archivo...');
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
      notify.dismiss(toastId);
      notify.success('Archivo descargado');
    } catch (error) {
      notify.dismiss(toastId);
      notify.error('Error al descargar el archivo');
    }
  };

  const handleAprobar = (id) => {
    confirmToast('¿Aprobar este justificante?', async () => {
      try {
        await justificantesService.aprobarRechazar(id, { estado: 'APROBADO' });
        notify.success('Justificante aprobado correctamente');
        fetchData();
      } catch (error) {
        notify.error('Error al aprobar el justificante');
      }
    });
  };

  const handleRechazar = (id) => {
    promptToast('Motivo del rechazo:', async (motivo) => {
      try {
        await justificantesService.aprobarRechazar(id, { estado: 'RECHAZADO', comentarios: motivo });
        notify.success('Justificante rechazado');
        fetchData();
      } catch (error) {
        notify.error('Error al rechazar el justificante');
      }
    });
  };

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border" role="status"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando justificantes...</span>
        </div>
    );
  }

  return (
      <div className="fade-in-up">
        <div className="page-header">
          <h2>Justificantes</h2>
          <p>Revisa los justificantes pendientes y consulta el historial por trabajador</p>
        </div>

        {/* Selector historial trabajador */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title" style={{ marginBottom: '14px' }}>🔍 Ver historial de un trabajador</h5>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                  className="form-select"
                  style={{ maxWidth: '360px' }}
                  value={usuarioSeleccionado}
                  onChange={e => setUsuarioSeleccionado(e.target.value)}
              >
                <option value="">Selecciona un trabajador...</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} — {u.email}</option>
                ))}
              </select>
              <button
                  className="btn btn-primary"
                  onClick={handleVerHistorial}
                  disabled={!usuarioSeleccionado}
              >
                Ver historial completo
              </button>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h5 style={{ margin: 0, color: 'var(--gray-700)' }}>Pendientes de revision</h5>
          <span className="badge badge-soft-warning">{justificantes.length} pendientes</span>
        </div>

        {justificantes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h5>Todo al dia</h5>
              <p>No hay justificantes pendientes de revision</p>
            </div>
        ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Trabajador</th>
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
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>#{just.id}</td>
                      <td style={{ fontWeight: '500' }}>{just.usuarioNombre || just.usuarioId}</td>
                      <td><span className="badge badge-soft-info">{just.tipo}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{new Date(just.fecha).toLocaleDateString('es-ES')}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{just.descripcion}</td>
                      <td>
                        {just.tieneArchivo
                            ? <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDescargar(just.id, just.archivoNombre)}>
                              📎 Archivo
                            </button>
                            : <span style={{ color: 'var(--gray-300)', fontSize: '0.8125rem' }}>Sin archivo</span>
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