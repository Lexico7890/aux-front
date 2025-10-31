import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

// Create a QueryClient instance with optimized default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale (5 minutes)
      staleTime: 1000 * 60 * 5,
      // Cache data for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests
      retry: 2,
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Refetch on mount if data is stale
      refetchOnMount: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Global error handler for mutations
      onError: (error: any) => {
        const message = error?.message || 'An error occurred';
        toast.error(message);
        console.error('Mutation error:', error);
      },
    },
  },
});

export default function QueryProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
