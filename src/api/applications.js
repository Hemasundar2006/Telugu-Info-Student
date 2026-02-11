import api from './config';

// Job application API wrappers, matching the provided backend contracts.

export const submitApplication = (payload) =>
  api.post('/applications/submit', payload);

export const getApplicationById = (applicationId) =>
  api.get(`/applications/${applicationId}`);

export const listApplicationsForJob = (jobId, params) =>
  api.get(`/applications/${jobId}`, { params });

export const updateApplicationStatus = (applicationId, payload) =>
  api.put(`/applications/${applicationId}/status`, payload);

export const hireStudent = (applicationId) =>
  api.post(`/applications/${applicationId}/hire`);

export const getApplicationHistory = (params) =>
  api.get('/applications/history', { params });

