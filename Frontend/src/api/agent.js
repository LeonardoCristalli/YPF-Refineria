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
const OrdenesTransporte = createCrud('/OrdenesTransporte');
const Planificaciones = createCrud('/Planificaciones');

const Pesadas = {
    list: () => requests.get('/Pesadas'),
    create: (pesada) => requests.post('/Pesadas', pesada),
    byPlanificacion: (id) => requests.get(`/Pesadas/ByPlanificacion/${id}`),
    byOrdenTransporte: (id) => requests.get(`/Pesadas/ByOrdenTransporte/${id}`),
};

export default {
    Vehiculos,
    Conductores,
    Productos,
    RazonesSociales,
    Basculas,
    Usuarios,
    OrdenesTransporte,
    Planificaciones,
    Pesadas,
};
