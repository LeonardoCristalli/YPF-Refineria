import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent from '../../api/agent';

const ProductoForm = ({ isOpen, onClose, onSuccess, initialValues }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        densidad: '',
        id_UnidadMedida: '2' // Defaulting to Liters/m3 for prototype
    });

    useEffect(() => {
        if (isOpen) {
            if (initialValues) {
                setFormData({
                    descripcion: initialValues.descripcion || '',
                    densidad: initialValues.densidad || '',
                    id_UnidadMedida: initialValues.id_UnidadMedida || '2'
                });
            } else {
                setFormData({
                    descripcion: '',
                    densidad: '',
                    id_UnidadMedida: '2'
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
                densidad: formData.densidad ? parseFloat(formData.densidad) : null,
                id_UnidadMedida: parseInt(formData.id_UnidadMedida),
                id_Producto: initialValues ? initialValues.id_Producto : 0
            };

            if (initialValues) {
                await agent.Productos.update(initialValues.id_Producto, payload);
            } else {
                await agent.Productos.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving product", error);
            alert("Error al guardar producto.");
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
                        {initialValues ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-blue-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <input 
                                type="text" 
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Densidad (g/cm3)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                name="densidad"
                                value={formData.densidad}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unidad de Medida (ID)</label>
                            <input 
                                type="text"
                                name="id_UnidadMedida" 
                                value={formData.id_UnidadMedida}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                placeholder="2 (Liters)"
                            />
                            <p className="text-xs text-gray-500 mt-1">Por defecto 2 (Automático)</p>
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

export default ProductoForm;
