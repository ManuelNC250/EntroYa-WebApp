import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { justificantesService, adminService } from '../../services/api';
import { notify } from '../../utils/toast';

const WorkerJustificantesAdmin = () => {
    const { usuarioId } = useParams();
    const navigate = useNavigate();
    const [justificantes, setJustificantes] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, [usuarioId]);

    const fetchData = async () => {
        try {
            const [justs, user] = await Promise.all([
                justificantesService.getByUsuario(usuarioId),
                adminService.getUser(usuarioId)
            ]);
            setJustificantes(Array.isArray(justs) ? justs : []);
            setUsuario(user);
        } catch (error) {
            notify.error('Error al cargar justificantes');
        } finally {
            setLoading(false);
        }
    };

    const handleDescargar = async (id, nombre) => {
        const toastId = notify.loading('Descargando...');
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
            notify.success('Descarga completada');
        } catch (error) {
            notify.dismiss(toastId);
            notify.error('Error al descargar');
        }
    };

    const estadoBadge = (estado) => {
        if (estado === 'APROBADO') return 'badge-soft-success';
        if (estado === 'RECHAZADO') return 'badge-soft-danger';
        return 'badge-soft-warning';
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return (
        <div className="fade-in-up">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/justificantes')}>
                    ← Volver
                </button>
                <div>
                    <h2 style={{ marginBottom: '2px' }}>Justificantes de {usuario?.nombre || 'Trabajador'}</h2>
                    <p style={{ margin: 0 }}>{usuario?.email}</p>
                </div>
            </div>

            {justificantes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h5>Sin justificantes</h5>
                    <p>Este trabajador no ha solicitado ningun justificante</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
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
                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                                    {new Date(j.fecha).toLocaleDateString('es-ES')}
                                </td>
                                <td><span className="badge badge-soft-info">{j.tipo}</span></td>
                                <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {j.descripcion}
                                </td>
                                <td><span className={'badge ' + estadoBadge(j.estado)}>{j.estado}</span></td>
                                <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{j.comentariosAdmin || '—'}</td>
                                <td>
                                    {j.tieneArchivo
                                        ? <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDescargar(j.id, j.archivoNombre)}>📎 Archivo</button>
                                        : <span style={{ color: 'var(--gray-300)' }}>—</span>
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

export default WorkerJustificantesAdmin;