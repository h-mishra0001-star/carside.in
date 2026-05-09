import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin, validateChangePassword } from '../middleware/validation.js';
import { 
  register, 
  login, 
  getMe, 
  verifyToken,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js';

const router = express.Router();

// Public Routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/verify', verifyToken);

// Protected Routes (require authentication)
router.use(protect);

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', validateChangePassword, changePassword);
router.post('/logout', logout);

export default router;