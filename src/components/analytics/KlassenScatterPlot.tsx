import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { Info, HelpCircle } from 'lucide-react';

interface ScatterItem {
  id: string;
  name: string;
  growth: number; // GDP Growth %
  income: number; // Per capita income in Million Rupiah
  p0: number;     // Poverty headcount rate
  quadrant: string;
}

const KLASSEN_DATA: ScatterItem[] = [
  // Quadrant I: High Income, High Growth
  { id: '3273', name: 'Kota Bandung', growth: 5.82, income: 112.4, p0: 3.96, quadrant: 'Q1' },
  { id: '3216', name: 'Kabupaten Bekasi', growth: 6.12, income: 98.6, p0: 5.11, quadrant: 'Q1' },
  { id: '3275', name: 'Kota Bekasi', growth: 5.41, income: 84.2, p0: 4.12, quadrant: 'Q1' },
  { id: '3276', name: 'Kota Depok', growth: 5.14, income: 78.9, p0: 2.53, quadrant: 'Q1' },
  { id: '3277', name: 'Kota Cimahi', growth: 4.88, income: 55.4, p0: 5.18, quadrant: 'Q1' },

  // Quadrant II: High Income, Low Growth
  { id: '3215', name: 'Kabupaten Karawang', growth: 3.92, income: 104.5, p0: 7.83, quadrant: 'Q2' },
  { id: '3214', name: 'Kabupaten Purwakarta', growth: 3.11, income: 62.4, p0: 7.21, quadrant: 'Q2' },

  // Quadrant III: Low Income, High Growth
  { id: '3201', name: 'Kabupaten Bogor', growth: 5.24, income: 39.8, p0: 7.12, quadrant: 'Q3' },
  { id: '3213', name: 'Kabupaten Subang', growth: 4.95, income: 34.2, p0: 8.92, quadrant: 'Q3' },
  { id: '3204', name: 'Kabupaten Bandung', growth: 4.72, income: 42.1, p0: 6.81, quadrant: 'Q3' },
  { id: '3211', name: 'Kabupaten Sumedang', growth: 4.61, income: 38.5, p0: 9.76, quadrant: 'Q3' },

  // Quadrant IV: Low Income, Low Growth (High Poverty Priority)
  { id: '3206', name: 'Kabupaten Tasikmalaya', growth: 3.42, income: 24.1, p0: 12.11, quadrant: 'Q4' },
  { id: '3205', name: 'Kabupaten Garut', growth: 3.12, income: 26.8, p0: 11.45, quadrant: 'Q4' },
  { id: '3208', name: 'Kabupaten Kuningan', growth: 2.94, income: 22.4, p0: 12.82, quadrant: 'Q4' },
  { id: '3212', name: 'Kabupaten Indramayu', growth: 2.81, income: 28.9, p0: 12.77, quadrant: 'Q4' },
  { id: '3202', name: 'Kabupaten Sukabumi', growth: 3.82, income: 32.1, p0: 9.42, quadrant: 'Q4' },
  { id: '3203', name: 'Kabupaten Cianjur', growth: 3.55, income: 29.4, p0: 10.22, quadrant: 'Q4' },
  { id: '3210', name: 'Kabupaten Majalengka', growth: 3.71, income: 31.6, p0: 11.94, quadrant: 'Q4' },
  { id: '3209', name: 'Kabupaten Cirebon', growth: 3.65, income: 33.4, p0: 11.24, quadrant: 'Q4' },
];

