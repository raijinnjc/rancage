import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  ComposedChart
} from 'recharts';

const TREND_DATA = [
  { year: '2020', p0Average: 8.43, theilIndex: 0.295, betweenDisparity: 0.038, withinDisparity: 0.257 },
  { year: '2021', p0Average: 8.40, theilIndex: 0.288, betweenDisparity: 0.035, withinDisparity: 0.253 },
  { year: '2022', p0Average: 8.06, theilIndex: 0.269, betweenDisparity: 0.032, withinDisparity: 0.237 },
  { year: '2023', p0Average: 7.62, theilIndex: 0.272, betweenDisparity: 0.031, withinDisparity: 0.241 },
  { year: '2024', p0Average: 7.41, theilIndex: 0.275, betweenDisparity: 0.030, withinDisparity: 0.245 },
  { year: '2025', p0Average: 7.02, theilIndex: 0.279, betweenDisparity: 0.029, withinDisparity: 0.250 },
  { year: '2026*', p0Average: 6.85, theilIndex: 0.270, betweenDisparity: 0.028, withinDisparity: 0.242 },
];

export function PovertyTrendCard() {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-xs" id="poverty-trend-standalone-card">
      <div className="border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Trajektori Ketimpangan Sosial-Ekonomi & Kemiskinan (P0)
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Pemantauan tingkat makro persentase kemiskinan (P0) disandingkan dengan agregat Indeks Theil T (BPS Jawa Barat).
        </p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={TREND_DATA}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="p0Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 0.2]}
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
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="p0Average"
              name="Rata-rata Tingkat Kemiskinan (P0)"
              fill="url(#p0Grad)"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="theilIndex"
              name="Ketimpangan (Indeks Theil)"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TheilDecompositionCard() {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-xs" id="theil-decomposition-standalone-card">
      <div className="border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Dekomposisi Ketimpangan Indeks Theil (Antar vs Dalam Wilayah)
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Kontribusi ketimpangan antar-wilayah (between: 10,56%) vs dalam-wilayah (within: 89,44%) terhadap disparitas total.
        </p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={TREND_DATA}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
            <Legend verticalAlign="top" height={36} iconType="rect" wrapperStyle={{ fontSize: '11px' }} />
            <Bar
              dataKey="betweenDisparity"
              name="Ketimpangan Antar-Wilayah (Between)"
              stackId="theil"
              fill="#f59e0b"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="withinDisparity"
              name="Ketimpangan Dalam-Wilayah (Within)"
              stackId="theil"
              fill="#8b5cf6"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TheilTrendChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="theil-trend-chart-root">
      {/* Poverty Rate vs Inequality Index Chart */}
      <PovertyTrendCard />

      {/* Inequality Decomposition Stacked Bar Chart */}
      <TheilDecompositionCard />
    </div>
  );
}
