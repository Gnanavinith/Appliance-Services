import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BranchAdminLayout from './BranchAdminLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import MyTechnicians from './pages/MyTechnicians';
import Schedule from './pages/Schedule';

const BranchAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BranchAdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="technicians" element={<MyTechnicians />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default BranchAdminRoutes;
