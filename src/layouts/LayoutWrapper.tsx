import React from 'react';
import { useNavigationStore } from '../store/navigationStore.ts';
import { PublicLayout } from './PublicLayout.tsx';
import { AuthenticationLayout } from './AuthenticationLayout.tsx';
import { DashboardLayout } from './DashboardLayout.tsx';
import { GovernmentLayout } from './GovernmentLayout.tsx';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { currentScreen } = useNavigationStore();

  switch (currentScreen) {
    case 'landing':
    case 'methodology':
    case 'about':
      return <PublicLayout>{children}</PublicLayout>;

    case 'exploration':
    case 'diagnosis':
    case 'typology':
    case 'regional-profile':
      return <PublicLayout>{children}</PublicLayout>;

    case 'login':
      return <AuthenticationLayout>{children}</AuthenticationLayout>;

    // Government restricted workspace directories (Private)
    case 'dashboard':
    case 'household':
    case 'ml-evaluation':
    case 'recommendation':
    case 'monitoring':
    case 'settings':
      return <GovernmentLayout requiredRole="GOVERNMENT">{children}</GovernmentLayout>;

    default:
      return <PublicLayout>{children}</PublicLayout>;
  }
}
