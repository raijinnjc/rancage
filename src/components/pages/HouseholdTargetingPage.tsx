import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Sliders,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  Eye,
  EyeOff,
  ShieldAlert,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  ChevronRight,
  RefreshCw,
  Activity,
  Award
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { PageHeader } from '../ui/PageHeader.tsx';
import { KpiCard } from '../ui/KpiCard.tsx';
import { DataTable } from '../ui/DataTable.tsx';
import { Drawer } from '../ui/Drawer.tsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { formatPercentage, formatNumber, formatRupiah, maskName, maskNIK } from '../../utils/format.ts';

// Deterministic Dynamic Dataset Generator (Token-Saving & Fully Customizable)
const generateHouseholdsData = () => {
  const districts = ["Kabupaten Tasikmalaya", "Kabupaten Garut", "Kabupaten Cianjur", "Kabupaten Sukabumi"];
  const villages = ["Desa Sukarasa", "Desa Karangtengah", "Desa Bojong", "Desa Sukamaju", "Desa Cisolok", "Desa Jampang"];
  const firstNames = ["Ahmad", "Cucum", "Dadang", "Emin", "Mulyana", "Sutisna", "Subarjo", "Kurnia", "Cahyani", "Maemunah", "Farida", "Darsa", "Sukmana", "Pebriani", "Jaka", "Siti", "Hendra", "Dewi", "Agus", "Sri"];
  const lastNames = ["Saputra", "Hidayat", "Pratama", "Wijaya", "Kusuma", "Setiawan", "Nugraha", "Siregar", "Lubis", "Wibowo", "Putra", "Sari", "Kartika", "Rahayu", "Lestari", "Ramadhan", "Fitriani", "Utami", "Suryana", "Yusuf"];
  const housingMaterials = ["Papan Kayu Albasia (Tidak Layak)", "Anyaman Bambu (Tidak Layak)", "Bata Merah Kurang Standar", "Kayu Lapuk (Tidak Layak)", "Tanah Padat (Tidak Layak)", "Atap Seng Karatan"];
  const educationLevels = ["Tidak Sekolah Formal", "SD Tidak Tamat", "Tamat SD", "Tamat SMP", "Tamat SMA"];
  const occupations = ["Buruh Tani Informal", "Tidak Bekerja / Pengangguran", "Pedagang Kaki Lima", "Buruh Harian Lepas", "Nelayan Tradisional", "Pengepul Barang Bekas"];
  const assets = ["Tidak memiliki aset produktif", "1 sepeda motor tua", "Hanya sepeda", "Hanya penerima radio", "Alat pertanian kurang standar"];
  const waterSources = ["Mata Air Tidak Terlindungi (Tidak Layak)", "Sumur Gali Terbuka (Tidak Layak)", "Air Sungai", "Tampungan Air Hujan"];
  const currentAids = [["PKH"], ["BPNT"], ["BLT-DD"], ["PKH", "BPNT"], ["Tidak Ada"]];
  const verificationReasons = [
    "Tingkat keyakinan prediksi model rendah",
    "Metrik indikator struktural bertentangan",
    "Parameter kependudukan sipil tidak lengkap",
    "Guncangan ekonomi terbaru / perubahan status sosial ekonomi"
  ];

  const list = [];
  for (let i = 1; i <= 30; i++) {
    const distIndex = i % districts.length;
    const vilIndex = (i * 3) % villages.length;
    const nameIndex1 = (i * 7) % firstNames.length;
    const nameIndex2 = (i * 11) % lastNames.length;
    
    const pmtScore = parseFloat((12.5 + (i * 1.34) % 24).toFixed(2));
    const prob = parseFloat((0.96 - (i * 0.026)).toFixed(2));
    const confidence = parseFloat((0.74 + ((i * 17) % 25) / 100).toFixed(2));
    
    const decile = pmtScore < 18 ? "D1" : pmtScore < 24 ? "D2" : pmtScore < 29 ? "D3" : "D4";
    const eligibility = pmtScore < 24 ? "Eligible" : "Ineligible";
    const priority = pmtScore < 16 ? "Critical" : pmtScore < 21 ? "High" : pmtScore < 27 ? "Medium" : "Low";
    
    // Distribute various verification statuses
    const status = i % 8 === 0 ? "Discrepancy" : i % 5 === 0 ? "Requires Field Survey" : i % 6 === 0 ? "Pending" : "Verified";
    
    list.push({
      id: `RT-32${10 + distIndex}-${String(i * 137).padStart(4, '0')}`,
      district: districts[distIndex],
      village: villages[vilIndex],
      headOfHousehold: `${firstNames[nameIndex1]} ${lastNames[nameIndex2]}`,
      nik: `32${10 + distIndex}${String(2405800000 + i * 4921).padEnd(10, '0')}`,
      decile,
      pmtScore,
      probabilityOfPoverty: prob,
      predictionConfidence: confidence,
      eligibilityStatus: eligibility,
      priorityLevel: priority,
      lastVerification: i % 4 === 0 ? "Butuh Verifikasi" : `2026-0${1 + (i % 5)}-${10 + (i % 15)}`,
      status,
      reason: (status !== "Verified" || i % 4 === 0) ? verificationReasons[i % verificationReasons.length] : undefined,
      
      characteristics: {
        size: (i % 3) + 3,
        dependents: (i % 2) + 1,
        housingQuality: housingMaterials[i % housingMaterials.length],
        floorQuality: i % 2 === 0 ? "Tanah Padat (Tidak Layak)" : "Ubin Semen Kurang Layak",
        education: educationLevels[i % educationLevels.length],
        employment: occupations[i % occupations.length],
        assets: assets[i % assets.length],
        utilities: i % 3 === 0 ? "Tanpa listrik (Tidak Layak)" : `${450 + (i % 2) * 450}VA Bersubsidi`,
        waterAccess: waterSources[i % waterSources.length],
        healthAccess: i % 2 === 0 ? "BPJS-PBI Subsidi Pemerintah" : "Mandiri / Tidak Tercover (Rentan)",
        currentAssistance: currentAids[i % currentAids.length].join(", ")
      },
      factors: [
        { factor: "Kualitas Dinding & Atap Rumah Buruk", weight: Math.round(25 + (i * 3) % 25) },
        { factor: "Status Pengangguran / Pekerja Informal", weight: Math.round(20 + (i * 5) % 20) },
        { factor: "Tingkat Pendidikan Kepala Keluarga Rendah", weight: Math.round(15 + (i * 7) % 15) },
        { factor: "Defisit Sanitasi & Jamban Layak", weight: Math.round(10 + (i * 11) % 15) },
        { factor: "Ketiadaan Akses Sumber Air Minum Bersih", weight: Math.round(5 + (i * 13) % 15) }
      ].sort((a, b) => b.weight - a.weight),
      
      intervention: {
        program: pmtScore < 17 ? "Program Keluarga Harapan (PKH) Kemiskinan Ekstrem" : pmtScore < 23 ? "Bantuan Pangan Non-Tunai (BPNT)" : "Bantuan Modal Usaha Mikro Produktif (UMKM)",
        benefitValue: pmtScore < 17 ? 2400000 : pmtScore < 23 ? 1800000 : 3000000,
        reason: pmtScore < 23 ? "Defisit konsumsi pangan multidimensi dan sanitasi air bersih parah" : "Kepala keluarga usia produktif dengan pengangguran struktural yang membutuhkan stimulasi modal usaha",
        sequence: pmtScore < 17 ? "Tahap 1 - Aktivasi Rekening Tunai Pos/Bank" : "Tahap 2 - Integrasi Data Kelompok Usaha Bersama (KUBE)",
        institution: pmtScore < 23 ? "Dinas Sosial Provinsi Jawa Barat" : "Dinas Koperasi & UMKM Jawa Barat",
        confidence: confidence
      }
    });
  }
  return list;
};

