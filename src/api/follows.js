import api from './config';

/**
 * Toggle follow/unfollow a target user (logged-in).
 * POST /api/follows/:targetUserId
 */
export const toggleFollow = (targetUserId) => api.post(`/follows/${targetUserId}`);

/**
 * Follow status for a target user (logged-in).
 * GET /api/follows/:targetUserId/status
 */
export const getFollowStatus = (targetUserId) => api.get(`/follows/${targetUserId}/status`);

/**
 * Followers list for a user (logged-in).
 * GET /api/follows/:userId/followers?page=&limit=
 */
export const getFollowers = (userId, params = {}) =>
  api.get(`/follows/${userId}/followers`, { params: { page: 1, limit: 20, ...params } });

/**
 * Following list for a user (logged-in).
 * GET /api/follows/:userId/following?page=&limit=
 */
export const getFollowing = (userId, params = {}) =>
  api.get(`/follows/${userId}/following`, { params: { page: 1, limit: 20, ...params } });

