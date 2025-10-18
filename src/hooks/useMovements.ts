import { ActionsMovements } from "@/types/movement";
import { useState } from "react";
import { toast } from "sonner";

export const useMovements = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [selected, setSelected] = useState<any>(null);

  const [itemName, setItemName] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  const handleCreateMovement = async (
    actionSelected: ActionsMovements,
    countItems: number,
    orderNumber?: string,
    notes?: string,
    fromLocationId?: number,
    toLocationId?: number
  ) => {
    setIsProcessing(true);
    if (!itemName.id) {
      console.error("No se ha seleccionado un Item ID para el movimiento.");
      toast.error("Por favor, selecciona un ítem antes de continuar.");
      setIsProcessing(false);
      return;
    }

    const movementData = {
      item_id: itemName.id,
      movement_type: actionSelected,
      quantity: countItems,
      // Se mantiene la lógica original, asumiendo que 10 es un valor por defecto válido
      from_location_id: fromLocationId || 10,
      to_location_id: toLocationId || 10,
      reason: "Venta o Consumo",
      notes: notes || "Movimiento automático desde la interfaz de inventario.",
      performed_by: "system_user",
      order_number: Number(orderNumber) || null,
    };

    const backendUrl = "https://aux-backend-snlq.onrender.com";
    const url = `${backendUrl}/movements`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movementData),
      });

      // 1. Manejo de la Respuesta Exitosa
      if (response.ok) {
        const createdMovement = await response.json();
        console.log(
          "Registro de movimiento creado con éxito:",
          createdMovement
        );
        toast.success("Movimiento creado con éxito");

        setItemName({ id: "", name: "" });
        setSelected(null);

        return createdMovement;
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Error desconocido." }));

        const errorMessage =
          errorData.detail ||
          `Fallo al crear el movimiento (Error ${response.status}).`;

        console.error(
          `Error ${response.status} al crear el movimiento:`,
          errorMessage
        );

        if (response.status === 409) {
          toast.warning(`Advertencia de stock: ${errorMessage}`, {
            duration: 5000,
          });
        } else if (response.status >= 500) {
          toast.error(
            "Error grave en el servidor. Por favor, inténtalo más tarde.",
            {
              duration: 5000,
            }
          );
          // Lanzamos un error simple para que el catch lo capture como un error "controlado".
          throw new Error(`API Error ${response.status}`);
        } else {
          // Otros errores 4xx (400, 404, etc.)
          toast.error(`Fallo al crear el movimiento: ${errorMessage}`, {
            duration: 5000,
          });
          throw new Error(`API Error ${response.status}`);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      if (!errorMsg.includes("API Error")) {
        console.error("Error de red/conexión:", err);
        toast.error(`Error de conexión o de red: ${errorMsg}`, {
          duration: 5000,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleCreateMovement,
    isProcessing,
    selected,
    setSelected,
    itemName,
    setItemName,
  };
};
