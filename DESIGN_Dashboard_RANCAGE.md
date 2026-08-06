# Design Document — Dashboard RANCAGE

**Rancangan Antarmuka, Arsitektur Informasi, dan Alur Interaksi**

| | |
|---|---|
| Versi | 1.0 |
| Tanggal | 6 Agustus 2026 |
| Dokumen terkait | `PRD_Dashboard_RANCAGE.md` |

---

## 1. Tujuan dokumen

Dokumen ini menerjemahkan kebutuhan pada PRD Dashboard RANCAGE menjadi rancangan konkret: arsitektur informasi, alur navigasi, struktur halaman, komponen antarmuka, dan sistem desain (warna, tipografi, tata letak). Dokumen ini menjadi acuan bagi tim desain dan pengembang front-end sebelum masuk ke tahap wireframe presisi tinggi (high-fidelity).

---

## 2. Prinsip desain

1. **Agregat dulu, detail kemudian.** Halaman default menampilkan gambaran wilayah secara agregat; detail per rumah tangga hanya muncul setelah otorisasi dan setelah pengguna secara eksplisit menelusuri (drill-down).
2. **Kontekstual, bukan sekadar ranking.** Setiap tampilan yang berpotensi menstigma wilayah (mis. "wilayah termiskin") didampingi narasi tren agar data tidak dibaca sebagai label permanen.
3. **Dua jalur, satu bahasa visual.** Jalur publik dan pemerintah memakai sistem desain yang sama sehingga transisi terasa konsisten, dengan penanda visual jelas (badge/warna aksen) untuk membedakan mode akses.
4. **Bisa dipercaya secara analitis.** Setiap angka yang ditampilkan bisa ditelusuri sumber dan metodologinya (Theil, PMT-ML) melalui tooltip atau tautan metodologi — penting untuk kredibilitas akademik dan legitimasi kebijakan.
5. **Ringan di wilayah dengan konektivitas terbatas.** Prioritaskan tabel dan grafik ringan; peta interaktif berat memiliki alternatif tampilan tabel.

---

## 3. Arsitektur informasi

```
RANCAGE
├── Beranda (publik)
│   ├── Ringkasan indikator provinsi (Gini, P0, P1, Theil)
│   └── Peta tipologi wilayah
│
├── Eksplorasi Wilayah (publik)
│   ├── Dekomposisi Theil (within vs between)
│   ├── Rasio P0 per kabupaten/kota
│   ├── Tren antarwaktu (2022–2025)
│   └── Unduh data agregat
│
├── Metodologi (publik)
│   ├── Penjelasan dekomposisi Theil
│   ├── Penjelasan PMT-ML
│   └── Positioning terhadap P3KE/DTSEN
│
├── Login Instansi (gerbang akses pemerintah)
│
└── Ruang Kerja Pemerintah (privat, setelah login)
    ├── Skor Kesejahteraan per KK
    ├── Estimasi Inclusion/Exclusion Error
    ├── Simulasi Skenario Kebijakan
    ├── Peringkat Efektivitas Biaya
    └── Ekspor Rekomendasi Prioritas
```

---

## 4. Peta alur navigasi

```
[Beranda publik] ─▶ [Pilih wilayah] ─▶ [Eksplorasi Wilayah] ─▶ [Unduh data]
       │                                        │
       └────────────▶ [Metodologi] ◀────────────┘

[Login Instansi] ─▶ (verifikasi kredensial) ─▶ [Ruang Kerja Pemerintah]
                                                       │
                        ┌──────────────────────────────┼──────────────────────────────┐
                        ▼                               ▼                              ▼
              [Skor Kesejahteraan KK]      [Simulasi Skenario Kebijakan]     [Ekspor Rekomendasi]
```

---

## 5. Rancangan halaman (wireframe deskriptif)

### 5.1 Beranda (publik)

| Zona | Isi |
|---|---|
| Header | Logo RANCAGE, navigasi (Beranda, Eksplorasi Wilayah, Metodologi), tombol "Masuk sebagai Instansi" di kanan atas |
| Hero ringkasan | 4 kartu indikator provinsi: Rasio Gini (0,416), P0, P1, Theil Total, masing-masing dengan indikator tren naik/turun |
| Peta tipologi wilayah | Peta choropleth Jawa Barat, warna berdasarkan kuadran (miskin tinggi–ketimpangan tinggi = prioritas utama); klik kabupaten/kota membuka panel ringkas |
| Panel ringkas wilayah | Muncul di sisi kanan saat wilayah dipilih: nama wilayah, kuadran, rasio P0, kontribusi *within*, tombol "Lihat detail" |
| Footer | Tautan metodologi, sumber data (BPS/Susenas/Regsosek), kontak Bappeda/BPS Jabar |

### 5.2 Eksplorasi Wilayah (publik)

| Zona | Isi |
|---|---|
| Filter atas | Pilih wilayah (multi-select), rentang tahun (2022–2025) |
| Grafik dekomposisi Theil | Stacked bar chart: kontribusi *within* vs *between* per tahun |
| Grafik rasio P0 | Bar chart horizontal, kabupaten/kota diurutkan, garis referensi rasio = 1 |
| Grafik tren antarwaktu | Line chart multi-indikator (Gini, P0, P1, Theil) dengan toggle indikator |
| Narasi kontekstual | Blok teks otomatis di bawah setiap grafik menjelaskan tren, bukan sekadar angka |
| Tombol unduh | Ekspor CSV/Excel data yang sedang ditampilkan (sesuai filter aktif) |

