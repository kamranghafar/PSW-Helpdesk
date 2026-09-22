const logger = require('../utils/logger');
const env = require('../config/env');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // Log error
  const logData = {
    message: error.message,
    statusCode: error.statusCode,
    method: req.method,
    path: req.path,
    ip: req.ip,
  };

  if (error.statusCode >= 500) {
    logger.error('Server error', { ...logData, stack: err.stack });
  } else {
    logger.warn('Client error', logData);
  }

  // Send error response
  const response = {
    status: error.status,
    message: error.message,
  };

  // Include stack trace in development
  if (env.isDevelopment()) {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
