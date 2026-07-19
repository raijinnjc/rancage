import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// ============================================================
// Contextual data for prompt grounding (West Java poverty data)
// ============================================================
const CONTEXT_DATA: Record<string, Record<string, { stats: string; districts: string }>> = {
  '2026': {
    disparity: {
      stats: 'Within-district Theil index contribution: 89.4%. Provincial Gini: 0.405. P0 (headcount): 7.62%. P1 (depth): 1.24. P2 (severity): 0.31.',
      districts: 'Highest internal Gini: Kota Bandung (0.42), Kabupaten Bogor (0.39), Kabupaten Bekasi (0.38). Lowest: Kota Banjar (0.28).',
    },
    spatial: {
      stats: 'Southern belt P0 avg: 12.8%. Northern industrial corridor P0 avg: 5.1%. Coastal zone unemployment: 8.7%.',
      districts: 'Hotspot clusters: Kabupaten Kuningan (P0: 13.1%), Indramayu (12.9%), Tasikmalaya (14.2%), Garut (11.8%). Cold spots: Kota Depok (2.1%), Kota Bekasi (3.4%).',
    },
    targeting: {
      stats: 'PMT inclusion accuracy: 91.3%. Exclusion error: 8.7%. Inclusion error: 14.2%. DTKS coverage: 87.6%. Gradient Boosting model accuracy: 92%.',
      districts: 'High exclusion error: Sukabumi (11.8%), Cianjur (10.2%). High inclusion error: Kota Bandung (16.4%), Kota Bekasi (15.1%).',
    },
  },
  '2025': {
    disparity: {
      stats: 'Within-district Theil index contribution: 88.2%. Provincial Gini: 0.411. P0: 7.89%. P1: 1.31. P2: 0.34.',
      districts: 'Industrial-agricultural border zones showing highest disparity gaps. Bekasi-Karawang corridor Gini: 0.41.',
    },
    spatial: {
      stats: 'Cirebon Raya cluster P0 avg: 11.9%. Coastal fishing asset depreciation: -7.2% YoY.',
      districts: 'Severe clusters: Indramayu (P0: 12.4%), Cirebon (11.2%). Seasonal agricultural deficit zones in Subang, Majalengka.',
    },
    targeting: {
      stats: 'PMT inclusion accuracy: 90.8%. D4+ blocking rate: 94.2%. DTKS sync rate: 84.1%.',
      districts: 'Model successfully blocking Decile 4+ access. Remaining leakage in urban informal sectors.',
    },
  },
  '2024': {
    disparity: {
      stats: 'Within-district Theil index contribution: 87.1%. Provincial Gini: 0.418. P0: 8.14%. P1: 1.38. P2: 0.37.',
      districts: 'Post-macroeconomic transition amplified disparities in Bekasi and Depok industrial cities.',
    },
    spatial: {
      stats: 'Prolonged dry season impact on harvest incomes. Agricultural GDP drop: -3.8% in southern districts.',
      districts: 'Highest severity: Kabupaten Tasikmalaya (P0: 15.1%), Garut (13.4%). Dry season water stress index: 0.78.',
    },
    targeting: {
      stats: 'PMT accuracy: 89.4%. Inclusion errors from manual paper registries. Digital migration: 62% complete.',
      districts: 'Legacy paper roster districts: Ciamis, Pangandaran, Sumedang. Full digital: Kota Bandung, Kota Cimahi.',
    },
  },
};

