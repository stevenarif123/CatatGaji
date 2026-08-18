# LANDASAN HUKUM DAN KERANGKA REGULASI PENGGAJIAN INDONESIA (2024–2026)
**Dokumen Riset Regulasi CatatGaji — Dokumen 01**

---

## 1. PENDAHULUAN & PRINSIP KEPATUHAN HUKUM

Aplikasi SaaS **CatatGaji** dirancang khusus untuk memproses penggajian bisnis dan Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia secara otomatis, akurat, dan patuh hukum (*100% statutory legal compliance*). Di Indonesia, penggajian bukan sekadar perhitungan aritmatika atas jam kerja dan tarif upah, melainkan sebuah simpul integrasi multi-hukum yang mengikat hak-hak fundamental pekerja, kewajiban perpajakan negara, jaminan perlindungan sosial ketenagakerjaan dan kesehatan, hingga kedaulatan perlindungan data pribadi pekerja.

Kegagalan mematuhi regulasi ketenagakerjaan dan perpajakan dapat menimbulkan konsekuensi hukum yang berat bagi entitas pemberi kerja, termasuk:
1. **Sanksi Administratif**: Denda keterlambatan pembayaran upah, bunga pajak, pembekuan izin usaha, hingga pencabutan izin operasional.
2. **Sanksi Pidana**: Pelanggaran upah minimum dan ketidakpatuhan pembayaran iuran jaminan sosial mengandung ancaman pidana kurungan maupun denda berdasarkan UU Ketenagakerjaan dan UU BPJS.
3. **Sengketa Hubungan Industrial**: Gugatan perselisihan hak dan kepentingan pada Pengadilan Hubungan Industrial (PHI).

Oleh karena itu, modul payroll engine CatatGaji dibangun di atas fondasi yuridis yang kokoh dan selalu terkini mengacu pada perundang-undangan Republik Indonesia periode 2024–2026.

---

## 2. HIERARKI PERATURAN PERUNDANG-UNDANGAN PENGGAJIAN

Sesuai dengan **Undang-Undang No. 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan** sebagaimana telah diubah terakhir dengan **Undang-Undang No. 13 Tahun 2022**, hierarki hukum penggajian di Indonesia tersusun secara sistematis dari tingkat undang-undang hingga peraturan tingkat perusahaan:

```
+-------------------------------------------------------------------------+
|                       UNDANG-UNDANG (UU) & PERPPU                       |
|   UU Cipta Kerja (UU 6/2023), UU HPP (UU 7/2021), UU BPJS (UU 24/2011), |
|   UU SJSN (UU 40/2004), UU KIA (UU 4/2024), UU PDP (UU 27/2022)        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                         PERATURAN PEMERINTAH (PP)                       |
|   PP 58/2023 (TER PPh 21), PP 35/2021 (PKWT, Lembur, PHK),              |
|   PP 36/2021 jo PP 51/2023 (Pengupahan), PP 44/45/46 2015 (BPJS TK)    |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        PERATURAN PRESIDEN (PERPRES)                     |
|   Perpres 82/2018 jo Perpres 75/2019 jo Perpres 64/2020 (BPJS Kesehatan)|
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|           PERATURAN MENTERI (PMK & PERMENAKER) & SURAT EDARAN           |
|   PMK 168/2023 (Petunjuk PPh 21), PMK 66/2023 (Natura),                 |
|   Permenaker 6/2016 (THR), Surat Edaran Batas Upah JP BPJS TK           |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|             OTONOMI TINGKAT PERUSAHAAN (PK, PP, PKB)                   |
|   Perjanjian Kerja (PK), Peraturan Perusahaan (PP),                     |
|   Perjanjian Kerja Bersama (PKB) -- Syarat: Tidak Boleh Lebih Rendah    |
|   dari Ketentuan Normatif Perundang-undangan di Atasnya                 |
+-------------------------------------------------------------------------+
```

---

## 3. INVENTARISASI SUMBER HUKUM UTAMA (2024–2026)

