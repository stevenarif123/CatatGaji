# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 02. PROFIL PENGGUNA MENDALAM (USER PERSONAS)

---

### 1. Ekosistem Persona Pengguna CatatGaji

CatatGaji melayani 4 profil pengguna utama yang membentuk ekosistem operasional penggajian dan manajemen SDM pada bisnis UMKM dan perusahaan berkembang di Indonesia:

```
+----------------------------------------------------------------------------------------------------+
|                                    EKOSISTEM PERSONA CATATGAJI                                     |
+----------------------------------------------------------------------------------------------------+
|  [ 1. Admin HR / Payroll ]  <--->  [ 2. Karyawan / Employee ]  <--->  [ 3. Pemilik Usaha / Owner ] |
|  * Setup Karyawan & Kontrak        * Absensi Mobile GPS/Selfie        * Review Dashboard Ringkasan |
|  * Eksekusi 4-Step Payroll         * Cek Slip Gaji PDF Terenkripsi    * Otorisasi & Approval PIN   |
|  * Distribusi Email & WhatsApp     * Ajukan Cuti & Lembur Mandiri     * Pantau Arus Kas Gaji & KPI |
|                                                                                                    |
|                                [ 4. Akuntan / Finance Staff ]                                      |
|                                * Rekonsiliasi Pajak PPh 21 TER & BPJS                              |
|                                * Ekspor CSV DJP Online e-Bupot 21/26                               |
|                                * Ekspor Jurnal Beban Gaji ke Software Akuntansi                    |
+----------------------------------------------------------------------------------------------------+
```

---

### 2. Persona 1: Admin HR & Payroll Officer

```
+----------------------------------------------------------------------------------------------------+
| FOTO PROFIL (ILUSTRASI) : Sari Rahmawati, S.M. (29 Tahun)                                          |
| JABATAN / PERAN         : HR & General Affairs Specialist                                          |
| ENTITAS PERUSAHAAN      : PT Kuliner Rasa Nusantara (Restoran & Kafe, 3 Cabang, 42 Karyawan)        |
| LOKASI                  : Tebet, Jakarta Selatan                                                   |
| PENGALAMAN KERJA        : 5 Tahun di Bidang Administrasi SDM & Penggajian                          |
+----------------------------------------------------------------------------------------------------+
```

#### 2.1 Profil & Karakteristik
Sari adalah pengelola tunggal administrasi SDM pada bisnis F&B yang sedang berkembang pesat. Ia bertanggung jawab atas seluruh siklus hidup karyawan (*employee lifecycle*), mulai dari rekrutmen, absensi harian, kontrak kerja PKWT, pengajuan lembur tim dapur dan pelayan, hingga perhitungan gaji bulanan.

- **Tingkat Kemahiran Teknologi (*Tech Savviness*)**: Sedang (*Intermediate*). Terbiasa menggunakan Microsoft Excel dengan rumus `VLOOKUP`, `SUMIF`, dan `IF` bertingkat, Google Workspace, serta aplikasi pesan WhatsApp Web. Tidak memiliki latar belakang pemrograman atau SQL.
- **Perangkat Kerja Utama**: Laptop Windows 11 (Google Chrome), smartphone Android (Samsung Galaxy A54).

#### 2.2 Tujuan Utama (Goals)
1. Menyelesaikan seluruh siklus penggajian bulanan tepat waktu (< 2 jam kerja) tanpa ada keterlambatan transfer pada tanggal gajian (tanggal 28 setiap bulan).
2. Memastikan pemotongan pajak PPh 21 TER (Kategori A/B/C) dan 5 iuran BPJS akurat 100% tanpa perlu menghitung tabel tarif secara manual.
3. Mendistribusikan slip gaji resmi berformat rapi dan aman ke seluruh 42 karyawan dalam hitungan detik tanpa harus mencetak kertas atau mengirim satu per satu via chat pribadi.
4. Merekap absensi dan menghitung jam lembur bertingkat PP 35/2021 secara otomatis tanpa selisih.

