import { useState } from 'react';
import { Eye, Truck, MapPin, Calendar, MessageSquare } from 'lucide-react';
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

export default function PetaniDistribusiPage() {
  const currentPetaniId = 1; // Mock: Budi Santoso
  const currentPetani = mockPetani.find(p => p.id === currentPetaniId);
  const myGroupFarmers = mockPetani.filter(p => p.namaKelompok === currentPetani.namaKelompok).map(p => p.id);

  const myGroupDistribusi = mockDistribusi.filter(d => myGroupFarmers.includes(d.idPetani));

  const [list, setList] = useState(myGroupDistribusi);
  const [filtered, setFiltered] = useState(myGroupDistribusi);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDist, setSelectedDist] = useState(null);

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(list.filter(d =>
      d.namaPetani.toLowerCase().includes(query) ||
      d.tujuan.toLowerCase().includes(query) ||
      d.status.toLowerCase().includes(query)
    ));
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
      header: 'Petani (Kelompok)',
      render: (row) => <p className="text-plantation-700 font-medium">{row.namaPetani}</p>,
    },
    {
      header: 'Tanggal',
      render: (row) => (
        <span className="text-plantation-600 flex items-center gap-1 w-max">
          <Calendar size={13} className="text-plantation-400" />{row.tanggalDistribusi}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <span className={`w-max ${statusColors[row.status]}`}>{row.status}</span>,
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
        <Header title="Riwayat Distribusi" subtitle={`Pantau pengiriman hasil panen dari kelompok ${currentPetani.namaKelompok}`} />
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
                <p className="text-sm text-plantation-400 italic">Belum ada rincian komoditas pada distribusi ini.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
