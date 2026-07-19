import React, { useState, useMemo, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  MapPin,
  Sliders,
  DollarSign,
  Layers,
  Calendar,
  ShieldCheck,
  Download,
  Share2,
  Printer,
  FileText,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  BarChart3,
  ListFilter,
  PieChart as PieIcon,
  RefreshCw,
  Building,
  Target,
  Sparkles,
  Zap,
  Activity,
  Heart,
  BookOpen,
  Home,
  UserCheck
} from 'lucide-react';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// Coordinates for priority map representation (aligned with geographical positions)
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

// Top 10 recommendations catalog
const TOP_RECOMMENDATIONS = [
  { id: 'REC-01', priority: 'CRITICAL', district: 'Kabupaten Tasikmalaya', program: 'Infrastructure (Rural Clean Water Supply Grid)', targetPop: 'Decile 1 (Extreme Poor)', beneficiaries: '42,500 Families', impact: 'Reduction in Multidimensional Deprivation index by -4.2 pts', budget: 18500000000, timeline: 'Immediate (0-3 Months)', agency: 'Dinas PUPR Provinsi Jabar', confidence: 0.96 },
  { id: 'REC-02', priority: 'CRITICAL', district: 'Kabupaten Indramayu', program: 'MSME Support (Productive Capital Grant & Micro-onboarding)', targetPop: 'Decile 1 & 2 (Poorest)', beneficiaries: '31,200 Artisans', impact: 'P0 headcount falls by 1.8% locally', budget: 12400000000, timeline: 'Immediate (0-3 Months)', agency: 'Dinas Koperasi & UMKM', confidence: 0.94 },
  { id: 'REC-03', priority: 'HIGH', district: 'Kabupaten Garut', program: 'PKH Boost (Conditional Cash Integration with Nutrition)', targetPop: 'Stunted Toddler Families', beneficiaries: '28,900 Households', impact: 'Stunting proxy rates fall by -3.1% in Q4', budget: 15100000000, timeline: 'Medium Term (3-12 Months)', agency: 'Dinas Sosial Jabar', confidence: 0.91 },
  { id: 'REC-04', priority: 'HIGH', district: 'Kabupaten Kuningan', program: 'Housing Improvement (Rutilahu Rehabilitation)', targetPop: 'Decile 1 (Mud Flooring)', beneficiaries: '19,500 Households', impact: 'Housing Deprivation segment drops by -6.2%', budget: 24300000000, timeline: 'Medium Term (3-12 Months)', agency: 'Dinas Perumahan & Permukiman', confidence: 0.92 },
  { id: 'REC-05', priority: 'HIGH', district: 'Kabupaten Cianjur', program: 'Scholarships (Vocational Agritech Academy)', targetPop: 'Decile 1 & 2 (Young Farmers)', beneficiaries: '12,000 Youths', impact: 'Youth informal labor rates reduced by -4.5%', budget: 9200000000, timeline: 'Medium Term (3-12 Months)', agency: 'Dinas Pendidikan Jabar', confidence: 0.89 },
  { id: 'REC-06', priority: 'MEDIUM', district: 'Kabupaten Sukabumi', program: 'Employment Training (Blue Economy Training Tracks)', targetPop: 'Southern Coastal Deciles', beneficiaries: '14,800 Adults', impact: 'Avg household income increases by +8.2%', budget: 6700000000, timeline: 'Medium Term (3-12 Months)', agency: 'Dinas Tenaga Kerja', confidence: 0.88 },
  { id: 'REC-07', priority: 'MEDIUM', district: 'Kabupaten Cirebon', program: 'Nutrition Program (Pre-School Dairy Subsidy)', targetPop: 'D1 Households with Children', beneficiaries: '25,000 Children', impact: 'Childhood nutrition index gains +11%', budget: 8300000000, timeline: 'Medium Term (3-12 Months)', agency: 'Dinas Kesehatan Jabar', confidence: 0.90 },
  { id: 'REC-08', priority: 'MEDIUM', district: 'Kabupaten Bandung', program: 'Digital Inclusion (Rural Fiber Grid)', targetPop: 'Priority Rural Villages', beneficiaries: '11,000 Households', impact: 'Internet Deprivation is halved locally', budget: 14500000000, timeline: 'Long Term (1-3 Years)', agency: 'Diskominfo Provinsi Jabar', confidence: 0.87 },
  { id: 'REC-09', priority: 'LOW', district: 'Kabupaten Sumedang', program: 'BPNT Enhancements (Deduplication Calibration)', targetPop: 'Decile 3 Buffer Class', beneficiaries: '18,200 Households', impact: 'Leakage / Inclusion error drops by -8%', budget: 3200000000, timeline: 'Immediate (0-3 Months)', agency: 'Dinas Sosial Jabar', confidence: 0.95 },
  { id: 'REC-10', priority: 'LOW', district: 'Kabupaten Purwakarta', program: 'MSME Support (Industrial Sub-contracts Integration)', targetPop: 'Industrial Corridor Buffers', beneficiaries: '7,500 Artisans', impact: 'Vulnerability indexing improves locally', budget: 5100000000, timeline: 'Long Term (1-3 Years)', agency: 'Disperindag Jabar', confidence: 0.85 }
];

