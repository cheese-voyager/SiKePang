import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Sprout, Filter, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getKomoditas, createKomoditas, updateKomoditas, deleteKomoditas } from '../services/komoditasService';
import { useAuth } from '../contexts/AuthContext';

const KATEGORI_COLORS = {
  'Sereal': 'bg-amber-100 text-amber-700 border-amber-200',
  'Umbi-umbian': 'bg-orange-100 text-orange-700 border-orange-200',
  'Sayuran': 'bg-green-100 text-green-700 border-green-200',
  'Buah': 'bg-red-100 text-red-700 border-red-200',
};

export default function KomoditasPage() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  const isPetugas = user?.role?.toUpperCase() === 'PETUGAS';

  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: '', satuan: '', kategori: '', harga: ''
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
      k.nama?.toLowerCase().includes(query) ||
      k.satuan?.toLowerCase().includes(query)
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
    setFormData({ nama: '', satuan: '', kategori: '', harga: '' });
    setModalOpen(true);
  };

  const openEdit = (komoditas) => {
    setEditData(komoditas);
    setFormData({
      nama: komoditas.nama || '',
      satuan: komoditas.satuan || '',
      kategori: komoditas.kategori || 'Sereal',
      harga: komoditas.harga || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Convert harga string to float if it exists
      if (payload.harga) {
        payload.harga = parseFloat(payload.harga);
      } else {
        payload.harga = null;
      }
      
      // If Admin, force kategori and harga to be empty
      if (isAdmin && !editData) {
        payload.kategori = null;
        payload.harga = null;
      }

      if (editData) {
        await updateKomoditas(editData.id, payload);
      } else {
        await createKomoditas(payload);
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
            <p className="font-bold text-plantation-900">{row.nama}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Kategori',
      render: (row) => (
        row.kategori ? (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${KATEGORI_COLORS[row.kategori] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {row.kategori}
          </span>
        ) : (
          <span className="text-xs text-gray-400 italic">Belum diatur</span>
        )
      ),
    },
    {
      header: 'Satuan',
      render: (row) => <p className="text-sm font-medium text-plantation-700">{row.satuan}</p>
    },
    {
      header: 'Harga',
      render: (row) => (
        row.harga ? (
          <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
            Rp {row.harga.toLocaleString('id-ID')}
          </p>
        ) : (
          <span className="text-xs text-gray-400 italic">-</span>
        )
      )
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          {isPetugas && (
            <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 transition-colors" title="Edit Kategori & Harga">
              <Edit3 size={15} />
            </button>
          )}
          {isAdmin && (
            <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Hapus Komoditas">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Data Komoditas" subtitle="Kelola jenis komoditas pangan yang dipantau" />
        {isAdmin && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary flex items-center gap-2 self-start" id="btn-add-komoditas">
            <Plus size={18} /> Tambah Komoditas
          </motion.button>
        )}
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
        <DataTable columns={columns} data={filtered} searchPlaceholder="Cari nama atau satuan komoditas..." onSearch={handleSearch} />
      )}

      {/* Modal Add/Edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Edit Data Komoditas' : 'Tambah Komoditas Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Always visible but readonly for Petugas */}
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Nama Komoditas</label>
            <input type="text" className={`input-field ${isPetugas ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="Contoh: Beras Premium" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required disabled={isPetugas} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Satuan</label>
            <input type="text" className={`input-field ${isPetugas ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="Contoh: Kg" value={formData.satuan} onChange={(e) => setFormData({ ...formData, satuan: e.target.value })} required disabled={isPetugas} />
          </div>

          {/* Only editable by Petugas */}
          {isPetugas && editData && (
            <div className="p-3 bg-plantation-50 rounded-xl space-y-3 mt-4 border border-plantation-100">
              <h4 className="text-xs font-bold text-plantation-800 uppercase tracking-wide">Data Tambahan</h4>
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Kategori</label>
                <select className="select-field bg-white" value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} required>
                  <option value="">Pilih kategori...</option>
                  <option value="Sereal">Sereal (Padi, Jagung, dll)</option>
                  <option value="Umbi-umbian">Umbi-umbian (Singkong, Ubi, dll)</option>
                  <option value="Sayuran">Sayuran</option>
                  <option value="Buah">Buah-buahan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Harga Per {formData.satuan || 'Satuan'}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-plantation-500 font-medium">Rp</span>
                  </div>
                  <input type="number" min="0" step="100" className="input-field pl-10 bg-white" placeholder="Contoh: 14000" value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })} required />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">{editData ? 'Simpan Perubahan' : 'Tambah'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
