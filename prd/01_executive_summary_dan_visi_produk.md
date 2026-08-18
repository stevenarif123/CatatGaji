# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 01. RINGKASAN EKSEKUTIF, LATAR BELAKANG & MODEL BISNIS SAAS

---

### 1. Ringkasan Eksekutif (Executive Summary)

**CatatGaji** adalah platform *Multi-Tenant Software as a Service (SaaS)* modern yang dirancang khusus untuk mengotomatisasi seluruh proses penggajian (*payroll*), manajemen sumber daya manusia dasar (*Core HRIS*), pencatatan kehadiran presisi tinggi (*GPS Geofencing Attendance*), serta pelaporan kepatuhan hukum ketenagakerjaan dan perpajakan di Indonesia bagi sektor Usaha Mikro, Kecil, dan Menengah (UMKM) hingga korporasi berkembang (*Mid-market Enterprise*).

Didukung oleh mesin kalkulasi (*calculation engine*) yang adaptif dan deterministik, CatatGaji menjamin 100% kepatuhan terhadap seluruh regulasi positif Republik Indonesia yang berlaku, termasuk skema **Tarif Efektif Rata-Rata (TER) PPh 21** berdasarkan **PP No. 58 Tahun 2023** dan **PMK No. 168 Tahun 2023**, 5 program jaminan sosial nasional (**BPJS Ketenagakerjaan & BPJS Kesehatan**), formulasi upah lembur resmi **PP No. 35 Tahun 2021**, Tunjangan Hari Raya (THR) Keagamaan **Permenaker No. 6 Tahun 2016**, uang kompensasi PKWT & pesangon PHK, hingga pemenuhan standar keamanan dan privasi data **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**.

---

### 2. Latar Belakang Masalah (Problem Statement)

Sektor UMKM di Indonesia menyerap lebih dari 97% total tenaga kerja nasional dan menyumbang lebih dari 61% terhadap Produk Domestik Bruto (PDB). Kendati demikian, lebih dari **85% pelaku UMKM di Indonesia masih mengelola operasional penggajian secara manual** menggunakan lembar kerja (*spreadsheet* seperti Microsoft Excel atau Google Sheets). Praktik manual ini menimbulkan sejumlah kerentanan operasional, finansial, dan hukum yang sangat kritis:

```
+----------------------------------------------------------------------------------------------------+
|                                    ANATOMI MASALAH PAYROLL UMKM                                    |
+----------------------------------------------------------------------------------------------------+
| [ REGULASI PAJAK BARU ]   -> Kerumitan PPh 21 TER 2024 (Kategori A, B, C) & Penyesuaian Desember   |
| [ 5 PROGRAM BPJS ]        -> Kesalahan batas plafon upah (JP & Kes) serta 5 kelas tarif risiko JKK |
| [ FORMULA LEMBUR PP 35 ]  -> Rumus bertingkat 1/173 x upah, pengali 1.5x, 2x, 3x, 4x rawan selisih |
| [ HUMAN ERROR EXCEL ]     -> Rumus terhapus/salah referensi sel, keterlambatan pembayaran gaji     |
| [ PELANGGARAN UU PDP ]    -> Slip gaji PDF tanpa password/kertas tercecer melanggar hukum privasi   |
| [ SOFTWARE LEGACY MAHAL ] -> Software HR enterprise terlalu rumit dan mahal (> Rp 20 juta/tahun)  |
+----------------------------------------------------------------------------------------------------+
```

#### 2.1 Kompleksitas Regulasi Pajak Penghasilan PPh 21 TER 2024
Diberlakukannya skema pemotongan PPh 21 bulanan menggunakan Tarif Efektif Rata-rata (TER) per 1 Januari 2024 menciptakan disrupsi administratif bagi staf HR dan keuangan UMKM:
- **Tiga Kategori TER (A, B, C)**: Staf administrasi wajib memetakan status PTKP karyawan (TK/0 s.d. K/3) ke dalam 3 kategori dengan total 125 lapisan tarif persentase (0% hingga 34%).
- **Rekonsiliasi Masa Pajak Terakhir (Desember / Karyawan Berhenti)**: Pada akhir tahun atau saat karyawan keluar, perhitungan wajib beralih kembali ke mekanisme tarif progresif Pasal 17 ayat (1) huruf a UU HPP setelah dikurangi Biaya Jabatan (5% maks Rp 500.000/bulan) dan iuran pensiun. Selisih lebih potong (*overwithholding*) atau kurang potong sering memicu komplain keras dari karyawan dan risiko teguran dari Kantor Pelayanan Pajak (KPP).

