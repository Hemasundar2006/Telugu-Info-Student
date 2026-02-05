import api from './config';

export const uploadDocument = (formData) =>
  api.post('/docs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getPendingDocuments = () => api.get('/docs/pending');

export const approveDocument = (id) => api.patch(`/docs/${id}/approve`);

export const listApprovedDocuments = (params) => api.get('/docs/list', { params: params || {} });
