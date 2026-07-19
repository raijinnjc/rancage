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
      <header className="h-16 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between px-6 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-30">
        
        {/* Brand Logo and Title */}
        <button onClick={() => navigateTo('landing')} className="flex items-center gap-2.5 hover:opacity-85">
          <div className="h-8 w-8 rounded-sm bg-blue-600/20 text-kujang-gold border border-kujang-gold/30 shadow-[0_0_10px_rgba(197,150,42,0.2)] flex items-center justify-center">
            <KujangLogo size={20} className="text-[#C5962A]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wider leading-none">RANCAGE DSS</span>
            <span className="text-[8px] font-mono text-kujang-gold uppercase mt-0.5">Penanggulangan Kemiskinan Jawa Barat</span>
          </div>
        </button>

        {/* Global Action items */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => navigateTo('dashboard')}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Indikator Publik
          </button>
          <button
            onClick={() => navigateTo('recommendation')}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Prakiraan Kebijakan
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
              Kembali ke Ruang Kerja
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="text-xs font-semibold px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors"
            >
              Masuk Akses Aman
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
