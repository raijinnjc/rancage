import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Info,
  Server,
  Database,
  History,
  CheckCircle2,
  Lock,
  ChevronRight,
  Download,
  Terminal,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Globe2,
  Sliders,
  UserCheck
} from 'lucide-react';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { KpiCard } from '../ui/KpiCard.tsx';
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
  Cell,
  PieChart,
  Pie
} from 'recharts';

// Early Warning Alerts Data
const EWS_ALERTS_DATABASE = [
  {
    id: 'EWS-ALT-01',
    category: 'Peningkatan Kemiskinan',
    title: 'Lonjakan Rasio Kemiskinan (P0) Terdeteksi',
    severity: 'CRITICAL',
    description: 'Indeks kemiskinan kecamatan agraris selatan Kabupaten Tasikmalaya melampaui batas toleransi aman 12,0%.',
    reason: 'Kekeringan musiman pra-panen yang parah memicu kontraksi konsumsi pada rumah tangga petani padi kecil.',
    impact: 'Indeks Keparahan Kemiskinan (P2) diperkirakan meningkat +0,08 secara lokal, mendorong 4.200 keluarga rentan ke garis kemiskinan.',
    suggestedAction: 'Salurkan buffer bantuan pangan tunai darurat (Top-Up BPNT) dan subsidi benih langsung ke kelompok tani terdampak.',
    agency: 'Dinas Sosial Provinsi Jawa Barat',
    district: 'Kabupaten Tasikmalaya',
    confidence: 0.94
  },
  {
    id: 'EWS-ALT-02',
    category: 'Kesalahan Eksklusi Tinggi',
    title: 'Eksklusi Pendaftaran Bansos Terdeteksi',
    severity: 'CRITICAL',
    description: 'Pemukiman dataran tinggi Garut menunjukkan lonjakan kesalahan eksklusi penargetan sebesar 8,7%.',
    reason: 'Keterlambatan sinkronisasi basis data catatan sipil; 1.200 rumah tangga Desil 1 belum terdaftar pada daftar terpadu.',
    impact: 'Risiko gesekan sosial dan salah sasaran alokasi anggaran dari kelompok kemiskinan ekstrem.',
    suggestedAction: 'Terjunkan tim verifikasi lapangan dengan perangkat tablet untuk mendata dan memverifikasi rumah tangga secara langsung.',
    agency: 'Disdukcapil & Dinas Sosial Jabar',
    district: 'Kabupaten Garut',
    confidence: 0.91
  },
  {
    id: 'EWS-ALT-03',
    category: 'Penurunan Kinerja Model',
    title: 'Pergeseran Bobot Klasifikasi Prediktif',
    severity: 'WARNING',
    description: 'Penyimpangan prediksi model Gradient Boosting (GBM) melampaui ambang stabilitas 3,5%.',
    reason: 'Data aset dasar kedaluwarsa; indikator aset Susenas 2025 tidak lagi selaras dengan laju urbanisasi cepat di Cirebon.',
    impact: 'Skor PMT prediktif mengalami deviasi akurasi minor, berisiko meningkatkan kebocoran target sebesar 4%.',
    suggestedAction: 'Jalankan rekalibrasi penuh model machine learning menggunakan bobot survei mikro kuartal terbaru yang tervalidasi.',
    agency: 'Unit Pengelola Data Bappeda Jabar',
    district: 'Skala Provinsi',
    confidence: 0.96
  },
  {
    id: 'EWS-ALT-04',
    category: 'Peningkatan Kedalaman P1',
    title: 'Lonjakan Indeks Kedalaman Kemiskinan (P1)',
    severity: 'WARNING',
    description: 'Kecamatan pesisir Indramayu mencatat kenaikan rata-rata kedalaman kemiskinan (P1) sebesar +0,35 poin.',
    reason: 'Penurunan tajam upah di sektor transportasi maritim informal akibat penyesuaian tarif bahan bakar.',
    impact: 'Kesenjangan pengeluaran semakin menjauh dari garis kemiskinan, membutuhkan bantuan per keluarga yang lebih besar.',
    suggestedAction: 'Salurkan subsidi bahan bakar khusus kepada nelayan perahu kecil dan pemegang izin armada D1/D2.',
    agency: 'Dinas Perikanan & Kelautan Jabar',
    district: 'Kabupaten Indramayu',
    confidence: 0.93
  },
  {
    id: 'EWS-ALT-05',
    category: 'Peningkatan Ketimpangan Within',
    title: 'Kenaikan Ketimpangan Spasial Intra-Kabupaten',
    severity: 'WARNING',
    description: 'Indeks Theil dalam-kabupaten (Within) Kabupaten Bandung naik sebesar +0,018 poin.',
    reason: 'Pertumbuhan ekonomi yang terpusat pada koridor industri menyebabkan desa-desa pegunungan tertinggal.',
    impact: 'Melebarnya kesenjangan pengeluaran dan meningkatnya risiko tekanan migrasi desa-ke-kota.',
    suggestedAction: 'Arahkan pendanaan infrastruktur ke jalan pedesaan dan jaringan koperasi pertanian lokal.',
    agency: 'Bappeda Kabupaten Bandung',
    district: 'Kabupaten Bandung',
    confidence: 0.88
  },
  {
    id: 'EWS-ALT-06',
    category: 'Data Belum Lengkap',
    title: 'Kesenjangan Data Survei Aset Terdeteksi',
    severity: 'INFORMATION',
    description: 'Lebih dari 850 data pedesaan di Pangandaran belum memiliki atribut material lantai standar.',
    reason: 'Gagal sinkronisasi perangkat tablet lapangan saat survei di musim hujan.',
    impact: 'Menghambat kalkulasi skor PMT secara akurat dan memblokir verifikasi kelayakan bantuan sementara.',
    suggestedAction: 'Kirim instruksi survei ulang terarah kepada petugas pemantau lapangan di kecamatan terkait.',
    agency: 'Tim Survei Dinsos Pangandaran',
    district: 'Kabupaten Pangandaran',
    confidence: 0.95
  },
  {
    id: 'EWS-ALT-07',
    category: 'Kesalahan Inklusi Tinggi',
    title: 'Peringatan Tumpang Tindih / Kebocoran Sasaran',
    severity: 'WARNING',
    description: 'Daftar sasaran koridor industri Bekasi menunjukkan tumpang tindih dengan penyaluran CSR korporasi swasta.',
    reason: 'Belum adanya sinkronisasi data penerima antara kanal filantropi swasta dengan basis data resmi pemerintah.',
    impact: 'Pemberian manfaat ganda, mengurangi ketersediaan alokasi dana publik bagi kelompok Desil 1 yang belum terlayani.',
    suggestedAction: 'Integrasikan daftar penerima asosiasi industri ke dalam API deduplikasi terbuka RANCAGE.',
    agency: 'Dinas Koperasi & UMKM Jabar',
    district: 'Kabupaten Bekasi',
    confidence: 0.89
  },
  {
    id: 'EWS-ALT-08',
    category: 'Keterlambatan Verifikasi',
    title: 'Keterlambatan Pengesahan Daftar Kesejahteraan',
    severity: 'INFORMATION',
    description: 'Verifikasi otoritas lokal Sukabumi mengalami penundaan selama 14 hari.',
    reason: 'Antrean administratif di kantor persetujuan kecamatan akibat rotasi personel.',
    impact: 'Menunda pencairan bantuan sosial kuartal berjalan kepada 8.500 rumah tangga yang menunggu.',
    suggestedAction: 'Terbitkan pengingat otomatis berprioritas tinggi ke sekretariat daerah setempat.',
    agency: 'Dinas Sosial Jabar',
    district: 'Kabupaten Sukabumi',
    confidence: 0.90
  }
];

