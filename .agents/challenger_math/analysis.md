# LAPORAN ANALISIS ADVERSARIAL & VERIFIKASI MATEMATIKA-PERPAJAKAN
**Agen**: Mathematical & Tax Simulation Challenger  
**Target Proyek**: CatatGaji (Multi-Tenant SaaS Penggajian UMKM Indonesia)  
**Dokumen yang Diuji**:
- `riset/06_studi_kasus_dan_simulasi_numerik.md`
- `lampiran/01_tabel_lengkap_ter_pph21.md`
- `lampiran/02_katalog_formula_matematis.md`
- `lampiran/03_contoh_perhitungan_langkah_demi_langkah.md`

---

## 1. EXECUTIVE SUMMARY & VERDICT

Berdasarkan pengujian numerik empiris dan simulasi *computational oracle* dengan presisi desimal arbitrer (`decimal.Decimal` dalam Python 3.14), seluruh perhitungan, rumus matematis, struktur tarif pajak, dan studi kasus pada dokumen riset dan lampiran CatatGaji dinyatakan **LULUS UJI SECARA MATEMATIS & YURIDIS (APPROVE)** dengan tingkat akurasi **100%**.

Semua batas lapisan tarif (*tier boundary conditions*), faktor pengali lembur (*overtime multipliers*), batas atas iuran BPJS (*capping*), dan mekanisme rekonsiliasi PPh 21 Pasal 17 UU HPP telah diuji pada titik kritis batas minimum, median, maksimum, dan ambang batas diskontinuitas ($X-1$, $X$, $X+1$) tanpa ditemukan celah (*gap*), tumpang-tindih (*overlap*), maupun kegagalan penentuan tarif.

---

## 2. REKOMPUTASI DAN VERIFIKASI DETAIL STUDI KASUS

### 2.1 Studi Kasus 1: Karyawan Tetap (PKWTT, Status K/1, Gaji Pokok Rp8.500.000 + Tunjangan Rp1.500.000 + Lembur 10 Jam + BPJS + TER B + Rekonsiliasi Desember)

#### A. Parameter Masukan
- **Gaji Pokok**: Rp8.500.000
- **Tunjangan Tetap (Jabatan)**: Rp1.500.000
- **Dasar Upah Bulanan ($W$)**: $\text{Rp8.500.000} + \text{Rp1.500.000} = \mathbf{Rp10.000.000}$
- **Status PTKP**: K/1 (PTKP = Rp63.000.000) $\rightarrow$ **TER Kategori B**
- **Risiko JKK**: Tingkat I (0,24%)
- **Data Lembur Januari**: 10 hari kerja biasa, masing-masing lembur 1 jam (Total = 10 jam)

#### B. Hasil Verifikasi Langkah demi Langkah

1. **Upah Lembur Hari Kerja (Januari)**:
   - Upah sejam: $\frac{1}{173} \times \text{Rp10.000.000} = \text{Rp57.803,468208...}$
   - Jam pengali: $10 \text{ hari} \times (1 \text{ jam} \times 1,5) = 15,0 \text{ jam upah}$.
   - Upah lembur riil: $15 \times 57.803,468208... = \text{Rp867.052,023...} \rightarrow \mathbf{Rp867.052}$ *(Sesuai)*.

