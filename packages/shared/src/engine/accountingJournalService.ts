// ============================================================
// CatatGaji — Generator Jurnal Akuntansi Double-Entry Penggajian
// Standar Akuntansi Keuangan Indonesia (PSAK) & Format Ekspor
// (Jurnal by Mekari, Accurate Online, Xero, QuickBooks)
// ============================================================

export interface PayrollJournalInput {
  period_month: number;
  period_year: number;
  payout_date: string;
  currency?: string;
  items: {
    employee_name: string;
    basic_salary: number;
    allowances: number;
    overtime_pay: number;
    jkk_employer: number;
    jkm_employer: number;
    jht_employer: number;
    jp_employer: number;
    kes_employer: number;
    jht_employee: number;
    jp_employee: number;
    kes_employee: number;
    pph21_amount: number;
    loan_deduction: number;
    absence_deduction: number;
    thp: number;
  }[];
}

export interface JournalEntryLine {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string;
}

export interface PayrollJournalResult {
  transaction_date: string;
  reference_no: string;
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
  entries: JournalEntryLine[];
}

/**
 * Menghasilkan entri Jurnal Akuntansi Double-Entry Berpasangan yang 100% Seimbang
 */
export function generatePayrollJournal(input: PayrollJournalInput): PayrollJournalResult {
  let totalBasicSalary = 0;
  let totalAllowances = 0;
  let totalOvertime = 0;
  let totalJkkEmployer = 0;
  let totalJkmEmployer = 0;
  let totalJhtEmployer = 0;
  let totalJpEmployer = 0;
  let totalKesEmployer = 0;

  let totalPph21 = 0;
  let totalJhtAll = 0; // Employer + Employee
  let totalJpAll = 0;  // Employer + Employee
  let totalJkkJkm = 0; // Employer
  let totalKesAll = 0; // Employer + Employee
  let totalLoans = 0;
  let totalAbsence = 0;
  let totalThp = 0;

  for (const item of input.items) {
    totalBasicSalary += item.basic_salary;
    totalAllowances += item.allowances;
    totalOvertime += item.overtime_pay;
    totalJkkEmployer += item.jkk_employer;
    totalJkmEmployer += item.jkm_employer;
    totalJhtEmployer += item.jht_employer;
    totalJpEmployer += item.jp_employer;
    totalKesEmployer += item.kes_employer;

    totalPph21 += item.pph21_amount;
    totalJhtAll += item.jht_employer + item.jht_employee;
    totalJpAll += item.jp_employer + item.jp_employee;
    totalJkkJkm += item.jkk_employer + item.jkm_employer;
    totalKesAll += item.kes_employer + item.kes_employee;
    totalLoans += item.loan_deduction;
    totalAbsence += item.absence_deduction;
    totalThp += item.thp;
  }

  const periodLabel = `Periode ${input.period_year}-${String(input.period_month).padStart(2, '0')}`;
  const refNo = `JV/PAY/${input.period_year}${String(input.period_month).padStart(2, '0')}`;

  const entries: JournalEntryLine[] = [];

  // 1. SISI DEBIT (BEBAN / BIAYA PERUSAHAAN)
  if (totalBasicSalary > 0) {
    entries.push({
      account_code: '5-10100',
      account_name: 'Beban Gaji Pokok',
      debit: Math.round(totalBasicSalary),
      credit: 0,
      description: `Beban gaji pokok karyawan ${periodLabel}`,
    });
  }

  if (totalAllowances > 0) {
    entries.push({
      account_code: '5-10200',
      account_name: 'Beban Tunjangan Karyawan',
      debit: Math.round(totalAllowances),
      credit: 0,
      description: `Beban tunjangan tetap & tidak tetap ${periodLabel}`,
    });
  }

  if (totalOvertime > 0) {
    entries.push({
      account_code: '5-10300',
      account_name: 'Beban Upah Lembur (PP 35/2021)',
      debit: Math.round(totalOvertime),
      credit: 0,
      description: `Beban kerja lembur operasional ${periodLabel}`,
    });
  }

  const totalBpjsTkEmployer = totalJkkEmployer + totalJkmEmployer + totalJhtEmployer + totalJpEmployer;
  if (totalBpjsTkEmployer > 0) {
    entries.push({
      account_code: '5-10400',
      account_name: 'Beban BPJS Ketenagakerjaan Perusahaan (JKK, JKM, JHT, JP)',
      debit: Math.round(totalBpjsTkEmployer),
      credit: 0,
      description: `Beban jaminan sosial ketenagakerjaan porsi pemberi kerja ${periodLabel}`,
    });
  }

  if (totalKesEmployer > 0) {
    entries.push({
      account_code: '5-10500',
      account_name: 'Beban BPJS Kesehatan Perusahaan (4%)',
      debit: Math.round(totalKesEmployer),
      credit: 0,
      description: `Beban jaminan kesehatan porsi pemberi kerja 4% ${periodLabel}`,
    });
  }

  // 2. SISI KREDIT (KEWAJIBAN, POTONGAN & KAS/BANK)
  if (totalPph21 > 0) {
    entries.push({
      account_code: '2-10100',
      account_name: 'Utang Pajak PPh Pasal 21 (DJP)',
      debit: 0,
      credit: Math.round(totalPph21),
      description: `Titipan pemotongan PPh 21 TER masa ${periodLabel}`,
    });
  }

  const totalBpjsTkPayable = totalJhtAll + totalJpAll + totalJkkJkm;
  if (totalBpjsTkPayable > 0) {
    entries.push({
      account_code: '2-10200',
      account_name: 'Utang Iuran BPJS Ketenagakerjaan (SIPP Online)',
      debit: 0,
      credit: Math.round(totalBpjsTkPayable),
      description: `Titipan iuran BPJSTK (Pemberi Kerja + Pekerja) ${periodLabel}`,
    });
  }

  if (totalKesAll > 0) {
    entries.push({
      account_code: '2-10300',
      account_name: 'Utang Iuran BPJS Kesehatan (E-Dabu)',
      debit: 0,
      credit: Math.round(totalKesAll),
      description: `Titipan iuran BPJS Kesehatan 5% (4% Pers + 1% Peg) ${periodLabel}`,
    });
  }

  if (totalLoans > 0) {
    entries.push({
      account_code: '1-10500',
      account_name: 'Piutang / Pinjaman Kasbon Karyawan',
      debit: 0,
      credit: Math.round(totalLoans),
      description: `Pengembalian pinjaman/kasbon via potong gaji ${periodLabel}`,
    });
  }

  if (totalAbsence > 0) {
    entries.push({
      account_code: '5-10199',
      account_name: 'Pendapatan Lain-lain / Pengurang Beban Absensi',
      debit: 0,
      credit: Math.round(totalAbsence),
      description: `Potongan ketidakhadiran & keterlambatan karyawan ${periodLabel}`,
    });
  }

  if (totalThp > 0) {
    entries.push({
      account_code: '1-10100',
      account_name: 'Kas & Bank (Take Home Pay Transfer)',
      debit: 0,
      credit: Math.round(totalThp),
      description: `Pencairan gaji bersih (THP) seluruh karyawan ${periodLabel}`,
    });
  }

  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0);

  return {
    transaction_date: input.payout_date,
    reference_no: refNo,
    total_debit: totalDebit,
    total_credit: totalCredit,
    is_balanced: Math.abs(totalDebit - totalCredit) === 0,
    entries,
  };
}

