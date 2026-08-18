# STUDI KASUS DAN SIMULASI NUMERIK PENGGAJIAN
**Dokumen Riset Regulasi CatatGaji — Dokumen 06**

---

## 1. PENDAHULUAN SIMULASI

Dokumen ini menyajikan **3 (tiga) studi kasus simulasi numerik komprehensif** yang merepresentasikan skenario riil operasional penggajian bisnis dan UMKM di Indonesia pada periode regulasi 2024–2026:

1. **Kasus 1**: Karyawan Tetap PKWTT (Gaji Reguler + Upah Lembur Hari Kerja + BPJS Ketenagakerjaan & Kesehatan + PPh 21 TER Kategori B Masa Reguler & Rekonsiliasi Masa Desember Pasal 17 UU HPP).
2. **Kasus 2**: Karyawan Tetap Menerima Gaji Bulanan + Tunjangan Hari Raya (THR) Keagamaan Penuh (Perbandingan PPh 21 TER Kategori A Bulan Biasa vs Bulan THR).
3. **Kasus 3**: Karyawan Kontrak PKWT Selesai Masa Kontrak 12 Bulan + Lembur Hari Libur Nasional Resmi (Perhitungan Uang Kompensasi PKWT PP 35/2021 + Lembur Tiering Libur + PPh 21 Rekonsiliasi Akhir Hubungan Kerja).

Seluruh simulasi di bawah ini telah diverifikasi secara matematis dengan pembulatan perpajakan resmi (*tax rounding rules*) sesuai ketentuan Kementerian Keuangan dan BPJS.

---

## 2. KASUS 1: KARYAWAN TETAP (GAJI REGULER + LEMBUR + BPJS + PPH 21 TER B & REKONSILIASI DESEMBER)

### 2.1 Profil Karyawan & Parameter Penggajian
- **Nama Karyawan**: Budi Santoso
- **Status Kepegawaian**: Karyawan Tetap (PKWTT)
- **Gaji Pokok**: Rp8.500.000 per bulan
- **Tunjangan Tetap (Jabatan)**: Rp1.500.000 per bulan
- **Total Upah Tetap Sebulan**: **Rp10.000.000 per bulan**
- **Status PTKP**: **K/1** (Kawin, 1 Tanggungan Anak) $\rightarrow$ **TER Kategori B** (Nilai PTKP Tahunan = Rp63.000.000)
- **Tingkat Risiko JKK Perusahaan**: Kelompok I (**0.24%**) — Sektor Software & Konsultan
- **Data Lembur Bulan Januari**: 10 jam lembur pada hari kerja biasa (10 hari kerja, masing-masing 1 jam/hari)
- **Batas Upah Capping JP 2024**: Rp10.042.300 (Upah Rp10.000.000 $<$ Capping, dasar upah = Rp10.000.000)
- **Batas Upah Capping BPJS Kesehatan**: Rp12.000.000 (Upah Rp10.000.000 $<$ Capping, dasar upah = Rp10.000.000)

---

### 2.2 Langkah 1: Perhitungan Upah Kerja Lembur (Bulan Januari)
1. **Dasar Upah Sejam Lembur**:
   $$\text{Upah Sejam} = \frac{1}{173} \times \text{Upah Sebulan} = \frac{1}{173} \times \text{Rp10.000.000} = \text{Rp57.803,47}$$
2. **Perhitungan Jam Pengali Lembur Hari Kerja**:
   - 10 hari masing-masing lembur 1 jam (jam pertama). Berdasarkan PP 35/2021, lembur jam pertama hari kerja mendapat pengali **1.5x**:
   $$\text{Total Jam Pengali} = 10 \text{ hari} \times 1 \text{ jam} \times 1.5 = 15 \text{ Jam Upah}$$
3. **Total Upah Lembur Januari**:
   $$\text{Upah Lembur} = 15 \times \text{Rp57.803,47} = \mathbf{Rp867.052}$$

---

### 2.3 Langkah 2: Perhitungan Iuran BPJS Ketenagakerjaan & BPJS Kesehatan (Januari)

