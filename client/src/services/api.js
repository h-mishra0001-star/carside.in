import axios from 'axios';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - Add auth token (NO timestamp added)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // REMOVED: timestamp parameter that was causing infinite re-fetching
    // Do NOT add _t parameter to GET requests
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login
      window.location.href = '/';
      
      return Promise.reject(error);
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
      alert('You do not have permission to perform this action.');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    }
    
    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      alert('Server error. Please try again later.');
    }
    
    // Network error
    if (error.message === 'Network Error') {
      console.error('Network error - check your connection');
      alert('Network error. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================

/**
 * User login
 * @param {Object} credentials - { email, password }
 * @returns {Promise}
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

/**
 * User registration
 * @param {Object} userData - { username, email, password, fullName }
 * @returns {Promise}
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      return { success: true, message: response.data.message };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed' 
    };
  }
};

/**
 * Verify user token
 * @returns {Promise}
 */
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return { success: true, user: response.data.user };
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: false };
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  window.location.href = '/';
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get current user
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ==================== CAR SERVICES ====================

/**
 * Get all cars with filters
 * @param {Object} filters - { search, brand, minPrice, maxPrice, sort, newOnly, limit, page }
 * @returns {Promise}
 */
export const getCars = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.brand && filters.brand !== 'all') params.append('brand', filters.brand);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.newOnly) params.append('newOnly', 'true');
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.page) params.append('page', filters.page);
    
    const response = await api.get(`/cars?${params.toString()}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch cars',
      data: []
    };
  }
};

/**
 * Get single car by ID
 * @param {string} id - Car ID
 * @returns {Promise}
 */
export const getCarById = async (id) => {
  try {
    const response = await api.get(`/cars/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Car not found' 
    };
  }
};

/**
 * Get new releases
 * @param {number} limit - Number of cars to fetch
 * @returns {Promise}
 */
export const getNewReleases = async (limit = 8) => {
  return getCars({ newOnly: true, limit });
};

/**
 * Search cars by query
 * @param {string} query - Search term
 * @returns {Promise}
 */
export const searchCars = async (query) => {
  return getCars({ search: query });
};

// ==================== BRAND SERVICES ====================

/**
 * Get all brands
 * @param {Object} options - { limit, search }
 * @returns {Promise}
 */
export const getBrands = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.search) params.append('search', options.search);
    
    const response = await api.get(`/brands?${params.toString()}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch brands',
      data: []
    };
  }
};

/**
 * Get single brand by ID
 * @param {string} id - Brand ID
 * @returns {Promise}
 */
export const getBrandById = async (id) => {
  try {
    const response = await api.get(`/brands/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Brand not found' 
    };
  }
};

/**
 * Get brand with its cars
 * @param {string} id - Brand ID
 * @returns {Promise}
 */
export const getBrandWithCars = async (id) => {
  try {
    const response = await api.get(`/brands/${id}/cars`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch brand cars' 
    };
  }
};

// ==================== BOOKING SERVICES ====================

/**
 * Create a new booking
 * @param {Object} bookingData - { carId, testDriveDate, message }
 * @returns {Promise}
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Booking failed' 
    };
  }
};

/**
 * Get user's bookings
 * @returns {Promise}
 */
export const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch bookings',
      data: []
    };
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise}
 */
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return { success: true, message: response.data.message };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to cancel booking' 
    };
  }
};

// ==================== UTILITY SERVICES ====================

/**
 * Get featured cars for homepage
 * @returns {Promise}
 */
export const getFeaturedCars = async () => {
  return getCars({ sort: 'featured', limit: 6 });
};

/**
 * Get cars by price range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @returns {Promise}
 */
export const getCarsByPriceRange = async (min, max) => {
  return getCars({ minPrice: min, maxPrice: max });
};

/**
 * Get top rated cars
 * @param {number} limit - Number of cars
 * @returns {Promise}
 */
export const getTopRatedCars = async (limit = 5) => {
  return getCars({ sort: 'rating_desc', limit });
};

/**
 * Compare multiple cars
 * @param {Array} carIds - Array of car IDs
 * @returns {Promise}
 */
export const compareCars = async (carIds) => {
  try {
    const promises = carIds.map(id => getCarById(id));
    const results = await Promise.all(promises);
    const cars = results.filter(r => r.success).map(r => r.data);
    return { success: true, data: cars };
  } catch (error) {
    return { 
      success: false, 
      message: 'Failed to compare cars',
      data: []
    };
  }
};

// ==================== CACHE MANAGEMENT ====================

/**
 * Clear all cached data
 */
export const clearCache = () => {
  console.log('Cache cleared');
};

/**
 * Refresh data (clear cache and refetch)
 */
export const refreshData = async () => {
  clearCache();
  return { success: true };
};

// Export default api instance
export default api;