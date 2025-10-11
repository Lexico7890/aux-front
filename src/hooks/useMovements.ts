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
    const handleCreateMovement = async (actionSelected: ActionsMovements,
        countItems: number,
        orderNumber: string,
        notes?: string
    ) => {
        setIsProcessing(true);
        if (!itemName.id) {
            console.error("No se ha seleccionado un Item ID para el movimiento.");
            return;
        }

        const movementData = {
            item_id: itemName.id,
            movement_type: actionSelected,
            quantity: countItems,
            from_location_id: 10,
            to_location_id: 10,
            reason: "Venta o Consumo",
            notes: notes || "Movimiento automático desde la interfaz de inventario.",
            performed_by: "system_user",
            order_number: Number(orderNumber),
        };

        const backendUrl = "https://aux-backend-snlq.onrender.com";
        const url = `${backendUrl}/movements/`; // El endpoint POST es la ruta raíz

        try {
            const response = await fetch(url, {
                method: "POST", // 🚨 CAMBIO CRÍTICO: Debe ser POST
                headers: {
                    "Content-Type": "application/json", // Informa al servidor que enviamos JSON
                },
                body: JSON.stringify(movementData), // Convierte el objeto a una cadena JSON
            });

            // 3. Manejo de la Respuesta
            if (response.ok) {
                const createdMovement = await response.json();
                console.log(
                    "Registro de movimiento creado con éxito:",
                    createdMovement
                );
                // Aquí puedes limpiar el formulario o mostrar una notificación de éxito
                toast.success("Movimiento creado con éxito");

                setItemName({ id: "", name: "" });
                setSelected(null);

                return createdMovement;
            } else {
                // Manejo de errores 4xx y 5xx
                const errorData = await response
                    .json()
                    .catch(() => ({ detail: "Error desconocido." }));
                console.error(
                    `Error ${response.status} al crear el movimiento:`,
                    errorData.detail
                );
                toast.error(`Fallo al crear el movimiento: ${errorData.detail}`)
                throw new Error(`Fallo al crear el movimiento: ${errorData.detail}`);
            }
        } catch (err) {
            console.error("Error de red o de la aplicación:", err);
            toast.error("Error de red o de la aplicación")
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
        setItemName
    }
}
