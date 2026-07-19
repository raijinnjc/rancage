import { create } from 'zustand';
import { ScreenId } from '../types/navigation.ts';

interface NavigationState {
  currentScreen: ScreenId;
  history: ScreenId[];
  recentPages: ScreenId[];
  favorites: ScreenId[];
  transitioningTo: ScreenId | null;
  isSidebarExpanded: boolean;
  selectedDistrictId: string | null;
  selectedYear: string;
  selectedTypology: string;
  setSelectedDistrictId: (id: string | null) => void;
  setSelectedYear: (year: string) => void;
  setSelectedTypology: (typology: string) => void;
  navigateTo: (screen: ScreenId, replace?: boolean) => void;
  navigateBack: () => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleFavorite: (screen: ScreenId) => void;
  resetNavigation: () => void;
  resetFilters: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentScreen: 'landing',
  history: [],
  recentPages: ['landing'],
  favorites: [],
  transitioningTo: null,
  isSidebarExpanded: true,
  selectedDistrictId: '3206', // Default Kabupaten Tasikmalaya
  selectedYear: '2026',
  selectedTypology: 'ALL',

  setSelectedDistrictId: (id: string | null) => set({ selectedDistrictId: id }),
  setSelectedYear: (year: string) => set({ selectedYear: year }),
  setSelectedTypology: (typology: string) => set({ selectedTypology: typology }),

  navigateTo: (screen: ScreenId, replace = false) => {
    const { currentScreen } = get();
    if (currentScreen === screen) return;

    set({ transitioningTo: screen });

    // Transition delay to let Framer Motion run fade-out exit animations
    setTimeout(() => {
      set((state) => {
        const newHistory = replace ? [...state.history] : [...state.history, state.currentScreen];
        const newRecents = [screen, ...state.recentPages.filter((p) => p !== screen)].slice(0, 5);
        return {
          currentScreen: screen,
          history: newHistory,
          recentPages: newRecents,
          transitioningTo: null,
        };
      });
    }, 200);
  },

  navigateBack: () => {
    const { history } = get();
    if (history.length === 0) return;

    const previousScreen = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    set({ transitioningTo: previousScreen });

    setTimeout(() => {
      set((state) => {
        const newRecents = [previousScreen, ...state.recentPages.filter((p) => p !== previousScreen)].slice(0, 5);
        return {
          currentScreen: previousScreen,
          history: newHistory,
          recentPages: newRecents,
          transitioningTo: null,
        };
      });
    }, 200);
  },

  toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  setSidebarExpanded: (expanded: boolean) => set({ isSidebarExpanded: expanded }),

  toggleFavorite: (screen: ScreenId) => set((state) => {
    const isFav = state.favorites.includes(screen);
    const newFavs = isFav
      ? state.favorites.filter((p) => p !== screen)
      : [...state.favorites, screen];
    return { favorites: newFavs };
  }),

  resetNavigation: () => set({
    currentScreen: 'landing',
    history: [],
    recentPages: ['landing'],
    favorites: [],
    transitioningTo: null,
  }),

  resetFilters: () => set({
    selectedYear: '2026',
    selectedDistrictId: '3206',
    selectedTypology: 'ALL',
  }),
}));
