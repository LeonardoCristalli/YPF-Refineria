import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './features/dashboard/Dashboard';
import PesadasPage from './features/pesadas/PesadasPage';
import OrdenesTransportePage from './features/masters/OrdenesTransportePage';
import VehiculosPage from './features/masters/VehiculosPage';
import ConductoresPage from './features/masters/ConductoresPage';
import ProductosPage from './features/masters/ProductosPage';
import RazonesSocialesPage from './features/masters/RazonesSocialesPage';
import BasculasPage from './features/masters/BasculasPage';
import UsuariosPage from './features/masters/UsuariosPage';
import AutorizacionesPage from './features/planificacion/AutorizacionesPage';
import ReportesPage from './features/reportes/ReportesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        
        {/* Operaciones */}
        <Route path="pesadas" element={<PesadasPage />} />
        <Route path="ordenes-transporte" element={<OrdenesTransportePage />} />
        <Route path="planificacion" element={<AutorizacionesPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        
        {/* Maestros */}
        <Route path="vehiculos" element={<VehiculosPage />} />
        <Route path="conductores" element={<ConductoresPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="razones-sociales" element={<RazonesSocialesPage />} />
        <Route path="basculas" element={<BasculasPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
      </Route>
    </Routes>
  );
}

export default App;
