import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Info,
  Server,
  Database,
  History,
  CheckCircle2,
  Lock,
  ChevronRight,
  Download,
  Terminal,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Globe2,
  Sliders,
  UserCheck
} from 'lucide-react';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { KpiCard } from '../ui/KpiCard.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// Early Warning Alerts Data
const EWS_ALERTS_DATABASE = [
  {
    id: 'EWS-ALT-01',
    category: 'Increasing Poverty',
    title: 'Severe Headcount (P0) Spike Flagged',
    severity: 'CRITICAL',
    description: 'Kabupaten Tasikmalaya Southern agrarian sub-district headcount indexes exceeded the 12.0% safety bounds threshold.',
    reason: 'Heavy seasonal pre-harvest drought triggered consumption collapses in smallholder rice-farming households.',
    impact: 'Poverty Severity Index (P2) is expected to rise by +0.08 locally, plunging 4,200 border households into absolute poverty.',
    suggestedAction: 'Deploy emergency food cash assistance buffers (BPNT Top-Up) and seed subsidies directly to farmers in drought-affected clusters.',
    agency: 'Dinas Sosial Provinsi Jawa Barat',
    district: 'Kabupaten Tasikmalaya',
    confidence: 0.94
  },
  {
    id: 'EWS-ALT-02',
    category: 'High Exclusion Error',
    title: 'Welfare Register Exclusions Flagged',
    severity: 'CRITICAL',
    description: 'Garut highland settlements show an alarming 8.7% targeting exclusion error spike.',
    reason: 'Delayed civil registry database synchronization; 1,200 eligible Decile 1 households remain unregistered on unified rosters.',
    impact: 'High risk of social friction and budget misallocation away from validated extreme poverty blocks.',
    suggestedAction: 'Launch localized physical sweep teams with tablets to register and deduplicate highland households immediately.',
    agency: 'Disdukcapil & Dinas Sosial Jabar',
    district: 'Kabupaten Garut',
    confidence: 0.91
  },
  {
    id: 'EWS-ALT-03',
    category: 'Model Performance Degradation',
    title: 'Predictive Classifier Weights Decay',
    severity: 'WARNING',
    description: 'Gradient Boosting (GBM) model prediction drift exceeded the 3.5% stability tolerance.',
    reason: 'Asset data inputs are outdated; 2025 Susenas assets indicators are no longer aligned with rapid urbanization rates in Cirebon.',
    impact: 'Predictive PMT scores show minor accuracy drift, risking a 4% rise in regional targeting leakage.',
    suggestedAction: 'Execute full machine learning model recalibration using the newly validated 2026 Q2 micro-survey weights.',
    agency: 'Bappeda Jabar Data Core Unit',
    district: 'Provincial Scale',
    confidence: 0.96
  },
  {
    id: 'EWS-ALT-04',
    category: 'Increasing P1',
    title: 'Poverty Gap Index (P1) Spurt',
    severity: 'WARNING',
    description: 'Indramayu coastal sub-districts register an average P1 poverty depth increase of +0.35 points.',
    reason: 'Sharp wage drops in the local informal maritime transport sectors due to high fuel tariff index adjustments.',
    impact: 'The depth of poverty is increasing, requiring higher per-household cash transfers to lift people above the baseline.',
    suggestedAction: 'Distribute fuel subsidies explicitly to small-boat marine transport license holders on D1/D2 rosters.',
    agency: 'Dinas Perikanan & Kelautan Jabar',
    district: 'Kabupaten Indramayu',
    confidence: 0.93
  },
  {
    id: 'EWS-ALT-05',
    category: 'Increasing Within Theil',
    title: 'Within-District Spatial Inequality Gain',
    severity: 'WARNING',
    description: 'Kabupaten Bandung within-district Theil index rose by +0.018 points.',
    reason: 'Unbalanced economic growth centered on industrial corridors leaving rural mountain villages lagging behind.',
    impact: 'Widening Gini inequalities and increased risk of rural-to-urban population pressure spikes.',
    suggestedAction: 'Direct infrastructure funding to mountain roads and local agricultural cooperative networks.',
    agency: 'Bappeda Kabupaten Bandung',
    district: 'Kabupaten Bandung',
    confidence: 0.88
  },
  {
    id: 'EWS-ALT-06',
    category: 'Missing Data',
    title: 'Asset Survey Data Gap Flagged',
    severity: 'INFORMATION',
    description: 'Over 850 rural records in Pangandaran missing standard floor-material attributes.',
    reason: 'Physical tablets sync failed during the rainy season field surveys.',
    impact: 'Prevents PMT scores from calculating correctly, temporarily blocking household targeting inclusion checks.',
    suggestedAction: 'Trigger a targeted re-survey command to the specific sub-district field monitors.',
    agency: 'Dinsos Pangandaran Survey Team',
    district: 'Kabupaten Pangandaran',
    confidence: 0.95
  },
  {
    id: 'EWS-ALT-07',
    category: 'High Inclusion Error',
    title: 'Target Leakage / Overlap Alert',
    severity: 'WARNING',
    description: 'Bekasi industrial corridor rosters showing overlap with private MSME corporate CSR disbursements.',
    reason: 'Lack of shared registers between private philanthropic channels and unified government database records.',
    impact: 'Dual-benefit overlapping, reducing the availability of public funds for unserved Decile 1 cohorts.',
    suggestedAction: 'Integrate Bekasi industrial association registers into RANCAGE open deduplication APIs.',
    agency: 'Dinas Koperasi & UMKM Jabar',
    district: 'Kabupaten Bekasi',
    confidence: 0.89
  },
  {
    id: 'EWS-ALT-08',
    category: 'Delayed Verification',
    title: 'Local Welfare Register Signoff Delay',
    severity: 'INFORMATION',
    description: 'Sukabumi local authority verification is delayed by 14 days.',
    reason: 'Administrative backlog in municipal district approval offices due to personnel rotations.',
    impact: 'Postpones Q3 benefit disbursements to 8,500 waiting households.',
    suggestedAction: 'Issue an automated high-priority reminder email dispatch to the Sukabumi regional secretariat.',
    agency: 'Dinas Sosial Jabar',
    district: 'Kabupaten Sukabumi',
    confidence: 0.90
  }
];

