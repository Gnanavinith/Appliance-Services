import axiosInstance from './axiosInstance';

export const technicianApi = {
  getMyJobs: async (filters = {}) => {
    const response = await axiosInstance.get('/technicians/my-jobs', { params: filters });
    return response.data;
  },

  getTodayJobs: async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await axiosInstance.get('/technicians/my-jobs', { 
      params: { date: today } 
    });
    return response.data;
  },

  updateJobStatus: async (jobId, status) => {
    const response = await axiosInstance.patch(`/technicians/jobs/${jobId}/status`, { status });
    return response.data;
  },

  getJobDetails: async (jobId) => {
    const response = await axiosInstance.get(`/bookings/${jobId}`);
    return response.data;
  },
};
