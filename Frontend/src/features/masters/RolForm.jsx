import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import agent, { getErrorMessage } from '../../api/agent';

// Modal de Rol: alta (CU06), detalle (CU07) y modificación (CU08), con asignación de puntos de menú.
const RolForm = ({ isOpen, onClose, onSuccess, initialValues, readOnly = false }) => {
    const [loading, setLoading] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [puntosMenu, setPuntosMenu] = useState([]);   // todos los puntos de menú disponibles
    const [seleccionados, setSeleccionados] = useState([]);

    useEffect(() => {
        if (!isOpen) return;
        setDescripcion(initialValues?.descripcion || '');
        setSeleccionados([]);

        agent.PuntosMenu.list().then(setPuntosMenu).catch(() => setPuntosMenu([]));

        // El listado solo trae la cantidad: el detalle trae los puntos asignados.
        if (initialValues?.id_Rol) {
            agent.Roles.details(initialValues.id_Rol)
                .then((rol) => setSeleccionados(rol.puntosMenu || []))
                .catch(() => setSeleccionados([]));
        }
    }, [isOpen, initialValues]);

    const toggle = (id) =>
        setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                id_Rol: initialValues ? initialValues.id_Rol : 0,
                descripcion: descripcion.trim(),
                puntosMenu: seleccionados
            };
            if (initialValues) await agent.Roles.update(initialValues.id_Rol, payload);
            else await agent.Roles.create(payload);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving rol', error);
            alert(getErrorMessage(error, 'Error al guardar el rol.'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const titulo = readOnly ? 'Detalle de Rol' : (initialValues ? 'Editar Rol' : 'Nuevo Rol');
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            disabled={readOnly}
                            className={inputClass}
                            required
                            minLength={3}
                            maxLength={50}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Puntos de menú asignados ({seleccionados.length})
                        </label>
                        <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100">
                            {puntosMenu.map((p) => (
                                <label key={p.id_CasoDeUso} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={seleccionados.includes(p.id_CasoDeUso)}
                                        onChange={() => toggle(p.id_CasoDeUso)}
                                        disabled={readOnly}
                                    />
                                    <span>{p.descripcion}</span>
                                </label>
                            ))}
                            {puntosMenu.length === 0 && (
                                <p className="px-3 py-2 text-sm text-gray-400">No hay puntos de menú disponibles.</p>
                            )}
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

export default RolForm;