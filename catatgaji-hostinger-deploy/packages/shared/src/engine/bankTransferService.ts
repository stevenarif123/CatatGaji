// ============================================================
// CatatGaji — Generator Berkas Batch Transfer Bank Penggajian
// Mendukung Format Bank Payroll Indonesia (BCA, Mandiri, BRI, BNI)
// ============================================================

export interface BankTransferEmployeeItem {
  employee_name: string;
  bank_name: string;
  bank_account_no: string;
  amount: number;
  email?: string | null;
  notes?: string;
}

export interface BankBatchExportInput {
  company_name: string;
  period_year: number;
  period_month: number;
  payout_date: string;
  items: BankTransferEmployeeItem[];
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Menghasilkan Berkas CSV Batch Payroll Bank Standar Indonesia
 */
export function generateBankPayrollCsv(input: BankBatchExportInput): string {
  const headers = [
    'NomorRekeningTujuan',
    'NamaPenerima',
    'NamaBank',
    'NominalTransfer',
    'BeritaAcaraTransfer',
    'EmailNotifikasi',
  ];

  const rows = [headers.join(',')];
  const beritaDefault = `Gaji ${input.period_year}-${String(input.period_month).padStart(2, '0')}`;

  for (const item of input.items) {
    const row = [
      escapeCsv(item.bank_account_no || '0000000000'),
      escapeCsv(item.employee_name),
      escapeCsv(item.bank_name || 'BCA'),
      escapeCsv(Math.round(item.amount)),
      escapeCsv(item.notes || beritaDefault),
      escapeCsv(item.email || ''),
    ];

    rows.push(row.join(','));
  }

  return rows.join('\r\n');
}
