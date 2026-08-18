import { describe, it, expect } from 'vitest';
import {
  calculateBpjs,
  calculateOvertime,
  lookupTerRate,
  calculateMonthlyPayroll,
  calculateAnnualReconciliation,
} from '../src';

describe('Payroll Engine — Lampiran 03 Reference Test Vectors (Zero Rp Tolerance)', () => {
  // ── 1. TER Lookup Tables Verification ──────────────────────────
  describe('TER Table Lookups', () => {
    it('TER A: Layer 1 (<= 5.4jt) is 0%', () => {
      const res = lookupTerRate('A', 5_400_000);
      expect(res.layer).toBe(1);
      expect(res.rate).toBe(0.0000);
    });

    it('TER A: Layer 6 (> 6.75jt s/d 7.5jt) is 1.25%', () => {
      const res = lookupTerRate('A', 7_317_800);
      expect(res.layer).toBe(6);
      expect(res.rate).toBe(0.0125);
    });

    it('TER A: Layer 16 (> 13.75jt s/d 15.1jt) is 6.00%', () => {
      const res = lookupTerRate('A', 14_317_800);
      expect(res.layer).toBe(16);
      expect(res.rate).toBe(0.0600);
    });

    it('TER B: Layer 8 (> 11.25jt s/d 11.6jt) is 2.50%', () => {
      const res = lookupTerRate('B', 11_321_052);
      expect(res.layer).toBe(8);
      expect(res.rate).toBe(0.0250);
    });

    it('TER C: Layer 1 (<= 6.6jt) is 0%', () => {
      const res = lookupTerRate('C', 6_500_000);
      expect(res.layer).toBe(1);
      expect(res.rate).toBe(0.0000);
    });
  });

  // ── 2. BPJS Program Calculations ──────────────────────────────
  describe('BPJS 5-Program Calculations', () => {
    it('Calculates exact BPJS contributions for Rp 10.000.000 (Grade 1)', () => {
      const res = calculateBpjs(10_000_000, { jkkRiskGrade: 1 });
      expect(res.jkk_employer).toBe(24_000);
      expect(res.jkm_employer).toBe(30_000);
      expect(res.jht_employer).toBe(370_000);
      expect(res.jp_employer).toBe(200_000);
      expect(res.kes_employer).toBe(400_000);
      expect(res.total_employer).toBe(1_024_000);

      expect(res.jht_employee).toBe(200_000);
      expect(res.jp_employee).toBe(100_000);
      expect(res.kes_employee).toBe(100_000);
      expect(res.total_employee).toBe(400_000);

      expect(res.taxable_premiums).toBe(454_000); // 24k + 30k + 400k
    });

    it('Enforces JP and BPJS Kes ceilings on high salary', () => {
      // Gaji 20jt > JP Ceiling (10.042.300) and Kes Ceiling (12.000.000)
      const res = calculateBpjs(20_000_000, { jkkRiskGrade: 1 });
      expect(res.jp_employee).toBe(100_423); // 1% of 10.042.300
      expect(res.kes_employee).toBe(120_000); // 1% of 12.000.000
    });
  });

  // ── 3. Overtime PP 35/2021 Calculations ───────────────────────
  describe('Overtime Calculations', () => {
    it('Calculates 10 hours workday overtime on Rp 10.000.000 wage basis', () => {
      // 10 days @ 1h/day = 10 * 1.5 = 15 multiplier hours
      const entries = Array(10).fill({ hours: 1, dayType: 'WORKDAY' as const });
      const res = calculateOvertime(10_000_000, entries);

      expect(res.multiplier_hours).toBe(15);
      expect(res.total_overtime_pay).toBe(867_052);
    });

    it('Calculates 8 hours holiday overtime (5-day system) on Rp 5.000.000 wage basis', () => {
      // 8h @ 2.0x = 16 multiplier hours
      const entries = [{ hours: 8, dayType: 'HOLIDAY_5DAY' as const }];
      const res = calculateOvertime(5_000_000, entries);

      expect(res.multiplier_hours).toBe(16);
      expect(res.total_overtime_pay).toBe(462_428);
    });
  });

  // ── 4. Studi Kasus 1: Karyawan Tetap (Januari) ────────────────
  describe('Studi Kasus 1: Budi Santoso (Januari) — Lampiran 03 Section 2', () => {
    it('Produces exact figures matching Lampiran 03 with Rp 0 deviation', () => {
      const res = calculateMonthlyPayroll({
        basicSalary: 8_500_000,
        fixedAllowances: [{ name: 'Tunjangan Jabatan', amount: 1_500_000 }],
        overtimePay: 867_052,
        ptkpStatus: 'K/1',
        bpjsConfig: { jkkRiskGrade: 1 },
      });

      expect(res.gross_earnings).toBe(10_867_052);
      expect(res.bpjs.taxable_premiums).toBe(454_000);
      expect(res.gross_taxable_income).toBe(11_321_052);
      expect(res.ter_category).toBe('B');
      expect(res.ter_layer).toBe(8);
      expect(res.effective_ter_rate).toBe(0.0250);
      expect(res.pph21_amount).toBe(283_026);
      expect(res.total_bpjs_employee).toBe(400_000);
      expect(res.total_deductions).toBe(683_026);
      expect(res.thp).toBe(10_184_026);
      expect(res.total_employer_cost).toBe(11_891_052);
    });
  });

  // ── 5. Studi Kasus 1: Rekonsiliasi Masa Desember ──────────────
  describe('Studi Kasus 1: Rekonsiliasi Desember (Pasal 17) — Lampiran 03 Section 2.8', () => {
    it('Calculates exact annual reconciliation matching Lampiran 03', () => {
      // Jan: Bruto 11.321.052, PPh 21 = 283.026
      // Feb-Nov (10 months): Bruto 10.454.000/mo, PPh 21 = 156.810/mo
      // Total previously withheld Jan-Nov = 283.026 + (10 * 156.810) = 1.851.126
      // Total annual gross taxable = 11.321.052 + (11 * 10.454.000) = 126.315.052
      const res = calculateAnnualReconciliation({
        ptkpStatus: 'K/1',
        annualGrossTaxable: 126_315_052,
        annualEmployeeJht: 12 * 200_000,
        annualEmployeeJp: 12 * 100_000,
        previouslyWithheldPph21: 1_851_126,
        workingMonths: 12,
      });

      expect(res.biaya_jabatan).toBe(6_000_000); // Plafon 6jt
      expect(res.total_annual_deductions).toBe(9_600_000);
      expect(res.annual_net_income).toBe(116_715_052);
      expect(res.ptkp_amount).toBe(63_000_000);
      expect(res.pkp_real).toBe(53_715_052);
      expect(res.pkp_rounded).toBe(53_715_000);
      expect(res.total_pph21_annual).toBe(2_685_750); // 5% of 53.715.000
      expect(res.pph21_december_payable).toBe(834_624);
    });
  });

  // ── 6. Studi Kasus 2: Karyawan Menerima THR (April) ────────────
  describe('Studi Kasus 2: Siti Rahmawati (THR April) — Lampiran 03 Section 3', () => {
    it('Calculates regular month (March) without THR', () => {
      const res = calculateMonthlyPayroll({
        basicSalary: 6_000_000,
        fixedAllowances: [{ name: 'Tunjangan Tetap', amount: 1_000_000 }],
        ptkpStatus: 'TK/0',
        bpjsConfig: { jkkRiskGrade: 1 },
      });

      expect(res.gross_taxable_income).toBe(7_317_800);
      expect(res.ter_category).toBe('A');
      expect(res.effective_ter_rate).toBe(0.0125);
      expect(res.pph21_amount).toBe(91_472);
      expect(res.total_bpjs_employee).toBe(280_000);
      expect(res.thp).toBe(6_628_528);
    });

    it('Calculates THR month (April) with exact 6% TER A rate', () => {
      const res = calculateMonthlyPayroll({
        basicSalary: 6_000_000,
        fixedAllowances: [{ name: 'Tunjangan Tetap', amount: 1_000_000 }],
        thrAmount: 7_000_000,
        ptkpStatus: 'TK/0',
        bpjsConfig: { jkkRiskGrade: 1 },
      });

      expect(res.gross_earnings).toBe(14_000_000);
      expect(res.bpjs.taxable_premiums).toBe(317_800);
      expect(res.gross_taxable_income).toBe(14_317_800);
      expect(res.ter_category).toBe('A');
      expect(res.ter_layer).toBe(16);
      expect(res.effective_ter_rate).toBe(0.0600);
      expect(res.pph21_amount).toBe(859_068);
      expect(res.total_bpjs_employee).toBe(280_000);
      expect(res.total_deductions).toBe(1_139_068);
      expect(res.thp).toBe(12_860_932);
      expect(res.total_employer_cost).toBe(14_716_800);
    });
  });

  // ── 7. Studi Kasus 3: PKWT + Lembur Libur + Kompensasi ────────
  describe('Studi Kasus 3: Doni Wijaya (Akhir Kontrak PKWT) — Lampiran 03 Section 4', () => {
    it('Calculates end of contract payroll with overtime & compensation', () => {
      const res = calculateMonthlyPayroll({
        basicSalary: 4_000_000,
        fixedAllowances: [{ name: 'Tunjangan Tetap', amount: 1_000_000 }],
        overtimePay: 462_428,
        pkwtCompensation: 2_500_000,
        ptkpStatus: 'TK/0',
        bpjsConfig: { jkkRiskGrade: 1 },
      });

      expect(res.gross_earnings).toBe(7_962_428);
      expect(res.bpjs.taxable_premiums).toBe(227_000);
      expect(res.gross_taxable_income).toBe(8_189_428);
      expect(res.ter_category).toBe('A');
      expect(res.ter_layer).toBe(7);
      expect(res.effective_ter_rate).toBe(0.0150);
      expect(res.pph21_amount).toBe(122_841);
      expect(res.total_bpjs_employee).toBe(200_000);
      expect(res.total_deductions).toBe(322_841);
      expect(res.thp).toBe(7_639_587);
      expect(res.total_employer_cost).toBe(8_474_428);
    });
  });

  // ── 8. Kasus 7: Gaji di Bawah PTKP ─────────────────────────────
  describe('Kasus 7: Ani (Gaji Rp 3.500.000 < PTKP) — Lampiran 03 Section 4.7', () => {
    it('Calculates 0% PPh 21 and correct net salary', () => {
      const res = calculateMonthlyPayroll({
        basicSalary: 3_500_000,
        ptkpStatus: 'TK/0',
        bpjsConfig: { jkkRiskGrade: 1 },
      });

      expect(res.ter_category).toBe('A');
      expect(res.effective_ter_rate).toBe(0.0000);
      expect(res.pph21_amount).toBe(0);
      expect(res.total_bpjs_employee).toBe(140_000); // JHT 70k + JP 35k + Kes 35k
      expect(res.thp).toBe(3_360_000);
    });

    it('Reconciles December with negative PKP returning PPh 21 = Rp 0', () => {
      const res = calculateAnnualReconciliation({
        ptkpStatus: 'TK/0',
        annualGrossTaxable: 3_500_000 * 12,
        annualEmployeeJht: 70_000 * 12,
        annualEmployeeJp: 35_000 * 12,
        previouslyWithheldPph21: 0,
        workingMonths: 12,
      });

      expect(res.pkp_real).toBe(0);
      expect(res.pkp_rounded).toBe(0);
      expect(res.total_pph21_annual).toBe(0);
      expect(res.pph21_december_payable).toBe(0);
      expect(res.is_overwithheld).toBe(false);
    });
  });

  // ── 9. Non-NPWP Surcharge Test ────────────────────────────────
  describe('Non-NPWP Surcharge (120% Rate)', () => {
    it('Applies 120% surcharge on TER rate when hasNpwp = false', () => {
      const res = calculateMonthlyPayroll({
        basicSalary: 10_000_000,
        ptkpStatus: 'K/1', // Normal TER B layer 6 = 1.50%
        hasNpwp: false,
        bpjsConfig: { jkkRiskGrade: 1 },
      });

      // 1.50% * 1.20 = 1.80%
      expect(res.effective_ter_rate).toBeCloseTo(0.0180, 4);
    });
  });
});
