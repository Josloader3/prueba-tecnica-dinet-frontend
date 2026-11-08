import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Users, Loader2, AlertCircle } from 'lucide-react';
import { solicitudService } from '../services/solicitudService';

export default function SolicitudDetailPage() {
  const { codigo } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!codigo) return;
    setLoading(true);
    setError(null);
    solicitudService.obtenerPorCodigo(codigo)
      .then(data => setSolicitud(data))
      .catch(err => {
        console.error('Error al obtener detalle:', err);
        setError('No se pudo encontrar la solicitud o el backend no responde.');
      })
      .finally(() => setLoading(false));
  }, [codigo]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-xs text-zinc-500">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-400 mb-2" />
        Consultando información de la solicitud...
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la lista
        </Link>
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error || 'Solicitud no encontrada'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la lista
        </Link>
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 print:hidden transition-colors"
        >
          <Printer className="h-3.5 w-3.5 text-zinc-500" />
          Imprimir
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Solicitud de Servicio
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="font-mono text-xl font-bold text-zinc-900">
                {solicitud.codigo}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {solicitud.tipoSolicitud}
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-zinc-400">
            Registrado: <span className="font-medium text-zinc-600">{solicitud.fechaCreacion || '-'}</span>
          </div>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <dt className="text-zinc-400 font-medium">Marca</dt>
            <dd className="font-semibold text-zinc-900 mt-1">{solicitud.marca}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 font-medium">Fecha de Envío</dt>
            <dd className="font-medium text-zinc-800 mt-1">{solicitud.fechaEnvio}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 font-medium">Contacto Principal</dt>
            <dd className="font-medium text-zinc-800 mt-1">{solicitud.nombreContacto}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 font-medium">Teléfono</dt>
            <dd className="font-mono text-zinc-800 mt-1">{solicitud.numeroContacto}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-400" />
            <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Contactos Adicionales ({solicitud.contactos?.length || 0})
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400">Tabla relacional independiente</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/75 border-b border-zinc-200 text-zinc-500 font-medium">
            <tr>
              <th className="py-2.5 px-4 w-16">ID</th>
              <th className="py-2.5 px-4">Nombre Completo</th>
              <th className="py-2.5 px-4">Teléfono</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {!solicitud.contactos || solicitud.contactos.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-zinc-400">
                  No hay contactos adicionales registrados para esta solicitud.
                </td>
              </tr>
            ) : (
              solicitud.contactos.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-zinc-400">#{c.id}</td>
                  <td className="py-3 px-4 font-medium text-zinc-900">{c.nombreContacto}</td>
                  <td className="py-3 px-4 font-mono text-zinc-600">{c.numeroContacto}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}