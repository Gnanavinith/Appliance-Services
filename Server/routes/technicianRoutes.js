import express from 'express';
const router = express.Router();

import {
  getAllTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  getMyJobs,
  updateJobStatus,
} from '../controllers/technicianController.js';

import { protect, authorize } from '../middleware/auth.js';

// Public routes (accessible by authenticated users)
router.route('/')
  .get(protect, authorize('super-admin', 'branch-admin'), getAllTechnicians)
  .post(protect, authorize('super-admin'), createTechnician);

// Technician's own jobs routes (MUST be before /:id route)
router.route('/my-jobs')
  .get(protect, authorize('technician'), getMyJobs);

router.route('/jobs/:bookingId/status')
  .patch(protect, authorize('technician'), updateJobStatus);

// Parameterized routes (MUST be after specific routes)
router.route('/:id')
  .get(protect, getTechnicianById)
  .put(protect, authorize('super-admin'), updateTechnician)
  .delete(protect, authorize('super-admin'), deleteTechnician);

export default router;
