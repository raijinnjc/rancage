import React from 'react';
import { Filter, X, RotateCcw, MapPin, Calendar, Layers } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';

export function GlobalFilterBar() {
  const {
    selectedYear,
    selectedDistrictId,
    selectedTypology,
    setSelectedYear,
    setSelectedDistrictId,
    setSelectedTypology,
    resetFilters,
  } = useNavigationStore();

  const activeDistrict = WEST_JAVA_DISTRICTS.find((d) => d.id === selectedDistrictId);

  // Region options correspond to Klassen typology geographical scopes
  const regionOptions = [
    { label: 'Seluruh Wilayah', value: 'ALL' },
    { label: 'Priangan Timur & Barat', value: 'PRIANGAN' },
    { label: 'Cirebon-Indramayu', value: 'CIREBON' },
    { label: 'Bogor-Depok-Bekasi', value: 'BOGOR' },
    { label: 'Purwakarta-Subang-Karawang', value: 'PURWAKARTA' },
    { label: 'Sukabumi-Cianjur', value: 'SUKABUMI' },
  ];

  const yearOptions = [
    { label: 'Tahun Basis 2026', value: '2026' },
    { label: 'Retrospektif 2025', value: '2025' },
    { label: 'Retrospektif 2024', value: '2024' },
  ];

  const hasActiveFilters =
    selectedYear !== '2026' || selectedDistrictId !== '3206' || selectedTypology !== 'ALL';

  return (
    <div className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-sm p-4 space-y-3.5 shadow-2xs">
      {/* Filters Select Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ruang Kendali Eksekutif Global
          </h3>
          <span className="text-[9px] font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-600 px-1.5 py-0.5 rounded-sm font-bold uppercase">
            Tersinkronisasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1 lg:max-w-4xl">
          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              Tahun Sasaran
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {yearOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" />
              Fokus Kabupaten/Kota
            </label>
            <select
              value={selectedDistrictId || '3206'}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {WEST_JAVA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id})
                </option>
              ))}
            </select>
          </div>

          {/* Region / Typology Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Layers className="h-3 w-3 text-slate-400" />
              Cakupan Geografis Klassen
            </label>
            <select
              value={selectedTypology}
              onChange={(e) => setSelectedTypology(e.target.value)}
              className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {regionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chips and Reset Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-50 dark:border-slate-900/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Parameter Aktif:
          </span>

          {/* Year Chip */}
          <span className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-xs border border-slate-100 dark:border-slate-800 text-[10px] font-mono">
            <span>Tahun: {selectedYear}</span>
            {selectedYear !== '2026' && (
              <button
                onClick={() => setSelectedYear('2026')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                title="Reset Tahun"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>

          {/* District Chip */}
          <span className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-xs border border-slate-100 dark:border-slate-800 text-[10px] font-mono">
            <span>Kabupaten/Kota: {activeDistrict?.name || selectedDistrictId}</span>
            {selectedDistrictId !== '3206' && (
              <button
                onClick={() => setSelectedDistrictId('3206')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                title="Reset Kabupaten/Kota"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>

          {/* Typology Region Chip */}
          <span className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-xs border border-slate-100 dark:border-slate-800 text-[10px] font-mono">
            <span>Cakupan: {regionOptions.find((r) => r.value === selectedTypology)?.label}</span>
            {selectedTypology !== 'ALL' && (
              <button
                onClick={() => setSelectedTypology('ALL')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                title="Reset Cakupan Wilayah"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/20 px-2.5 py-1.5 rounded-xs border border-slate-200/60 dark:border-slate-800"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset ke Standar</span>
          </button>
        )}
      </div>
    </div>
  );
}
