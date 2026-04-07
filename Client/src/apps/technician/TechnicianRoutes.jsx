import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodayJobsScreen from './screens/TodayJobsScreen';
import JobDetailScreen from './screens/JobDetailScreen';

const TechnicianRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TodayJobsScreen />} />
      <Route path="/job/:jobId" element={<JobDetailScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default TechnicianRoutes;
