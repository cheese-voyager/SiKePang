import { apiFetch } from './api';

export const getDistribusi = async () => {
  const res = await apiFetch('/distribusi');
  const data = await res.json();
  return data.data;
};

export const getDistribusiById = async (id) => {
  const res = await apiFetch(`/distribusi/${id}`);
  const data = await res.json();
  return data.data;
};

export const createDistribusi = async (distribusiData) => {
  const res = await apiFetch('/distribusi', {
    method: 'POST',
    body: JSON.stringify(distribusiData),
  });
  const data = await res.json();
  return data.data;
};

export const updateDistribusiStatus = async (id, status) => {
  const res = await apiFetch(`/distribusi/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  return data.data;
};

export const deleteDistribusi = async (id) => {
  const res = await apiFetch(`/distribusi/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
