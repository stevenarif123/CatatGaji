# DISPATCH LOG

## 2026-08-17T13:22:46Z

You are the Legal & Regulatory Spec Miner for CatatGaji.
Your working directory is: d:\Projects\CatatGaji\.agents\spec_miner_legal_survey
Authoritative User Request is in: d:\Projects\CatatGaji\ORIGINAL_REQUEST.md (YOU MUST READ THIS FILE FIRST).

Mission:
Perform an exhaustive investigation and specification mining on all Indonesian payroll regulations applicable in 2024-2026 for the CatatGaji multi-tenant SaaS application.

Scope & Key Areas to Cover:
1. PPh 21:
   - PP 58/2023 & PMK 168/2023: Tarif Efektif Rata-rata (TER) Bulanan (Kategori A, B, C) dan Harian.
   - Mekanisme perhitungan bulanan (Masa Pajak Januari - November) menggunakan TER.
   - Mekanisme perhitungan masa pajak terakhir (Desember / resign) menggunakan tarif progresif Pasal 17 ayat (1) huruf a UU HPP dan PTKP (TK/0 s/d K/3).
   - Biaya Jabatan (5% maks Rp500.000/bulan atau Rp6.000.000/tahun).
   - Ketentuan perlakuan khusus: Pegawai Tidak Tetap / Tenaga Lepas, Bukan Pegawai (tenaga ahli/freelancer), Pesangon (PP 68/2009 tarif final), dan Natura / Kenikmatan (PMK 66/2023).
   - Mekanisme gross, gross-up (tunjangan pajak), dan net (pajak ditanggung perusahaan).
2. BPJS Ketenagakerjaan:
   - JKK (Jaminan Kecelakaan Kerja): 5 tingkat risiko (0.24%, 0.54%, 0.89%, 1.27%, 1.74% dibayar pemberi kerja).
   - JKM (Jaminan Kematian): 0.30% dibayar pemberi kerja.
   - JHT (Jaminan Hari Tua): 3.7% pemberi kerja, 2.0% pekerja.
   - JP (Jaminan Pensiun): 2.0% pemberi kerja, 1.0% pekerja, beserta batas upah tertinggi JP (capping) tahun 2024/2025 (Rp10.042.300 / Rp10.547.400).
   - Pajak impact: JKK & JKM menambah penghasilan bruto PPh 21; JHT & JP yang dibayar pekerja mengurangi penghasilan bruto.
3. BPJS Kesehatan:
   - Iuran 5% (4% pemberi kerja, 1% pekerja) per Perpres 75/2019 & Perpres 64/2020.
   - Batas upah maksimum (Rp12.000.000 per bulan) dan batas upah minimum (UMP/UMK).
   - Cakupan anggota keluarga (5 orang: peserta, suami/istri, 3 anak) dan penambahan anggota keluarga (1% per jiwa).
   - Pajak impact: 4% dari pemberi kerja menambah penghasilan bruto untuk PPh 21.
4. Upah Minimum & Komponen Upah:
   - UU No. 6/2023 (Cipta Kerja) & PP 51/2023 / Putusan MK No. 168/PUU-XXI/2023.
   - Struktur upah: Upah Pokok min 75% dari total upah (pokok + tunjangan tetap). Tunjangan tidak tetap.
   - Kebijakan skala upah untuk usaha mikro/kecil.
5. Tunjangan Hari Raya (THR) Keagamaan:
   - Permenaker No. 6/2016 & SE Menaker tahunan.
   - Masa kerja >= 12 bulan: 1 bulan upah (Pokok + Tunjangan Tetap).
   - Masa kerja 1 s/d <12 bulan: Prorata (Masa kerja / 12 * 1 bulan upah).
   - Ketentuan pekerja harian lepas / upah borongan.
   - Ketentuan PPh 21 atas THR (TER atas total penghasilan bruto bulan penerimaan THR).
6. Perhitungan Lembur:
   - PP No. 35/2021.
   - Upah lembur per jam = 1/173 x Upah Sebulan (Upah Pokok + Tunjangan Tetap).
   - Rate hari kerja biasa: Jam ke-1 = 1.5x, Jam ke-2 dst = 2.0x.
   - Rate hari istirahat mingguan / libur resmi (6 hari kerja & 5 hari kerja) detail jam ke-1 s/d jam ke-11.
   - Syarat administratif: Surat Perintah Kerja Lembur (SPKL) dan batas maksimal lembur (4 jam/hari, 18 jam/minggu).
7. Cuti & Izin Berbayar:
   - Cuti tahunan: min 12 hari kerja setelah 12 bulan (UU No. 13/2003 & UU No. 6/2023).
   - Cuti melahirkan / maternitas: UU KIA (Kesejahteraan Ibu dan Anak) No. 4/2024 (hingga 6 bulan dengan ketentuan pembayaran upah 100% 3 bulan pertama, 100% bulan ke-4, 75% bulan ke-5 & 6).
   - Cuti keguguran (1.5 bulan).
   - Cuti/Izin penting berbayar: Menikah (3 hari), Menikahkan anak (2 hari), Khitanan/Baptis (2 hari), Istri melahirkan/keguguran (2 hari suami), Anggota keluarga meninggal (1-2 hari), Haid (1-2 hari).
8. Status Kepegawaian & Kompensasi / Pesangon:
   - PKWT vs PKWTT (PP No. 35/2021).
   - Uang Kompensasi PKWT: berakhirnya kontrak, rumus = Masa Kerja / 12 * 1 bulan upah.
   - Formula Pesangon, UPMK (Uang Penghargaan Masa Kerja), dan Uang Penggantian Hak (UPH) pada PHK dengan berbagai alasan (efisiensi, pailit, pensiun, pelanggaran) berdasarkan PP 35/2021.
9. Minimal 3 Contoh Perhitungan Numerik Langkah Demi Langkah yang Sangat Realistis:
   - Contoh 1: Karyawan Tetap (Gaji Pokok Rp8.500.000, Tunjangan Tetap Rp1.500.000, Status K/1, JKK 0.24%, Lembur 10 jam, Hitung BPJS, PPh 21 bulanan Januari-November via TER B, dan PPh 21 masa Desember).
   - Contoh 2: Karyawan Menerima Gaji + THR (Gaji Pokok Rp6.000.000, Tunjangan Rp1.000.000, Status TK/0, TER A, hitung pajak bulan biasa vs bulan THR).
   - Contoh 3: Karyawan PKWT Selesai Kontrak & Hitung Kompensasi PKWT + Lembur Hari Libur Nasional.
