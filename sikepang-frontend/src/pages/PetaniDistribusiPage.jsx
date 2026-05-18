import { useState, useEffect } from 'react';
import { Eye, Truck, MapPin, Calendar, Package } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getDistribusi } from '../services/distribusiService';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  'SELESAI': 'badge-success',
  'DIKIRIM': 'badge-info',
  'DIPROSES': 'badge-warning',
  'MENUNGGU': 'badge-danger',
  'PENDING': 'badge-warning'
};

export default function PetaniDistribusiPage() {
  const { user } = useAuth();
  
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDist, setSelectedDist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getDistribusi();
      // Filter distributions matching the user's name
      const myDist = (data || []).filter(d => d.namaPetani === user.nama); 
      setList(myDist);
      setFiltered(myDist);
    } catch (error) {
      console.error("Failed to load distribusi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(list.filter(d =>
      d.tujuan?.toLowerCase().includes(query) ||
      d.status?.toLowerCase().includes(query)
    ));
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
      header: 'Tanggal',
      render: (row) => (
        <span className="text-plantation-600 flex items-center gap-1 w-max">
          <Calendar size={13} className="text-plantation-400" />{row.tanggalDistribusi ? new Date(row.tanggalDistribusi).toLocaleDateString('id-ID') : '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <span className={`w-max ${statusColors[row.status] || 'badge-secondary'}`}>{row.status}</span>,
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openDetail(row)} className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 transition-colors flex items-center gap-2 text-sm font-medium">
            <Eye size={15} /> Detail
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header title="Riwayat Distribusi" subtitle={`Pantau pengiriman hasil panen Anda`} />
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
        <DataTable columns={columns} data={filtered} searchPlaceholder="Cari tujuan atau status..." onSearch={handleSearch} />
      )}

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
                <p className="text-xs text-plantation-500">Status</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[selectedDist.status] || 'badge-secondary'}`}>{selectedDist.status}</span>
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
