// ============================================================
// Tabel Lengkap Tarif Efektif Rata-Rata (TER) PPh 21
// Sumber: PP No. 58/2023 & PMK No. 168/2023
// ============================================================

export interface TerLayer {
  layer: number;
  min: number;
  max: number; // Infinity for the last tier
  rate: number; // Decimal: 0.025 = 2.50%
}

// ── Kategori A (44 Lapisan) ──────────────────────────────────
// PTKP: TK/0, TK/1, K/0
export const TER_A_TABLE: TerLayer[] = [
  { layer: 1, min: 0, max: 5_400_000, rate: 0.0000 },
  { layer: 2, min: 5_400_000, max: 5_650_000, rate: 0.0025 },
  { layer: 3, min: 5_650_000, max: 5_950_000, rate: 0.0050 },
  { layer: 4, min: 5_950_000, max: 6_300_000, rate: 0.0075 },
  { layer: 5, min: 6_300_000, max: 6_750_000, rate: 0.0100 },
  { layer: 6, min: 6_750_000, max: 7_500_000, rate: 0.0125 },
  { layer: 7, min: 7_500_000, max: 8_550_000, rate: 0.0150 },
  { layer: 8, min: 8_550_000, max: 9_650_000, rate: 0.0175 },
  { layer: 9, min: 9_650_000, max: 10_050_000, rate: 0.0200 },
  { layer: 10, min: 10_050_000, max: 10_350_000, rate: 0.0225 },
  { layer: 11, min: 10_350_000, max: 10_700_000, rate: 0.0250 },
  { layer: 12, min: 10_700_000, max: 11_050_000, rate: 0.0300 },
  { layer: 13, min: 11_050_000, max: 11_600_000, rate: 0.0350 },
  { layer: 14, min: 11_600_000, max: 12_500_000, rate: 0.0400 },
  { layer: 15, min: 12_500_000, max: 13_750_000, rate: 0.0500 },
  { layer: 16, min: 13_750_000, max: 15_100_000, rate: 0.0600 },
  { layer: 17, min: 15_100_000, max: 16_950_000, rate: 0.0700 },
  { layer: 18, min: 16_950_000, max: 19_750_000, rate: 0.0800 },
  { layer: 19, min: 19_750_000, max: 24_150_000, rate: 0.0900 },
  { layer: 20, min: 24_150_000, max: 26_450_000, rate: 0.1000 },
  { layer: 21, min: 26_450_000, max: 28_000_000, rate: 0.1100 },
  { layer: 22, min: 28_000_000, max: 30_050_000, rate: 0.1200 },
  { layer: 23, min: 30_050_000, max: 32_400_000, rate: 0.1300 },
  { layer: 24, min: 32_400_000, max: 35_400_000, rate: 0.1400 },
  { layer: 25, min: 35_400_000, max: 39_100_000, rate: 0.1500 },
  { layer: 26, min: 39_100_000, max: 43_850_000, rate: 0.1600 },
  { layer: 27, min: 43_850_000, max: 47_800_000, rate: 0.1700 },
  { layer: 28, min: 47_800_000, max: 51_400_000, rate: 0.1800 },
  { layer: 29, min: 51_400_000, max: 56_300_000, rate: 0.1900 },
  { layer: 30, min: 56_300_000, max: 62_200_000, rate: 0.2000 },
  { layer: 31, min: 62_200_000, max: 68_600_000, rate: 0.2100 },
  { layer: 32, min: 68_600_000, max: 77_500_000, rate: 0.2200 },
  { layer: 33, min: 77_500_000, max: 89_000_000, rate: 0.2300 },
  { layer: 34, min: 89_000_000, max: 103_000_000, rate: 0.2400 },
  { layer: 35, min: 103_000_000, max: 125_000_000, rate: 0.2500 },
  { layer: 36, min: 125_000_000, max: 157_000_000, rate: 0.2600 },
  { layer: 37, min: 157_000_000, max: 206_000_000, rate: 0.2700 },
  { layer: 38, min: 206_000_000, max: 337_000_000, rate: 0.2800 },
  { layer: 39, min: 337_000_000, max: 454_000_000, rate: 0.2900 },
  { layer: 40, min: 454_000_000, max: 550_000_000, rate: 0.3000 },
  { layer: 41, min: 550_000_000, max: 695_000_000, rate: 0.3100 },
  { layer: 42, min: 695_000_000, max: 910_000_000, rate: 0.3200 },
  { layer: 43, min: 910_000_000, max: 1_400_000_000, rate: 0.3300 },
  { layer: 44, min: 1_400_000_000, max: Infinity, rate: 0.3400 },
];

