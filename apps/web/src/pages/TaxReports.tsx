import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah } from '@catatgaji/shared';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const TaxReports: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState<'TAX' | 'JOURNAL' | 'BPJS' | 'BANK'>('TAX');
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<any>(null);
  const [periods, setPeriods] = useState<any[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [journalData, setJournalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load Tax Report & Periods list
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [taxRes, periodRes] = await Promise.all([
        apiFetch<any>(`/payroll/tax-reports/annual/${year}`, { token }),
        apiFetch<any>('/payroll/periods', { token }),
      ]);
      setReport(taxRes.data);
      setPeriods(periodRes.data || []);
      if (periodRes.data && periodRes.data.length > 0 && !selectedPeriodId) {
        setSelectedPeriodId(periodRes.data[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year, token, selectedPeriodId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load Journal for selected period
  useEffect(() => {
    if (selectedPeriodId && activeTab === 'JOURNAL') {
      apiFetch<any>(`/payroll/periods/${selectedPeriodId}/journal`, { token })
        .then((res) => setJournalData(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedPeriodId, activeTab, token]);

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
      ['9. PPh Pasal 21 Kurang/(Lebih) Bayar Masa Desember', formatRupiah(emp.total_pph21_annual - emp.pph21_withheld)],
    ];

    autoTable(doc, {
      startY: 58,
      head: [['Uraian Komponen Perhitungan Pajak', 'Jumlah (Rupiah)']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      styles: { fontSize: 8.5 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Bukti Potong ini diterbitkan otomatis sesuai PMK No. 168/2023 dan UU Harmonisasi Peraturan Perpajakan.', 14, finalY);

    doc.save(`Formulir_1721_A1_${emp.employee_name.replace(/\s+/g, '_')}_${year}.pdf`);
  };

  const handleDownloadCsv = async (url: string, defaultFilename: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1${url}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal mengunduh berkas CSV');
      const blob = await res.blob();
      const objUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = defaultFilename;
      a.click();
    } catch (err: any) {
      alert(err.message || 'Gagal mengekspor berkas');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Laporan Finansial, Pajak & Kepatuhan</h1>
          <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Rekonsiliasi PPh 21 DJP, Jurnal Akuntansi PSAK, Pelaporan BPJS & Rekapitulasi Transfer Bank
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'TAX', label: 'Pajak & e-Bupot DJP', icon: 'fa-solid fa-file-invoice-dollar' },
            { id: 'JOURNAL', label: 'Jurnal Akuntansi PSAK', icon: 'fa-solid fa-book-journal-whills' },
            { id: 'BPJS', label: 'Laporan BPJS SIPP/E-Dabu', icon: 'fa-solid fa-shield-heart' },
            { id: 'BANK', label: 'Transfer Bank Penggajian', icon: 'fa-solid fa-money-bill-transfer' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              <i className={t.icon}></i>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}></i>
          <p style={{ fontSize: '0.8125rem' }}>Memuat laporan finansial & kepatuhan regulasi...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: PAJAK & 1721-A1 */}
          {activeTab === 'TAX' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-soft)' }}>Pilih Tahun Pajak:</label>
              <select
                className="form-control"
                style={{ width: '110px' }}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleDownloadCsv(`/payroll/tax-reports/annual-1721a1-csv/${year}`, `Formulir_1721A1_${year}_DJP_Online.csv`)}
            >
              <i className="fa-solid fa-file-csv" style={{ color: 'var(--success)' }}></i>
              <span>Ekspor CSV e-Bupot 1721-A1 (DJP Online)</span>
            </button>
          </div>

          {/* KPI Cards */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <article className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                Total Bruto Pajak {year}
              </p>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: '0.25rem 0 0' }}>
                {report ? formatRupiah(report.total_annual_gross) : 'Rp 0'}
              </p>
            </article>

            <article className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                Total PPh 21 Terutang Setahun
              </p>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--danger-text)', margin: '0.25rem 0 0' }}>
                {report ? formatRupiah(report.total_annual_pph21) : 'Rp 0'}
              </p>
            </article>

            <article className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                Pegawai Tetap Terdaftar
              </p>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0 0' }}>
                {report ? report.total_employees : 0} Orang
              </p>
            </article>
          </section>

          {/* Tabel 1721-A1 */}
          <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '0.875rem', margin: 0, fontWeight: 600 }}>Daftar Bukti Potong Formulir 1721-A1 Karyawan</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Pegawai</th>
                    <th>NIK / NPWP</th>
                    <th>PTKP</th>
                    <th>Penghasilan Bruto</th>
                    <th>Neto Setahun</th>
                    <th>PPh 21 Terutang</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.forms_1721_a1?.map((emp: any) => (
                    <tr key={emp.employee_id}>
                      <td style={{ fontWeight: 600 }}>{emp.employee_name}</td>
                      <td>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{emp.nik_masked}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{emp.npwp}</div>
                      </td>
                      <td><span className="badge badge-primary">{emp.ptkp_status}</span></td>
                      <td style={{ fontWeight: 600 }}>{formatRupiah(emp.annual_gross_taxable)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatRupiah(emp.annual_net_income)}</td>
                      <td style={{ fontWeight: 700, color: 'var(--danger-text)' }}>{formatRupiah(emp.total_pph21_annual)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => download1721A1Pdf(emp)}
                          title="Unduh PDF Resmi 1721-A1"
                        >
                          <i className="fa-solid fa-file-pdf" style={{ color: 'var(--danger-text)' }}></i>
                          <span>PDF 1721-A1</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: JURNAL AKUNTANSI PSAK (DOUBLE-ENTRY BALANCED) */}
      {activeTab === 'JOURNAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Pilih Periode Gaji:</label>
              <select
                className="form-control"
                value={selectedPeriodId}
                onChange={(e) => setSelectedPeriodId(e.target.value)}
                style={{ width: '220px' }}
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    Periode {p.period_month}/{p.period_year} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedPeriodId && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDownloadCsv(`/payroll/periods/${selectedPeriodId}/journal-csv?type=MEKARI`, `Jurnal_Mekari_${selectedPeriodId}.csv`)}
                >
                  <i className="fa-solid fa-file-csv" style={{ color: 'var(--primary)' }}></i>
                  <span>Ekspor Jurnal (Mekari)</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDownloadCsv(`/payroll/periods/${selectedPeriodId}/journal-csv?type=ACCURATE`, `Jurnal_Accurate_${selectedPeriodId}.csv`)}
                >
                  <i className="fa-solid fa-file-csv" style={{ color: 'var(--success)' }}></i>
                  <span>Ekspor Accurate Online</span>
                </button>
              </div>
            )}
          </div>

          {/* Balanced Status Banner */}
          {journalData && (
            <div
              style={{
                backgroundColor: journalData.is_balanced ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${journalData.is_balanced ? '#a7f3d0' : '#fecaca'}`,
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className={`fa-solid ${journalData.is_balanced ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}`} style={{ fontSize: '1.25rem', color: journalData.is_balanced ? 'var(--success-text)' : 'var(--danger-text)' }}></i>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>
                    {journalData.is_balanced ? 'Jurnal Akuntansi Seimbang (Balanced 100%)' : 'Peringatan: Jurnal Tidak Seimbang'}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    No. Bukti: <strong>{journalData.reference_no}</strong> | Tanggal: <strong>{journalData.transaction_date}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>Total Debit</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>{formatRupiah(journalData.total_debit)}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>Total Kredit</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--success-text)' }}>{formatRupiah(journalData.total_credit)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Tabel Jurnal */}
          <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Kode Akun</th>
                    <th>Nama Akun Akuntansi</th>
                    <th>Uraian / Deskripsi</th>
                    <th style={{ textAlign: 'right' }}>Debit (Rp)</th>
                    <th style={{ textAlign: 'right' }}>Kredit (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {journalData?.entries?.map((entry: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>{entry.account_code}</td>
                      <td style={{ fontWeight: 600 }}>{entry.account_name}</td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.description}</td>
                      <td style={{ textAlign: 'right', fontWeight: entry.debit > 0 ? 700 : 400, color: entry.debit > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {entry.debit > 0 ? formatRupiah(entry.debit) : '-'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: entry.credit > 0 ? 700 : 400, color: entry.credit > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {entry.credit > 0 ? formatRupiah(entry.credit) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: PELAPORAN BPJS SIPP ONLINE & E-DABU */}
      {activeTab === 'BPJS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Ekspor Rekapitulasi Iuran BPJS Resmi</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
              Unduh berkas siap unggah ke portal resmi BPJS Ketenagakerjaan (SIPP Online Formulir F2A) dan BPJS Kesehatan (E-Dabu).
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Pilih Periode:</label>
              <select
                className="form-control"
                value={selectedPeriodId}
                onChange={(e) => setSelectedPeriodId(e.target.value)}
                style={{ width: '220px' }}
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    Periode {p.period_month}/{p.period_year}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    <i className="fa-solid fa-users-gear"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>BPJS Ketenagakerjaan</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>SIPP Online — Formulir F2A</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginBottom: '1rem' }}>
                  Rekapitulasi iuran JKK, JKM, JHT (3.7% + 2%), dan JP (2% + 1%) per tenaga kerja.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  disabled={!selectedPeriodId}
                  onClick={() => handleDownloadCsv(`/payroll/periods/${selectedPeriodId}/bpjs-tk-csv`, `BPJSTK_SIPP_${selectedPeriodId}.csv`)}
                >
                  <i className="fa-solid fa-download"></i> Unduh CSV SIPP Online
                </button>
              </div>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    <i className="fa-solid fa-heart-pulse"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>BPJS Kesehatan</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Portal E-Dabu Badan Usaha</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginBottom: '1rem' }}>
                  Rincian iuran 5% (4% Pemberi Kerja + 1% Pekerja) dengan batas atas plafon upah Rp 12.000.000,-.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  disabled={!selectedPeriodId}
                  onClick={() => handleDownloadCsv(`/payroll/periods/${selectedPeriodId}/bpjs-kes-csv`, `BPJSKes_EDabu_${selectedPeriodId}.csv`)}
                >
                  <i className="fa-solid fa-download"></i> Unduh CSV E-Dabu
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: TRANSFER BANK PENGGAJIAN */}
      {activeTab === 'BANK' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section className="card" style={{ padding: '1.5rem', maxWidth: '650px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Ekspor Batch Transfer Bank Penggajian</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
              Format berkas transfer massal gaji bersih (Take Home Pay) yang kompatibel dengan Internet Banking Korporat (KlikBCA Bisnis, Mandiri MCM 2.0, BRI CMS, BNI Direct).
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Pilih Periode Gaji:</label>
              <select
                className="form-control"
                value={selectedPeriodId}
                onChange={(e) => setSelectedPeriodId(e.target.value)}
                style={{ width: '220px' }}
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    Periode {p.period_month}/{p.period_year} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary"
              disabled={!selectedPeriodId}
              onClick={() => handleDownloadCsv(`/payroll/periods/${selectedPeriodId}/bank-transfer-csv`, `Batch_Transfer_Bank_${selectedPeriodId}.csv`)}
            >
              <i className="fa-solid fa-money-bill-transfer"></i>
              <span>Unduh Berkas Batch Payroll Bank (.CSV)</span>
            </button>
          </section>
        </div>
      )}
      </>
      )}

    </div>
  );
};
