import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent from '../../api/agent';

const RazonSocialForm = ({ isOpen, onClose, onSuccess, initialValues }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        cuit: '',
        esCliente: false,
        esProveedor: false,
        esTransportista: false
    });

    useEffect(() => {
        if (isOpen) {
            if (initialValues) {
                setFormData({
                    descripcion: initialValues.descripcion || '',
                    cuit: initialValues.cuit || '',
                    esCliente: initialValues.esCliente || false,
                    esProveedor: initialValues.esProveedor || false,
                    esTransportista: initialValues.esTransportista || false
                });
            } else {
                setFormData({
                    descripcion: '',
                    cuit: '',
                    esCliente: false,
                    esProveedor: false,
                    esTransportista: false
                });
            }
        }
    }, [isOpen, initialValues]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                id_RazonSocial: initialValues ? initialValues.id_RazonSocial : 0
            };

            if (initialValues) {
                await agent.RazonesSociales.update(initialValues.id_RazonSocial, payload);
            } else {
                await agent.RazonesSociales.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving Razon Social", error);
            alert("Error al guardar Razón Social.");
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
                        {initialValues ? 'Editar Razón Social' : 'Nueva Razón Social'}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-blue-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Razón Social</label>
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
                        <label className="block text-sm font-medium text-gray-700">CUIT</label>
                        <input 
                            type="text" 
                            name="cuit"
                            value={formData.cuit}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            placeholder="XX-XXXXXXXX-X"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <label className="text-sm font-medium text-gray-700">Roles</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    name="esCliente"
                                    checked={formData.esCliente}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Es Cliente</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    name="esProveedor"
                                    checked={formData.esProveedor}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Es Proveedor</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    name="esTransportista"
                                    checked={formData.esTransportista}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Es Transportista</span>
                            </label>
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

export default RazonSocialForm;