// DATA SOURCES & QUALITY SCORE DATABASE (Governance Center)
const DATA_QUALITY_METRICS = {
  completeness: 98.4,
  timeliness: 96.2,
  consistency: 99.1,
  validationStatus: 'SECURED_COMPLIANT'
};

const AUDIT_LOG_DATABASE = [
  { id: 'LOG-001', timestamp: '2026-07-19 10:14:02', user: 'usr_dsos_01 (Dinas Sosial Jabar)', action: 'Ekspor Mikrodata PMT Rumah Tangga', scope: 'Cisolok (Sukabumi) - 450 Data KK Disamarkan', status: 'SUKSES' },
  { id: 'LOG-002', timestamp: '2026-07-19 09:41:11', user: 'usr_bapp_02 (Bappeda Jabar)', action: 'Melihat Evaluasi Model Machine Learning', scope: 'Bobot Pipeline ML Tingkat Provinsi', status: 'SUKSES' },
  { id: 'LOG-003', timestamp: '2026-07-19 08:12:44', user: 'anonymous_fingerprint', action: 'Upaya Query Langsung Mikrodata API', scope: 'REST Endpoint /api/microdata/secure', status: 'DITOLAK_ACL' },
  { id: 'LOG-004', timestamp: '2026-07-19 07:33:02', user: 'usr_sys_admin (Administrator Sistem)', action: 'Kalibrasi Bobot Model PMT', scope: 'Pipeline Gradient Boosting (GBM) v2.1', status: 'SUKSES' },
  { id: 'LOG-005', timestamp: '2026-07-18 16:45:19', user: 'usr_dpupr_03 (Dinas PUPR Jabar)', action: 'Modifikasi Kemajuan Intervensi', scope: 'PROG-01 (Jaringan Air Bersih Pedesaan)', status: 'SUKSES' },
  { id: 'LOG-006', timestamp: '2026-07-18 14:12:00', user: 'usr_dsos_01 (Dinas Sosial Jabar)', action: 'Deduplikasi Pendaftaran Rumah Tangga', scope: 'Dataran Tinggi Garut - 1.200 Data KK Dikalibrasi', status: 'SUKSES' }
];

