import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';

// A generic table component that handles fetching and displaying data
const CrudTable = ({ 
    title, 
    agent, 
    columns, 
    idField = 'id',
    onCreate, // Optional custom handler
    onEdit,    // Optional custom handler
    actions   // Optional function(item) that returns ReactNode
}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await agent.list();
            setData(result);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar este registro?')) {
            try {
                await agent.delete(id);
                loadData(); // Refresh
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Error al eliminar");
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button 
                    onClick={onCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={18} /> Nuevo
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={columns.length + 1} className="p-4 text-center">Cargando...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">No hay registros</td></tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item[idField]}>
                                    {columns.map((col, idx) => (
                                        <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {col.render ? col.render(item) : item[col.field]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                        {/* Custom Actions */}
                                        {actions && actions(item)}

                                        {onEdit && (
                                            <button 
                                                onClick={() => onEdit(item)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(item[idField])}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CrudTable;
