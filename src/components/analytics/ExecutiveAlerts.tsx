import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ShieldAlert, Zap, Clock } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface AlertItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  explanation: string;
  affectedRegion: string;
}

const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: 'alt_01',
    title: 'Severe Headcount Spike Flagged',
    message: 'Kabupaten Tasikmalaya headcount rate breached the 12.0% safety boundary limit.',
    timestamp: '10:14:02 AM',
    severity: 'critical',
    explanation: 'The latest Q4 sub-district survey aggregates show a sudden agricultural income contraction. The local P0 rate spiked from 11.8% to 12.11%, breaching the statutory stabilization tolerance levels.',
    affectedRegion: 'Kab. Tasikmalaya'
  },
  {
    id: 'alt_02',
    title: 'High Exclusion Targeting Deviation',
    message: 'Kabupaten Sukabumi PKH targeting reports a high exclusion rate (+11.8%).',
    timestamp: '09:45:11 AM',
    severity: 'critical',
    explanation: 'Over 1,200 eligible D1 (Poorest) households were omitted from active social welfare programs (PKH) due to non-matching national identification database inputs.',
    affectedRegion: 'Kab. Sukabumi'
  },
  {
    id: 'alt_03',
    title: 'Staple Food Price Index Breach',
    message: 'Kota Tasikmalaya food staple baskets climbed 14.2% above baseline thresholds.',
    timestamp: '07:30:15 AM',
    severity: 'warning',
    explanation: 'Due to local supply line delays, basic commodity prices surged. This sudden consumption pressure threatens to push marginal households from D3/D4 deciles down into D2.',
    affectedRegion: 'Kota Tasikmalaya'
  },
  {
    id: 'alt_04',
    title: 'Welfare Roster Calibration Deviation',
    message: 'Garut D1 welfare roster shows a +3.8% targeting deviation error.',
    timestamp: '06:12:44 AM',
    severity: 'warning',
    explanation: 'Audit algorithms discovered minor targeting drift where households in higher income bands (D3-D4) were incorrectly categorized in the poorest roster.',
    affectedRegion: 'Kab. Garut'
  },
  {
    id: 'alt_05',
    title: 'Model Recalibration Routine Logged',
    message: 'Proxy Means Test machine learning weights require Q4 recalibration.',
    timestamp: 'Yesterday, 04:30 PM',
    severity: 'info',
    explanation: 'Routine system maintenance logs state that PMT Gradient Boosting coefficients require synchronization against the newly published BPS consumption aggregates.',
    affectedRegion: 'Provincial Level'
  },
  {
    id: 'alt_06',
    title: 'Survey Infiltration Log Verified',
    message: 'Indramayu data collection synchronization successfully logged.',
    timestamp: 'Yesterday, 01:15 PM',
    severity: 'info',
    explanation: 'Central database completed secure synchronization with 4,200 newly audited household records in northern rural Indramayu.',
    affectedRegion: 'Kab. Indramayu'
  }
];

export function ExecutiveAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>(DEFAULT_ALERTS);
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter((alt) => {
    if (activeTab === 'all') return true;
    return alt.severity === activeTab;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.filter((alt) => alt.id !== id));
  };

  const getSeverityStyles = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-50/70 border-rose-100 dark:bg-rose-950/15 dark:border-rose-900/40',
          text: 'text-rose-900 dark:text-rose-400',
          border: 'border-rose-200 dark:border-rose-900/30',
          icon: AlertCircle,
          label: 'Critical Priority'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/70 border-amber-100 dark:bg-amber-950/15 dark:border-amber-900/40',
          text: 'text-amber-900 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-900/30',
          icon: AlertTriangle,
          label: 'Warning Flag'
        };
      case 'info':
        return {
          bg: 'bg-blue-50/70 border-blue-100 dark:bg-blue-950/15 dark:border-blue-900/40',
          text: 'text-blue-900 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-900/30',
          icon: Info,
          label: 'System Notice'
        };
    }
  };

  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 shadow-2xs overflow-hidden" id="executive-alerts-card">
      
      {/* Title Header */}
      <div className="border-b border-slate-50 dark:border-slate-900 px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
            Early Warning System (EWS) Active Alerts Feed
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Operational real-time flags targeting administrative outliers, statistical anomalies, and fiscal leaks.
          </p>
        </div>

        {/* Tab filters inside header */}
        <div className="flex gap-1 border border-slate-100 dark:border-slate-800 p-0.5 rounded bg-slate-50/50 dark:bg-slate-900">
          {(['all', 'critical', 'warning', 'info'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-2.5 py-1 rounded-xs text-[9px] font-bold uppercase transition-all',
                activeTab === tab
                  ? 'bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950 shadow-3xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              )}
            >
              {tab === 'all' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alert List Grid */}
      <div className="p-5">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">No Active Triggers</h5>
            <p className="text-[11px] text-slate-400">All regional indicators remain safely within RPJMD safety thresholds.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAlerts.map((alt) => {
              const style = getSeverityStyles(alt.severity);
              const Icon = style.icon;

              return (
                <div 
                  key={alt.id}
                  className={cn(
                    'border rounded-sm p-4.5 flex flex-col justify-between space-y-3 transition-all hover:shadow-2xs',
                    style.bg,
                    style.border
                  )}
                >
                  <div className="space-y-2">
                    {/* Header line of alert */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-800/20 pb-2">
                      <span className={cn('inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider', style.text)}>
                        <Icon className="h-3 w-3 shrink-0" />
                        {style.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alt.timestamp}
                      </span>
                    </div>

                    {/* Alert summary and dynamic explanation */}
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {alt.title}
                      </h5>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold italic">
                        {alt.message}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 font-medium">
                        {alt.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Actions line */}
                  <div className="pt-2.5 border-t border-slate-200/20 dark:border-slate-800/20 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900/5 dark:bg-slate-50/5 px-2 py-0.5 rounded">
                      SCOPE: {alt.affectedRegion}
                    </span>
                    <button
                      onClick={() => handleAcknowledge(alt.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-sm text-slate-600 dark:text-slate-300 transition-colors uppercase tracking-wider"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
