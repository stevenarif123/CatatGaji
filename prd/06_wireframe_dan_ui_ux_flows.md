# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 06. SPESIFIKASI WIREFRAME & DESAIN UI/UX (10 LAYAR UTAMA)

---

### 1. Standar Desain UI/UX CatatGaji

CatatGaji mengadopsi prinsip desain antarmuka modern yang bersih (*clean*), responsif (*mobile-first for ESS & desktop-optimized for Admin*), berkontras tinggi, dan meminimalkan beban kognitif (*cognitive load*) bagi pengguna non-teknis di lingkungan UMKM.

- **Design System Baseline**: Tailwind CSS v3.4+ & Shadcn UI (Radix UI Primitives).
- **Palet Warna Utama**:
  - *Primary Blue* (`#2563EB` / `blue-600`): Tombol aksi utama, identitas navigasi.
  - *Success Green* (`#16A34A` / `green-600`): Status kehadiran tepat waktu, approval payroll, status terbayar.
  - *Warning Amber* (`#D97706` / `amber-600`): Peringatan anomali lembur, kontrak PKWT akan habis, status pending.
  - *Danger Red* (`#DC2626` / `red-600`): Keterlambatan, penolakan approval, tombol hapus data.
  - *Neutral Slate* (`#0F172A` / `#F8FAFC`): Tipografi teks dan latar belakang halaman.

### Catatan Dark Mode

Aplikasi mendukung dua tema: **Light Mode** (default) dan **Dark Mode** (opsional via Pengaturan).

**Adaptasi Warna untuk Dark Mode:**

| Elemen | Light Mode | Dark Mode |
|--------|-----------|----------|
| Background utama | `#FFFFFF` | `#1A1A2E` |
| Background kartu | `#F8F9FA` | `#16213E` |
| Teks utama | `#1A1A2E` | `#E8E8E8` |
| Teks sekunder | `#6C757D` | `#A0A0B0` |
| Warna primer (aksi) | `#2563EB` | `#3B82F6` |
| Warna sukses (income) | `#16A34A` | `#22C55E` |
| Border/divider | `#E5E7EB` | `#2A2A4A` |

**Prinsip Dark Mode:**
- Kontras teks minimum 4.5:1 (WCAG AA) dipertahankan di kedua tema
- Grafik dan chart menggunakan warna yang lebih cerah (higher saturation) di dark mode
- Tidak menggunakan pure black (`#000000`) sebagai background — gunakan dark navy untuk mengurangi eye strain
- Transisi antar tema menggunakan animasi fade 200ms

---

### 2. Spesifikasi 10 Layar Utama

---

#### LAYAR 1: DASHBOARD UTAMA (EXECUTIVE & HR VIEW)

Layar utama yang menyajikan ringkasan metrik penggajian bulanan, indikator kehadiran, dan tugas-tugas persetujuan mendesak.

```
+----------------------------------------------------------------------------------------------------+
| [CatatGaji Logo]  PT Maju Bersama Logistik (Cabang Semua v)           [Cari...] [Notif (3)] [Profil Sari v]|
+----------------------------------------------------------------------------------------------------+
| [Navigasi Sidebar] | RINGKASAN EKSEKUTIF - AGUSTUS 2026                         [+ Proses Gaji Baru] |
| - Dashboard        +-------------------+-------------------+-------------------+-------------------+
| - Karyawan         | TOTAL PAYROLL     | TOTAL LEMBUR      | TOTAL PAJAK PPh21 | KARYAWAN AKTIF    |
| - Absensi & Shift  | Rp 245.850.000    | Rp 18.420.000     | Rp 6.120.000      | 55 Orang          |
| - Cuti & Lembur    | (▲ 4.2% vs Jul)   | (▲ 8.5% - Waspada)| (55 Bukti Potong) | (3 Kontrak Habis) |
| - Payroll Wizard   +-------------------+-------------------+-------------------+-------------------+
| - Laporan Pajak    |                                                                               |
| - Jurnal Keuangan  | [ TREN BIAYA GAJI 6 BULAN TERAKHIR ]   | [ PERMINTAAN APPROVAL MENUNGGU (4) ]  |
| - Pengaturan       | [ Graf Area: Pokok, Lembur, BPJS   ]   | [x] SPKL Lembur: Budi (Gudang) - 3 Jam|
|                    | [ Mar | Apr | Mei | Jun | Jul | Agu]   | [x] Cuti Tahunan: Siti (2 Hari)       |
|                    |                                        | [x] Kasbon: Rudi (Rp 1.500.000)       |
|                    | [ STATUS CUT-OFF ABSENSI: 3 HARI LAGI] | [Tinjau Semua Approval ->]            |
+--------------------+----------------------------------------+---------------------------------------+
```

