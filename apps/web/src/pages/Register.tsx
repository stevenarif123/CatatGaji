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
    setLoading(true);

    try {
      const res = await apiFetch<any>('/auth/register-tenant', {
        method: 'POST',
        body: JSON.stringify({
          company_name: companyName,
          company_slug: companySlug,
          owner_name: ownerName,
          email,
          password,
          phone,
          tier,
        }),
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
      <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Daftarkan Organisasi Anda
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
            Setup akun CatatGaji dalam 2 menit tanpa kartu kredit
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">
                Nama Perusahaan / UMKM
              </label>
              <input
                id="companyName"
                type="text"
                className="form-input"
                placeholder="PT Maju Bersama"
                value={companyName}
                onChange={handleCompanyNameChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="companySlug">
                Subdomain / Slug
              </label>
              <input
                id="companySlug"
                type="text"
                className="form-input"
                placeholder="maju-bersama"
                value={companySlug}
                onChange={(e) => setCompanySlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="ownerName">
                Nama Pemilik / HR Admin
              </label>
              <input
                id="ownerName"
                type="text"
                className="form-input"
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
                className="form-input"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Resmi Organisasi
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@majubersama.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Kata Sandi Kuat (Min. 8 karakter)
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pilihan Paket Langganan</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              {(['STARTER', 'GROWTH', 'BUSINESS'] as const).map((t) => (
                <div
                  key={t}
                  onClick={() => setTier(t)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${tier === t ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: tier === t ? 'var(--primary-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{t}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {t === 'STARTER' ? 'Maks 25 Karyawan' : t === 'GROWTH' ? 'Maks 100 Karyawan' : 'Maks 500 Karyawan'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Mendaftarkan Organisasi...' : 'Daftar & Mulai Percobaan Gratis'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Sudah terdaftar?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Masuk ke Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
