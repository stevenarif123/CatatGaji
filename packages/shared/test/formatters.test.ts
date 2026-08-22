import { describe, it, expect } from 'vitest';
import {
  formatRupiah,
  formatTanggal,
  formatTanggalHari,
  formatTanggalSingkat,
  formatPeriodeBulan,
  formatJam,
  hitungJumlahHari,
  hitungTanggalSelesai,
  hitungDurasiJam,
  maskNik,
} from '../src/formatters';

describe('Indonesian Date & Time Formatter & Auto-Calculator Tests', () => {
  it('harus memformat tanggal ke format Indonesia baku', () => {
    expect(formatTanggal('2026-08-22')).toBe('22 Agustus 2026');
    expect(formatTanggal('2026-01-05')).toBe('5 Januari 2026');
    expect(formatTanggal('2026-12-31')).toBe('31 Desember 2026');
  });

  it('harus memformat tanggal lengkap dengan nama hari Indonesia', () => {
    expect(formatTanggalHari('2026-08-22')).toBe('Sabtu, 22 Agustus 2026');
    expect(formatTanggalHari('2026-08-17')).toBe('Senin, 17 Agustus 2026');
  });

  it('harus memformat tanggal singkat standar Indonesia DD/MM/YYYY', () => {
    expect(formatTanggalSingkat('2026-08-22')).toBe('22/08/2026');
    expect(formatTanggalSingkat('2026-01-09')).toBe('09/01/2026');
  });

  it('harus memformat periode bulan dan tahun', () => {
    expect(formatPeriodeBulan(2026, 8)).toBe('Agustus 2026');
    expect(formatPeriodeBulan(2026, 12)).toBe('Desember 2026');
  });

  it('harus memformat jam dengan standar WIB', () => {
    expect(formatJam('08:30:00')).toBe('08:30 WIB');
    expect(formatJam('17:00')).toBe('17:00 WIB');
  });

  it('harus menghitung jumlah hari inklusif secara otomatis dan akurat', () => {
    // 22 Agustus s.d 22 Agustus = 1 hari
    expect(hitungJumlahHari('2026-08-22', '2026-08-22')).toBe(1);
    // 22 Agustus s.d 24 Agustus = 3 hari (22, 23, 24)
    expect(hitungJumlahHari('2026-08-22', '2026-08-24')).toBe(3);
    // Cuti 1 minggu (22 s.d 28 Agustus) = 7 hari
    expect(hitungJumlahHari('2026-08-22', '2026-08-28')).toBe(7);
  });

  it('harus menghitung tanggal selesai secara otomatis berdasarkan tanggal mulai dan jumlah hari', () => {
    // Mulai 22 Agustus, durasi 1 hari -> selesai 22 Agustus
    expect(hitungTanggalSelesai('2026-08-22', 1)).toBe('2026-08-22');
    // Mulai 22 Agustus, durasi 3 hari -> selesai 24 Agustus
    expect(hitungTanggalSelesai('2026-08-22', 3)).toBe('2026-08-24');
    // Mulai 28 Agustus, durasi 5 hari -> selesai 1 September
    expect(hitungTanggalSelesai('2026-08-28', 5)).toBe('2026-09-01');
  });

  it('harus menghitung durasi jam lembur secara otomatis', () => {
    // 18:00 s.d 21:00 = 3 jam
    expect(hitungDurasiJam('18:00', '21:00')).toBe(3);
    // 18:00 s.d 21:30 = 3.5 jam
    expect(hitungDurasiJam('18:00', '21:30')).toBe(3.5);
    // Lintas hari 22:00 s.d 02:00 = 4 jam
    expect(hitungDurasiJam('22:00', '02:00', true)).toBe(4);
  });

  it('harus memformat Rupiah dan masking NIK sesuai UU PDP', () => {
    expect(formatRupiah(15000000)).toBe('Rp 15.000.000');
    expect(maskNik('3171012345670001')).toBe('3171********0001');
  });
});
