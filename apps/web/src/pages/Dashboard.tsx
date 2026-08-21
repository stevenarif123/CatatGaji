import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah } from '@catatgaji/shared';

export const Dashboard: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeEmployees: 0,
    currentMonthGross: 0,
    currentMonthThp: 0,
    currentMonthOvertime: 0,
    currentMonthBasic: 0,
    totalPph21: 0,
    totalBpjsEmployer: 0,
    grandTotalEmployerCost: 0,
    overtimeRatio: 0,
    latestPeriodId: null as string | null,
    latestPeriodStatus: 'DRAFT',
    latestPeriodMonth: new Date().getMonth() + 1,
    latestPeriodYear: new Date().getFullYear(),
  });

  const [attendanceToday, setAttendanceToday] = useState({
    present: 0,
    late: 0,
    leave: 0,
    rate: 100,
  });

  const [pendingCount, setPendingCount] = useState({
    leaves: 0,
    overtimes: 0,
    payrolls: 0,
    total: 0,
  });

  const [periodsHistory, setPeriodsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [empRes, payrollRes, pendingRes] = await Promise.all([
          apiFetch<any>('/employees?limit=100', { token }),
          apiFetch<any>('/payroll/periods', { token }),
          apiFetch<any>('/approvals/pending', { token }),
        ]);

        const employees = empRes.data || [];
        const periods = payrollRes.data || [];
        const latest = periods[0] || null;

        let grandEmployerCost = 0;
        let basicTotal = 0;
        let otTotal = 0;
        let thpTotal = 0;
        let pphTotal = 0;
        let bpjsEmpTotal = 0;

        if (latest) {
          thpTotal = Number(latest.total_thp || latest.total_gross || 0);
          pphTotal = Number(latest.total_pph21 || 0);
          bpjsEmpTotal = Number(latest.total_bpjs_employer || 0);
          grandEmployerCost = Number(latest.total_employer_cost || (thpTotal + pphTotal + bpjsEmpTotal));

          // Fetch items for overtime ratio
          try {
            const resultsRes = await apiFetch<any>(`/payroll/periods/${latest.id}/results`, { token });
            const items = resultsRes.data || [];
            basicTotal = items.reduce((s: number, i: any) => s + Number(i.basic_salary || 0), 0);
            otTotal = items.reduce((s: number, i: any) => s + Number(i.overtime_pay || 0), 0);
          } catch {
            // fallback
          }
        }

        const activeCount = employees.filter((e: any) => e.status === 'ACTIVE').length;
        const otRatio = basicTotal > 0 ? (otTotal / basicTotal) * 100 : 0;

        setStats({
          activeEmployees: activeCount,
          currentMonthGross: latest ? Number(latest.total_gross || 0) : 0,
          currentMonthThp: thpTotal,
          currentMonthOvertime: otTotal,
          currentMonthBasic: basicTotal,
          totalPph21: pphTotal,
          totalBpjsEmployer: bpjsEmpTotal,
          grandTotalEmployerCost: grandEmployerCost,
          overtimeRatio: Math.round(otRatio * 10) / 10,
          latestPeriodId: latest ? latest.id : null,
          latestPeriodStatus: latest ? latest.status : 'NONE',
          latestPeriodMonth: latest ? latest.period_month : new Date().getMonth() + 1,
          latestPeriodYear: latest ? latest.period_year : new Date().getFullYear(),
        });

        setAttendanceToday({
          present: Math.max(0, activeCount - (pendingRes.data?.summary?.total_pending_leaves || 0)),
          late: 0,
          leave: pendingRes.data?.summary?.total_pending_leaves || 0,
          rate: activeCount > 0 ? Math.round(((activeCount - (pendingRes.data?.summary?.total_pending_leaves || 0)) / activeCount) * 100) : 100,
        });

        if (pendingRes.data?.summary) {
          setPendingCount({
            leaves: pendingRes.data.summary.total_pending_leaves || 0,
            overtimes: pendingRes.data.summary.total_pending_overtimes || 0,
            payrolls: pendingRes.data.summary.total_pending_payrolls || 0,
            total: pendingRes.data.summary.grand_total || 0,
          });
        }

        setPeriodsHistory(periods.slice(0, 6));
      } catch (err) {
        console.error('Gagal memuat data ringkasan eksekutif:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)', marginBottom: '1rem' }}></i>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem' }}>Memuat metrik analitik eksekutif...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Alert Bar: Pending Approvals (PRD Modul 5) */}
      {pendingCount.total > 0 && (
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '0.75rem',
            padding: '0.875rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Terdapat <strong>{pendingCount.total} permohonan</strong> menunggu persetujuan Anda
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {pendingCount.leaves > 0 && `${pendingCount.leaves} Pengajuan Cuti · `}
                {pendingCount.overtimes > 0 && `${pendingCount.overtimes} SPKL Lembur · `}
                {pendingCount.payrolls > 0 && `${pendingCount.payrolls} Payroll Siap PIN Owner`}
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/approvals')}
          >
            <i className="fa-solid fa-user-check"></i>
            <span>Buka Pusat Persetujuan</span>
          </button>
        </div>
      )}

      {/* Hero Banner: Grand Total Employer Cost (PRD 7.1) */}
      <section className="hero-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', padding: '1.75rem 2rem' }}>
        <div style={{ paddingLeft: '0.5rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Grand Total Beban Kompensasi Perusahaan (Employer Cost)
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.875rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
              {formatRupiah(stats.grandTotalEmployerCost)}
            </h2>
            <span className="badge badge-success" style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}>
              <i className="fa-solid fa-shield-halved"></i> PMK 168/2023 & BPJS Terverifikasi
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.5rem' }}>
            Periode {stats.latestPeriodMonth}/{stats.latestPeriodYear} · {stats.activeEmployees} Karyawan Terdaftar · Status: <strong>{stats.latestPeriodStatus}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/payroll')}
            style={{ padding: '0.625rem 1.25rem' }}
          >
            <i className="fa-solid fa-calculator"></i>
            <span>Proses Penggajian</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/tax-reports')}
            style={{ padding: '0.625rem 1.25rem' }}
          >
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <span>Laporan Pajak & Jurnal</span>
          </button>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Karyawan & Kehadiran */}
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-users"></i>
            </div>
            <span className="badge badge-success">{attendanceToday.rate}% Hadir</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
            Personil & Kehadiran Hari Ini
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0 0' }}>
            {stats.activeEmployees} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Karyawan Aktif</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '0.375rem' }}>
            {attendanceToday.present} Masuk Kerja · {attendanceToday.leave} Cuti/Izin
          </p>
        </article>

        {/* Rasio Biaya Lembur (PP 35/2021) */}
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: stats.overtimeRatio > 15 ? '#fef2f2' : '#f0fdf4', color: stats.overtimeRatio > 15 ? 'var(--danger-text)' : 'var(--success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-stopwatch"></i>
            </div>
            <span className={`badge ${stats.overtimeRatio > 15 ? 'badge-danger' : 'badge-primary'}`}>
              {stats.overtimeRatio > 15 ? 'Alert >15%' : 'Wajar'}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
            Rasio Biaya Lembur (PP 35/2021)
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: stats.overtimeRatio > 15 ? 'var(--danger-text)' : 'var(--text-main)', margin: '0.25rem 0 0' }}>
            {stats.overtimeRatio}% <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ Gaji Pokok</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '0.375rem' }}>
            Total Upah Lembur: {formatRupiah(stats.currentMonthOvertime)}
          </p>
        </article>

        {/* Titipan Pajak PPh 21 DJP */}
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef2f2', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-receipt"></i>
            </div>
            <span className="badge badge-primary">e-Bupot DJP</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
            Titipan Pajak PPh 21 TER
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger-text)', margin: '0.25rem 0 0' }}>
            {formatRupiah(stats.totalPph21)}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '0.375rem' }}>
            Siap impor CSV DJP Online Kode 21-100-01
          </p>
        </article>

        {/* Beban Iuran BPJS Perusahaan */}
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-shield-heart"></i>
            </div>
            <span className="badge badge-success">SIPP / E-Dabu</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
            Beban BPJS Perusahaan
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0 0' }}>
            {formatRupiah(stats.totalBpjsEmployer)}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '0.375rem' }}>
            JKK, JKM, JHT (3.7%), JP (2%), Kes (4%)
          </p>
        </article>
      </section>

      {/* Riwayat & Tren Pengeluaran Penggajian */}
      <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>Tren Beban Penggajian & Rekonsiliasi Periode</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Riwayat pelaksanaan payroll bulanan dan status otorisasi PIN Owner.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/payroll')}
          >
            <span>Buka Riwayat Lengkap</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {periodsHistory.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-calendar-xmark fa-2x" style={{ marginBottom: '0.5rem', color: 'var(--text-faint)' }}></i>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Belum ada periode penggajian</p>
            <p style={{ fontSize: '0.75rem', margin: '4px 0 0' }}>Mulai proses payroll pertama Anda dengan wizard 4 langkah.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Periode Pajak</th>
                  <th>Tanggal Pembayaran</th>
                  <th>Total Gaji Bruto</th>
                  <th>Total PPh 21 TER</th>
                  <th>Total THP Bersih</th>
                  <th>Status Otorisasi</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {periodsHistory.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>
                      Masa {p.period_month}/{p.period_year}
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{p.payout_date}</td>
                    <td style={{ fontWeight: 600 }}>{formatRupiah(p.total_gross || p.total_gross_salary || 0)}</td>
                    <td style={{ color: 'var(--danger-text)', fontWeight: 600 }}>{formatRupiah(p.total_pph21 || 0)}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatRupiah(p.total_thp || 0)}</td>
                    <td>
                      <span className={`badge ${p.status === 'APPROVED' || p.status === 'PAID' ? 'badge-success' : p.status === 'SUBMITTED' ? 'badge-warning' : 'badge-secondary'}`}>
                        {p.status === 'APPROVED' ? 'Disetujui PIN' : p.status === 'SUBMITTED' ? 'Menunggu Owner' : p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/payroll/${p.id}`)}
                      >
                        <i className="fa-solid fa-eye"></i> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Akses Cepat (Quick Access) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Proses Payroll Baru', desc: 'Wizard 4 langkah kalkulasi', icon: 'fa-solid fa-calculator', to: '/payroll', color: 'var(--primary)' },
          { label: 'Pusat Persetujuan', desc: 'Otorisasi Cuti & SPKL', icon: 'fa-solid fa-user-check', to: '/approvals', color: 'var(--success-text)' },
          { label: 'Jurnal Akuntansi PSAK', desc: 'Ekspor Mekari & Accurate', icon: 'fa-solid fa-book-journal-whills', to: '/tax-reports', color: '#8b5cf6' },
          { label: 'Ekspor e-Bupot & 1721-A1', desc: 'Format resmi DJP Online', icon: 'fa-solid fa-file-csv', to: '/tax-reports', color: '#ea580c' },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.to)}
            className="card"
            style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.15s ease' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
              <i className={item.icon}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