// DATA SOURCES & QUALITY SCORE DATABASE (Governance Center)
const DATA_QUALITY_METRICS = {
  completeness: 98.4,
  timeliness: 96.2,
  consistency: 99.1,
  validationStatus: 'SECURED_COMPLIANT'
};

const AUDIT_LOG_DATABASE = [
  { id: 'LOG-001', timestamp: '2026-07-19 10:14:02', user: 'usr_dsos_01 (Dinas Sosial Jabar)', action: 'Exported Household PMT Microdata', scope: 'Cisolok (Sukabumi) - 450 HH Records Masked', status: 'SUCCESS' },
  { id: 'LOG-002', timestamp: '2026-07-19 09:41:11', user: 'usr_bapp_02 (Bappeda Jabar)', action: 'Viewed Machine Learning Model Evaluation', scope: 'Provincial ML Pipeline Weights', status: 'SUCCESS' },
  { id: 'LOG-003', timestamp: '2026-07-19 08:12:44', user: 'anonymous_fingerprint', action: 'Direct API Microdata Query Attempt', scope: 'REST Endpoint /api/microdata/secure', status: 'FORBIDDEN_ACL' },
  { id: 'LOG-004', timestamp: '2026-07-19 07:33:02', user: 'usr_sys_admin (System Administrator)', action: 'Calibrated PMT Model Weights', scope: 'Gradient Boosting (GBM) v2.1 Pipeline', status: 'SUCCESS' },
  { id: 'LOG-005', timestamp: '2026-07-18 16:45:19', user: 'usr_dpupr_03 (Dinas PUPR Jabar)', action: 'Modified Intervention Progress', scope: 'PROG-01 (Rural Water Supply Grid)', status: 'SUCCESS' },
  { id: 'LOG-006', timestamp: '2026-07-18 14:12:00', user: 'usr_dsos_01 (Dinas Sosial Jabar)', action: 'Deduplicated Household Registry', scope: 'Garut Highland - 1,200 HH Records Calibrated', status: 'SUCCESS' }
];

