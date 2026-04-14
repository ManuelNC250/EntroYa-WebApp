import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'TRABAJADOR',
    departamento: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingUser) {
        result = await adminService.actualizarUsuario(editingUser.id, formData);
      } else {
        result = await adminService.crearUsuario(formData);
      }

      if (result.status === 'success') {
        alert(editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
        setShowModal(false);
        fetchUsers();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const result = await adminService.eliminarUsuario(userId);
        if (result.status === 'success') {
          fetchUsers();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol,
      departamento: user.departamento || ''
    });
    setShowModal(true);
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
        <h2>Gestión de Usuarios</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingUser(null);
            setFormData({
              nombre: '',
              email: '',
              password: '',
              rol: 'TRABAJADOR',
              departamento: ''
            });
            setShowModal(true);
          }}
        >
          + Nuevo Usuario
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
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
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${
                    user.rol === 'ADMIN' ? 'bg-danger' : 'bg-primary'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td>{user.departamento || 'N/A'}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </button>
                    <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => navigate('/admin/historial/trabajador/' + user.id)}
                    >
                      Ver historial
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {editingUser ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                    >
                      <option value="TRABAJADOR">Trabajador</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Departamento</label>
                    <input
                      type="text"
                      className="form-control"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingUser ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;