### 5.3 Metodologi (publik)

Halaman statis/semi-statis berisi penjelasan dekomposisi Indeks Theil, alur PMT-ML (Susenas sebagai *ground truth*, Regsosek sebagai proksi), dan positioning RANCAGE terhadap P3KE/DTSEN. Menyertakan diagram alur pipeline data.

### 5.4 Login Instansi

Form sederhana: ID instansi, kata sandi, opsi verifikasi dua langkah. Pesan kesalahan jelas bila kredensial tidak valid atau instansi belum terverifikasi. Tautan "Ajukan akses instansi" untuk instansi baru.

### 5.5 Ruang Kerja Pemerintah (privat)

| Zona | Isi |
|---|---|
| Sidebar navigasi | Skor Kesejahteraan KK, Inclusion/Exclusion Error, Simulasi Kebijakan, Ekspor Rekomendasi |
| Header privat | Badge "Mode Pemerintah", nama instansi login, log aktivitas terakhir |
| Tabel skor kesejahteraan | Daftar rumah tangga per wilayah dengan kolom: ID rumah tangga (tersamar), desil, kategori (miskin/menengah rentan/sejahtera), filter per kecamatan |
| Panel inclusion/exclusion error | Confusion matrix per wilayah, angka precision/recall, catatan interpretasi |
| Modul simulasi kebijakan | Pilih skenario intervensi → parameter input → hasil estimasi dampak statis, disertai disclaimer keterbatasan data *cross-section* |
| Peringkat efektivitas biaya | Tabel ranking skenario berdasarkan estimasi biaya per unit dampak |
| Tombol ekspor rekomendasi | Unduh laporan PDF/Excel berisi wilayah dan kelompok prioritas |

---

## 6. Sistem desain

### 6.1 Palet warna

| Peran | Warna | Penggunaan |
|---|---|---|
| Aksen utama | Teal | Elemen jalur akses publik, tombol utama |
| Aksen sekunder | Ungu | Elemen jalur akses pemerintah, badge mode privat |
| Peringatan/prioritas | Coral/oranye | Penanda wilayah prioritas utama pada peta tipologi |
| Netral | Abu-abu | Latar, garis, teks sekunder |
| Sukses | Hijau | Indikator tren membaik |

Kuadran pada matriks tipologi wilayah menggunakan gradasi dari netral (risiko rendah) ke coral (prioritas utama) agar konsisten dan mudah dibaca tanpa terkesan menghakimi wilayah.

### 6.2 Tipografi

- Judul halaman: sans-serif, medium weight, ukuran besar untuk keterbacaan cepat pada ringkasan indikator.
- Isi/narasi: sans-serif reguler, ukuran nyaman baca untuk narasi kontekstual dan metodologi.
- Angka pada kartu indikator: ditekankan lebih besar dan tebal dibanding label, agar angka kunci (Gini, P0, P1) langsung tertangkap mata.

### 6.3 Komponen kunci

- **Kartu indikator**: angka besar + label + indikator tren (panah naik/turun + warna).
- **Peta choropleth**: legenda kuadran selalu terlihat, tooltip on-hover menampilkan nama wilayah dan nilai ringkas.
- **Tabel data**: dapat diurutkan dan difilter, dengan opsi ekspor konsisten di semua tabel.
- **Badge mode akses**: label kecil di header ("Publik" / "Mode Pemerintah") agar pengguna selalu sadar konteks akses saat ini.
- **Blok narasi kontekstual**: kotak teks dengan latar netral terpisah dari grafik, agar jelas ini interpretasi bukan data mentah.

### 6.4 Aksesibilitas dan keterbacaan

- Kontras warna memenuhi standar WCAG AA minimum untuk teks pada latar berwarna.
- Setiap grafik memiliki alternatif tabel data untuk pengguna pembaca layar dan koneksi lambat.
- Bahasa Indonesia baku dan sederhana pada seluruh narasi kontekstual, menghindari jargon statistik tanpa penjelasan.

---

## 7. Interaksi lintas jalur akses

| Aksi pengguna | Jalur publik | Jalur pemerintah |
|---|---|---|
| Melihat data wilayah | Agregat kabupaten/kota | Agregat + detail per kepala keluarga |
| Mengunduh data | CSV/Excel data agregat | CSV/Excel/PDF termasuk rekomendasi prioritas |
| Menjalankan simulasi kebijakan | Tidak tersedia | Tersedia dengan disclaimer |
| Melaporkan anomali data | Tersedia (formulir sederhana) | Tersedia + tercatat dalam log audit |

---

## 8. Catatan implementasi teknis (ringkas)

- Peta choropleth dan grafik tren sebaiknya menggunakan pustaka visualisasi yang mendukung ekspor data mentah, bukan hanya gambar statis.
- Data publik dan data pemerintah dipisahkan pada lapisan API (endpoint agregat vs endpoint berkredensial) untuk memastikan kontrol akses tidak bergantung pada front-end saja.
- Struktur navigasi dirancang agar jalur publik tetap dapat diakses penuh tanpa login, sesuai prinsip keterbukaan data agregat pada PRD.

---

## 9. Langkah selanjutnya

1. Review arsitektur informasi bersama Bappeda/BPS Jabar untuk validasi kebutuhan tampilan data instansi.
2. Susun wireframe presisi tinggi (Figma) berdasarkan struktur halaman pada bagian 5.
3. Uji coba narasi kontekstual dengan sampel pengguna publik untuk memastikan tidak terjadi kesalahpahaman atau stigmatisasi wilayah.
