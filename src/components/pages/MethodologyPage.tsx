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
        <div className="p-6 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg">Dekomposisi Indeks Theil</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Indeks Theil (T) digunakan untuk mengukur ketimpangan yang dapat diurai secara aditif menjadi dua komponen: 
            ketimpangan antarwilayah (Between) dan ketimpangan dalam wilayah (Within).
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li><strong>T_Between:</strong> Kesenjangan PDRB/pengeluaran rata-rata antar kabupaten/kota di Jawa Barat.</li>
            <li><strong>T_Within:</strong> Kesenjangan yang terjadi di dalam batas satu kabupaten/kota.</li>
          </ul>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Penelitian menunjukkan kontribusi <i>Within-Region</i> di Jawa Barat mendominasi hingga 89,44%, mengindikasikan 
            bahwa kebijakan pengentasan kemiskinan harus bersifat spesifik lokasi hingga level desa/rumah tangga (presisi mikro).
          </p>
        </div>

        <div className="p-6 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg">Proxy Means Testing (Machine Learning)</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            RANCAGE menggantikan rumus PMT regresi linear klasik dengan algoritma <strong>Gradient Boosting</strong>.
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li><strong>Data Latih:</strong> Survei Sosial Ekonomi Nasional (Susenas) digunakan sebagai *ground truth* pengeluaran konsumsi riil.</li>
            <li><strong>Variabel Proksi:</strong> Data registrasi Regsosek digunakan sebagai input prediktor (kondisi atap, lantai, dinding, kepemilikan aset).</li>
            <li><strong>Output:</strong> Probabilitas sebuah rumah tangga masuk ke dalam Desil 1-4 (Miskin), 5-7 (Menengah Rentan), atau 8-10 (Sejahtera).</li>
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4 mt-6">
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