- **Komponen UI**:
  - 4 Kartu Metrik KPI (*Metric Cards*) dengan indikator kenaikan/penurunan persentase.
  - Grafik Area Interaktif (*Interactive Area Chart*) untuk tren komponen gaji bulanan.
  - Widget *Actionable Approvals* dengan tombol cepat *Approve / Reject*.
  - Widget Peringatan Masa Kontrak PKWT & Jadwal Cut-off Payroll.
- **User Flow**:
  - Klik kartu metrik $\rightarrow$ Menavigasi ke halaman detail terkait (contoh: Klik "Total Lembur" $\rightarrow$ Layar Rekap Lembur).
  - Klik tombol "+ Proses Gaji Baru" $\rightarrow$ Membuka Layar 5 (Payroll Wizard).

---

#### LAYAR 2: MASTER DATA KARYAWAN (LIST, FILTER & FORM MULTI-TAB)

Layar pengelolaan direktori seluruh pekerja dalam organisasi tenant.

```
+----------------------------------------------------------------------------------------------------+
| MASTER DATA KARYAWAN (55)               [Import Excel] [Export CSV] [+ Tambah Karyawan Baru]        |
+----------------------------------------------------------------------------------------------------+
| [Cari Nama/NIK/NIP...] [Cabang: Semua v] [Dept: Semua v] [Status: Aktif v] [Pajak: Semua v] [Reset]|
+----+---------------+---------------------+---------------+----------+---------+----------+---------+
| No | NIP / NIK     | Nama Karyawan       | Cabang / Dept | Status   | PTKP/TER| Gaji Pokok| Aksi    |
+----+---------------+---------------------+---------------+----------+---------+----------+---------+
| 1  | NIP-001       | Ahmad Fauzi         | Jakarta / IT  | PKWTT    | K/1 (B) | Rp 9.0 Jt| [Edit]..|
|    | 31710123...   | ahmad@perusahaan.com| Full Time     | Aktif    | Gross   | (Masked) | [Slip]  |
| 2  | NIP-002       | Budi Prasetyo       | Tebet / Kafe  | PKWT     | TK/0 (A)| Rp 5.2 Jt| [Edit]..|
|    | 32750211...   | budi@perusahaan.com | Shift Pagi    | Aktif    | Gross   | (Masked) | [Slip]  |
+----+---------------+---------------------+---------------+----------+---------+----------+---------+
| Menampilkan 1-20 dari 55 Karyawan                                  [< Sebelumnya] [1] [2] [3] [Selanjutnya >]|
+----------------------------------------------------------------------------------------------------+

[MODAL / SLIDE-OVER: FORM TAMBAH KARYAWAN BARU]
+----------------------------------------------------------------------------------------------------+
| TAB 1: DATA PERSONAL  |  TAB 2: KEPEGAWAIAN  |  TAB 3: PAJAK & BPJS  |  TAB 4: STRUKTUR GAJI & BANK|
+----------------------------------------------------------------------------------------------------+
| * Nama Lengkap (KTP) : [ Ahmad Fauzi                            ]                                  |
| * NIK KTP (16 Digit) : [ 3171012304900001                       ] (Tervalidasi V)                  |
| * Tempat / Tgl Lahir : [ Jakarta            ] [ 15 / 04 / 1990 ]                                   |
| * Jenis Kelamin      : (o) Laki-laki    ( ) Perempuan                                              |
| * Email & No WhatsApp: [ ahmad@email.com    ] [ 081234567890   ]                                   |
|                                                                                                    |
|                                     [Batal]  [Simpan Draft]  [Lanjut: Kepegawaian ->]              |
+----------------------------------------------------------------------------------------------------+
```

