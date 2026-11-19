import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent, { getErrorMessage } from '../../api/agent';

const formatoLitros = (n) =>
    Number(n ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Modal de Tanque: alta (CU057), modificación (CU058) y detalle de solo lectura (CU056).
const TanqueForm = ({ isOpen, onClose, onSuccess, initialValues, readOnly = false }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ codigo: '', descripcion: '', volumenMaximo: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                codigo: initialValues?.codigo || '',
                descripcion: initialValues?.descripcion || '',
                volumenMaximo: initialValues?.volumenMaximo ?? ''
            });
        }
    }, [isOpen, initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'codigo' ? value.toUpperCase() : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const volumen = parseFloat(formData.volumenMaximo);
        if (isNaN(volumen) || volumen <= 0) {
            alert('El volumen máximo debe ser mayor que cero.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                id_Tanque: initialValues ? initialValues.id_Tanque : 0,
                codigo: formData.codigo.trim(),
                descripcion: formData.descripcion.trim(),
                volumenMaximo: volumen
            };

            if (initialValues) {
                await agent.Tanques.update(initialValues.id_Tanque, payload);
            } else {
                await agent.Tanques.create(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving tanque', error);
            alert(getErrorMessage(error, 'Error al guardar el tanque.'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const titulo = readOnly ? 'Detalle de Tanque' : (initialValues ? 'Editar Tanque' : 'Nuevo Tanque');
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
                        {readOnly && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Id</label>
                                <input type="text" value={initialValues?.id_Tanque ?? ''} disabled className={inputClass} />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Código</label>
                            <input
                                type="text"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={inputClass}
                                required
                                maxLength={20}
                                pattern="[A-Za-z0-9\-]+"
                                title="Letras, números y guiones (por ejemplo, TK-101)"
                            />
                        </div>

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
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Volumen Máximo (L)</label>
                            <input
                                type="number"
                                name="volumenMaximo"
                                value={formData.volumenMaximo}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={inputClass}
                                required
                                min="0.01"
                                max="99999999.99"
                                step="0.01"
                            />
                        </div>

                        {readOnly && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ocupado (L)</label>
                                    <input type="text" value={formatoLitros(initialValues?.volumenOcupado)} disabled className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Disponible (L)</label>
                                    <input type="text" value={formatoLitros(initialValues?.capacidadDisponible)} disabled className={inputClass} />
                                </div>
                            </div>
                        )}
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

export default TanqueForm;