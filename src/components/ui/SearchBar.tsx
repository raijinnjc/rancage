import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by household ID, name, or NIK...',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-8 py-1 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
