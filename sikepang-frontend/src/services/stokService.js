import { apiFetch } from './api';

export const getStok = async () => {
  const res = await apiFetch('/stok-pangan');
  const data = await res.json();
  return data.data;
};

export const getStokByPetani = async (petaniId) => {
  const res = await apiFetch(`/stok-pangan/petani/${petaniId}`);
  const data = await res.json();
  return data.data;
};

export const getStokById = async (id) => {
  const res = await apiFetch(`/stok-pangan/${id}`);
  const data = await res.json();
  return data.data;
};

export const createStok = async (stokData) => {
  const res = await apiFetch('/stok-pangan', {
    method: 'POST',
    body: JSON.stringify(stokData),
  });
  const data = await res.json();
  return data.data;
};

export const updateStok = async (id, stokData) => {
  const res = await apiFetch(`/stok-pangan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(stokData),
  });
  const data = await res.json();
  return data.data;
};

export const deleteStok = async (id) => {
  const res = await apiFetch(`/stok-pangan/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
