import React, { useState, useEffect } from 'react';
import { justificantesService } from '../../services/api';

const JustificationsReview = () => {
  const [justificantes, setJustificantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJustificantes();
  }, []);

  const fetchJustificantes = async () => {
    try {
      const response = await justificantesService.getPendientes();
      setJustificantes(response.data || []);
    } catch (error) {
      console.error('Error fetching justificantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id) => {
    if (window.confirm('¿Aprobar este justificante?')) {
      try {
        await justificantesService.aprobarRechazar(id, { estado: 'APROBADO' });
        alert('Justificante aprobado');
        fetchJustificantes();
      } catch (error) {
        console.error('Error aprobando justificante:', error);
        alert('Error al aprobar');
      }
    }
  };

  const handleRechazar = async (id) => {
    const motivo = prompt('Motivo del rechazo:');
    if (motivo) {
      try {
        await justificantesService.aprobarRechazar(id, {
          estado: 'RECHAZADO',
          comentarios: motivo
        });
        alert('Justificante rechazado');
        fetchJustificantes();
      } catch (error) {
        console.error('Error rechazando justificante:', error);
        alert('Error al rechazar');
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
      <h2 className="mb-4">Justificantes Pendientes</h2>

      {justificantes.length === 0 ? (
        <div className="alert alert-info">
          No hay justificantes pendientes de revisión.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Archivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {justificantes.map(just => (
                <tr key={just.id}>
                  <td>{just.id}</td>
                  <td>{just.usuario?.nombre || just.usuarioId}</td>
                  <td>
                    <span className="badge bg-info">{just.tipo}</span>
                  </td>
                  <td>{new Date(just.fecha).toLocaleDateString()}</td>
                  <td>{just.descripcion}</td>
                  <td>
                    {just.archivoUrl ? (
                      <a href={just.archivoUrl} target="_blank" rel="noreferrer">
                        Ver archivo
                      </a>
                    ) : 'Sin archivo'}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleAprobar(just.id)}
                      >
                        Aprobar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRechazar(just.id)}
                      >
                        Rechazar
                      </button>
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