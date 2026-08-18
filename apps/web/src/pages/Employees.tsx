import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { PTKP_TO_TER, formatRupiah } from '@catatgaji/shared';

export const Employees: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  const [employees, setEmployees] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [branchFilter, setBranchFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    nik_ktp: '',
    npwp: '',
    bpjs_tk_no: '',
    bpjs_kes_no: '',
    full_name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    birth_date: '',
    branch_id: '',
    join_date: new Date().toISOString().split('T')[0],
    employment_status: 'PKWTT',
    ptkp_status: 'TK/0',
    salary_type: 'MONTHLY',
    basic_salary: 5000000,
    fixed_allowance_name: 'Tunjangan Jabatan',
    fixed_allowance_amount: 0,
    bank_name: 'BCA',
    bank_account_no: '',
    bank_account_holder: '',
  });

  // Fetch Branches
  const loadBranches = useCallback(async () => {
    try {
      const res = await apiFetch<any>('/branches', { token });
      setBranches(res.data || []);
    } catch {
      // Ignored if empty
    }
  }, [token]);

  // Fetch Employees
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        status: statusFilter,
      });
      if (search) params.append('search', search);
      if (branchFilter) params.append('branch_id', branchFilter);

      const res = await apiFetch<any>(`/employees?${params.toString()}`, { token });
      setEmployees(res.data || []);
      setTotalPages(res.meta?.total_pages || 1);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, branchFilter, search, token]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadEmployees();
  };

  const handleInputChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        basic_salary: Number(formData.basic_salary) || 0,
        fixed_allowances:
          formData.fixed_allowance_amount > 0
            ? [{ name: formData.fixed_allowance_name, amount: Number(formData.fixed_allowance_amount) }]
            : [],
      };

      await apiFetch<any>('/employees', {
        method: 'POST',
        token,
        body: JSON.stringify(payload),
      });

      setShowAddModal(false);
      setModalStep(1);
      setFormData({
        nik_ktp: '',
        npwp: '',
        bpjs_tk_no: '',
        bpjs_kes_no: '',
        full_name: '',
        email: '',
        phone: '',
        gender: 'MALE',
        birth_date: '',
        branch_id: '',
        join_date: new Date().toISOString().split('T')[0],
        employment_status: 'PKWTT',
        ptkp_status: 'TK/0',
        salary_type: 'MONTHLY',
        basic_salary: 5000000,
        fixed_allowance_name: 'Tunjangan Jabatan',
        fixed_allowance_amount: 0,
        bank_name: 'BCA',
        bank_account_no: '',
        bank_account_holder: '',
      });
      loadEmployees();
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan data karyawan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menonaktifkan karyawan ${name}?`)) return;
    try {
      await apiFetch(`/employees/${id}`, { method: 'DELETE', token });
      loadEmployees();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus karyawan');
    }
  };

  // Preview TER Category based on chosen PTKP
  const currentTer = (PTKP_TO_TER as any)[formData.ptkp_status] || 'A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px' }}>
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Master Data Karyawan (HRIS)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Kelola data biodata, konfigurasi PTKP/TER, struktur gaji, dan rekening bank.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Tambah Karyawan
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Cari nama, NIK, atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ACTIVE">Status: Aktif</option>
              <option value="RESIGNED">Status: Resign</option>
              <option value="ALL">Semua Status</option>
            </select>
          </div>

          <div style={{ width: '200px' }}>
            <select
              className="form-select"
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-secondary btn-sm">
            🔍 Cari
          </button>
        </form>
      </div>

      {/* Employee List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Memuat data karyawan...
          </div>
        ) : employees.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👥</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Belum Ada Data Karyawan</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Klik tombol "+ Tambah Karyawan" untuk mendaftarkan pekerja pertama Anda.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Karyawan</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>NIK (Masked)</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Status Kerja</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>PTKP / TER</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Gaji Pokok</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Cabang</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{emp.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {emp.nik_ktp_masked}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge ${emp.employment_status === 'PKWTT' ? 'badge-primary' : 'badge-warning'}`}>
                        {emp.employment_status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div>
                        <strong>{emp.ptkp_status}</strong>
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          (TER {emp.pph21_ter_category})
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                      {formatRupiah(Number(emp.basic_salary || 0))}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                      {emp.branch_name || 'Kantor Pusat'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(emp.id, emp.full_name)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: 'none',
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Sebelumnya
            </button>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Halaman {page} dari {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </div>

      {/* Modal Tambah Karyawan */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Pendaftaran Karyawan Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Step Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              {[
                { step: 1, label: '1. Identitas' },
                { step: 2, label: '2. Pajak & BPJS' },
                { step: 3, label: '3. Gaji & Bank' },
              ].map((t) => (
                <button
                  key={t.step}
                  type="button"
                  onClick={() => setModalStep(t.step)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: `2px solid ${modalStep === t.step ? 'var(--primary)' : 'transparent'}`,
                    fontWeight: modalStep === t.step ? 700 : 500,
                    color: modalStep === t.step ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {formError && <div className="alert alert-danger">⚠️ {formError}</div>}

            <form onSubmit={handleFormSubmit}>
              {/* Step 1: Identitas */}
              {modalStep === 1 && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">NIK (16 Digit KTP) *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="3171011508960001"
                        maxLength={16}
                        value={formData.nik_ktp}
                        onChange={(e) => handleInputChange('nik_ktp', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nama Lengkap *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Budi Santoso"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Email Resmi *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="budi@perusahaan.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">No. WhatsApp</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="081234567890"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Jenis Kelamin</label>
                      <select
                        className="form-select"
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <option value="MALE">Laki-laki</option>
                        <option value="FEMALE">Perempuan</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tanggal Masuk Kerja *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.join_date}
                        onChange={(e) => handleInputChange('join_date', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-primary" onClick={() => setModalStep(2)}>
                      Lanjut ke Pajak & BPJS →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Pajak & BPJS */}
              {modalStep === 2 && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Status PTKP (Pajak)</label>
                      <select
                        className="form-select"
                        value={formData.ptkp_status}
                        onChange={(e) => handleInputChange('ptkp_status', e.target.value)}
                      >
                        <option value="TK/0">TK/0 (Lajang, Tanpa Tanggungan)</option>
                        <option value="TK/1">TK/1 (Lajang, 1 Tanggungan)</option>
                        <option value="TK/2">TK/2 (Lajang, 2 Tanggungan)</option>
                        <option value="TK/3">TK/3 (Lajang, 3 Tanggungan)</option>
                        <option value="K/0">K/0 (Menikah, Tanpa Tanggungan)</option>
                        <option value="K/1">K/1 (Menikah, 1 Tanggungan)</option>
                        <option value="K/2">K/2 (Menikah, 2 Tanggungan)</option>
                        <option value="K/3">K/3 (Menikah, 3 Tanggungan)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Auto Kategori TER (PMK 168/2023)</label>
                      <div
                        style={{
                          padding: '0.625rem 0.875rem',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                        }}
                      >
                        Kategori TER {currentTer}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">NPWP (15/16 Digit)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="01.234.567.8-901.000"
                        value={formData.npwp}
                        onChange={(e) => handleInputChange('npwp', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status Hubungan Kerja</label>
                      <select
                        className="form-select"
                        value={formData.employment_status}
                        onChange={(e) => handleInputChange('employment_status', e.target.value)}
                      >
                        <option value="PKWTT">PKWTT (Karyawan Tetap)</option>
                        <option value="PKWT">PKWT (Karyawan Kontrak)</option>
                        <option value="FREELANCE">Freelance / Lepas</option>
                        <option value="INTERNSHIP">Internship / Magang</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">No. BPJS Ketenagakerjaan (KPJ)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="12345678901"
                        maxLength={11}
                        value={formData.bpjs_tk_no}
                        onChange={(e) => handleInputChange('bpjs_tk_no', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">No. BPJS Kesehatan</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="1234567890123"
                        maxLength={13}
                        value={formData.bpjs_kes_no}
                        onChange={(e) => handleInputChange('bpjs_kes_no', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setModalStep(1)}>
                      ← Kembali
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setModalStep(3)}>
                      Lanjut ke Gaji & Bank →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Gaji & Bank */}
              {modalStep === 3 && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Gaji Pokok Bulanan (Rp) *</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="5000000"
                        value={formData.basic_salary}
                        onChange={(e) => handleInputChange('basic_salary', e.target.value)}
                        required
                        min={0}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tunjangan Tetap (Rp)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="1000000"
                        value={formData.fixed_allowance_amount}
                        onChange={(e) => handleInputChange('fixed_allowance_amount', e.target.value)}
                        min={0}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Nama Bank Payroll</label>
                      <select
                        className="form-select"
                        value={formData.bank_name}
                        onChange={(e) => handleInputChange('bank_name', e.target.value)}
                      >
                        <option value="BCA">BCA (Bank Central Asia)</option>
                        <option value="MANDIRI">Bank Mandiri</option>
                        <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                        <option value="BNI">BNI (Bank Negara Indonesia)</option>
                        <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                        <option value="CIMB">CIMB Niaga</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor Rekening Bank</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="8830123456"
                        value={formData.bank_account_no}
                        onChange={(e) => handleInputChange('bank_account_no', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setModalStep(2)}>
                      ← Kembali
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Menyimpan...' : 'Simpan Data Karyawan'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
