# Dokumen Peluang Peningkatan & Roadmap v2.0 Enterprise CatatGaji

Dokumen ini merangkum seluruh ide inovasi, peluang perluasan fitur, dan peta jalan (*roadmap*) pengembangan **CatatGaji** untuk fase berikutnya (v2.0 Enterprise).

---

## 1. Status Baseline Saat Ini (Fase v1.0 - Selesai 100%)
Seluruh modul dasar dan regulasi utama Indonesia telah diimplementasikan secara penuh:
- ✅ **Core Payroll Engine PMK 168/2023**: 125 Layer TER Kategori A, B, C ($0\% - 34\%$), metode Netto/Gross/Gross-up, Rekonsiliasi Pasal 17 HPP Masa Desember (selisih Rp 0).
- ✅ **Ketenagakerjaan PP 35/2021**: Formula lembur bertingkat ($1.5\times, 2\times, 3\times, 4\times$) berdasar pembagi standar $1/173 \times \text{Gaji Pokok}$.
- ✅ **Absensi & ESS Mobile**: Geofencing GPS Haversine, evaluasi selfie liveness, parser CSV fingerprint, dan Portal Mandiri Karyawan.
- ✅ **Pelaporan Resmi DJP & BPJS**: Ekspor CSV e-Bupot 21/26 DJP Online, Formulir Bukti Potong 1721-A1, CSV SIPP BPJS TK Formulir F2A, CSV E-Dabu BPJS Kesehatan (plafon Rp 12.000.000,-).
- ✅ **Jurnal Akuntansi PSAK Double-Entry Seimbang**: Ekspor format siap impor Mekari Jurnal dan Accurate Online.
- ✅ **Batch Transfer Payroll Bank**: Format CSV massal KlikBCA Bisnis, Mandiri MCM 2.0, BRI CMS, dan BNI Direct.
- ✅ **Approval Workflow & Keamanan**: Matriks persetujuan berjenjang (Supervisor $\rightarrow$ HR Admin/Owner), delegasi wewenang sementara, otorisasi PIN 6-digit Owner, dan Log Audit Forensik Tak Dapat Diubah (UU PDP No. 27/2022).

---

## 2. Rincian Peluang Peningkatan (Roadmap v2.0 Enterprise)

### A. Generator Kalkulasi THR & Bonus Prorata Otomatis (Permenaker No. 6/2016)
- **Tujuan**: Memudahkan HR dan Pemilik Bisnis menghitung Tunjangan Hari Raya Keagamaan (Idul Fitri, Natal, dsb) secara otomatis menjelang hari raya.
- **Logika Bisnis**:
  - Masa kerja $\ge 12$ bulan: Mendapatkan $1 \times \text{Upah Sebulan}$ (Gaji Pokok + Tunjangan Tetap).
  - Masa kerja $1 - 12$ bulan: Dihitung secara prorata dengan formula $\frac{\text{Masa Kerja (Bulan)}}{12} \times \text{Upah Sebulan}$.
  - Masa kerja $< 1$ bulan: Dikecualikan dari kewajiban THR.
- **Pajak PPh 21**: Dihitung otomatis sebagai penghasilan tidak teratur menggunakan skema TER yang sesuai.

---

### B. Distribusi Slip Gaji Otomatis (WhatsApp Business Gateway & Email Blast)
- **Tujuan**: Otomatisasi pengiriman berkas slip gaji PDF berkeamanan sandi langsung ke genggaman karyawan begitu payroll disahkan oleh Owner.
- **Pilihan Integrasi**:
  - **WhatsApp API**: Integrasi dengan provider lokal (Fonnte, Wablas, atau WhatsApp Cloud API Meta).
  - **Email SMTP**: Pengiriman email otomatis dengan lampiran file PDF slip gaji terenkripsi password (tanggal lahir / NIK karyawan).

---

### C. Pembayaran Gaji Instan / Direct Disbursement (Open Banking API SNAP BI / Payment Gateway)
- **Tujuan**: Mengeksekusi transfer gaji ke rekening ratusan karyawan secara instan dalam 1 kali klik tanpa perlu mengunggah berkas CSV batch secara manual ke portal internet banking bank.
- **Pilihan Integrasi**:
  - **Payment Gateway Disbursement**: Integrasi API Disbursement (Xendit / Midtrans / Oy! Indonesia).
  - **Standar Nasional Open Banking SNAP BI**: Integrasi direct host-to-host API dengan perbankan nasional (BCA, Mandiri, BRI, BNI).

---

### D. Perluasan Skema Pajak PPh 21 Tenaga Ahli & Bukan Pegawai
- **Tujuan**: Mengakomodasi skema penggajian tenaga profesional independen dan dewan pengawas.
- **Kategori Tambahan**:
  - **Tenaga Ahli (Dokter, Pengacara, Konsultan, Akuntan, Notaris, Arsitek)**: Dasar Pengenaan Pajak (DPP) $= 50\% \times \text{Penghasilan Bruto}$, dikenakan tarif Pasal 17 progresif secara berkesinambungan/tidak berkesinambungan.
  - **Dewan Komisaris / Pengawas Non-Eksekutif**: Perhitungan PPh 21 atas honorarium tanpa status pegawai tetap.
  - **Mantan Pegawai (Bonus / Tantiem Purna Tugas)**: Pemotongan PPh 21 Final / Non-Final atas penghasilan kumulatif.

---

### E. PWA (Progressive Web App), Push Notification & Offline Sync untuk Portal ESS
- **Tujuan**: Meningkatkan kenyamanan karyawan saat absensi di lapangan atau saat jaringan internet tidak stabil.
- **Fitur Teknis**:
  - **Service Worker & Manifest PWA**: Pengguna dapat menambahkan CatatGaji langsung ke layar utama (*Add to Home Screen*) di smartphone Android dan iOS tanpa install lewat Google Play / App Store.
  - **Web Push Notifications**: Notifikasi pengingat otomatis setiap pagi (misal jam 07:45) untuk *Clock-In* dan sore hari untuk *Clock-Out*.
  - **Background Offline Sync**: Menyimpan data absensi selfie & koordinat GPS saat offline, lalu mengirimkannya otomatis ketika smartphone kembali terhubung ke internet.

---

## 3. Matriks Prioritas Pengembangan

| Inisiatif Fitur | Dampak Bisnis (*Impact*) | Kompleksitas Teknis (*Effort*) | Rekomendasi Prioritas |
| :--- | :---: | :---: | :---: |
| **Kalkulator THR Prorata Permenaker 6/2016** | Tinggi (Kebutuhan tahunan HR) | Rendah | ⭐ **Prioritas 1** |
| **WhatsApp / Email Slip Gaji Otomatis** | Sangat Tinggi (Kepuasan Karyawan) | Sedang | ⭐ **Prioritas 2** |
| **PWA & Notifikasi Pengingat Absensi** | Tinggi (Disiplin Karyawan) | Sedang | ⭐ **Prioritas 3** |
| **PPh 21 Tenaga Ahli & Bukan Pegawai** | Menengah (Untuk industri jasa) | Sedang | ⭐ **Prioritas 4** |
| **Disbursement API (SNAP BI / Gateway)** | Sangat Tinggi (Otomasi perbankan) | Tinggi (Butuh registrasi merchant) | ⭐ **Prioritas 5** |

---

*Dokumen ini disusun sebagai referensi perancangan dan dapat ditinjau kembali kapan saja sebelum memulai fase pengembangan berikutnya.*
