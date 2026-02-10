import React, { useState } from 'react';
import { justificantesService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RequestJustification = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'ENFERMEDAD',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    archivo: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      archivo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append('usuarioId', auth.user.id);
      formDataToSend.append('tipo', formData.tipo);
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('descripcion', formData.descripcion);
      if (formData.archivo) {
        formDataToSend.append('archivo', formData.archivo);
      }

      // En un caso real, necesitarías un endpoint que acepte FormData
      // Por ahora, simulamos la petición
      console.log('Datos del justificante:', {
        usuarioId: auth.user.id,
        ...formData
      });

      // await justificantesService.solicitar(formDataToSend);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reset form
      setFormData({
        tipo: 'ENFERMEDAD',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        archivo: null
      });
    } catch (error) {
      console.error('Error solicitando justificante:', error);
      alert('Error al solicitar el justificante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Solicitar Justificante</h2>

      {success && (
        <div className="alert alert-success alert-dismissible fade show">
          ¡Justificante solicitado correctamente!
          <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Tipo de Justificante</label>
                <select
                  className="form-select"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="ENFERMEDAD">Enfermedad</option>
                  <option value="VACACIONES">Vacaciones</option>
                  <option value="ASUNTO_PERSONAL">Asunto Personal</option>
                  <option value="DOCTOR">Visita Médica</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                required
                placeholder="Describe brevemente el motivo de tu ausencia..."
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Documento de apoyo (opcional)</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <small className="text-muted">
                Puedes subir un justificante médico, documento, etc. (PDF, JPG, PNG)
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enviando...
                </>
              ) : 'Solicitar Justificante'}
            </button>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">📋 Tipos de Justificantes</h5>
          <ul>
            <li><strong>Enfermedad:</strong> Por enfermedad común o certificado médico</li>
            <li><strong>Vacaciones:</strong> Días de vacaciones previamente aprobados</li>
            <li><strong>Asunto Personal:</strong> Gestiones personales urgentes</li>
            <li><strong>Visita Médica:</strong> Cita médica programada</li>
            <li><strong>Otro:</strong> Otros motivos justificados</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestJustification;