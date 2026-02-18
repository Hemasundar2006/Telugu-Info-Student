import api from './config';

// Create a new post (role: COMPANY or USER)
export const createPost = (payload) => api.post('/posts', payload);

// Update post (role: COMPANY or USER; must be author). Body: { text?, imageUrl?, linkPreview? }
export const updatePost = (postId, payload) => api.put(`/posts/${postId}`, payload);

// Delete post (role: COMPANY or USER; must be author)
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

// Share tracking (role: COMPANY or USER; must be post author)
export const getPostShares = (postId) => api.get(`/posts/${postId}/shares`);

// Posts by author (role: USER or COMPANY can view). Same shape as main feed.
export const getUserPosts = (userId, params = {}) =>
  api.get(`/posts/user/${userId}`, { params: { page: 1, limit: 10, ...params } });

