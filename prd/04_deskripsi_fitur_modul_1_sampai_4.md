# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 04. DESKRIPSI FITUR RINCI (MODUL 1 SAMPAI MODUL 4)

---

### MODUL 1: MANAJEMEN DATA KARYAWAN & HRIS DASAR

Modul Manajemen Data Karyawan berfungsi sebagai pusat kebenaran tunggal (*Single Source of Truth*) untuk seluruh data profil, status legal ketenagakerjaan, struktur kompensasi, dan parameter perpajakan setiap pekerja dalam organisasi tenant.

```
+----------------------------------------------------------------------------------------------------+
|                                STRUKTUR MASTER DATA KARYAWAN                                       |
+----------------------------------------------------------------------------------------------------+
| 1. IDENTITAS PERSONAL   -> NIK 16 digit, NPWP 16/15 digit, Alamat, Kontak, Emergency Contact       |
| 2. STATUS PAJAK & BPJS  -> PTKP (TK/0..K/3) -> Auto TER A/B/C, KPJ BPJS TK, No BPJS Kes, JKK Tier  |
| 3. DATA KEPEGAWAIAN     -> NIP, PKWT/PKWTT/Freelance, Tgl Masuk/Resign, Cabang, Dept, Jabatan, Atasan|
| 4. STRUKTUR GAJI & BANK -> Gaji Pokok, Tunjangan Tetap/Variabel, Nama Bank & No Rekening Terverifikasi|
+----------------------------------------------------------------------------------------------------+
```

#### 1.1 Struktur Atribut Data Karyawan
1. **Identitas Personal & Legalitas (Sesuai KTP)**:
   - `full_name`: Nama lengkap karyawan sesuai identitas resmi (KTP).
   - `nik_ktp`: Nomor Induk Kependudukan (Wajib 16 digit angka, tervalidasi algoritma wilayah & tanggal lahir, disimpan dengan enkripsi kolom AES-256).
   - `npwp`: Nomor Pokok Wajib Pajak (Format 16 digit NIK/NPWP 2024 atau 15 digit lama). Jika tidak memiliki NPWP, sistem menandai flag `has_npwp = false` untuk kalkulasi penyesuaian tarif PPh 21 non-NPWP sesuai aturan Ditjen Pajak.
   - `bpjs_tk_no`: Nomor Kartu Peserta Jamsostek (KPJ) 11 digit.
   - `bpjs_kes_no`: Nomor Kartu Indonesia Sehat / BPJS Kesehatan 13 digit.
   - `gender`: Jenis kelamin (`MALE` / `FEMALE`).
   - `birth_date` & `birth_place`: Tanggal dan tempat lahir (Tanggal lahir digunakan sebagai default PIN enkripsi PDF slip gaji).
   - `address_ktp` & `address_domicile`: Alamat identitas dan alamat domisili operasional.
   - `phone` & `email`: Nomor kontak WhatsApp dan alamat email resmi untuk pengiriman slip gaji.
   - `emergency_contact`: Nama kontak darurat, hubungan (*relation*), dan nomor telepon aktif.

2. **Status Pajak & Jaminan Sosial**:
   - `ptkp_status`: Pilihan status Penghasilan Tidak Kena Pajak resmi:
     - `TK/0`, `TK/1`, `TK/2`, `TK/3`
     - `K/0`, `K/1`, `K/2`, `K/3`
     - `K/I/0`, `K/I/1`, `K/I/2`, `K/I/3`
   - `pph21_ter_category`: Pemetaan otomatis Kategori TER (A, B, atau C) sesuai PMK No. 168/2023:
     - **Kategori TER A**: `TK/0` (PTKP 54 jt), `TK/1` (58,5 jt), `K/0` (58,5 jt).
     - **Kategori TER B**: `TK/2` (63 jt), `TK/3` (67,5 jt), `K/1` (63 jt), `K/2` (67,5 jt).
     - **Kategori TER C**: `K/3` (72 jt).
   - `pph21_scheme`: Skema penanggungan pajak: `GROSS` (potong gaji karyawan), `GROSS_UP` (tunjangan pajak otomatis dari perusahaan), atau `NETT` (pajak ditanggung perusahaan).
   - `jkk_risk_grade`: Tingkat risiko JKK unit kerja (Tingkat 1 s.d. 5: 0,24% s.d. 1,74%).