#### A. Beban Pemberi Kerja (Perusahaan):
- **JKK (0.24%)**: $0.24\% \times \text{Rp10.000.000} = \text{Rp24.000}$
- **JKM (0.30%)**: $0.30\% \times \text{Rp10.000.000} = \text{Rp30.000}$
- **JHT (3.70%)**: $3.70\% \times \text{Rp10.000.000} = \text{Rp370.000}$
- **JP (2.00%)**: $2.00\% \times \text{Rp10.000.000} = \text{Rp200.000}$
- **BPJS Kesehatan (4.00%)**: $4.00\% \times \text{Rp10.000.000} = \text{Rp400.000}$
- **Total Beban Iuran Perusahaan**: $\mathbf{Rp1.024.000}$

#### B. Potongan Upah Karyawan (Employee Contribution):
- **JHT (2.00%)**: $2.00\% \times \text{Rp10.000.000} = \text{Rp200.000}$
- **JP (1.00%)**: $1.00\% \times \text{Rp10.000.000} = \text{Rp100.000}$
- **BPJS Kesehatan (1.00%)**: $1.00\% \times \text{Rp10.000.000} = \text{Rp100.000}$
- **Total Potongan BPJS Karyawan**: $\mathbf{Rp400.000}$

---

### 2.4 Langkah 3: Perhitungan Penghasilan Bruto PPh 21 Masa Januari
$$\text{Bruto PPh 21} = \text{Gaji Pokok} + \text{Tunj. Tetap} + \text{Lembur} + \text{JKK}_{\text{pers}} + \text{JKM}_{\text{pers}} + \text{BPJS Kes}_{\text{pers}}$$
$$\text{Bruto PPh 21} = 8.500.000 + 1.500.000 + 867.052 + 24.000 + 30.000 + 400.000 = \mathbf{Rp11.321.052}$$

---

### 2.5 Langkah 4: Pemotongan PPh 21 Bulan Januari via TER Kategori B
- Status K/1 $\rightarrow$ **TER Kategori B**.
- Penghasilan Bruto Sebulan: **Rp11.321.052**.
- Berdasarkan Tabel TER Kategori B: Rentang `> Rp11.250.000 s/d Rp11.600.000` (Baris 8) dikenakan tarif **2.50%**.
- **Potongan PPh 21 Januari**:
  $$\text{PPh 21 Januari} = 2.50\% \times \text{Rp11.321.052} = \mathbf{Rp283.026}$$

---

### 2.6 Langkah 5: Rincian Slip Gaji & Take Home Pay (THP) Bulan Januari

```
=============================================================================
                    SLIP GAJI BULAN JANUARI 2024
Nama: Budi Santoso (K/1)                  Jabatan: Senior Software Engineer
Status: PKWTT (Tetap)                     Bulan: Januari 2024
=============================================================================
PENGHASILAN (EARNINGS):
  1. Gaji Pokok                                      Rp  8.500.000
  2. Tunjangan Tetap (Jabatan)                       Rp  1.500.000
  3. Upah Lembur (10 Jam Kerja)                      Rp    867.052
  -----------------------------------------------------------------
  TOTAL PENGHASILAN KOTOR (GROSS EARNINGS)           Rp 10.867.052

POTONGAN (DEDUCTIONS):
  1. Iuran BPJS Ketenagakerjaan JHT (2%)             Rp    200.000
  2. Iuran BPJS Ketenagakerjaan JP (1%)              Rp    100.000
  3. Iuran BPJS Kesehatan (1%)                       Rp    100.000
  4. Pajak Penghasilan PPh 21 (TER B: 2.50%)         Rp    283.026
  -----------------------------------------------------------------
  TOTAL POTONGAN GAJI                                Rp    683.026

=============================================================================
TAKE HOME PAY (THP) YANG DITRANSFER:                 Rp 10.184.026
=============================================================================
INFORMASI TUNJANGAN PREMI DIBAYAR PERUSAHAAN (BENEFIT):
  - BPJS TK JKK (0.24%): Rp 24.000 | JKM (0.30%): Rp 30.000
  - BPJS TK JHT (3.70%): Rp 370.000 | JP (2.00%): Rp 200.000
  - BPJS Kesehatan (4.00%): Rp 400.000
  - Total Biaya Jaminan Sosial Perusahaan: Rp 1.024.000
=============================================================================
```

