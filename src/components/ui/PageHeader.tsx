import React from 'react';
import { Breadcrumb } from './Breadcrumb.tsx';
import { cn } from '../../utils/cn.ts';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-900 pb-5 mb-6',
        className
      )}
    >
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
