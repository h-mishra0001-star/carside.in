// client/src/utils/constants.js

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  CARS: {
    BASE: '/cars',
    NEW_RELEASES: '/cars?newOnly=true',
    FEATURED: '/cars?sort=featured',
    TOP_RATED: '/cars?sort=rating_desc'
  },
  BRANDS: {
    BASE: '/brands',
    FEATURED: '/brands?featured=true'
  },
  BOOKINGS: {
    BASE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings'
  }
};

// Car Filters
export const CAR_FILTERS = {
  SORT_OPTIONS: [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'hp_desc', label: 'Horsepower: High to Low' },
    { value: 'rating_desc', label: 'Top Rated' }
  ],
  PRICE_RANGES: [
    { min: 0, max: 25000, label: 'Under $25,000' },
    { min: 25000, max: 50000, label: '$25,000 - $50,000' },
    { min: 50000, max: 75000, label: '$50,000 - $75,000' },
    { min: 75000, max: 100000, label: '$75,000 - $100,000' },
    { min: 100000, max: 9999999, label: 'Above $100,000' }
  ]
};

// App Config
export const APP_CONFIG = {
  NAME: 'Carside.in',
  TAGLINE: 'Ultimate Automotive Platform',
  EMAIL: 'info@carside.in',
  PHONE: '+91 98765 43210',
  ADDRESS: 'Mumbai, India',
  SOCIAL_LINKS: {
    instagram: 'https://instagram.com/carside_in',
    facebook: 'https://facebook.com/carside.in',
    twitter: 'https://twitter.com/carside_in',
    youtube: 'https://youtube.com/c/carsidein',
    linkedin: 'https://linkedin.com/company/carside-in'
  }
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  FOLLOWING_BRANDS: 'followingBrands',
  COMPARE_CARS: 'compareCars'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#b9d024',
  PRIMARY_DARK: '#000000',
  PRIMARY_LIGHT: '#f9f075',
  DARK: '#090909',
  DARK_LIGHT: '#1E1E20',
  CARD: '#3B3B3D',
  TEXT: '#9E9EA2',
  WHITE: '#ffffff',
  SUCCESS: '#00ff88',
  WARNING: '#ffd700',
  ERROR: '#ff4444'
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^.{6,}$/
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful! Welcome back.',
  REGISTER: 'Registration successful! Please login.',
  BOOKING: 'Booking confirmed! We will contact you soon.',
  BOOKING_CANCELLED: 'Booking cancelled successfully.',
  FOLLOW: 'You are now following this brand.',
  UNFOLLOW: 'You have unfollowed this brand.'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  LIMIT_OPTIONS: [12, 24, 48, 96]
};

// Date Format
export const DATE_FORMAT = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm:ss'
};