const winston = require('winston');
const env = require('../config/env');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: env.logLevel,
  format: logFormat,
  defaultMeta: { service: 'psw-helpdesk' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: env.isDevelopment()
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : logFormat,
    }),
  ],
});

// Add file transports in production
if (env.isProduction()) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Suppress logs in test environment
if (env.isTest()) {
  logger.transports.forEach((transport) => {
    transport.silent = true;
  });
}

module.exports = logger;
