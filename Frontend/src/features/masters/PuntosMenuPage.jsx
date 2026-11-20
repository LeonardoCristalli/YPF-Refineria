import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import PuntoMenuForm from './PuntoMenuForm';

// CU01 - Consultar Puntos de Menú (con Ver, Modificar y Eliminar), CU02 a CU04.
// No hay botón "Nuevo": la especificación no incluye el alta de puntos de menú.
const PuntosMenuPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'Código', field: 'id_CasoDeUso' },
        { header: 'Nombre', field: 'descripcion' },
    ];

    const handleEdit = (item) => {
        setSelectedItem(item);
        setReadOnly(false);
        setIsFormOpen(true);
    };

    const handleView = (item) => {
        setSelectedItem(item);
        setReadOnly(true);
        setIsFormOpen(true);
    };

    // Al cambiar la key, la tabla se vuelve a montar y recarga el listado.
    const handleSuccess = () => setRefreshKey(prev => prev + 1);

    return (
        <>
            <CrudTable
                key={refreshKey}
                title="Puntos de Menú"
                agent={agent.PuntosMenu}
                columns={columns}
                idField="id_CasoDeUso"
                nameField="descripcion"
                canCreate={false}
                onEdit={handleEdit}
                actions={(item) => (
                    <button
                        onClick={() => handleView(item)}
                        title="Ver"
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                    >
                        <Eye size={16} />
                    </button>
                )}
            />

            <PuntoMenuForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedItem}
                readOnly={readOnly}
            />
        </>
    );
};

export default PuntosMenuPage;