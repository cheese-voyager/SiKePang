// =============================================================
// Auth Service – Semua fungsi terkait autentikasi
// =============================================================

import { apiFetch, setTokens, clearAuth } from './api';

/**
 * Login – mengirim credentials ke backend dan menyimpan token + user data.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user: object|null, message: string }}
 */
export async function login(email, password) {
  try {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success !== false) {
      // Simpan tokens
      setTokens({
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken,
      });

      // Simpan user data ke localStorage
      const user = data.user || data.data || {
        id: data.id,
        nama: data.nama,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user, message: 'Login berhasil!' };
    }

    return {
      success: false,
      user: null,
      message: data.message || 'Email atau password salah.',
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      message: error.message || 'Gagal menghubungi server. Pastikan backend sudah menyala.',
    };
  }
}

/**
 * Register – mengirim data pendaftaran ke backend.
 *
 * @param {object} formData – { nama, email, password, phone, secretKey }
 * @returns {{ success: boolean, message: string }}
 */
export async function register(formData) {
  try {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        secretKey: formData.secretKey,
        kelompokTani: '-',
        alamat: '-',
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, message: 'Pendaftaran berhasil! Silakan login.' };
    }

    return {
      success: false,
      message: data.message || 'Pendaftaran gagal. Silakan coba lagi.',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Gagal menghubungi server. Pastikan backend sudah menyala.',
    };
  }
}

/**
 * Logout – hapus semua data autentikasi dari client.
 * Jika backend punya endpoint logout, panggil juga.
 */
export async function logout() {
  try {
    // Coba panggil endpoint logout di backend (optional, tidak semua backend punya)
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
  } finally {
    clearAuth();
  }
}

/**
 * Ambil profile user yang sedang login dari backend.
 * Fallback ke data localStorage jika endpoint tidak tersedia.
 *
 * @returns {object|null} user data
 */
export async function getProfile() {
  try {
    const response = await apiFetch('/auth/profile');

    if (response.ok) {
      const data = await response.json();
      const user = data.user || data.data || data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }

    // Fallback ke data tersimpan di localStorage
    return getCurrentUser();
  } catch {
    return getCurrentUser();
  }
}

/**
 * Ambil user data dari localStorage (tanpa hit API).
 *
 * @returns {object|null}
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Cek apakah user saat ini sudah authenticated.
 *
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!localStorage.getItem('accessToken') && !!getCurrentUser();
}

/**
 * Ambil role user saat ini.
 *
 * @returns {string|null} – 'ADMIN' | 'PETUGAS' | 'PETANI' | null
 */
export function getUserRole() {
  const user = getCurrentUser();
  return user?.role || null;
}
