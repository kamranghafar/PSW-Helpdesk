const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error details (excluding PII)
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  
  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;