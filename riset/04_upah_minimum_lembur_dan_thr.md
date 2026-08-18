# UPAH MINIMUM, KOMPOSISI UPAH, LEMBUR, DAN THR KEAGAMAAN
**Dokumen Riset Regulasi CatatGaji — Dokumen 04**

---

## 1. STRUKTUR DAN KOMPOSISI PENGUPAHAN

Berdasarkan **Undang-Undang No. 13 Tahun 2003** jo. **Undang-Undang No. 6 Tahun 2023 (UU Cipta Kerja)** jo. **PP No. 36 Tahun 2021**:

### 1.1 Komponen Upah
1. **Upah Pokok (Basic Salary)**: Imbalan dasar yang dibayarkan kepada pekerja menurut tingkat atau jenis pekerjaan yang besarannya ditetapkan berdasarkan kesepakatan.
2. **Tunjangan Tetap (Fixed Allowance)**: Pembayaran teratur yang berkaitan dengan pekerjaan yang diberikan secara berkala tanpa dipengaruhi oleh absensi, pencapaian target kerja, atau performa (contoh: tunjangan jabatan, tunjangan keluarga, tunjangan keahlian).
3. **Tunjangan Tidak Tetap (Variable Allowance)**: Pembayaran yang secara langsung atau tidak langsung berkaitan dengan kehadiran atau prestasi kerja (contoh: uang makan harian berbasis absensi, insentif kehadiran, uang transport per kehadiran).

### 1.2 Mandat Proporsi Upah Pokok Minimal 75% (Pasal 94 UU Ketenagakerjaan)
Dalam hal komponen upah terdiri dari Upah Pokok dan Tunjangan Tetap, maka besarnya Upah Pokok **sedikit-dikitnya 75% (tujuh puluh lima persen)** dari jumlah Upah Pokok dan Tunjangan Tetap:

$$\text{Upah Pokok} \ge 75\% \times (\text{Upah Pokok} + \text{Tunjangan Tetap})$$
$$\text{Tunjangan Tetap} \le 25\% \times (\text{Upah Pokok} + \text{Tunjangan Tetap})$$

*Implikasi Hukum bagi CatatGaji*:
- Sistem wajib melakukan validasi struktur komponen gaji saat input data master karyawan. Jika proporsi pokok $< 75\%$, sistem memberikan peringatan *Compliance Audit Alert* dan menggunakan nilai penyesuaian dasar upah minimum untuk perhitungan lembur dan pesangon.

---

## 2. REGULASI UPAH MINIMUM (UMP / UMK) & ATURAN KHUSUS UMKM

### 2.1 Ketentuan Upah Minimum & Putusan MK No. 168/PUU-XXI/2023
- **Jaring Pengaman (*Safety Net*)**: Upah Minimum Provinsi (UMP) dan Upah Minimum Kabupaten/Kota (UMK) **hanya berlaku bagi pekerja dengan masa kerja kurang dari 1 (satu) tahun** pada perusahaan yang bersangkutan.
- **Struktur dan Skala Upah (SUSU)**: Bagi pekerja dengan masa kerja 1 tahun atau lebih, pengusaha wajib memberlakukan Struktur dan Skala Upah dengan memperhatikan kompetensi, pendidikan, golongan jabatan, dan kemampuan perusahaan (Pasal 92 UU 13/2003 jo. UU 6/2023).
- **Putusan MK No. 168/PUU-XXI/2023**: Mahkamah Konstitusi menegaskan bahwa penetapan upah minimum wajib melibatkan peran aktif Dewan Pengupahan Daerah serta mempertimbangkan Kebutuhan Hidup Layak (KHL), laju inflasi, dan pertumbuhan ekonomi daerah secara proporsional.

### 2.2 Pengecualian Usaha Mikro dan Usaha Kecil (UMKM) — PP No. 36/2021 Pasal 36
Usaha Mikro dan Kecil (UMKM) **dikecualikan dari ketentuan Upah Minimum**. Upah pada Usaha Mikro dan Kecil ditetapkan berdasarkan kesepakatan tertulis antara pengusaha dan pekerja dengan kriteria batas bawah:
1. Paling sedikit **50% dari rata-rata konsumsi masyarakat** di tingkat provinsi; dan
2. Nilai upah yang disepakati sekurang-kurangnya **25% di atas garis kemiskinan** di tingkat provinsi.