const GOVERNANCE_RESOURCES = [
  { name: 'Unified Welfare Registry (DTKS Synchronized)', format: 'Holographic Postgres Node', lastUpdate: '2026-07-18', size: '24.5 GB', agency: 'Dinas Sosial / Kemensos' },
  { name: 'Susenas Household Socioeconomic Survey', format: 'Flat BPS Parquet', lastUpdate: '2026-07-15', size: '1.2 GB', agency: 'Badan Pusat Statistik' },
  { name: 'West Java Spatial Shapefiles (Bappeda Layer)', format: 'GeoJSON Coordinate Node', lastUpdate: '2026-07-10', size: '420 MB', agency: 'Bappeda Jabar GIS Division' },
  { name: 'RANCAGE PMT Model Weights & Ensembles', format: 'ONNX ML Model Pipeline', lastUpdate: '2026-07-01', size: '85 MB', agency: 'Bappeda Jabar Data Core Unit' }
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<'EWS' | 'GOV'>('EWS');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [ewsSearchQuery, setEwsSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered EWS alerts list
  const filteredEwsAlerts = useMemo(() => {
    return EWS_ALERTS_DATABASE.filter(alt => {
      const matchesSeverity = severityFilter === 'ALL' || alt.severity === severityFilter;
      const matchesSearch = alt.title.toLowerCase().includes(ewsSearchQuery.toLowerCase()) ||
        alt.category.toLowerCase().includes(ewsSearchQuery.toLowerCase()) ||
        alt.district.toLowerCase().includes(ewsSearchQuery.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [severityFilter, ewsSearchQuery]);

  const handleRefreshPipeline = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert('RANCAGE Early Warning & Model Pipeline weights re-synced in 0.05s!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Intelligence, Risk & Governance Center"
        description="Dual administration panel overseeing automated risk alerts, machine learning model health, security access logs, and dataset synchronicity."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefreshPipeline}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm text-xs font-semibold flex items-center gap-1.5"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 text-blue-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Re-syncing...' : 'Force Pipeline Re-sync'}</span>
            </button>
            <div className="flex rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('EWS')}
                className={`px-3 py-1.5 text-xs font-semibold ${activeTab === 'EWS' ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-white dark:bg-slate-950 text-slate-600 hover:bg-slate-50'}`}
              >
                Early Warning Center
              </button>
              <button
                onClick={() => setActiveTab('GOV')}
                className={`px-3 py-1.5 text-xs font-semibold ${activeTab === 'GOV' ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-white dark:bg-slate-950 text-slate-600 hover:bg-slate-50'}`}
              >
                Governance & Security Audit
              </button>
            </div>
          </div>
        }
      />

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Active Risk Trigger Feed"
          value={`${EWS_ALERTS_DATABASE.filter(a => a.severity === 'CRITICAL').length} CRITICAL`}
          change={`${EWS_ALERTS_DATABASE.length} Alerts Active`}
          trend="up"
          trendDirection="negative"
          description="Total computed early alerts requiring immediate agency intervention."
        />
        <KpiCard
          title="Data Quality Index"
          value="98.1%"
          change="SLA Target 95.0%"
          trend="up"
          trendDirection="positive"
          description="Combined score for database completeness, timeliness, and consistency."
        />
        <KpiCard
          title="Last Pipeline Calibration"
          value="ONNX v2.1"
          change="Calibrated Q4"
          trend="neutral"
          trendDirection="neutral"
          description="Gradient Boosting weights and decision thresholds stability index."
        />
        <KpiCard
          title="Secure Replication Status"
          value="SYNCED"
          change="Replication Lag: 14ms"
          trend="up"
          trendDirection="positive"
          description="Postgres node real-time replication health."
        />
      </div>

      {activeTab === 'EWS' ? (
        <>
          {/* EARLY WARNING CENTER */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">INTELLIGENCE RADAR</span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                  Early Warning Alerts & Risk Classification Feed
                </h4>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search alert by district/type..."
                    value={ewsSearchQuery}
                    onChange={(e) => setEwsSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs focus:outline-none focus:border-blue-500 w-48 font-semibold text-slate-600 dark:text-slate-300"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1 px-2 focus:outline-none focus:border-blue-500 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    <option value="ALL">All Severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="WARNING">Warning</option>
                    <option value="INFORMATION">Information</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid layout of active alerts */}
            <div className="grid grid-cols-1 gap-4">
              {filteredEwsAlerts.length > 0 ? (
                filteredEwsAlerts.map(alertItem => (
                  <div
                    key={alertItem.id}
                    className={`p-4 border rounded-sm flex flex-col md:flex-row justify-between gap-4 transition-all duration-150 ${
                      alertItem.severity === 'CRITICAL' ? 'border-rose-100 bg-rose-50/10 dark:border-rose-950/40 dark:bg-rose-950/5' :
                      alertItem.severity === 'WARNING' ? 'border-amber-100 bg-amber-50/10 dark:border-amber-950/40 dark:bg-amber-950/5' :
                      'border-blue-100 bg-blue-50/10 dark:border-blue-950/40 dark:bg-blue-950/5'
                    }`}
                  >
                    <div className="space-y-2 text-xs flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-sm font-mono font-bold text-[9px] uppercase ${
                          alertItem.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' :
                          alertItem.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {alertItem.severity}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] font-bold">CATEGORY: {alertItem.category}</span>
                        <span className="text-slate-400 font-mono text-[10px]">• DISTRICT: {alertItem.district}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{alertItem.title}</h4>
                      
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{alertItem.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-900 pt-2 text-[11px] text-slate-500">
                        <div>
                          <strong>Root Cause / Reason:</strong> <span className="italic">&ldquo;{alertItem.reason}&rdquo;</span>
                        </div>
                        <div>
                          <strong>Potential Multi-Welfare Impact:</strong> <span className="italic">&ldquo;{alertItem.impact}&rdquo;</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xs border border-slate-100 dark:border-slate-800 mt-2 text-[11px]">
                        <span className="font-bold text-blue-600 dark:text-blue-400 font-mono uppercase block text-[9px]">RECOMMENDED CORRECTIVE ACTION</span>
                        <p className="text-slate-600 dark:text-slate-300 font-semibold mt-0.5">{alertItem.suggestedAction}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end shrink-0 text-right text-[10px] font-mono text-slate-400 md:w-44 border-l border-slate-100 dark:border-slate-900 pl-4">
                      <div className="space-y-1">
                        <span className="block uppercase font-bold text-[9px] text-slate-400 leading-tight">Responsible Bureau</span>
                        <span className="block font-sans font-bold text-slate-700 dark:text-slate-300 mt-0.5">{alertItem.agency}</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Signal confidence: <strong className="text-emerald-600 font-bold">{(alertItem.confidence * 100).toFixed(0)}%</strong>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  All risks secure. No early warnings generated matching criteria.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* GOVERNANCE & SECURITY AUDIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* AUDIT COCKPIT & DATA SOURCES */}
            <div className="lg:col-span-7 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">REGULATORY TRANSPARENCY</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                    RANCAGE Standardized Dataset Source & Versioning Node
                  </h4>
                </div>

                <div className="space-y-3">
                  {GOVERNANCE_RESOURCES.map((res) => (
                    <div key={res.name} className="p-3 border border-slate-100 dark:border-slate-900 rounded-sm flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Database className="h-4 w-4 text-blue-500 shrink-0" />
                          <strong className="text-slate-800 dark:text-slate-100 font-bold">{res.name}</strong>
                        </div>
                        <span className="block text-[10px] text-slate-400">Owner Agency: {res.agency}</span>
                      </div>
                      <div className="text-right font-mono text-[10px] text-slate-400 space-y-1">
                        <span className="block">Last Synced: <strong className="text-slate-700 dark:text-slate-200">{res.lastUpdate}</strong></span>
                        <span className="block">{res.size} ({res.format})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DATA QUALITY BREAKDOWN CARD */}
              <div className="border-t border-slate-100 dark:border-slate-900 pt-4 mt-4 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold mb-2">Automated Quality Scoring Breakdown</span>
                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-sm border border-slate-100 dark:border-slate-900">
                    <span className="block text-[8px] text-slate-400 font-bold">COMPLETENESS</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">{DATA_QUALITY_METRICS.completeness}%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-sm border border-slate-100 dark:border-slate-900">
                    <span className="block text-[8px] text-slate-400 font-bold">TIMELINESS</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">{DATA_QUALITY_METRICS.timeliness}%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-sm border border-slate-100 dark:border-slate-900">
                    <span className="block text-[8px] text-slate-400 font-bold">CONSISTENCY</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">{DATA_QUALITY_METRICS.consistency}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE SYSTEM AUDIT LOGS & ACCESS HISTORY */}
            <div className="lg:col-span-5 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-900 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">AUDIT REPOSITORY</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                      Session Logs & Security Access Registry
                    </h4>
                  </div>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-mono px-2 py-0.5 font-bold rounded-sm">
                    ACTIVE SESSIONS: 14
                  </span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {AUDIT_LOG_DATABASE.map(log => (
                    <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 rounded-sm space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className={`font-bold ${log.status.includes('SUCCESS') ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200">
                        {log.user} <span className="font-normal text-slate-400 font-mono">({log.action})</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Scope Flag: {log.scope}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-400 font-mono leading-relaxed mt-4 flex items-center gap-1">
                <Lock className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Audited logs are legally sealed under PDP cyber privacy bylaws.</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
