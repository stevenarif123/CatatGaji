import { FastifyPluginAsync } from 'fastify';
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { withTenant } from '../db.js';
import {
  verifyGeofence,
  evaluateClockIn,
  calculateAttendanceDeduction,
  parseFingerprintCsv,
} from '@catatgaji/shared';

export const attendanceRoutes: FastifyPluginAsync = async (app) => {
  // Pre-handler hook to authenticate
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
  // 0. ESS Helper: Get Today's Attendance & Shift Info for Employee
  // --------------------------------------------------------------------------
  app.get('/my-today', async (request: any) => {
    const { tenant_id } = request.user;
    const employeeId = request.query?.employee_id;

    const todayStr = new Date().toISOString().split('T')[0];

    const data = await withTenant(tenant_id, async (sql) => {
      // Find employee
      let emp: any = null;
      if (employeeId) {
        [emp] = await sql`SELECT * FROM employees WHERE id = ${employeeId} AND tenant_id = ${tenant_id}`;
      } else {
        [emp] = await sql`SELECT * FROM employees WHERE tenant_id = ${tenant_id} AND deleted_at IS NULL LIMIT 1`;
      }

      if (!emp) {
        return { employee: null, today_log: null, shift: null, geofence: null };
      }

      const [todayLog] = await sql`
        SELECT * FROM attendance_logs
        WHERE tenant_id = ${tenant_id} AND employee_id = ${emp.id} AND date = ${todayStr}
      `;

      const [shift] = await sql`
        SELECT * FROM shifts WHERE tenant_id = ${tenant_id} LIMIT 1
      `;

      const [geofence] = await sql`
        SELECT * FROM branch_geofences WHERE tenant_id = ${tenant_id} LIMIT 1
      `;

      return {
        employee: {
          id: emp.id,
          full_name: emp.full_name,
          nik_ktp: emp.nik_ktp,
          employment_status: emp.employment_status,
          ptkp_status: emp.ptkp_status,
        },
        today_log: todayLog || null,
        shift: shift || { name: 'Shift Pagi Reguler', start_time: '08:00', end_time: '17:00' },
        geofence: geofence || null,
      };
    });

    return { success: true, data };
  });

  // --------------------------------------------------------------------------
  // 1. Shifts Management
  // --------------------------------------------------------------------------
  app.get('/shifts', async (request: any) => {
    const { tenant_id } = request.user;
    const shifts = await withTenant(tenant_id, async (sql) => {
      return sql`SELECT * FROM shifts WHERE tenant_id = ${tenant_id} ORDER BY start_time ASC`;
    });
    return { success: true, data: shifts };
  });

  app.post('/shifts', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { name, code, start_time, end_time, cross_day, grace_period_mins, work_hours } = request.body || {};

    if (!name || !code || !start_time || !end_time) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Nama shift, kode, jam mulai, dan jam selesai wajib diisi.',
      });
    }

    const shiftId = uuidv4();
    const newShift = await withTenant(tenant_id, async (sql) => {
      const [inserted] = await sql`
        INSERT INTO shifts (
          id, tenant_id, name, code, start_time, end_time, cross_day, grace_period_mins, work_hours
        ) VALUES (
          ${shiftId}, ${tenant_id}, ${name}, ${code}, ${start_time}, ${end_time},
          ${Boolean(cross_day)}, ${Number(grace_period_mins) || 15}, ${Number(work_hours) || 8}
        ) RETURNING *
      `;
      return inserted;
    });

    return reply.code(201).send({ success: true, data: newShift });
  });

  // --------------------------------------------------------------------------
  // 2. Geofence Management
  // --------------------------------------------------------------------------
  app.get('/geofences', async (request: any) => {
    const { tenant_id } = request.user;
    const geofences = await withTenant(tenant_id, async (sql) => {
      return sql`
        SELECT g.*, b.name as branch_name
        FROM branch_geofences g
        JOIN branches_departments b ON b.id = g.branch_id
        WHERE g.tenant_id = ${tenant_id}
      `;
    });
    return { success: true, data: geofences };
  });

  app.post('/geofences', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { branch_id, latitude, longitude, radius_meters } = request.body || {};

    if (!branch_id || latitude === undefined || longitude === undefined) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Cabang, latitude, dan longitude wajib diisi.',
      });
    }

    const geofenceId = uuidv4();
    const geofence = await withTenant(tenant_id, async (sql) => {
      const [inserted] = await sql`
        INSERT INTO branch_geofences (
          id, tenant_id, branch_id, latitude, longitude, radius_meters
        ) VALUES (
          ${geofenceId}, ${tenant_id}, ${branch_id}, ${latitude}, ${longitude}, ${Number(radius_meters) || 100}
        ) RETURNING *
      `;
      return inserted;
    });

    return reply.code(201).send({ success: true, data: geofence });
  });

  // --------------------------------------------------------------------------
  app.get('/logs', async (request: any) => {
    const { tenant_id } = request.user;
    const { start_date, end_date, employee_id, status } = request.query as any;

    const logs = await withTenant(tenant_id, async (sql) => {
      return sql`
        SELECT
          l.*,
          e.full_name as employee_name,
          e.nik_ktp,
          e.employment_status,
          b.name as branch_name,
          s.name as shift_name
        FROM attendance_logs l
        JOIN employees e ON e.id = l.employee_id
        LEFT JOIN branches_departments b ON b.id = e.branch_id
        LEFT JOIN shifts s ON s.id = l.shift_id
        WHERE l.tenant_id = ${tenant_id}
          AND (${start_date || null}::date IS NULL OR l.date >= ${start_date || null}::date)
          AND (${end_date || null}::date IS NULL OR l.date <= ${end_date || null}::date)
          AND (${employee_id || null}::uuid IS NULL OR l.employee_id = ${employee_id || null}::uuid)
          AND (${status || null}::varchar IS NULL OR l.status = ${status || null}::varchar)
        ORDER BY l.date DESC, l.clock_in DESC
        LIMIT 100
      `;
    });

    return { success: true, data: logs };
  });

  // --------------------------------------------------------------------------
  // 4. Clock-In (GPS Geofence + Liveness Selfie)
  // --------------------------------------------------------------------------
  app.post('/clock-in', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { employee_id, latitude, longitude, selfie_url, notes } = request.body || {};

    if (!employee_id || latitude === undefined || longitude === undefined) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Karyawan, koordinat latitude, dan longitude wajib disertakan.',
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();

    const result = await withTenant(tenant_id, async (sql) => {
      // 1. Cek apakah sudah clock-in hari ini
      const [existing] = await sql`
        SELECT * FROM attendance_logs
        WHERE tenant_id = ${tenant_id} AND employee_id = ${employee_id} AND date = ${todayStr}
      `;
      if (existing && existing.clock_in) {
        throw new Error('Karyawan sudah melakukan absensi masuk (Clock-In) hari ini.');
      }

      // 2. Ambil data cabang & geofence karyawan
      const [emp] = await sql`
        SELECT e.*, s.basic_salary
        FROM employees e
        LEFT JOIN employee_salaries s ON s.employee_id = e.id AND s.is_current = true
        WHERE e.id = ${employee_id} AND e.tenant_id = ${tenant_id}
      `;
      if (!emp) throw new Error('Karyawan tidak ditemukan.');

      let distanceMeters = 0;
      if (emp.branch_id) {
        const [gf] = await sql`
          SELECT * FROM branch_geofences
          WHERE branch_id = ${emp.branch_id} AND tenant_id = ${tenant_id}
          LIMIT 1
        `;
        if (gf) {
          const verification = verifyGeofence(
            Number(latitude),
            Number(longitude),
            Number(gf.latitude),
            Number(gf.longitude),
            Number(gf.radius_meters) || 100
          );
          distanceMeters = verification.distanceMeters;
          if (!verification.isWithinRadius) {
            throw new Error(
              `Anda berada di luar radius kantor cabang (${Math.round(distanceMeters)}m dari batas ${gf.radius_meters}m). Clock-In ditolak.`
            );
          }
        }
      }

      // 3. Evaluasi Keterlambatan
      const [shift] = await sql`
        SELECT * FROM shifts WHERE tenant_id = ${tenant_id} AND is_active = true ORDER BY created_at ASC LIMIT 1
      `;
      const shiftStartTime = shift ? shift.start_time : '08:30:00';
      const graceMins = shift ? shift.grace_period_mins : 15;

      const evalResult = evaluateClockIn(now, shiftStartTime, graceMins);
      const status = evalResult.isLate ? 'LATE' : 'PRESENT';

      // Hitung potensi potongan keterlambatan jika ada
      const dailySalary = Number(emp.basic_salary) ? Number(emp.basic_salary) / 25 : 150000;
      const deduction = evalResult.isLate
        ? calculateAttendanceDeduction(evalResult.lateMinutes, dailySalary, 'PRORATA_TIME')
        : 0;

      const logId = existing ? existing.id : uuidv4();

      if (existing) {
        const [updated] = await sql`
          UPDATE attendance_logs SET
            clock_in = ${now.toISOString()},
            clock_in_lat = ${latitude},
            clock_in_lon = ${longitude},
            clock_in_distance_m = ${distanceMeters},
            clock_in_selfie_url = ${selfie_url || null},
            late_minutes = ${evalResult.lateMinutes},
            status = ${status},
            deduction_amount = ${deduction},
            notes = ${notes || null},
            updated_at = NOW()
          WHERE id = ${logId}
          RETURNING *
        `;
        return updated;
      } else {
        const [inserted] = await sql`
          INSERT INTO attendance_logs (
            id, tenant_id, employee_id, shift_id, date, clock_in,
            clock_in_lat, clock_in_lon, clock_in_distance_m, clock_in_selfie_url,
            late_minutes, status, deduction_amount, source, notes
          ) VALUES (
            ${logId}, ${tenant_id}, ${employee_id}, ${shift ? shift.id : null}, ${todayStr}, ${now.toISOString()},
            ${latitude}, ${longitude}, ${distanceMeters}, ${selfie_url || null},
            ${evalResult.lateMinutes}, ${status}, ${deduction}, 'MOBILE_GPS', ${notes || null}
          ) RETURNING *
        `;
        return inserted;
      }
    });

    return reply.code(201).send({
      success: true,
      message: result.late_minutes > 0 ? `Clock-In berhasil (Terlambat ${result.late_minutes} menit)` : 'Clock-In berhasil tepat waktu.',
      data: result,
    });
  });

  // --------------------------------------------------------------------------
  // 5. Clock-Out
  // --------------------------------------------------------------------------
  app.post('/clock-out', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { employee_id, latitude, longitude, selfie_url } = request.body || {};

    if (!employee_id) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Karyawan ID wajib disertakan.',
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();

    const result = await withTenant(tenant_id, async (sql) => {
      const [existing] = await sql`
        SELECT * FROM attendance_logs
        WHERE tenant_id = ${tenant_id} AND employee_id = ${employee_id} AND date = ${todayStr}
      `;
      if (!existing || !existing.clock_in) {
        throw new Error('Karyawan belum melakukan Clock-In hari ini.');
      }
      if (existing.clock_out) {
        throw new Error('Karyawan sudah melakukan Clock-Out hari ini.');
      }

      const clockInTime = new Date(existing.clock_in);
      const diffMs = now.getTime() - clockInTime.getTime();
      const workDurationMinutes = Math.floor(diffMs / 60000);

      // Hitung lembur jika bekerja lebih dari 8 jam (480 menit)
      const overtimeMinutes = Math.max(0, workDurationMinutes - 480);

      const [updated] = await sql`
        UPDATE attendance_logs SET
          clock_out = ${now.toISOString()},
          clock_out_lat = ${latitude || null},
          clock_out_lon = ${longitude || null},
          clock_out_selfie_url = ${selfie_url || null},
          work_duration_minutes = ${workDurationMinutes},
          overtime_minutes = ${overtimeMinutes},
          updated_at = NOW()
        WHERE id = ${existing.id}
        RETURNING *
      `;
      return updated;
    });

    return reply.send({
      success: true,
      message: 'Clock-Out berhasil dicatat.',
      data: result,
    });
  });

  // --------------------------------------------------------------------------
  // 6. Impor Log CSV Mesin Fingerprint Biometrik
  // --------------------------------------------------------------------------
  app.post('/import-csv', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { csv_content } = request.body || {};

    if (!csv_content || typeof csv_content !== 'string') {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Konten berkas CSV absensi tidak valid.',
      });
    }

    const records = parseFingerprintCsv(csv_content);
    if (records.length === 0) {
      return reply.code(400).send({
        success: false,
        error_code: 'NO_VALID_DATA',
        message: 'Tidak ada baris data absensi yang valid dalam CSV.',
      });
    }

    let insertedCount = 0;

    await withTenant(tenant_id, async (sql) => {
      // Ambil seluruh karyawan untuk mapping NIK / ID
      const employees = await sql`SELECT id, nik_ktp, full_name FROM employees WHERE tenant_id = ${tenant_id}`;

      for (const rec of records) {
        // Cari karyawan berdasarkan NIK atau sub-string NIK
        const emp = employees.find((e: any) => e.nik_ktp?.includes(rec.pin) || e.id === rec.pin);
        if (!emp) continue;

        const [existing] = await sql`
          SELECT * FROM attendance_logs
          WHERE tenant_id = ${tenant_id} AND employee_id = ${emp.id} AND date = ${rec.date}
        `;

        if (!existing) {
          await sql`
            INSERT INTO attendance_logs (
              id, tenant_id, employee_id, date,
              clock_in, status, source
            ) VALUES (
              ${uuidv4()}, ${tenant_id}, ${emp.id}, ${rec.date},
              ${rec.timestamp.toISOString()}, 'PRESENT', 'FINGERPRINT_IMPORT'
            )
          `;
          insertedCount++;
        } else if (rec.type === 'OUT' && !existing.clock_out) {
          const clockInTime = new Date(existing.clock_in);
          const workMins = Math.floor((rec.timestamp.getTime() - clockInTime.getTime()) / 60000);
          await sql`
            UPDATE attendance_logs SET
              clock_out = ${rec.timestamp.toISOString()},
              work_duration_minutes = ${workMins},
              updated_at = NOW()
            WHERE id = ${existing.id}
          `;
          insertedCount++;
        }
      }
    });

    return reply.send({
      success: true,
      message: `Berhasil memproses ${insertedCount} log kehadiran dari mesin fingerprint.`,
      data: { processed_count: insertedCount, raw_records_count: records.length },
    });
  });

  // --------------------------------------------------------------------------
  // 7. Rekapitulasi Bulanan Kehadiran (Terhubung ke Payroll Engine)
  // --------------------------------------------------------------------------
  app.get('/summary/monthly/:year/:month', async (request: any) => {
    const { tenant_id } = request.user;
    const { year, month } = request.params as any;

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const summary = await withTenant(tenant_id, async (sql) => {
      return sql`
        SELECT
          e.id as employee_id,
          e.full_name as employee_name,
          e.nik_ktp,
          COUNT(l.id) FILTER (WHERE l.status IN ('PRESENT', 'LATE')) as total_present,
          COUNT(l.id) FILTER (WHERE l.status = 'LATE') as total_late_days,
          COALESCE(SUM(l.late_minutes), 0) as total_late_minutes,
          COALESCE(SUM(l.overtime_minutes), 0) as total_overtime_minutes,
          COALESCE(SUM(l.deduction_amount), 0) as total_attendance_deduction
        FROM employees e
        LEFT JOIN attendance_logs l ON l.employee_id = e.id
          AND l.date >= ${startDate} AND l.date <= ${endDate}
          AND l.tenant_id = ${tenant_id}
        WHERE e.tenant_id = ${tenant_id} AND e.status = 'ACTIVE'
        GROUP BY e.id, e.full_name, e.nik_ktp
        ORDER BY e.full_name ASC
      `;
    });

    return {
      success: true,
      data: {
        period_year: Number(year),
        period_month: Number(month),
        summary,
      },
    };
  });

  // --------------------------------------------------------------------------
  // 8. Pengajuan Lembur (SPKL Overtime Requests)
  // --------------------------------------------------------------------------
  app.get('/overtime-requests', async (request: any) => {
    const { tenant_id } = request.user;
    const { employee_id, status } = request.query as any;

    const list = await withTenant(tenant_id, async (sql) => {
      return sql`
        SELECT o.*, e.full_name as employee_name, e.nik_ktp
        FROM overtime_requests o
        JOIN employees e ON e.id = o.employee_id
        WHERE o.tenant_id = ${tenant_id}
          AND (${employee_id || null}::uuid IS NULL OR o.employee_id = ${employee_id || null}::uuid)
          AND (${status || null}::varchar IS NULL OR o.status = ${status || null}::varchar)
        ORDER BY o.date DESC, o.created_at DESC
      `;
    });

    return { success: true, data: list };
  });

  app.post('/overtime-requests', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const { employee_id, date, start_time, end_time, duration_hours, is_holiday, reason } =
      request.body || {};

    if (!employee_id || !date || !start_time || !end_time || duration_hours === undefined || !reason) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Karyawan, tanggal, jam mulai/selesai, durasi, dan alasan lembur wajib diisi.',
      });
    }

    const otId = uuidv7();

    const created = await withTenant(tenant_id, async (sql) => {
      const [inserted] = await sql`
        INSERT INTO overtime_requests (
          id, tenant_id, employee_id, date, start_time, end_time,
          duration_hours, is_holiday, reason, status, created_at, updated_at
        ) VALUES (
          ${otId}, ${tenant_id}, ${employee_id}, ${date}, ${start_time}, ${end_time},
          ${Number(duration_hours)}, ${!!is_holiday}, ${reason}, 'PENDING', NOW(), NOW()
        ) RETURNING *
      `;
      return inserted;
    });

    return reply.code(201).send({
      success: true,
      message: 'Surat Perintah Kerja Lembur (SPKL) berhasil diajukan.',
      data: created,
    });
  });
};
