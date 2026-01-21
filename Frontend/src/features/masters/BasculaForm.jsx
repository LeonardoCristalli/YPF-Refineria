import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent from '../../api/agent';

const BasculaForm = ({ isOpen, onClose, onSuccess, initialValues }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        lote: '',
        serie: '',
        certificadoHabilitado: '',
        vencimientoCertificado: '',
        ip: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (initialValues) {
                setFormData({
                    descripcion: initialValues.descripcion || '',
                    lote: initialValues.lote || '',
                    serie: initialValues.serie || '',
                    certificadoHabilitado: initialValues.certificadoHabilitado || '',
                    vencimientoCertificado: initialValues.vencimientoCertificado ? initialValues.vencimientoCertificado.split('T')[0] : '',
                    ip: initialValues.ip || ''
                });
            } else {
                setFormData({
                    descripcion: '',
                    lote: '',
                    serie: '',
                    certificadoHabilitado: '',
                    vencimientoCertificado: '',
                    ip: ''
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
                vencimientoCertificado: formData.vencimientoCertificado ? new Date(formData.vencimientoCertificado).toISOString() : null,
                id_Bascula: initialValues ? initialValues.id_Bascula : 0
            };

            if (initialValues) {
                await agent.Basculas.update(initialValues.id_Bascula, payload);
            } else {
                await agent.Basculas.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving Bascula", error);
            alert("Error al guardar Báscula.");
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
                        {initialValues ? 'Editar Báscula' : 'Nueva Báscula'}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-blue-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
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
                            <label className="block text-sm font-medium text-gray-700">Serie</label>
                            <input 
                                type="text" 
                                name="serie"
                                value={formData.serie}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Lote</label>
                            <input 
                                type="text" 
                                name="lote"
                                value={formData.lote}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">IP</label>
                            <input 
                                type="text" 
                                name="ip"
                                value={formData.ip}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700">Vencimiento Cert.</label>
                            <input 
                                type="date" 
                                name="vencimientoCertificado"
                                value={formData.vencimientoCertificado}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
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

export default BasculaForm;