---

### 2.7 Langkah 6: Rekonsiliasi Akhir Tahun (Masa Pajak Desember)
*Asumsi Realistis*: Pada bulan Februari s/d November (10 bulan), Budi menerima gaji reguler flat tanpa lembur.
1. **Penghasilan Bruto Bulanan (Februari s/d November)**:
   $$\text{Bruto Bulanan (Feb-Nov)} = 10.000.000 + 24.000 + 30.000 + 400.000 = \text{Rp10.454.000}$$
   - Tarif TER Kategori B untuk Rp10.454.000 (rentang `> Rp9.200.000 s/d Rp10.750.000`) = **1.50%**.
   - PPh 21 per bulan (Feb–Nov) = $1.50\% \times \text{Rp10.454.000} = \text{Rp156.810}$.
2. **Akumulasi PPh 21 yang Telah Dipotong (Januari s/d November — 11 Bulan)**:
   $$\sum \text{PPh 21 (Jan–Nov)} = 283.026 + (10 \times 156.810) = 283.026 + 1.568.100 = \mathbf{Rp1.851.126}$$

3. **Perhitungan PPh 21 Tahunan (Desember) Berdasarkan Pasal 17 UU HPP**:
   - **Total Penghasilan Bruto Setahun (12 Bulan)**:
     $$\text{Bruto Setahun} = \text{Bruto Jan (Rp11.321.052)} + (11 \times \text{Rp10.454.000}) = \mathbf{Rp126.315.052}$$
   - **Pengurang Penghasilan Bruto**:
     * Biaya Jabatan ($5\% \times \text{Rp126.315.052} = \text{Rp6.315.752}$, dibatasi plafon maksimal) = **Rp6.000.000**
     * Iuran JHT Karyawan Setahun ($12 \times \text{Rp200.000}$) = **Rp2.400.000**
     * Iuran JP Karyawan Setahun ($12 \times \text{Rp100.000}$) = **Rp1.200.000**
     * **Total Pengurang** = $6.000.000 + 2.400.000 + 1.200.000 = \mathbf{Rp9.600.000}$
   - **Penghasilan Neto Setahun**:
     $$\text{Neto Setahun} = 126.315.052 - 9.600.000 = \mathbf{Rp116.715.052}$$
   - **Penghasilan Kena Pajak (PKP)**:
     $$\text{PKP} = \text{Neto Setahun} - \text{PTKP K/1 (Rp63.000.000)}$$
     $$\text{PKP} = 116.715.052 - 63.000.000 = 53.715.052 \rightarrow \mathbf{Rp53.715.000}\text{ (dibulatkan ke ribuan penuh)}$$
   - **PPh 21 Terutang Setahun (Tarif Progresif Pasal 17)**:
     $$\text{Lapisan I (5% s/d Rp60.000.000)} = 5\% \times \text{Rp53.715.000} = \mathbf{Rp2.685.750}$$
   - **PPh 21 Masa Pajak Desember**:
     $$\text{PPh 21 Desember} = \text{PPh 21 Terutang Setahun} - \sum \text{PPh 21 (Jan–Nov)}$$
     $$\text{PPh 21 Desember} = 2.685.750 - 1.851.126 = \mathbf{Rp834.624}$$
   - **Take Home Pay (THP) Bulan Desember**:
     $$\text{THP Desember} = \text{Gaji Pokok + Tunj (Rp10.000.000)} - \text{BPJS Kary (Rp400.000)} - \text{PPh 21 Des (Rp834.624)} = \mathbf{Rp8.765.376}$$

---

## 3. KASUS 2: KARYAWAN MENERIMA GAJI + THR KEAGAMAAN (TER A BULAN BIASA VS BULAN THR)

