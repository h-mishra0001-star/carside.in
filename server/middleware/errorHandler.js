/**
 * Global Error Handler Middleware
 * Handles all errors and sends appropriate responses
 */

// Custom error classes
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

// Handle duplicate key errors (MongoDB)
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  return new ValidationError(`Duplicate value for ${field}: ${value}. Please use another value.`);
};

// Handle validation errors (Mongoose)
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message
  }));
  return new ValidationError('Validation failed', errors);
};

// Handle cast errors (invalid ObjectId)
const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

// Handle JWT errors
const handleJWTError = () => {
  return new UnauthorizedError('Invalid token. Please login again.');
};

const handleJWTExpiredError = () => {
  return new UnauthorizedError('Token expired. Please login again.');
};

// Development error response
const sendDevError = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
    ...(err.errors && { errors: err.errors })
  });
};

// Production error response
const sendProdError = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  } else {
    // Programming or other unknown error: don't leak details
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

// Main error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Handle specific MongoDB/Mongoose errors
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] ${error.statusCode} - ${error.message}`);

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};

// Async handler wrapper to avoid try-catch blocks
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// 404 Not Found middleware
export const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404);
  next(error);
};