import API from './api';

export const getRotationRecommendation = (data) => API.post('/rotation/recommend', data);
