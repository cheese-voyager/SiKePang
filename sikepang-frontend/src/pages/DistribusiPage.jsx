import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Trash2, Truck, MapPin, Calendar, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { mockDistribusi, mockDistribusiKomoditas, mockPetani } from '../data/mockData';

const statusColors = {
  'SELESAI': 'badge-success',
  'DIKIRIM': 'badge-info',
  'DIPROSES': 'badge-warning',
  'MENUNGGU': 'badge-danger',
};

export default function DistribusiPage() {
  const [list, setList] = useState(mockDistribusi);
  const [filtered, setFiltered] = useState(mockDistribusi);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDist, setSelectedDist] = useState(null);
  const [formData, setFormData] = useState({
    idPetani: '', tujuan: '', status: 'MENUNGGU', catatan: ''
  });

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(list.filter(d =>
      d.namaPetani.toLowerCase().includes(query) ||
      d.tujuan.toLowerCase().includes(query) ||
      d.status.toLowerCase().includes(query)
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const petani = mockPetani.find(p => p.id === parseInt(formData.idPetani));
    const newItem = {
      idDistribusi: list.length + 1,
      idPetani: parseInt(formData.idPetani),
      namaPetani: petani?.nama || '',
      tanggalDistribusi: new Date().toISOString().split('T')[0],
      tujuan: formData.tujuan,
      status: formData.status,
      catatan: formData.catatan,
    };
    const updated = [newItem, ...list];
    setList(updated); setFiltered(updated);
    setModalOpen(false);
    setFormData({ idPetani: '', tujuan: '', status: 'MENUNGGU', catatan: '' });
  };

  const handleDelete = (id) => {
    const updated = list.filter(d => d.idDistribusi !== id);
    setList(updated); setFiltered(updated);
  };

  const openDetail = (dist) => {
    setSelectedDist(dist);
    setDetailOpen(true);
  };

  const detailKomoditas = selectedDist
    ? mockDistribusiKomoditas.filter(dk => dk.idDistribusi === selectedDist.idDistribusi)
    : [];

  const columns = [
    {
      header: 'Tujuan',
      render: (row) => (
        <div>
          <p className="font-semibold text-plantation-900 flex items-center gap-1.5">
            <MapPin size={13} className="text-plantation-400" />{row.tujuan}
          </p>
          <p className="text-xs text-plantation-500 mt-0.5 flex items-center gap-1">
            <MessageSquare size={11} /> {row.catatan}
          </p>
        </div>
      ),
    },
    {
      header: 'Petani',
      render: (row) => <p className="text-plantation-700 font-medium">{row.namaPetani}</p>,
    },
    {
      header: 'Tanggal',
      render: (row) => (
        <span className="text-plantation-600 flex items-center gap-1">
          <Calendar size={13} className="text-plantation-400" />{row.tanggalDistribusi}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <span className={statusColors[row.status]}>{row.status}</span>,
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openDetail(row)} className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 transition-colors"><Eye size={15} /></button>
          <button onClick={() => handleDelete(row.idDistribusi)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Distribusi Pangan" subtitle="Kelola dan pantau distribusi pangan ke berbagai tujuan" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 self-start" id="btn-add-distribusi">
          <Plus size={18} /> Buat Distribusi
        </motion.button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['MENUNGGU', 'DIPROSES', 'DIKIRIM', 'SELESAI'].map(status => {
          const count = list.filter(d => d.status === status).length;
          return (
            <div key={status} className="glass-card-light p-4 text-center">
              <p className="text-2xl font-bold text-plantation-800">{count}</p>
              <p className="text-xs mt-0.5"><span className={statusColors[status]}>{status}</span></p>
            </div>
          );
        })}
      </div>

      <DataTable columns={columns} data={filtered} searchPlaceholder="Cari tujuan, petani, atau status..." onSearch={handleSearch} />

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Buat Distribusi Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Petani</label>
            <select className="select-field" value={formData.idPetani} onChange={(e) => setFormData({ ...formData, idPetani: e.target.value })} required>
              <option value="">Pilih petani</option>
              {mockPetani.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Tujuan Distribusi</label>
            <input type="text" className="input-field" placeholder="Tujuan pengiriman" value={formData.tujuan} onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Status</label>
            <select className="select-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="MENUNGGU">Menunggu</option>
              <option value="DIPROSES">Diproses</option>
              <option value="DIKIRIM">Dikirim</option>
              <option value="SELESAI">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Catatan</label>
            <input type="text" className="input-field" placeholder="Catatan tambahan" value={formData.catatan} onChange={(e) => setFormData({ ...formData, catatan: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Simpan</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Batal</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Detail Distribusi" size="lg">
        {selectedDist && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-plantation-500">Tujuan</p>
                <p className="font-semibold text-plantation-900">{selectedDist.tujuan}</p>
              </div>
              <div>
                <p className="text-xs text-plantation-500">Petani</p>
                <p className="font-semibold text-plantation-900">{selectedDist.namaPetani}</p>
              </div>
              <div>
                <p className="text-xs text-plantation-500">Tanggal</p>
                <p className="font-semibold text-plantation-900">{selectedDist.tanggalDistribusi}</p>
              </div>
              <div>
                <p className="text-xs text-plantation-500">Status</p>
                <span className={statusColors[selectedDist.status]}>{selectedDist.status}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-plantation-500 mb-1">Catatan</p>
              <p className="text-sm text-plantation-700 bg-plantation-50 p-3 rounded-xl">{selectedDist.catatan}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-plantation-800 mb-2">Komoditas yang Didistribusikan</p>
              {detailKomoditas.length > 0 ? (
                <div className="space-y-2">
                  {detailKomoditas.map(dk => (
                    <div key={dk.id} className="flex items-center justify-between p-3 bg-plantation-50 rounded-xl">
                      <span className="font-medium text-plantation-800">{dk.namaKomoditas}</span>
                      <span className="font-bold text-plantation-700">{dk.jumlah} {dk.satuan}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-plantation-400 italic">Belum ada komoditas terdaftar</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
