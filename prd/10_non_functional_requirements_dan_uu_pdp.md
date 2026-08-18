# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 10. NON-FUNCTIONAL REQUIREMENTS & KEPATUHAN UU PDP NO. 27/2022

---

### 1. Kepatuhan Hukum UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)

CatatGaji menerapkan prinsip **Privacy by Design and by Default** di seluruh lapisan aplikasi untuk menjamin hak asasi subjek data (pekerja) dan melindungi organisasi penyewa (*tenant*) dari sanksi administratif dan pidana kebocoran data pribadi di Indonesia.

```
+----------------------------------------------------------------------------------------------------+
|                                    PILAR KEPATUHAN UU PDP CATATGAJI                                |
+----------------------------------------------------------------------------------------------------+
| [ 1. DASAR PEMROSESAN SAH ] -> Digital Explicit Consent saat login pertama (Pasal 16 & 20)        |
| [ 2. ENKRIPSI GANDA ]       -> AES-256 GCM (At-Rest) + TLS 1.3 (In-Transit)                        |
| [ 3. MASKING DATA PII ]     -> Penyensoran NIK (3171************) & Rekening Bank (******4567)    |
| [ 4. HAK SUBJEK DATA ]      -> Akses, Koreksi, Portabilitas Data & Hak Penghapusan (Pasal 6-13)    |
| [ 5. RETENSI KEPATUHAN ]    -> Retensi dokumen pajak 5-10 tahun sesuai UU KUP & Pseudonimisasi ID  |
+----------------------------------------------------------------------------------------------------+
```

#### 1.1 Prinsip Pemrosesan Data Pribadi (Pasal 16 & 20)
- **Tujuan Khusus & Terbatas**: Data pribadi pekerja (NIK, NPWP, Rekening Bank, Foto Absensi, Gaji) hanya diproses semata-mata untuk pelaksanaan perjanjian kerja, pembayaran upah, pemotongan pajak PPh 21, dan pendaftaran jaminan sosial BPJS.
- **Persetujuan Eksplisit Digital (*Explicit Consent*)**: Setiap karyawan wajib menyetujui lembar persetujuan pemrosesan data pribadi saat pertama kali masuk ke aplikasi mobile/web portal mandiri.
- **Minimalisasi Data**: Sistem tidak mengumpulkan data pribadi di luar kebutuhan ketenagakerjaan resmi.

#### 1.2 Standar Enkripsi Data At-Rest & In-Transit
- **Data In-Transit**: Seluruh lalu lintas jaringan wajib menggunakan enkripsi **TLS 1.3** dengan konfigurasi cipher suites modern (*Forward Secrecy*). Sambungan HTTP non-aman otomatis dialihkan (*forced HTTPS*).
- **Data At-Rest (Server)**: Penyimpanan database terenkripsi menggunakan **AES-256-GCM**. Kolom paling sensitif (`nik_ktp`, `npwp`, `bank_account_no`) dienkripsi pada layer aplikasi menggunakan *Envelope Encryption* berbasis kunci KMS terisolasi per tenant.
- **Data At-Rest (Lokal/IndexedDB)**: Menerapkan **field-level encryption** dengan Web Crypto API (AES-256-GCM) untuk data finansial dan identitas yang di-cache di perangkat (*offline mode*). Detail implementasi dan struktur Dexie.js dapat dilihat pada Dokumen PRD 07.
- **Dokumen Slip Gaji PDF**: Setiap berkas PDF slip gaji dienkripsi secara independen dengan password PIN rahasia karyawan (default 6 digit tanggal lahir).

#### 1.3 Penyensoran Data Sensitif (PII Masking & Redaction)
- **API Response Masking**: Response API standar menyamarkan digit tengah NIK KTP (`317101********01`) dan nomor rekening bank (`******4567`). Akses unmasking hanya diberikan pada peran berizin khusus (*privileged permission*) dengan pencatatan audit log otomatis.
- **Application Log Filtering**: Seluruh log sistem (Pino/Winston logger) memiliki filter pencegah pencatatan kata kunci sensitif (`password`, `token`, `nik_ktp`, `npwp`, `selfie_base64`, `bank_account_no`).

#### 1.4 Pemenuhan Hak Subjek Data (Data Subject Rights)
1. **Hak Akses & Portabilitas (Pasal 7 & 13)**: Karyawan berhak mengunduh seluruh arsip data diri, riwayat kehadiran, dan slip gaji dalam format JSON/Excel terstruktur.
2. **Hak Koreksi & Pembaruan (Pasal 6)**: Karyawan dapat mengajukan permohonan pembaruan data yang tidak akurat melalui portal ESS.
3. **Hak Penghapusan & Pseudonimisasi (Pasal 8)**: Jika karyawan keluar/resign dan mengajukan *Right to Erasure*, data identitas personal disamarkan (*pseudonymized*), sedangkan data angka agregat penggajian tetap disimpan selama masa retensi wajib perpajakan (10 tahun sesuai UU Ketentuan Umum Perpajakan / KUP).

