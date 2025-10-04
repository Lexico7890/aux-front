import React, { useState, useEffect } from "react";

export default function AutocompleteInput() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [timer, setTimer] = useState<any>(null);

  // --- Ejecuta la búsqueda con 2s de debounce ---
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Limpiar cualquier temporizador previo
    if (timer) clearTimeout(timer);

    // Crear nuevo temporizador
    const newTimer = setTimeout(() => {
      fetchSuggestions(query);
    }, 2000); // 2 segundos

    setTimer(newTimer);

    // Limpieza al desmontar o cambiar query
    return () => clearTimeout(newTimer);
  }, [query]);

  // --- Llamada al endpoint ---
  const fetchSuggestions = async (text: any) => {
    try {
      setLoading(true);
      // Cambia esta URL por tu endpoint real:
      const response = await fetch(`/api/items/search?query=${encodeURIComponent(text)}`);
      const data = await response.json();
      setSuggestions(data || []);
    } catch (err) {
      console.error("Error buscando coincidencias:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Cuando el usuario selecciona una sugerencia ---
  const handleSelect = (item: any) => {
    setSelected(item);
    setQuery(item.name || item); // muestra en el input
    setSuggestions([]); // cierra el listado
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-6">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        placeholder="Escribe para buscar..."
        className="w-full p-4 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 sm:dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neon-blue-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-dark-400"
      />

      {loading && (
        <div className="absolute left-0 right-0 bg-white border rounded-lg mt-1 p-2 text-gray-500">
          Buscando...
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow">
          {suggestions.map((item: any) => (
            <li
              key={item.id || item.name}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item.name || item}
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            <strong>Seleccionado:</strong> {selected.name || selected}
          </p>
        </div>
      )}
    </div>
  );
}
