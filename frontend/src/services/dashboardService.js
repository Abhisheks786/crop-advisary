import API from './api';

export const getStatistics = () => API.get('/dashboard/statistics');
export const getRecentRecommendations = () => API.get('/dashboard/recent');
