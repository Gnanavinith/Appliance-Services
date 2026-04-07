import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBooking: null,
  bookings: [],
  draftBooking: {
    serviceId: null,
    technicianId: null,
    dateTime: null,
    location: null,
    status: 'draft',
  },
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setDraftBooking: (state, action) => {
      // Convert Dayjs objects to ISO strings for serialization
      const serializedPayload = {};
      Object.keys(action.payload).forEach(key => {
        const value = action.payload[key];
        // Check if it's a Dayjs object and convert to ISO string
        if (value && typeof value === 'object' && value.$d) {
          serializedPayload[key] = value.toISOString();
        } else if (value instanceof Date) {
          serializedPayload[key] = value.toISOString();
        } else {
          serializedPayload[key] = value;
        }
      });
      state.draftBooking = { ...state.draftBooking, ...serializedPayload };
    },
    resetDraftBooking: (state) => {
      state.draftBooking = {
        serviceId: null,
        technicianId: null,
        dateTime: null,
        location: null,
        status: 'draft',
      };
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(
        (b) => b.id === action.payload.id
      );
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDraftBooking,
  resetDraftBooking,
  setCurrentBooking,
  setBookings,
  addBooking,
  updateBooking,
  setOtpSent,
  setOtpVerified,
  setLoading,
  setError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
