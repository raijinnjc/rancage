import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface ExportButtonProps {
  onExport: () => Promise<void> | void;
  label?: string;
  className?: string;
}

export function ExportButton({
  onExport,
  label = 'Export Dataset (CSV)',
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handlePress = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      // Small visual delay to simulate computation
      setTimeout(() => {
        setIsExporting(false);
      }, 600);
    }
  };

  return (
    <button
      onClick={handlePress}
      disabled={isExporting}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm bg-slate-950 text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors',
        className
      )}
    >
      {isExporting ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      {isExporting ? 'Preparing File...' : label}
    </button>
  );
}
