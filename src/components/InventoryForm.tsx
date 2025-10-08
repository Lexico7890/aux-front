import React, { useState } from 'react';

const InventoryForm = () => {
    // Definir el estado para el nuevo item (basado en las columnas de tu tabla inventory_items)
    const [newItem, setNewItem] = useState({
        id: '', // text
        name: '', // varchar
        description: '', // text (opcional)
        category: '', // varchar (opcional)
        stock: '', // varchar (opcional)
        min_stock: "", // int4 (opcional)
        location_id: 10
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const backendUrl = "https://aux-backend-snlq.onrender.com";

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ 
            ...prev, 
            [name]: value 
        }));
        setMessage('');
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsSuccess(false);

        // Validar campos requeridos (ID y Nombre)
        if (!newItem.id || !newItem.name) {
            setMessage('El ID y el Nombre son obligatorios.');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        try {
            const url = `${backendUrl}/inventory/`; // Asumiendo que tienes un POST /inventory/
            
            const dataToSend = {
                ...newItem,
                // Asegurar que min_stock sea un número
                min_stock: newItem.min_stock === '' ? null : parseInt(newItem.min_stock) || 0,
                // Asegurar que stock sea un número
                stock: newItem.stock === '' ? null : parseInt(newItem.stock) || 0,
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(`Ítem "${result.name}" creado con éxito!`);
                setIsSuccess(true);
                setNewItem({ // Limpiar formulario
                    id: '', name: '', description: '', category: '', stock: '', min_stock: "", location_id: 10
                });
                // OPCIONAL: Podrías necesitar recargar la tabla InventoryTable aquí.
            } else {
                const errorData = await response.json().catch(() => ({ detail: "Error desconocido del servidor." }));
                setMessage(`Error: ${errorData.detail || errorData.message || 'Fallo en la creación.'}`);
                setIsSuccess(false);
            }

        } catch (error) {
            console.error('Error de red al crear ítem:', error);
            setMessage('Error de conexión. Intenta de nuevo.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nuevo Ítem al Inventario</h2>
            {message && (
                <div className={`p-3 mb-4 rounded text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID (Referencia)*</label>
                    <input
                        type="text"
                        name="id"
                        id="id"
                        value={newItem.id}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto*</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={newItem.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                {/* Puedes añadir más campos como description, category, stock, min_stock, etc. */}
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Unidades</label>
                    <input
                        type="number"
                        name="stock"
                        id="stock"
                        value={newItem.stock}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label htmlFor="min_stock" className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
                    <input
                        type="number"
                        name="min_stock"
                        id="min_stock"
                        value={newItem.min_stock}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Creando...' : 'Guardar Ítem'}
                </button>
            </form>
        </div>
    );
};

export default InventoryForm;