3. **Status Kepegawaian & Penempatan**:
   - `employment_status`: `PKWTT` (Karyawan Tetap), `PKWT` (Karyawan Kontrak Waktu Tertentu), `FREELANCE` (Pekerja Harian/Lepas), `INTERNSHIP` (Magang).
   - `join_date` & `resign_date`: Tanggal mulai kerja dan tanggal resmi berhenti/habis kontrak.
   - `branch_id`: Relasi ke kantor cabang/outlet penempatan (menentukan koordinat geofencing absensi).
   - `department_id`: Relasi ke unit departemen (menentukan alokasi pembebanan jurnal akuntansi).
   - `direct_supervisor_id`: User ID atasan langsung untuk alur persetujuan lembur dan cuti.

4. **Struktur Kompensasi & Rekening Bank Payroll**:
   - `basic_salary`: Gaji pokok bulanan (Wajib $\ge 0$).
   - `fixed_allowances`: Daftar komponen tunjangan tetap (Tunjangan Jabatan, Tunjangan Keahlian, Tunjangan Perumahan).
   - `non_fixed_allowances`: Komponen tunjangan tidak tetap berbasis kehadiran (Tunjangan Makan Harian, Tunjangan Transport Harian).
   - `bank_name`, `bank_account_no`, `bank_account_holder`: Rekening tujuan transfer gaji (Mendukung BCA, Mandiri, BRI, BNI, Permata, CIMB Niaga, BSI, dll).

#### 1.2 Riwayat Kompensasi Bertanggal Efektif (Salary Versioning)
CatatGaji menerapkan tabel `employee_salaries` bertanggal efektif (*effective date*). Setiap perubahan kenaikan gaji atau tunjangan tidak menimpa data lama (*no destructive overwrite*), sehingga kalkulasi mundur (*backdated payroll*) atau audit historis tetap konsisten 100%.

#### 1.3 Pengingat Kontrak PKWT & Kalkulator Kompensasi PP No. 35/2021
Sesuai Pasal 15 s.d. 17 PP No. 35 Tahun 2021, pengusaha wajib memberikan uang kompensasi pada saat berakhirnya jangka waktu PKWT bagi pekerja dengan masa kerja minimal 1 bulan terus-menerus:
- **Formula Kompensasi PKWT**:
  $$\text{Uang Kompensasi PKWT} = \frac{\text{Masa Kerja Aktual (Bulan)}}{12} \times 1\text{ Bulan Upah (Gaji Pokok + Tunjangan Tetap)}$$
- **Notifikasi Proaktif**: Sistem otomatis menampilkan peringatan 30, 14, dan 7 hari sebelum kontrak PKWT berakhir, disertai tombol "Hitung Kompensasi & Terbitkan Surat Selesai Kontrak".

---

### MODUL 2: KEHADIRAN, SHIFT & MANAJEMEN ABSENSI

Modul Kehadiran menyediakan mekanisme pencatatan absensi harian yang akurat, anti-manipulasi, dan fleksibel untuk operasional multi-cabang.

```
+----------------------------------------------------------------------------------------------------+
|                                    ALUR ABSENSI MOBILE PRESISI                                     |
+----------------------------------------------------------------------------------------------------+
| [ 1. CEK GPS GEOFENCE ]   -> Hitung jarak Haversine ke titik cabang (Validasi Radius <= 50 meter)  |
| [ 2. SELFIE CAMERA ]      -> Ambil swafoto via kamera langsung HTML5 (Anti-fake camera upload)     |
| [ 3. SERVER TIMESTAMP ]   -> Catat jam server UTC+7 (Mencegah manipulasi jam lokal perangkat HP)   |
| [ 4. AUTO EVALUASI JAM ]  -> Deteksi terlambat, pulang awal, durasi jam kerja, dan status lembur  |
+----------------------------------------------------------------------------------------------------+
```

#### 2.1 Mekanisme Absensi Mobile (GPS Geofencing & Liveness Selfie)
- **Geofencing Haversine**: Menggunakan rumus trigonometri bola bumi untuk menghitung jarak antara lokasi perangkat karyawan $(lat_u, lon_u)$ dengan pusat cabang kantor $(lat_c, lon_c)$:
  $$d = 2R \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta lat}{2}\right) + \cos(lat_u)\cos(lat_c)\sin^2\left(\frac{\Delta lon}{2}\right)} \right)$$
  Clock-in diizinkan hanya jika $d \le \text{Radius Cabang}$ (default: 50–100 meter).
