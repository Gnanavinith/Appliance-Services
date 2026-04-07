import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminLayout from './SuperAdminLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import Branches from './pages/Branches';
import CreateBranch from './pages/CreateBranch';
import EditBranch from './pages/EditBranch';
import Technicians from './pages/Technicians';
import EditTechnician from './pages/EditTechnician';
import Reports from './pages/Reports';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="services" element={<Services />} />
        <Route path="branches" element={<Branches />} />
        <Route path="branches/create" element={<CreateBranch />} />
        <Route path="branches/edit/:id" element={<EditBranch />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="technicians/new" element={<EditTechnician />} />
        <Route path="technicians/:id" element={<EditTechnician />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
