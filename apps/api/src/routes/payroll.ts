import type { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { v7 as uuidv7 } from 'uuid';
import { sql } from '../db.js';
import {
  calculateMonthlyPayroll,
  calculateAnnualReconciliation,
  generateEbupotMonthlyCsv,
  generate1721A1AnnualCsv,
  MonthlyPayrollInput,
  MonthlyPayrollResult,
  PtkpStatus,
} from '@catatgaji/shared';

function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return nik || '';
  return nik.slice(0, 4) + '*'.repeat(nik.length - 8) + nik.slice(-4);
}

export const payrollRoutes: FastifyPluginAsync = async (app) => {
  // Require JWT authentication
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        success: false,
        error_code: 'UNAUTHORIZED',
        message: 'Token tidak valid atau kadaluarsa.',
      });
    }
  });

  /**
   * 1. GET /api/v1/payroll/periods — List payroll periods
   */
  app.get('/periods', async (request) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;

    const periods = await sql`
      SELECT p.*, u.full_name as approved_by_name
      FROM payroll_periods p
      LEFT JOIN users u ON p.approved_by = u.id
      WHERE p.tenant_id = ${tenantId}
      ORDER BY p.period_year DESC, p.period_month DESC
    `;

    return {
      success: true,
      data: periods,
    };
  });

  /**
   * 2. POST /api/v1/payroll/periods — Create a new period (Draft)
   */
  app.post('/periods', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const userId = user.user_id || user.id;
    const { period_month, period_year, start_date, end_date, payout_date } = request.body as any;

    if (!period_month || period_month < 1 || period_month > 12) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_FAILED',
        message: 'Bulan periode tidak valid (1-12)',
      });
    }
    if (!period_year || period_year < 2020) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_FAILED',
        message: 'Tahun periode tidak valid',
      });
    }

    const startDate = start_date || `${period_year}-${String(period_month).padStart(2, '0')}-01`;
    const lastDay = new Date(period_year, period_month, 0).getDate();
    const endDate = end_date || `${period_year}-${String(period_month).padStart(2, '0')}-${lastDay}`;
    const payoutDate = payout_date || `${period_year}-${String(period_month).padStart(2, '0')}-25`;

    const [existing] = await sql`
      SELECT id FROM payroll_periods
      WHERE tenant_id = ${tenantId} AND period_year = ${period_year} AND period_month = ${period_month}
    `;
    if (existing) {
      return reply.code(409).send({
        success: false,
        error_code: 'PERIOD_EXISTS',
        message: 'Periode penggajian untuk bulan dan tahun tersebut sudah ada.',
      });
    }

    const periodId = uuidv7();
    const [period] = await sql`
      INSERT INTO payroll_periods (
        id, tenant_id, period_month, period_year, start_date, end_date, payout_date, status, created_by, created_at, updated_at
      ) VALUES (
        ${periodId}, ${tenantId}, ${period_month}, ${period_year}, ${startDate}, ${endDate}, ${payoutDate}, 'DRAFT', ${userId}, NOW(), NOW()
      )
      RETURNING *
    `;

    return reply.code(201).send({
      success: true,
      message: 'Periode penggajian berhasil dibuat.',
      data: period,
    });
  });

  /**
   * 3. POST /api/v1/payroll/periods/:id/run-calculation — Execute payroll engine batch run
   */
  app.post('/periods/:id/run-calculation', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id: periodId } = request.params as any;

    const [period] = await sql`
      SELECT * FROM payroll_periods WHERE id = ${periodId} AND tenant_id = ${tenantId}
    `;
    if (!period) {
      return reply.code(404).send({
        success: false,
        error_code: 'NOT_FOUND',
        message: 'Periode penggajian tidak ditemukan.',
      });
    }
    if (period.status !== 'DRAFT') {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_STATUS',
        message: `Tidak dapat menjalankan kalkulasi pada periode berstatus ${period.status}`,
      });
    }

    const employees = await sql`
      SELECT e.*, s.basic_salary, s.fixed_allowances_json, s.non_fixed_allowances_json, s.jkk_risk_grade
      FROM employees e
      LEFT JOIN employee_salaries s ON s.employee_id = e.id AND s.is_current = true
      WHERE e.tenant_id = ${tenantId} AND e.status = 'ACTIVE' AND e.deleted_at IS NULL
    `;

    if (employees.length === 0) {
      return reply.code(400).send({
        success: false,
        error_code: 'NO_EMPLOYEES',
        message: 'Tidak ada karyawan aktif untuk diproses.',
      });
    }

    // Clear previous results in this period
    await sql`DELETE FROM employee_payroll_results WHERE payroll_period_id = ${periodId}`;

    let totalGross = 0;
    let totalPph21 = 0;
    let totalBpjsEmployer = 0;
    let totalBpjsEmployee = 0;
    let totalThp = 0;
    let totalEmployerCost = 0;

    for (const emp of employees) {
      const rawFixed = typeof emp.fixed_allowances_json === 'string' ? JSON.parse(emp.fixed_allowances_json) : (emp.fixed_allowances_json || []);
      const rawNonFixed = typeof emp.non_fixed_allowances_json === 'string' ? JSON.parse(emp.non_fixed_allowances_json) : (emp.non_fixed_allowances_json || []);

      const input: MonthlyPayrollInput = {
        basicSalary: Number(emp.basic_salary) || 0,
        fixedAllowances: rawFixed,
        nonFixedAllowances: rawNonFixed,
        overtimePay: 0,
        thrAmount: 0,
        pkwtCompensation: 0,
        bonusAmount: 0,
        ptkpStatus: (emp.ptkp_status || 'TK/0') as PtkpStatus,
        hasNpwp: !!emp.npwp,
        bpjsConfig: { jkkRiskGrade: emp.jkk_risk_grade || 1 },
      };

      let calc: MonthlyPayrollResult = calculateMonthlyPayroll(input);

      // December / Final Period Annual Tax Reconciliation
      if (period.period_month === 12) {
        const prevResults = await sql`
          SELECT r.*
          FROM employee_payroll_results r
          JOIN payroll_periods p ON r.payroll_period_id = p.id
          WHERE r.tenant_id = ${tenantId}
            AND r.employee_id = ${emp.id}
            AND p.period_year = ${period.period_year}
            AND p.period_month < 12
        `;

        const prevGross = prevResults.reduce((sum, r) => sum + Number(r.gross_taxable_income), 0);
        const prevWithheld = prevResults.reduce((sum, r) => sum + Number(r.pph21_amount), 0);
        const prevJht = prevResults.reduce((sum, r) => sum + Number(r.jht_employee), 0);
        const prevJp = prevResults.reduce((sum, r) => sum + Number(r.jp_employee), 0);

        const recon = calculateAnnualReconciliation({
          ptkpStatus: (emp.ptkp_status || 'TK/0') as PtkpStatus,
          annualGrossTaxable: prevGross + calc.gross_taxable_income,
          annualEmployeeJht: prevJht + calc.bpjs.jht_employee,
          annualEmployeeJp: prevJp + calc.bpjs.jp_employee,
          previouslyWithheldPph21: prevWithheld,
          workingMonths: 12,
          hasNpwp: !!emp.npwp,
        });

        calc = {
          ...calc,
          pph21_amount: recon.pph21_december_payable,
          total_deductions: calc.total_bpjs_employee + recon.pph21_december_payable + calc.loan_deduction + calc.absence_deduction,
          thp: calc.gross_earnings - (calc.total_bpjs_employee + recon.pph21_december_payable + calc.loan_deduction + calc.absence_deduction),
        };
      }

      const resultId = uuidv7();

      await sql`
        INSERT INTO employee_payroll_results (
          id, tenant_id, payroll_period_id, employee_id,
          employee_name, nik_masked, ptkp_status, ter_category, ter_layer, bank_name, bank_account_no,
          basic_salary, fixed_allowances, non_fixed_allowances, overtime_pay, thr_amount, pkwt_compensation, bonus_amount, gross_earnings,
          bpjs_taxable_premiums, gross_taxable_income, effective_ter_rate, pph21_amount,
          jkk_employer, jkm_employer, jht_employer, jp_employer, kes_employer, total_bpjs_employer,
          jht_employee, jp_employee, kes_employee, total_bpjs_employee,
          loan_deduction, absence_deduction, total_deductions,
          thp, total_employer_cost, is_locked, created_at, updated_at
        ) VALUES (
          ${resultId}, ${tenantId}, ${periodId}, ${emp.id},
          ${emp.full_name}, ${maskNik(emp.nik_ktp)}, ${emp.ptkp_status}, ${calc.ter_category}, ${calc.ter_layer}, ${emp.bank_name || null}, ${emp.bank_account_no || null},
          ${calc.basic_salary}, ${JSON.stringify(rawFixed)}::jsonb, ${JSON.stringify(rawNonFixed)}::jsonb, ${calc.overtime_pay}, ${calc.thr_amount}, ${calc.pkwt_compensation}, ${calc.bonus_amount}, ${calc.gross_earnings},
          ${calc.bpjs.taxable_premiums}, ${calc.gross_taxable_income}, ${calc.effective_ter_rate}, ${calc.pph21_amount},
          ${calc.bpjs.jkk_employer}, ${calc.bpjs.jkm_employer}, ${calc.bpjs.jht_employer}, ${calc.bpjs.jp_employer}, ${calc.bpjs.kes_employer}, ${calc.bpjs.total_employer},
          ${calc.bpjs.jht_employee}, ${calc.bpjs.jp_employee}, ${calc.bpjs.kes_employee}, ${calc.bpjs.total_employee},
          ${calc.loan_deduction}, ${calc.absence_deduction}, ${calc.total_deductions},
          ${calc.thp}, ${calc.total_employer_cost}, false, NOW(), NOW()
        )
      `;

      totalGross += calc.gross_earnings;
      totalPph21 += calc.pph21_amount;
      totalBpjsEmployer += calc.bpjs.total_employer;
      totalBpjsEmployee += calc.bpjs.total_employee;
      totalThp += calc.thp;
      totalEmployerCost += calc.total_employer_cost;
    }

    const [updated] = await sql`
      UPDATE payroll_periods
      SET total_gross = ${totalGross},
          total_pph21 = ${totalPph21},
          total_bpjs_employer = ${totalBpjsEmployer},
          total_bpjs_employee = ${totalBpjsEmployee},
          total_thp = ${totalThp},
          total_employer_cost = ${totalEmployerCost},
          employee_count = ${employees.length},
          updated_at = NOW()
      WHERE id = ${periodId}
      RETURNING *
    `;

    return {
      success: true,
      message: 'Kalkulasi penggajian berhasil dijalankan.',
      data: updated,
    };
  });

  /**
   * 4. GET /api/v1/payroll/periods/:id/results — Get employee results for period
   */
  app.get('/periods/:id/results', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id: periodId } = request.params as any;

    const [period] = await sql`
      SELECT * FROM payroll_periods WHERE id = ${periodId} AND tenant_id = ${tenantId}
    `;
    if (!period) {
      return reply.code(404).send({
        success: false,
        error_code: 'NOT_FOUND',
        message: 'Periode tidak ditemukan.',
      });
    }

    const items = await sql`
      SELECT r.*, b.name as branch_name, e.gender, e.join_date, e.employment_status
      FROM employee_payroll_results r
      JOIN employees e ON r.employee_id = e.id
      LEFT JOIN branches_departments b ON e.branch_id = b.id
      WHERE r.payroll_period_id = ${periodId}
      ORDER BY r.employee_name ASC
    `;

    return {
      success: true,
      data: {
        period,
        items,
      },
    };
  });

  /**
   * 5. PUT /api/v1/payroll/periods/:id/items/:itemId — Adjust variable items in Draft
   */
  app.put('/periods/:id/items/:itemId', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id: periodId, itemId } = request.params as any;
    const body = request.body as any;

    const [period] = await sql`
      SELECT status FROM payroll_periods WHERE id = ${periodId} AND tenant_id = ${tenantId}
    `;
    if (!period || period.status !== 'DRAFT') {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_STATUS',
        message: 'Hanya dapat mengedit komponen pada periode berstatus DRAFT.',
      });
    }

    const [current] = await sql`
      SELECT r.*, e.npwp, s.jkk_risk_grade
      FROM employee_payroll_results r
      JOIN employees e ON r.employee_id = e.id
      LEFT JOIN employee_salaries s ON s.employee_id = e.id AND s.is_current = true
      WHERE r.id = ${itemId} AND r.payroll_period_id = ${periodId}
    `;
    if (!current) {
      return reply.code(404).send({
        success: false,
        error_code: 'NOT_FOUND',
        message: 'Item slip gaji tidak ditemukan.',
      });
    }

    const fixedAllowances = typeof current.fixed_allowances === 'string' ? JSON.parse(current.fixed_allowances) : current.fixed_allowances;
    const nonFixedAllowances = typeof current.non_fixed_allowances === 'string' ? JSON.parse(current.non_fixed_allowances) : current.non_fixed_allowances;

    const input: MonthlyPayrollInput = {
      basicSalary: Number(current.basic_salary),
      fixedAllowances,
      nonFixedAllowances,
      overtimePay: body.overtime_pay !== undefined ? Number(body.overtime_pay) : Number(current.overtime_pay),
      thrAmount: body.thr_amount !== undefined ? Number(body.thr_amount) : Number(current.thr_amount),
      pkwtCompensation: Number(current.pkwt_compensation),
      bonusAmount: body.bonus_amount !== undefined ? Number(body.bonus_amount) : Number(current.bonus_amount),
      ptkpStatus: current.ptkp_status as PtkpStatus,
      hasNpwp: !!current.npwp,
      bpjsConfig: { jkkRiskGrade: current.jkk_risk_grade || 1 },
      loanDeduction: body.loan_deduction !== undefined ? Number(body.loan_deduction) : Number(current.loan_deduction),
      absenceDeduction: body.absence_deduction !== undefined ? Number(body.absence_deduction) : Number(current.absence_deduction),
    };

    const calc = calculateMonthlyPayroll(input);

    const [res] = await sql`
      UPDATE employee_payroll_results
      SET overtime_pay = ${calc.overtime_pay},
          bonus_amount = ${calc.bonus_amount},
          thr_amount = ${calc.thr_amount},
          loan_deduction = ${calc.loan_deduction},
          absence_deduction = ${calc.absence_deduction},
          gross_earnings = ${calc.gross_earnings},
          bpjs_taxable_premiums = ${calc.bpjs.taxable_premiums},
          gross_taxable_income = ${calc.gross_taxable_income},
          effective_ter_rate = ${calc.effective_ter_rate},
          pph21_amount = ${calc.pph21_amount},
          total_deductions = ${calc.total_deductions},
          thp = ${calc.thp},
          total_employer_cost = ${calc.total_employer_cost},
          updated_at = NOW()
      WHERE id = ${itemId}
      RETURNING *
    `;

    // Re-aggregate period totals
    await sql`
      UPDATE payroll_periods
      SET total_gross = (SELECT COALESCE(SUM(gross_earnings), 0) FROM employee_payroll_results WHERE payroll_period_id = ${periodId}),
          total_pph21 = (SELECT COALESCE(SUM(pph21_amount), 0) FROM employee_payroll_results WHERE payroll_period_id = ${periodId}),
          total_bpjs_employer = (SELECT COALESCE(SUM(total_bpjs_employer), 0) FROM employee_payroll_results WHERE payroll_period_id = ${periodId}),
          total_bpjs_employee = (SELECT COALESCE(SUM(total_bpjs_employee), 0) FROM employee_payroll_results WHERE payroll_period_id = ${periodId}),
          total_thp = (SELECT COALESCE(SUM(thp), 0) FROM employee_payroll_results WHERE payroll_period_id = ${periodId}),
          total_employer_cost = (SELECT COALESCE(SUM(total_employer_cost), 0) FROM employee_payroll_results WHERE payroll_period_id = ${periodId}),
          updated_at = NOW()
      WHERE id = ${periodId}
    `;

    return {
      success: true,
      message: 'Item penggajian berhasil diperbarui.',
      data: res,
    };
  });

  /**
   * 6. POST /api/v1/payroll/periods/:id/submit — Transition DRAFT -> SUBMITTED
   */
  app.post('/periods/:id/submit', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const userId = user.user_id || user.id;
    const { id: periodId } = request.params as any;

    const [period] = await sql`
      SELECT * FROM payroll_periods WHERE id = ${periodId} AND tenant_id = ${tenantId}
    `;
    if (!period || period.status !== 'DRAFT') {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_STATUS',
        message: 'Hanya periode berstatus DRAFT yang dapat disubmit.',
      });
    }

    const [updated] = await sql`
      UPDATE payroll_periods
      SET status = 'SUBMITTED', updated_at = NOW()
      WHERE id = ${periodId}
      RETURNING *
    `;

    const logId = uuidv7();
    await sql`
      INSERT INTO payroll_approval_logs (id, tenant_id, payroll_period_id, user_id, action, note, created_at)
      VALUES (${logId}, ${tenantId}, ${periodId}, ${userId}, 'SUBMIT', 'Payroll submitted for Owner approval', NOW())
    `;

    return {
      success: true,
      message: 'Periode gaji berhasil disubmit.',
      data: updated,
    };
  });

  /**
   * 7. POST /api/v1/payroll/periods/:id/approve — Owner PIN Verification & Immutable Lock
   */
  app.post('/periods/:id/approve', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const userId = user.user_id || user.id;
    const { id: periodId } = request.params as any;
    const { pin } = request.body as any;

    if (!pin || pin.length !== 6) {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_PIN',
        message: 'PIN 6-digit harus diisi.',
      });
    }

    const [currentUser] = await sql`
      SELECT u.*, r.role_name
      FROM users u
      LEFT JOIN roles_permissions r ON u.role_id = r.id
      WHERE u.id = ${userId}
    `;
    if (!currentUser) {
      return reply.code(404).send({
        success: false,
        error_code: 'USER_NOT_FOUND',
        message: 'User tidak ditemukan.',
      });
    }

    if (currentUser.role_name !== 'OWNER' && currentUser.role_name !== 'SUPERADMIN') {
      return reply.code(403).send({
        success: false,
        error_code: 'FORBIDDEN',
        message: 'Hanya Owner yang memiliki wewenang menyetujui penggajian.',
      });
    }

    if (!currentUser.pin_hash) {
      return reply.code(400).send({
        success: false,
        error_code: 'PIN_NOT_SET',
        message: 'PIN belum diatur untuk akun ini. Silakan atur PIN di profil.',
      });
    }

    const isPinValid = await bcrypt.compare(pin, currentUser.pin_hash);
    if (!isPinValid) {
      return reply.code(400).send({
        success: false,
        error_code: 'WRONG_PIN',
        message: 'PIN persetujuan salah.',
      });
    }

    const [period] = await sql`
      SELECT status FROM payroll_periods WHERE id = ${periodId} AND tenant_id = ${tenantId}
    `;
    if (!period || period.status !== 'SUBMITTED') {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_STATUS',
        message: 'Hanya periode berstatus SUBMITTED yang dapat disetujui.',
      });
    }

    // Lock all calculation result rows
    await sql`
      UPDATE employee_payroll_results
      SET is_locked = true, updated_at = NOW()
      WHERE payroll_period_id = ${periodId}
    `;

    // Approve period
    const [res] = await sql`
      UPDATE payroll_periods
      SET status = 'APPROVED', approved_by = ${userId}, approved_at = NOW(), updated_at = NOW()
      WHERE id = ${periodId}
      RETURNING *
    `;

    const logId = uuidv7();
    await sql`
      INSERT INTO payroll_approval_logs (id, tenant_id, payroll_period_id, user_id, action, note, created_at)
      VALUES (${logId}, ${tenantId}, ${periodId}, ${userId}, 'APPROVE', 'Payroll approved with verified 6-digit Owner PIN', NOW())
    `;

    return {
      success: true,
      message: 'Penggajian berhasil disetujui dan dikunci (Immutable).',
      data: res,
    };
  });

  /**
   * 8. GET /api/v1/payroll/results/:resultId/slip — Payslip details payload
   */
  app.get('/results/:resultId/slip', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { resultId } = request.params as any;

    const [slip] = await sql`
      SELECT r.*, p.period_month, p.period_year, p.payout_date, p.status as period_status,
             t.name as company_name,
             e.gender, e.join_date, e.employment_status, b.name as branch_name,
             u.full_name as approved_by_name
      FROM employee_payroll_results r
      JOIN payroll_periods p ON r.payroll_period_id = p.id
      JOIN tenants t ON r.tenant_id = t.id
      JOIN employees e ON r.employee_id = e.id
      LEFT JOIN branches_departments b ON e.branch_id = b.id
      LEFT JOIN users u ON p.approved_by = u.id
      WHERE r.id = ${resultId} AND r.tenant_id = ${tenantId}
    `;

    if (!slip) {
      return reply.code(404).send({
        success: false,
        error_code: 'NOT_FOUND',
        message: 'Slip gaji tidak ditemukan.',
      });
    }

    return {
      success: true,
      data: slip,
    };
  });

  /**
   * 9. GET /api/v1/payroll/tax-reports/annual/:year — Annual Tax Reconciliation & Form 1721-A1
   */
  app.get('/tax-reports/annual/:year', async (request) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { year } = request.params as any;
    const reportYear = parseInt(year, 10) || new Date().getFullYear();

    const employees = await sql`
      SELECT e.id, e.full_name, e.nik_ktp, e.npwp, e.ptkp_status, b.name as branch_name
      FROM employees e
      LEFT JOIN branches_departments b ON e.branch_id = b.id
      WHERE e.tenant_id = ${tenantId} AND e.deleted_at IS NULL
      ORDER BY e.full_name ASC
    `;

    const forms1721A1 = [];
    let totalAnnualGrossAll = 0;
    let totalAnnualPph21All = 0;

    for (const emp of employees) {
      const results = await sql`
        SELECT r.*
        FROM employee_payroll_results r
        JOIN payroll_periods p ON r.payroll_period_id = p.id
        WHERE r.tenant_id = ${tenantId}
          AND r.employee_id = ${emp.id}
          AND p.period_year = ${reportYear}
        ORDER BY p.period_month ASC
      `;

      if (results.length === 0) continue;

      const annualGross = results.reduce((sum, r) => sum + Number(r.gross_taxable_income), 0);
      const annualJht = results.reduce((sum, r) => sum + Number(r.jht_employee), 0);
      const annualJp = results.reduce((sum, r) => sum + Number(r.jp_employee), 0);
      const annualPph21 = results.reduce((sum, r) => sum + Number(r.pph21_amount), 0);

      const recon = calculateAnnualReconciliation({
        ptkpStatus: (emp.ptkp_status || 'TK/0') as PtkpStatus,
        annualGrossTaxable: annualGross,
        annualEmployeeJht: annualJht,
        annualEmployeeJp: annualJp,
        previouslyWithheldPph21: annualPph21,
        workingMonths: results.length,
        hasNpwp: !!emp.npwp,
      });

      totalAnnualGrossAll += annualGross;
      totalAnnualPph21All += recon.total_pph21_annual;

      forms1721A1.push({
        employee_id: emp.id,
        employee_name: emp.full_name,
        nik_masked: maskNik(emp.nik_ktp),
        npwp: emp.npwp || 'Tidak Memiliki NPWP',
        ptkp_status: emp.ptkp_status,
        branch_name: emp.branch_name,
        months_count: results.length,
        annual_gross_taxable: annualGross,
        biaya_jabatan: recon.biaya_jabatan,
        annual_jht_employee: annualJht,
        annual_jp_employee: annualJp,
        annual_net_income: recon.annual_net_income,
        ptkp_amount: recon.ptkp_amount,
        pkp_rounded: recon.pkp_rounded,
        total_pph21_annual: recon.total_pph21_annual,
        pph21_withheld: annualPph21,
      });
    }

    return {
      success: true,
      data: {
        year: reportYear,
        total_employees: forms1721A1.length,
        total_annual_gross: totalAnnualGrossAll,
        total_annual_pph21: totalAnnualPph21All,
        forms_1721_a1: forms1721A1,
      },
    };
  });

  /**
   * 10. GET /api/v1/payroll/tax-reports/ebupot-monthly-csv/:periodId
   * Unduh file CSV resmi e-Bupot 21/26 DJP Online untuk masa pajak bulanan
   */
  app.get('/tax-reports/ebupot-monthly-csv/:periodId', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { periodId } = request.params as any;

    const [tenant] = await sql`
      SELECT * FROM tenants WHERE id = ${tenantId}
    `;
    const [period] = await sql`
      SELECT * FROM payroll_periods WHERE id = ${periodId} AND tenant_id = ${tenantId}
    `;
    if (!period) {
      return reply.code(404).send({
        success: false,
        error_code: 'NOT_FOUND',
        message: 'Periode penggajian tidak ditemukan.',
      });
    }

    const items = await sql`
      SELECT 
        r.*,
        e.full_name as employee_name,
        e.nik_ktp,
        e.npwp,
        e.ptkp_status,
        e.pph21_ter_category
      FROM employee_payroll_results r
      JOIN employees e ON e.id = r.employee_id
      WHERE r.payroll_period_id = ${periodId} AND r.tenant_id = ${tenantId}
    `;

    const csvContent = generateEbupotMonthlyCsv({
      tax_year: period.period_year,
      tax_month: period.period_month,
      pembetulan: 0,
      company_npwp: tenant?.npwp_badan || '0000000000000000',
      company_name: tenant?.name || 'PT CatatGaji Organisasi',
      signatory_nik_npwp: tenant?.tax_signatory_nik || tenant?.tax_signatory_npwp || '0000000000000000',
      signatory_name: tenant?.tax_signatory_name || 'Direktur Utama',
      payout_date: period.payout_date,
      items: items.map((i: any) => ({
        nik_ktp: i.nik_ktp,
        npwp: i.npwp,
        employee_name: i.employee_name,
        gross_taxable: Number(i.gross_taxable_income),
        pph21_amount: Number(i.pph21_amount),
        ptkp_status: i.ptkp_status,
        ter_category: i.pph21_ter_category,
        ter_rate_percent: Number(i.pph21_ter_rate) * 100,
      })),
    });

    const fileName = `eBupot_2126_${period.period_year}_Masa${String(period.period_month).padStart(2, '0')}.csv`;

    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${fileName}"`)
      .send(csvContent);
  });

  /**
   * 11. GET /api/v1/payroll/tax-reports/annual-1721a1-csv/:year
   * Unduh file CSV Bukti Potong Formulir 1721-A1 Tahunan DJP Online
   */
  app.get('/tax-reports/annual-1721a1-csv/:year', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { year } = request.params as any;
    const reportYear = parseInt(year, 10);

    const [tenant] = await sql`
      SELECT * FROM tenants WHERE id = ${tenantId}
    `;

    const employees = await sql`
      SELECT id, nik_ktp, npwp, full_name, ptkp_status
      FROM employees
      WHERE tenant_id = ${tenantId} AND deleted_at IS NULL
    `;

    const items: any[] = [];

    for (const emp of employees) {
      const results = await sql`
        SELECT r.*
        FROM employee_payroll_results r
        JOIN payroll_periods p ON p.id = r.payroll_period_id
        WHERE r.tenant_id = ${tenantId}
          AND r.employee_id = ${emp.id}
          AND p.period_year = ${reportYear}
        ORDER BY p.period_month ASC
      `;
      if (results.length === 0) continue;

      const annualGross = results.reduce((sum, r) => sum + Number(r.gross_taxable_income), 0);
      const annualJht = results.reduce((sum, r) => sum + Number(r.jht_employee), 0);
      const annualJp = results.reduce((sum, r) => sum + Number(r.jp_employee), 0);
      const annualPph21 = results.reduce((sum, r) => sum + Number(r.pph21_amount), 0);

      const recon = calculateAnnualReconciliation({
        ptkpStatus: (emp.ptkp_status || 'TK/0') as PtkpStatus,
        annualGrossTaxable: annualGross,
        annualEmployeeJht: annualJht,
        annualEmployeeJp: annualJp,
        previouslyWithheldPph21: annualPph21,
        workingMonths: results.length,
        hasNpwp: !!emp.npwp,
      });

      items.push({
        employee_name: emp.full_name,
        nik_ktp: emp.nik_ktp,
        npwp: emp.npwp,
        ptkp_status: emp.ptkp_status,
        months_count: results.length,
        annual_gross_taxable: annualGross,
        biaya_jabatan: recon.biaya_jabatan,
        annual_jht_jp_employee: annualJht + annualJp,
        annual_net_income: recon.annual_net_income,
        ptkp_amount: recon.ptkp_amount,
        pkp_rounded: recon.pkp_rounded,
        total_pph21_annual: recon.total_pph21_annual,
        pph21_withheld: annualPph21,
        pph21_difference: recon.total_pph21_annual - annualPph21,
      });
    }

    const csvContent = generate1721A1AnnualCsv({
      tax_year: reportYear,
      company_npwp: tenant?.npwp_badan || '0000000000000000',
      company_name: tenant?.name || 'PT CatatGaji Organisasi',
      signatory_nik_npwp: tenant?.tax_signatory_nik || tenant?.tax_signatory_npwp || '0000000000000000',
      signatory_name: tenant?.tax_signatory_name || 'Direktur Utama',
      items,
    });

    const fileName = `Formulir_1721A1_${reportYear}_Massal.csv`;

    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${fileName}"`)
      .send(csvContent);
  });
};
