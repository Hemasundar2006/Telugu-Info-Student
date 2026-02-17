import api from './config';

// Company management API wrappers, matching the provided backend contracts.

// Recruiter: get own company profile (linked via userId)
export const getMyCompanyProfile = () => api.get('/companies/me');

// Recruiter: update own company profile (auto re-verification handled by backend)
export const updateMyCompanyProfile = (payload) => api.put('/companies/me', payload);

export const registerCompany = (payload) =>
  api.post('/companies/register', payload);

export const getCompanyProfile = (companyId) =>
  api.get(`/companies/${companyId}`);

// Admin/Super-admin: update any company by ID (if still exposed by backend)
export const updateCompanyProfile = (companyId, payload) =>
  api.put(`/companies/${companyId}`, payload);

export const verifyCompany = (companyId, payload) =>
  api.post(`/companies/${companyId}/verify`, payload);

export const searchCompanies = (params) =>
  api.get('/companies/search', { params });

