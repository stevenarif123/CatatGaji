import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatTanggal } from '@catatgaji/shared';

export const Attendance: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  const [activeTab, setActiveTab] = useState<'LOGS' | 'LEAVE' | 'CLOCK_IN' | 'IMPORT'>('LOGS');
  const [logs, setLogs] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [selectedEmp, setSelectedEmp] = useState('');

  // Clock-in form state
  const [clockInEmpId, setClockInEmpId] = useState('');
  const [clockInLat, setClockInLat] = useState(-6.1754);
  const [clockInLon, setClockInLon] = useState(106.82715);
  const [clocking, setClocking] = useState(false);
  const [clockMessage, setClockMessage] = useState<string | null>(null);
  const [clockError, setClockError] = useState<string | null>(null);

  // Leave modal form state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState({
    employee_id: '',
    leave_type: 'ANNUAL',
    start_date: todayStr,
    end_date: todayStr,
    days_count: 1,
    reason: '',
  });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  // Import CSV state
  const [csvContent, setCsvContent] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [logRes, leaveRes, empRes] = await Promise.all([
        apiFetch<any>(`/attendance/logs?start_date=${startDate}&end_date=${endDate}${selectedEmp ? `&employee_id=${selectedEmp}` : ''}`, { token }),
        apiFetch<any>('/leave/requests', { token }),
        apiFetch<any>('/employees', { token }),
      ]);

      setLogs(logRes.data || []);
      setLeaves(leaveRes.data || []);
      setEmployees(empRes.data || []);
      if (empRes.data?.length > 0 && !clockInEmpId) {
        setClockInEmpId(empRes.data[0].id);
        setLeaveData((prev) => ({ ...prev, employee_id: empRes.data[0].id }));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedEmp, clockInEmpId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Clock-In
  const handleClockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setClocking(true);
    setClockMessage(null);
    setClockError(null);

    try {
      const res = await apiFetch<any>('/attendance/clock-in', {
        method: 'POST',
        token,
        body: {
          employee_id: clockInEmpId,
          latitude: Number(clockInLat),
          longitude: Number(clockInLon),
          selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
      });
      setClockMessage(res.message || 'Absensi Masuk Berhasil!');
      loadData();
    } catch (err: any) {
      setClockError(err.message || 'Clock-in gagal. Periksa koordinat geofencing.');
    } finally {
      setClocking(false);
    }
  };

  // Handle Clock-Out
  const handleClockOut = async (empId: string) => {
    setClocking(true);
    setClockMessage(null);
    setClockError(null);

    try {
      const res = await apiFetch<any>('/attendance/clock-out', {
        method: 'POST',
        token,
        body: {
          employee_id: empId,
          latitude: Number(clockInLat),
          longitude: Number(clockInLon),
        },
      });
      setClockMessage(res.message || 'Absensi Pulang Berhasil Dicatat!');
      loadData();
    } catch (err: any) {
      setClockError(err.message || 'Clock-out gagal.');
    } finally {
      setClocking(false);
    }
  };

  // Handle Leave Submission
  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitting(true);
    try {
      await apiFetch('/leave/requests', {
        method: 'POST',
        token,
        body: leaveData,
      });
      setShowLeaveModal(false);
      setLeaveData({
        employee_id: employees[0]?.id || '',
        leave_type: 'ANNUAL',
        start_date: todayStr,
        end_date: todayStr,
        days_count: 1,
        reason: '',
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengajukan cuti');
    } finally {
      setLeaveSubmitting(false);
    }
  };

  // Handle Leave Approval
  const handleApproveLeave = async (leaveId: string) => {
    try {
      await apiFetch(`/leave/requests/${leaveId}/approve`, {
        method: 'PUT',
        token,
        body: { notes: 'Disetujui oleh Owner' },
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menyetujui cuti');
    }
  };

  // Handle Import CSV
  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setImportResult(null);

    try {
      const res = await apiFetch<any>('/attendance/import-csv', {
        method: 'POST',
        token,
        body: { csv_content: csvContent },
      });
      setImportResult(res.data);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengimpor log absensi');
    } finally {
      setImporting(false);
    }
  };

  // Summary Metrics
  const totalLogs = logs.length;
  const onTimeCount = logs.filter((l) => l.status === 'PRESENT').length;
  const lateCount = logs.filter((l) => l.status === 'LATE').length;
  const pendingLeaveCount = leaves.filter((l) => l.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Manajemen Kehadiran & Absensi (Modul 2)
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            GPS Geofencing (Haversine), Manajemen Cuti (UU KIA 2024), dan Impor Log Biometrik Mesin Fingerprint
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowLeaveModal(true)}>
            <i className="fa-solid fa-calendar-plus"></i>
            <span>Ajukan Cuti / Izin</span>
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('CLOCK_IN')}>
            <i className="fa-solid fa-location-dot"></i>
            <span>Absen Masuk (GPS)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-regular fa-calendar-check"></i>
            </div>
            <span className="badge badge-primary">Total Log</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Kehadiran
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {totalLogs} Log Masuk
          </p>
        </article>

        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--success-light)', color: 'var(--success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <span className="badge badge-success">Tepat Waktu</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Hadir Tepat Waktu
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success-text)', marginTop: '0.25rem' }}>
            {onTimeCount} Orang
          </p>
        </article>

        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--warning-light)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <span className="badge badge-warning">Terlambat</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Keterlambatan
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--warning-text)', marginTop: '0.25rem' }}>
            {lateCount} Orang
          </p>
        </article>

        <article className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <span className="badge badge-purple">Cuti & Izin</span>
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Menunggu Persetujuan
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--purple-text)', marginTop: '0.25rem' }}>
            {pendingLeaveCount} Pengajuan
          </p>
        </article>
      </section>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'LOGS', label: 'Daftar Log Kehadiran', icon: 'fa-solid fa-table-list' },
          { id: 'LEAVE', label: 'Pengajuan Cuti (UU KIA 2024)', icon: 'fa-solid fa-calendar-days' },
          { id: 'CLOCK_IN', label: 'Simulator Absen GPS', icon: 'fa-solid fa-mobile-screen-button' },
          { id: 'IMPORT', label: 'Impor Mesin Fingerprint (CSV)', icon: 'fa-solid fa-file-arrow-up' },
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

      {/* TAB 1: LOG KEHADIRAN */}
      {activeTab === 'LOGS' && (
        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Filter Bar */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="date"
                className="form-control"
                style={{ width: '150px' }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>s/d</span>
              <input
                type="date"
                className="form-control"
                style={{ width: '150px' }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <select
                className="form-control"
                style={{ width: '180px' }}
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
              >
                <option value="">Semua Karyawan</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={loadData}>
              <i className="fa-solid fa-rotate-right"></i>
              <span>Segarkan</span>
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
              Memuat data log kehadiran...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <i className="fa-regular fa-folder-open" style={{ fontSize: '2.5rem', color: 'var(--text-faint)', marginBottom: '0.75rem', display: 'block' }}></i>
              <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.25rem' }}>Belum Ada Log Kehadiran pada Rentang Ini</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Lakukan absensi masuk via tab Simulator GPS atau impor CSV mesin fingerprint.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama Karyawan</th>
                    <th>Jam Masuk</th>
                    <th>Jam Pulang</th>
                    <th>Durasi Kerja</th>
                    <th>Keterlambatan</th>
                    <th>Status</th>
                    <th>Sumber</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const isLate = log.status === 'LATE';
                    const clockInFormatted = log.clock_in ? new Date(log.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';
                    const clockOutFormatted = log.clock_out ? new Date(log.clock_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

                    return (
                      <tr key={log.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {formatTanggal(log.date)}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{log.employee_name}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{log.branch_name || 'Pusat'}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: isLate ? 'var(--warning-text)' : 'var(--success-text)' }}>
                          <i className="fa-regular fa-clock" style={{ marginRight: '0.25rem' }}></i>
                          {clockInFormatted}
                        </td>
                        <td style={{ color: 'var(--text-soft)' }}>
                          {clockOutFormatted}
                        </td>
                        <td>
                          {log.work_duration_minutes ? `${Math.floor(log.work_duration_minutes / 60)}j ${log.work_duration_minutes % 60}m` : '-'}
                        </td>
                        <td style={{ color: isLate ? 'var(--warning-text)' : 'var(--text-muted)', fontWeight: isLate ? 600 : 400 }}>
                          {isLate ? `${log.late_minutes} menit` : 'Tepat Waktu'}
                        </td>
                        <td>
                          <span className={`badge ${isLate ? 'badge-warning' : 'badge-success'}`}>
                            {isLate ? 'Terlambat' : 'Hadir'}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-muted">
                            {log.source === 'FINGERPRINT_IMPORT' ? 'Fingerprint' : 'Mobile GPS'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {!log.clock_out && (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleClockOut(log.employee_id)}
                              title="Catat Jam Pulang"
                            >
                              <i className="fa-solid fa-arrow-right-from-bracket"></i>
                              <span>Absen Pulang</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PENGAJUAN CUTI (UU KIA 2024) */}
      {activeTab === 'LEAVE' && (
        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '0.9375rem', margin: 0, fontWeight: 600 }}>Daftar Pengajuan Cuti & Izin Karyawan</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Kepatuhan UU Kesejahteraan Ibu dan Anak (UU KIA No. 4/2024) & UU Ketenagakerjaan
              </p>
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => setShowLeaveModal(true)}>
              <i className="fa-solid fa-plus"></i>
              <span>Buat Pengajuan Cuti</span>
            </button>
          </div>

          {leaves.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <i className="fa-solid fa-calendar-check" style={{ fontSize: '2.5rem', color: 'var(--text-faint)', marginBottom: '0.75rem', display: 'block' }}></i>
              <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.25rem' }}>Belum Ada Pengajuan Cuti</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Karyawan dapat mengajukan cuti tahunan, melahirkan (UU KIA), atau izin berbayar resmi.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Karyawan</th>
                    <th>Jenis Cuti</th>
                    <th>Periode Cuti</th>
                    <th>Durasi</th>
                    <th>Alasan</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {leave.employee_name}
                      </td>
                      <td>
                        <span className="badge badge-purple">
                          {leave.leave_type === 'MATERNITY_KIA'
                            ? 'Melahirkan (UU KIA)'
                            : leave.leave_type === 'MENSTRUAL'
                            ? 'Cuti Haid'
                            : leave.leave_type === 'ANNUAL'
                            ? 'Cuti Tahunan'
                            : leave.leave_type}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-soft)' }}>
                        {formatTanggal(leave.start_date)} s/d {formatTanggal(leave.end_date)}
                      </td>
                      <td>{leave.days_count} Hari</td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {leave.reason}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            leave.status === 'APPROVED'
                              ? 'badge-success'
                              : leave.status === 'REJECTED'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}
                        >
                          {leave.status === 'APPROVED' ? 'Disetujui' : leave.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {leave.status === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleApproveLeave(leave.id)}
                          >
                            <i className="fa-solid fa-check"></i>
                            <span>Setujui</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: SIMULATOR ABSEN GPS */}
      {activeTab === 'CLOCK_IN' && (
        <section className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-location-crosshairs"></i>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Simulator Absensi GPS Geofencing</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Perhitungan Jarak Trigonometri Haversine & Validasi Radius Kantor Cabang (50-100m)
            </p>
          </div>

          {clockMessage && <div className="alert alert-success"><i className="fa-solid fa-circle-check"></i>{clockMessage}</div>}
          {clockError && <div className="alert alert-danger"><i className="fa-solid fa-circle-exclamation"></i>{clockError}</div>}

          <form onSubmit={handleClockIn}>
            <div className="form-group">
              <label className="form-label">Pilih Karyawan</label>
              <select
                className="form-control"
                value={clockInEmpId}
                onChange={(e) => setClockInEmpId(e.target.value)}
                required
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name} ({e.nik_ktp})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Latitude GPS</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={clockInLat}
                  onChange={(e) => setClockInLat(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude GPS</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={clockInLon}
                  onChange={(e) => setClockInLon(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', fontSize: '0.75rem', color: 'var(--text-soft)' }}>
              <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)', marginRight: '0.35rem' }}></i>
              Koordinat bawaan (-6.1754, 106.82715) berada di dalam radius Pusat Jakarta (Monas).
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.625rem' }}
              disabled={clocking}
            >
              <i className={`fa-solid ${clocking ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
              <span>{clocking ? 'Memvalidasi Geofence...' : 'Ambil Selfie & Clock-In Sekarang'}</span>
            </button>
          </form>
        </section>
      )}

      {/* TAB 4: IMPOR CSV FINGERPRINT */}
      {activeTab === 'IMPORT' && (
        <section className="card" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-fingerprint"></i>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Impor Berkas Mesin Fingerprint</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Format standar ZKTeco / Fingerspot / Solution dengan pembersihan duplikat otomatis
            </p>
          </div>

          {importResult && (
            <div className="alert alert-success">
              <i className="fa-solid fa-circle-check"></i>
              Berhasil mengimpor {importResult.processed_count} log kehadiran dari {importResult.raw_records_count} baris data!
            </div>
          )}

          <form onSubmit={handleImportCsv}>
            <div className="form-group">
              <label className="form-label">Tempel Konten CSV / Teks Log Absensi</label>
              <textarea
                rows={6}
                className="form-control"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                placeholder={`PIN,DateTime,Status\n3171012305950001,2026-08-20 08:00:00,IN\n3171012305950001,2026-08-20 17:05:00,OUT`}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.625rem' }}
              disabled={importing}
            >
              <i className={`fa-solid ${importing ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
              <span>{importing ? 'Memproses Log...' : 'Unggah & Sinkronkan ke Database'}</span>
            </button>
          </form>
        </section>
      )}

      {/* Modal Buat Pengajuan Cuti */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Pengajuan Cuti / Izin Karyawan</h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-faint)', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit}>
              <div className="form-group">
                <label className="form-label">Karyawan</label>
                <select
                  className="form-control"
                  value={leaveData.employee_id}
                  onChange={(e) => setLeaveData({ ...leaveData, employee_id: e.target.value })}
                  required
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.nik_ktp})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Jenis Cuti / Izin</label>
                <select
                  className="form-control"
                  value={leaveData.leave_type}
                  onChange={(e) => setLeaveData({ ...leaveData, leave_type: e.target.value })}
                  required
                >
                  <option value="ANNUAL">Cuti Tahunan Resmi (12 Hari/Tahun)</option>
                  <option value="MATERNITY_KIA">Cuti Melahirkan (UU KIA No. 4/2024 - 3 s/d 6 Bulan)</option>
                  <option value="MENSTRUAL">Cuti Haid Pekerja Perempuan (2 Hari)</option>
                  <option value="MARRIAGE">Pernikahan Pekerja (3 Hari Berbayar)</option>
                  <option value="BEREAVEMENT">Keluarga Meninggal Dunia (2 Hari Berbayar)</option>
                  <option value="SICK">Sakit dengan Surat Dokter</option>
                  <option value="UNPAID">Izin Tidak Berbayar (Unpaid Leave)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={leaveData.start_date}
                    onChange={(e) => setLeaveData({ ...leaveData, start_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={leaveData.end_date}
                    onChange={(e) => setLeaveData({ ...leaveData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Jumlah Hari</label>
                <input
                  type="number"
                  min={1}
                  required
                  className="form-control"
                  value={leaveData.days_count}
                  onChange={(e) => setLeaveData({ ...leaveData, days_count: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alasan / Keterangan</label>
                <textarea
                  rows={3}
                  required
                  className="form-control"
                  placeholder="Keterangan keperluan cuti..."
                  value={leaveData.reason}
                  onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLeaveModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={leaveSubmitting}>
                  {leaveSubmitting ? 'Mengajukan...' : 'Kirim Pengajuan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
