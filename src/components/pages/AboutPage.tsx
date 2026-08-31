import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  Scale, 
  Users, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Compass,
  Cpu,
  Lock
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { KujangLogo } from '../ui/KujangLogo.tsx';
import { MegaMendungPattern } from '../ui/MegaMendungPattern.tsx';
import { SYSTEM_META } from '../../constants/index.ts';

export function AboutPage() {
  const { navigateTo } = useNavigationStore();

  const institutionalPartners = [
    {
      name: 'Bappeda Provinsi Jawa Barat',
      role: 'Koordinator Perencanaan & Alokasi Fiskal',
      desc: 'Memimpin integrasi kebijakan makro, penetapan kuadran tipologi daerah, dan simulasi penganggaran APBD berbasis efektivitas biaya.',
      badge: 'LEMBAGA PENGELOLA UTAMA'
    },
    {
      name: 'Dinas Sosial Provinsi Jawa Barat',
      role: 'Pelaksana Operasional Penargetan BNBA',
      desc: 'Mengelola daftar penerima manfaat keluarga (Desil 1-4), penugasan verifikator lapangan, dan mitigasi risiko kesalahan eksklusi bansos.',
      badge: 'PELAKSANA BANTUAN SOSIAL'
    },
    {
      name: 'Disdukcapil Jawa Barat',
      role: 'Validasi Identitas & Administrasi Kependudukan',
      desc: 'Menjamin keabsahan Nomor Induk Kependudukan (NIK) terenkripsi dan sinkronisasi berkala data catatan sipil terpadu.',
      badge: 'OTORITAS DATA KEPENDUDUKAN'
    },
    {
      name: 'Badan Pusat Statistik (BPS) Jawa Barat',
      role: 'Penyedia Data Survei Sosial Ekonomi Makro',
      desc: 'Penyedia rujukan data dasar Susenas dan agregat kemiskinan makro (P0, P1, P2, Rasio Gini, dan Indeks Theil) yang diaudit berkala.',
      badge: 'MITRA DATA RESMI'
    }
  ];

  const legalFrameworks = [
    {
      law: 'UU No. 27 Tahun 2022',
      title: 'Pelindungan Data Pribadi (UU PDP)',
      desc: 'Mewajibkan pemisahan tegas antara data agregat terbuka untuk publik dengan data mikro By-Name-By-Address (BNBA) yang wajib dienkripsi dan diaudit.'
    },
    {
      law: 'Perpres No. 39 Tahun 2019',
      title: 'Satu Data Indonesia (SDI)',
      desc: 'Menetapkan standar interoperabilitas data antar-instansi pemerintah melalui API terstandarisasi, metadata baku, dan kode referensi tunggal.'
    },
    {
      law: 'Perpres No. 95 Tahun 2018',
      title: 'Sistem Pemerintahan Berbasis Elektronik (SPBE)',
      desc: 'Mengamanatkan keterpaduan tata kelola teknologi informasi pemerintah daerah guna mewujudkan layanan publik yang efektif, efisien, dan akuntabel.'
    },
    {
      law: 'Pergub Jabar No. 67 Tahun 2022',
      title: 'Penyelenggaraan Satu Data Jawa Barat',
      desc: 'Landasan operasional pembagian peran produsen data daerah, wali data (Diskominfo), dan pembina data (BPS/Bappeda) di tingkat provinsi.'
    }
  ];

  return (
    <div className="space-y-12 pb-20 page-transition stagger-children max-w-6xl mx-auto">
      {/* 1. HERO HEADER */}
      <section className="relative rounded-sm bg-gradient-to-br from-slate-900 via-[#0F2D5C] to-slate-950 text-white p-8 md:p-12 border border-slate-800 shadow-xs overflow-hidden">
        <MegaMendungPattern className="opacity-5 text-blue-200" />
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-blue-600/30 border border-kujang-gold/40 flex items-center justify-center text-kujang-gold">
              <KujangLogo size={24} className="text-[#C5962A]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest block">
                PROFIL RESMI PLATFORM PEMERINTAH
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Pemerintah Provinsi Jawa Barat
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Tentang RANCAGE DSS
            </h1>
            <p className="text-sm md:text-base text-blue-100 font-normal leading-relaxed">
              <strong>Ruang Analisis Navigasi Celah Agregat dan Gini Empiris (RANCAGE)</strong> adalah Sistem Pendukung Keputusan (*Decision Support System*) berbasis bukti empiris yang dikembangkan untuk menjawab anomali pembangunan dan mempertajam presisi penanggulangan kemiskinan di Jawa Barat.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-sm px-4 py-2 font-mono text-xs text-slate-300">
              Versi: <strong className="text-white">{SYSTEM_META.version}</strong>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-sm px-4 py-2 font-mono text-xs text-slate-300">
              Kepatuhan: <strong className="text-emerald-400">{SYSTEM_META.compliance}</strong>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-sm px-4 py-2 font-mono text-xs text-slate-300">
              Status: <strong className="text-blue-400">DSS Produksi Terverifikasi</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LATAR BELAKANG & VISI UTAMA */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-bold font-mono uppercase">
              <Compass className="h-3.5 w-3.5" />
              Latar Belakang & Urgensi
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Menjawab Paradoks Kedalaman Kemiskinan di Jawa Barat
            </h2>
            <div className="space-y-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Dalam beberapa tahun terakhir, Jawa Barat mencatat tren penurunan persentase kemiskinan makro (*P0* hingga 7,02% pada Maret 2025). Namun, penurunan ini diiringi anomali struktural: <strong>Indeks Kedalaman Kemiskinan (P1) meningkat ke 1,21</strong> dan <strong>Rasio Gini bertahan tinggi di 0,416</strong>.
              </p>
              <p>
                Dekomposisi Indeks Theil membuktikan bahwa <strong>89,44% varians ketimpangan di Jawa Barat bersumber dari dalam batas kabupaten/kota itu sendiri (*Theil Within-Region*)</strong>, bukan kesenjangan antarkabupaten. Kondisi ini menuntut pergeseran paradigma dari kebijakan bantuan sosial yang pukul rata menjadi intervensi presisi berbasis tipologi kuadran dan karakteristik multidimensi keluarga.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-900 grid grid-cols-2 gap-4 text-center font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-sm border border-slate-100 dark:border-slate-800">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block">89,44%</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Ketimpangan Intra-Wilayah</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-sm border border-slate-100 dark:border-slate-800">
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block">4 Kuadran</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Tipologi Intervensi Terarah</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 rounded-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono uppercase">
            <Scale className="h-3.5 w-3.5" />
            Prinsip Positioning
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Bukan Pengganti, Melainkan Lapisan Pelengkap
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            RANCAGE <strong>tidak menggantikan</strong> basis data nasional seperti P3KE (Pensasaran Percepatan Penghapusan Kemiskinan Ekstrem) atau DTKS Kemensos. RANCAGE berfungsi sebagai <strong>Complementary Intelligence Layer</strong>:
          </p>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Membuka Gerbang Makro Publik:</strong> Menyajikan agregat anonim untuk transparansi publik tanpa melanggar privasi data pribadi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Jembatan Makro-Mikro:</strong> Menghubungkan tipologi kuadran wilayah langsung ke daftar sasaran penerima manfaat tingkat rumah tangga.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Simulasi Efisiensi APBD:</strong> Menguji kesesuaian program bantuan sebelum anggaran disalurkan guna menekan pemborosan fiskal.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. ARSITEKTUR TIGA LAPIS SISTEM */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Arsitektur Tiga Lapis RANCAGE DSS
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Sistem dirancang modular dari pengolahan data mentah hingga simulasi eksekusi kebijakan di lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-sm bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Lapisan Data Terintegrasi (*Data Layer*)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mengonsolidasikan data survei Susenas BPS, registrasi Regsosek, dan DTKS melalui pipeline data terenkripsi dan tervalidasi.
            </p>
          </div>

          <div className="p-6 rounded-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-sm bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Lapisan Intelijen Analitis (*Intelligence Layer*)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Memproses dekomposisi Theil, pengelompokan Kuadran Tipologi I-IV, serta estimasi skor kesejahteraan menggunakan model Machine Learning *Gradient Boosting (XGBoost)*.
            </p>
          </div>

          <div className="p-6 rounded-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-sm bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Lapisan Eksekusi Kebijakan (*Policy Layer*)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Menyediakan simulator dampak statis, sistem peringatan dini (EWS), serta ranking efektivitas biaya untuk membantu penentuan prioritas intervensi APBD.
            </p>
          </div>
        </div>
      </section>

      {/* 4. EKOSISTEM KELEMBAGAAN KOLABORATIF */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ekosistem Kelembagaan Kolaboratif
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            RANCAGE mengintegrasikan peran strategis lintas perangkat daerah di lingkungan Pemerintah Provinsi Jawa Barat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {institutionalPartners.map((partner, idx) => (
            <div key={idx} className="p-6 rounded-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-xs uppercase">
                  {partner.badge}
                </span>
                <Building2 className="h-4 w-4 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{partner.name}</h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{partner.role}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-900">
                {partner.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LANDASAN HUKUM & REGULASI */}
      <section className="p-6 sm:p-8 rounded-sm bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Landasan Hukum & Kepatuhan Regulasi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengembangan dan pengoperasian RANCAGE sepenuhnya taat pada kerangka hukum tata kelola data dan pelindungan privasi nasional.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legalFrameworks.map((law, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-950 rounded-sm border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <strong className="font-bold text-blue-700 dark:text-blue-400 font-mono text-[11px]">{law.law}</strong>
                <Lock className="h-3 w-3 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">{law.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">{law.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="text-center py-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Siap Mengeksplorasi Data Kemiskinan & Ketimpangan Jawa Barat?
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigateTo('exploration')}
            className="px-6 py-2.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <span>Buka Eksplorasi Wilayah</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateTo('methodology')}
            className="px-6 py-2.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Pelajari Metodologi</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
