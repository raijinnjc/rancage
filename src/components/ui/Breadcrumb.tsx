import { ChevronRight, Home } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { ScreenId } from '../../types/navigation.ts';

export function Breadcrumb() {
  const { currentScreen, navigateTo } = useNavigationStore();

  if (currentScreen === 'landing') return null;

  const getScreenLabel = (id: ScreenId) => {
    switch (id) {
      case 'dashboard':
        return 'Executive Overview';
      case 'diagnosis':
        return 'Regional Diagnosis';
      case 'typology':
        return 'Regional Typology';
      case 'regional-profile':
        return 'Regional Profile';
      case 'household':
        return 'Household Targeting';
      case 'recommendation':
        return 'Policy Recommendations';
      case 'monitoring':
        return 'Program Monitor';
      case 'administration':
        return 'Administration';
      case 'settings':
        return 'System Settings';
      case 'login':
        return 'Secure Portal Sign-In';
      default:
        return id;
    }
  };

  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
      <button
        onClick={() => navigateTo('landing')}
        className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <Home className="h-3 w-3" />
        <span>RANCAGE</span>
      </button>

      <ChevronRight className="h-2.5 w-2.5" />

      <span className="font-semibold text-slate-700 dark:text-slate-300">
        {getScreenLabel(currentScreen)}
      </span>
    </nav>
  );
}
