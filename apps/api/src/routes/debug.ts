import { FastifyPluginAsync } from 'fastify';
import { v7 as uuidv7 } from 'uuid';
import { withTenant } from '../db.js';

export const debugRoutes: FastifyPluginAsync = async (app) => {
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
  // 1. Seed Comprehensive Demo Data
  // --------------------------------------------------------------------------
  app.post('/seed-demo-data', async (request: any, reply) => {
    const { tenant_id } = request.user;

    const result = await withTenant(tenant_id, async (sql) => {
      // 1. Ensure Shifts exist
      const shiftId = uuidv7();
      const [existingShift] = await sql`SELECT id FROM shifts WHERE tenant_id = ${tenant_id} LIMIT 1`;
      let activeShiftId = existingShift?.id;

      if (!activeShiftId) {
        await sql`
          INSERT INTO shifts (id, tenant_id, name, code, start_time, end_time, work_hours, grace_period_mins, is_active)
          VALUES (${shiftId}, ${tenant_id}, 'Shift Reguler Pagi', 'PAGI-01', '08:00:00', '17:00:00', 8.00, 15, true)
        `;
        activeShiftId = shiftId;
      }

      // 2. Ensure Branches exist
      const branchJakartaId = uuidv7();
      const branchSurabayaId = uuidv7();
      const [existingBranch] = await sql`SELECT id FROM branches_departments WHERE tenant_id = ${tenant_id} LIMIT 1`;
      let activeBranchId = existingBranch?.id;

      if (!activeBranchId) {
        await sql`
          INSERT INTO branches_departments (id, tenant_id, name, type, code, address, latitude, longitude, radius_meters)
          VALUES 
            (${branchJakartaId}, ${tenant_id}, 'Kantor Pusat Jakarta', 'HEAD_OFFICE', 'HQ-JKT', 'Jl. Sudirman No. 45, Jakarta Pusat', -6.2087634, 106.845599, 150),
            (${branchSurabayaId}, ${tenant_id}, 'Cabang Surabaya', 'BRANCH', 'BR-SBY', 'Jl. Basuki Rahmat No. 12, Surabaya', -7.2574719, 112.7520883, 150)
        `;
        activeBranchId = branchJakartaId;
      }

      // 3. Create 5 Realistic Indonesian Mock Employees
      const mockEmployees = [
        {
          name: 'Budi Santoso, S.Kom',
          nik: '3171012304890001',
          email: `budi.santoso_${Date.now().toString().slice(-4)}@example.com`,
          phone: '081234567890',
          gender: 'MALE',
          ptkp: 'TK/0',
          ter: 'A',
          basicSalary: 15000000,
          fixedAllowances: [{ name: 'Tunjangan Jabatan', amount: 3000000 }, { name: 'Tunjangan Komunikasi', amount: 500000 }],
          nonFixedAllowances: [{ name: 'Insentif Kinerja', amount: 1000000 }],
          jkkGrade: 2,
          bankName: 'BCA',
          bankAccountNo: '5420192831',
          employmentStatus: 'PKWTT',
        },
        {
          name: 'Siti Rahmawati, S.E.',
          nik: '3273016508920002',
          email: `siti.rahma_${Date.now().toString().slice(-4)}@example.com`,
          phone: '081298765432',
          gender: 'FEMALE',
          ptkp: 'K/1',
          ter: 'B',
          basicSalary: 12000000,
          fixedAllowances: [{ name: 'Tunjangan Jabatan', amount: 2000000 }],
          nonFixedAllowances: [],
          jkkGrade: 2,
          bankName: 'Mandiri',
          bankAccountNo: '1370019283741',
          employmentStatus: 'PKWTT',
        },
        {
          name: 'Ahmad Fauzi',
          nik: '3578011201950003',
          email: `ahmad.fauzi_${Date.now().toString().slice(-4)}@example.com`,
          phone: '085712345678',
          gender: 'MALE',
          ptkp: 'TK/1',
          ter: 'A',
          basicSalary: 6500000,
          fixedAllowances: [{ name: 'Tunjangan Transport', amount: 800000 }],
          nonFixedAllowances: [{ name: 'Uang Makan', amount: 400000 }],
          jkkGrade: 3,
          bankName: 'BRI',
          bankAccountNo: '034101002938472',
          employmentStatus: 'PKWT',
        },
        {
          name: 'Dewi Lestari',
          nik: '3374015403980004',
          email: `dewi.lestari_${Date.now().toString().slice(-4)}@example.com`,
          phone: '087812348901',
          gender: 'FEMALE',
          ptkp: 'K/2',
          ter: 'B',
          basicSalary: 8500000,
          fixedAllowances: [{ name: 'Tunjangan Keahlian', amount: 1500000 }],
          nonFixedAllowances: [],
          jkkGrade: 1,
          bankName: 'BNI',
          bankAccountNo: '0892738491',
          employmentStatus: 'PKWTT',
        },
        {
          name: 'Eko Prasetyo',
          nik: '3671011906960005',
          email: `eko.prasetyo_${Date.now().toString().slice(-4)}@example.com`,
          phone: '089612345678',
          gender: 'MALE',
          ptkp: 'TK/3',
          ter: 'B',
          basicSalary: 5200000,
          fixedAllowances: [{ name: 'Tunjangan Operasional', amount: 500000 }],
          nonFixedAllowances: [{ name: 'Bonus Lapangan', amount: 300000 }],
          jkkGrade: 4,
          bankName: 'BCA',
          bankAccountNo: '8720192834',
          employmentStatus: 'PKWT',
        },
      ];

      const insertedEmployeeIds: string[] = [];

      for (const m of mockEmployees) {
        const empId = uuidv7();
        const salId = uuidv7();

        await sql`
          INSERT INTO employees (
            id, tenant_id, nik_ktp, npwp, bpjs_kes_no, bpjs_tk_no,
            full_name, email, phone, gender, birth_date,
            branch_id, join_date, employment_status, ptkp_status,
            pph21_ter_category, salary_type, bank_name, bank_account_no, bank_account_holder, status
          ) VALUES (
            ${empId}, ${tenant_id}, ${m.nik}, '09.123.456.7-012.000', '0001234567890', '98765432100',
            ${m.name}, ${m.email}, ${m.phone}, ${m.gender}, '1992-05-15',
            ${activeBranchId}, '2023-01-10', ${m.employmentStatus}, ${m.ptkp},
            ${m.ter}, 'MONTHLY', ${m.bankName}, ${m.bankAccountNo}, ${m.name}, 'ACTIVE'
          )
        `;

        await sql`
          INSERT INTO employee_salaries (
            id, tenant_id, employee_id, basic_salary, fixed_allowances_json, non_fixed_allowances_json,
            jkk_risk_grade, bpjs_kes_override, pph21_scheme, effective_date, is_current
          ) VALUES (
            ${salId}, ${tenant_id}, ${empId}, ${m.basicSalary},
            ${JSON.stringify(m.fixedAllowances)}::jsonb, ${JSON.stringify(m.nonFixedAllowances)}::jsonb,
            ${m.jkkGrade}, false, 'GROSS', '2023-01-10', true
          )
        `;

        insertedEmployeeIds.push(empId);
      }

      // 4. Generate 10 days of Realistic Attendance Logs for all employees
      const today = new Date();
      for (let dayOffset = 10; dayOffset >= 1; dayOffset--) {
        const logDate = new Date(today);
        logDate.setDate(today.getDate() - dayOffset);

        // Skip Sunday
        if (logDate.getDay() === 0) continue;

        const dateStr = logDate.toISOString().split('T')[0];

        for (const empId of insertedEmployeeIds) {
          const logId = uuidv7();
          const isLate = Math.random() < 0.2;
          const lateMins = isLate ? Math.floor(Math.random() * 25) + 5 : 0;
          const overtimeMins = Math.random() < 0.3 ? 120 : 0;

          const clockInTime = new Date(logDate);
          clockInTime.setHours(8, lateMins, 0, 0);

          const clockOutTime = new Date(logDate);
          clockOutTime.setHours(17 + Math.floor(overtimeMins / 60), overtimeMins % 60, 0, 0);

          await sql`
            INSERT INTO attendance_logs (
              id, tenant_id, employee_id, shift_id, date,
              clock_in, clock_out, late_minutes, early_leave_minutes,
              work_duration_minutes, overtime_minutes, status
            ) VALUES (
              ${logId}, ${tenant_id}, ${empId}, ${activeShiftId}, ${dateStr},
              ${clockInTime.toISOString()}, ${clockOutTime.toISOString()},
              ${lateMins}, 0, 480 + overtimeMins, ${overtimeMins}, ${isLate ? 'LATE' : 'PRESENT'}
            )
            ON CONFLICT DO NOTHING
          `;
        }
      }

      // 5. Ensure a DRAFT Payroll Period exists for the current month
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const [existingPeriod] = await sql`
        SELECT id FROM payroll_periods 
        WHERE tenant_id = ${tenant_id} AND period_year = ${currentYear} AND period_month = ${currentMonth}
        LIMIT 1
      `;

      if (!existingPeriod) {
        const periodId = uuidv7();
        const startOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(currentYear, currentMonth, 0).getDate();
        const endOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${lastDay}`;
        const payoutDate = endOfMonth;

        await sql`
          INSERT INTO payroll_periods (
            id, tenant_id, period_year, period_month, start_date, end_date, payout_date, status,
            total_gross, total_pph21, total_bpjs_employer, total_bpjs_employee, total_thp, total_employer_cost,
            created_at, updated_at
          ) VALUES (
            ${periodId}, ${tenant_id}, ${currentYear}, ${currentMonth}, ${startOfMonth}, ${endOfMonth}, ${payoutDate}, 'DRAFT',
            0, 0, 0, 0, 0, 0, NOW(), NOW()
          )
        `;
      }

      return {
        employeesCount: insertedEmployeeIds.length,
        periodMonth: currentMonth,
        periodYear: currentYear,
      };
    });

    return reply.send({
      success: true,
      message: `Berhasil men-generate ${result.employeesCount} karyawan mock lengkap dengan gaji, BPJS, PPh 21 TER, absensi 10 hari, dan periode draf payroll aktif!`,
      data: result,
    });
  });

  // --------------------------------------------------------------------------
  // 2. Reset / Clear Demo Data
  // --------------------------------------------------------------------------
  app.post('/reset-demo-data', async (request: any, reply) => {
    const { tenant_id } = request.user;

    await withTenant(tenant_id, async (sql) => {
      await sql`DELETE FROM employee_payroll_results WHERE tenant_id = ${tenant_id}`;
      await sql`DELETE FROM payroll_periods WHERE tenant_id = ${tenant_id}`;
      await sql`DELETE FROM attendance_logs WHERE tenant_id = ${tenant_id}`;
      await sql`DELETE FROM employee_salaries WHERE tenant_id = ${tenant_id}`;
      await sql`DELETE FROM employees WHERE tenant_id = ${tenant_id}`;
    });

    return reply.send({
      success: true,
      message: 'Seluruh data pengujian (karyawan, absensi, payroll) berhasil dibersihkan.',
    });
  });
};
