import React from 'react';
import { ArrowDown, ArrowUp, Percent, TrendingDown, TrendingUp, Sparkles, Scale, Cpu } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface KpiData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  trendDirection: 'positive' | 'negative' | 'neutral';
  sparkline: number[];
  interpretation: string;
  policyImplication: string;
  icon: any;
}

const KPIS_LIST: KpiData[] = [
  {
    title: 'P0 Poverty Headcount',
    value: '7.62%',
    change: '-0.34% vs Q3',
    trend: 'down',
    trendDirection: 'positive',
    sparkline: [8.42, 8.61, 8.24, 7.98, 7.89, 7.68, 7.62],
    interpretation: 'Poverty headcount continues a gradual downward trajectory, showing successful macro intervention coverage across rural districts.',
    policyImplication: 'Maintain core BLT subsidies in Category IV districts; recalibrate targeting criteria to prevent inclusion error leakage.',
    icon: Percent,
  },
  {
    title: 'P1 Poverty Gap',
    value: '1.24',
    change: '-0.08',
    trend: 'down',
    trendDirection: 'positive',
    sparkline: [1.48, 1.42, 1.35, 1.31, 1.28, 1.25, 1.24],
    interpretation: 'Poverty gap depth is shrinking, indicating that the poorest households are moving closer to the statutory poverty consumption boundary.',
    policyImplication: 'Incentivize local padat karya (cash-for-work) integration alongside existing basic social assistance programs.',
    icon: Scale,
  },
  {
    title: 'Inequality (Gini Index)',
    value: '0.412',
    change: '+0.003',
    trend: 'up',
    trendDirection: 'negative',
    sparkline: [0.395, 0.401, 0.403, 0.408, 0.410, 0.411, 0.412],
    interpretation: 'Inequality has marginally increased, signaling that while extreme poverty is dropping, growth benefits remain concentrated in industrial corridors.',
    policyImplication: 'Shift fiscal focus from purely universal assistance to hyper-targeted household asset-building and basic sanitation grids.',
    icon: TrendingUp,
  },
  {
    title: 'Targeting Accuracy (GBM)',
    value: '91.3%',
    change: '+0.5%',
    trend: 'up',
    trendDirection: 'positive',
    sparkline: [85.2, 86.8, 88.1, 89.4, 90.2, 91.0, 91.3],
    interpretation: 'The Proxy Means Testing classifier achieves premium classification performance, drastically reducing leakages to wealthy deciles.',
    policyImplication: 'Formally codify Gradient Boosting model weights for the 2026-2027 provincial DTKS roster synchronization cycles.',
    icon: Cpu,
  },
];

export function ExecutiveKpiSummary() {
  const renderSparkline = (data: number[], direction: 'positive' | 'negative' | 'neutral') => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 24;
    const width = 80;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor = direction === 'positive' 
      ? '#10b981' // emerald-500
      : direction === 'negative'
        ? '#f43f5e' // rose-500
        : '#64748b'; // slate-500

    return (
      <svg className="h-6 w-20 shrink-0" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5" id="executive-kpi-summary-grid">
      {KPIS_LIST.map((kpi, i) => {
        const Icon = kpi.icon;
        const isTrendPositive = kpi.trendDirection === 'positive';
        const isTrendNegative = kpi.trendDirection === 'negative';
        const trendColor = cn(
          isTrendPositive && 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
          isTrendNegative && 'text-rose-600 dark:text-rose-500 bg-rose-50 dark:bg-rose-950/20',
          kpi.trendDirection === 'neutral' && 'text-slate-500 bg-slate-50'
        );

        return (
          <div 
            key={i}
            className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            {/* Title & Icon Header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                {kpi.title}
              </span>
              <div className="rounded-full bg-slate-50 dark:bg-slate-900/60 p-2 text-slate-400 dark:text-slate-500">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {/* Main values row */}
            <div className="flex items-baseline justify-between">
              <div className="space-y-1">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 font-sans">
                  {kpi.value}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={cn('inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-xs', trendColor)}>
                    {kpi.trend === 'up' && <ArrowUp className="h-2.5 w-2.5" />}
                    {kpi.trend === 'down' && <ArrowDown className="h-2.5 w-2.5" />}
                    {kpi.change}
                  </span>
                </div>
              </div>

              {/* Sparkline visualization */}
              <div className="flex flex-col items-end gap-1">
                {renderSparkline(kpi.sparkline, kpi.trendDirection)}
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  7-Period Trend
                </span>
              </div>
            </div>

            {/* Qualitative analysis sections with high contrast */}
            <div className="pt-3 border-t border-slate-50 dark:border-slate-900 space-y-2">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Interpretation:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {kpi.interpretation}
                </p>
              </div>

              <div className="bg-blue-50/30 dark:bg-blue-950/5 p-2.5 rounded-xs border border-blue-50/50 dark:border-blue-950/20 space-y-0.5">
                <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Policy Implication:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {kpi.policyImplication}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
