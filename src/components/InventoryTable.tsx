// src/components/InventoryForm.tsx
import React, { useState } from 'react';
import { useCreateInventoryItem } from '@/hooks/useInventory';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const InventoryForm = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(0);

  // ✅ Usar React Query mutation
  const createItem = useCreateInventoryItem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !name) {
      toast.error('El ID y el Nombre son obligatorios');
      return;
    }

    try {
      await createItem.mutateAsync({
        id,
        name,
        description: description || undefined,
        category: category || undefined,
        stock,
        min_stock: minStock,
      });

      // Limpiar formulario
      setId('');
      setName('');
      setDescription('');
      setCategory('');
      setStock(0);
      setMinStock(0);

      toast.success(`Ítem "${name}" creado con éxito!`);
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el ítem');
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-100">
      <div className="flex items-center mb-4">
        <Plus className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">
          Agregar Nuevo Ítem
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            ID (Referencia)*
          </label>
          <input
            type="text"
            name="id"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="SKU-001"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del Producto*
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="Tornillo M6"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="Descripción del producto..."
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="Ferretería"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock Actual
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
              Stock Mínimo
            </label>
            <input
              type="number"
              name="minStock"
              id="minStock"
              value={minStock}
              onChange={(e) => setMinStock(Number(e.target.value))}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createItem.isPending || !id || !name}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {createItem.isPending ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Creando...
            </>
          ) : (
            'Guardar Ítem'
          )}
        </button>
      </form>
    </div>
  );
};

export default InventoryForm;