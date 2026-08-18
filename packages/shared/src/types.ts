// ============================================================
// Core Domain Types — CatatGaji
// ============================================================

export type EmploymentStatus = 'PKWTT' | 'PKWT' | 'FREELANCE' | 'INTERNSHIP';
export type SalaryType = 'MONTHLY' | 'DAILY' | 'HOURLY';
export type EmployeeStatus = 'ACTIVE' | 'RESIGNED' | 'TERMINATED' | 'ON_LEAVE';
export type PayrollStatus = 'DRAFT' | 'CALCULATING' | 'REVIEW' | 'APPROVED' | 'LOCKED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type Pph21Scheme = 'GROSS' | 'GROSS_UP' | 'NETT';
export type Gender = 'MALE' | 'FEMALE';
export type TenantTier = 'STARTER' | 'GROWTH' | 'BUSINESS';

export type JkkRiskGrade = 1 | 2 | 3 | 4 | 5;

// ── Tenant ──────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  tier: TenantTier;
  settings: TenantSettings;
  trial_ends_at: string | null;
  deleted_at: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  max_employees: number;
  overtime_calculation_enabled: boolean;
  pph21_method: 'TER_MONTHLY';
}

// ── User & Role ─────────────────────────────────────────────

export type RoleName = 'OWNER' | 'HR_ADMIN' | 'FINANCE' | 'BRANCH_MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  role: RoleName;
  is_active: boolean;
}

// ── Employee ────────────────────────────────────────────────

import type { PtkpStatus, TerCategory } from './constants';

export interface Employee {
  id: string;
  tenant_id: string;
  user_id: string | null;
  nip: string;
  full_name: string;
  nik_ktp: string;
  npwp: string | null;
  has_npwp: boolean;
  bpjs_tk_no: string | null;
  bpjs_kes_no: string | null;
  gender: Gender;
  birth_date: string;
  ptkp_status: PtkpStatus;
  pph21_ter_category: TerCategory;
  employment_status: EmploymentStatus;
  join_date: string;
  resign_date: string | null;
  branch_id: string | null;
  department_id: string | null;
  direct_supervisor_id: string | null;
  bank_name: string;
  bank_account_no: string;
  bank_account_holder: string;
  status: EmployeeStatus;
  deleted_at: string | null;
  version: number;
}

// ── Employee Salary ─────────────────────────────────────────

export interface AllowanceComponent {
  name: string;
  amount: number;
}

export interface EmployeeSalary {
  id: string;
  tenant_id: string;
  employee_id: string;
  basic_salary: number;
  fixed_allowances: AllowanceComponent[];
  non_fixed_allowances: AllowanceComponent[];
  jkk_risk_grade: JkkRiskGrade;
  bpjs_kes_override: boolean;
  pph21_scheme: Pph21Scheme;
  salary_type: SalaryType;
  effective_date: string;
  is_current: boolean;
  deleted_at: string | null;
  version: number;
}

// ── Payroll Result ──────────────────────────────────────────

export interface PayrollResult {
  employee_id: string;
  gross_salary: number;
  // BPJS employee deductions
  bpjs_jht_employee: number;
  bpjs_jp_employee: number;
  bpjs_kes_employee: number;
  // BPJS employer contributions (penambah bruto pajak)
  bpjs_jkk_employer: number;
  bpjs_jkm_employer: number;
  bpjs_jht_employer: number;
  bpjs_jp_employer: number;
  bpjs_kes_employer: number;
  // Tax
  pph21_amount: number;
  // Other deductions
  loan_deduction: number;
  absence_deduction: number;
  // Final
  total_deductions: number;
  thp: number;
  total_employer_cost: number;
}

// ── API Response Envelopes ──────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total_records: number;
    total_pages: number;
  };
}

export interface ApiError {
  success: false;
  error_code: string;
  message: string;
  errors?: { field: string; message: string }[];
  request_id: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
