# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 05. DESKRIPSI FITUR RINCI (MODUL 5 SAMPAI MODUL 8)

---

### MODUL 5: APPROVAL WORKFLOW, KEBIJAKAN & DELEGASI

Modul Approval Workflow memastikan tata kelola operasional ketenagakerjaan dan otorisasi pengeluaran finansial berjalan secara berjenjang, transparan, dan akuntabel.

```
+----------------------------------------------------------------------------------------------------+
|                                    MATRIKS ALUR APPROVAL SISTEM                                    |
+----------------------+--------------------+-----------------------------+--------------------------+
| Jenis Pengajuan      | Level 1 Approval   | Level 2 Approval            | Final Approval           |
+----------------------+--------------------+-----------------------------+--------------------------+
| **Lembur (SPKL)**    | Supervisor Cabang  | Admin HR                    | Otomatis masuk payroll   |
| **Cuti / Izin**      | Atasan Langsung    | Admin HR (Saldo kuota)      | Rekap absensi terupdate  |
| **Kasbon / Pinjaman**| Admin HR           | Finance / Akuntan           | Pemilik Usaha (Owner)    |
| **Payroll Bulanan**  | Admin HR (Submit)  | Finance (Verifikasi Pajak)  | Pemilik Usaha (PIN Auth) |
+----------------------+--------------------+-----------------------------+--------------------------+
```

#### 5.1 Alur Persetujuan Lembur (SPKL Workflow)
1. **Inisiasi SPKL**: Karyawan atau Supervisor membuat draft pengajuan Surat Perintah Kerja Lembur (SPKL) sebelum atau sesudah pekerjaan lembur dilakukan, mencantumkan tanggal, estimasi jam mulai/selesai, dan uraian tugas spesifik.
2. **Review Supervisor**: Supervisor cabang memverifikasi urgensi operasional dan kehadiran aktual karyawan di lokasi.
3. **Validasi HR**: Admin HR menyetujui, dan engine CatatGaji otomatis menghitung jam lembur efektif bertingkat ($1,5\times, 2,0\times, 3,0\times, 4,0\times$) sesuai PP No. 35/2021 untuk dimasukkan ke periode penggajian berjalan.

#### 5.2 Alur Persetujuan Cuti & Izin Sakit
1. **Pengajuan Online**: Karyawan mengajukan jenis cuti, tanggal mulai/selesai, alasan, dan berkas lampiran (Surat Dokter / Dokumen Pendukung) melalui smartphone.
2. **Pemeriksaan Saldo Otomatis**: Sistem secara *real-time* memvalidasi ketersediaan saldo cuti tahunan dan aturan batas hari berurutan.
3. **Approval Atasan**: Notifikasi dikirimkan ke atasan langsung. Setelah disetujui, kuota cuti berkurang secara instan dan status tanggal tersebut terkunci sebagai izin sah pada rekap kehadiran bulanan.

#### 5.3 Otorisasi Final Payroll Bulanan (PIN Security & Immutability)
1. **Pengajuan Payroll (HR Submit)**: Setelah menyelesaikan wizard penggajian 4 langkah, Admin HR melakukan *Submit for Approval*.
2. **Review Ringkasan Eksekutif**: Pemilik Usaha menerima notifikasi instan via email/WhatsApp dan membuka layar ringkasan approval di ponsel/tablet.
3. **Otentikasi PIN 6 Digit**: Pemilik Usaha menyetujui dengan memasukkan 6 digit PIN Otorisasi Transaksi.
4. **Penguncian Angka (Calculation Immutability)**: Setelah disetujui, status periode berubah menjadi `APPROVED` / `LOCKED`. Seluruh data perhitungan disimpan dalam snapshot JSON permanen dan tidak dapat diubah oleh siapapun tanpa otorisasi pembatalan khusus (*super-admin unlock*).
5. **Mekanisme Penolakan & Catatan Revisi**: Jika terdapat ketidaksesuaian, Owner dapat menolak pengajuan dengan menyertakan catatan revisi yang langsung mengembalikan status ke `DRAFT` bagi Admin HR.

#### 5.4 Delegasi Wewenang Sementara (Approval Delegation)
Apabila manajer/supervisor mengambil cuti panjang atau dinas luar kota, fitur delegasi memungkinkan pengalihan hak persetujuan (*delegated approver*) ke rekan kerja setingkat selama periode waktu tertentu secara otomatis.

---

### MODUL 6: PELAPORAN PAJAK & KEPATUHAN REGULASI (DJP & BPJS)

