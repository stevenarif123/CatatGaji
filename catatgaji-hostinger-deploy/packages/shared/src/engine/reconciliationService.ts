import {
  PPH21_PROGRESSIVE_BRACKETS,
  PTKP_AMOUNTS,
  BIAYA_JABATAN_RATE,
  BIAYA_JABATAN_MAX_ANNUAL,
  BIAYA_JABATAN_MAX_MONTHLY,
} from '../constants';
import type { PtkpStatus } from '../constants';

export interface ReconciliationInput {
  ptkpStatus: PtkpStatus;
  annualGrossTaxable: number;
  annualEmployeeJht: number;
  annualEmployeeJp: number;
  previouslyWithheldPph21: number;
  workingMonths?: number;
  hasNpwp?: boolean;
}

export interface ReconciliationResult {
  annual_gross_taxable: number;
  biaya_jabatan: number;
  annual_employee_jht: number;
  annual_employee_jp: number;
  total_annual_deductions: number;
  annual_net_income: number;
  ptkp_amount: number;
  pkp_real: number;
  pkp_rounded: number;
  total_pph21_annual: number;
  previously_withheld: number;
  pph21_december_payable: number;
  is_overwithheld: boolean;
}

/**
 * Calculate Progressive PPh 21 Pasal 17 Ayat (1) Huruf a UU HPP
 */
export function calculateProgressiveTax(pkp: number): number {
  if (pkp <= 0) return 0;

  let tax = 0;
  let remaining = pkp;

  for (const bracket of PPH21_PROGRESSIVE_BRACKETS) {
    if (remaining <= 0) break;
    const bracketSpan = bracket.ceiling - bracket.floor;
    const taxableInBracket = Math.min(remaining, bracketSpan);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
  }

  return Math.floor(tax);
}

/**
 * December / Final Period PPh 21 Annual Reconciliation Engine
 */
export function calculateAnnualReconciliation(input: ReconciliationInput): ReconciliationResult {
  const workingMonths = input.workingMonths || 12;
  const maxBiayaJabatan = Math.min(BIAYA_JABATAN_MAX_ANNUAL, workingMonths * BIAYA_JABATAN_MAX_MONTHLY);

  const calculatedBiayaJabatan = input.annualGrossTaxable * BIAYA_JABATAN_RATE;
  const biaya_jabatan = Math.min(calculatedBiayaJabatan, maxBiayaJabatan);

  const total_annual_deductions = biaya_jabatan + input.annualEmployeeJht + input.annualEmployeeJp;
  const annual_net_income = input.annualGrossTaxable - total_annual_deductions;

  const ptkp_amount = PTKP_AMOUNTS[input.ptkpStatus] || PTKP_AMOUNTS['TK/0'];

  const pkp_real = Math.max(0, annual_net_income - ptkp_amount);
  // Floor to nearest Rp 1.000 according to UU HPP
  const pkp_rounded = Math.floor(pkp_real / 1000) * 1000;

  let total_pph21_annual = calculateProgressiveTax(pkp_rounded);

  // If employee has no NPWP, surcharge 120%
  if (input.hasNpwp === false) {
    total_pph21_annual = Math.floor(total_pph21_annual * 1.20);
  }

  const pph21_december_payable = total_pph21_annual - input.previouslyWithheldPph21;
  const is_overwithheld = pph21_december_payable < 0;

  return {
    annual_gross_taxable: input.annualGrossTaxable,
    biaya_jabatan,
    annual_employee_jht: input.annualEmployeeJht,
    annual_employee_jp: input.annualEmployeeJp,
    total_annual_deductions,
    annual_net_income,
    ptkp_amount,
    pkp_real,
    pkp_rounded,
    total_pph21_annual,
    previously_withheld: input.previouslyWithheldPph21,
    pph21_december_payable,
    is_overwithheld,
  };
}
