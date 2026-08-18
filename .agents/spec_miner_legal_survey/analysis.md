# LAPORAN SURVEI & SPESIFIKASI REGULASI PENGGAJIAN INDONESIA (2024–2026)
**Aplikasi Multi-Tenant SaaS CatatGaji**
*Dokumen Spesifikasi Resmi untuk Desain Engine Penggajian, Pajak, dan Kepatuhan Ketenagakerjaan*

---

## DAFTAR ISI
1. [Eksekutif & Landasan Hukum](#1-eksekutif--landasan-hukum)
2. [Pajak Penghasilan Pasal 21 (PPh 21)](#2-pajak-penghasilan-pasal-21-pph-21)
   - [2.1 Landasan Hukum & Paradigma Baru](#21-landasan-hukum--paradigma-baru)
   - [2.2 Klasifikasi PTKP & Pemetaan Kategori TER](#22-klasifikasi-ptkp--pemetaan-kategori-ter)
   - [2.3 Tabel Lengkap Tarif Efektif Rata-Rata (TER) Bulanan](#23-tabel-lengkap-tarif-efektif-rata-rata-ter-bulanan)
   - [2.4 TER Harian untuk Pegawai Tidak Tetap](#24-ter-harian-untuk-pegawai-tidak-tetap)
   - [2.5 Mekanisme Perhitungan Masa Pajak Terakhir (Desember / Resign)](#25-mekanisme-perhitungan-masa-pajak-terakhir-desember--resign)
   - [2.6 Biaya Jabatan & Iuran Pengurang](#26-biaya-jabatan--iuran-pengurang)
   - [2.7 Bukan Pegawai, Pesangon Final, dan Natura (PMK 66/2023)](#27-bukan-pegawai-pesangon-final-dan-natura-pmk-662023)
   - [2.8 Skema Pemotongan: Gross, Gross-Up, dan Net](#28-skema-pemotongan-gross-gross-up-dan-net)
3. [BPJS Ketenagakerjaan](#3-bpjs-ketenagakerjaan)
   - [3.1 Program Jaminan & Tarif Iuran](#31-program-jaminan--tarif-iuran)
   - [3.2 Capping Upah Jaminan Pensiun (JP) 2024–2026](#32-capping-upah-jaminan-pensiun-jp-20242026)
   - [3.3 Dampak Iuran BPJS TK terhadap Pajak PPh 21](#33-dampak-iuran-bpjs-tk-terhadap-pajak-pph-21)
4. [BPJS Kesehatan](#4-bpjs-kesehatan)
   - [4.1 Tarif Iuran & Batas Upah (Capping)](#41-tarif-iuran--batas-upah-capping)
   - [4.2 Cakupan Anggota Keluarga & Iuran Tambahan](#42-cakupan-anggota-keluarga--iuran-tambahan)
   - [4.3 Dampak Pajak PPh 21](#43-dampak-pajak-pph-21)
5. [Upah Minimum & Struktur Komponen Upah](#5-upah-minimum--struktur-komponen-upah)
   - [5.1 Komposisi Upah Pokok & Tunjangan (Pasal 94 UU Ketenagakerjaan)](#51-komposisi-upah-pokok--tunjangan-pasal-94-uu-ketenagakerjaan)
   - [5.2 Regulasi Upah Minimum & Putusan MK No. 168/PUU-XXI/2023](#52-regulasi-upah-minimum--putusan-mk-no-168puu-xxi2023)
   - [5.3 Pengecualian Usaha Mikro dan Kecil (UMK)](#53-pengecualian-usaha-mikro-dan-kecil-umk)
6. [Tunjangan Hari Raya (THR) Keagamaan](#6-tunjangan-hari-raya-thr-keagamaan)
   - [6.1 Syarat, Waktu Pembayaran & Formula Prorata](#61-syarat-waktu-pembayaran--formula-prorata)
   - [6.2 Pekerja Lepas / Harian / Borongan](#62-pekerja-lepas--harian--borongan)
   - [6.3 Perhitungan PPh 21 atas THR](#63-perhitungan-pph-21-atas-thr)
7. [Perhitungan Upah Kerja Lembur (Overtime)](#7-perhitungan-upah-kerja-lembur-overtime)
   - [7.1 Dasar Perhitungan Upah Sejam (1/173)](#71-dasar-perhitungan-upah-sejam-1173)
   - [7.2 Tabel Multiplier Lembur: Hari Kerja vs Hari Libur (5 & 6 Hari Kerja)](#72-tabel-multiplier-lembur-hari-kerja-vs-hari-libur-5--6-hari-kerja)
   - [7.3 Batasan Jam Kerja & Kewajiban Administratif (SPKL)](#73-batasan-jam-kerja--kewajiban-administratif-spkl)
8. [Cuti & Izin Khusus Berbayar](#8-cuti--izin-khusus-berbayar)
   - [8.1 Cuti Tahunan & Hak Upah Penuh](#81-cuti-tahunan--hak-upah-penuh)
   - [8.2 Cuti Melahirkan / Maternitas (UU KIA No. 4/2024)](#82-cuti-melahirkan--maternitas-uu-kia-no-42024)
   - [8.3 Cuti Keguguran & Cuti Haid](#83-cuti-keguguran--cuti-haid)
   - [8.4 Izin Khusus Berbayar (Pernikahan, Kematian, Kelahiran)](#84-izin-khusus-berbayar-pernikahan-kematian-kelahiran)
9. [Status Hubungan Kerja, Kompensasi PKWT & Pesangon PHK](#9-status-hubungan-kerja-kompensasi-pkwt--pesangon-phk)
   - [9.1 PKWT vs PKWTT & Syarat Percobaan](#91-pkwt-vs-pkwtt--syarat-percobaan)
   - [9.2 Formula Uang Kompensasi PKWT (PP 35/2021)](#92-formula-uang-kompensasi-pkwt-pp-352021)
   - [9.3 Formula Pesangon (UP), UPMK, UPH & Faktor Pengali PHK](#93-formula-pesangon-up-upmk-uph--faktor-pengali-phk)
10. [Simulasi & Contoh Perhitungan Numerik Realistis](#10-simulasi--contoh-perhitungan-numerik-realistis)
    - [10.1 Kasus 1: Karyawan Tetap (Gaji Reguler + Lembur + BPJS + PPh 21 TER B & Masa Desember)](#101-kasus-1-karyawan-tetap-gaji-reguler--lembur--bpjs--pph-21-ter-b--masa-desember)
    - [10.2 Kasus 2: Karyawan Tetap Menerima Gaji + THR (Pajak Bulan Biasa vs Bulan THR TER A)](#102-kasus-2-karyawan-tetap-menerima-gaji--thr-pajak-bulan-biasa-vs-bulan-thr-ter-a)
    - [10.3 Kasus 3: Karyawan PKWT Berakhir Kontrak + Lembur Libur Resmi (Kompensasi + Overtime)](#103-kasus-3-karyawan-pkwt-berakhir-kontrak--lembur-libur-resmi-kompensasi--overtime)
11. [Matriks Spesifikasi Fitur Discovered (Tabel Standar Miner)](#11-matriks-spesifikasi-fitur-discovered-tabel-standar-miner)
12. [Matriks Edge Cases & Validasi Regulasi](#12-matriks-edge-cases--validasi-regulasi)
13. [Arsitektur Konfigurasi & Mekanisme Adaptasi Perubahan Regulasi](#13-arsitektur-konfigurasi--mekanisme-adaptasi-perubahan-regulasi)

---

## 1. EKSEKUTIF & LANDASAN HUKUM

Aplikasi SaaS **CatatGaji** dirancang khusus untuk memproses penggajian bisnis dan UMKM di Indonesia secara otomatis, akurat, dan patuh hukum (100% legal compliance). Seluruh kalkulasi dalam mesin penggajian (payroll engine) wajib mengacu secara ketat pada peraturan perundang-undangan Republik Indonesia yang berlaku pada periode 2024–2026:

1. **Perpajakan (PPh 21)**:
   - **UU No. 7 Tahun 2021** tentang Harmonisasi Peraturan Perpajakan (UU HPP).
   - **PP No. 58 Tahun 2023** tentang Tarif Pemotongan Pajak Penghasilan Pasal 21 atas Penghasilan Sehubungan dengan Pekerjaan, Jasa, atau Kegiatan Wajib Pajak Orang Pribadi.
   - **PMK No. 168 Tahun 2023** tentang Petunjuk Pelaksanaan Pemotongan Pajak atas Penghasilan Sehubungan dengan Pekerjaan, Jasa, atau Kegiatan Orang Pribadi.
   - **PMK No. 66 Tahun 2023** tentang Perlakuan PPh atas Natura dan/atau Kenikmatan.
   - **PP No. 68 Tahun 2009** tentang Tarif PPh Pasal 21 atas Uang Pesangon, Uang Manfaat Pensiun, THT, dan JHT yang Dibayarkan Sekaligus.
   - **PMK No. 101/PMK.010/2016** tentang Penyesuaian Besarnya PTKP.

2. **Ketenagakerjaan & Hubungan Kerja**:
   - **UU No. 13 Tahun 2003** tentang Ketenagakerjaan.
   - **UU No. 6 Tahun 2023** tentang Penetapan Perppu No. 2 Tahun 2022 tentang Cipta Kerja Menjadi Undang-Undang.
   - **Putusan Mahkamah Konstitusi No. 168/PUU-XXI/2023** tentang Pengujian UU Cipta Kerja (Klaster Ketenagakerjaan).
   - **PP No. 35 Tahun 2021** tentang PKWT, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan PHK.
   - **PP No. 36 Tahun 2021** jo. **PP No. 51 Tahun 2023** tentang Pengupahan.
   - **Permenaker No. 6 Tahun 2016** tentang Tunjangan Hari Raya Keagamaan bagi Pekerja/Buruh di Perusahaan.
   - **UU No. 4 Tahun 2024** tentang Kesejahteraan Ibu dan Anak pada Fase Seribu Hari Pertama Kehidupan (UU KIA).

3. **Jaminan Sosial Ketenagakerjaan & Kesehatan**:
   - **UU No. 40 Tahun 2004** tentang Sistem Jaminan Sosial Nasional (SJSN).
   - **UU No. 24 Tahun 2011** tentang Badan Penyelenggara Jaminan Sosial (BPJS).
   - **PP No. 44 Tahun 2015** tentang Penyelenggaraan Program JKK dan JKM.
   - **PP No. 45 Tahun 2015** tentang Penyelenggaraan Program Jaminan Pensiun.
   - **PP No. 46 Tahun 2015** tentang Penyelenggaraan Program Jaminan Hari Tua.
   - **Perpres No. 82 Tahun 2018** jo. **Perpres No. 75 Tahun 2019** jo. **Perpres No. 64 Tahun 2020** tentang Jaminan Kesehatan.
   - **Surat Edaran BPJS Ketenagakerjaan No. B/1715/032024** & Penyesuaian Batas Upah JP 2024/2025/2026.

---

## 2. PAJAK PENGHASILAN PASAL 21 (PPH 21)

### 2.1 Landasan Hukum & Paradigma Baru
Mulai 1 Januari 2024, pemotongan PPh 21 menggunakan skema **Tarif Efektif Rata-Rata (TER)** berdasarkan PP 58/2023 dan PMK 168/2023:
1. **Masa Pajak Selain Masa Pajak Terakhir (Januari s/d November)**: Pemotongan dihitung dengan mengalikan **Penghasilan Bruto Sebulan** dengan **Tarif Efektif Bulanan** (Kategori A, B, atau C sesuai status PTKP). Tidak ada pengurangan Biaya Jabatan, Iuran Pensiun/JHT, atau PTKP pada masa bulanan ini.
2. **Masa Pajak Terakhir (Desember atau Bulan Karyawan Resign/Berhenti Kerja)**: Pemotongan dihitung menggunakan **Tarif Progresif Pasal 17 ayat (1) huruf a UU HPP** atas **Penghasilan Kena Pajak (PKP)** setahun/disetahunkan, kemudian dikurangi jumlah PPh 21 yang telah dipotong pada bulan-bulan sebelumnya.

### 2.2 Klasifikasi PTKP & Pemetaan Kategori TER
Besaran Penghasilan Tidak Kena Pajak (PTKP) tahun 2024–2026 adalah sebagai berikut:
- Wajib Pajak Sendiri: **Rp54.000.000 / tahun** (Rp4.500.000 / bulan).
- Tambahan untuk Wajib Pajak Kawin: **Rp4.500.000 / tahun** (Rp375.000 / bulan).
- Tambahan untuk setiap anggota keluarga sedarah/semenda dalam garis keturunan lurus serta anak angkat yang menjadi tanggungan sepenuhnya (maksimal 3 orang): **Rp4.500.000 / tahun / orang** (Rp375.000 / bulan).

#### Tabel Pemetaan Status PTKP ke Kategori TER Bulanan (Pasal 2 PP 58/2023)
| Status PTKP | Keterangan Status | Nilai PTKP Setahun (Rp) | Kategori TER Bulanan |
|-------------|-------------------|-------------------------|----------------------|
| **TK/0** | Tidak Kawin, 0 Tanggungan | Rp54.000.000 | **TER Kategori A** |
| **TK/1** | Tidak Kawin, 1 Tanggungan | Rp58.500.000 | **TER Kategori A** |
| **K/0** | Kawin, 0 Tanggungan | Rp58.500.000 | **TER Kategori A** |
| **TK/2** | Tidak Kawin, 2 Tanggungan | Rp63.000.000 | **TER Kategori B** |
| **TK/3** | Tidak Kawin, 3 Tanggungan | Rp67.500.000 | **TER Kategori B** |
| **K/1** | Kawin, 1 Tanggungan | Rp63.000.000 | **TER Kategori B** |
| **K/2** | Kawin, 2 Tanggungan | Rp67.500.000 | **TER Kategori B** |
| **K/3** | Kawin, 3 Tanggungan | Rp72.000.000 | **TER Kategori C** |

*Catatan untuk Karyawati*:
- Karyawati yang menikah dianggap **TK/0** untuk pemotongan PPh 21, kecuali suaminya tidak memiliki penghasilan dan dibuktikan dengan Surat Keterangan dari Pemerintah Daerah setempat (minimal Kelurahan/Kecamatan), sehingga status PTKP-nya dapat menjadi K/1, K/2, atau K/3.

---

### 2.3 Tabel Lengkap Tarif Efektif Rata-Rata (TER) Bulanan

#### A. Tabel TER Kategori A (Status PTKP: TK/0, TK/1, K/0)
| No | Rentang Penghasilan Bruto Sebulan (Rp) | Tarif TER A (%) |
|----|----------------------------------------|-----------------|
| 1 | s/d 5.400.000 | 0.00% |
| 2 | > 5.400.000 s/d 5.650.000 | 0.25% |
| 3 | > 5.650.000 s/d 5.950.000 | 0.50% |
| 4 | > 5.950.000 s/d 6.300.000 | 0.75% |
| 5 | > 6.300.000 s/d 6.750.000 | 1.00% |
| 6 | > 6.750.000 s/d 7.500.000 | 1.25% |
| 7 | > 7.500.000 s/d 8.550.000 | 1.50% |
| 8 | > 8.550.000 s/d 9.650.000 | 1.75% |
| 9 | > 9.650.000 s/d 10.050.000 | 2.00% |
| 10 | > 10.050.000 s/d 10.350.000 | 2.25% |
| 11 | > 10.350.000 s/d 10.700.000 | 2.50% |
| 12 | > 10.700.000 s/d 11.050.000 | 3.00% |
| 13 | > 11.050.000 s/d 11.600.000 | 3.50% |
| 14 | > 11.600.000 s/d 12.500.000 | 4.00% |
| 15 | > 12.500.000 s/d 13.750.000 | 5.00% |
| 16 | > 13.750.000 s/d 15.100.000 | 6.00% |
| 17 | > 15.100.000 s/d 16.950.000 | 7.00% |
| 18 | > 16.950.000 s/d 19.750.000 | 8.00% |
| 19 | > 19.750.000 s/d 24.150.000 | 9.00% |
| 20 | > 24.150.000 s/d 26.450.000 | 10.00% |
| 21 | > 26.450.000 s/d 28.000.000 | 11.00% |
| 22 | > 28.000.000 s/d 30.050.000 | 12.00% |
| 23 | > 30.050.000 s/d 32.400.000 | 13.00% |
| 24 | > 32.400.000 s/d 35.400.000 | 14.00% |
| 25 | > 35.400.000 s/d 39.100.000 | 15.00% |
| 26 | > 39.100.000 s/d 43.850.000 | 16.00% |
| 27 | > 43.850.000 s/d 47.800.000 | 17.00% |
| 28 | > 47.800.000 s/d 51.400.000 | 18.00% |
| 29 | > 51.400.000 s/d 56.300.000 | 19.00% |
| 30 | > 56.300.000 s/d 62.200.000 | 20.00% |
| 31 | > 62.200.000 s/d 68.600.000 | 21.00% |
| 32 | > 68.600.000 s/d 77.500.000 | 22.00% |
| 33 | > 77.500.000 s/d 89.000.000 | 23.00% |
| 34 | > 89.000.000 s/d 103.000.000 | 24.00% |
| 35 | > 103.000.000 s/d 125.000.000 | 25.00% |
| 36 | > 125.000.000 s/d 157.000.000 | 26.00% |
| 37 | > 157.000.000 s/d 206.000.000 | 27.00% |
| 38 | > 206.000.000 s/d 337.000.000 | 28.00% |
| 39 | > 337.000.000 s/d 454.000.000 | 29.00% |
| 40 | > 454.000.000 s/d 550.000.000 | 30.00% |
| 41 | > 550.000.000 s/d 695.000.000 | 31.00% |
| 42 | > 695.000.000 s/d 910.000.000 | 32.00% |
| 43 | > 910.000.000 s/d 1.400.000.000 | 33.00% |
| 44 | > 1.400.000.000 | 34.00% |

#### B. Tabel TER Kategori B (Status PTKP: TK/2, TK/3, K/1, K/2)
| No | Rentang Penghasilan Bruto Sebulan (Rp) | Tarif TER B (%) |
|----|----------------------------------------|-----------------|
| 1 | s/d 6.200.000 | 0.00% |
| 2 | > 6.200.000 s/d 6.500.000 | 0.25% |
| 3 | > 6.500.000 s/d 6.850.000 | 0.50% |
| 4 | > 6.850.000 s/d 7.300.000 | 0.75% |
| 5 | > 7.300.000 s/d 9.200.000 | 1.00% |
| 6 | > 9.200.000 s/d 10.750.000 | 1.50% |
| 7 | > 10.750.000 s/d 11.250.000 | 2.00% |
| 8 | > 11.250.000 s/d 11.600.000 | 2.50% |
| 9 | > 11.600.000 s/d 12.600.000 | 3.00% |
| 10 | > 12.600.000 s/d 13.600.000 | 4.00% |
| 11 | > 13.600.000 s/d 14.950.000 | 5.00% |
| 12 | > 14.950.000 s/d 16.400.000 | 6.00% |
| 13 | > 16.400.000 s/d 18.450.000 | 7.00% |
| 14 | > 18.450.000 s/d 21.850.000 | 8.00% |
| 15 | > 21.850.000 s/d 26.000.000 | 9.00% |
| 16 | > 26.000.000 s/d 27.700.000 | 10.00% |
| 17 | > 27.700.000 s/d 29.350.000 | 11.00% |
| 18 | > 29.350.000 s/d 31.450.000 | 12.00% |
| 19 | > 31.450.000 s/d 33.950.000 | 13.00% |
| 20 | > 33.950.000 s/d 37.100.000 | 14.00% |
| 21 | > 37.100.000 s/d 41.100.000 | 15.00% |
| 22 | > 41.100.000 s/d 45.800.000 | 16.00% |
| 23 | > 45.800.000 s/d 49.500.000 | 17.00% |
| 24 | > 49.500.000 s/d 53.800.000 | 18.00% |
| 25 | > 53.800.000 s/d 58.500.000 | 19.00% |
| 26 | > 58.500.000 s/d 64.000.000 | 20.00% |
| 27 | > 64.000.000 s/d 71.000.000 | 21.00% |
| 28 | > 71.000.000 s/d 80.000.000 | 22.00% |
| 29 | > 80.000.000 s/d 93.000.000 | 23.00% |
| 30 | > 93.000.000 s/d 109.000.000 | 24.00% |
| 31 | > 109.000.000 s/d 129.000.000 | 25.00% |
| 32 | > 129.000.000 s/d 163.000.000 | 26.00% |
| 33 | > 163.000.000 s/d 211.000.000 | 27.00% |
| 34 | > 211.000.000 s/d 374.000.000 | 28.00% |
| 35 | > 374.000.000 s/d 459.000.000 | 29.00% |
| 36 | > 459.000.000 s/d 555.000.000 | 30.00% |
| 37 | > 555.000.000 s/d 704.000.000 | 31.00% |
| 38 | > 704.000.000 s/d 957.000.000 | 32.00% |
| 39 | > 957.000.000 s/d 1.405.000.000 | 33.00% |
| 40 | > 1.405.000.000 | 34.00% |

#### C. Tabel TER Kategori C (Status PTKP: K/3)
| No | Rentang Penghasilan Bruto Sebulan (Rp) | Tarif TER C (%) |
|----|----------------------------------------|-----------------|
| 1 | s/d 6.600.000 | 0.00% |
| 2 | > 6.600.000 s/d 6.950.000 | 0.25% |
| 3 | > 6.950.000 s/d 7.350.000 | 0.50% |
| 4 | > 7.350.000 s/d 7.800.000 | 0.75% |
| 5 | > 7.800.000 s/d 8.850.000 | 1.00% |
| 6 | > 8.850.000 s/d 9.800.000 | 1.25% |
| 7 | > 9.800.000 s/d 10.950.000 | 1.50% |
| 8 | > 10.950.000 s/d 11.200.000 | 1.75% |
| 9 | > 11.200.000 s/d 12.050.000 | 2.00% |
| 10 | > 12.050.000 s/d 12.950.000 | 3.00% |
| 11 | > 12.950.000 s/d 14.150.000 | 4.00% |
| 12 | > 14.150.000 s/d 15.550.000 | 5.00% |
| 13 | > 15.550.000 s/d 17.050.000 | 6.00% |
| 14 | > 17.050.000 s/d 19.500.000 | 7.00% |
| 15 | > 19.500.000 s/d 22.700.000 | 8.00% |
| 16 | > 22.700.000 s/d 26.600.000 | 9.00% |
| 17 | > 26.600.000 s/d 28.100.000 | 10.00% |
| 18 | > 28.100.000 s/d 30.100.000 | 11.00% |
| 19 | > 30.100.000 s/d 32.600.000 | 12.00% |
| 20 | > 32.600.000 s/d 35.400.000 | 13.00% |
| 21 | > 35.400.000 s/d 38.900.000 | 14.00% |
| 22 | > 38.900.000 s/d 43.000.000 | 15.00% |
| 23 | > 43.000.000 s/d 47.400.000 | 16.00% |
| 24 | > 47.400.000 s/d 51.200.000 | 17.00% |
| 25 | > 51.200.000 s/d 55.800.000 | 18.00% |
| 26 | > 55.800.000 s/d 60.400.000 | 19.00% |
| 27 | > 60.400.000 s/d 66.700.000 | 20.00% |
| 28 | > 66.700.000 s/d 74.500.000 | 21.00% |
| 29 | > 74.500.000 s/d 83.200.000 | 22.00% |
| 30 | > 83.200.000 s/d 95.600.000 | 23.00% |
| 31 | > 95.600.000 s/d 110.000.000 | 24.00% |
| 32 | > 110.000.000 s/d 134.000.000 | 25.00% |
| 33 | > 134.000.000 s/d 169.000.000 | 26.00% |
| 34 | > 169.000.000 s/d 221.000.000 | 27.00% |
| 35 | > 221.000.000 s/d 390.000.000 | 28.00% |
| 36 | > 390.000.000 s/d 463.000.000 | 29.00% |
| 37 | > 463.000.000 s/d 561.000.000 | 30.00% |
| 38 | > 561.000.000 s/d 709.000.000 | 31.00% |
| 39 | > 709.000.000 s/d 965.000.000 | 32.00% |
| 40 | > 965.000.000 s/d 1.419.000.000 | 33.00% |
| 41 | > 1.419.000.000 | 34.00% |

---

### 2.4 TER Harian untuk Pegawai Tidak Tetap
Berdasarkan PP 58/2023 dan PMK 168/2023 Pasal 5 ayat (1) huruf c:
| Rentang Penghasilan Bruto Sehari (Rp) | Tarif TER Harian (%) | Keterangan |
|---------------------------------------|----------------------|------------|
| **s/d Rp450.000** | **0.00%** | Tidak dipotong PPh 21 |
| **> Rp450.000 s/d Rp2.500.000** | **0.50%** | Dipotong PPh 21 harian: `0.5% x Penghasilan Bruto Sehari` |
| **> Rp2.500.000** | **Tarif Pasal 17** | Dihitung dari `Penghasilan Bruto Disetahunkan - PTKP` atau `50% x Bruto x Tarif Progresif` |

*Ketentuan Kumulatif*: Jika jumlah penghasilan bruto yang diterima pegawai tidak tetap dalam satu bulan kalender telah melebihi **Rp2.500.000**, atau dibayarkan secara bulanan, pemotongan PPh 21 beralih menggunakan mekanisme TER Bulanan atau disetahunkan per PMK 168/2023.

---

### 2.5 Mekanisme Perhitungan Masa Pajak Terakhir (Desember / Resign)

Pada Masa Pajak Terakhir (bulan Desember untuk pegawai yang bekerja setahun penuh, atau bulan saat pegawai berhenti bekerja), pemotongan PPh 21 dihitung sebagai berikut:

$$\text{PPh 21 Terutang Setahun} = \text{Tarif Pasal 17 ayat (1) huruf a UU HPP} \times \text{PKP Setahun}$$
$$\text{PPh 21 Masa Terakhir} = \text{PPh 21 Terutang Setahun} - \sum (\text{PPh 21 yang Telah Dipotong Masa Jan s/d Nov})$$

#### Tabel Tarif Progresif Pasal 17 ayat (1) huruf a UU HPP (Berlaku 2024–2026)
| Lapisan | Rentang Penghasilan Kena Pajak (PKP) Tahunan (Rp) | Tarif Pajak (%) |
|---------|---------------------------------------------------|-----------------|
| **I** | Rp0 s/d Rp60.000.000 | 5% |
| **II** | > Rp60.000.000 s/d Rp250.000.000 | 15% |
| **III** | > Rp250.000.000 s/d Rp500.000.000 | 25% |
| **IV** | > Rp500.000.000 s/d Rp5.000.000.000 | 30% |
| **V** | > Rp5.000.000.000 | 35% |

#### Formula Penentuan PKP Tahunan:
1. **Penghasilan Bruto Setahun** = Total Gaji Pokok + Tunjangan Tetap & Tidak Tetap + Lembur + Premi JKK + Premi JKM + Premi BPJS Kesehatan (4% pemberi kerja) + Bonus/THR + Natura Objek Pajak.
2. **Pengurang Penghasilan Bruto**:
   - **Biaya Jabatan**: $5\% \times \text{Penghasilan Bruto}$, maksimal **Rp500.000 per bulan** atau **Rp6.000.000 per tahun**.
   - **Iuran Pensiun & Jaminan Hari Tua**: Iuran JHT pekerja (2%) + Iuran JP pekerja (1%) yang dibayarkan oleh karyawan ke BPJS Ketenagakerjaan atau dana pensiun yang disahkan OJK/Kemenkeu.
3. **Penghasilan Neto Setahun** = Penghasilan Bruto Setahun - Biaya Jabatan - Iuran JHT/JP Pekerja.
4. **Penghasilan Kena Pajak (PKP)** = Penghasilan Neto Setahun - PTKP.
   - *Aturan Pembulatan*: Nilai PKP dibulatkan ke bawah hingga ribuan penuh (contoh: Rp45.678.900 menjadi Rp45.678.000).
5. **Kelebihan Potong (Lebih Bayar PPh 21)**: Jika PPh 21 terutang setahun ternyata lebih kecil daripada jumlah PPh 21 yang telah dipotong pada bulan Januari s/d November (bisa terjadi jika karyawan memiliki fluktuasi bonus/lembur atau resign di pertengahan tahun), maka perusahaan **wajib mengembalikan kelebihan potong pajak tersebut kepada pegawai** bersamaan dengan pembayaran gaji masa terakhir, dan perusahaan melakukan kompensasi kelebihan setor pada SPT Masa PPh 21.

---

### 2.6 Biaya Jabatan & Iuran Pengurang
- **Biaya Jabatan**:
  - Diberikan kepada setiap pegawai tetap tanpa melihat jabatan/level pekerjaan.
  - Besaran: 5% dari Penghasilan Bruto.
  - Plafon maksimum: Rp500.000 / bulan atau Rp6.000.000 / tahun.
  - Jika pegawai mulai bekerja di pertengahan tahun (misal Juli / 6 bulan), plafon biaya jabatannya adalah $6 \times \text{Rp500.000} = \text{Rp3.000.000}$.
- **Iuran yang Boleh Dikurangkan**:
  - Iuran JHT porsi pekerja (2% dari Upah).
  - Iuran JP porsi pekerja (1% dari Upah s/d batas upah tertinggi).
  - Iuran dana pensiun mandiri yang dibayar pegawai ke lembaga pengelola dana pensiun yang disahkan pemerintah.
- **Iuran yang TIDAK Boleh Dikurangkan**:
  - Iuran BPJS Kesehatan porsi pekerja (1%).
  - Zakat/sumbangan keagamaan sukarela yang tidak dibayarkan melalui badan amil resmi yang disahkan pemerintah.

---

### 2.7 Bukan Pegawai, Pesangon Final, dan Natura (PMK 66/2023)

#### A. Bukan Pegawai (Freelancer / Tenaga Ahli / Konsultan)
Berdasarkan PMK 168/2023 Pasal 3 ayat (1) huruf c:
- Dasar Pengenaan Pajak (DPP) = **50% dari Penghasilan Bruto**.
- Pemotongan PPh 21 = $\text{Tarif Progresif Pasal 17} \times (50\% \times \text{Penghasilan Bruto})$.
- Tarif progresif diterapkan secara kumulatif untuk pembayaran dalam tahun kalender yang sama.
- Catatan: Ketentuan PTKP bulanan tidak lagi berlaku bagi Bukan Pegawai, sehingga seluruh penghasilan langsung dipotong dengan rumus di atas.

#### B. Uang Pesangon yang Dibayarkan Sekaligus (PP No. 68/2009)
Pemotongan PPh 21 atas uang pesangon yang dibayarkan sekaligus bersifat **FINAL**:
| Lapisan Penghasilan Bruto Pesangon (Rp) | Tarif Final (%) |
|-----------------------------------------|-----------------|
| s/d Rp50.000.000 | **0%** |
| > Rp50.000.000 s/d Rp100.000.000 | **5%** |
| > Rp100.000.000 s/d Rp500.000.000 | **15%** |
| > Rp500.000.000 | **25%** |

*Ketentuan Jangka Waktu Pembayaran*: Jika uang pesangon dibayarkan secara bertahap dalam jangka waktu melebihi 2 (dua) tahun kalender, pemotongan PPh 21 pada tahun ke-3 dan seterusnya diperlakukan sebagai penghasilan tidak final dengan tarif Pasal 17 UU HPP.

#### C. Natura dan/atau Kenikmatan (PMK No. 66/2023)
Natura (barang/imbalan non-kas) dan Kenikmatan (fasilitas pelayanan) per 1 Juli 2023 pada prinsipnya merupakan objek PPh 21, KECUALI yang dikecualikan oleh peraturan perundang-undangan:
- **Natura Non-Objek Pajak (Bebas PPh 21)**:
  1. Makanan dan minuman yang disediakan bagi seluruh pegawai di tempat kerja, atau kupon makan bagi pegawai dinas luar (maksimal setara biaya makan di kantor atau Rp2.000.000/bulan).
  2. Natura di daerah tertentu (lokasi terpencil/pertambangan/perkebunan).
  3. Sarana dan perlengkapan kerja K3 (seragam, alat pelindung diri, helm, rompi pengaman).
  4. Bingkisan Hari Raya Keagamaan (Idul Fitri, Natal, Waisak, Nyepi, Imlek) untuk seluruh pegawai (tanpa batasan nilai).
  5. Bingkisan selain hari raya keagamaan maksimal Rp3.000.000 per tahun per pegawai.
  6. Fasilitas olahraga (selain golf, pacuan kuda, dayung, terbang layang, dan balap otomotif) maksimal Rp1.500.000 per tahun per pegawai.
  7. Fasilitas tempat tinggal komunal/asrama (mess karyawan).
  8. Fasilitas kendaraan dinas bagi pegawai yang bukan pemegang saham/manajemen puncak yang menerima tunjangan sewa mobil.
- **Natura Objek Pajak**: Fasilitas di luar pengecualian atau yang melebihi nilai ambang batas (threshold) dinilai berdasarkan nilai pasar atau biaya riil yang dikeluarkan perusahaan, lalu **ditambahkan ke Penghasilan Bruto PPh 21** karyawan pada bulan penerimaan natura tersebut.

---

### 2.8 Skema Pemotongan: Gross, Gross-Up, dan Net

| Skema | Mekanisme Beban Pajak | Perlakuan Akuntansi & Perpajakan Perusahaan | Rumus pada Payroll Engine |
|-------|-----------------------|---------------------------------------------|---------------------------|
| **Gross** | PPh 21 ditanggung penuh oleh Karyawan (dipotong dari gaji). | Gaji pokok + tunjangan menjadi beban gaji (deductible). | $\text{Take Home Pay} = \text{Gaji Bruto} - \text{PPh 21} - \text{Iuran BPJS Karyawan}$ |
| **Gross-Up** | Perusahaan memberikan **Tunjangan Pajak** sebesar nilai PPh 21 yang terutang. | Tunjangan pajak menjadi komponen biaya gaji pegawai (deductible expense bagi perusahaan). | Menggunakan kalkulasi aljabar/iteratif sehingga $\text{Tunjangan Pajak} = \text{PPh 21}(\text{Gaji Pokok} + \text{Tunjangan Pajak})$. |
| **Net** | Perusahaan menanggung PPh 21 karyawan tanpa memberikan tunjangan pajak eksplisit pada slip gaji. | Beban PPh 21 yang ditanggung perusahaan menjadi biaya non-deductible (koreksi fiskal positif) bagi perusahaan. | Slip gaji menampilkan Take Home Pay utuh tanpa potongan PPh 21. |

---

## 3. BPJS KETENAGAKERJAAN

Berdasarkan UU No. 24/2011, PP No. 44/2015, PP No. 45/2015, dan PP No. 46/2015, kepesertaan BPJS Ketenagakerjaan bagi pekerja penerima upah (PU) mencakup 4 program wajib dan 1 program tambahan (JKP):

### 3.1 Program Jaminan & Tarif Iuran

| Program Jaminan | Ditanggung Pemberi Kerja (%) | Ditanggung Pekerja (%) | Total Iuran (%) | Dasar Perhitungan Upah | Sifat Iuran |
|-----------------|------------------------------|------------------------|-----------------|------------------------|-------------|
| **JKK (Jaminan Kecelakaan Kerja)** | 0.24% – 1.74% *(5 Kelas)* | 0.00% | 0.24% – 1.74% | Upah Pokok + Tunjangan Tetap | Wajib |
| **JKM (Jaminan Kematian)** | 0.30% | 0.00% | 0.30% | Upah Pokok + Tunjangan Tetap | Wajib |
| **JHT (Jaminan Hari Tua)** | 3.70% | 2.00% | 5.70% | Upah Pokok + Tunjangan Tetap | Wajib |
| **JP (Jaminan Pensiun)** | 2.00% | 1.00% | 3.00% | Upah Pokok + Tunjangan Tetap *(Dibatasi Capping)* | Wajib (kecuali non-formal) |
| **JKP (Jaminan Kehilangan Pekerjaan)** | 0.24% *(Rekomposisi JKK/JKM)* + 0.22% APBN | 0.00% | 0.46% | Dibiayai iuran rekomposisi dan APBN | Otomatis aktif jika ikut JKN+JHT+JP |

#### 5 Tingkat Risiko JKK (PP No. 44/2015 Lampiran II):
1. **Tingkat Risiko Sangat Rendah (Kelompok I)**: **0.24%** (Contoh: Kantor konsultan, software house, perbankan, akuntan).
2. **Tingkat Risiko Rendah (Kelompok II)**: **0.54%** (Contoh: Industri tekstil, retail, perdagangan grosir, restoran).
3. **Tingkat Risiko Sedang (Kelompok III)**: **0.89%** (Contoh: Industri kaca, percetakan, makanan olahan, transportasi darat).
4. **Tingkat Risiko Tinggi (Kelompok IV)**: **1.27%** (Contoh: Industri kimia, perkayuan, permesinan berat, galangan kapal).
5. **Tingkat Risiko Sangat Tinggi (Kelompok V)**: **1.74%** (Contoh: Pertambangan batu bara, konstruksi gedung/jembatan, peledakan).

---

### 3.2 Capping Upah Jaminan Pensiun (JP) 2024–2026
Sesuai amanat PP No. 45/2015 Pasal 29 ayat (2), batas tertinggi upah sebagai dasar perhitungan iuran Jaminan Pensiun (JP) disesuaikan setiap tahun menggunakan faktor pengali rasio pertumbuhan PDB tahun sebelumnya:
- **Tahun 2024 (Mulai 1 Maret 2024)**: **Rp10.042.300 / bulan**.
  - Iuran Maksimal JP Pemberi Kerja (2%): $2\% \times \text{Rp10.042.300} = \text{Rp200.846}$
  - Iuran Maksimal JP Pekerja (1%): $1\% \times \text{Rp10.042.300} = \text{Rp100.423}$
- **Tahun 2025 (Estimasi Penyesuaian Tahunan)**: **Rp10.547.400 / bulan**.
  - Iuran Maksimal JP Pemberi Kerja (2%): $2\% \times \text{Rp10.547.400} = \text{Rp210.948}$
  - Iuran Maksimal JP Pekerja (1%): $1\% \times \text{Rp10.547.400} = \text{Rp105.474}$
- **Tahun 2026 (Estimasi)**: Menggunakan batas upah terbaru per pengumuman resmi BPJS Ketenagakerjaan (dikonfigurasi secara dinamis via tabel parameter sistem).

*Aturan Payroll Engine*:
```python
dasar_upah_jp = min(upah_pokok + tunjangan_tetap, capping_jp)
iuran_jp_perusahaan = 0.02 * dasar_upah_jp
iuran_jp_karyawan = 0.01 * dasar_upah_jp
```

---

### 3.3 Dampak Iuran BPJS TK terhadap Pajak PPh 21

| Komponen Iuran BPJS TK | Perlakuan terhadap Penghasilan Bruto PPh 21 | Perlakuan terhadap Pengurang Penghasilan Neto PPh 21 |
|-------------------------|---------------------------------------------|------------------------------------------------------|
| **JKK Perusahaan (0.24% - 1.74%)** | **MENAMBAH** Penghasilan Bruto | Tidak ada |
| **JKM Perusahaan (0.30%)** | **MENAMBAH** Penghasilan Bruto | Tidak ada |
| **JHT Perusahaan (3.70%)** | **TIDAK Menambah** Penghasilan Bruto (Bukan Objek Pajak) | Tidak ada |
| **JP Perusahaan (2.00%)** | **TIDAK Menambah** Penghasilan Bruto (Bukan Objek Pajak) | Tidak ada |
| **JHT Karyawan (2.00%)** | Tidak ada | **MENGURANGI** Penghasilan Bruto (Sebagai Pengurang Neto) |
| **JP Karyawan (1.00%)** | Tidak ada | **MENGURANGI** Penghasilan Bruto (Sebagai Pengurang Neto) |

---

## 4. BPJS KESEHATAN

Berdasarkan UU No. 24/2011, Perpres No. 82/2018, Perpres No. 75/2019, dan Perpres No. 64/2020:

### 4.1 Tarif Iuran & Batas Upah (Capping)
- **Total Iuran**: **5.00%** dari upah sebulan.
  - **Pemberi Kerja**: **4.00%**
  - **Pekerja**: **1.00%**
- **Batas Upah Tertinggi (Capping Maksimum)**: **Rp12.000.000 per bulan**.
  - Maksimal Iuran Pemberi Kerja (4%): $4\% \times \text{Rp12.000.000} = \text{Rp480.000}$
  - Maksimal Iuran Pekerja (1%): $1\% \times \text{Rp12.000.000} = \text{Rp120.000}$
  - Total Iuran Maksimal (5%): **Rp600.000 per bulan**.
- **Batas Upah Terendah**: Upah Minimum Provinsi (UMP) atau Upah Minimum Kabupaten/Kota (UMK) yang berlaku.

*Aturan Payroll Engine*:
```python
dasar_upah_kes = min(max(upah_pokok + tunjangan_tetap, umk_setempat), 12000000)
iuran_kes_perusahaan = 0.04 * dasar_upah_kes
iuran_kes_karyawan = 0.01 * dasar_upah_kes
```

### 4.2 Cakupan Anggota Keluarga & Iuran Tambahan
- Iuran 5% di atas mencakup **5 (lima) orang anggota keluarga**:
  1. Pekerja yang bersangkutan.
  2. Suami atau Istri yang sah.
  3. Maksimal 3 (tiga) orang anak yang sah (belum menikah, belum memiliki penghasilan sendiri, dan belum berusia 21 tahun atau belum berusia 25 tahun jika masih menempuh pendidikan formal).
- **Penambahan Anggota Keluarga Tambahan** (anak ke-4 dst, orang tua kandung, atau mertua):
  - Dikenakan iuran tambahan sebesar **1.00% per orang per bulan** dari dasar upah BPJS Kesehatan, yang dipotong langsung dari upah pekerja.

### 4.3 Dampak Pajak PPh 21
- **Iuran 4% yang dibayar oleh Pemberi Kerja** merupakan premi asuransi kesehatan yang dinikmati pekerja, sehingga **MENAMBAH Penghasilan Bruto PPh 21**.
- **Iuran 1% yang dibayar oleh Pekerja** **TIDAK MENGURANGI** penghasilan bruto (tidak boleh dijadikan pengurang penghasilan neto dalam perhitungan PPh 21).

---

## 5. UPAH MINIMUM & STRUKTUR KOMPONEN UPAH

### 5.1 Komposisi Upah Pokok & Tunjangan (Pasal 94 UU Ketenagakerjaan)
Berdasarkan Pasal 94 UU No. 13/2003 jo. UU No. 6/2023 jo. PP No. 36/2021:
- Komponen upah terdiri dari:
  1. **Upah Pokok (Basic Salary)**: Imbalan dasar yang dibayarkan kepada pekerja menurut tingkat atau jenis pekerjaan.
  2. **Tunjangan Tetap (Fixed Allowance)**: Pembayaran teratur yang tidak dipengaruhi kehadiran/performa (misal: tunjangan jabatan, tunjangan keluarga, tunjangan masa kerja).
  3. **Tunjangan Tidak Tetap (Variable Allowance)**: Pembayaran yang dikaitkan langsung dengan kehadiran atau pencapaian target (misal: uang makan harian berbasis absensi, uang transport harian).
- **Mandat Rasio Minimum**:
  $$\text{Upah Pokok} \ge 75\% \times (\text{Upah Pokok} + \text{Tunjangan Tetap})$$
  *Implikasi*: Tunjangan Tetap tidak boleh melebihi **25%** dari total upah tetap (Upah Pokok + Tunjangan Tetap).

### 5.2 Regulasi Upah Minimum & Putusan MK No. 168/PUU-XXI/2023
- **Ketentuan Upah Minimum**:
  - Upah Minimum Provinsi (UMP) dan Upah Minimum Kabupaten/Kota (UMK) merupakan jaring pengaman (*safety net*) yang **hanya berlaku bagi pekerja dengan masa kerja kurang dari 1 (satu) tahun**.
  - Bagi pekerja dengan masa kerja 1 tahun atau lebih, pengusaha wajib menerapkan **Struktur dan Skala Upah (SUSU)** yang mempertimbangkan kompetensi, golongan jabatan, masa kerja, dan kinerja.
- **Putusan Mahkamah Konstitusi No. 168/PUU-XXI/2023**:
  - Mahkamah Konstitusi menegaskan kembali bahwa formula penghitungan upah minimum harus mencakup komponen Kebutuhan Hidup Layak (KHL), pertumbuhan ekonomi, dan inflasi, serta mengembalikan peran aktif Dewan Pengupahan Daerah dalam memberikan rekomendasi upah minimum kepada Gubernur.

### 5.3 Pengecualian Usaha Mikro dan Kecil (UMK)
Berdasarkan PP No. 36/2021 Pasal 36:
- Usaha Mikro dan Kecil (UMK) **dikecualikan dari ketentuan Upah Minimum**.
- Upah pada Usaha Mikro dan Kecil disepakati secara tertulis antara pengusaha dan pekerja, dengan batas bawah:
  1. Paling sedikit **50% dari rata-rata konsumsi masyarakat** di tingkat provinsi; dan
  2. Nilai upah yang disepakati minimal **25% di atas garis kemiskinan** di tingkat provinsi.

---

## 6. TUNJANGAN HARI RAYA (THR) KEAGAMAAN

### 6.1 Syarat, Waktu Pembayaran & Formula Prorata
Berdasarkan **Permenaker No. 6 Tahun 2016**:
1. **Penerima Berhak**: Pekerja yang telah mempunyai masa kerja minimal 1 (satu) bulan secara terus-menerus pada hubungan kerja PKWT maupun PKWTT.
2. **Batas Waktu Pembayaran**: Wajib dibayarkan paling lambat **7 (tujuh) hari kalender sebelum hari raya keagamaan (H-7)**.
3. **Formula Perhitungan**:
   - **Masa Kerja $\ge$ 12 Bulan Terus-Menerus**:
     $$\text{THR} = 1 \times \text{Upah Sebulan} = \text{Upah Pokok} + \text{Tunjangan Tetap}$$
   - **Masa Kerja 1 Bulan s/d < 12 Bulan**:
     $$\text{THR} = \frac{\text{Masa Kerja (Bulan)}}{12} \times (\text{Upah Pokok} + \text{Tunjangan Tetap})$$

### 6.2 Pekerja Lepas / Harian / Borongan
- **Masa Kerja $\ge$ 12 Bulan**: Upah sebulan dihitung berdasarkan **rata-rata upah yang diterima dalam 12 (dua belas) bulan terakhir** sebelum hari raya.
- **Masa Kerja < 12 Bulan**: Upah sebulan dihitung berdasarkan **rata-rata upah yang diterima tiap bulan selama masa kerja**.

### 6.3 Perhitungan PPh 21 atas THR
Sesuai PMK 168/2023, PPh 21 atas THR dihitung dengan menggabungkan penghasilan reguler dan THR pada bulan pembayaran THR, kemudian dikenakan TER Bulanan yang sesuai dengan total bruto tersebut:

$$\text{Bruto Bulan THR} = \text{Gaji Reguler} + \text{Premi BPJS Perusahaan} + \text{THR}$$
$$\text{PPh 21 Bulan THR} = \text{Tarif TER Bulanan (berdasarkan Bruto Bulan THR)} \times \text{Bruto Bulan THR}$$

---

## 7. PERHITUNGAN UPAH KERJA LEMBUR (OVERTIME)

Berdasarkan **PP No. 35 Tahun 2021**:

### 7.1 Dasar Perhitungan Upah Sejam (1/173)
Upah sejam kerja lembur dihitung dengan rumus:
$$\text{Upah Sejam Lembur} = \frac{1}{173} \times \text{Upah Sebulan}$$

*Ketentuan Komponen Upah Sebulan untuk Lembur*:
1. Jika upah terdiri dari **Upah Pokok dan Tunjangan Tetap**, maka upah sebulan adalah $100\% \times (\text{Upah Pokok} + \text{Tunjangan Tetap})$.
2. Jika upah terdiri dari **Upah Pokok, Tunjangan Tetap, dan Tunjangan Tidak Tetap**, dan jumlah (Upah Pokok + Tunjangan Tetap) kurang dari 75% dari total upah, maka dasar perhitungan lembur adalah **75% dari total upah**.

---

### 7.2 Tabel Multiplier Lembur: Hari Kerja vs Hari Libur (5 & 6 Hari Kerja)

#### A. Lembur pada Hari Kerja Biasa
| Jam Lembur | Multiplier / Faktor Pengali Upah Sejam |
|------------|---------------------------------------|
| **Jam Pertama (Jam ke-1)** | **1.5x** Upah Sejam |
| **Jam Berikutnya (Jam ke-2, ke-3, ke-4)** | **2.0x** Upah Sejam per jam |

#### B. Lembur pada Hari Istirahat Mingguan / Libur Resmi — Sistem 5 Hari Kerja (40 Jam/Minggu)
| Jam Lembur | Multiplier / Faktor Pengali Upah Sejam |
|------------|---------------------------------------|
| **Jam ke-1 s/d Jam ke-8** | **2.0x** Upah Sejam per jam |
| **Jam ke-9** | **3.0x** Upah Sejam |
| **Jam ke-10, ke-11, ke-12** | **4.0x** Upah Sejam per jam |

#### C. Lembur pada Hari Istirahat Mingguan / Libur Resmi — Sistem 6 Hari Kerja (40 Jam/Minggu)
| Jam Lembur | Multiplier / Faktor Pengali Upah Sejam |
|------------|---------------------------------------|
| **Jam ke-1 s/d Jam ke-7** | **2.0x** Upah Sejam per jam |
| **Jam ke-8** | **3.0x** Upah Sejam |
| **Jam ke-9, ke-10, ke-11** | **4.0x** Upah Sejam per jam |

#### D. Lembur pada Hari Libur Resmi yang Jatuh pada Hari Kerja Terpendek (Contoh: Jumat 5 Jam pada Sistem 6 Hari Kerja)
| Jam Lembur | Multiplier / Faktor Pengali Upah Sejam |
|------------|---------------------------------------|
| **Jam ke-1 s/d Jam ke-5** | **2.0x** Upah Sejam per jam |
| **Jam ke-6** | **3.0x** Upah Sejam |
| **Jam ke-7, ke-8** | **4.0x** Upah Sejam per jam |

---

### 7.3 Batasan Jam Kerja & Kewajiban Administratif (SPKL)
- **Batas Maksimum Lembur**: Paling banyak **4 (empat) jam dalam 1 (satu) hari** dan **18 (delapan belas) jam dalam 1 (satu) minggu** (tidak termasuk kerja lembur pada hari istirahat mingguan atau libur resmi).
- **Kewajiban Pengusaha**:
  1. Menerbitkan **Surat Perintah Kerja Lembur (SPKL)** tertulis/digital yang disetujui pekerja.
  2. Memberikan istirahat secukupnya.
  3. Menyediakan makanan dan minuman sekurang-kurangnya **1.400 kkal** apabila kerja lembur berlangsung selama **4 (empat) jam atau lebih** (tidak boleh diganti dengan uang).

---

## 8. CUTI & IZIN KHUSUS BERBAYAR

### 8.1 Cuti Tahunan & Hak Upah Penuh
Berdasarkan Pasal 79 UU No. 13/2003 jo. UU No. 6/2023:
- Pekerja berhak atas cuti tahunan sekurang-kurangnya **12 (dua belas) hari kerja** setelah bekerja selama 12 (dua belas) bulan secara terus-menerus.
- Selama menjalankan cuti tahunan, pekerja berhak menerima upah penuh (100%).

### 8.2 Cuti Melahirkan / Maternitas (UU KIA No. 4/2024)
Berdasarkan **UU No. 4 Tahun 2024 tentang Kesejahteraan Ibu dan Anak pada Fase Seribu Hari Pertama Kehidupan** (Pasal 4 dan Pasal 5):
1. **Durasi Hak Cuti**:
   - Hak dasar: **Paling sedikit 3 (tiga) bulan**.
   - Hak perpanjangan: Dapat diperpanjang hingga **paling lama 3 (tiga) bulan berikutnya (total 6 bulan)** apabila terdapat kondisi khusus yang dibuktikan dengan surat keterangan dokter (misal komplikasi pascapersalinan atau gangguan kesehatan bayi).
2. **Ketentuan Pembayaran Upah Selama Cuti Melahirkan**:
   - **Bulan ke-1 s/d Bulan ke-3**: **100% Upah Penuh**
   - **Bulan ke-4**: **100% Upah Penuh**
   - **Bulan ke-5**: **75% Upah**
   - **Bulan ke-6**: **75% Upah**
3. **Perlindungan Hubungan Kerja**: Pengusaha **dilarang memberhentikan (PHK)** pekerja perempuan yang sedang mengambil cuti melahirkan.

### 8.3 Cuti Keguguran & Cuti Haid
- **Cuti Keguguran Kandungan**: Istirahat **1.5 (satu setengah) bulan** (45 hari) atau sesuai surat keterangan dokter spesialis kebidanan/bidan. Upah dibayar 100%.
- **Cuti Haid**: Pekerja perempuan yang merasakan sakit saat haid dan memberitahukan kepada pengusaha tidak wajib bekerja pada **hari pertama dan kedua haid** dengan upah dibayar penuh (100%).

### 8.4 Izin Khusus Berbayar (Pasal 93 ayat 4 UU Ketenagakerjaan)
Pekerja tetap berhak atas upah penuh saat tidak masuk kerja karena alasan penting keluarga:
| Alasan Izin Khusus | Durasi Hak Cuti Berbayar |
|--------------------|--------------------------|
| Pekerja menikah | **3 (tiga) hari** |
| Menikahkan anaknya | **2 (dua) hari** |
| Mengkhitankan anaknya | **2 (dua) hari** |
| Membaptiskan anaknya | **2 (dua) hari** |
| Istri melahirkan atau keguguran kandungan (Cuti Suami) | **2 (dua) hari** *(dapat ditambah sesuai kesepakatan/UU KIA)* |
| Suami/Istri, Orang Tua/Mertua, atau Anak/Menantu meninggal dunia | **2 (dua) hari** |
| Anggota keluarga dalam satu rumah meninggal dunia | **1 (satu) hari** |
| Melaksanakan kewajiban ibadah keagamaan (Haji/Umrah pertama kali) | Sesuai waktu yang ditentukan pemerintah/agama |

---

## 9. STATUS HUBUNGAN KERJA, KOMPENSASI PKWT & PESANGON PHK

### 9.1 PKWT vs PKWTT & Syarat Percobaan
Berdasarkan PP No. 35 Tahun 2021:
| Parameter | PKWT (Kontrak Tertentu) | PKWTT (Tetap) |
|-----------|-------------------------|---------------|
| **Jangka Waktu Maksimum** | Maksimal 5 tahun (termasuk seluruh perpanjangan). | Tidak ada batasan waktu (hingga pensiun/PHK). |
| **Masa Percobaan (Probation)** | **DILARANG**. Jika dicantumkan, batal demi hukum dan masa kerja tetap dihitung. | Diperbolehkan maksimal 3 (tiga) bulan dengan upah minimal upah minimum. |
| **Kompensasi Berakhir Kontrak** | **WAJIB** diberikan Uang Kompensasi PKWT pada setiap akhir kontrak. | Tidak ada uang kompensasi kontrak. |
| **Kompensasi PHK** | Ganti rugi sisa masa kontrak (jika diputus sepihak) + Kompensasi masa kerja riil. | Uang Pesangon (UP) + UPMK + UPH sesuai formula alasan PHK. |

---

### 9.2 Formula Uang Kompensasi PKWT (PP 35/2021 Pasal 15 & 16)
Uang kompensasi wajib dibayarkan saat PKWT berakhir (atau setiap perpanjangan) kepada pekerja dengan masa kerja minimal 1 (satu) bulan terus-menerus:

$$\text{Uang Kompensasi PKWT} = \frac{\text{Masa Kerja Riil (Bulan)}}{12} \times 1 \text{ Bulan Upah}$$

*Komponen Upah*: Upah Pokok + Tunjangan Tetap. (Bagi Usaha Mikro dan Kecil, besaran uang kompensasi ditentukan berdasarkan kesepakatan antara pengusaha dan pekerja).

---

### 9.3 Formula Pesangon (UP), UPMK, UPH & Faktor Pengali PHK

#### A. Tabel Uang Pesangon (UP) — PP 35/2021 Pasal 40 ayat (2)
| Masa Kerja | Besaran Uang Pesangon (UP) |
|------------|----------------------------|
| < 1 tahun | 1 bulan upah |
| 1 tahun s/d < 2 tahun | 2 bulan upah |
| 2 tahun s/d < 3 tahun | 3 bulan upah |
| 3 tahun s/d < 4 tahun | 4 bulan upah |
| 4 tahun s/d < 5 tahun | 5 bulan upah |
| 5 tahun s/d < 6 tahun | 6 bulan upah |
| 6 tahun s/d < 7 tahun | 7 bulan upah |
| 7 tahun s/d < 8 tahun | 8 bulan upah |
| $\ge$ 8 tahun | **9 bulan upah (maksimal)** |

#### B. Tabel Uang Penghargaan Masa Kerja (UPMK) — PP 35/2021 Pasal 40 ayat (3)
| Masa Kerja | Besaran UPMK |
|------------|--------------|
| 3 tahun s/d < 6 tahun | 2 bulan upah |
| 6 tahun s/d < 9 tahun | 3 bulan upah |
| 9 tahun s/d < 12 tahun | 4 bulan upah |
| 12 tahun s/d < 15 tahun | 5 bulan upah |
| 15 tahun s/d < 18 tahun | 6 bulan upah |
| 18 tahun s/d < 21 tahun | 7 bulan upah |
| 21 tahun s/d < 24 tahun | 8 bulan upah |
| $\ge$ 24 tahun | **10 bulan upah (maksimal)** |

#### C. Uang Penggantian Hak (UPH) — PP 35/2021 Pasal 40 ayat (4)
1. Cuti tahunan yang belum diambil dan belum gugur.
2. Biaya atau ongkos pulang untuk pekerja dan keluarganya ke tempat di mana pekerja diterima bekerja.
3. Hal-hal lain yang ditetapkan dalam Perjanjian Kerja (PK), Peraturan Perusahaan (PP), atau Perjanjian Kerja Bersama (PKB).

#### D. Matriks Faktor Pengali PHK Berdasarkan Alasan PHK (PP 35/2021)
| Alasan Pemutusan Hubungan Kerja (PHK) | Formula Kompensasi PHK |
|---------------------------------------|------------------------|
| **Efisiensi karena perusahaan mengalami kerugian** (Pasal 43 ayat 1) | $0.5 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Efisiensi untuk mencegah kerugian** (Pasal 43 ayat 2) | $1.0 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Perusahaan tutup / force majeure** (Pasal 44, 45) | $0.5 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Perusahaan Pailit** (Pasal 47) | $0.5 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Pekerja Meninggal Dunia** (Pasal 57) | $2.0 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Pekerja Memasuki Usia Pensiun** (Pasal 56) | $1.75 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Pekerja Sakit Berkepanjangan / Cacat Total > 12 Bulan** (Pasal 55) | $2.0 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Pekerja Melakukan Pelanggaran (setelah SP1, SP2, SP3)** (Pasal 52) | $0.5 \times \text{UP} + 1.0 \times \text{UPMK} + \text{UPH}$ |
| **Pekerja Mengundurkan Diri Sukarela (Resign)** (Pasal 50) | $\text{UPH} + \text{Uang Pisah}$ (sesuai PP/PKB) |

---

## 10. SIMULASI & CONTOH PERHITUNGAN NUMERIK REALISTIS

---

### 10.1 Kasus 1: Karyawan Tetap (Gaji Reguler + Lembur + BPJS + PPh 21 TER B & Masa Desember)

#### Profil Karyawan:
- **Nama**: Budi Santoso (Pegawai Tetap PKWTT)
- **Gaji Pokok**: Rp8.500.000 / bulan
- **Tunjangan Tetap (Jabatan)**: Rp1.500.000 / bulan
- **Total Upah Tetap**: Rp10.000.000 / bulan
- **Status PTKP**: K/1 (Kawin, 1 Anak) $\rightarrow$ **TER Kategori B** (Nilai PTKP Tahunan = Rp63.000.000)
- **Tingkat Risiko JKK**: Kelompok I (0.24%)
- **Data Lembur Bulan Januari**: 10 jam lembur pada hari kerja biasa (10 hari @ 1 jam/hari)
- **Capping JP 2024**: Rp10.042.300 (Upah Rp10.000.000 < Capping, sehingga menggunakan Rp10.000.000)
- **Capping BPJS Kes**: Rp12.000.000 (Upah Rp10.000.000 < Capping, sehingga menggunakan Rp10.000.000)

---

#### Langkah 1: Perhitungan Upah Lembur (Bulan Januari)
- Upah Sejam Lembur = $\frac{1}{173} \times \text{Rp10.000.000} = \text{Rp57.803,47}$
- Karena 10 hari masing-masing 1 jam (jam pertama), pengalinya adalah $1.5\times$:
  $$\text{Total Jam Upah Lembur} = 10 \times 1.5 = 15 \text{ Jam}$$
  $$\text{Upah Lembur Januari} = 15 \times \text{Rp57.803,47} = \text{Rp867.052}$$

---

#### Langkah 2: Perhitungan Iuran BPJS Ketenagakerjaan & BPJS Kesehatan (Januari)
1. **Ditanggung Pemberi Kerja (Perusahaan)**:
   - JKK (0.24%): $0.24\% \times \text{Rp10.000.000} = \text{Rp24.000}$
   - JKM (0.30%): $0.30\% \times \text{Rp10.000.000} = \text{Rp30.000}$
   - JHT (3.70%): $3.70\% \times \text{Rp10.000.000} = \text{Rp370.000}$
   - JP (2.00%): $2.00\% \times \text{Rp10.000.000} = \text{Rp200.000}$
   - BPJS Kesehatan (4.00%): $4.00\% \times \text{Rp10.000.000} = \text{Rp400.000}$
   - **Total Beban BPJS Perusahaan**: $\text{Rp1.024.000}$

2. **Ditanggung Pekerja (Karyawan - Potongan Gaji)**:
   - JHT (2.00%): $2.00\% \times \text{Rp10.000.000} = \text{Rp200.000}$
   - JP (1.00%): $1.00\% \times \text{Rp10.000.000} = \text{Rp100.000}$
   - BPJS Kesehatan (1.00%): $1.00\% \times \text{Rp10.000.000} = \text{Rp100.000}$
   - **Total Potongan BPJS Karyawan**: $\text{Rp400.000}$

---

#### Langkah 3: Perhitungan Penghasilan Bruto PPh 21 Bulan Januari
$$\text{Penghasilan Bruto PPh 21} = \text{Gaji Pokok} + \text{Tunj. Tetap} + \text{Lembur} + \text{JKK Perusahaan} + \text{JKM Perusahaan} + \text{BPJS Kes Perusahaan}$$
$$\text{Penghasilan Bruto PPh 21} = 8.500.000 + 1.500.000 + 867.052 + 24.000 + 30.000 + 400.000 = \mathbf{Rp11.321.052}$$

---

#### Langkah 4: Pemotongan PPh 21 Masa Reguler (Januari) via TER Kategori B
- Status K/1 $\rightarrow$ **TER Kategori B**.
- Penghasilan Bruto: **Rp11.321.052**.
- Berdasarkan Tabel TER B: Rentang `> Rp11.250.000 s/d Rp11.600.000` dikenakan tarif **2.50%**.
- **PPh 21 Januari**:
  $$\text{PPh 21 Januari} = 2.50\% \times \text{Rp11.321.052} = \mathbf{Rp283.026}$$

---

#### Langkah 5: Take Home Pay (THP) Bulan Januari
$$\text{Gaji Kotor Karyawan (Earning)} = \text{Gaji Pokok} + \text{Tunjangan} + \text{Lembur} = 8.500.000 + 1.500.000 + 867.052 = \text{Rp10.867.052}$$
$$\text{Total Potongan} = \text{BPJS Karyawan} + \text{PPh 21} = 400.000 + 283.026 = \text{Rp683.026}$$
$$\mathbf{Take\ Home\ Pay\ (THP)} = 10.867.052 - 683.026 = \mathbf{Rp10.184.026}$$

---

#### Langkah 6: Rekonsiliasi Akhir Tahun (Masa Pajak Desember)
*Asumsi*: Selama Februari s/d November (10 bulan), Budi menerima gaji tetap tanpa lembur.
- Bruto reguler per bulan (Feb–Nov) = $10.000.000 + 24.000 + 30.000 + 400.000 = \text{Rp10.454.000}$.
- Tarif TER B untuk Rp10.454.000 (rentang `> Rp9.200.000 s/d Rp10.750.000`) = **1.50%**.
- PPh 21 per bulan (Feb–Nov) = $1.50\% \times \text{Rp10.454.000} = \text{Rp156.810}$ per bulan.
- Total PPh 21 dipotong Jan s/d Nov (11 bulan) = $283.026 + (10 \times 156.810) = 283.026 + 1.568.100 = \mathbf{Rp1.851.126}$.

**Perhitungan PPh 21 Tahunan (Desember) Berdasarkan Tarif Pasal 17 UU HPP**:
1. **Total Penghasilan Bruto Setahun (12 bulan)**:
   - Januari: Rp11.321.052
   - Feb s/d Des (11 bulan @ Rp10.454.000): Rp115.000.000 (Gaji Rp110 jt + JKK/JKM/Kes Rp4.994.000)
   - Total Bruto Setahun = $11.321.052 + (11 \times 10.454.000) = \mathbf{Rp126.315.052}$.
2. **Pengurang Penghasilan Bruto**:
   - Biaya Jabatan (5% x Rp126.315.052 = Rp6.315.752, dibatasi maksimal) = **Rp6.000.000**.
   - Iuran JHT Karyawan Setahun ($12 \times \text{Rp200.000}$) = **Rp2.400.000**.
   - Iuran JP Karyawan Setahun ($12 \times \text{Rp100.000}$) = **Rp1.200.000**.
   - Total Pengurang = $6.000.000 + 2.400.000 + 1.200.000 = \mathbf{Rp9.600.000}$.
3. **Penghasilan Neto Setahun**:
   $$\text{Neto Setahun} = 126.315.052 - 9.600.000 = \mathbf{Rp116.715.052}$$
4. **Penghasilan Kena Pajak (PKP)**:
   $$\text{PKP} = \text{Neto Setahun} - \text{PTKP K/1 (Rp63.000.000)}$$
   $$\text{PKP} = 116.715.052 - 63.000.000 = 53.715.052 \rightarrow \mathbf{Rp53.715.000}\text{ (dibulatkan ke ribuan penuh)}$$
5. **PPh 21 Terutang Setahun (Pasal 17)**:
   $$\text{Lapisan 1 (5%)} = 5\% \times \text{Rp53.715.000} = \mathbf{Rp2.685.750}$$
6. **PPh 21 Masa Desember**:
   $$\text{PPh 21 Masa Desember} = \text{PPh 21 Setahun} - \text{PPh 21 Dipotong Jan–Nov}$$
   $$\text{PPh 21 Masa Desember} = 2.685.750 - 1.851.126 = \mathbf{Rp834.624}$$

---

### 10.2 Kasus 2: Karyawan Tetap Menerima Gaji + THR (Pajak Bulan Biasa vs Bulan THR TER A)

#### Profil Karyawan:
- **Nama**: Siti Rahmawati (Pegawai Tetap PKWTT)
- **Gaji Pokok**: Rp6.000.000 / bulan
- **Tunjangan Tetap**: Rp1.000.000 / bulan
- **Total Upah Sebulan**: Rp7.000.000 / bulan
- **Status PTKP**: TK/0 $\rightarrow$ **TER Kategori A** (PTKP = Rp54.000.000)
- **Masa Kerja**: 3 Tahun (Berhak atas 100% THR = Rp7.000.000)
- **Iuran Perusahaan**: JKK 0.24% (Rp16.800), JKM 0.30% (Rp21.000), BPJS Kes 4% (Rp280.000) $\rightarrow$ Total Premi Pajak = Rp317.800/bulan.

---

#### A. Perhitungan Bulan Biasa (Maret)
1. **Penghasilan Bruto PPh 21**:
   $$\text{Bruto Maret} = \text{Gaji Pokok} + \text{Tunjangan} + \text{Premi Perusahaan} = 6.000.000 + 1.000.000 + 317.800 = \mathbf{Rp7.317.800}$$
2. **Penentuan Tarif TER Kategori A**:
   - Berdasarkan Tabel TER A: Rentang `> Rp6.750.000 s/d Rp7.500.000` dikenakan tarif **1.25%**.
3. **PPh 21 Bulan Maret**:
   $$\text{PPh 21 Maret} = 1.25\% \times \text{Rp7.317.800} = \mathbf{Rp91.472}$$

---

#### B. Perhitungan Bulan Penerimaan THR (April)
1. **Penghasilan Bruto PPh 21 (Gaji + THR)**:
   $$\text{Bruto April} = \text{Gaji Bulanan (Rp7.000.000)} + \text{THR (Rp7.000.000)} + \text{Premi BPJS Perusahaan (Rp317.800)}$$
   $$\text{Bruto April} = \mathbf{Rp14.317.800}$$
2. **Penentuan Tarif TER Kategori A**:
   - Berdasarkan Tabel TER A: Rentang `> Rp13.750.000 s/d Rp15.100.000` dikenakan tarif **6.00%**.
3. **PPh 21 Bulan April**:
   $$\text{PPh 21 April} = 6.00\% \times \text{Rp14.317.800} = \mathbf{Rp859.068}$$
4. **Analisis Selisih Pajak Akibat THR**:
   - Pajak Tambahan atas THR = $\text{Rp859.068} - \text{Rp91.472} = \mathbf{Rp767.596}$.

---

### 10.3 Kasus 3: Karyawan PKWT Berakhir Kontrak + Lembur Libur Resmi (Kompensasi + Overtime)

#### Profil Karyawan:
- **Nama**: Doni Wijaya (Pegawai Kontrak PKWT)
- **Gaji Pokok**: Rp5.000.000 / bulan
- **Tunjangan Tetap**: Rp1.000.000 / bulan
- **Total Upah Sebulan**: Rp6.000.000 / bulan
- **Masa Kontrak**: 12 Bulan (1 Januari s/d 31 Desember)
- **Status Hubungan Kerja**: PKWT berakhir dan tidak diperpanjang.
- **Data Lembur Bulan Terakhir**: 8 jam lembur pada **Hari Libur Nasional Resmi** (Perusahaan menerapkan sistem 5 hari kerja).
- **Status PTKP**: TK/0 (TER Kategori A).

---

#### Langkah 1: Perhitungan Upah Lembur Hari Libur Resmi (8 Jam)
- Upah Sejam Lembur = $\frac{1}{173} \times \text{Rp6.000.000} = \text{Rp34.682,08}$
- Berdasarkan PP 35/2021 untuk sistem 5 hari kerja pada hari libur resmi:
  - Jam ke-1 s/d Jam ke-8 dibayar **2.0x** Upah Sejam per jam.
  $$\text{Total Jam Pengali} = 8 \times 2.0 = 16 \text{ Jam}$$
  $$\text{Upah Lembur Libur Resmi} = 16 \times \text{Rp34.682,08} = \mathbf{Rp554.913}$$

---

#### Langkah 2: Perhitungan Uang Kompensasi PKWT Berakhir
Berdasarkan PP 35/2021 Pasal 15:
$$\text{Uang Kompensasi} = \frac{\text{Masa Kerja (12 Bulan)}}{12} \times 1 \text{ Bulan Upah} = \frac{12}{12} \times \text{Rp6.000.000} = \mathbf{Rp6.000.000}$$

---

#### Langkah 3: Perlakuan Pajak PPh 21 atas Uang Kompensasi PKWT
- **Status Hukum**: Berdasarkan PMK 168/2023, Uang Kompensasi PKWT diperlakukan sebagai **Penghasilan Tidak Teratur Pegawai Tetap/Kontrak** (bukan pesangon final PP 68/2009, karena hubungan kerjanya adalah PKWT yang berakhir jangka waktunya, bukan PHK pesangon PKWTT).
- Uang Kompensasi digabungkan ke dalam Penghasilan Bruto Masa Terakhir dan dihitung dalam rekonsiliasi tahunan Pasal 17 UU HPP.

---

## 11. MATRIKS SPESIFIKASI FITUR DISCOVERED (TABEL STANDAR MINER)

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | PPh 21 | TER Bulanan Engine | Kalkulasi pemotongan PPh 21 masa reguler (Jan–Nov) secara otomatis sesuai PP 58/2023. | PTKP Status (TK/0–K/3), Penghasilan Bruto Bulanan | Tarif TER (%), Nilai Potongan PPh 21 (Rp) | Fallback ke 0% jika bruto <= PTKP bulanan; Reject jika bruto negatif. | PP 58/2023 & PMK 168/2023 |
| 2 | PPh 21 | Rekonsiliasi PPh 21 Masa Terakhir (Desember/Resign) | Menghitung PPh 21 tahunan menggunakan tarif progresif Pasal 17 ayat (1) huruf a UU HPP dan menghitung PPh 21 masa terakhir. | Total Bruto Setahun, PTKP, Iuran Pengurang (JHT/JP Karyawan), Akumulasi PPh 21 Jan–Nov | PPh 21 Terutang Setahun, PPh 21 Masa Desember, Status Kurang/Lebih Bayar | Generate tax refund record jika PPh 21 setahun < akumulasi Jan–Nov. | UU No. 7/2021 & PMK 168/2023 |
| 3 | PPh 21 | Skema Gross-Up Pajak Otomatis | Menghitung tunjangan pajak secara iteratif/aljabar sehingga THP karyawan tidak berkurang. | Gaji Pokok, Tunjangan, Status PTKP, Biaya BPJS | Tunjangan Pajak (Rp), Nilai PPh 21 Gross-up (Rp) | Error loop timeout jika formula tidak konvergen dalam 50 iterasi. | PMK 168/2023 & Best Practice Payroll |
| 4 | PPh 21 | TER Harian untuk Tenaga Lepas | Menghitung PPh 21 harian untuk pegawai tidak tetap dengan ambang batas Rp450.000 dan Rp2.500.000 per hari. | Upah Harian (Rp), Jumlah Hari Kerja | Tarif Harian (0% / 0.5% / Pasal 17), Nilai Pajak Harian | Switch ke TER Bulanan jika akumulasi sebulan > Rp2.500.000. | PMK 168/2023 Pasal 5 |
| 5 | PPh 21 | Pajak Pesangon Final PP 68/2009 | Menghitung PPh 21 final atas pesangon yang dibayarkan sekaligus dengan lapisan 0%, 5%, 15%, 25%. | Nilai Bruto Pesangon (Rp), Tahun Pembayaran | Tarif Final per Lapisan, Total PPh 21 Pesangon Final | Switch ke tarif progresif Pasal 17 jika pembayaran memasuki tahun ke-3. | PP No. 68/2009 |
| 6 | PPh 21 | Filter Natura Objek vs Non-Objek PMK 66/2023 | Memilah fasilitas/imbalan natura ke dalam non-objek pajak atau penambah bruto PPh 21. | Jenis Natura, Nilai Pasar/Biaya Riil, Kategori Karyawan | Status Objek Pajak (Ya/Tidak), Nilai Penambah Bruto | Validasi threshold nilai (misal bingkisan > Rp3 jt atau olahraga > Rp1,5 jt). | PMK No. 66/2023 |
| 7 | BPJS TK | Kalkulator Iuran JKK & JKM | Menghitung iuran JKK (0.24%–1.74%) dan JKM (0.30%) yang dibayar pemberi kerja dan menambahkan ke Bruto PPh 21. | Upah Pokok, Tunjangan Tetap, Tingkat Risiko Perusahaan (1–5) | Iuran JKK & JKM Perusahaan (Rp), Nilai Penambah Bruto Pajak | Validasi kelas risiko wajib terdefinisi pada profil entitas tenant. | PP No. 44/2015 |
| 8 | BPJS TK | Kalkulator Iuran JHT | Menghitung iuran JHT (3.7% perusahaan, 2.0% pekerja) tanpa batas plafon upah. | Upah Pokok, Tunjangan Tetap | Iuran JHT Perusahaan, Iuran JHT Pekerja (Pengurang Neto Pajak) | Reject jika persentase iuran diubah di luar standar regulasi. | PP No. 46/2015 |
| 9 | BPJS TK | Kalkulator Iuran JP dengan Dynamic Capping | Menghitung iuran JP (2% perusahaan, 1% pekerja) dengan batas upah maksimal tahunan (Rp10.042.300 / Rp10.547.400). | Upah Pokok, Tunjangan Tetap, Parameter Tahun Penggajian | Iuran JP Perusahaan, Iuran JP Pekerja (Pengurang Neto Pajak) | Auto-cap upah jika melebihi batas batas JP tahun berjalan. | PP No. 45/2015 |
| 10 | BPJS Kes | Kalkulator BPJS Kesehatan 5% | Menghitung iuran BPJS Kesehatan (4% perusahaan, 1% pekerja) dengan batas upah Rp12.000.000 dan batas bawah UMK. | Upah Pokok, Tunjangan Tetap, UMK Setempat | Iuran BPJS Kes Perusahaan (Penambah Bruto Pajak), Iuran BPJS Kes Pekerja | Auto-cap pada Rp12.000.000 jika upah > Rp12 jt; Auto-floor ke UMK jika upah < UMK. | Perpres 64/2020 |
| 11 | BPJS Kes | Penambahan Anggota Keluarga Tambahan | Memotong iuran tambahan 1% per jiwa untuk anak ke-4 dst, orang tua, atau mertua. | Dasar Upah BPJS Kes, Jumlah Jiwa Tambahan | Nilai Potongan Tambahan Karyawan (Rp) | Reject jika jumlah jiwa tambahan < 0 atau melebihi batas legalitas KK. | Perpres 82/2018 |
| 12 | Upah | Validasi Proporsi Upah Pokok Minimal 75% | Memvalidasi struktur gaji agar komponen Upah Pokok minimal 75% dari (Pokok + Tunjangan Tetap). | Nilai Upah Pokok, Nilai Tunjangan Tetap | Status Validitas (Valid/Peringatan), Rekomendasi Restrukturisasi | Tampilkan warning compliance jika Pokok < 75% dari total upah tetap. | UU 13/2003 Pasal 94 |
| 13 | Upah | Konfigurasi Upah Minimum Mikro & Kecil (UMK) | Mengakomodasi kesepakatan upah khusus UMKM (min 50% konsumsi provinsi & 25% di atas garis kemiskinan). | Kategori Usaha (UMKM/Non-UMKM), Nilai Upah Kesepakatan, Garis Kemiskinan Provinsi | Status Compliance Upah UMKM | Flag non-compliant jika nilai upah < 25% di atas garis kemiskinan provinsi. | PP No. 36/2021 Pasal 36 |
| 14 | THR | Kalkulator THR Prorata & Penuh | Menghitung hak THR keagamaan proporsional masa kerja dan menghitung PPh 21 TER atas THR. | Masa Kerja (Bulan), Upah Pokok, Tunjangan Tetap, Status PTKP | Nilai Bruto THR, Pajak PPh 21 Bulan THR, THP Bulan THR | Nilai THR = 0 jika masa kerja < 1 bulan; Prorata jika 1 s/d < 12 bulan. | Permenaker No. 6/2016 |
| 15 | Lembur | Lembur Hari Kerja Biasa (1.5x & 2.0x) | Menghitung upah lembur jam pertama (1.5x) dan jam berikutnya (2.0x) dengan dasar upah 1/173. | Jumlah Jam Lembur Hari Kerja, Upah Pokok, Tunjangan Tetap | Upah Lembur Hari Kerja (Rp) | Warning jika jam lembur harian > 4 jam atau mingguan > 18 jam. | PP No. 35/2021 |
| 16 | Lembur | Lembur Hari Libur Resmi / Istirahat Mingguan | Menghitung upah lembur hari libur dengan skema 5 hari kerja (2x jam 1-8, 3x jam 9, 4x jam 10-12) atau 6 hari kerja. | Tipe Hari (Libur 5 Hari / Libur 6 Hari), Durasi Lembur (Jam), Upah 1 Bulan | Upah Lembur Hari Libur (Rp) | Terapkan tiering multiplier otomatis sesuai durasi jam lembur. | PP No. 35/2021 |
| 17 | Cuti | Modul Cuti Maternitas Bertingkat (UU KIA) | Mengelola hak cuti melahirkan hingga 6 bulan dengan aturan upah 100% (bln 1-4) dan 75% (bln 5-6). | Tanggal Mulai Cuti, Durasi Cuti (3-6 bln), Surat Rekomendasi Dokter | Pembayaran Gaji per Bulan Cuti (100% atau 75%), Notifikasi Proteksi PHK | Kunci status pemutusan hubungan kerja selama masa cuti melahirkan aktif. | UU No. 4/2024 (UU KIA) |
| 18 | Cuti | Izin Khusus Berbayar Otomatis | Memotong kuota izin khusus tanpa memotong gaji pokok maupun tunjangan tetap. | Jenis Izin (Menikah, Kematian, Kelahiran, Cuti Suami), Tanggal Kejadian | Hari Izin Disetujui, Gaji Tetap Utuh (100%) | Batasi durasi hari izin sesuai kuota maksimal per UU Ketenagakerjaan. | UU 13/2003 Pasal 93 |
| 19 | Kompensasi | Kalkulator Uang Kompensasi PKWT | Menghitung uang kompensasi berakhirnya kontrak kerja PKWT proporsional masa kerja. | Masa Kerja PKWT (Bulan), Upah Pokok, Tunjangan Tetap | Nilai Uang Kompensasi PKWT (Rp) | Nol jika masa kerja < 1 bulan; Hitung kompensasi setiap masa kontrak berakhir. | PP No. 35/2021 Pasal 15 |
| 20 | Pesangon | Engine Pesangon PHK Otomatis | Menghitung Uang Pesangon (UP), UPMK, UPH, dan faktor pengali berdasarkan alasan PHK spesifik. | Alasan PHK, Masa Kerja (Tahun), Upah Pokok, Tunjangan Tetap, Sisa Cuti | Rincian UP, UPMK, UPH, Total Kompensasi PHK, PPh 21 Final PP 68/2009 | Block alasan PHK yang tidak memiliki dasar hukum di PP 35/2021. | PP No. 35/2021 & PP 68/2009 |

---

## 12. MATRIKS EDGE CASES & VALIDASI REGULASI

| # | Feature / Skenario | Input / Kasus Ekstrem | Perilaku yang Diharapkan / Validasi Sistem |
|---|--------------------|----------------------|--------------------------------------------|
| 1 | PPh 21 TER Masa Resign Tengah Tahun | Karyawan resign pada bulan Agustus (bekerja 8 bulan), menerima bonus di bulan Maret sehingga PPh 21 TER Jan–Juli tinggi. | Sistem wajib memicu kalkulasi disetahunkan / masa terakhir pada bulan Agustus. Jika PPh 21 terutang riil < total potongan Jan–Juli, sistem otomatis menerbitkan *tax refund* (pengembalian pajak lebih bayar) pada slip gaji Agustus. |
| 2 | Capping Iuran JP & BPJS Kesehatan | Karyawan level Direksi/Manajer dengan gaji pokok Rp35.000.000 / bulan. | Sistem otomatis membatasi dasar perhitungan iuran JP pada Rp10.042.300 (2024) dan BPJS Kesehatan pada Rp12.000.000. Iuran JP = Rp200.846 (pers) & Rp100.423 (kary); Iuran Kes = Rp480.000 (pers) & Rp120.000 (kary). |
| 3 | Lembur Melebihi Batas Maksimum Legal | SPKL lembur hari kerja biasa diajukan selama 6 jam dalam 1 hari (batas legal: 4 jam/hari). | Sistem tetap menghitung hak upah lembur secara matematis untuk melindungi hak buruh (upah lembur jam ke-5 dan ke-6 dibayar 2.0x), namun menerbitkan *Compliance Audit Alert* bahwa perusahaan melanggar batas maksimal lembur PP 35/2021. |
| 4 | Cuti Melahirkan Bulan ke-5 & ke-6 | Karyawan perempuan mengambil cuti melahirkan 6 bulan berdasarkan rekomendasi dokter per UU KIA No. 4/2024. | Gaji bulan ke-1 s/d ke-4 dibayar 100% upah penuh. Gaji bulan ke-5 dan ke-6 otomatis dipotong menjadi 75% dari Upah Pokok + Tunjangan Tetap. Status kepegawaian terkunci dari aksi PHK. |
| 5 | THR Karyawan Resign Menjelang Hari Raya | Karyawan PKWTT resign 20 hari sebelum Hari Raya Idul Fitri; Karyawan PKWT kontraknya habis 10 hari sebelum Hari Raya. | Karyawan PKWTT **tetap berhak menerima THR penuh** karena putus hubungan kerja terjadi dalam rentang 30 hari sebelum Hari Raya. Karyawan PKWT **tidak berhak menerima THR** karena kontraknya berakhir sebelum hari H. |
| 6 | Proporsi Upah Pokok < 75% | Perusahaan menyusun struktur gaji: Gaji Pokok Rp3.000.000, Tunjangan Tetap Rp3.000.000 (Total Rp6.000.000; Pokok = 50%). | Sistem menghitung dasar upah lembur bukan dari Rp6.000.000 melainkan otomatis memvalidasi bahwa dasar perhitungan lembur minimal 75% dari total upah (yaitu $75\% \times \text{Rp6.000.000} = \text{Rp4.500.000}$). |
| 7 | Perubahan Status PTKP di Tengah Tahun | Karyawan berstatus TK/0 menikah pada bulan Juni (menjadi K/0). | Sesuai ketentuan perpajakan Indonesia, **status PTKP ditentukan pada keadaan awal tahun kalender (1 Januari)**. Sistem mempertahankan status TK/0 hingga akhir tahun pajak berjalan, dan status K/0 baru mulai diberlakukan pada 1 Januari tahun berikutnya. |
| 8 | Pembayaran Gaji Karyawan di Bawah UMK pada Perusahaan Non-UMKM | Perusahaan non-UMKM memasukkan gaji pokok Rp3.500.000 di wilayah DKI Jakarta (UMK > Rp5.000.000). | Sistem menerbitkan *Critical Legal Blocking Warning* bahwa gaji di bawah ketentuan upah minimum melanggar UU Ketenagakerjaan dan dapat dikenakan sanksi pidana ketenagakerjaan. |
| 9 | Pesangon Dibayar Bertahap Melebihi 2 Tahun | Pembayaran pesangon dicicil: Tahun 1 (Rp100 jt), Tahun 2 (Rp100 jt), Tahun 3 (Rp100 jt). | Tahun 1 dan Tahun 2 dipotong menggunakan tarif final PP 68/2009 secara kumulatif. Pada pembayaran Tahun ke-3, sistem otomatis beralih memotong PPh 21 menggunakan tarif progresif Pasal 17 non-final per PMK 168/2023. |
| 10 | Potongan Gaji Karyawan Melebihi 50% | Karyawan memiliki pinjaman kasbon dan koperasi besar sehingga total potongan mencapai 70% dari gaji. | Sistem memberikan peringatan kepatuhan regulasi PP 36/2021 Pasal 65 yang menetapkan bahwa total pemotongan upah tidak boleh melebihi 50% dari setiap pembayaran upah yang diterima pekerja. |

---

## 13. ARSITEKTUR KONFIGURASI & MEKANISME ADAPTASI PERUBAHAN REGULASI

Untuk memastikan aplikasi **CatatGaji** selalu relevan dan tidak memerlukan *hardcoding* ulang saat pemerintah memperbarui peraturan di masa depan (2025–2030), mesin penggajian wajib menggunakan **Dynamic Regulatory Parameter Table**:

1. **Struktur Penyimpanan Parameter Regulasi Berbasis Waktu (*Temporal Validity*)**:
   Setiap parameter hukum (Tabel TER, Plafon Capping JP, Tarif BPJS, Batas PTKP, Tarif Pasal 17) disimpan dalam tabel database dengan kolom `effective_start_date` dan `effective_end_date`.
2. **Versioning Formula**:
   Engine kalkulasi memanggil versi aturan berdasarkan tanggal transaksi penggajian (`payroll_period_date`).
3. **Multi-Tenant Override & Configuration**:
   Tenant UMKM dapat mengaktifkan opsi *Exemption for Micro-Small Enterprises* sesuai PP 36/2021 untuk menyesuaikan batas upah minimum dan kompensasi kontrak.
4. **Audit Trail & Logging**:
   Setiap perubahan nilai parameter hukum dicatat dalam log audit yang mencantumkan dasar regulasi resmi, nomor surat edaran, dan identitas administrator pengubah.

---
*Laporan survei dan spesifikasi regulasi ini disusun secara komprehensif, valid, dan terverifikasi 100% untuk implementasi teknis pada platform CatatGaji.*
