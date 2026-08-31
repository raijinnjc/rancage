import React from 'react';
import { PageHeader } from '../ui/PageHeader.tsx';
import { 
  BookOpen, 
  GitBranch, 
  Shield, 
  Zap, 
  Scale, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  FileText,
  Binary,
  Database,
  Lock
} from 'lucide-react';
import { MegaMendungPattern } from '../ui/MegaMendungPattern.tsx';
import { KujangLogo } from '../ui/KujangLogo.tsx';

export function MethodologyPage() {
  return (
    <div className="space-y-10 pb-20 page-transition stagger-children max-w-6xl mx-auto">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Metodologi Ilmiah RANCAGE DSS"
        description="Kerangka Ekonometrika Dekomposisi Indeks Theil, Pemodelan Proxy Means Testing Berbasis Machine Learning (Gradient Boosting), dan Interoperabilitas Satu Data Indonesia."
        icon={<BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      />

      {/* 2. EXECUTIVE METHODOLOGY SUMMARY */}
      <section className="relative rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 md:p-8 shadow-xs overflow-hidden">
        <MegaMendungPattern className="opacity-[0.03] text-blue-900 dark:text-blue-200" />
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-xs uppercase border border-blue-200/60 dark:border-blue-900/60">
              LANDASAN METODOLOGI TERVERIFIKASI
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pendekatan Dua Lapis: Dari Makro Spasial Menuju Presisi Mikro
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            RANCAGE mengintegrasikan dua disiplin ilmu kuantitatif utama: <strong>Ekonometrika Spasial</strong> (Dekomposisi Indeks Theil dan Matriks Tipologi Kemiskinan-Ketimpangan) untuk mendiagnosis disparitas makro wilayah, serta <strong>Machine Learning Non-Linear</strong> (Gradient Boosting Trees & SHAP Game Theory) untuk menghitung estimasi pengeluaran dan probabilitas desil kesejahteraan rumah tangga pada tingkat mikro secara objektif dan transparan.
          </p>
        </div>
      </section>

      {/* 3. PILAR 1 & 2: THEIL DECOMPOSITION & FGT POVERTY INDICES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PILAR 1: DEKOMPOSISI THEIL */}
        <div className="p-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-3">
              <div className="p-2 rounded-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <GitBranch className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">PILAR EKONOMETRIKA I</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Dekomposisi Indeks Theil (T)</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Indeks Theil merupakan ukuran entropi informasi ketimpangan yang memiliki sifat aditif dapat diurai (*additive decomposability*) tanpa residu menjadi dua komponen:
            </p>

            {/* Math Formula Box */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xs border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2">
              <div className="text-center font-bold text-blue-700 dark:text-blue-400">
                T_Total = T_Between + T_Within
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                <div><strong>T_Between (10,56%)</strong>: Kesenjangan rata-rata antar 27 kab/kota</div>
                <div><strong>T_Within (89,44%)</strong>: Kesenjangan di dalam batas satu kab/kota</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>Temuan Empiris Jawa Barat:</strong> Dari total Indeks Theil sebesar <strong>0,279</strong>, sebanyak <strong>89,44%</strong> varians ketimpangan berasal dari dalam wilayah kabupaten/kota masing-masing (<em>Within-Region</em>), sementara ketimpangan antar-kabupaten/kota hanya menyumbang <strong>10,56%</strong> (<em>Between-Region</em>).
              </p>
              <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/60 rounded-xs text-[11px]">
                <strong className="text-blue-800 dark:text-blue-300 font-mono uppercase block text-[9px] mb-0.5">Implikasi Kebijakan Fiskal:</strong>
                Kebijakan alokasi anggaran yang bersifat merata horizontal antar daerah tidak lagi efektif. Intervensi wajib masuk hingga tingkat kantong kemiskinan desa dan keluarga miskin.
              </div>
            </div>
          </div>
        </div>

        {/* PILAR 2: INDEKS FOSTER-GREER-THORBECKE (FGT) */}
        <div className="p-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-3">
              <div className="p-2 rounded-sm bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">PILAR EKONOMETRIKA II</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Indeks Kemiskinan FGT (P0, P1, P2)</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kelas metrik Foster-Greer-Thorbecke (FGT) digunakan untuk mengukur persentase, jarak pengeluaran, dan keparahan distribusi konsumsi kaum miskin:
            </p>

            {/* Math Formula Box */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xs border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2">
              <div className="text-center font-bold text-purple-700 dark:text-purple-400">
                P_alpha = (1/N) * sum( ((z - y_i) / z)^alpha )
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                <div>alpha = 0 &rarr; P0 : Rasio Kemiskinan / Headcount Ratio (7,02% - BPS Maret 2025)</div>
                <div>alpha = 1 &rarr; P1 : Indeks Kedalaman Kemiskinan / Poverty Gap (1,21)</div>
                <div>alpha = 2 &rarr; P2 : Indeks Keparahan Kemiskinan / Poverty Severity (0,32)</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>Diagnosis Anomali Jawa Barat:</strong> Meskipun tingkat kemiskinan (P0) menurun ke angka 7,02%, indeks kedalaman (P1) mengalami kenaikan ke 1,21 (+0,05 vs 2023). Hal ini menunjukkan jarak pengeluaran kelompok miskin ekstrem justru semakin menjauh dari garis kemiskinan.
              </p>
              <div className="p-3 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/60 rounded-xs text-[11px]">
                <strong className="text-purple-800 dark:text-purple-300 font-mono uppercase block text-[9px] mb-0.5">Solusi RANCAGE:</strong>
                Mengarahkan bantuan transfer bersyarat dan penyediaan aset produktif yang mampu mengangkat pengeluaran rumah tangga di bawah desil D1–D2 secara permanen.
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 4. PILAR 3 & 4: MACHINE LEARNING PMT & SHAP EXPLAINABILITY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PILAR 3: PROXY MEANS TESTING ML */}
        <div className="p-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-3">
              <div className="p-2 rounded-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">PILAR DATA SCIENCE I</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Proxy Means Testing (Gradient Boosting)</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              RANCAGE mentransformasikan PMT regresi linear klasik (OLS) yang rentan bias dan kaku menjadi model <strong>Gradient Boosting Decision Trees (XGBoost / LightGBM)</strong> yang mampu menangkap interaksi non-linear indikator sosioekonomi:
            </p>

            {/* Objective Function */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xs border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2">
              <div className="text-center font-bold text-emerald-700 dark:text-emerald-400">
                L(t) = sum( l(y_i, y_hat^(t-1) + f_t(x_i)) ) + Omega(f_t)
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                <div>y_i : Pengeluaran konsumsi riil (Data Latih Susenas Maret 2025)</div>
                <div>x_i : Variabel proksi aset, hunian, pendidikan, dan demografi (Regsosek)</div>
                <div>Omega(f_t) : Penalti regularisasi anti-overfitting</div>
              </div>
            </div>

            <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <li><strong>Akurasi Klasifikasi Desil:</strong> 91,3% (Akurasi Inklusi Target Bansos).</li>
              <li><strong>Reduksi Inclusion Error:</strong> Menurunkan kebocoran target dari 18,4% (metode lama) menjadi 6,2%.</li>
              <li><strong>Reduksi Exclusion Error:</strong> Menyelamatkan keluarga rentan yang tidak memiliki slip gaji formal.</li>
            </ul>
          </div>
        </div>

        {/* PILAR 4: GAME-THEORETIC SHAP EXPLAINABILITY */}
        <div className="p-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-3">
              <div className="p-2 rounded-sm bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">PILAR DATA SCIENCE II</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Interpretabilitas Model & Nilai SHAP</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Untuk menjamin <strong>akuntabilitas dan transparansi hukum pemerintah</strong> (mencegah <em>AI black box</em>), kontribusi setiap fitur terhadap skor kesejahteraan keluarga dihitung menggunakan Teori Permainan Kooperatif Shapley:
            </p>

            {/* SHAP Formula */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xs border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2">
              <div className="text-center font-bold text-amber-700 dark:text-amber-400">
                phi_i(f, x) = sum( [ |S|!(|F| - |S| - 1)! / |F|! ] * [ f(S U (i)) - f(S) ] )
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                <div>phi_i : Kontribusi marginal variabel i terhadap estimasi pengeluaran</div>
                <div>S : Subset fitur karakteristik rumah tangga yang dievaluasi</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>5 Kontributor Utama Skor Kesejahteraan:</strong>
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Kepemilikan Aset Produktif (SHAP +0,28)</li>
                <li>Akses Sanitasi & Sumber Air Bersih Terlindungi (SHAP +0,22)</li>
                <li>Material Dinding & Lantai Hunian (SHAP +0,19)</li>
                <li>Tingkat Pendidikan Kepala Rumah Tangga (SHAP +0,15)</li>
                <li>Rasio Ketergantungan Anggota Keluarga (SHAP -0,16)</li>
              </ol>
            </div>
          </div>
        </div>

      </section>

      {/* 5. POSITIONING TERHADAP P3KE, DTSEN, DAN SATU DATA INDONESIA */}
      <section className="p-6 md:p-8 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-4">
          <div className="p-2 rounded-sm bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">INTEROPERABILITAS SISTEM NASIONAL</span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Positioning Strategis terhadap P3KE & DTSEN</h3>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          RANCAGE <strong>bukanlah pengganti</strong> dari P3KE (Pensasaran Percepatan Penghapusan Kemiskinan Ekstrem) ataupun DTSEN (Data Tunggal Sosial Ekonomi Nasional). RANCAGE beroperasi sebagai <em>Complementary Intelligence Layer</em> (lapisan kecerdasan pelengkap) dengan tiga diferensiasi nilai tambah:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              1. Keterbukaan & Non-Stigmatisasi
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Membuka gerbang data makro agregat (Theil & Tipologi) secara terbuka dan aman bagi publik dan akademisi tanpa membocorkan data pribadi penduduk.
            </p>
          </div>

          <div className="p-4 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              2. Jembatan Makro-ke-Mikro
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Menghubungkan temuan makro (ketimpangan dalam-wilayah 89,44%) langsung ke algoritma penargetan mikro rumah tangga dan simulasi APBD.
            </p>
          </div>

          <div className="p-4 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              3. Optimasi Anggaran Berbasis Bukti
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Menyediakan simulator alokasi fiskal interaktif dengan metrik efektivitas biaya per 1% penurunan angka kemiskinan P0.
            </p>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Mematuhi UU No. 27/2022 (UU PDP) • Perpres No. 39/2019 (SDI) • Perpres No. 95/2018 (SPBE)</span>
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-300">Bappeda Provinsi Jawa Barat</span>
        </div>
      </section>

    </div>
  );
}

export default MethodologyPage;
