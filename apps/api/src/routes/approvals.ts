import type { FastifyPluginAsync } from 'fastify';
import { v7 as uuidv7 } from 'uuid';
import { sql } from '../db.js';

export const approvalRoutes: FastifyPluginAsync = async (app) => {
  // Require JWT authentication
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        success: false,
        error_code: 'UNAUTHORIZED',
        message: 'Sesi telah berakhir atau token tidak valid.',
      });
    }
  });

  /**
   * 1. GET /api/v1/approvals/pending
   * Mengambil seluruh daftar permohonan yang menunggu persetujuan
   */
  app.get('/pending', async (request) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;

    const [pendingLeaves, pendingOvertimes, pendingPayrolls] = await Promise.all([
      sql`
        SELECT l.*, e.full_name as employee_name, e.nik_ktp, b.name as branch_name
        FROM leave_requests l
        JOIN employees e ON e.id = l.employee_id
        LEFT JOIN branches_departments b ON b.id = e.branch_id
        WHERE l.tenant_id = ${tenantId} AND l.status = 'PENDING'
        ORDER BY l.created_at ASC
      `,
      sql`
        SELECT o.*, e.full_name as employee_name, e.nik_ktp, b.name as branch_name
        FROM overtime_requests o
        JOIN employees e ON e.id = o.employee_id
        LEFT JOIN branches_departments b ON b.id = e.branch_id
        WHERE o.tenant_id = ${tenantId} AND o.status = 'PENDING'
        ORDER BY o.created_at ASC
      `,
      sql`
        SELECT p.*, u.full_name as submitted_by_name
        FROM payroll_periods p
        LEFT JOIN users u ON u.id = p.created_by
        WHERE p.tenant_id = ${tenantId} AND p.status = 'SUBMITTED'
        ORDER BY p.period_year DESC, p.period_month DESC
      `,
    ]);

    return {
      success: true,
      data: {
        summary: {
          total_pending_leaves: pendingLeaves.length,
          total_pending_overtimes: pendingOvertimes.length,
          total_pending_payrolls: pendingPayrolls.length,
          grand_total: pendingLeaves.length + pendingOvertimes.length + pendingPayrolls.length,
        },
        leaves: pendingLeaves,
        overtimes: pendingOvertimes,
        payrolls: pendingPayrolls,
      },
    };
  });

  /**
   * 2. POST /api/v1/approvals/leave/:id/action
   * Setujui atau Tolak Permohonan Cuti
   */
  app.post('/leave/:id/action', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id } = request.params as any;
    const body = (request.body as any) || {};
    const { action, notes, rejection_reason } = body;

    if (!action || !['APPROVE', 'REJECT'].includes(action.toUpperCase())) {
      return reply.code(400).send({
        success: false,
        message: 'Aksi persetujuan harus APPROVE atau REJECT.',
      });
    }

    const [leave] = await sql`
      SELECT * FROM leave_requests WHERE id = ${id} AND tenant_id = ${tenantId}
    `;
    if (!leave) {
      return reply.code(404).send({ success: false, message: 'Permohonan cuti tidak ditemukan.' });
    }

    const userId = user.user_id || user.id;

    if (action.toUpperCase() === 'REJECT') {
      await sql`
        UPDATE leave_requests
        SET status = 'REJECTED',
            rejection_reason = ${rejection_reason || notes || 'Ditolak oleh atasan'},
            approved_by = ${userId},
            approved_at = NOW(),
            updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `;

      // Log audit
      await sql`
        INSERT INTO audit_logs (id, tenant_id, user_id, user_name, action, entity_type, entity_id, new_values, created_at)
        VALUES (
          ${uuidv7()}, ${tenantId}, ${userId}, ${user.full_name || 'Admin'},
          'LEAVE_REJECTED', 'LEAVE', ${id},
          ${JSON.stringify({ reason: rejection_reason || notes })}, NOW()
        )
      `;

      return { success: true, message: 'Permohonan cuti berhasil ditolak.' };
    }

    // APPROVE
    const currentStage = leave.approval_stage || 1;
    const isOwnerOrHr = ['OWNER', 'HR_ADMIN'].includes(user.role);

    if (currentStage === 1 && !isOwnerOrHr) {
      // Advance to level 2
      await sql`
        UPDATE leave_requests
        SET approval_stage = 2,
            level1_approved_by = ${userId},
            level1_approved_at = NOW(),
            notes = ${notes || null},
            updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `;
      return { success: true, message: 'Persetujuan Level 1 (Atasan) berhasil. Menunggu verifikasi HR.' };
    }

    // Final Approval (Level 2 or Direct by HR/Owner)
    await sql`
      UPDATE leave_requests
      SET status = 'APPROVED',
          approval_stage = 2,
          level2_approved_by = ${userId},
          level2_approved_at = NOW(),
          approved_by = ${userId},
          approved_at = NOW(),
          notes = ${notes || null},
          updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `;

    // Log audit
    await sql`
      INSERT INTO audit_logs (id, tenant_id, user_id, user_name, action, entity_type, entity_id, new_values, created_at)
      VALUES (
        ${uuidv7()}, ${tenantId}, ${userId}, ${user.full_name || 'Admin'},
        'LEAVE_APPROVED', 'LEAVE', ${id},
        ${JSON.stringify({ days_count: leave.days_count, leave_type: leave.leave_type })}, NOW()
      )
    `;

    return { success: true, message: 'Permohonan cuti telah disetujui sepenuhnya.' };
  });

  /**
   * 3. POST /api/v1/approvals/overtime/:id/action
   * Setujui atau Tolak SPKL Lembur
   */
  app.post('/overtime/:id/action', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const userId = user.user_id || user.id;
    const { id } = request.params as any;
    const body = (request.body as any) || {};
    const { action, notes, rejection_reason } = body;

    if (!action || !['APPROVE', 'REJECT'].includes(action.toUpperCase())) {
      return reply.code(400).send({
        success: false,
        message: 'Aksi persetujuan harus APPROVE atau REJECT.',
      });
    }

    const [ot] = await sql`
      SELECT * FROM overtime_requests WHERE id = ${id} AND tenant_id = ${tenantId}
    `;
    if (!ot) {
      return reply.code(404).send({ success: false, message: 'Surat tugas lembur tidak ditemukan.' });
    }

    if (action.toUpperCase() === 'REJECT') {
      await sql`
        UPDATE overtime_requests
        SET status = 'REJECTED',
            rejection_reason = ${rejection_reason || notes || 'Ditolak oleh atasan'},
            approved_by = ${userId},
            approved_at = NOW(),
            updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `;

      // Log audit
      await sql`
        INSERT INTO audit_logs (id, tenant_id, user_id, user_name, action, entity_type, entity_id, new_values, created_at)
        VALUES (
          ${uuidv7()}, ${tenantId}, ${userId}, ${user.full_name || 'Admin'},
          'OVERTIME_REJECTED', 'OVERTIME', ${id},
          ${JSON.stringify({ reason: rejection_reason || notes })}, NOW()
        )
      `;

      return { success: true, message: 'Surat tugas lembur berhasil ditolak.' };
    }

    // APPROVE
    const currentStage = ot.approval_stage || 1;
    const isOwnerOrHr = ['OWNER', 'HR_ADMIN'].includes(user.role);

    if (currentStage === 1 && !isOwnerOrHr) {
      await sql`
        UPDATE overtime_requests
        SET approval_stage = 2,
            level1_approved_by = ${userId},
            level1_approved_at = NOW(),
            updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `;
      return { success: true, message: 'Persetujuan Level 1 (Supervisor) berhasil. Menunggu verifikasi HR.' };
    }

    // Final Approval
    await sql`
      UPDATE overtime_requests
      SET status = 'APPROVED',
          approval_stage = 2,
          level2_approved_by = ${userId},
          level2_approved_at = NOW(),
          approved_by = ${userId},
          approved_at = NOW(),
          updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `;

    // Log audit
    await sql`
      INSERT INTO audit_logs (id, tenant_id, user_id, user_name, action, entity_type, entity_id, new_values, created_at)
      VALUES (
        ${uuidv7()}, ${tenantId}, ${userId}, ${user.full_name || 'Admin'},
        'OVERTIME_APPROVED', 'OVERTIME', ${id},
        ${JSON.stringify({ duration_hours: ot.duration_hours })}, NOW()
      )
    `;

    return { success: true, message: 'Surat tugas lembur telah disetujui sepenuhnya.' };
  });

  /**
   * 4. GET /api/v1/approvals/delegations
   * Daftar Delegasi Wewenang
   */
  app.get('/delegations', async (request) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;

    const delegations = await sql`
      SELECT d.*, 
             COALESCE(u1.full_name, 'Pengguna') as delegator_name, 
             COALESCE(u2.full_name, e.full_name, 'Karyawan Penerima') as delegatee_name
      FROM approval_delegations d
      LEFT JOIN users u1 ON u1.id = d.delegator_id
      LEFT JOIN users u2 ON u2.id = d.delegatee_id
      LEFT JOIN employees e ON e.id = d.delegatee_id
      WHERE d.tenant_id = ${tenantId}
      ORDER BY d.created_at DESC
    `;

    return { success: true, data: delegations };
  });

  /**
   * 5. POST /api/v1/approvals/delegations
   * Tambah Delegasi Wewenang Baru
   */
  app.post('/delegations', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const userId = user.user_id || user.id;
    const body = request.body as any;

    const { delegatee_id, module, start_date, end_date, reason } = body;

    if (!delegatee_id || !start_date || !end_date) {
      return reply.code(400).send({
        success: false,
        message: 'Penerima delegasi, tanggal mulai, dan tanggal selesai wajib diisi.',
      });
    }

    const delegationId = uuidv7();

    await sql`
      INSERT INTO approval_delegations (
        id, tenant_id, delegator_id, delegatee_id, module,
        start_date, end_date, reason, status, created_at, updated_at
      ) VALUES (
        ${delegationId}, ${tenantId}, ${userId}, ${delegatee_id}, ${module || 'ALL'},
        ${start_date}, ${end_date}, ${reason || null}, 'ACTIVE', NOW(), NOW()
      )
    `;

    return reply.code(201).send({
      success: true,
      message: 'Delegasi wewenang berhasil diaktifkan.',
      data: { id: delegationId },
    });
  });

  /**
   * 6. PUT /api/v1/approvals/delegations/:id/revoke
   * Cabut Delegasi Wewenang
   */
  app.put('/delegations/:id/revoke', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id } = request.params as any;

    const [delegation] = await sql`
      SELECT * FROM approval_delegations WHERE id = ${id} AND tenant_id = ${tenantId}
    `;
    if (!delegation) {
      return reply.code(404).send({ success: false, message: 'Data delegasi tidak ditemukan.' });
    }

    await sql`
      UPDATE approval_delegations
      SET status = 'REVOKED', updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `;

    return { success: true, message: 'Delegasi wewenang berhasil dicabut.' };
  });
};
