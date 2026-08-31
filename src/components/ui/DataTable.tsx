import React, { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  selectedRowId?: string | number;
  rowIdKey?: keyof T;
  searchPlaceholder?: string;
  enableExport?: boolean;
  exportFileName?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  onRowClick,
  selectedRowId,
  rowIdKey = 'id' as keyof T,
  enableExport = false,
  exportFileName = 'rancage-export.csv',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle local sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    return sortDirection === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Handle local pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExport = () => {
    const headers = columns.map((col) => col.header).join(',');
    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          const val = row[col.key as string];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4">
      {enableExport && (
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor Dataset CSV</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'p-3.5 font-bold text-slate-700 dark:text-slate-200 tracking-wider uppercase text-[10px]',
                    column.sortable && 'cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400'
                  )}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && <ArrowUpDown className="h-3 w-3 opacity-60" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginatedData.map((row, rowIndex) => {
              const isSelected = selectedRowId !== undefined && row[rowIdKey] === selectedRowId;
              return (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected && 'bg-blue-50/40 dark:bg-blue-950/30 font-medium border-l-2 border-blue-600 dark:border-blue-400'
                  )}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-3 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                      {column.render ? column.render(row) : row[column.key as string]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> ({sortedData.length} baris data)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-sm border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-sm border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