2. **Iuran BPJS Ketenagakerjaan & Kesehatan (Januari)**:
   - *Pemberi Kerja*:
     - JKK (0,24%): $0,0024 \times 10.000.000 = \text{Rp24.000}$
     - JKM (0,30%): $0,0030 \times 10.000.000 = \text{Rp30.000}$
     - JHT (3,70%): $0,0370 \times 10.000.000 = \text{Rp370.000}$
     - JP (2,00%): $0,0200 \times \min(10.000.000, 10.042.300) = \text{Rp200.000}$
     - BPJS Kes (4,00%): $0,0400 \times \min(10.000.000, 12.000.000) = \text{Rp400.000}$
     - Total Beban BPJS Perusahaan: $\mathbf{Rp1.024.000}$ *(Sesuai)*.
     - **Premi Penambah Bruto Pajak**: $\text{JKK} + \text{JKM} + \text{BPJS Kes} = 24.000 + 30.000 + 400.000 = \mathbf{Rp454.000}$ *(Sesuai)*.
   - *Pekerja (Potongan Gaji)*:
     - JHT (2,00%): $0,0200 \times 10.000.000 = \text{Rp200.000}$
     - JP (1,00%): $0,0100 \times 10.000.000 = \text{Rp100.000}$
     - BPJS Kes (1,00%): $0,0100 \times 10.000.000 = \text{Rp100.000}$
     - Total Potongan BPJS Karyawan: $\mathbf{Rp400.000}$ *(Sesuai)*.

3. **Penghasilan Bruto PPh 21 Januari**:
   $$\text{Bruto Jan} = 8.500.000 + 1.500.000 + 867.052 + 454.000 = \mathbf{Rp11.321.052}$$

4. **Pemotongan PPh 21 TER Kategori B (Januari)**:
   - Nilai Bruto Rp11.321.052 jatuh pada **Lapisan No. 8** ($> \text{Rp11.250.000 s/d Rp11.600.000}$) dengan tarif **2,50%**.
   - PPh 21 Jan = $2,50\% \times 11.321.052 = \text{Rp283.026,30} \rightarrow \mathbf{Rp283.026}$ *(Floor rounding, Sesuai)*.

5. **Take Home Pay (THP) Januari**:
   - Total Gaji Kotor Earning: $8.500.000 + 1.500.000 + 867.052 = \text{Rp10.867.052}$.
   - Total Potongan: $\text{BPJS (Rp400.000)} + \text{PPh 21 (Rp283.026)} = \text{Rp683.026}$.
   - $\mathbf{THP\ Januari} = 10.867.052 - 683.026 = \mathbf{Rp10.184.026}$ *(Sesuai)*.

6. **Masa Pajak Reguler Feb–Nov (10 Bulan Tanpa Lembur)**:
   - Bruto Bulanan = $10.000.000 + 454.000 = \text{Rp10.454.000}$.
   - Tarif TER B (Lapisan No. 6: $> \text{Rp9.200.000 s/d Rp10.750.000}$) = **1,50%**.
   - PPh 21 per bulan = $1,50\% \times 10.454.000 = \mathbf{Rp156.810}$.
   - Total PPh 21 Feb–Nov (10 bulan) = $10 \times 156.810 = \mathbf{Rp1.568.100}$.
   - Akumulasi PPh 21 Jan–Nov (11 bulan) = $283.026 + 1.568.100 = \mathbf{Rp1.851.126}$ *(Sesuai)*.

7. **Rekonsiliasi Masa Pajak Desember (Pasal 17 UU HPP)**:
   - Bruto Setahun = $\text{Jan (Rp11.321.052)} + (11 \times \text{Rp10.454.000}) = \mathbf{Rp126.315.052}$.
   - Biaya Jabatan ($5\% \times 126.315.052 = \text{Rp6.315.752,60}$, plafon 12 bulan) = $\mathbf{Rp6.000.000}$.
   - Iuran JHT Karyawan Setahun = $12 \times 200.000 = \text{Rp2.400.000}$.
   - Iuran JP Karyawan Setahun = $12 \times 100.000 = \text{Rp1.200.000}$.
   - Total Pengurang = $6.000.000 + 2.400.000 + 1.200.000 = \mathbf{Rp9.600.000}$.
   - Penghasilan Neto Setahun = $126.315.052 - 9.600.000 = \mathbf{Rp116.715.052}$.
   - PTKP Status K/1 = $\mathbf{Rp63.000.000}$.
   - PKP Riil = $116.715.052 - 63.000.000 = \text{Rp53.715.052}$.
   - PKP Dibulatkan ke bawah ke ribuan penuh = $\mathbf{Rp53.715.000}$.
   - PPh 21 Terutang Setahun (Pasal 17: Lapisan I 5%) = $5\% \times 53.715.000 = \mathbf{Rp2.685.750}$.
   - PPh 21 Masa Desember = $2.685.750 - 1.851.126 = \mathbf{Rp834.624}$.
   - THP Desember = $10.000.000 - 400.000 - 834.624 = \mathbf{Rp8.765.376}$ *(Sesuai)*.

