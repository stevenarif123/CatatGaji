// ============================================================
// CatatGaji — Generator Rekapitulasi & Ekspor Laporan Iuran BPJS
// (BPJS Ketenagakerjaan SIPP Online & BPJS Kesehatan E-Dabu)
// ============================================================

export interface BpjsEmployeeItem {
  employee_id: string;
  employee_name: string;
  nik_ktp: string;
  bpjs_tk_number?: string | null;
  bpjs_kes_number?: string | null;
  basis_salary: number;
  jkk_employer: number;
  jkm_employer: number;
  jht_employer: number;
  jht_employee: number;
  jp_employer: number;
  jp_employee: number;
  kes_employer: number;
  kes_employee: number;
}

export interface BpjsReportExportInput {
  company_name: string;
  company_bpjs_tk_code?: string;
  period_year: number;
  period_month: number;
  items: BpjsEmployeeItem[];
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(';') || str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Menghasilkan Berkas CSV Rekapitulasi Iuran BPJS Ketenagakerjaan (SIPP Online / Formulir F2A)
 */
export function generateBpjsTkSippCsv(input: BpjsReportExportInput): string {
  const headers = [
    'NoKPJ',
    'NIK',
    'NamaTenagaKerja',
    'UpahDilaporkan',
    'IuranJKK',
    'IuranJKM',
    'IuranJHTPemberiKerja',
    'IuranJHTPekerja',
    'IuranJPPemberiKerja',
    'IuranJPPekerja',
    'TotalIuranBPJSTK',
  ];

  const rows = [headers.join(';')];

  for (const item of input.items) {
    const totalItem =
      item.jkk_employer +
      item.jkm_employer +
      item.jht_employer +
      item.jht_employee +
      item.jp_employer +
      item.jp_employee;

    const row = [
      escapeCsv(item.bpjs_tk_number || '00000000000'),
      escapeCsv(item.nik_ktp),
      escapeCsv(item.employee_name),
      escapeCsv(Math.round(item.basis_salary)),
      escapeCsv(Math.round(item.jkk_employer)),
      escapeCsv(Math.round(item.jkm_employer)),
      escapeCsv(Math.round(item.jht_employer)),
      escapeCsv(Math.round(item.jht_employee)),
      escapeCsv(Math.round(item.jp_employer)),
      escapeCsv(Math.round(item.jp_employee)),
      escapeCsv(Math.round(totalItem)),
    ];

    rows.push(row.join(';'));
  }

  return rows.join('\r\n');
}

/**
 * Menghasilkan Berkas CSV Rekapitulasi Iuran BPJS Kesehatan (E-Dabu)
 */
export function generateBpjsKesEdabuCsv(input: BpjsReportExportInput): string {
  const headers = [
    'NoKartuBPJSKes',
    'NIK',
    'NamaPeserta',
    'DasarPerhitunganUpah',
    'IuranPemberiKerja4Persen',
    'IuranPekerja1Persen',
    'TotalIuran5Persen',
  ];

  const rows = [headers.join(';')];

  for (const item of input.items) {
    const totalKes = item.kes_employer + item.kes_employee;

    const row = [
      escapeCsv(item.bpjs_kes_number || '0000000000000'),
      escapeCsv(item.nik_ktp),
      escapeCsv(item.employee_name),
      escapeCsv(Math.round(item.basis_salary)),
      escapeCsv(Math.round(item.kes_employer)),
      escapeCsv(Math.round(item.kes_employee)),
      escapeCsv(Math.round(totalKes)),
    ];

    rows.push(row.join(';'));
  }

  return rows.join('\r\n');
}
