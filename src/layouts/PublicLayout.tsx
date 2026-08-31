import React from 'react';
import { Eye, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore.ts';
import { useThemeStore } from '../store/themeStore.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { SYSTEM_META } from '../constants/index.ts';
import { cn } from '../utils/cn.ts';
import { KujangLogo } from '../components/ui/KujangLogo.tsx';
import { MegaMendungPattern } from '../components/ui/MegaMendungPattern.tsx';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { currentScreen, navigateTo } = useNavigationStore();
  const { mode, highContrast, toggleTheme, toggleHighContrast } = useThemeStore();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      
      {/* Top Official Banner */}
      <div className="bg-slate-900 text-slate-300 text-[10px] font-mono uppercase tracking-wider py-1 px-4 text-center font-medium border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>PORTAL RESMI SATU DATA JAWA BARAT • KETERBUKAAN DATA SOSIAL EKONOMI MAKRO</span>
      </div>

      {/* Main header navigation */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-8 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-50">
        
        {/* Brand Logo and Title */}
        <button onClick={() => navigateTo('landing')} className="flex items-center hover:opacity-90 transition-opacity cursor-pointer">
          <img src="/logo1.png" alt="RANCAGE Logo" className="h-9 object-contain" />
        </button>

        {/* Global Navigation Links - Centered */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => navigateTo('landing')}
            className={cn(
              "transition-colors hover:text-blue-600 dark:hover:text-blue-400 relative py-2 cursor-pointer",
              currentScreen === 'landing' && "text-blue-600 font-extrabold dark:text-blue-400"
            )}
          >
            Beranda
            <span className={cn(
              "absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all rounded-xs",
              currentScreen === 'landing' ? "w-full" : "w-0"
            )}></span>
          </button>
          <button
            onClick={() => navigateTo('methodology')}
            className={cn(
              "transition-colors hover:text-blue-600 dark:hover:text-blue-400 relative py-2 cursor-pointer",
              currentScreen === 'methodology' && "text-blue-600 font-extrabold dark:text-blue-400"
            )}
          >
            Metodologi
            <span className={cn(
              "absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all rounded-xs",
              currentScreen === 'methodology' ? "w-full" : "w-0"
            )}></span>
          </button>
          <button
            onClick={() => navigateTo('exploration')}
            className={cn(
              "transition-colors hover:text-blue-600 dark:hover:text-blue-400 relative py-2 cursor-pointer",
              ['exploration', 'diagnosis', 'typology', 'regional-profile'].includes(currentScreen) && "text-blue-600 font-extrabold dark:text-blue-400"
            )}
          >
            Eksplorasi Wilayah
            <span className={cn(
              "absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all rounded-xs",
              ['exploration', 'diagnosis', 'typology', 'regional-profile'].includes(currentScreen) ? "w-full" : "w-0"
            )}></span>
          </button>
          <button
            onClick={() => user.isAuthenticated ? navigateTo('recommendation') : navigateTo('login')}
            className={cn(
              "transition-colors hover:text-blue-600 dark:hover:text-blue-400 relative py-2 cursor-pointer",
              currentScreen === 'recommendation' && "text-blue-600 font-extrabold dark:text-blue-400"
            )}
          >
            Simulasi Kebijakan
            <span className={cn(
              "absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all rounded-xs",
              currentScreen === 'recommendation' ? "w-full" : "w-0"
            )}></span>
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={cn(
              "transition-colors hover:text-blue-600 dark:hover:text-blue-400 relative py-2 cursor-pointer",
              currentScreen === 'about' && "text-blue-600 font-extrabold dark:text-blue-400"
            )}
          >
            Tentang RANCAGE
            <span className={cn(
              "absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all rounded-xs",
              currentScreen === 'about' ? "w-full" : "w-0"
            )}></span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-pointer"
            title="Ganti Tema"
          >
            {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* High Contrast */}
          <button
            onClick={toggleHighContrast}
            className={cn(
              'p-1.5 rounded-sm border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-pointer',
              highContrast ? 'border-blue-500 text-blue-600' : 'border-slate-200 dark:border-slate-800'
            )}
            title="Mode Kontras Tinggi"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Secure Portal Link */}
          {user.isAuthenticated ? (
            <button
              onClick={() => navigateTo('dashboard')}
              className="text-xs font-bold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-sm transition-colors cursor-pointer"
            >
              Ruang Kerja Gov-ID
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors cursor-pointer shadow-xs"
            >
              Masuk Akses Aman
            </button>
          )}
        </div>
      </header>

      {/* Main Scroll Content View */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-6 px-6 text-center text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-auto overflow-hidden">
        <MegaMendungPattern className="opacity-[0.03] text-blue-900 dark:text-blue-200" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2 text-left">
            <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              Kepatuhan Hukum: Pengelolaan mikrodata dibatasi untuk pejabat terotorisasi sesuai amanat UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP).
            </span>
          </div>
          <div>
            {SYSTEM_META.version} • Pemerintah Provinsi Jawa Barat
          </div>
        </div>
      </footer>
    </div>
  );
}
