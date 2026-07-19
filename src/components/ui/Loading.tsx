import { cn } from '../../utils/cn.ts';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
}

export function Loading({ className, size = 'md', label, fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-3',
    fullScreen ? 'fixed inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm' : 'p-8',
    className
  );

  return (
    <div className={containerClasses}>
      <div
        className={cn(
          'animate-spin rounded-full border-slate-200 border-t-slate-800 dark:border-slate-800 dark:border-t-slate-200',
          sizeClasses[size]
        )}
      />
      {label && (
        <p className="text-xs font-mono tracking-tight text-slate-500 dark:text-slate-400">
          {label}
        </p>
      )}
    </div>
  );
}