---

## 3. PERHITUNGAN UPAH KERJA LEMBUR (OVERTIME) — PP NO. 35 TAHUN 2021

Kerja lembur adalah waktu kerja yang melebihi 7 jam sehari dan 40 jam seminggu untuk 6 hari kerja, atau 8 jam sehari dan 40 jam seminggu untuk 5 hari kerja, atau kerja pada hari istirahat mingguan/hari libur resmi nasional.

### 3.1 Formula Dasar Upah Sejam Lembur (1/173)
$$\text{Upah Sejam Lembur} = \frac{1}{173} \times \text{Upah Sebulan}$$

*Ketentuan Komponen Upah Sebulan*:
1. Jika upah terdiri dari **Upah Pokok + Tunjangan Tetap**, maka dasar perhitungan lembur adalah $100\% \times (\text{Upah Pokok} + \text{Tunjangan Tetap})$.
2. Jika upah terdiri dari **Upah Pokok + Tunjangan Tetap + Tunjangan Tidak Tetap**, dan $(\text{Upah Pokok} + \text{Tunjangan Tetap}) < 75\%$ total upah, maka dasar perhitungan lembur adalah **75% dari total upah**.

---

### 3.2 Matriks Multiplier Lembur Lengkap (Pasal 31 PP No. 35/2021)

#### A. Lembur pada Hari Kerja Biasa
| Jam Lembur | Faktor Pengali (Multiplier) | Rumus Upah Lembur |
|:----------:|:---------------------------:|:------------------|
| **Jam Pertama (Jam ke-1)** | **1.5x** | $1.5 \times \text{Upah Sejam}$ |
| **Jam Berikutnya (Jam ke-2, ke-3, ke-4)** | **2.0x** | $2.0 \times \text{Upah Sejam}$ per jam |

---

#### B. Lembur pada Hari Istirahat Mingguan & Libur Resmi — Sistem 5 Hari Kerja (40 Jam/Minggu)
| Jam Lembur | Faktor Pengali (Multiplier) | Keterangan / Formula |
|:----------:|:---------------------------:|:---------------------|
| **Jam ke-1 s/d Jam ke-8** | **2.0x** | $2.0 \times \text{Upah Sejam}$ per jam |
| **Jam ke-9** | **3.0x** | $3.0 \times \text{Upah Sejam}$ |
| **Jam ke-10, ke-11, ke-12** | **4.0x** | $4.0 \times \text{Upah Sejam}$ per jam |

---

#### C. Lembur pada Hari Istirahat Mingguan & Libur Resmi — Sistem 6 Hari Kerja (40 Jam/Minggu)
| Jam Lembur | Faktor Pengali (Multiplier) | Keterangan / Formula |
|:----------:|:---------------------------:|:---------------------|
| **Jam ke-1 s/d Jam ke-7** | **2.0x** | $2.0 \times \text{Upah Sejam}$ per jam |
| **Jam ke-8** | **3.0x** | $3.0 \times \text{Upah Sejam}$ |
| **Jam ke-9, ke-10, ke-11** | **4.0x** | $4.0 \times \text{Upah Sejam}$ per jam |

---

#### D. Lembur pada Hari Libur Resmi yang Jatuh pada Hari Kerja Terpendek (Contoh: Hari Jumat 5 Jam Kerja)
| Jam Lembur | Faktor Pengali (Multiplier) | Keterangan / Formula |
|:----------:|:---------------------------:|:---------------------|
| **Jam ke-1 s/d Jam ke-5** | **2.0x** | $2.0 \times \text{Upah Sejam}$ per jam |
| **Jam ke-6** | **3.0x** | $3.0 \times \text{Upah Sejam}$ |
| **Jam ke-7, ke-8** | **4.0x** | $4.0 \times \text{Upah Sejam}$ per jam |

---

