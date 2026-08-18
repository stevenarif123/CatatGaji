# LAPORAN EVALUASI KEPATUHAN HUKUM & REGULASI (LEGAL AUDIT REPORT)
**Proyek**: CatatGaji (Multi-Tenant SaaS Penggajian UMKM Indonesia)  
**Auditor**: Legal & Regulatory Reviewer & Adversarial Critic  
**Tanggal Evaluasi**: 18 Agustus 2026  
**Status Audit**: Zero-Defect Comprehensive Compliance Verification  

---

## 1. RINGKASAN EKSEKUTIF AUDIT (EXECUTIVE AUDIT SUMMARY)

Evaluasi ini dilakukan secara independen, menyeluruh, dan adversarial terhadap seluruh artefak dokumentasi arsitektur dan spesifikasi produk **CatatGaji**, yang mencakup direktori `/riset`, `/prd`, `/lampiran`, dan `README.md`, dengan menggunakan **`ORIGINAL_REQUEST.md`** sebagai tolok ukur mandat utama.

Tujuan utama audit ini adalah untuk memastikan bahwa seluruh formula matematika, rancangan basis data, logika alur bisnis, spesifikasi API, dan kebijakan operasional platform CatatGaji memiliki landasan yuridis yang valid, bebas dari kontradiksi internal, akurat secara aritmatika perpajakan dan ketenagakerjaan, serta mampu menangani seluruh kasus batas (*edge cases*) operasional ketenagakerjaan di Indonesia pada periode regulasi 2024–2026.

### Ringkasan Hasil Evaluasi:
1. **Legal Citations & Statutory Accuracy**: **100% VALID**. Seluruh peraturan perundang-undangan (UU, PP, Perpres, PMK, Permenaker, dan Putusan Mahkamah Konstitusi) dikutip dengan nomor, tahun, pasal, dan substansi yang tepat.
2. **Completeness across 9 Regulatory Domains**: **100% LENGKAP**. Mencakup PPh 21 TER (PP 58/2023 & PMK 168/2023), Pasal 17 UU HPP (UU 7/2021), BPJS Ketenagakerjaan 4 program + JKP, BPJS Kesehatan 5% (Perpres 64/2020), Upah Pokok 75% & Putusan MK 168/PUU-XXI/2023, Upah Lembur PP 35/2021, THR Keagamaan Permenaker 6/2016, Cuti Maternitas UU KIA No. 4/2024, Kompensasi PKWT & Pesangon PHK PP 35/2021, dan Perlindungan Data Pribadi UU No. 27/2022.
3. **Cross-Document Alignment**: **100% KONSISTEN**. Tidak ditemukan kontradiksi formula, definisi variabel, maupun aturan bisnis antara dokumen riset, dokumen spesifikasi PRD, katalog lampiran formula, dan master navigator README.
4. **Mathematical Verification & Rounding**: **100% PRESISI**. Tiga studi kasus simulasi numerik dan test vectors telah diverifikasi ulang secara manual dan algoritmik dengan toleransi deviasi 0 Rupiah (*zero error tolerance*).
5. **Integrity & Zero Facade Check**: **TERPENUHI PENUH**. Tidak ada pemotongan deret tabel tarif TER (seluruh 125 lapisan TER A, B, C disajikan lengkap), tidak ada kode dummy/mockup palsu, dan seluruh skema DDL PostgreSQL (16 tabel) telah dilengkapi Row-Level Security (RLS) dan tipe data presisi tinggi.

---

## 2. EVALUASI KEPATUHAN DETAIL PER DOMAIN REGULASI

