import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal surface */}
      <div
        className={cn(
          'relative w-full rounded-sm border border-slate-100 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col max-h-[90vh] z-10 transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200',
          sizeClasses[size],
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-50 dark:border-slate-900 px-5 py-3 bg-slate-50/50 dark:bg-slate-900/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