// Fallback data when API is unavailable
const FALLBACK_DATA: Record<string, Record<string, { narrative: string; focus: string; actionableStep: string }>> = {
  '2026': {
    disparity: {
      narrative: 'Ketimpangan dalam kelompok (Within-district) menyumbang 89,4% dari total disparitas provinsi. Hal ini menunjukkan bahwa ketimpangan semakin didorong oleh disparitas di dalam kabupaten/kota alih-alih antar wilayah. Zonasi administratif yang luas tidak lagi memadai.',
      focus: 'Penargetan tingkat rumah tangga & aset mikro dasar (sanitasi, jaringan air).',
      actionableStep: 'Realokasi 14,5% dari dana dukungan umum kabupaten seluruh wilayah langsung ke injeksi air bersih tingkat rumah tangga untuk desil D1-D2 di Priangan Timur.',
    },
    spatial: {
      narrative: 'Klaster koordinat GIS menunjukkan tingkat kemiskinan parah terkonsentrasi sangat padat di sabuk pertanian selatan. Kabupaten Kuningan dan Indramayu menunjukkan kantong-kantong persisten dengan rasio headcount melebihi 12,5%.',
      focus: 'Infrastruktur prioritas & hub logistik pertanian.',
      actionableStep: 'Luncurkan proyek jalur pipa sanitasi pedesaan di daerah ekstrem selatan Sukabumi dan Tasikmalaya dengan alokasi anggaran khusus pada revisi fiskal Q3.',
    },
    targeting: {
      narrative: 'Akurasi inklusi (Inclusion accuracy) telah mencapai 91,3% menggunakan kalibrasi Gradient Boosting. Namun, tingkat eksklusi (exclusion rate) tetap berada di 8,7% untuk pemukiman pedesaan terisolasi akibat indeks catatan sipil yang usang.',
      focus: 'Sinkronisasi catatan sipil aktif & regu PMT bergerak.',
      actionableStep: 'Kerahkan armada catatan sipil Bappeda untuk memutakhirkan daftar DTKS secara fisik di kabupaten Kategori IV, menargetkan 24.000 rumah tangga.',
    },
  },
  '2025': {
    disparity: {
      narrative: 'Ketimpangan dalam kelompok (Within-district) berada pada 88,2% di tahun 2025. Disparitas terkonsentrasi sangat padat di zona perbatasan industri-pertanian. Manfaat pertumbuhan terpusat secara lokal, menciptakan kesenjangan lebar dalam satu zona administratif.',
      focus: 'Transfer aset dan penyelarasan pelatihan keterampilan kabupaten.',
      actionableStep: 'Perluas subsidi pelatihan vokasi Padat Karya lokal di seluruh kabupaten dengan rasio Gini tinggi untuk menyerap buruh tani lokal.',
    },
    spatial: {
      narrative: 'Tolok ukur historis GIS 2025 memverifikasi klaster padat di Cirebon Raya, didorong oleh depresiasi aset perikanan pesisir dan defisit pekerjaan pertanian musiman.',
      focus: 'Kredit mikro pesisir & infrastruktur rantai dingin (cold chain).',
      actionableStep: 'Setujui hibah darurat peralatan perikanan khusus untuk koperasi nelayan di Indramayu dan Cirebon.',
    },
    targeting: {
      narrative: 'Akurasi penargetan rata-rata mencapai 90,8% di 2025. Batas PMT Machine Learning berhasil memblokir akses ke rumah tangga di desil kesejahteraan D4 ke atas.',
      focus: 'Penerapan ketat dari batas penargetan PMT.',
      actionableStep: 'Publikasikan metrik penargetan yang diaudit ke dewan pengawas provinsi untuk mengamankan aliran pendanaan lanjutan.',
    },
  },
  '2024': {
    disparity: {
      narrative: 'Kontribusi ketimpangan dalam kelompok (Within-district) terukur pada 87,1% selama survei 2024. Siklus transisi pasca-makroekonomi telah memperkuat disparitas mikroekonomi di dalam kota-kota industri seperti Bekasi dan Depok.',
      focus: 'Integrasi jaring pengaman perkotaan & penyesuaian biaya hidup.',
      actionableStep: 'Terapkan subsidi harga komoditas pokok di kelurahan perkotaan berpenduduk padat yang menunjukkan rasio Gini internal tinggi.',
    },
    spatial: {
      narrative: 'Koordinat survei 2024 mengindikasikan klaster dengan tingkat keparahan tertinggi berada di Kabupaten Tasikmalaya dan Garut akibat musim kemarau berkepanjangan yang mengganggu pendapatan panen.',
      focus: 'Irigasi tahan iklim dan asuransi sosial.',
      actionableStep: 'Bangun dana cadangan transportasi air musim kemarau untuk mencegah penurunan mendadak konsumsi rumah tangga di Priangan Timur.',
    },
    targeting: {
      narrative: 'Akurasi penargetan tercatat pada 89,4%. Inclusion error (kesalahan penyertaan) utamanya didorong oleh pendaftaran kertas manual sebelum transisi ke sistem digital yang terotomatisasi penuh.',
      focus: 'Digitalisasi data lama (legacy) dan pembersihan data.',
      actionableStep: 'Laksanakan migrasi digital lengkap dari daftar pedesaan BPS ke database SQL terpusat yang aman.',
    },
  },
};

