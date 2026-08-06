import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Info, 
  TrendingDown, 
  Users, 
  CheckCircle, 
  Download, 
  Calculator, 
  PlayCircle,
  Loader2,
  FileText,
  TrendingUp,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
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
  Cell
} from 'recharts';

type ScenarioType = 'CCT' | 'INFRA' | 'VOCATIONAL';

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
}

export default function PolicyRecommendationPage() {
  // FORM STATES
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('CCT');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL_Q4');
  
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
    
    // Fake calculation delay
    setTimeout(() => {
      // Mock Baseline values based on district
      const isAll = selectedDistrict === 'ALL_Q4';
      const districtData = isAll ? null : WEST_JAVA_DISTRICTS.find(d => d.id === selectedDistrict);
      
      const baselineP0 = districtData ? districtData.p0 : 11.45; // average high poverty for Kuadran IV
      const baselineP1 = districtData ? (districtData.p0 * 0.15) : 1.75; 

      // Elasticity mock calculation
      let elasticityMultiplier = 1.0;
      if (selectedScenario === 'CCT') elasticityMultiplier = 1.2;
      if (selectedScenario === 'INFRA') elasticityMultiplier = 0.8;
      if (selectedScenario === 'VOCATIONAL') elasticityMultiplier = 0.9;

      const coverageFactor = coveragePercent / 100;
      // impact limits based on budget
      const budgetImpact = (budgetBillion / 100) * 0.5; 
      const timeImpact = durationMonths / 12;

      const rawP0Drop = (budgetImpact * coverageFactor * elasticityMultiplier * timeImpact);
      const deltaP0 = Math.min(rawP0Drop, baselineP0 * 0.4); // Cap max reduction at 40% of baseline

      const rawP1Drop = deltaP0 * 0.3; // P1 usually drops slower than P0
      const deltaP1 = Math.min(rawP1Drop, baselineP1 * 0.5);

      const newP0 = Math.max(0, baselineP0 - deltaP0);
      const newP1 = Math.max(0, baselineP1 - deltaP1);
      
      // Cost per 1% reduction in P0 (Miliar Rp / % drop)
      const ceRatio = deltaP0 > 0 ? (budgetBillion / deltaP0) : 0;

      const newSim: SimulationHistory = {
        id: `SIM-${Date.now().toString().slice(-6)}`,
        scenarioName: selectedScenario === 'CCT' ? 'Bantuan Tunai Bersyarat' : selectedScenario === 'INFRA' ? 'Subsidi Infrastruktur Dasar' : 'Program Vokasi & Pelatihan',
        districtName: isAll ? 'Semua Wilayah Kuadran IV' : districtData?.name || 'Wilayah Tidak Diketahui',
        budget: budgetBillion,
        baselineP0: Number(baselineP0.toFixed(2)),
        newP0: Number(newP0.toFixed(2)),
        deltaP0: Number(deltaP0.toFixed(2)),
        baselineP1: Number(baselineP1.toFixed(2)),
        newP1: Number(newP1.toFixed(2)),
        deltaP1: Number(deltaP1.toFixed(2)),
        costEffectivenessRatio: Number(ceRatio.toFixed(2))
      };

      setActiveSimulation(newSim);
      setHistory(prev => [newSim, ...prev]);
      setIsSimulating(false);
    }, 1200);
  };

  const getSortedHistory = () => {
    return [...history].sort((a, b) => {
      if (sortBy === 'ratio') return a.costEffectivenessRatio - b.costEffectivenessRatio; // Lower is better
      if (sortBy === 'p0') return b.deltaP0 - a.deltaP0; // Higher reduction is better
      if (sortBy === 'budget') return a.budget - b.budget; // Lower budget is better
      return 0;
    });
  };

  const triggerExport = (format: string) => {
    alert(`Ekspor ${format} berhasil! Dokumen ringkasan simulasi sedang diunduh.`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & DISCLAIMER */}
      <PageHeader
        title="Simulasi Skenario Kebijakan"
        description="Pengujian estimasi dampak statis dari berbagai intervensi anggaran terhadap kemiskinan dan ketimpangan."
      />
      
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-sm flex items-start gap-3 shadow-xs">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">Pemberitahuan Metodologis: Batasan Model Statis</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            Modul ini mensimulasikan dampak statis berbasis skenario berdasar elastisitas rata-rata historis menggunakan data cross-section (Susenas & Regsosek), BUKAN proyeksi dinamis berbasis data panel longitudinal per rumah tangga. Hasil adalah estimasi komparatif untuk membantu prioritas alokasi, bukan ramalan kausal (forecasting) ekonometrik yang mutlak.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: INPUT PARAMETER */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[12px] p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Parameter Skenario</h3>
            </div>

            {/* Pemilih Skenario */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Jenis Skenario Intervensi</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedScenario('CCT')}
                  className={`w-full text-left p-3 rounded-md border text-sm font-semibold transition-all ${selectedScenario === 'CCT' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Bantuan Tunai Bersyarat</span>
                    {selectedScenario === 'CCT' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-normal">Target: Desil 1–4 (Bawah)</span>
                </button>
                <button
                  onClick={() => setSelectedScenario('INFRA')}
                  className={`w-full text-left p-3 rounded-md border text-sm font-semibold transition-all ${selectedScenario === 'INFRA' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Subsidi Infrastruktur Dasar</span>
                    {selectedScenario === 'INFRA' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-normal">Target: Air bersih/sanitasi wilayah rentan</span>
                </button>
                <button
                  onClick={() => setSelectedScenario('VOCATIONAL')}
                  className={`w-full text-left p-3 rounded-md border text-sm font-semibold transition-all ${selectedScenario === 'VOCATIONAL' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Program Pelatihan Vokasi</span>
                    {selectedScenario === 'VOCATIONAL' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-normal">Target: Kelompok Menengah Rentan (Desil 5-7)</span>
                </button>
              </div>
            </div>

            {/* Wilayah Target */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Wilayah Target</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="ALL_Q4">Semua Wilayah Prioritas (Kuadran IV)</option>
                  <optgroup label="Kabupaten / Kota">
                    {WEST_JAVA_DISTRICTS.map(d => (
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
                <span className="text-slate-500 uppercase tracking-wide text-xs">Cakupan Populasi</span>
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
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all shadow-md active:scale-[0.98]"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Mengkalkulasi Model...
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
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[12px] p-6 shadow-sm min-h-[500px] flex flex-col">
            
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
                <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4">
                  <Activity className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h4 className="text-base font-bold text-slate-600 dark:text-slate-300">Belum Ada Skenario Dijalankan</h4>
                <p className="text-sm text-slate-400 mt-2 max-w-md">
                  Pilih skenario kebijakan, sesuaikan parameter anggaran dan sasaran di panel kiri, lalu tekan "Jalankan Simulasi" untuk melihat proyeksi dampak.
                </p>
              </div>
            )}

            {isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 animate-pulse">Memproses matriks komputasi PMT...</h4>
              </div>
            )}

            {activeSimulation && !isSimulating && (
              <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Kartu Perbandingan Dampak */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown className="h-5 w-5 text-blue-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Angka Kemiskinan (P0)</span>
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

                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown className="h-5 w-5 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kedalaman (P1)</span>
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
                <div className="h-64 border border-slate-100 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Baseline', P0: activeSimulation.baselineP0, P1: activeSimulation.baselineP1 * 5 }, // scale up P1 for visibility
                        { name: 'Skenario Kebijakan', P0: activeSimulation.newP0, P1: activeSimulation.newP1 * 5 }
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number, name: string) => [
                          name === 'P1' ? (value / 5).toFixed(2) : value + '%', // Unscale P1 for tooltip
                          name === 'P1' ? 'Indeks Kedalaman (P1)' : 'Headcount (P0)'
                        ]}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Bar yAxisId="left" dataKey="P0" name="Headcount (P0)" fill="#1F6BFF" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar yAxisId="left" dataKey="P1" name="Indeks Kedalaman (P1)" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Interpretasi Otomatis */}
                <div className="bg-blue-50/50 dark:bg-slate-900/40 border border-blue-100 dark:border-slate-800 p-4 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">Interpretasi Eksekutif Otomatis</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Implementasi <strong>{activeSimulation.scenarioName}</strong> di <strong>{activeSimulation.districtName}</strong> dengan komitmen anggaran sebesar <strong>Rp {activeSimulation.budget} Miliar</strong> (mencakup {coveragePercent}% dari target populasi rentan selama {durationMonths} bulan) diproyeksikan mampu menurunkan persentase kemiskinan sebesar <strong>{activeSimulation.deltaP0}% poin</strong>. Program ini juga diestimasi menurunkan tingkat kedalaman kemiskinan (P1) sebesar <strong>{activeSimulation.deltaP1}</strong>, membantu mengangkat rumah tangga rentan mendekati garis batas kelayakan.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* SECTION BAWAH: TABEL PERINGKAT EFEKTIVITAS BIAYA */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[12px] p-6 shadow-sm space-y-4">
        
        <div className="border-b border-slate-100 dark:border-slate-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Peringkat Efektivitas Biaya (Cost-Effectiveness)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Perbandingan histori skenario yang dieksekusi dalam sesi saat ini.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1.5 px-3 focus:outline-none focus:border-blue-500 font-semibold text-slate-600 dark:text-slate-300"
            >
              <option value="ratio">Rasio Terbaik (Biaya/Efektivitas)</option>
              <option value="p0">Penurunan P0 Terbesar</option>
              <option value="budget">Anggaran Terkecil</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <tr className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Skenario Intervensi</th>
                <th className="py-3 px-4">Wilayah Target</th>
                <th className="py-3 px-4 text-right">Anggaran</th>
                <th className="py-3 px-4 text-center">Δ Penurunan P0</th>
                <th className="py-3 px-4 text-center">Δ Penurunan P1</th>
                <th className="py-3 px-4 text-right">Biaya per 1% P0 (Rasio)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {history.length > 0 ? (
                getSortedHistory().map((item, index) => (
                  <tr key={item.id} className={`hover:bg-blue-50/30 dark:hover:bg-slate-900/50 transition-colors ${item.id === activeSimulation?.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                    <td className="py-3 px-4 text-[10px] font-bold text-slate-400">#{index + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{item.scenarioName}</td>
                    <td className="py-3 px-4">{item.districtName}</td>
                    <td className="py-3 px-4 text-right font-mono">Rp {item.budget} M</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">-{item.deltaP0}%</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400">-{item.deltaP1}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {item.costEffectivenessRatio > 0 ? `Rp ${item.costEffectivenessRatio} M` : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-normal">
                    Belum ada riwayat simulasi yang dijalankan.
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
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            Ekspor Dataset Excel
          </button>
          <button 
            onClick={() => triggerExport('Ringkasan PDF')}
            disabled={history.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileText className="h-4 w-4" />
            Ekspor Ringkasan PDF
          </button>
        </div>
      </div>
    </div>
  );
}
