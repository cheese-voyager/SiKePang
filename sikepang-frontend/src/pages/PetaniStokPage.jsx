import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { mockStokPangan, mockPetani, mockKomoditas } from '../data/mockData';

export default function PetaniStokPage() {
  const currentPetaniId = 1; // Mock: Budi Santoso
  const currentPetani = mockPetani.find(p => p.id === currentPetaniId);

  const initialStok = mockStokPangan.filter(s => s.idPetani === currentPetaniId);

  const [list, setList] = useState(initialStok);
  const [filtered, setFiltered] = useState(initialStok);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idKomoditas: '', jumlahStok: '', status: 'MASUK'
  });

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(list.filter(s =>
      s.namaKomoditas.toLowerCase().includes(query) ||
      s.status.toLowerCase().includes(query)
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const komoditas = mockKomoditas.find(k => k.idKomoditas === parseInt(formData.idKomoditas));
    const newItem = {
      idStok: Date.now(), // Generate mock ID
      idPetani: currentPetaniId,
      idKomoditas: parseInt(formData.idKomoditas),
      namaPetani: currentPetani.nama,
      namaKomoditas: komoditas?.namaKomoditas || '',
      jumlahStok: parseFloat(formData.jumlahStok),
      tanggalUpdate: new Date().toISOString().split('T')[0],
      status: formData.status,
    };
    const updated = [newItem, ...list];
    setList(updated); setFiltered(updated);
    setModalOpen(false);
    setFormData({ idKomoditas: '', jumlahStok: '', status: 'MASUK' });
  };

  const handleDelete = (id) => {
    const updated = list.filter(s => s.idStok !== id);
    setList(updated); setFiltered(updated);
  };

  const totalMasuk = list.filter(s => s.status === 'MASUK').reduce((a, b) => a + b.jumlahStok, 0);
  const totalKeluar = list.filter(s => s.status === 'KELUAR').reduce((a, b) => a + b.jumlahStok, 0);

  const columns = [
    {
      header: 'Komoditas',
      render: (row) => <p className="font-semibold text-plantation-900">{row.namaKomoditas}</p>,
    },
    {
      header: 'Jumlah',
      render: (row) => <span className="font-bold text-plantation-800">{row.jumlahStok} Kg</span>,
    },
    { header: 'Tanggal', accessor: 'tanggalUpdate' },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge flex items-center gap-1 w-max ${row.status === 'MASUK' ? 'badge-success' : 'badge-warning'}`}>
          {row.status === 'MASUK' ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
          {row.status}
        </span>
      ),
    },
    {
      header: 'Aksi',
      render: (row) => (
        <button onClick={() => handleDelete(row.idStok)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
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

      <DataTable columns={columns} data={filtered} searchPlaceholder="Cari komoditas atau status..." onSearch={handleSearch} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Catat Stok Pangan Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Komoditas</label>
            <select className="select-field" value={formData.idKomoditas} onChange={(e) => setFormData({ ...formData, idKomoditas: e.target.value })} required>
              <option value="">Pilih komoditas</option>
              {mockKomoditas.map(k => <option key={k.idKomoditas} value={k.idKomoditas}>{k.namaKomoditas}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Jumlah (Kg)</label>
              <input type="number" className="input-field" placeholder="0" value={formData.jumlahStok} onChange={(e) => setFormData({ ...formData, jumlahStok: e.target.value })} required />
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
