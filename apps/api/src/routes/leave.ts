import { FastifyPluginAsync } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { withTenant } from '../db.js';

export const leaveRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        success: false,
        error_code: 'UNAUTHORIZED',
        message: 'Token tidak valid atau telah kedaluwarsa.',
      });
    }
  });

  // --------------------------------------------------------------------------
  // 1. Pengajuan Cuti (Leave Requests)
  // --------------------------------------------------------------------------
  app.get('/requests', async (request: any) => {
    const { tenant_id } = request.user;
    const { employee_id, status } = request.query as any;

    const leaves = await withTenant(tenant_id, async (sql) => {
      return sql`
        SELECT
          l.*,
          e.full_name as employee_name,
          e.nik_ktp,
          u.full_name as approved_by_name
        FROM leave_requests l
        JOIN employees e ON e.id = l.employee_id
        LEFT JOIN users u ON u.id = l.approved_by
        WHERE l.tenant_id = ${tenant_id}
          AND (${employee_id || null}::uuid IS NULL OR l.employee_id = ${employee_id || null}::uuid)
          AND (${status || null}::varchar IS NULL OR l.status = ${status || null}::varchar)
        ORDER BY l.created_at DESC
      `;
    });

    return { success: true, data: leaves };
  });

  app.post('/requests', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { employee_id, leave_type, start_date, end_date, days_count, reason, attachment_url } =
      request.body || {};

    if (!employee_id || !leave_type || !start_date || !end_date || !reason) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Karyawan, tipe cuti, tanggal mulai, tanggal selesai, dan alasan wajib diisi.',
      });
    }

    const leaveId = uuidv4();
    const newLeave = await withTenant(tenant_id, async (sql) => {
      const [inserted] = await sql`
        INSERT INTO leave_requests (
          id, tenant_id, employee_id, leave_type, start_date, end_date,
          days_count, reason, attachment_url, status
        ) VALUES (
          ${leaveId}, ${tenant_id}, ${employee_id}, ${leave_type}, ${start_date}, ${end_date},
          ${Number(days_count) || 1}, ${reason}, ${attachment_url || null}, 'PENDING'
        ) RETURNING *
      `;
      return inserted;
    });

    return reply.code(201).send({
      success: true,
      message: 'Pengajuan cuti berhasil dikirimkan dan menunggu persetujuan.',
      data: newLeave,
    });
  });

  app.put('/requests/:id/approve', async (request: any, reply) => {
    const { tenant_id, user_id } = request.user;
    const { id } = request.params as any;
    const { notes } = request.body || {};

    const updated = await withTenant(tenant_id, async (sql) => {
      const [leave] = await sql`SELECT * FROM leave_requests WHERE id = ${id} AND tenant_id = ${tenant_id}`;
      if (!leave) throw new Error('Pengajuan cuti tidak ditemukan.');

      const [res] = await sql`
        UPDATE leave_requests SET
          status = 'APPROVED',
          approved_by = ${user_id},
          approved_at = NOW(),
          notes = ${notes || null},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      return res;
    });

    return reply.send({
      success: true,
      message: 'Pengajuan cuti berhasil disetujui.',
      data: updated,
    });
  });

  app.put('/requests/:id/reject', async (request: any, reply) => {
    const { tenant_id, user_id } = request.user;
    const { id } = request.params as any;
    const { notes } = request.body || {};

    const updated = await withTenant(tenant_id, async (sql) => {
      const [res] = await sql`
        UPDATE leave_requests SET
          status = 'REJECTED',
          approved_by = ${user_id},
          approved_at = NOW(),
          notes = ${notes || null},
          updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenant_id}
        RETURNING *
      `;
      return res;
    });

    return reply.send({
      success: true,
      message: 'Pengajuan cuti telah ditolak.',
      data: updated,
    });
  });

  // --------------------------------------------------------------------------
  // 2. Surat Perintah Kerja Lembur (SPKL)
  // --------------------------------------------------------------------------
  app.get('/overtime', async (request: any) => {
    const { tenant_id } = request.user;
    const { employee_id, status } = request.query as any;

    const list = await withTenant(tenant_id, async (sql) => {
      return sql`
        SELECT
          o.*,
          e.full_name as employee_name,
          e.nik_ktp
        FROM overtime_requests o
        JOIN employees e ON e.id = o.employee_id
        WHERE o.tenant_id = ${tenant_id}
          AND (${employee_id || null}::uuid IS NULL OR o.employee_id = ${employee_id || null}::uuid)
          AND (${status || null}::varchar IS NULL OR o.status = ${status || null}::varchar)
        ORDER BY o.date DESC
      `;
    });

    return { success: true, data: list };
  });

  app.post('/overtime', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { employee_id, date, start_time, end_time, duration_hours, is_holiday, reason } = request.body || {};

    if (!employee_id || !date || !start_time || !end_time || !reason) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Karyawan, tanggal, jam mulai, jam selesai, dan alasan lembur wajib diisi.',
      });
    }

    const otId = uuidv4();
    const newOt = await withTenant(tenant_id, async (sql) => {
      const [inserted] = await sql`
        INSERT INTO overtime_requests (
          id, tenant_id, employee_id, date, start_time, end_time,
          duration_hours, is_holiday, reason, status
        ) VALUES (
          ${otId}, ${tenant_id}, ${employee_id}, ${date}, ${start_time}, ${end_time},
          ${Number(duration_hours) || 2}, ${Boolean(is_holiday)}, ${reason}, 'PENDING'
        ) RETURNING *
      `;
      return inserted;
    });

    return reply.code(201).send({
      success: true,
      message: 'SPKL Lembur berhasil didaftarkan.',
      data: newOt,
    });
  });
};
