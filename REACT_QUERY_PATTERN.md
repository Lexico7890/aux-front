# React Query con Astro - Patrón de Implementación

## El Problema

Cuando usas React Query (TanStack Query) con Astro, enfrentas un desafío: Astro intenta hacer Server-Side Rendering (SSR) de los componentes React, pero React Query solo funciona en el cliente.

### ❌ Esto NO funciona:

```astro
---
import AppWrapper from '@/components/AppWrapper';
import MyComponent from '@/components/MyComponent'; // Se intenta renderizar en SSR
---

<Layout>
  <AppWrapper client:only="react">
    <MyComponent /> <!-- FALLA: MyComponent se renderiza en el servidor -->
  </AppWrapper>
</Layout>
```

**Error:** `No QueryClient set, use QueryClientProvider to set one`

## ✅ La Solución: Page Wrappers

Crea componentes "wrapper" específicos para cada página que encapsulen TODA la lógica React.

### Paso 1: Usar el helper `createPageWrapper`

```tsx
// src/components/MiPaginaWrapper.tsx
import React from 'react';
import createPageWrapper from '@/lib/createPageWrapper';
import MiComponente from './MiComponente';
import OtroComponente from './OtroComponente';

function MiPagina() {
  return (
    <div>
      <h1>Mi Página</h1>
      <MiComponente />
      <OtroComponente />
    </div>
  );
}

export default createPageWrapper(MiPagina);
```

### Paso 2: Usar el wrapper en Astro

```astro
---
// src/pages/mi-pagina.astro
import Layout from '../layouts/Layout.astro';
import MiPaginaWrapper from '@/components/MiPaginaWrapper';
---

<Layout title="Mi Página">
  <MiPaginaWrapper client:only="react" />
</Layout>
```

## Regla de Oro

> **NUNCA importes componentes React directamente en archivos `.astro` si esos componentes usan React Query.**
>
> **SIEMPRE crea un wrapper que importe todos los componentes internamente.**

## Ejemplos Existentes

### ✅ index.astro (Página Principal)
```tsx
// MovementsPageWrapper.tsx
import createPageWrapper from '@/lib/createPageWrapper';
import Navigation from './Navigation';
import MovementCoworkers from './MovementCoworkers';

function MovementsPage() {
  return (
    <Navigation>
      <main>
        <MovementCoworkers />
      </main>
    </Navigation>
  );
}

export default createPageWrapper(MovementsPage);
```

### ✅ inventario.astro (Inventario)
```tsx
// InventoryPageWrapper.tsx
import createPageWrapper from '@/lib/createPageWrapper';
import Navigation from './Navigation';
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';

function InventoryPage() {
  return (
    <Navigation>
      <main>
        <InventoryForm />
        <InventoryTable />
      </main>
    </Navigation>
  );
}

export default createPageWrapper(InventoryPage);
```

## ¿Cuándo crear un nuevo wrapper?

Crea un nuevo page wrapper cuando:
1. Estés creando una nueva página en Astro
2. Esa página use componentes React que necesiten React Query
3. Quieras tener hooks de React Query disponibles en tus componentes

## Flujo de Trabajo

1. **Crea tu componente React normal:**
   ```tsx
   // MyFeature.tsx
   import { useQuery } from '@tanstack/react-query';

   export default function MyFeature() {
     const { data } = useQuery({ ... });
     return <div>{data}</div>;
   }
   ```

2. **Crea el page wrapper:**
   ```tsx
   // MyFeaturePageWrapper.tsx
   import createPageWrapper from '@/lib/createPageWrapper';
   import MyFeature from './MyFeature';

   function MyFeaturePage() {
     return <MyFeature />;
   }

   export default createPageWrapper(MyFeaturePage);
   ```

3. **Usa el wrapper en Astro:**
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   import MyFeaturePageWrapper from '@/components/MyFeaturePageWrapper';
   ---

   <Layout>
     <MyFeaturePageWrapper client:only="react" />
   </Layout>
   ```

## Configuración Personalizada

Si necesitas una configuración especial del QueryClient:

```tsx
import createPageWrapper from '@/lib/createPageWrapper';

function MyPage() {
  return <div>...</div>;
}

export default createPageWrapper(MyPage, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10, // 10 minutos
        retry: 5,
      },
    },
  },
});
```

## Resumen

- ✅ **SÍ:** Crear wrappers para cada página
- ✅ **SÍ:** Usar `createPageWrapper` helper
- ✅ **SÍ:** Usar `client:only="react"` en wrappers
- ❌ **NO:** Importar componentes React directamente en `.astro`
- ❌ **NO:** Intentar usar AppWrapper genérico con múltiples imports
