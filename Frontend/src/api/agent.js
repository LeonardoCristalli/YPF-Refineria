import axios from 'axios';

const agent = axios.create({
    baseURL: 'http://localhost:5033/api',
});

const responseBody = (response) => response.data;

const requests = {
    get: (url) => agent.get(url).then(responseBody),
    post: (url, body) => agent.post(url, body).then(responseBody),
    put: (url, body) => agent.put(url, body).then(responseBody),
    del: (url) => agent.delete(url).then(responseBody),
    patch: (url, body) => agent.patch(url, body).then(responseBody),
};

const createCrud = (endpoint) => ({
    list: () => requests.get(endpoint),
    details: (id) => requests.get(`${endpoint}/${id}`),
    create: (body) => requests.post(endpoint, body),
    update: (id, body) => requests.put(`${endpoint}/${id}`, body),
    delete: (id) => requests.del(`${endpoint}/${id}`),
});

const Vehiculos = createCrud('/Vehiculos');
const Conductores = createCrud('/Conductores');
const Productos = createCrud('/Productos');
const RazonesSociales = createCrud('/RazonesSociales');
const Basculas = createCrud('/Basculas');
const Usuarios = createCrud('/Usuarios');
const Tanques = createCrud('/Tanques');
const OrdenesTransporte = {
    ...createCrud('/OrdenesTransporte'),
    cancelar: (id, motivo) => requests.patch(`/OrdenesTransporte/${id}/cancelar`, { motivo }),
    byPatente: (patente) => requests.get(`/OrdenesTransporte/ByPatente/${patente}`),
};
const Planificaciones = createCrud('/Planificaciones');
const Ordenes = createCrud('/Ordenes');

const Pesadas = {
    list: () => requests.get('/Pesadas'),
    create: (pesada) => requests.post('/Pesadas', pesada),
    byPlanificacion: (id) => requests.get(`/Pesadas/ByPlanificacion/${id}`),
    byOrdenTransporte: (id) => requests.get(`/Pesadas/ByOrdenTransporte/${id}`),
    ticket: (idPlanificacion) => requests.get(`/Pesadas/Ticket/${idPlanificacion}`),
};

const Reportes = {
    duracionOrdenes: () => requests.get('/Reportes/duracion-ordenes'),
    ocupacionBasculas: () => requests.get('/Reportes/ocupacion-basculas'),
    kpis: () => requests.get('/Reportes/kpis'),
    movimientosPorPeriodo: (desde, hasta, idTipoOrden, replanificado) => {
        let q = [];
        if (desde) q.push(`desde=${encodeURIComponent(desde)}`);
        if (hasta) q.push(`hasta=${encodeURIComponent(hasta)}`);
        if (idTipoOrden) q.push(`idTipoOrden=${encodeURIComponent(idTipoOrden)}`);
        if (replanificado !== undefined) q.push(`replanificado=${replanificado}`);
        const qs = q.length > 0 ? `?${q.join('&')}` : '';
        return requests.get(`/Reportes/movimientos-por-periodo${qs}`);
    },
    movimientosPorProducto: (desde, hasta) => {
        let q = [];
        if (desde) q.push(`desde=${encodeURIComponent(desde)}`);
        if (hasta) q.push(`hasta=${encodeURIComponent(hasta)}`);
        const qs = q.length > 0 ? `?${q.join('&')}` : '';
        return requests.get(`/Reportes/movimientos-por-producto${qs}`);
    },
};

export default {
    Vehiculos,
    Conductores,
    Productos,
    RazonesSociales,
    Basculas,
    Usuarios,
    Tanques,
    OrdenesTransporte,
    Planificaciones,
    Ordenes,
    Pesadas,
    Reportes,
};

// Devuelve el mensaje de error que manda el backend (ProblemDetails.detail, texto plano
// o errores de validación); si no hay, usa el texto por defecto.
export const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (typeof data === 'string' && data) return data;
    if (data?.detail) return data.detail;
    if (data?.errors) return Object.values(data.errors).flat().join('\n');
    return fallback;
};