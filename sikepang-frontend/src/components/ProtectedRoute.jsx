// =============================================================
// Protected Route – Route guard untuk halaman yang butuh auth
// =============================================================
// Digunakan di App.jsx untuk membungkus route yang butuh login.
//
// Props:
//   - allowedRoles: array role yang boleh akses (misal ['ADMIN','PETUGAS'])
//   - children: komponen halaman
// =============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  // Tampilkan loading saat cek auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plantation-50 via-white to-leaf-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-plantation-200 border-t-plantation-600 rounded-full animate-spin" />
          <p className="text-sm text-plantation-500 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  // Belum login → redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Cek role jika ada allowedRoles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User login tapi role tidak sesuai → redirect ke dashboard yang sesuai
    const redirectPath = user?.role === 'PETANI' ? '/petani' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
