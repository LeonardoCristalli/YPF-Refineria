import React, { useState, useEffect } from 'react';
import {
    BarChart2, Clock, Scale, TrendingUp, AlertCircle,
    CheckCircle2, Loader2, RefreshCw, Download
} from 'lucide-react';
import agent from '../../api/agent';

// ─────────── Sub-componentes ───────────

const KpiCard = ({ title, value, unit, subtitle, icon: Icon, color, loading }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        {loading ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg mt-2" />
        ) : (
            <h3 className="text-3xl font-bold mt-1 text-slate-800">
                {value} <span className="text-lg font-semibold text-slate-400">{unit}</span>
            </h3>
        )}
        {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
    </div>
);

const DistBar = ({ rango, cantidad, max }) => {
    const pct = max > 0 ? (cantidad / max) * 100 : 0;
    return (
        <div className="flex items-center gap-3 group">
            <span className="text-xs font-bold text-slate-500 w-24 shrink-0">{rango}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs font-bold text-slate-700 w-6 text-right">{cantidad}</span>
        </div>
    );
};

// ─────────── Página principal ───────────

const ReportesPage = () => {
    const [duracion, setDuracion] = useState(null);
    const [ocupacion, setOcupacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const load = async () => {
        setLoading(true);
        try {
            const [dur, ocu] = await Promise.all([
                agent.Reportes.duracionOrdenes(),
                agent.Reportes.ocupacionBasculas(),
            ]);
            setDuracion(dur);
            setOcupacion(ocu);
        } catch (e) {
            console.error('Error loading reportes', e);
        } finally {
            setLoading(false);
            setLastRefresh(new Date());
        }
    };

    useEffect(() => { load(); }, []);

    const maxDist = duracion
        ? Math.max(...(duracion.distribucion ?? []).map(d => d.cantidad), 1)
        : 1;

    const maxBasculas = ocupacion
        ? Math.max(...(ocupacion.basculas ?? []).map(b => b.totalPesadas), 1)
        : 1;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Reportes & Métricas</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Análisis operativo · Actualizado: {lastRefresh.toLocaleTimeString('es-AR')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={load}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Actualizar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                        <Download size={16} />
                        Exportar
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <KpiCard
                    title="Duración Promedio OT"
                    value={loading ? '—' : (duracion?.promedioMinutos ?? '0')}
                    unit="min"
                    subtitle="Desde primera hasta última pesada"
                    icon={Clock}
                    color="bg-blue-600"
                    loading={loading}
                />
                <KpiCard
                    title="Órdenes Completadas"
                    value={loading ? '—' : (duracion?.totalOrdenesCompletadas ?? 0)}
                    unit="OTs"
                    subtitle="Con 2 pesadas registradas"
                    icon={CheckCircle2}
                    color="bg-emerald-600"
                    loading={loading}
                />
                <KpiCard
                    title="Total Pesadas"
                    value={loading ? '—' : (ocupacion?.totalPesadas ?? 0)}
                    unit="pes."
                    subtitle="Acumulado histórico"
                    icon={Scale}
                    color="bg-purple-600"
                    loading={loading}
                />
                <KpiCard
                    title="Básculas Activas"
                    value={loading ? '—' : (ocupacion?.basculas?.length ?? 0)}
                    unit="disp."
                    subtitle="Con registros de pesaje"
                    icon={BarChart2}
                    color="bg-orange-500"
                    loading={loading}
                />
            </div>

            {/* Main charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* CU82 – Distribución de duración de OTs */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800">Duración de Órdenes de Transporte</h3>
                            <p className="text-xs text-slate-400 mt-1">CU82 · Tiempo entre primera y última pesada</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Clock size={18} className="text-blue-600" />
                        </div>
                    </div>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-4 bg-slate-100 rounded-full animate-pulse w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(duracion?.distribucion ?? []).map((d, i) => (
                                <DistBar key={i} rango={d.rango} cantidad={d.cantidad} max={maxDist} />
                            ))}
                            {(duracion?.distribucion ?? []).every(d => d.cantidad === 0) && (
                                <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
                                    <AlertCircle size={36} className="opacity-20" />
                                    <p className="text-sm font-medium">Sin datos suficientes aún</p>
                                    <p className="text-xs text-center">Registre al menos 2 pesadas por OT para ver estadísticas</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CU83 – Ocupación por báscula */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800">Ocupación por Báscula</h3>
                            <p className="text-xs text-slate-400 mt-1">CU83 · Frecuencia de uso por dispositivo</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <BarChart2 size={18} className="text-purple-600" />
                        </div>
                    </div>
                    {loading ? (
                        <div className="space-y-5">
                            {[1, 2].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3" />
                                    <div className="h-4 bg-slate-100 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (ocupacion?.basculas?.length === 0 || !ocupacion?.basculas) ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
                            <Scale size={36} className="opacity-20" />
                            <p className="text-sm font-medium">Sin datos de pesaje aún</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {(ocupacion?.basculas ?? []).map((b, i) => {
                                const pct = maxBasculas > 0 ? (b.totalPesadas / maxBasculas) * 100 : 0;
                                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500'];
                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-700">{b.nombre}</span>
                                            <span className="text-slate-500">{b.totalPesadas} pesadas · {b.porcentaje}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                            <div
                                                className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-700`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        {b.ultimaPesada && (
                                            <p className="text-[10px] text-slate-400">
                                                Último uso: {new Date(b.ultimaPesada).toLocaleString('es-AR')}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail table – Recent OTs with duration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-800">Detalle de Órdenes de Transporte</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Duración registrada por OT · CU82</p>
                    </div>
                    <TrendingUp size={18} className="text-slate-400" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-slate-50/70 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold">ID OT</th>
                                <th className="px-6 py-4 font-bold">Producto</th>
                                <th className="px-6 py-4 font-bold">Vehículo</th>
                                <th className="px-6 py-4 font-bold">Pesadas</th>
                                <th className="px-6 py-4 font-bold">Duración</th>
                                <th className="px-6 py-4 font-bold">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-5">
                                            <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                        </td>
                                    </tr>
                                ))
                            ) : (duracion?.ordenes?.length === 0 || !duracion?.ordenes) ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <AlertCircle size={36} className="opacity-20" />
                                            <p className="font-medium text-sm">No hay órdenes con pesajes registrados</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                duracion.ordenes.map((o, i) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-500 text-sm">OT-{o.idOrdenTransporte}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{o.producto}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{o.patente}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold ${o.nroPesadas >= 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {o.nroPesadas} pesada{o.nroPesadas !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                            {o.duracionMinutos != null ? `${o.duracionMinutos} min` : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {o.estado === 'Completada'
                                                    ? <CheckCircle2 size={14} className="text-emerald-500" />
                                                    : <Loader2 size={14} className="text-amber-500 animate-spin" />
                                                }
                                                <span className="text-xs font-bold text-slate-600">{o.estado}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportesPage;
