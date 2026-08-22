/**
 * Nama bulan dalam Bahasa Indonesia baku
 */
export const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Nama hari dalam Bahasa Indonesia baku
 */
export const HARI_INDONESIA = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

/**
 * Format angka nominal ke Rupiah: Rp 10.000.000
 */
export function formatRupiah(amount: number): string {
  return 'Rp ' + Math.round(amount || 0).toLocaleString('id-ID');
}

/**
 * Parsing aman YYYY-MM-DD menjadi objek { year, month (1-12), day }
 * Mencegah pergeseran timezone UTC
 */
export function parseDateParts(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr) return null;
  const clean = dateStr.split('T')[0];
  const parts = clean.split('-');
  if (parts.length < 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

/**
 * Format tanggal ke standar Indonesia: "22 Agustus 2026"
 */
export function formatTanggal(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = parseDateParts(dateStr);
  if (!parts) return dateStr;
  const monthName = BULAN_INDONESIA[parts.month - 1] || '';
  return `${parts.day} ${monthName} ${parts.year}`;
}

/**
 * Format tanggal lengkap dengan hari: "Sabtu, 22 Agustus 2026"
 */
export function formatTanggalHari(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = parseDateParts(dateStr);
  if (!parts) return dateStr;
  const d = new Date(parts.year, parts.month - 1, parts.day);
  const dayName = HARI_INDONESIA[d.getDay()];
  const monthName = BULAN_INDONESIA[parts.month - 1] || '';
  return `${dayName}, ${parts.day} ${monthName} ${parts.year}`;
}

/**
 * Format tanggal singkat standar Indonesia: "22/08/2026" (DD/MM/YYYY)
 */
export function formatTanggalSingkat(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = parseDateParts(dateStr);
  if (!parts) return dateStr;
  const dd = String(parts.day).padStart(2, '0');
  const mm = String(parts.month).padStart(2, '0');
  return `${dd}/${mm}/${parts.year}`;
}

/**
 * Format periode bulan tahun: "Agustus 2026"
 */
export function formatPeriodeBulan(year: number, month: number): string {
  const monthName = BULAN_INDONESIA[month - 1] || `Bulan ${month}`;
  return `${monthName} ${year}`;
}

/**
 * Format jam dan menit dengan zona waktu: "08:30 WIB"
 */
export function formatJam(timeStr: string): string {
  if (!timeStr) return '-';
  const clean = timeStr.slice(0, 5);
  return `${clean} WIB`;
}

/**
 * Menghitung selisih hari inklusif antara 2 tanggal (start_date dan end_date)
 * Contoh: 2026-08-22 s.d 2026-08-24 -> 3 hari
 */
export function hitungJumlahHari(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const start = parseDateParts(startDate);
  const end = parseDateParts(endDate);
  if (!start || !end) return 1;

  const d1 = new Date(Date.UTC(start.year, start.month - 1, start.day));
  const d2 = new Date(Date.UTC(end.year, end.month - 1, end.day));

  const diffMs = d2.getTime() - d1.getTime();
  if (diffMs < 0) return 1;

  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
}

/**
 * Menghitung tanggal selesai berdasarkan tanggal mulai dan jumlah hari (inklusif)
 * Contoh: mulai 2026-08-22, durasi 3 hari -> selesai 2026-08-24
 */
export function hitungTanggalSelesai(startDate: string, daysCount: number): string {
  if (!startDate) return '';
  const days = Math.max(1, Math.floor(daysCount) || 1);
  const start = parseDateParts(startDate);
  if (!start) return startDate;

  const d = new Date(Date.UTC(start.year, start.month - 1, start.day));
  d.setUTCDate(d.getUTCDate() + (days - 1));

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Menghitung durasi jam antara jam mulai dan jam selesai (format "HH:mm")
 * Contoh: "18:00" s.d "21:30" -> 3.5 jam
 */
export function hitungDurasiJam(startTime: string, endTime: string, crossDay: boolean = false): number {
  if (!startTime || !endTime) return 0;
  const [h1, m1] = startTime.split(':').map((n) => parseInt(n, 10) || 0);
  const [h2, m2] = endTime.split(':').map((n) => parseInt(n, 10) || 0);

  let mins1 = h1 * 60 + m1;
  let mins2 = h2 * 60 + m2;

  if (mins2 < mins1 || crossDay) {
    mins2 += 24 * 60;
  }

  const diffMins = mins2 - mins1;
  if (diffMins <= 0) return 0;

  return Math.round((diffMins / 60) * 10) / 10;
}

/**
 * Masking NIK untuk privasi UU PDP: 3171********0001
 */
export function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return nik || '';
  return nik.slice(0, 4) + '*'.repeat(nik.length - 8) + nik.slice(-4);
}
