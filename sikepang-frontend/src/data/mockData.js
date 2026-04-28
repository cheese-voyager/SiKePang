// Mock data based on the SiKePang ERD and Class Diagram
// This simulates the backend API responses

export const mockPengguna = [
  { id: 1, nama: 'Admin Utama', email: 'admin@sikepang.id', role: 'ADMIN', createdAt: '2026-01-15' },
  { id: 2, nama: 'Petugas Lapangan', email: 'petugas1@sikepang.id', role: 'PETUGAS', createdAt: '2026-02-01' },
  { id: 3, nama: 'Budi Santoso', email: 'budi@gmail.com', role: 'PETANI', createdAt: '2026-02-10' },
  { id: 4, nama: 'Siti Aminah', email: 'siti@gmail.com', role: 'PETANI', createdAt: '2026-02-15' },
  { id: 5, nama: 'Ahmad Hidayat', email: 'ahmad@gmail.com', role: 'PETANI', createdAt: '2026-03-01' },
];

export const mockPetani = [
  { id: 1, idPengguna: 3, nama: 'Budi Santoso', namaKelompok: 'Tani Makmur', alamat: 'Desa Sukamaju, Kec. Ciamis', noTelepon: '081234567890', luasLahan: 2.5, createdAt: '2026-02-10' },
  { id: 2, idPengguna: 4, nama: 'Siti Aminah', namaKelompok: 'Tani Makmur', alamat: 'Desa Sukamaju, Kec. Ciamis', noTelepon: '081234567891', luasLahan: 1.8, createdAt: '2026-02-15' },
  { id: 3, idPengguna: 5, nama: 'Ahmad Hidayat', namaKelompok: 'Tani Sejahtera', alamat: 'Desa Mekarjaya, Kec. Tasikmalaya', noTelepon: '081234567892', luasLahan: 3.2, createdAt: '2026-03-01' },
  { id: 4, idPengguna: null, nama: 'Dewi Ratnasari', namaKelompok: 'Tani Sejahtera', alamat: 'Desa Mekarjaya, Kec. Tasikmalaya', noTelepon: '081234567893', luasLahan: 1.5, createdAt: '2026-03-05' },
  { id: 5, idPengguna: null, nama: 'Hendra Wijaya', namaKelompok: 'Tani Subur', alamat: 'Desa Cikuray, Kec. Garut', noTelepon: '081234567894', luasLahan: 4.0, createdAt: '2026-03-10' },
  { id: 6, idPengguna: null, nama: 'Rina Marlina', namaKelompok: 'Tani Subur', alamat: 'Desa Cikuray, Kec. Garut', noTelepon: '081234567895', luasLahan: 2.0, createdAt: '2026-03-15' },
];

export const mockKomoditas = [
  { idKomoditas: 1, namaKomoditas: 'Beras Premium', kategori: 'Padi-padian', satuan: 'Kg', hargaPerSatuan: 14000, deskripsi: 'Beras kualitas premium dari varietas IR-64' },
  { idKomoditas: 2, namaKomoditas: 'Jagung Pipil', kategori: 'Padi-padian', satuan: 'Kg', hargaPerSatuan: 6500, deskripsi: 'Jagung pipil kering siap olah' },
  { idKomoditas: 3, namaKomoditas: 'Kedelai Lokal', kategori: 'Kacang-kacangan', satuan: 'Kg', hargaPerSatuan: 12000, deskripsi: 'Kedelai lokal untuk pembuatan tahu dan tempe' },
  { idKomoditas: 4, namaKomoditas: 'Cabai Merah', kategori: 'Sayuran', satuan: 'Kg', hargaPerSatuan: 45000, deskripsi: 'Cabai merah besar segar dari kebun' },
  { idKomoditas: 5, namaKomoditas: 'Bawang Merah', kategori: 'Sayuran', satuan: 'Kg', hargaPerSatuan: 35000, deskripsi: 'Bawang merah Brebes kualitas ekspor' },
  { idKomoditas: 6, namaKomoditas: 'Singkong', kategori: 'Umbi-umbian', satuan: 'Kg', hargaPerSatuan: 3500, deskripsi: 'Singkong segar dari kebun lokal' },
  { idKomoditas: 7, namaKomoditas: 'Ubi Jalar', kategori: 'Umbi-umbian', satuan: 'Kg', hargaPerSatuan: 5000, deskripsi: 'Ubi jalar organik merah dan kuning' },
  { idKomoditas: 8, namaKomoditas: 'Tomat', kategori: 'Sayuran', satuan: 'Kg', hargaPerSatuan: 12000, deskripsi: 'Tomat merah segar kualitas A' },
];

