import React, { useState, useMemo, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  BarChart,
  Bar,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  Filter,
  RotateCcw,
  Search,
  Sparkles,
  MapPin,
  TrendingDown,
  Users,
  Target,
  Activity,
  FileSpreadsheet,
  TrendingUp,
  HelpCircle,
  Map,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Layers,
  FileText,
  AlertTriangle,
  ExternalLink,
  Plus,
} from 'lucide-react';

import { PageHeader } from '../ui/PageHeader.tsx';
import { MapContainer, TileLayer, GeoJSON, Tooltip as LeafletTooltip } from 'react-leaflet';
import { useThemeStore } from '../../store/themeStore.ts';
import { KpiCard } from '../ui/KpiCard.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import { DataTable } from '../ui/DataTable.tsx';
import { DISTRICT_DIAGNOSIS_DATA, DistrictDiagnosisDetail } from '../analytics/diagnosisData.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { formatPercentage, formatNumber } from '../../utils/format.ts';
import { motion, AnimatePresence } from 'motion/react';

// Geographic network coordinate representation for West Java districts from InteractiveMap.tsx
const DISTRICT_MAP_COORDS: Record<string, { x: number; y: number; name: string; neighbors: string[] }> = {
  '3201': { x: 140, y: 130, name: 'Bogor', neighbors: ['3216', '3271', '3202', '3203'] },
  '3202': { x: 120, y: 220, name: 'Sukabumi', neighbors: ['3201', '3272', '3203'] },
  '3203': { x: 210, y: 200, name: 'Cianjur', neighbors: ['3201', '3202', '3217', '3204', '3205'] },
  '3204': { x: 310, y: 210, name: 'Bandung', neighbors: ['3217', '3273', '3211', '3205'] },
  '3205': { x: 360, y: 280, name: 'Garut', neighbors: ['3204', '3203', '3206', '3211'] },
  '3206': { x: 440, y: 270, name: 'Tasikmalaya', neighbors: ['3205', '3278', '3207', '3218'] },
  '3207': { x: 520, y: 250, name: 'Ciamis', neighbors: ['3206', '3279', '3218', '3208'] },
  '3208': { x: 530, y: 190, name: 'Kuningan', neighbors: ['3207', '3209', '3210'] },
  '3209': { x: 540, y: 120, name: 'Cirebon', neighbors: ['3208', '3212', '3210', '3274'] },
  '3210': { x: 470, y: 160, name: 'Majalengka', neighbors: ['3209', '3208', '3211', '3212'] },
  '3211': { x: 390, y: 160, name: 'Sumedang', neighbors: ['3204', '3210', '3217', '3213'] },
  '3212': { x: 480, y: 80, name: 'Indramayu', neighbors: ['3209', '3210', '3213'] },
  '3213': { x: 350, y: 100, name: 'Subang', neighbors: ['3214', '3215', '3211', '3212'] },
  '3214': { x: 280, y: 110, name: 'Purwakarta', neighbors: ['3213', '3215', '3217'] },
  '3215': { x: 270, y: 70, name: 'Karawang', neighbors: ['3214', '3213', '3216'] },
  '3216': { x: 200, y: 70, name: 'Bekasi', neighbors: ['3215', '3201', '3275'] },
  '3217': { x: 290, y: 160, name: 'KBB', neighbors: ['3203', '3204', '3214', '3211', '3277'] },
  '3218': { x: 510, y: 310, name: 'Pangandaran', neighbors: ['3206', '3207'] },
  '3271': { x: 155, y: 150, name: 'Kota Bogor', neighbors: ['3201'] },
  '3272': { x: 145, y: 200, name: 'Kota SBM', neighbors: ['3202'] },
  '3273': { x: 330, y: 185, name: 'Kota BDG', neighbors: ['3204'] },
  '3274': { x: 555, y: 135, name: 'Kota CRB', neighbors: ['3209'] },
  '3275': { x: 180, y: 90, name: 'Kota BKS', neighbors: ['3216', '3276'] },
  '3276': { x: 140, y: 95, name: 'Kota Depok', neighbors: ['3275'] },
  '3277': { x: 300, y: 175, name: 'Kota Cimahi', neighbors: ['3217'] },
  '3278': { x: 455, y: 250, name: 'Kota TSM', neighbors: ['3206'] },
  '3279': { x: 545, y: 240, name: 'Kota Banjar', neighbors: ['3207'] },
};