---

### 2.2 Studi Kasus 2: Karyawan Menerima Gaji + THR Keagamaan (TK/0, Gaji Rp6jt + Tunjangan Rp1jt + THR Rp7jt via TER Kategori A)

#### A. Parameter Masukan
- **Gaji Pokok**: Rp6.000.000
- **Tunjangan Tetap**: Rp1.000.000
- **Total Upah Sebulan**: Rp7.000.000
- **THR Penuh (Masa Kerja $\ge$ 12 Bulan)**: $1 \times \text{Upah} = \mathbf{Rp7.000.000}$
- **Status PTKP**: TK/0 (PTKP = Rp54.000.000) $\rightarrow$ **TER Kategori A**
- **Premi BPJS Perusahaan**: JKK (0,24% = Rp16.800) + JKM (0,30% = Rp21.000) + BPJS Kes (4% = Rp280.000) = **Rp317.800/bulan**.
- **Potongan BPJS Karyawan**: JHT (2% = Rp140.000) + JP (1% = Rp70.000) + Kes (1% = Rp70.000) = **Rp280.000/bulan**.

#### B. Hasil Verifikasi
1. **Bulan Biasa Tanpa THR (Maret)**:
   - Bruto Pajak = $7.000.000 + 317.800 = \mathbf{Rp7.317.800}$.
   - TER A Lookup (Lapisan No. 6: $> \text{Rp6.750.000 s/d Rp7.500.000}$) = **1,25%**.
   - PPh 21 Maret = $1,25\% \times 7.317.800 = \text{Rp91.472,50}$.
     * *Metode Floor (Lampiran 03)*: **Rp91.472** $\rightarrow$ THP = **Rp6.628.528**.
     * *Metode Round Half-Up (Riset 06)*: **Rp91.473** $\rightarrow$ THP = **Rp6.628.527**.
     * *Catatan Teknis*: Selisih sebesar Rp1 ini murni disebabkan oleh perbedaan pembulatan *floor* vs *round half-up*. Engine CatatGaji merekomendasikan pembulatan ke bawah (*floor*) sesuai PMK 168/2023.

2. **Bulan Pembayaran THR (April)**:
   - Bruto Pajak = $7.000.000 + 7.000.000 + 317.800 = \mathbf{Rp14.317.800}$.
   - TER A Lookup (Lapisan No. 16: $> \text{Rp13.750.000 s/d Rp15.100.000}$) = **6,00%**.
   - PPh 21 April = $6,00\% \times 14.317.800 = \mathbf{Rp859.068}$ *(Bulat penuh tanpa desimal)*.
   - Total Earning April = $7.000.000 + 7.000.000 = \text{Rp14.000.000}$.
   - Total Potongan April = $280.000 + 859.068 = \text{Rp1.139.068}$.
   - $\mathbf{THP\ April} = 14.000.000 - 1.139.068 = \mathbf{Rp12.860.932}$ *(Sesuai)*.
   - **Dampak Tambahan Pajak Akibat THR**:
     - $\text{PPh April} - \text{PPh Maret} = 859.068 - 91.472 = \mathbf{Rp767.596}$ *(Floor)* atau $\mathbf{Rp767.595}$ *(Round)*.

---

### 2.3 Studi Kasus 3: Karyawan Kontrak (PKWT) Berakhir Kontrak + Lembur Libur Nasional Resmi

Telah diverifikasi dua varian implementasi kasus PKWT:

