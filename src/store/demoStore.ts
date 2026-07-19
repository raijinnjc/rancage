import { create } from 'zustand';

export interface TourStep {
  screenId: string;
  title: string;
  description: string;
  highlight: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    screenId: 'dashboard',
    title: '1. Dasbor Eksekutif',
    description: 'Pintu masuk utama eksekutif yang menampilkan metrik-metrik penting tingkat provinsi, target indeks penanggulangan kemiskinan yang aktif, dan distribusi geografis.',
    highlight: 'Perhatikan bilah filter terpadu di bagian atas yang disinkronkan di semua halaman, dan peta interaktif dengan kontras tinggi.',
  },
  {
    screenId: 'diagnosis',
    title: '2. Diagnosa Wilayah',
    description: 'Modul diagnosis komparatif mendalam yang menampilkan bagan korelasi tingkat indikator (Indeks Gini vs Kemiskinan) dan pemodelan regresi.',
    highlight: 'Memungkinkan pejabat perencana untuk menjalankan analisis regresi bivariat dan mengekspor dataset kustom.',
  },
  {
    screenId: 'typology',
    title: '3. Tipologi Wilayah',
    description: 'Visualisasi dinamis kuadran Tipologi Klassen. Mengelompokkan kabupaten/kota secara instan ke dalam kategori pertumbuhan dan karakteristik pembangunan.',
    highlight: 'Identifikasi wilayah dengan pertumbuhan tinggi vs stagnan untuk menyesuaikan alokasi anggaran fiskal.',
  },
  {
    screenId: 'regional-profile',
    title: '4. Profil Wilayah',
    description: 'Tampilan bento-grid komprehensif yang menyajikan komposisi demografis, diagram radar deprivasi, dan linimasa historis dari kabupaten/kota terpilih.',
    highlight: 'Pilih suatu kabupaten/kota untuk melihat rincian mendalam seperti pengangguran, pendapatan regional, dan indikator multi-dimensi.',
  },
  {
    screenId: 'household',
    title: '5. Penargetan Rumah Tangga',
    description: 'Menerjemahkan data makro wilayah menjadi sasaran mikro rumah tangga, memfilter keluarga berdasarkan desil kesejahteraan (Desil 1-4).',
    highlight: 'Memungkinkan petugas lapangan Dinas Sosial untuk mencari, memfilter berdasarkan akses air bersih/listrik, dan memverifikasi profil keluarga.',
  },
  {
    screenId: 'ml-evaluation',
    title: '6. Evaluasi Model Machine Learning',
    description: 'Menjamin transparansi algoritmik. Menampilkan metrik performa model AI, matriks konfusi (confusion matrix), dan nilai kepentingan fitur SHAP.',
    highlight: 'Mendemonstrasikan performa model yang kuat dengan akurasi 92%, didukung plot penjelasan model yang lengkap.',
  },
  {
    screenId: 'recommendation',
    title: '7. Rekomendasi Kebijakan',
    description: 'Mesin pembuat rekomendasi berbasis AI untuk menyusun draf kebijakan kustom, alokasi anggaran, dan usulan program.',
    highlight: 'Jalankan mesin generasi bertenaga Gemini untuk menyusun naskah kebijakan eksekutif yang terstruktur dan siap cetak.',
  },
  {
    screenId: 'monitoring',
    title: '8. Pusat Pemantauan',
    description: 'Ruang kendali untuk memantau pelaksanaan program aktif, tingkat penyerapan anggaran, dan analisis sentimen publik secara real-time.',
    highlight: 'Memantau tren aspirasi masyarakat menggunakan analisis sentimen NLP bersandingan dengan tingkat realisasi program instansi.',
  }
];

interface DemoState {
  isDemoActive: boolean;
  currentDemoStep: number;
  isPresentationMode: boolean;
  setDemoActive: (active: boolean) => void;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  setPresentationMode: (active: boolean) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoActive: false,
  currentDemoStep: 0,
  isPresentationMode: false,

  setDemoActive: (active: boolean) => set({ isDemoActive: active }),
  setDemoStep: (step: number) => set({ currentDemoStep: step }),

  nextDemoStep: () => set((state) => {
    const nextStep = Math.min(state.currentDemoStep + 1, TOUR_STEPS.length - 1);
    return { currentDemoStep: nextStep };
  }),

  prevDemoStep: () => set((state) => {
    const prevStep = Math.max(state.currentDemoStep - 1, 0);
    return { currentDemoStep: prevStep };
  }),

  setPresentationMode: (active: boolean) => set({ isPresentationMode: active }),
}));
