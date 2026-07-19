import React, { useState, useMemo } from 'react';
import {
  Brain,
  TrendingUp,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Info,
  Shield,
  Layers,
  ArrowRight,
  Database,
  Calendar,
  Sparkles,
  BarChart2,
  RefreshCw,
  Award,
  ChevronRight,
  Users,
  Building2,
  Settings,
  Flame,
  UserCheck
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function MlEvaluationPage() {
  const { selectedDistrictId } = useNavigationStore();

  // Selected evaluation thresholds (Section 6)
  const [threshold, setThreshold] = useState<number>(0.50);

  // Confusion matrix display mode: 'absolute' | 'percentage' (Section 3)
  const [matrixMode, setMatrixMode] = useState<'absolute' | 'percentage'>('percentage');

  // Interactive explanation tooltip states (Section 8 SHAP / Hover)
  const [hoveredShapFeature, setHoveredShapFeature] = useState<string | null>(null);

  // Active sub-district or decile error analysis view selection (Section 9)
  const [activeErrorTab, setActiveErrorTab] = useState<'district' | 'decile' | 'typology'>('district');

  // Breadcrumb items
  const breadcrumbs = [
    { label: 'RANCAGE DSS' },
    { label: 'ML Evaluation Center', active: true }
  ];

  // SECTION 2: Baseline Metrics at default threshold 0.50
  const baselineKpis = {
    accuracy: { current: '89.4%', benchmark: '82.1%', interpretation: 'Overall correct classification rate across poor and non-poor rosters.', status: 'excellent' },
    precision: { current: '87.5%', benchmark: '76.2%', interpretation: 'Out of all predicted poor, percentage who are truly below poverty line.', status: 'excellent' },
    recall: { current: '91.2%', benchmark: '80.5%', interpretation: 'Out of all truly poor families, percentage successfully target-captured.', status: 'excellent' },
    f1Score: { current: '89.3%', benchmark: '78.3%', interpretation: 'Harmonic mean balancing leakage and undercoverage errors.', status: 'excellent' },
    rocAuc: { current: '0.942', benchmark: '0.860', interpretation: 'Socioeconomic ranking and sorting power across all possible thresholds.', status: 'excellent' },
    logLoss: { current: '0.245', benchmark: '0.412', interpretation: 'Closeness of predicted probability models to direct binary welfare outcomes.', status: 'excellent' },
    balancedAccuracy: { current: '88.9%', benchmark: '81.0%', interpretation: 'Average of recall rates across both poor and non-poor classes.', status: 'excellent' },
    mcc: { current: '0.781', benchmark: '0.620', interpretation: 'Correlation balance checking even if welfare classes are highly unbalanced.', status: 'excellent' }
  };

  // SECTION 3: Dynamic Confusion Matrix calculated from selected threshold
  // As the threshold rises, fewer households are predicted poor (decreases False Positives, increases False Negatives)
  const computedMatrix = useMemo(() => {
    // Total simulated households = 10,000
    const truePoor = 3500;
    const trueNonPoor = 6500;

    // Shift metrics depending on threshold (0.10 to 0.90)
    const factor = (threshold - 0.5) * 2; // range [-1, 1]

    // Base values at 0.50
    let tp = Math.round(3192 - (factor * 600)); // True Poor predicted Poor
    let fn = truePoor - tp;                      // True Poor predicted Non-Poor (Exclusion)
    let fp = Math.round(455 - (factor * 400));   // True Non-Poor predicted Poor (Inclusion)
    let tn = trueNonPoor - fp;                   // True Non-Poor predicted Non-Poor

    // Bound values
    if (tp < 1000) tp = 1000;
    if (tp > 3400) tp = 3400;
    fn = truePoor - tp;
    if (fp < 50) fp = 50;
    if (fp > 1800) fp = 1800;
    tn = trueNonPoor - fp;

    const total = tp + fn + fp + tn;

    // Derived Simulation Metrics
    const precisionSim = (tp / (tp + fp)) * 100;
    const recallSim = (tp / (tp + fn)) * 100;
    const inclusionError = (fp / (tp + fp)) * 100; // leakage
    const exclusionError = (fn / (tp + fn)) * 100; // undercoverage

    return {
      tp,
      fn,
      fp,
      tn,
      total,
      precisionSim: precisionSim.toFixed(1),
      recallSim: recallSim.toFixed(1),
      inclusionError: inclusionError.toFixed(1),
      exclusionError: exclusionError.toFixed(1),
      eligibleHouseholds: tp + fp,
      rejectedHouseholds: tn + fn
    };
  }, [threshold]);

  // SECTION 4: Precision-Recall Curves Data
  const prCurveData = [
    { th: 0.1, precision: 45, recall: 99, f1: 62 },
    { th: 0.2, precision: 54, recall: 98, f1: 70 },
    { th: 0.3, precision: 68, recall: 96, f1: 80 },
    { th: 0.4, precision: 79, recall: 94, f1: 86 },
    { th: 0.5, precision: 87.5, recall: 91.2, f1: 89.3 },
    { th: 0.6, precision: 92, recall: 83, f1: 87 },
    { th: 0.7, precision: 95, recall: 71, f1: 81 },
    { th: 0.8, precision: 97, recall: 55, f1: 70 },
    { th: 0.9, precision: 99, recall: 32, f1: 48 },
  ];

  // SECTION 5: ROC Curve Data
  const rocCurveData = [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.02, tpr: 0.35 },
    { fpr: 0.05, tpr: 0.62 },
    { fpr: 0.07, tpr: 0.912 }, // optimal
    { fpr: 0.15, tpr: 0.94 },
    { fpr: 0.30, tpr: 0.97 },
    { fpr: 0.50, tpr: 0.99 },
    { fpr: 1.00, tpr: 1.00 },
  ];

  // SECTION 7: Feature Importance (Top 15 Variables)
  const featureImportances = [
    { name: 'Housing Quality Index', score: 0.245, category: 'Housing' },
    { name: 'Head of Household Schooling Years', score: 0.182, category: 'Education' },
    { name: 'Electricity Connection Wattage', score: 0.124, category: 'Utilities' },
    { name: 'Drinking Water Source Access', score: 0.098, category: 'Sanitation' },
    { name: 'Sanitation System Deprivation', score: 0.088, category: 'Sanitation' },
    { name: 'Household Productive Assets', score: 0.065, category: 'Assets' },
    { name: 'Head Occupation / Informal Labor Status', score: 0.054, category: 'Employment' },
    { name: 'Total Cohabiting Dependents', score: 0.045, category: 'Demographics' },
    { name: 'Broadband / Cellular Internet Access', score: 0.038, category: 'Utilities' },
    { name: 'Floor Material Composition', score: 0.028, category: 'Housing' },
    { name: 'Chronic Illness Healthcare Gaps', score: 0.015, category: 'Health' },
    { name: 'Arable Land Area Owned', score: 0.011, category: 'Assets' },
    { name: 'Recipient of Subsidized Rice (Raskin)', score: 0.005, category: 'Welfare' },
    { name: 'Disability Head of Household', score: 0.002, category: 'Demographics' }
  ];

  // SECTION 8: SHAP Values Metadata & Hover Explanation
  const shapFeatures = [
    {
      name: 'Housing Quality Index',
      direction: 'Negative (-)',
      magnitude: 'Very High',
      interpretation: 'Providing substandard outer walls (bamboo, unfinished timber) heavily increases predicted poverty likelihood.',
      policy: 'Aligns budget lines with rural home rehabilitation programs (Rutilahu).'
    },
    {
      name: 'Head of Household Schooling Years',
      direction: 'Negative (-)',
      magnitude: 'High',
      interpretation: 'Completing primary or junior-high education dramatically lowers predicted poverty probability.',
      policy: 'Supports continuous educational cash benefits (KIP) to break intergenerational poverty traps.'
    },
    {
      name: 'Sanitation System Deprivation',
      direction: 'Positive (+)',
      magnitude: 'Medium-High',
      interpretation: 'Having no access to private latrines or holding tanks flags extreme welfare deprivation.',
      policy: 'Justifies localized sanitation infrastructure outlays in category IV pockets.'
    },
    {
      name: 'Drinking Water Source Access',
      direction: 'Negative (-)',
      magnitude: 'Medium',
      interpretation: 'Relying on unprotected wells or river water contributes strongly to the deprivation multiplier.',
      policy: 'Directly informs rural clean water network expansion targets (Pamsimas).'
    },
    {
      name: 'Household Productive Assets',
      direction: 'Negative (-)',
      magnitude: 'Medium',
      interpretation: 'Ownership of functioning vehicles or agricultural machines serves as a robust non-poor proxy.',
      policy: 'Ensures support shifts from direct cash to productive micro-capital grants as assets accumulate.'
    }
  ];

  // SECTION 9: Error Breakdown Tables
  const districtErrors = [
    { district: 'Kabupaten Tasikmalaya', inclusion: '4.1%', exclusion: '3.2%', sample: 2450, typology: 'Category IV' },
    { district: 'Kabupaten Garut', inclusion: '3.8%', exclusion: '2.9%', sample: 2100, typology: 'Category III' },
    { district: 'Kabupaten Cianjur', inclusion: '3.5%', exclusion: '3.1%', sample: 1980, typology: 'Category IV' },
    { district: 'Kabupaten Sukabumi', inclusion: '2.9%', exclusion: '2.6%', sample: 1840, typology: 'Category III' },
    { district: 'Kota Bandung', inclusion: '1.2%', exclusion: '1.1%', sample: 1200, typology: 'Category I' },
    { district: 'Kota Tasikmalaya', inclusion: '3.1%', exclusion: '2.4%', sample: 850, typology: 'Category II' },
  ];

  const decileErrors = [
    { decile: 'Decile 1 (Poorest 10%)', inclusion: '0.8%', exclusion: '1.1%', impact: 'Excellent coverage of core poor' },
    { decile: 'Decile 2', inclusion: '3.1%', exclusion: '2.4%', impact: 'High precision zone' },
    { decile: 'Decile 3', inclusion: '7.8%', exclusion: '5.9%', impact: 'Vulnerable boundary buffer' },
    { decile: 'Decile 4 (Near Poor)', inclusion: '12.4%', exclusion: '9.2%', impact: 'High variance near eligibility threshold' },
  ];

  // SECTION 10: Fairness Metrics Comparison
  const fairnessMetrics = [
    { category: 'Spatial Scope', groupA: 'Urban Areas (Kota)', valA: '91.2% Acc', groupB: 'Rural Areas (Kab.)', valB: '88.5% Acc', diff: '2.7%', status: 'Within Fairness Boundary' },
    { category: 'Household Head Gender', groupA: 'Male Headed', valA: '89.6% Acc', groupB: 'Female Headed (PEKKA)', valB: '89.1% Acc', diff: '0.5%', status: 'Within Fairness Boundary' },
    { category: 'Socioeconomic Age Demographics', groupA: 'Adult (Age 18-60)', valA: '89.8% Acc', groupB: 'Elderly Headed (>60)', valB: '87.4% Acc', diff: '2.4%', status: 'Within Fairness Boundary' },
    { category: 'Disability Status', groupA: 'No Disability Profile', valA: '89.5% Acc', groupB: 'Disability Cohort', valB: '88.9% Acc', diff: '0.6%', status: 'Within Fairness Boundary' }
  ];

  // SECTION 11: Model Comparison Table
  const modelComparisons = [
    { model: 'Baseline OLS PMT (Traditional)', accuracy: '82.1%', precision: '76.2%', recall: '80.5%', inclusion: '8.4%', exclusion: '6.9%', sla: '12ms' },
    { model: 'Gradient Boosting (XGBoost v2.1)', accuracy: '89.4%', precision: '87.5%', recall: '91.2%', inclusion: '3.4%', exclusion: '2.9%', sla: '35ms' },
    { model: 'Random Forest Ensemble', accuracy: '87.9%', precision: '85.1%', recall: '88.4%', inclusion: '4.6%', exclusion: '4.1%', sla: '45ms' },
    { model: 'Deep Neural Network (MLP)', accuracy: '88.6%', precision: '84.9%', recall: '90.1%', inclusion: '5.2%', exclusion: '3.4%', sla: '110ms' }
  ];

  // SECTION 12: Model Governance
  const governanceLogs = [
    { version: 'v2.1.2-STABLE', date: '2026-07-15', author: 'Bappeda Jabar Data Core', description: 'Updated hyperparameters with L1/L2 regularization to lower urban-rural inclusion discrepancy.' },
    { version: 'v2.1.0-RC3', date: '2026-05-14', author: 'Dinsos Jabar Analyst', description: 'Incorporated village-level spatial fixed effects derived from Klassen typology indices.' },
    { version: 'v1.4.0', date: '2025-11-02', author: 'Sensus Data Unit', description: 'Initial deployment based on national Susenas sample training models.' }
  ];

  // Simulation threshold narrative text (Section 6)
  const getThresholdNarrative = () => {
    if (threshold < 0.40) {
      return "Low threshold configuration detects almost all vulnerable households, resulting in an exceptionally low Exclusion Error (undercoverage). However, this aggressively increases the Inclusion Error (leakage). This strategy is highly suited for comprehensive, universal basic aid scenarios but demands substantial fiscal budgets and increases public leakage concerns.";
    } else if (threshold > 0.60) {
      return "High threshold configuration focuses strictly on families showing extreme, unambiguous markers of destitution. This leads to very low Inclusion Error (almost zero leakage). However, it introduces severe Exclusion Error, missing families who hover just below the line. This fits tight fiscal austerity budgets but leaves vulnerable groups exposed.";
    } else {
      return "Balanced threshold represents the optimal policy compromise. It maximizes the F1 metric, balancing exclusion and inclusion errors inside statutory safety bounds. Budget allocation remains predictable while minimizing public field friction during verification sweeps.";
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Machine Learning Evaluation Center"
        description="Auditing model integrity, forecasting budget-error tradeoffs, and monitoring algorithmic fairness."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-blue-500" />
              <span>Training Frame:</span>
              <strong className="text-slate-800 dark:text-slate-200">Susenas Jabar Q3</strong>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span>Evaluated:</span>
              <strong className="text-slate-800 dark:text-slate-200">2026-07-15</strong>
            </div>
          </div>
        }
      />

      {/* SECTION 1: EXECUTIVE MODEL SUMMARY */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Model Suitability & Deployment Readiness Assessment
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">DECISION EVALUATION DESK</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-600 dark:text-slate-300">
          <div className="lg:col-span-8 space-y-4 text-xs leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase font-mono tracking-wider mb-1">
                Overall Performance & Predictive Capacity
              </h4>
              <p>
                The RANCAGE Gradient Boosting model achieves an overall Accuracy of <strong className="text-slate-900 dark:text-white">89.4%</strong>, representing a substantial <strong className="text-emerald-600 dark:text-emerald-400">+7.3% predictive uplift</strong> compared to traditional OLS-based proxy models. The Area Under the ROC Curve (AUC-ROC) remains highly robust at <strong className="text-slate-900 dark:text-white">0.942</strong>, showcasing superior discriminative power in ranking households by true consumption capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[10px] uppercase font-mono mb-0.5">
                  Algorithm Strengths
                </h5>
                <p className="text-[11px] text-slate-500">
                  Highly resilient to missing demographic covariates; excels at capturing complex non-linear interactions between housing quality, floor material, and localized spatial indicators without overfitting.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[10px] uppercase font-mono mb-0.5">
                  Known Limitations
                </h5>
                <p className="text-[11px] text-slate-500">
                  Exhibits minor variance near the decile boundaries (D3/D4) where households experience temporal seasonal employment shocks that traditional survey registers capture slowly.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-900 pt-3 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xs">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase font-mono">
                  Policy Readiness & Deployment Recommendation
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <strong>RECOMMENDED FOR FULL PRODUCTION DEPLOYMENT:</strong> Model meets and exceeds all Bappeda governance mandates. It provides sufficient precision-safety boundaries to prevent public complaints regarding exclusion errors, keeping undercoverage leakage under the 3% threshold when operating at the optimal 0.50 threshold calibration.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 rounded-sm p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">EVALUATION BASELINES</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] border-b border-slate-100 dark:border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-mono">MODEL ARCH</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">XGBoost v2.1.2</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-b border-slate-100 dark:border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-mono">TUNING CV</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">5-Fold Stratified</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-b border-slate-100 dark:border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-mono">TRAIN LOSS</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">0.218</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-mono">MODEL STATUS</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded-sm uppercase">
                    STABLE ACTIVE
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-900 mt-2 flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
              <Award className="h-4 w-4 text-blue-500" />
              <span>Meets ISO/IEC 24028 AI Bias Standards</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PERFORMANCE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Accuracy */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Accuracy</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.accuracy.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.accuracy.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+7.3%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.accuracy.interpretation}</p>
        </div>

        {/* Card 2: Precision */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Precision</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.precision.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.precision.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+11.3%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.precision.interpretation}</p>
        </div>

        {/* Card 3: Recall */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Recall (Sensitivity)</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.recall.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.recall.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+10.7%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.recall.interpretation}</p>
        </div>

        {/* Card 4: F1 Score */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">F1-Score</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.f1Score.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.f1Score.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+11.0%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.f1Score.interpretation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 5: ROC AUC */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">ROC AUC</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.rocAuc.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.rocAuc.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+0.082</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.rocAuc.interpretation}</p>
        </div>

        {/* Card 6: Log Loss */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Log Loss</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.logLoss.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.logLoss.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">-0.167</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.logLoss.interpretation}</p>
        </div>

        {/* Card 7: Balanced Accuracy */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Balanced Acc</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.balancedAccuracy.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.balancedAccuracy.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+7.9%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.balancedAccuracy.interpretation}</p>
        </div>

        {/* Card 8: MCC */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Matthews Corr (MCC)</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Bench: {baselineKpis.mcc.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.mcc.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+0.161</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.mcc.interpretation}</p>
        </div>
      </div>

      {/* SECTION 3: CONFUSION MATRIX & THRESHOLD SIMULATION BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Confusion Matrix */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Interactive Confusion Matrix Audit
              </h4>
            </div>
            <div className="flex rounded-sm bg-slate-100 dark:bg-slate-900 p-1 text-[10px] font-bold font-mono">
              <button
                onClick={() => setMatrixMode('absolute')}
                className={`px-2 py-1 rounded-xs transition-colors ${matrixMode === 'absolute' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Absolute
              </button>
              <button
                onClick={() => setMatrixMode('percentage')}
                className={`px-2 py-1 rounded-xs transition-colors ${matrixMode === 'percentage' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Percentage
              </button>
            </div>
          </div>

          {/* Matrix Grid Representation */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            {/* Top Row Labeling */}
            <div className="flex items-center justify-center font-bold text-[10px] text-slate-400 uppercase font-mono">
              True Class ↓
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900">
              <span className="text-[10px] text-slate-400 font-bold font-mono">PREDICTED POOR</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900">
              <span className="text-[10px] text-slate-400 font-bold font-mono">PREDICTED NON-POOR</span>
            </div>

            {/* Row 1: True Poor */}
            <div className="flex items-center justify-center p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900 text-center font-bold text-[10px] text-slate-400 uppercase font-mono">
              Poor (Eligible)
            </div>
            
            {/* Cell 1: True Positive */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-sm text-center transition-colors hover:bg-emerald-100/60 dark:hover:bg-emerald-950/30 cursor-help">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 font-mono uppercase">True Positive (TP)</span>
              <span className="text-xl font-bold font-mono text-emerald-900 dark:text-emerald-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.tp : `${((computedMatrix.tp / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-500 mt-1">Successfully Target-Captured</span>
              
              {/* Custom tooltip explaining TP */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-emerald-400">True Positive (TP)</strong>
                Socioeconomically poor households correctly predicted by the system and allocated interventions.
              </div>
            </div>

            {/* Cell 2: False Negative (Exclusion Error) */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-sm text-center transition-colors hover:bg-rose-100/60 dark:hover:bg-rose-950/30 cursor-help">
              <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 font-mono uppercase">False Negative (FN)</span>
              <span className="text-xl font-bold font-mono text-rose-900 dark:text-rose-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.fn : `${((computedMatrix.fn / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-rose-600 dark:text-rose-500 mt-1">Exclusion Error (Missed)</span>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-rose-400">False Negative (FN)</strong>
                Truly poor households missed by the model. These families are excluded from benefits, leading to target gaps.
              </div>
            </div>

            {/* Row 2: True Non-Poor */}
            <div className="flex items-center justify-center p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900 text-center font-bold text-[10px] text-slate-400 uppercase font-mono">
              Non-Poor
            </div>

            {/* Cell 3: False Positive (Inclusion Error) */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-sm text-center transition-colors hover:bg-amber-100/60 dark:hover:bg-amber-950/30 cursor-help">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 font-mono uppercase">False Positive (FP)</span>
              <span className="text-xl font-bold font-mono text-amber-900 dark:text-amber-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.fp : `${((computedMatrix.fp / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-500 mt-1">Inclusion Error (Leakage)</span>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-amber-400">False Positive (FP)</strong>
                Non-poor families erroneously predicted poor. Leads to leakage of government funds to unintended families.
              </div>
            </div>

            {/* Cell 4: True Negative */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-sm text-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-help">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 font-mono uppercase">True Negative (TN)</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.tn : `${((computedMatrix.tn / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-slate-500 mt-1">Correctly Denied Welfare</span>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-slate-400">True Negative (TN)</strong>
                Non-poor households correctly classified by the algorithm. No intervention allocated.
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center italic leading-relaxed">
            *Hover over any matrix cell to audit its specific policy impact and classification logic.
          </p>
        </div>

        {/* SECTION 6: THRESHOLD SIMULATION */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Interactive Poverty-Threshold Policy Simulator
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-xs">
              Simulating n=10,000 HH
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase font-mono">Decision Threshold</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {threshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-sm appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>0.10 (Maximize Coverage)</span>
                <span>0.50 (Optimal Balanced)</span>
                <span>0.90 (Austerity Targeting)</span>
              </div>
            </div>

            {/* Updated Results Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-sm border border-slate-100 dark:border-slate-900">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">Inclusion Error</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.inclusionError}%
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">Exclusion Error</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.exclusionError}%
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">Eligible (Poor)</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.eligibleHouseholds} HH
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">Rejected HH</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.rejectedHouseholds} HH
                </span>
              </div>
            </div>

            {/* Narrative Area */}
            <div className="p-3 bg-blue-50/40 dark:bg-slate-900/20 border-l-2 border-blue-500 rounded-xs">
              <h5 className="font-bold text-[10px] text-blue-700 dark:text-blue-400 uppercase font-mono tracking-wider mb-1">
                Policy & Fiscal Trade-off Analysis
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {getThresholdNarrative()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 & SECTION 5: PR CURVE & ROC CHART BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 4: Precision-Recall Curve Analysis */}
        <ChartContainer
          title="Precision-Recall Trade-off Curves"
          subtitle="Plotting model precision, recall sensitivity, and balanced F1 metrics at varying cutoff parameters."
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
              <XAxis dataKey="th" name="Threshold" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <RechartsTooltip />
              <RechartsLegend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              <Line type="monotone" dataKey="precision" stroke="#3b82f6" strokeWidth={2.5} name="Precision (Leakage Resist)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="recall" stroke="#fb7185" strokeWidth={2.5} name="Recall (Capture Power)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="f1" stroke="#34d399" strokeWidth={2} strokeDasharray="4 4" name="Balanced F1 Index" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* SECTION 5: ROC Curve */}
        <ChartContainer
          title="Receiver Operating Characteristic (ROC) Curve"
          subtitle="Plotting True Positive Rate against False Positive Rate. Highlight indicates the optimal classification balance."
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rocCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rocColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
              <XAxis dataKey="fpr" tick={{ fill: '#94a3b8', fontSize: 10 }} name="FPR" />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} name="TPR" />
              <RechartsTooltip />
              <Area type="monotone" dataKey="tpr" stroke="#3b82f6" fillOpacity={1} fill="url(#rocColor)" strokeWidth={2.5} name="True Positive Rate" />
              {/* Dotted Reference Line */}
              <Line type="monotone" dataKey="fpr" stroke="#cbd5e1" strokeDasharray="3 3" name="Random Guess Line" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* METRICS INTERPRETATIONS (Under Section 4 & 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/30 p-4 border border-slate-100 dark:border-slate-800 rounded-sm text-xs">
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase font-mono tracking-wider">
            Precision Policy Impact
          </h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            High precision means low leakage. It ensures that taxpayers do not see social funds leaking to non-poor families. Valuable for highly visible regional cash disbursements.
          </p>
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase font-mono tracking-wider">
            Recall Policy Impact
          </h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            High recall means complete safety-nets. It guarantees that the poorest of the poor are successfully covered by the model, minimizing political friction and social undercoverage complaints.
          </p>
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase font-mono tracking-wider">
            ROC AUC Interpretation
          </h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            An AUC score of 0.942 proves the model is extremely robust at separating poverty strata. Even if the absolute poverty line changes, the ranking of households remains statistically sound.
          </p>
        </div>
      </div>

      {/* SECTION 7: FEATURE IMPORTANCE CHART */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">VARIABLE ESTIMATION ATTRIBUTIONS</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Gradient Boosting Feature Importance (Top Variables Model Audit)
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Calculated using Gain Weight metrics</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="space-y-3">
              {featureImportances.slice(0, 10).map((feat, index) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      {feat.name}
                    </span>
                    <span className="font-mono text-slate-500">{(feat.score * 100).toFixed(1)}% weight</span>
                  </div>
                  {/* Custom progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-sm overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-sm transition-all duration-500"
                      style={{ width: `${(feat.score / 0.25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30 p-5 rounded-sm border border-slate-100 dark:border-slate-900">
            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase font-mono tracking-wider">
                Feature Attribution & Policy Linkages
              </h5>
              <p className="leading-relaxed">
                The chart displays the relative gain metrics computed across all decision trees. In our audited ensemble, <strong className="text-slate-900 dark:text-white">Housing Quality Index</strong> stands as the primary predictor (<strong className="text-slate-900 dark:text-white">24.5%</strong>), closely followed by <strong className="text-slate-900 dark:text-white">Schooling Years</strong> of the household head (<strong className="text-slate-900 dark:text-white">18.2%</strong>).
              </p>
              <p className="leading-relaxed">
                This proves that the algorithm is targeting structural deprivations rather than fluctuating short-term indicators. Implementing housing renovations and senior-school incentives directly alleviates the model indicators, establishing a clear link between social programs and algorithmic classification.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
              <Info className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Regularized to restrict volatile demographic bias</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8: MODEL EXPLAINABILITY & SHAP REVELATIONS */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-rose-500" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Model Explainability (SHAP Value Local Approximations)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">SHAP SUMMARY COEF_</span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
          SHAP (SHapley Additive exPlanations) values decompose how each individual feature pushes a household's prediction score relative to the average baseline. Green indicators represent features lowering predicted poverty likelihood; red bars represent factors increasing poverty probability.
        </p>

        {/* Placeholder SHAP Visual Force Diagram */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-sm space-y-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">SIMULATED CORE SHAP FORCE PLOT</span>
          
          <div className="flex items-center w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden text-[10px] font-bold font-mono text-white select-none">
            <div className="bg-rose-500 h-full flex items-center justify-center transition-opacity" style={{ width: '45%' }}>
              POOR FORCES (+45%)
            </div>
            <div className="bg-emerald-500 h-full flex items-center justify-center transition-opacity" style={{ width: '55%' }}>
              NON-POOR FORCES (-55%)
            </div>
          </div>
          
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>High Poverty Probability (Red)</span>
            <span>Median Poverty Line Offset</span>
            <span>Low Poverty Probability (Green)</span>
          </div>
        </div>

        {/* Feature SHAP Matrix Explainer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {shapFeatures.map((feat) => {
            const isHovered = hoveredShapFeature === feat.name;
            return (
              <div
                key={feat.name}
                onMouseEnter={() => setHoveredShapFeature(feat.name)}
                onMouseLeave={() => setHoveredShapFeature(null)}
                className={`p-4 rounded-sm border transition-all cursor-default ${
                  isHovered
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-slate-900 shadow-xs'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">{feat.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 rounded-sm uppercase font-mono ${
                    feat.direction.includes('Negative') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' : 'bg-rose-100 text-rose-700 dark:bg-rose-950'
                  }`}>
                    {feat.direction}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Magnitude</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{feat.magnitude} Impact</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">SHAP Interpretation</span>
                    <p className="text-slate-500 leading-snug mt-0.5">{feat.interpretation}</p>
                  </div>
                  {isHovered && (
                    <div className="pt-2 border-t border-blue-100 dark:border-slate-800 text-[10px] text-blue-700 dark:text-blue-400 animate-in fade-in duration-200">
                      <strong>Policy Action:</strong> {feat.policy}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 9: ERROR ANALYSIS & HEATMAP BREAKDOWN */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">TARGETING PRECISION DRILLDOWN</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Spatiotemporal & Segmented Error Analysis
            </h4>
          </div>
          <div className="flex rounded-sm bg-slate-100 dark:bg-slate-900 p-1 text-[10px] font-bold font-mono">
            <button
              onClick={() => setActiveErrorTab('district')}
              className={`px-3 py-1.5 rounded-xs transition-colors ${activeErrorTab === 'district' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              By District
            </button>
            <button
              onClick={() => setActiveErrorTab('decile')}
              className={`px-3 py-1.5 rounded-xs transition-colors ${activeErrorTab === 'decile' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              By Decile
            </button>
          </div>
        </div>

        {activeErrorTab === 'district' ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                  <th className="py-2.5 px-3">District (Kabupaten/Kota)</th>
                  <th className="py-2.5 px-3">Growth Typology</th>
                  <th className="py-2.5 px-3">Inclusion Error (Leakage)</th>
                  <th className="py-2.5 px-3">Exclusion Error (Missed Poor)</th>
                  <th className="py-2.5 px-3 text-right">Audited Sample HH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                {districtErrors.map((row) => (
                  <tr key={row.district} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 font-medium">
                    <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">{row.district}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-sm">
                        {row.typology}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.inclusion}</span>
                        {/* Heatmap intensity indicator */}
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${parseFloat(row.inclusion) * 20}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.exclusion}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: `${parseFloat(row.exclusion) * 20}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono">{row.sample} HH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                  <th className="py-2.5 px-3">Welfare Segment</th>
                  <th className="py-2.5 px-3">Inclusion Error (Leakage)</th>
                  <th className="py-2.5 px-3">Exclusion Error (Missed Poor)</th>
                  <th className="py-2.5 px-3">Policy Assessment impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                {decileErrors.map((row) => (
                  <tr key={row.decile} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 font-medium">
                    <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">{row.decile}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.inclusion}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${parseFloat(row.inclusion) * 8}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.exclusion}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: `${parseFloat(row.exclusion) * 8}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 italic">{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 10: FAIRNESS & BIAS MONITORING */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Algorithmic Fairness & Bias Monitor
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm">
            NO BIAS DETECTED
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
          The Bappeda policy guidelines dictate that targeting algorithms must remain neutral across gender, geography, age, and disability. The table below monitors the performance gap between protected categories to ensure compliance with human-rights-aligned AI governance.
        </p>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                <th className="py-2.5 px-3">Comparison Category</th>
                <th className="py-2.5 px-3">Reference Group A</th>
                <th className="py-2.5 px-3">Performance Group B</th>
                <th className="py-2.5 px-3 text-center">Variance Gap</th>
                <th className="py-2.5 px-3 text-right">Regulatory Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
              {fairnessMetrics.map((row) => (
                <tr key={row.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 font-medium">
                  <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">{row.category}</td>
                  <td className="py-3 px-3 text-slate-500">{row.groupA} <strong className="text-slate-700 dark:text-slate-300 ml-1">({row.valA})</strong></td>
                  <td className="py-3 px-3 text-slate-500">{row.groupB} <strong className="text-slate-700 dark:text-slate-300 ml-1">({row.valB})</strong></td>
                  <td className="py-3 px-3 text-center font-mono text-slate-900 dark:text-slate-100 font-bold">{row.diff}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm uppercase">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 11 & SECTION 12: MODEL COMPARISON & GOVERNANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 11: Model Comparisons */}
        <div className="lg:col-span-7 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Model Benchmarking Registry
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Benchmark: OLS PMT</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                  <th className="py-2 px-2">Classifier Model</th>
                  <th className="py-2 px-2">Accuracy</th>
                  <th className="py-2 px-2">Precision</th>
                  <th className="py-2 px-2">Recall</th>
                  <th className="py-2 px-2">Leakage</th>
                  <th className="py-2 px-2 text-right">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                {modelComparisons.map((row) => (
                  <tr key={row.model} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="py-2.5 px-2 font-bold text-slate-900 dark:text-slate-100">{row.model}</td>
                    <td className="py-2.5 px-2 font-mono">{row.accuracy}</td>
                    <td className="py-2.5 px-2 font-mono">{row.precision}</td>
                    <td className="py-2.5 px-2 font-mono">{row.recall}</td>
                    <td className="py-2.5 px-2 font-mono text-amber-600">{row.inclusion}</td>
                    <td className="py-2.5 px-2 text-right text-slate-400 font-mono">{row.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 12: Model Governance & Parameters */}
        <div className="lg:col-span-5 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Model Version History & Governance
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Hyperparameters Audit</span>
          </div>

          <div className="space-y-4 text-xs">
            {governanceLogs.map((log) => (
              <div key={log.version} className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{log.version}</span>
                  <span className="text-slate-400 font-mono">{log.date}</span>
                </div>
                <p className="text-slate-500 leading-snug">{log.description}</p>
                <div className="text-[9px] text-slate-400 font-mono">Author: {log.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 13: TECHNICAL NOTES / POLICY GLOSSARY */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-slate-900 text-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Shield className="h-4 w-4 text-amber-500" />
          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">
            Policymaker Technical Metric Translator (Plain Language Guide)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs leading-relaxed text-slate-400">
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">Accuracy vs Balanced Acc</strong>
            <p>
              Standard accuracy can mask bad performance if classes are unbalanced. Balanced accuracy represents the average rate of successfully classifying poor and non-poor families independently.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">Exclusion Error (Missed Poor)</strong>
            <p>
              When a truly poor household is classified as non-poor. In government policy, this leads to public complaints, local friction, and a failure to protect vulnerable communities.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">Inclusion Error (Leakage)</strong>
            <p>
              When a non-poor household is incorrectly classified as poor, leaking limited social budgets to affluent families. Reducing this maximizes fiscal matching efficiency.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">What is a SHAP Force?</strong>
            <p>
              SHAP tells us the contribution of each household metric on its classification result. It shows the relative weights of predictors, allowing us to explain the exact structural causes of poverty classifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
