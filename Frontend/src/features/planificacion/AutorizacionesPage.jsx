import React, { useState, useEffect } from 'react';
import {
    Plus, Search, FileText, Filter, Calendar, ChevronDown,
    CheckCircle2, X, Save, Loader2, AlertCircle, Clock
} from 'lucide-react';
import agent from '../../api/agent';

// ─────────── Modal Nueva Autorización / Entrega ───────────
const NuevaOrdenModal = ({ isOpen, onClose, onSuccess, tipoOrden }) => {
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [transportistas, setTransportistas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingOpts, setLoadingOpts] = useState(true);

    const [formData, setFormData] = useState({
        id_Producto: '',
        id_RazonSocialCliente: '',
        id_RazonSocialTransportista: '',
        id_Vehiculo: '',
        id_Conductor: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (isOpen) {
            setLoadingOpts(true);
            setFormData({
                id_Producto: '', id_RazonSocialCliente: '', id_RazonSocialTransportista: '',
                id_Vehiculo: '', id_Conductor: '', cantidad: '',
                fecha: new Date().toISOString().split('T')[0],
            });
            Promise.all([
                agent.Productos.list(),
                agent.RazonesSociales.list(),
                agent.Vehiculos.list(),
                agent.Conductores.list(),
            ]).then(([prods, razons, vehs, conds]) => {
                setProductos(prods);
                setClientes(razons);
                setTransportistas(razons.filter(r => r.esTransportista));
                setVehiculos(vehs);
                setConductores(conds);
            }).catch(console.error).finally(() => setLoadingOpts(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                id_Producto: parseInt(formData.id_Producto),
                id_RazonSocialCliente: parseInt(formData.id_RazonSocialCliente),
                id_RazonSocialTransportista: parseInt(formData.id_RazonSocialTransportista),
                id_Vehiculo: parseInt(formData.id_Vehiculo),
                id_Conductor: parseInt(formData.id_Conductor),
                cantidad: parseFloat(formData.cantidad),
                fecha: new Date(formData.fecha).toISOString(),
            };
            await agent.OrdenesTransporte.create(payload);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error al guardar la orden. ' + (err.response?.data || err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const esDescarga = tipoOrden === 'descarga';
    const titulo = esDescarga ? 'Nueva Autorización de Descarga' : 'Nueva Orden de Entrega';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                <div className={`px-6 py-5 flex justify-between items-center rounded-t-2xl sticky top-0 ${esDescarga ? 'bg-linear-to-r from-blue-700 to-blue-600' : 'bg-linear-to-r from-emerald-700 to-emerald-600'}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <FileText size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{titulo}</h3>
                            <p className="text-xs text-white/60">{esDescarga ? 'CU61 · Recepción de Crudo' : 'CU66 · Despacho de Refinados'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Fecha */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                <Calendar size={13} className="inline mr-1" />Fecha Planificada
                            </label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                                required
                            />
                        </div>
                        {/* Cantidad */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cantidad (KG)</label>
                            <input
                                type="number"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                placeholder="Ej: 30000"
                                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Producto */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Producto / Material</label>
                        <select
                            name="id_Producto"
                            value={formData.id_Producto}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                            required
                            disabled={loadingOpts}
                        >
                            <option value="">Seleccione Producto...</option>
                            {productos.map(p => (
                                <option key={p.id_Producto} value={p.id_Producto}>{p.descripcion}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Cliente / Proveedor */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                {esDescarga ? 'Proveedor (Origen)' : 'Cliente (Destino)'}
                            </label>
                            <select
                                name="id_RazonSocialCliente"
                                value={formData.id_RazonSocialCliente}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                                required
                                disabled={loadingOpts}
                            >
                                <option value="">Seleccione...</option>
                                {clientes.map(c => (
                                    <option key={c.id_RazonSocial} value={c.id_RazonSocial}>{c.descripcion}</option>
                                ))}
                            </select>
                        </div>
                        {/* Transportista */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transportista</label>
                            <select
                                name="id_RazonSocialTransportista"
                                value={formData.id_RazonSocialTransportista}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                                required
                                disabled={loadingOpts}
                            >
                                <option value="">Seleccione Transportista...</option>
                                {(transportistas.length > 0 ? transportistas : clientes).map(t => (
                                    <option key={t.id_RazonSocial} value={t.id_RazonSocial}>{t.descripcion}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Vehículo */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vehículo (Chasis)</label>
                            <select
                                name="id_Vehiculo"
                                value={formData.id_Vehiculo}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                                required
                                disabled={loadingOpts}
                            >
                                <option value="">Seleccione Vehículo...</option>
                                {vehiculos.map(v => (
                                    <option key={v.id_Vehiculo} value={v.id_Vehiculo}>{v.patenteChasis}</option>
                                ))}
                            </select>
                        </div>
                        {/* Conductor */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Conductor</label>
                            <select
                                name="id_Conductor"
                                value={formData.id_Conductor}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                                required
                                disabled={loadingOpts}
                            >
                                <option value="">Seleccione Conductor...</option>
                                {conductores.map(c => (
                                    <option key={c.id_Conductor} value={c.id_Conductor}>{c.apellido}, {c.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loadingOpts && (
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" /> Cargando opciones...
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || loadingOpts}
                            className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 ${esDescarga ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'}`}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {loading ? 'Guardando...' : `Crear ${esDescarga ? 'Autorización' : 'Entrega'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─────────── Página principal ───────────
const AutorizacionesPage = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('descarga');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const load = () => {
        setLoading(true);
        agent.OrdenesTransporte.list()
            .then(data => { setOrdenes(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const filtered = ordenes.filter(o => {
        const matchTab = tab === 'descarga' ? o.ordenDetalle?.orden?.id_TipoOrden === 1 : o.ordenDetalle?.orden?.id_TipoOrden === 2;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (o.ordenDetalle?.producto?.descripcion ?? '').toLowerCase().includes(q) ||
            (o.razonSocialTransportista?.descripcion ?? '').toLowerCase().includes(q) ||
            String(o.id_OrdenTransporte).includes(q);
        return matchSearch; // show all if tabs don't filter well yet (tipo orden not always loaded)
    });

    const getEstadoBadge = (o) => {
        const pesadasCount = 0; // Would need pesadas data for full logic
        return (
            <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-600">Planificada</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Planificación Logística</h2>
                    <p className="text-slate-500 text-sm">Autorizaciones de Descarga (CU61) · Órdenes de Entrega (CU66)</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Nueva {tab === 'descarga' ? 'Autorización' : 'Entrega'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 max-w-md">
                <button
                    onClick={() => setTab('descarga')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'descarga' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Autorizaciones (Crudo)
                </button>
                <button
                    onClick={() => setTab('despacho')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'despacho' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Entregas (Refinados)
                </button>
            </div>

            {/* Table card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, producto o ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                            <Filter size={20} />
                        </button>
                        <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-bold">
                            <Calendar size={18} /> Período <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-slate-50/50">
                                <th className="px-8 py-4 font-bold">ID / Orden</th>
                                <th className="px-8 py-4 font-bold">Producto</th>
                                <th className="px-8 py-4 font-bold">Transportista</th>
                                <th className="px-8 py-4 font-bold">Vehículo</th>
                                <th className="px-8 py-4 font-bold">Cantidad</th>
                                <th className="px-8 py-4 font-bold">Estado</th>
                                <th className="px-8 py-4 font-bold">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-8 py-6 h-16 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-3">
                                            <FileText size={48} className="opacity-10" />
                                            <p>No se encontraron registros.</p>
                                            <button
                                                onClick={() => setModalOpen(true)}
                                                className="text-blue-600 text-sm font-bold hover:underline"
                                            >
                                                → Crear nueva {tab === 'descarga' ? 'autorización' : 'entrega'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id_OrdenTransporte} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-700 text-sm">OT-{item.id_OrdenTransporte}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">PLAN ID: {item.id_OrdenDetalle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter">
                                                {item.ordenDetalle?.producto?.descripcion || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-slate-700">
                                            {item.razonSocialTransportista?.descripcion || 'N/A'}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-800">
                                            {item.vehiculo?.patenteChasis || 'N/A'}
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-800 text-sm">
                                            {item.ordenDetalle?.peso
                                                ? `${Number(item.ordenDetalle.peso).toLocaleString('es-AR')} KG`
                                                : '—'}
                                        </td>
                                        <td className="px-8 py-5">{getEstadoBadge(item)}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Clock size={12} />
                                                {item.ordenDetalle?.orden?.fechaPlanificacion
                                                    ? new Date(item.ordenDetalle.orden.fechaPlanificacion).toLocaleDateString('es-AR')
                                                    : '—'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <NuevaOrdenModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={load}
                tipoOrden={tab}
            />
        </div>
    );
};

export default AutorizacionesPage;
