const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * Logs errors and returns appropriate HTTP responses
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Error occurred', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Send error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
