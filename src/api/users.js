import api from './config';

/**
 * Full profile details for a user/company (auth required).
 * GET /api/users/:userId/profile
 * Returns base user data + counts + role-based details.
 */
export const getUserProfile = (userId) => api.get(`/users/${userId}/profile`);

/**
 * People search (users & companies).
 * GET /api/search/people?q=&role=
 */
export const searchUsers = (q, params = {}) =>
  api.get('/search/people', { params: { q, limit: 20, ...params } });

