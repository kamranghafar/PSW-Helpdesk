const rateLimit = require('express-rate-limit');
const createApp = require('./app');
const config = require('./config');
const { logger } = require('./utils/logger');

// Create rate limiter (disabled in test environment)
const rateLimiter = config.nodeEnv === 'test' 
  ? null 
  : rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: { error: 'Too many requests, please try again later' },
      standardHeaders: true,
      legacyHeaders: false
    });

// Create app with rate limiter
const app = createApp(rateLimiter);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;
