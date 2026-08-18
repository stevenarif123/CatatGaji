# Project: CatatGaji (Multi-Tenant SaaS Penggajian UMKM Indonesia)

## Architecture
CatatGaji dirancang sebagai platform multi-tenant SaaS modern dengan pendekatan *Shared Database, Shared Schema* memanfaatkan PostgreSQL 16+ Row-Level Security (RLS) untuk isolasi data antar tenant (perusahaan UMKM).

Komponen Arsitektur:
- **Frontend Web**: Vite 6+ (React 19, TypeScript, Tailwind CSS, Shadcn UI) untuk Dashboard Admin HR, Finance, dan Pemilik Usaha.
- **Mobile ESS**: React Native (Expo) untuk Employee Self-Service (Absensi GPS geofencing, pengajuan cuti/lembur, slip gaji digital).
- **Backend Core & Engine**: Node.js (NestJS / Fastify + TypeScript) + Worker Pool dengan Redis 7.2 (BullMQ) untuk pemrosesan penggajian paralel dan penjadwalan batch.
- **Database & Storage**: PostgreSQL 16+ (TimescaleDB untuk log absensi, RLS multi-tenancy), S3/MinIO terenkripsi untuk arsip PDF slip gaji & bukti lampiran cuti/reimbursement.
- **Kedaulatan & Keamanan Data**: Cloud Data Center Region Jakarta (GCP `asia-southeast2` / AWS `ap-southeast-3`), enkripsi AES-256 at-rest, TLS 1.3 in-transit, kepatuhan penuh UU No. 27/2022 (UU PDP).

---

## Feature Inventory
Seluruh fitur yang teridentifikasi dari survei regulasi, analisis produk, dan arsitektur teknis telah dipetakan ke dalam milestone:

| # | Feature | Deskripsi | Milestone | Sumber |
|---|---------|-----------|-----------|--------|
| 1 | PPh 21 TER Engine (PP 58/2023 & PMK 168/2023) | Kalkulasi otomatis TER Bulanan (A, B, C) masa Jan-Nov | M1, M2, M3 | Survey Legal |
| 2 | PPh 21 Tahunan & Rekonsiliasi Desember | Perhitungan PPh 21 Pasal 17 UU HPP, PTKP, dan restitusi kelebihan potong | M1, M2, M3 | Survey Legal |
| 3 | BPJS Ketenagakerjaan 4 Program | JKK (5 kelas tarif), JKM (0.3%), JHT (5.7%), JP (3.0% + capping 2024-2026) | M1, M2, M3 | Survey Legal |
| 4 | BPJS Kesehatan Multi-Anggota | Iuran 5% (4% pers, 1% kary), capping Rp12 jt, 5 anggota & penambahan 1%/jiwa | M1, M2, M3 | Survey Legal |
| 5 | Upah Minimum & Komposisi Upah | Skema proteksi min 75% upah pokok, kepatuhan UMP/UMK & aturan khusus UMKM | M1, M2 | Survey Legal |
| 6 | Lembur Otomatis PP 35/2021 | Rumus 1/173 upah sebulan, tiering hari kerja & hari libur, validasi SPKL | M1, M2, M3 | Survey Legal |
| 7 | THR Keagamaan Generator | Perhitungan THR penuh (>=12 bln), prorata (1-<12 bln), & PPh 21 TER atas THR | M1, M2, M3 | Survey Legal |
| 8 | Cuti & Hak Maternitas UU KIA 2024 | Manajemen cuti tahunan, cuti melahirkan s/d 6 bln (100% bln 1-4, 75% bln 5-6), haid | M1, M2 | Survey Legal |
| 9 | Kompensasi PKWT & Pesangon PHK | Formula kompensasi akhir kontrak PKWT & matriks pesangon/UPMK/UPH PP 35/2021 | M1, M2, M3 | Survey Legal |
| 10 | Master Data Karyawan & HRIS Dasar | Biodata, NIK/NPWP/BPJS, status PTKP, multi-cabang/departemen, struktur gaji | M2 | Survey PRD |
| 11 | Absensi GPS, Selfie & Integrasi Mesin | Geofencing, clock-in selfie, shift management, keterlambatan & potongan presensi | M2 | Survey PRD |
| 12 | Slip Gaji Digital & Distribusi Multi-Channel | PDF generator terproteksi password (PIN/DOB), QR watermark, email & WhatsApp blast | M2 | Survey PRD |
| 13 | Approval Workflow Multi-Level | Alur persetujuan cuti, lembur, perubahan data, dan finalisasi payroll run | M2 | Survey PRD |
| 14 | Pelaporan Pajak e-Bupot 21/26 & BPJS | Ekspor format CSV e-SPT / DJP e-Bupot 21/26, formulir 1721-A1, rekap iuran BPJS | M2 | Survey PRD |
| 15 | Dashboard Analytics & Jurnal Akuntansi | Visualisasi total payroll cost, overtime, turnover, ekspor jurnal Jurnal/Xero | M2 | Survey PRD |
| 16 | Multi-Tenant Architecture & RBAC | Pendaftaran tenant, isolasi data via RLS, langganan tier, audit trail log | M2 | Survey Arch |
| 17 | Data Model & Skema Relasional (16 Tabel) | DDL PostgreSQL lengkap, UUIDv7, snapshot kalkulasi payroll immutable | M2 | Survey Arch |
| 18 | REST API Specifications (24 Endpoints) | Kontrak API lengkap untuk HRIS, Absensi, Cuti, Lembur, Payroll, e-Bupot | M2 | Survey Arch |
| 19 | UI Wireframe Descriptions (10 Screens) | Rancangan layout UI/UX mendalam untuk desktop dashboard dan mobile ESS | M2 | Survey PRD |
| 20 | Kepatuhan Keamanan UU PDP No. 27/2022 | Enkripsi AES-256/TLS 1.3, masking data PII, hak subjek data & retensi | M2 | Survey Arch |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Riset Regulasi Penggajian Indonesia (`/riset`) | 6 dokumen riset hukum & perpajakan (PPh 21 TER, BPJS, UMR, Lembur, Cuti, PKWT/Pesangon, 3 studi kasus numerik terperinci) | Survey | PLANNED |
| M2 | PRD Dokumen Lengkap & Siap Eksekusi (`/prd`) | 11 dokumen PRD lengkap (Vision, 4 Personas, 24 MoSCoW Stories, 8 Modul Fitur, 10 Wireframes, Data Model 16 Tabel, 24 REST APIs, Tech Stack, UU PDP NFR, 3-Phase Roadmap) | M1 | PLANNED |
| M3 | Lampiran Formula & Index Navigasi (`/lampiran` & `README.md`) | 3 dokumen lampiran formula (Tabel TER A/B/C, Formula matematis, Studi kasus) + Master Navigation Index `README.md` | M1, M2 | PLANNED |
| M4 | Comprehensive Multi-Agent Verification & Audit | Reviewer & Challenger verification, Forensic Integrity Audit, Zero-defect gating | M1, M2, M3 | PLANNED |