const GOVERNANCE_RESOURCES = [
  { name: 'Daftar Kesejahteraan Terpadu (Tersinkronisasi DTKS)', format: 'Node Postgres Terenkripsi', lastUpdate: '2026-07-18', size: '24.5 GB', agency: 'Dinas Sosial / Kemensos' },
  { name: 'Survei Sosial Ekonomi Nasional (Susenas BPS)', format: 'Format Parquet BPS', lastUpdate: '2026-07-15', size: '1.2 GB', agency: 'Badan Pusat Statistik' },
  { name: 'Peta Spasial Jawa Barat (Lapisan Bappeda)', format: 'GeoJSON Koordinat Wilayah', lastUpdate: '2026-07-10', size: '420 MB', agency: 'Divisi GIS Bappeda Jabar' },
  { name: 'Bobot Model PMT & Ansambel RANCAGE', format: 'Pipeline Model ML ONNX', lastUpdate: '2026-07-01', size: '85 MB', agency: 'Unit Pengelola Data Bappeda Jabar' }
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<'EWS' | 'GOV'>('EWS');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [ewsSearchQuery, setEwsSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered EWS alerts list
  const filteredEwsAlerts = useMemo(() => {
    return EWS_ALERTS_DATABASE.filter(alt => {
      const matchesSeverity = severityFilter === 'ALL' || alt.severity === severityFilter;
      const matchesSearch = alt.title.toLowerCase().includes(ewsSearchQuery.toLowerCase()) ||
        alt.category.toLowerCase().includes(ewsSearchQuery.toLowerCase()) ||
        alt.district.toLowerCase().includes(ewsSearchQuery.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [severityFilter, ewsSearchQuery]);

  const handleRefreshPipeline = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert('Bobot Pipeline Peringatan Dini & Model RANCAGE berhasil disinkronkan ulang dalam 0,05 detik!');
    }, 1000);
  };

  return (
    <div className="space-y-6 page-transition stagger-children">
      {/* HEADER */}
      <PageHeader
        title="Pusat Tata Kelola, Risiko & Intelijen"
        description="Panel administrasi ganda yang mengawasi peringatan risiko otomatis, kesehatan model machine learning, log akses keamanan, dan sinkronisasi dataset."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefreshPipeline}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 text-blue-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menyinkronkan...' : 'Sinkronisasi Ulang Pipeline'}</span>
            </button>
            <div className="flex rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('EWS')}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${activeTab === 'EWS' ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-white dark:bg-slate-950 text-slate-600 hover:bg-slate-50'}`}
              >
                Pusat Peringatan Dini (EWS)
              </button>
              <button
                onClick={() => setActiveTab('GOV')}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${activeTab === 'GOV' ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-white dark:bg-slate-950 text-slate-600 hover:bg-slate-50'}`}
              >
                Tata Kelola & Audit Keamanan
              </button>
            </div>
          </div>
        }
      />

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Umpan Pemicu Risiko Aktif"
          value={`${EWS_ALERTS_DATABASE.filter(a => a.severity === 'CRITICAL').length} KRITIS`}
          change={`${EWS_ALERTS_DATABASE.length} Peringatan Aktif`}
          trend="up"
          trendDirection="negative"
          description="Total peringatan dini terkomputasi yang membutuhkan tindakan instansi segera."
        />
        <KpiCard
          title="Indeks Kualitas Data"
          value="98,1%"
          change="Target SLA 95,0%"
          trend="up"
          trendDirection="positive"
          description="Skor terpadu untuk kelengkapan, ketepatan waktu, dan konsistensi basis data."
        />
        <KpiCard
          title="Kalibrasi Pipeline Terakhir"
          value="ONNX v2.1"
          change="Terkalibrasi Q4"
          trend="neutral"
          trendDirection="neutral"
          description="Indeks stabilitas bobot Gradient Boosting dan ambang batas keputusan."
        />
        <KpiCard
          title="Status Replikasi Aman"
          value="TERHUBUNG"
          change="Latensi Replikasi: 14ms"
          trend="up"
          trendDirection="positive"
          description="Kesehatan replikasi real-time node basis data Postgres terenkripsi."
        />
      </div>

      {activeTab === 'EWS' ? (
        <>
          {/* EARLY WARNING CENTER */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">RADAR INTELIJEN KEBIJAKAN</span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                  Umpan Peringatan Dini & Klasifikasi Risiko Terintegrasi
                </h4>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari peringatan berdasarkan wilayah/tipe..."
                    value={ewsSearchQuery}
                    onChange={(e) => setEwsSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs focus:outline-none focus:border-blue-500 w-48 font-semibold text-slate-600 dark:text-slate-300"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-xs py-1 px-2 focus:outline-none focus:border-blue-500 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    <option value="ALL">Semua Keparahan</option>
                    <option value="CRITICAL">Kritis</option>
                    <option value="WARNING">Peringatan</option>
                    <option value="INFORMATION">Informasi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid layout of active alerts */}
            <div className="grid grid-cols-1 gap-4">
              {filteredEwsAlerts.length > 0 ? (
                filteredEwsAlerts.map(alertItem => (
                  <div
                    key={alertItem.id}
                    className={`p-4 border rounded-sm flex flex-col md:flex-row justify-between gap-4 transition-all duration-150 ${
                      alertItem.severity === 'CRITICAL' ? 'border-rose-100 bg-rose-50/10 dark:border-rose-950/40 dark:bg-rose-950/5' :
                      alertItem.severity === 'WARNING' ? 'border-amber-100 bg-amber-50/10 dark:border-amber-950/40 dark:bg-amber-950/5' :
                      'border-blue-100 bg-blue-50/10 dark:border-blue-950/40 dark:bg-blue-950/5'
                    }`}
                  >
                    <div className="space-y-2 text-xs flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-sm font-mono font-bold text-[9px] uppercase ${
                          alertItem.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' :
                          alertItem.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {alertItem.severity === 'CRITICAL' ? 'KRITIS' : alertItem.severity === 'WARNING' ? 'PERINGATAN' : 'INFORMASI'}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] font-bold">KATEGORI: {alertItem.category}</span>
                        <span className="text-slate-400 font-mono text-[10px]">• WILAYAH: {alertItem.district}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{alertItem.title}</h4>
                      
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{alertItem.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-900 pt-2 text-[11px] text-slate-500">
                        <div>
                          <strong>Akar Masalah / Alasan:</strong> <span className="italic">&ldquo;{alertItem.reason}&rdquo;</span>
                        </div>
                        <div>
                          <strong>Potensi Dampak Multidimensi:</strong> <span className="italic">&ldquo;{alertItem.impact}&rdquo;</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xs border border-slate-200 dark:border-slate-800 mt-2 text-[11px]">
                        <span className="font-bold text-blue-600 dark:text-blue-400 font-mono uppercase block text-[9px]">REKOMENDASI TINDAKAN KOREKTIF</span>
                        <p className="text-slate-600 dark:text-slate-300 font-semibold mt-0.5">{alertItem.suggestedAction}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end shrink-0 text-right text-[10px] font-mono text-slate-400 md:w-44 border-l border-slate-100 dark:border-slate-900 pl-4">
                      <div className="space-y-1">
                        <span className="block uppercase font-bold text-[9px] text-slate-400 leading-tight">Instansi Penanggung Jawab</span>
                        <span className="block font-sans font-bold text-slate-700 dark:text-slate-300 mt-0.5">{alertItem.agency}</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Tingkat Keyakinan: <strong className="text-emerald-600 font-bold">{(alertItem.confidence * 100).toFixed(0)}%</strong>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Semua indikator risiko aman. Tidak ada peringatan dini yang sesuai kriteria pencarian.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* GOVERNANCE & SECURITY AUDIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* AUDIT COCKPIT & DATA SOURCES */}
            <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">TRANSPARANSI REGULASI & DATA</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                    Sumber Dataset Standar & Versi Node RANCAGE
                  </h4>
                </div>

                <div className="space-y-3">
                  {GOVERNANCE_RESOURCES.map((res) => (
                    <div key={res.name} className="p-3 border border-slate-100 dark:border-slate-900 rounded-sm flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Database className="h-4 w-4 text-blue-500 shrink-0" />
                          <strong className="text-slate-800 dark:text-slate-100 font-bold">{res.name}</strong>
                        </div>
                        <span className="block text-[10px] text-slate-400">Instansi Pemilik: {res.agency}</span>
                      </div>
                      <div className="text-right font-mono text-[10px] text-slate-400 space-y-1">
                        <span className="block">Sinkronisasi Terakhir: <strong className="text-slate-700 dark:text-slate-200">{res.lastUpdate}</strong></span>
                        <span className="block">{res.size} ({res.format})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DATA QUALITY BREAKDOWN CARD */}
              <div className="border-t border-slate-100 dark:border-slate-900 pt-4 mt-4 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold mb-2">Rincian Penilaian Kualitas Otomatis</span>
                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-sm border border-slate-100 dark:border-slate-900">
                    <span className="block text-[8px] text-slate-400 font-bold">KELENGKAPAN</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">{DATA_QUALITY_METRICS.completeness}%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-sm border border-slate-100 dark:border-slate-900">
                    <span className="block text-[8px] text-slate-400 font-bold">KETEPATAN WAKTU</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">{DATA_QUALITY_METRICS.timeliness}%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-sm border border-slate-100 dark:border-slate-900">
                    <span className="block text-[8px] text-slate-400 font-bold">KONSISTENSI</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">{DATA_QUALITY_METRICS.consistency}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE SYSTEM AUDIT LOGS & ACCESS HISTORY */}
            <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-6 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-900 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">REPOSITORI AUDIT RESMI</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
                      Log Sesi & Registri Akses Keamanan
                    </h4>
                  </div>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-mono px-2 py-0.5 font-bold rounded-sm">
                    SESI AKTIF: 14
                  </span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {AUDIT_LOG_DATABASE.map(log => (
                    <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 rounded-sm space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className={`font-bold ${log.status.includes('SUKSES') ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200">
                        {log.user} <span className="font-normal text-slate-400 font-mono">({log.action})</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Cakupan Data: {log.scope}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-400 font-mono leading-relaxed mt-4 flex items-center gap-1">
                <Lock className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Log audit terenkripsi dan terlindungi secara hukum di bawah UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP).</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
