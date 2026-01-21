import React, { useState } from 'react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import { Eye } from 'lucide-react';
import OrdenDetailsModal from './OrdenDetailsModal';
import OrdenTransporteForm from './OrdenTransporteForm';

const OrdenesTransportePage = () => {
    const [selectedOrden, setSelectedOrden] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Trigger table refresh

    const handleViewDetails = (orden) => {
        setSelectedOrden(orden);
        setIsDetailModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedOrden(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (orden) => {
        setSelectedOrden(orden);
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta Orden de Transporte?')) {
            try {
                await agent.OrdenesTransporte.delete(id);
                setRefreshKey(prev => prev + 1);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting order", error);
                alert("Error al eliminar la orden");
            }
        }
    };

    const handleSuccessCreate = () => {
        setRefreshKey(prev => prev + 1); 
        window.location.reload(); 
    };

    const columns = [
        { header: 'ID OT', field: 'id_OrdenTransporte' },
        { 
            header: 'Producto', 
            field: 'ordenDetalle.producto.descripcion',
            render: (row) => row.ordenDetalle?.producto?.descripcion || 'N/A'
        },
        { 
            header: 'Vehículo', 
            field: 'vehiculo.patenteChasis',
            render: (row) => row.vehiculo?.patenteChasis || 'N/A'
        },
        { 
            header: 'Conductor', 
            field: 'conductor.apellido',
            render: (row) => (row.conductor ? `${row.conductor.apellido}, ${row.conductor.nombre}` : 'N/A')
        },
        { 
            header: 'Transportista', 
            field: 'razonSocialTransportista.descripcion',
            render: (row) => row.razonSocialTransportista?.descripcion || 'N/A'
        },
    ];

    const actions = (row) => (
        <button 
            onClick={() => handleViewDetails(row)}
            className="text-blue-600 hover:text-blue-900 mr-2"
            title="Ver Detalle"
        >
            <Eye size={18} />
        </button>
    );

    return (
        <>
            <CrudTable 
                title="Órdenes de Transporte" 
                agent={agent.OrdenesTransporte} 
                columns={columns} 
                idField="id_OrdenTransporte"
                actions={actions}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <OrdenDetailsModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                orden={selectedOrden}
            />

            <OrdenTransporteForm
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleSuccessCreate}
                initialValues={selectedOrden}
            />
        </>
    );
};

export default OrdenesTransportePage;
