import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Loader2, DoorOpen, DoorClosed } from "lucide-react";
import AutocompleteInput from "./AutocompleteInput";
import { Slider } from "@/components/ui/slider";

const ENUM_ACTIONS = {
  SALIDA_COTIZACION: "salida_cotizacion",
  ENTRADA_COTIZACION: "entrada_cotizacion",
  SALIDA_PRESTAMO: "salida_prestamo",
  ENTRADA_PRESTAMO: "entrada_prestamo",
  SALIDA_GARANTIA: "salida garantia",
  ENTRADA_GARANTIA: "entrada garantia",
};

const MovementCoworkers = () => {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [itemName, setItemName] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  const [countItems, setCountItems] = useState<number>(1);
  const [actionSelected, setActionSelected] =
    useState<keyof typeof ENUM_ACTIONS>("SALIDA_COTIZACION");

  const handleCreateMovement = async (e: any) => {
    e.preventDefault();
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
      notes: "Movimiento automático desde la interfaz de inventario.",
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
        throw new Error(`Fallo al crear el movimiento: ${errorData.detail}`);
      }
    } catch (err) {
      console.error("Error de red o de la aplicación:", err);
      // Aquí puedes manejar la UI para mostrar un error al usuario
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto sm:p-6">
      <div className="sm:bg-white sm:dark:bg-dark-800 dark:bg-dark-700 rounded-2xl sm:shadow-lg dark:shadow-2xl sm:border border-gray-200 dark:border-dark-700 p-8">
        {/* Voice Button */}

        {/* Text Input */}
        <form onSubmit={handleCreateMovement} className="space-y-4">
          <div className="relative">
            <div className="grid sm:grid-cols-3 grid-cols-1 sm:gap-4 sm:mb-4">
              <div className="col-span-1 mb-4 sm:mb-0">
                <input
                  placeholder="Numero de Orden"
                  onChange={(e) => setOrderNumber(e.target.value)}
                  type="number"
                  value={orderNumber}
                  className="w-full p-4 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 sm:dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neon-blue-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-dark-400"
                />
              </div>
              <div className="col-span-2 mb-4 sm:mb-0">
                <AutocompleteInput
                  onSelect={setItemName}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
              <div className="col-span-3 flex items-center gap-4 mx-4">
                <span className="text-gray-700 dark:text-dark-300 font-semibold text-lg">{countItems}</span>
                <Slider
                  defaultValue={[1]}
                  max={10}
                  min={1}
                  step={1}
                  value={[countItems]}
                  className="bg-neon-blue-500 text-black h-4 rounded-full"
                  onValueChange={(value) => setCountItems(value[0])}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!selected || Number(orderNumber) < 9999}
              className="bottom-3 right-3 p-2 bg-neon-blue-500 hover:bg-neon-blue-400 text-white rounded-lg hover:shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-neon-blue-400 w-full"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <p className="flex items-center justify-center w-full">
                  Enviar
                </p>
              )}
            </button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-2 gap-3">
          <button
            onClick={() => setActionSelected("SALIDA_COTIZACION")}
            className={
              actionSelected === "SALIDA_COTIZACION"
                ? "p-3 text-sm rounded-lg transition-all duration-300 border border-transparent disabled:opacity-50 bg-neon-purple-500 text-white shadow-lg shadow-neon-purple-500/50"
                : "p-3 text-sm bg-gray-100 dark:bg-dark-800 sm:dark:bg-dark-700 hover:bg-neon-purple-500/10 dark:hover:bg-neon-purple-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-purple-400 hover:border-neon-purple-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-purple/20 disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorOpen /> Salida Cotizacion
            </p>
          </button>
          <button
            onClick={() => setActionSelected("ENTRADA_COTIZACION")}
            className={
              actionSelected === "ENTRADA_COTIZACION"
                ? "p-3 text-sm rounded-lg transition-all duration-300 border border-transparent disabled:opacity-50 bg-neon-green-500 text-white shadow-lg shadow-neon-green-500/50"
                : "p-3 text-sm bg-gray-100 dark:bg-dark-800 sm:dark:bg-dark-700 hover:bg-neon-green-500/10 dark:hover:bg-neon-green-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-green-400 hover:border-neon-green-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-green/20 disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorClosed /> Entrada contizacion
            </p>
          </button>
          <button
            onClick={() => setActionSelected("SALIDA_PRESTAMO")}
            className={
              actionSelected === "SALIDA_PRESTAMO"
                ? "p-3 text-sm rounded-lg transition-all duration-300 border border-transparent disabled:opacity-50 bg-neon-yellow-500 text-white shadow-lg shadow-neon-yellow-500/50"
                : "p-3 text-sm bg-gray-100 dark:bg-dark-800 sm:dark:bg-dark-700 hover:bg-neon-yellow-500/10 dark:hover:bg-neon-yellow-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-yellow-400 hover:border-neon-yellow-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-yellow/20 disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorOpen /> Salida prestamo
            </p>
          </button>
          <button
            onClick={() => setActionSelected("ENTRADA_PRESTAMO")}
            className={
              actionSelected === "ENTRADA_PRESTAMO"
                ? "p-3 text-sm rounded-lg transition-all duration-300 border border-transparent disabled:opacity-50 bg-neon-pink-500 text-white shadow-lg shadow-neon-pink-500/50"
                : "p-3 text-sm bg-gray-100 dark:bg-dark-800 sm:dark:bg-dark-700 hover:bg-neon-pink-500/10 dark:hover:bg-neon-pink-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-pink-400 hover:border-neon-pink-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-pink/20 disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorClosed /> Entrada prestamo
            </p>
          </button>
          <button
            onClick={() => setActionSelected("SALIDA_GARANTIA")}
            className={
              actionSelected === "SALIDA_GARANTIA"
                ? "p-3 text-sm rounded-lg transition-all duration-300 border border-transparent disabled:opacity-50 bg-neon-red-500 text-white shadow-lg shadow-neon-red-500/50"
                : "p-3 text-sm bg-gray-100 dark:bg-dark-800 sm:dark:bg-dark-700 hover:bg-neon-red-500/10 dark:hover:bg-neon-red-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-red-400 hover:border-neon-red-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-red/20 disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorOpen /> Salida Garantia
            </p>
          </button>
          <button
            onClick={() => setActionSelected("ENTRADA_GARANTIA")}
            className={
              actionSelected === "ENTRADA_GARANTIA"
                ? "p-3 text-sm rounded-lg transition-all duration-300 border border-transparent disabled:opacity-50 bg-neon-orange-500 text-white shadow-lg shadow-neon-orange-500/50"
                : "p-3 text-sm bg-gray-100 dark:bg-dark-800 sm:dark:bg-dark-700 hover:bg-neon-orange-500/10 dark:hover:bg-neon-orange-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-orange-400 hover:border-neon-orange-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-orange/20 disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorClosed /> Entrada Garantia
            </p>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-dark-800 sm:dark:bg-dark-700 rounded-lg border border-blue-200 dark:border-dark-600">
          <p className="text-xs text-gray-600 dark:text-dark-400 text-center">
            💡 <strong>Tip:</strong> Mantén presionado el botón del micrófono
            mientras hablas. El audio se enviará automáticamente cuando lo
            sueltes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovementCoworkers;