---

### 2. Kinerja & Skalabilitas Sistem (Performance Requirements)

```
+----------------------------------------------------------------------------------------------------+
|                                    TARGET SERVICE LEVEL OBJECTIVES                                 |
+------------------------------------+------------------------------------+--------------------------+
| Parameter Kinerja                  | Target SLO                         | Mekanisme Optimasi       |
+------------------------------------+------------------------------------+--------------------------+
| **Batch Payroll 500 Karyawan**     | **< 3.0 Detik**                    | Worker Pool BullMQ Paralel|
| **API Response Time (p95)**        | **< 200 ms**                       | Redis Cache & Index Scan |
| **API Response Time (p99)**        | **< 500 ms**                       | Connection Pool PgBouncer|
| **Beban Puncak Clock-In Pagi**     | **5.000 Transaksi / Menit**        | Redis Fast-Queue Ingestion|
| **SLA Ketersediaan Layanan**       | **99.9% Uptime** (Per Bulan)       | Multi-AZ Auto-Failover   |
+------------------------------------+------------------------------------+--------------------------+
```

1. **Komputasi Paralel Penggajian**: Engine penggajian memproses kalkulasi 500 karyawan dalam waktu $< 3$ detik dengan membagi beban ke dalam antrean batch per 50 karyawan per thread CPU.
2. **Latensi API Transaksional**: Endpoint absensi, pengajuan cuti, dan profil pengguna merespons dengan latensi $p95 < 200\text{ ms}$ pada beban normal.
3. **Throughput Lonjakan Pagi**: Mendukung lonjakan absensi masuk kerja pukul 07.45 s.d. 08.15 WIB hingga 5.000 transaksi/menit tanpa penurunan performa.

---

### 3. Ketersediaan Layanan & Disaster Recovery (DR)

#### 3.1 Service Level Agreement (SLA Uptime)
- **Target Ketersediaan**: **99.9% Uptime** setiap bulan (toleransi maksimal downtime tidak terencana $< 43,8$ menit/bulan).
- **Arsitektur Multi-AZ**: Database PostgreSQL dijalankan dengan konfigurasi *High Availability (Primary + Standby Replica)* di zona ketersediaan terpisah (*Availability Zones*) dengan failover otomatis $< 60$ detik.

#### 3.2 Target Pemulihan Bencana (RPO & RTO)
- **Recovery Point Objective (RPO)**: **< 15 Menit**.
  - Menggunakan arsip kontinu PostgreSQL *Write-Ahead Logging (WAL)* yang disimpan di Cloud Storage.
- **Recovery Time Objective (RTO)**: **< 1 Jam**.
  - Seluruh infrastruktur didefinisikan sebagai kode (*Infrastructure as Code / IaC*) menggunakan Terraform dan Helm Charts, memungkinkan pembangunan ulang seluruh klaster dalam waktu kurang dari 60 menit jika terjadi kegagalan total pusat data regional.
- **Strategi Cadangan (Backup Strategy)**: Snapshot database harian otomatis diambil setiap pukul 02.00 WIB dan disimpan di bucket penyimpanan terpisah (*Cross-Region Bucket*) dengan retensi 30 hari.

---

### 4. Keamanan Aplikasi & Pencegahan Serangan Siber (OWASP Top 10)

1. **Pencegahan Injeksi (SQLi / NoSQLi)**: Seluruh kueri database wajib menggunakan parameterized queries / type-safe query builder (Kysely / Prisma) dengan larangan mutlak penggunaan string concatenation mentah.
2. **Proteksi Akses Rusak (Broken Object Level Authorization / BOLA)**: Filter context `tenant_id` dievaluasi di level middleware JWT dan dipaksakan secara deterministik di level PostgreSQL Row-Level Security (RLS).
3. **Pembatasan Laju Permintaan (Rate Limiting)**:
   - Endpoint Publik Login: Maksimal 5 percobaan gagal per 15 menit per IP (mencegah *Brute-force attack*).
   - Endpoint Transaksional Absensi: Maksimal 60 request per menit per user token.
4. **Keamanan Header HTTP**:
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`

#### Content Security Policy (CSP)
Aplikasi wajib mengimplementasikan CSP headers untuk mencegah XSS dan injection attacks:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.catatgaji.id; font-src 'self';
```

CSP diterapkan melalui:
- HTTP response headers pada server
- Meta tag `<meta http-equiv="Content-Security-Policy">` sebagai fallback
- Pelaporan pelanggaran CSP ke endpoint monitoring
