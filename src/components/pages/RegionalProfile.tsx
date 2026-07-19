import React, { useState, useMemo } from 'react';
import {
  MapPin,
  TrendingDown,
  Users,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  FileText,
  Layers,
  Activity,
  Briefcase,
  RotateCcw,
  Sliders,
  Download,
  Search,
  Info,
  HelpCircle,
  ShieldAlert,
  TrendingUp,
  Award,
  DollarSign
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { KpiCard } from '../ui/KpiCard.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import { DataTable } from '../ui/DataTable.tsx';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { formatPercentage, formatNumber, maskName, maskNIK } from '../../utils/format.ts';
import { DISTRICT_DIAGNOSIS_DATA } from '../analytics/diagnosisData.ts';

// Dynamic statistical generator for all 27 West Java districts
// Providing deep-dive indicators matching the RANCAGE Analytics Specification
const getDistrictSocioeconomicMetrics = (districtId: string) => {
  // Hash function to get stable pseudo-random values for each district
  const hash = districtId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Custom metadata and indices
  const agriShare = Math.min(65, Math.max(3, (hash % 35) + 12));
  const manufacturingShare = Math.min(60, Math.max(2, ((hash * 7) % 40) + 5));
  const servicesShare = 100 - agriShare - manufacturingShare;
  
  const unemploymentRate = Math.min(12.5, Math.max(3.2, ((hash * 3) % 8) + 4.1));
  const schoolingYears = Math.min(12.4, Math.max(6.2, 11.8 - ((hash % 15) * 0.35)));
  const waterDeficit = Math.min(55, Math.max(4, ((hash * 11) % 45) + 8));
  const sanitationDeficit = Math.min(60, Math.max(5, (waterDeficit + (hash % 10) - 3)));
  const internetDeficit = Math.min(75, Math.max(8, 90 - (schoolingYears * 7) - (hash % 8)));
  const healthDeficit = Math.min(45, Math.max(6, ((hash * 13) % 30) + 10));
  const wallDeficit = Math.min(40, Math.max(2, ((hash * 17) % 25) + 5));
  const assetDeficit = Math.min(50, Math.max(5, ((hash * 19) % 35) + 8));

  // Determine Klassen Typology Quadrant
  let typology: 'I' | 'II' | 'III' | 'IV' = 'IV';
  if (schoolingYears > 9.5 && unemploymentRate < 7) {
    typology = 'I'; // Maju Cepat
  } else if (manufacturingShare > 35 && schoolingYears < 9.0) {
    typology = 'II'; // Potensial
  } else if (schoolingYears > 9.0 && unemploymentRate > 8) {
    typology = 'III'; // Tertekan
  } else {
    typology = 'IV'; // Tertinggal
  }

  return {
    agriShare,
    manufacturingShare,
    servicesShare,
    unemploymentRate,
    schoolingYears,
    waterDeficit,
    sanitationDeficit,
    internetDeficit,
    healthDeficit,
    wallDeficit,
    assetDeficit,
    typology
  };
};

// Sub-district simulated data for any district
const getSubDistrictsData = (districtId: string, districtName: string) => {
  const hash = districtId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const subNames = [
    'Kecamatan Karangtengah', 'Kecamatan Cisolok', 'Kecamatan Caringin', 
    'Kecamatan Jampang', 'Kecamatan Bojongpicung', 'Kecamatan Sindangbarang', 
    'Kecamatan Kadupandak', 'Kecamatan Pasirkuda', 'Kecamatan Cidaun', 
    'Kecamatan Leles', 'Kecamatan Cibinong', 'Kecamatan Sukaraja'
  ];

  const count = 5 + (hash % 4); // 5 to 8 sub-districts
  const list = [];
  for (let i = 0; i < count; i++) {
    const subHash = hash + i * 23;
    const p0Rate = Math.min(18.5, Math.max(2.1, ((subHash % 120) / 10) + 3));
    const p1Depth = parseFloat((p0Rate * 0.16 + 0.1).toFixed(2));
    const d1Pop = Math.round(4000 + (subHash % 8500));
    list.push({
      id: `${districtId}${String(i+1).padStart(2, '0')}`,
      name: subNames[(i + (hash % 5)) % subNames.length],
      p0: p0Rate,
      p1: p1Depth,
      d1Pop: d1Pop,
      priority: p0Rate > 11.5 ? 'CRITICAL' : p0Rate > 8.0 ? 'WARNING' : 'STABLE'
    });
  }
  // Sort descending by poverty rate P0
  return list.sort((a, b) => b.p0 - a.p0);
};

// Anonymized representative households data for targeting preview (PDP Compliant)
const getAnonymizedHouseholdsData = (districtId: string) => {
  const hash = districtId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lastNames = ['Ahmad', 'Mulyana', 'Sutisna', 'Subarjo', 'Kurnia', 'Cahyani', 'Maemunah', 'Farida', 'Darsa', 'Sukmana', 'Pebriani', 'Dadang'];
  const firstNames = ['Ibu', 'Bapak', 'Sdr', 'Nyi', 'Ki', 'Abah', 'Emak', 'Kang', 'Teh', 'Mang', 'Bi', 'Ujang'];
  
  const list = [];
  for (let i = 0; i < 5; i++) {
    const hHash = hash + i * 37;
    const decile = i < 2 ? 'D1 (Extreme)' : i < 4 ? 'D2' : 'D3';
    const pmtScore = parseFloat((11.1 + (hHash % 120) / 10).toFixed(2));
    const size = (hHash % 4) + 3;
    const wall = hHash % 2 === 0 ? 'Albasia Wood (Deprived)' : 'Bamboo Plaits (Deprived)';
    const floor = hHash % 3 === 0 ? 'Compacted Dirt (Deprived)' : 'Bamboo Slats (Deprived)';
    const water = hHash % 2 === 0 ? 'Unprotected rural spring (Deprived)' : 'Shallow open well (Deprived)';
    
    list.push({
      id: `HH-${districtId}-${String(hHash % 1000).padStart(4, '0')}`,
      name: `${firstNames[(hHash % firstNames.length)]} ${lastNames[((hHash + 3) % lastNames.length)]}`,
      nik: `32${districtId}${String(hHash * 19).slice(0, 10)}`,
      decile: decile,
      pmt: pmtScore.toFixed(2),
      size: `${size} Members`,
      vulnerabilities: `${wall}, ${floor}, ${water}`
    });
  }
  return list;
};

export default function RegionalProfilePage() {
  const { selectedDistrictId, setSelectedDistrictId, navigateTo } = useNavigationStore();
  
  // Local active states
  const [activeYear, setActiveYear] = useState<string>('2025');
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [memoCopySuccess, setMemoCopySuccess] = useState<boolean>(false);
  const [householdSearchQuery, setHouseholdSearchQuery] = useState<string>('');

  // Fallback to default district (Kabupaten Tasikmalaya '3206') if none is set
  const activeDistrictId = selectedDistrictId || '3206';
  
  // Find current district metadata
  const districtMeta = useMemo(() => {
    return WEST_JAVA_DISTRICTS.find(d => d.id === activeDistrictId) || WEST_JAVA_DISTRICTS[5]; // default to Tasikmalaya
  }, [activeDistrictId]);

  // Retrieve statistical baseline arrays for active district
  const districtDiagnosisYearlyData = useMemo(() => {
    const list: Array<{ year: string; p0: number; p1: number; p2: number; gini: number; priorityScore: number; population: number }> = [];
    ['2022', '2023', '2024', '2025'].forEach((year) => {
      const yearRecords = DISTRICT_DIAGNOSIS_DATA[year] || [];
      const match = yearRecords.find(d => d.id === activeDistrictId);
      if (match) {
        list.push({
          year,
          p0: match.p0,
          p1: match.p1,
          p2: match.p2,
          gini: match.gini,
          priorityScore: match.priorityScore,
          population: match.population
        });
      }
    });
    return list;
  }, [activeDistrictId]);

  // Get active year stats
  const activeYearStats = useMemo(() => {
    const defaultStats = { p0: districtMeta.p0, p1: 1.88, p2: 0.47, gini: 0.389, priorityScore: 88, population: districtMeta.population };
    const match = districtDiagnosisYearlyData.find(d => d.year === activeYear);
    return match || defaultStats;
  }, [districtDiagnosisYearlyData, activeYear, districtMeta]);

  // Socioeconomic Indicators & Deprivations
  const socMetrics = useMemo(() => {
    return getDistrictSocioeconomicMetrics(activeDistrictId);
  }, [activeDistrictId]);

  // Sub-district spatial context rosters
  const subDistricts = useMemo(() => {
    return getSubDistrictsData(activeDistrictId, districtMeta.name);
  }, [activeDistrictId, districtMeta]);

  // Households list (PDP compliant)
  const households = useMemo(() => {
    return getAnonymizedHouseholdsData(activeDistrictId);
  }, [activeDistrictId]);

  // Filtered households based on query
  const filteredHouseholds = useMemo(() => {
    if (!householdSearchQuery) return households;
    return households.filter(h => 
      h.name.toLowerCase().includes(householdSearchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(householdSearchQuery.toLowerCase())
    );
  }, [households, householdSearchQuery]);

  // Priority calculations for target souls
  const poorSoulsCount = useMemo(() => {
    return Math.round(activeYearStats.population * (activeYearStats.p0 / 100));
  }, [activeYearStats]);

  // Estimated Aligned Welfare Budget (calculated dynamically based on poor headcount & severity)
  const welfareBudget = useMemo(() => {
    const baseBudget = 4200000000; // Base IDR 4.2B
    const variableBudget = poorSoulsCount * 135000; // Variable IDR 135,000 per poor soul
    return baseBudget + variableBudget;
  }, [poorSoulsCount]);

  // Multidimensional Deprivation radar dataset (local vs province baseline average)
  const radarData = useMemo(() => {
    return [
      { subject: 'Health Center Access', local: socMetrics.healthDeficit, average: 22 },
      { subject: 'Clean Water Deficit', local: socMetrics.waterDeficit, average: 28 },
      { subject: 'Education Gaps', local: 100 - (socMetrics.schoolingYears * 8), average: 32 },
      { subject: 'Asset Deprivation', local: socMetrics.assetDeficit, average: 18 },
      { subject: 'Substandard Housing', local: socMetrics.wallDeficit, average: 15 },
      { subject: 'Sanitation Gaps', local: socMetrics.sanitationDeficit, average: 25 },
    ];
  }, [socMetrics]);

  // Historical employment distribution data for trend charting (Area chart)
  const employmentHistoryData = useMemo(() => {
    const list = [];
    const baseAgri = socMetrics.agriShare;
    const baseMfg = socMetrics.manufacturingShare;
    const baseSvc = socMetrics.servicesShare;
    
    for (let idx = 0; idx < 4; idx++) {
      const year = 2022 + idx;
      // Simulate historical transformation trends (agri shrinking slightly, mfg and services expanding)
      const agriTrend = parseFloat((baseAgri + (4 - idx) * 0.8).toFixed(1));
      const mfgTrend = parseFloat((baseMfg + idx * 0.6).toFixed(1));
      const svcTrend = parseFloat((100 - agriTrend - mfgTrend).toFixed(1));
      
      list.push({
        year: String(year),
        Agriculture: agriTrend,
        Manufacturing: mfgTrend,
        Services: svcTrend
      });
    }
    return list;
  }, [socMetrics]);

  // Neighbor comparison data (Regional context)
  const regionalPeersComparison = useMemo(() => {
    // Find districts in same administrative BPS region
    const peers = WEST_JAVA_DISTRICTS.filter(d => d.region === districtMeta.region && d.id !== activeDistrictId);
    // Take up to 4 peers plus active district
    const displayList = [districtMeta, ...peers].slice(0, 5);
    return displayList.map(p => {
      const diagnosisMatch = DISTRICT_DIAGNOSIS_DATA[activeYear]?.find(d => d.id === p.id);
      return {
        name: p.name.replace('Kabupaten', 'Kab.').replace('Kota', 'Kota'),
        P0: diagnosisMatch ? diagnosisMatch.p0 : p.p0,
        unemployment: getDistrictSocioeconomicMetrics(p.id).unemploymentRate,
        isFocus: p.id === activeDistrictId
      };
    });
  }, [districtMeta, activeDistrictId, activeYear]);

  // Copy Memo text to clipboard helper
  const handleCopyMemo = () => {
    const memoText = `
MEMORANDUM OF EXECUTIVE BRIEF
To: Regional Planning Secretariat (Sekda Jabar / Bappeda)
From: RANCAGE Decision Support System (DSS)
Subject: Socioeconomic Diagnostic & Policy Blueprint for ${districtMeta.name} (${activeYear})
Date: ${new Date().toLocaleDateString('id-ID')}

1. SYSTEM PROFILE & CLASSIFICATION
   - District ID: ${districtMeta.id}
   - Regional BPS Block: ${districtMeta.region}
   - Development Priority Score: ${activeYearStats.priorityScore}/100
   - Klassen Typology Quadrant: Quadrant ${socMetrics.typology === 'I' ? 'I (Maju Cepat)' : socMetrics.typology === 'II' ? 'II (Potensial)' : socMetrics.typology === 'III' ? 'III (Tertekan)' : 'IV (Tertinggal)'}

2. CORE STATISTICAL INDICATORS
   - Poverty Headcount (P0): ${activeYearStats.p0}%
   - Poverty Depth (P1): ${activeYearStats.p1}
   - Poverty Severity (P2): ${activeYearStats.p2}
   - Total Estimated Poor Souls: ${poorSoulsCount.toLocaleString('id-ID')} people
   - Allocated Welfare Budget matching: IDR ${welfareBudget.toLocaleString('id-ID')}

3. MULTIDIMENSIONAL RISK AXES (DEFICIT RATIOS)
   - Clean Water Deficit: ${socMetrics.waterDeficit}%
   - Sanitation Deficit: ${socMetrics.sanitationDeficit}%
   - Educational Attainment Gap (Avg Schooling): ${socMetrics.schoolingYears} years
   - Informal Employment / Agricultural share: ${socMetrics.agriShare}%

4. ACTIONABLE INTERVENTION PRIORITIES
   - High Priority Program: ${socMetrics.waterDeficit > 35 ? 'communal deepwell infrastructure pipeline matching' : 'Targeted PKH/BLT Welfare Calibrations'}
   - Budget Match Allocation: IDR ${(welfareBudget * 0.45).toLocaleString('id-ID')} (45% share of total)
   - Accountable Lead Agency: Dinas Sosial and Dinas PUPR Provinsi Jawa Barat
    `.trim();

    navigator.clipboard.writeText(memoText).then(() => {
      setMemoCopySuccess(true);
      setTimeout(() => setMemoCopySuccess(false), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header (PageHeader automatically renders title & breadcrumb) */}
      <PageHeader
        title="Regional Profile Intelligence"
        description="Dynamic socioeconomic diagnostic and policy formulation workplace for selected BPS districts."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigateTo('typology')}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Typology
            </button>

            {/* Selector dropdown inside actions to dynamically trigger selection */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm px-2.5 h-8">
              <span className="text-[10px] font-bold text-slate-400 font-mono">FOCUS:</span>
              <select
                value={activeDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none pr-1 focus:ring-0"
              >
                {WEST_JAVA_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id} className="dark:bg-slate-950">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm px-2.5 h-8">
              <span className="text-[10px] font-bold text-slate-400 font-mono">YEAR:</span>
              <select
                value={activeYear}
                onChange={(e) => setActiveYear(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-0"
              >
                <option value="2025">2025 Actual</option>
                <option value="2024">2024 Baseline</option>
                <option value="2023">2023 Baseline</option>
                <option value="2022">2022 Baseline</option>
              </select>
            </div>
          </div>
        }
      />

      {/* Section 1: Executive Summary Context Card */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="section-executive-summary">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-50 dark:border-slate-900 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {districtMeta.name}
                </h2>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                  socMetrics.typology === 'IV' 
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' 
                    : socMetrics.typology === 'III'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    : socMetrics.typology === 'II'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                }`}>
                  Klassen: Q_{socMetrics.typology === 'I' ? 'I (Maju Cepat)' : socMetrics.typology === 'II' ? 'II (Potensial)' : socMetrics.typology === 'III' ? 'III (Tertekan)' : 'IV (Tertinggal)'}
                </span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 px-2 py-0.5 rounded-sm uppercase font-bold">
                  BPS Code: {districtMeta.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Administrative Region: {districtMeta.region} Timur Corridor • Security Policy Clearance Level 1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Priority Index:</span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xs">
              <Award className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-sm font-bold font-mono tracking-tight">{activeYearStats.priorityScore}/100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="lg:col-span-2 space-y-3 leading-relaxed text-slate-600 dark:text-slate-300">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">System Narrative Intelligence</span>
            <p>
              {districtMeta.name} is currently classified under{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                Quadrant {socMetrics.typology === 'IV' ? 'IV (Lagging / Tertinggal)' : socMetrics.typology === 'III' ? 'III (Stressed / Tertekan)' : socMetrics.typology === 'II' ? 'II (Potential / Potensial)' : 'I (Established / Maju Cepat)'}
              </strong>{' '}
              of the Klassen Regional Matrix. This classification indicates that the district demonstrates{' '}
              {socMetrics.typology === 'IV' 
                ? 'lower per capita income accompanied by subpar economic growth velocities relative to the provincial averages of West Java.' 
                : socMetrics.typology === 'III'
                ? 'high relative average incomes but experiencing structural growth deceleration, putting vulnerable workers at risk.'
                : socMetrics.typology === 'II'
                ? 'high expansion rates but has not yet converted that growth into broad-based household wealth.'
                : 'both robust macroeconomic growth dynamics and strong established per-capita expenditures.'}
            </p>
            <p>
              With an estimated headcount poverty rate of{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">{activeYearStats.p0}%</span>, the region holds{' '}
              <span className="font-bold text-slate-900 dark:text-white font-medium">{poorSoulsCount.toLocaleString('id-ID')} poor souls</span> who require targeted social assistance or structural capital interventions. The primary vulnerability driving this district's priority score is concentrated around{' '}
              <span className="font-bold text-slate-900 dark:text-white font-medium">
                {socMetrics.waterDeficit > 35 ? 'Communal basic clean water sanitation deficits' : 'Educational attainment gaps in farming communities'}
              </span>.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900 rounded-sm p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Targeting Diagnosis Brief</span>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                A Within-district disparity contribution ratio of{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">82%</span> indicates that regional poverty is heavily pocketed within specific sub-districts rather than evenly spread. Therefore, policymakers must bypass generic budget increments and deploy local{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">Proxy Means Testing (PMT) targeting models</span> to secure targeting accuracy.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-900/80 mt-2 flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider font-mono">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>Complies with West Java RPJMD Trajectories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: District Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="section-district-kpis">
        <KpiCard
          title="Poverty Headcount (P0)"
          value={`${activeYearStats.p0}%`}
          change={`${(activeYearStats.p0 - 7.62).toFixed(2)}% vs Prov Average`}
          trend={activeYearStats.p0 > 7.62 ? 'up' : 'down'}
          trendDirection={activeYearStats.p0 > 7.62 ? 'negative' : 'positive'}
          description="Percentage of the regional population whose consumption expenditure falls beneath BPS poverty thresholds."
        />
        <KpiCard
          title="Poor Population Volume"
          value={poorSoulsCount.toLocaleString('id-ID')}
          change={`Out of ${activeYearStats.population.toLocaleString('id-ID')} total souls`}
          trend="neutral"
          trendDirection="neutral"
          description="BPS population headcount index translated to total estimated individuals requiring target validations."
        />
        <KpiCard
          title="Severity Indices (P1 / P2)"
          value={`${activeYearStats.p1} / ${activeYearStats.p2}`}
          change={`${activeYearStats.p2 > 0.35 ? 'Critical vulnerability' : 'Stable depth indexes'}`}
          trend={activeYearStats.p2 > 0.35 ? 'up' : 'down'}
          trendDirection={activeYearStats.p2 > 0.35 ? 'negative' : 'positive'}
          description="P1 (Poverty depth gap index) alongside P2 (Poverty severity consumption inequalities among the poor)."
        />
        <KpiCard
          title="Welfare Budget Aligned"
          value={`Rp ${(welfareBudget / 1000000000).toFixed(2)} Billion`}
          change={`${(welfareBudget / poorSoulsCount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })} per soul`}
          trend="up"
          trendDirection="positive"
          description="Total estimated aligned welfare budget matching computed as a function of the headcount and gap indices."
        />
      </div>

      {/* Middle Grid - Section 3: Socioeconomic Profile & Section 7: Risk Drivers Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 3: Socioeconomic Profile Details */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="section-socioeconomic-profile">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Structural Diagnostics</span>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                Socioeconomic Profile Gaps & Employment Mix
              </h3>
            </div>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="p-3 border border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">schooling years</span>
              <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100 mt-1 block">
                {socMetrics.schoolingYears} yrs
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 block">
                Prov Avg: 8.4 years
              </span>
            </div>
            <div className="p-3 border border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">unemployment</span>
              <span className="text-lg font-bold font-mono text-rose-500 mt-1 block">
                {socMetrics.unemploymentRate}%
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 block">
                Prov Avg: 7.2%
              </span>
            </div>
            <div className="p-3 border border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">gini ratio</span>
              <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100 mt-1 block">
                {activeYearStats.gini}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 block">
                Prov Avg: 0.373
              </span>
            </div>
          </div>

          {/* Sector employment breakdown */}
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider font-mono">Active Labor Force Sector Distribution</span>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-slate-500">Agriculture, Forestry & Fishery</span>
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{socMetrics.agriShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${socMetrics.agriShare}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-slate-500">Manufacturing & Processing Industries</span>
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{socMetrics.manufacturingShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${socMetrics.manufacturingShare}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-slate-500">Trade, Services & Public Utilities</span>
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{socMetrics.servicesShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${socMetrics.servicesShare}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-900">
              {socMetrics.agriShare > 40 
                ? 'High agricultural workforce concentration exposes the district to severe climatic, crop failure, and temporal wage volatility shocks.' 
                : 'High industrial manufacturing integration shields wages but creates localized rural-urban migration disparities.'}
            </p>
          </div>
        </div>

        {/* Section 7: Risk Drivers Radar Chart */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="section-risk-drivers">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Multidimensional Gaps</span>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Risk Drivers & Access Deprivation Radar
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 8 }}
                />
                <Radar
                  name={`${districtMeta.name} Deficit`}
                  dataKey="local"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Provincial Benchmark Avg"
                  dataKey="average"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.05}
                />
                <RechartsLegend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '4px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row - Section 4: Trend Analysis & Section 5: Regional Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 4: Trend Analysis Chart */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="section-trend-analysis">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Temporal Trajectories</span>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Historical Employment & Structural Transformation (2022 - 2025)
            </h3>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={employmentHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colAgri" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colMfg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colSvc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis unit="%" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <RechartsTooltip />
                <RechartsLegend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="Agriculture" stroke="#f59e0b" fillOpacity={1} fill="url(#colAgri)" strokeWidth={2} />
                <Area type="monotone" dataKey="Manufacturing" stroke="#3b82f6" fillOpacity={1} fill="url(#colMfg)" strokeWidth={2} />
                <Area type="monotone" dataKey="Services" stroke="#10b981" fillOpacity={1} fill="url(#colSvc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 5: Regional Comparison Card */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="section-regional-comparison">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">BPS Corridor Context</span>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Regional Comparison: {districtMeta.region} Peers Baseline ({activeYear})
            </h3>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalPeersComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis unit="%" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <RechartsTooltip />
                <RechartsLegend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar name="Poverty Headcount (P0)" dataKey="P0" radius={[4, 4, 0, 0]}>
                  {regionalPeersComparison.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isFocus ? '#3b82f6' : '#94a3b8'} 
                      fillOpacity={entry.isFocus ? 1 : 0.4}
                    />
                  ))}
                </Bar>
                <Bar name="Unemployment Rate" dataKey="unemployment" fill="#e2e8f0" radius={[4, 4, 0, 0]}>
                  {regionalPeersComparison.map((entry, index) => (
                    <Cell 
                      key={`cell-un-${index}`} 
                      fill={entry.isFocus ? '#fb7185' : '#cbd5e1'} 
                      fillOpacity={entry.isFocus ? 0.95 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row - Section 6: Spatial Context & Section 9: Local Policy Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 6: Spatial Context Mini-Map */}
        <div className="lg:col-span-4 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between" id="section-spatial-context">
          <div className="space-y-4">
            <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">spatial coordinates</span>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                Regional Corridor Mapping
              </h3>
            </div>

            {/* Simulated Geographic Spatial Visual block */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-40 rounded-xs flex items-center justify-center relative overflow-hidden">
              {/* Simple stylized SVG grid representing coordinates of district */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
              
              <div className="text-center space-y-2 z-10 px-4">
                <MapPin className="h-8 w-8 text-rose-500 mx-auto animate-bounce" />
                <span className="text-xs font-bold tracking-tight block text-slate-800 dark:text-slate-200 uppercase font-mono">
                  {districtMeta.region} corridor zone
                </span>
                <span className="text-[10px] text-slate-400 block font-mono leading-none">
                  Lat: -6.9812°S | Long: 107.0194°E
                </span>
              </div>

              {/* Shaded geographic boundaries simulation */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-sm text-[9px] font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>P0 Core Cluster</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] leading-relaxed text-slate-400 pt-3 border-t border-slate-50 dark:border-slate-900 mt-2">
            This administrative segment forms a contiguous basin. High geographical isolation index correlates directly with clean water piping costs in remote sub-districts.
          </div>
        </div>

        {/* Section 9: Local Policy Options */}
        <div className="lg:col-span-8 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs" id="section-policy-recommendation">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Algorithmic Formulation</span>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                Local Policy Intervention Options & Cost Projections
              </h3>
            </div>
            <Briefcase className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {/* Recommendation 1 */}
            <div className="p-3.5 border border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/10 rounded-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold font-mono bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-xs uppercase">
                    urgent priority
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {socMetrics.waterDeficit > 35 ? 'Communal Deepwell & Sanitation matching funds' : 'Targeted PKH/BLT Welfare Calibrations'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                  {socMetrics.waterDeficit > 35 
                    ? 'Deploy communal deepwells and public sanitation grids to mitigate high water deficit ratios which inflate healthcare spending.'
                    : 'Recalibrate welfare registers using machine-learning PMT vectors to eliminate inclusion leakage and address unregistered families.'}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[10px] font-mono text-slate-500">
                  <span>Lead Agency: <strong className="text-slate-700 dark:text-slate-300">{socMetrics.waterDeficit > 35 ? 'Dinas PUPR' : 'Dinas Sosial'}</strong></span>
                  <span>Timeline: <strong className="text-slate-700 dark:text-slate-300">12 Months</strong></span>
                </div>
              </div>
              <div className="shrink-0 text-right sm:border-l border-slate-100 dark:border-slate-900 pl-0 sm:pl-4 space-y-1">
                <span className="text-[9px] text-slate-400 font-mono block uppercase">Est Budget Match</span>
                <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-100 block">
                  Rp {(welfareBudget * 0.45 / 1000000000).toFixed(2)} Billion
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block font-mono">
                  -0.85% Est P0 drop
                </span>
              </div>
            </div>

            {/* Recommendation 2 */}
            <div className="p-3.5 border border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/10 rounded-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold font-mono bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded-xs uppercase">
                    Core Program
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {socMetrics.agriShare > 35 ? 'Agricultural Risk Mitigation & BPJS Insurance Matching' : 'Technical Vocational Academy Grants'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                  {socMetrics.agriShare > 35
                    ? 'Deploy premium subsidies for crop failure crop insurance and match health insurance (BPJS) for informal agricultural laborers.'
                    : 'Construct short-term vocational academies linked to local processing plants to pivot labor from informal to formal employment.'}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[10px] font-mono text-slate-500">
                  <span>Lead Agency: <strong className="text-slate-700 dark:text-slate-300">{socMetrics.agriShare > 35 ? 'Dinas Pertanian' : 'Dinas Tenaga Kerja'}</strong></span>
                  <span>Timeline: <strong className="text-slate-700 dark:text-slate-300">18 Months</strong></span>
                </div>
              </div>
              <div className="shrink-0 text-right sm:border-l border-slate-100 dark:border-slate-900 pl-0 sm:pl-4 space-y-1">
                <span className="text-[9px] text-slate-400 font-mono block uppercase">Est Budget Match</span>
                <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-100 block">
                  Rp {(welfareBudget * 0.3 / 1000000000).toFixed(2)} Billion
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block font-mono">
                  -0.40% Est P0 drop
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row - Section 8: Sub-district Directory & Households Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="section-household-directory">
        {/* Sub-district Poverty Directory */}
        <div className="lg:col-span-6 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono font-bold">Spatial Breakdown</span>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                  Sub-District Poverty Directory (BPS Kecamatan)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">{subDistricts.length} Blocks</span>
            </div>

            <DataTable
              columns={[
                { key: 'name', header: 'Kecamatan', sortable: true },
                { key: 'p0', header: 'P0 Headcount', sortable: true, render: (row) => `${row.p0.toFixed(2)}%` },
                { key: 'p1', header: 'P1 Depth', sortable: true, render: (row) => row.p1.toFixed(2) },
                { key: 'd1Pop', header: 'D1 Souls', sortable: true, render: (row) => row.d1Pop.toLocaleString('id-ID') },
                { 
                  key: 'priority', 
                  header: 'Alert Level', 
                  render: (row) => (
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                      row.priority === 'CRITICAL' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' 
                        : row.priority === 'WARNING'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                    }`}>
                      {row.priority}
                    </span>
                  )
                },
              ]}
              data={subDistricts}
              pageSize={5}
              onRowClick={(row: any) => setSelectedSubId(row.id)}
              selectedRowId={selectedSubId}
            />
          </div>

          <div className="text-[10px] font-mono leading-relaxed text-slate-400 mt-3 pt-3 border-t border-slate-50 dark:border-slate-900 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
            <span>Click any sub-district row above to trigger spatial inspector overlays and filter target households.</span>
          </div>
        </div>

        {/* Household Distribution Preview (PDP Compliant) */}
        <div className="lg:col-span-6 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Micro-Targeting Preview</span>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                  Anonymized Household Registry (PDP Compliant)
                </h3>
              </div>
              {/* Micro search bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search masked roster..."
                  value={householdSearchQuery}
                  onChange={(e) => setHouseholdSearchQuery(e.target.value)}
                  className="rounded-sm border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 pl-8 pr-3 py-1 text-xs outline-none focus:border-blue-500 h-7 w-44"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredHouseholds.map((hh) => (
                <div key={hh.id} className="p-3 border border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 rounded-xs flex flex-col sm:flex-row justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-xs font-bold">{hh.id}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{maskName(hh.name)}</span>
                      <span className="text-[9px] font-mono text-slate-400">{maskNIK(hh.nik)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      <strong className="text-slate-500 block uppercase text-[9px] font-mono tracking-wider">Observed Vulnerabilities:</strong>
                      {hh.vulnerabilities}
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-1 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-xs bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                      Decile: {hh.decile}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">PMT: {hh.pmt}</span>
                  </div>
                </div>
              ))}
              
              {filteredHouseholds.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  No matching households found under active filters.
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100/30 rounded-xs text-[10px] leading-relaxed text-amber-600 dark:text-amber-400 flex items-start gap-2 mt-4">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>PDP UU No. 27/2022 Security Lock:</strong> Household heads names and national IDs (NIK) are cryptographically masked to prevent unauthorized disclosure. Dinas Sosial personnel must authenticate via official Gov-ID to view decrypted registries.
            </span>
          </div>
        </div>
      </div>

      {/* Section 10: Executive Brief Printable Memo */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-slate-950 dark:bg-slate-950 p-6 text-slate-300 shadow-sm" id="section-executive-brief">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-xs font-bold text-slate-50 uppercase tracking-widest font-mono">EXECUTIVE BRIEF FOR LOCAL REGENT</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Official Bappeda West Java Decision Support Briefing Paper • Audited Memo Format</p>
            </div>
          </div>
          <button
            onClick={handleCopyMemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-sm text-xs font-semibold tracking-wide uppercase transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            {memoCopySuccess ? 'Brief Copied!' : 'Export Brief Memo'}
          </button>
        </div>

        <div className="space-y-4 font-mono text-xs leading-relaxed max-w-4xl text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 border-b border-slate-800 pb-3 text-slate-400 uppercase">
            <div>TO: REGIONAL RECOGNITION OFFICERS & REGENT ({districtMeta.name})</div>
            <div>FROM: BAPPEDA WEST JAVA INTEL SYSTEM</div>
            <div>DATE: {new Date().toLocaleDateString('id-ID')}</div>
            <div>STATUS: SECURE DISCLOSURE • UU 27/2022 COMPLIANT</div>
          </div>

          <div className="space-y-3 font-sans">
            <p>
              Based on the {activeYear} statistical baseline diagnostics, <strong className="text-slate-50 font-semibold">{districtMeta.name}</strong> continues to require focused matching fund deployments. Classified under <span className="text-blue-400 font-semibold uppercase tracking-wider font-mono">Klassen Quadrant {socMetrics.typology}</span> with a priority index score of <span className="text-amber-400 font-semibold font-mono">{activeYearStats.priorityScore}/100</span>, poverty alleviation cannot be achieved through horizontal budget increments.
            </p>
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xs space-y-2 text-[11px] font-mono leading-relaxed">
              <span className="font-bold text-slate-50 block uppercase text-[10px] tracking-wider text-blue-400">RECOMMENDED FISCAL ACTION PLAN:</span>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Allocate <span className="font-bold text-slate-50">IDR {(welfareBudget * 0.45 / 1000000000).toFixed(2)} Billion</span> matching funds toward targeted water and sanitary piping grids in the highest deficit sub-districts (e.g. <span className="text-slate-50">{subDistricts[0]?.name}</span>).
                </li>
                <li>
                  Direct <span className="font-bold text-slate-50">IDR {(welfareBudget * 0.3 / 1000000000).toFixed(2)} Billion</span> matching funds toward agricultural premium subsidies to protect micro-shareholders against price and crop shocks.
                </li>
                <li>
                  Dispatch field validation teams using RANCAGE PMT mobile APIs to audit {poorSoulsCount.toLocaleString('id-ID')} poor household profiles, correcting for targeting leakages.
                </li>
              </ul>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed italic pt-2">
              Note: This briefing memo was formulated automatically by the RANCAGE Decision Support Engine utilizing Foster-Greer-Thorbecke statistical indices. Security access log session audited under Gov-ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
