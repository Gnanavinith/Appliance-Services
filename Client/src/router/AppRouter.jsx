import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomerRoutes from '../apps/customer/CustomerRoutes';
import TechnicianRoutes from '../apps/technician/TechnicianRoutes';
import SuperAdminRoutes from '../apps/super-admin/SuperAdminRoutes';
import BranchAdminRoutes from '../apps/branch-admin/BranchAdminRoutes';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';

const AppRouter = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes - Login page removed, using modals in LandingPage instead */}
      {/* <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } 
      /> */}
      
      {/* Root - Show landing page if not authenticated, redirect to dashboard if authenticated */}
      <Route 
        path="/" 
        element={<LandingPage />} 
      />
      
      {/* Redirect old /customer routes to /dashboard - REMOVED, now using /customer routes */}
      
      {/* Redirect old direct routes */}
      <Route 
        path="/summary" 
        element={<Navigate to="/dashboard/summary" replace />} 
      />
      <Route 
        path="/confirmation" 
        element={<Navigate to="/dashboard/confirmation" replace />} 
      />
      <Route 
        path="/bookings" 
        element={<Navigate to="/dashboard/bookings" replace />} 
      />
      <Route 
        path="/profile" 
        element={<Navigate to="/dashboard/profile" replace />} 
      />
      
      {/* Role-based protected routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician/*"
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <TechnicianRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['super-admin', 'branch-admin']}>
            <SuperAdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/branch-admin/*"
        element={
          <ProtectedRoute allowedRoles={['branch-admin']}>
            <BranchAdminRoutes />
          </ProtectedRoute>
        }
      />
      
      {/* Fallback routes */}
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