### 3.1 Klaster Perpajakan Penghasilan (PPh Pasal 21)
1. **Undang-Undang No. 7 Tahun 2021** tentang Harmonisasi Peraturan Perpajakan (UU HPP):
   - Merevisi Undang-Undang Pajak Penghasilan (UU PPh).
   - Menetapkan 5 lapisan tarif progresif PPh Orang Pribadi pada Pasal 17 ayat (1) huruf a (5%, 15%, 25%, 30%, 35%).
   - Memperbarui ambang batas lapisan pertama dari Rp50.000.000 menjadi Rp60.000.000.
2. **Peraturan Pemerintah No. 58 Tahun 2023**:
   - Menetapkan skema Tarif Efektif Rata-Rata (TER) PPh Pasal 21 atas penghasilan sehubungan dengan pekerjaan, jasa, atau kegiatan bagi Wajib Pajak Orang Pribadi.
   - Mengelompokkan TER Bulanan ke dalam Kategori A, Kategori B, dan Kategori C berdasarkan status Penghasilan Tidak Kena Pajak (PTKP).
   - Menetapkan TER Harian untuk pegawai tidak tetap.
3. **Peraturan Menteri Keuangan No. 168 Tahun 2023**:
   - Petunjuk pelaksanaan pemotongan PPh 21 atas penghasilan sehubungan dengan pekerjaan, jasa, atau kegiatan orang pribadi.
   - Menegaskan mekanisme perhitungan bulanan (Januari s/d November) berbasis TER dan rekonsiliasi masa pajak terakhir (Desember atau saat berhenti bekerja) berbasis Pasal 17 UU HPP.
   - Mengatur perlakuan pajak atas Bukan Pegawai (DPP 50% tanpa PTKP bulanan kumulatif), Pegawai Tidak Tetap, dan Tenaga Harian.
4. **Peraturan Menteri Keuangan No. 66 Tahun 2023**:
   - Mengatur perlakuan PPh atas penggantian atau imbalan sehubungan dengan pekerjaan atau jasa yang diterima dalam bentuk Natura dan/atau Kenikmatan (*fringe benefits*).
   - Menetapkan batas pengecualian (*threshold non-taxable*) untuk fasilitas kantor, kupon makan, bingkisan hari raya, fasilitas olahraga, dan mess karyawan.
5. **Peraturan Pemerintah No. 68 Tahun 2009**:
   - Tarif PPh Pasal 21 atas Uang Pesangon, Uang Manfaat Pensiun, Tunjangan Hari Tua (THT), dan Jaminan Hari Tua (JHT) yang dibayarkan sekaligus (Tarif Final: 0%, 5%, 15%, 25%).
6. **PMK No. 101/PMK.010/2016**:
   - Menetapkan batasan Penghasilan Tidak Kena Pajak (PTKP) yang masih berlaku: WP Sendiri Rp54.000.000/tahun, Tambahan WP Kawin Rp4.500.000/tahun, dan Tambahan per Tanggungan (maks 3 orang) Rp4.500.000/tahun.

---

### 3.2 Klaster Ketenagakerjaan, Pengupahan, dan Hubungan Kerja
1. **Undang-Undang No. 13 Tahun 2003** tentang Ketenagakerjaan:
   - Landasan pokok hukum perburuhan, hak istirahat, cuti, perlindungan upah, dan sanksi ketenagakerjaan.
   - Pasal 94 mengatur rasio komposisi Upah Pokok minimal 75% dari total upah tetap.
2. **Undang-Undang No. 6 Tahun 2023**:
   - Penetapan Peraturan Pemerintah Pengganti Undang-Undang No. 2 Tahun 2022 tentang Cipta Kerja Menjadi Undang-Undang.
   - Menata ulang ketentuan Perjanjian Kerja Waktu Tertentu (PKWT), batas waktu lembur, formula pesangon, dan fleksibilitas hubungan kerja.
3. **Putusan Mahkamah Konstitusi No. 168/PUU-XXI/2023**:
   - Mengabulkan sebagian permohonan uji materi atas UU Cipta Kerja klaster ketenagakerjaan.
   - Menegaskan kembali peran Dewan Pengupahan Daerah dalam penetapan Upah Minimum, memperjelas batas indeks tertentu ($\alpha$) dengan memperhatikan Kebutuhan Hidup Layak (KHL), serta menegaskan pembatasan jenis pekerjaan alih daya (*outsourcing*).
