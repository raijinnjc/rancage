import { QueryClient } from '@tanstack/react-query';

/**
 * Centrally configured QueryClient for TanStack Query (React Query)
 * keeping client-side state caching and retry back-offs standardized.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Do not retry on client authorization or validation failures
        if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes cache validity
    },
  },
});

/**
 * Standard API call helper proxying Requests through server routes.
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'API request failed');
    (error as any).status = response.status;
    (error as any).code = errorData.code || 'UNKNOWN_ERROR';
    throw error;
  }

  return response.json() as Promise<T>;
}