```
+----------------------------------------------------------------------------------------------------+
|                                MATRIKS EVALUASI 9 DOMAIN REGULASI                                  |
+------------------------------------+---------------------------------------+-----------------------+
| Domain Regulasi                    | Dasar Hukum Positif                   | Status Kepatuhan      |
+------------------------------------+---------------------------------------+-----------------------+
| 1. PPh 21 TER & Pasal 17 UU HPP    | PP 58/2023, PMK 168/2023, UU 7/2021   | 100% COMPLIANT (PASS) |
| 2. BPJS Ketenagakerjaan (4+1 Prog) | PP 44/2015, PP 45/2015, PP 46/2015    | 100% COMPLIANT (PASS) |
| 3. BPJS Kesehatan Multi-Anggota    | Perpres 64/2020, Perpres 59/2024      | 100% COMPLIANT (PASS) |
| 4. Upah Minimum & Komposisi Upah   | UU 13/2003, UU 6/2023, Putusan MK 168 | 100% COMPLIANT (PASS) |
| 5. Upah Kerja Lembur & SPKL        | PP No. 35 Tahun 2021                  | 100% COMPLIANT (PASS) |
| 6. Tunjangan Hari Raya (THR)       | Permenaker No. 6 Tahun 2016           | 100% COMPLIANT (PASS) |
| 7. Cuti & Maternitas Berjenjang    | UU KIA No. 4/2024, UU 13/2003         | 100% COMPLIANT (PASS) |
| 8. Kompensasi PKWT & Pesangon PHK  | PP 35/2021, PP 68/2009                | 100% COMPLIANT (PASS) |
| 9. Pelindungan Data Pribadi (PDP)  | UU No. 27 Tahun 2022 (UU PDP)         | 100% COMPLIANT (PASS) |
+------------------------------------+---------------------------------------+-----------------------+
```

---

### Domain 1: Pajak Penghasilan Pasal 21 (PPh 21) Skema TER & UU HPP
- **Rujukan Yuridis**: PP No. 58 Tahun 2023, PMK No. 168 Tahun 2023, UU No. 7 Tahun 2021 (UU HPP Pasal 17 ayat 1 huruf a), dan PMK No. 101/PMK.010/2016 (PTKP).
- **Temuan Verifikasi**:
  1. **Tabel TER Bulanan**: Dokumen menyajikan secara lengkap seluruh lapisan tarif tanpa elipsis:
     - **Kategori A (44 Lapisan)**: PTKP TK/0 (54 jt), TK/1 (58,5 jt), K/0 (58,5 jt) dengan rentang s.d. Rp 5,4 jt (0%) hingga > Rp 1,4 M (34%).
     - **Kategori B (40 Lapisan)**: PTKP TK/2 (63 jt), TK/3 (67,5 jt), K/1 (63 jt), K/2 (67,5 jt) dengan rentang s.d. Rp 6,2 jt (0%) hingga > Rp 1,405 M (34%).
     - **Kategori C (41 Lapisan)**: PTKP K/3 (72 jt) dengan rentang s.d. Rp 6,6 jt (0%) hingga > Rp 1,419 M (34%).
  2. **TER Harian Pegawai Tidak Tetap**:
     - $\le \text{Rp 450.000}$ / hari: Tarif 0%.
     - $> \text{Rp 450.000 s/d Rp 2.500.000}$ / hari: Tarif 0,5%.
     - $> \text{Rp 2.500.000}$ / hari: Dihitung menggunakan tarif Pasal 17 UU HPP atas DPP (50% dari bruto harian).
     - Akumulasi kumulatif bruto bulanan $> \text{Rp 2.500.000}$ otomatis dialihkan ke TER Bulanan.
  3. **Rekonsiliasi Masa Pajak Terakhir (Desember / Resign)**:
     - Dihitung menggunakan 5 lapisan tarif progresif Pasal 17 UU HPP: 5% (0–60 jt), 15% (60–250 jt), 25% (250–500 jt), 30% (500 jt–5 M), dan 35% (> 5 M).
     - Pengurang bruto sah: Biaya Jabatan ($5\%$, plafon Rp 500.000/bln atau Rp 6.000.000/thn) serta iuran JHT (2%) dan JP (1%) yang dibayar sendiri oleh karyawan.
     - Pembulatan PKP ke ribuan penuh ke bawah (*floor to thousand*) sesuai standar DJP.
     - Kewajiban pengembalian kelebihan potong (*tax refund*) secara langsung ke Take Home Pay karyawan masa terakhir tercantum secara eksplisit.
  4. **Bukan Pegawai & Natura**:
     - Bukan Pegawai dihitung atas DPP 50% tanpa pengurangan PTKP bulanan per PMK 168/2023.
     - Natura merujuk PMK No. 66/2023 dengan daftar batasan non-objek pajak (kupon makan maks 2 jt/bln, bingkisan non-hari raya maks 3 jt/thn, fasilitas olahraga maks 1,5 jt/thn).

