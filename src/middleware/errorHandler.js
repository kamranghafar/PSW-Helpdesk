const logger = require('../utils/logger');

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details (exclude sensitive info)
  logger.error({
    message: message,
    statusCode: statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
  });

  // Send error response
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
