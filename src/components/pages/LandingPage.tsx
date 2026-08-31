import React from 'react';
import { 
  Lock, 
  Eye, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp,
  Layers, 
  Activity, 
  PieChart,
  Users,
  Shield,
  Building2,
  Database,
  Cpu,
  ShieldCheck,
  Scale,
  Compass,
  FileText
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { KujangLogo } from '../ui/KujangLogo.tsx';
import { MegaMendungPattern } from '../ui/MegaMendungPattern.tsx';

interface MacroMetricCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  source: string;
  trendDirection: 'positive' | 'negative' | 'neutral';
  highlight?: boolean;
}

const MacroMetricCard: React.FC<MacroMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  period, 
  source, 
  trendDirection,
  highlight = false
}) => {
  return (
    <div className={`p-5 rounded-sm border transition-all duration-200 flex flex-col justify-between ${
      highlight 
        ? 'bg-blue-50/40 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/60 shadow-xs' 
        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xs'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-xs bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
          {period}
        </span>
      </div>

      <div className="my-3">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
          {value}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-xs ${
            trendDirection === 'positive' 
              ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' 
              : trendDirection === 'negative' 
              ? 'bg-rose-100/80 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' 
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            {change}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <span>Rujukan: {source}</span>
      </div>
    </div>
  );
};

export function LandingPage() {
  const { navigateTo } = useNavigationStore();
  const { user } = useAuth();

  return (
    <div className="space-y-16 w-full max-w-6xl mx-auto pb-12 page-transition stagger-children">
      
      {/* 1. HERO SECTION - INSTITUTIONAL GOVTECH LAYOUT */}
      <section className="relative rounded-sm border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 sm:p-12 shadow-xs overflow-hidden">
        <MegaMendungPattern className="opacity-[0.03] text-blue-900 dark:text-blue-200" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          {/* Official Gov Header Insignia */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs">
            <KujangLogo size={18} className="text-[#C5962A]" />
            <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-slate-700 dark:text-slate-300">
              PEMERINTAH PROVINSI JAWA BARAT
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 font-bold">
              BAPPEDA JAWA BARAT
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              RANCAGE DSS
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              Sistem Pendukung Keputusan Penanggulangan Kemiskinan & Ketimpangan Berbasis Data Empiris
            </p>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Platform intelijen kebijakan lapisan pelengkap (<em>complementary intelligence layer</em>) yang mengintegrasikan data makro dan mikro lintas instansi untuk memecahkan anomali peningkatan indeks kedalaman kemiskinan (P1) di tengah tingginya ketimpangan dalam-wilayah Jawa Barat.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('exploration')}
              className="inline-flex items-center gap-2 rounded-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 px-5 py-2.5 text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Eksplorasi Wilayah Publik</span>
            </button>
            
            <button
              onClick={() => navigateTo('login')}
              className="inline-flex items-center gap-2 rounded-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Akses Aman Gov-ID</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. KERANJANG MAKRO SOSIAL EKONOMI JAWA BARAT (DATA GROUND TRUTH) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase">
              Keranjang Makro Sosial Ekonomi Jawa Barat
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rujukan indikator makro resmi Badan Pusat Statistik (BPS) Provinsi Jawa Barat per Maret 2025.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-sm border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            STANDAR DATA BPS 2025
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MacroMetricCard
            title="Tingkat Kemiskinan (P0)"
            value="7,02%"
            change="-0,39% vs Sep 2024"
            period="Maret 2025"
            source="BPS Jawa Barat"
            trendDirection="positive"
          />
          <MacroMetricCard
            title="Kedalaman Kemiskinan (P1)"
            value="1,21"
            change="+0,05 vs 2023 (Anomali)"
            period="2024"
            source="BPS Jawa Barat"
            trendDirection="negative"
            highlight={true}
          />
          <MacroMetricCard
            title="Rasio Ketimpangan (Gini)"
            value="0,416"
            change="Peringkat ke-3 Nasional"
            period="2024"
            source="BPS Jawa Barat"
            trendDirection="negative"
          />
          <MacroMetricCard
            title="Indeks Theil Total"
            value="0,279"
            change="+0,010 vs 2022"
            period="2022"
            source="Estimasi Empiris Theil"
            trendDirection="negative"
          />
          <MacroMetricCard
            title="Ketimpangan Dalam-Wilayah (Theil Within)"
            value="89,44%"
            change="Pendorong 89,44% Varians"
            period="2024"
            source="Dekomposisi Spasial"
            trendDirection="negative"
            highlight={true}
          />
          <MacroMetricCard
            title="Ketimpangan Antar-Wilayah (Theil Between)"
            value="10,56%"
            change="Disparitas Antar Daerah"
            period="2024"
            source="Dekomposisi Spasial"
            trendDirection="neutral"
          />
        </div>
      </section>

      {/* 3. ARSITEKTUR TIGA JALUR SISTEM (DATA, INTELLIGENCE, POLICY) */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase">
            Arsitektur Fungsional Platform
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pemisahan tegas antara jalur keterbukaan publik anonim dengan jalur operasional terenkripsi pemerintah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Panel 1: Jalur Publik */}
          <div className="p-6 rounded-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-xs uppercase">
                  AKSES TERBUKA
                </span>
                <Users className="h-4 w-4 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Jalur Keterbukaan Publik
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dirancang untuk <strong>mencegah stigmatisasi wilayah</strong>. Menyajikan data agregat anonim (Dekomposisi Theil, Peta Tipologi Wilayah Kuadran I–IV, dan Profil Makro Daerah) bagi peneliti, media, dan masyarakat luas.
              </p>
            </div>
            
            <button 
              onClick={() => navigateTo('exploration')} 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors pt-2 border-t border-slate-100 dark:border-slate-900 cursor-pointer"
            >
              <span>Buka Eksplorasi Wilayah</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Panel 2: Jalur Pemerintah */}
          <div className="p-6 rounded-sm bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-900/60 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-xs uppercase">
                  OTORISASI GOV-ID
                </span>
                <Shield className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Jalur Operasional Pemerintah
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Akses <strong>By-Name-By-Address (BNBA) Terverifikasi</strong> untuk jajaran Bappeda dan Dinas Sosial. Dilengkapi Sistem Peringatan Dini (EWS), modul intervensi keluarga rentan, dan simulator alokasi anggaran APBD.
              </p>
            </div>
            
            <button 
              onClick={() => navigateTo('login')} 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors pt-2 border-t border-slate-100 dark:border-slate-900 cursor-pointer"
            >
              <span>Masuk Portal Pemerintah</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Panel 3: Mesin Machine Learning */}
          <div className="p-6 rounded-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-xs uppercase">
                  KOMPUTASI ANALITIS
                </span>
                <Cpu className="h-4 w-4 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Mesin Model PMT & Theil
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Algoritma <em>Gradient Boosting (XGBoost)</em> mengekstraksi bobot aset proxy dari survei Susenas untuk mengidentifikasi tingkat kesejahteraan keluarga secara presisi guna menekan kebocoran anggaran (*Inclusion & Exclusion Error*).
              </p>
            </div>
            
            <button 
              onClick={() => navigateTo('methodology')} 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors pt-2 border-t border-slate-100 dark:border-slate-900 cursor-pointer"
            >
              <span>Pelajari Metodologi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. EKOSISTEM LEMBAGA & KEPATUHAN HUKUM */}
      <section className="p-6 rounded-sm bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                Kepatuhan Regulasi & Keamanan Data Nasional
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pengelolaan mikrodata mematuhi amanat <strong>UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> dan standar <strong>Perpres No. 39/2019 (Satu Data Indonesia)</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('about')}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shrink-0 cursor-pointer"
          >
            Baca Selengkapnya Tentang RANCAGE
          </button>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
