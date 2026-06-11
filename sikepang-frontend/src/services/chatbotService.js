import { apiFetch } from './api';

/**
 * Mengirim pesan ke API chatbot backend
 * @param {string} message 
 * @returns {Promise<string>} Jawaban dari AI
 */
export async function sendChatMessage(message) {
  const response = await apiFetch('/chatbot', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Gagal menghubungi asisten AI.');
  }

  const resData = await response.json();
  return resData.data;
}
