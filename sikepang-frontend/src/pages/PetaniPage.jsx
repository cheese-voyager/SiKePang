import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Users, MapPin, Ruler } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getPetani, createPetani, updatePetani, deletePetani } from '../services/petaniService';

export default function PetaniPage() {
  const [petaniList, setPetaniList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: '', email: '', password: '', kelompokTani: '', alamat: '', nomorTelepon: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPetani();
      setPetaniList(data || []);
      setFiltered(data || []);
    } catch (error) {
      console.error("Failed to load petani:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    setFiltered(petaniList.filter(p =>
      p.nama?.toLowerCase().includes(q) ||
      p.kelompokTani?.toLowerCase().includes(q) ||
      p.alamat?.toLowerCase().includes(q)
    ));
  };

  const openAdd = () => {
    setEditData(null);
    setFormData({ nama: '', email: '', password: '', kelompokTani: '', alamat: '', nomorTelepon: '' });
    setModalOpen(true);
  };

  const openEdit = (petani) => {
    setEditData(petani);
    setFormData({
      nama: petani.nama || '',
      email: petani.email || '',
      password: '', // Leave blank unless they want to change
      kelompokTani: petani.kelompokTani || '',
      alamat: petani.alamat || '',
      nomorTelepon: petani.nomorTelepon || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (editData) {
        if (!dataToSubmit.password) delete dataToSubmit.password; // Don't send empty password on update
        await updatePetani(editData.id, dataToSubmit);
      } else {
        await createPetani(dataToSubmit);
      }
      await fetchData();
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save petani:", error);
      alert("Gagal menyimpan data petani");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data petani ini?")) {
      try {
        await deletePetani(id);
        await fetchData();
      } catch (error) {
        console.error("Failed to delete petani:", error);
        alert("Gagal menghapus data petani");
      }
    }
  };

  const columns = [
    {
      header: 'Petani',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-plantation-400 to-plantation-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {row.nama?.charAt(0) || 'P'}
          </div>
          <div>
            <p className="font-semibold text-plantation-900">{row.nama}</p>
            <p className="text-xs text-plantation-500">{row.nomorTelepon}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Kelompok Tani',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-plantation-700 font-medium">
          <Users size={13} className="text-plantation-400" />
          {row.kelompokTani}
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
      header: 'Email',
      accessor: 'email'
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
  const kelompokSet = [...new Set(petaniList.map(p => p.kelompokTani).filter(k => k && k !== '-'))];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Data Petani" subtitle="Kelola data petani dan kelompok tani" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary flex items-center gap-2 self-start" id="btn-add-petani">
          <Plus size={18} /> Tambah Petani
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-plantation-800">{totalPetani}</p>
          <p className="text-xs text-plantation-500 mt-0.5">Total Petani</p>
        </div>
        <div className="glass-card-light p-4 text-center">
          <p className="text-2xl font-bold text-plantation-800">{kelompokSet.length}</p>
          <p className="text-xs text-plantation-500 mt-0.5">Kelompok Tani</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plantation-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} searchPlaceholder="Cari petani, kelompok, atau alamat..." onSearch={handleSearch} />
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Edit Data Petani' : 'Tambah Petani Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Nama Lengkap</label>
            <input type="text" className="input-field" placeholder="Masukkan nama petani" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="Email untuk login" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Password</label>
              <input type="password" className="input-field" placeholder={editData ? '(Biarkan kosong jika tidak diubah)' : 'Password login'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editData} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Kelompok Tani</label>
            <input type="text" className="input-field" placeholder="Masukkan nama kelompok" value={formData.kelompokTani} onChange={(e) => setFormData({ ...formData, kelompokTani: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Alamat</label>
            <input type="text" className="input-field" placeholder="Masukkan alamat" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">No. Telepon</label>
            <input type="tel" className="input-field" placeholder="08xxxxxxxxxx" value={formData.nomorTelepon} onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })} required />
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
