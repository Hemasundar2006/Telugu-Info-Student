import api from './config';

// User ↔ Support chat (per ticket)
export const getUserSupportMessages = (ticketId) =>
  api.get(`/chats/user-support/${ticketId}`);

export const sendUserSupportMessage = (ticketId, body) =>
  api.post(`/chats/user-support/${ticketId}`, body);

// Support ↔ Admin global channel
export const getSupportAdminMessages = () => api.get('/chats/support-admin');

export const sendSupportAdminMessage = (body) =>
  api.post('/chats/support-admin', body);

// Admin ↔ Super Admin global channel
export const getAdminSuperAdminMessages = () =>
  api.get('/chats/admin-super-admin');

export const sendAdminSuperAdminMessage = (body) =>
  api.post('/chats/admin-super-admin', body);

