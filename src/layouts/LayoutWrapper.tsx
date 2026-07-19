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
      return <PublicLayout>{children}</PublicLayout>;

    case 'login':
      return <AuthenticationLayout>{children}</AuthenticationLayout>;

    // Public analytical dashboards (Sidebar + Navbar)
    case 'dashboard':
    case 'diagnosis':
    case 'typology':
    case 'regional-profile':
    case 'recommendation':
    case 'monitoring':
    case 'settings':
      return <DashboardLayout>{children}</DashboardLayout>;

    // Government restricted workspace directories
    case 'household':
      return <GovernmentLayout requiredRole="GOVERNMENT">{children}</GovernmentLayout>;

    // Admin restricted workspace parameters
    case 'administration':
      return <GovernmentLayout requiredRole="ADMIN">{children}</GovernmentLayout>;

    default:
      return <PublicLayout>{children}</PublicLayout>;
  }
}
