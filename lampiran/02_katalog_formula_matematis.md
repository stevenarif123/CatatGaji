# LAMPIRAN 02: KATALOG FORMULA MATEMATIS PENGGAJIAN LENGKAP
**Aplikasi Multi-Tenant SaaS CatatGaji**
*Dokumen Spesifikasi Rumus Matematis & Algoritma Kalkulasi Payroll Engine Berdasarkan Hukum Positif Indonesia*

---

## DAFTAR ISI
1. [Prinsip Desain & Konvensi Notasi Matematika](#1-prinsip-desain--konvensi-notasi-matematika)
2. [Formula Prorata Gaji Pokok & Tunjangan](#2-formula-prorata-gaji-pokok--tunjangan)
3. [Formula Upah Lembur (Overtime) PP No. 35/2021](#3-formula-upah-lembur-overtime-pp-no-352021)
4. [Formula Iuran BPJS Ketenagakerjaan (4 Program + JKP)](#4-formula-iuran-bpjs-ketenagakerjaan-4-program--jkp)
5. [Formula Iuran BPJS Kesehatan & Penambahan Anggota](#5-formula-iuran-bpjs-kesehatan--penambahan-anggota)
6. [Formula Penghasilan Bruto & Pengurang PPh 21](#6-formula-penghasilan-bruto--pengurang-pph-21)
7. [Formula Biaya Jabatan & Iuran Pensiun Pengurang](#7-formula-biaya-jabatan--iuran-pensiun-pengurang)
8. [Formula PPh 21 TER Bulanan (Masa Jan–Nov)](#8-formula-pph-21-ter-bulanan-masa-jannov)
9. [Formula PPh 21 Rekonsiliasi Tahunan (Masa Desember / Resign)](#9-formula-pph-21-rekonsiliasi-tahunan-masa-desember--resign)
10. [Formula Skema Pemotongan Pajak: Gross, Gross-Up, dan Net](#10-formula-skema-pemotongan-pajak-gross-gross-up-dan-net)
11. [Formula PPh 21 Bukan Pegawai (Tenaga Ahli / Freelancer)](#11-formula-pph-21-bukan-pegawai-tenaga-ahli--freelancer)
12. [Formula PPh 21 Pesangon Final (PP No. 68/2009)](#12-formula-pph-21-pesangon-final-pp-no-682009)
13. [Formula Tunjangan Hari Raya (THR) Keagamaan](#13-formula-tunjangan-hari-raya-thr-keagamaan)
14. [Formula Uang Kompensasi PKWT (PP No. 35/2021)](#14-formula-uang-kompensasi-pkwt-pp-no-352021)
15. [Formula Uang Pesangon (UP), UPMK, UPH & Faktor Pengali PHK](#15-formula-uang-pesangon-up-upmk-uph--faktor-pengali-phk)
16. [Formula Take Home Pay (THP) & Total Payroll Cost Perusahaan](#16-formula-take-home-pay-thp--total-payroll-cost-perusahaan)

---

## 1. PRINSIP DESAIN & KONVENSI NOTASI MATEMATIKA

Seluruh kalkulasi dalam engine CatatGaji dirancang dengan prinsip:
1. **Determinisme Mutlak**: Hasil perhitungan untuk input parameter yang sama selalu menghasilkan output nominal yang identik.
2. **Kepatuhan Hirarki Hukum**: Setiap variabel perhitungan memiliki dasar rujukan hukum yang eksplisit (UU/PP/PMK/Perpres/Permenaker).
3. **Presisi Aritmatika**:
   - Nilai antara (*intermediate calculation values*) dihitung dengan presisi desimal minimal 4 digit dan disimpan di database dengan format `NUMERIC(15, 2)` atau `NUMERIC(18, 2)`.
   - Nilai akhir pajak PPh 21 dan Take Home Pay dibulatkan ke satuan Rupiah penuh sesuai regulasi masing-masing.

> **⚠️ Catatan Implementasi — Konstanta yang Dapat Dikonfigurasi**
>
> Seluruh konstanta regulasi berikut bersifat **time-sensitive** dan dapat berubah setiap tahun melalui peraturan pemerintah yang baru. Dalam implementasi software, konstanta-konstanta ini **WAJIB** disimpan sebagai parameter yang dapat dikonfigurasi, **BUKAN** di-hard-code dalam kode program.
>
> **Konstanta yang harus dikonfigurasi:**
> | Konstanta | Nilai 2024 | Sumber Perubahan |
> |-----------|-----------|------------------|
> | Batas upah JP | Rp 10.042.300 | PP Pemerintah (tahunan) |
> | Batas upah BPJS Kesehatan | Rp 12.000.000 | Perpres (periodik) |
> | Nilai PTKP (TK/0, K/0, dst.) | Rp 54.000.000 (TK/0) | PMK (saat ada perubahan) |
> | Tarif JKK per kelas risiko | 0,24% - 1,74% | PP (saat ada perubahan) |
> | UMP/UMK per provinsi/kota | Bervariasi | Pergub/Perbup (tahunan) |
> | Bracket tarif Pasal 17 | 5% - 35% | UU (saat ada perubahan) |
> | Tabel TER A, B, C | Sesuai PMK 168/2023 | PMK (saat ada perubahan) |
>
> **Pendekatan Implementasi yang Direkomendasikan:**
> ```json
> // regulatory-constants.json
> {
>   "version": "2024.1",
>   "effective_date": "2024-01-01",
>   "jp_salary_cap": 10042300,
>   "bpjs_kes_salary_cap": 12000000,
>   "ptkp": {
>     "TK/0": 54000000,
>     "TK/1": 58500000,
>     "TK/2": 63000000,
>     "TK/3": 67500000,
>     "K/0": 58500000,
>     "K/1": 63000000,
>     "K/2": 67500000,
>     "K/3": 72000000
>   }
> }
> ```
> File konfigurasi ini dapat diperbarui melalui antarmuka admin tanpa perlu deployment ulang aplikasi.

---

## 2. FORMULA PRORATA GAJI POKOK & TUNJANGAN

Digunakan ketika karyawan mulai bekerja (*join date*) atau berhenti bekerja (*resign/termination date*) di pertengahan periode penggajian bulanan.

### 2.1 Metode Hari Kerja Aktual (Standard Modern Payroll)
$$\text{Gaji Prorata} = \frac{\text{Hari Kerja Aktif Dijalani}}{\text{Total Hari Kerja Standar dalam Periode Tersebut}} \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$$

- $\text{Hari Kerja Aktif Dijalani}$: Jumlah hari kerja riil yang dijalani karyawan sejak tanggal bergabung hingga akhir periode (atau awal periode hingga tanggal efektif keluar), tidak termasuk hari libur mingguan dan libur nasional resmi.
- $\text{Total Hari Kerja Standar}$: Jumlah hari kerja operasional perusahaan pada bulan berjalan (misal: 21 hari kerja pada sistem 5 hari/minggu atau 25 hari kerja pada sistem 6 hari/minggu).

### 2.2 Metode Hari Kalender / Standar Depnaker (Formula 1/25 atau 1/21)
$$\text{Gaji Prorata (5 Hari Kerja)} = \frac{\text{Hari Kerja Masuk}}{21} \times \text{Upah Sebulan}$$
$$\text{Gaji Prorata (6 Hari Kerja)} = \frac{\text{Hari Kerja Masuk}}{25} \times \text{Upah Sebulan}$$

*Catatan Engine*: Sistem CatatGaji menyediakan sakelar konfigurasi (*tenant configuration switch*) untuk memilih salah satu dari kedua metode prorata di atas.

---

## 3. FORMULA UPAH LEMBUR (OVERTIME) PP NO. 35/2021

Dasar Hukum: **PP No. 35 Tahun 2021** tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja (Pasal 31 s/d Pasal 34).

### 3.1 Dasar Perhitungan Upah Sejam
$$\text{Upah Sejam Lembur} = \frac{1}{173} \times \text{Dasar Upah Sebulan}$$

**Ketentuan Penentuan Dasar Upah Sebulan**:
1. Jika upah terdiri dari **Gaji Pokok saja**: $\text{Dasar Upah} = \text{Gaji Pokok}$.
2. Jika upah terdiri dari **Gaji Pokok dan Tunjangan Tetap**: $\text{Dasar Upah} = \text{Gaji Pokok} + \text{Tunjangan Tetap}$.
3. Jika upah terdiri dari **Gaji Pokok, Tunjangan Tetap, dan Tunjangan Tidak Tetap**:
   $$\text{Dasar Upah} = \max\left(\text{Gaji Pokok} + \text{Tunjangan Tetap},\ 75\% \times \text{Total Upah}\right)$$
4. Jika total upah lebih kecil dari Upah Minimum Provinsi/Kabupaten/Kota (UMP/UMK) yang berlaku:
   $$\text{Dasar Upah} = \text{UMK Setempat}$$

---

### 3.2 Multiplier Lembur Hari Kerja Biasa
Maksimal lembur hari kerja: 4 jam/hari dan 18 jam/minggu.

$$\text{Upah Lembur Hari Kerja} = \left(1,5 \times \text{Jam Ke-1} + 2,0 \times \sum \text{Jam Ke-2 dst}\right) \times \text{Upah Sejam}$$

*Tabel Faktor Pengali*:
| Jam Lembur Hari Kerja | Multiplier | Formula Jam Terhitung |
|---|:---:|---|
| **Jam ke-1** | $1,5\times$ | $1 \times 1,5 = 1,5$ jam |
| **Jam ke-2 s/d ke-4** | $2,0\times$ | $N \times 2,0$ jam |

---

### 3.3 Multiplier Lembur Hari Istirahat Mingguan / Hari Libur Resmi

#### A. Skema 5 Hari Kerja (40 Jam/Minggu)
$$\text{Jam Pengali (5 Hari)} = \begin{cases} 
2,0 \times h & \text{jika } h \le 8 \\
(2,0 \times 8) + 3,0 \times (h - 8) & \text{jika } 8 < h \le 9 \\
(2,0 \times 8) + (3,0 \times 1) + 4,0 \times (h - 9) & \text{jika } 9 < h \le 12 
\end{cases}$$
$$\text{Upah Lembur Libur (5 Hari)} = \text{Jam Pengali} \times \text{Upah Sejam}$$

#### B. Skema 6 Hari Kerja (40 Jam/Minggu)
$$\text{Jam Pengali (6 Hari)} = \begin{cases} 
2,0 \times h & \text{jika } h \le 7 \\
(2,0 \times 7) + 3,0 \times (h - 7) & \text{jika } 7 < h \le 8 \\
(2,0 \times 7) + (3,0 \times 1) + 4,0 \times (h - 8) & \text{jika } 8 < h \le 11 
\end{cases}$$
$$\text{Upah Lembur Libur (6 Hari)} = \text{Jam Pengali} \times \text{Upah Sejam}$$

#### C. Hari Libur Resmi yang Jatuh pada Hari Kerja Terpendek (Contoh: Jumat 5 Jam pada Sistem 6 Hari Kerja)
$$\text{Jam Pengali (Hari Pendek)} = \begin{cases} 
2,0 \times h & \text{jika } h \le 5 \\
(2,0 \times 5) + 3,0 \times (h - 5) & \text{jika } 5 < h \le 6 \\
(2,0 \times 5) + (3,0 \times 1) + 4,0 \times (h - 6) & \text{jika } 6 < h \le 8 
\end{cases}$$

---

## 4. FORMULA IURAN BPJS KETENAGAKERJAAN (4 PROGRAM + JKP)

Dasar Hukum: **UU No. 24 Tahun 2011**, **PP No. 44/2015**, **PP No. 45/2015**, **PP No. 46/2015**, dan **PP No. 37/2021**.

### 4.1 Dasar Upah Perhitungan BPJS Ketenagakerjaan
$$\text{Dasar Upah BPJS TK} = \text{Gaji Pokok} + \text{Tunjangan Tetap}$$

---

### 4.2 Rincian Formula Per Program

#### 1. Jaminan Kecelakaan Kerja (JKK)
Ditanggung **100% oleh Pemberi Kerja** (Perusahaan):
$$\text{Iuran JKK} = \text{Tarif Kelas Risiko JKK} \times \text{Dasar Upah BPJS TK}$$
- Kelompok I (Sangat Rendah): $\text{Tarif} = 0,24\%$
- Kelompok II (Rendah): $\text{Tarif} = 0,54\%$
- Kelompok III (Sedang): $\text{Tarif} = 0,89\%$
- Kelompok IV (Tinggi): $\text{Tarif} = 1,27\%$
- Kelompok V (Sangat Tinggi): $\text{Tarif} = 1,74\%$

#### 2. Jaminan Kematian (JKM)
Ditanggung **100% oleh Pemberi Kerja** (Perusahaan):
$$\text{Iuran JKM} = 0,30\% \times \text{Dasar Upah BPJS TK}$$

#### 3. Jaminan Hari Tua (JHT)
Total Iuran: **5,70%** dari Dasar Upah BPJS TK (Tanpa Batas Upah Maksimal).
$$\text{Iuran JHT Ditanggung Perusahaan} = 3,70\% \times \text{Dasar Upah BPJS TK}$$
$$\text{Iuran JHT Dipotong dari Pekerja} = 2,00\% \times \text{Dasar Upah BPJS TK}$$

#### 4. Jaminan Pensiun (JP)
Total Iuran: **3,00%** dari Dasar Upah Terproteksi Capping Upah Maksimal.
$$\text{Dasar Upah JP} = \min\left(\text{Dasar Upah BPJS TK},\ \text{Capping Maksimal JP}\right)$$
$$\text{Iuran JP Ditanggung Perusahaan} = 2,00\% \times \text{Dasar Upah JP}$$
$$\text{Iuran JP Dipotong dari Pekerja} = 1,00\% \times \text{Dasar Upah JP}$$

*Tabel Parameter Capping JP*:
- Periode 1 Maret 2024 s/d 28 Februari 2025: $\text{Capping} = \text{Rp 10.042.300}$
- Periode 1 Maret 2025 s/d 28 Februari 2026: $\text{Capping} = \text{Rp 10.547.400}$ (atau penyesuaian resmi BPJS TK)

#### 5. Jaminan Kehilangan Pekerjaan (JKP)
Total Iuran: **0,46%** (0,24% rekomposisi dari iuran program JKK & JKM + 0,22% dari APBN).  
*Catatan*: Tidak menimbulkan potongan tambahan pada gaji pekerja maupun biaya ekstra di luar iuran JKK/JKM perusahaan.

---

## 5. FORMULA IURAN BPJS KESEHATAN & PENAMBAHAN ANGGOTA

Dasar Hukum: **Perpres No. 82/2018**, **Perpres No. 75/2019**, **Perpres No. 64/2020**, dan **Perpres No. 59/2024**.

### 5.1 Dasar Upah & Plafon Maksimum
$$\text{Dasar Upah BPJS Kes} = \min\left(\max\left(\text{Gaji Pokok} + \text{Tunjangan Tetap},\ \text{UMK Setempat}\right),\ \text{Rp 12.000.000}\right)$$

### 5.2 Iuran Standar (Mencakup 5 Anggota Keluarga)
$$\text{Iuran BPJS Kes Ditanggung Perusahaan} = 4,00\% \times \text{Dasar Upah BPJS Kes}$$
$$\text{Iuran BPJS Kes Dipotong dari Pekerja} = 1,00\% \times \text{Dasar Upah BPJS Kes}$$
$$\text{Total Iuran BPJS Kes Maksimum} = 5\% \times \text{Rp 12.000.000} = \text{Rp 600.000 / bulan}$$
$$\text{Maksimal Beban Perusahaan} = 4\% \times \text{Rp 12.000.000} = \text{Rp 480.000 / bulan}$$
$$\text{Maksimal Potongan Pekerja} = 1\% \times \text{Rp 12.000.000} = \text{Rp 120.000 / bulan}$$

### 5.3 Iuran Tambahan Anggota Keluarga (Anak ke-4 dst, Orang Tua, Mertua)
$$\text{Iuran Tambahan BPJS Kes} = \text{Jumlah Anggota Tambahan} \times 1,00\% \times \text{Dasar Upah BPJS Kes}$$
*Catatan*: Seluruh iuran tambahan ini dipotong langsung dari upah pekerja.

---

## 6. FORMULA PENGHASILAN BRUTO & PENGURANG PPH 21

### 6.1 Komposisi Penghasilan Bruto PPh 21 Bulanan
$$\text{Penghasilan Bruto PPh 21} = \text{Gaji Pokok} + \text{Tunjangan Tetap} + \text{Tunjangan Tidak Tetap} + \text{Upah Lembur} + \text{Bonus/THR} + \text{Premi Asuransi Perusahaan} + \text{Natura Objek Pajak}$$

Di mana:
$$\text{Premi Asuransi Perusahaan} = \text{Iuran JKK Perusahaan} + \text{Iuran JKM Perusahaan} + \text{Iuran BPJS Kes (4\%) Perusahaan}$$

*Komponen yang BUKAN Penambah Bruto Pajak*:
- Iuran JHT Perusahaan (3,70%) $\rightarrow$ Bukan objek pajak bagi pegawai (Pasal 8 PMK 168/2023).
- Iuran JP Perusahaan (2,00%) $\rightarrow$ Bukan objek pajak bagi pegawai (Pasal 8 PMK 168/2023).
- Fasilitas Natura Non-Objek Pajak (PMK No. 66/2023).

---

## 7. FORMULA BIAYA JABATAN & IURAN PENSIUN PENGURANG

Komponen ini digunakan saat menghitung **Penghasilan Neto** untuk rekonsiliasi PPh 21 Tahunan (Masa Desember atau Resign).

### 7.1 Formula Biaya Jabatan
$$\text{Biaya Jabatan Bulanan} = \min\left(5\% \times \text{Penghasilan Bruto Bulanan},\ \text{Rp 500.000}\right)$$
$$\text{Biaya Jabatan Tahunan} = \min\left(5\% \times \text{Penghasilan Bruto Setahun},\ \text{Bulan Aktif Bekerja} \times \text{Rp 500.000}\right)$$
*(Plafon maksimal setahun penuh 12 bulan = $\text{Rp 6.000.000}$)*.

### 7.2 Formula Iuran Pengurang Penghasilan Neto
$$\text{Total Iuran Pengurang} = \text{Iuran JHT Pekerja (2\%)} + \text{Iuran JP Pekerja (1\%) per bulan}$$
*Catatan Larangan*: Iuran BPJS Kesehatan porsi pekerja (1%) **TIDAK BOLEH** dikurangkan dari penghasilan bruto dalam perhitungan PPh 21.

---

## 8. FORMULA PPH 21 TER BULANAN (MASA JAN–NOV)

Dasar Hukum: **PP No. 58 Tahun 2023** dan **PMK No. 168 Tahun 2023**.

$$\text{Kategori TER} = \text{MapPTKP}(\text{Status PTKP Karyawan}) \in \{\text{A},\ \text{B},\ \text{C}\}$$
$$\text{Tarif TER} = \text{LookupTERRate}(\text{Kategori TER},\ \text{Penghasilan Bruto PPh 21 Bulanan})$$
$$\text{PPh 21 TER Bulanan} = \text{Penghasilan Bruto PPh 21 Bulanan} \times \text{Tarif TER}$$

*Aturan Pembulatan PPh 21 Bulanan*: Dibulatkan ke bawah ke satuan Rupiah penuh.

---

## 9. FORMULA PPH 21 REKONSILIASI TAHUNAN (MASA DESEMBER / RESIGN)

Dasar Hukum: **Pasal 17 ayat (1) huruf a UU HPP** jo. **PMK No. 168 Tahun 2023**.

### Langkah 1: Penghitungan Penghasilan Neto Setahun
$$\text{Penghasilan Bruto Setahun} = \sum_{m=1}^{N} \text{Penghasilan Bruto Bulanan}$$
$$\text{Total Biaya Jabatan Setahun} = \min\left(5\% \times \text{Penghasilan Bruto Setahun},\ N \times \text{Rp 500.000}\right)$$
$$\text{Total Iuran Pengurang Setahun} = \sum_{m=1}^{N} (\text{JHT Pekerja}_m + \text{JP Pekerja}_m)$$
$$\text{Penghasilan Neto Setahun} = \text{Penghasilan Bruto Setahun} - \text{Total Biaya Jabatan Setahun} - \text{Total Iuran Pengurang Setahun}$$

### Langkah 2: Penghitungan Penghasilan Kena Pajak (PKP)
$$\text{PKP Riil} = \max\left(0,\ \text{Penghasilan Neto Setahun} - \text{PTKP Tahunan}\right)$$
$$\text{PKP Dibulatkan} = \lfloor \text{PKP Riil} / 1000 \rfloor \times 1000$$
*(Aturan Pembulatan: Dibulatkan ke bawah hingga ribuan Rupiah penuh)*.

### Langkah 3: Perhitungan PPh 21 Terutang Setahun (Pasal 17 UU HPP)
$$\text{PPh 21 Setahun} = \sum_{i=1}^{5} \left( \text{Tarif}_i \times \text{PKP Terkena Lapisan}_i \right)$$

Di mana:
- Lapisan 1 ($5\%$): $\min(\text{PKP},\ \text{Rp 60.000.000})$
- Lapisan 2 ($15\%$): $\max(0,\ \min(\text{PKP} - 60.000.000,\ 190.000.000))$
- Lapisan 3 ($25\%$): $\max(0,\ \min(\text{PKP} - 250.000.000,\ 250.000.000))$
- Lapisan 4 ($30\%$): $\max(0,\ \min(\text{PKP} - 500.000.000,\ 4.500.000.000))$
- Lapisan 5 ($35\%$): $\max(0,\ \text{PKP} - 5.000.000.000)$

### Langkah 4: Perhitungan PPh 21 Masa Terakhir
$$\text{PPh 21 Masa Terakhir} = \text{PPh 21 Setahun} - \sum_{m=1}^{N-1} \text{PPh 21 Telah Dipotong}$$

- Jika $\text{PPh 21 Masa Terakhir} > 0$: Karyawan mengalami **Kurang Bayar** pajak pada masa terakhir.
- Jika $\text{PPh 21 Masa Terakhir} < 0$: Terjadi **Lebih Bayar** (Kelebihan Pemotongan Pajak). Perusahaan **wajib mengembalikan** kelebihan potong tersebut ke Take Home Pay karyawan pada masa terakhir, dan mengkompensasikannya pada SPT Masa PPh 21 perusahaan.

---

## 10. FORMULA SKEMA PEMOTONGAN PAJAK: GROSS, GROSS-UP, DAN NET

### 10.1 Skema Gross (Pajak Ditanggung Karyawan)
$$\text{Tunjangan Pajak} = 0$$
$$\text{PPh 21 Dipotong} = \text{Kalkulasi PPh 21}(\text{Bruto Reguler})$$
$$\text{Take Home Pay} = \text{Gaji Kotor} - \text{Potongan BPJS Karyawan} - \text{PPh 21 Dipotong} - \text{Potongan Lain}$$

---

### 10.2 Skema Gross-Up (Tunjangan Pajak Ekualisasi PPh 21)
Perusahaan memberikan **Tunjangan Pajak** ($T_p$) yang besarnya tepat sama dengan PPh 21 yang timbul setelah tunjangan pajak ditambahkan ke penghasilan bruto:
$$T_p = \text{PPh 21}(\text{Bruto Dasar} + T_p)$$

#### A. Algoritma Iteratif Konvergen untuk TER Bulanan (Masa Jan–Nov)
Karena tarif TER ($r$) berbentuk fungsi tangga (*step function*), pencarian nilai $T_p$ dilakukan secara deterministik:
1. Tetapkan tebakan awal: $T_p^{(0)} = r_0 \times \text{Bruto Dasar}$, di mana $r_0 = \text{LookupTERRate}(\text{Bruto Dasar})$.
2. Iterasi:
   $$\text{Bruto Baru} = \text{Bruto Dasar} + T_p^{(k)}$$
   $$r_{k+1} = \text{LookupTERRate}(\text{Bruto Baru})$$
   $$T_p^{(k+1)} = \frac{r_{k+1} \times \text{Bruto Dasar}}{1 - r_{k+1}}$$
3. Berhenti saat $|T_p^{(k+1)} - T_p^{(k)}| < 1$ Rupiah (biasanya konvergen dalam 1–2 iterasi).

#### B. Formula Aljabar Pasal 17 Gross-Up (Masa Desember / Tahunan)
Berdasarkan lapisan Penghasilan Kena Pajak Dasar Tanpa Tunjangan Pajak ($\text{PKP}_0 = \text{Neto Dasar} - \text{PTKP}$):

| Rentang $\text{PKP}_0$ (Rp) | Formula Tunjangan Pajak Tahunan ($T_{p\_thn}$) |
|---|---|
| Rp 0 s/d Rp 57.000.000 | $\frac{\text{PKP}_0 \times 0,05}{1 - 0,05} = \frac{\text{PKP}_0}{0,95} \times 0,05$ |
| > Rp 57.000.000 s/d Rp 218.500.000 | $\frac{(\text{PKP}_0 - 60.000.000) \times 0,15 + 3.000.000}{0,85}$ |
| > Rp 218.500.000 s/d Rp 406.000.000 | $\frac{(\text{PKP}_0 - 250.000.000) \times 0,25 + 31.500.000}{0,75}$ |
| > Rp 406.000.000 s/d Rp 3.556.000.000 | $\frac{(\text{PKP}_0 - 500.000.000) \times 0,30 + 94.000.000}{0,70}$ |
| > Rp 3.556.000.000 | $\frac{(\text{PKP}_0 - 5.000.000.000) \times 0,35 + 1.444.000.000}{0,65}$ |

---

### 10.3 Skema Net (Pajak Ditanggung Perusahaan Tanpa Tunjangan Pajak)
- Nilai PPh 21 dihitung sama seperti skema Gross.
- Perusahaan membayar PPh 21 ke kas negara sebagai beban non-operasional (*non-deductible expense* fiskal).
- Karyawan menerima Take Home Pay tanpa pemotongan PPh 21.

---

## 11. FORMULA PPH 21 BUKAN PEGAWAI (TENAGA AHLI / FREELANCER)

Dasar Hukum: **Pasal 3 ayat (1) huruf c** dan **Pasal 10 PMK No. 168 Tahun 2023**.

$$\text{Dasar Pengenaan Pajak (DPP)} = 50\% \times \text{Penghasilan Bruto}$$
$$\text{PPh 21 Bukan Pegawai} = \text{Tarif Progresif Pasal 17 UU HPP} \times \text{DPP Kumulatif}$$

*Catatan*: Bagi Bukan Pegawai, ketentuan PTKP bulanan tidak lagi dikurangkan. Tarif Pasal 17 diterapkan secara berkesinambungan/kumulatif atas DPP 50% dalam tahun kalender berjalan.

---

## 12. FORMULA PPH 21 PESANGON FINAL (PP NO. 68/2009)

Dasar Hukum: **PP No. 68 Tahun 2009** tentang Tarif PPh Pasal 21 atas Uang Pesangon, Uang Manfaat Pensiun, THT, dan JHT yang Dibayarkan Sekaligus.

Pemotongan PPh 21 bersifat **FINAL** dengan tarif berjenjang atas Penghasilan Bruto Pesangon:

$$\text{PPh 21 Pesangon} = \sum_{j=1}^{4} \left( \text{Tarif Final}_j \times \text{Bruto Lapisan}_j \right)$$

*Tabel Lapisan Tarif Final*:
| Lapisan | Rentang Penghasilan Bruto Pesangon (Rp) | Tarif Final (%) | Formula Pajak Lapisan |
|:-------:|:---------------------------------------|:---------------:|:----------------------|
| **1** | s/d Rp 50.000.000 | **0%** | $\text{Bruto}_1 \times 0\%$ (Bebas Pajak) |
| **2** | > Rp 50.000.000 s/d Rp 100.000.000 | **5%** | $(\text{Bruto}_2 - 50.000.000) \times 5\%$ |
| **3** | > Rp 100.000.000 s/d Rp 500.000.000 | **15%** | $(\text{Bruto}_3 - 100.000.000) \times 15\%$ |
| **4** | > Rp 500.000.000 | **25%** | $(\text{Bruto}_4 - 500.000.000) \times 25\%$ |

*Ketentuan Pembayaran Bertahap*:
- Jika uang pesangon dibayarkan bertahap dalam rentang waktu maksimal 2 (dua) tahun kalender, seluruhnya dikenakan tarif final di atas secara kumulatif.
- Jika pembayaran berlanjut pada tahun ke-3 dan seterusnya, pemotongan PPh 21 tahun ke-3 diperlakukan sebagai penghasilan tidak final dengan tarif Pasal 17 UU HPP.

---

## 13. FORMULA TUNJANGAN HARI RAYA (THR) KEAGAMAAN

Dasar Hukum: **Permenaker No. 6 Tahun 2016** tentang Tunjangan Hari Raya Keagamaan bagi Pekerja/Buruh di Perusahaan.

### 13.1 Formula Nilai THR Bruto
$$\text{THR} = \begin{cases} 
1 \times (\text{Gaji Pokok} + \text{Tunjangan Tetap}) & \text{jika Masa Kerja} \ge 12 \text{ Bulan} \\
\frac{\text{Masa Kerja (Bulan)}}{12} \times (\text{Gaji Pokok} + \text{Tunjangan Tetap}) & \text{jika } 1 \le \text{Masa Kerja} < 12 \text{ Bulan} \\
0 & \text{jika Masa Kerja} < 1 \text{ Bulan}
\end{cases}$$

### 13.2 Formula Pekerja Harian Lepas / Upah Borongan
- Masa Kerja $\ge 12$ bulan: $\text{Upah 1 Bulan} = \text{Rata-rata upah yang diterima dalam 12 bulan terakhir}$.
- Masa Kerja $1 \le M < 12$ bulan: $\text{Upah 1 Bulan} = \text{Rata-rata upah yang diterima tiap bulan selama bekerja}$.

### 13.3 Formula PPh 21 atas Pembayaran THR (Metode TER Bulanan)
$$\text{Bruto Bulan THR} = \text{Gaji Bulanan} + \text{Premi BPJS Perusahaan} + \text{THR}$$
$$\text{Tarif TER Bulan THR} = \text{LookupTERRate}(\text{Kategori TER},\ \text{Bruto Bulan THR})$$
$$\text{PPh 21 Bulan THR} = \text{Bruto Bulan THR} \times \text{Tarif TER Bulan THR}$$

---

## 14. FORMULA UANG KOMPENSASI PKWT (PP NO. 35/2021)

Dasar Hukum: **Pasal 15 & Pasal 16 PP No. 35 Tahun 2021**.

Uang kompensasi wajib diberikan pada setiap akhir jangka waktu kontrak PKWT atau perpanjangannya bagi pekerja yang memiliki masa kerja minimal 1 (satu) bulan terus-menerus:

$$\text{Uang Kompensasi PKWT} = \frac{\text{Masa Kerja Riil (Bulan)}}{12} \times 1 \text{ Bulan Upah}$$

Di mana:
- $1 \text{ Bulan Upah} = \text{Gaji Pokok} + \text{Tunjangan Tetap}$.
- Jika masa kerja memiliki sisa hari: $\text{Masa Kerja (Bulan)} = \text{Bulan Penuh} + \frac{\text{Sisa Hari Kerja}}{30}$.
- Perlakuan Pajak: Uang kompensasi PKWT diperlakukan sebagai **penghasilan tidak teratur pegawai** (bukan pesangon final PP 68/2009), digabungkan ke penghasilan bruto masa terakhir dan dihitung dengan TER bulanan atau rekonsiliasi Pasal 17 tahunan.

---

## 15. FORMULA UANG PESANGON (UP), UPMK, UPH & FAKTOR PENGALI PHK

Dasar Hukum: **Pasal 40 s/d Pasal 59 PP No. 35 Tahun 2021**.

### 15.1 Komponen Standar Hak PHK
$$\text{Total Kompensasi PHK} = (\text{Faktor UP} \times \text{UP}) + (\text{Faktor UPMK} \times \text{UPMK}) + \text{UPH}$$

---

### 15.2 Tabel Uang Pesangon (UP) — Pasal 40 ayat (2)
| Masa Kerja | Nilai Uang Pesangon (UP) |
|---|---|
| $< 1$ tahun | 1 bulan upah |
| $1 \le \text{tahun} < 2$ | 2 bulan upah |
| $2 \le \text{tahun} < 3$ | 3 bulan upah |
| $3 \le \text{tahun} < 4$ | 4 bulan upah |
| $4 \le \text{tahun} < 5$ | 5 bulan upah |
| $5 \le \text{tahun} < 6$ | 6 bulan upah |
| $6 \le \text{tahun} < 7$ | 7 bulan upah |
| $7 \le \text{tahun} < 8$ | 8 bulan upah |
| $\ge 8$ tahun | **9 bulan upah (Maksimal)** |

---

### 15.3 Tabel Uang Penghargaan Masa Kerja (UPMK) — Pasal 40 ayat (3)
| Masa Kerja | Nilai UPMK |
|---|---|
| $< 3$ tahun | 0 bulan upah |
| $3 \le \text{tahun} < 6$ | 2 bulan upah |
| $6 \le \text{tahun} < 9$ | 3 bulan upah |
| $9 \le \text{tahun} < 12$ | 4 bulan upah |
| $12 \le \text{tahun} < 15$ | 5 bulan upah |
| $15 \le \text{tahun} < 18$ | 6 bulan upah |
| $18 \le \text{tahun} < 21$ | 7 bulan upah |
| $21 \le \text{tahun} < 24$ | 8 bulan upah |
| $\ge 24$ tahun | **10 bulan upah (Maksimal)** |

---

### 15.4 Uang Penggantian Hak (UPH) — Pasal 40 ayat (4)
$$\text{UPH} = \left(\frac{\text{Sisa Cuti Tahunan (Hari)}}{\text{Hari Kerja Sebulan}} \times \text{Upah Sebulan}\right) + \text{Biaya Ongkos Pulang} + \text{Kompensasi Lain PK/PP/PKB}$$

---

### 15.5 Matriks Faktor Pengali Berdasarkan Alasan Pemutusan Hubungan Kerja (PHK)

| Alasan PHK | Rujukan PP 35/2021 | Faktor UP | Faktor UPMK | UPH |
|---|:---:|:---:|:---:|:---:|
| **Efisiensi karena perusahaan rugi** | Pasal 43 (1) | **0,5x** | **1,0x** | Ya |
| **Efisiensi untuk mencegah kerugian** | Pasal 43 (2) | **1,0x** | **1,0x** | Ya |
| **Tutup akibat force majeure** | Pasal 45 (1) | **0,5x** | **1,0x** | Ya |
| **Tutup bukan karena rugi** | Pasal 44 (2) | **1,0x** | **1,0x** | Ya |
| **Perusahaan Pailit** | Pasal 47 | **0,5x** | **1,0x** | Ya |
| **Pekerja Meninggal Dunia** | Pasal 57 | **2,0x** | **1,0x** | Ya |
| **Pekerja Pensiun** | Pasal 56 | **1,75x** | **1,0x** | Ya |
| **Pekerja Sakit Berkepanjangan / Cacat > 12 Bln** | Pasal 55 | **2,0x** | **1,0x** | Ya |
| **Pekerja Melakukan Pelanggaran (SP3)** | Pasal 52 (1) | **0,5x** | **1,0x** | Ya |
| **Pekerja Resign Sukarela** | Pasal 50 | **0x** | **0x** | UPH + Uang Pisah (sesuai PP/PKB) |

---

## 16. FORMULA TAKE HOME PAY (THP) & TOTAL PAYROLL COST PERUSAHAAN

### 16.1 Formula Take Home Pay (THP) Karyawan
$$\text{Penghasilan Kotor Earning} = \text{Gaji Pokok} + \text{Tunjangan Tetap} + \text{Tunjangan Tidak Tetap} + \text{Upah Lembur} + \text{Bonus/THR} + \text{Tunjangan Pajak (Gross-up)}$$
$$\text{Total Potongan Karyawan} = \text{JHT Pekerja (2\%)} + \text{JP Pekerja (1\%)} + \text{BPJS Kes Pekerja (1\%)} + \text{PPh 21 Dipotong} + \text{Kasbon/Pinjaman} + \text{Potongan Absensi}$$
$$\mathbf{Take\ Home\ Pay\ (THP)} = \text{Penghasilan Kotor Earning} - \text{Total Potongan Karyawan}$$

---

### 16.2 Formula Grand Total Payroll Cost (Beban Perusahaan)
$$\mathbf{Grand\ Total\ Payroll\ Cost} = \text{Total Gaji Kotor Earning} + \text{Total Beban BPJS Pemberi Kerja} + \text{Beban PPh 21 Net (jika ada)}$$

Di mana:
$$\text{Total Beban BPJS Pemberi Kerja} = \text{JKK} + \text{JKM} + \text{JHT (3,7\%)} + \text{JP (2\%)} + \text{BPJS Kesehatan (4\%) + JKP (rekomposisi)}$$

---
*Katalog Formula Matematis ini menjadi spesifikasi algoritma resmi pada engine kalkulasi dan modul testing automated CatatGaji.*