### 3.3 Batas Waktu Lembur & Kewajiban Administratif SPKL
- **Batas Maksimal Lembur Hari Kerja**: Paling banyak **4 (empat) jam dalam 1 hari** dan **18 (delapan belas) jam dalam 1 minggu** (tidak termasuk lembur pada hari libur resmi).
- **Surat Perintah Kerja Lembur (SPKL)**: Wajib dibuat secara tertulis atau melalui media digital (fitur approval CatatGaji) yang ditandatangani oleh atasan dan disetujui pekerja.
- **Penyediaan Makanan Minuman K3**: Apabila lembur dilakukan selama **4 (empat) jam atau lebih**, pemberi kerja wajib memberikan makanan dan minuman sekurang-kurangnya **1.400 kkal** (tidak boleh diganti dalam bentuk uang tunai).

---

## 4. TUNJANGAN HARI RAYA (THR) KEAGAMAAN — PERMENAKER NO. 6 TAHUN 2016

Tunjangan Hari Raya (THR) Keagamaan adalah pendapatan non-upah yang wajib dibayarkan oleh pengusaha kepada pekerja menjelang Hari Raya Keagamaan (Idul Fitri, Natal, Nyepi, Waisak, atau Imlek sesuai agama masing-masing pekerja).

### 4.1 Syarat & Batas Waktu Pembayaran
1. **Masa Kerja Minimal**: Mempunyai masa kerja minimal **1 (satu) bulan secara terus-menerus** pada hubungan kerja PKWT maupun PKWTT.
2. **Batas Waktu Pembayaran**: Wajib dibayarkan paling lambat **7 (tujuh) hari kalender sebelum hari raya keagamaan (H-7)**.
3. **Ketentuan Denda Keterlambatan**: Pengusaha yang terlambat membayar THR dikenakan denda sebesar **5% (lima persen)** dari total THR yang harus dibayar sejak berakhirnya batas waktu kewajiban pengusaha, tanpa menghilangkan kewajiban membayar THR.

### 4.2 Formula Perhitungan THR

```
+-------------------------------------------------------------------------+
|                  FORMULA PERHITUNGAN THR KEAGAMAAN                      |
+-------------------------------------------------------------------------+
|  1. MASA KERJA >= 12 BULAN TERUS MENERUS:                               |
|     THR = 1 x (Upah Pokok + Tunjangan Tetap)                            |
|                                                                         |
|  2. MASA KERJA 1 BULAN s/d < 12 BULAN (PRORATA):                        |
|     THR = (Masa Kerja dalam Bulan / 12) x (Upah Pokok + Tunj Tetap)     |
|                                                                         |
|  3. PEKERJA HARIAN LEPAS / BORONGAN:                                    |
|     - Masa Kerja >= 12 Bulan: Rata-rata upah 12 bulan terakhir          |
|     - Masa Kerja < 12 Bulan: Rata-rata upah tiap bulan masa kerja       |
+-------------------------------------------------------------------------+
```

### 4.3 Ketentuan PHK Menjelang Hari Raya
- **Pekerja PKWTT (Tetap)**: Apabila hubungan kerja terputus (PHK/Resign) terhitung sejak **30 (tiga puluh) hari sebelum hari raya keagamaan**, pekerja **tetap berhak atas THR penuh**.
- **Pekerja PKWT (Kontrak)**: Apabila jangka waktu kontrak PKWT berakhir sebelum hari raya keagamaan, pekerja **tidak berhak atas THR**.

### 4.4 Pemajakan PPh 21 TER atas Pembayaran THR
Berdasarkan PMK 168/2023, pada bulan pembayaran THR, nilai THR digabungkan dengan upah reguler dan premi asuransi perusahaan:

$$\text{Penghasilan Bruto Bulan THR} = \text{Gaji Reguler} + \text{Premi JKK/JKM/Kes Perusahaan} + \text{THR}$$
$$\text{PPh 21 Bulan THR} = \text{Tarif TER Bulanan (berdasarkan total Bruto Bulan THR)} \times \text{Penghasilan Bruto Bulan THR}$$

---

*Dokumen ini menjadi rujukan teknis resmi untuk konfigurasi upah pokok, lembur, dan THR pada platform CatatGaji.*
