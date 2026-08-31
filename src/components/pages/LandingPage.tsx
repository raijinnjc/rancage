import React from 'react';
import { 
  Lock, 
  Eye, 
  ArrowRight, 
  TrendingDown, 
  Layers, 
  Activity, 
  PieChart,
  Users,
  LineChart,
  Shield,
  Building,
  Database,
  Network,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { KujangLogo } from '../ui/KujangLogo.tsx';
import { MegaMendungPattern } from '../ui/MegaMendungPattern.tsx';

// Premium KPI Card Component
interface PremiumKpiCardProps {
  title: string;
  value: string;
  change: string;
  date: string;
  icon: React.ReactNode;
  trendDirection: 'positive' | 'negative' | 'neutral';
}

const PremiumKpiCard: React.FC<PremiumKpiCardProps> = ({ title, value, change, date, icon, trendDirection }) => {
  return (
    <div className="h-[170px] bg-white dark:bg-slate-900 border border-rancage-border dark:border-slate-800 rounded-[20px] p-6 flex flex-col justify-between shadow-[0_12px_40px_rgba(15,45,92,0.04)] hover:shadow-[0_12px_40px_rgba(15,45,92,0.08)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-rancage-bg dark:bg-slate-800 flex items-center justify-center text-rancage-primary dark:text-blue-400 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-sm font-semibold text-rancage-text-muted dark:text-slate-400">{title}</span>
        </div>
        <div className="text-[10px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
          {date}
        </div>
      </div>
      
      <div className="z-10">
        <div className="text-4xl font-bold text-rancage-text dark:text-white mb-2 tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendDirection === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
            trendDirection === 'negative' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            {change}
          </span>
        </div>
      </div>

      {/* Decorative Sparkline SVG Simulation */}
      <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-10 text-rancage-primary dark:text-blue-400 pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
        <path d="M0,50 L0,30 C20,40 30,10 50,20 C70,30 80,5 100,15 L100,50 Z" fill="currentColor" />
        <path d="M0,30 C20,40 30,10 50,20 C70,30 80,5 100,15" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
};

export function LandingPage() {
  const { navigateTo } = useNavigationStore();
  const { user } = useAuth();

  return (
    <div className="space-y-24 w-full page-transition stagger-children">
      
      {/* Hero Section */}
      <section className="relative text-center py-16 px-6 flex flex-col items-center justify-center min-h-[55vh] rounded-[20px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-sm">
        
        {/* Authentic West Java Cultural Pattern */}
        <MegaMendungPattern className="opacity-[0.035] dark:opacity-[0.03] text-mega-blue dark:text-blue-300" />

        <div className="relative z-10 max-w-[780px] mx-auto space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Institutional Gov Header Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 text-xs font-semibold">
            <KujangLogo size={16} className="text-[#C5962A]" />
            <span className="font-mono text-[10px] tracking-wider uppercase">PEMERINTAH PROVINSI JAWA BARAT</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400">SATU DATA JAWA BARAT</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              RANCAGE DSS
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300">
              Sistem Pendukung Keputusan Penanggulangan Kemiskinan & Ketimpangan
            </h2>
          </div>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed text-center max-w-2xl mx-auto">
            RANCAGE (<span className="font-semibold text-slate-800 dark:text-slate-200">Ruang Analisis Navigasi Celah Agregat dan Gini Empiris</span>) adalah platform intelijen kebijakan lapisan pelengkap (<em>complementary intelligence layer</em>) yang mengintegrasikan data sosial-ekonomi lintas instansi untuk memitigasi anomali kedalaman kemiskinan (P1) dan ketimpangan spasial di 27 Kabupaten/Kota Jawa Barat.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigateTo('exploration')}
              className="inline-flex items-center gap-2 rounded-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 px-6 py-3 text-xs font-bold tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Eksplorasi Wilayah Publik</span>
            </button>
            
            <button
              onClick={() => navigateTo('login')}
              className="inline-flex items-center gap-2 rounded-sm bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-xs font-bold tracking-wide transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Akses Aman Gov-ID</span>
            </button>
          </div>
        </div>
      </section>

      {/* Macro Indicators Basket Grid */}
      <section className="space-y-8">
        <h3 className="text-2xl font-bold text-rancage-text dark:text-white text-center">
          Keranjang Makro Sosial Ekonomi Jawa Barat
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumKpiCard
            title="Tingkat Kemiskinan (P0)"
            value="7,02%"
            change="-0,39% vs September 2024"
            date="Maret 2025"
            icon={<TrendingDown className="h-5 w-5" />}
            trendDirection="positive"
          />
          <PremiumKpiCard
            title="Indeks Kedalaman Kemiskinan (P1)"
            value="1,21"
            change="+0,05 vs 2023"
            date="2024"
            icon={<Layers className="h-5 w-5" />}
            trendDirection="negative"
          />
          <PremiumKpiCard
            title="Rasio Ketimpangan (Gini)"
            value="0,416"
            change="Peringkat ke-3 nasional"
            date="2024"
            icon={<PieChart className="h-5 w-5" />}
            trendDirection="negative"
          />
          <PremiumKpiCard
            title="Indeks Theil Total"
            value="0,279"
            change="+0,010 vs 2022"
            date="2022"
            icon={<Activity className="h-5 w-5" />}
            trendDirection="negative"
          />
        </div>
      </section>

      {/* Information Architecture / Program Pillars */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Public Access Section */}
        <div className="p-10 rounded-[20px] bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 border border-blue-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(15,45,92,0.06)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
          <div className="absolute right-0 top-0 opacity-10 p-4 pointer-events-none text-rancage-primary dark:text-blue-400 flex gap-4">
            <Users size={80} />
            <LineChart size={60} className="mt-8" />
          </div>
          
          <div className="h-14 w-14 rounded-[14px] bg-white dark:bg-slate-800 shadow-sm border border-rancage-border dark:border-slate-700 flex items-center justify-center text-rancage-secondary mb-6 relative z-10">
            <Users className="h-6 w-6" />
          </div>
          
          <h3 className="text-2xl font-bold text-rancage-primary dark:text-white mb-4 relative z-10">Jalur Publik Terbuka</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 relative z-10 flex-grow">
            Fokus pada <strong>mitigasi stigmatisasi wilayah</strong>. Menyajikan data agregat anonim (Dekomposisi Theil, Tipologi Kuadran, Tren P0) bagi peneliti dan publik tanpa mengekspos identitas KPM tingkat mikro.
          </p>
          
          <button onClick={() => navigateTo('exploration')} className="mt-auto inline-flex items-center gap-2 text-rancage-secondary font-bold group/btn relative z-10">
            Portal Publik
            <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        {/* Secure Access Section */}
        <div className="p-10 rounded-[20px] bg-gradient-to-br from-rancage-primary to-[#0A1D3D] border border-blue-900 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(15,45,92,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col text-white">
          <div className="absolute right-0 top-0 opacity-10 p-4 pointer-events-none text-white flex gap-4">
            <Shield size={80} />
            <Building size={60} className="mt-8" />
          </div>
          
          <div className="h-14 w-14 rounded-[14px] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white mb-6 relative z-10">
            <Shield className="h-6 w-6" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Jalur Pemerintah</h3>
          <p className="text-lg text-blue-100 leading-relaxed mb-8 relative z-10 flex-grow">
            Akses <strong>By-Name-By-Address (BNBA) Lengkap</strong> untuk eksekutif daerah. Dilengkapi fitur Pemilihan Sampel Rumah Tangga dan Simulasi Dampak Statis untuk menguji efektivitas biaya sebelum penyaluran bansos.
          </p>
          
          <button onClick={() => navigateTo('login')} className="mt-auto inline-flex items-center gap-2 text-rancage-accent font-bold group/btn relative z-10 hover:text-white transition-colors">
            <span className="relative">
              Portal Pemerintah
              <span className="absolute inset-0 bg-rancage-accent/20 blur-md rounded-full scale-150 opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
            </span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        {/* PMT-ML Section */}
        <div className="p-10 rounded-[20px] bg-white dark:bg-slate-900 border border-rancage-border dark:border-slate-800 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(15,45,92,0.06)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
          <div className="absolute right-0 top-0 opacity-5 p-4 pointer-events-none text-slate-500 flex gap-4">
            <Network size={80} />
            <Cpu size={60} className="mt-8" />
          </div>
          
          <div className="h-14 w-14 rounded-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 mb-6 relative z-10">
            <Network className="h-6 w-6" />
          </div>
          
          <h3 className="text-2xl font-bold text-rancage-text dark:text-white mb-4 relative z-10">Mesin Penggerak: PMT-ML</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 relative z-10 flex-grow">
            Algoritma <em>Gradient Boosting</em> mengekstraksi bobot variabel proxy antara Susenas dan Regsosek tanpa integrasi NIK. Model ini menghancurkan bias geografis dengan fokus membedah varians kesejahteraan rumah tangga (<em>T_Within 89,44%</em>).
          </p>
          
          <button onClick={() => navigateTo('methodology')} className="mt-auto inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold group/btn relative z-10 hover:text-rancage-primary dark:hover:text-white transition-colors">
            Pelajari Metodologi
            <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Bottom Information Ribbon */}
      <section className="bg-blue-50/80 dark:bg-slate-900/50 rounded-[20px] border border-blue-100 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="h-12 w-12 shrink-0 rounded-full bg-blue-100 dark:bg-slate-800 text-rancage-secondary flex items-center justify-center">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="h-12 w-px bg-blue-200 dark:bg-slate-700 hidden md:block"></div>
        <div className="flex-grow text-center md:text-left space-y-1">
          <h4 className="text-sm font-bold text-rancage-primary dark:text-slate-200">
            Audit Resmi & Pemberitahuan Hukum
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            RANCAGE mematuhi kerangka regulasi kepatuhan data nasional berdasarkan UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP). Akses ke mikrodata tingkat rumah tangga dibatasi secara ketat untuk audiens publik.
          </p>
        </div>
      </section>

    </div>
  );
}
