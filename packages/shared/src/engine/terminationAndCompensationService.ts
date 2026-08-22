/**
 * Service Kalkulasi Kompensasi Akhir Kontrak PKWT, THR, Pesangon PHK, dan Validasi Upah
 * Sesuai UU No. 13/2003 jo. UU No. 6/2023, PP No. 35/2021, PP No. 36/2021, dan Permenaker No. 6/2016
 * (Riset 04, Riset 05, Lampiran 02)
 */

export interface WageStructureValidation {
  isValid: boolean;
  basicSalary: number;
  fixedAllowances: number;
  totalRegularWage: number;
  basicProportionPercentage: number;
  warningMessage?: string;
}

/**
 * 1. Validasi Mandat Proporsi Upah Pokok Minimal 75% (Pasal 94 UU Ketenagakerjaan & Riset 04)
 * Upah Pokok >= 75% dari (Upah Pokok + Tunjangan Tetap)
 */
export function validateWageStructure(
  basicSalary: number,
  fixedAllowances: number = 0
): WageStructureValidation {
  const totalRegularWage = basicSalary + fixedAllowances;
  if (totalRegularWage <= 0) {
    return {
      isValid: true,
      basicSalary,
      fixedAllowances,
      totalRegularWage: 0,
      basicProportionPercentage: 100,
    };
  }

  const basicProportionPercentage = Math.round((basicSalary / totalRegularWage) * 10000) / 100;
  const isValid = basicProportionPercentage >= 75;

  return {
    isValid,
    basicSalary,
    fixedAllowances,
    totalRegularWage,
    basicProportionPercentage,
    warningMessage: isValid
      ? undefined
      : `Peringatan Kepatuhan UU Ketenagakerjaan Pasal 94: Proporsi gaji pokok (${basicProportionPercentage}%) kurang dari batas minimum 75% dari total upah tetap.`,
  };
}

/**
 * 2. Kalkulator Uang Kompensasi PKWT (Pasal 15 & 16 PP No. 35/2021 & Riset 05)
 * Kompensasi = (Masa Kerja Riil Bulan / 12) * Upah Sebulan (Pokok + Tunj Tetap)
 * Masa kerja minimal 1 bulan terus-menerus.
 */
export function calculatePkwtCompensation(
  monthsWorked: number,
  monthlyWage: number
): number {
  if (monthsWorked < 1 || monthlyWage <= 0) return 0;
  const amount = (monthsWorked / 12) * monthlyWage;
  return Math.round(amount);
}

/**
 * 3. Kalkulator Tunjangan Hari Raya (THR) Keagamaan (Permenaker No. 6/2016 & Riset 04)
 * - Masa kerja >= 12 bulan: 1 x Upah Sebulan
 * - Masa kerja 1 s.d. < 12 bulan: (Masa Kerja Bulan / 12) * Upah Sebulan
 * - Masa kerja < 1 bulan: 0
 */
export function calculateThr(
  monthsWorked: number,
  monthlyWage: number
): number {
  if (monthsWorked < 1 || monthlyWage <= 0) return 0;
  if (monthsWorked >= 12) {
    return Math.round(monthlyWage);
  }
  return Math.round((monthsWorked / 12) * monthlyWage);
}

export type SeveranceReason =
  | 'EFFICIENCY_LOSS' // Pasal 43 (1) : 0.5 UP + 1.0 UPMK + UPH
  | 'EFFICIENCY_PREVENTION' // Pasal 43 (2) : 1.0 UP + 1.0 UPMK + UPH
  | 'FORCE_MAJEURE_CLOSE' // Pasal 44, 45 : 0.5 UP + 1.0 UPMK + UPH
  | 'BANKRUPTCY' // Pasal 47 : 0.5 UP + 1.0 UPMK + UPH
  | 'EMPLOYEE_DEATH' // Pasal 57 : 2.0 UP + 1.0 UPMK + UPH
  | 'RETIREMENT' // Pasal 56 : 1.75 UP + 1.0 UPMK + UPH
  | 'PROLONGED_ILLNESS' // Pasal 55 : 2.0 UP + 1.0 UPMK + UPH
  | 'DISCIPLINARY_SP3' // Pasal 52 (1) : 0.5 UP + 1.0 UPMK + UPH
  | 'URGENT_VIOLATION' // Pasal 52 (2) : 0 UP + 0 UPMK + UPH (Uang Pisah)
  | 'RESIGN'; // Pasal 50 : 0 UP + 0 UPMK + UPH (Uang Pisah)

export interface SeveranceInput {
  yearsWorked: number; // Dalam tahun desimal (misal 3.5 tahun)
  monthlyWage: number; // Gaji Pokok + Tunjangan Tetap
  reason: SeveranceReason;
  unusedLeaveDays?: number; // Sisa cuti tahunan belum gugur
  workingDaysPerMonth?: number; // Default 21 hari (5 hari kerja) atau 25 hari (6 hari kerja)
  separationPay?: number; // Uang pisah sesuai PP/PKB
}

export interface SeveranceResult {
  baseSeverancePay: number; // Nilai dasar UP (1x)
  severanceMultiplier: number; // Pengali UP (0.5x, 1x, 1.75x, 2x)
  totalSeverancePay: number; // Total UP setelah pengali
  serviceRewardPay: number; // Uang Penghargaan Masa Kerja (UPMK)
  rightsCompensationPay: number; // Uang Penggantian Hak (UPH)
  separationPay: number; // Uang Pisah
  grandTotalSeverance: number; // Total keseluruhan kompensasi PHK
  legalReference: string;
}

