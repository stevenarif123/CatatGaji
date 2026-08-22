import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import {
  formatTanggal,
  formatTanggalHari,
  hitungJumlahHari,
  hitungTanggalSelesai,
} from '@catatgaji/shared';

export const Approvals: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState<'LEAVE' | 'OVERTIME' | 'DELEGATION'>('LEAVE');
  const [pendingData, setPendingData] = useState<any>(null);
  const [delegations, setDelegations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal state
  const [rejectModal, setRejectModal] = useState<{ open: boolean; type: 'LEAVE' | 'OVERTIME'; id: string; name: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Delegation form state
  const todayStr = new Date().toISOString().split('T')[0];
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [delegationDays, setDelegationDays] = useState(7);
  const [delegationForm, setDelegationForm] = useState({
    delegatee_id: '',
    module: 'ALL',
    start_date: todayStr,
    end_date: hitungTanggalSelesai(todayStr, 7),
    reason: '',
  });

  const handleDelegationStartChange = (newStart: string) => {
    const newEnd = hitungTanggalSelesai(newStart, delegationDays);
    setDelegationForm((prev) => ({
      ...prev,
      start_date: newStart,
      end_date: newEnd,
    }));
  };

  const handleDelegationEndChange = (newEnd: string) => {
    const days = hitungJumlahHari(delegationForm.start_date, newEnd);
    setDelegationDays(days);
    setDelegationForm((prev) => ({
      ...prev,
      end_date: newEnd,
    }));
  };

  const handleDelegationDaysChange = (newDays: number) => {
    const days = Math.max(1, Math.floor(newDays) || 1);
    const newEnd = hitungTanggalSelesai(delegationForm.start_date, days);
    setDelegationDays(days);
    setDelegationForm((prev) => ({
      ...prev,
      end_date: newEnd,
    }));
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, delRes, empRes] = await Promise.all([
        apiFetch<any>('/approvals/pending', { token }),
        apiFetch<any>('/approvals/delegations', { token }),
        apiFetch<any>('/employees?limit=100', { token }),
      ]);
      setPendingData(pendingRes.data);
      setDelegations(delRes.data || []);
      setEmployees(empRes.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (type: 'LEAVE' | 'OVERTIME', id: string) => {
    try {
      const endpoint = type === 'LEAVE' ? `/approvals/leave/${id}/action` : `/approvals/overtime/${id}/action`;
      await apiFetch<any>(endpoint, {
        method: 'POST',
        token,
        body: { action: 'APPROVE' },
      });
      alert('Permohonan berhasil disetujui!');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menyetujui permohonan.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModal) return;
    try {
      const endpoint = rejectModal.type === 'LEAVE' ? `/approvals/leave/${rejectModal.id}/action` : `/approvals/overtime/${rejectModal.id}/action`;
      await apiFetch<any>(endpoint, {
        method: 'POST',
        token,
        body: { action: 'REJECT', rejection_reason: rejectionReason },
      });
      alert('Permohonan berhasil ditolak.');
      setRejectModal(null);
      setRejectionReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menolak permohonan.');
    }
  };

  const handleCreateDelegation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch<any>('/approvals/delegations', {
        method: 'POST',
        token,
        body: delegationForm,
      });
      alert('Delegasi wewenang berhasil diaktifkan.');
      setShowDelegationModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal membuat delegasi wewenang.');
    }
  };

  const handleRevokeDelegation = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin mencabut delegasi wewenang ini?')) return;
    try {
      await apiFetch<any>(`/approvals/delegations/${id}/revoke`, {
        method: 'PUT',
        token,
      });
      alert('Delegasi wewenang berhasil dicabut.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mencabut delegasi.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Pusat Persetujuan & Delegasi Wewenang</h1>
          <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Otorisasi berjenjang permohonan Cuti, Lembur (SPKL) & Pelimpahan Wewenang (Modul 5 PRD)
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('LEAVE')}
            className={`btn btn-sm ${activeTab === 'LEAVE' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <i className="fa-solid fa-calendar-check"></i>
            <span>Persetujuan Cuti</span>
            {pendingData?.summary?.total_pending_leaves > 0 && (
              <span className="badge badge-danger" style={{ marginLeft: '4px' }}>
                {pendingData.summary.total_pending_leaves}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('OVERTIME')}
            className={`btn btn-sm ${activeTab === 'OVERTIME' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <i className="fa-solid fa-clock"></i>
            <span>Lembur (SPKL)</span>
            {pendingData?.summary?.total_pending_overtimes > 0 && (
              <span className="badge badge-danger" style={{ marginLeft: '4px' }}>
                {pendingData.summary.total_pending_overtimes}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('DELEGATION')}
            className={`btn btn-sm ${activeTab === 'DELEGATION' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <i className="fa-solid fa-user-shield"></i>
            <span>Delegasi Wewenang</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}></i>
          <p style={{ fontSize: '0.8125rem' }}>Memuat data persetujuan & alur wewenang...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: PERSETUJUAN CUTI */}
          {activeTab === 'LEAVE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Daftar Permohonan Cuti & Izin Menunggu Persetujuan</h2>
                  <span className="badge badge-primary">{pendingData?.leaves?.length || 0} Menunggu</span>
                </div>

                {pendingData?.leaves?.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-check-circle fa-2x" style={{ color: 'var(--success-text)', marginBottom: '0.5rem' }}></i>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Tidak ada pengajuan cuti yang tertunda</p>
                    <p style={{ fontSize: '0.75rem', margin: '4px 0 0' }}>Semua permohonan cuti dan izin telah diproses.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nama Karyawan</th>
                          <th>Jenis Cuti</th>
                          <th>Durasi & Tanggal</th>
                          <th>Alasan / Lampiran</th>
                          <th>Tahap Approval</th>
                          <th style={{ textAlign: 'right' }}>Aksi Keputusan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingData?.leaves?.map((l: any) => (
                          <tr key={l.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{l.employee_name}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l.branch_name || 'Kantor Pusat'}</div>
                            </td>
                            <td>
                              <span className="badge badge-primary">
                                {l.leave_type === 'ANNUAL' ? 'Cuti Tahunan' :
                                 l.leave_type === 'MATERNITY_KIA' ? 'Melahirkan (UU KIA)' :
                                 l.leave_type === 'MENSTRUAL' ? 'Cuti Haid' :
                                 l.leave_type === 'SICK' ? 'Izin Sakit' : l.leave_type}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{l.days_count} Hari Kerja</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>
                                📅 {formatTanggal(l.start_date)} s/d {formatTanggal(l.end_date)}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.8125rem' }}>{l.reason}</div>
                              {l.attachment_url && (
                                <a
                                  href={l.attachment_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}
                                >
                                  <i className="fa-solid fa-paperclip"></i> Lihat Lampiran Surat Dokter
                                </a>
                              )}
                            </td>
                            <td>
                              <span className="badge badge-warning">
                                {l.approval_stage === 2 ? 'Level 2: HR Admin' : 'Level 1: Supervisor'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleApprove('LEAVE', l.id)}
                                >
                                  <i className="fa-solid fa-check"></i> Setujui
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  style={{ color: 'var(--danger-text)' }}
                                  onClick={() => setRejectModal({ open: true, type: 'LEAVE', id: l.id, name: l.employee_name })}
                                >
                                  <i className="fa-solid fa-xmark"></i> Tolak
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PERSETUJUAN LEMBUR (SPKL) */}
          {activeTab === 'OVERTIME' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Daftar Surat Perintah Kerja Lembur (SPKL) Menunggu Persetujuan</h2>
                  <span className="badge badge-primary">{pendingData?.overtimes?.length || 0} Menunggu</span>
                </div>

                {pendingData?.overtimes?.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-check-circle fa-2x" style={{ color: 'var(--success-text)', marginBottom: '0.5rem' }}></i>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Tidak ada pengajuan lembur yang tertunda</p>
                    <p style={{ fontSize: '0.75rem', margin: '4px 0 0' }}>Semua surat tugas lembur telah diverifikasi.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nama Karyawan</th>
                          <th>Tanggal Lembur</th>
                          <th>Jam Kerja & Durasi</th>
                          <th>Hari Libur?</th>
                          <th>Uraian Tugas Lembur</th>
                          <th style={{ textAlign: 'right' }}>Aksi Keputusan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingData?.overtimes?.map((ot: any) => (
                          <tr key={ot.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{ot.employee_name}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ot.branch_name || 'Kantor Pusat'}</div>
                            </td>
                            <td style={{ fontWeight: 600 }}>📅 {formatTanggalHari(ot.date)}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{ot.duration_hours} Jam</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>
                                ⏰ {ot.start_time} - {ot.end_time} WIB
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${ot.is_holiday ? 'badge-danger' : 'badge-primary'}`}>
                                {ot.is_holiday ? 'Hari Libur / Weekend (2x)' : 'Hari Kerja Biasa'}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.8125rem' }}>{ot.reason}</td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleApprove('OVERTIME', ot.id)}
                                >
                                  <i className="fa-solid fa-check"></i> Setujui
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  style={{ color: 'var(--danger-text)' }}
                                  onClick={() => setRejectModal({ open: true, type: 'OVERTIME', id: ot.id, name: ot.employee_name })}
                                >
                                  <i className="fa-solid fa-xmark"></i> Tolak
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DELEGASI WEWENANG SEMENTARA */}
          {activeTab === 'DELEGATION' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <div>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Delegasi Wewenang Persetujuan (Approval Delegation)</h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Pelimpahan hak persetujuan cuti & lembur sementara kepada rekan kerja setingkat saat atasan dinas / cuti.
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowDelegationModal(true)}
                >
                  <i className="fa-solid fa-plus"></i> Tambah Delegasi
                </button>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {delegations.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-user-shield fa-2x" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}></i>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Belum ada delegasi wewenang aktif</p>
                    <p style={{ fontSize: '0.75rem', margin: '4px 0 0' }}>Klik tombol Tambah Delegasi untuk mengalihkan hak persetujuan.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Pemberi Wewenang</th>
                          <th>Penerima Delegasi</th>
                          <th>Lingkup Modul</th>
                          <th>Periode Berlaku</th>
                          <th>Alasan Delegasi</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {delegations.map((d) => (
                          <tr key={d.id}>
                            <td style={{ fontWeight: 600 }}>{d.delegator_name}</td>
                            <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{d.delegatee_name}</td>
                            <td>
                              <span className="badge badge-primary">
                                {d.module === 'ALL' ? 'Semua (Cuti & SPKL)' : d.module}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>📅 {formatTanggal(d.start_date)} s/d {formatTanggal(d.end_date)}</div>
                            </td>
                            <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{d.reason || '-'}</td>
                            <td>
                              <span className={`badge ${d.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                                {d.status === 'ACTIVE' ? 'Aktif' : d.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {d.status === 'ACTIVE' && (
                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{ color: 'var(--danger-text)' }}
                                  onClick={() => handleRevokeDelegation(d.id)}
                                >
                                  <i className="fa-solid fa-ban"></i> Cabut Wewenang
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Penolakan dengan Alasan */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '1.5rem', animation: 'scaleIn 0.2s ease-out' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--danger-text)' }}>
              Tolak Permohonan {rejectModal.type === 'LEAVE' ? 'Cuti' : 'Lembur'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
              Masukkan alasan penolakan permohonan untuk <strong>{rejectModal.name}</strong>.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Alasan / Catatan Penolakan:</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Contoh: Jadwal operasional cabang sedang padat atau dokumen surat dokter belum lengkap."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setRejectModal(null)}
              >
                Batal
              </button>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--danger-text)', color: '#ffffff' }}
                onClick={handleConfirmReject}
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Delegasi */}
      {showDelegationModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Buat Delegasi Wewenang Baru</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
              Alihkan hak persetujuan kepada rekan kerja selama Anda berhalangan hadir.
            </p>

            <form onSubmit={handleCreateDelegation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Penerima Delegasi Wewenang:</label>
                <select
                  className="form-control"
                  value={delegationForm.delegatee_id}
                  onChange={(e) => setDelegationForm({ ...delegationForm, delegatee_id: e.target.value })}
                  required
                >
                  <option value="">-- Pilih Karyawan / Atasan Setingkat --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.branch_name || 'Kantor Pusat'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Tanggal Mulai:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={delegationForm.start_date}
                    onChange={(e) => handleDelegationStartChange(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
                    {formatTanggalHari(delegationForm.start_date)}
                  </span>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Tanggal Berakhir:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={delegationForm.end_date}
                    onChange={(e) => handleDelegationEndChange(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
                    {formatTanggalHari(delegationForm.end_date)}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Durasi Masa Delegasi (Hari):</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={delegationDays}
                  onChange={(e) => handleDelegationDaysChange(Number(e.target.value))}
                  required
                />
              </div>

              {/* Banner Ringkasan Masa Delegasi */}
              <div
                style={{
                  padding: '0.625rem 0.875rem',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-active)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                }}
              >
                <i className="fa-solid fa-user-shield" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                  <div>
                    Masa Berlaku Delegasi: <strong>{delegationDays} Hari</strong>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-soft)', marginTop: '2px' }}>
                    📅 {formatTanggalHari(delegationForm.start_date)} s/d {formatTanggalHari(delegationForm.end_date)}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Lingkup Persetujuan:</label>
                <select
                  className="form-control"
                  value={delegationForm.module}
                  onChange={(e) => setDelegationForm({ ...delegationForm, module: e.target.value })}
                >
                  <option value="ALL">Semua Modul (Cuti, Izin & Lembur SPKL)</option>
                  <option value="LEAVE">Hanya Permohonan Cuti & Izin</option>
                  <option value="OVERTIME">Hanya Surat Perintah Lembur (SPKL)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Alasan Delegasi:</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Contoh: Cuti tahunan 1 minggu ke luar kota."
                  value={delegationForm.reason}
                  onChange={(e) => setDelegationForm({ ...delegationForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDelegationModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Aktifkan Delegasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
