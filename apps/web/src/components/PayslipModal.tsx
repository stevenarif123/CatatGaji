import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupiah, formatTanggal } from '@catatgaji/shared';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export interface PayslipData {
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
  data?: PayslipData | null;
  resultId?: string | null;
  onClose: () => void;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const PayslipModal: React.FC<PayslipModalProps> = ({ data: initialData, resultId, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const [data, setData] = useState<PayslipData | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resultId && !initialData) {
      setLoading(true);
      apiFetch<any>(`/payroll/results/${resultId}/slip`, { token })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch slip:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [resultId, initialData, token]);

  if (!data && loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Memuat slip gaji digital...</p>
        </div>
      </div>
    );
  }

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
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 5;

    autoTable(doc, {
      startY: finalY,
      head: [['Komponen Potongan', 'Jumlah (Rp)']],
      body: deductionsBody,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 8 },
    });

    const thpY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFillColor(236, 253, 245);
    doc.rect(14, thpY, 182, 14, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(`TAKE HOME PAY (THP) BERSIH: ${formatRupiah(data.thp)}`, 18, thpY + 9);

    // Footer Security Notice
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Dokumen ini sah dan diterbitkan secara digital oleh platform CatatGaji. Dilindungi verifikasi PIN & QR Token.', 14, thpY + 22);

    doc.save(`Slip_Gaji_${data.employee_name.replace(/\s+/g, '_')}_${periodLabel}.pdf`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{data.company_name}</h3>
              <span className="badge badge-primary">Resmi</span>
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Slip Gaji Karyawan — Periode {periodLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--text-faint)',
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Employee Info Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          margin: '1.25rem 0',
          padding: '0.875rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8125rem',
        }}>
          <div><strong style={{ color: 'var(--text-muted)' }}>Nama:</strong> <span style={{ fontWeight: 600 }}>{data.employee_name}</span></div>
          <div><strong style={{ color: 'var(--text-muted)' }}>NIK:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{data.nik_masked}</span></div>
          <div><strong style={{ color: 'var(--text-muted)' }}>PTKP & TER:</strong> <span className="badge badge-info">{data.ptkp_status}</span> (TER {data.ter_category})</div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Tarif TER:</strong> {(Number(data.effective_ter_rate) * 100).toFixed(2)}%</div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Rekening Bank:</strong> {data.bank_name || 'BCA'} - {data.bank_account_no || '-'}</div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Tanggal Bayar:</strong> {formatTanggal(data.payout_date)}</div>
        </div>

        {/* 2-Column Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Earnings */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', backgroundColor: '#ffffff' }}>
            <h4 style={{ margin: '0 0 0.75rem', color: 'var(--success-text)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.375rem' }}>
              <i className="fa-solid fa-plus-circle" style={{ marginRight: '0.375rem' }}></i> Pendapatan
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-soft)' }}>Gaji Pokok</span>
                <strong>{formatRupiah(data.basic_salary)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-soft)' }}>Tunjangan Tetap</span>
                <strong>{formatRupiah(fixedTotal)}</strong>
              </div>
              {Number(data.overtime_pay) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Lembur PP 35/2021</span>
                  <strong>{formatRupiah(data.overtime_pay)}</strong>
                </div>
              )}
              {Number(data.thr_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)' }}>THR</span>
                  <strong>{formatRupiah(data.thr_amount)}</strong>
                </div>
              )}
              {Number(data.pkwt_compensation) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Kompensasi PKWT</span>
                  <strong>{formatRupiah(data.pkwt_compensation)}</strong>
                </div>
              )}
              {Number(data.bonus_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Bonus</span>
                  <strong>{formatRupiah(data.bonus_amount)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <span>Total Bruto</span>
                <span>{formatRupiah(data.gross_earnings)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', backgroundColor: '#ffffff' }}>
            <h4 style={{ margin: '0 0 0.75rem', color: 'var(--danger-text)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.375rem' }}>
              <i className="fa-solid fa-minus-circle" style={{ marginRight: '0.375rem' }}></i> Potongan
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-soft)' }}>BPJS JHT (2%)</span>
                <strong>{formatRupiah(data.jht_employee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-soft)' }}>BPJS JP (1%)</span>
                <strong>{formatRupiah(data.jp_employee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-soft)' }}>BPJS Kes (1%)</span>
                <strong>{formatRupiah(data.kes_employee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-soft)' }}>PPh 21 TER</span>
                <strong style={{ color: 'var(--danger-text)' }}>{formatRupiah(data.pph21_amount)}</strong>
              </div>
              {Number(data.loan_deduction) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Kasbon</span>
                  <strong>{formatRupiah(data.loan_deduction)}</strong>
                </div>
              )}
              {Number(data.absence_deduction) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-soft)' }}>Absensi</span>
                  <strong>{formatRupiah(data.absence_deduction)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem', fontWeight: 700, color: 'var(--danger-text)' }}>
                <span>Total Potongan</span>
                <span>{formatRupiah(data.total_deductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* THP Banner */}
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--success-light)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--success-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Take Home Pay (Gaji Bersih Diterima)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-text)' }}>
              {formatRupiah(data.thp)}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div>Status: <span className="badge badge-success">{data.is_locked ? 'Locked' : 'Draft'}</span></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
          <button className="btn btn-primary" onClick={downloadPdf}>
            <i className="fa-solid fa-download"></i>
            <span>Unduh PDF Resmi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
