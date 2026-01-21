import React, { useState } from 'react';
import CrudTable from '../../common/CrudTable';
import agent from '../../api/agent';
import UsuarioForm from './UsuarioForm';

const UsuariosPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { header: 'ID', field: 'id_Usuario' },
        { header: 'ID Red', field: 'idRed' },
        { header: 'Apellido', field: 'apellido' },
        { header: 'Nombre', field: 'nombre' },
        { header: 'Documento', field: 'nroDocumento' },
    ];

    const handleCreate = () => {
        setSelectedUsuario(null);
        setIsFormOpen(true);
    };

    const handleEdit = (usuario) => {
        setSelectedUsuario(usuario);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar este usuario?')) {
            try {
                await agent.Usuarios.delete(id);
                setRefreshKey(prev => prev + 1);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting Usuario", error);
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
                title="Gestión de Usuarios" 
                agent={agent.Usuarios} 
                columns={columns} 
                idField="id_Usuario"
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <UsuarioForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialValues={selectedUsuario}
            />
        </>
    );
};

export default UsuariosPage;
