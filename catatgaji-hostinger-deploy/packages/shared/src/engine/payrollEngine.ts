import { PTKP_TO_TER } from '../constants';
import type { PtkpStatus, TerCategory } from '../constants';
import { calculateBpjs } from './bpjsService';
import type { BpjsConfig, BpjsResult } from './bpjsService';
import { lookupTerRate } from './terTables';
import type { TerLayer } from './terTables';

export interface AllowanceItem {
  name: string;
  amount: number;
}

export interface MonthlyPayrollInput {
  basicSalary: number;
  fixedAllowances?: AllowanceItem[];
  nonFixedAllowances?: AllowanceItem[];
  overtimePay?: number;
  thrAmount?: number;
  pkwtCompensation?: number;
  bonusAmount?: number;
  ptkpStatus: PtkpStatus;
  hasNpwp?: boolean;
  bpjsConfig?: BpjsConfig;
  loanDeduction?: number;
  absenceDeduction?: number;
}

export interface MonthlyPayrollResult {
  // Earnings
  basic_salary: number;
  total_fixed_allowances: number;
  total_non_fixed_allowances: number;
  overtime_pay: number;
  thr_amount: number;
  pkwt_compensation: number;
  bonus_amount: number;
  gross_earnings: number;

  // BPJS Breakdown
  bpjs: BpjsResult;

  // Taxable
  gross_taxable_income: number;
  ter_category: TerCategory;
  ter_layer: number;
  effective_ter_rate: number;
  pph21_amount: number;

  // Deductions
  total_bpjs_employee: number;
  loan_deduction: number;
  absence_deduction: number;
  total_deductions: number;

  // Final Net Take-Home Pay & Employer Cost
  thp: number;
  total_employer_cost: number;
}

/**
 * Core Monthly Payroll Calculation Engine
 * Complies with PMK 168/2023, PP 58/2023, PP 35/2021, and BPJS Regulations.
 */
export function calculateMonthlyPayroll(input: MonthlyPayrollInput): MonthlyPayrollResult {
  const basic_salary = Number(input.basicSalary) || 0;
  const fixedAllowances = input.fixedAllowances || [];
  const nonFixedAllowances = input.nonFixedAllowances || [];
  const overtime_pay = Number(input.overtimePay) || 0;
  const thr_amount = Number(input.thrAmount) || 0;
  const pkwt_compensation = Number(input.pkwtCompensation) || 0;
  const bonus_amount = Number(input.bonusAmount) || 0;
  const loan_deduction = Number(input.loanDeduction) || 0;
  const absence_deduction = Number(input.absenceDeduction) || 0;

  const total_fixed_allowances = fixedAllowances.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const total_non_fixed_allowances = nonFixedAllowances.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // 1. Total Gross Earnings received by employee
  const gross_earnings =
    basic_salary +
    total_fixed_allowances +
    total_non_fixed_allowances +
    overtime_pay +
    thr_amount +
    pkwt_compensation +
    bonus_amount;

  // 2. Wage basis for BPJS calculation (Gaji Pokok + Tunjangan Tetap)
  const bpjsWageBasis = basic_salary + total_fixed_allowances;
  const bpjs = calculateBpjs(bpjsWageBasis, input.bpjsConfig);

  // 3. Gross Taxable Income for PPh 21 = Earnings + Employer Insurance Premiums (JKK + JKM + BPJS Kes)
  const gross_taxable_income = gross_earnings + bpjs.taxable_premiums;

  // 4. TER Category Determination & Rate Lookup
  const ter_category: TerCategory = PTKP_TO_TER[input.ptkpStatus] || 'A';
  const terLayer: TerLayer = lookupTerRate(ter_category, gross_taxable_income);

  let effective_ter_rate = terLayer.rate;
  if (input.hasNpwp === false) {
    // Non-NPWP penalty 120%
    effective_ter_rate = effective_ter_rate * 1.20;
  }

  // 5. PPh 21 Calculation: Floor to nearest integer Rupiah
  const pph21_amount = Math.floor(gross_taxable_income * effective_ter_rate);

  // 6. Total Deductions from Employee Take-Home Pay
  const total_bpjs_employee = bpjs.total_employee;
  const total_deductions = total_bpjs_employee + pph21_amount + loan_deduction + absence_deduction;

  // 7. Net Take-Home Pay (THP)
  const thp = gross_earnings - total_deductions;

  // 8. Total Employer Cost = Gross Earnings + Employer BPJS contributions
  const total_employer_cost = gross_earnings + bpjs.total_employer;

  return {
    basic_salary,
    total_fixed_allowances,
    total_non_fixed_allowances,
    overtime_pay,
    thr_amount,
    pkwt_compensation,
    bonus_amount,
    gross_earnings,
    bpjs,
    gross_taxable_income,
    ter_category,
    ter_layer: terLayer.layer,
    effective_ter_rate,
    pph21_amount,
    total_bpjs_employee,
    loan_deduction,
    absence_deduction,
    total_deductions,
    thp,
    total_employer_cost,
  };
}
