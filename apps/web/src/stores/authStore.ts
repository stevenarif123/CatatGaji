import { create } from 'zustand';

export interface AuthState {
  token: string | null;
  userId: string | null;
  tenantId: string | null;
  userName: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { token: string; user_id: string; tenant_id: string; role: string; user_name?: string }) => void;
  logout: () => void;
}

const STORAGE_KEY = 'catatgaji_auth';

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const initial = getStoredAuth() || {};

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token || null,
  userId: initial.user_id || null,
  tenantId: initial.tenant_id || null,
  userName: initial.user_name || 'Owner Administrator',
  role: initial.role || null,
  isAuthenticated: !!initial.token,

  setAuth: (payload) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    set({
      token: payload.token,
      userId: payload.user_id,
      tenantId: payload.tenant_id,
      userName: payload.user_name || 'Owner Administrator',
      role: payload.role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      token: null,
      userId: null,
      tenantId: null,
      userName: null,
      role: null,
      isAuthenticated: false,
    });
  },
}));
