import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import RolForm from './RolForm';

// CU05 - Consultar Roles (con Ver, Crear, Modificar y Eliminar), CU06 a CU09.
const RolesPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_Rol' },
        { header: 'Descripción', field: 'descripcion' },
        { header: 'Puntos de Menú', field: 'cantidadPuntosMenu' },
    ];

    const open = (item, soloLectura) => {
        setSelectedItem(item);
        setReadOnly(soloLectura);
        setIsFormOpen(true);
    };

    // Al cambiar la key, la tabla se vuelve a montar y recarga el listado.
    const handleSuccess = () => setRefreshKey(prev => prev + 1);

    return (
        <>
            <CrudTable
                key={refreshKey}
                title="Roles y Permisos"
                agent={agent.Roles}
                columns={columns}
                idField="id_Rol"
                nameField="descripcion"
                onCreate={() => open(null, false)}
                onEdit={(item) => open(item, false)}
                actions={(item) => (
                    <button
                        onClick={() => open(item, true)}
                        title="Ver"
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                    >
                        <Eye size={16} />
                    </button>
                )}
            />

            <RolForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedItem}
                readOnly={readOnly}
            />
        </>
    );
};

export default RolesPage;