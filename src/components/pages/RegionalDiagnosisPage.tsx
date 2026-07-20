import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileDown, 
  FileSpreadsheet, 
  Image as ImageIcon,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  Info,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { PageHeader } from '../ui/PageHeader.tsx';
import { FilterPanel, FilterOption } from '../ui/FilterPanel.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import { DataTable } from '../ui/DataTable.tsx';
import { SearchBar } from '../ui/SearchBar.tsx';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { formatPercentage, formatNumber } from '../../utils/format.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { 
  THEIL_DECOMPOSITION_BY_YEAR, 
  POVERTY_INDICATORS_BY_YEAR, 
  DISTRICT_DIAGNOSIS_DATA, 
  PRIORITY_DRIVERS_DATA,
  DistrictDiagnosisDetail 
} from '../analytics/diagnosisData.ts';
import { SpatialDiagnosisMap } from '../analytics/SpatialDiagnosisMap.tsx';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';

export default function RegionalDiagnosisPage() {
  const { navigateTo, selectedYear: globalYear, selectedDistrictId: globalDistrictId, selectedTypology: globalTypology } = useNavigationStore();

  // 1. Filter States
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('All');

  useEffect(() => {
    if (globalYear) {
      setSelectedYear(globalYear);
    }
  }, [globalYear]);

  useEffect(() => {
    if (globalDistrictId) {
      setSelectedDistrictId(globalDistrictId);
    }
  }, [globalDistrictId]);

  useEffect(() => {
    if (globalTypology) {
      setSelectedTypology(globalTypology === 'ALL' ? 'All' : globalTypology);
    }
  }, [globalTypology]);
  const [selectedUrbanRural, setSelectedUrbanRural] = useState<string>('All');
  const [selectedTypology, setSelectedTypology] = useState<string>('All');
  
  // Local Table Search State
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');

  // Local Export Alert Toast
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Trigger brief export feedback
  const triggerExport = (format: string) => {
    setExportNotification(`Membuat dan menyusun laporan ${format}...`);
    setTimeout(() => {
      setExportNotification(`Sukses: ${format} berhasil diunduh.`);
      setTimeout(() => setExportNotification(null), 3000);
    }, 1200);
  };

  // 2. Filter Configuration for FilterPanel component
  const filterDefinitions: FilterOption[] = useMemo(() => [
    {
      key: 'year',
      label: 'Tahun Evaluasi',
      options: [
        { label: '2025 (Tahun Berjalan)', value: '2025' },
        { label: '2024 (Tahun Basis)', value: '2024' },
        { label: '2023 (Tahun Basis)', value: '2023' },
        { label: '2022 (Tahun Basis)', value: '2022' }
      ]
    },
    {
      key: 'district',
      label: 'Fokus Kabupaten/Kota Terpilih',
      options: [
        { label: 'Semua 27 Kabupaten/Kota (Provinsi)', value: 'All' },
        ...WEST_JAVA_DISTRICTS.map(d => ({ label: d.name, value: d.id }))
      ]
    },
    {
      key: 'urbanRural',
      label: 'Kelas Administratif',
      options: [
        { label: 'Semua (Perkotaan + Perdesaan)', value: 'All' },
        { label: 'Hanya Perkotaan (Kota)', value: 'Urban' },
        { label: 'Hanya Perdesaan (Kabupaten)', value: 'Rural' }
      ]
    },
    {
      key: 'typology',
      label: 'Tipologi Pertumbuhan Klassen',
      options: [
        { label: 'Semua Kuadran Tipologi', value: 'All' },
        { label: 'Kuadran I: Pertumbuhan Tinggi, Pendapatan Tinggi', value: 'I' },
        { label: 'Kuadran II: Pertumbuhan Tinggi, Pendapatan Rendah', value: 'II' },
        { label: 'Kuadran III: Pertumbuhan Rendah, Pendapatan Tinggi', value: 'III' },
        { label: 'Kuadran IV: Pertumbuhan Rendah, Pendapatan Rendah', value: 'IV' }
      ]
    }
  ], []);

  // Sync selected values map
  const filterValues = useMemo(() => ({
    year: selectedYear,
    district: selectedDistrictId,
    urbanRural: selectedUrbanRural,
    typology: selectedTypology
  }), [selectedYear, selectedDistrictId, selectedUrbanRural, selectedTypology]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | number) => {
    if (key === 'year') setSelectedYear(String(value));
    if (key === 'district') setSelectedDistrictId(String(value));
    if (key === 'urbanRural') setSelectedUrbanRural(String(value));
    if (key === 'typology') setSelectedTypology(String(value));
  };

  // Clear all filters handler
  const handleClearAll = () => {
    setSelectedYear('2025');
    setSelectedDistrictId('All');
    setSelectedUrbanRural('All');
    setSelectedTypology('All');
    setTableSearchQuery('');
  };

  // 3. Resolve active district details
  const selectedDistrictDetails = useMemo(() => {
    if (selectedDistrictId === 'All') return null;
    const yearList = DISTRICT_DIAGNOSIS_DATA[selectedYear] || [];
    return yearList.find(d => d.id === selectedDistrictId) || null;
  }, [selectedDistrictId, selectedYear]);

  // 4. Filter the district array based on Global Filters + Table Search
  const filteredDistricts = useMemo(() => {
    const rawList = DISTRICT_DIAGNOSIS_DATA[selectedYear] || [];
    return rawList.filter((d) => {
      // District filter match
      const matchesDistrict = selectedDistrictId === 'All' || d.id === selectedDistrictId;
      // Urban/Rural match
      const matchesUrbanRural = selectedUrbanRural === 'All' || d.urbanRural === selectedUrbanRural;
      // Typology match
      const matchesTypology = selectedTypology === 'All' || d.typology === selectedTypology;
      // Search matching (case-insensitive name or region)
      const matchesSearch = tableSearchQuery === '' || 
        d.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(tableSearchQuery.toLowerCase());

      return matchesDistrict && matchesUrbanRural && matchesTypology && matchesSearch;
    });
  }, [selectedYear, selectedDistrictId, selectedUrbanRural, selectedTypology, tableSearchQuery]);

  // 5. Theil Decomposition chart data matching the filters
  const theilChartData = useMemo(() => {
    // Return appropriate baseline slice based on Rural/Urban filter
    const activeKey = selectedUrbanRural === 'Urban' ? 'Urban' : selectedUrbanRural === 'Rural' ? 'Rural' : 'All';
    return THEIL_DECOMPOSITION_BY_YEAR[activeKey] || THEIL_DECOMPOSITION_BY_YEAR.All;
  }, [selectedUrbanRural]);

  // Extract single active decomposition point
  const currentDecomposition = useMemo(() => {
    const items = theilChartData;
    return items.find(d => d.year === selectedYear) || items[items.length - 1];
  }, [theilChartData, selectedYear]);

  // Donut values for Within vs Between Contribution
  const withinPieData = useMemo(() => [
    { name: 'Within-District Disparity', value: currentDecomposition.withinContribution },
    { name: 'Other', value: 100 - currentDecomposition.withinContribution },
  ], [currentDecomposition]);

  const betweenPieData = useMemo(() => [
    { name: 'Between-District Disparity', value: currentDecomposition.betweenContribution },
    { name: 'Other', value: 100 - currentDecomposition.betweenContribution },
  ], [currentDecomposition]);

  // 6. Poverty Indicator trend points over years (2022-2025)
  const trendChartData = useMemo(() => {
    // If specific district is selected, map its values across years
    if (selectedDistrictId !== 'All') {
      return ['2022', '2023', '2024', '2025'].map((year) => {
        const yearData = DISTRICT_DIAGNOSIS_DATA[year] || [];
        const d = yearData.find(item => item.id === selectedDistrictId);
        return {
          year,
          p0: d ? d.p0 : 0,
          p1: d ? d.p1 : 0,
          p2: d ? d.p2 : 0,
          gini: d ? d.gini : 0
        };
      });
    } else {
      // Otherwise fallback to aggregated averages matching Urban/Rural filter
      const key = selectedUrbanRural === 'Urban' ? 'Urban' : selectedUrbanRural === 'Rural' ? 'Rural' : 'All';
      return POVERTY_INDICATORS_BY_YEAR[key] || POVERTY_INDICATORS_BY_YEAR.All;
    }
  }, [selectedDistrictId, selectedUrbanRural]);

  // 7. Dynamic Narrative Generator
  const dynamicInsight = useMemo(() => {
    const within = currentDecomposition.withinContribution;
    const yearStr = selectedYear;
    const scopeStr = selectedUrbanRural === 'Urban' ? 'wilayah perkotaan (Kota)' : selectedUrbanRural === 'Rural' ? 'wilayah perdesaan (Kabupaten)' : 'Provinsi Jawa Barat';

    return {
      currentSituation: `Pada tahun ${yearStr}, komponen dalam-wilayah mencakup ${within.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% dari total ketimpangan di dalam ${scopeStr}. Hal ini mengonfirmasi bahwa kesenjangan internal adalah pemicu utama polarisasi konsumsi di Jawa Barat.`,
      keyFinding: `Dekomposisi ketimpangan menunjukkan kompresi jangka panjang dari kesenjangan struktural antar-wilayah sementara ketimpangan intra-wilayah tetap tinggi. Ketimpangan lokal sangat terkonsentrasi di dalam batas-batas wilayah daripada perbedaan antar-daerah.`,
      policyImplication: `Hibah pemerataan wilayah tradisional (Dana Alokasi Umum - DAU) tidaklah cukup. Intervensi harus beralih ke insentif fiskal mikro-target yang disalurkan langsung ke kecamatan dan desa yang tertinggal.`,
      priorityAction: `Kerahkan akademi pendidikan terarah dan jaringan air bersih pedesaan ke kantong-kantong Kuadran IV Klassen (pertumbuhan rendah, pendapatan rendah), khususnya di Kabupaten Garut, Tasikmalaya, dan Kuningan.`
    };
  }, [currentDecomposition, selectedYear, selectedUrbanRural]);

  // Table Columns config with Sorting and Conditional Formatting
  const tableColumns = useMemo(() => [
    { 
      key: 'name', 
      header: 'Nama Kabupaten/Kota', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">{row.name}</span>
      )
    },
    { 
      key: 'theil', 
      header: 'Theil T', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => row.theil.toFixed(3)
    },
    { 
      key: 'within', 
      header: 'Komponen Dalam', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => row.within.toFixed(3)
    },
    { 
      key: 'p0', 
      header: 'Headcount P0', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => {
        const isHigh = row.p0 >= 11.0;
        return (
          <span className={`font-semibold font-mono ${isHigh ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {row.p0.toFixed(2)}%
          </span>
        );
      }
    },
    { 
      key: 'p1', 
      header: 'Kesenjangan P1', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => row.p1.toFixed(2)
    },
    { 
      key: 'gini', 
      header: 'Rasio Gini', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => row.gini.toFixed(3)
    },
    { 
      key: 'priorityScore', 
      header: 'Skor Prioritas', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => {
        const score = row.priorityScore;
        const colorClass = score >= 80 
          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/60' 
          : score >= 50 
            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/60' 
            : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/60';
        return (
          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border ${colorClass}`}>
            {score}
          </span>
        );
      }
    },
    { 
      key: 'trend', 
      header: 'Tren', 
      sortable: true,
      render: (row: DistrictDiagnosisDetail) => {
        const isUp = row.trend === 'up';
        const isDown = row.trend === 'down';
        return (
          <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold ${
            isUp ? 'text-rose-600 dark:text-rose-400' : isDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
          }`}>
            {isUp && <TrendingUp className="h-3 w-3" />}
            {isDown && <TrendingDown className="h-3 w-3" />}
            {row.trend === 'up' ? 'Naik' : row.trend === 'down' ? 'Turun' : 'Stabil'}
          </span>
        );
      }
    }
  ], []);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300" id="regional-diagnosis-page-container">
      
      {/* 1. Page Header */}
      <PageHeader 
        title="Diagnosis Wilayah"
        description="Memahami Faktor Pendorong Kemiskinan dan Ketimpangan di Seluruh Jawa Barat"
      />

      {/* Export Notifications */}
      {exportNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-bounce border border-slate-800">
          <Activity className="h-4 w-4 text-blue-400 animate-spin" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* 2. Global Filters */}
      <div className="space-y-2">
        <FilterPanel
          filters={filterDefinitions}
          selectedValues={filterValues}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
        />
        <div className="flex justify-end">
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Atur Ulang Semua Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Executive Insight HUD */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-slate-50 dark:bg-slate-900/50 p-6 space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Memo Analitis Eksekutif
            </h4>
          </div>
          <span className="text-[9px] font-mono bg-blue-100/50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            GENERATOR ANALISIS OTOMATIS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Situasi Terkini
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {dynamicInsight.currentSituation}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Temuan Kunci
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {dynamicInsight.keyFinding}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Implikasi Kebijakan
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {dynamicInsight.policyImplication}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Tindakan Prioritas
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {dynamicInsight.priorityAction}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Theil Decomposition Stacked Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ChartContainer
            title="Tren Dekomposisi Ketimpangan Theil"
            subtitle="Kontribusi rasio ketimpangan dalam-wilayah versus antar-wilayah (2022 - 2025)."
          >
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={theilChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '4px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '11px',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="rect" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar 
                    dataKey="betweenDisparity" 
                    name="Ketimpangan Antar-Kabupaten/Kota" 
                    stackId="theil" 
                    fill="#f59e0b" // Orange representation
                  />
                  <Bar 
                    dataKey="withinDisparity" 
                    name="Ketimpangan Dalam-Kabupaten/Kota" 
                    stackId="theil" 
                    fill="#8b5cf6" // Violet representation
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Written Interpretation */}
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded border border-slate-100/50 dark:border-slate-900/50 text-xs text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-800 dark:text-slate-300 block uppercase tracking-wider text-[9px] mb-1 font-mono">Interpretasi Statistik:</span>
              Memisahkan indeks Theil tingkat provinsi menunjukkan kompresi yang konsisten dari margin struktural antar-kabupaten/kota dari {theilChartData[0].betweenDisparity.toFixed(3)} turun menjadi {theilChartData[theilChartData.length-1].betweenDisparity.toFixed(3)}. Sebaliknya, dispersi internal (di dalam kabupaten/kota) tetap stabil, memperluas dampak proporsional keseluruhannya hingga lebih dari {theilChartData[theilChartData.length-1].withinContribution.toFixed(1)}%. Hal ini menegaskan bahwa integrasi regional berhasil pada skala makro, namun program kesetaraan intra-wilayah lokal memerlukan pengarahan ulang yang strategis.
            </div>
          </ChartContainer>
        </div>

        {/* 5. Contribution Analysis Donut Charts */}
        <div className="lg:col-span-4">
          <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs h-full flex flex-col justify-between">
            <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Rincian Kontribusi Ketimpangan
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Bagian proporsional yang mewakili kontribusi tahun anggaran {selectedYear} saat ini.
              </p>
            </div>

            <div className="space-y-6 flex-1 flex flex-col justify-around py-4">
              {/* Within Donut */}
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={withinPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#f1f5f9" className="dark:fill-slate-850" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {currentDecomposition.withinContribution.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-950 dark:text-slate-200 block">Ketimpangan Dalam-Kabupaten/Kota</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Varians konsumsi yang terjadi di dalam batas-batas kabupaten/kota masing-masing. Kontribusi yang tinggi menunjukkan disparitas pedesaan-perkotaan atau antar-kecamatan yang signifikan.
                  </p>
                </div>
              </div>

              {/* Between Donut */}
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={betweenPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#f59e0b" />
                        <Cell fill="#f1f5f9" className="dark:fill-slate-850" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {currentDecomposition.betweenContribution.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-950 dark:text-slate-200 block">Ketimpangan Antar-Kabupaten/Kota</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Ketimpangan yang timbul dari perbedaan struktural antar-kabupaten/kota (misalnya Bekasi industri vs Kuningan pertanian).
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-slate-900 text-[10px] text-slate-400 italic">
              * Jumlah metrik kontribusi sama dengan 100% (dekomposisi Theil T).
            </div>
          </div>
        </div>
      </div>

      {/* 6. Poverty Indicator Trends (Synchronized Line Charts) */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Indeks Lintasan Sosial Ekonomi (Sinkronisasi Kursor)
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Arahkan kursor ke titik mana saja untuk menyelaraskan garis penunjuk waktu di keempat indikator kesejahteraan utama.
            </p>
          </div>
          <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
            Aktif: {selectedDistrictId === 'All' ? 'Rata-Rata Jawa Barat' : selectedDistrictDetails?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* P0 */}
          <div className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm p-4 space-y-2 shadow-2xs">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">HEADCOUNT P0</span>
                <p className="text-[10.5px] text-slate-500">% di bawah garis kemiskinan</p>
              </div>
              <span className="text-xs font-bold text-blue-500 font-mono">
                {trendChartData[trendChartData.length-1].p0.toFixed(2)}%
              </span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} syncId="poverty-indicators" margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" className="dark:stroke-slate-900" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="p0" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* P1 */}
          <div className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm p-4 space-y-2 shadow-2xs">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">KESENJANGAN KEMISKINAN P1</span>
                <p className="text-[10.5px] text-slate-500">Kedalaman defisit rata-rata</p>
              </div>
              <span className="text-xs font-bold text-rose-500 font-mono">
                {trendChartData[trendChartData.length-1].p1.toFixed(2)}
              </span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} syncId="poverty-indicators" margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" className="dark:stroke-slate-900" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="p1" stroke="#f43f5e" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* P2 */}
          <div className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm p-4 space-y-2 shadow-2xs">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">INDEKS KEPARAHAN P2</span>
                <p className="text-[10.5px] text-slate-500">Ketimpangan di antara penduduk miskin</p>
              </div>
              <span className="text-xs font-bold text-pink-500 font-mono">
                {trendChartData[trendChartData.length-1].p2.toFixed(2)}
              </span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} syncId="poverty-indicators" margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" className="dark:stroke-slate-900" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="p2" stroke="#ec4899" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gini */}
          <div className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm p-4 space-y-2 shadow-2xs">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">RASIO GINI</span>
                <p className="text-[10.5px] text-slate-500">Indeks konsentrasi konsumsi</p>
              </div>
              <span className="text-xs font-bold text-emerald-500 font-mono">
                {trendChartData[trendChartData.length-1].gini.toFixed(3)}
              </span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} syncId="poverty-indicators" margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" className="dark:stroke-slate-900" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="gini" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* 8. Spatial Diagnosis (Choropleth Map) */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            Diagnosis Disparitas Spasial & Sasaran
          </h4>
        </div>
        <SpatialDiagnosisMap 
          districtsData={DISTRICT_DIAGNOSIS_DATA[selectedYear] || DISTRICT_DIAGNOSIS_DATA['2025'] || []}
          selectedDistrictId={selectedDistrictId === 'All' ? '3202' : selectedDistrictId}
          onSelectDistrict={(id) => setSelectedDistrictId(id)}
        />
      </div>

      {/* 7. District Comparison DataTable */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Indeks Perbandingan & Tolok Ukur Kabupaten/Kota
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Kisi peringkat komprehensif yang sesuai dengan tahun {selectedYear}. Urutkan atau cari secara dinamis untuk mempersempit cakupan diagnosis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar 
              value={tableSearchQuery} 
              onChange={setTableSearchQuery} 
              placeholder="Saring kabupaten/kota..." 
            />
          </div>
        </div>

        <DataTable
          columns={tableColumns}
          data={filteredDistricts}
          pageSize={7}
          onRowClick={(row) => setSelectedDistrictId(row.id)}
          selectedRowId={selectedDistrictId}
          rowIdKey="id"
          enableExport
          exportFileName={`rancage-diagnosis-comparison-${selectedYear}.csv`}
        />
      </div>

      {/* 9. Priority Drivers (Feature Cards) */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            Faktor Pendorong Utama Disparitas & Hambatan Spasial
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Faktor-faktor empiris yang diidentifikasi oleh pemodelan struktural sebagai penyebab utama wilayah kesejahteraan rendah yang persisten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRIORITY_DRIVERS_DATA.map((driver) => (
            <div 
              key={driver.id} 
              className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-5 rounded-sm flex flex-col justify-between space-y-3.5 shadow-2xs hover:border-blue-500/30 transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded font-black tracking-wider border border-slate-200/50 dark:border-slate-800/50 uppercase">
                    {driver.metric}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    {driver.districtCount} Daerah
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  {driver.title}
                </h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {driver.evaluation}
                </p>
              </div>

              <div className="space-y-2.5 pt-2.5 border-t border-slate-100/50 dark:border-slate-900/50">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block tracking-wider">Lokasi Kasus Kritis:</span>
                  <div className="flex flex-wrap gap-1">
                    {driver.criticalCases.map((c, idx) => (
                      <span key={idx} className="text-[10px] bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded border border-red-100/30 font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block tracking-wider">Rekomendasi Diagnosis:</span>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-300 italic leading-snug">
                    "{driver.recom}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Analytical Written Narrative */}
      <div className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm p-6 space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Taklimat Tertulis Otoritatif: Faktor Pendorong Ketimpangan Jawa Barat
            </h4>
          </div>
          <span className="text-[9px] font-mono text-slate-400">
            DISIAPKAN UNTUK BAPPEDA • SIFAT RAHASIA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
          
          <div className="md:col-span-8 space-y-5">
            <section className="space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                <span>1. Situasi Terkini</span>
              </h5>
              <p>
                Hingga periode survei tahun {selectedYear}, Jawa Barat mengalami transisi yang kompleks. Sementara rata-rata rasio headcount kemiskinan (P0) tingkat provinsi terus menurun secara stabil menuju {trendChartData[trendChartData.length-1].p0.toFixed(2)}%, kesenjangan struktural di dalam subdivisi geografis tertentu semakin mengeras. Konsentrasi konsumsi Gini tetap tinggi pada {trendChartData[trendChartData.length-1].gini.toFixed(3)}, menunjukkan bahwa keuntungan dari pertumbuhan koridor industri yang tinggi (Kuadran I Klassen) tidak diterjemahkan secara seragam ke rumah tangga desil bawah di wilayah pertanian terpencil.
              </p>
            </section>

            <section className="space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                2. Temuan Utama
              </h5>
              <p>
                Temuan empiris utama dari investigasi diagnostik ini menunjuk langsung pada **Ketimpangan Intra-Wilayah (Dalam)** sebagai kontributor yang sangat dominan terhadap kesenjangan kesejahteraan di Jawa Barat. Disparitas antar-kabupaten/kota berhasil ditekan, namun fragmentasi mendalam di dalam batas kabupaten tetap tidak teratasi. Faktanya, varians konsumsi dalam-kabupaten/kota menyumbang **{currentDecomposition.withinContribution.toFixed(1)}%** dari seluruh indeks disparitas. Ini menunjukkan bahwa tantangan kebijakan yang sebenarnya bukan lagi divergensi struktural antar-kota, melainkan ketimpangan akut di dalam kabupaten perdesaan tertentu.
              </p>
            </section>

            <section className="space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                3. Basis Bukti Statistik
              </h5>
              <p>
                Dekomposisi matematis dari indeks Theil T memvalidasi lintasan ini. Selama lini masa 2022–2025, komponen antar-kabupaten/kota turun hampir {((theilChartData[0].betweenDisparity - theilChartData[theilChartData.length-1].betweenDisparity)*100).toFixed(1)}%, membuktikan bahwa koridor konektivitas regional menyelaraskan skala pendapatan rata-rata kabupaten. Namun, indeks Keparahan Kemiskinan (P2) berada pada {trendChartData[trendChartData.length-1].p2.toFixed(2)}, menunjukkan kantong-kantong deprivasi ekstrem di bagian terbawah dari distribusi kesejahteraan. Registrasi PMT dengan akurasi tinggi menunjukkan bahwa kantong-kantong ini sangat terkonsentrasi di daerah pertanian selatan yang mengalami kesenjangan akses air bersih dan sekolah menengah yang parah.
              </p>
            </section>
          </div>

          <div className="md:col-span-4 space-y-5 border-l border-slate-100 dark:border-slate-850 pl-6 md:pl-8">
            <section className="space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                4. Pola Spasial
              </h5>
              <p>
                Koroplet koordinat spasial mengidentifikasi dua kluster kritis. Pertama adalah **sabuk pesisir Pantai Utara (Indramayu-Cirebon)**, yang menderita tipologi Kuadran IV Klassen dengan pertumbuhan rendah ditambah dengan tingkat putus sekolah pemuda yang tinggi. Kedua adalah **kantong Pegunungan Priangan Selatan (Garut, Tasikmalaya, Cianjur, Sukabumi)**, di mana topografi berbukit yang sulit sangat membatasi akses air bersih yang aman dan konektivitas layanan kesehatan pedesaan. Ini menciptakan perangkap deprivasi spasial yang gagal diatasi oleh daftar kesejahteraan sosial manual.
              </p>
            </section>

            <section className="space-y-1.5">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                5. Arah Kebijakan yang Direkomendasikan
              </h5>
              <p>
                Untuk mencapai target kompresi rasio Gini &lt;0.350, Bappeda harus beralih dari transfer fiskal yang luas ke hibah penyelarasan tingkat kecamatan yang terdesentralisasi. Alokasi harus sangat fokus pada:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Membangun akademi kejuruan terarah di pusat-pusat pertanian selatan.</li>
                <li>Melaksanakan injeksi jaringan air sumur dalam pedesaan.</li>
                <li>Meningkatkan pendaftaran sipil lokal di daerah perbatasan terpencil menggunakan mobil satelit keliling untuk mencegah kesalahan eksklusi.</li>
              </ul>
            </section>
          </div>

        </div>
      </div>

      {/* 11. Export Section */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-slate-950 text-white p-6 relative overflow-hidden" id="export-actions-panel">
        <div className="absolute top-0 right-0 h-48 w-48 bg-blue-500/5 rounded-full filter blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Susun Laporan Diagnosis Komprehensif
            </h4>
            <p className="text-[11px] text-slate-400">
              Buat taklimat pemerintah yang diaudit, basis data CSV yang terperinci, atau visualisasi peta dengan akurasi tinggi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => triggerExport('PDF')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm border border-slate-800 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-red-400" />
              <span>Ekspor Ringkasan PDF</span>
            </button>

            <button
              onClick={() => triggerExport('Excel')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm border border-slate-800 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Ekspor Dataset Excel</span>
            </button>

            <button
              onClick={() => triggerExport('Image')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm border border-slate-800 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <ImageIcon className="h-4 w-4 text-blue-400" />
              <span>Ekspor Gambar GIS</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