- **Anti-Spoofing & Liveness Selfie**: Menggunakan akses stream kamera HTML5 langsung (`navigator.mediaDevices.getUserMedia`) yang memblokir opsi upload foto galeri. Foto dikompresi di sisi client dan disimpan dengan link aman bertanda tangan waktu (*signed URL*).
- **Pencegahan Manipulasi Waktu**: Waktu kehadiran dicatat menggunakan stempel waktu server backend (NTP synchronized), mengabaikan jam lokal ponsel pengguna yang mungkin dimanipulasi.

#### 2.2 Manajemen Shift & Jadwal Kerja Fleksibel
Sistem mendukung beragam pola jam kerja sesuai Pasal 77 UU No. 13/2003 jo. UU No. 6/2023 (UU Cipta Kerja):
1. **Fixed Standard 5 Hari Kerja**: 8 jam/hari, total 40 jam seminggu (Senin–Jumat: 08.30–17.30, istirahat 1 jam).
2. **Fixed Standard 6 Hari Kerja**: 7 jam/hari, total 40 jam seminggu (Senin–Sabtu: 08.00–15.00).
3. **Rotating Shift (Bergilir)**: Cocok untuk bisnis F&B, ritel, dan perhotelan (Shift Pagi: 07.00–15.00, Shift Siang: 15.00–23.00, Shift Malam: 23.00–07.00).
4. **Cross-Day Shift (Overnight)**: Penanganan jadwal kerja yang melintasi pergantian tanggal tengah malam (contoh: Masuk pukul 22.00, Pulang pukul 06.00 keesokan harinya). Sistem menautkan log pulang ke shift tanggal mulai kerja yang benar.
5. **Flexible Hours**: Target jam kerja harian minimum (misal: 8 jam aktif) tanpa penalti jam masuk kaku.

#### 2.3 Kebijakan Keterlambatan & Potongan Kehadiran
- Pengaturan toleransi keterlambatan (*grace period*, default: 10–15 menit).
- Konfigurasi skema potongan kehadiran yang fleksibel per tenant:
  - **Skema A (Potong Tunjangan Harian)**: Jika terlambat atau alfa, tunjangan makan/transport harian tidak dibayarkan.
  - **Skema B (Prorata Waktu Jam Kerja)**: Potongan dihitung per menit keterlambatan: $\text{Potongan} = \frac{\text{Menit Terlambat}}{60 \times \text{Jam Kerja Standar}} \times \text{Gaji Pokok Harian}$.
  - **Skema C (Flat Penalti Sanksi)**: Tarif denda tetap (misal: Terlambat > 15 menit potong Rp 20.000).

#### 2.4 Manajemen Cuti & Hak Pekerja (Kepatuhan UU Ketenagakerjaan & UU KIA 2024)
- **Cuti Tahunan**: 12 hari kerja per tahun setelah masa kerja 12 bulan terus menerus.
- **Cuti Melahirkan & Maternitas (UU Kesejahteraan Ibu dan Anak / UU KIA No. 4/2024)**: Hak cuti melahirkan minimal 3 bulan dan dapat diperpanjang hingga 6 bulan dengan rekomendasi medis dokter. Pembayaran upah: 100% untuk bulan ke-1 s.d. ke-4, dan 75% untuk bulan ke-5 s.d. ke-6.
- **Cuti Haid**: 2 hari pertama masa haid bagi pekerja perempuan yang merasakan sakit.
- **Cuti Khusus Berbayar Resmi**:
  - Pernikahan pekerja: 3 hari
  - Pernikahan anak pekerja: 2 hari
  - Khitanan / Baptis anak pekerja: 2 hari
  - Istri melahirkan / keguguran: 2 hari
  - Anggota keluarga inti (orang tua/mertua/suami/istri/anak) meninggal dunia: 2 hari
  - Anggota keluarga dalam satu rumah meninggal dunia: 1 hari

