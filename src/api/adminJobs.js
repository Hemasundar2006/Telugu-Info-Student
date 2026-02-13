import api from './config';

const BASE = '/admin/jobs';

/**
 * Create job and auto-notify matching students.
 * POST /api/admin/jobs
 * Body: JobPosting payload (with govtJobFields or privateJobFields by category).
 */
export const createJob = (payload) => api.post(BASE, payload);

/**
 * Get all jobs with filters and pagination.
 * GET /api/admin/jobs?category=Government|Private&status=Active|Draft|Closed|Expired&page=1&limit=10
 */
export const getJobs = (params = {}) =>
  api.get(BASE, { params: { page: 1, limit: 10, ...params } });

/**
 * Get single job with notification status.
 * GET /api/admin/jobs/:jobId
 */
export const getJobById = (jobId) => api.get(`${BASE}/${jobId}`);

/**
 * Update job (does not resend notifications).
 * PUT /api/admin/jobs/:jobId
 */
export const updateJob = (jobId, payload) => api.put(`${BASE}/${jobId}`, payload);

/**
 * Soft delete: sets status to Closed.
 * DELETE /api/admin/jobs/:jobId
 */
export const deleteJob = (jobId) => api.delete(`${BASE}/${jobId}`);

/**
 * Preview how many students would be notified for given targetQualifications.
 * POST /api/admin/jobs/check-matching
 * Body: { targetQualifications: string[] }
 */
export const checkMatchingStudents = (payload) =>
  api.post(`${BASE}/check-matching`, payload);