Modul Pelaporan Pajak dan Jaminan Sosial menyederhanakan kewajiban kepatuhan hukum (*regulatory compliance*) perusahaan terhadap Direktorat Jenderal Pajak (DJP) dan Badan Penyelenggara Jaminan Sosial (BPJS).

```
+----------------------------------------------------------------------------------------------------+
|                                  INTEGRASI PELAPORAN REGULASI                                      |
+----------------------------------------------------------------------------------------------------+
| [ 1. DJP e-BUPOT 21/26 ]  -> Ekspor CSV Skema Resmi (Kode Objek Pajak 21-100-01 & 21-100-02)        |
| [ 2. FORMULIR 1721-A1 ]   -> Bukti Potong Tahunan Karyawan Tetap (PDF Siap Cetak & ZIP Terenkripsi)|
| [ 3. BPJS SIPP ONLINE ]   -> Format Rekapitulasi Iuran 4 Program Jamsostek (Formulir F2A)          |
| [ 4. BPJS KES E-DABU ]    -> Format Rekapitulasi Iuran 5% BPJS Kesehatan (Pemberi Kerja + Pekerja) |
+----------------------------------------------------------------------------------------------------+
```

#### 6.1 Ekspor Berkas CSV e-Bupot 21/26 DJP Online
CatatGaji menghasilkan berkas CSV impor resmi yang 100% kompatibel dengan sistem **e-Bupot 21/26 DJP Online**:
- **Struktur Kolom Standar**:
  - Kolom 1: NPWP / NIK Pemotong Pajak (Perusahaan).
  - Kolom 2: NIK 16 digit / NPWP 16/15 digit Penerima Penghasilan.
  - Kolom 3: Nama Lengkap Penerima Penghasilan.
  - Kolom 4: Kode Objek Pajak (`21-100-01` untuk Pegawai Tetap, `21-100-02` untuk Pegawai Tidak Tetap/Freelance).
  - Kolom 5: Jumlah Penghasilan Bruto Kena Pajak.
  - Kolom 6: Tarif Pajak (Persentase TER bulanan atau Tarif Efektif).
  - Kolom 7: Jumlah PPh 21 yang Dipotong.
- **Konfigurasi Delimiter**: Pengguna dapat memilih delimiter koma (`,`) atau titik koma (`;`) sesuai preferensi regional browser dan aplikasi DJP.

#### 6.2 Pembuatan Massal Formulir 1721-A1 Tahunan
Pada akhir tahun pajak (bulan Desember atau masa pajak terakhir bagi karyawan yang resign), sistem secara otomatis mengompilasi:
- Total Penghasilan Bruto Setahun (Gaji, Tunjangan, Lembur, Bonus, THR, Premi BPJS).
- Pengurang Biaya Jabatan (5% dari Bruto, maksimal Rp 6.000.000,-/tahun).
- Pengurang Iuran Pensiun & JHT yang dibayar sendiri oleh pekerja setahun penuh.
- Penghasilan Neto Setahun dan Penghasilan Kena Pajak (PKP) setelah dikurangi PTKP tahunan.
- PPh 21 Terutang Pasal 17 ayat (1) huruf a UU HPP dan PPh 21 yang telah dipotong.
Dokumen Formulir 1721-A1 diterbitkan dalam format PDF standar Ditjen Pajak dan dapat diunduh massal dalam 1 arsip ZIP terenkripsi untuk dibagikan kepada karyawan.

#### 6.3 Rekapitulasi & Ekspor Laporan Iuran BPJS
- **BPJS Ketenagakerjaan (SIPP Online / Formulir F2A)**: Berkas rekapitulasi iuran JKK, JKM, JHT, dan JP per karyawan dengan format yang siap diunggah ke portal SIPP.
- **BPJS Kesehatan (E-Dabu)**: Laporan rincian iuran 5% (4% pemberi kerja + 1% pekerja) lengkap dengan nomor kartu kepesertaan 13 digit dan plafon maksimal Rp 12.000.000,-.

---

### MODUL 7: DASHBOARD ANALYTICS & JURNAL AKUNTANSI

Modul Analytics dan Jurnal Finansial memberikan visibilitas menyeluruh terhadap struktur biaya kompensasi organisasi dan mempermudah rekonsiliasi pembukuan akuntansi keuangan.