/**
 * Konversi Jurnal ke Format CSV Jurnal by Mekari
 */
export function exportToMekariJurnalCsv(journal: PayrollJournalResult): string {
  const headers = [
    'Tanggal Transaksi',
    'Nomor Transaksi',
    'Kode Akun',
    'Nama Akun',
    'Debit',
    'Kredit',
    'Deskripsi',
  ];
  const rows = [headers.join(',')];

  for (const entry of journal.entries) {
    rows.push([
      journal.transaction_date,
      journal.reference_no,
      `"${entry.account_code}"`,
      `"${entry.account_name}"`,
      entry.debit,
      entry.credit,
      `"${entry.description}"`,
    ].join(','));
  }

  return rows.join('\r\n');
}

/**
 * Konversi Jurnal ke Format CSV Accurate Online
 */
export function exportToAccurateOnlineCsv(journal: PayrollJournalResult): string {
  const headers = [
    'TransDate',
    'TransNo',
    'AccountNo',
    'AccountName',
    'AmountDebit',
    'AmountCredit',
    'Memo',
  ];
  const rows = [headers.join(';')];

  for (const entry of journal.entries) {
    rows.push([
      journal.transaction_date,
      journal.reference_no,
      entry.account_code,
      `"${entry.account_name}"`,
      entry.debit,
      entry.credit,
      `"${entry.description}"`,
    ].join(';'));
  }

  return rows.join('\r\n');
}