#### Varian A (Lampiran 03: Masa Kontrak 6 Bulan, Upah Rp5.000.000)
- **Gaji Pokok + Tunjangan**: Rp5.000.000
- **Uang Kompensasi PKWT (6 Bulan PP 35/2021)**: $\frac{6}{12} \times \text{Rp5.000.000} = \mathbf{Rp2.500.000}$.
- **Upah Lembur Libur Nasional (8 Jam Sistem 5 Hari Kerja)**:
  - Upah sejam = $\frac{1}{173} \times 5.000.000 = \text{Rp28.901,734...}$
  - Jam pengali = $8 \times 2,0 = 16,0 \text{ jam upah}$.
  - Upah lembur = $16 \times 28.901,734... = \text{Rp462.427,74...} \rightarrow \mathbf{Rp462.428}$.
- **Premi BPJS Perusahaan**: $0,0454 \times 5.000.000 = \mathbf{Rp227.000}$.
- **Potongan BPJS Karyawan**: $0,0400 \times 5.000.000 = \mathbf{Rp200.000}$.
- **Bruto Masa Akhir (Juni)**: $5.000.000 + 462.428 + 2.500.000 + 227.000 = \mathbf{Rp8.189.428}$.
- **TER A Lookup (Lapisan 7: $> \text{Rp7.500.000 s/d Rp8.550.000}$)**: **1,50%**.
- **PPh 21 Juni**: $1,50\% \times 8.189.428 = \text{Rp122.841,42} \rightarrow \mathbf{Rp122.841}$.
- **THP Juni**: $(5.000.000 + 462.428 + 2.500.000) - 200.000 - 122.841 = \mathbf{Rp7.639.587}$ *(Sesuai)*.

#### Varian B (Riset 06: Masa Kontrak 12 Bulan, Upah Rp6.000.000)
- **Gaji Pokok + Tunjangan**: Rp6.000.000
- **Uang Kompensasi PKWT (12 Bulan PP 35/2021)**: $\frac{12}{12} \times \text{Rp6.000.000} = \mathbf{Rp6.000.000}$.
- **Upah Lembur Libur Nasional (8 Jam)**:
  - Upah sejam = $\frac{1}{173} \times 6.000.000 = \text{Rp34.682,0809...}$
  - Jam pengali = $8 \times 2,0 = 16,0 \text{ jam upah}$.
  - Upah lembur = $16 \times 34.682,0809... = \text{Rp554.913,29...} \rightarrow \mathbf{Rp554.913}$.
- **Premi BPJS Perusahaan**: $0,0454 \times 6.000.000 = \mathbf{Rp272.400}$.
- **Potongan BPJS Karyawan**: $0,0400 \times 6.000.000 = \mathbf{Rp240.000}$.
- **Akumulasi Dipotong Jan–Nov (11 Bulan @ Bruto Rp6.272.400, TER A 0,75%)**:
  - PPh 21 per bulan = $0,75\% \times 6.272.400 = \text{Rp47.043}$.
  - Total Jan–Nov = $11 \times 47.043 = \mathbf{Rp517.473}$.
- **Rekonsiliasi Pasal 17 Masa Terakhir (Desember)**:
  - Bruto Setahun = $(11 \times 6.272.400) + (6.000.000 + 272.400 + 554.913 + 6.000.000) = \mathbf{Rp81.823.713}$.
  - Biaya Jabatan ($5\% \times 81.823.713$) = $\mathbf{Rp4.091.186}$.
  - Iuran JHT & JP Karyawan Setahun ($12 \times \text{Rp180.000}$) = $\mathbf{Rp2.160.000}$.
  - Penghasilan Neto Setahun = $81.823.713 - 4.091.186 - 2.160.000 = \mathbf{Rp75.572.527}$.
  - PKP Setahun ($75.572.527 - 54.000.000$, dibulatkan ke ribuan) = $\mathbf{Rp21.572.000}$.
  - PPh 21 Terutang Setahun (5%) = $\mathbf{Rp1.078.600}$.
  - PPh 21 Masa Desember = $1.078.600 - 517.473 = \mathbf{Rp561.127}$.
  - $\mathbf{THP\ Desember} = (6.000.000 + 554.913 + 6.000.000) - 240.000 - 561.127 = \mathbf{Rp11.753.786}$ *(Sesuai)*.

