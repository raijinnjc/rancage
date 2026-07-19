import { create } from 'zustand';
import { UserSession, UserRole } from '../types/auth.ts';

interface AuthState {
  session: UserSession;
  isLoading: boolean;
  error: string | null;
  login: (email: string, role: UserRole, name?: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (requiredRole: UserRole) => boolean;
  clearError: () => void;
}

const DEFAULT_SESSION: UserSession = {
  id: '',
  name: 'Public Guest',
  email: '',
  role: 'PUBLIC',
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: DEFAULT_SESSION,
  isLoading: false,
  error: null,

  login: async (email: string, role: UserRole, name = 'Gov Officer') => {
    set({ isLoading: true, error: null });
    try {
      // Mock validation matching Gov-ID specifications
      if (role !== 'PUBLIC' && !email.endsWith('.go.id') && !email.endsWith('.gov')) {
        set({
          error: 'GOV-ID Error: You must log in with an audited government email (.go.id or .gov)',
          isLoading: false,
        });
        return false;
      }

      const agency = email.includes('bappeda') ? 'BAPPEDA Jabar' : 'Dinas Sosial Jabar';

      const mockSession: UserSession = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role,
        agency,
        token: `jwt_${Math.random().toString(36).substr(2, 32)}`,
        isAuthenticated: true,
      };

      // Store in localStorage for basic state persistence across sessions
      localStorage.setItem('rancage_session', JSON.stringify(mockSession));
      set({ session: mockSession, isLoading: false });
      return true;
    } catch {
      set({ error: 'Authentication service unavailable', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('rancage_session');
    set({ session: DEFAULT_SESSION, error: null });
  },

  checkPermission: (requiredRole: UserRole) => {
    const currentRole = get().session.role;
    if (requiredRole === 'PUBLIC') return true;
    if (requiredRole === 'GOVERNMENT') return currentRole === 'GOVERNMENT' || currentRole === 'ADMIN';
    if (requiredRole === 'ADMIN') return currentRole === 'ADMIN';
    return false;
  },

  clearError: () => set({ error: null }),
}));

// Initialize store from localStorage if available (hydration helper)
if (typeof window !== 'undefined') {
  const cached = localStorage.getItem('rancage_session');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      useAuthStore.setState({ session: parsed });
    } catch {
      // cache corrupted, ignore
    }
  }
}
