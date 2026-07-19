import React, { useState } from 'react';
import { Sparkles, Brain, CheckCircle2, RotateCw, RefreshCw, AlertTriangle } from 'lucide-react';
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

interface AiResponse {
  narrative: string;
  focus: string;
  actionableStep: string;
  source: 'gemini' | 'fallback';
  message?: string;
}

export function AiPolicyInsight({ evaluationYear = '2026' }: AiPolicyInsightProps) {
  const [activeAxis, setActiveAxis] = useState<'disparity' | 'spatial' | 'targeting'>('disparity');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Hardcoded fallback data (original static content)
  const axesData: Record<string, Record<'disparity' | 'spatial' | 'targeting', InsightAxis>> = {
    '2026': {
      disparity: {
        id: 'disparity',
        label: 'Dekomposisi Disparitas Theil',
        narrative: 'Ketimpangan dalam kelompok (Within-district) menyumbang 89,4% dari total disparitas provinsi. Hal ini menunjukkan bahwa ketimpangan semakin didorong oleh disparitas di dalam kabupaten/kota alih-alih antar wilayah. Zonasi administratif yang luas tidak lagi memadai.',
        focus: 'Penargetan tingkat rumah tangga & aset mikro dasar (sanitasi, jaringan air).',
        actionableStep: 'Realokasi 14,5% dari dana dukungan umum kabupaten seluruh wilayah langsung ke injeksi air bersih tingkat rumah tangga untuk desil D1-D2 di Priangan Timur.'
      },
      spatial: {
        id: 'spatial',
        label: 'Pemetaan Hotspot Spasial',
        narrative: 'Klaster koordinat GIS menunjukkan tingkat kemiskinan parah terkonsentrasi sangat padat di sabuk pertanian selatan. Kabupaten Kuningan dan Indramayu menunjukkan kantong-kantong persisten dengan rasio headcount melebihi 12,5%.',
        focus: 'Infrastruktur prioritas & hub logistik pertanian.',
        actionableStep: 'Luncurkan proyek jalur pipa sanitasi pedesaan di daerah ekstrem selatan Sukabumi dan Tasikmalaya dengan alokasi anggaran khusus pada revisi fiskal Q3.'
      },
      targeting: {
        id: 'targeting',
        label: 'Kinerja Penargetan Kesejahteraan',
        narrative: 'Akurasi inklusi (Inclusion accuracy) telah mencapai 91,3% menggunakan kalibrasi Gradient Boosting. Namun, tingkat eksklusi (exclusion rate) tetap berada di 8,7% untuk pemukiman pedesaan terisolasi akibat indeks catatan sipil yang usang.',
        focus: 'Sinkronisasi catatan sipil aktif & regu PMT bergerak.',
        actionableStep: 'Kerahkan armada catatan sipil Bappeda untuk memutakhirkan daftar DTKS secara fisik di kabupaten Kategori IV, menargetkan 24.000 rumah tangga.'
      }
    },
    '2025': {
      disparity: {
        id: 'disparity',
        label: 'Dekomposisi Disparitas Theil',
        narrative: 'Ketimpangan dalam kelompok (Within-district) berada pada 88,2% di tahun 2025. Disparitas terkonsentrasi sangat padat di zona perbatasan industri-pertanian. Manfaat pertumbuhan terpusat secara lokal, menciptakan kesenjangan lebar dalam satu zona administratif.',
        focus: 'Transfer aset dan penyelarasan pelatihan keterampilan kabupaten.',
        actionableStep: 'Perluas subsidi pelatihan vokasi Padat Karya lokal di seluruh kabupaten dengan rasio Gini tinggi untuk menyerap buruh tani lokal.'
      },
      spatial: {
        id: 'spatial',
        label: 'Pemetaan Hotspot Spasial',
        narrative: 'Tolok ukur historis GIS 2025 memverifikasi klaster padat di Cirebon Raya, didorong oleh depresiasi aset perikanan pesisir dan defisit pekerjaan pertanian musiman.',
        focus: 'Kredit mikro pesisir & infrastruktur rantai dingin (cold chain).',
        actionableStep: 'Setujui hibah darurat peralatan perikanan khusus untuk koperasi nelayan di Indramayu dan Cirebon.'
      },
      targeting: {
        id: 'targeting',
        label: 'Kinerja Penargetan Kesejahteraan',
        narrative: 'Akurasi penargetan rata-rata mencapai 90,8% di 2025. Batas PMT Machine Learning berhasil memblokir akses ke rumah tangga di desil kesejahteraan D4 ke atas.',
        focus: 'Penerapan ketat dari batas penargetan PMT.',
        actionableStep: 'Publikasikan metrik penargetan yang diaudit ke dewan pengawas provinsi untuk mengamankan aliran pendanaan lanjutan.'
      }
    },
    '2024': {
      disparity: {
        id: 'disparity',
        label: 'Dekomposisi Disparitas Theil',
        narrative: 'Kontribusi ketimpangan dalam kelompok (Within-district) terukur pada 87,1% selama survei 2024. Siklus transisi pasca-makroekonomi telah memperkuat disparitas mikroekonomi di dalam kota-kota industri seperti Bekasi dan Depok.',
        focus: 'Integrasi jaring pengaman perkotaan & penyesuaian biaya hidup.',
        actionableStep: 'Terapkan subsidi harga komoditas pokok di kelurahan perkotaan berpenduduk padat yang menunjukkan rasio Gini internal tinggi.'
      },
      spatial: {
        id: 'spatial',
        label: 'Pemetaan Hotspot Spasial',
        narrative: 'Koordinat survei 2024 mengindikasikan klaster dengan tingkat keparahan tertinggi berada di Kabupaten Tasikmalaya dan Garut akibat musim kemarau berkepanjangan yang mengganggu pendapatan panen.',
        focus: 'Irigasi tahan iklim dan asuransi sosial.',
        actionableStep: 'Bangun dana cadangan transportasi air musim kemarau untuk mencegah penurunan mendadak konsumsi rumah tangga di Priangan Timur.'
      },
      targeting: {
        id: 'targeting',
        label: 'Kinerja Penargetan Kesejahteraan',
        narrative: 'Akurasi penargetan tercatat pada 89,4%. Inclusion error (kesalahan penyertaan) utamanya didorong oleh pendaftaran kertas manual sebelum transisi ke sistem digital yang terotomatisasi penuh.',
        focus: 'Digitalisasi data lama (legacy) dan pembersihan data.',
        actionableStep: 'Laksanakan migrasi digital lengkap dari daftar pedesaan BPS ke database SQL terpusat yang aman.'
      }
    }
  };

  // Determine what data to display: AI response (if available for current axis) or fallback
  const fallbackData = (axesData[evaluationYear] || axesData['2026'])[activeAxis];
  const displayData = (aiResponse && aiResponse.source)
    ? { narrative: aiResponse.narrative, focus: aiResponse.focus, actionableStep: aiResponse.actionableStep }
    : fallbackData;
  const isAiGenerated = aiResponse?.source === 'gemini';

  // Call Gemini API via serverless function
  const handleRegenerate = async () => {
    setIsGenerating(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/ai/policy-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ axis: activeAxis, year: evaluationYear }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data: AiResponse = await response.json();
      setAiResponse(data);

      if (data.source === 'fallback' && data.message) {
        setErrorMessage(data.message);
      }
    } catch (error: any) {
      console.error('[AiPolicyInsight] Failed to generate:', error);
      setErrorMessage('Gagal terhubung ke AI. Menampilkan data tersimpan.');
      setAiResponse(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle axis tab change - reset AI response so user sees default first
  const handleAxisChange = (axisKey: 'disparity' | 'spatial' | 'targeting') => {
    setActiveAxis(axisKey);
    setAiResponse(null);
    setErrorMessage('');
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
              Narasi analitik terotomatisasi yang diturunkan secara dinamis dari indikator dan algoritma dekomposisi {evaluationYear} yang dipilih.
            </p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500/70 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isGenerating && 'animate-spin')} />
          <span>{isGenerating ? 'Menghasilkan dengan AI...' : '✨ Buat Ulang dengan AI'}</span>
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
                onClick={() => handleAxisChange(axisKey)}
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
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">Memproses Model AI Gemini...</span>
              <span className="text-[10px] text-slate-300 dark:text-slate-600">Menyintesis narasi kebijakan dari indikator wilayah</span>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* AI Source Badge */}
              {isAiGenerated && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 w-fit">
                  <Sparkles className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Dihasilkan oleh AI Gemini</span>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 w-fit">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">{errorMessage}</span>
                </div>
              )}

              {/* Main Narrative paragraph */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  Memo Narasi Analitik (Survei {evaluationYear})
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {displayData.narrative}
                </p>
              </div>

              {/* Highlighted core findings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-900 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Area Fokus Strategis:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-slate-50">
                    {displayData.focus}
                  </p>
                </div>

                <div className="space-y-1 bg-blue-50/20 dark:bg-blue-950/10 p-3 rounded-xs border border-blue-50/50 dark:border-blue-950/10">
                  <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arahan Kebijakan Aksi:
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {displayData.actionableStep}
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