// District Recommendation Details Map
const DISTRICT_DETAILS: Record<string, {
  problemSummary: string;
  evidence: string;
  indicators: { label: string; val: string }[];
  mlResult: string;
  suggestedPrograms: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  outcome: string;
  risks: string;
  monitoring: string;
  confidence: number;
}> = {
  '3206': {
    problemSummary: 'Acute, chronic infrastructure deficits paired with high concentrations of extreme rural poverty in southern agrarian pockets.',
    evidence: 'Susenas survey flags 12.11% poverty rate, with over 72% of D1 households lacking safe drinking water or holding tanks.',
    indicators: [
      { label: 'Multidermal Deprivation', val: '41.2%' },
      { label: 'Housing Deprivation index', val: '38.5%' },
      { label: 'Poverty Gap Index (P1)', val: '2.44' }
    ],
    mlResult: 'Gradient Boosting models assign 24.5% attribution weight to Housing and Water assets as the primary drivers of localized welfare decay.',
    suggestedPrograms: ['Infrastructure (Rural Clean Water Supply Grid)', 'Housing Improvement (Rutilahu)', 'Nutrition Program'],
    priority: 'CRITICAL',
    outcome: 'Expected drop in local poverty headcount (P0) from 12.11% to 10.45% within 18 months.',
    risks: 'Topographic friction in mountainous terrain could delay heavy infrastructure machinery.',
    monitoring: 'Access rate to safe piped water per sub-district, compiled quarterly.',
    confidence: 0.96
  },
  '3212': {
    problemSummary: 'Heavy seasonal unemployment shocks in coastal farming-fishery buffer zones, combined with low average schooling years.',
    evidence: 'Average school duration remains at 6.1 years; post-harvest season triggers severe consumption fluctuations.',
    indicators: [
      { label: 'Schooling Duration Avg', val: '6.1 years' },
      { label: 'Water Access Deprivation', val: '31.2%' },
      { label: 'Poverty Severity (P2)', val: '0.62' }
    ],
    mlResult: 'Ensemble shapley values highlight a massive 18.2% weight on formal education and productive assets as critical self-sufficiency drivers.',
    suggestedPrograms: ['MSME Support', 'Scholarships (Vocational)', 'BPNT Enhancements'],
    priority: 'CRITICAL',
    outcome: 'Secure year-round consumption smoothing for 31,000 households, stabilizing extreme poverty risks.',
    risks: 'High local inflation rates might erode the purchasing power of cash disbursements.',
    monitoring: 'Average household non-food consumption share in target areas.',
    confidence: 0.94
  },
  '3205': {
    problemSummary: 'High density of vulnerable families with stunt-risk children lacking access to basic nutrition and continuous immunization grids.',
    evidence: 'Toddler stunting proxy indicators rise to 24.1% in highland agrarian sub-districts.',
    indicators: [
      { label: 'Stunting Proxy Rate', val: '24.1%' },
      { label: 'Health Service Disconnect', val: '19.4%' },
      { label: 'Childhood Deprivation index', val: '28.8%' }
    ],
    mlResult: 'Neural net classification paths trace a high likelihood of chronic illness gaps acting as poverty amplifiers for younger families.',
    suggestedPrograms: ['PKH Boost (Nutrition Integration)', 'Scholarships', 'Nutrition Program'],
    priority: 'HIGH',
    outcome: 'Drop of stunting indicators in core pilot sub-districts by -4.5% inside 12 months.',
    risks: 'Limited local clinical personnel to handle integrated screening sweeps.',
    monitoring: 'Growth monitoring completion logs at rural health posts (Posyandu).',
    confidence: 0.91
  },
  '3208': {
    problemSummary: 'Concentrated sub-standard housing conditions (compacted dirt floors, bamboo walls) across rural highlands.',
    evidence: 'Over 19,500 rural dwellings lack standard structural foundations or concrete screed layers.',
    indicators: [
      { label: 'Floor Material Deprivation', val: '45.1%' },
      { label: 'Structural Safety Risk', val: '32.4%' },
      { label: 'Extreme Decile Ratio', val: '12.82%' }
    ],
    mlResult: 'Decisions tree splits flag housing quality as the most decisive indicator separating D1 from D3 cohorts in this district.',
    suggestedPrograms: ['Housing Improvement (Rutilahu)', 'Infrastructure', 'Digital Inclusion'],
    priority: 'HIGH',
    outcome: 'Complete rehabilitation of 19,500 homes, eliminating housing-based deprivation flags.',
    risks: 'Sourcing certified, non-toxic materials locally within target budget ceilings.',
    monitoring: 'Before/after structural safety certification index.',
    confidence: 0.92
  }
};

// Default district details generator for non-configured districts
const getDefaultDistrictDetail = (name: string, p0: number) => {
  const isHigh = p0 > 10;
  return {
    problemSummary: `General structural welfare constraints associated with ${isHigh ? 'lagging' : 'moderate'} urban-rural buffers in ${name}.`,
    evidence: `District-wide survey indicates poverty rate is currently at ${p0}%.`,
    indicators: [
      { label: 'Welfare Index Rank', val: `${p0 < 7 ? 'Upper Tier' : 'Middle Tier'}` },
      { label: 'Decile 1 Ratio', val: `${(p0 * 0.4).toFixed(1)}%` },
      { label: 'Estimated Needy', val: `${Math.round(p0 * 3000).toLocaleString()} HH` }
    ],
    mlResult: 'Feature attributions show balanced contributions from labor access (14.2%) and schooling years (16.8%).',
    suggestedPrograms: ['PKH Boost', 'MSME Support', 'Employment Training'],
    priority: (p0 > 11 ? 'CRITICAL' : p0 > 8 ? 'HIGH' : p0 > 6 ? 'MEDIUM' : 'LOW') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    outcome: `Stabilize poverty rate to below ${(p0 * 0.9).toFixed(2)}% via coordinated target transfers.`,
    risks: 'Database synchronization delays on local registration files.',
    monitoring: 'Aggregate register accuracy indexes analyzed biannually.',
    confidence: 0.88
  };
};