- **Komponen UI**:
  - Filter Bar Lanjutan (Pencarian multi-parameter, dropdown Cabang, Departemen, Status PTKP).
  - Data Table Responsif dengan fitur masking gaji pokok (dapat dibuka dengan izin khusus).
  - Modal Form Multi-Tab (Personal, Kepegawaian, Pajak & BPJS, Kompensasi & Rekening Bank).
- **User Flow**:
  - Klik "Tambah Karyawan" $\rightarrow$ Isi tab secara berurutan $\rightarrow$ Validasi NIK/NPWP instan $\rightarrow$ Simpan $\rightarrow$ Data masuk ke database dengan session RLS.

---

#### LAYAR 3: MANAJEMEN ABSENSI & REKAP KEHADIRAN

Layar visualisasi status kehadiran harian, keterlambatan, absensi GPS, dan rekapitulasi bulanan.

```
+----------------------------------------------------------------------------------------------------+
| MANAJEMEN ABSENSI & KEHADIRAN                      [Bulan: Agustus 2026 v] [Cabang: Jakarta Pusat v] |
+----------------------------------------------------------------------------------------------------+
| (o) Tampilan Kalender Rekap   ( ) Tampilan Log Transaksi Harian   ( ) Tampilan Peta Geofence       |
+----------------------------------------------------------------------------------------------------+
| [Ringkasan Bulan Ini: Hadir Tepat Waktu: 94.2% | Terlambat: 4.8% | Cuti/Izin: 1.0% | Alfa: 0.0%]  |
+----+----------------------+---------+---------+---------+---------+---------+---------+----------+
| No | Nama Karyawan (Dept) | 1 Agu J | 2 Agu S | 3 Agu M | 4 Agu S | 5 Agu S | ...     | Total H/T|
+----+----------------------+---------+---------+---------+---------+---------+---------+----------+
| 1  | Ahmad Fauzi (IT)     | [ V ]   | [ LIB ] | [ LIB ] | [ V ]   | [T-15m] | ...     | 21 H / 1T|
| 2  | Budi Prasetyo (Kafe) | [ V ]   | [ V ]   | [ LIB ] | [ CUTI] | [ V ]   | ...     | 20 H / 0T|
+----+----------------------+---------+---------+---------+---------+---------+---------+----------+
| Legenda: [ V ] Hadir Tepat Waktu | [T-Xm] Terlambat X Menit | [CUTI] Cuti Sah | [ALFA] Tanpa Keterangan |
|                                                                                                    |
| [ DETAIL LOG TRANSAKSI KLIK KARYAWAN: Budi Prasetyo - 1 Agustus 2026 ]                             |
| - Jam Masuk : 06:58 WIB (Tepat Waktu) | Foto Selfie : [Lihat Foto V] | Jarak GPS : 12m dari Outlet |
| - Jam Pulang: 15:05 WIB (Lengkap)     | Total Jam   : 8.1 Jam        | Status    : Sah / Verified  |
+----------------------------------------------------------------------------------------------------+
```

- **Komponen UI**:
  - Matriks Kalender Absensi Bulanan dengan kode warna status interaktif.
  - Panel Drawer Detail Log Kehadiran (menampilkan foto selfie, titik GPS, dan verifikasi radius).
  - Tombol Ekspor Rekap Kehadiran (Excel/PDF).
- **User Flow**:
  - Klik sel tanggal merah/terlambat $\rightarrow$ Membuka drawer rincian log verifikasi selfie dan koordinat GPS.

---

