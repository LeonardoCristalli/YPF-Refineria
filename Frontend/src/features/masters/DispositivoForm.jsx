import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent, { getErrorMessage } from '../../api/agent';

// Cuatro octetos de 0 a 255 separados por puntos.
const PATRON_IPV4 = '^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$';

// Modal de Dispositivo de Detección: alta (CU042), modificación (CU043) y detalle de solo lectura (CU041).
const DispositivoForm = ({ isOpen, onClose, onSuccess, initialValues, readOnly = false }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ descripcion: '', ip: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                descripcion: initialValues?.descripcion || '',
                ip: initialValues?.ip || ''
            });
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
                id_DispositivoDetector: initialValues ? initialValues.id_DispositivoDetector : 0,
                descripcion: formData.descripcion.trim(),
                ip: formData.ip.trim()
            };

            if (initialValues) {
                await agent.DispositivosDetectores.update(initialValues.id_DispositivoDetector, payload);
            } else {
                await agent.DispositivosDetectores.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving dispositivo', error);
            alert(getErrorMessage(error, 'Error al guardar el dispositivo.'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const titulo = readOnly ? 'Detalle de Dispositivo' : (initialValues ? 'Editar Dispositivo' : 'Nuevo Dispositivo');
    const inputClass = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border disabled:bg-gray-50 disabled:text-gray-600';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{titulo}</h3>
                    <button onClick={onClose} className="text-white hover:text-blue-100">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {initialValues && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Id</label>
                                <input type="text" value={initialValues.id_DispositivoDetector} disabled className={inputClass} />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={inputClass}
                                required
                                minLength={2}
                                maxLength={30}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">IP</label>
                            <input
                                type="text"
                                name="ip"
                                value={formData.ip}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={inputClass}
                                required
                                maxLength={15}
                                placeholder="192.168.1.50"
                                pattern={PATRON_IPV4}
                                title="Dirección IPv4 válida (por ejemplo, 192.168.1.50)"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {readOnly ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {!readOnly && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Save size={18} />
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DispositivoForm;