### 3.1 Profil Karyawan & Parameter Penggajian
- **Nama Karyawan**: Siti Rahmawati
- **Status Kepegawaian**: Karyawan Tetap (PKWTT)
- **Gaji Pokok**: Rp6.000.000 per bulan
- **Tunjangan Tetap**: Rp1.000.000 per bulan
- **Total Upah Sebulan**: **Rp7.000.000 per bulan**
- **Status PTKP**: **TK/0** (Tidak Kawin, 0 Tanggungan) $\rightarrow$ **TER Kategori A** (PTKP = Rp54.000.000)
- **Masa Kerja**: 3 Tahun (Berhak atas 100% THR penuh = 1 bulan upah = **Rp7.000.000**)
- **Premi Asuransi Ditanggung Perusahaan**:
  * JKK (0.24%): $0.24\% \times \text{Rp7.000.000} = \text{Rp16.800}$
  * JKM (0.30%): $0.30\% \times \text{Rp7.000.000} = \text{Rp21.000}$
  * BPJS Kesehatan (4.00%): $4.00\% \times \text{Rp7.000.000} = \text{Rp280.000}$
  * **Total Premi Penambah Bruto Pajak**: $\mathbf{Rp317.800}$ per bulan.
- **Potongan BPJS Karyawan**:
  * JHT (2%): Rp140.000 | JP (1%): Rp70.000 | BPJS Kesehatan (1%): Rp70.000 $\rightarrow$ Total: **Rp280.000**.

---

### 3.2 Skenario A: Perhitungan Gaji Bulan Biasa (Maret)
1. **Penghasilan Bruto PPh 21 Bulan Maret**:
   $$\text{Bruto Maret} = \text{Upah Tetap (Rp7.000.000)} + \text{Premi Perusahaan (Rp317.800)} = \mathbf{Rp7.317.800}$$
2. **Penentuan Tarif TER Kategori A**:
   - Berdasarkan Tabel TER Kategori A: Rentang `> Rp6.750.000 s/d Rp7.500.000` (Baris 6) dikenakan tarif **1.25%**.
3. **Potongan PPh 21 Bulan Maret**:
   $$\text{PPh 21 Maret} = 1.25\% \times \text{Rp7.317.800} = \mathbf{Rp91.473}$$
4. **Take Home Pay (THP) Bulan Maret**:
   $$\text{THP Maret} = \text{Gaji Pokok + Tunj (Rp7.000.000)} - \text{BPJS Karyawan (Rp280.000)} - \text{PPh 21 (Rp91.473)} = \mathbf{Rp6.628.527}$$

---

### 3.3 Skenario B: Perhitungan Bulan Pembayaran THR Keagamaan (April)
1. **Penghasilan Bruto PPh 21 Bulan April (Gaji + Premi + THR)**:
   $$\text{Bruto April} = \text{Gaji Reguler (Rp7.000.000)} + \text{Premi BPJS Perusahaan (Rp317.800)} + \text{THR (Rp7.000.000)}$$
   $$\text{Bruto April} = \mathbf{Rp14.317.800}$$
2. **Penentuan Tarif TER Kategori A**:
   - Berdasarkan Tabel TER Kategori A: Rentang `> Rp13.750.000 s/d Rp15.100.000` (Baris 16) dikenakan tarif **6.00%**.
3. **Potongan PPh 21 Bulan April**:
   $$\text{PPh 21 April} = 6.00\% \times \text{Rp14.317.800} = \mathbf{Rp859.068}$$
4. **Take Home Pay (THP) Bulan April**:
   $$\text{Total Earning April} = \text{Gaji (Rp7.000.000)} + \text{THR (Rp7.000.000)} = \text{Rp14.000.000}$$
   $$\text{Total Potongan} = \text{BPJS Karyawan (Rp280.000)} + \text{PPh 21 April (Rp859.068)} = \text{Rp1.139.068}$$
   $$\mathbf{THP\ April} = 14.000.000 - 1.139.068 = \mathbf{Rp12.860.932}$$