```
+----------------------------------------------------------------------------------------------------+
|                                    DASHBOARD ANALYTICS EKSEKUTIF                                   |
+----------------------------------------------------------------------------------------------------+
| [ TOTAL PAYROLL COST ]    [ TOTAL LEMBUR BULAN INI ]    [ TOTAL PAJAK PPh 21 ]    [ TURNOVER RATE ]|
| Rp 245.850.000            Rp 18.420.000 (▲ 8.5%)        Rp 6.120.000              2.4% (Stabil)    |
|                                                                                                    |
| +-----------------------------------------------+------------------------------------------------+ |
| | TREN PENGELUARAN GAJI 12 BULAN TERAKHIR       | KOMPOSISI BIAYA KOMPENSASI PER CABANG          | |
| | [Grafik Area: Gaji Pokok + Lembur + BPJS]     | [Grafik Donut: Cabang Jkt, Sby, Bdg, Cikarang] | |
| +-----------------------------------------------+------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### 7.1 Metrik Finansial & Operasional Eksekutif
1. **Grand Total Payroll Cost**: Total pengeluaran kas riil perusahaan = $\text{Take Home Pay Karyawan} + \text{Total PPh 21} + \text{Total Iuran BPJS (Perusahaan + Pekerja)}$.
2. **Overtime Cost Ratio**: Persentase biaya lembur terhadap total gaji pokok (peringatan jika $> 15\%$).
3. **Turnover & Headcount Growth**: Jumlah karyawan aktif, karyawan masuk baru, dan karyawan berhenti/habis kontrak.
4. **Distribusi Kompensasi Cabang**: Perbandingan beban gaji antar unit outlet/cabang untuk analisis efisiensi unit bisnis.

#### 7.2 Ekspor Jurnal Akuntansi Double-Entry Seimbang (Balanced)
CatatGaji mengotomatisasi pembuatan jurnal akuntansi penggajian sesuai prinsip akuntansi standar (*Indonesian Financial Accounting Standards / PSAK*):

```
+----------------------------------------------------------------------------------------------------+
|                                CONTOH JURNAL PENGGAJIAN CATATGAJI                                  |
+-------------------------------------------------------------+-------------------+------------------+
| Akun Akuntansi                                              | Debit (Rp)        | Kredit (Rp)      |
+-------------------------------------------------------------+-------------------+------------------+
| [DEBIT]  Beban Gaji Pokok                                   |   100.000.000,00  |                  |
| [DEBIT]  Beban Tunjangan Tetap & Variabel                   |    20.000.000,00  |                  |
| [DEBIT]  Beban Upah Lembur (PP 35/2021)                     |    10.000.000,00  |                  |
| [DEBIT]  Beban BPJS Ketenagakerjaan Perusahaan (JKK, JKM,   |     7.500.000,00  |                  |
|          JHT 3.7%, JP 2%)                                   |                   |                  |
| [DEBIT]  Beban BPJS Kesehatan Perusahaan (4%)               |     4.800.000,00  |                  |
| [KREDIT] Utang Pajak PPh 21 Karyawan (DJP)                  |                   |     2.500.000,00 |
| [KREDIT] Utang Iuran BPJS Ketenagakerjaan (Pers + Karyawan) |                   |    11.100.000,00 |
| [KREDIT] Utang Iuran BPJS Kesehatan (Pers + Karyawan)       |                   |     6.000.000,00 |
| [KREDIT] Utang Kasbon / Piutang Karyawan                    |                   |     1.500.000,00 |
| [KREDIT] Kas & Bank (Net Take Home Pay Transfer)            |                   |   121.200.000,00 |
+-------------------------------------------------------------+-------------------+------------------+
| TOTAL (SEIMBANG / BALANCED 100%)                            |   142.300.000,00  |   142.300.000,00 |
+-------------------------------------------------------------+-------------------+------------------+
```

#### 7.3 Format Integrasi Software Akuntansi
Sistem menyediakan template ekspor CSV instan untuk software akuntansi terkemuka:
- **Jurnal by Mekari**: Format impor jurnal transaksi umum (*General Journal CSV*).
- **Accurate Online**: Format transaksi jurnal memorial.
- **Xero Accounting**: Manual Journal CSV format.
- **QuickBooks Online**: Journal Entry CSV template.

---

### MODUL 8: MULTI-TENANT MANAGEMENT, RBAC & ADMINISTRASI SISTEM

Modul Administrasi Sistem menjamin keamanan, pemisahan hak akses, isolasi data, dan keandalan operasional tingkat tinggi (*enterprise-grade multi-tenancy*).

```
+----------------------------------------------------------------------------------------------------+
|                               STRUKTUR ISOLASI & ROLE ACCESS CONTROL                               |
+----------------------------------------------------------------------------------------------------+
|                           [ TENANT ROOT: PT MAJU BERSAMA DIGITAL ]                                 |
|                                         |                                                          |
|         +-------------------------------+-------------------------------+                          |
|         |                               |                               |                          |
|   [ COMPANY OWNER ]               [ HR ADMIN ]               [ FINANCE / TAX ]                     |
|   - Akses Penuh                   - Input Karyawan           - Review Pajak PPh 21                 |
|   - Approval Final (PIN)          - Kelola Absensi & Cuti    - Ekspor e-Bupot & BPJS               |
|   - Billing & Langganan           - Eksekusi Payroll Run     - Ekspor Jurnal Akuntansi             |
|                                         |                                                          |
|                                 [ BRANCH MANAGER ]                                                 |
|                                 - Approval Lembur Cabang                                           |
|                                 - Cek Kehadiran Outlet                                             |
|                                         |                                                          |
|                                    [ EMPLOYEE ]                                                    |
|                                    - Mobile Clock-in/Selfie                                        |
|                                    - Akses Slip Gaji Sendiri (PIN)                                 |
|                                    - Ajukan Cuti & Lembur                                          |
+----------------------------------------------------------------------------------------------------+
```

#### 8.1 Arsitektur Multi-Tenancy & Row-Level Security (RLS)
- **Shared Database, Shared Schema with RLS**: Seluruh entitas tabel dilengkapi kolom `tenant_id`. PostgreSQL Row-Level Security (RLS) diaktifkan pada tingkat mesin database, memastikan kueri SQL apapun yang dieksekusi aplikasi secara deterministik terisolasi pada tenant yang bersangkutan.
- **Pendaftaran Tenant Mandiri (*Self-Serve Onboarding*)**: Pengguna baru dapat mendaftarkan perusahaan dalam 2 menit dengan mengisi nama perusahaan, membuat subdomain/slug unik (`perusahaan.catatgaji.id`), dan memilih paket langganan.

#### 8.2 Matriks Hak Akses Peran (Role-Based Access Control / RBAC)

| Modul / Menu | Company Owner | HR Admin | Finance / Tax | Branch Manager | Employee |
|---|:---:|:---:|:---:|:---:|:---:|
| **Dashboard Eksekutif & Ringkasan Biaya** | Read | Read | Read | Restricted | No Access |
| **Master Data Karyawan (Profil & NIK)** | Full CRUD | Full CRUD | Read Only | View Subordinat | View Profil Sendiri |
| **Data Gaji Pokok & Kompensasi** | Full CRUD | Full CRUD | Read Only | No Access | No Access |
| **Absensi & Log Geofencing** | Read | Full CRUD | Read | Full (Cabang) | Clock-in Sendiri |
| **Approval Cuti & SPKL Lembur** | Full | Full | Read | Approval (Cabang) | Submit Permohonan |
| **Eksekusi 4-Step Payroll Wizard** | Approval Final | Create/Calculate | Review/Calculate | No Access | No Access |
| **Ekspor e-Bupot DJP & BPJS** | Download | Read | Full Export | No Access | No Access |
| **Ekspor Jurnal Akuntansi** | Download | No Access | Full Export | No Access | No Access |
| **Download Slip Gaji Digital** | All Slip | All Slip | All Slip | No Access | Slip Sendiri (PIN) |
| **Pengaturan Tenant & Billing SaaS** | Full Access | Read Only | No Access | No Access | No Access |
| **Audit Trail Forensik Log** | Read Only | No Access | No Access | No Access | No Access |

#### 8.3 Manajemen Tagihan Langganan SaaS (Subscription Billing)
- Sistem menghitung pemakaian jumlah karyawan aktif secara otomatis.
- Notifikasi penagihan diterbitkan 7 hari sebelum masa berlaku langganan habis.
- Integrasi webhook payment gateway (Midtrans/Xendit) memproses aktivasi paket instan setelah pembayaran QRIS / Virtual Account berhasil.

#### 8.4 Audit Trail Forensik Tak Dapat Diubah (Immutable Audit Log)
Setiap transaksi bernilai finansial atau berisiko hukum tinggi dicatat secara permanen pada tabel `audit_logs` (bersifat *append-only* tanpa hak hapus/edit):
- Perubahan gaji pokok atau tunjangan (mencatat nilai sebelum vs sesudah).
- Pengubahan manual data absensi atau override jam lembur.
- Eksekusi kalkulasi dan approval payroll.
- Unduhan dokumen perpajakan e-Bupot dan Form 1721-A1.
- Atribut catatan: Timestamp UTC+7, User ID, Nama User, Peran, Alamat IP Pengguna, dan User-Agent Perangkat.
