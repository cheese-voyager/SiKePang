import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Package, Warehouse, Truck, TrendingUp, TrendingDown, Minus,
  ArrowUpRight, ArrowDownRight, Sprout, MapPin, Calendar, BadgeDollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import Header from '../components/Header';
import { getDashboardStats, getStokTrend, getDistribusiPerBulan, getHargaPasar } from '../services/dashboardService';
import { getStok } from '../services/stokService';
import { getDistribusi } from '../services/distribusiService';

const statusColors = {
  'SELESAI': 'badge-success',
  'DIKIRIM': 'badge-info',
  'DIPROSES': 'badge-warning',
  'MENUNGGU': 'badge-danger',
  'PENDING': 'badge-warning'
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
  const [stats, setStats] = useState(null);
  const [hargaPasar, setHargaPasar] = useState([]);
  const [stokTrend, setStokTrend] = useState([]);
  const [stokPerKomoditas, setStokPerKomoditas] = useState([]);
  const [distribusiPerBulan, setDistribusiPerBulan] = useState([]);
  const [recentDistribusi, setRecentDistribusi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          statsData, 
          hargaData, 
          trendData, 
          distBulanData,
          stokData,
          distData
        ] = await Promise.all([
          getDashboardStats(),
          getHargaPasar(),
          getStokTrend(),
          getDistribusiPerBulan(),
          getStok(),
          getDistribusi()
        ]);

        setStats(statsData);
        setHargaPasar(hargaData || []);
        setStokTrend(trendData || []);
        setDistribusiPerBulan(distBulanData || []);
        
        // Calculate Stok Per Komoditas
        if (stokData) {
          const stokMap = {};
          stokData.forEach(s => {
            if (!stokMap[s.namaKomoditas]) stokMap[s.namaKomoditas] = 0;
            if (s.jenisTransaksi === 'MASUK') stokMap[s.namaKomoditas] += s.jumlah;
            else if (s.jenisTransaksi === 'KELUAR') stokMap[s.namaKomoditas] -= s.jumlah;
          });
          const pieData = Object.keys(stokMap)
            .map(k => ({ name: k, stok: stokMap[k] }))
            .filter(item => item.stok > 0);
          setStokPerKomoditas(pieData);
        }

        if (distData) {
          // Sort by date descending (newest first) and take top 5
          const sortedDist = distData.sort((a, b) => new Date(b.tanggalDistribusi) - new Date(a.tanggalDistribusi));
          setRecentDistribusi(sortedDist.slice(0, 5));
        }

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plantation-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Ringkasan data ketahanan pangan komunitas"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Users} label="Total Petani" value={stats.totalPetani} subtitle="Petani terdaftar" color="green" delay={0} />
        <StatCard icon={Package} label="Jenis Komoditas" value={stats.totalKomoditas} subtitle="Aktif dipantau" color="leaf" delay={0.1} />
        <StatCard icon={Warehouse} label="Stok Masuk" value={`${stats.totalStokMasuk} Kg`} subtitle="Total historis" color="earth" delay={0.2} />
        <StatCard icon={Truck} label="Total Distribusi" value={stats.totalDistribusi} subtitle={`${stats.distribusiSelesai} selesai`} color="blue" delay={0.3} />
      </div>

      {/* Harga Komoditas di Pasar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
            <BadgeDollarSign size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-plantation-900">Harga Komoditas di Pasar</h3>
            <p className="text-xs text-plantation-500">Update harga terkini per komoditas</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hargaPasar.length > 0 ? hargaPasar.map((item, i) => {
            return (
              <motion.div
                key={item.nama}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="glass-card-light p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-plantation-800 leading-tight">{item.nama}</p>
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-plantation-50 text-plantation-400`}>
                    <Minus size={10} /> Stabil
                  </span>
                </div>
                <p className="text-xl font-extrabold text-plantation-900">
                  Rp{item.harga.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-plantation-400 ml-0.5">/{item.satuan}</span>
                </p>
                {item.kategori && (
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-plantation-100 text-plantation-600">
                    {item.kategori}
                  </span>
                )}
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-4 text-center text-sm text-plantation-500 glass-card-light">
              Belum ada data harga pasar tersedia.
            </div>
          )}
        </div>
      </motion.div>

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
            {stokTrend.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-plantation-400">
                Belum ada data stok.
              </div>
            )}
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
            {stokPerKomoditas.length > 0 ? (
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
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-sm text-plantation-400">
                 <Package size={48} className="mb-2 opacity-30" />
                 Belum ada stok pangan.
               </div>
            )}
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
            {distribusiPerBulan.length > 0 ? (
              <BarChart data={distribusiPerBulan} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="jumlah" fill="#22c55e" radius={[8, 8, 0, 0]} name="Distribusi" />
              </BarChart>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-plantation-400">
                Belum ada data distribusi.
              </div>
            )}
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
            {recentDistribusi.length > 0 ? recentDistribusi.map((dist, i) => (
              <motion.div
                key={dist.id}
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
                      <Calendar size={11} /> {new Date(dist.tanggalDistribusi).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
                <span className={statusColors[dist.status] || 'badge-secondary'}>{dist.status}</span>
              </motion.div>
            )) : (
              <div className="py-6 text-center text-sm text-plantation-400">
                Belum ada aktivitas distribusi.
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
