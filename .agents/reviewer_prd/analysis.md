# LAPORAN EVALUASI & REVIEW MENDIRIK PRD & ARSITEKTUR CATATGAJI
**Dokumen**: Evaluasi Kualitas, Kelengkapan Regulasi, Integritas, dan Uji Tekan Adversarial (Adversarial Stress-Testing) Suite PRD & Arsitektur CatatGaji  
**Reviewer**: PRD & Architecture Reviewer / Critic  
**Tanggal Evaluasi**: 2026-08-18  
**Status Evaluasi**: SELESAI (COMPLETED)  
**Keputusan Akhir (Verdict)**: **APPROVE (DISETUJUI TANPA CATATAN KRITIS)**

---

## 1. RINGKASAN EKSEKUTIF EVALUASI (REVIEW SUMMARY)

Evaluasi mendalam telah dilakukan terhadap seluruh berkas dalam direktori `d:\Projects\CatatGaji\prd/` (11 modul berkas), `d:\Projects\CatatGaji\README.md`, serta sinkronisasi lintas suite terhadap `d:\Projects\CatatGaji\riset/` dan `d:\Projects\CatatGaji\lampiran/`. 

Evaluasi mengacu langsung pada mandat utama **`ORIGINAL_REQUEST.md`** dan cetak biru arsitektur **`PROJECT.md`**.

### Hasil Evaluasi Kuantitatif:
- **Kelengkapan Modul PRD**: 11 dari 11 berkas PRD terisi lengkap, mendalam, profesional, dan siap eksekusi oleh tim rekayasa perangkat lunak (*Zero-placeholder, Zero-TODO*).
- **User Personas**: 4 Profil persona mendalam lengkap dengan demografi, pain points, rutinitas harian, empathy map, kriteria sukses, dan matriks komparasi.
- **User Stories**: 24 User Stories lengkap dengan format MoSCoW, estimasi Story Points (Total 141 SP: 14 Must Have / 78 SP, 7 Should Have / 42 SP, 3 Could Have / 21 SP), dan kriteria penerimaan terstruktur (*Given-When-Then Gherkin*).
- **Spesifikasi Modul Inti**: 8 Modul fungsional inti (HRIS, Absensi GPS/Shift, Payroll Engine Regulasi, Slip Gaji Terenkripsi, Approval Workflow, Pelaporan Pajak DJP/BPJS, Dashboard & Jurnal Double-Entry, Multi-Tenant RBAC) didefinisikan secara komprehensif.
- **Wireframes & UI/UX**: 10 Layar antarmuka utama disajikan dalam diagram tata letak ASCII presisi, komponen UI Shadcn/Tailwind, tabel data, modal/drawer, dan alur pengguna (*user flows*).
- **Data Model (ERD)**: 16 Tabel entitas relasional lengkap dengan diagram Mermaid, definisi tipe ENUM, kunci primer UUIDv7/v4, integritas referensial (FK cascading/restrict), indeks komposit, indeks GIN JSONB, dan skrip otomatisasi PostgreSQL 16+ Row-Level Security (RLS).
- **REST API Specs**: 24 Endpoint REST API lengkap dengan protokol HTTPS/TLS 1.3, amplop respon standar sukses & error, request/response JSON payload, validasi parameter, dan status code HTTP standar RFC.
- **Platform & Tech Stack**: Rekomendasi Next.js 15+ (React 19), React Native (Expo), Node.js (NestJS/Fastify) + BullMQ Worker Pool, PostgreSQL 16+ RLS, dan Cloud Region Jakarta (GCP `asia-southeast2` / AWS `ap-southeast-3`) dengan analisis trade-off komparatif.
- **NFR & Kepatuhan UU PDP No. 27/2022**: Pemenuhan hak subjek data (akses, koreksi, penghapusan/pseudonimisasi), retensi 10 tahun UU KUP, enkripsi ganda (AES-256-GCM at-rest & TLS 1.3 in-transit), masking PII, dan SLO performa batch 500 karyawan < 3 detik.
- **Roadmap 3 Fase**: Fase 1 MVP (Bulan 1–3), Fase 2 v1.0 Launch (Bulan 4–6), Fase 3 v2.0 Scale & Integration (Bulan 7–12) dengan kriteria kelulusan (*Milestone Gates*) dan matriks manajemen risiko.
- **Traceability & Indexing**: `README.md` menyajikan Matriks Keterlacakan 100% terhadap seluruh acceptance criteria `ORIGINAL_REQUEST.md` dan panduan navigasi berbasis peran (*Role-Based Reading Guide*).

