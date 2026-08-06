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
  const { navigateTo } = useNavigationStore();
  const { mode, highContrast, toggleTheme, toggleHighContrast } = useThemeStore();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      
      {/* Top Banner indicating public disclosure mode */}
      <div className="bg-blue-600 text-white text-[10px] font-mono uppercase tracking-wider py-1 text-center font-semibold">
        PORTAL KETERBUKAAN PUBLIK RANCAGE | TINGKAT SENSITIVITAS DATA: TERBUKA (HANYA MAKRO)
      </div>

      {/* Main header navigation */}
      <header className="h-20 border-b border-rancage-border flex items-center justify-between px-8 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-50 transition-all duration-300">
        
        {/* Brand Logo and Title */}
        <button onClick={() => navigateTo('landing')} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src="/logo-transparent.png" alt="RANCAGE Logo" className="h-10 object-contain" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold tracking-wide text-rancage-primary dark:text-white leading-tight">RANCAGE DSS</span>
            <span className="text-[9px] font-semibold text-rancage-secondary uppercase tracking-widest mt-0.5">Penanggulangan Kemiskinan</span>
          </div>
        </button>

        {/* Global Action items - Centered */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-rancage-text-muted dark:text-slate-400 absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => navigateTo('landing')}
            className={cn(
              "transition-colors hover:text-rancage-secondary relative group py-2"
            )}
          >
            Beranda
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rancage-secondary transition-all group-hover:w-full rounded-full"></span>
          </button>
          <button
            onClick={() => navigateTo('methodology')}
            className={cn(
              "transition-colors hover:text-rancage-secondary relative group py-2"
            )}
          >
            Metodologi
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rancage-secondary transition-all group-hover:w-full rounded-full"></span>
          </button>
          <button
            onClick={() => navigateTo('exploration')}
            className={cn(
              "transition-colors hover:text-rancage-secondary relative group py-2"
            )}
          >
            Wilayah
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rancage-secondary transition-all group-hover:w-full rounded-full"></span>
          </button>
          <button
            className={cn(
              "transition-colors hover:text-rancage-secondary relative group py-2"
            )}
          >
            Simulasi Kebijakan
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rancage-secondary transition-all group-hover:w-full rounded-full"></span>
          </button>
          <button
            className={cn(
              "transition-colors hover:text-rancage-secondary relative group py-2"
            )}
          >
            Tentang
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rancage-secondary transition-all group-hover:w-full rounded-full"></span>
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
              className="text-sm font-bold px-5 py-2.5 bg-rancage-primary hover:bg-slate-800 text-white rounded-[10px] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rancage-primary/20"
            >
              Kembali ke Ruang Kerja
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="text-sm font-bold px-5 py-2.5 bg-rancage-secondary hover:bg-blue-600 text-white rounded-[10px] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rancage-secondary/25 active:scale-95"
            >
              Masuk Akses Aman
            </button>
          )}
        </div>
      </header>

      {/* Main Scroll Content View */}
      <main className="flex-1 w-full max-w-[1320px] mx-auto px-6 md:px-12 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/50 py-6 px-6 text-center text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-auto overflow-hidden">
        <MegaMendungPattern className="opacity-[0.03] text-mega-blue dark:text-blue-200" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-1.5 text-left">
            <ShieldAlert className="h-4 w-4 text-blue-500" />
            <span>
              Penafian: Semua pencarian mikrodata dibatasi untuk personel yang diautentikasi di bawah kepatuhan undang-undang negara UU No. 27/2022 tentang Pelindungan Data Pribadi.
            </span>
          </div>
          <div>
            {SYSTEM_META.version} | release Q3-2026 Pemerintah Provinsi Jawa Barat
          </div>
        </div>
      </footer>
    </div>
  );
}