export default function RegionalTypologyPage() {
  const { navigateTo, selectedDistrictId, setSelectedDistrictId, selectedYear: globalYear, selectedTypology: globalTypology } = useNavigationStore();
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedPriorityLevel, setSelectedPriorityLevel] = useState<string>('All');
  const [selectedUrbanRural, setSelectedUrbanRural] = useState<string>('All');
  const [selectedTypology, setSelectedTypology] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [geoData, setGeoData] = useState<any>(null);
  const { mode } = useThemeStore();

  useEffect(() => {
    fetch('/jawa_barat.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  useEffect(() => {
    if (globalYear) {
      setSelectedYear(globalYear);
    }
  }, [globalYear]);

  useEffect(() => {
    if (globalTypology) {
      setSelectedRegion(globalTypology === 'ALL' ? 'All' : globalTypology);
    }
  }, [globalTypology]);

  // Map Pan & Zoom State
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Policy recommendation active tab
  const [activeRecommendationTab, setActiveRecommendationTab] = useState<'Priority I' | 'Priority II' | 'Priority III' | 'Priority IV'>('Priority I');

  // Reset Filters Function
  const handleResetFilters = () => {
    setSelectedYear('2025');
    setSelectedRegion('All');
    setSelectedUrbanRural('All');
    setSelectedPriorityLevel('All');
    setSelectedTypology('All');
    setSearchTerm('');
  };

  // Raw list for active year
  const rawDistricts = useMemo(() => {
    return DISTRICT_DIAGNOSIS_DATA[selectedYear] || DISTRICT_DIAGNOSIS_DATA['2025'] || [];
  }, [selectedYear]);

  // Compute Active Year averages for relative thresholds
  const averageP0 = useMemo(() => {
    if (rawDistricts.length === 0) return 8.0;
    return rawDistricts.reduce((acc, d) => acc + d.p0, 0) / rawDistricts.length;
  }, [rawDistricts]);

  const averageWithin = useMemo(() => {
    if (rawDistricts.length === 0) return 0.11;
    return rawDistricts.reduce((acc, d) => acc + d.within, 0) / rawDistricts.length;
  }, [rawDistricts]);

  // Map each district to our computed priority typology quadrant based on poverty (P0) and within disparity
  const computedDistricts = useMemo(() => {
    return rawDistricts.map((d) => {
      const isP0High = d.p0 >= averageP0;
      const isWithinHigh = d.within >= averageWithin;

      let priorityLevel: 'Priority I' | 'Priority II' | 'Priority III' | 'Priority IV';
      let quadrantName: string;
      
      if (isP0High && isWithinHigh) {
        priorityLevel = 'Priority I';
        quadrantName = 'Quadrant I (Severe Dual Disparity)';
      } else if (isP0High && !isWithinHigh) {
        priorityLevel = 'Priority II';
        quadrantName = 'Quadrant II (Uniform Poverty)';
      } else if (!isP0High && isWithinHigh) {
        priorityLevel = 'Priority III';
        quadrantName = 'Quadrant III (Hidden Pocket Disparity)';
      } else {
        priorityLevel = 'Priority IV';
        quadrantName = 'Quadrant IV (Stable Monitored)';
      }

      return {
        ...d,
        priorityLevel,
        quadrantName,
      };
    });
  }, [rawDistricts, averageP0, averageWithin]);

  // Apply filters
  const filteredDistricts = useMemo(() => {
    return computedDistricts.filter((d) => {
      if (selectedRegion !== 'All' && d.region !== selectedRegion) return false;
      if (selectedUrbanRural !== 'All' && d.urbanRural !== selectedUrbanRural) return false;
      if (selectedPriorityLevel !== 'All' && d.priorityLevel !== selectedPriorityLevel) return false;
      if (selectedTypology !== 'All' && d.typology !== selectedTypology) return false;
      if (searchTerm) {
        const matchesName = d.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesId = d.id.includes(searchTerm);
        if (!matchesName && !matchesId) return false;
      }
      return true;
    });
  }, [computedDistricts, selectedRegion, selectedUrbanRural, selectedPriorityLevel, selectedTypology, searchTerm]);

  // Selected district info
  const selectedDistrictData = useMemo(() => {
    if (!selectedDistrictId) return null;
    return computedDistricts.find((d) => d.id === selectedDistrictId) || null;
  }, [selectedDistrictId, computedDistricts]);

  // Dynamic Metrics for Quadrant Summary Cards
  interface QuadrantStatInfo {
    count: number;
    population: number;
    avgP0: number;
    avgWithin: number;
    avgPriorityScore: number;
    districts: typeof computedDistricts;
  }

  const quadrantStats = useMemo<Record<'Priority I' | 'Priority II' | 'Priority III' | 'Priority IV', QuadrantStatInfo>>(() => {
    const stats = {
      'Priority I': { count: 0, population: 0, totalP0: 0, totalWithin: 0, totalPriorityScore: 0, districts: [] as typeof computedDistricts },
      'Priority II': { count: 0, population: 0, totalP0: 0, totalWithin: 0, totalPriorityScore: 0, districts: [] as typeof computedDistricts },
      'Priority III': { count: 0, population: 0, totalP0: 0, totalWithin: 0, totalPriorityScore: 0, districts: [] as typeof computedDistricts },
      'Priority IV': { count: 0, population: 0, totalP0: 0, totalWithin: 0, totalPriorityScore: 0, districts: [] as typeof computedDistricts },
    };

    computedDistricts.forEach((d) => {
      const q = d.priorityLevel;
      stats[q].count += 1;
      stats[q].population += d.population;
      stats[q].totalP0 += d.p0;
      stats[q].totalWithin += d.within;
      stats[q].totalPriorityScore += d.priorityScore;
      stats[q].districts.push(d);
    });

    const result: Record<'Priority I' | 'Priority II' | 'Priority III' | 'Priority IV', QuadrantStatInfo> = {
      'Priority I': { count: 0, population: 0, avgP0: 0, avgWithin: 0, avgPriorityScore: 0, districts: [] },
      'Priority II': { count: 0, population: 0, avgP0: 0, avgWithin: 0, avgPriorityScore: 0, districts: [] },
      'Priority III': { count: 0, population: 0, avgP0: 0, avgWithin: 0, avgPriorityScore: 0, districts: [] },
      'Priority IV': { count: 0, population: 0, avgP0: 0, avgWithin: 0, avgPriorityScore: 0, districts: [] },
    };

    (['Priority I', 'Priority II', 'Priority III', 'Priority IV'] as const).forEach((key) => {
      const data = stats[key];
      const count = data.count || 1;
      result[key] = {
        count: data.count,
        population: data.population,
        avgP0: data.totalP0 / count,
        avgWithin: data.totalWithin / count,
        avgPriorityScore: data.totalPriorityScore / count,
        districts: data.districts,
      };
    });

    return result;
  }, [computedDistricts]);

  // Dynamic Dominant Typology Calculation for Narrative
  const dominantTypologyInfo = useMemo(() => {
    const keys = ['Priority I', 'Priority II', 'Priority III', 'Priority IV'] as const;
    let maxCount = -1;
    let dominantKey: 'Priority I' | 'Priority II' | 'Priority III' | 'Priority IV' = 'Priority I';

    keys.forEach((key) => {
      if (quadrantStats[key].count > maxCount) {
        maxCount = quadrantStats[key].count;
        dominantKey = key;
      }
    });

    return {
      name: dominantKey,
      count: maxCount,
    };
  }, [quadrantStats]);

  // Map Zoom & Pan Calculations
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => {
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
  };
  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 30 / zoom;
    setPanOffset((prev) => {
      switch (direction) {
        case 'up': return { ...prev, y: prev.y - step };
        case 'down': return { ...prev, y: prev.y + step };
        case 'left': return { ...prev, x: prev.x - step };
        case 'right': return { ...prev, x: prev.x + step };
      }
    });
  };

  const baseViewBox = { x: 50, y: 30, w: 550, h: 310 };
  const dynamicW = baseViewBox.w / zoom;
  const dynamicH = baseViewBox.h / zoom;
  const dynamicX = baseViewBox.x + panOffset.x + (baseViewBox.w - dynamicW) / 2;
  const dynamicY = baseViewBox.y + panOffset.y + (baseViewBox.h - dynamicH) / 2;
  const viewBoxString = `${dynamicX} ${dynamicY} ${dynamicW} ${dynamicH}`;

  const priorityColors = {
    'Priority I': { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-100 dark:border-rose-900', fill: '#ef4444', text: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200' },
    'Priority II': { bg: 'bg-amber-50 dark:bg-amber-950/15', border: 'border-amber-100 dark:border-amber-900/60', fill: '#f97316', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200' },
    'Priority III': { bg: 'bg-yellow-50/70 dark:bg-yellow-950/10', border: 'border-yellow-100 dark:border-yellow-900/30', fill: '#eab308', text: 'text-yellow-600 dark:text-yellow-500', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400 border-yellow-200' },
    'Priority IV': { bg: 'bg-emerald-50/50 dark:bg-emerald-950/10', border: 'border-emerald-100/60 dark:border-emerald-900/20', fill: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200' },
  };

  const originalTypologyNames = {
    'I': 'Maju dan Tumbuh Cepat (Klassen I)',
    'II': 'Maju tapi Tertekan (Klassen II)',
    'III': 'Berkembang Cepat (Klassen III)',
    'IV': 'Relatif Tertinggal (Klassen IV)',
  };

  // Recharts Bar charts helper dataset
  const chartData = useMemo(() => {
    return (Object.entries(quadrantStats) as [
      'Priority I' | 'Priority II' | 'Priority III' | 'Priority IV',
      QuadrantStatInfo
    ][]).map(([key, value]) => ({
      name: key === 'Priority I' ? 'Prioritas I' : key === 'Priority II' ? 'Prioritas II' : key === 'Priority III' ? 'Prioritas III' : 'Prioritas IV',
      'Jumlah Kabupaten/Kota': value.count,
      'Populasi (Juta)': parseFloat((value.population / 1000000).toFixed(2)),
      'Rata-rata Tingkat Kemiskinan (%)': parseFloat(value.avgP0.toFixed(2)),
      'Rata-rata Kontribusi Disparitas': parseFloat(value.avgWithin.toFixed(4)),
    }));
  }, [quadrantStats]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200" id="regional-typology-container">
      
      {/* Page Header */}
      <PageHeader
        title="Tipologi Wilayah"
        description="Prioritas Pembangunan Kabupaten dan Kota Berbasis Bukti di Jawa Barat"
      />

      {/* Global Filters Panel */}
      <div className="bg-white dark:bg-slate-950 rounded-sm border border-slate-100 dark:border-slate-900 p-5 shadow-xs" id="typology-filters">
        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Filter Prioritas Multivariat
            </h3>
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 px-2.5 py-1 rounded-sm"
          >
            <RotateCcw className="h-3 w-3" />
            Atur Ulang Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Year select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tahun Referensi
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm p-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-slate-400"
            >
              <option value="2025">2025 (Survei Terbaru)</option>
              <option value="2024">2024 (Rata-rata)</option>
              <option value="2023">2023 (Baseline)</option>
              <option value="2022">2022 (Pemulihan Pandemi)</option>
            </select>
          </div>

          {/* Region filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Wilayah Pembangunan
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm p-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-slate-400"
            >
              <option value="All">Semua Wilayah (Jawa Barat)</option>
              <option value="BOGOR">BOGOR-DEPOK-BEKASI</option>
              <option value="SUKABUMI">SUKABUMI-CIANJUR</option>
              <option value="PRIANGAN">PRIANGAN TIMUR</option>
              <option value="CIREBON">CIREBON-INDRAMAYU</option>
              <option value="PURWAKARTA">PURWAKARTA-SUBANG</option>
            </select>
          </div>

          {/* Urban/Rural filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Klasifikasi Wilayah
            </label>
            <select
              value={selectedUrbanRural}
              onChange={(e) => setSelectedUrbanRural(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm p-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-slate-400"
            >
              <option value="All">Semua Klasifikasi</option>
              <option value="Urban">Perkotaan (Kota)</option>
              <option value="Rural">Perdesaan (Kabupaten)</option>
            </select>
          </div>

          {/* Priority Level filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tingkat Prioritas Kebijakan
            </label>
            <select
              value={selectedPriorityLevel}
              onChange={(e) => setSelectedPriorityLevel(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm p-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-slate-400"
            >
              <option value="All">Semua Kelas Prioritas</option>
              <option value="Priority I">Prioritas I (Risiko Kantong Ekstrem)</option>
              <option value="Priority II">Prioritas II (Struktural Seragam)</option>
              <option value="Priority III">Prioritas III (Ketimpangan Kantong)</option>
              <option value="Priority IV">Prioritas IV (Pemantauan Stabil)</option>
            </select>
          </div>

          {/* Original Klassen Typology filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Kelas Tipologi Klassen
            </label>
            <select
              value={selectedTypology}
              onChange={(e) => setSelectedTypology(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm p-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-slate-400"
            >
              <option value="All">Semua Kelas Klassen</option>
              <option value="I">Klassen I (Pendapatan Tinggi, Pertumbuhan Tinggi)</option>
              <option value="II">Klassen II (Pendapatan Tinggi, Pertumbuhan Rendah)</option>
              <option value="III">Klassen III (Pendapatan Rendah, Pertumbuhan Tinggi)</option>
              <option value="IV">Klassen IV (Pendapatan Rendah, Pertumbuhan Rendah)</option>
            </select>
          </div>
        </div>

        {/* Search Bar inside Filters */}
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-900 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama kabupaten/kota atau Kode BPS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-slate-400 placeholder:text-slate-400"
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            Sinkronisasi: {filteredDistricts.length} / {computedDistricts.length} wilayah administratif cocok
          </span>
        </div>
      </div>

      {/* SECTION 1: Executive Insight */}
      <div className="bg-slate-950 text-white rounded-sm border border-slate-800 p-6 shadow-md relative overflow-hidden" id="executive-narrative-summary">
        {/* Ambient top light */}
        <div className="absolute top-0 right-1/4 h-20 w-80 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-blue-950/60 rounded border border-blue-800 shrink-0 text-blue-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-4 w-full">
            <div>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono">
                Narasi Intelijen Keputusan AI
              </span>
              <h2 className="text-base font-bold tracking-tight text-white mt-1 uppercase">
                Wawasan Tipologi Eksekutif • Survei {selectedYear}
              </h2>
            </div>

            <div className="text-xs leading-relaxed text-slate-300 space-y-3.5 max-w-5xl font-medium">
              <p>
                Analisis kebijakan multidimensi terhadap 27 kabupaten dan kota di Jawa Barat untuk tahun {selectedYear} mengidentifikasi{' '}
                <strong className="text-white text-semibold">{quadrantStats['Priority I'].count} wilayah</strong> yang masuk ke dalam{' '}
                <span className="text-rose-400 font-bold font-mono">Prioritas I (Disparitas Ganda Ekstrem)</span>,{' '}
                <strong className="text-white text-semibold">{quadrantStats['Priority II'].count} wilayah</strong> dalam{' '}
                <span className="text-amber-400 font-bold font-mono">Prioritas II (Kemiskinan Struktural Seragam)</span>,{' '}
                <strong className="text-white text-semibold">{quadrantStats['Priority III'].count} wilayah</strong> dalam{' '}
                <span className="text-yellow-400 font-bold font-mono">Prioritas III (Ketimpangan Kantong)</span>, dan{' '}
                <strong className="text-white text-semibold">{quadrantStats['Priority IV'].count} wilayah</strong> dalam{' '}
                <span className="text-emerald-400 font-bold font-mono">Prioritas IV (Pemantauan Stabil)</span>.
              </p>
              
              <p>
                Tipologi dominan di tingkat provinsi adalah <strong className="text-white font-bold">{dominantTypologyInfo.name === 'Priority I' ? 'Prioritas I' : dominantTypologyInfo.name === 'Priority II' ? 'Prioritas II' : dominantTypologyInfo.name === 'Priority III' ? 'Prioritas III' : 'Prioritas IV'}</strong>, yang mencakup{' '}
                <strong className="text-white">{dominantTypologyInfo.count} kabupaten/kota</strong>. Distribusi spasial ini menunjukkan bahwa:
                {dominantTypologyInfo.name === 'Priority I' ? (
                  <span> pemerintah provinsi menghadapi tantangan ganda berupa tingkat kemiskinan yang tinggi sekaligus disparitas kesejahteraan yang lebar di dalam batas wilayah kabupaten. Kebijakan harus memprioritaskan intervensi mikro pada kantong kemiskinan secara mendalam, alih-alih penyaluran bantuan umum skala kabupaten.</span>
                ) : dominantTypologyInfo.name === 'Priority II' ? (
                  <span> kemiskinan bersifat seragam dan struktural di kabupaten-kabupaten tertinggal. Fokus kebijakan harus dialihkan secara signifikan ke arah pembangunan infrastruktur fisik makro, jaringan konektivitas perdesaan, dan program produktivitas regional.</span>
                ) : dominantTypologyInfo.name === 'Priority III' ? (
                  <span> kantong kemiskinan lokal yang parah tersembunyi di dalam wilayah yang relatif makmur. Bappeda harus menugaskan tim khusus untuk mengaudit kesalahan eksklusi guna menjangkau kecamatan dan desa miskin yang terlewatkan oleh pertumbuhan PDRB regional.</span>
                ) : (
                  <span> lanskap sosial-ekonomi Jawa Barat relatif stabil, dengan tingkat kemiskinan yang rendah dan disparitas internal yang minim. Tanggung jawab utama Bappeda adalah mempertahankan iklim investasi swasta, mendorong penciptaan lapangan kerja, dan memastikan berjalannya jaring pengaman sosial standar.</span>
                )}
              </p>

              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-sm space-y-2 mt-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block font-mono">
                  Tindakan Strategis Mendesak:
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-[11px]">
                  <li>
                    <strong className="text-white">Sasaran Darurat:</strong> Optimalkan daftar perlindungan sosial (BLT) segera di koridor{' '}
                    <span className="text-rose-400 font-semibold">{quadrantStats['Priority I'].districts.slice(0, 3).map(d => d.name).join(', ')}</span> untuk mengeliminasi margin kebocoran bantuan yang tinggi.
                  </li>
                  <li>
                    <strong className="text-white">Penyelarasan Alokasi Fiskal:</strong> Alokasikan hingga <span className="text-white font-bold font-mono">45% dana bantuan keuangan provinsi</span> secara langsung untuk jaringan air bersih dan sanitasi di zona tertinggal Prioritas I & II.
                  </li>
                  <li>
                    <strong className="text-white">Audit Bersasaran:</strong> Terapkan unit keliling pendaftaran sipil (Disdukcapil) di wilayah Prioritas III untuk mendata desil Termiskin (D1) tersembunyi yang terlewat oleh registrasi kabupaten.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 & SECTION 4: Dual Matrix & Map Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="interactive-visualizations-layout">
        
        {/* Section 2: Interactive Typology Matrix */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Matriks Tipologi Kebijakan Interaktif
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Memetakan Tingkat Kemiskinan (P0) vs Kontribusi Disparitas Theil Dalam-Wilayah.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-sm font-bold">
                Rata-rata P0: {averageP0.toFixed(2)}% • Rata-rata Internal: {averageWithin.toFixed(4)}
              </div>
            </div>

            {/* Matrix Plot */}
            <div className="h-80 w-full relative pt-2">
              <div className="absolute top-2 right-2 text-[8px] font-bold text-rose-500/40 pointer-events-none uppercase">Prioritas I: Disparitas Ganda Ekstrem</div>
              <div className="absolute bottom-2 right-2 text-[8px] font-bold text-amber-500/40 pointer-events-none uppercase">Prioritas II: Struktural Seragam</div>
              <div className="absolute top-2 left-2 text-[8px] font-bold text-yellow-600/40 dark:text-yellow-400/30 pointer-events-none uppercase">Prioritas III: Ketimpangan Kantong</div>
              <div className="absolute bottom-2 left-2 text-[8px] font-bold text-emerald-500/40 pointer-events-none uppercase">Prioritas IV: Pemantauan Stabil</div>

              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                  <XAxis
                    type="number"
                    dataKey="p0"
                    name="Tingkat Kemiskinan (P0)"
                    unit="%"
                    domain={[2, 14]}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    dataKey="within"
                    name="Theil Dalam-Wilayah"
                    domain={[0.06, 0.18]}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as typeof computedDistricts[0];
                        return (
                          <div className="bg-slate-950 text-white p-3 rounded-xs border border-slate-800 text-[11px] space-y-1 shadow-lg font-sans">
                            <p className="font-bold text-blue-400 border-b border-slate-800 pb-1 mb-1">{data.name}</p>
                            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                              {data.priorityLevel === 'Priority I' ? 'Prioritas I' :
                               data.priorityLevel === 'Priority II' ? 'Prioritas II' :
                               data.priorityLevel === 'Priority III' ? 'Prioritas III' : 'Prioritas IV'}
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
                              <span className="text-slate-400">Kemiskinan P0:</span>
                              <span className="font-mono font-bold text-white text-right">{data.p0}%</span>
                              <span className="text-slate-400">Theil Internal:</span>
                              <span className="font-mono font-bold text-white text-right">{data.within.toFixed(4)}</span>
                              <span className="text-slate-400">Skor Prioritas:</span>
                              <span className="font-mono font-bold text-white text-right">{data.priorityScore}</span>
                              <span className="text-slate-400">Tren:</span>
                              <span className="font-mono text-white text-right uppercase">
                                {data.trend === 'down' ? 'Membaik' : data.trend === 'up' ? 'Memburuk' : 'Stabil'}
                              </span>
                            </div>
                            <p className="text-[10px] text-blue-300 mt-2 border-t border-slate-800 pt-1 leading-relaxed">
                              {data.priorityLevel === 'Priority I' ? 'Optimalisasi BLT segera & penyediaan sanitasi dasar.' :
                               data.priorityLevel === 'Priority II' ? 'Penyelarasan infrastruktur jalan & elektrifikasi.' :
                               data.priorityLevel === 'Priority III' ? 'Penugasan tim audit registrasi bersasaran.' :
                               'Pemeliharaan jaring pengaman sosial & pemantauan standar.'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Dynamic averages reference lines dividing coordinates into 4 quadrants */}
                  <ReferenceLine x={averageP0} stroke="#94a3b8" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                  <ReferenceLine y={averageWithin} stroke="#94a3b8" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                  
                  <Scatter
                    name="Districts"
                    data={filteredDistricts}
                    onClick={(p) => p && p.payload && setSelectedDistrictId(p.payload.id)}
                  >
                    {filteredDistricts.map((entry, index) => {
                      const isSelected = selectedDistrictId === entry.id;
                      const fill = priorityColors[entry.priorityLevel].fill;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={fill}
                          stroke={isSelected ? '#000000' : 'none'}
                          strokeWidth={isSelected ? 3 : 0}
                          className="cursor-pointer transition-all duration-150 hover:scale-125"
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-sm border border-slate-100/30 dark:border-slate-900 mt-2">
            <HelpCircle className="h-4 w-4 text-blue-500 shrink-0" />
            <span>Klik titik tebar mana saja untuk menyelaraskan dengan Peta Koroplet dan memuat Profil Wilayah kabupaten/kota.</span>
          </div>
        </div>

        {/* Section 4: Interactive Choropleth Map */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 rounded-sm shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Map className="h-4 w-4 text-blue-500" />
                  Peta Koroplet Prioritas Terintegrasi
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Peta hubungan node geografis yang menampilkan kabupaten/kota di Jawa Barat berdasarkan Tingkat Prioritas aktif.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-sm font-bold">
                Proyeksi Peta: Survei {selectedYear}
              </div>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap gap-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-900 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                <span>Prioritas I (Sangat Tinggi)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                <span>Prioritas II (Struktural)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                <span>Prioritas III (Kantong)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span>Prioritas IV (Stabil)</span>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-72 w-full relative bg-slate-50/50 dark:bg-slate-900/10 border border-slate-50 dark:border-slate-900 rounded-xs flex items-center justify-center overflow-hidden z-0">
              <MapContainer 
                center={[-6.9204, 107.6046]} 
                zoom={7} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url={mode === 'dark'
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                  }
                />
                {geoData && geoData.features.map((feature: any) => {
                  const d = computedDistricts.find(dist => dist.name === feature.properties.name);
                  if (!d) return null;

                  const isSelected = selectedDistrictId === d.id;
                  const isHovered = hoveredDistrictId === d.id;
                  
                  return (
                    <GeoJSON
                      key={d.id}
                      data={feature}
                      style={{
                        color: isSelected ? '#3b82f6' : (mode === 'dark' ? '#334155' : '#cbd5e1'),
                        weight: isSelected ? 2.5 : (isHovered ? 2 : 1),
                        fillOpacity: isSelected ? 0.8 : (isHovered ? 0.6 : (mode === 'dark' ? 0.2 : 0.4)),
                        fillColor: priorityColors[d.priorityLevel].fill,
                        className: 'transition-all duration-300'
                      }}
                      eventHandlers={{
                        click: () => setSelectedDistrictId(d.id),
                        mouseover: () => setHoveredDistrictId(d.id),
                        mouseout: () => setHoveredDistrictId(null),
                      }}
                    >
                      <LeafletTooltip direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip" sticky>
                        <div className="bg-slate-950 text-white p-1.5 -m-1 rounded shadow-lg text-[11px] min-w-[140px]">
                          <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-xs text-blue-400">{d.name}</p>
                          <div className="font-mono space-y-0.5 mt-1">
                            <p className="flex justify-between gap-4 text-slate-300">
                              P0: <span className="text-white font-bold">{d.p0.toFixed(2)}%</span>
                            </p>
                            <p className="flex justify-between gap-4 text-slate-300">
                              Tipologi: <span className="text-white">Kuadran {d.typology}</span>
                            </p>
                          </div>
                        </div>
                      </LeafletTooltip>
                    </GeoJSON>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-sm border border-slate-100/30 dark:border-slate-900 mt-2">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <span>LAPISAN GIS: SUB_WILAYAH_JAWA_BARAT_KOROPLET • KANVAS PETA RESPONSIF</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Quadrant Summary Cards */}
      <div className="space-y-3" id="quadrant-summary-cards-section">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-2.5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
            <Target className="h-4 w-4 text-blue-500" />
            Kartu Kinerja & Strategi Kuadran
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Total sosial-ekonomi, dampak demografis, dan strategi khusus yang dihitung secara dinamis untuk setiap kohort prioritas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Priority I Card */}
          <div className={`p-5 rounded-sm border ${priorityColors['Priority I'].bg} ${priorityColors['Priority I'].border} flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider font-mono">
                  Prioritas I (Disparitas Ganda Ekstrem)
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              </div>
              <h4 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                {quadrantStats['Priority I'].count} <span className="text-xs text-slate-400 font-normal">Wilayah</span>
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                Penduduk: {formatNumber(quadrantStats['Priority I'].population)} jiwa
              </p>

              <div className="mt-3.5 pt-3.5 border-t border-rose-100 dark:border-rose-950/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Tingkat Kemiskinan:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority I'].avgP0.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Theil Internal:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority I'].avgWithin.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Skor Prioritas:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{quadrantStats['Priority I'].avgPriorityScore.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-950/60 p-2.5 rounded-xs border border-rose-100/40 dark:border-rose-950/40 text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              <span className="font-bold text-rose-700 dark:text-rose-400 block uppercase text-[8px] tracking-wider mb-0.5">Inti Strategi:</span>
              Salurkan bantuan sosial bersasaran (BLT) dan infrastruktur dasar langsung ke desa-desa dengan tingkat deprivasi tinggi.
            </div>
          </div>

          {/* Priority II Card */}
          <div className={`p-5 rounded-sm border ${priorityColors['Priority II'].bg} ${priorityColors['Priority II'].border} flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-mono">
                  Prioritas II (Struktural Seragam)
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
              </div>
              <h4 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                {quadrantStats['Priority II'].count} <span className="text-xs text-slate-400 font-normal">Wilayah</span>
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                Penduduk: {formatNumber(quadrantStats['Priority II'].population)} jiwa
              </p>

              <div className="mt-3.5 pt-3.5 border-t border-amber-100 dark:border-amber-950/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Tingkat Kemiskinan:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority II'].avgP0.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Theil Internal:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority II'].avgWithin.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Skor Prioritas:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{quadrantStats['Priority II'].avgPriorityScore.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-950/60 p-2.5 rounded-xs border border-amber-100/40 dark:border-amber-950/40 text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase text-[8px] tracking-wider mb-0.5">Inti Strategi:</span>
              Pembangunan konektivitas jalan makro skala kabupaten, jaringan air bersih perdesaan, dan elektrifikasi menyeluruh.
            </div>
          </div>

          {/* Priority III Card */}
          <div className={`p-5 rounded-sm border ${priorityColors['Priority III'].bg} ${priorityColors['Priority III'].border} flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider font-mono">
                  Prioritas III (Ketimpangan Kantong)
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
              </div>
              <h4 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                {quadrantStats['Priority III'].count} <span className="text-xs text-slate-400 font-normal">Wilayah</span>
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                Penduduk: {formatNumber(quadrantStats['Priority III'].population)} jiwa
              </p>

              <div className="mt-3.5 pt-3.5 border-t border-yellow-100 dark:border-yellow-950/40 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Tingkat Kemiskinan:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority III'].avgP0.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Theil Internal:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority III'].avgWithin.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Skor Prioritas:</span>
                  <span className="font-mono font-bold text-yellow-600 dark:text-yellow-400">{quadrantStats['Priority III'].avgPriorityScore.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-950/60 p-2.5 rounded-xs border border-yellow-100/40 dark:border-yellow-950/40 text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              <span className="font-bold text-yellow-700 dark:text-yellow-500 block uppercase text-[8px] tracking-wider mb-0.5">Inti Strategi:</span>
              Tugaskan tim audit kesalahan eksklusi di wilayah metropolitan yang makmur untuk menjangkau kantong-kantong kemiskinan yang tersembunyi.
            </div>
          </div>

          {/* Priority IV Card */}
          <div className={`p-5 rounded-sm border ${priorityColors['Priority IV'].bg} ${priorityColors['Priority IV'].border} flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono">
                  Prioritas IV (Pemantauan Stabil)
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <h4 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                {quadrantStats['Priority IV'].count} <span className="text-xs text-slate-400 font-normal">Wilayah</span>
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                Penduduk: {formatNumber(quadrantStats['Priority IV'].population)} jiwa
              </p>

              <div className="mt-3.5 pt-3.5 border-t border-emerald-100 dark:border-emerald-950/30 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Tingkat Kemiskinan:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority IV'].avgP0.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Theil Internal:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quadrantStats['Priority IV'].avgWithin.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rata-rata Skor Prioritas:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{quadrantStats['Priority IV'].avgPriorityScore.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-950/60 p-2.5 rounded-xs border border-emerald-100/40 dark:border-emerald-950/40 text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block uppercase text-[8px] tracking-wider mb-0.5">Inti Strategi:</span>
              Pertahankan status pemantauan, dorong jalur kerja formal, manfaatkan investasi swasta, dan pastikan efisiensi pajak.
            </div>
          </div>
        </div>
      </div>

      {/* CLICKED DISTRICT: Regional Profile Placeholder Panel (Drawer-like overlay card) */}
      <AnimatePresence>
        {selectedDistrictData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-sm p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
            id="district-profile-drawer"
          >
            <div className="space-y-3.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Placeholder Diagnostik Profil Wilayah Aktif
                </span>
                <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-wider font-mono ${priorityColors[selectedDistrictData.priorityLevel].badge}`}>
                  {selectedDistrictData.priorityLevel === 'Priority I' ? 'Prioritas I' :
                   selectedDistrictData.priorityLevel === 'Priority II' ? 'Prioritas II' :
                   selectedDistrictData.priorityLevel === 'Priority III' ? 'Prioritas III' : 'Prioritas IV'}
                </span>
                <span className="px-2 py-0.5 rounded-sm text-[8px] font-mono font-bold bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase">
                  {originalTypologyNames[selectedDistrictData.typology]}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <MapPin className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                  {selectedDistrictData.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  ID Statistik: <strong className="font-mono text-slate-600 dark:text-slate-300">{selectedDistrictData.id}</strong> • Wilayah: <strong className="text-slate-600 dark:text-slate-300 font-mono">{selectedDistrictData.region}</strong> • Penduduk: <strong className="text-slate-600 dark:text-slate-300 font-mono">{formatNumber(selectedDistrictData.population)} jiwa</strong>
                </p>
              </div>

              {/* Welfare indicators grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tingkat Kemiskinan (P0)</span>
                  <span className="text-sm font-mono font-bold mt-1 block text-slate-900 dark:text-white">{selectedDistrictData.p0}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Theil Internal</span>
                  <span className="text-sm font-mono font-bold mt-1 block text-slate-900 dark:text-white">{selectedDistrictData.within.toFixed(4)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Skor Prioritas</span>
                  <span className="text-sm font-mono font-bold mt-1 block text-rose-500">{selectedDistrictData.priorityScore}/100</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tren Aktif</span>
                  <span className="text-sm font-mono font-bold mt-1 block uppercase text-emerald-500 tracking-wider">
                    {selectedDistrictData.trend === 'down' ? '▼ membaik' : selectedDistrictData.trend === 'up' ? '▲ memburuk' : 'stabil'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto self-stretch md:self-auto justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-900 pt-4 md:pt-0 md:pl-6">
              <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/20 p-3 rounded-xs flex gap-2 w-full md:w-72">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-400">
                  <span className="font-bold block uppercase text-[8px] tracking-wider">Rekomendasi Kebijakan AI</span>
                  {selectedDistrictData.priorityLevel === 'Priority I' ? 'Ditandai untuk pembangunan infrastruktur sanitasi tambahan dan optimalisasi penyaluran bantuan sosial segera.' :
                   selectedDistrictData.priorityLevel === 'Priority II' ? 'Dialokasikan untuk peningkatan konektivitas jalan raya makro perdesaan dan pendorong produktivitas sektor utama.' :
                   selectedDistrictData.priorityLevel === 'Priority III' ? 'Ditandai untuk sinkronisasi data oleh tim audit kesalahan eksklusi keliling.' :
                   'Protokol pemantauan standar. Parameter kesejahteraan berada di dalam batas aman.'}
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem('selectedDistrictId', selectedDistrictData.id);
                  setSelectedDistrictId(selectedDistrictData.id);
                  navigateTo('regional-profile');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-sm bg-slate-950 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Analisis Mendalam di Dasbor Profil Wilayah
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 5: Priority Ranking Table */}
      <div className="space-y-4" id="priority-ranking-section">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-2.5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
            <FileSpreadsheet className="h-4 w-4 text-blue-500" />
            Peringkat Intervensi Prioritas
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Data sosial-ekonomi tingkat kabupaten/kota diurutkan berdasarkan Skor Prioritas untuk merumuskan daftar bantuan provinsi yang selaras.
          </p>
        </div>

        <DataTable
          columns={[
            {
              key: 'rank',
              header: 'Peringkat',
              render: (row) => {
                // Determine rank based on sorted priority scores descending in filtered list
                const sortedAll = [...computedDistricts].sort((a, b) => b.priorityScore - a.priorityScore);
                const idx = sortedAll.findIndex((x) => x.id === row.id);
                return <span className="font-bold text-slate-900 dark:text-white">#{idx + 1}</span>;
              },
            },
            { key: 'id', header: 'Kode BPS', sortable: true },
            { key: 'name', header: 'Kabupaten/Kota', sortable: true },
            {
              key: 'priorityScore',
              header: 'Skor Prioritas',
              sortable: true,
              render: (row) => (
                <div className="flex items-center gap-2">
                  <span className={`font-bold font-mono ${row.priorityScore >= 80 ? 'text-rose-500' : row.priorityScore >= 50 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {row.priorityScore}
                  </span>
                  <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0 hidden sm:block">
                    <div
                      className={`h-full ${row.priorityScore >= 80 ? 'bg-rose-500' : row.priorityScore >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                      style={{ width: `${row.priorityScore}%` }}
                    ></div>
                  </div>
                </div>
              ),
            },
            {
              key: 'priorityLevel',
              header: 'Kuadran Tipologi',
              sortable: true,
              render: (row) => (
                <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase font-mono border ${priorityColors[row.priorityLevel].badge}`}>
                  {row.priorityLevel === 'Priority I' ? 'Prioritas I' :
                   row.priorityLevel === 'Priority II' ? 'Prioritas II' :
                   row.priorityLevel === 'Priority III' ? 'Prioritas III' : 'Prioritas IV'}
                </span>
              ),
            },
            { key: 'p0', header: 'Kemiskinan P0 (%)', sortable: true, render: (row) => <span className="font-mono font-semibold">{row.p0}%</span> },
            { key: 'within', header: 'Theil Internal', sortable: true, render: (row) => <span className="font-mono">{row.within.toFixed(4)}</span> },
            {
              key: 'trend',
              header: 'Tren Kesejahteraan',
              sortable: true,
              render: (row) => (
                <span className={`font-mono font-bold uppercase text-[9px] ${row.trend === 'down' ? 'text-emerald-500' : row.trend === 'up' ? 'text-rose-500' : 'text-slate-400'}`}>
                  {row.trend === 'down' ? '▼ Membaik' : row.trend === 'up' ? '▲ Memburuk' : 'Stabil'}
                </span>
              ),
            },
            {
              key: 'program',
              header: 'Rekomendasi Program',
              render: (row) => (
                <span className="text-[10px] text-slate-500 font-sans font-medium">
                  {row.priorityLevel === 'Priority I' ? 'Audit Sasaran BLT + Sarana Sanitasi' :
                   row.priorityLevel === 'Priority II' ? 'Konektivitas Jalan Perdesaan + Kredit Tani' :
                   row.priorityLevel === 'Priority III' ? 'Tim Audit Eksklusi Lokal' :
                   'Pemantauan Standar & Jaring Pengaman Sosial'}
                </span>
              ),
            },
          ]}
          data={filteredDistricts}
          pageSize={8}
          enableExport={true}
          exportFileName={`West_Java_Typology_Rankings_${selectedYear}.csv`}
          onRowClick={(row) => setSelectedDistrictId(row.id)}
          selectedRowId={selectedDistrictId || undefined}
        />
      </div>

      {/* SECTION 6: Policy Recommendation Panel */}
      <div className="space-y-4" id="policy-recommendations-panel">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-2.5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-blue-500" />
            Panel Rekomendasi Kebijakan Spesifik Tipologi
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Rekomendasi dinamis dan algoritmik yang dirumuskan untuk masing-masing dari empat kuadran prioritas.
          </p>
        </div>

        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            {(['Priority I', 'Priority II', 'Priority III', 'Priority IV'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setActiveRecommendationTab(q)}
                className={`flex-1 text-center py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeRecommendationTab === q
                    ? 'border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-950 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`h-2 w-2 rounded-full`} style={{ backgroundColor: priorityColors[q].fill }}></span>
                  {q === 'Priority I' ? 'Prioritas I' : q === 'Priority II' ? 'Prioritas II' : q === 'Priority III' ? 'Prioritas III' : 'Prioritas IV'}
                </div>
              </button>
            ))}
          </div>

          {/* Recommendations Content */}
          <div className="p-6">
            {activeRecommendationTab === 'Priority I' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest font-mono">
                      Kuadran Sasaran: Kemiskinan tinggi & disparitas internal tinggi
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Prioritas I: Strategi Sasaran Kantong Lokal dengan Disparitas Ganda
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    Wilayah-wilayah ini sangat menantang. Wilayah ini memiliki tingkat kemiskinan agregat yang tinggi, namun tingkat kemiskinan tersebut sangat terkonsentrasi di lokasi tertentu. Ini berarti terdapat disparitas yang besar di dalam batas kabupaten/kota—wilayah berpendapatan tinggi berdampingan langsung dengan kantong kumuh yang sangat miskin. Bantuan umum yang seragam akan menciptakan kebocoran sasaran yang besar dan gagal menyelesaikan krisis lokal.
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Tujuan Kebijakan Utama:</strong>
                        Perlindungan sosial mikro bersasaran yang dikombinasikan dengan distribusi aset dasar tingkat kecamatan.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1 font-sans">Rekomendasi Program:</strong>
                        Realokasi bantuan tunai berbasis audit (optimalisasi BLT), penyediaan jaringan sanitasi/toilet umum lokal, dan klinik kesehatan keliling.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Target Penerima Manfaat:</strong>
                        10% penduduk termiskin (desil D1) di desa-desa tertinggal dan kumuh perkotaan yang telah dipetakan secara spesifik.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Instansi Penanggung Jawab:</strong>
                        Dinas Sosial, Dinas Kesehatan, Dinas Perumahan & Kawasan Permukiman (Disperkim) Jawa Barat.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-900 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between space-y-4 font-mono text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Jangka Waktu Pelaksanaan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">3 - 6 Bulan (Mendesak)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Perkiraan Dampak P0:</span>
                      <span className="font-bold text-emerald-500 font-bold">Penurunan -1,20% hingga -1,45%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Tingkat Keyakinan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">94% (Keyakinan Tinggi)</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-slate-400">Estimasi Biaya Provinsi:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Rp 12,4 Miliar (Pendamping)</span>
                    </div>
                  </div>

                  <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 p-3 rounded-sm">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-rose-700 dark:text-rose-400 font-mono mb-1">Peringatan Batas Kritis</p>
                    <p className="text-[10px] leading-relaxed font-sans font-medium text-slate-600 dark:text-slate-400">
                      Kebocoran sasaran di zona ini sangat rentan. Bappeda HARUS menerapkan verifikasi biometrik atau kartu tunai digital untuk mencegah penyalahgunaan dana bantuan yang dialokasikan di tingkat lokal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeRecommendationTab === 'Priority II' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest font-mono">
                      Kuadran Sasaran: Kemiskinan tinggi & disparitas internal rendah
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Prioritas II: Strategi Pembangunan Infrastruktur Makro Struktural Menyeluruh
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    Di kabupaten-kabupaten ini, kemiskinan bersifat seragam dan tersebar merata. Disparitas kesejahteraan internal rendah karena hampir seluruh penduduk berada dalam kondisi sosial-ekonomi yang serupa dan terbatas. Hal ini menunjukkan kurangnya pertumbuhan ekonomi regional, pusat industri, atau konektivitas fisik makro. Kebijakan mikro bersasaran akan berdampak minimal di sini; sebaliknya, pembangunan infrastruktur skala besar sangat diperlukan untuk mengangkat kapasitas ekonomi seluruh wilayah.
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Tujuan Kebijakan Utama:</strong>
                        Penyediaan konektivitas fisik secara masif dan pendorong produktivitas pertanian perdesaan.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1 font-sans">Rekomendasi Program:</strong>
                        Pembangunan jalan raya perdesaan, mikro-kredit pertanian, jaringan listrik utama, dan pipa irigasi bertenaga surya.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Target Penerima Manfaat:</strong>
                        Petani gurem, rumah tangga perdesaan, dan kelompok tenaga kerja wilayah pinggiran.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Instansi Penanggung Jawab:</strong>
                        Dinas Bina Marga dan Penataan Ruang (PUPR), Dinas Tanaman Pangan dan Hortikultura (Pertanian), Dinas Energi dan Sumber Daya Mineral (ESDM).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-900 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between space-y-4 font-mono text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Jangka Waktu Pelaksanaan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">12 - 24 Bulan (Jangka Menengah)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Perkiraan Dampak P0:</span>
                      <span className="font-bold text-emerald-500 font-bold">Penurunan -2,10% hingga -2,80%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Tingkat Keyakinan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">88% (Sedang-Tinggi)</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-slate-400">Estimasi Biaya Provinsi:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Rp 48,2 Miliar (Pendamping)</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/40 p-3 rounded-sm">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-500 font-mono mb-1">Batasan Pendanaan Pendamping Provinsi</p>
                    <p className="text-[10px] leading-relaxed font-sans font-medium text-slate-600 dark:text-slate-400">
                      Proyek-proyek ini memerlukan pendanaan pendamping multi-tahun yang substansial. Anggaran kabupaten/kota harus diselaraskan dengan rencana induk pembangunan (blueprints) Dinas PUPR Provinsi.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeRecommendationTab === 'Priority III' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest font-mono">
                      Kuadran Sasaran: Kemiskinan rendah & disparitas internal tinggi
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Prioritas III: Strategi Audit Eksklusi Ketimpangan Kantong
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    Wilayah-wilayah ini secara umum sangat makmur, dengan tingkat kemiskinan rata-rata yang rendah. Namun, terdapat kantong-kantong kemiskinan lokal yang sangat kontras di dalamnya. Karena statistik tingkat kabupaten tampak ideal, penduduk miskin di wilayah ini sering kali terlewat oleh program bantuan konvensional Bappeda. Hal ini menunjukkan tingginya angka kesalahan eksklusi (exclusion error), di mana pembangunan kota yang cepat mengesampingkan pendatang baru atau kelompok rentan.
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Tujuan Kebijakan Utama:</strong>
                        Registrasi bersasaran, perlindungan pendidikan formal, dan penyelarasan pelatihan kejuruan lokal.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1 font-sans">Rekomendasi Program:</strong>
                        Unit keliling penyelarasan identitas (Disdukcapil), subsidi biaya pendidikan sekolah menengah, dan kuota lapangan kerja khusus untuk kawasan kumuh.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Target Penerima Manfaat:</strong>
                        Pendatang di pemukiman liar yang belum terdaftar, remaja usia sekolah di kecamatan pinggiran.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Instansi Penanggung Jawab:</strong>
                        Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil), Dinas Pendidikan, Dinas Tenaga Kerja dan Transmigrasi (Disnakertrans).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-900 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between space-y-4 font-mono text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Jangka Waktu Pelaksanaan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">6 - 12 Bulan (Pendek-Menengah)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Perkiraan Dampak P0:</span>
                      <span className="font-bold text-emerald-500 font-bold">Penurunan -0,65% hingga -0,90%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Tingkat Keyakinan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">91% (Keyakinan Tinggi)</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-slate-400">Estimasi Biaya Provinsi:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Rp 4,8 Miliar (Pendamping)</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50/60 dark:bg-yellow-950/15 border border-yellow-100 dark:border-yellow-900/40 p-3 rounded-sm">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-yellow-700 dark:text-yellow-500 font-mono mb-1">Persyaratan Penyelarasan Data</p>
                    <p className="text-[10px] leading-relaxed font-sans font-medium text-slate-600 dark:text-slate-400">
                      Memerlukan sinkronisasi basis data yang kuat dengan DTKS dan dinas kependudukan guna mencatat kantong-kantong kemiskinan yang tidak terdaftar di perbatasan kota.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeRecommendationTab === 'Priority IV' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
                      Kuadran Sasaran: Kemiskinan rendah & disparitas internal rendah
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Prioritas IV: Pemantauan Stabil & Strategi Pemberdayaan Pasar
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    Ini adalah wilayah administratif dengan kinerja terbaik di Jawa Barat. Rasio kemiskinan rendah dan pembangunan sosial-ekonomi relatif merata serta luas. Tidak ada krisis aktif di sini. Bappeda sebaiknya tidak mengalokasikan dana bantuan pendamping provinsi dalam jumlah besar ke zona ini guna menghindari biaya peluang (opportunity cost) yang tinggi bagi wilayah lain. Fokus utama adalah menjaga stabilitas investasi dan memastikan berjalannya jaring pengaman sosial standar.
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Tujuan Kebijakan Utama:</strong>
                        Ekspansi sektor swasta, efisiensi audit pajak, dan pemantauan standar tingkat kesejahteraan dasar.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1 font-sans">Rekomendasi Program:</strong>
                        Kemudahan perizinan investasi, integrasi layanan digital kota pintar (smart city), obligasi daerah, dan jaringan bursa kerja.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Target Penerima Manfaat:</strong>
                        Pekerja sektor formal, perusahaan teknologi swasta, dan usaha mikro.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-slate-100 dark:border-slate-900">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1">Instansi Penanggung Jawab:</strong>
                        Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP), Dinas Koperasi dan Usaha Kecil Menengah (KUKM), Badan Pendapatan Daerah (Bapenda) Jawa Barat.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-900 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between space-y-4 font-mono text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Jangka Waktu Pelaksanaan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">Pemantauan Standar (Berkelanjutan)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Perkiraan Dampak P0:</span>
                      <span className="font-bold text-slate-500 font-bold">Baseline Stabil (0,00% perubahan)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-2">
                      <span className="text-slate-400">Tingkat Keyakinan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">96% (Prakiraan Stabil)</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-slate-400">Estimasi Biaya Provinsi:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Anggaran operasional standar</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 p-3 rounded-sm">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-emerald-700 dark:text-emerald-500 font-mono mb-1">Saran Efisiensi Anggaran</p>
                    <p className="text-[10px] leading-relaxed font-sans font-medium text-slate-600 dark:text-slate-400">
                      JANGAN mengalokasikan dana bantuan keuangan pendamping di sini. Alihkan surplus dana ke zona Prioritas I & II untuk memaksimalkan pengurangan kemiskinan agregat di tingkat provinsi.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 7: Statistical Distribution */}
      <div className="space-y-4" id="statistical-distribution-section">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-2.5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Grafik Distribusi Statistik Kuadran
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Analisis kuantitatif yang membandingkan jumlah wilayah, jejak demografi, tingkat kemiskinan, dan disparitas internal di keempat kohort prioritas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: District Count */}
          <ChartContainer title="Jumlah Sebaran Kabupaten/Kota per Kuadran" subtitle="Menunjukkan jumlah wilayah administratif yang dikelompokkan di setiap kuadran prioritas.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '4px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="Jumlah Kabupaten/Kota" fill="#3b82f6" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[entry.name === 'Prioritas I' ? 'Priority I' : entry.name === 'Prioritas II' ? 'Priority II' : entry.name === 'Prioritas III' ? 'Priority III' : 'Priority IV'].fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Chart 2: Population Affected */}
          <ChartContainer title="Total Populasi Terdampak per Kuadran (Juta)" subtitle="Mengkuantifikasi jejak demografis dari setiap kohort prioritas sosial-ekonomi.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '4px', border: 'none', color: '#fff', fontSize: '11px' }} formatter={(v) => [`${v} Juta`, 'Populasi']} />
                <Bar dataKey="Populasi (Juta)" fill="#10b981" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[entry.name === 'Prioritas I' ? 'Priority I' : entry.name === 'Prioritas II' ? 'Priority II' : entry.name === 'Prioritas III' ? 'Priority III' : 'Priority IV'].fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Chart 3: Average Poverty Rate */}
          <ChartContainer title="Rata-rata Tingkat Kemiskinan per Kuadran (%)" subtitle="Membandingkan tolok ukur intensitas kemiskinan antar kuadran.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} domain={[0, 15]} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '4px', border: 'none', color: '#fff', fontSize: '11px' }} formatter={(v) => [`${v}%`, 'Rata-rata Tingkat Kemiskinan']} />
                <Bar dataKey="Rata-rata Tingkat Kemiskinan (%)" fill="#f59e0b" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[entry.name === 'Prioritas I' ? 'Priority I' : entry.name === 'Prioritas II' ? 'Priority II' : entry.name === 'Prioritas III' ? 'Priority III' : 'Priority IV'].fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Chart 4: Average Within Contribution */}
          <ChartContainer title="Rata-rata Kontribusi Disparitas Theil Dalam Wilayah" subtitle="Menyoroti margin ketimpangan internal di seluruh kuadran prioritas.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} domain={[0.05, 0.18]} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '4px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="Rata-rata Kontribusi Disparitas" fill="#84cc16" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[entry.name === 'Prioritas I' ? 'Priority I' : entry.name === 'Prioritas II' ? 'Priority II' : entry.name === 'Prioritas III' ? 'Priority III' : 'Priority IV'].fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* SECTION 8: Analytical Narrative (Government Executive Summary) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-6 rounded-sm shadow-xs space-y-5" id="analytical-narrative-section">
        <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-900 pb-3">
          <FileText className="h-4.5 w-4.5 text-blue-500" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            Laporan Naratif Eksekutif Resmi Bappeda
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-wider border-l-2 border-slate-900 dark:border-slate-200 pl-2">
              1. Situasi Terkini & Pola Spasial
            </h4>
            <p>
              Berdasarkan audit statistik tahun {selectedYear}, lanskap kesejahteraan Jawa Barat terus menunjukkan pengelompokan geografis yang signifikan. Koridor pesisir selatan (Kabupaten Tasikmalaya, Garut, Sukabumi, dan Cianjur) secara konsisten berada di sektor kemiskinan tinggi-disparitas tinggi dalam matriks kami. Hal ini menunjukkan pola disparitas ganda yang jelas: kantong-kantong pembangunan perdesaan yang intensif dikelilingi oleh kemiskinan agraris yang luas.
            </p>
            <p>
              Sebaliknya, koridor industri utara (Karawang, Bekasi, Purwakarta) menunjukkan rata-rata tingkat kemiskinan yang lebih rendah. Namun, wilayah-wilayah ini menunjukkan skor disparitas dalam wilayah yang cukup tinggi, menempatkannya ke dalam Prioritas III. Hal ini menunjukkan bahwa industrialisasi yang digerakkan perkotaan menciptakan kantong kekayaan lokal tetapi gagal mencakup kecamatan pinggiran, sehingga menyebabkan tingginya angka eksklusi di zona tersebut.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-wider border-l-2 border-slate-900 dark:border-slate-200 pl-2">
              2. Wilayah Prioritas & Temuan Kunci
            </h4>
            <p>
              Hambatan utama kebijakan terpusat pada <strong className="text-slate-900 dark:text-slate-100 font-bold">{quadrantStats['Priority I'].count} kabupaten/kota Prioritas I</strong>, yang menjadi tempat tinggal bagi sekitar <strong className="text-slate-900 dark:text-slate-100">{(quadrantStats['Priority I'].population / 1000000).toFixed(2).replace('.', ',')} juta jiwa</strong>. Wilayah-wilayah ini memiliki tingkat kemiskinan (P0) yang jauh melampaui ambang batas provinsi ({averageP0.toFixed(2).replace('.', ',')}%), dan indeks disparitas internalnya sangat tinggi. Temuan kunci menunjukkan bahwa utilitas dasar (khususnya jaringan air bersih dan jamban layak) berkontribusi hingga <strong className="text-slate-900 dark:text-slate-100">42% dari skor kemiskinan multidimensi</strong> di wilayah ini.
            </p>
            <p>
              Model pembelajaran mesin kami menunjukkan bahwa kesalahan sasaran (seperti kebocoran inklusi) sangat terpusat di wilayah Priangan timur dan barat bagian selatan. Audit register sosial manual oleh petugas kecamatan secara historis menyebabkan margin kebocoran sasaran hingga <strong className="text-slate-900 dark:text-slate-100">11,8%</strong>, yang berarti sejumlah bantuan kesejahteraan salah dialokasikan kepada rumah tangga yang tidak memenuhi syarat.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-wider border-l-2 border-slate-900 dark:border-slate-200 pl-2">
              3. Tindakan Provinsi & Kebutuhan Pemantauan Masa Depan
            </h4>
            <p>
              Bappeda merekomendasikan untuk segera menyelaraskan alokasi belanja bantuan keuangan provinsi Triwulan III-IV tahun {selectedYear} dengan tingkat prioritas yang dipetakan pada halaman ini. Dana pendamping harus dibatasi: 60% dari seluruh bantuan keuangan wajib dialokasikan secara ketat ke kabupaten/kota Prioritas I & II untuk mendanai infrastruktur fisik dasar. Pendanaan untuk wilayah Prioritas IV harus dibatasi hanya untuk pemeliharaan standar.
            </p>
            <p>
              Pemantauan di masa depan harus memprioritaskan integrasi matriks keputusan dinamis ini secara langsung dengan basis data DTKS. Pembaruan dua mingguan pada pemadanan Nomor Induk Kependudukan (NIK) di wilayah Prioritas III wajib dilakukan untuk menghapus kesalahan eksklusi yang tinggi. Dasbor pemantauan Bappeda harus melaksanakan pelacakan triwulanan terhadap kemajuan infrastruktur di koridor selatan untuk menjaga keselarasan dengan target RPJMD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
