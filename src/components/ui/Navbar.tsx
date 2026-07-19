import { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Eye,
  Shield,
  X,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useDemoStore } from '../../store/demoStore.ts';
import { useThemeStore } from '../../store/themeStore.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { NAVIGATION_ITEMS } from '../../constants/index.ts';
import { cn } from '../../utils/cn.ts';

export function Navbar() {
  const { currentScreen, navigateTo, toggleSidebar } = useNavigationStore();
  const { isPresentationMode } = useDemoStore();
  const { mode, highContrast, toggleTheme, toggleHighContrast } = useThemeStore();
  const { user, logout, isGovernment, isAdmin } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Filter items for mobile drawer
  const filteredNavItems = NAVIGATION_ITEMS.filter((item) => {
    if (item.minRole === 'PUBLIC') return true;
    if (item.minRole === 'GOVERNMENT') return isGovernment;
    if (item.minRole === 'ADMIN') return isAdmin;
    return false;
  });

  return (
    <>
      <header className="h-16 border-b border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-950 px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
        
        {/* Mobile menu trigger and title */}
        <div className="flex items-center gap-3">
          {!isPresentationMode && (
            <>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                onClick={toggleSidebar}
                className="hidden md:block p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500"
                title="Toggle Sidebar Layout"
              >
                <Menu className="h-5 w-5" />
              </button>
            </>
          )}

          {isPresentationMode && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-blue-600 text-white font-bold text-sm">
                R
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide leading-none uppercase">
                  RANCAGE
                </span>
                <span className="text-[9px] font-mono tracking-tighter text-blue-500 mt-0.5 uppercase font-bold">
                  Government Decision Support System
                </span>
              </div>
            </div>
          )}

          {/* Secondary Brand for Mobile (always show if not in presentation mode) */}
          {!isPresentationMode && (
            <div className="flex items-center gap-2 md:hidden">
              <div className="h-7 w-7 rounded-sm bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                R
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                RANCAGE
              </span>
            </div>
          )}
        </div>

        {/* Core Controls: Theme, Accessibility, Auditing Session Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Security Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border border-slate-100 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <div className={cn(
              'h-1.5 w-1.5 rounded-full animate-pulse',
              user.isAuthenticated ? 'bg-emerald-500' : 'bg-slate-400'
            )} />
            <span className="hidden sm:inline">
              {user.isAuthenticated ? `AUDITED: ${user.role}` : 'PUBLIC_ACCESS'}
            </span>
            <span className="sm:hidden">
              {user.isAuthenticated ? 'SECURE' : 'PUBLIC'}
            </span>
          </div>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400"
            title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Accessibility High Contrast Mode */}
          <button
            onClick={toggleHighContrast}
            className={cn(
              'p-1.5 rounded-sm border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400',
              highContrast
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-slate-100 dark:border-slate-800'
            )}
            title="Toggle High Contrast Option"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Account Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 pl-2.5 py-1 pr-1 border border-slate-100 dark:border-slate-800 rounded-sm hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold uppercase text-blue-700 dark:text-blue-300">
                {user.name.substring(0, 2)}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Account Dropdown */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-sm border border-slate-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 z-50 py-1 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-slate-50 dark:border-slate-900 font-mono text-[10px]">
                    <div className="text-slate-400">Authenticated:</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 uppercase truncate">
                      {user.name}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigateTo('settings');
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-left"
                  >
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>User Settings</span>
                  </button>

                  {user.isAuthenticated ? (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigateTo('landing');
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Secure Log Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigateTo('login');
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-left"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Gov Sign In</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-950 h-full p-4 animate-in slide-in-from-left duration-300 z-10">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-sm bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  R
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  RANCAGE
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav list on mobile */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {filteredNavItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium text-left',
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom info panel on mobile drawer */}
            <div className="pt-4 border-t border-slate-900 text-center text-[10px] font-mono text-slate-500">
              Session role: <strong className="text-white uppercase">{user.role}</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