#### 2.2 Kerumitan 5 Program Jaminan Sosial BPJS
Perusahaan wajib mengelola potongan dan kontribusi untuk 5 program perlindungan sosial dengan aturan plafon dan pembagian beban yang berbeda:
1. **BPJS Ketenagakerjaan - JKK (0,24% s.d. 1,74%)**: 100% beban pemberi kerja (5 kelas risiko industri).
2. **BPJS Ketenagakerjaan - JKM (0,30%)**: 100% beban pemberi kerja.
3. **BPJS Ketenagakerjaan - JHT (5,70%)**: 3,70% pemberi kerja, 2,00% pekerja.
4. **BPJS Ketenagakerjaan - JP (3,00%)**: 2,00% pemberi kerja, 1,00% pekerja dengan batas upah maksimal tahunan (Plafon 2024: Rp 10.042.300,- yang diperbarui setiap tahun).
5. **BPJS Kesehatan (5,00%)**: 4,00% pemberi kerja, 1,00% pekerja dengan batas upah maksimal Rp 12.000.000,- mencakup 5 anggota keluarga inti.

*Banyak UMKM salah memasukkan premi JKK/JKM dan BPJS Kesehatan perusahaan sebagai penambah penghasilan bruto kena pajak PPh 21, yang mengakibatkan ketidakcocokan pelaporan SPT Masa.*

#### 2.3 Perhitungan Lembur Bertingkat & Hak Ketenagakerjaan (PP No. 35/2021)
Perhitungan lembur resmi menggunakan rumus dasar $\frac{1}{173} \times \text{Upah Sebulan}$ dengan pengali progresif:
- **Hari Kerja Biasa**: Jam ke-1 ($1,5\times$), jam ke-2 dan seterusnya ($2,0\times$).
- **Hari Libur Resmi / Istirahat Mingguan**: Jam ke-1 s.d. ke-7/8 ($2,0\times$), jam ke-8/9 ($3,0\times$), jam ke-9/10/11 ($4,0\times$).
Merekap ratusan jam lembur dari lembaran absensi manual memakan waktu 3–5 hari kerja setiap akhir bulan dengan tingkat kesalahan hitung mencapai lebih dari 15%.

#### 2.4 Kerentanan Privasi & Sanksi Pidana UU PDP No. 27/2022
Distribusi slip gaji menggunakan lembaran kertas atau file PDF tanpa enkripsi kata sandi melalui grup chat WhatsApp rawan diakses pihak ketiga yang tidak berwenang. Berdasarkan UU No. 27/2022, data gaji dan NIK/NPWP merupakan Data Pribadi yang wajib dilindungi dengan enkripsi ketat. Pelanggaran perlindungan data pribadi dapat dikenakan sanksi administratif hingga denda maksimal Rp 4–6 miliar.

#### 2.5 Software HR Legacy Terlalu Mahal & Membingungkan
Software HR/Payroll tingkat korporasi (Enterprise) menetapkan biaya langganan puluhan juta rupiah, biaya implementasi yang mahal, serta ribuan menu yang tidak relevan bagi bisnis skala 5–100 karyawan. Di sisi lain, aplikasi gratisan tidak memiliki mesin pajak yang sesuai dengan regulasi PMK 168/2023.

---

### 3. Visi Produk, Positioning & Value Proposition

#### 3.1 Visi Produk (Product Vision)
> **"Menjadi platform penggajian dan HRIS kepatuhan regulasi paling tepercaya, 100% patuh hukum, dan termudah digunakan bagi 1 juta pelaku usaha dan UMKM di seluruh Indonesia."**

#### 3.2 Positioning Pasar (Market Positioning)
CatatGaji diposisikan sebagai **"Payroll SaaS Khusus Regulasi Indonesia yang Siap Pakai Tanpa Pelatihan Rumit"** — menjembatani jurang antara spreadsheet Excel yang rawan kesalahan dan software enterprise yang terlampau mahal.

