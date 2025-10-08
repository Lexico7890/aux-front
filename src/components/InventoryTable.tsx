import React, { useState, useEffect, useCallback } from 'react';
import { Search, Package, ArrowUp, ArrowDown } from 'lucide-react';

// Define la estructura de datos que esperamos de la API
interface InventoryItem {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    // CAMBIO 1: 'unit' eliminado y asumimos que la API devuelve 'current_stock' y 'min_stock'
    location_id: number | null;
    min_stock: number | null;
    current_stock: number | null;
    // CAMBIO 2: Si el API tiene un campo llamado 'stock' para la unidad de medida, lo añadimos
    // Si tu cambio en el API fue de 'unit' a 'stock', lo reflejamos aquí:
    stock: string | null; 
    created_at: string | null;
    updated_at: string | null;
}

// Define la estructura de la respuesta paginada de la API
interface PaginatedResponse {
    total_count: number;
    page_count: number;
    limit: number;
    page: number;
    items: InventoryItem[];
}

const InventoryTable = () => {
    // URL base de tu backend
    const backendUrl = "https://aux-backend-snlq.onrender.com";

    // --- ESTADOS DE DATOS Y CARGA ---
    const [data, setData] = useState<PaginatedResponse>({
        total_count: 0,
        page_count: 0,
        limit: 10, // Default limit
        page: 1,   // Default page
        items: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- ESTADOS DE PAGINACIÓN Y ORDENACIÓN (controlan la API) ---
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState('created_at'); // Columna por defecto
    const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
    
    // --- ESTADOS DE FILTRO (no paginados, se aplican sobre la data actual si son pocos items) ---
    // NOTA: Para un rendimiento óptimo en millones de items, estos filtros deberían ir al backend.
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Función para obtener los datos desde el backend
    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        // Construir URL con parámetros de paginación y ordenación
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            order_by: orderBy,
            direction: direction,
        });
        
        // Aquí no se requiere el cambio de 'unit' a 'stock' porque es un cambio en la estructura de datos interna del objeto.
        const url = `${backendUrl}/inventory/?${params.toString()}`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
                throw new Error(errorData.detail || 'Fallo al cargar el inventario.');
            }
            
            const result: PaginatedResponse = await response.json();
            
            // Actualizar el estado con los datos paginados
            setData(prev => ({
                ...prev,
                ...result, // Sobrescribe total_count, page_count, limit, page y items
            }));
            
        } catch (err) {
            console.error("Error fetching inventory:", err);
            setError("No se pudo conectar al servidor o cargar el inventario.");
            setData(prev => ({ ...prev, items: [] })); // Limpiar ítems en caso de error
        } finally {
            setLoading(false);
        }
    }, [page, limit, orderBy, direction, backendUrl]); // Dependencias de la consulta

    // Ejecutar la consulta cada vez que cambian los parámetros de paginación/ordenación
    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    // --- LÓGICA DE ORDENACIÓN EN LA TABLA ---
    const handleSort = (column: string) => {
        if (orderBy === column) {
            // Cambiar dirección si es la misma columna
            setDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            // Cambiar columna de ordenación y resetear a descendente
            setOrderBy(column);
            setDirection('desc');
        }
        setPage(1); // Siempre volver a la página 1 al cambiar la ordenación
    };
    console.log(data)

    // --- CÁLCULOS DERIVADOS ---
    const totalPages = Math.ceil(data.total_count / limit);
    const categories = Array.from(new Set(data.items.map(item => item.category))).filter(Boolean) as string[];

    // --- FILTRADO EN EL CLIENTE (solo en los datos de la página actual) ---
    // NOTA: Si el filtro de texto o categoría debe aplicarse a *todo* el dataset, 
    // se debe migrar al backend, pero lo mantendremos aquí por ahora para filtros rápidos.
    const filteredItems = data.items.filter(item => {
        const itemName = item.name ? item.name.toLowerCase() : '';
        const itemCategory = item.category ? item.category : '';
        
        const matchesSearch = itemName.includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || itemCategory === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    // --- Componentes de UI ---
    const StockStatusBadge = ({ current, min }: { current: number | null, min: number | null }) => {
        if (current === null || min === null) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Sin Datos
                </span>
            );
        }

        const isLow = current <= min;
        const isMedium = current <= min * 2;

        let bgColor, textColor, text;

        if (isLow) {
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            text = 'Stock Crítico';
        } else if (isMedium) {
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            text = 'Stock Medio';
        } else {
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            text = 'Stock OK';
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {text}
            </span>
        );
    };

    if (loading && data.items.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando inventario...</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border-2 border-red-400">
                <p className="text-red-700 font-semibold mb-2">Error de Conexión</p>
                <p className="text-gray-600">{error}</p>
                <button 
                    onClick={fetchInventory} 
                    className="mt-4 py-1 px-3 border border-red-500 rounded-md text-red-500 hover:bg-red-50"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }
    
    // Función de ayuda para mostrar el indicador de ordenación
    const SortIcon = ({ column }: { column: string }) => {
        if (orderBy !== column) return null;
        return direction === 'asc' 
            ? <ArrowUp className="h-4 w-4 ml-1" /> 
            : <ArrowDown className="h-4 w-4 ml-1" />;
    };

    return (
        <div className="bg-white rounded-lg shadow-xl ring-1 ring-gray-100">
            {/* Filters & Controls */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    
                    {/* Búsqueda Local (rápida) */}
                    <div className="relative flex-1 w-full md:w-auto">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filtrar por nombre en esta página..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                    
                    {/* Filtro de Categoría Local */}
                    <div className="w-full md:w-auto">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Producto */}
                            <th 
                                onClick={() => handleSort('name')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    Producto <SortIcon column="name" />
                                </div>
                            </th>
                            {/* Categoría */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            {/* Cantidad (Stock Actual) */}
                            <th 
                                onClick={() => handleSort('current_stock')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center justify-end">
                                    Stock Actual <SortIcon column="current_stock" />
                                </div>
                            </th>
                            {/* Mínimo */}
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Mín.
                            </th>
                            {/* Estado */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-indigo-50/50 transition-colors">
                                {/* Producto */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Package className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">ID: {item.id}</div>
                                        </div>
                                    </div>
                                </td>
                                {/* Categoría */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.category || 'N/A'}
                                </td>
                                {/* Cantidad */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                    {/* CAMBIO 3: Usar item.stock en lugar de item.unit para la unidad de medida */}
                                    {item.stock !== null ? `${item.stock} ${item.stock || 'uds'}` : '...'}
                                </td>
                                {/* Mínimo */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.min_stock !== null ? item.min_stock : '...'}
                                </td>
                                {/* Estado */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StockStatusBadge 
                                        current={item.current_stock} 
                                        min={item.min_stock} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer de Paginación */}
            <div className="p-6 flex justify-between items-center border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Mostrando {data.page_count} de {data.total_count} ítems. (Página {data.page} de {totalPages})
                </div>
                <div className="flex items-center space-x-3">
                    {/* Botones de Paginación */}
                    <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        Anterior
                    </button>
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(parseInt(e.target.value));
                            setPage(1); // Resetear a la página 1 al cambiar el límite
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        disabled={loading}
                    >
                        <option value={10}>10 por pág.</option>
                        <option value={20}>20 por pág.</option>
                        <option value={50}>50 por pág.</option>
                    </select>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={page >= totalPages || loading}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {/* Mensaje de No Resultados */}
            {data.page_count === 0 && !loading && (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Aún no hay ítems en el inventario.</p>
                </div>
            )}
        </div>
    );
};

export default InventoryTable;
