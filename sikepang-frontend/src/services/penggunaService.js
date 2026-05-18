import { apiFetch } from './api';

export const getPengguna = async () => {
  const res = await apiFetch('/pengguna');
  const data = await res.json();
  return data.data;
};

export const getPenggunaById = async (id) => {
  const res = await apiFetch(`/pengguna/${id}`);
  const data = await res.json();
  return data.data;
};

export const createPengguna = async (penggunaData) => {
  const res = await apiFetch('/pengguna', {
    method: 'POST',
    body: JSON.stringify(penggunaData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menambahkan pengguna');
  return data.data;
};

export const updatePengguna = async (id, penggunaData) => {
  const res = await apiFetch(`/pengguna/${id}`, {
    method: 'PUT',
    body: JSON.stringify(penggunaData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui pengguna');
  return data.data;
};

export const deletePengguna = async (id) => {
  const res = await apiFetch(`/pengguna/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Gagal menghapus pengguna');
};
