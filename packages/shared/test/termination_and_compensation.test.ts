import { describe, it, expect } from 'vitest';
import {
  validateWageStructure,
  calculatePkwtCompensation,
  calculateThr,
  calculateSeverancePay,
} from '../src/engine/terminationAndCompensationService';

describe('Kompensasi PKWT, THR, Pesangon PHK & Validasi Upah (PP 35/2021 & Riset 04/05)', () => {
  describe('1. Validasi Mandat Proporsi Upah Pokok >= 75% (Pasal 94 UU Ketenagakerjaan)', () => {
    it('Lolos jika proporsi gaji pokok tepat atau lebih dari 75%', () => {
      const res = validateWageStructure(8000000, 2000000); // 8jt / 10jt = 80%
      expect(res.isValid).toBe(true);
      expect(res.basicProportionPercentage).toBe(80);
      expect(res.warningMessage).toBeUndefined();
    });

    it('Peringatan jika proporsi gaji pokok kurang dari 75%', () => {
      const res = validateWageStructure(6000000, 4000000); // 6jt / 10jt = 60%
      expect(res.isValid).toBe(false);
      expect(res.basicProportionPercentage).toBe(60);
      expect(res.warningMessage).toBeDefined();
    });
  });

  describe('2. Uang Kompensasi Akhir Kontrak PKWT (Pasal 15 & 16 PP 35/2021)', () => {
    it('Menghitung kompensasi 12 bulan penuh = 1x Upah Sebulan', () => {
      const comp = calculatePkwtCompensation(12, 10000000);
      expect(comp).toBe(10000000);
    });

    it('Menghitung kompensasi 6 bulan prorata = 6/12 * 10jt = 5jt', () => {
      const comp = calculatePkwtCompensation(6, 10000000);
      expect(comp).toBe(5000000);
    });

    it('Masa kerja < 1 bulan menghasilkan Rp 0', () => {
      const comp = calculatePkwtCompensation(0, 10000000);
      expect(comp).toBe(0);
    });
  });

  describe('3. Tunjangan Hari Raya (THR) Keagamaan (Permenaker 6/2016)', () => {
    it('Masa kerja >= 12 bulan berhak 1x upah penuh', () => {
      const thr = calculateThr(15, 8000000);
      expect(thr).toBe(8000000);
    });

    it('Masa kerja 3 bulan berhak prorata 3/12 * 8jt = 2jt', () => {
      const thr = calculateThr(3, 8000000);
      expect(thr).toBe(2000000);
    });

    it('Masa kerja < 1 bulan tidak berhak THR', () => {
      const thr = calculateThr(0, 8000000);
      expect(thr).toBe(0);
    });
  });

  describe('4. Kalkulasi Pesangon PHK (PP 35/2021 Pasal 40 s/d 59)', () => {
    it('PHK Efisiensi Kerugian (Pasal 43 ayat 1): 0.5 UP + 1.0 UPMK + UPH', () => {
      // Karyawan 4.5 tahun (Masa kerja 4 s.d. 5 thn: UP 5 bln, UPMK 2 bln), Upah 10jt, Sisa cuti 5 hari
      const result = calculateSeverancePay({
        yearsWorked: 4.5,
        monthlyWage: 10000000,
        reason: 'EFFICIENCY_LOSS',
        unusedLeaveDays: 5,
        workingDaysPerMonth: 21,
      });

      expect(result.baseSeverancePay).toBe(50000000); // 5 x 10jt
      expect(result.severanceMultiplier).toBe(0.5);
      expect(result.totalSeverancePay).toBe(25000000); // 0.5 x 50jt
      expect(result.serviceRewardPay).toBe(20000000); // 2 x 10jt
      expect(result.rightsCompensationPay).toBe(Math.round((5 / 21) * 10000000));
      expect(result.grandTotalSeverance).toBe(25000000 + 20000000 + Math.round((5 / 21) * 10000000));
    });

    it('PHK Meninggal Dunia (Pasal 57): 2.0 UP + 1.0 UPMK + UPH', () => {
      const result = calculateSeverancePay({
        yearsWorked: 7.5, // 7 s.d. 8 thn -> UP 8 bln, UPMK 3 bln
        monthlyWage: 12000000,
        reason: 'EMPLOYEE_DEATH',
      });

      expect(result.severanceMultiplier).toBe(2.0);
      expect(result.totalSeverancePay).toBe(8 * 12000000 * 2.0); // 192jt
      expect(result.serviceRewardPay).toBe(3 * 12000000); // 36jt
      expect(result.grandTotalSeverance).toBe(192000000 + 36000000);
    });

    it('Pekerja Resign Sukarela (Pasal 50): 0 UP, 0 UPMK, hanya UPH + Uang Pisah', () => {
      const result = calculateSeverancePay({
        yearsWorked: 5,
        monthlyWage: 10000000,
        reason: 'RESIGN',
        unusedLeaveDays: 2,
        workingDaysPerMonth: 21,
        separationPay: 3000000,
      });

      expect(result.totalSeverancePay).toBe(0);
      expect(result.serviceRewardPay).toBe(0);
      expect(result.separationPay).toBe(3000000);
      expect(result.grandTotalSeverance).toBe(Math.round((2 / 21) * 10000000) + 3000000);
    });
  });
});
