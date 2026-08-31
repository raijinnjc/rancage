import React from 'react';
import { PageHeader } from '../ui/PageHeader.tsx';
import { BookOpen, GitBranch, Shield, Zap } from 'lucide-react';

export function MethodologyPage() {
  return (
    <div className="space-y-6 pb-20 page-transition stagger-children">
      <PageHeader
        title="Metodologi RANCAGE"
        description="Penjelasan Dekomposisi Indeks Theil, Proxy Means Testing berbasis Machine Learning, dan Integrasi P3KE."
        icon={<BookOpen className="h-5 w-5 text-blue-500" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Dekomposisi Indeks Theil</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Indeks Theil (T) digunakan untuk mengukur ketimpangan yang dapat diurai secara aditif menjadi dua komponen: 
            ketimpangan antarwilayah (Between) dan ketimpangan dalam wilayah (Within).
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
            <li><strong>T_Between (10,56%):</strong> Kesenjangan PDRB/pengeluaran rata-rata antar kabupaten/kota di Jawa Barat.</li>
            <li><strong>T_Within (89,44%):</strong> Kesenjangan yang terjadi di dalam batas satu kabupaten/kota.</li>
          </ul>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Analisis membuktikan kontribusi <i>Within-Region</i> di Jawa Barat mendominasi hingga 89,44%, mengindikasikan 
            bahwa kebijakan penanggulangan kemiskinan harus bersifat spesifik lokasi hingga tingkat desa dan rumah tangga (presisi mikro).
          </p>
        </div>

        <div className="p-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-sm bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Proxy Means Testing (Machine Learning)</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            RANCAGE menggantikan estimasi OLS konvensional dengan algoritma machine learning <strong>Gradient Boosting (XGBoost)</strong>.
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
            <li><strong>Data Latih:</strong> Survei Sosial Ekonomi Nasional (Susenas) sebagai <em>ground truth</em> pengeluaran konsumsi riil.</li>
            <li><strong>Variabel Proksi:</strong> Data registrasi Regsosek digunakan sebagai input prediktor (karakteristik hunian, aset produktif).</li>
            <li><strong>Output:</strong> Probabilitas klasifikasi rumah tangga ke dalam Desil 1–4 (Target Intervensi Bansos).</li>
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-4 shadow-xs mt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg">Positioning terhadap P3KE / DTSEN</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          RANCAGE <strong>bukanlah pengganti</strong> dari P3KE (Pensasaran Percepatan Penghapusan Kemiskinan Ekstrem) 
          ataupun DTSEN (Data Tunggal Sosial Ekonomi Nasional). RANCAGE merupakan <i>complementary intelligence layer</i> 
          (lapisan pelengkap) yang memiliki tiga nilai tambah utama:
        </p>
        <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li>Membuka gerbang data agregat makro kepada publik untuk keperluan riset dan transparansi.</li>
          <li>Menjembatani analisis makro (Indeks Theil/Tipologi) langsung ke presisi mikro (skor rumah tangga).</li>
          <li>Menyediakan estimasi <i>Inclusion/Exclusion Error</i> secara otomatis dan obyektif.</li>
        </ol>
      </div>
    </div>
  );
}

export default MethodologyPage;