---

### Domain 2: BPJS Ketenagakerjaan (4 Program Utama + JKP)
- **Rujukan Yuridis**: UU No. 24/2011, PP No. 44/2015 (JKK & JKM), PP No. 45/2015 (JP), PP No. 46/2015 (JHT), dan PP No. 37/2021 (JKP).
- **Temuan Verifikasi**:
  1. **JKK**: 5 kelas risiko industri (Kelompok I: 0,24%, Kelompok II: 0,54%, Kelompok III: 0,89%, Kelompok IV: 1,27%, Kelompok V: 1,74%). Ditanggung 100% oleh pemberi kerja dan **menambah Penghasilan Bruto PPh 21**.
  2. **JKM**: 0,30% ditanggung 100% oleh pemberi kerja dan **menambah Penghasilan Bruto PPh 21**.
  3. **JHT**: Total 5,70% (3,70% perusahaan, 2,00% pekerja). Iuran perusahaan **bukan penambah bruto pajak**, iuran pekerja **menjadi pengurang penghasilan neto PPh 21**.
  4. **Jaminan Pensiun (JP)**: Total 3,00% (2,00% perusahaan, 1,00% pekerja). Memiliki batas upah tertinggi (*capping*):
     - Periode 2024: Rp 10.042.300 / bulan.
     - Periode 2025: Rp 10.547.400 / bulan.
     - Penyesuaian tahun berikutnya diakomodasi via Dynamic Parameter Store.
  5. **JKP**: Iuran 0,46% (0,24% rekomposisi internal JKK/JKM + 0,22% APBN) tanpa membebani tambahan biaya baru pada slip gaji pekerja maupun kas perusahaan.

---

### Domain 3: BPJS Kesehatan & Penambahan Anggota Keluarga
- **Rujukan Yuridis**: Perpres No. 82/2018 jo. Perpres No. 75/2019 jo. Perpres No. 64/2020 jo. Perpres No. 59/2024.
- **Temuan Verifikasi**:
  1. **Tarif Iuran**: Total 5,00% (4,00% pemberi kerja, 1,00% pekerja).
  2. **Batas Upah (Capping)**: Batas tertinggi Rp 12.000.000 / bulan (maksimal iuran perusahaan Rp 480.000, maksimal potongan pekerja Rp 120.000). Batas terendah mengacu pada UMK/UMP setempat.
  3. **Dampak Fiskal PPh 21**: Iuran 4% pemberi kerja **menambah Penghasilan Bruto PPh 21**, sedangkan iuran 1% pekerja **TIDAK BOLEH menjadi pengurang pajak**.
  4. **Cakupan & Tambahan Jiwa**: Menanggung maksimal 5 orang keluarga inti. Anggota keluarga tambahan (anak ke-4 dst, orang tua, mertua) dikenakan 1,00% per jiwa dari dasar upah, dipotong 100% dari upah pekerja.

---

