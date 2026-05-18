import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Warehouse, Truck, TrendingUp, TrendingDown, Minus,
  Sprout, Calendar, Users, BadgeDollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import Header from '../components/Header';
import { getStokByPetani } from '../services/stokService';
import { getDistribusi } from '../services/distribusiService';
import { getPetani } from '../services/petaniService';
import { getHargaPasar } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';

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

export default function PetaniDashboardPage() {
  const { user } = useAuth();

  const [hargaPasar, setHargaPasar] = useState([]);
  const [stokPerKomoditas, setStokPerKomoditas] = useState([]);
  const [stokTrend, setStokTrend] = useState([]);
  const [distribusiPerBulan, setDistribusiPerBulan] = useState([]);
  const [recentDistribusi, setRecentDistribusi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalStokMasuk, setTotalStokMasuk] = useState(0);
  const [totalStokKeluar, setTotalStokKeluar] = useState(0);
  const [totalDistribusi, setTotalDistribusi] = useState(0);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [stokData, distData, pList, hargaData] = await Promise.all([
          getStokByPetani(user.id),
          getDistribusi(),
          getPetani(),
          getHargaPasar()
        ]);

        setHargaPasar(hargaData || []);

        // Find user's group
        const currentUserData = (pList || []).find(p => p.email === user.email);
        let myGroup = '-';
        let groupFarmersIds = [user.id];
        let groupFarmersNames = [user.nama];
        
        if (currentUserData && currentUserData.kelompokTani) {
          myGroup = currentUserData.kelompokTani;
          const groupMembers = (pList || []).filter(p => p.kelompokTani === myGroup);
          groupFarmersIds = groupMembers.map(m => m.id);
          groupFarmersNames = groupMembers.map(m => m.nama);
        }
        setGroupName(myGroup);

        // Process Stok
        let masuk = 0;
        let keluar = 0;
        const stokMap = {};
        const trendMap = {};

        (stokData || []).forEach(s => {
          if (s.jenisTransaksi === 'MASUK') masuk += s.jumlah;
          else if (s.jenisTransaksi === 'KELUAR') keluar += s.jumlah;

          if (!stokMap[s.namaKomoditas]) stokMap[s.namaKomoditas] = 0;
          if (s.jenisTransaksi === 'MASUK') stokMap[s.namaKomoditas] += s.jumlah;
          else if (s.jenisTransaksi === 'KELUAR') stokMap[s.namaKomoditas] -= s.jumlah;

          // Simple trend mock based on available data since backend doesn't have per-petani trend
          const month = new Date(s.tanggal).toLocaleString('id-ID', { month: 'short' });
          if (!trendMap[month]) trendMap[month] = { bulan: month, masuk: 0, keluar: 0 };
          if (s.jenisTransaksi === 'MASUK') trendMap[month].masuk += s.jumlah;
          else if (s.jenisTransaksi === 'KELUAR') trendMap[month].keluar += s.jumlah;
        });
        
        setTotalStokMasuk(masuk);
        setTotalStokKeluar(keluar);
        
        const pieData = Object.keys(stokMap)
          .map(k => ({ name: k, stok: stokMap[k] }))
          .filter(item => item.stok > 0);
        setStokPerKomoditas(pieData);
        setStokTrend(Object.values(trendMap));

        // Process Distribusi Kelompok
        const groupDist = (distData || []).filter(d => groupFarmersNames.includes(d.namaPetani));
        setTotalDistribusi(groupDist.length);
        
        const sortedDist = groupDist.sort((a, b) => new Date(b.tanggalDistribusi) - new Date(a.tanggalDistribusi));
        setRecentDistribusi(sortedDist.slice(0, 5));

        const distMonthMap = {};
        groupDist.forEach(d => {
          const month = new Date(d.tanggalDistribusi).toLocaleString('id-ID', { month: 'short' });
          if (!distMonthMap[month]) distMonthMap[month] = { bulan: month, jumlah: 0 };
          distMonthMap[month].jumlah += 1;
        });
        setDistribusiPerBulan(Object.values(distMonthMap));

      } catch (error) {
        console.error("Failed to load petani dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plantation-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={`Halo, ${user.nama} 👋`}
        subtitle={`Ringkasan data pangan Anda di kelompok ${groupName}`}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Sprout} label="Status Lahan" value="Aktif" subtitle="Siap tanam/panen" color="green" delay={0} />
        <StatCard icon={Package} label="Komoditas Aktif" value={stokPerKomoditas.length} subtitle="Sedang dikelola" color="leaf" delay={0.1} />
        <StatCard icon={Warehouse} label="Stok Saat Ini" value={`${totalStokMasuk - totalStokKeluar} Kg`} subtitle="Tersedia di gudang" color="earth" delay={0.2} />
        <StatCard icon={Truck} label="Distribusi Kelompok" value={totalDistribusi} subtitle="Total pengiriman" color="blue" delay={0.3} />
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
            const isUp = item.perubahan > 0;
            const isDown = item.perubahan < 0;
            const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
            const trendColor = isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-plantation-400';
            const trendBg = isUp ? 'bg-red-50' : isDown ? 'bg-green-50' : 'bg-plantation-50';
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
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trendBg} ${trendColor}`}>
                    <TrendIcon size={10} />
                    {item.perubahan !== 0 ? `${Math.abs(item.perubahan)}%` : 'Stabil'}
                  </span>
                </div>
                <p className="text-xl font-extrabold text-plantation-900">
                  Rp{item.harga.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-plantation-400 ml-0.5">{item.satuanHarga}</span>
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-plantation-100 text-plantation-600">
                  {item.kategori}
                </span>
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
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Tren Stok Pangan Anda</h3>
          <p className="text-xs text-plantation-500 mb-4">Perbandingan panen masuk vs distribusi keluar</p>
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
                Belum ada data tren stok.
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
          <p className="text-xs text-plantation-500 mb-4">Jumlah pengiriman oleh {groupName}</p>
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
          <h3 className="text-lg font-bold text-plantation-900 mb-1">Aktivitas Distribusi Kelompok</h3>
          <p className="text-xs text-plantation-500 mb-4">Riwayat distribusi dari {groupName}</p>
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
