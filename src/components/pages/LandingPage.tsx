import { Lock, HelpCircle, Eye, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { KpiCard } from '../ui/KpiCard.tsx';

export function LandingPage() {
  const { navigateTo } = useNavigationStore();
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400">
          <ShieldAlert className="h-3 w-3 animate-pulse" />
          <span>SISTEM PENDUKUNG KEPUTUSAN KECERDASAN SOSIAL JAWA BARAT</span>
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
        <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-sm bg-white dark:bg-slate-950 space-y-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-sm font-semibold tracking-tight">Diagnosis Berbasis Bukti</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Mendekomposisi ketimpangan wilayah menggunakan dataset resmi BPS dan model indeks Theil untuk memetakan penyumbang disparitas geografis.
          </p>
        </div>

        <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-sm bg-white dark:bg-slate-950 space-y-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="text-sm font-semibold tracking-tight">Penargetan Mikro Prediktif</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Menerapkan klasifikasi Gradient Boosting Machine (GBM) yang diaudit untuk mengestimasi skor kesejahteraan rumah tangga Proxy Means Test (PMT).
          </p>
        </div>

        <div className="p-6 border border-slate-100 dark:border-slate-900 rounded-sm bg-white dark:bg-slate-950 space-y-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
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