// ── Kategori B (40 Lapisan) ──────────────────────────────────
// PTKP: TK/2, TK/3, K/1, K/2
export const TER_B_TABLE: TerLayer[] = [
  { layer: 1, min: 0, max: 6_200_000, rate: 0.0000 },
  { layer: 2, min: 6_200_000, max: 6_500_000, rate: 0.0025 },
  { layer: 3, min: 6_500_000, max: 6_850_000, rate: 0.0050 },
  { layer: 4, min: 6_850_000, max: 7_300_000, rate: 0.0075 },
  { layer: 5, min: 7_300_000, max: 9_200_000, rate: 0.0100 },
  { layer: 6, min: 9_200_000, max: 10_750_000, rate: 0.0150 },
  { layer: 7, min: 10_750_000, max: 11_250_000, rate: 0.0200 },
  { layer: 8, min: 11_250_000, max: 11_600_000, rate: 0.0250 },
  { layer: 9, min: 11_600_000, max: 12_600_000, rate: 0.0300 },
  { layer: 10, min: 12_600_000, max: 13_600_000, rate: 0.0400 },
  { layer: 11, min: 13_600_000, max: 14_950_000, rate: 0.0500 },
  { layer: 12, min: 14_950_000, max: 16_400_000, rate: 0.0600 },
  { layer: 13, min: 16_400_000, max: 18_450_000, rate: 0.0700 },
  { layer: 14, min: 18_450_000, max: 21_850_000, rate: 0.0800 },
  { layer: 15, min: 21_850_000, max: 26_000_000, rate: 0.0900 },
  { layer: 16, min: 26_000_000, max: 27_700_000, rate: 0.1000 },
  { layer: 17, min: 27_700_000, max: 29_350_000, rate: 0.1100 },
  { layer: 18, min: 29_350_000, max: 31_450_000, rate: 0.1200 },
  { layer: 19, min: 31_450_000, max: 33_950_000, rate: 0.1300 },
  { layer: 20, min: 33_950_000, max: 37_100_000, rate: 0.1400 },
  { layer: 21, min: 37_100_000, max: 41_100_000, rate: 0.1500 },
  { layer: 22, min: 41_100_000, max: 45_800_000, rate: 0.1600 },
  { layer: 23, min: 45_800_000, max: 49_500_000, rate: 0.1700 },
  { layer: 24, min: 49_500_000, max: 53_800_000, rate: 0.1800 },
  { layer: 25, min: 53_800_000, max: 58_500_000, rate: 0.1900 },
  { layer: 26, min: 58_500_000, max: 64_000_000, rate: 0.2000 },
  { layer: 27, min: 64_000_000, max: 71_000_000, rate: 0.2100 },
  { layer: 28, min: 71_000_000, max: 80_000_000, rate: 0.2200 },
  { layer: 29, min: 80_000_000, max: 93_000_000, rate: 0.2300 },
  { layer: 30, min: 93_000_000, max: 109_000_000, rate: 0.2400 },
  { layer: 31, min: 109_000_000, max: 129_000_000, rate: 0.2500 },
  { layer: 32, min: 129_000_000, max: 163_000_000, rate: 0.2600 },
  { layer: 33, min: 163_000_000, max: 211_000_000, rate: 0.2700 },
  { layer: 34, min: 211_000_000, max: 374_000_000, rate: 0.2800 },
  { layer: 35, min: 374_000_000, max: 459_000_000, rate: 0.2900 },
  { layer: 36, min: 459_000_000, max: 555_000_000, rate: 0.3000 },
  { layer: 37, min: 555_000_000, max: 704_000_000, rate: 0.3100 },
  { layer: 38, min: 704_000_000, max: 957_000_000, rate: 0.3200 },
  { layer: 39, min: 957_000_000, max: 1_405_000_000, rate: 0.3300 },
  { layer: 40, min: 1_405_000_000, max: Infinity, rate: 0.3400 },
];

