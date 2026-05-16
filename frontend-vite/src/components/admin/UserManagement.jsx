import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { notify, confirmToast } from '../../utils/toast.jsx';
import Modal from '../shared/Modal';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', rol: 'TRABAJADOR', departamento: ''
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch {
      notify.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ nombre: '', email: '', password: '', rol: 'TRABAJADOR', departamento: '' });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({ nombre: user.nombre, email: user.email, password: '', rol: user.rol, departamento: user.departamento || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = editingUser
          ? await adminService.actualizarUsuario(editingUser.id, formData)
          : await adminService.crearUsuario(formData);
      if (result.status === 'success') {
        notify.success(editingUser ? 'Usuario actualizado' : 'Usuario creado');
        setShowModal(false);
        fetchUsers();
      } else {
        notify.error(result.message || 'Error al guardar');
      }
    } catch {
      notify.error('Error de conexion');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (userId, nombre) => {
    confirmToast('Eliminar a ' + nombre + '? Esta accion no se puede deshacer.', async () => {
      try {
        const result = await adminService.eliminarUsuario(userId);
        if (result.status === 'success') {
          notify.success('Usuario eliminado');
          fetchUsers();
        } else {
          notify.error(result.message || 'Error al eliminar');
        }
      } catch {
        notify.error('Error al eliminar');
      }
    });
  };

  if (loading) {
    return (
        <div className="spinner-container">
          <div className="spinner-border"></div>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Cargando usuarios...</span>
        </div>
    );
  }

  return (
      <div className="fade-in-up">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Gestion de Usuarios</h2>
            <p>{users.length} usuarios registrados</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Nuevo usuario</button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Departamento</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>#{user.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: user.rol === 'ADMIN' ? '#fef2f2' : '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8125rem', fontWeight: '700',
                        color: user.rol === 'ADMIN' ? '#ef4444' : '#2563eb',
                      }}>
                        {user.nombre?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '500' }}>{user.nombre}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{user.email}</td>
                  <td>
                  <span className={user.rol === 'ADMIN' ? 'badge badge-soft-danger' : 'badge badge-soft-primary'}>
                    {user.rol}
                  </span>
                  </td>
                  <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{user.departamento || '—'}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(user)}>Editar</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/admin/historial/trabajador/' + user.id)}>Historial</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id, user.nombre)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
            footer={
              <>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" form="userForm" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : (editingUser ? 'Actualizar' : 'Crear usuario')}
                </button>
              </>
            }
        >
          <form id="userForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Ej: Maria Garcia Lopez" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required placeholder="email@empresa.com" />
            </div>
            <div className="mb-3">
              <label className="form-label">{editingUser ? 'Nueva contrasena (dejar vacio para no cambiar)' : 'Contrasena'}</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} required={!editingUser} placeholder={editingUser ? 'Sin cambios' : 'Minimo 8 caracteres'} />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Rol</label>
                <select className="form-select" name="rol" value={formData.rol} onChange={handleInputChange}>
                  <option value="TRABAJADOR">Trabajador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Departamento</label>
                <input type="text" className="form-control" name="departamento" value={formData.departamento} onChange={handleInputChange} placeholder="Ej: RRHH" />
              </div>
            </div>
          </form>
        </Modal>
      </div>
  );
};

export default UserManagement;