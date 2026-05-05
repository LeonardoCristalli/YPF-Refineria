import React, { useState, useEffect } from 'react';
import {
    Scale, CheckCircle2, Loader2, AlertCircle,
    Clock, Truck, Plus, Search, Eye, X, Save
} from 'lucide-react';
import agent from '../../api/agent';

// ─────────── Modal: Registrar Pesada ───────────
const RegistrarPesadaModal = ({ isOpen, onClose, onSuccess }) => {
    const [planificaciones, setPlanificaciones] = useState([]);
    const [basculas, setBasculas] = useState([]);
    const [formData, setFormData] = useState({
        Id_Planificacion: '',
        Cantidad: '',
        ID_Bascula: '1',
        EsIngresoManual: false,
        MotivoIngresoManual: '',
    });
    const [loading, setLoading] = useState(false);
    const [loadingOpts, setLoadingOpts] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoadingOpts(true);
            Promise.all([
                agent.Planificaciones.list(),
                agent.Basculas.list(),
            ]).then(([plans, bascs]) => {
                setPlanificaciones(plans);
                setBasculas(bascs);
            }).catch(console.error).finally(() => setLoadingOpts(false));

            setFormData({ Id_Planificacion: '', Cantidad: '', ID_Bascula: '1', EsIngresoManual: false, MotivoIngresoManual: '' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await agent.Pesadas.create({
                Id_Planificacion: parseInt(formData.Id_Planificacion),
                Cantidad: parseFloat(formData.Cantidad),
                ID_Bascula: parseInt(formData.ID_Bascula),
                EsIngresoManual: formData.EsIngresoManual,
                MotivoIngresoManual: formData.MotivoIngresoManual,
                id_TipoPesada: 1,
                fecha: new Date().toISOString(),
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error al registrar la pesada. ' + (err.response?.data || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-linear-to-r from-blue-700 to-blue-600 px-6 py-5 flex justify-between items-center rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl"><Scale size={20} className="text-white" /></div>
                        <h3 className="text-lg font-bold text-white">Registrar Pesada</h3>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        <X size={22} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Orden de Transporte (Planificación)
                        </label>
                        <select
                            name="Id_Planificacion"
                            value={formData.Id_Planificacion}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                            required
                            disabled={loadingOpts}
                        >
                            <option value="">Seleccione una Orden...</option>
                            {planificaciones.map(p => {
                                const prod = p.ordenTransporte?.ordenDetalle?.producto?.descripcion || 'Producto';
                                const pat = p.ordenTransporte?.vehiculo?.patenteChasis || 'Vehículo';
                                return (
                                    <option key={p.id_Planificacion} value={p.id_Planificacion}>
                                        OT #{p.id_OrdenTransporte} — {prod} ({pat}) — {p.cantidadPlanificada} KG
                                    </option>
                                );
                            })}
                        </select>
                        {!loadingOpts && planificaciones.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} /> No hay órdenes activas.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Peso (kg)</label>
                            <input
                                type="number"
                                name="Cantidad"
                                step="0.01"
                                value={formData.Cantidad}
                                onChange={handleChange}
                                placeholder="Ej: 24500"
                                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Báscula</label>
                            <select
                                name="ID_Bascula"
                                value={formData.ID_Bascula}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none"
                            >
                                {basculas.length > 0
                                    ? basculas.map(b => (
                                        <option key={b.id_Bascula} value={b.id_Bascula}>
                                            {b.descripcion || `Báscula #${b.id_Bascula}`}
                                        </option>
                                    ))
                                    : <option value="1">Báscula #01 (default)</option>
                                }
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="EsIngresoManual"
                            id="chkManual"
                            checked={formData.EsIngresoManual}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                        />
                        <label htmlFor="chkManual" className="text-sm font-semibold text-slate-700">Ingreso Manual</label>
                    </div>

                    {formData.EsIngresoManual && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Motivo</label>
                            <textarea
                                name="MotivoIngresoManual"
                                value={formData.MotivoIngresoManual}
                                onChange={handleChange}
                                rows={2}
                                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none resize-none"
                                placeholder="Motivo del ingreso manual..."
                            />
                        </div>
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
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {loading ? 'Registrando...' : 'Registrar Peso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─────────── Página principal ───────────

const PesadasPage = () => {
    const [pesadas, setPesadas] = useState([]);
    const [planificaciones, setPlanificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const [pes, plans] = await Promise.all([
                agent.Pesadas.list(),
                agent.Planificaciones.list(),
            ]);
            setPesadas(pes);
            setPlanificaciones(plans);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const getPlanInfo = (idPlan) => {
        const p = planificaciones.find(pl => pl.id_Planificacion === idPlan);
        if (!p) return { producto: 'N/A', patente: 'N/A' };
        return {
            producto: p.ordenTransporte?.ordenDetalle?.producto?.descripcion ?? 'N/A',
            patente: p.ordenTransporte?.vehiculo?.patenteChasis ?? 'N/A',
        };
    };

    const filtered = pesadas.filter(p => {
        const info = getPlanInfo(p.id_Planificacion);
        const q = search.toLowerCase();
        return (
            String(p.id_Pesada).includes(q) ||
            info.producto.toLowerCase().includes(q) ||
            info.patente.toLowerCase().includes(q)
        );
    });

    const tipoBadge = (tipo) => {
        if (tipo === 1) return <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600">TARA</span>;
        return <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-700">BRUTO</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestión de Pesadas</h2>
                    <p className="text-slate-500 text-sm mt-0.5">CU78 · {pesadas.length} registro{pesadas.length !== 1 ? 's' : ''} en total</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> Nueva Pesada
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Buscar por producto, patente o ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-slate-50/70 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold">ID Pesada</th>
                                <th className="px-6 py-4 font-bold">OT</th>
                                <th className="px-6 py-4 font-bold">Producto</th>
                                <th className="px-6 py-4 font-bold">Vehículo</th>
                                <th className="px-6 py-4 font-bold">Tipo</th>
                                <th className="px-6 py-4 font-bold">Peso (kg)</th>
                                <th className="px-6 py-4 font-bold">Báscula</th>
                                <th className="px-6 py-4 font-bold">Fecha / Hora</th>
                                <th className="px-6 py-4 font-bold">Modo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={9} className="px-6 py-5">
                                            <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                        </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Scale size={36} className="opacity-20" />
                                            <p className="font-medium text-sm">No se encontraron pesadas</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(p => {
                                    const { producto, patente } = getPlanInfo(p.id_Planificacion);
                                    return (
                                        <tr key={p.id_Pesada} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-500 text-sm">#{p.id_Pesada}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-50 rounded-lg">
                                                        <Truck size={14} className="text-blue-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">
                                                        OT #{p.id_Planificacion}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{producto}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{patente}</td>
                                            <td className="px-6 py-4">{tipoBadge(p.id_TipoPesada)}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-800 text-sm">
                                                    {p.cantidad?.toLocaleString('es-AR')} kg
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                    <span className="text-xs font-bold text-slate-600">
                                                        #{p.iD_Bascula ?? p.id_Bascula ?? '?'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                                {p.fecha ? new Date(p.fecha).toLocaleString('es-AR') : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.esIngresoManual
                                                    ? <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700">MANUAL</span>
                                                    : <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700">AUTO</span>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RegistrarPesadaModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={load}
            />
        </div>
    );
};

export default PesadasPage;
