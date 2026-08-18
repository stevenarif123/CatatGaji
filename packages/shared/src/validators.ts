// ============================================================
// Input Validators — NIK, NPWP, BPJS
// Trust boundary: validate at API entry point
// ============================================================

/**
 * NIK KTP: exactly 16 digits.
 * Digit 1-6: kode wilayah (provinsi/kota/kecamatan)
 * Digit 7-12: tanggal lahir (DDMMYY, wanita +40 pada DD)
 * Digit 13-16: nomor urut registrasi
 */
export function validateNik(nik: string): { valid: boolean; error?: string } {
  if (!/^\d{16}$/.test(nik)) {
    return { valid: false, error: 'NIK harus 16 digit angka' };
  }
  // Basic: tanggal lahir check (DD = 01-31 or 41-71 for female)
  const dd = parseInt(nik.slice(6, 8), 10);
  if (!((dd >= 1 && dd <= 31) || (dd >= 41 && dd <= 71))) {
    return { valid: false, error: 'Format tanggal lahir NIK tidak valid' };
  }
  const mm = parseInt(nik.slice(8, 10), 10);
  if (mm < 1 || mm > 12) {
    return { valid: false, error: 'Format bulan lahir NIK tidak valid' };
  }
  return { valid: true };
}

/**
 * NPWP: 15 digit (format lama) atau 16 digit (format baru = NIK).
 * Format lama: XX.XXX.XXX.X-XXX.XXX (15 digit tanpa separator)
 */
export function validateNpwp(npwp: string): { valid: boolean; error?: string } {
  const digits = npwp.replace(/[.\-]/g, '');
  if (digits.length !== 15 && digits.length !== 16) {
    return { valid: false, error: 'NPWP harus 15 digit (lama) atau 16 digit (baru/NIK)' };
  }
  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: 'NPWP hanya boleh berisi angka' };
  }
  return { valid: true };
}

/**
 * BPJS Ketenagakerjaan (KPJ): 11 digit
 */
export function validateBpjsTk(no: string): { valid: boolean; error?: string } {
  if (!/^\d{11}$/.test(no)) {
    return { valid: false, error: 'No BPJS Ketenagakerjaan harus 11 digit angka' };
  }
  return { valid: true };
}

/**
 * BPJS Kesehatan: 13 digit
 */
export function validateBpjsKes(no: string): { valid: boolean; error?: string } {
  if (!/^\d{13}$/.test(no)) {
    return { valid: false, error: 'No BPJS Kesehatan harus 13 digit angka' };
  }
  return { valid: true };
}

/**
 * Email: basic RFC-ish check
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Format email tidak valid' };
  }
  return { valid: true };
}

/**
 * PIN: exactly 6 digits
 */
export function validatePin(pin: string): { valid: boolean; error?: string } {
  if (!/^\d{6}$/.test(pin)) {
    return { valid: false, error: 'PIN harus 6 digit angka' };
  }
  return { valid: true };
}
