import React from 'react';
import { Sidebar } from '../components/ui/Sidebar.tsx';
import { Navbar } from '../components/ui/Navbar.tsx';
import { Breadcrumb } from '../components/ui/Breadcrumb.tsx';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-batik-pattern dark:text-slate-50">
      {/* Sidebar - responsive on desktop, collapses to 64px, handles role checks internally */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar Header */}
        <Navbar />

        {/* Workspace content scroll viewport with responsive padding */}
        <main id="main-workspace-scroll" className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950/20">
          <div className="w-full max-w-7xl mx-auto h-full flex flex-col gap-4">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
