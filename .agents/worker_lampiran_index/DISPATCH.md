## 2026-08-17T14:23:26Z
You are the Lampiran & Master Index Specialist Worker for CatatGaji.
Your working directory is: d:\Projects\CatatGaji\.agents\worker_lampiran_index
Mandatory Source of Truth: d:\Projects\CatatGaji\ORIGINAL_REQUEST.md (READ FIRST).
Project Blueprint & Milestones: d:\Projects\CatatGaji\PROJECT.md
Legal Analysis Reference: d:\Projects\CatatGaji\.agents\spec_miner_legal_survey\analysis.md
PRD Blueprint Reference: d:\Projects\CatatGaji\.agents\explorer_prd_survey\analysis.md
Technical Architecture Reference: d:\Projects\CatatGaji\.agents\spec_miner_arch_survey\analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Mission & Write Ownership:
You own exclusively all 3 files in `d:\Projects\CatatGaji\lampiran/` AND the root `d:\Projects\CatatGaji\README.md`.
Write the complete, mathematically rigorous appendices and master documentation index in professional Bahasa Indonesia:

1. `d:\Projects\CatatGaji\lampiran\01_tabel_lengkap_ter_pph21.md`:
   - Tabel Lengkap Tarif Efektif Rata-Rata (TER) PPh 21 sesuai PP No. 58/2023 dan PMK No. 168/2023:
     * Kategori A (44 lapisan penghasilan bruto dan persentase tarif 0% s/d 34%)
     * Kategori B (40 lapisan penghasilan bruto dan persentase tarif 0% s/d 34%)
     * Kategori C (41 lapisan penghasilan bruto dan persentase tarif 0% s/d 34%)
     * Tabel TER Harian (ambang batas Rp450.000 s/d Rp2.500.000)
     * Tabel Referensi Status PTKP (TK/0 s/d K/3) dan nilai PTKP tahunan/bulanan.
   - SEMUA baris lapisan harus dicantumkan secara lengkap tanpa singkatan `...` agar menjadi acuan definitif bagi software engineer.

2. `d:\Projects\CatatGaji\lampiran\02_katalog_formula_matematis.md`:
   - Katalog terpadu seluruh rumus matematis yang digunakan oleh engine penggajian CatatGaji:
     * Formula Gaji Pokok & Tunjangan Prorata (Masuk/Keluar tengah bulan)
     * Formula Lembur PP 35/2021 (Dasar 1/173, Hari Kerja, Hari Libur 5 & 6 hari kerja)
     * Formula BPJS Ketenagakerjaan (JKK 5 kelas, JKM, JHT, JP + capping dinamis)
     * Formula BPJS Kesehatan (5%, capping Rp12 jt, penambahan anggota)
     * Formula Penghasilan Bruto PPh 21 (Komponen penambah & pengurang)
     * Formula Biaya Jabatan (5% maks Rp500 rb/bln)
     * Formula PPh 21 TER Bulanan (Masa Jan-Nov)
     * Formula PPh 21 Rekonsiliasi Desember (Tarif Progresif Pasal 17 UU HPP)
     * Formula PPh 21 Bukan Pegawai (DPP 50% x Tarif Pasal 17)
     * Formula PPh 21 Pesangon Final PP 68/2009 (0%, 5%, 15%, 25%)
     * Formula THR Keagamaan (Penuh & Prorata)
     * Formula Kompensasi PKWT PP 35/2021
     * Formula Pesangon PHK (UP, UPMK, UPH, dan Faktor Pengali)

3. `d:\Projects\CatatGaji\lampiran\03_contoh_perhitungan_langkah_demi_langkah.md`:
   - Panduan kalkulasi langkah demi langkah dengan pembuktian aritmatika presisi:
     * Studi Kasus 1: Karyawan Tetap (Gaji Pokok Rp8.500.000, Tunjangan Tetap Rp1.500.000, Lembur 10 jam, BPJS, PPh 21 TER B, dan Rekonsiliasi Desember).
     * Studi Kasus 2: Karyawan Menerima Gaji Pokok Rp6.000.000 + Tunjangan Rp1.000.000 + THR Rp7.000.000 (Status TK/0, TER A).
     * Studi Kasus 3: Karyawan PKWT Berakhir Kontrak 6 bulan + Lembur Hari Libur Nasional 8 jam (Upah Rp5.000.000).
     * Kaidah Pembulatan (Rounding Rules): Pembulatan ke bawah untuk PPh 21 ribuan penuh (rupiah), pembulatan standar untuk iuran BPJS, dan presisi desimal 2 digit pada intermediate storage.

4. `d:\Projects\CatatGaji\README.md`:
   - Master Documentation Index & Executive Guide untuk CatatGaji.
   - Ringkasan Eksekutif Produk, Arsitektur Sistem, Kepatuhan Regulasi Indonesia.
   - Struktur Folder & Daftar Berkas Lengkap (`/riset`, `/prd`, `/lampiran`, `README.md`, `PROJECT.md`).
   - Matriks Keterlacakan Kebutuhan (Traceability Matrix) yang memetakan seluruh Acceptance Criteria dari `ORIGINAL_REQUEST.md` ke berkas dokumentasi yang relevan.
   - Petunjuk Navigasi untuk Developer, Product Manager, Legal Officer, dan QA/Auditor.
