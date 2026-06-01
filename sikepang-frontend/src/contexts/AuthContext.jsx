// =============================================================
// Auth Context – Global state management untuk autentikasi
// =============================================================
// Gunakan `useAuth()` di komponen manapun untuk akses:
//   - user, isAuthenticated, loading
//   - handleLogin, handleLogout
// =============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  isAuthenticated as checkAuth,
  getProfile,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cek auth state saat app pertama kali di-load
  useEffect(() => {
    async function initAuth() {
      try {
        if (checkAuth()) {
          // Ada token & user data, coba validasi ke backend
          const profile = await getProfile();
          setUser(profile);
        }
      } catch {
        // Token expired / invalid → clear
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  /**
   * Handle login – dipanggil dari LoginPage
   * @returns {{ success: boolean, message: string, role?: string }}
   */
  const handleLogin = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginService(email, password);

      if (result.success) {
        setUser(result.user);
        return {
          success: true,
          message: result.message,
          role: result.user?.role,
        };
      }

      setError(result.message);
      return { success: false, message: result.message };
    } catch (err) {
      const msg = "Terjadi kesalahan. Silakan coba lagi.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle logout – bersihkan state & redirect
   */
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch {
      return null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    await logoutService();
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    handleLogin,
    handleLogout,
    refreshProfile,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook untuk mengakses auth context dari komponen manapun.
 * @example
 *   const { user, handleLogin, handleLogout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
  }
  return context;
}

export default AuthContext;