export const mockStokPangan = [
  { idStok: 1, idPetani: 1, idKomoditas: 1, namaPetani: 'Budi Santoso', namaKomoditas: 'Beras Premium', jumlahStok: 500, tanggalUpdate: '2026-04-20', status: 'MASUK' },
  { idStok: 2, idPetani: 1, idKomoditas: 4, namaPetani: 'Budi Santoso', namaKomoditas: 'Cabai Merah', jumlahStok: 50, tanggalUpdate: '2026-04-20', status: 'MASUK' },
  { idStok: 3, idPetani: 2, idKomoditas: 1, namaPetani: 'Siti Aminah', namaKomoditas: 'Beras Premium', jumlahStok: 300, tanggalUpdate: '2026-04-19', status: 'MASUK' },
  { idStok: 4, idPetani: 3, idKomoditas: 2, namaPetani: 'Ahmad Hidayat', namaKomoditas: 'Jagung Pipil', jumlahStok: 200, tanggalUpdate: '2026-04-18', status: 'MASUK' },
  { idStok: 5, idPetani: 3, idKomoditas: 3, namaPetani: 'Ahmad Hidayat', namaKomoditas: 'Kedelai Lokal', jumlahStok: 150, tanggalUpdate: '2026-04-18', status: 'MASUK' },
  { idStok: 6, idPetani: 4, idKomoditas: 5, namaPetani: 'Dewi Ratnasari', namaKomoditas: 'Bawang Merah', jumlahStok: 100, tanggalUpdate: '2026-04-17', status: 'MASUK' },
  { idStok: 7, idPetani: 5, idKomoditas: 6, namaPetani: 'Hendra Wijaya', namaKomoditas: 'Singkong', jumlahStok: 400, tanggalUpdate: '2026-04-16', status: 'MASUK' },
  { idStok: 8, idPetani: 5, idKomoditas: 7, namaPetani: 'Hendra Wijaya', namaKomoditas: 'Ubi Jalar', jumlahStok: 250, tanggalUpdate: '2026-04-16', status: 'MASUK' },
  { idStok: 9, idPetani: 6, idKomoditas: 8, namaPetani: 'Rina Marlina', namaKomoditas: 'Tomat', jumlahStok: 80, tanggalUpdate: '2026-04-15', status: 'MASUK' },
  { idStok: 10, idPetani: 1, idKomoditas: 1, namaPetani: 'Budi Santoso', namaKomoditas: 'Beras Premium', jumlahStok: 100, tanggalUpdate: '2026-04-22', status: 'KELUAR' },
  { idStok: 11, idPetani: 3, idKomoditas: 2, namaPetani: 'Ahmad Hidayat', namaKomoditas: 'Jagung Pipil', jumlahStok: 50, tanggalUpdate: '2026-04-22', status: 'KELUAR' },
];

