import axiosInstance from './axiosInstance';

export const statsApi = {
  getStats: async (role, filters = {}) => {
    const response = await axiosInstance.get(`/stats/${role}`, { params: filters });
    return response.data;
  },

  getDashboardMetrics: async (role) => {
    const response = await axiosInstance.get(`/stats/dashboard/${role}`);
    return response.data;
  },

  getReports: async (reportType, filters = {}) => {
    const response = await axiosInstance.get(`/reports/${reportType}`, {
      params: filters,
    });
    return response.data;
  },
};
