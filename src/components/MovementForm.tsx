import React, { useEffect, useState } from 'react';
import { ArrowRight, Save, Loader2 } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';

const MovementForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    origin: '',
    destination: '',
    product: '',
    quantity: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestionsLocations, setSuggestionsLocations] = useState([]);
  const [text, setText] = useState('');
  const [itemName, setItemName] = useState<{ id: string, name: string }>({ id: "", name: "" });
  const [selected, setSelected] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Movimiento registrado correctamente');
      setFormData({
        type: '',
        origin: '',
        destination: '',
        product: '',
        quantity: '',
        notes: ''
      });
    }, 1500);
  };

  const handleChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fetchSuggestionsLocations = async () => {
    try {
      setLoading(true);
      const backendUrl = "https://aux-backend-snlq.onrender.com";

      const url = `${backendUrl}/locations`;

      const response = await fetch(url);

      // Si usas TypeScript, asegúrate de que el estado acepte el tipo de datos correcto
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
    fetchSuggestionsLocations()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimiento</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona tipo</option>
          <option value="taller-taller">Taller ↔ Taller</option>
          <option value="taller-tecnico">Taller ↔ Técnico</option>
          <option value="entrada">Entrada de Stock</option>
          <option value="salida">Salida de Stock</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Origen</label>
          <select
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona origen</option>
            {suggestionsLocations.map((item: any) => (
              <option key={item.id || item.name} value={item.name || item}>
                {item.name || item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona destino</option>
            {suggestionsLocations.map((item: any) => (
              <option key={item.id || item.name} value={item.name || item}>
                {item.name || item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
        <AutocompleteInput onSelect={setItemName} selected={selected} setSelected={setSelected} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa cantidad"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas (Opcional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Comentarios adicionales..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
      >
        {isSubmitting ? (
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