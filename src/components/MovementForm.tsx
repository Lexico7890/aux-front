import React, { useState } from 'react';
import { ArrowRight, Save, Loader2 } from 'lucide-react';

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
            <option value="taller-medellin">Taller Medellín</option>
            <option value="taller-bogota">Taller Bogotá</option>
            <option value="almacen-central">Almacén Central</option>
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
            <option value="taller-medellin">Taller Medellín</option>
            <option value="taller-bogota">Taller Bogotá</option>
            <option value="tecnico-juan">Técnico Juan</option>
            <option value="tecnico-maria">Técnico María</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
        <select
          name="product"
          value={formData.product}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona producto</option>
          <option value="bateria-36v">Batería 36V</option>
          <option value="controlador-vesc">Controlador VESC</option>
          <option value="rueda-90mm">Rueda 90mm</option>
          <option value="motor-3000w">Motor 3000W</option>
        </select>
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