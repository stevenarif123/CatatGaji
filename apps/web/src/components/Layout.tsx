import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { OfflineBanner } from './OfflineBanner';

export const Layout: React.FC = () => {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: '📊 Dashboard', to: '/' },
    { label: '👥 Data Karyawan', to: '/employees' },
    { label: '⏱️ Kehadiran & Shift', to: '/attendance' },
    { label: '💰 Penggajian (Payroll)', to: '/payroll' },
    { label: '📑 Laporan Pajak & BPJS', to: '/tax-reports' },
    { label: '⚙️ Pengaturan Tenant', to: '/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-sidebar)',
          color: 'var(--text-inverse)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.125rem',
              }}
            >
              C
            </div>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                CatatGaji
              </h1>
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Payroll & HRIS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Role Aktif</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>{role || 'Admin'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <OfflineBanner />
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-success">Sistem Aktif</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Kepatuhan Regulasi Indonesia (PMK 168/2023 & UU HPP)
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Masa Pajak: <strong>{new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</strong>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