export const mockDistribusi = [
  { idDistribusi: 1, idPetani: 1, namaPetani: 'Budi Santoso', tanggalDistribusi: '2026-04-22', tujuan: 'Pasar Induk Ciamis', status: 'SELESAI', catatan: 'Distribusi rutin mingguan' },
  { idDistribusi: 2, idPetani: 3, namaPetani: 'Ahmad Hidayat', tanggalDistribusi: '2026-04-22', tujuan: 'Koperasi Desa Mekarjaya', status: 'SELESAI', catatan: 'Penjualan ke koperasi desa' },
  { idDistribusi: 3, idPetani: 5, namaPetani: 'Hendra Wijaya', tanggalDistribusi: '2026-04-25', tujuan: 'BULOG Regional Garut', status: 'DIKIRIM', catatan: 'Pengiriman ke gudang BULOG' },
  { idDistribusi: 4, idPetani: 2, namaPetani: 'Siti Aminah', tanggalDistribusi: '2026-04-26', tujuan: 'Pasar Tradisional Tasikmalaya', status: 'DIPROSES', catatan: 'Sedang dalam proses pengemasan' },
  { idDistribusi: 5, idPetani: 4, namaPetani: 'Dewi Ratnasari', tanggalDistribusi: '2026-04-27', tujuan: 'Rumah Makan Sederhana', status: 'DIPROSES', catatan: 'Pesanan bawang merah dan sayuran' },
  { idDistribusi: 6, idPetani: 6, namaPetani: 'Rina Marlina', tanggalDistribusi: '2026-04-28', tujuan: 'Supermarket Lokal', status: 'MENUNGGU', catatan: 'Menunggu jadwal pengiriman' },
];

export const mockDistribusiKomoditas = [
  { id: 1, idDistribusi: 1, idKomoditas: 1, namaKomoditas: 'Beras Premium', jumlah: 100, satuan: 'Kg' },
  { id: 2, idDistribusi: 2, idKomoditas: 2, namaKomoditas: 'Jagung Pipil', jumlah: 50, satuan: 'Kg' },
  { id: 3, idDistribusi: 2, idKomoditas: 3, namaKomoditas: 'Kedelai Lokal', jumlah: 30, satuan: 'Kg' },
  { id: 4, idDistribusi: 3, idKomoditas: 6, namaKomoditas: 'Singkong', jumlah: 200, satuan: 'Kg' },
  { id: 5, idDistribusi: 3, idKomoditas: 7, namaKomoditas: 'Ubi Jalar', jumlah: 100, satuan: 'Kg' },
  { id: 6, idDistribusi: 4, idKomoditas: 1, namaKomoditas: 'Beras Premium', jumlah: 150, satuan: 'Kg' },
  { id: 7, idDistribusi: 5, idKomoditas: 5, namaKomoditas: 'Bawang Merah', jumlah: 50, satuan: 'Kg' },
  { id: 8, idDistribusi: 6, idKomoditas: 8, namaKomoditas: 'Tomat', jumlah: 40, satuan: 'Kg' },
];

// Dashboard statistics
export const mockDashboardStats = {
  totalPetani: 6,
  totalKomoditas: 8,
  totalStokMasuk: 2030,
  totalStokKeluar: 150,
  totalDistribusi: 6,
  distribusiSelesai: 2,
  distribusiProses: 3,
  distribusiMenunggu: 1,
  kelompokTani: ['Tani Makmur', 'Tani Sejahtera', 'Tani Subur'],
  totalLuasLahan: 15.0,
};

// Chart data for dashboard
export const stokPerKomoditas = [
  { name: 'Beras Premium', stok: 700, fill: '#22c55e' },
  { name: 'Jagung Pipil', stok: 150, fill: '#16a34a' },
  { name: 'Kedelai Lokal', stok: 150, fill: '#15803d' },
  { name: 'Cabai Merah', stok: 50, fill: '#166534' },
  { name: 'Bawang Merah', stok: 100, fill: '#84cc16' },
  { name: 'Singkong', stok: 200, fill: '#65a30d' },
  { name: 'Ubi Jalar', stok: 150, fill: '#4d7c0f' },
  { name: 'Tomat', stok: 40, fill: '#a3e635' },
];

export const distribusiPerBulan = [
  { bulan: 'Jan', jumlah: 3 },
  { bulan: 'Feb', jumlah: 5 },
  { bulan: 'Mar', jumlah: 8 },
  { bulan: 'Apr', jumlah: 6 },
];

export const stokTrend = [
  { bulan: 'Jan', masuk: 800, keluar: 200 },
  { bulan: 'Feb', masuk: 1200, keluar: 400 },
  { bulan: 'Mar', masuk: 1800, keluar: 600 },
  { bulan: 'Apr', masuk: 2030, keluar: 150 },
];
