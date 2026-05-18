import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Trash2, Truck, MapPin, Calendar, Package } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getDistribusi, createDistribusi, deleteDistribusi, updateDistribusiStatus } from '../services/distribusiService';
import { getPetani } from '../services/petaniService';
import { getKomoditas } from '../services/komoditasService';

const statusColors = {
  'SELESAI': 'badge-success',
  'DIKIRIM': 'badge-info',
  'DIPROSES': 'badge-warning',
  'MENUNGGU': 'badge-danger',
  'PENDING': 'badge-warning'
};

export default function DistribusiPage() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [petaniList, setPetaniList] = useState([]);
  const [komoditasList, setKomoditasList] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDist, setSelectedDist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    petaniId: '', tujuan: '', komoditasId: '', jumlah: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [distData, pList, kList] = await Promise.all([
        getDistribusi(),
        getPetani(),
        getKomoditas()
      ]);
      setList(distData || []);
      setFiltered(distData || []);
      setPetaniList(pList || []);
      setKomoditasList(kList || []);
    } catch (error) {
      console.error("Failed to load distribusi data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(list.filter(d =>
      d.namaPetani?.toLowerCase().includes(query) ||
      d.tujuan?.toLowerCase().includes(query) ||
      d.status?.toLowerCase().includes(query)
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        petaniId: parseInt(formData.petaniId),
        tujuan: formData.tujuan,
        detailDistribusi: [
          {
            komoditasId: parseInt(formData.komoditasId),
            jumlah: parseFloat(formData.jumlah)
          }
        ]
      };
      await createDistribusi(payload);
      await fetchData();
      setModalOpen(false);
      setFormData({ petaniId: '', tujuan: '', komoditasId: '', jumlah: '' });
    } catch (error) {
      console.error("Failed to save distribusi:", error);
      alert("Gagal menyimpan distribusi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data distribusi ini?")) {
      try {
        await deleteDistribusi(id);
        await fetchData();
      } catch (error) {
        console.error("Failed to delete distribusi:", error);
        alert("Gagal menghapus distribusi");
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDistribusiStatus(id, newStatus);
      await fetchData();
      if (selectedDist && selectedDist.id === id) {
        setSelectedDist({...selectedDist, status: newStatus});
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Gagal mengupdate status distribusi");
    }
  };

  const openDetail = (dist) => {
    setSelectedDist(dist);
    setDetailOpen(true);
  };

  const columns = [
    {
      header: 'Tujuan',
      render: (row) => (
        <div>
          <p className="font-semibold text-plantation-900 flex items-center gap-1.5">
            <MapPin size={13} className="text-plantation-400" />{row.tujuan}
          </p>
          <p className="text-xs text-plantation-500 mt-0.5 flex items-center gap-1">
            <Package size={11} /> {row.detailDistribusi?.length || 0} Jenis Komoditas
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
          <Calendar size={13} className="text-plantation-400" />{row.tanggalDistribusi ? new Date(row.tanggalDistribusi).toLocaleDateString('id-ID') : '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <select 
          className={`text-xs font-bold px-2 py-1 rounded-full outline-none cursor-pointer appearance-none ${statusColors[row.status] || 'badge-secondary'}`}
          value={row.status}
          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="DIPROSES">DIPROSES</option>
          <option value="DIKIRIM">DIKIRIM</option>
          <option value="SELESAI">SELESAI</option>
        </select>
      ),
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openDetail(row)} className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 transition-colors"><Eye size={15} /></button>
          <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={15} /></button>
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
        {['PENDING', 'DIPROSES', 'DIKIRIM', 'SELESAI'].map(status => {
          const count = list.filter(d => d.status === status).length;
          return (
            <div key={status} className="glass-card-light p-4 text-center">
              <p className="text-2xl font-bold text-plantation-800">{count}</p>
              <p className="text-xs mt-0.5"><span className={statusColors[status]}>{status}</span></p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plantation-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} searchPlaceholder="Cari tujuan, petani, atau status..." onSearch={handleSearch} />
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Buat Distribusi Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Petani Pengirim</label>
            <select className="select-field" value={formData.petaniId} onChange={(e) => setFormData({ ...formData, petaniId: e.target.value })} required>
              <option value="">Pilih petani</option>
              {petaniList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Tujuan Distribusi</label>
            <input type="text" className="input-field" placeholder="Tujuan pengiriman" value={formData.tujuan} onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })} required />
          </div>
          
          {/* Detail Komoditas Input */}
          <div className="p-3 bg-plantation-50 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-plantation-800 uppercase tracking-wide">Pilih Komoditas</h4>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Komoditas</label>
              <select className="select-field bg-white" value={formData.komoditasId} onChange={(e) => setFormData({ ...formData, komoditasId: e.target.value })} required>
                <option value="">Pilih komoditas</option>
                {komoditasList.map(k => <option key={k.id} value={k.id}>{k.nama} ({k.satuan})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">Jumlah</label>
              <input type="number" step="0.1" min="0.1" className="input-field bg-white" placeholder="Contoh: 100" value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })} required />
            </div>
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
                <p className="font-semibold text-plantation-900">{selectedDist.tanggalDistribusi ? new Date(selectedDist.tanggalDistribusi).toLocaleDateString('id-ID') : '-'}</p>
              </div>
              <div>
                <p className="text-xs text-plantation-500 mb-1">Status</p>
                <select 
                  className={`text-xs font-bold px-2 py-1 rounded-full outline-none cursor-pointer appearance-none ${statusColors[selectedDist.status] || 'badge-secondary'}`}
                  value={selectedDist.status}
                  onChange={(e) => handleUpdateStatus(selectedDist.id, e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="DIPROSES">DIPROSES</option>
                  <option value="DIKIRIM">DIKIRIM</option>
                  <option value="SELESAI">SELESAI</option>
                </select>
              </div>
            </div>
            
            {/* Rincian Komoditas */}
            <div className="mt-4 border-t border-plantation-100 pt-4">
              <p className="text-xs font-bold text-plantation-800 uppercase tracking-wide mb-2">Daftar Komoditas Dikirim</p>
              <div className="bg-plantation-50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-plantation-100 text-plantation-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Komoditas</th>
                      <th className="px-4 py-2 text-right font-semibold">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDist.detailDistribusi && selectedDist.detailDistribusi.length > 0 ? (
                      selectedDist.detailDistribusi.map((item, i) => (
                        <tr key={i} className="border-b border-plantation-100/50 last:border-0">
                          <td className="px-4 py-2 font-medium text-plantation-900">{item.namaKomoditas}</td>
                          <td className="px-4 py-2 text-right text-plantation-700">{item.jumlah} {item.satuan}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-3 text-center text-plantation-500 text-xs">Tidak ada detail komoditas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}