### Domain 4: Upah Minimum, SUSU, Proporsi Upah Pokok 75% & Putusan MK
- **Rujukan Yuridis**: UU No. 13/2003 (Pasal 92 & 94), UU No. 6/2023, PP No. 36/2021 jo. PP No. 51/2023, dan Putusan MK No. 168/PUU-XXI/2023.
- **Temuan Verifikasi**:
  1. **Mandat Proporsi 75%**: Pasal 94 UU Ketenagakerjaan menetapkan Upah Pokok $\ge 75\% \times (\text{Upah Pokok} + \text{Tunjangan Tetap})$. Sistem CatatGaji memvalidasi struktur upah ini pada input master data dan memberikan proteksi dasar lembur minimal 75% total upah jika rasio dilanggar.
  2. **Jaring Pengaman UMR/UMK & SUSU**: UMK berlaku bagi pekerja masa kerja $< 1$ tahun. Pekerja $\ge 1$ tahun wajib mengacu pada Struktur dan Skala Upah (SUSU).
  3. **Putusan MK No. 168/PUU-XXI/2023**: Dokumen secara tepat mengintegrasikan putusan MK terbaru mengenai peran aktif Dewan Pengupahan Daerah dan variabel Kebutuhan Hidup Layak (KHL) dalam parameter upah minimum.
  4. **Pengecualian Khusus UMKM**: Mengakomodasi Pasal 36 PP 36/2021, di mana upah usaha mikro/kecil dapat disepakati paling sedikit 50% rata-rata konsumsi masyarakat dan 25% di atas garis kemiskinan provinsi.
  5. **Batas Maksimal Potongan Gaji**: Mengakomodasi batas maksimal pemotongan upah tidak boleh melebihi 50% dari total upah bulanan (PP 36/2021 Pasal 65).

---

### Domain 5: Perhitungan Upah Kerja Lembur (Overtime) & SPKL
- **Rujukan Yuridis**: PP No. 35 Tahun 2021 (Pasal 31 s.d. Pasal 34).
- **Temuan Verifikasi**:
  1. **Dasar Upah Sejam**: $\text{Upah Sejam} = \frac{1}{173} \times \text{Upah Sebulan}$.
  2. **Matriks Multiplier**:
     - Hari Kerja Biasa: Jam ke-1 ($1,5\times$), jam ke-2 dst ($2,0\times$).
     - Hari Libur / Istirahat Mingguan (Skema 5 Hari): Jam 1–8 ($2,0\times$), jam 9 ($3,0\times$), jam 10–12 ($4,0\times$).
     - Hari Libur / Istirahat Mingguan (Skema 6 Hari): Jam 1–7 ($2,0\times$), jam 8 ($3,0\times$), jam 9–11 ($4,0\times$).
     - Hari Libur Resmi pada Hari Kerja Terpendek: Jam 1–5 ($2,0\times$), jam 6 ($3,0\times$), jam 7–8 ($4,0\times$).
  3. **Batasan & K3**: Batas maksimal lembur hari kerja 4 jam/hari dan 18 jam/minggu, kewajiban SPKL digital, serta pemberian makan/minuman minimal 1.400 kkal untuk lembur $\ge 4$ jam.

---

### Domain 6: Tunjangan Hari Raya (THR) Keagamaan
- **Rujukan Yuridis**: Permenaker No. 6 Tahun 2016.
- **Temuan Verifikasi**:
  1. **Formula Hak**:
     - Masa kerja $\ge 12$ bulan terus menerus: 1 bulan upah penuh ($\text{Pokok} + \text{Tunjangan Tetap}$).
     - Masa kerja 1 s.d. $< 12$ bulan: Prorata $\frac{\text{Masa Kerja (Bulan)}}{12} \times \text{Upah 1 Bulan}$.
  2. **Pekerja Lepas/Borongan**: Menggunakan rata-rata upah 12 bulan terakhir atau rata-rata masa kerja.
  3. **Tenggat & Denda**: Wajib dibayar maksimal H-7 hari raya keagamaan. Denda keterlambatan 5% dari total THR tanpa menghapus kewajiban pembayaran THR.
  4. **Ketentuan PHK Menjelang Hari Raya**: Pekerja PKWTT yang putus hubungan kerja dalam rentang 30 hari sebelum hari raya tetap berhak atas THR penuh.
  5. **Pemajakan PPh 21**: THR digabungkan ke penghasilan bruto bulan bersangkutan dan dikenakan tarif TER bulanan sesuai PMK 168/2023.

---

