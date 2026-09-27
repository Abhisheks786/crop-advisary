import API from './api';

export const getCrops = () => API.get('/crops');
export const getCropById = (id) => API.get(`/crops/${id}`);
export const addCrop = (data) => API.post('/crops', data);
export const updateCrop = (id, data) => API.put(`/crops/${id}`, data);
export const deleteCrop = (id) => API.delete(`/crops/${id}`);
