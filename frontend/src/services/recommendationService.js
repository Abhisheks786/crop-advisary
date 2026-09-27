import API from './api';

export const generateRecommendation = (data) => API.post('/recommendations', data);
export const getRecommendations = () => API.get('/recommendations');
export const getRecommendationById = (id) => API.get(`/recommendations/${id}`);
