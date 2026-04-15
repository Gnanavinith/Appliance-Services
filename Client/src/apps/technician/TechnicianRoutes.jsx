import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TechnicianLayout from './TechnicianLayout';
import TodayJobsScreen from './screens/TodayJobsScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import JobHistoryScreen from './screens/JobHistoryScreen';

const TechnicianRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TechnicianLayout />}>
        <Route index element={<TodayJobsScreen />} />
        <Route path="history" element={<JobHistoryScreen />} />
        <Route path="job/:jobId" element={<JobDetailScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default TechnicianRoutes;
