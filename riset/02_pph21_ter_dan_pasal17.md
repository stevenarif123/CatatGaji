# PAJAK PENGHASILAN PASAL 21 (PPH 21) — SKEMA TER & PASAL 17
**Dokumen Riset Regulasi CatatGaji — Dokumen 02**

---

## 1. PARADIGMA BARU PEMOTONGAN PPH 21 (PP 58/2023 & PMK 168/2023)

Mulai **1 Januari 2024**, Direktorat Jenderal Pajak (DJP) memberlakukan simplifikasi penghitungan pemotongan Pajak Penghasilan Pasal 21 (PPh 21) bagi Wajib Pajak Orang Pribadi melalui skema **Tarif Efektif Rata-Rata (TER)** yang diatur dalam **Peraturan Pemerintah No. 58 Tahun 2023** dan **Peraturan Menteri Keuangan No. 168 Tahun 2023**.

### 1.1 Prinsip Dasar Skema Dua Tahap
Perhitungan PPh 21 untuk Pegawai Tetap dibagi menjadi dua tahap yang berbeda secara fundamental:

```
+-------------------------------------------------------------------------+
|                  SIKLUS TAHUNAN PERHITUNGAN PPH 21 PEGAWAI TETAP         |
+-------------------------------------------------------------------------+
|                                                                         |
|  [TAHAP 1: MASA JANUARI s/d NOVEMBER (MASA SELAIN MASA TERAKHIR)]       |
|  Penghasilan Bruto Sebulan  x  Tarif Efektif Bulanan (TER A / B / C)     |
|  * Tidak memperhitungkan Biaya Jabatan, Iuran JHT/JP, atau PTKP bulanan |
|                                                                         |
|                                     |                                   |
|                                     v                                   |
|                                                                         |
|  [TAHAP 2: MASA DESEMBER / MASA BERHENTI KERJA (MASA PAJAK TERAKHIR)]   |
|  1. Hitung Penghasilan Bruto Setahun (12 bulan atau masa kerja riil)    |
|  2. Kurangi Biaya Jabatan (5%, maks Rp6.000.000/thn)                   |
|  3. Kurangi Iuran Pensiun / JHT / JP yang dibayar pekerja               |
|  4. Penghasilan Neto Setahun - PTKP Setahun = PKP (dibulatkan)          |
|  5. PPh 21 Setahun = Tarif Progresif Pasal 17 UU HPP x PKP              |
|  6. PPh 21 Desember = PPh 21 Setahun - Total PPh 21 (Jan s/d Nov)       |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 2. PENGHASILAN TIDAK KENA PAJAK (PTKP) & PEMETAAN KATEGORI TER

### 2.1 Nilai PTKP Tahunan (PMK 101/PMK.010/2016)
- **Wajib Pajak Sendiri (TK/0)**: Rp54.000.000 per tahun (Rp4.500.000 per bulan).
- **Tambahan Status Kawin**: Rp4.500.000 per tahun (Rp375.000 per bulan).
- **Tambahan per Tanggungan (Maksimal 3 Orang)**: Rp4.500.000 per tahun per orang (Rp375.000 per bulan). Tanggungan mencakup anggota keluarga sedarah dan semenda dalam garis keturunan lurus (anak kandung, orang tua kandung, mertua, atau anak angkat yang sah).

### 2.2 Tabel Pemetaan Status PTKP ke Kategori TER Bulanan (Pasal 2 PP 58/2023)
| Status PTKP | Keterangan Status Keluarga | PTKP Setahun (Rp) | PTKP Sebulan (Rp) | Kategori TER Bulanan |
|-------------|----------------------------|-------------------|-------------------|----------------------|
| **TK/0** | Tidak Kawin, 0 Tanggungan | Rp54.000.000 | Rp4.500.000 | **TER Kategori A** |
| **TK/1** | Tidak Kawin, 1 Tanggungan | Rp58.500.000 | Rp4.875.000 | **TER Kategori A** |
| **K/0** | Kawin, 0 Tanggungan | Rp58.500.000 | Rp4.875.000 | **TER Kategori A** |
| **TK/2** | Tidak Kawin, 2 Tanggungan | Rp63.000.000 | Rp5.250.000 | **TER Kategori B** |
| **TK/3** | Tidak Kawin, 3 Tanggungan | Rp67.500.000 | Rp5.625.000 | **TER Kategori B** |
| **K/1** | Kawin, 1 Tanggungan | Rp63.000.000 | Rp5.250.000 | **TER Kategori B** |
| **K/2** | Kawin, 2 Tanggungan | Rp67.500.000 | Rp5.625.000 | **TER Kategori B** |
| **K/3** | Kawin, 3 Tanggungan | Rp72.000.000 | Rp6.000.000 | **TER Kategori C** |

*Catatan Khusus Karyawati*:
- Karyawati yang telah menikah secara default dikategorikan sebagai **TK/0** untuk pemotongan PPh 21, karena tanggungan keluarga melekat pada suami.
- Karyawati dapat menggunakan status kawin dengan tanggungan (**K/0, K/1, K/2, K/3**) apabila menyerahkan Surat Keterangan dari Pemerintah Daerah setempat (minimal Kelurahan/Kecamatan) yang menyatakan bahwa suami tidak memiliki penghasilan sama sekali.

---

## 3. TABEL LENGKAP TARIF EFEKTIF RATA-RATA (TER) BULANAN

Seluruh rentang bracket tarif efektif per PP No. 58 Tahun 2023 wajib diimplementasikan secara utuh tanpa ada singkatan ke dalam database CatatGaji:

### 3.1 Tabel TER Kategori A (44 Lapisan — Status PTKP: TK/0, TK/1, K/0)
| No | Rentang Penghasilan Bruto Sebulan (Rp) | Tarif TER A (%) |
|:--:|:---------------------------------------|:---------------:|
| 1 | s/d Rp5.400.000 | 0.00% |
| 2 | > Rp5.400.000 s/d Rp5.650.000 | 0.25% |
| 3 | > Rp5.650.000 s/d Rp5.950.000 | 0.50% |
| 4 | > Rp5.950.000 s/d Rp6.300.000 | 0.75% |
| 5 | > Rp6.300.000 s/d Rp6.750.000 | 1.00% |
| 6 | > Rp6.750.000 s/d Rp7.500.000 | 1.25% |
| 7 | > Rp7.500.000 s/d Rp8.550.000 | 1.50% |
| 8 | > Rp8.550.000 s/d Rp9.650.000 | 1.75% |
| 9 | > Rp9.650.000 s/d Rp10.050.000 | 2.00% |
| 10 | > Rp10.050.000 s/d Rp10.350.000 | 2.25% |
| 11 | > Rp10.350.000 s/d Rp10.700.000 | 2.50% |
| 12 | > Rp10.700.000 s/d Rp11.050.000 | 3.00% |
| 13 | > Rp11.050.000 s/d Rp11.600.000 | 3.50% |
| 14 | > Rp11.600.000 s/d Rp12.500.000 | 4.00% |
| 15 | > Rp12.500.000 s/d Rp13.750.000 | 5.00% |
| 16 | > Rp13.750.000 s/d Rp15.100.000 | 6.00% |
| 17 | > Rp15.100.000 s/d Rp16.950.000 | 7.00% |
| 18 | > Rp16.950.000 s/d Rp19.750.000 | 8.00% |
| 19 | > Rp19.750.000 s/d Rp24.150.000 | 9.00% |
| 20 | > Rp24.150.000 s/d Rp26.450.000 | 10.00% |
| 21 | > Rp26.450.000 s/d Rp28.000.000 | 11.00% |
| 22 | > Rp28.000.000 s/d Rp30.050.000 | 12.00% |
| 23 | > Rp30.050.000 s/d Rp32.400.000 | 13.00% |
| 24 | > Rp32.400.000 s/d Rp35.400.000 | 14.00% |
| 25 | > Rp35.400.000 s/d Rp39.100.000 | 15.00% |
| 26 | > Rp39.100.000 s/d Rp43.850.000 | 16.00% |
| 27 | > Rp43.850.000 s/d Rp47.800.000 | 17.00% |
| 28 | > Rp47.800.000 s/d Rp51.400.000 | 18.00% |
| 29 | > Rp51.400.000 s/d Rp56.300.000 | 19.00% |
| 30 | > Rp56.300.000 s/d Rp62.200.000 | 20.00% |
| 31 | > Rp62.200.000 s/d Rp68.600.000 | 21.00% |
| 32 | > Rp68.600.000 s/d Rp77.500.000 | 22.00% |
| 33 | > Rp77.500.000 s/d Rp89.000.000 | 23.00% |
| 34 | > Rp89.000.000 s/d Rp103.000.000 | 24.00% |
| 35 | > Rp103.000.000 s/d Rp125.000.000 | 25.00% |
| 36 | > Rp125.000.000 s/d Rp157.000.000 | 26.00% |
| 37 | > Rp157.000.000 s/d Rp206.000.000 | 27.00% |
| 38 | > Rp206.000.000 s/d Rp337.000.000 | 28.00% |
| 39 | > Rp337.000.000 s/d Rp454.000.000 | 29.00% |
| 40 | > Rp454.000.000 s/d Rp550.000.000 | 30.00% |
| 41 | > Rp550.000.000 s/d Rp695.000.000 | 31.00% |
| 42 | > Rp695.000.000 s/d Rp910.000.000 | 32.00% |
| 43 | > Rp910.000.000 s/d Rp1.400.000.000 | 33.00% |
| 44 | > Rp1.400.000.000 | 34.00% |

---

### 3.2 Tabel TER Kategori B (40 Lapisan — Status PTKP: TK/2, TK/3, K/1, K/2)
| No | Rentang Penghasilan Bruto Sebulan (Rp) | Tarif TER B (%) |
|:--:|:---------------------------------------|:---------------:|
| 1 | s/d Rp6.200.000 | 0.00% |
| 2 | > Rp6.200.000 s/d Rp6.500.000 | 0.25% |
| 3 | > Rp6.500.000 s/d Rp6.850.000 | 0.50% |
| 4 | > Rp6.850.000 s/d Rp7.300.000 | 0.75% |
| 5 | > Rp7.300.000 s/d Rp9.200.000 | 1.00% |
| 6 | > Rp9.200.000 s/d Rp10.750.000 | 1.50% |
| 7 | > Rp10.750.000 s/d Rp11.250.000 | 2.00% |
| 8 | > Rp11.250.000 s/d Rp11.600.000 | 2.50% |
| 9 | > Rp11.600.000 s/d Rp12.600.000 | 3.00% |
| 10 | > Rp12.600.000 s/d Rp13.600.000 | 4.00% |
| 11 | > Rp13.600.000 s/d Rp14.950.000 | 5.00% |
| 12 | > Rp14.950.000 s/d Rp16.400.000 | 6.00% |
| 13 | > Rp16.400.000 s/d Rp18.450.000 | 7.00% |
| 14 | > Rp18.450.000 s/d Rp21.850.000 | 8.00% |
| 15 | > Rp21.850.000 s/d Rp26.000.000 | 9.00% |
| 16 | > Rp26.000.000 s/d Rp27.700.000 | 10.00% |
| 17 | > Rp27.700.000 s/d Rp29.350.000 | 11.00% |
| 18 | > Rp29.350.000 s/d Rp31.450.000 | 12.00% |
| 19 | > Rp31.450.000 s/d Rp33.950.000 | 13.00% |
| 20 | > Rp33.950.000 s/d Rp37.100.000 | 14.00% |
| 21 | > Rp37.100.000 s/d Rp41.100.000 | 15.00% |
| 22 | > Rp41.100.000 s/d Rp45.800.000 | 16.00% |
| 23 | > Rp45.800.000 s/d Rp49.500.000 | 17.00% |
| 24 | > Rp49.500.000 s/d Rp53.800.000 | 18.00% |
| 25 | > Rp53.800.000 s/d Rp58.500.000 | 19.00% |
| 26 | > Rp58.500.000 s/d Rp64.000.000 | 20.00% |
| 27 | > Rp64.000.000 s/d Rp71.000.000 | 21.00% |
| 28 | > Rp71.000.000 s/d Rp80.000.000 | 22.00% |
| 29 | > Rp80.000.000 s/d Rp93.000.000 | 23.00% |
| 30 | > Rp93.000.000 s/d Rp109.000.000 | 24.00% |
| 31 | > Rp109.000.000 s/d Rp129.000.000 | 25.00% |
| 32 | > Rp129.000.000 s/d Rp163.000.000 | 26.00% |
| 33 | > Rp163.000.000 s/d Rp211.000.000 | 27.00% |
| 34 | > Rp211.000.000 s/d Rp374.000.000 | 28.00% |
| 35 | > Rp374.000.000 s/d Rp459.000.000 | 29.00% |
| 36 | > Rp459.000.000 s/d Rp555.000.000 | 30.00% |
| 37 | > Rp555.000.000 s/d Rp704.000.000 | 31.00% |
| 38 | > Rp704.000.000 s/d Rp957.000.000 | 32.00% |
| 39 | > Rp957.000.000 s/d Rp1.405.000.000 | 33.00% |
| 40 | > Rp1.405.000.000 | 34.00% |

---

### 3.3 Tabel TER Kategori C (41 Lapisan — Status PTKP: K/3)
| No | Rentang Penghasilan Bruto Sebulan (Rp) | Tarif TER C (%) |
|:--:|:---------------------------------------|:---------------:|
| 1 | s/d Rp6.600.000 | 0.00% |
| 2 | > Rp6.600.000 s/d Rp6.950.000 | 0.25% |
| 3 | > Rp6.950.000 s/d Rp7.350.000 | 0.50% |
| 4 | > Rp7.350.000 s/d Rp7.800.000 | 0.75% |
| 5 | > Rp7.800.000 s/d Rp8.850.000 | 1.00% |
| 6 | > Rp8.850.000 s/d Rp9.800.000 | 1.25% |
| 7 | > Rp9.800.000 s/d Rp10.950.000 | 1.50% |
| 8 | > Rp10.950.000 s/d Rp11.200.000 | 1.75% |
| 9 | > Rp11.200.000 s/d Rp12.050.000 | 2.00% |
| 10 | > Rp12.050.000 s/d Rp12.950.000 | 3.00% |
| 11 | > Rp12.950.000 s/d Rp14.150.000 | 4.00% |
| 12 | > Rp14.150.000 s/d Rp15.550.000 | 5.00% |
| 13 | > Rp15.550.000 s/d Rp17.050.000 | 6.00% |
| 14 | > Rp17.050.000 s/d Rp19.500.000 | 7.00% |
| 15 | > Rp19.500.000 s/d Rp22.700.000 | 8.00% |
| 16 | > Rp22.700.000 s/d Rp26.600.000 | 9.00% |
| 17 | > Rp26.600.000 s/d Rp28.100.000 | 10.00% |
| 18 | > Rp28.100.000 s/d Rp30.100.000 | 11.00% |
| 19 | > Rp30.100.000 s/d Rp32.600.000 | 12.00% |
| 20 | > Rp32.600.000 s/d Rp35.400.000 | 13.00% |
| 21 | > Rp35.400.000 s/d Rp38.900.000 | 14.00% |
| 22 | > Rp38.900.000 s/d Rp43.000.000 | 15.00% |
| 23 | > Rp43.000.000 s/d Rp47.400.000 | 16.00% |
| 24 | > Rp47.400.000 s/d Rp51.200.000 | 17.00% |
| 25 | > Rp51.200.000 s/d Rp55.800.000 | 18.00% |
| 26 | > Rp55.800.000 s/d Rp60.400.000 | 19.00% |
| 27 | > Rp60.400.000 s/d Rp66.700.000 | 20.00% |
| 28 | > Rp66.700.000 s/d Rp74.500.000 | 21.00% |
| 29 | > Rp74.500.000 s/d Rp83.200.000 | 22.00% |
| 30 | > Rp83.200.000 s/d Rp95.600.000 | 23.00% |
| 31 | > Rp95.600.000 s/d Rp110.000.000 | 24.00% |
| 32 | > Rp110.000.000 s/d Rp134.000.000 | 25.00% |
| 33 | > Rp134.000.000 s/d Rp169.000.000 | 26.00% |
| 34 | > Rp169.000.000 s/d Rp221.000.000 | 27.00% |
| 35 | > Rp221.000.000 s/d Rp390.000.000 | 28.00% |
| 36 | > Rp390.000.000 s/d Rp463.000.000 | 29.00% |
| 37 | > Rp463.000.000 s/d Rp561.000.000 | 30.00% |
| 38 | > Rp561.000.000 s/d Rp709.000.000 | 31.00% |
| 39 | > Rp709.000.000 s/d Rp965.000.000 | 32.00% |
| 40 | > Rp965.000.000 s/d Rp1.419.000.000 | 33.00% |
| 41 | > Rp1.419.000.000 | 34.00% |

---

## 4. TER HARIAN UNTUK PEGAWAI TIDAK TETAP

Berdasarkan **PP No. 58 Tahun 2023 Pasal 3** dan **PMK No. 168 Tahun 2023 Pasal 5 ayat (1) huruf c**:

| Rentang Penghasilan Bruto Sehari (Rp) | Tarif TER Harian (%) | Mekanisme Perhitungan Pemotongan |
|---------------------------------------|----------------------|----------------------------------|
| **s/d Rp450.000** | **0.00%** | Tidak ada pemotongan PPh 21 harian. |
| **> Rp450.000 s/d Rp2.500.000** | **0.50%** | $\text{PPh 21 Sehari} = 0.5\% \times \text{Penghasilan Bruto Sehari}$ |
| **> Rp2.500.000** | **Tarif Pasal 17** | $\text{PPh 21 Sehari} = \text{Tarif Pasal 17} \times (50\% \times \text{Penghasilan Bruto Sehari})$ atau disetahunkan per ketentuan PMK 168/2023 |

*Ketentuan Ambang Batas Kumulatif Bulanan*:
- Jika dalam 1 (satu) bulan kalender, akumulasi penghasilan bruto yang diterima pegawai tidak tetap melebihi **Rp2.500.000**, atau upah dibayarkan secara periodik bulanan, pemotongan PPh 21 otomatis dialihkan menggunakan tarif **TER Bulanan**.

---

## 5. MEKANISME REKONSILIASI MASA PAJAK TERAKHIR (DESEMBER / RESIGN)

Pada Masa Pajak Terakhir, perhitungan pajak tahunan dihitung secara definitif dengan rumus:

$$\text{PPh 21 Terutang Setahun} = \text{Tarif Progresif Pasal 17 ayat (1) huruf a UU HPP} \times \text{Penghasilan Kena Pajak (PKP)}$$
$$\text{PPh 21 Masa Terakhir} = \text{PPh 21 Terutang Setahun} - \sum_{m=1}^{N-1} \text{PPh 21 yang Telah Dipotong}$$

### 5.1 Tabel Tarif Progresif Pasal 17 ayat (1) huruf a UU HPP
| Lapisan | Rentang Penghasilan Kena Pajak (PKP) Tahunan (Rp) | Tarif Pajak (%) |
|:-------:|:-------------------------------------------------|:---------------:|
| **I** | Rp0 s/d Rp60.000.000 | **5%** |
| **II** | > Rp60.000.000 s/d Rp250.000.000 | **15%** |
| **III** | > Rp250.000.000 s/d Rp500.000.000 | **25%** |
| **IV** | > Rp500.000.000 s/d Rp5.000.000.000 | **30%** |
| **V** | > Rp5.000.000.000 | **35%** |

### 5.2 Komponen Perhitungan PKP Tahunan
1. **Penghasilan Bruto Setahun**:
   $$\text{Bruto Setahun} = \sum (\text{Gaji Pokok} + \text{Tunjangan Tetap/Tidak Tetap} + \text{Lembur} + \text{Premi JKK} + \text{Premi JKM} + \text{Premi BPJS Kes Perusahaan} + \text{THR/Bonus} + \text{Natura Objek Pajak})$$
2. **Pengurang Penghasilan Bruto**:
   - **Biaya Jabatan**: $5\% \times \text{Penghasilan Bruto}$, dengan plafon maksimal **Rp500.000 per bulan** atau **Rp6.000.000 per tahun**.
   - **Iuran Pensiun / JHT / JP Pekerja**: Total iuran JHT (2%) dan JP (1% s/d batas upah tertinggi) yang dibayarkan sendiri oleh pekerja.
3. **Penghasilan Neto Setahun**:
   $$\text{Penghasilan Neto Setahun} = \text{Penghasilan Bruto Setahun} - \text{Biaya Jabatan Setahun} - \text{Iuran JHT/JP Pekerja Setahun}$$
4. **Penghasilan Kena Pajak (PKP)**:
   $$\text{PKP} = \lfloor (\text{Penghasilan Neto Setahun} - \text{PTKP}) \rfloor_{1000}$$
   *(Catatan: Nilai PKP dibulatkan ke bawah hingga ribuan penuh sesuai ketentuan perpajakan RI).*
5. **Penanganan Kelebihan Potong (Lebih Bayar Pajak)**:
   - Apabila PPh 21 Terutang Setahun $<$ Total PPh 21 yang Telah Dipotong (Jan–Nov), nilai PPh 21 Masa Terakhir bernilai negatif (**Lebih Bayar**).
   - Perusahaan **wajib mengembalikan (*refund*) kelebihan potong tersebut secara tunai kepada pekerja** pada slip gaji masa terakhir, dan perusahaan melakukan kompensasi kelebihan bayar pada SPT Masa PPh 21 Masa Desember ke bulan pajak berikutnya.

---

## 6. PERLAKUAN KHUSUS SUBJEK & OBJEK PAJAK TERTENTU

### 6.1 Bukan Pegawai (Tenaga Ahli, Freelancer, Konsultan)
Berdasarkan PMK 168/2023 Pasal 3 ayat (1) huruf c:
- Dasar Pengenaan Pajak (DPP) = **50% dari Penghasilan Bruto**.
- Pemotongan PPh 21:
  $$\text{PPh 21} = \text{Tarif Progresif Pasal 17} \times (50\% \times \text{Penghasilan Bruto})$$
- Dihitung secara kumulatif untuk penerimaan penghasilan berkesinambungan dalam satu tahun kalender dari pemberi kerja yang sama.

### 6.2 Uang Pesangon Dibayar Sekaligus (PP No. 68/2009)
Pemotongan PPh 21 atas pesangon PHK yang dibayarkan sekaligus bersifat **FINAL**:
| Lapisan Penghasilan Bruto Pesangon (Rp) | Tarif Final PPh 21 (%) |
|:---------------------------------------|:----------------------:|
| s/d Rp50.000.000 | **0% (Bebas Pajak)** |
| > Rp50.000.000 s/d Rp100.000.000 | **5%** |
| > Rp100.000.000 s/d Rp500.000.000 | **15%** |
| > Rp500.000.000 | **25%** |

*Catatan Tahapan Pembayaran*: Jika pesangon dicicil hingga memasuki tahun ke-3 (melebihi 2 tahun kalender), pembayaran pada tahun ke-3 dan seterusnya diperlakukan sebagai penghasilan tidak final dengan tarif umum Pasal 17 UU HPP.

### 6.3 Imbalan Natura dan/atau Kenikmatan (PMK No. 66/2023)
- **Natura Non-Objek Pajak (Bebas PPh 21)**:
  1. Penyediaan makanan/minuman bagi seluruh pegawai di tempat kerja, atau kupon makan bagi pegawai dinas luar (maksimal Rp2.000.000/bulan atau senilai biaya makan di kantor).
  2. Bingkisan Hari Raya Keagamaan resmi (tanpa batasan nilai nominal).
  3. Bingkisan selain hari raya keagamaan (maksimal Rp3.000.000 per tahun per pegawai).
  4. Fasilitas olahraga (selain golf, berkuda, perahu motor, terbang layang, otomotif) maksimal Rp1.500.000 per tahun per pegawai.
  5. Sarana kerja penunjang keselamatan kerja (K3, seragam pabrik/lapangan).
  6. Fasilitas tempat tinggal bersama/komunal (mess karyawan).
- **Natura Objek Pajak**: Nilai fasilitas yang melebihi batas pengecualian atau di luar kriteria bebas pajak dinilai berdasarkan harga pasar wajar atau biaya sewa riil, lalu **ditambahkan sebagai komponen penghasilan bruto PPh 21** pada bulan bersangkutan.

#### Perlakuan Wajib Pajak Tanpa NPWP (Post-UU HPP)

Sejak berlakunya UU No. 7 Tahun 2021 (UU HPP), perlakuan PPh 21 untuk karyawan yang belum memiliki NPWP adalah sebagai berikut:

**Mekanisme: Tarif TER × 120% (bukan tambahan flat 20%)**

Contoh perhitungan:
- Karyawan dengan gaji Rp 10.000.000/bulan, status TK/0 (Kategori TER A)
- Tarif TER normal: 2%
- **Dengan NPWP**: PPh 21 = Rp 10.000.000 × 2% = **Rp 200.000**
- **Tanpa NPWP**: PPh 21 = Rp 10.000.000 × (2% × 120%) = Rp 10.000.000 × 2,4% = **Rp 240.000**

> **Penting**: Mekanismenya adalah mengalikan **tarif** dengan 120%, BUKAN menambahkan 20% secara flat pada jumlah pajak. Perbedaannya signifikan pada tarif tinggi.

**Implikasi untuk CatatGaji:**
- Tambahkan field boolean `has_npwp` pada data karyawan
- Jika `has_npwp = false`, kalikan tarif TER yang ditemukan dengan faktor 1,2 sebelum menghitung PPh 21
- Tampilkan notifikasi/reminder kepada Admin HR bahwa karyawan belum memiliki NPWP

---

## 7. SKEMA METODE PEMOTONGAN PPH 21: GROSS, GROSS-UP, DAN NET

CatatGaji mendukung 3 (tiga) metode pemotongan pajak yang umum digunakan oleh perusahaan:

```
+---------------------------------------------------------------------------------------------------+
| METODE      | MEKANISME BEBAN PAJAK        | DAMPAK TERHADAP THP         | ASPEK FISKAL PERUSAHAAN|
+-------------+------------------------------+-----------------------------+------------------------+
| 1. GROSS    | Pajak ditanggung Karyawan    | Gaji Bruto dipotong PPh 21  | Biaya Gaji Deductible  |
| 2. GROSS-UP | Diberikan Tunjangan Pajak    | THP Karyawan Utuh           | Tunjangan Deductible   |
| 3. NET      | Pajak ditanggung Perusahaan  | THP Karyawan Utuh (Eksplisit)| Pajak Non-Deductible  |
+---------------------------------------------------------------------------------------------------+
```

### 7.1 Formula Matematis Skema Gross-Up
Dalam skema Gross-Up, perusahaan memberikan **Tunjangan Pajak ($T_p$)** yang nilainya tepat sama dengan besaran PPh 21 yang terutang atas total penghasilan bruto setelah ditambah tunjangan tersebut:

$$\text{Bruto Baru} = \text{Bruto Awal} + T_p$$
$$\text{PPh 21} = f(\text{Bruto Baru}) = T_p$$

Pada masa Januari s/d November (menggunakan tarif TER), nilai $T_p$ dihitung secara aljabar langsung atau melalui algoritma iteratif terkonvergensi:

$$T_p = \frac{\text{TER} \times \text{Bruto Awal}}{1 - \text{TER}}$$

*Contoh*: Bruto Awal = Rp10.000.000, Status TK/0 (TER A = 2.00%).
$$T_p = \frac{2\% \times 10.000.000}{1 - 0.02} = \frac{200.000}{0.98} = \text{Rp204.081,63}$$
Bruto Baru = Rp10.204.082. Tarif TER A pada rentang > Rp10.050.000 s/d Rp10.350.000 adalah **2.25%**.
Maka iterasi konvergen akan menetapkan bracket tarif yang sesuai hingga $\text{PPh 21} = T_p$.

---

*Dokumen ini menjadi rujukan teknis utama untuk implementasi modul PPh 21 Engine pada platform CatatGaji.*
