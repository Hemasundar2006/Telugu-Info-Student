import api from './config';

// Create a new student profile
export const createUserProfile = (payload) =>
  api.post('/user-profiles', payload);

// Get profile by email (preferred) or list all
export const getUserProfileByEmail = (email) =>
  api.get('/user-profiles', { params: { email } });

// Get profile by id
export const getUserProfileById = (id) =>
  api.get(`/user-profiles/${id}`);

// Update profile (partial)
export const updateUserProfile = (id, payload) =>
  api.patch(`/user-profiles/${id}`, payload);

// Delete profile
export const deleteUserProfile = (id) =>
  api.delete(`/user-profiles/${id}`);

