import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Users,
  MapPin,
  Shield,
  UserCircle,
} from "lucide-react";
import Header from "../components/Header";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import {
  getPengguna,
  createPengguna,
  updatePengguna,
  deletePengguna,
} from "../services/penggunaService";
import { useAuth } from "../contexts/AuthContext";

export default function PenggunaPage() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const [penggunaList, setPenggunaList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "PETANI",
    kelompokTani: "",
    alamat: "",
    nomorTelepon: "",
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Shield size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-plantation-900 mb-2">
          Akses Ditolak
        </h2>
        <p className="text-plantation-500 text-sm">
          Halaman ini hanya dapat diakses oleh Administrator.
        </p>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPengguna();
      setPenggunaList(data || []);
      setFiltered(data || []);
    } catch (error) {
      console.error("Failed to load pengguna:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    setFiltered(
      penggunaList.filter(
        (p) =>
          p.nama?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.role?.toLowerCase().includes(q),
      ),
    );
  };

  const openAdd = () => {
    setEditData(null);
    setFormData({
      nama: "",
      email: "",
      password: "",
      role: "PETANI",
      kelompokTani: "",
      alamat: "",
      nomorTelepon: "",
    });
    setModalOpen(true);
  };

  const openEdit = (pengguna) => {
    setEditData(pengguna);
    setFormData({
      nama: pengguna.nama || "",
      email: pengguna.email || "",
      password: "",
      role: pengguna.role || "PETANI",
      kelompokTani: pengguna.kelompokTani || "",
      alamat: pengguna.alamat || "",
      nomorTelepon: pengguna.nomorTelepon || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (editData) {
        if (!dataToSubmit.password) delete dataToSubmit.password;
        await updatePengguna(editData.id, dataToSubmit);
      } else {
        await createPengguna(dataToSubmit);
      }
      await fetchData();
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save pengguna:", error);
      alert(error.message || "Gagal menyimpan data pengguna");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus data pengguna ini?")
    ) {
      try {
        await deletePengguna(id);
        if (id === user.id) {
          await handleLogout();
          navigate("/login", { replace: true });
          return;
        }
        await fetchData();
      } catch (error) {
        console.error("Failed to delete pengguna:", error);
        alert("Gagal menghapus data pengguna");
      }
    }
  };

  const columns = [
    {
      header: "Pengguna",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${row.role === "ADMIN" ? "bg-gradient-to-br from-red-400 to-red-600" : row.role === "PETUGAS" ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-gradient-to-br from-plantation-400 to-plantation-600"}`}
          >
            {row.nama?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-semibold text-plantation-900">{row.nama}</p>
            <p className="text-xs text-plantation-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full uppercase ${row.role === "ADMIN" ? "bg-red-100 text-red-700" : row.role === "PETUGAS" ? "bg-blue-100 text-blue-700" : "bg-plantation-100 text-plantation-700"}`}
        >
          {row.role === "ADMIN" && <Shield size={12} />}
          {row.role === "PETUGAS" && <UserCircle size={12} />}
          {row.role === "PETANI" && <Users size={12} />}
          {row.role}
        </span>
      ),
    },
    {
      header: "Info Tambahan",
      render: (row) =>
        row.role === "PETANI" ? (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-plantation-600 text-xs font-medium">
              <Users size={11} className="text-plantation-400" />
              {row.kelompokTani || "-"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-plantation-600 text-[11px]">
              <MapPin size={11} className="text-plantation-400 flex-shrink-0" />
              <span className="max-w-[150px] truncate">
                {row.alamat || "-"}
              </span>
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Dinas / Internal</span>
        ),
    },
    {
      header: "Tgl Dibuat",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("id-ID")
          : "-",
    },
    {
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="p-2 rounded-lg hover:bg-plantation-100 text-plantation-600 hover:text-plantation-800 transition-colors"
            title="Edit"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
            title="Hapus"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const totalPengguna = penggunaList.length;
  const totalAdmin = penggunaList.filter((p) => p.role === "ADMIN").length;
  const totalPetani = penggunaList.filter((p) => p.role === "PETANI").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Header
          title="Data Pengguna"
          subtitle="Kelola semua akun: Admin, Petugas, dan Petani"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus size={18} /> Tambah Pengguna
        </motion.button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card-light p-4 text-center border-t-4 border-plantation-500">
          <p className="text-2xl font-bold text-plantation-800">
            {totalPengguna}
          </p>
          <p className="text-xs font-semibold text-plantation-500 mt-0.5">
            Total Pengguna
          </p>
        </div>
        <div className="glass-card-light p-4 text-center border-t-4 border-red-500">
          <p className="text-2xl font-bold text-red-800">{totalAdmin}</p>
          <p className="text-xs font-semibold text-red-500 mt-0.5">
            Total Admin
          </p>
        </div>
        <div className="glass-card-light p-4 text-center border-t-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-800">{totalPetani}</p>
          <p className="text-xs font-semibold text-blue-500 mt-0.5">
            Total Petani
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plantation-600"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          searchPlaceholder="Cari pengguna berdasarkan nama, email, atau role..."
          onSearch={handleSearch}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Email login"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-plantation-700 mb-1.5">
                Role / Peran
              </label>
              <select
                className="select-field"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              >
                <option value="PETANI">Petani</option>
                <option value="PETUGAS">Petugas Dinas</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-plantation-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder={
                editData
                  ? "(Biarkan kosong jika tidak diubah)"
                  : "Password login"
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!editData}
            />
          </div>

          {formData.role === "PETANI" && (
            <div className="p-4 bg-plantation-50 rounded-xl space-y-4 border border-plantation-100 mt-2">
              <h4 className="text-xs font-bold text-plantation-800 uppercase tracking-wide">
                Data Spesifik Petani
              </h4>
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">
                  Kelompok Tani
                </label>
                <input
                  type="text"
                  className="input-field bg-white"
                  placeholder="Masukkan nama kelompok"
                  value={formData.kelompokTani}
                  onChange={(e) =>
                    setFormData({ ...formData, kelompokTani: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">
                  Alamat
                </label>
                <input
                  type="text"
                  className="input-field bg-white"
                  placeholder="Masukkan alamat"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-plantation-700 mb-1.5">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  className="input-field bg-white"
                  placeholder="08xxxxxxxxxx"
                  value={formData.nomorTelepon}
                  onChange={(e) =>
                    setFormData({ ...formData, nomorTelepon: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" className="btn-primary flex-1">
              {editData ? "Simpan Perubahan" : "Buat Pengguna"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-outline flex-1"
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