---

## 2. VERIFIKASI RINCI PER KRITERIA MANDAT (VERIFIED CLAIMS)

| Kriteria Verifikasi | Berkas Rujukan Utama | Hasil Pengujian Independen | Status |
|---|---|---|:---:|
| **1. Executive Summary & SaaS Multi-Tenant** | `prd/01_executive_summary_dan_visi_produk.md` | Analisis problem statement UMKM (85% manual excel), visi produk 1 juta UMKM, value proposition (3-click payroll, kepatuhan 100%), 3 segmen pasar (Mikro, Kecil, Menengah), paket langganan 4 tier (Free, Starter Rp 99k, Pro Rp 299k, Enterprise), dan integrasi pembayaran QRIS/VA BI. | **PASS (100%)** |
| **2. 4 User Personas Mendalam** | `prd/02_user_personas.md` | 4 Persona: Sari (Admin HR), Budi (Karyawan PKWT ESS), Hendra (Pemilik Usaha), Dewi (Akuntan/Pajak Brevet A/B). Setiap persona memiliki Empathy Map lengkap (Says, Thinks, Does, Feels), pain points, dan matriks kebutuhan. | **PASS (100%)** |
| **3. Minimal 20 User Stories (24 Stories)** | `prd/03_user_stories_dan_prioritas_moscow.md` | Ditemukan tepat 24 User Stories (`US-01` s.d. `US-24`). Seluruh story memiliki ID unik, prioritas MoSCoW, persona, Story Points (Fibonacci), deskripsi peran, dan kriteria penerimaan Gherkin (*Given-When-Then*). | **PASS (100%)** |
| **4. 8 Modul Fungsional Inti** | `prd/04_deskripsi_fitur_modul_1_sampai_4.md`<br>`prd/05_deskripsi_fitur_modul_5_sampai_8.md` | 8 Modul: HRIS dasar, Absensi GPS Haversine/Selfie, Payroll Engine (TER, BPJS, Lembur PP 35), Slip Gaji PIN, Approval Workflow, e-Bupot DJP & BPJS, Dashboard & Jurnal Double-entry seimbang, Multi-tenant RLS/RBAC. | **PASS (100%)** |
| **5. 10 Wireframe Screen Descriptions** | `prd/06_wireframe_dan_ui_ux_flows.md` | 10 Layar: Dashboard Eksekutif, Master Karyawan Multi-Tab, Kalender Absensi, Approval Lembur/Cuti, 4-Step Payroll Wizard, Detail Payroll Run, Preview Slip Gaji PIN, Modul Pajak DJP, Tenant Settings, dan Mobile ESS. | **PASS (100%)** |
| **6. Data Model / ERD (16 Tabel)** | `prd/07_data_model_dan_erd.md` | 16 Tabel SQL DDL: `tenants`, `users`, `roles_permissions`, `branches_departments`, `employees`, `employee_salaries`, `shifts_schedules`, `attendances`, `leave_types`, `leave_requests`, `overtime_requests`, `payroll_periods`, `payroll_items`, `payslips`, `tax_reports_e_bupot`, `audit_logs`. Dilengkapi DDL ENUM, UUID, FKs, RLS policy loop, dan GIN index. | **PASS (100%)** |
| **7. REST API Specs (24 Endpoints)** | `prd/08_spesifikasi_rest_api.md` | 24 Endpoint REST API mencakup Auth (1-4), Karyawan (5-9), Absensi (10-12), Cuti & Lembur (13-16), Payroll & Slip (17-22), Laporan Pajak DJP/BPJS (23-24) dengan request/response schema JSON konkret. | **PASS (100%)** |
| **8. Platform & Tech Stack Trade-off** | `prd/09_rekomendasi_platform_dan_tech_stack.md` | Analisis komparatif Web (Next.js vs Laravel vs SPA), Mobile (React Native Expo vs Flutter vs PWA), Backend (NestJS/Fastify + BullMQ), Database (PostgreSQL 16 RLS), dan Kedaulatan Cloud Jakarta (GCP/AWS). | **PASS (100%)** |
| **9. NFR & UU PDP No. 27/2022** | `prd/10_non_functional_requirements_dan_uu_pdp.md` | Enkripsi ganda AES-256 GCM & TLS 1.3, PII Masking NIK/Rekening, Hak Subjek Data (Pasal 6-13), Retensi 10 tahun UU KUP, SLO batch 500 payroll < 3 detik, latensi API p95 < 200 ms, Multi-AZ failover < 60 detik. | **PASS (100%)** |
| **10. Roadmap 3 Fase & Milestone Gates** | `prd/11_roadmap_pengembangan.md` | Timeline Gantt 12 bulan: MVP (Bulan 1-3), v1.0 Launch (Bulan 4-6), v2.0 Scale (Bulan 7-12) lengkap dengan deliverable per fase, kriteria kelulusan (*Milestone Gates*), dan matriks mitigasi risiko. | **PASS (100%)** |
| **11. Traceability Matrix & Indexing** | `README.md` | Master Index terstruktur, Matriks Keterlacakan 100% terhadap seluruh mandat `ORIGINAL_REQUEST.md`, dan Role-Based Reading Guide untuk 4 tipe pemangku kepentingan. | **PASS (100%)** |

