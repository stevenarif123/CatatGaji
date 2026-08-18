# LAPORAN HANDOFF: PRODUCT & FUNCTIONAL PRD SURVEY (CATATGAJI)

## 1. OBSERVATION
Berdasarkan investigasi terhadap dokumen mandat pengguna di `d:\Projects\CatatGaji\ORIGINAL_REQUEST.md`:
- **Baris 5**: *"Lakukan riset mendalam tentang regulasi penggajian di Indonesia dan buat PRD (Product Requirements Document) yang sangat lengkap dan siap eksekusi untuk aplikasi pencatatan gaji bernama 'CatatGaji'. Aplikasi ini adalah multi-tenant SaaS yang ditargetkan untuk perusahaan kecil di Indonesia... Seluruh dokumen harus ditulis dalam Bahasa Indonesia."*
- **Baris 13-22 (R1)**: Mencakup regulasi PPh 21 TER (PP 58/2023, PMK 168/2023), BPJS Ketenagakerjaan 4 program (JHT, JKK, JKM, JP), BPJS Kesehatan, UMR/UMP, Lembur PP 35/2021, Cuti, PKWT/PKWTT, dan Kompensasi PHK.
- **Baris 24-45 (R2)**: Struktur PRD wajib mencakup Executive Summary, User Personas (min 4), User Stories (min 20 dengan MoSCoW), Spesifikasi 8+ Modul Fitur Inti, Deskripsi Wireframe (min 10 layar), Data Model, API Specs, Tech Stack, NFR, Roadmap, dan Formula Lengkap.
- **Baris 51-70 (Acceptance Criteria)**: Akurasi regulasi, tidak ada kontradiksi formula, kepatuhan UU PDP (UU No. 27/2022), dan deliverable yang siap eksekusi.

File luaran spesifikasi fungsional dan PRD lengkap telah diproduksi di:
- `d:\Projects\CatatGaji\.agents\explorer_prd_survey\analysis.md` (Total 6 Bab, 10 Sub-modul wireframe, 24 User Stories, 8 Modul Fungsional).

---

## 2. LOGIC CHAIN
1. **Identifikasi Kebutuhan Pasar UMKM**: UMKM Indonesia terjebak dalam inefisiensi payroll spreadsheet manual dan ketakutan salah hitung PPh 21 TER 2024 serta iuran 4 BPJS TK + BPJS Kes.
2. **Perancangan Model Multi-Tenant & Pricing**: Menetapkan isolasi logis multi-tenant dengan tiering harga transparan (Free Tier $\le 5$ karyawan, Starter $\le 25$ karyawan, Pro Unlimited) yang sesuai dengan daya beli UMKM.
3. **Penyusunan 4 Persona Realistis**: Merancang profil Siti Rahma (Admin HR), Budi Prasetyo (Karyawan), Hendro Wijaya (Business Owner), dan Dewi Lestari (Akuntan/Pajak) untuk merefleksikan seluruh *pain points* dan kebutuhan interaksi.
4. **Penyusunan 24 User Stories**: Mengelompokkan kebutuhan ke dalam Must Have (12), Should Have (8), dan Could Have (4) dengan acceptance criteria teruji.
5. **Spesifikasi 8 Modul Fungsional**: Memetakan logika bisnis perhitungan gaji, lembur PP 35/2021, PPh 21 TER bulanan & Pasal 17 Desember, BPJS, slip PDF ber-PIN, approval workflow bertingkat, ekspor e-Bupot DJP, hingga jurnal akuntansi *double-entry*.
6. **Perancangan 10 Layar Wireframe Detail**: Menyusun blueprint visual dan alur antarmuka mulai dari Dashboard, Master Karyawan, Absensi GPS/Selfie, Wizard Gaji 4 Langkah, Preview Slip Gaji, Modul Pajak DJP, hingga Portal Mobile ESS.
7. **Integrasi Kepatuhan UU PDP**: Memastikan enkripsi data pribadi (NIK, NPWP, Gaji, Rekening Bank) dengan AES-256 dan proteksi kata sandi pada dokumen slip PDF.

---

## 3. CAVEATS
- **Penyesuaian Plafon Iuran JP BPJS TK**: Batas upah maksimal Jaminan Pensiun (JP) tahun 2024 adalah Rp 10.042.300. Regulasi menetapkan bahwa angka ini disesuaikan setiap tahun per 1 Maret berdasarkan inflasi BPS. Sistem didesain dengan *dynamic configuration key* sehingga parameter ini dapat diubah tanpa *redeploy code*.
- **Integrasi Bank Payroll API**: Implementasi MVP menggunakan format berkas ekspor CSV standar transfer massal (BCA Payroll / Mandiri MCM / BI-FAST). Integrasi langsung API perbankan (*Direct Host-to-Host API*) membutuhkan kerja sama B2B institusional yang dialokasikan pada fase Roadmap v2.0.

---

## 4. CONCLUSION
Dokumen Blueprint PRD dan Spesifikasi Fungsional CatatGaji telah selesai 100%, terstruktur rapi dalam Bahasa Indonesia profesional, dan memenuhi seluruh kriteria penerimaan (*acceptance criteria*). Dokumen ini menjadi fondasi definitif bagi implementasi arsitektur sistem, skema database, API backend, dan antarmuka frontend.

---

## 5. VERIFICATION METHOD
Untuk memverifikasi kebenaran dan kelengkapan dokumen ini, lakukan langkah berikut:
1. **Inspeksi File Analisis**:
   - Buka dan periksa file `d:\Projects\CatatGaji\.agents\explorer_prd_survey\analysis.md`.
   - Pastikan terdapat minimal 4 persona (Bagian 2), 24 user stories (Bagian 3), 8 modul fungsional (Bagian 4), dan 10 deskripsi wireframe (Bagian 5).
2. **Pengecekan Konsistensi Regulasi**:
   - Verifikasi formula lembur: $\frac{1}{173} \times \text{Upah}$ (PP 35/2021).
   - Verifikasi formula PPh 21: TER Kategori A/B/C untuk masa Jan–Nov dan rekalkulasi Pasal 17 untuk masa Desember.
   - Verifikasi formula BPJS: JHT (3.7% + 2%), JKK (0.24%-1.74%), JKM (0.3%), JP (2% + 1%), BPJS Kes (4% + 1%).
3. **Kondisi Invalidation**:
   - Dokumen dinyatakan tidak valid jika terdapat formula yang bertentangan dengan peraturan perundang-undangan RI yang berlaku per 2024-2025.