#### LAYAR 4: PENGAJUAN & APPROVAL LEMBUR / CUTI

Layar sentral bagi atasan dan Admin HR untuk meninjau dan mengeksekusi persetujuan lembur dan cuti.

```
+----------------------------------------------------------------------------------------------------+
| MANAJEMEN CUTI & LEMBUR                                    [+ Ajukan SPKL Lembur] [+ Ajukan Cuti]  |
+----------------------------------------------------------------------------------------------------+
| [TAB: Menunggu Approval (4)] | [TAB: Riwayat Lembur Disetujui] | [TAB: Riwayat Cuti & Saldo]        |
+----------------------------------------------------------------------------------------------------+
| DAFTAR PENGAJUAN MENUNGGU TINDAKAN ANDA                                                            |
|                                                                                                    |
| 1. [LEMBUR - SPKL/202608/005]  Diajukan: 17 Agu 2026, 14:00 WIB                                    |
|    - Karyawan   : Budi Prasetyo (Barista - Cabang Tebet)                                           |
|    - Tanggal    : 17 Agustus 2026 (Hari Libur Nasional Kemerdekaan RI)                             |
|    - Durasi     : 4 Jam (16:00 - 20:00 WIB) | Tugas: Operasional Lonjakan Pelanggan Liburan        |
|    - Hitungan   : Hari Libur (4 Jam x 2.0x = 8 Jam Efektif Upah Lembur)                            |
|    - Estimasi Rp: Rp 240.000,-                                                                     |
|    [ Tolak Pengajuan ]                                                  [ Setujui Lembur (Approve) ]|
| -------------------------------------------------------------------------------------------------- |
| 2. [CUTI TAHUNAN]  Diajukan: 16 Agu 2026, 09:30 WIB                                                |
|    - Karyawan   : Siti Rahmawati (HR Dept)                                                         |
|    - Tanggal    : 24 Agu 2026 s.d. 25 Agu 2026 (2 Hari Kerja)                                      |
|    - Saldo Cuti : 8 Hari Tersisa (Sisa setelah cuti: 6 Hari)                                       |
|    - Alasan     : Keperluan keluarga di luar kota                                                  |
|    [ Tolak Pengajuan ]                                                  [ Setujui Cuti (Approve) ]  |
+----------------------------------------------------------------------------------------------------+
```

- **Komponen UI**:
  - Tab Switcher (Pending, History Lembur, History Cuti).
  - Kartu Pengajuan Komparatif dengan kalkulasi otomatis jam efektif dan estimasi biaya lembur PP 35/2021.
  - Dialog Modal Penolakan (wajib mengisi alasan penolakan).
- **User Flow**:
  - Klik "Setujui Lembur" $\rightarrow$ Status berubah menjadi Disetujui $\rightarrow$ Jam lembur otomatis tersinkronisasi ke draft payroll periode berjalan.

---

#### LAYAR 5: WIZARD PROSES GAJI BULANAN (4-STEP GUIDED WIZARD)

Layar alur terpandu 4 langkah yang memandu Admin HR menyelesaikan penggajian bulanan tanpa risiko kesalahan.

