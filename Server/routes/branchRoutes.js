import express from 'express';
const router = express.Router();

import {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  addTechnicianToBranch,
  removeTechnicianFromBranch,
} from '../controllers/branchController.js';

import { protect, authorize } from '../middleware/auth.js';

// All routes require authentication and super-admin authorization
router.use(protect);
router.use(authorize('super-admin'));

router.route('/')
  .post(createBranch)
  .get(getBranches);

router.route('/:id')
  .get(getBranch)
  .put(updateBranch)
  .delete(deleteBranch);

router.route('/:id/technicians')
  .post(addTechnicianToBranch);

router.route('/:id/technicians/:techId')
  .delete(removeTechnicianFromBranch);

export default router;