```
                          [ BIAYA TINGGI ]
                                 |
                                 |   Software HR Enterprise
                                 |   (SAP, Workday, Talenta)
                                 |   * Fitur berlebih, mahal, implementasi lama
                                 |
    [ SULIT DIGUNAKAN ] ---------+--------- [ MUDAH DIGUNAKAN ]
                                 |
        Spreadsheet Excel /      |   ★ CATATGAJI ★
        Software Offline Bajakan |   * 100% Regulasi RI (TER 2024, BPJS, PP 35)
        * Rawan error, manual    |   * 3-Click Payroll Wizard, Murah, Cloud RLS
                                 |   * Mobile GPS Selfie & Slip Terenkripsi PIN
                                 |
                          [ BIAYA TERJANGKAU ]
```

#### 3.3 Nilai Tambah Utama (Core Value Proposition)
1. **3-Click Payroll Processing**: Memangkas waktu hitung gaji dari 3 hari menjadi kurang dari 5 menit melalui wizard 4 langkah terpandu.
2. **100% Kepatuhan Hukum Otomatis**: Integrasi penuh formula PPh 21 TER 2024, BPJS 5 program, dan lembur PP 35/2021 yang selalu diperbarui secara otomatis di cloud saat regulasi pemerintah berganti tanpa perlu update software manual.
3. **Keamanan Data Standar Perbankan & UU PDP**: Isolasi data multi-tenant dengan PostgreSQL Row-Level Security (RLS), enkripsi AES-256 at-rest, dan slip gaji berproteksi PIN rahasia karyawan.
4. **Distribusi Slip Gaji Multi-Channel Sekali Klik**: Pengiriman massal otomatis via WhatsApp Business API dan Email terenkripsi, serta akses portal mandiri karyawan (ESS).
5. **Ekspor Pajak & Akuntansi Siap Pakai**: Berkas ekspor CSV DJP Online e-Bupot 21/26, Formulir 1721-A1 tahunan, dan jurnal pembukuan akuntansi (Jurnal, Xero, Accurate) yang seimbang (*balanced*).

---

### 4. Target Segmen Pasar & Karakteristik Bisnis

CatatGaji berfokus pada 3 segmen pasar utama di Indonesia:

| Segmen Pasar | Jumlah Karyawan | Karakteristik Operasional | Kebutuhan Utama |
|---|---|---|---|
| **Mikro (Micro Business)** | 1 – 5 Orang | Usaha perorangan, toko kelontong, kedai kopi independen, startup tahap awal. | Aplikasi gratis/sangat murah, hitung gaji & TER otomatis tanpa perlu mengerti rumus pajak, slip gaji PDF simpel. |
| **Kecil (Small Business)** | 6 – 25 Orang | Kafe & Restoran cabang 1-2, klinik kecantikan, kantor konsultan/agensi, bengkel. | Absensi GPS mobile anti-titip absen, lembur shift otomatis, ekspor CSV e-Bupot DJP, distribusi email/WhatsApp slip gaji. |
| **Menengah (Medium Business)** | 26 – 200+ Orang | Ritel jaringan cabang, distributor logistik, manufaktur lokal, outsourcing, hotel butik. | Multi-cabang & multi-departemen, multi-level approval lembur/cuti, integrasi software akuntansi, audit trail forensik, perhitungan pesangon & kompensasi PKWT. |

---

### 5. Model Bisnis Multi-Tenant SaaS & Struktur Paket Langganan

CatatGaji menerapkan model bisnis berbasis **Freemium & Tiered Subscription (B2B SaaS)** dengan opsi penagihan bulanan (*monthly billing*) dan diskon 20% untuk pembayaran tahunan (*annual billing*).

```
+----------------------------------------------------------------------------------------------------+
|                                    STRUKTUR PAKET CATATGAJI                                        |
+------------------------------------+------------------------------------+--------------------------+
| 1. PAKET FREE (GRATIS)             | 2. PAKET STARTER                   | 3. PAKET PRO             |
| Rp 0 / bulan (Selamanya)           | Rp 99.000 / bulan                  | Rp 299.000 / bulan       |
| Maksimal 5 Karyawan                | Maksimal 25 Karyawan               | Hingga 100 Karyawan      |
|                                    | (Tambahan: Rp 5.000/karyawan)      | (Tambahan: Rp 4.000/kary)|
+------------------------------------+------------------------------------+--------------------------+
| 4. PAKET ENTERPRISE CUSTOM (100 - 1000+ Karyawan): Hubungi Sales (Custom SLA & Dedicated Server)   |
+----------------------------------------------------------------------------------------------------+
```

#### 5.1 Matriks Komparasi Paket Langganan

