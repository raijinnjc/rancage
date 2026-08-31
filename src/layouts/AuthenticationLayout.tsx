import React from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore.ts';
import { SYSTEM_META } from '../constants/index.ts';

interface AuthenticationLayoutProps {
  children: React.ReactNode;
}

export function AuthenticationLayout({ children }: AuthenticationLayoutProps) {
  const { navigateTo } = useNavigationStore();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      
      {/* Left compliance and policy banner (spans 5 columns on desktop, hidden on smaller viewports) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 border-r border-slate-900 flex-col justify-between p-10 text-slate-400 font-mono">
        <div className="space-y-6">
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 text-white hover:opacity-85 text-left cursor-pointer"
          >
            <div className="h-8 w-8 rounded-sm bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              R
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">SISTEM RANCAGE DSS</span>
              <span className="text-[8px] text-slate-500 block">PORTAL INTELIJEN KEPUTUSAN JAWA BARAT</span>
            </div>
          </button>

          <div className="space-y-4 pt-10">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Pemberitahuan Kepatuhan & Audit
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Akses ke platform operasional ini dibatasi secara ketat hanya untuk aparatur pemerintah yang berwenang dari Bappeda, Dinas Sosial, Disdukcapil, dan surveyor resmi terdaftar. 
              Seluruh riwayat akses data mikro By-Name-By-Address (BNBA) dan simulasi kebijakan dipantau sesuai amanat UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP).
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[10px] text-slate-500">
          <div className="flex items-start gap-2 border border-slate-900 p-3 rounded-sm bg-slate-900/40 text-slate-400">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
            <span>AUDIT SESI: Token enkripsi dan log otentikasi divalidasi secara real-time.</span>
          </div>
          <div>
            Versi Sistem: {SYSTEM_META.version} • {SYSTEM_META.compliance}
          </div>
        </div>
      </div>

      {/* Right Login Input Form Panel (spans 7 columns on desktop, full-width on smaller screens) */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24 py-12 relative">
        <button
          onClick={() => navigateTo('landing')}
          className="absolute top-6 right-6 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 uppercase tracking-wider font-semibold cursor-pointer"
        >
          &larr; Kembali ke Beranda
        </button>

        <div className="w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
