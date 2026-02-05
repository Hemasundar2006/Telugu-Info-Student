import api from './config';

export const login = (payload) => api.post('/auth/login', payload);

export const register = (userData) => api.post('/auth/register', userData);
