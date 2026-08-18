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
    setProcessing(true);
    setError(null);
    try {
      await apiFetch<any>(`/payroll/periods/${periodId}/submit`, {
        method: 'POST',
        token,
      });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Gagal submit periode');
    } finally {
      setProcessing(false);
    }
  };

  // Step 4: Owner PIN Approval
  const handleApproveWithPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinSubmitting(true);
    setPinError(null);

    try {
      await apiFetch<any>(`/payroll/periods/${periodId}/approve`, {
        method: 'POST',
        token,
        body: { pin },
      });
      setShowPinModal(false);
      await loadData();
    } catch (err: any) {
      setPinError(err.message || 'Gagal menyetujui penggajian');
    } finally {
      setPinSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        Memuat wizard penggajian...
      </div>
    );
  }

  if (!period) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <p>Periode tidak ditemukan.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/payroll')}>
          Kembali ke Penggajian
        </button>
      </div>
    );
  }

  const monthName = MONTH_NAMES[period.period_month - 1];
  const isLocked = period.status === 'APPROVED';

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Top Breadcrumb & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => navigate('/payroll')}
            style={{ marginBottom: '0.5rem' }}
          >
            ← Kembali ke Daftar Periode
          </button>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>
            Penggajian {monthName} {period.period_year}
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Tanggal Pembayaran: <strong>{formatTanggal(period.payout_date)}</strong> | Rentang:{' '}
            {formatTanggal(period.start_date)} s/d {formatTanggal(period.end_date)}
          </p>
        </div>

        <div>
          <span className={`badge ${
            isLocked ? 'badge-success' : period.status === 'SUBMITTED' ? 'badge-warning' : 'badge-secondary'
          }`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            {isLocked ? '🔒 FINAL & LOCKED' : `Status: ${period.status}`}
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          border: '1px solid #e74c3c',
          borderRadius: 'var(--radius-sm)',
          color: '#e74c3c',
          marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}

      {/* Stepper Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '1.5rem',
        backgroundColor: 'var(--color-bg-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        {[
          { num: 1, label: '1. Inisialisasi & Batch Run' },
          { num: 2, label: '2. Input Lembur & Komponen Variabel' },
          { num: 3, label: '3. Review Rekapitulasi & Approval' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            style={{
              flex: 1,
              padding: '0.875rem',
              border: 'none',
              background: step === s.num ? 'var(--color-primary)' : 'transparent',
              color: step === s.num ? '#fff' : 'var(--color-text)',
              fontWeight: step === s.num ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* STEP 1: INITIALIZATION */}
      {step === 1 && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <h2 style={{ margin: '0 0 0.5rem' }}>Jalankan Mesin Penggajian</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
            Sistem akan secara otomatis mengambil seluruh karyawan aktif, menghitung gaji pokok, tunjangan tetap,
            5 program BPJS, serta tarif pajak PPh 21 TER (PMK 168/2023).
          </p>

          {isLocked ? (
            <div style={{ color: '#27ae60', fontWeight: 'bold' }}>
              ✅ Periode ini telah disetujui oleh Owner dan data telah dikunci.
            </div>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleRunCalculation}
              disabled={processing}
              style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
            >
              {processing ? 'Menghitung Penggajian...' : '🚀 Mulai Kalkulasi Batch Sekarang'}
            </button>
          )}
        </div>
      )}

      {/* STEP 2: VARIABLE INPUTS */}
      {step === 2 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Input Variabel Lembur & Penyesuaian</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                Masukkan upah lembur, bonus/THR, dan potongan kasbon/absen. Sistem otomatis mengkalkulasi ulang PPh 21 TER dan THP.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              Lanjut ke Review Rekapitulasi ➔
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Karyawan</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Gaji Pokok + Tunj Tetap</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Lembur (Rp)</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Bonus / THR (Rp)</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Kasbon / Absen (Rp)</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>PPh 21 TER</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Take Home Pay</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <div style={{ fontWeight: 500 }}>{it.employee_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {it.ptkp_status} (TER {it.ter_category})
                      </div>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      {formatRupiah(Number(it.basic_salary))}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '130px' }}
                        defaultValue={it.overtime_pay}
                        disabled={isLocked}
                        onBlur={(e) => handleUpdateItem(it.id, 'overtime_pay', Number(e.target.value))}
                      />
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '130px' }}
                        defaultValue={it.bonus_amount}
                        disabled={isLocked}
                        onBlur={(e) => handleUpdateItem(it.id, 'bonus_amount', Number(e.target.value))}
                      />
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '130px' }}
                        defaultValue={it.loan_deduction}
                        disabled={isLocked}
                        onBlur={(e) => handleUpdateItem(it.id, 'loan_deduction', Number(e.target.value))}
                      />
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: '#e74c3c' }}>
                      {formatRupiah(it.pph21_amount)}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 'bold', color: '#27ae60' }}>
                      {formatRupiah(it.thp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 3: EXECUTIVE SUMMARY & APPROVAL */}
      {step === 3 && (
        <div>
          {/* KPI Executive Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Total Gaji Kotor (Gross)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
                {formatRupiah(period.total_gross)}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Total Potongan BPJS Pekerja</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#f39c12', marginTop: '0.25rem' }}>
                {formatRupiah(period.total_bpjs_employee)}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Setoran PPh 21 TER (DJP)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#e74c3c', marginTop: '0.25rem' }}>
                {formatRupiah(period.total_pph21)}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Total THP (Transfer Bank)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#27ae60', marginTop: '0.25rem' }}>
                {formatRupiah(period.total_thp)}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Beban Total Perusahaan</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                {formatRupiah(period.total_employer_cost)}
              </div>
            </div>
          </div>

          {/* Detailed Employee Payroll Table */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Rincian Slip Gaji Karyawan ({items.length} Orang)</h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!isLocked && period.status === 'DRAFT' && (
                  <button
                    className="btn btn-warning"
                    onClick={handleSubmitForApproval}
                    disabled={processing}
                  >
                    📝 Submit untuk Approval Owner
                  </button>
                )}
                {!isLocked && (period.status === 'SUBMITTED' || period.status === 'DRAFT') && (
                  <button
                    className="btn btn-success"
                    onClick={() => setShowPinModal(true)}
                  >
                    🔒 Setujui & Kunci dengan PIN Owner
                  </button>
                )}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Nama Karyawan</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>PTKP / TER</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Bruto</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>BPJS Pekerja</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>PPh 21 TER</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>THP Bersih</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Slip Gaji</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <div style={{ fontWeight: 500 }}>{it.employee_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {it.nik_masked} | {it.bank_name || 'BCA'} {it.bank_account_no}
                        </div>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span className="badge badge-info">{it.ptkp_status}</span>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                          TER {it.ter_category} ({(Number(it.effective_ter_rate) * 100).toFixed(2)}%)
                        </div>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        {formatRupiah(it.gross_earnings)}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f39c12' }}>
                        {formatRupiah(it.total_bpjs_employee)}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#e74c3c' }}>
                        {formatRupiah(it.pph21_amount)}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 'bold', color: '#27ae60' }}>
                        {formatRupiah(it.thp)}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedSlip({ ...it, company_name: 'PT CatatGaji Organisasi' })}
                        >
                          👁️ Lihat Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Slip Modal Component */}
      <PayslipModal
        data={selectedSlip}
        onClose={() => setSelectedSlip(null)}
      />

      {/* Modal Owner PIN Approval */}
      {showPinModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '420px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h3 style={{ margin: '0 0 0.5rem' }}>Persetujuan Gaji oleh Owner</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Masukkan 6-digit PIN Owner untuk mengunci data penggajian dan mengesahkan seluruh slip gaji periode ini.
            </p>

            {pinError && (
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                border: '1px solid #e74c3c',
                borderRadius: 'var(--radius-sm)',
                color: '#e74c3c',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}>
                {pinError}
              </div>
            )}

            <form onSubmit={handleApproveWithPin}>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  className="form-control"
                  style={{
                    fontSize: '1.75rem',
                    textAlign: 'center',
                    letterSpacing: '0.5rem',
                    fontWeight: 'bold',
                  }}
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPinModal(false)}
                  disabled={pinSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={pinSubmitting || pin.length !== 6}
                >
                  {pinSubmitting ? 'Memverifikasi PIN...' : '✅ Sahkan & Kunci Gaji'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
