// src/components/InventoryTable.tsx
import React, { useState } from 'react';
import { useInventory, useUpdateInventoryItem } from '@/hooks/useInventory';
import { Package, Loader2, AlertTriangle, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { InventoryItem } from '@/lib/api';

const InventoryTable = () => {
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});

  // ✅ Usar React Query para obtener los datos
  const { data, isLoading, error, isError } = useInventory({
    sortBy,
    sortOrder,
  });

  // ✅ Usar React Query mutation para actualizar
  const updateItem = useUpdateInventoryItem();

  const handleSort = (column: 'name' | 'stock' | 'category') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      await updateItem.mutateAsync({
        id: editingId,
        data: editForm,
      });
      setEditingId(null);
      setEditForm({});
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el ítem');
    }
  };

  const isLowStock = (item: InventoryItem) => {
    return item.stock <= item.min_stock;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-gray-600">Cargando inventario...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-white shadow-xl rounded-lg border border-red-200">
        <div className="flex items-center text-red-600">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <div>
            <h3 className="font-semibold">Error al cargar el inventario</h3>
            <p className="text-sm text-red-500">{(error as Error)?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">
          Inventario Actual
        </h2>
        <span className="ml-auto text-sm text-gray-500">
          {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No hay ítems en el inventario</p>
          <p className="text-sm">Agrega tu primer ítem usando el formulario</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Producto
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Categoría
                    {sortBy === 'category' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center">
                    Stock
                    {sortBy === 'stock' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`${
                    isLowStock(item) ? 'bg-red-50' : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.category || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {item.category || 'Sin categoría'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editForm.stock || 0}
                        onChange={(e) =>
                          setEditForm({ ...editForm, stock: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${
                            isLowStock(item) ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {item.stock}
                        </span>
                        {isLowStock(item) && (
                          <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editForm.min_stock || 0}
                        onChange={(e) =>
                          setEditForm({ ...editForm, min_stock: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      item.min_stock
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {editingId === item.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          disabled={updateItem.isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {updateItem.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={updateItem.isPending}
                          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leyenda de alertas de stock bajo */}
      {items.some(isLowStock) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span>
            Algunos ítems tienen stock bajo o están agotados
          </span>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