/**
 * 4. Kalkulator Pesangon PHK Lengkap (PP No. 35/2021 Pasal 40 s/d 59 & Riset 05)
 */
export function calculateSeverancePay(input: SeveranceInput): SeveranceResult {
  const {
    yearsWorked,
    monthlyWage,
    reason,
    unusedLeaveDays = 0,
    workingDaysPerMonth = 21,
    separationPay = 0,
  } = input;

  if (monthlyWage <= 0 || yearsWorked < 0) {
    return {
      baseSeverancePay: 0,
      severanceMultiplier: 0,
      totalSeverancePay: 0,
      serviceRewardPay: 0,
      rightsCompensationPay: 0,
      separationPay: 0,
      grandTotalSeverance: 0,
      legalReference: 'PP No. 35/2021',
    };
  }

  // A. Tabel Dasar Uang Pesangon (UP) - Pasal 40 ayat (2)
  let baseUPMonths = 1;
  if (yearsWorked < 1) baseUPMonths = 1;
  else if (yearsWorked < 2) baseUPMonths = 2;
  else if (yearsWorked < 3) baseUPMonths = 3;
  else if (yearsWorked < 4) baseUPMonths = 4;
  else if (yearsWorked < 5) baseUPMonths = 5;
  else if (yearsWorked < 6) baseUPMonths = 6;
  else if (yearsWorked < 7) baseUPMonths = 7;
  else if (yearsWorked < 8) baseUPMonths = 8;
  else baseUPMonths = 9; // Maksimal 9 bulan

  const baseSeverancePay = Math.round(baseUPMonths * monthlyWage);

  // B. Tabel Dasar Uang Penghargaan Masa Kerja (UPMK) - Pasal 40 ayat (3)
  let upmkMonths = 0;
  if (yearsWorked >= 24) upmkMonths = 10;
  else if (yearsWorked >= 21) upmkMonths = 8;
  else if (yearsWorked >= 18) upmkMonths = 7;
  else if (yearsWorked >= 15) upmkMonths = 6;
  else if (yearsWorked >= 12) upmkMonths = 5;
  else if (yearsWorked >= 9) upmkMonths = 4;
  else if (yearsWorked >= 6) upmkMonths = 3;
  else if (yearsWorked >= 3) upmkMonths = 2;
  else upmkMonths = 0;

  const serviceRewardPay = Math.round(upmkMonths * monthlyWage);

  // C. Uang Penggantian Hak (UPH) - Pasal 40 ayat (4) (Sisa Cuti)
  const rightsCompensationPay =
    unusedLeaveDays > 0
      ? Math.round((unusedLeaveDays / workingDaysPerMonth) * monthlyWage)
      : 0;

  // D. Matriks Pengali Berdasarkan Alasan PHK (Pasal 43 - 59)
  let severanceMultiplier = 1.0;
  let legalReference = 'PP No. 35/2021';

  switch (reason) {
    case 'EFFICIENCY_LOSS':
      severanceMultiplier = 0.5;
      legalReference = 'PP No. 35/2021 Pasal 43 ayat (1)';
      break;
    case 'EFFICIENCY_PREVENTION':
      severanceMultiplier = 1.0;
      legalReference = 'PP No. 35/2021 Pasal 43 ayat (2)';
      break;
    case 'FORCE_MAJEURE_CLOSE':
      severanceMultiplier = 0.5;
      legalReference = 'PP No. 35/2021 Pasal 44 & 45';
      break;
    case 'BANKRUPTCY':
      severanceMultiplier = 0.5;
      legalReference = 'PP No. 35/2021 Pasal 47';
      break;
    case 'EMPLOYEE_DEATH':
      severanceMultiplier = 2.0;
      legalReference = 'PP No. 35/2021 Pasal 57';
      break;
    case 'RETIREMENT':
      severanceMultiplier = 1.75;
      legalReference = 'PP No. 35/2021 Pasal 56';
      break;
    case 'PROLONGED_ILLNESS':
      severanceMultiplier = 2.0;
      legalReference = 'PP No. 35/2021 Pasal 55';
      break;
    case 'DISCIPLINARY_SP3':
      severanceMultiplier = 0.5;
      legalReference = 'PP No. 35/2021 Pasal 52 ayat (1)';
      break;
    case 'URGENT_VIOLATION':
      severanceMultiplier = 0.0;
      legalReference = 'PP No. 35/2021 Pasal 52 ayat (2)';
      break;
    case 'RESIGN':
      severanceMultiplier = 0.0;
      legalReference = 'PP No. 35/2021 Pasal 50';
      break;
  }

  const isResignOrUrgent = reason === 'RESIGN' || reason === 'URGENT_VIOLATION';
  const totalSeverancePay = Math.round(baseSeverancePay * severanceMultiplier);
  const actualServiceReward = isResignOrUrgent ? 0 : serviceRewardPay;

  const grandTotalSeverance =
    totalSeverancePay +
    actualServiceReward +
    rightsCompensationPay +
    (separationPay || 0);

  return {
    baseSeverancePay,
    severanceMultiplier,
    totalSeverancePay,
    serviceRewardPay: actualServiceReward,
    rightsCompensationPay,
    separationPay: separationPay || 0,
    grandTotalSeverance,
    legalReference,
  };
}
