import { useAuthStore } from '../store/authStore.ts';
import { UserRole } from '../types/index.ts';

/**
 * Access hook for handling auth state and validating role-based authorization rules.
 */
export function useAuth() {
  const { session, isLoading, error, login, logout, checkPermission, clearError } = useAuthStore();

  const isPublic = session.role === 'PUBLIC';
  const isGovernment = session.role === 'GOVERNMENT' || session.role === 'ADMIN';
  const isAdmin = session.role === 'ADMIN';

  const requireRole = (requiredRole: UserRole): boolean => {
    return checkPermission(requiredRole);
  };

  return {
    user: session,
    isAuthenticated: session.isAuthenticated,
    role: session.role,
    agency: session.agency,
    isLoading,
    error,
    login,
    logout,
    checkPermission,
    clearError,
    // Role shortcut properties
    isPublic,
    isGovernment,
    isAdmin,
    requireRole,
  };
}