#### 2.3 Kendala Kritis & Frustrasi (Pain Points)
- **Terjebak Rumus Excel yang Rapuh**: File spreadsheet sering rusak atau salah referensi sel saat ada karyawan baru yang masuk atau karyawan yang naik gaji.
- **Kerumitan PPh 21 TER 2024 & Penyesuaian Desember**: Takut salah menentukan kategori TER karyawan dan stres menghadapi rekonsiliasi akhir tahun (Pasal 17) yang sering menghasilkan komplain pemotongan gaji dari karyawan.
- **Rekap Lembur yang Melelahkan**: Menghabiskan waktu 2 hari penuh di akhir bulan hanya untuk memvalidasi jam lembur tim operasional kafe dari kertas absensi manual atau mesin fingerprint.
- **Distribusi Slip Gaji Memakan Waktu**: Harus menyimpan 42 file PDF satu per satu dan mengirimkannya manual via WhatsApp pribadi, rawan salah kirim slip ke orang lain.

#### 2.4 Rutinitas Harian & Workflow Penggajian (Daily Tasks)
- **Harian**: Memeriksa keterlambatan karyawan, memvalidasi permohonan izin/sakit, dan mendata lembur harian tim operasional.
- **Tanggal 20–25 (Cut-off Absensi)**: Menarik data log kehadiran, mengunci absensi, dan menghitung total jam lembur yang disetujui.
- **Tanggal 26 (Eksekusi Payroll)**: Menjalankan kalkulasi gaji, memasukkan potongan kasbon, memeriksa PPh 21 & BPJS, lalu mengajukan ke Pemilik Usaha untuk disetujui.
- **Tanggal 28 (Gajian)**: Mengirimkan slip gaji digital dan membagikan laporan rekonsiliasi ke bagian akuntansi.

#### 2.5 Empathy Map (Sari Rahmawati)
- **Says**: *"Hitung gaji manual bikin saya lembur sampai larut malam tiap akhir bulan, takut banget kalau ada salah potong pajak."*
- **Thinks**: *"Pemerintah sering ganti regulasi, kenapa tidak ada software simpel yang otomatis update rumusnya?"*
- **Does**: *Mengecek ulang tabel TER PMK 168/2023 di internet berkali-kali untuk memastikan persentase potong gaji.*
- **Feels**: *Cemas jika ada karyawan komplain karena merasa uang lemburnya kurang atau pajaknya terlalu besar.*

#### 2.6 Kriteria Sukses Penggunaan CatatGaji
- Waktu proses payroll berkurang dari 16 jam kerja menjadi < 30 menit per bulan.
- Nol kesalahan kalkulasi lembur dan pajak PPh 21.
- Seluruh slip gaji terdistribusi secara instan via email & WhatsApp blast.

---

### 3. Persona 2: Karyawan / Employee (Self-Service)

```
+----------------------------------------------------------------------------------------------------+
| FOTO PROFIL (ILUSTRASI) : Budi Prasetyo (26 Tahun)                                                 |
| JABATAN / PERAN         : Barista Senior & Staf Operasional Cabang Tebet                            |
| ENTITAS PERUSAHAAN      : PT Kuliner Rasa Nusantara                                                |
| LOKASI                  : Tebet, Jakarta Selatan                                                   |
| STATUS KEPEGAWAIAN      : PKWT (Kontrak 1 Tahun), PTKP: TK/0                                       |
+----------------------------------------------------------------------------------------------------+
```

#### 3.1 Profil & Karakteristik
Budi adalah staf garis depan yang bekerja dengan sistem shift (Pagi: 07.00–15.00, Sore: 15.00–23.00). Ia mengandalkan penghasilan bulanan yang terdiri dari gaji pokok, tunjangan kehadiran, dan uang lembur untuk membiayai kebutuhan hidup dan tabungan keluarga.

- **Tingkat Kemahiran Teknologi (*Tech Savviness*)**: Tinggi untuk aplikasi mobile (Instagram, TikTok, Gojek, mobile banking), namun enggan menggunakan sistem yang rumit di peramban desktop.
- **Perangkat Kerja Utama**: Smartphone Android (Xiaomi Redmi Note 12).