const AXIS_LABELS: Record<string, string> = {
  disparity: 'Dekomposisi Disparitas Theil',
  spatial: 'Pemetaan Hotspot Spasial',
  targeting: 'Kinerja Penargetan Kesejahteraan',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { axis, year } = req.body || {};

  // Validate inputs
  if (!axis || !['disparity', 'spatial', 'targeting'].includes(axis)) {
    return res.status(400).json({ error: 'Invalid axis. Must be: disparity, spatial, or targeting.' });
  }
  const validYear = year && ['2024', '2025', '2026'].includes(year) ? year : '2026';

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return fallback data if no API key configured
    const fallback = FALLBACK_DATA[validYear]?.[axis] || FALLBACK_DATA['2026'][axis];
    return res.status(200).json({
      ...fallback,
      source: 'fallback',
      message: 'GEMINI_API_KEY not configured. Returning cached data.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const contextData = CONTEXT_DATA[validYear]?.[axis] || CONTEXT_DATA['2026'][axis];
    const axisLabel = AXIS_LABELS[axis];

    const prompt = `Anda adalah AI RANCAGE, seorang analis kebijakan Sistem Pendukung Keputusan pemerintah untuk Provinsi Jawa Barat, Indonesia. Anda ahli dalam penanggulangan kemiskinan dan analisis kebijakan berbasis bukti.

KONTEKS ANALISIS:
- Jenis Analisis: ${axisLabel}
- Tahun Evaluasi: ${validYear}
- Statistik Utama: ${contextData.stats}
- Data Kabupaten/Kota: ${contextData.districts}

TUGAS:
Hasilkan respons analisis kebijakan dalam Bahasa Indonesia dengan tepat 3 bidang (fields). Buatlah spesifik, berbasis data, dan dapat ditindaklanjuti. Rujuk nama kabupaten dan statistik yang relevan.

Tanggapi HANYA dengan objek JSON yang valid (tanpa markdown, tanpa blok kode) dengan kunci-kunci persis berikut:
{
  "narrative": "Sebuah narasi analitik 2-3 kalimat yang merangkum temuan utama. Sertakan persentase spesifik dan nama kabupaten/kota. Padat namun mendalam.",
  "focus": "Kalimat tunggal yang mengidentifikasi area fokus strategis untuk intervensi kebijakan.",
  "actionableStep": "Sebuah arahan kebijakan spesifik dan konkret yang dapat segera disahkan oleh gubernur provinsi. Sertakan angka target, nama kabupaten, dan implikasi fiskal."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || '';

    // Parse JSON from Gemini response (handle potential markdown wrapping)
    let cleaned = text;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleaned);

    // Validate required fields exist
    if (!parsed.narrative || !parsed.focus || !parsed.actionableStep) {
      throw new Error('Incomplete response from Gemini');
    }

    return res.status(200).json({
      narrative: parsed.narrative,
      focus: parsed.focus,
      actionableStep: parsed.actionableStep,
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('[RANCAGE AI] Gemini API error:', error?.message || error);

    // Fallback to hardcoded data on any error
    const fallback = FALLBACK_DATA[validYear]?.[axis] || FALLBACK_DATA['2026'][axis];
    return res.status(200).json({
      ...fallback,
      source: 'fallback',
      message: `AI generation failed: ${error?.message || 'Unknown error'}. Returning cached data.`,
    });
  }
}
