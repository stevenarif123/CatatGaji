# DOKUMEN PERSYARATAN PRODUK (PRD) — CATATGAJI
## 08. SPESIFIKASI ANTARMUKA PEMROGRAMAN APLIKASI (REST API SPECS)

---

### 1. Standar Desain, Protokol & Amplop Data (API Standards)

1. **Protokol & Base URL**: `https://api.catatgaji.id/api/v1` (Wajib TLS 1.3).
2. **Format Data**: JSON (`Content-Type: application/json; charset=utf-8`).
3. **Autentikasi**: JSON Web Token (JWT) dikirim melalui header `Authorization: Bearer <ACCESS_TOKEN>`.
4. **Isolasi Konteks Tenant**: Header `X-Tenant-ID: <UUID>` dapat disertakan secara eksplisit atau diekstrak secara otomatis dari klaim JWT.
5. **Standar Amplop Sukses (Success Envelope)**:
   ```json
   {
     "success": true,
     "message": "Operasi berhasil diselesaikan.",
     "data": {},
     "meta": {
       "page": 1,
       "limit": 20,
       "total_records": 100,
       "total_pages": 5
     }
   }
   ```
6. **Standar Amplop Error (Error Envelope)**:
   ```json
   {
     "success": false,
     "error_code": "VALIDATION_FAILED",
     "message": "Data yang dikirimkan tidak valid.",
     "errors": [
       {
         "field": "nik_ktp",
         "message": "NIK KTP wajib berupa 16 digit angka."
       }
     ],
     "request_id": "req-018dc3f2-89ab-7000-8000-000000000099"
   }
   ```

---

### 2. Katalog Lengkap 24 REST API Endpoints

---

#### MODUL 1: AUTENTIKASI & SETUP TENANT

##### 1. `POST /api/v1/auth/register-tenant`
- **Deskripsi**: Registrasi organisasi baru, subdomain tenant, dan akun pemilik usaha (*Company Owner*).
- **Akses**: Publik
- **Request Body**:
  ```json
  {
    "company_name": "PT Maju Bersama Logistik",
    "company_slug": "maju-bersama",
    "owner_name": "Hendra Wijaya",
    "email": "hendra@majubersama.co.id",
    "password": "PasswordSangatKuat#2026",
    "phone": "081234567890",
    "tier": "GROWTH"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Organisasi dan akun owner berhasil didaftarkan.",
    "data": {
      "tenant_id": "018dc3f2-89ab-7000-8000-000000000001",
      "user_id": "018dc3f2-89ab-7000-8000-000000000002",
      "slug": "maju-bersama",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

##### 2. `POST /api/v1/auth/login`
- **Deskripsi**: Autentikasi email dan kata sandi untuk mendapatkan JWT Access Token.
- **Akses**: Publik
- **Request Body**:
  ```json
  {
    "email": "sari@majubersama.co.id",
    "password": "PasswordSari#2026"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Login berhasil.",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...",
      "expires_in": 3600,
      "user": {
        "id": "018dc3f2-89ab-7000-8000-000000000003",
        "tenant_id": "018dc3f2-89ab-7000-8000-000000000001",
        "email": "sari@majubersama.co.id",
        "role": "HR_ADMIN"
      }
    }
  }
  ```

##### 3. `POST /api/v1/auth/refresh-token`
- **Deskripsi**: Regenerasi access token menggunakan refresh token.
- **Akses**: Publik
- **Request Body**:
  ```json
  {
    "refresh_token": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4..."
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 3600
    }
  }
  ```

##### 4. `GET /api/v1/auth/me`
- **Deskripsi**: Mengambil profil pengguna yang sedang login dan konteks tenant aktif.
- **Akses**: Terautentikasi (Bearer Token)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "user_id": "018dc3f2-89ab-7000-8000-000000000003",
      "tenant_id": "018dc3f2-89ab-7000-8000-000000000001",
      "company_name": "PT Maju Bersama Logistik",
      "email": "sari@majubersama.co.id",
      "role": "HR_ADMIN",
      "permissions": ["EMPLOYEES_MANAGE", "PAYROLL_CALCULATE", "ATTENDANCE_VIEW"]
    }
  }
  ```

---

#### MODUL 2: MASTER DATA KARYAWAN & HRIS

##### 5. `GET /api/v1/employees`
- **Deskripsi**: Mengambil daftar seluruh karyawan dengan pagination, pencarian, dan filter cabang/status.
- **Akses**: `HR_ADMIN`, `COMPANY_OWNER`, `FINANCE_PAYROLL`
- **Query Params**: `page=1&limit=20&search=Budi&branch_id=UUID&status=ACTIVE`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "018dc3f2-89ab-7000-8000-000000000005",
        "nik_ktp_masked": "3171************",
        "full_name": "Budi Prasetyo",
        "email": "budi@majubersama.co.id",
        "phone": "081298765432",
        "branch_name": "Cabang Tebet",
        "department_name": "Operasional",
        "employment_status": "PKWT",
        "ptkp_status": "TK/0",
        "status": "ACTIVE",
        "join_date": "2024-01-10"
      }
    ],
    "meta": {"page": 1, "limit": 20, "total_records": 1, "total_pages": 1}
  }
  ```

##### 6. `POST /api/v1/employees`
- **Deskripsi**: Mendaftarkan karyawan baru beserta konfigurasi gaji awal dan parameter BPJS/Pajak.
- **Akses**: `HR_ADMIN`, `COMPANY_OWNER`
- **Request Body**:
  ```json
  {
    "nik_ktp": "3171012304900001",
    "npwp": "012345678012000",
    "bpjs_kes_no": "0001234567890",
    "bpjs_tk_no": "12345678901",
    "full_name": "Budi Prasetyo",
    "email": "budi@majubersama.co.id",
    "phone": "081298765432",
    "branch_id": "018dc3f2-89ab-7000-8000-000000000010",
    "department_id": "018dc3f2-89ab-7000-8000-000000000020",
    "join_date": "2024-01-10",
    "employment_status": "PKWT",
    "ptkp_status": "TK/0",
    "salary_type": "MONTHLY",
    "bank_name": "BCA",
    "bank_account_no": "8830123456",
    "bank_account_holder": "Budi Prasetyo",
    "salary_config": {
      "basic_salary": 5000000,
      "fixed_allowances": [{"name": "Tunjangan Kehadiran", "amount": 400000}],
      "non_fixed_allowances": [{"name": "Tunjangan Transport Harian", "amount": 20000}],
      "jkk_risk_grade": 2,
      "pph21_scheme": "TER_MONTHLY"
    }
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Karyawan berhasil didaftarkan.",
    "data": {
      "employee_id": "018dc3f2-89ab-7000-8000-000000000005",
      "full_name": "Budi Prasetyo",
      "status": "ACTIVE"
    }
  }
  ```

##### 7. `GET /api/v1/employees/{id}`
- **Deskripsi**: Mengambil detail profil karyawan lengkap beserta riwayat kompensasi.
- **Akses**: `HR_ADMIN`, `COMPANY_OWNER`, atau Karyawan Bersangkutan.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "018dc3f2-89ab-7000-8000-000000000005",
      "nik_ktp_masked": "3171************",
      "full_name": "Budi Prasetyo",
      "current_salary": {
        "basic_salary": 5000000.00,
        "fixed_allowances": [{"name": "Tunjangan Kehadiran", "amount": 400000.00}],
        "effective_date": "2024-01-10"
      }
    }
  }
  ```

##### 8. `PUT /api/v1/employees/{id}`
- **Deskripsi**: Memperbarui profil, status kerja, atau struktur gaji karyawan.
- **Akses**: `HR_ADMIN`, `COMPANY_OWNER`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Data karyawan berhasil diperbarui."
  }
  ```

##### 9. `POST /api/v1/employees/bulk-import`
- **Deskripsi**: Unggah massal data karyawan melalui template spreadsheet Excel.
- **Akses**: `HR_ADMIN`, `COMPANY_OWNER`
- **Request (Multipart/Form-Data)**: `file: employees_data.xlsx`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Impor massal selesai.",
    "data": {
      "total_processed": 55,
      "total_success": 55,
      "total_failed": 0,
      "failed_rows": []
    }
  }
  ```