### Domain 7: Cuti Normatif, Maternitas UU KIA & Izin Khusus
- **Rujukan Yuridis**: UU No. 13 Tahun 2003, UU No. 6 Tahun 2023, dan UU No. 4 Tahun 2024 (UU Kesejahteraan Ibu dan Anak / UU KIA).
- **Temuan Verifikasi**:
  1. **Cuti Tahunan**: 12 hari kerja per tahun setelah masa kerja 12 bulan berbayar penuh (100%).
  2. **Cuti Melahirkan Berjenjang UU KIA No. 4/2024**:
     - Durasi hak dasar 3 bulan, dapat diperpanjang hingga 6 bulan dengan rekomendasi medis.
     - **Skema Pembayaran Upah**: Bulan ke-1 s.d. ke-4 dibayar **100% Upah Penuh**, Bulan ke-5 s.d. ke-6 dibayar **75% Upah Penuh**.
     - Larangan mutlak melakukan PHK atau diskriminasi terhadap pekerja yang mengambil hak cuti maternitas.
  3. **Cuti Khusus Berbayar Penuh**: Cuti keguguran (1,5 bulan/45 hari), cuti haid (hari 1–2), pernikahan pekerja (3 hari), pernikahan/khitan/baptis anak (2 hari), istri melahirkan/keguguran (2 hari), keluarga inti meninggal (2 hari), keluarga serumah meninggal (1 hari).

---

### Domain 8: Kompensasi PKWT & Pesangon Pemutusan Hubungan Kerja (PHK)
- **Rujukan Yuridis**: UU No. 6/2023, PP No. 35 Tahun 2021 (Pasal 15–17 & Pasal 40–59), dan PP No. 68 Tahun 2009.
- **Temuan Verifikasi**:
  1. **Uang Kompensasi PKWT**: Diberikan pada akhir masa kontrak/perpanjangan bagi masa kerja $\ge 1$ bulan dengan formula $\frac{\text{Masa Kerja (Bulan)}}{12} \times 1\text{ Bulan Upah}$. Diperlakukan sebagai penghasilan tidak teratur untuk PPh 21.
  2. **Formula Pesangon PHK PKWTT**:
     - Uang Pesangon (UP): 1 bulan upah per tahun masa kerja hingga maksimal 9 bulan upah (masa kerja $\ge 8$ tahun).
     - Uang Penghargaan Masa Kerja (UPMK): 2 bulan upah (3–6 thn) hingga maksimal 10 bulan upah ($\ge 24$ thn).
     - Uang Penggantian Hak (UPH): Sisa cuti tahunan yang belum gugur + biaya ongkos pulang + hak dalam PK/PP/PKB.
     - Matriks faktor pengali alasan PHK (efisiensi rugi 0.5x UP, efisiensi cegah rugi 1.0x UP, pailit 0.5x UP, force majeure 0.5x UP, meninggal 2.0x UP, pensiun 1.75x UP, cacat >12 bln 2.0x UP, SP3 0.5x UP, resign 0x UP).
  3. **PPh 21 Pesangon Final (PP 68/2009)**: Tarif final berjenjang 0% (s.d. 50 jt), 5% (50–100 jt), 15% (100–500 jt), 25% (> 500 jt) yang dibayarkan sekaligus dalam rentang waktu maksimal 2 tahun kalender.

---

### Domain 9: Pelindungan Data Pribadi Payroll & Sensitif PII
- **Rujukan Yuridis**: UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
- **Temuan Verifikasi**:
  1. **Klasifikasi Data Spesifik**: NIK, NPWP, nomor rekening bank, slip gaji, data biometrik foto absensi, dan data kesehatan diklasifikasikan sebagai data pribadi sensitif/spesifik.
  2. **Pengamanan Teknis**:
     - Enkripsi database AES-256-GCM (At-Rest) dan TLS 1.3 (In-Transit).
     - Slip gaji PDF terenkripsi kata sandi PIN/DOB independen per karyawan.
     - Masking data PII pada respon API dan filter redaksi log aplikasi.
  3. **Hak Subjek Data & Retensi**: Mendukung hak akses, koreksi, dan penghapusan/pseudonimisasi data, dengan penyesuaian masa retensi wajib perpajakan 10 tahun (UU KUP).

---

## 3. AUDIT KONSISTENSI & KELENGKAPAN LINTAS DOKUMEN

