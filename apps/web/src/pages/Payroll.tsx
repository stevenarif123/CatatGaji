import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah, formatTanggal } from '@catatgaji/shared';

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const Payroll: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form
  const now = new Date();
  const [periodMonth, setPeriodMonth] = useState(now.getMonth() + 1);
  const [periodYear, setPeriodYear] = useState(now.getFullYear());
  const [payoutDate, setPayoutDate] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-25`
  );

  const loadPeriods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>('/payroll/periods', { token });
      setPeriods(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPeriods();
  }, [loadPeriods]);

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);

    try {
      const res = await apiFetch<any>('/payroll/periods', {
        method: 'POST',
        token,
        body: {
          period_month: Number(periodMonth),
          period_year: Number(periodYear),
          payout_date: payoutDate,
        },
      });

      setShowCreateModal(false);
      navigate(`/payroll/${res.data.id}`);
    } catch (err: any) {
      setFormError(err.message || 'Gagal membuat periode penggajian baru');
    } finally {
      setCreating(false);
    }
  };

  const totalThpAll = periods.reduce((sum, p) => sum + (Number(p.total_thp) || 0), 0);
  const totalTaxAll = periods.reduce((sum, p) => sum + (Number(p.total_pph21) || 0), 0);
  const totalBpjsAll = periods.reduce((sum, p) => sum + (Number(p.total_bpjs_employer) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Manajemen Penggajian (Payroll)
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Kelola siklus penggajian bulanan, perhitungan otomatis PPh 21 TER, BPJS, dan otorisasi PIN Pemilik
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <i className="fa-solid fa-plus"></i>
          <span>Buka Periode Gaji Baru</span>
        </button>
      </div>

      {/* KPI Row */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-money-bill-transfer"></i>
            </div>
            <span className="badge badge-primary">Gaji Bersih</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Akumulasi THP
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {formatRupiah(totalThpAll)}
          </p>
        </article>

        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--warning-light)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-receipt"></i>
            </div>
            <span className="badge badge-warning">PPh 21 TER</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total PPh 21 Terpotong
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--warning-text)', marginTop: '0.25rem' }}>
            {formatRupiah(totalTaxAll)}
          </p>
        </article>

        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-shield-heart"></i>
            </div>
            <span className="badge badge-purple">BPJS Perusahaan</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Beban BPJS Perusahaan
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--purple-text)', marginTop: '0.25rem' }}>
            {formatRupiah(totalBpjsAll)}
          </p>
        </article>
      </section>

      {/* Period List Table */}
      <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '0.9375rem', margin: 0, fontWeight: 600 }}>Daftar Periode Penggajian</h2>
          <button className="btn btn-sm btn-secondary" onClick={loadPeriods}>
            <i className="fa-solid fa-rotate-right"></i>
            <span>Segarkan</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
            Memuat daftar periode penggajian...
          </div>
        ) : periods.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--text-faint)' }}>
              <i className="fa-solid fa-calculator"></i>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Belum Ada Periode Penggajian</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Klik tombol "+ Buka Periode Gaji Baru" untuk memulai proses penggajian pertama Anda.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Bulan / Tahun</th>
                  <th>Tanggal Bayar</th>
                  <th>Jumlah Karyawan</th>
                  <th>Total Gaji Bruto</th>
                  <th>Total PPh 21</th>
                  <th>Total Gaji Bersih (THP)</th>
                  <th>Status Dokumen</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => {
                  const isApproved = p.status === 'APPROVED';
                  const isSubmitted = p.status === 'SUBMITTED';

                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-regular fa-calendar-check" style={{ color: 'var(--primary)' }}></i>
                          <span>{NAMA_BULAN[p.period_month - 1]} {p.period_year}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-soft)' }}>
                        {formatTanggal(p.payout_date)}
                      </td>
                      <td>
                        <span className="badge badge-muted">{p.employee_count || 0} Karyawan</span>
                      </td>
                      <td>{formatRupiah(Number(p.total_gross_salary) || 0)}</td>
                      <td style={{ color: 'var(--warning-text)', fontWeight: 500 }}>
                        {formatRupiah(Number(p.total_pph21) || 0)}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {formatRupiah(Number(p.total_thp) || 0)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isApproved
                              ? 'badge-success'
                              : isSubmitted
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                        >
                          <i className={`fa-solid ${isApproved ? 'fa-lock' : isSubmitted ? 'fa-clock' : 'fa-pen-to-square'}`} style={{ fontSize: '8px' }}></i>
                          {isApproved ? 'Final & Terkunci' : isSubmitted ? 'Menunggu Persetujuan' : 'Draf'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/payroll/${p.id}`)}
                        >
                          <i className="fa-solid fa-arrow-right"></i>
                          <span>{isApproved ? 'Lihat Rekap & Slip' : 'Buka Wizard Penggajian'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal Buat Periode */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Buka Periode Penggajian Baru</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-faint)', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {formError && <div className="alert alert-danger"><i className="fa-solid fa-circle-exclamation"></i>{formError}</div>}

            <form onSubmit={handleCreatePeriod}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Bulan Penggajian</label>
                  <select
                    className="form-control"
                    value={periodMonth}
                    onChange={(e) => setPeriodMonth(Number(e.target.value))}
                  >
                    {NAMA_BULAN.map((name, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tahun</label>
                  <select
                    className="form-control"
                    value={periodYear}
                    onChange={(e) => setPeriodYear(Number(e.target.value))}
                  >
                    {[2024, 2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Tanggal Pembayaran Gaji (Payout Date)</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={payoutDate}
                  onChange={(e) => setPayoutDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Membuka Periode...' : 'Buka Periode & Masuk Wizard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
