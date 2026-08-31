import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingDown, 
  Compass, 
  Percent, 
  MapPin, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../utils/cn.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';

interface NarrativeCard {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  badgeText: string;
  badgeType: 'critical' | 'warning' | 'success' | 'info';
  icon: any;
  actionText?: string;
  actionScreen?: string;
}

const NARRATIVE_CARDS: NarrativeCard[] = [
  {
    id: 'situation',
    title: 'Situasi Terkini',
    summary: 'Tingkat kemiskinan provinsi (P0) stabil di 7.62% (-0.34% vs K3). Namun, ketimpangan konsumsi sedikit naik ke 0.412, menunjukkan tingginya konsentrasi sumber daya di sepanjang koridor industri utara.',
    metricLabel: 'Rata-rata P0',
    metricValue: '7.62%',
    badgeText: 'Stabil',
    badgeType: 'info',
    icon: Activity,
  },
  {
    id: 'risk',
    title: 'Risiko Utama',
    summary: 'Lonjakan kesalahan eksklusi telah tercatat di Kabupaten Sukabumi, menyebabkan 11.8% rumah tangga miskin berada di luar cakupan kesejahteraan PKH. Jika tidak diatasi pada K3-K4, hal ini dapat memicu peringatan keamanan pangan sekunder yang parah.',
    metricLabel: 'Tingkat eksklusi',
    metricValue: '8.7% rata-rata',
    badgeText: 'Peringatan Parah',
    badgeType: 'critical',
    icon: ShieldAlert,
    actionText: 'Periksa Peringatan',
    actionScreen: 'monitoring'
  },
  {
    id: 'priority',
    title: 'Wilayah Prioritas Tertinggi',
    summary: 'Kabupaten Tasikmalaya menempati peringkat tertinggi pada indeks prioritas komposit (94.2/100). Wilayah ini menunjukkan tingkat kemiskinan tinggi sebesar 12.11% dan kontribusi ketimpangan dalam kabupaten yang intens (89.4%), membutuhkan target langsung di tingkat rumah tangga.',
    metricLabel: 'Skor prioritas',
    metricValue: '94.2 / 100',
    badgeText: 'Tindakan Segera',
    badgeType: 'critical',
    icon: MapPin,
  },
  {
    id: 'improvement',
    title: 'Peningkatan Terbesar',
    summary: 'Kota Bandung terus menunjukkan tingkat kemiskinan terendah (3.96%) dan kebenaran model penargetan rumah tangga tertinggi (93.1%), menunjukkan dampak positif integrasi catatan sipil digital yang diselesaikan pada tahun 2025.',
    metricLabel: 'Akurasi',
    metricValue: '93.1%',
    badgeText: 'Tolok Ukur Tercapai',
    badgeType: 'success',
    icon: TrendingDown,
  },
  {
    id: 'indicator',
    title: 'Indikator Paling Kritis',
    summary: 'Ketimpangan Dalam Kabupaten (Intra-Kabupaten) telah meningkat menjadi 89.4%. Hal ini menegaskan bahwa disparitas lokal di dalam perbatasan kotamadya adalah pendorong utama ketimpangan provinsi, menyerukan intervensi tingkat kecamatan yang terlokalisasi.',
    metricLabel: 'Theil Dalam',
    metricValue: '89.4%',
    badgeText: 'Perlu Atensi Khusus',
    badgeType: 'warning',
    icon: Compass,
    actionText: 'Dekomposisi',
    actionScreen: 'diagnosis'
  }
];

export function ExecutiveNarrativeCards() {
  const { navigateTo } = useNavigationStore();

  const badgeStyles = {
    critical: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40',
    warning: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40',
    info: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40'
  };

  return (
    <div className="space-y-3" id="executive-narrative-panel">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          Ringkasan Laporan Situasional Eksekutif
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {NARRATIVE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.id}
              className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-4.5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2.5">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    {card.title}
                  </span>
                  <span className={cn('px-1.5 py-0.5 border rounded-xs text-[9px] font-bold uppercase tracking-wider font-mono', badgeStyles[card.badgeType])}>
                    {card.badgeText}
                  </span>
                </div>

                {/* Main Paragraph Description */}
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {card.summary}
                </p>
              </div>

              {/* Footer Indicator info */}
              <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    {card.metricLabel}:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                    {card.metricValue}
                  </span>
                </div>

                {card.actionText && card.actionScreen && (
                  <button
                    onClick={() => navigateTo(card.actionScreen as any)}
                    className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors uppercase tracking-wider"
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
