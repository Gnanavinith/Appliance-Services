import axiosInstance from './axiosInstance';

export const notificationsApi = {
  getNotifications: async (filters = {}) => {
    const response = await axiosInstance.get('/notifications', { params: filters });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
