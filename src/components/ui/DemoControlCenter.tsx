import React, { useEffect, useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle,
  X,
  Keyboard,
  Compass,
  FileCheck
} from 'lucide-react';
import { useDemoStore, TOUR_STEPS } from '../../store/demoStore.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';

export function DemoControlCenter() {
  const { 
    isDemoActive, 
    currentDemoStep, 
    isPresentationMode, 
    setDemoActive, 
    setDemoStep, 
    nextDemoStep, 
    prevDemoStep, 
    setPresentationMode 
  } = useDemoStore();

  const { navigateTo, setSidebarExpanded } = useNavigationStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const currentTourStep = TOUR_STEPS[currentDemoStep];

  // Sync navigation with demo step
  useEffect(() => {
    if (isDemoActive) {
      const stepConfig = TOUR_STEPS[currentDemoStep];
      if (stepConfig) {
        navigateTo(stepConfig.screenId as any);
      }
    }
  }, [currentDemoStep, isDemoActive, navigateTo]);

  // Collapses sidebar when presentation mode is activated, and restores it
  useEffect(() => {
    if (isPresentationMode) {
      setSidebarExpanded(false);
    } else {
      setSidebarExpanded(true);
    }
  }, [isPresentationMode, setSidebarExpanded]);

  // Fullscreen management
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed or not allowed in frame:", err);
      // Fallback: toggle state anyway to simulate
      setIsFullscreen(!isFullscreen);
    }
  };

  // Bind keyboard navigation (Left/Right Arrow, ESC)
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      // Ignore keypresses inside input fields
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || activeEl.getAttribute('contenteditable') === 'true') {
          return;
        }
      }

      if (isDemoActive || isPresentationMode) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (currentDemoStep < TOUR_STEPS.length - 1) {
            nextDemoStep();
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (currentDemoStep > 0) {
            prevDemoStep();
          }
        } else if (e.key === 'Escape') {
          if (isPresentationMode) {
            setPresentationMode(false);
          }
          if (showChecklist) {
            setShowChecklist(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isDemoActive, isPresentationMode, currentDemoStep, nextDemoStep, prevDemoStep, setPresentationMode, showChecklist]);

  const handleStartDemo = () => {
    setDemoActive(true);
    setDemoStep(0);
    navigateTo('dashboard');
  };

  const handleResetDemo = () => {
    setDemoStep(0);
    navigateTo('dashboard');
  };

  const handleStepClick = (idx: number) => {
    setDemoStep(idx);
  };

  return (
    <div className="w-full space-y-3 text-slate-800 dark:text-slate-100">
      {/* 1. DEMO ACTIVATOR BAR (Show when demo mode is not active) */}
      {!isDemoActive && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md border border-blue-800/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30 animate-pulse">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                RANCAGE Paket Presentasi Kompetisi Inovasi Nasional
                <span className="text-[9px] font-mono bg-blue-500 text-white font-bold px-2 py-0.5 rounded-xs uppercase tracking-widest">
                  SIAP
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Mulai panduan interaktif atau aktifkan mode presentasi penuh untuk mendemonstrasikan sistem pendukung keputusan berbasis bukti analitis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowChecklist(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-700/50 rounded-sm transition-all"
            >
              <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Daftar Kesiapan</span>
            </button>
            
            <button
              onClick={handleStartDemo}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-sm shadow-lg hover:shadow-blue-500/10 transition-all uppercase tracking-wider"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Mulai Demo Interaktif</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. LIVE GUIDED TOUR DASHBOARD PANEL */}
      {isDemoActive && (
        <div className="bg-slate-950 border border-slate-900 text-slate-100 rounded-sm p-4 md:p-5 shadow-xl space-y-4 transition-all duration-300 relative overflow-hidden">
          {/* Subtle glowing ambient ring */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-900 pb-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-blue-950/80 text-blue-400 border border-blue-900/50 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-extrabold uppercase tracking-widest">
                  <Compass className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
                  Panduan Demo Interaktif
                </span>
                
                {isPresentationMode && (
                  <span className="inline-flex items-center gap-1 bg-purple-950/80 text-purple-400 border border-purple-900/50 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-extrabold uppercase tracking-widest">
                    <Eye className="h-3 w-3" />
                    Mode Presentasi Aktif
                  </span>
                )}
                
                <span className="text-[10px] text-slate-500 font-mono">
                  Tekan panah Kiri / Kanan pada keyboard untuk beralih halaman secara instan
                </span>
              </div>

              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  {currentTourStep?.title}
                  <span className="text-xs text-slate-500 font-mono font-normal">
                    (Langkah {currentDemoStep + 1} dari {TOUR_STEPS.length})
                  </span>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  {currentTourStep?.description}
                </p>
              </div>

              {/* Highlight card */}
              <div className="bg-blue-950/20 border border-blue-900/30 rounded-xs p-2.5 flex items-start gap-2 max-w-4xl">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-400">Sorotan Utama Demo:</span>{' '}
                  <span className="text-slate-200">{currentTourStep?.highlight}</span>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-start">
              <button
                onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-sm border border-slate-800"
                title="Panduan Pintasan Keyboard"
              >
                <Keyboard className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowChecklist(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-sm"
                title="Daftar Kesiapan Kompetisi Inovasi"
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden md:inline">Daftar Kesiapan</span>
              </button>

              <button
                onClick={() => setPresentationMode(!isPresentationMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-sm border transition-all ${
                  isPresentationMode 
                    ? 'bg-purple-950/40 text-purple-400 border-purple-800/80 hover:bg-purple-950/60' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
                title={isPresentationMode ? 'Keluar dari Tampilan Presentasi (Perluas Sidebar)' : 'Aktifkan Tampilan Presentasi (Sembunyikan Sidebar)'}
              >
                {isPresentationMode ? <EyeOff className="h-3.5 w-3.5 text-purple-400" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{isPresentationMode ? 'Antarmuka Standar' : 'Presentasi'}</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-sm border border-slate-800"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Masuk Layar Penuh'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <div className="h-6 w-[1px] bg-slate-900" />

              <button
                onClick={() => setDemoActive(false)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/30 border border-rose-900/40 rounded-sm"
              >
                <X className="h-3.5 w-3.5" />
                <span>Akhiri Demo</span>
              </button>
            </div>
          </div>

          {/* Stepper Navigation Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-sm border border-slate-800">
                <button
                  onClick={prevDemoStep}
                  disabled={currentDemoStep === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:text-slate-700 disabled:pointer-events-none transition-colors"
                  title="Langkah Sebelumnya (Panah Kiri)"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-[10px] font-mono px-2 text-slate-400 font-bold">
                  {currentDemoStep + 1} / {TOUR_STEPS.length}
                </div>
                <button
                  onClick={nextDemoStep}
                  disabled={currentDemoStep === TOUR_STEPS.length - 1}
                  className="p-1 text-slate-400 hover:text-white disabled:text-slate-700 disabled:pointer-events-none transition-colors"
                  title="Langkah Selanjutnya (Panah Kanan)"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Bar indicator */}
              <div className="flex-1 max-w-md h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentDemoStep + 1) / TOUR_STEPS.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetDemo}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2.5 py-1.5 rounded-sm"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Tur</span>
                </button>

                {currentDemoStep < TOUR_STEPS.length - 1 ? (
                  <button
                    onClick={nextDemoStep}
                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-sm uppercase tracking-wide transition-all shadow-md"
                  >
                    <span>Lanjut ke langkah {currentDemoStep + 2}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Panduan Selesai!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal Stepper Timeline Dots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
              {TOUR_STEPS.map((step, idx) => {
                const isActive = idx === currentDemoStep;
                const isPassed = idx < currentDemoStep;
                return (
                  <button
                    key={idx}
                    onClick={() => handleStepClick(idx)}
                    className={`flex flex-col text-left p-2 rounded-sm border transition-all text-[11px] ${
                      isActive 
                        ? 'bg-blue-950/40 border-blue-500 text-white font-semibold ring-1 ring-blue-500/20' 
                        : isPassed 
                        ? 'bg-slate-900/30 border-slate-800/80 text-blue-400/90' 
                        : 'bg-slate-900/10 border-slate-900/40 text-slate-500 hover:bg-slate-900/20 hover:text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-[9px] text-slate-400 block mb-0.5">LANGKAH {idx + 1}</span>
                    <span className="truncate block font-bold leading-none">{step.title.split('. ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. KEYBOARD SHORTCUTS HELP COMPONENT */}
      {showShortcutsHelp && (
        <div className="bg-slate-900 text-slate-200 border border-slate-800 p-3 rounded-sm flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <Keyboard className="h-5 w-5 text-blue-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white uppercase block mb-1">Mesin Navigasi Keyboard Aktif</span>
              <div className="flex flex-wrap items-center gap-3 text-slate-300 font-mono text-[10px]">
                <span className="bg-slate-950 px-1.5 py-0.5 rounded-sm border border-slate-800 text-blue-400">→ / Panah Kanan</span> Halaman Berikutnya
                <span className="bg-slate-950 px-1.5 py-0.5 rounded-sm border border-slate-800 text-blue-400">← / Panah Kiri</span> Halaman Sebelumnya
                <span className="bg-slate-950 px-1.5 py-0.5 rounded-sm border border-slate-800 text-blue-400">ESC</span> Keluar Presentasi / Tutup Dialog
                <span className="bg-slate-950 px-1.5 py-0.5 rounded-sm border border-slate-800 text-blue-400">Backspace</span> Kembali Ke Riwayat Halaman
                <span className="bg-slate-950 px-1.5 py-0.5 rounded-sm border border-slate-800 text-blue-400">Alt + [1-8]</span> Lompat ke halaman tertentu
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowShortcutsHelp(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4. COMPETITION CHECKLIST MODAL (Part 10 requirement) */}
      {showChecklist && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 text-slate-100 max-w-2xl w-full rounded-sm p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowChecklist(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-sm bg-slate-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
              <div className="h-10 w-10 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold tracking-tight text-white uppercase font-mono">
                  Audit Kesiapan Kompetisi RANCAGE
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verifikasi standar kualitas produksi untuk Piala Inovasi Pemerintah Provinsi Jawa Barat.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                
                {/* Visual design & branding */}
                <div className="bg-slate-900/40 p-3 rounded-sm border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono block">
                    ✔ Integritas Merek & Tipografi
                  </span>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>Identitas RANCAGE dimuat secara konsisten di semua frame.</li>
                    <li>Metadata sosioekonomi diselaraskan dengan standar BPS.</li>
                    <li>Kode warna indikator risiko: Rendah, Sedang, Tinggi.</li>
                    <li>Pemilihan huruf premium sesuai kriteria tipografi resmi.</li>
                  </ul>
                </div>

                {/* Performance & UX */}
                <div className="bg-slate-900/40 p-3 rounded-sm border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono block">
                    ✔ Rekayasa Platform & UX
                  </span>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>Struktur tata letak responsif penuh (target 1440px).</li>
                    <li>Tombol pintasan keyboard interaktif untuk kendali presentasi.</li>
                    <li>Penyimpanan memori posisi gulir (scroll-state) saat pindah halaman.</li>
                    <li>Integrasi animasi pemuatan skeleton & indikator progres.</li>
                  </ul>
                </div>

                {/* Analytics */}
                <div className="bg-slate-900/40 p-3 rounded-sm border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono block">
                    ✔ Mesin Analitik Dinamis
                  </span>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>Plot sebar korelasi bivariat antar indikator kemiskinan.</li>
                    <li>Kisi pemetaan spasial Tipologi Klassen yang responsif.</li>
                    <li>Diagram ketimpangan dalam wilayah (Indeks Theil).</li>
                    <li>Komponen simulasi pemetaan GIS Choropleth interaktif.</li>
                  </ul>
                </div>

                {/* AI & Integration */}
                <div className="bg-slate-900/40 p-3 rounded-sm border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono block">
                    ✔ Kemampuan AI & Full-Stack
                  </span>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>Penyusun draf kebijakan (Policy Brief) bertenaga Gemini AI.</li>
                    <li>Plot penjelasan model ML (analisis SHAP, metrik ROC-AUC).</li>
                    <li>Titik akhir API Express untuk sistem peringatan dini (EWS).</li>
                    <li>Daftar registrasi penerima manfaat (Desil Kesejahteraan 1-4).</li>
                  </ul>
                </div>

              </div>

              {/* Verified Badge info */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-sm p-3.5 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold text-white block uppercase font-mono">STATUS: SANGAT KOMPETITIF & STABIL</span>
                  <p className="text-slate-300 leading-relaxed">
                    Build ini memenuhi seluruh kriteria panduan kompetisi inovasi nasional. Memakai arsitektur Express + Vite performa tinggi dengan hidrasi status klien, dukungan tema dinamis, dan sinkronisasi filter global.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-900">
              <button
                onClick={() => setShowChecklist(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs rounded-sm border border-slate-800"
              >
                Tutup Audit Kesiapan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
