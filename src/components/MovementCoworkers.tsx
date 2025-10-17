import React, { useState } from "react";
import { Loader2, DoorOpen, DoorClosed } from "lucide-react";
import AutocompleteInput from "./AutocompleteInput";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner"
import { useMovements } from "@/hooks/useMovements";
import { ActionsMovements } from "@/types/movement";
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";

const MovementCoworkers = () => {


  const [countItems, setCountItems] = useState<number>(1);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [actionSelected, setActionSelected] =
    useState<ActionsMovements>(ActionsMovements.SALIDA_COTIZACION);

  const { handleCreateMovement, isProcessing, selected, setSelected, setItemName } = useMovements()

  const submitForm = async (e: any) => {
    e.preventDefault()
    handleCreateMovement(actionSelected, countItems, orderNumber)
    setOrderNumber("");
    setCountItems(1);
  }


  return (
    <div className="w-full max-w-2xl mx-auto sm:p-6">
      <div className="rounded-2xl sm:shadow-lg dark:shadow-2xl sm:border border-gray-200 p-8">
        {/* Voice Button */}

        {/* Text Input */}
        <form onSubmit={submitForm} className="space-y-4">
          <div className="relative">
            <div className="grid sm:grid-cols-3 grid-cols-1 sm:gap-4 sm:mb-4">
              <div className="sm:col-span-1 col-span-3 mb-4 sm:mb-0">
                <Input
                  placeholder="Numero de Orden"
                  onChange={(e) => setOrderNumber(e.target.value)}
                  type="number"
                  value={orderNumber}
                  className="w-full p-4 border border-gray-300 bg-white text-gray-900 rounded-2xl focus:ring-2 focus:ring-neon-blue-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-dark-400"
                />
              </div>
              <div className="col-span-2 mb-4 sm:mb-0">
                <AutocompleteInput
                  onSelect={setItemName}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
              <div className="col-span-3 flex items-center gap-2 p-2 rounded-2xl">
                <span className="text-gray-700 dark:text-dark-300 font-semibold text-lg mx-4">{countItems}</span>
                <Slider
                  defaultValue={[1]}
                  max={10}
                  min={1}
                  step={1}
                  value={[countItems]}
                  className="text-black h-4 rounded-2xl"
                  onValueChange={(value) => setCountItems(value[0])}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!selected || Number(orderNumber) < 9999 || isProcessing}
              className="bottom-3 right-3 p-2 text-white rounded-2xl hover:shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-neon-blue-400 w-full"
            >
              <p className="flex items-center justify-center w-full">
                {isProcessing ? (
                  <>
                    Creando Registro...
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  "Crear Registro"
                )}
              </p>
            </Button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-3">
          <Button
            onClick={() => setActionSelected(ActionsMovements.SALIDA_COTIZACION)}
            variant="default"
            className={
              actionSelected === ActionsMovements.SALIDA_COTIZACION
                ? "p-3 text-sm bg-red-400 transition-all duration-300 border border-transparent disabled:opacity-50 shadow-lg"
                : "p-3 text-sm transition-all duration-300 border border-transparent disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorOpen /> Salida Cotizacion
            </p>
          </Button>
          <Button
            onClick={() => setActionSelected(ActionsMovements.ENTRADA_COTIZACION)}
            className={
              actionSelected === ActionsMovements.ENTRADA_COTIZACION
                ? "p-3 text-sm bg-red-400 transition-all duration-300 border border-transparent disabled:opacity-50 shadow-lg"
                : "p-3 text-sm transition-all duration-300 border border-transparent disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorClosed /> Entrada contizacion
            </p>
          </Button>
          <Button
            onClick={() => setActionSelected(ActionsMovements.SALIDA_PRESTAMO)}
            className={
              actionSelected === ActionsMovements.SALIDA_PRESTAMO
                ? "p-3 text-sm rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50 text-white shadow-lg"
                : "p-3 text-sm bg-gray-100 text-gray-700 rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorOpen /> Salida prestamo
            </p>
          </Button>
          <Button
            onClick={() => setActionSelected(ActionsMovements.ENTRADA_PRESTAMO)}
            className={
              actionSelected === ActionsMovements.ENTRADA_PRESTAMO
                ? "p-3 text-sm rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50 shadow-lg"
                : "p-3 text-sm bg-gray-100 text-gray-700 rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorClosed /> Entrada prestamo
            </p>
          </Button>
          <Button
            onClick={() => setActionSelected(ActionsMovements.SALIDA_GARANTIA)}
            className={
              actionSelected === ActionsMovements.SALIDA_GARANTIA
                ? "p-3 text-sm rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50 shadow-lg"
                : "p-3 text-sm bg-gray-100 text-gray-700 rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorOpen /> Salida Garantia
            </p>
          </Button>
          <Button
            onClick={() => setActionSelected(ActionsMovements.ENTRADA_GARANTIA)}
            className={
              actionSelected === ActionsMovements.ENTRADA_GARANTIA
                ? "p-3 text-sm rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50 text-white shadow-lg"
                : "p-3 text-sm bg-gray-100 text-gray-700 rounded-2xl transition-all duration-300 border border-transparent disabled:opacity-50"
            }
          >
            <p className="flex items-center justify-start w-full gap-2">
              <DoorClosed /> Entrada Garantia
            </p>
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
          <p className="text-xs text-gray-600 text-center">
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