```
+----------------------------------------------------------------------------------------------------+
| PROSES PENGGAJIAN: PERIODE AGUSTUS 2026 (Cut-off: 25 Agu | Bayar: 28 Agu)                          |
+----------------------------------------------------------------------------------------------------+
| (1) Rekap Absensi [V]  ==>  (2) Lembur & Tunjangan [V]  ==>  (3) Pajak & BPJS [V]  ==>  (4) Review & Submit |
+----------------------------------------------------------------------------------------------------+
| LANGKAH 3 DARI 4: KALKULASI PPh 21 TER & 5 PROGRAM BPJS                                           |
|                                                                                                    |
| [Pemberitahuan: Seluruh formula kalkulasi menggunakan regulasi resmi PMK 168/2023 & PP 58/2023]    |
|                                                                                                    |
| Total Karyawan Diproses : 55 Orang | Metode Pemotongan: Gross (Default)                            |
+----+----------------------+---------------+---------------+---------------+-----------+--------+
| No | Nama Karyawan        | Bruto Pajak   | Kategori TER  | Tarif TER (%) | PPh 21 Rp | BPJS Rp|
+----+----------------------+---------------+---------------+---------------+-----------+--------+
| 1  | Ahmad Fauzi (K/1)    | Rp 10.850.000 | TER B         | 1.50%         | Rp 162.750| Rp 386k|
| 2  | Budi Prasetyo (TK/0) | Rp  5.440.000 | TER A         | 0.25%         | Rp  13.600| Rp 205k|
| 3  | Siti Rahmawati (TK/0)| Rp  6.500.000 | TER A         | 0.75%         | Rp  48.750| Rp 245k|
+----+----------------------+---------------+---------------+---------------+-----------+--------+
| Menampilkan 1-3 dari 55 Karyawan                                                                   |
| Total PPh 21 Terutang Periode Ini: Rp 6.120.000 | Total BPJS Karyawan: Rp 8.450.000                |
|                                                                                                    |
| [< Kembali ke Langkah 2]                                           [Lanjut: Ringkasan Akhir ->]    |
+----------------------------------------------------------------------------------------------------+
```

- **Komponen UI**:
  - Stepper Navigasi Linear (Indikator status langkah 1 s.d. 4).
  - Tabel Kalkulasi Real-time dengan rincian kolom Bruto Pajak, Kategori TER, Tarif %, dan Nilai Potongan.
  - Validasi *Pre-flight Checker* yang mendeteksi data karyawan yang belum lengkap NIK/PTKP.
- **User Flow**:
  - Langkah 1 (Kunci Kehadiran) $\rightarrow$ Langkah 2 (Validasi Lembur & Bonus) $\rightarrow$ Langkah 3 (Kalkulasi Pajak/BPJS) $\rightarrow$ Langkah 4 (Submit ke Pemilik Usaha).

---

#### LAYAR 6: DETAIL PAYROLL RUN & REVIEW GAJI PER KARYAWAN

Layar peninjauan rincian kompensasi mendalam per individu sebelum proses finalisasi.

```
+----------------------------------------------------------------------------------------------------+
| DETAIL PAYROLL RUN #PR-202608-01 (Status: REVIEW)                          [Cetak Draft] [Batal]   |
+----------------------------------------------------------------------------------------------------+
| RINCIAN GAJI: Ahmad Fauzi | NIP-001 | Software Engineer | Status: PKWTT (Tetap) | PTKP: K/1        |
+----------------------------------------------------+-----------------------------------------------+
| KOMPONEN PENDAPATAN (EARNINGS)                     | KOMPONEN POTONGAN (DEDUCTIONS)                |
| - Gaji Pokok                     : Rp  9.000.000,00| - PPh 21 (TER Kategori B 1.50%) : Rp   162.750|
| - Tunjangan Jabatan (Tetap)      : Rp  1.500.000,00| - BPJS TK - JHT (2.00%)        : Rp   210.000|
| - Tunjangan Transport (21 Hari)  : Rp    525.000,00| - BPJS TK - JP (1.00%)         : Rp    71.200|
| - Upah Lembur PP 35/2021 (3.5 Jam): Rp   212.427,00| - BPJS Kesehatan (1.00%)       : Rp   105.000|
| - Bonus Performa                 : Rp    500.000,00| - Potongan Keterlambatan (1x)  : Rp    25.000|
|                                                    | - Angsuran Kasbon              : Rp         0|
+----------------------------------------------------+-----------------------------------------------+
| TOTAL PENDAPATAN KOTOR (GROSS)   : Rp 11.737.427,00| TOTAL POTONGAN KARYAWAN        : Rp   573.950|
+----------------------------------------------------+-----------------------------------------------+
| TAKE HOME PAY BERSIH (DITRANSFER): Rp 11.163.477,00 (Terbilang: Sebelas Juta Seratus Enam Puluh...)|
+----------------------------------------------------+-----------------------------------------------+
| IURAN DITANGGUNG PERUSAHAAN (BENEFIT):                                                             |
| - BPJS TK JHT (3.7%): Rp 388.500 | JKK (0.54%): Rp 56.700 | JKM (0.3%): Rp 31.500 | JP (2%): Rp 142.400|
| - BPJS Kesehatan (4.0%): Rp 420.000 | Total Beban Benefit Perusahaan: Rp 1.039.100,00               |
+----------------------------------------------------------------------------------------------------+
```