4. **Peraturan Pemerintah No. 35 Tahun 2021**:
   - Mengatur teknis pelaksanaan PKWT, Alih Daya, Waktu Kerja dan Waktu Istirahat (WKWI), serta Pemutusan Hubungan Kerja (PHK).
   - Menetapkan rumus dasar upah lembur ($1/173 \times \text{Upah Sebulan}$), matriks pengali jam lembur hari kerja dan hari libur resmi.
   - Menetapkan kewajiban Uang Kompensasi PKWT pada akhir masa kontrak.
   - Menetapkan formula Uang Pesangon (UP), Uang Penghargaan Masa Kerja (UPMK), Uang Penggantian Hak (UPH), serta faktor pengali alasan PHK.
5. **Peraturan Pemerintah No. 36 Tahun 2021 jo. Peraturan Pemerintah No. 51 Tahun 2023**:
   - Regulasi teknis tentang Pengupahan.
   - Mengatur formula penetapan Upah Minimum Provinsi (UMP) dan Upah Minimum Kabupaten/Kota (UMK).
   - Memberikan pengecualian upah minimum bagi Usaha Mikro dan Usaha Kecil (UMKM) melalui kesepakatan tertulis paling sedikit 50% dari rata-rata konsumsi masyarakat dan 25% di atas garis kemiskinan provinsi.
   - Mengatur pembatasan pemotongan upah maksimal 50% dari total upah yang diterima pekerja.
6. **Peraturan Menteri Ketenagakerjaan No. 6 Tahun 2016**:
   - Mengatur kewajiban Tunjangan Hari Raya (THR) Keagamaan.
   - Menetapkan hak THR penuh (masa kerja $\ge 12$ bulan) dan prorata (masa kerja 1 bulan s/d $<12$ bulan), serta tenggat waktu pembayaran H-7 sebelum hari raya keagamaan.
7. **Undang-Undang No. 4 Tahun 2024 tentang Kesejahteraan Ibu dan Anak pada Fase Seribu Hari Pertama Kehidupan (UU KIA)**:
   - Menjamin hak cuti melahirkan bagi ibu pekerja paling sedikit 3 bulan, dan dapat diperpanjang hingga 3 bulan berikutnya (total 6 bulan) dengan surat keterangan dokter.
   - Menetapkan skema pembayaran upah selama cuti melahirkan: 100% untuk 4 bulan pertama dan 75% untuk bulan ke-5 dan ke-6.
   - Melarang pengusaha melakukan PHK atau diskriminasi terhadap pekerja yang mengambil hak cuti melahirkan.

---

### 3.3 Klaster Jaminan Sosial (BPJS Ketenagakerjaan & BPJS Kesehatan)
1. **Undang-Undang No. 40 Tahun 2004** tentang Sistem Jaminan Sosial Nasional (SJSN).
2. **Undang-Undang No. 24 Tahun 2011** tentang Badan Penyelenggara Jaminan Sosial (BPJS).
3. **Peraturan Pemerintah No. 44 Tahun 2015**:
   - Penyelenggaraan Program Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM).
   - Menetapkan 5 kelompok tingkat risiko JKK (0.24%, 0.54%, 0.89%, 1.27%, 1.74%) dan JKM (0.30%) yang ditanggung penuh pemberi kerja.
4. **Peraturan Pemerintah No. 46 Tahun 2015**:
   - Penyelenggaraan Program Jaminan Hari Tua (JHT).
   - Iuran total 5.70% (3.70% pemberi kerja, 2.00% pekerja) dari upah sebulan tanpa batas plafon.
5. **Peraturan Pemerintah No. 45 Tahun 2015**:
   - Penyelenggaraan Program Jaminan Pensiun (JP).
   - Iuran total 3.00% (2.00% pemberi kerja, 1.00% pekerja) dengan batas tertinggi upah (*capping*) yang disesuaikan setiap tahun.
   - Batas upah JP tahun 2024: Rp10.042.300 / bulan; Tahun 2025: Rp10.547.400 / bulan.
