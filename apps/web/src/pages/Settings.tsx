import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah } from '@catatgaji/shared';

export const Settings: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BRANCHES' | 'SECURITY'>('PROFILE');
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [profile, setProfile] = useState<any>({
    company_name: '',
    company_slug: '',
    tier: '',
    npwp_badan: '',
    address: '',
    city: '',
    postal_code: '',
    tax_signatory_name: '',
    tax_signatory_nik: '',
    tax_signatory_npwp: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Branches State
  const [branches, setBranches] = useState<any[]>([]);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchWage, setNewBranchWage] = useState(5067381);
  const [savingBranch, setSavingBranch] = useState(false);

  // Security / PIN Form State
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [savingPin, setSavingPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profRes, branchRes] = await Promise.all([
        apiFetch<any>('/settings/profile', { token }),
        apiFetch<any>('/branches', { token }),
      ]);
      if (profRes.data) {
        setProfile({
          company_name: profRes.data.company_name || '',
          company_slug: profRes.data.company_slug || '',
          tier: profRes.data.tier || 'GROWTH',
          npwp_badan: profRes.data.npwp_badan || '',
          address: profRes.data.address || '',
          city: profRes.data.city || '',
          postal_code: profRes.data.postal_code || '',
          tax_signatory_name: profRes.data.tax_signatory_name || '',
          tax_signatory_nik: profRes.data.tax_signatory_nik || '',
          tax_signatory_npwp: profRes.data.tax_signatory_npwp || '',
        });
      }
      setBranches(branchRes.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      const res = await apiFetch<any>('/settings/profile', {
        method: 'PUT',
        token,
        body: profile,
      });
      setProfileMessage(res.message || 'Profil berhasil disimpan.');
    } catch (err: any) {
      setProfileError(err.message || 'Gagal menyimpan profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Add Branch
  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBranch(true);
    try {
      await apiFetch('/branches', {
        method: 'POST',
        token,
        body: {
          name: newBranchName,
          code: newBranchCode,
          city: newBranchCity,
          minimum_wage: Number(newBranchWage) || 5000000,
        },
      });
      setNewBranchName('');
      setNewBranchCode('');
      setNewBranchCity('');
      loadSettings();
    } catch (err: any) {
      alert(err.message || 'Gagal menambah cabang');
    } finally {
      setSavingBranch(false);
    }
  };

  // Handle Change PIN
  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);
    setPinError(null);

    if (newPin !== confirmPin) {
      setPinError('Konfirmasi PIN baru tidak sesuai.');
      return;
    }
    if (newPin.length !== 6) {
      setPinError('PIN baru harus tepat 6 digit angka.');
      return;
    }

    setSavingPin(true);
    try {
      const res = await apiFetch<any>('/settings/change-pin', {
        method: 'PUT',
        token,
        body: { old_pin: oldPin, new_pin: newPin },
      });
      setPinMessage(res.message || 'PIN berhasil diubah.');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (err: any) {
      setPinError(err.message || 'Gagal mengubah PIN.');
    } finally {
      setSavingPin(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Pengaturan Sistem & Organisasi</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
          Identitas Legal Pemotong Pajak (DJP Online), Kantor Cabang & UMK Wilayah, serta Keamanan PIN Owner
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'PROFILE', label: 'Profil Perusahaan & Pajak Badan', icon: 'fa-solid fa-building' },
          { id: 'BRANCHES', label: 'Cabang & UMK Daerah', icon: 'fa-solid fa-network-wired' },
          { id: 'SECURITY', label: 'Keamanan & PIN Pengesahan', icon: 'fa-solid fa-shield-halved' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: PROFIL PERUSAHAAN & IDENTITAS PEMOTONG PAJAK */}
      {activeTab === 'PROFILE' && (
        <section className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Identitas Organisasi & Pajak (DJP Online)</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Data ini digunakan untuk kepala formulir resmi 1721-A1 dan berkas impor CSV e-Bupot 21/26 DJP.
            </p>
          </div>

          {profileMessage && <div className="alert alert-success"><i className="fa-solid fa-circle-check"></i>{profileMessage}</div>}
          {profileError && <div className="alert alert-danger"><i className="fa-solid fa-circle-exclamation"></i>{profileError}</div>}

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin"></i> Memuat data profil...
            </div>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Badan Usaha / Perusahaan *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="PT Maju Bersama Nusantara"
                    value={profile.company_name}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">NPWP Badan 16-Digit (Format Baru / NIK)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="01.234.567.8-901.000"
                    value={profile.npwp_badan}
                    onChange={(e) => setProfile({ ...profile, npwp_badan: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Kantor Pusat / Domisili Pajak</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Jl. Jenderal Sudirman Kav. 52-53, Senayan"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Kota / Kabupaten</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Jakarta Selatan"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kode Pos</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="12190"
                    value={profile.postal_code}
                    onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                  />
                </div>
              </div>

              {/* Pejabat Penandatangan Bukti Potong */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem' }}>
                  <i className="fa-solid fa-signature" style={{ color: 'var(--primary)', marginRight: '0.35rem' }}></i>
                  Pejabat Penandatangan Bukti Potong (Signatory)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap Penandatangan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Budi Santoso (Direktur Utama)"
                      value={profile.tax_signatory_name}
                      onChange={(e) => setProfile({ ...profile, tax_signatory_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">NIK / NPWP Penandatangan</label>
                    <input
                      type="text"
                      maxLength={16}
                      className="form-control"
                      placeholder="3171012305950001"
                      value={profile.tax_signatory_nik}
                      onChange={(e) => setProfile({ ...profile, tax_signatory_nik: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                  <i className={`fa-solid ${savingProfile ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>
                  <span>{savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* TAB 2: CABANG & UMK WILAYAH */}
      {activeTab === 'BRANCHES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Form Tambah Cabang */}
          <section className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.9375rem', margin: '0 0 1rem', fontWeight: 700 }}>Tambah Kantor Cabang Baru</h2>
            <form onSubmit={handleAddBranch}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Cabang</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Cabang Surabaya"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kode Cabang</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="SBY-01"
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kota / Daerah</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Surabaya"
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upah Minimum (UMK Daerah)</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={newBranchWage}
                    onChange={(e) => setNewBranchWage(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={savingBranch}>
                  <i className="fa-solid fa-plus"></i>
                  <span>{savingBranch ? 'Menambahkan...' : 'Daftarkan Cabang'}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Tabel Cabang */}
          <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.875rem', margin: 0, fontWeight: 600 }}>Daftar Cabang & Dasar Kompensasi Lembur</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama Cabang</th>
                    <th>Kota / Wilayah</th>
                    <th>Upah Minimum (UMK)</th>
                    <th>Karyawan Aktif</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>{b.code}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.name}</td>
                      <td>{b.city || 'Jakarta'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--success-text)' }}>{formatRupiah(Number(b.minimum_wage) || 5067381)}</td>
                      <td>
                        <span className="badge badge-muted">{b.employee_count || 0} Orang</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: KEAMANAN & PIN OWNER */}
      {activeTab === 'SECURITY' && (
        <section className="card" style={{ padding: '2rem', maxWidth: '500px' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Ubah PIN Pengesahan Payroll (Owner)</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              PIN 6-digit digunakan sebagai tanda tangan digital persetujuan dan penguncian permanen penggajian.
            </p>
          </div>

          {pinMessage && <div className="alert alert-success"><i className="fa-solid fa-circle-check"></i>{pinMessage}</div>}
          {pinError && <div className="alert alert-danger"><i className="fa-solid fa-circle-exclamation"></i>{pinError}</div>}

          <form onSubmit={handleSavePin}>
            <div className="form-group">
              <label className="form-label">PIN Lama (Kosongkan jika belum pernah diatur)</label>
              <input
                type="password"
                maxLength={6}
                className="form-control"
                style={{ letterSpacing: '0.3em' }}
                placeholder="••••••"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PIN Baru (6 Digit Angka) *</label>
              <input
                type="password"
                maxLength={6}
                required
                className="form-control"
                style={{ letterSpacing: '0.3em' }}
                placeholder="••••••"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Konfirmasi PIN Baru *</label>
              <input
                type="password"
                maxLength={6}
                required
                className="form-control"
                style={{ letterSpacing: '0.3em' }}
                placeholder="••••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.625rem' }}
              disabled={savingPin}
            >
              <i className={`fa-solid ${savingPin ? 'fa-spinner fa-spin' : 'fa-key'}`}></i>
              <span>{savingPin ? 'Memperbarui PIN...' : 'Simpan PIN Baru'}</span>
            </button>
          </form>
        </section>
      )}
    </div>
  );
};
