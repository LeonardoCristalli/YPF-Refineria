import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import agent from '../../api/agent';
import { Scale, AlertCircle } from 'lucide-react';

const PesadaForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [planificaciones, setPlanificaciones] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);

    useEffect(() => {
        // Load available Planning/Transport Orders
        agent.Planificaciones.list()
            .then(data => {
                setPlanificaciones(data);
                setLoadingPlans(false);
            })
            .catch(error => {
                console.error("Error loading planificaciones", error);
                setLoadingPlans(false);
            });
    }, []);

    const onSubmit = async (data) => {
        setStatus('loading');
        try {
            const payload = {
                ...data,
                Id_Planificacion: parseInt(data.Id_Planificacion),
                Cantidad: parseFloat(data.Cantidad),
                ID_Bascula: parseInt(data.ID_Bascula),
                EsIngresoManual: data.EsIngresoManual,
                MotivoIngresoManual: data.MotivoIngresoManual,
                fecha: new Date().toISOString(),
                id_TipoPesada: 1 // Default to Bruto/Inicial
            };
            const response = await agent.Pesadas.create(payload);
            setResult(response);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setResult(error.response); // Capture the error response object
            setStatus('error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                <Scale className="text-blue-600" />
                Registrar Pesada
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* ID Orden Transporte (Select) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Orden de Transporte (Planificación)
                    </label>
                    <select
                        {...register("Id_Planificacion", { required: true })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        defaultValue=""
                    >
                        <option value="" disabled>Seleccione una Orden...</option>
                        {planificaciones.map(p => {
                            const producto = p.ordenTransporte?.ordenDetalle?.producto?.descripcion || 'Producto';
                            const patente = p.ordenTransporte?.vehiculo?.patenteChasis || 'Vehículo';
                            return (
                                <option key={p.id_Planificacion} value={p.id_Planificacion}>
                                    OT #{p.id_OrdenTransporte} - {producto} ({patente}) - {p.cantidadPlanificada} KG
                                </option>
                            );
                        })}
                    </select>
                    {errors.Id_Planificacion && <span className="text-red-500 text-xs">Requerido</span>}
                    {planificaciones.length === 0 && !loadingPlans && (
                         <p className="text-xs text-amber-600 mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1"/> No hay órdenes pendientes.
                        </p>
                    )}
                </div>

                {/* Simulated Scale Reading */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lectura Báscula (kg)
                    </label>
                    <input 
                        {...register("Cantidad", { required: true })} 
                        type="number" 
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        placeholder="0.00"
                    />
                    {errors.Cantidad && <span className="text-red-500 text-xs">Requerido</span>}
                </div>

                {/* ID Bascula */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Báscula</label>
                    <input 
                        {...register("ID_Bascula", { required: true })} 
                        type="number"
                        defaultValue={1}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Motivo Manual */}
                <div className="pt-2">
                    <div className="flex items-center">
                        <input 
                            {...register("EsIngresoManual")} 
                            type="checkbox" 
                            id="manualCheck"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="manualCheck" className="ml-2 block text-sm text-gray-900">Ingreso Manual</label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (si es manual)</label>
                    <textarea 
                        {...register("MotivoIngresoManual")} 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                    />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {status === 'loading' ? 'Registrando...' : 'Registrar Peso'}
                    </button>
                </div>
            </form>

            {status === 'success' && result && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-medium text-green-800 mb-2">✅ Pesada Registrada</h3>
                    <div className="text-sm text-green-700 space-y-1">
                        <p><strong>ID Pesada:</strong> {result.id_Pesada}</p>
                        <p><strong>Tipo:</strong> {result.id_TipoPesada === 1 ? 'Tara (Entrada)' : 'Bruto (Salida)'}</p>
                        <p><strong>Peso Registrado:</strong> {result.cantidad} kg</p>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-medium text-red-800 mb-1">❌ Error</h3>
                    <p className="text-sm text-red-700">
                        {result?.data || "No se pudo registrar la pesada. Verifique la conexión."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PesadaForm;
