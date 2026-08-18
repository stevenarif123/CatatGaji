import { describe, it, expect, beforeAll } from 'vitest';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from '../src/routes/auth';
import { branchRoutes } from '../src/routes/branches';
import { employeeRoutes } from '../src/routes/employees';
import { initDb } from '../src/db';

describe('Employee & Branch Integration Tests', () => {
  let app: any;
  let token: string;
  let tenantId: string;
  let branchId: string;

  beforeAll(async () => {
    await initDb();

    app = Fastify();
    await app.register(jwt, { secret: 'test-secret-key-12345' });
    app.decorate('authenticate', async function (request: any, reply: any) {
      try {
        await request.jwtVerify();
      } catch {
        reply.code(401).send({ success: false, message: 'Unauthorized' });
      }
    });

    await app.register(authRoutes, { prefix: '/api/v1/auth' });
    await app.register(branchRoutes, { prefix: '/api/v1/branches' });
    await app.register(employeeRoutes, { prefix: '/api/v1/employees' });

    // Register a test tenant to get token
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register-tenant',
      payload: {
        company_name: 'PT Maju Terus Logistik',
        company_slug: `logistik-${Date.now()}`,
        owner_name: 'Hendra Owner',
        email: `hendra-${Date.now()}@logistik.com`,
        password: 'Password123#',
      },
    });

    const regBody = JSON.parse(regRes.body);
    token = regBody.data.token;
    tenantId = regBody.data.tenant_id;

    // Create a test branch
    const branchRes = await app.inject({
      method: 'POST',
      url: '/api/v1/branches',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        name: 'Kantor Pusat Jakarta',
        code: `HQ-${Date.now()}`,
        address: 'Jl. Sudirman No. 45, Jakarta',
        latitude: -6.2088,
        longitude: 106.8456,
        radius_meters: 100,
      },
    });

    const branchBody = JSON.parse(branchRes.body);
    branchId = branchBody.data.id;
  });

  it('POST /api/v1/employees registers employee & auto-maps PTKP TK/0 to TER A', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171011508960001',
        npwp: '012345678901234',
        bpjs_tk_no: '12345678901',
        bpjs_kes_no: '1234567890123',
        full_name: 'Budi Santoso',
        email: 'budi.santoso@logistik.com',
        phone: '081234567890',
        branch_id: branchId,
        join_date: '2024-01-01',
        employment_status: 'PKWTT',
        ptkp_status: 'TK/0',
        basic_salary: 8000000,
        fixed_allowances: [{ name: 'Tunjangan Jabatan', amount: 1000000 }],
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.ptkp_status).toBe('TK/0');
    expect(body.data.pph21_ter_category).toBe('A');
    expect(body.data.nik_ktp_masked).toBe('3171********0001');
  });

  it('POST /api/v1/employees auto-maps PTKP K/1 to TER B', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171011508960002',
        full_name: 'Siti Rahma',
        email: 'siti.rahma@logistik.com',
        branch_id: branchId,
        join_date: '2024-02-01',
        employment_status: 'PKWT',
        ptkp_status: 'K/1',
        basic_salary: 10000000,
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.data.ptkp_status).toBe('K/1');
    expect(body.data.pph21_ter_category).toBe('B');
  });

  it('POST /api/v1/employees auto-maps PTKP K/3 to TER C', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171011508960003',
        full_name: 'Agus Setiawan',
        email: 'agus.setiawan@logistik.com',
        branch_id: branchId,
        join_date: '2023-01-01',
        employment_status: 'PKWT',
        ptkp_status: 'K/3',
        basic_salary: 15000000,
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.data.ptkp_status).toBe('K/3');
    expect(body.data.pph21_ter_category).toBe('C');
  });

  it('POST /api/v1/employees rejects duplicate NIK', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171011508960001', // Already registered by Budi
        full_name: 'Duplikat User',
        email: 'duplikat@logistik.com',
        join_date: '2024-01-01',
        basic_salary: 5000000,
      },
    });

    expect(res.statusCode).toBe(409);
    const body = JSON.parse(res.body);
    expect(body.error_code).toBe('DUPLICATE_NIK');
  });

  it('GET /api/v1/employees returns paginated list with search', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/employees?search=Budi',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(1);
    expect(body.data[0].full_name).toBe('Budi Santoso');
    expect(body.data[0].nik_ktp_masked).toBe('3171********0001');
  });

  it('POST /api/v1/employees/:id/salary creates salary version with effective date', async () => {
    // Get Budi's ID
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/v1/employees?search=Budi',
      headers: { authorization: `Bearer ${token}` },
    });
    const budiId = JSON.parse(listRes.body).data[0].id;

    // Apply salary revision
    const salRes = await app.inject({
      method: 'POST',
      url: `/api/v1/employees/${budiId}/salary`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        basic_salary: 9500000,
        fixed_allowances: [{ name: 'Tunjangan Senior', amount: 1500000 }],
        effective_date: '2025-01-01',
        pph21_scheme: 'GROSS',
      },
    });

    expect(salRes.statusCode).toBe(201);
    const salBody = JSON.parse(salRes.body);
    expect(salBody.data.basic_salary).toBe(9500000);

    // Verify detail reflects updated current salary
    const detailRes = await app.inject({
      method: 'GET',
      url: `/api/v1/employees/${budiId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    const detailBody = JSON.parse(detailRes.body);
    expect(Number(detailBody.data.basic_salary)).toBe(9500000);
  });

  it('DELETE /api/v1/employees/:id soft-deletes the employee', async () => {
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/v1/employees?search=Siti',
      headers: { authorization: `Bearer ${token}` },
    });
    const sitiId = JSON.parse(listRes.body).data[0].id;

    const delRes = await app.inject({
      method: 'DELETE',
      url: `/api/v1/employees/${sitiId}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(delRes.statusCode).toBe(200);

    // Verify excluded from active list
    const checkRes = await app.inject({
      method: 'GET',
      url: '/api/v1/employees?status=ACTIVE',
      headers: { authorization: `Bearer ${token}` },
    });
    const checkBody = JSON.parse(checkRes.body);
    const names = checkBody.data.map((e: any) => e.full_name);
    expect(names).not.toContain('Siti Rahma');
  });
});
