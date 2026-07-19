import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

interface AlertCardProps {
  title: string;
  message: string;
  severity?: AlertSeverity;
  timestamp?: string;
  className?: string;
  onDismiss?: () => void;
  key?: React.Key | null;
}

export function AlertCard({
  title,
  message,
  severity = 'info',
  timestamp,
  className,
  onDismiss,
}: AlertCardProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900',
      text: 'text-blue-900 dark:text-blue-400',
      body: 'text-blue-700/90 dark:text-blue-300',
      icon: Info,
    },
    warning: {
      bg: 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900',
      text: 'text-amber-900 dark:text-amber-400',
      body: 'text-amber-700/90 dark:text-amber-300',
      icon: AlertTriangle,
    },
    critical: {
      bg: 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/10 dark:border-rose-900',
      text: 'text-rose-900 dark:text-rose-400',
      body: 'text-rose-700/90 dark:text-rose-300',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900',
      text: 'text-emerald-900 dark:text-emerald-400',
      body: 'text-emerald-700/90 dark:text-emerald-300',
      icon: CheckCircle2,
    },
  };

  const currentStyle = styles[severity];
  const Icon = currentStyle.icon;

  return (
    <div
      className={cn(
        'rounded-sm border p-4 shadow-2xs flex items-start gap-3.5',
        currentStyle.bg,
        className
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', currentStyle.text)} />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-4">
          <h5 className={cn('text-xs font-semibold uppercase tracking-wider', currentStyle.text)}>
            {title}
          </h5>
          {timestamp && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {timestamp}
            </span>
          )}
        </div>
        <p className={cn('text-xs leading-relaxed', currentStyle.body)}>
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-1"
        >
          &times;
        </button>
      )}
    </div>
  );
}
