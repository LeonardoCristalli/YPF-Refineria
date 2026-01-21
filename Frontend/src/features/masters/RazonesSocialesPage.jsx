import React, { useState } from 'react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import RazonSocialForm from './RazonSocialForm';

const RazonesSocialesPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRazon, setSelectedRazon] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_RazonSocial' },
        { header: 'Razón Social', field: 'descripcion' },
        { header: 'CUIT', field: 'cuit' },
        { header: 'Es Cliente', field: 'esCliente', render: (row) => row.esCliente ? 'Sí' : 'No' },
        { header: 'Es Proveedor', field: 'esProveedor', render: (row) => row.esProveedor ? 'Sí' : 'No' },
        { header: 'Es Transportista', field: 'esTransportista', render: (row) => row.esTransportista ? 'Sí' : 'No' }, // Added transportista column
    ];

    const handleCreate = () => {
        setSelectedRazon(null);
        setIsFormOpen(true);
    };

    const handleEdit = (razon) => {
        setSelectedRazon(razon);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar esta Razón Social?')) {
            try {
                await agent.RazonesSociales.delete(id);
                setRefreshKey(prev => prev + 1);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting Razon Social", error);
            }
        }
    };

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
        window.location.reload();
    };

    return (
        <>
            <CrudTable 
                title="Gestión de Razones Sociales" 
                agent={agent.RazonesSociales} 
                columns={columns} 
                idField="id_RazonSocial"
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <RazonSocialForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedRazon}
            />
        </>
    );
};

export default RazonesSocialesPage;
