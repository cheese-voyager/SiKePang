import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Users, MapPin, Ruler } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { mockPetani } from '../data/mockData';

export default function PetaniPage() {
  const [petaniList, setPetaniList] = useState(mockPetani);
  const [filtered, setFiltered] = useState(mockPetani);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    nama: '', namaKelompok: '', alamat: '', noTelepon: '', luasLahan: ''
  });

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    setFiltered(petaniList.filter(p =>
      p.nama.toLowerCase().includes(q) ||
      p.namaKelompok.toLowerCase().includes(q) ||
      p.alamat.toLowerCase().includes(q)
    ));
  };

  const openAdd = () => {
    setEditData(null);
    setFormData({ nama: '', namaKelompok: '', alamat: '', noTelepon: '', luasLahan: '' });
    setModalOpen(true);
  };

  const openEdit = (petani) => {
    setEditData(petani);
    setFormData({
      nama: petani.nama,
      namaKelompok: petani.namaKelompok,
      alamat: petani.alamat,
      noTelepon: petani.noTelepon,
      luasLahan: petani.luasLahan,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      const updated = petaniList.map(p =>
        p.id === editData.id ? { ...p, ...formData, luasLahan: parseFloat(formData.luasLahan) } : p
      );
      setPetaniList(updated);
      setFiltered(updated);
    } else {
      const newPetani = {
        id: petaniList.length + 1,
        ...formData,
        luasLahan: parseFloat(formData.luasLahan),
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updated = [...petaniList, newPetani];
      setPetaniList(updated);
      setFiltered(updated);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    const updated = petaniList.filter(p => p.id !== id);
    setPetaniList(updated);
    setFiltered(updated);
  };

  const columns = [
    {
      header: 'Petani',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-plantation-400 to-plantation-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {row.nama.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-plantation-900">{row.nama}</p>
            <p className="text-xs text-plantation-500">{row.noTelepon}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Kelompok Tani',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-plantation-700 font-medium">
          <Users size={13} className="text-plantation-400" />
          {row.namaKelompok}
        </span>
      ),
    },
    {
      header: 'Alamat',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-plantation-600 text-xs">
          <MapPin size={13} className="text-plantation-400 flex-shrink-0" />
          <span className="max-w-[200px] truncate">{row.alamat}</span>
        </span>
      ),
    },
    {
      header: 'Luas Lahan',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-plantation-800">
          <Ruler size={13} className="text-plantation-400" />
          {row.luasLahan} Ha
        </span>
      ),
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 hover:text-plantation-800 transition-colors" title="Edit">
            <Edit3 size={15} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" title="Hapus">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  // Summary stats
  const totalPetani = petaniList.length;
  const kelompokSet = [...new Set(petaniList.map(p => p.namaKelompok))];
  const totalLahan = petaniList.reduce((a, b) => a + b.luasLahan, 0);
  const avgLahan = totalLahan / totalPetani;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Data Petani" subtitle="Kelola data petani dan kelompok tani" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary flex items-center gap-2 self-start" id="btn-add-petani">
          <Plus size={18} /> Tambah Petani
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-plantation-800">{totalPetani}</p>
          <p className="text-xs text-plantation-500 mt-0.5">Total Petani</p>
        </div>
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-plantation-800">{kelompokSet.length}</p>
          <p className="text-xs text-plantation-500 mt-0.5">Kelompok Tani</p>
        </div>
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-plantation-800">{totalLahan.toFixed(1)} Ha</p>
          <p className="text-xs text-plantation-500 mt-0.5">Total Lahan</p>
        </div>
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-plantation-800">{avgLahan.toFixed(1)} Ha</p>
          <p className="text-xs text-plantation-500 mt-0.5">Rata-rata</p>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} searchPlaceholder="Cari petani, kelompok, atau alamat..." onSearch={handleSearch} />

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Edit Data Petani' : 'Tambah Petani Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Nama Lengkap</label>
            <input type="text" className="input-field" placeholder="Masukkan nama petani" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Kelompok Tani</label>
            <input type="text" className="input-field" placeholder="Masukkan nama kelompok" value={formData.namaKelompok} onChange={(e) => setFormData({ ...formData, namaKelompok: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Alamat</label>
            <input type="text" className="input-field" placeholder="Masukkan alamat" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">No. Telepon</label>
              <input type="tel" className="input-field" placeholder="08xxxxxxxxxx" value={formData.noTelepon} onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Luas Lahan (Ha)</label>
              <input type="number" step="0.1" className="input-field" placeholder="0.0" value={formData.luasLahan} onChange={(e) => setFormData({ ...formData, luasLahan: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">{editData ? 'Simpan Perubahan' : 'Tambah Petani'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
