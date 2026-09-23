const winston = require('winston');

/**
 * Winston logger with JSON formatting for structured logging
 */
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
 * Excludes PII fields from an object by replacing email, name, and message with [REDACTED]
 * @param {object} obj - Object potentially containing PII
 * @returns {object} Copy of object with PII fields redacted, or original value if not an object
 */
function excludePII(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const copy = { ...obj };
  
  if ('email' in copy) {
    copy.email = '[REDACTED]';
  }
  if ('name' in copy) {
    copy.name = '[REDACTED]';
  }
  if ('message' in copy) {
    copy.message = '[REDACTED]';
  }

  return copy;
}

logger.excludePII = excludePII;

module.exports = logger;
