import React, { useState, useEffect } from 'react';
import { nominasService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/toast';

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
      notify.error('Error al cargar nominas');
      setNominas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async (id, nombre) => {
    const toastId = notify.loading('Descargando nomina...');
    try {
      const response = await fetch('/api/nominas/descargar/' + id);
      if (!response.ok) throw new Error('Error');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre || 'nomina.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      notify.dismiss(toastId);
      notify.success('Descarga completada');
    } catch (error) {
      notify.dismiss(toastId);
      notify.error('Error al descargar la nomina');
    }
  };

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border" role="status"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando nominas...</span>
        </div>
    );
  }

  return (
      <div className="fade-in-up">
        <div className="page-header">
          <h2>Mis Nominas</h2>
          <p>Consulta y descarga tus nominas disponibles</p>
        </div>

        {nominas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <h5>Sin nominas disponibles</h5>
              <p>Aun no tienes nominas subidas por el administrador</p>
            </div>
        ) : (
            <div className="row gap-cards">
              {nominas.map(n => (
                  <div key={n.id} className="col-md-6 col-lg-4 fade-in-up">
                    <div className="card h-100">
                      <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.25rem'
                          }}>
                            📄
                          </div>
                          <span className="badge badge-soft-primary">
                      {new Date(2000, n.mes - 1).toLocaleDateString('es-ES', { month: 'long' })} {n.ano}
                    </span>
                        </div>
                        <h5 className="card-title" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                          Nomina {new Date(2000, n.mes - 1).toLocaleDateString('es-ES', { month: 'long' })} {n.ano}
                        </h5>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: '4px' }}>
                          {n.archivoNombre}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-300)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                          {(n.archivoTamanio / 1024).toFixed(1)} KB
                        </p>
                        {n.comentarios && (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', background: 'var(--gray-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                              💬 {n.comentarios}
                            </p>
                        )}
                        <button
                            className="btn btn-primary w-100"
                            onClick={() => handleDescargar(n.id, n.archivoNombre)}
                        >
                          ⬇️ Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default PayrollView;