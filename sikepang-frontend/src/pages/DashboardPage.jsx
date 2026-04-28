import { motion } from 'framer-motion';
import {
  Users, Package, Warehouse, Truck, TrendingUp,
  ArrowUpRight, ArrowDownRight, Sprout, MapPin, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import Header from '../components/Header';
import {
  mockDashboardStats, stokPerKomoditas, distribusiPerBulan,
  stokTrend, mockDistribusi
} from '../data/mockData';

const statusColors = {
  'SELESAI': 'badge-success',
  'DIKIRIM': 'badge-info',
  'DIPROSES': 'badge-warning',
  'MENUNGGU': 'badge-danger',
};

const PIE_COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#84cc16', '#65a30d', '#4d7c0f', '#a3e635'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-plantation-100">
        <p className="text-sm font-semibold text-plantation-800">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs text-plantation-600 mt-1">
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Ringkasan data ketahanan pangan komunitas"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Users} label="Total Petani" value={stats.totalPetani} subtitle={`${stats.kelompokTani.length} Kelompok Tani`} color="green" delay={0} />
        <StatCard icon={Package} label="Jenis Komoditas" value={stats.totalKomoditas} subtitle="Aktif dipantau" color="leaf" delay={0.1} />
        <StatCard icon={Warehouse} label="Stok Masuk" value={`${stats.totalStokMasuk} Kg`} subtitle="Total bulan ini" color="earth" delay={0.2} />
        <StatCard icon={Truck} label="Total Distribusi" value={stats.totalDistribusi} subtitle={`${stats.distribusiSelesai} selesai`} color="blue" delay={0.3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Stock Trend Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-light p-6"
        >
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Tren Stok Pangan</h3>
          <p className="text-xs text-plantation-500 mb-4">Perbandingan stok masuk vs keluar per bulan</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stokTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="masuk" stroke="#22c55e" fill="url(#colorMasuk)" strokeWidth={2.5} name="Masuk" />
              <Area type="monotone" dataKey="keluar" stroke="#f59e0b" fill="url(#colorKeluar)" strokeWidth={2.5} name="Keluar" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Commodity Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card-light p-6"
        >
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Stok per Komoditas</h3>
          <p className="text-xs text-plantation-500 mb-4">Distribusi stok berdasarkan jenis komoditas</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stokPerKomoditas}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="stok"
                nameKey="name"
              >
                {stokPerKomoditas.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#6b7280' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row - Distribution Bar Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card-light p-6 lg:col-span-1"
        >
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Distribusi per Bulan</h3>
          <p className="text-xs text-plantation-500 mb-4">Jumlah pengiriman distribusi</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distribusiPerBulan} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="jumlah" fill="#22c55e" radius={[8, 8, 0, 0]} name="Distribusi" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Distribution Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card-light p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Aktivitas Distribusi Terkini</h3>
          <p className="text-xs text-plantation-500 mb-4">Daftar distribusi terbaru</p>
          <div className="space-y-3">
            {mockDistribusi.slice(0, 5).map((dist, i) => (
              <motion.div
                key={dist.idDistribusi}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-plantation-50/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-plantation-100 flex items-center justify-center group-hover:bg-plantation-200 transition-colors">
                  <Truck size={18} className="text-plantation-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-plantation-800 truncate">{dist.tujuan}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-plantation-500 flex items-center gap-1">
                      <Users size={11} /> {dist.namaPetani}
                    </span>
                    <span className="text-xs text-plantation-400">•</span>
                    <span className="text-xs text-plantation-500 flex items-center gap-1">
                      <Calendar size={11} /> {dist.tanggalDistribusi}
                    </span>
                  </div>
                </div>
                <span className={statusColors[dist.status]}>{dist.status}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card-light p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-plantation-100 to-plantation-200 flex items-center justify-center">
            <Sprout size={22} className="text-plantation-700" />
          </div>
          <div>
            <p className="text-xs text-plantation-500 font-medium">Total Luas Lahan</p>
            <p className="text-xl font-bold text-plantation-900">{stats.totalLuasLahan} Ha</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="glass-card-light p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-leaf-100 to-leaf-200 flex items-center justify-center">
            <MapPin size={22} className="text-leaf-700" />
          </div>
          <div>
            <p className="text-xs text-plantation-500 font-medium">Kelompok Tani</p>
            <p className="text-xl font-bold text-plantation-900">{stats.kelompokTani.length} Kelompok</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass-card-light p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <TrendingUp size={22} className="text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-plantation-500 font-medium">Distribusi Diproses</p>
            <p className="text-xl font-bold text-plantation-900">{stats.distribusiProses} Proses</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
