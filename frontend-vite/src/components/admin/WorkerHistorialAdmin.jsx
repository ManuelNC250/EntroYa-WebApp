// WorkerHistorialAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workerService, adminService } from '../../services/api';
import { notify } from '../../utils/toast';

export const WorkerHistorialAdmin = () => {
    const { usuarioId } = useParams();
    const navigate = useNavigate();
    const [historial, setHistorial] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, [usuarioId]);

    const fetchData = async () => {
        try {
            const [hist, user] = await Promise.all([
                workerService.getFullHistory(usuarioId),
                adminService.getUser(usuarioId)
            ]);
            setHistorial(Array.isArray(hist) ? hist : []);
            setUsuario(user);
        } catch (error) {
            notify.error('Error al cargar historial');
        } finally {
            setLoading(false);
        }
    };

    const agruparPorDia = () => {
        const grupos = {};
        historial.forEach(reg => {
            const fecha = new Date(reg.fechaHora).toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            if (!grupos[fecha]) grupos[fecha] = [];
            grupos[fecha].push(reg);
        });
        return grupos;
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    const grupos = agruparPorDia();

    return (
        <div className="fade-in-up">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/usuarios')}>
                    ← Volver
                </button>
                <div>
                    <h2 style={{ marginBottom: '2px' }}>Historial de {usuario?.nombre || 'Trabajador'}</h2>
                    <p style={{ margin: 0 }}>{usuario?.email}</p>
                </div>
            </div>

            <div className="row gap-cards mb-4">
                <div className="col-6 col-md-3 fade-in-up">
                    <div className="card stat-card blue">
                        <div className="stat-number">{historial.length}</div>
                        <div className="stat-label">Total registros</div>
                    </div>
                </div>
                <div className="col-6 col-md-3 fade-in-up">
                    <div className="card stat-card green">
                        <div className="stat-number">{Object.keys(grupos).length}</div>
                        <div className="stat-label">Dias trabajados</div>
                    </div>
                </div>
                <div className="col-6 col-md-3 fade-in-up">
                    <div className="card stat-card cyan">
                        <div className="stat-number">{historial.filter(r => r.tipo === 'ENTRADA').length}</div>
                        <div className="stat-label">Entradas</div>
                    </div>
                </div>
                <div className="col-6 col-md-3 fade-in-up">
                    <div className="card stat-card orange">
                        <div className="stat-number">{historial.filter(r => r.tipo === 'SALIDA').length}</div>
                        <div className="stat-label">Salidas</div>
                    </div>
                </div>
            </div>

            {historial.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🕐</div>
                    <h5>Sin registros</h5>
                    <p>Este trabajador no tiene fichajes registrados</p>
                </div>
            ) : (
                Object.entries(grupos).map(([fecha, registros]) => (
                    <div key={fecha} className="card mb-3 fade-in-up">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ textTransform: 'capitalize' }}>{fecha}</span>
                            <span className="badge badge-soft-primary">{registros.length} registros</span>
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                            <table className="table" style={{ margin: 0 }}>
                                <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>Tipo</th>
                                </tr>
                                </thead>
                                <tbody>
                                {registros.map((reg, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>
                                            {new Date(reg.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </td>
                                        <td>
                        <span className={`badge ${reg.tipo === 'ENTRADA' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                          {reg.tipo === 'ENTRADA' ? '↗ ENTRADA' : '↙ SALIDA'}
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