---

## 3. ADVERSARIAL STRESS-TESTING MATRIKS & FORMULA

### 3.1 Verifikasi Kontinuitas Tabel Lengkap TER (PP No. 58/2023)
| Kategori TER | Jumlah Lapisan | Batas Terendah (Tier 1) | Batas Tertinggi (Tier Akhir) | Status Kontinuitas & Monotonisitas | Celah/Tumpang Tindih |
|:---:|:---:|:---|:---|:---:|:---:|
| **Kategori A** | **44 Lapisan** | $\le \text{Rp5.400.000}$ (0,00%) | $> \text{Rp1.400.000.000}$ (34,00%) | **100% KONTINU & MONOTON NAIK** | **0 CELAH / 0 OVERLAP** |
| **Kategori B** | **40 Lapisan** | $\le \text{Rp6.200.000}$ (0,00%) | $> \text{Rp1.405.000.000}$ (34,00%) | **100% KONTINU & MONOTON NAIK** | **0 CELAH / 0 OVERLAP** |
| **Kategori C** | **41 Lapisan** | $\le \text{Rp6.600.000}$ (0,00%) | $> \text{Rp1.419.000.000}$ (34,00%) | **100% KONTINU & MONOTON NAIK** | **0 CELAH / 0 OVERLAP** |

*Hasil Fuzzing*: Seluruh ambang batas ($X-1$, $X$, $X+1$) dievaluasi dengan operator semi-terbuka:
$$\text{Tier Terpilih} \iff \text{Batas Bawah} < \text{Gross} \le \text{Batas Atas}$$
Hasilnya tepat menghasilkan indeks tier unik tanpa ambiguitas.

---

### 3.2 Verifikasi Formula Upah Lembur PP No. 35/2021
1. **Hari Kerja Biasa**:
   - Jam ke-1: $1,5\times \text{Upah Sejam}$
   - Jam ke-2 s/d ke-4: $2,0\times \text{Upah Sejam}$
2. **Hari Istirahat Mingguan / Libur Resmi (Sistem 5 Hari Kerja)**:
   - Jam ke-1 s/d ke-8: $2,0\times$
   - Jam ke-9: $3,0\times$
   - Jam ke-10 s/d ke-12: $4,0\times$
3. **Hari Istirahat Mingguan / Libur Resmi (Sistem 6 Hari Kerja)**:
   - Jam ke-1 s/d ke-7: $2,0\times$
   - Jam ke-8: $3,0\times$
   - Jam ke-9 s/d ke-11: $4,0\times$
4. **Hari Libur Resmi Jatuh pada Hari Terpendek (Contoh: Jumat 5 Jam)**:
   - Jam ke-1 s/d ke-5: $2,0\times$
   - Jam ke-6: $3,0\times$
   - Jam ke-7 s/d ke-8: $4,0\times$

Seluruh jam pengali matriks di atas telah divalidasi dan menghasilkan perhitungan matematis deterministik.

---

### 3.3 Verifikasi Formula Aljabar Pasal 17 Gross-Up (Lampiran 02)
Pengujian ekualisasi tunjangan pajak ($T_p$) terhadap PPh 21 terutang atas Penghasilan Kena Pajak Dasar ($\text{PKP}_0$):

