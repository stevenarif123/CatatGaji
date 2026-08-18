# LAMPIRAN 01: TABEL LENGKAP TARIF EFEKTIF RATA-RATA (TER) PPH PASAL 21
**Aplikasi Multi-Tenant SaaS CatatGaji**
*Dokumen Referensi Definitif & Spesifikasi Tarif Pemotongan Pajak Penghasilan Pasal 21 Berdasarkan PP No. 58 Tahun 2023 dan PMK No. 168 Tahun 2023*

---

## DAFTAR ISI
1. [Landasan Hukum & Prinsip Penerapan TER](#1-landasan-hukum--prinsip-penerapan-ter)
2. [Tabel Klasifikasi Status PTKP & Pemetaan Kategori TER](#2-tabel-klasifikasi-status-ptkp--pemetaan-kategori-ter)
3. [Tabel Lengkap TER Bulanan Kategori A (44 Lapisan)](#3-tabel-lengkap-ter-bulanan-kategori-a-44-lapisan)
4. [Tabel Lengkap TER Bulanan Kategori B (40 Lapisan)](#4-tabel-lengkap-ter-bulanan-kategori-b-40-lapisan)
5. [Tabel Lengkap TER Bulanan Kategori C (41 Lapisan)](#5-tabel-lengkap-ter-bulanan-kategori-c-41-lapisan)
6. [Tabel Tarif Efektif Harian Pegawai Tidak Tetap](#6-tabel-tarif-efektif-harian-pegawai-tidak-tetap)
7. [Tabel Tarif Progresif Pasal 17 Ayat (1) Huruf a UU HPP](#7-tabel-tarif-progresif-pasal-17-ayat-1-huruf-a-uu-hpp)
8. [Spesifikasi Teknis & Logika Lookup untuk Software Engineer](#8-spesifikasi-teknis--logika-lookup-untuk-software-engineer)

---

## 1. LANDASAN HUKUM & PRINSIP PENERAPAN TER

Sejak tanggal 1 Januari 2024, Pemerintah Republik Indonesia memberlakukan skema pemotongan Pajak Penghasilan Pasal 21 (PPh 21) menggunakan **Tarif Efektif Rata-Rata (TER)** yang diatur dalam:
1. **Peraturan Pemerintah Republik Indonesia No. 58 Tahun 2023** tentang Tarif Pemotongan Pajak Penghasilan Pasal 21 atas Penghasilan Sehubungan dengan Pekerjaan, Jasa, atau Kegiatan Wajib Pajak Orang Pribadi.
2. **Peraturan Menteri Keuangan Republik Indonesia No. 168 Tahun 2023** tentang Petunjuk Pelaksanaan Pemotongan Pajak atas Penghasilan Sehubungan dengan Pekerjaan, Jasa, atau Kegiatan Orang Pribadi.
3. **Undang-Undang No. 7 Tahun 2021** tentang Harmonisasi Peraturan Perpajakan (UU HPP).
4. **Peraturan Menteri Keuangan No. 101/PMK.010/2016** tentang Penyesuaian Besarnya Penghasilan Tidak Kena Pajak (PTKP).

### Prinsip Operasional Engine Penggajian:
- **Masa Pajak Selain Masa Pajak Terakhir (Januari s/d November)**:
  $$\text{PPh 21 Terutang Bulanan} = \text{Penghasilan Bruto Sebulan} \times \text{Tarif Efektif Bulanan (TER)}$$
  *Catatan*: Pada masa Jan–Nov tidak dilakukan pengurangan Biaya Jabatan, Iuran Pensiun/JHT, ataupun PTKP secara manual karena komponen-komponen tersebut telah diinkorporasikan ke dalam formulasi persentase TER.
- **Masa Pajak Terakhir (Desember atau Masa Karyawan Berhenti Bekerja / Resign)**:
  $$\text{PPh 21 Terutang Setahun} = \text{Tarif Progresif Pasal 17 UU HPP} \times \text{Penghasilan Kena Pajak (PKP) Setahun}$$
  $$\text{PPh 21 Masa Terakhir} = \text{PPh 21 Terutang Setahun} - \sum_{m=1}^{N-1} \text{PPh 21 Telah Dipotong}$$
- **Determinisme Batas Rentang**: Batas rentang penghasilan bruto dievaluasi secara semi-terbuka:
  $$\text{Lapisan Terpilih} \iff \text{Batas Bawah} < \text{Penghasilan Bruto} \le \text{Batas Atas}$$
  *(Kecuali lapisan pertama: $0 \le \text{Penghasilan Bruto} \le \text{Batas Atas}$)*.

---

## 2. TABEL KLASIFIKASI STATUS PTKP & PEMETAAN KATEGORI TER

Berdasarkan Pasal 2 PP No. 58 Tahun 2023 jo. PMK No. 168 Tahun 2023, seluruh status Penghasilan Tidak Kena Pajak (PTKP) dikelompokkan ke dalam 3 (tiga) Kategori TER Bulanan:

| Status PTKP | Keterangan Status | Tanggungan | PTKP Bulanan (Rp) | PTKP Tahunan (Rp) | Kategori TER Bulanan |
|:-----------:|:------------------|:----------:|:-----------------:|:-----------------:|:--------------------:|
| **TK/0** | Tidak Kawin, Tanpa Tanggungan | 0 | Rp 4.500.000 | Rp 54.000.000 | **TER Kategori A** |
| **TK/1** | Tidak Kawin, 1 Tanggungan | 1 | Rp 4.875.000 | Rp 58.500.000 | **TER Kategori A** |
| **K/0** | Kawin, Tanpa Tanggungan | 0 | Rp 4.875.000 | Rp 58.500.000 | **TER Kategori A** |
| **TK/2** | Tidak Kawin, 2 Tanggungan | 2 | Rp 5.250.000 | Rp 63.000.000 | **TER Kategori B** |
| **TK/3** | Tidak Kawin, 3 Tanggungan | 3 | Rp 5.625.000 | Rp 67.500.000 | **TER Kategori B** |
| **K/1** | Kawin, 1 Tanggungan | 1 | Rp 5.250.000 | Rp 63.000.000 | **TER Kategori B** |
| **K/2** | Kawin, 2 Tanggungan | 2 | Rp 5.625.000 | Rp 67.500.000 | **TER Kategori B** |
| **K/3** | Kawin, 3 Tanggungan | 3 | Rp 6.000.000 | Rp 72.000.000 | **TER Kategori C** |

### Aturan Khusus Perpajakan Karyawati:
1. **Karyawati Menikah**: Secara *default* perpajakan Indonesia, karyawati menikah diperlakukan berstatus **TK/0** (PTKP Wajib Pajak Sendiri), kecuali karyawati dapat menyerahkan Surat Keterangan resmi dari Pemerintah Daerah (minimal Kecamatan/Kelurahan) yang menyatakan bahwa suami tidak memiliki penghasilan/pekerjaan apa pun, sehingga status PTKP-nya dapat diakui menjadi K/0, K/1, K/2, atau K/3.
2. **Karyawati Tidak Menikah**: Menggunakan status sebenarnya (TK/0, TK/1, TK/2, atau TK/3 jika memiliki tanggungan garis lurus/anak angkat yang sah secara hukum).
3. **Status PTKP Gabungan Suami-Istri (K/I/0 s/d K/I/3)**: Jika suami-istri melakukan perjanjian pisah harta dan penghasilan (PH) atau memilih menjalankan hak dan kewajiban perpajakan terpisah (MT), pemotongan PPh 21 oleh masing-masing pemberi kerja tetap menggunakan status PTKP masing-masing individu (suami: K/..., istri: TK/0) pada level masa bulanan.

---

## 3. TABEL LENGKAP TER BULANAN KATEGORI A (44 LAPISAN)

**Status PTKP Terkait**: `TK/0` (Rp 54.000.000), `TK/1` (Rp 58.500.000), `K/0` (Rp 58.500.000).  
Seluruh 44 baris lapisan penghasilan bruto bulanan tercantum secara lengkap tanpa singkatan:

| No | Rentang Penghasilan Bruto Sebulan (Rp) | Batas Bawah (Rp) | Batas Atas (Rp) | Tarif TER A (%) | Tarif Efektif Desimal |
|:--:|:---------------------------------------|:-----------------|:----------------|:---------------:|:---------------------:|
| 1 | s/d Rp 5.400.000 | Rp 0 | Rp 5.400.000 | **0,00%** | 0.0000 |
| 2 | > Rp 5.400.000 s/d Rp 5.650.000 | Rp 5.400.000 | Rp 5.650.000 | **0,25%** | 0.0025 |
| 3 | > Rp 5.650.000 s/d Rp 5.950.000 | Rp 5.650.000 | Rp 5.950.000 | **0,50%** | 0.0050 |
| 4 | > Rp 5.950.000 s/d Rp 6.300.000 | Rp 5.950.000 | Rp 6.300.000 | **0,75%** | 0.0075 |
| 5 | > Rp 6.300.000 s/d Rp 6.750.000 | Rp 6.300.000 | Rp 6.750.000 | **1,00%** | 0.0100 |
| 6 | > Rp 6.750.000 s/d Rp 7.500.000 | Rp 6.750.000 | Rp 7.500.000 | **1,25%** | 0.0125 |
| 7 | > Rp 7.500.000 s/d Rp 8.550.000 | Rp 7.500.000 | Rp 8.550.000 | **1,50%** | 0.0150 |
| 8 | > Rp 8.550.000 s/d Rp 9.650.000 | Rp 8.550.000 | Rp 9.650.000 | **1,75%** | 0.0175 |
| 9 | > Rp 9.650.000 s/d Rp 10.050.000 | Rp 9.650.000 | Rp 10.050.000 | **2,00%** | 0.0200 |
| 10 | > Rp 10.050.000 s/d Rp 10.350.000 | Rp 10.050.000 | Rp 10.350.000 | **2,25%** | 0.0225 |
| 11 | > Rp 10.350.000 s/d Rp 10.700.000 | Rp 10.350.000 | Rp 10.700.000 | **2,50%** | 0.0250 |
| 12 | > Rp 10.700.000 s/d Rp 11.050.000 | Rp 10.700.000 | Rp 11.050.000 | **3,00%** | 0.0300 |
| 13 | > Rp 11.050.000 s/d Rp 11.600.000 | Rp 11.050.000 | Rp 11.600.000 | **3,50%** | 0.0350 |
| 14 | > Rp 11.600.000 s/d Rp 12.500.000 | Rp 11.600.000 | Rp 12.500.000 | **4,00%** | 0.0400 |
| 15 | > Rp 12.500.000 s/d Rp 13.750.000 | Rp 12.500.000 | Rp 13.750.000 | **5,00%** | 0.0500 |
| 16 | > Rp 13.750.000 s/d Rp 15.100.000 | Rp 13.750.000 | Rp 15.100.000 | **6,00%** | 0.0600 |
| 17 | > Rp 15.100.000 s/d Rp 16.950.000 | Rp 15.100.000 | Rp 16.950.000 | **7,00%** | 0.0700 |
| 18 | > Rp 16.950.000 s/d Rp 19.750.000 | Rp 16.950.000 | Rp 19.750.000 | **8,00%** | 0.0800 |
| 19 | > Rp 19.750.000 s/d Rp 24.150.000 | Rp 19.750.000 | Rp 24.150.000 | **9,00%** | 0.0900 |
| 20 | > Rp 24.150.000 s/d Rp 26.450.000 | Rp 24.150.000 | Rp 26.450.000 | **10,00%** | 0.1000 |
| 21 | > Rp 26.450.000 s/d Rp 28.000.000 | Rp 26.450.000 | Rp 28.000.000 | **11,00%** | 0.1100 |
| 22 | > Rp 28.000.000 s/d Rp 30.050.000 | Rp 28.000.000 | Rp 30.050.000 | **12,00%** | 0.1200 |
| 23 | > Rp 30.050.000 s/d Rp 32.400.000 | Rp 30.050.000 | Rp 32.400.000 | **13,00%** | 0.1300 |
| 24 | > Rp 32.400.000 s/d Rp 35.400.000 | Rp 32.400.000 | Rp 35.400.000 | **14,00%** | 0.1400 |
| 25 | > Rp 35.400.000 s/d Rp 39.100.000 | Rp 35.400.000 | Rp 39.100.000 | **15,00%** | 0.1500 |
| 26 | > Rp 39.100.000 s/d Rp 43.850.000 | Rp 39.100.000 | Rp 43.850.000 | **16,00%** | 0.1600 |
| 27 | > Rp 43.850.000 s/d Rp 47.800.000 | Rp 43.850.000 | Rp 47.800.000 | **17,00%** | 0.1700 |
| 28 | > Rp 47.800.000 s/d Rp 51.400.000 | Rp 47.800.000 | Rp 51.400.000 | **18,00%** | 0.1800 |
| 29 | > Rp 51.400.000 s/d Rp 56.300.000 | Rp 51.400.000 | Rp 56.300.000 | **19,00%** | 0.1900 |
| 30 | > Rp 56.300.000 s/d Rp 62.200.000 | Rp 56.300.000 | Rp 62.200.000 | **20,00%** | 0.2000 |
| 31 | > Rp 62.200.000 s/d Rp 68.600.000 | Rp 62.200.000 | Rp 68.600.000 | **21,00%** | 0.2100 |
| 32 | > Rp 68.600.000 s/d Rp 77.500.000 | Rp 68.600.000 | Rp 77.500.000 | **22,00%** | 0.2200 |
| 33 | > Rp 77.500.000 s/d Rp 89.000.000 | Rp 77.500.000 | Rp 89.000.000 | **23,00%** | 0.2300 |
| 34 | > Rp 89.000.000 s/d Rp 103.000.000 | Rp 89.000.000 | Rp 103.000.000 | **24,00%** | 0.2400 |
| 35 | > Rp 103.000.000 s/d Rp 125.000.000 | Rp 103.000.000 | Rp 125.000.000 | **25,00%** | 0.2500 |
| 36 | > Rp 125.000.000 s/d Rp 157.000.000 | Rp 125.000.000 | Rp 157.000.000 | **26,00%** | 0.2600 |
| 37 | > Rp 157.000.000 s/d Rp 206.000.000 | Rp 157.000.000 | Rp 206.000.000 | **27,00%** | 0.2700 |
| 38 | > Rp 206.000.000 s/d Rp 337.000.000 | Rp 206.000.000 | Rp 337.000.000 | **28,00%** | 0.2800 |
| 39 | > Rp 337.000.000 s/d Rp 454.000.000 | Rp 337.000.000 | Rp 454.000.000 | **29,00%** | 0.2900 |
| 40 | > Rp 454.000.000 s/d Rp 550.000.000 | Rp 454.000.000 | Rp 550.000.000 | **30,00%** | 0.3000 |
| 41 | > Rp 550.000.000 s/d Rp 695.000.000 | Rp 550.000.000 | Rp 695.000.000 | **31,00%** | 0.3100 |
| 42 | > Rp 695.000.000 s/d Rp 910.000.000 | Rp 695.000.000 | Rp 910.000.000 | **32,00%** | 0.3200 |
| 43 | > Rp 910.000.000 s/d Rp 1.400.000.000 | Rp 910.000.000 | Rp 1.400.000.000 | **33,00%** | 0.3300 |
| 44 | > Rp 1.400.000.000 | Rp 1.400.000.000 | Tak Terhingga | **34,00%** | 0.3400 |

---

## 4. TABEL LENGKAP TER BULANAN KATEGORI B (40 LAPISAN)

**Status PTKP Terkait**: `TK/2` (Rp 63.000.000), `TK/3` (Rp 67.500.000), `K/1` (Rp 63.000.000), `K/2` (Rp 67.500.000).  
Seluruh 40 baris lapisan penghasilan bruto bulanan tercantum secara lengkap tanpa singkatan:

| No | Rentang Penghasilan Bruto Sebulan (Rp) | Batas Bawah (Rp) | Batas Atas (Rp) | Tarif TER B (%) | Tarif Efektif Desimal |
|:--:|:---------------------------------------|:-----------------|:----------------|:---------------:|:---------------------:|
| 1 | s/d Rp 6.200.000 | Rp 0 | Rp 6.200.000 | **0,00%** | 0.0000 |
| 2 | > Rp 6.200.000 s/d Rp 6.500.000 | Rp 6.200.000 | Rp 6.500.000 | **0,25%** | 0.0025 |
| 3 | > Rp 6.500.000 s/d Rp 6.850.000 | Rp 6.500.000 | Rp 6.850.000 | **0,50%** | 0.0050 |
| 4 | > Rp 6.850.000 s/d Rp 7.300.000 | Rp 6.850.000 | Rp 7.300.000 | **0,75%** | 0.0075 |
| 5 | > Rp 7.300.000 s/d Rp 9.200.000 | Rp 7.300.000 | Rp 9.200.000 | **1,00%** | 0.0100 |
| 6 | > Rp 9.200.000 s/d Rp 10.750.000 | Rp 9.200.000 | Rp 10.750.000 | **1,50%** | 0.0150 |
| 7 | > Rp 10.750.000 s/d Rp 11.250.000 | Rp 10.750.000 | Rp 11.250.000 | **2,00%** | 0.0200 |
| 8 | > Rp 11.250.000 s/d Rp 11.600.000 | Rp 11.250.000 | Rp 11.600.000 | **2,50%** | 0.0250 |
| 9 | > Rp 11.600.000 s/d Rp 12.600.000 | Rp 11.600.000 | Rp 12.600.000 | **3,00%** | 0.0300 |
| 10 | > Rp 12.600.000 s/d Rp 13.600.000 | Rp 12.600.000 | Rp 13.600.000 | **4,00%** | 0.0400 |
| 11 | > Rp 13.600.000 s/d Rp 14.950.000 | Rp 13.600.000 | Rp 14.950.000 | **5,00%** | 0.0500 |
| 12 | > Rp 14.950.000 s/d Rp 16.400.000 | Rp 14.950.000 | Rp 16.400.000 | **6,00%** | 0.0600 |
| 13 | > Rp 16.400.000 s/d Rp 18.450.000 | Rp 16.400.000 | Rp 18.450.000 | **7,00%** | 0.0700 |
| 14 | > Rp 18.450.000 s/d Rp 21.850.000 | Rp 18.450.000 | Rp 21.850.000 | **8,00%** | 0.0800 |
| 15 | > Rp 21.850.000 s/d Rp 26.000.000 | Rp 21.850.000 | Rp 26.000.000 | **9,00%** | 0.0900 |
| 16 | > Rp 26.000.000 s/d Rp 27.700.000 | Rp 26.000.000 | Rp 27.700.000 | **10,00%** | 0.1000 |
| 17 | > Rp 27.700.000 s/d Rp 29.350.000 | Rp 27.700.000 | Rp 29.350.000 | **11,00%** | 0.1100 |
| 18 | > Rp 29.350.000 s/d Rp 31.450.000 | Rp 29.350.000 | Rp 31.450.000 | **12,00%** | 0.1200 |
| 19 | > Rp 31.450.000 s/d Rp 33.950.000 | Rp 31.450.000 | Rp 33.950.000 | **13,00%** | 0.1300 |
| 20 | > Rp 33.950.000 s/d Rp 37.100.000 | Rp 33.950.000 | Rp 37.100.000 | **14,00%** | 0.1400 |
| 21 | > Rp 37.100.000 s/d Rp 41.100.000 | Rp 37.100.000 | Rp 41.100.000 | **15,00%** | 0.1500 |
| 22 | > Rp 41.100.000 s/d Rp 45.800.000 | Rp 41.100.000 | Rp 45.800.000 | **16,00%** | 0.1600 |
| 23 | > Rp 45.800.000 s/d Rp 49.500.000 | Rp 45.800.000 | Rp 49.500.000 | **17,00%** | 0.1700 |
| 24 | > Rp 49.500.000 s/d Rp 53.800.000 | Rp 49.500.000 | Rp 53.800.000 | **18,00%** | 0.1800 |
| 25 | > Rp 53.800.000 s/d Rp 58.500.000 | Rp 53.800.000 | Rp 58.500.000 | **19,00%** | 0.1900 |
| 26 | > Rp 58.500.000 s/d Rp 64.000.000 | Rp 58.500.000 | Rp 64.000.000 | **20,00%** | 0.2000 |
| 27 | > Rp 64.000.000 s/d Rp 71.000.000 | Rp 64.000.000 | Rp 71.000.000 | **21,00%** | 0.2100 |
| 28 | > Rp 71.000.000 s/d Rp 80.000.000 | Rp 71.000.000 | Rp 80.000.000 | **22,00%** | 0.2200 |
| 29 | > Rp 80.000.000 s/d Rp 93.000.000 | Rp 80.000.000 | Rp 93.000.000 | **23,00%** | 0.2300 |
| 30 | > Rp 93.000.000 s/d Rp 109.000.000 | Rp 93.000.000 | Rp 109.000.000 | **24,00%** | 0.2400 |
| 31 | > Rp 109.000.000 s/d Rp 129.000.000 | Rp 109.000.000 | Rp 129.000.000 | **25,00%** | 0.2500 |
| 32 | > Rp 129.000.000 s/d Rp 163.000.000 | Rp 129.000.000 | Rp 163.000.000 | **26,00%** | 0.2600 |
| 33 | > Rp 163.000.000 s/d Rp 211.000.000 | Rp 163.000.000 | Rp 211.000.000 | **27,00%** | 0.2700 |
| 34 | > Rp 211.000.000 s/d Rp 374.000.000 | Rp 211.000.000 | Rp 374.000.000 | **28,00%** | 0.2800 |
| 35 | > Rp 374.000.000 s/d Rp 459.000.000 | Rp 374.000.000 | Rp 459.000.000 | **29,00%** | 0.2900 |
| 36 | > Rp 459.000.000 s/d Rp 555.000.000 | Rp 459.000.000 | Rp 555.000.000 | **30,00%** | 0.3000 |
| 37 | > Rp 555.000.000 s/d Rp 704.000.000 | Rp 555.000.000 | Rp 704.000.000 | **31,00%** | 0.3100 |
| 38 | > Rp 704.000.000 s/d Rp 957.000.000 | Rp 704.000.000 | Rp 957.000.000 | **32,00%** | 0.3200 |
| 39 | > Rp 957.000.000 s/d Rp 1.405.000.000 | Rp 957.000.000 | Rp 1.405.000.000 | **33,00%** | 0.3300 |
| 40 | > Rp 1.405.000.000 | Rp 1.405.000.000 | Tak Terhingga | **34,00%** | 0.3400 |

---

## 5. TABEL LENGKAP TER BULANAN KATEGORI C (41 LAPISAN)

**Status PTKP Terkait**: `K/3` (Rp 72.000.000).  
Seluruh 41 baris lapisan penghasilan bruto bulanan tercantum secara lengkap tanpa singkatan:

| No | Rentang Penghasilan Bruto Sebulan (Rp) | Batas Bawah (Rp) | Batas Atas (Rp) | Tarif TER C (%) | Tarif Efektif Desimal |
|:--:|:---------------------------------------|:-----------------|:----------------|:---------------:|:---------------------:|
| 1 | s/d Rp 6.600.000 | Rp 0 | Rp 6.600.000 | **0,00%** | 0.0000 |
| 2 | > Rp 6.600.000 s/d Rp 6.950.000 | Rp 6.600.000 | Rp 6.950.000 | **0,25%** | 0.0025 |
| 3 | > Rp 6.950.000 s/d Rp 7.350.000 | Rp 6.950.000 | Rp 7.350.000 | **0,50%** | 0.0050 |
| 4 | > Rp 7.350.000 s/d Rp 7.800.000 | Rp 7.350.000 | Rp 7.800.000 | **0,75%** | 0.0075 |
| 5 | > Rp 7.800.000 s/d Rp 8.850.000 | Rp 7.800.000 | Rp 8.850.000 | **1,00%** | 0.0100 |
| 6 | > Rp 8.850.000 s/d Rp 9.800.000 | Rp 8.850.000 | Rp 9.800.000 | **1,25%** | 0.0125 |
| 7 | > Rp 9.800.000 s/d Rp 10.950.000 | Rp 9.800.000 | Rp 10.950.000 | **1,50%** | 0.0150 |
| 8 | > Rp 10.950.000 s/d Rp 11.200.000 | Rp 10.950.000 | Rp 11.200.000 | **1,75%** | 0.0175 |
| 9 | > Rp 11.200.000 s/d Rp 12.050.000 | Rp 11.200.000 | Rp 12.050.000 | **2,00%** | 0.0200 |
| 10 | > Rp 12.050.000 s/d Rp 12.950.000 | Rp 12.050.000 | Rp 12.950.000 | **3,00%** | 0.0300 |
| 11 | > Rp 12.950.000 s/d Rp 14.150.000 | Rp 12.950.000 | Rp 14.150.000 | **4,00%** | 0.0400 |
| 12 | > Rp 14.150.000 s/d Rp 15.550.000 | Rp 14.150.000 | Rp 15.550.000 | **5,00%** | 0.0500 |
| 13 | > Rp 15.550.000 s/d Rp 17.050.000 | Rp 15.550.000 | Rp 17.050.000 | **6,00%** | 0.0600 |
| 14 | > Rp 17.050.000 s/d Rp 19.500.000 | Rp 17.050.000 | Rp 19.500.000 | **7,00%** | 0.0700 |
| 15 | > Rp 19.500.000 s/d Rp 22.700.000 | Rp 19.500.000 | Rp 22.700.000 | **8,00%** | 0.0800 |
| 16 | > Rp 22.700.000 s/d Rp 26.600.000 | Rp 22.700.000 | Rp 26.600.000 | **9,00%** | 0.0900 |
| 17 | > Rp 26.600.000 s/d Rp 28.100.000 | Rp 26.600.000 | Rp 28.100.000 | **10,00%** | 0.1000 |
| 18 | > Rp 28.100.000 s/d Rp 30.100.000 | Rp 28.100.000 | Rp 30.100.000 | **11,00%** | 0.1100 |
| 19 | > Rp 30.100.000 s/d Rp 32.600.000 | Rp 30.100.000 | Rp 32.600.000 | **12,00%** | 0.1200 |
| 20 | > Rp 32.600.000 s/d Rp 35.400.000 | Rp 32.600.000 | Rp 35.400.000 | **13,00%** | 0.1300 |
| 21 | > Rp 35.400.000 s/d Rp 38.900.000 | Rp 35.400.000 | Rp 38.900.000 | **14,00%** | 0.1400 |
| 22 | > Rp 38.900.000 s/d Rp 43.000.000 | Rp 38.900.000 | Rp 43.000.000 | **15,00%** | 0.1500 |
| 23 | > Rp 43.000.000 s/d Rp 47.400.000 | Rp 43.000.000 | Rp 47.400.000 | **16,00%** | 0.1600 |
| 24 | > Rp 47.400.000 s/d Rp 51.200.000 | Rp 47.400.000 | Rp 51.200.000 | **17,00%** | 0.1700 |
| 25 | > Rp 51.200.000 s/d Rp 55.800.000 | Rp 51.200.000 | Rp 55.800.000 | **18,00%** | 0.1800 |
| 26 | > Rp 55.800.000 s/d Rp 60.400.000 | Rp 55.800.000 | Rp 60.400.000 | **19,00%** | 0.1900 |
| 27 | > Rp 60.400.000 s/d Rp 66.700.000 | Rp 60.400.000 | Rp 66.700.000 | **20,00%** | 0.2000 |
| 28 | > Rp 66.700.000 s/d Rp 74.500.000 | Rp 66.700.000 | Rp 74.500.000 | **21,00%** | 0.2100 |
| 29 | > Rp 74.500.000 s/d Rp 83.200.000 | Rp 74.500.000 | Rp 83.200.000 | **22,00%** | 0.2200 |
| 30 | > Rp 83.200.000 s/d Rp 95.600.000 | Rp 83.200.000 | Rp 95.600.000 | **23,00%** | 0.2300 |
| 31 | > Rp 95.600.000 s/d Rp 110.000.000 | Rp 95.600.000 | Rp 110.000.000 | **24,00%** | 0.2400 |
| 32 | > Rp 110.000.000 s/d Rp 134.000.000 | Rp 110.000.000 | Rp 134.000.000 | **25,00%** | 0.2500 |
| 33 | > Rp 134.000.000 s/d Rp 169.000.000 | Rp 134.000.000 | Rp 169.000.000 | **26,00%** | 0.2600 |
| 34 | > Rp 169.000.000 s/d Rp 221.000.000 | Rp 169.000.000 | Rp 221.000.000 | **27,00%** | 0.2700 |
| 35 | > Rp 221.000.000 s/d Rp 390.000.000 | Rp 221.000.000 | Rp 390.000.000 | **28,00%** | 0.2800 |
| 36 | > Rp 390.000.000 s/d Rp 463.000.000 | Rp 390.000.000 | Rp 463.000.000 | **29,00%** | 0.2900 |
| 37 | > Rp 463.000.000 s/d Rp 561.000.000 | Rp 463.000.000 | Rp 561.000.000 | **30,00%** | 0.3000 |
| 38 | > Rp 561.000.000 s/d Rp 709.000.000 | Rp 561.000.000 | Rp 709.000.000 | **31,00%** | 0.3100 |
| 39 | > Rp 709.000.000 s/d Rp 965.000.000 | Rp 709.000.000 | Rp 965.000.000 | **32,00%** | 0.3200 |
| 40 | > Rp 965.000.000 s/d Rp 1.419.000.000 | Rp 965.000.000 | Rp 1.419.000.000 | **33,00%** | 0.3300 |
| 41 | > Rp 1.419.000.000 | Rp 1.419.000.000 | Tak Terhingga | **34,00%** | 0.3400 |

---

## 6. TABEL TARIF EFEKTIF HARIAN PEGAWAI TIDAK TETAP

Berdasarkan Pasal 3 ayat (2) PP No. 58 Tahun 2023 dan Pasal 5 ayat (1) huruf c PMK No. 168 Tahun 2023:

| Rentang Penghasilan Bruto Sehari (Rp) | Tarif TER Harian (%) | Formula Perhitungan PPh 21 Sehari | Keterangan & Ketentuan Administratif |
|:--------------------------------------|:--------------------:|:----------------------------------|:-------------------------------------|
| **$\le$ Rp 450.000** | **0,00%** | $\text{PPh 21} = 0$ | Tidak ada pemotongan PPh 21 harian. |
| **> Rp 450.000 s/d Rp 2.500.000** | **0,50%** | $\text{PPh 21} = 0,5\% \times \text{Penghasilan Bruto Sehari}$ | Dikenakan tarif efektif harian flat 0,5%. |
| **> Rp 2.500.000** | **Tarif Progresif** | $\text{PPh 21} = \text{Tarif Ps. 17} \times (50\% \times \text{Bruto Harian})$ | Dihitung menggunakan tarif progresif Pasal 17 ayat (1) huruf a UU HPP atas DPP (50% dari bruto) atau disetahunkan. |

### Ketentuan Batas Kumulatif Bulanan untuk Pegawai Tidak Tetap:
1. **Ambang Batas Kumulatif Rp 2.500.000 / Bulan**: Jika dalam 1 (satu) bulan kalender, akumulasi penghasilan bruto yang diterima oleh pegawai tidak tetap telah melebihi **Rp 2.500.000**, maka pada pembayaran hari berikutnya pemotongan PPh 21 menggunakan mekanisme TER Bulanan (Kategori A, B, atau C sesuai status PTKP pegawai tidak tetap) atau penghitungan disetahunkan per PMK 168/2023.
2. **Pembayaran Sistem Mingguan / Bulanan**: Jika upah pegawai tidak tetap dibayarkan secara mingguan atau bulanan secara terjadwal, pemotongan langsung menggunakan mekanisme TER Bulanan yang diprorata.

---

## 7. TABEL TARIF PROGRESIF PASAL 17 AYAT (1) HURUF A UU HPP

Digunakan untuk:
1. **Rekonsiliasi PPh 21 Masa Pajak Terakhir (Desember / Karyawan Resign)** bagi Pegawai Tetap.
2. **Pemotongan PPh 21 Bukan Pegawai / Tenaga Ahli / Konsultan** (atas DPP 50% Penghasilan Bruto).
3. **Pegawai Tidak Tetap dengan Penghasilan Harian > Rp 2.500.000**.

| Lapisan | Rentang Penghasilan Kena Pajak (PKP) Tahunan (Rp) | Batas Bawah (Rp) | Batas Atas (Rp) | Tarif Pajak (%) | Tarif Desimal |
|:-------:|:---------------------------------------------------|:-----------------|:----------------|:---------------:|:-------------:|
| **I** | Rp 0 s/d Rp 60.000.000 | Rp 0 | Rp 60.000.000 | **5%** | 0.05 |
| **II** | > Rp 60.000.000 s/d Rp 250.000.000 | Rp 60.000.000 | Rp 250.000.000 | **15%** | 0.15 |
| **III** | > Rp 250.000.000 s/d Rp 500.000.000 | Rp 250.000.000 | Rp 500.000.000 | **25%** | 0.25 |
| **IV** | > Rp 500.000.000 s/d Rp 5.000.000.000 | Rp 500.000.000 | Rp 5.000.000.000 | **30%** | 0.30 |
| **V** | > Rp 5.000.000.000 | Rp 5.000.000.000 | Tak Terhingga | **35%** | 0.35 |

---

## 8. SPESIFIKASI TEKNIS & LOGIKA LOOKUP UNTUK SOFTWARE ENGINEER

### 8.1 Pemetaan PTKP ke Kategori TER (Lookup Function)
```typescript
export type PTKPStatus = 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3';
export type TERCategory = 'A' | 'B' | 'C';

export function mapPTKPToTERCategory(ptkp: PTKPStatus): TERCategory {
  switch (ptkp) {
    case 'TK/0':
    case 'TK/1':
    case 'K/0':
      return 'A';
    case 'TK/2':
    case 'TK/3':
    case 'K/1':
    case 'K/2':
      return 'B';
    case 'K/3':
      return 'C';
    default:
      throw new Error(`Status PTKP tidak valid: ${ptkp}`);
  }
}
```

### 8.2 Struktur Data Binary Search Range Table
```typescript
export interface TERRange {
  tier: number;
  minGross: number; // Eksklusif (Kecuali tier 1 inklusif 0)
  maxGross: number; // Inklusif
  rate: number;     // Contoh: 0.0150 untuk 1.50%
}

export function lookupTERMonthlyRate(category: TERCategory, grossIncome: number, tables: Record<TERCategory, TERRange[]>): number {
  if (grossIncome <= 0) return 0.0;
  
  const categoryTable = tables[category];
  // Algoritma Binary Search O(log N) untuk penentuan layer cepat
  let low = 0;
  let high = categoryTable.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const range = categoryTable[mid];

    const isAboveMin = range.tier === 1 ? grossIncome >= range.minGross : grossIncome > range.minGross;
    const isBelowOrEqualMax = grossIncome <= range.maxGross;

    if (isAboveMin && isBelowOrEqualMax) {
      return range.rate;
    } else if (grossIncome > range.maxGross) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // Fallback untuk layer teratas (> max batas terakhir)
  return categoryTable[categoryTable.length - 1].rate;
}
```

### 8.3 Kueri SQL Pencarian Tarif TER (PostgreSQL)
```sql
CREATE OR REPLACE FUNCTION get_pph21_ter_rate(
    p_category VARCHAR(1),
    p_gross_income NUMERIC(15, 2)
) RETURNS NUMERIC(5, 4) AS $$
DECLARE
    v_rate NUMERIC(5, 4);
BEGIN
    SELECT rate INTO v_rate
    FROM ref_pph21_ter_rates
    WHERE category = p_category
      AND (
          (tier = 1 AND p_gross_income >= min_gross AND p_gross_income <= max_gross)
          OR (tier > 1 AND p_gross_income > min_gross AND p_gross_income <= max_gross)
      )
    LIMIT 1;

    IF v_rate IS NULL THEN
        -- Ambil tier teratas jika melebihi batas tertinggi
        SELECT rate INTO v_rate
        FROM ref_pph21_ter_rates
        WHERE category = p_category
        ORDER BY tier DESC
        LIMIT 1;
    END IF;

    RETURN COALESCE(v_rate, 0.0000);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---
*Lampiran 01 ini bersifat definitif dan menjadi acuan tunggal tabel tarif PPh 21 TER pada seluruh modul aplikasi CatatGaji.*
