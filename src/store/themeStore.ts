import { create } from 'zustand';
import { ThemeMode } from '../types/theme.ts';

interface ThemeState {
  mode: ThemeMode;
  highContrast: boolean;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  highContrast: false,

  toggleTheme: () => {
    const nextMode = get().mode === 'light' ? 'dark' : 'light';
    get().setTheme(nextMode);
  },

  toggleHighContrast: () => {
    const nextContrast = !get().highContrast;
    set({ highContrast: nextContrast });
    
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (nextContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
    }
  },

  setTheme: (mode: ThemeMode) => {
    set({ mode });
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },
}));

// Hydration and default system theme detection helper
if (typeof window !== 'undefined') {
  const cachedTheme = localStorage.getItem('rancage_theme') as ThemeMode | null;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = cachedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  useThemeStore.getState().setTheme(initialTheme);
}
