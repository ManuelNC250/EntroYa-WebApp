import React, { useState, useEffect } from 'react';
import { justificantesService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyJustifications = () => {
  const auth = useAuth();
  const [justificantes, setJustificantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) fetchJustificantes();
  }, [auth.user]);

  const fetchJustificantes = async () => {
    try {
      const data = await justificantesService.getByUsuario(auth.user.id);
      setJustificantes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async (id, nombre) => {
    try {
      const response = await fetch('/api/justificantes/descargar/' + id);
      if (!response.ok) throw new Error('Error al descargar');
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
      alert('Error al descargar el justificante');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div>
      <h2 className="mb-4">Mis Justificantes</h2>
      {justificantes.length === 0 ? (
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
                <th>Comentarios</th>
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
  );
};

export default MyJustifications;