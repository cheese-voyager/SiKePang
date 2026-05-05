import { motion } from 'framer-motion';
import {
  Package, Warehouse, Truck, TrendingUp,
  Sprout, Calendar, Users
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import Header from '../components/Header';
import {
  mockStokPangan, mockDistribusi, mockPetani
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

export default function PetaniDashboardPage() {
  const currentPetaniId = 1; // Mock: Budi Santoso
  const currentPetani = mockPetani.find(p => p.id === currentPetaniId);
  const myGroupFarmers = mockPetani.filter(p => p.namaKelompok === currentPetani.namaKelompok).map(p => p.id);

  const myStok = mockStokPangan.filter(s => s.idPetani === currentPetaniId);
  const myDistribusi = mockDistribusi.filter(d => myGroupFarmers.includes(d.idPetani));

  const totalStokMasuk = myStok.filter(s => s.status === 'MASUK').reduce((a, b) => a + b.jumlahStok, 0);
  const totalStokKeluar = myStok.filter(s => s.status === 'KELUAR').reduce((a, b) => a + b.jumlahStok, 0);
  
  // Aggregate stock for pie chart
  const stokMap = {};
  myStok.forEach(s => {
    if (!stokMap[s.namaKomoditas]) stokMap[s.namaKomoditas] = 0;
    if (s.status === 'MASUK') stokMap[s.namaKomoditas] += s.jumlahStok;
    else if (s.status === 'KELUAR') stokMap[s.namaKomoditas] -= s.jumlahStok;
  });
  const stokPerKomoditas = Object.keys(stokMap).map(k => ({ name: k, stok: stokMap[k] })).filter(item => item.stok > 0);

  // Mock Trend for this farmer
  const stokTrend = [
    { bulan: 'Jan', masuk: 100, keluar: 20 },
    { bulan: 'Feb', masuk: 200, keluar: 50 },
    { bulan: 'Mar', masuk: 250, keluar: 80 },
    { bulan: 'Apr', masuk: totalStokMasuk, keluar: totalStokKeluar },
  ];

  const distribusiPerBulan = [
    { bulan: 'Jan', jumlah: 1 },
    { bulan: 'Feb', jumlah: 2 },
    { bulan: 'Mar', jumlah: 3 },
    { bulan: 'Apr', jumlah: myDistribusi.length },
  ];

  return (
    <div>
      <Header
        title={`Halo, ${currentPetani.nama} 👋`}
        subtitle={`Ringkasan data pangan Anda di kelompok ${currentPetani.namaKelompok}`}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Sprout} label="Luas Lahan" value={`${currentPetani.luasLahan} Ha`} subtitle="Total area tanam" color="green" delay={0} />
        <StatCard icon={Package} label="Komoditas Aktif" value={stokPerKomoditas.length} subtitle="Sedang dikelola" color="leaf" delay={0.1} />
        <StatCard icon={Warehouse} label="Stok Saat Ini" value={`${totalStokMasuk - totalStokKeluar} Kg`} subtitle="Tersedia di gudang" color="earth" delay={0.2} />
        <StatCard icon={Truck} label="Distribusi Kelompok" value={myDistribusi.length} subtitle="Total pengiriman" color="blue" delay={0.3} />
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
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Tren Stok Pangan Anda</h3>
          <p className="text-xs text-plantation-500 mb-4">Perbandingan panen masuk vs distribusi keluar</p>
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
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Komposisi Stok Anda</h3>
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
              <div className="w-full h-full flex flex-col items-center justify-center text-plantation-400">
                <Package size={48} className="mb-2 opacity-50" />
                <p>Belum ada stok pangan</p>
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
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Distribusi Kelompok</h3>
          <p className="text-xs text-plantation-500 mb-4">Jumlah pengiriman oleh {currentPetani.namaKelompok}</p>
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
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Aktivitas Distribusi Kelompok</h3>
          <p className="text-xs text-plantation-500 mb-4">Riwayat distribusi dari {currentPetani.namaKelompok}</p>
          <div className="space-y-3">
            {myDistribusi.length > 0 ? myDistribusi.slice(0, 5).map((dist, i) => (
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
            )) : (
              <div className="py-8 text-center text-plantation-400">
                <p>Belum ada riwayat distribusi untuk kelompok ini.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