export default function HouseholdTargetingPage() {
  const { selectedDistrictId, setSelectedDistrictId } = useNavigationStore();
  const allHouseholds = useMemo(() => generateHouseholdsData(), []);

  // UI Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterVillage, setFilterVillage] = useState('All');
  const [filterDecile, setFilterDecile] = useState('All');
  const [filterEligibility, setFilterEligibility] = useState('All');
  const [filterPmtCategory, setFilterPmtCategory] = useState('All');
  const [filterConfidence, setFilterConfidence] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterVerificationReason, setFilterVerificationReason] = useState('All');

  // Privacy Protection Toggle
  const [isPiiRevealed, setIsPiiRevealed] = useState(false);

  // Sorting & Selected Row drawer State
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Columns visibility selectors state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    village: true,
    decile: true,
    pmtScore: true,
    probability: true,
    confidence: true,
    eligibility: true,
    priority: true,
    verification: true,
  });

  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

  // Active district selected label
  const activeDistrictName = useMemo(() => {
    if (filterDistrict !== 'All') return filterDistrict;
    const match = WEST_JAVA_DISTRICTS.find(d => d.id === selectedDistrictId);
    return match ? match.name : "Kabupaten Tasikmalaya";
  }, [selectedDistrictId, filterDistrict]);

  // Derived lists based on selection
  const uniqueVillages = useMemo(() => {
    return Array.from(new Set(allHouseholds.map(h => h.village)));
  }, [allHouseholds]);

  // Filtering Logic (Multi-filtering support)
  const filteredHouseholds = useMemo(() => {
    return allHouseholds.filter((h) => {
      // Search Box (ID or Head of Household)
      const matchesSearch =
        h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.headOfHousehold.toLowerCase().includes(searchQuery.toLowerCase());

      // District Filter
      const matchesDistrict =
        filterDistrict === 'All' || h.district === filterDistrict;

      // Village Filter
      const matchesVillage =
        filterVillage === 'All' || h.village === filterVillage;

      // Decile Filter
      const matchesDecile =
        filterDecile === 'All' || h.decile === filterDecile;

      // Eligibility Status
      const matchesEligibility =
        filterEligibility === 'All' || h.eligibilityStatus === filterEligibility;

      // PMT Category
      const matchesPmtCategory =
        filterPmtCategory === 'All' ||
        (filterPmtCategory === 'Extreme Poor' && h.pmtScore < 18) ||
        (filterPmtCategory === 'Moderate Poor' && h.pmtScore >= 18 && h.pmtScore < 24) ||
        (filterPmtCategory === 'Vulnerable' && h.pmtScore >= 24 && h.pmtScore < 29) ||
        (filterPmtCategory === 'Near Non-Poor' && h.pmtScore >= 29);

      // Prediction Confidence Level
      const matchesConfidence =
        filterConfidence === 'All' ||
        (filterConfidence === 'High' && h.predictionConfidence >= 0.90) ||
        (filterConfidence === 'Medium' && h.predictionConfidence >= 0.75 && h.predictionConfidence < 0.90) ||
        (filterConfidence === 'Low' && h.predictionConfidence < 0.75);

      // Auditing Status
      const matchesStatus =
        filterStatus === 'All' || h.status === filterStatus;

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesVillage &&
        matchesDecile &&
        matchesEligibility &&
        matchesPmtCategory &&
        matchesConfidence &&
        matchesStatus
      );
    });
  }, [allHouseholds, searchQuery, filterDistrict, filterVillage, filterDecile, filterEligibility, filterPmtCategory, filterConfidence, filterStatus]);

  // Households requiring manual verification (Section 8)
  const verificationQueueData = useMemo(() => {
    const queue = allHouseholds.filter(h => h.status !== 'Verified' || h.lastVerification === 'Requires Verification');
    if (filterVerificationReason === 'All') return queue;
    return queue.filter(h => h.reason === filterVerificationReason);
  }, [allHouseholds, filterVerificationReason]);

  // Selected single household computed details
  const selectedHousehold = useMemo(() => {
    return allHouseholds.find(h => h.id === selectedRowId) || allHouseholds[0];
  }, [allHouseholds, selectedRowId]);

  // Metrics summary based on current filtered dataset (Section 1 / Section 2)
  const summaryMetrics = useMemo(() => {
    const total = filteredHouseholds.length;
    const poorCount = filteredHouseholds.filter(h => h.eligibilityStatus === 'Eligible').length;
    const riskCount = filteredHouseholds.filter(h => h.decile === 'D2' || h.decile === 'D3').length;
    const highPriority = filteredHouseholds.filter(h => h.priorityLevel === 'Critical' || h.priorityLevel === 'High').length;
    
    const totalPmt = filteredHouseholds.reduce((acc, curr) => acc + curr.pmtScore, 0);
    const avgPmt = total > 0 ? (totalPmt / total).toFixed(2) : '0.00';
    
    const totalConf = filteredHouseholds.reduce((acc, curr) => acc + curr.predictionConfidence, 0);
    const avgConf = total > 0 ? (totalConf / total * 100).toFixed(1) : '0.0';

    const requiresVerification = filteredHouseholds.filter(h => h.status !== 'Verified' || h.lastVerification === 'Requires Verification').length;

    return {
      total,
      poorCount,
      riskCount,
      highPriority,
      avgPmt,
      avgConf,
      requiresVerification
    };
  }, [filteredHouseholds]);

  // Recharts aggregations (Section 7: Distribution Visuals)
  const decileChartData = useMemo(() => {
    const counts: Record<string, number> = { D1: 0, D2: 0, D3: 0, D4: 0 };
    filteredHouseholds.forEach(h => {
      if (counts[h.decile] !== undefined) counts[h.decile]++;
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [filteredHouseholds]);

  const eligibilityChartData = useMemo(() => {
    let eligible = 0;
    let ineligible = 0;
    filteredHouseholds.forEach(h => {
      if (h.eligibilityStatus === 'Eligible') eligible++;
      else ineligible++;
    });
    return [
      { name: 'Eligible (Social Welfare)', value: eligible },
      { name: 'Ineligible', value: ineligible }
    ];
  }, [filteredHouseholds]);

  const confidenceChartData = useMemo(() => {
    let high = 0;
    let med = 0;
    let low = 0;
    filteredHouseholds.forEach(h => {
      if (h.predictionConfidence >= 0.90) high++;
      else if (h.predictionConfidence >= 0.75) med++;
      else low++;
    });
    return [
      { name: 'High (>90%)', value: high },
      { name: 'Medium (75-90%)', value: med },
      { name: 'Low (<75%)', value: low }
    ];
  }, [filteredHouseholds]);

  const pmtScoreDistributionData = useMemo(() => {
    // Bucket PMT scores into intervals
    const buckets: Record<string, number> = { '12-16': 0, '16-20': 0, '20-24': 0, '24-28': 0, '28-32': 0, '32+': 0 };
    filteredHouseholds.forEach(h => {
      if (h.pmtScore < 16) buckets['12-16']++;
      else if (h.pmtScore < 20) buckets['16-20']++;
      else if (h.pmtScore < 24) buckets['20-24']++;
      else if (h.pmtScore < 28) buckets['24-28']++;
      else if (h.pmtScore < 32) buckets['28-32']++;
      else buckets['32+']++;
    });
    return Object.keys(buckets).map(k => ({ range: k, count: buckets[k] }));
  }, [filteredHouseholds]);

  const villageDistributionData = useMemo(() => {
    const vils: Record<string, number> = {};
    filteredHouseholds.forEach(h => {
      vils[h.village] = (vils[h.village] || 0) + 1;
    });
    return Object.keys(vils).map(k => ({ name: k.replace('Desa ', ''), count: vils[k] }));
  }, [filteredHouseholds]);

  const translateEligibility = (status: string) => status === 'Eligible' ? 'Layak Menerima' : 'Tidak Layak';
  const translatePriority = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'Kritis';
      case 'High': return 'Tinggi';
      case 'Medium': return 'Sedang';
      case 'Low': return 'Rendah';
      default: return priority;
    }
  };
  const translateStatus = (status: string) => {
    switch (status) {
      case 'Verified': return 'Terverifikasi';
      case 'Pending': return 'Menunggu Audit';
      case 'Requires Field Survey': return 'Butuh Survei Lapangan';
      case 'Discrepancy': return 'Ketidaksesuaian Data';
      default: return status;
    }
  };

  const handleRowClick = (row: any) => {
    setSelectedRowId(row.id);
    setIsDrawerOpen(true);
  };

  // CSV & Excel Custom Client-Side exporter conforming to spec
  const handleExportData = (type: 'csv' | 'xls') => {
    const headers = ['ID Rumah Tangga', 'Desa/Kelurahan', 'Kabupaten/Kota', 'Desil Kesejahteraan', 'Skor PMT', 'Probabilitas Kemiskinan', 'Tingkat Keyakinan', 'Kelayakan', 'Prioritas', 'Verifikasi Terakhir', 'Kepala Keluarga'];
    const rows = filteredHouseholds.map(h => [
      h.id,
      h.village,
      h.district,
      h.decile,
      h.pmtScore,
      h.probabilityOfPoverty,
      h.predictionConfidence,
      translateEligibility(h.eligibilityStatus),
      translatePriority(h.priorityLevel),
      h.lastVerification,
      isPiiRevealed ? h.headOfHousehold : maskName(h.headOfHousehold)
    ]);

    const content = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RANCAGE_household_targeting_${activeDistrictName.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.${type === 'csv' ? 'csv' : 'xls'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Theme colors matching RANCAGE system
  const PIE_COLORS = ['#3b82f6', '#e2e8f0', '#fb7185', '#34d399'];

  return (
    <div className="space-y-6">
      {/* ACCESS PRIVACY BANNER (Section 11) */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-sm shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider block font-mono text-amber-500">
              Peringatan Perlindungan Kepatuhan UU PDP (UU No. 27/2022)
            </span>
            <p className="text-[11px] text-slate-400 max-w-3xl leading-relaxed">
              Mikrodata tingkat rumah tangga diklasifikasikan sebagai data sosial ekonomi yang dilindungi. Informasi Identitas Pribadi (PII) seperti nama Kepala Keluarga dan Nomor Induk Kependudukan (NIK) disamarkan secara dinamis. Ekspor data yang tidak sah dipantau oleh sistem penelusuran audit pemerintah.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsPiiRevealed(!isPiiRevealed)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors shrink-0"
        >
          {isPiiRevealed ? <EyeOff className="h-3.5 w-3.5 text-rose-500" /> : <Eye className="h-3.5 w-3.5 text-emerald-500" />}
          <span>{isPiiRevealed ? 'Samarkan PII Sensitif' : 'Tampilkan PII Aman'}</span>
        </button>
      </div>

      {/* PAGE HEADER */}
      <PageHeader
        title="Kecerdasan Penyasaran Rumah Tangga"
        description="Menerjemahkan anggaran makro provinsi dan target kabupaten/kota ke dalam kalibrasi sasaran individu."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm px-2.5 h-8">
              <span className="text-[10px] font-bold text-slate-400 font-mono">WILAYAH:</span>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none pr-1 focus:ring-0 cursor-pointer"
              >
                {WEST_JAVA_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id} className="dark:bg-slate-950">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1">
              <span>Model:</span>
              <strong className="text-slate-800 dark:text-slate-200">XGBoost-PMT v2.1.2</strong>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1">
              <span>Roster:</span>
              <strong className="text-slate-800 dark:text-slate-200">2026-Q3</strong>
            </div>
          </div>
        }
      />

      {/* SECTION 1: EXECUTIVE SUMMARY */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
        <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Ikhtisar Naratif Penyasaran Sistem
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">MEJA INTEGRASI KEPUTUSAN</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="lg:col-span-3 space-y-3.5 leading-relaxed text-[12px]">
            <p>
              Di <strong className="text-slate-900 dark:text-white font-semibold">{activeDistrictName}</strong>, algoritma Proxy Means Testing (PMT) telah mengaudit <strong className="text-slate-900 dark:text-white font-medium">{summaryMetrics.total} rumah tangga</strong> dalam daftar sampel aktif kami, serta mengidentifikasi <strong className="text-rose-600 dark:text-rose-400 font-bold">{summaryMetrics.poorCount} keluarga layak menerima bantuan</strong> yang pengeluaran strukturalnya berada di bawah indeks garis kemiskinan.
            </p>
            <p>
              Di antara yang dianalisis, <strong className="text-slate-900 dark:text-white font-medium">{summaryMetrics.highPriority} rumah tangga</strong> diklasifikasikan sebagai <span className="text-rose-700 dark:text-rose-400 font-bold uppercase font-mono bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded-sm">Prioritas Kritis/Tinggi</span> yang memerlukan penyaluran intervensi segera. Klasifikasi pembelajaran mesin kami beroperasi pada rata-rata keyakinan prediksi keseluruhan yang tinggi sebesar <strong className="text-slate-800 dark:text-slate-200 font-mono">{summaryMetrics.avgConf}%</strong>, menggunakan metode gradient boosting untuk menganalisis indeks deprivasi multidimensi termasuk sanitasi, akses listrik, kualitas hunian, dan tingkat pendidikan kepala keluarga.
            </p>
            <p className="text-[11px] text-slate-400 flex items-start gap-1.5 italic bg-slate-50 dark:bg-slate-900/40 p-2.5 border-l-2 border-blue-500 rounded-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Wawasan penyasaran utama:</strong> Kebocoran inklusi di dalam wilayah dapat ditekan hingga 4,2% dengan melakukan verifikasi silang terhadap {summaryMetrics.requiresVerification} daftar yang tertunda dalam Antrean Verifikasi di bawah ini.</span>
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900 rounded-sm p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">RINGKASAN ANGGARAN</span>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Estimasi Nilai Manfaat:</span>
                <span className="text-lg font-bold font-mono block text-slate-900 dark:text-slate-100">
                  {formatRupiah(summaryMetrics.poorCount * 1950000)}
                </span>
                <span className="text-[9px] text-slate-400">Dihitung berdasarkan rata-rata bantuan PKH tahunan sebesar Rp 1,95 Juta per rumah tangga</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-900 mt-2 flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
              <Layers className="h-3.5 w-3.5" />
              <span>Versi data: V2.16-FINAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TARGETING KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Rumah Tangga Dianalisis"
          value={formatNumber(summaryMetrics.total)}
          change="Cakupan 100,0%"
          trend="neutral"
          trendDirection="neutral"
          description="Daftar sosial ekonomi rumah tangga yang diproses oleh model diagnostik regional."
        />
        <KpiCard
          title="Rumah Tangga Layak (Eligible)"
          value={formatNumber(summaryMetrics.poorCount)}
          change={`Tingkat Kemiskinan ${((summaryMetrics.poorCount / (summaryMetrics.total || 1)) * 100).toFixed(1).replace('.', ',')}%`}
          trend="down"
          trendDirection="positive"
          description="Penerima manfaat yang memenuhi syarat untuk program bantuan sosial langsung."
        />
        <KpiCard
          title="Rata-rata Skor PMT"
          value={summaryMetrics.avgPmt.replace('.', ',')}
          change="Baseline: 21,4"
          trend="up"
          trendDirection="neutral"
          description="Rata-rata estimasi pengeluaran konsumsi Proxy Means Test."
        />
        <KpiCard
          title="Tingkat Keyakinan Model"
          value={`${summaryMetrics.avgConf.replace('.', ',')}%`}
          change="+0,85% vs Kuartal Sebelumnya"
          trend="up"
          trendDirection="positive"
          description="Rata-rata kepastian algoritma di seluruh klasifikasi keputusan."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium font-mono uppercase">Kesalahan Inklusi (Kebocoran)</span>
            <span className="text-emerald-500 text-xs font-bold font-mono">3,41%</span>
          </div>
          <div className="text-xl font-bold font-mono">3,41%</div>
          <p className="text-[10px] text-slate-400">Rumah tangga tidak layak yang diklasifikasikan sebagai miskin. Target: &lt;5%</p>
        </div>
        <div className="p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium font-mono uppercase">Kesalahan Eksklusi (Tertinggal)</span>
            <span className="text-emerald-500 text-xs font-bold font-mono">2,88%</span>
          </div>
          <div className="text-xl font-bold font-mono">2,88%</div>
          <p className="text-[10px] text-slate-400">Rumah tangga miskin yang terlewat oleh sistem. Target: &lt;4%</p>
        </div>
        <div className="p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium font-mono uppercase">Butuh Verifikasi Lapangan</span>
            <span className="text-amber-500 text-xs font-bold font-mono">Menunggu Audit</span>
          </div>
          <div className="text-xl font-bold font-mono">{summaryMetrics.requiresVerification} RT</div>
          <p className="text-[10px] text-slate-400">Daftar yang saat ini berada dalam antrean untuk peninjauan audit manual.</p>
        </div>
      </div>

      {/* SECTION 3: ADVANCED SEARCH & MULTI-FILTERING PANEL */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Penyaringan Tingkat Lanjut & Inti Kueri
            </h4>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterDistrict('All');
              setFilterVillage('All');
              setFilterDecile('All');
              setFilterEligibility('All');
              setFilterPmtCategory('All');
              setFilterConfidence('All');
              setFilterStatus('All');
            }}
            className="text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase transition-colors"
          >
            Atur Ulang Semua Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Search bar */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Cari Berdasarkan ID atau Nama KK</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ketik ID Rumah Tangga atau Nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* District Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Kabupaten / Kota</label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none cursor-pointer focus:border-blue-500 dark:bg-slate-950"
            >
              <option value="All">Semua Kabupaten/Kota</option>
              <option value="Kabupaten Tasikmalaya">Kab. Tasikmalaya</option>
              <option value="Kabupaten Garut">Kab. Garut</option>
              <option value="Kabupaten Cianjur">Kab. Cianjur</option>
              <option value="Kabupaten Sukabumi">Kab. Sukabumi</option>
            </select>
          </div>

          {/* Village Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Desa / Kelurahan</label>
            <select
              value={filterVillage}
              onChange={(e) => setFilterVillage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none cursor-pointer focus:border-blue-500 dark:bg-slate-950"
            >
              <option value="All">Semua Desa/Kelurahan</option>
              {uniqueVillages.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Welfare Decile */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Desil Kesejahteraan</label>
            <select
              value={filterDecile}
              onChange={(e) => setFilterDecile(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none cursor-pointer focus:border-blue-500 dark:bg-slate-950"
            >
              <option value="All">Semua Desil</option>
              <option value="D1">D1 (Paling Miskin)</option>
              <option value="D2">D2</option>
              <option value="D3">D3</option>
              <option value="D4">D4 (Kurang Rentan)</option>
            </select>
          </div>

          {/* PMT Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Kategori Kemiskinan PMT</label>
            <select
              value={filterPmtCategory}
              onChange={(e) => setFilterPmtCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none cursor-pointer focus:border-blue-500 dark:bg-slate-950"
            >
              <option value="All">Semua Kategori</option>
              <option value="Extreme Poor">Sangat Miskin (&lt;18)</option>
              <option value="Moderate Poor">Miskin Sedang (18-24)</option>
              <option value="Vulnerable">Rentan (24-29)</option>
              <option value="Near Non-Poor">Hampir Tidak Miskin (29+)</option>
            </select>
          </div>

          {/* Prediction Confidence */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Keyakinan Prediksi</label>
            <select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none cursor-pointer focus:border-blue-500 dark:bg-slate-950"
            >
              <option value="All">Semua Tingkat Keyakinan</option>
              <option value="High">Tinggi (&gt;=90%)</option>
              <option value="Medium">Sedang (75-90%)</option>
              <option value="Low">Rendah (&lt;75%)</option>
            </select>
          </div>

          {/* Verification Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Status Verifikasi</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none cursor-pointer focus:border-blue-500 dark:bg-slate-950"
            >
              <option value="All">Semua Status</option>
              <option value="Verified">Terverifikasi</option>
              <option value="Pending">Menunggu Audit</option>
              <option value="Requires Field Survey">Butuh Survei Lapangan</option>
              <option value="Discrepancy">Ketidaksesuaian Data</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: HOUSEHOLD INTELLIGENCE TABLE & COLUMN SELECTOR */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-900">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">INDEKS MIKRODATA</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Daftar Kecerdasan Kemiskinan Rumah Tangga
            </h4>
          </div>
          <div className="flex items-center gap-2">
            {/* Column Selector Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
                className="inline-flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                <Sliders className="h-3.5 w-3.5" />
                Kolom
              </button>
              {isColumnSelectorOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm shadow-md z-30 p-2.5 space-y-1.5 text-[11px] font-medium">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono mb-1">Pilih Kolom</span>
                  {Object.keys(visibleColumns).map((col) => (
                    <label key={col} className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 rounded-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(visibleColumns as any)[col]}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, [col]: !(prev as any)[col] }))}
                        className="rounded-xs text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="capitalize">
                        {col === 'id' ? 'ID Rumah Tangga' : 
                         col === 'village' ? 'Desa/Kelurahan' : 
                         col === 'decile' ? 'Desil' : 
                         col === 'pmtScore' ? 'Skor PMT' : 
                         col === 'probability' ? 'Probabilitas' : 
                         col === 'confidence' ? 'Keyakinan' : 
                         col === 'eligibility' ? 'Kelayakan' : 
                         col === 'priority' ? 'Prioritas' : 
                         col === 'verification' ? 'Verifikasi Terakhir' : col}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Client-Side Exporters */}
            <button
              onClick={() => handleExportData('csv')}
              className="inline-flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </button>
            <button
              onClick={() => handleExportData('xls')}
              className="inline-flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Excel
            </button>
          </div>
        </div>

        {/* Dynamic Column Builder conforming to Column select state */}
        <DataTable
          columns={[
            ...(visibleColumns.id ? [{ key: 'id', header: 'ID Rumah Tangga', sortable: true }] : []),
            ...(visibleColumns.village ? [{ key: 'village', header: 'Desa/Kelurahan', sortable: true }] : []),
            { 
              key: 'headOfHousehold', 
              header: 'Kepala Keluarga', 
              render: (row: any) => (
                <div className="font-semibold">
                  {isPiiRevealed ? row.headOfHousehold : maskName(row.headOfHousehold)}
                </div>
              )
            },
            ...(visibleColumns.decile ? [{ key: 'decile', header: 'Desil Kesejahteraan', sortable: true }] : []),
            ...(visibleColumns.pmtScore ? [{ key: 'pmtScore', header: 'Skor PMT', sortable: true, render: (row: any) => row.pmtScore.toFixed(2).replace('.', ',') }] : []),
            ...(visibleColumns.probability ? [{ key: 'probabilityOfPoverty', header: 'Probabilitas Kemiskinan', sortable: true, render: (row: any) => `${Math.round(row.probabilityOfPoverty * 100)}%` }] : []),
            ...(visibleColumns.confidence ? [{ key: 'predictionConfidence', header: 'Keyakinan', sortable: true, render: (row: any) => `${Math.round(row.predictionConfidence * 100)}%` }] : []),
            ...(visibleColumns.eligibility ? [{ 
               key: 'eligibilityStatus', 
              header: 'Kelayakan', 
              sortable: true,
              render: (row: any) => (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                  row.eligibilityStatus === 'Eligible' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {translateEligibility(row.eligibilityStatus)}
                </span>
              )
            }] : []),
            ...(visibleColumns.priority ? [{ 
              key: 'priorityLevel', 
              header: 'Prioritas', 
              sortable: true,
              render: (row: any) => (
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs ${
                  row.priorityLevel === 'Critical' 
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' 
                    : row.priorityLevel === 'High'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                }`}>
                  {translatePriority(row.priorityLevel)}
                </span>
              )
            }] : []),
            ...(visibleColumns.verification ? [{ key: 'lastVerification', header: 'Verifikasi Terakhir', sortable: true }] : []),
          ]}
          data={filteredHouseholds}
          pageSize={10}
          onRowClick={handleRowClick}
          selectedRowId={selectedRowId || undefined}
        />
      </div>

      {/* SECTION 7: HOUSEHOLD DISTRIBUTION CHART BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="section-distribution-charts">
        {/* Welfare Decile Distribution */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">CAMPURAN SEGMENTASI</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Distribusi Rumah Tangga Berdasarkan Desil Kesejahteraan (D1-D4)
            </h4>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={decileChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {decileChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PMT Score Distribution Area Chart */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">PROFIL SKOR BERKELANJUTAN</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Kepadatan Distribusi Rumah Tangga Berdasarkan Interval Skor PMT
            </h4>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pmtScoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#scoreColor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie: Distribution by Eligibility Status */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">BOBOT KELAYAKAN</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Hasil Klasifikasi: Rasio Kelayakan Bantuan Sosial
            </h4>
          </div>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eligibilityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eligibilityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <RechartsLegend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Distribution by Village */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
          <div className="border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">SEBARAN SPASIAL</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Kepadatan Distribusi Sampel Rumah Tangga per Desa/Kelurahan
            </h4>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villageDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 8: VERIFICATION QUEUE & AUDIT TABLE */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">ALUR KERJA AUDIT</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Antrean Verifikasi Aktif (Daftar Penugasan Inspektur Lapangan)
            </h4>
          </div>
          <div>
            <select
              value={filterVerificationReason}
              onChange={(e) => setFilterVerificationReason(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-sm text-xs font-semibold focus:outline-none cursor-pointer focus:border-blue-500 dark:bg-slate-950"
            >
              <option value="All">Semua Alasan Verifikasi</option>
              <option value="Low model prediction confidence">Keyakinan Prediksi Rendah</option>
              <option value="Conflicting structural indicator metrics">Konflik Metrik Indikator Struktural</option>
              <option value="Missing civil registry parameters">Parameter Catatan Sipil Hilang</option>
              <option value="Recent shock / socioeconomic status changes">Perubahan Status Sosial Ekonomi Terkini</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'id', header: 'ID Rumah Tangga', sortable: true },
            { 
              key: 'headOfHousehold', 
              header: 'Kepala Keluarga', 
              render: (row: any) => isPiiRevealed ? row.headOfHousehold : maskName(row.headOfHousehold)
            },
            { key: 'village', header: 'Desa/Kelurahan', sortable: true },
            { key: 'pmtScore', header: 'Skor PMT', render: (row: any) => row.pmtScore.toFixed(2).replace('.', ',') },
            { 
              key: 'predictionConfidence', 
              header: 'Keyakinan', 
              render: (row: any) => `${Math.round(row.predictionConfidence * 100)}%` 
            },
            { key: 'reason', header: 'Alasan Ditandai' },
            { 
              key: 'status', 
              header: 'Status Tindakan', 
              render: (row: any) => (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                  row.status === 'Discrepancy' 
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                }`}>
                  {translateStatus(row.status)}
                </span>
              )
            }
          ]}
          data={verificationQueueData}
          pageSize={5}
          onRowClick={handleRowClick}
        />
      </div>

      {/* SECTION 9: INTERVENTION RECOMMENDATIONS MODULE */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs space-y-4">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">REKOMENDASI INTERVENSI</span>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
            Saran Program Pemerintah & Urutan Anggaran
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredHouseholds.slice(0, 3).map((h) => (
            <div key={h.id} className="p-4 border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 rounded-sm flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-mono text-slate-400">{h.id}</span>
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                    h.priorityLevel === 'Critical' 
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                  }`}>
                    {translatePriority(h.priorityLevel)}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">{h.intervention.program}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{h.intervention.reason}</p>
                <div className="text-[11px] font-medium space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-900">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Urutan:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{h.intervention.sequence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Instansi Penanggung Jawab:</span>
                    <span className="text-slate-700 dark:text-slate-300">{h.intervention.institution}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[10px]">
                <div>
                  <span className="text-slate-400 font-mono block uppercase text-[8px]">Est. Manfaat</span>
                  <strong className="font-bold text-slate-800 dark:text-slate-200 font-mono">{formatRupiah(h.intervention.benefitValue)} / thn</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-mono block uppercase text-[8px]">Kepastian</span>
                  <strong className="text-emerald-500 font-bold font-mono">{Math.round(h.intervention.confidence * 100)}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 10: TARGETING QUALITY (CONFUSION MATRIX & METRICS) */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
        <div className="border-b border-slate-100 dark:border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">VALIDASI ALGORITMA</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-0.5">
              Confusion Matrix Model XGBoost & Audit Penyelarasan Target
            </h4>
          </div>
          <Activity className="h-4 w-4 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Confusion Matrix Visual */}
          <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900 p-4 rounded-xs text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono text-center mb-3">Daftar Confusion Matrix yang Diaudit</span>
            <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[10px]">
              <div></div>
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-600 rounded-sm">MISKIN AKTUAL</div>
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-600 rounded-sm">TIDAK MISKIN AKTUAL</div>

              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-600 flex items-center justify-center rounded-sm">PREDIKSI MISKIN</div>
              <div className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 p-3 rounded-xs flex flex-col justify-center">
                <span>Positif Benar (TP)</span>
                <span className="text-lg mt-1">94.2%</span>
              </div>
              <div className="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 p-3 rounded-xs flex flex-col justify-center">
                <span>Positif Salah (FP)</span>
                <span className="text-sm mt-1">3.4%</span>
                <span className="text-[8px] text-rose-500 font-medium leading-none mt-1">Kebocoran Inklusi</span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-600 flex items-center justify-center rounded-sm">PREDIKSI TIDAK MISKIN</div>
              <div className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 p-3 rounded-xs flex flex-col justify-center">
                <span>Negatif Salah (FN)</span>
                <span className="text-sm mt-1">2.8%</span>
                <span className="text-[8px] text-amber-500 font-medium leading-none mt-1">Kesenjangan Eksklusi</span>
              </div>
              <div className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-3 rounded-xs flex flex-col justify-center">
                <span>Negatif Benar (TN)</span>
                <span className="text-lg mt-1">93.8%</span>
              </div>
            </div>
          </div>

          {/* Core Analytics parameters list */}
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">Precision</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">96.5%</span>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">Recall</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">97.1%</span>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">F1 Score</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">96.8%</span>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">Accuracy</span>
                <span className="text-lg font-bold font-mono text-emerald-500">96.8%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Interpretasi Teknis:</strong> Presisi mengukur bahwa ketika sistem kami menargetkan suatu rumah tangga, terdapat kepastian 96,5% bahwa mereka benar-benar miskin. Recall menunjukkan bahwa kita berhasil mencakup 97,1% dari populasi rentan yang sebenarnya, menjaga tingkat kebocoran inklusi berada jauh di bawah mandat provinsi sebesar 4%.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: HOUSEHOLD DETAIL SIDE DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`INSPEKTUR DOSIER AMAN: ${selectedHousehold.id}`}
        width="lg"
      >
        <div className="space-y-6 text-xs leading-relaxed">
          {/* PDP Secure Identity Header */}
          <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 rounded-sm space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold font-mono">
              <ShieldAlert className="h-3.5 w-3.5 text-blue-500" />
              <span>Catatan Verifikasi Identitas</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-[11px]">
              <div>
                <span className="text-slate-400">Kepala Keluarga:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold block mt-0.5">
                  {isPiiRevealed ? selectedHousehold.headOfHousehold : maskName(selectedHousehold.headOfHousehold)}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Hash NIK Nasional:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-mono block mt-0.5">
                  {isPiiRevealed ? selectedHousehold.nik : maskNIK(selectedHousehold.nik)}
                </strong>
              </div>
            </div>
          </div>

          {/* Model PMT predictions KPIs */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-sm">
              <span className="text-[9px] text-slate-400 uppercase block font-semibold">Skor PMT</span>
              <span className="text-md font-bold font-mono text-slate-800 dark:text-slate-100">{selectedHousehold.pmtScore.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="p-2 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-sm">
              <span className="text-[9px] text-slate-400 uppercase block font-semibold">Desil Kesejahteraan</span>
              <span className="text-md font-bold font-mono text-slate-800 dark:text-slate-100">{selectedHousehold.decile}</span>
            </div>
            <div className="p-2 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-sm">
              <span className="text-[9px] text-slate-400 uppercase block font-semibold">Probabilitas</span>
              <span className="text-md font-bold font-mono text-rose-500">{Math.round(selectedHousehold.probabilityOfPoverty * 100)}%</span>
            </div>
          </div>

          {/* SECTION 6: PREDICTION EXPLANATION (SHAP VALUES VIZ) */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-900">
              <Brain className="h-4 w-4 text-blue-500" />
              <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Kontribusi Atribut SHAP Klasifikator PMT
              </h5>
            </div>
            <p className="text-[10px] text-slate-400">
              Metrik bobot fitur relatif yang menjelaskan mengapa algoritma mengarahkan rumah tangga ini ke Desil Kesejahteraan {selectedHousehold.decile}.
            </p>
            <div className="space-y-2 pt-1">
              {selectedHousehold.factors.map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>{f.factor === 'Housing condition weight' ? 'Kualitas Kondisi Hunian' : f.factor === 'Education index' ? 'Indeks Pendidikan KK' : f.factor === 'Water access standard' ? 'Akses Air Bersih Layak' : f.factor === 'Employment stability index' ? 'Stabilitas Pekerjaan KK' : f.factor}</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">+{f.weight} poin SHAP</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(f.weight / 50) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Household Characteristics */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-900">
              <Layers className="h-4 w-4 text-slate-500" />
              <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Dosier Karakteristik Sosial Ekonomi
              </h5>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50">
                <span className="text-slate-400">Jumlah Anggota Keluarga:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.size} Orang</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50">
                <span className="text-slate-400">Tanggungan:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.dependents} Anak Tanggungan</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Kualitas Dinding Rumah:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.housingQuality}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Kualitas Lantai:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.floorQuality}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Tingkat Pendidikan KK:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.education}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Pekerjaan Utama KK:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.employment}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Kepemilikan Aset Terdaftar:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.assets}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Kapasitas Listrik PLN:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.utilities}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Akses Air Bersih:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.waterAccess}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Jaminan Kesehatan Nasional:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedHousehold.characteristics.healthAccess}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900/50 col-span-2">
                <span className="text-slate-400">Bantuan Sosial Aktif:</span>
                <strong className="text-rose-600 dark:text-rose-400 font-bold">{selectedHousehold.characteristics.currentAssistance}</strong>
              </div>
            </div>
          </div>

          {/* Suggested Intervention Box */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-900">
              <Award className="h-4 w-4 text-emerald-500" />
              <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Formulasi Intervensi yang Disarankan
              </h5>
            </div>
            <div className="p-3.5 border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 rounded-sm space-y-2.5">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Saran Program Kebijakan</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{selectedHousehold.intervention.program}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Estimasi Manfaat</span>
                  <span className="text-xs font-bold font-mono text-emerald-500">{formatRupiah(selectedHousehold.intervention.benefitValue)} / thn</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 leading-relaxed pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                <strong>Rasional Algoritma:</strong> {selectedHousehold.intervention.reason}
              </div>
              <div className="text-[10px] font-mono text-slate-400 pt-1 flex justify-between">
                <span>Urutan: <strong>{selectedHousehold.intervention.sequence}</strong></span>
                <span>Penanggung Jawab: <strong>{selectedHousehold.intervention.institution}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
