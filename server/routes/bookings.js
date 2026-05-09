import express from 'express';
import { protect, admin, moderator } from '../middleware/auth.js';
import { 
  validateBookingId, 
  validateCreateBooking,
  validateUpdateBookingStatus,
  validatePagination
} from '../middleware/validation.js';
import { 
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
  getBookingStats
} from '../controllers/bookingController.js';

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// User routes
router.post('/', validateCreateBooking, createBooking);
router.get('/my-bookings', validatePagination, getUserBookings);
router.get('/:id', validateBookingId, getBookingById);
router.put('/:id/cancel', validateBookingId, cancelBooking);
router.put('/:id/status', validateBookingId, validateUpdateBookingStatus, updateBookingStatus);

// Admin only routes
router.get('/admin/all', admin, validatePagination, getAllBookings);
router.get('/admin/stats', admin, getBookingStats);

// Dealer/Moderator routes
router.get('/dealer/upcoming', moderator, (req, res) => {
  res.status(501).json({ message: 'Upcoming bookings endpoint - Coming soon' });
});

router.put('/:id/confirm', moderator, validateBookingId, async (req, res) => {
  res.status(501).json({ message: 'Confirm booking endpoint - Coming soon' });
});

router.put('/:id/complete', moderator, validateBookingId, async (req, res) => {
  res.status(501).json({ message: 'Complete booking endpoint - Coming soon' });
});

router.post('/:id/reminder', moderator, validateBookingId, (req, res) => {
  res.status(501).json({ message: 'Send reminder endpoint - Coming soon' });
});

export default router;