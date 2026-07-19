import {
  LayoutDashboard,
  TrendingUp,
  Grid,
  MapPin,
  Users,
  Briefcase,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Lock,
  Brain,
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useDemoStore } from '../../store/demoStore.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { NAVIGATION_ITEMS, SYSTEM_META } from '../../constants/index.ts';
import { ScreenId } from '../../types/navigation.ts';
import { cn } from '../../utils/cn.ts';

/**
 * Maps static icon names to dynamic Lucide component nodes.
 */
function NavigationIcon({ name, className }: { name: string; className?: string }) {
  const iconMap: Record<string, any> = {
    LayoutDashboard: LayoutDashboard,
    TrendingUp: TrendingUp,
    Grid: Grid,
    MapPin: MapPin,
    Users: Users,
    Briefcase: Briefcase,
    Activity: Activity,
    Shield: Shield,
    Brain: Brain,
  };

  const IconComp = iconMap[name] || MapPin;
  return <IconComp className={className} />;
}

export function Sidebar() {
  const { currentScreen, navigateTo, isSidebarExpanded, toggleSidebar } = useNavigationStore();
  const { isPresentationMode } = useDemoStore();
  const { user, logout, isGovernment, isAdmin } = useAuth();

  const handleMenuPress = (id: ScreenId) => {
    navigateTo(id);
  };

  // Filter navigation items by active user role credentials
  const filteredNavItems = NAVIGATION_ITEMS.filter((item) => {
    if (item.minRole === 'PUBLIC') return true;
    if (item.minRole === 'GOVERNMENT') return isGovernment;
    if (item.minRole === 'ADMIN') return isAdmin;
    return false;
  });

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-100 bg-slate-950 text-slate-400 dark:border-slate-900 transition-all duration-300 h-screen sticky top-0 z-40 shrink-0',
        isSidebarExpanded ? 'w-64' : 'w-16',
        isPresentationMode && 'md:hidden'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900/60 shrink-0 bg-slate-950">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-blue-600 text-white font-bold text-sm">
            R
          </div>
          {isSidebarExpanded && (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide leading-none uppercase">
                RANCAGE
              </span>
              <span className="text-[9px] font-mono tracking-tighter text-blue-400 mt-0.5 uppercase">
                Decision Support
              </span>
            </div>
          )}
        </div>

        {isSidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-white p-1 rounded-sm bg-slate-900/40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 bg-slate-950">
        {filteredNavItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuPress(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium transition-colors text-left relative group',
                isActive
                  ? 'bg-slate-900 text-white border-l-2 border-blue-500'
                  : 'hover:bg-slate-900/50 hover:text-white text-slate-400'
              )}
              title={!isSidebarExpanded ? item.label : undefined}
            >
              <NavigationIcon name={item.icon} className={cn('h-4 w-4 shrink-0', isActive ? 'text-blue-400' : '')} />
              
              {isSidebarExpanded && (
                <div className="flex-1 truncate">
                  <span>{item.label}</span>
                  {item.minRole !== 'PUBLIC' && (
                    <span className="ml-1.5 inline-flex items-center text-[8px] bg-slate-800 text-slate-300 px-1 rounded-xs uppercase">
                      SECURE
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip for collapsed sidebar */}
              {!isSidebarExpanded && (
                <div className="absolute left-16 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-sm whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logged User Context Widget */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/40 shrink-0">
        {isSidebarExpanded ? (
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5 p-2 bg-slate-900/30 rounded-sm">
              <div className="h-7 w-7 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user.name.substring(0, 2)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-white truncate">
                  {user.name}
                </span>
                <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1 mt-0.5 uppercase truncate">
                  {user.role === 'PUBLIC' ? (
                    'Public Guest'
                  ) : (
                    <>
                      <Building2 className="h-2.5 w-2.5 shrink-0 text-blue-400" />
                      {user.agency || 'GOVERNMENT'}
                    </>
                  )}
                </span>
              </div>
            </div>

            {user.isAuthenticated ? (
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/10 hover:text-rose-300 rounded-sm transition-colors text-left"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span>Secure Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Gov Secure Login</span>
              </button>
            )}

            <div className="text-center text-[9px] font-mono text-slate-600">
              {SYSTEM_META.version} | {SYSTEM_META.compliance}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-slate-500 hover:text-white p-1 rounded-sm"
              title="Expand Sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {user.isAuthenticated ? (
              <button
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 p-1 rounded-sm"
                title="Secure Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="text-blue-400 hover:text-blue-300 p-1 rounded-sm"
                title="Gov Secure Login"
              >
                <Lock className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
