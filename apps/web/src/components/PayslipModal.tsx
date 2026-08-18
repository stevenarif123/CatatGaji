import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupiah, formatTanggal } from '@catatgaji/shared';

interface PayslipData {
  id: string;
  company_name: string;
  employee_name: string;
  nik_masked: string;
  ptkp_status: string;
  ter_category: string;
  ter_layer: number;
  effective_ter_rate: number;
  bank_name?: string;
  bank_account_no?: string;
  period_month: number;
  period_year: number;
  payout_date: string;
  basic_salary: number;
  fixed_allowances?: any;
  non_fixed_allowances?: any;
  overtime_pay: number;
  thr_amount: number;
  pkwt_compensation: number;
  bonus_amount: number;
  gross_earnings: number;
  pph21_amount: number;
  jht_employee: number;
  jp_employee: number;
  kes_employee: number;
  total_bpjs_employee: number;
  loan_deduction: number;
  absence_deduction: number;
  total_deductions: number;
  thp: number;
  total_employer_cost: number;
  jkk_employer: number;
  jkm_employer: number;
  jht_employer: number;
  jp_employer: number;
  kes_employer: number;
  total_bpjs_employer: number;
  is_locked?: boolean;
}

interface PayslipModalProps {
  data: PayslipData | null;
  onClose: () => void;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const PayslipModal: React.FC<PayslipModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const monthName = MONTH_NAMES[data.period_month - 1] || data.period_month;
  const periodLabel = `${monthName} ${data.period_year}`;

