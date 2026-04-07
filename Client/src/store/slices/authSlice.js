import { createSlice } from '@reduxjs/toolkit';

// Helper function to load initial state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userStr = localStorage.getItem('user');
    
    if (token) {
      return {
        ...initialState,
        token,
        role: role || null,
        user: userStr ? JSON.parse(userStr) : null,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
  }
  return initialState;
};

const initialState = {
  user: null,
  role: null, // 'customer', 'technician', 'branch-admin', 'super-admin'
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role || action.payload.user?.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      // Persist token, role, and user to localStorage
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      if (action.payload.role) {
        localStorage.setItem('role', action.payload.role);
      }
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      // Clear all auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;