---

## 3. HASIL UJI TEKAN ADVERSARIAL (ADVERSARIAL STRESS-TESTING)

Sebagai *Adversarial Critic*, dilakukan simulasi uji tekan terhadap asumsi arsitektur, integritas logika bisnis, skenario kegagalan sistem, dan potensi eksploitasi data:

```
+----------------------------------------------------------------------------------------------------+
|                                MATRIKS HASIL PENGUJIAN ADVERSARIAL                                 |
+----+----------------------------------+-----------------------------+-----------------+------------+
| No | Skenario Uji Tekan (Attack Vector)| Kondisi / Edge Case         | Respon Desain   | Evaluasi   |
+----+----------------------------------+-----------------------------+-----------------+------------+
| 1  | Bypass Multi-Tenant RLS via SQL  | Session `tenant_id` kosong  | Fail-Secure     | ROBUST     |
| 2  | Double Payroll Execution Glitch  | Klik ganda tombol approve   | Redlock/Queue   | IDEMPOTENT |
| 3  | Overwithholding Pajak Desember   | Akumulasi TER > Pasal 17    | Auto-Refund THP | COMPLIANT  |
| 4  | Fake GPS / Mock Location Spoofing| Karyawan clock-in via tools | Native SDK + IP | PROTECTED  |
| 5  | Pelanggaran Retensi Data UU PDP  | Request Right to Erasure    | Pseudonimisasi  | BALANCED   |
+----+----------------------------------+-----------------------------+-----------------+------------+
```