  const rawFixed = typeof data.fixed_allowances === 'string' ? JSON.parse(data.fixed_allowances) : (data.fixed_allowances || []);
  const fixedTotal = rawFixed.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.company_name || 'CatatGaji Organization', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`SLIP GAJI BULANAN — ${periodLabel.toUpperCase()}`, 14, 25);
    doc.text(`Tanggal Pembayaran: ${formatTanggal(data.payout_date)}`, 14, 30);

    doc.line(14, 33, 196, 33);

    // Employee Bio
    doc.setFontSize(9);
    doc.text(`Nama: ${data.employee_name}`, 14, 40);
    doc.text(`NIK: ${data.nik_masked}`, 14, 45);
    doc.text(`Status PTKP: ${data.ptkp_status} (TER ${data.ter_category} - ${(Number(data.effective_ter_rate) * 100).toFixed(2)}%)`, 14, 50);

    doc.text(`Rekening: ${data.bank_name || 'BCA'} - ${data.bank_account_no || '-'}`, 110, 40);
    doc.text(`Status Kunci: ${data.is_locked ? 'APPROVED & IMMUTABLE' : 'DRAFT'}`, 110, 45);

    // Earnings Table
    const earningsBody = [
      ['Gaji Pokok', formatRupiah(data.basic_salary)],
      ['Tunjangan Tetap', formatRupiah(fixedTotal)],
      ...(Number(data.overtime_pay) > 0 ? [['Upah Lembur (PP 35/2021)', formatRupiah(data.overtime_pay)]] : []),
      ...(Number(data.thr_amount) > 0 ? [['Tunjangan Hari Raya (THR)', formatRupiah(data.thr_amount)]] : []),
      ...(Number(data.pkwt_compensation) > 0 ? [['Uang Kompensasi PKWT', formatRupiah(data.pkwt_compensation)]] : []),
      ...(Number(data.bonus_amount) > 0 ? [['Bonus / Insentif', formatRupiah(data.bonus_amount)]] : []),
      ['TOTAL PENGHASILAN KOTOR (GROSS)', formatRupiah(data.gross_earnings)],
    ];

    // Deductions Table
    const deductionsBody = [
      ['BPJS Jaminan Hari Tua (JHT 2%)', formatRupiah(data.jht_employee)],
      ['BPJS Jaminan Pensiun (JP 1%)', formatRupiah(data.jp_employee)],
      ['BPJS Kesehatan (1%)', formatRupiah(data.kes_employee)],
      [`PPh 21 TER ${data.ter_category} (${(Number(data.effective_ter_rate) * 100).toFixed(2)}%)`, formatRupiah(data.pph21_amount)],
      ...(Number(data.loan_deduction) > 0 ? [['Potongan Kasbon / Pinjaman', formatRupiah(data.loan_deduction)]] : []),
      ...(Number(data.absence_deduction) > 0 ? [['Potongan Ketidakhadiran', formatRupiah(data.absence_deduction)]] : []),
      ['TOTAL POTONGAN', formatRupiah(data.total_deductions)],
    ];

    autoTable(doc, {
      startY: 56,
      head: [['Komponen Pendapatan', 'Jumlah (Rp)']],
      body: earningsBody,
      theme: 'grid',
      headStyles: { fillColor: [44, 62, 80] },
      styles: { fontSize: 8 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 5;

    autoTable(doc, {
      startY: finalY,
      head: [['Komponen Potongan', 'Jumlah (Rp)']],
      body: deductionsBody,
      theme: 'grid',
      headStyles: { fillColor: [192, 57, 43] },
      styles: { fontSize: 8 },
    });

    const thpY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFillColor(235, 247, 238);
    doc.rect(14, thpY, 182, 14, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 94, 32);
    doc.text(`TAKE HOME PAY (THP) BERSIH: ${formatRupiah(data.thp)}`, 18, thpY + 9);

    // Footer Security Notice
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Dokumen ini sah dan diterbitkan secara digital oleh platform CatatGaji. Dilindungi verifikasi PIN & QR Token.', 14, thpY + 22);

    doc.save(`Slip_Gaji_${data.employee_name.replace(/\s+/g, '_')}_${periodLabel}.pdf`);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.5rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{data.company_name}</h3>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Slip Gaji Karyawan — Periode {periodLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            ×
          </button>
        </div>

        {/* Employee Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          margin: '1rem 0',
          padding: '0.75rem',
          backgroundColor: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
        }}>
          <div><strong>Nama:</strong> {data.employee_name}</div>
          <div><strong>NIK:</strong> {data.nik_masked}</div>
          <div><strong>Status PTKP:</strong> <span className="badge badge-info">{data.ptkp_status}</span> (TER {data.ter_category})</div>
          <div><strong>Tarif Efektif:</strong> {(Number(data.effective_ter_rate) * 100).toFixed(2)}%</div>
          <div><strong>Rekening:</strong> {data.bank_name || 'BCA'} {data.bank_account_no}</div>
          <div><strong>Tgl Transfer:</strong> {formatTanggal(data.payout_date)}</div>
        </div>

        {/* 2-Column Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          {/* Earnings */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.75rem', color: '#27ae60', fontSize: '0.9rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem' }}>
              (+) PENDAPATAN
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gaji Pokok</span>
                <strong>{formatRupiah(data.basic_salary)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tunjangan Tetap</span>
                <strong>{formatRupiah(fixedTotal)}</strong>
              </div>
              {Number(data.overtime_pay) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Lembur PP 35/2021</span>
                  <strong>{formatRupiah(data.overtime_pay)}</strong>
                </div>
              )}
              {Number(data.thr_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tunjangan Hari Raya</span>
                  <strong>{formatRupiah(data.thr_amount)}</strong>
                </div>
              )}
              {Number(data.pkwt_compensation) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Kompensasi PKWT</span>
                  <strong>{formatRupiah(data.pkwt_compensation)}</strong>
                </div>
              )}
              {Number(data.bonus_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Bonus & Insentif</span>
                  <strong>{formatRupiah(data.bonus_amount)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: '0.4rem', fontWeight: 'bold' }}>
                <span>Total Bruto</span>
                <span>{formatRupiah(data.gross_earnings)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.75rem', color: '#e74c3c', fontSize: '0.9rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem' }}>
              (-) POTONGAN
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>BPJS JHT (2%)</span>
                <strong>{formatRupiah(data.jht_employee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>BPJS JP (1%)</span>
                <strong>{formatRupiah(data.jp_employee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>BPJS Kes (1%)</span>
                <strong>{formatRupiah(data.kes_employee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>PPh 21 TER {(Number(data.effective_ter_rate) * 100).toFixed(2)}%</span>
                <strong style={{ color: '#e74c3c' }}>{formatRupiah(data.pph21_amount)}</strong>
              </div>
              {Number(data.loan_deduction) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Potongan Kasbon</span>
                  <strong>{formatRupiah(data.loan_deduction)}</strong>
                </div>
              )}
              {Number(data.absence_deduction) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Potongan Absensi</span>
                  <strong>{formatRupiah(data.absence_deduction)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: '0.4rem', fontWeight: 'bold' }}>
                <span>Total Potongan</span>
                <span>{formatRupiah(data.total_deductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* THP Highlight */}
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem',
          backgroundColor: '#e8f5e9',
          border: '1px solid #c8e6c9',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#2e7d32', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Take Home Pay (Gaji Bersih Diterima)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1b5e20' }}>
              {formatRupiah(data.thp)}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#555' }}>
            <div>Status Kunci: {data.is_locked ? '✅ FINAL & TERKUNCI' : '⏳ DRAFT'}</div>
            <div>Beban Total Perusahaan: {formatRupiah(data.total_employer_cost)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
          <button className="btn btn-primary" onClick={downloadPdf}>
            📥 Unduh PDF Slip Gaji
          </button>
        </div>
      </div>
    </div>
  );
};
