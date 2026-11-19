import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import TanqueForm from './TanqueForm';

const formatoLitros = (n) =>
    Number(n ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// CU055 - Consultar Tanques (con Ver, Modificar y Eliminar), CU056 a CU059.
const TanquesPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [selectedTanque, setSelectedTanque] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_Tanque' },
        { header: 'Código', field: 'codigo' },
        { header: 'Descripción', field: 'descripcion' },
        {
            header: 'Volumen Máximo (L)',
            field: 'volumenMaximo',
            render: (t) => <span className="font-medium">{formatoLitros(t.volumenMaximo)}</span>
        },
        {
            header: 'Ocupado (L)',
            field: 'volumenOcupado',
            render: (t) => <span className="font-medium">{formatoLitros(t.volumenOcupado)}</span>
        },
    ];

    const handleCreate = () => {
        setSelectedTanque(null);
        setReadOnly(false);
        setIsFormOpen(true);
    };

    const handleEdit = (tanque) => {
        setSelectedTanque(tanque);
        setReadOnly(false);
        setIsFormOpen(true);
    };

    const handleView = (tanque) => {
        setSelectedTanque(tanque);
        setReadOnly(true);
        setIsFormOpen(true);
    };

    // Al cambiar la key, la tabla se vuelve a montar y recarga el listado.
    const handleSuccess = () => setRefreshKey(prev => prev + 1);

    return (
        <>
            <CrudTable
                key={refreshKey}
                title="Gestión de Tanques"
                agent={agent.Tanques}
                columns={columns}
                idField="id_Tanque"
                nameField="codigo"
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

            <TanqueForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedTanque}
                readOnly={readOnly}
            />
        </>
    );
};

export default TanquesPage;