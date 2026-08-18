import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah } from '@catatgaji/shared';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const TaxReports: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected1721A1, setSelected1721A1] = useState<any | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>(`/payroll/tax-reports/annual/${year}`, { token });
      setReport(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year, token]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const download1721A1Pdf = (emp: any) => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BUKTI PEMOTONGAN PAJAK PENGHASILAN PASAL 21', 14, 18);
    doc.setFontSize(10);
    doc.text('BAGI PEGAWAI TETAP ATAU PENERIMA PENSIUN BERKALA (FORMULIR 1721-A1)', 14, 24);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tahun Pajak: ${year}`, 14, 30);
    doc.line(14, 33, 196, 33);

    doc.setFontSize(9);
    doc.text(`Nama Penerima: ${emp.employee_name}`, 14, 40);
    doc.text(`NIK: ${emp.nik_masked}`, 14, 46);
    doc.text(`NPWP: ${emp.npwp}`, 14, 52);
    doc.text(`Status PTKP: ${emp.ptkp_status}`, 110, 40);
    doc.text(`Masa Kerja: ${emp.months_count} Bulan`, 110, 46);
    doc.text(`Cabang / Divisi: ${emp.branch_name || 'Kantor Pusat'}`, 110, 52);

    const tableBody = [
      ['1. Penghasilan Bruto Setahun', formatRupiah(emp.annual_gross_taxable)],
      ['2. Pengurang: Biaya Jabatan (5% maks Rp 6.000.000)', `(${formatRupiah(emp.biaya_jabatan)})`],
      ['3. Pengurang: Iuran JHT & Pensiun Pekerja Setahun', `(${formatRupiah(emp.annual_jht_employee + emp.annual_jp_employee)})`],
      ['4. Penghasilan Neto Setahun (1 - 2 - 3)', formatRupiah(emp.annual_net_income)],
      ['5. Penghasilan Tidak Kena Pajak (PTKP)', formatRupiah(emp.ptkp_amount)],
      ['6. Penghasilan Kena Pajak (PKP) Dibulatkan ke Ribuan', formatRupiah(emp.pkp_rounded)],
      ['7. PPh Pasal 21 Terutang Setahun (Pasal 17 UU HPP)', formatRupiah(emp.total_pph21_annual)],
      ['8. PPh Pasal 21 Telah Dipotong (Jan–Nov)', formatRupiah(emp.pph21_withheld)],
      ['9. PPh Pasal 21 Kurang / (Lebih) Bayar Masa Terakhir', formatRupiah(emp.total_pph21_annual - emp.pph21_withheld)],
    ];

    autoTable(doc, {
      startY: 58,
      head: [['Rincian Penghitungan PPh 21 Formulir 1721-A1', 'Nilai (Rp)']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8.5 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Bukti Potong ini diterbitkan otomatis sesuai PMK No. 168/2023 dan UU Harmonisasi Peraturan Perpajakan.', 14, finalY);

    doc.save(`Formulir_1721_A1_${emp.employee_name.replace(/\s+/g, '_')}_${year}.pdf`);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem' }}>Laporan Pajak & Rekonsiliasi Tahunan</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Rekonsiliasi Pajak Desember (Pasal 17 UU HPP) dan Ekspor Formulir Bukti Potong 1721-A1
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Tahun Pajak:</label>
          <select
            className="form-control form-control-sm"
            style={{ width: '100px' }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Bruto Kena Pajak {year}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
            {formatRupiah(report?.total_annual_gross || 0)}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total PPh 21 Terutang (Pasal 17)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#e74c3c', marginTop: '0.25rem' }}>
            {formatRupiah(report?.total_annual_pph21 || 0)}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Jumlah Formulir 1721-A1</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-text)', marginTop: '0.25rem' }}>
            {report?.total_employees || 0} Karyawan
          </div>
        </div>
      </div>

      {/* 1721-A1 Forms Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Daftar Formulir 1721-A1 Pegawai Tetap ({year})</h2>
          <button className="btn btn-sm btn-secondary" onClick={loadReport}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Menghitung rekonsiliasi pajak tahunan...
          </div>
        ) : !report?.forms_1721_a1 || report.forms_1721_a1.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📑</div>
            <h3 style={{ margin: '0 0 0.5rem' }}>Belum Ada Data Pajak untuk Tahun {year}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Jalankan penggajian bulanan di menu Penggajian terlebih dahulu.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Nama Karyawan</th>
                  <th style={{ padding: '0.75rem 1rem' }}>PTKP</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Bruto Setahun</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Biaya Jabatan</th>
                  <th style={{ padding: '0.75rem 1rem' }}>PKP Dibulatkan</th>
                  <th style={{ padding: '0.75rem 1rem' }}>PPh 21 Setahun</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Telah Dipotong</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {report.forms_1721_a1.map((f: any) => (
                  <tr key={f.employee_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 500 }}>{f.employee_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {f.nik_masked} | {f.npwp}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="badge badge-info">{f.ptkp_status}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {formatRupiah(f.annual_gross_taxable)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                      {formatRupiah(f.biaya_jabatan)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {formatRupiah(f.pkp_rounded)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#e74c3c' }}>
                      {formatRupiah(f.total_pph21_annual)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                      {formatRupiah(f.pph21_withheld)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelected1721A1(f)}
                      >
                        👁️ Formulir 1721-A1
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1721-A1 Modal */}
      {selected1721A1 && (
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
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Bukti Potong 1721-A1 ({year})</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  {selected1721A1.employee_name} ({selected1721A1.nik_masked})
                </p>
              </div>
              <button
                onClick={() => setSelected1721A1(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>1. Penghasilan Bruto Setahun</span>
                <strong>{formatRupiah(selected1721A1.annual_gross_taxable)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>2. Biaya Jabatan (5% maks Rp 6.000.000)</span>
                <strong>({formatRupiah(selected1721A1.biaya_jabatan)})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>3. Iuran JHT & Pensiun Pekerja Setahun</span>
                <strong>({formatRupiah(selected1721A1.annual_jht_employee + selected1721A1.annual_jp_employee)})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>4. Penghasilan Neto Setahun</span>
                <strong>{formatRupiah(selected1721A1.annual_net_income)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>5. Penghasilan Tidak Kena Pajak (PTKP {selected1721A1.ptkp_status})</span>
                <strong>{formatRupiah(selected1721A1.ptkp_amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>6. Penghasilan Kena Pajak (PKP)</span>
                <strong>{formatRupiah(selected1721A1.pkp_rounded)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)', color: '#e74c3c' }}>
                <span>7. PPh 21 Terutang Setahun (Pasal 17 UU HPP)</span>
                <strong>{formatRupiah(selected1721A1.total_pph21_annual)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>8. PPh 21 Telah Dipotong (Jan–Nov)</span>
                <strong>{formatRupiah(selected1721A1.pph21_withheld)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-primary)' }}>
                <span>9. Selisih PPh 21 Masa Terakhir (Desember)</span>
                <span>{formatRupiah(selected1721A1.total_pph21_annual - selected1721A1.pph21_withheld)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelected1721A1(null)}>
                Tutup
              </button>
              <button className="btn btn-primary" onClick={() => download1721A1Pdf(selected1721A1)}>
                📥 Unduh PDF Formulir 1721-A1
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
