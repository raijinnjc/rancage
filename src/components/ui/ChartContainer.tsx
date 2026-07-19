import React from 'react';
import { cn } from '../../utils/cn.ts';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  height?: number | string;
}

export function ChartContainer({
  title,
  subtitle,
  children,
  actions,
  className,
  height = 320,
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        'rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950 flex flex-col',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-50 dark:border-slate-900 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {actions}
          </div>
        )}
      </div>

      <div
        className="w-full relative flex-1 min-h-0"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {children}
      </div>
    </div>
  );
}
