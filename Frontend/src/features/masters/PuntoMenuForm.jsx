import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent, { getErrorMessage } from '../../api/agent';

// Modal de Punto de Menú: modificación (CU03) y detalle de solo lectura (CU02).
// No hay alta: los puntos de menú los define el sistema.
const PuntoMenuForm = ({ isOpen, onClose, onSuccess, initialValues, readOnly = false }) => {
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNombre(initialValues?.descripcion || '');
        }
    }, [isOpen, initialValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await agent.PuntosMenu.update(initialValues.id_CasoDeUso, {
                id_CasoDeUso: initialValues.id_CasoDeUso,
                descripcion: nombre.trim()
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving punto de menu', error);
            alert(getErrorMessage(error, 'Error al guardar el punto de menú.'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !initialValues) return null;

    const titulo = readOnly ? 'Detalle de Punto de Menú' : 'Editar Punto de Menú';
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Código</label>
                            <input type="text" value={initialValues.id_CasoDeUso} disabled className={inputClass} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                disabled={readOnly}
                                className={inputClass}
                                required
                                maxLength={250}
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

export default PuntoMenuForm;