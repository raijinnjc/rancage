import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

const TRAJECTORY_DATA = [
  // Historis
  { year: '2020', historical: 8.43, target: null, lowerBound: null, upperBound: null },
  { year: '2021', historical: 8.40, target: null, lowerBound: null, upperBound: null },
  { year: '2022', historical: 8.06, target: null, lowerBound: null, upperBound: null },
  { year: '2023', historical: 7.62, target: null, lowerBound: null, upperBound: null },
  { year: '2024', historical: 7.41, target: null, lowerBound: null, upperBound: null },
  { year: '2025', historical: 7.02, target: 7.02, lowerBound: 7.02, upperBound: 7.02 }, // Anchor node BPS 2025

  // Proyeksi
  { year: '2026 Proyeksi', historical: null, target: 6.70, lowerBound: 6.30, upperBound: 7.10 },
  { year: '2027 Proyeksi', historical: null, target: 6.30, lowerBound: 5.80, upperBound: 6.80 },
  { year: '2028 Proyeksi', historical: null, target: 5.90, lowerBound: 5.30, upperBound: 6.50 },
  { year: '2029 Proyeksi', historical: null, target: 5.50, lowerBound: 4.80, upperBound: 6.20 },
  { year: '2030 Proyeksi', historical: null, target: 5.00, lowerBound: 4.20, upperBound: 5.80 },
];

export function FanTrajectoryChart() {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-xs" id="fan-trajectory-root">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-4 mb-6">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Grafik Kipas Lintasan Kemiskinan RPJMD (2020-2030)
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Memantau penurunan kemiskinan historis nyata (BPS 2025) terhadap koridor target jangka menengah dan batas kepercayaan.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 bg-blue-500 rounded-xs"></span>
            <span>Historis</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 border-t border-dashed border-emerald-500"></span>
            <span>Jalur Target RPJMD</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-6 bg-emerald-100 dark:bg-emerald-950/30 rounded-xs border border-emerald-300 dark:border-emerald-800"></span>
            <span>Koridor Toleransi</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={TRAJECTORY_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[4.5, 9.5]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '4px',
                color: '#fff',
                border: 'none',
                fontSize: '11px',
              }}
            />

            {/* Shaded tolerance/confidence corridor (low to high bound) */}
            <Area
              name="Koridor Toleransi"
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="#10b981"
              fillOpacity={0.12}
            />
            <Area
              name="Base"
              type="monotone"
              dataKey="lowerBound"
              stroke="none"
              fill="#ffffff"
              className="dark:fill-slate-950"
              fillOpacity={1.0}
            />

            {/* Historical Solid line */}
            <Line
              name="Rata-rata P0 Historis"
              type="monotone"
              dataKey="historical"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6 }}
            />

            {/* Projected Target Dotted line */}
            <Line
              name="Jalur Target RPJMD"
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 4, stroke: '#10b981', strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6 }}
            />

            {/* Highlighted Anchor Point (2025 Transition) */}
            <ReferenceDot
              x="2025"
              y={7.02}
              r={5}
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth={1.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Trajectory Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-slate-100 dark:border-slate-900 mt-5">
        <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Penyelarasan RPJMD</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block">SESUAI JALUR</span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tingkat kemiskinan saat ini (7,02%) berada dalam koridor toleransi target inti RPJMD.</p>
        </div>
        <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">Tingkat Penurunan Diperlukan</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block">-0,40% / Tahun</span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Rata-rata pengurangan tahunan tingkat kemiskinan yang ditargetkan menuju 5,00% pada 2030.</p>
        </div>
        <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Risiko Gangguan</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block">RENDAH (12,4%)</span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Probabilitas komputasi deviasi dari batas target pada periode 2026-2027.</p>
        </div>
      </div>
    </div>
  );
}
