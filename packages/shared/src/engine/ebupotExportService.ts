// ============================================================
// CatatGaji — Generator Ekspor Berkas CSV e-Bupot 21/26 DJP Online
// Format Resmi Direktorat Jenderal Pajak (pajak.go.id) Sesuai PER-2/PJ/2024
// ============================================================

export interface EbupotMonthlyItem {
  nik_ktp: string;
  npwp?: string | null;
  employee_name: string;
  gross_taxable: number;
  pph21_amount: number;
  ptkp_status: string;
  ter_category: string;
  ter_rate_percent: number;
  is_foreign?: boolean;
}

export interface EbupotMonthlyExportInput {
  tax_year: number;
  tax_month: number;
  pembetulan: number;
  company_npwp: string;
  company_name: string;
  signatory_nik_npwp: string;
  signatory_name: string;
  payout_date: string;
  items: EbupotMonthlyItem[];
}

export interface Form1721A1AnnualItem {
  employee_name: string;
  nik_ktp: string;
  npwp?: string | null;
  ptkp_status: string;
  months_count: number;
  annual_gross_taxable: number;
  biaya_jabatan: number;
  annual_jht_jp_employee: number;
  annual_net_income: number;
  ptkp_amount: number;
  pkp_rounded: number;
  total_pph21_annual: number;
  pph21_withheld: number;
  pph21_difference: number;
}

export interface Form1721A1AnnualExportInput {
  tax_year: number;
  company_npwp: string;
  company_name: string;
  signatory_nik_npwp: string;
  signatory_name: string;
  items: Form1721A1AnnualItem[];
}

/**
 * Membersihkan dan memformat teks untuk CSV (Escape tanda kutip dan titik koma)
 */
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(';') || str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Menghasilkan berkas CSV e-Bupot 21/26 Bulanan (Masa Pajak Jan - Nov)
 * Kode Objek Pajak Pegawai Tetap: 21-100-01
 */
export function generateEbupotMonthlyCsv(input: EbupotMonthlyExportInput): string {
  const headers = [
    'MasaPajak',
    'TahunPajak',
    'Pembetulan',
    'NPWPPemotong',
    'NamaPemotong',
    'NIKNPWPPenerima',
    'NamaPenerima',
    'KodeObjekPajak',
    'JumlahPenghasilanBruto',
    'TarifTERPersen',
    'JumlahPPh21Dipotong',
    'MetodePotong',
    'StatusPTKP',
    'NPWPNIKPenandatangan',
    'NamaPenandatangan',
    'TanggalDokumen',
  ];

  const rows: string[] = [headers.join(';')];

  for (const item of input.items) {
    const identitasPenerima = item.npwp && item.npwp.replace(/\D/g, '').length >= 15
      ? item.npwp.replace(/\D/g, '')
      : item.nik_ktp;

    const row = [
      escapeCsv(String(input.tax_month).padStart(2, '0')),
      escapeCsv(input.tax_year),
      escapeCsv(input.pembetulan || 0),
      escapeCsv(input.company_npwp ? input.company_npwp.replace(/\D/g, '') : '0000000000000000'),
      escapeCsv(input.company_name),
      escapeCsv(identitasPenerima),
      escapeCsv(item.employee_name),
      '21-100-01', // Pegawai Tetap
      escapeCsv(Math.round(item.gross_taxable)),
      escapeCsv(item.ter_rate_percent),
      escapeCsv(Math.round(item.pph21_amount)),
      'GROSS',
      escapeCsv(item.ptkp_status),
      escapeCsv(input.signatory_nik_npwp ? input.signatory_nik_npwp.replace(/\D/g, '') : '0000000000000000'),
      escapeCsv(input.signatory_name || 'Direktur Utama'),
      escapeCsv(input.payout_date),
    ];

    rows.push(row.join(';'));
  }

  return rows.join('\r\n');
}

/**
 * Menghasilkan berkas CSV Bukti Potong Formulir 1721-A1 Tahunan (Desember / Akhir Tahun)
 */
export function generate1721A1AnnualCsv(input: Form1721A1AnnualExportInput): string {
  const headers = [
    'TahunPajak',
    'NPWPPemotong',
    'NamaPemotong',
    'NIKKTP',
    'NPWPPegawai',
    'NamaPegawai',
    'StatusPTKP',
    'MasaPerolehanBulan',
    'BrutoSetahun',
    'BiayaJabatan',
    'IuranJHTJPPekerja',
    'PenghasilanNetoSetahun',
    'PTKP',
    'PKPDibulatkan',
    'PPh21TerutangSetahun',
    'PPh21TelahDipotongJanNov',
    'SelisihKurangLebihBayar',
    'NPWPNIKPenandatangan',
    'NamaPenandatangan',
  ];

  const rows: string[] = [headers.join(';')];

  for (const item of input.items) {
    const row = [
      escapeCsv(input.tax_year),
      escapeCsv(input.company_npwp ? input.company_npwp.replace(/\D/g, '') : '0000000000000000'),
      escapeCsv(input.company_name),
      escapeCsv(item.nik_ktp),
      escapeCsv(item.npwp ? item.npwp.replace(/\D/g, '') : ''),
      escapeCsv(item.employee_name),
      escapeCsv(item.ptkp_status),
      escapeCsv(item.months_count || 12),
      escapeCsv(Math.round(item.annual_gross_taxable)),
      escapeCsv(Math.round(item.biaya_jabatan)),
      escapeCsv(Math.round(item.annual_jht_jp_employee)),
      escapeCsv(Math.round(item.annual_net_income)),
      escapeCsv(Math.round(item.ptkp_amount)),
      escapeCsv(Math.round(item.pkp_rounded)),
      escapeCsv(Math.round(item.total_pph21_annual)),
      escapeCsv(Math.round(item.pph21_withheld)),
      escapeCsv(Math.round(item.pph21_difference)),
      escapeCsv(input.signatory_nik_npwp ? input.signatory_nik_npwp.replace(/\D/g, '') : '0000000000000000'),
      escapeCsv(input.signatory_name || 'Direktur Utama'),
    ];

    rows.push(row.join(';'));
  }

  return rows.join('\r\n');
}
