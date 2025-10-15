import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Asegúrate de que esta URL sea la correcta para tu backend
const BACKEND_URL = "https://aux-backend-snlq.onrender.com";

const getBadgeStyle = (movementType: any) => {
  switch (movementType) {
    case "TRASLADO":
      return {
        color: "bg-yellow-500/30 hover:bg-yellow-500/50",
        text: "TRASLADO",
        border: "border-neon-yellow-glow",
        badge: "bg-neon-yellow-glow",
      };
    case "INGRESO_TALLER":
      return {
        color: "bg-green-500/30 hover:bg-green-500/50",
        text: "INGRESO TALLER",
        border: "border-neon-green-glow",
        badge: "bg-neon-green-glow",
      };
    case "INGRESO_BODEGA":
      return {
        color: "bg-blue-500/30 hover:bg-blue-500/50",
        text: "INGRESO BODEGA",
        border: "border-neon-blue-glow",
        badge: "bg-neon-blue-glow",
      };
    default:
      return {
        color: "bg-gray-400/30 hover:bg-gray-400/50",
        text: "TECNICO",
        border: "border-gray-400",
        badge: "bg-gray-400",
      };
  }
};

const LastMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Función para llamar al endpoint paginado de movimientos con filtros opcionales.
   * * @param {object} filterParams - Objeto con los parámetros de la consulta.
   * @param {number} filterParams.skip - Número de registros a omitir (offset).
   * @param {number} filterParams.limit - Máximo número de registros a retornar.
   * @param {string} [filterParams.movement_type] - Tipo de movimiento para filtrar.
   * @param {number} [filterParams.from_location_id] - ID de la ubicación de origen.
   * @param {number} [filterParams.to_location_id] - ID de la ubicación de destino.
   * @param {Date | string} [filterParams.created_at_start] - Fecha de inicio del rango.
   * @param {Date | string} [filterParams.created_at_end] - Fecha de fin del rango.
   * @returns {Promise<Array<object>>} Una promesa que resuelve con la lista de movimientos.
   */
  const fetchMovements = async (filterParams: any) => {
    setLoading(true);
    const params = new URLSearchParams();

    // Iterar sobre las claves del objeto filterParams
    for (const key in filterParams) {
      let value = filterParams[key];

      if (value instanceof Date) {
        value = value.toISOString();
      }

      // Solo agregar el parámetro si tiene un valor definido y no es null
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    }

    const url = `${BACKEND_URL}/movements/?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        // Intenta leer el detalle del error si está disponible
        const errorDetail = await response
          .json()
          .catch(() => ({ detail: "Error desconocido" }));
        throw new Error(
          `Error ${response.status}: ${errorDetail.detail || "Fallo al obtener movimientos"}`
        );
      }

      const data = await response.json();
      setMovements(data);
      setError(null); // Limpiar cualquier error previo
      return data;
    } catch (error: any) {
      console.error("Error al obtener movimientos paginados:", error.message);
      setError(error.message);
      setMovements([]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements(null);
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Cargando movimientos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 border border-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No se encontraron movimientos recientes.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-max">
      {movements.map((movement: any) => {
        const { color, text, border, badge } = getBadgeStyle(
          movement.movement_type
        );

        let timeAgo = "";
        try {
          timeAgo = formatDistanceToNow(new Date(movement.created_at), {
            addSuffix: true,
            locale: es,
          });
        } catch (e) {
          timeAgo = "Fecha desconocida";
        }

        return (
          <div
            key={movement.id}
            className={`${color} ${border} border-l-4 p-2 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-lg text-white">
                  {movement.item_id} (x{movement.quantity})
                </p>
                <p className="text-sm text-gray-300">
                  Razón: {movement.notes || "N/A"}
                </p>
                <p className="text-xs text-gray-200 mt-1">{timeAgo}</p>
              </div>
              <Badge
                className={`${badge} rounded-full text-white font-semibold text-xs py-1 px-3`}
              >
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
