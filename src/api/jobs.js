import api from './config';

// Job posting API wrappers, matching the provided backend contracts.

export const createJob = (payload) => api.post('/jobs/create', payload);

export const getJobById = (jobId) => api.get(`/jobs/${jobId}`);

export const updateJob = (jobId, payload) =>
  api.put(`/jobs/${jobId}`, payload);

export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);

export const closeJob = (jobId) => api.post(`/jobs/${jobId}/close`);

export const listJobs = (params) =>
  api.get('/jobs/list', {
    params,
  });

