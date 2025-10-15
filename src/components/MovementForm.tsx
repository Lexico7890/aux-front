import React, { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import AutocompleteInput from "./AutocompleteInput";
import { useMovements } from "@/hooks/useMovements";
import { ActionsMovements } from "@/types/movement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"

const MovementForm = () => {
  const [formData, setFormData] = useState({
    actionSelected: "" as ActionsMovements,
    origin: "",
    destination: "",
    product: "",
    countItems: "",
    notes: "",
  });
  const {
    handleCreateMovement,
    isProcessing,
    selected,
    setSelected,
    setItemName,
  } = useMovements();
  const [suggestionsLocations, setSuggestionsLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    handleCreateMovement(
      formData.actionSelected,
      Number(formData.countItems),
      "",
      formData.notes,
      Number(formData.origin),
      Number(formData.destination)
    );
  };

  const fetchSuggestionsLocations = async () => {
    try {
      setLoading(true);
      const backendUrl = "https://aux-backend-snlq.onrender.com";

      const url = `${backendUrl}/locations`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Fallo en la búsqueda`);
      }

      const data = await response.json();
      setSuggestionsLocations(data || []);
    } catch (err) {
      console.error("Error buscando coincidencias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestionsLocations();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 dark:bg-dark-800">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
          Tipo de Movimiento
        </label>
        <Select
          onValueChange={(value) =>
            setFormData({
              ...formData,
              actionSelected: value as ActionsMovements,
            })
          }
          value={formData.actionSelected}
          required
        >
          <SelectTrigger className="dark:bg-dark-700 bg-white w-full dark:text-white">
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent className="dark:bg-dark-700 bg-white dark:text-white">
            <SelectItem value="TRASLADO">Traslado a Taller</SelectItem>
            <SelectItem value="INGRESO_TALLER">Ingreso Desde Taller</SelectItem>
            <SelectItem value="INGRESO_BODEGA">Ingreso Desde Bodega</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
            Origen
          </label>
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                origin: value,
              })
            }
            value={formData.origin}
            required
          >
            <SelectTrigger className="dark:bg-dark-700 bg-white w-full dark:text-white">
              <SelectValue placeholder="Selecciona un origen" />
            </SelectTrigger>
            <SelectContent className="dark:bg-dark-700 bg-white dark:text-white">
              {suggestionsLocations.map((item: any) => (
                <SelectItem key={item.id || item.name} value={item.id || item}>
                  {item.name || item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
            Destino
          </label>
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                destination: value,
              })
            }
            value={formData.destination}
            required
          >
            <SelectTrigger className="dark:bg-dark-700 bg-white w-full dark:text-white">
              <SelectValue placeholder="Selecciona un destino" />
            </SelectTrigger>
            <SelectContent className="dark:bg-dark-700 bg-white dark:text-white">
              {suggestionsLocations.map((item: any) => (
                <SelectItem key={item.id || item.name} value={item.id || item}>
                  {item.name || item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
          Producto
        </label>
        <AutocompleteInput
          onSelect={setItemName}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
          Cantidad
        </label>
        <Input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          required
          value={formData.countItems}
          onChange={(e) =>
            setFormData({ ...formData, countItems: e.target.value })
          }
          className="dark:bg-dark-700 bg-white w-full dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
          Notas (Opcional)
        </label>
        <Textarea 
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="dark:bg-dark-700 bg-white w-full dark:text-white"
          placeholder="Comentarios adicionales..."
        />
      </div>

      <button
        type="submit"
        disabled={
          isProcessing ||
          !formData.actionSelected ||
          !formData.origin ||
          !formData.destination ||
          !selected
        }
        className="w-full bg-neon-blue-600 text-white py-3 px-4 rounded-lg hover:bg-neon-blue-glow transition-colors font-medium flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Registrando...
          </>
        ) : (
          <>
            <Save className="h-5 w-5 mr-2" />
            Registrar Movimiento
          </>
        )}
      </button>
    </form>
  );
};

export default MovementForm;
