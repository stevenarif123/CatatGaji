import { BPJS } from '../constants';
import type { JkkRiskGrade } from '../types';

export interface BpjsConfig {
  jkkRiskGrade?: JkkRiskGrade;
  jpCeiling?: number;
  kesCeiling?: number;
  bpjsKesOverride?: boolean;
}

export interface BpjsResult {
  // Employer contributions
  jkk_employer: number;
  jkm_employer: number;
  jht_employer: number;
  jp_employer: number;
  kes_employer: number;
  total_employer: number;

  // Employee deductions (potong gaji)
  jht_employee: number;
  jp_employee: number;
  kes_employee: number;
  total_employee: number;

  // Premi penambah bruto pajak PPh 21 = JKK + JKM + BPJS Kes (Employer)
  taxable_premiums: number;
}

/**
 * Calculate 5 BPJS programs according to Indonesian regulation:
 * - PP 44/2015 (JKK & JKM)
 * - PP 45/2015 (JP with dynamic ceiling)
 * - PP 46/2015 (JHT)
 * - Perpres 64/2020 (BPJS Kesehatan with ceiling Rp 12.000.000)
 *
 * Rounding standard: Round half-up to integer Rupiah per component.
 */
export function calculateBpjs(wageBasis: number, config: BpjsConfig = {}): BpjsResult {
  const grade = config.jkkRiskGrade || 1; // Default Grade 1 (0.24%)
  const jkkRate = BPJS.JKK_RATES[grade - 1] || BPJS.JKK_RATES[0];
  const jpCeiling = config.jpCeiling !== undefined ? config.jpCeiling : BPJS.JP_CEILING;
  const kesCeiling = config.kesCeiling !== undefined ? config.kesCeiling : BPJS.KES_CEILING;

  // Wage basis for JP & Kesehatan capped
  const jpBasis = Math.min(wageBasis, jpCeiling);
  const kesBasis = Math.min(wageBasis, kesCeiling);

  // Employer
  const jkk_employer = Math.round(wageBasis * jkkRate);
  const jkm_employer = Math.round(wageBasis * BPJS.JKM_EMPLOYER);
  const jht_employer = Math.round(wageBasis * BPJS.JHT_EMPLOYER);
  const jp_employer = Math.round(jpBasis * BPJS.JP_EMPLOYER);
  const kes_employer = Math.round(kesBasis * BPJS.KES_EMPLOYER);

  // Employee (deducted from net salary)
  const jht_employee = Math.round(wageBasis * BPJS.JHT_EMPLOYEE);
  const jp_employee = Math.round(jpBasis * BPJS.JP_EMPLOYEE);
  const kes_employee = Math.round(kesBasis * BPJS.KES_EMPLOYEE);

  const total_employer = jkk_employer + jkm_employer + jht_employer + jp_employer + kes_employer;
  const total_employee = jht_employee + jp_employee + kes_employee;

  // Taxable premiums = JKK + JKM + Kes (Employer)
  const taxable_premiums = jkk_employer + jkm_employer + kes_employer;

  return {
    jkk_employer,
    jkm_employer,
    jht_employer,
    jp_employer,
    kes_employer,
    total_employer,
    jht_employee,
    jp_employee,
    kes_employee,
    total_employee,
    taxable_premiums,
  };
}
