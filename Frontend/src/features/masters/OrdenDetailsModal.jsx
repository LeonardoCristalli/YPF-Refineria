import React, { useEffect, useState } from 'react';
import { X, Scale } from 'lucide-react';
import agent from '../../api/agent';

const OrdenDetailsModal = ({ isOpen, onClose, orden }) => {
    const [pesadas, setPesadas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && orden) {
            loadPesadas();
        }
    }, [isOpen, orden]);

    const loadPesadas = async () => {
        setLoading(true);
        try {
            const result = await agent.Pesadas.byOrdenTransporte(orden.id_OrdenTransporte);
            setPesadas(result);
        } catch (error) {
            console.error("Error loading pesadas:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !orden) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Detalle Orden #{orden.id_OrdenTransporte}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Info Card */}
                    <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Producto</span>
                            <p className="text-gray-900 font-medium">{orden.ordenDetalle?.producto?.descripcion || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Transportista</span>
                            <p className="text-gray-900 font-medium">{orden.razonSocialTransportista?.descripcion || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Vehículo</span>
                            <p className="text-gray-900 font-medium">{orden.vehiculo?.patenteChasis || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Conductor</span>
                            <p className="text-gray-900 font-medium">{orden.conductor?.apellido || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Pesadas Table */}
                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                            <Scale size={20} className="text-gray-500" />
                            Registros de Pesada
                        </h4>
                        
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Cargando pesadas...</div>
                        ) : pesadas.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">No hay pesadas registradas para esta orden.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso (kg)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Manual</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pesadas.map((pesada) => (
                                            <tr key={pesada.id_Pesada} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm text-gray-900">#{pesada.id_Pesada}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                        pesada.id_TipoPesada === 1 
                                                            ? 'bg-amber-100 text-amber-800' // Tara (Entrada)
                                                            : 'bg-green-100 text-green-800' // Bruto (Salida)
                                                    }`}>
                                                        {pesada.id_TipoPesada === 1 ? 'Entrada (Tara)' : 'Salida (Bruto)'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm font-bold text-gray-900">{pesada.cantidad} kg</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                    {new Date(pesada.fecha).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 text-right text-sm text-gray-500">
                                                    {pesada.esIngresoManual ? (
                                                        <span title={pesada.motivoIngresoManual} className="cursor-help text-red-500 font-bold">⚠️ Sí</span>
                                                    ) : 'No'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdenDetailsModal;
