import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import {
  formatRupiah,
  maskNik,
  formatTanggal,
  formatTanggalHari,
  formatTanggalSingkat,
  hitungJumlahHari,
  hitungTanggalSelesai,
  hitungDurasiJam,
} from '@catatgaji/shared';
import { PayslipModal } from '../components/PayslipModal';

export const ESS: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState<'HOME' | 'ATTENDANCE' | 'REQUESTS' | 'ACCOUNT'>('HOME');
  const [loading, setLoading] = useState(true);

  // ESS Data
  const [essData, setEssData] = useState<any>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [overtimes, setOvertimes] = useState<any[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);

  // Selected Payslip for Modal
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);

  // Modals State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'IN' | 'OUT'>('IN');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);

  // Geolocation & Camera state
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [selfieSnapshot, setSelfieSnapshot] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [clockingLoading, setClockingLoading] = useState(false);

  // Today ISO Date
  const todayStr = new Date().toISOString().split('T')[0];

  // Leave Form State (Bidirectional Reactive)
  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [leaveStart, setLeaveStart] = useState(todayStr);
  const [leaveEnd, setLeaveEnd] = useState(todayStr);
  const [leaveDaysCount, setLeaveDaysCount] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');
  const [submittingLeave, setSubmittingLeave] = useState(false);

  // Overtime Form State
  const [otDate, setOtDate] = useState(todayStr);
  const [otStart, setOtStart] = useState('17:00');
  const [otEnd, setOtEnd] = useState('20:00');
  const [otReason, setOtReason] = useState('');
  const [submittingOt, setSubmittingOt] = useState(false);

  // Leave handlers
  const handleEssLeaveStartChange = (newStart: string) => {
    const days = Math.max(1, leaveDaysCount || 1);
    const newEnd = hitungTanggalSelesai(newStart, days);
    setLeaveStart(newStart);
    setLeaveEnd(newEnd);
  };

  const handleEssLeaveEndChange = (newEnd: string) => {
    const calculatedDays = hitungJumlahHari(leaveStart, newEnd);
    setLeaveEnd(newEnd);
    setLeaveDaysCount(calculatedDays);
  };

  const handleEssLeaveDaysChange = (newDays: number) => {
    const days = Math.max(1, Math.floor(newDays) || 1);
    const newEnd = hitungTanggalSelesai(leaveStart, days);
    setLeaveDaysCount(days);
    setLeaveEnd(newEnd);
  };

  // Load ESS Initial Data
  const loadEssData = useCallback(async () => {
    setLoading(true);
    try {
      const [todayRes, logsRes, leavesRes, otRes, payrollRes] = await Promise.all([
        apiFetch<any>('/attendance/my-today', { token }),
        apiFetch<any>('/attendance/logs', { token }),
        apiFetch<any>('/leave/requests', { token }),
        apiFetch<any>('/leave/overtime', { token }),
        apiFetch<any>('/payroll/periods', { token }),
      ]);

      setEssData(todayRes.data || null);
      setAttendanceLogs(logsRes.data || []);
      setLeaves(leavesRes.data || []);
      setOvertimes(otRes.data || []);

      // If approved period exists, fetch results for slips
      if (payrollRes.data && payrollRes.data.length > 0) {
        const approvedPeriod = payrollRes.data.find((p: any) => p.status === 'APPROVED');
        if (approvedPeriod) {
          const res = await apiFetch<any>(`/payroll/periods/${approvedPeriod.id}/results`, { token });
          setPayslips(res.data || []);
        }
      }
    } catch (err) {
      console.error('Error loading ESS data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadEssData();
  }, [loadEssData]);

  // Request Geolocation
  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        () => {
          // Fallback to office coordinates if denied/unavailable in dev
          setUserCoords({ lat: -6.2088, lon: 106.8456 });
        }
      );
    } else {
      setUserCoords({ lat: -6.2088, lon: 106.8456 });
    }
  };

  // Open Camera for Clock In/Out
  const openCameraModal = async (mode: 'IN' | 'OUT') => {
    setCameraMode(mode);
    setSelfieSnapshot(null);
    setIsCameraOpen(true);
    getGeoLocation();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      console.warn('Webcam tidak dapat diakses, menggunakan simulasi selfie.');
    }
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  // Capture Selfie Snapshot
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSelfieSnapshot(dataUrl);
      }
    } else {
      setSelfieSnapshot('https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg');
    }
  };

  // Submit Clock-In or Clock-Out
  const handleAttendanceSubmit = async () => {
    if (!essData?.employee?.id) {
      alert('Data karyawan tidak ditemukan.');
      return;
    }

    setClockingLoading(true);
    try {
      const lat = userCoords?.lat || -6.2088;
      const lon = userCoords?.lon || 106.8456;

      if (cameraMode === 'IN') {
        const res = await apiFetch<any>('/attendance/clock-in', {
          method: 'POST',
          token,
          body: {
            employee_id: essData.employee.id,
            latitude: lat,
            longitude: lon,
            selfie_url: selfieSnapshot || 'selfie_captured.jpg',
          },
        });
        alert(res.message || 'Clock-In berhasil!');
      } else {
        const res = await apiFetch<any>('/attendance/clock-out', {
          method: 'POST',
          token,
          body: {
            employee_id: essData.employee.id,
            latitude: lat,
            longitude: lon,
            selfie_url: selfieSnapshot || 'selfie_captured.jpg',
          },
        });
        alert(res.message || 'Clock-Out berhasil!');
      }

      closeCameraModal();
      loadEssData();
    } catch (err: any) {
      alert(err.message || 'Gagal memproses absensi.');
    } finally {
      setClockingLoading(false);
    }
  };

  // Submit Leave Request
  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essData?.employee?.id) return;
    setSubmittingLeave(true);
    try {
      await apiFetch('/leave/requests', {
        method: 'POST',
        token,
        body: {
          employee_id: essData.employee.id,
          leave_type: leaveType,
          start_date: leaveStart,
          end_date: leaveEnd,
          reason: leaveReason,
        },
      });
      alert('Pengajuan cuti berhasil dikirim.');
      setIsLeaveModalOpen(false);
      setLeaveReason('');
      loadEssData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengajukan cuti.');
    } finally {
      setSubmittingLeave(false);
    }
  };

  // Submit Overtime (SPKL)
  const handleOvertimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essData?.employee?.id) return;
    setSubmittingOt(true);
    try {
      await apiFetch('/leave/overtime', {
        method: 'POST',
        token,
        body: {
          employee_id: essData.employee.id,
          overtime_date: otDate,
          start_time: otStart,
          end_time: otEnd,
          task_description: otReason,
        },
      });
      alert('Pengajuan lembur (SPKL) berhasil dikirim.');
      setIsOvertimeModalOpen(false);
      setOtReason('');
      loadEssData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengajukan SPKL.');
    } finally {
      setSubmittingOt(false);
    }
  };

  const empName = essData?.employee?.full_name || 'Budi Prasetyo';
  const todayLog = essData?.today_log;
  const shift = essData?.shift || { name: 'Shift Pagi', start_time: '08:00', end_time: '17:00' };
  const latestSlip = payslips[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        
        {/* Top App Bar */}
        <header
          style={{
            padding: '1.25rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(248, 250, 252, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--primary)', padding: '2px' }}>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                alt="Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1 }}>Halo,</p>
              <h1 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0 0' }}>{empName}</h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              <i className="fa-solid fa-mobile-screen"></i> ESS
            </span>
          </div>
        </header>

        {/* Content Tabs */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}></i>
            <p style={{ fontSize: '0.8125rem' }}>Memuat data portal karyawan...</p>
          </div>
        ) : (
          <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* TAB 1: BERANDA / HOME */}
            {activeTab === 'HOME' && (
              <>
                {/* Hero Status Card (Brand Blue) */}
              <section
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  borderRadius: '1.5rem',
                  padding: '1.25rem',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.35)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.75)', margin: 0 }}>
                    Jadwal Kerja Hari Ini
                  </p>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '4px 0 0' }}>{shift.name}</h2>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', margin: '2px 0 1rem' }}>
                    {shift.start_time?.slice(0, 5)} — {shift.end_time?.slice(0, 5)} WIB
                  </p>

                  {/* Clock In / Out Info Box */}
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: '1rem',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}
                    >
                      <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, margin: 0 }}>
                        Status Presensi
                      </p>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '2px 0 0' }}>
                        {todayLog?.clock_in ? (
                          <>
                            {new Date(todayLog.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                backgroundColor: todayLog.late_minutes > 0 ? '#fbbf24' : '#34d399',
                                color: '#0f172a',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                marginLeft: '6px',
                              }}
                            >
                              {todayLog.late_minutes > 0 ? `Terlambat ${todayLog.late_minutes}m` : 'Tepat Waktu'}
                            </span>
                          </>
                        ) : (
                          'Belum Melakukan Absen'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!todayLog?.clock_in ? (
                    <button
                      onClick={() => openCameraModal('IN')}
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        backgroundColor: '#ffffff',
                        color: '#2563eb',
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      <i className="fa-solid fa-camera"></i>
                      <span>Clock-In Sekarang (Selfie & GPS)</span>
                    </button>
                  ) : !todayLog?.clock_out ? (
                    <button
                      onClick={() => openCameraModal('OUT')}
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        backgroundColor: '#ffffff',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      <span>Clock-Out Pulang</span>
                    </button>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textAlign: 'center',
                      }}
                    >
                      <i className="fa-solid fa-check-circle"></i> Selesai Bekerja Hari Ini
                    </div>
                  )}

                  <p style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', margin: '0.75rem 0 0' }}>
                    <i className="fa-solid fa-location-crosshairs" style={{ marginRight: '4px' }}></i>
                    Radius Kantor Terverifikasi: 15m (Haversine GPS)
                  </p>
                </div>
              </section>

              {/* Menu Cepat Karyawan (2x2 Grid) */}
              <section>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.75rem' }}>
                  Menu Cepat Karyawan
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  
                  {/* Card 1: Slip Gaji */}
                  <div
                    onClick={() => {
                      if (latestSlip) setSelectedSlip(latestSlip);
                      else alert('Belum ada slip gaji yang disahkan periode ini.');
                    }}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '1rem',
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      <i className="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Slip Gaji</p>
                      <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '2px 0 0' }}>
                        {latestSlip ? formatRupiah(Number(latestSlip.take_home_pay)) : 'Lihat Slip'}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Ajukan Cuti */}
                  <div
                    onClick={() => setIsLeaveModalOpen(true)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '1rem',
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Ajukan Cuti</p>
                      <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '2px 0 0' }}>Sisa: 12 Hari</p>
                    </div>
                  </div>

                  {/* Card 3: Ajukan SPKL */}
                  <div
                    onClick={() => setIsOvertimeModalOpen(true)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '1rem',
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#fffbeb',
                        color: '#d97706',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Ajukan SPKL</p>
                      <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '2px 0 0' }}>Lembur Online</p>
                    </div>
                  </div>

                  {/* Card 4: Riwayat Absen */}
                  <div
                    onClick={() => setActiveTab('ATTENDANCE')}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '1rem',
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      <i className="fa-solid fa-history"></i>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Riwayat Abs</p>
                      <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '2px 0 0' }}>Cek Presensi</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Ringkasan Gaji Bulan Terakhir */}
              <section
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1.25rem',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Gaji Bulan Lalu</h3>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '2px 0 0' }}>Agustus 2026</p>
                  </div>
                  {latestSlip && (
                    <button
                      onClick={() => setSelectedSlip(latestSlip)}
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <i className="fa-solid fa-eye"></i> Detail
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, margin: '0 0 2px' }}>Take Home Pay</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {latestSlip ? formatRupiah(Number(latestSlip.take_home_pay)) : 'Rp 5.380.000'}
                    </p>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: RIWAYAT ABSENSI */}
          {activeTab === 'ATTENDANCE' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Log Presensi Pribadi</h2>
                <button onClick={() => openCameraModal('IN')} className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-camera"></i> Absen
                </button>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="table" style={{ fontSize: '0.75rem' }}>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Masuk</th>
                      <th>Keluar</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLogs.map((l) => (
                      <tr key={l.id}>
                        <td style={{ fontWeight: 600 }}>{formatTanggalHari(l.date)}</td>
                        <td style={{ color: 'var(--success-text)', fontWeight: 600 }}>
                          {l.clock_in ? new Date(l.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-'}
                        </td>
                        <td style={{ color: 'var(--text-soft)' }}>
                          {l.clock_out ? new Date(l.clock_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-'}
                        </td>
                        <td>
                          <span className={`badge ${l.status === 'PRESENT' ? 'badge-success' : 'badge-warning'}`}>
                            {l.status === 'PRESENT' ? 'Hadir Tepat Waktu' : l.status === 'LATE' ? 'Terlambat' : l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 3: PENGAJUAN CUTI & LEMBUR */}
          {activeTab === 'REQUESTS' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setIsLeaveModalOpen(true)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <i className="fa-solid fa-calendar-plus"></i> Ajukan Cuti
                </button>
                <button onClick={() => setIsOvertimeModalOpen(true)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <i className="fa-solid fa-bolt"></i> Ajukan SPKL
                </button>
              </div>

              {/* Daftar Cuti */}
              <div className="card" style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Riwayat Pengajuan Cuti</h3>
                {leaves.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Belum ada pengajuan cuti.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {leaves.map((lv) => (
                      <div key={lv.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                        <div>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>
                            {lv.leave_type === 'MATERNITY_KIA' ? 'Melahirkan (UU KIA)' : lv.leave_type === 'ANNUAL' ? 'Cuti Tahunan' : lv.leave_type}
                          </p>
                          <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '2px 0 0' }}>
                            📅 {formatTanggal(lv.start_date)} s/d {formatTanggal(lv.end_date)} ({lv.days_count || hitungJumlahHari(lv.start_date, lv.end_date)} hari)
                          </p>
                        </div>
                        <span className={`badge ${lv.status === 'APPROVED' ? 'badge-success' : lv.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                          {lv.status === 'APPROVED' ? 'Disetujui' : lv.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Daftar SPKL */}
              <div className="card" style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Riwayat Lembur (SPKL)</h3>
                {overtimes.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Belum ada pengajuan lembur.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {overtimes.map((ot) => (
                      <div key={ot.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                        <div>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>📅 {formatTanggalHari(ot.overtime_date)}</p>
                          <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '2px 0 0' }}>
                            ⏰ {ot.start_time?.slice(0, 5)} - {ot.end_time?.slice(0, 5)} WIB ({hitungDurasiJam(ot.start_time, ot.end_time)} Jam): {ot.task_description}
                          </p>
                        </div>
                        <span className={`badge ${ot.status === 'APPROVED' ? 'badge-success' : ot.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                          {ot.status === 'APPROVED' ? 'Disetujui' : ot.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TAB 4: AKUN & BIODATA */}
          {activeTab === 'ACCOUNT' && (
            <section className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem' }}>Profil & Biodata Karyawan</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Nama Lengkap</span>
                  <span style={{ fontWeight: 600 }}>{empName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>NIK KTP</span>
                  <span style={{ fontWeight: 600 }}>{essData?.employee?.nik_ktp ? maskNik(essData.employee.nik_ktp) : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Status PTKP</span>
                  <span style={{ fontWeight: 600 }}>{essData?.employee?.ptkp_status || 'TK/0'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Status Hubungan Kerja</span>
                  <span style={{ fontWeight: 600 }}>{essData?.employee?.employment_status || 'PKWTT Tetap'}</span>
                </div>
              </div>
            </section>
          )}

        </div>
        )}

        {/* Bottom Navigation */}
        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: '440px',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: '64px',
            padding: '0 0.5rem',
            zIndex: 30,
          }}
        >
          {[
            { id: 'HOME', label: 'Beranda', icon: 'fa-solid fa-house' },
            { id: 'ATTENDANCE', label: 'Presensi', icon: 'fa-regular fa-calendar-check' },
            { id: 'REQUESTS', label: 'Pengajuan', icon: 'fa-regular fa-paper-plane' },
            { id: 'ACCOUNT', label: 'Akun', icon: 'fa-regular fa-circle-user' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <i className={item.icon} style={{ fontSize: '1.25rem' }}></i>
              <span style={{ fontSize: '0.625rem', fontWeight: activeTab === item.id ? 700 : 500 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* MODAL 1: KAMERA SELFIE & CLOCK-IN/OUT */}
        {isCameraOpen && (
          <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ maxWidth: '400px', width: '90%', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                  <i className="fa-solid fa-camera" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
                  {cameraMode === 'IN' ? 'Clock-In Selfie Masuk' : 'Clock-Out Pulang'}
                </h3>
                <button onClick={closeCameraModal} className="btn-close">&times;</button>
              </div>

              {/* Video Preview / Captured Snapshot */}
              <div
                style={{
                  width: '100%',
                  height: '240px',
                  backgroundColor: '#0f172a',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selfieSnapshot ? (
                  <img src={selfieSnapshot} alt="Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}

                {/* Target Face Guide */}
                {!selfieSnapshot && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '140px',
                      height: '180px',
                      border: '2px dashed rgba(255, 255, 255, 0.6)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>

              {/* GPS Coordinates Badge */}
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span><i className="fa-solid fa-location-dot" style={{ color: 'var(--success)' }}></i> GPS Terdeteksi:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {userCoords ? `${userCoords.lat.toFixed(4)}, ${userCoords.lon.toFixed(4)}` : 'Mendeteksi...'}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {!selfieSnapshot ? (
                  <button onClick={capturePhoto} className="btn btn-primary" style={{ width: '100%' }}>
                    <i className="fa-solid fa-camera"></i> Ambil Foto Wajah
                  </button>
                ) : (
                  <>
                    <button onClick={() => setSelfieSnapshot(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                      Foto Ulang
                    </button>
                    <button
                      onClick={handleAttendanceSubmit}
                      className="btn btn-primary"
                      style={{ flex: 2 }}
                      disabled={clockingLoading}
                    >
                      <i className={`fa-solid ${clockingLoading ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                      <span>{clockingLoading ? 'Memproses...' : 'Kirim Presensi'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: AJUKAN CUTI (UU KIA 2024) */}
        {isLeaveModalOpen && (
          <div
            className="modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLeaveModalOpen(false);
            }}
          >
            <div className="modal-content" style={{ maxWidth: '440px', width: '90%', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-calendar-plus"></i>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Pengajuan Cuti Karyawan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleLeaveSubmit}>
                <div className="form-group">
                  <label className="form-label">Jenis Cuti (UU KIA 2024)</label>
                  <select className="form-control" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                    <option value="ANNUAL">Cuti Tahunan (12 Hari)</option>
                    <option value="MATERNITY">Cuti Melahirkan (UU KIA 2024 - 3 s/d 6 Bulan)</option>
                    <option value="MENSTRUAL">Cuti Haid (2 Hari)</option>
                    <option value="MARRIAGE">Izin Menikah (3 Hari)</option>
                    <option value="BEREAVEMENT">Izin Duka (2 Hari)</option>
                    <option value="UNPAID">Cuti di Luar Tanggungan (Unpaid)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={leaveStart}
                      onChange={(e) => handleEssLeaveStartChange(e.target.value)}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                      {formatTanggalHari(leaveStart)}
                    </span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={leaveEnd}
                      onChange={(e) => handleEssLeaveEndChange(e.target.value)}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                      {formatTanggalHari(leaveEnd)}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Jumlah Hari</label>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      Otomatis tersinkronisasi
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    required
                    className="form-control"
                    value={leaveDaysCount}
                    onChange={(e) => handleEssLeaveDaysChange(Number(e.target.value))}
                  />
                </div>

                {/* Banner Ringkasan Periode Cuti */}
                <div
                  style={{
                    padding: '0.625rem 0.875rem',
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary-active)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                  }}
                >
                  <i className="fa-solid fa-calendar-check" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                    <div>
                      Durasi: <strong>{leaveDaysCount} Hari</strong>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-soft)', marginTop: '2px' }}>
                      📅 {formatTanggalHari(leaveStart)} s/d {formatTanggalHari(leaveEnd)}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Alasan Cuti</label>
                  <textarea rows={2} required className="form-control" placeholder="Keterangan pengajuan cuti..." value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="btn btn-secondary">Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={submittingLeave}>
                    <i className={`fa-solid ${submittingLeave ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                    <span>{submittingLeave ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: AJUKAN SPKL LEMBUR */}
        {isOvertimeModalOpen && (
          <div
            className="modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOvertimeModalOpen(false);
            }}
          >
            <div className="modal-content" style={{ maxWidth: '440px', width: '90%', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Pengajuan Lembur (SPKL)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOvertimeModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleOvertimeSubmit}>
                <div className="form-group">
                  <label className="form-label">Tanggal Lembur</label>
                  <input type="date" required className="form-control" value={otDate} onChange={(e) => setOtDate(e.target.value)} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                    {formatTanggalHari(otDate)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Jam Mulai</label>
                    <input type="time" required className="form-control" value={otStart} onChange={(e) => setOtStart(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jam Selesai</label>
                    <input type="time" required className="form-control" value={otEnd} onChange={(e) => setOtEnd(e.target.value)} />
                  </div>
                </div>

                {/* Banner Ringkasan Lembur */}
                <div
                  style={{
                    padding: '0.625rem 0.875rem',
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary-active)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                  }}
                >
                  <i className="fa-solid fa-bolt" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                    <div>
                      Estimasi Durasi: <strong>{hitungDurasiJam(otStart, otEnd)} Jam Lembur</strong>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-soft)', marginTop: '2px' }}>
                      ⏰ {otStart} s/d {otEnd} WIB (Sesuai Kepmenakertrans No. 102/2004)
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Uraian Tugas Lembur</label>
                  <textarea rows={2} required className="form-control" placeholder="Pekerjaan penutupan buku akhir bulan..." value={otReason} onChange={(e) => setOtReason(e.target.value)} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsOvertimeModalOpen(false)} className="btn btn-secondary">Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={submittingOt}>
                    <i className={`fa-solid ${submittingOt ? 'fa-spinner fa-spin' : 'fa-bolt'}`}></i>
                    <span>{submittingOt ? 'Mengirim...' : 'Kirim SPKL'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: LIHAT SLIP GAJI DIGITAL */}
        {selectedSlip && (
          <PayslipModal
            resultId={selectedSlip.id}
            onClose={() => setSelectedSlip(null)}
          />
        )}

      </div>
    </div>
  );
};
