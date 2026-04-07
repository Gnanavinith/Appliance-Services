import axiosInstance from './axiosInstance';

export const branchesApi = {
  getBranches: async (filters = {}) => {
    const response = await axiosInstance.get('/branches', { params: filters });
    return response.data;
  },

  getBranch: async (branchId) => {
    const response = await axiosInstance.get(`/branches/${branchId}`);
    return response.data;
  },

  createBranch: async (branchData) => {
    const response = await axiosInstance.post('/branches', branchData);
    return response.data;
  },

  updateBranch: async (branchId, data) => {
    const response = await axiosInstance.put(`/branches/${branchId}`, data);
    return response.data;
  },

  deleteBranch: async (branchId) => {
    const response = await axiosInstance.delete(`/branches/${branchId}`);
    return response.data;
  },

  addTechnicianToBranch: async (branchId, technicianId) => {
    const response = await axiosInstance.post(`/branches/${branchId}/technicians`, {
      technicianId,
    });
    return response.data;
  },

  removeTechnicianFromBranch: async (branchId, technicianId) => {
    const response = await axiosInstance.delete(
      `/branches/${branchId}/technicians/${technicianId}`
    );
    return response.data;
  },
};
