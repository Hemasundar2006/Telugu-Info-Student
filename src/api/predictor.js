import api from './config';

export const predictColleges = (predictionData) => api.post('/predict', predictionData);
