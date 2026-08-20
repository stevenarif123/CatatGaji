import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/main.js';
import { initDb } from '../src/db.js';

describe('Attendance, Geofencing & Leave API Integration Tests', () => {
  let app: any;
  let token: string;
  let tenantId: string;
  let branchId: string;
  let employeeId: string;

  beforeAll(async () => {
    await initDb();
    app = await buildApp();

    // 1. Register tenant & owner
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register-tenant',
      payload: {
        company_name: 'PT Absensi Modern',
        company_slug: `absensi-${Date.now()}`,
        owner_name: 'Dewi Lestari',
        email: `dewi-${Date.now()}@perusahaan.co.id`,
        password: 'Password123!',
        tier: 'GROWTH',
      },
    });

    const regBody = JSON.parse(regRes.body);
    token = regBody.data.token;
    tenantId = regBody.data.tenant_id;

    // 2. Create Branch
    const branchRes = await app.inject({
      method: 'POST',
      url: '/api/v1/branches',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        name: 'Kantor Pusat Jakarta',
        code: 'HQ-JKT',
        city: 'Jakarta Pusat',
        minimum_wage: 5067381,
      },
    });
    branchId = JSON.parse(branchRes.body).data.id;

    // 3. Create Employee
    const empRes = await app.inject({
      method: 'POST',
      url: '/api/v1/employees',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        nik_ktp: '3171012305950001',
        full_name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@perusahaan.co.id',
        branch_id: branchId,
        join_date: '2026-01-01',
        employment_status: 'PKWTT',
        ptkp_status: 'TK/0',
        basic_salary: 6000000,
      },
    });
    employeeId = JSON.parse(empRes.body).data.id;
  });

  it('1. POST /api/v1/attendance/shifts creates a standard shift', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/attendance/shifts',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        name: 'Shift Reguler Pagi',
        code: 'REG-01',
        start_time: '08:30:00',
        end_time: '17:30:00',
        grace_period_mins: 15,
        work_hours: 8,
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.code).toBe('REG-01');
  });

  it('2. POST /api/v1/attendance/geofences sets up branch coordinates', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/attendance/geofences',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        branch_id: branchId,
        latitude: -6.1753924,
        longitude: 106.8271528,
        radius_meters: 100,
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(Number(body.data.radius_meters)).toBe(100);
  });

  it('3. POST /api/v1/attendance/clock-in allows check-in within geofence', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/attendance/clock-in',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        employee_id: employeeId,
        latitude: -6.1754,
        longitude: 106.82715,
        selfie_url: 'https://storage.catatgaji.id/selfies/demo.jpg',
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.employee_id).toBe(employeeId);
    expect(body.data.status).toBeDefined();
  });

  it('4. POST /api/v1/attendance/clock-out records departure and duration', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/attendance/clock-out',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        employee_id: employeeId,
        latitude: -6.1754,
        longitude: 106.82715,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.clock_out).toBeDefined();
  });

  it('5. POST /api/v1/attendance/import-csv handles bulk biometric records', async () => {
    const csvData = `
      PIN,DateTime,Status
      3171012305950001,2026-08-15 08:00:00,IN
      3171012305950001,2026-08-15 17:05:00,OUT
    `.trim();

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/attendance/import-csv',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        csv_content: csvData,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.processed_count).toBeGreaterThanOrEqual(1);
  });

  it('6. POST /api/v1/leave/requests & approve handles leave workflows', async () => {
    // 1. Submit leave request
    const submitRes = await app.inject({
      method: 'POST',
      url: '/api/v1/leave/requests',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        employee_id: employeeId,
        leave_type: 'MATERNITY_KIA',
        start_date: '2026-09-01',
        end_date: '2026-11-30',
        days_count: 90,
        reason: 'Cuti Melahirkan sesuai UU Kesejahteraan Ibu dan Anak (UU KIA No. 4/2024)',
      },
    });

    expect(submitRes.statusCode).toBe(201);
    const leave = JSON.parse(submitRes.body).data;
    expect(leave.status).toBe('PENDING');

    // 2. Approve leave
    const approveRes = await app.inject({
      method: 'PUT',
      url: `/api/v1/leave/requests/${leave.id}/approve`,
      headers: { authorization: `Bearer ${token}` },
      payload: { notes: 'Disetujui penuh dengan hak upah sesuai UU KIA 2024' },
    });

    expect(approveRes.statusCode).toBe(200);
    const approvedLeave = JSON.parse(approveRes.body).data;
    expect(approvedLeave.status).toBe('APPROVED');
  });

  it('7. GET /api/v1/attendance/my-today returns ESS portal daily snapshot', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/attendance/my-today?employee_id=${employeeId}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.employee).toBeDefined();
    expect(body.data.shift).toBeDefined();
  });
});