#### 2.5 Impor Log Mesin Absensi Fisik (Fingerprint / Biometrik CSV)
Modul impor memfasilitasi pengunggahan berkas CSV/XLSX dari mesin fingerprint populer (Solution, Fingerspot, ZKTeco). Sistem menyediakan alat pemetaan kolom pintar (*smart column mapper*) dan secara otomatis membersihkan log duplikat dalam rentang toleransi 5 menit.

---

### MODUL 3: ENGINE PERHITUNGAN GAJI OTOMATIS & REGULASI

Modul Engine Penggajian adalah inti komputasi CatatGaji yang mengeksekusi seluruh formula bisnis dan regulasi perpajakan secara deterministik.

```
+----------------------------------------------------------------------------------------------------+
|                               STRUKTUR PERHITUNGAN GAJI BULANAN                                    |
+----------------------------------------------------------------------------------------------------+
| (+) Gaji Pokok                                                                                     |
| (+) Tunjangan Tetap (Jabatan, Keahlian, Perumahan)                                                |
| (+) Tunjangan Tidak Tetap (Makan & Transport Harian x Hari Masuk)                                  |
| (+) Upah Lembur (Hasil Kalkulasi Jam Efektif x 1/173 x Upah Sebulan Sesuai PP 35/2021)             |
| (+) Bonus / Insentif / Tunjangan Hari Raya (THR)                                                   |
| (+) Premi JKK Perusahaan (0.24% - 1.74%)  -> Penambah Bruto Pajak                                  |
| (+) Premi JKM Perusahaan (0.30%)          -> Penambah Bruto Pajak                                  |
| (+) Premi BPJS Kesehatan Perusahaan (4%)  -> Penambah Bruto Pajak (Capped Rp 12 Juta)              |
| -------------------------------------------------------------------------------------------------- |
| (=) TOTAL PENGHASILAN BRUTO PAJAK                                                                  |
| -------------------------------------------------------------------------------------------------- |
| (-) PPh 21 TER Bulanan (Bruto x % Tarif TER Kategori A/B/C PP 58/2023)                             |
| (-) Iuran JHT Karyawan (2.0% x Upah Pokok + Tunjangan Tetap)                                       |
| (-) Iuran JP Karyawan (1.0% x Upah Pokok + Tunjangan Tetap - Capped Rp 10.042.300)                |
| (-) Iuran BPJS Kesehatan Karyawan (1.0% x Upah Pokok + Tunjangan Tetap - Capped Rp 12.000.000)    |
| (-) Potongan Angsuran Kasbon / Pinjaman Karyawan                                                   |
| (-) Potongan Keterlambatan / Unpaid Leave                                                          |
| -------------------------------------------------------------------------------------------------- |
| (=) TAKE HOME PAY (THP) BERSIH KARYAWAN                                                            |
+----------------------------------------------------------------------------------------------------+
```

#### 3.1 Formulasi Lembur Resmi (PP No. 35 Tahun 2021)
1. **Dasar Perhitungan Upah Sejam**:
   $$\text{Upah Sejam} = \frac{1}{173} \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$$
   *Catatan Regulasi: Apabila komponen upah pokok + tunjangan tetap lebih rendah dari Upah Minimum Kabupaten/Kota (UMK) yang berlaku, maka dasar upah sejam wajib menggunakan angka UMK.*

2. **Pengali Lembur Hari Kerja Biasa**:
   - Jam ke-1: $1,5 \times \text{Upah Sejam}$
   - Jam ke-2 dan jam-jam berikutnya: $2,0 \times \text{Upah Sejam}$

3. **Pengali Lembur Hari Libur Mingguan / Libur Resmi Nasional**:
   - **Skema 6 Hari Kerja (40 Jam/Minggu)**:
     - Jam ke-1 s.d. ke-7: $2,0 \times \text{Upah Sejam}$
     - Jam ke-8: $3,0 \times \text{Upah Sejam}$
     - Jam ke-9 s.d. ke-10: $4,0 \times \text{Upah Sejam}$
   - **Skema 5 Hari Kerja (40 Jam/Minggu)**:
     - Jam ke-1 s.d. ke-8: $2,0 \times \text{Upah Sejam}$
     - Jam ke-9: $3,0 \times \text{Upah Sejam}$
     - Jam ke-10 s.d. ke-11: $4,0 \times \text{Upah Sejam}$

