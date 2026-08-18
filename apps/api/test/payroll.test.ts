import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/main';
import { initDb } from '../src/db';
import { FastifyInstance } from 'fastify';

describe('Payroll API & Approval Lifecycle Tests', () => {
  let app: FastifyInstance;
  let token: string;
  let periodId: string;
  let resultItemId: string;

  beforeAll(async () => {
    await initDb();
    app = await buildApp();
    await app.ready();

    const slug = `payroll-test-${Date.now()}`;
    const email = `owner-${Date.now()}@payrollprima.com`;

    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register-tenant',
      payload: {
        company_name: 'PT Payroll Prima',
        company_slug: slug,
        owner_name: 'Bapak Direktur',
        email: email,
        password: 'Password123!',
        pin: '123456',
      },
    });

    const regData = JSON.parse(regRes.body);
    token = regData.data.token;

    // Create 2 test employees
    await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171010101900001',
        full_name: 'Budi Santoso',
        email: 'budi@payrollprima.com',
        join_date: '2024-01-01',
        ptkp_status: 'K/1',
        basic_salary: 8500000,
        fixed_allowances: [{ name: 'Tunjangan Jabatan', amount: 1500000 }],
      },
    });

    await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171010101900002',
        full_name: 'Siti Rahmawati',
        email: 'siti@payrollprima.com',
        join_date: '2024-01-01',
        ptkp_status: 'TK/0',
        basic_salary: 6000000,
        fixed_allowances: [{ name: 'Tunjangan Tetap', amount: 1000000 }],
      },
    });
  });

  it('1. POST /api/v1/payroll/periods creates a new draft payroll period', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/payroll/periods',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        period_month: 8,
        period_year: 2026,
      },
    });

    expect(res.statusCode).toBe(201);
    const data = JSON.parse(res.body);
    expect(data.data.status).toBe('DRAFT');
    expect(data.data.period_month).toBe(8);
    expect(data.data.period_year).toBe(2026);
    periodId = data.data.id;
  });

  it('2. POST /api/v1/payroll/periods/:id/run-calculation computes batch payroll', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/payroll/periods/${periodId}/run-calculation`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res.body);
    expect(data.data.employee_count).toBe(2);
    expect(Number(data.data.total_gross)).toBe(17000000); // 10jt (Budi) + 7jt (Siti)
    expect(Number(data.data.total_pph21)).toBeGreaterThan(0);
    expect(Number(data.data.total_thp)).toBeGreaterThan(0);
  });

  it('3. GET /api/v1/payroll/periods/:id/results fetches calculated items', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/periods/${periodId}/results`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res.body);
    expect(data.data.items.length).toBe(2);
    resultItemId = data.data.items[0].id;
  });

  it('4. PUT /api/v1/payroll/periods/:id/items/:itemId adjusts overtime and re-calculates', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/payroll/periods/${periodId}/items/${resultItemId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        overtime_pay: 867052,
      },
    });

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res.body);
    expect(Number(data.data.overtime_pay)).toBe(867052);
  });

  it('5. POST /api/v1/payroll/periods/:id/submit changes status to SUBMITTED', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/payroll/periods/${periodId}/submit`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res.body);
    expect(data.data.status).toBe('SUBMITTED');
  });

  it('6. POST /api/v1/payroll/periods/:id/approve rejects wrong PIN and accepts correct PIN', async () => {
    // Wrong PIN
    const wrongRes = await app.inject({
      method: 'POST',
      url: `/api/v1/payroll/periods/${periodId}/approve`,
      headers: { authorization: `Bearer ${token}` },
      payload: { pin: '999999' },
    });
    expect(wrongRes.statusCode).toBe(400);

    // Correct PIN '123456'
    const correctRes = await app.inject({
      method: 'POST',
      url: `/api/v1/payroll/periods/${periodId}/approve`,
      headers: { authorization: `Bearer ${token}` },
      payload: { pin: '123456' },
    });
    expect(correctRes.statusCode).toBe(200);
    const data = JSON.parse(correctRes.body);
    expect(data.data.status).toBe('APPROVED');
    expect(data.data.approved_at).not.toBeNull();
  });

  it('7. GET /api/v1/payroll/results/:resultId/slip returns complete payslip payload', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/payroll/results/${resultItemId}/slip`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res.body);
    expect(data.data.company_name).toBe('PT Payroll Prima');
    expect(data.data.employee_name).toBeDefined();
    expect(Number(data.data.thp)).toBeGreaterThan(0);
    expect(data.data.is_locked).toBe(true);
  });
});
