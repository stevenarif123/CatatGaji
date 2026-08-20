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
    doc.setFont('helvetica', 'normal');
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
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8.5 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Bukti Potong ini diterbitkan otomatis sesuai PMK No. 168/2023 dan UU Harmonisasi Peraturan Perpajakan.', 14, finalY);

    doc.save(`Formulir_1721_A1_${emp.employee_name.replace(/\s+/g, '_')}_${year}.pdf`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Laporan Pajak & Rekonsiliasi Tahunan</h1>
          <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Rekonsiliasi Pajak Desember (Pasal 17 UU HPP) dan Ekspor Formulir Bukti Potong 1721-A1
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-soft)' }}>Tahun Pajak:</label>
            <select
              className="form-control"
              style={{ width: '110px' }}
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

          <button
            className="btn btn-secondary"
            onClick={async () => {
              try {
                const res = await fetch(`http://localhost:3000/api/v1/payroll/tax-reports/annual-1721a1-csv/${year}`, {
                  headers: { authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Gagal mengunduh CSV');
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Formulir_1721A1_${year}_DJP_Online.csv`;
                a.click();
              } catch (err: any) {
                alert(err.message || 'Gagal mengekspor CSV e-Bupot');
              }
            }}
          >
            <i className="fa-solid fa-file-csv" style={{ color: 'var(--success)' }}></i>
            <span>Ekspor CSV e-Bupot 1721-A1 (DJP Online)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-calculator"></i>
            </div>
            <span className="badge badge-primary">Bruto Setahun</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Bruto Pajak {year}
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {formatRupiah(report?.total_annual_gross || 0)}
          </p>
        </article>

        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--danger-light)', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <span className="badge badge-danger">Pasal 17 HPP</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total PPh 21 Terutang
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--danger-text)', marginTop: '0.25rem' }}>
            {formatRupiah(report?.total_annual_pph21 || 0)}
          </p>
        </article>

        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-users"></i>
            </div>
            <span className="badge badge-purple">Form 1721-A1</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Jumlah Karyawan
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {report?.total_employees || 0} Orang
          </p>
        </article>
      </section>

      {/* 1721-A1 Forms Table */}
      <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '0.9375rem', margin: 0, fontWeight: 600 }}>Daftar Formulir 1721-A1 Pegawai Tetap ({year})</h2>
          <button className="btn btn-sm btn-secondary" onClick={loadReport}>
            <i className="fa-solid fa-rotate-right"></i>
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
            Menghitung rekonsiliasi pajak tahunan...
          </div>
        ) : !report?.forms_1721_a1 || report.forms_1721_a1.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--text-faint)' }}>
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>Belum Ada Data Pajak untuk Tahun {year}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Jalankan penggajian bulanan di menu Payroll Processor terlebih dahulu.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Karyawan</th>
                  <th>PTKP</th>
                  <th>Bruto Setahun</th>
                  <th>Biaya Jabatan</th>
                  <th>PKP Dibulatkan</th>
                  <th>PPh 21 Setahun</th>
                  <th>Telah Dipotong</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {report.forms_1721_a1.map((f: any) => (
                  <tr key={f.employee_id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{f.employee_name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {f.nik_masked} | {f.npwp}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{f.ptkp_status}</span>
                    </td>
                    <td>
                      {formatRupiah(f.annual_gross_taxable)}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {formatRupiah(f.biaya_jabatan)}
                    </td>
                    <td>
                      {formatRupiah(f.pkp_rounded)}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--danger-text)' }}>
                      {formatRupiah(f.total_pph21_annual)}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {formatRupiah(f.pph21_withheld)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelected1721A1(f)}
                      >
                        <i className="fa-solid fa-file-lines" style={{ color: 'var(--primary)', marginRight: '0.25rem' }}></i>
                        <span>Formulir 1721-A1</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 1721-A1 Modal */}
      {selected1721A1 && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Bukti Potong 1721-A1 ({year})</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {selected1721A1.employee_name} ({selected1721A1.nik_masked})
                </p>
              </div>
              <button
                onClick={() => setSelected1721A1(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-faint)', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>1. Penghasilan Bruto Setahun</span>
                <strong>{formatRupiah(selected1721A1.annual_gross_taxable)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>2. Pengurang: Biaya Jabatan (5% maks Rp 6.000.000)</span>
                <strong>({formatRupiah(selected1721A1.biaya_jabatan)})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>3. Pengurang: Iuran JHT & Pensiun Pekerja Setahun</span>
                <strong>({formatRupiah(selected1721A1.annual_jht_employee + selected1721A1.annual_jp_employee)})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>4. Penghasilan Neto Setahun</span>
                <strong>{formatRupiah(selected1721A1.annual_net_income)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>5. Penghasilan Tidak Kena Pajak (PTKP {selected1721A1.ptkp_status})</span>
                <strong>{formatRupiah(selected1721A1.ptkp_amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>6. Penghasilan Kena Pajak (PKP)</span>
                <strong>{formatRupiah(selected1721A1.pkp_rounded)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)', color: 'var(--danger-text)' }}>
                <span>7. PPh 21 Terutang Setahun (Pasal 17 UU HPP)</span>
                <strong>{formatRupiah(selected1721A1.total_pph21_annual)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>8. PPh 21 Telah Dipotong (Jan–Nov)</span>
                <strong>{formatRupiah(selected1721A1.pph21_withheld)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--primary)' }}>
                <span>9. Selisih PPh 21 Masa Terakhir (Desember)</span>
                <span>{formatRupiah(selected1721A1.total_pph21_annual - selected1721A1.pph21_withheld)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelected1721A1(null)}>
                Tutup
              </button>
              <button className="btn btn-primary" onClick={() => download1721A1Pdf(selected1721A1)}>
                <i className="fa-solid fa-download"></i>
                <span>Unduh PDF Formulir 1721-A1</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
