import express from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  getCustomerBookings,
  getTechnicianBookings,
  updateBooking,
  cancelBooking,
  confirmBooking,
  completeBooking,
  assignTechnician,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
// None - all booking routes require authentication

// Protected routes (authentication required)
router.use(protect); // Apply to all routes below

// Create booking
router.post('/', createBooking);

// Get all bookings (admin only)
router.get('/', authorize('super-admin', 'admin', 'branch-admin'), getBookings);

// Get single booking by ID
router.get('/:id', getBooking);

// Get customer's own bookings
router.get('/customer/:customerId', getCustomerBookings);

// Get technician's bookings
router.get('/technician/:technicianId', authorize('technician', 'super-admin', 'admin', 'branch-admin'), getTechnicianBookings);

// Update booking
router.put('/:id', updateBooking);

// Cancel booking
router.patch('/:id/cancel', cancelBooking);

// Confirm booking (admin/branch-admin only)
router.patch('/:id/confirm', authorize('super-admin', 'admin', 'branch-admin'), confirmBooking);

// Complete booking (technician/admin only)
router.patch('/:id/complete', authorize('technician', 'super-admin', 'admin', 'branch-admin'), completeBooking);

// Assign technician to booking (admin/branch-admin only)
router.patch('/:id/assign-technician', authorize('super-admin', 'admin', 'branch-admin'), assignTechnician);

export default router;