// ── Kategori C (41 Lapisan) ──────────────────────────────────
// PTKP: K/3
export const TER_C_TABLE: TerLayer[] = [
  { layer: 1, min: 0, max: 6_600_000, rate: 0.0000 },
  { layer: 2, min: 6_600_000, max: 6_950_000, rate: 0.0025 },
  { layer: 3, min: 6_950_000, max: 7_350_000, rate: 0.0050 },
  { layer: 4, min: 7_350_000, max: 7_800_000, rate: 0.0075 },
  { layer: 5, min: 7_800_000, max: 8_850_000, rate: 0.0100 },
  { layer: 6, min: 8_850_000, max: 9_800_000, rate: 0.0125 },
  { layer: 7, min: 9_800_000, max: 10_950_000, rate: 0.0150 },
  { layer: 8, min: 10_950_000, max: 11_200_000, rate: 0.0175 },
  { layer: 9, min: 11_200_000, max: 12_050_000, rate: 0.0200 },
  { layer: 10, min: 12_050_000, max: 12_950_000, rate: 0.0300 },
  { layer: 11, min: 12_950_000, max: 14_150_000, rate: 0.0400 },
  { layer: 12, min: 14_150_000, max: 15_550_000, rate: 0.0500 },
  { layer: 13, min: 15_550_000, max: 17_050_000, rate: 0.0600 },
  { layer: 14, min: 17_050_000, max: 19_500_000, rate: 0.0700 },
  { layer: 15, min: 19_500_000, max: 22_700_000, rate: 0.0800 },
  { layer: 16, min: 22_700_000, max: 26_600_000, rate: 0.0900 },
  { layer: 17, min: 26_600_000, max: 28_100_000, rate: 0.1000 },
  { layer: 18, min: 28_100_000, max: 30_100_000, rate: 0.1100 },
  { layer: 19, min: 30_100_000, max: 32_600_000, rate: 0.1200 },
  { layer: 20, min: 32_600_000, max: 35_400_000, rate: 0.1300 },
  { layer: 21, min: 35_400_000, max: 38_900_000, rate: 0.1400 },
  { layer: 22, min: 38_900_000, max: 43_000_000, rate: 0.1500 },
  { layer: 23, min: 43_000_000, max: 47_400_000, rate: 0.1600 },
  { layer: 24, min: 47_400_000, max: 51_200_000, rate: 0.1700 },
  { layer: 25, min: 51_200_000, max: 55_800_000, rate: 0.1800 },
  { layer: 26, min: 55_800_000, max: 60_400_000, rate: 0.1900 },
  { layer: 27, min: 60_400_000, max: 66_700_000, rate: 0.2000 },
  { layer: 28, min: 66_700_000, max: 74_500_000, rate: 0.2100 },
  { layer: 29, min: 74_500_000, max: 83_200_000, rate: 0.2200 },
  { layer: 30, min: 83_200_000, max: 95_600_000, rate: 0.2300 },
  { layer: 31, min: 95_600_000, max: 110_000_000, rate: 0.2400 },
  { layer: 32, min: 110_000_000, max: 134_000_000, rate: 0.2500 },
  { layer: 33, min: 134_000_000, max: 169_000_000, rate: 0.2600 },
  { layer: 34, min: 169_000_000, max: 221_000_000, rate: 0.2700 },
  { layer: 35, min: 221_000_000, max: 390_000_000, rate: 0.2800 },
  { layer: 36, min: 390_000_000, max: 463_000_000, rate: 0.2900 },
  { layer: 37, min: 463_000_000, max: 561_000_000, rate: 0.3000 },
  { layer: 38, min: 561_000_000, max: 709_000_000, rate: 0.3100 },
  { layer: 39, min: 709_000_000, max: 965_000_000, rate: 0.3200 },
  { layer: 40, min: 965_000_000, max: 1_419_000_000, rate: 0.3300 },
  { layer: 41, min: 1_419_000_000, max: Infinity, rate: 0.3400 },
];

export const TER_TABLES = {
  A: TER_A_TABLE,
  B: TER_B_TABLE,
  C: TER_C_TABLE,
};

/**
 * Lookup TER rate by category and gross taxable income.
 * Condition: min < gross <= max (with min=0 for first layer).
 */
export function lookupTerRate(category: 'A' | 'B' | 'C', grossTaxableIncome: number): TerLayer {
  const table = TER_TABLES[category];
  if (!table) {
    throw new Error(`Invalid TER category: ${category}`);
  }

  for (let i = 0; i < table.length; i++) {
    const layer = table[i];
    if (i === 0) {
      if (grossTaxableIncome <= layer.max) {
        return layer;
      }
    } else {
      if (grossTaxableIncome > layer.min && grossTaxableIncome <= layer.max) {
        return layer;
      }
    }
  }

  // Fallback to highest tier if exceeding max
  return table[table.length - 1];
}
