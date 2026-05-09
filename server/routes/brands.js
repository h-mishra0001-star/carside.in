import express from 'express';
import { protect, admin, moderator } from '../middleware/auth.js';
import { 
  validateBrandId, 
  validateCreateBrand,
  validatePagination
} from '../middleware/validation.js';
import { 
  getBrands,
  getBrandById,
  getBrandCars,
  getFeaturedBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brandController.js';

const router = express.Router();

// Public Routes (anyone can access)
router.get('/', validatePagination, getBrands);
router.get('/featured', getFeaturedBrands);
router.get('/:id/cars', validateBrandId, getBrandCars);
router.get('/:id', validateBrandId, getBrandById);

// Protected Routes (Admin/Moderator only)
router.use(protect); // All routes below require authentication

// Admin only routes
router.post('/', admin, validateCreateBrand, createBrand);
router.put('/:id', admin, validateBrandId, validateCreateBrand, updateBrand);
router.delete('/:id', admin, validateBrandId, deleteBrand);

// Featured brands management (Admin only)
router.put('/:id/featured', admin, validateBrandId, async (req, res) => {
  // Toggle featured status
  res.status(501).json({ message: 'Featured toggle endpoint - Coming soon' });
});

// Brand image upload (Admin only)
router.post('/:id/logo', admin, validateBrandId, (req, res) => {
  // Upload brand logo
  res.status(501).json({ message: 'Logo upload endpoint - Coming soon' });
});

router.post('/:id/cover', admin, validateBrandId, (req, res) => {
  // Upload brand cover image
  res.status(501).json({ message: 'Cover upload endpoint - Coming soon' });
});

export default router;