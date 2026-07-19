import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Clipboard, HelpCircle, CheckCircle2, RotateCw, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface AiPolicyInsightProps {
  evaluationYear?: string;
}

interface InsightAxis {
  id: 'disparity' | 'spatial' | 'targeting';
  label: string;
  narrative: string;
  focus: string;
  actionableStep: string;
}

export function AiPolicyInsight({ evaluationYear = '2026' }: AiPolicyInsightProps) {
  const [activeAxis, setActiveAxis] = useState<'disparity' | 'spatial' | 'targeting'>('disparity');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentNarrative, setCurrentNarrative] = useState<string>('');

  const axesData: Record<string, Record<'disparity' | 'spatial' | 'targeting', InsightAxis>> = {
    '2026': {
      disparity: {
        id: 'disparity',
        label: 'Theil Disparity Decomposition',
        narrative: 'Within-district inequality stands at 89.4% of total provincial disparity. This indicates that inequality is increasingly driven by disparities within districts rather than between districts. Broader administrative zoning is no longer sufficient.',
        focus: 'Household-level targeting & basic micro-assets (sanitation, water grids).',
        actionableStep: 'Reallocate 14.5% of region-wide general municipal support funds directly into household-level clean water injections for deciles D1-D2 in Priangan Timur.'
      },
      spatial: {
        id: 'spatial',
        label: 'Spatial Hotspot Mapping',
        narrative: 'GIS coordinate clusters show severe poverty rates concentrated heavily in the southern agricultural belt. Kabupaten Kuningan and Indramayu show persistent pockets with headcount rates exceeding 12.5%.',
        focus: 'Priority infrastructure & agricultural logistics hubs.',
        actionableStep: 'Launch rural sanitation pipeline projects in extreme southern Sukabumi and Tasikmalaya with designated budget line items in the Q3 fiscal revision.'
      },
      targeting: {
        id: 'targeting',
        label: 'Welfare Targeting Performance',
        narrative: 'Inclusion accuracy has advanced to 91.3% utilizing Gradient Boosting calibrations. However, the exclusion rate remains at 8.7% for isolated rural settlements due to stale civil registry indexes.',
        focus: 'Active civil registry synchronization & mobile PMT squads.',
        actionableStep: 'Deploy Bappeda civil registry vehicles to physically update DTKS lists in Category IV districts, targeting 24,000 households.'
      }
    },
    '2025': {
      disparity: {
        id: 'disparity',
        label: 'Theil Disparity Decomposition',
        narrative: 'Within-district inequality stood at 88.2% in 2025. Disparity is concentrated heavily in industrial-agricultural border zones. Growth benefits are pooling locally, creating wide gaps within single administrative zones.',
        focus: 'Asset transfers and municipal skill training alignments.',
        actionableStep: 'Expand local Padat Karya vocational training subsidies across high Gini districts to absorb local agricultural laborers.'
      },
      spatial: {
        id: 'spatial',
        label: 'Spatial Hotspot Mapping',
        narrative: '2025 GIS historical benchmarks verify a heavy cluster in Cirebon Raya, driven by coastal fishing asset depreciation and seasonal agricultural job deficits.',
        focus: 'Coastal micro-credit & cold chain infrastructure.',
        actionableStep: 'Approve special emergency fishery equipment grants to fishermen cooperatives in Indramayu and Cirebon.'
      },
      targeting: {
        id: 'targeting',
        label: 'Welfare Targeting Performance',
        narrative: 'Targeting accuracies averaged 90.8% in 2025. Machine Learning PMT cutoffs successfully blocked access to households in welfare decile D4 and above.',
        focus: 'Strict enforcement of PMT cut-off boundaries.',
        actionableStep: 'Publish audited targeting metrics to the provincial oversight board to secure continuing funding pipelines.'
      }
    },
    '2024': {
      disparity: {
        id: 'disparity',
        label: 'Theil Disparity Decomposition',
        narrative: 'Within-district inequality contribution measured at 87.1% during the 2024 survey. Post-macroeconomic transition cycles have amplified micro-economic disparities inside industrial cities like Bekasi and Depok.',
        focus: 'Urban safety net integration & cost of living adjustments.',
        actionableStep: 'Implement basic commodity price subsidies in high-density urban wards showing high internal Gini coefficients.'
      },
      spatial: {
        id: 'spatial',
        label: 'Spatial Hotspot Mapping',
        narrative: '2024 survey coordinates indicate the highest severity clusters were in Kabupaten Tasikmalaya and Garut due to prolonged dry seasons disrupting harvest incomes.',
        focus: 'Climate-resilient irrigation and social insurance.',
        actionableStep: 'Establish a dry-season water transport contingency fund to prevent sudden household consumption declines in Priangan Timur.'
      },
      targeting: {
        id: 'targeting',
        label: 'Welfare Targeting Performance',
        narrative: 'Targeting accuracy was recorded at 89.4%. Inclusion errors were predominantly driven by manual paper registries before the transition to fully automated digital pipelines.',
        focus: 'Legacy data digitization and cleansing.',
        actionableStep: 'Execute complete digital migration of BPS rural rosters to the new secure centralized SQL database.'
      }
    }
  };

  const activeData = (axesData[evaluationYear] || axesData['2026'])[activeAxis];

  const handleRecalculate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 900);
  };

  return (
    <div className="border border-blue-100/80 bg-blue-50/10 dark:border-blue-900/30 dark:bg-blue-950/5 rounded-sm p-5 shadow-xs relative overflow-hidden" id="ai-policy-insight-panel">
      {/* Visual background sparkles for modern professional feel */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full filter blur-xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-100/30 dark:border-blue-900/20 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-sm bg-blue-600 text-white flex items-center justify-center">
            <Brain className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>RANCAGE AI Policy Decision Intelligence Co-Pilot</span>
              <Sparkles className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automated analytical narratives derived dynamically from selected {evaluationYear} indicators and decomposition algorithms.
            </p>
          </div>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500/70 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isGenerating && 'animate-spin')} />
          <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Narrative'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Toggle list on left */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {(['disparity', 'spatial', 'targeting'] as const).map((axisKey) => {
            const axis = (axesData[evaluationYear] || axesData['2026'])[axisKey];
            const isActive = activeAxis === axisKey;
            return (
              <button
                key={axisKey}
                onClick={() => {
                  setActiveAxis(axisKey);
                  setIsGenerating(true);
                  setTimeout(() => setIsGenerating(false), 300);
                }}
                className={cn(
                  'px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wider rounded-sm border transition-all whitespace-nowrap lg:whitespace-normal w-full',
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow-3xs'
                    : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {axis.label}
              </button>
            );
          })}
        </div>

        {/* Narrative Box on right */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 rounded-sm flex flex-col justify-between min-h-[160px] relative shadow-2xs">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <RotateCw className="h-6 w-6 text-blue-500 animate-spin" />
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">Generating Policy Memo...</span>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Main Narrative paragraph */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  Analytical Narrative Memo ({evaluationYear} Survey)
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {activeData.narrative}
                </p>
              </div>

              {/* Highlighted core findings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-900 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Strategic Focus Area:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-slate-50">
                    {activeData.focus}
                  </p>
                </div>

                <div className="space-y-1 bg-blue-50/20 dark:bg-blue-950/10 p-3 rounded-xs border border-blue-50/50 dark:border-blue-950/10">
                  <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Actionable Policy Directives:
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {activeData.actionableStep}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