export function KlassenScatterPlot() {
  const [selectedItem, setSelectedItem] = useState<ScatterItem>(KLASSEN_DATA[11]); // Default to Tasikmalaya

  const handlePointClick = (props: any) => {
    if (props && props.payload) {
      setSelectedItem(props.payload);
    }
  };

  const getQuadrantColorClass = (q: string) => {
    switch (q) {
      case 'Q1': return 'border-emerald-100 bg-emerald-50/20 text-emerald-700 dark:border-emerald-950 dark:bg-emerald-950/20';
      case 'Q2': return 'border-blue-100 bg-blue-50/20 text-blue-700 dark:border-blue-950 dark:bg-blue-950/20';
      case 'Q3': return 'border-amber-100 bg-amber-50/20 text-amber-700 dark:border-amber-950 dark:bg-amber-950/20';
      case 'Q4': return 'border-rose-100 bg-rose-50/25 text-rose-700 dark:border-rose-950 dark:bg-rose-950/20';
      default: return '';
    }
  };

  const getQuadrantLabel = (q: string) => {
    switch (q) {
      case 'Q1': return 'Quadrant I (High Growth, High Income)';
      case 'Q2': return 'Quadrant II (Low Growth, High Income)';
      case 'Q3': return 'Quadrant III (High Growth, Low Income)';
      case 'Q4': return 'Quadrant IV (Low Growth, Low Income)';
      default: return '';
    }
  };

  const getQuadrantDesc = (q: string) => {
    switch (q) {
      case 'Q1': return 'Fast-growing developed regions. Primary focus is on sustaining investment, smart cities, and services while maintaining low inequality margins.';
      case 'Q2': return 'Stagnating developed regions. High-wealth bases, but growth has slowed. Focus is on industrial modernization and high-value sector transitions.';
      case 'Q3': return 'Fast-growing developing regions. Elevated economic activity, but low wealth base. Focus is on redistributing economic gains and human asset construction.';
      case 'Q4': return 'Lagging/deprived regions. Stagnant growth paired with low-income bases. Extreme priority zone. Absolute requirement for infrastructure and targeted social safety nets.';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="klassen-scatter-plot-root">
      {/* Recharts Scatter Plot */}
      <div className="lg:col-span-8 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Klassen Quadrant Distribution Map
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Interactive spatial scatter plot mapping GDP Growth Rate (%) against Per Capita Income (Million IDR).
              </p>
            </div>
            <div className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 font-mono px-2 py-0.5 rounded-sm">
              Avg Growth: 4.5% • Avg Income: Rp 45M
            </div>
          </div>

          <div className="h-72 w-full relative">
            {/* Background quadrant overlay labels for visual help */}
            <div className="absolute top-4 right-4 text-[10px] font-bold text-emerald-600/30 dark:text-emerald-400/20 pointer-events-none uppercase">Q1: Sustained Development</div>
            <div className="absolute top-4 left-4 text-[10px] font-bold text-blue-600/30 dark:text-blue-400/20 pointer-events-none uppercase">Q2: Modernization Priority</div>
            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-amber-600/30 dark:text-amber-400/20 pointer-events-none uppercase">Q3: Redistributive Priority</div>
            <div className="absolute bottom-4 left-4 text-[10px] font-bold text-rose-600/40 dark:text-rose-400/25 pointer-events-none uppercase">Q4: Severe Interventions</div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis
                  type="number"
                  dataKey="growth"
                  name="GDP Growth"
                  unit="%"
                  domain={[2.0, 7.0]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="income"
                  name="Per Capita Income"
                  unit="M"
                  domain={[10, 120]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '4px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px',
                  }}
                  formatter={(value, name) => [value, name]}
                />
                <ReferenceLine x={4.5} stroke="#cbd5e1" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <ReferenceLine y={45.0} stroke="#cbd5e1" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <Scatter
                  name="Districts"
                  data={KLASSEN_DATA}
                  onClick={handlePointClick}
                >
                  {KLASSEN_DATA.map((entry, index) => {
                    const isSelected = selectedItem.id === entry.id;
                    let fill = '#94a3b8';
                    if (entry.quadrant === 'Q1') fill = '#10b981';
                    else if (entry.quadrant === 'Q2') fill = '#3b82f6';
                    else if (entry.quadrant === 'Q3') fill = '#f59e0b';
                    else if (entry.quadrant === 'Q4') fill = '#f43f5e';

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={fill}
                        stroke={isSelected ? '#ffffff' : 'none'}
                        strokeWidth={isSelected ? 2 : 0}
                        className="cursor-pointer transition-all duration-150"
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xs">
          <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
          <span>Interactive: Click any point in the scatter plot to load its detailed structural diagnostic profile.</span>
        </div>
      </div>

      {/* Selected District Quadrant Info Panel */}
      <div className="lg:col-span-4 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              active point diagnostic
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-0.5">
              {selectedItem.name}
            </h4>
          </div>

          <div className={`p-4 border rounded-sm ${getQuadrantColorClass(selectedItem.quadrant)}`}>
            <p className="font-bold uppercase tracking-wider text-[10px]">
              {getQuadrantLabel(selectedItem.quadrant)}
            </p>
            <p className="text-[11px] leading-relaxed mt-2">
              {getQuadrantDesc(selectedItem.quadrant)}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-900 pb-2">
              <span className="text-slate-400">GDP Growth Rate:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-100">
                {selectedItem.growth}%
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-900 pb-2">
              <span className="text-slate-400">Per Capita Income:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-100">
                Rp {selectedItem.income.toFixed(1)} Million
              </span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-slate-400">P0 Poverty Rate:</span>
              <span className={`font-bold font-mono ${selectedItem.p0 >= 10.0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>
                {selectedItem.p0}%
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-50 dark:border-slate-900 mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Intervention Recommendation
          </p>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
            {selectedItem.quadrant === 'Q4' ? (
              <span>Flagged for maximum fiscal cash injection and immediate social security distribution optimization.</span>
            ) : selectedItem.quadrant === 'Q3' ? (
              <span>Target human capital infrastructure, public sanitation access grids, and formal schooling support.</span>
            ) : (
              <span>Ensure tax efficiency routing and private enterprise growth-enablers to maintain fiscal self-sufficiency.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
