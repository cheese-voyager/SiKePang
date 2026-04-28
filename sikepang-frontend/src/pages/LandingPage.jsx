import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf, Menu, X, ChevronRight, Users, Package, Warehouse, Truck,
  BarChart3, Shield, Clock, Sprout, ArrowRight, Star, Quote, MapPin,
  Mail, Phone, CheckCircle2, Zap, Eye, Target
} from 'lucide-react';

const navLinks = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'tentang', label: 'Tentang' },
  { id: 'fitur', label: 'Fitur' },
];
const navLinksRight = [
  { id: 'tim', label: 'Tim' },
  { id: 'testimoni', label: 'Testimoni' },
  { id: 'kontak', label: 'Kontak' },
];

const teamMembers = [
  { nim: '152024032', nama: 'Zakhwa Aliya', role: 'Project Manager' },
  { nim: '152024035', nama: 'Putri Yudi Patrecia', role: 'Backend Developer' },
  { nim: '152024047', nama: 'Zeta Mardhotillah R.', role: 'Frontend Developer' },
  { nim: '152024127', nama: 'Dzakiyya Puteri Aulia', role: 'Database Engineer' },
];

const features = [
  { icon: Users, title: 'Manajemen Petani', desc: 'Kelola data petani dan kelompok tani secara terpusat dengan pencarian dan filter cerdas.' },
  { icon: Package, title: 'Data Komoditas', desc: 'Pantau jenis komoditas, kategori, harga, dan satuan pangan dalam satu platform.' },
  { icon: Warehouse, title: 'Stok Real-time', desc: 'Catat stok masuk dan keluar secara real-time. Pantau saldo stok pangan setiap saat.' },
  { icon: Truck, title: 'Distribusi Pangan', desc: 'Kelola distribusi pangan dari petani ke tujuan dengan pelacakan status lengkap.' },
  { icon: BarChart3, title: 'Dashboard Analitik', desc: 'Visualisasi data melalui grafik dan chart interaktif untuk pengambilan keputusan.' },
  { icon: Shield, title: 'Multi-Role Akses', desc: 'Sistem role Admin, Petugas, dan Petani dengan autentikasi yang aman.' },
];

const benefits = [
  { icon: Zap, title: 'Efisiensi Tinggi', desc: 'Kurangi pencatatan manual hingga 90% dengan digitalisasi penuh.' },
  { icon: Eye, title: 'Transparansi Data', desc: 'Data stok dan distribusi dapat dipantau real-time oleh semua pihak.' },
  { icon: Target, title: 'Distribusi Tepat', desc: 'Minimalkan keterlambatan distribusi dengan pelacakan status terpadu.' },
  { icon: Clock, title: 'Hemat Waktu', desc: 'Proses yang sebelumnya berhari-hari kini hanya hitungan menit.' },
];

const testimonials = [
  { name: 'Pak Budi Santoso', role: 'Ketua Kelompok Tani Makmur', text: 'Sejak pakai SiKePang, pencatatan stok jadi jauh lebih mudah. Tidak perlu lagi catat manual di buku yang sering hilang.', rating: 5 },
  { name: 'Ibu Siti Aminah', role: 'Petani, Desa Sukamaju', text: 'Distribusi pangan sekarang lebih teratur. Saya bisa pantau pengiriman dari HP tanpa harus datang ke kantor desa.', rating: 5 },
  { name: 'Ahmad Hidayat', role: 'Petugas Lapangan', text: 'Dashboard-nya sangat membantu untuk laporan bulanan. Data sudah tersaji dalam grafik, tinggal cetak saja.', rating: 4 },
];

