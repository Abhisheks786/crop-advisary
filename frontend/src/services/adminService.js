import API from './api';

export const getAdminStatistics = () => API.get('/admin/statistics');
export const getAllRecommendations = () => API.get('/admin/recommendations');
export const getScoringWeights = () => API.get('/admin/scoring-weights');
export const updateScoringWeights = (weights) => API.put('/admin/scoring-weights', weights);
