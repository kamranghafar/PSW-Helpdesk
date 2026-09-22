const winston = require('winston');
const config = require('../config');

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'psw-helpdesk' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// In test environment, suppress logs unless LOG_LEVEL is explicitly set
if (config.env === 'test' && !process.env.LOG_LEVEL) {
  logger.transports.forEach((t) => (t.silent = true));
}

module.exports = logger;
