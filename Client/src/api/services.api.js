import axiosInstance from './axiosInstance';

export const servicesApi = {
  getServices: async (filters = {}) => {
    const response = await axiosInstance.get('/services', { params: filters });
    return response.data;
  },

  getService: async (serviceId) => {
    const response = await axiosInstance.get(`/services/${serviceId}`);
    return response.data;
  },

  createService: async (serviceData) => {
    const response = await axiosInstance.post('/services', serviceData);
    return response.data;
  },

  updateService: async (serviceId, data) => {
    const response = await axiosInstance.put(`/services/${serviceId}`, data);
    return response.data;
  },

  deleteService: async (serviceId) => {
    const response = await axiosInstance.delete(`/services/${serviceId}`);
    return response.data;
  },

  getServiceCategories: async () => {
    const response = await axiosInstance.get('/services/categories');
    return response.data;
  },
};
