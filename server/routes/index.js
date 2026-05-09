import express from 'express';

import carRoutes from './cars.js';
import brandRoutes from './brands.js';
import bookingRoutes from './bookings.js';
import authRoutes from './auth.js';
import adminRoutes from './admin.js';

const router = express.Router();

/* =========================
   API ROUTES
========================= */

// Cars
router.use('/cars', carRoutes);

// Brands
router.use('/brands', brandRoutes);

// Bookings
router.use('/bookings', bookingRoutes);

// Auth
router.use('/auth', authRoutes);

// Admin
router.use('/admin', adminRoutes);

/* =========================
   API STATUS ROUTE
========================= */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Carside API Routes Working',
    endpoints: {
      cars: '/api/cars',
      brands: '/api/brands',
      bookings: '/api/bookings',
      auth: '/api/auth',
      admin: '/api/admin',
    },
  });
});

export default router;