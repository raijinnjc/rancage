import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../services/apiClient.ts';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