#### 3.2 Formulasi PPh 21 TER (PP 58/2023 & PMK 168/2023)
- **Masa Pajak Januari s.d. November (Bulanan)**:
  $$\text{PPh 21 Bulanan} = \text{Penghasilan Bruto Sebulan} \times \text{Tarif TER}(\text{Kategori}, \text{Bruto})$$
  Tabel tarif mencakup Kategori A (44 layer, 0%–34%), Kategori B (40 layer, 0%–34%), dan Kategori C (41 layer, 0%–34%).

- **Masa Pajak Terakhir (Desember / Karyawan Resign) — Rekonsiliasi Pasal 17**:
  1. $\text{Bruto Setahun} = \sum_{m=1}^{12} \text{Bruto Bulanan}$
  2. $\text{Biaya Jabatan} = \min(5\% \times \text{Bruto Setahun}, \text{Rp } 6.000.000)$
  3. $\text{Iuran Pensiun} = \sum (\text{JHT 2\% Karyawan} + \text{JP 1\% Karyawan})$
  4. $\text{Penghasilan Neto Setahun} = \text{Bruto Setahun} - \text{Biaya Jabatan} - \text{Iuran Pensiun}$
  5. $\text{Penghasilan Kena Pajak (PKP)} = \lfloor (\text{Penghasilan Neto Setahun} - \text{PTKP Tahunan}) \rfloor_{1.000}$
  6. $\text{PPh 21 Terutang Setahun} = \text{Tarif Progresif Pasal 17 UU HPP}(\text{PKP})$
     - Lapisan 1: Rp 0 s.d. Rp 60.000.000 $\rightarrow 5\%$
     - Lapisan 2: > Rp 60.000.000 s.d. Rp 250.000.000 $\rightarrow 15\%$
     - Lapisan 3: > Rp 250.000.000 s.d. Rp 500.000.000 $\rightarrow 25\%$
     - Lapisan 4: > Rp 500.000.000 s.d. Rp 5.000.000.000 $\rightarrow 30\%$
     - Lapisan 5: > Rp 5.000.000.000 $\rightarrow 35\%$
  7. $\text{PPh 21 Masa Desember} = \text{PPh 21 Terutang Setahun} - \sum_{m=1}^{11} \text{PPh 21 TER yang Telah Dipotong}$

#### 3.3 Formulasi 5 Program Jaminan Sosial BPJS
1. **Jaminan Hari Tua (JHT)**:
   - Beban Perusahaan = $3,70\% \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$
   - Beban Pekerja = $2,00\% \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$
2. **Jaminan Kecelakaan Kerja (JKK)**:
   - Beban Perusahaan = $\text{Tarif Kelas Risiko (0,24\% s.d. 1,74\%)} \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$
   - Beban Pekerja = $0,00\%$
3. **Jaminan Kematian (JKM)**:
   - Beban Perusahaan = $0,30\% \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$
   - Beban Pekerja = $0,00\%$
4. **Jaminan Pensiun (JP)**:
   - Upah Dasar = $\min(\text{Gaji Pokok} + \text{Tunjangan Tetap}, \text{Rp } 10.042.300)$ *(Plafon 2024)*
   - Beban Perusahaan = $2,00\% \times \text{Upah Dasar JP}$
   - Beban Pekerja = $1,00\% \times \text{Upah Dasar JP}$
5. **BPJS Kesehatan**:
   - Upah Dasar = $\min(\text{Gaji Pokok} + \text{Tunjangan Tetap}, \text{Rp } 12.000.000)$ *(Plafon Maksimal)*
   - Beban Perusahaan = $4,00\% \times \text{Upah Dasar Kes}$
   - Beban Pekerja = $1,00\% \times \text{Upah Dasar Kes}$ (Mencakup 5 anggota keluarga).

#### 3.4 Tunjangan Hari Raya (THR) Keagamaan (Permenaker No. 6/2016)
- Masa Kerja $\ge 12$ bulan terus-menerus: $1 \times \text{Upah Sebulan (Pokok + Tunjangan Tetap)}$.
- Masa Kerja 1 bulan s.d. $< 12$ bulan: $\frac{\text{Masa Kerja (Bulan)}}{12} \times 1\text{ Bulan Upah}$.
- **Pajak atas THR**: THR digabungkan ke dalam Penghasilan Bruto bulan bersangkutan dan dikenakan pemotongan PPh 21 TER bulanan secara proporsional.

