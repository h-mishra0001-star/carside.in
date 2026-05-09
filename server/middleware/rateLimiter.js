import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 failed attempts per windowMs
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for booking creation
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each user to 10 bookings per hour
  keyGenerator: (req) => req.userId || req.ip,
  message: {
    success: false,
    message: 'Too many booking attempts, please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API key rate limiter for external services
export const apiKeyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit to 30 requests per minute
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please slow down your requests.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});