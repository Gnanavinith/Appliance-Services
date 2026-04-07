import axiosInstance from './axiosInstance';

export const technicianApi = {
  getTechnicianJobs: async (technicianId, filters = {}) => {
    const response = await axiosInstance.get(
      `/technicians/${technicianId}/jobs`,
      { params: filters }
    );
    return response.data;
  },

  getTodayJobs: async (technicianId) => {
    const response = await axiosInstance.get(
      `/technicians/${technicianId}/jobs/today`
    );
    return response.data;
  },

  updateJobStatus: async (jobId, status) => {
    const response = await axiosInstance.patch(`/jobs/${jobId}/status`, { status });
    return response.data;
  },

  getJobDetails: async (jobId) => {
    const response = await axiosInstance.get(`/jobs/${jobId}`);
    return response.data;
  },
};
