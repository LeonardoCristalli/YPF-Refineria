import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Plus, AlertTriangle, X, Search } from 'lucide-react';

// Modal de confirmación de eliminación (baja lógica)
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">Confirmar eliminación</h3>
                        <p className="text-slate-500 text-sm mt-1">Esta acción no se puede deshacer.</p>
                    </div>
                </div>
                {itemName && (
                    <div className="bg-slate-50 rounded-xl px-4 py-3 mb-5 border border-slate-100">
                        <p className="text-sm text-slate-600">Se dará de baja lógica al registro: <span className="font-bold text-slate-800">{itemName}</span></p>
                    </div>
                )}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors active:scale-95"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Tabla CRUD genérica con baja lógica y diseño premium
const CrudTable = ({
    title,
    agent,
    columns,
    idField = 'id',
    nameField,       // campo para mostrar en el modal de confirmación
    onCreate,
    onEdit,
    onDelete,
    actions
}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: null });

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

    const handleDeleteClick = (item) => {
        setDeleteModal({
            open: true,
            id: item[idField],
            name: nameField ? item[nameField] : null,
            item
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            if (onDelete) {
                await onDelete(deleteModal.id);
            } else {
                await agent.delete(deleteModal.id);
            }
            setDeleteModal({ open: false, id: null, name: null });
            loadData();
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error al eliminar el registro.");
        }
    };

    const filtered = data.filter(item =>
        columns.some(col =>
            String(item[col.field] ?? '').toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="space-y-6">
            <ConfirmDeleteModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null, name: null })}
                onConfirm={handleDeleteConfirm}
                itemName={deleteModal.name}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                    <p className="text-slate-500 text-sm mt-0.5">{data.length} registro{data.length !== 1 ? 's' : ''} activo{data.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={onCreate}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> Nuevo
                </button>
            </div>

            {/* Search bar */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-slate-50/70 border-b border-slate-100">
                                {columns.map((col, idx) => (
                                    <th key={idx} className="px-6 py-4 font-bold">{col.header}</th>
                                ))}
                                <th className="px-6 py-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={columns.length + 1} className="px-6 py-5">
                                            <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Search size={36} className="opacity-20" />
                                            <p className="font-medium text-sm">No se encontraron registros</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item[idField]} className="hover:bg-slate-50/80 transition-colors group">
                                        {columns.map((col, idx) => (
                                            <td key={idx} className="px-6 py-4 text-sm text-slate-700">
                                                {col.render ? col.render(item) : (
                                                    <span className={idx === 0 ? 'font-bold text-slate-500' : 'font-medium'}>
                                                        {item[col.field] ?? '-'}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Custom Actions */}
                                                {actions && actions(item)}

                                                {/* Edit Button */}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        title="Editar"
                                                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                )}

                                                {/* Delete Button (Baja Lógica) */}
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    title="Dar de baja"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CrudTable;
