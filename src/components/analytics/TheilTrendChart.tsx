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
  { year: '2020', p0Average: 8.42, theilIndex: 0.145, betweenDisparity: 0.082, withinDisparity: 0.063 },
  { year: '2021', p0Average: 8.61, theilIndex: 0.151, betweenDisparity: 0.088, withinDisparity: 0.063 },
  { year: '2022', p0Average: 8.24, theilIndex: 0.138, betweenDisparity: 0.076, withinDisparity: 0.062 },
  { year: '2023', p0Average: 7.98, theilIndex: 0.129, betweenDisparity: 0.071, withinDisparity: 0.058 },
  { year: '2024', p0Average: 7.89, theilIndex: 0.124, betweenDisparity: 0.068, withinDisparity: 0.056 },
  { year: '2025', p0Average: 7.68, theilIndex: 0.119, betweenDisparity: 0.064, withinDisparity: 0.055 },
  { year: '2026', p0Average: 7.62, theilIndex: 0.115, betweenDisparity: 0.061, withinDisparity: 0.054 },
];

export function PovertyTrendCard() {
  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="poverty-trend-standalone-card">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Socioeconomic Disparity & Poverty Headcount Trajectory
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Macro-level tracking of average headcount indices (P0) paired with the aggregate Theil T index.
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
              name="Average P0 Headcount Rate"
              fill="url(#p0Grad)"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="theilIndex"
              name="Disparity (Theil Index)"
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
    <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="theil-decomposition-standalone-card">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Theil Disparity Decomposition (Between vs Within)
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Inter-district (between) versus intra-district (within) inequality contributions to the overall disparity index.
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
              name="Between-District Inequality"
              stackId="theil"
              fill="#f59e0b"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="withinDisparity"
              name="Within-District Inequality"
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
