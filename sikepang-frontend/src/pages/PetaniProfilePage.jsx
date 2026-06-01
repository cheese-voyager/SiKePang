import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Users, MapPin, Phone, Lock, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import { updatePengguna } from '../services/penggunaService';
import { useAuth } from '../contexts/AuthContext';

export default function PetaniProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kelompokTani: '',
    alamat: '',
    nomorTelepon: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || '',
        kelompokTani: user.kelompokTani || '',
        alamat: user.alamat || '',
        nomorTelepon: user.nomorTelepon || '',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const payload = {
        nama: formData.nama,
        email: user.email,
        role: user.role,
        kelompokTani: formData.kelompokTani,
        alamat: formData.alamat,
        nomorTelepon: formData.nomorTelepon,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      await updatePengguna(user.id, payload);
      await refreshProfile();
      setSuccess(true);
      setFormData(prev => ({ ...prev, password: '' }));
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Profil Saya" subtitle="Perbarui data diri dan informasi kelompok tani Anda" />

      <div className="max-w-2xl">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 mb-6 bg-green-50 border border-green-200 rounded-xl text-green-700"
          >
            <CheckCircle size={20} className="flex-shrink-0" />
            <p className="text-sm font-medium">Profil berhasil diperbarui!</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-light p-6"
        >
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-plantation-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-plantation-400 to-leaf-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {user?.nama?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div>
              <p className="text-lg font-bold text-plantation-900">{user?.nama}</p>
              <p className="text-sm text-plantation-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-plantation-100 text-plantation-600 uppercase tracking-wide">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5 flex items-center gap-2">
                <User size={14} className="text-plantation-400" /> Nama Lengkap
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Nama lengkap Anda"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>

            {/* Kelompok Tani */}
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5 flex items-center gap-2">
                <Users size={14} className="text-plantation-400" /> Kelompok Tani
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Nama kelompok tani"
                value={formData.kelompokTani}
                onChange={(e) => setFormData({ ...formData, kelompokTani: e.target.value })}
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5 flex items-center gap-2">
                <MapPin size={14} className="text-plantation-400" /> Alamat
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Alamat lengkap Anda"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5 flex items-center gap-2">
                <Phone size={14} className="text-plantation-400" /> Nomor Telepon
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="08xxxxxxxxxx"
                value={formData.nomorTelepon}
                onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5 flex items-center gap-2">
                <Lock size={14} className="text-plantation-400" /> Password Baru
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="(Biarkan kosong jika tidak ingin mengubah password)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary flex items-center gap-2 w-full justify-center"
              >
                <Save size={18} />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
