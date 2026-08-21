import { describe, it, expect } from 'vitest';
import {
  generatePayrollJournal,
  exportToMekariJurnalCsv,
  exportToAccurateOnlineCsv,
} from '../src/engine/accountingJournalService';
import {
  generateBpjsTkSippCsv,
  generateBpjsKesEdabuCsv,
} from '../src/engine/bpjsReportService';
import {
  generateBankPayrollCsv,
} from '../src/engine/bankTransferService';

describe('Accounting Journal, BPJS & Bank Reports Engine Tests', () => {
  const sampleItems = [
    {
      employee_name: 'Budi Prasetyo',
      basic_salary: 8000000,
      allowances: 1000000,
      overtime_pay: 500000,
      jkk_employer: 19200,
      jkm_employer: 24000,
      jht_employer: 296000,
      jp_employer: 160000,
      kes_employer: 320000,
      jht_employee: 160000,
      jp_employee: 80000,
      kes_employee: 80000,
      pph21_amount: 142500,
      loan_deduction: 200000,
      absence_deduction: 0,
      thp: 8837500,
    },
  ];

  it('1. should generate a strictly BALANCED (Debit = Credit) double-entry payroll journal', () => {
    const journal = generatePayrollJournal({
      period_month: 8,
      period_year: 2026,
      payout_date: '2026-08-25',
      items: sampleItems,
    });

    expect(journal.is_balanced).toBe(true);
    expect(journal.total_debit).toBe(journal.total_credit);
    expect(journal.total_debit).toBeGreaterThan(0);

    // Verify key accounts exist
    const accountCodes = journal.entries.map((e) => e.account_code);
    expect(accountCodes).toContain('5-10100'); // Beban Gaji Pokok
    expect(accountCodes).toContain('2-10100'); // Utang PPh 21
    expect(accountCodes).toContain('1-10100'); // Kas & Bank (THP)
  });

  it('2. should format Mekari Jurnal & Accurate Online CSV exports cleanly', () => {
    const journal = generatePayrollJournal({
      period_month: 8,
      period_year: 2026,
      payout_date: '2026-08-25',
      items: sampleItems,
    });

    const mekariCsv = exportToMekariJurnalCsv(journal);
    expect(mekariCsv).toContain('Tanggal Transaksi,Nomor Transaksi,Kode Akun');

    const accurateCsv = exportToAccurateOnlineCsv(journal);
    expect(accurateCsv).toContain('TransDate;TransNo;AccountNo;AccountName');
  });

  it('3. should generate BPJS TK SIPP Online & BPJS Kes E-Dabu CSV exports', () => {
    const tkCsv = generateBpjsTkSippCsv({
      company_name: 'PT Maju Bersama',
      period_year: 2026,
      period_month: 8,
      items: [
        {
          employee_id: 'emp-1',
          employee_name: 'Budi Prasetyo',
          nik_ktp: '3171012305950001',
          bpjs_tk_number: '12345678901',
          bpjs_kes_number: '0001234567890',
          basis_salary: 8000000,
          jkk_employer: 19200,
          jkm_employer: 24000,
          jht_employer: 296000,
          jht_employee: 160000,
          jp_employer: 160000,
          jp_employee: 80000,
          kes_employer: 320000,
          kes_employee: 80000,
        },
      ],
    });

    expect(tkCsv).toContain('NoKPJ;NIK;NamaTenagaKerja;UpahDilaporkan;IuranJKK');
    expect(tkCsv).toContain('12345678901;3171012305950001;Budi Prasetyo');

    const kesCsv = generateBpjsKesEdabuCsv({
      company_name: 'PT Maju Bersama',
      period_year: 2026,
      period_month: 8,
      items: [
        {
          employee_id: 'emp-1',
          employee_name: 'Budi Prasetyo',
          nik_ktp: '3171012305950001',
          bpjs_tk_number: '12345678901',
          bpjs_kes_number: '0001234567890',
          basis_salary: 8000000,
          jkk_employer: 19200,
          jkm_employer: 24000,
          jht_employer: 296000,
          jht_employee: 160000,
          jp_employer: 160000,
          jp_employee: 80000,
          kes_employer: 320000,
          kes_employee: 80000,
        },
      ],
    });

    expect(kesCsv).toContain('NoKartuBPJSKes;NIK;NamaPeserta;DasarPerhitunganUpah');
    expect(kesCsv).toContain('0001234567890;3171012305950001;Budi Prasetyo;8000000;320000;80000;400000');
  });

  it('4. should generate Bank Batch Payroll Transfer CSV', () => {
    const bankCsv = generateBankPayrollCsv({
      company_name: 'PT Maju Bersama',
      period_year: 2026,
      period_month: 8,
      payout_date: '2026-08-25',
      items: [
        {
          employee_name: 'Budi Prasetyo',
          bank_name: 'BCA',
          bank_account_no: '8830123456',
          amount: 8837500,
          email: 'budi@company.id',
        },
      ],
    });

    expect(bankCsv).toContain('NomorRekeningTujuan,NamaPenerima,NamaBank,NominalTransfer');
    expect(bankCsv).toContain('8830123456,Budi Prasetyo,BCA,8837500');
  });
});
