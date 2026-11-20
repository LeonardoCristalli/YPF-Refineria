import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent, { getErrorMessage } from '../../api/agent';

// Modal de Puesto de Expedición/Recepción: alta (CU047), modificación (CU048) y detalle de solo lectura (CU046).
const PuestoForm = ({ isOpen, onClose, onSuccess, initialValues, readOnly = false }) => {
    const [loading, setLoading] = useState(false);
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDescripcion(initialValues?.descripcion || '');
        }
    }, [isOpen, initialValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                id_PuestoExpedicionRecepcion: initialValues ? initialValues.id_PuestoExpedicionRecepcion : 0,
                descripcion: descripcion.trim()
            };

            if (initialValues) {
                await agent.Puestos.update(initialValues.id_PuestoExpedicionRecepcion, payload);
            } else {
                await agent.Puestos.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving puesto', error);
            alert(getErrorMessage(error, 'Error al guardar el puesto.'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const titulo = readOnly ? 'Detalle de Puesto' : (initialValues ? 'Editar Puesto' : 'Nuevo Puesto');
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
                                <input type="text" value={initialValues.id_PuestoExpedicionRecepcion} disabled className={inputClass} />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                disabled={readOnly}
                                className={inputClass}
                                required
                                minLength={2}
                                maxLength={50}
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

export default PuestoForm;