#### 3.2 Tujuan Utama (Goals)
1. Melakukan pencatatan kehadiran (clock-in/clock-out) secara cepat dan praktis di lokasi kafe menggunakan smartphone tanpa harus antre di mesin sidik jari.
2. Menerima dan melihat rincian slip gaji bulanan secara transparan dan aman, khususnya memastikan jam lembur dan potongan BPJS dihitung dengan benar.
3. Mengajukan cuti tahunan, izin sakit, atau klaim lembur langsung dari aplikasi ponsel dan mengetahui status persetujuan secara *real-time*.
4. Mengunduh slip gaji resmi berproteksi kata sandi untuk keperluan pengajuan sewa/kredit tanpa perlu meminta berulang kali ke HR.

#### 3.3 Kendala Kritis & Frustrasi (Pain Points)
- **Mesin Fingerprint Sering Error**: Sidik jari sering tidak terbaca saat tangan basah atau mesin kotor, berakibat dianggap absen atau terlambat.
- **Ketidakpastian Status Lembur**: Sering tidak tahu apakah jam lembur yang sudah dikerjakan disetujui oleh manajer cabang sebelum hari gajian tiba.
- **Slip Gaji Fisik Rawan Hilang**: Slip gaji kertas sering basah, robek, atau hilang di loker kerja.
- **Sulit Memeriksa Sisa Saldo Cuti**: Harus menanyakan ke HR lewat chat WhatsApp setiap kali ingin merencanakan liburan atau keperluan keluarga.

#### 3.4 Empathy Map (Budi Prasetyo)
- **Says**: *"Saya mau tahu uang lembur saya bulan ini berapa dan sisa cuti saya ada berapa hari lagi."*
- **Thinks**: *"Semoga potongan pajak dan BPJS saya transparan, jangan sampai gaji saya dipotong tanpa rincian jelas."*
- **Does**: *Mencatat jam lembur sendiri di buku saku untuk mencocokkan dengan transfer gaji di bank.*
- **Feels**: *Kecewa jika hasil jerih payah lembur tidak terbayar penuh karena alasan administrasi yang terlewat.*

#### 3.5 Kriteria Sukses Penggunaan CatatGaji
- Proses clock-in GPS & selfie selesai dalam waktu < 5 detik.
- Slip gaji digital langsung diterima di WhatsApp/Email tepat pada tanggal gajian.
- Sisa saldo cuti dan status lembur terpantau transparan di aplikasi mobile.

---

### 4. Persona 3: Pemilik Usaha / Business Owner

```
+----------------------------------------------------------------------------------------------------+
| FOTO PROFIL (ILUSTRASI) : Hendra Wijaya (42 Tahun)                                                 |
| JABATAN / PERAN         : Founder & Direktur Utama                                                 |
| ENTITAS PERUSAHAAN      : PT Maju Bersama Logistik (Armada Ekspedisi & Gudang, 55 Karyawan)         |
| LOKASI                  : Cikarang, Jawa Barat                                                     |
| LATAR BELAKANG          : Pengusaha Operasional & Distribusi Logistik                              |
+----------------------------------------------------------------------------------------------------+
```

#### 4.1 Profil & Karakteristik
Hendra adalah pendiri bisnis logistik yang mengelola puluhan armada truk dan staf gudang. Fokus utamanya adalah ekspansi bisnis, kepuasan klien, kepatuhan hukum ketenagakerjaan, dan pengendalian arus kas (*cash flow*). Ia tidak memiliki waktu untuk memeriksa ratusan baris data excel gaji karyawan.

- **Tingkat Kemahiran Teknologi (*Tech Savviness*)**: Menengah (*Business-oriented*). Menggunakan iPad dan smartphone untuk memantau performa bisnis, WhatsApp Business, dan Internet Banking Korporasi (BCA KlikBCA Bisnis / Mandiri MCM).
- **Perangkat Kerja Utama**: iPhone 15 Pro, iPad Pro, MacBook Air.