| Fitur / Modul | Free Tier (Rp 0) | Starter (Rp 99.000/bln) | Pro (Rp 299.000/bln) | Enterprise (Custom) |
|---|---|---|---|---|
| **Batas Maksimal Karyawan** | 5 Karyawan | 25 Karyawan | 100 Karyawan | Unlimited (> 100 Karyawan) |
| **Batas Cabang / Outlet** | 1 Cabang | Hingga 3 Cabang | Cabang Tak Terbatas | Cabang Tak Terbatas |
| **Engine PPh 21 TER (Jan–Nov)** | Ya | Ya | Ya | Ya |
| **Rekonsiliasi PPh 21 Des (Ps. 17)** | Dasar | Ya | Ya | Ya (Multi-Entitas) |
| **Kalkulasi 5 Program BPJS** | Ya | Ya | Ya | Ya |
| **Lembur PP 35/2021 & THR** | Standar | Otomatis Penuh | Otomatis Penuh | Custom Formula Shift |
| **Slip Gaji PDF Terproteksi PIN** | Ya (Standar) | Ya (Watermark Logo) | Ya (Kustom Template) | Ya (White-label Brand) |
| **Distribusi Email Slip Gaji** | Manual Download | Otomatis Massal | Otomatis Massal | Otomatis Massal |
| **Distribusi WhatsApp Blast** | Tidak | 50 Pesan/bln | Kuota Penuh (Add-on) | Kuota Dedicated BSP |
| **Absensi Mobile GPS & Selfie** | Tidak (Input Manual) | Ya (Geofencing) | Ya (Anti-Fake GPS) | Ya + Integrasi Biometrik |
| **Import Mesin Fingerprint (CSV)**| Tidak | Ya | Ya | Direct API Sync |
| **Manajemen Cuti & Lembur** | Manual | 1 Level Approval | Multi-Level + Delegasi | Multi-Level Dinamis |
| **Ekspor CSV DJP e-Bupot 21/26** | Ringkasan Layar | Ya (Siap Impor) | Ya (Siap Impor) | Auto-Sync DJP API |
| **Formulir 1721-A1 Tahunan** | Tidak | Ya | Ya (Massal ZIP) | Ya (Massal ZIP) |
| **Ekspor Jurnal Akuntansi** | Tidak | CSV Standar | Mekari/Xero/Accurate | Direct REST Webhook |
| **Audit Trail Log Forensik** | 7 Hari | 30 Hari | 1 Tahun | 10 Tahun (Kepatuhan Audit) |
| **SLA Layanan Uptime** | Best-effort | 99.5% | 99.9% | 99.99% Dedicated Support |

#### 5.2 Metode Pembayaran & Penagihan Lokal (Indonesian Payment Rail)
Sistem tagihan terintegrasi langsung dengan payment gateway berlisensi Bank Indonesia (Midtrans / Xendit):
- **QRIS Dinamis**: Pembayaran instan melalui GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin' Mandiri, dll.
- **Virtual Account (VA)**: BCA, Bank Mandiri, BRI, BNI, Permata, BSI, CIMB Niaga dengan deteksi verifikasi pembayaran otomatis *real-time* (< 5 detik).
- **Kartu Kredit / Debit Online**: Visa, Mastercard, JCB (3D Secure).
- **Faktur Tagihan Pajak (e-Faktur PPN 11%)**: Penerbitan bukti potong faktur pajak resmi otomatis untuk perusahaan BKP.

---

### 6. Dampak Bisnis & Target Kesuksesan (Success Metrics)

Peluncuran CatatGaji ditargetkan mencapai indikator kinerja utama (*Key Performance Indicators*):
1. **Efisiensi Waktu Operasional HR**: Mengurangi 90% waktu pemrosesan payroll bulanan (dari rata-rata 16 jam kerja/bulan menjadi < 1,5 jam kerja/bulan).
2. **Zero Compliance Error**: Menghilangkan 100% kesalahan perhitungan PPh 21 TER dan iuran BPJS pada seluruh tenant aktif.
3. **Retensi & Kepuasan Pelanggan**: Mencapai *Monthly Net Revenue Retention (NRR)* > 115% dan skor kepuasan pengguna (*Customer Satisfaction / CSAT*) > 90%.
4. **Pencegahan Sengketa Hubungan Industrial**: Menghadirkan transparansi 100% atas perhitungan uang lembur, potongan keterlambatan, dan kompensasi PKWT bagi pekerja.
