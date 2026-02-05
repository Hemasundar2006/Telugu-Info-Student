import api from './config';

export const createTicket = (ticketData) => api.post('/tickets', ticketData);

export const getMyTickets = () => api.get('/tickets');

export const getSupportTickets = () => api.get('/tickets/support');

export const assignTicket = (id) => api.patch(`/tickets/${id}/assign`);

export const completeTicket = (id, body) => api.patch(`/tickets/${id}/complete`, body || {});

export const getSuperAdminTickets = () => api.get('/tickets/super-admin');
