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
  // Historical
  { year: '2020', historical: 8.42, target: null, lowerBound: null, upperBound: null },
  { year: '2021', historical: 8.61, target: null, lowerBound: null, upperBound: null },
  { year: '2022', historical: 8.24, target: null, lowerBound: null, upperBound: null },
  { year: '2023', historical: 7.98, target: null, lowerBound: null, upperBound: null },
  { year: '2024', historical: 7.89, target: null, lowerBound: null, upperBound: null },
  { year: '2025', historical: 7.68, target: null, lowerBound: null, upperBound: null },
  { year: '2026', historical: 7.62, target: 7.62, lowerBound: 7.62, upperBound: 7.62 }, // Anchor node

  // Projections
  { year: '2027 Proj', historical: null, target: 7.20, lowerBound: 6.90, upperBound: 7.50 },
  { year: '2028 Proj', historical: null, target: 6.80, lowerBound: 6.30, upperBound: 7.20 },
  { year: '2029 Proj', historical: null, target: 6.40, lowerBound: 5.70, upperBound: 7.00 },
  { year: '2030 Proj', historical: null, target: 6.00, lowerBound: 5.20, upperBound: 6.80 },
];

export function FanTrajectoryChart() {
  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs" id="fan-trajectory-root">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-900 pb-4 mb-6">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            RPJMD Poverty Trajectory Fan Chart (2020-2030)
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Monitors real historical headcount reductions against the mid-term target corridors and confidence boundaries.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 bg-blue-500 rounded-xs"></span>
            <span>Historical</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 border-t border-dashed border-emerald-500"></span>
            <span>RPJMD Target Path</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-6 bg-emerald-100 dark:bg-emerald-950/30 rounded-xs border border-emerald-300 dark:border-emerald-800"></span>
            <span>Tolerance Corridor</span>
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
              name="Tolerance Corridor"
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
              name="Historical P0 Average"
              type="monotone"
              dataKey="historical"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6 }}
            />

            {/* Projected Target Dotted line */}
            <Line
              name="RPJMD Target Path"
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 4, stroke: '#10b981', strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6 }}
            />

            {/* Highlighted Anchor Point (2026 Transition) */}
            <ReferenceDot
              x="2026"
              y={7.62}
              r={5}
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth={1.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Trajectory Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-slate-50 dark:border-slate-900 mt-5">
        <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/50 rounded flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">RPJMD Alignment</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block">ON TRACK</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Current headcount (7.62%) aligns perfectly within core target tolerance.</p>
        </div>
        <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-950/50 rounded flex flex-col justify-between">
          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">Required Run-Rate</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block">-0.41% / Year</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Average annualized headcount reduction required to secure 6.00% by 2030.</p>
        </div>
        <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/50 rounded flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Disruption Risk</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block">LOW (12.4%)</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Calculated probability of breaching the upper tolerance limit in 2027.</p>
        </div>
      </div>
    </div>
  );
}
