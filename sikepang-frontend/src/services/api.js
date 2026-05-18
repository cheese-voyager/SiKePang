// =============================================================
// API Configuration – Central HTTP Client
// =============================================================
// Semua request ke backend harus lewat sini agar token JWT
// otomatis di-attach dan error 401 otomatis di-handle.
// =============================================================

const API_BASE_URL = 'http://127.0.0.1:8081/api';

/**
 * Helper: ambil access token dari localStorage
 */
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

/**
 * Helper: ambil refresh token dari localStorage
 */
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

/**
 * Helper: simpan tokens ke localStorage
 */
function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

/**
 * Helper: hapus semua auth data dari localStorage
 */
function clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

/**
 * Coba refresh access token menggunakan refresh token.
 * Jika gagal, clear auth data & redirect ke login.
 */
async function tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuth();
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearAuth();
      return null;
    }

    const data = await res.json();
    setTokens({
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
    });
    return data.accessToken || data.token;
  } catch {
    clearAuth();
    return null;
  }
}

/**
 * Central fetch wrapper.
 * - Otomatis attach Authorization header.
 * - Otomatis retry 1x jika 401 (pakai refresh token).
 * - Throw error dengan pesan yang user-friendly.
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Temporary: Send X-User-Id since backend JWT parsing is not fully implemented
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      const userObj = JSON.parse(rawUser);
      if (userObj.id) headers['X-User-Id'] = userObj.id.toString();
    }
  } catch(e) {}

  let response = await fetch(url, { ...options, headers });

  // Jika 401, coba refresh token lalu retry sekali
  if (response.status === 401 && token) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    } else {
      // Redirect ke login jika refresh gagal
      window.location.href = '/login';
      throw new Error('Sesi telah berakhir. Silakan login kembali.');
    }
  }

  return response;
}

export { API_BASE_URL, getAccessToken, getRefreshToken, setTokens, clearAuth };
