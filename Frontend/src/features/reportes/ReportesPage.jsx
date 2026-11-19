import React, { useState, useEffect } from 'react';
import {
    BarChart2, Clock, Scale, TrendingUp, AlertCircle,
    CheckCircle2, Loader2, RefreshCw, Download, Calendar,
    ChevronDown, Filter, Package, ArrowUpRight
} from 'lucide-react';
import agent, { getErrorMessage } from '../../api/agent';

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
    const [tab, setTab] = useState('general'); // 'general' | 'periodos' | 'productos'
    const [duracion, setDuracion] = useState(null);
    const [ocupacion, setOcupacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Estados para CU080 y CU081 (filtros de fecha)
    // Fechas en hora local (toISOString() usa UTC y se adelanta un día de noche en Argentina)
    const aFechaLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const hoyStr = aFechaLocal(new Date());
    const unMesAtrasStr = aFechaLocal(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const [fechaDesde, setFechaDesde] = useState(unMesAtrasStr);
    const [fechaHasta, setFechaHasta] = useState(hoyStr);
    const [tipoMovimiento, setTipoMovimiento] = useState(''); // '' | '1' | '2'
    const [replanificado, setReplanificado] = useState(''); // '' | 'si' | 'no'

    const [movPeriodo, setMovPeriodo] = useState(null);
    const [loadingPeriodo, setLoadingPeriodo] = useState(false);

    const [movProducto, setMovProducto] = useState(null);
    const [loadingProducto, setLoadingProducto] = useState(false);

    const loadGeneral = async () => {
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

    const loadPeriodo = async () => {
        // CU080-RN02: Desde debe ser menor o igual a Hasta
        if (!fechaDesde || !fechaHasta) {
            alert('Las fechas Desde y Hasta son obligatorias.');
            return;
        }
        if (fechaDesde > fechaHasta) {
            alert('La fecha Desde debe ser menor o igual a la fecha Hasta.');
            return;
        }
        setLoadingPeriodo(true);
        try {
            const data = await agent.Reportes.movimientosPorPeriodo(
                fechaDesde,
                fechaHasta,
                tipoMovimiento ? Number(tipoMovimiento) : undefined,
                replanificado === '' ? undefined : replanificado === 'si'
            );
            setMovPeriodo(data);
        } catch (e) {
            console.error('Error loading movimientos por período', e);
            alert(getErrorMessage(e, 'No se pudo generar el reporte.'));
        } finally {
            setLoadingPeriodo(false);
        }
    };

    const loadProducto = async () => {
        setLoadingProducto(true);
        try {
            const data = await agent.Reportes.movimientosPorProducto(fechaDesde, fechaHasta);
            setMovProducto(data);
        } catch (e) {
            console.error('Error loading movimientos por producto', e);
        } finally {
            setLoadingProducto(false);
        }
    };

    useEffect(() => {
        loadGeneral();
    }, []);

    useEffect(() => {
        if (tab === 'periodos') loadPeriodo();
        if (tab === 'productos') loadProducto();
    }, [tab]);

    const maxDist = duracion
        ? Math.max(...(duracion.distribucion ?? []).map(d => d.cantidad), 1)
        : 1;

    const maxBasculas = ocupacion
        ? Math.max(...(ocupacion.basculas ?? []).map(b => b.totalPesadas), 1)
        : 1;

    const maxKgProducto = movProducto && Array.isArray(movProducto)
        ? Math.max(...movProducto.map(p => Number(p.totalKgNeto)), 1)
        : 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Reportes & Métricas Operativas</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Planta La Plata (CILP) · CU080 · CU081 · CU082 · CU083
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (tab === 'general') loadGeneral();
                            if (tab === 'periodos') loadPeriodo();
                            if (tab === 'productos') loadProducto();
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw size={16} className={loading || loadingPeriodo || loadingProducto ? 'animate-spin' : ''} />
                        Actualizar
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Download size={16} />
                        Exportar / Imprimir
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 max-w-xl">
                <button
                    onClick={() => setTab('general')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'general' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Operaciones & Básculas
                </button>
                <button
                    onClick={() => setTab('periodos')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'periodos' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Movimientos por Período (CU080)
                </button>
                <button
                    onClick={() => setTab('productos')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'productos' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Por Producto (CU081)
                </button>
            </div>

            {/* ──────── TAB 1: OPERACIONES Y BÁSCULAS (CU082 / CU083) ──────── */}
            {tab === 'general' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* KPI Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <KpiCard
                            title="Duración Promedio OT"
                            value={loading ? '—' : (duracion?.promedioMinutos ?? '0')}
                            unit="min"
                            subtitle="Desde primera hasta última pesada (CU082)"
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
                            subtitle="Acumulado histórico en planta"
                            icon={Scale}
                            color="bg-purple-600"
                            loading={loading}
                        />
                        <KpiCard
                            title="Básculas Activas"
                            value={loading ? '—' : (ocupacion?.basculas?.length ?? 0)}
                            unit="disp."
                            subtitle="Con registros de pesaje (CU083)"
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
                                    <p className="text-xs text-slate-400 mt-1">CU082 · Tiempo transcurrido entre TARA y BRUTO</p>
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
                                    <p className="text-xs text-slate-400 mt-1">CU083 · Frecuencia de uso por dispositivo de pesaje</p>
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
                                <p className="text-xs text-slate-400 mt-0.5">Duración registrada por OT · CU082</p>
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
            )}

            {/* ──────── TAB 2: MOVIMIENTOS POR PERÍODO (CU080) ──────── */}
            {tab === 'periodos' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Filtros de Fecha y Tipo de Movimiento */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-end gap-4">
                        <div className="flex-1 w-full sm:w-auto">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                <Calendar size={13} className="inline mr-1" /> Fecha Desde
                            </label>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                <Calendar size={13} className="inline mr-1" /> Fecha Hasta
                            </label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                <Filter size={13} className="inline mr-1" /> Tipo Movimiento
                            </label>
                            <select
                                value={tipoMovimiento}
                                onChange={(e) => setTipoMovimiento(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">Todos los movimientos</option>
                                <option value="1">Órdenes de Entrega (Tipo 1)</option>
                                <option value="2">Autorizaciones de Descarga (Tipo 2)</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                <Filter size={13} className="inline mr-1" /> Replanificado
                            </label>
                            <select
                                value={replanificado}
                                onChange={(e) => setReplanificado(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">Todas</option>
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                        <button
                            onClick={loadPeriodo}
                            disabled={loadingPeriodo}
                            className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm shrink-0"
                        >
                            {loadingPeriodo ? <Loader2 size={16} className="animate-spin" /> : <Filter size={16} />}
                            Filtrar Período
                        </button>
                    </div>

                    {/* Resumen KPIs del Período */}
                    {movPeriodo?.resumen && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Órdenes en Período</p>
                                <h3 className="text-2xl font-black text-slate-800 mt-1">
                                    {movPeriodo.resumen.totalOTs} <span className="text-sm font-semibold text-slate-400">OTs</span>
                                </h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Carga Total Neta Movilizada</p>
                                <h3 className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                                    {Number(movPeriodo.resumen.totalKgNeto).toLocaleString('es-AR')} <span className="text-sm font-semibold text-slate-400">KG</span>
                                </h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Promedio Diario</p>
                                <h3 className="text-2xl font-black text-blue-700 mt-1 font-mono">
                                    {Number(movPeriodo.resumen.promedioDiario).toLocaleString('es-AR')} <span className="text-sm font-semibold text-slate-400">KG/día</span>
                                </h3>
                            </div>
                        </div>
                    )}

                    {/* Tabla de Movimientos por Período */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800">Registros de Movimientos en Período</h3>
                                <p className="text-xs text-slate-400 mt-0.5">CU080 · Órdenes de transporte y pesadas ejecutadas</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-slate-50/70 border-b border-slate-100">
                                        <th className="px-6 py-4 font-bold">ID OT</th>
                                        <th className="px-6 py-4 font-bold">Tipo Movimiento</th>
                                        <th className="px-6 py-4 font-bold">Fecha Fin Ejecución</th>
                                        <th className="px-6 py-4 font-bold">Producto</th>
                                        <th className="px-6 py-4 font-bold">Transportista</th>
                                        <th className="px-6 py-4 font-bold">Vehículo</th>
                                        <th className="px-6 py-4 font-bold">Planificado</th>
                                        <th className="px-6 py-4 font-bold">TARA (kg)</th>
                                        <th className="px-6 py-4 font-bold">BRUTO (kg)</th>
                                        <th className="px-6 py-4 font-bold">NETO (kg)</th>
                                        <th className="px-6 py-4 font-bold">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loadingPeriodo ? (
                                        [1, 2, 3, 4].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={11} className="px-6 py-5">
                                                    <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (!movPeriodo?.registros || movPeriodo.registros.length === 0) ? (
                                        <tr>
                                            <td colSpan={11} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Calendar size={36} className="opacity-20" />
                                                    <p className="font-medium text-sm">No hay movimientos en el período seleccionado</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {movPeriodo.registros.map((r, i) => (
                                                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-700 text-sm">OT-{r.idOT}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold ${r.idTipoOrden === 1 ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                                                            }`}>
                                                            {r.tipoOrden || (r.idTipoOrden === 1 ? 'Entrega' : 'Descarga')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                                        {r.fechaFinEjecucion ? new Date(r.fechaFinEjecucion).toLocaleDateString('es-AR') : (r.fecha ? new Date(r.fecha).toLocaleDateString('es-AR') : '—')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-blue-700">{r.producto}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{r.transportista}</td>
                                                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-800">{r.vehiculo}</td>
                                                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                                                        {r.cantidadPlanificada ? `${Number(r.cantidadPlanificada).toLocaleString('es-AR')} kg` : '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                                                        {r.pesoTara ? `${Number(r.pesoTara).toLocaleString('es-AR')} kg` : '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                                                        {r.pesoBruto ? `${Number(r.pesoBruto).toLocaleString('es-AR')} kg` : '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono font-bold text-emerald-700">
                                                        {r.pesoNeto ? `${Number(r.pesoNeto).toLocaleString('es-AR')} kg` : '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{r.estado}</td>
                                                </tr>
                                            ))}
                                            {/* Fila de Totales */}
                                            <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                                                <td colSpan={6} className="px-6 py-4 text-sm text-slate-800 uppercase tracking-wider">
                                                    TOTALES DEL PERÍODO ({movPeriodo.registros.length} órdenes)
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-800">
                                                    {Number(movPeriodo.registros.reduce((acc, r) => acc + (r.cantidadPlanificada ?? 0), 0)).toLocaleString('es-AR')} kg
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-800">
                                                    {Number(movPeriodo.registros.reduce((acc, r) => acc + (r.pesoTara ?? 0), 0)).toLocaleString('es-AR')} kg
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-800">
                                                    {Number(movPeriodo.registros.reduce((acc, r) => acc + (r.pesoBruto ?? 0), 0)).toLocaleString('es-AR')} kg
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm font-black text-emerald-800">
                                                    {Number(movPeriodo.resumen?.totalKgNeto ?? 0).toLocaleString('es-AR')} kg
                                                </td>
                                                <td className="px-6 py-4"></td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ──────── TAB 3: MOVIMIENTOS POR PRODUCTO (CU081) ──────── */}
            {tab === 'productos' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Filtros de Fecha */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-end gap-4">
                        <div className="flex-1 w-full sm:w-auto">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                <Calendar size={13} className="inline mr-1" /> Fecha Desde
                            </label>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                <Calendar size={13} className="inline mr-1" /> Fecha Hasta
                            </label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <button
                            onClick={loadProducto}
                            disabled={loadingProducto}
                            className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm shrink-0"
                        >
                            {loadingProducto ? <Loader2 size={16} className="animate-spin" /> : <Filter size={16} />}
                            Filtrar Período
                        </button>
                    </div>

                    {/* Tabla de Movimientos por Producto */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800">Carga Movilizada por Producto / Material</h3>
                                <p className="text-xs text-slate-400 mt-0.5">CU081 · Agrupación por tipo de producto y tonelaje neto acumulado</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Package size={18} className="text-blue-600" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-slate-50/70 border-b border-slate-100">
                                        <th className="px-6 py-4 font-bold">Producto / Material</th>
                                        <th className="px-6 py-4 font-bold">Cant. OTs</th>
                                        <th className="px-6 py-4 font-bold">Total Planificado (kg)</th>
                                        <th className="px-6 py-4 font-bold">Total Neto Real (kg)</th>
                                        <th className="px-6 py-4 font-bold">Promedio por OT (kg)</th>
                                        <th className="px-6 py-4 font-bold w-48">Volumen Relativo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loadingProducto ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={6} className="px-6 py-5">
                                                    <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (!movProducto || movProducto.length === 0) ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Package size={36} className="opacity-20" />
                                                    <p className="font-medium text-sm">No hay registros de movimientos en el período seleccionado</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {movProducto.map((p, i) => {
                                                const pct = maxKgProducto > 0 ? (Number(p.totalKgNeto) / maxKgProducto) * 100 : 0;
                                                return (
                                                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-blue-700 text-sm">
                                                            {p.descripcion}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                                            {p.cantidadOTs} {p.cantidadOTs === 1 ? 'orden' : 'órdenes'}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-mono font-medium text-slate-600">
                                                            {Number(p.totalKgPlanificado).toLocaleString('es-AR')} kg
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-mono font-bold text-emerald-700">
                                                            {Number(p.totalKgNeto).toLocaleString('es-AR')} kg
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-mono font-medium text-slate-600">
                                                            {Number(p.promedioPorOT).toLocaleString('es-AR')} kg
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                                <div
                                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {/* Totales */}
                                            <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                                                <td className="px-6 py-4 text-sm text-slate-800 uppercase tracking-wider">
                                                    TOTAL ACUMULADO
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                                    {movProducto.reduce((acc, p) => acc + p.cantidadOTs, 0)} órdenes
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-800">
                                                    {Number(movProducto.reduce((acc, p) => acc + Number(p.totalKgPlanificado), 0)).toLocaleString('es-AR')} kg
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm font-black text-emerald-800">
                                                    {Number(movProducto.reduce((acc, p) => acc + Number(p.totalKgNeto), 0)).toLocaleString('es-AR')} kg
                                                </td>
                                                <td colSpan={2} className="px-6 py-4"></td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportesPage;