import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/main.js';
import { initDb } from '../src/db.js';

describe('Payroll Accounting Journal, BPJS & Bank Transfer Integration Tests', () => {
  let app: any;
  let token: string;
  let periodId: string;

  beforeAll(async () => {
    await initDb();
    app = await buildApp();

    // 1. Register tenant & owner
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register-tenant',
      payload: {
        company_name: 'PT Jurnal Nusantara',
        company_slug: `jurnal-nus-${Date.now()}`,
        owner_name: 'Akuntan Pratama',
        email: `akuntan-${Date.now()}@jurnalnus.id`,
        password: 'Password123!',
        pin: '123456',
        tier: 'BUSINESS',
      },
    });
    token = JSON.parse(regRes.body).data.token;

    // 2. Create employee
    const empRes = await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171012305950001',
        full_name: 'Rian Hidayat',
        email: 'rian@jurnalnus.id',
        join_date: '2026-01-01',
        ptkp_status: 'TK/0',
        basic_salary: 10000000,
        fixed_allowances: [{ name: 'transport', amount: 1000000 }],
        bank_name: 'BCA',
        bank_account_no: '8830123456',
        bpjs_tk_no: '12345678901',
        bpjs_kes_no: '0001234567890',
      },
    });
    const empData = JSON.parse(empRes.body).data;
    const empId = empData?.id;

    // 3. Create period
    const perRes = await app.inject({
      method: 'POST',
      url: '/api/v1/payroll/periods',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        period_month: 8,
        period_year: 2026,
        start_date: '2026-08-01',
        end_date: '2026-08-31',
        payout_date: '2026-08-25',
      },
    });
    periodId = JSON.parse(perRes.body).data.id;

    // 4. Run calculations
    await app.inject({
      method: 'POST',
      url: `/api/v1/payroll/periods/${periodId}/run-calculation`,
      headers: { authorization: `Bearer ${token}` },
    });
  });

  it('1. GET /api/v1/payroll/periods/:id/journal generates balanced PSAK journal', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/periods/${periodId}/journal`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.is_balanced).toBe(true);
    expect(body.data.total_debit).toBe(body.data.total_credit);
  });

  it('2. GET /api/v1/payroll/periods/:id/journal-csv returns CSV for Mekari & Accurate', async () => {
    const mekariRes = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/periods/${periodId}/journal-csv?type=MEKARI`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(mekariRes.statusCode).toBe(200);
    expect(mekariRes.headers['content-type']).toContain('text/csv');
    expect(mekariRes.body).toContain('Tanggal Transaksi,Nomor Transaksi,Kode Akun');

    const accurateRes = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/periods/${periodId}/journal-csv?type=ACCURATE`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accurateRes.statusCode).toBe(200);
    expect(accurateRes.body).toContain('TransDate;TransNo;AccountNo');
  });

  it('3. GET /api/v1/payroll/periods/:id/bpjs-tk-csv & bpjs-kes-csv generate SIPP and E-Dabu CSV', async () => {
    const tkRes = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/periods/${periodId}/bpjs-tk-csv`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(tkRes.statusCode).toBe(200);
    expect(tkRes.body).toContain('NoKPJ;NIK;NamaTenagaKerja');

    const kesRes = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/periods/${periodId}/bpjs-kes-csv`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(kesRes.statusCode).toBe(200);
    expect(kesRes.body).toContain('NoKartuBPJSKes;NIK;NamaPeserta');
  });

  it('4. GET /api/v1/payroll/periods/:id/bank-transfer-csv generates bank disbursement batch file', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/periods/${periodId}/bank-transfer-csv`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('NomorRekeningTujuan,NamaPenerima,NamaBank,NominalTransfer');
    expect(res.body).toContain('8830123456,Rian Hidayat,BCA');
  });
});
