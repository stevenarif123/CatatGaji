import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah, formatTanggal } from '@catatgaji/shared';

const MONTH_NAMES = [
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
      setFormError(err.message || 'Gagal membuat periode penggajian');
    } finally {
      setCreating(false);
    }
  };

  const totalThpAll = periods.reduce((sum, p) => sum + (Number(p.total_thp) || 0), 0);
  const totalTaxAll = periods.reduce((sum, p) => sum + (Number(p.total_pph21) || 0), 0);
  const totalEmpCount = periods.reduce((sum, p) => sum + (Number(p.employee_count) || 0), 0);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem' }}>Penggajian (Payroll)</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Kelola periode penggajian, kalkulasi otomatis PPh 21 TER, BPJS, dan approval PIN Owner
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Buat Periode Gaji Baru
        </button>
      </div>

      {/* KPI Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Akumulasi THP</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
            {formatRupiah(totalThpAll)}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Setoran PPh 21 TER</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c', marginTop: '0.25rem' }}>
            {formatRupiah(totalTaxAll)}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Penggajian Karyawan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', marginTop: '0.25rem' }}>
            {totalEmpCount} Proses
          </div>
        </div>
      </div>

      {/* Periods Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Daftar Periode Penggajian</h2>
          <button className="btn btn-sm btn-secondary" onClick={loadPeriods}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Memuat daftar periode penggajian...
          </div>
        ) : periods.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ margin: '0 0 0.5rem' }}>Belum Ada Periode Penggajian</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Klik tombol di bawah untuk membuat periode penggajian baru bulan ini.
            </p>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              + Buat Periode Gaji Pertama
            </button>
          </div>
        ) : (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Periode</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tanggal Transfer</th>
                <th style={{ padding: '0.75rem 1rem' }}>Karyawan</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Bruto</th>
                <th style={{ padding: '0.75rem 1rem' }}>PPh 21 TER</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total THP</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    {MONTH_NAMES[p.period_month - 1]} {p.period_year}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {formatTanggal(p.payout_date)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {p.employee_count} Orang
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {formatRupiah(p.total_gross)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#e74c3c' }}>
                    {formatRupiah(p.total_pph21)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#27ae60' }}>
                    {formatRupiah(p.total_thp)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${
                      p.status === 'APPROVED' ? 'badge-success' :
                      p.status === 'SUBMITTED' ? 'badge-warning' : 'badge-secondary'
                    }`}>
                      {p.status === 'APPROVED' ? 'FINAL & LOCKED' : p.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/payroll/${p.id}`)}
                    >
                      {p.status === 'DRAFT' ? 'Lanjutkan Wizard ➔' : 'Lihat Detail ➔'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Buat Periode */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
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
            maxWidth: '460px',
            padding: '1.5rem',
          }}>
            <h3 style={{ margin: '0 0 1rem' }}>Buat Periode Penggajian Baru</h3>

            {formError && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                border: '1px solid #e74c3c',
                borderRadius: 'var(--radius-sm)',
                color: '#e74c3c',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePeriod}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Bulan Periode</label>
                <select
                  className="form-control"
                  value={periodMonth}
                  onChange={(e) => setPeriodMonth(Number(e.target.value))}
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Tahun</label>
                <input
                  type="number"
                  className="form-control"
                  value={periodYear}
                  min={2020}
                  max={2050}
                  onChange={(e) => setPeriodYear(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Tanggal Pembayaran Gaji (Payout Date)</label>
                <input
                  type="date"
                  className="form-control"
                  value={payoutDate}
                  onChange={(e) => setPayoutDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Membuat...' : 'Mulai Wizard Penggajian ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
