# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 09. REKOMENDASI PLATFORM & EVALUASI TECH STACK

---

### 1. Analisis Trade-Off Platform (Web, Mobile, Desktop)

Pemilihan platform teknologi untuk CatatGaji didasarkan pada kebutuhan kinerja komputasi tinggi, kemudahan adopsi bagi pengguna UMKM, keamanan data multi-tenant, dan efisiensi biaya pengembangan jangka panjang.

```
+----------------------------------------------------------------------------------------------------+
|                                    RINGKASAN KEPUTUSAN PLATFORM                                    |
+-------------------+------------------------------------+-------------------------------------------+
| Layer             | Pilihan Arsitektur Terpilih        | Rationale Utama                           |
+-------------------+------------------------------------+-------------------------------------------+
| **Frontend Web**  | Vite 6+ (React 19, TypeScript)     | Bundle kecil (~50-80KB), build cepat,     |
|                   | + Tailwind CSS + Shadcn UI         | local-first PWA optimal.                  |
| **Mobile ESS**    | React Native / Expo (TypeScript)   | Akses GPS presisi, anti-fake location,    |
|                   |                                    | sharing kode validasi tipe dengan web.    |
| **Desktop**       | Web-First Responsive (PWA)         | Tanpa instalasi OS, hemat biaya rilis.    |
| **Backend Core**  | Node.js (NestJS/Fastify) + Worker  | Modularity enterprise, performa async I/O.|
| **Database**      | PostgreSQL 16+ with RLS            | Native Row-Level Security, ACID, JSONB.   |
| **Infrastruktur** | Cloud Jakarta (GCP/AWS Jakarta)    | Kedaulatan data hukum PP 71 & UU PDP.     |
+-------------------+------------------------------------+-------------------------------------------+
```

---

#### 1.1 Evaluasi Frontend Web & Desktop

**Frontend Framework**: Vite 6+ dengan React 19 (TypeScript)

**Alasan Perubahan**: Next.js membawa overhead SSR/SSG yang tidak dibutuhkan untuk aplikasi local-first ini. Mayoritas halaman bersifat client-side dynamic. Vite menghasilkan bundle yang jauh lebih kecil (~50-80KB vs ~200-300KB), build time lebih cepat, dan konfigurasi lebih sederhana.

**Alternatif yang dipertimbangkan**:
- Next.js (ditolak karena overhead)
- Remix (terlalu server-centric)
- plain React + Webpack (build config terlalu manual)

**PWA Tooling**: `vite-plugin-pwa` + Workbox

**Keputusan Teknis**: **Vite 6+ (React 19, TypeScript, Tailwind CSS, Shadcn UI)** ditetapkan sebagai standar frontend web resmi CatatGaji. Ekosistem juga mencakup Zustand, Dexie.js, Recharts, jsPDF, Papa Parse, Jest/Playwright, Supabase, dan Vercel.

#### Strategi Optimasi Bundle Size
Target: < 5MB total installed PWA size
- Lazy loading untuk modul berat (Recharts, jsPDF) via `React.lazy()` dan `Suspense`
- Tree-shaking otomatis oleh Vite (Rollup-based)
- Monitoring bundle size dengan `rollup-plugin-visualizer` di setiap PR
- Code splitting per route menggunakan React Router lazy routes

---

#### 1.2 Evaluasi Mobile Application (Employee Self-Service)

| Dimensi Evaluasi | Opsi 1: React Native / Expo (TypeScript) | Opsi 2: Flutter (Dart) | Opsi 3: Progressive Web App (PWA Mobile) |
|---|---|---|---|
| **Akurasi GPS & Anti-Spoofing** | **Tinggi**: Didukung library native `expo-location` dan deteksi fake GPS mock location. | **Sangat Tinggi**: Akses native hardware level engine. | **Rendah**: Browser mobile rentan dimanipulasi dengan browser dev tools. |
| **Akses Kamera Langsung (Selfie)** | **Tinggi**: `react-native-vision-camera` mendukung pemrosesan liveness 60fps. | **Tinggi**: Plugin kamera native lengkap. | **Sedang**: Bergantung pada implementasi WebRTC peramban vendor HP. |
| **Peluang Sharing Kode (Code Reuse)** | **Maksimal (> 70%)**: Memanfaatkan validasi Zod, formatting rupiah, dan tipe TypeScript dari web. | **Nol (0%)**: Codebase Dart terpisah total dari ekosistem web JS. | **100%**: Codebase web yang sama. |
| **Kecepatan Update (OTA Updates)**| **Instan**: Expo EAS Update merilis hotfix instan tanpa antre review App Store / Play Store. | **Lambat**: Wajib submit binary baru tiap perbaikan bug. | **Instan**: Refresh browser. |

**Keputusan Teknis**: **React Native (Expo)** ditetapkan sebagai platform aplikasi mobile mandiri karyawan (ESS).

---

### 2. Evaluasi Backend Engine, Worker & Database

