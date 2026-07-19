import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Sliders,
  Table,
  CheckCircle2,
  FileSpreadsheet,
  Terminal,
  ShieldCheck,
  AlertOctagon,
  TrendingDown,
  Coins,
  Settings as SettingsIcon,
} from 'lucide-react';

import { useNavigationStore } from '../../store/navigationStore.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { maskName, maskNIK, formatPercentage, formatRupiah } from '../../utils/format.ts';

// UI Reusable Components
import { PageHeader } from '../ui/PageHeader.tsx';
import { KpiCard } from '../ui/KpiCard.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import { DataTable } from '../ui/DataTable.tsx';
import { Skeleton, KpiSkeleton, ChartSkeleton } from '../ui/Skeleton.tsx';
import { Loading } from '../ui/Loading.tsx';
import { EmptyState } from '../ui/EmptyState.tsx';
import { ErrorState } from '../ui/ErrorState.tsx';
import { AlertCard } from '../ui/AlertCard.tsx';
import { RecommendationCard } from '../ui/RecommendationCard.tsx';
import { FilterPanel, FilterOption } from '../ui/FilterPanel.tsx';
import { SearchBar } from '../ui/SearchBar.tsx';
import { ExportButton } from '../ui/ExportButton.tsx';
import { Modal } from '../ui/Modal.tsx';
import { Drawer } from '../ui/Drawer.tsx';
import { GlobalFilterBar } from '../ui/GlobalFilterBar.tsx';
import { DemoControlCenter } from '../ui/DemoControlCenter.tsx';

// Interactive Analytics & Charting Modules
import { InteractiveMap } from '../analytics/InteractiveMap.tsx';
import { TheilTrendChart, PovertyTrendCard, TheilDecompositionCard } from '../analytics/TheilTrendChart.tsx';
import { KlassenScatterPlot } from '../analytics/KlassenScatterPlot.tsx';
import { DeprivationRadarChart } from '../analytics/DeprivationRadarChart.tsx';
import { FanTrajectoryChart } from '../analytics/FanTrajectoryChart.tsx';
import { FiscalSimulator } from '../analytics/FiscalSimulator.tsx';

// Government Decision Intelligence Modules
import { GovernmentDashboardHero } from '../analytics/GovernmentDashboardHero.tsx';
import { ExecutiveKpiSummary } from '../analytics/ExecutiveKpiSummary.tsx';
import { AiPolicyInsight } from '../analytics/AiPolicyInsight.tsx';
import { ExecutivePriorityRanking } from '../analytics/ExecutivePriorityRanking.tsx';
import { ExecutiveNarrativeCards } from '../analytics/ExecutiveNarrativeCards.tsx';
import { ExecutiveAlerts } from '../analytics/ExecutiveAlerts.tsx';
import RegionalDiagnosisPage from './RegionalDiagnosisPage.tsx';
import RegionalTypologyPage from './RegionalTypologyPage.tsx';
import RegionalProfilePage from './RegionalProfile.tsx';
import HouseholdTargetingPage from './HouseholdTargetingPage.tsx';
import MlEvaluationPage from './MlEvaluationPage.tsx';
import PolicyRecommendationPage from './PolicyRecommendationPage.tsx';
import MonitoringCenterPage from './MonitoringCenterPage.tsx';
import GovernancePage from './GovernancePage.tsx';

// Audited microdata repository (PDP Compliant)
const HOUSEHOLDS_DATA = [
  {
    id: 'HH-320412-0081',
    name: 'Ahmad Subarjo',
    nik: '3204121204850001',
    decile: 'D1 (Termiskin)',
    pmt: '12.11',
    wall: 'Kayu Albasia (Rentan)',
    floor: 'Tanah Liat (Rentan)',
    water: 'Mata Air Pedesaan Tidak Terlindungi (Rentan)',
    size: '5 Anggota',
    dependents: '3 Anak, 1 Lansia'
  },
  {
    id: 'HH-320412-1102',
    name: 'Cucum Cahyani',
    nik: '3204125809790002',
    decile: 'D1 (Termiskin)',
    pmt: '14.88',
    wall: 'Anyaman Bambu (Rentan)',
    floor: 'Bilah Bambu (Rentan)',
    water: 'Sumur Gali Dangkal Terbuka (Rentan)',
    size: '4 Anggota',
    dependents: '2 Anak, 1 Penyandang Disabilitas'
  },
  {
    id: 'HH-320412-1422',
    name: 'Dadang Kurnia',
    nik: '3204122302820001',
    decile: 'D2',
    pmt: '19.34',
    wall: 'Bata Plester (Layak)',
    floor: 'Plesteran Semen (Layak)',
    water: 'Mata Air Tidak Terlindungi (Rentan)',
    size: '6 Anggota',
    dependents: '4 Anak'
  },
  {
    id: 'HH-320412-2911',
    name: 'Emin Maemunah',
    nik: '3204124403860003',
    decile: 'D2',
    pmt: '21.05',
    wall: 'Bata Plester (Layak)',
    floor: 'Ubin Keramik (Layak)',
    water: 'Sumur Bor Terlindungi (Layak)',
    size: '3 Anggota',
    dependents: '1 Anak, 1 Lansia'
  }
];

