import { ChevronRight, Home } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { ScreenId } from '../../types/navigation.ts';

export function Breadcrumb() {
  const { currentScreen, navigateTo } = useNavigationStore();

  if (currentScreen === 'landing') return null;

  const getScreenLabel = (id: ScreenId) => {
    switch (id) {
      case 'landing':
        return 'Beranda';
      case 'exploration':
        return 'Eksplorasi Wilayah';
      case 'methodology':
        return 'Metodologi Sistem';
      case 'dashboard':
        return 'Dasbor Instansi Eksekutif';
      case 'diagnosis':
        return 'Diagnosis Wilayah (Theil/P0)';
      case 'typology':
        return 'Peta Tipologi Wilayah';
      case 'regional-profile':
        return 'Profil Wilayah Kabupaten/Kota';
      case 'household':
        return 'Skor Kesejahteraan Rumah Tangga';
      case 'ml-evaluation':
        return 'Evaluasi Model PMT-ML';
      case 'recommendation':
        return 'Simulasi Skenario Kebijakan';
      case 'monitoring':
        return 'Pemantauan Kebijakan & Trajektori';
      case 'settings':
        return 'Pengaturan & Audit Sistem';
      case 'login':
        return 'Masuk Akses Aman Pemerintah';
      default:
        return id;
    }
  };

  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
      <button
        onClick={() => navigateTo('landing')}
        className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <Home className="h-3 w-3" />
        <span>RANCAGE</span>
      </button>

      <ChevronRight className="h-2.5 w-2.5" />

      <span className="font-semibold text-slate-700 dark:text-slate-300">
        {getScreenLabel(currentScreen)}
      </span>
    </nav>
  );
}
