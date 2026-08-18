# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 03. USER STORIES & PRIORITISASI MOSCOW

---

### 1. Ringkasan & Metodologi Prioritisasi MoSCoW

Seluruh kebutuhan produk CatatGaji dipetakan ke dalam 24 *User Stories* terstruktur menggunakan metodologi **MoSCoW**:
- **Must Have (M)**: Kebutuhan kritis yang wajib hadir pada Minimum Viable Product (MVP). Tanpa fitur ini, aplikasi tidak dapat beroperasi secara legal dan fungsional di Indonesia.
- **Should Have (S)**: Fitur esensial yang meningkatkan efisiensi dan otomatisasi secara signifikan, ditargetkan rilis pada Fase v1.0 Launch.
- **Could Have (C)**: Fitur bernilai tambah tinggi untuk skala bisnis lanjutan dan integrasi ekosistem pihak ketiga pada Fase v2.0 Scale.
- **Won't Have (W)**: Fitur yang sengaja tidak dimasukkan ke dalam cakupan rilis saat ini (ditunda ke roadmap jangka panjang).

```
+----------------------------------------------------------------------------------------------------+
|                                  MATRIKS REKAPITULASI USER STORIES                                 |
+-------------------+---------------------------------------------------------+----------+-----------+
| Kategori MoSCoW   | Daftar User Stories                                     | Jumlah   | Estimasi  |
+-------------------+---------------------------------------------------------+----------+-----------+
| **MUST HAVE**     | US-01, US-02, US-04, US-06, US-07, US-09, US-10, US-11,  | 14 Story | 78 Poin   |
| (Fase MVP)        | US-13, US-16, US-17, US-19, US-20, US-22                |          |           |
+-------------------+---------------------------------------------------------+----------+-----------+
| **SHOULD HAVE**   | US-03, US-05, US-08, US-12, US-14, US-18, US-21, US-23  | 7 Story  | 42 Poin   |
| (Fase v1.0)       |                                                         |          |           |
+-------------------+---------------------------------------------------------+----------+-----------+
| **COULD HAVE**    | US-15, US-24                                            | 3 Story  | 21 Poin   |
| (Fase v2.0)       |                                                         |          |           |
+-------------------+---------------------------------------------------------+----------+-----------+
```

---

### 2. Katalog 24 User Stories Terinci

---

#### Kategori A: Manajemen Karyawan & Master HRIS

##### US-01: Master Data Karyawan & Konfigurasi Pajak/BPJS
- **ID**: `US-01`
- **Prioritas**: `MUST HAVE`
- **Persona**: Admin HR (Sari)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** menginput dan mengelola data master karyawan lengkap mencakup NIK 16 digit, NPWP 16/15 digit, status PTKP (TK/0 s.d. K/3), nomor BPJS Ketenagakerjaan (KPJ), nomor BPJS Kesehatan, dan data rekening bank payroll,
  - **Sehingga** sistem dapat mengklasifikasikan kategori TER PPh 21 dan menghitung iuran jaminan sosial secara otomatis dan valid.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Admin HR berada pada form pendaftaran karyawan baru,
  - **When** Admin memasukkan NIK dan memilih status PTKP (contoh: `K/1`),
  - **Then** sistem memvalidasi NIK wajib 16 digit angka numerik,
  - **And** sistem secara otomatis menetapkan `pph21_ter_category = 'B'` dan mencatat riwayat gaji bertanggal efektif (*effective date*).

---

