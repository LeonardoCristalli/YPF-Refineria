import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import DispositivoForm from './DispositivoForm';

// CU040 - Consultar Dispositivos de Detección (con Ver, Modificar y Eliminar), CU041 a CU044.
const DispositivosPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_DispositivoDetector' },
        { header: 'Descripción', field: 'descripcion' },
        { header: 'IP', field: 'ip' },
    ];

    const handleCreate = () => {
        setSelectedItem(null);
        setReadOnly(false);
        setIsFormOpen(true);
    };

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
                title="Dispositivos de Detección"
                agent={agent.DispositivosDetectores}
                columns={columns}
                idField="id_DispositivoDetector"
                nameField="descripcion"
                onCreate={handleCreate}
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

            <DispositivoForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedItem}
                readOnly={readOnly}
            />
        </>
    );
};

export default DispositivosPage;