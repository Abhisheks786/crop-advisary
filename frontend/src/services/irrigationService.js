import API from './api';

export const calculateIrrigation = (data) => API.post('/irrigation/calculate', data);
