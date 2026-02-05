import api from './config';

export const getDashboardActivities = (filters) =>
  api.get('/activities/dashboard', { params: filters || {} });

export const getActivityStats = (dateRange) =>
  api.get('/activities/stats', { params: dateRange || {} });

export const getUserActivities = (userId, pagination) =>
  api.get(`/activities/user/${userId}`, { params: pagination || {} });
