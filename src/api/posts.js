import api from './config';

// Create a new company post (role: COMPANY)
export const createPost = (payload) => api.post('/posts', payload);

// Update post (role: COMPANY; must be author). Body: { text?, imageUrl?, linkPreview? }
export const updatePost = (postId, payload) => api.put(`/posts/${postId}`, payload);

// Delete post (role: COMPANY; must be author)
export const deletePost = (postId) => api.delete(`/posts/${postId}`);

// Feed: latest or daily
export const getFeed = (params) => api.get('/posts/feed', { params });

// Toggle like (role: USER)
export const toggleLike = (postId) => api.post(`/posts/${postId}/like`);

// List likes (all roles)
export const getLikes = (postId) => api.get(`/posts/${postId}/likes`);

// Toggle save (role: USER)
export const toggleSave = (postId) => api.post(`/posts/${postId}/save`);

// Add comment (role: USER)
export const addComment = (postId, body) =>
  api.post(`/posts/${postId}/comments`, body);

// List comments (all roles)
export const getComments = (postId, params) =>
  api.get(`/posts/${postId}/comments`, { params });

// Share post (role: USER)
export const sharePost = (postId, payload) =>
  api.post(`/posts/${postId}/share`, payload);

// Company-only: share tracking
export const getPostShares = (postId) => api.get(`/posts/${postId}/shares`);

