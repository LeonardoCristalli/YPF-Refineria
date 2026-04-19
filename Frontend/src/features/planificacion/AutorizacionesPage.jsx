import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Filter, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
import agent from '../../api/agent';

const AutorizacionesPage = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('descarga'); // descarga o despacho

    useEffect(() => {
        agent.Ordenes.list()
            .then(data => {
                setOrdenes(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = ordenes.filter(o => 
        tab === 'descarga' ? o.id_TipoOrden === 1 : o.id_TipoOrden === 2
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Planificación Logística</h2>
                    <p className="text-slate-500 text-sm">Gestión de Autorizaciones de Descarga y Órdenes de Entrega</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                    <Plus size={20} />
                    Nueva {tab === 'descarga' ? 'Autorización' : 'Orden'}
                </button>
            </div>

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

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por cliente, producto o tanque..." 
                            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                            <Filter size={20} />
                        </button>
                        <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-bold">
                            <Calendar size={18} /> Últimos 7 días <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-slate-50/50">
                                <th className="px-8 py-4 font-bold">Documento / ID</th>
                                <th className="px-8 py-4 font-bold">Origen / Destino</th>
                                <th className="px-8 py-4 font-bold">Producto</th>
                                <th className="px-8 py-4 font-bold">Cantidad</th>
                                <th className="px-8 py-4 font-bold">Estado</th>
                                <th className="px-8 py-4 font-bold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1,2,3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6 h-16 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-3">
                                            <FileText size={48} className="opacity-10" />
                                            <p>No se encontraron registros de {tab === 'descarga' ? 'descarga' : 'entrega'}.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map((item) => (
                                <tr key={item.id_Orden} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">ORD-{item.id_Orden}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">GUÍA: #{Math.floor(Math.random()*100000)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-slate-800">Tanque T-402</p>
                                        <p className="text-xs text-slate-500 font-medium tracking-tight">Terminal Norte</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter">
                                            {item.ordenDetalle?.[0]?.producto?.descripcion || 'MATERIAL'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-slate-800 text-sm">
                                        {item.ordenDetalle?.[0]?.peso || '0'} TN
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            <span className="text-xs font-bold text-slate-600">Planificada</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button className="text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                                            Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AutorizacionesPage;
