import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import PesadaForm from './features/pesadas/PesadaForm';
import OrdenesTransportePage from './features/masters/OrdenesTransportePage';
import VehiculosPage from './features/masters/VehiculosPage';
import ConductoresPage from './features/masters/ConductoresPage';
import ProductosPage from './features/masters/ProductosPage';
import RazonesSocialesPage from './features/masters/RazonesSocialesPage';
import BasculasPage from './features/masters/BasculasPage';
import UsuariosPage from './features/masters/UsuariosPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<div className="text-center p-10"><h1 className="text-3xl text-gray-800 font-bold">Bienvenido a CILP Prototype</h1><p className="text-gray-600 mt-2">Seleccione una opción del menú lateral.</p></div>} />
        
        {/* Operaciones */}
        <Route path="pesadas" element={<PesadaForm />} />
        <Route path="ordenes-transporte" element={<OrdenesTransportePage />} />
        
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
