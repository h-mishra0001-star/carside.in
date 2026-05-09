import express from 'express';
import { protect, admin, moderator } from '../middleware/auth.js';
import { 
  validateCarId, 
  validateCreateCar, 
  validateCarFilters,
  validatePagination
} from '../middleware/validation.js';
import { 
  getCars,
  getCarById,
  getCarsByBrand,
  getNewReleases,
  getFeaturedCars,
  searchCars,
  getFilterOptions,
  createCar,
  updateCar,
  deleteCar
} from '../controllers/carController.js';

const router = express.Router();

// Public Routes (anyone can access)
router.get('/', validateCarFilters, validatePagination, getCars);
router.get('/filters/options', getFilterOptions);
router.get('/new-releases', getNewReleases);
router.get('/featured', getFeaturedCars);
router.get('/search/:query', searchCars);
router.get('/brand/:brandId', getCarsByBrand);
router.get('/:id', validateCarId, getCarById);

// Protected Routes (Admin/Moderator only)
router.use(protect); // All routes below require authentication

// Admin only routes
router.post('/', admin, validateCreateCar, createCar);
router.put('/:id', admin, validateCarId, validateCreateCar, updateCar);
router.delete('/:id', admin, validateCarId, deleteCar);

// Bulk operations (Admin only)
router.post('/bulk', admin, (req, res) => {
  // Bulk create cars
  res.status(501).json({ message: 'Bulk create endpoint - Coming soon' });
});

router.delete('/bulk', admin, (req, res) => {
  // Bulk delete cars
  res.status(501).json({ message: 'Bulk delete endpoint - Coming soon' });
});

export default router;