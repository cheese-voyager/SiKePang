import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-plantation-gradient relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-plantation-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-leaf-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-md text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-8">
            <Leaf size={36} className="text-plantation-300" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold text-white mb-4">SiKePang</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-plantation-300 text-lg leading-relaxed">Sistem Informasi Ketahanan Pangan Komunitas</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4">
            {[{ val: '6+', lbl: 'Petani' }, { val: '8+', lbl: 'Komoditas' }, { val: '2K+', lbl: 'Kg Stok' }].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{s.val}</p>
                <p className="text-xs text-plantation-400 mt-1">{s.lbl}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-white to-plantation-50/30">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-plantation-gradient flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-plantation-900">SiKePang</span>
          </div>

          <h2 className="text-3xl font-extrabold text-plantation-900 mb-2">Masuk</h2>
          <p className="text-plantation-500 mb-8">Masuk ke akun Anda untuk mengelola data pangan</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                <input type="email" required placeholder="nama@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-plantation-400" />
                <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-plantation-400 hover:text-plantation-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-plantation-300 text-plantation-600 focus:ring-plantation-500" />
                <span className="text-plantation-600">Ingat saya</span>
              </label>
              <a href="#" className="text-plantation-600 hover:text-plantation-800 font-medium">Lupa password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-plantation-500 mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-plantation-700 font-semibold hover:text-plantation-900 underline-offset-4 hover:underline">
              Daftar sekarang
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-plantation-400 hover:text-plantation-600 transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
