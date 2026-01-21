import React, { useState } from 'react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import BasculaForm from './BasculaForm';

const BasculasPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBascula, setSelectedBascula] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_Bascula' },
        { header: 'Descripción', field: 'descripcion' },
        { header: 'Serie', field: 'serie' },
        { header: 'Lote', field: 'lote' },
        { header: 'IP', field: 'ip' },
        { header: 'Vencimiento Cert.', field: 'vencimientoCertificado', render: (row) => row.vencimientoCertificado ? new Date(row.vencimientoCertificado).toLocaleDateString() : '' },
    ];

    const handleCreate = () => {
        setSelectedBascula(null);
        setIsFormOpen(true);
    };

    const handleEdit = (bascula) => {
        setSelectedBascula(bascula);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar esta Báscula?')) {
            try {
                await agent.Basculas.delete(id);
                setRefreshKey(prev => prev + 1);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting Bascula", error);
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
                title="Gestión de Básculas" 
                agent={agent.Basculas} 
                columns={columns} 
                idField="id_Bascula"
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <BasculaForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedBascula}
            />
        </>
    );
};

export default BasculasPage;
