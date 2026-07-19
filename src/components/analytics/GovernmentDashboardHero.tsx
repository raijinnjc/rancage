import React from 'react';
import { 
  Compass, 
  HelpCircle, 
  TrendingDown, 
  Map, 
  ListOrdered, 
  CheckSquare, 
  FileText, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';

export function GovernmentDashboardHero() {
  const { navigateTo } = useNavigationStore();

  const coreQuestions = [
    {
      num: '1',
      question: 'What is happening?',
      concept: 'Poverty & Disparity Tracking',
      description: 'Provincial headcount averages, poverty depth indices, and consumption inequalities.',
      anchorId: 'executive-kpi-summary-grid',
      color: 'border-blue-500/25 bg-blue-500/5 hover:bg-blue-500/10'
    },
    {
      num: '2',
      concept: 'Intra-District Drivers',
      question: 'Why is it happening?',
      description: 'Theil disparity decomposition showing within-district disparities versus between-district gaps.',
      anchorId: 'theil-decomposition-standalone-card',
      color: 'border-purple-500/25 bg-purple-500/5 hover:bg-purple-500/10'
    },
    {
      num: '3',
      concept: 'Spatial Hotspots',
      question: 'Where is it happening?',
      description: 'GIS interactive choropleth map highlighting agricultural belts and industrial corridor outliers.',
      anchorId: 'interactive-map-root',
      color: 'border-teal-500/25 bg-teal-500/5 hover:bg-teal-500/10'
    },
    {
      num: '4',
      concept: 'District Prioritization Index',
      question: 'Who should be prioritized?',
      description: 'Top 10 priority ranking sorted by poverty incidence, regional typology, and inequality factors.',
      anchorId: 'regional-priority-ranking-card',
      color: 'border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10'
    },
    {
      num: '5',
      concept: 'Intervention Engine',
      question: 'What should policymakers do next?',
      description: 'Targeted policy matching, budget simulations, and early warning status logs.',
      anchorId: 'policy-recommendations-section',
      color: 'border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10'
    }
  ];

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-6 md:p-8 relative overflow-hidden" id="dashboard-hero-panel">
      {/* Dynamic background element for premium feel */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        {/* Top Badging row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
              RNC
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-blue-400 uppercase">
                Pemerintah Provinsi Jawa Barat • Bappeda
              </span>
              <h3 className="text-base font-black tracking-tight text-white uppercase mt-0.5">
                RANCAGE Decision Intelligence Platform
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono bg-blue-950 text-blue-400 border border-blue-900 px-2.5 py-1 rounded font-bold uppercase tracking-widest">
              SYSTEM LEVEL: AUTHORITATIVE CO-PILOT
            </span>
            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded font-bold uppercase tracking-widest">
              DATA SYNC: STABLE (Q4 2026)
            </span>
          </div>
        </div>

        {/* Core Description block */}
        <div className="max-w-4xl space-y-2">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-tight">
            Government Decision Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl font-medium">
            RANCAGE integrates multi-dimensional survey microdata, Klassen growth typologies, and machine-learning targeting algorithms into a single-pane executive console. This cockpit answers five structural policy questions immediately to direct target interventions.
          </p>
        </div>

        {/* 5 Questions HUD Grid */}
        <div className="space-y-3 pt-2">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
            Executive Decision Index (Click concept to jump directly to section)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreQuestions.map((q) => (
              <button
                key={q.num}
                onClick={() => handleScrollToSection(q.anchorId)}
                className={`p-4 rounded-sm border text-left flex flex-col justify-between h-40 transition-all duration-200 cursor-pointer ${q.color}`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Question 0{q.num}
                    </span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-black text-white leading-snug tracking-tight">
                    {q.question}
                  </h4>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 block tracking-wide uppercase">
                    {q.concept}
                  </span>
                  <p className="text-[10.5px] text-slate-400 leading-snug line-clamp-2">
                    {q.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
