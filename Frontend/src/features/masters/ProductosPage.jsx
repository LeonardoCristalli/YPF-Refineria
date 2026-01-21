import React, { useState } from 'react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import ProductoForm from './ProductoForm';

const ProductosPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_Producto' },
        { header: 'Descripción', field: 'descripcion' },
        { header: 'Densidad', field: 'densidad' },
    ];

    const handleCreate = () => {
        setSelectedProducto(null);
        setIsFormOpen(true);
    };

    const handleEdit = (producto) => {
        setSelectedProducto(producto);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar este producto?')) {
            try {
                await agent.Productos.delete(id);
                setRefreshKey(prev => prev + 1);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting product", error);
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
                title="Gestión de Productos" 
                agent={agent.Productos} 
                columns={columns} 
                idField="id_Producto"
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ProductoForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedProducto}
            />
        </>
    );
};

export default ProductosPage;