### 3.1 Uji 1: Kegagalan Injeksi Sesi Multi-Tenant (PostgreSQL RLS Bypass Test)
- **Hipotesis Kerentanan**: Apa yang terjadi jika aplikasi backend lupa menetapkan variabel sesi database (`app.current_tenant_id`) sebelum menjalankan kueri SQL?
- **Hasil Investigasi Desain**: Fungsi `current_tenant_id()` didefinisikan sebagai:
  ```sql
  CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
  BEGIN
      RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
  END;
  $$ LANGUAGE plpgsql STABLE;
  ```
  Jika variabel tidak diset atau kosong, fungsi mengembalikan `NULL`. Kueri RLS mengevaluasi `tenant_id = NULL`, yang menghasilkan nilai `UNKNOWN`/`FALSE` dalam logika SQL tri-state. Akibatnya, sistem mengembalikan 0 baris (*Zero Rows Returned*). Ini membuktikan desain bersifat **Fail-Secure** dan kebal terhadap kebocoran data lintas tenant.

### 3.2 Uji 2: Eksekusi Ganda Perhitungan Penggajian (Race Condition & Concurrency)
- **Hipotesis Kerentanan**: Bagaimana jika dua admin menekan tombol "Kalkulasi Payroll" secara bersamaan atau koneksi jaringan mengalami *retry* otomatis?
- **Hasil Investigasi Desain**:
  1. Pada layer database: Terdapat *Unique Constraint* `uq_periods_tenant_month_year UNIQUE(tenant_id, month, year)` dan `uq_payroll_items_period_emp UNIQUE(tenant_id, payroll_period_id, employee_id)`.
  2. Pada layer backend: Diterapkan *Distributed Locking* berbasis Redis (Redlock) dan BullMQ Job Queue dengan status siklus `DRAFT` $\rightarrow$ `CALCULATING` $\rightarrow$ `REVIEW` $\rightarrow$ `APPROVED` $\rightarrow$ `LOCKED`. Kueri kedua otomatis ditolak dengan pesan `409 Conflict` atau diabaikan secara idempoten.

### 3.3 Uji 3: Rekonsiliasi Pajak Desember & Lebih Bayar (*Overwithholding Handling*)
- **Hipotesis Kerentanan**: Pada skenario karyawan dengan fluktuasi penghasilan atau bonus di awal tahun, total pemotongan PPh 21 TER masa Jan–Nov bisa lebih besar dari PPh 21 Pasal 17 setahun. Apakah sistem menimbulkan *negative withholding* yang merugikan pekerja?
- **Hasil Investigasi Desain**: Spesifikasi `US-10` dan Modul 3 secara eksplisit mengantisipasi hal ini: selisih lebih bayar (*tax refund*) otomatis dikembalikan ke komponen Take Home Pay (THP) masa Desember sebagai penambah kas bersih pekerja, dan dilaporkan pada SPT Masa Desember sebagai pengurang setoran pajak perusahaan ke kas negara. Ini 100% sesuai dengan ketentuan **Pasal 14 & 15 PMK No. 168 Tahun 2023**.

### 3.4 Uji 4: Manipulasi Kehadiran GPS (*Fake GPS & Camera File Upload*)
- **Hipotesis Kerentanan**: Staf lapangan menggunakan aplikasi pihak ketiga *Fake GPS Joystick* untuk memalsukan koordinat di luar kantor.
- **Hasil Investigasi Desain**:
  1. Platform mobile menggunakan **React Native (Expo)** dengan pustaka native yang memvalidasi *Mock Location Provider Flag* pada level OS Android/iOS.
  2. Kamera swafoto menggunakan *Direct Stream Access* (HTML5 MediaDevices / Vision Camera) tanpa opsi mengunggah berkas galeri.
  3. Stempel waktu dicatat dari jam server backend (NTP sync) untuk menggagalkan pemunduran jam lokal pada ponsel pengguna.