const DEFAULT_EWS_ALERTS = [
  { id: 'alt_01', title: 'Deteksi Lonjakan Tajam P0', message: 'Tingkat headcount Kabupaten Tasikmalaya melampaui batas aman 12,0%.', severity: 'error' },
  { id: 'alt_02', title: 'Pergeseran Sasaran Inklusi', message: 'Daftar kesejahteraan Garut D1 menunjukkan kesalahan deviasi sasaran +3,8%.', severity: 'warning' },
  { id: 'alt_03', title: 'Pemberitahuan Kalibrasi', message: 'Bobot model machine learning PMT memerlukan kalibrasi ulang Triwulan IV.', severity: 'info' }
];

function PageTransitionLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4">
      {/* Top indicator progress bar */}
      <div className="h-1 bg-blue-600/10 w-full rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 w-1/3 rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950/40">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950/40">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950/40">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950/40 h-64 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-end gap-3 h-40 pt-4 pl-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="w-full bg-slate-100 dark:bg-slate-900 rounded-t-sm"
                style={{ height: `${20 + (idx * 12)}%` }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950/40 h-64 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-end gap-3 h-40 pt-4 pl-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="w-full bg-slate-100 dark:bg-slate-900 rounded-t-sm"
                style={{ height: `${80 - (idx * 10)}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full rounded-sm border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-950/40 overflow-hidden p-6 space-y-4">
        <Skeleton className="h-5 w-1/4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

export function SandboxPage() {
  const { currentScreen, navigateBack, navigateTo } = useNavigationStore();
  const { user } = useAuth();

  // Scroll Restoration Engine
  const scrollPositions = useRef<Record<string, number>>({});
  const prevScreenRef = useRef<string>(currentScreen);

  useEffect(() => {
    const container = document.getElementById('main-workspace-scroll');
    if (!container) return;

    // Capture the current scroll position of the screen we are leaving
    const prevScreen = prevScreenRef.current;
    if (prevScreen) {
      scrollPositions.current[prevScreen] = container.scrollTop;
    }

    // Restore or reset the scroll position of the screen we are entering
    const timer = setTimeout(() => {
      const savedPosition = scrollPositions.current[currentScreen];
      if (savedPosition !== undefined) {
        container.scrollTop = savedPosition;
      } else {
        container.scrollTop = 0;
      }
      prevScreenRef.current = currentScreen;
    }, 100);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  // Global Keyboard Shortcuts Engine
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut keydowns if user is typing in form controls
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          activeEl.getAttribute('contenteditable') === 'true'
        ) {
          return;
        }
      }

      // 1. Backspace -> Navigate Back
      if (e.key === 'Backspace') {
        e.preventDefault();
        navigateBack();
        return;
      }

      // 2. Escape -> Close Modals/Drawers
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsDrawerOpen(false);
        return;
      }

      // 3. Alt + [1-9] -> Quick Screen Jumps
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const screens: Record<string, string> = {
          '1': 'dashboard',
          '2': 'diagnosis',
          '3': 'typology',
          '4': 'regional-profile',
          '5': 'household',
          '6': 'ml-evaluation',
          '7': 'recommendation',
          '8': 'monitoring',
          '9': 'administration',
        };
        const target = screens[e.key];
        if (target) {
          navigateTo(target as any);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateBack, navigateTo]);

  // Component states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | number | undefined>(undefined);
  const [filterValues, setFilterValues] = useState<Record<string, string | number>>({
    year: '2026',
    region: 'ALL',
  });
  const [activeTab, setActiveTab] = useState('active-component');
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  // EWS Alerts dynamic state (Simulating server-side fetch query via Express api)
  const [ewsAlerts, setEwsAlerts] = useState<any[]>(DEFAULT_EWS_ALERTS);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);

  // Load Alerts from Backend on Dashboard / Monitoring screen to test full-stack APIs
  useEffect(() => {
    if (currentScreen === 'dashboard' || currentScreen === 'monitoring') {
      setIsAlertsLoading(true);
      fetch('/api/monitoring/alerts')
        .then((res) => {
          if (!res.ok) throw new Error('Offline');
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setEwsAlerts(data);
          } else {
            setEwsAlerts(DEFAULT_EWS_ALERTS);
          }
          setIsAlertsLoading(false);
        })
        .catch(() => {
          setEwsAlerts(DEFAULT_EWS_ALERTS);
          setIsAlertsLoading(false);
        });
    }
  }, [currentScreen]);

  // Handle local filter panel changing
  const handleFilterChange = (key: string, value: string | number) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({ year: '2026', region: 'ALL' });
  };

  // Shared Filters Definition
  const filterDefinitions: FilterOption[] = [
    {
      key: 'year',
      label: 'Tahun Evaluasi Sasaran',
      options: [
        { label: 'Tahun Basis 2026', value: '2026' },
        { label: 'Retrospektif 2025', value: '2025' },
        { label: 'Retrospektif 2024', value: '2024' },
      ],
    },
    {
      key: 'region',
      label: 'Cakupan Administratif',
      options: [
        { label: 'Seluruh Provinsi (Jawa Barat)', value: 'ALL' },
        { label: 'Wilayah Priangan', value: 'PRIANGAN' },
        { label: 'Wilayah Cirebon', value: 'CIREBON' },
        { label: 'Wilayah Bogor-Bekasi', value: 'BOGOR' },
      ],
    },
  ];

  // Filtering data logic
  const filteredDistricts = WEST_JAVA_DISTRICTS.filter((d) => {
    // Search Filter
    if (searchQuery) {
      return d.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    // Region Filter
    if (filterValues.region !== 'ALL') {
      return d.region === filterValues.region;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Demo walkthrough and presentation mode suite */}
      <DemoControlCenter />

      {/* Dynamic Header */}
      <PageHeader
        title={getScreenTitle(currentScreen)}
        description={getScreenDescription(currentScreen)}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => navigateBack()}
              className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Modal Interaktif
            </button>
          </div>
        }
      />

      {/* Global Synchronized Filters Panel */}
      <GlobalFilterBar />

      {/* Tabs Layout: Component Render preview vs Figma Blueprint Details */}
      <div className="border-b border-slate-100 dark:border-slate-900 flex gap-4">
        <button
          onClick={() => setActiveTab('active-component')}
          className={`pb-2.5 text-xs font-bold uppercase tracking-wider relative transition-colors ${
            activeTab === 'active-component'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Tampilan Sandbox Komponen
        </button>
        <button
          onClick={() => setActiveTab('figma-blueprint')}
          className={`pb-2.5 text-xs font-bold uppercase tracking-wider relative transition-colors ${
            activeTab === 'figma-blueprint'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Spesifikasi Cetak Biru Figma
        </button>
      </div>

      {activeTab === 'active-component' ? (
        isPageLoading ? (
          <PageTransitionLoading />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Dynamic page specific previews */}
          {currentScreen === 'dashboard' && (
            <div className="space-y-8">
              {/* 1. Hero (Decision Index & Platform Brief) */}
              <GovernmentDashboardHero />

              {/* 2. Executive KPI Summary (With Sparklines and Policy Implications) */}
              <ExecutiveKpiSummary />

              {/* 2b. Executive Narrative Briefs (Current Situation, Risk, Highest Priority, Improvement, Critical Indicator) */}
              <ExecutiveNarrativeCards />

              {/* 3. AI Policy Insight Panel (Dynamic survey memos) */}
              <AiPolicyInsight evaluationYear={String(filterValues.year)} />

              {/* 4. Interactive GIS Choropleth Map of West Java (Zoom, Pan, click redirection support) */}
              <InteractiveMap />

              {/* 5. Theil Decomposition (Within-district disparities) */}
              <TheilDecompositionCard />

              {/* 6. Poverty Trend (Headcount trajectory vs Theil index) */}
              <PovertyTrendCard />

              {/* 7. Regional Priority Ranking Table (Top 10 Districts, sorting support) */}
              <ExecutivePriorityRanking />

              {/* 8. Algorithmic Policy Recommendations Catalog */}
              <div className="space-y-4" id="policy-recommendations-section">
                <div className="border-b border-slate-50 dark:border-slate-900 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                    Katalog Intervensi Kebijakan Algoritmik Pemerintah
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Intervensi terarah yang terhubung secara empiris yang dirumuskan oleh model machine learning untuk mengoptimalkan keselarasan fiskal provinsi.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <RecommendationCard
                    title="Optimalkan distribusi kesalahan sasaran BLT untuk desil D1 Sukabumi"
                    description="Alokasikan kembali Bantuan Langsung Tunai (BLT) menggunakan metrik klasifikasi PMT Gradient Boosting, mengalirkan margin kebocoran langsung ke desil rumah tangga termiskin yang tervalidasi."
                    impact="Rasio headcount P0 berkurang sebesar 1,2%"
                    cost={1200000000}
                    timeline="Triwulan III-IV 2026"
                    agency="Dinas Sosial Provinsi Jawa Barat"
                    confidence={0.94}
                    priority="HIGH"
                    evidence="Audit mikrodata BPS Sukabumi mengidentifikasi kebocoran inklusi tinggi sebesar 11,8% pada daftar manual."
                    onAction={() => setIsModalOpen(true)}
                  />

                  <RecommendationCard
                    title="Terapkan injeksi jaringan air pedesaan di kantong tertinggal Tasikmalaya"
                    description="Laksanakan intervensi deprivasi multi-dimensi terarah di kecamatan Kategori IV, membangun sumur bor publik yang aman dan sambungan air mikro."
                    impact="Intensitas Deprivasi turun (-3,2 poin)"
                    cost={3400000000}
                    timeline="Triwulan I-II 2027"
                    agency="Dinas PUPR Provinsi Jawa Barat"
                    confidence={0.91}
                    priority="HIGH"
                    evidence="Profil radar deprivasi menyoroti defisit akses air sebesar 42,1% di Kabupaten Tasikmalaya."
                    onAction={() => setIsModalOpen(true)}
                  />

                  <RecommendationCard
                    title="Luncurkan regu pencocokan identitas digital seluler di Garut & Kuningan"
                    description="Kerahkan kendaraan Bappeda yang dilengkapi dengan konektivitas satelit aman untuk mendaftarkan rumah tangga termiskin yang belum terdaftar di permukiman terpencil Priangan Timur."
                    impact="Kesalahan eksklusi berkurang sebesar 2,8%"
                    cost={650000000}
                    timeline="6 Bulan"
                    agency="Disdukcapil Provinsi Jawa Barat"
                    confidence={0.88}
                    priority="MEDIUM"
                    evidence="Daftar pencatatan sipil yang usang menyebabkan kesalahan eksklusi sebesar 8,7% di permukiman pedesaan selatan."
                    onAction={() => setIsModalOpen(true)}
                  />
                </div>
              </div>

              {/* 9. Early Warning Active Alerts Feed */}
              <ExecutiveAlerts />
            </div>
          )}

          {currentScreen === 'diagnosis' && (
            <RegionalDiagnosisPage />
          )}

          {currentScreen === 'typology' && (
            <RegionalTypologyPage />
          )}

          {currentScreen === 'regional-profile' && (
            <RegionalProfilePage />
          )}

          {currentScreen === 'household' && (
            <HouseholdTargetingPage />
          )}

          {currentScreen === 'ml-evaluation' && (
            <MlEvaluationPage />
          )}

          {currentScreen === 'recommendation' && (
            <PolicyRecommendationPage />
          )}

          {currentScreen === 'monitoring' && (
            <MonitoringCenterPage />
          )}

          {currentScreen === 'administration' && (
            <GovernancePage />
          )}

          {currentScreen === 'settings' && (
            <div className="max-w-xl mx-auto p-6 border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 rounded-sm space-y-6 text-xs shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-900 pb-3">
                <SettingsIcon className="h-4 w-4 text-slate-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Personalisasi Sistem</h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Bahasa Antarmuka Visual</label>
                  <select className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs">
                    <option>Bahasa Indonesia (ID) - Standar</option>
                    <option>English (US)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Notifikasi Peringatan Ter-audit</label>
                  <div className="space-y-2 pt-1 font-medium">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded-xs" />
                      <span>Kirim notifikasi email saat pemicu peringatan EWS kritis aktif</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded-xs" />
                      <span>Pembaruan sinkronisasi log yang diaudit</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full text-center py-2 bg-slate-950 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 text-white font-bold rounded-sm uppercase tracking-wide"
              >
                Simpan Pengaturan
              </button>
            </div>
          )}
          </div>
        )
      ) : (
        <div className="p-6 border border-slate-100 bg-slate-50/50 dark:border-slate-900 dark:bg-slate-950/20 rounded-sm font-mono text-xs space-y-4 leading-relaxed animate-in fade-in duration-300">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Spesifikasi Cetak Biru Figma UI & Indeks Terjemahan
          </h4>
          <div className="space-y-3 font-sans text-slate-600 dark:text-slate-400 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 rounded-sm">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] block mb-1">
                  Bingkai Tata Letak Kisi Desktop (1440px)
                </span>
                Navigasi bilah sisi diatur tetap pada 256px (`w-64`). Bilah navigasi atas dikunci pada tinggi 64px (`h-16`). Konten utama halaman dalam berpusat pada kisi 12 kolom yang dinamis (`margin = 24px, gap = 24px`).
              </div>

              <div className="p-4 border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 rounded-sm">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] block mb-1">
                  Pengikatan Tipografi
                </span>
                Judul Tampilan dipadukan dengan font Inter dengan ketebalan 600. Nilai numerik menggunakan Outfit. Metadata, log, stempel waktu, dan indikator kepatuhan diikat ke JetBrains Mono untuk keterbacaan yang optimal.
              </div>
            </div>

            <div className="p-4 border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 rounded-sm">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] block mb-1">
                Hierarki Visual & Kepadatan Desain
              </span>
              Hindari gradasi berlebihan atau bentuk bulat seperti balon. Kartu menggunakan batas garis tipis abu-abu standar dengan latar belakang putih rata atau abu-abu gelap. Tombol berbentuk blok geometris tegas untuk memastikan kredibilitas otoritas pemerintah.
            </div>
          </div>
        </div>
      )}

      {/* Reusable Modal Preview */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pusat Verifikasi Analitis RANCAGE"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 rounded-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-xs font-semibold"
            >
              Tutup Jendela
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                alert('Tindakan berhasil dicatat di bawah ID Audit PDP: ' + Math.random().toString(36).substring(2, 9));
              }}
              className="px-4 py-1.5 rounded-sm bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"
            >
              Verifikasi & Setujui Tindakan
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-2 border border-blue-100 bg-blue-50/20 text-[10px] font-mono text-blue-800 dark:border-blue-950 dark:bg-blue-950/20 dark:text-blue-400 p-3 rounded-sm">
            <Terminal className="h-4 w-4 shrink-0 mt-0.5" />
            <span>GERBANG KEAMANAN TERSERTIFIKASI AKTIF. SEMUA PENGAJUAN DIINTEGRASIKAN KE LOG PEMANTAUAN SISTEM.</span>
          </div>
          <p className="text-xs">
            Modal ini mendemonstrasikan dialog overlay responsif kami yang modular dan sesuai dengan standar aksesibilitas WCAG. Secara standar, modal ini memiliki penanganan fokus, pendengar tombol Esc untuk menutup, dan konfigurasi kaki tata letak yang dapat disesuaikan.
          </p>
        </div>
      </Modal>

      {/* Reusable Sliding Drawer Preview */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Pemeriksaan Mendalam Kesejahteraan Rumah Tangga"
        footer={
          <div className="flex justify-between items-center w-full">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none">
              Sesi Diaudit UU PDP • Tautan Aman
            </span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-1.5 rounded-sm bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950 text-xs font-bold transition-colors hover:bg-slate-800"
            >
              Konfirmasi Tutup
            </button>
          </div>
        }
      >
        {(() => {
          const hh = HOUSEHOLDS_DATA.find((item) => item.id === selectedRowId) || HOUSEHOLDS_DATA[0];
          const isExtreme = hh.decile.includes('D1');
          return (
            <div className="space-y-6">
              {/* Decile gauge */}
              <div className={`p-4 border rounded-sm text-center space-y-1.5 ${
                isExtreme 
                  ? 'border-rose-100 bg-rose-50/10 dark:border-rose-950 dark:bg-rose-950/5' 
                  : 'border-amber-100 bg-amber-50/10 dark:border-amber-950 dark:bg-amber-950/5'
              }`}>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider inline-block ${
                  isExtreme ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  Desil Kesejahteraan: {hh.decile}
                </span>
                <h4 className="text-xs font-bold">Kepala Keluarga: {maskName(hh.name)}</h4>
                <p className="text-[11px] font-mono text-slate-500">Skor Proxy Means Testing (PMT): {hh.pmt}</p>
                <p className="text-[10px] text-slate-400">Batas ambang penargetan: 18,50 skor PMT</p>
              </div>

              {/* Asset Matrices */}
              <div className="space-y-2 text-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-900 pb-1">
                  Indikator Aset Hunian
                </h4>
                <div className="space-y-1.5 font-medium">
                  <div className="flex justify-between border-b border-slate-50/50 dark:border-slate-900/50 pb-1">
                    <span className="text-slate-400">Bahan Dinding:</span>
                    <span>{hh.wall}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50/50 dark:border-slate-900/50 pb-1">
                    <span className="text-slate-400">Permukaan Lantai:</span>
                    <span>{hh.floor}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400">Sumber Utilitas Air:</span>
                    <span>{hh.water}</span>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="space-y-2 text-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-900 pb-1">
                  Demografi Rumah Tangga
                </h4>
                <div className="space-y-1.5 font-medium">
                  <div className="flex justify-between border-b border-slate-50/50 dark:border-slate-900/50 pb-1">
                    <span className="text-slate-400">Ukuran Rumah Tangga:</span>
                    <span>{hh.size}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50/50 dark:border-slate-900/50 pb-1">
                    <span className="text-slate-400">Tanggungan:</span>
                    <span>{hh.dependents}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400">NIK Ter-audit (Disamarkan):</span>
                    <span className="font-mono">{maskNIK(hh.nik)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </Drawer>
    </div>
  );
}

/**
 * Screen label helpers
 */
function getScreenTitle(id: string): string {
  switch (id) {
    case 'dashboard':
      return 'Dasbor Eksekutif';
    case 'diagnosis':
      return 'Diagnosis Wilayah';
    case 'typology':
      return 'Tipologi Wilayah';
    case 'regional-profile':
      return 'Profil Wilayah';
    case 'household':
      return 'Penargetan Rumah Tangga';
    case 'ml-evaluation':
      return 'Evaluasi Machine Learning';
    case 'recommendation':
      return 'Rekomendasi Kebijakan';
    case 'monitoring':
      return 'Pemantauan Kebijakan';
    case 'administration':
      return 'Administrasi Platform';
    case 'settings':
      return 'Pengaturan Sistem';
    default:
      return id;
  }
}

function getScreenDescription(id: string): string {
  switch (id) {
    case 'dashboard':
      return 'Pusat kendali analitis tingkat tinggi yang menampilkan indikator makro sosial ekonomi Jawa Barat, peta koroplet, dan ringkasan peringatan dini.';
    case 'diagnosis':
      return 'Mendekomposisi ketimpangan provinsi menggunakan model indeks Theil, memvisualisasikan tren historis indikator kemiskinan.';
    case 'typology':
      return 'Mengkategorikan 27 kabupaten/kota BPS ke dalam kuadran pertumbuhan Klassen, menganalisis peringkat prioritas pembangunan.';
    case 'regional-profile':
      return 'Mendiagnosis kabupaten/kota tertentu dengan membandingkan radar deprivasi multi-dimensi lokal langsung terhadap tolok ukur provinsi.';
    case 'household':
      return 'Melakukan pencarian mikrodata desil kesejahteraan PMT secara aman. Nama dan NIK disamarkan sesuai kepatuhan regulasi UU PDP.';
    case 'ml-evaluation':
      return 'Mengaudit performa prediksi, kurva ambang batas, atribusi dampak fitur Shapley, dan indikator bias struktural.';
    case 'recommendation':
      return 'Mengakses rencana rekomendasi kebijakan algoritmik, menggabungkan pemodelan dampak yang diharapkan dan lembaga penanggung jawab.';
    case 'monitoring':
      return 'Memantau dinamika kemiskinan bersama dengan lintasan sasaran RPJMD target trajectories, melacak efisiensi penyaluran program perlindungan sosial.';
    case 'administration':
      return 'Mengelola parameter kesehatan platform, SLA replikasi database, pipa model ML, dan sesi peran pengguna sistem.';
    case 'settings':
      return 'Mengonfigurasi bahasa antarmuka, mode kontras tinggi WCAG, parameter tema visual, dan notifikasi peringatan dini.';
    default:
      return '';
  }
}
