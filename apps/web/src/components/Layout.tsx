import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { OfflineBanner } from './OfflineBanner';

export const Layout: React.FC = () => {
  const { role, userName, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Ringkasan Utama', to: '/', icon: 'fa-solid fa-chart-pie' },
    { label: 'Proses Penggajian', to: '/payroll', icon: 'fa-solid fa-calculator' },
    { label: 'Pusat Persetujuan', to: '/approvals', icon: 'fa-solid fa-user-check' },
    { label: 'Data Karyawan', to: '/employees', icon: 'fa-solid fa-users' },
    { label: 'Kehadiran & Absensi', to: '/attendance', icon: 'fa-regular fa-clock' },
    { label: 'Laporan Finansial & Pajak', to: '/tax-reports', icon: 'fa-solid fa-file-invoice-dollar' },
    { label: 'Portal Karyawan (ESS)', to: '/portal-karyawan', icon: 'fa-solid fa-mobile-screen-button' },
    { label: 'Pengaturan Sistem', to: '/settings', icon: 'fa-solid fa-gear' },
    { label: '🛠️ Sandbox / Demo Data', to: '/settings?tab=DEBUG', icon: 'fa-solid fa-flask-vial' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-app)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid var(--border-color)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: '2px 0 12px rgba(0, 80, 203, 0.03)',
        }}
      >
        {/* Brand Header */}
        <div style={{ height: '68px', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(0, 80, 203, 0.25)',
              }}
            >
              <i className="fa-solid fa-coins"></i>
            </div>
            <div>
              <p style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                CatatGaji
              </p>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Payroll & HRIS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.15s ease',
              })}
            >
              <i className={`${item.icon}`} style={{ width: '18px', textAlign: 'center', fontSize: '0.9rem' }}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div style={{ padding: '0.875rem', borderTop: '1px solid var(--border-color)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  border: '1px solid var(--primary-active)',
                }}
              >
                {(userName || 'P').charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userName || 'Pemilik Usaha'}
                </p>
                <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-muted)', margin: 0 }}>
                  {role === 'OWNER' ? 'Pemilik (Owner)' : role || 'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari Akun"
              className="btn btn-sm btn-secondary"
              style={{ padding: '0.35rem 0.5rem', color: 'var(--danger-text)' }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <OfflineBanner />

        {/* Top Header Bar */}
        <header
          style={{
            height: '68px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 20,
            boxShadow: '0 1px 4px rgba(11, 28, 48, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span className="badge badge-success" style={{ padding: '0.3rem 0.65rem' }}>
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '10px' }}></i> PMK 168/2023 & UU HPP
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Sistem Penggajian & Pajak Terstandar Nasional Indonesia
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-soft)' }}>
              <i className="fa-regular fa-calendar" style={{ color: 'var(--primary)' }}></i>
              <span>Periode Aktif: <strong>{new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</strong></span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1600px', width: '100%', margin: '0 auto', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