```
+----------------------------------------------------------------------------------------------------+
|                                    ARSITEKTUR BACKEND CATATGAJI                                    |
+----------------------------------------------------------------------------------------------------+
|  [ INGRESS & API GATEWAY ]  -> Traefik / Nginx Reverse Proxy (TLS 1.3 + Rate Limiter)               |
|                                                                                                    |
|  [ PRIMARY API SERVICE ]    -> Node.js (NestJS / Fastify + TypeScript)                             |
|                                * REST Controller, Auth JWT, RLS Context Injector                   |
|                                * Type-Safe Database Access via Prisma / Kysely                     |
|                                                                                                    |
|  [ BATCH CALCULATION WORKER]-> BullMQ Worker Pool (Redis 7.2)                                      |
|                                * Paralel 500 Karyawan < 3 detik (50 chunk/worker)                  |
|                                * PDF Compiler Engine (Chromium Puppeteer Headless)                 |
|                                                                                                    |
|  [ DATABASE & STORAGE ]     -> PostgreSQL 16+ (Multi-Tenant RLS + JSONB Snapshot)                  |
|                                S3-Compatible Object Storage (AES-256 Encrypted PDF)                |
+----------------------------------------------------------------------------------------------------+
```

#### 2.1 Backend API Engine
- **Framework**: **Node.js (NestJS / Fastify + TypeScript)**.
  - *Alasan*: NestJS menyediakan pola arsitektur *Dependency Injection* enterprise-grade, modular, dan terstruktur rapi. Fastify adapter memberikan *throughput* request/second 2x lebih tinggi dibanding Express.js.
- **ORM / Query Builder**: **Kysely / Prisma ORM** untuk kueri SQL berkekuatan tipe (*strictly type-safe*).

#### 2.2 Worker Pool & Pemrosesan Paralel (BullMQ + Redis 7.2)
- **Engine Kalkulasi**: Worker pool berbasis **BullMQ** yang mendistribusikan beban kalkulasi penggajian ratusan karyawan secara paralel per chunk 50 karyawan per proses worker thread.
- **Distributed Locking (Redlock)**: Memastikan proses kalkulasi atau approval penggajian tidak dieksekusi ganda (*idempotency guarantee*) jika tombol diklik berkali-kali.

#### 2.3 Mesin Pembuat PDF Slip Gaji (PDF Generator Engine)
- **Komponen**: **Chromium Headless (Puppeteer)** dengan template HTML/CSS Tailwind yang dikompilasi menjadi berkas PDF beresolusi tajam, disusul injeksi enkripsi kata sandi AES-128/256 melalui `qpdf` native utility.

#### 2.4 Database: PostgreSQL 16+ with Native RLS
- **Keunggulan**: Memiliki fitur **Row-Level Security (RLS)** native yang mengevaluasi kebijakan keamanan pada setiap kueri, didukung tipe data `JSONB` yang sangat cepat untuk menyimpan snapshot audit komponen gaji permanen.

---

### 3. Kedaulatan Data & Infrastruktur Cloud Indonesia

Berdasarkan **PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik** serta **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**, data keuangan, kompensasi, dan identitas kependudukan warga negara Indonesia **wajib** ditempatkan dan diproses pada pusat data di dalam negeri Republik Indonesia.

```
+----------------------------------------------------------------------------------------------------+
|                                    TOPOLOGI CLUSTER REGION JAKARTA                                 |
+----------------------------------------------------------------------------------------------------+
| [ CLOUDFLARE EDGE WAF ] (Anti-DDoS, SSL Termination, Bot Management)                               |
|            |                                                                                       |
|            v (Encrypted Backbone)                                                                  |
| [ GCP ASIA-SOUTHEAST2 / AWS AP-SOUTHEAST-3 JAKARTA VPC ]                                            |
|   +----------------------------------------------------------------------------------------------+ |
|   | [ Public Subnet ]    : Managed Application Load Balancer                                     | |
|   |                                                                                              | |
|   | [ Private App Subnet]: Kubernetes Cluster (GKE / EKS)                                        | |
|   |                        - Pods API Service (Auto-scaling 2..10 pods)                          | |
|   |                        - Pods Background Workers (BullMQ Calculation & PDF)                  | |
|   |                                                                                              | |
|   | [ Private DB Subnet ]: Managed PostgreSQL 16+ (Primary + Read Replica Multi-AZ)             | |
|   |                        Managed Redis 7.2 Cluster (High Availability Sentinel)                | |
|   |                        Encrypted S3 Bucket (Server-Side Encryption AES-256)                  | |
|   +----------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 3.1 Evaluasi Penyedia Cloud Region Jakarta

| Penyedia Cloud | Region / Zona Ketersediaan | Sertifikasi Kepatuhan | Evaluasi Kinerja & Jaringan |
|---|---|---|---|
| **Google Cloud Platform (GCP)** | **Jakarta (`asia-southeast2`)** — 3 AZ | ISO 27001, SOC 2, OJK Ready | Latensi sangat rendah (< 10ms dari Telkom/Indosat/XL), Cloud SQL PostgreSQL sangat andal. |
| **Amazon Web Services (AWS)** | **Jakarta (`ap-southeast-3`)** — 3 AZ | ISO 27001, PCI-DSS Level 1 | Ekosistem RDS Aurora & S3 Jakarta sangat matang. |

**Keputusan Infrastruktur**: **GCP Jakarta (`asia-southeast2`)** atau **AWS Jakarta (`ap-southeast-3`)** dengan konfigurasi *Multi-Availability Zone (Multi-AZ)* dan jaringan privat terisolasi (*Private VPC Subnets*).
