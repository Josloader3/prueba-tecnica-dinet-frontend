import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Plus, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink,
  Users
} from 'lucide-react';

const MOCK_SOLICITUDES = [
  {
    id: 1,
    codigo: 'SOL-20261108-1001',
    marca: 'Toyota del Perú',
    tipoSolicitud: 'Cotización',
    fechaEnvio: '2026-11-08',
    nombreContacto: 'Carlos Mendoza',
    numeroContacto: '987654321',
    fechaCreacion: '2026-11-08 09:30',
    contactosCount: 2
  },
  {
    id: 2,
    codigo: 'SOL-20261108-1002',
    marca: 'Dell Technologies',
    tipoSolicitud: 'Soporte Técnico',
    fechaEnvio: '2026-11-07',
    nombreContacto: 'Mariana Gómez',
    numeroContacto: '998877665',
    fechaCreacion: '2026-11-07 14:15',
    contactosCount: 1
  },
  {
    id: 3,
    codigo: 'SOL-20261108-1003',
    marca: 'HP Enterprise',
    tipoSolicitud: 'Reclamo',
    fechaEnvio: '2026-11-06',
    nombreContacto: 'Luis Alberto Ramos',
    numeroContacto: '945612378',
    fechaCreacion: '2026-11-06 11:00',
    contactosCount: 0
  }
];

export default function SolicitudesListPage() {
  const [solicitudes] = useState(MOCK_SOLICITUDES);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [sortField, setSortField] = useState('fechaEnvio');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-zinc-400" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-zinc-900 font-bold" /> 
      : <ArrowDown className="h-3 w-3 text-zinc-900 font-bold" />;
  };

  const renderBadgeTipo = (tipo) => {
    let dotColor = 'bg-zinc-500';
    if (tipo === 'Cotización') dotColor = 'bg-emerald-500';
    if (tipo === 'Soporte Técnico') dotColor = 'bg-blue-500';
    if (tipo === 'Reclamo') dotColor = 'bg-amber-500';

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        {tipo}
      </span>
    );
  };

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes
      .filter(s => {
        const coincideTipo = !filtroTipo || s.tipoSolicitud === filtroTipo;
        const coincideFecha = !filtroFecha || s.fechaEnvio === filtroFecha;
        return coincideTipo && coincideFecha;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [solicitudes, filtroTipo, filtroFecha, sortField, sortDirection]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-6 border-b border-zinc-100">
          <div>
            <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
              Solicitudes de Servicio
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Consulta general, ordenamiento interactivo y exportación de registros.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert('exportar!')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-zinc-500" />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-6 bg-zinc-50/50 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="h-8 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-700 shadow-2xs focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            >
              <option value="">Todos los tipos</option>
              <option value="Cotización">Cotización</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Garantía">Garantía</option>
              <option value="Consulta Comercial">Consulta Comercial</option>
            </select>

            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="h-8 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-700 shadow-2xs focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />

            {(filtroTipo || filtroFecha) && (
              <button
                onClick={() => { setFiltroTipo(''); setFiltroFecha(''); }}
                className="text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-4 px-1"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="text-xs text-zinc-500">
            Total: <span className="font-medium text-zinc-900">{solicitudesFiltradas.length}</span> registros
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50/75 text-xs font-medium text-zinc-500">
              <tr>
                <th 
                  onClick={() => handleSort('codigo')} 
                  className="py-3 px-4 sm:px-6 cursor-pointer select-none hover:text-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Código</span>
                    {renderSortIcon('codigo')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('marca')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Marca</span>
                    {renderSortIcon('marca')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('tipoSolicitud')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tipo</span>
                    {renderSortIcon('tipoSolicitud')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('fechaEnvio')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Fecha Envío</span>
                    {renderSortIcon('fechaEnvio')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('nombreContacto')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Contacto Principal</span>
                    {renderSortIcon('nombreContacto')}
                  </div>
                </th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4 text-center">Contactos</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {solicitudesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-zinc-500">
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                solicitudesFiltradas.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-medium">
                      <Link 
                        to={`/solicitudes/${s.codigo}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-zinc-900 hover:text-blue-600 transition-colors rounded-md bg-zinc-100/80 hover:bg-zinc-200/70 px-2 py-0.5 border border-zinc-200/80"
                      >
                        {s.codigo}
                        <ExternalLink className="h-3 w-3 text-zinc-400" />
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-zinc-900">{s.marca}</td>
                    <td className="py-3.5 px-4">{renderBadgeTipo(s.tipoSolicitud)}</td>
                    <td className="py-3.5 px-4 text-xs text-zinc-500">{s.fechaEnvio}</td>
                    <td className="py-3.5 px-4 text-xs text-zinc-800">{s.nombreContacto}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-zinc-500">{s.numeroContacto}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        <Users className="h-3 w-3 text-zinc-400" />
                        +{s.contactosCount}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 bg-white p-3.5 px-4 sm:px-6 text-xs text-zinc-500">
          <span>Mostrando {solicitudesFiltradas.length} de {solicitudes.length} solicitudes</span>
          <span>Orden: {sortField} ({sortDirection === 'asc' ? 'asc' : 'desc'})</span>
        </div>
      </div>
    </div>
  );
}