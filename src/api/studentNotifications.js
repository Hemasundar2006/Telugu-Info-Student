import api from './config';

const BASE = '/student/notifications';

/**
 * Get all notifications for the current student.
 * GET /api/student/notifications?isRead=false&page=1&limit=10
 */
export const getNotifications = (params = {}) =>
  api.get(BASE, { params: { page: 1, limit: 10, ...params } });

/**
 * Mark a notification as read.
 * PUT /api/student/notifications/:notificationId/read
 */
export const markNotificationRead = (notificationId) =>
  api.put(`${BASE}/${notificationId}/read`);

/**
 * Delete a notification (must belong to current student).
 * DELETE /api/student/notifications/:notificationId
 */
export const deleteNotification = (notificationId) =>
  api.delete(`${BASE}/${notificationId}`);
