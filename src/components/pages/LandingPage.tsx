import { Lock, HelpCircle, Eye, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { KpiCard } from '../ui/KpiCard.tsx';
import { MegaMendungPattern } from '../ui/MegaMendungPattern.tsx';
import { KujangLogo } from '../ui/KujangLogo.tsx';

export function LandingPage() {
  const { navigateTo } = useNavigationStore();
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-16 space-y-6 mx-auto w-full overflow-hidden rounded-md border border-slate-100 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900/50 dark:to-slate-950">
        <MegaMendungPattern className="text-blue-500 opacity-[0.04] dark:opacity-[0.02]" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono border border-kujang-gold/30 bg-kujang-gold/10 text-[#C5962A] dark:text-[#E2B750]">
            <KujangLogo size={12} className="animate-pulse" />
            <span>SISTEM PENDUKUNG KEPUTUSAN TATAR SUNDA</span>
          </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-sans">
          Kecerdasan Keputusan untuk <span className="text-blue-600">Penanggulangan Kemiskinan</span>
        </h1>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          RANCAGE (Regional Analytics for Collaborative Governance and Equity) mengoordinasikan analisis spasial, model prediksi Machine Learning, dan indeks deprivasi multi-dimensi guna membantu para pengambil kebijakan di Jawa Barat.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigateTo('dashboard')}
            className="inline-flex items-center gap-1.5 rounded-sm bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide transition-colors shadow-xs"
          >
            <Eye className="h-4 w-4" />
            Eksplorasi Indikator Publik
          </button>
          
          <button
            onClick={() => navigateTo('login')}
            className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 px-5 py-2.5 text-xs font-semibold tracking-wide transition-colors"
          >
            <Lock className="h-4 w-4 text-blue-500" />
            Akses Aman Gov-ID
          </button>
        </div>
        </div>
      </section>

      {/* Macro Indicators Basket Grid */}
      <section className="space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-900 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Keranjang Makro Sosial Ekonomi Jawa Barat (Kondisi Terkini 2026)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Rasio Headcount Kemiskinan (P0)"
            value="7,62%"
            change="-0,34% vs Triwulan Sebelumnya"
            trend="down"
            trendDirection="positive"
            description="Persentase penduduk di bawah garis kemiskinan resmi."
          />
          <KpiCard
            title="Indeks Kedalaman Kemiskinan (P1)"
            value="1,24"
            change="-0,08"
            trend="down"
            trendDirection="positive"
            description="Indeks rata-rata kesenjangan kedalaman pengeluaran konsumsi."
          />
          <KpiCard
            title="Ketimpangan (Gini)"
            value="0,412"
            change="+0,003"
            trend="up"
            trendDirection="negative"
            description="Rasio ketimpangan distribusi konsumsi provinsi."
          />
          <KpiCard
            title="Anggaran Alokasi Aktif"
            value="Rp 4,20 Triliun"
            change="+12,4% yoy"
            trend="up"
            trendDirection="positive"
            description="Total volume fiskal yang disalurkan ke desil sasaran D1-D2."
          />
        </div>
      </section>

      {/* Program Pillars / Information Architecture Explanation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-sm bg-white dark:bg-slate-950 space-y-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <KujangLogo size={100} />
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100/50 text-[#C5962A] border border-kujang-gold/20 flex items-center justify-center font-bold relative z-10">
            1
          </div>
          <h3 className="text-sm font-semibold tracking-tight relative z-10">Diagnosis Berbasis Bukti</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">
            Mendekomposisi ketimpangan wilayah menggunakan dataset resmi BPS dan model indeks Theil untuk memetakan penyumbang disparitas geografis.
          </p>
        </div>

        <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-sm bg-white dark:bg-slate-950 space-y-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <KujangLogo size={100} />
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100/50 text-[#C5962A] border border-kujang-gold/20 flex items-center justify-center font-bold relative z-10">
            2
          </div>
          <h3 className="text-sm font-semibold tracking-tight relative z-10">Penargetan Mikro Prediktif</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">
            Menerapkan klasifikasi Gradient Boosting Machine (GBM) yang diaudit untuk mengestimasi skor kesejahteraan rumah tangga Proxy Means Test (PMT).
          </p>
        </div>

        <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-sm bg-white dark:bg-slate-950 space-y-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <KujangLogo size={100} />
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100/50 text-[#C5962A] border border-kujang-gold/20 flex items-center justify-center font-bold relative z-10">
            3
          </div>
          <h3 className="text-sm font-semibold tracking-tight">Kesesuaian Kebijakan Algoritmik</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Mensimulasikan dan mencocokkan program fiskal wilayah dengan sasaran penduduk miskin untuk memaksimalkan efisiensi perlindungan sosial.
          </p>
        </div>
      </section>

      {/* Public Notice Banner */}
      <section className="p-6 rounded-sm border border-slate-100 bg-slate-50 dark:border-slate-900 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Audit Resmi & Pemberitahuan Hukum
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
            RANCAGE mematuhi kerangka regulasi kepatuhan data nasional berdasarkan UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP). Akses ke mikrodata tingkat rumah tangga dibatasi untuk publik umum.
          </p>
        </div>
        <button
          onClick={() => navigateTo('login')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors whitespace-nowrap shrink-0"
        >
          <span>Ajukan Akses Kredensial</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </section>
    </div>
  );
}
