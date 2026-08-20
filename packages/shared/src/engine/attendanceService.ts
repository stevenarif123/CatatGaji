// ============================================================
// CatatGaji — Attendance & Geofencing Engine
// Rumus Trigonometri Haversine & Evaluasi Jam Kerja Sesuai PP 35/2021
// ============================================================

/**
 * Menghitung jarak antara 2 titik koordinat bumi (Latitude/Longitude)
 * menggunakan rumus trigonometri bola bumi (Haversine Formula).
 * Radius rata-rata bumi = 6.371.000 meter.
 *
 * @param lat1 Latitude titik asal (user) dalam derajat
 * @param lon1 Longitude titik asal (user) dalam derajat
 * @param lat2 Latitude titik tujuan (kantor/cabang) dalam derajat
 * @param lon2 Longitude titik tujuan (kantor/cabang) dalam derajat
 * @returns Jarak dalam meter (dibulatkan ke 2 desimal)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius bumi dalam meter
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Memvalidasi apakah karyawan berada di dalam radius geofencing cabang kantor.
 */
export function verifyGeofence(
  userLat: number,
  userLon: number,
  branchLat: number,
  branchLon: number,
  maxRadiusMeters: number = 100
): { isWithinRadius: boolean; distanceMeters: number } {
  const distanceMeters = calculateHaversineDistance(userLat, userLon, branchLat, branchLon);
  return {
    isWithinRadius: distanceMeters <= maxRadiusMeters,
    distanceMeters,
  };
}

/**
 * Mengevaluasi jam masuk kerja vs jam jadwal shift untuk menentukan keterlambatan.
 *
 * @param clockInTime Stempel waktu jam masuk (Date)
 * @param shiftStartTime Waktu mulai shift format "HH:mm" atau "HH:mm:ss"
 * @param gracePeriodMins Masa toleransi keterlambatan dalam menit (default: 15)
 */
export function evaluateClockIn(
  clockInTime: Date,
  shiftStartTime: string,
  gracePeriodMins: number = 15
): { isLate: boolean; lateMinutes: number } {
  const [shiftHours, shiftMinutes] = shiftStartTime.split(':').map(Number);

  const shiftTarget = new Date(clockInTime);
  shiftTarget.setHours(shiftHours, shiftMinutes, 0, 0);

  const diffMs = clockInTime.getTime() - shiftTarget.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes > gracePeriodMins) {
    return {
      isLate: true,
      lateMinutes: diffMinutes,
    };
  }

  return {
    isLate: false,
    lateMinutes: 0,
  };
}

/**
 * Menghitung potongan keterlambatan / ketidakhadiran sesuai kebijakan perusahaan.
 */
export function calculateAttendanceDeduction(
  lateMinutes: number,
  dailyBasicSalary: number,
  scheme: 'PRORATA_TIME' | 'FLAT_PENALTY' | 'FORFEIT_ALLOWANCE' = 'PRORATA_TIME',
  flatPenaltyAmount: number = 25000,
  dailyWorkHours: number = 8
): number {
  if (lateMinutes <= 0) return 0;

  switch (scheme) {
    case 'PRORATA_TIME': {
      // Potongan = (Menit Terlambat / Total Menit Kerja Harian) * Gaji Harian
      const totalWorkMinutes = dailyWorkHours * 60;
      const deduction = (lateMinutes / totalWorkMinutes) * dailyBasicSalary;
      return Math.round(Math.min(deduction, dailyBasicSalary));
    }
    case 'FLAT_PENALTY': {
      return flatPenaltyAmount;
    }
    case 'FORFEIT_ALLOWANCE': {
      return flatPenaltyAmount; // Contoh: potong tunjangan harian sebesar flat amount
    }
    default:
      return 0;
  }
}

/**
 * Parser Log Mesin Fingerprint Biometrik (CSV format ZKTeco/Solution/Fingerspot).
 * Otomatis membersihkan duplikasi log kehadiran dalam jendela waktu toleransi 5 menit.
 */
export function parseFingerprintCsv(
  csvContent: string
): Array<{ pin: string; date: string; time: string; timestamp: Date; type: 'IN' | 'OUT' }> {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) return [];

  const records: Array<{ pin: string; date: string; time: string; timestamp: Date; type: 'IN' | 'OUT' }> = [];

  // Mendeteksi header
  const header = lines[0].toLowerCase();
  const isHeaderPresent = header.includes('pin') || header.includes('nik') || header.includes('time') || header.includes('waktu');
  const dataLines = isHeaderPresent ? lines.slice(1) : lines;

  for (const line of dataLines) {
    // Format umum: PIN,DateTime,Status (atau PIN,Date,Time,Status)
    const cols = line.split(/[,;\t]/).map((c) => c.replace(/["']/g, '').trim());
    if (cols.length < 2) continue;

    const pin = cols[0];
    let timestamp: Date | null = null;
    let type: 'IN' | 'OUT' = 'IN';

    if (cols.length >= 3 && cols[1].includes('-') && cols[2].includes(':')) {
      // Format: PIN, 2026-08-20, 08:05:00, IN
      timestamp = new Date(`${cols[1]}T${cols[2]}`);
      if (cols[3] && cols[3].toUpperCase().includes('OUT')) {
        type = 'OUT';
      }
    } else if (cols[1].includes(' ') || cols[1].includes('T')) {
      // Format: PIN, 2026-08-20 08:05:00
      timestamp = new Date(cols[1].replace(' ', 'T'));
      if (cols[2] && cols[2].toUpperCase().includes('OUT')) {
        type = 'OUT';
      }
    }

    if (timestamp && !isNaN(timestamp.getTime())) {
      const dateStr = timestamp.toISOString().split('T')[0];
      const timeStr = timestamp.toTimeString().split(' ')[0];
      records.push({ pin, date: dateStr, time: timeStr, timestamp, type });
    }
  }

  // Urutkan berdasarkan waktu
  records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Hapus log duplikat dalam toleransi 5 menit untuk PIN yang sama
  const cleaned: typeof records = [];
  for (const rec of records) {
    const last = cleaned.find(
      (c) => c.pin === rec.pin && Math.abs(c.timestamp.getTime() - rec.timestamp.getTime()) < 5 * 60 * 1000
    );
    if (!last) {
      cleaned.push(rec);
    }
  }

  return cleaned;
}