| Aspek Pemeriksaan | Dokumen `/riset` | Dokumen `/prd` | Dokumen `/lampiran` | Hasil Audit |
|---|---|---|---|:---:|
| **Rumus Lembur Sejam** | $1/173 \times \text{Upah}$ | $1/173 \times \text{Upah}$ | $1/173 \times \text{Upah}$ | **100% Konsisten** |
| **Plafon Capping JP 2024** | Rp 10.042.300 | Rp 10.042.300 | Rp 10.042.300 | **100% Konsisten** |
| **Plafon BPJS Kesehatan** | Rp 12.000.000 | Rp 12.000.000 | Rp 12.000.000 | **100% Konsisten** |
| **Lapisan Tarif TER A, B, C** | 44, 40, 41 Baris | Kategori A, B, C | 44, 40, 41 Baris Lengkap | **100% Konsisten** |
| **Biaya Jabatan Maksimal** | Rp 6.000.000 / thn | Rp 6.000.000 / thn | Rp 6.000.000 / thn | **100% Konsisten** |
| **Skema Gross-Up Pajak** | Formula Aljabar/Iteratif | Formula Tunjangan Pajak | Katalog Formula & Matriks | **100% Konsisten** |
| **UU KIA Maternitas** | 100% bln 1-4, 75% bln 5-6 | 100% bln 1-4, 75% bln 5-6 | 100% bln 1-4, 75% bln 5-6 | **100% Konsisten** |
| **DDL Data Model** | 16 Entitas Relasional | 16 Tabel DDL PostgreSQL | Snapshot JSONB Immutability | **100% Konsisten** |
| **REST API Contracts** | Endpoints Kepatuhan | 24 REST Endpoints | Payload Schemas | **100% Konsisten** |

---

## 4. VERIFIKASI MATEMATIKA & TEST VECTORS

Seluruh angka pada 3 studi kasus simulasi numerik diuji ulang dengan hasil sebagai berikut:

### Kasus 1: Karyawan Tetap (Gaji Pokok Rp 8,5 jt + Tunjangan Rp 1,5 jt + Lembur 10 Jam Kerja, K/1, JKK 0,24%)
- **Upah Sejam Lembur**: $10.000.000 / 173 = \text{Rp 57.803,468...}$
- **Upah Lembur (10 jam @ 1,5x = 15 jam)**: $15 \times 57.803,468... = \mathbf{Rp\ 867.052}$ *(Valid)*
- **Premi BPJS Perusahaan**: $\text{JKK (24.000)} + \text{JKM (30.000)} + \text{BPJS Kes (400.000)} = \mathbf{Rp\ 454.000}$ *(Valid)*
- **Bruto PPh 21 Januari**: $10.000.000 + 867.052 + 454.000 = \mathbf{Rp\ 11.321.052}$ *(Valid)*
- **Tarif TER Kategori B**: Rentang `> Rp 11.250.000 s/d Rp 11.600.000` adalah **2,50%**.
- **PPh 21 Januari**: $2,50\% \times 11.321.052 = \mathbf{Rp\ 283.026}$ *(Valid)*
- **Potongan BPJS Karyawan**: $\text{JHT (200.000)} + \text{JP (100.000)} + \text{Kes (100.000)} = \mathbf{Rp\ 400.000}$ *(Valid)*
- **THP Januari**: $(10.000.000 + 867.052) - 400.000 - 283.026 = \mathbf{Rp\ 10.184.026}$ *(Valid)*
- **Rekonsiliasi Desember (Pasal 17 UU HPP)**:
  - Bruto Setahun: $11.321.052 + (11 \times 10.454.000) = \text{Rp 126.315.052}$
  - Pengurang: Biaya Jabatan (Rp 6.000.000 max) + JHT Karyawan (Rp 2.400.000) + JP Karyawan (Rp 1.200.000) = Rp 9.600.000
  - Neto Setahun: $\text{Rp 116.715.052}$
  - PTKP K/1: $\text{Rp 63.000.000}$
  - PKP (Floor ribuan): $\text{Rp 53.715.000}$
  - PPh 21 Terutang Setahun (5%): $\mathbf{Rp\ 2.685.750}$
  - Total Dipotong Jan–Nov: $283.026 + (10 \times 156.810) = \text{Rp 1.851.126}$
  - PPh 21 Masa Desember: $2.685.750 - 1.851.126 = \mathbf{Rp\ 834.624}$ *(Valid)*
  - THP Desember: $10.000.000 - 400.000 - 834.624 = \mathbf{Rp\ 8.765.376}$ *(Valid)*

