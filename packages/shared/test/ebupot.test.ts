import { describe, it, expect } from 'vitest';
import {
  generateEbupotMonthlyCsv,
  generate1721A1AnnualCsv,
} from '../src/engine/ebupotExportService';

describe('DJP Online e-Bupot 21/26 CSV Export Engine Tests', () => {
  it('1. should generate valid DJP Monthly e-Bupot CSV formatted with semicolons', () => {
    const csv = generateEbupotMonthlyCsv({
      tax_year: 2026,
      tax_month: 8,
      pembetulan: 0,
      company_npwp: '01.234.567.8-901.000',
      company_name: 'PT Maju Bersama',
      signatory_nik_npwp: '3171012305950001',
      signatory_name: 'Budi Santoso',
      payout_date: '2026-08-25',
      items: [
        {
          nik_ktp: '3171012305950001',
          npwp: '09.876.543.2-100.000',
          employee_name: 'Ahmad Fauzi',
          gross_taxable: 6000000,
          pph21_amount: 45000,
          ptkp_status: 'TK/0',
          ter_category: 'TER_A',
          ter_rate_percent: 0.75,
        },
      ],
    });

    const lines = csv.split('\r\n');
    expect(lines.length).toBe(2);

    // Header check
    expect(lines[0]).toContain('MasaPajak;TahunPajak;Pembetulan;NPWPPemotong');

    // Row check
    const cols = lines[1].split(';');
    expect(cols[0]).toBe('08'); // Masa 08
    expect(cols[1]).toBe('2026'); // Tahun 2026
    expect(cols[3]).toBe('012345678901000'); // Cleaned NPWP Badan
    expect(cols[4]).toBe('PT Maju Bersama'); // Company Name
    expect(cols[6]).toBe('Ahmad Fauzi'); // Employee Name
    expect(cols[7]).toBe('21-100-01'); // Kode Objek Pajak Pegawai Tetap
    expect(cols[8]).toBe('6000000'); // Bruto
    expect(cols[10]).toBe('45000'); // PPh 21
  });

  it('2. should generate valid Form 1721-A1 Annual CSV', () => {
    const csv = generate1721A1AnnualCsv({
      tax_year: 2026,
      company_npwp: '01.234.567.8-901.000',
      company_name: 'PT Maju Bersama',
      signatory_nik_npwp: '3171012305950001',
      signatory_name: 'Budi Santoso',
      items: [
        {
          employee_name: 'Ahmad Fauzi',
          nik_ktp: '3171012305950001',
          npwp: '09.876.543.2-100.000',
          ptkp_status: 'TK/0',
          months_count: 12,
          annual_gross_taxable: 72000000,
          biaya_jabatan: 3600000,
          annual_jht_jp_employee: 2160000,
          annual_net_income: 66240000,
          ptkp_amount: 54000000,
          pkp_rounded: 12240000,
          total_pph21_annual: 612000,
          pph21_withheld: 540000,
          pph21_difference: 72000,
        },
      ],
    });

    const lines = csv.split('\r\n');
    expect(lines.length).toBe(2);

    expect(lines[0]).toContain('TahunPajak;NPWPPemotong;NamaPemotong');
    const cols = lines[1].split(';');
    expect(cols[0]).toBe('2026');
    expect(cols[5]).toBe('Ahmad Fauzi');
    expect(cols[8]).toBe('72000000');
    expect(cols[14]).toBe('612000'); // PPh 21 Setahun
    expect(cols[16]).toBe('72000'); // Selisih Desember
  });
});
