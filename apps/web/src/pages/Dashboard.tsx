import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          border: 'none',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
              Fase 1 MVP Aktif
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0.25rem 0' }}>
              Selamat Datang di CatatGaji
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9375rem', maxWidth: '600px' }}>
              Platform penggajian terotomatisasi dengan perhitungan PPh 21 TER (PMK 168/2023), 5 program BPJS, lembur resmi PP 35/2021, dan perlindungan privasi data UU PDP.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/employees" className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
              + Tambah Karyawan
            </Link>
            <Link to="/payroll" className="btn btn-primary">
              ⚡ Hitung Penggajian
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Karyawan Aktif
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
            0 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>orang</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Maksimal kuota: 25 Karyawan (Starter)
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Estimasi Beban Gaji Bulanan
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
            Rp 0
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Periode berjalan belum dikalkulasi
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Status PPh 21 TER
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--success)' }}>
            100%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Sesuai PMK 168/2023 (Kategori A, B, C)
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Kepatuhan 5 BPJS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--primary)' }}>
            Aktif
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            JKK, JKM, JHT, JP, BPJS Kes
          </div>
        </div>
      </div>

      {/* Empty State / Onboarding Section as designed in PRD 06 */}
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            marginBottom: '1rem',
          }}
        >
          📋
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Belum Ada Data Penggajian</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
          Mulai dengan mendaftarkan data karyawan atau mengimpor file CSV data karyawan untuk menghitung kalkulasi PPh 21 TER dan BPJS secara otomatis.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <Link to="/employees" className="btn btn-primary">
            + Input Karyawan Pertama
          </Link>
          <Link to="/employees" className="btn btn-secondary">
            📥 Impor CSV / Excel
          </Link>
        </div>
      </div>
    </div>
  );
};