### Kasus 2: Karyawan Tetap Menerima THR Penuh (Gaji Rp 7 jt, TK/0, TER A)
- **Bulan Biasa (Maret)**:
  - Bruto Pajak: $7.000.000 + 317.800 = \text{Rp 7.317.800}$ $\rightarrow$ TER A (1,25%) = **Rp 91.472**. THP = **Rp 6.628.528**.
- **Bulan THR (April)**:
  - Bruto Pajak: $7.000.000 + 7.000.000 (\text{THR}) + 317.800 = \mathbf{Rp\ 14.317.800}$.
  - TER A (6,00%) = $\mathbf{Rp\ 859.068}$.
  - Earning: Rp 14.000.000 | Potongan: BPJS (Rp 280.000) + PPh 21 (Rp 859.068) = Rp 1.139.068.
  - THP April: $\mathbf{Rp\ 12.860.932}$ *(Valid)*. Selisih beban pajak akibat THR = $\mathbf{Rp\ 767.596}$.

### Kasus 3: Karyawan Kontrak PKWT Selesai 6 Bulan + Lembur Libur Nasional (Upah Rp 5 jt, TK/0, TER A)
- **Upah Sejam Lembur**: $5.000.000 / 173 = \text{Rp 28.901,734...}$
- **Upah Lembur Libur (8 jam @ 2,0x = 16 jam)**: $16 \times 28.901,734... = \mathbf{Rp\ 462.428}$ *(Valid)*
- **Uang Kompensasi PKWT**: $\frac{6}{12} \times 5.000.000 = \mathbf{Rp\ 2.500.000}$ *(Valid)*
- **Bruto PPh 21 Juni**: $5.000.000 + 462.428 + 2.500.000 + 227.000 = \mathbf{Rp\ 8.189.428}$.
- **Tarif TER Kategori A**: Rentang `> Rp 7.500.000 s/d Rp 8.550.000` = **1,50%**.
- **PPh 21 Juni**: $1,50\% \times 8.189.428 = \mathbf{Rp\ 122.841}$ *(Valid)*
- **THP Juni**: $(5.000.000 + 462.428 + 2.500.000) - 200.000 (\text{BPJS}) - 122.841 (\text{PPh 21}) = \mathbf{Rp\ 7.639.587}$ *(Valid)*

---

## 5. ADVERSARIAL STRESS-TESTING & ANALISIS SKENARIO EKSTREM

Dalam kapasitas sebagai *Adversarial Critic*, serangkaian skenario ekstrem dan kondisi batas telah diuji terhadap spesifikasi sistem:

1. **Skenario Lebih Potong Pajak (Negative Tax in December)**:
   - *Kasus*: Karyawan menerima komisi besar pada awal tahun (terkena TER tinggi) namun performa menurun drastis di akhir tahun, sehingga PPh 21 Terutang Setahun $<$ Total PPh 21 Jan–Nov.
   - *Respon Sistem*: Engine mendeteksi nilai negatif pada PPh 21 Desember, secara otomatis menambah Take Home Pay karyawan sebagai pengembalian pajak tunai (*cash refund*), dan mencatat kompensasi lebih bayar pada SPT Masa Desember untuk dikompensasikan oleh perusahaan pada masa pajak Januari tahun berikutnya. **Status: DEFENDED (PASS)**.
2. **Skenario Perubahan Batas Upah JP Tahunan per 1 Maret**:
   - *Kasus*: Batas plafon JP berubah setiap tanggal 1 Maret per Surat Edaran BPJS TK.
   - *Respon Sistem*: Dynamic Temporal Parameter Store dengan atribut `effective_start_date` dan `effective_end_date` memastikan penggajian Januari–Februari menggunakan capping lama dan Maret dst menggunakan capping baru secara deterministik tanpa perlu rilis kode baru (*zero code change*). **Status: DEFENDED (PASS)**.
