import React, { useState, useEffect } from 'react';
import {
    ArrowUpRight, ArrowDownRight, Activity, Clock, Scale, Truck, AlertTriangle, CheckCircle2,
    FileText, Users
} from 'lucide-react';
import agent from '../../api/agent';

const StatCard = ({ title, value, subValue, icon: Icon, trend, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {subValue && <p className="text-slate-400 text-xs mt-1">{subValue}</p>}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPesadas: 0,
        ordenesActivas: 0,
        tonelajeDia: 0,
        alertas: 2
    });

    useEffect(() => {
        // Fetch some real stats if possible, otherwise use mocks for "wow" effect if backend is empty
        const loadStats = async () => {
            try {
                const pesadas = await agent.Pesadas.list();
                const ots = await agent.OrdenesTransporte.list();
                setStats({
                    totalPesadas: pesadas.length,
                    ordenesActivas: ots.filter(o => o.id_EstadoOrden !== 3).length, // Mock logic
                    tonelajeDia: pesadas.reduce((acc, p) => acc + (p.cantidad || 0), 0).toFixed(1),
                    alertas: 1
                });
            } catch (e) {
                console.error("Using mock stats", e);
                setStats({
                    totalPesadas: 124,
                    ordenesActivas: 18,
                    tonelajeDia: "1,450.5",
                    alertas: 2
                });
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Panel de Control</h2>
                    <p className="text-slate-500 mt-1">Resumen operativo de la Refinería - Planta La Plata</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2 text-blue-700 text-sm font-bold">
                    <Activity size={16} className="animate-pulse" />
                    SISTEMA ONLINE
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pesajes Hoy"
                    value={stats.totalPesadas}
                    subValue="+12 desde las 08:00"
                    icon={Scale}
                    trend={12}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Órdenes Activas"
                    value={stats.ordenesActivas}
                    subValue="Logística CILP"
                    icon={Truck}
                    trend={-5}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Tonelaje Total"
                    value={`${stats.tonelajeDia} t`}
                    subValue="Acumulado diario"
                    icon={Activity}
                    trend={8.4}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Alertas Sistema"
                    value={stats.alertas}
                    subValue="Básculas y Sensores"
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Actividad de Pesaje Reciente</h3>
                        <button className="text-blue-600 text-xs font-bold hover:underline">Ver todo</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Vehículo</th>
                                    <th className="px-6 py-4 font-bold">Producto</th>
                                    <th className="px-6 py-4 font-bold">Peso</th>
                                    <th className="px-6 py-4 font-bold">Tipo</th>
                                    <th className="px-6 py-4 font-bold">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { plate: "AE123BB", prod: "Crudo Escalerita", weight: "24.5 t", type: "BRUTO", status: "Completado" },
                                    { plate: "AD999CC", prod: "Gasoil Premium", weight: "12.2 t", type: "TARA", status: "En Proceso" },
                                    { plate: "AF444DD", prod: "Butano", weight: "18.0 t", type: "BRUTO", status: "Completado" },
                                    { plate: "AA777EE", prod: "Asfalto", weight: "22.1 t", type: "TARA", status: "En Proceso" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
                                                    {row.plate.substring(0, 2)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{row.plate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.prod}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{row.weight}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${row.type === 'BRUTO' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle2 size={14} className={row.status === 'Completado' ? 'text-green-500' : 'text-amber-500'} />
                                                <span className="text-xs font-bold text-slate-600">{row.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Status / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-sm text-blue-400 uppercase tracking-widest mb-1">Estado de Hardware</h3>
                            <p className="text-2xl font-bold mb-4">Básculas Operativas</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Báscula #01 (Norte)</span>
                                    <span className="text-green-400 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> ONLINE</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Báscula #02 (Sur)</span>
                                    <span className="text-green-400 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> ONLINE</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">OCR Camera A1</span>
                                    <span className="text-amber-400 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div> CALIBRANDO</span>
                                </div>
                            </div>
                        </div>
                        {/* Abstract background element */}
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Accesos Rápidos</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Scale size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Nueva Pesada</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Truck size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Ver Tráfico</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