---

### MODUL 4: SLIP GAJI DIGITAL & DISTRIBUSI MULTI-CHANNEL

Modul Slip Gaji menghasilkan dokumen bukti pembayaran kompensasi resmi yang terproteksi, aman, transparan, dan dapat didistribusikan secara otomatis melalui berbagai saluran komunikasi.

```
+----------------------------------------------------------------------------------------------------+
|                                STRUKTUR SLIP GAJI DIGITAL RESMI                                    |
+----------------------------------------------------------------------------------------------------+
| [ HEADER PERUSAHAAN ]  -> Nama Tenant, Logo, Periode Penggajian, Tanggal Pembayaran               |
| [ INFO KARYAWAN ]      -> Nama, NIP, Jabatan, Cabang, Status PTKP, No Rekening (Masked)            |
|                                                                                                    |
| +------------------------------------+------------------------------------+                        |
| | PENDAPATAN (EARNINGS)              | POTONGAN (DEDUCTIONS)              |                        |
| | - Gaji Pokok                       | - PPh 21 (TER Kategori A 2.0%)     |                        |
| | - Tunjangan Jabatan                | - BPJS Ketenagakerjaan (JHT 2%)    |                        |
| | - Upah Lembur (PP 35/2021)         | - BPJS Ketenagakerjaan (JP 1%)     |                        |
| | - Tunjangan Makan & Transport      | - BPJS Kesehatan (1%)              |                        |
| |                                    | - Angsuran Kasbon                  |                        |
| +------------------------------------+------------------------------------+                        |
|                                                                                                    |
| [ TAKE HOME PAY BERSIH ] -> Rp XX.XXX.XXX,- (Terbilang: Dua Belas Juta Rupiah)                     |
| [ INFORMASI PERUSAHAAN ] -> Kontribusi BPJS Perusahaan (JHT 3.7%, JKK 0.54%, JKM 0.3%, JP 2%, Kes 4%)|
| [ QR CODE KEASLIAN ]   -> Nomor Seri Unik Terverifikasi Sistem CatatGaji                           |
| [ WATERMARK PRIVASI ]  -> "RAHASIA & PRIBADI - DILINDUNGI UU NO. 27/2022 PDP"                      |
+----------------------------------------------------------------------------------------------------+
```

#### 4.1 Enkripsi PDF Berbasis Password PIN Sesuai UU PDP No. 27/2022
Setiap berkas PDF yang dihasilkan sistem dikompilasi secara dinamis dan dienkripsi menggunakan standar **AES-128 / AES-256 PDF Encryption**:
- **Kata Sandi Default**: 6 digit tanggal lahir karyawan dalam format `DDMMYY` (misal: Karyawan lahir 15 Agustus 1996 $\rightarrow$ PIN: `150896`).
- **PIN Kustom**: Karyawan dapat mengubah PIN pembuka slip gaji melalui aplikasi portal mandiri (*Employee Self-Service*).
- **Watermark Dokumen**: Mencantumkan teks penanda legalitas kepatuhan data pribadi.

#### 4.2 QR Code Verifikasi Keaslian Dokumen
Setiap slip memuat QR Code dinamis yang menautkan ke endpoint verifikasi keaslian publik (`https://catatgaji.id/verify-slip/{secure_serial_hash}`). Pihak ketiga (seperti analis kredit perbankan atau leasing) dapat memindai QR Code untuk mengonfirmasi keaslian dokumen tanpa menampilkan nominal rincian gaji secara terbuka.

#### 4.3 Saluran Distribusi Otomatis (Multi-Channel Blast)
Setelah periode payroll berstatus `APPROVED & FINALIZED`, sistem menyediakan mekanisme distribusi massal sekali klik:
1. **Email Otomatis**: Pengiriman lampiran berkas PDF terenkripsi dengan template email profesional yang memuat ringkasan THP dan tautan unduhan.
2. **WhatsApp Business API**: Pengiriman pesan teks ringkas berisi rincian THP dan tautan unduh aman satu kali pakai (*one-time secure link*).
3. **Portal Mandiri Karyawan (ESS)**: Karyawan dapat melihat riwayat slip gaji hingga 5 tahun terakhir kapan saja dari aplikasi web responsif atau smartphone.
