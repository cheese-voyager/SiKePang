import { apiFetch } from './api';

export const getDashboardStats = async () => {
  const res = await apiFetch('/dashboard/stats');
  const data = await res.json();
  return data.data;
};

export const getStokTrend = async () => {
  const res = await apiFetch('/dashboard/stok-trend');
  const data = await res.json();
  return data.data;
};

export const getDistribusiPerBulan = async () => {
  const res = await apiFetch('/dashboard/distribusi-per-bulan');
  const data = await res.json();
  return data.data;
};

export const getHargaPasar = async () => {
  const res = await apiFetch('/komoditas');
  const data = await res.json();
  // Filter only commodities that have harga set by Petugas
  const komoditasWithHarga = (data.data || []).filter(k => k.harga !== null && k.harga !== undefined);
  return komoditasWithHarga;
};
