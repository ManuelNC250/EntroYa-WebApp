import React, { useState, useEffect } from 'react';
import { nominasService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PayrollView = () => {
  const auth = useAuth();
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user?.id) fetchNominas();
  }, [auth.user]);

  const fetchNominas = async () => {
    try {
      const data = await nominasService.getByUsuario(auth.user.id);
      setNominas(data);
    } catch (error) {
      console.error('Error fetching nominas:', error);
      setNominas([]);
    } finally {
      setLoading(false);
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
      <h2 className="mb-4">Mis Nominas</h2>
      {nominas.length === 0 ? (
        <div className="alert alert-info">No tienes nominas disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Archivo</th>
                <th>Tamanio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {nominas.map(n => (
                <tr key={n.id}>
                  <td>{n.mes}/{n.ano}</td>
                  <td>{n.archivoNombre}</td>
                  <td>{(n.archivoTamanio / 1024).toFixed(2)} KB</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleDescargar(n.id, n.archivoNombre)}
                    >
                      Descargar
                    </button>
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

export default PayrollView;