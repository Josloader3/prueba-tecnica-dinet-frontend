import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { solicitudService } from '../services/solicitudService';

export default function SolicitudFormPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fechaEnvio: new Date().toISOString().split('T')[0],
    marca: '',
    tipoSolicitud: 'Cotización',
    nombreContacto: '',
    numeroContacto: '',
  });

  const [contactos, setContactos] = useState([
    { id: 1, nombreContacto: '', numeroContacto: '' }
  ]);

  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState('');

  useEffect(() => {
    solicitudService.listarTipos().then(lista => {
      setTipos(lista);
      if (lista.length > 0 && !formData.tipoSolicitud) {
        setFormData(prev => ({ ...prev, tipoSolicitud: lista[0] }));
      }
    });
  }, []);

  const handleNumericInput = (field, value) => {
    const numericValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, [field]: numericValue }));
  };

  const handleAddContacto = () => {
    setContactos(prev => [
      ...prev,
      { id: Date.now(), nombreContacto: '', numeroContacto: '' }
    ]);
  };

  const handleRemoveContacto = (index) => {
    setContactos(prev => prev.filter((_, i) => i !== index));
  };

  const handleContactoChange = (index, field, value) => {
    const cleanValue = field === 'numeroContacto' ? value.replace(/\D/g, '') : value;
    setContactos(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: cleanValue };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombreContacto || !formData.numeroContacto || !formData.marca) {
      setError('Por favor completa todos los campos obligatorios marcados con (*).');
      return;
    }

    // Filtrar contactos adicionales completos
    const contactosValidos = contactos
      .filter(c => c.nombreContacto.trim() !== '' && c.numeroContacto.trim() !== '')
      .map(c => ({
        nombreContacto: c.nombreContacto.trim(),
        numeroContacto: c.numeroContacto.trim(),
      }));

    const payload = {
      marca: formData.marca.trim(),
      tipoSolicitud: formData.tipoSolicitud,
      fechaEnvio: formData.fechaEnvio,
      nombreContacto: formData.nombreContacto.trim(),
      numeroContacto: formData.numeroContacto.trim(),
      contactos: contactosValidos,
    };

    setLoading(true);
    try {
      const response = await solicitudService.crear(payload);
      setCodigoGenerado(response.codigo);
      setShowModal(true);
    } catch (err) {
      console.error('Error al guardar la solicitud:', err);
      const backendMsg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Ocurrió un error al guardar la solicitud.';
      setError(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a la lista
      </Link>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="border-b border-zinc-100 pb-4">
          <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
            Registrar Solicitud
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ingresa la información general de la solicitud y sus contactos adicionales.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-5">
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              1. Información General
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Fecha de Envío <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaEnvio}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaEnvio: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 shadow-2xs focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Marca <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Toyota, Dell..."
                  value={formData.marca}
                  onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 shadow-2xs focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Tipo de Solicitud <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.tipoSolicitud}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoSolicitud: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 shadow-2xs focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                >
                  {tipos.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-zinc-100 pt-5">
            <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              2. Contacto Principal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Nombre Completo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nombre y Apellidos"
                  value={formData.nombreContacto}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombreContacto: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 shadow-2xs focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Número Telefónico <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="Ej. 987654321"
                  value={formData.numeroContacto}
                  onChange={(e) => handleNumericInput('numeroContacto', e.target.value)}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 font-mono text-xs text-zinc-900 shadow-2xs focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder:text-zinc-400"
                />
                <p className="text-[11px] text-zinc-400 mt-1">Solo dígitos (bloqueo automático de letras).</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-zinc-100 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  3. Contactos Adicionales (Lista N)
                </h2>
                <p className="text-[11px] text-zinc-500">Se persisten en la tabla relacional de contactos.</p>
              </div>
              <button
                type="button"
                onClick={handleAddContacto}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 transition-colors"
              >
                <Plus className="h-3 w-3" />
                Agregar Contacto
              </button>
            </div>

            <div className="rounded-lg border border-zinc-200/80 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50/75 border-b border-zinc-200 text-zinc-500 font-medium">
                  <tr>
                    <th className="py-2 px-3 w-10">#</th>
                    <th className="py-2 px-3">Nombre</th>
                    <th className="py-2 px-3">Teléfono</th>
                    <th className="py-2 px-3 w-12 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {contactos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-zinc-400 text-xs">
                        Sin contactos adicionales. Usa el botón "Agregar Contacto" si necesitas añadir uno.
                      </td>
                    </tr>
                  ) : (
                    contactos.map((c, index) => (
                      <tr key={c.id}>
                        <td className="py-2 px-3 font-mono text-zinc-400">{index + 1}</td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="Nombre del contacto"
                            value={c.nombreContacto}
                            onChange={(e) => handleContactoChange(index, 'nombreContacto', e.target.value)}
                            className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder:text-zinc-400"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="999888777"
                            value={c.numeroContacto}
                            onChange={(e) => handleContactoChange(index, 'numeroContacto', e.target.value)}
                            className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 font-mono text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder:text-zinc-400"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveContacto(index)}
                            className="rounded p-1 text-zinc-400 hover:text-rose-600 transition-colors"
                            title="Eliminar fila"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-zinc-100 pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate('/')}
              className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? 'Guardando...' : 'Guardar Solicitud'}
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-lg text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">
                ¡Solicitud Registrada en la Base de Datos!
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                El backend reactivo autogeneró el siguiente código único:
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 font-mono text-base font-bold text-zinc-900">
              {codigoGenerado}
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => navigate('/')}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Ir a la Lista
              </button>
              <button
                onClick={() => navigate(`/solicitudes/${codigoGenerado}`)}
                className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Ver Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}