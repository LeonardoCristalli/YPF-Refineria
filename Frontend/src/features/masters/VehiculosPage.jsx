import React, { useState } from 'react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import VehiculoForm from './VehiculoForm';

const VehiculosPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_Vehiculo' },
        { header: 'Patente Chasis', field: 'patenteChasis' },
        { header: 'Patente Acoplado', field: 'patenteAcoplado' },
        { header: 'Peso Máximo', field: 'pesoMaximo' },
        { header: 'Volumen', field: 'volumenMaximo' }
    ];

    const handleCreate = () => {
        setSelectedVehiculo(null);
        setIsFormOpen(true);
    };

    const handleEdit = (vehiculo) => {
        setSelectedVehiculo(vehiculo);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar este vehículo?')) {
            try {
                await agent.Vehiculos.delete(id);
                setRefreshKey(prev => prev + 1);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting vehicle", error);
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
                title="Gestión de Vehículos" 
                agent={agent.Vehiculos} 
                columns={columns} 
                idField="id_Vehiculo"
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            
            <VehiculoForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedVehiculo}
            />
        </>
    );
};

export default VehiculosPage;
