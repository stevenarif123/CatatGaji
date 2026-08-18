# 🇮🇩 CatatGaji — Multi-Tenant Payroll & HRIS SaaS Indonesia

Platform penggajian (payroll) dan HRIS cloud-native & offline-first yang dirancang khusus untuk UKM dan Enterprise di Indonesia, dengan kepatuhan hukum 100% terhadap regulasi perpajakan dan ketenagakerjaan Indonesia.

---

## 🌟 Fitur Utama & Kepatuhan Regulasi Indonesia

1. **PMK No. 168/2023 (PPh 21 TER)**:
   * 125 Lapisan Lengkap Tabel Tarif Efektif Rata-rata (TER A 44 layer, TER B 40 layer, TER C 41 layer).
   * Auto-mapping status PTKP (TK/0 s.d. K/3) ke kategori TER A/B/C.
   * Perhitungan PPh 21 bulanan (Jan–Nov) dengan pembulatan ke bawah (floor) ke Rupiah murni.
   * Non-NPWP Surcharge (Tarif TER × 120%).

2. **Pasal 17 UU HPP (Harmonisasi Peraturan Perpajakan)**:
   * Rekonsiliasi pajak tahunan Masa Pajak Terakhir / Desember menggunakan 5 lapisan tarif progresif (5%, 15%, 25%, 30%, 35%).
   * Biaya Jabatan 5% (maksimum Rp 6.000.000/tahun atau Rp 500.000/bulan).
   * Otomatisasi penyesuaian Kurang Bayar & Lebih Bayar (Refund) ke Take Home Pay (THP).
   * Pratinjau dan ekspor PDF resmi **Formulir Bukti Potong 1721-A1**.

3. **5 Program BPJS Ketenagakerjaan & BPJS Kesehatan**:
   * Jaminan Kecelakaan Kerja (JKK): 5 tingkat risiko kerja (0.24% s.d. 1.74%).
   * Jaminan Kematian (JKM): 0.30%.
   * Jaminan Hari Tua (JHT): 3.70% (Pemberi Kerja) + 2.00% (Pekerja).
   * Jaminan Pensiun (JP): 2.00% (Pemberi Kerja) + 1.00% (Pekerja), plafon upah Rp 10.042.300/bulan.
   * BPJS Kesehatan: 4.00% (Pemberi Kerja) + 1.00% (Pekerja), plafon upah Rp 12.000.000/bulan.

4. **PP No. 35/2021 (Lembur & Kompensasi PKWT)**:
   * Upah sejam standar $1/173 \times \text{Upah}$.
   * Pengali lembur berjenjang: Hari kerja (1.5x jam pertama, 2x jam berikutnya), Hari istirahat/libur resmi (2x, 3x, 4x).
   * Kalkulator otomatis uang kompensasi berakhirnya kontrak PKWT.

5. **UU PDP No. 27/2022 (Perlindungan Data Pribadi)**:
   * Masking otomatis NIK KTP (`3171********0001`) pada seluruh tampilan dan endpoint list.
   * Enkripsi sisi klien **Web Crypto API AES-256-GCM** (PBKDF2 100.000 iterasi).

6. **4-Step Payroll Wizard & Owner PIN Approval**:
   * Alur proses 4 tahap: Batch Run $\rightarrow$ Edit Variabel Live $\rightarrow$ Review Rekapitulasi $\rightarrow$ PIN 6-Digit Approval.
   * Penguncian permanen (*immutable snapshot*) setelah disetujui Owner.
   * Unduh langsung Slip Gaji Digital berformat PDF resmi via `jsPDF`.

7. **Dual-Mode Database (Zero External Dependencies)**:
   * Mendukung PostgreSQL eksternal (Supabase/Neon/Self-hosted).
   * Terintegrasi dengan **PGlite (Embedded WebAssembly PostgreSQL)**: berjalan 100% lokal di laptop tanpa perlu install Docker atau PostgreSQL (Biaya Rp 0).

8. **Offline-First Storage**:
   * Penyimpanan offline lokal menggunakan **Dexie.js (IndexedDB)**.
   * Queue antrean sinkronisasi saat koneksi internet terputus.

---

## 🏗️ Struktur Monorepo

```
CatatGaji/
├── apps/
│   ├── api/          # Backend Fastify + TypeScript + Dual-Mode PostgreSQL (PGlite)
│   └── web/          # Frontend SPA (Vite 6 + React 19 + TypeScript + Custom Tokens + Dexie.js)
├── packages/
│   └── shared/       # Shared Domain Types, 125 Layer TER Tables, BPJS, Overtime & Tax Engines
└── package.json
```

---

## 🚀 Panduan Menjalankan Aplikasi

### Persyaratan Sistem:
* **Node.js**: Versi >= 20.0.0
* **pnpm**: Versi >= 9.0.0

### 1. Menjalankan Server Development (Full Stack)
```bash
# Menjalankan backend API (:3000) dan frontend web (:5173) secara bersamaan:
pnpm dev
```
Buka browser di: **`http://localhost:5173`**

### 2. Menjalankan Tes Otomatis (55 Test Suites)
```bash
# Menjalankan seluruh test unit engine & integrasi API:
pnpm test
```

### 3. Menjalankan Linting
```bash
pnpm lint
```

### 4. Build Produksi
```bash
pnpm build
```

---

## 📜 Lisensi
Proprietary — Hak Cipta Dilindungi Undang-Undang.
