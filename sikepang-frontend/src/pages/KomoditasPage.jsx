import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Sprout, Filter } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getKomoditas, createKomoditas, updateKomoditas, deleteKomoditas } from '../services/komoditasService';

const KATEGORI_COLORS = {
  'Sereal': 'bg-amber-100 text-amber-700 border-amber-200',
  'Umbi-umbian': 'bg-orange-100 text-orange-700 border-orange-200',
  'Sayuran': 'bg-green-100 text-green-700 border-green-200',
  'Buah': 'bg-red-100 text-red-700 border-red-200',
};

export default function KomoditasPage() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    namaKomoditas: '', deskripsi: '', kategori: 'Sereal'
  });
  const [activeKategori, setActiveKategori] = useState('Semua');

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getKomoditas();
      setList(data || []);
      setFiltered(data || []);
      setActiveKategori('Semua');
    } catch (error) {
      console.error("Failed to load komoditas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    let currentList = list;
    if (activeKategori !== 'Semua') {
      currentList = currentList.filter(k => k.kategori === activeKategori);
    }
    setFiltered(currentList.filter(k =>
      k.namaKomoditas.toLowerCase().includes(query) ||
      k.deskripsi.toLowerCase().includes(query)
    ));
  };

  const handleFilter = (kat) => {
    setActiveKategori(kat);
    if (kat === 'Semua') {
      setFiltered(list);
    } else {
      setFiltered(list.filter(k => k.kategori === kat));
    }
  };

  const openAdd = () => {
    setEditData(null);
    setFormData({ namaKomoditas: '', deskripsi: '', kategori: 'Sereal' });
    setModalOpen(true);
  };

  const openEdit = (komoditas) => {
    setEditData(komoditas);
    setFormData({
      namaKomoditas: komoditas.namaKomoditas,
      deskripsi: komoditas.deskripsi,
      kategori: komoditas.kategori,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateKomoditas(editData.idKomoditas, formData);
      } else {
        await createKomoditas(formData);
      }
      await fetchData();
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save komoditas:", error);
      alert("Gagal menyimpan komoditas");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus komoditas ini?")) {
      try {
        await deleteKomoditas(id);
        await fetchData();
      } catch (error) {
        console.error("Failed to delete komoditas:", error);
        alert("Gagal menghapus komoditas");
      }
    }
  };

  const columns = [
    {
      header: 'Komoditas',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-plantation-100 flex items-center justify-center text-plantation-600">
            <Sprout size={18} />
          </div>
          <div>
            <p className="font-bold text-plantation-900">{row.namaKomoditas}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Kategori',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${KATEGORI_COLORS[row.kategori] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          {row.kategori}
        </span>
      ),
    },
    {
      header: 'Deskripsi',
      render: (row) => <p className="text-sm text-plantation-600 line-clamp-2 max-w-xs">{row.deskripsi}</p>
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 transition-colors">
            <Edit3 size={15} />
          </button>
          <button onClick={() => handleDelete(row.idKomoditas)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Data Komoditas" subtitle="Kelola jenis komoditas pangan yang dipantau" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary flex items-center gap-2 self-start" id="btn-add-komoditas">
          <Plus size={18} /> Tambah Komoditas
        </motion.button>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-plantation-100 rounded-lg text-plantation-600 text-sm font-semibold mr-2">
          <Filter size={14} /> Kategori
        </div>
        {['Semua', 'Sereal', 'Umbi-umbian', 'Sayuran', 'Buah'].map(kat => (
          <button
            key={kat}
            onClick={() => handleFilter(kat)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeKategori === kat
                ? 'bg-plantation-600 text-white shadow-md'
                : 'bg-white text-plantation-600 hover:bg-plantation-50 border border-plantation-100'
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plantation-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} searchPlaceholder="Cari nama atau deskripsi komoditas..." onSearch={handleSearch} />
      )}

      {/* Modal Add/Edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Edit Komoditas' : 'Tambah Komoditas Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Nama Komoditas</label>
            <input type="text" className="input-field" placeholder="Contoh: Beras Premium" value={formData.namaKomoditas} onChange={(e) => setFormData({ ...formData, namaKomoditas: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Kategori</label>
            <select className="select-field" value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}>
              <option value="Sereal">Sereal (Padi, Jagung, dll)</option>
              <option value="Umbi-umbian">Umbi-umbian (Singkong, Ubi, dll)</option>
              <option value="Sayuran">Sayuran</option>
              <option value="Buah">Buah-buahan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Deskripsi</label>
            <textarea className="input-field min-h-[100px] resize-y" placeholder="Deskripsi singkat komoditas..." value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">{editData ? 'Simpan Perubahan' : 'Tambah'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
