import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Info, 
  TrendingDown, 
  CheckCircle, 
  Download, 
  Calculator, 
  PlayCircle,
  Loader2,
  FileText,
  TrendingUp,
  MapPin,
  ArrowRight,
  Activity
} from 'lucide-react';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

type ScenarioType = 'SCENARIO_1' | 'SCENARIO_2' | 'SCENARIO_3' | 'SCENARIO_4';

interface SimulationHistory {
  id: string;
  scenarioName: string;
  districtName: string;
  budget: number; // in Billion Rp
  baselineP0: number;
  newP0: number;
  deltaP0: number;
  baselineP1: number;
  newP1: number;
  deltaP1: number;
  costEffectivenessRatio: number; // Cost per 1% P0 reduction
  matchStatus: 'Sangat Cocok' | 'Cukup' | 'Kurang Cocok (Inefisien)';
  narrative: string;
}

const getDistrictQuadrant = (p0: number) => {
  if (p0 >= 10.0) return 4; // Kuadran IV: Miskin-Timpang
  if (p0 >= 7.02) return 3; // Kuadran III: Miskin-Merata
  if (p0 >= 5.0) return 2;  // Kuadran II: Sejahtera-Timpang
  return 1;                 // Kuadran I: Sejahtera-Merata
};

const DISTRICTS_ENRICHED = WEST_JAVA_DISTRICTS.map(d => {
  const q = getDistrictQuadrant(d.p0);
  return {
    ...d,
    quadrant: q,
    quadrantName: q === 4 ? 'Kuadran IV (Miskin-Timpang)' :
                  q === 3 ? 'Kuadran III (Miskin-Merata)' :
                  q === 2 ? 'Kuadran II (Sejahtera-Timpang)' :
                  'Kuadran I (Sejahtera-Merata)'
  };
});

