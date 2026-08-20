import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/main.js';
import { initDb } from '../src/db.js';

describe('Settings, Corporate Tax Profile & e-Bupot CSV Integration Tests', () => {
  let app: any;
  let token: string;

  beforeAll(async () => {
    await initDb();
    app = await buildApp();

    // Register tenant & owner
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register-tenant',
      payload: {
        company_name: 'PT Tax Solution Indonesia',
        company_slug: `tax-sol-${Date.now()}`,
        owner_name: 'Hendra Setiawan',
        email: `hendra-${Date.now()}@taxsol.id`,
        password: 'Password123!',
        pin: '123456',
        tier: 'BUSINESS',
      },
    });

    const regBody = JSON.parse(regRes.body);
    token = regBody.data.token;
  });

  it('1. GET /api/v1/settings/profile retrieves company profile', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/settings/profile',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.company_name).toBe('PT Tax Solution Indonesia');
  });

  it('2. PUT /api/v1/settings/profile updates corporate tax and signatory details', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/settings/profile',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        company_name: 'PT Tax Solution Indonesia Tbk',
        npwp_badan: '01.234.567.8-901.000',
        address: 'Jl. Sudirman No. 45',
        city: 'Jakarta Selatan',
        postal_code: '12190',
        tax_signatory_name: 'Hendra Setiawan SE Ak',
        tax_signatory_nik: '3171012305950001',
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.company_name).toBe('PT Tax Solution Indonesia Tbk');
    expect(body.data.npwp_badan).toBe('01.234.567.8-901.000');
    expect(body.data.tax_signatory_name).toBe('Hendra Setiawan SE Ak');
  });

  it('3. PUT /api/v1/settings/change-pin updates owner PIN with old PIN verification', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/settings/change-pin',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        old_pin: '123456',
        new_pin: '654321',
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
  });

  it('4. GET /api/v1/payroll/tax-reports/annual-1721a1-csv/:year returns CSV with correct headers', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/payroll/tax-reports/annual-1721a1-csv/2026',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.body).toContain('TahunPajak;NPWPPemotong;NamaPemotong');
  });
});
