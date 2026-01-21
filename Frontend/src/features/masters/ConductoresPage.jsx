import React, { useState } from 'react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import ConductorForm from './ConductorForm';

const ConductoresPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedConductor, setSelectedConductor] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_Conductor' },
        { header: 'Apellido', field: 'apellido' },
        { header: 'Nombre', field: 'nombre' },
        { header: 'Documento', field: 'nroDocumento' },
    ];

    const handleCreate = () => {
        setSelectedConductor(null);
        setIsFormOpen(true);
    };

    const handleEdit = (conductor) => {
        setSelectedConductor(conductor);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar este conductor?')) {
            try {
                await agent.Conductores.delete(id);
                setRefreshKey(prev => prev + 1);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting conductor", error);
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
                title="Gestión de Conductores" 
                agent={agent.Conductores} 
                columns={columns} 
                idField="id_Conductor"
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ConductorForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedConductor}
            />
        </>
    );
};

export default ConductoresPage;
