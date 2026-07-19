import { Inbox, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface EmptyStateProps {
  className?: string;
  title?: string;
  description?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  className,
  title = 'No Data Found',
  description = 'No records match your selected filtering matrices. Try adjusting your parameters.',
  onActionClick,
  actionLabel = 'Reset Filters to Baseline',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-sm border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 min-h-[320px]',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-medium text-slate-950 dark:text-slate-50">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-slate-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
