# Product Requirements Document — Dashboard RANCAGE

**Rasionalisasi Analitik Kemiskinan dan Ketimpangan Jawa Barat — Sistem Diagnosis Makro-Mikro dan Penargetan Kebijakan Berbasis Data**

| | |
|---|---|
| Versi | 1.0 |
| Tanggal | 6 Agustus 2026 |
| Status | Draf untuk review |
| Wilayah cakupan | Provinsi Jawa Barat (pilot 2–3 kabupaten/kota sebelum scale-up provinsi) |

---

## 1. Ringkasan eksekutif

Dashboard RANCAGE adalah solusi teknologi yang menjadi Pilar 3 dari kerangka penelitian empat pilar untuk mengatasi paradoks kemiskinan di Jawa Barat: jumlah penduduk miskin menurun (7,02% pada Maret 2025), namun kedalaman kemiskinan justru meningkat (Poverty Gap Index naik dari 1,16% ke 1,21% pada 2023–2024), dan ketimpangan dalam wilayah (*within-region*) mendominasi dengan kontribusi 89,44% terhadap Indeks Theil total.

RANCAGE menyatukan hasil diagnosis makro (dekomposisi Indeks Theil dan rasio P0 antarwilayah) dan presisi mikro (*Proxy Means Testing* berbasis *machine learning* pada level rumah tangga) ke dalam satu dashboard dengan **dua jalur akses**: akses publik terbuka untuk data agregat, dan akses pemerintah berkredensial untuk data level kepala keluarga.

Dashboard ini **bukan pengganti P3KE/DTSEN**, melainkan lapisan pelengkap yang menjembatani level makro dan mikro serta membuka akses data agregat bagi publik.

---

## 2. Latar belakang dan masalah

### 2.1 Masalah inti

- Rasio gini Jawa Barat 0,416, peringkat ke-3 tertinggi secara nasional (BPS, 2025).
- Headcount Index (P0) menurun konsisten 2022–2025, tetapi Poverty Gap Index (P1) naik dari 1,16% (2023) menjadi 1,21% (2024) — penurunan jumlah penduduk miskin tidak diikuti perbaikan kondisi ekonomi kelompok yang masih miskin.
- Indeks Theil Total naik dari 0,269 menjadi 0,279 (2022–2025); kontribusi komponen *within* naik dari 86,56% menjadi 89,44%, menunjukkan sumber ketimpangan utama berasal dari dalam wilayah, bukan antarwilayah.
- Data kemiskinan terfragmentasi antar-lembaga (BPS, Kemensos, Kemenko PMK), menyulitkan penargetan yang presisi dan akuntabel.

### 2.2 Positioning terhadap P3KE/DTSEN

RANCAGE diposisikan sebagai kerangka pelengkap, bukan pengganti, atas Data Tunggal Sosial Ekonomi Nasional (DTSEN) yang telah mengintegrasikan P3KE sejak Inpres No. 4/2025. Tiga nilai tambah RANCAGE:

1. Menjembatani level makro (wilayah) dan mikro (rumah tangga) yang belum terhubung secara eksplisit dalam sistem penargetan yang ada.
2. Membuka akses data agregat bagi publik untuk mendukung akuntabilitas sosial dan riset independen.
3. Menjadi lapisan validasi tambahan atas estimasi *inclusion* dan *exclusion error* yang telah diakui keterbatasannya oleh sistem P3KE.

---

## 3. Tujuan produk

### 3.1 Tujuan bisnis/kebijakan

- Menyediakan basis diagnosis wilayah yang presisi untuk menetapkan prioritas intervensi kemiskinan di Jawa Barat.
- Meningkatkan akurasi penargetan program bantuan sosial melalui integrasi analisis makro-wilayah dan mikro-rumah tangga.
- Memperkuat akuntabilitas dan legitimasi kebijakan melalui transparansi data agregat kepada publik.

### 3.2 Tujuan pengguna

- Pengambil kebijakan (Bappeda/Dinas Sosial) dapat mengidentifikasi wilayah prioritas dan kelompok rumah tangga rentan secara cepat dan berbasis bukti.
- Akademisi dan masyarakat dapat mengakses data agregat untuk riset independen dan deteksi dini anomali data.

