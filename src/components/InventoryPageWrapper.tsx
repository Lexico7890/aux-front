// src/components/InventoryPageWrapper.tsx
import React from 'react';
import createPageWrapper from '@/lib/createPageWrapper';
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';

function InventoryPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <InventoryForm />
        </div>

        {/* Tabla */}
        <div className="lg:col-span-2">
          <InventoryTable />
        </div>
      </div>
    </main>
  );
}

export default createPageWrapper(InventoryPage);