#### 4.2 Tujuan Utama (Goals)
1. Menyetujui (*approve*) penggajian bulanan dengan cepat dan aman melalui ponsel setelah melihat ringkasan total beban gaji, pajak, dan iuran BPJS.
2. Memastikan kepatuhan hukum 100% terhadap regulasi Depnaker dan Ditjen Pajak untuk melindungi perusahaan dari sanksi hukum atau denda audit.
3. Memantau tren biaya lembur dan turnover karyawan antar cabang operasional untuk mendeteksi inefisiensi biaya secara dini.
4. Menjaga kerahasiaan data gaji karyawan agar tidak bocor dan memicu kecemburuan sosial internal.

#### 4.3 Kendala Kritis & Frustrasi (Pain Points)
- **Ketakutan Terhadap Kebocoran Data Gaji**: Khawatir file Excel kompensasi staf terbuka oleh pihak yang tidak berhak.
- **Pembengkakan Biaya Lembur Tanpa Kontrol**: Biaya lembur gudang sering melonjak tajam tanpa justifikasi yang jelas dari supervisor lapangan.
- **Ketergantungan Tinggi pada Staf HR**: Jika staf HR cuti atau resign mendadak, proses penggajian perusahaan bisa lumpuh total karena rumus hanya dipahami oleh satu orang.
- **Ketidakpastian Kewajiban Akrual Finansial**: Sulit memproyeksikan kebutuhan kas untuk THR keagamaan dan kompensasi akhir kontrak PKWT puluhan staf gudang.

#### 4.4 Empathy Map (Hendra Wijaya)
- **Says**: *"Saya ingin bisnis saya 100% taat hukum, tapi saya butuh sistem yang tidak merepotkan dan bisa saya approve dari HP kapan saja."*
- **Thinks**: *"Berapa total biaya operasional gaji bulan ini dibanding bulan lalu? Apakah ada pembengkakan lembur yang tidak wajar?"*
- **Does**: *Meminta staf HR membuatkan ringkasan 1 halaman sebelum menyetujui transfer dana bank.*
- **Feels**: *Tenang jika kepatuhan pajak dan jaminan sosial karyawan terkelola dengan aman dan profesional.*

#### 4.5 Kriteria Sukses Penggunaan CatatGaji
- Waktu review dan persetujuan payroll tuntas dalam waktu < 3 menit via mobile dashboard.
- Deteksi anomali biaya lembur > 10% langsung ter-highlight otomatis.
- Jaminan keamanan data level bank dengan enkripsi AES-256 dan kepatuhan UU PDP.

---

### 5. Persona 4: Akuntan & Finance/Tax Staff

```
+----------------------------------------------------------------------------------------------------+
| FOTO PROFIL (ILUSTRASI) : Dewi Lestari, S.Ak., BKP (34 Tahun)                                      |
| JABATAN / PERAN         : Senior Finance & Tax Officer                                             |
| ENTITAS PERUSAHAAN      : PT Ritel Modern Distribusi (Ritel 5 Toko, 85 Karyawan)                   |
| LOKASI                  : Surabaya, Jawa Timur                                                     |
| KEAHLIAN                : Brevet Pajak A/B, Akuntansi Keuangan Double-Entry, e-SPT / e-Bupot       |
+----------------------------------------------------------------------------------------------------+
```

#### 5.1 Profil & Karakteristik
Dewi bertanggung jawab atas pembukuan keuangan, rekonsiliasi kas/bank, pelaporan SPT Masa PPh 21 bulanan ke DJP Online, pelaporan iuran BPJS, dan penutupan buku bulanan (*month-end closing*).

- **Tingkat Kemahiran Teknologi (*Tech Savviness*)**: Sangat Tinggi (*Power User*). Mahir menggunakan software akuntansi (Mekari Jurnal, Accurate Online, Xero), portal DJP Online e-Bupot 21/26, portal SIPP BPJS TK, dan manipulasi data lanjutan (*Pivot Table, Power Query*).
- **Perangkat Kerja Utama**: Dual Monitor Desktop Setup (Windows 11, MS Excel, Browser Chrome).