---

#### MODUL 3: KEHADIRAN & ABSENSI MOBILE

##### 10. `POST /api/v1/attendances/clock-in`
- **Deskripsi**: Pencatatan kehadiran masuk kerja karyawan berbasis GPS Geofencing dan Swafoto.
- **Akses**: `EMPLOYEE`
- **Request Body**:
  ```json
  {
    "latitude": -6.1753924,
    "longitude": 106.8271528,
    "selfie_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
    "notes": "Masuk shift pagi"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Clock-in berhasil diverifikasi.",
    "data": {
      "attendance_id": "018dc3f2-89ab-7000-8000-000000000030",
      "date": "2026-08-17",
      "check_in_time": "06:58:12",
      "status": "PRESENT",
      "late_minutes": 0,
      "distance_meters": 12.5
    }
  }
  ```

##### 11. `POST /api/v1/attendances/clock-out`
- **Deskripsi**: Pencatatan kehadiran pulang dan kalkulasi total jam kerja harian.
- **Akses**: `EMPLOYEE`
- **Request Body**:
  ```json
  {
    "latitude": -6.1753924,
    "longitude": 106.8271528,
    "notes": "Selesai shift"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Clock-out berhasil dicatat.",
    "data": {
      "check_out_time": "15:05:30",
      "work_hours": 8.12,
      "early_leave_minutes": 0
    }
  }
  ```

