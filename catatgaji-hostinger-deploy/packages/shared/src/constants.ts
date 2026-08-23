// ============================================================
// PTKP Status & TER Category Mapping
// Sumber: PMK No. 168/2023 Pasal 2 ayat (3)
// ============================================================

export const PTKP_STATUS = [
  'TK/0', 'TK/1', 'TK/2', 'TK/3',
  'K/0', 'K/1', 'K/2', 'K/3',
  'K/I/0', 'K/I/1', 'K/I/2', 'K/I/3',
] as const;

export type PtkpStatus = typeof PTKP_STATUS[number];

export type TerCategory = 'A' | 'B' | 'C';

/**
 * PTKP → TER Category mapping sesuai PMK 168/2023:
 * - Kategori A: TK/0 (54jt), TK/1 (58.5jt), K/0 (58.5jt)
 * - Kategori B: TK/2 (63jt), TK/3 (67.5jt), K/1 (63jt), K/2 (67.5jt)
 * - Kategori C: K/3 (72jt)
 * - K/I/x treated same as TK/x for TER mapping
 */
export const PTKP_TO_TER: Record<PtkpStatus, TerCategory> = {
  'TK/0': 'A', 'TK/1': 'A',
  'K/0': 'A',
  'TK/2': 'B', 'TK/3': 'B',
  'K/1': 'B', 'K/2': 'B',
  'K/3': 'C',
  // K/I/x — penghasilan istri digabung, mapping sama dengan TK/x
  'K/I/0': 'A', 'K/I/1': 'A', 'K/I/2': 'B', 'K/I/3': 'B',
};

// PTKP annual amounts (Rp) — UU HPP
export const PTKP_AMOUNTS: Record<PtkpStatus, number> = {
  'TK/0': 54_000_000,
  'TK/1': 58_500_000,
  'TK/2': 63_000_000,
  'TK/3': 67_500_000,
  'K/0': 58_500_000,
  'K/1': 63_000_000,
  'K/2': 67_500_000,
  'K/3': 72_000_000,
  'K/I/0': 54_000_000,
  'K/I/1': 58_500_000,
  'K/I/2': 63_000_000,
  'K/I/3': 67_500_000,
};

// ============================================================
// PPh 21 Pasal 17 UU HPP — Tarif Progresif (Rekonsiliasi Des)
// ============================================================

export const PPH21_PROGRESSIVE_BRACKETS = [
  { floor: 0,               ceiling: 60_000_000,        rate: 0.05 },
  { floor: 60_000_000,      ceiling: 250_000_000,       rate: 0.15 },
  { floor: 250_000_000,     ceiling: 500_000_000,       rate: 0.25 },
  { floor: 500_000_000,     ceiling: 5_000_000_000,     rate: 0.30 },
  { floor: 5_000_000_000,   ceiling: Infinity,          rate: 0.35 },
] as const;

// Non-NPWP surcharge multiplier (UU HPP)
export const NON_NPWP_TER_MULTIPLIER = 1.20;

// Biaya jabatan: 5% dari bruto, max Rp 6.000.000/tahun (Rp 500.000/bulan)
export const BIAYA_JABATAN_RATE = 0.05;
export const BIAYA_JABATAN_MAX_ANNUAL = 6_000_000;
export const BIAYA_JABATAN_MAX_MONTHLY = 500_000;

// ============================================================
// BPJS Constants (regulatory-constants, configurable per tahun)
// ponytail: hardcoded for now, extract to JSON config when admin UI is built
// ============================================================

export const BPJS = {
  // BPJS Ketenagakerjaan
  JHT_EMPLOYER: 0.0370,    // 3.70%
  JHT_EMPLOYEE: 0.0200,    // 2.00%
  JKM_EMPLOYER: 0.0030,    // 0.30%
  JKM_EMPLOYEE: 0,
  JKK_RATES: [0.0024, 0.0054, 0.0089, 0.0127, 0.0174] as const, // Kelas 1-5
  JP_EMPLOYER: 0.0200,     // 2.00%
  JP_EMPLOYEE: 0.0100,     // 1.00%
  JP_CEILING: 10_042_300,  // Plafon JP 2024

  // BPJS Kesehatan
  KES_EMPLOYER: 0.0400,    // 4.00%
  KES_EMPLOYEE: 0.0100,    // 1.00%
  KES_CEILING: 12_000_000, // Plafon BPJS Kesehatan
} as const;

// Lembur PP 35/2021: upah sejam = 1/173 × (pokok + tunjangan tetap)
export const OVERTIME_HOURLY_DIVISOR = 173;
