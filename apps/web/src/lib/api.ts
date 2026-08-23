const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3000/api/v1');

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  token?: string | null;
  body?: any;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers = {}, body, ...rest } = options;

  const authHeaders: Record<string, string> = {
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(headers as Record<string, string>),
  };

  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    headers: authHeaders,
    body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    ...rest,
  });

  let data: any;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(
        `Layanan Backend Node.js belum aktif di Hostinger (Status ${response.status}). Pastikan aplikasi Node.js sudah di-Start di menu hPanel.`
      );
    }
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }
  }

  if (!response.ok || data.success === false) {
    const errorMsg = data.message || `Permintaan gagal dengan status ${response.status}`;
    const err = new Error(errorMsg);
    (err as any).data = data;
    throw err;
  }

  return data;
}
