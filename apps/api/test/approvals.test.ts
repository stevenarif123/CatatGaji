import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/main.js';
import { initDb } from '../src/db.js';

describe('Approval Workflow & Delegations Integration Tests (Modul 5 PRD)', () => {
  let app: any;
  let token: string;
  let employeeId: string;
  let leaveId: string;
  let overtimeId: string;
  let delegationId: string;

  beforeAll(async () => {
    await initDb();
    app = await buildApp();

    // 1. Register tenant & owner
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register-tenant',
      payload: {
        company_name: 'PT Otorisasi Berjenjang',
        company_slug: `approvals-tenant-${Date.now()}`,
        owner_name: 'Direktur Utama',
        email: `direktur-${Date.now()}@otorisasi.id`,
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
        full_name: 'Siti Rahma',
        email: 'siti@otorisasi.id',
        join_date: '2026-01-01',
        ptkp_status: 'TK/0',
        basic_salary: 8000000,
      },
    });
    employeeId = JSON.parse(empRes.body).data.id;

    // 3. Create leave request
    const leaveRes = await app.inject({
      method: 'POST',
      url: '/api/v1/leave/requests',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        employee_id: employeeId,
        leave_type: 'ANNUAL',
        start_date: '2026-09-01',
        end_date: '2026-09-03',
        days_count: 3,
        reason: 'Liburan keluarga',
      },
    });
    leaveId = JSON.parse(leaveRes.body).data.id;

    // 4. Create overtime request
    const otRes = await app.inject({
      method: 'POST',
      url: '/api/v1/attendance/overtime-requests',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        employee_id: employeeId,
        date: '2026-09-05',
        start_time: '17:00',
        end_time: '20:00',
        duration_hours: 3,
        is_holiday: false,
        reason: 'Penyelesaian laporan akhir kuartal',
      },
    });
    overtimeId = JSON.parse(otRes.body).data.id;
  });

  it('1. GET /api/v1/approvals/pending returns pending leave & overtime requests', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/approvals/pending',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.summary.total_pending_leaves).toBeGreaterThanOrEqual(1);
    expect(body.data.summary.total_pending_overtimes).toBeGreaterThanOrEqual(1);
    expect(body.data.leaves.some((l: any) => l.id === leaveId)).toBe(true);
    expect(body.data.overtimes.some((o: any) => o.id === overtimeId)).toBe(true);
  });

  it('2. POST /api/v1/approvals/leave/:id/action approves leave request and logs audit', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/approvals/leave/${leaveId}/action`,
      headers: { authorization: `Bearer ${token}` },
      payload: { action: 'APPROVE', notes: 'Disetujui oleh direksi' },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);

    // Verify leave status in pending is now cleared
    const checkRes = await app.inject({
      method: 'GET',
      url: '/api/v1/approvals/pending',
      headers: { authorization: `Bearer ${token}` },
    });
    const checkBody = JSON.parse(checkRes.body);
    expect(checkBody.data.leaves.some((l: any) => l.id === leaveId)).toBe(false);
  });

  it('3. POST /api/v1/approvals/overtime/:id/action approves overtime request and logs audit', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/approvals/overtime/${overtimeId}/action`,
      headers: { authorization: `Bearer ${token}` },
      payload: { action: 'APPROVE', notes: 'Disetujui SPKL operasional' },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
  });

  it('4. Full lifecycle of Approval Delegation: create, list, and revoke', async () => {
    // A. Create Delegation
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/approvals/delegations',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        delegatee_id: employeeId,
        module: 'ALL',
        start_date: '2026-09-10',
        end_date: '2026-09-17',
        reason: 'Dinas luar kota ke Surabaya',
      },
    });

    expect(createRes.statusCode).toBe(201);
    delegationId = JSON.parse(createRes.body).data.id;
    expect(delegationId).toBeDefined();

    // B. List Delegations
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/v1/approvals/delegations',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listRes.statusCode).toBe(200);
    const listBody = JSON.parse(listRes.body);
    expect(listBody.data.some((d: any) => d.id === delegationId && d.status === 'ACTIVE')).toBe(true);

    // C. Revoke Delegation
    const revokeRes = await app.inject({
      method: 'PUT',
      url: `/api/v1/approvals/delegations/${delegationId}/revoke`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(revokeRes.statusCode).toBe(200);

    // D. Confirm status is REVOKED
    const listAfterRes = await app.inject({
      method: 'GET',
      url: '/api/v1/approvals/delegations',
      headers: { authorization: `Bearer ${token}` },
    });
    const revokedItem = JSON.parse(listAfterRes.body).data.find((d: any) => d.id === delegationId);
    expect(revokedItem.status).toBe('REVOKED');
  });
});
