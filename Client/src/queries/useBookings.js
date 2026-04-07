import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';

export const useBookings = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingsApi.getBookings(filters),
    ...options,
  });
};

export const useBooking = (bookingId) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsApi.getBooking(bookingId),
    enabled: !!bookingId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData) => bookingsApi.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => bookingsApi.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => bookingsApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => bookingsApi.confirmBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => bookingsApi.completeBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
  });
};

export const useCustomerBookings = (customerId, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['customerBookings', customerId, filters],
    queryFn: () => bookingsApi.getCustomerBookings(customerId, filters),
    enabled: !!customerId && options.enabled !== false,
    ...options,
  });
};

export const useTechnicianBookings = (technicianId, filters = {}) => {
  return useQuery({
    queryKey: ['technicianBookings', technicianId, filters],
    queryFn: () => bookingsApi.getTechnicianBookings(technicianId, filters),
    enabled: !!technicianId,
  });
};