##### 12. `GET /api/v1/attendances/recap`
- **Deskripsi**: Rekapitulasi absensi bulanan untuk verifikasi cut-off penggajian.
- **Akses**: `HR_ADMIN`, `FINANCE_PAYROLL`, `COMPANY_OWNER`
- **Query Params**: `month=8&year=2026&branch_id=UUID`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "employee_id": "018dc3f2-89ab-7000-8000-000000000005",
        "employee_name": "Budi Prasetyo",
        "total_present": 21,
        "total_late": 0,
        "total_leave": 1,
        "total_overtime_hours": 4.0
      }
    ]
  }
  ```

---

#### MODUL 4: CUTI & LEMBUR (WORKFLOWS)

##### 13. `POST /api/v1/leaves/request`
- **Deskripsi**: Pengajuan cuti tahunan, cuti khusus, atau izin sakit oleh karyawan.
- **Akses**: `EMPLOYEE`
- **Request Body**:
  ```json
  {
    "leave_type_id": "018dc3f2-89ab-7000-8000-000000000040",
    "start_date": "2026-08-24",
    "end_date": "2026-08-25",
    "total_days": 2.0,
    "reason": "Keperluan keluarga",
    "attachment_url": null
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Pengajuan cuti berhasil diajukan.",
    "data": {
      "leave_request_id": "018dc3f2-89ab-7000-8000-000000000045",
      "status": "PENDING"
    }
  }
  ```

##### 14. `PUT /api/v1/leaves/{id}/approve`
- **Deskripsi**: Persetujuan atau penolakan pengajuan cuti oleh atasan/HR.
- **Akses**: `HR_ADMIN`, `COMPANY_OWNER`, `BRANCH_MANAGER`
- **Request Body**:
  ```json
  {
    "status": "APPROVED",
    "rejection_reason": null
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Pengajuan cuti telah disetujui."
  }
  ```

##### 15. `POST /api/v1/overtimes/request`
- **Deskripsi**: Pembuatan Surat Perintah Kerja Lembur (SPKL) beserta estimasi durasi tugas.
- **Akses**: `EMPLOYEE`, `BRANCH_MANAGER`
- **Request Body**:
  ```json
  {
    "employee_id": "018dc3f2-89ab-7000-8000-000000000005",
    "date": "2026-08-17",
    "start_time": "16:00",
    "end_time": "20:00",
    "total_hours": 4.0,
    "task_description": "Operasional kafe lonjakan pelanggan hari kemerdekaan",
    "spkl_no": "SPKL/TBT/202608/005"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Pengajuan lembur berhasil dibuat.",
    "data": {
      "overtime_id": "018dc3f2-89ab-7000-8000-000000000050",
      "status": "PENDING"
    }
  }
  ```

##### 16. `PUT /api/v1/overtimes/{id}/approve`
- **Deskripsi**: Persetujuan lembur dan kalkulasi jam efektif sesuai PP No. 35/2021.
- **Akses**: `HR_ADMIN`, `COMPANY_OWNER`
- **Request Body**:
  ```json
  {
    "status": "APPROVED"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Lembur disetujui. Total jam efektif upah lembur: 8.0 jam (Hari Libur Resmi).",
    "data": {
      "overtime_id": "018dc3f2-89ab-7000-8000-000000000050",
      "effective_hours_multiplier": 8.0
    }
  }
  ```

---

#### MODUL 5: ENGINE PENGGAJIAN & SLIP GAJI DIGITAL

##### 17. `POST /api/v1/payrolls/periods`
- **Deskripsi**: Inisiasi draf periode penggajian bulanan baru.
- **Akses**: `FINANCE_PAYROLL`, `COMPANY_OWNER`
- **Request Body**:
  ```json
  {
    "name": "Penggajian Bulan Agustus 2026",
    "month": 8,
    "year": 2026,
    "start_date": "2026-08-01",
    "end_date": "2026-08-31",
    "cutoff_date": "2026-08-25",
    "payment_date": "2026-08-28"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "payroll_period_id": "018dc3f2-89ab-7000-8000-000000000060",
      "status": "DRAFT"
    }
  }
  ```

##### 18. `POST /api/v1/payrolls/periods/{id}/calculate`
- **Deskripsi**: Menjalankan kalkulasi massal seluruh komponen gaji, lembur PP 35, 5 BPJS, dan PPh 21 TER.
- **Akses**: `FINANCE_PAYROLL`, `COMPANY_OWNER`
- **Response `202 Accepted`**:
  ```json
  {
    "success": true,
    "message": "Kalkulasi payroll sedang diproses di background queue.",
    "data": {
      "job_id": "job_calc_018dc3f289ab70008000",
      "status": "CALCULATING"
    }
  }
  ```

##### 19. `GET /api/v1/payrolls/periods/{id}/preview`
- **Deskripsi**: Mengambil ringkasan hasil kalkulasi sebelum diajukan ke pemilik usaha.
- **Akses**: `FINANCE_PAYROLL`, `COMPANY_OWNER`, `HR_ADMIN`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "period": {
        "id": "018dc3f2-89ab-7000-8000-000000000060",
        "total_gross": 245850000.00,
        "total_net": 221280000.00,
        "total_tax": 6120000.00,
        "total_bpjs_company": 23450000.00
      }
    }
  }
  ```

##### 20. `POST /api/v1/payrolls/periods/{id}/approve`
- **Deskripsi**: Final approval penggajian oleh Pemilik Usaha menggunakan PIN keamanan dan penguncian data.
- **Akses**: `COMPANY_OWNER`
- **Request Body**:
  ```json
  {
    "auth_pin": "123456"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Periode payroll berhasil disetujui dan dikunci."
  }
  ```

##### 21. `POST /api/v1/payrolls/periods/{id}/publish-payslips`
- **Deskripsi**: Generasi massal PDF slip gaji terenkripsi PIN dan blast via Email/WhatsApp.
- **Akses**: `FINANCE_PAYROLL`, `COMPANY_OWNER`
- **Request Body**:
  ```json
  {
    "channel": "EMAIL_AND_WHATSAPP",
    "protect_pdf_with_pin": true
  }
  ```
- **Response `202 Accepted`**:
  ```json
  {
    "success": true,
    "message": "Pengiriman slip gaji sedang diproses."
  }
  ```

