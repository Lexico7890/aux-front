import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from 'date-fns/locale'; // Importamos el locale español

// URL base de tu backend (Asegúrate de que esta URL sea correcta)
const BACKEND_URL = "https://aux-backend-snlq.onrender.com";

// Función para mapear el tipo de movimiento a un estilo de badge
const getBadgeStyle = (movementType: any) => {
    switch (movementType) {
        case 'TRASLADO':
            return { color: 'bg-yellow-500/80 hover:bg-yellow-500', text: 'TRASLADO' };
        case 'INGRESO_TALLER':
            return { color: 'bg-green-500/80 hover:bg-green-500', text: 'INGRESO TALLER' };
        case 'INGRESO_BODEGA':
            return { color: 'bg-blue-500/80 hover:bg-blue-500', text: 'INGRESO BODEGA' };
        default:
            return { color: 'bg-gray-400/80 hover:bg-gray-400', text: 'OTRO' };
    }
};

const LastMovements = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMovements = async () => {
        setLoading(true);
        setError(null);
        try {
            // Llama al nuevo endpoint filtrado
            const url = `${BACKEND_URL}/movements/search-transfers?limit=10`; 
            
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudieron cargar los movimientos.`);
            }

            const data = await response.json();
            setMovements(data);
        } catch (err) {
            console.error("Error al buscar movimientos:", err);
            setError("Fallo al conectar con el servidor para cargar los movimientos recientes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovements();
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Cargando movimientos...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500 border border-red-500 rounded-lg">{error}</div>;
    }
    
    if (movements.length === 0) {
        return <div className="p-4 text-center text-gray-500">No se encontraron movimientos recientes.</div>;
    }

    return (
        <div className="space-y-3">
            {movements.map((movement: any) => {
                const { color, text } = getBadgeStyle(movement.movement_type);
                
                // Formatear la fecha para mostrar hace cuánto tiempo ocurrió el movimiento
                let timeAgo = '';
                try {
                    timeAgo = formatDistanceToNow(new Date(movement.created_at), { addSuffix: true, locale: es });
                } catch (e) {
                    timeAgo = 'Fecha desconocida';
                }

                return (
                    // Usamos el ID del movimiento como key, importante para React
                    <div key={movement.id} className="border-l-4 border-neon-blue-glow p-2 dark:bg-gray-800/50 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-lg text-white">
                                    {movement.item_id} (x{movement.quantity})
                                </p>
                                <p className="text-sm text-gray-400">
                                    Razón: {movement.reason || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {timeAgo}
                                </p>
                            </div>
                            <Badge className={`${color} rounded-full text-white font-semibold text-xs py-1 px-3`}>
                                {text}
                            </Badge>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LastMovements;