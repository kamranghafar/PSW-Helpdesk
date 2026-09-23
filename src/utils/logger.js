const winston = require('winston');
const config = require('../config');

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
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
 * Excludes personally identifiable information from an object
 * Redacts: email, name, message fields
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized copy with PII redacted
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

module.exports = { logger, excludePII };