##### 22. `GET /api/v1/payslips/my-payslip/{id}`
- **Deskripsi**: Mengambil data rincian slip gaji dan URL download PDF untuk portal karyawan.
- **Akses**: `EMPLOYEE` (Pemilik Slip)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "slip_number": "SLIP/CG/202608/0002",
      "period_name": "Agustus 2026",
      "employee_name": "Budi Prasetyo",
      "take_home_pay": 5426400.00,
      "pdf_url": "https://storage.catatgaji.id/payslips/secure_token_abc.pdf"
    }
  }
  ```

---

#### MODUL 6: PELAPORAN PAJAK DJP & BPJS (COMPLIANCE EXPORTS)

##### 23. `GET /api/v1/reports/tax/e-bupot-csv`
- **Deskripsi**: Mengunduh berkas CSV format resmi impor e-Bupot 21/26 DJP Online.
- **Akses**: `FINANCE_PAYROLL`, `COMPANY_OWNER`
- **Query Params**: `month=8&year=2026&delimiter=comma`
- **Response `200 OK`**:
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="eBupot_202608_majubersama.csv"`

##### 24. `GET /api/v1/reports/bpjs/export`
- **Deskripsi**: Mengunduh format rincian iuran BPJS Ketenagakerjaan (SIPP Online) dan BPJS Kesehatan (E-Dabu).
- **Akses**: `FINANCE_PAYROLL`, `COMPANY_OWNER`
- **Query Params**: `month=8&year=2026&program=BPJS_TK`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "period": "2026-08",
      "program": "BPJS_KETENAGAKERJAAN",
      "total_employees": 55,
      "grand_total_iuran": 46250000.00,
      "download_excel_url": "https://storage.catatgaji.id/reports/bpjs_tk_202608.xlsx"
    }
  }
  ```

---

#### MODUL 7: SINKRONISASI OFFLINE-FIRST (SYNC PROTOCOL)

#### Protokol Sinkronisasi (Revisi)

Strategi sinkronisasi menggunakan pendekatan **Append-Only + Versioned Updates + Soft Delete** untuk mencegah kehilangan data:

**Prinsip Utama:**
1. **CREATE**: Append-only dengan UUID v7 unik per device — konflik create mustahil terjadi
2. **UPDATE**: Setiap record memiliki field `version` (integer, auto-increment). Server menerima update hanya jika `version` yang dikirim cocok dengan `version` di server
3. **DELETE**: Soft delete (`deleted_at` timestamp) — data tidak pernah benar-benar dihapus selama sinkronisasi
4. **CONFLICT RESOLUTION**:
   - Version mismatch: Server menolak update dengan HTTP 409 Conflict, client harus fetch versi terbaru dan melakukan merge
   - Jika version sama dari device berbeda: Simpan kedua versi, tandai sebagai conflict, minta user untuk memilih (manual merge)
   - Delete vs Update conflict: Soft delete selalu menang — data dapat di-restore oleh user

**Endpoint Sync:**

```
POST /api/v1/sync/push
Body: {
  "changes": [
    {
      "entity": "salary_entry",
      "action": "create" | "update" | "delete",
      "data": { ... },
      "version": 3,
      "device_id": "uuid-device",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "last_sync_at": "2024-01-15T09:00:00Z"
}

Response 200: { "accepted": [...], "conflicts": [...], "server_version": 5 }
Response 409: { "conflicts": [...], "current_server_data": [...] }
```

```
GET /api/v1/sync/pull?since=2024-01-15T09:00:00Z
Response 200: {
  "changes": [...],
  "deleted": [...],  // soft-deleted records since last sync
  "server_time": "2024-01-15T10:35:00Z"
}
```

> **Catatan**: Pendekatan ini dipilih karena salary entries bersifat append-mostly — setiap catatan gaji adalah fakta historis yang tidak boleh hilang karena konflik sinkronisasi. Full CRDT tidak diperlukan karena tidak ada collaborative real-time editing.

