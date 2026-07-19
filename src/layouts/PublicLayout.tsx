import React from 'react';
import { Eye, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore.ts';
import { useThemeStore } from '../store/themeStore.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { SYSTEM_META } from '../constants/index.ts';
import { cn } from '../utils/cn.ts';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { navigateTo } = useNavigationStore();
  const { mode, highContrast, toggleTheme, toggleHighContrast } = useThemeStore();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      
      {/* Top Banner indicating public disclosure mode */}
      <div className="bg-blue-600 text-white text-[10px] font-mono uppercase tracking-wider py-1 text-center font-semibold">
        RANCAGE PUBLIC DISCLOSURE PORTAL | DATA SENSITIVITY LEVEL: UNCLASSIFIED (MACRO-ONLY)
      </div>

      {/* Main header navigation */}
      <header className="h-16 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between px-6 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-30">
        
        {/* Brand Logo and Title */}
        <button onClick={() => navigateTo('landing')} className="flex items-center gap-2.5 hover:opacity-85">
          <div className="h-8 w-8 rounded-sm bg-blue-600 text-white font-bold flex items-center justify-center">
            R
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wider leading-none">RANCAGE DSS</span>
            <span className="text-[8px] font-mono text-blue-500 uppercase mt-0.5">West Java Poverty Alleviation</span>
          </div>
        </button>

        {/* Global Action items */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => navigateTo('dashboard')}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Public Indicators
          </button>
          <button
            onClick={() => navigateTo('recommendation')}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Policy Forecasts
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400"
          >
            {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* High Contrast */}
          <button
            onClick={toggleHighContrast}
            className={cn(
              'p-1.5 rounded-sm border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400',
              highContrast ? 'border-blue-500 text-blue-600' : 'border-slate-100 dark:border-slate-800'
            )}
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Secure Portal Link */}
          {user.isAuthenticated ? (
            <button
              onClick={() => navigateTo('dashboard')}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 rounded-sm transition-colors"
            >
              Back to Workspace
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="text-xs font-semibold px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors"
            >
              Secure Access Sign-In
            </button>
          )}
        </div>
      </header>

      {/* Main Scroll Content View */}
      <main className="flex-1 py-8 px-4 md:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/50 py-6 px-6 text-center text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-left">
            <ShieldAlert className="h-4 w-4 text-blue-500" />
            <span>
              Disclaimer: All microdata searches are restricted to authenticated personnel under statutory state compliance UU No. 27/2022 on Personal Data Protection.
            </span>
          </div>
          <div>
            {SYSTEM_META.version} | release Q3-2026 West Java Bappeda
          </div>
        </div>
      </footer>
    </div>
  );
}