5. **Analisis Selisih Beban Pajak atas THR**:
   $$\text{Tambahan Beban Pajak Akibat THR} = \text{PPh 21 April (Rp859.068)} - \text{PPh 21 Reguler (Rp91.473)} = \mathbf{Rp767.595}$$

---

## 4. KASUS 3: KARYAWAN PKWT BERAKHIR KONTRAK + LEMBUR LIBUR NASIONAL RESMI

### 4.1 Profil Karyawan & Parameter Penggajian
- **Nama Karyawan**: Doni Wijaya
- **Status Kepegawaian**: Karyawan Kontrak (PKWT)
- **Masa Kerja**: 12 Bulan Penuh (1 Januari s/d 31 Desember)
- **Status Akhir Kontrak**: Kontrak berakhir dan tidak diperpanjang (memenuhi syarat Uang Kompensasi PKWT Pasal 15 PP 35/2021)
- **Gaji Pokok**: Rp5.000.000 per bulan
- **Tunjangan Tetap**: Rp1.000.000 per bulan
- **Total Upah Sebulan**: **Rp6.000.000 per bulan**
- **Status PTKP**: **TK/0** $\rightarrow$ **TER Kategori A** (PTKP = Rp54.000.000)
- **Sistem Jam Kerja**: 5 Hari Kerja per minggu
- **Data Lembur Bulan Desember**: 8 jam lembur pada **Hari Libur Nasional Resmi**
- **Iuran BPJS Perusahaan Bulanan**:
  * JKK (0.24%): Rp14.400 | JKM (0.30%): Rp18.000 | BPJS Kesehatan (4%): Rp240.000 $\rightarrow$ **Total Premi Pajak = Rp272.400 / bulan**.
- **Potongan BPJS Karyawan Bulanan**:
  * JHT (2%): Rp120.000 | JP (1%): Rp60.000 | BPJS Kesehatan (1%): Rp60.000 $\rightarrow$ **Total BPJS = Rp240.000 / bulan**.

---

### 4.2 Langkah 1: Perhitungan Upah Lembur Hari Libur Nasional Resmi (8 Jam)
1. **Dasar Upah Sejam**:
   $$\text{Upah Sejam} = \frac{1}{173} \times \text{Rp6.000.000} = \text{Rp34.682,08}$$
2. **Multiplier Lembur Hari Libur Resmi (Sistem 5 Hari Kerja)**:
   - Sesuai PP No. 35/2021 Pasal 31: Jam ke-1 s/d Jam ke-8 dibayar **2.0x Upah Sejam** per jam:
   $$\text{Total Jam Pengali} = 8 \text{ jam} \times 2.0 = 16 \text{ Jam Upah}$$
3. **Total Upah Lembur Hari Libur**:
   $$\text{Upah Lembur} = 16 \times \text{Rp34.682,08} = \mathbf{Rp554.913}$$

---

### 4.3 Langkah 2: Perhitungan Uang Kompensasi PKWT (Pasal 15 PP No. 35/2021)
$$\text{Uang Kompensasi PKWT} = \frac{\text{Masa Kerja (12 Bulan)}}{12} \times 1 \text{ Bulan Upah}$$
$$\text{Uang Kompensasi PKWT} = \frac{12}{12} \times \text{Rp6.000.000} = \mathbf{Rp6.000.000}$$

---

### 4.4 Langkah 3: Perlakuan Pajak PPh 21 Masa Terakhir (Desember)
Sesuai PMK 168/2023, Uang Kompensasi PKWT diperlakukan sebagai **Penghasilan Tidak Teratur Pegawai Tetap/Kontrak** (bukan pesangon final PP 68/2009), sehingga digabungkan ke dalam perhitungan rekonsiliasi akhir tahun Pasal 17 UU HPP.

1. **Akumulasi PPh 21 Januari s/d November (11 Bulan Flat Tanpa Lembur)**:
   - Bruto per bulan = $6.000.000 + 272.400 = \text{Rp6.272.400}$.
   - Tarif TER Kategori A untuk Rp6.272.400 (rentang `> Rp5.950.000 s/d Rp6.300.000`) = **0.75%**.
   - PPh 21 per bulan = $0.75\% \times \text{Rp6.272.400} = \text{Rp47.043}$.
   - Total PPh 21 dipotong Jan–Nov = $11 \times \text{Rp47.043} = \mathbf{Rp517.473}$.

