// src/components/MovementsFormPageWrapper.tsx
import React from 'react';
import createPageWrapper from '@/lib/createPageWrapper';
import MovementForm from './MovementForm';
import LastMovements from './LastMovements';

// All React logic encapsulated in this component
function MovementsFormPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 dark:bg-dark-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Movement Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-dark-800">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Nuevo Movimiento</h2>
          <MovementForm />
        </div>

        {/* Recent Movements */}
        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-dark-800">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Movimientos Recientes</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            <LastMovements />
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrap with QueryClient provider
export default createPageWrapper(MovementsFormPage);
