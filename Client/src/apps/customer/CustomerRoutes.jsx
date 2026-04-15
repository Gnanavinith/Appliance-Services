import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import CustomerLayout from './layout/CustomerLayout';
import HomeScreen from './screens/HomeScreen';
import BookingScreen from './screens/BookingScreen';
import SummaryScreen from './screens/SummaryScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import PersonalDetailsScreen from './screens/PersonalDetailsScreen';

const CustomerRoutes = () => {
  return (
    <Routes>
      {/* All routes WITH layout (navbar) */}
      <Route path="/" element={<CustomerLayout><Outlet /></CustomerLayout>}>
        <Route index element={<HomeScreen />} />
        <Route path="book" element={<BookingScreen />} />
        <Route path="summary" element={<SummaryScreen />} />
        <Route path="confirmation" element={<ConfirmationScreen />} />
        <Route path="bookings" element={<MyBookingsScreen />} />
        <Route path="profile" element={<PersonalDetailsScreen />} />
        <Route path="booking/:id" element={<div>Booking Detail Screen (Coming Soon)</div>} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default CustomerRoutes;
