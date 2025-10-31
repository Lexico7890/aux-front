// src/components/AppWrapper.tsx
/**
 * AppWrapper - Generic QueryClient Provider
 *
 * IMPORTANT: This component should ONLY be used in specific scenarios:
 *
 * ✅ CORRECT USAGE (inside React components):
 * ```tsx
 * // MyReactComponent.tsx
 * function MyPageComponent() {
 *   return (
 *     <div>
 *       <MyComponentThatUsesQuery />
 *     </div>
 *   );
 * }
 * ```
 *
 * Then in Astro:
 * ```astro
 * <AppWrapper client:only="react">
 *   <MyPageComponent />
 * </AppWrapper>
 * ```
 *
 * ❌ INCORRECT USAGE (importing React components directly in .astro):
 * ```astro
 * ---
 * import AppWrapper from '@/components/AppWrapper';
 * import MyComponent from '@/components/MyComponent'; // ❌ This will SSR!
 * ---
 * <AppWrapper client:only="react">
 *   <MyComponent /> // ❌ Will fail - component tries to SSR
 * </AppWrapper>
 * ```
 *
 * 🎯 RECOMMENDED: Create page-specific wrappers
 * For each page, create a wrapper like:
 * - MovementsPageWrapper.tsx
 * - InventoryPageWrapper.tsx
 *
 * These wrappers handle ALL React logic internally and prevent SSR issues.
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
          retry: 2,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}