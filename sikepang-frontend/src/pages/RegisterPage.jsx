import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';



export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: '', email: '', phone: '', password: '', confirmPassword: '', secretKey: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    setLoading(true);
    
    try {
      // Panggil API Backend Spring Boot
      const response = await fetch('http://127.0.0.1:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          password: form.password,
          phone: form.phone,
          secretKey: form.secretKey,
          kelompokTani: '-', // Default kosong
          alamat: '-'        // Default kosong
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Pendaftaran berhasil! Silakan login.');
        navigate('/login');
      } else {
        alert('Pendaftaran gagal: ' + data.message);
      }
    } catch (error) {
      alert('Gagal menghubungi server. Pastikan backend sudah menyala.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-plantation-gradient relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-plantation-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-leaf-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-sm">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}
            className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8">
            <Leaf size={30} className="text-plantation-300" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold text-white mb-4">Bergabung dengan SiKePang</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-plantation-300 leading-relaxed mb-8">Daftarkan diri Anda dan mulai mengelola data pangan komunitas secara digital.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-4">
            {['Pencatatan stok pangan real-time', 'Distribusi termonitor otomatis', 'Dashboard analitik lengkap', 'Gratis untuk komunitas'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-plantation-400 flex-shrink-0" />
                <p className="text-sm text-plantation-200">{t}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-white to-plantation-50/30 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-plantation-gradient flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-plantation-900">SiKePang</span>
          </div>

          <h2 className="text-3xl font-extrabold text-plantation-900 mb-2">Buat Akun</h2>
          <p className="text-plantation-500 mb-6">Isi data di bawah untuk mendaftar ke SiKePang</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                  <input type="text" required placeholder="Nama Anda" value={form.nama}
                    onChange={e => set('nama', e.target.value)} className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">No. Telepon</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                  <input type="tel" required placeholder="08xxxxxxxxxx" value={form.phone}
                    onChange={e => set('phone', e.target.value)} className="input-field pl-11" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                <input type="email" required placeholder="nama@email.com" value={form.email}
                  onChange={e => set('email', e.target.value)} className="input-field pl-11" />
              </div>
            </div>

            {/* Secret Key for Role */}
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Kode Rahasia Peran (Opsional)</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                <input type="text" placeholder="Kosongkan jika mendaftar sebagai Petani" value={form.secretKey}
                  onChange={e => set('secretKey', e.target.value)} className="input-field pl-11" />
              </div>
              <p className="text-xs text-plantation-500 mt-1">Masukkan kode rahasia jika Anda mendaftar sebagai Admin atau Petugas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                  <input type={showPass ? 'text' : 'password'} required placeholder="Min. 8 karakter" value={form.password}
                    onChange={e => set('password', e.target.value)} className="input-field pl-11 pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-plantation-400 hover:text-plantation-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Konfirmasi Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                  <input type={showPass ? 'text' : 'password'} required placeholder="Ulangi password" value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)} className="input-field pl-11" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Daftar Sekarang <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-plantation-500 mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-plantation-700 font-semibold hover:text-plantation-900 underline-offset-4 hover:underline">
              Masuk di sini
            </Link>
          </p>
          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-plantation-400 hover:text-plantation-600 transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