### 3.3 Non-tujuan (*out of scope*)

- RANCAGE tidak menggantikan atau mengubah proses penetapan sasaran resmi bantuan sosial yang berjalan melalui DTSEN/P3KE.
- Dashboard tidak menampilkan NIK atau data identitas personal di jalur akses publik.
- Simulasi kebijakan pada versi awal bersifat statis berbasis skenario *cross-section*, bukan proyeksi dinamis/panel.

---

## 4. Pengguna dan persona

| Persona | Kebutuhan utama | Jalur akses |
|---|---|---|
| Perencana Bappeda/Dinas Sosial | Identifikasi wilayah dan rumah tangga prioritas intervensi, dasar penyusunan anggaran | Pemerintah (kredensial resmi) |
| Analis BPS Jawa Barat | Validasi dan pemantauan tren ketimpangan antarwaktu | Pemerintah |
| Akademisi/peneliti | Data agregat untuk riset independen ketimpangan dan kemiskinan | Publik |
| Masyarakat umum/media | Transparansi dan literasi data kemiskinan wilayah | Publik |

---

## 5. Alur pengguna (*user flow*)

### 5.1 Alur data (*pipeline*)

1. Data multi-lembaga (BPS, Susenas, Regsosek, DTSEN) dikumpulkan dan diharmonisasi.
2. **Pilar 1 — Diagnosis makro**: dekomposisi Indeks Theil (*within*/*between*) dan rasio P0 kabupaten/kota terhadap provinsi, dipetakan ke matriks tipologi wilayah 2×2.
3. **Pilar 2 — Presisi mikro**: model Gradient Boosting dilatih dengan label konsumsi Susenas (*ground truth*) dan variabel proksi Regsosek, menghasilkan skor kesejahteraan per kepala keluarga (Desil 1–4 miskin, 5–7 menengah rentan, 8–10 sejahtera).
4. **Pilar 3 — Dashboard RANCAGE**: hasil kedua pilar disajikan melalui dua jalur akses berbeda.
5. **Pilar 4 — Kebijakan dan monitoring**: hasil dashboard menjadi dasar rekomendasi kebijakan, diimplementasikan melalui pilot project, dan dipantau berkelanjutan dengan pembaruan model mengikuti siklus Susenas/Regsosek.

### 5.2 Alur akses pengguna

**Jalur publik:** pengguna membuka dashboard tanpa login → memilih wilayah pada peta/tabel → melihat hasil dekomposisi Theil, rasio P0, tipologi wilayah, dan tren antarwaktu dalam bentuk agregat → dapat mengunduh data agregat untuk riset.

**Jalur pemerintah:** pengguna login dengan kredensial instansi resmi → sistem memverifikasi otorisasi → pengguna mengakses data level kepala keluarga, termasuk skor kesejahteraan hasil pemodelan dan estimasi *inclusion*/*exclusion error* per wilayah → pengguna dapat menjalankan simulasi skenario kebijakan dan mengekspor rekomendasi prioritas.

---

## 6. Ruang lingkup fitur

### 6.1 Modul akses publik

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Peta tipologi wilayah | Visualisasi matriks 2×2 (kemiskinan tinggi/rendah × ketimpangan tinggi/rendah) per kabupaten/kota | Must have |
| Dekomposisi Theil | Grafik tren kontribusi komponen *within* vs *between* per tahun dan wilayah | Must have |
| Rasio P0 wilayah | Perbandingan rasio P0 kabupaten/kota terhadap rata-rata provinsi | Must have |
| Tren ketimpangan antarwaktu | Grafik garis waktu Gini, P0, P1, Theil Total 2022–2025 | Must have |
| Unduh data agregat | Ekspor data ke CSV/Excel untuk keperluan riset independen | Should have |
| Narasi kontekstual | Penjelasan tren, bukan sekadar ranking, untuk mitigasi risiko stigmatisasi wilayah | Must have |

### 6.2 Modul akses pemerintah

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Autentikasi kredensial instansi | Login resmi terverifikasi untuk Bappeda, BPS Jabar, Dinas Sosial | Must have |
| Skor kesejahteraan per KK | Hasil PMT-ML: klasifikasi desil 1–10 per kepala keluarga | Must have |
| Estimasi *inclusion*/*exclusion error* | Precision, recall, dan *confusion matrix* model per wilayah | Must have |
| Simulasi skenario kebijakan | Simulasi dampak statis berbasis skenario dengan disclaimer data *cross-section* | Should have |
| Peringkat efektivitas biaya | Ranking skenario kebijakan berdasarkan estimasi *cost-effectiveness* | Should have |
| Ekspor rekomendasi prioritas | Laporan wilayah dan kelompok prioritas untuk dasar pengambilan keputusan | Must have |

### 6.3 Fitur lintas modul

- Pembaruan data otomatis mengikuti siklus rilis Susenas dan Regsosek.
- Log audit akses data pemerintah untuk akuntabilitas.
- Mekanisme pelaporan anomali data dari publik (deteksi dini oleh masyarakat).

---

## 7. Arsitektur data dan model (ringkasan kebutuhan produk)

- **Sumber data**: BPS (Susenas, indikator kemiskinan resmi), Regsosek (variabel proksi rumah tangga), DTSEN/P3KE (referensi silang, bukan sumber utama).
- **Model**: Gradient Boosting untuk PMT, dilatih dengan label konsumsi Susenas, divalidasi *out-of-sample* (precision, recall, confusion matrix).
- **Granularitas data publik**: agregat kabupaten/kota dan periode tahunan.
- **Granularitas data pemerintah**: level kepala keluarga, dengan kontrol akses berbasis peran (*role-based access control*).
- **Frekuensi pembaruan**: mengikuti siklus pemutakhiran Susenas dan Regsosek (umumnya tahunan).

---

## 8. Metrik keberhasilan

| Metrik | Target indikatif | Kaitan tujuan |
|---|---|---|
| Jumlah wilayah pilot aktif | 2–3 kabupaten/kota pada fase pilot | Validasi implementasi awal |
| Akurasi model PMT (precision/recall) | Terukur dan dilaporkan per rilis model | Kualitas penargetan mikro |
| Pengguna aktif jalur publik | Pertumbuhan bulanan setelah peluncuran | Adopsi dan akuntabilitas sosial |
| Instansi pemerintah terverifikasi | Bappeda, BPS Jabar, Dinas Sosial pilot area | Adopsi kelembagaan |
| Waktu pembaruan data pasca rilis Susenas/Regsosek | Sesuai siklus resmi, tanpa jeda signifikan | Keandalan data |

---

## 9. Mitigasi risiko

| Risiko | Mitigasi |
|---|---|
| Stigmatisasi wilayah akibat ranking terbuka | Narasi kontekstual tren, bukan sekadar peringkat "termiskin" |
| Kesalahan klasifikasi PMT (inclusion/exclusion error) | Pelaporan kuantitatif error secara transparan, validasi *out-of-sample* berkelanjutan |
| Data tidak sinkron dengan DTSEN/P3KE | Kerja sama formal dengan BPS Jabar dan Bappeda untuk validasi silang berkala |
| Penyalahgunaan data level KK | Kontrol akses berbasis kredensial resmi instansi dan log audit |
| Keterbatasan data *cross-section* untuk simulasi | Disclaimer eksplisit pada modul simulasi kebijakan |

---

## 10. Rencana implementasi dan keberlanjutan

- **Fase 1 — Pilot**: implementasi pada 2–3 kabupaten/kota terpilih untuk evaluasi kendala teknis dan kelembagaan.
- **Fase 2 — Scale-up**: perluasan ke seluruh kabupaten/kota di Jawa Barat setelah evaluasi pilot.
- Kerja sama kelembagaan formal dengan Bappeda, BPS Jawa Barat, dan dinas sosial setempat.
- Kolaborasi pentahelix (pemerintah, akademisi, masyarakat, sektor swasta, media) untuk keberlanjutan jangka panjang.
- *Retraining* model dan pembaruan tipologi wilayah mengikuti siklus pemutakhiran Susenas dan Regsosek.

---

## 11. Lampiran

Diagram alur *pipeline* data (empat pilar) dan diagram dua jalur akses dashboard dirujuk pada dokumen desain terpisah (`DESIGN_Dashboard_RANCAGE.md`).
