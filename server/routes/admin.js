import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Car from '../models/Car.js';
import Brand from '../models/Brand.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard Statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalCars,
      totalBrands,
      totalBookings,
      pendingBookings,
      totalReviews
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Car.countDocuments(),
      Brand.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      0
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('username email createdAt');
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username')
      .populate('carId', 'modelName');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalCars,
          totalBrands,
          totalBookings,
          pendingBookings,
          totalReviews
        },
        recentActivity: {
          users: recentUsers,
          bookings: recentBookings
        }
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, isActive, fullName, phone } = req.body;
    const updates = {};
    
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    if (fullName) updates.fullName = fullName;
    if (phone) updates.phone = phone;
    
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// System Settings
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    data: {
      siteName: 'Carside.in',
      siteDescription: 'Ultimate Automotive Platform',
      maintenanceMode: false,
      version: '1.0.0'
    }
  });
});

router.put('/settings', (req, res) => {
  res.json({ success: true, message: 'Settings updated successfully' });
});

export default router;