import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatPercentage } from '../../utils/format.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';

interface PriorityDistrict {
  rank: number;
  id: string;
  name: string;
  priorityScore: number; // 0-100 scale
  typology: string;
  p0: number; // Poverty rate
  within: number; // Within-district inequality contribution
  trend: number; // Annual trend change
  status: 'CRITICAL' | 'HIGH' | 'STABLE';
}

const PRIORITY_DATA: PriorityDistrict[] = [
  { rank: 1, id: '3206', name: 'Kabupaten Tasikmalaya', priorityScore: 94.2, typology: 'Quadrant IV (Lagging)', p0: 12.11, within: 89.4, trend: -0.15, status: 'CRITICAL' },
  { rank: 2, id: '3212', name: 'Kabupaten Indramayu', priorityScore: 92.8, typology: 'Quadrant IV (Lagging)', p0: 12.77, within: 88.6, trend: -0.05, status: 'CRITICAL' },
  { rank: 3, id: '3208', name: 'Kabupaten Kuningan', priorityScore: 91.5, typology: 'Quadrant IV (Lagging)', p0: 12.82, within: 87.9, trend: 0.12, status: 'CRITICAL' },
  { rank: 4, id: '3210', name: 'Kabupaten Majalengka', priorityScore: 88.6, typology: 'Quadrant IV (Lagging)', p0: 11.94, within: 86.8, trend: -0.22, status: 'HIGH' },
  { rank: 5, id: '3205', name: 'Kabupaten Garut', priorityScore: 87.4, typology: 'Quadrant IV (Lagging)', p0: 11.45, within: 89.1, trend: -0.34, status: 'HIGH' },
  { rank: 6, id: '3278', name: 'Kota Tasikmalaya', priorityScore: 85.1, typology: 'Quadrant IV (Lagging)', p0: 11.52, within: 85.5, trend: -0.08, status: 'HIGH' },
  { rank: 7, id: '3209', name: 'Kabupaten Cirebon', priorityScore: 84.3, typology: 'Quadrant IV (Lagging)', p0: 11.24, within: 86.2, trend: -0.18, status: 'HIGH' },
  { rank: 8, id: '3217', name: 'Kabupaten Bandung Barat', priorityScore: 81.9, typology: 'Quadrant III (Incipient)', p0: 10.52, within: 85.0, trend: -0.28, status: 'HIGH' },
  { rank: 9, id: '3203', name: 'Kabupaten Cianjur', priorityScore: 80.5, typology: 'Quadrant III (Incipient)', p0: 10.22, within: 87.2, trend: -0.41, status: 'STABLE' },
  { rank: 10, id: '3202', name: 'Kabupaten Sukabumi', priorityScore: 77.2, typology: 'Quadrant III (Incipient)', p0: 9.42, within: 86.5, trend: -0.32, status: 'STABLE' },
];

type SortKey = 'rank' | 'name' | 'priorityScore' | 'p0' | 'within' | 'trend';

export function ExecutivePriorityRanking() {
  const { navigateTo, setSelectedDistrictId } = useNavigationStore();
  const [data, setData] = useState<PriorityDistrict[]>(PRIORITY_DATA);
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleRowClick = (id: string) => {
    localStorage.setItem('selectedDistrictId', id);
    setSelectedDistrictId(id);
    navigateTo('regional-profile');
  };

  const handleSort = (key: SortKey) => {
    let order: 'asc' | 'desc' = 'asc';
    if (sortKey === key) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortOrder(order);
    setSortKey(key);

    const sorted = [...data].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return order === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
    });

    setData(sorted);
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400 shrink-0" />;
    }
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-3.5 w-3.5 text-blue-500 shrink-0" />
      : <ChevronDown className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
  };

  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 shadow-2xs overflow-hidden" id="regional-priority-ranking-card">
      <div className="border-b border-slate-50 dark:border-slate-900 px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Provincial Priority Intervention Ranking (Top 10 Districts)
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Composite sorting of administrative regions requiring immediate structural fiscal matching and targeting recalibrations.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 px-2 py-1 rounded border border-rose-100 dark:border-rose-900/40 uppercase font-bold">
            3 Critical Areas
          </span>
          <span className="text-[10px] font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-1 rounded border border-amber-100 dark:border-amber-900/40 uppercase font-bold">
            5 High Urgency
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/35 border-b border-slate-100 dark:border-slate-900 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={() => handleSort('rank')}>
                <div className="flex items-center gap-1">
                  <span>Rank</span>
                  {getSortIcon('rank')}
                </div>
              </th>
              <th className="px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>District</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-right" onClick={() => handleSort('priorityScore')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Priority Score</span>
                  {getSortIcon('priorityScore')}
                </div>
              </th>
              <th className="px-5 py-3 text-slate-400">Typology</th>
              <th className="px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-right" onClick={() => handleSort('p0')}>
                <div className="flex items-center justify-end gap-1">
                  <span>P0 Headcount</span>
                  {getSortIcon('p0')}
                </div>
              </th>
              <th className="px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-right" onClick={() => handleSort('within')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Within Disparity</span>
                  {getSortIcon('within')}
                </div>
              </th>
              <th className="px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-right" onClick={() => handleSort('trend')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Annual Trend</span>
                  {getSortIcon('trend')}
                </div>
              </th>
              <th className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-xs font-medium">
            {data.map((row) => (
              <tr 
                key={row.id} 
                className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 cursor-pointer transition-colors"
                onClick={() => handleRowClick(row.id)}
              >
                <td className="px-5 py-3 font-mono text-slate-500 font-bold">{row.rank}</td>
                <td className="px-5 py-3 text-slate-900 dark:text-slate-100 font-bold">{row.name}</td>
                <td className="px-5 py-3 text-right font-mono text-slate-800 dark:text-slate-200 font-bold">
                  {row.priorityScore.toFixed(1)} / 100
                </td>
                <td className="px-5 py-3 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider ${
                    row.typology.includes('Lagging') 
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                  }`}>
                    {row.typology}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-mono text-slate-900 dark:text-slate-100 font-bold">
                  {formatPercentage(row.p0)}
                </td>
                <td className="px-5 py-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {formatPercentage(row.within)}
                </td>
                <td className={`px-5 py-3 text-right font-mono font-semibold ${row.trend < 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
                  {row.trend > 0 ? `+${row.trend.toFixed(2)}%` : `${row.trend.toFixed(2)}%`}
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    row.status === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                      : row.status === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}>
                    {row.status === 'CRITICAL' && <AlertCircle className="h-2.5 w-2.5" />}
                    {row.status === 'HIGH' && <AlertTriangle className="h-2.5 w-2.5" />}
                    {row.status === 'STABLE' && <CheckCircle className="h-2.5 w-2.5" />}
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
