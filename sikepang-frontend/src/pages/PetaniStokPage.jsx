import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getStokByPetani, createStok, deleteStok } from '../services/stokService';
import { getKomoditas } from '../services/komoditasService';
import { useAuth } from '../contexts/AuthContext';

export default function PetaniStokPage() {
  const { user } = useAuth();
  
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [komoditasList, setKomoditasList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    idKomoditas: '', jumlahStok: '', status: 'MASUK'
  });

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [stokData, kList] = await Promise.all([
        getStokByPetani(user.id),
        getKomoditas()
      ]);
      setList(stokData || []);
      setFiltered(stokData || []);
      setKomoditasList(kList || []);
    } catch (error) {
      console.error("Failed to load stok data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(list.filter(s =>
      s.namaKomoditas?.toLowerCase().includes(query) ||
      s.jenisTransaksi?.toLowerCase().includes(query)
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStok({
        petaniId: user.id,
        komoditasId: parseInt(formData.idKomoditas),
        jumlah: parseFloat(formData.jumlahStok),
        jenisTransaksi: formData.status
      });
      await fetchData();
      setModalOpen(false);
      setFormData({ idKomoditas: '', jumlahStok: '', status: 'MASUK' });
    } catch (error) {
      console.error("Failed to save stok:", error);
      alert("Gagal mencatat stok pangan");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data stok ini?")) {
      try {
        await deleteStok(id);
        await fetchData();
      } catch (error) {
        console.error("Failed to delete stok:", error);
        alert("Gagal menghapus stok pangan");
      }
    }
  };

  const totalMasuk = list.filter(s => s.jenisTransaksi === 'MASUK').reduce((a, b) => a + b.jumlah, 0);
  const totalKeluar = list.filter(s => s.jenisTransaksi === 'KELUAR').reduce((a, b) => a + b.jumlah, 0);

  const columns = [
    {
      header: 'Komoditas',
      render: (row) => <p className="font-semibold text-plantation-900">{row.namaKomoditas}</p>,
    },
    {
      header: 'Jumlah',
      render: (row) => <span className="font-bold text-plantation-800">{row.jumlah} Kg</span>,
    },
    { 
      header: 'Tanggal', 
      render: (row) => <span>{new Date(row.tanggal).toLocaleDateString('id-ID')}</span> 
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge flex items-center gap-1 w-max ${row.jenisTransaksi === 'MASUK' ? 'badge-success' : 'badge-warning'}`}>
          {row.jenisTransaksi === 'MASUK' ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
          {row.jenisTransaksi}
        </span>
      ),
    },
    {
      header: 'Aksi',
      render: (row) => (
        <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Stok Pangan Saya" subtitle="Kelola catatan masuk dan keluar hasil panen Anda" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 self-start" id="btn-add-stok">
          <Plus size={18} /> Catat Stok
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{totalMasuk} Kg</p>
          <p className="text-xs text-plantation-500 mt-0.5 flex items-center justify-center gap-1">
            <ArrowDownToLine size={12} /> Total Panen Masuk
          </p>
        </div>
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{totalKeluar} Kg</p>
          <p className="text-xs text-plantation-500 mt-0.5 flex items-center justify-center gap-1">
            <ArrowUpFromLine size={12} /> Total Distribusi
          </p>
        </div>
        <div className="glass-card-light p-4 text-center col-span-2 md:col-span-1">
          <p className="text-2xl font-bold text-plantation-800">{totalMasuk - totalKeluar} Kg</p>
          <p className="text-xs text-plantation-500 mt-0.5">Saldo Tersedia</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plantation-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} searchPlaceholder="Cari komoditas atau status..." onSearch={handleSearch} />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Catat Stok Pangan Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Komoditas</label>
            <select className="select-field" value={formData.idKomoditas} onChange={(e) => setFormData({ ...formData, idKomoditas: e.target.value })} required>
              <option value="">Pilih komoditas</option>
              {komoditasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Jumlah (Kg)</label>
              <input type="number" className="input-field" placeholder="0" value={formData.jumlahStok} onChange={(e) => setFormData({ ...formData, jumlahStok: e.target.value })} required min="1" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Status</label>
              <select className="select-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="MASUK">Masuk (Panen)</option>
                <option value="KELUAR">Keluar (Distribusi)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Simpan</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
