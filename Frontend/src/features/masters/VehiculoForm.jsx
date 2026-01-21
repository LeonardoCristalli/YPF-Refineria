import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent from '../../api/agent';

const VehiculoForm = ({ isOpen, onClose, onSuccess, initialValues }) => {
    const [loading, setLoading] = useState(false);
    const [transportistas, setTransportistas] = useState([]);
    const [formData, setFormData] = useState({
        patenteChasis: '',
        patenteAcoplado: '',
        pesoSinCargas: '',
        pesoMaximo: '',
        volumenMaximo: '',
        id_RazonSocial: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadOptions();
            if (initialValues) {
                setFormData({
                    patenteChasis: initialValues.patenteChasis || '',
                    patenteAcoplado: initialValues.patenteAcoplado || '',
                    pesoSinCargas: initialValues.pesoSinCargas || '',
                    pesoMaximo: initialValues.pesoMaximo || '',
                    volumenMaximo: initialValues.volumenMaximo || '',
                    id_RazonSocial: initialValues.id_RazonSocial || ''
                });
            } else {
                setFormData({
                    patenteChasis: '',
                    patenteAcoplado: '',
                    pesoSinCargas: '',
                    pesoMaximo: '',
                    volumenMaximo: '',
                    id_RazonSocial: ''
                });
            }
        }
    }, [isOpen, initialValues]);

    const loadOptions = async () => {
        try {
            const razons = await agent.RazonesSociales.list();
            setTransportistas(razons.filter(r => r.esTransportista));
        } catch (error) {
            console.error("Error loading options", error);
        }
    };

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
                id_RazonSocial: formData.id_RazonSocial ? parseInt(formData.id_RazonSocial) : null,
                pesoSinCargas: formData.pesoSinCargas ? parseFloat(formData.pesoSinCargas) : null,
                pesoMaximo: formData.pesoMaximo ? parseFloat(formData.pesoMaximo) : null,
                volumenMaximo: formData.volumenMaximo ? parseFloat(formData.volumenMaximo) : null,
                id_Vehiculo: initialValues ? initialValues.id_Vehiculo : 0
            };

            if (initialValues) {
                await agent.Vehiculos.update(initialValues.id_Vehiculo, payload);
            } else {
                await agent.Vehiculos.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving vehicle", error);
            alert("Error al guardar vehículo.");
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
                        {initialValues ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-blue-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Patente Chasis</label>
                            <input 
                                type="text" 
                                name="patenteChasis"
                                value={formData.patenteChasis}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Patente Acoplado</label>
                            <input 
                                type="text" 
                                name="patenteAcoplado"
                                value={formData.patenteAcoplado}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Peso Máximo (KG)</label>
                            <input 
                                type="number" 
                                name="pesoMaximo"
                                value={formData.pesoMaximo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700">Volumen Máximo</label>
                            <input 
                                type="number" 
                                name="volumenMaximo"
                                value={formData.volumenMaximo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Peso Sin Carga</label>
                            <input 
                                type="number" 
                                name="pesoSinCargas"
                                value={formData.pesoSinCargas}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Transportista</label>
                            <select 
                                name="id_RazonSocial"
                                value={formData.id_RazonSocial}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            >
                                <option value="">Seleccione...</option>
                                {transportistas.map(t => (
                                    <option key={t.id_RazonSocial} value={t.id_RazonSocial}>{t.descripcion}</option>
                                ))}
                            </select>
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

export default VehiculoForm;