---

## Interface Contracts & File Layout

### Code / Documentation Layout
```
d:/Projects/CatatGaji/
├── README.md                                    # Master index & documentation navigator
├── ORIGINAL_REQUEST.md                          # User request source of truth
├── PROJECT.md                                   # Global project specification & tracker
├── riset/                                       # Suite Riset Regulasi Penggajian Indonesia
│   ├── 01_landasan_hukum_dan_regulasi.md
│   ├── 02_pph21_ter_dan_pasal17.md
│   ├── 03_bpjs_ketenagakerjaan_dan_kesehatan.md
│   ├── 04_upah_minimum_lembur_dan_thr.md
│   ├── 05_cuti_pkwt_dan_pesangon_phk.md
│   └── 06_studi_kasus_dan_simulasi_numerik.md
├── prd/                                         # Suite Product Requirements Document (PRD)
│   ├── 01_executive_summary_dan_visi_produk.md
│   ├── 02_user_personas.md
│   ├── 03_user_stories_dan_prioritas_moscow.md
│   ├── 04_deskripsi_fitur_modul_1_sampai_4.md
│   ├── 05_deskripsi_fitur_modul_5_sampai_8.md
│   ├── 06_wireframe_dan_ui_ux_flows.md
│   ├── 07_data_model_dan_erd.md
│   ├── 08_spesifikasi_rest_api.md
│   ├── 09_rekomendasi_platform_dan_tech_stack.md
│   ├── 10_non_functional_requirements_dan_uu_pdp.md
│   └── 11_roadmap_pengembangan.md
└── lampiran/                                    # Suite Formula & Lampiran Pendukung
    ├── 01_tabel_lengkap_ter_pph21.md
    ├── 02_katalog_formula_matematis.md
    └── 03_contoh_perhitungan_langkah_demi_langkah.md
```

---

## Integrity & Quality Standard
1. Setiap formula harus 100% konsisten antara `/riset`, `/prd`, dan `/lampiran`.
2. Seluruh tabel tarif TER A, B, dan C harus disertakan secara lengkap tanpa singkatan atau pemotongan deret.
3. Seluruh dokumen menggunakan Bahasa Indonesia baku, profesional, dan siap diimplementasikan langsung oleh tim software engineering.
