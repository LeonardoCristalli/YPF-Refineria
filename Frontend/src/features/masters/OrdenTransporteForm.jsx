import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent from '../../api/agent';

const OrdenTransporteForm = ({ isOpen, onClose, onSuccess, initialValues }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_Producto: '',
        id_RazonSocialCliente: '',
        id_RazonSocialTransportista: '',
        id_Vehiculo: '',
        id_Conductor: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0]
    });

    // Options
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [transportistas, setTransportistas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);

    useEffect(() => {
        if (isOpen) {
            loadOptions();
            if (initialValues) {
                // Map existing order to form data
                setFormData({
                    id_Producto: initialValues.ordenDetalle?.id_Producto || '',
                    id_RazonSocialCliente: initialValues.ordenDetalle?.id_RazonSocialClienteProveedor || '',
                    id_RazonSocialTransportista: initialValues.id_RazonSocialTransportista || '',
                    id_Vehiculo: initialValues.id_Vehiculo || '',
                    id_Conductor: initialValues.id_Conductor || '',
                    cantidad: initialValues.ordenDetalle?.peso || '',
                    fecha: initialValues.ordenDetalle?.orden?.fechaPlanificacion 
                        ? initialValues.ordenDetalle.orden.fechaPlanificacion.split('T')[0] 
                        : new Date().toISOString().split('T')[0]
                });
            } else {
                // Reset for new order
                setFormData({
                    id_Producto: '',
                    id_RazonSocialCliente: '',
                    id_RazonSocialTransportista: '',
                    id_Vehiculo: '',
                    id_Conductor: '',
                    cantidad: '',
                    fecha: new Date().toISOString().split('T')[0]
                });
            }
        }
    }, [isOpen, initialValues]);

    const loadOptions = async () => {
        try {
            const [prods, razons, vehs, conds] = await Promise.all([
                agent.Productos.list(),
                agent.RazonesSociales.list(),
                agent.Vehiculos.list(),
                agent.Conductores.list()
            ]);

            // Removed debug logs once confirmed
            setProductos(prods);
            setClientes(razons.filter(r => r.esCliente || r.esProveedor));
            setTransportistas(razons.filter(r => r.esTransportista));
            setVehiculos(vehs);
            setConductores(conds);
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
            // Convert types
            const payload = {
                id_Producto: parseInt(formData.id_Producto),
                id_RazonSocialCliente: parseInt(formData.id_RazonSocialCliente),
                id_RazonSocialTransportista: parseInt(formData.id_RazonSocialTransportista),
                id_Vehiculo: parseInt(formData.id_Vehiculo),
                id_Conductor: parseInt(formData.id_Conductor),
                cantidad: parseFloat(formData.cantidad),
                fecha: new Date(formData.fecha).toISOString()
            };

            if (initialValues) {
                await agent.OrdenesTransporte.update(initialValues.id_OrdenTransporte, payload);
            } else {
                await agent.OrdenesTransporte.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving order", error);
            alert("Error al guardar la orden. Verifique los datos");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {initialValues ? 'Editar Orden de Transporte' : 'Nueva Orden de Transporte'}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-blue-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Fecha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Planificada</label>
                            <input 
                                type="date" 
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            />
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cantidad (KG)</label>
                            <input 
                                type="number" 
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                placeholder="Ej: 30000"
                                required
                            />
                        </div>

                        {/* Producto */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Producto</label>
                            <select 
                                name="id_Producto"
                                value={formData.id_Producto}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            >
                                <option value="">Seleccione Producto...</option>
                                {productos.map(p => (
                                    <option key={p.id_Producto} value={p.id_Producto}>{p.descripcion}</option>
                                ))}
                            </select>
                        </div>

                        {/* Cliente */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cliente/Proveedor</label>
                            <select 
                                name="id_RazonSocialCliente"
                                value={formData.id_RazonSocialCliente}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            >
                                <option value="">Seleccione Cliente...</option>
                                {clientes.map(c => (
                                    <option key={c.id_RazonSocial} value={c.id_RazonSocial}>{c.descripcion}</option>
                                ))}
                            </select>
                        </div>

                        {/* Transportista */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Transportista</label>
                            <select 
                                name="id_RazonSocialTransportista"
                                value={formData.id_RazonSocialTransportista}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            >
                                <option value="">Seleccione Transportista...</option>
                                {transportistas.map(t => (
                                    <option key={t.id_RazonSocial} value={t.id_RazonSocial}>{t.descripcion}</option>
                                ))}
                            </select>
                        </div>

                        {/* Vehiculo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vehículo</label>
                            <select 
                                name="id_Vehiculo"
                                value={formData.id_Vehiculo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            >
                                <option value="">Seleccione Vehículo...</option>
                                {vehiculos.map(v => (
                                    <option key={v.id_Vehiculo} value={v.id_Vehiculo}>{v.patenteChasis}</option>
                                ))}
                            </select>
                        </div>

                        {/* Conductor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Conductor</label>
                            <select 
                                name="id_Conductor"
                                value={formData.id_Conductor}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                required
                            >
                                <option value="">Seleccione Conductor...</option>
                                {conductores.map(c => (
                                    <option key={c.id_Conductor} value={c.id_Conductor}>{c.apellido}, {c.nombre}</option>
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
                            {loading ? 'Guardando...' : (initialValues ? 'Actualizar Orden' : 'Guardar Orden')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrdenTransporteForm;