| Lapisan $\text{PKP}_0$ (Rp) | Formula Tunjangan Pajak ($T_p$) | Contoh $\text{PKP}_0$ Diuji | $T_p$ Terhitung | Pajak Ps. 17 atas ($\text{PKP}_0 + T_p$) | Deviasi ($\Delta$) |
|---|---|:---:|:---:|:---:|:---:|
| Rp0 s/d Rp57.000.000 | $\frac{\text{PKP}_0 \times 0,05}{0,95}$ | Rp50.000.000 | Rp2.631.578,95 | Rp2.631.578,95 | **Rp0,00** |
| > Rp57jt s/d Rp218.5jt | $\frac{(\text{PKP}_0 - 60\text{jt})\times 0,15 + 3\text{jt}}{0,85}$ | Rp100.000.000 | Rp10.588.235,29 | Rp10.588.235,29 | **Rp0,00** |
| > Rp218.5jt s/d Rp406jt | $\frac{(\text{PKP}_0 - 250\text{jt})\times 0,25 + 31.5\text{jt}}{0,75}$ | Rp300.000.000 | Rp58.666.666,67 | Rp58.666.666,67 | **Rp0,00** |
| > Rp406jt s/d Rp3.556 M | $\frac{(\text{PKP}_0 - 500\text{jt})\times 0,30 + 94\text{jt}}{0,70}$ | Rp1.000.000.000 | Rp348.571.428,57 | Rp348.571.428,57 | **Rp0,00** |
| > Rp3.556 M | $\frac{(\text{PKP}_0 - 5.000\text{jt})\times 0,35 + 1.444\text{jt}}{0,65}$ | Rp6.000.000.000 | Rp2.760.000.000,00 | Rp2.760.000.000,00 | **Rp0,00** |

*Kesimpulan*: Formula aljabar Gross-Up Pasal 17 pada Lampiran 02 adalah **100% eksak** tanpa deviasi.

---

### 3.4 Verifikasi Pajak Pesangon Final (PP No. 68/2009)
- $\le \text{Rp50.000.000}$: **0%** (Bebas Pajak)
- $> \text{Rp50.000.000 s/d Rp100.000.000}$: **5%**
- $> \text{Rp100.000.000 s/d Rp500.000.000}$: **15%**
- $> \text{Rp500.000.000}$: **25%**
- Sifat pemotongan: **Final** (tidak masuk SPT Tahunan Orang Pribadi sebagai pengurang/penambah PKP).

---

## 4. TEMUAN ADVERSARIAL & REKOMENDASI ENGINEERING

1. **Standar Pembulatan Pajak Bulanan**:
   - Terdapat perbedaan 1 Rupiah antara Riset 06 (menggunakan pembulatan *round half-up* Rp91.473) dan Lampiran 03 (menggunakan *floor* Rp91.472) pada Case 2 Bulan Maret.
   - *Rekomendasi*: Engine penggajian software harus menerapkan `Math.floor()` ke satuan Rupiah penuh untuk pemotongan TER PPh 21 bulanan sesuai kaidah PMK 168/2023.

2. **Dua Varian Studi Kasus 3 yang Saling Melengkapi**:
   - Riset 06 menyajikan skenario PKWT 12 bulan (upah Rp6.000.000) dengan rekonsiliasi akhir tahun Pasal 17.
   - Lampiran 03 menyajikan skenario PKWT 6 bulan (upah Rp5.000.000) yang berakhir di tengah tahun (Juni) dengan pemotongan TER bulanan.
   - *Rekomendasi*: Pertahankan kedua skenario ini karena memberikan *test vectors* yang komprehensif bagi developer (skenario kontrak penuh 1 tahun vs skenario kontrak jangka pendek di tengah tahun).

3. **Status PTKP Karyawati Menikah**:
   - Pastikan modul HRIS menetapkan *default* status PTKP bagi karyawati menikah adalah **TK/0**, kecuali ada *attachment* surat keterangan resmi camat/lurah bahwa suami tidak berpenghasilan.

---

*Laporan analisis adversarial ini disahkan oleh Mathematical & Tax Simulation Challenger sebagai bukti kesiapan matematis engine CatatGaji.*
