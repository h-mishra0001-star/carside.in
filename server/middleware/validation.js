import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation result handler
 * Returns validation errors if any
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg
  }));

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: extractedErrors
  });
};

// ==================== AUTH VALIDATIONS ====================

export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),
  
  validate
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  
  validate
];

// ==================== CAR VALIDATIONS ====================

export const validateCarId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid car ID format'),
  
  validate
];

export const validateCreateCar = [
  body('modelName')
    .trim()
    .notEmpty()
    .withMessage('Model name is required')
    .isLength({ max: 100 })
    .withMessage('Model name cannot exceed 100 characters'),
  
  body('brandId')
    .isMongoId()
    .withMessage('Invalid brand ID'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 2}`),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('horsepower')
    .isInt({ min: 0 })
    .withMessage('Horsepower must be a positive integer'),
  
  body('fuelType')
    .optional()
    .isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'])
    .withMessage('Invalid fuel type'),
  
  body('transmission')
    .optional()
    .isIn(['Manual', 'Automatic', 'CVT', 'DCT', 'Electric'])
    .withMessage('Invalid transmission type'),
  
  validate
];

// ==================== BRAND VALIDATIONS ====================

export const validateBrandId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid brand ID format'),
  
  validate
];

export const validateCreateBrand = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ max: 100 })
    .withMessage('Brand name cannot exceed 100 characters'),
  
  body('logoUrl')
    .optional()
    .isURL()
    .withMessage('Logo URL must be a valid URL'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  
  body('foundedYear')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Invalid founded year'),
  
  validate
];

// ==================== BOOKING VALIDATIONS ====================

export const validateBookingId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid booking ID format'),
  
  validate
];

export const validateCreateBooking = [
  body('carId')
    .isMongoId()
    .withMessage('Invalid car ID'),
  
  body('testDriveDate')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom(value => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Test drive date cannot be in the past');
      }
      return true;
    }),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  
  validate
];

export const validateUpdateBookingStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status. Allowed: pending, confirmed, cancelled, completed'),
  
  validate
];

// ==================== PAGINATION VALIDATIONS ====================

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  validate
];

// ==================== FILTER VALIDATIONS ====================

export const validateCarFilters = [
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number')
    .toFloat(),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
    .toFloat(),
  
  query('minYear')
    .optional()
    .isInt({ min: 1900 })
    .withMessage('Minimum year must be at least 1900')
    .toInt(),
  
  query('maxYear')
    .optional()
    .isInt({ max: new Date().getFullYear() + 2 })
    .withMessage(`Maximum year cannot exceed ${new Date().getFullYear() + 2}`)
    .toInt(),
  
  query('fuelType')
    .optional()
    .isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'])
    .withMessage('Invalid fuel type'),
  
  query('transmission')
    .optional()
    .isIn(['Manual', 'Automatic', 'CVT', 'DCT', 'Electric'])
    .withMessage('Invalid transmission type'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt(),
  
  validate
];