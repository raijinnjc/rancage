import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string | number }[];
}

interface FilterPanelProps {
  filters: FilterOption[];
  selectedValues: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  selectedValues,
  onChange,
  onClearAll,
  className,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={cn(
        'rounded-sm border border-slate-100 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-950 space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Regional Analysis Scope
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="text-[10px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-1">
              <label className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {filter.label}
              </label>
              <select
                value={selectedValues[filter.key] || ''}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
              >
                {filter.options.map((opt, oIdx) => (
                  <option key={oIdx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {isOpen && Object.keys(selectedValues).length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-50 dark:border-slate-900 text-[10px]">
          <span className="text-slate-400">Active criteria:</span>
          {Object.entries(selectedValues).map(([key, val]) => {
            if (!val) return null;
            const filterDef = filters.find((f) => f.key === key);
            const optLabel = filterDef?.options.find((o) => o.value === val)?.label || String(val);
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-sm border border-slate-100 dark:border-slate-800 font-mono"
              >
                {filterDef?.label}: {optLabel}
                <button
                  onClick={() => onChange(key, '')}
                  className="text-slate-400 hover:text-slate-950 dark:hover:text-white"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
