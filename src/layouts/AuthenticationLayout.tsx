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
            className="flex items-center gap-2.5 text-white hover:opacity-85 text-left"
          >
            <div className="h-8 w-8 rounded-sm bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              R
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">RANCAGE SYSTEM</span>
              <span className="text-[8px] text-slate-500 block">GOVERNMENT DSS DISCOVERY PORTAL</span>
            </div>
          </button>

          <div className="space-y-4 pt-10">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              State Auditing Warning
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Access to this platform is strictly restricted to authorized government personnel belonging to Bappeda, Dinas Sosial, and official regional surveyors. 
              All data access logs, export activities, and micro-targeting searches are subject to UU No. 27/2022 (PDP Act compliance). Unsanctioned inquiries are auditable.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[10px] text-slate-600">
          <div className="flex items-start gap-2 border border-slate-900 p-3 rounded-sm bg-slate-950/40">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
            <span>SESSION MONITOR: Client fingerprint, browser cookies, and encrypted tokens are validated upon login.</span>
          </div>
          <div>
            System build: {SYSTEM_META.version} | {SYSTEM_META.compliance}
          </div>
        </div>
      </div>

      {/* Right Login Input Form Panel (spans 7 columns on desktop, full-width on smaller screens) */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24 py-12 relative">
        <button
          onClick={() => navigateTo('landing')}
          className="absolute top-6 right-6 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 uppercase tracking-wider font-semibold"
        >
          &larr; Cancel Login
        </button>

        <div className="w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
