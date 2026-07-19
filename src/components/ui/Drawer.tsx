import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  width?: 'sm' | 'md' | 'lg';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  width = 'md',
}: DrawerProps) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer slide-out surface from right */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          className={cn(
            'w-screen border-l border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 flex flex-col h-full transform transition-all duration-300 animate-in slide-in-from-right-full',
            widthClasses[width],
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 px-5 py-4">
            <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-sm p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-slate-50 dark:border-slate-900 px-5 py-4 bg-slate-50/50 dark:bg-slate-900/20">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
