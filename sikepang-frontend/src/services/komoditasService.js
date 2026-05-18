import { apiFetch } from './api';

export const getKomoditas = async () => {
  const res = await apiFetch('/komoditas');
  const data = await res.json();
  return data.data;
};

export const getKomoditasById = async (id) => {
  const res = await apiFetch(`/komoditas/${id}`);
  const data = await res.json();
  return data.data;
};

export const createKomoditas = async (komoditasData) => {
  const res = await apiFetch('/komoditas', {
    method: 'POST',
    body: JSON.stringify(komoditasData),
  });
  const data = await res.json();
  return data.data;
};

export const updateKomoditas = async (id, komoditasData) => {
  const res = await apiFetch(`/komoditas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(komoditasData),
  });
  const data = await res.json();
  return data.data;
};

export const deleteKomoditas = async (id) => {
  const res = await apiFetch(`/komoditas/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
