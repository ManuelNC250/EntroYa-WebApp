import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workerService, adminService } from '../../services/api';

const WorkerHistorialAdmin = () => {
    const { usuarioId } = useParams();
    const navigate = useNavigate();
    const [historial, setHistorial] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [usuarioId]);

    const fetchData = async () => {
        try {
            const [hist, user] = await Promise.all([
                workerService.getFullHistory(usuarioId),
                adminService.getUser(usuarioId)
            ]);
            setHistorial(Array.isArray(hist) ? hist : []);
            setUsuario(user);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const agruparPorDia = () => {
        const grupos = {};
        historial.forEach(reg => {
            const fecha = new Date(reg.fechaHora).toLocaleDateString();
            if (!grupos[fecha]) grupos[fecha] = [];
            grupos[fecha].push(reg);
        });
        return grupos;
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    const grupos = agruparPorDia();

    return (
        <div>
            <div className="d-flex align-items-center mb-4 gap-3">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/usuarios')}>
                    Volver
                </button>
                <h2 className="mb-0">Historial de {usuario?.nombre || 'Trabajador'}</h2>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <p className="mb-1">Total registros:</p>
                            <h3>{historial.length}</h3>
                        </div>
                        <div className="col-md-3">
                            <p className="mb-1">Dias con registros:</p>
                            <h3>{Object.keys(grupos).length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {historial.length === 0 ? (
                <div className="alert alert-info">Este trabajador no tiene registros de fichajes.</div>
            ) : (
                Object.entries(grupos).map(([fecha, registros]) => (
                    <div key={fecha} className="card mb-3">
                        <div className="card-header bg-light">
                            <strong>{fecha}</strong>
                        </div>
                        <div className="card-body">
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>Tipo</th>
                                </tr>
                                </thead>
                                <tbody>
                                {registros.map((reg, idx) => (
                                    <tr key={idx}>
                                        <td>{new Date(reg.fechaHora).toLocaleTimeString()}</td>
                                        <td>
                        <span className={'badge ' + (reg.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger')}>
                          {reg.tipo}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default WorkerHistorialAdmin;