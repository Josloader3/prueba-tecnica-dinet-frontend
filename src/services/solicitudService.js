import api from './api';

export const solicitudService = {
  // GET /api/solicitudes (con filtros y ordenamiento en el servidor)
  listar: async ({ fecha, tipoSolicitud, sortBy, sortDirection } = {}) => {
    const params = {};
    if (fecha) params.fecha = fecha;
    if (tipoSolicitud && tipoSolicitud !== '') params.tipoSolicitud = tipoSolicitud;
    if (sortBy) params.sortBy = sortBy;
    if (sortDirection) params.sortDirection = sortDirection;

    const res = await api.get('/solicitudes', { params });
    return res.data;
  },

  // GET /api/solicitudes/codigo/{codigo}
  obtenerPorCodigo: async (codigo) => {
    const res = await api.get(`/solicitudes/codigo/${encodeURIComponent(codigo)}`);
    return res.data;
  },

  // POST /api/solicitudes
  crear: async (payload) => {
    const res = await api.post('/solicitudes', payload);
    return res.data;
  },

  // GET /api/solicitudes/tipos
  listarTipos: async () => {
    try {
      const res = await api.get('/solicitudes/tipos');
      return Array.isArray(res.data) && res.data.length > 0
        ? res.data
        : ['Cotización', 'Reclamo', 'Soporte Técnico', 'Garantía', 'Consulta Comercial'];
    } catch {
      return ['Cotización', 'Reclamo', 'Soporte Técnico', 'Garantía', 'Consulta Comercial'];
    }
  },

  // GET /api/solicitudes/export/csv (descarga directa de archivo en memoria)
  exportarCsv: async ({ fecha, tipoSolicitud } = {}) => {
    const params = {};
    if (fecha) params.fecha = fecha;
    if (tipoSolicitud && tipoSolicitud !== '') params.tipoSolicitud = tipoSolicitud;

    const res = await api.get('/solicitudes/export/csv', {
      params,
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fechaActual = new Date().toISOString().split('T')[0];
    link.download = `solicitudes_${fechaActual}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default solicitudService;