#### 5.2 Tujuan Utama (Goals)
1. Mengunduh file ekspor CSV yang 100% kompatibel dengan skema impor e-Bupot 21/26 DJP Online tanpa perlu memformat ulang delimiter atau urutan kolom secara manual.
2. Memperoleh bukti potong Formulir 1721-A1 tahunan siap cetak/unduh untuk seluruh karyawan tetap pada akhir tahun pajak.
3. Mengimpor jurnal akuntansi beban gaji (*double-entry balancing*) yang memisahkan secara tepat porsi beban perusahaan vs potongan utang karyawan langsung ke software akuntansi.
4. Melakukan rekonsiliasi cepat antara total mutasi bank dengan rincian Take Home Pay karyawan.

#### 5.3 Kendala Kritis & Frustrasi (Pain Points)
- **Error Format CSV DJP Online**: Berkas CSV sering ditolak oleh sistem DJP Online akibat kesalahan delimiter (koma vs titik koma), format NIK 16 digit yang berubah menjadi notasi ilmiah (`3.17E+15`), atau kode objek pajak yang salah.
- **Pencatatan Akuntansi BPJS Sering Tertukar**: Sering terjadi kebingungan dalam memisahkan beban perusahaan (JKK, JKM, JHT 3.7%, JP 2%, Kes 4%) dengan potongan gaji karyawan (JHT 2%, JP 1%, Kes 1%), sehingga neraca keuangan tidak seimbang.
- **Kekacauan Masa Pajak Desember**: Rekonsiliasi manual PPh 21 Pasal 17 di akhir tahun memakan waktu berminggu-minggu dan rawan selisih saldo utang pajak.

#### 5.4 Empathy Map (Dewi Lestari)
- **Says**: *"Saya butuh data yang presisi sampai digit rupiah terakhir. Jika format CSV pajak tidak standar, pekerjaan saya terhambat total."*
- **Thinks**: *"Semoga jurnal beban gaji debit dan kreditnya langsung balance dan bisa saya integrasikan ke software akuntansi dalam sekali klik."*
- **Does**: *Memeriksa ulang setiap baris NIK, NPWP, dan jumlah bruto pajak sebelum mengunggah ke DJP Online.*
- **Feels**: *Puas jika laporan pajak dan jurnal akuntansi selesai sebelum tanggal 10 setiap bulan tanpa ada revisi.*

#### 5.5 Kriteria Sukses Penggunaan CatatGaji
- File CSV e-Bupot 21/26 berhasil diimpor ke DJP Online pada percobaan pertama (*100% first-time pass rate*).
- Ekspor jurnal double-entry seimbang (*balance debit = credit*) siap impor ke software akuntansi.
- Pembagian beban jaminan sosial terinci transparan antara akun beban operasional dan akun utang lancar.

---

### 6. Matriks Perbandingan Kebutuhan Antar Persona

| Dimensi Kebutuhan | Sari (Admin HR) | Budi (Karyawan) | Hendra (Pemilik Usaha) | Dewi (Akuntan/Pajak) |
|---|---|---|---|---|
| **Perangkat Utama** | Web Desktop | Mobile App (PWA/Android) | Mobile Web / Tablet | Web Desktop (Dual Monitor) |
| **Fitur Prioritas #1** | 4-Step Payroll Wizard | Absensi GPS Selfie | Ringkasan Biaya & PIN Approval | Ekspor CSV DJP e-Bupot |
| **Fitur Prioritas #2** | Kalkulasi Lembur PP 35 | Slip Gaji PDF (PIN) | Anomali Biaya Lembur | Jurnal Double-Entry CSV |
| **Fitur Prioritas #3** | Pengingat Kontrak PKWT | Pengajuan Cuti Mandiri | Kepatuhan Hukum & Privasi | Formulir 1721-A1 Massal |
| **Frekuensi Akses** | Setiap hari kerja | Setiap hari (2x sehari) | 2–4 kali sebulan | Setiap akhir/awal bulan |
| **Izin Akses (RBAC)** | `HR_ADMIN` | `EMPLOYEE` | `COMPANY_OWNER` | `FINANCE_PAYROLL` |
