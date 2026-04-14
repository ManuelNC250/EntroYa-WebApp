import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { justificantesService, adminService } from '../../services/api';

const WorkerJustificantesAdmin = () => {
    const { usuarioId } = useParams();
    const navigate = useNavigate();
    const [justificantes, setJustificantes] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [usuarioId]);

    const fetchData = async () => {
        try {
            const [justs, user] = await Promise.all([
                justificantesService.getByUsuario(usuarioId),
                adminService.getUser(usuarioId)
            ]);
            setJustificantes(Array.isArray(justs) ? justs : []);
            setUsuario(user);
        } catch (error) {
            console.error(error);
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

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div>
            <div className="d-flex align-items-center mb-4 gap-3">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/usuarios')}>
                    Volver
                </button>
                <h2 className="mb-0">
                    Justificantes de {usuario?.nombre || 'Trabajador'}
                </h2>
            </div>

            {justificantes.length === 0 ? (
                <div className="alert alert-info">Este trabajador no tiene justificantes.</div>
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
                                <td><span className="badge bg-info">{j.tipo}</span></td>
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

export default WorkerJustificantesAdmin;