6. **Peraturan Presiden No. 64 Tahun 2020** (Perubahan Kedua atas Perpres No. 82 Tahun 2018):
   - Penyelenggaraan Jaminan Kesehatan (BPJS Kesehatan).
   - Iuran 5.00% (4.00% pemberi kerja, 1.00% pekerja) dengan batas upah tertinggi Rp12.000.000 / bulan dan batas terendah UMK setempat.
   - Menanggung 5 anggota keluarga, dengan opsi penambahan 1% per jiwa tambahan.

---

### 3.4 Klaster Keamanan Data & Privasi Digital
1. **Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**:
   - Data penggajian, data rekening bank, Nomor Induk Kependudukan (NIK), NPWP, riwayat kesehatan, dan data biometrik presensi merupakan **Data Pribadi Spesifik / Sensitif**.
   - Platform CatatGaji wajib menerapkan prinsip kerahasiaan data, enkripsi end-to-end (AES-256 dan TLS 1.3), batasan retensi data, *explicit consent*, dan hak subjek data untuk mengakses atau menghapus data (*Right to Erasure / Anonymization*).

---

## 4. MEKANISME ADAPTASI PERUBAHAN REGULASI MASA DEPAN (*ZERO CODE CHANGE*)

Dalam kurun waktu operasional SaaS (2024–2030), pemerintah Indonesia secara berkala akan memperbarui nilai-nilai acuan regulasi, seperti penyesuaian UMP/UMK tahunan, batas upah tertinggi Jaminan Pensiun per 1 Maret, penyesuaian PTKP, atau revisi formula perpajakan DJP.

Untuk menjaga integritas sistem tanpa memerlukan kompilasi ulang kode sumber (*zero code deployment*), arsitektur CatatGaji menerapkan prinsip **Dynamic Temporal Parameter Store**.

```
+-------------------------------------------------------------------------+
|                       DYNAMIC REGULATION CONFIG ENGINE                  |
|                                                                         |
|  +---------------------------+       +-------------------------------+  |
|  | Master Parameter Table    |       | Temporal Effective Range      |  |
|  | - BPJS JP Capping Limits  | <---> | - effective_start_date        |  |
|  | - UMK Regional Rates      |       | - effective_end_date          |  |
|  | - TER Brackets A, B, C    |       | - rule_version                |  |
|  | - PTKP Thresholds         |       +-------------------------------+  |
|  +---------------------------+                       ^                  |
|               |                                      |                  |
|               v                                      v                  |
|  +-------------------------------------------------------------------+  |
|  |                     PAYROLL CALCULATION ENGINE                    |  |
|  |                                                                   |  |
|  |  Query: GetConfigByDate(payroll_period_date, tenant_region)        |  |
|  |  Result: Injeksi parameter aktif ke dalam formula murni           |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

### 4.1 Prinsip Desain Parameter Dinamis
1. **Temporal Validity Range**: Setiap parameter dalam basis data dilengkapi dengan atribut `effective_start_date` dan `effective_end_date`. Kalkulasi payroll pada bulan historis (misalnya perhitungan ulang atau audit tahun 2024) akan secara otomatis menggunakan parameter yang berlaku pada tanggal transaksi tersebut, bukan parameter terbaru.
2. **Deterministic Formula Execution**: Seluruh logika matematika dieksekusi sebagai fungsi deterministik murni (*pure mathematical functions*) yang menerima input parameter regulasi dinamis dari basis data.
3. **Tenant-Level Regulatory Overrides**: Tenant UMKM dapat mengaktifkan konfigurasi khusus sesuai Pasal 36 PP 36/2021 (kesepakatan upah UMKM) tanpa memengaruhi tenant berskala korporasi standar.
4. **Audit Trail & Governance Log**: Setiap modifikasi parameter hukum dicatat dalam log audit yang mencatat *actor ID*, *timestamp*, *old value*, *new value*, dan referensi surat edaran / peraturan pemerintah terkait.

---

*Dokumen ini menjadi rujukan hukum resmi untuk seluruh implementasi engine penggajian, data model, dan modul pelaporan pada platform CatatGaji.*
