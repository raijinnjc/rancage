import React, { useState, useMemo } from 'react';
import {
  Brain,
  TrendingUp,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Info,
  Shield,
  Layers,
  ArrowRight,
  Database,
  Calendar,
  Cpu,
  BarChart2,
  RefreshCw,
  Award,
  ChevronRight,
  Users,
  Building2,
  Settings,
  Flame,
  UserCheck
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function MlEvaluationPage() {
  const { selectedDistrictId } = useNavigationStore();

  // Selected evaluation thresholds (Section 6)
  const [threshold, setThreshold] = useState<number>(0.50);

  // Confusion matrix display mode: 'absolute' | 'percentage' (Section 3)
  const [matrixMode, setMatrixMode] = useState<'absolute' | 'percentage'>('percentage');

  // Interactive explanation tooltip states (Section 8 SHAP / Hover)
  const [hoveredShapFeature, setHoveredShapFeature] = useState<string | null>(null);

  // Active sub-district or decile error analysis view selection (Section 9)
  const [activeErrorTab, setActiveErrorTab] = useState<'district' | 'decile' | 'typology'>('district');

  // Breadcrumb items
  const breadcrumbs = [
    { label: 'RANCAGE DSS' },
    { label: 'Pusat Evaluasi Machine Learning', active: true }
  ];

  // SECTION 2: Baseline Metrics at default threshold 0.50
  const baselineKpis = {
    accuracy: { current: '89.4%', benchmark: '82.1%', interpretation: 'Tingkat klasifikasi benar keseluruhan pada daftar miskin dan tidak miskin.', status: 'sangat baik' },
    precision: { current: '87.5%', benchmark: '76.2%', interpretation: 'Dari semua yang diprediksi miskin, persentase yang benar-benar di bawah garis kemiskinan.', status: 'sangat baik' },
    recall: { current: '91.2%', benchmark: '80.5%', interpretation: 'Dari semua keluarga yang benar-benar miskin, persentase yang berhasil ditargetkan.', status: 'sangat baik' },
    f1Score: { current: '89.3%', benchmark: '78.3%', interpretation: 'Rata-rata harmonik menyeimbangkan kebocoran dan kesalahan undercoverage.', status: 'sangat baik' },
    rocAuc: { current: '0.942', benchmark: '0.860', interpretation: 'Peringkat sosial ekonomi dan kekuatan pengurutan di seluruh ambang batas yang mungkin.', status: 'sangat baik' },
    logLoss: { current: '0.245', benchmark: '0.412', interpretation: 'Kedekatan model probabilitas yang diprediksi ke hasil kesejahteraan biner langsung.', status: 'sangat baik' },
    balancedAccuracy: { current: '88.9%', benchmark: '81.0%', interpretation: 'Rata-rata tingkat recall di kedua kelas miskin dan tidak miskin.', status: 'sangat baik' },
    mcc: { current: '0.781', benchmark: '0.620', interpretation: 'Pengecekan keseimbangan korelasi meskipun kelas kesejahteraan sangat tidak seimbang.', status: 'sangat baik' }
  };

  // SECTION 3: Dynamic Confusion Matrix calculated from selected threshold
  // As the threshold rises, fewer households are predicted poor (decreases False Positives, increases False Negatives)
  const computedMatrix = useMemo(() => {
    // Total simulated households = 10,000
    const truePoor = 3500;
    const trueNonPoor = 6500;

    // Shift metrics depending on threshold (0.10 to 0.90)
    const factor = (threshold - 0.5) * 2; // range [-1, 1]

    // Base values at 0.50
    let tp = Math.round(3192 - (factor * 600)); // True Poor predicted Poor
    let fn = truePoor - tp;                      // True Poor predicted Tidak Miskin (Exclusion)
    let fp = Math.round(455 - (factor * 400));   // True Tidak Miskin predicted Poor (Inclusion)
    let tn = trueNonPoor - fp;                   // True Tidak Miskin predicted Tidak Miskin

    // Bound values
    if (tp < 1000) tp = 1000;
    if (tp > 3400) tp = 3400;
    fn = truePoor - tp;
    if (fp < 50) fp = 50;
    if (fp > 1800) fp = 1800;
    tn = trueNonPoor - fp;

    const total = tp + fn + fp + tn;

    // Derived Simulation Metrics
    const precisionSim = (tp / (tp + fp)) * 100;
    const recallSim = (tp / (tp + fn)) * 100;
    const inclusionError = (fp / (tp + fp)) * 100; // leakage
    const exclusionError = (fn / (tp + fn)) * 100; // undercoverage

    return {
      tp,
      fn,
      fp,
      tn,
      total,
      precisionSim: precisionSim.toFixed(1),
      recallSim: recallSim.toFixed(1),
      inclusionError: inclusionError.toFixed(1),
      exclusionError: exclusionError.toFixed(1),
      eligibleHouseholds: tp + fp,
      rejectedHouseholds: tn + fn
    };
  }, [threshold]);

  // SECTION 4: Precision-Recall Curves Data
  const prCurveData = [
    { th: 0.1, precision: 45, recall: 99, f1: 62 },
    { th: 0.2, precision: 54, recall: 98, f1: 70 },
    { th: 0.3, precision: 68, recall: 96, f1: 80 },
    { th: 0.4, precision: 79, recall: 94, f1: 86 },
    { th: 0.5, precision: 87.5, recall: 91.2, f1: 89.3 },
    { th: 0.6, precision: 92, recall: 83, f1: 87 },
    { th: 0.7, precision: 95, recall: 71, f1: 81 },
    { th: 0.8, precision: 97, recall: 55, f1: 70 },
    { th: 0.9, precision: 99, recall: 32, f1: 48 },
  ];

  // SECTION 5: ROC Curve Data
  const rocCurveData = [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.02, tpr: 0.35 },
    { fpr: 0.05, tpr: 0.62 },
    { fpr: 0.07, tpr: 0.912 }, // optimal
    { fpr: 0.15, tpr: 0.94 },
    { fpr: 0.30, tpr: 0.97 },
    { fpr: 0.50, tpr: 0.99 },
    { fpr: 1.00, tpr: 1.00 },
  ];

  // SECTION 7: Feature Importance (Top 15 Variables)
  const featureImportances = [
    { name: 'Indeks Kualitas Perumahan', score: 0.245, category: 'Housing' },
    { name: 'Tahun Bersekolah Kepala Keluarga', score: 0.182, category: 'Education' },
    { name: 'Daya Sambungan Listrik', score: 0.124, category: 'Utilities' },
    { name: 'Akses Sumber Air Minum', score: 0.098, category: 'Sanitation' },
    { name: 'Perampasan Sistem Sanitasi', score: 0.088, category: 'Sanitation' },
    { name: 'Aset Produktif Rumah Tangga', score: 0.065, category: 'Assets' },
    { name: 'Pekerjaan Kepala Keluarga / Status Tenaga Kerja Informal', score: 0.054, category: 'Employment' },
    { name: 'Total Tanggungan yang Tinggal Bersama', score: 0.045, category: 'Demographics' },
    { name: 'Akses Internet Broadband / Seluler', score: 0.038, category: 'Utilities' },
    { name: 'Komposisi Material Lantai', score: 0.028, category: 'Housing' },
    { name: 'Kesenjangan Layanan Kesehatan Penyakit Kronis', score: 0.015, category: 'Health' },
    { name: 'Luas Tanah Subur yang Dimiliki', score: 0.011, category: 'Assets' },
    { name: 'Penerima Beras Bersubsidi (Raskin)', score: 0.005, category: 'Welfare' },
    { name: 'Kepala Keluarga Disabilitas', score: 0.002, category: 'Demographics' }
  ];

  // SECTION 8: SHAP Values Metadata & Hover Explanation
  const shapFeatures = [
    {
      name: 'Indeks Kualitas Perumahan',
      direction: 'Negatif (-)',
      magnitude: 'Sangat Tinggi',
      interpretation: 'Menyediakan dinding luar di bawah standar (bambu, kayu belum selesai) sangat meningkatkan kemungkinan kemiskinan yang diprediksi.',
      policy: 'Menyelaraskan pos anggaran dengan program rehabilitasi rumah perdesaan (Rutilahu).'
    },
    {
      name: 'Tahun Bersekolah Kepala Keluarga',
      direction: 'Negatif (-)',
      magnitude: 'Tinggi',
      interpretation: 'Menyelesaikan pendidikan dasar atau menengah pertama secara dramatis menurunkan probabilitas kemiskinan yang diprediksi.',
      policy: 'Mendukung manfaat uang tunai pendidikan berkelanjutan (KIP) untuk memutus perangkap kemiskinan antargenerasi.'
    },
    {
      name: 'Perampasan Sistem Sanitasi',
      direction: 'Positif (+)',
      magnitude: 'Sedang-Tinggi',
      interpretation: 'Tidak memiliki akses ke jamban pribadi atau tangki penampungan menandai perampasan kesejahteraan yang ekstrem.',
      policy: 'Membenarkan pengeluaran infrastruktur sanitasi lokal di kantong kategori IV.'
    },
    {
      name: 'Akses Sumber Air Minum',
      direction: 'Negatif (-)',
      magnitude: 'Sedang',
      interpretation: 'Mengandalkan sumur yang tidak terlindungi atau air sungai berkontribusi kuat terhadap pengganda perampasan.',
      policy: 'Secara langsung menginformasikan target ekspansi jaringan air bersih pedesaan (Pamsimas).'
    },
    {
      name: 'Aset Produktif Rumah Tangga',
      direction: 'Negatif (-)',
      magnitude: 'Sedang',
      interpretation: 'Kepemilikan kendaraan atau mesin pertanian yang berfungsi berfungsi sebagai proksi tidak miskin yang kuat.',
      policy: 'Memastikan pergeseran dukungan dari uang tunai langsung ke hibah modal mikro produktif seiring bertambahnya aset.'
    }
  ];

  // SECTION 9: Error Breakdown Tables
  const districtErrors = [
    { district: 'Kabupaten Tasikmalaya', inclusion: '4.1%', exclusion: '3.2%', sample: 2450, typology: 'Kategori IV' },
    { district: 'Kabupaten Garut', inclusion: '3.8%', exclusion: '2.9%', sample: 2100, typology: 'Kategori III' },
    { district: 'Kabupaten Cianjur', inclusion: '3.5%', exclusion: '3.1%', sample: 1980, typology: 'Kategori IV' },
    { district: 'Kabupaten Sukabumi', inclusion: '2.9%', exclusion: '2.6%', sample: 1840, typology: 'Kategori III' },
    { district: 'Kota Bandung', inclusion: '1.2%', exclusion: '1.1%', sample: 1200, typology: 'Kategori I' },
    { district: 'Kota Tasikmalaya', inclusion: '3.1%', exclusion: '2.4%', sample: 850, typology: 'Kategori II' },
  ];

  const decileErrors = [
    { decile: 'Desil 1 (10% Termiskin)', inclusion: '0.8%', exclusion: '1.1%', impact: 'Cakupan penduduk miskin inti yang sangat baik' },
    { decile: 'Desil 2', inclusion: '3.1%', exclusion: '2.4%', impact: 'Zona presisi tinggi' },
    { decile: 'Desil 3', inclusion: '7.8%', exclusion: '5.9%', impact: 'Penyangga batas rentan' },
    { decile: 'Desil 4 (Hampir Miskin)', inclusion: '12.4%', exclusion: '9.2%', impact: 'Varians tinggi di dekat batas kelayakan' },
  ];

  // SECTION 10: Fairness Metrics Comparison
  const fairnessMetrics = [
    { category: 'Cakupan Spasial', groupA: 'Wilayah Perkotaan (Kota)', valA: '91.2% Acc', groupB: 'Wilayah Perdesaan (Kab.)', valB: '88.5% Acc', diff: '2.7%', status: 'Dalam Batas Keadilan' },
    { category: 'Jenis Kelamin Kepala Keluarga', groupA: 'Kepala Keluarga Laki-laki', valA: '89.6% Acc', groupB: 'Kepala Keluarga Perempuan (PEKKA)', valB: '89.1% Acc', diff: '0.5%', status: 'Dalam Batas Keadilan' },
    { category: 'Demografi Usia Sosial Ekonomi', groupA: 'Dewasa (Usia 18-60)', valA: '89.8% Acc', groupB: 'Kepala Keluarga Lansia (>60)', valB: '87.4% Acc', diff: '2.4%', status: 'Dalam Batas Keadilan' },
    { category: 'Status Disabilitas', groupA: 'Tidak Ada Profil Disabilitas', valA: '89.5% Acc', groupB: 'Kohort Disabilitas', valB: '88.9% Acc', diff: '0.6%', status: 'Dalam Batas Keadilan' }
  ];

  // SECTION 11: Model Comparison Table
  const modelComparisons = [
    { model: 'Baseline OLS PMT (Tradisional)', accuracy: '82.1%', precision: '76.2%', recall: '80.5%', inclusion: '8.4%', exclusion: '6.9%', sla: '12ms' },
    { model: 'Gradient Boosting (XGBoost v2.1)', accuracy: '89.4%', precision: '87.5%', recall: '91.2%', inclusion: '3.4%', exclusion: '2.9%', sla: '35ms' },
    { model: 'Ansambel Random Forest', accuracy: '87.9%', precision: '85.1%', recall: '88.4%', inclusion: '4.6%', exclusion: '4.1%', sla: '45ms' },
    { model: 'Deep Neural Network (MLP)', accuracy: '88.6%', precision: '84.9%', recall: '90.1%', inclusion: '5.2%', exclusion: '3.4%', sla: '110ms' }
  ];

  // SECTION 12: Model Governance
  const governanceLogs = [
    { version: 'v2.1.2-STABLE', date: '2026-07-15', author: 'Bappeda Jabar Data Core', description: 'Memperbarui hiperparameter dengan regularisasi L1/L2 untuk menurunkan perbedaan inklusi perkotaan-pedesaan.' },
    { version: 'v2.1.0-RC3', date: '2026-05-14', author: 'Dinsos Jabar Analyst', description: 'Menggabungkan efek tetap spasial tingkat desa yang berasal dari indeks tipologi kemiskinan-ketimpangan.' },
    { version: 'v1.4.0', date: '2025-11-02', author: 'Sensus Data Unit', description: 'Penerapan awal berdasarkan model pelatihan sampel Susenas nasional.' }
  ];

  // Simulation threshold narrative text (Section 6)
  const getThresholdNarrative = () => {
    if (threshold < 0.40) {
      return "Konfigurasi ambang rendah mendeteksi hampir semua rumah tangga rentan, menghasilkan Kesalahan Eksklusi (undercoverage) yang sangat rendah. Namun, ini secara agresif meningkatkan Kesalahan Inklusi (kebocoran). Strategi ini sangat cocok untuk skenario bantuan dasar universal yang komprehensif tetapi menuntut anggaran fiskal yang substansial dan meningkatkan kekhawatiran kebocoran publik.";
    } else if (threshold > 0.60) {
      return "Konfigurasi ambang tinggi berfokus secara ketat pada keluarga yang menunjukkan tanda-tanda kemelaratan yang ekstrem dan tidak ambigu. Hal ini mengarah pada Kesalahan Inklusi yang sangat rendah (hampir tidak ada kebocoran). Namun, hal ini memperkenalkan Kesalahan Eksklusi yang parah, melewatkan keluarga yang berada tepat di bawah garis. Hal ini sesuai dengan anggaran penghematan fiskal yang ketat namun membiarkan kelompok rentan terpapar.";
    } else {
      return "Ambang batas yang seimbang merupakan kompromi kebijakan yang optimal. Ia memaksimalkan metrik F1, menyeimbangkan kesalahan eksklusi dan inklusi di dalam batas keamanan undang-undang. Alokasi anggaran tetap dapat diprediksi sambil meminimalkan gesekan lapangan publik selama pemeriksaan verifikasi.";
    }
  };

  return (
    <div className="space-y-6 page-transition stagger-children">
      {/* PAGE HEADER */}
      <PageHeader
        title="Pusat Evaluasi Machine Learning"
        description="Mengaudit integritas model, memperkirakan tradeoff anggaran-kesalahan, dan memantau keadilan algoritmik."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-blue-500" />
              <span>Kerangka Pelatihan:</span>
              <strong className="text-slate-800 dark:text-slate-200">Susenas Jabar Q3</strong>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span>Dievaluasi:</span>
              <strong className="text-slate-800 dark:text-slate-200">2026-07-15</strong>
            </div>
          </div>
        }
      />

      {/* SECTION 1: EXECUTIVE MODEL SUMMARY */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Kesesuaian Model & Penilaian Kesiapan Penerapan
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">MEJA EVALUASI KEPUTUSAN</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-600 dark:text-slate-300">
          <div className="lg:col-span-8 space-y-4 text-xs leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase font-mono tracking-wider mb-1">
                Kinerja Keseluruhan & Kapasitas Prediktif
              </h4>
              <p>
                Model RANCAGE Gradient Boosting mencapai Akurasi keseluruhan sebesar <strong className="text-slate-900 dark:text-white">89.4%</strong>, mewakili substansial <strong className="text-emerald-600 dark:text-emerald-400">+7.3% peningkatan prediktif</strong> dibandingkan model proksi berbasis OLS tradisional. Area Under the ROC Curve (AUC-ROC) tetap sangat tangguh pada <strong className="text-slate-900 dark:text-white">0.942</strong>, menunjukkan kekuatan diskriminatif yang unggul dalam menentukan peringkat rumah tangga berdasarkan kapasitas konsumsi yang sebenarnya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[10px] uppercase font-mono mb-0.5">
                  Kekuatan Algoritma
                </h5>
                <p className="text-[11px] text-slate-500">
                  Sangat tangguh terhadap kovariat demografis yang hilang; unggul dalam menangkap interaksi non-linear kompleks antara kualitas perumahan, material lantai, dan indikator spasial lokal tanpa overfitting.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[10px] uppercase font-mono mb-0.5">
                  Keterbatasan yang Diketahui
                </h5>
                <p className="text-[11px] text-slate-500">
                  Menunjukkan varians kecil di dekat batas desil (D3/D4) di mana rumah tangga mengalami guncangan pekerjaan musiman temporal yang dicatat secara lambat oleh register survei tradisional.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-900 pt-3 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xs">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase font-mono">
                  Kesiapan Kebijakan & Rekomendasi Penerapan
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <strong>DIREKOMENDASIKAN UNTUK PENERAPAN PRODUKSI PENUH:</strong> Model memenuhi dan melampaui semua mandat tata kelola Bappeda. Ini memberikan batas keselamatan-presisi yang cukup untuk mencegah keluhan publik mengenai kesalahan eksklusi, menjaga kebocoran undercoverage di bawah ambang batas 3% saat beroperasi pada kalibrasi ambang batas optimal 0,50.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 rounded-sm p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">DASAR EVALUASI</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] border-b border-slate-100 dark:border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-mono">ARSITEKTUR MODEL</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">XGBoost v2.1.2</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-b border-slate-100 dark:border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-mono">PENYETELAN CV</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">Stratifikasi 5-Lipatan</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-b border-slate-100 dark:border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-mono">KERUGIAN LATIHAN</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">0.218</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-mono">STATUS MODEL</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded-sm uppercase">
                    AKTIF STABIL
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-900 mt-2 flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
              <Award className="h-4 w-4 text-blue-500" />
              <span>Memenuhi Standar Bias AI ISO/IEC 24028</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PERFORMANCE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Accuracy */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Akurasi</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.accuracy.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.accuracy.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+7.3%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.accuracy.interpretation}</p>
        </div>

        {/* Card 2: Precision */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Presisi</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.precision.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.precision.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+11.3%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.precision.interpretation}</p>
        </div>

        {/* Card 3: Recall */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Recall (Sensitivitas)</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.recall.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.recall.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+10.7%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.recall.interpretation}</p>
        </div>

        {/* Card 4: F1 Score */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Skor F1</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.f1Score.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.f1Score.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+11.0%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.f1Score.interpretation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 5: ROC AUC */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">ROC AUC</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.rocAuc.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.rocAuc.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+0.082</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.rocAuc.interpretation}</p>
        </div>

        {/* Card 6: Log Loss */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Log Loss</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.logLoss.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.logLoss.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">-0.167</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.logLoss.interpretation}</p>
        </div>

        {/* Card 7: Balanced Accuracy */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Akurasi Seimbang</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.balancedAccuracy.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.balancedAccuracy.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+7.9%</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.balancedAccuracy.interpretation}</p>
        </div>

        {/* Card 8: MCC */}
        <div className="rounded-sm border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Matthews Corr (MCC)</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm">Tolok Ukur: {baselineKpis.mcc.benchmark}</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50">{baselineKpis.mcc.current}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">+0.161</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">{baselineKpis.mcc.interpretation}</p>
        </div>
      </div>

      {/* SECTION 3: CONFUSION MATRIX & THRESHOLD SIMULATION BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Confusion Matrix */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Audit Matriks Kebingungan Interaktif
              </h4>
            </div>
            <div className="flex rounded-sm bg-slate-100 dark:bg-slate-900 p-1 text-[10px] font-bold font-mono">
              <button
                onClick={() => setMatrixMode('absolute')}
                className={`px-2 py-1 rounded-xs transition-colors ${matrixMode === 'absolute' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Absolut
              </button>
              <button
                onClick={() => setMatrixMode('percentage')}
                className={`px-2 py-1 rounded-xs transition-colors ${matrixMode === 'percentage' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Persentase
              </button>
            </div>
          </div>

          {/* Matrix Grid Representation */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            {/* Top Row Labeling */}
            <div className="flex items-center justify-center font-bold text-[10px] text-slate-400 uppercase font-mono">
              Kelas Sebenarnya ↓
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900">
              <span className="text-[10px] text-slate-400 font-bold font-mono">DIPREDIKSI MISKIN</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900">
              <span className="text-[10px] text-slate-400 font-bold font-mono">DIPREDIKSI TIDAK MISKIN</span>
            </div>

            {/* Row 1: True Poor */}
            <div className="flex items-center justify-center p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900 text-center font-bold text-[10px] text-slate-400 uppercase font-mono">
              Miskin (Memenuhi Syarat)
            </div>
            
            {/* Cell 1: True Positive */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-sm text-center transition-colors hover:bg-emerald-100/60 dark:hover:bg-emerald-950/30 cursor-help">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 font-mono uppercase">Positif Benar (TP)</span>
              <span className="text-xl font-bold font-mono text-emerald-900 dark:text-emerald-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.tp : `${((computedMatrix.tp / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-500 mt-1">Berhasil Ditargetkan</span>
              
              {/* Custom tooltip explaining TP */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-emerald-400">Positif Benar (TP)</strong>
                Rumah tangga miskin secara sosial ekonomi yang diprediksi dengan benar oleh sistem dan dialokasikan intervensi.
              </div>
            </div>

            {/* Cell 2: False Negative (Exclusion Error) */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-sm text-center transition-colors hover:bg-rose-100/60 dark:hover:bg-rose-950/30 cursor-help">
              <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 font-mono uppercase">Negatif Salah (FN)</span>
              <span className="text-xl font-bold font-mono text-rose-900 dark:text-rose-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.fn : `${((computedMatrix.fn / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-rose-600 dark:text-rose-500 mt-1">Kesalahan Eksklusi (Terlewat)</span>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-rose-400">Negatif Salah (FN)</strong>
                Rumah tangga benar-benar miskin yang terlewat oleh model. Keluarga-keluarga ini dikecualikan dari manfaat, mengarah ke kesenjangan target.
              </div>
            </div>

            {/* Row 2: True Tidak Miskin */}
            <div className="flex items-center justify-center p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-900 text-center font-bold text-[10px] text-slate-400 uppercase font-mono">
              Tidak Miskin
            </div>

            {/* Cell 3: False Positive (Inclusion Error) */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-sm text-center transition-colors hover:bg-amber-100/60 dark:hover:bg-amber-950/30 cursor-help">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 font-mono uppercase">Positif Salah (FP)</span>
              <span className="text-xl font-bold font-mono text-amber-900 dark:text-amber-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.fp : `${((computedMatrix.fp / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-500 mt-1">Kesalahan Inklusi (Kebocoran)</span>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-amber-400">Positif Salah (FP)</strong>
                Keluarga tidak miskin yang keliru diprediksi miskin. Mengarah ke kebocoran dana pemerintah ke keluarga yang tidak dituju.
              </div>
            </div>

            {/* Cell 4: True Negative */}
            <div className="group relative flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-sm text-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-help">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 font-mono uppercase">Negatif Benar (TN)</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-300 mt-1.5">
                {matrixMode === 'absolute' ? computedMatrix.tn : `${((computedMatrix.tn / computedMatrix.total) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] text-slate-500 mt-1">Kesejahteraan Ditolak dengan Benar</span>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-950 text-slate-100 p-2.5 rounded-sm shadow-md text-[10px] z-50 leading-relaxed text-left">
                <strong className="block text-slate-400">Negatif Benar (TN)</strong>
                Rumah tangga tidak miskin yang diklasifikasikan dengan benar oleh algoritma. Tidak ada intervensi yang dialokasikan.
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center italic leading-relaxed">
            *Arahkan kursor ke sel matriks mana pun untuk mengaudit dampak kebijakan spesifiknya dan logika klasifikasi.
          </p>
        </div>

        {/* SECTION 6: THRESHOLD SIMULATION */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Simulator Kebijakan Ambang Kemiskinan Interaktif
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-xs">
              Mensimulasikan n=10.000 RT
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase font-mono">Ambang Batas Keputusan</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {threshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-sm appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>0.10 (Maksimalkan Cakupan)</span>
                <span>0.50 (Seimbang Optimal)</span>
                <span>0.90 (Penargetan Penghematan)</span>
              </div>
            </div>

            {/* Updated Results Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-sm border border-slate-100 dark:border-slate-900">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">Kesalahan Inklusi</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.inclusionError}%
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">Kesalahan Eksklusi</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.exclusionError}%
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">Memenuhi Syarat (Miskin)</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.eligibleHouseholds} HH
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono block">RT Ditolak</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
                  {computedMatrix.rejectedHouseholds} HH
                </span>
              </div>
            </div>

            {/* Narrative Area */}
            <div className="p-3 bg-blue-50/40 dark:bg-slate-900/20 border-l-2 border-blue-500 rounded-xs">
              <h5 className="font-bold text-[10px] text-blue-700 dark:text-blue-400 uppercase font-mono tracking-wider mb-1">
                Analisis Pertukaran Kebijakan & Fiskal
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {getThresholdNarrative()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 & SECTION 5: PR CURVE & ROC CHART BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 4: Precision-Recall Curve Analysis */}
        <ChartContainer
          title="Kurva Pertukaran Presisi-Recall"
          subtitle="Memetakan presisi model, sensitivitas recall, dan metrik F1 yang seimbang pada parameter cutoff yang bervariasi."
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
              <XAxis dataKey="th" name="Threshold" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <RechartsTooltip />
              <RechartsLegend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              <Line type="monotone" dataKey="precision" stroke="#3b82f6" strokeWidth={2.5} name="Presisi (Tahan Kebocoran)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="recall" stroke="#fb7185" strokeWidth={2.5} name="Recall (Daya Tangkap)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="f1" stroke="#34d399" strokeWidth={2} strokeDasharray="4 4" name="Indeks F1 Seimbang" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* SECTION 5: ROC Curve */}
        <ChartContainer
          title="Kurva Receiver Operating Characteristic (ROC)"
          subtitle="Memetakan Tingkat Positif Benar terhadap Tingkat Positif Salah. Sorotan menunjukkan keseimbangan klasifikasi yang optimal."
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rocCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rocColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
              <XAxis dataKey="fpr" tick={{ fill: '#94a3b8', fontSize: 10 }} name="FPR" />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} name="TPR" />
              <RechartsTooltip />
              <Area type="monotone" dataKey="tpr" stroke="#3b82f6" fillOpacity={1} fill="url(#rocColor)" strokeWidth={2.5} name="Tingkat Positif Benar" />
              {/* Dotted Reference Line */}
              <Line type="monotone" dataKey="fpr" stroke="#cbd5e1" strokeDasharray="3 3" name="Garis Tebakan Acak" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* METRICS INTERPRETATIONS (Under Section 4 & 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/30 p-4 border border-slate-100 dark:border-slate-800 rounded-sm text-xs">
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase font-mono tracking-wider">
            Dampak Kebijakan Presisi
          </h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Presisi tinggi berarti kebocoran rendah. Ini memastikan wajib pajak tidak melihat dana sosial bocor ke keluarga yang tidak miskin. Berharga untuk pencairan tunai regional yang sangat terlihat.
          </p>
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase font-mono tracking-wider">
            Dampak Kebijakan Recall
          </h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Recall tinggi berarti jaring pengaman yang lengkap. Ini menjamin bahwa yang termiskin dari yang miskin berhasil dicakup oleh model, meminimalkan gesekan politik dan keluhan undercoverage sosial.
          </p>
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase font-mono tracking-wider">
            Interpretasi ROC AUC
          </h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            An AUC score of 0.942 proves the model is extremely robust at separating poverty strata. Even if the absolute poverty line changes, the ranking of households remains statistically sound.
          </p>
        </div>
      </div>

      {/* SECTION 7: FEATURE IMPORTANCE CHART */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">ATRIBUSI ESTIMASI VARIABEL</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Kepentingan Fitur Gradient Boosting (Audit Model Variabel Teratas)
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Dihitung menggunakan metrik Bobot Penguatan</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="space-y-3">
              {featureImportances.slice(0, 10).map((feat, index) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      {feat.name}
                    </span>
                    <span className="font-mono text-slate-500">{(feat.score * 100).toFixed(1)}% bobot</span>
                  </div>
                  {/* Custom progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-sm overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-sm transition-all duration-500"
                      style={{ width: `${(feat.score / 0.25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30 p-5 rounded-sm border border-slate-100 dark:border-slate-900">
            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase font-mono tracking-wider">
                Atribusi Fitur & Hubungan Kebijakan
              </h5>
              <p className="leading-relaxed">
                Bagan ini menampilkan metrik perolehan relatif yang dihitung di seluruh pohon keputusan. Dalam ensambel kami yang diaudit, <strong className="text-slate-900 dark:text-white">Indeks Kualitas Perumahan</strong> berdiri sebagai prediktor utama (<strong className="text-slate-900 dark:text-white">24.5%</strong>), diikuti dengan cermat oleh <strong className="text-slate-900 dark:text-white">Schooling Years</strong> dari kepala keluarga (<strong className="text-slate-900 dark:text-white">18.2%</strong>).
              </p>
              <p className="leading-relaxed">
                Ini membuktikan bahwa algoritma menargetkan perampasan struktural daripada indikator jangka pendek yang berfluktuasi. Menerapkan renovasi perumahan dan insentif sekolah menengah secara langsung mengurangi indikator model, menetapkan hubungan yang jelas antara program sosial dan klasifikasi algoritmik.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
              <Info className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Diregulerisasi untuk membatasi bias demografis yang bergejolak</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8: MODEL EXPLAINABILITY & SHAP REVELATIONS */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-rose-500" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Eksplikabilitas Model (Aproksimasi Lokal Nilai SHAP)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">RINGKASAN KOEFISIEN SHAP</span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
          Nilai SHAP (SHapley Additive exPlanations) membedah bagaimana setiap fitur individu mendorong skor prediksi rumah tangga relatif terhadap rata-rata garis dasar. Indikator hijau mewakili fitur yang menurunkan kemungkinan kemiskinan yang diprediksi; batang merah mewakili faktor yang meningkatkan probabilitas kemiskinan.
        </p>

        {/* Placeholder SHAP Visual Force Diagram */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-sm space-y-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">PLOT GAYA SHAP INTI TERSIMULASI</span>
          
          <div className="flex items-center w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden text-[10px] font-bold font-mono text-white select-none">
            <div className="bg-rose-500 h-full flex items-center justify-center transition-opacity" style={{ width: '45%' }}>
              FAKTOR MISKIN (+45%)
            </div>
            <div className="bg-emerald-500 h-full flex items-center justify-center transition-opacity" style={{ width: '55%' }}>
              FAKTOR TIDAK MISKIN (-55%)
            </div>
          </div>
          
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>Probabilitas Kemiskinan Tinggi (Merah)</span>
            <span>Offset Garis Kemiskinan Median</span>
            <span>Probabilitas Kemiskinan Rendah (Hijau)</span>
          </div>
        </div>

        {/* Feature SHAP Matrix Explainer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {shapFeatures.map((feat) => {
            const isHovered = hoveredShapFeature === feat.name;
            return (
              <div
                key={feat.name}
                onMouseEnter={() => setHoveredShapFeature(feat.name)}
                onMouseLeave={() => setHoveredShapFeature(null)}
                className={`p-4 rounded-sm border transition-all cursor-default ${
                  isHovered
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-slate-900 shadow-xs'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">{feat.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 rounded-sm uppercase font-mono ${
                    feat.direction.includes('Negatif') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' : 'bg-rose-100 text-rose-700 dark:bg-rose-950'
                  }`}>
                    {feat.direction}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Besaran</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{feat.magnitude} (Dampak)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Interpretasi SHAP</span>
                    <p className="text-slate-500 leading-snug mt-0.5">{feat.interpretation}</p>
                  </div>
                  {isHovered && (
                    <div className="pt-2 border-t border-blue-100 dark:border-slate-800 text-[10px] text-blue-700 dark:text-blue-400 animate-in fade-in duration-200">
                      <strong>Aksi Kebijakan:</strong> {feat.policy}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 9: ERROR ANALYSIS & HEATMAP BREAKDOWN */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">RINCIAN PRESISI PENARGETAN</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Analisis Kesalahan Spasiotemporal & Tersegmentasi
            </h4>
          </div>
          <div className="flex rounded-sm bg-slate-100 dark:bg-slate-900 p-1 text-[10px] font-bold font-mono">
            <button
              onClick={() => setActiveErrorTab('district')}
              className={`px-3 py-1.5 rounded-xs transition-colors ${activeErrorTab === 'district' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Berdasarkan Kabupaten/Kota
            </button>
            <button
              onClick={() => setActiveErrorTab('decile')}
              className={`px-3 py-1.5 rounded-xs transition-colors ${activeErrorTab === 'decile' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Berdasarkan Desil
            </button>
          </div>
        </div>

        {activeErrorTab === 'district' ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                  <th className="py-2.5 px-3">Kabupaten/Kota</th>
                  <th className="py-2.5 px-3">Tipologi Pertumbuhan</th>
                  <th className="py-2.5 px-3">Kesalahan Inklusi (Kebocoran)</th>
                  <th className="py-2.5 px-3">Kesalahan Eksklusi (Penduduk Miskin Terlewat)</th>
                  <th className="py-2.5 px-3 text-right">Sampel RT yang Diaudit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                {districtErrors.map((row) => (
                  <tr key={row.district} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 font-medium">
                    <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">{row.district}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-sm">
                        {row.typology}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.inclusion}</span>
                        {/* Heatmap intensity indicator */}
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${parseFloat(row.inclusion) * 20}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.exclusion}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: `${parseFloat(row.exclusion) * 20}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono">{row.sample} HH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                  <th className="py-2.5 px-3">Segmen Kesejahteraan</th>
                  <th className="py-2.5 px-3">Kesalahan Inklusi (Kebocoran)</th>
                  <th className="py-2.5 px-3">Kesalahan Eksklusi (Penduduk Miskin Terlewat)</th>
                  <th className="py-2.5 px-3">Dampak Penilaian Kebijakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                {decileErrors.map((row) => (
                  <tr key={row.decile} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 font-medium">
                    <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">{row.decile}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.inclusion}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${parseFloat(row.inclusion) * 8}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{row.exclusion}</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-xs overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: `${parseFloat(row.exclusion) * 8}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 italic">{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 10: FAIRNESS & BIAS MONITORING */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Algorithmic Fairness & Bias Monitor
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm">
            NO BIAS DETECTED
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
          Pedoman kebijakan Bappeda mendikte bahwa algoritma penargetan harus tetap netral di seluruh jenis kelamin, geografi, usia, dan disabilitas. Tabel di bawah ini memonitor kesenjangan kinerja antara kategori yang dilindungi untuk memastikan kepatuhan terhadap tata kelola AI yang selaras dengan hak asasi manusia.
        </p>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                <th className="py-2.5 px-3">Kategori Perbandingan</th>
                <th className="py-2.5 px-3">Kelompok Referensi A</th>
                <th className="py-2.5 px-3">Kelompok Kinerja B</th>
                <th className="py-2.5 px-3 text-center">Kesenjangan Varians</th>
                <th className="py-2.5 px-3 text-right">Status Regulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
              {fairnessMetrics.map((row) => (
                <tr key={row.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 font-medium">
                  <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">{row.category}</td>
                  <td className="py-3 px-3 text-slate-500">{row.groupA} <strong className="text-slate-700 dark:text-slate-300 ml-1">({row.valA})</strong></td>
                  <td className="py-3 px-3 text-slate-500">{row.groupB} <strong className="text-slate-700 dark:text-slate-300 ml-1">({row.valB})</strong></td>
                  <td className="py-3 px-3 text-center font-mono text-slate-900 dark:text-slate-100 font-bold">{row.diff}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm uppercase">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 11 & SECTION 12: MODEL COMPARISON & GOVERNANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 11: Model Comparisons */}
        <div className="lg:col-span-7 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Registri Tolok Ukur Model
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Tolok Ukur: OLS PMT</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase font-mono text-[9px] font-bold">
                  <th className="py-2 px-2">Model Pengklasifikasi</th>
                  <th className="py-2 px-2">Akurasi</th>
                  <th className="py-2 px-2">Presisi</th>
                  <th className="py-2 px-2">Recall</th>
                  <th className="py-2 px-2">Kebocoran</th>
                  <th className="py-2 px-2 text-right">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                {modelComparisons.map((row) => (
                  <tr key={row.model} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="py-2.5 px-2 font-bold text-slate-900 dark:text-slate-100">{row.model}</td>
                    <td className="py-2.5 px-2 font-mono">{row.accuracy}</td>
                    <td className="py-2.5 px-2 font-mono">{row.precision}</td>
                    <td className="py-2.5 px-2 font-mono">{row.recall}</td>
                    <td className="py-2.5 px-2 font-mono text-amber-600">{row.inclusion}</td>
                    <td className="py-2.5 px-2 text-right text-slate-400 font-mono">{row.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 12: Model Governance & Parameters */}
        <div className="lg:col-span-5 border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Riwayat & Tata Kelola Versi Model
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Audit Hiperparameter</span>
          </div>

          <div className="space-y-4 text-xs">
            {governanceLogs.map((log) => (
              <div key={log.version} className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{log.version}</span>
                  <span className="text-slate-400 font-mono">{log.date}</span>
                </div>
                <p className="text-slate-500 leading-snug">{log.description}</p>
                <div className="text-[9px] text-slate-400 font-mono">Penulis: {log.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 13: TECHNICAL NOTES / POLICY GLOSSARY */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-slate-900 text-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Shield className="h-4 w-4 text-amber-500" />
          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">
            Penerjemah Metrik Teknis Pembuat Kebijakan (Panduan Bahasa Sederhana)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs leading-relaxed text-slate-400">
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">Akurasi vs Akurasi Seimbang</strong>
            <p>
              Akurasi standar dapat menutupi kinerja buruk jika kelas tidak seimbang. Akurasi seimbang mewakili tingkat rata-rata keberhasilan klasifikasi keluarga miskin dan tidak miskin secara independen.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">Kesalahan Eksklusi (Penduduk Miskin Terlewat)</strong>
            <p>
              Ketika rumah tangga yang benar-benar miskin diklasifikasikan sebagai tidak miskin. Dalam kebijakan pemerintah, ini menyebabkan keluhan masyarakat, gesekan lokal, dan kegagalan untuk perlindungan masyarakat rentan.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">Kesalahan Inklusi (Kebocoran)</strong>
            <p>
              Ketika rumah tangga tidak miskin keliru diklasifikasikan sebagai miskin, membocorkan anggaran sosial yang terbatas ke keluarga kaya. Mengurangi hal ini memaksimalkan efisiensi penyesuaian fiskal.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-200 font-bold block font-mono">Apa itu Kekuatan SHAP?</strong>
            <p>
              SHAP memberi tahu kita kontribusi setiap metrik rumah tangga pada hasil klasifikasinya. Ini menunjukkan bobot relatif prediktor, memungkinkan kita untuk menjelaskan penyebab struktural yang tepat dari klasifikasi kemiskinan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