- **Komponen UI**:
  - Kolom Ganda Komparatif (Pendapatan Kotor vs Potongan Karyawan).
  - Kotak Penegas Take Home Pay dengan angka besar dan teks terbilang rupiah resmi.
  - Kartu Transparansi Beban Perusahaan (*Employer Benefit Cost*).

---

#### LAYAR 7: TEMPLATE & PREVIEW SLIP GAJI DIGITAL (WEB & PDF)

Layar pratinjau dokumen slip gaji berstandar UU PDP dengan simulasi proteksi password PIN.

```
+----------------------------------------------------------------------------------------------------+
| PRATINJAU SLIP GAJI DIGITAL (PDF VIEWER)                     [Download PDF] [Kirim WhatsApp] [Kirim Email]|
+----------------------------------------------------------------------------------------------------+
|  +-----------------------------------------------------------------------------------------------+ |
|  |  PT MAJU BERSAMA LOGISTIK                                          SLIP GAJI RESMI            | |
|  |  Jl. Raya Cikarang No. 88, Bekasi                                  Periode: Agustus 2026      | |
|  +-----------------------------------------------------------------------------------------------+ |
|  |  Nama Karyawan : Budi Prasetyo                  NIP / Jabatan  : NIP-002 / Barista Senior     | |
|  |  Cabang / Dept  : Tebet / Operasional           Status PTKP    : TK/0 (TER Kategori A)        | |
|  |  Tanggal Bayar : 28 Agustus 2026               No. Rekening   : BCA - ******4567             | |
|  +-----------------------------------------------+-----------------------------------------------+ |
|  |  RINCIAN PENDAPATAN (Rp)                      |  RINCIAN POTONGAN (Rp)                        | |
|  |  1. Gaji Pokok                :  5.000.000,00 |  1. PPh 21 (TER A 0.25%)      :     13.600,00 | |
|  |  2. Tunjangan Kehadiran       :    400.000,00 |  2. BPJS TK JHT (2.0%)        :    100.000,00 | |
|  |  3. Upah Lembur (PP 35/2021)  :    240.000,00 |  3. BPJS TK JP (1.0%)         :     50.000,00 | |
|  |                                               |  4. BPJS Kesehatan (1.0%)     :     50.000,00 | |
|  +-----------------------------------------------+-----------------------------------------------+ |
|  |  TOTAL PENDAPATAN (A)         :  5.640.000,00 |  TOTAL POTONGAN (B)           :    213.600,00 | |
|  +-----------------------------------------------+-----------------------------------------------+ |
|  |  TAKE HOME PAY BERSIH (A - B) : Rp 5.426.400,00                                               | |
|  |  Terbilang: Lima Juta Empat Ratus Dua Puluh Enam Ribu Empat Ratus Rupiah                      | |
|  +-----------------------------------------------------------------------------------------------+ |
|  |  [QR CODE VERIFIKASI]  Dokumen ini sah & dienkripsi sesuai UU No. 27/2022 PDP.                | |
|  |  PIN Pembuka PDF     : 6 Digit Tanggal Lahir (DDMMYY)                                         | |
|  +-----------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

---

#### LAYAR 8: MODUL PAJAK & EKSPOR DJP / BPJS

Layar manajemen kepatuhan perpajakan dan jaminan sosial untuk Akuntan dan Finance.

```
+----------------------------------------------------------------------------------------------------+
| MODUL PAJAK & KEPATUHAN REGULASI                             [Tahun Pajak: 2026 v] [Masa: Agustus v]|
+----------------------------------------------------------------------------------------------------+
| [TAB: PPh 21 e-Bupot DJP] | [TAB: Formulir 1721-A1 Tahunan] | [TAB: BPJS Ketenagakerjaan] | [BPJS Kes]|
+----------------------------------------------------------------------------------------------------+
| EKSPOR BERKAS e-BUPOT 21/26 DJP ONLINE (Masa Agustus 2026)                                         |
|                                                                                                    |
| Ringkasan Pajak Masa Ini:                                                                          |
| - Jumlah Wajib Pajak Penerima Penghasilan : 55 Orang                                               |
| - Total Penghasilan Bruto Kena Pajak      : Rp 245.850.000,00                                      |
| - Total PPh 21 yang Dipotong              : Rp   6.120.000,00                                      |
|                                                                                                    |
| Pengaturan Format Ekspor:                                                                          |
| - Format Delimiter : (o) Koma ( , )     ( ) Titik Koma ( ; )                                       |
| - Pengelompokan    : (o) Gabung Pegawai Tetap & Tidak Tetap   ( ) Pisahkan File                    |
|                                                                                                    |
| [ Unduh File CSV e-Bupot DJP ]     [ Unduh Rekap Bukti Potong PDF ]     [ Validasi Format CSV ]    |
+----------------------------------------------------------------------------------------------------+
```

---

#### LAYAR 9: PENGATURAN PERUSAHAAN & KEBIJAKAN GAJI (TENANT SETTINGS)

Layar konfigurasi profil entitas usaha, koordinat cabang, tarif JKK, dan integrasi payment gateway.

```
+----------------------------------------------------------------------------------------------------+
| PENGATURAN PERUSAHAAN & KEBIJAKAN SISTEM                                     [Simpan Perubahan]    |
+----------------------------------------------------------------------------------------------------+
| [TAB: Profil Usaha] | [TAB: Cabang & GPS] | [TAB: Kebijakan Gaji] | [TAB: Role RBAC] | [TAB: Billing]|
+----------------------------------------------------------------------------------------------------+
| PENGATURAN KEBIJAKAN PENGGAJIAN & REGULASI:                                                        |
|                                                                                                    |
| * Tanggal Cut-off Absensi Bulanan : [ Tanggal 25 setiap bulan v ]                                   |
| * Tanggal Pembayaran Gaji (Payday): [ Tanggal 28 setiap bulan v ]                                   |
| * Hari Kerja Standar Per Minggu   : (o) 5 Hari (8 Jam/hari)   ( ) 6 Hari (7 Jam/hari)              |
| * Tingkat Risiko JKK BPJS TK      : [ Tingkat 2 - Risiko Rendah (0.54%)                       v ]  |
| * Toleransi Keterlambatan (Grace) : [ 15 Menit                                                v ]  |
| * Skema Default PPh 21 Karyawan   : [ GROSS (Karyawan Menanggung Pajak)                       v ]  |
| * Kebijakan Pembulatan Gaji Bersih: [ Pembulatan ke Atas Ribuan (Ceil Rp 1.000)               v ]  |
| * Proteksi PDF Slip Gaji          : [x] Wajib Password PIN Tanggal Lahir (Kepatuhan UU PDP)         |
+----------------------------------------------------------------------------------------------------+
```

---

#### LAYAR 10: PORTAL KARYAWAN ESS (MOBILE VIEW / RESPONSIVE PWA)

Layar antarmuka mandiri bagi pekerja yang dioptimalkan untuk perangkat ponsel pintar (*smartphone*).

```
+------------------------------------+
| 08:30                [4G] [Battery]|
| CatatGaji ESS      [Notif 1] [Foto]|
+------------------------------------+
| Halo, Budi Prasetyo!               |
| Barista Senior - Cabang Tebet      |
|                                    |
| +--------------------------------+ |
| | JAM KERJA HARI INI             | |
| | Shift Pagi : 07:00 - 15:00 WIB | |
| | Status     : SUDAH CLOCK-IN    | |
| | Jam Masuk  : 06:58 WIB (Tepat) | |
| +--------------------------------+ |
|                                    |
| [ TOMBOL: CLOCK-OUT PULANG ]       |
| (Radius Kantor Terverifikasi: 15m) |
|                                    |
| MENU CEPAT KARYAWAN:               |
| +----------------+----------------+|
| | [ Slip Gaji ]  | [ Ajukan Cuti] ||
| | Agu: Rp 5.4 Jt | Sisa: 8 Hari   ||
| +----------------+----------------+|
| | [ Ajukan SPKL] | [ Riwayat Abs] ||
| | Lembur Online  | Cek Presensi   ||
| +----------------+----------------+|
|                                    |
| GAJI BULAN LALU (JULI 2026):       |
| Take Home Pay : Rp 5.380.000,-     |
| [ Unduh PDF Slip Gaji (PIN) -> ]   |
|                                    |
| [Beranda] [Absensi] [Cuti] [Akun]  |
+------------------------------------+
```

- **Komponen UI**:
  - Header Personalisasi Karyawan.
  - Kartu Status Shift Hari Ini & Tombol Clock-In/Clock-Out Satu Sentuhan (*Single-Tap GPS Action*).
  - Grid Menu Pintas ESS (*Quick Action Grid*).
  - Kartu Ringkasan Gaji Terakhir dengan tombol instan unduh PDF.
  - Bottom Navigation Bar (Home, Presensi, Cuti/Lembur, Akun Profil).

---

### Empty States (Tampilan Kosong)

Desain empty state sangat penting untuk pengalaman pengguna baru (first-time user). Setiap layar utama harus memiliki tampilan kosong yang informatif dan mengajak aksi:

#### Layar Pencatatan Gaji (Kosong)
```
┌─────────────────────────┐
│                         │
│     📝                  │
│     [Ilustrasi buku     │
│      catatan kosong]    │
│                         │
│  "Belum ada catatan     │
│   gaji. Mulai catat     │
│   penghasilan pertama   │
│   Anda!"                │
│                         │
│  [ + Catat Gaji Baru ]  │
│                         │
└─────────────────────────┘
```

#### Layar Riwayat (Kosong)
```
┌─────────────────────────┐
│                         │
│     📋                  │
│     [Ilustrasi timeline │
│      kosong]            │
│                         │
│  "Riwayat gaji akan     │
│   muncul di sini        │
│   setelah Anda mulai    │
│   mencatat."            │
│                         │
│  [ Mulai Mencatat → ]   │
│                         │
└─────────────────────────┘
```

#### Layar Ringkasan Bulanan (Kosong)
```
┌─────────────────────────┐
│  Ringkasan: Agustus '24 │
│                         │
│     📊                  │
│     [Ilustrasi grafik   │
│      kosong]            │
│                         │
│  "Belum ada data untuk  │
│   bulan ini. Catat gaji │
│   untuk melihat         │
│   ringkasan."           │
│                         │
│  [ + Catat Gaji ]       │
│                         │
└─────────────────────────┘
```

#### Layar Multi-Employer (Kosong)
```
┌─────────────────────────┐
│  Pemberi Kerja          │
│                         │
│     🏢                  │
│     [Ilustrasi gedung   │
│      kosong]            │
│                         │
│  "Tambahkan pemberi     │
│   kerja untuk melacak   │
│   penghasilan dari      │
│   berbagai sumber."     │
│                         │
│  [ + Tambah Pemberi     │
│      Kerja ]            │
│                         │
└─────────────────────────┘
```

**Prinsip Empty State:**
- Gunakan ilustrasi sederhana (ikon + teks) yang relevan dengan konteks halaman
- Sertakan **Call-to-Action (CTA)** yang jelas mengarah ke aksi pertama
- Teks menggunakan bahasa yang ramah dan encouraging, bukan teknis
- Warna CTA menggunakan warna aksi primer (primary color)

