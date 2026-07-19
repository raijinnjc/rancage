import { NavigationItem, UserRole } from '../types/index.ts';

/**
 * System and Environment Metadata
 */
export const SYSTEM_META = {
  version: '2.1.0-RC3',
  releaseDate: '2026-Q3',
  compliance: 'Audit UU 27/2022 PDP Selesai',
  environment: 'Sistem Pendukung Keputusan (DSS) Produksi',
};

/**
 * Navigation Tree conforming to UI Routing specifications
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dasbor Eksekutif',
    icon: 'LayoutDashboard',
    minRole: 'PUBLIC',
    description: 'Rasio P0 Kabupaten terhadap Provinsi dan ringkasan agregat kemiskinan Jawa Barat.',
  },
  {
    id: 'diagnosis',
    label: 'Diagnosa Wilayah',
    icon: 'TrendingUp',
    minRole: 'PUBLIC',
    description: 'Dekomposisi Indeks Theil (T_Between vs T_Within) dan tren Indeks Gini riil.',
  },
  {
    id: 'typology',
    label: 'Tipologi Wilayah',
    icon: 'Grid',
    minRole: 'PUBLIC',
    description: 'Visualisasi Peta Kuadran Tipologi Wilayah untuk mitigasi stigmatisasi daerah.',
  },
  {
    id: 'regional-profile',
    label: 'Profil Wilayah',
    icon: 'MapPin',
    minRole: 'PUBLIC',
    description: 'Distribusi klasifikasi kesejahteraan (Miskin, Rentan Miskin, Mampu) dan tren pemulihan.',
  },
  {
    id: 'household',
    label: 'Penargetan Rumah Tangga',
    icon: 'Users',
    minRole: 'GOVERNMENT',
    description: 'BNBA Lengkap: Akses NIK, alamat KPM, dan pemilihan sampel rumah tangga untuk intervensi.',
  },
  {
    id: 'ml-evaluation',
    label: 'Evaluasi Model ML',
    icon: 'Brain',
    minRole: 'GOVERNMENT',
    description: 'Transparansi akurasi: Skor PMT-ML per KK dan simulasi estimasi Inclusion & Exclusion Error.',
  },
  {
    id: 'recommendation',
    label: 'Rekomendasi Kebijakan',
    icon: 'Briefcase',
    minRole: 'GOVERNMENT', // Changed to Gov to match the "Simulasi Dampak Statis sebelum anggaran disalurkan"
    description: 'Simulasi Dampak Statis: Pengujian skenario efektivitas biaya sebelum penyaluran anggaran.',
  },
  {
    id: 'monitoring',
    label: 'Pusat Pemantauan',
    icon: 'Activity',
    minRole: 'PUBLIC',
    description: 'Pelacakan target lintasan RPJMD dan peringatan dini program.',
  },
  {
    id: 'administration',
    label: 'Tata Kelola Data',
    icon: 'Shield',
    minRole: 'ADMIN',
    description: 'Kontrol akses pengguna, sinkronisasi database, dan analisis log audit.',
  },
];

/**
 * West Java administrative and statistical baselines (2026 Survey)
 */
export const WEST_JAVA_DISTRICTS = [
  { id: '3201', name: 'Kabupaten Bogor', p0: 7.12, population: 5420000, region: 'BOGOR' },
  { id: '3202', name: 'Kabupaten Sukabumi', p0: 9.42, population: 2610000, region: 'SUKABUMI' },
  { id: '3203', name: 'Kabupaten Cianjur', p0: 10.22, population: 2470000, region: 'SUKABUMI' },
  { id: '3204', name: 'Kabupaten Bandung', p0: 6.81, population: 3620000, region: 'PRIANGAN' },
  { id: '3205', name: 'Kabupaten Garut', p0: 11.45, population: 2580000, region: 'PRIANGAN' },
  { id: '3206', name: 'Kabupaten Tasikmalaya', p0: 12.11, population: 1860000, region: 'PRIANGAN' },
  { id: '3207', name: 'Kabupaten Ciamis', p0: 7.97, population: 1230000, region: 'PRIANGAN' },
  { id: '3208', name: 'Kabupaten Kuningan', p0: 12.82, population: 1120000, region: 'CIREBON' },
  { id: '3209', name: 'Kabupaten Cirebon', p0: 11.24, population: 2270000, region: 'CIREBON' },
  { id: '3210', name: 'Kabupaten Majalengka', p0: 11.94, population: 1210000, region: 'CIREBON' },
  { id: '3211', name: 'Kabupaten Sumedang', p0: 9.76, population: 1170000, region: 'PRIANGAN' },
  { id: '3212', name: 'Kabupaten Indramayu', p0: 12.77, population: 1750000, region: 'CIREBON' },
  { id: '3213', name: 'Kabupaten Subang', p0: 8.92, population: 1610000, region: 'PURWAKARTA' },
  { id: '3214', name: 'Kabupaten Purwakarta', p0: 7.21, population: 960000, region: 'PURWAKARTA' },
  { id: '3215', name: 'Kabupaten Karawang', p0: 7.83, population: 2420000, region: 'PURWAKARTA' },
  { id: '3216', name: 'Kabupaten Bekasi', p0: 5.11, population: 3120000, region: 'BOGOR' },
  { id: '3217', name: 'Kabupaten Bandung Barat', p0: 10.52, population: 1780000, region: 'PRIANGAN' },
  { id: '3218', name: 'Kabupaten Pangandaran', p0: 9.11, population: 410000, region: 'PRIANGAN' },
  { id: '3271', name: 'Kota Bogor', p0: 6.05, population: 1040000, region: 'BOGOR' },
  { id: '3272', name: 'Kota Sukabumi', p0: 7.32, population: 340000, region: 'SUKABUMI' },
  { id: '3273', name: 'Kota Bandung', p0: 3.96, population: 2450000, region: 'PRIANGAN' },
  { id: '3274', name: 'Kota Cirebon', p0: 8.71, population: 330000, region: 'CIREBON' },
  { id: '3275', name: 'Kota Bekasi', p0: 4.12, population: 2540000, region: 'BOGOR' },
  { id: '3276', name: 'Kota Depok', p0: 2.53, population: 2060000, region: 'BOGOR' },
  { id: '3277', name: 'Kota Cimahi', p0: 5.18, population: 570000, region: 'PRIANGAN' },
  { id: '3278', name: 'Kota Tasikmalaya', p0: 11.52, population: 730000, region: 'PRIANGAN' },
  { id: '3279', name: 'Kota Banjar', p0: 6.73, population: 180000, region: 'PRIANGAN' },
];

/**
 * Poverty metrics descriptors
 */
export const METRIC_DESCRIPTORS = {
  p0: {
    title: 'Rasio Headcount (P0)',
    description: 'Persentase penduduk dengan pengeluaran konsumsi per kapita bulanan di bawah garis kemiskinan.',
  },
  p1: {
    title: 'Indeks Kedalaman Kemiskinan (P1)',
    description: 'Ukuran rata-rata kesenjangan pengeluaran penduduk miskin terhadap garis kemiskinan.',
  },
  p2: {
    title: 'Indeks Keparahan Kemiskinan (P2)',
    description: 'Menggambarkan penyebaran pengeluaran di antara penduduk miskin (ketimpangan di antara penduduk miskin).',
  },
};
