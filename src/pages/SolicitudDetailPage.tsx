import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Users } from 'lucide-react';

export default function SolicitudDetailPage() {
  const { codigo } = useParams();

  const mockDetalle = {
    codigo: codigo || 'SOL-20261108-1001',
    marca: 'Toyota del Perú',
    tipoSolicitud: 'Cotización',
    fechaEnvio: '2026-11-08',
    nombreContacto: 'Carlos Mendoza',
    numeroContacto: '987654321',
    fechaCreacion: '2026-11-08 09:30',
    contactos: [
      { id: 101, nombreContacto: 'Ana Ríos - Compras', numeroContacto: '912345678' },
      { id: 102, nombreContacto: 'Jorge Silva - Logística', numeroContacto: '923456789' }
    ]
  };

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
                {mockDetalle.codigo}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {mockDetalle.tipoSolicitud}
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-zinc-400">
            Registrado: <span className="font-medium text-zinc-600">{mockDetalle.fechaCreacion}</span>
          </div>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <dt className="text-zinc-400 font-medium">Marca</dt>
            <dd className="font-semibold text-zinc-900 mt-1">{mockDetalle.marca}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 font-medium">Fecha de Envío</dt>
            <dd className="font-medium text-zinc-800 mt-1">{mockDetalle.fechaEnvio}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 font-medium">Contacto Principal</dt>
            <dd className="font-medium text-zinc-800 mt-1">{mockDetalle.nombreContacto}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 font-medium">Teléfono</dt>
            <dd className="font-mono text-zinc-800 mt-1">{mockDetalle.numeroContacto}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-400" />
            <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Contactos Adicionales ({mockDetalle.contactos.length})
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
            {mockDetalle.contactos.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-zinc-400">
                  No hay contactos adicionales registrados para esta solicitud.
                </td>
              </tr>
            ) : (
              mockDetalle.contactos.map((c) => (
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