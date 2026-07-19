import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  TrendingUp,
  Download,
  Share2,
  FileText,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Percent,
  BarChart3,
  Calendar,
  Building,
  Eye,
  Info,
  ChevronRight,
  Database,
  Globe,
  Award,
  BookOpen
} from 'lucide-react';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { KpiCard } from '../ui/KpiCard.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import { useNavigationStore } from '../../store/navigationStore.ts';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// Coordinates for district map mapping
const DISTRICT_MAP_COORDS: Record<string, { x: number; y: number; name: string }> = {
  '3201': { x: 140, y: 130, name: 'Bogor' },
  '3202': { x: 120, y: 220, name: 'Sukabumi' },
  '3203': { x: 210, y: 200, name: 'Cianjur' },
  '3204': { x: 310, y: 210, name: 'Bandung' },
  '3205': { x: 360, y: 280, name: 'Garut' },
  '3206': { x: 440, y: 270, name: 'Tasikmalaya' },
  '3207': { x: 520, y: 250, name: 'Ciamis' },
  '3208': { x: 530, y: 190, name: 'Kuningan' },
  '3209': { x: 540, y: 120, name: 'Cirebon' },
  '3210': { x: 470, y: 160, name: 'Majalengka' },
  '3211': { x: 390, y: 160, name: 'Sumedang' },
  '3212': { x: 480, y: 80, name: 'Indramayu' },
  '3213': { x: 350, y: 100, name: 'Subang' },
  '3214': { x: 280, y: 110, name: 'Purwakarta' },
  '3215': { x: 270, y: 70, name: 'Karawang' },
  '3216': { x: 200, y: 70, name: 'Bekasi' },
  '3217': { x: 290, y: 160, name: 'KBB' },
  '3218': { x: 510, y: 310, name: 'Pangandaran' },
  '3271': { x: 155, y: 150, name: 'Kota Bogor' },
  '3272': { x: 145, y: 200, name: 'Kota SBM' },
  '3273': { x: 330, y: 185, name: 'Kota BDG' },
  '3274': { x: 555, y: 135, name: 'Kota CRB' },
  '3275': { x: 180, y: 90, name: 'Kota BKS' },
  '3276': { x: 140, y: 95, name: 'Kota Depok' },
  '3277': { x: 300, y: 175, name: 'Kota Cimahi' },
  '3278': { x: 455, y: 250, name: 'Kota TSM' },
  '3279': { x: 545, y: 240, name: 'Kota Banjar' },
};

// Program Progress & Metrics
const PROGRAM_COMPLETION_DATA = [
  { id: 'PROG-01', name: 'Rural Clean Water Supply Grid', progress: 84, targetBeneficiaries: 120000, currentBeneficiaries: 100800, budgetAllocated: 18.5, budgetSpent: 16.2, completionRate: 84.5, currentP0: 12.11, targetP0: 10.45, gap: 1.66, risk: 'MEDIUM', agency: 'Dinas PUPR Provinsi Jabar', expectedCompletion: 'Sep 2026', confidence: 96 },
  { id: 'PROG-02', name: 'MSME Productive Capital Grants', progress: 92, targetBeneficiaries: 85000, currentBeneficiaries: 78200, budgetAllocated: 12.4, budgetSpent: 11.8, completionRate: 92.0, currentP0: 12.77, targetP0: 11.00, gap: 1.77, risk: 'LOW', agency: 'Dinas Koperasi & UMKM', expectedCompletion: 'Aug 2026', confidence: 94 },
  { id: 'PROG-03', name: 'Conditional Cash Transfer (PKH)', progress: 76, targetBeneficiaries: 245000, currentBeneficiaries: 186200, budgetAllocated: 45.2, budgetSpent: 34.5, completionRate: 76.2, currentP0: 11.45, targetP0: 9.80, gap: 1.65, risk: 'MEDIUM', agency: 'Dinas Sosial Jabar', expectedCompletion: 'Dec 2026', confidence: 91 },
  { id: 'PROG-04', name: 'Housing Improvement (Rutilahu)', progress: 61, targetBeneficiaries: 40000, currentBeneficiaries: 24400, budgetAllocated: 32.4, budgetSpent: 19.8, completionRate: 61.1, currentP0: 12.82, targetP0: 11.20, gap: 1.62, risk: 'HIGH', agency: 'Dinas Perumahan & Permukiman', expectedCompletion: 'Nov 2026', confidence: 92 },
  { id: 'PROG-05', name: 'Scholarships (Vocational Academy)', progress: 88, targetBeneficiaries: 15000, currentBeneficiaries: 13200, budgetAllocated: 9.2, budgetSpent: 8.5, completionRate: 88.0, currentP0: 10.22, targetP0: 8.50, gap: 1.72, risk: 'LOW', agency: 'Dinas Pendidikan Jabar', expectedCompletion: 'Oct 2026', confidence: 89 },
  { id: 'PROG-06', name: 'Pre-School Dairy & Nutrition Grid', progress: 95, targetBeneficiaries: 65000, currentBeneficiaries: 61750, budgetAllocated: 8.3, budgetSpent: 8.1, completionRate: 95.0, currentP0: 11.24, targetP0: 9.50, gap: 1.74, risk: 'LOW', agency: 'Dinas Kesehatan Jabar', expectedCompletion: 'Jul 2026', confidence: 90 },
  { id: 'PROG-07', name: 'Rural Digital Fiber Inclusion', progress: 42, targetBeneficiaries: 50000, currentBeneficiaries: 21000, budgetAllocated: 14.5, budgetSpent: 6.1, completionRate: 42.0, currentP0: 7.83, targetP0: 6.50, gap: 1.33, risk: 'HIGH', agency: 'Diskominfo Jabar', expectedCompletion: 'Mar 2027', confidence: 87 }
];

