import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/:id/read')
  .patch(markAsRead);

router.route('/mark-all-read')
  .patch(markAllAsRead);

router.route('/:id')
  .delete(deleteNotification);

export default router;
