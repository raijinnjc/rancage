import { AlertOctagon, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface ErrorStateProps {
  className?: string;
  code?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  className,
  code = '504_GATEWAY_TIMEOUT',
  title = 'API Connection Error',
  message = 'The server took too long to complete the poverty metric calculations. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'border-l-3 border-rose-500 bg-rose-50/50 p-6 rounded-r-sm dark:bg-rose-950/5 flex items-start gap-4',
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
        <AlertOctagon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-medium text-slate-950 dark:text-slate-50">
            {title}
          </h4>
          <span className="text-[10px] font-mono tracking-wider text-rose-600 bg-rose-100/50 dark:bg-rose-950/50 px-2 py-0.5 rounded-sm">
            {code}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Retry Process
          </button>
        )}
      </div>
    </div>
  );
}
