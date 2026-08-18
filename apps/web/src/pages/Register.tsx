import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export const Register: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [companySlug, setCompanySlug] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<'STARTER' | 'GROWTH' | 'BUSINESS'>('GROWTH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCompanyName(val);
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setCompanySlug(slugified);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin && pin.length !== 6) {
      setError('PIN Pengesahan Payroll harus 6 digit angka');
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch<any>('/auth/register-tenant', {
        method: 'POST',
        body: {
          company_name: companyName,
          company_slug: companySlug,
          owner_name: ownerName,
          email,
          password,
          pin: pin || undefined,
          phone,
          tier,
        },
      });

      setAuth({
        token: res.data.token,
        user_id: res.data.user_id,
        tenant_id: res.data.tenant_id,
        role: 'OWNER',
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Periksa kembali form isian.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-app)',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '540px', padding: '2.25rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              marginBottom: '0.75rem',
            }}
          >
            <i className="fa-solid fa-building-columns"></i>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Daftarkan Organisasi Anda
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Setup akun CatatGaji dalam 2 menit · Rp 0 & Kepatuhan Penuh Regulasi Indonesia
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">
                Nama Perusahaan / Organisasi *
              </label>
              <input
                id="companyName"
                type="text"
                className="form-control"
                placeholder="PT Maju Bersama"
                value={companyName}
                onChange={handleCompanyNameChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="companySlug">
                Subdomain Slug *
              </label>
              <input
                id="companySlug"
                type="text"
                className="form-control"
                placeholder="maju-bersama"
                value={companySlug}
                onChange={(e) => setCompanySlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="ownerName">
                Nama Pemilik / HR Director *
              </label>
              <input
                id="ownerName"
                type="text"
                className="form-control"
                placeholder="Budi Santoso"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                No. WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                className="form-control"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Resmi *
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="admin@perusahaan.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Kata Sandi * (Min. 8)
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pin">
                PIN Owner 6-Digit (Approval)
              </label>
              <input
                id="pin"
                type="password"
                maxLength={6}
                className="form-control"
                placeholder="123456"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pilihan Paket Langganan</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.625rem' }}>
              {(['STARTER', 'GROWTH', 'BUSINESS'] as const).map((t) => (
                <div
                  key={t}
                  onClick={() => setTier(t)}
                  style={{
                    padding: '0.625rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${tier === t ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: tier === t ? 'var(--primary-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: tier === t ? 'var(--primary)' : 'var(--text-main)' }}>{t}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {t === 'STARTER' ? 'Maks 25 Org' : t === 'GROWTH' ? 'Maks 100 Org' : 'Maks 500 Org'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.625rem' }}
            disabled={loading}
          >
            <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-building-circle-check'}`}></i>
            <span>{loading ? 'Mendaftarkan Organisasi...' : 'Daftar & Masuk ke Dashboard'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Sudah terdaftar?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Masuk ke Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
