import api from './config';

const BASE = '/student/job-listings';

/**
 * Get job listings matching student's qualification (Active jobs only).
 * GET /api/student/job-listings?category=Government|Private&page=1&limit=10
 */
export const getJobListings = (params = {}) =>
  api.get(BASE, { params: { page: 1, limit: 10, ...params } });