export default function PolicyRecommendationPage() {
  const { selectedDistrictId: globalDistrictId } = useNavigationStore();

  // Navigation & District Selection
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('3206'); // Kab. Tasikmalaya

  useEffect(() => {
    if (globalDistrictId) {
      setSelectedDistrictId(globalDistrictId);
      setPolicyMemoDistrict(globalDistrictId);
    }
  }, [globalDistrictId]);
  const selectedDistrictName = useMemo(() => {
    const dist = WEST_JAVA_DISTRICTS.find(d => d.id === selectedDistrictId);
    return dist ? dist.name : 'Kabupaten Tasikmalaya';
  }, [selectedDistrictId]);

  // Priority Table Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'budget' | 'confidence'>('priority');

  // Interactive Scenario Simulator Sliders (Section 6)
  const [simBudget, setSimBudget] = useState<number>(32.4); // Trillions Rp
  const [simCoverage, setSimCoverage] = useState<number>(80); // % target coverage
  const [simErrorReduction, setSimErrorReduction] = useState<number>(15); // % exclusion reduction

  // Toast / Export simulation states
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [policyMemoDistrict, setPolicyMemoDistrict] = useState<string>('3206');

  const policyMemoDistrictData = useMemo(() => {
    return WEST_JAVA_DISTRICTS.find(d => d.id === policyMemoDistrict) || WEST_JAVA_DISTRICTS[5];
  }, [policyMemoDistrict]);

  // MAP ZOOM & PAN (Section 3)
  const [mapZoom, setMapZoom] = useState<number>(1.0);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  const selectedDistrictData = useMemo(() => {
    const p0Val = WEST_JAVA_DISTRICTS.find(d => d.id === selectedDistrictId)?.p0 || 8.0;
    return DISTRICT_DETAILS[selectedDistrictId] || getDefaultDistrictDetail(selectedDistrictName, p0Val);
  }, [selectedDistrictId, selectedDistrictName]);

  // Top 10 recommendations - sorted and filtered
  const processedRecommendations = useMemo(() => {
    return TOP_RECOMMENDATIONS.filter(rec => {
      const matchesSearch = rec.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.targetPop.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'ALL' || rec.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    }).sort((a, b) => {
      if (sortBy === 'budget') return b.budget - a.budget;
      if (sortBy === 'confidence') return b.confidence - a.confidence;
      // Default Priority Sort: CRITICAL > HIGH > MEDIUM > LOW
      const priorityWeights: Record<string, number> = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    });
  }, [searchQuery, priorityFilter, sortBy]);

  // SECTION 6: Dynamic Impact Simulator Math
  const simulatedImpact = useMemo(() => {
    // base poverty headcount (P0) at provincial scale is approx 7.4%
    // poverty gap (P1) is approx 1.15
    // inequality Gini is approx 0.380
    
    // As budget rises (32.4 Trillion is 1.0x baseline)
    const budgetFactor = simBudget / 32.4;
    // As coverage rises
    const coverageFactor = simCoverage / 100;
    // As exclusion error reduces
    const errorFactor = 1 + (simErrorReduction / 100);

    const p0Reduction = Math.min(2.8, 0.4 * budgetFactor + 1.2 * coverageFactor + 0.8 * errorFactor);
    const p1Reduction = Math.min(0.55, 0.1 * budgetFactor + 0.25 * coverageFactor + 0.15 * errorFactor);
    const inequalityReduction = Math.min(0.025, 0.003 * budgetFactor + 0.012 * coverageFactor + 0.008 * errorFactor);

    return {
      p0: p0Reduction.toFixed(2),
      p1: p1Reduction.toFixed(2),
      inequality: inequalityReduction.toFixed(3),
      newP0: (7.45 - p0Reduction).toFixed(2),
      newP1: (1.18 - p1Reduction).toFixed(2),
      newGini: (0.375 - inequalityReduction).toFixed(3),
    };
  }, [simBudget, simCoverage, simErrorReduction]);

  // SECTION 7: Dynamic Budget Allocations Charts Data
  const budgetByProgramData = [
    { name: 'Infrastructure', budget: 18.5, percentage: 31, color: '#3b82f6' },
    { name: 'Rutilahu Housing', budget: 24.3, percentage: 24, color: '#f59e0b' },
    { name: 'PKH Cash Boost', budget: 15.1, percentage: 17, color: '#10b981' },
    { name: 'Digital Inclusion', budget: 14.5, percentage: 11, color: '#8b5cf6' },
    { name: 'MSME Support', budget: 12.4, percentage: 9, color: '#ec4899' },
    { name: 'Education/Scholar', budget: 9.2, percentage: 5, color: '#06b6d4' },
    { name: 'Nutrition Services', budget: 8.3, percentage: 3, color: '#3b82f6' }
  ];

  const budgetByDistrictData = [
    { name: 'Tasikmalaya', value: 18.5 },
    { name: 'Garut', value: 15.1 },
    { name: 'Bandung', value: 14.5 },
    { name: 'Indramayu', value: 12.4 },
    { name: 'Cianjur', value: 9.2 },
    { name: 'Cirebon', value: 8.3 },
    { name: 'Sukabumi', value: 6.7 }
  ];

  // Helper colors for recommendation priorities
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900';
      case 'HIGH': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900';
      case 'MEDIUM': return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900';
    }
  };

  // Simulated export handler
  const triggerExport = (format: string) => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      alert(`Export Success: RANCAGE decision briefing package compiled in ${format} format!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Policy Recommendation Intelligence Center"
        description="Translating machine learning diagnostics and multidimensional indices into actionable administrative interventions."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1 text-[11px] font-mono font-bold text-slate-500">
              CYCLE: <span className="text-blue-600 dark:text-blue-400">2026 RPJMD Mid-Term</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1 text-[11px] font-mono font-bold text-slate-500">
              ENGINE: <span className="text-slate-800 dark:text-slate-200">v2.1.0-RC3</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1 text-[11px] font-mono font-bold text-slate-500">
              UPDATED: <span className="text-slate-800 dark:text-slate-200">2026-07-15</span>
            </div>
          </div>
        }
      />

      {/* SECTION 1: EXECUTIVE BRIEFING */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs">
        <div className="border-b border-slate-100 dark:border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
              Provincial Executive Advisory & Briefing Memo
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-sm font-bold">
            CONFIDENTIAL AI ADVISORY
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="lg:col-span-8 space-y-4">
            <p>
              West Java's current poverty rate hovers at <strong className="text-slate-900 dark:text-white">7.45% provincial headcount index (P0)</strong>, primarily driven by structural inequalities between the industrialized northern corridors and the geographically disconnected southern agrarian regions. Machine learning Shapley (SHAP) attributions show that <strong className="text-slate-900 dark:text-white">Housing Quality deficits</strong> and <strong className="text-slate-900 dark:text-white">Sanitation / Clean Water deprivation</strong> serve as the strongest triggers of persistent multigenerational welfare decile decay.
            </p>
            <p>
              To meet RPJMD mid-term target bands, the RANCAGE recommendation engine recommends focusing initial fiscal disbursements on three highest priority districts: <strong className="text-slate-900 dark:text-white">Kabupaten Tasikmalaya</strong>, <strong className="text-slate-900 dark:text-white">Kabupaten Indramayu</strong>, and <strong className="text-slate-900 dark:text-white">Kabupaten Garut</strong>. By targeting 142,500 validated Decile 1 households with a hybrid policy mixing immediate cash integration with water/structural assets development, the province is projected to lower the poverty rate to <strong className="text-emerald-600 font-bold dark:text-emerald-400">4.65%</strong> while reducing within-province inequality metrics by <strong className="text-emerald-600 font-bold dark:text-emerald-400">-0.018 Gini points</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-900 pt-3">
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">AGGREGATE BUDGET</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">Rp 32.4 Trillion</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">PROJECTED BENEFICIARIES</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">245,000 Families</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">MODEL CONFIDENCE</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">94.2% Verified</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-900 rounded-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase font-mono">
                <Target className="h-4 w-4 text-blue-500" />
                <span>Provincial Strategy Guidance</span>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-500">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Phase 1:</strong> Immediate clean-water grid deployment in southern Tasikmalaya.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Phase 2:</strong> Expand micro-productive assets capital to seasonal coastal artisans in Indramayu.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Phase 3:</strong> Schooling & health screening sweeps in highland Garut.</span>
                </li>
              </ul>
            </div>
            <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-900 pt-2 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Co-signed by Bappeda Jabar Data Core Unit</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE PRIORITY MAP & SECTION 4: RECOMMENDATION DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SECTION 3: Choropleth priority map */}
        <div className="lg:col-span-7 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs flex flex-col space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">COORDINATED GEOSPATIAL TARGETS</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                Interactive Regional Priority Map
              </h4>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMapZoom(prev => Math.min(3, prev + 0.2))} className="p-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm" title="Zoom In">
                <span className="text-xs font-mono font-bold px-1">+</span>
              </button>
              <button onClick={() => setMapZoom(prev => Math.max(0.8, prev - 0.2))} className="p-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm" title="Zoom Out">
                <span className="text-xs font-mono font-bold px-1">-</span>
              </button>
              <button onClick={() => { setMapZoom(1); setMapOffset({ x: 0, y: 0 }); }} className="p-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm" title="Reset">
                <span className="text-[10px] font-mono px-1">R</span>
              </button>
            </div>
          </div>

          <div className="relative border border-slate-100 dark:border-slate-900 rounded-sm bg-slate-50/50 dark:bg-slate-900/20 h-[320px] overflow-hidden flex items-center justify-center">
            {/* Legend Overlay */}
            <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/95 border border-slate-100 dark:border-slate-800 p-2.5 rounded-sm shadow-xs text-[10px] space-y-1.5 z-10 font-mono">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px] mb-1">Recommendation Priority</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span>
                <span>Critical Priority (P0 &gt; 11.5%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                <span>High Priority (P0 &gt; 9.0%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-full inline-block"></span>
                <span>Medium Priority (P0 &gt; 7.0%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                <span>Low Priority (P0 &le; 7.0%)</span>
              </div>
            </div>

            {/* Simulated Geographic Choropleth with relative district nodes */}
            <svg
              viewBox={`${50 + mapOffset.x} ${30 + mapOffset.y} ${550 / mapZoom} ${310 / mapZoom}`}
              className="w-full h-full select-none transition-transform duration-200"
            >
              {/* Draw connection links between neighboring priority zones */}
              {Object.entries(DISTRICT_MAP_COORDS).map(([id, coord]) => 
                coord.neighbors.map(nbId => {
                  const nb = DISTRICT_MAP_COORDS[nbId];
                  if (!nb) return null;
                  return (
                    <line
                      key={`${id}-${nbId}`}
                      x1={coord.x}
                      y1={coord.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke="#e2e8f0"
                      className="dark:stroke-slate-900"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                  );
                })
              )}

              {/* Draw district interactive points */}
              {WEST_JAVA_DISTRICTS.map((district) => {
                const coord = DISTRICT_MAP_COORDS[district.id];
                if (!coord) return null;
                
                const isSelected = selectedDistrictId === district.id;
                const p0 = district.p0;
                
                // Color mapping representing policy priority
                let pointColor = 'fill-emerald-500 hover:fill-emerald-400 stroke-emerald-600';
                if (p0 > 11.5) {
                  pointColor = isSelected ? 'fill-rose-600 stroke-rose-800' : 'fill-rose-500 hover:fill-rose-400 stroke-rose-600';
                } else if (p0 > 9.0) {
                  pointColor = isSelected ? 'fill-amber-600 stroke-amber-800' : 'fill-amber-500 hover:fill-amber-400 stroke-amber-600';
                } else if (p0 > 7.0) {
                  pointColor = isSelected ? 'fill-teal-600 stroke-teal-800' : 'fill-teal-500 hover:fill-teal-400 stroke-teal-600';
                } else if (isSelected) {
                  pointColor = 'fill-emerald-600 stroke-emerald-800';
                }

                return (
                  <g key={district.id} className="cursor-pointer" onClick={() => setSelectedDistrictId(district.id)}>
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isSelected ? 10 : 7}
                      className={`${pointColor} transition-all duration-150 stroke-2`}
                    />
                    <text
                      x={coord.x}
                      y={coord.y - (isSelected ? 13 : 10)}
                      textAnchor="middle"
                      className="text-[8px] font-bold font-mono fill-slate-500 dark:fill-slate-400"
                    >
                      {coord.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Instruction tooltip overlay */}
            <div className="absolute bottom-3 right-3 bg-slate-950/80 text-slate-100 text-[9px] px-2 py-1 rounded-sm pointer-events-none font-mono">
              Click a district point to inspect detailed recommendations.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-900">
            <span className="text-slate-400">Current Selection: <strong className="text-slate-800 dark:text-slate-200">{selectedDistrictName}</strong></span>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">P0: {WEST_JAVA_DISTRICTS.find(d => d.id === selectedDistrictId)?.p0}%</span>
          </div>
        </div>

        {/* SECTION 4: RECOMMENDATION DETAIL PANEL */}
        <div className="lg:col-span-5 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">REGIONAL ANALYSIS TARGET DEPTH</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5 flex items-center justify-between">
                <span>{selectedDistrictName}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold ${getPriorityColor(selectedDistrictData.priority)}`}>
                  {selectedDistrictData.priority} PRIORITY
                </span>
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">PROBLEM SUMMARY</span>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {selectedDistrictData.problemSummary}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">EVIDENCE & DATA POINTS</span>
                <p className="text-slate-500 leading-relaxed italic">
                  &ldquo;{selectedDistrictData.evidence}&rdquo;
                </p>
              </div>

              {/* Statistical Indicators Grid */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {selectedDistrictData.indicators.map(ind => (
                  <div key={ind.label} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-sm border border-slate-100 dark:border-slate-900">
                    <span className="block text-[8px] text-slate-400 font-mono uppercase font-bold leading-tight">{ind.label}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{ind.val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5 border-t border-slate-100 dark:border-slate-900 pt-2.5">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">MACHINE LEARNING RESULT AUDIT</span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  {selectedDistrictData.mlResult}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">SUGGESTED ALGORITHMIC INTERVENTIONS</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDistrictData.suggestedPrograms.map(prog => (
                    <span key={prog} className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                      {prog}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-900 text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">Expected Outcome</span>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">{selectedDistrictData.outcome}</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">Risk Mitigator</span>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">{selectedDistrictData.risks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-900 mt-4 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Confidence Index: <strong className="text-emerald-600 dark:text-emerald-400">{(selectedDistrictData.confidence * 100).toFixed(1)}%</strong></span>
            <span>Target Indicator: {selectedDistrictData.monitoring}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: RECOMMENDATIONS MASTER TABLE */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">DECISION CATALOGUE MASTER</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              RANCAGE Coordinated Interventions (Priority Top 10)
            </h4>
          </div>

          {/* Table filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search district, program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs focus:outline-none focus:border-blue-500 w-44 font-medium"
              />
            </div>

            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1 px-2 focus:outline-none focus:border-blue-500 font-semibold text-slate-600 dark:text-slate-300"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'priority' | 'budget' | 'confidence')}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1 px-2 focus:outline-none focus:border-blue-500 font-semibold text-slate-600 dark:text-slate-300"
              >
                <option value="priority">Sort by Priority</option>
                <option value="budget">Sort by Budget</option>
                <option value="confidence">Sort by Confidence</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Custom Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 font-mono font-bold">
                <th className="py-2.5 px-3 uppercase text-[10px]">Priority</th>
                <th className="py-2.5 px-3 uppercase text-[10px]">District Name</th>
                <th className="py-2.5 px-3 uppercase text-[10px]">Intervention Program</th>
                <th className="py-2.5 px-3 uppercase text-[10px]">Target Cohort</th>
                <th className="py-2.5 px-3 uppercase text-[10px] text-right">Beneficiaries</th>
                <th className="py-2.5 px-3 uppercase text-[10px] text-right">Est. Budget</th>
                <th className="py-2.5 px-3 uppercase text-[10px]">Timeline</th>
                <th className="py-2.5 px-3 uppercase text-[10px]">Lead Agency</th>
                <th className="py-2.5 px-3 uppercase text-[10px] text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium text-slate-600 dark:text-slate-300">
              {processedRecommendations.length > 0 ? (
                processedRecommendations.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedDistrictId(WEST_JAVA_DISTRICTS.find(d => d.name === rec.district)?.id || '3206')}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 cursor-pointer transition-colors ${selectedDistrictName === rec.district ? 'bg-slate-50/70 dark:bg-slate-900/40' : ''}`}
                  >
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-xs font-mono font-bold text-[9px] border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100">{rec.district}</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{rec.program}</td>
                    <td className="py-3 px-3 text-[11px] text-slate-500">{rec.targetPop}</td>
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-500">{rec.beneficiaries}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                      Rp {(rec.budget / 1000000000).toFixed(1)}B
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{rec.timeline}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{rec.agency}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {(rec.confidence * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-slate-400">
                    No policy interventions found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: PROGRAM MATCHING ENGINE */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">AUTOMATED ALGORITHMIC RULE SETS</span>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
            Decisions Core: Program Matching Rules & Rationale
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Zap className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Program Keluarga Harapan (PKH Boost)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Rationale:</strong> Triggered when local microdata registers identify cohabiting dependents under age 5 with nutrition or healthcare deprivation weights exceeding 25%. Ensures cash transfers directly tackle child stunting.
            </p>
          </div>

          <div className="p-4 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <UserCheck className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Bantuan Pangan Non-Tunai (BPNT Align)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Rationale:</strong> Deployed as a consumption-smoothing shield in agrarian zones suffering high seasonal unemployment indices. Calibrated using local price indices to secure baseline caloric access.
            </p>
          </div>

          <div className="p-4 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Employment & Vocational Training Tracks</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Rationale:</strong> Triggered in districts exhibiting robust industrial presence but high youth informal labor status. Retraining aligns demographic cohort skills directly with manufacturing needs.
            </p>
          </div>

          <div className="p-4 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Building className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>MSME Productive Grants & Digitization</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Rationale:</strong> Recommended in semi-urban quadrants showing high counts of micro-entrepreneurial informal heads. Provides capital injections to jumpstart local cooperative value-chains.
            </p>
          </div>

          <div className="p-4 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Home className="h-4 w-4 text-rose-500 shrink-0" />
              <span>Housing Foundation Improvement (Rutilahu)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Rationale:</strong> Activated automatically when housing asset surveys flag dirt floor materials or bamboo structural frames in excess of 35% in any sub-district cluster.
            </p>
          </div>

          <div className="p-4 border border-slate-100 dark:border-slate-900 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Activity className="h-4 w-4 text-teal-500 shrink-0" />
              <span>Rural Clean Water & Sanitation Infrastructure</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Rationale:</strong> Deployed in regions with extreme spatial water-source deprivation. Standardized municipal grids are prioritized over small transfers to permanently resolve health-poverty feedbacks.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 6: IMPACT SCENARIO SIMULATOR */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-6">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">POLICY IMPACT FORECASTER</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Interactive Multidimensional Policy & Poverty Scenario Simulator
            </h4>
          </div>
          <span className="text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-xs">
            Simulation Calibration: Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Slider inputs */}
          <div className="lg:col-span-5 space-y-5 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 uppercase font-mono text-[10px]">Aggregate Fiscal Budget Allocation</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">Rp {simBudget.toFixed(1)} Trillion</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={simBudget}
                onChange={(e) => setSimBudget(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-sm appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>Rp 10T Minimum</span>
                <span>Rp 100T Max Budget</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 uppercase font-mono text-[10px]">Priority Deciles (D1-D2) Target Coverage</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">{simCoverage}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={simCoverage}
                onChange={(e) => setSimCoverage(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-sm appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>40% Base Coverage</span>
                <span>100% Universal Coverage</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 uppercase font-mono text-[10px]">Targeted Exclusion Error (Undercoverage) Reduction</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">-{simErrorReduction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="5"
                value={simErrorReduction}
                onChange={(e) => setSimErrorReduction(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-sm appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0% Base Errors</span>
                <span>35% Strict De-duplication</span>
              </div>
            </div>
          </div>

          {/* Simulated Impact outputs */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/40 rounded-sm p-4 flex flex-col justify-between text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">Poverty Headcount (P0)</span>
                <span className="text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {simulatedImpact.newP0}%
                </span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-3 border-t border-slate-100 dark:border-slate-900 pt-2 font-bold">
                Projected reduction: -{simulatedImpact.p0}% pts
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/40 rounded-sm p-4 flex flex-col justify-between text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">Poverty Gap Index (P1)</span>
                <span className="text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {simulatedImpact.newP1}
                </span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-3 border-t border-slate-100 dark:border-slate-900 pt-2 font-bold">
                Projected reduction: -{simulatedImpact.p1}
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/40 rounded-sm p-4 flex flex-col justify-between text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">Gini Coefficient (Inequality)</span>
                <span className="text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {simulatedImpact.newGini}
                </span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-3 border-t border-slate-100 dark:border-slate-900 pt-2 font-bold">
                Projected reduction: -{simulatedImpact.inequality}
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Interpretation Narrative based on Sliders */}
        <div className="p-4 bg-blue-50/40 dark:bg-slate-900/20 border-l-2 border-blue-500 rounded-xs text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
          <h5 className="font-bold text-blue-700 dark:text-blue-400 uppercase font-mono tracking-wider text-[10px]">
            Model-Forecasted Interpretation
          </h5>
          <p>
            An allocation of <strong>Rp {simBudget.toFixed(1)} Trillion</strong> covering <strong>{simCoverage}%</strong> of Decile 1 and 2 families is predicted to lower provincial poverty down to <strong>{simulatedImpact.newP0}%</strong>. By reducing targeting exclusion errors by <strong>{simErrorReduction}%</strong> via audited PMT models, budget leaks are minimized, enabling the province to recoup an estimated <strong>Rp {Math.round(simBudget * (simErrorReduction / 100) * 0.4 * 10) / 10} Trillion</strong> in administrative efficiencies, which can be safely reallocated to housing improvements in Cianjur and water grids in Tasikmalaya.
          </p>
        </div>
      </div>

      {/* SECTION 7: BUDGET ALLOCATIONS TREEMAP & BAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Treemap visual representation (District/Program) using custom flex grid */}
        <div className="lg:col-span-6 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">RESOURCE DISTRIBUTION TREE</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Fiscal Allocations Treemap (Estimated Program Shares)
            </h4>
          </div>

          <div className="grid grid-cols-12 h-[220px] gap-2">
            <div className="col-span-5 bg-blue-600 dark:bg-blue-700 text-white p-3.5 rounded-sm flex flex-col justify-between transition-opacity hover:opacity-95">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Housing (Rutilahu)</span>
              <div>
                <span className="text-base font-extrabold font-mono">Rp 24.3T</span>
                <span className="block text-[9px] font-mono text-blue-200">24% total allocation</span>
              </div>
            </div>

            <div className="col-span-7 grid grid-rows-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-amber-500 text-white p-3 rounded-sm flex flex-col justify-between transition-opacity hover:opacity-95">
                  <span className="text-[9px] font-mono font-bold uppercase">Water Grid</span>
                  <div>
                    <span className="text-sm font-extrabold font-mono">Rp 18.5T</span>
                    <span className="block text-[8px] font-mono text-amber-100">31% Southern priority</span>
                  </div>
                </div>
                <div className="bg-emerald-600 text-white p-3 rounded-sm flex flex-col justify-between transition-opacity hover:opacity-95">
                  <span className="text-[9px] font-mono font-bold uppercase">PKH Cash</span>
                  <div>
                    <span className="text-sm font-extrabold font-mono">Rp 15.1T</span>
                    <span className="block text-[8px] font-mono text-emerald-100">Nutrition linked</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-7 bg-violet-600 text-white p-3 rounded-sm flex flex-col justify-between transition-opacity hover:opacity-95">
                  <span className="text-[9px] font-mono font-bold uppercase">Fiber Grid</span>
                  <div>
                    <span className="text-xs font-extrabold font-mono">Rp 14.5T</span>
                    <span className="block text-[8px] text-violet-100">Sub-district links</span>
                  </div>
                </div>
                <div className="col-span-5 bg-pink-600 text-white p-3 rounded-sm flex flex-col justify-between transition-opacity hover:opacity-95">
                  <span className="text-[9px] font-mono font-bold uppercase font-semibold">MSME</span>
                  <div>
                    <span className="text-xs font-extrabold font-mono">Rp 12.4T</span>
                    <span className="block text-[8px] text-pink-100">Grants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1">
            <div className="p-2 border border-slate-50 dark:border-slate-900 rounded-sm">
              <span className="text-slate-400 block uppercase">Critical Priority Share</span>
              <strong className="text-slate-800 dark:text-slate-200">55.2% budget</strong>
            </div>
            <div className="p-2 border border-slate-50 dark:border-slate-900 rounded-sm">
              <span className="text-slate-400 block uppercase">High Priority Share</span>
              <strong className="text-slate-800 dark:text-slate-200">28.4% budget</strong>
            </div>
            <div className="p-2 border border-slate-50 dark:border-slate-900 rounded-sm">
              <span className="text-slate-400 block uppercase">Medium/Low Share</span>
              <strong className="text-slate-800 dark:text-slate-200">16.4% budget</strong>
            </div>
          </div>
        </div>

        {/* SECTION 7: Recharts Budget by District */}
        <div className="lg:col-span-6">
          <ChartContainer
            title="Estimated Budget Allocations by Priority District"
            subtitle="Comparing budget allocations in Billions (Rp) across key target administrative municipalities."
            height={280}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetByDistrictData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} unit="B" />
                <RechartsTooltip formatter={(value) => [`Rp ${value} Billion`, 'Budget Allocated']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]}>
                  {budgetByDistrictData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : index < 3 ? '#fbbf24' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* SECTION 8: IMPLEMENTATION ROADMAP TIMELINE */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">POLICY DISBURSEMENT CHRONOLOGY</span>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
            Phased Implementation Roadmap & Lead Agency Assignments
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Phase 1 */}
          <div className="border border-slate-100 dark:border-slate-900 p-4 rounded-sm bg-slate-50/50 dark:bg-slate-900/10 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2">
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 text-[9px] font-mono font-bold rounded-xs">
                IMMEDIATE (0-3 MOS)
              </span>
              <Clock className="h-4 w-4 text-rose-500" />
            </div>
            <ul className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
              <li>
                <strong className="text-slate-800 dark:text-slate-200 block">Deduplication Roster Calibrations:</strong>
                Sync Susenas and local DTKS registries via Gradient Boosting classification thresholds to exclude non-poor buffers.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200 block">Taskforce Deployment:</strong>
                Initiate clean-water grid ground sweeps in Southern Tasikmalaya.
              </li>
            </ul>
            <div className="border-t border-slate-100 dark:border-slate-900 pt-2 text-[9px] font-mono text-slate-400 flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-blue-500" />
              <span>Dinsos Jabar &bull; Dinas PUPR</span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="border border-slate-100 dark:border-slate-900 p-4 rounded-sm bg-slate-50/50 dark:bg-slate-900/10 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 text-[9px] font-mono font-bold rounded-xs">
                MEDIUM TERM (3-12 MOS)
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <ul className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
              <li>
                <strong className="text-slate-800 dark:text-slate-200 block">MSME Capital disbursements:</strong>
                Launch micro-productive capital transfers to verified Decile 1 artisans and young farmer groups.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200 block">PKH Stunting Boosts:</strong>
                Integrate healthcare and nutrition vouchers at Posyandu checkposts.
              </li>
            </ul>
            <div className="border-t border-slate-100 dark:border-slate-900 pt-2 text-[9px] font-mono text-slate-400 flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-blue-500" />
              <span>Dinas Koperasi &bull; Dinas Kesehatan</span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="border border-slate-100 dark:border-slate-900 p-4 rounded-sm bg-slate-50/50 dark:bg-slate-900/10 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[9px] font-mono font-bold rounded-xs">
                LONG TERM (1-3 YRS)
              </span>
              <Clock className="h-4 w-4 text-emerald-500" />
            </div>
            <ul className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
              <li>
                <strong className="text-slate-800 dark:text-slate-200 block">Agritech Vocational Academies:</strong>
                Inaugurate long-term regional youth schooling schemes to address low average schooling duration.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200 block">Provincial Rural Fiber Grid:</strong>
                Complete digital inclusion infrastructure sweeps across remote villages.
              </li>
            </ul>
            <div className="border-t border-slate-100 dark:border-slate-900 pt-2 text-[9px] font-mono text-slate-400 flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-blue-500" />
              <span>Dinas Pendidikan &bull; Diskominfo</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 9: RISK ASSESSMENT & SECTION 10: MONITORING INDICATORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 9: RISK MATRIX */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">RISK SAFEGUARDS FRAMEWORK</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Targeting Implementation Risk Log
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-900 rounded-sm bg-slate-50/20 dark:bg-slate-900/10">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">Local Registries Data Quality Decay</span>
                <p className="text-[11px] text-slate-500">Old demographic data results in inclusion error drift.</p>
              </div>
              <div className="text-right">
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-mono font-bold rounded-xs">Likelihood: Medium</span>
                <span className="block text-[10px] text-slate-400 font-mono mt-1">Mitigation: Run bi-weekly GBM cross-verification.</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-900 rounded-sm bg-slate-50/20 dark:bg-slate-900/10">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">Budget Deficit Limits</span>
                <span className="block text-[11px] text-slate-500">Higher material costs delay physical sanitation rollouts.</span>
              </div>
              <div className="text-right">
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-mono font-bold rounded-xs">Likelihood: Medium</span>
                <span className="block text-[10px] text-slate-400 font-mono mt-1">Mitigation: Issue multi-year local municipal bonds.</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-900 rounded-sm bg-slate-50/20 dark:bg-slate-900/10">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">Institutional Co-operation Friction</span>
                <p className="text-[11px] text-slate-500">Provincial and municipal agencies overlap on duplicate allocations.</p>
              </div>
              <div className="text-right">
                <span className="px-1.5 py-0.5 bg-teal-100 text-teal-800 text-[9px] font-mono font-bold rounded-xs">Likelihood: Low</span>
                <span className="block text-[10px] text-slate-400 font-mono mt-1">Mitigation: Enforce unified RANCAGE API dashboard.</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 10: MONITORING INDICATORS DASHBOARD */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">RPJMD OUTCOMES TRACKER</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Continuous Policy Performance Indicators
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            
            <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/30 rounded-sm">
              <span className="text-[9px] text-slate-400 font-bold block uppercase leading-tight">Headcount P0</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">7.45%</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">-0.45% drop</span>
            </div>

            <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/30 rounded-sm">
              <span className="text-[9px] text-slate-400 font-bold block uppercase leading-tight">Poverty Gap P1</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">1.18</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">Optimal bound</span>
            </div>

            <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/30 rounded-sm">
              <span className="text-[9px] text-slate-400 font-bold block uppercase leading-tight">Exclusion Err</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">2.9%</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">Statutory safety</span>
            </div>

            <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/30 rounded-sm">
              <span className="text-[9px] text-slate-400 font-bold block uppercase leading-tight">Inclusion Err</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">3.4%</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">Leakage controlled</span>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-500">
            <div className="p-3 border border-slate-100 dark:border-slate-900 rounded-sm">
              <strong>Theil Between-Region Index: </strong>
              <span>Measures spatial inequality disparities across regions. Target: &lt; 0.12 by Q4 2026.</span>
            </div>
            <div className="p-3 border border-slate-100 dark:border-slate-900 rounded-sm">
              <strong>Citizen Satisfaction Score: </strong>
              <span>Quarterly public grievance logs show 94% approval rating on clean water allocations.</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 11: POLICY BRIEF GENERATOR */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">AUTOMATED BRIEFING COMPILER</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Live Policy Brief & Memo Generator
            </h4>
          </div>
          <div className="flex gap-2">
            <select
              value={policyMemoDistrict}
              onChange={(e) => setPolicyMemoDistrict(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1 px-2 font-mono font-bold"
            >
              {WEST_JAVA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <button
              onClick={() => alert(`Policy Memo generated for ${policyMemoDistrictData.name} and copied to clipboard!`)}
              className="px-3 py-1 bg-blue-600 text-white rounded-sm text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Compile Brief
            </button>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-sm bg-slate-50/50 dark:bg-slate-950 text-xs font-sans text-slate-800 dark:text-slate-100 space-y-4 shadow-inner max-h-[300px] overflow-y-auto leading-relaxed">
          <div className="text-center border-b border-slate-100 dark:border-slate-900 pb-3 space-y-1">
            <strong className="text-[11px] tracking-wider uppercase font-mono text-slate-400 block">OFFICIAL MEMORANDUM</strong>
            <h5 className="text-sm font-bold">RANCAGE EXECUTIVE DSS BRIEF: POLICY INTERVENTION PATHWAYS</h5>
            <span className="text-[10px] font-mono text-slate-400 block">TARGET REGION: {policyMemoDistrictData.name.toUpperCase()}</span>
          </div>

          <div className="space-y-3 font-medium">
            <div>
              <strong className="block text-[10px] text-slate-400 font-mono font-bold uppercase mb-0.5">1. CURRENT SITUATION</strong>
              <p className="text-slate-600 dark:text-slate-300">
                {policyMemoDistrictData.name} shows an average poverty rate of <strong>{policyMemoDistrictData.p0}%</strong>, which heavily places them in the priority intervention category. Demographics highlight localized micro-clusters failing fundamental clean water and floor material asset baselines.
              </p>
            </div>

            <div>
              <strong className="block text-[10px] text-slate-400 font-mono font-bold uppercase mb-0.5">2. EMPIRICAL EVIDENCE</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Gradient Boosting algorithms confirm a high sensitivity threshold linking poor sanitation to lower PMT household proxy scores. The deprivation radar showcases a 32.4% deficit on sewage and holding tanks across the bottom deciles.
              </p>
            </div>

            <div>
              <strong className="block text-[10px] text-slate-400 font-mono font-bold uppercase mb-0.5">3. POLICY RECOMMENDATIONS</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Initiate immediate clean-water grids under PUPR coordination, backed by Rp 18.5 Billion out of the municipal budget. Calibrate local BPNT registration thresholds using 5-Fold validated classification models to drop inclusion leakage from 8.2% to under 3.0%.
              </p>
            </div>

            <div>
              <strong className="block text-[10px] text-slate-400 font-mono font-bold uppercase mb-0.5">4. MEASURABLE MONITORING INDEX</strong>
              <p className="text-slate-600 dark:text-slate-300">
                P0 headcount reductions of -1.45% absolute points should serve as the primary success parameter, compiled quarterly on the central RANCAGE dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 12: EXPORT CENTER */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">GOVERNMENT CO-SHARING PIPELINE</span>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
            Briefing Export & Dissemination Hub
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={() => triggerExport('PDF Document')}
            disabled={isExporting !== null}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm font-bold transition-all disabled:opacity-50"
          >
            {isExporting === 'PDF Document' ? (
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 text-rose-500" />
            )}
            <span>Export PDF Brief</span>
          </button>

          <button
            onClick={() => triggerExport('Excel Sheets')}
            disabled={isExporting !== null}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm font-bold transition-all disabled:opacity-50"
          >
            {isExporting === 'Excel Sheets' ? (
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            )}
            <span>Export Excel Data</span>
          </button>

          <button
            onClick={() => triggerExport('PowerPoint')}
            disabled={isExporting !== null}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm font-bold transition-all disabled:opacity-50"
          >
            {isExporting === 'PowerPoint' ? (
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <Layers className="h-4 w-4 text-amber-500" />
            )}
            <span>Export PPT Slides</span>
          </button>

          <button
            onClick={() => triggerExport('High-Res PNG Map')}
            disabled={isExporting !== null}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm font-bold transition-all disabled:opacity-50"
          >
            {isExporting === 'High-Res PNG Map' ? (
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 text-blue-500" />
            )}
            <span>Export HD Map</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Secure sharing link copied to clipboard!');
            }}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm font-bold transition-all"
          >
            <Share2 className="h-4 w-4 text-teal-500" />
            <span>Copy Secure Link</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm font-bold transition-all"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* SECTION 13: TECHNICAL NOTES */}
      <div className="p-5 border border-slate-100 dark:border-slate-900 rounded-sm bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 font-mono text-[10px] uppercase tracking-wider">
          <Info className="h-4 w-4 text-blue-500" />
          <span>Technical Reference Notes for Policymakers</span>
        </div>
        <p className="leading-relaxed">
          The recommendations generated above utilize <strong>Gradient Boosting Decision Trees (GBDT)</strong> and <strong>Multidimensional Deprivation Index (MDI)</strong> weights. Rather than relying on simple income indicators which easily decay, RANCAGE measures long-term structural wealth such as cement wall quality, roof types, access to drinking water, and years of schooling.
        </p>
        <p className="leading-relaxed text-[11px]">
          <strong>What is Exclusion Error?</strong> Occurs when truly poor households are mistakenly excluded from social programs. We mitigate this by keeping the model recall threshold high (&gt;90%).
          <br />
          <strong>What is Inclusion Error?</strong> Occurs when wealthy households are mistakenly included. We mitigate this by regular database deduplication and strict PMT probability calibrations.
        </p>
      </div>

    </div>
  );
}
