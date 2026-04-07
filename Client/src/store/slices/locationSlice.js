import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  city: null,
  address: null,
  coordinates: {
    latitude: null,
    longitude: null,
  },
  mapPin: null,
  savedAddresses: [],
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setCoordinates: (state, action) => {
      state.coordinates = {
        ...state.coordinates,
        ...action.payload,
      };
    },
    setMapPin: (state, action) => {
      state.mapPin = action.payload;
    },
    addSavedAddress: (state, action) => {
      state.savedAddresses.push(action.payload);
    },
    updateSavedAddress: (state, action) => {
      const index = state.savedAddresses.findIndex(
        (addr) => addr.id === action.payload.id
      );
      if (index !== -1) {
        state.savedAddresses[index] = action.payload;
      }
    },
    removeSavedAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter(
        (addr) => addr.id !== action.payload
      );
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
  setCity,
  setAddress,
  setCoordinates,
  setMapPin,
  addSavedAddress,
  updateSavedAddress,
  removeSavedAddress,
  setLoading,
  setError,
} = locationSlice.actions;

export default locationSlice.reducer;
