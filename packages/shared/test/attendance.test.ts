import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistance,
  verifyGeofence,
  evaluateClockIn,
  calculateAttendanceDeduction,
  parseFingerprintCsv,
} from '../src/engine/attendanceService';

describe('Attendance & Geofencing Engine Tests', () => {
  // Koordinat Monas, Jakarta: -6.1753924, 106.8271528
  const monasLat = -6.1753924;
  const monasLon = 106.8271528;

  describe('1. Haversine Formula & Geofencing', () => {
    it('should calculate distance 0 for identical points', () => {
      const dist = calculateHaversineDistance(monasLat, monasLon, monasLat, monasLon);
      expect(dist).toBe(0);
    });

    it('should calculate accurate distance between 2 nearby coordinates (~55m apart)', () => {
      // Titik berjarak ~55 meter dari Monas
      const nearbyLat = -6.17589;
      const nearbyLon = 106.8271528;
      const dist = calculateHaversineDistance(monasLat, monasLon, nearbyLat, nearbyLon);

      expect(dist).toBeGreaterThan(50);
      expect(dist).toBeLessThan(60);
    });

    it('should verify geofence within 100m radius', () => {
      const nearbyLat = -6.17589;
      const nearbyLon = 106.8271528;

      const result = verifyGeofence(monasLat, monasLon, nearbyLat, nearbyLon, 100);
      expect(result.isWithinRadius).toBe(true);
      expect(result.distanceMeters).toBeLessThan(100);
    });

    it('should reject clock-in outside geofence radius', () => {
      // Titik di Bandung (~120 km dari Jakarta)
      const bandungLat = -6.9175;
      const bandungLon = 107.6191;

      const result = verifyGeofence(bandungLat, bandungLon, monasLat, monasLon, 100);
      expect(result.isWithinRadius).toBe(false);
      expect(result.distanceMeters).toBeGreaterThan(100000);
    });
  });

  describe('2. Clock-In & Late Evaluation', () => {
    it('should accept on-time arrival within grace period', () => {
      // Shift 08:30, datang 08:40 (10 menit terlambat, toleransi 15 menit)
      const clockIn = new Date('2026-08-20T08:40:00');
      const evalResult = evaluateClockIn(clockIn, '08:30', 15);

      expect(evalResult.isLate).toBe(false);
      expect(evalResult.lateMinutes).toBe(0);
    });

    it('should flag late arrival beyond grace period', () => {
      // Shift 08:30, datang 09:05 (35 menit terlambat)
      const clockIn = new Date('2026-08-20T09:05:00');
      const evalResult = evaluateClockIn(clockIn, '08:30', 15);

      expect(evalResult.isLate).toBe(true);
      expect(evalResult.lateMinutes).toBe(35);
    });
  });

  describe('3. Attendance Deduction Calculations', () => {
    const dailySalary = 200000; // Rp 200.000 / hari

    it('should calculate prorata deduction based on late minutes', () => {
      // Terlambat 60 menit dari 8 jam kerja (480 menit)
      // Potongan = (60 / 480) * 200.000 = Rp 25.000
      const deduction = calculateAttendanceDeduction(60, dailySalary, 'PRORATA_TIME', 0, 8);
      expect(deduction).toBe(25000);
    });

    it('should apply flat penalty scheme', () => {
      const deduction = calculateAttendanceDeduction(30, dailySalary, 'FLAT_PENALTY', 50000);
      expect(deduction).toBe(50000);
    });

    it('should return 0 deduction if late minutes is 0', () => {
      const deduction = calculateAttendanceDeduction(0, dailySalary);
      expect(deduction).toBe(0);
    });
  });

  describe('4. Fingerprint CSV Parsing & Deduplication', () => {
    const sampleCsv = `
      PIN,DateTime,Status
      101,2026-08-20 08:00:00,IN
      101,2026-08-20 08:02:00,IN
      101,2026-08-20 17:05:00,OUT
      102,2026-08-20 08:15:00,IN
    `.trim();

    it('should parse csv lines and deduplicate records within 5 minutes', () => {
      const records = parseFingerprintCsv(sampleCsv);

      // Record 101 pada 08:02 harus dibuang karena duplikat dengan 08:00
      expect(records.length).toBe(3);

      // Urutan kronologis:
      // 1. PIN 101 jam 08:00 (IN)
      expect(records[0].pin).toBe('101');
      expect(records[0].type).toBe('IN');
      expect(records[0].date).toBe('2026-08-20');

      // 2. PIN 102 jam 08:15 (IN)
      expect(records[1].pin).toBe('102');
      expect(records[1].type).toBe('IN');

      // 3. PIN 101 jam 17:05 (OUT)
      expect(records[2].pin).toBe('101');
      expect(records[2].type).toBe('OUT');
    });
  });
});
