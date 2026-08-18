import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah, formatTanggal } from '@catatgaji/shared';
import { PayslipModal } from '../components/PayslipModal';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const PayrollWizard: React.FC = () => {
  const { id: periodId } = useParams<{ id: string }>();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [period, setPeriod] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Payslip Modal State
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);

  // Approval PIN Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Fetch Period and Results
  const loadData = useCallback(async () => {
    if (!periodId) return;
    setLoading(true);
    try {
      const res = await apiFetch<any>(`/payroll/periods/${periodId}/results`, { token });
      setPeriod(res.data.period);
      setItems(res.data.items || []);

      // If already calculated, start at step 2 or 3
      if (res.data.items?.length > 0) {
        if (res.data.period.status === 'APPROVED' || res.data.period.status === 'SUBMITTED') {
          setStep(3);
        } else {
          setStep(2);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data periode');
    } finally {
      setLoading(false);
    }
  }, [periodId, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Step 1: Run batch calculation
  const handleRunCalculation = async () => {
    setProcessing(true);
    setError(null);
    try {
      await apiFetch<any>(`/payroll/periods/${periodId}/run-calculation`, {
        method: 'POST',
        token,
      });
      await loadData();
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Gagal menjalankan kalkulasi batch');
    } finally {
      setProcessing(false);
    }
  };

  // Step 2: Update an item variable
  const handleUpdateItem = async (itemId: string, field: string, value: number) => {
    try {
      const res = await apiFetch<any>(`/payroll/periods/${periodId}/items/${itemId}`, {
        method: 'PUT',
        token,
        body: { [field]: Number(value) || 0 },
      });

      // Update item locally
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...res.data } : item)));

      // Reload aggregate summary
      const refreshRes = await apiFetch<any>(`/payroll/periods/${periodId}/results`, { token });
      setPeriod(refreshRes.data.period);
    } catch (err: any) {
      alert(`Gagal memperbarui: ${err.message}`);
    }
  };

  // Step 3: Submit for approval
  const handleSubmitForApproval = async () => {
    if (!window.confirm('Ajukan periode penggajian ini untuk disetujui Owner?')) return;
    try {
      await apiFetch(`/payroll/periods/${periodId}/submit`, {
        method: 'POST',
        token,
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengajukan payroll');
    }
  };

  // Step 4: Owner PIN Approval
  const handleApproveWithPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setPinError('PIN harus tepat 6 digit angka');
      return;
    }

    setPinSubmitting(true);
    setPinError(null);

    try {
      await apiFetch(`/payroll/periods/${periodId}/approve`, {
        method: 'POST',
        token,
        body: { pin },
      });

      setShowPinModal(false);
      setPin('');
      await loadData();
      alert('Penggajian berhasil disahkan dan dikunci secara permanen (Immutable).');
    } catch (err: any) {
      setPinError(err.message || 'PIN yang Anda masukkan salah.');
    } finally {
      setPinSubmitting(false);
    }
  };

  const isApproved = period?.status === 'APPROVED';
  const isSubmitted = period?.status === 'SUBMITTED';

  if (loading && !period) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        Memuat Wizard Penggajian...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            onClick={() => navigate('/payroll')}
            className="btn btn-sm btn-secondary"
            style={{ marginBottom: '0.5rem' }}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Kembali ke Daftar Periode</span>
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Payroll Wizard — {MONTH_NAMES[period.period_month - 1]} {period.period_year}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Jadwal Pembayaran: {formatTanggal(period.payout_date)}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            {isApproved ? 'FINAL & LOCKED' : isSubmitted ? 'MENUNGGU APPROVAL' : 'DRAFT'}
          </span>
        </div>
      </div>

      {/* 4-Step Progress Indicator (UX Pilot Style) */}
      <section className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {[
            { num: 1, title: '1. Batch Kalkulasi', icon: 'fa-solid fa-calculator' },
            { num: 2, title: '2. Input Variabel', icon: 'fa-solid fa-pen-to-square' },
            { num: 3, title: '3. Review Rekap', icon: 'fa-solid fa-chart-pie' },
            { num: 4, title: '4. Owner PIN Approval', icon: 'fa-solid fa-shield-halved' },
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num || isApproved;

            return (
              <div
                key={s.num}
                onClick={() => {
                  if (items.length > 0) setStep(s.num);
                }}
                style={{
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg-subtle)',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                  cursor: items.length > 0 ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? 'var(--success)' : isActive ? 'var(--primary)' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  {isDone ? <i className="fa-solid fa-check" style={{ fontSize: '10px' }}></i> : s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  }}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {error && <div className="alert alert-danger"><i className="fa-solid fa-circle-exclamation"></i>{error}</div>}

      {/* STEP 1: Batch Calculation */}
      {step === 1 && (
        <section className="hero-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              marginBottom: '1rem',
            }}
          >
            <i className="fa-solid fa-microchip"></i>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
            Jalankan Mesin Penggajian Batch Otomatis
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Sistem akan menghitung gaji pokok, 5 program BPJS, dan PPh 21 TER (PMK 168/2023 125 lapisan) untuk seluruh karyawan aktif secara instan.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleRunCalculation}
            disabled={processing}
          >
            <i className={`fa-solid ${processing ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
            <span>{processing ? 'Menjalankan Kalkulasi Batch...' : 'Mulai Hitung Payroll Otomatis'}</span>
          </button>
        </section>
      )}

      {/* STEP 2: Input Komponen Variabel */}
      {step === 2 && (
        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '0.9375rem', margin: 0, fontWeight: 600 }}>Input Komponen Variabel Karyawan</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Masukkan lembur, bonus, dan potongan kasbon/absen. Pajak PPh 21 TER dan THP akan terkalkulasi ulang otomatis.
              </p>
            </div>
            {!isApproved && (
              <button className="btn btn-sm btn-primary" onClick={() => setStep(3)}>
                <span>Lanjut ke Review Rekapitulasi</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Karyawan</th>
                  <th>Gaji Pokok</th>
                  <th style={{ width: '130px' }}>Lembur (Rp)</th>
                  <th style={{ width: '130px' }}>Bonus (Rp)</th>
                  <th style={{ width: '130px' }}>Kasbon (Rp)</th>
                  <th style={{ width: '130px' }}>Pot. Absen (Rp)</th>
                  <th>PPh 21 TER</th>
                  <th>THP Bersih</th>
                  <th style={{ textAlign: 'right' }}>Slip</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.employee_name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.nik_masked} · {item.ptkp_status}</div>
                    </td>
                    <td style={{ color: 'var(--text-soft)' }}>{formatRupiah(Number(item.basic_salary))}</td>
                    <td>
                      <input
                        type="number"
                        disabled={isApproved}
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                        defaultValue={item.overtime_pay}
                        onBlur={(e) => handleUpdateItem(item.id, 'overtime_pay', Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        disabled={isApproved}
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                        defaultValue={item.bonus_amount}
                        onBlur={(e) => handleUpdateItem(item.id, 'bonus_amount', Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        disabled={isApproved}
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                        defaultValue={item.loan_deduction}
                        onBlur={(e) => handleUpdateItem(item.id, 'loan_deduction', Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        disabled={isApproved}
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                        defaultValue={item.absence_deduction}
                        onBlur={(e) => handleUpdateItem(item.id, 'absence_deduction', Number(e.target.value))}
                      />
                    </td>
                    <td style={{ color: 'var(--warning-text)', fontWeight: 600 }}>
                      {formatRupiah(Number(item.pph21_amount))}
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {formatRupiah(Number(item.thp))}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedSlip(item.id)}
                      >
                        <i className="fa-regular fa-file-lines"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* STEP 3 & 4: Review Summary & Approval */}
      {step >= 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* KPI Summary Cards */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <article className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Gaji Bruto</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {formatRupiah(Number(period.total_gross_salary) || 0)}
              </div>
            </article>

            <article className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total PPh 21 TER</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--warning-text)', marginTop: '0.25rem' }}>
                {formatRupiah(Number(period.total_pph21) || 0)}
              </div>
            </article>

            <article className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Transfer Bank (THP)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {formatRupiah(Number(period.total_thp) || 0)}
              </div>
            </article>

            <article className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Beban Perusahaan</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--purple-text)', marginTop: '0.25rem' }}>
                {formatRupiah(Number(period.total_employer_cost) || 0)}
              </div>
            </article>
          </section>

          {/* Action Bar */}
          <section className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', margin: 0, fontWeight: 600 }}>Status Approval & Pengesahan</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {isApproved
                  ? 'Periode telah disahkan dengan PIN Owner. Data slip gaji bersifat permanen (Immutable).'
                  : isSubmitted
                  ? 'Payroll telah diajukan. Masukkan PIN 6-digit Owner untuk mengesahkan dan mengunci.'
                  : 'Pastikan seluruh angka telah akurat sebelum mengajukan payroll ke Owner.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!isApproved && !isSubmitted && (
                <button className="btn btn-secondary" onClick={handleSubmitForApproval}>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Submit untuk Ditinjau Owner</span>
                </button>
              )}

              {!isApproved && (
                <button className="btn btn-primary" onClick={() => setShowPinModal(true)}>
                  <i className="fa-solid fa-lock"></i>
                  <span>Approval dengan PIN 6-Digit</span>
                </button>
              )}
            </div>
          </section>

          {/* Items Table */}
          <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.9375rem', margin: 0, fontWeight: 600 }}>Rincian Slip Gaji Karyawan ({items.length})</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Karyawan</th>
                    <th>PTKP & TER</th>
                    <th>Gaji Bruto</th>
                    <th>BPJS Pekerja</th>
                    <th>PPh 21 TER</th>
                    <th>Potongan Lain</th>
                    <th>THP Bersih</th>
                    <th style={{ textAlign: 'right' }}>Slip Gaji</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.employee_name}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.nik_masked}</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{item.ptkp_status}</span>
                      </td>
                      <td>{formatRupiah(Number(item.gross_earnings))}</td>
                      <td style={{ color: 'var(--text-soft)' }}>{formatRupiah(Number(item.total_bpjs_employee))}</td>
                      <td style={{ color: 'var(--warning-text)', fontWeight: 600 }}>{formatRupiah(Number(item.pph21_amount))}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatRupiah(Number(item.loan_deduction) + Number(item.absence_deduction))}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatRupiah(Number(item.thp))}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedSlip(item.id)}
                        >
                          <i className="fa-solid fa-file-pdf" style={{ color: 'var(--primary)', marginRight: '0.25rem' }}></i>
                          <span>Lihat & Unduh PDF</span>
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

      {/* Payslip Modal */}
      {selectedSlip && (
        <PayslipModal resultId={selectedSlip} onClose={() => setSelectedSlip(null)} />
      )}

      {/* Owner PIN Modal */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '1rem',
              }}
            >
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.5rem', fontWeight: 700 }}>
              Konfirmasi Otorisasi Owner
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Masukkan 6-digit PIN Keamanan Anda untuk menyetujui dan mengunci periode gaji ini secara permanen.
            </p>

            {pinError && <div className="alert alert-danger"><i className="fa-solid fa-circle-exclamation"></i>{pinError}</div>}

            <form onSubmit={handleApproveWithPin}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  className="form-control"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.4em', fontWeight: 700 }}
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowPinModal(false);
                    setPin('');
                    setPinError(null);
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={pinSubmitting || pin.length !== 6}
                >
                  {pinSubmitting ? 'Memverifikasi...' : 'Sahkan & Kunci'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
