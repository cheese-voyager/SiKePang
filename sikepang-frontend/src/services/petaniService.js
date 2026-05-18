import { apiFetch } from './api';

export const getPetani = async () => {
  const res = await apiFetch('/petani');
  const data = await res.json();
  return data.data;
};

export const getPetaniById = async (id) => {
  const res = await apiFetch(`/petani/${id}`);
  const data = await res.json();
  return data.data;
};

export const createPetani = async (petaniData) => {
  const res = await apiFetch('/petani', {
    method: 'POST',
    body: JSON.stringify(petaniData),
  });
  const data = await res.json();
  return data.data;
};

export const updatePetani = async (id, petaniData) => {
  const res = await apiFetch(`/petani/${id}`, {
    method: 'PUT',
    body: JSON.stringify(petaniData),
  });
  const data = await res.json();
  return data.data;
};

export const deletePetani = async (id) => {
  const res = await apiFetch(`/petani/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
