import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useSearchInventory } from "@/hooks/useInventory";

interface AutocompleteInputProps {
  onSelect: (selection: any) => void;
  selected?: any;
  setSelected: (selection: any) => void;
}

export default function AutocompleteInput({
  onSelect,
  selected,
  setSelected,
}: AutocompleteInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Use React Query hook for searching
  const { data: suggestions = [], isLoading } = useSearchInventory(
    debouncedQuery,
    !selected // Only search if no item is selected
  );

  // When the user selects a suggestion
  const handleSelect = (item: any) => {
    setSelected(item);
    setQuery(item.name || item);
    onSelect(item);
  };

  return (
    <div className="relative w-full mx-auto">
      <Input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        placeholder="Escribe para buscar..."
        className="w-full rounded-2xl p-4 dark:text-white focus:ring-2 focus:ring-neon-blue-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500"
      />

      {isLoading && (
        <div className="absolute z-40 left-0 right-0 border bg-background mt-1 p-2 rounded-full">
          Buscando...
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <ul className="absolute z-40 left-0 right-0 bg-background border rounded-lg mt-1 max-h-60 overflow-y-auto shadow">
          {suggestions.map((item: any) => (
            <li
              key={item.id || item.name}
              className="p-2 cursor-pointer hover:bg-red-400"
              onClick={() => handleSelect(item)}
            >
              {item.name || item}
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="mt-4 p-2 bg-red-400 rounded-full text-center">
          <p className="text-sm dark:text-white">
            <strong>Referencia:</strong> {selected.id || selected}
          </p>
        </div>
      )}
    </div>
  );
}
