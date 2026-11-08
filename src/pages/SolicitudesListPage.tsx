import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Plus, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink,
  Users,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { solicitudService } from '../services/solicitudService';

export default function SolicitudesListPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar combo de tipos desde el backend
  useEffect(() => {
    solicitudService.listarTipos().then(setTipos);
  }, []);

  // Cargar listado de solicitudes desde el backend con filtros y orden
  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await solicitudService.listar({
        fecha: filtroFecha || undefined,
        tipoSolicitud: filtroTipo || undefined,
        sortBy: sortField,
        sortDirection: sortDirection,
      });
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al listar solicitudes:', err);
      setError('No se pudo conectar con el servidor (puerto 8080). Verifica que el backend esté iniciado.');
    } finally {
      setLoading(false);
    }
  }, [filtroFecha, filtroTipo, sortField, sortDirection]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCsv = async () => {
    setDownloading(true);
    try {
      await solicitudService.exportarCsv({
        fecha: filtroFecha || undefined,
        tipoSolicitud: filtroTipo || undefined,
      });
    } catch (err) {
      alert('Error al descargar el archivo CSV. Verifica la conexión con el servidor.');
    } finally {
      setDownloading(false);
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

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-xs overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-6 border-b border-zinc-100">
          <div>
            <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
              Solicitudes de Servicio
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Consulta general, ordenamiento en base de datos y exportación de registros.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCsv}
              disabled={downloading || solicitudes.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 transition-colors"
            >
              {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5 text-zinc-500" />}
              {downloading ? 'Generando...' : 'Exportar CSV'}
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
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
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
            Total: <span className="font-medium text-zinc-900">{solicitudes.length}</span> registros
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-zinc-500">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-400 mb-2" />
                    Cargando solicitudes desde el servidor reactivo...
                  </td>
                </tr>
              ) : solicitudes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-zinc-500">
                    No se encontraron solicitudes registradas en la base de datos.
                  </td>
                </tr>
              ) : (
                solicitudes.map((s) => (
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
                        +{s.contactos?.length || 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 bg-white p-3.5 px-4 sm:px-6 text-xs text-zinc-500">
          <span>Mostrando {solicitudes.length} registros</span>
          <span>Orden: {sortField} ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})</span>
        </div>
      </div>
    </div>
  );
}