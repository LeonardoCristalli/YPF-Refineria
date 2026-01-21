import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent from '../../api/agent';

const UsuarioForm = ({ isOpen, onClose, onSuccess, initialValues }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        idRed: '',
        nombre: '',
        apellido: '',
        nroDocumento: '',
        id_TipoDocumento: '1' // Defaulting to 1 for prototype
    });

    useEffect(() => {
        if (isOpen) {
            if (initialValues) {
                setFormData({
                    idRed: initialValues.idRed || '',
                    nombre: initialValues.nombre || '',
                    apellido: initialValues.apellido || '',
                    nroDocumento: initialValues.nroDocumento || '',
                    id_TipoDocumento: initialValues.id_TipoDocumento || '1'
                });
            } else {
                setFormData({
                    idRed: '',
                    nombre: '',
                    apellido: '',
                    nroDocumento: '',
                    id_TipoDocumento: '1'
                });
            }
        }
    }, [isOpen, initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                id_TipoDocumento: parseInt(formData.id_TipoDocumento),
                id_Usuario: initialValues ? initialValues.id_Usuario : 0
            };

            if (initialValues) {
                await agent.Usuarios.update(initialValues.id_Usuario, payload);
            } else {
                await agent.Usuarios.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving Usuario", error);
            alert("Error al guardar Usuario.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {initialValues ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-blue-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                             <label className="block text-sm font-medium text-gray-700">ID Red (Login)</label>
                            <input 
                                type="text" 
                                name="idRed"
                                value={formData.idRed}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input 
                                type="text" 
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input 
                                type="text" 
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nro Documento</label>
                            <input 
                                type="text" 
                                name="nroDocumento"
                                value={formData.nroDocumento}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 bg "
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsuarioForm;
