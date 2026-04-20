import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Truck, Scale, LayoutDashboard, Users, Package,
    Briefcase, UserCheck, Monitor, Bell, Search,
    Settings, LogOut, ChevronRight, FileText, BarChart2
} from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();

    const menuItems = [
        {
            group: "Operaciones", items: [
                { path: "/", label: "Inicio", icon: <LayoutDashboard size={20} /> },
                { path: "/pesadas", label: "Gestión de Pesadas", icon: <Scale size={20} /> },
                { path: "/ordenes-transporte", label: "Órdenes de Transporte", icon: <Truck size={20} /> },
                { path: "/planificacion", label: "Planificación Logística", icon: <FileText size={20} /> },
                { path: "/reportes", label: "Reportes & Métricas", icon: <BarChart2 size={20} /> },
            ]
        },
        {
            group: "Administración", items: [
                { path: "/vehiculos", label: "Vehículos", icon: <Truck size={20} /> },
                { path: "/conductores", label: "Conductores", icon: <Users size={20} /> },
                { path: "/productos", label: "Productos", icon: <Package size={20} /> },
                { path: "/razones-sociales", label: "Razones Sociales", icon: <Briefcase size={20} /> },
                { path: "/basculas", label: "Básculas", icon: <Monitor size={20} /> },
                { path: "/usuarios", label: "Usuarios", icon: <UserCheck size={20} /> },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-linear-to-b from-slate-900 via-slate-900 to-blue-950 text-white flex flex-col shadow-2xl z-50">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3">
                        <Scale className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">CILP <span className="text-blue-400">Refinería</span></h1>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">Smart Weighing System</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pt-2">
                    {menuItems.map((group, idx) => (
                        <div key={idx}>
                            <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">{group.group}</p>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}>
                                                    {item.icon}
                                                </span>
                                                <span className="text-[14px] font-medium">{item.label}</span>
                                            </div>
                                            {isActive && <ChevronRight size={14} className="animate-pulse" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-bold text-sm">MC</div>
                        <div className="flex-1">
                            <p className="text-xs font-bold leading-none">M. Cristalli</p>
                            <p className="text-[10px] text-slate-500 mt-1">Administrador</p>
                        </div>
                        <button className="text-slate-500 hover:text-red-400 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
                        <span>VERSION 0.9.0-BETA</span>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar orden de transporte, patente o guía..."
                                className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">3</span>
                        </button>
                        <button className="text-slate-500 hover:text-blue-600 transition-colors">
                            <Settings size={20} />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold leading-none">Planta La Plata</p>
                                <p className="text-[10px] text-slate-500 mt-1 font-semibold flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> BÁSCULA #01
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

