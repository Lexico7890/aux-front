// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

let queryClientInstance: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
          retry: 2,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          refetchOnWindowFocus: false,
          refetchOnMount: true,
          refetchOnReconnect: true,
        },
        mutations: {
          retry: 1,
          onError: (error: any) => {
            const message = error?.message || 'An error occurred';
            toast.error(message);
            console.error('Mutation error:', error);
          },
        },
      },
    });
  }
  return queryClientInstance;
}