const howItWorks = [
  { step: '01', title: 'Daftarkan Data', desc: 'Petani dan kelompok tani mendaftarkan data melalui petugas lapangan.' },
  { step: '02', title: 'Catat Komoditas', desc: 'Input data komoditas dan pencatatan stok masuk dari hasil panen.' },
  { step: '03', title: 'Kelola Distribusi', desc: 'Buat jadwal distribusi dan pantau pengiriman ke berbagai tujuan.' },
  { step: '04', title: 'Pantau Dashboard', desc: 'Akses dashboard analitik untuk monitoring ketersediaan pangan.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ===== NAVBAR ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-plantation-900/95 backdrop-blur-md shadow-lg' : 'bg-plantation-900/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left links - desktop */}
            <div className="hidden md:flex items-center gap-6 flex-1">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm font-medium text-plantation-200 hover:text-white transition-colors tracking-wide uppercase">
                  {l.label}
                </button>
              ))}
            </div>
            {/* Center logo */}
            <div className="flex items-center justify-center flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-plantation-950 border-2 border-plantation-600 flex items-center justify-center shadow-glow">
                <Leaf size={24} className="text-plantation-400" />
              </div>
            </div>
            {/* Right links - desktop */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
              {navLinksRight.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm font-medium text-plantation-200 hover:text-white transition-colors tracking-wide uppercase">
                  {l.label}
                </button>
              ))}
            </div>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-plantation-900/98 backdrop-blur-md border-t border-white/10 px-4 pb-4">
            {[...navLinks, ...navLinksRight].map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left py-3 text-plantation-200 hover:text-white font-medium border-b border-white/5 transition-colors">
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section id="beranda" className="relative pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-plantation-950 via-plantation-900 to-plantation-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-plantation-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-leaf-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 bg-plantation-700/50 text-plantation-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-plantation-600/30">
              <Sprout size={14} /> Sistem Informasi Ketahanan Pangan
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Wujudkan <span className="text-gradient">Ketahanan Pangan</span> Komunitas Digital
            </h1>
            <p className="text-lg text-plantation-300 leading-relaxed mb-8 max-w-lg">
              SiKePang membantu mengelola data petani, komoditas, stok pangan, dan distribusi secara digital — menggantikan pencatatan manual yang rentan kesalahan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary flex items-center gap-2 text-base">
                Masuk Dashboard <ArrowRight size={18} />
              </Link>
              <button onClick={() => scrollTo('fitur')} className="btn-secondary flex items-center gap-2 text-base">
                Lihat Fitur
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden md:flex justify-center">
            <img src="/hero-illustration.png" alt="SiKePang Digital Agriculture" className="w-full max-w-md rounded-2xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-plantation-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-plantation-100">
          {[
            { val: '6+', label: 'Petani Terdaftar' },
            { val: '8+', label: 'Komoditas Pangan' },
            { val: '2K+', label: 'Kg Stok Terpantau' },
            { val: '6+', label: 'Distribusi Aktif' },
          ].map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="p-5 md:p-6 text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-plantation-800">{s.val}</p>
              <p className="text-xs text-plantation-500 mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section id="tentang" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-sm font-bold text-plantation-500 uppercase tracking-widest mb-3">Tentang SiKePang</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-plantation-900 leading-tight mb-6">
              Digitalisasi Pertanian untuk Komunitas yang Lebih Kuat
            </h2>
            <p className="text-plantation-600 leading-relaxed mb-6">
              Indonesia sebagai negara agraris memiliki potensi pertanian yang besar, namun pengelolaan data pertanian dan distribusi pangan masih sering dilakukan secara manual dan konvensional.
            </p>
            <div className="space-y-3">
              {['Ketidakakuratan data stok pangan', 'Keterlambatan distribusi pangan', 'Sulitnya pemantauan secara real-time', 'Pencatatan manual rentan kesalahan'].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-plantation-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-plantation-700">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="bg-plantation-50 rounded-2xl p-5 hover:bg-plantation-100 transition-colors">
                <b.icon size={28} className="text-plantation-600 mb-3" />
                <h4 className="font-bold text-plantation-900 text-sm mb-1">{b.title}</h4>
                <p className="text-xs text-plantation-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FITUR ===== */}
      <section id="fitur" className="py-20 md:py-28 bg-plantation-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-sm font-bold text-plantation-500 uppercase tracking-widest mb-3">Fitur Unggulan</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-plantation-900">Semua yang Anda Butuhkan</h2>
            <p className="text-plantation-600 mt-3 max-w-2xl mx-auto">Fitur lengkap untuk mengelola ketahanan pangan dari hulu ke hilir.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-plantation-100 hover:border-plantation-300 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-plantation-100 flex items-center justify-center mb-4 group-hover:bg-plantation-500 transition-colors">
                  <f.icon size={22} className="text-plantation-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-plantation-900 mb-2">{f.title}</h3>
                <p className="text-sm text-plantation-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CARA KERJA ===== */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <p className="text-sm font-bold text-plantation-500 uppercase tracking-widest mb-3">Cara Kerja</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-plantation-900">Mudah dalam 4 Langkah</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((h, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.12 }} className="text-center">
              <div className="w-16 h-16 rounded-full bg-plantation-900 text-white text-xl font-extrabold flex items-center justify-center mx-auto mb-4">{h.step}</div>
              <h4 className="text-lg font-bold text-plantation-900 mb-2">{h.title}</h4>
              <p className="text-sm text-plantation-600">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TIM ===== */}
      <section id="tim" className="py-20 md:py-28 bg-plantation-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-sm font-bold text-plantation-500 uppercase tracking-widest mb-3">Tim Pengembang</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-plantation-900">Kelompok 5 — BB-1</h2>
            <p className="text-plantation-600 mt-3">Dikembangkan untuk Tugas UTS Praktikum PBO / OOP (2026)</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((m, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 text-center border border-plantation-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-plantation-400 to-plantation-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {m.nama.charAt(0)}
                </div>
                <h4 className="font-bold text-plantation-900 text-sm">{m.nama}</h4>
                <p className="text-[11px] text-plantation-500 mt-0.5">{m.nim}</p>
                <span className="inline-block mt-2 bg-plantation-100 text-plantation-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">{m.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONI ===== */}
      <section id="testimoni" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <p className="text-sm font-bold text-plantation-500 uppercase tracking-widest mb-3">Testimoni</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-plantation-900">Apa Kata Pengguna</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.12 }}
              className="bg-white rounded-2xl p-6 border border-plantation-100 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }, (_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}</div>
              <p className="text-sm text-plantation-700 leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-plantation-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-plantation-300 to-plantation-500 flex items-center justify-center text-white text-sm font-bold">{t.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-bold text-plantation-900">{t.name}</p>
                  <p className="text-[11px] text-plantation-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28 bg-plantation-gradient">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Leaf size={40} className="text-plantation-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Siap Mendigitalkan Pertanian Anda?</h2>
            <p className="text-plantation-300 text-lg mb-8 max-w-xl mx-auto">Mulai kelola data pangan komunitas Anda secara efisien dengan SiKePang hari ini.</p>
            <Link to="/register" className="bg-white text-plantation-800 px-8 py-4 rounded-xl font-bold text-base hover:bg-plantation-100 transition-colors shadow-lg inline-flex items-center gap-2">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="kontak" className="bg-plantation-950 text-plantation-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-plantation-800 flex items-center justify-center"><Leaf size={18} className="text-plantation-400" /></div>
              <span className="text-lg font-bold text-white">SiKePang</span>
            </div>
            <p className="text-sm leading-relaxed">Sistem Informasi Ketahanan Pangan Komunitas — solusi digital untuk pengelolaan pangan Indonesia.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Navigasi</h4>
            <div className="space-y-2">{[...navLinks, ...navLinksRight].map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="block text-sm hover:text-white transition-colors">{l.label}</button>
            ))}</div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Teknologi</h4>
            <div className="flex flex-wrap gap-2">
              {['Java 21', 'Spring Boot', 'React JS', 'Tailwind CSS', 'MySQL', 'REST API'].map(t => (
                <span key={t} className="bg-plantation-800 text-plantation-300 text-[11px] px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-plantation-800 text-center">
          <p className="text-xs text-plantation-500">© 2026 SiKePang — Kelompok 5 [BB-1] | Praktikum PBO / OOP</p>
        </div>
      </footer>
    </div>
  );
}