// Historical outcome trajectory trends
const TRAJECTORY_TRENDS = [
  { year: '2022', p0: 8.06, p1: 1.35, p2: 0.72, theil: 0.224, coverage: 65 },
  { year: '2023', p0: 7.89, p1: 1.28, p2: 0.68, theil: 0.218, coverage: 71 },
  { year: '2024', p0: 7.62, p1: 1.22, p2: 0.64, theil: 0.211, coverage: 75 },
  { year: '2025', p0: 7.45, p1: 1.18, p2: 0.60, theil: 0.203, coverage: 82 },
  { year: '2026', p0: 7.12, p1: 1.12, p2: 0.55, theil: 0.194, coverage: 88 }
];

export default function MonitoringCenterPage() {
  const { selectedDistrictId: globalDistrictId } = useNavigationStore();

  // Navigation & Drill down
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('3206');

  useEffect(() => {
    if (globalDistrictId) {
      setSelectedDistrictId(globalDistrictId);
    }
  }, [globalDistrictId]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [activeCenterTab, setActiveCenterTab] = useState<'GOV' | 'PUBLIC'>('GOV');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const selectedDistrictName = useMemo(() => {
    const dist = WEST_JAVA_DISTRICTS.find(d => d.id === selectedDistrictId);
    return dist ? dist.name : 'Kabupaten Tasikmalaya';
  }, [selectedDistrictId]);

  // Filtered Programs Data
  const filteredPrograms = useMemo(() => {
    return PROGRAM_COMPLETION_DATA.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.agency.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || p.risk === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchQuery, riskFilter]);

  // Combined stats
  const totalAllocatedBudget = useMemo(() => {
    return PROGRAM_COMPLETION_DATA.reduce((sum, p) => sum + p.budgetAllocated, 0);
  }, []);

  const totalSpentBudget = useMemo(() => {
    return PROGRAM_COMPLETION_DATA.reduce((sum, p) => sum + p.budgetSpent, 0);
  }, []);

  const aggregateProgress = useMemo(() => {
    const sumProgress = PROGRAM_COMPLETION_DATA.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(sumProgress / PROGRAM_COMPLETION_DATA.length);
  }, []);

  const triggerExport = (format: string) => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      alert(`Monitoring Package downloaded successfully in ${format} format!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Policy & Trajectory Monitoring"
        description="Continuous oversight of program execution velocities, budget realizations, and multidimensional welfare achievements."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCenterTab(prev => prev === 'GOV' ? 'PUBLIC' : 'GOV')}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm text-xs font-semibold flex items-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              <span>Switch to {activeCenterTab === 'GOV' ? 'Public Dashboard' : 'Internal Monitoring'}</span>
            </button>
            <div className="flex rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => triggerExport('PDF')}
                className="px-2.5 py-1 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs hover:bg-slate-50 border-r border-slate-200 dark:border-slate-800 flex items-center gap-1 font-semibold"
              >
                <Download className="h-3 w-3" /> PDF
              </button>
              <button
                onClick={() => triggerExport('EXCEL')}
                className="px-2.5 py-1 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs hover:bg-slate-50 flex items-center gap-1 font-semibold"
              >
                <Download className="h-3 w-3" /> Excel
              </button>
            </div>
          </div>
        }
      />

      {/* EXECUTIVE KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Avg Program Completion Rate"
          value={`${aggregateProgress}%`}
          change="+3.4% this quarter"
          trend="up"
          trendDirection="positive"
          description="Average milestone checklist logs completed across active initiatives."
        />
        <KpiCard
          title="Disbursed Fiscal Allocation"
          value={`Rp ${(totalSpentBudget).toFixed(1)}T`}
          change={`of Rp ${totalAllocatedBudget.toFixed(1)}T budget`}
          trend="up"
          trendDirection="positive"
          description="Current year real-time cash realization and allocation transfers."
        />
        <KpiCard
          title="Aggregate Active Beneficiaries"
          value="580,550 Households"
          change="88.2% targeted cohort coverage"
          trend="up"
          trendDirection="positive"
          description="Total validated Decile 1-3 individuals actively matched."
        />
        <KpiCard
          title="Outcome Gap (P0 Change)"
          value="-0.94% Headcount"
          change="Trailing targeted trajectory"
          trend="down"
          trendDirection="positive"
          description="Cumulative poverty drop since Q1 policy execution cycle."
        />
      </div>

      {activeCenterTab === 'GOV' ? (
        <>
          {/* INTERNAL TRACKING ENGINE (GOVERNMENT INSIDE VIEW) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* GEOSPATIAL REGIONAL COMPLETION MAP */}
            <div className="lg:col-span-7 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">REGIONAL SPATIAL MONITOR</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                    District Program Completion & Benefit Realization map
                  </h4>
                </div>

                <div className="relative border border-slate-100 dark:border-slate-900 rounded-sm bg-slate-50/50 dark:bg-slate-900/20 h-[300px] flex items-center justify-center overflow-hidden">
                  {/* Legend */}
                  <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/95 border border-slate-100 dark:border-slate-800 p-2.5 rounded-sm shadow-xs text-[10px] space-y-1.5 z-10 font-mono">
                    <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px] mb-1">Beneficiary Completion Rate</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block"></span>
                      <span>High Velocity (&gt; 85% complete)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full inline-block"></span>
                      <span>Steady Velocity (70% - 85%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block"></span>
                      <span>Lagging/At-Risk (50% - 70%)</span>
                    </div>
                  </div>

                  <svg viewBox="100 50 480 280" className="w-full h-full select-none">
                    {WEST_JAVA_DISTRICTS.map((district) => {
                      const coord = DISTRICT_MAP_COORDS[district.id];
                      if (!coord) return null;

                      const isSelected = selectedDistrictId === district.id;
                      const p0 = district.p0;

                      // Color mapping representing completion metrics
                      let circleColor = 'fill-indigo-400 hover:fill-indigo-300 stroke-indigo-600';
                      if (p0 > 11.5) {
                        circleColor = 'fill-amber-400 hover:fill-amber-300 stroke-amber-500';
                      } else if (p0 < 7.0) {
                        circleColor = 'fill-blue-600 hover:fill-blue-500 stroke-blue-700';
                      }

                      if (isSelected) {
                        circleColor = 'fill-slate-900 dark:fill-white stroke-blue-500';
                      }

                      return (
                        <g key={district.id} className="cursor-pointer" onClick={() => setSelectedDistrictId(district.id)}>
                          <circle
                            cx={coord.x}
                            cy={coord.y}
                            r={isSelected ? 9 : 6}
                            className={`${circleColor} transition-all duration-100 stroke-2`}
                          />
                          <text
                            x={coord.x}
                            y={coord.y - 10}
                            textAnchor="middle"
                            className="text-[8px] font-bold font-mono fill-slate-500 dark:fill-slate-400"
                          >
                            {coord.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-900 mt-3 text-slate-400 font-mono">
                <span>Selected District: <strong className="text-slate-800 dark:text-slate-200">{selectedDistrictName}</strong></span>
                <span>Active Program Coverage: 86.4%</span>
              </div>
            </div>

            {/* TRAJECTORY LINE & MONITOR CHART */}
            <div className="lg:col-span-5 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">KPI TRAJECTORY OUTCOMES</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                    Historical Headcount Reduction & Coverage Trends
                  </h4>
                </div>

                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TRAJECTORY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-900" />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                      <Line name="Poverty Headcount (P0 %)" type="monotone" dataKey="p0" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      <Line name="Welfare Target Coverage (%)" type="monotone" dataKey="coverage" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-900 mt-3 flex items-center gap-1 font-mono">
                <Info className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Poverty Headcount drops consistently aligned with increased target verification.</span>
              </div>
            </div>
          </div>

          {/* POLICY INTERVENTION PERFORMANCE TABLE (Target vs Achievement vs Gap vs Risk) */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">EVALUATION METRIC SUITE</span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                  Recommendation Target Evaluation & Verification Matrix
                </h4>
              </div>

              {/* Filtering */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter program / agency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs focus:outline-none focus:border-blue-500 w-44 font-semibold"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1 px-2 focus:outline-none focus:border-blue-500 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    <option value="ALL">All Risks</option>
                    <option value="LOW">Low Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="HIGH">High Risk</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 font-mono font-bold">
                    <th className="py-2.5 px-3 uppercase text-[9px]">Intervention Program</th>
                    <th className="py-2.5 px-3 uppercase text-[9px] text-right">Target Pop</th>
                    <th className="py-2.5 px-3 uppercase text-[9px] text-right">Current Achievement</th>
                    <th className="py-2.5 px-3 uppercase text-[9px] text-right">Poverty Target</th>
                    <th className="py-2.5 px-3 uppercase text-[9px] text-right">Welfare Gap</th>
                    <th className="py-2.5 px-3 uppercase text-[9px]">Execution Risk</th>
                    <th className="py-2.5 px-3 uppercase text-[9px]">Exp Completion</th>
                    <th className="py-2.5 px-3 uppercase text-[9px]">Responsible Institution</th>
                    <th className="py-2.5 px-3 uppercase text-[9px] text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium text-slate-600 dark:text-slate-300">
                  {filteredPrograms.length > 0 ? (
                    filteredPrograms.map((prog) => (
                      <tr key={prog.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100">{prog.name}</td>
                        <td className="py-3 px-3 text-right font-mono">{prog.targetBeneficiaries.toLocaleString()} HH</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-500">{prog.currentBeneficiaries.toLocaleString()} HH ({prog.progress}%)</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">{prog.targetP0.toFixed(2)}%</td>
                        <td className="py-3 px-3 text-right font-mono text-rose-500 font-semibold">{prog.gap.toFixed(2)}%</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-xs font-mono font-bold text-[8px] ${
                            prog.risk === 'HIGH' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
                            prog.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                            'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}>
                            {prog.risk} RISK
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">{prog.expectedCompletion}</td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">{prog.agency}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{prog.confidence}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-slate-400">
                        No active monitoring logs matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* PUBLIC TRANSPARENCY PANEL (CITIZEN ACCESS PANEL) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-8 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-900 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-blue-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
                    West Java Open Data Transparency Portal
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-sm font-bold">
                  CITIZEN READ-ONLY
                </span>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  In compliance with Jabar Smart Province transparency acts, the <strong>RANCAGE Policy Monitor</strong> provides public-facing transparency statistics. All algorithmic models, poverty targets, and allocation timelines are public property, ensuring complete bureaucratic auditability.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase font-mono block">Latest Achievement Highlights</span>
                    <ul className="space-y-1.5 text-slate-500 text-[11px]">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Rehabilitated 24,400 sub-standard houses in core regions.</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Connected 100,800 rural residents to standard water grids.</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Granted Rp 11.8 Billion in MSME productive capital.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase font-mono block">Open Dataset Archives</span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Download verified microdata registries (completely masked NIK/Names), historical survey logs, and shapefiles.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2">
                      <button onClick={() => triggerExport('ZIP')} className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xs text-[10px] font-bold flex items-center gap-1">
                        <Download className="h-3 w-3" /> Microdata.zip
                      </button>
                      <button onClick={() => triggerExport('CSV')} className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xs text-[10px] font-bold flex items-center gap-1">
                        <Download className="h-3 w-3" /> SpatialGeoJSON.zip
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-900 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">Scientific Methodology Summary</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Welfare classifications are computed using a hybrid model of <strong>Multidimensional Deprivation Indices (MDI)</strong> paired with <strong>Proxy Means Testing (PMT)</strong>. This mitigates targeting error margins and ensures aid flows exclusively to households with verified, concrete structural deficits (mud floors, un-protected water sources, no immunization records).
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">CITIZEN FEEDBACK HUB</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                    Social Accountability Rating
                  </h4>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-sm border border-slate-100 dark:border-slate-900 text-center space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Citizen Satisfaction Index</span>
                  <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">92.4%</span>
                  <span className="text-[10px] text-slate-400 block">Based on 14,200 SMS-based survey responses post-disbursement.</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-500">
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-1.5">
                    <span>Program Timeliness:</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">89.2%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-900 pb-1.5">
                    <span>Target Inclusion Accuracy:</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">94.1%</span>
                  </div>
                  <div className="flex justify-between pb-0.5">
                    <span>Disbursement Transparency:</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">96.8%</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100 dark:border-slate-900">
                Latest audit: 2026-07-10 by Jabar Social Core team.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