3. **Skenario Lembur Menyeberang Tengah Malam (Cross-Midnight Shift Overtime)**:
   - *Kasus*: Pekerja shift malam masuk pukul 22.00 dan lembur hingga 06.00 keesokan harinya yang bertepatan dengan hari libur nasional resmi.
   - *Respon Sistem*: Modul absensi mengikat sesi lembur ke shift tanggal inisiasi kerja dan menerapkan pemisahan tier multiplier sebelum pukul 24.00 (tarif hari kerja) dan sesudah pukul 00.00 (tarif hari libur nasional resmi). **Status: DEFENDED (PASS)**.
4. **Skenario Upah Maternitas 75% Bulan ke-5 & ke-6 (UU KIA)**:
   - *Kasus*: Pembayaran gaji 75% selama perpanjangan cuti melahirkan mempengaruhi dasar perhitungan BPJS dan TER.
   - *Respon Sistem*: Engine menghitung penghasilan bruto atas dasar 75% upah riil, tetap mematuhi batas bawah BPJS (UMK) jika upah 75% berada di bawah floor, dan menerapkan TER yang sesuai dengan bruto baru. **Status: DEFENDED (PASS)**.
5. **Skenario Larangan Percobaan (Probation) pada PKWT**:
   - *Kasus*: Pengguna menginput masa percobaan (*probation*) pada karyawan berstatus PKWT.
   - *Respon Sistem*: Form validasi master data karyawan memblokir opsi masa percobaan untuk PKWT sesuai amanat Pasal 58 UU Ketenagakerjaan (batal demi hukum jika dicantumkan). **Status: DEFENDED (PASS)**.

---

## 6. VERIFIKASI INTEGRITAS & ZERO DEFECT

- **Pemeriksaan Facade / Mockup Palsu**: Tidak ditemukan satupun tabel tarif yang dipotong atau disingkat dengan tanda titik-titik (`...`). Seluruh 125 baris tabel TER A, B, C dan tabel progresif Pasal 17 tercantum utuh.
- **Pemeriksaan Skema Database**: DDL PostgreSQL 16+ pada `prd/07_data_model_dan_erd.md` berisi 16 tabel lengkap dengan primary key UUID, foreign keys bertingkat, constraint check valid, indeks b-tree/gin, dan script pengaktifan RLS otomatis.
- **Pemeriksaan Bahasa**: 100% dokumen ditulis dalam Bahasa Indonesia formal, baku, dan sesuai dengan terminologi perpajakan dan ketenagakerjaan Republik Indonesia.

---

## 7. KESIMPULAN & REKOMENDASI HUKUM (LEGAL VERDICT)

Berdasarkan hasil pengujian, penelusuran hierarki hukum, dan verifikasi silang matematika komputasi, dokumen spesifikasi **CatatGaji** dinyatakan:

### **STATUS: 100% APPROVED (LAYAK EKSEKUSI PENUH)**

### Rekomendasi Tambahan untuk Tim Implementasi Perangkat Lunak:
1. **Automated Regression Test Suite**: Gunakan seluruh angka pada `lampiran/03_contoh_perhitungan_langkah_demi_langkah.md` sebagai *test fixtures / golden test vectors* pada unit testing continuous integration (CI) backend engine.
2. **DJP e-Bupot CSV Delimiter Switch**: Pastikan opsi pemilih delimiter koma (`,`) dan titik koma (`;`) tersedia di UI dashboard pelaporan pajak untuk mengakomodasi variasi pengaturan regional OS pengguna saat mengunggah berkas ke DJP Online.
3. **Audit Log Retention Policy**: Pertahankan retensi data audit trail minimal 10 tahun sesuai Pasal 28 UU Ketentuan Umum dan Tata Cara Perpajakan (UU KUP).

---
*Laporan evaluasi ini disusun secara independen dan menjadi sertifikasi kepatuhan hukum resmi untuk platform CatatGaji.*
