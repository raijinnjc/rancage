import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.ts';
import { useNavigationStore } from '../store/navigationStore.ts';
import { DashboardLayout } from './DashboardLayout.tsx';

interface GovernmentLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'GOVERNMENT' | 'ADMIN';
}

export function GovernmentLayout({ children, requiredRole = 'GOVERNMENT' }: GovernmentLayoutProps) {
  const { user, isGovernment, isAdmin } = useAuth();
  const { navigateTo } = useNavigationStore();

  const isAuthorized = requiredRole === 'GOVERNMENT' ? isGovernment : isAdmin;

  if (!user.isAuthenticated || !isAuthorized) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto h-full">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 mb-5">
            <Lock className="h-6 w-6" />
          </div>
          
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
            Akses Ditolak (Izin Diperlukan)
          </h2>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Sesi kredensial Anda saat ini (<strong>{user.role}</strong>) tidak memiliki tingkat kewenangan yang diperlukan untuk mengakses ruang kerja privat ini. 
            Semua aktivitas akses dicatat secara permanen dalam log audit sistem sesuai kepatuhan UU No. 27/2022 tentang Pelindungan Data Pribadi.
          </p>

          <div className="flex items-center gap-1.5 p-3 rounded-sm border border-rose-100 bg-rose-50/20 text-[10px] font-mono text-rose-700 dark:border-rose-950 dark:bg-rose-950/10 dark:text-rose-400 mt-5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>AUDIT KEAMANAN: Upaya akses sesi jaringan tercatat. Kode: 403_FORBIDDEN_ACL.</span>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => navigateTo('landing')}
              className="px-4 py-2 text-xs font-semibold rounded-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors cursor-pointer"
            >
              Autentikasi Gov-ID
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Session verified, render standard authenticated layout wrapper
  return <DashboardLayout>{children}</DashboardLayout>;
}
