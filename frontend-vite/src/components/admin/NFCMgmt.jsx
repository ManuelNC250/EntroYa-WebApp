import React, { useState, useEffect } from 'react';
import { nfcService } from '../../services/api';
import { adminService } from '../../services/api';

const NFCMgmt = () => {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    usuarioId: '',
    uid: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cardsRes, usersRes] = await Promise.all([
        nfcService.getAll(),
        adminService.getUsers()
      ]);
      setCards(cardsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await nfcService.asignar({
        usuarioId: parseInt(formData.usuarioId),
        uid: formData.uid
      });
      alert('Tarjeta asignada correctamente');
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error asignando tarjeta:', error);
      alert('Error al asignar tarjeta');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Tarjetas NFC</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormData({ usuarioId: '', uid: '' });
            setShowModal(true);
          }}
        >
          + Asignar Tarjeta
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>UID</th>
              <th>Usuario</th>
              <th>Activa</th>
              <th>Fecha Asignación</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id}>
                <td>{card.id}</td>
                <td><code>{card.uid}</code></td>
                <td>{card.usuario?.nombre || 'Sin asignar'}</td>
                <td>
                  <span className={`badge ${card.activa ? 'bg-success' : 'bg-secondary'}`}>
                    {card.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td>{card.fechaAsignacion ? new Date(card.fechaAsignacion).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Asignar Tarjeta */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asignar Tarjeta NFC</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <select
                      className="form-select"
                      name="usuarioId"
                      value={formData.usuarioId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione un usuario</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} - {u.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">UID de la tarjeta</label>
                    <input
                      type="text"
                      className="form-control"
                      name="uid"
                      value={formData.uid}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej: 04:A3:12:5B"
                    />
                    <small className="text-muted">Formato hexadecimal separado por dos puntos</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Asignar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFCMgmt;