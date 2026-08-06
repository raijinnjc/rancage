import React, { useState } from 'react';
import { PageHeader } from '../ui/PageHeader.tsx';
import { Compass, Map, Activity } from 'lucide-react';
import { RegionalDiagnosisPage } from './RegionalDiagnosisPage.tsx';
import { RegionalTypologyPage } from './RegionalTypologyPage.tsx';

export function ExplorationPage() {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'typology'>('diagnosis');

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <PageHeader
        title="Eksplorasi Wilayah"
        description="Jelajahi matriks dekomposisi ketimpangan dan peta kuadran tipologi wilayah di Jawa Barat."
        icon={<Compass className="h-5 w-5 text-blue-500" />}
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'diagnosis'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <Activity className="h-4 w-4" />
          Dekomposisi & Tren (Theil/P0)
        </button>
        <button
          onClick={() => setActiveTab('typology')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'typology'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <Map className="h-4 w-4" />
          Peta Tipologi Wilayah
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'diagnosis' ? (
          <RegionalDiagnosisPage hideHeader />
        ) : (
          <RegionalTypologyPage hideHeader />
        )}
      </div>
    </div>
  );
}

export default ExplorationPage;
