import React from 'react';
import { cn } from '../../utils/cn.ts';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  key?: React.Key | null;
  style?: React.CSSProperties;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  );
}

/**
 * Predefined structural skeletons for consistent layout placeholders
 */
export function KpiSkeleton() {
  return (
    <div className="rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-end gap-3 h-48 pt-4 border-b border-l border-slate-100 dark:border-slate-800 pl-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="w-full bg-slate-100 dark:bg-slate-900 rounded-t-sm"
            style={{ height: `${Math.max(15, Math.floor(Math.random() * 85))}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full rounded-sm border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
      <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 flex gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 flex-1" />
        ))}
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            {Array.from({ length: 4 }).map((_, cIdx) => (
              <Skeleton key={cIdx} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