##### US-02: Manajemen Kontrak Kerja PKWT & Pengingat Uang Kompensasi
- **ID**: `US-02`
- **Prioritas**: `MUST HAVE`
- **Persona**: Admin HR (Sari)
- **Estimasi Kompleksitas**: `3 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** mencatat tanggal mulai dan berakhirnya masa kerja karyawan kontrak (PKWT),
  - **Sehingga** saya menerima notifikasi peringatan 30 hari sebelum kontrak berakhir dan sistem otomatis menghitung estimasi uang kompensasi PKWT sesuai PP No. 35/2021.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Karyawan berstatus `PKWT` dengan masa kerja 12 bulan dan upah sebulan Rp 6.000.000,
  - **When** Masa kontrak tersisa $\le 30$ hari atau kontrak berakhir,
  - **Then** sistem menampilkan banner peringatan pada dashboard HR,
  - **And** sistem menghitung kompensasi: $\frac{12}{12} \times \text{Rp } 6.000.000 = \text{Rp } 6.000.000$.

---

##### US-03: Import Massal Data Karyawan via Excel/CSV Template
- **ID**: `US-03`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Admin HR (Sari)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** mengunggah berkas spreadsheet Excel/CSV berisi puluhan data karyawan sekaligus,
  - **Sehingga** proses migrasi data awal perusahaan ke CatatGaji dapat diselesaikan dalam hitungan menit tanpa input manual satu per satu.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Berkas template Excel CatatGaji berisi 50 baris data karyawan,
  - **When** Admin HR mengunggah berkas tersebut pada menu Import,
  - **Then** sistem melakukan validasi baris per baris terhadap duplikasi NIK/Email dan format data,
  - **And** menampilkan rekapitulasi baris berhasil dan daftar baris gagal beserta alasan error spesifik.

---

#### Kategori B: Absensi, Kehadiran & Pengajuan Cuti

##### US-04: Absensi Masuk & Pulang Berbasis GPS Geofencing dan Swafoto (Selfie)
- **ID**: `US-04`
- **Prioritas**: `MUST HAVE`
- **Persona**: Karyawan (Budi)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Karyawan,
  - **Saya ingin** melakukan clock-in dan clock-out langsung dari smartphone dengan verifikasi titik radius GPS kantor dan foto selfie kamera langsung,
  - **Sehingga** kehadiran saya tercatat secara sah, akurat, dan terhindar dari praktik titip absen.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Karyawan berada dalam radius $\le 50$ meter dari koordinat cabang kantor,
  - **When** Karyawan menekan tombol "Clock-In" dan mengambil foto selfie langsung via kamera peramban/aplikasi,
  - **Then** sistem mencatat stempel waktu server, koordinat presisi, dan menyimpan foto selfie terenkripsi,
  - **And** jika jarak $> 50$ meter, tombol clock-in terkunci dengan pesan "Anda berada di luar radius kantor".

---

##### US-05: Integrasi & Import Log Absensi Mesin Fingerprint Fisik
- **ID**: `US-05`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Admin HR (Sari)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** mengunggah berkas CSV/XLSX log transaksi dari mesin absensi sidik jari (Solution, Fingerspot, ZKTeco),
  - **Sehingga** data kehadiran cabang yang belum menggunakan smartphone dapat langsung tersinkronisasi.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Berkas log mesin fingerprint berformat CSV dengan kolom ID Karyawan, Tanggal, dan Jam,
  - **When** Admin HR melakukan import log,
  - **Then** sistem memetakan jam masuk dan pulang, mendeteksi keterlambatan (*late minutes*), dan mengeliminasi log ganda (*debounce*).

---

##### US-06: Pengajuan & Persetujuan Cuti / Izin Sakit Online
- **ID**: `US-06`
- **Prioritas**: `MUST HAVE`
- **Persona**: Karyawan (Budi) & Admin HR (Sari)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Karyawan,
  - **Saya ingin** mengajukan permohonan cuti tahunan atau izin sakit dengan melampirkan foto surat dokter dari aplikasi,
  - **Sehingga** atasan/HR dapat menyetujui secara online dan saldo cuti saya langsung terpotong otomatis tanpa mempengaruhi potongan absensi.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Karyawan memiliki saldo cuti 8 hari dan mengajukan cuti 2 hari,
  - **When** Atasan/HR menekan tombol "Approve Cuti",
  - **Then** saldo cuti karyawan otomatis berkurang menjadi 6 hari,
  - **And** tanggal yang disetujui otomatis bertanda "LEAVE" pada tabel rekapitulasi kehadiran bulanan.

---

#### Kategori C: Lembur & Kompensasi Kerja

##### US-07: Perhitungan Lembur Otomatis Bertingkat Sesuai PP No. 35/2021
- **ID**: `US-07`
- **Prioritas**: `MUST HAVE`
- **Persona**: Admin HR (Sari) & Karyawan (Budi)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** sistem mengkalkulasi upah lembur secara otomatis berdasarkan Surat Perintah Kerja Lembur (SPKL) yang disetujui,
  - **Sehingga** nilai uang lembur akurat 100% mengikuti rumus regulasi pemerintah tanpa ada selisih hitung.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Gaji pokok + tunjangan tetap karyawan sebesar Rp 5.190.000 (Upah sejam = $\frac{1}{173} \times 5.190.000 = \text{Rp } 30.000$),
  - **When** Karyawan lembur pada hari kerja biasa selama 3 jam,
  - **Then** sistem menghitung:
    - Jam ke-1: $1,5 \times \text{Rp } 30.000 = \text{Rp } 45.000$
    - Jam ke-2 & ke-3: $2 \times 2,0 \times \text{Rp } 30.000 = \text{Rp } 120.000$
    - Total Upah Lembur = $\text{Rp } 165.000$.

---

##### US-08: Kalkulasi Prorata Gaji Karyawan Masuk / Keluar Tengah Periode
- **ID**: `US-08`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Admin HR (Sari)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** sistem secara otomatis menghitung gaji prorata bagi karyawan yang mulai bekerja atau berhenti di pertengahan bulan,
  - **Sehingga** pembayaran kompensasi proporsional terhadap hari kerja aktif yang dijalani.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Karyawan baru mulai masuk tanggal 15 pada bulan yang memiliki 22 hari kerja standar dan gaji pokok Rp 4.400.000,
  - **When** Karyawan menjalani 11 hari kerja aktif,
  - **Then** sistem menghitung gaji pokok prorata: $\frac{11}{22} \times \text{Rp } 4.400.000 = \text{Rp } 2.200.000$.

---

#### Kategori D: Engine Pajak PPh 21 TER & Jaminan Sosial BPJS

##### US-09: Kalkulasi Otomatis PPh 21 Skema TER Bulanan (PP 58/2023 & PMK 168/2023)
- **ID**: `US-09`
- **Prioritas**: `MUST HAVE`
- **Persona**: Akuntan / Tax Officer (Dewi)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Akuntan / Payroll Officer,
  - **Saya ingin** sistem menghitung potongan PPh 21 bulanan (Januari–November) secara otomatis menggunakan skema TER Kategori A, B, atau C,
  - **Sehingga** potongan pajak karyawan tepat mengikuti tabel tarif resmi pemerintah tanpa perlu menghitung PTKP manual tiap bulan.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Karyawan berstatus `TK/0` (Kategori TER A) dengan total penghasilan bruto sebulan Rp 10.000.000,
  - **When** Proses kalkulasi payroll bulanan dijalankan,
  - **Then** sistem mencocokkan ke tabel TER A (rentang Rp 9.650.000 s.d. Rp 10.050.000 = tarif 2,00%),
  - **And** menetapkan potongan $\text{PPh 21} = 2,00\% \times \text{Rp } 10.000.000 = \text{Rp } 200.000$.

---

##### US-10: Rekalkulasi PPh 21 Pasal 17 Masa Pajak Terakhir (Desember / Resign)
- **ID**: `US-10`
- **Prioritas**: `MUST HAVE`
- **Persona**: Akuntan / Tax Officer (Dewi)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Akuntan,
  - **Saya ingin** sistem melakukan rekonsiliasi (*true-up*) PPh 21 di masa pajak Desember atau saat karyawan resign menggunakan tarif progresif Pasal 17 ayat (1) huruf a UU HPP,
  - **Sehingga** selisih kurang/lebih bayar pajak tahunan terkalkulasi secara tepat dan otomatis.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Total PPh 21 terutang setahun berdasarkan PKP dan tarif progresif Pasal 17 adalah Rp 2.400.000,
  - **When** Akumulasi PPh 21 TER yang telah dipotong masa Januari–November adalah Rp 2.200.000,
  - **Then** sistem menetapkan PPh 21 masa Desember sebesar $\text{Rp } 2.400.000 - \text{Rp } 2.200.000 = \text{Rp } 200.000$,
  - **And** jika akumulasi TER sebelumnya lebih besar, selisih lebih potong otomatis ditambahkan ke Take Home Pay Desember sebagai pengembalian pajak.

---

##### US-11: Kalkulasi 5 Program BPJS Ketenagakerjaan & BPJS Kesehatan
- **ID**: `US-11`
- **Prioritas**: `MUST HAVE`
- **Persona**: Admin HR (Sari) & Akuntan (Dewi)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** sistem memisahkan iuran BPJS porsi perusahaan dan potongan pekerja dengan batas plafon upah resmi (JP & BPJS Kes),
  - **Sehingga** rincian iuran jaminan sosial akurat dan siap dibayarkan ke BPJS.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Upah karyawan Rp 15.000.000 dan kelas risiko JKK tingkat 2 (0,54%),
  - **When** Kalkulasi jaminan sosial diproses,
  - **Then** Iuran JKK (0,54%) = Rp 81.000 (Perusahaan), JKM (0,30%) = Rp 45.000 (Perusahaan), JHT 3,7% = Rp 555.000 (Perusahaan) & 2,0% = Rp 300.000 (Karyawan),
  - **And** Iuran JP dihitung dari batas plafon Rp 10.042.300 (2% Perusahaan = Rp 200.846 & 1% Karyawan = Rp 100.423),
  - **And** Iuran BPJS Kes dihitung dari batas plafon Rp 12.000.000 (4% Perusahaan = Rp 480.000 & 1% Karyawan = Rp 120.000).

---

##### US-12: Dukungan Skema Pajak Gross, Gross-Up & Nett
- **ID**: `US-12`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Akuntan (Dewi) & Pemilik Usaha (Hendra)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Akuntan / Pemilik Usaha,
  - **Saya ingin** memilih metode penanggungan pajak (`GROSS`, `GROSS_UP`, atau `NETT`) per karyawan,
  - **Sehingga** perusahaan dapat memberikan tunjangan pajak yang presisi sesuai kebijakan kompensasi manajemen.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Karyawan dengan konfigurasi metode `GROSS_UP`,
  - **When** Sistem menghitung gaji,
  - **Then** sistem menghitung tunjangan pajak setara nominal PPh 21 terutang secara iteratif sehingga Take Home Pay bersih tidak berkurang oleh potongan pajak.

---

#### Kategori E: Slip Gaji Digital & Distribusi

##### US-13: Pembuatan Slip Gaji PDF Terenkripsi PIN Sesuai UU PDP
- **ID**: `US-13`
- **Prioritas**: `MUST HAVE`
- **Persona**: Karyawan (Budi)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Karyawan,
  - **Saya ingin** mengunduh slip gaji digital berformat PDF yang terkunci dengan password PIN/tanggal lahir,
  - **Sehingga** data finansial pribadi saya aman dan terlindungi dari akses pihak lain yang tidak berhak.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Dokumen PDF slip gaji telah dibuat oleh sistem,
  - **When** Berkas PDF dibuka menggunakan pembaca PDF standar,
  - **Then** aplikasi meminta kata sandi (default 6 digit tanggal lahir `DDMMYY`),
  - **And** slip memuat rincian pendapatan, potongan, iuran BPJS perusahaan, serta QR Code validasi keaslian dokumen.

---

##### US-14: Distribusi Slip Gaji Otomatis via Email Blast Massal
- **ID**: `US-14`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Admin HR (Sari)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** mendistribusikan slip gaji PDF terenkripsi ke email seluruh karyawan sekaligus dalam 1 kali klik setelah payroll disetujui,
  - **Sehingga** distribusi slip gaji tuntas dalam hitungan detik tanpa pengiriman manual.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Periode payroll berstatus `APPROVED`,
  - **When** Admin menekan tombol "Kirim Slip Massal" dan memilih channel Email,
  - **Then** background worker mengirimkan email ke seluruh karyawan aktif dan menampilkan status pengiriman (*Sent, Failed*).

---

##### US-15: Distribusi Slip Gaji via Notifikasi WhatsApp Business API
- **ID**: `US-15`
- **Prioritas**: `COULD HAVE`
- **Persona**: Karyawan (Budi) & Admin HR (Sari)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Karyawan,
  - **Saya ingin** menerima pesan ringkasan gaji dan tautan unduhan slip gaji terenkripsi langsung ke nomor WhatsApp saya,
  - **Sehingga** saya dapat mengakses informasi gaji dengan sangat mudah tanpa perlu membuka email.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Nomor WhatsApp karyawan valid dan terdaftar,
  - **When** Notifikasi WhatsApp terkirim,
  - **Then** karyawan menerima template pesan resmi memuat nominal Take Home Pay dan link aman satu kali pakai (*one-time secure link*).

---

#### Kategori F: Wizard Payroll & Otorisasi Approval

##### US-16: 4-Step Guided Payroll Processing Wizard
- **ID**: `US-16`
- **Prioritas**: `MUST HAVE`
- **Persona**: Admin HR (Sari)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Admin HR,
  - **Saya ingin** menjalankan kalkulasi penggajian melalui alur wizard 4 langkah terpandu,
  - **Sehingga** seluruh data absensi, komponen lembur, pajak, dan potongan terverifikasi berurutan tanpa ada yang terlewat.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Admin memulai proses payroll bulanan,
  - **When** Melalui:
    - Langkah 1: Kunci periode dan rekapitulasi absensi,
    - Langkah 2: Review penyesuaian lembur, bonus, dan kasbon,
    - Langkah 3: Kalkulasi otomatis PPh 21 TER dan BPJS,
    - Langkah 4: Tinjau ringkasan biaya total dan submit persetujuan,
  - **Then** sistem memvalidasi kelengkapan data di setiap langkah sebelum mengizinkan lanjut ke langkah berikutnya.

---

##### US-17: Otorisasi & Final Approval Payroll oleh Pemilik Usaha (PIN Security)
- **ID**: `US-17`
- **Prioritas**: `MUST HAVE`
- **Persona**: Pemilik Usaha (Hendra)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Pemilik Usaha,
  - **Saya ingin** menerima notifikasi pengajuan payroll, meninjau ringkasan total beban gaji di ponsel, dan menyetujui menggunakan PIN otentikasi 6 digit,
  - **Sehingga** kontrol pengeluaran kas perusahaan terjamin sebelum dana ditransfer ke rekening karyawan.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Periode payroll berstatus `REVIEW`,
  - **When** Pemilik Usaha memasukkan 6 digit PIN Otorisasi yang benar dan menekan "Setujui Payroll",
  - **Then** status periode berubah menjadi `APPROVED` / `LOCKED`,
  - **And** angka kalkulasi terkunci permanen (*immutable*) dan tidak dapat diubah lagi tanpa izin pembatalan khusus.

---

##### US-18: Deteksi Anomali Biaya Lembur & Variasi Gaji Bulanan
- **ID**: `US-18`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Pemilik Usaha (Hendra)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Pemilik Usaha,
  - **Saya ingin** sistem menampilkan penanda visual (*badge warning*) jika total biaya gaji atau lembur suatu departemen meningkat $> 15\%$ dibanding bulan sebelumnya,
  - **Sehingga** saya dapat mengidentifikasi potensi pembengkakan biaya sebelum memberikan persetujuan akhir.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Terjadi kenaikan total lembur Departemen Logistik sebesar 25% vs bulan lalu,
  - **When** Pemilik Usaha membuka layar ringkasan approval,
  - **Then** sistem menampilkan banner peringatan berwarna kuning beserta rincian 3 karyawan dengan jam lembur tertinggi.

---

#### Kategori G: Pelaporan Pajak & Jurnal Akuntansi

##### US-19: Ekspor Berkas CSV Standar e-Bupot 21/26 DJP Online
- **ID**: `US-19`
- **Prioritas**: `MUST HAVE`
- **Persona**: Akuntan / Tax Officer (Dewi)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Akuntan,
  - **Saya ingin** mengunduh berkas CSV rekapitulasi PPh 21 bulanan yang format kolom dan delimiternya 100% cocok dengan skema impor DJP Online e-Bupot 21/26,
  - **Sehingga** pelaporan SPT Masa PPh 21 selesai dalam hitungan detik tanpa error penolakan sistem pajak.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Periode payroll berstatus `APPROVED`,
  - **When** Akuntan mengklik tombol "Ekspor CSV e-Bupot",
  - **Then** sistem menghasilkan file CSV dengan struktur kolom: NPWP/NIK Pemotong, NIK/NPWP Penerima, Kode Objek Pajak (`21-100-01`), Bruto, Tarif TER, dan PPh Dipotong.

---

##### US-20: Ekspor Jurnal Akuntansi Double-Entry Seimbang (Balance)
- **ID**: `US-20`
- **Prioritas**: `MUST HAVE`
- **Persona**: Akuntan (Dewi)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Akuntan,
  - **Saya ingin** mengunduh file jurnal akuntansi penggajian berformat CSV siap impor (Jurnal Mekari, Xero, Accurate, QuickBooks),
  - **Sehingga** pembukuan beban gaji, utang pajak, dan utang iuran jaminan sosial langsung terposting seimbang (*balanced*).
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Payroll selesai diproses,
  - **When** Akuntan mengunduh jurnal akuntansi,
  - **Then** tabel jurnal menampilkan akun Debit (Beban Gaji, Beban BPJS Perusahaan) dan akun Kredit (Utang PPh 21, Utang BPJS, Kas/Bank),
  - **And** $\sum \text{Debit} = \sum \text{Kredit}$ dengan selisih Rp 0,-.

---

##### US-21: Pembuatan Massal Bukti Potong Formulir 1721-A1 Tahunan
- **ID**: `US-21`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Akuntan (Dewi) & Karyawan (Budi)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Akuntan,
  - **Saya ingin** menghasilkan formulir 1721-A1 PDF resmi untuk seluruh karyawan tetap di akhir tahun pajak dalam satu arsip ZIP terenkripsi,
  - **Sehingga** perusahaan dapat mendistribusikan bukti potong tahunan tepat waktu sebelum batas pelaporan SPT Pribadi 31 Maret.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Seluruh masa pajak 12 bulan (Jan–Des) telah selesai difinalisasi,
  - **When** Akuntan menekan tombol "Generate 1721-A1 Massal",
  - **Then** sistem mengompilasi penghasilan bruto setahun, biaya jabatan maksimal Rp 6 juta, iuran pensiun, PTKP, dan PPh 21 terutang ke dalam format PDF standar Ditjen Pajak.

---

#### Kategori H: Multi-Tenant, Keamanan & Fitur Lanjutan

##### US-22: Isolasi Data Multi-Tenant & Role-Based Access Control (RBAC)
- **ID**: `US-22`
- **Prioritas**: `MUST HAVE`
- **Persona**: Pemilik Usaha (Hendra) & Admin HR (Sari)
- **Estimasi Kompleksitas**: `8 Story Points`
- **Deskripsi**:
  - **Sebagai** Pemilik Usaha,
  - **Saya ingin** data perusahaan saya terisolasi secara mutlak dari perusahaan lain dan staf hanya dapat mengakses fitur sesuai peran hierarkisnya (`COMPANY_OWNER`, `HR_ADMIN`, `FINANCE_PAYROLL`, `EMPLOYEE`),
  - **Sehingga** kerahasiaan data kompensasi internal terjamin dan tidak terjadi kebocoran lintas tenant.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** User login dengan peran `EMPLOYEE`,
  - **When** Karyawan mencoba mengakses endpoint API data master gaji seluruh karyawan (`GET /api/v1/employees`),
  - **Then** sistem mengembalikan respons `403 Forbidden`,
  - **And** database PostgreSQL mengeksekusi Row-Level Security (RLS) memastikan kueri hanya mengambil data dengan `tenant_id` yang cocok.

---

##### US-23: Tagihan Langganan SaaS Otomatis dengan Payment Gateway Lokal
- **ID**: `US-23`
- **Prioritas**: `SHOULD HAVE`
- **Persona**: Pemilik Usaha (Hendra)
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Pemilik Usaha,
  - **Saya ingin** memilih paket langganan (Starter/Pro), melihat jumlah kuota karyawan aktif, dan membayar secara otomatis via QRIS atau Virtual Account bank,
  - **Sehingga** langganan aplikasi bisnis saya selalu aktif tanpa jeda operasional.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Akun tenant dalam masa trial atau mendekati jatuh tempo,
  - **When** Pemilik Usaha melakukan pembayaran melalui QRIS/VA dan gateway mengirim webhook sukses,
  - **Then** status langganan tenant langsung ter-upgrade instan dan faktur kuitansi resmi PDF otomatis diterbitkan.

---

##### US-24: Audit Trail Forensik Tak Dapat Diubah (Immutable Audit Log)
- **ID**: `US-24`
- **Prioritas**: `COULD HAVE`
- **Persona**: Pemilik Usaha (Hendra) / Auditor Internal
- **Estimasi Kompleksitas**: `5 Story Points`
- **Deskripsi**:
  - **Sebagai** Pemilik Usaha,
  - **Saya ingin** melihat riwayat log forensik atas setiap perubahan data gaji, manipulasi absensi, dan approval payroll,
  - **Sehingga** setiap perubahan finansial dapat diaudit secara transparan (*who, what, when, IP address, old value, new value*).
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - **Given** Terjadi pengubahan nominal gaji pokok karyawan oleh Admin HR,
  - **When** Audit log diperiksa,
  - **Then** sistem menampilkan rekaman waktu akurat, user ID pengubah, alamat IP, nilai gaji lama, dan nilai gaji baru tanpa opsi hapus (*append-only*).

---

### Won't Have (Di Luar Scope CatatGaji)

Berikut adalah fitur-fitur yang secara eksplisit **tidak termasuk** dalam scope pengembangan CatatGaji untuk mencegah scope creep:

| # | Fitur | Alasan Eksklusi | Alternatif |
|---|-------|-----------------|------------|
| W1 | Multi-currency | Target pasar 100% Indonesia, hanya mendukung mata uang Rupiah (IDR) | Tidak diperlukan kecuali ekspansi internasional |
| W2 | Kepatuhan pajak non-Indonesia | Seluruh engine perpajakan berbasis regulasi Indonesia (PPh 21, BPJS, UU Cipta Kerja) | Produk terpisah untuk pasar internasional |
| W3 | Recruitment pipeline / Job posting | Kompleksitas tinggi dan beda domain dari payroll | Integrasi API pihak ketiga (Glints, JobStreet) di v3.0+ |
| W4 | Learning Management System (LMS) | Scope terlalu luas, tidak berhubungan langsung dengan penggajian | Aplikasi tersendiri atau integrasi pihak ketiga |
| W5 | Full Accounting / ERP | CatatGaji hanya menghasilkan jurnal payroll, bukan General Ledger / AP / AR | Ekspor ke software akuntansi (Jurnal.id, Accurate, Xero) via Modul 7 |
| W6 | Asset management karyawan | Hubungan terlalu loose dengan payroll, beda domain | Aplikasi tersendiri |
| W7 | Earned Wage Access / Payroll financing | Membutuhkan lisensi fintech dari OJK | Partnership dengan penyedia EWA (GajiGesa, Wagely) |
| W8 | Chat / Messaging internal | Sudah ada kanal komunikasi yang established (WhatsApp) | Manfaatkan WhatsApp Blast di Modul Slip Gaji |
| W9 | Performance review / KPI | Sangat subjektif dan bervariasi per perusahaan | Pertimbangkan sebagai modul add-on opsional di v3.0+ |
| W10 | CRM / Manajemen pelanggan | Tidak relevan — CatatGaji mengelola karyawan, bukan customer | Beda domain sepenuhnya |
| W11 | Project management / Task tracking | Bukan tools kolaborasi tim | Beda domain sepenuhnya |

> **Catatan**: Beberapa fitur Won't Have (W3, W4, W9) berpotensi menjadi fitur masa depan (v3.0+) atau modul add-on berbayar setelah core platform stabil. Keputusan untuk mengembangkannya akan didasarkan pada feedback pengguna dan analisis pasar.

---

### 3. Matriks Traceability: User Stories vs Persona vs Modul

| User Story ID | Nama Fitur | Persona Utama | Modul Sistem | Prioritas MoSCoW | Estimasi Poin |
|---|---|---|---|---|---|
| `US-01` | Master Data & Parameter Pajak | Sari (HR) | Modul 1: HRIS | MUST HAVE | 5 SP |
| `US-02` | Pengingat Kontrak PKWT | Sari (HR) | Modul 1: HRIS | MUST HAVE | 3 SP |
| `US-03` | Import Data Karyawan Excel | Sari (HR) | Modul 1: HRIS | SHOULD HAVE | 5 SP |
| `US-04` | Absensi GPS Geofencing & Selfie | Budi (Karyawan) | Modul 2: Absensi | MUST HAVE | 8 SP |
| `US-05` | Import Log Fingerprint | Sari (HR) | Modul 2: Absensi | SHOULD HAVE | 5 SP |
| `US-06` | Pengajuan & Approval Cuti | Budi & Sari | Modul 2: Absensi | MUST HAVE | 5 SP |
| `US-07` | Kalkulasi Lembur PP 35/2021 | Sari & Budi | Modul 3: Engine | MUST HAVE | 8 SP |
| `US-08` | Prorata Gaji Masuk/Keluar | Sari (HR) | Modul 3: Engine | SHOULD HAVE | 5 SP |
| `US-09` | PPh 21 TER Bulanan | Dewi (Akuntan) | Modul 3: Engine | MUST HAVE | 8 SP |
| `US-10` | Rekonsiliasi PPh 21 Desember | Dewi (Akuntan) | Modul 3: Engine | MUST HAVE | 8 SP |
| `US-11` | Kalkulasi 5 Program BPJS | Sari & Dewi | Modul 3: Engine | MUST HAVE | 5 SP |
| `US-12` | Skema Gross, Gross-Up, Nett | Dewi & Hendra | Modul 3: Engine | SHOULD HAVE | 5 SP |
| `US-13` | Slip Gaji PDF Terenkripsi PIN | Budi (Karyawan) | Modul 4: Slip Gaji | MUST HAVE | 5 SP |
| `US-14` | Email Blast Slip Gaji Massal | Sari (HR) | Modul 4: Slip Gaji | SHOULD HAVE | 5 SP |
| `US-15` | Notifikasi WhatsApp Slip Gaji | Budi & Sari | Modul 4: Slip Gaji | COULD HAVE | 8 SP |
| `US-16` | 4-Step Payroll Wizard | Sari (HR) | Modul 5: Approval | MUST HAVE | 8 SP |
| `US-17` | Final Approval PIN Owner | Hendra (Owner) | Modul 5: Approval | MUST HAVE | 5 SP |
| `US-18` | Deteksi Anomali Biaya Lembur | Hendra (Owner) | Modul 5: Approval | SHOULD HAVE | 5 SP |
| `US-19` | Ekspor CSV DJP e-Bupot 21/26 | Dewi (Akuntan) | Modul 6: Pajak | MUST HAVE | 5 SP |
| `US-20` | Ekspor Jurnal Double-Entry | Dewi (Akuntan) | Modul 7: Jurnal | MUST HAVE | 5 SP |
| `US-21` | Form 1721-A1 Massal | Dewi (Akuntan) | Modul 6: Pajak | SHOULD HAVE | 8 SP |
| `US-22` | Multi-Tenant RLS & RBAC | Hendra & Sari | Modul 8: Admin | MUST HAVE | 8 SP |
| `US-23` | Tagihan Langganan QRIS/VA | Hendra (Owner) | Modul 8: Admin | SHOULD HAVE | 5 SP |
| `US-24` | Audit Trail Log Forensik | Hendra & Auditor | Modul 8: Admin | COULD HAVE | 5 SP |
