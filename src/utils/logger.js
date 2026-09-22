const winston = require('winston');

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test'
    })
  ]
});

/**
 * Exclude PII from object
 * Redacts email, name, and message fields
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized copy of object
 */
function excludePII(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = { ...obj };
  
  if ('email' in sanitized) {
    sanitized.email = '[REDACTED]';
  }
  if ('name' in sanitized) {
    sanitized.name = '[REDACTED]';
  }
  if ('message' in sanitized) {
    sanitized.message = '[REDACTED]';
  }
  
  return sanitized;
}

logger.excludePII = excludePII;

module.exports = logger;
