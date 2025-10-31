// src/lib/createPageWrapper.tsx
/**
 * Utility to create page-specific wrappers for React Query
 *
 * Usage:
 * ```tsx
 * import createPageWrapper from '@/lib/createPageWrapper';
 * import MyComponent from './MyComponent';
 *
 * export default createPageWrapper(() => (
 *   <div>
 *     <MyComponent />
 *   </div>
 * ));
 * ```
 */

import React, { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface CreatePageWrapperOptions {
  queryClientConfig?: ConstructorParameters<typeof QueryClient>[0];
}

export default function createPageWrapper(
  PageComponent: () => ReactNode,
  options: CreatePageWrapperOptions = {}
) {
  return function PageWrapper() {
    const [queryClient] = useState(
      () =>
        new QueryClient(
          options.queryClientConfig || {
            defaultOptions: {
              queries: {
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 10,
                retry: 2,
                refetchOnWindowFocus: false,
              },
            },
          }
        )
    );

    return (
      <QueryClientProvider client={queryClient}>
        <PageComponent />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    );
  };
}