2. **Perhitungan PPh 21 Tahunan (Desember) Berdasarkan Pasal 17 UU HPP**:
   - **Penghasilan Bruto Setahun (12 Bulan)**:
     * Jan s/d Nov (11 bulan @ Rp6.272.400) = Rp68.996.400
     * Desember: Gaji (Rp6.000.000) + Premi (Rp272.400) + Lembur (Rp554.913) + Kompensasi PKWT (Rp6.000.000) = Rp12.827.313
     * **Total Bruto Setahun** = $68.996.400 + 12.827.313 = \mathbf{Rp81.823.713}$
   - **Pengurang Penghasilan Bruto**:
     * Biaya Jabatan ($5\% \times \text{Rp81.823.713}$) = **Rp4.091.186**
     * Iuran JHT Karyawan Setahun ($12 \times \text{Rp120.000}$) = **Rp1.440.000**
     * Iuran JP Karyawan Setahun ($12 \times \text{Rp60.000}$) = **Rp720.000**
     * **Total Pengurang** = $4.091.186 + 1.440.000 + 720.000 = \mathbf{Rp6.251.186}$
   - **Penghasilan Neto Setahun**:
     $$\text{Neto Setahun} = 81.823.713 - 6.251.186 = \mathbf{Rp75.572.527}$$
   - **Penghasilan Kena Pajak (PKP)**:
     $$\text{PKP} = 75.572.527 - \text{PTKP TK/0 (Rp54.000.000)} = 21.572.527 \rightarrow \mathbf{Rp21.572.000}$$
   - **PPh 21 Terutang Setahun (Pasal 17)**:
     $$\text{PPh 21 Setahun} = 5\% \times \text{Rp21.572.000} = \mathbf{Rp1.078.600}$$
   - **PPh 21 Masa Pajak Terakhir (Desember)**:
     $$\text{PPh 21 Desember} = \text{PPh 21 Setahun (Rp1.078.600)} - \text{Dipotong Jan–Nov (Rp517.473)} = \mathbf{Rp561.127}$$

---

### 4.5 Langkah 4: Rincian Slip Gaji Final Bulan Desember (Akhir Kontrak PKWT)

```
=============================================================================
                    SLIP GAJI FINAL & KOMPENSASI PKWT
Nama: Doni Wijaya (TK/0)                  Jabatan: Staff Operasional
Status: PKWT (Berakhir 31 Des 2024)       Bulan: Desember 2024
=============================================================================
PENGHASILAN (EARNINGS):
  1. Gaji Pokok                                      Rp  5.000.000
  2. Tunjangan Tetap                                 Rp  1.000.000
  3. Upah Lembur Hari Libur Nasional (8 Jam)         Rp    554.913
  4. Uang Kompensasi PKWT (12 Bulan PP 35/2021)      Rp  6.000.000
  -----------------------------------------------------------------
  TOTAL PENGHASILAN KOTOR (GROSS EARNINGS)           Rp 12.554.913

POTONGAN (DEDUCTIONS):
  1. Iuran BPJS Ketenagakerjaan JHT (2%)             Rp    120.000
  2. Iuran BPJS Ketenagakerjaan JP (1%)              Rp     60.000
  3. Iuran BPJS Kesehatan (1%)                       Rp     60.000
  4. Pajak Penghasilan PPh 21 Masa Terakhir (Pasal 17) Rp   561.127
  -----------------------------------------------------------------
  TOTAL POTONGAN GAJI                                Rp    801.127

=============================================================================
TAKE HOME PAY (THP) FINAL YANG DITRANSFER:           Rp 11.753.786
=============================================================================
```

---

*Dokumen ini menjadi rujukan validasi perhitungan numerik dan unit testing matematika bagi tim engineering pengembang platform CatatGaji.*
