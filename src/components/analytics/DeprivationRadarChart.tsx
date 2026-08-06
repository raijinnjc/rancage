import React, { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { formatPercentage } from '../../utils/format.ts';

// Detailed multidimensional deprivation index score for each district
// Ranges from 0 (perfect, no deprivation) to 100 (complete deprivation)
const DEPRIVATION_PROFILES: Record<string, Array<{ subject: string; local: number; average: number }>> = {
  '3202': [ // Kab. Sukabumi
    { subject: 'Akses Puskesmas', local: 78, average: 55 },
    { subject: 'Air Bersih', local: 84, average: 60 },
    { subject: 'Lama Sekolah', local: 68, average: 50 },
    { subject: 'Kepemilikan Aset', local: 55, average: 45 },
    { subject: 'Dinding Tidak Layak', local: 72, average: 50 },
    { subject: 'Akses Sanitasi', local: 80, average: 58 },
  ],
  '3203': [ // Kab. Cianjur
    { subject: 'Akses Puskesmas', local: 85, average: 55 },
    { subject: 'Air Bersih', local: 90, average: 60 },
    { subject: 'Lama Sekolah', local: 74, average: 50 },
    { subject: 'Kepemilikan Aset', local: 62, average: 45 },
    { subject: 'Dinding Tidak Layak', local: 78, average: 50 },
    { subject: 'Akses Sanitasi', local: 85, average: 58 },
  ],
  '3205': [ // Kab. Garut
    { subject: 'Akses Puskesmas', local: 80, average: 55 },
    { subject: 'Air Bersih', local: 70, average: 60 },
    { subject: 'Lama Sekolah', local: 82, average: 50 },
    { subject: 'Kepemilikan Aset', local: 58, average: 45 },
    { subject: 'Dinding Tidak Layak', local: 64, average: 50 },
    { subject: 'Akses Sanitasi', local: 78, average: 58 },
  ],
  '3206': [ // Kab. Tasikmalaya
    { subject: 'Akses Puskesmas', local: 92, average: 55 },
    { subject: 'Air Bersih', local: 88, average: 60 },
    { subject: 'Lama Sekolah', local: 85, average: 50 },
    { subject: 'Kepemilikan Aset', local: 60, average: 45 },
    { subject: 'Dinding Tidak Layak', local: 80, average: 50 },
    { subject: 'Akses Sanitasi', local: 88, average: 58 },
  ],
  '3208': [ // Kab. Kuningan
    { subject: 'Akses Puskesmas', local: 68, average: 55 },
    { subject: 'Air Bersih', local: 65, average: 60 },
    { subject: 'Lama Sekolah', local: 78, average: 50 },
    { subject: 'Kepemilikan Aset', local: 52, average: 45 },
    { subject: 'Dinding Tidak Layak', local: 62, average: 50 },
    { subject: 'Akses Sanitasi', local: 72, average: 58 },
  ],
  '3212': [ // Kab. Indramayu
    { subject: 'Akses Puskesmas', local: 75, average: 55 },
    { subject: 'Air Bersih', local: 78, average: 60 },
    { subject: 'Lama Sekolah', local: 80, average: 50 },
    { subject: 'Kepemilikan Aset', local: 68, average: 45 },
    { subject: 'Dinding Tidak Layak', local: 70, average: 50 },
    { subject: 'Akses Sanitasi', local: 76, average: 58 },
  ],
};

// Fallback profile if some other district is selected
const DEFAULT_PROFILE = [
  { subject: 'Akses Puskesmas', local: 55, average: 55 },
  { subject: 'Air Bersih', local: 60, average: 60 },
  { subject: 'Lama Sekolah', local: 50, average: 50 },
  { subject: 'Kepemilikan Aset', local: 45, average: 45 },
  { subject: 'Dinding Tidak Layak', local: 50, average: 50 },
  { subject: 'Akses Sanitasi', local: 58, average: 58 },
];

export function DeprivationRadarChart() {
  const [districtId, setDistrictId] = useState<string>(() => localStorage.getItem('selectedDistrictId') || '3202'); // Load from selection

  const selectedDistrict = WEST_JAVA_DISTRICTS.find((d) => d.id === districtId) || WEST_JAVA_DISTRICTS[1];
  const profileData = DEPRIVATION_PROFILES[districtId] || DEFAULT_PROFILE;

  // Find priority districts for options list (those with poverty rate > 9%)
  const priorityDistricts = WEST_JAVA_DISTRICTS.filter((d) => d.p0 >= 9.0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="deprivation-radar-root">
      {/* Recharts Radar Chart */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Radar Deprivasi Multidimensi
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Skor intensitas deprivasi (nilai yang lebih tinggi menunjukkan kekurangan aset/akses yang lebih parah).
            </p>
          </div>
          {/* Selector */}
          <select
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            className="rounded-sm border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-2 py-1 text-xs font-semibold outline-none focus:border-blue-500 h-8"
          >
            {priorityDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={profileData}>
              <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 9 }}
              />
              <Radar
                name={`Deprivasi ${selectedDistrict.name}`}
                dataKey="local"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
              />
              <Radar
                name="Rata-rata Tolok Ukur Provinsi"
                dataKey="average"
                stroke="#64748b"
                fill="#64748b"
                fillOpacity={0.1}
              />
              <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '4px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '11px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benchmark Diagnostics details */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              analisis tolok ukur komparatif
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-0.5">
              {selectedDistrict.name} vs Rata-rata Jawa Barat
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 border border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tingkat Kemiskinan P0</span>
              <span className="text-lg font-bold font-mono tracking-tight text-rose-500 mt-1 block">
                {formatPercentage(selectedDistrict.p0)}
              </span>
            </div>
            <div className="p-3.5 border border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kesenjangan Provinsi</span>
              <span className="text-lg font-bold font-mono tracking-tight text-rose-500 mt-1 block">
                kesenjangan +{(selectedDistrict.p0 - 7.62).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-900 pb-2">
              <span className="text-slate-400">Total Populasi Garis Kemiskinan:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-100">
                {Math.round(selectedDistrict.population * (selectedDistrict.p0 / 100)).toLocaleString('id-ID')} jiwa
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-900 pb-2">
              <span className="text-slate-400">Kendala Sektor Utama:</span>
              <span className="font-bold font-mono text-amber-500">
                {selectedDistrict.id === '3206' ? 'Logistik Pertanian' : 'Sanitasi Infrastruktur'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-slate-400">Peringkat Rekomendasi Kebijakan:</span>
              <span className="font-bold font-mono text-blue-500">
                Prioritas Mendesak #{(selectedDistrict.p0 > 12.0 ? 1 : selectedDistrict.p0 > 11.0 ? 2 : 3)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900 p-3 rounded-xs text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5 uppercase tracking-wider text-[9px]">Ringkasan Sosial Ekonomi:</span>
          {selectedDistrict.name} menunjukkan tingkat deprivasi yang tinggi khususnya pada sumbu <span className="font-bold text-slate-700 dark:text-slate-300">Air Bersih</span> dan <span className="font-bold text-slate-700 dark:text-slate-300">Akses Sanitasi</span>. Mengarahkan Anggaran Pendapatan dan Belanja Daerah (APBD) ke jaringan sanitasi desa akan menghasilkan penurunan P0 tercepat.
        </div>
      </div>
    </div>
  );
}
