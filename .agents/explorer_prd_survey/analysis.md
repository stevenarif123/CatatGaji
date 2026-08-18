# BLUEPRINT PRD & SPESIFIKASI FUNGSIONAL LENGKAP: CATATGAJI
**Aplikasi Multi-Tenant SaaS Payroll & HRIS Kepatuhan Regulasi Indonesia untuk UMKM**

---

## DAFTAR ISI
1. [Ringkasan Eksekutif, Visi Produk & Model Bisnis SaaS](#1-ringkasan-eksekutif-visi-produk--model-bisnis-saas)
2. [User Personas](#2-user-personas)
3. [User Stories & Prioritisasi MoSCoW](#3-user-stories--prioritisasi-moscow)
4. [Spesifikasi Fungsional Mendalam (8 Modul Inti)](#4-spesifikasi-fungsional-mendalam-8-modul-inti)
   - [Modul 1: Manajemen Data Karyawan & HRIS Dasar](#modul-1-manajemen-data-karyawan--hris-dasar)
   - [Modul 2: Kehadiran, Shift & Manajemen Absensi](#modul-2-kehadiran-shift--manajemen-absensi)
   - [Modul 3: Engine Perhitungan Gaji Otomatis & Regulasi](#modul-3-engine-perhitungan-gaji-otomatis--regulasi)
   - [Modul 4: Slip Gaji Digital & Distribusi Multi-Channel](#modul-4-slip-gaji-digital--distribusi-multi-channel)
   - [Modul 5: Approval Workflow, Kebijakan & Delegasi](#modul-5-approval-workflow-kebijakan--delegasi)
   - [Modul 6: Pelaporan Pajak & Kepatuhan Regulasi (DJP & BPJS)](#modul-6-pelaporan-pajak--kepatuhan-regulasi-djp--bpjs)
   - [Modul 7: Dashboard Analytics & Laporan Jurnal Akuntansi](#modul-7-dashboard-analytics--laporan-jurnal-akuntansi)
   - [Modul 8: Multi-Tenant Administration, RBAC & Billing](#modul-8-multi-tenant-administration-rbac--billing)
5. [Spesifikasi Wireframe & Desain UI/UX (10 Layar Utama)](#5-spesifikasi-wireframe--desain-uiux-10-layar-utama)
   - [Layar 1: Dashboard Utama (Executive & HR View)](#layar-1-dashboard-utama-executive--hr-view)
   - [Layar 2: Master Data Karyawan (List, Filter, Multi-Tab Form)](#layar-2-master-data-karyawan-list-filter-multi-tab-form)
   - [Layar 3: Manajemen Absensi & Rekap Kehadiran](#layar-3-manajemen-absensi--rekap-kehadiran)
   - [Layar 4: Pengajuan & Approval Lembur / Cuti](#layar-4-pengajuan--approval-lembur--cuti)
   - [Layar 5: Wizard Proses Gaji Bulanan (4-Step Guided Wizard)](#layar-5-wizard-proses-gaji-bulanan-4-step-guided-wizard)
   - [Layar 6: Detail Payroll Run & Review Gaji per Karyawan](#layar-6-detail-payroll-run--review-gaji-per-karyawan)
   - [Layar 7: Template & Preview Slip Gaji Digital (Web & PDF)](#layar-7-template--preview-slip-gaji-digital-web--pdf)
   - [Layar 8: Modul Pajak & Ekspor DJP / BPJS](#layar-8-modul-pajak--ekspor-djp--bpjs)
   - [Layar 9: Pengaturan Perusahaan & Kebijakan Gaji (Tenant Settings)](#layar-9-pengaturan-perusahaan--kebijakan-gaji-tenant-settings)
   - [Layar 10: Portal Karyawan ESS (Mobile-First Web / PWA)](#layar-10-portal-karyawan-ess-mobile-first-web--pwa)
6. [Kebutuhan Non-Fungsional, Kepatuhan UU PDP & Arsitektur Multi-Tenant](#6-kebutuhan-non-fungsional-kepatuhan-uu-pdp--arsitektur-multi-tenant)

---

## 1. RINGKASAN EKSEKUTIF, VISI PRODUK & MODEL BISNIS SAAS

### 1.1 Latar Belakang & Masalah Pasar UMKM Indonesia
Sektor Usaha Mikro, Kecil, dan Menengah (UMKM) serta bisnis skala menengah (SME) di Indonesia menyerap lebih dari 97% tenaga kerja nasional. Namun, operasional penggajian (payroll) pada 85%+ bisnis di segmen ini masih dikelola secara manual dengan spreadsheet (Microsoft Excel/Google Sheets). Kondisi ini menimbulkan sejumlah tantangan kritis:
1. **Kerumitan Regulasi PPh 21 TER 2024**: Berlakunya skema Tarif Efektif Rata-rata (TER) per Januari 2024 (PP 58/2023 & PMK 168/2023) membuat staf administrasi bingung mengkategorikan karyawan ke Kategori A, B, atau C, serta melakukan perhitungan penyesuaian (true-up) Pasal 17 pada masa pajak Desember / masa pajak terakhir.
2. **Kepatuhan BPJS Ketenagakerjaan & BPJS Kesehatan yang Rumit**: Perhitungan 4 program BPJS TK (JHT, JKK dengan 5 tingkat risiko, JKM, JP dengan batas upah maksimal tahunan) serta BPJS Kesehatan (5% dengan batas plafon Rp 12.000.000) sering salah hitung, berisiko denda sanksi administratif dan ketidaksesuaian laporan F2A.
3. **Inefisiensi Lembur (PP 35/2021) & Absensi**: Menghitung lembur harian/hari libur secara manual (faktor kali 1.5x, 2x, 3x, 4x dengan pengali 1/173) menghabiskan waktu berhari-hari setiap akhir bulan bagi HR/Finance.
4. **Distribusi Slip Gaji yang Rawan Kebocoran Data (Pelanggaran UU PDP)**: Pengiriman slip kertas atau lampiran PDF tanpa proteksi kata sandi melanggar Undang-Undang Perlindungan Data Pribadi (UU No. 27/2022).
5. **Software Korporasi yang Terlalu Mahal & Rumit**: Software HR enterprise (seperti SAP, Workday, atau software payroll lokal enterprise) menetapkan biaya implementasi puluhan juta rupiah dan antarmuka yang membingungkan bagi pelaku UMKM.

### 1.2 Visi & Positioning Produk
> **Visi Produk**: Menjadi platform penggajian dan HRIS otomatis paling tepercaya, patuh hukum 100%, dan termudah digunakan untuk 1 juta UMKM dan bisnis berkembang di Indonesia.
>
> **Core Value Proposition**: *"Hitung Gaji, Pajak PPh 21 TER, dan BPJS Karyawan UMKM Tuntas dalam 3 Klik — 100% Sesuai Regulasi Indonesia, Aman, dan Terjangkau."*

### 1.3 Model Multi-Tenant SaaS
CatatGaji dibangun dengan arsitektur **Multi-Tenant Logical Isolation** berbasis Cloud:
- **Pemisahan Data**: Setiap penyewa (*tenant*) diisolasi menggunakan `tenant_id` pada seluruh entitas database dengan Row-Level Security (RLS) dan enkripsi data saat diam (*at-rest*) & saat transit (*in-transit*).
- **Akses Domain**: Tenant dapat mengakses via subdomain custom (`perusahaan.catatgaji.id`) atau portal terpadu (`app.catatgaji.id`) dengan session tenant switcher.

### 1.4 Paket Harga (Pricing Tiers)
| Fitur / Dimensi | Paket Gratis (Free Tier) | Paket Pemula (Starter) | Paket Profesional (Pro) |
|---|---|---|---|
| **Target Pengguna** | Mikro / Usaha Rintisan (1–5 Karyawan) | Usaha Kecil (6–25 Karyawan) | Usaha Menengah (26–200+ Karyawan) |
| **Harga Langganan** | Rp 0 (Gratis Selamanya) | Rp 99.000 / bulan (atau Rp 10.000/karyawan/bln) | Rp 299.000 / bulan (atau Rp 15.000/karyawan/bln) |
| **Kapasitas Karyawan** | Maksimal 5 Karyawan | Maksimal 25 Karyawan | Unlimited Karyawan (Tiered billing) |
| **Engine Payroll & PPh 21 TER** | Ya (Dasar Bulanan) | Ya (Lengkap Bulanan + Desember) | Ya (Lengkap + Multi-komponen kustom) |
| **BPJS TK & Kesehatan** | Ya (Otomatis) | Ya (Otomatis + Laporan F2A) | Ya (Otomatis + Laporan Rekapitulasi) |
| **Lembur PP 35/2021 & THR** | Dasar | Otomatis Penuh | Otomatis Penuh + Multi-shift Custom |
| **Slip Gaji Digital** | Download PDF Standar | PDF Terenkripsi PIN + Email Auto-blast | PDF PIN + WhatsApp Blast + ESS Portal |
| **Absensi Mobile (GPS/Selfie)** | Tidak (Manual Input) | Ya (GPS Geofencing + Selfie) | Ya (GPS + Selfie + Fingerprint API/CSV) |
| **Approval Workflow** | 1 Tingkat (Owner/HR) | 2 Tingkat (Spv -> HR) | Multi-tingkat Dinamis + Delegasi Cuti |
| **Laporan Pajak DJP e-Bupot** | Ringkasan Layar | Ekspor CSV e-SPT / e-Bupot 21/26 | Ekspor e-Bupot + Form 1721-A1 Massal |
| **Jurnal Akuntansi** | Tidak | CSV Jurnal Standar | Integrasi Mekari Jurnal, Xero, QuickBooks |
| **Multi-Cabang & Departemen** | 1 Cabang / 1 Dept | Hingga 3 Cabang | Cabang & Departemen Tak Terbatas |
| **Audit Trail & Role RBAC** | Dasar | Menengah | Lengkap (Granular RBAC + Log Forensik) |

---

## 2. USER PERSONAS

```
+---------------------------------------------------------------------------------------------------+
|                                      EKOSISTEM PERSONA CATATGAJI                                   |
+---------------------------------------------------------------------------------------------------+
|  [ 1. Admin HR / Payroll ]  <--->  [ 2. Karyawan / Employee ]  <--->  [ 3. Pemilik Usaha / Owner ]|
|  - Input Data & Absensi            - Clock-in GPS & Selfie            - Review Rekap Biaya        |
|  - Eksekusi Payroll Wizard         - Cek Slip Gaji PDF (PIN)          - Approval Payroll Final    |
|  - Distribusi Slip Gaji            - Ajukan Cuti & Lembur             - Pantau Cash Flow Gaji     |
|                                                                                                   |
|                                [ 4. Akuntan / Finance Staff ]                                     |
|                                - Rekonsiliasi Pajak PPh 21 & BPJS                                 |
|                                - Ekspor CSV DJP e-Bupot & 1721-A1                                 |
|                                - Ekspor Jurnal Beban Gaji ke Software Akuntansi                   |
+---------------------------------------------------------------------------------------------------+
```

### Persona 1: Admin HR / Payroll Officer
- **Nama Profil**: Siti Rahmawati (27 tahun)
- **Peran / Jabatan**: HR & General Affairs Specialist di CV Kuliner Nusantara (Restoran & Kafe, 35 karyawan di 2 cabang).
- **Latar Belakang**: Lulusan Manajemen, mengelola administrasi karyawan, absensi harian, kontrak kerja, hingga penggajian bulanan seorang diri.
- **Tujuan Utama (Goals)**:
  - Menyelesaikan proses penggajian bulanan tepat waktu (< 2 jam kerja) tanpa kesalahan formula spreadsheet.
  - Memastikan potongan PPh 21 TER dan BPJS akurat tanpa perlu menghitung manual setiap bulan.
  - Mengirimkan slip gaji ke seluruh karyawan secara otomatis tanpa harus mencetak kertas atau mengirim satu per satu via chat pribadi.
- **Kendala & Frustrasi (Pain Points)**:
  - Sering terjadi selisih jam lembur karena rekap absensi mesin fingerprint rusak atau tercecer.
  - Takut salah menghitung penyesuaian PPh 21 di bulan Desember dan khawatir dituntut karyawan jika ada potongan yang tidak transparan.
  - Karyawan sering menanyakan sisa cuti dan meminta slip gaji bulan lalu berulang kali.
- **Karakteristik Penggunaan**: Menggunakan laptop/desktop di kantor, menyukai antarmuka tabel bersih dengan validasi kesalahan instan.

---

### Persona 2: Karyawan / Employee (Self-Service)
- **Nama Profil**: Budi Prasetyo (24 tahun)
- **Peran / Jabatan**: Barista Senior & Staf Operasional di Outlet Sudirman.
- **Latar Belakang**: Bekerja dengan sistem shift (pagi/siang/malam), memiliki smartphone Android, terbiasa dengan aplikasi mobile modern.
- **Tujuan Utama (Goals)**:
  - Melakukan absensi masuk/pulang kerja dengan cepat melalui smartphone di lokasi outlet.
  - Mengakses rincian slip gaji bulanan kapan saja, termasuk melihat transparansi hitungan uang lembur dan potongan BPJS/kasbon.
  - Mengajukan permohonan cuti tahunan atau klaim lembur langsung dari aplikasi tanpa perlu mengisi formulir kertas manual.
- **Kendala & Frustrasi (Pain Points)**:
  - Sering terlambat menerima slip gaji fisik atau slip hilang saat dibutuhkan untuk pengajuan kredit perbankan.
  - Tidak mengetahui apakah jam lemburnya sudah disetujui atasan atau belum sebelum gajian tiba.
  - Sulit mengetahui sisa kuota cuti tahunan yang masih berlaku.
- **Karakteristik Penggunaan**: Menggunakan smartphone (Mobile-First / PWA), membutuhkan antarmuka yang simpel, cepat, dan hemat kuota data.

---

### Persona 3: Pemilik Usaha / Business Owner
- **Nama Profil**: Hendro Wijaya (43 tahun)
- **Peran / Jabatan**: Founder & Direktur Utama PT Maju Bersama Logistik (Armada & Gudang, 50 karyawan).
- **Latar Belakang**: Pengusaha yang berfokus pada ekspansi bisnis dan arus kas (*cash flow*). Tidak memiliki latar belakang akuntansi mendalam.
- **Tujuan Utama (Goals)**:
  - Menyetujui (*approve*) penggajian bulanan dengan cepat melalui smartphone setelah melihat ringkasan total pengeluaran gaji, pajak, dan BPJS.
  - Memastikan kepatuhan ketenagakerjaan dan pajak perusahaan terjamin sehingga aman dari sanksi Disnaker dan Ditjen Pajak.
  - Memantau tren biaya lembur dan pergantian karyawan (*turnover*) antar cabang secara real-time.
- **Kendala & Frustrasi (Pain Points)**:
  - Khawatir ada manipulasi absensi (*titip absen*) atau pembengkakan lembur tanpa otorisasi manajer.
  - Kesulitan memproyeksikan kebutuhan kas untuk Tunjangan Hari Raya (THR) dan kompensasi akhir kontrak PKWT.
  - Tidak memiliki waktu membaca tabel gaji ratusan baris di spreadsheet yang rumit.
- **Karakteristik Penggunaan**: Mengakses dashboard eksekutif via tablet/ponsel pintar saat bepergian, menyukai grafik visual dan tombol approval yang aman dengan PIN otentikasi.

---

### Persona 4: Akuntan / Finance & Tax Staff
- **Nama Profil**: Dewi Lestari, S.Ak (34 tahun)
- **Peran / Jabatan**: Senior Finance & Tax Officer di PT Ritel Modern Jaya.
- **Latar Belakang**: Memiliki sertifikasi Brevet Pajak A/B, bertanggung jawab atas pembukuan keuangan, pelaporan SPT Masa PPh 21, dan audit tahunan.
- **Tujuan Utama (Goals)**:
  - Mengunduh file ekspor CSV yang kompatibel 100% dengan skema impor DJP Online (e-Bupot 21/26) tanpa perlu mengedit format kolom manual.
  - Menghasilkan bukti potong Formulir 1721-A1 secara otomatis untuk seluruh karyawan di akhir tahun pajak.
  - Mengimpor jurnal beban gaji (Salary Expense, BPJS Employer Expense, Tax Payable, Bank Account) langsung ke software akuntansi (Mekari Jurnal/Xero).
- **Kendala & Frustrasi (Pain Points)**:
  - Menghabiskan waktu berjam-jam merekonsiliasi angka bruto gaji antara laporan HR dan data transfer bank.
  - Format CSV pajak yang sering *error* atau ditolak sistem DJP Online akibat kesalahan delimiter atau format NIK/NPWP 16 digit.
  - Sulit membedakan pencatatan iuran BPJS porsi pemberi kerja (beban) vs porsi karyawan (potongan utang).
- **Karakteristik Penggunaan**: Menggunakan desktop multi-monitor, membutuhkan fitur filter lanjutan, ekspor multi-format (CSV/XLSX), dan ringkasan jurnal debit/kredit yang seimbang (*balanced*).

---

## 3. USER STORIES & PRIORITISASI MOSCOW

Berikut adalah 24 User Stories komprehensif yang dirancang untuk seluruh persona dengan kriteria penerimaan (*Acceptance Criteria*) berbasis format Gherkin/Checklist dan penilaian nilai bisnis (*Business Value*).

```
+----------------------------------------------------------------------------------------------------+
|                                    RINGKASAN USER STORIES (MOSCOW)                                 |
+------------------------------------+------------------------------------+--------------------------+
| MUST HAVE (MVP Wajib)              | SHOULD HAVE (Fase v1.0)            | COULD HAVE (Fase v2.0)   |
+------------------------------------+------------------------------------+--------------------------+
| - US-01: Master Karyawan & Pajak   | - US-05: Integrasi Mesin Fingerprint| - US-12: Multi-Branch    |
| - US-02: Kalkulasi PPh 21 TER 2024 | - US-07: Prorata Gaji Masuk/Keluar | - US-16: Pinjaman/Kasbon |
| - US-03: Kalkulasi 4 BPJS TK & Kes | - US-09: WhatsApp Blast Slip Gaji  | - US-21: Multi-Currency  |
| - US-04: Absensi GPS & Geofence    | - US-14: Ekspor Form 1721-A1 Massal| - US-24: AI Overtime Risk|
| - US-06: Lembur PP 35/2021         | - US-17: Delegasi Approval Cuti    |                          |
| - US-08: Slip Gaji PDF Terenkripsi | - US-19: Integrasi API Jurnal      |                          |
| - US-10: 4-Step Payroll Wizard     | - US-23: Billing & Subscription    |                          |
| - US-11: Final Approval Owner      |                                    |                          |
| - US-13: Ekspor CSV DJP e-Bupot    |                                    |                          |
| - US-15: Rekap BPJS F2A            |                                    |                          |
| - US-18: Jurnal Akuntansi CSV      |                                    |                          |
| - US-20: ESS Mobile View           |                                    |                          |
| - US-22: Multi-Tenant RBAC & Audit |                                    |                          |
+------------------------------------+------------------------------------+--------------------------+
```

### 3.1 Kategori: Manajemen Karyawan & HRIS
- **US-01 [MUST HAVE] - Pendaftaran Karyawan dengan Parameter Pajak & BPJS**
  - **Sebagai**: Admin HR
  - **Saya ingin**: Menginput data karyawan lengkap mencakup NIK 16 digit, NPWP 16/15 digit, status PTKP (TK/0–3, K/0–3, K/I/0–3), kepesertaan BPJS TK/Kes, dan nomor rekening bank.
  - **Sehingga**: Sistem dapat mengkategorikan tarif TER PPh 21 dan menghitung iuran BPJS secara tepat tanpa kesalahan manual.
  - **Acceptance Criteria**:
    - [x] Sistem memvalidasi NIK wajib 16 digit angka dan NPWP (format NIK 16 digit atau NPWP lama 15 digit).
    - [x] Pilihan status PTKP secara otomatis memetakan Kategori TER:
      - Kategori A: TK/0 (PTKP 54 jt), TK/1 (58,5 jt), K/0 (58,5 jt).
      - Kategori B: TK/2 (63 jt), TK/3 (67,5 jt), K/1 (63 jt), K/2 (67,5 jt).
      - Kategori C: K/3 (72 jt).
    - [x] Input komponen gaji pokok, tunjangan tetap, dan tunjangan tidak tetap tersimpan dalam riwayat gaji bertanggal efektif (*effective date*).
  - **Business Value**: Mencegah 100% kesalahan klasifikasi pajak di awal pendataan karyawan.

- **US-02 [MUST HAVE] - Pelacakan Masa Kontrak PKWT & Pengingat Kompensasi**
  - **Sebagai**: Admin HR
  - **Saya ingin**: Melihat status kepegawaian (PKWT, PKWTT, Harian/Freelance) beserta tanggal mulai dan berakhirnya kontrak.
  - **Sehingga**: Saya mendapatkan notifikasi 30 hari sebelum kontrak berakhir dan sistem otomatis mengkalkulasi estimasi uang kompensasi PKWT sesuai PP 35/2021.
  - **Acceptance Criteria**:
    - [x] Dashboard menampilkan *widget reminder* untuk kontrak kerja yang akan habis dalam 30, 14, dan 7 hari.
    - [x] Terdapat kalkulator kompensasi PKWT otomatis: $\text{Kompensasi} = \frac{\text{Masa Kerja (Bulan)}}{12} \times 1\text{ Bulan Upah}$.
  - **Business Value**: Menjamin kepatuhan terhadap UU Cipta Kerja dan menghindari denda sengketa hubungan industrial.

---

### 3.2 Kategori: Kehadiran & Absensi
- **US-03 [MUST HAVE] - Absensi Masuk/Pulang Berbasis GPS Geofencing & Selfie**
  - **Sebagai**: Karyawan
  - **Saya ingin**: Melakukan clock-in dan clock-out langsung dari peramban ponsel pintar dengan verifikasi koordinat GPS dan foto selfie.
  - **Sehingga**: Kehadiran saya tercatat akurat dan sah tanpa perlu mengantre di mesin fingerprint fisik.
  - **Acceptance Criteria**:
    - [x] Sistem membaca koordinat GPS perangkat dan membandingkannya dengan radius batas kantor (misal: radius 50 meter dari titik koordinat cabang).
    - [x] Jika berada di luar radius, tombol clock-in terkunci disertai pesan peringatan jarak.
    - [x] Sistem mewajibkan pengambilan foto kamera langsung (bukan unggah galeri) dan mencatat stempel waktu server (bukan waktu lokal perangkat).
  - **Business Value**: Mengeliminasi kecurangan absensi (*buddy punching*) dan mempermudah operasional multi-cabang UMKM.

- **US-04 [MUST HAVE] - Pengajuan & Rekapitulasi Cuti Serta Izin Sakit**
  - **Sebagai**: Karyawan
  - **Saya ingin**: Mengajukan cuti tahunan, cuti khusus (melahirkan, menikah, duka), atau izin sakit beserta lampiran foto surat dokter melalui aplikasi.
  - **Sehingga**: Kuota cuti terpotong otomatis setelah disetujui atasan dan rekap absensi akhir bulan langsung terbarui.
  - **Acceptance Criteria**:
    - [x] Form pengajuan menampilkan sisa saldo cuti tahunan karyawan secara real-time.
    - [x] Pengajuan izin sakit mewajibkan unggah berkas (JPG/PDF Surat Keterangan Dokter).
    - [x] Setelah disetujui atasan/HR, tanggal cuti otomatis berstatus "Cuti/Izin" pada tabel rekap absensi bulanan tanpa memicu penalti potongan kehadiran.
  - **Business Value**: Mengurangi beban komunikasi manual via WhatsApp dan menjaga akuntabilitas histori cuti.

- **US-05 [SHOULD HAVE] - Impor Data Log Absensi Mesin Fingerprint (CSV/Excel)**
  - **Sebagai**: Admin HR
  - **Saya ingin**: Mengunggah berkas ekspor log absensi dari mesin fingerprint merk populer (Solution, Fingerspot, ZKTeco) dalam format CSV/Excel.
  - **Sehingga**: Data jam masuk, jam keluar, dan keterlambatan ribuan transaksi langsung tersinkronisasi dalam hitungan detik.
  - **Acceptance Criteria**:
    - [x] Modul impor menyediakan template pemetaan kolom (Employee ID, Timestamp, In/Out State).
    - [x] Sistem mendeteksi otomatis duplikasi data dan anomali (misal: absen masuk tanpa absen pulang).
  - **Business Value**: Menghemat waktu rekonsiliasi data kehadiran hingga 80% pada bisnis dengan mesin absen fisik.

---

### 3.3 Kategori: Engine Perhitungan Gaji & Lembur
- **US-06 [MUST HAVE] - Kalkulasi Otomatis Lembur Sesuai PP No. 35/2021**
  - **Sebagai**: Admin HR / Payroll Officer
  - **Saya ingin**: Sistem menghitung total upah lembur karyawan secara otomatis berdasarkan jam lembur yang telah disetujui.
  - **Sehingga**: Perhitungan upah lembur akurat 100% mengikuti rumus regulasi ketenagakerjaan Indonesia.
  - **Acceptance Criteria**:
    - [x] Rumus dasar upah sejam: $\text{Upah Sejam} = \frac{1}{173} \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$.
    - [x] Perhitungan hari kerja biasa: Jam ke-1 dikalikan $1.5 \times \text{Upah Sejam}$, jam ke-2 dan seterusnya dikalikan $2.0 \times \text{Upah Sejam}$.
    - [x] Perhitungan hari libur resmi / istirahat mingguan (6 hari kerja / 40 jam seminggu):
      - Jam ke-1 s.d ke-7: $2.0 \times \text{Upah Sejam}$.
      - Jam ke-8: $3.0 \times \text{Upah Sejam}$.
      - Jam ke-9 s.d ke-10: $4.0 \times \text{Upah Sejam}$.
  - **Business Value**: Menjamin kepatuhan hukum ketenagakerjaan dan transparansi pembayaran hak pekerja lembur.

- **US-07 [SHOULD HAVE] - Perhitungan Prorata Gaji Karyawan Masuk / Keluar Tengah Bulan**
  - **Sebagai**: Admin HR
  - **Saya ingin**: Sistem menghitung gaji prorata otomatis untuk karyawan baru yang mulai bekerja atau karyawan yang berhenti di pertengahan periode gaji.
  - **Sehingga**: Pembayaran gaji adil sesuai jumlah hari kerja aktif yang dijalani.
  - **Acceptance Criteria**:
    - [x] Admin dapat memilih metode prorata:
      - Berdasarkan Hari Kerja Aktual: $\text{Gaji Prorata} = \frac{\text{Jumlah Hari Kerja Masuk}}{\text{Total Hari Kerja Sebulan}} \times \text{Gaji Sebulan}$.
      - Berdasarkan Hari Kalender (Standar Depnaker 1/25 atau 1/21): $\text{Gaji Prorata} = \frac{\text{Hari Masuk}}{25} \times \text{Upah Sebulan}$.
  - **Business Value**: Mencegah kelebihan/kekurangan bayar gaji pada periode transisi karyawan.

---

### 3.4 Kategori: Pajak PPh 21 & Kepatuhan BPJS
- **US-08 [MUST HAVE] - Engine Pajak PPh 21 TER (PP 58/2023 & PMK 168/2023) Bulanan**
  - **Sebagai**: Akuntan / Payroll Officer
  - **Saya ingin**: Menghitung potongan PPh 21 bulanan (Januari s.d. November) secara otomatis menggunakan skema Tarif Efektif Rata-rata (TER).
  - **Sehingga**: Potongan pajak karyawan tepat sesuai tabel tarif resmi pemerintah tanpa perlu menghitung PTKP dan tarif progresif setiap bulan.
  - **Acceptance Criteria**:
    - [x] Sistem mengidentifikasi Kategori TER (A, B, atau C) berdasarkan status PTKP karyawan.
    - [x] Sistem menjumlahkan Penghasilan Bruto Sebulan (Gaji Pokok + Tunjangan Tetap/Tidak Tetap + Lembur + Premi JKK/JKM & BPJS Kes dari Pemberi Kerja).
    - [x] Sistem mencocokkan Bruto ke tabel layer persentase TER (0% s.d. 34%) dan mengalikan secara otomatis: $\text{PPh 21 TER} = \text{Penghasilan Bruto} \times \text{Tarif TER}$.
    - [x] Mendukung 3 skema metode pemotongan: *Gross* (potong gaji), *Gross-up* (tunjangan pajak otomatis), dan *Nett* (ditanggung perusahaan).
  - **Business Value**: Menjamin kepatuhan 100% pada regulasi perpajakan DJP terbaru dan menghilangkan risiko denda pajak.

- **US-09 [MUST HAVE] - Rekalkulasi PPh 21 Pasal 17 Masa Pajak Terakhir (Desember / Resign)**
  - **Sebagai**: Akuntan / Tax Officer
  - **Saya ingin**: Melakukan penyesuaian (*true-up*) PPh 21 di masa pajak Desember atau bulan saat karyawan keluar menggunakan tarif progresif Pasal 17 ayat (1) huruf a UU HPP.
  - **Sehingga**: Selisih kurang bayar atau lebih bayar PPh 21 tahunan terkalkulasi otomatis dan saldo pajak akhir tahun pas.
  - **Acceptance Criteria**:
    - [x] Sistem menghitung Bruto Setahun, dikurangi Biaya Jabatan (5% max Rp 6.000.000/tahun atau Rp 500.000/bulan), dikurangi Iuran JHT & JP yang dibayar karyawan.
    - [x] Dikurangi PTKP Tahunan untuk menghasilkan Penghasilan Kena Pajak (PKP) yang dibulatkan ke bawah ribuan penuh.
    - [x] Menerapkan lapisan tarif progresif Pasal 17 UU HPP (5%, 15%, 25%, 30%, 35%).
    - [x] $\text{PPh 21 Desember} = \text{PPh 21 Terutang Setahun} - \sum (\text{PPh 21 Telah Dipotong Jan--Nov})$.
    - [x] Jika terjadi lebih bayar (PPh 21 negatif), sistem mengembalikan kelebihan potong ke Take Home Pay karyawan dan mencatat kompensasi pajak bagi perusahaan.
  - **Business Value**: Menghilangkan kekacauan audit pajak akhir tahun yang selama ini menjadi momok bagi bagian keuangan.

- **US-10 [MUST HAVE] - Kalkulasi 4 Program BPJS Ketenagakerjaan & BPJS Kesehatan**
  - **Sebagai**: Payroll Officer
  - **Saya ingin**: Menghitung rincian iuran BPJS TK (JHT, JKK, JKM, JP) dan BPJS Kesehatan dengan memisahkan beban tanggungan pemberi kerja dan potongan pekerja.
  - **Sehingga**: Rincian transfer iuran ke portal BPJS SIPP dan BPJS Kesehatan e-Dabu valid tanpa ada penolakan sistem.
  - **Acceptance Criteria**:
    - [x] **JHT**: 3.7% Pemberi Kerja + 2.0% Pekerja (dari Upah Pokok + Tunjangan Tetap).
    - [x] **JKK**: Disesuaikan tingkat risiko perusahaan (Sangat Rendah: 0.24%, Rendah: 0.54%, Sedang: 0.89%, Tinggi: 1.27%, Sangat Tinggi: 1.74% - seluruhnya Pemberi Kerja).
    - [x] **JKM**: 0.30% (seluruhnya Pemberi Kerja).
    - [x] **JP**: 2.0% Pemberi Kerja + 1.0% Pekerja, dengan batas maksimal upah bulanan terproteksi (default batas 2024: Rp 10.042.300 atau dapat disesuaikan per pembaruan regulasi).
    - [x] **BPJS Kesehatan**: 4.0% Pemberi Kerja + 1.0% Pekerja, dengan batas maksimal upah Rp 12.000.000.
  - **Business Value**: 100% akurasi iuran jaminan sosial nasional dan kepatuhan audit BPJS.

---

### 3.5 Kategori: Slip Gaji Digital & Distribusi
- **US-11 [MUST HAVE] - Pembuatan Slip Gaji PDF Terproteksi PIN Sesuai UU PDP**
  - **Sebagai**: Karyawan
  - **Saya ingin**: Mengunduh slip gaji resmi dalam format PDF yang terenkripsi dengan password rahasia (kombinasi 6 digit tanggal lahir DDMMYY atau PIN khusus).
  - **Sehingga**: Kerahasiaan data finansial dan identitas pribadi saya terlindungi dari akses orang lain yang tidak berhak.
  - **Acceptance Criteria**:
    - [x] File PDF yang di-generate sistem terkunci password standar AES-128/256.
    - [x] Slip memuat QR Code verifikasi keaslian dokumen digital yang dapat dipindai untuk memvalidasi nomor seri unik slip gaji.
    - [x] Format slip menampilkan rincian pendapatan, rincian potongan, kontribusi perusahaan (BPJS), dan Take Home Pay secara transparan.
  - **Business Value**: Kepatuhan penuh terhadap UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP).

- **US-12 [SHOULD HAVE] - Distribusi Slip Gaji Otomatis via Email & WhatsApp Blast**
  - **Sebagai**: Admin HR
  - **Saya ingin**: Mengirimkan slip gaji digital ke ratusan karyawan secara serentak via Email terdaftar dan pesan WhatsApp resmi dalam 1 kali klik.
  - **Sehingga**: Karyawan langsung menerima pemberitahuan di ponsel mereka pada hari gajian tanpa perlu menunggu distribusi manual.
  - **Acceptance Criteria**:
    - [x] Setelah Payroll Run berstatus *Approved & Finalized*, tombol "Kirim Slip Massal" aktif.
    - [x] Admin dapat memilih channel: Email saja, WhatsApp saja, atau Keduanya.
    - [x] Sistem menampilkan status pengiriman per karyawan: *Queued*, *Sent*, *Delivered*, *Failed*.
  - **Business Value**: Memangkas waktu distribusi slip gaji dari 4 jam menjadi kurang dari 1 menit.

---

### 3.6 Kategori: Wizard Payroll & Approval
- **US-13 [MUST HAVE] - 4-Step Guided Payroll Processing Wizard**
  - **Sebagai**: Admin HR / Payroll Officer
  - **Saya ingin**: Menjalankan proses hitung gaji bulanan melalui wizard 4 langkah yang memandu verifikasi data secara bertahap.
  - **Sehingga**: Tidak ada komponen gaji, absensi, atau potongan yang terlewat sebelum diajukan ke pemilik usaha.
  - **Acceptance Criteria**:
    - [x] **Step 1 - Periode & Rekap Absensi**: Pilih cut-off periode, kunci kehadiran, cek karyawan absen/cuti/terlambat.
    - [x] **Step 2 - Review Komponen & Lembur**: Tinjau jam lembur, bonus, tunjangan tidak tetap, dan potongan kasbon.
    - [x] **Step 3 - Kalkulasi Pajak PPh 21 & BPJS**: Tinjau hasil perhitungan otomatis PPh 21 TER dan iuran jaminan sosial.
    - [x] **Step 4 - Ringkasan & Submit Approval**: Tinjau total pengeluaran gaji (*Grand Total Payroll Cost*), deteksi selisih anomali vs bulan lalu, dan submit ke Owner.
  - **Business Value**: Mengurangi potensi *human error* proses payroll hingga 95% dengan *checklist UX* yang intuitif.

- **US-14 [MUST HAVE] - Otorisasi & Final Approval Payroll oleh Pemilik Usaha**
  - **Sebagai**: Pemilik Usaha (Business Owner)
  - **Saya ingin**: Menerima notifikasi pengajuan payroll, meninjau ringkasan biaya bersih dan rincian per departemen di ponsel, lalu menyetujui menggunakan PIN keamanan.
  - **Sehingga**: Saya memegang kendali penuh atas pengeluaran kas perusahaan sebelum dana ditransfer ke karyawan.
  - **Acceptance Criteria**:
    - [x] Notifikasi instan masuk ke email/WhatsApp Owner saat HR melakukan submit payroll.
    - [x] Layar ringkasan menampilkan perbandingan Total THP bulan ini vs bulan sebelumnya disertai *highlight* deviasi > 10%.
    - [x] Tombol "Setujui Payroll" mewajibkan input 6-digit PIN Otorisasi Transaksi.
    - [x] Opsi "Tolak / Minta Revisi" disertai kolom catatan revisi yang langsung dikirimkan kembali ke Admin HR.
  - **Business Value**: Tata kelola keuangan (*financial governance*) yang kuat dan pencegahan salah transfer dana gaji.

---

### 3.7 Kategori: Pelaporan Pajak & Jurnal Keuangan
- **US-15 [MUST HAVE] - Ekspor Format CSV DJP Online e-Bupot 21/26**
  - **Sebagai**: Akuntan / Finance Staff
  - **Saya ingin**: Mengunduh berkas CSV rekapitulasi PPh 21 bulanan yang format susunan kolom dan delimiternya sudah sesuai spesifikasi resmi Ditjen Pajak.
  - **Sehingga**: Saya bisa langsung mengimpor berkas tersebut ke aplikasi DJP Online (e-Bupot 21/26) tanpa error format kolom.
  - **Acceptance Criteria**:
    - [x] Berkas CSV memuat kolom: NPWP/NIK Pemotong, Kode Objek Pajak (21-100-01 untuk Pegawai Tetap, 21-100-02 untuk Tidak Tetap), Jumlah Bruto, Tarif TER/Pasal 17, PPh Dipotong.
    - [x] Delimiter berkas dapat dikonfigurasi (Koma `,` atau Titik Koma `;`) sesuai pengaturan regional sistem DJP.
  - **Business Value**: Menghemat waktu pelaporan SPT Masa PPh 21 dari berjam-jam menjadi beberapa detik.

- **US-16 [SHOULD HAVE] - Pembuatan Bukti Potong Formulir 1721-A1 Tahunan Otomatis**
  - **Sebagai**: Akuntan / Finance Staff
  - **Saya ingin**: Menghasilkan dokumen Formulir 1721-A1 dalam format PDF resmi dan berkas impor CSV untuk seluruh karyawan tetap di akhir tahun pajak.
  - **Sehingga**: Perusahaan dapat membagikan bukti potong ke karyawan untuk kebutuhan pelaporan SPT Tahunan Pribadi tepat sebelum tenggat 31 Maret.
  - **Acceptance Criteria**:
    - [x] Sistem mengompilasi seluruh data penghasilan bruto, iuran pensiun/JHT, biaya jabatan, PTKP, dan PPh 21 terutang masa Januari–Desember.
    - [x] Formulir 1721-A1 siap dicetak atau diunduh massal dalam berkas ZIP terenkripsi.
  - **Business Value**: Menjamin kepatuhan administrasi perpajakan tahunan dan meningkatkan kepuasan karyawan.

- **US-17 [MUST HAVE] - Ekspor Jurnal Beban Gaji ke Software Akuntansi**
  - **Sebagai**: Akuntan
  - **Saya ingin**: Mengunduh rekapitulasi jurnal akuntansi *double-entry* untuk transaksi penggajian periode berjalan.
  - **Sehingga**: Saya dapat langsung mengimpor jurnal debit/kredit ke software akuntansi (Mekari Jurnal, Xero, QuickBooks, Accurate Online).
  - **Acceptance Criteria**:
    - [x] Tabel jurnal menampilkan akun:
      - **Debit**: Beban Gaji Pokok, Beban Tunjangan, Beban Lembur, Beban BPJS TK Perusahaan (JKK, JKM, JHT, JP), Beban BPJS Kes Perusahaan.
      - **Kredit**: Utang PPh 21, Utang Iuran BPJS TK (Pekerja + Perusahaan), Utang Iuran BPJS Kes (Pekerja + Perusahaan), Kas/Bank (Total Net Take Home Pay).
    - [x] Total Debit dan Total Kredit terbukti seimbang (*balance* 100%).
  - **Business Value**: Mencegah kesalahan pembukuan akuntansi dan mempercepat proses tutup buku bulanan (*monthly financial closing*).

---

### 3.8 Kategori: Administrasi Multi-Tenant & Keamanan
- **US-18 [MUST HAVE] - Pengaturan Multi-Tenant, Cabang & Role-Based Access Control (RBAC)**
  - **Sebagai**: Pemilik Usaha / Super Admin
  - **Saya ingin**: Mengelola profil entitas usaha, mendaftarkan beberapa cabang/outlet, dan menetapkan hak akses peran (*roles*) yang ketat untuk staf.
  - **Sehingga**: Setiap staf hanya dapat melihat dan memodifikasi data sesuai kewenangannya (misal: HR Cabang A tidak bisa melihat gaji Cabang B).
  - **Acceptance Criteria**:
    - [x] Mendukung peran hierarkis: Super Admin (Owner), HR Manager, Payroll Officer, Finance/Tax Staff, Branch Supervisor, Employee.
    - [x] Pengaturan privasi: Data nominal gaji pokok dan rincian THP hanya dapat dilihat oleh peran berizin khusus (*view salary permission*).
  - **Business Value**: Menjaga kerahasiaan internal dan mencegah kebocoran informasi kompensasi antar karyawan.

- **US-19 [MUST HAVE] - Audit Log Forensik untuk Setiap Perubahan Data Finansial**
  - **Sebagai**: Pemilik Usaha / Auditor
  - **Saya ingin**: Melihat catatan log aktivitas (*audit trail*) yang tidak dapat dihapus (*immutable*) atas setiap perubahan gaji, edit absensi, dan approval payroll.
  - **Sehingga**: Setiap manipulasi data atau kesalahan input dapat ditelusuri siapa pelakunya (*who, what, when, IP address, before/after value*).
  - **Acceptance Criteria**:
    - [x] Sistem mencatat log secara otomatis saat terjadi: Perubahan Gaji Pokok, Manual Override Lembur, Approval Payroll, dan Download Dokumen Pajak.
    - [x] Catatan log menampilkan Timestamp UTC+7, User ID, Nama User, Alamat IP, Aksi, Nilai Sebelum (*Old Value*), dan Nilai Sesudah (*New Value*).
  - **Business Value**: Memenuhi standar tata kelola data ISO 27001 dan kepatuhan UU PDP Pasal 35.

- **US-20 [SHOULD HAVE] - Manajemen Tagihan Langganan SaaS & Pilihan Pembayaran Lokal**
  - **Sebagai**: Pemilik Usaha
  - **Saya ingin**: Memilih paket langganan (Starter/Pro), melihat jumlah kuota karyawan aktif, dan membayar tagihan bulanan/tahunan via QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), atau Kartu Kredit.
  - **Sehingga**: Akses aplikasi bisnis saya tetap aktif tanpa kendala pembayaran.
  - **Acceptance Criteria**:
    - [x] Integrasi payment gateway lokal (Midtrans / Xendit) dengan verifikasi otomatis instan (*auto-upgrade on payment success*).
    - [x] Sistem menerbitkan faktur tagihan (*invoice*) resmi berbasis PDF yang dapat diunduh untuk kebutuhan pembukuan perusahaan.
  - **Business Value**: Monetisasi SaaS yang mulus dengan *churn rate* minimal.

---

### 3.9 User Stories Lanjutan (Could Have / v2.0)
- **US-21 [COULD HAVE] - Modul Pinjaman Karyawan & Kasbon Berbunga 0% dengan Pemotongan Otomatis**
- **US-22 [COULD HAVE] - Generator Pembayaran THR Otomatis Berbasis Permenaker No. 6/2016**
- **US-23 [COULD HAVE] - Multi-Level Approval Cuti & Lembur dengan Fitur Delegasi Wewenang Sementara**
- **US-24 [COULD HAVE] - AI Overtime & Attendance Anomaly Detection (Deteksi Dini Pembengkakan Biaya Lembur)**

---

## 4. SPESIFIKASI FUNGSIONAL MENDALAM (8 MODUL INTI)

### MODUL 1: MANAJEMEN DATA KARYAWAN & HRIS DASAR

#### 4.1.1 Struktur Master Data Karyawan
Modul ini berfungsi sebagai *single source of truth* data ketenagakerjaan:
1. **Identitas Personal & Legalitas**:
   - Nama Lengkap (sesuai KTP) dan Gelar.
   - NIK (16 digit angka, tervalidasi algoritma wilayah & tanggal lahir).
   - NPWP (Mendukung format NPWP 16 digit terintegrasi NIK serta NPWP 15 digit format lama). Indikator kepemilikan NPWP (jika tidak memiliki NPWP, sistem menandai untuk penyesuaian tarif PPh 21 non-NPWP sesuai aturan yang berlaku).
   - Tempat & Tanggal Lahir, Jenis Kelamin, Agama, Status Perkawinan.
   - Alamat KTP dan Alamat Domisili Aktual.
   - Kontak: Email aktif, No. Telepon / WhatsApp.
   - Kontak Darurat (*Emergency Contact*): Nama, Hubungan, Nomor Telepon.
2. **Status Pajak & Jaminan Sosial**:
   - Status PTKP: Pilihan `TK/0`, `TK/1`, `TK/2`, `TK/3`, `K/0`, `K/1`, `K/2`, `K/3`, `K/I/0`, `K/I/1`, `K/I/2`, `K/I/3`.
   - Pemetaan Kategori TER Otomatis: Kategori A, B, atau C.
   - Metode Pemotongan PPh 21: `Gross` (Karyawan menanggung pajak), `Gross-Up` (Perusahaan memberikan tunjangan pajak), `Nett` (Pajak ditanggung perusahaan).
   - No. Kartu Peserta Jamsostek (KPJ BPJS Ketenagakerjaan).
   - No. Kartu BPJS Kesehatan (13 digit).
   - Tingkat Risiko JKK Unit Kerja: Ditentukan berdasarkan lokasi cabang/departemen (0.24% s.d. 1.74%).
3. **Data Kepegawaian & Penempatan**:
   - NIP / ID Karyawan Perusahaan (Auto-generate atau Custom format).
   - Status Ketenagakerjaan: `PKWT` (Kontrak), `PKWTT` (Tetap), `Freelance / Harian Lepas`, `Magang / Intern`.
   - Tanggal Mulai Bekerja (*Join Date*) & Tanggal Berakhir Kontrak (*End Contract Date*).
   - Unit Penempatan: Kantor Cabang / Outlet, Departemen, Divisi, Jabatan (*Job Title*), Level Jabatan (*Grade/Tier*).
   - Atasan Langsung (*Direct Supervisor*) untuk jalur approval hierarkis.
4. **Struktur Kompensasi & Rekening Bank**:
   - Gaji Pokok (*Basic Salary*).
   - Tunjangan Tetap (Tunjangan Jabatan, Tunjangan Keahlian, Tunjangan Perumahan).
   - Tunjangan Tidak Tetap (Tunjangan Makan Harian, Tunjangan Transportasi Harian, Tunjangan Pulsa).
   - Pengaturan Rekening Bank Payroll: Nama Bank (BCA, Mandiri, BRI, BNI, Permata, CIMB Niaga, BSI, dll.), Nomor Rekening, Nama Pemilik Rekening (Validasi kesesuaian nama rekening).

```
+---------------------------------------------------------------------------------------------------+
|                            LIFECYCLE STATUS KEPEGAWAIAN PADA CATATGAJI                            |
+---------------------------------------------------------------------------------------------------+
|  [ ONBOARDING / DRAFT ] ---> [ ACTIVE (PKWT / PKWTT / FREELANCE) ] ---> [ CONTRACT RENEWAL ]     |
|                                         |                                       |                 |
|                                         v                                       v                 |
|                            [ SUSPENDED / CUTI DILUAR TANGGUNGAN ]     [ TERMINATED / RESIGNED ]   |
|                                                                                 |                 |
|                                                                                 v                 |
|                                                                      [ HITUNG PESANGON/KOMP ]     |
+---------------------------------------------------------------------------------------------------+
```

---

### MODUL 2: KEHADIRAN, SHIFT & MANAJEMEN ABSENSI

#### 4.2.1 Mekanisme Absensi Mobile (GPS Geofencing + Anti-Spoof Selfie)
- **Geofencing Engine**: Menghitung jarak *Haversine* antara koordinat GPS perangkat karyawan $(lat_u, lon_u)$ dengan titik pusat kantor cabang $(lat_c, lon_c)$. Clock-in hanya valid jika $Distance \le Radius_{max}$ (default: 50 meter).
- **Liveness & Camera Capture**: Menggunakan antarmuka kamera langsung via peramban HTML5 (`navigator.mediaDevices.getUserMedia`) yang mencegah manipulasi unggah berkas galeri lokal atau *fake GPS mock location*.
- **Offline / Low-Connection Handling**: Menyimpan payload absensi terenkripsi sementara di *IndexedDB* lokal dan melakukan sinkronisasi otomatis (*auto-sync*) saat koneksi internet kembali stabil dengan verifikasi waktu server.

#### 4.2.2 Manajemen Shift & Jam Kerja
- **Tipe Jadwal Kerja**:
  - **Fixed Standard**: 5 hari kerja (8 jam/hari = 40 jam/minggu) atau 6 hari kerja (7 jam/hari = 40 jam/minggu) sesuai Pasal 77 UU Ketenagakerjaan jo. UU Cipta Kerja.
  - **Rotating Shift**: Pengaturan shift bergilir (Pagi: 07.00–15.00, Siang: 15.00–23.00, Malam: 23.00–07.00).
  - **Cross-Day Shift (Overnight)**: Penanganan pergantian tanggal untuk shift yang melintasi tengah malam (misal: masuk 22.00 keluar 06.00 keesokan harinya).
  - **Flexible Hours**: Target jam kerja harian tanpa batas jam masuk kaku.

#### 4.2.3 Kebijakan Keterlambatan & Potongan Kehadiran
- Pengaturan toleransi keterlambatan (*grace period*, misal: 10 menit).
- Rumus potongan keterlambatan yang dapat dikonfigurasi oleh tenant:
  - Opsi A: Flat rate (misal: terlambat > 15 menit potong Rp 15.000).
  - Opsi B: Prorata per menit upah jam kerja.
  - Opsi C: Pemotongan jatah tunjangan kehadiran/makan harian (tidak memotong gaji pokok).

---

### MODUL 3: ENGINE PERHITUNGAN GAJI OTOMATIS & REGULASI

Modul ini adalah jantung (*core engine*) dari CatatGaji. Seluruh perhitungan matematis dijamin akurat dan mengacu pada dasar hukum positif di Indonesia.

```
+---------------------------------------------------------------------------------------------------+
|                           ALUR KALKULASI PENGGAJIAN BULANAN (PAYROLL ENGINE)                     |
+---------------------------------------------------------------------------------------------------+
|  [ PENDAPATAN BRUTO ]                                                                             |
|  = Gaji Pokok + Tunjangan Tetap + Tunjangan Tidak Tetap (Kehadiran) + Upah Lembur (PP 35/2021)    |
|    + Premi BPJS JKK & JKM (Ditanggung Pemberi Kerja) + Premi BPJS Kes 4% (Ditanggung Pemberi Kerja)|
|                                                                                                   |
|  [ POTONGAN PPh 21 TER BULANAN (Jan - Nov) ]                                                     |
|  = Total Bruto Sebulan x % Tarif TER (Kategori A/B/C sesuai PP 58/2023 & PMK 168/2023)           |
|                                                                                                   |
|  [ POTONGAN IURAN BPJS KARYAWAN ]                                                                |
|  = JHT 2.0% + JP 1.0% (Capped Rp 10.042.300) + BPJS Kes 1.0% (Capped Rp 12.000.000)             |
|                                                                                                   |
|  [ POTONGAN LAINNYA ]                                                                             |
|  = Angsuran Kasbon / Pinjaman + Potongan Keterlambatan / Unpaid Leave                             |
|                                                                                                   |
|  [ TAKE HOME PAY (THP) KARYAWAN ]                                                                |
|  = (Gaji Pokok + Tunjangan + Lembur + Bonus) - (PPh 21 + BPJS Karyawan + Kasbon + Potongan Lain)  |
+---------------------------------------------------------------------------------------------------+
```

#### 4.3.1 Rumus Perhitungan Lembur Resmi (PP No. 35 Tahun 2021)
1. **Dasar Upah Sejam**:
   $$\text{Upah Sejam} = \frac{1}{173} \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$$
   *(Catatan: Jika upah pokok + tunjangan tetap lebih kecil dari Upah Minimum wilayah (UMR/UMK), maka dasar perhitungan lembur menggunakan UMR/UMK setempat).*

2. **Faktor Pengali Hari Kerja Biasa**:
   - Jam ke-1: $1.5 \times \text{Upah Sejam}$
   - Jam ke-2 dan seterusnya: $2.0 \times \text{Upah Sejam}$

3. **Faktor Pengali Hari Libur Mingguan / Libur Resmi Nasional**:
   - *Skema 6 Hari Kerja (40 Jam/Minggu)*:
     - Jam ke-1 s.d ke-7: $2.0 \times \text{Upah Sejam}$
     - Jam ke-8: $3.0 \times \text{Upah Sejam}$
     - Jam ke-9 s.d ke-10: $4.0 \times \text{Upah Sejam}$
   - *Skema 5 Hari Kerja (40 Jam/Minggu)*:
     - Jam ke-1 s.d ke-8: $2.0 \times \text{Upah Sejam}$
     - Jam ke-9: $3.0 \times \text{Upah Sejam}$
     - Jam ke-10 s.d ke-11: $4.0 \times \text{Upah Sejam}$

#### 4.3.2 Rumus PPh 21 TER (PP 58/2023 & PMK 168/2023)
- **Pemetaan Kategori TER**:
  - **TER A**: TK/0 (PTKP 54 jt), TK/1 (58.5 jt), K/0 (58.5 jt). Rentang Bruto mulai Rp 0 s.d > Rp 1.400.000.000 dengan 44 lapisan tarif (0% s.d. 34%).
  - **TER B**: TK/2 (63 jt), TK/3 (67.5 jt), K/1 (63 jt), K/2 (67.5 jt). Memiliki 40 lapisan tarif (0% s.d. 34%).
  - **TER C**: K/3 (72 jt). Memiliki 41 lapisan tarif (0% s.d. 34%).
- **Formula Bulanan (Masa Januari s.d. November)**:
  $$\text{Penghasilan Bruto Pajak} = \text{Gaji Pokok} + \text{Tunjangan} + \text{Lembur} + \text{Bonus} + (\text{Premi JKK} + \text{JKM} + \text{BPJS Kes 4\% Perusahaan})$$
  $$\text{PPh 21 Bulanan} = \text{Penghasilan Bruto Pajak} \times \text{Tarif TER}(\text{Kategori}, \text{Bruto})$$

- **Formula Rekalkulasi Masa Pajak Terakhir (Desember / Karyawan Resign)**:
  $$\text{Bruto Setahun} = \sum_{m=1}^{12} \text{Penghasilan Bruto Bulanan}$$
  $$\text{Pengurang Biaya Jabatan} = \min(5\% \times \text{Bruto Setahun}, \text{Rp } 6.000.000)$$
  $$\text{Pengurang Iuran Pensiun} = \sum (\text{JHT 2\% Karyawan} + \text{JP 1\% Karyawan})$$
  $$\text{Penghasilan Neto Setahun} = \text{Bruto Setahun} - \text{Biaya Jabatan} - \text{Pengurang Iuran}$$
  $$\text{Penghasilan Kena Pajak (PKP)} = \lfloor (\text{Penghasilan Neto} - \text{PTKP Tahunan}) \rfloor_{1.000}$$
  $$\text{PPh 21 Terutang Setahun} = \text{Tarif Progresif Pasal 17 UU HPP}(\text{PKP})$$
  $$\text{PPh 21 Kurang/(Lebih) Bayar Desember} = \text{PPh 21 Terutang Setahun} - \sum_{m=1}^{11} \text{PPh 21 Telah Dipotong}$$

- **Lapisan Tarif Progresif Pasal 17 ayat (1) huruf a UU HPP**:
  - Lapisan 1: Rp 0 s.d. Rp 60.000.000 $\rightarrow 5\%$
  - Lapisan 2: > Rp 60.000.000 s.d. Rp 250.000.000 $\rightarrow 15\%$
  - Lapisan 3: > Rp 250.000.000 s.d. Rp 500.000.000 $\rightarrow 25\%$
  - Lapisan 4: > Rp 500.000.000 s.d. Rp 5.000.000.000 $\rightarrow 30\%$
  - Lapisan 5: > Rp 5.000.000.000 $\rightarrow 35\%$

#### 4.3.3 Matriks Tarif Iuran BPJS Lengkap
| Program Jaminan Sosial | Beban Pemberi Kerja (Perusahaan) | Beban Pekerja (Potong Gaji) | Dasar Upah Perhitungan | Batas Upah Maksimal (Plafon) |
|---|---|---|---|---|
| **BPJS TK - Jaminan Hari Tua (JHT)** | 3.70% | 2.00% | Gaji Pokok + Tunjangan Tetap | Tidak ada batas |
| **BPJS TK - Jaminan Kecelakaan Kerja (JKK)** | 0.24% s.d. 1.74% *(5 Kelas)* | 0.00% | Gaji Pokok + Tunjangan Tetap | Tidak ada batas |
| **BPJS TK - Jaminan Kematian (JKM)** | 0.30% | 0.00% | Gaji Pokok + Tunjangan Tetap | Tidak ada batas |
| **BPJS TK - Jaminan Pensiun (JP)** | 2.00% | 1.00% | Gaji Pokok + Tunjangan Tetap | Rp 10.042.300 / bulan (2024)* |
| **BPJS Kesehatan** | 4.00% | 1.00% | Gaji Pokok + Tunjangan Tetap | Rp 12.000.000 / bulan |

*(Keterangan: Batas plafon JP dapat diubah melalui Master Konfigurasi Sistem sesuai Keputusan Direksi BPJS TK tahun berjalan).*

#### 4.3.4 Generator THR Keagamaan (Permenaker No. 6 Tahun 2016)
- Karyawan dengan masa kerja $\ge 12$ bulan terus-menerus: Diberikan $1 \times \text{Upah Sebulan}$ (Gaji Pokok + Tunjangan Tetap).
- Karyawan dengan masa kerja $1 \le \text{Masa Kerja} < 12$ bulan: Diberikan secara prorata dengan formula:
  $$\text{THR Prorata} = \frac{\text{Masa Kerja (Bulan)}}{12} \times (\text{Gaji Pokok} + \text{Tunjangan Tetap})$$
- PPh 21 atas THR dihitung terpisah menggunakan formula PPh 21 Penghasilan Tidak Teratur sesuai ketentuan PMK 168/2023.

---

### MODUL 4: SLIP GAJI DIGITAL & DISTRIBUSI MULTI-CHANNEL

#### 4.4.1 Spesifikasi Dokumen Slip Gaji Digital
- **Enkripsi PDF**: Menggunakan pustaka *PDF encryption standard* dengan proteksi sandi ganda (Owner password untuk proteksi modifikasi, User password untuk membuka file). Kata sandi bawaan: Tanggal Lahir Karyawan `DDMMYYYY` atau 6-digit Custom PIN.
- **Validasi Keaslian QR Code**: Di bagian bawah slip tertera QR Code dinamis berisi URL verifikasi bertanda tangan kriptografi HMAC-SHA256 (`https://app.catatgaji.id/verify-slip/[hash]`). Jika dipindai, publik dapat melihat nomor dokumen valid, nama perusahaan, dan inisial karyawan tanpa mengekspos nominal gaji.
- **Elemen Wajib Slip Gaji**:
  1. Header: Logo Perusahaan, Nama Tenant, Periode Gaji, Tanggal Pembayaran.
  2. Data Karyawan: NIP, Nama, Jabatan, Departemen, Status PTKP, NIK, No. Rekening Bank.
  3. Kolom Pendapatan (*Earnings*): Gaji Pokok, Tunjangan Tetap, Tunjangan Kehadiran, Upah Lembur, Bonus/THR.
  4. Kolom Potongan (*Deductions*): PPh 21, BPJS TK (JHT & JP), BPJS Kesehatan, Potongan Keterlambatan, Kasbon.
  5. Kolom Kontribusi Perusahaan (*Company Contributions - Informational*): BPJS JKK, JKM, JHT, JP, BPJS Kes.
  6. Total Bersih: Take Home Pay (Angka + Huruf Terbilang Rupiah).

#### 4.4.2 Mesin Distribusi Multi-Channel
1. **Email Delivery**: Integrasi SMTP / Transaksional Email (SendGrid/Resend/AWS SES) dengan lampiran PDF terenkripsi.
2. **WhatsApp Official Blast**: Integrasi WhatsApp Business Cloud API / Gateway Resmi. Mengirim pesan notifikasi interaktif berisi tombol aman untuk mengunduh slip PDF.
3. **Portal ESS (Employee Self-Service)**: Karyawan dapat melihat dan mengunduh riwayat seluruh slip gaji dari bulan-bulan sebelumnya kapan saja tanpa batasan masa simpan.

---

### MODUL 5: APPROVAL WORKFLOW, KEBIJAKAN & DELEGASI

#### 4.5.1 Hierarki & Jalur Approval Dinamis
CatatGaji menyediakan alur persetujuan modular yang dapat disesuaikan per tenant:
- **Alur Lembur (*Overtime Workflow*)**:
  - *Pre-Approval*: Karyawan mengajukan estimasi lembur $\rightarrow$ Supervisor Cabang menyetujui Surat Perintah Kerja Lembur (SPKL).
  - *Post-Approval*: Sistem mencocokkan jam clock-out aktual dengan izin lembur $\rightarrow$ HR menyetujui realisasi jam lembur untuk penggajian.
- **Alur Cuti & Izin**:
  - Karyawan $\rightarrow$ Atasan Langsung (Approval Level 1) $\rightarrow$ HR Admin (Verifikasi Dokumen & Saldo Cuti).
- **Alur Penggajian Bulanan (*Monthly Payroll Run Approval*)**:
  - Admin Payroll melakukan kalkulasi & finalisasi draft $\rightarrow$ Finance Staff memverifikasi kesiapan kas $\rightarrow$ Pemilik Usaha / Direktur memberikan otorisasi final via PIN transaksi.

```
+---------------------------------------------------------------------------------------------------+
|                        ALUR PROSES PERSETUJUAN PENGGAJIAN FINAL (PAYROLL RUN)                    |
+---------------------------------------------------------------------------------------------------+
|  [ 1. HR ADMIN ]          [ 2. FINANCE / TAX ]         [ 3. BUSINESS OWNER ]       [ 4. SYSTEM ]  |
|  - Kunci Absensi          - Cek Rekonsiliasi Kas       - Review Summary Dashboard  - Blast Slip   |
|  - Run Payroll Wizard     - Validasi PPh 21 & BPJS     - Validasi Deviasi Biaya    - Export e-SPT |
|  - Submit Draft Run ----> - Approval Level 1 --------> - Input 6-Digit PIN ------> - Lock Record  |
+---------------------------------------------------------------------------------------------------+
```

#### 4.5.2 Delegasi Wewenang Sementara (*Temporary Approval Delegation*)
Jika seorang atasan atau pemilik usaha sedang cuti/bepergian, ia dapat mengaktifkan fitur delegasi wewenang ke pejabat pengganti dengan menetapkan rentang tanggal aktif. Seluruh riwayat aksi persetujuan tetap mencatat identitas delegator dan delegatee untuk audit kepatuhan.

---

### MODUL 6: PELAPORAN PAJAK & KEPATUHAN REGULASI (DJP & BPJS)

#### 4.6.1 Integrasi & Ekspor DJP Online e-Bupot 21/26
- Menghasilkan berkas CSV siap impor ke aplikasi e-Bupot 21/26 DJP Online sesuai petunjuk teknis PER-2/PJ/2024.
- Struktur kolom data:
  1. `Masa Pajak` & `Tahun Pajak`
  2. `NPWP Pemotong` & `NITKU`
  3. `NIK / NPWP Penerima Penghasilan` (Format 16 digit terstandarisasi)
  4. `Nama Penerima Penghasilan`
  5. `Kode Objek Pajak` (`21-100-01` Pegawai Tetap, `21-100-02` Pegawai Tidak Tetap, `21-100-03` Bukan Pegawai, `21-100-04` Pesangon)
  6. `Jumlah Penghasilan Bruto`
  7. `Kode Tarif TER` / `Tarif Pasal 17`
  8. `Jumlah PPh 21 Dipotong`

#### 4.6.2 Laporan Bukti Potong Formulir 1721-A1 Tahunan
- Sistem secara otomatis mengompilasi bukti potong tahunan (Formulir 1721-A1) untuk seluruh karyawan berstatus PKWTT dan PKWT yang bekerja penuh dalam tahun kalender.
- Fitur ekspor batch PDF 1721-A1 dalam satu file ZIP terstruktur per departemen/cabang.

#### 4.6.3 Laporan Rekapitulasi BPJS (Format F2A & e-Dabu)
- **BPJS Ketenagakerjaan (Formulir F2A)**: Berkas rekapitulasi rincian iuran per tenaga kerja (Upah, JHT, JKK, JKM, JP) yang siap diunggah ke portal SIPP Online BPJS TK.
- **BPJS Kesehatan (Format e-Dabu)**: Laporan mutasi gaji dan data anggota keluarga tanggungan pekerja.

---

### MODUL 7: DASHBOARD ANALYTICS & LAPORAN JURNAL AKUNTANSI

#### 4.7.1 Dashboard Analitik Eksekutif
- **Total Biaya Tenaga Kerja (*Total Cost of Workforce*)**:
  $$\text{Total Biaya Perusahaan} = \text{Total Gaji Kotor} + \text{Total Beban BPJS TK Perusahaan} + \text{Total Beban BPJS Kes Perusahaan}$$
- **Visualisasi Grafik**:
  - Tren Pengeluaran Gaji Bulanan (12 bulan terakhir).
  - Rasio Pengeluaran Lembur terhadap Biaya Gaji Pokok per Cabang.
  - Distribusi Biaya Payroll per Departemen (Pie Chart).
  - Headcount, Rasio Gender, dan *Turnover Rate* Bulanan.

#### 4.7.2 Generator Jurnal Akuntansi (*Double-Entry Journal Matrix*)
Sistem secara otomatis menyusun entri jurnal akuntansi berpasangan yang seimbang (*balanced*):

```
+---------------------------------------------------------------------------------------------------+
|                           TABEL MATRIKS JURNAL PENGGAJIAN CATATGAJI                              |
+-----+---------------------------------------------+-----------------------+-----------------------+
| No  | Nama Akun Rekening (Account Name)           | Posisi DEBIT (Rp)     | Posisi KREDIT (Rp)    |
+-----+---------------------------------------------+-----------------------+-----------------------+
| 1   | Beban Gaji Pokok & Tunjangan Karyawan       | [Total Bruto Gaji]    | -                     |
| 2   | Beban Upah Lembur                           | [Total Lembur]        | -                     |
| 3   | Beban Iuran BPJS TK Perusahaan (JKK,JKM,JHT,JP) | [Total BPJS TK Comp] | -                     |
| 4   | Beban Iuran BPJS Kesehatan Perusahaan (4%)  | [Total BPJS Kes Comp] | -                     |
| 5   | Utang PPh 21 Karyawan                       | -                     | [Total Potongan PPh]  |
| 6   | Utang Iuran BPJS Ketenagakerjaan            | -                     | [Total TK Emp + Comp] |
| 7   | Utang Iuran BPJS Kesehatan                  | -                     | [Total Kes Emp+Comp]  |
| 8   | Piutang Karyawan (Kasbon / Pinjaman)        | -                     | [Total Kasbon]        |
| 9   | Kas / Rekening Bank Payroll                 | -                     | [Total Take Home Pay] |
+-----+---------------------------------------------+-----------------------+-----------------------+
|     | TOTAL KESELURUHAN (SEIMBANG / BALANCED)     | [ TOTAL DEBIT ]       | [ TOTAL KREDIT ]      |
+-----+---------------------------------------------+-----------------------+-----------------------+
```

---

### MODUL 8: MULTI-TENANT ADMINISTRATION, RBAC & BILLING

#### 4.8.1 Manajemen Tenant & Struktur Organisasi
- **Onboarding Wizard**: Pendaftaran entitas bisnis baru dalam 3 menit (Nama PT/CV/UD, NPWP Badan, Sektor Usaha, Penetapan Tingkat Risiko JKK, Hari Kerja Standar, Tanggal Cut-off Penggajian).
- **Multi-Branch Hierarchy**: Dukungan struktur bertingkat (Kantor Pusat $\rightarrow$ Kantor Cabang / Outlet $\rightarrow$ Departemen $\rightarrow$ Posisi / Jabatan).

#### 4.8.2 Granular Role-Based Access Control (RBAC)
| Hak Akses / Modul | Super Admin (Owner) | HR Manager | Payroll Officer | Finance / Tax | Supervisor Cabang | Karyawan (ESS) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Kelola Tenant & Billing** | Full | No | No | No | No | No |
| **Lihat Nominal Gaji Karyawan** | Full | Full | Full | Full (Rekap) | No | Self Only |
| **Edit Master Data Karyawan** | Full | Full | Full | Read Only | No | Self Profile |
| **Eksekusi Payroll Run** | Approve | Review | Full Create | Review | No | No |
| **Approval Cuti & Lembur** | Full | Full | Review | No | Unit Cabang | Request Only |
| **Ekspor Pajak e-Bupot & Jurnal** | Full | Read | Read | Full Create | No | No |
| **Akses Audit Log Forensik** | Full | Read Only | No | No | No | No |

---

## 5. SPESIFIKASI WIREFRAME & DESAIN UI/UX (10 LAYAR UTAMA)

### LAYAR 1: DASHBOARD UTAMA (EXECUTIVE & HR VIEW)
- **URL Route**: `/dashboard`
- **Tujuan Halaman**: Pusat kendali harian untuk memantau status operasional HR, peringatan jatuh tempo kontrak/ulang tahun, status kehadiran hari ini, dan ringkasan biaya payroll.
- **Tata Letak (Layout)**:
  - *Top Navigation*: Logo Tenant, Cabang Switcher, Notifikasi Bell (badge pending approval), Profile Menu.
  - *Left Sidebar*: Menu Navigasi Utama (Dashboard, Karyawan, Absensi, Cuti & Lembur, Proses Payroll, Laporan Pajak & Jurnal, Pengaturan).
  - *Main Content*: Grid 12-kolom responsif.
- **Komponen UI**:
  1. *Banner Alert*: Peringatan kontrak PKWT berakhir $\le 30$ hari (dengan tombol "Tinjau Kontrak") dan pengingat tanggal cut-off gajian $H-3$.
  2. *4 Metric Cards*:
     - Total Karyawan Aktif (dengan perbandingan rasio PKWT/PKWTT).
     - Persentase Kehadiran Hari Ini (Hadir, Izin/Cuti, Terlambat, Alpha).
     - Estimasi Biaya Payroll Bulan Berjalan (Take Home Pay + Beban Perusahaan).
     - Pending Approvals (badge angka permohonan lembur/cuti yang menunggu tindakan).
  3. *Main Chart (Kiri, 8 Kolom)*: Bar chart pengeluaran gaji vs lembur 6 bulan terakhir.
  4. *Quick Action Panel (Kanan, 4 Kolom)*: Tombol cepat: "Mulai Proses Gaji", "Tambah Karyawan Baru", "Impor Log Absensi".
  5. *Recent Activity Table*: 5 log aktivitas terakhir (misal: "Budi Prasetyo mengajukan cuti tahunan", "Payroll Juli 2024 telah disetujui").
- **Responsivitas Mobile**: Sidebar menjadi *collapsible drawer*, metric cards ditumpuk vertikal 1 kolom, chart disederhanakan dengan touch-tooltip.

---

### LAYAR 2: MASTER DATA KARYAWAN (LIST, FILTER, MULTI-TAB FORM)
- **URL Route**: `/employees` & `/employees/[id]/edit`
- **Tujuan Halaman**: Mengelola seluruh basis data karyawan perusahaan dengan pencarian cepat, filter multi-kriteria, dan modal input bertahap.
- **Tata Letak & Komponen UI (Halaman List)**:
  - *Header Toolbar*: Search bar (pencarian nama/NIK/NIP), Filter dropdown (Cabang, Departemen, Status PKWT/PKWTT, Status Aktif/Nonaktif), Tombol "Ekspor Data (Excel/CSV)", Tombol "Tambah Karyawan".
  - *Interactive Data Table*:
    - Kolom: Foto & Nama Karyawan, NIP, Cabang/Dept, Status PTKP & TER (Badge A/B/C), Gaji Pokok (terproteksi mask `Rp •••••••` dengan toggle izin intip), Status Kontrak (Progress bar masa kerja), Aksi (Edit, View Detail, Deactivate).
    - Fitur: Sorting kolom, bulk action (Ubah Departemen massal, Kirim Undangan ESS).
- **Tata Letak & Komponen UI (Modal Form Tambah/Edit Karyawan)**:
  - Form multi-tab vertikal/horizontal:
    - **Tab 1: Biodata Personal** (Nama, NIK 16 digit, Tempat/Tgl Lahir, Jenis Kelamin, Alamat, Foto KTP, No. WA).
    - **Tab 2: Status Kepegawaian** (NIP, Tipe PKWT/PKWTT, Tgl Bergabung, Tgl Berakhir Kontrak, Cabang, Departemen, Jabatan, Atasan).
    - **Tab 3: Gaji & Kompensasi** (Gaji Pokok, Tunjangan Tetap, Tunjangan Kehadiran, Rekening Bank, Nama Bank).
    - **Tab 4: Pajak & Jaminan Sosial** (Status PTKP dropdown auto-kategori TER, NPWP 16/15 digit, Metode PPh Gross/Gross-up/Net, No. BPJS TK, No. BPJS Kes, Kelas Risiko JKK).
- **Interaksi & Validasi**:
  - Validasi *real-time inline*: NIK merah jika $< 16$ digit, peringatan duplikasi NPWP/NIK dalam tenant yang sama.

---

### LAYAR 3: MANAJEMEN ABSENSI & REKAP KEHADIRAN
- **URL Route**: `/attendance`
- **Tujuan Halaman**: Memantau absensi harian karyawan secara *live*, memverifikasi foto selfie & titik koordinat peta GPS, serta merekap absensi bulanan.
- **Tata Letak & Komponen UI**:
  - *View Switcher Tab*: `[ Live Monitoring Hari Ini ]`, `[ Rekapitulasi Bulanan ]`, `[ Log Mesin Fingerprint ]`.
  - *Tab 1: Live Monitoring*:
    - Peta interaktif (Leaflet/Mapbox) menampilkan pin lokasi clock-in karyawan vs polygon geofence cabang.
    - Feed log absensi real-time: Avatar karyawan, Jam Masuk, Selisih Keterlambatan, Thumbnail foto selfie (dapat diklik untuk modal *zoom inspection*), Indikator GPS Valid/Di Luar Radius.
  - *Tab 2: Rekapitulasi Bulanan*:
    - Filter Periode Cut-Off (misal: 21 Juni s.d. 20 Juli).
    - Matriks tabel kalender: Baris = Nama Karyawan, Kolom = Tanggal 1–31.
    - Kode warna: Hijau (Hadir Tepat Waktu), Kuning (Terlambat), Biru (Cuti/Izin Disetujui), Merah (Alpha), Abu-abu (Hari Libur).
    - Kolom Ringkasan: Total Hadir, Total Jam Kerja, Total Terlambat (Menit), Total Jam Lembur, Hari Unpaid Leave.
    - Tombol "Kunci Kehadiran Periode Ini" (mencegah manipulasi sebelum run payroll).

---

### LAYAR 4: PENGAJUAN & APPROVAL LEMBUR / CUTI
- **URL Route**: `/approvals`
- **Tujuan Halaman**: Pusat pengelolaan alur persetujuan permohonan lembur, cuti, izin sakit, dan klaim pengeluaran operasional.
- **Tata Letak & Komponen UI**:
  - *Sub-Nav Filter*: `Menunggu Persetujuan (Pending)`, `Telah Disetujui (Approved)`, `Ditolak (Rejected)`, `Riwayat Semua`.
  - *Kanban / Card Approval List*:
    - Setiap kartu memuat: Foto Karyawan, Tipe Permohonan (Badge: Lembur / Cuti Tahunan / Izin Sakit), Tanggal & Jam Pengajuan, Durasi / Total Jam, Alasan / Keterangan, Lampiran Berkas (Surat Dokter / SPKL).
    - Box Perhitungan Cuti: Menampilkan "Saldo Cuti Saat Ini: 8 Hari $\rightarrow$ Dipotong 2 Hari $\rightarrow$ Sisa: 6 Hari".
    - Box Perhitungan Lembur: Menampilkan "Hari Kerja Biasa: 3 Jam $\rightarrow$ Estimasi Upah Lembur: Rp 125.000".
  - *Action Buttons*: Tombol Hijau "Setujui (Approve)" dan Tombol Merah "Tolak (Reject)" dengan dialog konfirmasi input alasan penolakan.
  - *Batch Approval Toolbar*: Memungkinkan Supervisor mencentang 10 permohonan sekaligus dan menekan "Setujui Semua Terpilih".

---

### LAYAR 5: WIZARD PROSES GAJI BULANAN (4-STEP GUIDED WIZARD)
- **URL Route**: `/payroll/new-run`
- **Tujuan Halaman**: Memandu Admin HR menjalankan penggajian bulanan tanpa risiko langkah atau komponen yang terlewat.
- **Tata Letak & Komponen UI (Step Stepper Bar di Atas)**:

```
+---------------------------------------------------------------------------------------------------+
|  [ (1) Periode & Absensi ] ===> [ (2) Komponen & Lembur ] ===> [ (3) Pajak & BPJS ] ===> [ (4) Finalisasi ] |
+---------------------------------------------------------------------------------------------------+
```

1. **Step 1: Periode & Absensi**:
   - Pemilihan Periode Bulan & Tahun Pajak (misal: Juli 2024).
   - Pengaturan Rentang Tanggal Cut-Off Absensi.
   - Tabel Pemeriksaan Anomali: Menampilkan peringatan daftar karyawan dengan status absensi tidak lengkap (misal: "5 karyawan belum clock-out", "2 izin belum diapprove"). Tombol "Kunci & Lanjutkan".
2. **Step 2: Review Komponen & Lembur**:
   - Tabel kalkulasi otomatis lembur (Total Jam Lembur x Rumus PP 35/2021).
   - Kolom penyesuaian: Input bonus insentif, tunjangan tidak tetap, potongan kasbon, dan penalti keterlambatan.
   - Indikator perhitungan prorata otomatis bagi karyawan baru/keluar.
3. **Step 3: Kalkulasi Pajak PPh 21 TER & BPJS**:
   - Tabel simulasi bruto pajak per karyawan.
   - Kolom Kategori TER (A/B/C), Persentase Tarif TER, dan Nominal PPh 21 Terhitung.
   - Kolom Iuran BPJS TK (4 Program) dan BPJS Kesehatan (Porsi Karyawan vs Perusahaan).
   - Tombol toggle untuk melihat perbandingan metode *Gross* vs *Gross-up*.
4. **Step 4: Ringkasan & Submit Approval**:
   - Grand Total Summary Box: Total Take Home Pay, Total PPh 21, Total BPJS TK, Total BPJS Kes, Total Biaya Perusahaan (*Grand Payroll Cost*).
   - Deviasi Anomali Alert: "Perhatian: Biaya lembur Cabang Sudirman naik 28% dibanding bulan Juni 2024".
   - Tombol Aksi: "Simpan Draft" atau "Kirim ke Pemilik Usaha untuk Approval Final".

---

### LAYAR 6: DETAIL PAYROLL RUN & REVIEW GAJI PER KARYAWAN
- **URL Route**: `/payroll/runs/[id]`
- **Tujuan Halaman**: Tampilan lembar kerja mendalam (*payroll worksheet*) perorangan untuk audit detail, *override* nilai, dan pengecekan rekening sebelum pencairan.
- **Tata Letak & Komponen UI**:
  - *Header Run Info*: ID Payroll Run, Status (Draft / Pending Approval / Approved / Disbursed), Periode, Jumlah Karyawan, Tanggal Pembayaran.
  - *Search & Department Filter*: Pencarian karyawan spesifik dalam batch penggajian.
  - *Full Width Spreadsheet Matrix*:
    - Data Karyawan (NIP, Nama, Jabatan, Bank, No Rek).
    - Komponen Pendapatan: Gaji Pokok, Tunjangan Tetap, Tunjangan Variabel, Lembur, Bonus, THR.
    - Komponen Potongan: PPh 21 TER, BPJS TK Karyawan, BPJS Kes Karyawan, Kasbon, Potongan Lain.
    - Net Pay (Take Home Pay).
    - Beban Perusahaan: BPJS TK Perusahaan, BPJS Kes Perusahaan.
  - *Row Detail Drawer / Slide-Over Modal*:
    - Mengklik satu baris membuka panel kanan yang menampilkan kalkulasi matematis *step-by-step* (misal: "Bagaimana PPh 21 ini dihitung? Bruto Rp 7.500.000 x TER Kategori A 1.5% = Rp 112.500").
    - Tombol "Manual Adjustment / Override" dengan kolom wajib mengisi alasan perubahan (tercatat di audit log).

---

### LAYAR 7: TEMPLATE & PREVIEW SLIP GAJI DIGITAL (WEB & PDF)
- **URL Route**: `/payroll/runs/[id]/payslips`
- **Tujuan Halaman**: Mengonfigurasi tata letak slip gaji, melihat *live preview* dokumen PDF terenkripsi, dan mengeksekusi pengiriman otomatis massal.
- **Tata Letak & Komponen UI**:
  - *Left Panel (Pengaturan & Distribusi, 4 Kolom)*:
    - Template Selector: Pilihan desain slip (Modern Minimalist, Classic Enterprise, Compact Receipt).
    - Security Settings: Checkbox "Aktifkan Proteksi Sandi PDF" (Opsi: Tanggal Lahir DDMMYYYY / Custom PIN).
    - Delivery Channels: Checkbox `[x] Kirim Email Massal`, `[x] Kirim WhatsApp Notification`, `[x] Publikasikan ke Portal ESS`.
    - Tombol Utama: "Kirim Slip Gaji ke 35 Karyawan".
    - Tabel Status Pengiriman Real-Time (Nama, Channel, Status Sent/Failed, Resend button).
  - *Right Panel (Live PDF Interactive Viewer, 8 Kolom)*:
    - Render dokumen PDF interaktif yang menampilkan logo perusahaan, tabel pendapatan, tabel potongan, QR code verifikasi keamanan, dan footer tanda tangan digital.

---

### LAYAR 8: MODUL PAJAK & EKSPOR DJP / BPJS
- **URL Route**: `/tax-compliance`
- **Tujuan Halaman**: Pusat kepatuhan fiskal dan ketenagakerjaan untuk mengunduh berkas pelaporan resmi pemerintah.
- **Tata Letak & Komponen UI**:
  - *Tax Period Selector*: Bulan & Tahun Pajak.
  - *3 Main Compliance Cards*:
    1. **Pelaporan PPh 21 Bulanan (DJP e-Bupot 21/26)**:
       - Ringkasan: Total Bruto Karyawan Tetap, Total PPh 21 Terutang, Jumlah Penerima Penghasilan.
       - Tombol Aksi: "Unduh CSV e-Bupot 21/26 (Format Resmi DJP)", "Unduh Rekap Pajak (Excel)".
    2. **Pelaporan PPh 21 Tahunan (Formulir 1721-A1 & Masa Pajak Terakhir)**:
       - Ringkasan: Selisih Rekalkulasi Desember (Kurang Bayar / Lebih Bayar), Total Formulir 1721-A1 Diterbitkan.
       - Tombol Aksi: "Unduh Batch ZIP PDF 1721-A1 (Semua Karyawan)", "Unduh CSV Pembetulan Tahunan".
    3. **Rekapitulasi BPJS TK & BPJS Kesehatan**:
       - Ringkasan: Total Iuran BPJS TK (F2A), Total Iuran BPJS Kes, Kode Billing Sipp.
       - Tombol Aksi: "Unduh File Impor SIPP BPJS TK (F2A)", "Unduh Rekapitulasi Pembayaran BPJS Kesehatan".

---

### LAYAR 9: PENGATURAN PERUSAHAAN & KEBIJAKAN GAJI (TENANT SETTINGS)
- **URL Route**: `/settings/company` & `/settings/payroll-policy`
- **Tujuan Halaman**: Konfigurasi menyeluruh entitas bisnis, kebijakan operasional penggajian, integrasi perbankan, dan paket langganan.
- **Tata Letak & Komponen UI**:
  - *Vertical Settings Tabs*:
    - **Tab 1: Profil Perusahaan**: Nama Entitas (PT/CV), NPWP Badan 16 digit, Alamat Kantor Pusat, Logo Perusahaan, Sektor Usaha, Kelas Risiko JKK Default.
    - **Tab 2: Kantor Cabang & Geofence**: Tambah/Edit Cabang, Peta penetapan radius koordinat GPS (meter), Pengaturan Hari Kerja Lokal.
    - **Tab 3: Kebijakan Payroll**:
      - Tanggal Cut-Off Absensi (Tanggal 1 s.d. 31).
      - Tanggal Pembayaran Gaji (Payday).
      - Metode Perhitungan Lembur (Default PP 35/2021 / Custom Rate).
      - Metode Prorata Gaji (Hari Kerja Aktual / 25 Hari Standar).
      - Format Pembayaran Bank (BCA Payroll format, Mandiri MCM CSV, BI-FAST format).
    - **Tab 4: Role & Hak Akses (RBAC)**: Tambah staf admin, pilih peran, atur perizinan per modul.
    - **Tab 5: Paket Langganan & Tagihan**: Informasi paket aktif, kuota karyawan terpakai, riwayat invoice, tombol "Upgrade Paket".

---

### LAYAR 10: PORTAL KARYAWAN ESS (MOBILE-FIRST WEB / PWA)
- **URL Route**: `/ess` (Responsive Smartphone Layout)
- **Tujuan Halaman**: Aplikasi mandiri (*self-service*) bagi karyawan untuk melakukan clock-in harian, memantau absensi, mengunduh slip gaji, dan mengajukan cuti/lembur dari genggaman.
- **Tata Letak & Komponen UI (Mobile Viewport 375px - 430px)**:
  - *Header*: Sapaan Personal ("Halo, Budi Prasetyo"), Foto Avatar, Badges Shift ("Shift Pagi: 08:00 - 17:00").
  - *Quick Clock-In Card (Hero Section)*:
    - Jam Digital Real-Time (Server Time dengan detik).
    - Status Lokasi: "Di Outlet Sudirman (Dalam Radius 15m) ✅".
    - Tombol Besar Biru Beranimasi: "Clock-In Sekarang" (Membuka overlay kamera selfie instan).
    - Indikator Status: Waktu Masuk (`07:54`) & Waktu Pulang (`--:--`).
  - *4 Grid Menu Shortcut*:
    - `[ 📄 Slip Gaji ]`: Riwayat slip gaji bulanan, input PIN untuk unduh PDF langsung.
    - `[ 🏖️ Ajukan Cuti ]`: Cek sisa saldo cuti (tersisa 8 hari), form pengajuan cuti.
    - `[ ⏰ Ajukan Lembur ]`: Form izin lembur SPKL sebelum/sesudah kerja.
    - `[ 📅 Riwayat Absen ]`: Kalender kehadiran personal dan jam kerja harian.
  - *Bottom Navigation Bar*: `[ Beranda ]`, `[ Absensi ]`, `[ Pengajuan ]`, `[ Profil Saya ]`.

---

## 6. KEBUTUHAN NON-FUNGSIONAL, KEPATUHAN UU PDP & ARSITEKTUR MULTI-TENANT

### 6.1 Kepatuhan UU Perlindungan Data Pribadi (UU No. 27 Tahun 2022)
CatatGaji memproses Data Pribadi Umum (Nama, No HP) dan Data Pribadi Spesifik/Finansial (NIK, NPWP, Rekening Bank, Besaran Gaji). Implementasi kepatuhan mencakup:
1. **Enkripsi Data Sensitif**:
   - Kolom sensitif pada database (`salary_base`, `bank_account_no`, `nik`, `npwp`) wajib dienkripsi menggunakan algoritma **AES-256-GCM** dengan kunci enkripsi tingkat tenant (*Tenant-Specific Encryption Keys*).
   - Komunikasi seluruh data wajib menggunakan protokol **TLS 1.3** dengan sertifikat SSL terotentikasi.
2. **Persetujuan Pemrosesan Data (*Consent Management*)**: Karyawan wajib menyetujui lembar persetujuan elektronik pemrosesan data ketenagakerjaan dan finansial saat pertama kali login ke portal ESS.
3. **Hak Subjek Data (*Data Subject Rights*)**:
   - Fitur *Right to Access*: Karyawan dapat mengunduh salinan seluruh data profil dan riwayat gaji pribadinya.
   - Fitur *Right to Erasure / Anonymization*: Jika karyawan telah *resign* dan masa retensi audit pajak 5 tahun (UU KUP) telah terlampaui, data pribadi dapat dianonimkan atas permintaan tertulis.

### 6.2 Arsitektur Multi-Tenant & Keamanan
- **Isolasi Logika Multi-Tenant**: Setiap kueri database secara otomatis menyertakan predikat filter `tenant_id` yang diinjeksi pada layer ORM / middleware dan diperkuat dengan PostgreSQL Row Level Security (RLS).
- **Audit Logging Immutability**: Seluruh mutasi data finansial disimpan dalam tabel append-only log yang tidak dapat diubah atau dihapus (*WORM - Write Once Read Many*), memuat hash SHA-256 transaksi sebelumnya untuk mendeteksi manipulasi audit.
- **Otentikasi & Keamanan Sesi**: Mendukung Multi-Factor Authentication (MFA) via TOTP / WhatsApp OTP untuk peran Owner dan HR/Payroll Admin, proteksi Brute Force rate-limiting, serta *session timeout* 15 menit tanpa aktivitas.

### 6.3 Target Kinerja & Skalabilitas (SLA)
- **Waktu Eksekusi Payroll Engine**: Mampu mengkalkulasi 500 karyawan lengkap dengan komponen lembur, PPh 21 TER, dan 4 BPJS dalam waktu $< 3.5$ detik.
- **Ketersediaan Layanan (*Uptime SLA*)**: Menjamin ketersediaan sistem $\ge 99.9\%$ setiap bulan dengan arsitektur cloud multi-AZ redundan.
- **Waktu Render & Unduh Slip PDF**: Pembuatan dokumen PDF slip gaji terenkripsi $< 500\text{ ms}$ per lembar.

---
*Dokumen Blueprint PRD & Spesifikasi Fungsional ini disusun sebagai acuan teknis definitif dan siap dieksekusi oleh tim Engineering, Product Designer, dan QA CatatGaji.*
