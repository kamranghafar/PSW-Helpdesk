const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

/**
 * Removes PII fields from an object by replacing them with "[REDACTED]"
 * @param {Object} obj - The object to sanitize
 * @returns {Object} A new object with PII fields redacted
 */
function excludePII(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = { ...obj };
  const piiFields = ['email', 'name', 'message'];
  
  for (const field of piiFields) {
    if (sanitized.hasOwnProperty(field)) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

module.exports = { logger, excludePII };
