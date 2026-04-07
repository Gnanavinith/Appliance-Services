import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  modals: {
    confirmModal: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    },
    infoModal: {
      open: false,
      title: '',
      content: '',
    },
  },
  toasts: [],
  sidebarOpen: false,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    openConfirmModal: (state, action) => {
      state.modals.confirmModal = {
        open: true,
        ...action.payload,
      };
    },
    closeConfirmModal: (state) => {
      state.modals.confirmModal = {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
      };
    },
    openInfoModal: (state, action) => {
      state.modals.infoModal = {
        open: true,
        ...action.payload,
      };
    },
    closeInfoModal: (state) => {
      state.modals.infoModal = {
        open: false,
        title: '',
        content: '',
      };
    },
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  setLoading,
  openConfirmModal,
  closeConfirmModal,
  openInfoModal,
  closeInfoModal,
  addToast,
  removeToast,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
