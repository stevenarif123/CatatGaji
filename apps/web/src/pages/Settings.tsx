import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatRupiah } from '@catatgaji/shared';

export const Settings: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'PROFILE';
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BRANCHES' | 'SECURITY' | 'AUDIT' | 'DEBUG'>(initialTab);
  const [loading, setLoading] = useState(true);

  // Debug / Demo State
  const [seedingMock, setSeedingMock] = useState(false);
  const [resettingMock, setResettingMock] = useState(false);
  const [debugSuccess, setDebugSuccess] = useState<string | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);

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

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profRes, branchRes, auditRes] = await Promise.all([
        apiFetch<any>('/settings/profile', { token }),
        apiFetch<any>('/branches', { token }),
        apiFetch<any>('/settings/audit-logs?limit=50', { token }),
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
      setAuditLogs(auditRes.data || []);
    } catch (err: any) {
      console.error('Gagal memuat pengaturan:', err);
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

  // Handle Seed Demo Data
  const handleSeedDemoData = async () => {
    setSeedingMock(true);
    setDebugSuccess(null);
    setDebugError(null);
    try {
      const res = await apiFetch<any>('/debug/seed-demo-data', {
        method: 'POST',
        token,
        body: {},
      });
      setDebugSuccess(res.message || 'Data mock berhasil dibuat!');
      loadSettings();
    } catch (err: any) {
      setDebugError(err.message || 'Gagal membuat data mock.');
    } finally {
      setSeedingMock(false);
    }
  };

  // Handle Reset Demo Data
  const handleResetDemoData = async () => {
    if (!window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data karyawan, absensi, dan penggajian? Akun perusahaan tetap aman.')) {
      return;
    }
    setResettingMock(true);
    setDebugSuccess(null);
    setDebugError(null);
    try {
      const res = await apiFetch<any>('/debug/reset-demo-data', {
        method: 'POST',
        token,
        body: {},
      });
      setDebugSuccess(res.message || 'Seluruh data berhasil di-reset.');
      loadSettings();
    } catch (err: any) {
      setDebugError(err.message || 'Gagal me-reset data.');
    } finally {
      setResettingMock(false);
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
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'PROFILE', label: 'Profil Perusahaan & Pajak Badan', icon: 'fa-solid fa-building' },
          { id: 'BRANCHES', label: 'Cabang & UMK Daerah', icon: 'fa-solid fa-network-wired' },
          { id: 'SECURITY', label: 'Keamanan & PIN Pengesahan', icon: 'fa-solid fa-shield-halved' },
          { id: 'AUDIT', label: 'Log Audit Forensik (UU PDP)', icon: 'fa-solid fa-clipboard-list' },
          { id: 'DEBUG', label: '🛠️ Menu Debug & Mock Data', icon: 'fa-solid fa-flask-vial' },
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

      {/* TAB 4: LOG AUDIT FORENSIK (UU PDP NO. 27/2022 & PRD 8.4) */}
      {activeTab === 'AUDIT' && (
        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Catatan Log Audit Forensik Tak Dapat Diubah</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Riwayat seluruh otorisasi finansial, persetujuan cuti/lembur, dan mutasi data sensitif (Kepatuhan UU PDP No. 27/2022).
              </p>
            </div>
            <span className="badge badge-success">
              <i className="fa-solid fa-lock"></i> Immutable Append-Only
            </span>
          </div>

          {auditLogs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-clipboard-check fa-2x" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}></i>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Belum ada rekaman log audit forensik</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Waktu (WIB)</th>
                    <th>Nama Pelaksana</th>
                    <th>Tindakan / Aksi</th>
                    <th>Entitas Target</th>
                    <th>Rincian Parameter</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </td>
                      <td style={{ fontWeight: 600 }}>{log.user_name || 'Admin Sistem'}</td>
                      <td>
                        <span className="badge badge-primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                          {log.entity_type} {log.entity_id ? `(#${log.entity_id.slice(-6)})` : ''}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-soft)', maxWidth: '300px' }}>
                        {log.new_values ? (
                          <pre style={{ margin: 0, fontSize: '0.7rem', backgroundColor: '#f8fafc', padding: '4px 6px', borderRadius: '4px', overflowX: 'auto' }}>
                            {typeof log.new_values === 'string' ? log.new_values : JSON.stringify(log.new_values, null, 2)}
                          </pre>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 5: MENU DEBUG & DEMO DATA GENERATOR */}
      {activeTab === 'DEBUG' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
          {debugSuccess && (
            <div className="alert alert-success">
              <i className="fa-solid fa-circle-check"></i>
              <span>{debugSuccess}</span>
            </div>
          )}
          {debugError && (
            <div className="alert alert-danger">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{debugError}</span>
            </div>
          )}

          <section className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                <i className="fa-solid fa-flask-vial"></i>
              </div>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                  Pusat Generator Data Uji Coba (Sandbox & Testing)
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Gunakan menu ini untuk menghasilkan data tiruan yang realistis guna menguji seluruh modul sistem.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-users text-primary"></i> 5 Karyawan Beragam
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Manager, Senior Dev, Staff, Marketing, & Warehouse dengan status TER A, TER B, gaji Rp 5jt - 15jt, BPJS 5 program, dan NPWP valid.
                </p>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-calendar-check text-success"></i> 10 Hari Log Absensi
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Simulasi jam masuk (08:00 WIB), jam pulang (17:00 WIB), variasi keterlambatan, dan lembur 2 jam otomatis.
                </p>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-calculator text-warning"></i> Periode Penggajian Aktif
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Periode draf bulan ini siap dikalkulasikan dengan 1-klik untuk memeriksa PPh 21 TER, slip gaji, dan ekspor formulir pajak.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={handleSeedDemoData}
                disabled={seedingMock || resettingMock}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}
              >
                <i className={`fa-solid ${seedingMock ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                <span>{seedingMock ? 'Sedang Membuat Data Mock...' : '🚀 Generate Data Mock Lengkap'}</span>
              </button>

              <button
                className="btn btn-danger"
                onClick={handleResetDemoData}
                disabled={seedingMock || resettingMock}
                style={{ padding: '0.75rem 1.25rem' }}
              >
                <i className={`fa-solid ${resettingMock ? 'fa-spinner fa-spin' : 'fa-trash-can'}`}></i>
                <span>{resettingMock ? 'Membersihkan...' : 'Reset Seluruh Data Uji Coba'}</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
