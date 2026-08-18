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
    currentMonthPayroll: 0,
    totalPph21: 0,
    totalBpjsEmployer: 0,
    totalOvertime: 0,
    latestPeriodId: null as string | null,
    latestPeriodStatus: 'DRAFT',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const empRes = await apiFetch<any>('/employees', { token });
        const employees = empRes.data || [];

        const payrollRes = await apiFetch<any>('/payroll/periods', { token });
        const periods = payrollRes.data || [];
        const latest = periods[0] || null;

        setStats({
          activeEmployees: employees.filter((e: any) => e.status === 'ACTIVE').length,
          currentMonthPayroll: latest ? Number(latest.total_gross_salary) || 0 : 0,
          totalPph21: latest ? Number(latest.total_pph21) || 0 : 0,
          totalBpjsEmployer: latest ? Number(latest.total_bpjs_employer) || 0 : 0,
          totalOvertime: 0,
          latestPeriodId: latest ? latest.id : null,
          latestPeriodStatus: latest ? latest.status : 'NONE',
        });
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [token]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Banner (UX Pilot Mockup Style) */}
      <section className="hero-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', padding: '1.75rem 2rem' }}>
        <div style={{ paddingLeft: '0.5rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Payroll Bulan Berjalan
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.875rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
              {formatRupiah(stats.currentMonthPayroll)}
            </h2>
            <span className="badge badge-success" style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Sesuai Regulasi PMK 168/2023
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.5rem' }}>
            {stats.activeEmployees} Karyawan Aktif · Terintegrasi BPJS & PPh 21 TER Otomatis
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
            onClick={() => navigate('/employees')}
            style={{ padding: '0.625rem 1.25rem' }}
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Kelola Karyawan</span>
          </button>
        </div>
      </section>

      {/* KPI Row */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Karyawan Aktif */}
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              <i className="fa-solid fa-users"></i>
            </div>
            <span className="badge badge-primary">Master Data</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Karyawan Aktif
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {loading ? '...' : `${stats.activeEmployees} Orang`}
          </p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-faint)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
            Auto-Mapping TER A/B/C & NIK Masking
          </p>
        </article>

        {/* Total Pajak PPh 21 TER */}
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--warning-light)',
                color: 'var(--warning-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              <i className="fa-solid fa-receipt"></i>
            </div>
            <span className="badge badge-warning">PPh 21 TER</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pajak PPh 21 Dipotong
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {loading ? '...' : formatRupiah(stats.totalPph21)}
          </p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-faint)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span>
            125 Lapisan TER Bulanan & Rekonsiliasi Des
          </p>
        </article>

        {/* Biaya BPJS Perusahaan */}
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--purple-light)',
                color: 'var(--purple-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              <i className="fa-solid fa-shield-heart"></i>
            </div>
            <span className="badge badge-purple">5 Program BPJS</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Beban BPJS Perusahaan
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {loading ? '...' : formatRupiah(stats.totalBpjsEmployer)}
          </p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-faint)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--purple)' }}></span>
            JKK, JKM, JHT, JP & BPJS Kesehatan
          </p>
        </article>
      </section>

      {/* Grid: Overview Quick Actions & Compliance Checklist */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Compliance Checklist Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>
              <i className="fa-solid fa-list-check" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i>
              Checklist Kepatuhan Pajak & Payroll
            </h3>
            <span className="badge badge-success">Terverifikasi</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', fontSize: '0.9rem' }}></i>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Tabel TER PMK 168/2023 (125 Lapisan)</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>Kategori A, B, dan C aktif terhitung otomatis</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', fontSize: '0.9rem' }}></i>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Plafon Iuran BPJS Ketenagakerjaan & Kesehatan</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>JP (maks Rp 10.042.300) & Kes (maks Rp 12.000.000)</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', fontSize: '0.9rem' }}></i>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Kompensasi Lembur PP 35/2021</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>Rumus 1/173 upah sebulan dengan tarif bertingkat</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', fontSize: '0.9rem' }}></i>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Bukti Potong Formulir 1721-A1</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>Tersedia otomatis untuk pelaporan SPT Tahunan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launchpad Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>
              <i className="fa-solid fa-bolt" style={{ color: 'var(--warning)', marginRight: '0.5rem' }}></i>
              Akses Cepat Modul
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div
              onClick={() => navigate('/payroll')}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-calculator" style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'block' }}></i>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Payroll Wizard</p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>4 langkah gaji</p>
            </div>

            <div
              onClick={() => navigate('/employees')}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-user-gear" style={{ color: 'var(--success)', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'block' }}></i>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Master Karyawan</p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Data & Gaji</p>
            </div>

            <div
              onClick={() => navigate('/tax-reports')}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-file-invoice-dollar" style={{ color: 'var(--warning-text)', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'block' }}></i>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Laporan Pajak</p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Form 1721-A1</p>
            </div>

            <div
              onClick={() => navigate('/payroll')}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-file-pdf" style={{ color: 'var(--purple)', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'block' }}></i>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>Slip Gaji PDF</p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Unduh resmi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
