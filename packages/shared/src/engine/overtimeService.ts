import { OVERTIME_HOURLY_DIVISOR } from '../constants';

export type OvertimeDayType = 'WORKDAY' | 'HOLIDAY_5DAY' | 'HOLIDAY_6DAY';

export interface OvertimeEntryInput {
  hours: number;
  dayType: OvertimeDayType;
}

export interface OvertimeResult {
  hourly_rate: number;
  multiplier_hours: number;
  total_overtime_pay: number;
}

/**
 * Calculate effective multiplier hours for a single overtime session
 * based on PP No. 35 Tahun 2021 Pasal 31
 */
export function calculateOvertimeMultiplierHours(hours: number, dayType: OvertimeDayType): number {
  if (hours <= 0) return 0;

  if (dayType === 'WORKDAY') {
    // 1st hour = 1.5x, 2nd+ hour = 2.0x
    const firstHour = Math.min(hours, 1);
    const remainingHours = Math.max(0, hours - 1);
    return firstHour * 1.5 + remainingHours * 2.0;
  }

  if (dayType === 'HOLIDAY_5DAY') {
    // 5-day week on holiday: 1-8h = 2.0x, 9th h = 3.0x, 10h+ = 4.0x
    let mult = 0;
    const h1_8 = Math.min(hours, 8);
    mult += h1_8 * 2.0;

    if (hours > 8) {
      const h9 = Math.min(hours - 8, 1);
      mult += h9 * 3.0;
    }
    if (hours > 9) {
      const h10plus = hours - 9;
      mult += h10plus * 4.0;
    }
    return mult;
  }

  if (dayType === 'HOLIDAY_6DAY') {
    // 6-day week on holiday: 1-7h = 2.0x, 8th h = 3.0x, 9h+ = 4.0x
    let mult = 0;
    const h1_7 = Math.min(hours, 7);
    mult += h1_7 * 2.0;

    if (hours > 7) {
      const h8 = Math.min(hours - 7, 1);
      mult += h8 * 3.0;
    }
    if (hours > 8) {
      const h9plus = hours - 8;
      mult += h9plus * 4.0;
    }
    return mult;
  }

  return hours;
}

/**
 * Calculate total overtime pay given monthly fixed wage basis and list of overtime entries
 * Formula: Total Overtime Pay = Sum(Multiplier Hours) * (Wage Basis / 173)
 */
export function calculateOvertime(
  monthlyWageBasis: number,
  entries: OvertimeEntryInput[]
): OvertimeResult {
  const hourly_rate = monthlyWageBasis / OVERTIME_HOURLY_DIVISOR;

  let multiplier_hours = 0;
  for (const entry of entries) {
    multiplier_hours += calculateOvertimeMultiplierHours(entry.hours, entry.dayType);
  }

  const total_overtime_pay = Math.round(multiplier_hours * hourly_rate);

  return {
    hourly_rate,
    multiplier_hours,
    total_overtime_pay,
  };
}
