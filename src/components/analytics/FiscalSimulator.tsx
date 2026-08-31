import React, { useState } from 'react';
import { Sliders, Landmark, TrendingDown, Coins, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatRupiah } from '../../utils/format.ts';

export function FiscalSimulator() {
  const TOTAL_BUDGET = 50000000000; // Rp 50 Billion

  // Budget allocations in IDR
  const [blt, setBlt] = useState(15000000000);        // BLT Target Optimizations
  const [sanitation, setSanitation] = useState(10000000000); // Sanitation
  const [water, setWater] = useState(50000000000);         // Rural Clean Water (Wait, let's keep it 5 Billion!)
  const [microCredit, setMicroCredit] = useState(10000000000); // Micro credit

  // Correcting water to 5 Billion default
  const [waterBudget, setWaterBudget] = useState(5000000000);

  // Sum of current allocations
  const currentTotal = blt + sanitation + waterBudget + microCredit;
  const unallocated = Math.max(0, TOTAL_BUDGET - currentTotal);

  // Dynamic Simulators logic based on research coefficient models
  const baselineP0 = 7.02;
  const bltEffect = (blt / 1000000000) * 0.042;
  const sanitationEffect = (sanitation / 1000000000) * 0.028;
  const waterEffect = (waterBudget / 1000000000) * 0.021;
  const microEffect = (microCredit / 1000000000) * 0.015;

  const totalReduction = bltEffect + sanitationEffect + waterEffect + microEffect;
  const simulatedP0 = Math.max(2.1, baselineP0 - totalReduction);

  // Simulated households lifted out of poverty (estimated 1% drop = 48,000 households)
  const estimatedHouseholdsLifted = Math.round(totalReduction * 48200);

  // Chart data comparing Baseline vs Simulated
  const chartData = [
    { name: 'Basis Awal (BPS 2025)', p0: baselineP0, fill: '#64748b' },
    { name: 'Hasil Simulasi Kebijakan', p0: parseFloat(simulatedP0.toFixed(2)), fill: '#10b981' },
  ];

  const handleSliderChange = (category: string, value: number) => {
    // Ensure we don't exceed total budget limit
    const otherAllocations = currentTotal - (
      category === 'blt' ? blt :
      category === 'sanitation' ? sanitation :
      category === 'water' ? waterBudget : microCredit
    );

    const maxAllowed = TOTAL_BUDGET - otherAllocations;
    const adjustedValue = Math.min(value, maxAllowed);

    if (category === 'blt') setBlt(adjustedValue);
    else if (category === 'sanitation') setSanitation(adjustedValue);
    else if (category === 'water') setWaterBudget(adjustedValue);
    else if (category === 'microCredit') setMicroCredit(adjustedValue);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="fiscal-simulator-root">
      {/* Simulation Controls on left */}
      <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <Landmark className="h-4 w-4 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Simulator Alokasi Anggaran Diskresioner
            </h4>
          </div>

          <div className="mb-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xs border border-slate-100 dark:border-slate-900/60 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plafon Anggaran Diskresioner</span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100 mt-1 block">
                {formatRupiah(TOTAL_BUDGET)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cadangan Belum Dialokasikan</span>
              <span className={`text-sm font-bold font-mono mt-1 block ${unallocated > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                {formatRupiah(unallocated)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* BLT Optimization slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Optimalisasi Penargetan Bantuan Tunai</span>
                <span className="font-mono text-slate-500">{formatRupiah(blt)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={TOTAL_BUDGET}
                step="500000000"
                value={blt}
                onChange={(e) => handleSliderChange('blt', parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Model penargetan presisi Gradient Boosting untuk daftar penerima bantuan tunai.</p>
            </div>

            {/* Sanitation grid slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Infrastruktur Sanitasi Pedesaan</span>
                <span className="font-mono text-slate-500">{formatRupiah(sanitation)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={TOTAL_BUDGET}
                step="500000000"
                value={sanitation}
                onChange={(e) => handleSliderChange('sanitation', parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Investasi infrastruktur terarah untuk mengatasi defisit sanitasi di wilayah Kuadran IV.</p>
            </div>

            {/* Rural Water system slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Jaringan Air Bersih Pedesaan</span>
                <span className="font-mono text-slate-500">{formatRupiah(waterBudget)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={TOTAL_BUDGET}
                step="500000000"
                value={waterBudget}
                onChange={(e) => handleSliderChange('water', parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Pengeboran sumur dalam dan perpipaan air bersih bagi kantong kemiskinan ekstrem.</p>
            </div>

            {/* Micro Credit slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Hibah Kredit Usaha Mikro</span>
                <span className="font-mono text-slate-500">{formatRupiah(microCredit)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={TOTAL_BUDGET}
                step="500000000"
                value={microCredit}
                onChange={(e) => handleSliderChange('microCredit', parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Pembiayaan mikro berbunga rendah untuk mendorong usaha informal pedesaan di Kuadran II/III.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xs mt-4">
          <Sliders className="h-3.5 w-3.5 text-blue-500" />
          <span>Geser slider untuk merealokasi dana. Model komputasi akan mengestimasi dampak secara instan.</span>
        </div>
      </div>

      {/* Simulated Outcomes on right */}
      <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              ESTIMASI DAMPAK KEBIJAKAN
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-0.5">
              Simulasi Penurunan Angka Kemiskinan (P0)
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs border border-slate-100/40 dark:border-slate-900 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Rasio P0</span>
              <div>
                <span className="text-base font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 block mt-1">
                  {simulatedP0.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  Penurunan -{totalReduction.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs border border-slate-100/40 dark:border-slate-900 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graduasi Mandiri</span>
              <div>
                <span className="text-base font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 block mt-1">
                  ~{estimatedHouseholdsLifted.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  Keluarga terangkat dari miskin
                </span>
              </div>
            </div>
          </div>

          {/* Recharts Bar comparison */}
          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                  domain={[0, 10]}
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
                <Bar dataKey="p0" name="Tingkat Kemiskinan P0" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-50 dark:border-slate-900 mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Indeks Efisiensi Fiskal
          </p>
          <div className="flex justify-between items-center font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Realisasi Penyerapan: {((currentTotal / TOTAL_BUDGET) * 100).toFixed(0)}%</span>
            <span>Est. Social ROI: 1,48x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
