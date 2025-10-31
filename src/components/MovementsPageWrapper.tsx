// src/components/MovementsPageWrapper.tsx
import React from 'react';
import createPageWrapper from '@/lib/createPageWrapper';
import Navigation from './Navigation';
import MovementCoworkers from './MovementCoworkers';

function MovementsPage() {
  return (
    <Navigation>
      <main className="mx-auto sm:px-4 py-2 dark:bg-dark-700">
        <MovementCoworkers />
      </main>
    </Navigation>
  );
}

export default createPageWrapper(MovementsPage);