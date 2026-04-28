import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Tag, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { mockKomoditas } from '../data/mockData';

export default function KomoditasPage() {
  const [list, setList] = useState(mockKomoditas);
  const [filtered, setFiltered] = useState(mockKomoditas);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    namaKomoditas: '', kategori: '', satuan: '', hargaPerSatuan: '', deskripsi: ''
  });

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(list.filter(k =>
      k.namaKomoditas.toLowerCase().includes(query) ||
      k.kategori.toLowerCase().includes(query)
    ));
  };

  const openAdd = () => {
    setEditData(null);
    setFormData({ namaKomoditas: '', kategori: '', satuan: '', hargaPerSatuan: '', deskripsi: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditData(item);
    setFormData({
      namaKomoditas: item.namaKomoditas, kategori: item.kategori,
      satuan: item.satuan, hargaPerSatuan: item.hargaPerSatuan, deskripsi: item.deskripsi,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      const updated = list.map(k => k.idKomoditas === editData.idKomoditas
        ? { ...k, ...formData, hargaPerSatuan: parseInt(formData.hargaPerSatuan) } : k);
      setList(updated); setFiltered(updated);
    } else {
      const newItem = { idKomoditas: list.length + 1, ...formData, hargaPerSatuan: parseInt(formData.hargaPerSatuan) };
      const updated = [...list, newItem];
      setList(updated); setFiltered(updated);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    const updated = list.filter(k => k.idKomoditas !== id);
    setList(updated); setFiltered(updated);
  };

  const kategoriColors = {
    'Padi-padian': 'bg-green-100 text-green-800',
    'Sayuran': 'bg-emerald-100 text-emerald-800',
    'Kacang-kacangan': 'bg-amber-100 text-amber-800',
    'Umbi-umbian': 'bg-orange-100 text-orange-800',
  };

  const columns = [
    {
      header: 'Komoditas',
      render: (row) => (
        <div>
          <p className="font-semibold text-plantation-900">{row.namaKomoditas}</p>
          <p className="text-xs text-plantation-500 mt-0.5 max-w-[200px] truncate">{row.deskripsi}</p>
        </div>
      ),
    },
    {
      header: 'Kategori',
      render: (row) => (
        <span className={`badge ${kategoriColors[row.kategori] || 'bg-gray-100 text-gray-800'}`}>
          <Tag size={11} className="mr-1" />{row.kategori}
        </span>
      ),
    },
    { header: 'Satuan', accessor: 'satuan' },
    {
      header: 'Harga/Satuan',
      render: (row) => (
        <span className="font-semibold text-plantation-800 flex items-center gap-1">
          <DollarSign size={13} className="text-plantation-400" />
          Rp {row.hargaPerSatuan.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 transition-colors"><Edit3 size={15} /></button>
          <button onClick={() => handleDelete(row.idKomoditas)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Data Komoditas" subtitle="Kelola jenis komoditas dan harga pangan" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary flex items-center gap-2 self-start" id="btn-add-komoditas">
          <Plus size={18} /> Tambah Komoditas
        </motion.button>
      </div>

      <DataTable columns={columns} data={filtered} searchPlaceholder="Cari komoditas atau kategori..." onSearch={handleSearch} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Edit Komoditas' : 'Tambah Komoditas Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Nama Komoditas</label>
            <input type="text" className="input-field" placeholder="Masukkan nama komoditas" value={formData.namaKomoditas} onChange={(e) => setFormData({ ...formData, namaKomoditas: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Kategori</label>
              <select className="select-field" value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} required>
                <option value="">Pilih kategori</option>
                <option value="Padi-padian">Padi-padian</option>
                <option value="Sayuran">Sayuran</option>
                <option value="Kacang-kacangan">Kacang-kacangan</option>
                <option value="Umbi-umbian">Umbi-umbian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Satuan</label>
              <input type="text" className="input-field" placeholder="Kg, Liter, dll" value={formData.satuan} onChange={(e) => setFormData({ ...formData, satuan: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Harga per Satuan (Rp)</label>
            <input type="number" className="input-field" placeholder="0" value={formData.hargaPerSatuan} onChange={(e) => setFormData({ ...formData, hargaPerSatuan: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Deskripsi</label>
            <input type="text" className="input-field" placeholder="Deskripsi singkat komoditas" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">{editData ? 'Simpan' : 'Tambah'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
