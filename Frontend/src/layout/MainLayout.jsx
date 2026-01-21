import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Truck, Scale, Home, Users, Package, Briefcase, UserCheck, Monitor } from 'lucide-react';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
                <div className="p-4 text-xl font-bold border-b border-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">C</div>
                    Refinería CILP
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Operaciones</p>
                    <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Home size={18} /> <span>Inicio</span>
                    </Link>
                    <Link to="/pesadas" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Scale size={18} /> <span>Gestión de Pesadas</span>
                    </Link>
                    <Link to="/ordenes-transporte" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Truck size={18} /> <span>Órdenes de Transporte</span>
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Maestros</p>
                    </div>
                    
                    <Link to="/vehiculos" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Truck size={18} /> <span>Vehículos</span>
                    </Link>
                    <Link to="/conductores" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Users size={18} /> <span>Conductores</span>
                    </Link>
                    <Link to="/productos" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Package size={18} /> <span>Productos</span>
                    </Link>
                    <Link to="/razones-sociales" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Briefcase size={18} /> <span>Razones Sociales</span>
                    </Link>
                    <Link to="/basculas" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <Monitor size={18} /> <span>Básculas</span>
                    </Link>
                    <Link to="/usuarios" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors text-sm">
                        <UserCheck size={18} /> <span>Usuarios</span>
                    </Link>
                </nav>
                <div className="p-4 text-xs text-slate-500">
                    Prototype v0.1
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <div className="bg-white rounded shadow p-6 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
