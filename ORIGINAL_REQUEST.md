# Original User Request

## 2026-08-17T13:12:51Z

Lakukan riset mendalam tentang regulasi penggajian di Indonesia dan buat PRD (Product Requirements Document) yang sangat lengkap dan siap eksekusi untuk aplikasi pencatatan gaji bernama "CatatGaji". Aplikasi ini adalah multi-tenant SaaS yang ditargetkan untuk perusahaan kecil di Indonesia. PRD harus mencakup semua aspek penggajian yang berlaku di Indonesia dan siap digunakan oleh tim developer untuk langsung membangun aplikasi. Seluruh dokumen harus ditulis dalam **Bahasa Indonesia**.

Working directory: d:\Projects\CatatGaji
Integrity mode: development

## Requirements

### R1. Riset Regulasi Penggajian Indonesia
Lakukan riset komprehensif tentang seluruh regulasi penggajian yang berlaku di Indonesia per tahun 2024-2025, mencakup:
- **PPh 21**: Tarif efektif rata-rata (TER) yang berlaku sejak Januari 2024 (PP 58/2023, PMK 168/2023), mekanisme perhitungan bulanan dan tahunan, PTKP terbaru, tarif progresif Pasal 17, dan perlakuan khusus untuk pegawai tidak tetap, pesangon, dan natura
- **BPJS Ketenagakerjaan**: Persentase iuran JHT, JKK (per kelas risiko), JKM, dan JP (termasuk batas upah JP), serta siapa yang menanggung (pemberi kerja vs pekerja)
- **BPJS Kesehatan**: Persentase iuran, batas upah maksimum, dan regulasi terbaru
- **Upah Minimum**: UMR/UMP/UMK dan ketentuannya per UU Cipta Kerja
- **THR**: Ketentuan pembayaran THR sesuai Permenaker
- **Lembur**: Rumus perhitungan lembur sesuai PP 35/2021
- **Cuti**: Hak cuti tahunan, cuti melahirkan, dan cuti khusus lainnya
- **PKWT/PKWTT**: Perbedaan status kepegawaian dan dampaknya pada komponen gaji
- **Pesangon dan kompensasi**: Ketentuan PHK sesuai UU Cipta Kerja

### R2. PRD Lengkap dan Siap Eksekusi
Buat PRD yang sangat detail dengan struktur berikut:
- **Executive Summary**: Visi produk, target pasar, value proposition
- **User Personas**: Minimal 4 persona (Admin HR, Karyawan, Pemilik Usaha, Akuntan/Finance)
- **User Stories**: User stories lengkap per persona dengan prioritas (MoSCoW)
- **Deskripsi Fitur Detail** untuk setiap modul:
  - Manajemen Data Karyawan (HRIS dasar)
  - Pencatatan Kehadiran/Absensi
  - Perhitungan Gaji (semua komponen: gaji pokok, tunjangan, potongan, lembur, PPh 21, BPJS)
  - Slip Gaji Digital
  - Approval Workflow (lembur, cuti, perubahan data)
  - Pelaporan Pajak (termasuk konsep integrasi e-SPT/DJP Online)
  - Dashboard & Analytics
  - Multi-tenant management
- **Wireframe Descriptions**: Deskripsi detail setiap halaman/layar utama, termasuk layout, komponen UI, dan user flow
- **Data Model**: ERD lengkap dengan deskripsi setiap tabel, relasi, dan field penting
- **API Specifications**: Daftar endpoint utama dengan request/response schema
- **Rekomendasi Platform & Tech Stack**: Sertakan analisis kelebihan/kekurangan untuk opsi web, mobile, dan desktop
- **Non-Functional Requirements**: Performa, keamanan data (termasuk kepatuhan UU PDP), skalabilitas
- **Roadmap**: Fase pengembangan yang disarankan (MVP → v1 → v2)
- **Lampiran Formula**: Semua rumus perhitungan (PPh 21 TER, BPJS, lembur, THR, pesangon) dengan contoh perhitungan numerik yang jelas

### R3. Akurasi dan Kelengkapan Regulasi
Setiap formula perhitungan dan aturan bisnis yang ditulis dalam PRD harus merujuk pada regulasi spesifik (nomor UU/PP/PMK/Permenaker). Sertakan disclaimer jika ada regulasi yang mungkin berubah dan mekanisme bagaimana aplikasi bisa mengakomodasi perubahan regulasi di masa depan.

## Acceptance Criteria

### Kelengkapan Riset Regulasi
- [ ] Dokumen mencakup minimal 8 area regulasi: PPh 21 (TER), BPJS Ketenagakerjaan (4 program), BPJS Kesehatan, UMR, THR, Lembur, Cuti, dan PKWT/PKWTT
- [ ] Setiap regulasi menyebutkan sumber hukum spesifik (nomor UU/PP/PMK/Permenaker)
- [ ] Terdapat minimal 3 contoh perhitungan numerik lengkap (PPh 21, BPJS, dan Lembur) dengan angka yang realistis dan langkah-langkah yang jelas

### Kelengkapan PRD
- [ ] PRD memiliki minimal 8 modul fitur yang dideskripsikan secara detail
- [ ] Terdapat minimal 20 user stories yang mencakup semua persona
- [ ] Data model mencakup minimal 15 entitas/tabel dengan deskripsi field
- [ ] Terdapat deskripsi wireframe untuk minimal 10 halaman/layar utama
- [ ] API specifications mencakup minimal 20 endpoint utama
- [ ] Roadmap terbagi minimal dalam 3 fase dengan deliverables yang jelas per fase

### Kualitas dan Konsistensi
- [ ] Seluruh dokumen ditulis dalam Bahasa Indonesia yang baik dan profesional
- [ ] Tidak ada kontradiksi antara formula di bagian riset dan aturan bisnis di bagian PRD
- [ ] Setiap fitur memiliki acceptance criteria sendiri yang bisa diverifikasi
- [ ] PRD menyertakan pertimbangan keamanan data sesuai UU PDP (Perlindungan Data Pribadi)
- [ ] Dokumen menyertakan rekomendasi platform dengan analisis trade-off

### Verifikasi Output
- [ ] Output berupa file-file markdown yang terorganisir dalam folder yang logis (misalnya: /riset, /prd, /lampiran)
- [ ] Semua formula matematika ditulis dengan notasi yang jelas dan konsisten
- [ ] Terdapat table of contents atau index yang memudahkan navigasi
