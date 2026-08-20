/**
 * Format angka ke Rupiah: Rp 10.000.000
 */
export function formatRupiah(amount: number): string {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

/**
 * Format tanggal ke format Indonesia: 15 Agustus 2024
 */
export function formatTanggal(dateStr: string): string {
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Masking NIK untuk privasi UU PDP: 3171********0001
 */
export function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return nik || '';
  return nik.slice(0, 4) + '*'.repeat(nik.length - 8) + nik.slice(-4);
}
