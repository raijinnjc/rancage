import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendDirection?: 'positive' | 'negative' | 'neutral'; // 'positive' means a good change (e.g., poverty decreasing)
  icon?: LucideIcon;
  className?: string;
}

export function KpiCard({
  title,
  value,
  description,
  change,
  trend = 'neutral',
  trendDirection = 'neutral',
  icon: Icon,
  className,
}: KpiCardProps) {
  
  const isTrendPositive = trendDirection === 'positive';
  const isTrendNegative = trendDirection === 'negative';

  const trendColor = cn(
    isTrendPositive && 'text-emerald-600 dark:text-emerald-500',
    isTrendNegative && 'text-rose-600 dark:text-rose-500',
    trendDirection === 'neutral' && 'text-slate-500'
  );

  return (
    <div
      className={cn(
        'rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950 hover:shadow-md transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="rounded-full bg-slate-50 dark:bg-slate-900 p-2 text-slate-400 dark:text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {value}
        </span>
        
        {change !== undefined && (
          <div className={cn('flex items-center gap-0.5 text-xs font-semibold', trendColor)}>
            {trend === 'up' && <ArrowUp className="h-3 w-3 shrink-0" />}
            {trend === 'down' && <ArrowDown className="h-3 w-3 shrink-0" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {description && (
        <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-normal leading-tight">
          {description}
        </div>
      )}
    </div>
  );
}
