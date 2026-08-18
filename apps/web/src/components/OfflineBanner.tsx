import React, { useState, useEffect } from 'react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      backgroundColor: '#f39c12',
      color: '#fff',
      padding: '0.5rem 1rem',
      textAlign: 'center',
      fontSize: '0.85rem',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <span>📡 Mode Offline Aktif</span>
      <span style={{ opacity: 0.9 }}>
        — Perubahan data disimpan terenkripsi lokal (AES-256-GCM / Dexie.js) dan akan otomatis disinkronisasi saat online.
      </span>
    </div>
  );
};
