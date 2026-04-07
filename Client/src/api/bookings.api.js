import axiosInstance from './axiosInstance';

export const bookingsApi = {
  getBookings: async (filters = {}) => {
    const response = await axiosInstance.get('/bookings', { params: filters });
    return response.data;
  },

  getBooking: async (bookingId) => {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  },

  updateBooking: async (bookingId, data) => {
    const response = await axiosInstance.put(`/bookings/${bookingId}`, data);
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  confirmBooking: async (bookingId) => {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/confirm`);
    return response.data;
  },

  completeBooking: async (bookingId) => {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/complete`);
    return response.data;
  },

  getCustomerBookings: async (customerId, filters = {}) => {
    const response = await axiosInstance.get(`/bookings/customer/${customerId}`, {
      params: filters,
    });
    return response.data;
  },

  getTechnicianBookings: async (technicianId, filters = {}) => {
    const response = await axiosInstance.get(
      `/bookings/technician/${technicianId}`,
      { params: filters }
    );
    return response.data;
  },
};
