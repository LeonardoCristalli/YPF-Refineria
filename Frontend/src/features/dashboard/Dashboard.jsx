import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowUpRight, ArrowDownRight, Activity, Clock, Scale, Truck,
    AlertTriangle, CheckCircle2, FileText, Users, BarChart2, Loader2
} from 'lucide-react';
import agent from '../../api/agent';

const StatCard = ({ title, value, subValue, icon: Icon, trend, color, to }) => {
    const content = (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} text-white`}>
                    <Icon size={24} />
                </div>
                {trend != null && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">{value}</h3>
                {subValue && <p className="text-slate-400 text-xs mt-1">{subValue}</p>}
            </div>
        </div>
    );
    return to ? <Link to={to}>{content}</Link> : content;
};

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);
    const [pesadas, setPesadas] = useState([]);
    const [planificaciones, setPlanificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [kpi, pes, plans] = await Promise.all([
                    agent.Reportes.kpis(),
                    agent.Pesadas.list(),
                    agent.Planificaciones.list(),
                ]);
                setKpis(kpi);
                // Show last 5 pesadas
                setPesadas(pes.slice(-5).reverse());
                setPlanificaciones(plans);
            } catch (e) {
                console.error('Dashboard load error', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const getPlanInfo = (idPlan) => {
        const p = planificaciones.find(pl => pl.id_Planificacion === idPlan);
        if (!p) return { producto: 'N/A', patente: 'N/A' };
        return {
            producto: p.ordenTransporte?.ordenDetalle?.producto?.descripcion ?? 'N/A',
            patente: p.ordenTransporte?.vehiculo?.patenteChasis ?? 'N/A',
        };
    };

    return (
        <div className="space-y-8">
            {/* Title row */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Panel de Control</h2>
                    <p className="text-slate-500 mt-1">Resumen operativo de la Refinería — Planta La Plata</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2 text-blue-700 text-sm font-bold">
                    <Activity size={16} className="animate-pulse" />
                    SISTEMA ONLINE
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pesajes Hoy"
                    value={loading ? <Loader2 size={20} className="animate-spin text-slate-400" /> : kpis?.pesadasHoy ?? 0}
                    subValue="Registros del día actual"
                    icon={Scale}
                    trend={null}
                    color="bg-blue-500"
                    to="/pesadas"
                />
                <StatCard
                    title="Órdenes de Transporte"
                    value={loading ? <Loader2 size={20} className="animate-spin text-slate-400" /> : kpis?.totalOTs ?? 0}
                    subValue="Logística CILP"
                    icon={Truck}
                    trend={null}
                    color="bg-purple-500"
                    to="/ordenes-transporte"
                />
                <StatCard
                    title="Tonelaje Hoy"
                    value={loading ? <Loader2 size={20} className="animate-spin text-slate-400" /> : `${kpis?.tonelajeHoy ?? 0} t`}
                    subValue="Acumulado diario en toneladas"
                    icon={Activity}
                    trend={null}
                    color="bg-orange-500"
                    to="/pesadas"
                />
                <StatCard
                    title="Conductores Activos"
                    value={loading ? <Loader2 size={20} className="animate-spin text-slate-400" /> : kpis?.totalConductores ?? 0}
                    subValue="Habilitados en el sistema"
                    icon={Users}
                    color="bg-emerald-500"
                    to="/conductores"
                />
            </div>

            {/* Main content row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent pesadas table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-800">Actividad de Pesaje Reciente</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Últimas 5 pesadas registradas</p>
                        </div>
                        <Link to="/pesadas" className="text-blue-600 text-xs font-bold hover:underline">Ver todo</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[11px] uppercase tracking-wider bg-slate-50/50">
                                    <th className="px-6 py-4 font-bold">Vehículo</th>
                                    <th className="px-6 py-4 font-bold">Producto</th>
                                    <th className="px-6 py-4 font-bold">Peso</th>
                                    <th className="px-6 py-4 font-bold">Tipo</th>
                                    <th className="px-6 py-4 font-bold">Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-5">
                                                <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                            </td>
                                        </tr>
                                    ))
                                ) : pesadas.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                            No hay pesadas registradas aún.
                                            <Link to="/pesadas" className="block text-blue-500 mt-1 font-bold text-xs">→ Registrar primera pesada</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    pesadas.map((row, i) => {
                                        const { producto, patente } = getPlanInfo(row.id_Planificacion);
                                        return (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
                                                            {patente.substring(0, 2)}
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700">{patente}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{producto}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                                    {row.cantidad?.toLocaleString('es-AR')} kg
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${row.id_TipoPesada === 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {row.id_TipoPesada === 2 ? 'BRUTO' : 'TARA'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                                    {row.fecha ? new Date(row.fecha).toLocaleTimeString('es-AR') : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Hardware status */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-sm text-blue-400 uppercase tracking-widest mb-1">Estado de Hardware</h3>
                            <p className="text-2xl font-bold mb-4">Básculas Operativas</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Báscula #01 (Norte)</span>
                                    <span className="text-green-400 font-bold flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> ONLINE
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Báscula #02 (Sur)</span>
                                    <span className="text-green-400 font-bold flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> ONLINE
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">OCR Camera A1</span>
                                    <span className="text-amber-400 font-bold flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> CALIBRANDO
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                    </div>

                    {/* Quick access */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Accesos Rápidos</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/pesadas" className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Scale size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Nueva Pesada</span>
                            </Link>
                            <Link to="/ordenes-transporte" className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Truck size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Órdenes OT</span>
                            </Link>
                            <Link to="/planificacion" className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <FileText size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Planificación</span>
                            </Link>
                            <Link to="/reportes" className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <BarChart2 size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Reportes</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