export default function PolicyRecommendationPage() {
  // FORM STATES
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('SCENARIO_2');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('3206'); // Default to Tasikmalaya
  
  // PARAMETER STATES
  const [budgetBillion, setBudgetBillion] = useState<number>(50); // Miliar Rupiah
  const [coveragePercent, setCoveragePercent] = useState<number>(70); // % sasaran
  const [durationMonths, setDurationMonths] = useState<number>(12); // Bulan

  // SIMULATION STATES
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<SimulationHistory | null>(null);
  const [history, setHistory] = useState<SimulationHistory[]>([]);
  const [sortBy, setSortBy] = useState<'ratio' | 'p0' | 'budget'>('ratio');

  const handleRunSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const districtData = DISTRICTS_ENRICHED.find(d => d.id === selectedDistrict);
      if (!districtData) return;
      
      const baselineP0 = districtData.p0;
      const baselineP1 = baselineP0 * 0.15; 
      const districtQ = districtData.quadrant;

      // Smart Matching Logic & Elasticity
      let p0Multiplier = 0.5;
      let p1Multiplier = 0.5;
      let matchStatus: 'Sangat Cocok' | 'Cukup' | 'Kurang Cocok (Inefisien)' = 'Cukup';
      let scenarioTitle = '';
      
      if (selectedScenario === 'SCENARIO_1') {
        scenarioTitle = 'Bantuan Tunai & Padat Karya';
        if (districtQ === 3) {
          p0Multiplier = 1.8; p1Multiplier = 0.9; matchStatus = 'Sangat Cocok';
        } else if (districtQ === 1 || districtQ === 2) {
          p0Multiplier = 0.3; p1Multiplier = 0.2; matchStatus = 'Kurang Cocok (Inefisien)';
        }
      } else if (selectedScenario === 'SCENARIO_2') {
        scenarioTitle = 'Pembangunan Infrastruktur Dasar & Intervensi Struktural';
        if (districtQ === 4) {
          p0Multiplier = 1.2; p1Multiplier = 2.0; matchStatus = 'Sangat Cocok';
        } else if (districtQ === 1) {
          p0Multiplier = 0.2; p1Multiplier = 0.1; matchStatus = 'Kurang Cocok (Inefisien)';
        }
      } else if (selectedScenario === 'SCENARIO_3') {
        scenarioTitle = 'Pelatihan Vokasi, Padat Modal & Kredit Mikro';
        if (districtQ === 2) {
          p0Multiplier = 0.7; p1Multiplier = 1.8; matchStatus = 'Sangat Cocok';
        } else if (districtQ === 3 || districtQ === 4) {
          p0Multiplier = 0.4; p1Multiplier = 0.4; matchStatus = 'Kurang Cocok (Inefisien)';
        }
      } else if (selectedScenario === 'SCENARIO_4') {
        scenarioTitle = 'Jaring Pengaman Sosial & Pemantauan Stabil';
        if (districtQ === 1) {
          p0Multiplier = 1.5; p1Multiplier = 1.5; matchStatus = 'Sangat Cocok';
        } else if (districtQ === 4) {
          p0Multiplier = 0.1; p1Multiplier = 0.1; matchStatus = 'Kurang Cocok (Inefisien)';
        }
      }

      const coverageFactor = coveragePercent / 100;
      const budgetImpact = (budgetBillion / 100) * 0.4; 
      const timeImpact = durationMonths / 12;

      // Calculate drops
      const rawP0Drop = (budgetImpact * coverageFactor * p0Multiplier * timeImpact);
      const deltaP0 = Math.min(rawP0Drop, baselineP0 * (matchStatus === 'Sangat Cocok' ? 0.35 : 0.1));

      const rawP1Drop = (budgetImpact * coverageFactor * p1Multiplier * timeImpact);
      const deltaP1 = Math.min(rawP1Drop, baselineP1 * (matchStatus === 'Sangat Cocok' ? 0.4 : 0.15));

      const newP0 = Math.max(0, baselineP0 - deltaP0);
      const newP1 = Math.max(0, baselineP1 - deltaP1);
      
      const ceRatio = deltaP0 > 0 ? (budgetBillion / deltaP0) : 0;

      // Smart Narrative
      let narrative = `Implementasi ${scenarioTitle} di ${districtData.name} (${districtData.quadrantName}) dengan komitmen anggaran Rp ${budgetBillion} Miliar diproyeksikan menurunkan angka kemiskinan sebesar ${deltaP0.toFixed(2)}% poin dan indeks kedalaman sebesar ${deltaP1.toFixed(2)}. `;
      
      if (matchStatus === 'Sangat Cocok') {
        narrative += `Peringkat Kecocokan: TINGGI. Intervensi ini sangat tepat sasaran dengan akar masalah struktural di wilayah ini, menghasilkan efisiensi anggaran maksimal.`;
      } else if (matchStatus === 'Kurang Cocok (Inefisien)') {
        narrative += `Peringkat Kecocokan: RENDAH. Peringatan: Program ini berpotensi membengkakkan anggaran karena tidak menyasar akar masalah utama di kuadran ini. Disarankan beralih ke kebijakan yang lebih relevan.`;
      } else {
        narrative += `Peringkat Kecocokan: MENENGAH. Intervensi ini memberikan dampak standar namun mungkin bukan prioritas utama bagi karakteristik wilayah ini.`;
      }

      const newSim: SimulationHistory = {
        id: `SIM-${Date.now().toString().slice(-6)}`,
        scenarioName: scenarioTitle,
        districtName: districtData.name,
        budget: budgetBillion,
        baselineP0: Number(baselineP0.toFixed(2)),
        newP0: Number(newP0.toFixed(2)),
        deltaP0: Number(deltaP0.toFixed(2)),
        baselineP1: Number(baselineP1.toFixed(2)),
        newP1: Number(newP1.toFixed(2)),
        deltaP1: Number(deltaP1.toFixed(2)),
        costEffectivenessRatio: Number(ceRatio.toFixed(2)),
        matchStatus,
        narrative
      };

      setActiveSimulation(newSim);
      setHistory(prev => [newSim, ...prev]);
      setIsSimulating(false);
    }, 800);
  };

  const getSortedHistory = () => {
    return [...history].sort((a, b) => {
      if (sortBy === 'ratio') return a.costEffectivenessRatio - b.costEffectivenessRatio; 
      if (sortBy === 'p0') return b.deltaP0 - a.deltaP0; 
      if (sortBy === 'budget') return a.budget - b.budget; 
      return 0;
    });
  };

  const triggerExport = (format: string) => {
    if (history.length === 0) return;
    const headers = ['ID Simulasi', 'Skenario', 'Kabupaten/Kota', 'Anggaran (Miliar Rp)', 'P0 Awal (%)', 'P0 Baru (%)', 'Penurunan P0 (%)', 'P1 Awal', 'P1 Baru', 'Penurunan P1', 'Kecocokan', 'Biaya per 1% Penurunan (Miliar Rp)'];
    const rows = history.map(h => [
      h.id,
      `"${h.scenarioName}"`,
      `"${h.districtName}"`,
      h.budget,
      h.baselineP0,
      h.newP0,
      h.deltaP0,
      h.baselineP1,
      h.newP1,
      h.deltaP1,
      `"${h.matchStatus}"`,
      h.costEffectivenessRatio
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RANCAGE_simulasi_kebijakan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 page-transition stagger-children">
      <PageHeader
        title="Simulasi Skenario Kebijakan"
        description="Pengujian estimasi dampak statis berbasis Tipologi Kemiskinan-Ketimpangan (Kuadran I-IV)."
      />
      
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-sm flex items-start gap-3 shadow-xs">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">Pemberitahuan Metodologis: Batasan Model Statis</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            Modul ini mensimulasikan dampak statis berbasis skenario silang (cross-section) yang dicocokkan dengan resep kebijakan per kuadran. Modul akan memberi penalti efisiensi jika intervensi tidak sesuai dengan tipologi wilayah (misal: Bantuan Tunai di wilayah Kuadran Sejahtera). Hasil adalah estimasi komparatif, bukan ramalan mutlak.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: INPUT PARAMETER */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Parameter Skenario</h3>
            </div>

            {/* Pemilih Skenario */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Jenis Skenario Intervensi</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedScenario('SCENARIO_1')}
                  className={`w-full text-left p-3 rounded-sm border text-sm font-semibold transition-all ${selectedScenario === 'SCENARIO_1' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Skenario 1: Bantuan Tunai & Padat Karya</span>
                    {selectedScenario === 'SCENARIO_1' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-normal">Sangat efektif untuk: Kuadran III (Miskin-Merata)</span>
                </button>
                <button
                  onClick={() => setSelectedScenario('SCENARIO_2')}
                  className={`w-full text-left p-3 rounded-sm border text-sm font-semibold transition-all ${selectedScenario === 'SCENARIO_2' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Skenario 2: Infrastruktur Dasar (Air/Sanitasi)</span>
                    {selectedScenario === 'SCENARIO_2' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-normal">Sangat efektif untuk: Kuadran IV (Miskin-Timpang)</span>
                </button>
                <button
                  onClick={() => setSelectedScenario('SCENARIO_3')}
                  className={`w-full text-left p-3 rounded-sm border text-sm font-semibold transition-all ${selectedScenario === 'SCENARIO_3' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Skenario 3: Pelatihan Vokasi & Kredit Mikro</span>
                    {selectedScenario === 'SCENARIO_3' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-normal">Sangat efektif untuk: Kuadran II (Sejahtera-Timpang)</span>
                </button>
                <button
                  onClick={() => setSelectedScenario('SCENARIO_4')}
                  className={`w-full text-left p-3 rounded-sm border text-sm font-semibold transition-all ${selectedScenario === 'SCENARIO_4' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Skenario 4: Jaring Pengaman Sosial Reguler</span>
                    {selectedScenario === 'SCENARIO_4' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-normal">Sangat efektif untuk: Kuadran I (Sejahtera-Merata)</span>
                </button>
              </div>
            </div>

            {/* Wilayah Target Berdasarkan Kuadran */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Wilayah Target (Menurut Tipologi)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <optgroup label="Kuadran IV (Miskin-Timpang)">
                    {DISTRICTS_ENRICHED.filter(d => d.quadrant === 4).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Kuadran III (Miskin-Merata)">
                    {DISTRICTS_ENRICHED.filter(d => d.quadrant === 3).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Kuadran II (Sejahtera-Timpang)">
                    {DISTRICTS_ENRICHED.filter(d => d.quadrant === 2).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Kuadran I (Sejahtera-Merata)">
                    {DISTRICTS_ENRICHED.filter(d => d.quadrant === 1).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Anggaran */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 uppercase tracking-wide text-xs">Alokasi Anggaran</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">Rp {budgetBillion} Miliar</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={budgetBillion}
                onChange={(e) => setBudgetBillion(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Cakupan */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 uppercase tracking-wide text-xs">Cakupan Populasi Rentan</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">{coveragePercent}% Target</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={coveragePercent}
                onChange={(e) => setCoveragePercent(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Durasi */}
            <div className="space-y-2 pt-2 pb-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 uppercase tracking-wide text-xs">Durasi Pelaksanaan</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">{durationMonths} Bulan</span>
              </div>
              <input
                type="range"
                min="3"
                max="36"
                step="3"
                value={durationMonths}
                onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-sm transition-all shadow-md active:scale-[0.98]"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Mengkalkulasi Matriks...
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5" />
                  Jalankan Simulasi
                </>
              )}
            </button>
          </div>
        </div>

        {/* PANEL KANAN: HASIL SIMULASI */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm p-6 shadow-sm min-h-[500px] flex flex-col">
            
            <div className="border-b border-slate-100 dark:border-slate-900 pb-3 mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Hasil Proyeksi Dampak Statis</h3>
              {activeSimulation && (
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-sm font-bold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Simulasi Selesai
                </span>
              )}
            </div>

            {!activeSimulation && !isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4">
                  <Activity className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h4 className="text-base font-bold text-slate-600 dark:text-slate-300">Belum Ada Skenario Dijalankan</h4>
                <p className="text-sm text-slate-400 mt-2 max-w-md">
                  Pilih skenario kebijakan, sesuaikan parameter anggaran dan sasaran di panel kiri, lalu tekan "Jalankan Simulasi" untuk melihat tingkat efisiensi dan kecocokan program.
                </p>
              </div>
            )}

            {isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 animate-pulse">Menghitung elastisitas dan pencocokan silang...</h4>
              </div>
            )}

            {activeSimulation && !isSimulating && (
              <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Kartu Perbandingan Dampak */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown className="h-5 w-5 text-blue-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Kemiskinan (P0)</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono mb-1">Baseline Asal</div>
                        <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{activeSimulation.baselineP0}%</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 mb-2" />
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-mono mb-1">Proyeksi Skenario</div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{activeSimulation.newP0}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-sm ${activeSimulation.deltaP0 > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800'}`}>
                        {activeSimulation.deltaP0 > 0 ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                        Turun -{activeSimulation.deltaP0}% poin
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown className="h-5 w-5 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kedalaman Kemiskinan (P1)</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono mb-1">Baseline Asal</div>
                        <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{activeSimulation.baselineP1}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 mb-2" />
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-mono mb-1">Proyeksi Skenario</div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{activeSimulation.newP1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-sm ${activeSimulation.deltaP1 > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800'}`}>
                        {activeSimulation.deltaP1 > 0 ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                        Turun -{activeSimulation.deltaP1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grafik Komparatif Recharts */}
                <div className="h-64 border border-slate-200 dark:border-slate-800 rounded-sm p-4 bg-white dark:bg-slate-950">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Baseline Awal', P0: activeSimulation.baselineP0, P1: activeSimulation.baselineP1 * 5 }, // scale up P1 for visibility
                        { name: 'Setelah Intervensi', P0: activeSimulation.newP0, P1: activeSimulation.newP1 * 5 }
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-900)', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number, name: string) => [
                          name === 'P1' ? (value / 5).toFixed(2) : value + '%', // Unscale P1 for tooltip
                          name === 'P1' ? 'Indeks Kedalaman (P1)' : 'Tingkat Kemiskinan (P0)'
                        ]}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Bar yAxisId="left" dataKey="P0" name="Tingkat Kemiskinan (P0)" fill="#1F6BFF" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar yAxisId="left" dataKey="P1" name="Indeks Kedalaman (P1)" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Interpretasi Otomatis & Peringatan Efisiensi */}
                <div className={`border p-4 rounded-sm flex items-start gap-3 ${
                  activeSimulation.matchStatus === 'Sangat Cocok' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' :
                  activeSimulation.matchStatus === 'Kurang Cocok (Inefisien)' ? 'bg-red-50/50 border-red-100 dark:bg-red-900/20 dark:border-red-800' :
                  'bg-blue-50/50 border-blue-100 dark:bg-slate-900/40 dark:border-slate-800'
                }`}>
                  <Info className={`h-5 w-5 shrink-0 mt-0.5 ${
                    activeSimulation.matchStatus === 'Sangat Cocok' ? 'text-emerald-500' :
                    activeSimulation.matchStatus === 'Kurang Cocok (Inefisien)' ? 'text-red-500' :
                    'text-blue-500'
                  }`} />
                  <div>
                    <h5 className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                      activeSimulation.matchStatus === 'Sangat Cocok' ? 'text-emerald-700 dark:text-emerald-400' :
                      activeSimulation.matchStatus === 'Kurang Cocok (Inefisien)' ? 'text-red-700 dark:text-red-400' :
                      'text-blue-700 dark:text-blue-400'
                    }`}>Analisis Kecocokan Kebijakan Otomatis</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {activeSimulation.narrative}
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* SECTION BAWAH: TABEL PERINGKAT EFEKTIVITAS BIAYA */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm p-6 shadow-sm space-y-4">
        
        <div className="border-b border-slate-100 dark:border-slate-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Tabel Efektivitas Biaya (Cost-Effectiveness)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Perbandingan histori skenario yang dieksekusi dalam sesi saat ini berdasarkan inefisiensi biaya per 1% penurunan P0.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1.5 px-3 focus:outline-none focus:border-blue-500 font-semibold text-slate-600 dark:text-slate-300"
            >
              <option value="ratio">Rasio Paling Efisien (Termurah)</option>
              <option value="p0">Penurunan P0 Terbesar</option>
              <option value="budget">Anggaran Terkecil</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                <th className="py-3 px-4">Peringkat</th>
                <th className="py-3 px-4">Skenario Intervensi</th>
                <th className="py-3 px-4">Wilayah Target</th>
                <th className="py-3 px-4 text-right">Alokasi Anggaran</th>
                <th className="py-3 px-4 text-center">Penurunan P0</th>
                <th className="py-3 px-4 text-center">Kecocokan Tipologi</th>
                <th className="py-3 px-4 text-right">Biaya per 1% Penurunan (Efisiensi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {history.length > 0 ? (
                getSortedHistory().map((item, index) => (
                  <tr key={item.id} className={`hover:bg-blue-50/30 dark:hover:bg-slate-900/50 transition-colors ${item.id === activeSimulation?.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                    <td className="py-3 px-4 text-[10px] font-bold text-slate-400">#{index + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{item.scenarioName}</td>
                    <td className="py-3 px-4">{item.districtName}</td>
                    <td className="py-3 px-4 text-right font-mono text-blue-600 dark:text-blue-400">Rp {item.budget} M</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">-{item.deltaP0}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase ${
                        item.matchStatus === 'Sangat Cocok' ? 'bg-emerald-100 text-emerald-700' :
                        item.matchStatus === 'Kurang Cocok (Inefisien)' ? 'bg-red-100 text-red-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {item.matchStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {item.costEffectivenessRatio > 0 ? `Rp ${item.costEffectivenessRatio} M` : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-normal">
                    Belum ada riwayat simulasi yang dijalankan pada sesi ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AKSI EKSPOR */}
        <div className="pt-4 flex flex-wrap gap-3 justify-end">
          <button 
            onClick={() => triggerExport('Dataset Excel')}
            disabled={history.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-sm text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            Ekspor Dataset Excel
          </button>
          <button 
            onClick={() => triggerExport('Ringkasan PDF')}
            disabled={history.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-sm text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileText className="h-4 w-4" />
            Ekspor Ringkasan PDF
          </button>
        </div>
      </div>
    </div>
  );
}
