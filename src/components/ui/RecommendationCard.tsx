import { Briefcase, Calendar, DollarSign, ShieldAlert, Target } from 'lucide-react';
import { cn } from '../../utils/cn.ts';
import { formatRupiah } from '../../utils/format.ts';

interface RecommendationCardProps {
  title: string;
  description: string;
  impact: string; // e.g., "P0 reduces by 1.2%"
  cost: number;   // IDR amount
  timeline: string;
  agency: string;
  confidence: number; // e.g. 0.94 (meaning 94% confidence)
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence?: string;
  className?: string;
  onAction?: () => void;
}

export function RecommendationCard({
  title,
  description,
  impact,
  cost,
  timeline,
  agency,
  confidence,
  priority = 'MEDIUM',
  evidence,
  className,
  onAction,
}: RecommendationCardProps) {
  const priorityColors = {
    HIGH: 'border-l-3 border-l-rose-500 bg-rose-50/5 dark:bg-rose-950/5',
    MEDIUM: 'border-l-3 border-l-amber-500 bg-amber-50/5 dark:bg-amber-950/5',
    LOW: 'border-l-3 border-l-blue-500 bg-blue-50/5 dark:bg-blue-950/5',
  };

  return (
    <div
      className={cn(
        'rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between gap-4 transition-all hover:shadow-md',
        priorityColors[priority],
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider',
            priority === 'HIGH' && 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
            priority === 'MEDIUM' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
            priority === 'LOW' && 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
          )}>
            {priority} PRIORITY
          </span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <span>Confidence Index:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <h4 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 border-t border-b border-slate-50 dark:border-slate-900 py-3 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Target className="h-3.5 w-3.5 text-slate-400" />
          <span>Impact: <strong>{impact}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />
          <span>Cost: <strong>{formatRupiah(cost)}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Timeline: {timeline}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate" title={agency}>Agency: {agency}</span>
        </div>
      </div>

      {evidence && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-3 rounded-xs flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
          <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[9px] font-mono text-slate-400 block uppercase tracking-wider">Empirical Evidence Base:</span>
            <span>{evidence}</span>
          </div>
        </div>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className="w-full text-center py-2 rounded-sm bg-slate-950 dark:bg-slate-50 text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          Model Budget Allocation
        </button>
      )}
    </div>
  );
}