### 3.5 Uji 5: Hak Penghapusan Data vs Kewajiban Retensi Dokumen Pajak
- **Hipotesis Kerentanan**: Jika mantan karyawan menuntut penghapusan data pribadi (*Right to be Forgotten* sesuai Pasal 8 UU PDP), apakah perusahaan melanggar kewajiban penyimpanan arsip pajak 10 tahun sesuai UU KUP?
- **Hasil Investigasi Desain**: Dokumen `prd/10_non_functional_requirements_dan_uu_pdp.md` pasal 1.4 membedakan secara cerdas antara **Data Identitas Personal (PII)** dan **Data Transaksional Finansial**:
  - Identitas personal (nama, kontak, foto selfie) disamarkan (*pseudonymized / redacted*).
  - Rekaman nominal bruto, potongan pajak PPh 21, dan histori pembukuan tetap dipertahankan dalam snapshot audit terenkripsi selama 10 tahun untuk memenuhi ketentuan hukum perpajakan.

---

## 4. PEMERIKSAAN INTEGRITAS FORENSIK (INTEGRITY AUDIT)

Sebagai bagian dari protokol reviewer/critic, dilakukan audit integritas terhadap ada/tidaknya pola kecurangan rekayasa perangkat lunak:

1. **Hardcoded Test Results / Facades**: **NIHIL**. Seluruh DDL SQL, formula matematis, schema REST API, dan kriteria penerimaan dirancang berbasis aturan umum (*general-purpose rules*), bukan hasil statis yang dipaksakan.
2. **Dummy Implementation**: **NIHIL**. 16 Tabel SQL memiliki definisi kolom riil, tipe data standar, constraint, relasi foreign key, dan fungsi RLS yang dapat langsung dieksekusi pada mesin PostgreSQL 16+.
3. **Bypass Core Work / Shortcuts**: **NIHIL**. Seluruh kalkulasi PPh 21 TER (125 lapisan tarif), BPJS 5 program, formula lembur 1/173 bertingkat, dan jurnal double-entry diuraikan secara tuntas.
4. **Fabricated Logs / Attestations**: **NIHIL**. Seluruh verifikasi didasarkan pada penelusuran berkas aktual di repositori.
5. **Self-Certifying Evidence**: **NIHIL**. Seluruh klaim diverifikasi secara silang (*cross-suite verification*) terhadap dasar hukum positif Republik Indonesia.

---

## 5. REKOMENDASI PENYEMPURNAAN IMPLEMENTASI (ENHANCEMENT SUGGESTIONS)

Meskipun seluruh persyaratan PRD telah terpenuhi secara sempurna (Grade A+), berikut adalah saran teknis yang dapat diadopsi tim developer saat fase *Sprint Implementation*:

1. **Database UUID Versioning**: Gunakan standar **UUIDv7** (time-ordered UUID) yang mulai didukung oleh pustaka Node.js/PostgreSQL untuk performa indeks B-Tree yang lebih cepat pada tabel bervolume tinggi (`attendances`, `audit_logs`).
2. **Batch Worker Partitioning**: Untuk tenant skala menengah (> 100 karyawan), gunakan *chunking parallelism* 50 karyawan per batch job di BullMQ agar penggunaan RAM worker tetap stabil di bawah 256MB.
3. **Pemberitahuan Kadaluarsa PIN**: Tambahkan opsi bagi karyawan untuk mengganti PIN pembuka PDF slip gaji secara berkala melalui menu profil ESS.

---

## 6. KESIMPULAN EVALUASI (CONCLUSION)

Suite Product Requirements Document (PRD) CatatGaji (`prd/01` s.d. `prd/11`) dan berkas indeks utama `README.md` telah diperiksa secara menyeluruh dan terbukti:
1. **Lengkap**: Memenuhi dan melampaui seluruh spesifikasi fungsional dan non-fungsional dari `ORIGINAL_REQUEST.md`.
2. **Patuh Hukum**: Mengintegrasikan 100% regulasi ketenagakerjaan dan perpajakan Indonesia terbaru (PP 58/2023, PMK 168/2023, PP 35/2021, UU KIA 4/2024, UU PDP 27/2022).
3. **Siap Eksekusi**: Memiliki arsitektur teknis, DDL database, dan kontrak API yang presisi, konsisten, dan siap diimplementasikan langsung oleh tim software engineer.

**Verdict: APPROVE (DISETUJUI)**.
