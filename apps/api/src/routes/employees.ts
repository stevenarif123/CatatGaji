import type { FastifyPluginAsync } from 'fastify';
import { v7 as uuidv7 } from 'uuid';
import { sql } from '../db.js';
import {
  PTKP_TO_TER,
  PtkpStatus,
  validateNik,
  validateNpwp,
  validateBpjsTk,
  validateBpjsKes,
  validateEmail,
} from '@catatgaji/shared';

function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return nik;
  return nik.slice(0, 4) + '*'.repeat(nik.length - 8) + nik.slice(-4);
}

export const employeeRoutes: FastifyPluginAsync = async (app) => {
  // Require JWT authentication for all employee routes
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
   * GET /api/v1/employees
   * List all employees with pagination, search, branch and status filters
   */
  app.get('/', async (request) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const query = request.query as any;

    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const offset = (page - 1) * limit;
    const search = query.search ? `%${query.search.trim().toLowerCase()}%` : null;
    const status = query.status || 'ACTIVE';
    const branchId = query.branch_id || null;

    let employeesQuery;
    let countQuery;

    if (search) {
      employeesQuery = await sql`
        SELECT 
          e.id, e.nik_ktp, e.npwp, e.full_name, e.email, e.phone, e.gender,
          e.employment_status, e.ptkp_status, e.pph21_ter_category,
          e.join_date, e.resign_date, e.status, e.bank_name, e.bank_account_no,
          b.name AS branch_name,
          s.basic_salary, s.effective_date AS salary_effective_date
        FROM employees e
        LEFT JOIN branches_departments b ON b.id = e.branch_id
        LEFT JOIN employee_salaries s ON s.employee_id = e.id AND s.is_current = TRUE AND s.deleted_at IS NULL
        WHERE e.tenant_id = ${tenantId}
          AND e.deleted_at IS NULL
          AND (${status === 'ALL'} OR e.status = ${status})
          AND (${branchId === null} OR e.branch_id = ${branchId})
          AND (
            LOWER(e.full_name) LIKE ${search}
            OR LOWER(e.email) LIKE ${search}
            OR e.nik_ktp LIKE ${search}
          )
        ORDER BY e.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      countQuery = await sql`
        SELECT COUNT(*)::int AS total
        FROM employees e
        WHERE e.tenant_id = ${tenantId}
          AND e.deleted_at IS NULL
          AND (${status === 'ALL'} OR e.status = ${status})
          AND (${branchId === null} OR e.branch_id = ${branchId})
          AND (
            LOWER(e.full_name) LIKE ${search}
            OR LOWER(e.email) LIKE ${search}
            OR e.nik_ktp LIKE ${search}
          )
      `;
    } else {
      employeesQuery = await sql`
        SELECT 
          e.id, e.nik_ktp, e.npwp, e.full_name, e.email, e.phone, e.gender,
          e.employment_status, e.ptkp_status, e.pph21_ter_category,
          e.join_date, e.resign_date, e.status, e.bank_name, e.bank_account_no,
          b.name AS branch_name,
          s.basic_salary, s.effective_date AS salary_effective_date
        FROM employees e
        LEFT JOIN branches_departments b ON b.id = e.branch_id
        LEFT JOIN employee_salaries s ON s.employee_id = e.id AND s.is_current = TRUE AND s.deleted_at IS NULL
        WHERE e.tenant_id = ${tenantId}
          AND e.deleted_at IS NULL
          AND (${status === 'ALL'} OR e.status = ${status})
          AND (${branchId === null} OR e.branch_id = ${branchId})
        ORDER BY e.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      countQuery = await sql`
        SELECT COUNT(*)::int AS total
        FROM employees e
        WHERE e.tenant_id = ${tenantId}
          AND e.deleted_at IS NULL
          AND (${status === 'ALL'} OR e.status = ${status})
          AND (${branchId === null} OR e.branch_id = ${branchId})
      `;
    }

    const totalRecords = countQuery[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    const data = employeesQuery.map((emp: any) => ({
      ...emp,
      nik_ktp_masked: maskNik(emp.nik_ktp),
    }));

    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total_records: totalRecords,
        total_pages: totalPages,
      },
    };
  });

  /**
   * POST /api/v1/employees
   * Register a new employee with initial salary structure
   */
  app.post('/', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const body = request.body as any;

    const {
      nik_ktp,
      npwp,
      bpjs_kes_no,
      bpjs_tk_no,
      full_name,
      email,
      phone,
      gender,
      birth_date,
      branch_id,
      department_id,
      join_date,
      resign_date,
      employment_status,
      ptkp_status,
      salary_type,
      bank_name,
      bank_account_no,
      bank_account_holder,
      basic_salary,
      fixed_allowances,
      non_fixed_allowances,
      jkk_risk_grade,
      pph21_scheme,
    } = body;

    // 1. Mandatory Validations
    if (!nik_ktp || !full_name || !email || !join_date || basic_salary === undefined) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_FAILED',
        message: 'Field wajib (NIK, Nama, Email, Tgl Masuk, Gaji Pokok) harus diisi.',
      });
    }

    const nikCheck = validateNik(nik_ktp);
    if (!nikCheck.valid) {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_NIK',
        message: nikCheck.error,
      });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_EMAIL',
        message: emailCheck.error,
      });
    }

    if (npwp) {
      const npwpCheck = validateNpwp(npwp);
      if (!npwpCheck.valid) {
        return reply.code(400).send({
          success: false,
          error_code: 'INVALID_NPWP',
          message: npwpCheck.error,
        });
      }
    }

    if (bpjs_tk_no) {
      const bpjsTkCheck = validateBpjsTk(bpjs_tk_no);
      if (!bpjsTkCheck.valid) {
        return reply.code(400).send({
          success: false,
          error_code: 'INVALID_BPJS_TK',
          message: bpjsTkCheck.error,
        });
      }
    }

    if (bpjs_kes_no) {
      const bpjsKesCheck = validateBpjsKes(bpjs_kes_no);
      if (!bpjsKesCheck.valid) {
        return reply.code(400).send({
          success: false,
          error_code: 'INVALID_BPJS_KES',
          message: bpjsKesCheck.error,
        });
      }
    }

    // 2. Uniqueness Check within Tenant
    const existingNik = await sql`
      SELECT id FROM employees 
      WHERE tenant_id = ${tenantId} AND nik_ktp = ${nik_ktp} AND deleted_at IS NULL
    `;
    if (existingNik.length > 0) {
      return reply.code(409).send({
        success: false,
        error_code: 'DUPLICATE_NIK',
        message: `NIK ${nik_ktp} sudah terdaftar dalam sistem perusahaan.`,
      });
    }

    const existingEmail = await sql`
      SELECT id FROM employees 
      WHERE tenant_id = ${tenantId} AND email = ${email} AND deleted_at IS NULL
    `;
    if (existingEmail.length > 0) {
      return reply.code(409).send({
        success: false,
        error_code: 'DUPLICATE_EMAIL',
        message: `Email ${email} sudah terdaftar.`,
      });
    }

    // 3. Auto-determine TER Category from PTKP Status (PMK 168/2023)
    const validPtkp = (ptkp_status || 'TK/0') as PtkpStatus;
    const terCategory = PTKP_TO_TER[validPtkp] || 'A';

    const employeeId = uuidv7();
    const salaryId = uuidv7();

    await sql.begin(async (tx) => {
      // Insert employee record
      await tx`
        INSERT INTO employees (
          id, tenant_id, nik_ktp, npwp, bpjs_kes_no, bpjs_tk_no,
          full_name, email, phone, gender, birth_date,
          branch_id, department_id, join_date, resign_date,
          employment_status, ptkp_status, pph21_ter_category,
          salary_type, bank_name, bank_account_no, bank_account_holder,
          status, version, created_at, updated_at
        ) VALUES (
          ${employeeId}, ${tenantId}, ${nik_ktp}, ${npwp || null}, ${bpjs_kes_no || null}, ${bpjs_tk_no || null},
          ${full_name}, ${email}, ${phone || null}, ${gender || 'MALE'}, ${birth_date || null},
          ${branch_id || null}, ${department_id || null}, ${join_date}, ${resign_date || null},
          ${employment_status || 'PKWTT'}, ${validPtkp}, ${terCategory},
          ${salary_type || 'MONTHLY'}, ${bank_name || 'BCA'}, ${bank_account_no || '-'}, ${bank_account_holder || full_name},
          'ACTIVE', 1, NOW(), NOW()
        )
      `;

      // Insert active salary record
      await tx`
        INSERT INTO employee_salaries (
          id, tenant_id, employee_id, basic_salary,
          fixed_allowances_json, non_fixed_allowances_json,
          jkk_risk_grade, bpjs_kes_override, pph21_scheme,
          effective_date, is_current, version, created_at, updated_at
        ) VALUES (
          ${salaryId}, ${tenantId}, ${employeeId}, ${basic_salary},
          ${JSON.stringify(fixed_allowances || [])}::jsonb,
          ${JSON.stringify(non_fixed_allowances || [])}::jsonb,
          ${jkk_risk_grade || 2}, false, ${pph21_scheme || 'GROSS'},
          ${join_date}, TRUE, 1, NOW(), NOW()
        )
      `;
    });

    return reply.code(201).send({
      success: true,
      message: 'Data karyawan dan konfigurasi gaji berhasil disimpan.',
      data: {
        id: employeeId,
        full_name,
        nik_ktp_masked: maskNik(nik_ktp),
        ptkp_status: validPtkp,
        pph21_ter_category: terCategory,
        basic_salary,
      },
    });
  });

  /**
   * GET /api/v1/employees/:id
   * Get employee details with active salary and compensation calculator
   */
  app.get('/:id', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id } = request.params as any;

    const rows = await sql`
      SELECT 
        e.*,
        b.name AS branch_name,
        s.id AS salary_id,
        s.basic_salary,
        s.fixed_allowances_json,
        s.non_fixed_allowances_json,
        s.jkk_risk_grade,
        s.pph21_scheme,
        s.effective_date AS salary_effective_date
      FROM employees e
      LEFT JOIN branches_departments b ON b.id = e.branch_id
      LEFT JOIN employee_salaries s ON s.employee_id = e.id AND s.is_current = TRUE AND s.deleted_at IS NULL
      WHERE e.id = ${id} AND e.tenant_id = ${tenantId} AND e.deleted_at IS NULL
    `;

    if (rows.length === 0) {
      return reply.code(404).send({
        success: false,
        error_code: 'EMPLOYEE_NOT_FOUND',
        message: 'Karyawan tidak ditemukan.',
      });
    }

    const emp = rows[0];

    // Calculate PKWT Compensation if PKWT (PP 35/2021: (Masa Kerja / 12) * Upah Sebulan)
    let pkwtCompensation = null;
    if (emp.employment_status === 'PKWT' && emp.join_date) {
      const start = new Date(emp.join_date);
      const end = emp.resign_date ? new Date(emp.resign_date) : new Date();
      const diffMonths = Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
      const fixedTotal = (emp.fixed_allowances_json || []).reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);
      const monthlyWage = Number(emp.basic_salary || 0) + fixedTotal;
      const compensationAmount = Math.floor((diffMonths / 12) * monthlyWage);

      pkwtCompensation = {
        working_months: diffMonths,
        monthly_wage_basis: monthlyWage,
        compensation_amount: compensationAmount,
      };
    }

    return {
      success: true,
      data: {
        ...emp,
        nik_ktp_masked: maskNik(emp.nik_ktp),
        pkwt_compensation: pkwtCompensation,
      },
    };
  });

  /**
   * PUT /api/v1/employees/:id
   * Update employee profile & status
   */
  app.put('/:id', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id } = request.params as any;
    const body = request.body as any;

    const existing = await sql`
      SELECT id, version FROM employees 
      WHERE id = ${id} AND tenant_id = ${tenantId} AND deleted_at IS NULL
    `;

    if (existing.length === 0) {
      return reply.code(404).send({
        success: false,
        error_code: 'EMPLOYEE_NOT_FOUND',
        message: 'Karyawan tidak ditemukan.',
      });
    }

    const currentPtkp = (body.ptkp_status || 'TK/0') as PtkpStatus;
    const terCategory = PTKP_TO_TER[currentPtkp] || 'A';

    await sql`
      UPDATE employees SET
        full_name = COALESCE(${body.full_name}, full_name),
        phone = COALESCE(${body.phone}, phone),
        branch_id = COALESCE(${body.branch_id}, branch_id),
        department_id = COALESCE(${body.department_id}, department_id),
        employment_status = COALESCE(${body.employment_status}, employment_status),
        ptkp_status = ${currentPtkp},
        pph21_ter_category = ${terCategory},
        status = COALESCE(${body.status}, status),
        bank_name = COALESCE(${body.bank_name}, bank_name),
        bank_account_no = COALESCE(${body.bank_account_no}, bank_account_no),
        bank_account_holder = COALESCE(${body.bank_account_holder}, bank_account_holder),
        resign_date = ${body.resign_date || null},
        version = version + 1,
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `;

    return {
      success: true,
      message: 'Data profil karyawan berhasil diperbarui.',
    };
  });

  /**
   * POST /api/v1/employees/:id/salary
   * Salary Versioning: Update salary by archiving previous version and creating a new effective version
   */
  app.post('/:id/salary', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id } = request.params as any;
    const {
      basic_salary,
      fixed_allowances,
      non_fixed_allowances,
      jkk_risk_grade,
      pph21_scheme,
      effective_date,
    } = request.body as any;

    if (basic_salary === undefined || !effective_date) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_FAILED',
        message: 'Gaji pokok dan tanggal berlaku efektif wajib diisi.',
      });
    }

    const salaryId = uuidv7();

    await sql.begin(async (tx) => {
      // 1. Mark previous active salary as archived
      await tx`
        UPDATE employee_salaries SET
          is_current = FALSE,
          updated_at = NOW()
        WHERE employee_id = ${id} AND tenant_id = ${tenantId} AND is_current = TRUE
      `;

      // 2. Insert new current salary record
      await tx`
        INSERT INTO employee_salaries (
          id, tenant_id, employee_id, basic_salary,
          fixed_allowances_json, non_fixed_allowances_json,
          jkk_risk_grade, bpjs_kes_override, pph21_scheme,
          effective_date, is_current, version, created_at, updated_at
        ) VALUES (
          ${salaryId}, ${tenantId}, ${id}, ${basic_salary},
          ${JSON.stringify(fixed_allowances || [])}::jsonb,
          ${JSON.stringify(non_fixed_allowances || [])}::jsonb,
          ${jkk_risk_grade || 2}, false, ${pph21_scheme || 'GROSS'},
          ${effective_date}, TRUE, 1, NOW(), NOW()
        )
      `;
    });

    return reply.code(201).send({
      success: true,
      message: 'Penyesuaian gaji baru berhasil disimpan dengan versioning riwayat.',
      data: {
        salary_id: salaryId,
        basic_salary,
        effective_date,
      },
    });
  });

  /**
   * DELETE /api/v1/employees/:id
   * Soft delete employee record
   */
  app.delete('/:id', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { id } = request.params as any;

    const result = await sql`
      UPDATE employees SET
        deleted_at = NOW(),
        status = 'TERMINATED',
        version = version + 1,
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId} AND deleted_at IS NULL
    `;

    return {
      success: true,
      message: 'Data karyawan berhasil dihapus (soft-delete).',
    };
  });
};
